import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'adverbial-prepositional',
  topic: 'por-vs-para',
  title: 'Spanish Por vs Para - Complete Usage Guide and Rules',
  description: 'Master the difference between Spanish por and para with comprehensive rules, examples, and common usage patterns.',
  difficulty: 'intermediate',
  keywords: [
    'spanish por vs para',
    'por para difference spanish',
    'spanish prepositions por para',
    'when to use por para',
    'spanish grammar por para'
  ],
  examples: [
    'Trabajo para mi familia. (I work for my family.)',
    'Camino por el parque. (I walk through the park.)',
    'Estudio para ser médico. (I study to be a doctor.)',
    'Gracias por tu ayuda. (Thanks for your help.)'
  ]
});

const sections = [
  {
    title: 'Understanding Por vs Para',
    content: `**Por** and **para** are two of the most challenging Spanish prepositions for learners. Both can translate to "for" in English, but they have **distinct meanings** and **specific usage rules**.

**Basic distinction:**
- **Para**: Purpose, destination, deadline, recipient
- **Por**: Reason, means, duration, exchange, movement through

**Key concept:**
- **Para** looks **forward** (toward a goal, purpose, or future point)
- **Por** looks **backward** (reason, cause) or describes **means/method**

**Memory aids:**
- **Para** = Purpose, Point in time, Place (destination)
- **Por** = Reason, Route, Rate, Replacement

**Why this matters:**
- **Essential distinction**: Changes meaning completely
- **Natural Spanish**: Required for fluent expression
- **Common confusion**: Most difficult preposition pair
- **Frequent usage**: Used constantly in daily Spanish

Mastering por vs para is **crucial** for **intermediate Spanish proficiency**.`,
    examples: [
      {
        spanish: 'PARA (purpose): Estudio para aprender. (I study in order to learn.)',
        english: 'POR (reason): Estudio por necesidad. (I study because of necessity.)',
        highlight: ['para aprender', 'por necesidad']
      },
      {
        spanish: 'PARA (destination): Voy para Madrid. (I\'m going to Madrid.)',
        english: 'POR (through): Paso por Madrid. (I pass through Madrid.)',
        highlight: ['para Madrid', 'por Madrid']
      }
    ]
  },
  {
    title: 'PARA - Purpose and Goals',
    content: `**Para** expresses **purpose, goals, and intended use**:`,
    conjugationTable: {
      title: 'PARA Usage - Purpose',
      conjugations: [
        { pronoun: 'Purpose/Goal', form: 'para + infinitive', english: 'Estudio para aprender. (I study to learn.)' },
        { pronoun: 'Intended use', form: 'para + noun', english: 'Es para ti. (It\'s for you.)' },
        { pronoun: 'Profession', form: 'para ser', english: 'Estudio para ser médico. (I study to be a doctor.)' },
        { pronoun: 'In order to', form: 'para que', english: 'Lo hago para que entiendas. (I do it so you understand.)' }
      ]
    },
    examples: [
      {
        spanish: 'PURPOSE: Trabajo para ganar dinero. (I work to earn money.)',
        english: 'RECIPIENT: Este regalo es para María. (This gift is for María.)',
        highlight: ['para ganar', 'para María']
      },
      {
        spanish: 'GOAL: Ahorro para comprar una casa. (I save to buy a house.)',
        english: 'USE: Necesito gafas para leer. (I need glasses to read.)',
        highlight: ['para comprar', 'para leer']
      }
    ]
  },
  {
    title: 'PARA - Destination and Deadlines',
    content: `**Para** indicates **destination and time limits**:`,
    conjugationTable: {
      title: 'PARA Usage - Destination/Time',
      conjugations: [
        { pronoun: 'Destination', form: 'para + place', english: 'Salgo para España. (I leave for Spain.)' },
        { pronoun: 'Deadline', form: 'para + time', english: 'Es para mañana. (It\'s for tomorrow.)' },
        { pronoun: 'By (time)', form: 'para las...', english: 'Para las cinco. (By five o\'clock.)' },
        { pronoun: 'Direction', form: 'para + direction', english: 'Voy para allá. (I\'m going over there.)' }
      ]
    },
    examples: [
      {
        spanish: 'DESTINATION: El tren para Barcelona. (The train to Barcelona.)',
        english: 'DEADLINE: La tarea es para el lunes. (The homework is for Monday.)',
        highlight: ['para Barcelona', 'para el lunes']
      },
      {
        spanish: 'BY TIME: Termino para las seis. (I finish by six.)',
        english: 'DIRECTION: Camina para la derecha. (Walk toward the right.)',
        highlight: ['para las seis', 'para la derecha']
      }
    ]
  },
  {
    title: 'POR - Reason and Cause',
    content: `**Por** expresses **reason, cause, and motivation**:`,
    conjugationTable: {
      title: 'POR Usage - Reason',
      conjugations: [
        { pronoun: 'Reason/Cause', form: 'por + noun', english: 'Por la lluvia. (Because of the rain.)' },
        { pronoun: 'Thanks for', form: 'gracias por', english: 'Gracias por tu ayuda. (Thanks for your help.)' },
        { pronoun: 'Because of', form: 'por + person', english: 'Lo hago por ti. (I do it because of you.)' },
        { pronoun: 'For the sake of', form: 'por + abstract', english: 'Por amor. (For love.)' }
      ]
    },
    examples: [
      {
        spanish: 'REASON: No salgo por el frío. (I don\'t go out because of the cold.)',
        english: 'GRATITUDE: Gracias por venir. (Thanks for coming.)',
        highlight: ['por el frío', 'por venir']
      },
      {
        spanish: 'MOTIVATION: Lucho por mis hijos. (I fight for my children.)',
        english: 'CAUSE: Está cerrado por vacaciones. (It\'s closed for vacation.)',
        highlight: ['por mis hijos', 'por vacaciones']
      }
    ]
  },
  {
    title: 'POR - Movement and Duration',
    content: `**Por** indicates **movement through space and duration**:`,
    conjugationTable: {
      title: 'POR Usage - Movement/Duration',
      conjugations: [
        { pronoun: 'Through/Along', form: 'por + place', english: 'Camino por el parque. (I walk through the park.)' },
        { pronoun: 'Duration', form: 'por + time', english: 'Estudio por dos horas. (I study for two hours.)' },
        { pronoun: 'Around/About', form: 'por + area', english: 'Vivo por aquí. (I live around here.)' },
        { pronoun: 'During', form: 'por + period', english: 'Por la mañana. (During the morning.)' }
      ]
    },
    examples: [
      {
        spanish: 'THROUGH: Paso por tu casa. (I pass by your house.)',
        english: 'DURATION: Trabajo por ocho horas. (I work for eight hours.)',
        highlight: ['por tu casa', 'por ocho horas']
      },
      {
        spanish: 'AROUND: Hay tiendas por toda la ciudad. (There are stores all around the city.)',
        english: 'TIME PERIOD: Por la tarde veo TV. (In the afternoon I watch TV.)',
        highlight: ['por toda la ciudad', 'Por la tarde']
      }
    ]
  },
  {
    title: 'POR - Exchange and Means',
    content: `**Por** expresses **exchange, price, and means**:`,
    conjugationTable: {
      title: 'POR Usage - Exchange/Means',
      conjugations: [
        { pronoun: 'Price/Exchange', form: 'por + amount', english: 'Lo compré por 50 euros. (I bought it for 50 euros.)' },
        { pronoun: 'Means/Method', form: 'por + means', english: 'Hablo por teléfono. (I speak by phone.)' },
        { pronoun: 'Per/Rate', form: 'por + unit', english: 'Cien kilómetros por hora. (100 kilometers per hour.)' },
        { pronoun: 'In place of', form: 'por + person', english: 'Trabajo por mi hermano. (I work in place of my brother.)' }
      ]
    },
    examples: [
      {
        spanish: 'PRICE: Pagué por el coche. (I paid for the car.)',
        english: 'MEANS: Envío por correo. (I send by mail.)',
        highlight: ['por el coche', 'por correo']
      },
      {
        spanish: 'RATE: Gano por hora. (I earn per hour.)',
        english: 'REPLACEMENT: Hablo por él. (I speak for him/in his place.)',
        highlight: ['por hora', 'por él']
      }
    ]
  },
  {
    title: 'Common Fixed Expressions',
    content: `**Fixed expressions** with por and para:`,
    conjugationTable: {
      title: 'Fixed Expressions',
      conjugations: [
        { pronoun: 'por favor', form: 'please', english: 'Por favor, ayúdame. (Please help me.)' },
        { pronoun: 'por ejemplo', form: 'for example', english: 'Por ejemplo, Madrid. (For example, Madrid.)' },
        { pronoun: 'por fin', form: 'finally', english: 'Por fin llegaste. (You finally arrived.)' },
        { pronoun: 'para siempre', form: 'forever', english: 'Te amo para siempre. (I love you forever.)' },
        { pronoun: 'por supuesto', form: 'of course', english: 'Por supuesto que sí. (Of course yes.)' },
        { pronoun: 'para nada', form: 'not at all', english: 'No me gusta para nada. (I don\'t like it at all.)' }
      ]
    },
    examples: [
      {
        spanish: 'COURTESY: Por favor y gracias. (Please and thank you.)',
        english: 'EMPHASIS: Para nada es fácil. (It\'s not easy at all.)',
        highlight: ['Por favor', 'Para nada']
      }
    ]
  },
  {
    title: 'Direct Comparisons',
    content: `**Side-by-side comparisons** showing the difference:`,
    examples: [
      {
        spanish: 'PARA: Trabajo para mi familia. (I work for my family - purpose/benefit)',
        english: 'POR: Trabajo por mi familia. (I work because of my family - reason/motivation)',
        highlight: ['para mi familia', 'por mi familia']
      },
      {
        spanish: 'PARA: Voy para Madrid. (I\'m going to Madrid - destination)',
        english: 'POR: Paso por Madrid. (I pass through Madrid - route)',
        highlight: ['para Madrid', 'por Madrid']
      },
      {
        spanish: 'PARA: Es para las cinco. (It\'s for five o\'clock - deadline)',
        english: 'POR: Es por las cinco. (It\'s around five o\'clock - approximate time)',
        highlight: ['para las cinco', 'por las cinco']
      },
      {
        spanish: 'PARA: Estudio para ser médico. (I study to be a doctor - purpose)',
        english: 'POR: Estudio por interés. (I study out of interest - reason)',
        highlight: ['para ser médico', 'por interés']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong preposition**: Using por when para is needed and vice versa
**2. English interference**: Translating "for" directly
**3. Fixed expressions**: Using wrong preposition in set phrases
**4. Time confusion**: Mixing deadline (para) vs duration (por)`,
    examples: [
      {
        spanish: '❌ Estudio por ser médico → ✅ Estudio para ser médico',
        english: 'Wrong: use para for purpose/goal',
        highlight: ['para ser médico']
      },
      {
        spanish: '❌ Gracias para tu ayuda → ✅ Gracias por tu ayuda',
        english: 'Wrong: fixed expression uses por',
        highlight: ['por tu ayuda']
      },
      {
        spanish: '❌ Trabajo por dos años → ✅ Trabajo por dos años (duration) / para dos años (until)',
        english: 'Context matters: duration vs deadline',
        highlight: ['por dos años']
      },
      {
        spanish: '❌ Voy por Madrid → ✅ Voy para Madrid (destination) / por Madrid (through)',
        english: 'Wrong: destination uses para, route uses por',
        highlight: ['para Madrid', 'por Madrid']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Basic Prepositions', url: '/grammar/spanish/prepositions/basic-prepositions', difficulty: 'beginner' },
  { title: 'Spanish Preposition A', url: '/grammar/spanish/adverbial-prepositional/personal-a', difficulty: 'beginner' },
  { title: 'Spanish Preposition DE', url: '/grammar/spanish/adverbial-prepositional/preposition-de', difficulty: 'beginner' },
  { title: 'Spanish Infinitive Constructions', url: '/grammar/spanish/verbs/infinitive-constructions', difficulty: 'intermediate' }
];

export default function SpanishPorVsParaPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'adverbial-prepositional',
              topic: 'por-vs-para',
              title: 'Spanish Por vs Para - Complete Usage Guide and Rules',
              description: 'Master the difference between Spanish por and para with comprehensive rules, examples, and common usage patterns.',
              difficulty: 'intermediate',
              examples: [
                'Trabajo para mi familia. (I work for my family.)',
                'Camino por el parque. (I walk through the park.)',
                'Estudio para ser médico. (I study to be a doctor.)',
                'Gracias por tu ayuda. (Thanks for your help.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'adverbial-prepositional',
              topic: 'por-vs-para',
              title: 'Spanish Por vs Para - Complete Usage Guide and Rules'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="adverbial-prepositional"
        topic="por-vs-para"
        title="Spanish Por vs Para - Complete Usage Guide and Rules"
        description="Master the difference between Spanish por and para with comprehensive rules, examples, and common usage patterns"
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/adverbial-prepositional"
        practiceUrl="/grammar/spanish/adverbial-prepositional/por-vs-para/practice"
        quizUrl="/grammar/spanish/adverbial-prepositional/por-vs-para/quiz"
        songUrl="/songs/es?theme=grammar&topic=por-vs-para"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
