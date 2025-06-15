import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('=== CREDENTIALS API CALLED ===');
    
    // Get the service role key - same pattern as bulk route
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldHN2cGZ1bmF6d2tvbnRkcGRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTgyMzAwMiwiZXhwIjoyMDU1Mzk5MDAyfQ.m40XgEXpqK613HUfx8kx-liXMGGMNBIus759th80wns';
    
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

    // Get all students in the class with their credentials
    const { data: enrollments, error: enrollmentsError } = await adminClient
      .from('class_enrollments')
      .select('student_id, enrolled_at')
      .eq('class_id', classId);

    if (enrollmentsError) {
      return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }

    if (!enrollments || enrollments.length === 0) {
      return NextResponse.json({ students: [], className: classData.name });
    }

    const studentIds = enrollments.map(e => e.student_id);

    // Fetch student profiles with credentials
    const { data: students, error: studentsError } = await adminClient
      .from('user_profiles')
      .select('user_id, display_name, username, initial_password, created_at')
      .in('user_id', studentIds)
      .order('display_name');

    if (studentsError) {
      return NextResponse.json({ error: 'Failed to fetch student details' }, { status: 500 });
    }

    // Format the data for PDF generation
    const formattedStudents = students.map(student => {
      const enrollment = enrollments.find(e => e.student_id === student.user_id);
      return {
        name: student.display_name || 'Unknown',
        username: student.username || 'No username',
        password: student.initial_password || 'Password not available',
        joinedDate: enrollment?.enrolled_at || student.created_at
      };
    });

    return NextResponse.json({
      students: formattedStudents,
      className: classData.name,
      total: formattedStudents.length
    });
    
  } catch (error: any) {
    console.error('Error fetching student credentials:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch student credentials', 
      details: error.message 
    }, { status: 500 });
  }
} 