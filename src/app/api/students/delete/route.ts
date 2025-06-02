import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { studentId, classId } = await request.json();
    
    if (!studentId) {
      return NextResponse.json({ success: false, error: 'Student ID is required' }, { status: 400 });
    }
    
    if (!classId) {
      return NextResponse.json({ success: false, error: 'Class ID is required' }, { status: 400 });
    }
    
    // Create a regular Supabase client
    const supabase = createRouteHandlerClient({
      cookies: () => cookies()
    });
    
    // Get the current user to verify they are authorized
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    const teacherId = session.user.id;
    
    // Verify the teacher owns the class
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .eq('teacher_id', teacherId)
      .single();
    
    if (classError || !classData) {
      return NextResponse.json({ success: false, error: 'Class not found or unauthorized' }, { status: 403 });
    }
    
    // Delete the student from the class
    const { error: deleteError } = await supabase
      .from('class_enrollments')
      .delete()
      .eq('class_id', classId)
      .eq('student_id', studentId);
    
    if (deleteError) {
      console.error('Error removing student from class:', deleteError);
      return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API exception:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 