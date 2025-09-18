import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';


export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
            });
          },
        },
      }
    );

    try {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        // Redirect to login with error
        return NextResponse.redirect(`${origin}/auth/login?error=verification_failed`);
      }

      if (data.user) {
        console.log('Email verification successful for user:', data.user.email);

        // Check user metadata to determine redirect destination
        const userMetadata = data.user.user_metadata || {};
        const userType = userMetadata.user_type;
        const role = userMetadata.role;

        console.log('User metadata:', { userType, role, userMetadata });

        // Redirect based on user type or role
        if (role === 'learner' || userType === 'b2c') {
          console.log('Redirecting learner to learner dashboard');
          return NextResponse.redirect(`${origin}/learner-dashboard`);
        } else if (role === 'teacher' || userType === 'b2b') {
          console.log('Redirecting teacher to teacher dashboard');
          return NextResponse.redirect(`${origin}/dashboard`);
        } else {
          // Default to confirmation page if user type is unclear
          console.log('User type unclear, redirecting to confirmation page');
          return NextResponse.redirect(`${origin}/auth/confirmed`);
        }
      }
    } catch (error) {
      console.error('Exception during code exchange:', error);
    }
  }

  // If no code or exchange failed, redirect to login
  return NextResponse.redirect(`${origin}/auth/login?error=invalid_verification_link`);
} 