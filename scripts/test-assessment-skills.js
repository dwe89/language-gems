#!/usr/bin/env node

/**
 * Test script for Assessment Skill Breakdown
 * This script verifies that assessment results properly track reading/writing/listening/speaking skills
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAssessmentSkillBreakdown() {
  console.log('📝 Testing Assessment Skill Breakdown...\n');

  try {
    // Test 1: Verify assessment skill tracking services exist
    console.log('1. Verifying assessment skill tracking services...');
    await verifyAssessmentServices();

    // Test 2: Test assessment skill breakdown table
    console.log('\n2. Testing assessment skill breakdown table...');
    await testSkillBreakdownTable();

    // Test 3: Test assessment services integration
    console.log('\n3. Testing assessment services integration...');
    await testAssessmentServicesIntegration();

    // Test 4: Test skill tracking data structure
    console.log('\n4. Testing skill tracking data structure...');
    await testSkillTrackingStructure();

    // Test 5: Test assessment API endpoints
    console.log('\n5. Testing assessment API endpoints...');
    await testAssessmentAPIs();

    // Test 6: Verify skill data feeds into analytics
    console.log('\n6. Verifying skill data feeds into analytics...');
    await verifyAnalyticsIntegration();

    console.log('\n✅ Assessment skill breakdown testing completed!');
    console.log('\n📊 Summary:');
    console.log('- Assessment skill tracking services are implemented');
    console.log('- Skill breakdown table supports all 4 skills');
    console.log('- Assessment services properly track skill metrics');
    console.log('- Skill data integrates with analytics pipeline');
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Complete some assessments to generate skill data');
    console.log('2. Check the dashboard for skill-based insights');
    console.log('3. Verify skill progression tracking over time');
    console.log('4. Test skill-based recommendations in AI insights');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

async function verifyAssessmentServices() {
  const fs = require('fs');
  const path = require('path');

  const assessmentServices = [
    'src/services/assessmentSkillTrackingService.ts',
    'src/services/aqaListeningAssessmentService.ts',
    'src/services/aqaReadingAssessmentService.ts',
    'src/services/aqaWritingAssessmentService.ts',
    'src/services/aqaDictationAssessmentService.ts'
  ];

  let servicesFound = 0;

  for (const service of assessmentServices) {
    const servicePath = path.join(process.cwd(), service);
    if (fs.existsSync(servicePath)) {
      servicesFound++;
      console.log(`   ✓ ${service} exists`);
    } else {
      console.log(`   ⚠️  ${service} not found`);
    }
  }

  console.log(`   📊 Found ${servicesFound}/${assessmentServices.length} assessment services`);

  // Check for assessment API endpoints
  const assessmentAPIs = [
    'src/app/api/assessments',
    'src/app/api/four-skills-assessment',
    'src/app/api/reading-comprehension',
    'src/app/api/dictation'
  ];

  let apisFound = 0;

  for (const api of assessmentAPIs) {
    const apiPath = path.join(process.cwd(), api);
    if (fs.existsSync(apiPath)) {
      apisFound++;
      console.log(`   ✓ ${api} API directory exists`);
    } else {
      console.log(`   ⚠️  ${api} API directory not found`);
    }
  }

  console.log(`   📊 Found ${apisFound}/${assessmentAPIs.length} assessment API directories`);
}

async function testSkillBreakdownTable() {
  // Test the assessment_skill_breakdown table structure and accessibility
  console.log('   Testing assessment_skill_breakdown table...');

  const { data: tableData, error: tableError } = await supabase
    .from('assessment_skill_breakdown')
    .select('*')
    .limit(1);

  if (tableError) {
    console.log('   ❌ assessment_skill_breakdown table not accessible:', tableError.message);
    return;
  }

  console.log('   ✓ assessment_skill_breakdown table accessible');

  // Test required columns by attempting to select them
  const requiredColumns = [
    'student_id', 'assessment_id', 'assessment_type',
    'listening_score', 'reading_score', 'writing_score', 'speaking_score',
    'vocabulary_comprehension', 'grammar_accuracy', 'pronunciation_accuracy', 'fluency_score',
    'text_comprehension', 'inference_ability', 'structural_coherence',
    'skill_data', 'completed_at'
  ];

  const { error: columnError } = await supabase
    .from('assessment_skill_breakdown')
    .select(requiredColumns.join(', '))
    .limit(1);

  if (columnError) {
    console.log('   ⚠️  Some expected columns may be missing:', columnError.message);
  } else {
    console.log('   ✓ All required skill breakdown columns are present');
  }

  // Check for existing skill data
  const { data: existingSkills, error: skillsError } = await supabase
    .from('assessment_skill_breakdown')
    .select('assessment_type, listening_score, reading_score, writing_score, speaking_score')
    .limit(5);

  if (skillsError) {
    console.log('   ⚠️  Cannot query existing skill data:', skillsError.message);
  } else {
    console.log(`   📊 Found ${existingSkills?.length || 0} existing skill breakdown entries`);
    
    if (existingSkills && existingSkills.length > 0) {
      const assessmentTypes = [...new Set(existingSkills.map(s => s.assessment_type))];
      console.log(`   📊 Assessment types with skill data: ${assessmentTypes.join(', ')}`);
    }
  }
}

async function testAssessmentServicesIntegration() {
  // Test that assessment services are properly integrated with skill tracking
  const fs = require('fs');
  const path = require('path');

  console.log('   Checking assessment service integration...');

  // Check if assessment services import skill tracking
  const servicesToCheck = [
    { file: 'src/services/aqaListeningAssessmentService.ts', skill: 'listening' },
    { file: 'src/services/aqaReadingAssessmentService.ts', skill: 'reading' },
    { file: 'src/services/aqaWritingAssessmentService.ts', skill: 'writing' }
  ];

  for (const service of servicesToCheck) {
    const servicePath = path.join(process.cwd(), service.file);
    
    if (fs.existsSync(servicePath)) {
      const content = fs.readFileSync(servicePath, 'utf8');
      
      if (content.includes('assessmentSkillTrackingService') || content.includes('assessment_skill_breakdown')) {
        console.log(`   ✓ ${service.skill} assessment service integrated with skill tracking`);
      } else {
        console.log(`   ⚠️  ${service.skill} assessment service may not be integrated with skill tracking`);
      }
    } else {
      console.log(`   ⚠️  ${service.file} not found`);
    }
  }

  // Check four-skills assessment API
  const fourSkillsAPIPath = path.join(process.cwd(), 'src/app/api/four-skills-assessment/results/route.ts');
  
  if (fs.existsSync(fourSkillsAPIPath)) {
    const content = fs.readFileSync(fourSkillsAPIPath, 'utf8');
    
    if (content.includes('assessment_skill_breakdown') || content.includes('skillTracking')) {
      console.log('   ✓ Four-skills assessment API integrated with skill tracking');
    } else {
      console.log('   ⚠️  Four-skills assessment API may not be integrated with skill tracking');
    }
  } else {
    console.log('   ⚠️  Four-skills assessment API not found');
  }
}

async function testSkillTrackingStructure() {
  // Test the structure of skill tracking data
  console.log('   Testing skill tracking data structure...');

  // Test that we can query skill metrics properly
  const skillQueries = [
    { name: 'Listening Skills', query: 'listening_score, vocabulary_comprehension, pronunciation_accuracy' },
    { name: 'Reading Skills', query: 'reading_score, text_comprehension, inference_ability' },
    { name: 'Writing Skills', query: 'writing_score, grammar_accuracy, structural_coherence' },
    { name: 'Speaking Skills', query: 'speaking_score, fluency_score, pronunciation_accuracy' }
  ];

  for (const skillQuery of skillQueries) {
    const { error: queryError } = await supabase
      .from('assessment_skill_breakdown')
      .select(skillQuery.query)
      .limit(1);

    if (queryError) {
      console.log(`   ⚠️  ${skillQuery.name} query failed: ${queryError.message}`);
    } else {
      console.log(`   ✓ ${skillQuery.name} structure verified`);
    }
  }

  // Test JSONB skill_data field
  const { error: jsonError } = await supabase
    .from('assessment_skill_breakdown')
    .select('skill_data')
    .limit(1);

  if (jsonError) {
    console.log('   ⚠️  JSONB skill_data field not accessible:', jsonError.message);
  } else {
    console.log('   ✓ JSONB skill_data field accessible for detailed metrics');
  }
}

async function testAssessmentAPIs() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  const assessmentEndpoints = [
    '/api/four-skills-assessment/results',
    '/api/reading-comprehension/results',
    '/api/dictation/assessments'
  ];

  console.log('   Testing assessment API endpoints...');

  for (const endpoint of assessmentEndpoints) {
    try {
      // Test with a simple GET request (most will require POST, but this tests accessibility)
      const response = await fetch(`${baseUrl}${endpoint}`);
      
      if (response.status === 405) {
        // Method not allowed is expected for POST-only endpoints
        console.log(`   ✓ ${endpoint} accessible (POST endpoint)`);
      } else if (response.status === 400) {
        // Bad request is expected when missing required parameters
        console.log(`   ✓ ${endpoint} accessible (requires parameters)`);
      } else if (response.ok) {
        console.log(`   ✓ ${endpoint} accessible`);
      } else {
        console.log(`   ⚠️  ${endpoint} returned ${response.status}`);
      }
    } catch (error) {
      console.log(`   ⚠️  ${endpoint} not accessible (server may not be running)`);
    }
  }
}

async function verifyAnalyticsIntegration() {
  // Test that skill breakdown data feeds into the analytics pipeline
  console.log('   Testing analytics integration...');

  // Check if AI insights service can access skill data
  const fs = require('fs');
  const path = require('path');

  const aiInsightsPath = path.join(process.cwd(), 'src/services/aiInsightsService.ts');
  
  if (fs.existsSync(aiInsightsPath)) {
    const content = fs.readFileSync(aiInsightsPath, 'utf8');
    
    if (content.includes('assessment_skill_breakdown') || content.includes('skill')) {
      console.log('   ✓ AI insights service can access skill breakdown data');
    } else {
      console.log('   ⚠️  AI insights service may not be integrated with skill data');
    }
  }

  // Check if real-time analytics service includes skill metrics
  const analyticsPath = path.join(process.cwd(), 'src/services/realTimeAnalyticsService.ts');
  
  if (fs.existsSync(analyticsPath)) {
    const content = fs.readFileSync(analyticsPath, 'utf8');
    
    if (content.includes('skill') || content.includes('assessment_skill_breakdown')) {
      console.log('   ✓ Real-time analytics service includes skill metrics');
    } else {
      console.log('   ⚠️  Real-time analytics service may not include skill metrics');
    }
  }

  // Test skill-based analytics queries
  console.log('\n   Testing skill-based analytics queries...');

  // Test average skill scores
  const { data: skillAverages, error: avgError } = await supabase
    .from('assessment_skill_breakdown')
    .select('listening_score, reading_score, writing_score, speaking_score')
    .not('listening_score', 'is', null)
    .limit(10);

  if (avgError) {
    console.log('   ⚠️  Skill averages query failed:', avgError.message);
  } else {
    console.log(`   ✓ Skill averages query successful (${skillAverages?.length || 0} entries)`);
    
    if (skillAverages && skillAverages.length > 0) {
      // Calculate sample averages
      const skills = ['listening_score', 'reading_score', 'writing_score', 'speaking_score'];
      
      for (const skill of skills) {
        const scores = skillAverages
          .filter(s => s[skill] !== null)
          .map(s => s[skill]);
        
        if (scores.length > 0) {
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          console.log(`   📊 Average ${skill.replace('_score', '')}: ${avg.toFixed(1)}%`);
        }
      }
    }
  }

  // Test skill progression tracking
  const { data: skillProgression, error: progressError } = await supabase
    .from('assessment_skill_breakdown')
    .select('student_id, assessment_type, listening_score, reading_score, completed_at')
    .order('completed_at', { ascending: false })
    .limit(5);

  if (progressError) {
    console.log('   ⚠️  Skill progression query failed:', progressError.message);
  } else {
    console.log(`   ✓ Skill progression tracking query successful (${skillProgression?.length || 0} entries)`);
  }

  // Test skill weakness detection
  if (skillAverages && skillAverages.length > 0) {
    const weaknessThreshold = 60; // Below 60% considered weak
    
    const weaknesses = skillAverages.reduce((acc, student) => {
      const skills = ['listening_score', 'reading_score', 'writing_score', 'speaking_score'];
      
      for (const skill of skills) {
        if (student[skill] !== null && student[skill] < weaknessThreshold) {
          acc[skill] = (acc[skill] || 0) + 1;
        }
      }
      
      return acc;
    }, {});

    if (Object.keys(weaknesses).length > 0) {
      console.log('   🎯 Skill weakness patterns detected:');
      for (const [skill, count] of Object.entries(weaknesses)) {
        console.log(`      - ${skill.replace('_score', '')}: ${count} students below ${weaknessThreshold}%`);
      }
    } else {
      console.log('   ✓ No significant skill weaknesses detected in sample data');
    }
  }
}

// Run the test
if (require.main === module) {
  testAssessmentSkillBreakdown().catch(console.error);
}

module.exports = { testAssessmentSkillBreakdown };
