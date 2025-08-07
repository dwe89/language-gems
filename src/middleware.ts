import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Simple middleware - just handle static assets
  const path = req.nextUrl.pathname;

  // Fast path for static assets
  if (path.startsWith('/_next') || path.startsWith('/api') || path.startsWith('/favicon') ||
      path.startsWith('/audio/') || path.startsWith('/images/') || path.startsWith('/public/')) {
    return NextResponse.next();
  }

  // Just pass everything else through
  return NextResponse.next();
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
