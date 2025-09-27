import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'pronouns',
  topic: 'indefinite',
  title: 'French Indefinite Pronouns (Quelqu\'un, Personne, Rien, Tout)',
  description: 'Master French indefinite pronouns for unspecified people and things. Learn quelqu\'un, personne, rien, tout, chacun, etc.',
  difficulty: 'advanced',
  keywords: [
    'french indefinite pronouns',
    'quelqu\'un personne rien',
    'tout chacun quelque chose',
    'indefinite french grammar',
    'someone nobody nothing',
    'french pronouns advanced'
  ],
  examples: [
    'Quelqu\'un est venu (Someone came)',
    'Personne ne sait (Nobody knows)',
    'Rien n\'est facile (Nothing is easy)',
    'Tout va bien (Everything is fine)'
  ]
});

const sections = [
  {
    title: 'Understanding Indefinite Pronouns',
    content: `French indefinite pronouns refer to **unspecified** people, things, or quantities. They don't refer to specific individuals but to general or unknown entities.

These pronouns are essential for expressing concepts like "someone," "nobody," "everything," "nothing," and "each one."

Many indefinite pronouns have special rules for negation and agreement.`,
    examples: [
      {
        spanish: 'Quelqu\'un a téléphoné. (Someone called.)',
        english: 'Unspecified person',
        highlight: ['Quelqu\'un']
      },
      {
        spanish: 'Personne ne comprend. (Nobody understands.)',
        english: 'No person at all',
        highlight: ['Personne ne']
      },
      {
        spanish: 'Tout est possible. (Everything is possible.)',
        english: 'All things',
        highlight: ['Tout']
      }
    ]
  },
  {
    title: 'Pronouns for People',
    content: `Indefinite pronouns referring to unspecified people:`,
    subsections: [
      {
        title: 'QUELQU\'UN (Someone/Somebody)',
        content: 'Refers to an unspecified person in positive contexts:',
        examples: [
          {
            spanish: 'Quelqu\'un est à la porte. (Someone is at the door.)',
            english: 'Je cherche quelqu\'un qui parle anglais. (I\'m looking for someone who speaks English.)',
            highlight: ['Quelqu\'un', 'quelqu\'un qui']
          },
          {
            spanish: 'Il y a quelqu\'un dans le jardin. (There\'s someone in the garden.)',
            english: 'Quelqu\'un d\'intéressant viendra. (Someone interesting will come.)',
            highlight: ['quelqu\'un', 'Quelqu\'un d\'intéressant']
          }
        ]
      },
      {
        title: 'PERSONNE (Nobody/No One)',
        content: 'Refers to no person - requires NE in negation:',
        examples: [
          {
            spanish: 'Personne ne vient. (Nobody is coming.)',
            english: 'Je ne vois personne. (I don\'t see anybody.)',
            highlight: ['Personne ne', 'ne vois personne']
          },
          {
            spanish: 'Personne n\'a répondu. (Nobody answered.)',
            english: 'Il n\'y a personne ici. (There\'s nobody here.)',
            highlight: ['Personne n\'a', 'personne ici']
          }
        ]
      },
      {
        title: 'CHACUN/CHACUNE (Each One)',
        content: 'Refers to each individual person:',
        examples: [
          {
            spanish: 'Chacun a ses problèmes. (Each one has his problems.)',
            english: 'Chacune d\'elles est belle. (Each one of them is beautiful.)',
            highlight: ['Chacun', 'Chacune']
          }
        ]
      }
    ]
  },
  {
    title: 'Pronouns for Things',
    content: `Indefinite pronouns referring to unspecified things:`,
    subsections: [
      {
        title: 'QUELQUE CHOSE (Something)',
        content: 'Refers to an unspecified thing in positive contexts:',
        examples: [
          {
            spanish: 'J\'ai quelque chose à te dire. (I have something to tell you.)',
            english: 'Il y a quelque chose qui ne va pas. (There\'s something wrong.)',
            highlight: ['quelque chose', 'quelque chose qui']
          },
          {
            spanish: 'Quelque chose d\'important s\'est passé. (Something important happened.)',
            english: 'With de + adjective for description',
            highlight: ['Quelque chose d\'important']
          }
        ]
      },
      {
        title: 'RIEN (Nothing)',
        content: 'Refers to no thing - requires NE in negation:',
        examples: [
          {
            spanish: 'Rien ne marche. (Nothing works.)',
            english: 'Je ne vois rien. (I don\'t see anything.)',
            highlight: ['Rien ne', 'ne vois rien']
          },
          {
            spanish: 'Il n\'y a rien à faire. (There\'s nothing to do.)',
            english: 'Rien d\'intéressant ne se passe. (Nothing interesting is happening.)',
            highlight: ['rien à faire', 'Rien d\'intéressant']
          }
        ]
      },
      {
        title: 'TOUT (Everything/All)',
        content: 'Refers to all things or everything:',
        examples: [
          {
            spanish: 'Tout va bien. (Everything is fine.)',
            english: 'J\'ai tout compris. (I understood everything.)',
            highlight: ['Tout va', 'tout compris']
          },
          {
            spanish: 'Tout est possible. (Everything is possible.)',
            english: 'Il mange tout. (He eats everything.)',
            highlight: ['Tout est', 'mange tout']
          }
        ]
      }
    ]
  },
  {
    title: 'Quantity and Degree Pronouns',
    content: `Indefinite pronouns expressing quantity or degree:`,
    subsections: [
      {
        title: 'PLUSIEURS (Several)',
        content: 'Refers to several unspecified items:',
        examples: [
          {
            spanish: 'Plusieurs sont venus. (Several came.)',
            english: 'J\'en ai acheté plusieurs. (I bought several of them.)',
            highlight: ['Plusieurs', 'plusieurs']
          }
        ]
      },
      {
        title: 'CERTAINS/CERTAINES (Some/Certain Ones)',
        content: 'Refers to some specific but unidentified items:',
        examples: [
          {
            spanish: 'Certains pensent que... (Some think that...)',
            english: 'Certaines d\'entre elles sont parties. (Some of them left.)',
            highlight: ['Certains', 'Certaines']
          }
        ]
      },
      {
        title: 'D\'AUTRES (Others)',
        content: 'Refers to other unspecified items:',
        examples: [
          {
            spanish: 'Les uns travaillent, d\'autres se reposent. (Some work, others rest.)',
            english: 'J\'en veux d\'autres. (I want others.)',
            highlight: ['d\'autres', 'd\'autres']
          }
        ]
      }
    ]
  },
  {
    title: 'Negation with Indefinite Pronouns',
    content: `Special negation rules apply to certain indefinite pronouns:`,
    examples: [
      {
        spanish: 'Personne ne vient. (Nobody is coming.)',
        english: 'Personne as subject requires ne',
        highlight: ['Personne ne']
      },
      {
        spanish: 'Je ne vois personne. (I don\'t see anybody.)',
        english: 'Personne as object with ne...personne',
        highlight: ['ne vois personne']
      }
    ],
    subsections: [
      {
        title: 'PERSONNE and RIEN Negation Patterns',
        content: 'How personne and rien work with negation:',
        conjugationTable: {
          title: 'Negation Patterns',
          conjugations: [
            { pronoun: 'Personne + ne + verb', form: 'subject', english: 'Personne ne sait. (Nobody knows.)' },
            { pronoun: 'Ne + verb + personne', form: 'object', english: 'Je ne connais personne. (I know nobody.)' },
            { pronoun: 'Rien + ne + verb', form: 'subject', english: 'Rien ne marche. (Nothing works.)' },
            { pronoun: 'Ne + verb + rien', form: 'object', english: 'Je ne vois rien. (I see nothing.)' }
          ]
        }
      },
      {
        title: 'With Compound Tenses',
        content: 'Placement in passé composé and other compound tenses:',
        examples: [
          {
            spanish: 'Personne n\'est venu. (Nobody came.)',
            english: 'Je n\'ai vu personne. (I didn\'t see anybody.)',
            highlight: ['Personne n\'est', 'n\'ai vu personne']
          },
          {
            spanish: 'Rien n\'a changé. (Nothing changed.)',
            english: 'Il n\'a rien dit. (He said nothing.)',
            highlight: ['Rien n\'a', 'n\'a rien dit']
          }
        ]
      }
    ]
  },
  {
    title: 'Indefinite Pronouns with DE',
    content: `Many indefinite pronouns use **de** when followed by adjectives:`,
    examples: [
      {
        spanish: 'quelqu\'un de gentil (someone nice)',
        english: 'quelque chose d\'intéressant (something interesting)',
        highlight: ['de gentil', 'd\'intéressant']
      },
      {
        spanish: 'personne d\'important (nobody important)',
        english: 'rien de nouveau (nothing new)',
        highlight: ['d\'important', 'de nouveau']
      }
    ],
    subsections: [
      {
        title: 'DE + Adjective Pattern',
        content: 'Common pattern with indefinite pronouns:',
        examples: [
          {
            spanish: 'J\'ai rencontré quelqu\'un de très sympa. (I met someone very nice.)',
            english: 'Il n\'y a rien de plus beau. (There\'s nothing more beautiful.)',
            highlight: ['quelqu\'un de très sympa', 'rien de plus beau']
          },
          {
            spanish: 'Personne d\'autre n\'est venu. (Nobody else came.)',
            english: 'Quelque chose d\'autre m\'inquiète. (Something else worries me.)',
            highlight: ['Personne d\'autre', 'Quelque chose d\'autre']
          }
        ]
      }
    ]
  },
  {
    title: 'Special Uses and Expressions',
    content: `Common expressions and special uses of indefinite pronouns:`,
    examples: [
      {
        spanish: 'Tout le monde (everybody - literally "all the world")',
        english: 'N\'importe qui (anybody at all)',
        highlight: ['Tout le monde', 'N\'importe qui']
      },
      {
        spanish: 'N\'importe quoi (anything at all)',
        english: 'Quelque part (somewhere)',
        highlight: ['N\'importe quoi', 'Quelque part']
      }
    ],
    subsections: [
      {
        title: 'N\'IMPORTE Expressions',
        content: 'Expressions meaning "any" or "no matter":',
        examples: [
          {
            spanish: 'N\'importe qui peut le faire. (Anyone can do it.)',
            english: 'Il dit n\'importe quoi. (He says anything/nonsense.)',
            highlight: ['N\'importe qui', 'n\'importe quoi']
          },
          {
            spanish: 'N\'importe où (anywhere)',
            english: 'N\'importe quand (anytime)',
            highlight: ['N\'importe où', 'N\'importe quand']
          }
        ]
      },
      {
        title: 'Fixed Expressions',
        content: 'Common fixed expressions with indefinite pronouns:',
        examples: [
          {
            spanish: 'Tout le monde le sait. (Everybody knows it.)',
            english: 'Quelque part en France (somewhere in France)',
            highlight: ['Tout le monde', 'Quelque part']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Indefinite Pronoun Mistakes',
    content: `Here are frequent errors students make:

**1. Missing negation**: Forgetting ne with personne and rien
**2. Wrong placement**: Incorrect position in compound tenses
**3. Missing de**: Forgetting de before adjectives
**4. Gender confusion**: Wrong agreement with certains/certaines`,
    examples: [
      {
        spanish: '❌ Personne vient → ✅ Personne ne vient',
        english: 'Wrong: must include ne with personne as subject',
        highlight: ['Personne ne vient']
      },
      {
        spanish: '❌ Je n\'ai personne vu → ✅ Je n\'ai vu personne',
        english: 'Wrong: personne goes after past participle',
        highlight: ['n\'ai vu personne']
      },
      {
        spanish: '❌ quelqu\'un intelligent → ✅ quelqu\'un d\'intelligent',
        english: 'Wrong: must use de before adjective',
        highlight: ['quelqu\'un d\'intelligent']
      },
      {
        spanish: '❌ Certains filles → ✅ Certaines (filles)',
        english: 'Wrong: must agree with feminine gender',
        highlight: ['Certaines']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Negation', url: '/grammar/french/syntax/negation', difficulty: 'intermediate' },
  { title: 'French Indefinite Articles', url: '/grammar/french/nouns/indefinite-articles', difficulty: 'beginner' },
  { title: 'French Relative Pronouns', url: '/grammar/french/pronouns/relative-pronouns', difficulty: 'advanced' },
  { title: 'French Quantifiers', url: '/grammar/french/expressions/quantities', difficulty: 'intermediate' }
];

export default function FrenchIndefinitePage() {
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
              topic: 'indefinite',
              title: 'French Indefinite Pronouns (Quelqu\'un, Personne, Rien, Tout)',
              description: 'Master French indefinite pronouns for unspecified people and things. Learn quelqu\'un, personne, rien, tout, chacun, etc.',
              difficulty: 'advanced',
              examples: [
                'Quelqu\'un est venu (Someone came)',
                'Personne ne sait (Nobody knows)',
                'Rien n\'est facile (Nothing is easy)',
                'Tout va bien (Everything is fine)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'pronouns',
              topic: 'indefinite',
              title: 'French Indefinite Pronouns (Quelqu\'un, Personne, Rien, Tout)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="pronouns"
        topic="indefinite"
        title="French Indefinite Pronouns (Quelqu\'un, Personne, Rien, Tout)"
        description="Master French indefinite pronouns for unspecified people and things. Learn quelqu\'un, personne, rien, tout, chacun, etc"
        difficulty="advanced"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/french/pronouns"
        practiceUrl="/grammar/french/pronouns/indefinite/practice"
        quizUrl="/grammar/french/pronouns/indefinite/quiz"
        songUrl="/songs/fr?theme=grammar&topic=indefinite"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
