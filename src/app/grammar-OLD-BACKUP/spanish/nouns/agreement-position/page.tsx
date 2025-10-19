import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'nouns',
  topic: 'agreement-position',
  title: 'Spanish Noun-Adjective Agreement and Position Rules',
  description: 'Master Spanish noun-adjective agreement including gender, number, and position rules for descriptive adjectives.',
  difficulty: 'beginner',
  keywords: [
    'spanish adjective agreement',
    'spanish adjective position',
    'noun adjective agreement spanish',
    'spanish adjective placement',
    'spanish gender agreement'
  ],
  examples: [
    'la casa blanca (the white house)',
    'los libros interesantes (the interesting books)',
    'una gran mujer (a great woman)',
    'las flores rojas (the red flowers)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Noun-Adjective Agreement',
    content: `Spanish **adjectives** must **agree** with the nouns they modify in both **gender** (masculine/feminine) and **number** (singular/plural). This agreement is **fundamental** to Spanish grammar.

**Basic agreement rules:**
- **Gender agreement**: Masculine nouns → masculine adjectives
- **Number agreement**: Plural nouns → plural adjectives
- **Position matters**: Most adjectives follow the noun
- **Some exceptions**: Certain adjectives precede the noun

**Agreement patterns:**
- **-o/-a endings**: Change for gender (blanco/blanca)
- **-e endings**: Usually invariable for gender (grande)
- **Consonant endings**: Usually invariable for gender (azul)
- **Plural formation**: Add -s or -es

**Why agreement matters:**
- **Grammatical correctness**: Essential for proper Spanish
- **Clear communication**: Agreement clarifies relationships
- **Natural speech**: Native speakers use automatically
- **Foundation skill**: Required for all adjective use

**Position significance:**
- **Descriptive adjectives**: Usually after noun
- **Limiting adjectives**: Usually before noun
- **Meaning changes**: Some adjectives change meaning with position

Understanding agreement and position is **crucial** for **correct Spanish grammar**.`,
    examples: [
      {
        spanish: 'AGREEMENT: el libro rojo, la casa roja, los libros rojos, las casas rojas',
        english: 'POSITION: la casa grande (descriptive) vs. una gran casa (evaluative)',
        highlight: ['libro rojo', 'gran casa']
      },
      {
        spanish: 'INVARIABLE: el coche verde, la casa verde (same form)',
        english: 'VARIABLE: el gato negro, la gata negra (changes form)',
        highlight: ['coche verde', 'gata negra']
      }
    ]
  },
  {
    title: 'Gender Agreement Rules',
    content: `**Gender agreement** depends on adjective endings:`,
    conjugationTable: {
      title: 'Gender Agreement Patterns',
      conjugations: [
        { pronoun: '-o/-a adjectives', form: 'Change for gender', english: 'blanco/blanca, negro/negra' },
        { pronoun: '-e adjectives', form: 'Usually invariable', english: 'grande, verde, inteligente' },
        { pronoun: 'Consonant endings', form: 'Usually invariable', english: 'azul, gris, popular' },
        { pronoun: 'Nationality -consonant', form: 'Add -a for feminine', english: 'español/española, alemán/alemana' },
        { pronoun: '-or adjectives', form: 'Add -a for feminine', english: 'trabajador/trabajadora' }
      ]
    },
    examples: [
      {
        spanish: 'VARIABLE: el perro blanco, la perra blanca',
        english: 'INVARIABLE: el coche grande, la casa grande',
        highlight: ['perro blanco', 'casa grande']
      },
      {
        spanish: 'NATIONALITY: el hombre español, la mujer española',
        english: 'PROFESSION: el trabajador serio, la trabajadora seria',
        highlight: ['mujer española', 'trabajadora seria']
      }
    ]
  },
  {
    title: 'Number Agreement Rules',
    content: `**Number agreement** follows specific patterns:`,
    conjugationTable: {
      title: 'Plural Formation Rules',
      conjugations: [
        { pronoun: 'Ends in vowel', form: 'Add -s', english: 'rojo → rojos, grande → grandes' },
        { pronoun: 'Ends in consonant', form: 'Add -es', english: 'azul → azules, popular → populares' },
        { pronoun: 'Ends in -z', form: 'Change z to c + es', english: 'feliz → felices' },
        { pronoun: 'Ends in -í', form: 'Add -es', english: 'marroquí → marroquíes' },
        { pronoun: 'Already plural', form: 'No change', english: 'gratis → gratis' }
      ]
    },
    examples: [
      {
        spanish: 'VOWEL: los libros rojos, las casas blancas',
        english: 'CONSONANT: los coches azules, las flores populares',
        highlight: ['libros rojos', 'coches azules']
      },
      {
        spanish: 'Z→C: los niños felices, las niñas felices',
        english: 'ACCENT: los hombres marroquíes, las mujeres marroquíes',
        highlight: ['niños felices', 'mujeres marroquíes']
      }
    ]
  },
  {
    title: 'Basic Adjective Position - After Noun',
    content: `**Most adjectives** go **after** the noun they modify:`,
    conjugationTable: {
      title: 'Adjectives That Follow Nouns',
      conjugations: [
        { pronoun: 'Color', form: 'After noun', english: 'la casa blanca (the white house)' },
        { pronoun: 'Shape', form: 'After noun', english: 'la mesa redonda (the round table)' },
        { pronoun: 'Nationality', form: 'After noun', english: 'la comida italiana (Italian food)' },
        { pronoun: 'Physical description', form: 'After noun', english: 'el hombre alto (the tall man)' },
        { pronoun: 'Personality', form: 'After noun', english: 'la mujer inteligente (the intelligent woman)' }
      ]
    },
    examples: [
      {
        spanish: 'COLOR: el coche rojo, la flor amarilla',
        english: 'NATIONALITY: el vino francés, la música española',
        highlight: ['coche rojo', 'música española']
      },
      {
        spanish: 'PHYSICAL: la niña pequeña, el edificio alto',
        english: 'PERSONALITY: el profesor paciente, la estudiante trabajadora',
        highlight: ['niña pequeña', 'estudiante trabajadora']
      }
    ]
  },
  {
    title: 'Adjectives That Precede Nouns',
    content: `**Certain adjectives** typically go **before** the noun:`,
    conjugationTable: {
      title: 'Adjectives That Precede Nouns',
      conjugations: [
        { pronoun: 'Numbers', form: 'Before noun', english: 'tres libros (three books)' },
        { pronoun: 'Possessives', form: 'Before noun', english: 'mi casa (my house)' },
        { pronoun: 'Demonstratives', form: 'Before noun', english: 'esta mesa (this table)' },
        { pronoun: 'Indefinites', form: 'Before noun', english: 'algunos estudiantes (some students)' },
        { pronoun: 'Evaluative', form: 'Before noun', english: 'una buena idea (a good idea)' }
      ]
    },
    examples: [
      {
        spanish: 'NUMBERS: dos hermanos, cinco libros',
        english: 'POSSESSIVE: nuestro coche, sus padres',
        highlight: ['dos hermanos', 'nuestro coche']
      },
      {
        spanish: 'DEMONSTRATIVE: esa mujer, estos niños',
        english: 'EVALUATIVE: una gran oportunidad, un mal día',
        highlight: ['esa mujer', 'gran oportunidad']
      }
    ]
  },
  {
    title: 'Adjectives That Change Meaning with Position',
    content: `**Some adjectives** have **different meanings** depending on position:`,
    conjugationTable: {
      title: 'Position-Dependent Meanings',
      conjugations: [
        { pronoun: 'gran/grande', form: 'great/big', english: 'una gran mujer (great woman) vs. una mujer grande (big woman)' },
        { pronoun: 'viejo/a', form: 'old (long-time)/old (age)', english: 'un viejo amigo (old friend) vs. un amigo viejo (elderly friend)' },
        { pronoun: 'pobre', form: 'poor (pitiful)/poor (money)', english: 'el pobre hombre (poor man - pitiful) vs. el hombre pobre (poor man - no money)' },
        { pronoun: 'nuevo/a', form: 'new (different)/new (recent)', english: 'mi nuevo coche (my new car - different) vs. mi coche nuevo (my new car - recent)' }
      ]
    },
    examples: [
      {
        spanish: 'BEFORE: Es una gran actriz. (She\'s a great actress.)',
        english: 'AFTER: Es una actriz grande. (She\'s a big actress - physically.)',
        highlight: ['gran actriz', 'actriz grande']
      },
      {
        spanish: 'BEFORE: Mi viejo profesor me ayudó. (My old teacher - long-time - helped me.)',
        english: 'AFTER: Mi profesor viejo se jubiló. (My old teacher - elderly - retired.)',
        highlight: ['viejo profesor', 'profesor viejo']
      }
    ]
  },
  {
    title: 'Apocopation - Shortened Adjective Forms',
    content: `**Some adjectives** shorten before **masculine singular nouns**:`,
    conjugationTable: {
      title: 'Apocopated Forms',
      conjugations: [
        { pronoun: 'bueno → buen', form: 'good', english: 'un buen hombre (a good man)' },
        { pronoun: 'malo → mal', form: 'bad', english: 'un mal día (a bad day)' },
        { pronoun: 'grande → gran', form: 'great', english: 'un gran escritor (a great writer)' },
        { pronoun: 'primero → primer', form: 'first', english: 'el primer día (the first day)' },
        { pronoun: 'tercero → tercer', form: 'third', english: 'el tercer piso (the third floor)' },
        { pronoun: 'alguno → algún', form: 'some', english: 'algún problema (some problem)' },
        { pronoun: 'ninguno → ningún', form: 'no', english: 'ningún estudiante (no student)' }
      ]
    },
    examples: [
      {
        spanish: 'MASCULINE SINGULAR: un buen libro, el primer capítulo',
        english: 'FEMININE/PLURAL: una buena idea, los primeros días',
        highlight: ['buen libro', 'buena idea']
      },
      {
        spanish: 'APOCOPATION: Es un gran hombre. (He\'s a great man.)',
        english: 'FULL FORM: Es una grande oportunidad. (It\'s a great opportunity.)',
        highlight: ['gran hombre', 'grande oportunidad']
      }
    ]
  },
  {
    title: 'Multiple Adjectives with One Noun',
    content: `**Multiple adjectives** can modify one noun with specific rules:`,
    examples: [
      {
        spanish: 'TWO AFTER: una casa grande y blanca (a big, white house)',
        english: 'ONE BEFORE, ONE AFTER: una gran casa blanca (a great white house)',
        highlight: ['casa grande y blanca', 'gran casa blanca']
      },
      {
        spanish: 'COORDINATION: un hombre alto, moreno y guapo (a tall, dark, and handsome man)',
        english: 'DIFFERENT TYPES: mi nuevo coche rojo (my new red car)',
        highlight: ['hombre alto, moreno y guapo', 'nuevo coche rojo']
      }
    ],
    subsections: [
      {
        title: 'Coordination Rules',
        content: 'When coordinating adjectives, use y (and) between the last two:',
        examples: [
          {
            spanish: 'THREE ADJECTIVES: una mujer joven, inteligente y trabajadora',
            english: 'TWO ADJECTIVES: un libro interesante y útil',
            highlight: ['joven, inteligente y trabajadora']
          }
        ]
      }
    ]
  },
  {
    title: 'Agreement with Mixed Gender Nouns',
    content: `When adjectives modify **mixed gender nouns**, use **masculine plural**:`,
    examples: [
      {
        spanish: 'MIXED: Los padres están contentos. (The parents are happy.)',
        english: 'EXPLANATION: padres = padre (m) + madre (f) → masculine plural',
        highlight: ['padres están contentos']
      },
      {
        spanish: 'MIXED: Los hermanos son altos. (The siblings are tall.)',
        english: 'EXPLANATION: hermanos = hermano (m) + hermana (f) → masculine plural',
        highlight: ['hermanos son altos']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong gender agreement**: Not matching adjective gender to noun
**2. Wrong number agreement**: Forgetting plural agreement
**3. Position errors**: Wrong adjective placement
**4. Apocopation mistakes**: Not shortening when required`,
    examples: [
      {
        spanish: '❌ la casa blanco → ✅ la casa blanca',
        english: 'Wrong: adjective must agree in gender',
        highlight: ['la casa blanca']
      },
      {
        spanish: '❌ los libros rojo → ✅ los libros rojos',
        english: 'Wrong: adjective must agree in number',
        highlight: ['los libros rojos']
      },
      {
        spanish: '❌ una idea buena → ✅ una buena idea',
        english: 'Better: evaluative adjectives usually precede',
        highlight: ['una buena idea']
      },
      {
        spanish: '❌ un bueno hombre → ✅ un buen hombre',
        english: 'Wrong: must use apocopated form before masculine singular',
        highlight: ['un buen hombre']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Adjective Types', url: '/grammar/spanish/adjectives/types', difficulty: 'beginner' },
  { title: 'Spanish Demonstrative Adjectives', url: '/grammar/spanish/nouns/demonstrative', difficulty: 'beginner' },
  { title: 'Spanish Possessive Adjectives', url: '/grammar/spanish/nouns/possessive-adj', difficulty: 'beginner' },
  { title: 'Spanish Comparative Adjectives', url: '/grammar/spanish/adjectives/comparative', difficulty: 'intermediate' }
];

export default function SpanishNounAdjectiveAgreementPage() {
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
              topic: 'agreement-position',
              title: 'Spanish Noun-Adjective Agreement and Position Rules',
              description: 'Master Spanish noun-adjective agreement including gender, number, and position rules for descriptive adjectives.',
              difficulty: 'beginner',
              examples: [
                'la casa blanca (the white house)',
                'los libros interesantes (the interesting books)',
                'una gran mujer (a great woman)',
                'las flores rojas (the red flowers)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'nouns',
              topic: 'agreement-position',
              title: 'Spanish Noun-Adjective Agreement and Position Rules'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="nouns"
        topic="agreement-position"
        title="Spanish Noun-Adjective Agreement and Position Rules"
        description="Master Spanish noun-adjective agreement including gender, number, and position rules for descriptive adjectives"
        difficulty="beginner"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/spanish/nouns"
        practiceUrl="/grammar/spanish/nouns/agreement-position/practice"
        quizUrl="/grammar/spanish/nouns/agreement-position/quiz"
        songUrl="/songs/es?theme=grammar&topic=agreement-position"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
