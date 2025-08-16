/**
 * Run Vocabulary Data Audit
 * 
 * Comprehensive analysis of centralized_vocabulary to identify data quality issues
 * and prepare for hybrid curation approach with GPT-5-Nano.
 */

import { createClient } from '@supabase/supabase-js';
import { VocabularyDataAuditService } from '../src/services/VocabularyDataAuditService';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function runVocabularyAudit() {
  console.log('🚀 Starting Vocabulary Data Audit\n');
  console.log('=' .repeat(60) + '\n');

  const auditService = new VocabularyDataAuditService(supabase);

  try {
    // Run comprehensive audit
    const results = await auditService.auditVocabularyData();

    // Display results
    console.log('📊 AUDIT RESULTS SUMMARY');
    console.log('=' .repeat(60));
    console.log(`Total entries analyzed: ${results.totalEntries}`);
    console.log(`Already correct: ${results.alreadyCorrect} (${Math.round((results.alreadyCorrect/results.totalEntries)*100)}%)`);
    console.log(`Category A (Automated fixes): ${results.categoryA.length}`);
    console.log(`Category B (AI review needed): ${results.categoryB.length}`);
    console.log('');

    // Detailed breakdown
    console.log('🔍 ISSUE BREAKDOWN');
    console.log('=' .repeat(60));
    console.log(`Conjugated verbs: ${results.summary.conjugatedVerbs}`);
    console.log(`Plural nouns: ${results.summary.pluralNouns}`);
    console.log(`Incorrect MWEs: ${results.summary.incorrectMWEs}`);
    console.log(`Missing MWEs: ${results.summary.missingMWEs}`);
    console.log(`Wrong MWE types: ${results.summary.wrongMWETypes}`);
    console.log(`Punctuation issues: ${results.summary.punctuationIssues}`);
    console.log(`Inconsistent base_words: ${results.summary.inconsistentBaseWords}`);
    console.log('');

    // Category A examples
    if (results.categoryA.length > 0) {
      console.log('🤖 CATEGORY A - AUTOMATED FIXES (Sample)');
      console.log('=' .repeat(60));
      results.categoryA.slice(0, 10).forEach((issue, index) => {
        console.log(`${index + 1}. "${issue.word}" (${issue.language})`);
        console.log(`   Issue: ${issue.description}`);
        console.log(`   Severity: ${issue.severity}, Confidence: ${issue.confidence}`);
        if (issue.suggestedFix) {
          console.log(`   Fix: ${JSON.stringify(issue.suggestedFix)}`);
        }
        console.log('');
      });
    }

    // Category B examples
    if (results.categoryB.length > 0) {
      console.log('🧠 CATEGORY B - AI REVIEW NEEDED (Sample)');
      console.log('=' .repeat(60));
      results.categoryB.slice(0, 10).forEach((issue, index) => {
        console.log(`${index + 1}. "${issue.word}" (${issue.language})`);
        console.log(`   Issue: ${issue.description}`);
        console.log(`   Severity: ${issue.severity}, Confidence: ${issue.confidence}`);
        console.log('');
      });
    }

    // Cost estimation for AI processing
    const categoryBCount = results.categoryB.length;
    const batchSize = 50;
    const batchCount = Math.ceil(categoryBCount / batchSize);
    
    const costEstimate = {
      entries: categoryBCount,
      batches: batchCount,
      inputTokens: batchCount * 9500,  // ~9.5k tokens per batch
      outputTokens: batchCount * 10000, // ~10k tokens per batch
      inputCost: (batchCount * 9500 / 1000000) * 0.05,
      outputCost: (batchCount * 10000 / 1000000) * 0.40,
      totalCost: 0
    };
    costEstimate.totalCost = costEstimate.inputCost + costEstimate.outputCost;

    console.log('💰 AI PROCESSING COST ESTIMATE');
    console.log('=' .repeat(60));
    console.log(`Entries needing AI review: ${costEstimate.entries}`);
    console.log(`Estimated batches (50 entries each): ${costEstimate.batches}`);
    console.log(`Estimated input tokens: ${costEstimate.inputTokens.toLocaleString()}`);
    console.log(`Estimated output tokens: ${costEstimate.outputTokens.toLocaleString()}`);
    console.log(`Input cost: $${costEstimate.inputCost.toFixed(4)}`);
    console.log(`Output cost: $${costEstimate.outputCost.toFixed(4)}`);
    console.log(`Total estimated cost: $${costEstimate.totalCost.toFixed(4)}`);
    console.log('');

    // Export results
    await auditService.exportAuditResults(results, 'vocabulary-audit-results.json');

    // Next steps
    console.log('🎯 NEXT STEPS');
    console.log('=' .repeat(60));
    console.log('1. Review Category A automated fixes');
    console.log('2. Implement automated fix pipeline');
    console.log('3. Set up GPT-5-Nano batch processing for Category B');
    console.log('4. Create human review interface');
    console.log('5. Execute data normalization pipeline');
    console.log('');

    // Priority recommendations
    const highSeverityIssues = [...results.categoryA, ...results.categoryB]
      .filter(issue => issue.severity === 'high' || issue.severity === 'critical');
    
    if (highSeverityIssues.length > 0) {
      console.log('⚠️  HIGH PRIORITY ISSUES');
      console.log('=' .repeat(60));
      console.log(`${highSeverityIssues.length} high/critical severity issues found:`);
      highSeverityIssues.slice(0, 5).forEach((issue, index) => {
        console.log(`${index + 1}. "${issue.word}": ${issue.description}`);
      });
      console.log('');
    }

    return results;

  } catch (error) {
    console.error('❌ Audit failed:', error);
    throw error;
  }
}

