import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'action-verbs',
  title: 'Spanish Action Verbs - Physical Activities and Actions',
  description: 'Learn Spanish action verbs including hacer, trabajar, jugar, and other verbs expressing physical activities, work, and actions.',
  difficulty: 'beginner',
  keywords: ['spanish action verbs', 'activity verbs', 'hacer', 'trabajar', 'jugar', 'physical actions', 'work verbs'],
  examples: ['Hago ejercicio', 'Trabajo en casa', 'Juego fútbol', 'Estudio español']
});

const sections = [
  {
    title: 'Understanding Action Verbs',
    content: 'Action verbs express **physical activities**, **work**, **play**, and **concrete actions** that people perform. They describe what someone does or is doing.',
    examples: [
      {
        spanish: 'Trabajo en una oficina.',
        english: 'I work in an office.',
        highlight: ['Trabajo']
      },
      {
        spanish: 'Juega fútbol los domingos.',
        english: 'He plays soccer on Sundays.',
        highlight: ['Juega']
      },
      {
        spanish: 'Estudiamos español juntos.',
        english: 'We study Spanish together.',
        highlight: ['Estudiamos']
      }
    ]
  },
  {
    title: 'HACER - Doing/Making',
    content: 'The verb **"hacer"** is one of the most versatile action verbs, meaning "to do" or "to make."',
    examples: [
      {
        spanish: 'Hago la tarea por la tarde.',
        english: 'I do homework in the afternoon.',
        highlight: ['Hago']
      },
      {
        spanish: 'Hace un pastel para la fiesta.',
        english: 'She makes a cake for the party.',
        highlight: ['Hace']
      },
      {
        spanish: 'Hacemos ejercicio en el gimnasio.',
        english: 'We exercise at the gym.',
        highlight: ['Hacemos']
      }
    ],
    subsections: [
      {
        title: 'HACER Conjugation',
        content: 'HACER is irregular in several tenses.',
        conjugationTable: {
          title: 'HACER Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'hago', english: 'I do/make' },
            { pronoun: 'tú', form: 'haces', english: 'you do/make' },
            { pronoun: 'él/ella', form: 'hace', english: 'he/she does/makes' },
            { pronoun: 'nosotros', form: 'hacemos', english: 'we do/make' },
            { pronoun: 'vosotros', form: 'hacéis', english: 'you all do/make' },
            { pronoun: 'ellos', form: 'hacen', english: 'they do/make' }
          ]
        }
      },
      {
        title: 'Common HACER Expressions',
        content: 'HACER is used in many everyday expressions.',
        examples: [
          {
            spanish: 'Hacer la cama',
            english: 'Make the bed',
            highlight: ['Hacer la cama']
          },
          {
            spanish: 'Hacer deporte',
            english: 'Do sports',
            highlight: ['Hacer deporte']
          },
          {
            spanish: 'Hacer la compra',
            english: 'Do the shopping',
            highlight: ['Hacer la compra']
          }
        ]
      }
    ]
  },
  {
    title: 'TRABAJAR - Working',
    content: 'The verb **"trabajar"** means "to work" and refers to professional or labor activities.',
    examples: [
      {
        spanish: 'Trabajo de lunes a viernes.',
        english: 'I work from Monday to Friday.',
        highlight: ['Trabajo']
      },
      {
        spanish: 'Trabaja en un hospital.',
        english: 'She works in a hospital.',
        highlight: ['Trabaja']
      },
      {
        spanish: 'Trabajamos en equipo.',
        english: 'We work as a team.',
        highlight: ['Trabajamos']
      }
    ],
    subsections: [
      {
        title: 'TRABAJAR Constructions',
        content: 'Different prepositions and constructions with trabajar.',
        conjugationTable: {
          title: 'TRABAJAR Usage Patterns',
          conjugations: [
            { pronoun: 'trabajar en', form: 'trabajo en una empresa', english: 'work at a company' },
            { pronoun: 'trabajar de', form: 'trabajo de profesor', english: 'work as a teacher' },
            { pronoun: 'trabajar para', form: 'trabajo para mi jefe', english: 'work for my boss' },
            { pronoun: 'trabajar con', form: 'trabajo con ordenadores', english: 'work with computers' },
            { pronoun: 'trabajar desde', form: 'trabajo desde casa', english: 'work from home' },
            { pronoun: 'trabajar por', form: 'trabajo por horas', english: 'work by the hour' }
          ]
        }
      }
    ]
  },
  {
    title: 'JUGAR - Playing',
    content: 'The verb **"jugar"** means "to play" games, sports, or engage in recreational activities.',
    examples: [
      {
        spanish: 'Juego al tenis los sábados.',
        english: 'I play tennis on Saturdays.',
        highlight: ['Juego']
      },
      {
        spanish: 'Los niños juegan en el parque.',
        english: 'The children play in the park.',
        highlight: ['juegan']
      },
      {
        spanish: 'Jugamos cartas después de cenar.',
        english: 'We play cards after dinner.',
        highlight: ['Jugamos']
      }
    ],
    subsections: [
      {
        title: 'JUGAR Conjugation',
        content: 'JUGAR is stem-changing (u→ue).',
        conjugationTable: {
          title: 'JUGAR Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'juego', english: 'I play' },
            { pronoun: 'tú', form: 'juegas', english: 'you play' },
            { pronoun: 'él/ella', form: 'juega', english: 'he/she plays' },
            { pronoun: 'nosotros', form: 'jugamos', english: 'we play' },
            { pronoun: 'vosotros', form: 'jugáis', english: 'you all play' },
            { pronoun: 'ellos', form: 'juegan', english: 'they play' }
          ]
        }
      },
      {
        title: 'JUGAR A vs JUGAR CON',
        content: 'Different prepositions with jugar.',
        examples: [
          {
            spanish: 'Jugar al fútbol (play soccer)',
            english: 'Play soccer',
            highlight: ['Jugar al']
          },
          {
            spanish: 'Jugar con muñecas (play with dolls)',
            english: 'Play with dolls',
            highlight: ['Jugar con']
          }
        ]
      }
    ]
  },
  {
    title: 'ESTUDIAR - Studying',
    content: 'The verb **"estudiar"** means "to study" and refers to learning activities.',
    examples: [
      {
        spanish: 'Estudio medicina en la universidad.',
        english: 'I study medicine at the university.',
        highlight: ['Estudio']
      },
      {
        spanish: 'Estudia para el examen.',
        english: 'He studies for the exam.',
        highlight: ['Estudia']
      },
      {
        spanish: 'Estudiamos juntos en la biblioteca.',
        english: 'We study together in the library.',
        highlight: ['Estudiamos']
      }
    ],
    subsections: [
      {
        title: 'ESTUDIAR Constructions',
        content: 'Different ways to use estudiar.',
        conjugationTable: {
          title: 'ESTUDIAR Usage Patterns',
          conjugations: [
            { pronoun: 'estudiar + subject', form: 'estudio español', english: 'study Spanish' },
            { pronoun: 'estudiar para', form: 'estudio para médico', english: 'study to be a doctor' },
            { pronoun: 'estudiar en', form: 'estudio en Madrid', english: 'study in Madrid' },
            { pronoun: 'estudiar con', form: 'estudio con María', english: 'study with María' },
            { pronoun: 'estudiar por', form: 'estudio por la noche', english: 'study at night' },
            { pronoun: 'estudiar desde', form: 'estudio desde casa', english: 'study from home' }
          ]
        }
      }
    ]
  },
  {
    title: 'COCINAR - Cooking',
    content: 'The verb **"cocinar"** means "to cook" and refers to food preparation activities.',
    examples: [
      {
        spanish: 'Cocino para mi familia.',
        english: 'I cook for my family.',
        highlight: ['Cocino']
      },
      {
        spanish: 'Cocina muy bien.',
        english: 'She cooks very well.',
        highlight: ['Cocina']
      },
      {
        spanish: 'Cocinamos juntos los domingos.',
        english: 'We cook together on Sundays.',
        highlight: ['Cocinamos']
      }
    ],
    subsections: [
      {
        title: 'Cooking-related Action Verbs',
        content: 'Various verbs related to cooking and food preparation.',
        conjugationTable: {
          title: 'Cooking Action Verbs',
          conjugations: [
            { pronoun: 'cocinar', form: 'cocino pasta', english: 'I cook pasta' },
            { pronoun: 'preparar', form: 'preparo la cena', english: 'I prepare dinner' },
            { pronoun: 'freír', form: 'frío huevos', english: 'I fry eggs' },
            { pronoun: 'hervir', form: 'hiervo agua', english: 'I boil water' },
            { pronoun: 'hornear', form: 'horneo pan', english: 'I bake bread' },
            { pronoun: 'asar', form: 'aso carne', english: 'I roast meat' }
          ]
        }
      }
    ]
  },
  {
    title: 'LIMPIAR - Cleaning',
    content: 'The verb **"limpiar"** means "to clean" and refers to cleaning and maintenance activities.',
    examples: [
      {
        spanish: 'Limpio la casa los sábados.',
        english: 'I clean the house on Saturdays.',
        highlight: ['Limpio']
      },
      {
        spanish: 'Limpia su habitación.',
        english: 'He cleans his room.',
        highlight: ['Limpia']
      },
      {
        spanish: 'Limpiamos el coche juntos.',
        english: 'We clean the car together.',
        highlight: ['Limpiamos']
      }
    ],
    subsections: [
      {
        title: 'Cleaning Action Verbs',
        content: 'Various verbs related to cleaning and maintenance.',
        conjugationTable: {
          title: 'Cleaning Action Verbs',
          conjugations: [
            { pronoun: 'limpiar', form: 'limpio la mesa', english: 'I clean the table' },
            { pronoun: 'lavar', form: 'lavo los platos', english: 'I wash the dishes' },
            { pronoun: 'fregar', form: 'friego el suelo', english: 'I mop the floor' },
            { pronoun: 'barrer', form: 'barro la cocina', english: 'I sweep the kitchen' },
            { pronoun: 'aspirar', form: 'aspiro la alfombra', english: 'I vacuum the carpet' },
            { pronoun: 'ordenar', form: 'ordeno mi cuarto', english: 'I tidy my room' }
          ]
        }
      }
    ]
  },
  {
    title: 'COMPRAR - Shopping/Buying',
    content: 'The verb **"comprar"** means "to buy" and refers to shopping and purchasing activities.',
    examples: [
      {
        spanish: 'Compro comida en el supermercado.',
        english: 'I buy food at the supermarket.',
        highlight: ['Compro']
      },
      {
        spanish: 'Compra ropa nueva.',
        english: 'She buys new clothes.',
        highlight: ['Compra']
      },
      {
        spanish: 'Compramos regalos para Navidad.',
        english: 'We buy gifts for Christmas.',
        highlight: ['Compramos']
      }
    ],
    subsections: [
      {
        title: 'Shopping Action Verbs',
        content: 'Various verbs related to shopping and commerce.',
        conjugationTable: {
          title: 'Shopping Action Verbs',
          conjugations: [
            { pronoun: 'comprar', form: 'compro pan', english: 'I buy bread' },
            { pronoun: 'vender', form: 'vendo mi coche', english: 'I sell my car' },
            { pronoun: 'pagar', form: 'pago la cuenta', english: 'I pay the bill' },
            { pronoun: 'gastar', form: 'gasto dinero', english: 'I spend money' },
            { pronoun: 'ahorrar', form: 'ahorro para vacaciones', english: 'I save for vacation' },
            { pronoun: 'elegir', form: 'elijo un regalo', english: 'I choose a gift' }
          ]
        }
      }
    ]
  },
  {
    title: 'Daily Activity Verbs',
    content: 'Common action verbs for **daily activities** and routines.',
    examples: [
      {
        spanish: 'Me levanto a las siete.',
        english: 'I get up at seven.',
        highlight: ['Me levanto']
      },
      {
        spanish: 'Desayuna cereales.',
        english: 'He eats cereal for breakfast.',
        highlight: ['Desayuna']
      },
      {
        spanish: 'Nos duchamos por la mañana.',
        english: 'We shower in the morning.',
        highlight: ['Nos duchamos']
      }
    ],
    subsections: [
      {
        title: 'Daily Routine Verbs',
        content: 'Essential verbs for describing daily routines.',
        conjugationTable: {
          title: 'Daily Activity Verbs',
          conjugations: [
            { pronoun: 'levantarse', form: 'me levanto', english: 'I get up' },
            { pronoun: 'ducharse', form: 'me ducho', english: 'I shower' },
            { pronoun: 'desayunar', form: 'desayuno', english: 'I have breakfast' },
            { pronoun: 'almorzar', form: 'almuerzo', english: 'I have lunch' },
            { pronoun: 'cenar', form: 'ceno', english: 'I have dinner' },
            { pronoun: 'acostarse', form: 'me acuesto', english: 'I go to bed' }
          ]
        }
      },
      {
        title: 'Personal Care Verbs',
        content: 'Verbs for personal hygiene and care.',
        examples: [
          {
            spanish: 'Me lavo los dientes.',
            english: 'I brush my teeth.',
            highlight: ['Me lavo']
          },
          {
            spanish: 'Se peina el cabello.',
            english: 'She combs her hair.',
            highlight: ['Se peina']
          }
        ]
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Reflexive Verbs', url: '/grammar/spanish/verbs/reflexive', difficulty: 'intermediate' },
  { title: 'Modal Verbs', url: '/grammar/spanish/verbs/modal-verbs', difficulty: 'intermediate' },
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future', difficulty: 'intermediate' },
  { title: 'Passive Voice', url: '/grammar/spanish/verbs/passive-voice', difficulty: 'advanced' }
];

export default function SpanishActionVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Action Verbs - Physical Activities and Actions',
            description: 'Learn Spanish action verbs including hacer, trabajar, jugar, and other verbs expressing physical activities, work, and actions.',
            keywords: ['spanish action verbs', 'activity verbs', 'hacer', 'trabajar', 'jugar', 'physical actions', 'work verbs'],
            language: 'spanish',
            category: 'verbs',
            topic: 'action-verbs'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="action-verbs"
        title="Spanish Action Verbs"
        description="Learn Spanish action verbs including hacer, trabajar, jugar, and other verbs expressing physical activities, work, and actions."
        difficulty="beginner"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/action-verbs/practice"
        quizUrl="/grammar/spanish/verbs/action-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=action-verbs"
        youtubeVideoId="action-verbs-spanish"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
