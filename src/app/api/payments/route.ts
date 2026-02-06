import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

// Razorpay configuration (should be in environment variables)
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKeyId';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'YourSecretKey';

// Create Razorpay order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', userId, plan } = body;

    if (!amount || !userId || !plan) {
      return NextResponse.json({ 
        error: 'Amount, user ID, and plan are required' 
      }, { status: 400 });
    }

    // Create order in Razorpay
    const orderData = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${userId}_${Date.now()}`,
      notes: {
        userId,
        plan
      }
    };

    // In production, make actual API call to Razorpay
    // For now, simulate order creation
    const mockOrder = {
      id: `order_${Date.now()}`,
      entity: 'order',
      amount: orderData.amount,
      amount_paid: 0,
      amount_due: orderData.amount,
      currency: orderData.currency,
      receipt: orderData.receipt,
      status: 'created',
      notes: orderData.notes,
      created_at: Math.floor(Date.now() / 1000)
    };

    // Store payment record
    const payment = await db.payment.create({
      data: {
        userId,
        amount,
        currency,
        status: 'pending',
        type: 'subscription',
        razorpayOrderId: mockOrder.id,
        metadata: {
          plan,
          razorpayKeyId: RAZORPAY_KEY_ID
        }
      }
    });

    return NextResponse.json({
      success: true,
      order: mockOrder,
      payment,
      keyId: RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json({ 
      error: 'Failed to create payment order' 
    }, { status: 500 });
  }
}

// Verify payment and update subscription
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      razorpayOrderId, 
      razorpayPaymentId, 
      razorpaySignature,
      userId,
      plan 
    } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ 
        error: 'All payment details are required' 
      }, { status: 400 });
    }

    // Verify signature (in production, use actual Razorpay signature verification)
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const isSignatureValid = generatedSignature === razorpaySignature;

    if (!isSignatureValid) {
      return NextResponse.json({ 
        error: 'Invalid payment signature' 
      }, { status: 400 });
    }

    // Update payment status
    const payment = await db.payment.updateMany({
      where: {
        razorpayOrderId,
        userId
      },
      data: {
        status: 'completed',
        razorpayPaymentId,
        razorpaySignature
      }
    });

    // Create or update subscription
    const endDate = new Date();
    if (plan === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscription = await db.subscription.create({
      data: {
        userId,
        plan,
        status: 'active',
        startDate: new Date(),
        endDate: plan === 'free' ? null : endDate,
        amount: plan === 'monthly' ? 499 : plan === 'yearly' ? 4999 : 0,
        currency: 'INR',
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      }
    });

    // Update user's subscription status
    await db.user.update({
      where: { id: userId },
      data: {
        subscription: plan,
        isPremium: plan !== 'free'
      }
    });

    return NextResponse.json({
      success: true,
      subscription,
      payment
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ 
      error: 'Failed to verify payment' 
    }, { status: 500 });
  }
}

// Get payment status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');
    const orderId = searchParams.get('orderId');

    let payment;
    if (paymentId) {
      payment = await db.payment.findUnique({
        where: { id: paymentId }
      });
    } else if (orderId) {
      payment = await db.payment.findFirst({
        where: { razorpayOrderId: orderId }
      });
    } else {
      return NextResponse.json({ 
        error: 'Payment ID or Order ID required' 
      }, { status: 400 });
    }

    if (!payment) {
      return NextResponse.json({ 
        error: 'Payment not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      payment
    });

  } catch (error) {
    console.error('Error fetching payment:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch payment' 
    }, { status: 500 });
  }
}