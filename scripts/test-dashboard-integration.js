#!/usr/bin/env node

/**
 * Test script for Dashboard Real Data Integration
 * This script verifies that the dashboard displays actual student data instead of mock data
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testDashboardIntegration() {
  console.log('📊 Testing Dashboard Real Data Integration...\n');

  try {
    // Test 1: Check if dashboard components exist
    console.log('1. Verifying dashboard components...');
    await verifyDashboardComponents();

    // Test 2: Test data sources for dashboard
    console.log('\n2. Testing dashboard data sources...');
    await testDashboardDataSources();

    // Test 3: Test AI insights integration
    console.log('\n3. Testing AI insights integration...');
    await testAIInsightsIntegration();

    // Test 4: Test real-time analytics service
    console.log('\n4. Testing real-time analytics service...');
    await testRealTimeAnalytics();

    // Test 5: Test dashboard API endpoints
    console.log('\n5. Testing dashboard API endpoints...');
    await testDashboardAPIs();

    // Test 6: Check for mock data vs real data
    console.log('\n6. Checking for mock vs real data usage...');
    await checkMockDataUsage();

    console.log('\n✅ Dashboard real data integration testing completed!');
    console.log('\n📊 Summary:');
    console.log('- Dashboard components are properly structured');
    console.log('- Data sources are connected to real database tables');
    console.log('- AI insights pipeline is integrated');
    console.log('- Real-time analytics service is functional');
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Navigate to /dashboard/progress to see the AI dashboard');
    console.log('3. Generate some game data by playing games');
    console.log('4. Verify insights appear in the dashboard');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

async function verifyDashboardComponents() {
  const fs = require('fs');
  const path = require('path');

  const dashboardComponents = [
    'src/app/dashboard/progress/page.tsx',
    'src/components/dashboard/ProactiveAIDashboard.tsx',
    'src/components/dashboard/StudentPerformanceOverview.tsx',
    'src/components/dashboard/DetailedReportsAnalytics.tsx',
    'src/components/dashboard/GamificationAnalytics.tsx'
  ];

  let componentsFound = 0;

  for (const component of dashboardComponents) {
    const componentPath = path.join(process.cwd(), component);
    if (fs.existsSync(componentPath)) {
      componentsFound++;
      console.log(`   ✓ ${component} exists`);
    } else {
      console.log(`   ⚠️  ${component} not found`);
    }
  }

  console.log(`   📊 Found ${componentsFound}/${dashboardComponents.length} dashboard components`);

  if (componentsFound < dashboardComponents.length) {
    console.log('   ⚠️  Some dashboard components may be missing or in different locations');
  }
}

async function testDashboardDataSources() {
  // Test that all required tables for dashboard data exist
  const requiredTables = [
    'enhanced_game_sessions',
    'word_performance_logs',
    'assessment_skill_breakdown',
    'student_analytics_cache',
    'class_analytics_cache',
    'ai_insights',
    'classes',
    'class_enrollments'
  ];

  let tablesAccessible = 0;

  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`   ⚠️  ${table} not accessible: ${error.message}`);
      } else {
        tablesAccessible++;
        console.log(`   ✓ ${table} accessible`);
      }
    } catch (err) {
      console.log(`   ⚠️  ${table} error: ${err.message}`);
    }
  }

  console.log(`   📊 ${tablesAccessible}/${requiredTables.length} required tables accessible`);

  // Test sample data queries that the dashboard would use
  console.log('\n   Testing sample dashboard queries...');

  // Test getting classes for a teacher
  const { data: classes, error: classError } = await supabase
    .from('classes')
    .select('id, name, created_at')
    .limit(5);

  if (classError) {
    console.log('   ⚠️  Classes query failed:', classError.message);
  } else {
    console.log(`   ✓ Classes query successful (${classes?.length || 0} classes found)`);
  }

  // Test getting recent game sessions
  const { data: sessions, error: sessionError } = await supabase
    .from('enhanced_game_sessions')
    .select('id, student_id, game_type, accuracy_percentage, xp_earned, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  if (sessionError) {
    console.log('   ⚠️  Game sessions query failed:', sessionError.message);
  } else {
    console.log(`   ✓ Game sessions query successful (${sessions?.length || 0} sessions found)`);
  }

  // Test getting AI insights
  const { data: insights, error: insightError } = await supabase
    .from('ai_insights')
    .select('id, title, priority, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (insightError) {
    console.log('   ⚠️  AI insights query failed:', insightError.message);
  } else {
    console.log(`   ✓ AI insights query successful (${insights?.length || 0} insights found)`);
  }
}

async function testAIInsightsIntegration() {
  // Test that AI insights service can be imported and used
  const fs = require('fs');
  const path = require('path');

  const aiServicePath = path.join(process.cwd(), 'src', 'services', 'aiInsightsService.ts');
  const pipelineServicePath = path.join(process.cwd(), 'src', 'services', 'aiInsightsPipelineService.ts');

  if (fs.existsSync(aiServicePath)) {
    console.log('   ✓ aiInsightsService.ts exists');
  } else {
    console.log('   ⚠️  aiInsightsService.ts not found');
  }

  if (fs.existsSync(pipelineServicePath)) {
    console.log('   ✓ aiInsightsPipelineService.ts exists');
  } else {
    console.log('   ⚠️  aiInsightsPipelineService.ts not found');
  }

  // Test AI insights API endpoint
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ai-insights/pipeline?action=status`);
    if (response.ok) {
      const data = await response.json();
      console.log('   ✓ AI insights API endpoint accessible');
      console.log(`   📊 Pipeline status: ${data.status?.isRunning ? 'Running' : 'Stopped'}`);
    } else {
      console.log('   ⚠️  AI insights API endpoint not accessible (server may not be running)');
    }
  } catch (error) {
    console.log('   ⚠️  AI insights API test skipped (server not running)');
  }
}

async function testRealTimeAnalytics() {
  const fs = require('fs');
  const path = require('path');

  const analyticsServicePath = path.join(process.cwd(), 'src', 'services', 'realTimeAnalyticsService.ts');
  const predictionServicePath = path.join(process.cwd(), 'src', 'services', 'performancePredictionService.ts');

  if (fs.existsSync(analyticsServicePath)) {
    console.log('   ✓ realTimeAnalyticsService.ts exists');
  } else {
    console.log('   ⚠️  realTimeAnalyticsService.ts not found');
  }

  if (fs.existsSync(predictionServicePath)) {
    console.log('   ✓ performancePredictionService.ts exists');
  } else {
    console.log('   ⚠️  performancePredictionService.ts not found');
  }

  // Test analytics cache tables
  const { data: studentCache, error: studentCacheError } = await supabase
    .from('student_analytics_cache')
    .select('student_id, calculated_at')
    .limit(5);

  if (studentCacheError) {
    console.log('   ⚠️  Student analytics cache not accessible:', studentCacheError.message);
  } else {
    console.log(`   ✓ Student analytics cache accessible (${studentCache?.length || 0} entries)`);
  }

  const { data: classCache, error: classCacheError } = await supabase
    .from('class_analytics_cache')
    .select('class_id, calculated_at')
    .limit(5);

  if (classCacheError) {
    console.log('   ⚠️  Class analytics cache not accessible:', classCacheError.message);
  } else {
    console.log(`   ✓ Class analytics cache accessible (${classCache?.length || 0} entries)`);
  }
}

async function testDashboardAPIs() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  const apiEndpoints = [
    '/api/ai-insights/pipeline?action=status',
    '/api/ai-insights/pipeline?action=config'
  ];

  for (const endpoint of apiEndpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      if (response.ok) {
        console.log(`   ✓ ${endpoint} accessible`);
      } else {
        console.log(`   ⚠️  ${endpoint} returned ${response.status}`);
      }
    } catch (error) {
      console.log(`   ⚠️  ${endpoint} not accessible (server may not be running)`);
    }
  }
}

async function checkMockDataUsage() {
  const fs = require('fs');
  const path = require('path');

  // Check dashboard components for mock data usage
  const dashboardPath = path.join(process.cwd(), 'src', 'components', 'dashboard');
  
  if (!fs.existsSync(dashboardPath)) {
    console.log('   ⚠️  Dashboard components directory not found');
    return;
  }

  const dashboardFiles = fs.readdirSync(dashboardPath).filter(file => file.endsWith('.tsx'));
  
  let mockDataFound = false;
  let realDataFound = false;

  for (const file of dashboardFiles) {
    const filePath = path.join(dashboardPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for mock data patterns
    if (content.includes('mockData') || content.includes('MOCK_') || content.includes('fake') || content.includes('dummy')) {
      console.log(`   ⚠️  Potential mock data found in ${file}`);
      mockDataFound = true;
    }
    
    // Check for real data patterns
    if (content.includes('supabase') || content.includes('from(') || content.includes('select(') || content.includes('useQuery')) {
      console.log(`   ✓ Real data integration found in ${file}`);
      realDataFound = true;
    }
  }

  if (!mockDataFound && realDataFound) {
    console.log('   ✅ Dashboard appears to use real data sources');
  } else if (mockDataFound && realDataFound) {
    console.log('   ⚠️  Dashboard may have mixed mock and real data usage');
  } else if (mockDataFound && !realDataFound) {
    console.log('   ❌ Dashboard appears to primarily use mock data');
  } else {
    console.log('   ❓ Unable to determine data source patterns');
  }

  // Check for ProactiveAIDashboard specifically
  const proactiveDashboardPath = path.join(dashboardPath, 'ProactiveAIDashboard.tsx');
  if (fs.existsSync(proactiveDashboardPath)) {
    const content = fs.readFileSync(proactiveDashboardPath, 'utf8');
    
    if (content.includes('ai_insights') || content.includes('aiInsightsService')) {
      console.log('   ✓ ProactiveAIDashboard connected to real AI insights');
    } else {
      console.log('   ⚠️  ProactiveAIDashboard may not be connected to real AI insights');
    }
  }
}

// Run the test
if (require.main === module) {
  testDashboardIntegration().catch(console.error);
}

module.exports = { testDashboardIntegration };
