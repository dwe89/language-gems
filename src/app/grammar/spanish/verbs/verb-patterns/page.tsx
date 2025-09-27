import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'verb-patterns',
  title: 'Spanish Verb Patterns',
  description: 'Master Spanish verb patterns including gustar-type verbs, verb + infinitive constructions, and common verb combinations.',
  difficulty: 'intermediate',
  keywords: [
    'spanish verb patterns',
    'gustar type verbs',
    'verb + infinitive',
    'spanish verb constructions',
    'verb combinations spanish'
  ],
  examples: [
    'Me gusta bailar (I like to dance)',
    'Quiero aprender español (I want to learn Spanish)',
    'Acabo de llegar (I just arrived)'
  ]
});

const sections = [
  {
    title: 'What are Spanish Verb Patterns?',
    content: `Spanish verb patterns are common constructions that combine verbs in specific ways. Understanding these patterns is crucial for natural Spanish expression. They include gustar-type verbs, verb + infinitive constructions, and idiomatic verb combinations.

These patterns often don't translate directly from English, making them challenging but essential for fluency.`,
    examples: [
      {
        spanish: 'Me gusta la música.',
        english: 'I like music. (Music is pleasing to me)',
        highlight: ['Me gusta']
      },
      {
        spanish: 'Quiero estudiar medicina.',
        english: 'I want to study medicine.',
        highlight: ['Quiero estudiar']
      },
      {
        spanish: 'Acabo de comer.',
        english: 'I just ate.',
        highlight: ['Acabo de']
      }
    ]
  },
  {
    title: 'Gustar-Type Verbs',
    content: `Gustar and similar verbs use a special construction where the thing liked is the subject and the person is the indirect object.`,
    subsections: [
      {
        title: 'Gustar Construction',
        content: 'The basic pattern: Indirect Object + Gustar + Subject',
        examples: [
          {
            spanish: 'Me gusta el chocolate.',
            english: 'I like chocolate. (Chocolate is pleasing to me)',
            highlight: ['Me gusta']
          },
          {
            spanish: 'Te gustan los libros.',
            english: 'You like books. (Books are pleasing to you)',
            highlight: ['Te gustan']
          },
          {
            spanish: 'Nos gusta viajar.',
            english: 'We like to travel. (Traveling is pleasing to us)',
            highlight: ['Nos gusta']
          }
        ]
      },
      {
        title: 'Other Gustar-Type Verbs',
        content: 'Common verbs that follow the same pattern as gustar:',
        examples: [
          {
            spanish: 'Me encanta la pizza.',
            english: 'I love pizza.',
            highlight: ['Me encanta']
          },
          {
            spanish: 'Te molesta el ruido.',
            english: 'Noise bothers you.',
            highlight: ['Te molesta']
          },
          {
            spanish: 'Le duele la cabeza.',
            english: 'His/her head hurts.',
            highlight: ['Le duele']
          },
          {
            spanish: 'Nos faltan cinco euros.',
            english: 'We need five euros.',
            highlight: ['Nos faltan']
          }
        ]
      },
      {
        title: 'Gustar with Infinitives',
        content: 'Using gustar-type verbs with infinitive verbs:',
        examples: [
          {
            spanish: 'Me gusta bailar.',
            english: 'I like to dance.',
            highlight: ['Me gusta bailar']
          },
          {
            spanish: 'Te encanta cocinar.',
            english: 'You love to cook.',
            highlight: ['Te encanta cocinar']
          },
          {
            spanish: 'Nos molesta esperar.',
            english: 'Waiting bothers us.',
            highlight: ['Nos molesta esperar']
          }
        ]
      }
    ]
  },
  {
    title: 'Verb + Infinitive Patterns',
    content: `Many Spanish verbs are followed directly by infinitives without prepositions.`,
    subsections: [
      {
        title: 'Modal Verbs + Infinitive',
        content: 'Verbs expressing ability, necessity, or desire:',
        examples: [
          {
            spanish: 'Puedo hablar español.',
            english: 'I can speak Spanish.',
            highlight: ['Puedo hablar']
          },
          {
            spanish: 'Debo estudiar más.',
            english: 'I must study more.',
            highlight: ['Debo estudiar']
          },
          {
            spanish: 'Quiero viajar a España.',
            english: 'I want to travel to Spain.',
            highlight: ['Quiero viajar']
          }
        ]
      },
      {
        title: 'Verbs + Preposition + Infinitive',
        content: 'Some verbs require prepositions before infinitives:',
        examples: [
          {
            spanish: 'Empiezo a trabajar a las ocho.',
            english: 'I start working at eight.',
            highlight: ['Empiezo a trabajar']
          },
          {
            spanish: 'Trato de entender.',
            english: 'I try to understand.',
            highlight: ['Trato de entender']
          },
          {
            spanish: 'Acabo de llegar.',
            english: 'I just arrived.',
            highlight: ['Acabo de llegar']
          }
        ]
      },
      {
        title: 'Common Verb + Infinitive Combinations',
        content: 'Frequently used verb combinations:',
        examples: [
          {
            spanish: 'Voy a estudiar (near future)',
            english: 'I am going to study',
            highlight: ['Voy a estudiar']
          },
          {
            spanish: 'Tengo que trabajar (obligation)',
            english: 'I have to work',
            highlight: ['Tengo que trabajar']
          },
          {
            spanish: 'Hay que practicar (general obligation)',
            english: 'One must practice',
            highlight: ['Hay que practicar']
          }
        ]
      }
    ]
  },
  {
    title: 'Reflexive Verb Patterns',
    content: `Reflexive verbs follow specific patterns and often change meaning when used reflexively.`,
    examples: [
      {
        spanish: 'Me levanto a las siete.',
        english: 'I get up at seven.',
        highlight: ['Me levanto']
      },
      {
        spanish: 'Se llama María.',
        english: 'Her name is María.',
        highlight: ['Se llama']
      },
      {
        spanish: 'Nos vemos mañana.',
        english: 'We\'ll see each other tomorrow.',
        highlight: ['Nos vemos']
      },
      {
        spanish: 'Se me olvidó la tarea.',
        english: 'I forgot the homework.',
        highlight: ['Se me olvidó']
      }
    ]
  },
  {
    title: 'Idiomatic Verb Expressions',
    content: `Common idiomatic expressions using specific verb patterns.`,
    examples: [
      {
        spanish: 'Tener + noun (to be + adjective)',
        english: 'Tengo hambre (I am hungry)',
        highlight: ['Tengo hambre']
      },
      {
        spanish: 'Hacer + time expression',
        english: 'Hace dos años (two years ago)',
        highlight: ['Hace dos años']
      },
      {
        spanish: 'Estar + gerund (progressive)',
        english: 'Estoy estudiando (I am studying)',
        highlight: ['Estoy estudiando']
      },
      {
        spanish: 'Llevar + time + gerund',
        english: 'Llevo dos horas esperando (I\'ve been waiting for two hours)',
        highlight: ['Llevo dos horas esperando']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Subjunctive Imperfect', url: '/grammar/spanish/verbs/subjunctive-imperfect', difficulty: 'advanced' },
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' },
  { title: 'Preterite Tense', url: '/grammar/spanish/verbs/preterite', difficulty: 'intermediate' },
  { title: 'Past Participles', url: '/grammar/spanish/verbs/past-participles', difficulty: 'intermediate' }
];

export default function SpanishVerbPatternsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'verb-patterns',
              title: 'Spanish Verb Patterns',
              description: 'Master Spanish verb patterns with comprehensive explanations and examples',
              difficulty: 'intermediate',
              estimatedTime: 30
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'verb-patterns',
              title: 'Spanish Verb Patterns'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="verb-patterns"
        title="Spanish Verb Patterns"
        description="Master Spanish verb patterns with comprehensive explanations and examples"
        difficulty="intermediate"
        estimatedTime={30}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/verb-patterns/practice"
        quizUrl="/grammar/spanish/verbs/verb-patterns/quiz"
        songUrl="/songs/es?theme=grammar&topic=verb-patterns"
        youtubeVideoId="dQw4w9WgXcQ"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
