// Enhanced user access hook that properly determines user type and enforces restrictions
import { useAuth } from '@/components/auth/AuthProvider';
import { useDemoAuth } from '@/components/auth/DemoAuthProvider';
import { useSupabase } from '@/hooks/useSupabase';
import { useState, useEffect } from 'react';
import { 
  UserType, 
  AccessControlConfig, 
  getAccessConfig, 
  canAccessFeature, 
  getDailyGameLimit,
  getUpgradeMessage 
} from '@/lib/access-control';

interface UserAccessData {
  userType: UserType;
  canPlayGames: boolean;
  gamesPlayedToday: number;
  dailyLimit: number;
  gamesRemaining: number;
  recordGamePlayed: () => void;
  upgradeMessage: string;
  canAccessFeature: (feature: keyof AccessControlConfig) => boolean;
  subscriptionStatus: string | null;
  subscriptionTier: string | null;
  isLoading: boolean;
}

export const useUserAccess = (): UserAccessData => {
  const { user, isAdmin } = useAuth();
  const { isDemo } = useDemoAuth();
  const { supabase } = useSupabase();

  const [userType, setUserType] = useState<UserType>('demo');
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('🔐 [useUserAccess] Hook called:', { user: !!user, isDemo, isAdmin });

  useEffect(() => {
    determineUserType();
  }, [user, isDemo, isAdmin]);

  const determineUserType = async () => {
    try {
      setIsLoading(true);

      // Admin override
      if (isAdmin) {
        setUserType('admin');
        setIsLoading(false);
        return;
      }

      // Demo user
      if (isDemo || !user) {
        setUserType('demo');
        setIsLoading(false);
        return;
      }

      // Authenticated user - check their profile and subscription
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select(`
          role,
          subscription_status,
          subscription_type,
          subscription_expires_at,
          trial_ends_at,
          school_owner_id,
          is_school_owner
        `)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUserType('demo');
        setIsLoading(false);
        return;
      }

      const role = profile?.role || 'student';
      setSubscriptionStatus(profile?.subscription_status);
      setSubscriptionTier(profile?.subscription_type);

      // Determine user type based on role and subscription
      if (role === 'learner') {
        // B2C Learner
        const hasActiveSubscription = checkSubscriptionActive(profile);
        setUserType(hasActiveSubscription ? 'learner_pro' : 'learner_free');
      } else if (role === 'teacher') {
        // B2B Teacher - check subscription tier
        const hasActiveSubscription = await checkTeacherSubscription(profile);

        if (!hasActiveSubscription) {
          // No active subscription - treat as demo for teachers
          console.log('Teacher without subscription, treating as demo:', user.email);
          setUserType('demo');
        } else {
          // Determine teacher tier based on subscription
          const tier = profile?.subscription_type || 'basic';
          console.log('Teacher with subscription tier:', tier);
          switch (tier) {
            case 'standard':
              setUserType('teacher_standard');
              break;
            case 'large':
            case 'large_school':
              setUserType('teacher_large');
              break;
            default:
              setUserType('teacher_basic');
          }
        }
      } else {
        // Student or other role - check if they have access through school
        console.log('Student or other role, treating as demo for now');
        setUserType('demo');
      }

    } catch (error) {
      console.error('Error determining user type:', error);
      setUserType('demo');
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscriptionActive = (profile: any): boolean => {
    if (!profile) return false;

    const now = new Date();
    const status = profile.subscription_status;

    // Explicitly check for free/no subscription
    if (status === 'free' || status === 'cancelled' || status === 'expired' || !status) {
      return false;
    }

    if (status === 'active' || status === 'trialing') {
      if (profile.subscription_expires_at) {
        const expiresAt = new Date(profile.subscription_expires_at);
        return expiresAt > now;
      }

      if (status === 'trialing' && profile.trial_ends_at) {
        const trialEnds = new Date(profile.trial_ends_at);
        return trialEnds > now;
      }

      return true;
    }

    return false;
  };

  const checkTeacherSubscription = async (profile: any): Promise<boolean> => {
    // If user is a school owner, check their own subscription
    if (profile.is_school_owner) {
      return checkSubscriptionActive(profile);
    }

    // If user has a school owner, check the owner's subscription
    if (profile.school_owner_id) {
      const { data: ownerData, error } = await supabase
        .from('user_profiles')
        .select('subscription_status, subscription_expires_at, trial_ends_at')
        .eq('user_id', profile.school_owner_id)
        .single();

      if (error || !ownerData) {
        return false;
      }

      return checkSubscriptionActive(ownerData);
    }

    // Individual teacher - check their own subscription
    return checkSubscriptionActive(profile);
  };

  const accessConfig = getAccessConfig(userType);

  return {
    userType,
    accessConfig,
    isLoading,
    canAccess: (feature: keyof AccessControlConfig) => canAccessFeature(userType, feature),
    canAccessFeature: (feature: keyof AccessControlConfig) => canAccessFeature(userType, feature),
    getDailyLimit: () => getDailyGameLimit(userType),
    getUpgradeMsg: (feature: string) => getUpgradeMessage(userType, feature),
    subscriptionStatus,
    subscriptionTier
  };
};

// Helper hook for specific feature checks
export const useFeatureAccess = (feature: keyof AccessControlConfig) => {
  const { canAccess, getUpgradeMsg, userType } = useUserAccess();
  
  return {
    hasAccess: canAccess(feature),
    upgradeMessage: getUpgradeMsg(feature),
    userType
  };
};

// Helper hook for game access with daily limits
export const useGameAccess = () => {
  const { canAccess, getDailyLimit, userType, getUpgradeMsg } = useUserAccess();
  const [gamesPlayedToday, setGamesPlayedToday] = useState(0);
  
  useEffect(() => {
    // Load games played today from localStorage
    const today = new Date().toDateString();
    const stored = localStorage.getItem(`games_played_${today}`);
    setGamesPlayedToday(stored ? parseInt(stored) : 0);
  }, []);

  const recordGamePlayed = () => {
    const today = new Date().toDateString();
    const newCount = gamesPlayedToday + 1;
    setGamesPlayedToday(newCount);
    localStorage.setItem(`games_played_${today}`, newCount.toString());
  };

  const dailyLimit = getDailyLimit();
  const hasGamesRemaining = dailyLimit === -1 || gamesPlayedToday < dailyLimit;
  
  return {
    canPlayGames: canAccess('gamesAccess') && hasGamesRemaining,
    gamesPlayedToday,
    dailyLimit,
    gamesRemaining: dailyLimit === -1 ? -1 : Math.max(0, dailyLimit - gamesPlayedToday),
    recordGamePlayed,
    upgradeMessage: getUpgradeMsg('games'),
    userType,
    canAccessFeature: canAccess,
    subscriptionStatus,
    subscriptionTier,
    isLoading
  };
};
