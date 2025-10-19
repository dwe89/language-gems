import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'subjunctive-imperfect',
  title: 'Spanish Imperfect Subjunctive',
  description: 'Master the Spanish imperfect subjunctive with comprehensive explanations, formation rules, and usage examples.',
  difficulty: 'advanced',
  keywords: [
    'spanish imperfect subjunctive',
    'imperfecto de subjuntivo',
    'subjunctive past',
    'si clauses spanish',
    'subjunctive -ra -se endings'
  ],
  examples: [
    'Si tuviera dinero, viajaría por el mundo (If I had money, I would travel the world)',
    'Quería que vinieras a la fiesta (I wanted you to come to the party)',
    'Como si fuera fácil (As if it were easy)'
  ]
});

const sections = [
  {
    title: 'What is the Spanish Imperfect Subjunctive?',
    content: `The Spanish imperfect subjunctive (**imperfecto de subjuntivo**) is used to express past subjunctive actions, hypothetical situations, and polite requests. It has two forms: the -ra form and the -se form, which are generally interchangeable.

This tense is essential for expressing "si" (if) clauses, past desires, and hypothetical situations.`,
    examples: [
      {
        spanish: 'Si estudiara más, sacaría mejores notas.',
        english: 'If I studied more, I would get better grades.',
        highlight: ['estudiara']
      },
      {
        spanish: 'Quería que vinieras conmigo.',
        english: 'I wanted you to come with me.',
        highlight: ['vinieras']
      },
      {
        spanish: 'Ojalá tuviera más tiempo.',
        english: 'I wish I had more time.',
        highlight: ['tuviera']
      }
    ]
  },
  {
    title: 'Formation of the Imperfect Subjunctive',
    content: `The imperfect subjunctive is formed from the third person plural (ellos) form of the preterite tense.`,
    subsections: [
      {
        title: 'Formation Steps',
        content: '1. Take the ellos form of the preterite\n2. Remove the -ron ending\n3. Add the imperfect subjunctive endings',
        examples: [
          {
            spanish: 'hablar → hablaron → habla- → hablara/hablase',
            english: 'to speak',
            highlight: ['hablara']
          },
          {
            spanish: 'comer → comieron → comie- → comiera/comiese',
            english: 'to eat',
            highlight: ['comiera']
          },
          {
            spanish: 'vivir → vivieron → vivie- → viviera/viviese',
            english: 'to live',
            highlight: ['viviera']
          }
        ]
      },
      {
        title: '-RA Form Conjugation',
        content: 'The -ra form (more common in Latin America):',
        conjugationTable: {
          title: 'Hablar - Imperfect Subjunctive (-ra)',
          conjugations: [
            { pronoun: 'yo', form: 'hablara', english: 'I spoke' },
            { pronoun: 'tú', form: 'hablaras', english: 'you spoke' },
            { pronoun: 'él/ella/usted', form: 'hablara', english: 'he/she/you spoke' },
            { pronoun: 'nosotros', form: 'habláramos', english: 'we spoke' },
            { pronoun: 'vosotros', form: 'hablarais', english: 'you all spoke' },
            { pronoun: 'ellos/ellas/ustedes', form: 'hablaran', english: 'they/you all spoke' }
          ]
        }
      },
      {
        title: '-SE Form Conjugation',
        content: 'The -se form (more common in Spain):',
        conjugationTable: {
          title: 'Hablar - Imperfect Subjunctive (-se)',
          conjugations: [
            { pronoun: 'yo', form: 'hablase', english: 'I spoke' },
            { pronoun: 'tú', form: 'hablases', english: 'you spoke' },
            { pronoun: 'él/ella/usted', form: 'hablase', english: 'he/she/you spoke' },
            { pronoun: 'nosotros', form: 'hablásemos', english: 'we spoke' },
            { pronoun: 'vosotros', form: 'hablaseis', english: 'you all spoke' },
            { pronoun: 'ellos/ellas/ustedes', form: 'hablasen', english: 'they/you all spoke' }
          ]
        }
      }
    ]
  },
  {
    title: 'Uses of the Imperfect Subjunctive',
    content: `The imperfect subjunctive has several important uses in Spanish.`,
    subsections: [
      {
        title: 'Si Clauses (Hypothetical Situations)',
        content: 'Used in "si" clauses to express hypothetical or contrary-to-fact situations:',
        examples: [
          {
            spanish: 'Si tuviera dinero, compraría una casa.',
            english: 'If I had money, I would buy a house.',
            highlight: ['Si tuviera']
          },
          {
            spanish: 'Si fuera rico, viajaría por el mundo.',
            english: 'If I were rich, I would travel the world.',
            highlight: ['Si fuera']
          },
          {
            spanish: 'Si estudiaras más, aprobarías el examen.',
            english: 'If you studied more, you would pass the exam.',
            highlight: ['Si estudiaras']
          }
        ]
      },
      {
        title: 'Past Subjunctive Context',
        content: 'Used when the main clause is in the past and requires subjunctive:',
        examples: [
          {
            spanish: 'Quería que vinieras a la fiesta.',
            english: 'I wanted you to come to the party.',
            highlight: ['que vinieras']
          },
          {
            spanish: 'Era importante que estudiaras.',
            english: 'It was important that you studied.',
            highlight: ['que estudiaras']
          },
          {
            spanish: 'Dudaba que fuera verdad.',
            english: 'I doubted that it was true.',
            highlight: ['que fuera']
          }
        ]
      },
      {
        title: 'Polite Requests and Wishes',
        content: 'Used for polite requests and expressing wishes:',
        examples: [
          {
            spanish: 'Quisiera un café, por favor.',
            english: 'I would like a coffee, please.',
            highlight: ['Quisiera']
          },
          {
            spanish: 'Ojalá tuviera más tiempo.',
            english: 'I wish I had more time.',
            highlight: ['tuviera']
          },
          {
            spanish: '¿Pudieras ayudarme?',
            english: 'Could you help me?',
            highlight: ['Pudieras']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Irregular Forms',
    content: `Important irregular imperfect subjunctive forms to memorize.`,
    examples: [
      {
        spanish: 'ser/ir → fuera, fueras, fuera, fuéramos, fuerais, fueran',
        english: 'to be / to go',
        highlight: ['fuera']
      },
      {
        spanish: 'tener → tuviera, tuvieras, tuviera, tuviéramos, tuvierais, tuvieran',
        english: 'to have',
        highlight: ['tuviera']
      },
      {
        spanish: 'hacer → hiciera, hicieras, hiciera, hiciéramos, hicierais, hicieran',
        english: 'to do/make',
        highlight: ['hiciera']
      },
      {
        spanish: 'poder → pudiera, pudieras, pudiera, pudiéramos, pudierais, pudieran',
        english: 'to be able',
        highlight: ['pudiera']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Subjunctive Present', url: '/grammar/spanish/verbs/subjunctive-present', difficulty: 'advanced' },
  { title: 'Ser vs Estar', url: '/grammar/spanish/verbs/ser-vs-estar', difficulty: 'beginner' },
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future', difficulty: 'intermediate' },
  { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect', difficulty: 'intermediate' }
];

export default function SpanishImperfectSubjunctivePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'subjunctive-imperfect',
              title: 'Spanish Imperfect Subjunctive',
              description: 'Master the Spanish imperfect subjunctive with comprehensive explanations and examples',
              difficulty: 'advanced',
              estimatedTime: 35
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'subjunctive-imperfect',
              title: 'Spanish Imperfect Subjunctive'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="subjunctive-imperfect"
        title="Spanish Imperfect Subjunctive"
        description="Master the Spanish imperfect subjunctive with comprehensive explanations and examples"
        difficulty="advanced"
        estimatedTime={35}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/subjunctive-imperfect/practice"
        quizUrl="/grammar/spanish/verbs/subjunctive-imperfect/quiz"
        songUrl="/songs/es?theme=grammar&topic=subjunctive-imperfect"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
