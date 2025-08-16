// This file will be loaded directly by the browser, not as a module.

// Define all your test functions here, or copy them over.
// IMPORTANT: You'll need to make sure 'createBrowserClient' and other dependencies are available,
// which might mean copying the relevant Supabase setup or adjusting this.

// For now, let's just make sure one function works.
// You'll need to bring in the Supabase client creation or ensure it's available.
// For this example, let's simplify for demonstration:

// Add a helper function to find real assignment IDs
async function findRealAssignments() {
  console.log('🔍 [GRAMMAR TEST] Finding real assignment IDs...');
  
  const supabase = window.supabase_client;
  if (!supabase) {
    console.error('❌ Supabase client not available');
    return;
  }
  
  // Get all assignments
  const { data: assignments, error } = await supabase
    .from('assignments')
    .select('id, title, game_config')
    .limit(10);
    
  if (error) {
    console.error('❌ Error fetching assignments:', error);
    return;
  }
  
  console.log('📋 Available assignments:', assignments);
  
  // Get grammar assignments specifically
  const { data: grammarAssignments, error: grammarError } = await supabase
    .from('grammar_assignments')
    .select('id, assignment_id, language, tenses, persons, verb_types')
    .limit(10);
    
  if (grammarError) {
    console.error('❌ Error fetching grammar assignments:', grammarError);
    return;
  }
  
  console.log('📋 Available grammar assignments:', grammarAssignments);
  
  return { assignments, grammarAssignments };
}

async function testAssignmentConfiguration(assignmentId = 'ebf00092-a57c-4437-9cfd-b41c4d0fc39a') {
  console.log('🧪 [GRAMMAR TEST] Testing assignment configuration loading...');

  try {
    // Get the globally exposed Supabase client
    const supabase = window.supabase_client;

    if (!supabase) {
      console.error('❌ [GRAMMAR TEST] Supabase client not available globally');
      console.log('Available window properties:', Object.keys(window).filter(k => k.toLowerCase().includes('supabase')));
      return { success: false, error: 'Supabase client not initialized' };
    }

    console.log('✅ [GRAMMAR TEST] Supabase client found globally');

    // First, get the assignment
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select('id, title, game_config')
      .eq('id', assignmentId)
      .single();

    if (assignmentError) {
      console.error('❌ [GRAMMAR TEST] Error loading assignment:', assignmentError);
      return { success: false, error: assignmentError.message };
    }

    console.log('✅ [GRAMMAR TEST] Assignment loaded:', assignment);

    // Then, get the grammar assignment
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

    // Now let's test the ConjugationDuelService if available
    if (window.ConjugationDuelService) {
      console.log('🎯 [GRAMMAR TEST] Testing ConjugationDuelService...');
      // We would test the service here if it was globally available
    } else {
      console.log('⚠️ [GRAMMAR TEST] ConjugationDuelService not globally available');
    }

    console.log('✅ [GRAMMAR TEST] testAssignmentConfiguration ran successfully');

    return {
      success: true,
      results: {
        assignment,
        grammarAssignment,
        // Additional analysis
        configuredLanguage: grammarAssignment.language,
        configuredTenses: grammarAssignment.tenses,
        configuredPersons: grammarAssignment.persons,
        configuredVerbTypes: grammarAssignment.verb_types,
        verbCount: grammarAssignment.verb_count
      }
    };

  } catch (error) {
    console.error('❌ [GRAMMAR TEST] Assignment configuration test failed:', error);
    return { success: false, error: error.message };
  }
}

// Attach the function to the window object immediately
if (typeof window !== 'undefined') {
  window.testAssignmentConfiguration = testAssignmentConfiguration;
  window.findRealAssignments = findRealAssignments;
  // Add other test functions here if you want them globally available too
  // window.testGrammarSystemIntegration = testGrammarSystemIntegration;
  // etc.

  console.log('✅ [GRAMMAR TEST INJECTOR] testAssignmentConfiguration is now available!');
  console.log('✅ [GRAMMAR TEST INJECTOR] findRealAssignments is now available!');
}