/**
 * Manual Test Script for Conjugation Duel Grammar Gems Flow
 * 
 * This script can be run in the browser console to test the complete
 * Grammar Gems integration with real database operations.
 */

import { ConjugationDuelService } from '../services/ConjugationDuelService';
import { createBrowserClient } from '@supabase/ssr';

export async function testConjugationDuelGrammarGems() {
  console.log('🧪 [MANUAL TEST] Starting Conjugation Duel Grammar Gems test...');
  
  try {
    // Create real Supabase client
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    
    // Create service with real client
    const conjugationService = new ConjugationDuelService(supabase);
    
    // Step 1: Get available Spanish verbs
    console.log('📚 [TEST] Step 1: Getting available Spanish verbs...');
    const verbs = await conjugationService.getAvailableVerbs('es', 'beginner', 5);
    console.log('📚 [TEST] Available verbs:', verbs);
    
    if (verbs.length === 0) {
      throw new Error('No verbs found in database');
    }
    
    // Step 2: Generate a challenge with the first verb
    const testVerb = verbs[0];
    console.log('🎯 [TEST] Step 2: Generating challenge for verb:', testVerb);
    
    const challenge = await conjugationService.generateChallenge(
      testVerb,
      'es',
      'present',
      0 // yo form
    );
    
    console.log('🎯 [TEST] Generated challenge:', {
      id: challenge.id,
      infinitive: challenge.infinitive,
      expectedAnswer: challenge.expectedAnswer,
      person: challenge.person
    });
    
    // Step 3: Create a test session (you'll need to replace with actual session ID)
    const testSessionId = 'test-session-' + Date.now();
    console.log('🔑 [TEST] Using test session ID:', testSessionId);
    
    // Step 4: Simulate correct answer
    const attempt = {
      sessionId: testSessionId,
      challengeId: challenge.id,
      studentAnswer: challenge.expectedAnswer, // Correct answer
      responseTimeMs: 2500,
      hintUsed: false
    };
    
    console.log('💭 [TEST] Step 3: Simulating correct conjugation attempt:', attempt);
    
    // Step 5: Process the attempt (this should award Grammar Gems)
    console.log('🏆 [TEST] Step 4: Processing attempt...');
    const result = await conjugationService.processAttempt(
      testSessionId,
      challenge,
      attempt
    );
    
    console.log('🏆 [TEST] Result:', {
      isCorrect: result.isCorrect,
      expectedAnswer: result.expectedAnswer,
      gemAwarded: result.gemAwarded,
      fsrsUpdated: result.fsrsUpdated,
      streakCount: result.streakCount
    });
    
    // Step 6: Verify Grammar Gem was stored in database
    console.log('🔍 [TEST] Step 5: Checking if Grammar Gem was stored...');
    
    const { data: grammarGems, error: grammarError } = await supabase
      .from('gem_events')
      .select('*')
      .eq('gem_type', 'grammar')
      .eq('word_text', challenge.infinitive)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (grammarError) {
      console.error('❌ [TEST] Error checking Grammar Gems:', grammarError);
    } else {
      console.log('💎 [TEST] Latest Grammar Gem in database:', grammarGems);
    }
    
    // Step 7: Check updated analytics
    console.log('📊 [TEST] Step 6: Checking updated analytics...');
    
    const { data: analytics, error: analyticsError } = await supabase
      .from('student_consolidated_xp_analytics')
      .select('*')
      .limit(5);
    
    if (analyticsError) {
      console.error('❌ [TEST] Error checking analytics:', analyticsError);
    } else {
      console.log('📊 [TEST] Updated XP analytics:', analytics);
    }
    
    console.log('🎉 [TEST] Manual test completed successfully!');
    return {
      success: true,
      challenge,
      result,
      grammarGems,
      analytics
    };
    
  } catch (error) {
    console.error('❌ [TEST] Manual test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to test just the verb loading
export async function testVerbLoading() {
  console.log('📚 [VERB TEST] Testing verb loading...');
  
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    
    const conjugationService = new ConjugationDuelService(supabase);
    
    // Test Spanish verbs
    const spanishVerbs = await conjugationService.getAvailableVerbs('es', undefined, 10);
    console.log('🇪🇸 [VERB TEST] Spanish verbs:', spanishVerbs);
    
    // Test French verbs
    const frenchVerbs = await conjugationService.getAvailableVerbs('fr', undefined, 10);
    console.log('🇫🇷 [VERB TEST] French verbs:', frenchVerbs);
    
    // Test German verbs
    const germanVerbs = await conjugationService.getAvailableVerbs('de', undefined, 10);
    console.log('🇩🇪 [VERB TEST] German verbs:', germanVerbs);
    
    return {
      spanish: spanishVerbs.length,
      french: frenchVerbs.length,
      german: germanVerbs.length
    };
    
  } catch (error) {
    console.error('❌ [VERB TEST] Failed:', error);
    return { error: error.message };
  }
}

// Function to check current Grammar Gems in database
export async function checkGrammarGemsInDatabase() {
  console.log('💎 [DB CHECK] Checking Grammar Gems in database...');
  
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    
    // Get all Grammar Gems
    const { data: grammarGems, error } = await supabase
      .from('gem_events')
      .select('*')
      .eq('gem_type', 'grammar')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('❌ [DB CHECK] Error:', error);
      return { error: error.message };
    }
    
    console.log('💎 [DB CHECK] Grammar Gems found:', grammarGems.length);
    console.log('💎 [DB CHECK] Latest Grammar Gems:', grammarGems);
    
    // Get analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from('student_consolidated_xp_analytics')
      .select('*')
      .order('total_xp', { ascending: false })
      .limit(5);
    
    if (analyticsError) {
      console.error('❌ [DB CHECK] Analytics error:', analyticsError);
    } else {
      console.log('📊 [DB CHECK] Top students by XP:', analytics);
    }
    
    return {
      grammarGemsCount: grammarGems.length,
      grammarGems,
      analytics
    };
    
  } catch (error) {
    console.error('❌ [DB CHECK] Failed:', error);
    return { error: error.message };
  }
}

