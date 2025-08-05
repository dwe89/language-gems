#!/usr/bin/env node

// Script to create test student from scratch
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function createTestStudent() {
  console.log('🎯 Creating test student from scratch...\n');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing Supabase configuration');
    return;
  }
  
  // Create admin client
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  try {
    console.log('👤 Creating auth user...');
    
    // Create the auth user with metadata
    const { data: createData, error: createError } = await adminClient.auth.admin.createUser({
      email: 'teststudent.new@languagegems.com',
      password: 'testpass123',
      email_confirm: true,
      user_metadata: {
        role: 'student',
        name: 'Test Student'
      }
    });
    
    if (createError) {
      console.error('❌ Failed to create auth user:', createError);
      return;
    }
    
    console.log('✅ Successfully created auth user');
    console.log('📊 Auth user ID:', createData.user.id);
    
    // Wait a moment for the trigger to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the user profile with student-specific data
    const { error: updateError } = await adminClient
      .from('user_profiles')
      .update({
        username: 'teststudent',
        email: 'teststudent@languagegems.com', // Keep the original email in profile
        school_initials: 'TEST',
        initial_password: 'testpass123',
        role: 'student'
      })
      .eq('user_id', createData.user.id);
    
    if (updateError) {
      console.error('❌ Failed to update user profile:', updateError);
      return;
    }
    
    console.log('✅ Successfully updated user profile');
    
    // Verify the final result
    const { data: finalProfile, error: fetchError } = await adminClient
      .from('user_profiles')
      .select('*')
      .eq('user_id', createData.user.id)
      .single();
    
    if (fetchError) {
      console.error('❌ Failed to fetch final profile:', fetchError);
      return;
    }
    
    console.log('\n🎉 Test student created successfully!');
    console.log('📊 Final profile:');
    console.log('   User ID:', finalProfile.user_id);
    console.log('   Username:', finalProfile.username);
    console.log('   Email:', finalProfile.email);
    console.log('   School Code:', finalProfile.school_initials);
    console.log('   Password:', finalProfile.initial_password);
    console.log('   Role:', finalProfile.role);
    
    console.log('\n🔑 Login credentials:');
    console.log('   Username: teststudent');
    console.log('   Password: testpass123');
    console.log('   School Code: TEST');
    
  } catch (error) {
    console.error('💥 ERROR: Exception during creation', error);
  }
}

createTestStudent();
