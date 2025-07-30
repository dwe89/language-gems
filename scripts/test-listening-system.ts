#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL';
  message: string;
  details?: any;
}

async function testListeningSystem(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  console.log('🧪 Testing AQA Listening Assessment System...\n');

  // Test 1: Database Tables Exist
  try {
    const { data: assessments, error: assessmentError } = await supabase
      .from('aqa_listening_assessments')
      .select('count')
      .limit(1);

    if (assessmentError) {
      results.push({
        test: 'Database Tables - Assessments',
        status: 'FAIL',
        message: 'aqa_listening_assessments table not accessible',
        details: assessmentError
      });
    } else {
      results.push({
        test: 'Database Tables - Assessments',
        status: 'PASS',
        message: 'aqa_listening_assessments table accessible'
      });
    }

    const { data: questions, error: questionError } = await supabase
      .from('aqa_listening_questions')
      .select('count')
      .limit(1);

    if (questionError) {
      results.push({
        test: 'Database Tables - Questions',
        status: 'FAIL',
        message: 'aqa_listening_questions table not accessible',
        details: questionError
      });
    } else {
      results.push({
        test: 'Database Tables - Questions',
        status: 'PASS',
        message: 'aqa_listening_questions table accessible'
      });
    }

    const { data: cache, error: cacheError } = await supabase
      .from('aqa_listening_audio_cache')
      .select('count')
      .limit(1);

    if (cacheError) {
      results.push({
        test: 'Database Tables - Audio Cache',
        status: 'FAIL',
        message: 'aqa_listening_audio_cache table not accessible',
        details: cacheError
      });
    } else {
      results.push({
        test: 'Database Tables - Audio Cache',
        status: 'PASS',
        message: 'aqa_listening_audio_cache table accessible'
      });
    }
  } catch (error) {
    results.push({
      test: 'Database Connection',
      status: 'FAIL',
      message: 'Failed to connect to database',
      details: error
    });
  }

  // Test 2: Assessment Data Population
  try {
    const { data: assessmentCount, error } = await supabase
      .from('aqa_listening_assessments')
      .select('id, language, level, identifier')
      .eq('is_active', true);

    if (error) {
      results.push({
        test: 'Assessment Data Population',
        status: 'FAIL',
        message: 'Failed to fetch assessments',
        details: error
      });
    } else {
      const expectedCombinations = 3 * 2 * 3; // 3 languages × 2 tiers × 3 papers
      const actualCount = assessmentCount?.length || 0;

      if (actualCount >= 6) { // At least paper-1 for all combinations
        results.push({
          test: 'Assessment Data Population',
          status: 'PASS',
          message: `Found ${actualCount} assessments (expected at least 6)`,
          details: {
            assessments: assessmentCount?.map(a => `${a.language}-${a.level}-${a.identifier}`)
          }
        });
      } else {
        results.push({
          test: 'Assessment Data Population',
          status: 'FAIL',
          message: `Only found ${actualCount} assessments, expected at least 6`,
          details: assessmentCount
        });
      }
    }
  } catch (error) {
    results.push({
      test: 'Assessment Data Population',
      status: 'FAIL',
      message: 'Error checking assessment data',
      details: error
    });
  }

  // Test 3: Question Data Population
  try {
    const { data: questionCount, error } = await supabase
      .from('aqa_listening_questions')
      .select('id, assessment_id, question_type')
      .limit(100);

    if (error) {
      results.push({
        test: 'Question Data Population',
        status: 'FAIL',
        message: 'Failed to fetch questions',
        details: error
      });
    } else {
      const actualCount = questionCount?.length || 0;
      const expectedMinimum = 6 * 8; // 6 assessments × 8 questions each

      if (actualCount >= expectedMinimum) {
        const questionTypes = [...new Set(questionCount?.map(q => q.question_type))];
        results.push({
          test: 'Question Data Population',
          status: 'PASS',
          message: `Found ${actualCount} questions with ${questionTypes.length} different types`,
          details: { questionTypes }
        });
      } else {
        results.push({
          test: 'Question Data Population',
          status: 'FAIL',
          message: `Only found ${actualCount} questions, expected at least ${expectedMinimum}`,
          details: questionCount
        });
      }
    }
  } catch (error) {
    results.push({
      test: 'Question Data Population',
      status: 'FAIL',
      message: 'Error checking question data',
      details: error
    });
  }

  // Test 4: Service Integration
  try {
    const { AQAListeningAssessmentService } = await import('../src/services/aqaListeningAssessmentService');
    const service = new AQAListeningAssessmentService();
    
    const testAssessment = await service.getAssessmentByLevel('foundation', 'es', 'paper-1');
    
    if (testAssessment) {
      const testQuestions = await service.getAssessmentQuestions(testAssessment.id);
      
      if (testQuestions && testQuestions.length > 0) {
        results.push({
          test: 'Service Integration',
          status: 'PASS',
          message: `Service successfully loaded assessment with ${testQuestions.length} questions`,
          details: {
            assessmentId: testAssessment.id,
            questionCount: testQuestions.length
          }
        });
      } else {
        results.push({
          test: 'Service Integration',
          status: 'FAIL',
          message: 'Service loaded assessment but no questions found'
        });
      }
    } else {
      results.push({
        test: 'Service Integration',
        status: 'FAIL',
        message: 'Service failed to load test assessment'
      });
    }
  } catch (error) {
    results.push({
      test: 'Service Integration',
      status: 'FAIL',
      message: 'Error testing service integration',
      details: error
    });
  }

  // Test 5: Audio Cache System
  try {
    const { ListeningAudioCache } = await import('../src/services/listeningAudioCache');
    const cache = new ListeningAudioCache();
    
    const stats = await cache.getCacheStats();
    
    results.push({
      test: 'Audio Cache System',
      status: 'PASS',
      message: `Audio cache system initialized successfully`,
      details: {
        totalEntries: stats.totalEntries,
        byLanguage: stats.byLanguage,
        recentlyAccessed: stats.recentlyAccessed
      }
    });
  } catch (error) {
    results.push({
      test: 'Audio Cache System',
      status: 'FAIL',
      message: 'Error testing audio cache system',
      details: error
    });
  }

  // Test 6: Gemini TTS API Configuration
  try {
    const hasGeminiKey = !!process.env.GOOGLE_AI_API_KEY;
    
    if (hasGeminiKey) {
      results.push({
        test: 'Gemini TTS Configuration',
        status: 'PASS',
        message: 'Google AI API key is configured'
      });
    } else {
      results.push({
        test: 'Gemini TTS Configuration',
        status: 'FAIL',
        message: 'Google AI API key is not configured'
      });
    }
  } catch (error) {
    results.push({
      test: 'Gemini TTS Configuration',
      status: 'FAIL',
      message: 'Error checking Gemini TTS configuration',
      details: error
    });
  }

  return results;
}

async function runTests() {
  try {
    const results = await testListeningSystem();
    
    console.log('\n📊 Test Results Summary:');
    console.log('=' .repeat(50));
    
    let passCount = 0;
    let failCount = 0;
    
    results.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${status} ${result.test}: ${result.message}`);
      
      if (result.details && result.status === 'FAIL') {
        console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`);
      }
      
      if (result.status === 'PASS') {
        passCount++;
      } else {
        failCount++;
      }
    });
    
    console.log('=' .repeat(50));
    console.log(`📈 Results: ${passCount} passed, ${failCount} failed`);
    
    if (failCount === 0) {
      console.log('🎉 All tests passed! The listening assessment system is ready.');
    } else {
      console.log('⚠️  Some tests failed. Please review the issues above.');
    }
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().then(() => {
    console.log('\n✨ Testing completed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Testing failed:', error);
    process.exit(1);
  });
}

export { testListeningSystem, runTests };
