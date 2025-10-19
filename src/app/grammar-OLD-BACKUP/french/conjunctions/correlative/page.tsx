import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'conjunctions',
  topic: 'correlative',
  title: 'French Correlative Conjunctions (Soit...soit, Non seulement...mais aussi)',
  description: 'Master French correlative conjunctions including soit...soit, non seulement...mais aussi, tantôt...tantôt. Learn paired conjunctions.',
  difficulty: 'advanced',
  keywords: [
    'french correlative conjunctions',
    'soit soit french',
    'non seulement mais aussi',
    'tantôt tantôt french',
    'paired conjunctions french',
    'advanced french grammar'
  ],
  examples: [
    'Soit tu viens, soit tu restes. (Either you come, or you stay.)',
    'Non seulement il chante, mais aussi il danse. (Not only does he sing, but he also dances.)',
    'Tantôt il rit, tantôt il pleure. (Sometimes he laughs, sometimes he cries.)',
    'Ni lui ni moi ne savons. (Neither he nor I know.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Correlative Conjunctions',
    content: `French **correlative conjunctions** are **paired conjunctions** that work together to connect words, phrases, or clauses. They create balanced, parallel structures and express relationships like:

**Types of correlative conjunctions:**
- **Alternative choice**: soit...soit (either...or)
- **Addition/emphasis**: non seulement...mais aussi (not only...but also)
- **Alternation**: tantôt...tantôt (sometimes...sometimes)
- **Negative correlation**: ni...ni (neither...nor)
- **Comparison**: plus...plus (the more...the more)

These sophisticated structures add elegance and precision to French expression, particularly in formal writing and speech. They require careful attention to **word order**, **agreement**, and **parallel structure**.`,
    examples: [
      {
        spanish: 'Soit nous partons maintenant, soit nous restons ici. (Either we leave now, or we stay here.)',
        english: 'Alternative choice - two mutually exclusive options',
        highlight: ['Soit nous partons', 'soit nous restons']
      },
      {
        spanish: 'Non seulement elle parle français, mais elle l\'enseigne aussi. (Not only does she speak French, but she also teaches it.)',
        english: 'Addition with emphasis - building on first statement',
        highlight: ['Non seulement elle parle', 'mais elle l\'enseigne aussi']
      },
      {
        spanish: 'Plus je l\'étudie, plus je l\'aime. (The more I study it, the more I like it.)',
        english: 'Proportional relationship - increasing correlation',
        highlight: ['Plus je l\'étudie', 'plus je l\'aime']
      }
    ]
  },
  {
    title: 'SOIT...SOIT - Either...Or',
    content: `**SOIT...SOIT** expresses **alternative choice** between two or more options:`,
    examples: [
      {
        spanish: 'Soit tu acceptes, soit tu refuses. (Either you accept, or you refuse.)',
        english: 'Soit nous prenons le train, soit nous prenons la voiture. (Either we take the train, or we take the car.)',
        highlight: ['Soit tu acceptes, soit tu refuses', 'Soit nous prenons le train, soit nous prenons la voiture']
      },
      {
        spanish: 'Il faut soit partir tôt, soit arriver en retard. (We must either leave early, or arrive late.)',
        english: 'Soit elle vient, soit elle ne vient pas. (Either she comes, or she doesn\'t come.)',
        highlight: ['soit partir tôt, soit arriver en retard', 'Soit elle vient, soit elle ne vient pas']
      }
    ],
    subsections: [
      {
        title: 'Multiple Options',
        content: 'SOIT can connect more than two options:',
        examples: [
          {
            spanish: 'Soit lundi, soit mardi, soit mercredi. (Either Monday, or Tuesday, or Wednesday.)',
            english: 'Soit par train, soit par avion, soit par voiture. (Either by train, or by plane, or by car.)',
            highlight: ['Soit lundi, soit mardi, soit mercredi', 'Soit par train, soit par avion, soit par voiture']
          }
        ]
      },
      {
        title: 'Formal Register',
        content: 'SOIT...SOIT is more formal than OU...OU:',
        examples: [
          {
            spanish: 'Formal: Soit vous acceptez, soit vous démissionnez.',
            english: 'Informal: Ou vous acceptez, ou vous démissionnez.',
            highlight: ['Soit vous acceptez', 'Ou vous acceptez']
          }
        ]
      }
    ]
  },
  {
    title: 'NON SEULEMENT...MAIS AUSSI - Not Only...But Also',
    content: `**NON SEULEMENT...MAIS AUSSI** adds emphasis by building on the first statement:`,
    examples: [
      {
        spanish: 'Non seulement il parle français, mais il le parle aussi couramment. (Not only does he speak French, but he also speaks it fluently.)',
        english: 'Non seulement elle travaille, mais elle étudie aussi. (Not only does she work, but she also studies.)',
        highlight: ['Non seulement il parle français', 'Non seulement elle travaille']
      }
    ],
    subsections: [
      {
        title: 'Word Order with Inversion',
        content: 'NON SEULEMENT at the beginning requires inversion:',
        examples: [
          {
            spanish: 'Non seulement parle-t-il français, mais il l\'enseigne aussi. (Not only does he speak French, but he also teaches it.)',
            english: 'Non seulement a-t-elle réussi, mais elle a aussi gagné un prix. (Not only did she succeed, but she also won a prize.)',
            highlight: ['Non seulement parle-t-il', 'Non seulement a-t-elle réussi']
          }
        ]
      },
      {
        title: 'Alternative Forms',
        content: 'Variations of the structure:',
        examples: [
          {
            spanish: 'Non seulement...mais encore: Non seulement il chante, mais encore il danse.',
            english: 'Non seulement...mais également: Non seulement elle lit, mais également elle écrit.',
            highlight: ['mais encore', 'mais également']
          }
        ]
      }
    ]
  },
  {
    title: 'TANTÔT...TANTÔT - Sometimes...Sometimes',
    content: `**TANTÔT...TANTÔT** expresses **alternation** or **variation** between two states or actions:`,
    examples: [
      {
        spanish: 'Tantôt il fait beau, tantôt il pleut. (Sometimes it\'s nice, sometimes it rains.)',
        english: 'Elle est tantôt joyeuse, tantôt triste. (She is sometimes happy, sometimes sad.)',
        highlight: ['Tantôt il fait beau, tantôt il pleut', 'tantôt joyeuse, tantôt triste']
      },
      {
        spanish: 'Il travaille tantôt à Paris, tantôt à Lyon. (He works sometimes in Paris, sometimes in Lyon.)',
        english: 'Tantôt nous prenons le bus, tantôt nous marchons. (Sometimes we take the bus, sometimes we walk.)',
        highlight: ['tantôt à Paris, tantôt à Lyon', 'Tantôt nous prenons le bus, tantôt nous marchons']
      }
    ],
    subsections: [
      {
        title: 'Temporal Alternation',
        content: 'Expressing changing patterns over time:',
        examples: [
          {
            spanish: 'Le temps est tantôt ensoleillé, tantôt nuageux. (The weather is sometimes sunny, sometimes cloudy.)',
            english: 'Il se sent tantôt optimiste, tantôt pessimiste. (He feels sometimes optimistic, sometimes pessimistic.)',
            highlight: ['tantôt ensoleillé, tantôt nuageux', 'tantôt optimiste, tantôt pessimiste']
          }
        ]
      }
    ]
  },
  {
    title: 'NI...NI - Neither...Nor',
    content: `**NI...NI** expresses **double negation** - neither one thing nor another:`,
    examples: [
      {
        spanish: 'Il ne parle ni français ni anglais. (He speaks neither French nor English.)',
        english: 'Elle n\'aime ni le café ni le thé. (She likes neither coffee nor tea.)',
        highlight: ['ne parle ni français ni anglais', 'n\'aime ni le café ni le thé']
      },
      {
        spanish: 'Ni lui ni moi ne savons la réponse. (Neither he nor I know the answer.)',
        english: 'Je ne veux ni sortir ni rester. (I want neither to go out nor to stay.)',
        highlight: ['Ni lui ni moi ne savons', 'ne veux ni sortir ni rester']
      }
    ],
    subsections: [
      {
        title: 'Agreement with NI...NI',
        content: 'Verb agreement rules:',
        examples: [
          {
            spanish: 'Ni Pierre ni Marie ne vient. (Neither Pierre nor Marie is coming.) - Singular',
            english: 'Ni Pierre ni Marie ne viennent. (Neither Pierre nor Marie are coming.) - Plural',
            highlight: ['ne vient', 'ne viennent']
          }
        ]
      },
      {
        title: 'Multiple Elements',
        content: 'More than two negative elements:',
        examples: [
          {
            spanish: 'Il ne mange ni viande, ni poisson, ni œufs. (He eats neither meat, nor fish, nor eggs.)',
            english: 'Elle ne parle ni français, ni anglais, ni allemand. (She speaks neither French, nor English, nor German.)',
            highlight: ['ni viande, ni poisson, ni œufs', 'ni français, ni anglais, ni allemand']
          }
        ]
      }
    ]
  },
  {
    title: 'PLUS...PLUS / MOINS...MOINS - The More...The More',
    content: `These express **proportional relationships** - as one thing increases/decreases, so does another:`,
    conjugationTable: {
      title: 'Proportional Correlative Conjunctions',
      conjugations: [
        { pronoun: 'plus...plus', form: 'the more...the more', english: 'Plus je travaille, plus je réussis.' },
        { pronoun: 'moins...moins', form: 'the less...the less', english: 'Moins il dort, moins il est en forme.' },
        { pronoun: 'plus...moins', form: 'the more...the less', english: 'Plus il mange, moins il a faim.' },
        { pronoun: 'moins...plus', form: 'the less...the more', english: 'Moins je comprends, plus je m\'énerve.' }
      ]
    },
    subsections: [
      {
        title: 'Increasing Correlation',
        content: 'Both elements increase together:',
        examples: [
          {
            spanish: 'Plus on vieillit, plus on devient sage. (The older one gets, the wiser one becomes.)',
            english: 'Plus il étudie, plus il comprend. (The more he studies, the more he understands.)',
            highlight: ['Plus on vieillit, plus on devient sage', 'Plus il étudie, plus il comprend']
          }
        ]
      },
      {
        title: 'Inverse Correlation',
        content: 'One increases as the other decreases:',
        examples: [
          {
            spanish: 'Plus il fait froid, moins je sors. (The colder it gets, the less I go out.)',
            english: 'Moins elle mange, plus elle maigrit. (The less she eats, the more she loses weight.)',
            highlight: ['Plus il fait froid, moins je sors', 'Moins elle mange, plus elle maigrit']
          }
        ]
      }
    ]
  },
  {
    title: 'D\'UNE PART...D\'AUTRE PART - On One Hand...On The Other Hand',
    content: `**D'UNE PART...D'AUTRE PART** presents **contrasting viewpoints** or **balanced arguments**:`,
    examples: [
      {
        spanish: 'D\'une part, c\'est cher, d\'autre part, c\'est de bonne qualité. (On one hand, it\'s expensive, on the other hand, it\'s good quality.)',
        english: 'D\'une part, je veux voyager, d\'autre part, je dois travailler. (On one hand, I want to travel, on the other hand, I have to work.)',
        highlight: ['D\'une part, c\'est cher, d\'autre part, c\'est de bonne qualité', 'D\'une part, je veux voyager, d\'autre part, je dois travailler']
      }
    ],
    subsections: [
      {
        title: 'Formal Argumentation',
        content: 'Used in formal writing and debate:',
        examples: [
          {
            spanish: 'D\'une part, cette solution est économique, d\'autre part, elle est écologique.',
            english: 'D\'une part, les avantages sont nombreux, d\'autre part, les risques existent.',
            highlight: ['D\'une part, cette solution est économique', 'D\'une part, les avantages sont nombreux']
          }
        ]
      }
    ]
  },
  {
    title: 'AUTANT...AUTANT - As Much...As Much',
    content: `**AUTANT...AUTANT** expresses **equal degree** or **parallel intensity**:`,
    examples: [
      {
        spanish: 'Autant il est intelligent, autant il est paresseux. (As much as he is intelligent, he is lazy.)',
        english: 'Autant j\'aime l\'été, autant je déteste l\'hiver. (As much as I love summer, I hate winter.)',
        highlight: ['Autant il est intelligent, autant il est paresseux', 'Autant j\'aime l\'été, autant je déteste l\'hiver']
      }
    ],
    subsections: [
      {
        title: 'Contrasting Qualities',
        content: 'Highlighting opposing characteristics:',
        examples: [
          {
            spanish: 'Autant elle est généreuse, autant il est avare. (As generous as she is, he is stingy.)',
            english: 'Autant ce livre est intéressant, autant celui-ci est ennuyeux. (As interesting as this book is, this one is boring.)',
            highlight: ['Autant elle est généreuse, autant il est avare', 'Autant ce livre est intéressant, autant celui-ci est ennuyeux']
          }
        ]
      }
    ]
  },
  {
    title: 'SI...QUE - So...That (Correlative Usage)',
    content: `**SI...QUE** can function as a correlative conjunction expressing **degree and result**:`,
    examples: [
      {
        spanish: 'Il est si fatigué qu\'il ne peut pas travailler. (He is so tired that he can\'t work.)',
        english: 'Elle parle si vite que je ne comprends pas. (She speaks so fast that I don\'t understand.)',
        highlight: ['si fatigué qu\'il ne peut pas', 'si vite que je ne comprends pas']
      }
    ],
    subsections: [
      {
        title: 'Intensity and Consequence',
        content: 'Showing cause-effect relationships:',
        examples: [
          {
            spanish: 'Il fait si froid que les rivières gèlent. (It\'s so cold that rivers freeze.)',
            english: 'Elle est si belle que tout le monde la regarde. (She\'s so beautiful that everyone looks at her.)',
            highlight: ['si froid que les rivières gèlent', 'si belle que tout le monde la regarde']
          }
        ]
      }
    ]
  },
  {
    title: 'Stylistic Considerations',
    content: `Correlative conjunctions vary by register and style:`,
    subsections: [
      {
        title: 'Formal vs Informal',
        content: 'Register differences:',
        examples: [
          {
            spanish: 'Formal: Non seulement...mais aussi',
            english: 'Informal: Pas seulement...mais aussi',
            highlight: ['Non seulement', 'Pas seulement']
          },
          {
            spanish: 'Formal: Soit...soit',
            english: 'Informal: Ou...ou',
            highlight: ['Soit...soit', 'Ou...ou']
          }
        ]
      },
      {
        title: 'Literary Usage',
        content: 'Enhanced literary expressions:',
        examples: [
          {
            spanish: 'Tantôt...tantôt (literary alternation)',
            english: 'Autant...autant (literary balance)',
            highlight: ['Tantôt...tantôt', 'Autant...autant']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes with Correlative Conjunctions',
    content: `Here are frequent errors students make:

**1. Incomplete pairs**: Using only one part of the correlative conjunction
**2. Wrong word order**: Incorrect placement, especially with inversion
**3. Agreement errors**: Wrong verb agreement with ni...ni
**4. Missing negation**: Forgetting "ne" with ni...ni`,
    examples: [
      {
        spanish: '❌ Soit tu viens ou tu restes → ✅ Soit tu viens, soit tu restes',
        english: 'Wrong: mixing correlative and simple conjunctions',
        highlight: ['Soit tu viens, soit tu restes']
      },
      {
        spanish: '❌ Non seulement il parle français → ✅ Non seulement il parle français, mais il l\'enseigne aussi',
        english: 'Wrong: incomplete correlative pair',
        highlight: ['Non seulement il parle français, mais il l\'enseigne aussi']
      },
      {
        spanish: '❌ Il parle ni français ni anglais → ✅ Il ne parle ni français ni anglais',
        english: 'Wrong: missing negation "ne" with ni...ni',
        highlight: ['Il ne parle ni français ni anglais']
      },
      {
        spanish: '❌ Plus je travaille, moins je réussis pas → ✅ Plus je travaille, moins je réussis',
        english: 'Wrong: double negation with correlative',
        highlight: ['Plus je travaille, moins je réussis']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Coordinating Conjunctions', url: '/grammar/french/conjunctions/coordinating', difficulty: 'intermediate' },
  { title: 'French Subordinating Conjunctions', url: '/grammar/french/conjunctions/subordinating', difficulty: 'advanced' },
  { title: 'French Negation', url: '/grammar/french/syntax/negation', difficulty: 'intermediate' },
  { title: 'French Word Order', url: '/grammar/french/syntax/word-order', difficulty: 'advanced' }
];

export default function FrenchCorrelativeConjunctionsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'conjunctions',
              topic: 'correlative',
              title: 'French Correlative Conjunctions (Soit...soit, Non seulement...mais aussi)',
              description: 'Master French correlative conjunctions including soit...soit, non seulement...mais aussi, tantôt...tantôt. Learn paired conjunctions.',
              difficulty: 'advanced',
              examples: [
                'Soit tu viens, soit tu restes. (Either you come, or you stay.)',
                'Non seulement il chante, mais aussi il danse. (Not only does he sing, but he also dances.)',
                'Tantôt il rit, tantôt il pleure. (Sometimes he laughs, sometimes he cries.)',
                'Ni lui ni moi ne savons. (Neither he nor I know.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'conjunctions',
              topic: 'correlative',
              title: 'French Correlative Conjunctions (Soit...soit, Non seulement...mais aussi)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="conjunctions"
        topic="correlative"
        title="French Correlative Conjunctions (Soit...soit, Non seulement...mais aussi)"
        description="Master French correlative conjunctions including soit...soit, non seulement...mais aussi, tantôt...tantôt. Learn paired conjunctions"
        difficulty="advanced"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/french/conjunctions"
        practiceUrl="/grammar/french/conjunctions/correlative/practice"
        quizUrl="/grammar/french/conjunctions/correlative/quiz"
        songUrl="/songs/fr?theme=grammar&topic=correlative-conjunctions"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
