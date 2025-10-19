import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'verbs-infinitive',
  title: 'French Verbs + Infinitive (Vouloir, Pouvoir, Devoir + Infinitive)',
  description: 'Master French verb + infinitive constructions including modal verbs, prepositions with infinitives, and infinitive complements.',
  difficulty: 'intermediate',
  keywords: [
    'french verbs infinitive',
    'french modal verbs',
    'vouloir pouvoir devoir',
    'french infinitive constructions',
    'verbs followed by infinitive',
    'french prepositions infinitive'
  ],
  examples: [
    'Je veux partir. (I want to leave.)',
    'Il peut venir. (He can come.)',
    'Nous devons étudier. (We must study.)',
    'J\'apprends à conduire. (I\'m learning to drive.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Verb + Infinitive Constructions',
    content: `In French, many verbs are followed directly by an **infinitive** (the base form of the verb ending in -er, -ir, or -re). This creates **verb chains** that express complex ideas about ability, desire, obligation, and other relationships between actions.

**Three main patterns:**
1. **VERB + INFINITIVE** (no preposition)
2. **VERB + À + INFINITIVE** (with preposition à)
3. **VERB + DE + INFINITIVE** (with preposition de)

Understanding which pattern to use with each verb is crucial for natural French expression.`,
    examples: [
      {
        spanish: 'Je veux manger. (I want to eat.) - No preposition',
        english: 'Direct infinitive construction',
        highlight: ['Je veux manger']
      },
      {
        spanish: 'J\'apprends à nager. (I\'m learning to swim.) - With à',
        english: 'Infinitive with preposition à',
        highlight: ['J\'apprends à nager']
      },
      {
        spanish: 'Je décide de partir. (I decide to leave.) - With de',
        english: 'Infinitive with preposition de',
        highlight: ['Je décide de partir']
      }
    ]
  },
  {
    title: 'Modal Verbs + Infinitive (No Preposition)',
    content: `**Modal verbs** express ability, desire, obligation, or possibility and are followed **directly** by an infinitive:`,
    conjugationTable: {
      title: 'Common Modal Verbs + Infinitive',
      conjugations: [
        { pronoun: 'vouloir', form: 'to want', english: 'Je veux partir. (I want to leave.)' },
        { pronoun: 'pouvoir', form: 'to be able/can', english: 'Tu peux venir. (You can come.)' },
        { pronoun: 'devoir', form: 'to have to/must', english: 'Il doit travailler. (He must work.)' },
        { pronoun: 'savoir', form: 'to know how', english: 'Elle sait conduire. (She knows how to drive.)' },
        { pronoun: 'falloir', form: 'to be necessary', english: 'Il faut étudier. (One must study.)' },
        { pronoun: 'valoir mieux', form: 'to be better', english: 'Il vaut mieux attendre. (It\'s better to wait.)' }
      ]
    },
    subsections: [
      {
        title: 'VOULOIR + Infinitive',
        content: 'Expressing desire or intention:',
        examples: [
          {
            spanish: 'Je veux apprendre le français. (I want to learn French.)',
            english: 'Nous voulons voyager. (We want to travel.)',
            highlight: ['Je veux apprendre', 'Nous voulons voyager']
          }
        ]
      },
      {
        title: 'POUVOIR + Infinitive',
        content: 'Expressing ability or permission:',
        examples: [
          {
            spanish: 'Tu peux m\'aider? (Can you help me?)',
            english: 'On peut sortir? (Can we go out?)',
            highlight: ['Tu peux m\'aider?', 'On peut sortir?']
          }
        ]
      },
      {
        title: 'DEVOIR + Infinitive',
        content: 'Expressing obligation or necessity:',
        examples: [
          {
            spanish: 'Je dois partir maintenant. (I must leave now.)',
            english: 'Vous devez faire attention. (You must be careful.)',
            highlight: ['Je dois partir', 'Vous devez faire attention']
          }
        ]
      }
    ]
  },
  {
    title: 'Other Verbs + Direct Infinitive',
    content: `Many other verbs are followed directly by an infinitive without a preposition:`,
    conjugationTable: {
      title: 'Common Verbs + Direct Infinitive',
      conjugations: [
        { pronoun: 'aimer', form: 'to like/love', english: 'J\'aime danser. (I like to dance.)' },
        { pronoun: 'préférer', form: 'to prefer', english: 'Je préfère rester. (I prefer to stay.)' },
        { pronoun: 'espérer', form: 'to hope', english: 'J\'espère réussir. (I hope to succeed.)' },
        { pronoun: 'aller', form: 'to go', english: 'Je vais manger. (I\'m going to eat.)' },
        { pronoun: 'venir', form: 'to come', english: 'Il vient nous voir. (He\'s coming to see us.)' },
        { pronoun: 'faire', form: 'to make/do', english: 'Tu me fais rire. (You make me laugh.)' }
      ]
    },
    subsections: [
      {
        title: 'Preference Verbs',
        content: 'Expressing likes and preferences:',
        examples: [
          {
            spanish: 'J\'adore voyager. (I love to travel.)',
            english: 'Il déteste attendre. (He hates to wait.)',
            highlight: ['J\'adore voyager', 'Il déteste attendre']
          }
        ]
      },
      {
        title: 'Movement Verbs',
        content: 'Verbs of movement + infinitive of purpose:',
        examples: [
          {
            spanish: 'Je vais acheter du pain. (I\'m going to buy bread.)',
            english: 'Elle vient me parler. (She\'s coming to talk to me.)',
            highlight: ['Je vais acheter', 'Elle vient me parler']
          }
        ]
      }
    ]
  },
  {
    title: 'Verbs + À + Infinitive',
    content: `Many verbs require the preposition **à** before an infinitive:`,
    conjugationTable: {
      title: 'Common Verbs + À + Infinitive',
      conjugations: [
        { pronoun: 'apprendre à', form: 'to learn to', english: 'J\'apprends à conduire. (I\'m learning to drive.)' },
        { pronoun: 'commencer à', form: 'to begin to', english: 'Il commence à pleuvoir. (It\'s starting to rain.)' },
        { pronoun: 'continuer à', form: 'to continue to', english: 'Elle continue à étudier. (She continues to study.)' },
        { pronoun: 'réussir à', form: 'to succeed in', english: 'Je réussis à comprendre. (I manage to understand.)' },
        { pronoun: 'aider à', form: 'to help to', english: 'Tu m\'aides à porter? (Will you help me carry?)' },
        { pronoun: 'inviter à', form: 'to invite to', english: 'Il m\'invite à dîner. (He invites me to dinner.)' }
      ]
    },
    subsections: [
      {
        title: 'Learning and Beginning',
        content: 'Verbs related to starting or learning:',
        examples: [
          {
            spanish: 'Elle apprend à jouer du piano. (She\'s learning to play piano.)',
            english: 'Nous commençons à comprendre. (We\'re beginning to understand.)',
            highlight: ['apprend à jouer', 'commençons à comprendre']
          }
        ]
      },
      {
        title: 'Success and Effort',
        content: 'Verbs expressing achievement or effort:',
        examples: [
          {
            spanish: 'J\'arrive à le faire. (I manage to do it.)',
            english: 'Il cherche à améliorer. (He\'s trying to improve.)',
            highlight: ['J\'arrive à le faire', 'Il cherche à améliorer']
          }
        ]
      }
    ]
  },
  {
    title: 'Verbs + DE + Infinitive',
    content: `Many verbs require the preposition **de** before an infinitive:`,
    conjugationTable: {
      title: 'Common Verbs + DE + Infinitive',
      conjugations: [
        { pronoun: 'décider de', form: 'to decide to', english: 'Je décide de partir. (I decide to leave.)' },
        { pronoun: 'essayer de', form: 'to try to', english: 'J\'essaie de comprendre. (I try to understand.)' },
        { pronoun: 'finir de', form: 'to finish', english: 'Il finit de manger. (He finishes eating.)' },
        { pronoun: 'oublier de', form: 'to forget to', english: 'J\'oublie de fermer. (I forget to close.)' },
        { pronoun: 'promettre de', form: 'to promise to', english: 'Elle promet de venir. (She promises to come.)' },
        { pronoun: 'refuser de', form: 'to refuse to', english: 'Il refuse de partir. (He refuses to leave.)' }
      ]
    },
    subsections: [
      {
        title: 'Decision and Choice',
        content: 'Verbs expressing decisions:',
        examples: [
          {
            spanish: 'Nous choisissons de rester. (We choose to stay.)',
            english: 'Elle décide de partir. (She decides to leave.)',
            highlight: ['choisissons de rester', 'décide de partir']
          }
        ]
      },
      {
        title: 'Completion and Memory',
        content: 'Verbs related to finishing or remembering:',
        examples: [
          {
            spanish: 'J\'arrête de fumer. (I stop smoking.)',
            english: 'Tu te souviens de fermer? (Do you remember to close?)',
            highlight: ['J\'arrête de fumer', 'te souviens de fermer']
          }
        ]
      }
    ]
  },
  {
    title: 'Adjectives + DE + Infinitive',
    content: `Many adjectives are also followed by **de** + infinitive:`,
    examples: [
      {
        spanish: 'Je suis content de vous voir. (I\'m happy to see you.)',
        english: 'Il est facile de comprendre. (It\'s easy to understand.)',
        highlight: ['content de vous voir', 'facile de comprendre']
      },
      {
        spanish: 'C\'est difficile de parler. (It\'s difficult to speak.)',
        english: 'Nous sommes prêts de partir. (We\'re ready to leave.)',
        highlight: ['difficile de parler', 'prêts de partir']
      }
    ],
    subsections: [
      {
        title: 'Emotional Adjectives',
        content: 'Adjectives expressing feelings:',
        examples: [
          {
            spanish: 'Je suis heureux de te voir. (I\'m happy to see you.)',
            english: 'Elle est triste de partir. (She\'s sad to leave.)',
            highlight: ['heureux de te voir', 'triste de partir']
          }
        ]
      }
    ]
  },
  {
    title: 'Causative Constructions',
    content: `Special constructions where one person causes another to do something:`,
    examples: [
      {
        spanish: 'Je fais réparer ma voiture. (I have my car repaired.)',
        english: 'Elle fait venir le médecin. (She has the doctor come.)',
        highlight: ['Je fais réparer', 'Elle fait venir']
      }
    ],
    subsections: [
      {
        title: 'FAIRE + Infinitive',
        content: 'Having someone do something:',
        examples: [
          {
            spanish: 'Je fais cuire le dîner. (I\'m cooking dinner.)',
            english: 'Tu me fais attendre. (You\'re making me wait.)',
            highlight: ['Je fais cuire', 'Tu me fais attendre']
          }
        ]
      },
      {
        title: 'LAISSER + Infinitive',
        content: 'Letting someone do something:',
        examples: [
          {
            spanish: 'Je laisse partir les enfants. (I let the children leave.)',
            english: 'Elle me laisse conduire. (She lets me drive.)',
            highlight: ['Je laisse partir', 'Elle me laisse conduire']
          }
        ]
      }
    ]
  },
  {
    title: 'Negation with Infinitive Constructions',
    content: `When negating verb + infinitive constructions, the negation usually surrounds the **conjugated verb**:`,
    examples: [
      {
        spanish: 'Je ne veux pas partir. (I don\'t want to leave.)',
        english: 'Il ne peut pas venir. (He can\'t come.)',
        highlight: ['Je ne veux pas partir', 'Il ne peut pas venir']
      },
      {
        spanish: 'Nous n\'apprenons pas à conduire. (We\'re not learning to drive.)',
        english: 'Elle ne décide pas de rester. (She doesn\'t decide to stay.)',
        highlight: ['n\'apprenons pas à conduire', 'ne décide pas de rester']
      }
    ],
    subsections: [
      {
        title: 'Negating the Infinitive',
        content: 'Sometimes the infinitive itself is negated:',
        examples: [
          {
            spanish: 'Je préfère ne pas sortir. (I prefer not to go out.)',
            english: 'Il vaut mieux ne rien dire. (It\'s better to say nothing.)',
            highlight: ['ne pas sortir', 'ne rien dire']
          }
        ]
      }
    ]
  },
  {
    title: 'Memory Strategies',
    content: `Tips for remembering which preposition to use:`,
    subsections: [
      {
        title: 'No Preposition Groups',
        content: 'Common categories that take direct infinitive:',
        examples: [
          {
            spanish: 'Modal verbs: vouloir, pouvoir, devoir, savoir',
            english: 'Preference verbs: aimer, préférer, détester',
            highlight: ['Modal verbs', 'Preference verbs']
          },
          {
            spanish: 'Movement verbs: aller, venir',
            english: 'Perception verbs: voir, entendre',
            highlight: ['Movement verbs', 'Perception verbs']
          }
        ]
      },
      {
        title: 'À Preposition Pattern',
        content: 'Verbs expressing learning, beginning, or effort:',
        examples: [
          {
            spanish: 'Learning: apprendre à, enseigner à',
            english: 'Beginning: commencer à, se mettre à',
            highlight: ['Learning', 'Beginning']
          }
        ]
      },
      {
        title: 'DE Preposition Pattern',
        content: 'Verbs expressing decision, completion, or emotion:',
        examples: [
          {
            spanish: 'Decision: décider de, choisir de',
            english: 'Completion: finir de, arrêter de',
            highlight: ['Decision', 'Completion']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes with Infinitive Constructions',
    content: `Here are frequent errors students make:

**1. Wrong preposition**: Using à instead of de or vice versa
**2. Adding unnecessary prepositions**: Using prepositions with modal verbs
**3. Missing prepositions**: Forgetting required prepositions
**4. Wrong infinitive form**: Using conjugated verbs instead of infinitives`,
    examples: [
      {
        spanish: '❌ Je veux à partir → ✅ Je veux partir',
        english: 'Wrong: modal verbs don\'t need prepositions',
        highlight: ['Je veux partir']
      },
      {
        spanish: '❌ J\'apprends de conduire → ✅ J\'apprends à conduire',
        english: 'Wrong: apprendre takes à, not de',
        highlight: ['J\'apprends à conduire']
      },
      {
        spanish: '❌ Je décide à partir → ✅ Je décide de partir',
        english: 'Wrong: décider takes de, not à',
        highlight: ['Je décide de partir']
      },
      {
        spanish: '❌ Je veux que je pars → ✅ Je veux partir',
        english: 'Wrong: use infinitive, not conjugated verb',
        highlight: ['Je veux partir']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Modal Verbs', url: '/grammar/french/verbs/modal-verbs', difficulty: 'intermediate' },
  { title: 'French Prepositions', url: '/grammar/french/prepositions/basic-prepositions', difficulty: 'intermediate' },
  { title: 'French Subjunctive Mood', url: '/grammar/french/verbs/subjunctive', difficulty: 'advanced' },
  { title: 'French Present Tense', url: '/grammar/french/verbs/present-tense', difficulty: 'beginner' }
];

export default function FrenchVerbsInfinitivePage() {
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
              topic: 'verbs-infinitive',
              title: 'French Verbs + Infinitive (Vouloir, Pouvoir, Devoir + Infinitive)',
              description: 'Master French verb + infinitive constructions including modal verbs, prepositions with infinitives, and infinitive complements.',
              difficulty: 'intermediate',
              examples: [
                'Je veux partir. (I want to leave.)',
                'Il peut venir. (He can come.)',
                'Nous devons étudier. (We must study.)',
                'J\'apprends à conduire. (I\'m learning to drive.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'verbs-infinitive',
              title: 'French Verbs + Infinitive (Vouloir, Pouvoir, Devoir + Infinitive)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="verbs-infinitive"
        title="French Verbs + Infinitive (Vouloir, Pouvoir, Devoir + Infinitive)"
        description="Master French verb + infinitive constructions including modal verbs, prepositions with infinitives, and infinitive complements"
        difficulty="intermediate"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/verbs-infinitive/practice"
        quizUrl="/grammar/french/verbs/verbs-infinitive/quiz"
        songUrl="/songs/fr?theme=grammar&topic=infinitive-constructions"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
