import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'reported-speech',
  title: 'Spanish Reported Speech',
  description: 'Master Spanish reported speech (indirect speech) with comprehensive explanations of tense changes and usage examples.',
  difficulty: 'advanced',
  keywords: [
    'spanish reported speech',
    'indirect speech spanish',
    'estilo indirecto',
    'spanish tense changes',
    'reported speech spanish grammar'
  ],
  examples: [
    'Direct: "Estoy cansado" → Indirect: Dijo que estaba cansado',
    'Direct: "Vendré mañana" → Indirect: Dijo que vendría mañana',
    'Direct: "¿Dónde vives?" → Indirect: Me preguntó dónde vivía'
  ]
});

const sections = [
  {
    title: 'What is Spanish Reported Speech?',
    content: `Spanish reported speech (**estilo indirecto**) is used to report what someone else said without using their exact words. It involves changing the tense, pronouns, and time expressions from the original statement.

Reported speech is essential for storytelling, news reporting, and everyday conversation when we want to tell others what someone said.`,
    examples: [
      {
        spanish: 'Direct: María dice: "Tengo hambre."',
        english: 'Direct: María says: "I am hungry."',
        highlight: ['Tengo hambre']
      },
      {
        spanish: 'Indirect: María dice que tiene hambre.',
        english: 'Indirect: María says that she is hungry.',
        highlight: ['dice que tiene']
      },
      {
        spanish: 'Direct: Juan dijo: "Iré mañana."',
        english: 'Direct: Juan said: "I will go tomorrow."',
        highlight: ['Iré mañana']
      },
      {
        spanish: 'Indirect: Juan dijo que iría mañana.',
        english: 'Indirect: Juan said that he would go tomorrow.',
        highlight: ['dijo que iría']
      }
    ]
  },
  {
    title: 'Reporting Verbs',
    content: `Common verbs used to introduce reported speech in Spanish.`,
    subsections: [
      {
        title: 'Present Reporting Verbs',
        content: 'When the reporting verb is in the present, tenses usually don\'t change:',
        examples: [
          {
            spanish: 'dice que (says that)',
            english: 'María dice que está cansada.',
            highlight: ['dice que está']
          },
          {
            spanish: 'afirma que (affirms that)',
            english: 'El profesor afirma que el examen es fácil.',
            highlight: ['afirma que es']
          },
          {
            spanish: 'pregunta si/qué/dónde (asks if/what/where)',
            english: 'Me pregunta si vengo mañana.',
            highlight: ['pregunta si vengo']
          }
        ]
      },
      {
        title: 'Past Reporting Verbs',
        content: 'When the reporting verb is in the past, tenses usually change:',
        examples: [
          {
            spanish: 'dijo que (said that)',
            english: 'Ana dijo que tenía frío.',
            highlight: ['dijo que tenía']
          },
          {
            spanish: 'explicó que (explained that)',
            english: 'El médico explicó que era normal.',
            highlight: ['explicó que era']
          },
          {
            spanish: 'preguntó si/qué/dónde (asked if/what/where)',
            english: 'Me preguntó si había comido.',
            highlight: ['preguntó si había comido']
          }
        ]
      }
    ]
  },
  {
    title: 'Tense Changes in Reported Speech',
    content: `When the reporting verb is in the past, the tenses in the reported clause usually change.`,
    subsections: [
      {
        title: 'Present → Imperfect',
        content: 'Present tense changes to imperfect:',
        examples: [
          {
            spanish: 'Direct: "Vivo en Madrid."',
            english: 'Direct: "I live in Madrid."',
            highlight: ['Vivo']
          },
          {
            spanish: 'Indirect: Dijo que vivía en Madrid.',
            english: 'Indirect: He said he lived in Madrid.',
            highlight: ['vivía']
          }
        ]
      },
      {
        title: 'Preterite → Pluperfect',
        content: 'Preterite tense changes to pluperfect:',
        examples: [
          {
            spanish: 'Direct: "Llegué ayer."',
            english: 'Direct: "I arrived yesterday."',
            highlight: ['Llegué']
          },
          {
            spanish: 'Indirect: Dijo que había llegado ayer.',
            english: 'Indirect: He said he had arrived yesterday.',
            highlight: ['había llegado']
          }
        ]
      },
      {
        title: 'Future → Conditional',
        content: 'Future tense changes to conditional:',
        examples: [
          {
            spanish: 'Direct: "Iré mañana."',
            english: 'Direct: "I will go tomorrow."',
            highlight: ['Iré']
          },
          {
            spanish: 'Indirect: Dijo que iría mañana.',
            english: 'Indirect: He said he would go tomorrow.',
            highlight: ['iría']
          }
        ]
      },
      {
        title: 'Present Perfect → Pluperfect',
        content: 'Present perfect changes to pluperfect:',
        examples: [
          {
            spanish: 'Direct: "He terminado el trabajo."',
            english: 'Direct: "I have finished the work."',
            highlight: ['He terminado']
          },
          {
            spanish: 'Indirect: Dijo que había terminado el trabajo.',
            english: 'Indirect: He said he had finished the work.',
            highlight: ['había terminado']
          }
        ]
      }
    ]
  },
  {
    title: 'Reporting Questions',
    content: `Different types of questions require different structures in reported speech.`,
    subsections: [
      {
        title: 'Yes/No Questions',
        content: 'Use "si" (if/whether) to report yes/no questions:',
        examples: [
          {
            spanish: 'Direct: "¿Vienes mañana?"',
            english: 'Direct: "Are you coming tomorrow?"',
            highlight: ['¿Vienes mañana?']
          },
          {
            spanish: 'Indirect: Me preguntó si venía mañana.',
            english: 'Indirect: He asked me if I was coming tomorrow.',
            highlight: ['si venía']
          }
        ]
      },
      {
        title: 'Wh- Questions',
        content: 'Use the same question word but without question marks:',
        examples: [
          {
            spanish: 'Direct: "¿Dónde vives?"',
            english: 'Direct: "Where do you live?"',
            highlight: ['¿Dónde vives?']
          },
          {
            spanish: 'Indirect: Me preguntó dónde vivía.',
            english: 'Indirect: He asked me where I lived.',
            highlight: ['dónde vivía']
          },
          {
            spanish: 'Direct: "¿Qué quieres?"',
            english: 'Direct: "What do you want?"',
            highlight: ['¿Qué quieres?']
          },
          {
            spanish: 'Indirect: Me preguntó qué quería.',
            english: 'Indirect: He asked me what I wanted.',
            highlight: ['qué quería']
          }
        ]
      }
    ]
  },
  {
    title: 'Changes in Pronouns and Time Expressions',
    content: `Pronouns and time expressions often change in reported speech.`,
    examples: [
      {
        spanish: 'Pronouns: "Yo" → él/ella, "tú" → yo',
        english: 'Direct: "Yo tengo tu libro" → Dijo que él tenía mi libro',
        highlight: ['él tenía mi libro']
      },
      {
        spanish: 'Time: "hoy" → ese día, "mañana" → al día siguiente',
        english: 'Direct: "Vendré mañana" → Dijo que vendría al día siguiente',
        highlight: ['al día siguiente']
      },
      {
        spanish: 'Time: "ayer" → el día anterior, "ahora" → entonces',
        english: 'Direct: "Llegué ayer" → Dijo que había llegado el día anterior',
        highlight: ['el día anterior']
      },
      {
        spanish: 'Place: "aquí" → allí, "este" → ese/aquel',
        english: 'Direct: "Vivo aquí" → Dijo que vivía allí',
        highlight: ['vivía allí']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect' },
  { title: 'Conditional Tense', url: '/grammar/spanish/verbs/conditional' },
  { title: 'Pluperfect Tense', url: '/grammar/spanish/verbs/pluperfect' }
];

export default function SpanishReportedSpeechPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'reported-speech',
              title: 'Spanish Reported Speech',
              description: 'Master Spanish reported speech with comprehensive explanations and examples',
              difficulty: 'advanced',
              estimatedTime: 35
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'reported-speech',
              title: 'Spanish Reported Speech'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="reported-speech"
        title="Spanish Reported Speech"
        description="Master Spanish reported speech with comprehensive explanations and examples"
        difficulty="advanced"
        estimatedTime={35}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/reported-speech/practice"
        quizUrl="/grammar/spanish/verbs/reported-speech/quiz"
        songUrl="/songs/es?theme=grammar&topic=reported-speech"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
