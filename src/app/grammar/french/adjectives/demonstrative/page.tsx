import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adjectives',
  topic: 'demonstrative',
  title: 'French Demonstrative Adjectives (Ce, Cette, Ces)',
  description: 'Master French demonstrative adjectives ce, cet, cette, ces. Learn this/that and these/those with agreement rules and usage.',
  difficulty: 'beginner',
  keywords: [
    'french demonstrative adjectives',
    'ce cet cette ces',
    'this that french',
    'these those french',
    'demonstrative french grammar',
    'pointing words french'
  ],
  examples: [
    'ce livre (this book)',
    'cet homme (this man)',
    'cette femme (this woman)',
    'ces enfants (these children)'
  ]
});

const sections = [
  {
    title: 'Understanding Demonstrative Adjectives',
    content: `French demonstrative adjectives are **pointing words** that specify which noun you're talking about. They correspond to "this," "that," "these," and "those" in English.

French has four demonstrative adjectives: **ce**, **cet**, **cette**, and **ces**. They must agree with the gender and number of the noun they modify.

Unlike English, French doesn't distinguish between "this/these" (near) and "that/those" (far) - context determines the meaning.`,
    examples: [
      {
        spanish: 'ce livre (this book / that book)',
        english: 'Context determines whether it means "this" or "that"',
        highlight: ['ce livre']
      },
      {
        spanish: 'cette voiture (this car / that car)',
        english: 'Same form for both near and far',
        highlight: ['cette voiture']
      },
      {
        spanish: 'ces enfants (these children / those children)',
        english: 'Plural form for both near and far',
        highlight: ['ces enfants']
      }
    ]
  },
  {
    title: 'The Four Demonstrative Adjectives',
    content: `Each demonstrative adjective corresponds to specific gender and number combinations:`,
    subsections: [
      {
        title: 'Complete Demonstrative System',
        content: 'Here are all French demonstrative adjectives:',
        conjugationTable: {
          title: 'French Demonstrative Adjectives',
          conjugations: [
            { pronoun: 'ce', form: 'masculine singular', english: 'ce chat (this/that cat)' },
            { pronoun: 'cet', form: 'masculine before vowel/h', english: 'cet homme (this/that man)' },
            { pronoun: 'cette', form: 'feminine singular', english: 'cette table (this/that table)' },
            { pronoun: 'ces', form: 'plural (both genders)', english: 'ces livres (these/those books)' }
          ]
        }
      },
      {
        title: 'When to Use CET',
        content: 'Use "cet" before masculine words starting with vowels or silent h:',
        examples: [
          {
            spanish: 'cet ami (this friend)',
            english: 'cet hôtel (this hotel)',
            highlight: ['cet ami', 'cet hôtel']
          },
          {
            spanish: 'cet ordinateur (this computer)',
            english: 'cet été (this summer)',
            highlight: ['cet ordinateur', 'cet été']
          },
          {
            spanish: 'cet homme (this man)',
            english: 'cet appartement (this apartment)',
            highlight: ['cet homme', 'cet appartement']
          }
        ]
      }
    ]
  },
  {
    title: 'Agreement Rules',
    content: `Demonstrative adjectives must agree with the gender and number of the noun they modify:`,
    examples: [
      {
        spanish: 'Masculine singular: ce livre, cet ami',
        english: 'Use ce or cet depending on first letter',
        highlight: ['ce livre', 'cet ami']
      },
      {
        spanish: 'Feminine singular: cette maison, cette école',
        english: 'Always use cette for feminine singular',
        highlight: ['cette maison', 'cette école']
      },
      {
        spanish: 'Plural: ces livres, ces maisons, ces amis',
        english: 'Always use ces for plural (any gender)',
        highlight: ['ces livres', 'ces maisons', 'ces amis']
      }
    ],
    subsections: [
      {
        title: 'Agreement Examples by Gender',
        content: 'Examples showing gender agreement:',
        conjugationTable: {
          title: 'Gender Agreement Examples',
          conjugations: [
            { pronoun: 'Masculine', form: 'ce garçon', english: 'this boy' },
            { pronoun: 'Masculine (vowel)', form: 'cet étudiant', english: 'this student' },
            { pronoun: 'Feminine', form: 'cette fille', english: 'this girl' },
            { pronoun: 'Plural', form: 'ces étudiants', english: 'these students' }
          ]
        }
      }
    ]
  },
  {
    title: 'Common Uses of Demonstrative Adjectives',
    content: `Demonstrative adjectives are used in several important contexts:`,
    examples: [
      {
        spanish: 'Pointing out: Regarde cette voiture! (Look at this car!)',
        english: 'Drawing attention to something specific',
        highlight: ['cette voiture']
      },
      {
        spanish: 'Referring back: Ce livre est intéressant. (This book is interesting.)',
        english: 'Referring to something already mentioned',
        highlight: ['Ce livre']
      },
      {
        spanish: 'Time expressions: cette semaine (this week), ce matin (this morning)',
        english: 'Common time expressions',
        highlight: ['cette semaine', 'ce matin']
      }
    ],
    subsections: [
      {
        title: 'Time Expressions with Demonstratives',
        content: 'Common time expressions using demonstrative adjectives:',
        examples: [
          {
            spanish: 'ce matin (this morning)',
            english: 'ce soir (this evening)',
            highlight: ['ce matin', 'ce soir']
          },
          {
            spanish: 'cette semaine (this week)',
            english: 'cette année (this year)',
            highlight: ['cette semaine', 'cette année']
          },
          {
            spanish: 'ces jours-ci (these days)',
            english: 'ces temps-ci (these times)',
            highlight: ['ces jours-ci', 'ces temps-ci']
          }
        ]
      },
      {
        title: 'Demonstratives in Questions',
        content: 'Using demonstratives to ask about specific items:',
        examples: [
          {
            spanish: 'Qui est cet homme? (Who is this man?)',
            english: 'Qu\'est-ce que c\'est que cette chose? (What is this thing?)',
            highlight: ['cet homme', 'cette chose']
          },
          {
            spanish: 'Combien coûte ce livre? (How much does this book cost?)',
            english: 'Où sont ces clés? (Where are these keys?)',
            highlight: ['ce livre', 'ces clés']
          }
        ]
      }
    ]
  },
  {
    title: 'Distinguishing Near and Far',
    content: `When you need to distinguish between "this/these" (near) and "that/those" (far), French adds **-ci** (here) or **-là** (there) after the noun:`,
    examples: [
      {
        spanish: 'ce livre-ci (this book here)',
        english: 'ce livre-là (that book there)',
        highlight: ['livre-ci', 'livre-là']
      },
      {
        spanish: 'cette voiture-ci (this car here)',
        english: 'cette voiture-là (that car there)',
        highlight: ['voiture-ci', 'voiture-là']
      },
      {
        spanish: 'ces enfants-ci (these children here)',
        english: 'ces enfants-là (those children there)',
        highlight: ['enfants-ci', 'enfants-là']
      }
    ],
    subsections: [
      {
        title: 'When to Use -CI and -LÀ',
        content: 'These suffixes are used when distinction is necessary:',
        examples: [
          {
            spanish: 'Comparing: Ce livre-ci est meilleur que ce livre-là.',
            english: 'This book is better than that book.',
            highlight: ['livre-ci', 'livre-là']
          },
          {
            spanish: 'Choosing: Je préfère cette robe-ci à cette robe-là.',
            english: 'I prefer this dress to that dress.',
            highlight: ['robe-ci', 'robe-là']
          },
          {
            spanish: 'Contrasting: Ces étudiants-ci travaillent, ces étudiants-là jouent.',
            english: 'These students work, those students play.',
            highlight: ['étudiants-ci', 'étudiants-là']
          }
        ]
      }
    ]
  },
  {
    title: 'Demonstrative Adjectives vs Pronouns',
    content: `Don't confuse demonstrative **adjectives** (ce, cette, ces) with demonstrative **pronouns** (celui, celle, ceux, celles):

**Adjectives**: Modify nouns (ce livre)
**Pronouns**: Replace nouns (celui-ci)

Demonstrative adjectives always come before a noun.`,
    examples: [
      {
        spanish: 'Adjective: ce livre (this book)',
        english: 'Pronoun: celui-ci (this one)',
        highlight: ['ce livre', 'celui-ci']
      },
      {
        spanish: 'Adjective: cette voiture (this car)',
        english: 'Pronoun: celle-là (that one)',
        highlight: ['cette voiture', 'celle-là']
      }
    ],
    subsections: [
      {
        title: 'Side-by-Side Comparison',
        content: 'Adjectives vs pronouns in context:',
        examples: [
          {
            spanish: 'J\'aime ce livre. (I like this book.) - adjective',
            english: 'J\'aime celui-ci. (I like this one.) - pronoun',
            highlight: ['ce livre', 'celui-ci']
          },
          {
            spanish: 'Cette maison est belle. (This house is beautiful.) - adjective',
            english: 'Celle-là est belle. (That one is beautiful.) - pronoun',
            highlight: ['Cette maison', 'Celle-là']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Expressions with Demonstratives',
    content: `Many fixed expressions use demonstrative adjectives:`,
    examples: [
      {
        spanish: 'à cette époque (at that time)',
        english: 'en ce moment (at this moment)',
        highlight: ['cette époque', 'ce moment']
      },
      {
        spanish: 'dans ces conditions (under these conditions)',
        english: 'pour cette raison (for this reason)',
        highlight: ['ces conditions', 'cette raison']
      },
      {
        spanish: 'ce genre de (this kind of)',
        english: 'cette sorte de (this sort of)',
        highlight: ['ce genre', 'cette sorte']
      }
    ],
    subsections: [
      {
        title: 'Exclamatory Expressions',
        content: 'Demonstratives in exclamations:',
        examples: [
          {
            spanish: 'Quelle est cette odeur! (What is this smell!)',
            english: 'Regarde ce désordre! (Look at this mess!)',
            highlight: ['cette odeur', 'ce désordre']
          },
          {
            spanish: 'Comme cette musique est belle! (How beautiful this music is!)',
            english: 'Que ces fleurs sont jolies! (How pretty these flowers are!)',
            highlight: ['cette musique', 'ces fleurs']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Demonstrative Mistakes',
    content: `Here are frequent errors students make with demonstrative adjectives:

**1. Wrong gender agreement**: Using ce with feminine nouns
**2. Forgetting CET**: Using ce before vowels instead of cet
**3. Plural confusion**: Using wrong forms for plural
**4. Adjective vs pronoun**: Confusing demonstrative adjectives with pronouns`,
    examples: [
      {
        spanish: '❌ ce table → ✅ cette table',
        english: 'Wrong: table is feminine, needs cette',
        highlight: ['cette table']
      },
      {
        spanish: '❌ ce homme → ✅ cet homme',
        english: 'Wrong: must use cet before vowel sound',
        highlight: ['cet homme']
      },
      {
        spanish: '❌ cette livres → ✅ ces livres',
        english: 'Wrong: plural needs ces, not cette',
        highlight: ['ces livres']
      },
      {
        spanish: '❌ ce → ✅ ce livre (need noun after adjective)',
        english: 'Wrong: demonstrative adjective needs a noun',
        highlight: ['ce livre']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Gender Rules', url: '/grammar/french/nouns/gender-rules', difficulty: 'beginner' },
  { title: 'French Adjective Agreement', url: '/grammar/french/adjectives/agreement-rules', difficulty: 'beginner' },
  { title: 'French Demonstrative Pronouns', url: '/grammar/french/pronouns/demonstrative', difficulty: 'intermediate' },
  { title: 'French Possessive Adjectives', url: '/grammar/french/adjectives/possessive', difficulty: 'intermediate' }
];

export default function FrenchDemonstrativePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'adjectives',
              topic: 'demonstrative',
              title: 'French Demonstrative Adjectives (Ce, Cette, Ces)',
              description: 'Master French demonstrative adjectives ce, cet, cette, ces. Learn this/that and these/those with agreement rules and usage.',
              difficulty: 'beginner',
              examples: [
                'ce livre (this book)',
                'cet homme (this man)',
                'cette femme (this woman)',
                'ces enfants (these children)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adjectives',
              topic: 'demonstrative',
              title: 'French Demonstrative Adjectives (Ce, Cette, Ces)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adjectives"
        topic="demonstrative"
        title="French Demonstrative Adjectives (Ce, Cette, Ces)"
        description="Master French demonstrative adjectives ce, cet, cette, ces. Learn this/that and these/those with agreement rules and usage"
        difficulty="beginner"
        estimatedTime={8}
        sections={sections}
        backUrl="/grammar/french/adjectives"
        practiceUrl="/grammar/french/adjectives/demonstrative/practice"
        quizUrl="/grammar/french/adjectives/demonstrative/quiz"
        songUrl="/songs/fr?theme=grammar&topic=demonstrative"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
