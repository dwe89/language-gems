import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const pages = [
  {
    language: 'spanish',
    category: 'verbs',
    topic_slug: 'modal-verbs',
    title: 'Spanish Modal Verbs - Expressing Ability, Obligation, and Desire',
    description: 'Master modal verbs like poder, deber, querer, and soler to express ability, obligation, and desire',
    youtube_video_id: 'Ks6x1GlZ3QE',
    sections: [
      {
        title: 'Introduction to Modal Verbs',
        content: 'Modal verbs express ability, obligation, permission, or desire. They are always followed by an infinitive without a preposition.',
        examples: [
          { english: 'I can speak Spanish.', spanish: 'Puedo hablar español.', highlight: ['Puedo'] },
          { english: 'You must study.', spanish: 'Debes estudiar.', highlight: ['Debes'] }
        ]
      }
    ]
  },
  {
    language: 'spanish',
    category: 'verbs',
    topic_slug: 'present-continuous',
    title: 'Spanish Present Continuous - Estar + Gerund',
    description: 'Learn how to form and use the present continuous tense with estar and gerunds',
    youtube_video_id: 'dQw4w9WgXcQ',
    sections: [
      {
        title: 'Introduction to Present Continuous',
        content: 'The present continuous expresses an action that is happening right now. It is formed with **estar + gerund**.',
        examples: [
          { english: 'I am reading.', spanish: 'Estoy leyendo.', highlight: ['Estoy', 'leyendo'] }
        ]
      }
    ]
  },
  {
    language: 'spanish',
    category: 'verbs',
    topic_slug: 'imperfect-continuous',
    title: 'Spanish Imperfect Continuous - Estar + Gerund in Past',
    description: 'Learn how to express ongoing actions in the past using imperfect continuous',
    youtube_video_id: 'kOHB85vDuqM',
    sections: [
      {
        title: 'Introduction to Imperfect Continuous',
        content: 'The imperfect continuous expresses an action that was happening in the past. It is formed with **imperfect estar + gerund**.',
        examples: [
          { english: 'I was reading.', spanish: 'Estaba leyendo.', highlight: ['Estaba', 'leyendo'] }
        ]
      }
    ]
  },
  {
    language: 'spanish',
    category: 'pronouns',
    topic_slug: 'reflexive-pronouns',
    title: 'Spanish Reflexive Pronouns - Me, Te, Se, Nos, Os',
    description: 'Master reflexive pronouns and reflexive verbs in Spanish',
    youtube_video_id: 'qJwTW1YCVEA',
    sections: [
      {
        title: 'Introduction to Reflexive Pronouns',
        content: 'Reflexive pronouns indicate that the action of the verb is performed by the subject on itself.',
        examples: [
          { english: 'I wash myself.', spanish: 'Me lavo.', highlight: ['Me'] }
        ]
      }
    ]
  },
  {
    language: 'spanish',
    category: 'pronouns',
    topic_slug: 'possessive-pronouns',
    title: 'Spanish Possessive Pronouns - Mío, Tuyo, Suyo',
    description: 'Learn possessive pronouns that replace nouns and show ownership',
    youtube_video_id: 'dQw4w9WgXcQ',
    sections: [
      {
        title: 'Introduction to Possessive Pronouns',
        content: 'Possessive pronouns replace nouns and show who owns something.',
        examples: [
          { english: 'This book is mine.', spanish: 'Este libro es mío.', highlight: ['mío'] }
        ]
      }
    ]
  },
  {
    language: 'spanish',
    category: 'pronouns',
    topic_slug: 'object-pronouns',
    title: 'Spanish Object Pronouns - Direct and Indirect',
    description: 'Master direct and indirect object pronouns in Spanish',
    youtube_video_id: 'Ks6x1GlZ3QE',
    sections: [
      {
        title: 'Introduction to Object Pronouns',
        content: 'Object pronouns replace nouns that receive the action of the verb.',
        examples: [
          { english: 'I see him.', spanish: 'Lo veo.', highlight: ['Lo'] }
        ]
      }
    ]
  },
  {
    language: 'spanish',
    category: 'nouns',
    topic_slug: 'definite',
    title: 'Spanish Definite Articles - El, La, Los, Las',
    description: 'Master the use of definite articles in Spanish',
    youtube_video_id: 'kOHB85vDuqM',
    sections: [
      {
        title: 'Introduction to Definite Articles',
        content: 'Definite articles (el, la, los, las) refer to specific nouns that are already known.',
        examples: [
          { english: 'The dog is in the garden.', spanish: 'El perro está en el jardín.', highlight: ['El', 'el'] }
        ]
      }
    ]
  },
  {
    language: 'spanish',
    category: 'nouns',
    topic_slug: 'articles',
    title: 'Spanish Articles - Definite and Indefinite',
    description: 'Master both definite and indefinite articles in Spanish',
    youtube_video_id: 'qJwTW1YCVEA',
    sections: [
      {
        title: 'Introduction to Articles',
        content: 'Spanish articles indicate whether a noun is specific (definite) or general (indefinite).',
        examples: [
          { english: 'The dog (specific)', spanish: 'El perro', highlight: ['El'] }
        ]
      }
    ]
  },
  {
    language: 'spanish',
    category: 'verbs',
    topic_slug: 'interrogatives',
    title: 'Spanish Interrogative Verbs - Asking Questions',
    description: 'Master how to form and use interrogative verbs in Spanish to ask questions effectively',
    youtube_video_id: 'kOHB85vDuqM',
    sections: [
      {
        title: 'Introduction to Interrogative Verbs',
        content: 'Interrogative verbs in Spanish are used to ask questions. Unlike English, Spanish has several ways to form questions.',
        examples: [
          { english: 'You speak Spanish?', spanish: '¿Hablas español?', highlight: ['Hablas'] }
        ]
      }
    ]
  },
  {
    language: 'spanish',
    category: 'verbs',
    topic_slug: 'infinitive-constructions',
    title: 'Spanish Infinitive Constructions - Using Infinitives',
    description: 'Learn how to use infinitives in Spanish with modal verbs, prepositions, and other constructions',
    youtube_video_id: 'qJwTW1YCVEA',
    sections: [
      {
        title: 'Introduction to Infinitives',
        content: 'The infinitive is the base form of a verb, ending in -ar, -er, or -ir. Infinitives can be used as nouns and in various constructions.',
        examples: [
          { english: 'To speak is important.', spanish: 'Hablar es importante.', highlight: ['Hablar'] }
        ]
      }
    ]
  }
];

async function createPages() {
  for (const page of pages) {
    try {
      const { error } = await supabase
        .from('grammar_pages')
        .upsert(
          {
            language: page.language,
            category: page.category,
            topic_slug: page.topic_slug,
            title: page.title,
            description: page.description,
            youtube_video_id: page.youtube_video_id,
            sections: page.sections,
            difficulty: 'beginner',
            estimated_time: 15,
            related_topics: [],
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
        console.log(`✓ Created ${page.topic_slug}`);
      }
    } catch (err) {
      console.error(`Exception for ${page.topic_slug}:`, err);
    }
  }
}

createPages();

