/**
 * Test utilities for the new Grammar System
 * Run these in the browser console to verify the grammar system is working
 */

import { createBrowserClient } from '@supabase/ssr';

// Test the grammar system integration
export async function testGrammarSystemIntegration() {
  console.log('🧪 [GRAMMAR TEST] Starting grammar system integration test...');
  
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Test 1: Check grammar verbs are loaded for all languages
    console.log('📊 [GRAMMAR TEST] Test 1: Checking grammar verbs...');
    const { data: verbStats, error: verbsError } = await supabase
      .from('grammar_verbs')
      .select('language')
      .then(async ({ data, error }) => {
        if (error) return { data: null, error };

        const stats = await Promise.all(['es', 'fr', 'de'].map(async (lang) => {
          const { data: langVerbs } = await supabase
            .from('grammar_verbs')
            .select('id, infinitive, translation, verb_type, difficulty')
            .eq('language', lang)
            .limit(5);

          const { data: conjugations } = await supabase
            .from('grammar_conjugations')
            .select('tense')
            .in('verb_id', langVerbs?.map(v => v.id) || []);

          return {
            language: lang,
            verbCount: langVerbs?.length || 0,
            conjugationCount: conjugations?.length || 0,
            sampleVerbs: langVerbs?.slice(0, 3) || [],
            availableTenses: [...new Set(conjugations?.map(c => c.tense) || [])]
          };
        }));

        return { data: stats, error: null };
      });

    if (verbsError) {
      console.error('❌ [GRAMMAR TEST] Error loading verbs:', verbsError);
      return { success: false, error: verbsError.message };
    }

    console.log('✅ [GRAMMAR TEST] Multi-language verb stats:');
    verbStats?.data?.forEach(stat => {
      const langName = stat.language === 'es' ? 'Spanish' : stat.language === 'fr' ? 'French' : 'German';
      console.log(`  ${langName}: ${stat.verbCount} verbs, ${stat.conjugationCount} conjugations`);
      console.log(`    Tenses: ${stat.availableTenses.join(', ')}`);
      console.log(`    Sample verbs: ${stat.sampleVerbs.map(v => v.infinitive).join(', ')}`);
    });

    // Test 2: Check conjugations are loaded
    console.log('📊 [GRAMMAR TEST] Test 2: Checking conjugations...');
    if (verbs && verbs.length > 0) {
      const testVerb = verbs[0];
      const { data: conjugations, error: conjugationsError } = await supabase
        .from('grammar_conjugations')
        .select('tense, person, conjugated_form, is_irregular')
        .eq('verb_id', testVerb.id)
        .eq('tense', 'present');

      if (conjugationsError) {
        console.error('❌ [GRAMMAR TEST] Error loading conjugations:', conjugationsError);
        return { success: false, error: conjugationsError.message };
      }

      console.log('✅ [GRAMMAR TEST] Found', conjugations?.length || 0, 'conjugations for', testVerb.infinitive);
      console.log('📋 [GRAMMAR TEST] Sample conjugations:', conjugations?.slice(0, 3));

      // Test 3: Test assignment grammar configuration
      console.log('📊 [GRAMMAR TEST] Test 3: Checking assignment grammar config...');
      const { data: assignments, error: assignmentsError } = await supabase
        .from('assignments')
        .select('id, title, game_config')
        .not('game_config', 'is', null)
        .limit(3);

      if (assignmentsError) {
        console.error('❌ [GRAMMAR TEST] Error loading assignments:', assignmentsError);
        return { success: false, error: assignmentsError.message };
      }

      console.log('✅ [GRAMMAR TEST] Found', assignments?.length || 0, 'assignments with game config');
      
      const grammarAssignments = assignments?.filter(a => 
        a.game_config?.gameConfig?.grammarConfig
      );
      
      console.log('📋 [GRAMMAR TEST] Grammar assignments:', grammarAssignments?.length || 0);
      if (grammarAssignments && grammarAssignments.length > 0) {
        console.log('📋 [GRAMMAR TEST] Sample grammar config:', grammarAssignments[0].game_config.gameConfig.grammarConfig);
      }

      return {
        success: true,
        results: {
          verbsCount: verbs?.length || 0,
          conjugationsCount: conjugations?.length || 0,
          assignmentsCount: assignments?.length || 0,
          grammarAssignmentsCount: grammarAssignments?.length || 0,
          sampleVerb: testVerb,
          sampleConjugations: conjugations?.slice(0, 3),
          sampleGrammarConfig: grammarAssignments?.[0]?.game_config?.gameConfig?.grammarConfig
        }
      };
    }

    return { success: false, error: 'No verbs found' };

  } catch (error) {
    console.error('❌ [GRAMMAR TEST] Test failed:', error);
    return { success: false, error: error.message };
  }
}

