import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'prepositions',
  topic: 'basic-prepositions',
  title: 'Spanish Basic Prepositions (A, De, En, Con, Por, Para - Usage and Rules)',
  description: 'Master Spanish basic prepositions including a, de, en, con, por, para, usage rules, contractions, and common expressions.',
  difficulty: 'beginner',
  keywords: [
    'spanish prepositions',
    'a de en con spanish',
    'por para spanish',
    'spanish preposition usage',
    'preposition rules spanish',
    'basic prepositions spanish'
  ],
  examples: [
    'Voy a la escuela. (I go to school.)',
    'El libro de María. (María\'s book.)',
    'Estoy en casa. (I am at home.)',
    'Hablo con mi amigo. (I talk with my friend.)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Basic Prepositions',
    content: `Spanish prepositions (preposiciones) are **small words** that show **relationships** between other words in a sentence. They indicate **location**, **direction**, **time**, **manner**, and **other relationships**.

**Most common Spanish prepositions:**
- **a** - to, at (direction, indirect object)
- **de** - of, from (possession, origin)
- **en** - in, on, at (location, time)
- **con** - with (accompaniment, means)
- **por** - for, by, through (reason, agent, duration)
- **para** - for, to (purpose, destination, deadline)

**Key characteristics:**
- **Fixed usage**: Each preposition has specific uses
- **No direct translation**: Spanish and English prepositions don't always match
- **Contractions**: Some combine with articles (del, al)
- **Idiomatic expressions**: Many fixed phrases use specific prepositions
- **Verb dependencies**: Some verbs require specific prepositions

**Why prepositions matter:**
- **Meaning clarity**: Change the meaning of sentences
- **Natural speech**: Essential for fluent Spanish
- **Grammatical correctness**: Required for proper Spanish
- **Communication precision**: Express exact relationships

Mastering basic prepositions is **fundamental** for **accurate Spanish communication** and **natural expression**.`,
    examples: [
      {
        spanish: 'Voy a Madrid. (I go to Madrid.) - Direction',
        english: 'Vengo de Barcelona. (I come from Barcelona.) - Origin',
        highlight: ['a Madrid', 'de Barcelona']
      },
      {
        spanish: 'Estoy en el parque. (I am in the park.) - Location',
        english: 'Hablo con María. (I talk with María.) - Accompaniment',
        highlight: ['en el parque', 'con María']
      },
      {
        spanish: 'Trabajo por la mañana. (I work in the morning.) - Time',
        english: 'Estudio para el examen. (I study for the exam.) - Purpose',
        highlight: ['por la mañana', 'para el examen']
      }
    ]
  },
  {
    title: 'A - Direction and Indirect Object',
    content: `**A** indicates **direction**, **indirect objects**, and **specific time**:`,
    examples: [
      {
        spanish: 'Voy a la escuela. (I go to school.) - Direction',
        english: 'Llego a las tres. (I arrive at three.) - Time',
        highlight: ['a la escuela', 'a las tres']
      },
      {
        spanish: 'Le doy el libro a María. (I give the book to María.) - Indirect object',
        english: 'Vamos a comer. (We are going to eat.) - Near future',
        highlight: ['a María', 'a comer']
      }
    ],
    subsections: [
      {
        title: 'Personal A',
        content: 'A before direct objects that are people:',
        examples: [
          {
            spanish: 'Veo a mi hermano. (I see my brother.)',
            english: 'Conozco a María. (I know María.)',
            highlight: ['a mi hermano', 'a María']
          }
        ]
      },
      {
        title: 'Contraction AL',
        content: 'A + EL = AL (mandatory contraction):',
        examples: [
          {
            spanish: 'Voy al cine. (I go to the cinema.)',
            english: 'Llego al trabajo. (I arrive at work.)',
            highlight: ['al cine', 'al trabajo']
          }
        ]
      }
    ]
  },
  {
    title: 'DE - Origin and Possession',
    content: `**DE** indicates **origin**, **possession**, **material**, and **description**:`,
    examples: [
      {
        spanish: 'Soy de España. (I am from Spain.) - Origin',
        english: 'El libro de María. (María\'s book.) - Possession',
        highlight: ['de España', 'de María']
      },
      {
        spanish: 'Una mesa de madera. (A wooden table.) - Material',
        english: 'El profesor de español. (The Spanish teacher.) - Description',
        highlight: ['de madera', 'de español']
      }
    ],
    subsections: [
      {
        title: 'Contraction DEL',
        content: 'DE + EL = DEL (mandatory contraction):',
        examples: [
          {
            spanish: 'Vengo del trabajo. (I come from work.)',
            english: 'El coche del profesor. (The teacher\'s car.)',
            highlight: ['del trabajo', 'del profesor']
          }
        ]
      },
      {
        title: 'Time Expressions',
        content: 'DE for time periods:',
        examples: [
          {
            spanish: 'de día (during the day), de noche (at night)',
            english: 'de mañana (in the morning), de tarde (in the afternoon)',
            highlight: ['de día', 'de mañana']
          }
        ]
      }
    ]
  },
  {
    title: 'EN - Location and Time',
    content: `**EN** indicates **location**, **time**, and **means of transport**:`,
    examples: [
      {
        spanish: 'Estoy en casa. (I am at home.) - Location',
        english: 'En verano hace calor. (In summer it\'s hot.) - Time',
        highlight: ['en casa', 'En verano']
      },
      {
        spanish: 'Viajo en tren. (I travel by train.) - Transport',
        english: 'Hablo en español. (I speak in Spanish.) - Language',
        highlight: ['en tren', 'en español']
      }
    ],
    subsections: [
      {
        title: 'Location vs Direction',
        content: 'EN for location, A for direction:',
        examples: [
          {
            spanish: 'Estoy en el parque. (I am in the park.) - Location',
            english: 'Voy al parque. (I go to the park.) - Direction',
            highlight: ['en el parque', 'al parque']
          }
        ]
      },
      {
        title: 'Time Expressions',
        content: 'EN with months, years, seasons:',
        examples: [
          {
            spanish: 'en enero (in January), en 2023 (in 2023)',
            english: 'en primavera (in spring), en Navidad (at Christmas)',
            highlight: ['en enero', 'en primavera']
          }
        ]
      }
    ]
  },
  {
    title: 'CON - Accompaniment and Means',
    content: `**CON** indicates **accompaniment**, **means**, and **manner**:`,
    examples: [
      {
        spanish: 'Voy con mi hermana. (I go with my sister.) - Accompaniment',
        english: 'Escribo con un bolígrafo. (I write with a pen.) - Instrument',
        highlight: ['con mi hermana', 'con un bolígrafo']
      },
      {
        spanish: 'Hablo con cuidado. (I speak carefully.) - Manner',
        english: 'Café con leche. (Coffee with milk.) - Mixture',
        highlight: ['con cuidado', 'con leche']
      }
    ],
    subsections: [
      {
        title: 'CON + Pronouns',
        content: 'Special forms with pronouns:',
        examples: [
          {
            spanish: 'conmigo (with me), contigo (with you)',
            english: 'consigo (with himself/herself/yourself)',
            highlight: ['conmigo', 'contigo']
          }
        ]
      },
      {
        title: 'Fixed Expressions',
        content: 'Common phrases with CON:',
        examples: [
          {
            spanish: 'con frecuencia (frequently), con cuidado (carefully)',
            english: 'con razón (rightly), con permiso (excuse me)',
            highlight: ['con frecuencia', 'con razón']
          }
        ]
      }
    ]
  },
  {
    title: 'POR - Reason, Agent, Duration',
    content: `**POR** indicates **reason**, **agent**, **duration**, **exchange**, and **movement through**:`,
    examples: [
      {
        spanish: 'Estudio por necesidad. (I study out of necessity.) - Reason',
        english: 'El libro fue escrito por García. (The book was written by García.) - Agent',
        highlight: ['por necesidad', 'por García']
      },
      {
        spanish: 'Trabajo por ocho horas. (I work for eight hours.) - Duration',
        english: 'Cambio euros por dólares. (I exchange euros for dollars.) - Exchange',
        highlight: ['por ocho horas', 'por dólares']
      },
      {
        spanish: 'Camino por el parque. (I walk through the park.) - Movement',
        english: 'Hablo por teléfono. (I talk on the phone.) - Means',
        highlight: ['por el parque', 'por teléfono']
      }
    ],
    subsections: [
      {
        title: 'Time Expressions with POR',
        content: 'POR with parts of the day:',
        examples: [
          {
            spanish: 'por la mañana (in the morning)',
            english: 'por la tarde (in the afternoon), por la noche (at night)',
            highlight: ['por la mañana', 'por la noche']
          }
        ]
      },
      {
        title: 'POR vs PARA',
        content: 'POR for reason/cause, PARA for purpose:',
        examples: [
          {
            spanish: 'Estudio por placer. (I study for pleasure.) - Reason',
            english: 'Estudio para el examen. (I study for the exam.) - Purpose',
            highlight: ['por placer', 'para el examen']
          }
        ]
      }
    ]
  },
  {
    title: 'PARA - Purpose, Destination, Deadline',
    content: `**PARA** indicates **purpose**, **destination**, **deadline**, and **recipient**:`,
    examples: [
      {
        spanish: 'Estudio para aprender. (I study to learn.) - Purpose',
        english: 'Salgo para Madrid. (I leave for Madrid.) - Destination',
        highlight: ['para aprender', 'para Madrid']
      },
      {
        spanish: 'Es para mañana. (It\'s for tomorrow.) - Deadline',
        english: 'El regalo es para ti. (The gift is for you.) - Recipient',
        highlight: ['para mañana', 'para ti']
      }
    ],
    subsections: [
      {
        title: 'PARA + Infinitive',
        content: 'PARA to express purpose:',
        examples: [
          {
            spanish: 'Vengo para ayudar. (I come to help.)',
            english: 'Estudio para ser médico. (I study to be a doctor.)',
            highlight: ['para ayudar', 'para ser médico']
          }
        ]
      },
      {
        title: 'PARA with Opinions',
        content: 'PARA expressing "in someone\'s opinion":',
        examples: [
          {
            spanish: 'Para mí, es difícil. (For me, it\'s difficult.)',
            english: 'Para él, es fácil. (For him, it\'s easy.)',
            highlight: ['Para mí', 'Para él']
          }
        ]
      }
    ]
  },
  {
    title: 'Other Common Prepositions',
    content: `**Additional important prepositions**:`,
    conjugationTable: {
      title: 'Other Basic Prepositions',
      conjugations: [
        { pronoun: 'sin', form: 'without', english: 'sin dinero (without money)' },
        { pronoun: 'sobre', form: 'on, about', english: 'sobre la mesa (on the table)' },
        { pronoun: 'bajo', form: 'under', english: 'bajo la mesa (under the table)' },
        { pronoun: 'entre', form: 'between, among', english: 'entre amigos (among friends)' },
        { pronoun: 'hacia', form: 'towards', english: 'hacia el norte (towards the north)' },
        { pronoun: 'hasta', form: 'until, up to', english: 'hasta mañana (until tomorrow)' }
      ]
    },
    examples: [
      {
        spanish: 'Café sin azúcar. (Coffee without sugar.)',
        english: 'Un libro sobre historia. (A book about history.)',
        highlight: ['sin azúcar', 'sobre historia']
      }
    ]
  },
  {
    title: 'Prepositions with Verbs',
    content: `**Many verbs require specific prepositions**:`,
    conjugationTable: {
      title: 'Verbs + Prepositions',
      conjugations: [
        { pronoun: 'pensar en', form: 'to think about', english: 'Pienso en ti. (I think about you.)' },
        { pronoun: 'soñar con', form: 'to dream about', english: 'Sueño con viajar. (I dream about traveling.)' },
        { pronoun: 'depender de', form: 'to depend on', english: 'Depende de ti. (It depends on you.)' },
        { pronoun: 'enamorarse de', form: 'to fall in love with', english: 'Se enamoró de ella. (He fell in love with her.)' },
        { pronoun: 'casarse con', form: 'to marry', english: 'Se casó con María. (He married María.)' }
      ]
    },
    examples: [
      {
        spanish: 'Me acuerdo de mi infancia. (I remember my childhood.)',
        english: 'Se preocupa por sus hijos. (She worries about her children.)',
        highlight: ['Me acuerdo de', 'Se preocupa por']
      }
    ]
  },
  {
    title: 'Fixed Expressions with Prepositions',
    content: `**Common idiomatic expressions** with prepositions:`,
    examples: [
      {
        spanish: 'a pie (on foot), a mano (by hand)',
        english: 'de memoria (by heart), de repente (suddenly)',
        highlight: ['a pie', 'de memoria']
      },
      {
        spanish: 'en serio (seriously), en broma (jokingly)',
        english: 'por favor (please), por supuesto (of course)',
        highlight: ['en serio', 'por favor']
      },
      {
        spanish: 'para siempre (forever), sin duda (without doubt)',
        english: 'con razón (rightly), con frecuencia (frequently)',
        highlight: ['para siempre', 'con razón']
      }
    ]
  },
  {
    title: 'Prepositions of Place',
    content: `**Spatial relationships** with prepositions:`,
    conjugationTable: {
      title: 'Location Prepositions',
      conjugations: [
        { pronoun: 'en', form: 'in, on, at', english: 'en la mesa (on the table)' },
        { pronoun: 'sobre', form: 'on, above', english: 'sobre el libro (on the book)' },
        { pronoun: 'bajo', form: 'under', english: 'bajo la cama (under the bed)' },
        { pronoun: 'delante de', form: 'in front of', english: 'delante de la casa (in front of the house)' },
        { pronoun: 'detrás de', form: 'behind', english: 'detrás del coche (behind the car)' },
        { pronoun: 'al lado de', form: 'next to', english: 'al lado del parque (next to the park)' }
      ]
    },
    examples: [
      {
        spanish: 'El gato está debajo de la mesa. (The cat is under the table.)',
        english: 'La tienda está enfrente del banco. (The store is across from the bank.)',
        highlight: ['debajo de la mesa', 'enfrente del banco']
      }
    ]
  },
  {
    title: 'Common Mistakes with Prepositions',
    content: `Here are frequent errors students make:

**1. Direct translation**: Using English preposition logic
**2. Missing contractions**: Not using del/al when required
**3. POR vs PARA confusion**: Wrong preposition for context
**4. Verb + preposition errors**: Wrong preposition with specific verbs`,
    examples: [
      {
        spanish: '❌ Pienso sobre ti → ✅ Pienso en ti',
        english: 'Wrong: PENSAR uses EN, not SOBRE',
        highlight: ['Pienso en ti']
      },
      {
        spanish: '❌ Voy a el cine → ✅ Voy al cine',
        english: 'Wrong: must contract A + EL = AL',
        highlight: ['al cine']
      },
      {
        spanish: '❌ Estudio por el examen → ✅ Estudio para el examen',
        english: 'Wrong: use PARA for purpose, not POR',
        highlight: ['para el examen']
      },
      {
        spanish: '❌ Dependo en ti → ✅ Dependo de ti',
        english: 'Wrong: DEPENDER uses DE, not EN',
        highlight: ['Dependo de ti']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Definite Articles', url: '/grammar/spanish/articles/definite-articles', difficulty: 'beginner' },
  { title: 'Spanish Por vs Para', url: '/grammar/spanish/verbs/por-vs-para', difficulty: 'intermediate' },
  { title: 'Spanish Adverb Formation', url: '/grammar/spanish/adverbs/formation', difficulty: 'intermediate' },
  { title: 'Spanish Noun Gender', url: '/grammar/spanish/nouns/gender', difficulty: 'beginner' }
];

export default function SpanishBasicPrepositionsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'prepositions',
              topic: 'basic-prepositions',
              title: 'Spanish Basic Prepositions (A, De, En, Con, Por, Para - Usage and Rules)',
              description: 'Master Spanish basic prepositions including a, de, en, con, por, para, usage rules, contractions, and common expressions.',
              difficulty: 'beginner',
              examples: [
                'Voy a la escuela. (I go to school.)',
                'El libro de María. (María\'s book.)',
                'Estoy en casa. (I am at home.)',
                'Hablo con mi amigo. (I talk with my friend.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'prepositions',
              topic: 'basic-prepositions',
              title: 'Spanish Basic Prepositions (A, De, En, Con, Por, Para - Usage and Rules)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="prepositions"
        topic="basic-prepositions"
        title="Spanish Basic Prepositions (A, De, En, Con, Por, Para - Usage and Rules)"
        description="Master Spanish basic prepositions including a, de, en, con, por, para, usage rules, contractions, and common expressions"
        difficulty="beginner"
        estimatedTime={16}
        sections={sections}
        backUrl="/grammar/spanish/prepositions"
        practiceUrl="/grammar/spanish/prepositions/basic-prepositions/practice"
        quizUrl="/grammar/spanish/prepositions/basic-prepositions/quiz"
        songUrl="/songs/es?theme=grammar&topic=basic-prepositions"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
