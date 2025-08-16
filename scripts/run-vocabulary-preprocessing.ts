/**
 * Run Vocabulary Preprocessing
 * 
 * Clean and standardize the 'word' column in centralized_vocabulary
 * before AI processing to maximize GPT-5-Nano analysis value.
 */

import { createClient } from '@supabase/supabase-js';
import { VocabularyPreprocessingService } from '../src/services/VocabularyPreprocessingService';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function runPreprocessing(dryRun: boolean = true) {
  console.log('🧹 Starting Vocabulary Preprocessing\n');
  console.log('=' .repeat(70) + '\n');

  const preprocessingService = new VocabularyPreprocessingService(supabase);

  try {
    // Show rule examples
    preprocessingService.showRuleExamples();

    // Test rules on sample problematic data
    const sampleWords = [
      'erzählen (von + noun)',
      'warten (auf acc. + noun)', 
      'formar; formarse (en, como)',
      'le/la pilote',
      'el/la estudiante',
      'parce que, parce qu\'',
      'allein, alleine',
      'vuestro, vuestra, vuestros, vuestras',
      'nuestro, nuestra, nuestros, nuestras',
      '(an)bieten',
      'amüsieren; sich acc. amüsieren',
      'word   with    spaces'
    ];

    console.log('\n🧪 TESTING RULES ON SAMPLE DATA');
    console.log('=' .repeat(70));
    preprocessingService.testRules(sampleWords);

    // Run preprocessing analysis
    console.log('\n🔍 RUNNING PREPROCESSING ANALYSIS');
    console.log('=' .repeat(70));
    
    const summary = await preprocessingService.preprocessVocabulary(dryRun);

    // Display results
    console.log('\n📊 PREPROCESSING RESULTS');
    console.log('=' .repeat(70));
    console.log(`Total entries processed: ${summary.totalProcessed}`);
    console.log(`Entries that need changes: ${summary.totalChanged} (${((summary.totalChanged/summary.totalProcessed)*100).toFixed(1)}%)`);
    console.log(`Mode: ${summary.dryRun ? 'DRY RUN (no database changes)' : 'LIVE (database updated)'}`);
    console.log('');

    // Rule application breakdown
    console.log('🔧 RULE APPLICATION BREAKDOWN');
    console.log('=' .repeat(70));
    Object.entries(summary.ruleApplications).forEach(([rule, count]) => {
      if (count > 0) {
        console.log(`${rule.replace(/_/g, ' ').toUpperCase()}: ${count} applications`);
      }
    });
    console.log('');

    // Show sample changes
    if (summary.results.length > 0) {
      console.log('📝 SAMPLE CHANGES (First 20)');
      console.log('=' .repeat(70));
      
      summary.results.slice(0, 20).forEach((result, index) => {
        console.log(`${index + 1}. "${result.originalWord}" → "${result.cleanedWord}"`);
        console.log(`   Rules: ${result.appliedRules.join(', ')}`);
        console.log(`   Confidence: ${result.confidence}`);
        console.log('');
      });

      if (summary.results.length > 20) {
        console.log(`... and ${summary.results.length - 20} more changes`);
        console.log('');
      }
    }

    // Export results
    await preprocessingService.exportResults(summary);

    // Show impact analysis
    console.log('🎯 IMPACT ANALYSIS');
    console.log('=' .repeat(70));
    
    const highConfidenceChanges = summary.results.filter(r => r.confidence >= 0.9).length;
    const mediumConfidenceChanges = summary.results.filter(r => r.confidence >= 0.7 && r.confidence < 0.9).length;
    const lowConfidenceChanges = summary.results.filter(r => r.confidence < 0.7).length;

    console.log(`High confidence changes (≥0.9): ${highConfidenceChanges}`);
    console.log(`Medium confidence changes (0.7-0.9): ${mediumConfidenceChanges}`);
    console.log(`Low confidence changes (<0.7): ${lowConfidenceChanges}`);
    console.log('');

    // Recommendations
    console.log('💡 RECOMMENDATIONS');
    console.log('=' .repeat(70));
    
    if (summary.totalChanged === 0) {
      console.log('✅ No preprocessing needed - vocabulary is already clean!');
    } else if (highConfidenceChanges === summary.totalChanged) {
      console.log('✅ All changes are high confidence - safe to apply automatically');
      console.log('   Run with --apply flag to update database');
    } else if (lowConfidenceChanges > 0) {
      console.log('⚠️  Some low confidence changes detected');
      console.log('   Review preprocessing-results.json before applying');
      console.log('   Consider manual review of low confidence changes');
    } else {
      console.log('✅ Changes look good - mostly high/medium confidence');
      console.log('   Run with --apply flag to update database');
    }
    console.log('');

    // Next steps
    console.log('🎯 NEXT STEPS');
    console.log('=' .repeat(70));
    if (dryRun && summary.totalChanged > 0) {
      console.log('1. Review preprocessing-results.json');
      console.log('2. Run with --apply flag to update database');
      console.log('3. Re-run vocabulary audit to get updated categories');
      console.log('4. Proceed with GPT-5-Nano AI curation');
    } else if (!dryRun) {
      console.log('1. Re-run vocabulary audit to see updated categories');
      console.log('2. Proceed with GPT-5-Nano AI curation on cleaned data');
      console.log('3. Validate results with lemmatization system');
    } else {
      console.log('1. Proceed directly to GPT-5-Nano AI curation');
      console.log('2. No preprocessing changes needed');
    }
    console.log('');

    return summary;

  } catch (error) {
    console.error('❌ Preprocessing failed:', error);
    throw error;
  }
}

