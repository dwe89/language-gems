import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const redirectTo = searchParams.get('redirectTo') || '/';

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const cookieStore = await cookies();
    
    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({
              name,
              value,
              ...options,
              domain: process.env.NODE_ENV === 'development' ? '.localhost' : '.languagegems.com',
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            });
          },
          remove(name: string, options: any) {
            cookieStore.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
              domain: process.env.NODE_ENV === 'development' ? '.localhost' : '.languagegems.com',
            });
          },
        },
      }
    );

    // Set the session using the provided token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Error validating token:', error);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Set the session
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: '', // We'll let Supabase handle refresh
    });

    if (sessionError) {
      console.error('Error setting session:', sessionError);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Redirect to the intended destination
    return NextResponse.redirect(new URL(redirectTo, request.url));

  } catch (error) {
    console.error('Cross-domain auth error:', error);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}
