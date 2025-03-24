import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('Middleware running for path:', req.nextUrl.pathname);
  
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh the session if it exists
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error in middleware getting session:', error);
    // If there's an error getting the session, treat as not authenticated
    return res;
  }

  // If the user just signed out (detected by presence of 'signedOut' cookie)
  const signedOutCookie = req.cookies.get('signedOut');
  if (signedOutCookie && signedOutCookie.value === 'true') {
    // Clear the cookie in the response
    const response = NextResponse.next();
    response.cookies.delete('signedOut');
    
    // If trying to access protected routes, redirect to home
    const path = req.nextUrl.pathname;
    if (path.startsWith('/dashboard') || path.startsWith('/profile')) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/';
      return NextResponse.redirect(redirectUrl);
    }
    
    return response;
  }

  console.log('Session check in middleware:', {
    isAuthenticated: !!session,
    userId: session?.user?.id,
    path: req.nextUrl.pathname
  });

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
  ];

  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/games/play',
    '/exercises',
    '/languages/learn',
    '/themes/explore',
    '/learn',
  ];

  // Content preview routes (limited content visible without auth)
  const previewRoutes = [
    '/languages',
    '/themes',
  ];

  // Teacher-only routes
  const teacherRoutes = [
    '/dashboard/classes',
    '/dashboard/students',
    '/dashboard/content',
    '/dashboard/content/create',
    '/dashboard/assignments',
    '/dashboard/assignments/new',
    '/dashboard/progress',
    '/dashboard/leaderboards',
    '/dashboard/reports',
    '/dashboard/settings',
  ];

  // Auth routes (login/signup) - redirect to dashboard if already authenticated
  const authRoutes = ['/auth/login', '/auth/signup'];
  const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname === route);

  // Get current path without query params
  const path = req.nextUrl.pathname;

  // IMPORTANT: Allow navigation within dashboard subpages without redirecting
  if (session && path.startsWith('/dashboard/')) {
    return res;
  }

  // If user is authenticated on landing page or preview routes, redirect to dashboard
  if (session && (path === '/' || (previewRoutes.some(route => path === route) && path !== '/games'))) {
    const userRole = session.user.user_metadata?.role || 'student';
    console.log('Authenticated user on landing page, redirecting to dashboard');
    
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  // If on auth routes and already logged in, redirect to dashboard
  if (isAuthRoute && session) {
    console.log('User is authenticated and on auth route, redirecting to dashboard');
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  // Check if the route is protected and user is not authenticated
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));
  const isTeacherRoute = teacherRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !session) {
    console.log('Attempting to access protected route without auth, redirecting to login');
    // Redirect to login if attempting to access protected route without auth
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isTeacherRoute && session) {
    // If accessing teacher route, verify user has teacher role
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile in middleware:', profileError);
    }

    // Only redirect if specifically not a teacher (allow navigation if role check fails)
    if (userProfile && userProfile.role !== 'teacher') {
      console.log('Non-teacher attempting to access teacher route, redirecting to dashboard');
      // Redirect non-teachers to dashboard
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/dashboard';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/profile/:path*',
    '/games/:path*',
    '/exercises/:path*',
    '/languages/:path*',
    '/themes/:path*',
    '/learn/:path*',
    '/auth/:path*',
    '/schools/:path*',
  ],
}; 