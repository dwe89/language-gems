#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Check both possible teacher accounts
const TEACHER_EMAILS = [
  'f032c673-a159-40c1-b19d-542e2e2db11f', // detienne@felpham.org.uk
  'danieletienne89@gmail.com'
];

async function diagnose() {
  console.log('🔍 Diagnosing School Leaderboard');
  console.log('');

  // First, find all teachers
  const { data: allProfiles } = await supabase
    .from('user_profiles')
    .select('user_id, email, school_initials')
    .eq('role', 'teacher');

  console.log('👥 All Teachers:');
  allProfiles?.forEach(p => {
    console.log(`  ${p.email} (${p.user_id}) - School: ${p.school_initials || 'none'}`);
  });
  console.log('');

  // Now check classes for each teacher
  for (const profile of allProfiles || []) {
    const TEACHER_ID = profile.user_id;
    console.log(`\n📚 Checking ${profile.email}...`);

  // 1. Check teacher's classes
  const { data: classes, error: classError } = await supabase
    .from('classes')
    .select('id, name, organization_id')
    .eq('teacher_id', TEACHER_ID);

  if (classError) {
    console.error('❌ Error fetching classes:', classError);
    return;
  }

  console.log('📚 Teacher\'s Classes:', classes?.length || 0);
  classes?.forEach(c => {
    console.log(`  - ${c.name}`);
    console.log(`    ID: ${c.id}`);
    console.log(`    Org ID: ${c.organization_id || 'NOT SET'}`);
  });
  console.log('');

  if (!classes || classes.length === 0) {
    console.log('⚠️  Teacher has no classes');
    return;
  }

  // 2. Check organization
  const orgId = classes[0].organization_id;
  
  if (!orgId) {
    console.log('⚠️  First class has no organization_id');
    return;
  }

  console.log('🏫 Organization ID:', orgId);

  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single();

  if (orgError) {
    console.error('❌ Error fetching organization:', orgError);
  } else {
    console.log('   Name:', org.name);
    console.log('   Created:', org.created_at);
  }
  console.log('');

  // 3. Check all classes in organization
  const { data: allOrgClasses, error: allClassError } = await supabase
    .from('classes')
    .select('id, name, teacher_id')
    .eq('organization_id', orgId);

  if (allClassError) {
    console.error('❌ Error fetching org classes:', allClassError);
    return;
  }

  console.log('📋 All Classes in Organization:', allOrgClasses?.length || 0);
  allOrgClasses?.forEach(c => {
    console.log(`  - ${c.name} (${c.teacher_id === TEACHER_ID ? 'YOUR CLASS' : 'other teacher'})`);
  });
  console.log('');

  // 4. Check enrollments
  const classIds = allOrgClasses?.map(c => c.id) || [];
  
  const { data: enrollments, error: enrollError } = await supabase
    .from('class_enrollments')
    .select('student_id, class_id')
    .in('class_id', classIds);

  if (enrollError) {
    console.error('❌ Error fetching enrollments:', enrollError);
    return;
  }

  console.log('👥 Total Enrollments across org:', enrollments?.length || 0);
  
  // Group by class
  const byClass = new Map<string, number>();
  enrollments?.forEach(e => {
    byClass.set(e.class_id, (byClass.get(e.class_id) || 0) + 1);
  });

  allOrgClasses?.forEach(c => {
    const count = byClass.get(c.id) || 0;
    console.log(`  ${c.name}: ${count} students`);
  });
  console.log('');

  // 5. Check unique students
  const uniqueStudents = new Set(enrollments?.map(e => e.student_id) || []);
  console.log('✅ Unique Students in Organization:', uniqueStudents.size);
  console.log('');

  if (uniqueStudents.size === 0) {
    console.log('⚠️  No students found in any classes!');
  } else {
    console.log('✅ School-wide leaderboard should show', uniqueStudents.size, 'students');
  }
  } // end of loop
}

diagnose().catch(console.error);
