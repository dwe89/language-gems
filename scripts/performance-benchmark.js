#!/usr/bin/env node

/**
 * Performance Benchmarking Script for LanguageGems
 * 
 * This script measures key performance metrics including:
 * - Page load times
 * - API response times
 * - Database query performance
 * - Memory usage
 * - Concurrent user simulation
 * 
 * Usage:
 *   node scripts/performance-benchmark.js [--concurrent=10] [--duration=60]
 */

require('dotenv').config({ path: '.env.local' });
const { performance } = require('perf_hooks');

// Benchmark configuration
const BENCHMARK_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  concurrentUsers: parseInt(process.argv.find(arg => arg.startsWith('--concurrent='))?.split('=')[1]) || 10,
  testDuration: parseInt(process.argv.find(arg => arg.startsWith('--duration='))?.split('=')[1]) || 60,
  warmupRequests: 5,
  thresholds: {
    pageLoad: 3000,      // 3 seconds
    apiResponse: 500,    // 500ms
    dbQuery: 200,        // 200ms
    memoryUsage: 100     // 100MB
  }
};

// Performance metrics storage
let performanceMetrics = {
  pageLoads: [],
  apiResponses: [],
  dbQueries: [],
  memoryUsage: [],
  concurrentUserResults: [],
  errors: []
};

/**
 * Main benchmarking function
 */
async function runPerformanceBenchmark() {
  console.log('🚀 Starting LanguageGems Performance Benchmark');
  console.log('=' .repeat(60));
  console.log(`🎯 Concurrent Users: ${BENCHMARK_CONFIG.concurrentUsers}`);
  console.log(`⏱️  Test Duration: ${BENCHMARK_CONFIG.testDuration}s`);
  console.log('');

  try {
    // Warmup phase
    await warmupPhase();
    
    // Individual performance tests
    await testPageLoadPerformance();
    await testAPIPerformance();
    await testDatabasePerformance();
    await testMemoryUsage();
    
    // Concurrent user simulation
    await testConcurrentUsers();
    
    // Generate performance report
    generatePerformanceReport();
    
  } catch (error) {
    console.error('❌ Benchmark failed:', error.message);
    process.exit(1);
  }
}

/**
 * Warmup phase to prepare server
 */
async function warmupPhase() {
  console.log('🔥 Warming up server...');
  
  const warmupUrls = [
    '/',
    '/dashboard',
    '/games/vocab-master',
    '/api/vocabulary'
  ];
  
  for (let i = 0; i < BENCHMARK_CONFIG.warmupRequests; i++) {
    for (const url of warmupUrls) {
      try {
        await fetch(`${BENCHMARK_CONFIG.baseUrl}${url}`);
      } catch (error) {
        // Ignore warmup errors
      }
    }
  }
  
  console.log('✅ Warmup completed');
  console.log('');
}

/**
 * Test page load performance
 */
async function testPageLoadPerformance() {
  console.log('📄 Testing page load performance...');
  
  const pages = [
    { name: 'Homepage', url: '/' },
    { name: 'Teacher Dashboard', url: '/dashboard' },
    { name: 'Student Dashboard', url: '/student-dashboard' },
    { name: 'VocabMaster Game', url: '/games/vocab-master' },
    { name: 'Memory Game', url: '/games/memory-game' },
    { name: 'Assignment Creator', url: '/dashboard/assignments/create' }
  ];
  
  for (const page of pages) {
    const loadTimes = [];
    
    for (let i = 0; i < 5; i++) {
      try {
        const startTime = performance.now();
        const response = await fetch(`${BENCHMARK_CONFIG.baseUrl}${page.url}`);
        const endTime = performance.now();
        
        if (response.ok) {
          const loadTime = endTime - startTime;
          loadTimes.push(loadTime);
        }
      } catch (error) {
        performanceMetrics.errors.push({
          test: 'Page Load',
          page: page.name,
          error: error.message
        });
      }
    }
    
    if (loadTimes.length > 0) {
      const avgLoadTime = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;
      const status = avgLoadTime <= BENCHMARK_CONFIG.thresholds.pageLoad ? '✅' : '⚠️';
      
      console.log(`   ${status} ${page.name}: ${avgLoadTime.toFixed(0)}ms`);
      
      performanceMetrics.pageLoads.push({
        page: page.name,
        url: page.url,
        avgLoadTime: avgLoadTime,
        loadTimes: loadTimes,
        threshold: BENCHMARK_CONFIG.thresholds.pageLoad,
        passed: avgLoadTime <= BENCHMARK_CONFIG.thresholds.pageLoad
      });
    }
  }
  
  console.log('');
}

/**
 * Test API response performance
 */
