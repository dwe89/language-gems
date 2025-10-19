import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'pronouns',
  topic: 'reflexive',
  title: 'French Reflexive Pronouns - Me, Te, Se, Nous, Vous',
  description: 'Master French reflexive pronouns including placement, agreement, and usage with reflexive verbs.',
  difficulty: 'intermediate',
  keywords: [
    'french reflexive pronouns',
    'me te se french',
    'french reflexive verbs',
    'se laver french',
    'french pronominal verbs'
  ],
  examples: [
    'Je me lave. (I wash myself.)',
    'Elle se réveille tôt. (She wakes up early.)',
    'Nous nous amusons. (We have fun.)',
    'Ils se parlent souvent. (They talk to each other often.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Reflexive Pronouns',
    content: `French **reflexive pronouns** (pronoms réfléchis) are used with **reflexive verbs** where the subject performs an action **on itself**. They are essential for expressing daily activities and reciprocal actions.

**Complete set of reflexive pronouns:**
- **me** (myself)
- **te** (yourself - informal)
- **se** (himself/herself/itself/yourself formal)
- **nous** (ourselves)
- **vous** (yourselves/yourself formal)
- **se** (themselves)

**Key features:**
- **Placement**: Before the conjugated verb
- **Agreement**: Past participle agreement in compound tenses
- **Elision**: Me/te become m'/t' before vowels
- **Reciprocal meaning**: Can express "each other"

**Why reflexive pronouns matter:**
- **Daily activities**: Essential for routine actions
- **Natural French**: Required for fluent expression
- **Verb system**: Many verbs are inherently reflexive
- **Reciprocal actions**: Express mutual actions

Understanding reflexive pronouns is **crucial** for **intermediate French proficiency**.`,
    examples: [
      {
        spanish: 'REFLEXIVE: Je me lave les mains. (I wash my hands.)',
        english: 'RECIPROCAL: Ils se parlent. (They talk to each other.)',
        highlight: ['me lave', 'se parlent']
      },
      {
        spanish: 'DAILY ROUTINE: Elle se lève à 7h. (She gets up at 7am.)',
        english: 'COMPOUND: Nous nous sommes amusés. (We had fun.)',
        highlight: ['se lève', 'nous sommes amusés']
      }
    ]
  },
  {
    title: 'Forms of Reflexive Pronouns',
    content: `**Complete paradigm** of French reflexive pronouns:`,
    conjugationTable: {
      title: 'Reflexive Pronoun Forms',
      conjugations: [
        { pronoun: 'je', form: 'me', english: 'Je me lave. (I wash myself.)' },
        { pronoun: 'tu', form: 'te', english: 'Tu te laves. (You wash yourself.)' },
        { pronoun: 'il/elle/on', form: 'se', english: 'Il se lave. (He washes himself.)' },
        { pronoun: 'nous', form: 'nous', english: 'Nous nous lavons. (We wash ourselves.)' },
        { pronoun: 'vous', form: 'vous', english: 'Vous vous lavez. (You wash yourselves.)' },
        { pronoun: 'ils/elles', form: 'se', english: 'Ils se lavent. (They wash themselves.)' }
      ]
    },
    examples: [
      {
        spanish: 'SINGULAR: Je me réveille, tu te réveilles, il se réveille',
        english: 'PLURAL: Nous nous réveillons, vous vous réveillez, ils se réveillent',
        highlight: ['me réveille', 'nous réveillons']
      }
    ]
  },
  {
    title: 'Placement of Reflexive Pronouns',
    content: `**Reflexive pronouns** go **before the conjugated verb**:`,
    examples: [
      {
        spanish: 'PRESENT: Je me lève tôt. (I get up early.)',
        english: 'NEGATIVE: Je ne me lève pas tôt. (I don\'t get up early.)',
        highlight: ['me lève', 'ne me lève pas']
      },
      {
        spanish: 'QUESTION: Te lèves-tu tôt ? (Do you get up early?)',
        english: 'COMPOUND: Je me suis levé(e) tôt. (I got up early.)',
        highlight: ['Te lèves-tu', 'me suis levé']
      }
    ],
    subsections: [
      {
        title: 'With Infinitives',
        content: 'With infinitive constructions, reflexive pronoun goes before infinitive:',
        examples: [
          {
            spanish: 'INFINITIVE: Je vais me lever. (I\'m going to get up.)',
            english: 'MODAL: Je dois me dépêcher. (I must hurry.)',
            highlight: ['me lever', 'me dépêcher']
          }
        ]
      }
    ]
  },
  {
    title: 'Elision with Reflexive Pronouns',
    content: `**Me** and **te** become **m\'** and **t\'** before vowels:`,
    conjugationTable: {
      title: 'Elision Rules',
      conjugations: [
        { pronoun: 'me + vowel', form: "m'", english: "Je m'habille. (I get dressed.)" },
        { pronoun: 'te + vowel', form: "t'", english: "Tu t'habilles. (You get dressed.)" },
        { pronoun: 'se + vowel', form: "s'", english: "Il s'habille. (He gets dressed.)" },
        { pronoun: 'nous/vous', form: 'no elision', english: 'Nous nous habillons. (We get dressed.)' }
      ]
    },
    examples: [
      {
        spanish: 'ELISION: Je m\'amuse beaucoup. (I have a lot of fun.)',
        english: 'ELISION: Elle s\'appelle Marie. (Her name is Marie.)',
        highlight: ["m'amuse", "s'appelle"]
      },
      {
        spanish: 'NO ELISION: Nous nous amusons. (We have fun.)',
        english: 'NO ELISION: Vous vous appelez comment ? (What are your names?)',
        highlight: ['nous amusons', 'vous appelez']
      }
    ]
  },
  {
    title: 'Common Reflexive Verbs',
    content: `**Essential reflexive verbs** for daily activities:`,
    conjugationTable: {
      title: 'Daily Routine Verbs',
      conjugations: [
        { pronoun: 'se lever', form: 'to get up', english: 'Je me lève à 7h. (I get up at 7am.)' },
        { pronoun: 'se laver', form: 'to wash oneself', english: 'Il se lave les mains. (He washes his hands.)' },
        { pronoun: 'se brosser', form: 'to brush', english: 'Elle se brosse les dents. (She brushes her teeth.)' },
        { pronoun: 'se habiller', form: 'to get dressed', english: 'Nous nous habillons. (We get dressed.)' },
        { pronoun: 'se coucher', form: 'to go to bed', english: 'Ils se couchent tard. (They go to bed late.)' },
        { pronoun: 'se réveiller', form: 'to wake up', english: 'Je me réveille tôt. (I wake up early.)' }
      ]
    },
    examples: [
      {
        spanish: 'MORNING: Je me réveille, me lève et me lave.',
        english: 'EVENING: Je me brosse les dents et me couche.',
        highlight: ['me réveille', 'me couche']
      }
    ]
  },
  {
    title: 'Reflexive Verbs of Emotion and State',
    content: `**Reflexive verbs** expressing emotions and states:`,
    conjugationTable: {
      title: 'Emotion and State Verbs',
      conjugations: [
        { pronoun: 'se sentir', form: 'to feel', english: 'Je me sens bien. (I feel good.)' },
        { pronoun: 'se fâcher', form: 'to get angry', english: 'Il se fâche facilement. (He gets angry easily.)' },
        { pronoun: 'se dépêcher', form: 'to hurry', english: 'Nous nous dépêchons. (We hurry.)' },
        { pronoun: 'se reposer', form: 'to rest', english: 'Elle se repose. (She rests.)' },
        { pronoun: 'se tromper', form: 'to make a mistake', english: 'Tu te trompes. (You\'re wrong.)' },
        { pronoun: 's\'inquiéter', form: 'to worry', english: 'Je m\'inquiète pour toi. (I worry about you.)' }
      ]
    },
    examples: [
      {
        spanish: 'EMOTION: Elle se sent triste aujourd\'hui. (She feels sad today.)',
        english: 'STATE: Nous nous reposons après le travail. (We rest after work.)',
        highlight: ['se sent', 'nous reposons']
      }
    ]
  },
  {
    title: 'Reciprocal Meaning',
    content: `**Reflexive pronouns** can express **reciprocal actions** (each other):`,
    examples: [
      {
        spanish: 'TALK: Ils se parlent souvent. (They talk to each other often.)',
        english: 'MEET: Nous nous rencontrons au café. (We meet each other at the café.)',
        highlight: ['se parlent', 'nous rencontrons']
      },
      {
        spanish: 'LOVE: Ils s\'aiment beaucoup. (They love each other a lot.)',
        english: 'WRITE: Elles se téléphonent chaque jour. (They call each other every day.)',
        highlight: ["s'aiment", 'se téléphonent']
      },
      {
        spanish: 'HELP: Nous nous aidons mutuellement. (We help each other.)',
        english: 'SEE: Vous vous voyez souvent ? (Do you see each other often?)',
        highlight: ['nous aidons', 'vous voyez']
      }
    ]
  },
  {
    title: 'Past Participle Agreement',
    content: `In **compound tenses**, past participle **agrees** with the subject:`,
    conjugationTable: {
      title: 'Past Participle Agreement',
      conjugations: [
        { pronoun: 'je (m)', form: 'me suis levé', english: 'I got up (masculine)' },
        { pronoun: 'je (f)', form: 'me suis levée', english: 'I got up (feminine)' },
        { pronoun: 'nous (m)', form: 'nous sommes levés', english: 'We got up (masculine)' },
        { pronoun: 'elles', form: 'se sont levées', english: 'They got up (feminine)' }
      ]
    },
    examples: [
      {
        spanish: 'MASCULINE: Il s\'est lavé. (He washed himself.)',
        english: 'FEMININE: Elle s\'est lavée. (She washed herself.)',
        highlight: ["s'est lavé", "s'est lavée"]
      },
      {
        spanish: 'PLURAL M: Ils se sont amusés. (They had fun.)',
        english: 'PLURAL F: Elles se sont amusées. (They had fun.)',
        highlight: ['se sont amusés', 'se sont amusées']
      }
    ]
  },
  {
    title: 'Reflexive Pronouns in Imperative',
    content: `In **positive commands**, reflexive pronouns come **after** the verb:`,
    conjugationTable: {
      title: 'Imperative Forms',
      conjugations: [
        { pronoun: 'Positive', form: 'Lève-toi !', english: 'Get up!' },
        { pronoun: 'Negative', form: 'Ne te lève pas !', english: 'Don\'t get up!' },
        { pronoun: 'Positive plural', form: 'Levez-vous !', english: 'Get up! (plural)' },
        { pronoun: 'Negative plural', form: 'Ne vous levez pas !', english: 'Don\'t get up! (plural)' }
      ]
    },
    examples: [
      {
        spanish: 'POSITIVE: Dépêche-toi ! (Hurry up!)',
        english: 'NEGATIVE: Ne te dépêche pas ! (Don\'t hurry!)',
        highlight: ['Dépêche-toi', 'Ne te dépêche pas']
      },
      {
        spanish: 'FORMAL: Asseyez-vous ! (Sit down!)',
        english: 'NEGATIVE: Ne vous asseyez pas ! (Don\'t sit down!)',
        highlight: ['Asseyez-vous', 'Ne vous asseyez pas']
      }
    ]
  },
  {
    title: 'Reflexive vs Non-Reflexive',
    content: `**Same verbs** can be reflexive or non-reflexive with **different meanings**:`,
    conjugationTable: {
      title: 'Reflexive vs Non-Reflexive',
      conjugations: [
        { pronoun: 'laver', form: 'to wash (something)', english: 'Je lave la voiture. (I wash the car.)' },
        { pronoun: 'se laver', form: 'to wash oneself', english: 'Je me lave. (I wash myself.)' },
        { pronoun: 'appeler', form: 'to call (someone)', english: 'J\'appelle Marie. (I call Marie.)' },
        { pronoun: 's\'appeler', form: 'to be called', english: 'Je m\'appelle Paul. (My name is Paul.)' }
      ]
    },
    examples: [
      {
        spanish: 'NON-REFLEXIVE: Elle lave ses cheveux. (She washes her hair.)',
        english: 'REFLEXIVE: Elle se lave les cheveux. (She washes her hair.)',
        highlight: ['lave ses cheveux', 'se lave les cheveux']
      },
      {
        spanish: 'NON-REFLEXIVE: Je réveille mon frère. (I wake up my brother.)',
        english: 'REFLEXIVE: Je me réveille tôt. (I wake up early.)',
        highlight: ['réveille mon frère', 'me réveille']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong placement**: Placing reflexive pronoun after verb
**2. Missing elision**: Not eliding me/te before vowels
**3. Agreement errors**: Wrong past participle agreement
**4. Imperative confusion**: Wrong pronoun placement in commands`,
    examples: [
      {
        spanish: '❌ Je lève me → ✅ Je me lève',
        english: 'Wrong: reflexive pronoun must come before verb',
        highlight: ['Je me lève']
      },
      {
        spanish: '❌ Je me appelle → ✅ Je m\'appelle',
        english: 'Wrong: must elide me before vowel',
        highlight: ["Je m'appelle"]
      },
      {
        spanish: '❌ Elle s\'est lavé → ✅ Elle s\'est lavée',
        english: 'Wrong: past participle must agree with feminine subject',
        highlight: ["s'est lavée"]
      },
      {
        spanish: '❌ Te lève ! → ✅ Lève-toi !',
        english: 'Wrong: in positive imperative, pronoun comes after verb',
        highlight: ['Lève-toi']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Present Tense', url: '/grammar/french/verbs/present-tense', difficulty: 'beginner' },
  { title: 'French Past Participle Agreement', url: '/grammar/french/verbs/past-participle-agreement', difficulty: 'intermediate' },
  { title: 'French Imperative', url: '/grammar/french/verbs/imperative', difficulty: 'intermediate' },
  { title: 'French Object Pronouns', url: '/grammar/french/pronouns/object-pronouns', difficulty: 'intermediate' }
];

export default function FrenchReflexivePronounsPage() {
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
              topic: 'reflexive',
              title: 'French Reflexive Pronouns - Me, Te, Se, Nous, Vous',
              description: 'Master French reflexive pronouns including placement, agreement, and usage with reflexive verbs.',
              difficulty: 'intermediate',
              examples: [
                'Je me lave. (I wash myself.)',
                'Elle se réveille tôt. (She wakes up early.)',
                'Nous nous amusons. (We have fun.)',
                'Ils se parlent souvent. (They talk to each other often.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'pronouns',
              topic: 'reflexive',
              title: 'French Reflexive Pronouns - Me, Te, Se, Nous, Vous'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="pronouns"
        topic="reflexive"
        title="French Reflexive Pronouns - Me, Te, Se, Nous, Vous"
        description="Master French reflexive pronouns including placement, agreement, and usage with reflexive verbs"
        difficulty="intermediate"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/french/pronouns"
        practiceUrl="/grammar/french/pronouns/reflexive/practice"
        quizUrl="/grammar/french/pronouns/reflexive/quiz"
        songUrl="/songs/fr?theme=grammar&topic=reflexive"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
