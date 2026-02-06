'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Calendar, Music, Zap, TrendingUp, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionData {
  subscription: {
    id: string;
    plan: string;
    status: string;
    startDate: string;
    endDate?: string;
    amount: number;
  };
  plan: {
    id: string;
    name: string;
    price: number;
    features: string[];
    limits: {
      songsPerMonth: number;
      practiceMinutesPerDay: number;
      audioQuality: string;
      aiGenerationsPerMonth: number;
    };
  };
}

const SubscriptionManager = () => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('/api/subscription?userId=demo-user');
      const data = await response.json();
      
      if (data.subscription && data.plan) {
        setSubscriptionData(data);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscriptionData?.subscription.id) return;

    try {
      const response = await fetch(`/api/subscription?subscriptionId=${subscriptionData.subscription.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Subscription Cancelled",
          description: "Your subscription has been cancelled successfully",
        });
        fetchSubscriptionData();
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive"
      });
    }
  };

  const getUsageStats = () => {
    // Mock usage data - in production, fetch from database
    return {
      songsUsed: 3,
      songsLimit: subscriptionData?.plan.limits.songsPerMonth || 5,
      practiceMinutes: 45,
      practiceLimit: subscriptionData?.plan.limits.practiceMinutesPerDay || 15,
      aiGenerations: 2,
      aiLimit: subscriptionData?.plan.limits.aiGenerationsPerMonth || 3
    };
  };

  const getDaysRemaining = () => {
    if (!subscriptionData?.subscription.endDate) return null;
    
    const endDate = new Date(subscriptionData.subscription.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const usage = getUsageStats();
  const daysRemaining = getDaysRemaining();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="secondary">
            <Crown className="w-4 h-4 mr-1" />
            Subscription Management
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            My Subscription
          </h1>
          <p className="text-xl text-gray-600">
            Manage your subscription and track your usage
          </p>
        </div>

        {subscriptionData ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Current Plan Card */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        {subscriptionData.plan.name}
                        {subscriptionData.plan.id !== 'free' && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                            Active
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {subscriptionData.plan.id === 'free' 
                          ? 'Free forever with basic features'
                          : `₹${subscriptionData.plan.price}/${subscriptionData.plan.id === 'monthly' ? 'month' : 'year'}`
                        }
                      </CardDescription>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                      {subscriptionData.plan.id === 'free' && <Users className="w-8 h-8 text-gray-600" />}
                      {subscriptionData.plan.id === 'monthly' && <Zap className="w-8 h-8 text-purple-600" />}
                      {subscriptionData.plan.id === 'yearly' && <Crown className="w-8 h-8 text-yellow-600" />}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Subscription Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p className="font-medium">
                          {new Date(subscriptionData.subscription.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {subscriptionData.subscription.endDate && (
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="text-sm text-gray-500">Days Remaining</p>
                          <p className="font-medium">{daysRemaining} days</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Usage Statistics */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Usage Statistics</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-2">
                            <Music className="w-4 h-4" />
                            Songs This Month
                          </span>
                          <span>{usage.songsUsed}/{usage.songsLimit === -1 ? '∞' : usage.songsLimit}</span>
                        </div>
                        <Progress 
                          value={usage.songsLimit === -1 ? 50 : (usage.songsUsed / usage.songsLimit) * 100} 
                          className="h-2" 
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Practice Minutes Today
                          </span>
                          <span>{usage.practiceMinutes}/{usage.practiceLimit === -1 ? '∞' : usage.practiceLimit}</span>
                        </div>
                        <Progress 
                          value={usage.practiceLimit === -1 ? 30 : (usage.practiceMinutes / usage.practiceLimit) * 100} 
                          className="h-2" 
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-2">
                            <Crown className="w-4 h-4" />
                            AI Generations This Month
                          </span>
                          <span>{usage.aiGenerations}/{usage.aiLimit === -1 ? '∞' : usage.aiLimit}</span>
                        </div>
                        <Progress 
                          value={usage.aiLimit === -1 ? 40 : (usage.aiGenerations / usage.aiLimit) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Plan Features */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Plan Features</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {subscriptionData.plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    {subscriptionData.plan.id !== 'free' && (
                      <Button 
                        variant="outline" 
                        onClick={handleCancelSubscription}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Cancel Subscription
                      </Button>
                    )}
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => window.location.href = '/pricing'}
                    >
                      {subscriptionData.plan.id === 'free' ? 'Upgrade Plan' : 'Change Plan'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-3xl font-bold text-purple-600">
                      {usage.songsUsed}
                    </p>
                    <p className="text-sm text-gray-600">Songs Created</p>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <p className="text-3xl font-bold text-pink-600">
                      {usage.practiceMinutes}
                    </p>
                    <p className="text-sm text-gray-600">Minutes Practiced</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">
                      {usage.aiGenerations}
                    </p>
                    <p className="text-sm text-gray-600">AI Generations</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Audio Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Badge 
                      className={`text-lg px-4 py-2 ${
                        subscriptionData.plan.limits.audioQuality === 'ultra' 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                          : subscriptionData.plan.limits.audioQuality === 'hd'
                          ? 'bg-gradient-to-r from-blue-400 to-purple-500'
                          : 'bg-gray-500'
                      }`}
                    >
                      {subscriptionData.plan.limits.audioQuality.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">
                      {subscriptionData.plan.limits.audioQuality === 'ultra' && 'Studio-quality audio'}
                      {subscriptionData.plan.limits.audioQuality === 'hd' && 'High-definition audio'}
                      {subscriptionData.plan.limits.audioQuality === 'standard' && 'Standard quality audio'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Crown className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Active Subscription</h3>
              <p className="text-gray-600 mb-6">Get started with our free plan or upgrade to unlock premium features</p>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => window.location.href = '/pricing'}
              >
                View Pricing Plans
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SubscriptionManager;