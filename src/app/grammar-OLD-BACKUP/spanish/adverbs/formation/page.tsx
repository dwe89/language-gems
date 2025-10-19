import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'adverbs',
  topic: 'formation',
  title: 'Spanish Adverb Formation (-mente Adverbs, Irregular Forms, Usage)',
  description: 'Master Spanish adverb formation including -mente adverbs, irregular adverbs, placement rules, and usage patterns.',
  difficulty: 'intermediate',
  keywords: [
    'spanish adverb formation',
    'mente adverbs spanish',
    'spanish adverbs rules',
    'adverb placement spanish',
    'irregular adverbs spanish',
    'spanish adverb endings'
  ],
  examples: [
    'rápidamente (quickly)',
    'fácilmente (easily)',
    'claramente (clearly)',
    'bien (well), mal (badly)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Adverb Formation',
    content: `Spanish adverbs (adverbios) **modify verbs**, **adjectives**, or **other adverbs** to express **manner**, **time**, **place**, **quantity**, or **degree**. Most Spanish adverbs are formed by **adding -mente** to adjectives.

**Types of Spanish adverbs:**
- **-mente adverbs**: Formed from adjectives (rápido → rápidamente)
- **Irregular adverbs**: Don't follow the -mente pattern (bien, mal)
- **Adverbial phrases**: Multiple words functioning as adverbs (de vez en cuando)
- **Invariable words**: Words that are always adverbs (aquí, allí, hoy)

**Formation rules:**
- **Feminine adjective + -mente**: rápida → rápidamente
- **Adjectives ending in -e or consonant + -mente**: fácil → fácilmente
- **Accent preservation**: If adjective has accent, adverb keeps it
- **Agreement**: Adverbs don't change form (no gender/number agreement)

**Key characteristics:**
- **Modify meaning**: Change how, when, where, or to what degree
- **Flexible placement**: Can appear in different sentence positions
- **No agreement**: Unlike adjectives, adverbs don't agree with anything
- **Essential for fluency**: Required for natural, precise Spanish

Understanding adverb formation is **crucial** for **expressing nuanced meaning** and **achieving fluent Spanish communication**.`,
    examples: [
      {
        spanish: 'Habla rápidamente. (He speaks quickly.) - Manner',
        english: 'Viene frecuentemente. (He comes frequently.) - Frequency',
        highlight: ['rápidamente', 'frecuentemente']
      },
      {
        spanish: 'Está muy cansado. (He is very tired.) - Degree',
        english: 'Trabaja bien. (He works well.) - Manner',
        highlight: ['muy cansado', 'bien']
      },
      {
        spanish: 'Llegó tarde ayer. (He arrived late yesterday.) - Time',
        english: 'Vive aquí ahora. (He lives here now.) - Place + Time',
        highlight: ['tarde ayer', 'aquí ahora']
      }
    ]
  },
  {
    title: 'Formation: -MENTE Adverbs',
    content: `**Most Spanish adverbs** are formed by adding **-mente** to the **feminine form** of adjectives:`,
    conjugationTable: {
      title: 'Adjective to Adverb Formation',
      conjugations: [
        { pronoun: 'rápido/rápida', form: 'rápidamente', english: 'quickly' },
        { pronoun: 'lento/lenta', form: 'lentamente', english: 'slowly' },
        { pronoun: 'claro/clara', form: 'claramente', english: 'clearly' },
        { pronoun: 'perfecto/perfecta', form: 'perfectamente', english: 'perfectly' },
        { pronoun: 'completo/completa', form: 'completamente', english: 'completely' },
        { pronoun: 'directo/directa', form: 'directamente', english: 'directly' }
      ]
    },
    examples: [
      {
        spanish: 'Habla claramente. (He speaks clearly.)',
        english: 'Trabaja lentamente. (He works slowly.)',
        highlight: ['claramente', 'lentamente']
      },
      {
        spanish: 'Lo entiendo perfectamente. (I understand it perfectly.)',
        english: 'Llegó directamente a casa. (He went directly home.)',
        highlight: ['perfectamente', 'directamente']
      }
    ],
    subsections: [
      {
        title: 'Formation Rule',
        content: 'Always use feminine form + -mente:',
        examples: [
          {
            spanish: 'rápido → rápida → rápidamente',
            english: 'lento → lenta → lentamente',
            highlight: ['rápida → rápidamente', 'lenta → lentamente']
          }
        ]
      }
    ]
  },
  {
    title: 'Formation: Adjectives Ending in -E or Consonant',
    content: `**Adjectives ending in -e or consonant** add **-mente directly**:`,
    conjugationTable: {
      title: 'Adjectives Ending in -E or Consonant',
      conjugations: [
        { pronoun: 'fácil', form: 'fácilmente', english: 'easily' },
        { pronoun: 'difícil', form: 'difícilmente', english: 'with difficulty' },
        { pronoun: 'simple', form: 'simplemente', english: 'simply' },
        { pronoun: 'frecuente', form: 'frecuentemente', english: 'frequently' },
        { pronoun: 'elegante', form: 'elegantemente', english: 'elegantly' },
        { pronoun: 'normal', form: 'normalmente', english: 'normally' }
      ]
    },
    examples: [
      {
        spanish: 'Resuelve los problemas fácilmente. (He solves problems easily.)',
        english: 'Viene frecuentemente a visitarnos. (He comes frequently to visit us.)',
        highlight: ['fácilmente', 'frecuentemente']
      },
      {
        spanish: 'Se viste elegantemente. (She dresses elegantly.)',
        english: 'Normalmente llego temprano. (I normally arrive early.)',
        highlight: ['elegantemente', 'Normalmente']
      }
    ]
  },
  {
    title: 'Accent Preservation in -MENTE Adverbs',
    content: `**If the adjective has an accent**, the **adverb keeps it**:`,
    conjugationTable: {
      title: 'Accent Preservation',
      conjugations: [
        { pronoun: 'rápido/rápida', form: 'rápidamente', english: 'quickly (keeps accent)' },
        { pronoun: 'fácil', form: 'fácilmente', english: 'easily (keeps accent)' },
        { pronoun: 'difícil', form: 'difícilmente', english: 'with difficulty (keeps accent)' },
        { pronoun: 'típico/típica', form: 'típicamente', english: 'typically (keeps accent)' },
        { pronoun: 'lógico/lógica', form: 'lógicamente', english: 'logically (keeps accent)' },
        { pronoun: 'práctico/práctica', form: 'prácticamente', english: 'practically (keeps accent)' }
      ]
    },
    examples: [
      {
        spanish: 'Habla muy rápidamente. (He speaks very quickly.)',
        english: 'Típicamente llega tarde. (He typically arrives late.)',
        highlight: ['rápidamente', 'Típicamente']
      }
    ]
  },
  {
    title: 'Irregular Adverbs',
    content: `**Some common adverbs** don't follow the **-mente pattern**:`,
    conjugationTable: {
      title: 'Common Irregular Adverbs',
      conjugations: [
        { pronoun: 'bien', form: 'well', english: 'Habla bien español. (He speaks Spanish well.)' },
        { pronoun: 'mal', form: 'badly', english: 'Canta mal. (He sings badly.)' },
        { pronoun: 'mejor', form: 'better', english: 'Ahora habla mejor. (Now he speaks better.)' },
        { pronoun: 'peor', form: 'worse', english: 'Hoy me siento peor. (Today I feel worse.)' },
        { pronoun: 'mucho', form: 'a lot, much', english: 'Trabaja mucho. (He works a lot.)' },
        { pronoun: 'poco', form: 'little, not much', english: 'Duerme poco. (He sleeps little.)' }
      ]
    },
    examples: [
      {
        spanish: 'Cocina muy bien. (She cooks very well.)',
        english: 'Conduce mal. (He drives badly.)',
        highlight: ['muy bien', 'mal']
      },
      {
        spanish: 'Ahora entiendo mejor. (Now I understand better.)',
        english: 'Hoy me siento peor. (Today I feel worse.)',
        highlight: ['mejor', 'peor']
      }
    ]
  },
  {
    title: 'Adverbs of Time',
    content: `**Time adverbs** indicate **when** something happens:`,
    conjugationTable: {
      title: 'Common Time Adverbs',
      conjugations: [
        { pronoun: 'hoy', form: 'today', english: 'Hoy trabajo. (Today I work.)' },
        { pronoun: 'ayer', form: 'yesterday', english: 'Ayer estudié. (Yesterday I studied.)' },
        { pronoun: 'mañana', form: 'tomorrow', english: 'Mañana viajo. (Tomorrow I travel.)' },
        { pronoun: 'ahora', form: 'now', english: 'Ahora estudio. (Now I study.)' },
        { pronoun: 'antes', form: 'before', english: 'Antes vivía aquí. (Before I lived here.)' },
        { pronoun: 'después', form: 'after', english: 'Después comemos. (After we eat.)' }
      ]
    },
    examples: [
      {
        spanish: 'Ayer llegué tarde, hoy llego temprano. (Yesterday I arrived late, today I arrive early.)',
        english: 'Antes estudiaba poco, ahora estudio mucho. (Before I studied little, now I study a lot.)',
        highlight: ['Ayer', 'hoy', 'Antes', 'ahora']
      }
    ]
  },
  {
    title: 'Adverbs of Place',
    content: `**Place adverbs** indicate **where** something happens:`,
    conjugationTable: {
      title: 'Common Place Adverbs',
      conjugations: [
        { pronoun: 'aquí', form: 'here', english: 'Vivo aquí. (I live here.)' },
        { pronoun: 'ahí', form: 'there (near you)', english: 'Está ahí. (It\'s there.)' },
        { pronoun: 'allí/allá', form: 'there (far)', english: 'Vive allí. (He lives there.)' },
        { pronoun: 'arriba', form: 'up, upstairs', english: 'Está arriba. (It\'s upstairs.)' },
        { pronoun: 'abajo', form: 'down, downstairs', english: 'Vive abajo. (He lives downstairs.)' },
        { pronoun: 'cerca', form: 'near', english: 'Está cerca. (It\'s near.)' }
      ]
    },
    examples: [
      {
        spanish: 'Ven aquí, por favor. (Come here, please.)',
        english: 'Mi oficina está arriba. (My office is upstairs.)',
        highlight: ['aquí', 'arriba']
      }
    ]
  },
  {
    title: 'Adverbs of Quantity',
    content: `**Quantity adverbs** indicate **how much** or **to what degree**:`,
    conjugationTable: {
      title: 'Common Quantity Adverbs',
      conjugations: [
        { pronoun: 'muy', form: 'very', english: 'Está muy cansado. (He is very tired.)' },
        { pronoun: 'mucho', form: 'a lot, much', english: 'Trabaja mucho. (He works a lot.)' },
        { pronoun: 'poco', form: 'little, not much', english: 'Come poco. (He eats little.)' },
        { pronoun: 'bastante', form: 'quite, enough', english: 'Es bastante difícil. (It\'s quite difficult.)' },
        { pronoun: 'demasiado', form: 'too much', english: 'Habla demasiado. (He talks too much.)' },
        { pronoun: 'nada', form: 'not at all', english: 'No es nada fácil. (It\'s not easy at all.)' }
      ]
    },
    examples: [
      {
        spanish: 'Está muy contento. (He is very happy.)',
        english: 'Estudia bastante. (He studies quite a bit.)',
        highlight: ['muy contento', 'bastante']
      }
    ]
  },
  {
    title: 'Adverb Placement Rules',
    content: `**Adverb placement** in Spanish sentences:`,
    examples: [
      {
        spanish: 'AFTER VERB: Habla claramente. (He speaks clearly.)',
        english: 'BEFORE ADJECTIVE: Está muy cansado. (He is very tired.)',
        highlight: ['Habla claramente', 'muy cansado']
      },
      {
        spanish: 'BEGINNING OF SENTENCE: Normalmente llego temprano. (I normally arrive early.)',
        english: 'END OF SENTENCE: Viene a visitarnos frecuentemente. (He comes to visit us frequently.)',
        highlight: ['Normalmente llego', 'frecuentemente']
      }
    ],
    subsections: [
      {
        title: 'Flexibility',
        content: 'Adverbs can often move for emphasis:',
        examples: [
          {
            spanish: 'Rápidamente terminó el trabajo. (He quickly finished the work.)',
            english: 'Terminó rápidamente el trabajo. (He finished the work quickly.)',
            highlight: ['Rápidamente terminó', 'terminó rápidamente']
          }
        ]
      }
    ]
  },
  {
    title: 'Multiple -MENTE Adverbs',
    content: `**When using multiple -mente adverbs**, only the **last one** gets **-mente**:`,
    examples: [
      {
        spanish: 'Habla clara y lentamente. (He speaks clearly and slowly.)',
        english: 'Trabaja rápida y eficientemente. (He works quickly and efficiently.)',
        highlight: ['clara y lentamente', 'rápida y eficientemente']
      },
      {
        spanish: 'Se expresa simple, clara y directamente. (He expresses himself simply, clearly, and directly.)',
        english: 'Only the last adverb gets -mente',
        highlight: ['simple, clara y directamente']
      }
    ]
  },
  {
    title: 'Adverbial Phrases',
    content: `**Phrases that function as adverbs**:`,
    conjugationTable: {
      title: 'Common Adverbial Phrases',
      conjugations: [
        { pronoun: 'de vez en cuando', form: 'from time to time', english: 'De vez en cuando voy al cine.' },
        { pronoun: 'a menudo', form: 'often', english: 'A menudo llega tarde.' },
        { pronoun: 'de repente', form: 'suddenly', english: 'De repente empezó a llover.' },
        { pronoun: 'poco a poco', form: 'little by little', english: 'Poco a poco aprendo español.' },
        { pronoun: 'en seguida', form: 'right away', english: 'En seguida vengo.' },
        { pronoun: 'por lo general', form: 'generally', english: 'Por lo general llego temprano.' }
      ]
    },
    examples: [
      {
        spanish: 'De vez en cuando vamos al teatro. (From time to time we go to the theater.)',
        english: 'Por lo general como en casa. (I generally eat at home.)',
        highlight: ['De vez en cuando', 'Por lo general']
      }
    ]
  },
  {
    title: 'Comparative and Superlative Adverbs',
    content: `**Comparing adverbs** in Spanish:`,
    examples: [
      {
        spanish: 'COMPARATIVE: Habla más claramente que antes. (He speaks more clearly than before.)',
        english: 'SUPERLATIVE: Habla lo más claramente posible. (He speaks as clearly as possible.)',
        highlight: ['más claramente que', 'lo más claramente posible']
      },
      {
        spanish: 'Trabaja menos rápidamente. (He works less quickly.)',
        english: 'Corre tan rápidamente como tú. (He runs as quickly as you.)',
        highlight: ['menos rápidamente', 'tan rápidamente como']
      }
    ]
  },
  {
    title: 'Common Mistakes with Adverbs',
    content: `Here are frequent errors students make:

**1. Wrong formation**: Using masculine instead of feminine form
**2. Missing accents**: Not preserving accents from adjectives
**3. Wrong placement**: Incorrect adverb position in sentence
**4. Overusing -mente**: Using -mente when irregular form exists`,
    examples: [
      {
        spanish: '❌ rápido + mente → ✅ rápida + mente = rápidamente',
        english: 'Wrong: must use feminine form of adjective',
        highlight: ['rápidamente']
      },
      {
        spanish: '❌ facilmente → ✅ fácilmente',
        english: 'Wrong: must preserve accent from adjective',
        highlight: ['fácilmente']
      },
      {
        spanish: '❌ Muy habla bien → ✅ Habla muy bien',
        english: 'Wrong: MUY modifies adjectives/adverbs, not verbs',
        highlight: ['Habla muy bien']
      },
      {
        spanish: '❌ buenamente → ✅ bien',
        english: 'Wrong: use irregular form BIEN, not buenamente',
        highlight: ['bien']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Adjectives', url: '/grammar/spanish/adjectives/agreement', difficulty: 'beginner' },
  { title: 'Spanish Comparative Forms', url: '/grammar/spanish/adjectives/comparison', difficulty: 'intermediate' },
  { title: 'Spanish Prepositions', url: '/grammar/spanish/prepositions/basic-prepositions', difficulty: 'intermediate' },
  { title: 'Spanish Adjective Position', url: '/grammar/spanish/adjectives/position', difficulty: 'beginner' }
];

export default function SpanishAdverbFormationPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'adverbs',
              topic: 'formation',
              title: 'Spanish Adverb Formation (-mente Adverbs, Irregular Forms, Usage)',
              description: 'Master Spanish adverb formation including -mente adverbs, irregular adverbs, placement rules, and usage patterns.',
              difficulty: 'intermediate',
              examples: [
                'rápidamente (quickly)',
                'fácilmente (easily)',
                'claramente (clearly)',
                'bien (well), mal (badly)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'adverbs',
              topic: 'formation',
              title: 'Spanish Adverb Formation (-mente Adverbs, Irregular Forms, Usage)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="adverbs"
        topic="formation"
        title="Spanish Adverb Formation (-mente Adverbs, Irregular Forms, Usage)"
        description="Master Spanish adverb formation including -mente adverbs, irregular adverbs, placement rules, and usage patterns"
        difficulty="intermediate"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/spanish/adverbs"
        practiceUrl="/grammar/spanish/adverbs/formation/practice"
        quizUrl="/grammar/spanish/adverbs/formation/quiz"
        songUrl="/songs/es?theme=grammar&topic=formation"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
