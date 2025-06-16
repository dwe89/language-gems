import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Feature flags - same logic as the client-side version
const isDevelopment = process.env.NODE_ENV === 'development';
const featureFlags = {
  games: isDevelopment,
  customLessons: isDevelopment,
  progressTracking: isDevelopment,
  blog: true,
  shop: true,
};

export async function middleware(req: NextRequest) {
  // Only log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware running for path:', req.nextUrl.pathname);
  }
  
  // Create a response that we can modify
  let supabaseResponse = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // Create Supabase client for middleware with improved cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, {
              ...options,
              // Ensure cookies are properly set with secure defaults
              httpOnly: false, // Allow client-side access
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            });
          });
        },
      },
    }
  );

  // Fast path for public assets and API routes
  const path = req.nextUrl.pathname;
  if (path.startsWith('/_next') || path.startsWith('/api') || path.startsWith('/favicon')) {
    return supabaseResponse;
  }

  // Get the session with improved error handling
  let session = null;
  let user = null;
  let userRole = null;
  
  try {
    // Try to get the user from the current session
    const { data: { user: currentUser }, error } = await supabase.auth.getUser();
    
    if (!error && currentUser) {
      session = { user: currentUser };
      user = currentUser;
      
      // Fetch user role from the database
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', currentUser.id)
        .single();
      
      userRole = profile?.role || null;
      
      // Refresh the session to ensure it stays valid
      await supabase.auth.getSession();
    }
  } catch (error) {
    console.error('Error in middleware getting user:', error);
    // Clear any potentially corrupted session
    supabaseResponse.cookies.delete('sb-access-token');
    supabaseResponse.cookies.delete('sb-refresh-token');
  }

  // If the user just signed out (detected by presence of 'signedOut' cookie)
  const signedOutCookie = req.cookies.get('signedOut');
  if (signedOutCookie && signedOutCookie.value === 'true') {
    // Clear the cookie in the response
    supabaseResponse.cookies.delete('signedOut');
    
    // If trying to access protected routes, redirect to home
    if (path.startsWith('/dashboard') || path.startsWith('/profile')) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/';
      return NextResponse.redirect(redirectUrl);
    }
    
    return supabaseResponse;
  }

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Session check in middleware:', {
      isAuthenticated: !!session,
      userId: user?.id,
      userRole,
      path
    });
  }

  // Feature flag checking - redirect disabled features to specific coming-soon pages
  const featureRoutes = {
    '/games': { enabled: featureFlags.games, comingSoonPath: '/coming-soon/games' },
    '/themes': { enabled: featureFlags.customLessons, comingSoonPath: '/coming-soon/themes' },
    '/premium': { enabled: featureFlags.progressTracking, comingSoonPath: '/coming-soon/progress' },
  };

  // Check if this is a feature route that's disabled
  for (const [route, config] of Object.entries(featureRoutes)) {
    if (path.startsWith(route) && !config.enabled) {
      const redirectUrl = new URL(config.comingSoonPath, req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Public routes (marketing/landing pages)
  const publicRoutes = [
    '/',
    '/schools/demo',
    '/schools/pricing',
    '/schools/contact',
    '/terms',
    '/privacy',
    '/cookies',
    '/about',
    '/games',
  ];

  // Check if this is a public route
  const isPublicRoute = publicRoutes.some(route => 
    path === route || (route.endsWith('*') && path.startsWith(route.slice(0, -1)))
  );

  // Auth routes (login/signup) - redirect to dashboard if already authenticated
  const authRoutes = ['/auth/login', '/auth/signup'];
  const isAuthRoute = authRoutes.includes(path);

  // Don't redirect users who are explicitly navigating to account, shop, or cart pages
  const nonRedirectPaths = ['/account', '/shop', '/cart', '/checkout'];
  const shouldSkipRoleRedirects = nonRedirectPaths.some(route => path.startsWith(route));

  if (!shouldSkipRoleRedirects) {
    // Check if student trying to access teacher routes
    if (session && (path === '/dashboard' || path.startsWith('/dashboard/'))) {
      if (userRole === 'student') {
        const redirectUrl = new URL('/student-dashboard', req.url);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Check if teacher/admin trying to access student routes
    if (session && (path === '/student-dashboard' || path.startsWith('/student-dashboard/'))) {
      if (userRole === 'teacher' || userRole === 'admin') {
        const redirectUrl = new URL('/dashboard', req.url);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // If user is authenticated on landing page, redirect based on role but default to account
    if (session && path === '/') {
      const redirectUrl = req.nextUrl.clone();
      
      if (userRole === 'student') {
        redirectUrl.pathname = '/student-dashboard';
      } else if (userRole === 'teacher' || userRole === 'admin') {
        redirectUrl.pathname = '/account';
      } else {
        // For users without a defined role, go to account page
        redirectUrl.pathname = '/account';
      }
      
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If on auth routes and already logged in, redirect to dashboard
  if (isAuthRoute && session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = userRole === 'student' ? '/student-dashboard' : '/account';
    return NextResponse.redirect(redirectUrl);
  }

  // Check if the route is protected and user is not authenticated
  const protectedPaths = ['/dashboard', '/student-dashboard', '/profile', '/exercises', '/languages/learn', '/themes/explore', '/learn', '/account', '/cart', '/admin'];
  const isProtectedRoute = protectedPaths.some(route => path.startsWith(route));

  if (isProtectedRoute && !session) {
    // Redirect to login if attempting to access protected route without auth
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('redirectedFrom', path);
    return NextResponse.redirect(redirectUrl);
  }

  // Admin routes protection - only allow admin users
  if (path.startsWith('/admin') && session) {
    if (userRole !== 'admin') {
      // Non-admin users trying to access admin routes - redirect to their appropriate dashboard
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = userRole === 'student' ? '/student-dashboard' : '/account';
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Check for premium routes that require subscription
  const premiumPaths = ['/dashboard'];
  const isPremiumRoute = premiumPaths.some(route => path.startsWith(route));

  if (isPremiumRoute && session && user) {
    try {
      // Check user's subscription status
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      // If no active subscription and user is not admin, redirect to upgrade page
      if (!subscription && userRole !== 'admin') {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/account/upgrade';
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      // If there's an error checking subscription, allow access for admins
      console.warn('Error checking subscription in middleware:', error);
      if (userRole !== 'admin') {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/account/upgrade';
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Only run middleware on routes that actually need auth checking
    '/',
    '/dashboard/:path*',
    '/student-dashboard/:path*',
    '/profile/:path*',
    '/exercises/:path*',
    '/languages/learn/:path*',
    '/themes/:path*',
    '/games/:path*',
    '/premium/:path*',
    '/learn/:path*',
    '/auth/:path*',
    '/coming-soon/:path*',
    '/admin/:path*',
  ],
}; 