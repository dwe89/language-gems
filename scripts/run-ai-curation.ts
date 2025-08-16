/**
 * Run AI-Assisted Vocabulary Curation
 * 
 * Process Category B entries using GPT-5-Nano for complex linguistic analysis.
 */

import { createClient } from '@supabase/supabase-js';
import { VocabularyDataAuditService } from '../src/services/VocabularyDataAuditService';
import { AIVocabularyCurationService } from '../src/services/AIVocabularyCurationService';
import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function runAICuration() {
  console.log('🤖 Starting AI-Assisted Vocabulary Curation\n');
  console.log('=' .repeat(70) + '\n');

  // Check for OpenAI API key
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY not found in .env.local');
  }

  console.log('✅ OpenAI API key found');
  console.log('🎯 Target model: gpt-5-nano-2025-08-07');
  console.log('');

  // Initialize services
  const auditService = new VocabularyDataAuditService(supabase);
  const aiService = new AIVocabularyCurationService(supabase, openaiApiKey);

  try {
    // Step 1: Load existing audit results or run new audit
    let auditResults;
    try {
      const auditData = await fs.readFile('vocabulary-audit-results.json', 'utf-8');
      auditResults = JSON.parse(auditData);
      console.log('📄 Loaded existing audit results');
    } catch (error) {
      console.log('🔍 Running fresh vocabulary audit...');
      auditResults = await auditService.auditVocabularyData();
      await auditService.exportAuditResults(auditResults);
    }

    console.log(`📊 Audit Summary:`);
    console.log(`   Total entries: ${auditResults.totalEntries}`);
    console.log(`   Category A (automated): ${auditResults.categoryA.length}`);
    console.log(`   Category B (AI review): ${auditResults.categoryB.length}`);
    console.log('');

    // Step 2: Process Category B entries with AI
    if (auditResults.categoryB.length === 0) {
      console.log('✅ No Category B entries to process!');
      return;
    }

    console.log(`🤖 Processing ${auditResults.categoryB.length} Category B entries with GPT-5-Nano...`);
    
    // Show cost estimate
    const batchCount = Math.ceil(auditResults.categoryB.length / 20); // Updated for new batch size
    const estimatedCost = (batchCount * 4000 / 1000000) * 0.05 + (batchCount * 5000 / 1000000) * 0.40;
    console.log(`💰 Estimated cost: $${estimatedCost.toFixed(4)} for ${batchCount} batches`);
    console.log('');

    // Confirm before proceeding
    console.log('⚠️  About to make API calls to GPT-5-Nano. Continue? (This will incur costs)');
    console.log('   Press Ctrl+C to cancel, or wait 5 seconds to proceed...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Process with AI
    const aiResults = await aiService.processAllCategoryB(auditResults.categoryB);

    // Step 3: Display results
    console.log('\n🎉 AI PROCESSING COMPLETE');
    console.log('=' .repeat(70));
    console.log(`📊 Results Summary:`);
    console.log(`   Entries processed: ${aiResults.totalProcessed}/${auditResults.categoryB.length}`);
    console.log(`   Total cost: $${aiResults.totalCost.toFixed(4)}`);
    console.log(`   Errors: ${aiResults.errors.length}`);
    console.log('');

    // Show sample suggestions
    if (aiResults.suggestions.length > 0) {
      console.log('🔍 SAMPLE AI SUGGESTIONS');
      console.log('=' .repeat(70));
      
      aiResults.suggestions.slice(0, 10).forEach((suggestion, index) => {
        console.log(`${index + 1}. "${suggestion.originalWord}" → "${suggestion.lemma}"`);
        console.log(`   Language: ${suggestion.originalWord} (confidence: ${suggestion.confidence})`);
        console.log(`   MWE: ${suggestion.isMWE}, Type: ${suggestion.mweType || 'N/A'}`);
        console.log(`   Part of speech: ${suggestion.partOfSpeech}`);
        console.log(`   Reasoning: ${suggestion.reasoning}`);
        if (suggestion.componentWords) {
          console.log(`   Components: ${JSON.stringify(suggestion.componentWords)}`);
        }
        console.log('');
      });
    }

    // Show high-confidence suggestions
    const highConfidenceSuggestions = aiResults.suggestions.filter(s => s.confidence >= 0.8);
    console.log(`✅ HIGH CONFIDENCE SUGGESTIONS: ${highConfidenceSuggestions.length}/${aiResults.suggestions.length}`);
    
    if (highConfidenceSuggestions.length > 0) {
      console.log('Top high-confidence suggestions:');
      highConfidenceSuggestions.slice(0, 5).forEach((suggestion, index) => {
        console.log(`   ${index + 1}. "${suggestion.originalWord}" → "${suggestion.lemma}" (${suggestion.confidence})`);
      });
      console.log('');
    }

    // Show errors if any
    if (aiResults.errors.length > 0) {
      console.log('❌ ERRORS ENCOUNTERED');
      console.log('=' .repeat(70));
      aiResults.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
      console.log('');
    }

    // Step 4: Export for human review
    await aiService.exportSuggestionsForReview(aiResults.suggestions);

    // Step 5: Cost breakdown by batch
    console.log('💰 COST BREAKDOWN BY BATCH');
    console.log('=' .repeat(70));
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    
    aiResults.batchResults.forEach((batch, index) => {
      console.log(`Batch ${index + 1}: ${batch.processedCount} entries, $${batch.cost.totalCost.toFixed(4)} (${batch.processingTime}ms)`);
      totalInputTokens += batch.cost.inputTokens;
      totalOutputTokens += batch.cost.outputTokens;
    });
    
    console.log(`\nTotal tokens: ${totalInputTokens.toLocaleString()} input + ${totalOutputTokens.toLocaleString()} output`);
    console.log(`Final cost: $${aiResults.totalCost.toFixed(4)}`);
    console.log('');

    // Step 6: Next steps
    console.log('🎯 NEXT STEPS');
    console.log('=' .repeat(70));
    console.log('1. Review ai-suggestions-for-review.json');
    console.log('2. Approve/modify suggestions through human review interface');
    console.log('3. Apply approved changes to centralized_vocabulary');
    console.log('4. Run validation tests');
    console.log('5. Deploy normalized vocabulary data');
    console.log('');

    // Export complete results
    const completeResults = {
      auditResults,
      aiResults,
      processedAt: new Date().toISOString(),
      summary: {
        totalEntries: auditResults.totalEntries,
        categoryACount: auditResults.categoryA.length,
        categoryBCount: auditResults.categoryB.length,
        aiProcessedCount: aiResults.totalProcessed,
        totalCost: aiResults.totalCost,
        highConfidenceCount: highConfidenceSuggestions.length
      }
    };

    await fs.writeFile('complete-curation-results.json', JSON.stringify(completeResults, null, 2));
    console.log('📄 Complete results saved to complete-curation-results.json');

    return completeResults;

  } catch (error) {
    console.error('❌ AI curation failed:', error);
    throw error;
  }
}

