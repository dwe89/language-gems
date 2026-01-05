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

    // Handle school code creation and validation
    let schoolInitials = null;
    let schoolCode = providedSchoolCode;
    let isJoiningExistingSchool = false;
    let schoolOwnerUserId = null;
    let pendingInvitation = null;

    // If teacher is joining with a school code (not creating new school)
    if (schoolCode && !schoolName) {
      // SECURITY: Validate that teacher has a pending invitation
      console.log('🔍 Checking for invitation:', {
        email: email.toLowerCase(),
        schoolCode: schoolCode.toUpperCase()
      });

      const { data: invitation, error: invitationError } = await supabase
        .from('pending_teacher_invitations')
        .select('*')
        .eq('teacher_email', email.toLowerCase())
        .eq('school_code', schoolCode.toUpperCase())
        .eq('status', 'pending')
        .single();

      console.log('📧 Invitation lookup result:', { invitation, invitationError });

      if (invitationError || !invitation) {
        console.error('❌ No valid invitation found:', invitationError);
        return NextResponse.json({
          error: 'You must be invited by your school to join. Please contact your school administrator for an invitation.'
        }, { status: 403 });
      }

      // Check if invitation has expired
      if (new Date(invitation.expires_at) < new Date()) {
        return NextResponse.json({
          error: 'Your invitation has expired. Please request a new invitation from your school administrator.'
        }, { status: 403 });
      }

      pendingInvitation = invitation;
      isJoiningExistingSchool = true;

      // Get school owner info for later
      const { data: schoolData } = await supabase
        .from('school_codes')
        .select('*')
        .eq('code', schoolCode.toUpperCase())
        .single();

      if (schoolData) {
        // Get school owner user_id
        const { data: ownerProfile } = await supabase
          .from('user_profiles')
          .select('user_id')
          .eq('school_code', schoolCode.toUpperCase())
          .eq('is_school_owner', true)
          .single();

        if (ownerProfile) {
          schoolOwnerUserId = ownerProfile.user_id;
        }
      }
    } else if (schoolName && schoolCode) {
      // Creating a new school
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

      // Prepare profile update data
      const profileUpdate: Record<string, unknown> = {
        subscription_type: 'free',
        subscription_status: 'trialing',
        trial_ends_at: '2026-02-20', // Beta trial end date (Feb Half Term)
        // school_initials is varchar(10), so we use the actual initials, not the full code
        school_initials: schoolInitials || (schoolCode ? schoolCode.substring(0, 10) : null)
      };

      // If joining existing school, set school_code and school_owner_id
      if (isJoiningExistingSchool && schoolCode) {
        profileUpdate.school_code = schoolCode.toUpperCase();
        if (schoolOwnerUserId) {
          profileUpdate.school_owner_id = schoolOwnerUserId;
        }
      } else if (schoolName && schoolCode) {
        // Creating new school - set as school owner
        profileUpdate.school_code = schoolCode.toUpperCase();
        profileUpdate.is_school_owner = true;
      }

      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .update(profileUpdate)
        .eq('user_id', data.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        // Don't fail the signup if profile update fails
      }

      // If joining existing school, create school membership and mark invitation as accepted
      if (isJoiningExistingSchool && pendingInvitation && schoolOwnerUserId) {
        // Create school membership
        await supabaseAdmin
          .from('school_memberships')
          .insert({
            school_code: schoolCode.toUpperCase(),
            school_name: pendingInvitation.school_name || schoolCode,
            owner_user_id: schoolOwnerUserId,
            member_user_id: data.user.id,
            role: 'member',
            status: 'active'
          });

        // Mark invitation as accepted
        await supabaseAdmin
          .from('pending_teacher_invitations')
          .update({ status: 'accepted' })
          .eq('id', pendingInvitation.id);
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