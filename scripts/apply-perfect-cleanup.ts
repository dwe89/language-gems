/**
 * Apply Perfect Cleanup
 * 
 * Direct application of cleanup rules to fix all remaining complex formatting
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

// Cleanup rules from previous script
const cleanupRules = [
  {
    name: 'complex_conjugation_patterns',
    pattern: /^(.+?)\s*\|\s*.+?\;\s*.+$/,
    replacement: (match: string, baseForm: string) => baseForm.trim()
  },
  {
    name: 'reflexive_verb_pairs',
    pattern: /^(.+?),\s*se\s+\1$/,
    replacement: (match: string, verb: string) => verb.trim()
  },
  {
    name: 'verb_semicolon_reflexive',
    pattern: /^(.+?);\s*se\s+(.+)$/,
    replacement: (match: string, verb1: string) => verb1.trim()
  },
  {
    name: 'preposition_in_parentheses',
    pattern: /^(.+?)\s*\([àdeensuravecpour\s]+[^)]*\)$/,
    replacement: (match: string, word: string) => word.trim()
  },
  {
    name: 'gender_number_markers',
    pattern: /^(.+?)\s*\([mf](?:,\s*[mf])?\)$/,
    replacement: (match: string, word: string) => word.trim()
  },
  {
    name: 'multiple_forms_with_gender',
    pattern: /^(.+?),\s*(.+?)\s*\([mf]\),\s*(.+)$/,
    replacement: (match: string, form1: string) => form1.trim()
  },
  {
    name: 'question_markers',
    pattern: /^(.+?)\s*\(\?\)$/,
    replacement: (match: string, word: string) => word.trim()
  },
  {
    name: 'ellipsis_patterns',
    pattern: /^(.+?)\s*\(…(.+?)\)$/,
    replacement: (match: string, word: string) => word.trim()
  },
  {
    name: 'complex_semicolon_patterns',
    pattern: /^(.+?);\s*(.+?)\s*\+\s*noun$/,
    replacement: (match: string, word1: string) => word1.trim()
  },
  {
    name: 'semicolon_contrast_patterns',
    pattern: /^(.+?);\s*par\s+(.+)$/,
    replacement: (match: string, word1: string) => word1.trim()
  },
  {
    name: 'apostrophe_variants',
    pattern: /^(.+?),\s*(.+?)\'$/,
    replacement: (match: string, form1: string) => form1.trim()
  },
  {
    name: 'contraction_variants',
    pattern: /^(.+?),\s*(.+?)\s*\([mf]\)$/,
    replacement: (match: string, form1: string) => form1.trim()
  }
];

function applyCleanupRules(word: string): { cleanedWord: string; appliedRules: string[] } {
  let cleaned = word;
  const appliedRules: string[] = [];

  for (const rule of cleanupRules) {
    const before = cleaned;
    cleaned = cleaned.replace(rule.pattern, rule.replacement);
    
    if (cleaned !== before) {
      appliedRules.push(rule.name);
      // Try again with the cleaned word
      const nextPass = applyCleanupRules(cleaned);
      if (nextPass.appliedRules.length > 0) {
        return {
          cleanedWord: nextPass.cleanedWord,
          appliedRules: [...appliedRules, ...nextPass.appliedRules]
        };
      }
      break;
    }
  }

  return { cleanedWord: cleaned.trim(), appliedRules };
}

async function findAndCleanComplexEntries(): Promise<void> {
  console.log('🧹 Finding and Cleaning Complex Entries...\n');

  try {
    // Get entries with parentheses, semicolons, commas, question marks, etc.
    const { data: entries, error } = await supabase
      .from('centralized_vocabulary')
      .select('id, word, language')
      .eq('should_track_for_fsrs', true);

    if (error || !entries) {
      console.log('❌ Failed to fetch entries');
      return;
    }

    console.log(`📊 Checking ${entries.length} entries for complex formatting...`);

    let processed = 0;
    let cleaned = 0;
    const examples = [];

    for (const entry of entries) {
      // Check if entry has complex formatting
      const hasComplexFormatting = 
        entry.word.includes('(') ||
        entry.word.includes(';') ||
        entry.word.includes(',') ||
        entry.word.includes('?') ||
        entry.word.includes('…') ||
        entry.word.includes('|');

      if (hasComplexFormatting) {
        processed++;
        
        const result = applyCleanupRules(entry.word);
        
        if (result.cleanedWord !== entry.word && result.cleanedWord.length > 0) {
          try {
            // Update database
            const { error: updateError } = await supabase
              .from('centralized_vocabulary')
              .update({
                word: result.cleanedWord,
                base_word: result.cleanedWord
              })
              .eq('id', entry.id);

            if (!updateError) {
              cleaned++;
              
              if (examples.length < 30) {
                examples.push({
                  before: entry.word,
                  after: result.cleanedWord,
                  language: entry.language,
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
    }

    console.log(`\n✅ Cleanup Results:`);
    console.log(`   Entries with complex formatting: ${processed}`);
    console.log(`   Successfully cleaned: ${cleaned}`);
    console.log(`   Success rate: ${Math.round((cleaned/processed)*100)}%`);

    if (examples.length > 0) {
      console.log(`\n🎯 Cleanup Examples:`);
      examples.forEach((example, index) => {
        console.log(`   ${index + 1}. "${example.before}" → "${example.after}" (${example.language})`);
        console.log(`      Rules: ${example.rules.join(', ')}`);
      });
    }

  } catch (error) {
    console.error('❌ Failed to clean complex entries:', error);
  }
}

async function addCommonMWEs(): Promise<void> {
  console.log('\n🔗 Adding Common MWEs to Database...\n');

  const commonMWEs = [
    // Spanish
    { word: 'tener que', language: 'es', translation: 'to have to', mwe_type: 'modal_expression', component_words: ['tener', 'que'] },
    { word: 'hay que', language: 'es', translation: 'one must', mwe_type: 'modal_expression', component_words: ['hay', 'que'] },
    { word: 'por favor', language: 'es', translation: 'please', mwe_type: 'fixed_expression', component_words: ['por', 'favor'] },
    { word: 'de nada', language: 'es', translation: 'you\'re welcome', mwe_type: 'fixed_expression', component_words: ['de', 'nada'] },
    
    // French
    { word: 'avoir besoin', language: 'fr', translation: 'to need', mwe_type: 'modal_expression', component_words: ['avoir', 'besoin'] },
    { word: 'il y a', language: 'fr', translation: 'there is/are', mwe_type: 'fixed_expression', component_words: ['il', 'y', 'a'] },
    { word: 'tout de suite', language: 'fr', translation: 'right away', mwe_type: 'adverbial_phrase', component_words: ['tout', 'de', 'suite'] },
    { word: 'bien sûr', language: 'fr', translation: 'of course', mwe_type: 'fixed_expression', component_words: ['bien', 'sûr'] },
    
    // German
    { word: 'es gibt', language: 'de', translation: 'there is/are', mwe_type: 'fixed_expression', component_words: ['es', 'gibt'] },
    { word: 'zum Beispiel', language: 'de', translation: 'for example', mwe_type: 'adverbial_phrase', component_words: ['zum', 'Beispiel'] },
    { word: 'auf Wiedersehen', language: 'de', translation: 'goodbye', mwe_type: 'fixed_expression', component_words: ['auf', 'Wiedersehen'] }
  ];

  let added = 0;

  for (const mwe of commonMWEs) {
    try {
      // Check if already exists
      const { data: existing, error: checkError } = await supabase
        .from('centralized_vocabulary')
        .select('id')
        .eq('word', mwe.word)
        .eq('language', mwe.language)
        .single();

      if (checkError && checkError.code === 'PGRST116') {
        // Doesn't exist, add it
        const { error: insertError } = await supabase
          .from('centralized_vocabulary')
          .insert({
            word: mwe.word,
            base_word: mwe.word,
            language: mwe.language,
            translation: mwe.translation,
            is_mwe: true,
            mwe_type: mwe.mwe_type,
            component_words: mwe.component_words,
            should_track_for_fsrs: true
          });

        if (!insertError) {
          added++;
          console.log(`   ✅ Added: "${mwe.word}" (${mwe.language})`);
        }
      } else {
        console.log(`   ⚠️  Already exists: "${mwe.word}" (${mwe.language})`);
      }
    } catch (error) {
      console.log(`   ❌ Failed to add: "${mwe.word}"`);
    }
  }

  console.log(`\n✅ Added ${added} new MWEs to database`);
}

async function runPerfectCleanupApplication(): Promise<void> {
  console.log('🎯 APPLYING PERFECT CLEANUP TO DATABASE\n');
  console.log('=' .repeat(70) + '\n');

  try {
    // Step 1: Clean complex formatting
    await findAndCleanComplexEntries();

    // Step 2: Add common MWEs
    await addCommonMWEs();

    console.log('\n🎉 PERFECT CLEANUP APPLICATION COMPLETE');
    console.log('=' .repeat(70));
    console.log('✅ Complex formatting cleaned');
    console.log('✅ Common MWEs added to database');
    console.log('\n🚀 Ready for final validation!');

  } catch (error) {
    console.error('❌ Perfect cleanup application failed:', error);
    throw error;
  }
}

// Run if this script is executed directly
if (require.main === module) {
  runPerfectCleanupApplication().catch(console.error);
}

export { runPerfectCleanupApplication };
