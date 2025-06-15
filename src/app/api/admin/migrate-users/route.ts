import { createClient } from '../../../../lib/supabase-server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { generateUsername } from '../../../../lib/utils';

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
    // Only allow authenticated teachers to run this
    const supabase = await createClient();

    // Create an admin client with service role for user updates
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
    
    // Get the current user and ensure they are a teacher
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    const teacherId = session.user.id;
    
    // Check if current user is a teacher
    const { data: teacherData } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', teacherId)
      .eq('role', 'teacher')
      .single();
      
    if (!teacherData) {
      return NextResponse.json({ success: false, error: 'Only teachers can migrate users' }, { status: 403 });
    }
    
    // Get all student profiles with missing usernames, passwords, or teacher_id
    const { data: studentsToMigrate, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'student')
      .or('username.is.null,teacher_id.is.null,initial_password.is.null')
      .order('id');
      
    if (fetchError) {
      console.error('Error fetching students:', fetchError);
      return NextResponse.json({ success: false, error: 'Failed to fetch students' }, { status: 500 });
    }
    
    console.log(`Found ${studentsToMigrate.length} students to migrate`);
    
    const results = [];
    
    // Process each student
    for (const student of studentsToMigrate) {
      try {
        const updates: any = {};
        
        // Generate username if missing
        if (!student.username) {
          // Generate base username from display name
          let baseUsername;
          if (student.display_name.includes('@')) {
            // Handle email addresses as display names
            const emailParts = student.display_name.split('@');
            baseUsername = emailParts[0];
          } else {
            baseUsername = generateUsername(student.display_name);
          }
          
          // Make sure username is unique
          const { data: usernameCheck } = await supabase
            .from('user_profiles')
            .select('username')
            .like('username', `${baseUsername}%`);
          
          let finalUsername = baseUsername;
          
          if (usernameCheck && usernameCheck.length > 0) {
            // Find the highest suffix number in use
            let maxSuffix = 0;
            
            for (const user of usernameCheck) {
              if (user.username === baseUsername) {
                maxSuffix = Math.max(maxSuffix, 1);
              } else {
                const suffixMatch = user.username.match(new RegExp(`^${baseUsername}(\\d+)$`));
                if (suffixMatch && suffixMatch[1]) {
                  const numSuffix = parseInt(suffixMatch[1], 10);
                  maxSuffix = Math.max(maxSuffix, numSuffix);
                }
              }
            }
            
            finalUsername = maxSuffix > 0 ? `${baseUsername}${maxSuffix + 1}` : baseUsername;
          }
          
          updates.username = finalUsername;
        }
        
        // Set teacher_id if missing
        if (!student.teacher_id) {
          updates.teacher_id = teacherId;
        }
        
        // Generate and store password if missing
        if (!student.initial_password) {
          const password = generatePassword();
          updates.initial_password = password;
          
          try {
            // Update auth metadata as well
            await adminClient.auth.admin.updateUserById(student.user_id, {
              user_metadata: {
                initial_password: password,
                username: updates.username || student.username
              }
            });
          } catch (authError) {
            console.warn('Could not update auth metadata:', authError);
          }
        }
        
        // Only update if we have changes
        if (Object.keys(updates).length > 0) {
          // Update the profile
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', student.id);
          
          if (updateError) {
            console.error(`Error updating student ${student.id}:`, updateError);
            results.push({
              id: student.id,
              display_name: student.display_name,
              error: updateError.message
            });
          } else {
            results.push({
              id: student.id,
              display_name: student.display_name,
              updates
            });
          }
        }
      } catch (error) {
        console.error(`Error processing student ${student.id}:`, error);
        results.push({
          id: student.id,
          display_name: student.display_name,
          error: 'Unknown error occurred'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      processed: studentsToMigrate.length,
      results
    });
    
  } catch (err) {
    console.error('API exception:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 