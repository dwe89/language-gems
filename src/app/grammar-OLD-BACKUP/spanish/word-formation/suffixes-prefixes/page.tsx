import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'word-formation',
  topic: 'suffixes-prefixes',
  title: 'Spanish Suffixes and Prefixes',
  description: 'Master Spanish word formation with common suffixes and prefixes to expand your vocabulary.',
  difficulty: 'intermediate',
  keywords: [
    'spanish suffixes',
    'spanish prefixes',
    'word formation',
    '-ción suffix',
    '-mente suffix',
    'des- prefix',
    're- prefix'
  ],
  examples: [
    'acción (action) from actuar',
    'rápidamente (quickly) from rápido',
    'desaparecer (to disappear) from aparecer'
  ]
});

const sections = [
  {
    title: 'What are Suffixes and Prefixes?',
    content: `Suffixes and prefixes are word elements added to root words to create new words with different meanings.

- **Suffixes** are added to the END of a word
- **Prefixes** are added to the BEGINNING of a word

Learning common suffixes and prefixes helps you understand and create new words, expanding your vocabulary significantly.`,
    examples: [
      {
        spanish: 'actuar → acción (to act → action)',
        english: 'Suffix -ción creates a noun',
        highlight: ['-ción']
      },
      {
        spanish: 'rápido → rápidamente (quick → quickly)',
        english: 'Suffix -mente creates an adverb',
        highlight: ['-mente']
      },
      {
        spanish: 'aparecer → desaparecer (to appear → to disappear)',
        english: 'Prefix des- reverses the meaning',
        highlight: ['des-']
      }
    ]
  },
  {
    title: 'Common Spanish Suffixes',
    content: `Suffixes modify the meaning and part of speech of words.`,
    subsections: [
      {
        title: 'Noun-Forming Suffixes',
        content: 'Suffixes that create nouns:',
        examples: [
          {
            spanish: '-ción: acción, creación, solución',
            english: 'Forms nouns from verbs',
            highlight: ['-ción']
          },
          {
            spanish: '-dad: felicidad, libertad, realidad',
            english: 'Forms abstract nouns from adjectives',
            highlight: ['-dad']
          },
          {
            spanish: '-ista: pianista, dentista, artista',
            english: 'Forms nouns for professions',
            highlight: ['-ista']
          },
          {
            spanish: '-anza: esperanza, enseñanza, confianza',
            english: 'Forms abstract nouns',
            highlight: ['-anza']
          }
        ]
      },
      {
        title: 'Adjective-Forming Suffixes',
        content: 'Suffixes that create adjectives:',
        examples: [
          {
            spanish: '-oso: peligroso, hermoso, maravilloso',
            english: 'Forms adjectives meaning full of',
            highlight: ['-oso']
          },
          {
            spanish: '-ible: posible, terrible, horrible',
            english: 'Forms adjectives meaning able to be',
            highlight: ['-ible']
          }
        ]
      },
      {
        title: 'Adverb-Forming Suffixes',
        content: 'Suffixes that create adverbs:',
        examples: [
          {
            spanish: '-mente: rápidamente, lentamente, felizmente',
            english: 'Forms adverbs from adjectives',
            highlight: ['-mente']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Spanish Prefixes',
    content: `Prefixes modify the meaning of root words.`,
    subsections: [
      {
        title: 'Negation and Opposition',
        content: 'Prefixes that negate or reverse meaning:',
        examples: [
          {
            spanish: 'des-: desaparecer, desconectar, deshacer',
            english: 'Reverses or negates the meaning',
            highlight: ['des-']
          },
          {
            spanish: 'in-/im-: imposible, incapaz, infeliz',
            english: 'Negates the meaning',
            highlight: ['in-', 'im-']
          },
          {
            spanish: 'anti-: antibiótico, antivirus, anticongelante',
            english: 'Means against or opposed to',
            highlight: ['anti-']
          }
        ]
      },
      {
        title: 'Repetition and Intensity',
        content: 'Prefixes indicating repetition or intensity:',
        examples: [
          {
            spanish: 're-: rehacer, reconstruir, regresar',
            english: 'Indicates repetition or doing again',
            highlight: ['re-']
          },
          {
            spanish: 'sobre-: sobrecarga, sobresaliente, sobrepeso',
            english: 'Means excess or over',
            highlight: ['sobre-']
          }
        ]
      },
      {
        title: 'Position and Direction',
        content: 'Prefixes indicating position or direction:',
        examples: [
          {
            spanish: 'pre-: prever, preparar, precaución',
            english: 'Means before',
            highlight: ['pre-']
          },
          {
            spanish: 'sub-: subterráneo, submarino, subordinado',
            english: 'Means under or below',
            highlight: ['sub-']
          }
        ]
      }
    ]
  },
  {
    title: 'Combining Prefixes and Suffixes',
    content: `Prefixes and suffixes can be combined to create complex words.`,
    examples: [
      {
        spanish: 'des- + conectar + -ción = desconexión',
        english: 'Disconnection',
        highlight: ['desconexión']
      },
      {
        spanish: 'in- + posible = imposible',
        english: 'Impossible',
        highlight: ['imposible']
      },
      {
        spanish: 're- + hacer = rehacer',
        english: 'To do again',
        highlight: ['rehacer']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Word Formation', url: '/grammar/spanish/word-formation', difficulty: 'intermediate' },
  { title: 'Nouns', url: '/grammar/spanish/nouns', difficulty: 'beginner' },
  { title: 'Adjectives', url: '/grammar/spanish/adjectives', difficulty: 'beginner' }
];

export default function SpanishSuffixesPrefixesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'word-formation',
              topic: 'suffixes-prefixes',
              title: 'Spanish Suffixes and Prefixes',
              description: 'Master Spanish word formation with common suffixes and prefixes',
              difficulty: 'intermediate',
              estimatedTime: 25
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'word-formation',
              topic: 'suffixes-prefixes',
              title: 'Spanish Suffixes and Prefixes'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="word-formation"
        topic="suffixes-prefixes"
        title="Spanish Suffixes and Prefixes"
        description="Master Spanish word formation with common suffixes and prefixes to expand your vocabulary"
        difficulty="intermediate"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/word-formation"
        practiceUrl="/grammar/spanish/word-formation/suffixes-prefixes/practice"
        quizUrl="/grammar/spanish/word-formation/suffixes-prefixes/quiz"
        songUrl="/songs/es?theme=grammar&topic=suffixes-prefixes"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

