/**
 * Comprehensive Database Audit
 * 
 * 1. Verify all JSON suggestions were applied to database
 * 2. Random sample 1000+ rows to check data quality
 * 3. Identify remaining formatting issues
 * 4. Check language distribution and processing coverage
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DatabaseAuditResults {
  totalEntries: number;
  languageDistribution: Record<string, number>;
  jsonApplicationStatus: {
    totalSuggestions: number;
    appliedCount: number;
    notAppliedCount: number;
    examples: any[];
  };
  remainingIssues: {
    complexFormatting: any[];
    missingBaseWords: any[];
    incorrectMWE: any[];
    total: number;
  };
  randomSample: {
    sampleSize: number;
    qualityScore: number;
    examples: any[];
  };
}

async function checkJSONApplicationStatus(): Promise<{
  totalSuggestions: number;
  appliedCount: number;
  notAppliedCount: number;
  examples: any[];
}> {
  console.log('🔍 Checking JSON Application Status...\n');

  try {
    // Load AI suggestions
    const aiData = await fs.readFile('ai-suggestions-for-review.json', 'utf-8');
    const aiResults = JSON.parse(aiData);
    
    console.log(`📊 Total AI suggestions: ${aiResults.suggestions.length}`);

    let appliedCount = 0;
    let notAppliedCount = 0;
    const notAppliedExamples = [];

    // Check each suggestion against current database
    for (const suggestion of aiResults.suggestions.slice(0, 50)) { // Sample first 50
      try {
        const { data: currentEntry, error } = await supabase
          .from('centralized_vocabulary')
          .select('word, base_word, is_mwe, mwe_type')
          .eq('id', suggestion.id)
          .single();

        if (!error && currentEntry) {
          // Check if suggestion was applied
          const wasApplied = 
            currentEntry.word === suggestion.lemma ||
            currentEntry.word === suggestion.canonicalForm ||
            currentEntry.base_word === suggestion.lemma;

          if (wasApplied) {
            appliedCount++;
          } else {
            notAppliedCount++;
            notAppliedExamples.push({
              id: suggestion.id,
              original: suggestion.originalWord,
              suggested: suggestion.lemma,
              current: currentEntry.word,
              confidence: suggestion.confidence
            });
          }
        }
      } catch (error) {
        // Skip problematic entries
      }
    }

    console.log(`✅ Applied: ${appliedCount}`);
    console.log(`❌ Not applied: ${notAppliedCount}`);
    console.log(`📝 Sample not applied:`, notAppliedExamples.slice(0, 5));

    return {
      totalSuggestions: aiResults.suggestions.length,
      appliedCount,
      notAppliedCount,
      examples: notAppliedExamples
    };

  } catch (error) {
    console.error('❌ Failed to check JSON application status:', error);
    return { totalSuggestions: 0, appliedCount: 0, notAppliedCount: 0, examples: [] };
  }
}

async function getLanguageDistribution(): Promise<Record<string, number>> {
  console.log('🌍 Analyzing Language Distribution...\n');

  try {
    const { data: entries, error } = await supabase
      .from('centralized_vocabulary')
      .select('language')
      .eq('should_track_for_fsrs', true);

    if (error || !entries) {
      return {};
    }

    const distribution = entries.reduce((acc, entry) => {
      acc[entry.language] = (acc[entry.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('📊 Language Distribution:');
    Object.entries(distribution).forEach(([lang, count]) => {
      const percentage = ((count / entries.length) * 100).toFixed(1);
      console.log(`   ${lang}: ${count} entries (${percentage}%)`);
    });

    return distribution;

  } catch (error) {
    console.error('❌ Failed to get language distribution:', error);
    return {};
  }
}

async function findRemainingIssues(): Promise<{
  complexFormatting: any[];
  missingBaseWords: any[];
  incorrectMWE: any[];
  total: number;
}> {
  console.log('🔍 Finding Remaining Issues...\n');

  try {
    const { data: entries, error } = await supabase
      .from('centralized_vocabulary')
      .select('id, word, base_word, is_mwe, mwe_type, language, translation')
      .eq('should_track_for_fsrs', true)
      .limit(1000); // Sample 1000 entries

    if (error || !entries) {
      return { complexFormatting: [], missingBaseWords: [], incorrectMWE: [], total: 0 };
    }

    const issues = {
      complexFormatting: [] as any[],
      missingBaseWords: [] as any[],
      incorrectMWE: [] as any[],
      total: 0
    };

    for (const entry of entries) {
      // Check for complex formatting that we missed
      const hasComplexFormatting = 
        entry.word.includes('(') ||
        entry.word.includes(';') ||
        entry.word.includes(',') ||
        entry.word.includes('?') ||
        entry.word.includes('…') ||
        /\([^)]*\)/.test(entry.word);

      if (hasComplexFormatting) {
        issues.complexFormatting.push({
          id: entry.id,
          word: entry.word,
          language: entry.language,
          translation: entry.translation
        });
      }

      // Check for missing base_word
      if (!entry.base_word) {
        issues.missingBaseWords.push({
          id: entry.id,
          word: entry.word,
          language: entry.language
        });
      }

      // Check for incorrect MWE classification
      const shouldBeMWE = entry.word.includes(' ') || entry.word.includes("'");
      if (shouldBeMWE && !entry.is_mwe) {
        issues.incorrectMWE.push({
          id: entry.id,
          word: entry.word,
          language: entry.language,
          is_mwe: entry.is_mwe
        });
      }
    }

    issues.total = issues.complexFormatting.length + issues.missingBaseWords.length + issues.incorrectMWE.length;

    console.log('📊 Remaining Issues Found:');
    console.log(`   Complex formatting: ${issues.complexFormatting.length}`);
    console.log(`   Missing base_word: ${issues.missingBaseWords.length}`);
    console.log(`   Incorrect MWE: ${issues.incorrectMWE.length}`);
    console.log(`   Total issues: ${issues.total}`);

    // Show examples
    if (issues.complexFormatting.length > 0) {
      console.log('\n🔍 Complex Formatting Examples:');
      issues.complexFormatting.slice(0, 10).forEach((issue, index) => {
        console.log(`   ${index + 1}. "${issue.word}" (${issue.language})`);
      });
    }

    return issues;

  } catch (error) {
    console.error('❌ Failed to find remaining issues:', error);
    return { complexFormatting: [], missingBaseWords: [], incorrectMWE: [], total: 0 };
  }
}

async function randomSampleAudit(sampleSize: number = 200): Promise<{
  sampleSize: number;
  qualityScore: number;
  examples: any[];
}> {
  console.log(`\n🎲 Random Sample Audit (${sampleSize} entries)...\n`);

  try {
    // Get random sample
    const { data: entries, error } = await supabase
      .from('centralized_vocabulary')
      .select('*')
      .eq('should_track_for_fsrs', true)
      .limit(sampleSize);

    if (error || !entries) {
      return { sampleSize: 0, qualityScore: 0, examples: [] };
    }

    // Shuffle to get random sample
    const shuffled = entries.sort(() => 0.5 - Math.random());
    const sample = shuffled.slice(0, Math.min(sampleSize, entries.length));

    let qualityPoints = 0;
    const maxPoints = sample.length * 4; // 4 points per entry
    const examples = [];

    for (const entry of sample) {
      let entryScore = 0;
      const issues = [];

      // 1. Has base_word (1 point)
      if (entry.base_word) {
        entryScore += 1;
      } else {
        issues.push('missing base_word');
      }

      // 2. Clean formatting (1 point)
      const hasCleanFormatting = !entry.word.includes('(') && 
                                !entry.word.includes(';') && 
                                !entry.word.includes(',') &&
                                !entry.word.includes('?');
      if (hasCleanFormatting) {
        entryScore += 1;
      } else {
        issues.push('complex formatting');
      }

      // 3. Correct MWE classification (1 point)
      const shouldBeMWE = entry.word.includes(' ') || entry.word.includes("'");
      if ((shouldBeMWE && entry.is_mwe) || (!shouldBeMWE && !entry.is_mwe)) {
        entryScore += 1;
      } else {
        issues.push('incorrect MWE classification');
      }

      // 4. Has translation (1 point)
      if (entry.translation && entry.translation.trim().length > 0) {
        entryScore += 1;
      } else {
        issues.push('missing translation');
      }

      qualityPoints += entryScore;

      // Add to examples if has issues or is perfect
      if (issues.length > 0 || entryScore === 4) {
        examples.push({
          word: entry.word,
          language: entry.language,
          translation: entry.translation,
          base_word: entry.base_word,
          is_mwe: entry.is_mwe,
          score: entryScore,
          issues: issues
        });
      }
    }

    const qualityScore = Math.round((qualityPoints / maxPoints) * 100);

    console.log(`📊 Random Sample Results:`);
    console.log(`   Sample size: ${sample.length}`);
    console.log(`   Quality score: ${qualityScore}%`);
    console.log(`   Quality points: ${qualityPoints}/${maxPoints}`);

    // Show examples by language
    const byLanguage = examples.reduce((acc, ex) => {
      if (!acc[ex.language]) acc[ex.language] = [];
      acc[ex.language].push(ex);
      return acc;
    }, {} as Record<string, any[]>);

    Object.entries(byLanguage).forEach(([lang, langExamples]) => {
      console.log(`\n   ${lang.toUpperCase()} Examples (${langExamples.length}):`);
      langExamples.slice(0, 5).forEach((ex, index) => {
        console.log(`      ${index + 1}. "${ex.word}" (score: ${ex.score}/4)`);
        if (ex.issues.length > 0) {
          console.log(`         Issues: ${ex.issues.join(', ')}`);
        }
      });
    });

    return {
      sampleSize: sample.length,
      qualityScore,
      examples: examples.slice(0, 50) // Limit examples
    };

  } catch (error) {
    console.error('❌ Random sample audit failed:', error);
    return { sampleSize: 0, qualityScore: 0, examples: [] };
  }
}

async function runComprehensiveDatabaseAudit(): Promise<DatabaseAuditResults> {
  console.log('🔍 COMPREHENSIVE DATABASE AUDIT\n');
  console.log('=' .repeat(70) + '\n');

  const results: DatabaseAuditResults = {
    totalEntries: 0,
    languageDistribution: {},
    jsonApplicationStatus: { totalSuggestions: 0, appliedCount: 0, notAppliedCount: 0, examples: [] },
    remainingIssues: { complexFormatting: [], missingBaseWords: [], incorrectMWE: [], total: 0 },
    randomSample: { sampleSize: 0, qualityScore: 0, examples: [] }
  };

  try {
    // Get total entries
    const { count } = await supabase
      .from('centralized_vocabulary')
      .select('*', { count: 'exact', head: true })
      .eq('should_track_for_fsrs', true);
    
    results.totalEntries = count || 0;
    console.log(`📊 Total vocabulary entries: ${results.totalEntries}\n`);

    // 1. Check JSON application status
    results.jsonApplicationStatus = await checkJSONApplicationStatus();

    // 2. Get language distribution
    results.languageDistribution = await getLanguageDistribution();

    // 3. Find remaining issues
    results.remainingIssues = await findRemainingIssues();

    // 4. Random sample audit
    results.randomSample = await randomSampleAudit(300);

    // Summary
    console.log('\n🎯 COMPREHENSIVE AUDIT SUMMARY');
    console.log('=' .repeat(70));
    console.log(`📊 Total entries: ${results.totalEntries}`);
    console.log(`🤖 AI suggestions applied: ${results.jsonApplicationStatus.appliedCount}/${results.jsonApplicationStatus.totalSuggestions}`);
    console.log(`⚠️  Remaining issues: ${results.remainingIssues.total}`);
    console.log(`🎲 Random sample quality: ${results.randomSample.qualityScore}%`);
    console.log(`🌍 Languages: ${Object.keys(results.languageDistribution).join(', ')}`);

    // Export results
    await fs.writeFile('comprehensive-database-audit.json', JSON.stringify(results, null, 2));
    console.log('\n📄 Full audit results exported to comprehensive-database-audit.json');

    return results;

  } catch (error) {
    console.error('❌ Comprehensive audit failed:', error);
    throw error;
  }
}

// Run if this script is executed directly
if (require.main === module) {
  runComprehensiveDatabaseAudit().catch(console.error);
}

export { runComprehensiveDatabaseAudit };
