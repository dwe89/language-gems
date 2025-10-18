import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'pronouns',
  topic: 'demonstrative-pronouns',
  title: 'Spanish Demonstrative Pronouns',
  description: 'Master Spanish demonstrative pronouns with clear explanations and practical examples.',
  difficulty: 'beginner',
  keywords: [
    'spanish demonstrative pronouns',
    'éste',
    'ése',
    'aquél',
    'esto',
    'eso',
    'aquello',
    'distance in spanish'
  ],
  examples: [
    'Prefiero éste (I prefer this one)',
    'Eso no es verdad (That is not true)',
    'Aquello fue increíble (That over there was incredible)'
  ]
});

const sections = [
  {
    title: 'What are Demonstrative Pronouns?',
    content: `Demonstrative pronouns point to or identify specific people, things, or ideas. They show **distance** from the speaker.

In Spanish, demonstrative pronouns have three levels of distance:
- **Éste/ésta/esto** (this) - near the speaker
- **Ése/ésa/eso** (that) - near the listener
- **Aquél/aquélla/aquello** (that over there) - far from both`,
    examples: [
      {
        spanish: 'Prefiero éste.',
        english: 'I prefer this one. (near me)',
        highlight: ['éste']
      },
      {
        spanish: 'Eso no es verdad.',
        english: 'That is not true. (near you)',
        highlight: ['Eso']
      },
      {
        spanish: 'Aquello fue increíble.',
        english: 'That over there was incredible. (far away)',
        highlight: ['Aquello']
      }
    ]
  },
  {
    title: 'Demonstrative Pronouns vs Adjectives',
    content: `It's important to distinguish between demonstrative pronouns and demonstrative adjectives.

- **Adjectives** modify a noun: Este libro (this book)
- **Pronouns** stand alone: Éste (this one)`,
    subsections: [
      {
        title: 'Demonstrative Adjectives',
        content: 'Modify a noun (no accent):',
        examples: [
          {
            spanish: 'Este libro es interesante.',
            english: 'This book is interesting.',
            highlight: ['Este']
          },
          {
            spanish: 'Esa casa es grande.',
            english: 'That house is big.',
            highlight: ['Esa']
          }
        ]
      },
      {
        title: 'Demonstrative Pronouns',
        content: 'Stand alone (traditionally with accent):',
        examples: [
          {
            spanish: 'Prefiero éste.',
            english: 'I prefer this one.',
            highlight: ['éste']
          },
          {
            spanish: 'Prefiero ésa.',
            english: 'I prefer that one.',
            highlight: ['ésa']
          }
        ]
      }
    ]
  },
  {
    title: 'Neuter Demonstrative Pronouns',
    content: `Neuter pronouns (esto, eso, aquello) refer to ideas, situations, or unspecified things - not to specific nouns.`,
    subsections: [
      {
        title: 'Esto (This)',
        content: 'Refers to something near the speaker:',
        examples: [
          {
            spanish: 'Esto es lo que quería.',
            english: 'This is what I wanted.',
            highlight: ['Esto']
          }
        ]
      },
      {
        title: 'Eso (That)',
        content: 'Refers to something near the listener:',
        examples: [
          {
            spanish: 'Eso no es verdad.',
            english: 'That is not true.',
            highlight: ['Eso']
          }
        ]
      },
      {
        title: 'Aquello (That over there)',
        content: 'Refers to something far from both:',
        examples: [
          {
            spanish: 'Aquello fue increíble.',
            english: 'That over there was incredible.',
            highlight: ['Aquello']
          }
        ]
      }
    ]
  },
  {
    title: 'Distance and Context',
    content: `The three levels of distance are important in Spanish.`,
    examples: [
      {
        spanish: 'Estos libros y esos son diferentes.',
        english: 'These books (near me) and those (near you) are different.',
        highlight: ['Estos', 'esos']
      },
      {
        spanish: 'Estos son los mejores, pero aquéllos también son buenos.',
        english: 'These (near me) are the best, but those over there (far away) are also good.',
        highlight: ['Estos', 'aquéllos']
      },
      {
        spanish: 'Entre éste y aquél, prefiero el primero.',
        english: 'Between this one (near me) and that one (far away), I prefer the first.',
        highlight: ['éste', 'aquél']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Pronouns', url: '/grammar/spanish/pronouns', difficulty: 'beginner' },
  { title: 'Relative Pronouns', url: '/grammar/spanish/pronouns', difficulty: 'intermediate' },
  { title: 'Indefinite Pronouns', url: '/grammar/spanish/pronouns/indefinite-pronouns', difficulty: 'intermediate' }
];

export default function SpanishDemonstrativePronounsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'pronouns',
              topic: 'demonstrative-pronouns',
              title: 'Spanish Demonstrative Pronouns',
              description: 'Master Spanish demonstrative pronouns',
              difficulty: 'beginner',
              estimatedTime: 15
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'pronouns',
              topic: 'demonstrative-pronouns',
              title: 'Spanish Demonstrative Pronouns'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="pronouns"
        topic="demonstrative-pronouns"
        title="Spanish Demonstrative Pronouns"
        description="Master Spanish demonstrative pronouns with clear explanations and practical examples"
        difficulty="beginner"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/spanish/pronouns"
        practiceUrl="/grammar/spanish/pronouns/demonstrative-pronouns/practice"
        quizUrl="/grammar/spanish/pronouns/demonstrative-pronouns/quiz"
        songUrl="/songs/es?theme=grammar&topic=demonstrative-pronouns"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