async function analyzeLanguageDistribution() {
  console.log('🌍 LANGUAGE DISTRIBUTION ANALYSIS');
  console.log('=' .repeat(60));

  try {
    const { data: languageStats, error } = await supabase
      .from('centralized_vocabulary')
      .select('language')
      .eq('should_track_for_fsrs', true);

    if (error || !languageStats) {
      console.log('❌ Failed to get language stats');
      return;
    }

    const distribution = languageStats.reduce((acc, entry) => {
      acc[entry.language] = (acc[entry.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(distribution).forEach(([lang, count]) => {
      const percentage = ((count / languageStats.length) * 100).toFixed(1);
      console.log(`${lang}: ${count} entries (${percentage}%)`);
    });

    console.log(`\nTotal: ${languageStats.length} entries`);
    console.log('');

  } catch (error) {
    console.error('❌ Language analysis failed:', error);
  }
}

async function sampleProblematicEntries() {
  console.log('🔍 SAMPLE PROBLEMATIC ENTRIES');
  console.log('=' .repeat(60));

  try {
    // Get some potentially problematic entries
    const { data: entries, error } = await supabase
      .from('centralized_vocabulary')
      .select('word, translation, language, is_mwe, mwe_type, component_words, base_word')
      .eq('should_track_for_fsrs', true)
      .or('word.like.%prefiero%,word.like.%bailo%,word.like.%casas%,word.like.%l\'%')
      .limit(20);

    if (error || !entries) {
      console.log('❌ Failed to get sample entries');
      return;
    }

    entries.forEach((entry, index) => {
      console.log(`${index + 1}. "${entry.word}" (${entry.language})`);
      console.log(`   Translation: "${entry.translation}"`);
      console.log(`   MWE: ${entry.is_mwe}, Type: ${entry.mwe_type || 'null'}`);
      console.log(`   Components: ${entry.component_words ? JSON.stringify(entry.component_words) : 'null'}`);
      console.log(`   Base word: ${entry.base_word || 'null'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Sample analysis failed:', error);
  }
}

async function runFullAnalysis() {
  console.log('🚀 COMPREHENSIVE VOCABULARY DATA ANALYSIS\n');
  
  // Language distribution
  await analyzeLanguageDistribution();
  
  // Sample problematic entries
  await sampleProblematicEntries();
  
  // Full audit
  const results = await runVocabularyAudit();
  
  console.log('🎉 Analysis complete! Check vocabulary-audit-results.json for full details.');
  
  return results;
}

// Run analysis if this script is executed directly
if (require.main === module) {
  runFullAnalysis().catch(console.error);
}

export { runVocabularyAudit, runFullAnalysis };
