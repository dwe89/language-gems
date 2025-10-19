import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const frenchPages = [
  {
    language: 'french',
    category: 'adverbs',
    topic_slug: 'adverb-formation',
    title: 'French Adverb Formation',
    description: 'Learn how to form adverbs from adjectives using -ment and other patterns',
    difficulty: 'beginner',
    estimated_time: 15,
    youtube_video_id: 'dQw4w9WgXcQ',
    sections: [
      {
        title: 'Introduction to Adverb Formation',
        content: 'French adverbs are typically formed by adding -ment to the feminine form of an adjective.',
        examples: [
          { english: 'slow → slowly', french: 'lent → lentement', highlight: ['lentement'] },
          { english: 'quick → quickly', french: 'rapide → rapidement', highlight: ['rapidement'] }
        ]
      },
      {
        title: 'Regular Adverb Formation with -ment',
        content: 'To form an adverb: Take the feminine form of the adjective and add -ment.',
        examples: [
          { english: 'He speaks seriously.', french: 'Il parle sérieusement.', highlight: ['sérieusement'] },
          { english: 'She walks slowly.', french: 'Elle marche lentement.', highlight: ['lentement'] }
        ]
      }
    ]
  },
  {
    language: 'french',
    category: 'adverbs',
    topic_slug: 'adverb-comparative',
    title: 'Comparative Adverbs',
    description: 'Master comparative forms of adverbs: plus, moins, aussi',
    difficulty: 'intermediate',
    estimated_time: 15,
    youtube_video_id: 'dQw4w9WgXcQ',
    sections: [
      {
        title: 'Comparative Adverbs',
        content: 'Comparative adverbs compare two actions or qualities.',
        examples: [
          { english: 'He runs faster than me.', french: 'Il court plus vite que moi.', highlight: ['plus vite'] },
          { english: 'She speaks less loudly.', french: 'Elle parle moins fort.', highlight: ['moins fort'] }
        ]
      }
    ]
  }
];

async function createPages() {
  try {
    for (const page of frenchPages) {
      const { error } = await supabase
        .from('grammar_pages')
        .upsert(
          {
            language: page.language,
            category: page.category,
            topic_slug: page.topic_slug,
            title: page.title,
            description: page.description,
            difficulty: page.difficulty,
            estimated_time: page.estimated_time,
            youtube_video_id: page.youtube_video_id,
            sections: page.sections,
            back_url: `/grammar/${page.language}`,
            practice_url: `/grammar/${page.language}/${page.category}/${page.topic_slug}/practice`,
            quiz_url: `/grammar/${page.language}/${page.category}/${page.topic_slug}/quiz`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          { onConflict: 'language,category,topic_slug' }
        );

      if (error) {
        console.error(`Error creating ${page.topic_slug}:`, error);
      } else {
        console.log(`✅ Created ${page.topic_slug}`);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

createPages();

