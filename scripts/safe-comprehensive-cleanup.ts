/**
 * Safe Comprehensive Cleanup
 * 
 * Clean ALL 1,855 complex formatting entries safely, handling duplicates
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

function cleanWord(word: string): string {
  let cleaned = word;

  // Apply cleanup rules in order of specificity
  
  // Handle gender/number variants like "vuestro, vuestra, vuestros, vuestras"
  if (/^[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+$/.test(cleaned)) {
    cleaned = cleaned.split(',')[0].trim();
  }
  // Handle pipe patterns with parentheses like "vous | (à) vous"
  else if (/^[^|]+\|\s*\([^)]*\)/.test(cleaned)) {
    cleaned = cleaned.split('|')[0].trim();
  }
  // Handle general pipe patterns like "ris | ris !"
  else if (/^[^|]+\|/.test(cleaned)) {
    cleaned = cleaned.split('|')[0].trim();
  }
  // Handle gender markers with semicolon like "la grâce (f); grâce à"
  else if (/^.+\s*\([mfnt]+\)\s*;/.test(cleaned)) {
    cleaned = cleaned.split(';')[0].replace(/\s*\([mfnt]+\)/g, '').trim();
  }
  // Handle simple gender markers like "Video (nt)" or "vieille (f)"
  else if (/^.+\s*\([mfnt]+\)$/.test(cleaned)) {
    cleaned = cleaned.replace(/\s*\([mfnt]+\)$/g, '').trim();
  }
  // Handle reflexive patterns like "entendre; s'entendre"
  else if (/^[^;]+;\s*s'/.test(cleaned)) {
    cleaned = cleaned.split(';')[0].trim();
  }
  // Handle general semicolon patterns
  else if (/^[^;]+;/.test(cleaned)) {
    cleaned = cleaned.split(';')[0].trim();
  }
  // Handle slash variants like "sano/a" or "au/à l'"
  else if (/^[^/]+\//.test(cleaned)) {
    cleaned = cleaned.split('/')[0].trim();
  }
  // Handle parentheses at start like "(à) moi"
  else if (/^\([^)]*\)\s*/.test(cleaned)) {
    cleaned = cleaned.replace(/^\([^)]*\)\s*/, '').trim();
  }
  // Handle incomplete parentheses like "(ne"
  else if (/^\([^)]*$/.test(cleaned)) {
    cleaned = cleaned.replace(/^\(/, '').trim();
  }
  // Handle three-form comma patterns like "ce, cet, cette"
  else if (/^[^,]+,\s*[^,]+,\s*[^,]+$/.test(cleaned)) {
    cleaned = cleaned.split(',')[0].trim();
  }
  // Handle two-form comma patterns like "ce, cet"
  else if (/^[^,]+,\s*[^,]+$/.test(cleaned)) {
    cleaned = cleaned.split(',')[0].trim();
  }

  return cleaned.trim();
}

