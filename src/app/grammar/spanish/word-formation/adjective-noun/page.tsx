import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'word-formation',
  topic: 'adjective-noun',
  title: 'Spanish Adjective to Noun Formation - Suffixes and Patterns',
  description: 'Master Spanish adjective to noun formation using suffixes like -dad, -eza, -ía, and -ismo.',
  difficulty: 'intermediate',
  keywords: [
    'spanish adjective to noun',
    'spanish word formation',
    'dad suffix spanish',
    'eza suffix spanish',
    'spanish morphology'
  ],
  examples: [
    'feliz → felicidad (happy → happiness)',
    'bello → belleza (beautiful → beauty)',
    'cortés → cortesía (polite → politeness)',
    'real → realismo (real → realism)'
  ]
});

const sections = [
  {
    title: 'Understanding Adjective to Noun Formation',
    content: `Spanish **adjective to noun formation** transforms **descriptive adjectives into abstract nouns** that express qualities, states, or concepts. This process is essential for creating sophisticated vocabulary.

**Main formation patterns:**
- **-dad/-tad**: quality/state nouns (feliz → felicidad)
- **-eza**: quality nouns (bello → belleza)
- **-ía**: quality/condition nouns (cortés → cortesía)
- **-ismo**: doctrine/system nouns (real → realismo)
- **-ura**: quality/result nouns (fresco → frescura)
- **-ez**: quality nouns (viejo → vejez)

**Types of resulting nouns:**
- **Abstract qualities**: belleza, bondad, tristeza
- **States/conditions**: enfermedad, juventud, vejez
- **Doctrines/systems**: capitalismo, idealismo
- **Characteristics**: dulzura, amargura, frescura

**Why this formation matters:**
- **Vocabulary expansion**: Create related word families
- **Abstract expression**: Discuss concepts and qualities
- **Formal register**: Essential for academic/professional Spanish
- **Linguistic sophistication**: Show advanced language skills

**Pattern recognition:**
- **Adjective ending**: Determines which suffix to use
- **Meaning type**: Quality vs. doctrine vs. state
- **Gender rules**: Most formations are feminine
- **Spelling changes**: Some require orthographic adjustments

Understanding adjective-to-noun formation is **crucial** for **advanced Spanish vocabulary**.`,
    examples: [
      {
        spanish: 'QUALITY: La belleza del paisaje es impresionante. (The beauty of the landscape is impressive.)',
        english: 'STATE: La juventud es una etapa importante. (Youth is an important stage.)',
        highlight: ['belleza', 'juventud']
      },
      {
        spanish: 'DOCTRINE: El idealismo filosófico es complejo. (Philosophical idealism is complex.)',
        english: 'CHARACTERISTIC: La dulzura de su voz. (The sweetness of her voice.)',
        highlight: ['idealismo', 'dulzura']
      }
    ]
  },
  {
    title: 'Formation with -dad/-tad Suffix',
    content: `**-dad/-tad** is the **most productive suffix** for adjective-to-noun formation:`,
    conjugationTable: {
      title: 'Adjective to Noun with -dad/-tad',
      conjugations: [
        { pronoun: 'feliz → felicidad', form: 'happy → happiness', english: 'La felicidad es contagiosa. (Happiness is contagious.)' },
        { pronoun: 'real → realidad', form: 'real → reality', english: 'La realidad supera la ficción. (Reality surpasses fiction.)' },
        { pronoun: 'libre → libertad', form: 'free → freedom', english: 'La libertad es un derecho. (Freedom is a right.)' },
        { pronoun: 'igual → igualdad', form: 'equal → equality', english: 'La igualdad es importante. (Equality is important.)' },
        { pronoun: 'difícil → dificultad', form: 'difficult → difficulty', english: 'La dificultad era evidente. (The difficulty was evident.)' },
        { pronoun: 'necesario → necesidad', form: 'necessary → necessity', english: 'Es una necesidad básica. (It\'s a basic necessity.)' }
      ]
    },
    examples: [
      {
        spanish: 'ABSTRACT: La verdad siempre prevalece. (Truth always prevails.)',
        english: 'CONCRETE: La velocidad del coche era alta. (The speed of the car was high.)',
        highlight: ['verdad', 'velocidad']
      },
      {
        spanish: 'MORAL: La bondad de su corazón. (The goodness of his heart.)',
        english: 'PHYSICAL: La solidez de la estructura. (The solidity of the structure.)',
        highlight: ['bondad', 'solidez']
      }
    ]
  },
  {
    title: 'Formation with -eza Suffix',
    content: `**-eza** creates **quality nouns** from adjectives:`,
    conjugationTable: {
      title: 'Adjective to Noun with -eza',
      conjugations: [
        { pronoun: 'bello → belleza', form: 'beautiful → beauty', english: 'La belleza natural es única. (Natural beauty is unique.)' },
        { pronoun: 'grande → grandeza', form: 'great → greatness', english: 'La grandeza del momento. (The greatness of the moment.)' },
        { pronoun: 'triste → tristeza', form: 'sad → sadness', english: 'La tristeza es temporal. (Sadness is temporary.)' },
        { pronoun: 'pobre → pobreza', form: 'poor → poverty', english: 'La pobreza es un problema social. (Poverty is a social problem.)' },
        { pronoun: 'rico → riqueza', form: 'rich → wealth', english: 'La riqueza cultural del país. (The cultural wealth of the country.)' },
        { pronoun: 'noble → nobleza', form: 'noble → nobility', english: 'La nobleza de su carácter. (The nobility of his character.)' }
      ]
    },
    examples: [
      {
        spanish: 'PHYSICAL: La limpieza del lugar era perfecta. (The cleanliness of the place was perfect.)',
        english: 'MORAL: La pureza de sus intenciones. (The purity of his intentions.)',
        highlight: ['limpieza', 'pureza']
      },
      {
        spanish: 'NATURAL: La naturaleza muestra su grandeza. (Nature shows its greatness.)',
        english: 'HUMAN: La gentileza en el trato. (Kindness in treatment.)',
        highlight: ['grandeza', 'gentileza']
      }
    ]
  },
  {
    title: 'Formation with -ía Suffix',
    content: `**-ía** creates **quality, condition, or field nouns**:`,
    conjugationTable: {
      title: 'Adjective to Noun with -ía',
      conjugations: [
        { pronoun: 'cortés → cortesía', form: 'polite → politeness', english: 'La cortesía es importante. (Politeness is important.)' },
        { pronoun: 'valiente → valentía', form: 'brave → bravery', english: 'Su valentía fue admirable. (His bravery was admirable.)' },
        { pronoun: 'cobarde → cobardía', form: 'cowardly → cowardice', english: 'La cobardía no es una opción. (Cowardice is not an option.)' },
        { pronoun: 'sabio → sabiduría', form: 'wise → wisdom', english: 'La sabiduría viene con la edad. (Wisdom comes with age.)' },
        { pronoun: 'alegre → alegría', form: 'happy → joy', english: 'La alegría se contagia. (Joy is contagious.)' },
        { pronoun: 'melancólico → melancolía', form: 'melancholic → melancholy', english: 'La melancolía del otoño. (The melancholy of autumn.)' }
      ]
    },
    examples: [
      {
        spanish: 'VIRTUE: La honestidad es una virtud. (Honesty is a virtue.)',
        english: 'EMOTION: La nostalgia por el pasado. (Nostalgia for the past.)',
        highlight: ['honestidad', 'nostalgia']
      },
      {
        spanish: 'QUALITY: La simpatía de la gente. (The friendliness of the people.)',
        english: 'STATE: La armonía en la familia. (Harmony in the family.)',
        highlight: ['simpatía', 'armonía']
      }
    ]
  },
  {
    title: 'Formation with -ismo Suffix',
    content: `**-ismo** creates **doctrine, system, or movement nouns**:`,
    conjugationTable: {
      title: 'Adjective to Noun with -ismo',
      conjugations: [
        { pronoun: 'real → realismo', form: 'real → realism', english: 'El realismo literario. (Literary realism.)' },
        { pronoun: 'ideal → idealismo', form: 'ideal → idealism', english: 'Su idealismo es admirable. (His idealism is admirable.)' },
        { pronoun: 'social → socialismo', form: 'social → socialism', english: 'El socialismo como sistema. (Socialism as a system.)' },
        { pronoun: 'nacional → nacionalismo', form: 'national → nationalism', english: 'El nacionalismo extremo. (Extreme nationalism.)' },
        { pronoun: 'moderno → modernismo', form: 'modern → modernism', english: 'El modernismo artístico. (Artistic modernism.)' },
        { pronoun: 'romántico → romanticismo', form: 'romantic → romanticism', english: 'El romanticismo del siglo XIX. (19th-century romanticism.)' }
      ]
    },
    examples: [
      {
        spanish: 'PHILOSOPHY: El existencialismo francés. (French existentialism.)',
        english: 'ART: El impresionismo pictórico. (Pictorial impressionism.)',
        highlight: ['existencialismo', 'impresionismo']
      },
      {
        spanish: 'POLITICS: El liberalismo económico. (Economic liberalism.)',
        english: 'RELIGION: El fundamentalismo religioso. (Religious fundamentalism.)',
        highlight: ['liberalismo', 'fundamentalismo']
      }
    ]
  },
  {
    title: 'Formation with -ura Suffix',
    content: `**-ura** creates **quality or result nouns**:`,
    conjugationTable: {
      title: 'Adjective to Noun with -ura',
      conjugations: [
        { pronoun: 'fresco → frescura', form: 'fresh → freshness', english: 'La frescura del aire matutino. (The freshness of the morning air.)' },
        { pronoun: 'dulce → dulzura', form: 'sweet → sweetness', english: 'La dulzura de su sonrisa. (The sweetness of her smile.)' },
        { pronoun: 'amargo → amargura', form: 'bitter → bitterness', english: 'La amargura de la derrota. (The bitterness of defeat.)' },
        { pronoun: 'blanco → blancura', form: 'white → whiteness', english: 'La blancura de la nieve. (The whiteness of the snow.)' },
        { pronoun: 'espeso → espesura', form: 'thick → thickness', english: 'La espesura del bosque. (The thickness of the forest.)' },
        { pronoun: 'alto → altura', form: 'tall → height', english: 'La altura del edificio. (The height of the building.)' }
      ]
    },
    examples: [
      {
        spanish: 'SENSORY: La suavidad de la tela. (The softness of the fabric.)',
        english: 'PHYSICAL: La anchura del río. (The width of the river.)',
        highlight: ['suavidad', 'anchura']
      }
    ]
  },
  {
    title: 'Formation with -ez Suffix',
    content: `**-ez** creates **quality or state nouns** (less common):`,
    conjugationTable: {
      title: 'Adjective to Noun with -ez',
      conjugations: [
        { pronoun: 'viejo → vejez', form: 'old → old age', english: 'La vejez trae sabiduría. (Old age brings wisdom.)' },
        { pronoun: 'niño → niñez', form: 'child → childhood', english: 'La niñez es una etapa feliz. (Childhood is a happy stage.)' },
        { pronoun: 'maduro → madurez', form: 'mature → maturity', english: 'La madurez llega con el tiempo. (Maturity comes with time.)' },
        { pronoun: 'estúpido → estupidez', form: 'stupid → stupidity', english: 'La estupidez es peligrosa. (Stupidity is dangerous.)' },
        { pronoun: 'rígido → rigidez', form: 'rigid → rigidity', english: 'La rigidez de las normas. (The rigidity of the rules.)' },
        { pronoun: 'válido → validez', form: 'valid → validity', english: 'La validez del documento. (The validity of the document.)' }
      ]
    },
    examples: [
      {
        spanish: 'LIFE STAGE: La juventud y la vejez. (Youth and old age.)',
        english: 'QUALITY: La sencillez de su estilo. (The simplicity of his style.)',
        highlight: ['juventud', 'vejez', 'sencillez']
      }
    ]
  },
  {
    title: 'Spelling Changes in Formation',
    content: `**Some formations** require **spelling changes**:`,
    examples: [
      {
        spanish: 'C → QU: rico → riqueza (rich → wealth)',
        english: 'G → GU: largo → largura (long → length)',
        highlight: ['riqueza', 'largura']
      },
      {
        spanish: 'Z → C: feliz → felicidad (happy → happiness)',
        english: 'VOWEL CHANGE: bueno → bondad (good → goodness)',
        highlight: ['felicidad', 'bondad']
      }
    ]
  },
  {
    title: 'Gender and Number of Formed Nouns',
    content: `**Most adjective-derived nouns** are **feminine**:`,
    examples: [
      {
        spanish: 'FEMININE: la belleza, la bondad, la tristeza, la cortesía',
        english: 'MASCULINE: el realismo, el idealismo, el romanticismo',
        highlight: ['la belleza', 'el realismo']
      },
      {
        spanish: 'PLURAL: las dificultades, los nacionalismos',
        english: 'USAGE: Muchas bellezas naturales (Many natural beauties)',
        highlight: ['las dificultades', 'Muchas bellezas']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong suffix choice**: Using incorrect suffix for formation
**2. Gender errors**: Wrong gender assignment
**3. Spelling mistakes**: Not applying necessary changes
**4. Meaning confusion**: Misunderstanding the derived meaning`,
    examples: [
      {
        spanish: '❌ la realismo → ✅ el realismo',
        english: 'Wrong: -ismo nouns are masculine',
        highlight: ['el realismo']
      },
      {
        spanish: '❌ felizidad → ✅ felicidad',
        english: 'Wrong: spelling change z → c needed',
        highlight: ['felicidad']
      },
      {
        spanish: '❌ bellezad → ✅ belleza',
        english: 'Wrong: use -eza (not -dad) for this adjective',
        highlight: ['belleza']
      },
      {
        spanish: '❌ el cortesía → ✅ la cortesía',
        english: 'Wrong: -ía nouns are feminine',
        highlight: ['la cortesía']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Nominalisation', url: '/grammar/spanish/nouns/nominalisation', difficulty: 'advanced' },
  { title: 'Spanish Adjective Formation', url: '/grammar/spanish/adjectives/formation', difficulty: 'intermediate' },
  { title: 'Spanish Word Formation', url: '/grammar/spanish/word-formation/overview', difficulty: 'advanced' },
  { title: 'Spanish Noun Gender', url: '/grammar/spanish/nouns/gender', difficulty: 'beginner' }
];

export default function SpanishAdjectiveNounPage() {
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
              topic: 'adjective-noun',
              title: 'Spanish Adjective to Noun Formation - Suffixes and Patterns',
              description: 'Master Spanish adjective to noun formation using suffixes like -dad, -eza, -ía, and -ismo.',
              difficulty: 'intermediate',
              examples: [
                'feliz → felicidad (happy → happiness)',
                'bello → belleza (beautiful → beauty)',
                'cortés → cortesía (polite → politeness)',
                'real → realismo (real → realism)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'word-formation',
              topic: 'adjective-noun',
              title: 'Spanish Adjective to Noun Formation - Suffixes and Patterns'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="word-formation"
        topic="adjective-noun"
        title="Spanish Adjective to Noun Formation - Suffixes and Patterns"
        description="Master Spanish adjective to noun formation using suffixes like -dad, -eza, -ía, and -ismo"
        difficulty="intermediate"
        estimatedTime={16}
        sections={sections}
        backUrl="/grammar/spanish/word-formation"
        practiceUrl="/grammar/spanish/word-formation/adjective-noun/practice"
        quizUrl="/grammar/spanish/word-formation/adjective-noun/quiz"
        songUrl="/songs/es?theme=grammar&topic=adjective-noun"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
