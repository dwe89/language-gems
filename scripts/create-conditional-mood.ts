import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createConditionalMood() {
  const sections = [
    {
      title: 'Introduction to the Conditional Mood',
      content: 'The conditional mood (le conditionnel) is used to express actions that would happen under certain conditions. It is often used with si (if) clauses and to express polite requests or hypothetical situations.',
      examples: [
        { english: 'I would go if I had time.', french: "J'irais si j'avais le temps.", highlight: ['irais'] },
        { english: 'Would you like some coffee?', french: 'Voudriez-vous du café?', highlight: ['Voudriez'] }
      ]
    },
    {
      title: 'Formation of the Conditional',
      content: 'The conditional is formed using the future stem + imperfect endings (-ais, -ais, -ait, -ions, -iez, -aient). For regular verbs, the future stem is the infinitive.',
      examples: [
        { english: 'I would speak', french: 'Je parlerais', highlight: ['parlerais'] },
        { english: 'You would finish', french: 'Tu finirais', highlight: ['finirais'] },
        { english: 'He would sell', french: 'Il vendrait', highlight: ['vendrait'] }
      ]
    },
    {
      title: 'Conditional of Regular Verbs',
      content: 'Example with PARLER (to speak):',
      examples: [
        { english: 'I would speak', french: 'Je parlerais', highlight: ['parlerais'] },
        { english: 'You would speak', french: 'Tu parlerais', highlight: ['parlerais'] },
        { english: 'He/She would speak', french: 'Il/Elle parlerait', highlight: ['parlerait'] },
        { english: 'We would speak', french: 'Nous parlerions', highlight: ['parlerions'] },
        { english: 'You (plural) would speak', french: 'Vous parleriez', highlight: ['parleriez'] },
        { english: 'They would speak', french: 'Ils/Elles parleraient', highlight: ['parleraient'] }
      ]
    },
    {
      title: 'Uses of the Conditional',
      content: 'The conditional is used to: 1) Express hypothetical situations, 2) Make polite requests, 3) Report indirect speech, 4) Express wishes or desires.',
      examples: [
        { english: 'If I were rich, I would travel.', french: "Si j'étais riche, je voyagerais.", highlight: ['voyagerais'] },
        { english: 'Could you help me?', french: "Pourriez-vous m'aider?", highlight: ['Pourriez'] }
      ]
    }
  ];

  const { error } = await supabase
    .from('grammar_pages')
    .update({
      sections: sections,
      youtube_video_id: 'dQw4w9WgXcQ'
    })
    .eq('language', 'french')
    .eq('category', 'verbs')
    .eq('topic_slug', 'conditional-mood');

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('✅ Created conditional-mood page');
  }
}

createConditionalMood();

