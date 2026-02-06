import { db } from '@/lib/db';

// Subscription feature checking utilities
export class SubscriptionGuard {
  // Check if user can create more songs
  static async canCreateSong(userId: string): Promise<{ canCreate: boolean; reason?: string; remaining?: number }> {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        include: {
          subscriptions: {
            where: {
              status: 'active',
              OR: [
                { endDate: { gte: new Date() } },
                { plan: 'free' }
              ]
            },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });

      if (!user) {
        return { canCreate: false, reason: 'User not found' };
      }

      const subscription = user.subscriptions[0];
      const plan = subscription?.plan || 'free';

      // Get plan limits
      const limits = this.getPlanLimits(plan);
      
      if (limits.songsPerMonth === -1) {
        // Unlimited songs
        return { canCreate: true };
      }

      // Count songs created this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const songsThisMonth = await db.song.count({
        where: {
          authorId: userId,
          createdAt: { gte: startOfMonth }
        }
      });

      const remaining = limits.songsPerMonth - songsThisMonth;
      
      if (remaining <= 0) {
        return { 
          canCreate: false, 
          reason: `Monthly song limit reached (${limits.songsPerMonth} songs)`,
          remaining: 0
        };
      }

      return { canCreate: true, remaining };
    } catch (error) {
      console.error('Error checking song creation limit:', error);
      return { canCreate: false, reason: 'Error checking subscription' };
    }
  }

  // Check if user can use AI generation
  static async canUseAIGeneration(userId: string): Promise<{ canGenerate: boolean; reason?: string; remaining?: number }> {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        include: {
          subscriptions: {
            where: {
              status: 'active',
              OR: [
                { endDate: { gte: new Date() } },
                { plan: 'free' }
              ]
            },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });

      if (!user) {
        return { canGenerate: false, reason: 'User not found' };
      }

      const subscription = user.subscriptions[0];
      const plan = subscription?.plan || 'free';

      // Get plan limits
      const limits = this.getPlanLimits(plan);
      
      if (limits.aiGenerationsPerMonth === -1) {
        // Unlimited AI generations
        return { canGenerate: true };
      }

      // Count AI generations this month (mock - would track actual AI usage)
      const aiGenerationsThisMonth = 2; // Mock data
      
      const remaining = limits.aiGenerationsPerMonth - aiGenerationsThisMonth;
      
      if (remaining <= 0) {
        return { 
          canGenerate: false, 
          reason: `Monthly AI generation limit reached (${limits.aiGenerationsPerMonth} generations)`,
          remaining: 0
        };
      }

      return { canGenerate: true, remaining };
    } catch (error) {
      console.error('Error checking AI generation limit:', error);
      return { canGenerate: false, reason: 'Error checking subscription' };
    }
  }

  // Check if user can access premium features
  static async canAccessPremium(userId: string): Promise<boolean> {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        include: {
          subscriptions: {
            where: {
              status: 'active',
              plan: { in: ['monthly', 'yearly'] },
              OR: [
                { endDate: { gte: new Date() } },
                { plan: { in: ['monthly', 'yearly'] } }
              ]
            },
            take: 1
          }
        }
      });

      return user?.subscriptions.length > 0 || false;
    } catch (error) {
      console.error('Error checking premium access:', error);
      return false;
    }
  }

  // Check if user can practice for more minutes today
  static async canPracticeMore(userId: string): Promise<{ canPractice: boolean; reason?: string; remainingMinutes?: number }> {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        include: {
          subscriptions: {
            where: {
              status: 'active',
              OR: [
                { endDate: { gte: new Date() } },
                { plan: 'free' }
              ]
            },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });

      if (!user) {
        return { canPractice: false, reason: 'User not found' };
      }

      const subscription = user.subscriptions[0];
      const plan = subscription?.plan || 'free';

      // Get plan limits
      const limits = this.getPlanLimits(plan);
      
      if (limits.practiceMinutesPerDay === -1) {
        // Unlimited practice
        return { canPractice: true };
      }

      // Calculate practice minutes today
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const todaySessions = await db.practiceSession.findMany({
        where: {
          userId,
          createdAt: { gte: startOfDay }
        }
      });

      const totalMinutesToday = todaySessions.reduce((total, session) => total + Math.floor(session.duration / 60), 0);
      const remainingMinutes = limits.practiceMinutesPerDay - totalMinutesToday;
      
      if (remainingMinutes <= 0) {
        return { 
          canPractice: false, 
          reason: `Daily practice limit reached (${limits.practiceMinutesPerDay} minutes)`,
          remainingMinutes: 0
        };
      }

      return { canPractice: true, remainingMinutes };
    } catch (error) {
      console.error('Error checking practice limit:', error);
      return { canPractice: false, reason: 'Error checking subscription' };
    }
  }

  // Get plan limits
  private static getPlanLimits(plan: string) {
    const limits = {
      free: {
        songsPerMonth: 5,
        practiceMinutesPerDay: 15,
        audioQuality: 'standard',
        aiGenerationsPerMonth: 3
      },
      monthly: {
        songsPerMonth: -1,
        practiceMinutesPerDay: -1,
        audioQuality: 'hd',
        aiGenerationsPerMonth: -1
      },
      yearly: {
        songsPerMonth: -1,
        practiceMinutesPerDay: -1,
        audioQuality: 'ultra',
        aiGenerationsPerMonth: -1
      }
    };

    return limits[plan as keyof typeof limits] || limits.free;
  }

  // Get user's current plan
  static async getUserPlan(userId: string) {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        include: {
          subscriptions: {
            where: {
              status: 'active',
              OR: [
                { endDate: { gte: new Date() } },
                { plan: 'free' }
              ]
            },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });

      const subscription = user?.subscriptions[0];
      return {
        plan: subscription?.plan || 'free',
        isPremium: subscription?.plan !== 'free',
        subscription
      };
    } catch (error) {
      console.error('Error getting user plan:', error);
      return { plan: 'free', isPremium: false };
    }
  }
}

// React hook for subscription checks
export function useSubscriptionGuard(userId: string) {
  const [loading, setLoading] = useState(true);
  const [canCreateSong, setCanCreateSong] = useState(true);
  const [canUseAI, setCanUseAI] = useState(true);
  const [canPractice, setCanPractice] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [plan, setPlan] = useState('free');

  useEffect(() => {
    checkSubscription();
  }, [userId]);

  const checkSubscription = async () => {
    setLoading(true);
    try {
      const [songCheck, aiCheck, practiceCheck, planData] = await Promise.all([
        SubscriptionGuard.canCreateSong(userId),
        SubscriptionGuard.canUseAIGeneration(userId),
        SubscriptionGuard.canPracticeMore(userId),
        SubscriptionGuard.getUserPlan(userId)
      ]);

      setCanCreateSong(songCheck.canCreate);
      setCanUseAI(aiCheck.canGenerate);
      setCanPractice(practiceCheck.canPractice);
      setIsPremium(planData.isPremium);
      setPlan(planData.plan);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    canCreateSong,
    canUseAI,
    canPractice,
    isPremium,
    plan,
    refreshSubscription: checkSubscription
  };
}