'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Star, Crown, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  limits: {
    songsPerMonth: number;
    practiceMinutesPerDay: number;
    audioQuality: string;
    aiGenerationsPerMonth: number;
  };
  popular?: boolean;
}

const PricingPlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/subscription?userId=demo-user');
      const data = await response.json();
      
      if (data.plans) {
        const plansArray = Object.values(data.plans) as Plan[];
        // Add popular badge to monthly plan
        plansArray.forEach((plan, index) => {
          if (plan.id === 'monthly') {
            plan.popular = true;
          }
        });
        setPlans(plansArray);
      }
      
      if (data.subscription?.plan) {
        setCurrentPlan(data.subscription.plan);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error",
        description: "Failed to load pricing plans",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      const plan = plans.find(p => p.id === planId);
      if (!plan) return;

      if (plan.price === 0) {
        // Free plan - no payment required
        const response = await fetch('/api/subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'demo-user',
            plan: planId
          })
        });

        if (response.ok) {
          setCurrentPlan(planId);
          toast({
            title: "Success!",
            description: `You are now on the ${plan.name}`,
          });
        }
        return;
      }

      // Paid plans - create payment order
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: plan.price,
          currency: 'INR',
          userId: 'demo-user',
          plan: planId
        })
      });

      const paymentData = await paymentResponse.json();
      
      if (paymentData.success) {
        // Initialize Razorpay payment
        const options = {
          key: paymentData.keyId,
          amount: paymentData.order.amount,
          currency: paymentData.order.currency,
          name: 'AI Music Studio',
          description: `${plan.name} Subscription`,
          order_id: paymentData.order.id,
          handler: async function (response: any) {
            // Verify payment and activate subscription
            const verifyResponse = await fetch('/api/payments', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                userId: 'demo-user',
                plan: planId
              })
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              setCurrentPlan(planId);
              toast({
                title: "Payment Successful!",
                description: `You are now subscribed to ${plan.name}`,
              });
            } else {
              toast({
                title: "Payment Failed",
                description: "There was an issue verifying your payment",
                variant: "destructive"
              });
            }
          },
          prefill: {
            name: 'Demo User',
            email: 'demo@example.com'
          },
          theme: {
            color: '#8b5cf6'
          }
        };

        // Initialize Razorpay (in production, load Razorpay SDK)
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: "Error",
        description: "Failed to process subscription",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="secondary">
            <Crown className="w-4 h-4 mr-1" />
            Pricing Plans
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock your full musical potential with our flexible subscription plans
          </p>
        </div>

        {/* Current Plan Banner */}
        {currentPlan && (
          <div className="mb-8 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg text-center">
            <p className="text-lg font-semibold text-purple-800">
              Current Plan: <span className="capitalize">{currentPlan}</span>
            </p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
              } ${currentPlan === plan.id ? 'ring-2 ring-green-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-bl-lg">
                  <Badge className="bg-transparent text-white border-none">
                    <Star className="w-4 h-4 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}
              
              {currentPlan === plan.id && (
                <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-1">
                  <Badge className="bg-transparent text-white border-none">
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  {plan.id === 'free' && <X className="w-8 h-8 text-gray-600" />}
                  {plan.id === 'monthly' && <Zap className="w-8 h-8 text-purple-600" />}
                  {plan.id === 'yearly' && <Crown className="w-8 h-8 text-yellow-600" />}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-4xl font-bold text-gray-900">
                  ₹{plan.price}
                  <span className="text-lg text-gray-500 font-normal">
                    {plan.id === 'free' ? '' : plan.id === 'monthly' ? '/month' : '/year'}
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </CardContent>

              <CardFooter>
                <Button 
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={currentPlan === plan.id}
                  className={`w-full py-6 text-lg font-semibold transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                      : currentPlan === plan.id
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {currentPlan === plan.id ? 'Current Plan' : plan.price === 0 ? 'Get Started' : 'Subscribe Now'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Feature</th>
                  <th className="text-center p-4">Free</th>
                  <th className="text-center p-4">Premium Monthly</th>
                  <th className="text-center p-4">Premium Yearly</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">Songs per month</td>
                  <td className="text-center p-4">5</td>
                  <td className="text-center p-4">
                    <Badge className="bg-green-100 text-green-800">Unlimited</Badge>
                  </td>
                  <td className="text-center p-4">
                    <Badge className="bg-green-100 text-green-800">Unlimited</Badge>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">Practice minutes per day</td>
                  <td className="text-center p-4">15</td>
                  <td className="text-center p-4">
                    <Badge className="bg-green-100 text-green-800">Unlimited</Badge>
                  </td>
                  <td className="text-center p-4">
                    <Badge className="bg-green-100 text-green-800">Unlimited</Badge>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">Audio quality</td>
                  <td className="text-center p-4">Standard</td>
                  <td className="text-center p-4">HD</td>
                  <td className="text-center p-4">
                    <Badge className="bg-purple-100 text-purple-800">Ultra HD</Badge>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">AI generations per month</td>
                  <td className="text-center p-4">3</td>
                  <td className="text-center p-4">
                    <Badge className="bg-green-100 text-green-800">Unlimited</Badge>
                  </td>
                  <td className="text-center p-4">
                    <Badge className="bg-green-100 text-green-800">Unlimited</Badge>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-medium">Commercial licensing</td>
                  <td className="text-center p-4">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center p-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center p-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change my plan anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Our free plan includes basic features so you can try the platform before upgrading.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">We accept all major credit cards, debit cards, and UPI payments through Razorpay.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel my subscription?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Yes, you can cancel anytime. You'll continue to have access until the end of your billing period.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;