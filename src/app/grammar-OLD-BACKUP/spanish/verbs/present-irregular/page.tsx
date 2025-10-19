import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';

export const metadata: Metadata = {
  title: 'Spanish Present Tense Irregular Verbs - Language Gems',
  description: 'Master Spanish irregular verbs in the present tense. Learn ser, estar, tener, hacer, ir, poder, querer, saber, and other essential irregular verbs with complete conjugation tables.',
  keywords: 'Spanish irregular verbs, present tense irregular, ser estar tener, hacer ir poder querer, Spanish grammar, irregular verb conjugation',
};

export default function SpanishPresentIrregularPage() {
  const sections = [
    {
      title: 'Overview',
      content: 'Irregular verbs in Spanish do not follow the standard conjugation patterns of regular -AR, -ER, and -IR verbs. Instead, they have unique conjugation patterns that must be memorized. However, the most common irregular verbs are used frequently in everyday Spanish, making them essential to learn. These verbs often have stem changes (e-ie, o-ue, e-i) or completely irregular forms.'
    },
    {
      title: 'The Most Essential Irregular Verbs',
      content: 'These five verbs are among the most frequently used in Spanish and should be learned first:',
      subsections: [
        {
          title: 'SER (to be - permanent/identity)',
          content: 'Ser is used to describe permanent characteristics, identity, profession, nationality, and time. It is one of the most important verbs in Spanish.',
          conjugationTable: {
            title: 'Ser - Present Tense',
            conjugations: [
              { pronoun: 'yo', form: 'soy', english: 'I am' },
              { pronoun: 'tú', form: 'eres', english: 'you are' },
              { pronoun: 'él/ella/usted', form: 'es', english: 'he/she/you (formal) is' },
              { pronoun: 'nosotros/as', form: 'somos', english: 'we are' },
              { pronoun: 'vosotros/as', form: 'sois', english: 'you all are (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'son', english: 'they/you all are' }
            ]
          },
          examples: [
            {
              spanish: 'Yo soy ingeniero y soy de México.',
              english: 'I am an engineer and I am from Mexico.',
              highlight: ['soy', 'soy']
            },
            {
              spanish: 'Ella es doctora y es muy inteligente.',
              english: 'She is a doctor and she is very intelligent.',
              highlight: ['es', 'es']
            },
            {
              spanish: 'Nosotros somos amigos desde hace diez años.',
              english: 'We have been friends for ten years.',
              highlight: ['somos']
            }
          ]
        },
        {
          title: 'ESTAR (to be - location/condition)',
          content: 'Estar is used to describe location, temporary conditions, and feelings. Unlike ser, estar describes where someone/something is or how they feel at a particular moment.',
          conjugationTable: {
            title: 'Estar - Present Tense',
            conjugations: [
              { pronoun: 'yo', form: 'estoy', english: 'I am' },
              { pronoun: 'tú', form: 'estás', english: 'you are' },
              { pronoun: 'él/ella/usted', form: 'está', english: 'he/she/you (formal) is' },
              { pronoun: 'nosotros/as', form: 'estamos', english: 'we are' },
              { pronoun: 'vosotros/as', form: 'estáis', english: 'you all are (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'están', english: 'they/you all are' }
            ]
          },
          examples: [
            {
              spanish: 'Yo estoy en la biblioteca estudiando.',
              english: 'I am in the library studying.',
              highlight: ['estoy']
            },
            {
              spanish: '¿Dónde estás? Estoy en casa.',
              english: 'Where are you? I am at home.',
              highlight: ['estás', 'Estoy']
            },
            {
              spanish: 'Ellos están cansados después del trabajo.',
              english: 'They are tired after work.',
              highlight: ['están']
            }
          ]
        },
        {
          title: 'TENER (to have)',
          content: 'Tener is used to express possession and is also used in many idiomatic expressions (tener hambre = to be hungry, tener miedo = to be afraid, tener años = to be years old).',
          conjugationTable: {
            title: 'Tener - Present Tense (e→ie stem change)',
            conjugations: [
              { pronoun: 'yo', form: 'tengo', english: 'I have' },
              { pronoun: 'tú', form: 'tienes', english: 'you have' },
              { pronoun: 'él/ella/usted', form: 'tiene', english: 'he/she/you (formal) has' },
              { pronoun: 'nosotros/as', form: 'tenemos', english: 'we have' },
              { pronoun: 'vosotros/as', form: 'tenéis', english: 'you all have (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'tienen', english: 'they/you all have' }
            ]
          },
          examples: [
            {
              spanish: 'Yo tengo un gato y dos perros.',
              english: 'I have a cat and two dogs.',
              highlight: ['tengo']
            },
            {
              spanish: 'Ella tiene veinte años y tiene mucho talento.',
              english: 'She is twenty years old and has a lot of talent.',
              highlight: ['tiene', 'tiene']
            },
            {
              spanish: 'Nosotros tenemos hambre. ¿Tienen ustedes sed?',
              english: 'We are hungry. Are you all thirsty?',
              highlight: ['tenemos', 'Tienen']
            }
          ]
        },
        {
          title: 'HACER (to do/make)',
          content: 'Hacer is one of the most versatile verbs in Spanish, used to express actions, to make things, and in many idiomatic expressions (hacer calor = to be hot, hacer falta = to be necessary).',
          conjugationTable: {
            title: 'Hacer - Present Tense',
            conjugations: [
              { pronoun: 'yo', form: 'hago', english: 'I do/make' },
              { pronoun: 'tú', form: 'haces', english: 'you do/make' },
              { pronoun: 'él/ella/usted', form: 'hace', english: 'he/she/you (formal) does/makes' },
              { pronoun: 'nosotros/as', form: 'hacemos', english: 'we do/make' },
              { pronoun: 'vosotros/as', form: 'hacéis', english: 'you all do/make (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'hacen', english: 'they/you all do/make' }
            ]
          },
          examples: [
            {
              spanish: 'Yo hago la tarea cada noche.',
              english: 'I do homework every night.',
              highlight: ['hago']
            },
            {
              spanish: 'Ella hace un pastel delicioso para la fiesta.',
              english: 'She makes a delicious cake for the party.',
              highlight: ['hace']
            },
            {
              spanish: 'Hace mucho calor hoy. ¿Qué hacen ustedes?',
              english: 'It is very hot today. What are you all doing?',
              highlight: ['Hace', 'hacen']
            }
          ]
        },
        {
          title: 'IR (to go)',
          content: 'Ir is completely irregular and is used to express movement or direction. It is also used with the infinitive to form the near future (ir + a + infinitive).',
          conjugationTable: {
            title: 'Ir - Present Tense',
            conjugations: [
              { pronoun: 'yo', form: 'voy', english: 'I go' },
              { pronoun: 'tú', form: 'vas', english: 'you go' },
              { pronoun: 'él/ella/usted', form: 'va', english: 'he/she/you (formal) goes' },
              { pronoun: 'nosotros/as', form: 'vamos', english: 'we go' },
              { pronoun: 'vosotros/as', form: 'vais', english: 'you all go (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'van', english: 'they/you all go' }
            ]
          },
          examples: [
            {
              spanish: 'Yo voy al cine el viernes.',
              english: 'I go to the cinema on Friday.',
              highlight: ['voy']
            },
            {
              spanish: 'Ella va a la playa con sus amigos.',
              english: 'She goes to the beach with her friends.',
              highlight: ['va']
            },
            {
              spanish: 'Nosotros vamos a estudiar mañana.',
              english: 'We are going to study tomorrow.',
              highlight: ['vamos']
            }
          ]
        }
      ]
    },
    {
      title: 'Other Common Irregular Verbs',
      content: 'These verbs are also frequently used and have irregular conjugations:',
      subsections: [
        {
          title: 'PODER (can/to be able to) - o→ue stem change',
          conjugationTable: {
            title: 'Poder - Present Tense',
            conjugations: [
              { pronoun: 'yo', form: 'puedo', english: 'I can' },
              { pronoun: 'tú', form: 'puedes', english: 'you can' },
              { pronoun: 'él/ella/usted', form: 'puede', english: 'he/she/you (formal) can' },
              { pronoun: 'nosotros/as', form: 'podemos', english: 'we can' },
              { pronoun: 'vosotros/as', form: 'podéis', english: 'you all can (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'pueden', english: 'they/you all can' }
            ]
          }
        },
        {
          title: 'QUERER (to want) - e→ie stem change',
          conjugationTable: {
            title: 'Querer - Present Tense',
            conjugations: [
              { pronoun: 'yo', form: 'quiero', english: 'I want' },
              { pronoun: 'tú', form: 'quieres', english: 'you want' },
              { pronoun: 'él/ella/usted', form: 'quiere', english: 'he/she/you (formal) wants' },
              { pronoun: 'nosotros/as', form: 'queremos', english: 'we want' },
              { pronoun: 'vosotros/as', form: 'queréis', english: 'you all want (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'quieren', english: 'they/you all want' }
            ]
          }
        },
        {
          title: 'SABER (to know) - irregular yo form',
          conjugationTable: {
            title: 'Saber - Present Tense',
            conjugations: [
              { pronoun: 'yo', form: 'sé', english: 'I know' },
              { pronoun: 'tú', form: 'sabes', english: 'you know' },
              { pronoun: 'él/ella/usted', form: 'sabe', english: 'he/she/you (formal) knows' },
              { pronoun: 'nosotros/as', form: 'sabemos', english: 'we know' },
              { pronoun: 'vosotros/as', form: 'sabéis', english: 'you all know (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'saben', english: 'they/you all know' }
            ]
          }
        }
      ]
    },
    {
      title: 'Ser vs. Estar - Key Differences',
      content: 'SER is used for:\n• Identity and profession: Yo soy ingeniero (I am an engineer)\n• Nationality: Ella es mexicana (She is Mexican)\n• Permanent characteristics: El cielo es azul (The sky is blue)\n• Time: Son las tres (It is three o\'clock)\n• Possession: Este libro es mío (This book is mine)\n\nESTAR is used for:\n• Location: Estoy en la casa (I am at home)\n• Temporary conditions: Estoy cansado (I am tired)\n• Feelings: Estamos felices (We are happy)\n• Current actions with gerund: Estoy estudiando (I am studying)\n• Results of actions: La puerta está abierta (The door is open)'
    },
    {
      title: 'Practical Examples',
      content: 'Study these sentences to see how irregular verbs are used in real situations:',
      examples: [
        {
          spanish: 'Yo soy estudiante y estoy en la universidad. Tengo diecinueve años.',
          english: 'I am a student and I am at the university. I am nineteen years old.',
          highlight: ['soy', 'estoy', 'Tengo']
        },
        {
          spanish: 'Ella quiere ir al cine, pero no puede porque tiene que hacer la tarea.',
          english: 'She wants to go to the cinema, but she cannot because she has to do homework.',
          highlight: ['quiere', 'va', 'puede', 'tiene', 'hacer']
        },
        {
          spanish: '¿Qué haces? Voy a la playa. ¿Vienes conmigo?',
          english: 'What are you doing? I am going to the beach. Are you coming with me?',
          highlight: ['haces', 'Voy', 'Vienes']
        },
        {
          spanish: 'Nosotros sabemos que hace calor, pero queremos jugar al fútbol.',
          english: 'We know that it is hot, but we want to play football.',
          highlight: ['sabemos', 'hace', 'queremos']
        }
      ]
    }
  ];

  return (
    <GrammarPageTemplate
      language="spanish"
      category="verbs"
      topic="present-irregular"
      title="Present Tense Irregular Verbs"
      description="Master the most common Spanish irregular verbs in present tense including ser, estar, tener, hacer, ir, poder, querer, and saber"
      difficulty="intermediate"
      estimatedTime={30}
      sections={sections}
      backUrl="/grammar/spanish"
      practiceUrl="/grammar/spanish/verbs/present-irregular/practice"
      quizUrl="/grammar/spanish/verbs/present-irregular/test"
      youtubeVideoId="EGaSgIRswcI"
      relatedTopics={[
        { title: 'Present Regular Verbs', url: '/grammar/spanish/verbs/present-regular', difficulty: 'beginner' },
        { title: 'Ser vs. Estar', url: '/grammar/spanish/verbs/ser-vs-estar', difficulty: 'intermediate' },
        { title: 'Preterite Tense', url: '/grammar/spanish/verbs/preterite-tense', difficulty: 'intermediate' },
        { title: 'Subject Pronouns', url: '/grammar/spanish/pronouns/subject', difficulty: 'beginner' }
      ]}
    />
  );
}
