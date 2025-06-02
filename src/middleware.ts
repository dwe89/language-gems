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
    '/games',
    '/games/:path*'
  ];

  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/student-dashboard',
    '/profile',
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
    '/dashboard',
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
  
  // Student-only routes
  const studentRoutes = [
    '/student-dashboard',
    '/student-dashboard/assignments',
    '/student-dashboard/games',
    '/student-dashboard/progress',
    '/student-dashboard/exam-prep',
    '/student-dashboard/profile',
    '/student-dashboard/settings',
  ];

  // Auth routes (login/signup) - redirect to dashboard if already authenticated
  const authRoutes = ['/auth/login', '/auth/signup'];
  const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname === route);

  // Get current path without query params
  const path = req.nextUrl.pathname;

  // Check if student trying to access teacher routes
  if (session && (path === '/dashboard' || path.startsWith('/dashboard/'))) {
    const userRole = session.user.user_metadata?.role;
    
    console.log('User role check for dashboard access:', {
      path,
      userRole,
      userId: session.user.id,
      isStudent: userRole === 'student'
    });
    
    if (userRole === 'student') {
      console.log('Student accessing teacher dashboard, redirecting to student dashboard');
      const redirectUrl = new URL('/student-dashboard', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Check if teacher/admin trying to access student routes
  if (session && (path === '/student-dashboard' || path.startsWith('/student-dashboard/'))) {
    const userRole = session.user.user_metadata?.role;
    
    console.log('User role check for student-dashboard access:', {
      path,
      userRole,
      userId: session.user.id,
      isTeacherOrAdmin: userRole === 'teacher' || userRole === 'admin'
    });
    
    if (userRole === 'teacher' || userRole === 'admin') {
      console.log('Teacher/admin accessing student dashboard, redirecting to teacher dashboard');
      const redirectUrl = new URL('/dashboard', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If user is authenticated on landing page or preview routes, redirect to dashboard
  if (session && (path === '/' || (previewRoutes.some(route => path === route) && path !== '/games'))) {
    const userRole = session.user.user_metadata?.role || 'student';
    console.log('Authenticated user on landing page, redirecting to dashboard, user role:', userRole);
    
    const redirectUrl = req.nextUrl.clone();
    if (userRole === 'student') {
      redirectUrl.pathname = '/student-dashboard';
    } else {
      redirectUrl.pathname = '/dashboard';
    }
    return NextResponse.redirect(redirectUrl);
  }

  // If on auth routes and already logged in, redirect to dashboard
  if (isAuthRoute && session) {
    console.log('User is authenticated and on auth route, redirecting to dashboard');
    const redirectUrl = req.nextUrl.clone();
    const userRole = session.user.user_metadata?.role || 'student';
    
    if (userRole === 'student') {
      redirectUrl.pathname = '/student-dashboard';
    } else {
      redirectUrl.pathname = '/dashboard';
    }
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

  return res;
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/student-dashboard/:path*',
    '/profile/:path*',
    '/exercises/:path*',
    '/languages/:path*',
    '/themes/:path*',
    '/learn/:path*',
    '/auth/:path*',
    '/schools/:path*',
  ],
}; 