#!/usr/bin/env node

// Script to fix the test student password using Supabase Admin Client
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function fixTestStudentPassword() {
  console.log('🔧 Fixing test student password...\n');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing Supabase configuration');
    console.log('URL:', supabaseUrl ? 'Available' : 'Missing');
    console.log('Service Key:', serviceRoleKey ? 'Available' : 'Missing');
    return;
  }
  
  // Create admin client
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  const testStudentId = 'f297fa49-f6e5-42cc-a471-6073f37aed0a';
  const newPassword = 'testpass123';
  
  try {
    console.log('🔍 First, check if auth user exists...');
    
    // Check if the auth user exists
    const { data: existingUser, error: getUserError } = await adminClient.auth.admin.getUserById(testStudentId);
    
    if (getUserError || !existingUser.user) {
      console.log('👤 Auth user does not exist, creating new auth user...');
      
      // Create the auth user without specifying ID - let Supabase generate it
      const { data: createData, error: createError } = await adminClient.auth.admin.createUser({
        email: 'teststudent@languagegems.com',
        password: newPassword,
        email_confirm: true,
        user_metadata: {
          role: 'student',
          username: 'teststudent'
        }
      });
      
      if (createError) {
        console.error('❌ Failed to create auth user:', createError);
        return;
      }
      
      console.log('✅ Successfully created auth user');
      console.log('📊 New auth user ID:', createData.user.id);
      
      // Update the user_profiles table to use the new auth user ID
      const { error: updateProfileError } = await adminClient
        .from('user_profiles')
        .update({ user_id: createData.user.id })
        .eq('user_id', testStudentId);
      
      if (updateProfileError) {
        console.error('⚠️  Warning: Failed to update profile user_id:', updateProfileError);
      } else {
        console.log('✅ Successfully updated profile to use new auth user ID');
      }
      
    } else {
      console.log('👤 Auth user exists, updating password...');
      
      // Update the user's password in Supabase Auth
      const { data, error } = await adminClient.auth.admin.updateUserById(
        testStudentId,
        { password: newPassword }
      );
      
      if (error) {
        console.error('❌ Failed to update password:', error);
        return;
      }
      
      console.log('✅ Successfully updated auth password');
    }
    
    console.log('✅ Successfully updated auth password');
    console.log('📊 User ID:', testStudentId);
    
    // Also update the initial_password in user_profiles for consistency
    const { error: profileError } = await adminClient
      .from('user_profiles')
      .update({ initial_password: newPassword })
      .eq('user_id', testStudentId);
    
    if (profileError) {
      console.error('⚠️  Warning: Failed to update profile password:', profileError);
    } else {
      console.log('✅ Successfully updated profile initial_password');
    }
    
    console.log('\n🎉 Test student password fixed! You can now login with:');
    console.log('   Username: teststudent');
    console.log('   Password: testpass123');
    console.log('   School Code: TEST');
    
  } catch (error) {
    console.error('💥 ERROR: Exception during fix', error);
  }
}

fixTestStudentPassword();
