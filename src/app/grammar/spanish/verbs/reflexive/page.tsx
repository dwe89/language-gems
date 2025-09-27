import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'reflexive',
  title: 'Spanish Reflexive Verbs',
  description: 'Master Spanish reflexive verbs with comprehensive explanations, reflexive pronouns, and usage patterns.',
  difficulty: 'intermediate',
  keywords: [
    'spanish reflexive verbs',
    'verbos reflexivos',
    'reflexive pronouns spanish',
    'me te se nos os',
    'spanish grammar reflexive'
  ],
  examples: [
    'Me lavo las manos (I wash my hands)',
    'Se levanta temprano (He gets up early)',
    'Nos vemos mañana (We see each other tomorrow)'
  ]
});

const sections = [
  {
    title: 'What are Spanish Reflexive Verbs?',
    content: `Spanish reflexive verbs (**verbos reflexivos**) are verbs where the subject performs an action on themselves. They are always used with reflexive pronouns (me, te, se, nos, os, se) that correspond to the subject.

Reflexive verbs can express actions done to oneself, reciprocal actions, or changes of state.`,
    examples: [
      {
        spanish: 'Me ducho por la mañana.',
        english: 'I shower in the morning.',
        highlight: ['Me ducho']
      },
      {
        spanish: 'Se miran en el espejo.',
        english: 'They look at themselves in the mirror.',
        highlight: ['Se miran']
      },
      {
        spanish: 'Nos escribimos cartas.',
        english: 'We write letters to each other.',
        highlight: ['Nos escribimos']
      }
    ]
  },
  {
    title: 'Reflexive Pronouns',
    content: `Reflexive pronouns must agree with the subject and are placed before the conjugated verb.`,
    subsections: [
      {
        title: 'Reflexive Pronoun Forms',
        content: 'Each subject has its corresponding reflexive pronoun:',
        conjugationTable: {
          title: 'Reflexive Pronouns',
          conjugations: [
            { pronoun: 'yo', form: 'me', english: 'myself' },
            { pronoun: 'tú', form: 'te', english: 'yourself' },
            { pronoun: 'él/ella/usted', form: 'se', english: 'himself/herself/yourself' },
            { pronoun: 'nosotros', form: 'nos', english: 'ourselves' },
            { pronoun: 'vosotros', form: 'os', english: 'yourselves' },
            { pronoun: 'ellos/ellas/ustedes', form: 'se', english: 'themselves/yourselves' }
          ]
        }
      },
      {
        title: 'Placement of Reflexive Pronouns',
        content: 'Reflexive pronouns are placed before conjugated verbs, but can attach to infinitives and gerunds:',
        examples: [
          {
            spanish: 'Me levanto a las siete.',
            english: 'I get up at seven.',
            highlight: ['Me levanto']
          },
          {
            spanish: 'Voy a levantarme / Me voy a levantar.',
            english: 'I am going to get up.',
            highlight: ['levantarme', 'Me voy a levantar']
          },
          {
            spanish: 'Estoy levantándome / Me estoy levantando.',
            english: 'I am getting up.',
            highlight: ['levantándome', 'Me estoy levantando']
          }
        ]
      }
    ]
  },
  {
    title: 'Types of Reflexive Verbs',
    content: `Spanish reflexive verbs can be categorized into different types based on their meaning and usage.`,
    subsections: [
      {
        title: 'True Reflexive (Action on Oneself)',
        content: 'The subject performs an action on themselves:',
        examples: [
          {
            spanish: 'Me lavo la cara.',
            english: 'I wash my face.',
            highlight: ['Me lavo']
          },
          {
            spanish: 'Se corta el pelo.',
            english: 'He cuts his hair.',
            highlight: ['Se corta']
          },
          {
            spanish: 'Nos vestimos rápidamente.',
            english: 'We get dressed quickly.',
            highlight: ['Nos vestimos']
          }
        ]
      },
      {
        title: 'Reciprocal Actions',
        content: 'Actions performed mutually between subjects:',
        examples: [
          {
            spanish: 'Se aman mucho.',
            english: 'They love each other very much.',
            highlight: ['Se aman']
          },
          {
            spanish: 'Nos conocimos en la universidad.',
            english: 'We met each other at university.',
            highlight: ['Nos conocimos']
          },
          {
            spanish: 'Se escriben emails todos los días.',
            english: 'They write emails to each other every day.',
            highlight: ['Se escriben']
          }
        ]
      },
      {
        title: 'Change of State/Emotion',
        content: 'Verbs expressing changes in emotional or physical state:',
        examples: [
          {
            spanish: 'Me enfado cuando llueve.',
            english: 'I get angry when it rains.',
            highlight: ['Me enfado']
          },
          {
            spanish: 'Se pone nervioso antes de los exámenes.',
            english: 'He gets nervous before exams.',
            highlight: ['Se pone nervioso']
          },
          {
            spanish: 'Nos alegramos de verte.',
            english: 'We are happy to see you.',
            highlight: ['Nos alegramos']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Reflexive Verbs',
    content: `Here are some of the most frequently used reflexive verbs in Spanish.`,
    examples: [
      {
        spanish: 'levantarse - to get up',
        english: 'Me levanto a las seis.',
        highlight: ['levantarse', 'Me levanto']
      },
      {
        spanish: 'ducharse - to shower',
        english: 'Se ducha por la noche.',
        highlight: ['ducharse', 'Se ducha']
      },
      {
        spanish: 'acostarse - to go to bed',
        english: 'Nos acostamos tarde.',
        highlight: ['acostarse', 'Nos acostamos']
      },
      {
        spanish: 'llamarse - to be called',
        english: '¿Cómo te llamas?',
        highlight: ['llamarse', 'te llamas']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Direct Object Pronouns', url: '/grammar/spanish/pronouns/direct-object' },
  { title: 'Indirect Object Pronouns', url: '/grammar/spanish/pronouns/indirect-object' },
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense' }
];

export default function SpanishReflexiveVerbsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'reflexive',
              title: 'Spanish Reflexive Verbs',
              description: 'Master Spanish reflexive verbs with comprehensive explanations and examples',
              difficulty: 'intermediate',
              estimatedTime: 25
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'reflexive',
              title: 'Spanish Reflexive Verbs'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="reflexive"
        title="Spanish Reflexive Verbs"
        description="Master Spanish reflexive verbs with comprehensive explanations and examples"
        difficulty="intermediate"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/reflexive/practice"
        quizUrl="/grammar/spanish/verbs/reflexive/quiz"
        songUrl="/songs/es?theme=grammar&topic=reflexive"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
