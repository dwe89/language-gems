import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'sounds-spelling',
  topic: 'written-accents',
  title: 'Spanish Written Accents (Tildes) - Rules and Usage',
  description: 'Master Spanish written accents (tildes) including accent rules, diacritical marks, and when to use accents in Spanish.',
  difficulty: 'intermediate',
  keywords: [
    'spanish accents',
    'spanish tildes',
    'accent rules spanish',
    'when to use accents spanish',
    'diacritical marks spanish',
    'spanish orthography'
  ],
  examples: [
    'café (coffee) - aguda ending in vowel',
    'árbol (tree) - llana ending in consonant',
    'médico (doctor) - all esdrújulas have accents',
    'sí (yes) vs si (if) - diacritical accent'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Written Accents (Tildes)',
    content: `Spanish **written accents** (tildes) are **systematic marks** that indicate **word stress** and **distinguish meanings**. They follow **clear, logical rules** based on stress patterns and word endings.

**Two main functions:**
- **Stress indication**: Show exceptions to normal stress rules
- **Meaning distinction**: Differentiate between similar words

**Types of accents:**
- **Stress accents**: Follow systematic rules (café, árbol, médico)
- **Diacritical accents**: Distinguish meaning (sí vs si, tú vs tu)
- **Interrogative accents**: Question words (qué, cómo, dónde)

**Key principles:**
- **Predictable system**: Clear rules determine when accents are needed
- **Stress-based**: Related to word stress patterns (agudas, llanas, esdrújulas)
- **Meaning preservation**: Essential for correct interpretation
- **No optional accents**: Every accent has a specific purpose

**Basic accent rules:**
- **Agudas**: Accent if ending in vowel, -n, or -s
- **Llanas**: Accent if ending in consonant (except -n, -s)
- **Esdrújulas**: Always have accent
- **Diacritical**: Distinguish between similar words

Understanding accent rules is **essential** for **correct Spanish spelling** and **clear communication**.`,
    examples: [
      {
        spanish: 'STRESS ACCENTS: café, árbol, médico',
        english: 'DIACRITICAL: sí (yes) vs si (if), tú (you) vs tu (your)',
        highlight: ['café, árbol, médico', 'sí vs si, tú vs tu']
      },
      {
        spanish: 'QUESTIONS: ¿Qué quieres? (What do you want?)',
        english: 'STATEMENTS: Quiero que vengas. (I want you to come.)',
        highlight: ['¿Qué quieres?', 'que vengas']
      }
    ]
  },
  {
    title: 'Accent Rules for Agudas',
    content: `**Agudas** (stress on last syllable) need accents when ending in **vowel**, **-n**, or **-s**:`,
    conjugationTable: {
      title: 'Agudas Accent Rules',
      conjugations: [
        { pronoun: 'Ending in vowel', form: 'NEEDS ACCENT', english: 'café, sofá, menú, bebé' },
        { pronoun: 'Ending in -n', form: 'NEEDS ACCENT', english: 'también, corazón, jamón, algún' },
        { pronoun: 'Ending in -s', form: 'NEEDS ACCENT', english: 'inglés, francés, después, compás' },
        { pronoun: 'Ending in consonant', form: 'NO ACCENT', english: 'trabajar, ciudad, español, natural' },
        { pronoun: 'Exception: -s after consonant', form: 'NO ACCENT', english: 'robots, clubs (foreign words)' }
      ]
    },
    examples: [
      {
        spanish: 'WITH ACCENT: café, también, inglés',
        english: 'WITHOUT ACCENT: trabajar, ciudad, español',
        highlight: ['café, también, inglés', 'trabajar, ciudad, español']
      }
    ],
    subsections: [
      {
        title: 'Memory Aid',
        content: 'Agudas need accents when they end "softly" (vowel, -n, -s):',
        examples: [
          {
            spanish: 'SOFT ENDINGS = ACCENT: café, corazón, inglés',
            english: 'HARD ENDINGS = NO ACCENT: trabajar, ciudad',
            highlight: ['SOFT ENDINGS', 'HARD ENDINGS']
          }
        ]
      }
    ]
  },
  {
    title: 'Accent Rules for Llanas',
    content: `**Llanas** (stress on second-to-last syllable) need accents when ending in **consonant** (except -n, -s):`,
    conjugationTable: {
      title: 'Llanas Accent Rules',
      conjugations: [
        { pronoun: 'Ending in vowel', form: 'NO ACCENT', english: 'mesa, libro, casa, problema' },
        { pronoun: 'Ending in -n', form: 'NO ACCENT', english: 'hablan, comen, joven, examen' },
        { pronoun: 'Ending in -s', form: 'NO ACCENT', english: 'libros, casas, crisis, lunes' },
        { pronoun: 'Ending in consonant', form: 'NEEDS ACCENT', english: 'árbol, fácil, lápiz, azúcar' },
        { pronoun: 'Exception: -s after consonant', form: 'NEEDS ACCENT', english: 'bíceps, fórceps' }
      ]
    },
    examples: [
      {
        spanish: 'WITHOUT ACCENT: mesa, hablan, libros',
        english: 'WITH ACCENT: árbol, fácil, lápiz',
        highlight: ['mesa, hablan, libros', 'árbol, fácil, lápiz']
      }
    ],
    subsections: [
      {
        title: 'Memory Aid',
        content: 'Llanas need accents when they end "hard" (consonant except -n, -s):',
        examples: [
          {
            spanish: 'HARD ENDINGS = ACCENT: árbol, fácil',
            english: 'SOFT ENDINGS = NO ACCENT: mesa, hablan',
            highlight: ['HARD ENDINGS', 'SOFT ENDINGS']
          }
        ]
      }
    ]
  },
  {
    title: 'Accent Rules for Esdrújulas',
    content: `**Esdrújulas** (stress on third-to-last syllable) **ALWAYS** need accents:`,
    conjugationTable: {
      title: 'Esdrújulas - Always Accented',
      conjugations: [
        { pronoun: 'médico', form: 'MÉ-di-co', english: 'doctor - always has accent' },
        { pronoun: 'música', form: 'MÚ-si-ca', english: 'music - always has accent' },
        { pronoun: 'teléfono', form: 'te-LÉ-fo-no', english: 'telephone - always has accent' },
        { pronoun: 'rápido', form: 'RÁ-pi-do', english: 'fast - always has accent' },
        { pronoun: 'público', form: 'PÚ-bli-co', english: 'public - always has accent' },
        { pronoun: 'académico', form: 'a-ca-DÉ-mi-co', english: 'academic - always has accent' }
      ]
    },
    examples: [
      {
        spanish: 'ALL HAVE ACCENTS: médico, música, teléfono, rápido',
        english: 'NO EXCEPTIONS: Every esdrújula has a written accent',
        highlight: ['médico, música', 'Every esdrújula']
      }
    ],
    subsections: [
      {
        title: 'Simple Rule',
        content: 'If you can identify an esdrújula, it ALWAYS has an accent:',
        examples: [
          {
            spanish: '100% RULE: All esdrújulas = accent mark',
            english: 'No need to check ending - always accented',
            highlight: ['100% RULE']
          }
        ]
      }
    ]
  },
  {
    title: 'Diacritical Accents',
    content: `**Diacritical accents** distinguish between words with **identical spelling** but **different meanings**:`,
    conjugationTable: {
      title: 'Common Diacritical Accents',
      conjugations: [
        { pronoun: 'sí', form: 'yes', english: 'si = if (conditional)' },
        { pronoun: 'tú', form: 'you (subject)', english: 'tu = your (possessive)' },
        { pronoun: 'él', form: 'he', english: 'el = the (article)' },
        { pronoun: 'mí', form: 'me (after preposition)', english: 'mi = my (possessive)' },
        { pronoun: 'sé', form: 'I know / be! (command)', english: 'se = reflexive pronoun' },
        { pronoun: 'dé', form: 'give! (command)', english: 'de = of, from (preposition)' }
      ]
    },
    examples: [
      {
        spanish: 'Sí, quiero café. (Yes, I want coffee.)',
        english: 'Si quieres, ven. (If you want, come.)',
        highlight: ['Sí, quiero', 'Si quieres']
      },
      {
        spanish: 'Tú eres mi amigo. (You are my friend.)',
        english: 'Tu casa es bonita. (Your house is pretty.)',
        highlight: ['Tú eres', 'Tu casa']
      }
    ]
  },
  {
    title: 'Interrogative and Exclamatory Accents',
    content: `**Question and exclamation words** have accents when used **interrogatively** or **exclamatorily**:`,
    conjugationTable: {
      title: 'Interrogative/Exclamatory Accents',
      conjugations: [
        { pronoun: 'qué', form: 'what', english: 'que = that (relative/conjunction)' },
        { pronoun: 'cómo', form: 'how', english: 'como = like, as (comparison)' },
        { pronoun: 'dónde', form: 'where', english: 'donde = where (relative)' },
        { pronoun: 'cuándo', form: 'when', english: 'cuando = when (relative)' },
        { pronoun: 'quién', form: 'who', english: 'quien = who (relative)' },
        { pronoun: 'cuál', form: 'which', english: 'cual = which (relative)' }
      ]
    },
    examples: [
      {
        spanish: '¿Qué quieres? (What do you want?)',
        english: 'Quiero que vengas. (I want you to come.)',
        highlight: ['¿Qué quieres?', 'que vengas']
      },
      {
        spanish: '¿Cómo estás? (How are you?)',
        english: 'Habla como un nativo. (He speaks like a native.)',
        highlight: ['¿Cómo estás?', 'como un nativo']
      }
    ]
  },
  {
    title: 'Accents in Verb Forms',
    content: `**Verb conjugations** follow regular accent rules:`,
    conjugationTable: {
      title: 'Verb Accent Patterns',
      conjugations: [
        { pronoun: 'Preterite', form: 'hablé, comí, viví', english: 'Agudas ending in vowel = accent' },
        { pronoun: 'Future', form: 'hablaré, comeré, viviré', english: 'Agudas ending in vowel = accent' },
        { pronoun: 'Conditional', form: 'hablaría, comería, viviría', english: 'Llanas ending in vowel = no accent' },
        { pronoun: 'Imperfect', form: 'hablaba, comía, vivía', english: 'Llanas ending in vowel = no accent' },
        { pronoun: 'Present', form: 'hablo, como, vivo', english: 'Llanas ending in vowel = no accent' }
      ]
    },
    examples: [
      {
        spanish: 'ACCENTED: hablé, hablarás, hablaría',
        english: 'NOT ACCENTED: hablo, hablaba, hablando',
        highlight: ['hablé, hablarás', 'hablo, hablaba']
      }
    ]
  },
  {
    title: 'Accents with Pronouns Attached',
    content: `When **pronouns attach** to verbs, accent rules may change:`,
    examples: [
      {
        spanish: 'habla (llana) + me = háblame (esdrújula)',
        english: 'compra (llana) + lo = cómpralo (esdrújula)',
        highlight: ['habla → háblame', 'compra → cómpralo']
      },
      {
        spanish: 'dando (llana) + selo = dándoselo (esdrújula)',
        english: 'Adding pronouns can create esdrújulas',
        highlight: ['dando → dándoselo']
      }
    ],
    subsections: [
      {
        title: 'Rule Application',
        content: 'Apply accent rules to the new word formed:',
        examples: [
          {
            spanish: 'Original word + pronouns = new word',
            english: 'Check stress pattern of complete new word',
            highlight: ['new word']
          }
        ]
      }
    ]
  },
  {
    title: 'Accents in Adverbs (-mente)',
    content: `**Adverbs ending in -mente** keep the accent if the **original adjective** had one:`,
    conjugationTable: {
      title: 'Adverb Accent Preservation',
      conjugations: [
        { pronoun: 'rápido', form: 'rápidamente', english: 'Adjective has accent → adverb keeps it' },
        { pronoun: 'fácil', form: 'fácilmente', english: 'Adjective has accent → adverb keeps it' },
        { pronoun: 'lento', form: 'lentamente', english: 'Adjective has no accent → adverb has none' },
        { pronoun: 'claro', form: 'claramente', english: 'Adjective has no accent → adverb has none' }
      ]
    },
    examples: [
      {
        spanish: 'WITH ACCENT: rápidamente, fácilmente, difícilmente',
        english: 'WITHOUT ACCENT: lentamente, claramente, simplemente',
        highlight: ['rápidamente, fácilmente', 'lentamente, claramente']
      }
    ]
  },
  {
    title: 'Capital Letters and Accents',
    content: `**Capital letters** in Spanish **DO need accents** when required:`,
    examples: [
      {
        spanish: 'CORRECT: Ángel, África, Último, TELÉFONO',
        english: 'INCORRECT: Angel, Africa, Ultimo, TELEFONO',
        highlight: ['Ángel, África', 'Angel, Africa']
      },
      {
        spanish: 'Names: Óscar, Mónica, José, María',
        english: 'Countries: México, Perú, Panamá',
        highlight: ['Óscar, Mónica', 'México, Perú']
      }
    ],
    subsections: [
      {
        title: 'Official Rule',
        content: 'RAE (Royal Spanish Academy) requires accents on capitals:',
        examples: [
          {
            spanish: 'ALL CAPS: MÉDICO, TELÉFONO, CORAZÓN',
            english: 'Never omit accents, even in capitals',
            highlight: ['MÉDICO, TELÉFONO']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Accent Mistakes',
    content: `Here are frequent errors students make:

**1. Ignoring diacritical accents**: Not distinguishing sí/si, tú/tu
**2. Wrong question word accents**: Using que instead of qué
**3. Verb form confusion**: Wrong accents in conjugations
**4. Capital letter omission**: Not accenting capital letters`,
    examples: [
      {
        spanish: '❌ Si, quiero café → ✅ Sí, quiero café',
        english: 'Wrong: need diacritical accent for "yes"',
        highlight: ['Sí, quiero café']
      },
      {
        spanish: '❌ ¿Que quieres? → ✅ ¿Qué quieres?',
        english: 'Wrong: question words need accents',
        highlight: ['¿Qué quieres?']
      },
      {
        spanish: '❌ hable → ✅ hablé (I spoke)',
        english: 'Wrong: preterite first person needs accent',
        highlight: ['hablé']
      },
      {
        spanish: '❌ MEXICO → ✅ MÉXICO',
        english: 'Wrong: capital letters need accents too',
        highlight: ['MÉXICO']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Stress Patterns', url: '/grammar/spanish/sounds-spelling/stress-patterns', difficulty: 'intermediate' },
  { title: 'Spanish Sound-Symbol Correspondences', url: '/grammar/spanish/sounds-spelling/sound-symbol', difficulty: 'beginner' },
  { title: 'Spanish Interrogative Pronouns', url: '/grammar/spanish/pronouns/interrogative', difficulty: 'intermediate' },
  { title: 'Spanish Verb Conjugation', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' }
];

export default function SpanishWrittenAccentsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'sounds-spelling',
              topic: 'written-accents',
              title: 'Spanish Written Accents (Tildes) - Rules and Usage',
              description: 'Master Spanish written accents (tildes) including accent rules, diacritical marks, and when to use accents in Spanish.',
              difficulty: 'intermediate',
              examples: [
                'café (coffee) - aguda ending in vowel',
                'árbol (tree) - llana ending in consonant',
                'médico (doctor) - all esdrújulas have accents',
                'sí (yes) vs si (if) - diacritical accent'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'sounds-spelling',
              topic: 'written-accents',
              title: 'Spanish Written Accents (Tildes) - Rules and Usage'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="sounds-spelling"
        topic="written-accents"
        title="Spanish Written Accents (Tildes) - Rules and Usage"
        description="Master Spanish written accents (tildes) including accent rules, diacritical marks, and when to use accents in Spanish"
        difficulty="intermediate"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/spanish/sounds-spelling"
        practiceUrl="/grammar/spanish/sounds-spelling/written-accents/practice"
        quizUrl="/grammar/spanish/sounds-spelling/written-accents/quiz"
        songUrl="/songs/es?theme=grammar&topic=written-accents"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
