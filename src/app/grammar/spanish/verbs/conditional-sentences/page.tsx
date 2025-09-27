import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'conditional-sentences',
  title: 'Spanish Conditional Sentences',
  description: 'Master Spanish conditional sentences (si clauses) with comprehensive explanations of all three types and usage examples.',
  difficulty: 'advanced',
  keywords: [
    'spanish conditional sentences',
    'si clauses spanish',
    'spanish if clauses',
    'conditional spanish grammar',
    'hypothetical situations spanish'
  ],
  examples: [
    'Si tengo tiempo, iré al cine (If I have time, I will go to the cinema)',
    'Si tuviera dinero, viajaría por el mundo (If I had money, I would travel the world)',
    'Si hubiera estudiado, habría aprobado (If I had studied, I would have passed)'
  ]
});

const sections = [
  {
    title: 'What are Spanish Conditional Sentences?',
    content: `Spanish conditional sentences (also called "si clauses" or "if clauses") express hypothetical situations and their consequences. They consist of two parts: the **condition** (si clause) and the **result** (main clause).

There are three types of conditional sentences in Spanish, each expressing different degrees of possibility and time relationships.`,
    examples: [
      {
        spanish: 'Si llueve, me quedo en casa.',
        english: 'If it rains, I stay at home. (Type 1 - Real possibility)',
        highlight: ['Si llueve', 'me quedo']
      },
      {
        spanish: 'Si fuera rico, compraría una casa grande.',
        english: 'If I were rich, I would buy a big house. (Type 2 - Unreal present)',
        highlight: ['Si fuera', 'compraría']
      },
      {
        spanish: 'Si hubiera sabido, no habría venido.',
        english: 'If I had known, I wouldn\'t have come. (Type 3 - Unreal past)',
        highlight: ['Si hubiera sabido', 'no habría venido']
      }
    ]
  },
  {
    title: 'Type 1: Real Conditional (Present/Future)',
    content: `Type 1 conditionals express real possibilities in the present or future. The condition is likely to happen.`,
    subsections: [
      {
        title: 'Structure: Si + Present, Present/Future/Imperative',
        content: 'The most common pattern for real conditions:',
        examples: [
          {
            spanish: 'Si estudias, apruebas el examen.',
            english: 'If you study, you pass the exam.',
            highlight: ['Si estudias', 'apruebas']
          },
          {
            spanish: 'Si llueve mañana, no iremos al parque.',
            english: 'If it rains tomorrow, we won\'t go to the park.',
            highlight: ['Si llueve', 'no iremos']
          },
          {
            spanish: 'Si tienes hambre, come algo.',
            english: 'If you\'re hungry, eat something.',
            highlight: ['Si tienes', 'come']
          }
        ]
      },
      {
        title: 'Common Uses',
        content: 'Type 1 conditionals are used for:',
        examples: [
          {
            spanish: 'General truths: Si calientas el agua, hierve.',
            english: 'If you heat water, it boils.',
            highlight: ['Si calientas', 'hierve']
          },
          {
            spanish: 'Future plans: Si termino temprano, te llamo.',
            english: 'If I finish early, I\'ll call you.',
            highlight: ['Si termino', 'te llamo']
          },
          {
            spanish: 'Advice: Si quieres aprender, practica todos los días.',
            english: 'If you want to learn, practice every day.',
            highlight: ['Si quieres', 'practica']
          }
        ]
      }
    ]
  },
  {
    title: 'Type 2: Unreal Conditional (Present)',
    content: `Type 2 conditionals express unreal or unlikely situations in the present. The condition is contrary to current reality.`,
    subsections: [
      {
        title: 'Structure: Si + Imperfect Subjunctive, Conditional',
        content: 'Used for hypothetical present situations:',
        examples: [
          {
            spanish: 'Si tuviera más tiempo, aprendería francés.',
            english: 'If I had more time, I would learn French.',
            highlight: ['Si tuviera', 'aprendería']
          },
          {
            spanish: 'Si fueras más alto, podrías jugar al baloncesto.',
            english: 'If you were taller, you could play basketball.',
            highlight: ['Si fueras', 'podrías']
          },
          {
            spanish: 'Si viviera en España, hablaría español perfectamente.',
            english: 'If I lived in Spain, I would speak Spanish perfectly.',
            highlight: ['Si viviera', 'hablaría']
          }
        ]
      },
      {
        title: 'Expressing Wishes and Dreams',
        content: 'Type 2 conditionals often express wishes about the present:',
        examples: [
          {
            spanish: 'Si fuera millonario, viajaría por todo el mundo.',
            english: 'If I were a millionaire, I would travel around the world.',
            highlight: ['Si fuera', 'viajaría']
          },
          {
            spanish: 'Si supiera tocar la guitarra, formaría una banda.',
            english: 'If I knew how to play guitar, I would form a band.',
            highlight: ['Si supiera', 'formaría']
          }
        ]
      }
    ]
  },
  {
    title: 'Type 3: Unreal Conditional (Past)',
    content: `Type 3 conditionals express unreal situations in the past. They describe what would have happened if circumstances had been different.`,
    subsections: [
      {
        title: 'Structure: Si + Pluperfect Subjunctive, Conditional Perfect',
        content: 'Used for hypothetical past situations:',
        examples: [
          {
            spanish: 'Si hubiera estudiado más, habría aprobado el examen.',
            english: 'If I had studied more, I would have passed the exam.',
            highlight: ['Si hubiera estudiado', 'habría aprobado']
          },
          {
            spanish: 'Si hubieras llegado antes, habrías visto la película.',
            english: 'If you had arrived earlier, you would have seen the movie.',
            highlight: ['Si hubieras llegado', 'habrías visto']
          },
          {
            spanish: 'Si no hubiera llovido, habríamos ido al parque.',
            english: 'If it hadn\'t rained, we would have gone to the park.',
            highlight: ['Si no hubiera llovido', 'habríamos ido']
          }
        ]
      },
      {
        title: 'Expressing Regrets',
        content: 'Type 3 conditionals often express regrets about the past:',
        examples: [
          {
            spanish: 'Si hubiera sabido la verdad, no habría mentido.',
            english: 'If I had known the truth, I wouldn\'t have lied.',
            highlight: ['Si hubiera sabido', 'no habría mentido']
          },
          {
            spanish: 'Si me hubieras llamado, habría venido a ayudarte.',
            english: 'If you had called me, I would have come to help you.',
            highlight: ['Si me hubieras llamado', 'habría venido']
          }
        ]
      }
    ]
  },
  {
    title: 'Mixed Conditionals and Special Cases',
    content: `Sometimes conditionals mix time references or use alternative structures.`,
    examples: [
      {
        spanish: 'Mixed time: Si hubiera estudiado medicina, ahora sería médico.',
        english: 'If I had studied medicine, I would be a doctor now.',
        highlight: ['Si hubiera estudiado', 'ahora sería']
      },
      {
        spanish: 'Como si + imperfect subjunctive: Habla como si fuera experto.',
        english: 'He speaks as if he were an expert.',
        highlight: ['como si fuera']
      },
      {
        spanish: 'De + infinitive: De tener tiempo, iría contigo.',
        english: 'If I had time, I would go with you.',
        highlight: ['De tener tiempo']
      },
      {
        spanish: 'Conditional + si + present: Sería mejor si vienes mañana.',
        english: 'It would be better if you come tomorrow.',
        highlight: ['Sería mejor si vienes']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Imperfect Subjunctive', url: '/grammar/spanish/verbs/subjunctive-imperfect' },
  { title: 'Conditional Tense', url: '/grammar/spanish/verbs/conditional' },
  { title: 'Conditional Perfect', url: '/grammar/spanish/verbs/conditional-perfect' }
];

export default function SpanishConditionalSentencesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'conditional-sentences',
              title: 'Spanish Conditional Sentences',
              description: 'Master Spanish conditional sentences with comprehensive explanations and examples',
              difficulty: 'advanced',
              estimatedTime: 40
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'conditional-sentences',
              title: 'Spanish Conditional Sentences'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="conditional-sentences"
        title="Spanish Conditional Sentences"
        description="Master Spanish conditional sentences with comprehensive explanations and examples"
        difficulty="advanced"
        estimatedTime={40}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/conditional-sentences/practice"
        quizUrl="/grammar/spanish/verbs/conditional-sentences/quiz"
        songUrl="/songs/es?theme=grammar&topic=conditional-sentences"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
