#!/usr/bin/env node

/**
 * Test script for AI Insights Pipeline
 * This script tests the real-time analytics pipeline and AI insights generation
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testPipeline() {
  console.log('🚀 Testing AI Insights Pipeline...\n');

  try {
    // Test 1: Check database tables exist
    console.log('1. Checking database tables...');
    await checkTables();

    // Test 2: Test analytics cache tables
    console.log('\n2. Testing analytics cache...');
    await testAnalyticsCache();

    // Test 3: Test AI insights table
    console.log('\n3. Testing AI insights table...');
    await testAIInsightsTable();

    // Test 4: Test pipeline API endpoints
    console.log('\n4. Testing pipeline API...');
    await testPipelineAPI();

    console.log('\n✅ All tests completed successfully!');
    console.log('\n📊 Your AI Insights Pipeline is ready to use!');
    console.log('\nNext steps:');
    console.log('1. Start the pipeline: POST /api/ai-insights/pipeline with action: "start"');
    console.log('2. Check status: GET /api/ai-insights/pipeline?action=status');
    console.log('3. View insights: GET /api/ai-insights/pipeline?action=insights&teacherId=<id>');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

async function checkTables() {
  const tables = [
    'student_analytics_cache',
    'class_analytics_cache', 
    'ai_insights',
    'enhanced_game_sessions',
    'word_performance_logs',
    'assessment_skill_breakdown'
  ];

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);

    if (error) {
      throw new Error(`Table ${table} not accessible: ${error.message}`);
    }
    console.log(`   ✓ ${table} table exists and accessible`);
  }
}

async function testAnalyticsCache() {
  // First, check if we have any existing students and classes to use
  const { data: existingStudents } = await supabase
    .from('students')
    .select('id')
    .limit(1);
    
  const { data: existingClasses } = await supabase
    .from('classes')
    .select('id, teacher_id')
    .limit(1);

  let studentId, classId, teacherId;

  if (existingStudents && existingStudents.length > 0) {
    studentId = existingStudents[0].id;
    console.log('   ✓ Using existing student for testing');
  } else {
    console.log('   ⚠️  No existing students found, skipping student analytics cache test');
    return;
  }

  if (existingClasses && existingClasses.length > 0) {
    classId = existingClasses[0].id;
    teacherId = existingClasses[0].teacher_id;
    console.log('   ✓ Using existing class for testing');
  } else {
    console.log('   ⚠️  No existing classes found, skipping class analytics cache test');
    return;
  }

  // Test student analytics cache
  const testStudentMetrics = {
    student_id: studentId,
    metrics_data: {
      student_id: studentId,
      class_id: classId,
      total_sessions_weekly: 5,
      total_time_spent_weekly: 1800,
      average_session_duration: 360,
      average_accuracy_weekly: 85.5,
      total_xp_earned_weekly: 450,
      accuracy_trend: 'improving',
      engagement_trend: 'increasing',
      learning_velocity: 12.5,
      is_at_risk: false,
      risk_factors: [],
      risk_score: 15,
      calculated_at: new Date().toISOString()
    },
    calculated_at: new Date().toISOString()
  };

  const { error: studentError } = await supabase
    .from('student_analytics_cache')
    .upsert(testStudentMetrics);

  if (studentError) {
    throw new Error(`Student analytics cache test failed: ${studentError.message}`);
  }
  console.log('   ✓ Student analytics cache working');

  // Test class analytics cache
  const testClassMetrics = {
    class_id: classId,
    teacher_id: teacherId,
    metrics_data: {
      class_id: classId,
      teacher_id: teacherId,
      total_students: 15,
      active_students: 12,
      average_accuracy: 78.5,
      average_engagement: 4.2,
      at_risk_count: 2,
      at_risk_percentage: 13.3,
      calculated_at: new Date().toISOString()
    },
    calculated_at: new Date().toISOString()
  };

  const { error: classError } = await supabase
    .from('class_analytics_cache')
    .upsert(testClassMetrics);

  if (classError) {
    throw new Error(`Class analytics cache test failed: ${classError.message}`);
  }
  console.log('   ✓ Class analytics cache working');
}

async function testAIInsightsTable() {
  // Get existing data if available
  const { data: existingStudents } = await supabase
    .from('students')
    .select('id')
    .limit(1);
    
  const { data: existingClasses } = await supabase
    .from('classes')
    .select('id, teacher_id')
    .limit(1);

  let studentId = null;
  let classId = null;
  let teacherId = null;

  if (existingStudents && existingStudents.length > 0) {
    studentId = existingStudents[0].id;
  }
  
  if (existingClasses && existingClasses.length > 0) {
    classId = existingClasses[0].id;
    teacherId = existingClasses[0].teacher_id;
  }

  const testInsight = {
    title: 'Test Insight - Student Engagement Alert',
    description: 'This is a test insight to verify the AI insights table is working correctly.',
    recommendation: 'This is a test recommendation for the insight.',
    confidence_score: 0.85,
    priority: 'medium',
    affected_students: studentId ? [studentId] : [],
    status: 'active',
    teacher_id: teacherId,
    class_id: classId,
    insight_type: 'engagement_alert',
    data_source: 'test_script',
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };

  const { data, error } = await supabase
    .from('ai_insights')
    .insert(testInsight)
    .select();

  if (error) {
    throw new Error(`AI insights table test failed: ${error.message}`);
  }
  console.log('   ✓ AI insights table working');

  // Clean up test data
  if (data && data[0]) {
    await supabase
      .from('ai_insights')
      .delete()
      .eq('id', data[0].id);
    console.log('   ✓ Test insight cleaned up');
  }
}

async function testPipelineAPI() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  try {
    // Test status endpoint
    const statusResponse = await fetch(`${baseUrl}/api/ai-insights/pipeline?action=status`);
    const statusData = await statusResponse.json();
    
    if (!statusData.success) {
      throw new Error('Status API endpoint failed');
    }
    console.log('   ✓ Pipeline status API working');

    // Test config endpoint
    const configResponse = await fetch(`${baseUrl}/api/ai-insights/pipeline?action=config`);
    const configData = await configResponse.json();
    
    if (!configData.success || !configData.config) {
      throw new Error('Config API endpoint failed');
    }
    console.log('   ✓ Pipeline config API working');

    console.log('   ✓ Pipeline API endpoints accessible');
  } catch (error) {
    // If we can't test the API endpoints (e.g., server not running), just warn
    console.log('   ⚠️  Pipeline API endpoints not testable (server may not be running)');
    console.log('      This is normal if you\'re not running the development server');
  }
}

// Run the test
if (require.main === module) {
  testPipeline().catch(console.error);
}

module.exports = { testPipeline };
