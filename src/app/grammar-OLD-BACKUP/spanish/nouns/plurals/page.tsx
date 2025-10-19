import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'nouns',
  topic: 'plurals',
  title: 'Spanish Noun Plurals',
  description: 'Learn how to form plurals in Spanish with clear rules and examples. Master regular and irregular plural formations.',
  difficulty: 'beginner',
  keywords: [
    'spanish plurals',
    'plural nouns spanish',
    'spanish grammar plurals',
    'how to make plurals spanish',
    'spanish noun endings',
    'plural rules spanish',
    'spanish grammar basics'
  ],
  examples: [
    'libro → libros (book → books)',
    'mesa → mesas (table → tables)',
    'lápiz → lápices (pencil → pencils)'
  ]
});

const sections = [
  {
    title: 'Spanish Plural Formation',
    content: `Forming plurals in Spanish follows predictable rules based on how the singular noun ends. Unlike English, which has many irregular plurals, Spanish plural formation is quite systematic and logical.

Understanding these rules will help you communicate more effectively and make your Spanish sound more natural and grammatically correct.`,
    examples: [
      {
        spanish: 'un libro → dos libros',
        english: 'one book → two books',
        highlight: ['libro', 'libros']
      },
      {
        spanish: 'una mesa → tres mesas',
        english: 'one table → three tables',
        highlight: ['mesa', 'mesas']
      },
      {
        spanish: 'un lápiz → muchos lápices',
        english: 'one pencil → many pencils',
        highlight: ['lápiz', 'lápices']
      }
    ]
  },
  {
    title: 'Basic Plural Rules',
    content: `Spanish plural formation depends on the final letter of the singular noun. Here are the main rules:

**Rule 1**: Nouns ending in vowels → add **-s**
**Rule 2**: Nouns ending in consonants → add **-es**
**Rule 3**: Nouns ending in **-z** → change **z** to **c** and add **-es**
**Rule 4**: Some nouns don't change in plural form`,
    subsections: [
      {
        title: 'Rule 1: Vowel Endings + S',
        content: `When a noun ends in a **vowel** (a, e, i, o, u), simply add **-s** to form the plural:`,
        conjugationTable: {
          title: 'Vowel Endings → Add -s',
          conjugations: [
            { pronoun: 'casa (house)', form: 'casas', english: 'houses' },
            { pronoun: 'coche (car)', form: 'coches', english: 'cars' },
            { pronoun: 'taxi (taxi)', form: 'taxis', english: 'taxis' },
            { pronoun: 'libro (book)', form: 'libros', english: 'books' },
            { pronoun: 'tribu (tribe)', form: 'tribus', english: 'tribes' }
          ]
        },
        examples: [
          {
            spanish: 'Tengo tres gatos en casa.',
            english: 'I have three cats at home.',
            highlight: ['gatos']
          },
          {
            spanish: 'Las mesas están limpias.',
            english: 'The tables are clean.',
            highlight: ['mesas']
          },
          {
            spanish: 'Compramos dos coches nuevos.',
            english: 'We bought two new cars.',
            highlight: ['coches']
          }
        ]
      },
      {
        title: 'Rule 2: Consonant Endings + ES',
        content: `When a noun ends in a **consonant**, add **-es** to form the plural:`,
        conjugationTable: {
          title: 'Consonant Endings → Add -es',
          conjugations: [
            { pronoun: 'profesor (teacher)', form: 'profesores', english: 'teachers' },
            { pronoun: 'animal (animal)', form: 'animales', english: 'animals' },
            { pronoun: 'ciudad (city)', form: 'ciudades', english: 'cities' },
            { pronoun: 'reloj (watch)', form: 'relojes', english: 'watches' },
            { pronoun: 'pan (bread)', form: 'panes', english: 'breads/loaves' }
          ]
        },
        examples: [
          {
            spanish: 'Los profesores son muy amables.',
            english: 'The teachers are very kind.',
            highlight: ['profesores']
          },
          {
            spanish: 'Visitamos muchas ciudades.',
            english: 'We visited many cities.',
            highlight: ['ciudades']
          },
          {
            spanish: 'Hay varios animales en el zoo.',
            english: 'There are several animals in the zoo.',
            highlight: ['animales']
          }
        ]
      },
      {
        title: 'Rule 3: Z → C + ES',
        content: `When a noun ends in **-z**, change the **z** to **c** and add **-es**:`,
        conjugationTable: {
          title: 'Z Endings → Change z to c + es',
          conjugations: [
            { pronoun: 'lápiz (pencil)', form: 'lápices', english: 'pencils' },
            { pronoun: 'pez (fish)', form: 'peces', english: 'fish (plural)' },
            { pronoun: 'luz (light)', form: 'luces', english: 'lights' },
            { pronoun: 'cruz (cross)', form: 'cruces', english: 'crosses' },
            { pronoun: 'actriz (actress)', form: 'actrices', english: 'actresses' }
          ]
        },
        examples: [
          {
            spanish: 'Necesito comprar lápices nuevos.',
            english: 'I need to buy new pencils.',
            highlight: ['lápices']
          },
          {
            spanish: 'En el acuario hay muchos peces.',
            english: 'In the aquarium there are many fish.',
            highlight: ['peces']
          },
          {
            spanish: 'Las luces de la ciudad son hermosas.',
            english: 'The city lights are beautiful.',
            highlight: ['luces']
          }
        ]
      }
    ]
  },
  {
    title: 'Special Cases and Exceptions',
    content: `While most Spanish nouns follow the basic rules, there are some special cases and exceptions to be aware of:`,
    subsections: [
      {
        title: 'Nouns Ending in Stressed Vowels',
        content: `Nouns ending in **stressed í** or **ú** add **-es** instead of just **-s**:`,
        conjugationTable: {
          title: 'Stressed Vowel Endings → Add -es',
          conjugations: [
            { pronoun: 'rubí (ruby)', form: 'rubíes', english: 'rubies' },
            { pronoun: 'bambú (bamboo)', form: 'bambúes', english: 'bamboos' },
            { pronoun: 'iraní (Iranian)', form: 'iraníes', english: 'Iranians' },
            { pronoun: 'tabú (taboo)', form: 'tabúes', english: 'taboos' }
          ]
        },
        examples: [
          {
            spanish: 'Los rubíes son piedras preciosas.',
            english: 'Rubies are precious stones.',
            highlight: ['rubíes']
          },
          {
            spanish: 'En el jardín crecen bambúes.',
            english: 'Bamboos grow in the garden.',
            highlight: ['bambúes']
          }
        ]
      },
      {
        title: 'Invariable Nouns',
        content: `Some nouns have the **same form** in singular and plural:`,
        conjugationTable: {
          title: 'Invariable Nouns (Same Form)',
          conjugations: [
            { pronoun: 'el lunes → los lunes', form: 'Monday → Mondays', english: 'days of the week' },
            { pronoun: 'la crisis → las crisis', form: 'crisis → crises', english: 'words ending in -is' },
            { pronoun: 'el análisis → los análisis', form: 'analysis → analyses', english: 'words ending in -is' },
            { pronoun: 'la tesis → las tesis', form: 'thesis → theses', english: 'words ending in -is' }
          ]
        },
        examples: [
          {
            spanish: 'Los lunes son difíciles.',
            english: 'Mondays are difficult.',
            highlight: ['lunes']
          },
          {
            spanish: 'Hay varias crisis económicas.',
            english: 'There are several economic crises.',
            highlight: ['crisis']
          }
        ]
      },
      {
        title: 'Compound Nouns',
        content: `**Compound nouns** usually pluralize only the **last element**:`,
        conjugationTable: {
          title: 'Compound Nouns → Pluralize Last Element',
          conjugations: [
            { pronoun: 'el abrelatas', form: 'los abrelatas', english: 'can opener(s)' },
            { pronoun: 'el rascacielos', form: 'los rascacielos', english: 'skyscraper(s)' },
            { pronoun: 'el paraguas', form: 'los paraguas', english: 'umbrella(s)' },
            { pronoun: 'el cumpleaños', form: 'los cumpleaños', english: 'birthday(s)' }
          ]
        },
        examples: [
          {
            spanish: 'Necesitamos dos abrelatas.',
            english: 'We need two can openers.',
            highlight: ['abrelatas']
          },
          {
            spanish: 'En la ciudad hay muchos rascacielos.',
            english: 'In the city there are many skyscrapers.',
            highlight: ['rascacielos']
          }
        ]
      }
    ]
  },
  {
    title: 'Accent Changes in Plurals',
    content: `When forming plurals, sometimes the **stress pattern** changes, which affects written accents:

**Rule**: If adding the plural ending changes where the stress falls, you may need to add or remove accent marks to maintain the original pronunciation.

This is important for maintaining correct pronunciation and spelling in Spanish.`,
    examples: [
      {
        spanish: 'joven → jóvenes (young person → young people)',
        english: 'The accent is added to maintain stress on "jo"',
        highlight: ['joven', 'jóvenes']
      },
      {
        spanish: 'examen → exámenes (exam → exams)',
        english: 'The accent is added to maintain stress on "xa"',
        highlight: ['examen', 'exámenes']
      },
      {
        spanish: 'inglés → ingleses (English → English people)',
        english: 'The accent is removed because stress shifts naturally',
        highlight: ['inglés', 'ingleses']
      },
      {
        spanish: 'francés → franceses (French → French people)',
        english: 'The accent is removed because stress shifts naturally',
        highlight: ['francés', 'franceses']
      }
    ]
  },
  {
    title: 'Articles and Adjectives with Plurals',
    content: `Remember that **articles** and **adjectives** must also agree with plural nouns:

**Definite Articles**: el/la → los/las
**Indefinite Articles**: un/una → unos/unas  
**Adjectives**: Must match the gender and number of the noun

This agreement is essential for grammatically correct Spanish.`,
    examples: [
      {
        spanish: 'el libro rojo → los libros rojos',
        english: 'the red book → the red books',
        highlight: ['el', 'los', 'rojo', 'rojos']
      },
      {
        spanish: 'una mesa grande → unas mesas grandes',
        english: 'a big table → some big tables',
        highlight: ['una', 'unas', 'grande', 'grandes']
      },
      {
        spanish: 'la profesora inteligente → las profesoras inteligentes',
        english: 'the intelligent teacher → the intelligent teachers',
        highlight: ['la', 'las', 'inteligente', 'inteligentes']
      },
      {
        spanish: 'un estudiante español → unos estudiantes españoles',
        english: 'a Spanish student → some Spanish students',
        highlight: ['un', 'unos', 'español', 'españoles']
      }
    ]
  },
  {
    title: 'Common Mistakes to Avoid',
    content: `Here are the most common mistakes English speakers make with Spanish plurals:

**Mistake 1**: Forgetting to change articles and adjectives
**Mistake 2**: Adding -s to words ending in consonants
**Mistake 3**: Not changing z to c before adding -es
**Mistake 4**: Pluralizing invariable nouns

Practice these rules regularly to avoid these common errors.`,
    examples: [
      {
        spanish: '❌ los profesor ✅ los profesores',
        english: '❌ the teacher ✅ the teachers',
        highlight: ['profesor', 'profesores']
      },
      {
        spanish: '❌ los lápizs ✅ los lápices',
        english: '❌ the pencils ✅ the pencils',
        highlight: ['lápizs', 'lápices']
      },
      {
        spanish: '❌ las mesa grande ✅ las mesas grandes',
        english: '❌ the big tables ✅ the big tables',
        highlight: ['mesa', 'mesas', 'grande', 'grandes']
      },
      {
        spanish: '❌ los luneses ✅ los lunes',
        english: '❌ the Mondays ✅ the Mondays',
        highlight: ['luneses', 'lunes']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'Spanish Noun Gender',
    url: '/grammar/spanish/nouns/gender',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Articles',
    url: '/grammar/spanish/nouns/articles',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Adjective Agreement',
    url: '/grammar/spanish/adjectives/agreement',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Numbers',
    url: '/grammar/spanish/numbers/cardinal',
    difficulty: 'beginner'
  }
];

export default function SpanishPluralsPage() {
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
              topic: 'plurals',
              title: 'Spanish Noun Plurals',
              description: 'Learn how to form plurals in Spanish with clear rules and examples. Master regular and irregular plural formations.',
              difficulty: 'beginner',
              examples: [
                'libro → libros (book → books)',
                'mesa → mesas (table → tables)',
                'lápiz → lápices (pencil → pencils)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'nouns',
              topic: 'plurals',
              title: 'Spanish Noun Plurals'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="nouns"
        topic="plurals"
        title="Spanish Noun Plurals"
        description="Learn how to form plurals in Spanish with clear rules and examples. Master regular and irregular plural formations"
        difficulty="beginner"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/spanish/nouns"
        practiceUrl="/grammar/spanish/nouns/plurals/practice"
        quizUrl="/grammar/spanish/nouns/plurals/quiz"
        songUrl="/songs/es?theme=grammar&topic=plurals"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
