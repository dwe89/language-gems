/**
 * True Remaining Issues Diagnostic
 * 
 * Find ALL remaining complex formatting issues that previous scripts missed
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

async function findAllRemainingIssues(): Promise<void> {
  console.log('🔍 TRUE REMAINING ISSUES DIAGNOSTIC\n');
  console.log('Finding ALL complex formatting that previous scripts missed\n');
  console.log('=' .repeat(70) + '\n');

  try {
    // Get ALL entries to check for complex formatting
    const { data: entries, error } = await supabase
      .from('centralized_vocabulary')
      .select('id, word, language, translation')
      .eq('should_track_for_fsrs', true);

    if (error || !entries) {
      console.log('❌ Failed to fetch entries');
      return;
    }

    console.log(`📊 Checking ${entries.length} total entries for complex formatting...\n`);

    // Find entries with ANY complex patterns
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
        word.includes('[') ||
        word.includes(']') ||
        word.includes('{') ||
        word.includes('}') ||
        word.includes('!') ||
        word.includes('*') ||
        word.includes('/') ||
        word.includes('\\') ||
        word.includes('=') ||
        word.includes('<') ||
        word.includes('>') ||
        word.includes('^') ||
        word.includes('~') ||
        word.includes('`') ||
        word.includes('@') ||
        word.includes('#') ||
        word.includes('$') ||
        word.includes('%') ||
        word.includes('&') ||
        // Multiple spaces
        word.includes('  ') ||
        // Leading/trailing spaces
        word !== word.trim()
      );
    });

    console.log(`🚨 Found ${complexEntries.length} entries with complex formatting!\n`);

    // Group by pattern type
    const patternGroups: Record<string, { count: number; examples: Array<{ word: string; language: string; translation: string }> }> = {};

    for (const entry of complexEntries) {
      const word = entry.word;
      let patternType = 'unknown';

      if (word.includes(',') && !word.includes('(')) {
        patternType = 'comma_variants';
      } else if (word.includes('(') && word.includes(')')) {
        patternType = 'parentheses_content';
      } else if (word.includes(';')) {
        patternType = 'semicolon_patterns';
      } else if (word.includes('|')) {
        patternType = 'pipe_patterns';
      } else if (word.includes('?')) {
        patternType = 'question_patterns';
      } else if (word.includes('…')) {
        patternType = 'ellipsis_patterns';
      } else if (word.includes('+')) {
        patternType = 'plus_patterns';
      } else if (word.includes('[') || word.includes(']')) {
        patternType = 'bracket_patterns';
      } else if (word !== word.trim()) {
        patternType = 'whitespace_issues';
      } else if (word.includes('  ')) {
        patternType = 'multiple_spaces';
      } else {
        patternType = 'other_special_chars';
      }

      if (!patternGroups[patternType]) {
        patternGroups[patternType] = { count: 0, examples: [] };
      }

      patternGroups[patternType].count++;
      if (patternGroups[patternType].examples.length < 20) {
        patternGroups[patternType].examples.push({
          word: entry.word,
          language: entry.language,
          translation: entry.translation || ''
        });
      }
    }

    // Display results by pattern type
    console.log('📊 COMPLEX FORMATTING BREAKDOWN:');
    console.log('-'.repeat(50));

    Object.entries(patternGroups)
      .sort(([,a], [,b]) => b.count - a.count)
      .forEach(([pattern, data]) => {
        console.log(`\n🔍 ${pattern.toUpperCase()}: ${data.count} entries`);
        console.log('   Examples:');
        data.examples.slice(0, 10).forEach((example, index) => {
          console.log(`   ${index + 1}. "${example.word}" (${example.language}) - ${example.translation}`);
        });
      });

    // Group by language
    const byLanguage = complexEntries.reduce((acc, entry) => {
      if (!acc[entry.language]) acc[entry.language] = 0;
      acc[entry.language]++;
      return acc;
    }, {} as Record<string, number>);

    console.log(`\n📊 COMPLEX ENTRIES BY LANGUAGE:`);
    Object.entries(byLanguage)
      .sort(([,a], [,b]) => b - a)
      .forEach(([lang, count]) => {
        const percentage = ((count / entries.length) * 100).toFixed(1);
        console.log(`   ${lang.toUpperCase()}: ${count} entries (${percentage}% of total)`);
      });

    // Show the worst offenders
    console.log(`\n🚨 WORST OFFENDERS (Most Complex):`);
    const worstOffenders = complexEntries
      .map(entry => ({
        ...entry,
        complexity: (entry.word.match(/[(),;|?…+\[\]{}!*\/\\=<>^~`@#$%&]/g) || []).length
      }))
      .sort((a, b) => b.complexity - a.complexity)
      .slice(0, 20);

    worstOffenders.forEach((entry, index) => {
      console.log(`   ${index + 1}. "${entry.word}" (${entry.language}) - Complexity: ${entry.complexity}`);
      console.log(`      Translation: ${entry.translation || 'N/A'}`);
    });

    // Calculate true percentage
    const trueComplexPercentage = ((complexEntries.length / entries.length) * 100).toFixed(1);
    console.log(`\n📈 TRUE COMPLEX FORMATTING PERCENTAGE: ${trueComplexPercentage}%`);
    console.log(`📊 Total entries needing cleanup: ${complexEntries.length}`);

    if (complexEntries.length > 100) {
      console.log('\n🚨 SIGNIFICANT WORK STILL NEEDED!');
      console.log('Previous cleanup scripts missed many patterns.');
      console.log('Need comprehensive cleanup rules for all pattern types.');
    } else if (complexEntries.length > 50) {
      console.log('\n⚠️  MODERATE WORK STILL NEEDED');
      console.log('Some complex patterns remain to be cleaned.');
    } else {
      console.log('\n✅ MINIMAL WORK NEEDED');
      console.log('Most complex formatting has been cleaned.');
    }

  } catch (error) {
    console.error('❌ Diagnostic failed:', error);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  findAllRemainingIssues().catch(console.error);
}

export { findAllRemainingIssues };
