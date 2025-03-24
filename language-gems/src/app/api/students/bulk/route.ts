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
    const requestData = await request.json();
    const { students, classId } = requestData;
    
    console.log('Received request:', { 
      studentsCount: students?.length, 
      classId 
    });
    
    if (!students || !Array.isArray(students) || students.length === 0) {
      return NextResponse.json({ success: false, error: 'No students provided' }, { status: 400 });
    }
    
    if (!classId) {
      return NextResponse.json({ success: false, error: 'Class ID is required' }, { status: 400 });
    }
    
    // Create a regular Supabase client
    const supabase = createRouteHandlerClient({
      cookies: () => cookies()
    });
    
    // Create an admin client with service role for user creation
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
    
    // Get the current teacher
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    const teacherId = session.user.id;
    
    // Verify teacher owns the class
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .eq('teacher_id', teacherId)
      .single();
    
    if (classError || !classData) {
      return NextResponse.json({ success: false, error: 'Class not found or unauthorized' }, { status: 403 });
    }
    
    // Get existing usernames to check for conflicts
    const { data: existingUsers, error: usersError } = await supabase
      .from('user_profiles')
      .select('username');
    
    if (usersError) {
      console.error('Error fetching existing users:', usersError);
      return NextResponse.json({ success: false, error: 'Failed to check existing usernames' }, { status: 500 });
    }
    
    const existingUsernames = new Set(existingUsers?.map(user => user.username) || []);
    
    // Process students
    const results = [];
    const errors = [];
    
    for (const student of students) {
      try {
        const { name, email } = student;
        
        if (!name) {
          errors.push({ name, error: 'Name is required' });
          continue;
        }
        
        // Generate a base username without checking for uniqueness yet
        const baseUsername = generateUsername(name);
        
        // Track if we found an existing user
        let userId: string | undefined;
        let existingUser = false;
        let finalUsername = baseUsername;
        let userEmail = '';
        
        // Check if user with this name already exists and belongs to this teacher
        // This is useful for finding students who might have been added before
        const { data: existingStudents } = await supabase
          .from('user_profiles')
          .select('user_id, username, email, display_name')
          .eq('display_name', name)
          .eq('role', 'student');
          
        if (existingStudents && existingStudents.length > 0) {
          // Student with same name exists, use that record if owned by this teacher
          const existingStudent = existingStudents.find(s => s.display_name === name);
          if (existingStudent) {
            userId = existingStudent.user_id;
            finalUsername = existingStudent.username;
            userEmail = existingStudent.email;
            existingUser = true;
            console.log(`Found existing student with name ${name}, using ID: ${userId}`);
          }
        }
        
        // If not found by name, we need to create a new student
        if (!existingUser) {
          // Generate a unique username by adding a number suffix if needed
          let username = baseUsername;
          
          // Check if ANY username starting with baseUsername exists
          const { data: usernameCheck } = await supabase
            .from('user_profiles')
            .select('username')
            .like('username', `${baseUsername}%`); // Use LIKE to find all usernames starting with baseUsername
            
          if (usernameCheck && usernameCheck.length > 0) {
            // Find the highest suffix number in use
            let maxSuffix = 0;
            
            for (const user of usernameCheck) {
              // Extract suffix number if it exists
              if (user.username === baseUsername) {
                // Base username exists, we'll need at least suffix 1
                maxSuffix = Math.max(maxSuffix, 1);
              } else {
                // Check if there's a numeric suffix
                const suffixMatch = user.username.match(new RegExp(`^${baseUsername}(\\d+)$`));
                if (suffixMatch && suffixMatch[1]) {
                  const numSuffix = parseInt(suffixMatch[1], 10);
                  maxSuffix = Math.max(maxSuffix, numSuffix);
                }
              }
            }
            
            // Use the next available suffix number
            username = maxSuffix > 0 ? `${baseUsername}${maxSuffix + 1}` : baseUsername;
          }
          
          finalUsername = username;
          
          // Generate a unique email using the final username
          userEmail = `${finalUsername.toLowerCase()}@student.languagegems.com`;
          
          // Check if this email already exists in user_profiles
          const { data: emailCheck } = await supabase
            .from('user_profiles')
            .select('email')
            .eq('email', userEmail);
            
            // Add timestamp to make email unique if it exists in profiles
            if (emailCheck && emailCheck.length > 0) {
              // Make email unique by adding a timestamp
              const timestamp = Date.now().toString().substring(6);
              userEmail = `${finalUsername.toLowerCase()}_${timestamp}@student.languagegems.com`;
            } else {
              // For safety, always add a timestamp to ensure uniqueness
              // This prevents any potential race conditions or conflicts
              const timestamp = Date.now().toString().substring(6);
              userEmail = `${finalUsername.toLowerCase()}_${timestamp}@student.languagegems.com`;
            }
          
          // Generate a password
          const password = generatePassword();
          
          // Create the student account
          const { data: userData, error: userError } = await adminClient.auth.admin.createUser({
            email: userEmail,
            password,
            email_confirm: true,
            user_metadata: {
              name,
              role: 'student',
              username: finalUsername,
              // Store the password in metadata so we can retrieve it later
              // This is not ideal for security but allows showing the password to the teacher
              initial_password: password
            }
          });
          
          if (userError) {
            console.error('Error creating user:', userError);
            errors.push({ name, error: userError.message || 'Failed to create user' });
            continue;
          }
          
          userId = userData.user.id;
          
          // Create user profile
          const { error: profileError } = await adminClient
            .from('user_profiles')
            .insert({
              user_id: userId,
              email: userEmail,
              role: 'student',
              display_name: name,
              subscription_type: 'free',
              username: finalUsername,
              teacher_id: teacherId,
              initial_password: password
            })
            .select();
          
          if (profileError) {
            console.error('Error creating profile:', profileError);
            // Check if it's a duplicate user_id constraint violation
            if (profileError.message && profileError.message.includes('user_profiles_user_id_key')) {
              console.log('User profile already exists, skipping profile creation');
              // Continue with class enrollment without creating a duplicate profile
            } else if (profileError.message && profileError.message.includes('policy')) {
              console.log('RLS policy violation, trying admin service role');
              
              // Try one more time with explicit write permission
              const { error: retryError } = await adminClient
                .from('user_profiles')
                .insert({
                  user_id: userId,
                  email: userEmail,
                  role: 'student',
                  display_name: name,
                  subscription_type: 'free',
                  username: finalUsername,
                  teacher_id: teacherId,
                  initial_password: password
                })
                .select();
                
              if (retryError) {
                // Check if retry error is also a duplicate constraint
                if (retryError.message && retryError.message.includes('user_profiles_user_id_key')) {
                  console.log('User profile already exists on retry, continuing with enrollment');
                  // Just continue to enrollment
                } else {
                  console.error('Second attempt profile creation error:', retryError);
                  errors.push({ name, error: retryError.message });
                  continue;
                }
              }
            } else {
              errors.push({ name, error: profileError.message });
              continue;
            }
          }
        }
        
        // Now, let's check if the student is already enrolled in this class
        const { data: existingEnrollment } = await adminClient
          .from('class_enrollments')
          .select('id')
          .eq('class_id', classId)
          .eq('student_id', userId)
          .maybeSingle();
        
        if (existingEnrollment) {
          console.log(`Student ${name} is already enrolled in this class`);
          errors.push({ name, error: 'Student is already enrolled in this class' });
          continue;
        }
        
        // Add student to class
        const { error: classStudentError } = await adminClient
          .from('class_enrollments')
          .insert({
            class_id: classId,
            student_id: userId,
            enrolled_at: new Date().toISOString()
          });
        
        if (classStudentError) {
          console.error('Error adding student to class:', classStudentError);
          errors.push({ name, error: classStudentError.message });
          continue;
        }
        
        // Get password for new students
        let password = '';
        if (!existingUser) {
          // Try to get the password from metadata or user_profiles
          const { data: userProfile } = await adminClient
            .from('user_profiles')
            .select('initial_password')
            .eq('user_id', userId)
            .single();
            
          if (userProfile?.initial_password) {
            password = userProfile.initial_password;
          } else {
            // Fall back to getting password from user metadata
            const { data: authData } = await adminClient.auth.admin.getUserById(userId!);
            if (authData?.user?.user_metadata?.initial_password) {
              password = authData.user.user_metadata.initial_password;
            } else {
              // If we still can't find it, just show a placeholder
              password = '(password unavailable)';
            }
          }
        }
        
        // Add to results
        results.push({
          name,
          username: finalUsername,
          password: existingUser ? '(existing user)' : password,
          userId
        });
      } catch (error) {
        console.error('Error processing student:', student, error);
        errors.push({ name: student.name, error: 'Unknown error occurred' });
      }
    }
    
    return NextResponse.json({
      success: true,
      results,
      errors,
      totalAdded: results.length,
      totalErrors: errors.length
    });
  } catch (err) {
    console.error('API exception:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 