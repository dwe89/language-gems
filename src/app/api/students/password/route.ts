import { createClient } from '@supabase/supabase-js';
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

    const body = await request.json();
    const { studentId } = body;

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // Fetch student password
    const { data: student, error: studentError } = await adminClient
      .from('user_profiles')
      .select('initial_password')
      .eq('user_id', studentId)
      .eq('role', 'student')
      .single();

    if (studentError) {
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