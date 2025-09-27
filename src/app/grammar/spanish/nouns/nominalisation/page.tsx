import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'nouns',
  topic: 'nominalisation',
  title: 'Spanish Nominalisation - Converting Verbs and Adjectives to Nouns',
  description: 'Master Spanish nominalisation patterns including suffixes like -ción, -miento, -dad, and -eza.',
  difficulty: 'advanced',
  keywords: [
    'spanish nominalisation',
    'spanish noun formation',
    'cion spanish suffix',
    'miento spanish ending',
    'spanish word formation'
  ],
  examples: [
    'actuar → actuación (to act → performance)',
    'mover → movimiento (to move → movement)',
    'feliz → felicidad (happy → happiness)',
    'bello → belleza (beautiful → beauty)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Nominalisation',
    content: `Spanish **nominalisation** (nominalización) is the process of **converting verbs, adjectives, or other word classes into nouns**. This creates abstract concepts and allows for more sophisticated expression.

**Main nominalisation patterns:**
- **Verb → Noun**: actuar → actuación (to act → performance)
- **Adjective → Noun**: feliz → felicidad (happy → happiness)
- **Verb → Agent noun**: cantar → cantante (to sing → singer)
- **Adjective → Quality noun**: bello → belleza (beautiful → beauty)

**Common suffixes:**
- **-ción/-sión**: action/result nouns
- **-miento/-mento**: process/result nouns
- **-dad/-tad**: quality/state nouns
- **-eza**: quality nouns
- **-ante/-ente**: agent nouns
- **-ura**: result/quality nouns

**Why nominalisation matters:**
- **Academic writing**: Essential for formal texts
- **Abstract concepts**: Express complex ideas
- **Vocabulary expansion**: Create related word families
- **Advanced Spanish**: Mark sophisticated language use

**Functions:**
- **Express processes**: La construcción del edificio
- **Name qualities**: La belleza del paisaje
- **Create agents**: El estudiante trabaja
- **Form concepts**: La importancia del tema

Understanding nominalisation is **crucial** for **advanced Spanish proficiency**.`,
    examples: [
      {
        spanish: 'VERB TO NOUN: construir → construcción (to build → construction)',
        english: 'ADJECTIVE TO NOUN: importante → importancia (important → importance)',
        highlight: ['construcción', 'importancia']
      },
      {
        spanish: 'AGENT: enseñar → enseñante (to teach → teacher)',
        english: 'QUALITY: rico → riqueza (rich → wealth)',
        highlight: ['enseñante', 'riqueza']
      }
    ]
  },
  {
    title: 'Verb to Noun: -ción/-sión Suffix',
    content: `**-ción/-sión** creates **action or result nouns** from verbs:`,
    conjugationTable: {
      title: 'Verb to Noun with -ción/-sión',
      conjugations: [
        { pronoun: 'actuar → actuación', form: 'to act → performance', english: 'La actuación fue excelente. (The performance was excellent.)' },
        { pronoun: 'construir → construcción', form: 'to build → construction', english: 'La construcción duró dos años. (The construction lasted two years.)' },
        { pronoun: 'decidir → decisión', form: 'to decide → decision', english: 'Fue una decisión difícil. (It was a difficult decision.)' },
        { pronoun: 'expresar → expresión', form: 'to express → expression', english: 'Su expresión era seria. (His expression was serious.)' },
        { pronoun: 'producir → producción', form: 'to produce → production', english: 'La producción aumentó. (Production increased.)' },
        { pronoun: 'traducir → traducción', form: 'to translate → translation', english: 'La traducción es perfecta. (The translation is perfect.)' }
      ]
    },
    examples: [
      {
        spanish: 'ACTION: La creación de la empresa fue exitosa. (The creation of the company was successful.)',
        english: 'RESULT: La invención cambió el mundo. (The invention changed the world.)',
        highlight: ['creación', 'invención']
      },
      {
        spanish: 'PROCESS: La transformación fue gradual. (The transformation was gradual.)',
        english: 'STATE: La situación es complicada. (The situation is complicated.)',
        highlight: ['transformación', 'situación']
      }
    ]
  },
  {
    title: 'Verb to Noun: -miento/-mento Suffix',
    content: `**-miento/-mento** creates **process or result nouns**:`,
    conjugationTable: {
      title: 'Verb to Noun with -miento/-mento',
      conjugations: [
        { pronoun: 'mover → movimiento', form: 'to move → movement', english: 'El movimiento fue rápido. (The movement was quick.)' },
        { pronoun: 'conocer → conocimiento', form: 'to know → knowledge', english: 'Su conocimiento es amplio. (His knowledge is extensive.)' },
        { pronoun: 'sentir → sentimiento', form: 'to feel → feeling', english: 'Es un sentimiento profundo. (It\'s a deep feeling.)' },
        { pronoun: 'pensar → pensamiento', form: 'to think → thought', english: 'Su pensamiento es claro. (His thinking is clear.)' },
        { pronoun: 'crecer → crecimiento', form: 'to grow → growth', english: 'El crecimiento fue notable. (The growth was notable.)' },
        { pronoun: 'sufrir → sufrimiento', form: 'to suffer → suffering', english: 'El sufrimiento terminó. (The suffering ended.)' }
      ]
    },
    examples: [
      {
        spanish: 'PROCESS: El desarrollo del proyecto fue lento. (The development of the project was slow.)',
        english: 'MENTAL STATE: Su razonamiento es lógico. (His reasoning is logical.)',
        highlight: ['desarrollo', 'razonamiento']
      },
      {
        spanish: 'PHYSICAL: El movimiento del agua es constante. (The movement of water is constant.)',
        english: 'ABSTRACT: El entendimiento mutuo es importante. (Mutual understanding is important.)',
        highlight: ['movimiento', 'entendimiento']
      }
    ]
  },
  {
    title: 'Adjective to Noun: -dad/-tad Suffix',
    content: `**-dad/-tad** creates **quality or state nouns** from adjectives:`,
    conjugationTable: {
      title: 'Adjective to Noun with -dad/-tad',
      conjugations: [
        { pronoun: 'feliz → felicidad', form: 'happy → happiness', english: 'La felicidad es importante. (Happiness is important.)' },
        { pronoun: 'real → realidad', form: 'real → reality', english: 'La realidad es diferente. (Reality is different.)' },
        { pronoun: 'libre → libertad', form: 'free → freedom', english: 'La libertad es valiosa. (Freedom is valuable.)' },
        { pronoun: 'difícil → dificultad', form: 'difficult → difficulty', english: 'La dificultad era evidente. (The difficulty was evident.)' },
        { pronoun: 'necesario → necesidad', form: 'necessary → necessity', english: 'Es una necesidad básica. (It\'s a basic necessity.)' },
        { pronoun: 'posible → posibilidad', form: 'possible → possibility', english: 'Hay una posibilidad. (There\'s a possibility.)' }
      ]
    },
    examples: [
      {
        spanish: 'QUALITY: La belleza del paisaje es impresionante. (The beauty of the landscape is impressive.)',
        english: 'STATE: La tranquilidad del lugar es perfecta. (The tranquility of the place is perfect.)',
        highlight: ['belleza', 'tranquilidad']
      },
      {
        spanish: 'ABSTRACT: La verdad siempre sale a la luz. (The truth always comes to light.)',
        english: 'CONCEPT: La igualdad es un derecho. (Equality is a right.)',
        highlight: ['verdad', 'igualdad']
      }
    ]
  },
  {
    title: 'Adjective to Noun: -eza Suffix',
    content: `**-eza** creates **quality nouns** from adjectives:`,
    conjugationTable: {
      title: 'Adjective to Noun with -eza',
      conjugations: [
        { pronoun: 'bello → belleza', form: 'beautiful → beauty', english: 'La belleza natural es única. (Natural beauty is unique.)' },
        { pronoun: 'grande → grandeza', form: 'great → greatness', english: 'La grandeza del momento. (The greatness of the moment.)' },
        { pronoun: 'triste → tristeza', form: 'sad → sadness', english: 'La tristeza pasará. (The sadness will pass.)' },
        { pronoun: 'pobre → pobreza', form: 'poor → poverty', english: 'La pobreza es un problema. (Poverty is a problem.)' },
        { pronoun: 'rico → riqueza', form: 'rich → wealth', english: 'La riqueza cultural es inmensa. (The cultural wealth is immense.)' },
        { pronoun: 'puro → pureza', form: 'pure → purity', english: 'La pureza del agua. (The purity of the water.)' }
      ]
    },
    examples: [
      {
        spanish: 'PHYSICAL: La limpieza de la casa es perfecta. (The cleanliness of the house is perfect.)',
        english: 'MORAL: La nobleza de su carácter. (The nobility of his character.)',
        highlight: ['limpieza', 'nobleza']
      },
      {
        spanish: 'NATURAL: La naturaleza muestra su grandeza. (Nature shows its greatness.)',
        english: 'HUMAN: La gentileza de su trato. (The kindness of his treatment.)',
        highlight: ['grandeza', 'gentileza']
      }
    ]
  },
  {
    title: 'Agent Nouns: -ante/-ente Suffix',
    content: `**-ante/-ente** creates **agent nouns** (people who do actions):`,
    conjugationTable: {
      title: 'Verb to Agent Noun',
      conjugations: [
        { pronoun: 'estudiar → estudiante', form: 'to study → student', english: 'El estudiante trabaja mucho. (The student works hard.)' },
        { pronoun: 'cantar → cantante', form: 'to sing → singer', english: 'La cantante es famosa. (The singer is famous.)' },
        { pronoun: 'enseñar → enseñante', form: 'to teach → teacher', english: 'El enseñante es paciente. (The teacher is patient.)' },
        { pronoun: 'representar → representante', form: 'to represent → representative', english: 'El representante llegó. (The representative arrived.)' },
        { pronoun: 'dirigir → dirigente', form: 'to direct → leader', english: 'El dirigente habló. (The leader spoke.)' },
        { pronoun: 'asistir → asistente', form: 'to assist → assistant', english: 'La asistente ayuda. (The assistant helps.)' }
      ]
    },
    examples: [
      {
        spanish: 'PROFESSION: El comerciante vende productos. (The merchant sells products.)',
        english: 'ROLE: El participante ganó el premio. (The participant won the prize.)',
        highlight: ['comerciante', 'participante']
      },
      {
        spanish: 'ACTIVITY: El navegante exploró nuevas rutas. (The navigator explored new routes.)',
        english: 'FUNCTION: El presidente dirige el país. (The president leads the country.)',
        highlight: ['navegante', 'presidente']
      }
    ]
  },
  {
    title: 'Result Nouns: -ura Suffix',
    content: `**-ura** creates **result or quality nouns**:`,
    conjugationTable: {
      title: 'Various to Noun with -ura',
      conjugations: [
        { pronoun: 'pintar → pintura', form: 'to paint → painting', english: 'La pintura es hermosa. (The painting is beautiful.)' },
        { pronoun: 'leer → lectura', form: 'to read → reading', english: 'La lectura es educativa. (Reading is educational.)' },
        { pronoun: 'escribir → escritura', form: 'to write → writing', english: 'Su escritura es clara. (His writing is clear.)' },
        { pronoun: 'alto → altura', form: 'tall → height', english: 'La altura del edificio. (The height of the building.)' },
        { pronoun: 'ancho → anchura', form: 'wide → width', english: 'La anchura del río. (The width of the river.)' },
        { pronoun: 'fresco → frescura', form: 'fresh → freshness', english: 'La frescura del aire. (The freshness of the air.)' }
      ]
    },
    examples: [
      {
        spanish: 'RESULT: La mezcla creó una nueva textura. (The mixture created a new texture.)',
        english: 'QUALITY: La dulzura de la miel. (The sweetness of honey.)',
        highlight: ['textura', 'dulzura']
      }
    ]
  },
  {
    title: 'Irregular Nominalisations',
    content: `**Some nominalisations** are **irregular** or use different patterns:`,
    examples: [
      {
        spanish: 'IRREGULAR: morir → muerte (to die → death)',
        english: 'CHANGE: nacer → nacimiento (to be born → birth)',
        highlight: ['muerte', 'nacimiento']
      },
      {
        spanish: 'SPECIAL: ver → vista (to see → sight)',
        english: 'UNIQUE: ir → ida (to go → going/departure)',
        highlight: ['vista', 'ida']
      }
    ]
  },
  {
    title: 'Using Nominalisations in Context',
    content: `**Nominalisations** in **formal and academic contexts**:`,
    examples: [
      {
        spanish: 'ACADEMIC: La investigación demostró la importancia del descubrimiento.',
        english: 'TRANSLATION: The research demonstrated the importance of the discovery.',
        highlight: ['investigación', 'importancia', 'descubrimiento']
      },
      {
        spanish: 'FORMAL: La administración anunció la implementación de nuevas medidas.',
        english: 'TRANSLATION: The administration announced the implementation of new measures.',
        highlight: ['administración', 'implementación']
      },
      {
        spanish: 'LITERARY: La contemplación de la belleza natural produce tranquilidad.',
        english: 'TRANSLATION: The contemplation of natural beauty produces tranquility.',
        highlight: ['contemplación', 'belleza', 'tranquilidad']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong suffix choice**: Using incorrect nominalisation suffix
**2. Gender errors**: Wrong gender assignment to nominalised forms
**3. Spelling changes**: Not applying necessary spelling modifications
**4. Overuse**: Using too many nominalisations in speech`,
    examples: [
      {
        spanish: '❌ la construcción → ✅ la construcción',
        english: 'Wrong: construcción is feminine',
        highlight: ['la construcción']
      },
      {
        spanish: '❌ felizidad → ✅ felicidad',
        english: 'Wrong: spelling change needed',
        highlight: ['felicidad']
      },
      {
        spanish: '❌ cantamiento → ✅ cantante',
        english: 'Wrong: use -ante for agent nouns',
        highlight: ['cantante']
      },
      {
        spanish: '❌ La realizamiento → ✅ La realización',
        english: 'Wrong: use -ción for this verb',
        highlight: ['realización']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Word Formation', url: '/grammar/spanish/word-formation/overview', difficulty: 'advanced' },
  { title: 'Spanish Noun Gender', url: '/grammar/spanish/nouns/gender', difficulty: 'beginner' },
  { title: 'Spanish Suffixes', url: '/grammar/spanish/morphology/suffixes', difficulty: 'intermediate' },
  { title: 'Spanish Academic Writing', url: '/grammar/spanish/register/academic', difficulty: 'advanced' }
];

export default function SpanishNominalisationPage() {
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
              topic: 'nominalisation',
              title: 'Spanish Nominalisation - Converting Verbs and Adjectives to Nouns',
              description: 'Master Spanish nominalisation patterns including suffixes like -ción, -miento, -dad, and -eza.',
              difficulty: 'advanced',
              examples: [
                'actuar → actuación (to act → performance)',
                'mover → movimiento (to move → movement)',
                'feliz → felicidad (happy → happiness)',
                'bello → belleza (beautiful → beauty)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'nouns',
              topic: 'nominalisation',
              title: 'Spanish Nominalisation - Converting Verbs and Adjectives to Nouns'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="nouns"
        topic="nominalisation"
        title="Spanish Nominalisation - Converting Verbs and Adjectives to Nouns"
        description="Master Spanish nominalisation patterns including suffixes like -ción, -miento, -dad, and -eza"
        difficulty="advanced"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/nouns"
        practiceUrl="/grammar/spanish/nouns/nominalisation/practice"
        quizUrl="/grammar/spanish/nouns/nominalisation/quiz"
        songUrl="/songs/es?theme=grammar&topic=nominalisation"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
