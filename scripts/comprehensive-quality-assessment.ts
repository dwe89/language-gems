/**
 * Comprehensive Quality Assessment - Centralized Vocabulary Database
 * 
 * Systematic analysis to validate vocabulary normalization efforts:
 * 1. Random sampling across all languages
 * 2. Word column quality assessment
 * 3. Pattern-specific searches
 * 4. Cross-language validation
 * 5. Quantitative metrics calculation
 * 6. Examples documentation
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

interface QualityAssessmentResults {
  randomSample: {
    totalSampled: number;
    languageDistribution: Record<string, number>;
    qualityScores: {
      overall: number;
      byLanguage: Record<string, number>;
    };
    cleanEntries: number;
    problematicEntries: Array<{
      word: string;
      language: string;
      issues: string[];
      category: string;
    }>;
  };
  patternAnalysis: {
    remainingPatterns: Record<string, { count: number; examples: string[] }>;
    totalProblematic: number;
    complexFormattingPercentage: number;
  };
  crossLanguageValidation: {
    spanish: { total: number; clean: number; percentage: number };
    french: { total: number; clean: number; percentage: number };
    german: { total: number; clean: number; percentage: number };
  };
  quantitativeMetrics: {
    totalEntries: number;
    overallQualityPercentage: number;
    complexFormattingPercentage: number;
    targetsMet: {
      complexFormatting: boolean; // <5%
      overallQuality: boolean; // >95%
    };
  };
  recommendations: {
    nextSteps: string[];
    priorityIssues: string[];
    productionReadiness: 'READY' | 'NEEDS_WORK' | 'CRITICAL_ISSUES';
  };
}

async function getRandomSample(sampleSize: number = 1000): Promise<{
  sample: any[];
  languageDistribution: Record<string, number>;
}> {
  console.log(`📊 Extracting random sample of ${sampleSize} entries...\n`);

  try {
    // Get total count by language for stratified sampling
    const { data: languageCounts, error: countError } = await supabase
      .from('centralized_vocabulary')
      .select('language')
      .eq('should_track_for_fsrs', true);

    if (countError || !languageCounts) {
      throw new Error('Failed to get language counts');
    }

    const langDistribution = languageCounts.reduce((acc, entry) => {
      acc[entry.language] = (acc[entry.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('📈 Database language distribution:');
    Object.entries(langDistribution).forEach(([lang, count]) => {
      const percentage = ((count / languageCounts.length) * 100).toFixed(1);
      console.log(`   ${lang.toUpperCase()}: ${count} entries (${percentage}%)`);
    });

    // Get stratified random sample
    const samplePerLanguage = Math.ceil(sampleSize / Object.keys(langDistribution).length);
    const allSamples = [];

    for (const language of Object.keys(langDistribution)) {
      const { data: langSample, error: sampleError } = await supabase
        .from('centralized_vocabulary')
        .select('*')
        .eq('should_track_for_fsrs', true)
        .eq('language', language)
        .limit(samplePerLanguage);

      if (!sampleError && langSample) {
        // Shuffle and take random subset
        const shuffled = langSample.sort(() => 0.5 - Math.random());
        allSamples.push(...shuffled.slice(0, samplePerLanguage));
      }
    }

    // Final shuffle and limit to exact sample size
    const finalSample = allSamples.sort(() => 0.5 - Math.random()).slice(0, sampleSize);

    const sampleLangDistribution = finalSample.reduce((acc, entry) => {
      acc[entry.language] = (acc[entry.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log(`\n✅ Random sample extracted: ${finalSample.length} entries`);
    console.log('📊 Sample language distribution:');
    Object.entries(sampleLangDistribution).forEach(([lang, count]) => {
      const percentage = ((count / finalSample.length) * 100).toFixed(1);
      console.log(`   ${lang.toUpperCase()}: ${count} entries (${percentage}%)`);
    });

    return {
      sample: finalSample,
      languageDistribution: sampleLangDistribution
    };

  } catch (error) {
    console.error('❌ Random sampling failed:', error);
    return { sample: [], languageDistribution: {} };
  }
}

function assessWordQuality(word: string): {
  score: number;
  issues: string[];
  isClean: boolean;
} {
  const issues: string[] = [];
  let score = 100; // Start with perfect score

  // Check for complex formatting patterns
  if (word.includes('(')) {
    issues.push('contains_parentheses');
    score -= 20;
  }
  if (word.includes(';')) {
    issues.push('contains_semicolon');
    score -= 20;
  }
  if (word.includes(',')) {
    issues.push('contains_comma');
    score -= 15;
  }
  if (word.includes('|')) {
    issues.push('contains_pipe');
    score -= 20;
  }
  if (word.includes('?')) {
    issues.push('contains_question_mark');
    score -= 15;
  }
  if (word.includes('…')) {
    issues.push('contains_ellipsis');
    score -= 15;
  }
  if (word.includes('+')) {
    issues.push('contains_plus');
    score -= 15;
  }
  if (word.includes('/')) {
    issues.push('contains_slash');
    score -= 15;
  }

  // Check for whitespace issues
  if (word !== word.trim()) {
    issues.push('leading_trailing_spaces');
    score -= 10;
  }
  if (word.includes('  ')) {
    issues.push('multiple_spaces');
    score -= 10;
  }

  // Check for length issues
  if (word.length === 0) {
    issues.push('empty_word');
    score = 0;
  } else if (word.length > 100) {
    issues.push('too_long');
    score -= 10;
  }

  // Check for unusual characters
  if (/[<>{}[\]@#$%^&*=~`]/.test(word)) {
    issues.push('unusual_characters');
    score -= 15;
  }

  const isClean = issues.length === 0;
  return { score: Math.max(0, score), issues, isClean };
}

async function analyzeRandomSample(sample: any[]): Promise<QualityAssessmentResults['randomSample']> {
  console.log('\n🔍 Analyzing Random Sample Quality...\n');

  const languageDistribution = sample.reduce((acc, entry) => {
    acc[entry.language] = (acc[entry.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let totalScore = 0;
  let cleanEntries = 0;
  const problematicEntries = [];
  const languageScores: Record<string, { total: number; count: number }> = {};

  for (const entry of sample) {
    const quality = assessWordQuality(entry.word);
    totalScore += quality.score;

    if (quality.isClean) {
      cleanEntries++;
    } else {
      problematicEntries.push({
        word: entry.word,
        language: entry.language,
        issues: quality.issues,
        category: entry.category || 'unknown'
      });
    }

    // Track by language
    if (!languageScores[entry.language]) {
      languageScores[entry.language] = { total: 0, count: 0 };
    }
    languageScores[entry.language].total += quality.score;
    languageScores[entry.language].count++;
  }

  const overallScore = Math.round(totalScore / sample.length);
  const byLanguageScores = Object.fromEntries(
    Object.entries(languageScores).map(([lang, data]) => [
      lang,
      Math.round(data.total / data.count)
    ])
  );

  console.log('📊 Sample Quality Analysis:');
  console.log(`   Overall quality score: ${overallScore}%`);
  console.log(`   Clean entries: ${cleanEntries}/${sample.length} (${Math.round((cleanEntries/sample.length)*100)}%)`);
  console.log(`   Problematic entries: ${problematicEntries.length}`);
  
  console.log('\n📈 Quality by language:');
  Object.entries(byLanguageScores).forEach(([lang, score]) => {
    console.log(`   ${lang.toUpperCase()}: ${score}%`);
  });

  if (problematicEntries.length > 0) {
    console.log('\n🚨 Sample problematic entries:');
    problematicEntries.slice(0, 10).forEach((entry, index) => {
      console.log(`   ${index + 1}. "${entry.word}" (${entry.language}) - Issues: ${entry.issues.join(', ')}`);
    });
  }

  return {
    totalSampled: sample.length,
    languageDistribution,
    qualityScores: {
      overall: overallScore,
      byLanguage: byLanguageScores
    },
    cleanEntries,
    problematicEntries: problematicEntries.slice(0, 50) // Limit for export
  };
}

async function executePatternSpecificSearches(): Promise<QualityAssessmentResults['patternAnalysis']> {
  console.log('\n🔍 Executing Pattern-Specific Searches...\n');

  const patterns = [
    { name: 'gender_markers', query: "word ~ '\\([mfnt]+l?\\)'" },
    { name: 'variant_forms', query: "word ~ '^[^,]+,\\s*[^,]+'" },
    { name: 'reflexive_patterns', query: "word ~ ';\\s*se\\s+'" },
    { name: 'preposition_markers', query: "word ~ '\\([àdeensuravecpour]'" },
    { name: 'pipe_patterns', query: "word LIKE '%|%'" },
    { name: 'question_patterns', query: "word LIKE '%(?%'" },
    { name: 'semicolon_patterns', query: "word LIKE '%;%'" },
    { name: 'comma_patterns', query: "word LIKE '%,%'" },
    { name: 'parentheses_patterns', query: "word LIKE '%(%'" },
    { name: 'slash_patterns', query: "word LIKE '%/%'" },
    { name: 'ellipsis_patterns', query: "word LIKE '%…%'" }
  ];

  const remainingPatterns: Record<string, { count: number; examples: string[] }> = {};
  let totalProblematic = 0;

  for (const pattern of patterns) {
    try {
      const { data: matches, error } = await supabase
        .from('centralized_vocabulary')
        .select('word, language')
        .eq('should_track_for_fsrs', true)
        .or(pattern.query)
        .limit(20);

      if (!error && matches) {
        remainingPatterns[pattern.name] = {
          count: matches.length,
          examples: matches.slice(0, 10).map(m => `"${m.word}" (${m.language})`)
        };
        totalProblematic += matches.length;

        if (matches.length > 0) {
          console.log(`   ${pattern.name}: ${matches.length} entries`);
          console.log(`      Examples: ${matches.slice(0, 3).map(m => `"${m.word}"`).join(', ')}`);
        }
      }
    } catch (error) {
      console.log(`   ❌ Failed to check ${pattern.name}: ${error}`);
    }
  }

  // Get total count for percentage calculation
  const { count: totalEntries } = await supabase
    .from('centralized_vocabulary')
    .select('*', { count: 'exact', head: true })
    .eq('should_track_for_fsrs', true);

  const complexFormattingPercentage = totalEntries ? 
    Math.round((totalProblematic / totalEntries) * 100 * 10) / 10 : 0;

  console.log(`\n📊 Pattern Analysis Summary:`);
  console.log(`   Total problematic entries: ${totalProblematic}`);
  console.log(`   Complex formatting percentage: ${complexFormattingPercentage}%`);

  return {
    remainingPatterns,
    totalProblematic,
    complexFormattingPercentage
  };
}

async function performCrossLanguageValidation(): Promise<QualityAssessmentResults['crossLanguageValidation']> {
  console.log('\n🌍 Performing Cross-Language Validation...\n');

  const languages = ['es', 'fr', 'de'];
  const results: Record<string, { total: number; clean: number; percentage: number }> = {};

  for (const lang of languages) {
    try {
      // Get total count for language
      const { count: total } = await supabase
        .from('centralized_vocabulary')
        .select('*', { count: 'exact', head: true })
        .eq('should_track_for_fsrs', true)
        .eq('language', lang);

      // Get clean count (no complex formatting)
      const { data: allEntries, error } = await supabase
        .from('centralized_vocabulary')
        .select('word')
        .eq('should_track_for_fsrs', true)
        .eq('language', lang);

      let clean = 0;
      if (!error && allEntries) {
        clean = allEntries.filter(entry => {
          const quality = assessWordQuality(entry.word);
          return quality.isClean;
        }).length;
      }

      const percentage = total ? Math.round((clean / total) * 100) : 0;
      
      results[lang === 'es' ? 'spanish' : lang === 'fr' ? 'french' : 'german'] = {
        total: total || 0,
        clean,
        percentage
      };

      console.log(`   ${lang.toUpperCase()}: ${clean}/${total} clean (${percentage}%)`);

    } catch (error) {
      console.log(`   ❌ Failed to validate ${lang}: ${error}`);
      results[lang === 'es' ? 'spanish' : lang === 'fr' ? 'french' : 'german'] = {
        total: 0,
        clean: 0,
        percentage: 0
      };
    }
  }

  return results as QualityAssessmentResults['crossLanguageValidation'];
}

async function calculateQuantitativeMetrics(): Promise<QualityAssessmentResults['quantitativeMetrics']> {
  console.log('\n📊 Calculating Quantitative Metrics...\n');

  try {
    // Get total entries
    const { count: totalEntries } = await supabase
      .from('centralized_vocabulary')
      .select('*', { count: 'exact', head: true })
      .eq('should_track_for_fsrs', true);

    // Get sample for quality assessment
    const { data: qualitySample, error } = await supabase
      .from('centralized_vocabulary')
      .select('word')
      .eq('should_track_for_fsrs', true)
      .limit(500);

    let overallQualityPercentage = 0;
    let complexFormattingCount = 0;

    if (!error && qualitySample) {
      let totalQualityScore = 0;
      
      for (const entry of qualitySample) {
        const quality = assessWordQuality(entry.word);
        totalQualityScore += quality.score;
        
        if (!quality.isClean) {
          complexFormattingCount++;
        }
      }
      
      overallQualityPercentage = Math.round(totalQualityScore / qualitySample.length);
    }

    const complexFormattingPercentage = qualitySample ? 
      Math.round((complexFormattingCount / qualitySample.length) * 100 * 10) / 10 : 0;

    const targetsMet = {
      complexFormatting: complexFormattingPercentage < 5,
      overallQuality: overallQualityPercentage > 95
    };

    console.log(`📈 Quantitative Metrics:`);
    console.log(`   Total entries: ${totalEntries || 0}`);
    console.log(`   Overall quality: ${overallQualityPercentage}%`);
    console.log(`   Complex formatting: ${complexFormattingPercentage}%`);
    console.log(`   Targets met: ${Object.values(targetsMet).filter(Boolean).length}/2`);

    return {
      totalEntries: totalEntries || 0,
      overallQualityPercentage,
      complexFormattingPercentage,
      targetsMet
    };

  } catch (error) {
    console.error('❌ Failed to calculate metrics:', error);
    return {
      totalEntries: 0,
      overallQualityPercentage: 0,
      complexFormattingPercentage: 100,
      targetsMet: { complexFormatting: false, overallQuality: false }
    };
  }
}

async function runComprehensiveQualityAssessment(): Promise<QualityAssessmentResults> {
  console.log('🎯 COMPREHENSIVE QUALITY ASSESSMENT - CENTRALIZED VOCABULARY\n');
  console.log('=' .repeat(70) + '\n');

  const results: QualityAssessmentResults = {
    randomSample: {
      totalSampled: 0,
      languageDistribution: {},
      qualityScores: { overall: 0, byLanguage: {} },
      cleanEntries: 0,
      problematicEntries: []
    },
    patternAnalysis: {
      remainingPatterns: {},
      totalProblematic: 0,
      complexFormattingPercentage: 0
    },
    crossLanguageValidation: {
      spanish: { total: 0, clean: 0, percentage: 0 },
      french: { total: 0, clean: 0, percentage: 0 },
      german: { total: 0, clean: 0, percentage: 0 }
    },
    quantitativeMetrics: {
      totalEntries: 0,
      overallQualityPercentage: 0,
      complexFormattingPercentage: 0,
      targetsMet: { complexFormatting: false, overallQuality: false }
    },
    recommendations: {
      nextSteps: [],
      priorityIssues: [],
      productionReadiness: 'NEEDS_WORK'
    }
  };

  try {
    // Step 1: Random sampling
    const { sample, languageDistribution } = await getRandomSample(1000);
    
    // Step 2: Analyze sample quality
    results.randomSample = await analyzeRandomSample(sample);
    
    // Step 3: Pattern-specific searches
    results.patternAnalysis = await executePatternSpecificSearches();
    
    // Step 4: Cross-language validation
    results.crossLanguageValidation = await performCrossLanguageValidation();
    
    // Step 5: Quantitative metrics
    results.quantitativeMetrics = await calculateQuantitativeMetrics();
    
    // Step 6: Generate recommendations
    results.recommendations = generateRecommendations(results);

    // Export results
    await fs.writeFile('comprehensive-quality-assessment.json', JSON.stringify(results, null, 2));
    
    // Final summary
    console.log('\n🎉 COMPREHENSIVE QUALITY ASSESSMENT COMPLETE');
    console.log('=' .repeat(70));
    console.log(`📊 Overall Quality: ${results.quantitativeMetrics.overallQualityPercentage}%`);
    console.log(`🧹 Complex Formatting: ${results.quantitativeMetrics.complexFormattingPercentage}%`);
    console.log(`🎯 Targets Met: ${Object.values(results.quantitativeMetrics.targetsMet).filter(Boolean).length}/2`);
    console.log(`🚀 Production Readiness: ${results.recommendations.productionReadiness}`);
    
    console.log('\n📄 Full assessment exported to comprehensive-quality-assessment.json');

    return results;

  } catch (error) {
    console.error('❌ Comprehensive quality assessment failed:', error);
    throw error;
  }
}

function generateRecommendations(results: QualityAssessmentResults): QualityAssessmentResults['recommendations'] {
  const nextSteps: string[] = [];
  const priorityIssues: string[] = [];
  let productionReadiness: 'READY' | 'NEEDS_WORK' | 'CRITICAL_ISSUES' = 'READY';

  // Analyze results and generate recommendations
  if (results.quantitativeMetrics.complexFormattingPercentage > 5) {
    priorityIssues.push(`Complex formatting at ${results.quantitativeMetrics.complexFormattingPercentage}% (target: <5%)`);
    nextSteps.push('Execute additional cleanup rules for remaining complex patterns');
    productionReadiness = 'NEEDS_WORK';
  }

  if (results.quantitativeMetrics.overallQualityPercentage < 95) {
    priorityIssues.push(`Overall quality at ${results.quantitativeMetrics.overallQualityPercentage}% (target: >95%)`);
    nextSteps.push('Improve data quality through targeted fixes');
    productionReadiness = 'NEEDS_WORK';
  }

  // Check language-specific issues
  Object.entries(results.crossLanguageValidation).forEach(([lang, data]) => {
    if (data.percentage < 90) {
      priorityIssues.push(`${lang} quality at ${data.percentage}% needs improvement`);
      nextSteps.push(`Focus cleanup efforts on ${lang} vocabulary`);
    }
  });

  // If no major issues, system is ready
  if (priorityIssues.length === 0) {
    nextSteps.push('System is production-ready - proceed with sentence game integration');
    nextSteps.push('Monitor data quality with real usage and improve iteratively');
  }

  return {
    nextSteps,
    priorityIssues,
    productionReadiness
  };
}

// Run if this script is executed directly
if (require.main === module) {
  runComprehensiveQualityAssessment().catch(console.error);
}

export { runComprehensiveQualityAssessment };
