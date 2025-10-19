import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'pronouns',
  topic: 'relative-pronouns',
  title: 'French Relative Pronouns (Qui, Que, Dont, Où)',
  description: 'Master French relative pronouns for complex sentences. Learn qui, que, dont, où with subordinate clauses and connections.',
  difficulty: 'advanced',
  keywords: [
    'french relative pronouns',
    'qui que dont où',
    'relative clauses french',
    'subordinate clauses french',
    'french grammar pronouns',
    'complex sentences french'
  ],
  examples: [
    'L\'homme qui parle (the man who speaks)',
    'Le livre que je lis (the book that I read)',
    'La fille dont je parle (the girl I\'m talking about)',
    'L\'endroit où je vais (the place where I go)'
  ]
});

const sections = [
  {
    title: 'Understanding Relative Pronouns',
    content: `French relative pronouns **connect** two clauses by replacing a repeated noun. They create complex sentences and avoid repetition.

The four main French relative pronouns are: **qui**, **que**, **dont**, and **où**. Each has specific uses based on its grammatical function in the relative clause.

Relative pronouns are essential for sophisticated French expression and writing.`,
    examples: [
      {
        spanish: 'Simple: J\'ai un ami. Il parle français. (I have a friend. He speaks French.)',
        english: 'Complex: J\'ai un ami qui parle français. (I have a friend who speaks French.)',
        highlight: ['qui parle français']
      },
      {
        spanish: 'Simple: Je lis un livre. Tu m\'as donné ce livre. (I\'m reading a book. You gave me this book.)',
        english: 'Complex: Je lis le livre que tu m\'as donné. (I\'m reading the book that you gave me.)',
        highlight: ['que tu m\'as donné']
      }
    ]
  },
  {
    title: 'QUI - Subject of Relative Clause',
    content: `**Qui** replaces the **subject** of the relative clause. It means "who," "which," or "that" when referring to the subject.

Qui is used when the relative pronoun performs the action in the relative clause.`,
    examples: [
      {
        spanish: 'L\'homme qui parle est mon professeur. (The man who speaks is my teacher.)',
        english: 'Qui replaces the subject of "parle"',
        highlight: ['qui parle']
      },
      {
        spanish: 'J\'ai une voiture qui marche bien. (I have a car that works well.)',
        english: 'Qui replaces the subject of "marche"',
        highlight: ['qui marche']
      }
    ],
    subsections: [
      {
        title: 'QUI with People and Things',
        content: 'Qui works with both people and objects:',
        examples: [
          {
            spanish: 'People: La femme qui chante est ma sœur. (The woman who sings is my sister.)',
            english: 'Things: Le téléphone qui sonne est à moi. (The phone that\'s ringing is mine.)',
            highlight: ['qui chante', 'qui sonne']
          }
        ]
      },
      {
        title: 'QUI Never Changes Form',
        content: 'Qui stays the same regardless of gender or number:',
        examples: [
          {
            spanish: 'Masculine: L\'homme qui travaille (the man who works)',
            english: 'Feminine: La femme qui travaille (the woman who works)',
            highlight: ['qui travaille']
          },
          {
            spanish: 'Singular: L\'enfant qui joue (the child who plays)',
            english: 'Plural: Les enfants qui jouent (the children who play)',
            highlight: ['qui joue', 'qui jouent']
          }
        ]
      }
    ]
  },
  {
    title: 'QUE - Direct Object of Relative Clause',
    content: `**Que** replaces the **direct object** of the relative clause. It means "whom," "which," or "that" when referring to the direct object.

Que is used when the relative pronoun receives the action in the relative clause.`,
    examples: [
      {
        spanish: 'Le livre que je lis est intéressant. (The book that I read is interesting.)',
        english: 'Que replaces the direct object of "lis"',
        highlight: ['que je lis']
      },
      {
        spanish: 'La fille que tu connais habite ici. (The girl whom you know lives here.)',
        english: 'Que replaces the direct object of "connais"',
        highlight: ['que tu connais']
      }
    ],
    subsections: [
      {
        title: 'QUE → QU\' Before Vowels',
        content: 'Que becomes qu\' before vowels or silent h:',
        examples: [
          {
            spanish: 'L\'homme qu\'elle aime (the man whom she loves)',
            english: 'Le film qu\'il regarde (the movie that he watches)',
            highlight: ['qu\'elle aime', 'qu\'il regarde']
          }
        ]
      },
      {
        title: 'Past Participle Agreement with QUE',
        content: 'When que refers to a preceding direct object, past participles agree:',
        examples: [
          {
            spanish: 'La lettre que j\'ai écrite (the letter that I wrote)',
            english: 'Écrite agrees with feminine la lettre',
            highlight: ['que j\'ai écrite']
          },
          {
            spanish: 'Les livres que j\'ai lus (the books that I read)',
            english: 'Lus agrees with masculine plural les livres',
            highlight: ['que j\'ai lus']
          }
        ]
      }
    ]
  },
  {
    title: 'DONT - Replaces DE + Object',
    content: `**Dont** replaces phrases with **de** (of, about, from). It means "whose," "of which," "about which," or "from which."

Dont is used with verbs and expressions that require **de**.`,
    examples: [
      {
        spanish: 'L\'homme dont je parle est mon père. (The man I\'m talking about is my father.)',
        english: 'Dont replaces "de l\'homme" (parler de)',
        highlight: ['dont je parle']
      },
      {
        spanish: 'Le livre dont j\'ai besoin est ici. (The book I need is here.)',
        english: 'Dont replaces "du livre" (avoir besoin de)',
        highlight: ['dont j\'ai besoin']
      }
    ],
    subsections: [
      {
        title: 'Common Verbs with DE',
        content: 'Verbs that require de and therefore use dont:',
        conjugationTable: {
          title: 'Verbs + DE → DONT',
          conjugations: [
            { pronoun: 'parler de', form: 'to talk about', english: 'La personne dont je parle (the person I\'m talking about)' },
            { pronoun: 'avoir besoin de', form: 'to need', english: 'Ce dont j\'ai besoin (what I need)' },
            { pronoun: 'avoir peur de', form: 'to be afraid of', english: 'Ce dont j\'ai peur (what I\'m afraid of)' },
            { pronoun: 'se souvenir de', form: 'to remember', english: 'Ce dont je me souviens (what I remember)' }
          ]
        }
      },
      {
        title: 'DONT for Possession',
        content: 'Dont can express possession (whose):',
        examples: [
          {
            spanish: 'L\'homme dont la voiture est rouge (the man whose car is red)',
            english: 'Dont replaces "de l\'homme" in possession',
            highlight: ['dont la voiture']
          },
          {
            spanish: 'La fille dont les parents sont médecins (the girl whose parents are doctors)',
            english: 'Dont shows relationship/possession',
            highlight: ['dont les parents']
          }
        ]
      }
    ]
  },
  {
    title: 'OÙ - Place and Time',
    content: `**Où** means "where" or "when" and replaces expressions of **place** or **time**.

Où is used for locations and temporal expressions.`,
    examples: [
      {
        spanish: 'La ville où j\'habite est belle. (The city where I live is beautiful.)',
        english: 'Où replaces place expression',
        highlight: ['où j\'habite']
      },
      {
        spanish: 'Le jour où je suis né était un dimanche. (The day when I was born was a Sunday.)',
        english: 'Où replaces time expression',
        highlight: ['où je suis né']
      }
    ],
    subsections: [
      {
        title: 'OÙ for Places',
        content: 'Using où for locations:',
        examples: [
          {
            spanish: 'L\'endroit où nous nous sommes rencontrés (the place where we met)',
            english: 'Le restaurant où nous mangeons (the restaurant where we eat)',
            highlight: ['où nous nous sommes rencontrés', 'où nous mangeons']
          }
        ]
      },
      {
        title: 'OÙ for Time',
        content: 'Using où for time expressions:',
        examples: [
          {
            spanish: 'L\'époque où j\'étais jeune (the time when I was young)',
            english: 'Le moment où il est arrivé (the moment when he arrived)',
            highlight: ['où j\'étais jeune', 'où il est arrivé']
          }
        ]
      }
    ]
  },
  {
    title: 'Choosing the Right Relative Pronoun',
    content: `The key is identifying the grammatical function in the relative clause:`,
    subsections: [
      {
        title: 'Decision Process',
        content: 'How to choose the correct relative pronoun:',
        conjugationTable: {
          title: 'Relative Pronoun Selection',
          conjugations: [
            { pronoun: 'Subject of verb?', form: '→ QUI', english: 'L\'homme qui parle (who speaks)' },
            { pronoun: 'Direct object of verb?', form: '→ QUE', english: 'Le livre que je lis (that I read)' },
            { pronoun: 'Object of DE?', form: '→ DONT', english: 'Ce dont je parle (what I talk about)' },
            { pronoun: 'Place or time?', form: '→ OÙ', english: 'L\'endroit où je vais (where I go)' }
          ]
        }
      },
      {
        title: 'Test Method',
        content: 'Replace the relative pronoun with the antecedent to test:',
        examples: [
          {
            spanish: 'L\'homme qui parle → L\'homme parle (subject = qui)',
            english: 'Le livre que je lis → Je lis le livre (direct object = que)',
            highlight: ['qui', 'que']
          },
          {
            spanish: 'Ce dont je parle → Je parle de cela (de + object = dont)',
            english: 'L\'endroit où je vais → Je vais à cet endroit (place = où)',
            highlight: ['dont', 'où']
          }
        ]
      }
    ]
  },
  {
    title: 'Complex Relative Constructions',
    content: `Advanced uses of relative pronouns:`,
    examples: [
      {
        spanish: 'Ce qui (what - subject): Ce qui m\'intéresse, c\'est la musique. (What interests me is music.)',
        english: 'Ce que (what - object): Ce que je veux, c\'est partir. (What I want is to leave.)',
        highlight: ['Ce qui', 'Ce que']
      },
      {
        spanish: 'Ce dont (what - with de): Ce dont j\'ai peur, c\'est l\'échec. (What I\'m afraid of is failure.)',
        english: 'Ce + où: Ce n\'est pas là où je pensais. (It\'s not where I thought.)',
        highlight: ['Ce dont', 'où']
      }
    ],
    subsections: [
      {
        title: 'Prepositions + Relative Pronouns',
        content: 'Some relative pronouns work with prepositions:',
        examples: [
          {
            spanish: 'avec qui (with whom): La personne avec qui je travaille (the person with whom I work)',
            english: 'pour qui (for whom): L\'ami pour qui je fais cela (the friend for whom I do this)',
            highlight: ['avec qui', 'pour qui']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Relative Pronoun Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong function identification**: Using qui instead of que for objects
**2. Missing agreement**: Forgetting past participle agreement with que
**3. Wrong preposition**: Using qui instead of dont with de verbs
**4. Overusing que**: Using que for all relative clauses`,
    examples: [
      {
        spanish: '❌ L\'homme que parle → ✅ L\'homme qui parle',
        english: 'Wrong: subject needs qui, not que',
        highlight: ['qui parle']
      },
      {
        spanish: '❌ La lettre que j\'ai écrit → ✅ La lettre que j\'ai écrite',
        english: 'Wrong: must agree with preceding direct object',
        highlight: ['que j\'ai écrite']
      },
      {
        spanish: '❌ L\'homme que je parle → ✅ L\'homme dont je parle',
        english: 'Wrong: parler de requires dont',
        highlight: ['dont je parle']
      },
      {
        spanish: '❌ L\'endroit que je vais → ✅ L\'endroit où je vais',
        english: 'Wrong: place expressions need où',
        highlight: ['où je vais']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Complex Sentences', url: '/grammar/french/syntax/complex-sentences', difficulty: 'advanced' },
  { title: 'French Past Participle Agreement', url: '/grammar/french/verbs/past-participle-agreement', difficulty: 'advanced' },
  { title: 'French Verbs with DE', url: '/grammar/french/verbs/preposition-de', difficulty: 'intermediate' },
  { title: 'French Subordinate Clauses', url: '/grammar/french/syntax/subordinate-clauses', difficulty: 'advanced' }
];

export default function FrenchRelativePronounsPage() {
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
              topic: 'relative-pronouns',
              title: 'French Relative Pronouns (Qui, Que, Dont, Où)',
              description: 'Master French relative pronouns for complex sentences. Learn qui, que, dont, où with subordinate clauses and connections.',
              difficulty: 'advanced',
              examples: [
                'L\'homme qui parle (the man who speaks)',
                'Le livre que je lis (the book that I read)',
                'La fille dont je parle (the girl I\'m talking about)',
                'L\'endroit où je vais (the place where I go)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'pronouns',
              topic: 'relative-pronouns',
              title: 'French Relative Pronouns (Qui, Que, Dont, Où)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="pronouns"
        topic="relative-pronouns"
        title="French Relative Pronouns (Qui, Que, Dont, Où)"
        description="Master French relative pronouns for complex sentences. Learn qui, que, dont, où with subordinate clauses and connections"
        difficulty="advanced"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/french/pronouns"
        practiceUrl="/grammar/french/pronouns/relative-pronouns/practice"
        quizUrl="/grammar/french/pronouns/relative-pronouns/quiz"
        songUrl="/songs/fr?theme=grammar&topic=relative-pronouns"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