// Quick test function for immediate verification
export async function quickGrammarGemTest() {
  console.log('⚡ [QUICK TEST] Running quick Grammar Gem verification...');

  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Check current Grammar Gems count
    const { data: beforeGems } = await supabase
      .from('gem_events')
      .select('id')
      .eq('gem_type', 'grammar');

    console.log('📊 [QUICK TEST] Grammar Gems before test:', beforeGems?.length || 0);

    // Get analytics before
    const { data: beforeAnalytics } = await supabase
      .from('student_consolidated_xp_analytics')
      .select('grammar_xp, total_grammar_gems')
      .limit(1);

    console.log('📊 [QUICK TEST] Analytics before:', beforeAnalytics?.[0]);

    return {
      grammarGemsBefore: beforeGems?.length || 0,
      analyticsBefore: beforeAnalytics?.[0]
    };

  } catch (error) {
    console.error('❌ [QUICK TEST] Failed:', error);
    return { error: error.message };
  }
}

// Export for browser console usage
if (typeof window !== 'undefined') {
  (window as any).testConjugationDuelGrammarGems = testConjugationDuelGrammarGems;
  (window as any).testVerbLoading = testVerbLoading;
  (window as any).checkGrammarGemsInDatabase = checkGrammarGemsInDatabase;
  (window as any).quickGrammarGemTest = quickGrammarGemTest;

  console.log('🧪 [TEST UTILS] Grammar Gem test functions loaded!');
  console.log('📋 [TEST UTILS] Available functions:');
  console.log('  - testConjugationDuelGrammarGems() - Full integration test');
  console.log('  - testVerbLoading() - Test verb loading from database');
  console.log('  - checkGrammarGemsInDatabase() - Check current Grammar Gems');
  console.log('  - quickGrammarGemTest() - Quick verification');
}
