import { NextRequest, NextResponse } from 'next/server';
import { createServerSideClient } from '@/utils/supabase/client';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const plan = searchParams.get('plan') || 'standard';

    // Get the current user using proper server-side client
    const cookieStore = await cookies();
    const supabase = createServerSideClient(cookieStore);

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      // User not logged in - redirect to signup
      return NextResponse.redirect(new URL('/auth/signup?error=not-authenticated', request.url));
    }

    // Check if user already has trial or subscription
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('trial_status, trial_ends_at, subscription_status')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      // Profile might not exist yet - create it
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          trial_status: 'active',
          trial_starts_at: new Date().toISOString(),
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          subscription_type: plan,
          subscription_status: 'trialing'
        });

      if (insertError) {
        console.error('Error creating profile with trial:', insertError);
        return NextResponse.redirect(new URL('/account?error=profile-creation-failed', request.url));
      }

      return NextResponse.redirect(new URL('/account?message=trial-started', request.url));
    }

    if (profile?.trial_status === 'active') {
      // Already on trial
      return NextResponse.redirect(new URL('/account?message=trial-already-active', request.url));
    }

    if (profile?.subscription_status === 'active') {
      // Already has subscription
      return NextResponse.redirect(new URL('/account?message=already-subscribed', request.url));
    }

    // Start 14-day trial
    const trialStartsAt = new Date();
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        trial_status: 'active',
        trial_starts_at: trialStartsAt.toISOString(),
        trial_ends_at: trialEndsAt.toISOString(),
        subscription_type: plan,
        subscription_status: 'trialing'
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error starting trial:', updateError);
      return NextResponse.redirect(new URL('/account?error=trial-start-failed', request.url));
    }

    // Success - redirect to dashboard with success message
    return NextResponse.redirect(new URL('/account?message=trial-started', request.url));

  } catch (error) {
    console.error('Trial start error:', error);
    return NextResponse.redirect(new URL('/account?error=trial-error', request.url));
  }
}
