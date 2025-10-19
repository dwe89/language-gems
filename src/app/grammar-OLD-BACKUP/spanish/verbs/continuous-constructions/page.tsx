import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'continuous-constructions',
  title: 'Spanish Continuous Constructions',
  description: 'Master Spanish continuous constructions with estar, seguir, andar, and ir + gerund. Learn different ways to express ongoing actions.',
  difficulty: 'intermediate',
  keywords: [
    'spanish continuous constructions',
    'estar gerund',
    'seguir gerund',
    'andar gerund',
    'spanish progressive forms'
  ],
  examples: [
    'Sigue lloviendo (It keeps raining)',
    'Anda diciendo mentiras (He goes around telling lies)',
    'Voy mejorando (I am getting better)'
  ]
});

const sections = [
  {
    title: 'What are Spanish Continuous Constructions?',
    content: `Spanish continuous constructions are various ways to express ongoing, repeated, or progressive actions using different auxiliary verbs with the gerund. While **estar + gerund** is the most common, Spanish also uses **seguir**, **andar**, **ir**, and **venir** with gerunds to express different nuances of continuous action.

Each construction adds a specific meaning or emphasis to the ongoing action.`,
    examples: [
      {
        spanish: 'Está trabajando.',
        english: 'He is working. (standard continuous)',
        highlight: ['Está trabajando']
      },
      {
        spanish: 'Sigue trabajando.',
        english: 'He keeps working. (continuation)',
        highlight: ['Sigue trabajando']
      },
      {
        spanish: 'Anda trabajando.',
        english: 'He goes around working. (habitual)',
        highlight: ['Anda trabajando']
      }
    ]
  },
  {
    title: 'Types of Continuous Constructions',
    content: `Different auxiliary verbs create different meanings when combined with gerunds.`,
    subsections: [
      {
        title: 'Estar + Gerund (Standard Continuous)',
        content: 'The most common form, expressing actions happening at the moment of speaking:',
        examples: [
          {
            spanish: 'Estoy estudiando español.',
            english: 'I am studying Spanish.',
            highlight: ['Estoy estudiando']
          },
          {
            spanish: 'Están comiendo pizza.',
            english: 'They are eating pizza.',
            highlight: ['Están comiendo']
          }
        ]
      },
      {
        title: 'Seguir + Gerund (Continuation)',
        content: 'Expresses the continuation of an action, equivalent to "keep/continue doing":',
        examples: [
          {
            spanish: 'Sigue lloviendo.',
            english: 'It keeps raining.',
            highlight: ['Sigue lloviendo']
          },
          {
            spanish: 'Seguimos esperando.',
            english: 'We keep waiting.',
            highlight: ['Seguimos esperando']
          }
        ]
      },
      {
        title: 'Andar + Gerund (Habitual/Wandering)',
        content: 'Suggests habitual, repeated, or wandering actions:',
        examples: [
          {
            spanish: 'Anda contando chismes.',
            english: 'He goes around telling gossip.',
            highlight: ['Anda contando']
          },
          {
            spanish: 'Andamos buscando trabajo.',
            english: 'We are looking for work (actively).',
            highlight: ['Andamos buscando']
          }
        ]
      }
    ]
  },
  {
    title: 'Advanced Constructions',
    content: `More sophisticated continuous constructions with specific meanings.`,
    subsections: [
      {
        title: 'Ir + Gerund (Gradual Progress)',
        content: 'Expresses gradual development or progress:',
        examples: [
          {
            spanish: 'Voy mejorando.',
            english: 'I am getting better (gradually).',
            highlight: ['Voy mejorando']
          },
          {
            spanish: 'Va aprendiendo.',
            english: 'He is learning (bit by bit).',
            highlight: ['Va aprendiendo']
          }
        ]
      },
      {
        title: 'Venir + Gerund (Ongoing from Past)',
        content: 'Expresses actions that have been ongoing from the past:',
        examples: [
          {
            spanish: 'Vengo diciéndolo desde hace años.',
            english: 'I have been saying it for years.',
            highlight: ['Vengo diciéndolo']
          },
          {
            spanish: 'Viene trabajando aquí desde enero.',
            english: 'He has been working here since January.',
            highlight: ['Viene trabajando']
          }
        ]
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Reflexive Verbs', url: '/grammar/spanish/verbs/reflexive', difficulty: 'intermediate' },
  { title: 'Subjunctive Present', url: '/grammar/spanish/verbs/subjunctive-present', difficulty: 'advanced' },
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' },
  { title: 'Ser vs Estar', url: '/grammar/spanish/verbs/ser-vs-estar', difficulty: 'beginner' }
];

export default function SpanishContinuousConstructionsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'continuous-constructions',
              title: 'Spanish Continuous Constructions',
              description: 'Master Spanish continuous constructions with comprehensive explanations and examples',
              difficulty: 'intermediate',
              estimatedTime: 25
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'continuous-constructions',
              title: 'Spanish Continuous Constructions'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="continuous-constructions"
        title="Spanish Continuous Constructions"
        description="Master Spanish continuous constructions with comprehensive explanations and examples"
        difficulty="intermediate"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/continuous-constructions/practice"
        quizUrl="/grammar/spanish/verbs/continuous-constructions/quiz"
        songUrl="/songs/es?theme=grammar&topic=continuous-constructions"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
