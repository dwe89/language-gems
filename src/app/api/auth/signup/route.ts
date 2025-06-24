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

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
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
          role: role,
          display_name: name,
          subscription_type: 'free'
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail the signup if profile creation fails
      }
    }

    // Check if email confirmation is required
    const needsConfirmation = !data.user?.email_confirmed_at && data.user?.confirmation_sent_at;

    return NextResponse.json({
      success: true,
      user: data.user,
      needsEmailVerification: needsConfirmation,
      redirectUrl: needsConfirmation ? `/auth/verify-email?email=${encodeURIComponent(email)}` : '/account'
    });

  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 