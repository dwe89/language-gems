import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'subjunctive-pluperfect',
  title: 'Spanish Pluperfect Subjunctive',
  description: 'Master the Spanish pluperfect subjunctive with comprehensive explanations, formation rules, and usage examples.',
  difficulty: 'advanced',
  keywords: [
    'spanish pluperfect subjunctive',
    'pluscuamperfecto de subjuntivo',
    'hubiera hablado',
    'hubiese hablado',
    'past perfect subjunctive'
  ],
  examples: [
    'Si hubiera estudiado, habría aprobado (If I had studied, I would have passed)',
    'Ojalá hubieras venido (I wish you had come)',
    'Dudaba que hubieran terminado (I doubted they had finished)'
  ]
});

const sections = [
  {
    title: 'What is the Spanish Pluperfect Subjunctive?',
    content: `The Spanish pluperfect subjunctive (**pluscuamperfecto de subjuntivo**) expresses past actions that occurred before other past actions in subjunctive contexts. It is formed using the imperfect subjunctive of **haber** + past participle.

This tense is essential for complex conditional sentences and expressing regrets or wishes about the past.`,
    examples: [
      {
        spanish: 'Si hubiera sabido, no habría venido.',
        english: 'If I had known, I wouldn\'t have come.',
        highlight: ['hubiera sabido']
      },
      {
        spanish: 'Ojalá hubiéramos llegado antes.',
        english: 'I wish we had arrived earlier.',
        highlight: ['hubiéramos llegado']
      },
      {
        spanish: 'Era imposible que hubieran terminado tan rápido.',
        english: 'It was impossible that they had finished so quickly.',
        highlight: ['hubieran terminado']
      }
    ]
  },
  {
    title: 'Formation of the Pluperfect Subjunctive',
    content: `The pluperfect subjunctive is formed with the imperfect subjunctive of haber + past participle.`,
    subsections: [
      {
        title: 'Haber in Imperfect Subjunctive (-ra form)',
        content: 'The auxiliary verb haber in the imperfect subjunctive:',
        conjugationTable: {
          title: 'Haber - Imperfect Subjunctive (-ra)',
          conjugations: [
            { pronoun: 'yo', form: 'hubiera', english: 'I had' },
            { pronoun: 'tú', form: 'hubieras', english: 'you had' },
            { pronoun: 'él/ella/usted', form: 'hubiera', english: 'he/she/you had' },
            { pronoun: 'nosotros', form: 'hubiéramos', english: 'we had' },
            { pronoun: 'vosotros', form: 'hubierais', english: 'you all had' },
            { pronoun: 'ellos/ellas/ustedes', form: 'hubieran', english: 'they/you all had' }
          ]
        }
      },
      {
        title: 'Haber in Imperfect Subjunctive (-se form)',
        content: 'Alternative -se form (interchangeable with -ra form):',
        conjugationTable: {
          title: 'Haber - Imperfect Subjunctive (-se)',
          conjugations: [
            { pronoun: 'yo', form: 'hubiese', english: 'I had' },
            { pronoun: 'tú', form: 'hubieses', english: 'you had' },
            { pronoun: 'él/ella/usted', form: 'hubiese', english: 'he/she/you had' },
            { pronoun: 'nosotros', form: 'hubiésemos', english: 'we had' },
            { pronoun: 'vosotros', form: 'hubieseis', english: 'you all had' },
            { pronoun: 'ellos/ellas/ustedes', form: 'hubiesen', english: 'they/you all had' }
          ]
        }
      },
      {
        title: 'Complete Pluperfect Subjunctive',
        content: 'Example with hablar (to speak):',
        examples: [
          {
            spanish: 'hubiera/hubiese hablado',
            english: 'I had spoken',
            highlight: ['hubiera hablado']
          },
          {
            spanish: 'hubieras/hubieses hablado',
            english: 'you had spoken',
            highlight: ['hubieras hablado']
          },
          {
            spanish: 'hubiera/hubiese hablado',
            english: 'he/she/you had spoken',
            highlight: ['hubiera hablado']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses of the Pluperfect Subjunctive',
    content: `The pluperfect subjunctive is used in specific advanced contexts.`,
    subsections: [
      {
        title: 'Third Type Conditional Sentences',
        content: 'Used in "si" clauses expressing unreal past conditions:',
        examples: [
          {
            spanish: 'Si hubiera estudiado, habría aprobado.',
            english: 'If I had studied, I would have passed.',
            highlight: ['Si hubiera estudiado']
          },
          {
            spanish: 'Si hubieras venido, te habrías divertido.',
            english: 'If you had come, you would have had fun.',
            highlight: ['Si hubieras venido']
          },
          {
            spanish: 'Si hubieran llegado antes, habrían visto el espectáculo.',
            english: 'If they had arrived earlier, they would have seen the show.',
            highlight: ['Si hubieran llegado']
          }
        ]
      },
      {
        title: 'Past Subjunctive Context with Completed Actions',
        content: 'Used when the main clause is in the past and refers to completed actions:',
        examples: [
          {
            spanish: 'Dudaba que hubieran terminado el trabajo.',
            english: 'I doubted they had finished the work.',
            highlight: ['hubieran terminado']
          },
          {
            spanish: 'Era imposible que hubiera llegado tan temprano.',
            english: 'It was impossible that he had arrived so early.',
            highlight: ['hubiera llegado']
          },
          {
            spanish: 'No creía que hubieras estudiado tanto.',
            english: 'I didn\'t believe you had studied so much.',
            highlight: ['hubieras estudiado']
          }
        ]
      },
      {
        title: 'Expressing Regrets and Wishes',
        content: 'Used with "ojalá" to express regrets about the past:',
        examples: [
          {
            spanish: 'Ojalá hubiera sabido la verdad.',
            english: 'I wish I had known the truth.',
            highlight: ['hubiera sabido']
          },
          {
            spanish: 'Ojalá hubiéramos llegado a tiempo.',
            english: 'I wish we had arrived on time.',
            highlight: ['hubiéramos llegado']
          },
          {
            spanish: 'Ojalá no hubieran cancelado el concierto.',
            english: 'I wish they hadn\'t canceled the concert.',
            highlight: ['hubieran cancelado']
          }
        ]
      }
    ]
  },
  {
    title: 'Sequence of Tenses with Pluperfect Subjunctive',
    content: `Understanding when to use pluperfect subjunctive in complex sentences.`,
    examples: [
      {
        spanish: 'Past + Pluperfect Subjunctive',
        english: 'Esperaba que hubieras terminado.',
        highlight: ['Esperaba que hubieras terminado']
      },
      {
        spanish: 'Conditional Perfect + Si + Pluperfect Subjunctive',
        english: 'Habría ido si hubiera tenido tiempo.',
        highlight: ['Habría ido si hubiera tenido']
      },
      {
        spanish: 'Past Perfect + Pluperfect Subjunctive',
        english: 'Había esperado que hubieran venido.',
        highlight: ['había esperado que hubieran venido']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Imperfect Subjunctive', url: '/grammar/spanish/verbs/subjunctive-imperfect' },
  { title: 'Conditional Perfect', url: '/grammar/spanish/verbs/conditional-perfect' },
  { title: 'Pluperfect Tense', url: '/grammar/spanish/verbs/pluperfect' }
];

export default function SpanishPluperfectSubjunctivePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'subjunctive-pluperfect',
              title: 'Spanish Pluperfect Subjunctive',
              description: 'Master the Spanish pluperfect subjunctive with comprehensive explanations and examples',
              difficulty: 'advanced',
              estimatedTime: 35
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'subjunctive-pluperfect',
              title: 'Spanish Pluperfect Subjunctive'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="subjunctive-pluperfect"
        title="Spanish Pluperfect Subjunctive"
        description="Master the Spanish pluperfect subjunctive with comprehensive explanations and examples"
        difficulty="advanced"
        estimatedTime={35}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/subjunctive-pluperfect/practice"
        quizUrl="/grammar/spanish/verbs/subjunctive-pluperfect/quiz"
        songUrl="/songs/es?theme=grammar&topic=subjunctive-pluperfect"
        youtubeVideoId="dQw4w9WgXcQ"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