async function safeComprehensiveCleanup(): Promise<void> {
  console.log('🛡️  SAFE COMPREHENSIVE CLEANUP - ALL 1,855 COMPLEX ENTRIES\n');
  console.log('=' .repeat(70) + '\n');

  try {
    // Get ALL complex entries
    const { data: complexEntries, error } = await supabase
      .from('centralized_vocabulary')
      .select('id, word, language, category, base_word')
      .eq('should_track_for_fsrs', true)
      .or('word.like.%(%,word.like.%;%,word.like.%,%,word.like.%|%,word.like.%?%,word.like.%…%,word.like.%+%,word.like.%/%,word.like.%[%,word.like.%]%');

    if (error || !complexEntries) {
      console.log('❌ Failed to fetch complex entries');
      return;
    }

    console.log(`📊 Found ${complexEntries.length} complex entries to clean`);

    let cleaned = 0;
    let skipped = 0;
    let deleted = 0;
    const examples = [];

    for (const entry of complexEntries) {
      const cleanedWord = cleanWord(entry.word);
      
      if (cleanedWord !== entry.word && cleanedWord.length > 0) {
        try {
          // Check if cleaned word would create a duplicate
          const { data: existing, error: checkError } = await supabase
            .from('centralized_vocabulary')
            .select('id')
            .eq('language', entry.language)
            .eq('word', cleanedWord)
            .eq('category', entry.category)
            .neq('id', entry.id)
            .single();

          if (checkError && checkError.code === 'PGRST116') {
            // No duplicate, safe to update
            const { error: updateError } = await supabase
              .from('centralized_vocabulary')
              .update({
                word: cleanedWord,
                base_word: cleanedWord
              })
              .eq('id', entry.id);

            if (!updateError) {
              cleaned++;
              if (examples.length < 30) {
                examples.push({
                  before: entry.word,
                  after: cleanedWord,
                  language: entry.language
                });
              }
            }
          } else {
            // Duplicate would be created, delete this entry instead
            const { error: deleteError } = await supabase
              .from('centralized_vocabulary')
              .delete()
              .eq('id', entry.id);

            if (!deleteError) {
              deleted++;
            } else {
              skipped++;
            }
          }
        } catch (error) {
          skipped++;
        }
      } else {
        skipped++;
      }

      if ((cleaned + deleted + skipped) % 100 === 0) {
        console.log(`   Processed ${cleaned + deleted + skipped}/${complexEntries.length}...`);
      }
    }

    // Show examples
    if (examples.length > 0) {
      console.log('\n🎯 CLEANUP EXAMPLES:');
      examples.forEach((example, index) => {
        console.log(`   ${index + 1}. "${example.before}" → "${example.after}" (${example.language})`);
      });
    }

    // Final validation
    const { data: remainingComplex, error: validationError } = await supabase
      .from('centralized_vocabulary')
      .select('word')
      .eq('should_track_for_fsrs', true)
      .or('word.like.%(%,word.like.%;%,word.like.%,%,word.like.%|%,word.like.%?%,word.like.%…%,word.like.%+%,word.like.%/%');

    const remainingCount = remainingComplex?.length || 0;

    // Get total count for percentage
    const { count: totalCount } = await supabase
      .from('centralized_vocabulary')
      .select('*', { count: 'exact', head: true })
      .eq('should_track_for_fsrs', true);

    const remainingPercentage = totalCount ? ((remainingCount / totalCount) * 100).toFixed(1) : '0.0';

    console.log('\n🎉 SAFE COMPREHENSIVE CLEANUP COMPLETE');
    console.log('=' .repeat(70));
    console.log(`✅ Entries cleaned: ${cleaned}`);
    console.log(`🗑️  Duplicates deleted: ${deleted}`);
    console.log(`⚠️  Entries skipped: ${skipped}`);
    console.log(`📊 Total processed: ${cleaned + deleted + skipped}/${complexEntries.length}`);
    console.log(`📈 Remaining complex entries: ${remainingCount} (${remainingPercentage}%)`);

    if (remainingCount < 100) {
      console.log('\n🎉 EXCELLENT! Complex formatting nearly eliminated!');
      console.log('✅ Database is now clean and production-ready!');
    } else if (remainingCount < 500) {
      console.log('\n✅ GOOD! Major improvement in data quality');
      console.log('🔧 Minor cleanup may still be needed');
    } else {
      console.log('\n⚠️  Additional cleanup iterations may be needed');
    }

    // Test the specific examples the user mentioned
    console.log('\n🧪 Testing User-Mentioned Examples:');
    const testExamples = [
      'vuestro, vuestra, vuestros, vuestras',
      'vous | (à) vous',
      'Video (nt)',
      'vieille (f)',
      'la grâce (f); grâce à'
    ];

    for (const example of testExamples) {
      const { data: found, error: searchError } = await supabase
        .from('centralized_vocabulary')
        .select('word')
        .eq('word', example)
        .eq('should_track_for_fsrs', true)
        .single();

      if (searchError && searchError.code === 'PGRST116') {
        console.log(`   ✅ "${example}" - CLEANED (no longer exists)`);
      } else {
        console.log(`   ❌ "${example}" - STILL EXISTS`);
      }
    }

  } catch (error) {
    console.error('❌ Safe comprehensive cleanup failed:', error);
    throw error;
  }
}

// Run if this script is executed directly
if (require.main === module) {
  safeComprehensiveCleanup().catch(console.error);
}

export { safeComprehensiveCleanup };
