import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role = 'student' } = await request.json();

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
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Get the origin for redirect URL
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.languagegems.com';

    // Determine user role based on environment
    // In production: don't assign roles on signup (assign during premium subscription)
    // In development: assign student role for testing purposes
    const isProduction = process.env.NODE_ENV === 'production';
    const userRole = isProduction ? null : 'student';  // No role assignment in production

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: userRole  // Only assign role in development
        },
        emailRedirectTo: `${origin}/api/auth/callback`
      }
    });

    if (error) {
      console.error('Signup error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          email: data.user.email || email,
          role: userRole,  // Only assign role in development
          display_name: name,
          subscription_type: 'free'
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail the signup if profile creation fails
      }
    }

    // Return success response
    const response = {
      success: true,
      needsEmailVerification: !!data.user && !data.session,
      // In production, redirect to blog/shop since no role is assigned
      // In development, redirect based on role
      redirectUrl: isProduction ? '/blog' : (userRole === 'student' ? '/student-dashboard' : '/account')
    };

    if (data.session) {
      response.redirectUrl = isProduction ? '/blog' : (userRole === 'student' ? '/student-dashboard' : '/account');
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 