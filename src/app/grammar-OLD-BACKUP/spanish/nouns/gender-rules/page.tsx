import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'nouns',
  topic: 'gender-rules',
  title: 'Spanish Noun Gender Rules (Masculine and Feminine Patterns)',
  description: 'Master Spanish noun gender including masculine/feminine patterns, endings, exceptions, and gender agreement rules.',
  difficulty: 'beginner',
  keywords: [
    'spanish noun gender',
    'masculine feminine spanish',
    'spanish gender rules',
    'noun endings spanish',
    'el la spanish',
    'spanish gender patterns'
  ],
  examples: [
    'el libro (the book - masculine)',
    'la mesa (the table - feminine)',
    'el problema (the problem - masculine exception)',
    'la mano (the hand - feminine exception)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Noun Gender',
    content: `Spanish nouns have **grammatical gender** - they are either **masculine** or **feminine**. This gender affects **articles**, **adjectives**, and sometimes **pronouns** that accompany the noun.

**Key principles:**
- **Every noun has gender**: No neutral nouns (except lo + adjective)
- **Gender affects agreement**: Articles and adjectives must match
- **Patterns exist**: Most nouns follow predictable patterns
- **Exceptions exist**: Some nouns break the general rules
- **Memorization needed**: Gender must be learned with each noun

**Basic pattern:**
- **Masculine**: Usually end in -o, use EL/UN
- **Feminine**: Usually end in -a, use LA/UNA

**Why gender matters:**
- **Article agreement**: el/la, un/una
- **Adjective agreement**: alto/alta, bueno/buena
- **Pronoun reference**: lo/la, este/esta
- **Communication clarity**: Gender errors can cause confusion

Understanding gender is **fundamental** for correct Spanish grammar and **natural-sounding speech**.`,
    examples: [
      {
        spanish: 'el libro rojo (the red book - masculine)',
        english: 'la mesa roja (the red table - feminine)',
        highlight: ['el libro rojo', 'la mesa roja']
      },
      {
        spanish: 'un estudiante inteligente (a smart male student)',
        english: 'una estudiante inteligente (a smart female student)',
        highlight: ['un estudiante', 'una estudiante']
      },
      {
        spanish: 'Este coche es caro. (This car is expensive.)',
        english: 'Esta casa es cara. (This house is expensive.)',
        highlight: ['Este coche', 'Esta casa']
      }
    ]
  },
  {
    title: 'Masculine Noun Patterns',
    content: `**Masculine nouns** typically follow these patterns:`,
    conjugationTable: {
      title: 'Common Masculine Endings',
      conjugations: [
        { pronoun: '-o', form: 'el libro, el carro', english: 'book, car (most common pattern)' },
        { pronoun: '-e', form: 'el coche, el nombre', english: 'car, name (many -e nouns are masculine)' },
        { pronoun: '-r', form: 'el amor, el color', english: 'love, color (infinitives used as nouns)' },
        { pronoun: '-l', form: 'el papel, el hotel', english: 'paper, hotel' },
        { pronoun: '-n', form: 'el jardín, el corazón', english: 'garden, heart' },
        { pronoun: '-s', form: 'el lunes, el autobús', english: 'Monday, bus (days of week, some -s words)' }
      ]
    },
    examples: [
      {
        spanish: 'el hermano (brother), el abuelo (grandfather)',
        english: 'el dinero (money), el cielo (sky)',
        highlight: ['el hermano', 'el dinero']
      },
      {
        spanish: 'el coche (car), el parque (park)',
        english: 'el dolor (pain), el animal (animal)',
        highlight: ['el coche', 'el dolor']
      }
    ],
    subsections: [
      {
        title: 'Days and Months',
        content: 'Days of the week are masculine:',
        examples: [
          {
            spanish: 'el lunes, el martes, el miércoles',
            english: 'el jueves, el viernes, el sábado, el domingo',
            highlight: ['el lunes', 'el domingo']
          }
        ]
      },
      {
        title: 'Languages',
        content: 'Language names are masculine:',
        examples: [
          {
            spanish: 'el español, el inglés, el francés',
            english: 'el alemán, el italiano, el portugués',
            highlight: ['el español', 'el inglés']
          }
        ]
      }
    ]
  },
  {
    title: 'Feminine Noun Patterns',
    content: `**Feminine nouns** typically follow these patterns:`,
    conjugationTable: {
      title: 'Common Feminine Endings',
      conjugations: [
        { pronoun: '-a', form: 'la casa, la mesa', english: 'house, table (most common pattern)' },
        { pronoun: '-ión', form: 'la nación, la canción', english: 'nation, song (almost always feminine)' },
        { pronoun: '-dad', form: 'la ciudad, la verdad', english: 'city, truth (abstract concepts)' },
        { pronoun: '-tad', form: 'la libertad, la amistad', english: 'freedom, friendship' },
        { pronoun: '-tud', form: 'la actitud, la gratitud', english: 'attitude, gratitude' },
        { pronoun: '-ez', form: 'la vez, la niñez', english: 'time, childhood' }
      ]
    },
    examples: [
      {
        spanish: 'la hermana (sister), la abuela (grandmother)',
        english: 'la comida (food), la vida (life)',
        highlight: ['la hermana', 'la comida']
      },
      {
        spanish: 'la información (information), la educación (education)',
        english: 'la universidad (university), la felicidad (happiness)',
        highlight: ['la información', 'la universidad']
      }
    ],
    subsections: [
      {
        title: 'Abstract Concepts',
        content: 'Many abstract nouns are feminine:',
        examples: [
          {
            spanish: 'la belleza (beauty), la tristeza (sadness)',
            english: 'la paciencia (patience), la inteligencia (intelligence)',
            highlight: ['la belleza', 'la paciencia']
          }
        ]
      },
      {
        title: 'Letters of the Alphabet',
        content: 'Letter names are feminine:',
        examples: [
          {
            spanish: 'la a, la be, la ce, la de',
            english: 'la efe, la ge, la hache, la i',
            highlight: ['la a', 'la efe']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Masculine Exceptions',
    content: `**Masculine nouns** that **don't end in -o**:`,
    examples: [
      {
        spanish: 'el problema (problem), el sistema (system)',
        english: 'el programa (program), el tema (theme)',
        highlight: ['el problema', 'el programa']
      },
      {
        spanish: 'el día (day), el mapa (map)',
        english: 'el planeta (planet), el idioma (language)',
        highlight: ['el día', 'el mapa']
      }
    ],
    subsections: [
      {
        title: 'Greek Origin Words',
        content: 'Many words from Greek ending in -a are masculine:',
        examples: [
          {
            spanish: 'el drama, el clima, el poema',
            english: 'el panorama, el dilema, el esquema',
            highlight: ['el drama', 'el poema']
          }
        ]
      },
      {
        title: 'Compound Words',
        content: 'Some compound words are masculine:',
        examples: [
          {
            spanish: 'el mediodía (noon), el paraguas (umbrella)',
            english: 'el cumpleaños (birthday), el rascacielos (skyscraper)',
            highlight: ['el mediodía', 'el paraguas']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Feminine Exceptions',
    content: `**Feminine nouns** that **don't end in -a**:`,
    examples: [
      {
        spanish: 'la mano (hand), la foto (photo)',
        english: 'la moto (motorcycle), la radio (radio)',
        highlight: ['la mano', 'la foto']
      },
      {
        spanish: 'la gente (people), la clase (class)',
        english: 'la carne (meat), la sangre (blood)',
        highlight: ['la gente', 'la clase']
      }
    ],
    subsections: [
      {
        title: 'Shortened Words',
        content: 'Abbreviated words keep original gender:',
        examples: [
          {
            spanish: 'la foto (fotografía), la moto (motocicleta)',
            english: 'la radio (radiodifusión), la disco (discoteca)',
            highlight: ['la foto', 'la radio']
          }
        ]
      },
      {
        title: 'Body Parts',
        content: 'Some body parts ending in -e are feminine:',
        examples: [
          {
            spanish: 'la frente (forehead), la mente (mind)',
            english: 'la muerte (death), la suerte (luck)',
            highlight: ['la frente', 'la muerte']
          }
        ]
      }
    ]
  },
  {
    title: 'Nouns with Both Genders',
    content: `Some nouns can be **both masculine and feminine** with **different meanings**:`,
    conjugationTable: {
      title: 'Nouns with Different Meanings by Gender',
      conjugations: [
        { pronoun: 'el capital', form: 'la capital', english: 'money/wealth vs city capital' },
        { pronoun: 'el cura', form: 'la cura', english: 'priest vs cure' },
        { pronoun: 'el orden', form: 'la orden', english: 'order (sequence) vs order (command)' },
        { pronoun: 'el papa', form: 'la papa', english: 'pope vs potato (Latin America)' },
        { pronoun: 'el policía', form: 'la policía', english: 'male police officer vs police force' },
        { pronoun: 'el guía', form: 'la guía', english: 'male guide vs guidebook/female guide' }
      ]
    },
    examples: [
      {
        spanish: 'El capital de la empresa es grande. (The company\'s capital is large.)',
        english: 'Madrid es la capital de España. (Madrid is the capital of Spain.)',
        highlight: ['El capital', 'la capital']
      },
      {
        spanish: 'El cura celebra la misa. (The priest celebrates mass.)',
        english: 'No hay cura para esta enfermedad. (There\'s no cure for this disease.)',
        highlight: ['El cura', 'cura']
      }
    ]
  },
  {
    title: 'People and Professions',
    content: `**People nouns** change gender based on the **person\'s sex**:`,
    conjugationTable: {
      title: 'People and Profession Gender Changes',
      conjugations: [
        { pronoun: 'el/la estudiante', form: 'same form', english: 'male/female student' },
        { pronoun: 'el profesor', form: 'la profesora', english: 'male/female teacher' },
        { pronoun: 'el médico', form: 'la médica', english: 'male/female doctor' },
        { pronoun: 'el actor', form: 'la actriz', english: 'actor/actress' },
        { pronoun: 'el rey', form: 'la reina', english: 'king/queen' },
        { pronoun: 'el hombre', form: 'la mujer', english: 'man/woman' }
      ]
    },
    examples: [
      {
        spanish: 'Mi hermano es médico. (My brother is a doctor.)',
        english: 'Mi hermana es médica. (My sister is a doctor.)',
        highlight: ['es médico', 'es médica']
      },
      {
        spanish: 'El estudiante estudia. (The male student studies.)',
        english: 'La estudiante estudia. (The female student studies.)',
        highlight: ['El estudiante', 'La estudiante']
      }
    ],
    subsections: [
      {
        title: 'Invariable Forms',
        content: 'Some profession nouns don\'t change:',
        examples: [
          {
            spanish: 'el/la dentista, el/la artista',
            english: 'el/la periodista, el/la turista',
            highlight: ['el/la dentista', 'el/la artista']
          }
        ]
      }
    ]
  },
  {
    title: 'Animals and Gender',
    content: `**Animal names** have **fixed gender** regardless of the animal\'s sex:`,
    examples: [
      {
        spanish: 'la serpiente (snake - always feminine)',
        english: 'el ratón (mouse - always masculine)',
        highlight: ['la serpiente', 'el ratón']
      },
      {
        spanish: 'la jirafa (giraffe - always feminine)',
        english: 'el elefante (elephant - always masculine)',
        highlight: ['la jirafa', 'el elefante']
      }
    ],
    subsections: [
      {
        title: 'Specific Male/Female Forms',
        content: 'Some animals have specific forms:',
        examples: [
          {
            spanish: 'el gato/la gata (male/female cat)',
            english: 'el perro/la perra (male/female dog)',
            highlight: ['el gato/la gata', 'el perro/la perra']
          }
        ]
      },
      {
        title: 'Macho/Hembra Distinction',
        content: 'Use macho/hembra to specify sex:',
        examples: [
          {
            spanish: 'la serpiente macho (male snake)',
            english: 'el ratón hembra (female mouse)',
            highlight: ['la serpiente macho', 'el ratón hembra']
          }
        ]
      }
    ]
  },
  {
    title: 'Gender with Articles',
    content: `**Articles must agree** with noun gender:`,
    conjugationTable: {
      title: 'Article Agreement with Gender',
      conjugations: [
        { pronoun: 'Definite', form: 'el (masc.) / la (fem.)', english: 'el libro / la mesa' },
        { pronoun: 'Indefinite', form: 'un (masc.) / una (fem.)', english: 'un libro / una mesa' },
        { pronoun: 'Plural Definite', form: 'los (masc.) / las (fem.)', english: 'los libros / las mesas' },
        { pronoun: 'Plural Indefinite', form: 'unos (masc.) / unas (fem.)', english: 'unos libros / unas mesas' }
      ]
    },
    examples: [
      {
        spanish: 'el problema difícil (the difficult problem)',
        english: 'la mano pequeña (the small hand)',
        highlight: ['el problema', 'la mano']
      }
    ]
  },
  {
    title: 'Gender with Adjectives',
    content: `**Adjectives must agree** with noun gender:`,
    examples: [
      {
        spanish: 'el coche rojo (the red car - masculine)',
        english: 'la casa roja (the red house - feminine)',
        highlight: ['coche rojo', 'casa roja']
      },
      {
        spanish: 'un estudiante inteligente (a smart male student)',
        english: 'una estudiante inteligente (a smart female student)',
        highlight: ['estudiante inteligente', 'estudiante inteligente']
      }
    ],
    subsections: [
      {
        title: 'Adjective Endings',
        content: 'Adjectives change endings for gender:',
        examples: [
          {
            spanish: 'alto/alta, bueno/buena, pequeño/pequeña',
            english: 'Some adjectives don\'t change: grande, inteligente',
            highlight: ['alto/alta', 'grande']
          }
        ]
      }
    ]
  },
  {
    title: 'Memory Strategies',
    content: `**Strategies** for remembering noun gender:`,
    examples: [
      {
        spanish: 'Learn with articles: "la mesa" not just "mesa"',
        english: 'Group by patterns: -ción words are feminine',
        highlight: ['la mesa', '-ción']
      },
      {
        spanish: 'Use color coding: blue for masculine, red for feminine',
        english: 'Practice with adjectives: "el libro rojo, la mesa roja"',
        highlight: ['libro rojo', 'mesa roja']
      }
    ],
    subsections: [
      {
        title: 'Visual Associations',
        content: 'Create mental images:',
        examples: [
          {
            spanish: 'la mano (hand) - remember the exception',
            english: 'el problema - think "problemo" to remember masculine',
            highlight: ['la mano', 'el problema']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Gender Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong articles**: Using el/la incorrectly
**2. Exception confusion**: Forgetting common exceptions
**3. Adjective disagreement**: Not matching adjective gender
**4. Overgeneralization**: Assuming all -a words are feminine`,
    examples: [
      {
        spanish: '❌ la problema → ✅ el problema',
        english: 'Wrong: problema is masculine despite -a ending',
        highlight: ['el problema']
      },
      {
        spanish: '❌ el mano → ✅ la mano',
        english: 'Wrong: mano is feminine despite not ending in -a',
        highlight: ['la mano']
      },
      {
        spanish: '❌ la casa rojo → ✅ la casa roja',
        english: 'Wrong: adjective must agree with feminine noun',
        highlight: ['la casa roja']
      },
      {
        spanish: '❌ un foto → ✅ una foto',
        english: 'Wrong: foto is feminine (from fotografía)',
        highlight: ['una foto']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Articles', url: '/grammar/spanish/articles/definite-articles', difficulty: 'beginner' },
  { title: 'Spanish Adjective Agreement', url: '/grammar/spanish/adjectives/agreement', difficulty: 'beginner' },
  { title: 'Spanish Plural Formation', url: '/grammar/spanish/nouns/plurals', difficulty: 'beginner' },
  { title: 'Spanish Demonstratives', url: '/grammar/spanish/adjectives/demonstrative', difficulty: 'intermediate' }
];

export default function SpanishGenderRulesPage() {
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
              topic: 'gender-rules',
              title: 'Spanish Noun Gender Rules (Masculine and Feminine Patterns)',
              description: 'Master Spanish noun gender including masculine/feminine patterns, endings, exceptions, and gender agreement rules.',
              difficulty: 'beginner',
              examples: [
                'el libro (the book - masculine)',
                'la mesa (the table - feminine)',
                'el problema (the problem - masculine exception)',
                'la mano (the hand - feminine exception)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'nouns',
              topic: 'gender-rules',
              title: 'Spanish Noun Gender Rules (Masculine and Feminine Patterns)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="nouns"
        topic="gender-rules"
        title="Spanish Noun Gender Rules (Masculine and Feminine Patterns)"
        description="Master Spanish noun gender including masculine/feminine patterns, endings, exceptions, and gender agreement rules"
        difficulty="beginner"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/spanish/nouns"
        practiceUrl="/grammar/spanish/nouns/gender-rules/practice"
        quizUrl="/grammar/spanish/nouns/gender-rules/quiz"
        songUrl="/songs/es?theme=grammar&topic=gender-rules"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
