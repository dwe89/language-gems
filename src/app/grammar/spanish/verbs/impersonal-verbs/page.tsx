import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'impersonal-verbs',
  title: 'Spanish Impersonal Verbs',
  description: 'Master Spanish impersonal verbs like gustar, parecer, and weather verbs. Learn their unique conjugation patterns and usage.',
  difficulty: 'intermediate',
  keywords: [
    'spanish impersonal verbs',
    'gustar conjugation',
    'parecer spanish',
    'weather verbs spanish',
    'spanish grammar patterns'
  ],
  examples: [
    'Me gusta la pizza (I like pizza)',
    'Llueve mucho (It rains a lot)',
    'Nos parece interesante (It seems interesting to us)'
  ]
});

const sections = [
  {
    title: 'What are Spanish Impersonal Verbs?',
    content: `Spanish impersonal verbs are verbs that don't have a specific person as their subject. They are used in the third person singular or plural and often express natural phenomena, emotions, opinions, or states. The most famous example is **gustar** (to like), but there are many others.

These verbs often work differently from their English equivalents and require special attention to their conjugation patterns.`,
    examples: [
      {
        spanish: 'Me gusta el chocolate.',
        english: 'I like chocolate. (Literally: Chocolate is pleasing to me)',
        highlight: ['Me gusta']
      },
      {
        spanish: 'Llueve todos los días.',
        english: 'It rains every day.',
        highlight: ['Llueve']
      },
      {
        spanish: 'Nos parece difícil.',
        english: 'It seems difficult to us.',
        highlight: ['Nos parece']
      }
    ]
  },
  {
    title: 'Types of Impersonal Verbs',
    content: `Spanish impersonal verbs can be categorized into different types based on their usage and meaning.`,
    subsections: [
      {
        title: 'Weather Verbs',
        content: 'Verbs describing weather phenomena, always used in third person singular:',
        examples: [
          {
            spanish: 'Llueve',
            english: 'It rains',
            highlight: ['Llueve']
          },
          {
            spanish: 'Nieva',
            english: 'It snows',
            highlight: ['Nieva']
          },
          {
            spanish: 'Hace frío',
            english: 'It is cold',
            highlight: ['Hace frío']
          },
          {
            spanish: 'Truena',
            english: 'It thunders',
            highlight: ['Truena']
          }
        ]
      },
      {
        title: 'Emotion/Opinion Verbs (like gustar)',
        content: 'Verbs expressing likes, dislikes, and opinions that use indirect object pronouns:',
        conjugationTable: {
          title: 'Gustar - Present Tense',
          conjugations: [
            { pronoun: 'me', form: 'gusta/gustan', english: 'I like' },
            { pronoun: 'te', form: 'gusta/gustan', english: 'you like' },
            { pronoun: 'le', form: 'gusta/gustan', english: 'he/she/you like(s)' },
            { pronoun: 'nos', form: 'gusta/gustan', english: 'we like' },
            { pronoun: 'os', form: 'gusta/gustan', english: 'you all like' },
            { pronoun: 'les', form: 'gusta/gustan', english: 'they/you all like' }
          ]
        }
      },
      {
        title: 'Existence/Occurrence Verbs',
        content: 'Verbs expressing existence, occurrence, or happening:',
        examples: [
          {
            spanish: 'Hay muchos estudiantes.',
            english: 'There are many students.',
            highlight: ['Hay']
          },
          {
            spanish: 'Ocurre algo extraño.',
            english: 'Something strange is happening.',
            highlight: ['Ocurre']
          },
          {
            spanish: 'Sucede lo mismo.',
            english: 'The same thing happens.',
            highlight: ['Sucede']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Impersonal Verbs',
    content: `Here are the most frequently used impersonal verbs in Spanish with their patterns and examples.`,
    examples: [
      {
        spanish: 'Me duele la cabeza.',
        english: 'My head hurts. (doler - to hurt)',
        highlight: ['Me duele']
      },
      {
        spanish: 'Te falta dinero.',
        english: 'You lack money. (faltar - to lack)',
        highlight: ['Te falta']
      },
      {
        spanish: 'Nos sobra tiempo.',
        english: 'We have time left over. (sobrar - to be left over)',
        highlight: ['Nos sobra']
      },
      {
        spanish: 'Les interesa el arte.',
        english: 'Art interests them. (interesar - to interest)',
        highlight: ['Les interesa']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Past Participles', url: '/grammar/spanish/verbs/past-participles', difficulty: 'intermediate' },
  { title: 'Conditional Tense', url: '/grammar/spanish/verbs/conditional', difficulty: 'intermediate' },
  { title: 'Passive Voice', url: '/grammar/spanish/verbs/passive-voice', difficulty: 'advanced' },
  { title: 'Gerunds', url: '/grammar/spanish/verbs/gerunds', difficulty: 'intermediate' }
];

export default function SpanishImpersonalVerbsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'impersonal-verbs',
              title: 'Spanish Impersonal Verbs',
              description: 'Master Spanish impersonal verbs with comprehensive explanations and examples',
              difficulty: 'intermediate',
              estimatedTime: 20
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'impersonal-verbs',
              title: 'Spanish Impersonal Verbs'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="impersonal-verbs"
        title="Spanish Impersonal Verbs"
        description="Master Spanish impersonal verbs with comprehensive explanations and examples"
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/impersonal-verbs/practice"
        quizUrl="/grammar/spanish/verbs/impersonal-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=impersonal-verbs"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
