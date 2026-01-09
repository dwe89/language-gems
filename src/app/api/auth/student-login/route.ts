import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase-server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { username, schoolCode, password } = await request.json();

    if (!username || !schoolCode || !password) {
      return NextResponse.json(
        { error: 'Username, school code, and password are required' },
        { status: 400 }
      );
    }

    // Create service role client to bypass RLS for user lookup
    const adminClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create regular client for auth operations
    const supabase = await createClient();

    // First, find the student by username and school code using admin client
    // Check school_code first, then fallback to school_initials for backward compatibility
    let student = null;
    let studentError = null;

    console.log(`Login attempt: username=${username}, schoolCode=${schoolCode}`);

    // Try to find by school_code first (preferred)
    const { data: studentByCode, error: codeError } = await adminClient
      .from('user_profiles')
      .select('user_id, email, username, school_code, school_initials, initial_password, role')
      .eq('username', username.toLowerCase())
      .eq('school_code', schoolCode.toUpperCase())
      .eq('role', 'student')
      .single();

    if (studentByCode) {
      console.log('Found student by school_code');
      student = studentByCode;
    } else {
      console.log('Student not found by school_code, trying initials. Error:', codeError?.message);
      // Fallback to school_initials for backward compatibility
      const { data: studentByInitials, error: initialsError } = await adminClient
        .from('user_profiles')
        .select('user_id, email, username, school_code, school_initials, initial_password, role')
        .eq('username', username.toLowerCase())
        .eq('school_initials', schoolCode.toUpperCase())
        .eq('role', 'student')
        .single();

      if (studentByInitials) {
        console.log('Found student by school_initials');
        student = studentByInitials;
      } else {
        console.log('Student not found by school_initials either. Error:', initialsError?.message);
        studentError = initialsError;
      }
    }

    if (!student) {
      return NextResponse.json(
        { error: 'Invalid username or school code' },
        { status: 401 }
      );
    }

    // Verify password (check both current password and initial password)
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: student.email,
      password: password
    });

    if (signInError) {
      // If regular password fails, try initial password
      if (student.initial_password === password) {
        // Student is using initial password - this should work but let's try again
        const { data: signInData2, error: signInError2 } = await supabase.auth.signInWithPassword({
          email: student.email,
          password: student.initial_password
        });

        if (signInError2) {
          console.log('Authentication failed with both passwords:', { signInError, signInError2 });
          return NextResponse.json(
            { error: 'Invalid password' },
            { status: 401 }
          );
        }

        return NextResponse.json({
          success: true,
          user: {
            id: student.user_id,
            email: student.email,
            username: student.username,
            role: student.role
          },
          session: signInData2.session
        });
      }

      console.log('Authentication failed:', signInError);
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: student.user_id,
        email: student.email,
        username: student.username,
        role: student.role
      },
      session: signInData.session
    });

  } catch (error) {
    console.error('Student login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 