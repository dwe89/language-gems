import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, schoolName, schoolCode: providedSchoolCode, role = 'teacher' } = await request.json();

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

    // Handle school code creation
    let schoolInitials = null;
    let schoolCode = providedSchoolCode;

    if (schoolName && schoolCode) {
      // Generate school initials from the school name (first letters approach)
      const words = schoolName.toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .split(' ')
        .filter((word: string) => !['the', 'school', 'college', 'academy', 'high', 'community', 'of', 'and'].includes(word));

      schoolInitials = words.length > 1
        ? words.slice(0, 4).map((w: string) => w[0]).join('').toUpperCase()
        : words[0]?.substring(0, 4).toUpperCase() || 'SCH';

      // Create school_codes entry
      await supabase
        .from('school_codes')
        .insert({
          code: schoolCode,
          school_name: schoolName,
          school_initials: schoolInitials,
          is_active: true
        });
    }

    // Teachers are the default role for signup
    const userRole = role || 'teacher';

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: userRole,
          school_name: schoolName
        },
        emailRedirectTo: `${origin}/api/auth/callback`
      }
    });

    if (error) {
      console.error('Signup error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Update user profile (handle_new_user trigger already created basic profile)
    if (data.user) {
      // Use admin client to bypass RLS policies since user isn't authenticated yet
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .update({
          subscription_type: 'free',
          school_initials: schoolCode  // Store the actual selected school code in school_initials
        })
        .eq('user_id', data.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        // Don't fail the signup if profile update fails
      }
    }

    // Return success response
    const response = {
      success: true,
      needsEmailVerification: !!data.user && !data.session,
      redirectUrl: userRole === 'teacher' ? '/account' : '/student-dashboard',
      schoolCode: schoolCode
    };

    if (data.session) {
      response.redirectUrl = userRole === 'teacher' ? '/account' : '/student-dashboard';
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