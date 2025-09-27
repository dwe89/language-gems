import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'modes-of-address',
  title: 'French Modes of Address (Tu vs Vous, Formal vs Informal)',
  description: 'Master French modes of address including tu vs vous, formal and informal speech patterns. Learn when to use formal and informal address.',
  difficulty: 'beginner',
  keywords: [
    'tu vs vous french',
    'french formal informal',
    'french modes of address',
    'french politeness',
    'vouvoyer tutoyer',
    'french etiquette'
  ],
  examples: [
    'Tu parles français? (informal - Do you speak French?)',
    'Vous parlez français? (formal - Do you speak French?)',
    'Comment tu t\'appelles? (informal - What\'s your name?)',
    'Comment vous appelez-vous? (formal - What is your name?)'
  ]
});

const sections = [
  {
    title: 'Understanding French Modes of Address',
    content: `French has **two ways** to say "you": **TU** (informal) and **VOUS** (formal/plural). This distinction is crucial for appropriate communication in French:

**TU** - Informal "you" (singular)
- Used with friends, family, children
- Shows familiarity and closeness
- Called "tutoyer" (to use tu)

**VOUS** - Formal "you" (singular) or plural "you"
- Used with strangers, authority figures, older people
- Shows respect and politeness
- Called "vouvoyer" (to use vous)

Choosing the wrong form can be socially awkward or even offensive, so understanding when to use each is essential for French communication.`,
    examples: [
      {
        spanish: 'Tu es mon ami. (You are my friend.) - Informal',
        english: 'Used with close friends and family',
        highlight: ['Tu es mon ami']
      },
      {
        spanish: 'Vous êtes mon professeur. (You are my teacher.) - Formal',
        english: 'Used with teachers, bosses, strangers',
        highlight: ['Vous êtes mon professeur']
      },
      {
        spanish: 'Vous êtes mes amis. (You are my friends.) - Plural',
        english: 'Used when addressing multiple people',
        highlight: ['Vous êtes mes amis']
      }
    ]
  },
  {
    title: 'TU - Informal Address',
    content: `**TU** is used in informal situations with people you know well:`,
    conjugationTable: {
      title: 'Common Verbs with TU',
      conjugations: [
        { pronoun: 'tu es', form: 'you are', english: 'Tu es sympa. (You\'re nice.)' },
        { pronoun: 'tu as', form: 'you have', english: 'Tu as raison. (You\'re right.)' },
        { pronoun: 'tu fais', form: 'you do/make', english: 'Tu fais quoi? (What are you doing?)' },
        { pronoun: 'tu veux', form: 'you want', english: 'Tu veux venir? (Do you want to come?)' },
        { pronoun: 'tu peux', form: 'you can', english: 'Tu peux m\'aider? (Can you help me?)' },
        { pronoun: 'tu sais', form: 'you know', english: 'Tu sais nager? (Do you know how to swim?)' }
      ]
    },
    subsections: [
      {
        title: 'When to Use TU',
        content: 'Appropriate situations for informal address:',
        examples: [
          {
            spanish: '👨‍👩‍👧‍👦 Family members: Tu viens, maman?',
            english: '👫 Close friends: Tu veux sortir ce soir?',
            highlight: ['Tu viens, maman?', 'Tu veux sortir ce soir?']
          },
          {
            spanish: '👶 Children: Tu t\'appelles comment?',
            english: '🐕 Pets: Tu es mignon! (You\'re cute!)',
            highlight: ['Tu t\'appelles comment?', 'Tu es mignon!']
          }
        ]
      },
      {
        title: 'TU with Reflexive Verbs',
        content: 'Reflexive pronouns change with tu:',
        examples: [
          {
            spanish: 'Tu te lèves à quelle heure? (What time do you get up?)',
            english: 'Tu t\'appelles comment? (What\'s your name?)',
            highlight: ['Tu te lèves', 'Tu t\'appelles']
          }
        ]
      }
    ]
  },
  {
    title: 'VOUS - Formal Address',
    content: `**VOUS** is used in formal situations and when addressing multiple people:`,
    conjugationTable: {
      title: 'Common Verbs with VOUS',
      conjugations: [
        { pronoun: 'vous êtes', form: 'you are', english: 'Vous êtes français? (Are you French?)' },
        { pronoun: 'vous avez', form: 'you have', english: 'Vous avez l\'heure? (Do you have the time?)' },
        { pronoun: 'vous faites', form: 'you do/make', english: 'Vous faites quoi? (What do you do?)' },
        { pronoun: 'vous voulez', form: 'you want', english: 'Vous voulez du café? (Do you want coffee?)' },
        { pronoun: 'vous pouvez', form: 'you can', english: 'Vous pouvez répéter? (Can you repeat?)' },
        { pronoun: 'vous savez', form: 'you know', english: 'Vous savez où c\'est? (Do you know where it is?)' }
      ]
    },
    subsections: [
      {
        title: 'When to Use VOUS (Formal)',
        content: 'Appropriate situations for formal address:',
        examples: [
          {
            spanish: '👔 Professional: Vous travaillez ici?',
            english: '🏪 Strangers: Vous habitez où?',
            highlight: ['Vous travaillez ici?', 'Vous habitez où?']
          },
          {
            spanish: '👴 Elderly people: Vous allez bien?',
            english: '🎓 Authority figures: Vous pouvez m\'aider?',
            highlight: ['Vous allez bien?', 'Vous pouvez m\'aider?']
          }
        ]
      },
      {
        title: 'When to Use VOUS (Plural)',
        content: 'Addressing multiple people (always vous):',
        examples: [
          {
            spanish: 'Vous venez tous? (Are you all coming?)',
            english: 'Vous êtes prêts? (Are you ready?)',
            highlight: ['Vous venez tous?', 'Vous êtes prêts?']
          }
        ]
      }
    ]
  },
  {
    title: 'Switching Between Tu and Vous',
    content: `The transition from **vous** to **tu** is significant in French relationships:`,
    examples: [
      {
        spanish: 'On peut se tutoyer? (Can we use tu with each other?)',
        english: 'Tu peux me tutoyer. (You can use tu with me.)',
        highlight: ['On peut se tutoyer?', 'Tu peux me tutoyer.']
      }
    ],
    subsections: [
      {
        title: 'The Transition Process',
        content: 'How relationships evolve from formal to informal:',
        examples: [
          {
            spanish: '1. Initial meeting: Vous (formal)',
            english: '2. Getting acquainted: Still vous',
            highlight: ['Initial meeting', 'Getting acquainted']
          },
          {
            spanish: '3. Suggestion to switch: "On se tutoie?"',
            english: '4. Ongoing relationship: Tu (informal)',
            highlight: ['On se tutoie?', 'Tu (informal)']
          }
        ]
      },
      {
        title: 'Who Initiates the Switch?',
        content: 'Social rules for suggesting informal address:',
        examples: [
          {
            spanish: '👴→👦 Older person suggests to younger',
            english: '👔→👤 Superior suggests to subordinate',
            highlight: ['Older person', 'Superior']
          },
          {
            spanish: '👩→👨 Woman may suggest to man',
            english: '🏠 Host suggests to guest',
            highlight: ['Woman may suggest', 'Host suggests']
          }
        ]
      }
    ]
  },
  {
    title: 'Regional and Cultural Variations',
    content: `Usage varies across French-speaking regions:`,
    subsections: [
      {
        title: 'France',
        content: 'Traditional formal approach:',
        examples: [
          {
            spanish: 'More formal in business and with strangers',
            english: 'Vous is default until relationship develops',
            highlight: ['More formal', 'Vous is default']
          }
        ]
      },
      {
        title: 'Quebec (Canada)',
        content: 'More relaxed approach:',
        examples: [
          {
            spanish: 'Tu is used more quickly in casual settings',
            english: 'Less formal in service interactions',
            highlight: ['Tu is used more quickly', 'Less formal']
          }
        ]
      },
      {
        title: 'Belgium and Switzerland',
        content: 'Similar to France but with local variations:',
        examples: [
          {
            spanish: 'Generally formal approach like France',
            english: 'Some regional differences in usage',
            highlight: ['Generally formal', 'regional differences']
          }
        ]
      }
    ]
  },
  {
    title: 'Age and Social Context',
    content: `Age plays a crucial role in determining address mode:`,
    subsections: [
      {
        title: 'Children and Teenagers',
        content: 'Special rules for young people:',
        examples: [
          {
            spanish: 'Adults → Children: Always tu',
            english: 'Children → Adults: Usually vous',
            highlight: ['Always tu', 'Usually vous']
          },
          {
            spanish: 'Teenagers among themselves: tu',
            english: 'Teenagers → Adult strangers: vous',
            highlight: ['tu', 'vous']
          }
        ]
      },
      {
        title: 'University and School',
        content: 'Educational context rules:',
        examples: [
          {
            spanish: 'Students → Professors: vous',
            english: 'Professors → Students: varies by level',
            highlight: ['Students → Professors: vous', 'varies by level']
          }
        ]
      }
    ]
  },
  {
    title: 'Professional Settings',
    content: `Workplace etiquette for address modes:`,
    examples: [
      {
        spanish: 'Bonjour, vous allez bien? (Good morning, how are you?)',
        english: 'Pouvez-vous m\'aider? (Can you help me?)',
        highlight: ['vous allez bien?', 'Pouvez-vous m\'aider?']
      }
    ],
    subsections: [
      {
        title: 'Hierarchy Considerations',
        content: 'Professional relationship dynamics:',
        examples: [
          {
            spanish: 'Employee → Boss: Always vous',
            english: 'Colleagues: Depends on company culture',
            highlight: ['Always vous', 'Depends on company culture']
          }
        ]
      },
      {
        title: 'Customer Service',
        content: 'Service industry standards:',
        examples: [
          {
            spanish: 'Staff → Customers: Always vous',
            english: 'Customers → Staff: Expected to use vous',
            highlight: ['Always vous', 'Expected to use vous']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes and Pitfalls',
    content: `Here are frequent errors with modes of address:

**1. Using tu too quickly**: Being overly familiar with strangers
**2. Mixing forms**: Switching between tu and vous in same conversation
**3. Wrong verb forms**: Using tu verb forms with vous
**4. Cultural misunderstanding**: Applying English informality`,
    examples: [
      {
        spanish: '❌ Tu (to stranger) → ✅ Vous (to stranger)',
        english: 'Wrong: being too informal too quickly',
        highlight: ['Vous (to stranger)']
      },
      {
        spanish: '❌ Vous êtes, tu fais → ✅ Vous êtes, vous faites',
        english: 'Wrong: mixing tu and vous forms',
        highlight: ['vous faites']
      },
      {
        spanish: '❌ Tu avez → ✅ Tu as or Vous avez',
        english: 'Wrong: mixing pronoun and verb form',
        highlight: ['Tu as', 'Vous avez']
      },
      {
        spanish: '❌ Immediate tu with boss → ✅ Vous until invited',
        english: 'Wrong: assuming informality in professional settings',
        highlight: ['Vous until invited']
      }
    ]
  },
  {
    title: 'Practical Tips for Learners',
    content: `Guidelines for choosing the right address mode:`,
    subsections: [
      {
        title: 'When in Doubt, Use VOUS',
        content: 'Safe approach for learners:',
        examples: [
          {
            spanish: 'Better to be too formal than too informal',
            english: 'French people will guide you to tu if appropriate',
            highlight: ['too formal', 'guide you to tu']
          }
        ]
      },
      {
        title: 'Listen and Mirror',
        content: 'Follow the lead of native speakers:',
        examples: [
          {
            spanish: 'If they use tu with you, you can use tu back',
            english: 'If they maintain vous, continue with vous',
            highlight: ['use tu back', 'continue with vous']
          }
        ]
      },
      {
        title: 'Context Clues',
        content: 'Situational indicators:',
        examples: [
          {
            spanish: 'Formal setting = vous',
            english: 'Casual setting = possibly tu',
            highlight: ['Formal setting = vous', 'Casual setting = possibly tu']
          }
        ]
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Present Tense', url: '/grammar/french/verbs/present-tense', difficulty: 'beginner' },
  { title: 'French Interrogative Forms', url: '/grammar/french/verbs/interrogative-forms', difficulty: 'intermediate' },
  { title: 'French Reflexive Verbs', url: '/grammar/french/verbs/reflexive-verbs', difficulty: 'intermediate' },
  { title: 'French Subject Pronouns', url: '/grammar/french/pronouns/subject-pronouns', difficulty: 'beginner' }
];

export default function FrenchModesOfAddressPage() {
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
              topic: 'modes-of-address',
              title: 'French Modes of Address (Tu vs Vous, Formal vs Informal)',
              description: 'Master French modes of address including tu vs vous, formal and informal speech patterns. Learn when to use formal and informal address.',
              difficulty: 'beginner',
              examples: [
                'Tu parles français? (informal - Do you speak French?)',
                'Vous parlez français? (formal - Do you speak French?)',
                'Comment tu t\'appelles? (informal - What\'s your name?)',
                'Comment vous appelez-vous? (formal - What is your name?)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'modes-of-address',
              title: 'French Modes of Address (Tu vs Vous, Formal vs Informal)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="modes-of-address"
        title="French Modes of Address (Tu vs Vous, Formal vs Informal)"
        description="Master French modes of address including tu vs vous, formal and informal speech patterns. Learn when to use formal and informal address"
        difficulty="beginner"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/modes-of-address/practice"
        quizUrl="/grammar/french/verbs/modes-of-address/quiz"
        songUrl="/songs/fr?theme=grammar&topic=politeness"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
