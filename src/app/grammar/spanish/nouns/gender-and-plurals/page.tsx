import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'nouns',
  topic: 'gender-and-plurals',
  title: 'Spanish Noun Gender and Plurals',
  description: 'Master Spanish noun gender rules and plural formation with comprehensive explanations, patterns, and practice exercises.',
  difficulty: 'beginner',
  keywords: [
    'spanish noun gender',
    'spanish plurals',
    'masculine feminine nouns',
    'plural formation spanish',
    'gender rules spanish',
    'el la los las',
    'spanish noun endings'
  ],
  examples: [
    'el libro → los libros (the book → the books)',
    'la mesa → las mesas (the table → the tables)',
    'el lápiz → los lápices (the pencil → the pencils)'
  ]
});

const sections = [
  {
    title: 'Spanish Noun Gender',
    content: `Every Spanish noun has a **grammatical gender** - it's either **masculine** or **feminine**. This isn't related to biological sex; it's a grammatical property that affects the articles, adjectives, and pronouns used with the noun.

Understanding noun gender is essential because it determines which articles and adjective forms to use. While there are patterns, some nouns must be memorized with their gender.`,
    subsections: [
      {
        title: 'Masculine Nouns (-o endings)',
        content: `Most nouns ending in **-o** are masculine and use **el** (the) and **un** (a/an):`,
        examples: [
          {
            spanish: 'el libro',
            english: 'the book',
            highlight: ['libro']
          },
          {
            spanish: 'un carro',
            english: 'a car',
            highlight: ['carro']
          },
          {
            spanish: 'el dinero',
            english: 'the money',
            highlight: ['dinero']
          }
        ]
      },
      {
        title: 'Feminine Nouns (-a endings)',
        content: `Most nouns ending in **-a** are feminine and use **la** (the) and **una** (a/an):`,
        examples: [
          {
            spanish: 'la mesa',
            english: 'the table',
            highlight: ['mesa']
          },
          {
            spanish: 'una casa',
            english: 'a house',
            highlight: ['casa']
          },
          {
            spanish: 'la ventana',
            english: 'the window',
            highlight: ['ventana']
          }
        ]
      },
      {
        title: 'Important Exceptions',
        content: `Some common nouns don't follow the typical patterns:`,
        examples: [
          {
            spanish: 'el problema',
            english: 'the problem (masculine despite -a ending)',
            highlight: ['problema']
          },
          {
            spanish: 'la mano',
            english: 'the hand (feminine despite -o ending)',
            highlight: ['mano']
          },
          {
            spanish: 'el día',
            english: 'the day (masculine despite -a ending)',
            highlight: ['día']
          }
        ]
      },
      {
        title: 'Other Gender Patterns',
        content: `Additional patterns to help determine gender:

**Usually Masculine:**
- Nouns ending in **-ma** (el problema, el tema, el sistema)
- Days of the week (el lunes, el martes)
- Months (el enero, el febrero)
- Colors used as nouns (el azul, el rojo)

**Usually Feminine:**
- Nouns ending in **-ión** (la acción, la nación)
- Nouns ending in **-dad** (la ciudad, la verdad)
- Nouns ending in **-tad** (la libertad, la dificultad)`,
        examples: [
          {
            spanish: 'el sistema educativo',
            english: 'the educational system',
            highlight: ['sistema']
          },
          {
            spanish: 'la información importante',
            english: 'the important information',
            highlight: ['información']
          },
          {
            spanish: 'la ciudad grande',
            english: 'the big city',
            highlight: ['ciudad']
          }
        ]
      }
    ]
  },
  {
    title: 'Plural Formation',
    content: `Spanish nouns form their plurals following specific rules based on how the singular form ends. Understanding these patterns will help you form plurals correctly.`,
    subsections: [
      {
        title: 'Nouns ending in vowels',
        content: `Nouns ending in **-a**, **-e**, **-i**, **-o**, or **-u** simply add **-s**:`,
        examples: [
          {
            spanish: 'la mesa → las mesas',
            english: 'the table → the tables',
            highlight: ['mesa', 'mesas']
          },
          {
            spanish: 'el coche → los coches',
            english: 'the car → the cars',
            highlight: ['coche', 'coches']
          },
          {
            spanish: 'el libro → los libros',
            english: 'the book → the books',
            highlight: ['libro', 'libros']
          }
        ]
      },
      {
        title: 'Nouns ending in consonants',
        content: `Nouns ending in consonants (except **-s**) add **-es**:`,
        examples: [
          {
            spanish: 'el profesor → los profesores',
            english: 'the teacher → the teachers',
            highlight: ['profesor', 'profesores']
          },
          {
            spanish: 'la ciudad → las ciudades',
            english: 'the city → the cities',
            highlight: ['ciudad', 'ciudades']
          },
          {
            spanish: 'el animal → los animales',
            english: 'the animal → the animals',
            highlight: ['animal', 'animales']
          }
        ]
      },
      {
        title: 'Nouns ending in -z',
        content: `Nouns ending in **-z** change **-z** to **-c** and add **-es**:`,
        examples: [
          {
            spanish: 'el lápiz → los lápices',
            english: 'the pencil → the pencils',
            highlight: ['lápiz', 'lápices']
          },
          {
            spanish: 'la actriz → las actrices',
            english: 'the actress → the actresses',
            highlight: ['actriz', 'actrices']
          },
          {
            spanish: 'la luz → las luces',
            english: 'the light → the lights',
            highlight: ['luz', 'luces']
          }
        ]
      },
      {
        title: 'Special Cases',
        content: `Some nouns have special plural formation rules:

**Nouns ending in -ión lose the accent:**
- la nación → las naciones
- la información → las informaciones

**Some nouns don't change in plural:**
- Words ending in -s (if stressed on non-final syllable): el lunes → los lunes
- Some family names: los García, los López`,
        examples: [
          {
            spanish: 'la canción → las canciones',
            english: 'the song → the songs',
            highlight: ['canción', 'canciones']
          },
          {
            spanish: 'el lunes → los lunes',
            english: 'Monday → Mondays',
            highlight: ['lunes', 'lunes']
          }
        ]
      }
    ]
  },
  {
    title: 'Article Agreement',
    content: `Spanish articles must agree with the gender and number of the noun they accompany. This is fundamental to Spanish grammar.`,
    subsections: [
      {
        title: 'Definite Articles (the)',
        content: `The definite articles in Spanish change based on the gender and number of the noun:`,
        conjugationTable: {
          title: 'Definite Articles',
          conjugations: [
            { pronoun: 'Masculine singular', form: 'el', english: 'the (masc. sing.)' },
            { pronoun: 'Feminine singular', form: 'la', english: 'the (fem. sing.)' },
            { pronoun: 'Masculine plural', form: 'los', english: 'the (masc. pl.)' },
            { pronoun: 'Feminine plural', form: 'las', english: 'the (fem. pl.)' }
          ]
        },
        examples: [
          {
            spanish: 'el perro → los perros',
            english: 'the dog → the dogs',
            highlight: ['el', 'los']
          },
          {
            spanish: 'la gata → las gatas',
            english: 'the cat → the cats',
            highlight: ['la', 'las']
          }
        ]
      },
      {
        title: 'Indefinite Articles (a/an)',
        content: `The indefinite articles also agree with gender and number:`,
        conjugationTable: {
          title: 'Indefinite Articles',
          conjugations: [
            { pronoun: 'Masculine singular', form: 'un', english: 'a/an (masc. sing.)' },
            { pronoun: 'Feminine singular', form: 'una', english: 'a/an (fem. sing.)' },
            { pronoun: 'Masculine plural', form: 'unos', english: 'some (masc. pl.)' },
            { pronoun: 'Feminine plural', form: 'unas', english: 'some (fem. pl.)' }
          ]
        },
        examples: [
          {
            spanish: 'un coche → unos coches',
            english: 'a car → some cars',
            highlight: ['un', 'unos']
          },
          {
            spanish: 'una flor → unas flores',
            english: 'a flower → some flowers',
            highlight: ['una', 'unas']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Patterns and Tips',
    content: `Learning these patterns will help you predict noun gender and form plurals correctly:`,
    examples: [
      {
        spanish: 'Problema, tema, sistema (masculine -ma words)',
        english: 'Problem, theme, system (masculine -ma words)',
        highlight: ['Problema', 'tema', 'sistema']
      },
      {
        spanish: 'Información, educación, nación (feminine -ión words)',
        english: 'Information, education, nation (feminine -ión words)',
        highlight: ['Información', 'educación', 'nación']
      },
      {
        spanish: 'Ciudad, verdad, libertad (feminine -dad words)',
        english: 'City, truth, freedom (feminine -dad words)',
        highlight: ['Ciudad', 'verdad', 'libertad']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Definite Articles', url: '/grammar/spanish/articles/definite-articles', difficulty: 'beginner' },
  { title: 'Indefinite Articles', url: '/grammar/spanish/articles/definite-indefinite', difficulty: 'beginner' },
  { title: 'Adjective Agreement', url: '/grammar/spanish/adjectives/agreement', difficulty: 'beginner' },
  { title: 'Demonstrative Adjectives', url: '/grammar/spanish/adjectives/demonstrative', difficulty: 'beginner' }
];

export default function SpanishGenderAndPluralsPage() {
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
              topic: 'gender-and-plurals',
              title: 'Spanish Noun Gender and Plurals',
              description: 'Master Spanish noun gender rules and plural formation with comprehensive explanations and practice exercises.',
              difficulty: 'beginner',
              examples: [
                'el libro → los libros (the book → the books)',
                'la mesa → las mesas (the table → the tables)',
                'el lápiz → los lápices (the pencil → the pencils)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'nouns',
              topic: 'gender-and-plurals',
              title: 'Spanish Noun Gender and Plurals'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="nouns"
        topic="gender-and-plurals"
        title="Spanish Noun Gender and Plurals"
        description="Master Spanish noun gender rules and plural formation with comprehensive explanations"
        difficulty="beginner"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/spanish/nouns"
        practiceUrl="/grammar/spanish/nouns/gender-and-plurals/practice"
        quizUrl="/grammar/spanish/nouns/gender-and-plurals/quiz"
        songUrl="/songs/es?theme=grammar&topic=noun-gender"
        youtubeVideoId=""
        relatedTopics={relatedTopics}
      />
    </>
  );
}