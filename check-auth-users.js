#!/usr/bin/env node

// Script to check existing auth users and clean up
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function checkAuthUsers() {
  console.log('🔍 Checking existing auth users...\n');
  
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
    // List all users
    const { data, error } = await adminClient.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Failed to list users:', error);
      return;
    }
    
    console.log('👥 Found', data.users.length, 'auth users:');
    
    data.users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Created: ${user.created_at}`);
      console.log('');
    });
    
    // Look for test student specifically
    const testUser = data.users.find(u => u.email === 'teststudent@languagegems.com');
    if (testUser) {
      console.log('🎯 Found existing test student auth user:', testUser.id);
      console.log('   Email:', testUser.email);
      console.log('   This might be causing the conflict');
      
      // Delete the existing user
      console.log('🗑️  Deleting existing test student auth user...');
      const { error: deleteError } = await adminClient.auth.admin.deleteUser(testUser.id);
      
      if (deleteError) {
        console.error('❌ Failed to delete user:', deleteError);
      } else {
        console.log('✅ Successfully deleted existing auth user');
      }
    } else {
      console.log('🔍 No existing test student auth user found');
    }
    
  } catch (error) {
    console.error('💥 ERROR: Exception during check', error);
  }
}

checkAuthUsers();