async function showStatistics() {
  console.log('📊 VOCABULARY STATISTICS BEFORE PREPROCESSING');
  console.log('=' .repeat(70));

  try {
    // Get entries with potential formatting issues
    const { data: entries, error } = await supabase
      .from('centralized_vocabulary')
      .select('word, language')
      .eq('should_track_for_fsrs', true);

    if (error || !entries) {
      console.log('❌ Failed to fetch vocabulary statistics');
      return;
    }

    // Analyze patterns
    const patterns = {
      withParentheses: entries.filter(e => e.word.includes('(')).length,
      withSemicolons: entries.filter(e => e.word.includes(';')).length,
      withCommas: entries.filter(e => e.word.includes(',')).length,
      withSlashes: entries.filter(e => e.word.includes('/')).length,
      multipleSpaces: entries.filter(e => /\s{2,}/.test(e.word)).length,
      total: entries.length
    };

    console.log(`Total entries: ${patterns.total}`);
    console.log(`With parentheses: ${patterns.withParentheses} (${((patterns.withParentheses/patterns.total)*100).toFixed(1)}%)`);
    console.log(`With semicolons: ${patterns.withSemicolons} (${((patterns.withSemicolons/patterns.total)*100).toFixed(1)}%)`);
    console.log(`With commas: ${patterns.withCommas} (${((patterns.withCommas/patterns.total)*100).toFixed(1)}%)`);
    console.log(`With slashes: ${patterns.withSlashes} (${((patterns.withSlashes/patterns.total)*100).toFixed(1)}%)`);
    console.log(`With multiple spaces: ${patterns.multipleSpaces} (${((patterns.multipleSpaces/patterns.total)*100).toFixed(1)}%)`);

    const totalProblematic = patterns.withParentheses + patterns.withSemicolons + 
                            patterns.withCommas + patterns.withSlashes + patterns.multipleSpaces;
    console.log(`\nEstimated problematic entries: ~${totalProblematic} (${((totalProblematic/patterns.total)*100).toFixed(1)}%)`);
    console.log('');

    // Show sample problematic entries
    const problematicSamples = entries.filter(e => 
      e.word.includes('(') || e.word.includes(';') || 
      e.word.includes(',') || e.word.includes('/') || 
      /\s{2,}/.test(e.word)
    ).slice(0, 10);

    if (problematicSamples.length > 0) {
      console.log('📝 SAMPLE PROBLEMATIC ENTRIES:');
      problematicSamples.forEach((entry, index) => {
        console.log(`${index + 1}. "${entry.word}" (${entry.language})`);
      });
      console.log('');
    }

  } catch (error) {
    console.error('❌ Statistics analysis failed:', error);
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--stats')) {
    await showStatistics();
    return;
  }

  const dryRun = !args.includes('--apply');
  
  if (!dryRun) {
    console.log('⚠️  LIVE MODE: This will modify the database!');
    console.log('   Press Ctrl+C to cancel, or wait 5 seconds to proceed...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // Show statistics first
  await showStatistics();
  
  // Run preprocessing
  await runPreprocessing(dryRun);
}

// Run if this script is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { runPreprocessing, showStatistics };
