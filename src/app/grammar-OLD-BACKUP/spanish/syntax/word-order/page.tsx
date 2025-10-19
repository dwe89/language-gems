import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';

export const metadata: Metadata = {
  title: 'Spanish Word Order - Language Gems',
  description: 'Master Spanish word order including subject-verb-object patterns, adjective placement, pronoun order, and question formation.',
  keywords: 'Spanish word order, subject verb object, adjective placement, pronoun order, Spanish syntax',
};

export default function SpanishWordOrderPage() {
  const sections = [
    {
      title: 'Overview',
      content: 'Spanish word order is more flexible than English, but there are still important patterns and rules. The basic word order is Subject-Verb-Object (SVO), but Spanish allows variations for emphasis and style. Understanding word order is crucial for proper sentence construction and natural-sounding Spanish.'
    },
    {
      title: 'Basic Word Order: Subject-Verb-Object (SVO)',
      content: 'The most common word order in Spanish is Subject-Verb-Object, similar to English.',
      subsections: [
        {
          title: 'Standard SVO Pattern',
          content: 'Subject + Verb + Object is the neutral, unmarked word order.',
          examples: [
            {
              spanish: 'Yo como una manzana. (I eat an apple.)',
              english: 'María habla español. (María speaks Spanish.)',
              highlight: ['Yo como', 'María habla']
            },
            {
              spanish: 'El profesor enseña la lección. (The teacher teaches the lesson.)',
              english: 'Los estudiantes estudian el libro. (The students study the book.)',
              highlight: ['profesor enseña', 'estudiantes estudian']
            }
          ]
        },
        {
          title: 'Flexible Word Order for Emphasis',
          content: 'Spanish allows subject-object inversion for emphasis or stylistic reasons.',
          examples: [
            {
              spanish: 'Como una manzana yo. (I eat an apple - emphasis on subject)',
              english: 'Una manzana como yo. (An apple I eat - emphasis on object)',
              highlight: ['Como una manzana yo', 'Una manzana como yo']
            }
          ]
        }
      ]
    },
    {
      title: 'Adjective Placement',
      content: 'Adjectives in Spanish typically follow the noun, but some adjectives precede the noun.',
      subsections: [
        {
          title: 'Adjectives After the Noun (Most Common)',
          content: 'Most descriptive adjectives follow the noun they modify.',
          examples: [
            {
              spanish: 'una casa grande (a big house)',
              english: 'un coche rojo (a red car)',
              highlight: ['casa grande', 'coche rojo']
            }
          ]
        },
        {
          title: 'Adjectives Before the Noun',
          content: 'Some adjectives precede the noun, especially limiting adjectives.',
          examples: [
            {
              spanish: 'el primer día (the first day)',
              english: 'muchos estudiantes (many students)',
              highlight: ['primer día', 'muchos estudiantes']
            }
          ]
        }
      ]
    },
    {
      title: 'Pronoun Placement',
      content: 'Object pronouns in Spanish have specific placement rules.',
      subsections: [
        {
          title: 'Pronouns Before Conjugated Verbs',
          content: 'Object pronouns typically precede conjugated verbs.',
          examples: [
            {
              spanish: 'Lo veo. (I see it.)',
              english: 'Me habla. (He speaks to me.)',
              highlight: ['Lo veo', 'Me habla']
            }
          ]
        },
        {
          title: 'Pronouns After Infinitives and Gerunds',
          content: 'Pronouns attach to infinitives and gerunds.',
          examples: [
            {
              spanish: 'Quiero verlo. (I want to see it.)',
              english: 'Estoy hablándole. (I am speaking to him.)',
              highlight: ['verlo', 'hablándole']
            }
          ]
        }
      ]
    },
    {
      title: 'Question Word Order',
      content: 'Questions in Spanish have specific word order patterns.',
      subsections: [
        {
          title: 'Yes/No Questions',
          content: 'Yes/no questions can use intonation or inversion.',
          examples: [
            {
              spanish: '¿Hablas español? (Do you speak Spanish? - intonation)',
              english: '¿Español hablas? (Spanish do you speak? - inversion for emphasis)',
              highlight: ['Hablas español', 'Español hablas']
            }
          ]
        },
        {
          title: 'Question Words (Interrogatives)',
          content: 'Question words begin the sentence and trigger inversion.',
          examples: [
            {
              spanish: '¿Dónde vives? (Where do you live?)',
              english: '¿Qué haces? (What are you doing?)',
              highlight: ['Dónde vives', 'Qué haces']
            }
          ]
        }
      ]
    },
    {
      title: 'Practical Examples',
      content: 'Study these sentences to see word order in context:',
      examples: [
        {
          spanish: 'El gato come el pescado en la cocina. (The cat eats the fish in the kitchen.)',
          english: 'Subject-Verb-Object-Location',
          highlight: ['gato come', 'pescado']
        },
        {
          spanish: 'Mañana voy al cine con mis amigos. (Tomorrow I go to the cinema with my friends.)',
          english: 'Time-Verb-Location-Companions',
          highlight: ['Mañana voy']
        }
      ]
    }
  ];

  return (
    <GrammarPageTemplate
      language="spanish"
      category="syntax"
      topic="word-order"
      title="Spanish Word Order"
      description="Master Spanish word order including subject-verb-object patterns, adjective placement, and pronoun positioning"
      difficulty="intermediate"
      estimatedTime={20}
      sections={sections}
      backUrl="/grammar/spanish"
      practiceUrl="/grammar/spanish/syntax/word-order/practice"
      quizUrl="/grammar/spanish/syntax/word-order/test"
      youtubeVideoId="EGaSgIRswcI"
      relatedTopics={[
        { title: 'Questions', url: '/grammar/spanish/syntax/questions', difficulty: 'intermediate' },
        { title: 'Adjective Position', url: '/grammar/spanish/adjectives/adjective-position', difficulty: 'intermediate' },
        { title: 'Pronouns', url: '/grammar/spanish/pronouns', difficulty: 'intermediate' }
      ]}
    />
  );
}

