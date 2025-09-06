import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase-server';

export const dynamic = 'force-dynamic';

// GET - List school members
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's school information
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('school_code, is_school_owner, subscription_status')
      .eq('user_id', user.id)
      .single();

    if (profileError || !userProfile?.school_code) {
      return NextResponse.json({ error: 'No school associated with user' }, { status: 400 });
    }

    // Check if user has permission to view school members
    if (!userProfile.is_school_owner && userProfile.subscription_status !== 'active') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Get school members
    const { data: members, error: membersError } = await supabase
      .from('school_memberships')
      .select(`
        id,
        role,
        status,
        joined_at,
        member_user_id,
        user_profiles!school_memberships_member_user_id_fkey (
          email,
          display_name,
          subscription_status,
          created_at
        )
      `)
      .eq('school_code', userProfile.school_code)
      .eq('status', 'active')
      .order('joined_at', { ascending: false });

    if (membersError) {
      console.error('Error fetching school members:', membersError);
      return NextResponse.json({ error: 'Failed to fetch school members' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      school_code: userProfile.school_code,
      members: members || []
    });

  } catch (error) {
    console.error('Error in school members GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add teacher to school
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teacher_email } = await request.json();

    if (!teacher_email) {
      return NextResponse.json({ error: 'Teacher email is required' }, { status: 400 });
    }

    // Get user's school information and verify they're a school owner
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('school_code, is_school_owner, subscription_status')
      .eq('user_id', user.id)
      .single();

    if (profileError || !userProfile?.school_code) {
      return NextResponse.json({ error: 'No school associated with user' }, { status: 400 });
    }

    if (!userProfile.is_school_owner) {
      return NextResponse.json({ error: 'Only school owners can add teachers' }, { status: 403 });
    }

    if (userProfile.subscription_status !== 'active' && userProfile.subscription_status !== 'trialing') {
      return NextResponse.json({ error: 'Active subscription required to add teachers' }, { status: 403 });
    }

    // Use the database function to add teacher to school
    const { data: result, error: addError } = await supabase
      .rpc('add_teacher_to_school', {
        p_school_code: userProfile.school_code,
        p_teacher_email: teacher_email,
        p_owner_user_id: user.id
      });

    if (addError) {
      console.error('Error adding teacher to school:', addError);
      return NextResponse.json({ error: 'Failed to add teacher to school' }, { status: 500 });
    }

    const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;

    if (!parsedResult.success) {
      return NextResponse.json({ error: parsedResult.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Teacher added to school successfully',
      teacher_id: parsedResult.teacher_id
    });

  } catch (error) {
    console.error('Error in school members POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove teacher from school
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const memberUserId = searchParams.get('member_user_id');

    if (!memberUserId) {
      return NextResponse.json({ error: 'Member user ID is required' }, { status: 400 });
    }

    // Get user's school information and verify they're a school owner
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('school_code, is_school_owner')
      .eq('user_id', user.id)
      .single();

    if (profileError || !userProfile?.school_code) {
      return NextResponse.json({ error: 'No school associated with user' }, { status: 400 });
    }

    if (!userProfile.is_school_owner) {
      return NextResponse.json({ error: 'Only school owners can remove teachers' }, { status: 403 });
    }

    // Cannot remove self
    if (memberUserId === user.id) {
      return NextResponse.json({ error: 'Cannot remove yourself from school' }, { status: 400 });
    }

    // Remove from school membership
    const { error: removeError } = await supabase
      .from('school_memberships')
      .update({ status: 'inactive' })
      .eq('school_code', userProfile.school_code)
      .eq('member_user_id', memberUserId);

    if (removeError) {
      console.error('Error removing teacher from school:', removeError);
      return NextResponse.json({ error: 'Failed to remove teacher from school' }, { status: 500 });
    }

    // Update teacher's profile to remove school association
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ 
        school_owner_id: null,
        school_code: null
      })
      .eq('user_id', memberUserId);

    if (updateError) {
      console.error('Error updating teacher profile:', updateError);
      // Don't fail the request if this fails, membership is already removed
    }

    return NextResponse.json({
      success: true,
      message: 'Teacher removed from school successfully'
    });

  } catch (error) {
    console.error('Error in school members DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