// Test creating a grammar assignment
export async function testCreateGrammarAssignment() {
  console.log('🧪 [GRAMMAR TEST] Testing grammar assignment creation...');
  
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('❌ [GRAMMAR TEST] No authenticated user');
      return { success: false, error: 'No authenticated user' };
    }

    // Create a test grammar assignment
    const testAssignment = {
      title: 'Grammar System Test Assignment',
      description: 'Test assignment for the new grammar system',
      created_by: user.id,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
      game_config: {
        gameConfig: {
          selectedGames: ['conjugation-duel'],
          grammarConfig: {
            language: 'spanish',
            verbTypes: ['regular', 'irregular'],
            tenses: ['present', 'preterite'],
            persons: ['yo', 'tu', 'el_ella_usted'],
            difficulty: 'intermediate',
            verbCount: 15
          },
          timeLimit: 20,
          maxAttempts: 3,
          autoGrade: true,
          feedbackEnabled: true
        }
      }
    };

    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .insert(testAssignment)
      .select()
      .single();

    if (assignmentError) {
      console.error('❌ [GRAMMAR TEST] Error creating assignment:', assignmentError);
      return { success: false, error: assignmentError.message };
    }

    console.log('✅ [GRAMMAR TEST] Created test assignment:', assignment.id);

    // Create corresponding grammar assignment record
    const grammarAssignmentData = {
      assignment_id: assignment.id,
      language: 'es',
      tenses: ['present', 'preterite'],
      persons: ['yo', 'tu', 'el_ella_usted'],
      verb_types: ['regular', 'irregular'],
      difficulty: 'intermediate',
      verb_count: 15
    };

    const { data: grammarAssignment, error: grammarError } = await supabase
      .from('grammar_assignments')
      .insert(grammarAssignmentData)
      .select()
      .single();

    if (grammarError) {
      console.error('❌ [GRAMMAR TEST] Error creating grammar assignment:', grammarError);
      return { success: false, error: grammarError.message };
    }

    console.log('✅ [GRAMMAR TEST] Created grammar assignment record:', grammarAssignment.id);

    return {
      success: true,
      assignmentId: assignment.id,
      grammarAssignmentId: grammarAssignment.id,
      assignment,
      grammarAssignment
    };

  } catch (error) {
    console.error('❌ [GRAMMAR TEST] Test failed:', error);
    return { success: false, error: error.message };
  }
}

// Test grammar practice recording
export async function testGrammarPracticeRecording() {
  console.log('🧪 [GRAMMAR TEST] Testing grammar practice recording...');
  
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('❌ [GRAMMAR TEST] No authenticated user');
      return { success: false, error: 'No authenticated user' };
    }

    // Get a test verb
    const { data: verbs } = await supabase
      .from('grammar_verbs')
      .select('id, infinitive')
      .eq('language', 'es')
      .limit(1);

    if (!verbs || verbs.length === 0) {
      console.error('❌ [GRAMMAR TEST] No verbs found');
      return { success: false, error: 'No verbs found' };
    }

    const testVerb = verbs[0];

    // Record a practice attempt
    const practiceAttempt = {
      student_id: user.id,
      session_id: `test-session-${Date.now()}`,
      verb_id: testVerb.id,
      tense: 'present',
      person: 'yo',
      expected_answer: 'hablo',
      student_answer: 'hablo',
      is_correct: true,
      response_time_ms: 2500
    };

    const { data: attempt, error: attemptError } = await supabase
      .from('grammar_practice_attempts')
      .insert(practiceAttempt)
      .select()
      .single();

    if (attemptError) {
      console.error('❌ [GRAMMAR TEST] Error recording practice:', attemptError);
      return { success: false, error: attemptError.message };
    }

    console.log('✅ [GRAMMAR TEST] Recorded practice attempt:', attempt.id);

    return {
      success: true,
      attemptId: attempt.id,
      attempt
    };

  } catch (error) {
    console.error('❌ [GRAMMAR TEST] Test failed:', error);
    return { success: false, error: error.message };
  }
}

