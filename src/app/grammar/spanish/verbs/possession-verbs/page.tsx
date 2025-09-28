import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'possession-verbs',
  title: 'Spanish Possession Verbs - Having, Owning, and Belonging',
  description: 'Learn Spanish possession verbs including tener, poseer, pertenecer, and other verbs expressing ownership, possession, and belonging.',
  difficulty: 'intermediate',
  keywords: ['spanish possession verbs', 'ownership verbs', 'tener', 'poseer', 'pertenecer', 'belonging verbs', 'having verbs'],
  examples: ['Tengo un coche', 'Posee una casa', 'Pertenece a la familia', 'Es mío']
});

const sections = [
  {
    title: 'Understanding Possession Verbs',
    content: 'Possession verbs express **ownership**, **having**, **belonging**, and **possession** relationships between people and objects or concepts.',
    examples: [
      {
        spanish: 'Tengo tres hermanos.',
        english: 'I have three brothers.',
        highlight: ['Tengo']
      },
      {
        spanish: 'Esta casa pertenece a mi familia.',
        english: 'This house belongs to my family.',
        highlight: ['pertenece']
      },
      {
        spanish: 'Posee muchas propiedades.',
        english: 'He owns many properties.',
        highlight: ['Posee']
      }
    ]
  },
  {
    title: 'TENER - Having/Possessing',
    content: 'The verb **"tener"** is the most common way to express possession and having in Spanish.',
    examples: [
      {
        spanish: 'Tengo un perro muy cariñoso.',
        english: 'I have a very affectionate dog.',
        highlight: ['Tengo']
      },
      {
        spanish: 'Tiene mucho dinero.',
        english: 'He has a lot of money.',
        highlight: ['Tiene']
      },
      {
        spanish: 'Tenemos una casa en la playa.',
        english: 'We have a house at the beach.',
        highlight: ['Tenemos']
      }
    ],
    subsections: [
      {
        title: 'TENER Conjugation',
        content: 'TENER is irregular and very commonly used.',
        conjugationTable: {
          title: 'TENER Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'tengo', english: 'I have' },
            { pronoun: 'tú', form: 'tienes', english: 'you have' },
            { pronoun: 'él/ella', form: 'tiene', english: 'he/she has' },
            { pronoun: 'nosotros', form: 'tenemos', english: 'we have' },
            { pronoun: 'vosotros', form: 'tenéis', english: 'you all have' },
            { pronoun: 'ellos', form: 'tienen', english: 'they have' }
          ]
        }
      },
      {
        title: 'TENER Expressions',
        content: 'TENER is used in many idiomatic expressions.',
        examples: [
          {
            spanish: 'Tengo hambre.',
            english: 'I\'m hungry. (I have hunger)',
            highlight: ['Tengo hambre']
          },
          {
            spanish: 'Tiene 25 años.',
            english: 'He\'s 25 years old. (He has 25 years)',
            highlight: ['Tiene 25 años']
          },
          {
            spanish: 'Tenemos prisa.',
            english: 'We\'re in a hurry. (We have haste)',
            highlight: ['Tenemos prisa']
          }
        ]
      }
    ]
  },
  {
    title: 'POSEER - Owning/Possessing',
    content: 'The verb **"poseer"** means "to possess" or "to own" and is more formal than tener.',
    examples: [
      {
        spanish: 'Posee una gran fortuna.',
        english: 'He possesses a great fortune.',
        highlight: ['Posee']
      },
      {
        spanish: 'Poseemos varios terrenos.',
        english: 'We own several plots of land.',
        highlight: ['Poseemos']
      },
      {
        spanish: 'No poseo ningún título universitario.',
        english: 'I don\'t possess any university degree.',
        highlight: ['poseo']
      }
    ],
    subsections: [
      {
        title: 'POSEER vs TENER',
        content: 'POSEER is more formal and implies legal ownership.',
        conjugationTable: {
          title: 'POSEER vs TENER Usage',
          conjugations: [
            { pronoun: 'Formal ownership', form: 'posee una empresa', english: 'owns a company' },
            { pronoun: 'General having', form: 'tiene una empresa', english: 'has a company' },
            { pronoun: 'Legal possession', form: 'posee los derechos', english: 'possesses the rights' },
            { pronoun: 'Temporary having', form: 'tiene los documentos', english: 'has the documents' },
            { pronoun: 'Wealth/Property', form: 'posee propiedades', english: 'owns properties' },
            { pronoun: 'Personal items', form: 'tiene un coche', english: 'has a car' }
          ]
        }
      }
    ]
  },
  {
    title: 'PERTENECER - Belonging',
    content: 'The verb **"pertenecer"** means "to belong to" and expresses membership or ownership relationships.',
    examples: [
      {
        spanish: 'Este libro pertenece a la biblioteca.',
        english: 'This book belongs to the library.',
        highlight: ['pertenece']
      },
      {
        spanish: 'Pertenezco a un club de lectura.',
        english: 'I belong to a book club.',
        highlight: ['Pertenezco']
      },
      {
        spanish: 'Estas joyas pertenecían a mi abuela.',
        english: 'These jewels belonged to my grandmother.',
        highlight: ['pertenecían']
      }
    ],
    subsections: [
      {
        title: 'PERTENECER Conjugation',
        content: 'PERTENECER is irregular in the first person singular.',
        conjugationTable: {
          title: 'PERTENECER Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'pertenezco', english: 'I belong' },
            { pronoun: 'tú', form: 'perteneces', english: 'you belong' },
            { pronoun: 'él/ella', form: 'pertenece', english: 'he/she belongs' },
            { pronoun: 'nosotros', form: 'pertenecemos', english: 'we belong' },
            { pronoun: 'vosotros', form: 'pertenecéis', english: 'you all belong' },
            { pronoun: 'ellos', form: 'pertenecen', english: 'they belong' }
          ]
        }
      },
      {
        title: 'PERTENECER A Usage',
        content: 'PERTENECER always requires the preposition "a".',
        examples: [
          {
            spanish: 'Pertenece a una familia rica.',
            english: 'He belongs to a rich family.',
            highlight: ['Pertenece a']
          },
          {
            spanish: 'Esta tradición pertenece a nuestra cultura.',
            english: 'This tradition belongs to our culture.',
            highlight: ['pertenece a']
          }
        ]
      }
    ]
  },
  {
    title: 'SER DE - Being From/Belonging To',
    content: 'The construction **"ser de"** expresses ownership, origin, or material composition.',
    examples: [
      {
        spanish: 'Este coche es de mi padre.',
        english: 'This car is my father\'s.',
        highlight: ['es de']
      },
      {
        spanish: 'Soy de España.',
        english: 'I\'m from Spain.',
        highlight: ['Soy de']
      },
      {
        spanish: 'La mesa es de madera.',
        english: 'The table is made of wood.',
        highlight: ['es de']
      }
    ],
    subsections: [
      {
        title: 'SER DE Usage Patterns',
        content: 'Different meanings of ser de.',
        conjugationTable: {
          title: 'SER DE Meanings',
          conjugations: [
            { pronoun: 'Ownership', form: 'es de María', english: 'it\'s María\'s' },
            { pronoun: 'Origin', form: 'es de México', english: 'he\'s from Mexico' },
            { pronoun: 'Material', form: 'es de oro', english: 'it\'s made of gold' },
            { pronoun: 'Characteristic', form: 'es de buena calidad', english: 'it\'s good quality' },
            { pronoun: 'Time', form: 'es de noche', english: 'it\'s nighttime' },
            { pronoun: 'Type', form: 'es de terror', english: 'it\'s a horror (movie)' }
          ]
        }
      }
    ]
  },
  {
    title: 'CONTAR CON - Having/Counting On',
    content: 'The expression **"contar con"** means "to have" (available) or "to count on" someone or something.',
    examples: [
      {
        spanish: 'Contamos con tu apoyo.',
        english: 'We count on your support.',
        highlight: ['Contamos con']
      },
      {
        spanish: 'Cuenta con mucha experiencia.',
        english: 'He has a lot of experience.',
        highlight: ['Cuenta con']
      },
      {
        spanish: 'No contaba con ese problema.',
        english: 'I wasn\'t counting on that problem.',
        highlight: ['contaba con']
      }
    ],
    subsections: [
      {
        title: 'CONTAR CON vs TENER',
        content: 'CONTAR CON implies availability or reliability.',
        conjugationTable: {
          title: 'CONTAR CON vs TENER',
          conjugations: [
            { pronoun: 'Available resources', form: 'cuenta con dinero', english: 'has money (available)' },
            { pronoun: 'General possession', form: 'tiene dinero', english: 'has money' },
            { pronoun: 'Reliable support', form: 'cuenta con amigos', english: 'has friends (to count on)' },
            { pronoun: 'General having', form: 'tiene amigos', english: 'has friends' },
            { pronoun: 'Expected help', form: 'cuenta con ayuda', english: 'has help (expected)' },
            { pronoun: 'Received help', form: 'tiene ayuda', english: 'has help' }
          ]
        }
      }
    ]
  },
  {
    title: 'DISPONER DE - Having Available',
    content: 'The expression **"disponer de"** means "to have available" or "to have at one\'s disposal."',
    examples: [
      {
        spanish: 'Disponemos de poco tiempo.',
        english: 'We have little time available.',
        highlight: ['Disponemos de']
      },
      {
        spanish: 'Dispone de todos los recursos necesarios.',
        english: 'He has all the necessary resources available.',
        highlight: ['Dispone de']
      },
      {
        spanish: 'No dispongo de esa información.',
        english: 'I don\'t have that information available.',
        highlight: ['dispongo de']
      }
    ],
    subsections: [
      {
        title: 'DISPONER DE Usage',
        content: 'Used for resources, time, or things at one\'s disposal.',
        conjugationTable: {
          title: 'DISPONER DE Patterns',
          conjugations: [
            { pronoun: 'Time', form: 'dispone de tiempo', english: 'has time available' },
            { pronoun: 'Resources', form: 'dispone de dinero', english: 'has money available' },
            { pronoun: 'Space', form: 'dispone de espacio', english: 'has space available' },
            { pronoun: 'Information', form: 'dispone de datos', english: 'has data available' },
            { pronoun: 'Equipment', form: 'dispone de herramientas', english: 'has tools available' },
            { pronoun: 'Personnel', form: 'dispone de personal', english: 'has staff available' }
          ]
        }
      }
    ]
  },
  {
    title: 'CARECER DE - Lacking/Not Having',
    content: 'The verb **"carecer de"** means "to lack" or "to be without" something.',
    examples: [
      {
        spanish: 'Carece de experiencia.',
        english: 'He lacks experience.',
        highlight: ['Carece de']
      },
      {
        spanish: 'Carecemos de información suficiente.',
        english: 'We lack sufficient information.',
        highlight: ['Carecemos de']
      },
      {
        spanish: 'El proyecto carece de financiación.',
        english: 'The project lacks funding.',
        highlight: ['carece de']
      }
    ],
    subsections: [
      {
        title: 'CARECER DE vs NO TENER',
        content: 'CARECER DE is more formal than NO TENER.',
        conjugationTable: {
          title: 'CARECER DE vs NO TENER',
          conjugations: [
            { pronoun: 'Formal lack', form: 'carece de recursos', english: 'lacks resources' },
            { pronoun: 'Simple negation', form: 'no tiene recursos', english: 'doesn\'t have resources' },
            { pronoun: 'Professional context', form: 'carece de experiencia', english: 'lacks experience' },
            { pronoun: 'Casual context', form: 'no tiene experiencia', english: 'doesn\'t have experience' },
            { pronoun: 'Academic writing', form: 'carece de fundamento', english: 'lacks foundation' },
            { pronoun: 'Everyday speech', form: 'no tiene sentido', english: 'doesn\'t make sense' }
          ]
        }
      }
    ]
  },
  {
    title: 'Possessive Pronouns and Adjectives',
    content: 'Spanish uses **possessive adjectives** and **pronouns** to express ownership without verbs.',
    examples: [
      {
        spanish: 'Es mi libro.',
        english: 'It\'s my book.',
        highlight: ['mi']
      },
      {
        spanish: 'El coche es mío.',
        english: 'The car is mine.',
        highlight: ['mío']
      },
      {
        spanish: 'Nuestra casa es grande.',
        english: 'Our house is big.',
        highlight: ['Nuestra']
      }
    ],
    subsections: [
      {
        title: 'Possessive Adjectives vs Pronouns',
        content: 'Adjectives modify nouns; pronouns replace them.',
        conjugationTable: {
          title: 'Possessive Forms',
          conjugations: [
            { pronoun: 'Adjective', form: 'mi casa', english: 'my house' },
            { pronoun: 'Pronoun', form: 'la casa es mía', english: 'the house is mine' },
            { pronoun: 'Adjective', form: 'tu coche', english: 'your car' },
            { pronoun: 'Pronoun', form: 'el coche es tuyo', english: 'the car is yours' },
            { pronoun: 'Adjective', form: 'nuestro perro', english: 'our dog' },
            { pronoun: 'Pronoun', form: 'el perro es nuestro', english: 'the dog is ours' }
          ]
        }
      },
      {
        title: 'Possession with Articles',
        content: 'Using definite articles with possessive pronouns.',
        examples: [
          {
            spanish: 'El mío es más grande.',
            english: 'Mine is bigger.',
            highlight: ['El mío']
          },
          {
            spanish: 'La tuya está en la mesa.',
            english: 'Yours is on the table.',
            highlight: ['La tuya']
          }
        ]
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Gerunds', url: '/grammar/spanish/verbs/gerunds', difficulty: 'intermediate' },
  { title: 'Reflexive Verbs', url: '/grammar/spanish/verbs/reflexive', difficulty: 'intermediate' },
  { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect', difficulty: 'intermediate' },
  { title: 'Subjunctive Imperfect', url: '/grammar/spanish/verbs/subjunctive-imperfect', difficulty: 'advanced' }
];

export default function SpanishPossessionVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Possession Verbs - Having, Owning, and Belonging',
            description: 'Learn Spanish possession verbs including tener, poseer, pertenecer, and other verbs expressing ownership, possession, and belonging.',
            keywords: ['spanish possession verbs', 'ownership verbs', 'tener', 'poseer', 'pertenecer', 'belonging verbs'],
            language: 'spanish',
            category: 'verbs',
            topic: 'possession-verbs'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="possession-verbs"
        title="Spanish Possession Verbs"
        description="Learn Spanish possession verbs including tener, poseer, pertenecer, and other verbs expressing ownership, possession, and belonging."
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/possession-verbs/practice"
        quizUrl="/grammar/spanish/verbs/possession-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=possession-verbs"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
