import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'sequence-of-tenses',
  title: 'Spanish Sequence of Tenses',
  description: 'Master Spanish sequence of tenses with comprehensive explanations of tense harmony and concordance rules.',
  difficulty: 'advanced',
  keywords: [
    'spanish sequence of tenses',
    'concordancia de tiempos',
    'tense harmony spanish',
    'spanish tense agreement',
    'subjunctive sequence'
  ],
  examples: [
    'Present + Present Subjunctive: Quiero que vengas',
    'Past + Imperfect Subjunctive: Quería que vinieras',
    'Present Perfect + Perfect Subjunctive: Espero que hayas terminado'
  ]
});

const sections = [
  {
    title: 'What is Sequence of Tenses?',
    content: `Sequence of tenses (**concordancia de tiempos**) refers to the logical relationship between the tense of the main clause and the tense of the subordinate clause. In Spanish, this is especially important when using the subjunctive mood.

Understanding sequence of tenses helps you choose the correct tense in complex sentences and sounds more natural in Spanish.`,
    examples: [
      {
        spanish: 'Quiero que vengas. (Present + Present Subjunctive)',
        english: 'I want you to come.',
        highlight: ['Quiero', 'vengas']
      },
      {
        spanish: 'Quería que vinieras. (Imperfect + Imperfect Subjunctive)',
        english: 'I wanted you to come.',
        highlight: ['Quería', 'vinieras']
      },
      {
        spanish: 'Espero que hayas terminado. (Present + Perfect Subjunctive)',
        english: 'I hope you have finished.',
        highlight: ['Espero', 'hayas terminado']
      }
    ]
  },
  {
    title: 'Basic Sequence Rules',
    content: `The main clause tense determines which subjunctive tense to use in the subordinate clause.`,
    subsections: [
      {
        title: 'Present Time Frame',
        content: 'When the main clause is in present time, use present subjunctive forms:',
        examples: [
          {
            spanish: 'Present + Present Subjunctive: Quiero que estudies.',
            english: 'I want you to study.',
            highlight: ['Quiero que estudies']
          },
          {
            spanish: 'Present Perfect + Present Subjunctive: He pedido que vengas.',
            english: 'I have asked you to come.',
            highlight: ['He pedido que vengas']
          },
          {
            spanish: 'Future + Present Subjunctive: Pediré que me ayudes.',
            english: 'I will ask you to help me.',
            highlight: ['Pediré que me ayudes']
          }
        ]
      },
      {
        title: 'Past Time Frame',
        content: 'When the main clause is in past time, use past subjunctive forms:',
        examples: [
          {
            spanish: 'Imperfect + Imperfect Subjunctive: Quería que estudiaras.',
            english: 'I wanted you to study.',
            highlight: ['Quería que estudiaras']
          },
          {
            spanish: 'Preterite + Imperfect Subjunctive: Pedí que vinieras.',
            english: 'I asked you to come.',
            highlight: ['Pedí que vinieras']
          },
          {
            spanish: 'Pluperfect + Pluperfect Subjunctive: Había esperado que hubieras llegado.',
            english: 'I had hoped you had arrived.',
            highlight: ['Había esperado que hubieras llegado']
          }
        ]
      }
    ]
  },
  {
    title: 'Subjunctive Sequence Patterns',
    content: `Specific patterns for subjunctive sequence of tenses.`,
    subsections: [
      {
        title: 'Simultaneous Actions',
        content: 'When actions happen at the same time:',
        examples: [
          {
            spanish: 'Present: Es importante que estudies ahora.',
            english: 'It\'s important that you study now.',
            highlight: ['Es importante que estudies']
          },
          {
            spanish: 'Past: Era importante que estudiaras entonces.',
            english: 'It was important that you studied then.',
            highlight: ['Era importante que estudiaras']
          }
        ]
      },
      {
        title: 'Prior Actions (Perfect Subjunctive)',
        content: 'When the subordinate action happened before the main action:',
        examples: [
          {
            spanish: 'Present: Espero que hayas terminado la tarea.',
            english: 'I hope you have finished the homework.',
            highlight: ['Espero que hayas terminado']
          },
          {
            spanish: 'Past: Esperaba que hubieras terminado la tarea.',
            english: 'I hoped you had finished the homework.',
            highlight: ['Esperaba que hubieras terminado']
          }
        ]
      },
      {
        title: 'Future Actions from Past Perspective',
        content: 'When talking about future actions from a past viewpoint:',
        examples: [
          {
            spanish: 'Dijo que vendría mañana. (Conditional)',
            english: 'He said he would come tomorrow.',
            highlight: ['Dijo que vendría']
          },
          {
            spanish: 'Esperaba que vinieras al día siguiente. (Imperfect Subjunctive)',
            english: 'I hoped you would come the next day.',
            highlight: ['Esperaba que vinieras']
          }
        ]
      }
    ]
  },
  {
    title: 'Conditional Sequence',
    content: `Sequence of tenses in conditional sentences and polite expressions.`,
    examples: [
      {
        spanish: 'Present Conditional: Me gustaría que vinieras.',
        english: 'I would like you to come.',
        highlight: ['Me gustaría que vinieras']
      },
      {
        spanish: 'Perfect Conditional: Habría preferido que hubieras venido.',
        english: 'I would have preferred you to have come.',
        highlight: ['Habría preferido que hubieras venido']
      },
      {
        spanish: 'Si Clauses: Si tuviera tiempo, querría que me ayudaras.',
        english: 'If I had time, I would want you to help me.',
        highlight: ['Si tuviera', 'querría que me ayudaras']
      }
    ]
  },
  {
    title: 'Common Sequence Patterns',
    content: `Frequently used sequence of tenses patterns in Spanish.`,
    subsections: [
      {
        title: 'Emotion and Opinion',
        content: 'Expressing emotions and opinions with proper sequence:',
        examples: [
          {
            spanish: 'Me alegra que hayas venido.',
            english: 'I\'m glad you came.',
            highlight: ['Me alegra que hayas venido']
          },
          {
            spanish: 'Me alegró que vinieras.',
            english: 'I was glad you came.',
            highlight: ['Me alegró que vinieras']
          },
          {
            spanish: 'Dudo que sea verdad.',
            english: 'I doubt it\'s true.',
            highlight: ['Dudo que sea']
          },
          {
            spanish: 'Dudaba que fuera verdad.',
            english: 'I doubted it was true.',
            highlight: ['Dudaba que fuera']
          }
        ]
      },
      {
        title: 'Commands and Requests',
        content: 'Sequence with commands and requests:',
        examples: [
          {
            spanish: 'Te pido que me escuches.',
            english: 'I ask you to listen to me.',
            highlight: ['Te pido que me escuches']
          },
          {
            spanish: 'Te pedí que me escucharas.',
            english: 'I asked you to listen to me.',
            highlight: ['Te pedí que me escucharas']
          },
          {
            spanish: 'Insisto en que vengas.',
            english: 'I insist that you come.',
            highlight: ['Insisto en que vengas']
          }
        ]
      }
    ]
  },
  {
    title: 'Exceptions and Special Cases',
    content: `Some situations where sequence rules may be flexible or have exceptions.`,
    examples: [
      {
        spanish: 'Universal truths: Siempre he creído que la honestidad es importante.',
        english: 'I have always believed that honesty is important.',
        highlight: ['es importante']
      },
      {
        spanish: 'Still relevant: Me dijo que vive en Madrid. (He still lives there)',
        english: 'He told me he lives in Madrid.',
        highlight: ['que vive']
      },
      {
        spanish: 'Immediate future: Quería que vengas mañana. (Colloquial)',
        english: 'I wanted you to come tomorrow.',
        highlight: ['que vengas']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Present Subjunctive', url: '/grammar/spanish/verbs/subjunctive-present' },
  { title: 'Imperfect Subjunctive', url: '/grammar/spanish/verbs/subjunctive-imperfect' },
  { title: 'Perfect Subjunctive', url: '/grammar/spanish/verbs/subjunctive-perfect' }
];

export default function SpanishSequenceOfTensesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'sequence-of-tenses',
              title: 'Spanish Sequence of Tenses',
              description: 'Master Spanish sequence of tenses with comprehensive explanations and examples',
              difficulty: 'advanced',
              estimatedTime: 35
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'sequence-of-tenses',
              title: 'Spanish Sequence of Tenses'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="sequence-of-tenses"
        title="Spanish Sequence of Tenses"
        description="Master Spanish sequence of tenses with comprehensive explanations and examples"
        difficulty="advanced"
        estimatedTime={35}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/sequence-of-tenses/practice"
        quizUrl="/grammar/spanish/verbs/sequence-of-tenses/quiz"
        songUrl="/songs/es?theme=grammar&topic=sequence-of-tenses"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
