import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'conditional-perfect',
  title: 'Spanish Conditional Perfect Tense',
  description: 'Master the Spanish conditional perfect tense with comprehensive explanations, formation rules, and usage examples.',
  difficulty: 'advanced',
  keywords: [
    'spanish conditional perfect',
    'condicional perfecto',
    'habría hablado',
    'spanish compound tenses',
    'conditional perfect conjugation'
  ],
  examples: [
    'Habría estudiado más si hubiera tenido tiempo (I would have studied more if I had had time)',
    'Habrían llegado antes si no hubiera llovido (They would have arrived earlier if it hadn\'t rained)',
    'Me habría gustado ir contigo (I would have liked to go with you)'
  ]
});

const sections = [
  {
    title: 'What is the Spanish Conditional Perfect?',
    content: `The Spanish conditional perfect tense (**condicional perfecto**) expresses actions that would have been completed under certain conditions. It is formed using the conditional tense of **haber** + past participle.

This tense is essential for expressing hypothetical situations in the past and is commonly used with "si" (if) clauses.`,
    examples: [
      {
        spanish: 'Si hubiera sabido, habría venido antes.',
        english: 'If I had known, I would have come earlier.',
        highlight: ['habría venido']
      },
      {
        spanish: 'Habrías entendido mejor con más práctica.',
        english: 'You would have understood better with more practice.',
        highlight: ['Habrías entendido']
      },
      {
        spanish: 'Nos habríamos divertido mucho en la fiesta.',
        english: 'We would have had a lot of fun at the party.',
        highlight: ['habríamos divertido']
      }
    ]
  },
  {
    title: 'Formation of the Conditional Perfect',
    content: `The conditional perfect is formed with the conditional tense of haber + past participle.`,
    subsections: [
      {
        title: 'Conjugation of Haber (Conditional)',
        content: 'The auxiliary verb haber in the conditional tense:',
        conjugationTable: {
          title: 'Haber - Conditional Tense',
          conjugations: [
            { pronoun: 'yo', form: 'habría', english: 'I would have' },
            { pronoun: 'tú', form: 'habrías', english: 'you would have' },
            { pronoun: 'él/ella/usted', form: 'habría', english: 'he/she/you would have' },
            { pronoun: 'nosotros', form: 'habríamos', english: 'we would have' },
            { pronoun: 'vosotros', form: 'habríais', english: 'you all would have' },
            { pronoun: 'ellos/ellas/ustedes', form: 'habrían', english: 'they/you all would have' }
          ]
        }
      },
      {
        title: 'Complete Conditional Perfect Conjugation',
        content: 'Example with hablar (to speak):',
        conjugationTable: {
          title: 'Hablar - Conditional Perfect',
          conjugations: [
            { pronoun: 'yo', form: 'habría hablado', english: 'I would have spoken' },
            { pronoun: 'tú', form: 'habrías hablado', english: 'you would have spoken' },
            { pronoun: 'él/ella/usted', form: 'habría hablado', english: 'he/she/you would have spoken' },
            { pronoun: 'nosotros', form: 'habríamos hablado', english: 'we would have spoken' },
            { pronoun: 'vosotros', form: 'habríais hablado', english: 'you all would have spoken' },
            { pronoun: 'ellos/ellas/ustedes', form: 'habrían hablado', english: 'they/you all would have spoken' }
          ]
        }
      }
    ]
  },
  {
    title: 'Uses of the Conditional Perfect',
    content: `The conditional perfect has several specific uses in Spanish.`,
    subsections: [
      {
        title: 'Hypothetical Past Situations',
        content: 'The main use - expressing what would have happened under different circumstances:',
        examples: [
          {
            spanish: 'Si hubiera estudiado, habría aprobado el examen.',
            english: 'If I had studied, I would have passed the exam.',
            highlight: ['habría aprobado']
          },
          {
            spanish: 'Con más dinero, habríamos viajado por Europa.',
            english: 'With more money, we would have traveled through Europe.',
            highlight: ['habríamos viajado']
          }
        ]
      },
      {
        title: 'Polite Expressions and Regrets',
        content: 'Used to express polite wishes or regrets about the past:',
        examples: [
          {
            spanish: 'Me habría gustado conocerte antes.',
            english: 'I would have liked to meet you earlier.',
            highlight: ['habría gustado']
          },
          {
            spanish: 'Habríamos preferido quedarnos en casa.',
            english: 'We would have preferred to stay home.',
            highlight: ['Habríamos preferido']
          }
        ]
      },
      {
        title: 'Reported Speech in the Past',
        content: 'Used in reported speech to express what someone said would have happened:',
        examples: [
          {
            spanish: 'Dijo que habría terminado para las cinco.',
            english: 'He said he would have finished by five.',
            highlight: ['habría terminado']
          },
          {
            spanish: 'Pensé que habrían llegado ya.',
            english: 'I thought they would have arrived already.',
            highlight: ['habrían llegado']
          }
        ]
      }
    ]
  },
  {
    title: 'Conditional Perfect with Si Clauses',
    content: `The conditional perfect is commonly used with "si" clauses to express unreal past conditions.`,
    examples: [
      {
        spanish: 'Si + pluperfect subjunctive, conditional perfect',
        english: 'Si hubiera llovido, habríamos cancelado el picnic.',
        highlight: ['Si hubiera llovido', 'habríamos cancelado']
      },
      {
        spanish: 'Conditional perfect + si + pluperfect subjunctive',
        english: 'Habría ido contigo si me hubieras invitado.',
        highlight: ['Habría ido', 'si me hubieras invitado']
      },
      {
        spanish: 'Mixed time references',
        english: 'Si hubiera estudiado más, ahora sería médico.',
        highlight: ['Si hubiera estudiado', 'ahora sería']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Conditional Tense', url: '/grammar/spanish/verbs/conditional' },
  { title: 'Pluperfect Subjunctive', url: '/grammar/spanish/verbs/subjunctive' },
  { title: 'Si Clauses', url: '/grammar/spanish/verbs/conditional' }
];

export default function SpanishConditionalPerfectPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'conditional-perfect',
              title: 'Spanish Conditional Perfect Tense',
              description: 'Master the Spanish conditional perfect tense with comprehensive explanations and examples',
              difficulty: 'advanced',
              estimatedTime: 30
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'conditional-perfect',
              title: 'Spanish Conditional Perfect Tense'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="conditional-perfect"
        title="Spanish Conditional Perfect Tense"
        description="Master the Spanish conditional perfect tense with comprehensive explanations and examples"
        difficulty="advanced"
        estimatedTime={30}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/conditional-perfect/practice"
        quizUrl="/grammar/spanish/verbs/conditional-perfect/quiz"
        songUrl="/songs/es?theme=grammar&topic=conditional-perfect"
        youtubeVideoId="dQw4w9WgXcQ"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
