import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adverbs',
  topic: 'interrogative',
  title: 'French Interrogative Adverbs (Où, Quand, Comment, Pourquoi)',
  description: 'Master French interrogative adverbs including où, quand, comment, pourquoi, combien for asking questions.',
  difficulty: 'intermediate',
  keywords: [
    'french interrogative adverbs',
    'où french where',
    'quand french when',
    'comment french how',
    'pourquoi french why',
    'combien french how much',
    'french question words'
  ],
  examples: [
    'Où habites-tu? (Where do you live?)',
    'Quand arrives-tu? (When do you arrive?)',
    'Comment ça va? (How are you?)',
    'Pourquoi pleures-tu? (Why are you crying?)'
  ]
});

const sections = [
  {
    title: 'Understanding French Interrogative Adverbs',
    content: `French interrogative adverbs are **question words** that ask for specific information about **place, time, manner, reason, or quantity**.

**Main interrogative adverbs:**
- **où**: where (place)
- **quand**: when (time)
- **comment**: how (manner)
- **pourquoi**: why (reason)
- **combien**: how much/many (quantity)

**Key characteristics:**
- **Invariable**: Never change form
- **Question formation**: Can use inversion, est-ce que, or intonation
- **Position**: Usually at the beginning of questions
- **Essential**: Fundamental for asking information questions

These adverbs are crucial for gathering information and engaging in meaningful conversations in French.`,
    examples: [
      {
        spanish: 'Où vas-tu? (Where are you going?)',
        english: 'Asking about place/location',
        highlight: ['Où vas-tu']
      },
      {
        spanish: 'Quand est-ce que tu pars? (When are you leaving?)',
        english: 'Asking about time',
        highlight: ['Quand est-ce que tu pars']
      },
      {
        spanish: 'Comment allez-vous? (How are you?)',
        english: 'Asking about manner/state',
        highlight: ['Comment allez-vous']
      }
    ]
  },
  {
    title: 'OÙ - Where (Place)',
    content: `**OÙ** asks about **location or place**:`,
    examples: [
      {
        spanish: 'Où habites-tu? (Where do you live?)',
        english: 'Où est la gare? (Where is the train station?)',
        highlight: ['Où habites-tu', 'Où est la gare']
      },
      {
        spanish: 'Où allez-vous en vacances? (Where are you going on vacation?)',
        english: 'Où as-tu mis mes clés? (Where did you put my keys?)',
        highlight: ['Où allez-vous', 'Où as-tu mis']
      }
    ],
    subsections: [
      {
        title: 'Different Question Formations',
        content: 'Various ways to ask "where" questions:',
        examples: [
          {
            spanish: 'Où vas-tu? (Where are you going?) - Inversion',
            english: 'Où est-ce que tu vas? (Where are you going?) - Est-ce que',
            highlight: ['Où vas-tu', 'Où est-ce que tu vas']
          },
          {
            spanish: 'Tu vas où? (Where are you going?) - Intonation',
            english: 'Informal spoken French',
            highlight: ['Tu vas où']
          }
        ]
      },
      {
        title: 'OÙ with Prepositions',
        content: 'Combined with prepositions for specific meanings:',
        examples: [
          {
            spanish: 'D\'où viens-tu? (Where do you come from?)',
            english: 'Par où passes-tu? (Which way do you go?)',
            highlight: ['D\'où viens-tu', 'Par où passes-tu']
          }
        ]
      }
    ]
  },
  {
    title: 'QUAND - When (Time)',
    content: `**QUAND** asks about **time or when something happens**:`,
    examples: [
      {
        spanish: 'Quand arrives-tu? (When do you arrive?)',
        english: 'Quand est-ce que le film commence? (When does the movie start?)',
        highlight: ['Quand arrives-tu', 'Quand est-ce que le film commence']
      },
      {
        spanish: 'Quand êtes-vous né? (When were you born?)',
        english: 'Quand partons-nous? (When are we leaving?)',
        highlight: ['Quand êtes-vous né', 'Quand partons-nous']
      }
    ],
    subsections: [
      {
        title: 'Time-Related Questions',
        content: 'Various time contexts:',
        examples: [
          {
            spanish: 'Quand as-tu fini tes devoirs? (When did you finish your homework?)',
            english: 'Quand sera-t-il prêt? (When will it be ready?)',
            highlight: ['Quand as-tu fini', 'Quand sera-t-il prêt']
          }
        ]
      },
      {
        title: 'QUAND vs Relative Use',
        content: 'QUAND can also be used as "when" in statements:',
        examples: [
          {
            spanish: 'Je ne sais pas quand il viendra. (I don\'t know when he\'ll come.)',
            english: 'Dis-moi quand tu seras prêt. (Tell me when you\'re ready.)',
            highlight: ['quand il viendra', 'quand tu seras prêt']
          }
        ]
      }
    ]
  },
  {
    title: 'COMMENT - How (Manner)',
    content: `**COMMENT** asks about **manner, method, or state**:`,
    examples: [
      {
        spanish: 'Comment allez-vous? (How are you?)',
        english: 'Comment ça va? (How are things?)',
        highlight: ['Comment allez-vous', 'Comment ça va']
      },
      {
        spanish: 'Comment fait-on cela? (How does one do that?)',
        english: 'Comment es-tu venu? (How did you come?)',
        highlight: ['Comment fait-on cela', 'Comment es-tu venu']
      }
    ],
    subsections: [
      {
        title: 'Common Expressions with COMMENT',
        content: 'Frequent phrases and greetings:',
        examples: [
          {
            spanish: 'Comment ça va? (How are you?)',
            english: 'Comment vous appelez-vous? (What is your name?)',
            highlight: ['Comment ça va', 'Comment vous appelez-vous']
          }
        ]
      },
      {
        title: 'COMMENT for Method',
        content: 'Asking about how something is done:',
        examples: [
          {
            spanish: 'Comment prépare-t-on ce plat? (How do you prepare this dish?)',
            english: 'Comment dit-on "hello" en français? (How do you say "hello" in French?)',
            highlight: ['Comment prépare-t-on', 'Comment dit-on']
          }
        ]
      }
    ]
  },
  {
    title: 'POURQUOI - Why (Reason)',
    content: `**POURQUOI** asks about **reason or cause**:`,
    examples: [
      {
        spanish: 'Pourquoi pleures-tu? (Why are you crying?)',
        english: 'Pourquoi est-ce que tu pars? (Why are you leaving?)',
        highlight: ['Pourquoi pleures-tu', 'Pourquoi est-ce que tu pars']
      },
      {
        spanish: 'Pourquoi n\'es-tu pas venu? (Why didn\'t you come?)',
        english: 'Pourquoi fait-il si froid? (Why is it so cold?)',
        highlight: ['Pourquoi n\'es-tu pas venu', 'Pourquoi fait-il si froid']
      }
    ],
    subsections: [
      {
        title: 'POURQUOI Responses',
        content: 'Common ways to answer "why" questions:',
        examples: [
          {
            spanish: 'Pourquoi? → Parce que... (Why? → Because...)',
            english: 'Pourquoi? → À cause de... (Why? → Because of...)',
            highlight: ['Parce que', 'À cause de']
          }
        ]
      },
      {
        title: 'POURQUOI PAS',
        content: 'Special expression meaning "why not":',
        examples: [
          {
            spanish: 'Pourquoi pas? (Why not?)',
            english: 'Pourquoi ne viens-tu pas? (Why don\'t you come?)',
            highlight: ['Pourquoi pas', 'Pourquoi ne viens-tu pas']
          }
        ]
      }
    ]
  },
  {
    title: 'COMBIEN - How Much/Many (Quantity)',
    content: `**COMBIEN** asks about **quantity, amount, or number**:`,
    examples: [
      {
        spanish: 'Combien ça coûte? (How much does it cost?)',
        english: 'Combien d\'enfants as-tu? (How many children do you have?)',
        highlight: ['Combien ça coûte', 'Combien d\'enfants as-tu']
      },
      {
        spanish: 'Combien de temps faut-il? (How much time does it take?)',
        english: 'Combien pèses-tu? (How much do you weigh?)',
        highlight: ['Combien de temps', 'Combien pèses-tu']
      }
    ],
    subsections: [
      {
        title: 'COMBIEN DE + Noun',
        content: 'Used with countable nouns:',
        examples: [
          {
            spanish: 'Combien de livres as-tu? (How many books do you have?)',
            english: 'Combien de personnes viennent? (How many people are coming?)',
            highlight: ['Combien de livres', 'Combien de personnes']
          }
        ]
      },
      {
        title: 'COMBIEN alone',
        content: 'Used for prices, weights, measures:',
        examples: [
          {
            spanish: 'Combien coûte ce livre? (How much does this book cost?)',
            english: 'Tu mesures combien? (How tall are you?)',
            highlight: ['Combien coûte', 'Tu mesures combien']
          }
        ]
      }
    ]
  },
  {
    title: 'Question Formation with Interrogative Adverbs',
    content: `Three main ways to form questions with interrogative adverbs:`,
    conjugationTable: {
      title: 'Question Formation Methods',
      conjugations: [
        { pronoun: 'Inversion', form: 'Où vas-tu?', english: 'Formal, written French' },
        { pronoun: 'Est-ce que', form: 'Où est-ce que tu vas?', english: 'Standard spoken French' },
        { pronoun: 'Intonation', form: 'Tu vas où?', english: 'Informal spoken French' }
      ]
    },
    subsections: [
      {
        title: 'Formal Inversion',
        content: 'Subject-verb inversion after interrogative adverb:',
        examples: [
          {
            spanish: 'Où habitez-vous? (Where do you live?)',
            english: 'Quand partez-vous? (When are you leaving?)',
            highlight: ['Où habitez-vous', 'Quand partez-vous']
          }
        ]
      },
      {
        title: 'EST-CE QUE Structure',
        content: 'Most common in spoken French:',
        examples: [
          {
            spanish: 'Où est-ce que vous habitez? (Where do you live?)',
            english: 'Quand est-ce que vous partez? (When are you leaving?)',
            highlight: ['Où est-ce que vous habitez', 'Quand est-ce que vous partez']
          }
        ]
      },
      {
        title: 'Intonation Questions',
        content: 'Interrogative adverb at the end:',
        examples: [
          {
            spanish: 'Vous habitez où? (Where do you live?)',
            english: 'Vous partez quand? (When are you leaving?)',
            highlight: ['Vous habitez où', 'Vous partez quand']
          }
        ]
      }
    ]
  },
  {
    title: 'Other Interrogative Adverbs',
    content: `Additional interrogative adverbs for specific contexts:`,
    examples: [
      {
        spanish: 'Combien de fois? (How many times?)',
        english: 'À quelle heure? (At what time?)',
        highlight: ['Combien de fois', 'À quelle heure']
      },
      {
        spanish: 'Depuis quand? (Since when?)',
        english: 'Jusqu\'à quand? (Until when?)',
        highlight: ['Depuis quand', 'Jusqu\'à quand']
      }
    ],
    subsections: [
      {
        title: 'Time-Specific Adverbs',
        content: 'More precise time questions:',
        examples: [
          {
            spanish: 'À quelle heure commence le film? (What time does the movie start?)',
            english: 'Depuis quand habites-tu ici? (How long have you lived here?)',
            highlight: ['À quelle heure commence', 'Depuis quand habites-tu']
          }
        ]
      }
    ]
  },
  {
    title: 'Interrogative Adverbs in Indirect Questions',
    content: `Used in reported or indirect questions:`,
    examples: [
      {
        spanish: 'Je ne sais pas où il habite. (I don\'t know where he lives.)',
        english: 'Dis-moi quand tu arrives. (Tell me when you arrive.)',
        highlight: ['où il habite', 'quand tu arrives']
      },
      {
        spanish: 'Elle demande comment ça va. (She asks how things are going.)',
        english: 'Il veut savoir pourquoi tu pleures. (He wants to know why you\'re crying.)',
        highlight: ['comment ça va', 'pourquoi tu pleures']
      }
    ],
    subsections: [
      {
        title: 'No Inversion in Indirect Questions',
        content: 'Normal word order in indirect questions:',
        examples: [
          {
            spanish: 'Direct: Où vas-tu? → Indirect: Je demande où tu vas.',
            english: 'Direct: Quand pars-tu? → Indirect: Il veut savoir quand tu pars.',
            highlight: ['où tu vas', 'quand tu pars']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Expressions and Idioms',
    content: `Fixed expressions with interrogative adverbs:`,
    examples: [
      {
        spanish: 'Comment ça va? (How are you?)',
        english: 'Où ça? (Where?)',
        highlight: ['Comment ça va', 'Où ça']
      },
      {
        spanish: 'Pourquoi pas? (Why not?)',
        english: 'Comment ça se fait? (How come?)',
        highlight: ['Pourquoi pas', 'Comment ça se fait']
      }
    ],
    subsections: [
      {
        title: 'Greeting Expressions',
        content: 'Common social interactions:',
        examples: [
          {
            spanish: 'Comment allez-vous? (How are you?) - Formal',
            english: 'Comment tu vas? (How are you?) - Informal',
            highlight: ['Comment allez-vous', 'Comment tu vas']
          }
        ]
      }
    ]
  },
  {
    title: 'Register and Formality',
    content: `Different levels of formality with interrogative adverbs:`,
    conjugationTable: {
      title: 'Formality Levels',
      conjugations: [
        { pronoun: 'Very formal', form: 'Où demeurez-vous?', english: 'Where do you reside?' },
        { pronoun: 'Formal', form: 'Où habitez-vous?', english: 'Where do you live?' },
        { pronoun: 'Standard', form: 'Où est-ce que vous habitez?', english: 'Where do you live?' },
        { pronoun: 'Informal', form: 'Vous habitez où?', english: 'Where do you live?' }
      ]
    }
  },
  {
    title: 'Common Mistakes with Interrogative Adverbs',
    content: `Here are frequent errors students make:

**1. Wrong question formation**: Incorrect word order or structure
**2. Confusing similar adverbs**: Mixing up meanings
**3. Missing prepositions**: Forgetting required prepositions
**4. Formality mismatches**: Wrong register for context`,
    examples: [
      {
        spanish: '❌ Où tu vas? → ✅ Où vas-tu? or Où est-ce que tu vas?',
        english: 'Wrong: missing inversion or est-ce que in formal questions',
        highlight: ['Où vas-tu', 'Où est-ce que tu vas']
      },
      {
        spanish: '❌ Combien enfants as-tu? → ✅ Combien d\'enfants as-tu?',
        english: 'Wrong: missing "de" with countable nouns',
        highlight: ['Combien d\'enfants as-tu']
      },
      {
        spanish: '❌ Comment tu t\'appelles? → ✅ Comment t\'appelles-tu?',
        english: 'Wrong: need inversion with reflexive verbs',
        highlight: ['Comment t\'appelles-tu']
      },
      {
        spanish: '❌ Pourquoi tu ne viens pas? → ✅ Pourquoi ne viens-tu pas?',
        english: 'Wrong: inversion needed in formal questions',
        highlight: ['Pourquoi ne viens-tu pas']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Question Formation', url: '/grammar/french/syntax/questions', difficulty: 'intermediate' },
  { title: 'French Interrogative Adjectives', url: '/grammar/french/adjectives/interrogative-adjectives', difficulty: 'intermediate' },
  { title: 'French Interrogative Pronouns', url: '/grammar/french/pronouns/interrogative', difficulty: 'intermediate' },
  { title: 'French Inversion', url: '/grammar/french/verbs/interrogative-forms', difficulty: 'intermediate' }
];

export default function FrenchInterrogativeAdverbsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'adverbs',
              topic: 'interrogative',
              title: 'French Interrogative Adverbs (Où, Quand, Comment, Pourquoi)',
              description: 'Master French interrogative adverbs including où, quand, comment, pourquoi, combien for asking questions.',
              difficulty: 'intermediate',
              examples: [
                'Où habites-tu? (Where do you live?)',
                'Quand arrives-tu? (When do you arrive?)',
                'Comment ça va? (How are you?)',
                'Pourquoi pleures-tu? (Why are you crying?)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adverbs',
              topic: 'interrogative',
              title: 'French Interrogative Adverbs (Où, Quand, Comment, Pourquoi)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adverbs"
        topic="interrogative"
        title="French Interrogative Adverbs (Où, Quand, Comment, Pourquoi)"
        description="Master French interrogative adverbs including où, quand, comment, pourquoi, combien for asking questions"
        difficulty="intermediate"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/french/adverbs"
        practiceUrl="/grammar/french/adverbs/interrogative/practice"
        quizUrl="/grammar/french/adverbs/interrogative/quiz"
        songUrl="/songs/fr?theme=grammar&topic=interrogative"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
