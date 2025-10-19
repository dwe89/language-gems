import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'compound-tenses',
  title: 'Spanish Compound Tenses',
  description: 'Master Spanish compound tenses with comprehensive explanations of perfect tenses using haber + past participle.',
  difficulty: 'advanced',
  keywords: [
    'spanish compound tenses',
    'perfect tenses spanish',
    'haber + past participle',
    'spanish perfect tenses',
    'compound verb forms'
  ],
  examples: [
    'He comido paella (I have eaten paella)',
    'Había estudiado antes del examen (I had studied before the exam)',
    'Habré terminado para las cinco (I will have finished by five)'
  ]
});

const sections = [
  {
    title: 'What are Spanish Compound Tenses?',
    content: `Spanish compound tenses are formed using the auxiliary verb **haber** (to have) + past participle. These tenses express completed actions and are essential for advanced Spanish communication.

Compound tenses allow speakers to express complex time relationships and are used frequently in both spoken and written Spanish.`,
    examples: [
      {
        spanish: 'He visitado España tres veces.',
        english: 'I have visited Spain three times.',
        highlight: ['He visitado']
      },
      {
        spanish: 'Cuando llegué, ya habían cenado.',
        english: 'When I arrived, they had already had dinner.',
        highlight: ['habían cenado']
      },
      {
        spanish: 'Para mañana habré terminado el proyecto.',
        english: 'By tomorrow I will have finished the project.',
        highlight: ['habré terminado']
      }
    ]
  },
  {
    title: 'Formation of Compound Tenses',
    content: `All compound tenses follow the same pattern: conjugated form of haber + past participle.`,
    subsections: [
      {
        title: 'Past Participle Formation',
        content: 'Regular past participles are formed by adding -ado to -ar verbs and -ido to -er/-ir verbs:',
        examples: [
          {
            spanish: 'hablar → hablado (spoken)',
            english: 'to speak → spoken',
            highlight: ['hablado']
          },
          {
            spanish: 'comer → comido (eaten)',
            english: 'to eat → eaten',
            highlight: ['comido']
          },
          {
            spanish: 'vivir → vivido (lived)',
            english: 'to live → lived',
            highlight: ['vivido']
          }
        ]
      },
      {
        title: 'Irregular Past Participles',
        content: 'Common irregular past participles that must be memorized:',
        examples: [
          {
            spanish: 'abrir → abierto (opened)',
            english: 'to open → opened',
            highlight: ['abierto']
          },
          {
            spanish: 'escribir → escrito (written)',
            english: 'to write → written',
            highlight: ['escrito']
          },
          {
            spanish: 'hacer → hecho (done/made)',
            english: 'to do/make → done/made',
            highlight: ['hecho']
          },
          {
            spanish: 'ver → visto (seen)',
            english: 'to see → seen',
            highlight: ['visto']
          }
        ]
      }
    ]
  },
  {
    title: 'Perfect Tenses Overview',
    content: `The main compound tenses in Spanish and their uses.`,
    subsections: [
      {
        title: 'Present Perfect (Pretérito Perfecto)',
        content: 'Present tense of haber + past participle:',
        conjugationTable: {
          title: 'Present Perfect - Hablar',
          conjugations: [
            { pronoun: 'yo', form: 'he hablado', english: 'I have spoken' },
            { pronoun: 'tú', form: 'has hablado', english: 'you have spoken' },
            { pronoun: 'él/ella/usted', form: 'ha hablado', english: 'he/she/you have spoken' },
            { pronoun: 'nosotros', form: 'hemos hablado', english: 'we have spoken' },
            { pronoun: 'vosotros', form: 'habéis hablado', english: 'you all have spoken' },
            { pronoun: 'ellos/ellas/ustedes', form: 'han hablado', english: 'they/you all have spoken' }
          ]
        }
      },
      {
        title: 'Pluperfect (Pluscuamperfecto)',
        content: 'Imperfect tense of haber + past participle:',
        examples: [
          {
            spanish: 'Había terminado cuando llegaste.',
            english: 'I had finished when you arrived.',
            highlight: ['Había terminado']
          },
          {
            spanish: 'Habíamos comido antes de salir.',
            english: 'We had eaten before leaving.',
            highlight: ['Habíamos comido']
          }
        ]
      },
      {
        title: 'Future Perfect (Futuro Perfecto)',
        content: 'Future tense of haber + past participle:',
        examples: [
          {
            spanish: 'Habré estudiado para el examen.',
            english: 'I will have studied for the exam.',
            highlight: ['Habré estudiado']
          },
          {
            spanish: 'Habrán llegado para las ocho.',
            english: 'They will have arrived by eight.',
            highlight: ['Habrán llegado']
          }
        ]
      }
    ]
  },
  {
    title: 'Subjunctive Compound Tenses',
    content: `Compound tenses also exist in the subjunctive mood.`,
    examples: [
      {
        spanish: 'Present Perfect Subjunctive: haya hablado',
        english: 'Espero que hayas terminado.',
        highlight: ['hayas terminado']
      },
      {
        spanish: 'Pluperfect Subjunctive: hubiera/hubiese hablado',
        english: 'Si hubiera sabido, habría venido.',
        highlight: ['hubiera sabido']
      },
      {
        spanish: 'Conditional Perfect: habría hablado',
        english: 'Habría ido si hubiera tenido tiempo.',
        highlight: ['Habría ido']
      }
    ]
  },
  {
    title: 'Usage Rules and Tips',
    content: `Important rules for using compound tenses correctly.`,
    examples: [
      {
        spanish: 'Past participle never changes in compound tenses',
        english: 'He comido, Has comido, Ha comido',
        highlight: ['comido']
      },
      {
        spanish: 'Nothing can separate haber and past participle',
        english: 'He siempre estudiado ❌ → Siempre he estudiado ✅',
        highlight: ['Siempre he estudiado']
      },
      {
        spanish: 'Object pronouns go before haber',
        english: 'Lo he visto (I have seen it)',
        highlight: ['Lo he visto']
      },
      {
        spanish: 'Reflexive pronouns also go before haber',
        english: 'Me he levantado (I have gotten up)',
        highlight: ['Me he levantado']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Past Participles', url: '/grammar/spanish/verbs/past-participles', difficulty: 'intermediate' },
  { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect', difficulty: 'intermediate' },
  { title: 'Modal Verbs', url: '/grammar/spanish/verbs/modal-verbs', difficulty: 'intermediate' },
  { title: 'Por vs Para', url: '/grammar/spanish/verbs/por-vs-para', difficulty: 'intermediate' }
];

export default function SpanishCompoundTensesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'compound-tenses',
              title: 'Spanish Compound Tenses',
              description: 'Master Spanish compound tenses with comprehensive explanations and examples',
              difficulty: 'advanced',
              estimatedTime: 30
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'compound-tenses',
              title: 'Spanish Compound Tenses'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="compound-tenses"
        title="Spanish Compound Tenses"
        description="Master Spanish compound tenses with comprehensive explanations and examples"
        difficulty="advanced"
        estimatedTime={30}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/compound-tenses/practice"
        quizUrl="/grammar/spanish/verbs/compound-tenses/quiz"
        songUrl="/songs/es?theme=grammar&topic=compound-tenses"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
