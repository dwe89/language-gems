import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from './utils/supabase/middleware';

/**
 * LIGHTWEIGHT MIDDLEWARE
 * 
 * This middleware only checks if the user is authenticated.
 * Heavy subscription/profile checking is done in the dashboard layout.tsx
 * which is cached by Next.js for subsequent navigation.
 * 
 * This approach:
 * - Reduces middleware execution time from ~300ms to ~50ms
 * - Slashes Function Duration costs
 * - Makes the app feel faster
 */
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Fast path for static assets and API routes
  if (path.startsWith('/_next') || path.startsWith('/api') || path.startsWith('/favicon') ||
    path.startsWith('/audio/') || path.startsWith('/images/') || path.startsWith('/public/')) {
    return NextResponse.next();
  }

  // Check if this is a protected route that needs auth
  // MOBILE APP: Only dashboard is protected. Games/activities are public.
  const isProtectedRoute = (path.startsWith('/dashboard') && path !== '/dashboard/preview');

  if (isProtectedRoute) {
    try {
      // Create Supabase client for middleware
      const { supabase, response } = createClient(req);

      // LIGHTWEIGHT CHECK: Only verify user is authenticated
      // Subscription checking is handled in dashboard/layout.tsx (cached)
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        // Not authenticated - redirect to login
        const loginUrl = new URL('/auth/login', req.url);
        loginUrl.searchParams.set('redirectTo', path);
        return NextResponse.redirect(loginUrl);
      }

      // User is authenticated - let them through
      // Subscription check will happen in layout.tsx (once, then cached)
      return response;
    } catch (error) {
      console.error('Middleware error:', error);
      // On any error, redirect to login
      const loginUrl = new URL('/auth/login', req.url);
      loginUrl.searchParams.set('redirectTo', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  // For non-protected routes, just pass through
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Extension exclusions based on your logs:
     * - Images: .svg, .png, .jpg, .jpeg, .gif, .webp
     * - Audio: .mp3, .wav
     * - System: .xml (sitemap), .txt (robots), .js (scripts)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|wav|xml|txt|js)$).*)',
  ],
};
