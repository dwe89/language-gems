import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin') || 'undefined';
  const host = request.headers.get('host') || 'undefined';
  const protocol = request.url.startsWith('https') ? 'https' : 'http';
  
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    requestOrigin: origin,
    requestHost: host,
    requestProtocol: protocol,
    envVars: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'undefined',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined'
    },
    expectedCallbackUrl: `${origin}/api/auth/callback`,
    fallbackCallbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.languagegems.com'}/api/auth/callback`
  };

  return NextResponse.json(debugInfo, { status: 200 });
} 