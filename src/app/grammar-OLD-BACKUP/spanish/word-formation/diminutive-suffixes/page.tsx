import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'word-formation',
  topic: 'diminutive-suffixes',
  title: 'Spanish Diminutive Suffixes (-ito, -illo, -ico) - Formation and Usage',
  description: 'Master Spanish diminutive suffixes including -ito, -illo, -ico formation rules, regional variations, and cultural usage.',
  difficulty: 'intermediate',
  keywords: [
    'spanish diminutives',
    'ito illo ico spanish',
    'diminutive suffixes spanish',
    'spanish word formation',
    'spanish endearment',
    'spanish morphology'
  ],
  examples: [
    'casa → casita (little house)',
    'perro → perrito (little dog)',
    'momento → momentito (little moment)',
    'abuelo → abuelito (grandpa)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Diminutive Suffixes',
    content: `Spanish **diminutive suffixes** are **morphological endings** that express **smallness**, **endearment**, **affection**, or **intensity reduction**. They are **highly productive** and **culturally significant** in Spanish-speaking countries.

**Main diminutive suffixes:**
- **-ito/-ita**: Most common and neutral (casita, perrito)
- **-illo/-illa**: Traditional, sometimes archaic (ventanilla, mesilla)
- **-ico/-ica**: Regional, especially Costa Rica (momentico, ratico)
- **-ín/-ina**: Less common (pequeñín, chiquitina)

**Functions of diminutives:**
- **Size reduction**: Indicate something is small
- **Endearment**: Express affection or tenderness
- **Politeness**: Soften requests or statements
- **Intensity reduction**: Make something seem less serious
- **Cultural expression**: Show familiarity and warmth

**Key characteristics:**
- **Gender agreement**: Match the gender of the base word
- **Stress preservation**: Usually maintain original stress pattern
- **Regional variation**: Different preferences across countries
- **Emotional connotation**: Often carry positive feelings

**Cultural importance:**
- **Frequent use**: Very common in everyday speech
- **Social bonding**: Create intimacy and closeness
- **Politeness strategy**: Make requests more gentle
- **Identity marker**: Part of Spanish cultural expression

Understanding diminutives is **essential** for **natural Spanish communication** and **cultural competence**.`,
    examples: [
      {
        spanish: 'SIZE: casa → casita (little house)',
        english: 'ENDEARMENT: mamá → mamita (mommy)',
        highlight: ['casa → casita', 'mamá → mamita']
      },
      {
        spanish: 'POLITENESS: ¿Un favorcito? (A little favor?)',
        english: 'INTENSITY: problemita (little problem)',
        highlight: ['favorcito', 'problemita']
      },
      {
        spanish: 'CULTURAL: abuelita (grandma), hijito (son)',
        english: 'AFFECTION: corazoncito (little heart)',
        highlight: ['abuelita, hijito', 'corazoncito']
      }
    ]
  },
  {
    title: '-ITO/-ITA: Most Common Diminutive',
    content: `**-ito/-ita** is the **most widely used** diminutive suffix across all Spanish-speaking countries:`,
    conjugationTable: {
      title: 'Formation Rules for -ito/-ita',
      conjugations: [
        { pronoun: 'Ends in -o/-a', form: 'Drop vowel + -ito/-ita', english: 'gato → gatito, casa → casita' },
        { pronoun: 'Ends in -e', form: 'Drop -e + -ito/-ita', english: 'coche → cochecito, noche → nochecita' },
        { pronoun: 'Ends in consonant', form: 'Add -ito/-ita', english: 'animal → animalito, papel → papelito' },
        { pronoun: 'Ends in -n/-r', form: 'Add -cito/-cita', english: 'ratón → ratoncito, mujer → mujercita' },
        { pronoun: 'Special changes', form: 'Stem changes', english: 'poco → poquito, agua → agüita' }
      ]
    },
    examples: [
      {
        spanish: 'REGULAR: gato → gatito, casa → casita',
        english: 'WITH -c-: ratón → ratoncito, mujer → mujercita',
        highlight: ['gato → gatito', 'ratón → ratoncito']
      },
      {
        spanish: 'CONSONANT: animal → animalito, papel → papelito',
        english: 'SPECIAL: poco → poquito, agua → agüita',
        highlight: ['animal → animalito', 'poco → poquito']
      }
    ],
    subsections: [
      {
        title: 'Spelling Changes',
        content: 'Some words require spelling adjustments:',
        examples: [
          {
            spanish: 'c → qu: chico → chiquito, poco → poquito',
            english: 'g → gu: amigo → amiguito, juego → jueguito',
            highlight: ['chico → chiquito', 'amigo → amiguito']
          }
        ]
      }
    ]
  },
  {
    title: '-ILLO/-ILLA: Traditional Diminutive',
    content: `**-illo/-illa** is a **traditional diminutive** with **regional preferences** and **specific uses**:`,
    conjugationTable: {
      title: 'Formation Rules for -illo/-illa',
      conjugations: [
        { pronoun: 'Ends in -o/-a', form: 'Drop vowel + -illo/-illa', english: 'ventana → ventanilla, mesa → mesilla' },
        { pronoun: 'Ends in -e', form: 'Drop -e + -illo/-illa', english: 'calle → callecilla' },
        { pronoun: 'Ends in consonant', form: 'Add -illo/-illa', english: 'pan → panillo' },
        { pronoun: 'Common words', form: 'Fixed forms', english: 'cigarrillo, bolsillo, pastilla' }
      ]
    },
    examples: [
      {
        spanish: 'COMMON: ventanilla (small window), mesilla (nightstand)',
        english: 'FIXED: cigarrillo (cigarette), bolsillo (pocket)',
        highlight: ['ventanilla', 'cigarrillo, bolsillo']
      },
      {
        spanish: 'REGIONAL: More common in Spain and some regions',
        english: 'ARCHAIC: Sometimes sounds old-fashioned',
        highlight: ['More common in Spain']
      }
    ],
    subsections: [
      {
        title: 'Lexicalized Forms',
        content: 'Many -illo words have become independent words:',
        examples: [
          {
            spanish: 'cigarrillo (cigarette), cuchillo (knife)',
            english: 'These are no longer felt as diminutives',
            highlight: ['cigarrillo, cuchillo']
          }
        ]
      }
    ]
  },
  {
    title: '-ICO/-ICA: Regional Diminutive',
    content: `**-ico/-ica** is **regionally specific**, especially common in **Costa Rica** and some **Colombian regions**:`,
    conjugationTable: {
      title: 'Formation Rules for -ico/-ica',
      conjugations: [
        { pronoun: 'After -t', form: 'Replace with -ico/-ica', english: 'momento → momentico, ratito → ratico' },
        { pronoun: 'Regular formation', form: 'Add -ico/-ica', english: 'casa → casica, perro → perrico' },
        { pronoun: 'Costa Rica usage', form: 'Very common', english: 'ratico (little while), momentico (little moment)' },
        { pronoun: 'Colombia usage', form: 'Regional variation', english: 'Some areas prefer -ico' }
      ]
    },
    examples: [
      {
        spanish: 'COSTA RICA: ratico (little while), momentico (little moment)',
        english: 'COLOMBIA: Some regions use -ico regularly',
        highlight: ['ratico, momentico']
      },
      {
        spanish: 'AFTER -t: momento → momentico, rato → ratico',
        english: 'GENERAL: casa → casica, gato → gatico',
        highlight: ['momento → momentico', 'casa → casica']
      }
    ]
  },
  {
    title: 'Other Diminutive Suffixes',
    content: `**Less common** but still important diminutive suffixes:`,
    conjugationTable: {
      title: 'Other Diminutive Suffixes',
      conjugations: [
        { pronoun: '-ín/-ina', form: 'pequeñín, chiquitina', english: 'Often with children or cute things' },
        { pronoun: '-uelo/-uela', form: 'riachuelo, plazuela', english: 'Traditional, somewhat archaic' },
        { pronoun: '-ete/-eta', form: 'amiguete, caseta', english: 'Informal, sometimes pejorative' },
        { pronoun: '-uco/-uca', form: 'casuca, ventanuco', english: 'Often pejorative or ugly' }
      ]
    },
    examples: [
      {
        spanish: 'CUTE: pequeñín (little one), chiquitina (little girl)',
        english: 'ARCHAIC: riachuelo (stream), plazuela (small square)',
        highlight: ['pequeñín, chiquitina', 'riachuelo, plazuela']
      }
    ]
  },
  {
    title: 'Double Diminutives',
    content: `Spanish allows **multiple diminutive suffixes** for **extra emphasis**:`,
    examples: [
      {
        spanish: 'chico → chiquito → chiquitito (very very small)',
        english: 'poco → poquito → poquitito (very very little)',
        highlight: ['chico → chiquito → chiquitito', 'poco → poquito → poquitito']
      },
      {
        spanish: 'pequeño → pequeñito → pequeñitito',
        english: 'casa → casita → casitita',
        highlight: ['pequeño → pequeñito → pequeñitito', 'casa → casita → casitita']
      }
    ],
    subsections: [
      {
        title: 'Usage',
        content: 'Double diminutives express extreme smallness or endearment:',
        examples: [
          {
            spanish: 'Used with children, pets, or beloved objects',
            english: 'Shows maximum affection or emphasis',
            highlight: ['maximum affection']
          }
        ]
      }
    ]
  },
  {
    title: 'Diminutives with Names',
    content: `**Personal names** commonly use diminutives for **affection** and **familiarity**:`,
    conjugationTable: {
      title: 'Name Diminutives',
      conjugations: [
        { pronoun: 'Carlos', form: 'Carlitos', english: 'Common affectionate form' },
        { pronoun: 'Ana', form: 'Anita', english: 'Standard diminutive' },
        { pronoun: 'Miguel', form: 'Miguelito', english: 'Endearing form' },
        { pronoun: 'Carmen', form: 'Carmencita', english: 'Affectionate diminutive' },
        { pronoun: 'José', form: 'Joselito', english: 'Familiar form' },
        { pronoun: 'María', form: 'Marita', english: 'Common nickname' }
      ]
    },
    examples: [
      {
        spanish: 'FAMILY: abuelito (grandpa), mamita (mommy)',
        english: 'FRIENDS: Carlitos, Anita, Miguelito',
        highlight: ['abuelito, mamita', 'Carlitos, Anita']
      }
    ]
  },
  {
    title: 'Pragmatic Uses of Diminutives',
    content: `Diminutives serve **important social functions** beyond indicating size:`,
    conjugationTable: {
      title: 'Social Functions of Diminutives',
      conjugations: [
        { pronoun: 'Politeness', form: '¿Un favorcito?', english: 'Makes requests gentler' },
        { pronoun: 'Minimizing', form: 'Es un problemita', english: 'Makes problems seem smaller' },
        { pronoun: 'Endearment', form: 'Mi hijito', english: 'Shows affection' },
        { pronoun: 'Irony', form: 'Qué casita', english: 'Can be sarcastic about large things' },
        { pronoun: 'Intimacy', form: 'Ven acá, gordito', english: 'Creates closeness' }
      ]
    },
    examples: [
      {
        spanish: 'POLITE REQUEST: ¿Me das un minutito? (Give me a little minute?)',
        english: 'MINIMIZING: No es nada, solo un problemita. (It\'s nothing, just a little problem.)',
        highlight: ['minutito', 'problemita']
      }
    ]
  },
  {
    title: 'Regional Variations',
    content: `**Different countries** have **preferences** for certain diminutives:`,
    conjugationTable: {
      title: 'Regional Preferences',
      conjugations: [
        { pronoun: 'Mexico', form: '-ito/-ita dominant', english: 'casita, perrito, momentito' },
        { pronoun: 'Costa Rica', form: '-ico/-ica common', english: 'momentico, ratico, casica' },
        { pronoun: 'Spain', form: '-illo/-illa traditional', english: 'ventanilla, mesilla' },
        { pronoun: 'Colombia', form: 'Mixed usage', english: 'Both -ito and -ico used' },
        { pronoun: 'Argentina', form: '-ito/-ita standard', english: 'Similar to Mexico' }
      ]
    },
    examples: [
      {
        spanish: 'MEXICO: ahorita (right now), poquito (a little)',
        english: 'COSTA RICA: ahorica, poquico',
        highlight: ['ahorita, poquito', 'ahorica, poquico']
      }
    ]
  },
  {
    title: 'Diminutives in Different Word Classes',
    content: `Diminutives can be applied to **various word types**:`,
    conjugationTable: {
      title: 'Diminutives by Word Class',
      conjugations: [
        { pronoun: 'Nouns', form: 'casita, perrito', english: 'Most common usage' },
        { pronoun: 'Adjectives', form: 'pequeñito, grandecito', english: 'Modify degree' },
        { pronoun: 'Adverbs', form: 'ahorita, prontito', english: 'Soften intensity' },
        { pronoun: 'Names', form: 'Carlitos, Anita', english: 'Show affection' },
        { pronoun: 'Interjections', form: '¡Ayudita!', english: 'Express emotion' }
      ]
    },
    examples: [
      {
        spanish: 'ADJECTIVES: pequeñito (very small), grandecito (quite big)',
        english: 'ADVERBS: ahorita (right now), prontito (very soon)',
        highlight: ['pequeñito, grandecito', 'ahorita, prontito']
      }
    ]
  },
  {
    title: 'Common Mistakes with Diminutives',
    content: `Here are frequent errors students make:

**1. Overuse**: Using diminutives too frequently
**2. Wrong context**: Using diminutives inappropriately
**3. Gender errors**: Wrong gender agreement
**4. Formation mistakes**: Incorrect suffix attachment`,
    examples: [
      {
        spanish: '❌ Overuse: Tengo un problemita con mi carrito en la casita',
        english: '✅ Better: Tengo un problema con mi carro en casa',
        highlight: ['problema con mi carro']
      },
      {
        spanish: '❌ Wrong context: El presidentito (inappropriate for president)',
        english: '✅ Appropriate: mi hijito (appropriate for child)',
        highlight: ['mi hijito']
      },
      {
        spanish: '❌ Gender: la mesito → ✅ la mesita',
        english: 'Wrong: diminutive must agree in gender',
        highlight: ['la mesita']
      },
      {
        spanish: '❌ Formation: ratón → ratonito → ✅ ratoncito',
        english: 'Wrong: need -c- before -ito after -n',
        highlight: ['ratoncito']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Augmentative Suffixes', url: '/grammar/spanish/word-formation/augmentative-suffixes', difficulty: 'intermediate' },
  { title: 'Spanish Gender Agreement', url: '/grammar/spanish/nouns/gender', difficulty: 'beginner' },
  { title: 'Spanish Adjective Agreement', url: '/grammar/spanish/adjectives/agreement', difficulty: 'beginner' },
  { title: 'Spanish Noun Plurals', url: '/grammar/spanish/nouns/plurals', difficulty: 'beginner' }
];

export default function SpanishDiminutiveSuffixesPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'word-formation',
              topic: 'diminutive-suffixes',
              title: 'Spanish Diminutive Suffixes (-ito, -illo, -ico) - Formation and Usage',
              description: 'Master Spanish diminutive suffixes including -ito, -illo, -ico formation rules, regional variations, and cultural usage.',
              difficulty: 'intermediate',
              examples: [
                'casa → casita (little house)',
                'perro → perrito (little dog)',
                'momento → momentito (little moment)',
                'abuelo → abuelito (grandpa)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'word-formation',
              topic: 'diminutive-suffixes',
              title: 'Spanish Diminutive Suffixes (-ito, -illo, -ico) - Formation and Usage'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="word-formation"
        topic="diminutive-suffixes"
        title="Spanish Diminutive Suffixes (-ito, -illo, -ico) - Formation and Usage"
        description="Master Spanish diminutive suffixes including -ito, -illo, -ico formation rules, regional variations, and cultural usage"
        difficulty="intermediate"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/spanish/word-formation"
        practiceUrl="/grammar/spanish/word-formation/diminutive-suffixes/practice"
        quizUrl="/grammar/spanish/word-formation/diminutive-suffixes/quiz"
        songUrl="/songs/es?theme=grammar&topic=diminutive-suffixes"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
