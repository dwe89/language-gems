/**
 * Quick test to verify vocabulary queries are using ilike instead of eq
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testVocabularyQuery() {
  console.log('Testing vocabulary query...');
  
  try {
    // Test the query that was causing 406 errors
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
      .ilike('word', 'color')
      .eq('language', 'es')
      .eq('should_track_for_fsrs', true)
      .limit(1);

    if (error) {
      console.error('Query error:', error);
    } else {
      console.log('Query successful:', data);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testVocabularyQuery();