// Test specific assignment loading
export async function testSpecificAssignmentLoading(assignmentId: string = '2649b5da-9572-4ee3-821a-bae841b12d8b') {
  console.log('🧪 [GRAMMAR TEST] Testing specific assignment loading for:', assignmentId);

  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Test 1: Check assignment configuration
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select(`
        id,
        title,
        vocabulary_selection_type,
        vocabulary_criteria,
        game_config
      `)
      .eq('id', assignmentId)
      .single();

    if (assignmentError) {
      console.error('❌ [GRAMMAR TEST] Error loading assignment:', assignmentError);
      return { success: false, error: assignmentError.message };
    }

    console.log('✅ [GRAMMAR TEST] Assignment loaded:', {
      id: assignment.id,
      title: assignment.title,
      vocabularySelectionType: assignment.vocabulary_selection_type,
      hasVocabularyCriteria: !!assignment.vocabulary_criteria,
      hasGameConfig: !!assignment.game_config,
      selectedGames: assignment.game_config?.gameConfig?.selectedGames
    });

    // Test 2: Check grammar assignment
    const { data: grammarAssignment, error: grammarError } = await supabase
      .from('grammar_assignments')
      .select('*')
      .eq('assignment_id', assignmentId)
      .single();

    if (grammarError) {
      console.error('❌ [GRAMMAR TEST] Error loading grammar assignment:', grammarError);
      return { success: false, error: grammarError.message };
    }

    console.log('✅ [GRAMMAR TEST] Grammar assignment loaded:', grammarAssignment);

    // Test 3: Test ConjugationDuelService loading
    const { ConjugationDuelService } = await import('../services/ConjugationDuelService');
    const service = new ConjugationDuelService();

    const grammarConfig = await service.loadGrammarAssignmentConfig(assignmentId);
    console.log('✅ [GRAMMAR TEST] Service loaded grammar config:', grammarConfig);

    // Test 4: Test verb loading with grammar config
    if (grammarConfig) {
      const verbs = await service.loadGrammarVerbs(
        grammarConfig.language,
        grammarConfig.difficulty,
        grammarConfig.verb_types,
        grammarConfig.verb_count
      );
      console.log('✅ [GRAMMAR TEST] Service loaded verbs:', verbs.length, 'verbs');
      console.log('📋 [GRAMMAR TEST] Sample verbs:', verbs.slice(0, 3));
    }

    return {
      success: true,
      results: {
        assignment,
        grammarAssignment,
        grammarConfig,
        verbsLoaded: grammarConfig ? true : false
      }
    };

  } catch (error) {
    console.error('❌ [GRAMMAR TEST] Test failed:', error);
    return { success: false, error: error.message };
  }
}

