import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { generateUsername as createUsername } from '../../../../lib/utils';

function generateUsername(name: string) {
  // Format: FirstName + Last Initial (e.g., BobS from Bob Smith)
  const nameParts = name.trim().split(/\s+/);
  
  if (nameParts.length === 1) {
    // If just one name, use it as is
    const firstName = nameParts[0];
    // Capitalize first letter, lowercase the rest
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  }
  
  // Get first name and capitalize first letter
  const firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
  // Get last name initial and make it uppercase
  const lastInitial = nameParts[nameParts.length - 1][0].toUpperCase();
  
  // Combine to create the username format FirstNameLastInitial
  return firstName + lastInitial;
}

function generatePassword() {
  // Generate a random password
  const length = 8;
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Create admin client for user creation
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
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { students, classId, schoolInitials } = body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return NextResponse.json({ error: 'Student list is required' }, { status: 400 });
    }

    if (!classId) {
      return NextResponse.json({ error: 'Class ID is required' }, { status: 400 });
    }

    if (!schoolInitials) {
      return NextResponse.json({ error: 'School initials are required' }, { status: 400 });
    }

    // Verify teacher owns the class
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('name')
      .eq('id', classId)
      .eq('teacher_id', user.id)
      .single();

    if (classError || !classData) {
      return NextResponse.json({ error: 'Class not found or unauthorized' }, { status: 403 });
    }

    const results = [];
    const errors = [];

    // Process each student
    for (const studentInput of students) {
      try {
        const name = typeof studentInput === 'string' ? studentInput.trim() : studentInput.name?.trim();
        
        if (!name) {
          errors.push({ name: 'Unknown', error: 'Student name is required' });
          continue;
        }
        
        // Parse first and last name from full name
        const nameParts = name.split(' ').filter((part: string) => part.length > 0);
        if (nameParts.length < 2) {
          errors.push({ name, error: 'Please use "First Last" format' });
          continue;
        }
        
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        const displayName = `${firstName} ${lastName}`;
        
        // Generate username scoped to school
        const username = await supabase.rpc('generate_student_username_scoped', {
          p_first_name: firstName,
          p_last_name: lastName,
          p_school_initials: schoolInitials
        });
        
        if (username.error) {
          errors.push({ name, error: 'Failed to generate username' });
          continue;
        }
        
        const password = await supabase.rpc('generate_student_password');
        if (password.error) {
          errors.push({ name, error: 'Failed to generate password' });
          continue;
        }
        
        // Create unique email
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, '')}@student.languagegems.com`;
        
        // Create auth user
        const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
          email,
          password: password.data,
          email_confirm: true,
          user_metadata: {
            name: displayName,
            role: 'student',
            username: username.data
          }
        });
        
        if (authError) {
          errors.push({ name, error: authError.message });
          continue;
        }
        
        // Check if user profile already exists
        const { data: existingProfile } = await adminClient
          .from('user_profiles')
          .select('user_id')
          .eq('user_id', authUser.user.id)
          .single();

        // Create user profile only if it doesn't exist
        let profileError = null;
        if (!existingProfile) {
          const result = await adminClient
            .from('user_profiles')
            .insert({
              user_id: authUser.user.id,
              email,
              role: 'student',
              display_name: displayName,
              username: username.data,
              teacher_id: user.id,
              initial_password: password.data,
              school_initials: schoolInitials
            });
          profileError = result.error;
        }
        
        if (profileError) {
          errors.push({ name, error: profileError.message });
          continue;
        }
        
        // Enroll in class
        const { error: enrollError } = await adminClient
          .from('class_enrollments')
          .insert({
            class_id: classId,
            student_id: authUser.user.id,
            enrolled_at: new Date().toISOString(),
            status: 'active'
          });
        
        if (enrollError) {
          errors.push({ name, error: enrollError.message });
          continue;
        }
        
        // Success!
        results.push({
          name: displayName,
          username: username.data,
          password: password.data,
          userId: authUser.user.id
        });
        
      } catch (error: any) {
        errors.push({ 
          name: typeof studentInput === 'string' ? studentInput : studentInput.name || 'Unknown', 
          error: error.message 
        });
      }
    }

    return NextResponse.json({ 
      results,
      errors,
      message: `Successfully created ${results.length} student accounts`,
      total: results.length + errors.length
    });
  } catch (error: any) {
    console.error('Error in bulk student creation:', error);
    return NextResponse.json({ 
      error: 'Failed to create students', 
      details: error.message 
    }, { status: 500 });
  }
} 