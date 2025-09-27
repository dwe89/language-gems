import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'adjectives',
  topic: 'indefinite',
  title: 'Spanish Indefinite Adjectives',
  description: 'Learn Spanish indefinite adjectives: todo, otro, cada, alguno, ninguno with comprehensive explanations, agreement rules, and practice.',
  difficulty: 'intermediate',
  keywords: [
    'spanish indefinite adjectives',
    'todo otro cada alguno ninguno',
    'spanish quantifiers',
    'indefinite determiners spanish',
    'spanish grammar adjectives',
    'quantifying adjectives spanish'
  ],
  examples: [
    'todo el día (all day)',
    'otra persona (another person)',
    'cada estudiante (each student)',
    'algún problema (some problem)'
  ]
});

const sections = [
  {
    title: 'What are Indefinite Adjectives?',
    content: `Spanish indefinite adjectives are words that refer to **non-specific** quantities, amounts, or identities. They help express concepts like "all," "another," "each," "some," or "no" without being precise about exactly what or how many.

These adjectives must agree with the gender and number of the noun they modify, and they're essential for expressing vague or general quantities in Spanish.`,
    examples: [
      {
        spanish: 'Todo estudiante debe estudiar.',
        english: 'Every student must study.',
        highlight: ['Todo']
      },
      {
        spanish: 'Necesito otra oportunidad.',
        english: 'I need another opportunity.',
        highlight: ['otra']
      },
      {
        spanish: 'Cada día es diferente.',
        english: 'Each day is different.',
        highlight: ['Cada']
      }
    ]
  },
  {
    title: 'Todo (All, Every, Whole)',
    content: `**Todo** means "all," "every," or "whole." It's one of the most versatile indefinite adjectives and agrees in gender and number with the noun it modifies.`,
    subsections: [
      {
        title: 'Forms of Todo',
        content: `Todo has four forms that agree with the noun:`,
        conjugationTable: {
          title: 'Todo Forms',
          conjugations: [
            { pronoun: 'Masculine singular', form: 'todo', english: 'all/every/whole (masc. sing.)' },
            { pronoun: 'Feminine singular', form: 'toda', english: 'all/every/whole (fem. sing.)' },
            { pronoun: 'Masculine plural', form: 'todos', english: 'all/every (masc. pl.)' },
            { pronoun: 'Feminine plural', form: 'todas', english: 'all/every (fem. pl.)' }
          ]
        },
        examples: [
          {
            spanish: 'todo el mundo',
            english: 'everybody, everyone',
            highlight: ['todo']
          },
          {
            spanish: 'toda la noche',
            english: 'all night',
            highlight: ['toda']
          },
          {
            spanish: 'todos los días',
            english: 'every day',
            highlight: ['todos']
          },
          {
            spanish: 'todas las semanas',
            english: 'every week',
            highlight: ['todas']
          }
        ]
      },
      {
        title: 'Usage with Articles',
        content: `**Todo** is usually followed by a definite article (el, la, los, las) when it means "all" or "whole":`,
        examples: [
          {
            spanish: 'Trabajé todo el día.',
            english: 'I worked all day.',
            highlight: ['todo el']
          },
          {
            spanish: 'Toda la clase estudió.',
            english: 'The whole class studied.',
            highlight: ['Toda la']
          },
          {
            spanish: 'Todos los estudiantes llegaron.',
            english: 'All the students arrived.',
            highlight: ['Todos los']
          }
        ]
      }
    ]
  },
  {
    title: 'Otro (Other, Another)',
    content: `**Otro** means "other" or "another." It never uses an indefinite article (un/una) before it - this is a common mistake for English speakers.`,
    subsections: [
      {
        title: 'Forms of Otro',
        content: `Otro agrees with the gender and number of the noun:`,
        conjugationTable: {
          title: 'Otro Forms',
          conjugations: [
            { pronoun: 'Masculine singular', form: 'otro', english: 'another/other (masc. sing.)' },
            { pronoun: 'Feminine singular', form: 'otra', english: 'another/other (fem. sing.)' },
            { pronoun: 'Masculine plural', form: 'otros', english: 'other (masc. pl.)' },
            { pronoun: 'Feminine plural', form: 'otras', english: 'other (fem. pl.)' }
          ]
        },
        examples: [
          {
            spanish: 'otro libro',
            english: 'another book',
            highlight: ['otro']
          },
          {
            spanish: 'otra vez',
            english: 'another time, again',
            highlight: ['otra']
          },
          {
            spanish: 'otros países',
            english: 'other countries',
            highlight: ['otros']
          },
          {
            spanish: 'otras personas',
            english: 'other people',
            highlight: ['otras']
          }
        ]
      },
      {
        title: 'Common Mistake with Otro',
        content: `⚠️ **Never use un/una with otro!**

❌ **Incorrect**: *un otro libro*
✅ **Correct**: **otro libro**

This is different from English, where we say "another book" (a + n + other).`,
        examples: [
          {
            spanish: 'Quiero otro café. (NOT: un otro café)',
            english: 'I want another coffee.',
            highlight: ['otro']
          },
          {
            spanish: 'Dime otra historia. (NOT: una otra historia)',
            english: 'Tell me another story.',
            highlight: ['otra']
          }
        ]
      }
    ]
  },
  {
    title: 'Cada (Each, Every)',
    content: `**Cada** means "each" or "every." Unlike other indefinite adjectives, **cada is invariable** - it never changes form regardless of gender or number.`,
    subsections: [
      {
        title: 'Cada - Invariable Form',
        content: `**Cada** is always the same, whether the noun is masculine, feminine, singular, or plural:`,
        examples: [
          {
            spanish: 'cada día',
            english: 'each/every day',
            highlight: ['cada']
          },
          {
            spanish: 'cada semana',
            english: 'each/every week',
            highlight: ['cada']
          },
          {
            spanish: 'cada dos horas',
            english: 'every two hours',
            highlight: ['cada']
          },
          {
            spanish: 'cada uno de nosotros',
            english: 'each one of us',
            highlight: ['cada']
          }
        ]
      },
      {
        title: 'Cada vs Todo',
        content: `**Cada** emphasizes individual items, while **todo** emphasizes the group as a whole:

**Cada** = emphasis on individual items
**Todo** = emphasis on the complete set`,
        examples: [
          {
            spanish: 'Cada estudiante tiene un libro.',
            english: 'Each student has a book. (individual focus)',
            highlight: ['Cada']
          },
          {
            spanish: 'Todos los estudiantes tienen libros.',
            english: 'All students have books. (group focus)',
            highlight: ['Todos']
          }
        ]
      }
    ]
  },
  {
    title: 'Alguno (Some, Any)',
    content: `**Alguno** means "some" or "any" in affirmative and interrogative sentences. It has special forms and undergoes **apocope** (shortening) before masculine singular nouns.`,
    subsections: [
      {
        title: 'Forms of Alguno',
        content: `Alguno agrees with gender and number, with a special shortened form:`,
        conjugationTable: {
          title: 'Alguno Forms',
          conjugations: [
            { pronoun: 'Masculine singular (before noun)', form: 'algún', english: 'some/any (masc. sing.)' },
            { pronoun: 'Masculine singular (standalone)', form: 'alguno', english: 'some/any (masc. sing.)' },
            { pronoun: 'Feminine singular', form: 'alguna', english: 'some/any (fem. sing.)' },
            { pronoun: 'Masculine plural', form: 'algunos', english: 'some/any (masc. pl.)' },
            { pronoun: 'Feminine plural', form: 'algunas', english: 'some/any (fem. pl.)' }
          ]
        },
        examples: [
          {
            spanish: 'algún día',
            english: 'some day',
            highlight: ['algún']
          },
          {
            spanish: 'alguna vez',
            english: 'sometime, ever',
            highlight: ['alguna']
          },
          {
            spanish: 'algunos libros',
            english: 'some books',
            highlight: ['algunos']
          },
          {
            spanish: 'algunas personas',
            english: 'some people',
            highlight: ['algunas']
          }
        ]
      },
      {
        title: 'Apocope with Algún',
        content: `Before masculine singular nouns, **alguno** becomes **algún** (loses the final -o):`,
        examples: [
          {
            spanish: 'Algún estudiante llamó.',
            english: 'Some student called.',
            highlight: ['Algún']
          },
          {
            spanish: '¿Tienes algún problema?',
            english: 'Do you have any problem?',
            highlight: ['algún']
          },
          {
            spanish: 'En algún momento lo haré.',
            english: 'At some point I\'ll do it.',
            highlight: ['algún']
          }
        ]
      }
    ]
  },
  {
    title: 'Ninguno (No, Not Any, None)',
    content: `**Ninguno** means "no," "not any," or "none." It's the negative counterpart of **alguno** and also undergoes apocope before masculine singular nouns.`,
    subsections: [
      {
        title: 'Forms of Ninguno',
        content: `Ninguno follows the same patterns as alguno:`,
        conjugationTable: {
          title: 'Ninguno Forms',
          conjugations: [
            { pronoun: 'Masculine singular (before noun)', form: 'ningún', english: 'no/not any (masc. sing.)' },
            { pronoun: 'Masculine singular (standalone)', form: 'ninguno', english: 'no/not any (masc. sing.)' },
            { pronoun: 'Feminine singular', form: 'ninguna', english: 'no/not any (fem. sing.)' },
            { pronoun: 'Masculine plural', form: 'ningunos', english: 'no/not any (masc. pl.)' },
            { pronoun: 'Feminine plural', form: 'ningunas', english: 'no/not any (fem. pl.)' }
          ]
        },
        examples: [
          {
            spanish: 'No tengo ningún problema.',
            english: 'I don\'t have any problem.',
            highlight: ['ningún']
          },
          {
            spanish: 'Ninguna persona vino.',
            english: 'No person came.',
            highlight: ['Ninguna']
          },
          {
            spanish: 'No hay ningunos libros aquí.',
            english: 'There are no books here.',
            highlight: ['ningunos']
          }
        ]
      },
      {
        title: 'Double Negative with Ninguno',
        content: `In Spanish, **ninguno** is used with the negative **no** to create a double negative, which is grammatically correct:`,
        examples: [
          {
            spanish: 'No vi a ningún estudiante.',
            english: 'I didn\'t see any student.',
            highlight: ['No', 'ningún']
          },
          {
            spanish: 'No tengo ninguna pregunta.',
            english: 'I don\'t have any questions.',
            highlight: ['No', 'ninguna']
          },
          {
            spanish: 'Ninguno de ellos vino.',
            english: 'None of them came. (no "no" needed when ninguno starts the sentence)',
            highlight: ['Ninguno']
          }
        ]
      }
    ]
  },
  {
    title: 'Summary and Usage Tips',
    content: `Here's a quick reference for using indefinite adjectives correctly:

**Agreement Rules:**
- Todo, otro, alguno, ninguno: agree in gender and number
- Cada: invariable (never changes)

**Special Forms:**
- Alguno → algún (before masculine singular nouns)
- Ninguno → ningún (before masculine singular nouns)

**Common Expressions:**`,
    examples: [
      {
        spanish: 'todo el tiempo (all the time)',
        english: 'all the time',
        highlight: ['todo']
      },
      {
        spanish: 'otra vez (again)',
        english: 'again',
        highlight: ['otra']
      },
      {
        spanish: 'cada vez más (more and more)',
        english: 'more and more',
        highlight: ['cada']
      },
      {
        spanish: 'alguna vez (ever, sometime)',
        english: 'ever, sometime',
        highlight: ['alguna']
      },
      {
        spanish: 'de ninguna manera (no way)',
        english: 'no way',
        highlight: ['ninguna']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Demonstrative Adjectives', url: '/grammar/spanish/adjectives/demonstrative', difficulty: 'beginner' },
  { title: 'Possessive Adjectives', url: '/grammar/spanish/adjectives/possessive', difficulty: 'beginner' },
  { title: 'Adjective Agreement', url: '/grammar/spanish/adjectives/agreement', difficulty: 'beginner' },
  { title: 'Articles', url: '/grammar/spanish/articles/definite-indefinite', difficulty: 'beginner' }
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
              category: 'adjectives',
              topic: 'indefinite',
              title: 'Spanish Indefinite Adjectives',
              description: 'Learn Spanish indefinite adjectives with comprehensive explanations and practice.',
              difficulty: 'intermediate',
              examples: [
                'todo el día (all day)',
                'otra persona (another person)',
                'cada estudiante (each student)',
                'algún problema (some problem)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'adjectives',
              topic: 'indefinite',
              title: 'Spanish Indefinite Adjectives'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="adjectives"
        topic="indefinite"
        title="Spanish Indefinite Adjectives"
        description="Learn Spanish indefinite adjectives: todo, otro, cada, alguno, ninguno"
        difficulty="intermediate"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/spanish/adjectives"
        practiceUrl="/grammar/spanish/adjectives/indefinite/practice"
        quizUrl="/grammar/spanish/adjectives/indefinite/quiz"
        songUrl="/songs/es?theme=grammar&topic=indefinite-adjectives"
        youtubeVideoId=""
        relatedTopics={relatedTopics}
      />
    </>
  );
}