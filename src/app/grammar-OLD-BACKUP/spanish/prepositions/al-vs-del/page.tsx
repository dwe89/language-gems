import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'prepositions',
  topic: 'al-vs-del',
  title: 'Spanish Al vs Del Contractions',
  description: 'Master the Spanish contractions al and del with clear explanations and practical examples.',
  difficulty: 'beginner',
  keywords: [
    'spanish al contraction',
    'spanish del contraction',
    'a + el = al',
    'de + el = del',
    'spanish prepositions'
  ],
  examples: [
    'Voy al cine (I go to the cinema)',
    'El libro del profesor (The teacher\'s book)',
    'Al llegar a casa (Upon arriving home)'
  ]
});

const sections = [
  {
    title: 'What are Al and Del?',
    content: `In Spanish, certain prepositions combine with the definite article **el** to form contractions:

- **al** = a + el (to the)
- **del** = de + el (of the, from the)

These are the only two contractions in Spanish. They are mandatory - you cannot say "a el" or "de el" in standard Spanish.`,
    examples: [
      {
        spanish: 'Voy al cine.',
        english: 'I go to the cinema.',
        highlight: ['al']
      },
      {
        spanish: 'El libro del profesor.',
        english: 'The teacher\'s book.',
        highlight: ['del']
      }
    ]
  },
  {
    title: 'The Contraction AL',
    content: `**AL** is the contraction of **a** (to, at) + **el** (the).`,
    subsections: [
      {
        title: 'When to Use AL',
        content: 'Use al when you need the preposition "a" before the masculine singular article "el":',
        examples: [
          {
            spanish: 'Voy al parque.',
            english: 'I go to the park.',
            highlight: ['al']
          },
          {
            spanish: 'Al llegar, vi a mis amigos.',
            english: 'Upon arriving, I saw my friends.',
            highlight: ['Al']
          },
          {
            spanish: 'Ayudo al niño.',
            english: 'I help the boy.',
            highlight: ['al']
          }
        ]
      },
      {
        title: 'Important: AL is Mandatory',
        content: 'You must use "al" - never say "a el":',
        examples: [
          {
            spanish: 'Voy al cine. (CORRECT)',
            english: 'I go to the cinema.',
            highlight: ['al']
          },
          {
            spanish: 'Voy a el cine. (INCORRECT)',
            english: 'This is not standard Spanish.',
            highlight: ['a el']
          }
        ]
      }
    ]
  },
  {
    title: 'The Contraction DEL',
    content: `**DEL** is the contraction of **de** (of, from) + **el** (the).`,
    subsections: [
      {
        title: 'When to Use DEL',
        content: 'Use del when you need the preposition "de" before the masculine singular article "el":',
        examples: [
          {
            spanish: 'El libro del profesor.',
            english: 'The teacher\'s book.',
            highlight: ['del']
          },
          {
            spanish: 'Vengo del cine.',
            english: 'I come from the cinema.',
            highlight: ['del']
          },
          {
            spanish: 'La casa del amigo.',
            english: 'The friend\'s house.',
            highlight: ['del']
          }
        ]
      },
      {
        title: 'Important: DEL is Mandatory',
        content: 'You must use "del" - never say "de el":',
        examples: [
          {
            spanish: 'El color del cielo. (CORRECT)',
            english: 'The color of the sky.',
            highlight: ['del']
          },
          {
            spanish: 'El color de el cielo. (INCORRECT)',
            english: 'This is not standard Spanish.',
            highlight: ['de el']
          }
        ]
      }
    ]
  },
  {
    title: 'Important: No Contractions with Other Articles',
    content: `Contractions ONLY happen with the masculine singular article **el**. There are NO contractions with:
- **la** (feminine singular)
- **los** (masculine plural)
- **las** (feminine plural)`,
    examples: [
      {
        spanish: 'Voy a la casa. (NOT: a la)',
        english: 'I go to the house.',
        highlight: ['a la']
      },
      {
        spanish: 'Voy a los parques. (NOT: a los)',
        english: 'I go to the parks.',
        highlight: ['a los']
      },
      {
        spanish: 'El libro de la profesora. (NOT: de la)',
        english: 'The teacher\'s book.',
        highlight: ['de la']
      },
      {
        spanish: 'Los libros de los estudiantes. (NOT: de los)',
        english: 'The students\' books.',
        highlight: ['de los']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Prepositions', url: '/grammar/spanish/prepositions', difficulty: 'beginner' },
  { title: 'Definite Articles', url: '/grammar/spanish/articles', difficulty: 'beginner' },
  { title: 'Por vs Para', url: '/grammar/spanish/prepositions/por-vs-para', difficulty: 'intermediate' }
];

export default function SpanishAlVsDelPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'prepositions',
              topic: 'al-vs-del',
              title: 'Spanish Al vs Del Contractions',
              description: 'Master the Spanish contractions al and del',
              difficulty: 'beginner',
              estimatedTime: 15
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'prepositions',
              topic: 'al-vs-del',
              title: 'Spanish Al vs Del Contractions'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="prepositions"
        topic="al-vs-del"
        title="Spanish Al vs Del Contractions"
        description="Master the Spanish contractions al and del with clear explanations and practical examples"
        difficulty="beginner"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/spanish/prepositions"
        practiceUrl="/grammar/spanish/prepositions/al-vs-del/practice"
        quizUrl="/grammar/spanish/prepositions/al-vs-del/quiz"
        songUrl="/songs/es?theme=grammar&topic=al-vs-del"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

