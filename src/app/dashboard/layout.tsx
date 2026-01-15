import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import DashboardLayoutClient from './DashboardLayoutClient';

// Server component: Subscription check happens ONCE when entering dashboard
// This is cached by Next.js for subsequent navigation within dashboard
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // If no user, redirect to login (backup - middleware should catch this)
  if (authError || !user) {
    redirect('/auth/login');
  }

  // Check if admin
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@languagegems.com";
  const devAdminEmail = "danieletienne89@gmail.com";
  const isAdmin = user.email === adminEmail || user.email === devAdminEmail;

  // Admin bypass - skip subscription check
  if (isAdmin) {
    return (
      <DashboardLayoutClient hasSubscription={true} isAdmin={true}>
        {children}
      </DashboardLayoutClient>
    );
  }

  // Get user profile with subscription information
  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .select(`
      role,
      subscription_status,
      is_school_owner,
      school_owner_id,
      subscription_expires_at,
      trial_ends_at
    `)
    .eq('user_id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching user profile in layout:', profileError);
    redirect('/account');
  }

  // Helper function to check if subscription is active
  const isSubscriptionActive = (data: any): boolean => {
    const now = new Date();
    const status = data.subscription_status;

    if (status === 'active' || status === 'trialing') {
      if (data.subscription_expires_at) {
        const expiresAt = new Date(data.subscription_expires_at);
        return expiresAt > now;
      }

      if (status === 'trialing' && data.trial_ends_at) {
        const trialEnds = new Date(data.trial_ends_at);
        return trialEnds > now;
      }

      return true;
    }

    return false;
  };

  // Check subscription status
  let hasActiveSubscription = false;

  // If user is a school owner, check their own subscription
  if (profileData.is_school_owner) {
    hasActiveSubscription = isSubscriptionActive(profileData);
  }
  // If user has a school owner, check the owner's subscription
  else if (profileData.school_owner_id) {
    const { data: ownerData, error: ownerError } = await supabase
      .from('user_profiles')
      .select('subscription_status, subscription_expires_at, trial_ends_at')
      .eq('user_id', profileData.school_owner_id)
      .single();

    if (!ownerError && ownerData) {
      hasActiveSubscription = isSubscriptionActive(ownerData);
    }
  }
  // Individual teacher - check their own subscription
  else {
    hasActiveSubscription = isSubscriptionActive(profileData);
  }

  // Only enforce subscription check for teachers on full dashboard
  // (students and learners have different access rules)
  const role = profileData?.role || user.user_metadata?.role;

  if (role === 'teacher' && !hasActiveSubscription) {
    // Redirect to account page for subscription upgrade
    redirect('/account');
  }

  return (
    <DashboardLayoutClient hasSubscription={hasActiveSubscription} isAdmin={false}>
      {children}
    </DashboardLayoutClient>
  );
}