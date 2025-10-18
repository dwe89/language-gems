import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase-server';
import { createServiceRoleClient } from '../../../../utils/supabase/client';

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
        school_initials,
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

    // Use school_code if available, fallback to school_initials
    const schoolIdentifier = userProfile.school_code || userProfile.school_initials;

    let classesQuery = supabase
      .from('classes')
      .select(`
        id,
        name,
        description,
        level,
        year_group,
        created_at,
        updated_at,
        teacher_id
      `);

    if (scope === 'my') {
      // Show only classes created by this teacher
      classesQuery = classesQuery.eq('teacher_id', user.id);
    } else if (scope === 'school' && schoolIdentifier) {
      // Show all classes from teachers in the same school
      // RLS policy will handle the filtering automatically
      // We just need to get all classes where teacher is in the same school

      // Get all teachers in the same school using service role client
      // Include both 'teacher' and 'admin' roles (admins can also have classes)
      const supabaseAdmin = createServiceRoleClient();
      const { data: schoolMembers, error: membersError } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id, email, display_name')
        .eq('school_code', schoolIdentifier)
        .in('role', ['teacher', 'admin']);

      if (membersError) {
        console.error('Error fetching school members:', membersError);
        return NextResponse.json({ error: 'Failed to fetch school members' }, { status: 500 });
      }

      if (schoolMembers && schoolMembers.length > 0) {
        const teacherIds = schoolMembers.map(member => member.user_id);
        classesQuery = classesQuery.in('teacher_id', teacherIds);
      } else {
        // No school members found, return empty result
        return NextResponse.json({
          success: true,
          classes: [],
          scope,
          school_code: schoolIdentifier,
          has_school_access: false,
          teacher_map: {}
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

    // Get teacher information for all classes using service role client
    const supabaseAdmin = createServiceRoleClient();
    const teacherIds = [...new Set(classes?.map(c => c.teacher_id).filter(Boolean) || [])];
    const { data: teachers } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, email, display_name')
      .in('user_id', teacherIds);

    // Create a map of teacher_id -> teacher info
    const teacherMap = (teachers || []).reduce((acc, teacher) => {
      acc[teacher.user_id] = {
        email: teacher.email,
        display_name: teacher.display_name || teacher.email.split('@')[0]
      };
      return acc;
    }, {} as Record<string, { email: string; display_name: string }>);

    // Add student count for each class
    const classesWithCounts = await Promise.all(
      (classes || []).map(async (classItem) => {
        const { count } = await supabase
          .from('class_students')
          .select('*', { count: 'exact', head: true })
          .eq('class_id', classItem.id);

        return {
          ...classItem,
          student_count: count || 0,
          teacher_name: teacherMap[classItem.teacher_id]?.display_name || 'Unknown',
          teacher_email: teacherMap[classItem.teacher_id]?.email || '',
          is_own_class: classItem.teacher_id === user.id
        };
      })
    );

    // Check if user has school access
    const hasSchoolAccess = !!(schoolIdentifier && (
      userProfile.is_school_owner ||
      userProfile.school_owner_id ||
      userProfile.subscription_status === 'active'
    ));

    return NextResponse.json({
      success: true,
      classes: classesWithCounts || [],
      scope,
      school_code: schoolIdentifier,
      has_school_access: hasSchoolAccess,
      user_is_school_owner: userProfile.is_school_owner,
      current_user_id: user.id
    });

  } catch (error) {
    console.error('Error in school-filtered classes GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
