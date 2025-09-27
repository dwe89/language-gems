import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'por-vs-para',
  title: 'Por vs Para in Spanish',
  description: 'Master the difference between por and para in Spanish with comprehensive explanations, usage rules, and practical examples.',
  difficulty: 'advanced',
  keywords: [
    'por vs para spanish',
    'por para difference',
    'spanish prepositions',
    'por para rules',
    'spanish grammar por para'
  ],
  examples: [
    'Trabajo para mi familia (I work for my family)',
    'Camino por el parque (I walk through the park)',
    'Estudio para el examen (I study for the exam)'
  ]
});

const sections = [
  {
    title: 'Por vs Para: The Ultimate Spanish Challenge',
    content: `**Por** and **para** are two of the most challenging prepositions for Spanish learners. Both can translate to "for" in English, but they have very different meanings and uses in Spanish. Understanding when to use each one is crucial for fluent Spanish communication.

The key is to understand that **para** expresses purpose, destination, and future orientation, while **por** expresses cause, means, and movement through space or time.`,
    examples: [
      {
        spanish: 'Compré flores para mi madre.',
        english: 'I bought flowers for my mother. (purpose/recipient)',
        highlight: ['para']
      },
      {
        spanish: 'Gracias por las flores.',
        english: 'Thank you for the flowers. (reason/cause)',
        highlight: ['por']
      },
      {
        spanish: 'Salgo para Madrid mañana.',
        english: 'I leave for Madrid tomorrow. (destination)',
        highlight: ['para']
      },
      {
        spanish: 'Viajo por España.',
        english: 'I travel through Spain. (movement through)',
        highlight: ['por']
      }
    ]
  },
  {
    title: 'Uses of PARA',
    content: `**Para** is used to express purpose, destination, deadlines, and future orientation.`,
    subsections: [
      {
        title: 'Purpose and Goal',
        content: 'Para expresses the purpose or goal of an action:',
        examples: [
          {
            spanish: 'Estudio para ser médico.',
            english: 'I study to be a doctor.',
            highlight: ['para ser']
          },
          {
            spanish: 'Ahorro dinero para comprar una casa.',
            english: 'I save money to buy a house.',
            highlight: ['para comprar']
          },
          {
            spanish: 'Uso gafas para ver mejor.',
            english: 'I wear glasses to see better.',
            highlight: ['para ver']
          }
        ]
      },
      {
        title: 'Destination',
        content: 'Para indicates destination or direction toward a place:',
        examples: [
          {
            spanish: 'El tren sale para Barcelona.',
            english: 'The train leaves for Barcelona.',
            highlight: ['para Barcelona']
          },
          {
            spanish: 'Vamos para casa.',
            english: 'We are going home.',
            highlight: ['para casa']
          }
        ]
      },
      {
        title: 'Deadlines and Time Limits',
        content: 'Para expresses deadlines or time limits:',
        examples: [
          {
            spanish: 'Necesito el informe para mañana.',
            english: 'I need the report by tomorrow.',
            highlight: ['para mañana']
          },
          {
            spanish: 'La tarea es para el viernes.',
            english: 'The homework is due on Friday.',
            highlight: ['para el viernes']
          }
        ]
      },
      {
        title: 'Recipient or Beneficiary',
        content: 'Para indicates who something is for:',
        examples: [
          {
            spanish: 'Este regalo es para ti.',
            english: 'This gift is for you.',
            highlight: ['para ti']
          },
          {
            spanish: 'Trabajo para una empresa grande.',
            english: 'I work for a big company.',
            highlight: ['para una empresa']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses of POR',
    content: `**Por** is used to express cause, means, movement through space/time, and exchange.`,
    subsections: [
      {
        title: 'Cause or Reason',
        content: 'Por expresses the cause or reason for something:',
        examples: [
          {
            spanish: 'Llegué tarde por el tráfico.',
            english: 'I arrived late because of the traffic.',
            highlight: ['por el tráfico']
          },
          {
            spanish: 'Gracias por tu ayuda.',
            english: 'Thank you for your help.',
            highlight: ['por tu ayuda']
          },
          {
            spanish: 'Lo hice por amor.',
            english: 'I did it for love.',
            highlight: ['por amor']
          }
        ]
      },
      {
        title: 'Movement Through Space',
        content: 'Por indicates movement through or along a place:',
        examples: [
          {
            spanish: 'Camino por el parque.',
            english: 'I walk through the park.',
            highlight: ['por el parque']
          },
          {
            spanish: 'Pasamos por tu casa.',
            english: 'We pass by your house.',
            highlight: ['por tu casa']
          }
        ]
      },
      {
        title: 'Means or Method',
        content: 'Por expresses the means by which something is done:',
        examples: [
          {
            spanish: 'Hablo por teléfono.',
            english: 'I speak by phone.',
            highlight: ['por teléfono']
          },
          {
            spanish: 'Envío la carta por correo.',
            english: 'I send the letter by mail.',
            highlight: ['por correo']
          }
        ]
      },
      {
        title: 'Exchange or Price',
        content: 'Por indicates exchange or price:',
        examples: [
          {
            spanish: 'Pagué 20 euros por el libro.',
            english: 'I paid 20 euros for the book.',
            highlight: ['por el libro']
          },
          {
            spanish: 'Cambio mi coche por el tuyo.',
            english: 'I exchange my car for yours.',
            highlight: ['por el tuyo']
          }
        ]
      }
    ]
  },
  {
    title: 'Memory Tips and Common Expressions',
    content: `Here are some memory tricks and common fixed expressions to help you remember when to use por vs para.`,
    examples: [
      {
        spanish: 'PARA = Purpose, Aim, Recipient, Arrival (destination)',
        english: 'Remember: PARA looks toward the future',
        highlight: ['PARA']
      },
      {
        spanish: 'POR = Past reason, Origin, Route, eXchange',
        english: 'Remember: POR looks toward the past/cause',
        highlight: ['POR']
      },
      {
        spanish: 'Common expressions with POR:',
        english: 'por favor, por ejemplo, por fin, por supuesto',
        highlight: ['por favor', 'por ejemplo', 'por fin', 'por supuesto']
      },
      {
        spanish: 'Common expressions with PARA:',
        english: 'para siempre, para nada, para colmo',
        highlight: ['para siempre', 'para nada', 'para colmo']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Prepositions', url: '/grammar/spanish/prepositions/basic' },
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense' },
  { title: 'Infinitive Constructions', url: '/grammar/spanish/verbs/infinitive-constructions' }
];

export default function SpanishPorVsParaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'por-vs-para',
              title: 'Por vs Para in Spanish',
              description: 'Master the difference between por and para in Spanish with comprehensive explanations and examples',
              difficulty: 'advanced',
              estimatedTime: 30
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'por-vs-para',
              title: 'Por vs Para in Spanish'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="por-vs-para"
        title="Por vs Para in Spanish"
        description="Master the difference between por and para in Spanish with comprehensive explanations and examples"
        difficulty="advanced"
        estimatedTime={30}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/por-vs-para/practice"
        quizUrl="/grammar/spanish/verbs/por-vs-para/quiz"
        songUrl="/songs/es?theme=grammar&topic=por-vs-para"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
