import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';

export const metadata: Metadata = {
  title: 'Spanish Preterite Tense - Language Gems',
  description: 'Master the Spanish preterite tense for completed past actions. Learn regular and irregular preterite conjugations with comprehensive conjugation tables and examples.',
  keywords: 'Spanish preterite tense, past tense Spanish, preterite conjugation, Spanish grammar, completed actions, pretérito indefinido',
};

export default function SpanishPreteriteTensePage() {
  const sections = [
    {
      title: 'Overview',
      content: 'The preterite tense (pretérito indefinido) is used to describe completed actions in the past that have a definite beginning and end. It is the most common way to talk about specific events that happened at a particular time in the past. Unlike the imperfect tense, which describes ongoing or habitual past actions, the preterite focuses on actions that are finished and complete.'
    },
    {
      title: 'When to Use the Preterite',
      content: '• Completed actions with a specific time: Ayer comí pizza (Yesterday I ate pizza)\n• Sequential past events: Llegué, entré, y me senté (I arrived, entered, and sat down)\n• Actions with a definite beginning and end: Trabajé allí por cinco años (I worked there for five years)\n• Sudden or momentary actions: De repente, sonó el teléfono (Suddenly, the phone rang)\n• Specific number of times: Lo hice tres veces (I did it three times)\n• Time expressions: ayer (yesterday), la semana pasada (last week), hace dos días (two days ago), el año pasado (last year)'
    },
    {
      title: 'Regular Preterite Conjugations',
      content: 'Regular verbs in the preterite follow predictable patterns based on their infinitive ending (-ar, -er, -ir).',
      subsections: [
        {
          title: '-AR Verbs (First Conjugation)',
          content: 'AR verbs in the preterite have a characteristic accent mark on the yo form (-é). The nosotros form is identical to the present tense, so context is important to distinguish between them.',
          conjugationTable: {
            title: 'Hablar (to speak) - Preterite Tense',
            conjugations: [
              { pronoun: 'yo', form: 'hablé', english: 'I spoke' },
              { pronoun: 'tú', form: 'hablaste', english: 'you spoke' },
              { pronoun: 'él/ella/usted', form: 'habló', english: 'he/she/you (formal) spoke' },
              { pronoun: 'nosotros/as', form: 'hablamos', english: 'we spoke' },
              { pronoun: 'vosotros/as', form: 'hablasteis', english: 'you all spoke (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'hablaron', english: 'they/you all spoke' }
            ]
          },
          examples: [
            {
              spanish: 'Yo hablé con el profesor esta mañana.',
              english: 'I spoke with the professor this morning.',
              highlight: ['hablé']
            },
            {
              spanish: 'Ella habló durante una hora sobre el proyecto.',
              english: 'She spoke for an hour about the project.',
              highlight: ['habló']
            },
            {
              spanish: 'Nosotros hablamos de nuestros planes para el verano.',
              english: 'We spoke about our plans for the summer.',
              highlight: ['hablamos']
            }
          ]
        },
        {
          title: '-ER Verbs (Second Conjugation)',
          content: 'ER verbs in the preterite have an accent mark on the yo form (-í). The nosotros form is identical to the present tense.',
          conjugationTable: {
            title: 'Comer (to eat) - Preterite Tense',
            conjugations: [
              { pronoun: 'yo', form: 'comí', english: 'I ate' },
              { pronoun: 'tú', form: 'comiste', english: 'you ate' },
              { pronoun: 'él/ella/usted', form: 'comió', english: 'he/she/you (formal) ate' },
              { pronoun: 'nosotros/as', form: 'comimos', english: 'we ate' },
              { pronoun: 'vosotros/as', form: 'comisteis', english: 'you all ate (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'comieron', english: 'they/you all ate' }
            ]
          },
          examples: [
            {
              spanish: 'Yo comí un sándwich para el almuerzo.',
              english: 'I ate a sandwich for lunch.',
              highlight: ['comí']
            },
            {
              spanish: 'Ellos comieron en un restaurante italiano anoche.',
              english: 'They ate at an Italian restaurant last night.',
              highlight: ['comieron']
            }
          ]
        },
        {
          title: '-IR Verbs (Third Conjugation)',
          content: 'IR verbs in the preterite have the same endings as ER verbs. The nosotros form is identical to the present tense.',
          conjugationTable: {
            title: 'Vivir (to live) - Preterite Tense',
            conjugations: [
              { pronoun: 'yo', form: 'viví', english: 'I lived' },
              { pronoun: 'tú', form: 'viviste', english: 'you lived' },
              { pronoun: 'él/ella/usted', form: 'vivió', english: 'he/she/you (formal) lived' },
              { pronoun: 'nosotros/as', form: 'vivimos', english: 'we lived' },
              { pronoun: 'vosotros/as', form: 'vivisteis', english: 'you all lived (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'vivieron', english: 'they/you all lived' }
            ]
          },
          examples: [
            {
              spanish: 'Yo viví en Barcelona durante tres años.',
              english: 'I lived in Barcelona for three years.',
              highlight: ['viví']
            },
            {
              spanish: 'Ella vivió en el extranjero cuando era joven.',
              english: 'She lived abroad when she was young.',
              highlight: ['vivió']
            }
          ]
        }
      ]
    },
    {
      title: 'Common Irregular Preterite Verbs',
      content: 'Many frequently used verbs have irregular preterite forms. These must be memorized, but they often follow patterns.',
      subsections: [
        {
          title: 'Ser/Ir (to be/to go) - Completely Irregular',
          content: 'Ser and ir have identical preterite forms. Context determines the meaning.',
          conjugationTable: {
            title: 'Ser/Ir - Preterite Tense',
            conjugations: [
              { pronoun: 'yo', form: 'fui', english: 'I was/went' },
              { pronoun: 'tú', form: 'fuiste', english: 'you were/went' },
              { pronoun: 'él/ella/usted', form: 'fue', english: 'he/she/you (formal) was/went' },
              { pronoun: 'nosotros/as', form: 'fuimos', english: 'we were/went' },
              { pronoun: 'vosotros/as', form: 'fuisteis', english: 'you all were/went (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'fueron', english: 'they/you all were/went' }
            ]
          },
          examples: [
            {
              spanish: 'Yo fui a la playa el fin de semana pasado.',
              english: 'I went to the beach last weekend.',
              highlight: ['fui']
            },
            {
              spanish: 'Fue una película excelente.',
              english: 'It was an excellent movie.',
              highlight: ['Fue']
            }
          ]
        },
        {
          title: 'Tener (to have) - u-stem Irregular',
          conjugationTable: {
            title: 'Tener - Preterite Tense',
            conjugations: [
              { pronoun: 'yo', form: 'tuve', english: 'I had' },
              { pronoun: 'tú', form: 'tuviste', english: 'you had' },
              { pronoun: 'él/ella/usted', form: 'tuvo', english: 'he/she/you (formal) had' },
              { pronoun: 'nosotros/as', form: 'tuvimos', english: 'we had' },
              { pronoun: 'vosotros/as', form: 'tuvisteis', english: 'you all had (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'tuvieron', english: 'they/you all had' }
            ]
          }
        },
        {
          title: 'Hacer (to do/make) - i-stem Irregular',
          conjugationTable: {
            title: 'Hacer - Preterite Tense',
            conjugations: [
              { pronoun: 'yo', form: 'hice', english: 'I did/made' },
              { pronoun: 'tú', form: 'hiciste', english: 'you did/made' },
              { pronoun: 'él/ella/usted', form: 'hizo', english: 'he/she/you (formal) did/made' },
              { pronoun: 'nosotros/as', form: 'hicimos', english: 'we did/made' },
              { pronoun: 'vosotros/as', form: 'hicisteis', english: 'you all did/made (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'hicieron', english: 'they/you all did/made' }
            ]
          }
        },
        {
          title: 'Estar (to be) - u-stem Irregular',
          conjugationTable: {
            title: 'Estar - Preterite Tense',
            conjugations: [
              { pronoun: 'yo', form: 'estuve', english: 'I was' },
              { pronoun: 'tú', form: 'estuviste', english: 'you were' },
              { pronoun: 'él/ella/usted', form: 'estuvo', english: 'he/she/you (formal) was' },
              { pronoun: 'nosotros/as', form: 'estuvimos', english: 'we were' },
              { pronoun: 'vosotros/as', form: 'estuvisteis', english: 'you all were (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'estuvieron', english: 'they/you all were' }
            ]
          }
        },
        {
          title: 'Poder (can/to be able) - u-stem Irregular',
          conjugationTable: {
            title: 'Poder - Preterite Tense',
            conjugations: [
              { pronoun: 'yo', form: 'pude', english: 'I could/was able' },
              { pronoun: 'tú', form: 'pudiste', english: 'you could/were able' },
              { pronoun: 'él/ella/usted', form: 'pudo', english: 'he/she/you (formal) could/was able' },
              { pronoun: 'nosotros/as', form: 'pudimos', english: 'we could/were able' },
              { pronoun: 'vosotros/as', form: 'pudisteis', english: 'you all could/were able (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'pudieron', english: 'they/you all could/were able' }
            ]
          }
        }
      ]
    },
    {
      title: 'Preterite vs. Imperfect',
      content: 'PRETERITE (Completed actions):\n• Specific completed actions: Comí pizza ayer (I ate pizza yesterday)\n• Actions with definite beginning and end: Trabajé allí por cinco años (I worked there for five years)\n• Sequential events: Llegué, entré, y me senté (I arrived, entered, and sat down)\n• Sudden or momentary actions: De repente, sonó el teléfono (Suddenly, the phone rang)\n\nIMPERFECT (Ongoing or habitual past actions):\n• Habitual or repeated actions: Comía pizza todos los viernes (I used to eat pizza every Friday)\n• Ongoing actions in the past: Mientras estudiaba, sonó el teléfono (While I was studying, the phone rang)\n• Descriptions of past states: Era un día hermoso (It was a beautiful day)\n• Background information: Hacía calor y había mucha gente (It was hot and there were many people)'
    },
    {
      title: 'Practical Examples',
      content: 'Study these sentences to see how the preterite is used in real situations:',
      examples: [
        {
          spanish: 'Ayer fui al cine y vi una película excelente.',
          english: 'Yesterday I went to the cinema and saw an excellent movie.',
          highlight: ['fui', 'vi']
        },
        {
          spanish: 'Ella tuvo un accidente pero pudo llegar a casa sin problemas.',
          english: 'She had an accident but was able to get home without problems.',
          highlight: ['tuvo', 'pudo']
        },
        {
          spanish: 'Nosotros hicimos un viaje a España el año pasado.',
          english: 'We took a trip to Spain last year.',
          highlight: ['hicimos']
        },
        {
          spanish: 'Ellos estuvieron en la playa durante dos semanas.',
          english: 'They were at the beach for two weeks.',
          highlight: ['estuvieron']
        },
        {
          spanish: 'Comí, bebí, y disfruté de la fiesta con mis amigos.',
          english: 'I ate, drank, and enjoyed the party with my friends.',
          highlight: ['Comí', 'bebí', 'disfruté']
        }
      ]
    }
  ];

  return (
    <GrammarPageTemplate
      language="spanish"
      category="verbs"
      topic="preterite-tense"
      title="Preterite Tense"
      description="Master the Spanish preterite tense for completed past actions with regular and irregular conjugations"
      difficulty="intermediate"
      estimatedTime={35}
      sections={sections}
      backUrl="/grammar/spanish"
      practiceUrl="/grammar/spanish/verbs/preterite-tense/practice"
      quizUrl="/grammar/spanish/verbs/preterite-tense/test"
      youtubeVideoId="EGaSgIRswcI"
      relatedTopics={[
        { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect-tense', difficulty: 'intermediate' },
        { title: 'Imperfect vs. Preterite', url: '/grammar/spanish/verbs/imperfect-vs-preterite', difficulty: 'intermediate' },
        { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' },
        { title: 'Present Perfect', url: '/grammar/spanish/verbs/present-perfect', difficulty: 'intermediate' }
      ]}
    />
  );
}
