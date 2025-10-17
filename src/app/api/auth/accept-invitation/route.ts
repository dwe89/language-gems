import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase-server';
import { createServiceRoleClient } from '../../../../utils/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const { school_code } = await request.json();

    if (!school_code) {
      return NextResponse.json({ error: 'School code is required' }, { status: 400 });
    }

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check for pending invitation
    const supabaseAdmin = createServiceRoleClient();
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('pending_teacher_invitations')
      .select('*')
      .eq('teacher_email', user.email!.toLowerCase())
      .eq('school_code', school_code.toUpperCase())
      .eq('status', 'pending')
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json({
        error: 'No pending invitation found for this school'
      }, { status: 404 });
    }

    // Check if invitation has expired
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json({
        error: 'Your invitation has expired. Please request a new invitation from your school administrator.'
      }, { status: 403 });
    }

    // Get school owner info
    const { data: schoolData } = await supabaseAdmin
      .from('school_codes')
      .select('*')
      .eq('code', school_code.toUpperCase())
      .single();

    if (!schoolData) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Get school owner user_id
    const { data: ownerProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id')
      .eq('school_code', school_code.toUpperCase())
      .eq('is_school_owner', true)
      .single();

    // Update user profile to add them to the school
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        school_code: school_code.toUpperCase(),
        school_owner_id: ownerProfile?.user_id || null,
        subscription_type: 'premium', // Teachers get premium access
        subscription_status: 'active'
      })
      .eq('user_id', user.id);

    if (profileError) {
      console.error('Profile update error:', profileError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    // Create school membership record
    const { error: membershipError } = await supabaseAdmin
      .from('school_memberships')
      .insert({
        school_code: school_code.toUpperCase(),
        school_name: schoolData.school_name || school_code,
        owner_user_id: ownerProfile?.user_id || null,
        member_user_id: user.id,
        role: 'member', // Must be 'member' or 'owner' per check constraint
        invited_at: invitation.invitation_sent_at,
        joined_at: new Date().toISOString(),
        status: 'active'
      });

    if (membershipError) {
      console.error('Membership creation error:', membershipError);
      // Don't fail the request if this fails, profile is already updated
    }

    // Mark invitation as accepted
    const { error: updateError } = await supabaseAdmin
      .from('pending_teacher_invitations')
      .update({
        status: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('Invitation update error:', updateError);
      // Don't fail the request if this fails
    }

    return NextResponse.json({
      success: true,
      message: `Successfully joined ${schoolData.school_name || school_code}!`
    });
  } catch (error) {
    console.error('Accept invitation error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

