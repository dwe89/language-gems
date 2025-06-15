import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { 
  generatePassword, 
  generateScopedUsername,
  ensureTeacherHasSchoolInitials
} from '../../../../lib/student-credentials';

export async function POST(request: Request) {
  try {
    console.log('=== FIX CREDENTIALS API CALLED ===');
    
    // Get the service role key
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!serviceRoleKey) {
      return NextResponse.json({ error: 'Service configuration error' }, { status: 500 });
    }
    
    console.log('Using service role key:', serviceRoleKey ? 'Available' : 'Not available');
    
    // Create admin client for user operations
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

    const body = await request.json();
    const { classId } = body;

    if (!classId) {
      return NextResponse.json({ error: 'Class ID is required' }, { status: 400 });
    }

    // Retrieve class information and, from it, the teacher ID.
    const { data: classData, error: classError } = await adminClient
      .from('classes')
      .select('id, name, teacher_id')
      .eq('id', classId)
      .single();

    if (classError || !classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    const teacherId = classData.teacher_id;

    // Get teacher's profile to check for school initials
    const { data: teacherProfile, error: teacherError } = await adminClient
      .from('user_profiles')
      .select('school_initials, email, display_name')
      .eq('user_id', teacherId)
      .single();

    if (teacherError || !teacherProfile) {
      return NextResponse.json({ error: 'Teacher profile not found' }, { status: 403 });
    }

    // Ensure teacher has school initials
    const schoolInitials = await ensureTeacherHasSchoolInitials(adminClient, teacherId, teacherProfile);

    // Get all students missing credentials for this teacher
    const { data: students, error: studentsError } = await adminClient
      .from('user_profiles')
      .select('user_id, display_name')
      .eq('role', 'student')
      .eq('teacher_id', teacherId)
      .or('username.is.null,initial_password.is.null,school_initials.is.null');

    if (studentsError) {
      return NextResponse.json({ error: studentsError.message }, { status: 500 });
    }

    const results = [];
    const errors = [];

    for (const student of students) {
      try {
        // Parse name
        const nameParts = student.display_name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : firstName;

        // Generate credentials using our utility functions
        const username = await generateScopedUsername(adminClient, firstName, lastName, schoolInitials);
        const password = generatePassword();

        // Update student
        const { error: updateError } = await adminClient
          .from('user_profiles')
          .update({
            username: username,
            initial_password: password,
            school_initials: schoolInitials
          })
          .eq('user_id', student.user_id);

        if (updateError) {
          errors.push({ name: student.display_name, error: updateError.message });
          continue;
        }

        results.push({
          name: student.display_name,
          username: username,
          password: password
        });

      } catch (error: any) {
        errors.push({ name: student.display_name, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      fixed: results.length,
      results,
      errors,
      message: `Fixed credentials for ${results.length} students`
    });

  } catch (error: any) {
    console.error('Error fixing student credentials:', error);
    return NextResponse.json({ 
      error: 'Failed to fix student credentials', 
      details: error.message 
    }, { status: 500 });
  }
} 