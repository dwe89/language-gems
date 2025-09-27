import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'pronouns',
  topic: 'y-en-pronouns',
  title: 'French Y and EN Pronouns (Location, Quantity, Replacement)',
  description: 'Master French Y and EN pronouns including location replacement, quantity expressions, and complex pronoun order.',
  difficulty: 'advanced',
  keywords: [
    'french y en pronouns',
    'y pronoun french',
    'en pronoun french',
    'location pronouns french',
    'quantity pronouns french',
    'pronoun order french'
  ],
  examples: [
    'J\'y vais. (I\'m going there.)',
    'J\'en veux. (I want some.)',
    'Il y en a. (There are some.)',
    'Nous y pensons. (We think about it.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Y and EN Pronouns',
    content: `French **Y** and **EN** pronouns are **advanced pronouns** that replace **prepositional phrases** and **quantities**. They are essential for **fluent French** and **avoiding repetition**.

**Y pronoun:**
- **Replaces**: à + place/thing
- **Meaning**: there, to it, about it
- **Usage**: location, abstract concepts
- **Position**: before conjugated verb

**EN pronoun:**
- **Replaces**: de + thing/quantity
- **Meaning**: of it, some, any
- **Usage**: quantities, partitive expressions
- **Position**: before conjugated verb

**Key characteristics:**
- **Invariable**: Never change form
- **Position**: Before conjugated verb (after ne in negation)
- **Order**: Y comes after other object pronouns, EN comes last
- **Elision**: Y becomes Y' before vowels in some cases

These pronouns are crucial for **advanced French fluency** and **natural expression**.`,
    examples: [
      {
        spanish: 'Tu vas à Paris? → Oui, j\'y vais. (Are you going to Paris? → Yes, I\'m going there.)',
        english: 'Y replaces à + place',
        highlight: ['j\'y vais']
      },
      {
        spanish: 'Tu veux du café? → Oui, j\'en veux. (Do you want coffee? → Yes, I want some.)',
        english: 'EN replaces du + noun (partitive)',
        highlight: ['j\'en veux']
      },
      {
        spanish: 'Il y en a beaucoup. (There are many of them.)',
        english: 'Y and EN together',
        highlight: ['Il y en a']
      }
    ]
  },
  {
    title: 'Y Pronoun - Location and Abstract Concepts',
    content: `**Y** replaces **à + place** or **abstract concepts**:`,
    examples: [
      {
        spanish: 'Je vais à Paris. → J\'y vais. (I\'m going to Paris. → I\'m going there.)',
        english: 'Tu habites à Londres? → Oui, j\'y habite. (Do you live in London? → Yes, I live there.)',
        highlight: ['J\'y vais', 'j\'y habite']
      },
      {
        spanish: 'Il pense à son travail. → Il y pense. (He thinks about his work. → He thinks about it.)',
        english: 'Elle s\'intéresse à la musique. → Elle s\'y intéresse. (She\'s interested in music. → She\'s interested in it.)',
        highlight: ['Il y pense', 'Elle s\'y intéresse']
      }
    ],
    subsections: [
      {
        title: 'Y + Places',
        content: 'Replacing locations with Y:',
        examples: [
          {
            spanish: 'à l\'école → j\'y vais (to school → I go there)',
            english: 'au cinéma → nous y allons (to the cinema → we go there)',
            highlight: ['j\'y vais', 'nous y allons']
          }
        ]
      },
      {
        title: 'Y + Abstract Concepts',
        content: 'Replacing à + abstract ideas:',
        examples: [
          {
            spanish: 'penser à → y penser (think about → think about it)',
            english: 's\'habituer à → s\'y habituer (get used to → get used to it)',
            highlight: ['y penser', 's\'y habituer']
          }
        ]
      },
      {
        title: 'Y with Reflexive Verbs',
        content: 'Y with reflexive constructions:',
        examples: [
          {
            spanish: 'Je me rends à Paris. → Je m\'y rends. (I go to Paris. → I go there.)',
            english: 'Reflexive pronoun + Y',
            highlight: ['Je m\'y rends']
          }
        ]
      }
    ]
  },
  {
    title: 'EN Pronoun - Quantities and Partitive',
    content: `**EN** replaces **de + noun** or **quantities**:`,
    examples: [
      {
        spanish: 'Je veux du pain. → J\'en veux. (I want bread. → I want some.)',
        english: 'Il a des livres. → Il en a. (He has books. → He has some.)',
        highlight: ['J\'en veux', 'Il en a']
      },
      {
        spanish: 'Elle parle de son voyage. → Elle en parle. (She talks about her trip. → She talks about it.)',
        english: 'Nous venons de France. → Nous en venons. (We come from France. → We come from there.)',
        highlight: ['Elle en parle', 'Nous en venons']
      }
    ],
    subsections: [
      {
        title: 'EN + Partitive Articles',
        content: 'Replacing du, de la, des:',
        examples: [
          {
            spanish: 'du café → j\'en bois (coffee → I drink some)',
            english: 'de la viande → j\'en mange (meat → I eat some)',
            highlight: ['j\'en bois', 'j\'en mange']
          }
        ]
      },
      {
        title: 'EN + Quantities',
        content: 'With numbers and quantities:',
        examples: [
          {
            spanish: 'J\'ai trois livres. → J\'en ai trois. (I have three books. → I have three.)',
            english: 'Il veut beaucoup de café. → Il en veut beaucoup. (He wants a lot of coffee. → He wants a lot.)',
            highlight: ['J\'en ai trois', 'Il en veut beaucoup']
          }
        ]
      },
      {
        title: 'EN + DE + Verb',
        content: 'Replacing de + noun after verbs:',
        examples: [
          {
            spanish: 'parler de → en parler (talk about → talk about it)',
            english: 'avoir besoin de → en avoir besoin (need → need it)',
            highlight: ['en parler', 'en avoir besoin']
          }
        ]
      }
    ]
  },
  {
    title: 'Position of Y and EN',
    content: `**Y** and **EN** follow **specific position rules**:`,
    conjugationTable: {
      title: 'Position Rules',
      conjugations: [
        { pronoun: 'Simple tenses', form: 'Before conjugated verb', english: 'J\'y vais. J\'en veux.' },
        { pronoun: 'Compound tenses', form: 'Before auxiliary', english: 'J\'y suis allé. J\'en ai voulu.' },
        { pronoun: 'Infinitive constructions', form: 'Before infinitive', english: 'Je vais y aller. Je veux en avoir.' },
        { pronoun: 'Imperative (affirmative)', form: 'After verb', english: 'Vas-y! Prends-en!' },
        { pronoun: 'Imperative (negative)', form: 'Before verb', english: 'N\'y va pas! N\'en prends pas!' }
      ]
    },
    examples: [
      {
        spanish: 'Je veux y aller. (I want to go there.)',
        english: 'Il peut en acheter. (He can buy some.)',
        highlight: ['y aller', 'en acheter']
      }
    ]
  },
  {
    title: 'Y and EN with Negation',
    content: `**Negation** with Y and EN:`,
    examples: [
      {
        spanish: 'Je n\'y vais pas. (I\'m not going there.)',
        english: 'Il n\'en veut pas. (He doesn\'t want any.)',
        highlight: ['n\'y vais pas', 'n\'en veut pas']
      },
      {
        spanish: 'Nous n\'y pensons jamais. (We never think about it.)',
        english: 'Elle n\'en a plus. (She doesn\'t have any more.)',
        highlight: ['n\'y pensons jamais', 'n\'en a plus']
      }
    ],
    subsections: [
      {
        title: 'NE...PAS with Y/EN',
        content: 'Standard negation pattern:',
        examples: [
          {
            spanish: 'Je n\'y crois pas. (I don\'t believe in it.)',
            english: 'Tu n\'en as pas. (You don\'t have any.)',
            highlight: ['n\'y crois pas', 'n\'en as pas']
          }
        ]
      }
    ]
  },
  {
    title: 'Pronoun Order with Y and EN',
    content: `When **multiple pronouns** are used together:`,
    conjugationTable: {
      title: 'Pronoun Order',
      conjugations: [
        { pronoun: 'me, te, se, nous, vous', form: '1st position', english: 'Il me le donne.' },
        { pronoun: 'le, la, les', form: '2nd position', english: 'Je le lui dis.' },
        { pronoun: 'lui, leur', form: '3rd position', english: 'Tu la leur montres.' },
        { pronoun: 'y', form: '4th position', english: 'Il m\'y emmène.' },
        { pronoun: 'en', form: '5th position', english: 'Il y en a.' }
      ]
    },
    examples: [
      {
        spanish: 'Il m\'y emmène. (He takes me there.)',
        english: 'Je t\'en donne. (I give you some.)',
        highlight: ['Il m\'y emmène', 'Je t\'en donne']
      },
      {
        spanish: 'Il y en a beaucoup. (There are many of them.)',
        english: 'Most complex: Y + EN together',
        highlight: ['Il y en a']
      }
    ]
  },
  {
    title: 'Y and EN in Questions',
    content: `**Questions** with Y and EN:`,
    examples: [
      {
        spanish: 'Tu y vas? (Are you going there?)',
        english: 'En veux-tu? (Do you want some?)',
        highlight: ['Tu y vas', 'En veux-tu']
      },
      {
        spanish: 'Est-ce que tu y penses? (Are you thinking about it?)',
        english: 'Combien en as-tu? (How many do you have?)',
        highlight: ['tu y penses', 'en as-tu']
      }
    ],
    subsections: [
      {
        title: 'Inversion with Y/EN',
        content: 'Question formation with inversion:',
        examples: [
          {
            spanish: 'Y allez-vous? (Are you going there?)',
            english: 'En avez-vous? (Do you have any?)',
            highlight: ['Y allez-vous', 'En avez-vous']
          }
        ]
      }
    ]
  },
  {
    title: 'Y and EN in Imperative',
    content: `**Commands** with Y and EN:`,
    examples: [
      {
        spanish: 'Vas-y! (Go there!) - Affirmative',
        english: 'N\'y va pas! (Don\'t go there!) - Negative',
        highlight: ['Vas-y', 'N\'y va pas']
      },
      {
        spanish: 'Prends-en! (Take some!) - Affirmative',
        english: 'N\'en prends pas! (Don\'t take any!) - Negative',
        highlight: ['Prends-en', 'N\'en prends pas']
      }
    ],
    subsections: [
      {
        title: 'Affirmative Imperative',
        content: 'Y and EN after the verb:',
        examples: [
          {
            spanish: 'Allez-y! (Go there!)',
            english: 'Achetez-en! (Buy some!)',
            highlight: ['Allez-y', 'Achetez-en']
          }
        ]
      },
      {
        title: 'Negative Imperative',
        content: 'Y and EN before the verb:',
        examples: [
          {
            spanish: 'N\'y allez pas! (Don\'t go there!)',
            english: 'N\'en achetez pas! (Don\'t buy any!)',
            highlight: ['N\'y allez pas', 'N\'en achetez pas']
          }
        ]
      }
    ]
  },
  {
    title: 'Special Cases and Expressions',
    content: `**Fixed expressions** and **special uses**:`,
    examples: [
      {
        spanish: 'Il y a (there is/are) → Il y en a (there are some)',
        english: 'Ça y est! (That\'s it! / Done!)',
        highlight: ['Il y en a', 'Ça y est']
      },
      {
        spanish: 'Je m\'en vais. (I\'m leaving.) - Fixed expression',
        english: 'Qu\'est-ce qu\'il y a? (What\'s wrong? / What\'s the matter?)',
        highlight: ['Je m\'en vais', 'Qu\'est-ce qu\'il y a']
      }
    ],
    subsections: [
      {
        title: 'IL Y A + EN',
        content: 'Existential expressions:',
        examples: [
          {
            spanish: 'Il y en a trois. (There are three.)',
            english: 'Il n\'y en a pas. (There aren\'t any.)',
            highlight: ['Il y en a trois', 'Il n\'y en a pas']
          }
        ]
      },
      {
        title: 'S\'EN ALLER',
        content: 'Leaving/going away:',
        examples: [
          {
            spanish: 'Je m\'en vais. (I\'m leaving.)',
            english: 'Ils s\'en vont. (They\'re leaving.)',
            highlight: ['Je m\'en vais', 'Ils s\'en vont']
          }
        ]
      }
    ]
  },
  {
    title: 'Y vs LÀ Distinction',
    content: `**Y** vs **LÀ** for location:`,
    examples: [
      {
        spanish: 'Y = replaces à + place (J\'y vais = I go there)',
        english: 'LÀ = independent adverb (Je vais là = I go there)',
        highlight: ['J\'y vais', 'Je vais là']
      },
      {
        spanish: 'Y is more integrated grammatically',
        english: 'LÀ is more emphatic and independent',
        highlight: ['Y', 'LÀ']
      }
    ]
  },
  {
    title: 'EN vs DE LUI/ELLE Distinction',
    content: `**EN** vs **DE + disjunctive pronoun**:`,
    examples: [
      {
        spanish: 'EN = for things (J\'en parle = I talk about it)',
        english: 'DE LUI/ELLE = for people (Je parle de lui = I talk about him)',
        highlight: ['J\'en parle', 'Je parle de lui']
      },
      {
        spanish: 'Tu penses à ton examen? → Tu y penses. (thing)',
        english: 'Tu penses à Marie? → Tu penses à elle. (person)',
        highlight: ['Tu y penses', 'Tu penses à elle']
      }
    ]
  },
  {
    title: 'Common Mistakes with Y and EN',
    content: `Here are frequent errors with Y and EN pronouns:

**1. Wrong replacement**: Using Y/EN for people instead of disjunctive pronouns
**2. Position errors**: Wrong placement in sentence
**3. Overuse**: Using when not needed
**4. Confusion**: Mixing up Y and EN functions`,
    examples: [
      {
        spanish: '❌ Je pense à Marie → J\'y pense → ✅ Je pense à elle',
        english: 'Wrong: use disjunctive pronoun for people',
        highlight: ['Je pense à elle']
      },
      {
        spanish: '❌ Je veux y aller là → ✅ Je veux y aller',
        english: 'Wrong: don\'t use Y and LÀ together',
        highlight: ['Je veux y aller']
      },
      {
        spanish: '❌ J\'en y vais → ✅ J\'y vais',
        english: 'Wrong: don\'t confuse EN and Y',
        highlight: ['J\'y vais']
      },
      {
        spanish: '❌ Vas-en! → ✅ Va-t\'en! (s\'en aller)',
        english: 'Wrong: fixed expression s\'en aller',
        highlight: ['Va-t\'en']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Direct Object Pronouns', url: '/grammar/french/pronouns/direct-object', difficulty: 'intermediate' },
  { title: 'French Indirect Object Pronouns', url: '/grammar/french/pronouns/indirect-object', difficulty: 'intermediate' },
  { title: 'French Disjunctive Pronouns', url: '/grammar/french/pronouns/disjunctive', difficulty: 'intermediate' },
  { title: 'French Pronoun Order', url: '/grammar/french/pronouns/pronoun-order', difficulty: 'advanced' }
];

export default function FrenchYEnPronounsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'pronouns',
              topic: 'y-en-pronouns',
              title: 'French Y and EN Pronouns (Location, Quantity, Replacement)',
              description: 'Master French Y and EN pronouns including location replacement, quantity expressions, and complex pronoun order.',
              difficulty: 'advanced',
              examples: [
                'J\'y vais. (I\'m going there.)',
                'J\'en veux. (I want some.)',
                'Il y en a. (There are some.)',
                'Nous y pensons. (We think about it.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'pronouns',
              topic: 'y-en-pronouns',
              title: 'French Y and EN Pronouns (Location, Quantity, Replacement)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="pronouns"
        topic="y-en-pronouns"
        title="French Y and EN Pronouns (Location, Quantity, Replacement)"
        description="Master French Y and EN pronouns including location replacement, quantity expressions, and complex pronoun order"
        difficulty="advanced"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/french/pronouns"
        practiceUrl="/grammar/french/pronouns/y-en-pronouns/practice"
        quizUrl="/grammar/french/pronouns/y-en-pronouns/quiz"
        songUrl="/songs/fr?theme=grammar&topic=y-en-pronouns"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
