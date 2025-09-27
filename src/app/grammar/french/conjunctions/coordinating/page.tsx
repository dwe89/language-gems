import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'conjunctions',
  topic: 'coordinating',
  title: 'French Coordinating Conjunctions (Et, Ou, Mais, Donc, Car)',
  description: 'Master French coordinating conjunctions for connecting words, phrases, and clauses. Learn et, ou, mais, donc, car with usage and examples.',
  difficulty: 'beginner',
  keywords: [
    'french coordinating conjunctions',
    'et ou mais french',
    'donc car french',
    'connecting words french',
    'french grammar conjunctions',
    'linking words french'
  ],
  examples: [
    'Je mange et je bois (I eat and I drink)',
    'Tu veux du thé ou du café? (Do you want tea or coffee?)',
    'Il est fatigué mais il travaille (He is tired but he works)',
    'Il pleut donc je reste (It\'s raining so I stay)'
  ]
});

const sections = [
  {
    title: 'Understanding Coordinating Conjunctions',
    content: `French coordinating conjunctions **connect words, phrases, or clauses** of equal grammatical importance. They create relationships between ideas without making one subordinate to the other.

The main French coordinating conjunctions are:
**Et** (and) - addition
**Ou** (or) - choice/alternative  
**Mais** (but) - contrast/opposition
**Donc** (so/therefore) - consequence
**Car** (because/for) - reason

These conjunctions are essential for creating flowing, connected discourse in French.`,
    examples: [
      {
        spanish: 'Marie et Pierre viennent. (Marie and Pierre are coming.)',
        english: 'Et connects two subjects',
        highlight: ['Marie et Pierre']
      },
      {
        spanish: 'Il est intelligent mais paresseux. (He is intelligent but lazy.)',
        english: 'Mais shows contrast',
        highlight: ['mais paresseux']
      },
      {
        spanish: 'Il pleut donc nous restons. (It\'s raining so we stay.)',
        english: 'Donc shows consequence',
        highlight: ['donc nous restons']
      }
    ]
  },
  {
    title: 'ET - And (Addition)',
    content: `**Et** is the most common coordinating conjunction, expressing addition or connection:`,
    examples: [
      {
        spanish: 'Je mange et je bois. (I eat and I drink.)',
        english: 'Connecting two actions',
        highlight: ['mange et je bois']
      },
      {
        spanish: 'Marie et Pierre sont amis. (Marie and Pierre are friends.)',
        english: 'Connecting two subjects',
        highlight: ['Marie et Pierre']
      },
      {
        spanish: 'Il est grand et fort. (He is tall and strong.)',
        english: 'Connecting two adjectives',
        highlight: ['grand et fort']
      }
    ],
    subsections: [
      {
        title: 'ET Usage Patterns',
        content: 'Different ways to use et:',
        conjugationTable: {
          title: 'ET Connections',
          conjugations: [
            { pronoun: 'Subjects', form: 'Pierre et Marie', english: 'Pierre et Marie viennent.' },
            { pronoun: 'Verbs', form: 'mange et boit', english: 'Il mange et boit.' },
            { pronoun: 'Adjectives', form: 'beau et intelligent', english: 'Il est beau et intelligent.' },
            { pronoun: 'Nouns', form: 'livres et cahiers', english: 'J\'ai des livres et des cahiers.' }
          ]
        }
      },
      {
        title: 'ET in Lists',
        content: 'Using et in series:',
        examples: [
          {
            spanish: 'J\'aime les pommes, les poires et les oranges. (I like apples, pears, and oranges.)',
            english: 'Et comes before the last item',
            highlight: ['et les oranges']
          },
          {
            spanish: 'Il parle français, anglais et espagnol. (He speaks French, English, and Spanish.)',
            english: 'Languages in a series',
            highlight: ['et espagnol']
          }
        ]
      },
      {
        title: 'ET vs Repetition',
        content: 'When to repeat et vs use once:',
        examples: [
          {
            spanish: 'Single et: Pierre et Marie (Pierre and Marie)',
            english: 'Repeated et: et Pierre et Marie et Jean (both Pierre and Marie and Jean)',
            highlight: ['Pierre et Marie', 'et Pierre et Marie et Jean']
          }
        ]
      }
    ]
  },
  {
    title: 'OU - Or (Choice/Alternative)',
    content: `**Ou** expresses choice, alternative, or possibility:`,
    examples: [
      {
        spanish: 'Tu veux du thé ou du café? (Do you want tea or coffee?)',
        english: 'Choice between options',
        highlight: ['thé ou du café']
      },
      {
        spanish: 'Il viendra lundi ou mardi. (He\'ll come Monday or Tuesday.)',
        english: 'Alternative days',
        highlight: ['lundi ou mardi']
      },
      {
        spanish: 'Prends le bus ou le métro. (Take the bus or the metro.)',
        english: 'Transportation options',
        highlight: ['bus ou le métro']
      }
    ],
    subsections: [
      {
        title: 'OU vs OÙ',
        content: 'Important distinction between ou and où:',
        examples: [
          {
            spanish: 'Ou (or): Tu veux ça ou ça? (Do you want this or that?)',
            english: 'Où (where): Où vas-tu? (Where are you going?)',
            highlight: ['ou ça', 'Où vas-tu']
          }
        ]
      },
      {
        title: 'OU...OU (Either...Or)',
        content: 'Emphasizing exclusive choice:',
        examples: [
          {
            spanish: 'Ou tu viens ou tu restes. (Either you come or you stay.)',
            english: 'Ou il réussit ou il échoue. (Either he succeeds or he fails.)',
            highlight: ['Ou tu viens ou', 'Ou il réussit ou']
          }
        ]
      },
      {
        title: 'OU in Questions',
        content: 'Using ou in interrogative contexts:',
        examples: [
          {
            spanish: 'Café ou thé? (Coffee or tea?)',
            english: 'Tu préfères quoi ou quoi? (What do you prefer or what?)',
            highlight: ['Café ou thé', 'quoi ou quoi']
          }
        ]
      }
    ]
  },
  {
    title: 'MAIS - But (Contrast/Opposition)',
    content: `**Mais** expresses contrast, opposition, or contradiction:`,
    examples: [
      {
        spanish: 'Il est fatigué mais il travaille. (He is tired but he works.)',
        english: 'Contrasting states and actions',
        highlight: ['fatigué mais il travaille']
      },
      {
        spanish: 'Elle est petite mais forte. (She is small but strong.)',
        english: 'Contrasting physical qualities',
        highlight: ['petite mais forte']
      },
      {
        spanish: 'J\'aime le français mais c\'est difficile. (I like French but it\'s difficult.)',
        english: 'Contrasting feelings and reality',
        highlight: ['aime le français mais']
      }
    ],
    subsections: [
      {
        title: 'MAIS Usage Types',
        content: 'Different types of contrast with mais:',
        examples: [
          {
            spanish: 'Opposition: Il est riche mais malheureux. (He is rich but unhappy.)',
            english: 'Correction: Non pas rouge mais bleu. (Not red but blue.)',
            highlight: ['riche mais malheureux', 'pas rouge mais bleu']
          },
          {
            spanish: 'Concession: Il pleut mais nous sortons. (It\'s raining but we\'re going out.)',
            english: 'Restriction: Il vient mais pas longtemps. (He\'s coming but not for long.)',
            highlight: ['pleut mais nous sortons', 'vient mais pas longtemps']
          }
        ]
      },
      {
        title: 'MAIS vs CEPENDANT',
        content: 'Mais vs more formal alternatives:',
        examples: [
          {
            spanish: 'Mais: informal/common: Il est tard mais je sors. (It\'s late but I\'m going out.)',
            english: 'Cependant: formal: Il est tard, cependant je sors. (It\'s late, however I\'m going out.)',
            highlight: ['tard mais je sors', 'tard, cependant je sors']
          }
        ]
      }
    ]
  },
  {
    title: 'DONC - So/Therefore (Consequence)',
    content: `**Donc** expresses logical consequence or conclusion:`,
    examples: [
      {
        spanish: 'Il pleut donc je reste. (It\'s raining so I stay.)',
        english: 'Logical consequence',
        highlight: ['pleut donc je reste']
      },
      {
        spanish: 'Je suis fatigué donc je dors. (I\'m tired so I sleep.)',
        english: 'Natural conclusion',
        highlight: ['fatigué donc je dors']
      },
      {
        spanish: 'Tu as raison donc j\'accepte. (You\'re right so I accept.)',
        english: 'Reasoned decision',
        highlight: ['raison donc j\'accepte']
      }
    ],
    subsections: [
      {
        title: 'DONC Placement',
        content: 'Where to place donc in sentences:',
        examples: [
          {
            spanish: 'Beginning: Donc, tu viens? (So, are you coming?)',
            english: 'Middle: Il pleut donc nous restons. (It\'s raining so we stay.)',
            highlight: ['Donc, tu viens', 'pleut donc nous restons']
          }
        ]
      },
      {
        title: 'DONC vs ALORS',
        content: 'Distinction between donc and alors:',
        examples: [
          {
            spanish: 'Donc: logical conclusion: Il est malade donc il reste. (He\'s sick so he stays.)',
            english: 'Alors: temporal/narrative: Alors, il est parti. (Then, he left.)',
            highlight: ['malade donc il reste', 'Alors, il est parti']
          }
        ]
      }
    ]
  },
  {
    title: 'CAR - Because/For (Reason)',
    content: `**Car** expresses reason or cause (more formal than parce que):`,
    examples: [
      {
        spanish: 'Il reste car il pleut. (He stays because it\'s raining.)',
        english: 'Giving a reason',
        highlight: ['reste car il pleut']
      },
      {
        spanish: 'Elle est heureuse car elle a réussi. (She is happy because she succeeded.)',
        english: 'Explaining a state',
        highlight: ['heureuse car elle a réussi']
      },
      {
        spanish: 'Nous partons car c\'est tard. (We\'re leaving because it\'s late.)',
        english: 'Justifying an action',
        highlight: ['partons car c\'est tard']
      }
    ],
    subsections: [
      {
        title: 'CAR vs PARCE QUE',
        content: 'Distinction between car and parce que:',
        examples: [
          {
            spanish: 'Car: formal, written: Il reste car il pleut. (He stays for it\'s raining.)',
            english: 'Parce que: common, spoken: Il reste parce qu\'il pleut. (He stays because it\'s raining.)',
            highlight: ['car il pleut', 'parce qu\'il pleut']
          }
        ]
      },
      {
        title: 'CAR Placement',
        content: 'Car typically comes between clauses:',
        examples: [
          {
            spanish: 'Je suis content car tu es là. (I\'m happy because you\'re here.)',
            english: 'Car connects the main clause to the reason',
            highlight: ['content car tu es là']
          }
        ]
      }
    ]
  },
  {
    title: 'Other Coordinating Conjunctions',
    content: `Additional coordinating conjunctions in French:`,
    subsections: [
      {
        title: 'NI...NI (Neither...Nor)',
        content: 'Expressing double negation:',
        examples: [
          {
            spanish: 'Il ne mange ni viande ni poisson. (He eats neither meat nor fish.)',
            english: 'Je ne bois ni café ni thé. (I drink neither coffee nor tea.)',
            highlight: ['ni viande ni poisson', 'ni café ni thé']
          }
        ]
      },
      {
        title: 'SOIT...SOIT (Either...Or)',
        content: 'More formal alternative to ou...ou:',
        examples: [
          {
            spanish: 'Soit tu viens soit tu restes. (Either you come or you stay.)',
            english: 'Soit lundi soit mardi. (Either Monday or Tuesday.)',
            highlight: ['Soit tu viens soit', 'Soit lundi soit']
          }
        ]
      },
      {
        title: 'OR (Now/But)',
        content: 'Formal conjunction for introducing new information:',
        examples: [
          {
            spanish: 'Il était malade. Or, il est venu quand même. (He was sick. Now, he came anyway.)',
            english: 'Formal transition in reasoning',
            highlight: ['Or, il est venu']
          }
        ]
      }
    ]
  },
  {
    title: 'Coordinating Conjunction Combinations',
    content: `How to combine multiple coordinating conjunctions:`,
    examples: [
      {
        spanish: 'Il est intelligent et travailleur mais parfois paresseux. (He is intelligent and hardworking but sometimes lazy.)',
        english: 'Combining et and mais',
        highlight: ['et travailleur mais parfois']
      },
      {
        spanish: 'Tu peux venir ou rester, mais décide vite. (You can come or stay, but decide quickly.)',
        english: 'Combining ou and mais',
        highlight: ['venir ou rester, mais décide']
      }
    ],
    subsections: [
      {
        title: 'Punctuation with Conjunctions',
        content: 'When to use commas with coordinating conjunctions:',
        conjugationTable: {
          title: 'Punctuation Rules',
          conjugations: [
            { pronoun: 'Short clauses', form: 'no comma', english: 'Il mange et il boit.' },
            { pronoun: 'Long clauses', form: 'comma before', english: 'Il mange beaucoup, et il boit aussi.' },
            { pronoun: 'Contrast (mais)', form: 'often comma', english: 'Il est fatigué, mais il travaille.' },
            { pronoun: 'Lists', form: 'commas between', english: 'Pommes, poires, et oranges.' }
          ]
        }
      }
    ]
  },
  {
    title: 'Common Coordinating Conjunction Mistakes',
    content: `Here are frequent errors students make:

**1. OU vs OÙ confusion**: Using ou instead of où for location
**2. Missing ne with ni**: Forgetting negation with ni...ni
**3. Wrong conjunction choice**: Using car in spoken French instead of parce que
**4. Overusing et**: Connecting too many clauses with et`,
    examples: [
      {
        spanish: '❌ Ou vas-tu? → ✅ Où vas-tu?',
        english: 'Wrong: où (where) has accent, ou (or) doesn\'t',
        highlight: ['Où vas-tu']
      },
      {
        spanish: '❌ Il mange ni viande ni poisson → ✅ Il ne mange ni viande ni poisson',
        english: 'Wrong: ni...ni requires ne',
        highlight: ['ne mange ni viande ni poisson']
      },
      {
        spanish: '❌ Je viens car je veux (spoken) → ✅ Je viens parce que je veux',
        english: 'Wrong: use parce que in spoken French, car in formal writing',
        highlight: ['parce que je veux']
      },
      {
        spanish: '❌ Il mange et il boit et il dort et il travaille → ✅ Il mange, boit, dort et travaille',
        english: 'Wrong: avoid repetitive et, use commas in lists',
        highlight: ['mange, boit, dort et travaille']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Subordinating Conjunctions', url: '/grammar/french/conjunctions/subordinating', difficulty: 'intermediate' },
  { title: 'French Sentence Structure', url: '/grammar/french/syntax/sentence-structure', difficulty: 'intermediate' },
  { title: 'French Negation', url: '/grammar/french/syntax/negation', difficulty: 'intermediate' },
  { title: 'French Punctuation', url: '/grammar/french/writing/punctuation', difficulty: 'beginner' }
];

export default function FrenchCoordinatingConjunctionsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'conjunctions',
              topic: 'coordinating',
              title: 'French Coordinating Conjunctions (Et, Ou, Mais, Donc, Car)',
              description: 'Master French coordinating conjunctions for connecting words, phrases, and clauses. Learn et, ou, mais, donc, car with usage and examples.',
              difficulty: 'beginner',
              examples: [
                'Je mange et je bois (I eat and I drink)',
                'Tu veux du thé ou du café? (Do you want tea or coffee?)',
                'Il est fatigué mais il travaille (He is tired but he works)',
                'Il pleut donc je reste (It\'s raining so I stay)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'conjunctions',
              topic: 'coordinating',
              title: 'French Coordinating Conjunctions (Et, Ou, Mais, Donc, Car)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="conjunctions"
        topic="coordinating"
        title="French Coordinating Conjunctions (Et, Ou, Mais, Donc, Car)"
        description="Master French coordinating conjunctions for connecting words, phrases, and clauses. Learn et, ou, mais, donc, car with usage and examples"
        difficulty="beginner"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/french/conjunctions"
        practiceUrl="/grammar/french/conjunctions/coordinating/practice"
        quizUrl="/grammar/french/conjunctions/coordinating/quiz"
        songUrl="/songs/fr?theme=grammar&topic=coordinating"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
