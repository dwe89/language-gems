import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getFeatureFlags } from './lib/featureFlags';

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
  // Re-enable logging to debug audio issue
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware running for path:', req.nextUrl.pathname, 'hostname:', req.headers.get('host'));
  }

  // CRITICAL FIX: Fast path for static assets BEFORE any subdomain logic
  // This prevents redirect loops when audio files are requested from main domain
  const path = req.nextUrl.pathname;
  const hostname = req.headers.get('host') || '';

  if (path.startsWith('/_next') || path.startsWith('/api') || path.startsWith('/favicon') ||
      path.startsWith('/audio/') || path.startsWith('/images/') || path.startsWith('/public/') ||
      path.startsWith('/games/') && (path.includes('/sounds/') || path.includes('/audio/'))) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎵 EARLY Fast path for static asset:', path, 'hostname:', hostname);
    }
    return NextResponse.next();
  }

  // Check for student subdomain - handle after fast path check
  if (hostname.startsWith('students.')) {
    // Rewrite to serve student portal content
    const url = req.nextUrl.clone();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Student subdomain detected. Original path:', url.pathname);
    }
    
    // Special handling for student dashboard routes
    if (url.pathname === '/student-dashboard' || url.pathname.startsWith('/student-dashboard/')) {
      // Keep the path as-is for student dashboard routes
      url.pathname = url.pathname;
    } else if (url.pathname === '/dashboard') {
      // Redirect /dashboard to /student-dashboard on student subdomain
      url.pathname = '/student-dashboard';
    } else if (url.pathname === '/') {
      // Root of student subdomain goes to student portal
      url.pathname = '/student';
    } else if (url.pathname.startsWith('/auth/') || url.pathname.startsWith('/api/')) {
      // Auth and API routes get prefixed with /student for auth routes, but API routes stay as-is
      if (url.pathname.startsWith('/auth/')) {
        url.pathname = `/student${url.pathname}`;
      }
      // API routes don't get prefixed - they stay as-is
    } else if (url.pathname.startsWith('/games/')) {
      // Games routes don't get prefixed - they stay as-is to access main games directory
      url.pathname = url.pathname;
    } else if (url.pathname.startsWith('/audio/') || url.pathname.startsWith('/images/') || url.pathname.startsWith('/public/')) {
      // Static assets (audio, images, public files) need to be redirected to main domain
      if (process.env.NODE_ENV === 'development') {
        console.log('🎵 Static asset route detected, redirecting to main domain:', url.pathname);
      }
      // Redirect to main domain for static assets
      const mainDomain = hostname.replace('students.', '');
      // Don't add port if mainDomain already includes it
      const hasPort = mainDomain.includes(':');
      const port = hasPort ? '' : (url.port ? `:${url.port}` : (process.env.NODE_ENV === 'development' ? ':3000' : ''));
      const baseUrl = `${url.protocol}//${mainDomain}${port}`;

      if (process.env.NODE_ENV === 'development') {
        console.log('🎵 Constructing redirect URL:', {
          pathname: url.pathname,
          baseUrl: baseUrl,
          protocol: url.protocol,
          mainDomain: mainDomain,
          port: port
        });
      }

      const redirectUrl = new URL(url.pathname, baseUrl);
      return NextResponse.redirect(redirectUrl);
    } else if (url.pathname === '/assessments' || url.pathname.startsWith('/assessments/') ||
               url.pathname === '/dictation' || url.pathname.startsWith('/dictation/') ||
               url.pathname === '/exam-style-assessment' || url.pathname.startsWith('/exam-style-assessment/') ||
               url.pathname === '/exam-style-assessment-topic' || url.pathname.startsWith('/exam-style-assessment-topic/') ||
               url.pathname === '/four-skills-assessment' || url.pathname.startsWith('/four-skills-assessment/') ||
               url.pathname === '/reading-comprehension' || url.pathname.startsWith('/reading-comprehension/') ||
               url.pathname === '/aqa-listening-test' || url.pathname.startsWith('/aqa-listening-test/') ||
               url.pathname === '/aqa-reading-test' || url.pathname.startsWith('/aqa-reading-test/') ||
               url.pathname === '/aqa-reading-test-topic' || url.pathname.startsWith('/aqa-reading-test-topic/') ||
               url.pathname === '/aqa-writing-test' || url.pathname.startsWith('/aqa-writing-test/')) {
      // Assessment-related routes don't get prefixed - they stay as-is to access main assessment directories
      if (process.env.NODE_ENV === 'development') {
        console.log('Assessment route detected, keeping path as-is:', url.pathname);
      }
      url.pathname = url.pathname;
    } else {
      // All other routes get prefixed with /student
      if (process.env.NODE_ENV === 'development') {
        console.log('Other route, adding /student prefix. Original:', url.pathname, 'New:', `/student${url.pathname}`);
      }
      url.pathname = `/student${url.pathname}`;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Final rewrite path:', url.pathname);
    }
    
    return NextResponse.rewrite(url);
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
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          req.cookies.set(name, value);
          supabaseResponse.cookies.set(name, value, {
            ...options,
            // Use secure defaults - let Supabase handle httpOnly properly
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
          });
        },
        remove(name: string, options: any) {
          req.cookies.delete(name);
          supabaseResponse.cookies.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );

  // Fast path logic moved to top of middleware function

  // Redirect student routes on main domain to subdomain
  if (path.startsWith('/student') && !hostname.startsWith('students.')) {
    const studentUrl = new URL(req.url);
    studentUrl.hostname = `students.${hostname}`;
    // Handle different student route patterns
    if (path.startsWith('/student-dashboard')) {
      studentUrl.pathname = path; // Keep student-dashboard as-is
    } else if (path.startsWith('/student/')) {
      studentUrl.pathname = path.substring('/student'.length); // Remove /student prefix
    } else if (path === '/student') {
      studentUrl.pathname = '/'; // Root of student subdomain
    }
    return NextResponse.redirect(studentUrl);
  }

  // Get the session with improved error handling
  let session = null;
  let user = null;
  let userRole = null;
  let userEmail = null;
  
  try {
    // Get current session
    const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error in middleware:', sessionError);
    } else {
      session = currentSession;
      user = currentSession?.user || null;
      userEmail = user?.email || null;

      // Get user role if we have a user
      if (user) {
        try {
          // Admin override for specific email - MUST BE FIRST
          const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@languagegems.com";
          const devAdminEmail = "danieletienne89@gmail.com";
          
          if (userEmail === adminEmail || userEmail === devAdminEmail) {
            userRole = 'admin';
          } else {
            // First check user metadata
            userRole = user.user_metadata?.role;
            
            // If no role in metadata, check user_profiles table
            if (!userRole) {
              const { data: profileData, error: profileError } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('user_id', user.id)
                .single();
                
              if (!profileError && profileData) {
                userRole = profileData.role;
              }
            }
          }
        } catch (error) {
          console.error('Error getting user role in middleware:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error in middleware auth check:', error);
  }

  // Get feature flags with admin override
  const featureFlags = getFeatureFlags(userEmail);

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

  // Demo mode routes - allow unrestricted access to games without authentication
  const demoRoutes = [
    '/games/',
    '/vocabulary-games',
  ];

  // Check if this is a demo route (games in demo mode)
  const isDemoRoute = demoRoutes.some(route => path.startsWith(route));

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
    // In production, redirect dashboard access to preview page unless accessing preview page itself
    // BUT allow admin users to access all features
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction && session && (path === '/dashboard' || path.startsWith('/dashboard/'))) {
      const isPreviewPage = path === '/dashboard/preview';
      const isAdmin = userRole === 'admin';
      
      if (!isPreviewPage && !isAdmin) {
        // For now, allow all teachers access
        // TODO: Implement proper subscription system when needed
        console.log('Teacher dashboard access granted');
      }
    }

    // Check if student trying to access teacher routes
    if (session && (path === '/dashboard' || path.startsWith('/dashboard/'))) {
      if (userRole === 'student') {
        console.log('Student trying to access teacher route, redirecting...');
        // Redirect students to student dashboard, considering subdomain context
        if (hostname.startsWith('students.')) {
          const redirectUrl = new URL('/student-dashboard', req.url);
          return NextResponse.redirect(redirectUrl);
        } else {
          const redirectUrl = new URL('https://students.' + hostname + '/student-dashboard');
          return NextResponse.redirect(redirectUrl);
        }
      }
    }

    // In production, redirect student dashboard access to preview page unless accessing preview page itself
    // BUT allow admin users to access all features
    if (isProduction && session && (path === '/student-dashboard' || path.startsWith('/student-dashboard/'))) {
      const isPreviewPage = path === '/student-dashboard/preview';
      const isAdmin = userRole === 'admin';
      
      if (!isPreviewPage && userRole === 'student' && !isAdmin) {
        // For now, allow all students access
        // TODO: Implement proper subscription system when needed
        console.log('Student dashboard access granted');
      }
    }

    // Check if teacher/admin trying to access student routes
    if (session && (path === '/student-dashboard' || path.startsWith('/student-dashboard/'))) {
      if (userRole === 'teacher' || userRole === 'admin') {
        // Allow teachers to access student dashboard in preview mode
        const url = new URL(req.url);
        const isPreviewMode = url.searchParams.get('preview') === 'true';

        if (!isPreviewMode) {
          // Redirect teachers to main site dashboard
          if (hostname.startsWith('students.')) {
            const mainSiteUrl = hostname.replace('students.', '');
            const redirectUrl = new URL('https://' + mainSiteUrl + '/dashboard');
            return NextResponse.redirect(redirectUrl);
          } else {
            const redirectUrl = new URL('/dashboard', req.url);
            return NextResponse.redirect(redirectUrl);
          }
        }
      }
    }

    // If user is authenticated on landing page, redirect based on role but default to account
    // BUT only redirect on student subdomain for student users
    if (session && path === '/') {
      const redirectUrl = req.nextUrl.clone();
      
      // In production, users without roles should go to blog instead of dashboards
      // BUT admin users can access dashboards
      const isAdmin = userRole === 'admin';
      const isStudentSubdomain = hostname.startsWith('students.');
      
      if (isProduction && !userRole && !isAdmin) {
        redirectUrl.pathname = '/blog';
      } else if (userRole === 'student') {
        // Only redirect students to dashboard if they're on the student subdomain
        if (isStudentSubdomain) {
          redirectUrl.pathname = '/student-dashboard';
        } else {
          // On main domain, students stay on homepage - don't redirect
          return supabaseResponse;
        }
      } else if (userRole === 'teacher' || userRole === 'admin') {
        redirectUrl.pathname = '/account';
      } else {
        // For users without a defined role, go to account page
        redirectUrl.pathname = '/account';
      }
      
      return NextResponse.redirect(redirectUrl);
    }

    // Handle dashboard/student-dashboard access for users without roles in production
    // BUT allow admin users to access all features
    const isAdmin = userRole === 'admin';
    if (isProduction && session && !userRole && !isAdmin) {
      if (path === '/dashboard' || path.startsWith('/dashboard/')) {
        const redirectUrl = new URL('/dashboard/preview', req.url);
        return NextResponse.redirect(redirectUrl);
      }
      if (path === '/student-dashboard' || path.startsWith('/student-dashboard/')) {
        const redirectUrl = new URL('/student-dashboard/preview', req.url);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  // If on auth routes and already logged in, redirect to appropriate dashboard
  if (isAuthRoute && session) {
    const redirectUrl = req.nextUrl.clone();
    
    if (userRole === 'student') {
      // Students go to student dashboard on appropriate domain
      if (hostname.startsWith('students.')) {
        redirectUrl.pathname = '/student-dashboard';
      } else {
        // Redirect to student subdomain
        const studentUrl = new URL('https://students.' + hostname + '/student-dashboard');
        return NextResponse.redirect(studentUrl);
      }
    } else {
      // Teachers/admins go to main site
      if (hostname.startsWith('students.')) {
        const mainSiteUrl = hostname.replace('students.', '');
        const mainUrl = new URL('https://' + mainSiteUrl + '/account');
        return NextResponse.redirect(mainUrl);
      } else {
        redirectUrl.pathname = '/account';
      }
    }
    
    return NextResponse.redirect(redirectUrl);
  }

  // Check admin routes first - require admin role
  if (path.startsWith('/admin')) {
    if (!session) {
      // Not authenticated, redirect to login
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/auth/login';
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    if (userRole !== 'admin') {
      // Authenticated but not admin, redirect to account
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/account';
      return NextResponse.redirect(redirectUrl);
    }
    
    // Admin user, allow access
    return supabaseResponse;
  }

  // Check if the route is protected and user is not authenticated
  const protectedPaths = ['/dashboard', '/student-dashboard', '/profile', '/exercises', '/languages/learn', '/themes/explore', '/learn', '/account', '/cart'];
  const isProtectedRoute = protectedPaths.some(route => path.startsWith(route));

  // Allow demo routes to bypass authentication
  if (isProtectedRoute && !session && !isDemoRoute) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, etc)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 