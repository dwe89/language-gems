import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'articles',
  topic: 'definite-articles',
  title: 'Spanish Definite Articles (El, La, Los, Las - Usage and Rules)',
  description: 'Master Spanish definite articles including el, la, los, las, gender agreement, contractions, and usage rules.',
  difficulty: 'beginner',
  keywords: [
    'spanish definite articles',
    'el la los las spanish',
    'spanish articles gender',
    'definite article spanish',
    'spanish article agreement',
    'el vs la spanish'
  ],
  examples: [
    'el libro (the book)',
    'la mesa (the table)',
    'los libros (the books)',
    'las mesas (the tables)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Definite Articles',
    content: `Spanish definite articles (artículos definidos) are equivalent to English "the" but **change form** based on the **gender** and **number** of the noun they accompany. They are **essential** for proper Spanish grammar.

**The four definite articles:**
- **el** - masculine singular (the)
- **la** - feminine singular (the)
- **los** - masculine plural (the)
- **las** - feminine plural (the)

**Key characteristics:**
- **Gender agreement**: Must match noun gender (masculine/feminine)
- **Number agreement**: Must match noun number (singular/plural)
- **Always used**: More frequently used than English "the"
- **Contractions**: Combine with prepositions DE and A
- **Special cases**: Used with some proper nouns, languages, and abstract concepts

**Why definite articles matter:**
- **Grammatical correctness**: Essential for proper Spanish
- **Gender indication**: Help identify noun gender
- **Meaning clarity**: Can change meaning of sentences
- **Natural speech**: Native speakers always use them correctly

Mastering definite articles is **fundamental** for **accurate Spanish communication** and **grammatical correctness**.`,
    examples: [
      {
        spanish: 'el coche rojo (the red car - masculine singular)',
        english: 'la casa roja (the red house - feminine singular)',
        highlight: ['el coche rojo', 'la casa roja']
      },
      {
        spanish: 'los coches rojos (the red cars - masculine plural)',
        english: 'las casas rojas (the red houses - feminine plural)',
        highlight: ['los coches rojos', 'las casas rojas']
      },
      {
        spanish: 'El profesor enseña español. (The teacher teaches Spanish.)',
        english: 'La profesora enseña francés. (The teacher teaches French.)',
        highlight: ['El profesor', 'La profesora']
      }
    ]
  },
  {
    title: 'EL - Masculine Singular',
    content: `**EL** is used with **masculine singular nouns**:`,
    examples: [
      {
        spanish: 'el libro (the book)',
        english: 'el coche (the car)',
        highlight: ['el libro', 'el coche']
      },
      {
        spanish: 'el estudiante (the male student)',
        english: 'el profesor (the male teacher)',
        highlight: ['el estudiante', 'el profesor']
      },
      {
        spanish: 'el problema (the problem - exception)',
        english: 'el día (the day - exception)',
        highlight: ['el problema', 'el día']
      }
    ],
    subsections: [
      {
        title: 'Common Masculine Nouns',
        content: 'Typical masculine nouns with EL:',
        examples: [
          {
            spanish: 'el hombre (man), el niño (boy)',
            english: 'el trabajo (work), el dinero (money)',
            highlight: ['el hombre', 'el trabajo']
          }
        ]
      },
      {
        title: 'Masculine Exceptions',
        content: 'Masculine nouns not ending in -o:',
        examples: [
          {
            spanish: 'el problema, el sistema, el programa',
            english: 'el mapa, el planeta, el idioma',
            highlight: ['el problema', 'el mapa']
          }
        ]
      }
    ]
  },
  {
    title: 'LA - Feminine Singular',
    content: `**LA** is used with **feminine singular nouns**:`,
    examples: [
      {
        spanish: 'la mesa (the table)',
        english: 'la casa (the house)',
        highlight: ['la mesa', 'la casa']
      },
      {
        spanish: 'la estudiante (the female student)',
        english: 'la profesora (the female teacher)',
        highlight: ['la estudiante', 'la profesora']
      },
      {
        spanish: 'la mano (the hand - exception)',
        english: 'la foto (the photo - exception)',
        highlight: ['la mano', 'la foto']
      }
    ],
    subsections: [
      {
        title: 'Common Feminine Nouns',
        content: 'Typical feminine nouns with LA:',
        examples: [
          {
            spanish: 'la mujer (woman), la niña (girl)',
            english: 'la comida (food), la vida (life)',
            highlight: ['la mujer', 'la comida']
          }
        ]
      },
      {
        title: 'Feminine Exceptions',
        content: 'Feminine nouns not ending in -a:',
        examples: [
          {
            spanish: 'la mano, la foto, la moto',
            english: 'la clase, la gente, la carne',
            highlight: ['la mano', 'la clase']
          }
        ]
      }
    ]
  },
  {
    title: 'LOS - Masculine Plural',
    content: `**LOS** is used with **masculine plural nouns**:`,
    examples: [
      {
        spanish: 'los libros (the books)',
        english: 'los coches (the cars)',
        highlight: ['los libros', 'los coches']
      },
      {
        spanish: 'los estudiantes (the male students or mixed group)',
        english: 'los profesores (the male teachers or mixed group)',
        highlight: ['los estudiantes', 'los profesores']
      },
      {
        spanish: 'los problemas (the problems)',
        english: 'los días (the days)',
        highlight: ['los problemas', 'los días']
      }
    ],
    subsections: [
      {
        title: 'Mixed Gender Groups',
        content: 'LOS for groups with males and females:',
        examples: [
          {
            spanish: 'los estudiantes (male students or mixed group)',
            english: 'los profesores (male teachers or mixed group)',
            highlight: ['los estudiantes', 'los profesores']
          }
        ]
      }
    ]
  },
  {
    title: 'LAS - Feminine Plural',
    content: `**LAS** is used with **feminine plural nouns**:`,
    examples: [
      {
        spanish: 'las mesas (the tables)',
        english: 'las casas (the houses)',
        highlight: ['las mesas', 'las casas']
      },
      {
        spanish: 'las estudiantes (the female students - all female)',
        english: 'las profesoras (the female teachers - all female)',
        highlight: ['las estudiantes', 'las profesoras']
      },
      {
        spanish: 'las manos (the hands)',
        english: 'las fotos (the photos)',
        highlight: ['las manos', 'las fotos']
      }
    ],
    subsections: [
      {
        title: 'All-Female Groups',
        content: 'LAS only for groups of all females:',
        examples: [
          {
            spanish: 'las estudiantes (all female students)',
            english: 'las profesoras (all female teachers)',
            highlight: ['las estudiantes', 'las profesoras']
          }
        ]
      }
    ]
  },
  {
    title: 'Article Agreement Rules',
    content: `**Complete agreement pattern** for definite articles:`,
    conjugationTable: {
      title: 'Definite Article Agreement',
      conjugations: [
        { pronoun: 'Masculine Singular', form: 'el', english: 'el libro rojo (the red book)' },
        { pronoun: 'Feminine Singular', form: 'la', english: 'la mesa roja (the red table)' },
        { pronoun: 'Masculine Plural', form: 'los', english: 'los libros rojos (the red books)' },
        { pronoun: 'Feminine Plural', form: 'las', english: 'las mesas rojas (the red tables)' }
      ]
    },
    examples: [
      {
        spanish: 'el estudiante inteligente → los estudiantes inteligentes',
        english: 'la estudiante inteligente → las estudiantes inteligentes',
        highlight: ['el estudiante', 'los estudiantes', 'la estudiante', 'las estudiantes']
      }
    ]
  },
  {
    title: 'Contractions: DEL and AL',
    content: `**Definite articles contract** with prepositions DE and A:`,
    conjugationTable: {
      title: 'Mandatory Contractions',
      conjugations: [
        { pronoun: 'de + el', form: 'del', english: 'del coche (of/from the car)' },
        { pronoun: 'a + el', form: 'al', english: 'al coche (to the car)' },
        { pronoun: 'de + la/los/las', form: 'no contraction', english: 'de la casa, de los libros, de las mesas' },
        { pronoun: 'a + la/los/las', form: 'no contraction', english: 'a la casa, a los libros, a las mesas' }
      ]
    },
    examples: [
      {
        spanish: 'Vengo del trabajo. (I come from work.)',
        english: 'Voy al supermercado. (I go to the supermarket.)',
        highlight: ['del trabajo', 'al supermercado']
      },
      {
        spanish: 'El libro del profesor. (The teacher\'s book.)',
        english: 'Vamos al cine. (We go to the cinema.)',
        highlight: ['del profesor', 'al cine']
      }
    ],
    subsections: [
      {
        title: 'Only with EL',
        content: 'Contractions only occur with masculine singular EL:',
        examples: [
          {
            spanish: 'de la mesa (from the table) - no contraction',
            english: 'a los estudiantes (to the students) - no contraction',
            highlight: ['de la mesa', 'a los estudiantes']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses of Definite Articles',
    content: `**Spanish uses definite articles** more frequently than English:`,
    examples: [
      {
        spanish: 'GENERAL CONCEPTS: Me gusta el café. (I like coffee.)',
        english: 'LANGUAGES: Hablo el español. (I speak Spanish.) - though often omitted',
        highlight: ['Me gusta el café', 'Hablo el español']
      },
      {
        spanish: 'DAYS OF WEEK: El lunes voy al trabajo. (On Monday I go to work.)',
        english: 'BODY PARTS: Me duele la cabeza. (My head hurts.)',
        highlight: ['El lunes', 'la cabeza']
      }
    ],
    subsections: [
      {
        title: 'With Abstract Nouns',
        content: 'Abstract concepts use definite articles:',
        examples: [
          {
            spanish: 'La vida es bella. (Life is beautiful.)',
            english: 'El amor es importante. (Love is important.)',
            highlight: ['La vida', 'El amor']
          }
        ]
      },
      {
        title: 'With Clothing and Body Parts',
        content: 'Instead of possessive adjectives:',
        examples: [
          {
            spanish: 'Me pongo la camisa. (I put on my shirt.)',
            english: 'Me lavo las manos. (I wash my hands.)',
            highlight: ['la camisa', 'las manos']
          }
        ]
      }
    ]
  },
  {
    title: 'Definite Articles with Proper Nouns',
    content: `**Some proper nouns** require definite articles:`,
    examples: [
      {
        spanish: 'COUNTRIES: la Argentina, el Perú, los Estados Unidos',
        english: 'RIVERS: el Amazonas, el Nilo',
        highlight: ['la Argentina', 'el Amazonas']
      },
      {
        spanish: 'MOUNTAINS: los Andes, los Pirineos',
        english: 'OCEANS: el Atlántico, el Pacífico',
        highlight: ['los Andes', 'el Atlántico']
      }
    ],
    subsections: [
      {
        title: 'Countries with Articles',
        content: 'Some countries always use articles:',
        examples: [
          {
            spanish: 'la India, el Brasil, la China',
            english: 'el Reino Unido, los Países Bajos',
            highlight: ['la India', 'el Reino Unido']
          }
        ]
      }
    ]
  },
  {
    title: 'When NOT to Use Definite Articles',
    content: `**Omit definite articles** in these cases:`,
    examples: [
      {
        spanish: 'AFTER SER + PROFESSION: Soy profesor. (I am a teacher.)',
        english: 'MOST COUNTRIES: Vivo en España. (I live in Spain.)',
        highlight: ['Soy profesor', 'Vivo en España']
      },
      {
        spanish: 'AFTER PREPOSITIONS: en casa (at home), por teléfono (by phone)',
        english: 'LANGUAGES AFTER HABLAR: Hablo español. (I speak Spanish.)',
        highlight: ['en casa', 'Hablo español']
      }
    ],
    subsections: [
      {
        title: 'Fixed Expressions',
        content: 'Some expressions never use articles:',
        examples: [
          {
            spanish: 'en casa (at home), por favor (please)',
            english: 'de memoria (by heart), a pie (on foot)',
            highlight: ['en casa', 'de memoria']
          }
        ]
      }
    ]
  },
  {
    title: 'Definite Articles with Time',
    content: `**Time expressions** with definite articles:`,
    examples: [
      {
        spanish: 'DAYS: el lunes (on Monday), los martes (on Tuesdays)',
        english: 'TIME: Son las tres. (It\'s three o\'clock.)',
        highlight: ['el lunes', 'las tres']
      },
      {
        spanish: 'SEASONS: en el verano (in summer), durante el invierno (during winter)',
        english: 'DATES: el 15 de mayo (May 15th)',
        highlight: ['el verano', 'el 15 de mayo']
      }
    ]
  },
  {
    title: 'Special Cases and Exceptions',
    content: `**Special situations** with definite articles:`,
    examples: [
      {
        spanish: 'FEMININE NOUNS STARTING WITH STRESSED A: el agua (the water), but las aguas (the waters)',
        english: 'TITLES: el señor García, la doctora López',
        highlight: ['el agua', 'las aguas', 'el señor García']
      }
    ],
    subsections: [
      {
        title: 'EL with Feminine Nouns',
        content: 'Feminine nouns starting with stressed a/ha use EL:',
        examples: [
          {
            spanish: 'el agua fría (the cold water)',
            english: 'el alma buena (the good soul)',
            highlight: ['el agua fría', 'el alma buena']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes with Definite Articles',
    content: `Here are frequent errors students make:

**1. Wrong gender**: Using el/la incorrectly
**2. Missing contractions**: Not using del/al when required
**3. Overuse**: Using articles when they should be omitted
**4. Underuse**: Omitting articles when they're required`,
    examples: [
      {
        spanish: '❌ la problema → ✅ el problema',
        english: 'Wrong: problema is masculine despite -a ending',
        highlight: ['el problema']
      },
      {
        spanish: '❌ de el coche → ✅ del coche',
        english: 'Wrong: must contract de + el = del',
        highlight: ['del coche']
      },
      {
        spanish: '❌ Me gusta café → ✅ Me gusta el café',
        english: 'Wrong: general concepts need definite article',
        highlight: ['Me gusta el café']
      },
      {
        spanish: '❌ Soy el profesor → ✅ Soy profesor',
        english: 'Wrong: no article after ser + profession',
        highlight: ['Soy profesor']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Noun Gender', url: '/grammar/spanish/nouns/gender-rules', difficulty: 'beginner' },
  { title: 'Spanish Indefinite Articles', url: '/grammar/spanish/articles/definite-indefinite', difficulty: 'beginner' },
  { title: 'Spanish Plural Formation', url: '/grammar/spanish/nouns/plurals', difficulty: 'beginner' },
  { title: 'Spanish Prepositions', url: '/grammar/spanish/prepositions/basic-prepositions', difficulty: 'intermediate' }
];

export default function SpanishDefiniteArticlesPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'articles',
              topic: 'definite-articles',
              title: 'Spanish Definite Articles (El, La, Los, Las - Usage and Rules)',
              description: 'Master Spanish definite articles including el, la, los, las, gender agreement, contractions, and usage rules.',
              difficulty: 'beginner',
              examples: [
                'el libro (the book)',
                'la mesa (the table)',
                'los libros (the books)',
                'las mesas (the tables)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'articles',
              topic: 'definite-articles',
              title: 'Spanish Definite Articles (El, La, Los, Las - Usage and Rules)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="articles"
        topic="definite-articles"
        title="Spanish Definite Articles (El, La, Los, Las - Usage and Rules)"
        description="Master Spanish definite articles including el, la, los, las, gender agreement, contractions, and usage rules"
        difficulty="beginner"
        estimatedTime={13}
        sections={sections}
        backUrl="/grammar/spanish/articles"
        practiceUrl="/grammar/spanish/articles/definite-articles/practice"
        quizUrl="/grammar/spanish/articles/definite-articles/quiz"
        songUrl="/songs/es?theme=grammar&topic=definite-articles"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
