import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'gerunds',
  title: 'Spanish Gerunds',
  description: 'Master Spanish gerunds (present participles) with comprehensive explanations, formation rules, and usage examples.',
  difficulty: 'intermediate',
  keywords: [
    'spanish gerunds',
    'present participles spanish',
    'gerundio español',
    'spanish -ando -iendo',
    'spanish grammar gerunds'
  ],
  examples: [
    'Estoy hablando (I am speaking)',
    'Corriendo rápido (Running fast)',
    'Leyendo un libro (Reading a book)'
  ]
});

const sections = [
  {
    title: 'What are Spanish Gerunds?',
    content: `Spanish gerunds (**gerundios**) are the equivalent of English present participles (words ending in -ing). They are used to form continuous tenses, express manner, and describe ongoing actions. Spanish gerunds are formed by adding **-ando** to -ar verbs and **-iendo** to -er and -ir verbs.

Unlike English, Spanish gerunds are never used as nouns - for that, Spanish uses infinitives.`,
    examples: [
      {
        spanish: 'Estoy estudiando español.',
        english: 'I am studying Spanish.',
        highlight: ['estudiando']
      },
      {
        spanish: 'Llegó corriendo.',
        english: 'He arrived running.',
        highlight: ['corriendo']
      },
      {
        spanish: 'Aprendemos practicando.',
        english: 'We learn by practicing.',
        highlight: ['practicando']
      }
    ]
  },
  {
    title: 'Formation of Gerunds',
    content: `Spanish gerunds follow regular formation patterns based on the verb's infinitive ending.`,
    subsections: [
      {
        title: 'Regular Formation',
        content: 'Add the appropriate ending to the verb stem:',
        conjugationTable: {
          title: 'Gerund Formation',
          conjugations: [
            { pronoun: '-ar verbs', form: 'stem + -ando', english: 'hablar → hablando' },
            { pronoun: '-er verbs', form: 'stem + -iendo', english: 'comer → comiendo' },
            { pronoun: '-ir verbs', form: 'stem + -iendo', english: 'vivir → viviendo' }
          ]
        }
      },
      {
        title: 'Irregular Gerunds',
        content: 'Some verbs have irregular gerund forms:',
        examples: [
          {
            spanish: 'ir → yendo',
            english: 'going',
            highlight: ['yendo']
          },
          {
            spanish: 'poder → pudiendo',
            english: 'being able',
            highlight: ['pudiendo']
          },
          {
            spanish: 'venir → viniendo',
            english: 'coming',
            highlight: ['viniendo']
          },
          {
            spanish: 'decir → diciendo',
            english: 'saying',
            highlight: ['diciendo']
          }
        ]
      },
      {
        title: 'Stem-Changing Verbs',
        content: 'Some -ir verbs change their stem in the gerund:',
        examples: [
          {
            spanish: 'dormir → durmiendo (o→u)',
            english: 'sleeping',
            highlight: ['durmiendo']
          },
          {
            spanish: 'pedir → pidiendo (e→i)',
            english: 'asking for',
            highlight: ['pidiendo']
          },
          {
            spanish: 'sentir → sintiendo (e→i)',
            english: 'feeling',
            highlight: ['sintiendo']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses of Gerunds',
    content: `Spanish gerunds have several important uses in the language.`,
    subsections: [
      {
        title: 'Continuous Tenses',
        content: 'Used with estar to form continuous tenses:',
        examples: [
          {
            spanish: 'Estoy trabajando.',
            english: 'I am working.',
            highlight: ['Estoy trabajando']
          },
          {
            spanish: 'Estaba durmiendo.',
            english: 'I was sleeping.',
            highlight: ['Estaba durmiendo']
          }
        ]
      },
      {
        title: 'Manner or Method',
        content: 'Expressing how something is done:',
        examples: [
          {
            spanish: 'Aprendió español viviendo en México.',
            english: 'He learned Spanish by living in Mexico.',
            highlight: ['viviendo']
          },
          {
            spanish: 'Salió corriendo de la casa.',
            english: 'He left the house running.',
            highlight: ['corriendo']
          }
        ]
      },
      {
        title: 'Simultaneous Actions',
        content: 'Describing actions happening at the same time:',
        examples: [
          {
            spanish: 'Caminando por la calle, vi a mi amigo.',
            english: 'Walking down the street, I saw my friend.',
            highlight: ['Caminando']
          },
          {
            spanish: 'Estudiando mucho, pasó el examen.',
            english: 'By studying hard, he passed the exam.',
            highlight: ['Estudiando']
          }
        ]
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Ser vs Estar', url: '/grammar/spanish/verbs/ser-vs-estar', difficulty: 'beginner' },
  { title: 'Imperative', url: '/grammar/spanish/verbs/imperative', difficulty: 'intermediate' },
  { title: 'Stem-changing Verbs', url: '/grammar/spanish/verbs/stem-changing', difficulty: 'intermediate' },
  { title: 'Subjunctive Imperfect', url: '/grammar/spanish/verbs/subjunctive-imperfect', difficulty: 'advanced' }
];

export default function SpanishGerundsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'gerunds',
              title: 'Spanish Gerunds',
              description: 'Master Spanish gerunds with comprehensive explanations and examples',
              difficulty: 'intermediate',
              estimatedTime: 20
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'gerunds',
              title: 'Spanish Gerunds'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="gerunds"
        title="Spanish Gerunds"
        description="Master Spanish gerunds with comprehensive explanations and examples"
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/gerunds/practice"
        quizUrl="/grammar/spanish/verbs/gerunds/quiz"
        songUrl="/songs/es?theme=grammar&topic=gerunds"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
