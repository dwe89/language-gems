import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase-server';

export const dynamic = 'force-dynamic';

// GET - Get classes with school filtering
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') || 'my'; // 'my' or 'school'

    // Get user's profile and school information
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select(`
        user_id,
        school_code,
        is_school_owner,
        school_owner_id,
        subscription_status
      `)
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }

    let classesQuery = supabase
      .from('classes')
      .select(`
        id,
        name,
        description,
        level,
        created_at,
        updated_at,
        teacher_id
      `);

    if (scope === 'my') {
      // Show only classes created by this teacher
      classesQuery = classesQuery.eq('teacher_id', user.id);
    } else if (scope === 'school' && userProfile.school_code) {
      // Show all classes from teachers in the same school
      
      // First get all teachers in the same school
      const { data: schoolMembers, error: membersError } = await supabase
        .from('school_memberships')
        .select('member_user_id')
        .eq('school_code', userProfile.school_code)
        .eq('status', 'active');

      if (membersError) {
        console.error('Error fetching school members:', membersError);
        return NextResponse.json({ error: 'Failed to fetch school members' }, { status: 500 });
      }

      if (schoolMembers && schoolMembers.length > 0) {
        const teacherIds = schoolMembers.map(member => member.member_user_id);
        classesQuery = classesQuery.in('teacher_id', teacherIds);
      } else {
        // No school members found, return empty result
        return NextResponse.json({
          success: true,
          classes: [],
          scope,
          school_code: userProfile.school_code,
          has_school_access: false
        });
      }
    } else {
      // Default to 'my' classes if no valid scope or school
      classesQuery = classesQuery.eq('teacher_id', user.id);
    }

    // Execute the query
    const { data: classes, error: classesError } = await classesQuery
      .order('created_at', { ascending: false });

    if (classesError) {
      console.error('Error fetching classes:', classesError);
      return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
    }

    // Check if user has school access
    const hasSchoolAccess = !!(userProfile.school_code && (
      userProfile.is_school_owner || 
      userProfile.school_owner_id ||
      userProfile.subscription_status === 'active'
    ));

    return NextResponse.json({
      success: true,
      classes: classes || [],
      scope,
      school_code: userProfile.school_code,
      has_school_access: hasSchoolAccess,
      user_is_school_owner: userProfile.is_school_owner
    });

  } catch (error) {
    console.error('Error in school-filtered classes GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
