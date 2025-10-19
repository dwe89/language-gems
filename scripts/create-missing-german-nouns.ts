import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createMissingNouns() {
  // 1. Create compound-nouns page
  const compoundNouns = {
    sections: [
      {
        title: 'Introduction to German Compound Nouns',
        content: 'German compound nouns (Komposita) are formed by combining two or more nouns. The gender of the compound noun is determined by the last noun.',
        examples: [
          { english: 'school + book = schoolbook', german: 'Schule + Buch = Schulbuch', highlight: ['Schulbuch'] },
          { english: 'car + door = car door', german: 'Auto + Tür = Autotür', highlight: ['Autotür'] }
        ]
      },
      {
        title: 'Connecting Letters (Fugenlaut)',
        content: 'Many compound nouns use connecting letters (s, es, e, en) between the components to improve pronunciation.',
        examples: [
          { english: 'love + letter = love letter', german: 'Liebe + Brief = Liebesbrief', highlight: ['Liebesbrief'] },
          { english: 'work + place = workplace', german: 'Arbeit + Platz = Arbeitsplatz', highlight: ['Arbeitsplatz'] }
        ]
      }
    ]
  };

  // 2. Create declension page
  const declension = {
    sections: [
      {
        title: 'German Noun Declension Overview',
        content: 'German nouns change their form based on case (nominative, accusative, dative, genitive). This process is called declension.',
        examples: [
          { english: 'The man (nominative)', german: 'Der Mann', highlight: ['Mann'] },
          { english: 'The man (accusative)', german: 'Den Mann', highlight: ['Mann'] }
        ]
      },
      {
        title: 'Declension Patterns',
        content: 'German nouns follow different declension patterns depending on their gender and ending.',
        examples: [
          { english: 'Masculine noun: der Mann', german: 'Nominative: der Mann, Accusative: den Mann', highlight: ['Mann'] },
          { english: 'Feminine noun: die Frau', german: 'Nominative: die Frau, Accusative: die Frau', highlight: ['Frau'] }
        ]
      }
    ]
  };

  // 3. Create weak-nouns page
  const weakNouns = {
    sections: [
      {
        title: 'German Weak Nouns (N-Declension)',
        content: 'Weak nouns (n-declension) add -n or -en in all cases except the nominative singular.',
        examples: [
          { english: 'The boy', german: 'Nominative: der Junge, Accusative: den Jungen', highlight: ['Junge', 'Jungen'] },
          { english: 'The man', german: 'Nominative: der Mann, Accusative: den Mann', highlight: ['Mann'] }
        ]
      },
      {
        title: 'Common Weak Nouns',
        content: 'Most weak nouns are masculine and refer to people or animals.',
        examples: [
          { english: 'boy', german: 'Junge', highlight: ['Junge'] },
          { english: 'man', german: 'Mann', highlight: ['Mann'] },
          { english: 'student', german: 'Student', highlight: ['Student'] }
        ]
      }
    ]
  };

  const updates = [
    { slug: 'compound-nouns', data: compoundNouns },
    { slug: 'declension', data: declension },
    { slug: 'weak-nouns', data: weakNouns }
  ];

  for (const update of updates) {
    const { error } = await supabase
      .from('grammar_pages')
      .update({
        sections: update.data.sections,
        youtube_video_id: 'dQw4w9WgXcQ'
      })
      .eq('language', 'german')
      .eq('category', 'nouns')
      .eq('topic_slug', update.slug);

    if (error) {
      console.error(`❌ Error updating ${update.slug}:`, error);
    } else {
      console.log(`✅ Created content for ${update.slug}`);
    }
  }
}

createMissingNouns();

