import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'cases',
  topic: 'dative',
  title: 'German Dative Case - Usage, Articles, and Prepositions',
  description: 'Master the German dative case including articles, pronouns, prepositions, and usage rules for indirect objects.',
  difficulty: 'intermediate',
  keywords: [
    'german dative case',
    'dativ german',
    'german indirect object',
    'dative prepositions german',
    'german case system',
    'dative articles german'
  ],
  examples: [
    'Ich gebe dem Mann das Buch. (I give the man the book.)',
    'Sie hilft der Frau. (She helps the woman.)',
    'Das Geschenk ist für die Kinder. (The gift is for the children.)',
    'Er wohnt bei seinen Eltern. (He lives with his parents.)'
  ]
});

const sections = [
  {
    title: 'Understanding the German Dative Case',
    content: `The **German dative case** (der Dativ) indicates the **indirect object** of a sentence and is used with **specific prepositions**, **certain verbs**, and **expressions of time and place**. It answers the questions **"to whom?"** or **"for whom?"** something is done.

**Main functions of the dative case:**
- **Indirect objects**: The recipient of an action
- **Dative prepositions**: Fixed prepositions that always take dative
- **Dative verbs**: Verbs that require dative objects
- **Time expressions**: Certain temporal phrases
- **Possession**: Showing ownership or relationship

**Key characteristics:**
- **Third case**: After nominative and accusative in learning order
- **Indirect recipient**: Shows who receives or benefits from an action
- **Fixed prepositions**: Many prepositions always require dative
- **Article changes**: Definite and indefinite articles change form
- **Pronoun changes**: Personal pronouns have special dative forms

**Why the dative case matters:**
- **Essential communication**: Required for expressing giving, helping, showing
- **Preposition usage**: Many common prepositions need dative
- **Natural German**: Sounds unnatural without correct dative usage
- **Meaning clarity**: Distinguishes between direct and indirect objects

The dative case is **fundamental** for **intermediate German** and **natural communication**.`,
    examples: [
      {
        spanish: 'INDIRECT OBJECT: Ich gebe dem Kind ein Geschenk. (I give the child a gift.)',
        english: 'DATIVE PREPOSITION: Sie wohnt bei ihrer Familie. (She lives with her family.)',
        highlight: ['dem Kind', 'bei ihrer Familie']
      },
      {
        spanish: 'DATIVE VERB: Das Buch gehört mir. (The book belongs to me.)',
        english: 'TIME EXPRESSION: Wir fahren am Montag. (We\'re traveling on Monday.)',
        highlight: ['gehört mir', 'am Montag']
      }
    ]
  },
  {
    title: 'Dative Articles',
    content: `**Definite and indefinite articles** change form in the dative case:`,
    conjugationTable: {
      title: 'Dative Articles',
      conjugations: [
        { pronoun: 'Masculine', form: 'dem / einem', english: 'dem Mann (the man) / einem Mann (a man)' },
        { pronoun: 'Feminine', form: 'der / einer', english: 'der Frau (the woman) / einer Frau (a woman)' },
        { pronoun: 'Neuter', form: 'dem / einem', english: 'dem Kind (the child) / einem Kind (a child)' },
        { pronoun: 'Plural', form: 'den / —', english: 'den Kindern (the children) / Kindern (children)' }
      ]
    },
    examples: [
      {
        spanish: 'DEFINITE: Ich helfe dem Mann, der Frau, dem Kind.',
        english: 'INDEFINITE: Ich helfe einem Mann, einer Frau, einem Kind.',
        highlight: ['dem Mann, der Frau, dem Kind', 'einem Mann, einer Frau, einem Kind']
      }
    ],
    subsections: [
      {
        title: 'Plural Dative',
        content: 'Plural nouns add -n in dative (if not already ending in -n):',
        examples: [
          {
            spanish: 'die Kinder → den Kindern, die Bücher → den Büchern',
            english: 'die Frauen → den Frauen (already ends in -n)',
            highlight: ['den Kindern', 'den Frauen']
          }
        ]
      }
    ]
  },
  {
    title: 'Dative Personal Pronouns',
    content: `**Personal pronouns** have special forms in the dative case:`,
    conjugationTable: {
      title: 'Dative Personal Pronouns',
      conjugations: [
        { pronoun: 'ich', form: 'mir', english: 'to/for me - Das gehört mir. (That belongs to me.)' },
        { pronoun: 'du', form: 'dir', english: 'to/for you - Ich helfe dir. (I help you.)' },
        { pronoun: 'er', form: 'ihm', english: 'to/for him - Sie gibt ihm das Buch. (She gives him the book.)' },
        { pronoun: 'sie', form: 'ihr', english: 'to/for her - Wir helfen ihr. (We help her.)' },
        { pronoun: 'es', form: 'ihm', english: 'to/for it - Das schadet ihm. (That harms it.)' },
        { pronoun: 'wir', form: 'uns', english: 'to/for us - Er hilft uns. (He helps us.)' },
        { pronoun: 'ihr', form: 'euch', english: 'to/for you (plural) - Ich gebe euch die Bücher.' },
        { pronoun: 'sie/Sie', form: 'ihnen/Ihnen', english: 'to/for them/you (formal)' }
      ]
    },
    examples: [
      {
        spanish: 'Kannst du mir helfen? (Can you help me?)',
        english: 'Das Geschenk ist für dich. (The gift is for you.)',
        highlight: ['mir helfen', 'für dich']
      },
      {
        spanish: 'Wir geben ihnen die Schlüssel. (We give them the keys.)',
        english: 'Das Auto gehört uns. (The car belongs to us.)',
        highlight: ['ihnen die Schlüssel', 'gehört uns']
      }
    ]
  },
  {
    title: 'Dative Prepositions',
    content: `**Certain prepositions** always require the dative case:`,
    conjugationTable: {
      title: 'Always Dative Prepositions',
      conjugations: [
        { pronoun: 'aus', form: 'from, out of', english: 'aus dem Haus (from the house)' },
        { pronoun: 'bei', form: 'at, with, near', english: 'bei der Arbeit (at work)' },
        { pronoun: 'mit', form: 'with', english: 'mit dem Auto (with the car)' },
        { pronoun: 'nach', form: 'after, to', english: 'nach der Schule (after school)' },
        { pronoun: 'seit', form: 'since, for', english: 'seit einem Jahr (for a year)' },
        { pronoun: 'von', form: 'from, of', english: 'von meinem Freund (from my friend)' },
        { pronoun: 'zu', form: 'to', english: 'zu der Schule (to the school)' }
      ]
    },
    examples: [
      {
        spanish: 'Ich komme aus der Stadt. (I come from the city.)',
        english: 'Sie arbeitet bei einer Bank. (She works at a bank.)',
        highlight: ['aus der Stadt', 'bei einer Bank']
      },
      {
        spanish: 'Wir fahren mit dem Zug. (We travel by train.)',
        english: 'Nach dem Essen gehen wir spazieren. (After eating we go for a walk.)',
        highlight: ['mit dem Zug', 'Nach dem Essen']
      }
    ],
    subsections: [
      {
        title: 'Contractions',
        content: 'Some dative prepositions contract with articles:',
        examples: [
          {
            spanish: 'zu + dem = zum, zu + der = zur',
            english: 'von + dem = vom, bei + dem = beim',
            highlight: ['zum', 'zur', 'vom', 'beim']
          }
        ]
      }
    ]
  },
  {
    title: 'Dative Verbs',
    content: `**Certain verbs** always take dative objects instead of accusative:`,
    conjugationTable: {
      title: 'Common Dative Verbs',
      conjugations: [
        { pronoun: 'helfen', form: 'to help', english: 'Ich helfe dir. (I help you.)' },
        { pronoun: 'gehören', form: 'to belong', english: 'Das gehört mir. (That belongs to me.)' },
        { pronoun: 'gefallen', form: 'to please', english: 'Das gefällt mir. (I like that.)' },
        { pronoun: 'folgen', form: 'to follow', english: 'Folge mir! (Follow me!)' },
        { pronoun: 'danken', form: 'to thank', english: 'Ich danke dir. (I thank you.)' },
        { pronoun: 'antworten', form: 'to answer', english: 'Antworte mir! (Answer me!)' },
        { pronoun: 'glauben', form: 'to believe', english: 'Ich glaube ihm. (I believe him.)' }
      ]
    },
    examples: [
      {
        spanish: 'Kannst du mir helfen? (Can you help me?)',
        english: 'Dieses Buch gehört meiner Schwester. (This book belongs to my sister.)',
        highlight: ['mir helfen', 'meiner Schwester']
      },
      {
        spanish: 'Die Musik gefällt uns sehr. (We really like the music.)',
        english: 'Ich folge dem Lehrer. (I follow the teacher.)',
        highlight: ['gefällt uns', 'dem Lehrer']
      }
    ]
  },
  {
    title: 'Indirect Objects',
    content: `The **most common use** of dative is for **indirect objects** - the recipient of an action:`,
    examples: [
      {
        spanish: 'Ich gebe dem Kind ein Geschenk. (I give the child a gift.)',
        english: 'Sie schreibt ihrer Mutter einen Brief. (She writes her mother a letter.)',
        highlight: ['dem Kind', 'ihrer Mutter']
      },
      {
        spanish: 'Wir kaufen den Kindern Spielzeug. (We buy the children toys.)',
        english: 'Er erzählt uns eine Geschichte. (He tells us a story.)',
        highlight: ['den Kindern', 'uns']
      }
    ],
    subsections: [
      {
        title: 'Word Order',
        content: 'Dative usually comes before accusative:',
        examples: [
          {
            spanish: 'Ich gebe [DATIVE] dem Mann [ACCUSATIVE] das Buch.',
            english: 'Subject + Verb + Dative + Accusative',
            highlight: ['dem Mann das Buch']
          }
        ]
      }
    ]
  },
  {
    title: 'Dative with Adjectives',
    content: `**Some adjectives** require dative case:`,
    conjugationTable: {
      title: 'Adjectives Taking Dative',
      conjugations: [
        { pronoun: 'ähnlich', form: 'similar to', english: 'Er ist seinem Vater ähnlich. (He\'s similar to his father.)' },
        { pronoun: 'dankbar', form: 'grateful to', english: 'Ich bin dir dankbar. (I\'m grateful to you.)' },
        { pronoun: 'fremd', form: 'foreign to', english: 'Das ist mir fremd. (That\'s foreign to me.)' },
        { pronoun: 'nah', form: 'close to', english: 'Das Haus ist der Schule nah. (The house is close to school.)' },
        { pronoun: 'peinlich', form: 'embarrassing to', english: 'Das ist mir peinlich. (That\'s embarrassing to me.)' }
      ]
    },
    examples: [
      {
        spanish: 'Das Kind ist der Mutter sehr ähnlich. (The child is very similar to the mother.)',
        english: 'Ich bin meinen Eltern dankbar. (I\'m grateful to my parents.)',
        highlight: ['der Mutter ähnlich', 'meinen Eltern dankbar']
      }
    ]
  },
  {
    title: 'Time Expressions with Dative',
    content: `**Certain time expressions** use the dative case:`,
    conjugationTable: {
      title: 'Dative Time Expressions',
      conjugations: [
        { pronoun: 'am + day/date', form: 'on', english: 'am Montag (on Monday), am 15. Mai (on May 15th)' },
        { pronoun: 'im + month/season', form: 'in', english: 'im Januar (in January), im Winter (in winter)' },
        { pronoun: 'vor + time', form: 'ago', english: 'vor einem Jahr (a year ago)' },
        { pronoun: 'seit + time', form: 'since/for', english: 'seit drei Tagen (for three days)' }
      ]
    },
    examples: [
      {
        spanish: 'Wir treffen uns am Samstag. (We\'re meeting on Saturday.)',
        english: 'Im Sommer fahren wir nach Italien. (In summer we\'re going to Italy.)',
        highlight: ['am Samstag', 'Im Sommer']
      },
      {
        spanish: 'Vor einer Woche war ich krank. (A week ago I was sick.)',
        english: 'Seit dem Unfall kann er nicht laufen. (Since the accident he can\'t walk.)',
        highlight: ['Vor einer Woche', 'Seit dem Unfall']
      }
    ]
  },
  {
    title: 'Dative vs Accusative',
    content: `**Key differences** between dative and accusative cases:`,
    conjugationTable: {
      title: 'Dative vs Accusative Comparison',
      conjugations: [
        { pronoun: 'Function', form: 'Dative: Indirect object', english: 'Accusative: Direct object' },
        { pronoun: 'Question', form: 'Wem? (To whom?)', english: 'Wen/Was? (Whom/What?)' },
        { pronoun: 'Articles (masc.)', form: 'dem/einem', english: 'den/einen' },
        { pronoun: 'Pronouns', form: 'mir, dir, ihm, ihr', english: 'mich, dich, ihn, sie' }
      ]
    },
    examples: [
      {
        spanish: 'DATIVE: Ich helfe dem Mann. (I help the man.) - Wem helfe ich?',
        english: 'ACCUSATIVE: Ich sehe den Mann. (I see the man.) - Wen sehe ich?',
        highlight: ['dem Mann', 'den Mann']
      }
    ]
  },
  {
    title: 'Common Mistakes with Dative',
    content: `Here are frequent errors students make:

**1. Using accusative instead of dative**: With dative verbs and prepositions
**2. Wrong article forms**: Confusing dative articles
**3. Forgetting plural -n**: Not adding -n to dative plural nouns
**4. Wrong pronoun forms**: Using accusative pronouns instead of dative`,
    examples: [
      {
        spanish: '❌ Ich helfe den Mann → ✅ Ich helfe dem Mann',
        english: 'Wrong: helfen takes dative, not accusative',
        highlight: ['dem Mann']
      },
      {
        spanish: '❌ mit den Auto → ✅ mit dem Auto',
        english: 'Wrong: mit always takes dative',
        highlight: ['mit dem Auto']
      },
      {
        spanish: '❌ den Kinder → ✅ den Kindern',
        english: 'Wrong: dative plural needs -n ending',
        highlight: ['den Kindern']
      },
      {
        spanish: '❌ Das gehört mich → ✅ Das gehört mir',
        english: 'Wrong: gehören takes dative pronoun',
        highlight: ['gehört mir']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Nominative Case', url: '/grammar/german/cases/nominative', difficulty: 'beginner' },
  { title: 'German Accusative Case', url: '/grammar/german/cases/accusative', difficulty: 'beginner' },
  { title: 'German Genitive Case', url: '/grammar/german/cases/genitive', difficulty: 'intermediate' },
  { title: 'German Prepositions', url: '/grammar/german/cases/prepositions', difficulty: 'intermediate' }
];

export default function GermanDativePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'german',
              category: 'cases',
              topic: 'dative',
              title: 'German Dative Case - Usage, Articles, and Prepositions',
              description: 'Master the German dative case including articles, pronouns, prepositions, and usage rules for indirect objects.',
              difficulty: 'intermediate',
              examples: [
                'Ich gebe dem Mann das Buch. (I give the man the book.)',
                'Sie hilft der Frau. (She helps the woman.)',
                'Das Geschenk ist für die Kinder. (The gift is for the children.)',
                'Er wohnt bei seinen Eltern. (He lives with his parents.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'cases',
              topic: 'dative',
              title: 'German Dative Case - Usage, Articles, and Prepositions'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="cases"
        topic="dative"
        title="German Dative Case - Usage, Articles, and Prepositions"
        description="Master the German dative case including articles, pronouns, prepositions, and usage rules for indirect objects"
        difficulty="intermediate"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/german/cases"
        practiceUrl="/grammar/german/cases/dative/practice"
        quizUrl="/grammar/german/cases/dative/quiz"
        songUrl="/songs/de?theme=grammar&topic=dative"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
