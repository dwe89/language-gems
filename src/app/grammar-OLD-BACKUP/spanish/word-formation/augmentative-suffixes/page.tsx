import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'word-formation',
  topic: 'augmentative-suffixes',
  title: 'Spanish Augmentative Suffixes (-ón, -azo, -ote) - Formation and Usage',
  description: 'Master Spanish augmentative suffixes including -ón, -azo, -ote formation rules and usage for expressing largeness and intensity.',
  difficulty: 'intermediate',
  keywords: [
    'spanish augmentatives',
    'on azo ote spanish',
    'augmentative suffixes spanish',
    'spanish word formation',
    'spanish morphology',
    'large size spanish'
  ],
  examples: [
    'casa → casón (big house)',
    'perro → perrazo (big dog)',
    'libro → librote (big book)',
    'hombre → hombrón (big man)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Augmentative Suffixes',
    content: `Spanish **augmentative suffixes** express **largeness**, **intensity**, **admiration**, or sometimes **negative connotations**. They are the **opposite of diminutives** and add emphasis to the base word.

**Main augmentative suffixes:**
- **-ón/-ona**: Most common, can be positive or negative
- **-azo/-aza**: Often implies admiration or impact
- **-ote/-ota**: Usually positive, impressive size
- **-udo/-uda**: Emphasizes abundance of a quality

**Functions of augmentatives:**
- **Size increase**: Indicate something is large
- **Intensity**: Emphasize degree or strength
- **Admiration**: Express positive evaluation
- **Impact**: Show forcefulness or impressiveness
- **Sometimes negative**: Can imply excess or ugliness

**Key characteristics:**
- **Gender agreement**: Match gender of base word
- **Emotional connotation**: Often carry strong feelings
- **Less frequent**: Used less than diminutives
- **Context-dependent**: Meaning depends on situation

**Cultural usage:**
- **Expressive language**: Add color and emotion
- **Regional variation**: Some preferences by country
- **Informal register**: More common in casual speech
- **Emphasis tool**: Strengthen communication impact

Understanding augmentatives enhances **expressive ability** and **cultural competence** in Spanish.`,
    examples: [
      {
        spanish: 'SIZE: casa → casón (big house)',
        english: 'ADMIRATION: perro → perrazo (great dog)',
        highlight: ['casa → casón', 'perro → perrazo']
      },
      {
        spanish: 'INTENSITY: golpe → golpazo (hard hit)',
        english: 'IMPRESSIVE: libro → librote (big book)',
        highlight: ['golpe → golpazo', 'libro → librote']
      },
      {
        spanish: 'ABUNDANCE: barba → barbudo (very bearded)',
        english: 'EMPHASIS: hombre → hombrón (big man)',
        highlight: ['barba → barbudo', 'hombre → hombrón']
      }
    ]
  },
  {
    title: '-ÓN/-ONA: Most Common Augmentative',
    content: `**-ón/-ona** is the **most frequent** augmentative suffix with **varied connotations**:`,
    conjugationTable: {
      title: 'Formation Rules for -ón/-ona',
      conjugations: [
        { pronoun: 'Masculine nouns', form: 'Add -ón', english: 'hombre → hombrón, libro → librón' },
        { pronoun: 'Feminine nouns', form: 'Change to -ona', english: 'casa → casona, mesa → mesona' },
        { pronoun: 'Adjectives', form: 'Add -ón/-ona', english: 'grande → grandón/grandona' },
        { pronoun: 'Special meanings', form: 'Fixed forms', english: 'ratón (mouse), jamón (ham)' }
      ]
    },
    examples: [
      {
        spanish: 'POSITIVE: hombrón (big strong man), casona (mansion)',
        english: 'NEUTRAL: librón (big book), mesona (big table)',
        highlight: ['hombrón, casona', 'librón, mesona']
      },
      {
        spanish: 'NEGATIVE: feón (very ugly), cabezón (big-headed)',
        english: 'LEXICALIZED: ratón (mouse), jamón (ham)',
        highlight: ['feón, cabezón', 'ratón, jamón']
      }
    ],
    subsections: [
      {
        title: 'Gender Changes',
        content: 'Feminine nouns often become masculine with -ón:',
        examples: [
          {
            spanish: 'la casa → el casón, la silla → el sillón',
            english: 'Gender can change with augmentative',
            highlight: ['la casa → el casón']
          }
        ]
      }
    ]
  },
  {
    title: '-AZO/-AZA: Impact and Admiration',
    content: `**-azo/-aza** often expresses **admiration**, **impact**, or **impressive quality**:`,
    conjugationTable: {
      title: 'Formation Rules for -azo/-aza',
      conjugations: [
        { pronoun: 'Ends in -o/-a', form: 'Replace with -azo/-aza', english: 'perro → perrazo, gato → gatazo' },
        { pronoun: 'Ends in consonant', form: 'Add -azo/-aza', english: 'animal → animalazo' },
        { pronoun: 'Impact meaning', form: 'Blow/hit with', english: 'martillo → martillazo (hammer blow)' },
        { pronoun: 'Admiration', form: 'Great/excellent', english: 'coche → cochazo (great car)' }
      ]
    },
    examples: [
      {
        spanish: 'ADMIRATION: cochazo (awesome car), perrazo (great dog)',
        english: 'IMPACT: martillazo (hammer blow), puñetazo (punch)',
        highlight: ['cochazo, perrazo', 'martillazo, puñetazo']
      },
      {
        spanish: 'IMPRESSIVE: golazo (amazing goal), partidazo (great game)',
        english: 'SIZE: animalazo (huge animal), librazo (huge book)',
        highlight: ['golazo, partidazo', 'animalazo, librazo']
      }
    ]
  },
  {
    title: '-OTE/-OTA: Positive Largeness',
    content: `**-ote/-ota** usually has **positive connotations** and indicates **impressive size**:`,
    conjugationTable: {
      title: 'Formation Rules for -ote/-ota',
      conjugations: [
        { pronoun: 'Masculine', form: 'Add -ote', english: 'libro → librote, animal → animalote' },
        { pronoun: 'Feminine', form: 'Add -ota', english: 'casa → casota, mesa → mesota' },
        { pronoun: 'Positive meaning', form: 'Usually admiring', english: 'grandote (nicely big)' },
        { pronoun: 'People', form: 'Often affectionate', english: 'gordote (chubby, endearing)' }
      ]
    },
    examples: [
      {
        spanish: 'POSITIVE: librote (great big book), casota (nice big house)',
        english: 'AFFECTIONATE: gordote (chubby guy), grandote (big guy)',
        highlight: ['librote, casota', 'gordote, grandote']
      }
    ]
  },
  {
    title: '-UDO/-UDA: Abundance Quality',
    content: `**-udo/-uda** emphasizes **abundance** of a particular **quality** or **characteristic**:`,
    conjugationTable: {
      title: 'Formation Rules for -udo/-uda',
      conjugations: [
        { pronoun: 'Body parts', form: 'Abundant feature', english: 'barba → barbudo (bearded)' },
        { pronoun: 'Qualities', form: 'Rich in quality', english: 'pelo → peludo (hairy)' },
        { pronoun: 'Common forms', form: 'Fixed meanings', english: 'desnudo (naked), cornudo (horned)' }
      ]
    },
    examples: [
      {
        spanish: 'PHYSICAL: barbudo (bearded), peludo (hairy)',
        english: 'QUALITIES: fornudo (muscular), panzudo (pot-bellied)',
        highlight: ['barbudo, peludo', 'fornudo, panzudo']
      }
    ]
  },
  {
    title: 'Other Augmentative Suffixes',
    content: `**Less common** but still important augmentative suffixes:`,
    conjugationTable: {
      title: 'Other Augmentative Suffixes',
      conjugations: [
        { pronoun: '-acho/-acha', form: 'Often pejorative', english: 'ricacho (nouveau riche), poblacho (ugly town)' },
        { pronoun: '-aco/-aca', form: 'Usually negative', english: 'libraco (bad book)' },
        { pronoun: '-astro/-astra', form: 'Pejorative', english: 'poetastro (bad poet)' },
        { pronoun: '-ucho/-ucha', form: 'Ugly/bad', english: 'casucha (hovel), medicucho (quack)' }
      ]
    },
    examples: [
      {
        spanish: 'PEJORATIVE: ricacho (nouveau riche), poetastro (bad poet)',
        english: 'UGLY: casucha (hovel), medicucho (quack doctor)',
        highlight: ['ricacho, poetastro', 'casucha, medicucho']
      }
    ]
  },
  {
    title: 'Augmentatives vs Diminutives',
    content: `**Comparison** between augmentatives and diminutives:`,
    conjugationTable: {
      title: 'Augmentatives vs Diminutives',
      conjugations: [
        { pronoun: 'Size', form: 'Augmentative = large', english: 'Diminutive = small' },
        { pronoun: 'Frequency', form: 'Less common', english: 'More common' },
        { pronoun: 'Emotion', form: 'Strong/intense', english: 'Gentle/affectionate' },
        { pronoun: 'Connotation', form: 'Can be negative', english: 'Usually positive' }
      ]
    },
    examples: [
      {
        spanish: 'AUGMENTATIVE: casón, perrazo, librote',
        english: 'DIMINUTIVE: casita, perrito, librito',
        highlight: ['casón, perrazo', 'casita, perrito']
      }
    ]
  },
  {
    title: 'Lexicalized Augmentatives',
    content: `Many **augmentative forms** have become **independent words** with **specific meanings**:`,
    conjugationTable: {
      title: 'Lexicalized Augmentative Forms',
      conjugations: [
        { pronoun: 'ratón', form: 'mouse', english: 'Not "big rat" - independent word' },
        { pronoun: 'jamón', form: 'ham', english: 'Not "big jam" - specific meaning' },
        { pronoun: 'sillón', form: 'armchair', english: 'Not "big chair" - furniture type' },
        { pronoun: 'cajón', form: 'drawer', english: 'Not "big box" - specific object' },
        { pronoun: 'salón', form: 'living room', english: 'Not "big room" - room type' }
      ]
    },
    examples: [
      {
        spanish: 'ANIMALS: ratón (mouse), tiburón (shark)',
        english: 'FURNITURE: sillón (armchair), cajón (drawer)',
        highlight: ['ratón, tiburón', 'sillón, cajón']
      },
      {
        spanish: 'FOOD: jamón (ham), melón (melon)',
        english: 'PLACES: salón (living room), balcón (balcony)',
        highlight: ['jamón, melón', 'salón, balcón']
      }
    ]
  },
  {
    title: 'Contextual Usage',
    content: `**Context determines** whether augmentatives are **positive** or **negative**:`,
    examples: [
      {
        spanish: 'POSITIVE: ¡Qué perrazo tan bonito! (What a beautiful big dog!)',
        english: 'NEGATIVE: Es un hombrón muy agresivo. (He\'s a big aggressive man.)',
        highlight: ['¡Qué perrazo tan bonito!', 'hombrón muy agresivo']
      },
      {
        spanish: 'ADMIRING: ¡Menudo cochazo tienes! (What an awesome car you have!)',
        english: 'CRITICAL: Vive en un casón horrible. (He lives in a horrible big house.)',
        highlight: ['¡Menudo cochazo!', 'casón horrible']
      }
    ]
  },
  {
    title: 'Regional and Register Variation',
    content: `**Usage varies** by **region** and **formality level**:`,
    conjugationTable: {
      title: 'Regional and Register Differences',
      conjugations: [
        { pronoun: 'Informal speech', form: 'More common', english: 'Casual conversations' },
        { pronoun: 'Formal speech', form: 'Less common', english: 'Professional contexts' },
        { pronoun: 'Regional preferences', form: 'Vary by country', english: 'Some regions use more' },
        { pronoun: 'Age groups', form: 'Younger speakers', english: 'Often use more creatively' }
      ]
    },
    examples: [
      {
        spanish: 'INFORMAL: ¡Qué partidazo! (What a great game!)',
        english: 'FORMAL: Fue un partido excelente. (It was an excellent game.)',
        highlight: ['¡Qué partidazo!', 'partido excelente']
      }
    ]
  },
  {
    title: 'Common Mistakes with Augmentatives',
    content: `Here are frequent errors students make:

**1. Overuse**: Using augmentatives too frequently
**2. Wrong connotation**: Not understanding positive/negative implications
**3. Gender confusion**: Wrong gender agreement
**4. Context inappropriate**: Using in wrong situations`,
    examples: [
      {
        spanish: '❌ Overuse: Tengo un librón en mi casón con mi perrazo',
        english: '✅ Better: Tengo un libro grande en mi casa con mi perro',
        highlight: ['libro grande en mi casa']
      },
      {
        spanish: '❌ Wrong context: El profesorón (inappropriate for teacher)',
        english: '✅ Appropriate: el profesor (neutral and respectful)',
        highlight: ['el profesor']
      },
      {
        spanish: '❌ Gender: la casón → ✅ el casón',
        english: 'Wrong: augmentative can change gender',
        highlight: ['el casón']
      },
      {
        spanish: '❌ Negative meaning: ¡Qué feón! (very ugly - insulting)',
        english: '✅ Positive: ¡Qué guapo! (how handsome - compliment)',
        highlight: ['¡Qué guapo!']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Diminutive Suffixes', url: '/grammar/spanish/word-formation/diminutive-suffixes', difficulty: 'intermediate' },
  { title: 'Spanish Gender Agreement', url: '/grammar/spanish/nouns/gender', difficulty: 'beginner' },
  { title: 'Spanish Adverb Formation', url: '/grammar/spanish/adverbs/formation', difficulty: 'intermediate' },
  { title: 'Spanish Adjective Agreement', url: '/grammar/spanish/adjectives/agreement', difficulty: 'beginner' }
];

export default function SpanishAugmentativeSuffixesPage() {
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
              topic: 'augmentative-suffixes',
              title: 'Spanish Augmentative Suffixes (-ón, -azo, -ote) - Formation and Usage',
              description: 'Master Spanish augmentative suffixes including -ón, -azo, -ote formation rules and usage for expressing largeness and intensity.',
              difficulty: 'intermediate',
              examples: [
                'casa → casón (big house)',
                'perro → perrazo (big dog)',
                'libro → librote (big book)',
                'hombre → hombrón (big man)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'word-formation',
              topic: 'augmentative-suffixes',
              title: 'Spanish Augmentative Suffixes (-ón, -azo, -ote) - Formation and Usage'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="word-formation"
        topic="augmentative-suffixes"
        title="Spanish Augmentative Suffixes (-ón, -azo, -ote) - Formation and Usage"
        description="Master Spanish augmentative suffixes including -ón, -azo, -ote formation rules and usage for expressing largeness and intensity"
        difficulty="intermediate"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/spanish/word-formation"
        practiceUrl="/grammar/spanish/word-formation/augmentative-suffixes/practice"
        quizUrl="/grammar/spanish/word-formation/augmentative-suffixes/quiz"
        songUrl="/songs/es?theme=grammar&topic=augmentative-suffixes"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
