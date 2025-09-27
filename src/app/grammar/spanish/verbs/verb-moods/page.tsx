import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'verb-moods',
  title: 'Spanish Verb Moods',
  description: 'Master Spanish verb moods including indicative, subjunctive, and imperative with comprehensive explanations and usage examples.',
  difficulty: 'advanced',
  keywords: [
    'spanish verb moods',
    'indicative mood spanish',
    'subjunctive mood spanish',
    'imperative mood spanish',
    'spanish grammar moods'
  ],
  examples: [
    'Indicative: Él estudia español (He studies Spanish)',
    'Subjunctive: Espero que estudie español (I hope he studies Spanish)',
    'Imperative: ¡Estudia español! (Study Spanish!)'
  ]
});

const sections = [
  {
    title: 'What are Spanish Verb Moods?',
    content: `Spanish verb moods express the speaker's attitude toward the action or state described by the verb. There are three main moods in Spanish: **indicative** (facts and certainty), **subjunctive** (doubt, emotion, desire), and **imperative** (commands).

Understanding verb moods is crucial for advanced Spanish fluency as they convey subtle differences in meaning and attitude.`,
    examples: [
      {
        spanish: 'Sé que viene mañana. (Indicative - fact)',
        english: 'I know he\'s coming tomorrow.',
        highlight: ['viene']
      },
      {
        spanish: 'Espero que venga mañana. (Subjunctive - hope)',
        english: 'I hope he comes tomorrow.',
        highlight: ['venga']
      },
      {
        spanish: '¡Ven mañana! (Imperative - command)',
        english: 'Come tomorrow!',
        highlight: ['Ven']
      }
    ]
  },
  {
    title: 'Indicative Mood',
    content: `The indicative mood expresses facts, certainty, and objective reality. It is the most commonly used mood in Spanish.`,
    subsections: [
      {
        title: 'Uses of the Indicative',
        content: 'The indicative is used for:',
        examples: [
          {
            spanish: 'Facts: Madrid es la capital de España.',
            english: 'Madrid is the capital of Spain.',
            highlight: ['es']
          },
          {
            spanish: 'Certainty: Sé que tienes razón.',
            english: 'I know you\'re right.',
            highlight: ['tienes']
          },
          {
            spanish: 'Habitual actions: Trabajo todos los días.',
            english: 'I work every day.',
            highlight: ['Trabajo']
          },
          {
            spanish: 'Completed actions: Ayer comí paella.',
            english: 'Yesterday I ate paella.',
            highlight: ['comí']
          }
        ]
      },
      {
        title: 'Indicative Tenses',
        content: 'All the tenses you\'ve learned are indicative:',
        examples: [
          {
            spanish: 'Present: Hablo español.',
            english: 'I speak Spanish.',
            highlight: ['Hablo']
          },
          {
            spanish: 'Preterite: Hablé con María.',
            english: 'I spoke with María.',
            highlight: ['Hablé']
          },
          {
            spanish: 'Future: Hablaré mañana.',
            english: 'I will speak tomorrow.',
            highlight: ['Hablaré']
          },
          {
            spanish: 'Present Perfect: He hablado con él.',
            english: 'I have spoken with him.',
            highlight: ['He hablado']
          }
        ]
      }
    ]
  },
  {
    title: 'Subjunctive Mood',
    content: `The subjunctive mood expresses subjectivity, doubt, emotion, desire, and hypothetical situations.`,
    subsections: [
      {
        title: 'When to Use Subjunctive',
        content: 'The subjunctive is triggered by:',
        examples: [
          {
            spanish: 'Doubt: Dudo que sea verdad.',
            english: 'I doubt it\'s true.',
            highlight: ['sea']
          },
          {
            spanish: 'Emotion: Me alegra que vengas.',
            english: 'I\'m glad you\'re coming.',
            highlight: ['vengas']
          },
          {
            spanish: 'Desire: Quiero que estudies.',
            english: 'I want you to study.',
            highlight: ['estudies']
          },
          {
            spanish: 'Impersonal expressions: Es importante que sepas esto.',
            english: 'It\'s important that you know this.',
            highlight: ['sepas']
          }
        ]
      },
      {
        title: 'Subjunctive Tenses',
        content: 'Main subjunctive tenses:',
        examples: [
          {
            spanish: 'Present Subjunctive: Espero que hables.',
            english: 'I hope you speak.',
            highlight: ['hables']
          },
          {
            spanish: 'Imperfect Subjunctive: Quería que hablaras.',
            english: 'I wanted you to speak.',
            highlight: ['hablaras']
          },
          {
            spanish: 'Present Perfect Subjunctive: Dudo que haya hablado.',
            english: 'I doubt he has spoken.',
            highlight: ['haya hablado']
          }
        ]
      }
    ]
  },
  {
    title: 'Imperative Mood',
    content: `The imperative mood is used for commands, requests, and instructions.`,
    subsections: [
      {
        title: 'Positive Commands',
        content: 'Direct commands and requests:',
        examples: [
          {
            spanish: 'Tú: ¡Habla más despacio!',
            english: 'Speak more slowly!',
            highlight: ['Habla']
          },
          {
            spanish: 'Usted: Hable con el director.',
            english: 'Speak with the director.',
            highlight: ['Hable']
          },
          {
            spanish: 'Nosotros: Hablemos en español.',
            english: 'Let\'s speak in Spanish.',
            highlight: ['Hablemos']
          },
          {
            spanish: 'Vosotros: Hablad más alto.',
            english: 'Speak louder.',
            highlight: ['Hablad']
          }
        ]
      },
      {
        title: 'Negative Commands',
        content: 'Negative commands use subjunctive forms:',
        examples: [
          {
            spanish: 'Tú: No hables tan rápido.',
            english: 'Don\'t speak so fast.',
            highlight: ['No hables']
          },
          {
            spanish: 'Usted: No hable tan alto.',
            english: 'Don\'t speak so loudly.',
            highlight: ['No hable']
          },
          {
            spanish: 'Vosotros: No habléis todos a la vez.',
            english: 'Don\'t all speak at once.',
            highlight: ['No habléis']
          }
        ]
      }
    ]
  },
  {
    title: 'Mood Selection Guide',
    content: `Quick guide for choosing the correct mood.`,
    examples: [
      {
        spanish: 'Use INDICATIVE for facts and certainty',
        english: 'Sé que María viene. (I know María is coming)',
        highlight: ['viene']
      },
      {
        spanish: 'Use SUBJUNCTIVE after expressions of doubt, emotion, desire',
        english: 'Dudo que María venga. (I doubt María will come)',
        highlight: ['venga']
      },
      {
        spanish: 'Use IMPERATIVE for commands and requests',
        english: '¡María, ven aquí! (María, come here!)',
        highlight: ['ven']
      },
      {
        spanish: 'Contrast: Creo que es verdad (indicative) vs. No creo que sea verdad (subjunctive)',
        english: 'I think it\'s true vs. I don\'t think it\'s true',
        highlight: ['es', 'sea']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Present Subjunctive', url: '/grammar/spanish/verbs/subjunctive-present' },
  { title: 'Imperative', url: '/grammar/spanish/verbs/imperative' },
  { title: 'Indicative vs Subjunctive', url: '/grammar/spanish/verbs/subjunctive' }
];

export default function SpanishVerbMoodsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'verb-moods',
              title: 'Spanish Verb Moods',
              description: 'Master Spanish verb moods with comprehensive explanations and examples',
              difficulty: 'advanced',
              estimatedTime: 35
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'verb-moods',
              title: 'Spanish Verb Moods'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="verb-moods"
        title="Spanish Verb Moods"
        description="Master Spanish verb moods with comprehensive explanations and examples"
        difficulty="advanced"
        estimatedTime={35}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/verb-moods/practice"
        quizUrl="/grammar/spanish/verbs/verb-moods/quiz"
        songUrl="/songs/es?theme=grammar&topic=verb-moods"
        youtubeVideoId="dQw4w9WgXcQ"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
