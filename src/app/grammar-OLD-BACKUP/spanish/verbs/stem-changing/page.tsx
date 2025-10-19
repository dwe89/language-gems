import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'stem-changing',
  title: 'Spanish Stem-Changing Verbs',
  description: 'Master Spanish stem-changing verbs with comprehensive explanations of e→ie, o→ue, e→i patterns and conjugation rules.',
  difficulty: 'intermediate',
  keywords: [
    'spanish stem changing verbs',
    'verbos con cambio de raíz',
    'e to ie spanish verbs',
    'o to ue spanish verbs',
    'e to i spanish verbs',
    'boot verbs spanish'
  ],
  examples: [
    'Quiero agua (I want water)',
    'Puedes venir (You can come)',
    'Pide ayuda (He asks for help)'
  ]
});

const sections = [
  {
    title: 'What are Spanish Stem-Changing Verbs?',
    content: `Spanish stem-changing verbs (**verbos con cambio de raíz**) are verbs that change their stem vowel in certain conjugations. These changes occur in the stressed syllable and follow predictable patterns. They are also called "boot verbs" because the changes occur in a boot-shaped pattern in conjugation charts.

The three main patterns are: **e→ie**, **o→ue**, and **e→i**.`,
    examples: [
      {
        spanish: 'Quiero café. (querer: e→ie)',
        english: 'I want coffee.',
        highlight: ['Quiero']
      },
      {
        spanish: 'Puede llover. (poder: o→ue)',
        english: 'It might rain.',
        highlight: ['Puede']
      },
      {
        spanish: 'Pide la cuenta. (pedir: e→i)',
        english: 'He asks for the bill.',
        highlight: ['Pide']
      }
    ]
  },
  {
    title: 'E → IE Pattern',
    content: `Verbs with e→ie stem changes affect the stressed 'e' in the stem.`,
    subsections: [
      {
        title: 'Querer (to want) - Present Tense',
        content: 'The stem change occurs in all forms except nosotros and vosotros:',
        conjugationTable: {
          title: 'Querer - Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'quiero', english: 'I want' },
            { pronoun: 'tú', form: 'quieres', english: 'you want' },
            { pronoun: 'él/ella/usted', form: 'quiere', english: 'he/she/you want(s)' },
            { pronoun: 'nosotros', form: 'queremos', english: 'we want' },
            { pronoun: 'vosotros', form: 'queréis', english: 'you all want' },
            { pronoun: 'ellos/ellas/ustedes', form: 'quieren', english: 'they/you all want' }
          ]
        }
      },
      {
        title: 'Common E→IE Verbs',
        content: 'Other frequently used e→ie stem-changing verbs:',
        examples: [
          {
            spanish: 'pensar → pienso',
            english: 'to think → I think',
            highlight: ['pienso']
          },
          {
            spanish: 'empezar → empiezo',
            english: 'to begin → I begin',
            highlight: ['empiezo']
          },
          {
            spanish: 'entender → entiendo',
            english: 'to understand → I understand',
            highlight: ['entiendo']
          },
          {
            spanish: 'cerrar → cierro',
            english: 'to close → I close',
            highlight: ['cierro']
          }
        ]
      }
    ]
  },
  {
    title: 'O → UE Pattern',
    content: `Verbs with o→ue stem changes affect the stressed 'o' in the stem.`,
    subsections: [
      {
        title: 'Poder (to be able) - Present Tense',
        content: 'The stem change occurs in all forms except nosotros and vosotros:',
        conjugationTable: {
          title: 'Poder - Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'puedo', english: 'I can' },
            { pronoun: 'tú', form: 'puedes', english: 'you can' },
            { pronoun: 'él/ella/usted', form: 'puede', english: 'he/she/you can' },
            { pronoun: 'nosotros', form: 'podemos', english: 'we can' },
            { pronoun: 'vosotros', form: 'podéis', english: 'you all can' },
            { pronoun: 'ellos/ellas/ustedes', form: 'pueden', english: 'they/you all can' }
          ]
        }
      },
      {
        title: 'Common O→UE Verbs',
        content: 'Other frequently used o→ue stem-changing verbs:',
        examples: [
          {
            spanish: 'dormir → duermo',
            english: 'to sleep → I sleep',
            highlight: ['duermo']
          },
          {
            spanish: 'volver → vuelvo',
            english: 'to return → I return',
            highlight: ['vuelvo']
          },
          {
            spanish: 'encontrar → encuentro',
            english: 'to find → I find',
            highlight: ['encuentro']
          },
          {
            spanish: 'contar → cuento',
            english: 'to count/tell → I count/tell',
            highlight: ['cuento']
          }
        ]
      }
    ]
  },
  {
    title: 'E → I Pattern',
    content: `The e→i pattern occurs only in -ir verbs and affects the stressed 'e' in the stem.`,
    subsections: [
      {
        title: 'Pedir (to ask for) - Present Tense',
        content: 'The stem change occurs in all forms except nosotros and vosotros:',
        conjugationTable: {
          title: 'Pedir - Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'pido', english: 'I ask for' },
            { pronoun: 'tú', form: 'pides', english: 'you ask for' },
            { pronoun: 'él/ella/usted', form: 'pide', english: 'he/she/you ask(s) for' },
            { pronoun: 'nosotros', form: 'pedimos', english: 'we ask for' },
            { pronoun: 'vosotros', form: 'pedís', english: 'you all ask for' },
            { pronoun: 'ellos/ellas/ustedes', form: 'piden', english: 'they/you all ask for' }
          ]
        }
      },
      {
        title: 'Common E→I Verbs',
        content: 'Other frequently used e→i stem-changing verbs:',
        examples: [
          {
            spanish: 'servir → sirvo',
            english: 'to serve → I serve',
            highlight: ['sirvo']
          },
          {
            spanish: 'repetir → repito',
            english: 'to repeat → I repeat',
            highlight: ['repito']
          },
          {
            spanish: 'seguir → sigo',
            english: 'to follow → I follow',
            highlight: ['sigo']
          }
        ]
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future', difficulty: 'intermediate' },
  { title: 'Gerunds', url: '/grammar/spanish/verbs/gerunds', difficulty: 'intermediate' },
  { title: 'Negation', url: '/grammar/spanish/verbs/negation', difficulty: 'beginner' },
  { title: 'Irregular Verbs', url: '/grammar/spanish/verbs/irregular-verbs', difficulty: 'intermediate' }
];

export default function SpanishStemChangingVerbsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'stem-changing',
              title: 'Spanish Stem-Changing Verbs',
              description: 'Master Spanish stem-changing verbs with comprehensive explanations and examples',
              difficulty: 'intermediate',
              estimatedTime: 30
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'stem-changing',
              title: 'Spanish Stem-Changing Verbs'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="stem-changing"
        title="Spanish Stem-Changing Verbs"
        description="Master Spanish stem-changing verbs with comprehensive explanations and examples"
        difficulty="intermediate"
        estimatedTime={30}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/stem-changing/practice"
        quizUrl="/grammar/spanish/verbs/stem-changing/quiz"
        songUrl="/songs/es?theme=grammar&topic=stem-changing"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
