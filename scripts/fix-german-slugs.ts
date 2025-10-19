import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Map of old slugs to new slugs
const slugMappings = [
  { old: 'adjective-endings', new: 'endings' },
  { old: 'comparative-superlative', new: 'comparative-superlative' }, // Keep as is
  { old: 'accusative', new: 'accusative' }, // Keep as is
  { old: 'dative', new: 'dative' }, // Keep as is
  { old: 'genitive', new: 'genitive' }, // Keep as is
  { old: 'nominative', new: 'nominative' }, // Keep as is
  { old: 'prepositions', new: 'prepositions' }, // Keep as is
  { old: 'two-way-prepositions', new: 'two-way-prepositions' }, // Keep as is
  { old: 'compound-nouns', new: 'compound-nouns' }, // Keep as is
  { old: 'declension', new: 'declension' }, // Keep as is
  { old: 'gender-rules', new: 'gender' },
  { old: 'plural-formation', new: 'plurals' },
  { old: 'weak-nouns', new: 'weak-nouns' }, // Keep as is
  { old: 'accusative-prepositions', new: 'accusative-prepositions' }, // Keep as is
  { old: 'dative-prepositions', new: 'dative-prepositions' }, // Keep as is
  { old: 'object-pronouns', new: 'object-pronouns' }, // Keep as is
  { old: 'subject-pronouns', new: 'pronouns' },
  { old: 'word-order', new: 'word-order' }, // Keep as is
  { old: 'future-tense', new: 'future' },
  { old: 'modal-verbs', new: 'modal-verbs' }, // Keep as is
  { old: 'passive-voice', new: 'passive' },
  { old: 'past-tense', new: 'past' },
  { old: 'perfect-tense', new: 'perfect' },
  { old: 'present-tense', new: 'present' },
  { old: 'reflexive-verbs', new: 'reflexive' },
  { old: 'separable-verbs', new: 'separable' }
];

async function fixSlugs() {
  for (const mapping of slugMappings) {
    if (mapping.old === mapping.new) {
      console.log(`⏭️  Skipping ${mapping.old} (no change needed)`);
      continue;
    }

    const { error } = await supabase
      .from('grammar_pages')
      .update({ topic_slug: mapping.new })
      .eq('language', 'german')
      .eq('topic_slug', mapping.old);

    if (error) {
      console.error(`❌ Error updating ${mapping.old}:`, error);
    } else {
      console.log(`✅ Updated ${mapping.old} → ${mapping.new}`);
    }
  }
}

fixSlugs();

