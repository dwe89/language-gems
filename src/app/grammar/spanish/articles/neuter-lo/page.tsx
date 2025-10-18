import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'articles',
  topic: 'neuter-lo',
  title: 'Spanish Neuter Article Lo',
  description: 'Master the Spanish neuter article lo with comprehensive explanations and practical examples.',
  difficulty: 'intermediate',
  keywords: [
    'spanish neuter lo',
    'lo + adjective',
    'lo importante',
    'lo que',
    'spanish articles'
  ],
  examples: [
    'Lo importante es estudiar (The important thing is to study)',
    'Lo que no entiendo es la gramática (What I don\'t understand is grammar)',
    'Lo bueno de este libro es la trama (The good thing about this book is the plot)'
  ]
});

const sections = [
  {
    title: 'What is the Neuter Article Lo?',
    content: `**Lo** is a neuter article in Spanish that doesn't correspond to any noun. It is used to express abstract concepts and ideas by converting adjectives into nouns.

Unlike the definite articles (el, la, los, las), **lo** has no gender or number - it is always neuter and singular.`,
    examples: [
      {
        spanish: 'Lo importante es estudiar.',
        english: 'The important thing is to study.',
        highlight: ['Lo importante']
      },
      {
        spanish: 'Lo bueno de este libro es la trama.',
        english: 'The good thing about this book is the plot.',
        highlight: ['Lo bueno']
      }
    ]
  },
  {
    title: 'Lo + Adjective',
    content: `The most common use of **lo** is with adjectives to express abstract concepts.`,
    subsections: [
      {
        title: 'Formation',
        content: 'Lo + adjective = the [adjective] thing, what is [adjective]',
        examples: [
          {
            spanish: 'Lo difícil es empezar.',
            english: 'The difficult thing is to start.',
            highlight: ['Lo difícil']
          },
          {
            spanish: 'Lo malo es que no tenemos tiempo.',
            english: 'The bad thing is that we don\'t have time.',
            highlight: ['Lo malo']
          },
          {
            spanish: 'Lo mejor es viajar juntos.',
            english: 'The best thing is to travel together.',
            highlight: ['Lo mejor']
          }
        ]
      },
      {
        title: 'Lo + Adjective + De',
        content: 'To express "the [adjective] thing about":',
        examples: [
          {
            spanish: 'Lo interesante de la película es el final.',
            english: 'The interesting thing about the film is the ending.',
            highlight: ['Lo interesante de']
          },
          {
            spanish: 'Lo extraordinario de su talento es la versatilidad.',
            english: 'The extraordinary thing about his talent is the versatility.',
            highlight: ['Lo extraordinario de']
          }
        ]
      }
    ]
  },
  {
    title: 'Lo Que (What)',
    content: `**Lo que** means "what" and is used in relative clauses to refer to ideas or situations.`,
    subsections: [
      {
        title: 'Lo Que in Relative Clauses',
        content: 'Lo que introduces a relative clause referring to an abstract concept:',
        examples: [
          {
            spanish: 'Lo que no entiendo es la gramática.',
            english: 'What I don\'t understand is grammar.',
            highlight: ['Lo que']
          },
          {
            spanish: 'Lo que más me gusta de ti es tu honestidad.',
            english: 'What I like most about you is your honesty.',
            highlight: ['Lo que']
          },
          {
            spanish: 'Lo que no previmos es la magnitud del problema.',
            english: 'What we didn\'t foresee is the magnitude of the problem.',
            highlight: ['Lo que']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Uses and Examples',
    content: `Lo is used in many common expressions and situations.`,
    examples: [
      {
        spanish: 'Lo fundamental es la salud.',
        english: 'The fundamental thing is health.',
        highlight: ['Lo fundamental']
      },
      {
        spanish: 'Lo único que quiero es descansar.',
        english: 'The only thing I want is to rest.',
        highlight: ['Lo único']
      },
      {
        spanish: 'Lo paradójico es que cuanto más trabajas, menos ganas.',
        english: 'The paradoxical thing is that the more you work, the less you earn.',
        highlight: ['Lo paradójico']
      },
      {
        spanish: 'Lo irónico es que él fue quien lo sugirió primero.',
        english: 'The ironic thing is that he was the one who suggested it first.',
        highlight: ['Lo irónico']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Definite Articles', url: '/grammar/spanish/articles', difficulty: 'beginner' },
  { title: 'Pronouns', url: '/grammar/spanish/pronouns', difficulty: 'intermediate' },
  { title: 'Relative Clauses', url: '/grammar/spanish/syntax', difficulty: 'intermediate' }
];

export default function SpanishNeuterLoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'articles',
              topic: 'neuter-lo',
              title: 'Spanish Neuter Article Lo',
              description: 'Master the Spanish neuter article lo',
              difficulty: 'intermediate',
              estimatedTime: 20
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'articles',
              topic: 'neuter-lo',
              title: 'Spanish Neuter Article Lo'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="articles"
        topic="neuter-lo"
        title="Spanish Neuter Article Lo"
        description="Master the Spanish neuter article lo with comprehensive explanations and practical examples"
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/articles"
        practiceUrl="/grammar/spanish/articles/neuter-lo/practice"
        quizUrl="/grammar/spanish/articles/neuter-lo/quiz"
        songUrl="/songs/es?theme=grammar&topic=neuter-lo"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

