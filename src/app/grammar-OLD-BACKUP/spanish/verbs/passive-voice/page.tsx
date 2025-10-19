import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'passive-voice',
  title: 'Spanish Passive Voice',
  description: 'Master the Spanish passive voice with ser + past participle and reflexive passive constructions. Learn when and how to use each form.',
  difficulty: 'advanced',
  keywords: [
    'spanish passive voice',
    'ser past participle',
    'reflexive passive spanish',
    'voz pasiva española',
    'spanish grammar advanced'
  ],
  examples: [
    'La casa fue construida en 1990 (The house was built in 1990)',
    'Se habla español aquí (Spanish is spoken here)',
    'El libro fue escrito por García Márquez (The book was written by García Márquez)'
  ]
});

const sections = [
  {
    title: 'What is the Spanish Passive Voice?',
    content: `The Spanish passive voice (**voz pasiva**) is used when the focus is on the action or the recipient of the action rather than who performs it. Spanish has two main ways to form the passive voice: the **true passive** with ser + past participle, and the **reflexive passive** with se.

The passive voice is less common in Spanish than in English, and Spanish speakers often prefer active constructions or the reflexive passive.`,
    examples: [
      {
        spanish: 'La carta fue enviada ayer.',
        english: 'The letter was sent yesterday. (true passive)',
        highlight: ['fue enviada']
      },
      {
        spanish: 'Se venden casas aquí.',
        english: 'Houses are sold here. (reflexive passive)',
        highlight: ['Se venden']
      },
      {
        spanish: 'El problema fue resuelto.',
        english: 'The problem was solved.',
        highlight: ['fue resuelto']
      }
    ]
  },
  {
    title: 'True Passive Voice (ser + past participle)',
    content: `The true passive voice is formed with **ser + past participle**. The past participle must agree in gender and number with the subject.`,
    subsections: [
      {
        title: 'Formation',
        content: 'Structure: Subject + ser (conjugated) + past participle + (por + agent)',
        examples: [
          {
            spanish: 'El libro fue escrito por el autor.',
            english: 'The book was written by the author.',
            highlight: ['fue escrito por']
          },
          {
            spanish: 'Las casas fueron construidas en 2020.',
            english: 'The houses were built in 2020.',
            highlight: ['fueron construidas']
          },
          {
            spanish: 'La ventana fue rota por el viento.',
            english: 'The window was broken by the wind.',
            highlight: ['fue rota por']
          }
        ]
      },
      {
        title: 'Past Participle Agreement',
        content: 'The past participle agrees with the subject in gender and number:',
        conjugationTable: {
          title: 'Past Participle Agreement',
          conjugations: [
            { pronoun: 'masculine singular', form: 'escrito', english: 'written' },
            { pronoun: 'feminine singular', form: 'escrita', english: 'written' },
            { pronoun: 'masculine plural', form: 'escritos', english: 'written' },
            { pronoun: 'feminine plural', form: 'escritas', english: 'written' }
          ]
        }
      }
    ]
  },
  {
    title: 'Reflexive Passive Voice (se + verb)',
    content: `The reflexive passive with **se** is more common in Spanish and is used when the agent is not mentioned or is unimportant.`,
    subsections: [
      {
        title: 'Formation and Usage',
        content: 'Structure: Se + verb (3rd person singular/plural) + subject',
        examples: [
          {
            spanish: 'Se habla español aquí.',
            english: 'Spanish is spoken here.',
            highlight: ['Se habla']
          },
          {
            spanish: 'Se venden coches usados.',
            english: 'Used cars are sold.',
            highlight: ['Se venden']
          },
          {
            spanish: 'Se construyó la casa en 1995.',
            english: 'The house was built in 1995.',
            highlight: ['Se construyó']
          }
        ]
      },
      {
        title: 'Singular vs Plural',
        content: 'The verb agrees with the subject in number:',
        examples: [
          {
            spanish: 'Se vende casa. (singular)',
            english: 'House for sale.',
            highlight: ['Se vende']
          },
          {
            spanish: 'Se venden casas. (plural)',
            english: 'Houses for sale.',
            highlight: ['Se venden']
          }
        ]
      }
    ]
  },
  {
    title: 'When to Use Each Form',
    content: `Understanding when to use the true passive versus the reflexive passive is important for natural Spanish.`,
    examples: [
      {
        spanish: 'Use TRUE PASSIVE when the agent is important:',
        english: 'El Quijote fue escrito por Cervantes.',
        highlight: ['fue escrito por Cervantes']
      },
      {
        spanish: 'Use REFLEXIVE PASSIVE for general statements:',
        english: 'Se habla inglés en este hotel.',
        highlight: ['Se habla inglés']
      },
      {
        spanish: 'Use REFLEXIVE PASSIVE for signs and notices:',
        english: 'Se prohíbe fumar.',
        highlight: ['Se prohíbe']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Interrogatives', url: '/grammar/spanish/verbs/interrogatives', difficulty: 'beginner' },
  { title: 'Passive Voice', url: '/grammar/spanish/verbs/passive-voice', difficulty: 'advanced' },
  { title: 'Stem-changing Verbs', url: '/grammar/spanish/verbs/stem-changing', difficulty: 'intermediate' },
  { title: 'Conditional Tense', url: '/grammar/spanish/verbs/conditional', difficulty: 'intermediate' }
];

export default function SpanishPassiveVoicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'passive-voice',
              title: 'Spanish Passive Voice',
              description: 'Master the Spanish passive voice with comprehensive explanations and examples',
              difficulty: 'advanced',
              estimatedTime: 25
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'passive-voice',
              title: 'Spanish Passive Voice'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="passive-voice"
        title="Spanish Passive Voice"
        description="Master the Spanish passive voice with comprehensive explanations and examples"
        difficulty="advanced"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/passive-voice/practice"
        quizUrl="/grammar/spanish/verbs/passive-voice/quiz"
        songUrl="/songs/es?theme=grammar&topic=passive-voice"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
