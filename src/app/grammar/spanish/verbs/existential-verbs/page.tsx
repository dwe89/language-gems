import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'existential-verbs',
  title: 'Spanish Existential Verbs - HAY, SER, ESTAR, and Existence',
  description: 'Learn Spanish existential verbs including hay, ser, estar, and other verbs expressing existence, presence, and location.',
  difficulty: 'intermediate',
  keywords: ['spanish existential verbs', 'hay', 'ser', 'estar', 'existence', 'presence', 'location', 'there is', 'there are'],
  examples: ['Hay muchos libros', 'Existe una solución', 'Se encuentra aquí', 'Está presente']
});

const sections = [
  {
    title: 'Understanding Existential Verbs',
    content: 'Existential verbs express **existence**, **presence**, or **location** of entities. Spanish has several ways to express existence, with "hay" being the most common.',
    examples: [
      {
        spanish: 'Hay muchos estudiantes en la clase.',
        english: 'There are many students in the class.',
        highlight: ['Hay']
      },
      {
        spanish: 'Existe una solución al problema.',
        english: 'A solution to the problem exists.',
        highlight: ['Existe']
      },
      {
        spanish: 'Se encuentra un tesoro aquí.',
        english: 'A treasure is found here.',
        highlight: ['Se encuentra']
      }
    ]
  },
  {
    title: 'HAY - The Primary Existential Verb',
    content: 'The verb **"hay"** (there is/there are) is the most common way to express existence in Spanish. It\'s invariable and used for both singular and plural.',
    examples: [
      {
        spanish: 'Hay un gato en el jardín.',
        english: 'There is a cat in the garden.',
        highlight: ['Hay']
      },
      {
        spanish: 'Hay muchas flores en primavera.',
        english: 'There are many flowers in spring.',
        highlight: ['Hay']
      },
      {
        spanish: 'No hay tiempo para descansar.',
        english: 'There\'s no time to rest.',
        highlight: ['No hay']
      }
    ],
    subsections: [
      {
        title: 'HAY in Different Tenses',
        content: 'HAY conjugated in various tenses.',
        conjugationTable: {
          title: 'HAY Conjugation',
          conjugations: [
            { pronoun: 'Present', form: 'hay', english: 'there is/are' },
            { pronoun: 'Preterite', form: 'hubo', english: 'there was/were' },
            { pronoun: 'Imperfect', form: 'había', english: 'there was/were (ongoing)' },
            { pronoun: 'Future', form: 'habrá', english: 'there will be' },
            { pronoun: 'Conditional', form: 'habría', english: 'there would be' },
            { pronoun: 'Present Perfect', form: 'ha habido', english: 'there has/have been' }
          ]
        }
      },
      {
        title: 'HAY vs ESTAR',
        content: 'HAY introduces new information; ESTAR locates known entities.',
        examples: [
          {
            spanish: 'Hay un libro en la mesa. (introducing)',
            english: 'There\'s a book on the table.',
            highlight: ['Hay']
          },
          {
            spanish: 'El libro está en la mesa. (locating)',
            english: 'The book is on the table.',
            highlight: ['está']
          }
        ]
      }
    ]
  },
  {
    title: 'EXISTIR - Formal Existence',
    content: 'The verb **"existir"** expresses existence in a more formal or philosophical sense.',
    examples: [
      {
        spanish: 'Existen muchas teorías sobre el tema.',
        english: 'Many theories exist on the subject.',
        highlight: ['Existen']
      },
      {
        spanish: 'No existe una respuesta fácil.',
        english: 'An easy answer doesn\'t exist.',
        highlight: ['No existe']
      },
      {
        spanish: 'Existía una vez un rey sabio.',
        english: 'There once existed a wise king.',
        highlight: ['Existía']
      }
    ],
    subsections: [
      {
        title: 'EXISTIR Conjugation',
        content: 'EXISTIR conjugated in different tenses.',
        conjugationTable: {
          title: 'EXISTIR Conjugation',
          conjugations: [
            { pronoun: 'yo', form: 'existo', english: 'I exist' },
            { pronoun: 'tú', form: 'existes', english: 'you exist' },
            { pronoun: 'él/ella', form: 'existe', english: 'he/she/it exists' },
            { pronoun: 'nosotros', form: 'existimos', english: 'we exist' },
            { pronoun: 'vosotros', form: 'existís', english: 'you all exist' },
            { pronoun: 'ellos', form: 'existen', english: 'they exist' }
          ]
        }
      },
      {
        title: 'EXISTIR vs HAY',
        content: 'EXISTIR is more formal and philosophical than HAY.',
        examples: [
          {
            spanish: 'Hay fantasmas en la casa. (colloquial)',
            english: 'There are ghosts in the house.',
            highlight: ['Hay']
          },
          {
            spanish: 'Existen los fantasmas? (philosophical)',
            english: 'Do ghosts exist?',
            highlight: ['Existen']
          }
        ]
      }
    ]
  },
  {
    title: 'ENCONTRARSE - Reflexive Existence',
    content: 'The reflexive verb **"encontrarse"** expresses location or presence, often with a sense of discovery.',
    examples: [
      {
        spanish: 'Se encuentra un tesoro en la cueva.',
        english: 'A treasure is found in the cave.',
        highlight: ['Se encuentra']
      },
      {
        spanish: 'Se encuentran muchos turistas aquí.',
        english: 'Many tourists are found here.',
        highlight: ['Se encuentran']
      },
      {
        spanish: 'No se encuentra ninguna evidencia.',
        english: 'No evidence is found.',
        highlight: ['No se encuentra']
      }
    ],
    subsections: [
      {
        title: 'ENCONTRARSE Patterns',
        content: 'Different uses of encontrarse for existence.',
        conjugationTable: {
          title: 'ENCONTRARSE Existential Uses',
          conjugations: [
            { pronoun: 'Location', form: 'se encuentra en Madrid', english: 'is located in Madrid' },
            { pronoun: 'Discovery', form: 'se encuentra oro aquí', english: 'gold is found here' },
            { pronoun: 'Presence', form: 'se encuentran estudiantes', english: 'students are present' },
            { pronoun: 'State', form: 'se encuentra bien', english: 'is doing well' },
            { pronoun: 'Meeting', form: 'se encuentran a menudo', english: 'they meet often' },
            { pronoun: 'Availability', form: 'se encuentra disponible', english: 'is available' }
          ]
        }
      }
    ]
  },
  {
    title: 'HALLARSE - Literary Existence',
    content: 'The verb **"hallarse"** is a more literary or formal way to express location or existence.',
    examples: [
      {
        spanish: 'Se halla una biblioteca en el centro.',
        english: 'A library is located in the center.',
        highlight: ['Se halla']
      },
      {
        spanish: 'El documento se halla en el archivo.',
        english: 'The document is located in the archive.',
        highlight: ['se halla']
      },
      {
        spanish: 'Se hallan restos arqueológicos aquí.',
        english: 'Archaeological remains are found here.',
        highlight: ['Se hallan']
      }
    ],
    subsections: [
      {
        title: 'HALLARSE vs ENCONTRARSE',
        content: 'HALLARSE is more formal and literary than ENCONTRARSE.',
        conjugationTable: {
          title: 'HALLARSE Usage',
          conjugations: [
            { pronoun: 'Formal location', form: 'se halla situado', english: 'is situated' },
            { pronoun: 'Literary discovery', form: 'se hallan vestigios', english: 'vestiges are found' },
            { pronoun: 'Official presence', form: 'se halla presente', english: 'is present (formal)' },
            { pronoun: 'Academic context', form: 'se halla documentado', english: 'is documented' },
            { pronoun: 'Legal context', form: 'se halla establecido', english: 'is established' },
            { pronoun: 'Historical context', form: 'se hallaba en ruinas', english: 'was in ruins' }
          ]
        }
      }
    ]
  },
  {
    title: 'QUEDAR - Remaining Existence',
    content: 'The verb **"quedar"** expresses what remains or is left.',
    examples: [
      {
        spanish: 'Quedan tres días para el examen.',
        english: 'Three days remain until the exam.',
        highlight: ['Quedan']
      },
      {
        spanish: 'No queda dinero en la cuenta.',
        english: 'No money is left in the account.',
        highlight: ['No queda']
      },
      {
        spanish: 'Queda mucho trabajo por hacer.',
        english: 'Much work remains to be done.',
        highlight: ['Queda']
      }
    ],
    subsections: [
      {
        title: 'QUEDAR Existential Patterns',
        content: 'Different uses of quedar for remaining existence.',
        conjugationTable: {
          title: 'QUEDAR Existential Uses',
          conjugations: [
            { pronoun: 'Remaining quantity', form: 'quedan dos manzanas', english: 'two apples remain' },
            { pronoun: 'Remaining time', form: 'quedan cinco minutos', english: 'five minutes remain' },
            { pronoun: 'Remaining space', form: 'queda sitio aquí', english: 'space remains here' },
            { pronoun: 'Remaining work', form: 'queda mucho por hacer', english: 'much remains to be done' },
            { pronoun: 'Nothing left', form: 'no queda nada', english: 'nothing remains' },
            { pronoun: 'Everything left', form: 'queda todo', english: 'everything remains' }
          ]
        }
      }
    ]
  },
  {
    title: 'SOBRAR - Excess Existence',
    content: 'The verb **"sobrar"** expresses excess or surplus existence.',
    examples: [
      {
        spanish: 'Sobra comida en la nevera.',
        english: 'There\'s leftover food in the fridge.',
        highlight: ['Sobra']
      },
      {
        spanish: 'Sobran razones para estar feliz.',
        english: 'There are plenty of reasons to be happy.',
        highlight: ['Sobran']
      },
      {
        spanish: 'No sobra tiempo para descansar.',
        english: 'There\'s no extra time to rest.',
        highlight: ['No sobra']
      }
    ],
    subsections: [
      {
        title: 'SOBRAR vs QUEDAR',
        content: 'SOBRAR implies excess; QUEDAR implies remainder.',
        conjugationTable: {
          title: 'SOBRAR Usage Patterns',
          conjugations: [
            { pronoun: 'Excess food', form: 'sobra comida', english: 'food is left over' },
            { pronoun: 'Excess time', form: 'sobra tiempo', english: 'time is abundant' },
            { pronoun: 'Excess money', form: 'sobra dinero', english: 'money is abundant' },
            { pronoun: 'Excess people', form: 'sobra gente', english: 'there are too many people' },
            { pronoun: 'Excess reasons', form: 'sobran motivos', english: 'there are plenty of reasons' },
            { pronoun: 'Nothing excess', form: 'no sobra nada', english: 'nothing is left over' }
          ]
        }
      }
    ]
  },
  {
    title: 'FALTAR - Lacking Existence',
    content: 'The verb **"faltar"** expresses absence or lack of existence.',
    examples: [
      {
        spanish: 'Falta sal en la comida.',
        english: 'The food lacks salt.',
        highlight: ['Falta']
      },
      {
        spanish: 'Faltan cinco estudiantes.',
        english: 'Five students are missing.',
        highlight: ['Faltan']
      },
      {
        spanish: 'No falta nada aquí.',
        english: 'Nothing is missing here.',
        highlight: ['No falta']
      }
    ],
    subsections: [
      {
        title: 'FALTAR Usage Patterns',
        content: 'Different ways to express lack or absence.',
        conjugationTable: {
          title: 'FALTAR Existential Uses',
          conjugations: [
            { pronoun: 'Missing items', form: 'faltan libros', english: 'books are missing' },
            { pronoun: 'Missing time', form: 'falta tiempo', english: 'time is lacking' },
            { pronoun: 'Missing people', form: 'falta María', english: 'María is missing' },
            { pronoun: 'Missing ingredients', form: 'falta azúcar', english: 'sugar is missing' },
            { pronoun: 'Time remaining', form: 'faltan dos horas', english: 'two hours remain' },
            { pronoun: 'Distance remaining', form: 'faltan 5 km', english: '5 km remain' }
          ]
        }
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Por vs Para', url: '/grammar/spanish/verbs/por-vs-para', difficulty: 'intermediate' },
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future', difficulty: 'intermediate' },
  { title: 'Present Perfect', url: '/grammar/spanish/verbs/present-perfect', difficulty: 'intermediate' },
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' }
];

export default function SpanishExistentialVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Existential Verbs - HAY, SER, ESTAR, and Existence',
            description: 'Learn Spanish existential verbs including hay, ser, estar, and other verbs expressing existence, presence, and location.',
            keywords: ['spanish existential verbs', 'hay', 'ser', 'estar', 'existence', 'presence', 'location'],
            language: 'spanish',
            category: 'verbs',
            topic: 'existential-verbs'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="existential-verbs"
        title="Spanish Existential Verbs"
        description="Learn Spanish existential verbs including hay, ser, estar, and other verbs expressing existence, presence, and location."
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/existential-verbs/practice"
        quizUrl="/grammar/spanish/verbs/existential-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=existential-verbs"
        youtubeVideoId="existential-verbs-spanish"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