// Test complete assignment flow
export async function testCompleteGrammarAssignmentFlow() {
  console.log('🧪 [GRAMMAR TEST] Testing complete grammar assignment flow...');

  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Step 1: Check if we have grammar assignments
    const { data: grammarAssignments, error: grammarError } = await supabase
      .from('grammar_assignments')
      .select(`
        *,
        assignments!inner(
          id,
          title,
          game_config
        )
      `)
      .limit(1);

    if (grammarError) {
      console.error('❌ [GRAMMAR TEST] Error loading grammar assignments:', grammarError);
      return { success: false, error: grammarError.message };
    }

    if (!grammarAssignments || grammarAssignments.length === 0) {
      console.log('📝 [GRAMMAR TEST] No grammar assignments found, creating one...');
      const createResult = await testCreateGrammarAssignment();
      if (!createResult.success) {
        return createResult;
      }
    }

    // Step 2: Test assignment loading
    const testAssignment = grammarAssignments?.[0] || null;
    if (testAssignment) {
      console.log('✅ [GRAMMAR TEST] Found grammar assignment:', {
        assignmentId: testAssignment.assignment_id,
        language: testAssignment.language,
        tenses: testAssignment.tenses,
        persons: testAssignment.persons,
        verbTypes: testAssignment.verb_types,
        difficulty: testAssignment.difficulty
      });

      // Step 3: Test verb loading for this assignment
      const { data: verbs } = await supabase
        .from('grammar_verbs')
        .select('id, infinitive, translation')
        .eq('language', testAssignment.language)
        .in('verb_type', testAssignment.verb_types)
        .eq('difficulty', testAssignment.difficulty)
        .limit(5);

      console.log('✅ [GRAMMAR TEST] Found', verbs?.length || 0, 'matching verbs for assignment');

      // Step 4: Test conjugation loading
      if (verbs && verbs.length > 0) {
        const testVerb = verbs[0];
        const { data: conjugations } = await supabase
          .from('grammar_conjugations')
          .select('tense, person, conjugated_form')
          .eq('verb_id', testVerb.id)
          .in('tense', testAssignment.tenses)
          .in('person', testAssignment.persons);

        console.log('✅ [GRAMMAR TEST] Found', conjugations?.length || 0, 'conjugations for', testVerb.infinitive);

        return {
          success: true,
          results: {
            grammarAssignment: testAssignment,
            availableVerbs: verbs?.length || 0,
            availableConjugations: conjugations?.length || 0,
            sampleVerb: testVerb,
            sampleConjugations: conjugations?.slice(0, 3)
          }
        };
      }
    }

    return { success: false, error: 'No test data available' };

  } catch (error) {
    console.error('❌ [GRAMMAR TEST] Complete flow test failed:', error);
    return { success: false, error: error.message };
  }
}

