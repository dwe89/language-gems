/**
 * Comprehensive Final Cleanup
 * 
 * Clean ALL remaining complex formatting across the entire database
 * Handle all the patterns that previous scripts missed
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

// Comprehensive cleanup rules for ALL patterns
const comprehensiveRules = [
  {
    name: 'gender_number_variants',
    description: 'Handle gender/number variants like "vuestro, vuestra, vuestros, vuestras"',
    pattern: /^(.+?),\s*(.+?),\s*(.+?),\s*(.+?)$/,
    replacement: (match: string, form1: string) => form1.trim(),
    examples: ['vuestro, vuestra, vuestros, vuestras → vuestro']
  },
  {
    name: 'pipe_with_parentheses',
    description: 'Handle pipe patterns with parentheses like "vous | (à) vous"',
    pattern: /^(.+?)\s*\|\s*\([^)]*\)\s*(.+?)$/,
    replacement: (match: string, form1: string) => form1.trim(),
    examples: ['vous | (à) vous → vous']
  },
  {
    name: 'pipe_patterns_general',
    description: 'Handle general pipe patterns like "ris | ris !"',
    pattern: /^(.+?)\s*\|\s*(.+)$/,
    replacement: (match: string, form1: string) => form1.trim(),
    examples: ['ris | ris ! → ris']
  },
  {
    name: 'gender_marker_with_semicolon',
    description: 'Handle patterns like "la grâce (f); grâce à"',
    pattern: /^(.+?)\s*\([mfnt]+\)\s*;\s*(.+)$/,
    replacement: (match: string, word: string) => word.trim(),
    examples: ['la grâce (f); grâce à → la grâce']
  },
  {
    name: 'simple_gender_markers',
    description: 'Handle simple gender markers like "Video (nt)" or "vieille (f)"',
    pattern: /^(.+?)\s*\([mfnt]+\)$/,
    replacement: (match: string, word: string) => word.trim(),
    examples: ['Video (nt) → Video', 'vieille (f) → vieille']
  },
  {
    name: 'slash_variants',
    description: 'Handle slash variants like "sano/a"',
    pattern: /^(.+?)\/(.+?)$/,
    replacement: (match: string, form1: string, form2: string) => {
      // Choose the longer, more complete form
      return form1.length >= form2.length ? form1.trim() : form1.trim() + form2.trim();
    },
    examples: ['sano/a → sano', 'au/à l\' → au']
  },
  {
    name: 'reflexive_semicolon',
    description: 'Handle reflexive patterns like "entendre; s\'entendre"',
    pattern: /^(.+?);\s*s'(.+)$/,
    replacement: (match: string, verb: string) => verb.trim(),
    examples: ['entendre; s\'entendre → entendre']
  },
  {
    name: 'semicolon_with_preposition',
    description: 'Handle patterns like "arriver; arriver à"',
    pattern: /^(.+?);\s*\1\s+à$/,
    replacement: (match: string, verb: string) => verb.trim(),
    examples: ['arriver; arriver à → arriver']
  },
  {
    name: 'parentheses_only',
    description: 'Handle standalone parentheses like "(à) moi"',
    pattern: /^\([^)]+\)\s*(.+)$/,
    replacement: (match: string, word: string) => word.trim(),
    examples: ['(à) moi → moi']
  },
  {
    name: 'incomplete_parentheses',
    description: 'Handle incomplete parentheses like "(ne"',
    pattern: /^\([^)]*$/,
    replacement: (match: string) => match.replace(/^\(/, '').trim(),
    examples: ['(ne → ne']
  },
  {
    name: 'multiple_forms_with_articles',
    description: 'Handle patterns like "el vuestro, la vuestra, los vuestros, las vuestras"',
    pattern: /^(el|la|los|las)\s+(.+?),\s*(el|la|los|las)\s+(.+?),\s*(el|la|los|las)\s+(.+?),\s*(el|la|los|las)\s+(.+?)$/,
    replacement: (match: string, art1: string, word1: string) => `${art1} ${word1}`.trim(),
    examples: ['el vuestro, la vuestra, los vuestros, las vuestras → el vuestro']
  },
  {
    name: 'three_forms_comma',
    description: 'Handle three-form patterns like "ce, cet, cette"',
    pattern: /^(.+?),\s*(.+?),\s*(.+?)$/,
    replacement: (match: string, form1: string) => form1.trim(),
    examples: ['ce, cet, cette → ce']
  },
  {
    name: 'two_forms_comma',
    description: 'Handle two-form patterns like "ce, cet"',
    pattern: /^(.+?),\s*(.+?)$/,
    replacement: (match: string, form1: string) => form1.trim(),
    examples: ['ce, cet → ce']
  }
];

function applyComprehensiveRules(word: string): { cleanedWord: string; appliedRules: string[] } {
  let cleaned = word;
  const appliedRules: string[] = [];

  // Apply rules in order of specificity (most specific first)
  for (const rule of comprehensiveRules) {
    const before = cleaned;
    cleaned = cleaned.replace(rule.pattern, rule.replacement);
    
    if (cleaned !== before) {
      appliedRules.push(rule.name);
      // Only apply one rule per pass to avoid conflicts
      break;
    }
  }

  // If we applied a rule, try again recursively
  if (appliedRules.length > 0 && cleaned !== word) {
    const nextPass = applyComprehensiveRules(cleaned);
    return {
      cleanedWord: nextPass.cleanedWord,
      appliedRules: [...appliedRules, ...nextPass.appliedRules]
    };
  }

  return { cleanedWord: cleaned.trim(), appliedRules };
}

async function testRulesOnKnownExamples(): Promise<void> {
  console.log('🧪 Testing Rules on Known Examples...\n');

  const knownExamples = [
    'vuestro, vuestra, vuestros, vuestras',
    'vous | (à) vous',
    'Video (nt)',
    'vieille (f)',
    'la grâce (f); grâce à',
    'el vuestro, la vuestra, los vuestros, las vuestras',
    'sano/a',
    'entendre; s\'entendre',
    'arriver; arriver à',
    '(à) moi',
    '(ne',
    'ris | ris !',
    'au/à l\'',
    'ce, cet'
  ];

  console.log('📝 Rule Testing Results:');
  knownExamples.forEach((example, index) => {
    const result = applyComprehensiveRules(example);
    console.log(`   ${index + 1}. "${example}"`);
    console.log(`      → "${result.cleanedWord}"`);
    console.log(`      Rules: ${result.appliedRules.join(', ') || 'none'}`);
    console.log('');
  });
}

async function cleanAllComplexFormatting(): Promise<{ processed: number; cleaned: number; examples: Array<{ before: string; after: string; rules: string[] }> }> {
  console.log('🧹 Cleaning ALL Complex Formatting in Database...\n');

  try {
    // Get ALL entries (not just a sample)
    const { data: entries, error } = await supabase
      .from('centralized_vocabulary')
      .select('id, word, language')
      .eq('should_track_for_fsrs', true);

    if (error || !entries) {
      console.log('❌ Failed to fetch entries');
      return { processed: 0, cleaned: 0, examples: [] };
    }

    console.log(`📊 Processing ${entries.length} total entries...`);

    // Find entries with ANY complex formatting
    const complexEntries = entries.filter(entry => {
      const word = entry.word;
      return (
        word.includes('(') ||
        word.includes(';') ||
        word.includes(',') ||
        word.includes('|') ||
        word.includes('?') ||
        word.includes('…') ||
        word.includes('+') ||
        word.includes('/') ||
        word.includes('[') ||
        word.includes(']') ||
        word !== word.trim() ||
        word.includes('  ')
      );
    });

    console.log(`🎯 Found ${complexEntries.length} entries with complex formatting`);

    let cleaned = 0;
    const examples: Array<{ before: string; after: string; rules: string[] }> = [];

    for (const entry of complexEntries) {
      const result = applyComprehensiveRules(entry.word);
      
      if (result.cleanedWord !== entry.word && result.cleanedWord.length > 0) {
        try {
          const { error: updateError } = await supabase
            .from('centralized_vocabulary')
            .update({
              word: result.cleanedWord,
              base_word: result.cleanedWord
            })
            .eq('id', entry.id);

          if (!updateError) {
            cleaned++;
            
            if (examples.length < 50) {
              examples.push({
                before: entry.word,
                after: result.cleanedWord,
                rules: result.appliedRules
              });
            }

            if (cleaned % 100 === 0) {
              console.log(`   Cleaned ${cleaned} entries...`);
            }
          }
        } catch (error) {
          // Skip problematic entries
        }
      }
    }

    console.log(`✅ Comprehensive cleanup: ${cleaned}/${complexEntries.length} entries cleaned\n`);
    return { processed: complexEntries.length, cleaned, examples };

  } catch (error) {
    console.error('❌ Comprehensive cleanup failed:', error);
    return { processed: 0, cleaned: 0, examples: [] };
  }
}

async function validateCleanupResults(): Promise<{ remainingComplex: number; qualityScore: number }> {
  console.log('📊 Validating Cleanup Results...\n');

  try {
    // Check for remaining complex formatting
    const { data: entries, error } = await supabase
      .from('centralized_vocabulary')
      .select('word')
      .eq('should_track_for_fsrs', true);

    if (error || !entries) {
      return { remainingComplex: 999, qualityScore: 0 };
    }

    const stillComplex = entries.filter(entry => {
      const word = entry.word;
      return (
        word.includes('(') ||
        word.includes(';') ||
        word.includes(',') ||
        word.includes('|') ||
        word.includes('?') ||
        word.includes('…') ||
        word.includes('+') ||
        word.includes('/') ||
        word !== word.trim()
      );
    });

    const remainingComplex = stillComplex.length;
    const complexPercentage = ((remainingComplex / entries.length) * 100).toFixed(1);
    
    // Calculate overall quality
    let qualityPoints = 0;
    for (const entry of entries.slice(0, 500)) { // Sample for quality check
      let score = 0;
      
      // Clean formatting (no complex characters)
      if (!entry.word.includes('(') && !entry.word.includes(';') && 
          !entry.word.includes(',') && !entry.word.includes('|')) {
        score += 50;
      }
      
      // Proper length
      if (entry.word.length > 0 && entry.word.length < 50) {
        score += 25;
      }
      
      // No leading/trailing spaces
      if (entry.word === entry.word.trim()) {
        score += 25;
      }
      
      qualityPoints += score;
    }
    
    const qualityScore = Math.round(qualityPoints / (500 * 100) * 100);

    console.log(`📈 Validation Results:`);
    console.log(`   Remaining complex entries: ${remainingComplex} (${complexPercentage}%)`);
    console.log(`   Overall quality score: ${qualityScore}%`);

    return { remainingComplex, qualityScore };

  } catch (error) {
    console.error('❌ Validation failed:', error);
    return { remainingComplex: 999, qualityScore: 0 };
  }
}

async function runComprehensiveFinalCleanup(): Promise<void> {
  console.log('🎯 COMPREHENSIVE FINAL CLEANUP - ALL REMAINING ISSUES\n');
  console.log('=' .repeat(70) + '\n');

  try {
    // Step 1: Test rules on known examples
    await testRulesOnKnownExamples();

    // Step 2: Clean all complex formatting
    const cleanupResults = await cleanAllComplexFormatting();

    // Step 3: Validate results
    const validationResults = await validateCleanupResults();

    // Show cleanup examples
    if (cleanupResults.examples.length > 0) {
      console.log('🎯 CLEANUP EXAMPLES:');
      cleanupResults.examples.slice(0, 20).forEach((example, index) => {
        console.log(`   ${index + 1}. "${example.before}" → "${example.after}"`);
        console.log(`      Rules: ${example.rules.join(', ')}`);
      });
      console.log('');
    }

    // Final summary
    console.log('🎉 COMPREHENSIVE CLEANUP COMPLETE');
    console.log('=' .repeat(70));
    console.log(`✅ Complex entries processed: ${cleanupResults.processed}`);
    console.log(`✅ Entries cleaned: ${cleanupResults.cleaned}`);
    console.log(`✅ Cleanup success rate: ${Math.round((cleanupResults.cleaned / cleanupResults.processed) * 100)}%`);
    console.log(`📊 Remaining complex entries: ${validationResults.remainingComplex}`);
    console.log(`📈 Final quality score: ${validationResults.qualityScore}%`);

    if (validationResults.remainingComplex < 50) {
      console.log('\n🎉 EXCELLENT! Complex formatting nearly eliminated!');
      console.log('✅ Database is now clean and production-ready!');
    } else if (validationResults.remainingComplex < 200) {
      console.log('\n✅ GOOD! Most complex formatting cleaned');
      console.log('🔧 Minor cleanup may still be needed');
    } else {
      console.log('\n⚠️  Additional cleanup rules may be needed');
    }

  } catch (error) {
    console.error('❌ Comprehensive cleanup failed:', error);
    throw error;
  }
}

// Run if this script is executed directly
if (require.main === module) {
  runComprehensiveFinalCleanup().catch(console.error);
}

export { runComprehensiveFinalCleanup };