async function testAPIPerformance() {
  console.log('🔌 Testing API performance...');
  
  const apis = [
    { name: 'Vocabulary API', url: '/api/vocabulary?language=es&limit=10' },
    { name: 'Game Sessions API', url: '/api/game-sessions' },
    { name: 'User Profile API', url: '/api/user/profile' },
    { name: 'Analytics API', url: '/api/analytics/dashboard' },
    { name: 'Assignment Progress API', url: '/api/assignment-progress' }
  ];
  
  for (const api of apis) {
    const responseTimes = [];
    
    for (let i = 0; i < 10; i++) {
      try {
        const startTime = performance.now();
        const response = await fetch(`${BENCHMARK_CONFIG.baseUrl}${api.url}`);
        const endTime = performance.now();
        
        const responseTime = endTime - startTime;
        responseTimes.push(responseTime);
        
        // Don't require 200 status for all APIs (some may require auth)
      } catch (error) {
        performanceMetrics.errors.push({
          test: 'API Performance',
          api: api.name,
          error: error.message
        });
      }
    }
    
    if (responseTimes.length > 0) {
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      const status = avgResponseTime <= BENCHMARK_CONFIG.thresholds.apiResponse ? '✅' : '⚠️';
      
      console.log(`   ${status} ${api.name}: ${avgResponseTime.toFixed(0)}ms`);
      
      performanceMetrics.apiResponses.push({
        api: api.name,
        url: api.url,
        avgResponseTime: avgResponseTime,
        responseTimes: responseTimes,
        threshold: BENCHMARK_CONFIG.thresholds.apiResponse,
        passed: avgResponseTime <= BENCHMARK_CONFIG.thresholds.apiResponse
      });
    }
  }
  
  console.log('');
}

/**
 * Test database query performance
 */
async function testDatabasePerformance() {
  console.log('🗄️  Testing database performance...');
  
  // This would require actual database queries
  // For now, we'll simulate through API endpoints that hit the database
  const dbTests = [
    { name: 'User Lookup', url: '/api/test/db/user-lookup' },
    { name: 'Vocabulary Query', url: '/api/test/db/vocabulary-query' },
    { name: 'Assignment Query', url: '/api/test/db/assignment-query' },
    { name: 'Progress Query', url: '/api/test/db/progress-query' }
  ];
  
  for (const test of dbTests) {
    try {
      const queryTimes = [];
      
      for (let i = 0; i < 5; i++) {
        const startTime = performance.now();
        const response = await fetch(`${BENCHMARK_CONFIG.baseUrl}${test.url}`);
        const endTime = performance.now();
        
        const queryTime = endTime - startTime;
        queryTimes.push(queryTime);
      }
      
      const avgQueryTime = queryTimes.reduce((a, b) => a + b, 0) / queryTimes.length;
      const status = avgQueryTime <= BENCHMARK_CONFIG.thresholds.dbQuery ? '✅' : '⚠️';
      
      console.log(`   ${status} ${test.name}: ${avgQueryTime.toFixed(0)}ms`);
      
      performanceMetrics.dbQueries.push({
        test: test.name,
        avgQueryTime: avgQueryTime,
        queryTimes: queryTimes,
        threshold: BENCHMARK_CONFIG.thresholds.dbQuery,
        passed: avgQueryTime <= BENCHMARK_CONFIG.thresholds.dbQuery
      });
      
    } catch (error) {
      console.log(`   ⚠️  ${test.name}: Endpoint not available (${error.message})`);
      performanceMetrics.errors.push({
        test: 'Database Performance',
        query: test.name,
        error: error.message
      });
    }
  }
  
  console.log('');
}

/**
 * Test memory usage
 */
async function testMemoryUsage() {
  console.log('💾 Testing memory usage...');
  
  const memoryBefore = process.memoryUsage();
  
  // Simulate memory-intensive operations
  const testData = [];
  for (let i = 0; i < 1000; i++) {
    testData.push({
      id: i,
      data: 'x'.repeat(1000),
      timestamp: new Date()
    });
  }
  
  const memoryAfter = process.memoryUsage();
  const memoryDiff = {
    rss: (memoryAfter.rss - memoryBefore.rss) / 1024 / 1024,
    heapUsed: (memoryAfter.heapUsed - memoryBefore.heapUsed) / 1024 / 1024,
    heapTotal: (memoryAfter.heapTotal - memoryBefore.heapTotal) / 1024 / 1024
  };
  
  console.log(`   📊 RSS: ${memoryDiff.rss.toFixed(2)}MB`);
  console.log(`   📊 Heap Used: ${memoryDiff.heapUsed.toFixed(2)}MB`);
  console.log(`   📊 Heap Total: ${memoryDiff.heapTotal.toFixed(2)}MB`);
  
  performanceMetrics.memoryUsage.push({
    rss: memoryDiff.rss,
    heapUsed: memoryDiff.heapUsed,
    heapTotal: memoryDiff.heapTotal,
    threshold: BENCHMARK_CONFIG.thresholds.memoryUsage
  });
  
  console.log('');
}

/**
 * Test concurrent user simulation
 */
