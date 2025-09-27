import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'word-formation',
  topic: 'adjective-adverb',
  title: 'Spanish Adjective to Adverb Formation - -mente Suffix Rules',
  description: 'Master Spanish adverb formation from adjectives using -mente suffix, irregular forms, and placement rules.',
  difficulty: 'intermediate',
  keywords: [
    'spanish adverb formation',
    'mente suffix spanish',
    'adjective to adverb spanish',
    'spanish adverbs rules',
    'adverbios spanish grammar'
  ],
  examples: [
    'rápido → rápidamente (quickly)',
    'fácil → fácilmente (easily)',
    'normal → normalmente (normally)',
    'feliz → felizmente (happily)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Adverb Formation',
    content: `Spanish **adverbs** are often formed by adding **-mente** to adjectives, similar to English "-ly". This is the **most productive** way to create adverbs in Spanish.

**Basic formation rule:**
**Adjective + -mente = Adverb**

**Key principles:**
- **Feminine form**: Use feminine form of adjective + -mente
- **Invariable adjectives**: Add -mente directly
- **Accent preservation**: Original adjective accent is kept
- **Meaning**: Usually describes "how" an action is performed

**Formation patterns:**
- **Regular**: rápida + -mente = rápidamente
- **Invariable**: fácil + -mente = fácilmente
- **Accented**: práctica + -mente = prácticamente

**Why adverb formation matters:**
- **Expressive language**: Add nuance to descriptions
- **Natural Spanish**: Essential for fluent expression
- **Precise communication**: Specify manner of actions
- **Advanced vocabulary**: Expand expressive range

Understanding adverb formation is **crucial** for **intermediate Spanish proficiency**.`,
    examples: [
      {
        spanish: 'ADJECTIVE: Es una persona rápida. (She is a fast person.)',
        english: 'ADVERB: Habla rápidamente. (She speaks quickly.)',
        highlight: ['rápida', 'rápidamente']
      },
      {
        spanish: 'ADJECTIVE: El ejercicio es fácil. (The exercise is easy.)',
        english: 'ADVERB: Lo hace fácilmente. (He does it easily.)',
        highlight: ['fácil', 'fácilmente']
      }
    ]
  },
  {
    title: 'Formation with Feminine Adjectives',
    content: `**Use the feminine form** of the adjective + -mente:`,
    conjugationTable: {
      title: 'Feminine Form + -mente',
      conjugations: [
        { pronoun: 'rápido → rápida', form: 'rápidamente', english: 'quickly' },
        { pronoun: 'lento → lenta', form: 'lentamente', english: 'slowly' },
        { pronoun: 'claro → clara', form: 'claramente', english: 'clearly' },
        { pronoun: 'seguro → segura', form: 'seguramente', english: 'surely' },
        { pronoun: 'completo → completa', form: 'completamente', english: 'completely' }
      ]
    },
    examples: [
      {
        spanish: 'FORMATION: tranquilo → tranquila → tranquilamente',
        english: 'USAGE: Habla tranquilamente. (He speaks calmly.)',
        highlight: ['tranquilamente']
      },
      {
        spanish: 'FORMATION: perfecto → perfecta → perfectamente',
        english: 'USAGE: Funciona perfectamente. (It works perfectly.)',
        highlight: ['perfectamente']
      }
    ]
  },
  {
    title: 'Formation with Invariable Adjectives',
    content: `**Invariable adjectives** (same form for masculine/feminine) add -mente directly:`,
    conjugationTable: {
      title: 'Invariable + -mente',
      conjugations: [
        { pronoun: 'fácil', form: 'fácilmente', english: 'easily' },
        { pronoun: 'difícil', form: 'difícilmente', english: 'with difficulty' },
        { pronoun: 'normal', form: 'normalmente', english: 'normally' },
        { pronoun: 'especial', form: 'especialmente', english: 'especially' },
        { pronoun: 'natural', form: 'naturalmente', english: 'naturally' }
      ]
    },
    examples: [
      {
        spanish: 'EASY: Lo resuelve fácilmente. (He solves it easily.)',
        english: 'DIFFICULT: Difícilmente lo entiendo. (I hardly understand it.)',
        highlight: ['fácilmente', 'Difícilmente']
      },
      {
        spanish: 'NORMAL: Normalmente trabajo aquí. (I normally work here.)',
        english: 'SPECIAL: Especialmente me gusta. (I especially like it.)',
        highlight: ['Normalmente', 'Especialmente']
      }
    ]
  },
  {
    title: 'Accent Preservation Rules',
    content: `**Original accents** are preserved when adding -mente:`,
    conjugationTable: {
      title: 'Accent Preservation',
      conjugations: [
        { pronoun: 'rápido → rápida', form: 'rápidamente', english: 'quickly (keeps accent)' },
        { pronoun: 'práctico → práctica', form: 'prácticamente', english: 'practically (keeps accent)' },
        { pronoun: 'básico → básica', form: 'básicamente', english: 'basically (keeps accent)' },
        { pronoun: 'único → única', form: 'únicamente', english: 'only/uniquely (keeps accent)' }
      ]
    },
    examples: [
      {
        spanish: 'ACCENTED: Habla prácticamente perfecto. (He speaks practically perfectly.)',
        english: 'ACCENTED: Básicamente es correcto. (It\'s basically correct.)',
        highlight: ['prácticamente', 'Básicamente']
      },
      {
        spanish: 'DOUBLE ACCENT: Únicamente él puede hacerlo. (Only he can do it.)',
        english: 'PRESERVED: Típicamente llega tarde. (He typically arrives late.)',
        highlight: ['Únicamente', 'Típicamente']
      }
    ]
  },
  {
    title: 'Common -mente Adverbs',
    content: `**Frequently used** adverbs formed with -mente:`,
    conjugationTable: {
      title: 'Common -mente Adverbs',
      conjugations: [
        { pronoun: 'realmente', form: 'really', english: 'Realmente me gusta. (I really like it.)' },
        { pronoun: 'solamente', form: 'only', english: 'Solamente quiero agua. (I only want water.)' },
        { pronoun: 'principalmente', form: 'mainly', english: 'Principalmente estudio. (I mainly study.)' },
        { pronoun: 'generalmente', form: 'generally', english: 'Generalmente trabajo. (I generally work.)' },
        { pronoun: 'actualmente', form: 'currently', english: 'Actualmente vivo aquí. (I currently live here.)' }
      ]
    },
    examples: [
      {
        spanish: 'FREQUENCY: Generalmente como a las dos. (I generally eat at two.)',
        english: 'EMPHASIS: Realmente es importante. (It\'s really important.)',
        highlight: ['Generalmente', 'Realmente']
      },
      {
        spanish: 'LIMITATION: Solamente tengo cinco euros. (I only have five euros.)',
        english: 'TIME: Actualmente estudio español. (I\'m currently studying Spanish.)',
        highlight: ['Solamente', 'Actualmente']
      }
    ]
  },
  {
    title: 'Irregular and Alternative Forms',
    content: `**Some adverbs** have irregular forms or alternatives to -mente:`,
    conjugationTable: {
      title: 'Irregular Adverb Forms',
      conjugations: [
        { pronoun: 'bueno', form: 'bien (not buenamente)', english: 'well' },
        { pronoun: 'malo', form: 'mal (not malamente)', english: 'badly' },
        { pronoun: 'mucho', form: 'mucho (invariable)', english: 'much/a lot' },
        { pronoun: 'poco', form: 'poco (invariable)', english: 'little/not much' }
      ]
    },
    examples: [
      {
        spanish: 'IRREGULAR: Habla bien español. (He speaks Spanish well.)',
        english: 'IRREGULAR: Lo hace mal. (He does it badly.)',
        highlight: ['bien', 'mal']
      },
      {
        spanish: 'QUANTITY: Trabaja mucho. (He works a lot.)',
        english: 'QUANTITY: Duerme poco. (He sleeps little.)',
        highlight: ['mucho', 'poco']
      }
    ]
  },
  {
    title: 'Adverb Placement Rules',
    content: `**Position** of -mente adverbs in sentences:`,
    examples: [
      {
        spanish: 'AFTER VERB: Habla claramente. (He speaks clearly.)',
        english: 'BEGINNING: Normalmente trabajo aquí. (I normally work here.)',
        highlight: ['claramente', 'Normalmente']
      },
      {
        spanish: 'EMPHASIS: Realmente me gusta mucho. (I really like it a lot.)',
        english: 'MIDDLE: Él siempre habla honestamente. (He always speaks honestly.)',
        highlight: ['Realmente', 'honestamente']
      }
    ],
    subsections: [
      {
        title: 'Flexibility',
        content: 'Spanish adverb placement is quite flexible for emphasis:',
        examples: [
          {
            spanish: 'NORMAL: Trabajo eficientemente.',
            english: 'EMPHASIS: Eficientemente trabajo.',
            highlight: ['eficientemente', 'Eficientemente']
          }
        ]
      }
    ]
  },
  {
    title: 'Multiple Adverbs in Series',
    content: `When using **multiple -mente adverbs**, only the **last one** takes -mente:`,
    examples: [
      {
        spanish: 'SERIES: Habla clara y lentamente. (He speaks clearly and slowly.)',
        english: 'NOT: Habla claramente y lentamente. (Less preferred)',
        highlight: ['clara y lentamente']
      },
      {
        spanish: 'THREE ADVERBS: Trabaja rápida, eficiente y cuidadosamente.',
        english: 'TRANSLATION: He works quickly, efficiently, and carefully.',
        highlight: ['rápida, eficiente y cuidadosamente']
      }
    ],
    subsections: [
      {
        title: 'Rule',
        content: 'Only the final adverb in a series takes the -mente suffix:',
        examples: [
          {
            spanish: '✅ fácil y rápidamente',
            english: '❌ fácilmente y rápidamente (less natural)',
            highlight: ['fácil y rápidamente']
          }
        ]
      }
    ]
  },
  {
    title: 'Adverbial Phrases as Alternatives',
    content: `**Prepositional phrases** can replace -mente adverbs:`,
    conjugationTable: {
      title: 'Adverbial Phrase Alternatives',
      conjugations: [
        { pronoun: 'rápidamente', form: 'con rapidez', english: 'quickly / with speed' },
        { pronoun: 'cuidadosamente', form: 'con cuidado', english: 'carefully / with care' },
        { pronoun: 'frecuentemente', form: 'con frecuencia', english: 'frequently / with frequency' },
        { pronoun: 'facilmente', form: 'con facilidad', english: 'easily / with ease' }
      ]
    },
    examples: [
      {
        spanish: 'ADVERB: Trabaja cuidadosamente. (He works carefully.)',
        english: 'PHRASE: Trabaja con cuidado. (He works with care.)',
        highlight: ['cuidadosamente', 'con cuidado']
      },
      {
        spanish: 'ADVERB: Viene frecuentemente. (He comes frequently.)',
        english: 'PHRASE: Viene con frecuencia. (He comes with frequency.)',
        highlight: ['frecuentemente', 'con frecuencia']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong base form**: Using masculine instead of feminine
**2. Missing accents**: Not preserving original accents
**3. Overuse**: Using -mente when simpler forms exist
**4. Series errors**: Adding -mente to all adverbs in series`,
    examples: [
      {
        spanish: '❌ rápidomente → ✅ rápidamente',
        english: 'Wrong: must use feminine form as base',
        highlight: ['rápidamente']
      },
      {
        spanish: '❌ practicmente → ✅ prácticamente',
        english: 'Wrong: must preserve original accent',
        highlight: ['prácticamente']
      },
      {
        spanish: '❌ buenamente → ✅ bien',
        english: 'Wrong: use irregular form',
        highlight: ['bien']
      },
      {
        spanish: '❌ claramente y rápidamente → ✅ clara y rápidamente',
        english: 'Wrong: only last adverb takes -mente in series',
        highlight: ['clara y rápidamente']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Adverb Formation', url: '/grammar/spanish/adverbs/formation', difficulty: 'intermediate' },
  { title: 'Spanish Adjective Agreement', url: '/grammar/spanish/adjectives/agreement', difficulty: 'beginner' },
  { title: 'Spanish Word Order', url: '/grammar/spanish/syntax/word-order', difficulty: 'intermediate' },
  { title: 'Spanish Comparative Adverbs', url: '/grammar/spanish/adverbial-prepositional/comparative-adverbs', difficulty: 'intermediate' }
];

export default function SpanishAdjectiveAdverbFormationPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'word-formation',
              topic: 'adjective-adverb',
              title: 'Spanish Adjective to Adverb Formation - -mente Suffix Rules',
              description: 'Master Spanish adverb formation from adjectives using -mente suffix, irregular forms, and placement rules.',
              difficulty: 'intermediate',
              examples: [
                'rápido → rápidamente (quickly)',
                'fácil → fácilmente (easily)',
                'normal → normalmente (normally)',
                'feliz → felizmente (happily)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'word-formation',
              topic: 'adjective-adverb',
              title: 'Spanish Adjective to Adverb Formation - -mente Suffix Rules'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="word-formation"
        topic="adjective-adverb"
        title="Spanish Adjective to Adverb Formation - -mente Suffix Rules"
        description="Master Spanish adverb formation from adjectives using -mente suffix, irregular forms, and placement rules"
        difficulty="intermediate"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/spanish/word-formation"
        practiceUrl="/grammar/spanish/word-formation/adjective-adverb/practice"
        quizUrl="/grammar/spanish/word-formation/adjective-adverb/quiz"
        songUrl="/songs/es?theme=grammar&topic=adjective-adverb"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
