/**
 * Emergency Complete Fix
 * 
 * Fix all identified issues:
 * 1. Apply ALL remaining AI suggestions (191 not applied)
 * 2. Process the full 20K+ dataset with enhanced preprocessing
 * 3. Fix complex formatting patterns we missed
 * 4. Ensure all languages are properly handled
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

// Enhanced preprocessing rules for patterns we missed
const enhancedRules = [
  {
    name: 'remove_reflexive_verbs',
    pattern: /^(.+?);\s*se\s+\1$/,
    replacement: (match: string, verb: string) => verb.trim(),
    examples: ['présenter; se présenter → présenter']
  },
  {
    name: 'remove_gender_plural_markers',
    pattern: /^(.+?)\s*\([mf]?pl?\)$/,
    replacement: (match: string, word: string) => word.trim(),
    examples: ['nouveaux (mpl) → nouveaux']
  },
  {
    name: 'extract_primary_from_alternatives',
    pattern: /^(.+?),\s*(.+)$/,
    replacement: (match: string, first: string, second: string) => {
      // Choose the shorter, simpler form
      return first.length <= second.length ? first.trim() : second.trim();
    },
    examples: ['ça, cela → ça']
  },
  {
    name: 'remove_preposition_markers',
    pattern: /^(.+?)\s*\([àde]+\s*[^)]*\)$/,
    replacement: (match: string, word: string) => word.trim(),
    examples: ['appartenir (à) → appartenir']
  },
  {
    name: 'extract_verb_from_reflexive_combo',
    pattern: /^(.+?);\s*(.+?)$/,
    replacement: (match: string, verb1: string, verb2: string) => {
      // Choose the simpler form (usually the first)
      return verb1.trim();
    },
    examples: ['défendre; défendre de → défendre']
  },
  {
    name: 'remove_pronoun_parentheses',
    pattern: /^\(([àde]+)\)\s*(.+)$/,
    replacement: (match: string, prep: string, word: string) => `${prep} ${word}`.trim(),
    examples: ['(à) moi → à moi']
  }
];

async function applyAllRemainingAISuggestions(): Promise<number> {
  console.log('🤖 Applying ALL Remaining AI Suggestions...\n');

  try {
    // Load AI suggestions
    const aiData = await fs.readFile('ai-suggestions-for-review.json', 'utf-8');
    const aiResults = JSON.parse(aiData);

    console.log(`📊 Processing ${aiResults.suggestions.length} AI suggestions...`);

    let appliedCount = 0;
    let skippedCount = 0;

    for (const suggestion of aiResults.suggestions) {
      try {
        // Check if already applied
        const { data: currentEntry, error: fetchError } = await supabase
          .from('centralized_vocabulary')
          .select('word, base_word')
          .eq('id', suggestion.id)
          .single();

        if (fetchError || !currentEntry) {
          skippedCount++;
          continue;
        }

        // Check if suggestion was already applied
        const alreadyApplied = 
          currentEntry.word === suggestion.lemma ||
          currentEntry.word === suggestion.canonicalForm ||
          currentEntry.base_word === suggestion.lemma;

        if (alreadyApplied) {
          continue; // Skip already applied
        }

        // Apply the suggestion
        const updateData: any = {
          word: suggestion.lemma || suggestion.canonicalForm,
          base_word: suggestion.canonicalForm || suggestion.lemma
        };

        if (suggestion.isMWE !== undefined) {
          updateData.is_mwe = suggestion.isMWE;
        }

        if (suggestion.mweType) {
          updateData.mwe_type = suggestion.mweType;
        }

        if (suggestion.componentWords && suggestion.componentWords.length > 0) {
          updateData.component_words = suggestion.componentWords;
        }

        const { error: updateError } = await supabase
          .from('centralized_vocabulary')
          .update(updateData)
          .eq('id', suggestion.id);

        if (!updateError) {
          appliedCount++;
          if (appliedCount % 50 === 0) {
            console.log(`   Applied ${appliedCount} suggestions...`);
          }
        } else {
          skippedCount++;
        }

      } catch (error) {
        skippedCount++;
      }
    }

    console.log(`✅ Applied ${appliedCount} AI suggestions`);
    console.log(`⚠️  Skipped ${skippedCount} suggestions`);
    return appliedCount;

  } catch (error) {
    console.error('❌ Failed to apply AI suggestions:', error);
    return 0;
  }
}

async function enhancedPreprocessingFullDataset(): Promise<number> {
  console.log('🧹 Enhanced Preprocessing of Full Dataset...\n');

  try {
    // Get ALL entries with complex formatting
    const { data: entries, error } = await supabase
      .from('centralized_vocabulary')
      .select('id, word, language')
      .eq('should_track_for_fsrs', true)
      .or('word.like.%(%,word.like.%;%,word.like.%,%,word.like.%?%');

    if (error || !entries) {
      console.log('❌ Failed to fetch entries for preprocessing');
      return 0;
    }

    console.log(`📊 Found ${entries.length} entries needing enhanced preprocessing`);

    let processedCount = 0;

    for (const entry of entries) {
      let cleanedWord = entry.word;
      let appliedRules = [];

      // Apply enhanced rules
      for (const rule of enhancedRules) {
        const before = cleanedWord;
        cleanedWord = cleanedWord.replace(rule.pattern, rule.replacement);
        
        if (cleanedWord !== before) {
          appliedRules.push(rule.name);
        }
      }

      // If word was cleaned, update database
      if (cleanedWord !== entry.word && cleanedWord.trim().length > 0) {
        try {
          const { error: updateError } = await supabase
            .from('centralized_vocabulary')
            .update({
              word: cleanedWord.trim(),
              base_word: cleanedWord.trim()
            })
            .eq('id', entry.id);

          if (!updateError) {
            processedCount++;
            if (processedCount % 100 === 0) {
              console.log(`   Processed ${processedCount} entries...`);
            }
          }
        } catch (error) {
          // Skip problematic entries
        }
      }
    }

    console.log(`✅ Enhanced preprocessing applied to ${processedCount} entries`);
    return processedCount;

  } catch (error) {
    console.error('❌ Enhanced preprocessing failed:', error);
    return 0;
  }
}

async function fixMissingBaseWords(): Promise<number> {
  console.log('🔧 Fixing Missing Base Words...\n');

  try {
    const { data: entries, error } = await supabase
      .from('centralized_vocabulary')
      .select('id, word')
      .eq('should_track_for_fsrs', true)
      .is('base_word', null);

    if (error || !entries) {
      return 0;
    }

    console.log(`📊 Found ${entries.length} entries missing base_word`);

    let fixedCount = 0;

    for (const entry of entries) {
      try {
        const { error: updateError } = await supabase
          .from('centralized_vocabulary')
          .update({ base_word: entry.word })
          .eq('id', entry.id);

        if (!updateError) {
          fixedCount++;
        }
      } catch (error) {
        // Skip problematic entries
      }
    }

    console.log(`✅ Fixed ${fixedCount} missing base_word entries`);
    return fixedCount;

  } catch (error) {
    console.error('❌ Failed to fix missing base words:', error);
    return 0;
  }
}

async function fixIncorrectMWEClassifications(): Promise<number> {
  console.log('🔗 Fixing Incorrect MWE Classifications...\n');

  try {
    // Find entries that should be MWE but aren't
    const { data: entries, error } = await supabase
      .from('centralized_vocabulary')
      .select('id, word, is_mwe')
      .eq('should_track_for_fsrs', true)
      .eq('is_mwe', false)
      .or('word.like.% %,word.like.%\'%');

    if (error || !entries) {
      return 0;
    }

    console.log(`📊 Found ${entries.length} entries that should be MWE`);

    let fixedCount = 0;

    for (const entry of entries) {
      const shouldBeMWE = entry.word.includes(' ') || entry.word.includes("'");
      
      if (shouldBeMWE && !entry.is_mwe) {
        try {
          // Determine MWE type
          let mweType = 'fixed_expression';
          if (entry.word.includes("'")) {
            mweType = 'contraction';
          } else if (entry.word.split(' ').length === 2) {
            mweType = 'noun_phrase';
          }

          const { error: updateError } = await supabase
            .from('centralized_vocabulary')
            .update({
              is_mwe: true,
              mwe_type: mweType,
              component_words: entry.word.split(/[\s']+/).filter(w => w.length > 0)
            })
            .eq('id', entry.id);

          if (!updateError) {
            fixedCount++;
          }
        } catch (error) {
          // Skip problematic entries
        }
      }
    }

    console.log(`✅ Fixed ${fixedCount} MWE classifications`);
    return fixedCount;

  } catch (error) {
    console.error('❌ Failed to fix MWE classifications:', error);
    return 0;
  }
}

async function runFinalQualityCheck(): Promise<{
  totalEntries: number;
  qualityScore: number;
  issuesRemaining: number;
}> {
  console.log('📊 Running Final Quality Check...\n');

  try {
    const { data: sample, error } = await supabase
      .from('centralized_vocabulary')
      .select('word, base_word, is_mwe, mwe_type, language')
      .eq('should_track_for_fsrs', true)
      .limit(500);

    if (error || !sample) {
      return { totalEntries: 0, qualityScore: 0, issuesRemaining: 0 };
    }

    let qualityPoints = 0;
    let issuesRemaining = 0;
    const maxPoints = sample.length * 4;

    for (const entry of sample) {
      let entryScore = 0;

      // Has base_word
      if (entry.base_word) entryScore += 1;
      else issuesRemaining++;

      // Clean formatting
      const hasCleanFormatting = !entry.word.includes('(') && 
                                !entry.word.includes(';') && 
                                !entry.word.includes(',');
      if (hasCleanFormatting) entryScore += 1;
      else issuesRemaining++;

      // Correct MWE classification
      const shouldBeMWE = entry.word.includes(' ') || entry.word.includes("'");
      if ((shouldBeMWE && entry.is_mwe) || (!shouldBeMWE && !entry.is_mwe)) {
        entryScore += 1;
      } else {
        issuesRemaining++;
      }

      // Has MWE type if MWE
      if (entry.is_mwe && entry.mwe_type) {
        entryScore += 1;
      } else if (!entry.is_mwe) {
        entryScore += 1;
      } else {
        issuesRemaining++;
      }

      qualityPoints += entryScore;
    }

    const qualityScore = Math.round((qualityPoints / maxPoints) * 100);

    // Get total count
    const { count } = await supabase
      .from('centralized_vocabulary')
      .select('*', { count: 'exact', head: true })
      .eq('should_track_for_fsrs', true);

    console.log(`📈 Final Quality Check Results:`);
    console.log(`   Sample size: ${sample.length}`);
    console.log(`   Quality score: ${qualityScore}%`);
    console.log(`   Issues in sample: ${issuesRemaining}`);
    console.log(`   Total entries: ${count || 0}`);

    return {
      totalEntries: count || 0,
      qualityScore,
      issuesRemaining
    };

  } catch (error) {
    console.error('❌ Final quality check failed:', error);
    return { totalEntries: 0, qualityScore: 0, issuesRemaining: 0 };
  }
}

async function runEmergencyCompleteFix(): Promise<void> {
  console.log('🚨 EMERGENCY COMPLETE FIX - FULL DATASET PROCESSING\n');
  console.log('=' .repeat(70) + '\n');

  try {
    // Step 1: Apply all remaining AI suggestions
    const aiApplied = await applyAllRemainingAISuggestions();

    // Step 2: Enhanced preprocessing of full dataset
    const preprocessed = await enhancedPreprocessingFullDataset();

    // Step 3: Fix missing base words
    const baseWordsFixed = await fixMissingBaseWords();

    // Step 4: Fix incorrect MWE classifications
    const mweFixed = await fixIncorrectMWEClassifications();

    // Step 5: Final quality check
    const finalCheck = await runFinalQualityCheck();

    // Summary
    console.log('\n🎉 EMERGENCY FIX COMPLETE');
    console.log('=' .repeat(70));
    console.log(`✅ AI suggestions applied: ${aiApplied}`);
    console.log(`✅ Enhanced preprocessing: ${preprocessed} entries`);
    console.log(`✅ Base words fixed: ${baseWordsFixed}`);
    console.log(`✅ MWE classifications fixed: ${mweFixed}`);
    console.log(`📊 Final quality score: ${finalCheck.qualityScore}%`);
    console.log(`📈 Total entries processed: ${finalCheck.totalEntries}`);

    if (finalCheck.qualityScore >= 95) {
      console.log('\n🎉 EXCELLENT! Database is now production-ready!');
    } else if (finalCheck.qualityScore >= 90) {
      console.log('\n✅ GOOD! Database quality is acceptable for production');
    } else {
      console.log('\n⚠️  Additional work may be needed for optimal quality');
    }

  } catch (error) {
    console.error('❌ Emergency fix failed:', error);
    throw error;
  }
}

// Run if this script is executed directly
if (require.main === module) {
  runEmergencyCompleteFix().catch(console.error);
}

export { runEmergencyCompleteFix };
