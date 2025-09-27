import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'subjunctive-perfect',
  title: 'Spanish Perfect Subjunctive',
  description: 'Master the Spanish perfect subjunctive with comprehensive explanations, formation rules, and usage examples.',
  difficulty: 'advanced',
  keywords: [
    'spanish perfect subjunctive',
    'perfecto de subjuntivo',
    'haya hablado',
    'present perfect subjunctive',
    'compound subjunctive'
  ],
  examples: [
    'Espero que hayas terminado la tarea (I hope you have finished the homework)',
    'Dudo que haya llegado a tiempo (I doubt he has arrived on time)',
    'Me alegra que hayamos ganado (I\'m glad we have won)'
  ]
});

const sections = [
  {
    title: 'What is the Spanish Perfect Subjunctive?',
    content: `The Spanish perfect subjunctive (**perfecto de subjuntivo**) expresses completed actions in subjunctive contexts. It is formed using the present subjunctive of **haber** + past participle.

This tense is used when the main clause requires subjunctive and refers to actions that have been completed or may have been completed.`,
    examples: [
      {
        spanish: 'Espero que hayas estudiado para el examen.',
        english: 'I hope you have studied for the exam.',
        highlight: ['hayas estudiado']
      },
      {
        spanish: 'Es posible que hayan llegado ya.',
        english: 'It\'s possible they have already arrived.',
        highlight: ['hayan llegado']
      },
      {
        spanish: 'Me alegra que hayamos terminado el proyecto.',
        english: 'I\'m glad we have finished the project.',
        highlight: ['hayamos terminado']
      }
    ]
  },
  {
    title: 'Formation of the Perfect Subjunctive',
    content: `The perfect subjunctive is formed with the present subjunctive of haber + past participle.`,
    subsections: [
      {
        title: 'Conjugation of Haber (Present Subjunctive)',
        content: 'The auxiliary verb haber in the present subjunctive:',
        conjugationTable: {
          title: 'Haber - Present Subjunctive',
          conjugations: [
            { pronoun: 'yo', form: 'haya', english: 'I have' },
            { pronoun: 'tú', form: 'hayas', english: 'you have' },
            { pronoun: 'él/ella/usted', form: 'haya', english: 'he/she/you have' },
            { pronoun: 'nosotros', form: 'hayamos', english: 'we have' },
            { pronoun: 'vosotros', form: 'hayáis', english: 'you all have' },
            { pronoun: 'ellos/ellas/ustedes', form: 'hayan', english: 'they/you all have' }
          ]
        }
      },
      {
        title: 'Complete Perfect Subjunctive Conjugation',
        content: 'Example with hablar (to speak):',
        conjugationTable: {
          title: 'Hablar - Perfect Subjunctive',
          conjugations: [
            { pronoun: 'yo', form: 'haya hablado', english: 'I have spoken' },
            { pronoun: 'tú', form: 'hayas hablado', english: 'you have spoken' },
            { pronoun: 'él/ella/usted', form: 'haya hablado', english: 'he/she/you have spoken' },
            { pronoun: 'nosotros', form: 'hayamos hablado', english: 'we have spoken' },
            { pronoun: 'vosotros', form: 'hayáis hablado', english: 'you all have spoken' },
            { pronoun: 'ellos/ellas/ustedes', form: 'hayan hablado', english: 'they/you all have spoken' }
          ]
        }
      }
    ]
  },
  {
    title: 'Uses of the Perfect Subjunctive',
    content: `The perfect subjunctive is used in specific contexts where completed actions meet subjunctive requirements.`,
    subsections: [
      {
        title: 'Completed Actions with Subjunctive Triggers',
        content: 'Used when expressing doubt, emotion, or desire about completed actions:',
        examples: [
          {
            spanish: 'Dudo que haya terminado el trabajo.',
            english: 'I doubt he has finished the work.',
            highlight: ['haya terminado']
          },
          {
            spanish: 'Me alegra que hayas venido.',
            english: 'I\'m glad you have come.',
            highlight: ['hayas venido']
          },
          {
            spanish: 'Espero que hayan entendido la lección.',
            english: 'I hope they have understood the lesson.',
            highlight: ['hayan entendido']
          }
        ]
      },
      {
        title: 'Time Expressions with "Cuando"',
        content: 'Used with "cuando" to refer to future completed actions:',
        examples: [
          {
            spanish: 'Cuando hayas terminado, llámame.',
            english: 'When you have finished, call me.',
            highlight: ['hayas terminado']
          },
          {
            spanish: 'Te pagaré cuando haya recibido el dinero.',
            english: 'I\'ll pay you when I have received the money.',
            highlight: ['haya recibido']
          },
          {
            spanish: 'Saldremos cuando hayamos comido.',
            english: 'We\'ll leave when we have eaten.',
            highlight: ['hayamos comido']
          }
        ]
      },
      {
        title: 'Impersonal Expressions',
        content: 'Used after impersonal expressions referring to completed actions:',
        examples: [
          {
            spanish: 'Es posible que haya llovido anoche.',
            english: 'It\'s possible that it rained last night.',
            highlight: ['haya llovido']
          },
          {
            spanish: 'Es importante que hayamos aprendido esto.',
            english: 'It\'s important that we have learned this.',
            highlight: ['hayamos aprendido']
          },
          {
            spanish: 'Es extraño que no hayan llamado.',
            english: 'It\'s strange that they haven\'t called.',
            highlight: ['hayan llamado']
          }
        ]
      }
    ]
  },
  {
    title: 'Perfect Subjunctive vs Present Perfect',
    content: `Understanding when to use perfect subjunctive instead of present perfect indicative.`,
    examples: [
      {
        spanish: 'Indicative: Creo que ha llegado.',
        english: 'I think he has arrived. (certainty)',
        highlight: ['ha llegado']
      },
      {
        spanish: 'Subjunctive: Dudo que haya llegado.',
        english: 'I doubt he has arrived. (uncertainty)',
        highlight: ['haya llegado']
      },
      {
        spanish: 'Indicative: Sé que has estudiado.',
        english: 'I know you have studied. (fact)',
        highlight: ['has estudiado']
      },
      {
        spanish: 'Subjunctive: Espero que hayas estudiado.',
        english: 'I hope you have studied. (desire)',
        highlight: ['hayas estudiado']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Present Perfect', url: '/grammar/spanish/verbs/present-perfect' },
  { title: 'Present Subjunctive', url: '/grammar/spanish/verbs/subjunctive-present' },
  { title: 'Past Participles', url: '/grammar/spanish/verbs/past-participles' }
];

export default function SpanishPerfectSubjunctivePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'subjunctive-perfect',
              title: 'Spanish Perfect Subjunctive',
              description: 'Master the Spanish perfect subjunctive with comprehensive explanations and examples',
              difficulty: 'advanced',
              estimatedTime: 30
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'subjunctive-perfect',
              title: 'Spanish Perfect Subjunctive'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="subjunctive-perfect"
        title="Spanish Perfect Subjunctive"
        description="Master the Spanish perfect subjunctive with comprehensive explanations and examples"
        difficulty="advanced"
        estimatedTime={30}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/subjunctive-perfect/practice"
        quizUrl="/grammar/spanish/verbs/subjunctive-perfect/quiz"
        songUrl="/songs/es?theme=grammar&topic=subjunctive-perfect"
        youtubeVideoId="dQw4w9WgXcQ"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
