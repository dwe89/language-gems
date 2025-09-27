import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'sounds-spelling',
  topic: 'stress-patterns',
  title: 'Spanish Stress Patterns (Word Stress Rules and Pronunciation)',
  description: 'Master Spanish stress patterns including agudas, llanas, esdrújulas, and stress placement rules for correct pronunciation.',
  difficulty: 'intermediate',
  keywords: [
    'spanish stress patterns',
    'spanish word stress',
    'agudas llanas esdrujulas',
    'spanish pronunciation stress',
    'stress rules spanish',
    'spanish accent patterns'
  ],
  examples: [
    'agudas: café, español, trabajar',
    'llanas: mesa, libro, hablan',
    'esdrújulas: médico, música, teléfono',
    'sobresdrújulas: dígamelo, cómpramelo'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Stress Patterns',
    content: `Spanish **word stress** follows **predictable patterns** based on word endings and syllable structure. Understanding stress is **crucial** for **correct pronunciation** and **natural-sounding Spanish**.

**Four types of stress patterns:**
- **Agudas (oxytone)**: Stress on last syllable
- **Llanas/Graves (paroxytone)**: Stress on second-to-last syllable  
- **Esdrújulas (proparoxytone)**: Stress on third-to-last syllable
- **Sobresdrújulas**: Stress on fourth-to-last syllable (rare)

**Key principles:**
- **Predictable rules**: Most words follow clear patterns
- **Written accents**: Mark exceptions to rules
- **Pronunciation guide**: Stress affects meaning and clarity
- **Natural rhythm**: Creates Spanish's characteristic rhythm

**Why stress matters:**
- **Meaning differences**: Stress can change word meaning
- **Natural pronunciation**: Essential for fluent speech
- **Listening comprehension**: Helps identify word boundaries
- **Spelling accuracy**: Determines when accents are needed

**Basic rule:**
- **Words ending in vowel, -n, -s**: Usually llanas (stress second-to-last)
- **Words ending in consonant (except -n, -s)**: Usually agudas (stress last)
- **Exceptions**: Marked with written accents

Mastering stress patterns is **fundamental** for **accurate Spanish pronunciation** and **confident communication**.`,
    examples: [
      {
        spanish: 'AGUDAS: café, español, trabajar, ciudad',
        english: 'LLANAS: mesa, libro, hablan, crisis',
        highlight: ['café, español', 'mesa, libro']
      },
      {
        spanish: 'ESDRÚJULAS: médico, música, teléfono',
        english: 'SOBRESDRÚJULAS: dígamelo, cómpramelo',
        highlight: ['médico, música', 'dígamelo']
      },
      {
        spanish: 'MEANING CHANGE: papa (potato) vs papá (dad)',
        english: 'STRESS MATTERS: Different stress = different word',
        highlight: ['papa vs papá']
      }
    ]
  },
  {
    title: 'Agudas (Oxytone Words)',
    content: `**Agudas** have stress on the **last syllable**:`,
    conjugationTable: {
      title: 'Agudas - Stress on Last Syllable',
      conjugations: [
        { pronoun: 'café', form: 'ca-FÉ', english: 'coffee (ends in vowel + accent)' },
        { pronoun: 'español', form: 'es-pa-ÑOL', english: 'Spanish (ends in consonant, no accent)' },
        { pronoun: 'trabajar', form: 'tra-ba-JAR', english: 'to work (infinitive, ends in -r)' },
        { pronoun: 'ciudad', form: 'ciu-DAD', english: 'city (ends in -d, no accent)' },
        { pronoun: 'también', form: 'tam-BIÉN', english: 'also (ends in -n + accent)' },
        { pronoun: 'inglés', form: 'in-GLÉS', english: 'English (ends in -s + accent)' }
      ]
    },
    examples: [
      {
        spanish: 'NO ACCENT NEEDED: trabajar, ciudad, español, natural',
        english: 'ACCENT NEEDED: café, también, inglés, corazón',
        highlight: ['trabajar, ciudad', 'café, también']
      }
    ],
    subsections: [
      {
        title: 'Agudas Accent Rules',
        content: 'Agudas need written accent when ending in vowel, -n, or -s:',
        examples: [
          {
            spanish: 'WITH ACCENT: café, sofá, mamá, papá',
            english: 'WITH ACCENT: también, corazón, inglés, francés',
            highlight: ['café, sofá', 'también, inglés']
          }
        ]
      }
    ]
  },
  {
    title: 'Llanas/Graves (Paroxytone Words)',
    content: `**Llanas** have stress on the **second-to-last syllable** (most common pattern):`,
    conjugationTable: {
      title: 'Llanas - Stress on Second-to-Last Syllable',
      conjugations: [
        { pronoun: 'mesa', form: 'ME-sa', english: 'table (ends in vowel, no accent)' },
        { pronoun: 'libro', form: 'LI-bro', english: 'book (ends in vowel, no accent)' },
        { pronoun: 'hablan', form: 'HA-blan', english: 'they speak (ends in -n, no accent)' },
        { pronoun: 'crisis', form: 'CRI-sis', english: 'crisis (ends in -s, no accent)' },
        { pronoun: 'árbol', form: 'ÁR-bol', english: 'tree (ends in consonant + accent)' },
        { pronoun: 'fácil', form: 'FÁ-cil', english: 'easy (ends in consonant + accent)' }
      ]
    },
    examples: [
      {
        spanish: 'NO ACCENT NEEDED: mesa, libro, hablan, crisis',
        english: 'ACCENT NEEDED: árbol, fácil, lápiz, azúcar',
        highlight: ['mesa, libro', 'árbol, fácil']
      }
    ],
    subsections: [
      {
        title: 'Llanas Accent Rules',
        content: 'Llanas need written accent when ending in consonant (except -n, -s):',
        examples: [
          {
            spanish: 'WITH ACCENT: árbol, fácil, lápiz, mártir',
            english: 'NO ACCENT: mesa, hablan, crisis, examen',
            highlight: ['árbol, fácil', 'mesa, hablan']
          }
        ]
      }
    ]
  },
  {
    title: 'Esdrújulas (Proparoxytone Words)',
    content: `**Esdrújulas** have stress on the **third-to-last syllable** (always need accent):`,
    conjugationTable: {
      title: 'Esdrújulas - Stress on Third-to-Last Syllable',
      conjugations: [
        { pronoun: 'médico', form: 'MÉ-di-co', english: 'doctor (always has accent)' },
        { pronoun: 'música', form: 'MÚ-si-ca', english: 'music (always has accent)' },
        { pronoun: 'teléfono', form: 'te-LÉ-fo-no', english: 'telephone (always has accent)' },
        { pronoun: 'rápido', form: 'RÁ-pi-do', english: 'fast (always has accent)' },
        { pronoun: 'público', form: 'PÚ-bli-co', english: 'public (always has accent)' },
        { pronoun: 'matemáticas', form: 'ma-te-MÁ-ti-cas', english: 'mathematics (always has accent)' }
      ]
    },
    examples: [
      {
        spanish: 'ALL NEED ACCENT: médico, música, teléfono, rápido',
        english: 'RULE: All esdrújulas have written accent',
        highlight: ['médico, música', 'teléfono, rápido']
      }
    ],
    subsections: [
      {
        title: 'Esdrújulas Rule',
        content: 'ALL esdrújulas need written accent - no exceptions:',
        examples: [
          {
            spanish: 'académico, económico, histórico, político',
            english: 'Every single esdrújula word has an accent mark',
            highlight: ['académico', 'económico']
          }
        ]
      }
    ]
  },
  {
    title: 'Sobresdrújulas (Rare Pattern)',
    content: `**Sobresdrújulas** have stress on the **fourth-to-last syllable** (very rare):`,
    conjugationTable: {
      title: 'Sobresdrújulas - Stress on Fourth-to-Last Syllable',
      conjugations: [
        { pronoun: 'dígamelo', form: 'DÍ-ga-me-lo', english: 'tell it to me (command + pronouns)' },
        { pronoun: 'cómpramelo', form: 'CÓM-pra-me-lo', english: 'buy it for me (command + pronouns)' },
        { pronoun: 'explícaselo', form: 'ex-PLÍ-ca-se-lo', english: 'explain it to him/her (command + pronouns)' },
        { pronoun: 'rápidamente', form: 'rá-pi-da-MEN-te', english: 'quickly (adverb, stress shifts)' }
      ]
    },
    examples: [
      {
        spanish: 'COMMANDS + PRONOUNS: dígamelo, cómpramelo, explícaselo',
        english: 'ALL NEED ACCENT: Very rare but always accented',
        highlight: ['dígamelo', 'cómpramelo']
      }
    ],
    subsections: [
      {
        title: 'Formation',
        content: 'Usually formed by adding pronouns to commands:',
        examples: [
          {
            spanish: 'diga + me + lo = dígamelo',
            english: 'compra + me + lo = cómpramelo',
            highlight: ['dígamelo', 'cómpramelo']
          }
        ]
      }
    ]
  },
  {
    title: 'Stress in Verb Forms',
    content: `**Verb conjugations** follow stress patterns:`,
    conjugationTable: {
      title: 'Verb Stress Patterns',
      conjugations: [
        { pronoun: 'Infinitives', form: 'Agudas', english: 'hablar, comer, vivir (stress last syllable)' },
        { pronoun: 'Present tense', form: 'Mixed', english: 'hablo (llana), hablas (llana), habla (llana)' },
        { pronoun: 'Preterite', form: 'Mixed', english: 'hablé (aguda), hablaste (llana), habló (aguda)' },
        { pronoun: 'Imperfect', form: 'Llanas', english: 'hablaba, hablabas, hablaba (all llanas)' },
        { pronoun: 'Future', form: 'Agudas', english: 'hablaré, hablarás, hablará (all agudas)' },
        { pronoun: 'Conditional', form: 'Llanas', english: 'hablaría, hablarías, hablaría (all llanas)' }
      ]
    },
    examples: [
      {
        spanish: 'INFINITIVES: hablar, comer, vivir (all agudas)',
        english: 'FUTURE: hablaré, comerás, vivirá (all agudas)',
        highlight: ['hablar, comer', 'hablaré, comerás']
      }
    ]
  },
  {
    title: 'Stress Changes with Plurals',
    content: `**Plural formation** can change stress patterns:`,
    examples: [
      {
        spanish: 'joven (llana) → jóvenes (esdrújula)',
        english: 'examen (llana) → exámenes (esdrújula)',
        highlight: ['joven → jóvenes', 'examen → exámenes']
      },
      {
        spanish: 'inglés (aguda) → ingleses (llana)',
        english: 'francés (aguda) → franceses (llana)',
        highlight: ['inglés → ingleses', 'francés → franceses']
      }
    ],
    subsections: [
      {
        title: 'Pattern Changes',
        content: 'Adding syllables can shift stress category:',
        examples: [
          {
            spanish: 'When adding -es, stress may shift category',
            english: 'Original stress position stays, but category changes',
            highlight: ['stress may shift']
          }
        ]
      }
    ]
  },
  {
    title: 'Stress in Compound Words',
    content: `**Compound words** usually keep the stress of the **last element**:`,
    examples: [
      {
        spanish: 'saca + corchos = sacacorchos (stress on -cor-)',
        english: 'para + caídas = paracaídas (stress on -caí-)',
        highlight: ['sacacorchos', 'paracaídas']
      },
      {
        spanish: 'medio + día = mediodía (stress on -dí-)',
        english: 'boca + calle = bocacalle (stress on -ca-)',
        highlight: ['mediodía', 'bocacalle']
      }
    ]
  },
  {
    title: 'Stress and Meaning',
    content: `**Stress position** can **change word meaning**:`,
    conjugationTable: {
      title: 'Stress Changes Meaning',
      conjugations: [
        { pronoun: 'papa', form: 'PA-pa (llana)', english: 'potato' },
        { pronoun: 'papá', form: 'pa-PÁ (aguda)', english: 'dad' },
        { pronoun: 'público', form: 'PÚ-bli-co (esdrújula)', english: 'public (adjective)' },
        { pronoun: 'publicó', form: 'pu-bli-CÓ (aguda)', english: 'he/she published' },
        { pronoun: 'término', form: 'TÉR-mi-no (esdrújula)', english: 'term/end' },
        { pronoun: 'terminó', form: 'ter-mi-NÓ (aguda)', english: 'he/she finished' }
      ]
    },
    examples: [
      {
        spanish: 'papa (potato) vs papá (dad)',
        english: 'público (public) vs publicó (published)',
        highlight: ['papa vs papá', 'público vs publicó']
      }
    ]
  },
  {
    title: 'Identifying Stress in Speech',
    content: `**How to hear stress** in Spanish words:`,
    examples: [
      {
        spanish: 'LOUDER: Stressed syllable is pronounced louder',
        english: 'LONGER: Stressed syllable lasts slightly longer',
        highlight: ['LOUDER', 'LONGER']
      },
      {
        spanish: 'CLEARER: Vowel in stressed syllable is clearer',
        english: 'HIGHER: Often (but not always) higher in pitch',
        highlight: ['CLEARER', 'HIGHER']
      }
    ],
    subsections: [
      {
        title: 'Practice Tip',
        content: 'Clap or tap to feel the rhythm:',
        examples: [
          {
            spanish: 'te-LÉ-fo-no (clap on LÉ)',
            english: 'es-pa-ÑOL (clap on ÑOL)',
            highlight: ['LÉ', 'ÑOL']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Stress Mistakes',
    content: `Here are frequent errors students make:

**1. English interference**: Using English stress patterns
**2. Ignoring accents**: Not stressing accented syllables
**3. Wrong verb stress**: Incorrect stress in conjugations
**4. Compound confusion**: Wrong stress in compound words`,
    examples: [
      {
        spanish: '❌ te-le-FO-no → ✅ te-LÉ-fo-no',
        english: 'Wrong: don\'t use English stress patterns',
        highlight: ['te-LÉ-fo-no']
      },
      {
        spanish: '❌ MU-si-ca → ✅ MÚ-si-ca',
        english: 'Wrong: must stress the accented syllable',
        highlight: ['MÚ-si-ca']
      },
      {
        spanish: '❌ HA-bla-ré → ✅ ha-bla-RÉ',
        english: 'Wrong: future tense is aguda (stress last syllable)',
        highlight: ['ha-bla-RÉ']
      },
      {
        spanish: '❌ SA-ca-cor-chos → ✅ sa-ca-COR-chos',
        english: 'Wrong: compound words keep stress of last element',
        highlight: ['sa-ca-COR-chos']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Written Accents', url: '/grammar/spanish/sounds-spelling/written-accents', difficulty: 'intermediate' },
  { title: 'Spanish Sound-Symbol Correspondences', url: '/grammar/spanish/sounds-spelling/sound-symbol', difficulty: 'beginner' },
  { title: 'Spanish Pronunciation Guide', url: '/pronunciation/spanish', difficulty: 'beginner' },
  { title: 'Spanish Syllable Structure', url: '/grammar/spanish/sounds-spelling/syllables', difficulty: 'intermediate' }
];

export default function SpanishStressPatternsPage() {
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
              topic: 'stress-patterns',
              title: 'Spanish Stress Patterns (Word Stress Rules and Pronunciation)',
              description: 'Master Spanish stress patterns including agudas, llanas, esdrújulas, and stress placement rules for correct pronunciation.',
              difficulty: 'intermediate',
              examples: [
                'agudas: café, español, trabajar',
                'llanas: mesa, libro, hablan',
                'esdrújulas: médico, música, teléfono',
                'sobresdrújulas: dígamelo, cómpramelo'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'sounds-spelling',
              topic: 'stress-patterns',
              title: 'Spanish Stress Patterns (Word Stress Rules and Pronunciation)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="sounds-spelling"
        topic="stress-patterns"
        title="Spanish Stress Patterns (Word Stress Rules and Pronunciation)"
        description="Master Spanish stress patterns including agudas, llanas, esdrújulas, and stress placement rules for correct pronunciation"
        difficulty="intermediate"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/spanish/sounds-spelling"
        practiceUrl="/grammar/spanish/sounds-spelling/stress-patterns/practice"
        quizUrl="/grammar/spanish/sounds-spelling/stress-patterns/quiz"
        songUrl="/songs/es?theme=grammar&topic=stress-patterns"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
