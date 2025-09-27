import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'past-participles',
  title: 'Spanish Past Participles',
  description: 'Master Spanish past participles with formation rules, irregular forms, and usage in perfect tenses and passive voice.',
  difficulty: 'intermediate',
  keywords: [
    'spanish past participles',
    'participio pasado',
    'spanish perfect tenses',
    'spanish -ado -ido',
    'irregular past participles spanish'
  ],
  examples: [
    'He hablado (I have spoken)',
    'Está roto (It is broken)',
    'La puerta fue abierta (The door was opened)'
  ]
});

const sections = [
  {
    title: 'What are Spanish Past Participles?',
    content: `Spanish past participles (**participios pasados**) are verb forms used to create perfect tenses, passive voice, and as adjectives. They are equivalent to English past participles (words like "spoken," "written," "broken").

Past participles are formed by adding **-ado** to -ar verbs and **-ido** to -er and -ir verbs.`,
    examples: [
      {
        spanish: 'He terminado mi trabajo.',
        english: 'I have finished my work.',
        highlight: ['terminado']
      },
      {
        spanish: 'La ventana está rota.',
        english: 'The window is broken.',
        highlight: ['rota']
      },
      {
        spanish: 'El libro fue escrito por Cervantes.',
        english: 'The book was written by Cervantes.',
        highlight: ['escrito']
      }
    ]
  },
  {
    title: 'Formation of Past Participles',
    content: `Most Spanish past participles follow regular formation patterns.`,
    subsections: [
      {
        title: 'Regular Formation',
        content: 'Add the appropriate ending to the verb stem:',
        conjugationTable: {
          title: 'Past Participle Formation',
          conjugations: [
            { pronoun: '-ar verbs', form: 'stem + -ado', english: 'hablar → hablado' },
            { pronoun: '-er verbs', form: 'stem + -ido', english: 'comer → comido' },
            { pronoun: '-ir verbs', form: 'stem + -ido', english: 'vivir → vivido' }
          ]
        }
      },
      {
        title: 'Common Irregular Past Participles',
        content: 'These verbs have irregular past participle forms that must be memorized:',
        examples: [
          {
            spanish: 'abrir → abierto',
            english: 'to open → opened',
            highlight: ['abierto']
          },
          {
            spanish: 'escribir → escrito',
            english: 'to write → written',
            highlight: ['escrito']
          },
          {
            spanish: 'hacer → hecho',
            english: 'to do/make → done/made',
            highlight: ['hecho']
          },
          {
            spanish: 'poner → puesto',
            english: 'to put → put',
            highlight: ['puesto']
          },
          {
            spanish: 'ver → visto',
            english: 'to see → seen',
            highlight: ['visto']
          },
          {
            spanish: 'volver → vuelto',
            english: 'to return → returned',
            highlight: ['vuelto']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses of Past Participles',
    content: `Spanish past participles have several important functions in the language.`,
    subsections: [
      {
        title: 'Perfect Tenses',
        content: 'Used with haber to form perfect tenses:',
        examples: [
          {
            spanish: 'He comido.',
            english: 'I have eaten.',
            highlight: ['He comido']
          },
          {
            spanish: 'Habían llegado temprano.',
            english: 'They had arrived early.',
            highlight: ['Habían llegado']
          },
          {
            spanish: 'Habremos terminado mañana.',
            english: 'We will have finished tomorrow.',
            highlight: ['Habremos terminado']
          }
        ]
      },
      {
        title: 'Passive Voice',
        content: 'Used with ser to form the passive voice:',
        examples: [
          {
            spanish: 'La casa fue construida en 1990.',
            english: 'The house was built in 1990.',
            highlight: ['fue construida']
          },
          {
            spanish: 'Los libros serán publicados pronto.',
            english: 'The books will be published soon.',
            highlight: ['serán publicados']
          }
        ]
      },
      {
        title: 'As Adjectives',
        content: 'Used as adjectives with estar or other verbs:',
        examples: [
          {
            spanish: 'La puerta está cerrada.',
            english: 'The door is closed.',
            highlight: ['cerrada']
          },
          {
            spanish: 'Los niños están cansados.',
            english: 'The children are tired.',
            highlight: ['cansados']
          },
          {
            spanish: 'Tengo el trabajo hecho.',
            english: 'I have the work done.',
            highlight: ['hecho']
          }
        ]
      }
    ]
  },
  {
    title: 'Agreement Rules',
    content: `Past participles agree in gender and number when used as adjectives or in passive voice, but not in perfect tenses.`,
    examples: [
      {
        spanish: 'Perfect tenses (no agreement): He comido, Ella ha comido',
        english: 'I have eaten, She has eaten',
        highlight: ['comido', 'comido']
      },
      {
        spanish: 'As adjectives (agreement): Está cansado/cansada/cansados/cansadas',
        english: 'He/She is tired, They are tired',
        highlight: ['cansado', 'cansada', 'cansados', 'cansadas']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Interrogatives', url: '/grammar/spanish/verbs/interrogatives', difficulty: 'beginner' },
  { title: 'Conditional Tense', url: '/grammar/spanish/verbs/conditional', difficulty: 'intermediate' },
  { title: 'Por vs Para', url: '/grammar/spanish/verbs/por-vs-para', difficulty: 'intermediate' },
  { title: 'Present Perfect', url: '/grammar/spanish/verbs/present-perfect', difficulty: 'intermediate' }
];

export default function SpanishPastParticiplesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'past-participles',
              title: 'Spanish Past Participles',
              description: 'Master Spanish past participles with comprehensive explanations and examples',
              difficulty: 'intermediate',
              estimatedTime: 25
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'past-participles',
              title: 'Spanish Past Participles'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="past-participles"
        title="Spanish Past Participles"
        description="Master Spanish past participles with comprehensive explanations and examples"
        difficulty="intermediate"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/past-participles/practice"
        quizUrl="/grammar/spanish/verbs/past-participles/quiz"
        songUrl="/songs/es?theme=grammar&topic=past-participles"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
