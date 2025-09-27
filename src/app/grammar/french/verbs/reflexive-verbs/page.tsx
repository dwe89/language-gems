import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'reflexive-verbs',
  title: 'French Reflexive Verbs',
  description: 'Master French reflexive verbs (se laver, se lever, s\'habiller) with conjugation patterns and daily routine vocabulary.',
  difficulty: 'intermediate',
  keywords: [
    'french reflexive verbs',
    'verbes pronominaux',
    'se laver french',
    'daily routine french',
    'reflexive pronouns french',
    'french grammar reflexive',
    'pronominal verbs french'
  ],
  examples: [
    'Je me lave (I wash myself)',
    'Tu te lèves tôt (You get up early)',
    'Elle s\'habille élégamment (She dresses elegantly)'
  ]
});

const sections = [
  {
    title: 'French Reflexive Verbs Overview',
    content: `French reflexive verbs (**verbes pronominaux**) are verbs that are accompanied by a reflexive pronoun that refers back to the subject. They're used when the subject performs an action on themselves.

Reflexive verbs are essential for describing daily routines, personal care, and many common activities. They're much more common in French than in English.`,
    examples: [
      {
        spanish: 'Je me lave les mains.',
        english: 'I wash my hands. (literally: I wash myself the hands)',
        highlight: ['me lave']
      },
      {
        spanish: 'Elle se réveille à sept heures.',
        english: 'She wakes up at seven o\'clock.',
        highlight: ['se réveille']
      },
      {
        spanish: 'Nous nous amusons beaucoup.',
        english: 'We\'re having a lot of fun.',
        highlight: ['nous amusons']
      }
    ]
  },
  {
    title: 'Reflexive Pronouns',
    content: `Reflexive verbs use reflexive pronouns that must agree with the subject. These pronouns are placed before the verb in most tenses.`,
    subsections: [
      {
        title: 'Reflexive Pronoun Forms',
        content: `The reflexive pronouns change according to the subject:`,
        conjugationTable: {
          title: 'French Reflexive Pronouns',
          conjugations: [
            { pronoun: 'je', form: 'me (m\')', english: 'myself' },
            { pronoun: 'tu', form: 'te (t\')', english: 'yourself' },
            { pronoun: 'il/elle/on', form: 'se (s\')', english: 'himself/herself/oneself' },
            { pronoun: 'nous', form: 'nous', english: 'ourselves' },
            { pronoun: 'vous', form: 'vous', english: 'yourself/yourselves' },
            { pronoun: 'ils/elles', form: 'se (s\')', english: 'themselves' }
          ]
        },
        examples: [
          {
            spanish: 'Je me regarde dans le miroir.',
            english: 'I look at myself in the mirror.',
            highlight: ['me regarde']
          },
          {
            spanish: 'Tu t\'habilles rapidement.',
            english: 'You get dressed quickly.',
            highlight: ['t\'habilles']
          },
          {
            spanish: 'Ils s\'aiment beaucoup.',
            english: 'They love each other very much.',
            highlight: ['s\'aiment']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Reflexive Verbs',
    content: `Many everyday activities are expressed with reflexive verbs in French. Here are the most common ones:`,
    subsections: [
      {
        title: 'Daily Routine Reflexive Verbs',
        content: `These reflexive verbs describe daily activities:`,
        conjugationTable: {
          title: 'Se laver (to wash oneself) - Present Tense',
          conjugations: [
            { pronoun: 'je', form: 'me lave', english: 'I wash myself' },
            { pronoun: 'tu', form: 'te laves', english: 'you wash yourself' },
            { pronoun: 'il/elle/on', form: 'se lave', english: 'he/she washes himself/herself' },
            { pronoun: 'nous', form: 'nous lavons', english: 'we wash ourselves' },
            { pronoun: 'vous', form: 'vous lavez', english: 'you wash yourself/yourselves' },
            { pronoun: 'ils/elles', form: 'se lavent', english: 'they wash themselves' }
          ]
        },
        examples: [
          {
            spanish: 'Je me lève à six heures.',
            english: 'I get up at six o\'clock. (se lever)',
            highlight: ['me lève']
          },
          {
            spanish: 'Elle se brosse les dents.',
            english: 'She brushes her teeth. (se brosser)',
            highlight: ['se brosse']
          },
          {
            spanish: 'Nous nous couchons tard.',
            english: 'We go to bed late. (se coucher)',
            highlight: ['nous couchons']
          }
        ]
      },
      {
        title: 'More Common Reflexive Verbs',
        content: `Additional important reflexive verbs:`,
        conjugationTable: {
          title: 'Common Reflexive Verbs',
          conjugations: [
            { pronoun: 'se réveiller', form: 'to wake up', english: 'Je me réveille tôt' },
            { pronoun: 's\'habiller', form: 'to get dressed', english: 'Tu t\'habilles bien' },
            { pronoun: 'se dépêcher', form: 'to hurry', english: 'Il se dépêche' },
            { pronoun: 's\'amuser', form: 'to have fun', english: 'Nous nous amusons' },
            { pronoun: 'se reposer', form: 'to rest', english: 'Vous vous reposez' },
            { pronoun: 'se promener', form: 'to take a walk', english: 'Ils se promènent' }
          ]
        },
        examples: [
          {
            spanish: 'Tu te dépêches pour arriver à l\'heure.',
            english: 'You hurry to arrive on time.',
            highlight: ['te dépêches']
          },
          {
            spanish: 'Les enfants s\'amusent dans le parc.',
            english: 'The children are having fun in the park.',
            highlight: ['s\'amusent']
          },
          {
            spanish: 'Je me promène tous les soirs.',
            english: 'I take a walk every evening.',
            highlight: ['me promène']
          }
        ]
      }
    ]
  },
  {
    title: 'Reflexive Verbs in Different Tenses',
    content: `Reflexive verbs can be conjugated in all tenses. The reflexive pronoun always stays with the verb:`,
    subsections: [
      {
        title: 'Passé Composé with Reflexive Verbs',
        content: `All reflexive verbs use **être** in the passé composé, and the past participle usually agrees with the subject:`,
        conjugationTable: {
          title: 'Se lever (to get up) - Passé Composé',
          conjugations: [
            { pronoun: 'je', form: 'me suis levé(e)', english: 'I got up' },
            { pronoun: 'tu', form: 't\'es levé(e)', english: 'you got up' },
            { pronoun: 'il/elle', form: 's\'est levé/levée', english: 'he/she got up' },
            { pronoun: 'nous', form: 'nous sommes levé(e)s', english: 'we got up' },
            { pronoun: 'vous', form: 'vous êtes levé(e)(s)', english: 'you got up' },
            { pronoun: 'ils/elles', form: 'se sont levés/levées', english: 'they got up' }
          ]
        },
        examples: [
          {
            spanish: 'Je me suis lavé ce matin.',
            english: 'I washed myself this morning.',
            highlight: ['me suis lavé']
          },
          {
            spanish: 'Elle s\'est couchée tard hier soir.',
            english: 'She went to bed late last night.',
            highlight: ['s\'est couchée']
          },
          {
            spanish: 'Nous nous sommes amusés à la fête.',
            english: 'We had fun at the party.',
            highlight: ['nous sommes amusés']
          }
        ]
      },
      {
        title: 'Future and Conditional',
        content: `In future and conditional tenses, the reflexive pronoun stays before the conjugated verb:`,
        examples: [
          {
            spanish: 'Je me lèverai tôt demain.',
            english: 'I will get up early tomorrow. (future)',
            highlight: ['me lèverai']
          },
          {
            spanish: 'Tu te coucherais plus tôt si tu étais sage.',
            english: 'You would go to bed earlier if you were good. (conditional)',
            highlight: ['te coucherais']
          },
          {
            spanish: 'Nous nous promènerons dans le parc.',
            english: 'We will take a walk in the park. (future)',
            highlight: ['nous promènerons']
          }
        ]
      }
    ]
  },
  {
    title: 'Negative Reflexive Verbs',
    content: `In negative sentences, **ne** comes before the reflexive pronoun and **pas** after the verb:

**Formula**: Subject + ne + reflexive pronoun + verb + pas

This pattern applies to all tenses with reflexive verbs.`,
    examples: [
      {
        spanish: 'Je ne me lève pas tôt le dimanche.',
        english: 'I don\'t get up early on Sundays.',
        highlight: ['ne me lève pas']
      },
      {
        spanish: 'Elle ne s\'habille jamais en noir.',
        english: 'She never dresses in black.',
        highlight: ['ne s\'habille jamais']
      },
      {
        spanish: 'Nous ne nous sommes pas amusés.',
        english: 'We didn\'t have fun. (passé composé)',
        highlight: ['ne nous sommes pas']
      },
      {
        spanish: 'Tu ne te dépêcheras plus.',
        english: 'You won\'t hurry anymore. (future)',
        highlight: ['ne te dépêcheras plus']
      }
    ]
  },
  {
    title: 'Reflexive vs Non-Reflexive',
    content: `Many verbs can be used both reflexively and non-reflexively, with different meanings:

**Reflexive**: Action performed on oneself
**Non-reflexive**: Action performed on someone/something else

Understanding this distinction is crucial for correct usage.`,
    examples: [
      {
        spanish: 'Je lave ma voiture. / Je me lave.',
        english: 'I wash my car. / I wash myself.',
        highlight: ['lave', 'me lave']
      },
      {
        spanish: 'Elle réveille son fils. / Elle se réveille.',
        english: 'She wakes up her son. / She wakes up.',
        highlight: ['réveille', 'se réveille']
      },
      {
        spanish: 'Nous habillons le bébé. / Nous nous habillons.',
        english: 'We dress the baby. / We get dressed.',
        highlight: ['habillons', 'nous habillons']
      },
      {
        spanish: 'Tu couches les enfants. / Tu te couches.',
        english: 'You put the children to bed. / You go to bed.',
        highlight: ['couches', 'te couches']
      }
    ]
  },
  {
    title: 'Reciprocal Reflexive Verbs',
    content: `Some reflexive verbs express **reciprocal actions** (each other) rather than reflexive actions (oneself). These are used with plural subjects:

**Reciprocal meaning**: The subjects perform the action on each other
**Common reciprocal verbs**: se parler, se voir, s'aimer, se téléphoner, se rencontrer

Context usually makes the meaning clear.`,
    examples: [
      {
        spanish: 'Ils se parlent tous les jours.',
        english: 'They talk to each other every day.',
        highlight: ['se parlent']
      },
      {
        spanish: 'Nous nous voyons souvent.',
        english: 'We see each other often.',
        highlight: ['nous voyons']
      },
      {
        spanish: 'Les amoureux s\'embrassent.',
        english: 'The lovers kiss each other.',
        highlight: ['s\'embrassent']
      },
      {
        spanish: 'Vous vous téléphonez le soir?',
        english: 'Do you call each other in the evening?',
        highlight: ['vous téléphonez']
      }
    ]
  },
  {
    title: 'Reflexive Verbs in Questions',
    content: `When forming questions with reflexive verbs, the reflexive pronoun stays with the verb:

**Inversion**: The reflexive pronoun stays before the verb
**Est-ce que**: Normal word order with reflexive pronoun
**Intonation**: Rising intonation with normal word order

The reflexive pronoun never separates from its verb.`,
    examples: [
      {
        spanish: 'Te lèves-tu tôt?',
        english: 'Do you get up early? (inversion)',
        highlight: ['Te lèves-tu']
      },
      {
        spanish: 'Est-ce que tu te lèves tôt?',
        english: 'Do you get up early? (est-ce que)',
        highlight: ['te lèves']
      },
      {
        spanish: 'Tu te lèves tôt?',
        english: 'You get up early? (intonation)',
        highlight: ['te lèves']
      },
      {
        spanish: 'Comment vous appelez-vous?',
        english: 'What is your name? (literally: How do you call yourself?)',
        highlight: ['vous appelez-vous']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'French Present Tense',
    url: '/grammar/french/verbs/present-tense',
    difficulty: 'beginner'
  },
  {
    title: 'French Passé Composé',
    url: '/grammar/french/verbs/passe-compose',
    difficulty: 'intermediate'
  },
  {
    title: 'French Pronouns',
    url: '/grammar/french/pronouns/reflexive-pronouns',
    difficulty: 'intermediate'
  },
  {
    title: 'Daily Routine Vocabulary',
    url: '/vocabulary/french/daily-routine',
    difficulty: 'beginner'
  }
];

export default function FrenchReflexiveVerbsPage() {
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
              topic: 'reflexive-verbs',
              title: 'French Reflexive Verbs',
              description: 'Master French reflexive verbs (se laver, se lever, s\'habiller) with conjugation patterns and daily routine vocabulary.',
              difficulty: 'intermediate',
              examples: [
                'Je me lave (I wash myself)',
                'Tu te lèves tôt (You get up early)',
                'Elle s\'habille élégamment (She dresses elegantly)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'reflexive-verbs',
              title: 'French Reflexive Verbs'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="reflexive-verbs"
        title="French Reflexive Verbs"
        description="Master French reflexive verbs (se laver, se lever, s'habiller) with conjugation patterns and daily routine vocabulary"
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/reflexive-verbs/practice"
        quizUrl="/grammar/french/verbs/reflexive-verbs/quiz"
        songUrl="/songs/fr?theme=grammar&topic=reflexive-verbs"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
