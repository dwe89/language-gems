import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'pronominal-verbs',
  title: 'Spanish Pronominal Verbs - Reflexive and Non-Reflexive Uses',
  description: 'Master Spanish pronominal verbs including reflexive, reciprocal, and inherently pronominal verbs with comprehensive examples and usage patterns.',
  difficulty: 'intermediate',
  keywords: ['spanish pronominal verbs', 'reflexive verbs', 'reciprocal verbs', 'inherently pronominal', 'se verbs'],
  examples: ['Me lavo las manos', 'Se conocen bien', 'Me acuerdo de ti', 'Se fue temprano']
});

const sections = [
  {
    title: 'Understanding Spanish Pronominal Verbs',
    content: 'Pronominal verbs (verbos pronominales) are verbs that are accompanied by reflexive pronouns (me, te, se, nos, os, se). They include **reflexive verbs**, **reciprocal verbs**, and **inherently pronominal verbs**.',
    examples: [
      {
        spanish: 'Me lavo las manos.',
        english: 'I wash my hands. (Reflexive)',
        highlight: ['Me', 'lavo']
      },
      {
        spanish: 'Se conocen desde niños.',
        english: 'They have known each other since childhood. (Reciprocal)',
        highlight: ['Se', 'conocen']
      }
    ]
  },
  {
    title: 'Reflexive Verbs (Verbos Reflexivos)',
    content: 'Reflexive verbs indicate that the subject performs an action on themselves. The reflexive pronoun refers back to the subject.',
    examples: [
      {
        spanish: 'Me despierto a las siete.',
        english: 'I wake up at seven.',
        highlight: ['Me', 'despierto']
      },
      {
        spanish: 'Ella se mira en el espejo.',
        english: 'She looks at herself in the mirror.',
        highlight: ['se', 'mira']
      },
      {
        spanish: 'Nos vestimos rápidamente.',
        english: 'We get dressed quickly.',
        highlight: ['Nos', 'vestimos']
      }
    ],
    subsections: [
      {
        title: 'Reflexive Pronouns',
        content: 'Reflexive pronouns must agree with the subject of the sentence.',
        conjugationTable: {
          title: 'Reflexive Pronouns with Lavarse (to wash oneself)',
          conjugations: [
            { pronoun: 'yo', form: 'me lavo', english: 'I wash myself' },
            { pronoun: 'tú', form: 'te lavas', english: 'you wash yourself' },
            { pronoun: 'él/ella/usted', form: 'se lava', english: 'he/she/you wash(es) himself/herself/yourself' },
            { pronoun: 'nosotros', form: 'nos lavamos', english: 'we wash ourselves' },
            { pronoun: 'vosotros', form: 'os laváis', english: 'you all wash yourselves' },
            { pronoun: 'ellos/ellas/ustedes', form: 'se lavan', english: 'they/you all wash themselves/yourselves' }
          ]
        }
      },
      {
        title: 'Common Reflexive Verbs',
        content: 'Many daily routine verbs are reflexive in Spanish.',
        conjugationTable: {
          title: 'Daily Routine Reflexive Verbs',
          conjugations: [
            { pronoun: 'despertarse', form: 'to wake up', english: 'Me despierto temprano' },
            { pronoun: 'levantarse', form: 'to get up', english: 'Se levanta tarde' },
            { pronoun: 'ducharse', form: 'to shower', english: 'Te duchas por la mañana' },
            { pronoun: 'vestirse', form: 'to get dressed', english: 'Nos vestimos elegantemente' },
            { pronoun: 'peinarse', form: 'to comb one\'s hair', english: 'Se peina el cabello' },
            { pronoun: 'acostarse', form: 'to go to bed', english: 'Me acuesto a las diez' }
          ]
        }
      }
    ]
  },
  {
    title: 'Reciprocal Verbs (Verbos Recíprocos)',
    content: 'Reciprocal verbs express mutual actions between two or more subjects. They use plural reflexive pronouns (nos, os, se) to indicate "each other."',
    examples: [
      {
        spanish: 'María y Juan se aman.',
        english: 'María and Juan love each other.',
        highlight: ['se', 'aman']
      },
      {
        spanish: 'Los amigos se ayudan.',
        english: 'The friends help each other.',
        highlight: ['se', 'ayudan']
      },
      {
        spanish: 'Nos escribimos cartas.',
        english: 'We write letters to each other.',
        highlight: ['Nos', 'escribimos']
      }
    ],
    subsections: [
      {
        title: 'Common Reciprocal Verbs',
        content: 'These verbs express mutual actions between subjects.',
        conjugationTable: {
          title: 'Common Reciprocal Actions',
          conjugations: [
            { pronoun: 'conocerse', form: 'to know each other', english: 'Se conocen bien' },
            { pronoun: 'quererse', form: 'to love each other', english: 'Se quieren mucho' },
            { pronoun: 'hablarse', form: 'to talk to each other', english: 'No se hablan' },
            { pronoun: 'verse', form: 'to see each other', english: 'Nos vemos mañana' },
            { pronoun: 'besarse', form: 'to kiss each other', english: 'Se besan en la mejilla' },
            { pronoun: 'abrazarse', form: 'to hug each other', english: 'Se abrazan fuerte' }
          ]
        }
      }
    ]
  },
  {
    title: 'Inherently Pronominal Verbs',
    content: 'Some verbs are **always** used with reflexive pronouns, but the action is not truly reflexive. These verbs have different meanings or don\'t exist without the pronoun.',
    examples: [
      {
        spanish: 'Me acuerdo de mi infancia.',
        english: 'I remember my childhood.',
        highlight: ['Me acuerdo']
      },
      {
        spanish: 'Se fue de la ciudad.',
        english: 'He/She left the city.',
        highlight: ['Se fue']
      },
      {
        spanish: 'Nos damos cuenta del problema.',
        english: 'We realize the problem.',
        highlight: ['Nos damos cuenta']
      }
    ],
    subsections: [
      {
        title: 'Common Inherently Pronominal Verbs',
        content: 'These verbs must always be used with reflexive pronouns.',
        conjugationTable: {
          title: 'Inherently Pronominal Verbs',
          conjugations: [
            { pronoun: 'acordarse', form: 'to remember', english: 'Me acuerdo de ti' },
            { pronoun: 'irse', form: 'to leave/go away', english: 'Se va mañana' },
            { pronoun: 'quedarse', form: 'to stay', english: 'Me quedo en casa' },
            { pronoun: 'darse cuenta', form: 'to realize', english: 'Te das cuenta' },
            { pronoun: 'burlarse', form: 'to make fun of', english: 'Se burla de mí' },
            { pronoun: 'quejarse', form: 'to complain', english: 'Nos quejamos mucho' }
          ]
        }
      }
    ]
  },
  {
    title: 'Verbs with Different Meanings',
    content: 'Some verbs change meaning when used with reflexive pronouns, creating pairs with distinct meanings.',
    examples: [
      {
        spanish: 'Duermo ocho horas. / Me duermo temprano.',
        english: 'I sleep eight hours. / I fall asleep early.',
        highlight: ['Duermo', 'Me duermo']
      },
      {
        spanish: 'Voy al trabajo. / Me voy de aquí.',
        english: 'I go to work. / I\'m leaving here.',
        highlight: ['Voy', 'Me voy']
      }
    ],
    subsections: [
      {
        title: 'Meaning Changes with Pronouns',
        content: 'These verb pairs show how reflexive pronouns can completely change meaning.',
        conjugationTable: {
          title: 'Non-Reflexive vs Reflexive Meanings',
          conjugations: [
            { pronoun: 'dormir / dormirse', form: 'to sleep / to fall asleep', english: 'Duermo bien / Me duermo rápido' },
            { pronoun: 'ir / irse', form: 'to go / to leave', english: 'Voy al cine / Me voy ya' },
            { pronoun: 'llevar / llevarse', form: 'to carry / to take away', english: 'Llevo libros / Me llevo esto' },
            { pronoun: 'poner / ponerse', form: 'to put / to put on', english: 'Pongo la mesa / Me pongo la camisa' }
          ]
        }
      }
    ]
  },
  {
    title: 'Pronoun Placement',
    content: 'Reflexive pronouns follow the same placement rules as other object pronouns.',
    examples: [
      {
        spanish: 'Me estoy lavando. / Estoy lavándome.',
        english: 'I am washing myself.',
        highlight: ['Me estoy', 'lavándome']
      },
      {
        spanish: 'Se va a levantar. / Va a levantarse.',
        english: 'He/She is going to get up.',
        highlight: ['Se va', 'levantarse']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Preterite Tense', url: '/grammar/spanish/verbs/preterite', difficulty: 'intermediate' },
  { title: 'Subjunctive Present', url: '/grammar/spanish/verbs/subjunctive-present', difficulty: 'advanced' },
  { title: 'Ser vs Estar', url: '/grammar/spanish/verbs/ser-vs-estar', difficulty: 'beginner' },
  { title: 'Reflexive Verbs', url: '/grammar/spanish/verbs/reflexive', difficulty: 'intermediate' }
];

export default function SpanishPronominalVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Pronominal Verbs - Reflexive and Non-Reflexive Uses',
            description: 'Master Spanish pronominal verbs including reflexive, reciprocal, and inherently pronominal verbs with comprehensive examples and usage patterns.',
            keywords: ['spanish pronominal verbs', 'reflexive verbs', 'reciprocal verbs', 'inherently pronominal'],
            language: 'spanish',
            category: 'verbs',
            topic: 'pronominal-verbs'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="pronominal-verbs"
        title="Spanish Pronominal Verbs"
        description="Master Spanish pronominal verbs including reflexive, reciprocal, and inherently pronominal verbs with comprehensive examples and usage patterns."
        difficulty="intermediate"
        estimatedTime={22}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/pronominal-verbs/practice"
        quizUrl="/grammar/spanish/verbs/pronominal-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=pronominal-verbs"
        youtubeVideoId="pronominal-verbs-spanish"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
