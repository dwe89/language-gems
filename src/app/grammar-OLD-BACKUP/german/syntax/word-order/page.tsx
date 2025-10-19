import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'syntax',
  topic: 'word-order',
  title: 'German Word Order - Main Clauses, Questions, and Subordinate Clauses',
  description: 'Master German word order including verb position rules, question formation, and subordinate clause structure.',
  difficulty: 'intermediate',
  keywords: [
    'german word order',
    'german sentence structure',
    'verb position german',
    'german subordinate clauses',
    'german question formation',
    'german syntax rules'
  ],
  examples: [
    'Ich gehe morgen nach Berlin. (I go to Berlin tomorrow.)',
    'Morgen gehe ich nach Berlin. (Tomorrow I go to Berlin.)',
    'Ich weiß, dass er morgen kommt. (I know that he comes tomorrow.)',
    'Wann kommst du nach Hause? (When do you come home?)'
  ]
});

const sections = [
  {
    title: 'Understanding German Word Order',
    content: `German **word order** (Wortstellung) follows **systematic rules** that differ significantly from English. Understanding these patterns is **essential** for constructing **grammatically correct** and **natural-sounding** German sentences.

**Key principles:**
- **Verb position**: The conjugated verb has a **fixed position**
- **Information structure**: **New information** typically comes at the end
- **Case system**: Word order is **more flexible** due to case marking
- **Clause types**: Different rules for main clauses, questions, and subordinate clauses

**Main word order patterns:**
- **Position 1**: Subject or other element (topic)
- **Position 2**: Conjugated verb (always!)
- **End position**: Infinitives, past participles, separable prefixes

**Why word order matters:**
- **Grammatical correctness**: Wrong order = incorrect German
- **Natural communication**: Native-like sentence flow
- **Meaning clarity**: Affects emphasis and information structure
- **Advanced proficiency**: Marks intermediate/advanced German

**Learning strategy**: Master **main clause patterns** first, then learn **question formation**, finally tackle **subordinate clauses**.

Understanding German word order is **crucial** for **intermediate German** and **natural sentence construction**.`,
    examples: [
      {
        spanish: 'BASIC: Ich lese ein Buch. (I read a book.)',
        english: 'FRONTED: Ein Buch lese ich. (A book I read.)',
        highlight: ['Ich lese', 'lese ich']
      },
      {
        spanish: 'MAIN: Er kommt morgen. (He comes tomorrow.)',
        english: 'SUBORDINATE: Ich weiß, dass er morgen kommt. (I know that he comes tomorrow.)',
        highlight: ['Er kommt', 'er kommt']
      }
    ]
  },
  {
    title: 'Basic Main Clause Word Order (SVO)',
    content: `**Main clauses** follow the **Subject-Verb-Object** pattern with the **conjugated verb in position 2**:`,
    conjugationTable: {
      title: 'Basic Main Clause Pattern',
      conjugations: [
        { pronoun: 'Position 1', form: 'Subject', english: 'Ich (I)' },
        { pronoun: 'Position 2', form: 'Conjugated Verb', english: 'lese (read)' },
        { pronoun: 'Position 3+', form: 'Objects/Complements', english: 'ein Buch (a book)' },
        { pronoun: 'End', form: 'Infinitive/Participle', english: 'gelesen (read - past participle)' }
      ]
    },
    examples: [
      {
        spanish: 'SIMPLE: Ich trinke Kaffee. (I drink coffee.)',
        english: 'COMPLEX: Ich habe gestern Kaffee getrunken. (I drank coffee yesterday.)',
        highlight: ['Ich trinke', 'habe getrunken']
      },
      {
        spanish: 'MODAL: Sie kann gut singen. (She can sing well.)',
        english: 'SEPARABLE: Er steht früh auf. (He gets up early.)',
        highlight: ['kann singen', 'steht auf']
      }
    ]
  },
  {
    title: 'Verb-Second Rule (V2)',
    content: `The **conjugated verb** must **always** be in **position 2** in main clauses:`,
    examples: [
      {
        spanish: 'SUBJECT FIRST: Ich gehe morgen nach Berlin. (I go to Berlin tomorrow.)',
        english: 'TIME FIRST: Morgen gehe ich nach Berlin. (Tomorrow I go to Berlin.)',
        highlight: ['Ich gehe', 'gehe ich']
      },
      {
        spanish: 'OBJECT FIRST: Das Buch lese ich gern. (The book I like to read.)',
        english: 'PLACE FIRST: In Berlin wohne ich. (In Berlin I live.)',
        highlight: ['lese ich', 'wohne ich']
      }
    ],
    subsections: [
      {
        title: 'Key Rule',
        content: 'Whatever comes first, the verb is always second:',
        examples: [
          {
            spanish: 'PATTERN: [Anything] [Verb] [Subject if not first] [Rest]',
            english: 'FLEXIBLE: Any element can be in position 1 for emphasis',
            highlight: ['Verb always position 2']
          }
        ]
      }
    ]
  },
  {
    title: 'Time-Manner-Place (TMP) Order',
    content: `**Adverbial information** follows the **Time-Manner-Place** sequence:`,
    conjugationTable: {
      title: 'TMP Order',
      conjugations: [
        { pronoun: 'Time', form: 'When?', english: 'morgen, gestern, um 8 Uhr' },
        { pronoun: 'Manner', form: 'How?', english: 'schnell, mit dem Auto, gern' },
        { pronoun: 'Place', form: 'Where?', english: 'nach Berlin, zu Hause, hier' }
      ]
    },
    examples: [
      {
        spanish: 'FULL TMP: Ich fahre morgen schnell nach Berlin. (I drive to Berlin quickly tomorrow.)',
        english: 'PARTIAL: Sie geht heute zu Fuß zur Schule. (She walks to school today.)',
        highlight: ['morgen schnell nach Berlin', 'heute zu Fuß zur Schule']
      }
    ]
  },
  {
    title: 'Object Order: Dative Before Accusative',
    content: `When both **dative and accusative objects** are present, **dative comes first**:`,
    conjugationTable: {
      title: 'Object Order Rules',
      conjugations: [
        { pronoun: 'Two nouns', form: 'Dative + Accusative', english: 'Ich gebe dem Mann das Buch.' },
        { pronoun: 'Two pronouns', form: 'Accusative + Dative', english: 'Ich gebe es ihm.' },
        { pronoun: 'Pronoun + noun', form: 'Pronoun first', english: 'Ich gebe ihm das Buch.' },
        { pronoun: 'Noun + pronoun', form: 'Pronoun first', english: 'Ich gebe es dem Mann.' }
      ]
    },
    examples: [
      {
        spanish: 'TWO NOUNS: Er gibt der Frau die Blumen. (He gives the woman the flowers.)',
        english: 'TWO PRONOUNS: Er gibt sie ihr. (He gives them to her.)',
        highlight: ['der Frau die Blumen', 'sie ihr']
      }
    ]
  },
  {
    title: 'Question Word Order',
    content: `**Questions** have specific word order patterns:`,
    conjugationTable: {
      title: 'Question Formation',
      conjugations: [
        { pronoun: 'Yes/No questions', form: 'Verb + Subject + ...', english: 'Kommst du mit? (Are you coming along?)' },
        { pronoun: 'W-questions', form: 'W-word + Verb + Subject + ...', english: 'Wann kommst du? (When are you coming?)' },
        { pronoun: 'Question + object', form: 'W-word + Object + Verb + Subject', english: 'Was machst du? (What are you doing?)' }
      ]
    },
    examples: [
      {
        spanish: 'YES/NO: Gehst du heute ins Kino? (Are you going to the cinema today?)',
        english: 'W-QUESTION: Wohin gehst du heute? (Where are you going today?)',
        highlight: ['Gehst du', 'Wohin gehst du']
      },
      {
        spanish: 'OBJECT: Wen siehst du? (Whom do you see?)',
        english: 'TIME: Wann kommst du nach Hause? (When do you come home?)',
        highlight: ['Wen siehst du', 'Wann kommst du']
      }
    ]
  },
  {
    title: 'Subordinate Clause Word Order',
    content: `**Subordinate clauses** have **verb-final** word order:`,
    conjugationTable: {
      title: 'Subordinate Clause Pattern',
      conjugations: [
        { pronoun: 'dass-clause', form: '..., dass ich morgen komme.', english: '..., that I come tomorrow.' },
        { pronoun: 'weil-clause', form: '..., weil er krank ist.', english: '..., because he is sick.' },
        { pronoun: 'wenn-clause', form: '..., wenn du Zeit hast.', english: '..., if you have time.' },
        { pronoun: 'ob-clause', form: '..., ob sie mitkommt.', english: '..., whether she comes along.' }
      ]
    },
    examples: [
      {
        spanish: 'MAIN: Er ist krank. → SUBORDINATE: Ich weiß, dass er krank ist.',
        english: 'MAIN: Du kommst mit. → SUBORDINATE: Ich hoffe, dass du mitkommst.',
        highlight: ['er krank ist', 'du mitkommst']
      }
    ]
  },
  {
    title: 'Modal Verbs and Word Order',
    content: `**Modal verbs** create **two-verb constructions** with specific order:`,
    examples: [
      {
        spanish: 'MAIN CLAUSE: Ich kann morgen kommen. (I can come tomorrow.)',
        english: 'SUBORDINATE: ..., weil ich morgen kommen kann. (..., because I can come tomorrow.)',
        highlight: ['kann kommen', 'kommen kann']
      },
      {
        spanish: 'QUESTION: Kannst du mir helfen? (Can you help me?)',
        english: 'PERFECT: Ich habe kommen können. (I was able to come.)',
        highlight: ['Kannst du helfen', 'kommen können']
      }
    ]
  },
  {
    title: 'Separable Verbs and Word Order',
    content: `**Separable verbs** affect word order differently in main and subordinate clauses:`,
    examples: [
      {
        spanish: 'MAIN: Ich stehe um 7 Uhr auf. (I get up at 7 o\'clock.)',
        english: 'SUBORDINATE: ..., weil ich um 7 Uhr aufstehe. (..., because I get up at 7 o\'clock.)',
        highlight: ['stehe auf', 'aufstehe']
      },
      {
        spanish: 'MODAL MAIN: Ich will früh aufstehen. (I want to get up early.)',
        english: 'MODAL SUBORDINATE: ..., weil ich früh aufstehen will. (..., because I want to get up early.)',
        highlight: ['will aufstehen', 'aufstehen will']
      }
    ]
  },
  {
    title: 'Perfect Tense Word Order',
    content: `**Perfect tense** places the **past participle** at the end:`,
    examples: [
      {
        spanish: 'MAIN: Ich habe gestern ein Buch gelesen. (I read a book yesterday.)',
        english: 'SUBORDINATE: ..., weil ich gestern ein Buch gelesen habe. (..., because I read a book yesterday.)',
        highlight: ['habe gelesen', 'gelesen habe']
      },
      {
        spanish: 'QUESTION: Hast du das Buch gelesen? (Have you read the book?)',
        english: 'SEPARABLE: Ich bin früh aufgestanden. (I got up early.)',
        highlight: ['Hast gelesen', 'bin aufgestanden']
      }
    ]
  },
  {
    title: 'Negation and Word Order',
    content: `**nicht** has specific positions depending on what it negates:`,
    conjugationTable: {
      title: 'nicht Position Rules',
      conjugations: [
        { pronoun: 'Whole sentence', form: 'Before verb/end', english: 'Ich komme nicht. (I\'m not coming.)' },
        { pronoun: 'Specific element', form: 'Before that element', english: 'Ich komme nicht heute. (I\'m not coming today.)' },
        { pronoun: 'With separable verb', form: 'Before prefix', english: 'Ich stehe nicht auf. (I\'m not getting up.)' },
        { pronoun: 'With perfect tense', form: 'Before participle', english: 'Ich habe nicht gelesen. (I didn\'t read.)' }
      ]
    },
    examples: [
      {
        spanish: 'SENTENCE: Er arbeitet heute nicht. (He doesn\'t work today.)',
        english: 'ELEMENT: Er arbeitet nicht heute. (He doesn\'t work today - emphasis on not today.)',
        highlight: ['arbeitet nicht', 'nicht heute']
      }
    ]
  },
  {
    title: 'Common Word Order Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong verb position**: Not putting conjugated verb in position 2
**2. English word order**: Using English patterns in German
**3. Subordinate clause errors**: Using main clause order in subordinate clauses
**4. Object order**: Wrong sequence of dative and accusative objects`,
    examples: [
      {
        spanish: '❌ Ich morgen gehe → ✅ Ich gehe morgen / Morgen gehe ich',
        english: 'Wrong: verb must be in position 2',
        highlight: ['gehe morgen', 'Morgen gehe ich']
      },
      {
        spanish: '❌ Ich weiß, dass er kommt morgen → ✅ Ich weiß, dass er morgen kommt',
        english: 'Wrong: verb goes to end in subordinate clauses',
        highlight: ['er morgen kommt']
      },
      {
        spanish: '❌ Ich gebe das Buch dem Mann → ✅ Ich gebe dem Mann das Buch',
        english: 'Wrong: dative before accusative with two nouns',
        highlight: ['dem Mann das Buch']
      },
      {
        spanish: '❌ Wann du kommst? → ✅ Wann kommst du?',
        english: 'Wrong: verb comes after question word',
        highlight: ['Wann kommst du']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Subordinate Clauses', url: '/grammar/german/syntax/subordinate-clauses', difficulty: 'intermediate' },
  { title: 'German Question Formation', url: '/grammar/german/syntax/questions', difficulty: 'beginner' },
  { title: 'German Modal Verbs', url: '/grammar/german/verbs/modal-verbs', difficulty: 'intermediate' },
  { title: 'German Separable Verbs', url: '/grammar/german/verbs/separable-verbs', difficulty: 'intermediate' }
];

export default function GermanWordOrderPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'german',
              category: 'syntax',
              topic: 'word-order',
              title: 'German Word Order - Main Clauses, Questions, and Subordinate Clauses',
              description: 'Master German word order including verb position rules, question formation, and subordinate clause structure.',
              difficulty: 'intermediate',
              examples: [
                'Ich gehe morgen nach Berlin. (I go to Berlin tomorrow.)',
                'Morgen gehe ich nach Berlin. (Tomorrow I go to Berlin.)',
                'Ich weiß, dass er morgen kommt. (I know that he comes tomorrow.)',
                'Wann kommst du nach Hause? (When do you come home?)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'syntax',
              topic: 'word-order',
              title: 'German Word Order - Main Clauses, Questions, and Subordinate Clauses'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="syntax"
        topic="word-order"
        title="German Word Order - Main Clauses, Questions, and Subordinate Clauses"
        description="Master German word order including verb position rules, question formation, and subordinate clause structure"
        difficulty="intermediate"
        estimatedTime={22}
        sections={sections}
        backUrl="/grammar/german/syntax"
        practiceUrl="/grammar/german/syntax/word-order/practice"
        quizUrl="/grammar/german/syntax/word-order/quiz"
        songUrl="/songs/de?theme=grammar&topic=word-order"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
