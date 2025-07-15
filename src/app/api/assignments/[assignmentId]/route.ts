import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params;

    // Get the authenticated user
    const authHeader = request.headers.get('authorization');
    const sessionToken = authHeader?.replace('Bearer ', '');
    
    let user = null;
    if (sessionToken) {
      const { data: { user: authUser } } = await supabase.auth.getUser(sessionToken);
      user = authUser;
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch assignment details with game configuration
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select(`
        id,
        title,
        description,
        type,
        vocabulary_criteria,
        due_date,
        points,
        status,
        created_by,
        class_id,
        vocabulary_assignment_list_id,
        created_at
      `)
      .eq('id', assignmentId)
      .single();

    if (assignmentError) {
      console.error('Assignment fetch error:', assignmentError);
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this assignment
    // Either as a teacher (owns the assignment) or as a student (in the class)
    if (assignment.created_by === user.id) {
      // Teacher access - return full details
      return NextResponse.json({
        success: true,
        assignment,
        access_level: 'teacher'
      });
    } else {
      // Check if user is a student in the class
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('class_enrollments')
        .select('student_id')
        .eq('class_id', assignment.class_id)
        .eq('student_id', user.id)
        .single();

      if (enrollmentError || !enrollment) {
        return NextResponse.json(
          { error: 'Access denied - not enrolled in class' },
          { status: 403 }
        );
      }

      // Student access - return limited details
      return NextResponse.json({
        success: true,
        assignment: {
          id: assignment.id,
          title: assignment.title,
          description: assignment.description,
          game_type: assignment.type, // Use 'type' column
          game_config: assignment.vocabulary_criteria, // Use 'vocabulary_criteria' as game config
          due_date: assignment.due_date,
          points: assignment.points,
          status: assignment.status
        },
        access_level: 'student'
      });
    }

  } catch (error) {
    console.error('Error fetching assignment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 