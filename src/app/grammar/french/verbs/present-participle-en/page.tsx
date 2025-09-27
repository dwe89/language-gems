import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'present-participle-en',
  title: 'French Present Participle with EN (En + -ant Forms)',
  description: 'Master French present participle with EN including en + -ant constructions, simultaneous actions, and gerund usage.',
  difficulty: 'advanced',
  keywords: [
    'french present participle en',
    'en plus ant french',
    'french gerund',
    'simultaneous actions french',
    'en marchant french',
    'present participle constructions'
  ],
  examples: [
    'En marchant, je réfléchis. (While walking, I think.)',
    'En étudiant, elle écoute de la musique. (While studying, she listens to music.)',
    'Il a appris en pratiquant. (He learned by practicing.)',
    'En arrivant, nous avons vu... (Upon arriving, we saw...)'
  ]
});

const sections = [
  {
    title: 'Understanding French Present Participle with EN',
    content: `The French construction **EN + present participle** expresses **simultaneous actions**, **manner**, or **means**. It's equivalent to English "while/by/upon + -ing".

**Formation: EN + present participle (-ant)**
- **EN + verb stem + -ant**
- **Example**: marcher → en marchant (while walking)

**Main uses:**
- **Simultaneous actions**: En mangeant, il regarde la télé. (While eating, he watches TV.)
- **Manner/means**: Il a réussi en travaillant dur. (He succeeded by working hard.)
- **Time relationship**: En arrivant, j'ai vu... (Upon arriving, I saw...)
- **Cause**: En tombant, il s'est blessé. (By falling, he hurt himself.)

This advanced structure adds sophistication to French expression and shows the relationship between actions.`,
    examples: [
      {
        spanish: 'En lisant ce livre, j\'ai appris beaucoup. (While reading this book, I learned a lot.)',
        english: 'Simultaneous action - two things happening at once',
        highlight: ['En lisant ce livre']
      },
      {
        spanish: 'Il gagne sa vie en enseignant. (He earns his living by teaching.)',
        english: 'Means/method - how something is accomplished',
        highlight: ['en enseignant']
      },
      {
        spanish: 'En sortant, fermez la porte. (Upon leaving, close the door.)',
        english: 'Time relationship - when one action occurs',
        highlight: ['En sortant']
      }
    ]
  },
  {
    title: 'Formation of Present Participle',
    content: `French present participles are formed by adding **-ant** to the verb stem:`,
    conjugationTable: {
      title: 'Present Participle Formation',
      conjugations: [
        { pronoun: '-er verbs', form: 'stem + -ant', english: 'parler → parlant (speaking)' },
        { pronoun: '-ir verbs', form: 'stem + -ant', english: 'finir → finissant (finishing)' },
        { pronoun: '-re verbs', form: 'stem + -ant', english: 'vendre → vendant (selling)' },
        { pronoun: 'avoir', form: 'ayant', english: 'having' },
        { pronoun: 'être', form: 'étant', english: 'being' },
        { pronoun: 'savoir', form: 'sachant', english: 'knowing' }
      ]
    },
    subsections: [
      {
        title: 'Regular Formation',
        content: 'Most verbs follow regular patterns:',
        examples: [
          {
            spanish: 'manger → mangeant (eating)',
            english: 'choisir → choisissant (choosing)',
            highlight: ['mangeant', 'choisissant']
          },
          {
            spanish: 'attendre → attendant (waiting)',
            english: 'prendre → prenant (taking)',
            highlight: ['attendant', 'prenant']
          }
        ]
      },
      {
        title: 'Irregular Present Participles',
        content: 'Some verbs have irregular forms:',
        examples: [
          {
            spanish: 'avoir → ayant, être → étant',
            english: 'savoir → sachant, voir → voyant',
            highlight: ['ayant', 'sachant']
          }
        ]
      }
    ]
  },
  {
    title: 'EN + Present Participle: Simultaneous Actions',
    content: `**EN + present participle** expresses actions happening **at the same time**:`,
    examples: [
      {
        spanish: 'En conduisant, il téléphone. (While driving, he talks on the phone.)',
        english: 'Elle chante en travaillant. (She sings while working.)',
        highlight: ['En conduisant', 'en travaillant']
      },
      {
        spanish: 'En regardant la télé, nous mangeons. (While watching TV, we eat.)',
        english: 'Il réfléchit en marchant. (He thinks while walking.)',
        highlight: ['En regardant la télé', 'en marchant']
      }
    ],
    subsections: [
      {
        title: 'Same Subject Required',
        content: 'Both actions must have the same subject:',
        examples: [
          {
            spanish: '✅ En étudiant, je comprends mieux. (While studying, I understand better.)',
            english: '❌ En étudiant, le livre est difficile. (Wrong - different subjects)',
            highlight: ['En étudiant, je comprends']
          }
        ]
      }
    ]
  },
  {
    title: 'EN + Present Participle: Manner and Means',
    content: `Expressing **how** or **by what means** something is done:`,
    examples: [
      {
        spanish: 'Il a appris le français en vivant en France. (He learned French by living in France.)',
        english: 'Elle gagne de l\'argent en vendant des fleurs. (She earns money by selling flowers.)',
        highlight: ['en vivant en France', 'en vendant des fleurs']
      },
      {
        spanish: 'On peut réussir en travaillant dur. (One can succeed by working hard.)',
        english: 'Il s\'est blessé en tombant. (He hurt himself by falling.)',
        highlight: ['en travaillant dur', 'en tombant']
      }
    ],
    subsections: [
      {
        title: 'Method and Process',
        content: 'Describing the method used:',
        examples: [
          {
            spanish: 'J\'ai trouvé la solution en réfléchissant. (I found the solution by thinking.)',
            english: 'Elle a maigri en faisant du sport. (She lost weight by doing sports.)',
            highlight: ['en réfléchissant', 'en faisant du sport']
          }
        ]
      }
    ]
  },
  {
    title: 'EN + Present Participle: Time Relationships',
    content: `Expressing **when** something happens, often translated as "upon" or "when":`,
    examples: [
      {
        spanish: 'En arrivant à la gare, j\'ai vu Paul. (Upon arriving at the station, I saw Paul.)',
        english: 'En ouvrant la porte, elle a trouvé une lettre. (When opening the door, she found a letter.)',
        highlight: ['En arrivant à la gare', 'En ouvrant la porte']
      },
      {
        spanish: 'En rentrant chez moi, j\'ai acheté du pain. (When going home, I bought bread.)',
        english: 'En finissant ses devoirs, il est sorti. (Upon finishing his homework, he went out.)',
        highlight: ['En rentrant chez moi', 'En finissant ses devoirs']
      }
    ],
    subsections: [
      {
        title: 'Immediate Sequence',
        content: 'Actions happening in immediate sequence:',
        examples: [
          {
            spanish: 'En voyant l\'accident, il a appelé la police. (Upon seeing the accident, he called the police.)',
            english: 'En entendant la nouvelle, elle a pleuré. (Upon hearing the news, she cried.)',
            highlight: ['En voyant l\'accident', 'En entendant la nouvelle']
          }
        ]
      }
    ]
  },
  {
    title: 'EN + Present Participle: Cause and Effect',
    content: `Expressing **cause** or **reason** for something:`,
    examples: [
      {
        spanish: 'En courant trop vite, il est tombé. (By running too fast, he fell.)',
        english: 'En ne faisant pas attention, elle a fait une erreur. (By not paying attention, she made a mistake.)',
        highlight: ['En courant trop vite', 'En ne faisant pas attention']
      },
      {
        spanish: 'En buvant trop de café, j\'ai mal à la tête. (From drinking too much coffee, I have a headache.)',
        english: 'En parlant fort, il a réveillé le bébé. (By speaking loudly, he woke up the baby.)',
        highlight: ['En buvant trop de café', 'En parlant fort']
      }
    ]
  },
  {
    title: 'Negation with EN + Present Participle',
    content: `To negate, place **NE PAS** before the present participle:`,
    examples: [
      {
        spanish: 'En ne travaillant pas, il a échoué. (By not working, he failed.)',
        english: 'En ne faisant pas attention, on fait des erreurs. (By not paying attention, one makes mistakes.)',
        highlight: ['En ne travaillant pas', 'En ne faisant pas attention']
      },
      {
        spanish: 'En n\'étudiant jamais, elle ne réussira pas. (By never studying, she won\'t succeed.)',
        english: 'En ne disant rien, il a évité les problèmes. (By saying nothing, he avoided problems.)',
        highlight: ['En n\'étudiant jamais', 'En ne disant rien']
      }
    ]
  },
  {
    title: 'Reflexive Verbs with EN',
    content: `Reflexive verbs maintain their reflexive pronouns:`,
    examples: [
      {
        spanish: 'En se levant tôt, elle a plus de temps. (By getting up early, she has more time.)',
        english: 'En se dépêchant, nous arriverons à l\'heure. (By hurrying, we\'ll arrive on time.)',
        highlight: ['En se levant tôt', 'En se dépêchant']
      },
      {
        spanish: 'En se promenant, ils ont découvert un café. (While walking, they discovered a café.)',
        english: 'En s\'entraînant, il devient plus fort. (By training, he becomes stronger.)',
        highlight: ['En se promenant', 'En s\'entraînant']
      }
    ]
  },
  {
    title: 'Common Expressions with EN + Present Participle',
    content: `Frequently used phrases and expressions:`,
    examples: [
      {
        spanish: 'En attendant (while waiting/in the meantime)',
        english: 'En passant (by the way/while passing)',
        highlight: ['En attendant', 'En passant']
      },
      {
        spanish: 'En général (generally speaking)',
        english: 'En fait (actually/in fact)',
        highlight: ['En général', 'En fait']
      }
    ],
    subsections: [
      {
        title: 'Fixed Expressions',
        content: 'Common idiomatic uses:',
        examples: [
          {
            spanish: 'En attendant, nous pouvons prendre un café. (In the meantime, we can have coffee.)',
            english: 'En passant, as-tu vu Marie? (By the way, did you see Marie?)',
            highlight: ['En attendant', 'En passant']
          }
        ]
      }
    ]
  },
  {
    title: 'EN + Present Participle vs Other Constructions',
    content: `Comparing with similar structures:`,
    conjugationTable: {
      title: 'Comparison of Constructions',
      conjugations: [
        { pronoun: 'EN + present participle', form: 'en marchant', english: 'while/by walking' },
        { pronoun: 'PENDANT QUE + verb', form: 'pendant que je marche', english: 'while I walk' },
        { pronoun: 'TOUT EN + present participle', form: 'tout en marchant', english: 'while walking (emphasis)' },
        { pronoun: 'Simple present participle', form: 'marchant', english: 'walking (literary)' }
      ]
    },
    subsections: [
      {
        title: 'TOUT EN + Present Participle',
        content: 'Emphasizing simultaneous actions:',
        examples: [
          {
            spanish: 'Tout en travaillant, elle écoute la radio. (While working, she listens to the radio.)',
            english: 'More emphasis than simple "en travaillant"',
            highlight: ['Tout en travaillant']
          }
        ]
      }
    ]
  },
  {
    title: 'Style and Register',
    content: `EN + present participle usage varies by context:`,
    subsections: [
      {
        title: 'Formal Writing',
        content: 'Common in academic and literary texts:',
        examples: [
          {
            spanish: 'En analysant les données, nous constatons que... (By analyzing the data, we observe that...)',
            english: 'En étudiant ce phénomène, les chercheurs ont découvert... (By studying this phenomenon, researchers discovered...)',
            highlight: ['En analysant les données', 'En étudiant ce phénomène']
          }
        ]
      },
      {
        title: 'Spoken French',
        content: 'Also used in everyday conversation:',
        examples: [
          {
            spanish: 'En rentrant, j\'ai vu ton frère. (When coming home, I saw your brother.)',
            english: 'En faisant les courses, j\'ai rencontré Paul. (While shopping, I met Paul.)',
            highlight: ['En rentrant', 'En faisant les courses']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes with EN + Present Participle',
    content: `Here are frequent errors students make:

**1. Different subjects**: Using different subjects for main and participle clauses
**2. Wrong participle formation**: Incorrect -ant forms
**3. Missing EN**: Using present participle alone instead of EN + participle
**4. Overuse**: Using when simpler constructions would be better`,
    examples: [
      {
        spanish: '❌ En étudiant, le livre est difficile → ✅ En étudiant, je trouve le livre difficile',
        english: 'Wrong: different subjects (book vs I)',
        highlight: ['En étudiant, je trouve le livre difficile']
      },
      {
        spanish: '❌ en allant → ✅ en allant',
        english: 'Wrong: incorrect present participle formation',
        highlight: ['en allant']
      },
      {
        spanish: '❌ Marchant dans la rue → ✅ En marchant dans la rue',
        english: 'Wrong: missing EN (literary style vs standard)',
        highlight: ['En marchant dans la rue']
      },
      {
        spanish: '❌ En étant fatigué, en allant au lit → ✅ Comme j\'étais fatigué, je suis allé au lit',
        english: 'Wrong: overuse when simpler construction is clearer',
        highlight: ['Comme j\'étais fatigué, je suis allé au lit']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Present Participle', url: '/grammar/french/verbs/present-participle', difficulty: 'advanced' },
  { title: 'French Simultaneous Actions', url: '/grammar/french/syntax/simultaneous-actions', difficulty: 'advanced' },
  { title: 'French Time Expressions', url: '/grammar/french/expressions/time', difficulty: 'intermediate' },
  { title: 'French Complex Sentences', url: '/grammar/french/syntax/complex-sentences', difficulty: 'advanced' }
];

export default function FrenchPresentParticipleEnPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'verbs',
              topic: 'present-participle-en',
              title: 'French Present Participle with EN (En + -ant Forms)',
              description: 'Master French present participle with EN including en + -ant constructions, simultaneous actions, and gerund usage.',
              difficulty: 'advanced',
              examples: [
                'En marchant, je réfléchis. (While walking, I think.)',
                'En étudiant, elle écoute de la musique. (While studying, she listens to music.)',
                'Il a appris en pratiquant. (He learned by practicing.)',
                'En arrivant, nous avons vu... (Upon arriving, we saw...)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'present-participle-en',
              title: 'French Present Participle with EN (En + -ant Forms)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="present-participle-en"
        title="French Present Participle with EN (En + -ant Forms)"
        description="Master French present participle with EN including en + -ant constructions, simultaneous actions, and gerund usage"
        difficulty="advanced"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/present-participle-en/practice"
        quizUrl="/grammar/french/verbs/present-participle-en/quiz"
        songUrl="/songs/fr?theme=grammar&topic=present-participle-en"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
