import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Map of old slugs to new slugs based on actual directory structure
const slugMappings = [
  // Adjectives
  { old: 'adjective-endings', new: 'endings', category: 'adjectives' },
  { old: 'comparative-superlative', new: 'comparison', category: 'adjectives' },
  
  // Cases - keep as is
  { old: 'accusative', new: 'accusative', category: 'cases' },
  { old: 'dative', new: 'dative', category: 'cases' },
  { old: 'genitive', new: 'genitive', category: 'cases' },
  { old: 'nominative', new: 'nominative', category: 'cases' },
  { old: 'prepositions', new: 'prepositions', category: 'cases' },
  { old: 'two-way-prepositions', new: 'two-way-prepositions', category: 'cases' },
  
  // Nouns
  { old: 'compound-nouns', new: 'compound-nouns', category: 'nouns' },
  { old: 'declension', new: 'declension', category: 'nouns' },
  { old: 'gender-rules', new: 'gender', category: 'nouns' },
  { old: 'plural-formation', new: 'plurals', category: 'nouns' },
  { old: 'weak-nouns', new: 'weak-nouns', category: 'nouns' },
  
  // Prepositions
  { old: 'accusative-prepositions', new: 'accusative-prepositions', category: 'prepositions' },
  { old: 'dative-prepositions', new: 'dative-prepositions', category: 'prepositions' },
  
  // Pronouns
  { old: 'object-pronouns', new: 'personal', category: 'pronouns' },
  { old: 'subject-pronouns', new: 'personal', category: 'pronouns' },
  
  // Syntax
  { old: 'word-order', new: 'word-order', category: 'syntax' },
  
  // Verbs
  { old: 'future-tense', new: 'future-tense', category: 'verbs' },
  { old: 'modal-verbs', new: 'modal-verbs', category: 'verbs' },
  { old: 'passive-voice', new: 'passive-voice', category: 'verbs' },
  { old: 'past-tense', new: 'past-tense', category: 'verbs' },
  { old: 'perfect-tense', new: 'perfect-tense', category: 'verbs' },
  { old: 'present-tense', new: 'present-tense', category: 'verbs' },
  { old: 'reflexive-verbs', new: 'reflexive-verbs', category: 'verbs' },
  { old: 'separable-verbs', new: 'separable-verbs', category: 'verbs' }
];

async function fixSlugs() {
  for (const mapping of slugMappings) {
    if (mapping.old === mapping.new) {
      console.log(`⏭️  Skipping ${mapping.category}/${mapping.old} (no change needed)`);
      continue;
    }

    const { error } = await supabase
      .from('grammar_pages')
      .update({ topic_slug: mapping.new })
      .eq('language', 'german')
      .eq('category', mapping.category)
      .eq('topic_slug', mapping.old);

    if (error) {
      console.error(`❌ Error updating ${mapping.category}/${mapping.old}:`, error);
    } else {
      console.log(`✅ Updated ${mapping.category}/${mapping.old} → ${mapping.new}`);
    }
  }
}

fixSlugs();

