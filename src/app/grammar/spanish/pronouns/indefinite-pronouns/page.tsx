import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'pronouns',
  topic: 'indefinite-pronouns',
  title: 'Spanish Indefinite Pronouns',
  description: 'Master Spanish indefinite pronouns with clear explanations and practical examples.',
  difficulty: 'intermediate',
  keywords: [
    'spanish indefinite pronouns',
    'algo',
    'nada',
    'alguien',
    'nadie',
    'alguno',
    'ninguno',
    'spanish negation'
  ],
  examples: [
    'Quieres algo? (Do you want something?)',
    'No quiero nada (I don\'t want anything)',
    'Viene alguien? (Is someone coming?)'
  ]
});

const sections = [
  {
    title: 'What are Indefinite Pronouns?',
    content: `Indefinite pronouns refer to people or things in a non-specific way. They don't identify exactly who or what is being discussed.

Common Spanish indefinite pronouns include:
- **algo** (something)
- **nada** (nothing)
- **alguien** (someone)
- **nadie** (nobody)
- **alguno/a/os/as** (some, someone)
- **ninguno/a/os/as** (none, nobody)`,
    examples: [
      {
        spanish: 'Quieres algo?',
        english: 'Do you want something?',
        highlight: ['algo']
      },
      {
        spanish: 'No quiero nada.',
        english: 'I don\'t want anything.',
        highlight: ['nada']
      }
    ]
  },
  {
    title: 'Affirmative vs Negative Indefinites',
    content: `Spanish indefinite pronouns come in affirmative and negative pairs.`,
    subsections: [
      {
        title: 'Affirmative Indefinites',
        content: 'Used in affirmative or interrogative sentences:',
        examples: [
          {
            spanish: 'Quieres algo?',
            english: 'Do you want something?',
            highlight: ['algo']
          },
          {
            spanish: 'Viene alguien?',
            english: 'Is someone coming?',
            highlight: ['alguien']
          },
          {
            spanish: 'Tengo algunos libros.',
            english: 'I have some books.',
            highlight: ['algunos']
          }
        ]
      },
      {
        title: 'Negative Indefinites',
        content: 'Used in negative sentences:',
        examples: [
          {
            spanish: 'No quiero nada.',
            english: 'I don\'t want anything.',
            highlight: ['nada']
          },
          {
            spanish: 'No viene nadie.',
            english: 'Nobody is coming.',
            highlight: ['nadie']
          },
          {
            spanish: 'No tengo ningún libro.',
            english: 'I don\'t have any books.',
            highlight: ['ningún']
          }
        ]
      }
    ]
  },
  {
    title: 'Algo and Nada',
    content: `**Algo** and **nada** refer to things (not people).`,
    subsections: [
      {
        title: 'Algo (Something)',
        content: 'Used in affirmative questions or statements:',
        examples: [
          {
            spanish: 'Quieres algo?',
            english: 'Do you want something?',
            highlight: ['algo']
          },
          {
            spanish: 'Hay algo en la mesa.',
            english: 'There is something on the table.',
            highlight: ['algo']
          }
        ]
      },
      {
        title: 'Nada (Nothing)',
        content: 'Used in negative sentences:',
        examples: [
          {
            spanish: 'No quiero nada.',
            english: 'I don\'t want anything.',
            highlight: ['nada']
          },
          {
            spanish: 'No hay nada en la mesa.',
            english: 'There is nothing on the table.',
            highlight: ['nada']
          }
        ]
      }
    ]
  },
  {
    title: 'Alguien and Nadie',
    content: `**Alguien** and **nadie** refer to people.`,
    subsections: [
      {
        title: 'Alguien (Someone)',
        content: 'Used in affirmative questions or statements:',
        examples: [
          {
            spanish: 'Viene alguien?',
            english: 'Is someone coming?',
            highlight: ['alguien']
          },
          {
            spanish: 'Hay alguien en la casa.',
            english: 'There is someone in the house.',
            highlight: ['alguien']
          }
        ]
      },
      {
        title: 'Nadie (Nobody)',
        content: 'Used in negative sentences:',
        examples: [
          {
            spanish: 'No viene nadie.',
            english: 'Nobody is coming.',
            highlight: ['nadie']
          },
          {
            spanish: 'No hay nadie en la casa.',
            english: 'There is nobody in the house.',
            highlight: ['nadie']
          }
        ]
      }
    ]
  },
  {
    title: 'Alguno and Ninguno',
    content: `**Alguno** and **ninguno** agree with the noun they modify.`,
    examples: [
      {
        spanish: 'Tengo algunos libros.',
        english: 'I have some books.',
        highlight: ['algunos']
      },
      {
        spanish: 'No tengo ningún libro.',
        english: 'I don\'t have any books.',
        highlight: ['ningún']
      },
      {
        spanish: 'Alguno de ustedes debe saber.',
        english: 'Someone of you must know.',
        highlight: ['Alguno']
      },
      {
        spanish: 'No conozco a nadie que hable cinco idiomas.',
        english: 'I don\'t know anyone who speaks five languages.',
        highlight: ['nadie']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Pronouns', url: '/grammar/spanish/pronouns', difficulty: 'beginner' },
  { title: 'Demonstrative Pronouns', url: '/grammar/spanish/pronouns/demonstrative-pronouns', difficulty: 'beginner' },
  { title: 'Negation', url: '/grammar/spanish/advanced-constructions/negation', difficulty: 'intermediate' }
];

export default function SpanishIndefinitePronounsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'pronouns',
              topic: 'indefinite-pronouns',
              title: 'Spanish Indefinite Pronouns',
              description: 'Master Spanish indefinite pronouns',
              difficulty: 'intermediate',
              estimatedTime: 20
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'pronouns',
              topic: 'indefinite-pronouns',
              title: 'Spanish Indefinite Pronouns'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="pronouns"
        topic="indefinite-pronouns"
        title="Spanish Indefinite Pronouns"
        description="Master Spanish indefinite pronouns with clear explanations and practical examples"
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/pronouns"
        practiceUrl="/grammar/spanish/pronouns/indefinite-pronouns/practice"
        quizUrl="/grammar/spanish/pronouns/indefinite-pronouns/quiz"
        songUrl="/songs/es?theme=grammar&topic=indefinite-pronouns"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

