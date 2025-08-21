/**
 * Test script to verify the signup process with school code assignment
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

async function testSignupProcess() {
  console.log('🔍 Testing signup process with school code...\n');

  // Test data
  const testEmail = `test-teacher-${Date.now()}@test.com`;
  const testPassword = 'Test123456!';
  const testName = 'Test Teacher';
  const testSchoolName = 'Test Academy';
  const testSchoolCode = 'TESTACAD';

  try {
    console.log('📝 Test signup data:');
    console.log(`Email: ${testEmail}`);
    console.log(`School: ${testSchoolName}`);
    console.log(`School Code: ${testSchoolCode}\n`);

    // Simulate the signup API call
    const response = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        name: testName,
        schoolName: testSchoolName,
        schoolCode: testSchoolCode,
        role: 'teacher'
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Signup failed:', result);
      return;
    }

    console.log('✅ Signup API response:', result);

    // Wait a moment for database operations to complete
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if user was created properly
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Find the newly created user
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) {
      console.error('❌ Error fetching users:', userError);
      return;
    }

    const newUser = users.users.find(u => u.email === testEmail);
    if (!newUser) {
      console.error('❌ User not found in auth.users table');
      return;
    }

    console.log(`✅ User created with ID: ${newUser.id}`);

    // Check user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', newUser.id)
      .single();

    if (profileError) {
      console.error('❌ Error fetching user profile:', profileError);
      return;
    }

    console.log('📋 User Profile:');
    console.log(`  Email: ${profile.email}`);
    console.log(`  Role: ${profile.role}`);
    console.log(`  Display Name: ${profile.display_name}`);
    console.log(`  School Initials: ${profile.school_initials || 'NULL'}`);

    // Check if school code was added to school_codes table
    const { data: schoolCodes, error: schoolError } = await supabase
      .from('school_codes')
      .select('*')
      .eq('code', testSchoolCode);

    if (schoolError) {
      console.error('❌ Error fetching school codes:', schoolError);
    } else if (schoolCodes.length > 0) {
      console.log('✅ School code found in school_codes table:');
      console.log(`  Code: ${schoolCodes[0].code}`);
      console.log(`  Name: ${schoolCodes[0].school_name}`);
      console.log(`  Initials: ${schoolCodes[0].school_initials}`);
    } else {
      console.log('❌ School code NOT found in school_codes table');
    }

    // Summary
    console.log('\n📊 TEST RESULTS:');
    console.log('================');
    
    const hasSchoolCode = profile.school_initials === testSchoolCode;
    const schoolCodeInTable = schoolCodes && schoolCodes.length > 0;
    
    console.log(`✅ User Created: YES`);
    console.log(`✅ Profile Created: YES`);
    console.log(`${hasSchoolCode ? '✅' : '❌'} School Code in Profile: ${hasSchoolCode ? 'YES' : 'NO'}`);
    console.log(`${schoolCodeInTable ? '✅' : '❌'} School Code in Table: ${schoolCodeInTable ? 'YES' : 'NO'}`);
    
    if (hasSchoolCode && schoolCodeInTable) {
      console.log('\n🎉 SIGNUP FIX: SUCCESS!');
      console.log('The school code is now properly assigned during signup.');
    } else {
      console.log('\n❌ SIGNUP FIX: FAILED!');
      console.log('The school code assignment is still not working correctly.');
    }

    // Cleanup - delete the test user
    console.log('\n🧹 Cleaning up test user...');
    const { error: deleteError } = await supabase.auth.admin.deleteUser(newUser.id);
    if (deleteError) {
      console.error('❌ Error deleting test user:', deleteError);
    } else {
      console.log('✅ Test user deleted successfully');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Check if environment variables are loaded
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables. Make sure .env.local is loaded.');
  process.exit(1);
}

testSignupProcess();
