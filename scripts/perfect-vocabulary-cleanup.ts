/**
 * Perfect Vocabulary Cleanup
 * 
 * Advanced preprocessing rules to handle all remaining complex formatting:
 * 1. French reflexive verbs (situer, se situer)
 * 2. Gender/number markers (lui (m, f), un (m))
 * 3. Complex expressions (moins (…que), fait; fait de + noun)
 * 4. Contractions and variants (du, de l', que, qu')
 * 5. Preposition markers (appartenir (à))
 * 6. Question markers (qui (?))
 * 7. Complex conjugation patterns
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CleanupRule {
  name: string;
  description: string;
  pattern: RegExp;
  replacement: (match: string, ...groups: string[]) => string;
  examples: { before: string; after: string }[];
  priority: number; // Lower number = higher priority
}

// Comprehensive cleanup rules ordered by priority
const advancedCleanupRules: CleanupRule[] = [
  {
    name: 'complex_conjugation_patterns',
    description: 'Handle complex conjugation with multiple forms and explanations',
    pattern: /^(.+?)\s*\|\s*.+?\;\s*.+$/,
    replacement: (match, baseForm) => baseForm.trim(),
    examples: [
      { before: 'faites | faites !; faites de | faites de !', after: 'faites' }
    ],
    priority: 1
  },
  {
    name: 'reflexive_verb_pairs',
    description: 'Extract primary verb from reflexive pairs',
    pattern: /^(.+?),\s*se\s+\1$/,
    replacement: (match, verb) => verb.trim(),
    examples: [
      { before: 'situer, se situer', after: 'situer' },
      { before: 'trouver, se trouver', after: 'trouver' }
    ],
    priority: 2
  },
  {
    name: 'verb_semicolon_reflexive',
    description: 'Handle verb; reflexive verb patterns',
    pattern: /^(.+?);\s*se\s+(.+)$/,
    replacement: (match, verb1, verb2) => verb1.trim(),
    examples: [
      { before: 'sentir; se sentir', after: 'sentir' },
      { before: 'identifier; s\'identifier', after: 'identifier' }
    ],
    priority: 3
  },
  {
    name: 'preposition_in_parentheses',
    description: 'Remove preposition markers in parentheses',
    pattern: /^(.+?)\s*\([àdeensuravecpour\s]+[^)]*\)$/,
    replacement: (match, word) => word.trim(),
    examples: [
      { before: 'appartenir (à)', after: 'appartenir' },
      { before: 's\'identifier (à)', after: 's\'identifier' }
    ],
    priority: 4
  },
  {
    name: 'gender_number_markers',
    description: 'Remove gender and number markers',
    pattern: /^(.+?)\s*\([mf](?:,\s*[mf])?\)$/,
    replacement: (match, word) => word.trim(),
    examples: [
      { before: 'lui (m, f)', after: 'lui' },
      { before: 'un (m)', after: 'un' },
      { before: 'inquiète (f)', after: 'inquiète' }
    ],
    priority: 5
  },
  {
    name: 'contraction_variants',
    description: 'Handle contraction variants',
    pattern: /^(.+?),\s*(.+?)\s*\([mf]\)$/,
    replacement: (match, form1, form2) => form1.trim(),
    examples: [
      { before: 'du, de l\' (m)', after: 'du' },
      { before: 'ce, cet (m), c\'', after: 'ce' }
    ],
    priority: 6
  },
  {
    name: 'multiple_forms_with_gender',
    description: 'Extract primary form from multiple gender variants',
    pattern: /^(.+?),\s*(.+?)\s*\([mf]\),\s*(.+)$/,
    replacement: (match, form1, form2, form3) => form1.trim(),
    examples: [
      { before: 'ce, cet (m), c\'', after: 'ce' }
    ],
    priority: 7
  },
  {
    name: 'question_markers',
    description: 'Remove question markers',
    pattern: /^(.+?)\s*\(\?\)$/,
    replacement: (match, word) => word.trim(),
    examples: [
      { before: 'qui (?)', after: 'qui' }
    ],
    priority: 8
  },
  {
    name: 'ellipsis_patterns',
    description: 'Handle ellipsis patterns in expressions',
    pattern: /^(.+?)\s*\(…(.+?)\)$/,
    replacement: (match, word, rest) => word.trim(),
    examples: [
      { before: 'moins (…que)', after: 'moins' }
    ],
    priority: 9
  },
  {
    name: 'complex_semicolon_patterns',
    description: 'Handle complex semicolon patterns with additional info',
    pattern: /^(.+?);\s*(.+?)\s*\+\s*noun$/,
    replacement: (match, word1, word2) => word1.trim(),
    examples: [
      { before: 'fait; fait de + noun', after: 'fait' }
    ],
    priority: 10
  },
  {
    name: 'semicolon_contrast_patterns',
    description: 'Handle semicolon with contrasting meanings',
    pattern: /^(.+?);\s*par\s+(.+)$/,
    replacement: (match, word1, word2) => word1.trim(),
    examples: [
      { before: 'contre; par contre', after: 'contre' }
    ],
    priority: 11
  },
  {
    name: 'apostrophe_variants',
    description: 'Handle apostrophe variants',
    pattern: /^(.+?),\s*(.+?)\'$/,
    replacement: (match, form1, form2) => form1.trim(),
    examples: [
      { before: 'que, qu\'', after: 'que' },
      { before: 'la, l\'', after: 'la' }
    ],
    priority: 12
  },
  {
    name: 'gender_marker_with_apostrophe',
    description: 'Handle gender markers with apostrophe variants',
    pattern: /^(.+?),\s*(.+?)\s*\([mf]\)$/,
    replacement: (match, form1, form2) => form1.trim(),
    examples: [
      { before: 'la, l\' (f)', after: 'la' }
    ],
    priority: 13
  }
];

async function findAllComplexEntries(): Promise<any[]> {
  console.log('🔍 Finding ALL Complex Formatting Entries...\n');

  try {
    const { data: entries, error } = await supabase
      .from('centralized_vocabulary')
      .select('id, word, language, translation')
      .eq('should_track_for_fsrs', true)
      .or('word.like.%(%,word.like.%;%,word.like.%,%,word.like.%?%,word.like.%…%,word.like.%|%');

    if (error || !entries) {
      console.log('❌ Failed to fetch complex entries');
      return [];
    }

    console.log(`📊 Found ${entries.length} entries with complex formatting`);

    // Group by language
    const byLanguage = entries.reduce((acc, entry) => {
      if (!acc[entry.language]) acc[entry.language] = [];
      acc[entry.language].push(entry);
      return acc;
    }, {} as Record<string, any[]>);

    Object.entries(byLanguage).forEach(([lang, langEntries]) => {
      console.log(`   ${lang.toUpperCase()}: ${langEntries.length} entries`);
    });

    return entries;

  } catch (error) {
    console.error('❌ Failed to find complex entries:', error);
    return [];
  }
}

function applyCleanupRules(word: string): { cleanedWord: string; appliedRules: string[] } {
  let cleaned = word;
  const appliedRules: string[] = [];

  // Sort rules by priority
  const sortedRules = [...advancedCleanupRules].sort((a, b) => a.priority - b.priority);

  for (const rule of sortedRules) {
    const before = cleaned;
    cleaned = cleaned.replace(rule.pattern, rule.replacement);
    
    if (cleaned !== before) {
      appliedRules.push(rule.name);
      // Only apply one rule per pass to avoid conflicts
      break;
    }
  }

  // If we applied a rule, try again (recursive cleanup)
  if (appliedRules.length > 0 && cleaned !== word) {
    const nextPass = applyCleanupRules(cleaned);
    return {
      cleanedWord: nextPass.cleanedWord,
      appliedRules: [...appliedRules, ...nextPass.appliedRules]
    };
  }

  return { cleanedWord: cleaned.trim(), appliedRules };
}

async function testCleanupRules(): Promise<void> {
  console.log('🧪 Testing Cleanup Rules...\n');

  const testCases = [
    'moins (…que)',
    'situer, se situer',
    'lui (m, f)',
    'du, de l\' (m)',
    'appartenir (à)',
    'ce, cet (m), c\'',
    'sentir; se sentir',
    'fait; fait de + noun',
    's\'identifier (à)',
    'un (m)',
    'qui (?)',
    'la, l\' (f)',
    'inquiète (f)',
    'contre; par contre',
    'faites | faites !; faites de | faites de !',
    'trouver; se trouver',
    'que, qu\''
  ];

  console.log('📝 Rule Testing Results:');
  testCases.forEach((testCase, index) => {
    const result = applyCleanupRules(testCase);
    console.log(`   ${index + 1}. "${testCase}"`);
    console.log(`      → "${result.cleanedWord}"`);
    console.log(`      Rules: ${result.appliedRules.join(', ') || 'none'}`);
    console.log('');
  });
}

async function applyPerfectCleanup(): Promise<{
  processed: number;
  cleaned: number;
  examples: Array<{ before: string; after: string; rules: string[] }>;
}> {
  console.log('🧹 Applying Perfect Cleanup to All Complex Entries...\n');

  const complexEntries = await findAllComplexEntries();
  
  if (complexEntries.length === 0) {
    return { processed: 0, cleaned: 0, examples: [] };
  }

  let processed = 0;
  let cleaned = 0;
  const examples: Array<{ before: string; after: string; rules: string[] }> = [];

  console.log(`🔄 Processing ${complexEntries.length} complex entries...`);

  for (const entry of complexEntries) {
    processed++;
    
    const result = applyCleanupRules(entry.word);
    
    if (result.cleanedWord !== entry.word && result.cleanedWord.length > 0) {
      try {
        // Update database
        const { error } = await supabase
          .from('centralized_vocabulary')
          .update({
            word: result.cleanedWord,
            base_word: result.cleanedWord
          })
          .eq('id', entry.id);

        if (!error) {
          cleaned++;
          
          // Add to examples
          if (examples.length < 50) {
            examples.push({
              before: entry.word,
              after: result.cleanedWord,
              rules: result.appliedRules
            });
          }

          if (cleaned % 50 === 0) {
            console.log(`   Cleaned ${cleaned} entries...`);
          }
        }
      } catch (error) {
        // Skip problematic entries
      }
    }
  }

  console.log(`✅ Perfect cleanup complete: ${cleaned}/${processed} entries cleaned`);
  return { processed, cleaned, examples };
}

async function expandLemmatizationPatterns(): Promise<number> {
  console.log('🔍 Expanding Lemmatization Patterns...\n');

  // Add more conjugation patterns that we're missing
  const additionalPatterns = [
    // Spanish past tense patterns
    { pattern: /ieron$/, replacement: 'ir', example: 'vivieron → vivir' },
    { pattern: /amos$/, replacement: 'ar', example: 'hablamos → hablar' },
    { pattern: /emos$/, replacement: 'er', example: 'comemos → comer' },
    
    // French patterns
    { pattern: /ons$/, replacement: 'er', example: 'mangeons → manger' },
    { pattern: /ez$/, replacement: 'er', example: 'parlez → parler' },
    { pattern: /ent$/, replacement: 'er', example: 'parlent → parler' },
    
    // German patterns
    { pattern: /en$/, replacement: 'en', example: 'essen → essen' },
    { pattern: /st$/, replacement: 'en', example: 'trinkst → trinken' },
    { pattern: /t$/, replacement: 'en', example: 'trinkt → trinken' }
  ];

  console.log('📊 Additional lemmatization patterns to implement:');
  additionalPatterns.forEach((pattern, index) => {
    console.log(`   ${index + 1}. ${pattern.example}`);
  });

  // This would require updating the LemmatizationService
  // For now, we'll return the count of patterns we identified
  return additionalPatterns.length;
}

async function expandMWEDatabase(): Promise<number> {
  console.log('🔗 Expanding MWE Database...\n');

  // Common MWEs that should be in the database
  const commonMWEs = [
    // Spanish
    { phrase: 'tener que', type: 'modal_expression', components: ['tener', 'que'] },
    { phrase: 'hay que', type: 'modal_expression', components: ['hay', 'que'] },
    { phrase: 'por favor', type: 'fixed_expression', components: ['por', 'favor'] },
    { phrase: 'de nada', type: 'fixed_expression', components: ['de', 'nada'] },
    
    // French
    { phrase: 'avoir besoin', type: 'modal_expression', components: ['avoir', 'besoin'] },
    { phrase: 'il y a', type: 'fixed_expression', components: ['il', 'y', 'a'] },
    { phrase: 'tout de suite', type: 'adverbial_phrase', components: ['tout', 'de', 'suite'] },
    { phrase: 'bien sûr', type: 'fixed_expression', components: ['bien', 'sûr'] },
    
    // German
    { phrase: 'es gibt', type: 'fixed_expression', components: ['es', 'gibt'] },
    { phrase: 'zum Beispiel', type: 'adverbial_phrase', components: ['zum', 'Beispiel'] },
    { phrase: 'auf Wiedersehen', type: 'fixed_expression', components: ['auf', 'Wiedersehen'] }
  ];

  console.log('📊 Common MWEs to add to database:');
  commonMWEs.forEach((mwe, index) => {
    console.log(`   ${index + 1}. "${mwe.phrase}" (${mwe.type})`);
  });

  // This would require adding these to the centralized_vocabulary table
  // For now, we'll return the count of MWEs we identified
  return commonMWEs.length;
}

async function runPerfectVocabularyCleanup(): Promise<void> {
  console.log('🎯 PERFECT VOCABULARY CLEANUP - MAKING IT FLAWLESS\n');
  console.log('=' .repeat(70) + '\n');

  try {
    // Step 1: Test cleanup rules
    await testCleanupRules();

    // Step 2: Apply perfect cleanup
    const cleanupResults = await applyPerfectCleanup();

    // Step 3: Expand lemmatization patterns
    const lemmatizationPatterns = await expandLemmatizationPatterns();

    // Step 4: Expand MWE database
    const mweExpansions = await expandMWEDatabase();

    // Show cleanup examples
    if (cleanupResults.examples.length > 0) {
      console.log('\n🎯 CLEANUP EXAMPLES:');
      cleanupResults.examples.slice(0, 20).forEach((example, index) => {
        console.log(`   ${index + 1}. "${example.before}" → "${example.after}"`);
        console.log(`      Rules: ${example.rules.join(', ')}`);
      });
    }

    // Summary
    console.log('\n🎉 PERFECT CLEANUP COMPLETE');
    console.log('=' .repeat(70));
    console.log(`✅ Complex entries cleaned: ${cleanupResults.cleaned}/${cleanupResults.processed}`);
    console.log(`✅ Lemmatization patterns identified: ${lemmatizationPatterns}`);
    console.log(`✅ MWE expansions identified: ${mweExpansions}`);

    const cleanupPercentage = Math.round((cleanupResults.cleaned / cleanupResults.processed) * 100);
    console.log(`📈 Cleanup success rate: ${cleanupPercentage}%`);

    if (cleanupPercentage >= 90) {
      console.log('\n🎉 EXCELLENT! Complex formatting issues resolved!');
    } else if (cleanupPercentage >= 75) {
      console.log('\n✅ GOOD! Most complex formatting issues resolved');
    } else {
      console.log('\n⚠️  Some complex patterns may need additional rules');
    }

    console.log('\n🚀 Next steps:');
    console.log('1. Update LemmatizationService with new patterns');
    console.log('2. Add common MWEs to centralized_vocabulary');
    console.log('3. Run final validation tests');

  } catch (error) {
    console.error('❌ Perfect cleanup failed:', error);
    throw error;
  }
}

// Run if this script is executed directly
if (require.main === module) {
  runPerfectVocabularyCleanup().catch(console.error);
}

export { runPerfectVocabularyCleanup };
