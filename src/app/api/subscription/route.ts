import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

// Subscription plans configuration
const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    duration: 'lifetime',
    features: [
      '5 songs per month',
      'Basic practice tools',
      'Standard quality audio',
      'Community access'
    ],
    limits: {
      songsPerMonth: 5,
      practiceMinutesPerDay: 15,
      audioQuality: 'standard',
      aiGenerationsPerMonth: 3
    }
  },
  monthly: {
    id: 'monthly',
    name: 'Premium Monthly',
    price: 499,
    duration: 'monthly',
    features: [
      'Unlimited songs',
      'Advanced practice tools',
      'HD quality audio',
      'Priority AI generation',
      'Commercial licensing',
      'Advanced analytics',
      'Priority support'
    ],
    limits: {
      songsPerMonth: -1, // unlimited
      practiceMinutesPerDay: -1,
      audioQuality: 'hd',
      aiGenerationsPerMonth: -1
    }
  },
  yearly: {
    id: 'yearly',
    name: 'Premium Yearly',
    price: 4999,
    duration: 'yearly',
    features: [
      'Everything in Premium Monthly',
      '2 months free',
      'White-label options',
      'API access',
      'Custom models',
      'Dedicated support'
    ],
    limits: {
      songsPerMonth: -1,
      practiceMinutesPerDay: -1,
      audioQuality: 'ultra',
      aiGenerationsPerMonth: -1
    }
  }
};

// GET user's current subscription
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get user's current subscription
    const subscription = await db.subscription.findFirst({
      where: {
        userId,
        status: 'active',
        OR: [
          { endDate: { gte: new Date() } },
          { plan: 'free' }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    const plan = subscription ? SUBSCRIPTION_PLANS[subscription.plan as keyof typeof SUBSCRIPTION_PLANS] : SUBSCRIPTION_PLANS.free;

    return NextResponse.json({
      subscription,
      plan,
      plans: SUBSCRIPTION_PLANS
    });

  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create or update subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, plan, paymentDetails } = body;

    if (!userId || !plan) {
      return NextResponse.json({ error: 'User ID and plan required' }, { status: 400 });
    }

    const selectedPlan = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS];
    if (!selectedPlan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Calculate end date based on plan duration
    let endDate = null;
    if (plan === 'monthly') {
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan === 'yearly') {
      endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Create new subscription
    const subscription = await db.subscription.create({
      data: {
        userId,
        plan,
        status: plan === 'free' ? 'active' : 'pending',
        startDate: new Date(),
        endDate,
        amount: selectedPlan.price,
        currency: 'INR',
        razorpayOrderId: paymentDetails?.orderId,
        razorpayPaymentId: paymentDetails?.paymentId,
        razorpaySignature: paymentDetails?.signature
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
      plan: selectedPlan
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update subscription status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId, status, paymentDetails } = body;

    if (!subscriptionId || !status) {
      return NextResponse.json({ error: 'Subscription ID and status required' }, { status: 400 });
    }

    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (paymentDetails) {
      updateData.razorpayPaymentId = paymentDetails.paymentId;
      updateData.razorpaySignature = paymentDetails.signature;
    }

    // Update subscription
    const subscription = await db.subscription.update({
      where: { id: subscriptionId },
      data: updateData
    });

    // Update user status if subscription is active
    if (status === 'active') {
      await db.user.update({
        where: { id: subscription.userId },
        data: {
          subscription: subscription.plan,
          isPremium: subscription.plan !== 'free'
        }
      });
    }

    return NextResponse.json({
      success: true,
      subscription
    });

  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE cancel subscription
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscriptionId');

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID required' }, { status: 400 });
    }

    const subscription = await db.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'cancelled',
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      subscription
    });

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}