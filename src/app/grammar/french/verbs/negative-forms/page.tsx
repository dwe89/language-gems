import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'negative-forms',
  title: 'French Negative Forms (Ne...pas, Ne...jamais, Ne...rien)',
  description: 'Master French negative forms including ne...pas, ne...jamais, ne...rien, ne...plus. Learn negation patterns and placement rules.',
  difficulty: 'beginner',
  keywords: [
    'french negation',
    'ne pas french',
    'french negative forms',
    'ne jamais ne rien',
    'french negative verbs',
    'negation patterns french'
  ],
  examples: [
    'Je ne parle pas français. (I don\'t speak French.)',
    'Il ne mange jamais de viande. (He never eats meat.)',
    'Nous ne voyons rien. (We see nothing.)',
    'Elle ne vient plus. (She doesn\'t come anymore.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Negation',
    content: `French negation uses a **two-part structure** that surrounds the verb. Unlike English, which typically uses one negative word, French requires **two elements** to create negation:

**NE + VERB + NEGATIVE WORD**

The most common negative form is **ne...pas** (not), but French has many other negative expressions:
- **ne...pas** (not)
- **ne...jamais** (never)
- **ne...rien** (nothing)
- **ne...plus** (no longer/no more)
- **ne...personne** (nobody)
- **ne...que** (only)

The **ne** comes before the verb, and the second part comes after the verb.`,
    examples: [
      {
        spanish: 'Je ne parle pas. (I don\'t speak.)',
        english: 'Two-part negation: ne + verb + pas',
        highlight: ['ne', 'pas']
      },
      {
        spanish: 'Il ne mange jamais. (He never eats.)',
        english: 'Two-part negation: ne + verb + jamais',
        highlight: ['ne', 'jamais']
      },
      {
        spanish: 'Nous ne voyons rien. (We see nothing.)',
        english: 'Two-part negation: ne + verb + rien',
        highlight: ['ne', 'rien']
      }
    ]
  },
  {
    title: 'NE...PAS (Not) - Basic Negation',
    content: `**Ne...pas** is the most common negative form in French, equivalent to "not" in English:`,
    conjugationTable: {
      title: 'PARLER (to speak) - Negative Form',
      conjugations: [
        { pronoun: 'je', form: 'ne parle pas', english: 'I don\'t speak' },
        { pronoun: 'tu', form: 'ne parles pas', english: 'you don\'t speak (informal)' },
        { pronoun: 'il/elle/on', form: 'ne parle pas', english: 'he/she/one doesn\'t speak' },
        { pronoun: 'nous', form: 'ne parlons pas', english: 'we don\'t speak' },
        { pronoun: 'vous', form: 'ne parlez pas', english: 'you don\'t speak (formal/plural)' },
        { pronoun: 'ils/elles', form: 'ne parlent pas', english: 'they don\'t speak' }
      ]
    },
    subsections: [
      {
        title: 'NE becomes N\' before vowels',
        content: 'Before vowels and silent h, ne contracts to n\':',
        examples: [
          {
            spanish: 'Je n\'aime pas le café. (I don\'t like coffee.)',
            english: 'Il n\'habite pas ici. (He doesn\'t live here.)',
            highlight: ['n\'aime pas', 'n\'habite pas']
          }
        ]
      },
      {
        title: 'Placement with Object Pronouns',
        content: 'With object pronouns, ne comes before the pronoun:',
        examples: [
          {
            spanish: 'Je ne le vois pas. (I don\'t see him.)',
            english: 'Tu ne lui parles pas. (You don\'t speak to him.)',
            highlight: ['ne le vois pas', 'ne lui parles pas']
          }
        ]
      }
    ]
  },
  {
    title: 'NE...JAMAIS (Never)',
    content: `**Ne...jamais** means "never" and replaces ne...pas when expressing never:`,
    examples: [
      {
        spanish: 'Je ne mange jamais de viande. (I never eat meat.)',
        english: 'Elle ne regarde jamais la télé. (She never watches TV.)',
        highlight: ['ne mange jamais', 'ne regarde jamais']
      },
      {
        spanish: 'Nous ne sortons jamais le dimanche. (We never go out on Sundays.)',
        english: 'Ils ne voyagent jamais en avion. (They never travel by plane.)',
        highlight: ['ne sortons jamais', 'ne voyagent jamais']
      }
    ],
    subsections: [
      {
        title: 'JAMAIS without NE',
        content: 'Jamais can be used alone in responses:',
        examples: [
          {
            spanish: '- Tu fumes? - Jamais! (Do you smoke? - Never!)',
            english: 'Jamais de la vie! (Never in my life!)',
            highlight: ['Jamais!', 'Jamais de la vie!']
          }
        ]
      }
    ]
  },
  {
    title: 'NE...RIEN (Nothing)',
    content: `**Ne...rien** means "nothing" and can function as subject or object:`,
    examples: [
      {
        spanish: 'Je ne vois rien. (I see nothing/I don\'t see anything.)',
        english: 'Il ne dit rien. (He says nothing/He doesn\'t say anything.)',
        highlight: ['ne vois rien', 'ne dit rien']
      },
      {
        spanish: 'Rien ne marche. (Nothing works.)',
        english: 'Rien n\'est impossible. (Nothing is impossible.)',
        highlight: ['Rien ne marche', 'Rien n\'est impossible']
      }
    ],
    subsections: [
      {
        title: 'RIEN as Subject',
        content: 'When rien is the subject, it comes first:',
        examples: [
          {
            spanish: 'Rien ne m\'intéresse. (Nothing interests me.)',
            english: 'Rien ne va. (Nothing is going well.)',
            highlight: ['Rien ne m\'intéresse', 'Rien ne va']
          }
        ]
      },
      {
        title: 'RIEN with Prepositions',
        content: 'Rien can be used with prepositions:',
        examples: [
          {
            spanish: 'Je ne pense à rien. (I\'m not thinking about anything.)',
            english: 'Il ne s\'intéresse à rien. (He\'s not interested in anything.)',
            highlight: ['ne pense à rien', 'ne s\'intéresse à rien']
          }
        ]
      }
    ]
  },
  {
    title: 'NE...PLUS (No longer/No more)',
    content: `**Ne...plus** means "no longer," "no more," or "not anymore":`,
    examples: [
      {
        spanish: 'Je ne fume plus. (I don\'t smoke anymore.)',
        english: 'Elle ne vient plus. (She doesn\'t come anymore.)',
        highlight: ['ne fume plus', 'ne vient plus']
      },
      {
        spanish: 'Il n\'y a plus de pain. (There\'s no more bread.)',
        english: 'Nous ne habitons plus ici. (We don\'t live here anymore.)',
        highlight: ['n\'y a plus', 'ne habitons plus']
      }
    ],
    subsections: [
      {
        title: 'PLUS vs. PLUS',
        content: 'Pronunciation differs based on meaning:',
        examples: [
          {
            spanish: 'Je ne veux plus. [plu] (I don\'t want anymore.)',
            english: 'Je veux plus. [plus] (I want more.)',
            highlight: ['plus [plu]', 'plus [plus]']
          }
        ]
      }
    ]
  },
  {
    title: 'NE...PERSONNE (Nobody)',
    content: `**Ne...personne** means "nobody" or "no one":`,
    examples: [
      {
        spanish: 'Je ne vois personne. (I don\'t see anyone.)',
        english: 'Il ne connaît personne. (He doesn\'t know anyone.)',
        highlight: ['ne vois personne', 'ne connaît personne']
      }
    ],
    subsections: [
      {
        title: 'PERSONNE as Subject',
        content: 'When personne is the subject:',
        examples: [
          {
            spanish: 'Personne ne vient. (Nobody is coming.)',
            english: 'Personne n\'est parfait. (Nobody is perfect.)',
            highlight: ['Personne ne vient', 'Personne n\'est parfait']
          }
        ]
      }
    ]
  },
  {
    title: 'NE...QUE (Only)',
    content: `**Ne...que** means "only" and is restrictive rather than truly negative:`,
    examples: [
      {
        spanish: 'Je ne parle que français. (I only speak French.)',
        english: 'Il ne mange que des légumes. (He only eats vegetables.)',
        highlight: ['ne parle que', 'ne mange que']
      },
      {
        spanish: 'Elle ne vient que le dimanche. (She only comes on Sundays.)',
        english: 'Nous n\'avons que dix euros. (We only have ten euros.)',
        highlight: ['ne vient que', 'n\'avons que']
      }
    ]
  },
  {
    title: 'Negation in Compound Tenses',
    content: `In compound tenses (passé composé, plus-que-parfait, etc.), the negative words surround the auxiliary verb:`,
    examples: [
      {
        spanish: 'Je n\'ai pas mangé. (I haven\'t eaten.)',
        english: 'Il n\'est jamais venu. (He has never come.)',
        highlight: ['n\'ai pas mangé', 'n\'est jamais venu']
      },
      {
        spanish: 'Nous n\'avons rien vu. (We haven\'t seen anything.)',
        english: 'Elle n\'était plus partie. (She had no longer left.)',
        highlight: ['n\'avons rien vu', 'n\'était plus partie']
      }
    ],
    subsections: [
      {
        title: 'Exception: PERSONNE',
        content: 'Personne comes after the past participle:',
        examples: [
          {
            spanish: 'Je n\'ai vu personne. (I haven\'t seen anyone.)',
            english: 'Il n\'a rencontré personne. (He hasn\'t met anyone.)',
            highlight: ['n\'ai vu personne', 'n\'a rencontré personne']
          }
        ]
      }
    ]
  },
  {
    title: 'Multiple Negatives',
    content: `French can combine multiple negative expressions:`,
    examples: [
      {
        spanish: 'Je ne dis jamais rien. (I never say anything.)',
        english: 'Il ne voit plus personne. (He doesn\'t see anyone anymore.)',
        highlight: ['ne dis jamais rien', 'ne voit plus personne']
      },
      {
        spanish: 'Elle ne fait jamais rien. (She never does anything.)',
        english: 'Nous ne parlons plus jamais. (We never speak anymore.)',
        highlight: ['ne fait jamais rien', 'ne parlons plus jamais']
      }
    ]
  },
  {
    title: 'Informal Spoken French',
    content: `In informal spoken French, the "ne" is often dropped:`,
    examples: [
      {
        spanish: 'Formal: Je ne sais pas. → Informal: Je sais pas.',
        english: 'Formal: Il ne vient jamais. → Informal: Il vient jamais.',
        highlight: ['Je sais pas', 'Il vient jamais']
      }
    ],
    subsections: [
      {
        title: 'Written vs. Spoken',
        content: 'Always use complete negation in writing:',
        examples: [
          {
            spanish: '✅ Written: Je ne comprends pas.',
            english: '❌ Written: Je comprends pas.',
            highlight: ['Je ne comprends pas']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Negative Mistakes',
    content: `Here are frequent errors students make with French negation:

**1. Forgetting the "ne"**: Using only the second part
**2. Wrong placement**: Putting negatives in wrong position
**3. Double negatives**: Using "pas" with other negatives
**4. Infinitive negation**: Wrong placement with infinitives`,
    examples: [
      {
        spanish: '❌ Je parle pas → ✅ Je ne parle pas',
        english: 'Wrong: missing "ne"',
        highlight: ['Je ne parle pas']
      },
      {
        spanish: '❌ Je ne jamais pas mange → ✅ Je ne mange jamais',
        english: 'Wrong: don\'t use "pas" with other negatives',
        highlight: ['Je ne mange jamais']
      },
      {
        spanish: '❌ Je veux ne pas partir → ✅ Je ne veux pas partir',
        english: 'Wrong: negation placement with infinitive',
        highlight: ['Je ne veux pas partir']
      },
      {
        spanish: '❌ Personne ne vient pas → ✅ Personne ne vient',
        english: 'Wrong: don\'t add "pas" when subject is negative',
        highlight: ['Personne ne vient']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Present Tense', url: '/grammar/french/verbs/present-tense', difficulty: 'beginner' },
  { title: 'French Interrogative Forms', url: '/grammar/french/verbs/interrogative-forms', difficulty: 'intermediate' },
  { title: 'French Object Pronouns', url: '/grammar/french/pronouns/direct-object', difficulty: 'intermediate' },
  { title: 'French Passé Composé', url: '/grammar/french/verbs/passe-compose', difficulty: 'intermediate' }
];

export default function FrenchNegativeFormsPage() {
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
              topic: 'negative-forms',
              title: 'French Negative Forms (Ne...pas, Ne...jamais, Ne...rien)',
              description: 'Master French negative forms including ne...pas, ne...jamais, ne...rien, ne...plus. Learn negation patterns and placement rules.',
              difficulty: 'beginner',
              examples: [
                'Je ne parle pas français. (I don\'t speak French.)',
                'Il ne mange jamais de viande. (He never eats meat.)',
                'Nous ne voyons rien. (We see nothing.)',
                'Elle ne vient plus. (She doesn\'t come anymore.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'negative-forms',
              title: 'French Negative Forms (Ne...pas, Ne...jamais, Ne...rien)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="negative-forms"
        title="French Negative Forms (Ne...pas, Ne...jamais, Ne...rien)"
        description="Master French negative forms including ne...pas, ne...jamais, ne...rien, ne...plus. Learn negation patterns and placement rules"
        difficulty="beginner"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/negative-forms/practice"
        quizUrl="/grammar/french/verbs/negative-forms/quiz"
        songUrl="/songs/fr?theme=grammar&topic=negation"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
