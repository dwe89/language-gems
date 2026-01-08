import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from './utils/supabase/middleware';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Fast path for static assets and API routes
  if (path.startsWith('/_next') || path.startsWith('/api') || path.startsWith('/favicon') ||
      path.startsWith('/audio/') || path.startsWith('/images/') || path.startsWith('/public/')) {
    return NextResponse.next();
  }

  // Check if this is a protected route that needs auth
  const isProtectedRoute = (path.startsWith('/dashboard') && path !== '/dashboard/preview') || 
                          path.startsWith('/activities');

  if (isProtectedRoute) {
    try {
      // Create Supabase client for middleware
      const { supabase, response } = createClient(req);

      // Get the current user
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        // Not authenticated - redirect to login
        const loginUrl = new URL('/auth/login', req.url);
        loginUrl.searchParams.set('redirectTo', path);
        return NextResponse.redirect(loginUrl);
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
        console.error('Error fetching user profile in middleware:', profileError);
        // On error, redirect to account page
        return NextResponse.redirect(new URL('/account', req.url));
      }

      const role = profileData?.role || user.user_metadata?.role;

      // Only check subscription for dashboard routes (not activities)
      if (path.startsWith('/dashboard') && role === 'teacher') {
        const hasActiveSubscription = await checkSubscriptionAccess(supabase, profileData, user.id);

        if (!hasActiveSubscription) {
          // Teacher without subscription - redirect to account page
          return NextResponse.redirect(new URL('/account', req.url));
        }
      }

      // User has access, continue with the response from Supabase auth
      return response;
    } catch (error) {
      console.error('Middleware error:', error);
      // On any error, redirect to account page
      return NextResponse.redirect(new URL('/account', req.url));
    }
  }

  // For non-dashboard routes, just pass through
  return NextResponse.next();
}

// Helper function to check subscription access
async function checkSubscriptionAccess(supabase: any, profileData: any, userId: string): Promise<boolean> {
  try {
    // Admin override
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@languagegems.com";
    const devAdminEmail = "danieletienne89@gmail.com";

    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email === adminEmail || user?.email === devAdminEmail) {
      return true;
    }

    // Check if subscription is active
    const isActive = (data: any): boolean => {
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

    // If user is a school owner, check their own subscription
    if (profileData.is_school_owner) {
      return isActive(profileData);
    }

    // If user has a school owner, check the owner's subscription
    if (profileData.school_owner_id) {
      const { data: ownerData, error } = await supabase
        .from('user_profiles')
        .select('subscription_status, subscription_expires_at, trial_ends_at')
        .eq('user_id', profileData.school_owner_id)
        .single();

      if (error || !ownerData) {
        return false;
      }

      return isActive(ownerData);
    }

    // Individual teacher - check their own subscription
    return isActive(profileData);
  } catch (error) {
    console.error('Error checking subscription access:', error);
    return false;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
