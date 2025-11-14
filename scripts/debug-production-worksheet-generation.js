#!/usr/bin/env node

/**
 * Production Worksheet Generation Debug Script
 * 
 * This script simulates production conditions to identify issues
 * with worksheet generation that only occur in Vercel deployment.
 * 
 * Usage:
 *   node scripts/debug-production-worksheet-generation.js
 * 
 * What it tests:
 * 1. JSON stringification issues (rawContent as string)
 * 2. Environment variable availability
 * 3. Memory usage during generation
 * 4. Timeout scenarios
 * 5. OpenAI API connectivity
 */

const https = require('https');
const { performance } = require('perf_hooks');

// Color output for better visibility
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  ${title}`, 'cyan');
  log('='.repeat(60), 'cyan');
}

async function checkEnvironmentVariables() {
  section('1. Environment Variables Check');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'OPENAI_API_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];
  
  const optionalVars = [
    'PUPPETEER_EXECUTABLE_PATH',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'GOOGLE_APPLICATION_CREDENTIALS',
  ];
  
  let allPresent = true;
  
  log('\nRequired Variables:', 'yellow');
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (value) {
      log(`  ✓ ${varName}: ${value.substring(0, 20)}...`, 'green');
    } else {
      log(`  ✗ ${varName}: MISSING`, 'red');
      allPresent = false;
    }
  }
  
  log('\nOptional Variables:', 'yellow');
  for (const varName of optionalVars) {
    const value = process.env[varName];
    if (value) {
      log(`  ✓ ${varName}: ${value.substring(0, 20)}...`, 'green');
    } else {
      log(`  - ${varName}: Not set`, 'yellow');
    }
  }
  
  return allPresent;
}

async function testOpenAIConnectivity() {
  section('2. OpenAI API Connectivity');
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    log('  ✗ OpenAI API key not found', 'red');
    return false;
  }
  
  log('  Testing API connection...', 'yellow');
  const startTime = performance.now();
  
  return new Promise((resolve) => {
    const data = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 5
    });
    
    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': data.length
      },
      timeout: 10000
    };
    
    const req = https.request(options, (res) => {
      const duration = performance.now() - startTime;
      
      if (res.statusCode === 200) {
        log(`  ✓ OpenAI API accessible (${Math.round(duration)}ms)`, 'green');
        resolve(true);
      } else {
        log(`  ✗ OpenAI API returned status ${res.statusCode}`, 'red');
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      log(`  ✗ OpenAI API error: ${error.message}`, 'red');
      resolve(false);
    });
    
    req.on('timeout', () => {
      log('  ✗ OpenAI API request timed out', 'red');
      req.destroy();
      resolve(false);
    });
    
    req.write(data);
    req.end();
  });
}

async function testSupabaseConnectivity() {
  section('3. Supabase Database Connectivity');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    log('  ✗ Supabase credentials not found', 'red');
    return false;
  }
  
  log('  Testing database connection...', 'yellow');
  const startTime = performance.now();
  
  return new Promise((resolve) => {
    const url = new URL(supabaseUrl);
    
    const options = {
      hostname: url.hostname,
      path: '/rest/v1/',
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      timeout: 10000
    };
    
    const req = https.request(options, (res) => {
      const duration = performance.now() - startTime;
      
      if (res.statusCode === 200) {
        log(`  ✓ Supabase accessible (${Math.round(duration)}ms)`, 'green');
        resolve(true);
      } else {
        log(`  ✗ Supabase returned status ${res.statusCode}`, 'red');
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      log(`  ✗ Supabase error: ${error.message}`, 'red');
      resolve(false);
    });
    
    req.on('timeout', () => {
      log('  ✗ Supabase request timed out', 'red');
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

function testJSONStringification() {
  section('4. JSON Stringification Simulation');
  
  // Simulate production scenario where rawContent might be stringified
  const mockWorksheet = {
    id: 'test-123',
    title: 'Test Vocabulary Worksheet',
    template_id: 'vocabulary_practice',
    rawContent: {
      vocabulary_items: [
        { spanish: 'hola', english: 'hello' },
        { spanish: 'adiós', english: 'goodbye' }
      ],
      exercises: [
        {
          type: 'matching',
          instructions: 'Match the words',
          items: []
        }
      ]
    }
  };
  
  log('\n  Original rawContent type:', 'yellow');
  log(`    ${typeof mockWorksheet.rawContent}`, 'blue');
  
  // Simulate database returning stringified JSON
  const stringified = JSON.stringify(mockWorksheet.rawContent);
  mockWorksheet.rawContent = stringified;
  
  log('\n  After stringification:', 'yellow');
  log(`    Type: ${typeof mockWorksheet.rawContent}`, 'blue');
  log(`    Length: ${mockWorksheet.rawContent.length} chars`, 'blue');
  
  // Test parsing logic
  try {
    const parsed = JSON.parse(mockWorksheet.rawContent);
    log('\n  ✓ Parsing successful', 'green');
    log(`    Parsed type: ${typeof parsed}`, 'blue');
    log(`    Has exercises: ${!!parsed.exercises}`, 'blue');
    log(`    Exercises count: ${parsed.exercises?.length || 0}`, 'blue');
    return true;
  } catch (error) {
    log(`\n  ✗ Parsing failed: ${error.message}`, 'red');
    return false;
  }
}

function checkMemoryUsage() {
  section('5. Memory Usage Analysis');
  
  const usage = process.memoryUsage();
  
  log('\n  Memory Statistics:', 'yellow');
  log(`    Heap Used: ${Math.round(usage.heapUsed / 1024 / 1024)}MB`, 'blue');
  log(`    Heap Total: ${Math.round(usage.heapTotal / 1024 / 1024)}MB`, 'blue');
  log(`    RSS: ${Math.round(usage.rss / 1024 / 1024)}MB`, 'blue');
  log(`    External: ${Math.round(usage.external / 1024 / 1024)}MB`, 'blue');
  
  const heapLimit = 1024; // Vercel default 1024MB
  const currentUsage = usage.heapUsed / 1024 / 1024;
  const percentUsed = (currentUsage / heapLimit) * 100;
  
  if (percentUsed > 80) {
    log(`\n  ⚠ Memory usage high: ${percentUsed.toFixed(1)}% of ${heapLimit}MB limit`, 'red');
  } else if (percentUsed > 50) {
    log(`\n  ⚠ Memory usage moderate: ${percentUsed.toFixed(1)}% of ${heapLimit}MB limit`, 'yellow');
  } else {
    log(`\n  ✓ Memory usage healthy: ${percentUsed.toFixed(1)}% of ${heapLimit}MB limit`, 'green');
  }
  
  return percentUsed < 80;
}

function checkNodeVersion() {
  section('6. Node.js Version Check');
  
  const version = process.version;
  log(`\n  Current version: ${version}`, 'blue');
  
  const major = parseInt(version.split('.')[0].substring(1));
  
  if (major >= 18) {
    log('  ✓ Node.js version compatible with Vercel', 'green');
    return true;
  } else {
    log('  ✗ Node.js version may be incompatible (Vercel uses Node 18+)', 'red');
    return false;
  }
}

function simulateProductionTimeout() {
  section('7. Timeout Simulation');
  
  const maxDuration = 60; // Vercel default
  log(`\n  Vercel maxDuration: ${maxDuration} seconds`, 'yellow');
  log('  Typical worksheet generation times:', 'yellow');
  log('    - Simple vocabulary: 5-15s', 'blue');
  log('    - Reading comprehension: 15-30s', 'blue');
  log('    - Grammar exercises: 10-25s', 'blue');
  log('    - With word search: +5-10s', 'blue');
  
  log('\n  ⚠ Potential timeout risks:', 'yellow');
  log('    - Slow OpenAI API responses', 'magenta');
  log('    - Network latency in production', 'magenta');
  log('    - Complex word search generation', 'magenta');
  log('    - Multiple retries on failure', 'magenta');
  
  log('\n  Recommendation: Monitor generation times and increase maxDuration if needed', 'cyan');
  return true;
}

async function checkProductionDependencies() {
  section('8. Production Dependencies Check');
  
  const criticalDeps = [
    { name: 'openai', required: true },
    { name: '@supabase/ssr', required: true },
    { name: '@blex41/word-search', required: true },
    { name: 'puppeteer', required: false }, // Optional, for PDF generation
  ];
  
  log('\n  Checking installed packages...', 'yellow');
  
  for (const dep of criticalDeps) {
    try {
      require.resolve(dep.name);
      log(`  ✓ ${dep.name}: Installed`, 'green');
    } catch (error) {
      if (dep.required) {
        log(`  ✗ ${dep.name}: MISSING (required)`, 'red');
      } else {
        log(`  - ${dep.name}: Not installed (optional)`, 'yellow');
      }
    }
  }
  
  return true;
}

async function runAllChecks() {
  log('\n🔍 Production Worksheet Generation Diagnostic Tool', 'cyan');
  log('='.repeat(60) + '\n', 'cyan');
  
  const results = {
    envVars: await checkEnvironmentVariables(),
    nodeVersion: checkNodeVersion(),
    openai: await testOpenAIConnectivity(),
    supabase: await testSupabaseConnectivity(),
    json: testJSONStringification(),
    memory: checkMemoryUsage(),
    timeout: simulateProductionTimeout(),
    deps: await checkProductionDependencies(),
  };
  
  section('Summary');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  log(`\n  Tests Passed: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('\n  ✓ All checks passed! Production environment looks healthy.', 'green');
    log('  If issues persist, check Vercel deployment logs for runtime errors.', 'cyan');
  } else {
    log('\n  ⚠ Some checks failed. Review the issues above.', 'red');
    log('  Common fixes:', 'yellow');
    log('    - Ensure all environment variables are set in Vercel dashboard', 'magenta');
    log('    - Check OpenAI API key has sufficient credits', 'magenta');
    log('    - Verify Supabase project is accessible from Vercel', 'magenta');
    log('    - Consider increasing maxDuration for complex worksheets', 'magenta');
  }
  
  section('Recommendations for Production Issues');
  
  log('\n  If worksheets fail only in production:', 'yellow');
  log('    1. Check Vercel function logs for specific error messages', 'blue');
  log('    2. Verify rawContent is being parsed correctly (check logs for stringified JSON)', 'blue');
  log('    3. Increase maxDuration from 60s to 120s if timeouts occur', 'blue');
  log('    4. Monitor memory usage - upgrade plan if hitting limits', 'blue');
  log('    5. Test with --production flag: npm run build && npm start', 'blue');
  
  log('\n  Debug commands:', 'yellow');
  log('    - View Vercel logs: vercel logs [deployment-url]', 'blue');
  log('    - Test locally in production mode: npm run build && npm start', 'blue');
  log('    - Monitor generation: tail -f .next/server-logs.txt', 'blue');
  
  log('\n');
}

// Run the diagnostic
runAllChecks().catch(console.error);
