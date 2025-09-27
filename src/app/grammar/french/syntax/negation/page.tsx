import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'syntax',
  topic: 'negation',
  title: 'French Negation (Ne...Pas, Ne...Jamais, Ne...Plus, Ne...Rien)',
  description: 'Master French negation patterns with ne...pas, ne...jamais, ne...plus, ne...rien. Learn placement, usage, and advanced negation forms.',
  difficulty: 'intermediate',
  keywords: [
    'french negation',
    'ne pas french',
    'ne jamais plus rien',
    'french negative sentences',
    'not never french',
    'french grammar negation'
  ],
  examples: [
    'Je ne mange pas (I don\'t eat)',
    'Il ne vient jamais (He never comes)',
    'Elle ne travaille plus (She doesn\'t work anymore)',
    'Nous ne voyons rien (We see nothing)'
  ]
});

const sections = [
  {
    title: 'Understanding French Negation',
    content: `French negation uses a **two-part system** with **ne** + **negative word**. This differs from English single-word negation and requires specific placement rules.

The basic pattern is:
**Subject + ne + verb + negative word**

Common negative expressions:
**Ne...pas** (not)
**Ne...jamais** (never)
**Ne...plus** (no longer/not anymore)
**Ne...rien** (nothing)

Understanding French negation is essential for expressing what you don't do, what never happens, and what doesn't exist.`,
    examples: [
      {
        spanish: 'Je ne mange pas. (I don\'t eat.)',
        english: 'Basic negation with pas',
        highlight: ['ne mange pas']
      },
      {
        spanish: 'Il ne vient jamais. (He never comes.)',
        english: 'Frequency negation with jamais',
        highlight: ['ne vient jamais']
      },
      {
        spanish: 'Elle ne travaille plus. (She doesn\'t work anymore.)',
        english: 'Cessation negation with plus',
        highlight: ['ne travaille plus']
      }
    ]
  },
  {
    title: 'NE...PAS - Basic Negation (Not)',
    content: `**Ne...pas** is the most common negation, equivalent to English "not":`,
    examples: [
      {
        spanish: 'Je ne parle pas français. (I don\'t speak French.)',
        english: 'Basic negative statement',
        highlight: ['ne parle pas']
      },
      {
        spanish: 'Il n\'est pas médecin. (He is not a doctor.)',
        english: 'Negating profession',
        highlight: ['n\'est pas médecin']
      },
      {
        spanish: 'Nous ne comprenons pas. (We don\'t understand.)',
        english: 'Simple negation',
        highlight: ['ne comprenons pas']
      }
    ],
    subsections: [
      {
        title: 'NE Elision',
        content: 'Ne becomes n\' before vowels and silent h:',
        examples: [
          {
            spanish: 'Je n\'aime pas. (I don\'t like.)',
            english: 'Il n\'habite pas ici. (He doesn\'t live here.)',
            highlight: ['n\'aime pas', 'n\'habite pas']
          }
        ]
      },
      {
        title: 'PAS Placement',
        content: 'Pas placement in different tenses:',
        conjugationTable: {
          title: 'PAS Placement',
          conjugations: [
            { pronoun: 'Simple tenses', form: 'ne + verb + pas', english: 'Je ne mange pas.' },
            { pronoun: 'Compound tenses', form: 'ne + auxiliary + pas + participle', english: 'Je n\'ai pas mangé.' },
            { pronoun: 'Infinitive', form: 'ne pas + infinitive', english: 'Ne pas fumer.' },
            { pronoun: 'With pronouns', form: 'ne + pronoun + verb + pas', english: 'Je ne le vois pas.' }
          ]
        }
      }
    ]
  },
  {
    title: 'NE...JAMAIS - Never',
    content: `**Ne...jamais** expresses complete absence of frequency:`,
    examples: [
      {
        spanish: 'Je ne fume jamais. (I never smoke.)',
        english: 'Complete absence of action',
        highlight: ['ne fume jamais']
      },
      {
        spanish: 'Il n\'arrive jamais à l\'heure. (He never arrives on time.)',
        english: 'Habitual absence',
        highlight: ['n\'arrive jamais']
      },
      {
        spanish: 'Elle ne ment jamais. (She never lies.)',
        english: 'Character trait negation',
        highlight: ['ne ment jamais']
      }
    ],
    subsections: [
      {
        title: 'JAMAIS vs PAS',
        content: 'Distinction between never and not:',
        examples: [
          {
            spanish: 'Je ne mange pas maintenant. (I\'m not eating now.) - temporary',
            english: 'Je ne mange jamais de viande. (I never eat meat.) - permanent',
            highlight: ['ne mange pas', 'ne mange jamais']
          }
        ]
      },
      {
        title: 'JAMAIS Alone',
        content: 'Jamais can be used without ne in certain contexts:',
        examples: [
          {
            spanish: 'Tu fumes? - Jamais! (Do you smoke? - Never!)',
            english: 'Jamais de la vie! (Never in my life!)',
            highlight: ['Jamais!', 'Jamais de la vie!']
          }
        ]
      }
    ]
  },
  {
    title: 'NE...PLUS - No Longer/Not Anymore',
    content: `**Ne...plus** expresses cessation of a previous state or action:`,
    examples: [
      {
        spanish: 'Je ne fume plus. (I don\'t smoke anymore.)',
        english: 'Stopped smoking',
        highlight: ['ne fume plus']
      },
      {
        spanish: 'Il ne vit plus ici. (He doesn\'t live here anymore.)',
        english: 'Changed residence',
        highlight: ['ne vit plus ici']
      },
      {
        spanish: 'Nous ne sommes plus étudiants. (We are no longer students.)',
        english: 'Changed status',
        highlight: ['ne sommes plus étudiants']
      }
    ],
    subsections: [
      {
        title: 'PLUS vs PAS',
        content: 'Cessation vs general negation:',
        examples: [
          {
            spanish: 'Je ne travaille pas. (I don\'t work.) - general state',
            english: 'Je ne travaille plus. (I don\'t work anymore.) - changed state',
            highlight: ['ne travaille pas', 'ne travaille plus']
          }
        ]
      },
      {
        title: 'PLUS Pronunciation',
        content: 'Plus pronunciation in negation:',
        examples: [
          {
            spanish: 'ne...plus: [ply] - silent s in negation',
            english: 'plus de: [plys] - pronounced s in "more"',
            highlight: ['plus [ply]', 'plus [plys]']
          }
        ]
      }
    ]
  },
  {
    title: 'NE...RIEN - Nothing',
    content: `**Ne...rien** expresses complete absence of objects or things:`,
    examples: [
      {
        spanish: 'Je ne vois rien. (I see nothing.)',
        english: 'Complete absence of sight',
        highlight: ['ne vois rien']
      },
      {
        spanish: 'Il ne dit rien. (He says nothing.)',
        english: 'Complete silence',
        highlight: ['ne dit rien']
      },
      {
        spanish: 'Nous ne comprenons rien. (We understand nothing.)',
        english: 'Complete lack of understanding',
        highlight: ['ne comprenons rien']
      }
    ],
    subsections: [
      {
        title: 'RIEN Placement',
        content: 'Rien placement varies by tense:',
        examples: [
          {
            spanish: 'Simple: Je ne vois rien. (I see nothing.)',
            english: 'Compound: Je n\'ai rien vu. (I saw nothing.)',
            highlight: ['ne vois rien', 'n\'ai rien vu']
          }
        ]
      },
      {
        title: 'RIEN as Subject',
        content: 'Rien can be the subject of a sentence:',
        examples: [
          {
            spanish: 'Rien ne marche. (Nothing works.)',
            english: 'Rien n\'est impossible. (Nothing is impossible.)',
            highlight: ['Rien ne marche', 'Rien n\'est impossible']
          }
        ]
      }
    ]
  },
  {
    title: 'NE...PERSONNE - Nobody/No One',
    content: `**Ne...personne** expresses complete absence of people:`,
    examples: [
      {
        spanish: 'Je ne vois personne. (I see nobody.)',
        english: 'Complete absence of people',
        highlight: ['ne vois personne']
      },
      {
        spanish: 'Il ne connaît personne ici. (He knows nobody here.)',
        english: 'No acquaintances',
        highlight: ['ne connaît personne']
      }
    ],
    subsections: [
      {
        title: 'PERSONNE Placement',
        content: 'Personne placement in compound tenses:',
        examples: [
          {
            spanish: 'Simple: Je ne vois personne. (I see nobody.)',
            english: 'Compound: Je n\'ai vu personne. (I saw nobody.)',
            highlight: ['ne vois personne', 'n\'ai vu personne']
          }
        ]
      },
      {
        title: 'PERSONNE as Subject',
        content: 'Personne as sentence subject:',
        examples: [
          {
            spanish: 'Personne ne vient. (Nobody comes.)',
            english: 'Personne n\'est parfait. (Nobody is perfect.)',
            highlight: ['Personne ne vient', 'Personne n\'est parfait']
          }
        ]
      }
    ]
  },
  {
    title: 'Other Negative Expressions',
    content: `Additional negative constructions:`,
    subsections: [
      {
        title: 'NE...AUCUN (No/Not Any)',
        content: 'Expressing complete absence with agreement:',
        examples: [
          {
            spanish: 'Je n\'ai aucun problème. (I have no problem.)',
            english: 'Il n\'a aucune idée. (He has no idea.)',
            highlight: ['n\'ai aucun problème', 'n\'a aucune idée']
          }
        ]
      },
      {
        title: 'NE...NULLE PART (Nowhere)',
        content: 'Expressing absence of location:',
        examples: [
          {
            spanish: 'Je ne vais nulle part. (I\'m going nowhere.)',
            english: 'Il n\'est nulle part. (He is nowhere.)',
            highlight: ['ne vais nulle part', 'n\'est nulle part']
          }
        ]
      },
      {
        title: 'NE...QUE (Only)',
        content: 'Restrictive negation (not really negative):',
        examples: [
          {
            spanish: 'Je ne mange que des légumes. (I only eat vegetables.)',
            english: 'Il ne parle qu\'anglais. (He only speaks English.)',
            highlight: ['ne mange que', 'ne parle qu\'anglais']
          }
        ]
      }
    ]
  },
  {
    title: 'Multiple Negations',
    content: `Combining multiple negative elements:`,
    examples: [
      {
        spanish: 'Je ne vois jamais personne. (I never see anyone.)',
        english: 'Multiple negation combination',
        highlight: ['ne vois jamais personne']
      },
      {
        spanish: 'Il n\'y a plus rien. (There\'s nothing left.)',
        english: 'Plus and rien together',
        highlight: ['n\'y a plus rien']
      }
    ],
    subsections: [
      {
        title: 'Common Combinations',
        content: 'Frequently used multiple negations:',
        conjugationTable: {
          title: 'Multiple Negations',
          conjugations: [
            { pronoun: 'ne...jamais...personne', form: 'never...anyone', english: 'Je ne vois jamais personne.' },
            { pronoun: 'ne...plus...rien', form: 'no longer...anything', english: 'Il n\'y a plus rien.' },
            { pronoun: 'ne...jamais...rien', form: 'never...anything', english: 'Elle ne dit jamais rien.' },
            { pronoun: 'ne...plus...personne', form: 'no longer...anyone', english: 'Nous ne voyons plus personne.' }
          ]
        }
      }
    ]
  },
  {
    title: 'Negation in Different Contexts',
    content: `Special negation rules in various contexts:`,
    subsections: [
      {
        title: 'Infinitive Negation',
        content: 'Both parts before infinitive:',
        examples: [
          {
            spanish: 'Ne pas fumer. (Do not smoke.)',
            english: 'Ne jamais mentir. (Never lie.)',
            highlight: ['Ne pas fumer', 'Ne jamais mentir']
          }
        ]
      },
      {
        title: 'Imperative Negation',
        content: 'Normal ne...pas pattern in commands:',
        examples: [
          {
            spanish: 'Ne parlez pas! (Don\'t speak!)',
            english: 'Ne venez jamais ici! (Never come here!)',
            highlight: ['Ne parlez pas', 'Ne venez jamais']
          }
        ]
      },
      {
        title: 'Questions with Negation',
        content: 'Negative questions and responses:',
        examples: [
          {
            spanish: 'Tu ne viens pas? (Aren\'t you coming?)',
            english: 'Si, je viens. (Yes, I am coming.) - si for contradicting negative',
            highlight: ['ne viens pas', 'Si, je viens']
          }
        ]
      }
    ]
  },
  {
    title: 'Spoken French Negation',
    content: `In informal spoken French, ne is often dropped:`,
    examples: [
      {
        spanish: 'Formal: Je ne sais pas. (I don\'t know.)',
        english: 'Informal: Je sais pas. (I don\'t know.)',
        highlight: ['ne sais pas', 'sais pas']
      }
    ],
    subsections: [
      {
        title: 'NE Dropping Rules',
        content: 'When ne can be omitted in speech:',
        examples: [
          {
            spanish: 'Informal speech: C\'est pas vrai. (It\'s not true.)',
            english: 'Written/formal: Ce n\'est pas vrai. (It\'s not true.)',
            highlight: ['C\'est pas vrai', 'Ce n\'est pas vrai']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Negation Mistakes',
    content: `Here are frequent errors students make:

**1. Missing ne**: Forgetting the first part of negation
**2. Wrong placement**: Incorrect positioning in compound tenses
**3. Double negatives**: Using English-style double negatives
**4. Infinitive errors**: Wrong negation with infinitives`,
    examples: [
      {
        spanish: '❌ Je sais pas → ✅ Je ne sais pas',
        english: 'Wrong: must include ne in formal French',
        highlight: ['ne sais pas']
      },
      {
        spanish: '❌ Je n\'ai mangé pas → ✅ Je n\'ai pas mangé',
        english: 'Wrong: pas goes between auxiliary and participle',
        highlight: ['n\'ai pas mangé']
      },
      {
        spanish: '❌ Je ne vois pas personne → ✅ Je ne vois personne',
        english: 'Wrong: don\'t use pas with other negatives',
        highlight: ['ne vois personne']
      },
      {
        spanish: '❌ Pour ne fumer pas → ✅ Pour ne pas fumer',
        english: 'Wrong: both parts go before infinitive',
        highlight: ['ne pas fumer']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Question Formation', url: '/grammar/french/syntax/questions', difficulty: 'intermediate' },
  { title: 'French Frequency Adverbs', url: '/grammar/french/adverbs/frequency', difficulty: 'beginner' },
  { title: 'French Pronouns Overview', url: '/grammar/french/pronouns/overview', difficulty: 'intermediate' },
  { title: 'French Imperative Mood', url: '/grammar/french/verbs/imperative', difficulty: 'intermediate' }
];

export default function FrenchNegationPage() {
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
              topic: 'negation',
              title: 'French Negation (Ne...Pas, Ne...Jamais, Ne...Plus, Ne...Rien)',
              description: 'Master French negation patterns with ne...pas, ne...jamais, ne...plus, ne...rien. Learn placement, usage, and advanced negation forms.',
              difficulty: 'intermediate',
              examples: [
                'Je ne mange pas (I don\'t eat)',
                'Il ne vient jamais (He never comes)',
                'Elle ne travaille plus (She doesn\'t work anymore)',
                'Nous ne voyons rien (We see nothing)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'syntax',
              topic: 'negation',
              title: 'French Negation (Ne...Pas, Ne...Jamais, Ne...Plus, Ne...Rien)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="syntax"
        topic="negation"
        title="French Negation (Ne...Pas, Ne...Jamais, Ne...Plus, Ne...Rien)"
        description="Master French negation patterns with ne...pas, ne...jamais, ne...plus, ne...rien. Learn placement, usage, and advanced negation forms"
        difficulty="intermediate"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/french/syntax"
        practiceUrl="/grammar/french/syntax/negation/practice"
        quizUrl="/grammar/french/syntax/negation/quiz"
        songUrl="/songs/fr?theme=grammar&topic=negation"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
