/**
 * Test MWE Vocabulary Tracking Service to verify 406 errors are fixed
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Simple test of the vocabulary lookup method
async function testVocabularyLookup() {
  console.log('Testing vocabulary lookup that was causing 406 errors...');
  
  const testWords = ['color', 'mi', 'favorito', 'azul'];
  
  for (const word of testWords) {
    try {
      console.log(`\nTesting word: "${word}"`);
      
      // This mimics the exact query from MWEVocabularyTrackingService
      const sanitizedLemma = word.trim().toLowerCase();
      
      const { data, error } = await supabase
        .from('centralized_vocabulary')
        .select(`
          id,
          word,
          translation,
          language,
          is_mwe,
          mwe_type,
          component_words,
          should_track_for_fsrs
        `)
        .ilike('word', sanitizedLemma)
        .eq('language', 'es')
        .eq('should_track_for_fsrs', true)
        .limit(1);

      if (error) {
        console.error(`❌ Error for "${word}":`, error);
      } else {
        console.log(`✅ Success for "${word}": Found ${data.length} matches`);
        if (data.length > 0) {
          console.log(`   → Match: ${data[0].word} = ${data[0].translation}`);
        }
      }
    } catch (error) {
      console.error(`💥 Exception for "${word}":`, error);
    }
  }
}

testVocabularyLookup();