// Test grammar dashboard data
export async function testGrammarDashboardData(studentId?: string) {
  console.log('🧪 [GRAMMAR TEST] Testing grammar dashboard data...');

  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Get current user if no studentId provided
    if (!studentId) {
      const { data: { user } } = await supabase.auth.getUser();
      studentId = user?.id;
    }

    if (!studentId) {
      console.error('❌ [GRAMMAR TEST] No student ID available');
      return { success: false, error: 'No student ID' };
    }

    console.log('👤 [GRAMMAR TEST] Testing for student ID:', studentId);

    // Test 1: Check grammar practice attempts
    const { data: attempts, error: attemptsError } = await supabase
      .from('grammar_practice_attempts')
      .select(`
        *,
        grammar_verbs!inner(infinitive, translation, language)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (attemptsError) {
      console.error('❌ [GRAMMAR TEST] Error loading practice attempts:', attemptsError);
    } else {
      console.log('✅ [GRAMMAR TEST] Found', attempts?.length || 0, 'practice attempts');
      if (attempts && attempts.length > 0) {
        console.log('📋 [GRAMMAR TEST] Recent attempts:', attempts.slice(0, 3));
      }
    }

    // Test 2: Check grammar analytics view
    const { data: analytics, error: analyticsError } = await supabase
      .from('student_grammar_analytics')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (analyticsError) {
      console.error('❌ [GRAMMAR TEST] Error loading analytics:', analyticsError);
    } else {
      console.log('✅ [GRAMMAR TEST] Grammar analytics:', analytics);
    }

    // Test 3: Check grammar gems
    const { data: gems, error: gemsError } = await supabase
      .from('student_grammar_gems_analytics')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (gemsError) {
      console.error('❌ [GRAMMAR TEST] Error loading grammar gems:', gemsError);
    } else {
      console.log('✅ [GRAMMAR TEST] Grammar gems:', gems);
    }

    return {
      success: true,
      results: {
        practiceAttempts: attempts?.length || 0,
        analytics: analytics,
        gems: gems,
        hasData: (attempts?.length || 0) > 0
      }
    };

  } catch (error) {
    console.error('❌ [GRAMMAR TEST] Dashboard test failed:', error);
    return { success: false, error: error.message };
  }
}

// Export for browser console usage
if (typeof window !== 'undefined') {
  (window as any).testGrammarSystemIntegration = testGrammarSystemIntegration;
  (window as any).testCreateGrammarAssignment = testCreateGrammarAssignment;
  (window as any).testGrammarPracticeRecording = testGrammarPracticeRecording;
  (window as any).testCompleteGrammarAssignmentFlow = testCompleteGrammarAssignmentFlow;
  (window as any).testSpecificAssignmentLoading = testSpecificAssignmentLoading;
  (window as any).testGrammarDashboardData = testGrammarDashboardData;
  (window as any).testGrammarPracticeFlow = testGrammarPracticeFlow;

  console.log('🧪 [GRAMMAR TEST] Grammar system test functions loaded!');
  console.log('📋 [GRAMMAR TEST] Available functions:');
  console.log('  - testGrammarSystemIntegration() - Test grammar verbs and conjugations');
  console.log('  - testCreateGrammarAssignment() - Test creating grammar assignments');
  console.log('  - testGrammarPracticeRecording() - Test recording practice attempts');
  console.log('  - testCompleteGrammarAssignmentFlow() - Test complete assignment flow');
  console.log('  - testSpecificAssignmentLoading(assignmentId) - Debug specific assignment');
  console.log('  - testGrammarDashboardData(studentId?) - Test grammar dashboard data');
  console.log('  - testGrammarPracticeFlow() - Test complete practice recording flow');
  console.log('  - testAssignmentConfiguration(assignmentId?) - Test assignment config loading');
}

// Test assignment configuration loading
export async function testAssignmentConfiguration(assignmentId: string = 'ebf00092-a57c-4437-9cfd-b41c4d0fc39a') {
  console.log('🧪 [GRAMMAR TEST] Testing assignment configuration loading...');

  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Test 1: Load assignment from database
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select(`
        id,
        title,
        game_config
      `)
      .eq('id', assignmentId)
      .single();

    if (assignmentError) {
      console.error('❌ [GRAMMAR TEST] Error loading assignment:', assignmentError);
      return { success: false, error: assignmentError.message };
    }

    console.log('✅ [GRAMMAR TEST] Assignment loaded:', assignment);

    // Test 1.5: Load grammar assignment separately
    const { data: grammarAssignment, error: grammarError } = await supabase
      .from('grammar_assignments')
      .select('*')
      .eq('assignment_id', assignmentId)
      .single();

    if (grammarError) {
      console.error('❌ [GRAMMAR TEST] Error loading grammar assignment:', grammarError);
      return { success: false, error: grammarError.message };
    }

    console.log('✅ [GRAMMAR TEST] Grammar assignment loaded:', grammarAssignment);

    // Test 2: Test ConjugationDuelService configuration loading
    const { ConjugationDuelService } = await import('../services/ConjugationDuelService');
    const grammarService = new ConjugationDuelService(supabase);

    const grammarConfig = await grammarService.loadGrammarAssignmentConfig(assignmentId);
    console.log('✅ [GRAMMAR TEST] Grammar config loaded:', grammarConfig);

    // Test 3: Generate a test challenge to see what tenses/persons are used
    const testConfig = {
      language: grammarConfig.language,
      tenses: grammarConfig.tenses,
      persons: grammarConfig.persons,
      difficulty: grammarConfig.difficulty || 'beginner',
      challengeCount: 3,
      verbTypes: grammarConfig.verb_types
    };

    console.log('🎯 [GRAMMAR TEST] Test config:', testConfig);

    const challenges = await grammarService.generateDuelSession(testConfig, assignmentId);
    console.log('✅ [GRAMMAR TEST] Generated challenges:', challenges);

    // Analyze the challenges
    const tenseUsage = challenges.reduce((acc, challenge) => {
      acc[challenge.tense] = (acc[challenge.tense] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const personUsage = challenges.reduce((acc, challenge) => {
      acc[challenge.person] = (acc[challenge.person] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('📊 [GRAMMAR TEST] Tense usage:', tenseUsage);
    console.log('📊 [GRAMMAR TEST] Person usage:', personUsage);

    return {
      success: true,
      results: {
        assignment,
        grammarAssignment,
        grammarConfig,
        challenges,
        tenseUsage,
        personUsage,
        configuredTenses: grammarConfig.tenses,
        configuredPersons: grammarConfig.persons
      }
    };

  } catch (error) {
    console.error('❌ [GRAMMAR TEST] Assignment configuration test failed:', error);
    return { success: false, error: error.message };
  }
}

// Test the complete grammar practice recording flow
export async function testGrammarPracticeFlow() {
  console.log('🧪 [GRAMMAR TEST] Testing complete grammar practice flow...');

  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('❌ [GRAMMAR TEST] No authenticated user');
      return { success: false, error: 'No authenticated user' };
    }

    console.log('👤 [GRAMMAR TEST] Testing for user:', user.id);

    // Test 1: Check if we have active game sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('enhanced_game_sessions')
      .select('id, student_id, game_type, assignment_id, created_at')
      .eq('student_id', user.id)
      .eq('game_type', 'conjugation-duel')
      .order('created_at', { ascending: false })
      .limit(5);

    if (sessionsError) {
      console.error('❌ [GRAMMAR TEST] Error loading sessions:', sessionsError);
      return { success: false, error: sessionsError.message };
    }

    console.log('✅ [GRAMMAR TEST] Found', sessions?.length || 0, 'conjugation-duel sessions');
    if (sessions && sessions.length > 0) {
      console.log('📋 [GRAMMAR TEST] Recent sessions:', sessions);
    }

    // Test 2: Test grammar practice recording directly
    if (sessions && sessions.length > 0) {
      const testSession = sessions[0];
      console.log('🧪 [GRAMMAR TEST] Testing grammar practice recording with session:', testSession.id);

      // Create a ConjugationDuelService instance
      const { ConjugationDuelService } = await import('../services/ConjugationDuelService');
      const grammarService = new ConjugationDuelService(supabase);

      // Test recording a practice attempt
      await grammarService.recordGrammarPracticeAttempt(
        user.id,
        testSession.id, // session ID
        testSession.assignment_id,
        'hablar', // verb
        'present', // tense
        'yo', // person
        'hablo', // user answer
        'hablo', // correct answer
        true, // is correct
        1500, // response time
        'spanish' // language
      );

      console.log('✅ [GRAMMAR TEST] Practice attempt recorded successfully');
    }

    // Test 3: Check if practice attempts were recorded
    const { data: attempts, error: attemptsError } = await supabase
      .from('grammar_practice_attempts')
      .select(`
        *,
        grammar_verbs!inner(infinitive, translation, language)
      `)
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (attemptsError) {
      console.error('❌ [GRAMMAR TEST] Error loading practice attempts:', attemptsError);
    } else {
      console.log('✅ [GRAMMAR TEST] Found', attempts?.length || 0, 'grammar practice attempts');
      if (attempts && attempts.length > 0) {
        console.log('📋 [GRAMMAR TEST] Recent attempts:', attempts);
      }
    }

    // Test 4: Check grammar analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from('student_grammar_analytics')
      .select('*')
      .eq('student_id', user.id)
      .single();

    if (analyticsError) {
      console.error('❌ [GRAMMAR TEST] Error loading analytics:', analyticsError);
    } else {
      console.log('✅ [GRAMMAR TEST] Grammar analytics:', analytics);
    }

    return {
      success: true,
      results: {
        sessionsFound: sessions?.length || 0,
        practiceAttemptsFound: attempts?.length || 0,
        analyticsAvailable: !!analytics,
        testCompleted: true
      }
    };

  } catch (error) {
    console.error('❌ [GRAMMAR TEST] Complete flow test failed:', error);
    return { success: false, error: error.message };
  }
}

// Auto-load functions when this module is imported
console.log('🔧 [GRAMMAR TEST] Loading grammar test functions...');
if (typeof window !== 'undefined') {
  // Ensure functions are available immediately
  setTimeout(() => {
    (window as any).testGrammarSystemIntegration = testGrammarSystemIntegration;
    (window as any).testCreateGrammarAssignment = testCreateGrammarAssignment;
    (window as any).testGrammarPracticeRecording = testGrammarPracticeRecording;
    (window as any).testCompleteGrammarAssignmentFlow = testCompleteGrammarAssignmentFlow;
    (window as any).testSpecificAssignmentLoading = testSpecificAssignmentLoading;
    (window as any).testGrammarDashboardData = testGrammarDashboardData;
    (window as any).testGrammarPracticeFlow = testGrammarPracticeFlow;
    (window as any).testAssignmentConfiguration = testAssignmentConfiguration;
    console.log('✅ [GRAMMAR TEST] All test functions are now available in browser console');
  }, 100);
}
