import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'syntax',
  topic: 'questions',
  title: 'French Question Formation (Est-ce Que, Inversion, Intonation)',
  description: 'Master French question formation with est-ce que, inversion, and intonation. Learn yes/no questions, wh-questions, and interrogative patterns.',
  difficulty: 'intermediate',
  keywords: [
    'french questions',
    'est-ce que french',
    'french inversion',
    'interrogative french',
    'asking questions french',
    'french question words'
  ],
  examples: [
    'Est-ce que tu viens? (Are you coming?)',
    'Viens-tu? (Are you coming?)',
    'Tu viens? (You\'re coming?)',
    'Où vas-tu? (Where are you going?)'
  ]
});

const sections = [
  {
    title: 'Understanding French Questions',
    content: `French has **three main ways** to form questions, each with different levels of formality:

**1. Intonation** (informal) - rising tone
**2. Est-ce que** (standard) - question phrase
**3. Inversion** (formal) - verb-subject reversal

French also uses specific **interrogative words** (qui, que, où, quand, comment, pourquoi) and has particular rules for **yes/no questions** vs **information questions**.

Mastering French question formation is essential for conversations, interviews, and formal communication.`,
    examples: [
      {
        spanish: 'Tu viens? (You\'re coming?) - intonation',
        english: 'Rising tone makes it a question',
        highlight: ['Tu viens?']
      },
      {
        spanish: 'Est-ce que tu viens? (Are you coming?) - est-ce que',
        english: 'Standard question formation',
        highlight: ['Est-ce que tu viens?']
      },
      {
        spanish: 'Viens-tu? (Are you coming?) - inversion',
        english: 'Formal question formation',
        highlight: ['Viens-tu?']
      }
    ]
  },
  {
    title: 'Intonation Questions (Informal)',
    content: `The simplest way to form questions is by **raising your voice** at the end of a statement:`,
    examples: [
      {
        spanish: 'Tu parles français? (You speak French?)',
        english: 'Simple rising intonation',
        highlight: ['Tu parles français?']
      },
      {
        spanish: 'Il vient demain? (He\'s coming tomorrow?)',
        english: 'Confirming information',
        highlight: ['Il vient demain?']
      },
      {
        spanish: 'Vous habitez ici? (You live here?)',
        english: 'Casual inquiry',
        highlight: ['Vous habitez ici?']
      }
    ],
    subsections: [
      {
        title: 'When to Use Intonation',
        content: 'Appropriate contexts for intonation questions:',
        examples: [
          {
            spanish: 'Informal conversations with friends',
            english: 'Confirming information you think you know',
            highlight: ['Informal', 'Confirming']
          },
          {
            spanish: 'Quick yes/no questions',
            english: 'Casual everyday interactions',
            highlight: ['Quick yes/no', 'Casual']
          }
        ]
      },
      {
        title: 'Intonation Patterns',
        content: 'How to use rising intonation:',
        examples: [
          {
            spanish: 'Statement: Tu viens. [falling tone]',
            english: 'Question: Tu viens? [rising tone]',
            highlight: ['Tu viens.', 'Tu viens?']
          }
        ]
      }
    ]
  },
  {
    title: 'EST-CE QUE Questions (Standard)',
    content: `**Est-ce que** is the most common formal way to ask questions:`,
    examples: [
      {
        spanish: 'Est-ce que tu viens? (Are you coming?)',
        english: 'Standard yes/no question',
        highlight: ['Est-ce que tu viens?']
      },
      {
        spanish: 'Est-ce qu\'il parle français? (Does he speak French?)',
        english: 'With elision before vowel',
        highlight: ['Est-ce qu\'il parle français?']
      },
      {
        spanish: 'Est-ce que vous comprenez? (Do you understand?)',
        english: 'Polite inquiry',
        highlight: ['Est-ce que vous comprenez?']
      }
    ],
    subsections: [
      {
        title: 'EST-CE QUE Formation',
        content: 'How to form est-ce que questions:',
        conjugationTable: {
          title: 'EST-CE QUE Pattern',
          conjugations: [
            { pronoun: 'Basic pattern', form: 'Est-ce que + subject + verb', english: 'Est-ce que tu viens?' },
            { pronoun: 'With elision', form: 'Est-ce qu\' + vowel', english: 'Est-ce qu\'il vient?' },
            { pronoun: 'All tenses', form: 'Same pattern', english: 'Est-ce que tu es venu?' },
            { pronoun: 'All persons', form: 'Same pattern', english: 'Est-ce qu\'elle viendra?' }
          ]
        }
      },
      {
        title: 'EST-CE QUE Advantages',
        content: 'Why est-ce que is popular:',
        examples: [
          {
            spanish: 'No word order changes needed',
            english: 'Works with all verbs and tenses',
            highlight: ['No changes', 'All verbs']
          },
          {
            spanish: 'Clear question marker',
            english: 'Appropriate for most situations',
            highlight: ['Clear marker', 'Most situations']
          }
        ]
      }
    ]
  },
  {
    title: 'Inversion Questions (Formal)',
    content: `**Inversion** reverses the subject and verb, connected by a hyphen:`,
    examples: [
      {
        spanish: 'Viens-tu? (Are you coming?)',
        english: 'Simple inversion',
        highlight: ['Viens-tu?']
      },
      {
        spanish: 'Parlez-vous français? (Do you speak French?)',
        english: 'Formal inquiry',
        highlight: ['Parlez-vous français?']
      },
      {
        spanish: 'Avez-vous compris? (Did you understand?)',
        english: 'Compound tense inversion',
        highlight: ['Avez-vous compris?']
      }
    ],
    subsections: [
      {
        title: 'Simple Inversion Rules',
        content: 'Basic inversion patterns:',
        examples: [
          {
            spanish: 'Tu viens → Viens-tu? (Are you coming?)',
            english: 'Vous parlez → Parlez-vous? (Do you speak?)',
            highlight: ['Viens-tu?', 'Parlez-vous?']
          }
        ]
      },
      {
        title: 'Euphonic T',
        content: 'Adding -t- between vowels:',
        examples: [
          {
            spanish: 'Il arrive → Arrive-t-il? (Is he arriving?)',
            english: 'Elle aime → Aime-t-elle? (Does she like?)',
            highlight: ['Arrive-t-il?', 'Aime-t-elle?']
          }
        ]
      },
      {
        title: 'Noun Subject Inversion',
        content: 'With noun subjects, add pronoun:',
        examples: [
          {
            spanish: 'Marie vient-elle? (Is Marie coming?)',
            english: 'Les étudiants comprennent-ils? (Do the students understand?)',
            highlight: ['Marie vient-elle?', 'Les étudiants comprennent-ils?']
          }
        ]
      },
      {
        title: 'Compound Tense Inversion',
        content: 'Invert auxiliary verb only:',
        conjugationTable: {
          title: 'Compound Inversion',
          conjugations: [
            { pronoun: 'Passé composé', form: 'auxiliary + subject + participle', english: 'As-tu mangé?' },
            { pronoun: 'Plus-que-parfait', form: 'auxiliary + subject + participle', english: 'Avais-tu fini?' },
            { pronoun: 'Future perfect', form: 'auxiliary + subject + participle', english: 'Auras-tu terminé?' }
          ]
        }
      }
    ]
  },
  {
    title: 'WH-Questions (Information Questions)',
    content: `Questions asking for specific information use interrogative words:`,
    examples: [
      {
        spanish: 'Où vas-tu? (Where are you going?)',
        english: 'Asking for location',
        highlight: ['Où vas-tu?']
      },
      {
        spanish: 'Quand viens-tu? (When are you coming?)',
        english: 'Asking for time',
        highlight: ['Quand viens-tu?']
      },
      {
        spanish: 'Comment allez-vous? (How are you?)',
        english: 'Asking for manner/state',
        highlight: ['Comment allez-vous?']
      }
    ],
    subsections: [
      {
        title: 'Interrogative Words',
        content: 'Main question words:',
        conjugationTable: {
          title: 'Question Words',
          conjugations: [
            { pronoun: 'Qui', form: 'who', english: 'Qui vient? (Who is coming?)' },
            { pronoun: 'Que/Qu\'est-ce que', form: 'what', english: 'Que fais-tu? / Qu\'est-ce que tu fais?' },
            { pronoun: 'Où', form: 'where', english: 'Où habites-tu?' },
            { pronoun: 'Quand', form: 'when', english: 'Quand pars-tu?' },
            { pronoun: 'Comment', form: 'how', english: 'Comment vas-tu?' },
            { pronoun: 'Pourquoi', form: 'why', english: 'Pourquoi pleures-tu?' }
          ]
        }
      },
      {
        title: 'QUE vs QU\'EST-CE QUE',
        content: 'Two ways to ask "what":',
        examples: [
          {
            spanish: 'Que fais-tu? (What are you doing?) - formal inversion',
            english: 'Qu\'est-ce que tu fais? (What are you doing?) - standard',
            highlight: ['Que fais-tu?', 'Qu\'est-ce que tu fais?']
          }
        ]
      },
      {
        title: 'QUI Questions',
        content: 'Asking about people:',
        examples: [
          {
            spanish: 'Qui est-ce? (Who is it?)',
            english: 'Qui vient avec nous? (Who is coming with us?)',
            highlight: ['Qui est-ce?', 'Qui vient avec nous?']
          }
        ]
      }
    ]
  },
  {
    title: 'QUEL Questions (Which/What)',
    content: `**Quel** agrees with the noun it modifies:`,
    examples: [
      {
        spanish: 'Quel livre lis-tu? (Which book are you reading?)',
        english: 'Masculine singular',
        highlight: ['Quel livre']
      },
      {
        spanish: 'Quelle heure est-il? (What time is it?)',
        english: 'Feminine singular',
        highlight: ['Quelle heure']
      },
      {
        spanish: 'Quels films aimes-tu? (Which movies do you like?)',
        english: 'Masculine plural',
        highlight: ['Quels films']
      }
    ],
    subsections: [
      {
        title: 'QUEL Agreement',
        content: 'All forms of quel:',
        conjugationTable: {
          title: 'QUEL Forms',
          conjugations: [
            { pronoun: 'Masculine singular', form: 'quel', english: 'Quel jour? (Which day?)' },
            { pronoun: 'Feminine singular', form: 'quelle', english: 'Quelle couleur? (Which color?)' },
            { pronoun: 'Masculine plural', form: 'quels', english: 'Quels livres? (Which books?)' },
            { pronoun: 'Feminine plural', form: 'quelles', english: 'Quelles voitures? (Which cars?)' }
          ]
        }
      },
      {
        title: 'QUEL with ÊTRE',
        content: 'Quel as predicate adjective:',
        examples: [
          {
            spanish: 'Quel est ton nom? (What is your name?)',
            english: 'Quelle est ta nationalité? (What is your nationality?)',
            highlight: ['Quel est ton nom?', 'Quelle est ta nationalité?']
          }
        ]
      }
    ]
  },
  {
    title: 'Question Responses',
    content: `How to respond to different types of questions:`,
    subsections: [
      {
        title: 'Yes/No Responses',
        content: 'Responding to yes/no questions:',
        examples: [
          {
            spanish: 'Tu viens? - Oui. / Non. (Are you coming? - Yes. / No.)',
            english: 'Basic yes/no responses',
            highlight: ['Oui.', 'Non.']
          },
          {
            spanish: 'Tu ne viens pas? - Si. (Aren\'t you coming? - Yes, I am.)',
            english: 'Si contradicts negative questions',
            highlight: ['Si.']
          }
        ]
      },
      {
        title: 'Information Responses',
        content: 'Responding to wh-questions:',
        examples: [
          {
            spanish: 'Où vas-tu? - À Paris. (Where are you going? - To Paris.)',
            english: 'Quand pars-tu? - Demain. (When are you leaving? - Tomorrow.)',
            highlight: ['À Paris.', 'Demain.']
          }
        ]
      }
    ]
  },
  {
    title: 'Indirect Questions',
    content: `Questions embedded in statements:`,
    examples: [
      {
        spanish: 'Je ne sais pas où il va. (I don\'t know where he\'s going.)',
        english: 'Embedded question',
        highlight: ['où il va']
      },
      {
        spanish: 'Dis-moi ce que tu veux. (Tell me what you want.)',
        english: 'Indirect question with ce que',
        highlight: ['ce que tu veux']
      }
    ],
    subsections: [
      {
        title: 'Indirect Question Formation',
        content: 'No inversion in indirect questions:',
        examples: [
          {
            spanish: 'Direct: Où vas-tu? (Where are you going?)',
            english: 'Indirect: Je demande où tu vas. (I ask where you\'re going.)',
            highlight: ['Où vas-tu?', 'où tu vas']
          }
        ]
      }
    ]
  },
  {
    title: 'Question Tags and Confirmation',
    content: `Ways to seek confirmation:`,
    examples: [
      {
        spanish: 'Tu viens, n\'est-ce pas? (You\'re coming, aren\'t you?)',
        english: 'Confirmation tag',
        highlight: ['n\'est-ce pas?']
      },
      {
        spanish: 'Il fait beau, non? (It\'s nice weather, isn\'t it?)',
        english: 'Informal confirmation',
        highlight: ['non?']
      }
    ],
    subsections: [
      {
        title: 'Confirmation Expressions',
        content: 'Common confirmation tags:',
        conjugationTable: {
          title: 'Question Tags',
          conjugations: [
            { pronoun: 'n\'est-ce pas?', form: 'isn\'t it?/aren\'t you?', english: 'formal confirmation' },
            { pronoun: 'non?', form: 'no?/right?', english: 'informal confirmation' },
            { pronoun: 'hein?', form: 'eh?/right?', english: 'very informal' },
            { pronoun: 'd\'accord?', form: 'okay?/agreed?', english: 'seeking agreement' }
          ]
        }
      }
    ]
  },
  {
    title: 'Common Question Formation Mistakes',
    content: `Here are frequent errors students make:

**1. Missing inversion hyphen**: Forgetting hyphen in formal questions
**2. Wrong euphonic t**: Incorrect use of -t- in inversion
**3. Double inversion**: Inverting both auxiliary and main verb
**4. Que vs qu'est-ce que**: Using wrong form for "what"`,
    examples: [
      {
        spanish: '❌ Viens tu? → ✅ Viens-tu?',
        english: 'Wrong: must use hyphen in inversion',
        highlight: ['Viens-tu?']
      },
      {
        spanish: '❌ Parle-t-tu? → ✅ Parles-tu?',
        english: 'Wrong: no -t- needed when verb ends in consonant',
        highlight: ['Parles-tu?']
      },
      {
        spanish: '❌ As-tu-mangé? → ✅ As-tu mangé?',
        english: 'Wrong: only invert auxiliary in compound tenses',
        highlight: ['As-tu mangé?']
      },
      {
        spanish: '❌ Que est-ce que tu fais? → ✅ Qu\'est-ce que tu fais?',
        english: 'Wrong: must use qu\'est-ce que, not que est-ce que',
        highlight: ['Qu\'est-ce que tu fais?']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Negation', url: '/grammar/french/syntax/negation', difficulty: 'intermediate' },
  { title: 'French Relative Pronouns', url: '/grammar/french/pronouns/relative-pronouns', difficulty: 'advanced' },
  { title: 'French Inversion Rules', url: '/grammar/french/syntax/inversion', difficulty: 'advanced' },
  { title: 'French Interrogative Adjectives', url: '/grammar/french/adjectives/interrogative', difficulty: 'intermediate' }
];

export default function FrenchQuestionsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'syntax',
              topic: 'questions',
              title: 'French Question Formation (Est-ce Que, Inversion, Intonation)',
              description: 'Master French question formation with est-ce que, inversion, and intonation. Learn yes/no questions, wh-questions, and interrogative patterns.',
              difficulty: 'intermediate',
              examples: [
                'Est-ce que tu viens? (Are you coming?)',
                'Viens-tu? (Are you coming?)',
                'Tu viens? (You\'re coming?)',
                'Où vas-tu? (Where are you going?)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'syntax',
              topic: 'questions',
              title: 'French Question Formation (Est-ce Que, Inversion, Intonation)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="syntax"
        topic="questions"
        title="French Question Formation (Est-ce Que, Inversion, Intonation)"
        description="Master French question formation with est-ce que, inversion, and intonation. Learn yes/no questions, wh-questions, and interrogative patterns"
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/french/syntax"
        practiceUrl="/grammar/french/syntax/questions/practice"
        quizUrl="/grammar/french/syntax/questions/quiz"
        songUrl="/songs/fr?theme=grammar&topic=questions"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