async function testConcurrentUsers() {
  console.log(`👥 Testing ${BENCHMARK_CONFIG.concurrentUsers} concurrent users...`);
  
  const userSimulations = [];
  const startTime = performance.now();
  
  // Create concurrent user simulations
  for (let i = 0; i < BENCHMARK_CONFIG.concurrentUsers; i++) {
    userSimulations.push(simulateUser(i));
  }
  
  // Wait for all simulations to complete
  const results = await Promise.allSettled(userSimulations);
  const endTime = performance.now();
  
  const totalTime = endTime - startTime;
  const successfulUsers = results.filter(r => r.status === 'fulfilled').length;
  const failedUsers = results.filter(r => r.status === 'rejected').length;
  
  console.log(`   ✅ Successful users: ${successfulUsers}/${BENCHMARK_CONFIG.concurrentUsers}`);
  console.log(`   ❌ Failed users: ${failedUsers}/${BENCHMARK_CONFIG.concurrentUsers}`);
  console.log(`   ⏱️  Total time: ${totalTime.toFixed(0)}ms`);
  
  performanceMetrics.concurrentUserResults.push({
    totalUsers: BENCHMARK_CONFIG.concurrentUsers,
    successfulUsers: successfulUsers,
    failedUsers: failedUsers,
    totalTime: totalTime,
    successRate: (successfulUsers / BENCHMARK_CONFIG.concurrentUsers) * 100
  });
  
  console.log('');
}

/**
 * Simulate individual user behavior
 */
async function simulateUser(userId) {
  const userActions = [
    '/',
    '/dashboard',
    '/games/vocab-master',
    '/api/vocabulary?language=es&limit=5'
  ];
  
  for (const action of userActions) {
    try {
      await fetch(`${BENCHMARK_CONFIG.baseUrl}${action}`);
      // Small delay between actions
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      throw new Error(`User ${userId} failed on ${action}: ${error.message}`);
    }
  }
  
  return userId;
}

/**
 * Generate comprehensive performance report
 */
function generatePerformanceReport() {
  console.log('📊 Performance Benchmark Results');
  console.log('=' .repeat(60));
  
  // Page Load Summary
  if (performanceMetrics.pageLoads.length > 0) {
    console.log('📄 Page Load Performance:');
    const passedPages = performanceMetrics.pageLoads.filter(p => p.passed).length;
    console.log(`   ✅ Passed: ${passedPages}/${performanceMetrics.pageLoads.length}`);
    
    const avgPageLoad = performanceMetrics.pageLoads.reduce((sum, p) => sum + p.avgLoadTime, 0) / performanceMetrics.pageLoads.length;
    console.log(`   📊 Average load time: ${avgPageLoad.toFixed(0)}ms`);
    console.log('');
  }
  
  // API Performance Summary
  if (performanceMetrics.apiResponses.length > 0) {
    console.log('🔌 API Performance:');
    const passedAPIs = performanceMetrics.apiResponses.filter(a => a.passed).length;
    console.log(`   ✅ Passed: ${passedAPIs}/${performanceMetrics.apiResponses.length}`);
    
    const avgAPIResponse = performanceMetrics.apiResponses.reduce((sum, a) => sum + a.avgResponseTime, 0) / performanceMetrics.apiResponses.length;
    console.log(`   📊 Average response time: ${avgAPIResponse.toFixed(0)}ms`);
    console.log('');
  }
  
  // Concurrent Users Summary
  if (performanceMetrics.concurrentUserResults.length > 0) {
    const concurrentResult = performanceMetrics.concurrentUserResults[0];
    console.log('👥 Concurrent Users:');
    console.log(`   📊 Success rate: ${concurrentResult.successRate.toFixed(1)}%`);
    console.log(`   ⏱️  Average time per user: ${(concurrentResult.totalTime / concurrentResult.totalUsers).toFixed(0)}ms`);
    console.log('');
  }
  
  // Overall Assessment
  const totalTests = performanceMetrics.pageLoads.length + performanceMetrics.apiResponses.length;
  const passedTests = performanceMetrics.pageLoads.filter(p => p.passed).length + 
                     performanceMetrics.apiResponses.filter(a => a.passed).length;
  
  const overallScore = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
  
  console.log(`📈 Overall Performance Score: ${overallScore.toFixed(1)}%`);
  
  if (overallScore >= 90) {
    console.log('🎉 Excellent performance! Ready for production.');
  } else if (overallScore >= 75) {
    console.log('⚠️  Good performance with room for improvement.');
  } else if (overallScore >= 60) {
    console.log('🚨 Performance issues detected. Optimization recommended.');
  } else {
    console.log('❌ Poor performance. Significant optimization required.');
  }
  
  // Save detailed results
  const fs = require('fs');
  const path = require('path');
  const reportPath = path.join(__dirname, '..', 'performance-results.json');
  
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    config: BENCHMARK_CONFIG,
    metrics: performanceMetrics,
    overallScore: overallScore
  }, null, 2));
  
  console.log(`📄 Detailed results saved to: ${reportPath}`);
}

// Run benchmark if called directly
if (require.main === module) {
  runPerformanceBenchmark().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  runPerformanceBenchmark,
  BENCHMARK_CONFIG,
  performanceMetrics
};
