import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'communication-verbs',
  title: 'Spanish Communication Verbs - Speaking, Listening, and Expression',
  description: 'Learn Spanish communication verbs including hablar, decir, escuchar, and other verbs for speaking, listening, and expressing ideas.',
  difficulty: 'intermediate',
  keywords: ['spanish communication verbs', 'speaking verbs', 'listening verbs', 'hablar', 'decir', 'escuchar', 'expression verbs'],
  examples: ['Hablo español', 'Dice la verdad', 'Escucha música', 'Pregunta por ti']
});

const sections = [
  {
    title: 'Understanding Communication Verbs',
    content: 'Communication verbs express **speaking**, **listening**, **asking**, **answering**, and other forms of verbal and non-verbal communication. They are essential for describing interactions between people.',
    examples: [
      {
        spanish: 'Hablo con mi madre todos los días.',
        english: 'I speak with my mother every day.',
        highlight: ['Hablo']
      },
      {
        spanish: 'Dice que viene mañana.',
        english: 'He says he\'s coming tomorrow.',
        highlight: ['Dice']
      },
      {
        spanish: 'Escuchamos música clásica.',
        english: 'We listen to classical music.',
        highlight: ['Escuchamos']
      }
    ]
  },
  {
    title: 'HABLAR - Speaking/Talking',
    content: 'The verb **"hablar"** is the general verb for speaking or talking.',
    examples: [
      {
        spanish: 'Hablo tres idiomas.',
        english: 'I speak three languages.',
        highlight: ['Hablo']
      },
      {
        spanish: 'Hablan de política.',
        english: 'They talk about politics.',
        highlight: ['Hablan']
      },
      {
        spanish: 'Hablamos por teléfono.',
        english: 'We talk on the phone.',
        highlight: ['Hablamos']
      }
    ],
    subsections: [
      {
        title: 'HABLAR Constructions',
        content: 'Different prepositions and constructions with hablar.',
        conjugationTable: {
          title: 'HABLAR Usage Patterns',
          conjugations: [
            { pronoun: 'hablar con', form: 'hablo con María', english: 'talk with María' },
            { pronoun: 'hablar de', form: 'hablo de trabajo', english: 'talk about work' },
            { pronoun: 'hablar por', form: 'hablo por teléfono', english: 'talk on the phone' },
            { pronoun: 'hablar en', form: 'hablo en español', english: 'speak in Spanish' },
            { pronoun: 'hablar sobre', form: 'hablo sobre el tema', english: 'speak about the topic' },
            { pronoun: 'hablar a', form: 'hablo a la clase', english: 'speak to the class' }
          ]
        }
      }
    ]
  },
  {
    title: 'DECIR - Saying/Telling',
    content: 'The verb **"decir"** means to say or tell, often introducing direct or indirect speech.',
    examples: [
      {
        spanish: 'Dice que está cansado.',
        english: 'He says he\'s tired.',
        highlight: ['Dice']
      },
      {
        spanish: 'Le digo la verdad.',
        english: 'I tell him the truth.',
        highlight: ['digo']
      },
      {
        spanish: 'Dijeron "hasta luego".',
        english: 'They said "see you later".',
        highlight: ['Dijeron']
      }
    ],
    subsections: [
      {
        title: 'DECIR Conjugation',
        content: 'DECIR is highly irregular.',
        conjugationTable: {
          title: 'DECIR Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'digo', english: 'I say/tell' },
            { pronoun: 'tú', form: 'dices', english: 'you say/tell' },
            { pronoun: 'él/ella', form: 'dice', english: 'he/she says/tells' },
            { pronoun: 'nosotros', form: 'decimos', english: 'we say/tell' },
            { pronoun: 'vosotros', form: 'decís', english: 'you all say/tell' },
            { pronoun: 'ellos', form: 'dicen', english: 'they say/tell' }
          ]
        }
      },
      {
        title: 'DECIR vs HABLAR',
        content: 'DECIR introduces specific content; HABLAR is general speaking.',
        examples: [
          {
            spanish: 'Dice "hola". (specific content)',
            english: 'He says "hello".',
            highlight: ['Dice']
          },
          {
            spanish: 'Habla español. (general ability)',
            english: 'He speaks Spanish.',
            highlight: ['Habla']
          }
        ]
      }
    ]
  },
  {
    title: 'ESCUCHAR - Listening',
    content: 'The verb **"escuchar"** means to listen actively and attentively.',
    examples: [
      {
        spanish: 'Escucho música mientras trabajo.',
        english: 'I listen to music while I work.',
        highlight: ['Escucho']
      },
      {
        spanish: 'Escucha con atención.',
        english: 'Listen carefully.',
        highlight: ['Escucha']
      },
      {
        spanish: 'No me escuchan.',
        english: 'They don\'t listen to me.',
        highlight: ['escuchan']
      }
    ],
    subsections: [
      {
        title: 'ESCUCHAR vs OÍR',
        content: 'ESCUCHAR is active listening; OÍR is passive hearing.',
        conjugationTable: {
          title: 'ESCUCHAR vs OÍR',
          conjugations: [
            { pronoun: 'escuchar', form: 'escucho música', english: 'I listen to music (actively)' },
            { pronoun: 'oír', form: 'oigo ruido', english: 'I hear noise (passively)' },
            { pronoun: 'escuchar', form: 'escucho al profesor', english: 'I listen to the teacher' },
            { pronoun: 'oír', form: 'oigo voces', english: 'I hear voices' },
            { pronoun: 'escuchar', form: 'escucho con atención', english: 'I listen attentively' },
            { pronoun: 'oír', form: 'oigo por casualidad', english: 'I hear by chance' }
          ]
        }
      }
    ]
  },
  {
    title: 'PREGUNTAR - Asking Questions',
    content: 'The verb **"preguntar"** means to ask questions or inquire.',
    examples: [
      {
        spanish: 'Pregunto por la dirección.',
        english: 'I ask for directions.',
        highlight: ['Pregunto']
      },
      {
        spanish: 'Le pregunta su nombre.',
        english: 'He asks her name.',
        highlight: ['pregunta']
      },
      {
        spanish: 'Preguntaron por ti.',
        english: 'They asked about you.',
        highlight: ['Preguntaron']
      }
    ],
    subsections: [
      {
        title: 'PREGUNTAR Constructions',
        content: 'Different ways to use preguntar.',
        conjugationTable: {
          title: 'PREGUNTAR Usage Patterns',
          conjugations: [
            { pronoun: 'preguntar por', form: 'pregunto por María', english: 'ask about María' },
            { pronoun: 'preguntar a', form: 'pregunto a Juan', english: 'ask Juan' },
            { pronoun: 'preguntar sobre', form: 'pregunto sobre el tema', english: 'ask about the topic' },
            { pronoun: 'preguntar si', form: 'pregunto si viene', english: 'ask if he\'s coming' },
            { pronoun: 'preguntar qué', form: 'pregunto qué hora es', english: 'ask what time it is' },
            { pronoun: 'preguntar cómo', form: 'pregunto cómo llegar', english: 'ask how to get there' }
          ]
        }
      }
    ]
  },
  {
    title: 'RESPONDER/CONTESTAR - Answering',
    content: 'The verbs **"responder"** and **"contestar"** both mean to answer or respond.',
    examples: [
      {
        spanish: 'Respondo a todas las preguntas.',
        english: 'I answer all the questions.',
        highlight: ['Respondo']
      },
      {
        spanish: 'Contesta el teléfono.',
        english: 'Answer the phone.',
        highlight: ['Contesta']
      },
      {
        spanish: 'No respondió a mi email.',
        english: 'He didn\'t respond to my email.',
        highlight: ['respondió']
      }
    ],
    subsections: [
      {
        title: 'RESPONDER vs CONTESTAR',
        content: 'Both verbs mean "to answer" with slight differences.',
        conjugationTable: {
          title: 'RESPONDER vs CONTESTAR Usage',
          conjugations: [
            { pronoun: 'responder', form: 'respondo a la pregunta', english: 'answer the question (formal)' },
            { pronoun: 'contestar', form: 'contesto la pregunta', english: 'answer the question (direct)' },
            { pronoun: 'responder', form: 'respondo al email', english: 'respond to email' },
            { pronoun: 'contestar', form: 'contesto el teléfono', english: 'answer the phone' },
            { pronoun: 'responder', form: 'respondo por escrito', english: 'respond in writing' },
            { pronoun: 'contestar', form: 'contesto rápidamente', english: 'answer quickly' }
          ]
        }
      }
    ]
  },
  {
    title: 'EXPLICAR - Explaining',
    content: 'The verb **"explicar"** means to explain or clarify something.',
    examples: [
      {
        spanish: 'Explico la lección.',
        english: 'I explain the lesson.',
        highlight: ['Explico']
      },
      {
        spanish: 'Le explica cómo funciona.',
        english: 'He explains to her how it works.',
        highlight: ['explica']
      },
      {
        spanish: 'Explicaron el problema.',
        english: 'They explained the problem.',
        highlight: ['Explicaron']
      }
    ],
    subsections: [
      {
        title: 'EXPLICAR Constructions',
        content: 'Different ways to use explicar.',
        conjugationTable: {
          title: 'EXPLICAR Usage Patterns',
          conjugations: [
            { pronoun: 'explicar algo', form: 'explico la gramática', english: 'explain grammar' },
            { pronoun: 'explicar a alguien', form: 'le explico a Juan', english: 'explain to Juan' },
            { pronoun: 'explicar cómo', form: 'explico cómo hacerlo', english: 'explain how to do it' },
            { pronoun: 'explicar por qué', form: 'explico por qué es así', english: 'explain why it\'s like that' },
            { pronoun: 'explicar que', form: 'explico que es difícil', english: 'explain that it\'s difficult' },
            { pronoun: 'explicarse', form: 'me explico mal', english: 'I explain myself poorly' }
          ]
        }
      }
    ]
  },
  {
    title: 'CONTAR - Telling Stories/Counting',
    content: 'The verb **"contar"** means to tell (stories) or to count.',
    examples: [
      {
        spanish: 'Cuenta una historia interesante.',
        english: 'He tells an interesting story.',
        highlight: ['Cuenta']
      },
      {
        spanish: 'Cuento hasta diez.',
        english: 'I count to ten.',
        highlight: ['Cuento']
      },
      {
        spanish: 'Le contó lo que pasó.',
        english: 'She told him what happened.',
        highlight: ['contó']
      }
    ],
    subsections: [
      {
        title: 'CONTAR Usage Patterns',
        content: 'Different meanings and uses of contar.',
        conjugationTable: {
          title: 'CONTAR Meanings',
          conjugations: [
            { pronoun: 'Tell story', form: 'cuento un cuento', english: 'I tell a story' },
            { pronoun: 'Count numbers', form: 'cuento dinero', english: 'I count money' },
            { pronoun: 'Tell someone', form: 'le cuento a María', english: 'I tell María' },
            { pronoun: 'Rely on', form: 'cuento contigo', english: 'I count on you' },
            { pronoun: 'Include', form: 'no me cuentan', english: 'they don\'t include me' },
            { pronoun: 'Matter', form: 'eso no cuenta', english: 'that doesn\'t count' }
          ]
        }
      }
    ]
  },
  {
    title: 'Other Communication Verbs',
    content: 'Additional important verbs for communication.',
    examples: [
      {
        spanish: 'Grita muy fuerte.',
        english: 'He shouts very loudly.',
        highlight: ['Grita']
      },
      {
        spanish: 'Susurra al oído.',
        english: 'She whispers in his ear.',
        highlight: ['Susurra']
      },
      {
        spanish: 'Discuten sobre política.',
        english: 'They argue about politics.',
        highlight: ['Discuten']
      }
    ],
    subsections: [
      {
        title: 'Communication Verb Categories',
        content: 'Different types of communication verbs.',
        conjugationTable: {
          title: 'Communication Verb Types',
          conjugations: [
            { pronoun: 'Volume', form: 'gritar, susurrar, murmurar', english: 'shout, whisper, murmur' },
            { pronoun: 'Agreement', form: 'discutir, debatir, argumentar', english: 'discuss, debate, argue' },
            { pronoun: 'Information', form: 'informar, avisar, anunciar', english: 'inform, notify, announce' },
            { pronoun: 'Opinion', form: 'opinar, comentar, criticar', english: 'give opinion, comment, criticize' },
            { pronoun: 'Request', form: 'pedir, rogar, suplicar', english: 'ask for, beg, plead' },
            { pronoun: 'Promise', form: 'prometer, jurar, asegurar', english: 'promise, swear, assure' }
          ]
        }
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Conditional Tense', url: '/grammar/spanish/verbs/conditional', difficulty: 'intermediate' },
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' },
  { title: 'Modal Verbs', url: '/grammar/spanish/verbs/modal-verbs', difficulty: 'intermediate' },
  { title: 'Subjunctive Present', url: '/grammar/spanish/verbs/subjunctive-present', difficulty: 'advanced' }
];

export default function SpanishCommunicationVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Communication Verbs - Speaking, Listening, and Expression',
            description: 'Learn Spanish communication verbs including hablar, decir, escuchar, and other verbs for speaking, listening, and expressing ideas.',
            keywords: ['spanish communication verbs', 'speaking verbs', 'listening verbs', 'hablar', 'decir', 'escuchar'],
            language: 'spanish',
            category: 'verbs',
            topic: 'communication-verbs'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="communication-verbs"
        title="Spanish Communication Verbs"
        description="Learn Spanish communication verbs including hablar, decir, escuchar, and other verbs for speaking, listening, and expressing ideas."
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/communication-verbs/practice"
        quizUrl="/grammar/spanish/verbs/communication-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=communication-verbs"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
