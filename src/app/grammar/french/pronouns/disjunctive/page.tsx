import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'pronouns',
  topic: 'disjunctive',
  title: 'French Disjunctive Pronouns (Moi, Toi, Lui, Elle, Nous, Vous, Eux, Elles)',
  description: 'Master French disjunctive pronouns including emphasis, after prepositions, in comparisons, and standalone usage.',
  difficulty: 'intermediate',
  keywords: [
    'french disjunctive pronouns',
    'moi toi lui elle french',
    'nous vous eux elles french',
    'emphatic pronouns french',
    'stressed pronouns french',
    'preposition pronouns french'
  ],
  examples: [
    'Moi, je pense que... (Me, I think that...)',
    'C\'est pour toi. (It\'s for you.)',
    'Plus grand que lui. (Taller than him.)',
    'Chez nous. (At our place.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Disjunctive Pronouns',
    content: `French disjunctive pronouns (also called **stressed** or **emphatic** pronouns) are **independent pronouns** used for **emphasis**, **after prepositions**, **in comparisons**, and **standalone responses**.

**Complete set of disjunctive pronouns:**
- **moi**: me (1st person singular)
- **toi**: you (2nd person singular, informal)
- **lui**: him (3rd person masculine singular)
- **elle**: her (3rd person feminine singular)
- **nous**: us (1st person plural)
- **vous**: you (2nd person plural/formal)
- **eux**: them (3rd person masculine plural)
- **elles**: them (3rd person feminine plural)

**Key characteristics:**
- **Independent**: Can stand alone
- **Emphatic**: Add emphasis to statements
- **After prepositions**: Required after prepositions
- **Comparisons**: Used in comparative structures
- **Invariable**: Don't change form based on function

These pronouns are essential for **natural French expression** and **proper emphasis**.`,
    examples: [
      {
        spanish: 'Moi, je ne suis pas d\'accord. (Me, I don\'t agree.)',
        english: 'Emphasis on the speaker',
        highlight: ['Moi, je ne suis pas d\'accord']
      },
      {
        spanish: 'C\'est pour toi. (It\'s for you.)',
        english: 'After preposition POUR',
        highlight: ['pour toi']
      },
      {
        spanish: 'Il est plus grand que lui. (He is taller than him.)',
        english: 'In comparison with QUE',
        highlight: ['que lui']
      }
    ]
  },
  {
    title: 'Forms of Disjunctive Pronouns',
    content: `**Complete conjugation** of disjunctive pronouns:`,
    conjugationTable: {
      title: 'Disjunctive Pronouns',
      conjugations: [
        { pronoun: 'moi', form: 'me', english: 'Moi, je veux partir. (Me, I want to leave.)' },
        { pronoun: 'toi', form: 'you (informal)', english: 'Toi, tu comprends. (You, you understand.)' },
        { pronoun: 'lui', form: 'him', english: 'Lui, il est intelligent. (Him, he is intelligent.)' },
        { pronoun: 'elle', form: 'her', english: 'Elle, elle travaille. (Her, she works.)' },
        { pronoun: 'nous', form: 'us', english: 'Nous, nous partons. (Us, we\'re leaving.)' },
        { pronoun: 'vous', form: 'you (formal/plural)', english: 'Vous, vous savez. (You, you know.)' },
        { pronoun: 'eux', form: 'them (masculine)', english: 'Eux, ils sont contents. (Them, they are happy.)' },
        { pronoun: 'elles', form: 'them (feminine)', english: 'Elles, elles chantent. (Them, they sing.)' }
      ]
    },
    examples: [
      {
        spanish: 'Qui veut venir? Moi! (Who wants to come? Me!)',
        english: 'Standalone response',
        highlight: ['Moi!']
      }
    ]
  },
  {
    title: 'Emphasis and Contrast',
    content: `**Disjunctive pronouns** add **emphasis** or **contrast**:`,
    examples: [
      {
        spanish: 'Moi, je pense que c\'est vrai. (Me, I think it\'s true.)',
        english: 'Toi, tu ne comprends pas. (You, you don\'t understand.)',
        highlight: ['Moi, je pense', 'Toi, tu ne comprends pas']
      },
      {
        spanish: 'Lui, il travaille, mais elle, elle se repose. (Him, he works, but her, she rests.)',
        english: 'Contrasting two people',
        highlight: ['Lui, il travaille', 'elle, elle se repose']
      }
    ],
    subsections: [
      {
        title: 'Subject Emphasis',
        content: 'Emphasizing the subject:',
        examples: [
          {
            spanish: 'Moi, je ne suis jamais en retard. (Me, I\'m never late.)',
            english: 'Strong emphasis on personal involvement',
            highlight: ['Moi, je ne suis jamais en retard']
          }
        ]
      },
      {
        title: 'Contrast Between People',
        content: 'Showing differences:',
        examples: [
          {
            spanish: 'Nous, nous aimons le théâtre, mais eux, ils préfèrent le cinéma. (We like theater, but they prefer cinema.)',
            english: 'Contrasting preferences',
            highlight: ['Nous, nous aimons', 'eux, ils préfèrent']
          }
        ]
      }
    ]
  },
  {
    title: 'After Prepositions',
    content: `**Disjunctive pronouns** are **required** after prepositions:`,
    examples: [
      {
        spanish: 'C\'est pour toi. (It\'s for you.)',
        english: 'Je pense à lui. (I think about him.)',
        highlight: ['pour toi', 'à lui']
      },
      {
        spanish: 'Avec nous. (With us.)',
        english: 'Sans elles. (Without them.)',
        highlight: ['Avec nous', 'Sans elles']
      }
    ],
    subsections: [
      {
        title: 'Common Prepositions + Disjunctive',
        content: 'Frequent combinations:',
        examples: [
          {
            spanish: 'avec moi (with me), pour toi (for you)',
            english: 'chez lui (at his place), sans elle (without her)',
            highlight: ['avec moi', 'pour toi', 'chez lui']
          }
        ]
      },
      {
        title: 'Location Expressions',
        content: 'Place-related prepositions:',
        examples: [
          {
            spanish: 'chez nous (at our place)',
            english: 'devant eux (in front of them)',
            highlight: ['chez nous', 'devant eux']
          }
        ]
      }
    ]
  },
  {
    title: 'In Comparisons',
    content: `**Disjunctive pronouns** in **comparative structures**:`,
    examples: [
      {
        spanish: 'Il est plus grand que moi. (He is taller than me.)',
        english: 'Elle court plus vite que lui. (She runs faster than him.)',
        highlight: ['que moi', 'que lui']
      },
      {
        spanish: 'Nous sommes aussi intelligents qu\'eux. (We are as intelligent as them.)',
        english: 'Tu es moins patient qu\'elle. (You are less patient than her.)',
        highlight: ['qu\'eux', 'qu\'elle']
      }
    ],
    subsections: [
      {
        title: 'Plus/Moins...que',
        content: 'Comparative structures:',
        examples: [
          {
            spanish: 'plus âgé que toi (older than you)',
            english: 'moins riche qu\'eux (less rich than them)',
            highlight: ['que toi', 'qu\'eux']
          }
        ]
      },
      {
        title: 'Aussi...que',
        content: 'Equality comparisons:',
        examples: [
          {
            spanish: 'aussi fort que lui (as strong as him)',
            english: 'aussi belle qu\'elle (as beautiful as her)',
            highlight: ['que lui', 'qu\'elle']
          }
        ]
      }
    ]
  },
  {
    title: 'Standalone Responses',
    content: `**Disjunctive pronouns** can **stand alone** as responses:`,
    examples: [
      {
        spanish: 'Qui veut du café? Moi! (Who wants coffee? Me!)',
        english: 'Qui a fait ça? Lui! (Who did that? Him!)',
        highlight: ['Moi!', 'Lui!']
      },
      {
        spanish: 'Et toi? (And you?)',
        english: 'Pas nous! (Not us!)',
        highlight: ['Et toi?', 'Pas nous!']
      }
    ],
    subsections: [
      {
        title: 'Question Responses',
        content: 'Answering who questions:',
        examples: [
          {
            spanish: 'Qui parle français? Nous! (Who speaks French? Us!)',
            english: 'Short, emphatic responses',
            highlight: ['Nous!']
          }
        ]
      },
      {
        title: 'Negative Responses',
        content: 'Negative standalone forms:',
        examples: [
          {
            spanish: 'Pas moi! (Not me!)',
            english: 'Pas eux! (Not them!)',
            highlight: ['Pas moi!', 'Pas eux!']
          }
        ]
      }
    ]
  },
  {
    title: 'With C\'EST and CE SONT',
    content: `**Disjunctive pronouns** with **identification structures**:`,
    examples: [
      {
        spanish: 'C\'est moi. (It\'s me.)',
        english: 'C\'est lui qui a gagné. (It\'s him who won.)',
        highlight: ['C\'est moi', 'C\'est lui qui']
      },
      {
        spanish: 'Ce sont eux. (It\'s them.)',
        english: 'C\'est nous qui partons. (It\'s us who are leaving.)',
        highlight: ['Ce sont eux', 'C\'est nous qui']
      }
    ],
    subsections: [
      {
        title: 'C\'EST + Singular',
        content: 'With singular disjunctive pronouns:',
        examples: [
          {
            spanish: 'C\'est toi? (Is it you?)',
            english: 'C\'est elle! (It\'s her!)',
            highlight: ['C\'est toi', 'C\'est elle']
          }
        ]
      },
      {
        title: 'CE SONT + Plural',
        content: 'With plural disjunctive pronouns:',
        examples: [
          {
            spanish: 'Ce sont eux qui ont raison. (They are the ones who are right.)',
            english: 'Ce sont elles qui chantent. (They are the ones singing.)',
            highlight: ['Ce sont eux qui', 'Ce sont elles qui']
          }
        ]
      }
    ]
  },
  {
    title: 'In Compound Subjects',
    content: `**Disjunctive pronouns** in **compound subjects**:`,
    examples: [
      {
        spanish: 'Toi et moi, nous partons. (You and I, we\'re leaving.)',
        english: 'Lui et elle, ils se marient. (He and she, they\'re getting married.)',
        highlight: ['Toi et moi, nous partons', 'Lui et elle, ils se marient']
      },
      {
        spanish: 'Mes amis et moi, nous aimons voyager. (My friends and I, we like to travel.)',
        english: 'Mixed noun and pronoun subjects',
        highlight: ['Mes amis et moi, nous aimons voyager']
      }
    ]
  },
  {
    title: 'After QUE in Cleft Sentences',
    content: `**Disjunctive pronouns** in **cleft constructions**:`,
    examples: [
      {
        spanish: 'C\'est moi que tu cherches? (Is it me you\'re looking for?)',
        english: 'C\'est à lui que je parle. (It\'s to him that I\'m speaking.)',
        highlight: ['C\'est moi que', 'C\'est à lui que']
      },
      {
        spanish: 'C\'est avec eux que nous travaillons. (It\'s with them that we work.)',
        english: 'Emphasizing prepositional relationships',
        highlight: ['C\'est avec eux que']
      }
    ]
  },
  {
    title: 'Special Expressions',
    content: `**Fixed expressions** with disjunctive pronouns:`,
    examples: [
      {
        spanish: 'Chacun pour soi. (Each for himself.)',
        english: 'Chez soi. (At one\'s own place.)',
        highlight: ['Chacun pour soi', 'Chez soi']
      },
      {
        spanish: 'Entre nous. (Between us.)',
        english: 'Malgré lui. (Despite himself.)',
        highlight: ['Entre nous', 'Malgré lui']
      }
    ],
    subsections: [
      {
        title: 'SOI - Indefinite Disjunctive',
        content: 'Used with indefinite subjects:',
        examples: [
          {
            spanish: 'Il faut penser à soi. (One must think of oneself.)',
            english: 'Chacun chez soi. (Everyone at their own place.)',
            highlight: ['penser à soi', 'chez soi']
          }
        ]
      }
    ]
  },
  {
    title: 'Disjunctive vs Other Pronouns',
    content: `**When to use** disjunctive vs other pronoun types:`,
    conjugationTable: {
      title: 'Pronoun Type Comparison',
      conjugations: [
        { pronoun: 'Subject pronouns', form: 'je, tu, il, elle...', english: 'Je parle. (I speak.)' },
        { pronoun: 'Object pronouns', form: 'me, te, le, la...', english: 'Il me voit. (He sees me.)' },
        { pronoun: 'Disjunctive', form: 'moi, toi, lui, elle...', english: 'C\'est pour moi. (It\'s for me.)' }
      ]
    },
    examples: [
      {
        spanish: 'Use disjunctive: after prepositions, for emphasis, standalone',
        english: 'Use object pronouns: direct/indirect objects',
        highlight: ['disjunctive', 'object pronouns']
      }
    ]
  },
  {
    title: 'Common Mistakes with Disjunctive Pronouns',
    content: `Here are frequent errors with disjunctive pronouns:

**1. Wrong pronoun type**: Using subject/object pronouns instead of disjunctive
**2. Missing emphasis**: Not using disjunctive for emphasis
**3. Preposition errors**: Using wrong pronoun type after prepositions
**4. Gender/number errors**: Wrong form for masculine/feminine plural`,
    examples: [
      {
        spanish: '❌ C\'est pour je → ✅ C\'est pour moi',
        english: 'Wrong: must use disjunctive after prepositions',
        highlight: ['C\'est pour moi']
      },
      {
        spanish: '❌ Je pense à il → ✅ Je pense à lui',
        english: 'Wrong: disjunctive required after preposition',
        highlight: ['Je pense à lui']
      },
      {
        spanish: '❌ Plus grand que je → ✅ Plus grand que moi',
        english: 'Wrong: disjunctive in comparisons',
        highlight: ['Plus grand que moi']
      },
      {
        spanish: '❌ Ce sont eux qui travaille → ✅ Ce sont eux qui travaillent',
        english: 'Wrong: verb must agree with plural subject',
        highlight: ['Ce sont eux qui travaillent']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Subject Pronouns', url: '/grammar/french/pronouns/subject-pronouns', difficulty: 'beginner' },
  { title: 'French Direct Object Pronouns', url: '/grammar/french/pronouns/direct-object', difficulty: 'intermediate' },
  { title: 'French Comparatives', url: '/grammar/french/adjectives/comparative', difficulty: 'intermediate' },
  { title: 'French Prepositions', url: '/grammar/french/prepositions/common-prepositions', difficulty: 'beginner' }
];

export default function FrenchDisjunctivePronounsPage() {
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
              topic: 'disjunctive',
              title: 'French Disjunctive Pronouns (Moi, Toi, Lui, Elle, Nous, Vous, Eux, Elles)',
              description: 'Master French disjunctive pronouns including emphasis, after prepositions, in comparisons, and standalone usage.',
              difficulty: 'intermediate',
              examples: [
                'Moi, je pense que... (Me, I think that...)',
                'C\'est pour toi. (It\'s for you.)',
                'Plus grand que lui. (Taller than him.)',
                'Chez nous. (At our place.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'pronouns',
              topic: 'disjunctive',
              title: 'French Disjunctive Pronouns (Moi, Toi, Lui, Elle, Nous, Vous, Eux, Elles)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="pronouns"
        topic="disjunctive"
        title="French Disjunctive Pronouns (Moi, Toi, Lui, Elle, Nous, Vous, Eux, Elles)"
        description="Master French disjunctive pronouns including emphasis, after prepositions, in comparisons, and standalone usage"
        difficulty="intermediate"
        estimatedTime={14}
        sections={sections}
        backUrl="/grammar/french/pronouns"
        practiceUrl="/grammar/french/pronouns/disjunctive/practice"
        quizUrl="/grammar/french/pronouns/disjunctive/quiz"
        songUrl="/songs/fr?theme=grammar&topic=disjunctive"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
