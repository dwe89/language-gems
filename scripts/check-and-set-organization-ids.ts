#!/usr/bin/env tsx

/**
 * Check and Set Organization IDs for Classes
 * 
 * This script checks if classes have organization_id set and creates/assigns
 * organizations based on school_initials from user profiles.
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { randomUUID } from 'crypto';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log('🔍 Checking classes and organization IDs...\n');

  // 1. Check current state
  const { data: classes, error: classesError } = await supabase
    .from('classes')
    .select('id, name, teacher_id, organization_id');

  if (classesError) {
    console.error('❌ Error fetching classes:', classesError);
    return;
  }

  console.log(`📊 Found ${classes.length} total classes`);
  
  const classesWithOrg = classes.filter(c => c.organization_id);
  const classesWithoutOrg = classes.filter(c => !c.organization_id);
  
  console.log(`✅ ${classesWithOrg.length} classes have organization_id`);
  console.log(`⚠️  ${classesWithoutOrg.length} classes missing organization_id\n`);

  if (classesWithoutOrg.length === 0) {
    console.log('✅ All classes have organization_id set!');
    return;
  }

  // 2. Get teacher profiles to find school_initials
  const teacherIds = [...new Set(classesWithoutOrg.map(c => c.teacher_id))];
  
  const { data: profiles, error: profilesError } = await supabase
    .from('user_profiles')
    .select('user_id, email, school_initials')
    .in('user_id', teacherIds);

  if (profilesError) {
    console.error('❌ Error fetching profiles:', profilesError);
    return;
  }

  console.log('👥 Teachers without organization_id on their classes:');
  profiles.forEach(p => {
    const classCount = classesWithoutOrg.filter(c => c.teacher_id === p.user_id).length;
    console.log(`  - ${p.email}: ${classCount} classes, school_initials: ${p.school_initials || 'NOT SET'}`);
  });

  // 3. Group by school_initials
  const schoolGroups = new Map<string, string[]>();
  
  classesWithoutOrg.forEach(cls => {
    const profile = profiles.find(p => p.user_id === cls.teacher_id);
    const schoolKey = profile?.school_initials || 'NO_SCHOOL';
    
    if (!schoolGroups.has(schoolKey)) {
      schoolGroups.set(schoolKey, []);
    }
    schoolGroups.get(schoolKey)!.push(cls.id);
  });

  console.log('\n🏫 Classes grouped by school:');
  schoolGroups.forEach((classIds, schoolKey) => {
    console.log(`  ${schoolKey}: ${classIds.length} classes`);
  });

  // 4. Create organizations and assign them
  console.log('\n🔨 Creating/assigning organizations...\n');

  for (const [schoolKey, classIds] of schoolGroups.entries()) {
    if (schoolKey === 'NO_SCHOOL') {
      console.log(`⚠️  Skipping ${classIds.length} classes with no school_initials`);
      continue;
    }

    // Create a UUID for the organization
    const orgId = randomUUID();
    
    console.log(`  Creating organization for ${schoolKey}...`);
    console.log(`  Organization ID: ${orgId}`);

    // First, check if organizations table exists and create the organization
    const { error: orgError } = await supabase
      .from('organizations')
      .insert({
        id: orgId,
        name: schoolKey,
        created_at: new Date().toISOString()
      });

    if (orgError) {
      console.log(`  ⚠️  Could not create organization record (table may not exist):`, orgError.message);
      console.log(`  ℹ️  Trying to update classes directly with organization_id...`);
    } else {
      console.log(`  ✅ Created organization record`);
    }
    
    console.log(`  Updating ${classIds.length} classes...`);

    // Update all classes for this school
    const { error: updateError } = await supabase
      .from('classes')
      .update({ organization_id: orgId })
      .in('id', classIds);

    if (updateError) {
      console.error(`  ❌ Error updating classes for ${schoolKey}:`, updateError);
    } else {
      console.log(`  ✅ Successfully assigned organization_id to ${classIds.length} classes\n`);
    }
  }

  // 5. Verify the changes
  console.log('🔍 Verifying changes...\n');
  
  const { data: updatedClasses, error: verifyError } = await supabase
    .from('classes')
    .select('id, name, teacher_id, organization_id');

  if (verifyError) {
    console.error('❌ Error verifying:', verifyError);
    return;
  }

  const nowWithOrg = updatedClasses.filter(c => c.organization_id);
  const stillWithoutOrg = updatedClasses.filter(c => !c.organization_id);

  console.log(`✅ ${nowWithOrg.length} classes now have organization_id`);
  console.log(`⚠️  ${stillWithoutOrg.length} classes still without organization_id`);

  if (stillWithoutOrg.length > 0) {
    console.log('\n⚠️  Classes still missing organization_id:');
    stillWithoutOrg.forEach(c => {
      console.log(`  - ${c.name} (ID: ${c.id})`);
    });
  }

  console.log('\n✅ Done!');
}

main().catch(console.error);
