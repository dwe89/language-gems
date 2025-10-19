import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adjectives',
  topic: 'interrogative-adjectives',
  title: 'French Interrogative Adjectives (Quel, Quelle, Quels, Quelles)',
  description: 'Master French interrogative adjectives quel/quelle/quels/quelles for asking "which" or "what" questions.',
  difficulty: 'intermediate',
  keywords: [
    'french interrogative adjectives',
    'quel quelle french',
    'quels quelles french',
    'which what french',
    'french question words',
    'interrogative determiners french'
  ],
  examples: [
    'Quel livre préfères-tu? (Which book do you prefer?)',
    'Quelle heure est-il? (What time is it?)',
    'Quels films aimes-tu? (Which films do you like?)',
    'Quelles couleurs préfères-tu? (Which colors do you prefer?)'
  ]
});

const sections = [
  {
    title: 'Understanding French Interrogative Adjectives',
    content: `French interrogative adjectives ask **"which"** or **"what"** and must agree in **gender and number** with the noun they modify.

**The complete system:**
- **quel** (masculine singular): quel livre? (which book?)
- **quelle** (feminine singular): quelle voiture? (which car?)
- **quels** (masculine plural): quels livres? (which books?)
- **quelles** (feminine plural): quelles voitures? (which cars?)

**Key characteristics:**
- **Agreement**: Must match the noun in gender and number
- **Position**: Usually directly before the noun
- **Usage**: For asking about specific choices or identification
- **Pronunciation**: All forms sound the same [kɛl]

These adjectives are essential for asking questions about specific items, making choices, and seeking clarification in French.`,
    examples: [
      {
        spanish: 'Quel âge as-tu? (What age are you? / How old are you?)',
        english: 'Agreement with "âge" (masculine singular)',
        highlight: ['Quel âge']
      },
      {
        spanish: 'Quelle est ta couleur préférée? (What is your favorite color?)',
        english: 'Agreement with "couleur" (feminine singular)',
        highlight: ['Quelle']
      },
      {
        spanish: 'Quels sports pratiques-tu? (Which sports do you practice?)',
        english: 'Agreement with "sports" (masculine plural)',
        highlight: ['Quels sports']
      }
    ]
  },
  {
    title: 'QUEL - Masculine Singular',
    content: `**QUEL** is used with masculine singular nouns:`,
    examples: [
      {
        spanish: 'Quel livre lis-tu? (Which book are you reading?)',
        english: 'Quel jour sommes-nous? (What day is it?)',
        highlight: ['Quel livre', 'Quel jour']
      },
      {
        spanish: 'Quel temps fait-il? (What\'s the weather like?)',
        english: 'Quel est ton nom? (What is your name?)',
        highlight: ['Quel temps', 'Quel est ton nom']
      }
    ],
    subsections: [
      {
        title: 'Common Expressions with QUEL',
        content: 'Frequently used phrases:',
        examples: [
          {
            spanish: 'Quel âge? (What age?), Quel temps? (What weather?)',
            english: 'Quel dommage! (What a pity!), Quel plaisir! (What a pleasure!)',
            highlight: ['Quel âge', 'Quel dommage']
          }
        ]
      }
    ]
  },
  {
    title: 'QUELLE - Feminine Singular',
    content: `**QUELLE** is used with feminine singular nouns:`,
    examples: [
      {
        spanish: 'Quelle heure est-il? (What time is it?)',
        english: 'Quelle voiture préfères-tu? (Which car do you prefer?)',
        highlight: ['Quelle heure', 'Quelle voiture']
      },
      {
        spanish: 'Quelle est ta profession? (What is your profession?)',
        english: 'Quelle belle journée! (What a beautiful day!)',
        highlight: ['Quelle est ta profession', 'Quelle belle journée']
      }
    ],
    subsections: [
      {
        title: 'Common Expressions with QUELLE',
        content: 'Frequently used phrases:',
        examples: [
          {
            spanish: 'Quelle heure? (What time?), Quelle chance! (What luck!)',
            english: 'Quelle surprise! (What a surprise!), Quelle histoire! (What a story!)',
            highlight: ['Quelle heure', 'Quelle chance']
          }
        ]
      }
    ]
  },
  {
    title: 'QUELS - Masculine Plural',
    content: `**QUELS** is used with masculine plural nouns:`,
    examples: [
      {
        spanish: 'Quels films aimes-tu? (Which films do you like?)',
        english: 'Quels sont tes hobbies? (What are your hobbies?)',
        highlight: ['Quels films', 'Quels sont tes hobbies']
      },
      {
        spanish: 'Quels livres as-tu lus? (Which books have you read?)',
        english: 'Quels beaux enfants! (What beautiful children!)',
        highlight: ['Quels livres', 'Quels beaux enfants']
      }
    ],
    subsections: [
      {
        title: 'Plural Agreement',
        content: 'Must agree with plural masculine nouns:',
        examples: [
          {
            spanish: 'Quels pays as-tu visités? (Which countries have you visited?)',
            english: 'Quels sont tes projets? (What are your plans?)',
            highlight: ['Quels pays', 'Quels sont tes projets']
          }
        ]
      }
    ]
  },
  {
    title: 'QUELLES - Feminine Plural',
    content: `**QUELLES** is used with feminine plural nouns:`,
    examples: [
      {
        spanish: 'Quelles couleurs préfères-tu? (Which colors do you prefer?)',
        english: 'Quelles sont tes matières préférées? (What are your favorite subjects?)',
        highlight: ['Quelles couleurs', 'Quelles sont tes matières préférées']
      },
      {
        spanish: 'Quelles langues parles-tu? (Which languages do you speak?)',
        english: 'Quelles belles fleurs! (What beautiful flowers!)',
        highlight: ['Quelles langues', 'Quelles belles fleurs']
      }
    ],
    subsections: [
      {
        title: 'Feminine Plural Agreement',
        content: 'Must agree with plural feminine nouns:',
        examples: [
          {
            spanish: 'Quelles chaussures portes-tu? (Which shoes are you wearing?)',
            english: 'Quelles sont tes vacances préférées? (What are your favorite vacations?)',
            highlight: ['Quelles chaussures', 'Quelles sont tes vacances préférées']
          }
        ]
      }
    ]
  },
  {
    title: 'Agreement Rules and Patterns',
    content: `Interrogative adjectives follow strict agreement rules:`,
    conjugationTable: {
      title: 'Agreement Patterns',
      conjugations: [
        { pronoun: 'Masculine singular', form: 'quel + masc. sing. noun', english: 'quel livre, quel homme' },
        { pronoun: 'Feminine singular', form: 'quelle + fem. sing. noun', english: 'quelle voiture, quelle femme' },
        { pronoun: 'Masculine plural', form: 'quels + masc. plural noun', english: 'quels livres, quels hommes' },
        { pronoun: 'Feminine plural', form: 'quelles + fem. plural noun', english: 'quelles voitures, quelles femmes' }
      ]
    },
    subsections: [
      {
        title: 'Agreement with Compound Nouns',
        content: 'Agreement follows the main noun:',
        examples: [
          {
            spanish: 'Quel grand-père? (Which grandfather?)',
            english: 'Quelle grand-mère? (Which grandmother?)',
            highlight: ['Quel grand-père', 'Quelle grand-mère']
          }
        ]
      }
    ]
  },
  {
    title: 'Question Formation with Interrogative Adjectives',
    content: `Different ways to form questions with QUEL:`,
    examples: [
      {
        spanish: 'Quel livre lis-tu? (Which book are you reading?) - Standard order',
        english: 'Tu lis quel livre? (You\'re reading which book?) - Informal',
        highlight: ['Quel livre lis-tu', 'Tu lis quel livre']
      },
      {
        spanish: 'Quel est ton livre préféré? (What is your favorite book?) - With être',
        english: 'C\'est quel livre? (It\'s which book?) - Very informal',
        highlight: ['Quel est ton livre préféré', 'C\'est quel livre']
      }
    ],
    subsections: [
      {
        title: 'Formal Question Structure',
        content: 'Standard interrogative word order:',
        examples: [
          {
            spanish: 'Quelle heure est-il? (What time is it?)',
            english: 'Quels sont tes plans? (What are your plans?)',
            highlight: ['Quelle heure est-il', 'Quels sont tes plans']
          }
        ]
      },
      {
        title: 'Informal Question Structure',
        content: 'Statement word order with rising intonation:',
        examples: [
          {
            spanish: 'Tu préfères quelle couleur? (Which color do you prefer?)',
            english: 'Il est quelle heure? (What time is it?)',
            highlight: ['Tu préfères quelle couleur', 'Il est quelle heure']
          }
        ]
      }
    ]
  },
  {
    title: 'QUEL with ÊTRE - Special Constructions',
    content: `QUEL is often used with the verb ÊTRE:`,
    examples: [
      {
        spanish: 'Quel est ton nom? (What is your name?)',
        english: 'Quelle est ta nationalité? (What is your nationality?)',
        highlight: ['Quel est ton nom', 'Quelle est ta nationalité']
      },
      {
        spanish: 'Quels sont tes hobbies? (What are your hobbies?)',
        english: 'Quelles sont tes couleurs préférées? (What are your favorite colors?)',
        highlight: ['Quels sont tes hobbies', 'Quelles sont tes couleurs préférées']
      }
    ],
    subsections: [
      {
        title: 'Identity Questions',
        content: 'Asking for identification or specification:',
        examples: [
          {
            spanish: 'Quel est ce bruit? (What is that noise?)',
            english: 'Quelle est cette odeur? (What is that smell?)',
            highlight: ['Quel est ce bruit', 'Quelle est cette odeur']
          }
        ]
      }
    ]
  },
  {
    title: 'Exclamatory Uses of QUEL',
    content: `QUEL can express exclamation (What a...!):`,
    examples: [
      {
        spanish: 'Quel beau temps! (What beautiful weather!)',
        english: 'Quelle belle maison! (What a beautiful house!)',
        highlight: ['Quel beau temps', 'Quelle belle maison']
      },
      {
        spanish: 'Quels beaux enfants! (What beautiful children!)',
        english: 'Quelles jolies fleurs! (What pretty flowers!)',
        highlight: ['Quels beaux enfants', 'Quelles jolies fleurs']
      }
    ],
    subsections: [
      {
        title: 'Exclamatory Structure',
        content: 'QUEL + adjective + noun for exclamations:',
        examples: [
          {
            spanish: 'Quel dommage! (What a pity!)',
            english: 'Quelle surprise! (What a surprise!)',
            highlight: ['Quel dommage', 'Quelle surprise']
          }
        ]
      }
    ]
  },
  {
    title: 'QUEL vs Other Question Words',
    content: `Distinguishing QUEL from other interrogatives:`,
    conjugationTable: {
      title: 'Question Word Comparison',
      conjugations: [
        { pronoun: 'quel/quelle/quels/quelles', form: 'which/what + noun', english: 'Quel livre? (Which book?)' },
        { pronoun: 'que/qu\'est-ce que', form: 'what (object)', english: 'Que fais-tu? (What are you doing?)' },
        { pronoun: 'qui', form: 'who', english: 'Qui est-ce? (Who is it?)' },
        { pronoun: 'où', form: 'where', english: 'Où vas-tu? (Where are you going?)' }
      ]
    },
    subsections: [
      {
        title: 'QUEL vs QUE',
        content: 'QUEL modifies nouns, QUE stands alone:',
        examples: [
          {
            spanish: 'Quel livre? (Which book?) - modifies "livre"',
            english: 'Que lis-tu? (What are you reading?) - stands alone',
            highlight: ['Quel livre', 'Que lis-tu']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Expressions and Idioms',
    content: `Fixed expressions with interrogative adjectives:`,
    examples: [
      {
        spanish: 'Quel âge as-tu? (How old are you?)',
        english: 'Quelle heure est-il? (What time is it?)',
        highlight: ['Quel âge as-tu', 'Quelle heure est-il']
      },
      {
        spanish: 'Quel temps fait-il? (What\'s the weather like?)',
        english: 'Quelle est la date? (What\'s the date?)',
        highlight: ['Quel temps fait-il', 'Quelle est la date']
      }
    ],
    subsections: [
      {
        title: 'Time and Age Expressions',
        content: 'Common questions about time and age:',
        examples: [
          {
            spanish: 'Quel jour sommes-nous? (What day is it?)',
            english: 'Quelle saison préfères-tu? (Which season do you prefer?)',
            highlight: ['Quel jour sommes-nous', 'Quelle saison préfères-tu']
          }
        ]
      }
    ]
  },
  {
    title: 'Regional and Stylistic Variations',
    content: `Usage variations in different contexts:`,
    subsections: [
      {
        title: 'Formal vs Informal',
        content: 'Different question structures:',
        examples: [
          {
            spanish: 'Formal: Quel livre préférez-vous?',
            english: 'Informal: Tu préfères quel livre?',
            highlight: ['Quel livre préférez-vous', 'Tu préfères quel livre']
          }
        ]
      },
      {
        title: 'Regional Differences',
        content: 'Some variation in question formation:',
        examples: [
          {
            spanish: 'Standard: Quelle heure est-il?',
            english: 'Quebec: Il est quelle heure?',
            highlight: ['Quelle heure est-il', 'Il est quelle heure']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes with Interrogative Adjectives',
    content: `Here are frequent errors students make:

**1. Agreement errors**: Wrong gender or number agreement
**2. Confusing with QUE**: Using QUE instead of QUEL with nouns
**3. Position mistakes**: Wrong word order in questions
**4. Missing agreement**: Forgetting to match noun characteristics`,
    examples: [
      {
        spanish: '❌ Quel voiture? → ✅ Quelle voiture?',
        english: 'Wrong: "voiture" is feminine, needs "quelle"',
        highlight: ['Quelle voiture']
      },
      {
        spanish: '❌ Quels couleur? → ✅ Quelles couleurs?',
        english: 'Wrong: "couleurs" is feminine plural, needs "quelles"',
        highlight: ['Quelles couleurs']
      },
      {
        spanish: '❌ Que livre lis-tu? → ✅ Quel livre lis-tu?',
        english: 'Wrong: use QUEL when modifying a noun',
        highlight: ['Quel livre lis-tu']
      },
      {
        spanish: '❌ Quel sont tes hobbies? → ✅ Quels sont tes hobbies?',
        english: 'Wrong: "hobbies" is plural, needs "quels"',
        highlight: ['Quels sont tes hobbies']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Question Formation', url: '/grammar/french/syntax/questions', difficulty: 'intermediate' },
  { title: 'French Interrogative Pronouns', url: '/grammar/french/pronouns/interrogative', difficulty: 'intermediate' },
  { title: 'French Adjective Agreement', url: '/grammar/french/adjectives/agreement-rules', difficulty: 'intermediate' },
  { title: 'French Demonstrative Adjectives', url: '/grammar/french/adjectives/demonstrative', difficulty: 'beginner' }
];

export default function FrenchInterrogativeAdjectivesPage() {
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
              topic: 'interrogative-adjectives',
              title: 'French Interrogative Adjectives (Quel, Quelle, Quels, Quelles)',
              description: 'Master French interrogative adjectives quel/quelle/quels/quelles for asking "which" or "what" questions.',
              difficulty: 'intermediate',
              examples: [
                'Quel livre préfères-tu? (Which book do you prefer?)',
                'Quelle heure est-il? (What time is it?)',
                'Quels films aimes-tu? (Which films do you like?)',
                'Quelles couleurs préfères-tu? (Which colors do you prefer?)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adjectives',
              topic: 'interrogative-adjectives',
              title: 'French Interrogative Adjectives (Quel, Quelle, Quels, Quelles)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adjectives"
        topic="interrogative-adjectives"
        title="French Interrogative Adjectives (Quel, Quelle, Quels, Quelles)"
        description="Master French interrogative adjectives quel/quelle/quels/quelles for asking 'which' or 'what' questions"
        difficulty="intermediate"
        estimatedTime={14}
        sections={sections}
        backUrl="/grammar/french/adjectives"
        practiceUrl="/grammar/french/adjectives/interrogative-adjectives/practice"
        quizUrl="/grammar/french/adjectives/interrogative-adjectives/quiz"
        songUrl="/songs/fr?theme=grammar&topic=interrogative-adjectives"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