async function testSingleBatch() {
  console.log('🧪 Testing single batch with GPT-5-Nano...\n');

  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY not found in .env.local');
  }

  const aiService = new AIVocabularyCurationService(supabase, openaiApiKey);

  // Create test entries
  const testEntries = [
    {
      id: 'test-1',
      word: 'prefiero',
      translation: 'I prefer',
      language: 'es',
      is_mwe: false,
      should_track_for_fsrs: true
    },
    {
      id: 'test-2', 
      word: "l'hôtel",
      translation: 'hotel',
      language: 'fr',
      is_mwe: false,
      should_track_for_fsrs: true
    },
    {
      id: 'test-3',
      word: 'casas',
      translation: 'houses',
      language: 'es', 
      is_mwe: false,
      should_track_for_fsrs: true
    }
  ];

  try {
    const result = await aiService.processBatch(testEntries);
    
    console.log('✅ Test batch completed!');
    console.log(`Cost: $${result.cost.totalCost.toFixed(4)}`);
    console.log(`Processing time: ${result.processingTime}ms`);
    console.log(`Suggestions count: ${result.suggestions.length}`);
    console.log(`Errors: ${result.errors.length}`);

    if (result.errors.length > 0) {
      console.log('\nErrors:');
      result.errors.forEach(error => console.log(`  - ${error}`));
    }

    console.log('\nSuggestions:');

    result.suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. "${suggestion.originalWord}" → "${suggestion.lemma}"`);
      console.log(`   MWE: ${suggestion.isMWE}, Confidence: ${suggestion.confidence}`);
      console.log(`   Reasoning: ${suggestion.reasoning}`);
      console.log('');
    });

    return result;

  } catch (error) {
    console.error('❌ Test batch failed:', error);
    throw error;
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--test')) {
    await testSingleBatch();
  } else {
    await runAICuration();
  }
}

// Run if this script is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { runAICuration, testSingleBatch };
