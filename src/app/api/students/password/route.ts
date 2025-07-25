import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '../../../../lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('=== GET STUDENT PASSWORD API CALLED ===');

    // Get the service role key
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      return NextResponse.json({ error: 'Service configuration error' }, { status: 500 });
    }

    // Create admin client
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create regular client to get current user using the server client
    const supabase = await createServerClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { studentId } = body;

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // Verify that the requesting user is a teacher and has access to this student
    const { data: teacherAccess, error: accessError } = await adminClient
      .from('class_enrollments')
      .select(`
        classes!inner(teacher_id)
      `)
      .eq('student_id', studentId)
      .eq('classes.teacher_id', user.id)
      .limit(1);

    if (accessError || !teacherAccess || teacherAccess.length === 0) {
      console.log('Teacher access check failed:', { teacherId: user.id, studentId, accessError });
      return NextResponse.json({ error: 'Not authorized to view this student\'s password' }, { status: 403 });
    }

    // Fetch student password
    const { data: student, error: studentError } = await adminClient
      .from('user_profiles')
      .select('initial_password')
      .eq('user_id', studentId)
      .eq('role', 'student')
      .single();

    if (studentError) {
      console.log('Student not found:', { studentId, studentError });
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({
      password: student.initial_password || 'Password not available'
    });

  } catch (error: any) {
    console.error('Error fetching student password:', error);
    return NextResponse.json({
      error: 'Failed to fetch student password',
      details: error.message
    }, { status: 500 });
  }
}