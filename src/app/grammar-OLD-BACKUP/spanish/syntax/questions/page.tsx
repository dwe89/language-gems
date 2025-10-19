import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';

export const metadata: Metadata = {
  title: 'Spanish Question Formation - Language Gems',
  description: 'Master Spanish question formation including yes/no questions, question words, inversion, and intonation patterns.',
  keywords: 'Spanish questions, question formation, interrogatives, Spanish syntax, question words',
};

export default function SpanishQuestionsPage() {
  const sections = [
    {
      title: 'Overview',
      content: 'Spanish questions can be formed in several ways: using intonation, inverting the subject and verb, or using question words. Understanding these patterns is essential for asking questions naturally in Spanish.'
    },
    {
      title: 'Yes/No Questions',
      content: 'Yes/no questions can be formed using intonation or subject-verb inversion.',
      subsections: [
        {
          title: 'Intonation Method (Most Common)',
          content: 'The simplest way to ask a yes/no question is to use the same word order as a statement but with rising intonation.',
          examples: [
            {
              spanish: '¿Hablas español? (Do you speak Spanish?)',
              english: '¿Vives en Madrid? (Do you live in Madrid?)',
              highlight: ['Hablas español', 'Vives en Madrid']
            },
            {
              spanish: '¿Te gusta el café? (Do you like coffee?)',
              english: '¿Tienes hermanos? (Do you have siblings?)',
              highlight: ['Te gusta', 'Tienes hermanos']
            }
          ]
        },
        {
          title: 'Inversion Method',
          content: 'Subject-verb inversion is used for emphasis or formality.',
          examples: [
            {
              spanish: '¿Hablas tú español? (Do YOU speak Spanish? - emphasis)',
              english: '¿Vive ella en Madrid? (Does SHE live in Madrid?)',
              highlight: ['Hablas tú', 'Vive ella']
            }
          ]
        }
      ]
    },
    {
      title: 'Question Words (Interrogatives)',
      content: 'Question words begin the sentence and typically trigger subject-verb inversion.',
      subsections: [
        {
          title: 'Common Question Words',
          conjugationTable: {
            title: 'Spanish Question Words',
            conjugations: [
              { pronoun: '¿Qué?', form: 'What?', english: '¿Qué haces? (What are you doing?)' },
              { pronoun: '¿Quién?', form: 'Who?', english: '¿Quién es? (Who is it?)' },
              { pronoun: '¿Dónde?', form: 'Where?', english: '¿Dónde vives? (Where do you live?)' },
              { pronoun: '¿Cuándo?', form: 'When?', english: '¿Cuándo vienes? (When are you coming?)' },
              { pronoun: '¿Cómo?', form: 'How?', english: '¿Cómo estás? (How are you?)' },
              { pronoun: '¿Cuál?', form: 'Which?', english: '¿Cuál prefieres? (Which do you prefer?)' },
              { pronoun: '¿Cuánto?', form: 'How much?', english: '¿Cuánto cuesta? (How much does it cost?)' },
              { pronoun: '¿Por qué?', form: 'Why?', english: '¿Por qué lloras? (Why are you crying?)' }
            ]
          },
          examples: [
            {
              spanish: '¿Qué quieres? (What do you want?)',
              english: '¿Quién es tu amigo? (Who is your friend?)',
              highlight: ['Qué quieres', 'Quién es']
            }
          ]
        },
        {
          title: 'Question Word + Inversion',
          content: 'Question words are followed by inverted word order (verb before subject).',
          examples: [
            {
              spanish: '¿Dónde vives tú? (Where do you live?)',
              english: '¿Cuándo llega el tren? (When does the train arrive?)',
              highlight: ['Dónde vives', 'Cuándo llega']
            }
          ]
        }
      ]
    },
    {
      title: 'Question Formation Patterns',
      content: 'Different patterns for forming questions in Spanish.',
      subsections: [
        {
          title: 'With Pronouns',
          content: 'Questions with object pronouns follow specific patterns.',
          examples: [
            {
              spanish: '¿Lo ves? (Do you see it?)',
              english: '¿Me entiendes? (Do you understand me?)',
              highlight: ['Lo ves', 'Me entiendes']
            }
          ]
        },
        {
          title: 'With Reflexive Verbs',
          content: 'Reflexive verbs maintain their reflexive pronoun in questions.',
          examples: [
            {
              spanish: '¿Te despiertas temprano? (Do you wake up early?)',
              english: '¿Se llama María? (Is her name María?)',
              highlight: ['Te despiertas', 'Se llama']
            }
          ]
        }
      ]
    },
    {
      title: 'Practical Examples',
      content: 'Study these questions in context:',
      examples: [
        {
          spanish: '¿Cuál es tu nombre? (What is your name?)',
          english: 'Question word + verb + subject',
          highlight: ['Cuál es']
        },
        {
          spanish: '¿Dónde y cuándo nos vemos? (Where and when do we see each other?)',
          english: 'Multiple question words',
          highlight: ['Dónde y cuándo']
        },
        {
          spanish: '¿Quién vino a la fiesta? (Who came to the party?)',
          english: 'Question word + verb + subject',
          highlight: ['Quién vino']
        }
      ]
    }
  ];

  return (
    <GrammarPageTemplate
      language="spanish"
      category="syntax"
      topic="questions"
      title="Spanish Question Formation"
      description="Master Spanish question formation including yes/no questions, question words, and inversion patterns"
      difficulty="intermediate"
      estimatedTime={20}
      sections={sections}
      backUrl="/grammar/spanish"
      practiceUrl="/grammar/spanish/syntax/questions/practice"
      quizUrl="/grammar/spanish/syntax/questions/test"
      youtubeVideoId="EGaSgIRswcI"
      relatedTopics={[
        { title: 'Word Order', url: '/grammar/spanish/syntax/word-order', difficulty: 'intermediate' },
        { title: 'Pronouns', url: '/grammar/spanish/pronouns', difficulty: 'intermediate' },
        { title: 'Interrogative Pronouns', url: '/grammar/spanish/pronouns/interrogative', difficulty: 'intermediate' }
      ]}
    />
  );
}

