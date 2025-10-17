/**
 * Premium Access Utilities
 * 
 * Handles checking if a user has premium access via:
 * 1. Individual subscription (subscription_status = 'active')
 * 2. School-based subscription (school has active subscription)
 * 
 * All pricing plans (Standard £399, Large £699, MAT £999) include unlimited teachers.
 */

import { createClient } from '@/lib/supabase-server';

export interface PremiumAccessResult {
  hasPremium: boolean;
  source: 'individual' | 'school' | 'none';
  schoolPlan?: 'standard' | 'large' | 'mat';
  individualStatus?: string;
  schoolStatus?: string;
}

/**
 * Check if a user has premium access (server-side)
 * 
 * @param userId - The user's UUID
 * @returns Premium access details
 */
export async function checkPremiumAccess(userId: string): Promise<PremiumAccessResult> {
  const supabase = await createClient();

  // Get user profile with school info
  const { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('subscription_status, school_code')
    .eq('user_id', userId)
    .single();

  if (profileError || !userProfile) {
    return {
      hasPremium: false,
      source: 'none'
    };
  }

  // Check individual subscription first
  if (userProfile.subscription_status === 'active') {
    return {
      hasPremium: true,
      source: 'individual',
      individualStatus: userProfile.subscription_status
    };
  }

  // Check school-based subscription
  if (userProfile.school_code) {
    const { data: schoolData, error: schoolError } = await supabase
      .from('school_codes')
      .select('subscription_status, subscription_plan')
      .eq('code', userProfile.school_code)
      .single();

    if (!schoolError && schoolData && schoolData.subscription_status === 'active') {
      return {
        hasPremium: true,
        source: 'school',
        schoolPlan: schoolData.subscription_plan as 'standard' | 'large' | 'mat',
        schoolStatus: schoolData.subscription_status
      };
    }
  }

  // No premium access
  return {
    hasPremium: false,
    source: 'none',
    individualStatus: userProfile.subscription_status
  };
}

/**
 * Simple boolean check for premium access (server-side)
 * 
 * @param userId - The user's UUID
 * @returns true if user has premium access
 */
export async function hasPremiumAccess(userId: string): Promise<boolean> {
  const result = await checkPremiumAccess(userId);
  return result.hasPremium;
}

/**
 * Client-side hook for checking premium access
 * Use this in React components
 */
export function usePremiumAccess() {
  // This will be implemented as a React hook
  // For now, components should use the AuthProvider's hasSubscription
  // which we'll update to check school subscriptions too
}

/**
 * Get premium access details for display
 * 
 * @param userId - The user's UUID
 * @returns Human-readable premium access info
 */
export async function getPremiumAccessDisplay(userId: string): Promise<string> {
  const result = await checkPremiumAccess(userId);

  if (!result.hasPremium) {
    return 'Free Plan';
  }

  if (result.source === 'individual') {
    return 'Premium (Individual)';
  }

  if (result.source === 'school') {
    const planNames = {
      standard: 'Standard',
      large: 'Large School',
      mat: 'MAT'
    };
    const planName = result.schoolPlan ? planNames[result.schoolPlan] : 'School';
    return `Premium (${planName} Plan)`;
  }

  return 'Free Plan';
}

/**
 * Update school subscription status
 * Called when Stripe webhook confirms payment
 * 
 * @param schoolCode - The school code
 * @param subscriptionData - Stripe subscription data
 */
export async function updateSchoolSubscription(
  schoolCode: string,
  subscriptionData: {
    status: 'active' | 'cancelled' | 'past_due';
    plan: 'standard' | 'large' | 'mat';
    stripeSubscriptionId: string;
    startDate: string;
    endDate?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('school_codes')
    .update({
      subscription_status: subscriptionData.status,
      subscription_plan: subscriptionData.plan,
      stripe_subscription_id: subscriptionData.stripeSubscriptionId,
      subscription_start_date: subscriptionData.startDate,
      subscription_end_date: subscriptionData.endDate || null,
      updated_at: new Date().toISOString()
    })
    .eq('code', schoolCode);

  if (error) {
    console.error('Error updating school subscription:', error);
    throw error;
  }

  return { success: true };
}

/**
 * Get all teachers in a school
 * Useful for showing who has premium access via school subscription
 * 
 * @param schoolCode - The school code
 * @returns List of teachers with their access details
 */
export async function getSchoolTeachers(schoolCode: string) {
  const supabase = await createClient();

  const { data: members, error } = await supabase
    .from('school_memberships')
    .select(`
      id,
      role,
      status,
      joined_at,
      member_user_id,
      user_profiles!inner (
        user_id,
        email,
        display_name,
        subscription_status
      )
    `)
    .eq('school_code', schoolCode)
    .eq('status', 'active');

  if (error) {
    console.error('Error fetching school teachers:', error);
    return [];
  }

  return members || [];
}

