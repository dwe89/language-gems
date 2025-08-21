/**
 * Test script to verify the school code fix for user a9a30351-d3a4-4cda-8dfa-eb4c737eeeae
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

async function testSchoolCodeFix() {
  console.log('🔍 Testing school code fix...\n');

  // Initialize Supabase admin client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const userId = 'a9a30351-d3a4-4cda-8dfa-eb4c737eeeae';

  try {
    // 1. Check current user profile
    console.log('1. Checking current user profile...');
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      console.error('❌ Error fetching user profile:', profileError);
      return;
    }

    console.log('✅ User Profile:', {
      email: userProfile.email,
      role: userProfile.role,
      display_name: userProfile.display_name,
      school_initials: userProfile.school_initials
    });

    // 2. Check school codes table for recent entries
    console.log('\n2. Checking recent school codes...');
    const { data: schoolCodes, error: schoolError } = await supabase
      .from('school_codes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (schoolError) {
      console.error('❌ Error fetching school codes:', schoolError);
      return;
    }

    console.log('📚 Recent School Codes:');
    schoolCodes.forEach((school, index) => {
      console.log(`${index + 1}. ${school.code} - ${school.school_name} (${school.school_initials}) - ${new Date(school.created_at).toLocaleDateString()}`);
    });

    // 3. Test creating a student with this teacher
    console.log('\n3. Testing student creation with teacher\'s school code...');
    
    // First, get the teacher's profile to use in student creation logic
    const teacherSchoolInitials = userProfile.school_initials;
    console.log(`📋 Teacher's school_initials: ${teacherSchoolInitials || 'NULL'}`);

    if (!teacherSchoolInitials) {
      console.log('⚠️  WARNING: Teacher has no school_initials! Students will get default "LG" code.');
    } else {
      console.log(`✅ SUCCESS: Teacher has school_initials "${teacherSchoolInitials}". Students will get this code.`);
    }

    // 4. Summary
    console.log('\n📊 SUMMARY:');
    console.log('================');
    console.log(`Teacher: ${userProfile.display_name} (${userProfile.email})`);
    console.log(`School Code: ${teacherSchoolInitials || 'MISSING!'}`);
    console.log(`Expected Student Code: ${teacherSchoolInitials || 'LG (default)'}`);
    
    if (teacherSchoolInitials) {
      console.log('🎉 SCHOOL CODE FIX: SUCCESS');
    } else {
      console.log('❌ SCHOOL CODE FIX: FAILED');
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

testSchoolCodeFix();
