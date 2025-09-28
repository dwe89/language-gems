import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'light-verbs',
  title: 'Spanish Light Verbs - Support Verbs and Complex Predicates',
  description: 'Learn Spanish light verbs including hacer, dar, tener, and other support verbs that form complex predicates with nouns.',
  difficulty: 'intermediate',
  keywords: ['spanish light verbs', 'support verbs', 'complex predicates', 'hacer', 'dar', 'tener', 'verb-noun combinations'],
  examples: ['Hacer una pregunta', 'Dar un paseo', 'Tener miedo', 'Echar de menos']
});

const sections = [
  {
    title: 'Understanding Light Verbs',
    content: 'Light verbs (verbos de apoyo) are **semantically weak verbs** that combine with nouns to form complex predicates. The main semantic content comes from the noun, while the verb provides grammatical structure.',
    examples: [
      {
        spanish: 'Hacer una pregunta.',
        english: 'Ask a question.',
        highlight: ['Hacer', 'una pregunta']
      },
      {
        spanish: 'Dar un paseo.',
        english: 'Take a walk.',
        highlight: ['Dar', 'un paseo']
      },
      {
        spanish: 'Tener miedo.',
        english: 'Be afraid.',
        highlight: ['Tener', 'miedo']
      }
    ]
  },
  {
    title: 'HACER as Light Verb',
    content: 'The verb **"hacer"** is one of the most common light verbs, forming expressions related to actions, activities, and creation.',
    examples: [
      {
        spanish: 'Hago ejercicio todos los días.',
        english: 'I exercise every day.',
        highlight: ['Hago', 'ejercicio']
      },
      {
        spanish: 'Hicieron una fiesta anoche.',
        english: 'They had a party last night.',
        highlight: ['Hicieron', 'una fiesta']
      },
      {
        spanish: 'Voy a hacer la cama.',
        english: 'I\'m going to make the bed.',
        highlight: ['hacer', 'la cama']
      }
    ],
    subsections: [
      {
        title: 'Common HACER + Noun Combinations',
        content: 'Frequent expressions with hacer as light verb.',
        conjugationTable: {
          title: 'HACER Light Verb Expressions',
          conjugations: [
            { pronoun: 'hacer ejercicio', form: 'hago ejercicio', english: 'to exercise' },
            { pronoun: 'hacer una pregunta', form: 'hago una pregunta', english: 'to ask a question' },
            { pronoun: 'hacer la cama', form: 'hago la cama', english: 'to make the bed' },
            { pronoun: 'hacer una fiesta', form: 'hago una fiesta', english: 'to have a party' },
            { pronoun: 'hacer un viaje', form: 'hago un viaje', english: 'to take a trip' },
            { pronoun: 'hacer caso', form: 'hago caso', english: 'to pay attention' }
          ]
        }
      },
      {
        title: 'HACER vs Simple Verbs',
        content: 'Comparing light verb constructions with simple verbs.',
        examples: [
          {
            spanish: 'Hacer una pregunta = Preguntar',
            english: 'Ask a question = Ask',
            highlight: ['Hacer una pregunta', 'Preguntar']
          },
          {
            spanish: 'Hacer ejercicio = Ejercitarse',
            english: 'Exercise = Exercise (reflexive)',
            highlight: ['Hacer ejercicio', 'Ejercitarse']
          }
        ]
      }
    ]
  },
  {
    title: 'DAR as Light Verb',
    content: 'The verb **"dar"** forms light verb constructions often related to giving, providing, or performing actions.',
    examples: [
      {
        spanish: 'Le doy las gracias.',
        english: 'I thank him.',
        highlight: ['doy', 'las gracias']
      },
      {
        spanish: 'Damos un paseo por el parque.',
        english: 'We take a walk through the park.',
        highlight: ['Damos', 'un paseo']
      },
      {
        spanish: 'Me da miedo la oscuridad.',
        english: 'Darkness scares me.',
        highlight: ['da', 'miedo']
      }
    ],
    subsections: [
      {
        title: 'Common DAR + Noun Combinations',
        content: 'Frequent expressions with dar as light verb.',
        conjugationTable: {
          title: 'DAR Light Verb Expressions',
          conjugations: [
            { pronoun: 'dar las gracias', form: 'doy las gracias', english: 'to thank' },
            { pronoun: 'dar un paseo', form: 'doy un paseo', english: 'to take a walk' },
            { pronoun: 'dar miedo', form: 'da miedo', english: 'to scare/frighten' },
            { pronoun: 'dar una clase', form: 'doy una clase', english: 'to teach a class' },
            { pronoun: 'dar un beso', form: 'doy un beso', english: 'to give a kiss' },
            { pronoun: 'dar la bienvenida', form: 'doy la bienvenida', english: 'to welcome' }
          ]
        }
      }
    ]
  },
  {
    title: 'TENER as Light Verb',
    content: 'The verb **"tener"** forms light verb constructions expressing states, feelings, and experiences.',
    examples: [
      {
        spanish: 'Tengo hambre.',
        english: 'I\'m hungry.',
        highlight: ['Tengo', 'hambre']
      },
      {
        spanish: 'Tiene mucha suerte.',
        english: 'He\'s very lucky.',
        highlight: ['Tiene', 'suerte']
      },
      {
        spanish: 'Tenemos una reunión mañana.',
        english: 'We have a meeting tomorrow.',
        highlight: ['Tenemos', 'una reunión']
      }
    ],
    subsections: [
      {
        title: 'Common TENER + Noun Combinations',
        content: 'Frequent expressions with tener as light verb.',
        conjugationTable: {
          title: 'TENER Light Verb Expressions',
          conjugations: [
            { pronoun: 'tener hambre', form: 'tengo hambre', english: 'to be hungry' },
            { pronoun: 'tener sed', form: 'tengo sed', english: 'to be thirsty' },
            { pronoun: 'tener miedo', form: 'tengo miedo', english: 'to be afraid' },
            { pronoun: 'tener suerte', form: 'tengo suerte', english: 'to be lucky' },
            { pronoun: 'tener cuidado', form: 'tengo cuidado', english: 'to be careful' },
            { pronoun: 'tener razón', form: 'tengo razón', english: 'to be right' }
          ]
        }
      },
      {
        title: 'TENER vs SER/ESTAR',
        content: 'Spanish uses tener where English uses "be" for many states.',
        examples: [
          {
            spanish: 'Tengo frío. (not *Estoy frío)',
            english: 'I\'m cold.',
            highlight: ['Tengo frío']
          },
          {
            spanish: 'Tiene 20 años. (not *Es 20 años)',
            english: 'He\'s 20 years old.',
            highlight: ['Tiene 20 años']
          }
        ]
      }
    ]
  },
  {
    title: 'ECHAR as Light Verb',
    content: 'The verb **"echar"** forms several important light verb constructions.',
    examples: [
      {
        spanish: 'Echo de menos a mi familia.',
        english: 'I miss my family.',
        highlight: ['Echo de menos']
      },
      {
        spanish: 'Echamos un vistazo al menú.',
        english: 'We take a look at the menu.',
        highlight: ['Echamos', 'un vistazo']
      },
      {
        spanish: 'Le echo la culpa a él.',
        english: 'I blame him.',
        highlight: ['echo', 'la culpa']
      }
    ],
    subsections: [
      {
        title: 'Common ECHAR + Noun Combinations',
        content: 'Frequent expressions with echar as light verb.',
        conjugationTable: {
          title: 'ECHAR Light Verb Expressions',
          conjugations: [
            { pronoun: 'echar de menos', form: 'echo de menos', english: 'to miss (someone/something)' },
            { pronoun: 'echar un vistazo', form: 'echo un vistazo', english: 'to take a look' },
            { pronoun: 'echar la culpa', form: 'echo la culpa', english: 'to blame' },
            { pronoun: 'echar una siesta', form: 'echo una siesta', english: 'to take a nap' },
            { pronoun: 'echar una mano', form: 'echo una mano', english: 'to lend a hand' },
            { pronoun: 'echar raíces', form: 'echo raíces', english: 'to put down roots' }
          ]
        }
      }
    ]
  },
  {
    title: 'PONER as Light Verb',
    content: 'The verb **"poner"** forms light verb constructions often related to placement, states, and actions.',
    examples: [
      {
        spanish: 'Pongo atención en clase.',
        english: 'I pay attention in class.',
        highlight: ['Pongo', 'atención']
      },
      {
        spanish: 'Se pone nervioso antes de los exámenes.',
        english: 'He gets nervous before exams.',
        highlight: ['Se pone', 'nervioso']
      },
      {
        spanish: 'Ponemos en marcha el proyecto.',
        english: 'We start the project.',
        highlight: ['Ponemos en marcha']
      }
    ],
    subsections: [
      {
        title: 'Common PONER + Noun Combinations',
        content: 'Frequent expressions with poner as light verb.',
        conjugationTable: {
          title: 'PONER Light Verb Expressions',
          conjugations: [
            { pronoun: 'poner atención', form: 'pongo atención', english: 'to pay attention' },
            { pronoun: 'ponerse nervioso', form: 'me pongo nervioso', english: 'to get nervous' },
            { pronoun: 'poner en marcha', form: 'pongo en marcha', english: 'to start/launch' },
            { pronoun: 'poner de mal humor', form: 'me pone de mal humor', english: 'to put in a bad mood' },
            { pronoun: 'poner en duda', form: 'pongo en duda', english: 'to question/doubt' },
            { pronoun: 'poner fin a', form: 'pongo fin a', english: 'to put an end to' }
          ]
        }
      }
    ]
  },
  {
    title: 'Other Common Light Verbs',
    content: 'Several other verbs function as light verbs in Spanish.',
    examples: [
      {
        spanish: 'Llevo una vida tranquila.',
        english: 'I lead a quiet life.',
        highlight: ['Llevo', 'una vida']
      },
      {
        spanish: 'Toma una decisión importante.',
        english: 'He makes an important decision.',
        highlight: ['Toma', 'una decisión']
      },
      {
        spanish: 'Mete la pata frecuentemente.',
        english: 'He puts his foot in it frequently.',
        highlight: ['Mete', 'la pata']
      }
    ],
    subsections: [
      {
        title: 'Additional Light Verb Patterns',
        content: 'Other verbs that function as light verbs.',
        conjugationTable: {
          title: 'Other Light Verb Expressions',
          conjugations: [
            { pronoun: 'llevar una vida', form: 'llevo una vida tranquila', english: 'to lead a life' },
            { pronoun: 'tomar una decisión', form: 'tomo una decisión', english: 'to make a decision' },
            { pronoun: 'meter la pata', form: 'meto la pata', english: 'to put one\'s foot in it' },
            { pronoun: 'coger el toro', form: 'cojo el toro por los cuernos', english: 'to take the bull by the horns' },
            { pronoun: 'sacar provecho', form: 'saco provecho', english: 'to take advantage' },
            { pronoun: 'perder el tiempo', form: 'pierdo el tiempo', english: 'to waste time' }
          ]
        }
      }
    ]
  },
  {
    title: 'Light Verb vs Simple Verb Alternations',
    content: 'Many light verb constructions have **simple verb equivalents**, often with slight differences in meaning or register.',
    examples: [
      {
        spanish: 'Hacer una pregunta vs Preguntar',
        english: 'Ask a question vs Ask',
        highlight: ['Hacer una pregunta', 'Preguntar']
      },
      {
        spanish: 'Tomar una decisión vs Decidir',
        english: 'Make a decision vs Decide',
        highlight: ['Tomar una decisión', 'Decidir']
      },
      {
        spanish: 'Dar un paseo vs Pasear',
        english: 'Take a walk vs Walk',
        highlight: ['Dar un paseo', 'Pasear']
      }
    ],
    subsections: [
      {
        title: 'Light Verb vs Simple Verb Comparison',
        content: 'Comparing light verb constructions with their simple verb equivalents.',
        conjugationTable: {
          title: 'Light Verb vs Simple Verb Alternations',
          conjugations: [
            { pronoun: 'Light Verb', form: 'hacer una pregunta', english: 'ask a question (formal)' },
            { pronoun: 'Simple Verb', form: 'preguntar', english: 'ask (direct)' },
            { pronoun: 'Light Verb', form: 'tomar una decisión', english: 'make a decision (deliberate)' },
            { pronoun: 'Simple Verb', form: 'decidir', english: 'decide (quick)' },
            { pronoun: 'Light Verb', form: 'dar un paseo', english: 'take a walk (leisurely)' },
            { pronoun: 'Simple Verb', form: 'pasear', english: 'walk (general)' }
          ]
        }
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future', difficulty: 'intermediate' },
  { title: 'Stem-changing Verbs', url: '/grammar/spanish/verbs/stem-changing', difficulty: 'intermediate' },
  { title: 'Ser vs Estar', url: '/grammar/spanish/verbs/ser-vs-estar', difficulty: 'beginner' },
  { title: 'Imperative', url: '/grammar/spanish/verbs/imperative', difficulty: 'intermediate' }
];

export default function SpanishLightVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Light Verbs - Support Verbs and Complex Predicates',
            description: 'Learn Spanish light verbs including hacer, dar, tener, and other support verbs that form complex predicates with nouns.',
            keywords: ['spanish light verbs', 'support verbs', 'complex predicates', 'hacer', 'dar', 'tener'],
            language: 'spanish',
            category: 'verbs',
            topic: 'light-verbs'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="light-verbs"
        title="Spanish Light Verbs"
        description="Learn Spanish light verbs including hacer, dar, tener, and other support verbs that form complex predicates with nouns."
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/light-verbs/practice"
        quizUrl="/grammar/spanish/verbs/light-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=light-verbs"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
