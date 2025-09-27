import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adverbs',
  topic: 'negation-adverbs',
  title: 'French Negation Adverbs (Ne...pas, Ne...jamais, Ne...plus, Ne...rien)',
  description: 'Master French negation adverbs including ne...pas, ne...jamais, ne...plus, ne...rien, ne...personne and complex negation patterns.',
  difficulty: 'intermediate',
  keywords: [
    'french negation adverbs',
    'ne pas french',
    'ne jamais french',
    'ne plus french',
    'ne rien french',
    'french negative adverbs'
  ],
  examples: [
    'Je ne parle pas. (I don\'t speak.)',
    'Il ne vient jamais. (He never comes.)',
    'Elle ne mange plus. (She doesn\'t eat anymore.)',
    'Nous ne voyons rien. (We see nothing.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Negation Adverbs',
    content: `French negation adverbs create **negative expressions** using a **two-part structure** with **NE** + **negative adverb**. This system is more complex than English negation and requires understanding of **position, agreement, and usage patterns**.

**Main negation adverbs:**
- **ne...pas**: not (general negation)
- **ne...jamais**: never
- **ne...plus**: no longer, not anymore
- **ne...rien**: nothing
- **ne...personne**: nobody, no one
- **ne...guère**: hardly, scarcely
- **ne...point**: not at all (literary)
- **ne...nullement**: not at all

**Key characteristics:**
- **Two-part structure**: NE + verb + negative adverb
- **Position rules**: Specific placement in different tenses
- **Omission of NE**: In informal speech
- **Multiple negations**: Can combine certain negatives
- **Partitive changes**: Articles change in negative sentences

Understanding negation adverbs is essential for **expressing negative ideas** and **natural French communication**.`,
    examples: [
      {
        spanish: 'Je ne parle pas français. (I don\'t speak French.)',
        english: 'Basic negation with NE...PAS',
        highlight: ['ne parle pas']
      },
      {
        spanish: 'Il ne vient jamais à l\'heure. (He never comes on time.)',
        english: 'Frequency negation with NE...JAMAIS',
        highlight: ['ne vient jamais']
      },
      {
        spanish: 'Elle ne mange plus de viande. (She doesn\'t eat meat anymore.)',
        english: 'Change of state with NE...PLUS',
        highlight: ['ne mange plus']
      }
    ]
  },
  {
    title: 'NE...PAS - General Negation',
    content: `**NE...PAS** is the **most common** French negation:`,
    examples: [
      {
        spanish: 'Je ne parle pas. (I don\'t speak.)',
        english: 'Tu ne comprends pas. (You don\'t understand.)',
        highlight: ['ne parle pas', 'ne comprends pas']
      },
      {
        spanish: 'Il n\'est pas français. (He isn\'t French.)',
        english: 'Nous ne travaillons pas. (We don\'t work.)',
        highlight: ['n\'est pas', 'ne travaillons pas']
      }
    ],
    subsections: [
      {
        title: 'Position in Simple Tenses',
        content: 'NE before verb, PAS after verb:',
        examples: [
          {
            spanish: 'Je ne mange pas. (I don\'t eat.)',
            english: 'Elle ne dort pas. (She doesn\'t sleep.)',
            highlight: ['ne mange pas', 'ne dort pas']
          }
        ]
      },
      {
        title: 'Position in Compound Tenses',
        content: 'NE before auxiliary, PAS after auxiliary:',
        examples: [
          {
            spanish: 'Je n\'ai pas mangé. (I didn\'t eat.)',
            english: 'Il n\'est pas venu. (He didn\'t come.)',
            highlight: ['n\'ai pas mangé', 'n\'est pas venu']
          }
        ]
      },
      {
        title: 'With Infinitives',
        content: 'Both parts before infinitive:',
        examples: [
          {
            spanish: 'Je préfère ne pas partir. (I prefer not to leave.)',
            english: 'Il décide de ne pas venir. (He decides not to come.)',
            highlight: ['ne pas partir', 'ne pas venir']
          }
        ]
      }
    ]
  },
  {
    title: 'NE...JAMAIS - Never',
    content: `**NE...JAMAIS** expresses **never** or **not ever**:`,
    examples: [
      {
        spanish: 'Je ne bois jamais d\'alcool. (I never drink alcohol.)',
        english: 'Il ne ment jamais. (He never lies.)',
        highlight: ['ne bois jamais', 'ne ment jamais']
      },
      {
        spanish: 'Elle n\'a jamais visité Paris. (She has never visited Paris.)',
        english: 'Nous ne sommes jamais allés là-bas. (We have never gone there.)',
        highlight: ['n\'a jamais visité', 'ne sommes jamais allés']
      }
    ],
    subsections: [
      {
        title: 'JAMAIS vs PAS...JAMAIS',
        content: 'Different emphasis levels:',
        examples: [
          {
            spanish: 'Je ne viens jamais. (I never come.)',
            english: 'Je ne viens pas jamais. (incorrect - don\'t combine)',
            highlight: ['ne viens jamais']
          }
        ]
      },
      {
        title: 'JAMAIS Alone',
        content: 'Can stand alone in responses:',
        examples: [
          {
            spanish: 'Tu fumes? Jamais! (Do you smoke? Never!)',
            english: 'Standalone response without NE',
            highlight: ['Jamais!']
          }
        ]
      }
    ]
  },
  {
    title: 'NE...PLUS - No Longer, Not Anymore',
    content: `**NE...PLUS** indicates **cessation** or **change of state**:`,
    examples: [
      {
        spanish: 'Je ne fume plus. (I don\'t smoke anymore.)',
        english: 'Il ne travaille plus ici. (He doesn\'t work here anymore.)',
        highlight: ['ne fume plus', 'ne travaille plus']
      },
      {
        spanish: 'Elle n\'a plus d\'argent. (She doesn\'t have money anymore.)',
        english: 'Nous ne sommes plus étudiants. (We\'re no longer students.)',
        highlight: ['n\'a plus d\'argent', 'ne sommes plus']
      }
    ],
    subsections: [
      {
        title: 'PLUS vs PAS',
        content: 'Different meanings:',
        examples: [
          {
            spanish: 'Je ne mange pas. (I don\'t eat.) - general',
            english: 'Je ne mange plus. (I don\'t eat anymore.) - change',
            highlight: ['ne mange pas', 'ne mange plus']
          }
        ]
      },
      {
        title: 'Articles with PLUS',
        content: 'Partitive articles become DE:',
        examples: [
          {
            spanish: 'Je n\'ai plus de temps. (I don\'t have time anymore.)',
            english: 'Il n\'y a plus de pain. (There\'s no more bread.)',
            highlight: ['plus de temps', 'plus de pain']
          }
        ]
      }
    ]
  },
  {
    title: 'NE...RIEN - Nothing',
    content: `**NE...RIEN** means **nothing** or **not anything**:`,
    examples: [
      {
        spanish: 'Je ne vois rien. (I see nothing.)',
        english: 'Il ne dit rien. (He says nothing.)',
        highlight: ['ne vois rien', 'ne dit rien']
      },
      {
        spanish: 'Elle n\'a rien mangé. (She didn\'t eat anything.)',
        english: 'Nous n\'avons rien acheté. (We didn\'t buy anything.)',
        highlight: ['n\'a rien mangé', 'n\'avons rien acheté']
      }
    ],
    subsections: [
      {
        title: 'RIEN as Subject',
        content: 'RIEN can be the subject:',
        examples: [
          {
            spanish: 'Rien ne marche. (Nothing works.)',
            english: 'Rien n\'est impossible. (Nothing is impossible.)',
            highlight: ['Rien ne marche', 'Rien n\'est impossible']
          }
        ]
      },
      {
        title: 'RIEN + Prepositions',
        content: 'With prepositions:',
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
    title: 'NE...PERSONNE - Nobody, No One',
    content: `**NE...PERSONNE** means **nobody** or **no one**:`,
    examples: [
      {
        spanish: 'Je ne vois personne. (I see nobody.)',
        english: 'Il ne connaît personne ici. (He knows nobody here.)',
        highlight: ['ne vois personne', 'ne connaît personne']
      },
      {
        spanish: 'Elle n\'a invité personne. (She didn\'t invite anyone.)',
        english: 'Nous n\'avons rencontré personne. (We didn\'t meet anyone.)',
        highlight: ['n\'a invité personne', 'n\'avons rencontré personne']
      }
    ],
    subsections: [
      {
        title: 'PERSONNE as Subject',
        content: 'PERSONNE can be the subject:',
        examples: [
          {
            spanish: 'Personne ne vient. (Nobody comes.)',
            english: 'Personne n\'est parfait. (Nobody is perfect.)',
            highlight: ['Personne ne vient', 'Personne n\'est parfait']
          }
        ]
      },
      {
        title: 'Position in Compound Tenses',
        content: 'PERSONNE after past participle:',
        examples: [
          {
            spanish: 'Je n\'ai vu personne. (I didn\'t see anyone.)',
            english: 'Different from other negatives',
            highlight: ['n\'ai vu personne']
          }
        ]
      }
    ]
  },
  {
    title: 'Other Negation Adverbs',
    content: `**Less common** but important negation adverbs:`,
    conjugationTable: {
      title: 'Additional Negation Adverbs',
      conjugations: [
        { pronoun: 'ne...guère', form: 'hardly, scarcely', english: 'Je ne sors guère. (I hardly go out.)' },
        { pronoun: 'ne...point', form: 'not at all (literary)', english: 'Il ne comprend point. (He doesn\'t understand at all.)' },
        { pronoun: 'ne...nullement', form: 'not at all', english: 'Je ne suis nullement surpris. (I\'m not at all surprised.)' },
        { pronoun: 'ne...aucun(e)', form: 'no, not any', english: 'Je n\'ai aucune idée. (I have no idea.)' },
        { pronoun: 'ne...nulle part', form: 'nowhere', english: 'Je ne le trouve nulle part. (I can\'t find it anywhere.)' }
      ]
    },
    examples: [
      {
        spanish: 'Il ne travaille guère. (He hardly works.)',
        english: 'Je n\'ai aucune envie de sortir. (I have no desire to go out.)',
        highlight: ['ne travaille guère', 'n\'ai aucune envie']
      }
    ]
  },
  {
    title: 'Multiple Negations',
    content: `**Combining** different negation adverbs:`,
    examples: [
      {
        spanish: 'Je ne vois jamais personne. (I never see anyone.)',
        english: 'Il n\'y a plus rien. (There\'s nothing left.)',
        highlight: ['ne vois jamais personne', 'n\'y a plus rien']
      },
      {
        spanish: 'Elle ne dit jamais rien à personne. (She never says anything to anyone.)',
        english: 'Triple negation (complex but possible)',
        highlight: ['ne dit jamais rien à personne']
      }
    ],
    subsections: [
      {
        title: 'Common Combinations',
        content: 'Frequently used together:',
        examples: [
          {
            spanish: 'ne...plus jamais (never again)',
            english: 'ne...jamais rien (never anything)',
            highlight: ['plus jamais', 'jamais rien']
          }
        ]
      }
    ]
  },
  {
    title: 'Negation with Articles',
    content: `**Articles change** in negative sentences:`,
    conjugationTable: {
      title: 'Article Changes in Negation',
      conjugations: [
        { pronoun: 'Positive', form: 'du, de la, des', english: 'J\'ai du pain. (I have bread.)' },
        { pronoun: 'Negative', form: 'de/d\'', english: 'Je n\'ai pas de pain. (I don\'t have bread.)' },
        { pronoun: 'Exception', form: 'le, la, les unchanged', english: 'Je n\'aime pas le café. (I don\'t like coffee.)' }
      ]
    },
    examples: [
      {
        spanish: 'J\'ai des amis. → Je n\'ai pas d\'amis. (I have friends. → I don\'t have friends.)',
        english: 'Il boit du café. → Il ne boit pas de café. (He drinks coffee. → He doesn\'t drink coffee.)',
        highlight: ['pas d\'amis', 'pas de café']
      }
    ]
  },
  {
    title: 'Informal Negation (Omitting NE)',
    content: `In **informal spoken French**, **NE is often omitted**:`,
    examples: [
      {
        spanish: 'Je sais pas. (I don\'t know.) - Informal',
        english: 'Je ne sais pas. (I don\'t know.) - Standard',
        highlight: ['Je sais pas', 'Je ne sais pas']
      },
      {
        spanish: 'Il vient jamais. (He never comes.) - Informal',
        english: 'Il ne vient jamais. (He never comes.) - Standard',
        highlight: ['Il vient jamais', 'Il ne vient jamais']
      }
    ],
    subsections: [
      {
        title: 'Register Awareness',
        content: 'Know when to use formal vs informal:',
        examples: [
          {
            spanish: 'FORMAL: writing, official situations',
            english: 'INFORMAL: casual conversation',
            highlight: ['FORMAL', 'INFORMAL']
          }
        ]
      }
    ]
  },
  {
    title: 'Negation in Questions',
    content: `**Negative questions** and their responses:`,
    examples: [
      {
        spanish: 'Tu ne viens pas? (Aren\'t you coming?)',
        english: 'N\'est-ce pas intéressant? (Isn\'t it interesting?)',
        highlight: ['Tu ne viens pas', 'N\'est-ce pas intéressant']
      },
      {
        spanish: 'Si, je viens. (Yes, I am coming.) - Contradicting negative',
        english: 'Non, je ne viens pas. (No, I\'m not coming.) - Confirming negative',
        highlight: ['Si, je viens', 'Non, je ne viens pas']
      }
    ],
    subsections: [
      {
        title: 'SI vs OUI',
        content: 'Different positive responses:',
        examples: [
          {
            spanish: 'SI = contradicts negative question',
            english: 'OUI = confirms positive question',
            highlight: ['SI', 'OUI']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes with Negation',
    content: `Here are frequent errors with French negation:

**1. Missing NE**: Omitting NE in formal contexts
**2. Wrong position**: Incorrect placement of negative adverbs
**3. Article errors**: Not changing articles in negative sentences
**4. Double negatives**: Incorrect combinations of negatives`,
    examples: [
      {
        spanish: '❌ Je sais pas → ✅ Je ne sais pas (formal)',
        english: 'Wrong: missing NE in formal context',
        highlight: ['Je ne sais pas']
      },
      {
        spanish: '❌ Je n\'ai pas des amis → ✅ Je n\'ai pas d\'amis',
        english: 'Wrong: articles must change to DE in negation',
        highlight: ['pas d\'amis']
      },
      {
        spanish: '❌ Je ne vois pas personne → ✅ Je ne vois personne',
        english: 'Wrong: don\'t combine PAS with other negatives',
        highlight: ['Je ne vois personne']
      },
      {
        spanish: '❌ Personne ne vient pas → ✅ Personne ne vient',
        english: 'Wrong: PERSONNE as subject doesn\'t need PAS',
        highlight: ['Personne ne vient']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Adverb Formation', url: '/grammar/french/adverbs/formation', difficulty: 'beginner' },
  { title: 'French Questions', url: '/grammar/french/syntax/questions', difficulty: 'beginner' },
  { title: 'French Articles', url: '/grammar/french/nouns/definite-articles', difficulty: 'beginner' },
  { title: 'French Adverb Placement', url: '/grammar/french/adverbs/placement', difficulty: 'intermediate' }
];

export default function FrenchNegationAdverbsPage() {
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
              topic: 'negation-adverbs',
              title: 'French Negation Adverbs (Ne...pas, Ne...jamais, Ne...plus, Ne...rien)',
              description: 'Master French negation adverbs including ne...pas, ne...jamais, ne...plus, ne...rien, ne...personne and complex negation patterns.',
              difficulty: 'intermediate',
              examples: [
                'Je ne parle pas. (I don\'t speak.)',
                'Il ne vient jamais. (He never comes.)',
                'Elle ne mange plus. (She doesn\'t eat anymore.)',
                'Nous ne voyons rien. (We see nothing.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adverbs',
              topic: 'negation-adverbs',
              title: 'French Negation Adverbs (Ne...pas, Ne...jamais, Ne...plus, Ne...rien)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adverbs"
        topic="negation-adverbs"
        title="French Negation Adverbs (Ne...pas, Ne...jamais, Ne...plus, Ne...rien)"
        description="Master French negation adverbs including ne...pas, ne...jamais, ne...plus, ne...rien, ne...personne and complex negation patterns"
        difficulty="intermediate"
        estimatedTime={16}
        sections={sections}
        backUrl="/grammar/french/adverbs"
        practiceUrl="/grammar/french/adverbs/negation-adverbs/practice"
        quizUrl="/grammar/french/adverbs/negation-adverbs/quiz"
        songUrl="/songs/fr?theme=grammar&topic=negation-adverbs"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
