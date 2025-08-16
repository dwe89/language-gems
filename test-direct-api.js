/**
 * Test vocabulary API directly to bypass any client issues
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create a fresh client instance
const supabase = createClient(supabaseUrl, supabaseKey);

async function testDirectAPI() {
  console.log('🧪 Testing direct vocabulary API calls...\n');
  
  const testWords = ['mi', 'color', 'favorito', 'azul'];
  
  for (const word of testWords) {
    console.log(`📝 Testing word: "${word}"`);
    
    try {
      // Test exact match with should_track_for_fsrs filter
      const { data, error } = await supabase
        .from('centralized_vocabulary')
        .select('id, word, language, should_track_for_fsrs')
        .eq('word', word.toLowerCase())
        .eq('language', 'es')
        .eq('should_track_for_fsrs', true)
        .limit(1);

      if (error) {
        console.error(`❌ Error for "${word}":`, error.message);
      } else {
        console.log(`✅ Success for "${word}": Found ${data.length} matches`);
        if (data.length > 0) {
          console.log(`   📊 Result: ID=${data[0].id}, word=${data[0].word}`);
        }
      }
    } catch (err) {
      console.error(`🚨 Exception for "${word}":`, err.message);
    }
    
    console.log(''); // Empty line for readability
  }
  
  console.log('🏁 Test completed');
}

testDirectAPI().catch(console.error);
