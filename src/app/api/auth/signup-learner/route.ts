import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, plan = 'free' } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';
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

    // Sign up the user as an independent learner
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'learner', // Different from 'student' (which is B2B)
          plan: plan,
          user_type: 'b2c'
        },
        emailRedirectTo: `${origin}/api/auth/callback`
      }
    });

    if (error) {
      console.error('Learner signup error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Update user profile for independent learners
    if (data.user) {
      // Use admin client to bypass RLS policies since user isn't authenticated yet
      const supabaseAdmin = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          cookies: {
            get() { return undefined; },
            set() { },
            remove() { },
          },
        }
      );

      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .update({
          subscription_type: plan === 'pro' ? 'premium' : 'free',
          subscription_status: 'trialing',
          trial_ends_at: '2026-02-20', // Beta trial end date (Feb Half Term)
          role: 'learner',
          // No school-related fields for B2C learners
          school_initials: null,
          school_code: null
        })
        .eq('user_id', data.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        // Don't fail the signup if profile update fails
      }

      // Initialize learner-specific data
      try {
        // Create initial learning preferences
        await supabaseAdmin
          .from('learner_preferences')
          .insert({
            user_id: data.user.id,
            preferred_languages: ['spanish'], // Default to Spanish
            daily_goal: 10, // 10 words per day
            difficulty_level: 'beginner',
            study_reminders: true,
            created_at: new Date().toISOString()
          });

        // Create initial progress tracking
        await supabaseAdmin
          .from('learner_progress')
          .insert({
            user_id: data.user.id,
            total_xp: 0,
            current_level: 1,
            current_streak: 0,
            words_learned: 0,
            games_played: 0,
            total_study_time: 0,
            created_at: new Date().toISOString()
          });
      } catch (initError) {
        console.error('Error initializing learner data:', initError);
        // Don't fail signup for this
      }
    }

    // Return success response
    const response = {
      success: true,
      needsEmailVerification: !!data.user && !data.session,
      redirectUrl: '/learner-dashboard',
      userType: 'learner'
    };

    if (data.session) {
      response.redirectUrl = '/learner-dashboard';
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Learner signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
