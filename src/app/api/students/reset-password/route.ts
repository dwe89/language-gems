import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { studentId, newPassword } = await request.json();
    
    if (!studentId) {
      return NextResponse.json({ success: false, error: 'Student ID is required' }, { status: 400 });
    }
    
    if (!newPassword) {
      return NextResponse.json({ success: false, error: 'New password is required' }, { status: 400 });
    }
    
    // Create a regular Supabase client for authentication
    const supabase = createRouteHandlerClient({
      cookies: () => cookies()
    });
    
    // Create an admin client with service role for user management
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Get the current user to verify they are authorized
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    const teacherId = session.user.id;
    
    // Verify the teacher is associated with this student
    const { data: studentProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', studentId)
      .eq('role', 'student')
      .single();
    
    if (profileError || !studentProfile) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }
    
    // Verify the teacher has access to this student
    const { data: teacherAccess, error: accessError } = await supabase
      .from('class_enrollments')
      .select(`
        classes:class_id(teacher_id)
      `)
      .eq('student_id', studentId)
      .limit(1);
    
    if (accessError || !teacherAccess || teacherAccess.length === 0 || !teacherAccess[0].classes || teacherAccess[0].classes.teacher_id !== teacherId) {
      return NextResponse.json({ success: false, error: 'Not authorized to manage this student' }, { status: 403 });
    }
    
    // Update the user's password
    const { error: updateError } = await adminClient.auth.admin.updateUserById(
      studentId,
      { password: newPassword }
    );
    
    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }
    
    // Update the initial_password in user_profiles
    const { error: updateProfileError } = await supabase
      .from('user_profiles')
      .update({ initial_password: newPassword })
      .eq('user_id', studentId);
    
    if (updateProfileError) {
      // This is not a critical error, so we'll just log it
      console.error('Failed to update initial_password in profile:', updateProfileError);
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API exception:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 