import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'periphrastic-future',
  title: 'Spanish Periphrastic Future',
  description: 'Master the Spanish periphrastic future (ir a + infinitive). Learn formation, usage, and examples of this common future construction.',
  difficulty: 'beginner',
  keywords: [
    'spanish periphrastic future',
    'ir a infinitive',
    'spanish future tense',
    'spanish grammar rules'
  ],
  examples: [
    'Voy a estudiar español (I am going to study Spanish)',
    'Vas a comer pizza (You are going to eat pizza)',
    'Vamos a viajar mañana (We are going to travel tomorrow)'
  ]
});

const sections = [
  {
    title: 'What is the Spanish Periphrastic Future?',
    content: `The Spanish periphrastic future (**ir a + infinitive**) is used to express actions that will happen in the near future, immediate plans, and intentions. It's equivalent to the English "going to" future and is more commonly used in spoken Spanish than the simple future tense.

This construction is formed by conjugating the verb **ir** (to go) in the present tense, followed by the preposition **a**, and then the infinitive form of the main verb.`,
    examples: [
      {
        spanish: 'Voy a estudiar español.',
        english: 'I am going to study Spanish.',
        highlight: ['Voy a estudiar']
      },
      {
        spanish: 'Vas a comer pizza.',
        english: 'You are going to eat pizza.',
        highlight: ['Vas a comer']
      },
      {
        spanish: 'Vamos a viajar mañana.',
        english: 'We are going to travel tomorrow.',
        highlight: ['Vamos a viajar']
      }
    ]
  },
  {
    title: 'Formation: ir + a + infinitive',
    content: `The periphrastic future is formed using a simple formula: **ir (conjugated) + a + infinitive verb**. The verb "ir" is conjugated according to the subject, while the main verb remains in its infinitive form.`,
    subsections: [
      {
        title: 'Ir Conjugation (Present Tense)',
        content: 'First, you need to conjugate the verb "ir" in the present tense:',
        conjugationTable: {
          title: 'Ir - Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'voy', english: 'I go' },
            { pronoun: 'tú', form: 'vas', english: 'you go' },
            { pronoun: 'él/ella/usted', form: 'va', english: 'he/she/you go' },
            { pronoun: 'nosotros/as', form: 'vamos', english: 'we go' },
            { pronoun: 'vosotros/as', form: 'vais', english: 'you all go' },
            { pronoun: 'ellos/ellas/ustedes', form: 'van', english: 'they/you all go' }
          ]
        }
      },
      {
        title: 'Complete Formation Examples',
        content: 'Here are examples showing the complete periphrastic future formation:',
        conjugationTable: {
          title: 'Periphrastic Future - hablar (to speak)',
          conjugations: [
            { pronoun: 'yo', form: 'voy a hablar', english: 'I am going to speak' },
            { pronoun: 'tú', form: 'vas a hablar', english: 'you are going to speak' },
            { pronoun: 'él/ella/usted', form: 'va a hablar', english: 'he/she/you is/are going to speak' },
            { pronoun: 'nosotros/as', form: 'vamos a hablar', english: 'we are going to speak' },
            { pronoun: 'vosotros/as', form: 'vais a hablar', english: 'you all are going to speak' },
            { pronoun: 'ellos/ellas/ustedes', form: 'van a hablar', english: 'they/you all are going to speak' }
          ]
        }
      }
    ]
  },
  {
    title: 'Usage and Examples',
    content: `The periphrastic future is used to express immediate future plans, intentions, and predictions based on present evidence.`,
    examples: [
      {
        spanish: 'Voy a estudiar medicina.',
        english: 'I am going to study medicine.',
        highlight: ['Voy a estudiar']
      },
      {
        spanish: '¿Vas a venir a la fiesta?',
        english: 'Are you going to come to the party?',
        highlight: ['Vas a venir']
      },
      {
        spanish: 'Van a llegar tarde.',
        english: 'They are going to arrive late.',
        highlight: ['Van a llegar']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense' },
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future' },
  { title: 'Present Continuous', url: '/grammar/spanish/verbs/present-continuous' }
];

export default function SpanishPeriphrasticFuturePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'periphrastic-future',
              title: 'Spanish Periphrastic Future',
              description: 'Master the Spanish periphrastic future (ir a + infinitive) with comprehensive explanations and examples',
              difficulty: 'beginner',
              estimatedTime: 15
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'periphrastic-future',
              title: 'Spanish Periphrastic Future'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="periphrastic-future"
        title="Spanish Periphrastic Future"
        description="Master the Spanish periphrastic future (ir a + infinitive) with comprehensive explanations and examples"
        difficulty="beginner"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/periphrastic-future/practice"
        quizUrl="/grammar/spanish/verbs/periphrastic-future/quiz"
        songUrl="/songs/es?theme=grammar&topic=periphrastic-future"
        youtubeVideoId="2ZwNZKWZFE8"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
