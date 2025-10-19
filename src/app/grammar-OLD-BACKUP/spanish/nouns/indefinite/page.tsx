import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'nouns',
  topic: 'indefinite',
  title: 'Spanish Indefinite Adjectives - Algún, Ningún, Cualquier',
  description: 'Master Spanish indefinite adjectives including algún/alguna, ningún/ninguna, cualquier, and otros with usage rules.',
  difficulty: 'intermediate',
  keywords: [
    'spanish indefinite adjectives',
    'algun ningun spanish',
    'cualquier spanish grammar',
    'spanish indefinite determiners',
    'otro mucho poco spanish'
  ],
  examples: [
    'Algún día iré a España. (Some day I will go to Spain.)',
    'No tengo ninguna idea. (I have no idea.)',
    'Cualquier persona puede hacerlo. (Any person can do it.)',
    'Otros estudiantes llegaron tarde. (Other students arrived late.)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Indefinite Adjectives',
    content: `Spanish **indefinite adjectives** (adjetivos indefinidos) express **indefinite quantity, identity, or degree**. They modify nouns without specifying exact amounts or specific identity.

**Main categories:**
- **Quantity**: algún/alguna (some), ningún/ninguna (no/none)
- **Identity**: cualquier (any), otro/otra (other)
- **Amount**: mucho/mucha (much/many), poco/poca (little/few)
- **Totality**: todo/toda (all), cada (each)

**Key features:**
- **Gender agreement**: Most agree with noun gender
- **Number agreement**: Singular/plural forms
- **Position**: Usually before the noun
- **Meaning changes**: Position can affect meaning

**Why indefinite adjectives matter:**
- **Express uncertainty**: Vague quantities and identity
- **Natural communication**: Essential for everyday Spanish
- **Nuanced meaning**: Add precision to descriptions
- **Advanced grammar**: Mark intermediate proficiency

Understanding indefinite adjectives is **crucial** for **natural Spanish expression**.`,
    examples: [
      {
        spanish: 'QUANTITY: Tengo algunos libros. (I have some books.)',
        english: 'IDENTITY: Cualquier día es bueno. (Any day is good.)',
        highlight: ['algunos libros', 'Cualquier día']
      },
      {
        spanish: 'NEGATION: No hay ningún problema. (There is no problem.)',
        english: 'OTHER: Otros estudiantes vinieron. (Other students came.)',
        highlight: ['ningún problema', 'Otros estudiantes']
      }
    ]
  },
  {
    title: 'Algún/Alguna/Algunos/Algunas (Some)',
    content: `**Algún** expresses **indefinite positive quantity**:`,
    conjugationTable: {
      title: 'Forms of Algún',
      conjugations: [
        { pronoun: 'algún', form: 'masculine singular', english: 'algún día (some day)' },
        { pronoun: 'alguna', form: 'feminine singular', english: 'alguna vez (sometime)' },
        { pronoun: 'algunos', form: 'masculine plural', english: 'algunos libros (some books)' },
        { pronoun: 'algunas', form: 'feminine plural', english: 'algunas personas (some people)' }
      ]
    },
    examples: [
      {
        spanish: 'SINGULAR: Algún estudiante llamó. (Some student called.)',
        english: 'PLURAL: Algunos profesores llegaron. (Some teachers arrived.)',
        highlight: ['Algún estudiante', 'Algunos profesores']
      },
      {
        spanish: 'FEMININE: Alguna respuesta será correcta. (Some answer will be correct.)',
        english: 'TIME: Alguna vez iré a México. (Sometime I will go to Mexico.)',
        highlight: ['Alguna respuesta', 'Alguna vez']
      }
    ],
    subsections: [
      {
        title: 'Apocopation',
        content: 'Alguno → algún before masculine singular nouns:',
        examples: [
          {
            spanish: '✅ algún hombre, algún problema',
            english: '❌ alguno hombre (incorrect)',
            highlight: ['algún hombre']
          }
        ]
      }
    ]
  },
  {
    title: 'Ningún/Ninguna (No, None)',
    content: `**Ningún** expresses **complete negation**:`,
    conjugationTable: {
      title: 'Forms of Ningún',
      conjugations: [
        { pronoun: 'ningún', form: 'masculine singular', english: 'ningún problema (no problem)' },
        { pronoun: 'ninguna', form: 'feminine singular', english: 'ninguna idea (no idea)' },
        { pronoun: 'ningunos', form: 'masculine plural (rare)', english: 'ningunos libros (no books)' },
        { pronoun: 'ningunas', form: 'feminine plural (rare)', english: 'ningunas personas (no people)' }
      ]
    },
    examples: [
      {
        spanish: 'NEGATION: No tengo ningún dinero. (I have no money.)',
        english: 'FEMININE: No hay ninguna solución. (There is no solution.)',
        highlight: ['ningún dinero', 'ninguna solución']
      },
      {
        spanish: 'DOUBLE NEGATIVE: No vino ningún estudiante. (No student came.)',
        english: 'EMPHASIS: Ninguna persona lo sabe. (No person knows it.)',
        highlight: ['ningún estudiante', 'Ninguna persona']
      }
    ],
    subsections: [
      {
        title: 'Usage Notes',
        content: 'Ningún is usually singular; plural forms are rare in modern Spanish.',
        examples: [
          {
            spanish: 'STANDARD: No hay ningún libro. (There are no books.)',
            english: 'RARE: No hay ningunos libros.',
            highlight: ['ningún libro']
          }
        ]
      }
    ]
  },
  {
    title: 'Cualquier/Cualquiera (Any)',
    content: `**Cualquier** means **any** (without restriction):`,
    conjugationTable: {
      title: 'Forms of Cualquier',
      conjugations: [
        { pronoun: 'cualquier', form: 'before noun (any gender)', english: 'cualquier día (any day)' },
        { pronoun: 'cualquiera', form: 'after noun/standalone', english: 'un día cualquiera (any day)' },
        { pronoun: 'cualesquiera', form: 'plural (formal)', english: 'cualesquiera libros (any books)' }
      ]
    },
    examples: [
      {
        spanish: 'BEFORE NOUN: Cualquier persona puede venir. (Any person can come.)',
        english: 'AFTER NOUN: Una persona cualquiera. (Any person at all.)',
        highlight: ['Cualquier persona', 'persona cualquiera']
      },
      {
        spanish: 'CHOICE: Elige cualquier color. (Choose any color.)',
        english: 'TIME: En cualquier momento. (At any moment.)',
        highlight: ['cualquier color', 'cualquier momento']
      }
    ]
  },
  {
    title: 'Otro/Otra/Otros/Otras (Other, Another)',
    content: `**Otro** means **other** or **another**:`,
    conjugationTable: {
      title: 'Forms of Otro',
      conjugations: [
        { pronoun: 'otro', form: 'masculine singular', english: 'otro libro (another book)' },
        { pronoun: 'otra', form: 'feminine singular', english: 'otra vez (another time)' },
        { pronoun: 'otros', form: 'masculine plural', english: 'otros estudiantes (other students)' },
        { pronoun: 'otras', form: 'feminine plural', english: 'otras ideas (other ideas)' }
      ]
    },
    examples: [
      {
        spanish: 'ANOTHER: Quiero otro café. (I want another coffee.)',
        english: 'OTHER: Los otros estudiantes llegaron. (The other students arrived.)',
        highlight: ['otro café', 'otros estudiantes']
      },
      {
        spanish: 'FEMININE: Otra oportunidad vendrá. (Another opportunity will come.)',
        english: 'PLURAL: Otras personas piensan diferente. (Other people think differently.)',
        highlight: ['Otra oportunidad', 'Otras personas']
      }
    ],
    subsections: [
      {
        title: 'No Article',
        content: 'Otro never uses indefinite article un/una:',
        examples: [
          {
            spanish: '✅ otro libro (another book)',
            english: '❌ un otro libro (incorrect)',
            highlight: ['otro libro']
          }
        ]
      }
    ]
  },
  {
    title: 'Mucho/Poco (Much/Many, Little/Few)',
    content: `**Mucho** and **poco** express **quantity**:`,
    conjugationTable: {
      title: 'Quantity Adjectives',
      conjugations: [
        { pronoun: 'mucho/a/os/as', form: 'much, many', english: 'mucha gente (many people)' },
        { pronoun: 'poco/a/os/as', form: 'little, few', english: 'poco tiempo (little time)' },
        { pronoun: 'demasiado/a/os/as', form: 'too much/many', english: 'demasiado trabajo (too much work)' },
        { pronoun: 'bastante/s', form: 'enough, quite a lot', english: 'bastante dinero (enough money)' }
      ]
    },
    examples: [
      {
        spanish: 'MUCH: Tengo mucho trabajo. (I have a lot of work.)',
        english: 'LITTLE: Hay poco tiempo. (There is little time.)',
        highlight: ['mucho trabajo', 'poco tiempo']
      },
      {
        spanish: 'MANY: Muchas personas vinieron. (Many people came.)',
        english: 'FEW: Pocas oportunidades quedan. (Few opportunities remain.)',
        highlight: ['Muchas personas', 'Pocas oportunidades']
      }
    ]
  },
  {
    title: 'Todo/Toda/Todos/Todas (All, Every)',
    content: `**Todo** expresses **totality**:`,
    conjugationTable: {
      title: 'Forms of Todo',
      conjugations: [
        { pronoun: 'todo', form: 'masculine singular', english: 'todo el día (all day)' },
        { pronoun: 'toda', form: 'feminine singular', english: 'toda la noche (all night)' },
        { pronoun: 'todos', form: 'masculine plural', english: 'todos los días (every day)' },
        { pronoun: 'todas', form: 'feminine plural', english: 'todas las semanas (every week)' }
      ]
    },
    examples: [
      {
        spanish: 'ALL: Todo el mundo lo sabe. (Everyone knows it.)',
        english: 'EVERY: Todos los días estudio. (Every day I study.)',
        highlight: ['Todo el mundo', 'Todos los días']
      },
      {
        spanish: 'FEMININE: Toda la familia vino. (All the family came.)',
        english: 'PLURAL F: Todas las respuestas son correctas. (All the answers are correct.)',
        highlight: ['Toda la familia', 'Todas las respuestas']
      }
    ]
  },
  {
    title: 'Cada (Each, Every)',
    content: `**Cada** is **invariable** and means **each/every**:`,
    examples: [
      {
        spanish: 'EACH: Cada estudiante tiene un libro. (Each student has a book.)',
        english: 'EVERY: Cada día aprendo algo nuevo. (Every day I learn something new.)',
        highlight: ['Cada estudiante', 'Cada día']
      },
      {
        spanish: 'FREQUENCY: Cada dos horas. (Every two hours.)',
        english: 'DISTRIBUTION: Cada uno tiene su opinión. (Each one has their opinion.)',
        highlight: ['Cada dos horas', 'Cada uno']
      }
    ],
    subsections: [
      {
        title: 'Invariable Form',
        content: 'Cada never changes form - no gender or number agreement:',
        examples: [
          {
            spanish: '✅ cada hombre, cada mujer, cada día',
            english: '❌ cadas, cada (always the same)',
            highlight: ['cada hombre']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong agreement**: Not matching gender/number
**2. Article errors**: Using articles with otro
**3. Apocopation**: Not shortening alguno/ninguno
**4. Position**: Wrong placement of indefinite adjectives`,
    examples: [
      {
        spanish: '❌ alguno día → ✅ algún día',
        english: 'Wrong: must use apocopated form before masculine singular',
        highlight: ['algún día']
      },
      {
        spanish: '❌ un otro libro → ✅ otro libro',
        english: 'Wrong: otro never uses indefinite article',
        highlight: ['otro libro']
      },
      {
        spanish: '❌ mucho personas → ✅ muchas personas',
        english: 'Wrong: must agree in gender and number',
        highlight: ['muchas personas']
      },
      {
        spanish: '❌ cadas días → ✅ cada día',
        english: 'Wrong: cada is invariable',
        highlight: ['cada día']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Demonstrative Adjectives', url: '/grammar/spanish/nouns/demonstrative', difficulty: 'beginner' },
  { title: 'Spanish Possessive Adjectives', url: '/grammar/spanish/adjectives/possessive', difficulty: 'beginner' },
  { title: 'Spanish Articles', url: '/grammar/spanish/nouns/articles', difficulty: 'beginner' },
  { title: 'Spanish Adjective Agreement', url: '/grammar/spanish/adjectives/agreement', difficulty: 'beginner' }
];

export default function SpanishIndefiniteAdjectivesPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'nouns',
              topic: 'indefinite',
              title: 'Spanish Indefinite Adjectives - Algún, Ningún, Cualquier',
              description: 'Master Spanish indefinite adjectives including algún/alguna, ningún/ninguna, cualquier, and otros with usage rules.',
              difficulty: 'intermediate',
              examples: [
                'Algún día iré a España. (Some day I will go to Spain.)',
                'No tengo ninguna idea. (I have no idea.)',
                'Cualquier persona puede hacerlo. (Any person can do it.)',
                'Otros estudiantes llegaron tarde. (Other students arrived late.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'nouns',
              topic: 'indefinite',
              title: 'Spanish Indefinite Adjectives - Algún, Ningún, Cualquier'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="nouns"
        topic="indefinite"
        title="Spanish Indefinite Adjectives - Algún, Ningún, Cualquier"
        description="Master Spanish indefinite adjectives including algún/alguna, ningún/ninguna, cualquier, and otros with usage rules"
        difficulty="intermediate"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/spanish/nouns"
        practiceUrl="/grammar/spanish/nouns/indefinite/practice"
        quizUrl="/grammar/spanish/nouns/indefinite/quiz"
        songUrl="/songs/es?theme=grammar&topic=indefinite"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
