import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'interrogative-forms',
  title: 'French Interrogative Forms (Questions with Inversion, Est-ce que)',
  description: 'Master French question formation using inversion, est-ce que, and intonation. Learn formal and informal interrogative patterns.',
  difficulty: 'intermediate',
  keywords: [
    'french questions',
    'french interrogative',
    'est-ce que french',
    'french inversion',
    'french question formation',
    'asking questions french'
  ],
  examples: [
    'Parlez-vous français? (Do you speak French?)',
    'Est-ce que tu viens? (Are you coming?)',
    'Tu viens? (You\'re coming?)',
    'Où habitez-vous? (Where do you live?)'
  ]
});

const sections = [
  {
    title: 'French Question Formation Methods',
    content: `French has **three main ways** to form questions, each with different levels of formality:

**1. INTONATION** (Informal) - Rising intonation
**2. EST-CE QUE** (Standard) - Adding "est-ce que" before statement
**3. INVERSION** (Formal) - Inverting subject and verb

Each method can be used with the same statement, but the level of formality changes:`,
    examples: [
      {
        spanish: 'Tu viens? (You\'re coming?) - Intonation',
        english: 'Most informal, used in casual conversation',
        highlight: ['Tu viens?']
      },
      {
        spanish: 'Est-ce que tu viens? (Are you coming?) - Est-ce que',
        english: 'Standard, used in most situations',
        highlight: ['Est-ce que tu viens?']
      },
      {
        spanish: 'Viens-tu? (Are you coming?) - Inversion',
        english: 'Most formal, used in writing and formal speech',
        highlight: ['Viens-tu?']
      }
    ]
  },
  {
    title: 'Method 1: Intonation Questions',
    content: `The **simplest way** to ask a question in French is to use **rising intonation** with a statement:`,
    examples: [
      {
        spanish: 'Tu parles français? (You speak French?)',
        english: 'Il vient demain? (He\'s coming tomorrow?)',
        highlight: ['Tu parles français?', 'Il vient demain?']
      },
      {
        spanish: 'Vous habitez ici? (You live here?)',
        english: 'Elle aime le chocolat? (She likes chocolate?)',
        highlight: ['Vous habitez ici?', 'Elle aime le chocolat?']
      }
    ],
    subsections: [
      {
        title: 'When to Use Intonation',
        content: 'Best for informal, casual conversations:',
        examples: [
          {
            spanish: 'With friends: Tu viens ce soir?',
            english: 'With family: Papa est là?',
            highlight: ['Tu viens ce soir?', 'Papa est là?']
          }
        ]
      },
      {
        title: 'Pronunciation',
        content: 'The voice rises at the end of the sentence:',
        examples: [
          {
            spanish: 'Tu comprends? ↗ (rising intonation)',
            english: 'C\'est bon? ↗ (rising intonation)',
            highlight: ['↗', '↗']
          }
        ]
      }
    ]
  },
  {
    title: 'Method 2: Est-ce que Questions',
    content: `**Est-ce que** is placed at the beginning of a statement to form a question. This is the **most common method** in spoken French:`,
    examples: [
      {
        spanish: 'Est-ce que tu parles français? (Do you speak French?)',
        english: 'Est-ce qu\'il vient demain? (Is he coming tomorrow?)',
        highlight: ['Est-ce que', 'Est-ce qu\'il']
      },
      {
        spanish: 'Est-ce que vous habitez ici? (Do you live here?)',
        english: 'Est-ce qu\'elle aime le chocolat? (Does she like chocolate?)',
        highlight: ['Est-ce que vous', 'Est-ce qu\'elle']
      }
    ],
    subsections: [
      {
        title: 'Est-ce que → Est-ce qu\'',
        content: 'Before vowels, "que" becomes "qu\'":',
        examples: [
          {
            spanish: 'Est-ce qu\'il arrive? (Is he arriving?)',
            english: 'Est-ce qu\'elle étudie? (Is she studying?)',
            highlight: ['Est-ce qu\'il', 'Est-ce qu\'elle']
          }
        ]
      },
      {
        title: 'Advantages of Est-ce que',
        content: 'Easy to use and widely accepted:',
        examples: [
          {
            spanish: '✅ No word order changes needed',
            english: '✅ Works in all situations',
            highlight: ['No changes', 'All situations']
          }
        ]
      }
    ]
  },
  {
    title: 'Method 3: Inversion Questions',
    content: `**Inversion** involves switching the positions of the subject pronoun and verb. This is the **most formal method**:`,
    conjugationTable: {
      title: 'PARLER (to speak) - Inversion Questions',
      conjugations: [
        { pronoun: 'je', form: '(not used)', english: 'use est-ce que instead' },
        { pronoun: 'tu', form: 'parles-tu?', english: 'do you speak?' },
        { pronoun: 'il/elle/on', form: 'parle-t-il/elle/on?', english: 'does he/she/one speak?' },
        { pronoun: 'nous', form: 'parlons-nous?', english: 'do we speak?' },
        { pronoun: 'vous', form: 'parlez-vous?', english: 'do you speak?' },
        { pronoun: 'ils/elles', form: 'parlent-ils/elles?', english: 'do they speak?' }
      ]
    },
    subsections: [
      {
        title: 'The -t- Link',
        content: 'Add -t- between vowels for pronunciation:',
        examples: [
          {
            spanish: 'Parle-t-il? (Does he speak?)',
            english: 'Arrive-t-elle? (Is she arriving?)',
            highlight: ['Parle-t-il', 'Arrive-t-elle']
          }
        ]
      },
      {
        title: 'JE Inversion',
        content: 'Je inversion is rarely used in modern French:',
        examples: [
          {
            spanish: '❌ Parle-je? (archaic)',
            english: '✅ Est-ce que je parle? (modern)',
            highlight: ['Est-ce que je parle?']
          }
        ]
      }
    ]
  },
  {
    title: 'Inversion with Noun Subjects',
    content: `When the subject is a **noun** (not a pronoun), use this pattern:
**NOUN + VERB + PRONOUN**`,
    examples: [
      {
        spanish: 'Marie parle-t-elle français? (Does Marie speak French?)',
        english: 'Les enfants viennent-ils? (Are the children coming?)',
        highlight: ['Marie parle-t-elle', 'Les enfants viennent-ils']
      },
      {
        spanish: 'Ton frère habite-t-il ici? (Does your brother live here?)',
        english: 'Tes parents arrivent-ils demain? (Are your parents arriving tomorrow?)',
        highlight: ['Ton frère habite-t-il', 'Tes parents arrivent-ils']
      }
    ],
    subsections: [
      {
        title: 'Pattern Explanation',
        content: 'The noun stays, but add the corresponding pronoun:',
        examples: [
          {
            spanish: 'Pierre (il) → Pierre vient-il?',
            english: 'Marie (elle) → Marie parle-t-elle?',
            highlight: ['Pierre vient-il', 'Marie parle-t-elle']
          }
        ]
      }
    ]
  },
  {
    title: 'Question Words (Interrogative Adverbs)',
    content: `French question words can be used with all three question methods:`,
    conjugationTable: {
      title: 'Common Question Words',
      conjugations: [
        { pronoun: 'où', form: 'where', english: 'Où habitez-vous?' },
        { pronoun: 'quand', form: 'when', english: 'Quand partez-vous?' },
        { pronoun: 'comment', form: 'how', english: 'Comment allez-vous?' },
        { pronoun: 'pourquoi', form: 'why', english: 'Pourquoi étudiez-vous?' },
        { pronoun: 'combien', form: 'how much/many', english: 'Combien coûte-t-il?' },
        { pronoun: 'que/qu\'', form: 'what', english: 'Que faites-vous?' }
      ]
    },
    subsections: [
      {
        title: 'Question Words with Different Methods',
        content: 'Same question, different formality levels:',
        examples: [
          {
            spanish: 'Où tu habites? (informal)',
            english: 'Où est-ce que tu habites? (standard)',
            highlight: ['Où tu habites?', 'Où est-ce que tu habites?']
          },
          {
            spanish: 'Où habites-tu? (formal)',
            english: 'All mean: Where do you live?',
            highlight: ['Où habites-tu?']
          }
        ]
      }
    ]
  },
  {
    title: 'Questions in Compound Tenses',
    content: `In compound tenses, inversion occurs with the **auxiliary verb**:`,
    examples: [
      {
        spanish: 'Avez-vous mangé? (Have you eaten?)',
        english: 'Est-il arrivé? (Has he arrived?)',
        highlight: ['Avez-vous mangé', 'Est-il arrivé']
      },
      {
        spanish: 'Êtes-vous partis? (Have you left?)',
        english: 'Ont-elles fini? (Have they finished?)',
        highlight: ['Êtes-vous partis', 'Ont-elles fini']
      }
    ],
    subsections: [
      {
        title: 'With Est-ce que',
        content: 'Est-ce que works the same way:',
        examples: [
          {
            spanish: 'Est-ce que vous avez mangé?',
            english: 'Est-ce qu\'il est arrivé?',
            highlight: ['Est-ce que vous avez mangé', 'Est-ce qu\'il est arrivé']
          }
        ]
      }
    ]
  },
  {
    title: 'Negative Questions',
    content: `Questions can be combined with negation:`,
    examples: [
      {
        spanish: 'Ne parlez-vous pas français? (Don\'t you speak French?)',
        english: 'N\'est-ce pas intéressant? (Isn\'t it interesting?)',
        highlight: ['Ne parlez-vous pas', 'N\'est-ce pas']
      },
      {
        spanish: 'Est-ce que tu ne viens pas? (Aren\'t you coming?)',
        english: 'Tu ne comprends pas? (Don\'t you understand?)',
        highlight: ['Est-ce que tu ne viens pas', 'Tu ne comprends pas']
      }
    ],
    subsections: [
      {
        title: 'N\'est-ce pas?',
        content: 'Common tag question meaning "isn\'t it?":',
        examples: [
          {
            spanish: 'Il fait beau, n\'est-ce pas? (It\'s nice weather, isn\'t it?)',
            english: 'Tu viens, n\'est-ce pas? (You\'re coming, aren\'t you?)',
            highlight: ['n\'est-ce pas?', 'n\'est-ce pas?']
          }
        ]
      }
    ]
  },
  {
    title: 'Yes/No Question Responses',
    content: `French has specific ways to answer yes/no questions:`,
    examples: [
      {
        spanish: 'Positive answer: Oui (yes)',
        english: 'Negative answer: Non (no)',
        highlight: ['Oui', 'Non']
      },
      {
        spanish: 'Contradicting negative: Si (yes, contradicting)',
        english: '- Tu ne viens pas? - Si! (Aren\'t you coming? - Yes, I am!)',
        highlight: ['Si!']
      }
    ],
    subsections: [
      {
        title: 'Using SI',
        content: 'Si contradicts a negative question or statement:',
        examples: [
          {
            spanish: '- Tu n\'aimes pas le café? - Si, j\'aime!',
            english: '(Don\'t you like coffee? - Yes, I do!)',
            highlight: ['Si, j\'aime!']
          }
        ]
      }
    ]
  },
  {
    title: 'Choosing the Right Method',
    content: `Guidelines for selecting question formation method:`,
    subsections: [
      {
        title: 'Intonation - Informal',
        content: 'Use with friends, family, casual situations:',
        examples: [
          {
            spanish: 'Tu viens? Ça va? On y va?',
            english: 'Perfect for everyday conversation',
            highlight: ['Tu viens?', 'Ça va?', 'On y va?']
          }
        ]
      },
      {
        title: 'Est-ce que - Standard',
        content: 'Use in most situations, safe choice:',
        examples: [
          {
            spanish: 'Est-ce que vous pouvez m\'aider?',
            english: 'Appropriate for most contexts',
            highlight: ['Est-ce que vous pouvez m\'aider?']
          }
        ]
      },
      {
        title: 'Inversion - Formal',
        content: 'Use in writing, formal speech, literature:',
        examples: [
          {
            spanish: 'Pourriez-vous m\'aider?',
            english: 'Professional and academic contexts',
            highlight: ['Pourriez-vous m\'aider?']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Question Formation Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong inversion order**: Mixing up subject-verb order
**2. Missing -t- link**: Forgetting euphonic -t-
**3. Using je inversion**: Using archaic forms
**4. Wrong question word placement**: Misplacing interrogatives`,
    examples: [
      {
        spanish: '❌ Tu parles-vous? → ✅ Parlez-vous?',
        english: 'Wrong: mixed up pronouns',
        highlight: ['Parlez-vous?']
      },
      {
        spanish: '❌ Parle-il? → ✅ Parle-t-il?',
        english: 'Wrong: missing euphonic -t-',
        highlight: ['Parle-t-il?']
      },
      {
        spanish: '❌ Parle-je? → ✅ Est-ce que je parle?',
        english: 'Wrong: je inversion is archaic',
        highlight: ['Est-ce que je parle?']
      },
      {
        spanish: '❌ Est-ce que où tu habites? → ✅ Où est-ce que tu habites?',
        english: 'Wrong: question word placement',
        highlight: ['Où est-ce que tu habites?']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Negative Forms', url: '/grammar/french/verbs/negative-forms', difficulty: 'beginner' },
  { title: 'French Present Tense', url: '/grammar/french/verbs/present-tense', difficulty: 'beginner' },
  { title: 'French Interrogative Pronouns', url: '/grammar/french/pronouns/interrogative', difficulty: 'intermediate' },
  { title: 'French Passé Composé', url: '/grammar/french/verbs/passe-compose', difficulty: 'intermediate' }
];

export default function FrenchInterrogativeFormsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'verbs',
              topic: 'interrogative-forms',
              title: 'French Interrogative Forms (Questions with Inversion, Est-ce que)',
              description: 'Master French question formation using inversion, est-ce que, and intonation. Learn formal and informal interrogative patterns.',
              difficulty: 'intermediate',
              examples: [
                'Parlez-vous français? (Do you speak French?)',
                'Est-ce que tu viens? (Are you coming?)',
                'Tu viens? (You\'re coming?)',
                'Où habitez-vous? (Where do you live?)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'interrogative-forms',
              title: 'French Interrogative Forms (Questions with Inversion, Est-ce que)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="interrogative-forms"
        title="French Interrogative Forms (Questions with Inversion, Est-ce que)"
        description="Master French question formation using inversion, est-ce que, and intonation. Learn formal and informal interrogative patterns"
        difficulty="intermediate"
        estimatedTime={14}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/interrogative-forms/practice"
        quizUrl="/grammar/french/verbs/interrogative-forms/quiz"
        songUrl="/songs/fr?theme=grammar&topic=questions"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
