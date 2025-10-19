import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'irregular-verbs',
  title: 'French Irregular Verbs (Être, Avoir, Aller, Faire, Venir)',
  description: 'Master French irregular verbs including être, avoir, aller, faire, venir. Learn conjugation patterns and usage of high-frequency irregular verbs.',
  difficulty: 'intermediate',
  keywords: [
    'french irregular verbs',
    'être avoir aller faire',
    'french verb conjugation',
    'irregular french verbs',
    'high frequency french verbs',
    'french verb patterns'
  ],
  examples: [
    'être → je suis, tu es, il est',
    'avoir → j\'ai, tu as, il a',
    'aller → je vais, tu vas, il va',
    'faire → je fais, tu fais, il fait'
  ]
});

const sections = [
  {
    title: 'Understanding French Irregular Verbs',
    content: `French irregular verbs don't follow the standard conjugation patterns of regular -er, -ir, and -re verbs. These verbs have **unique conjugation patterns** that must be memorized individually.

The most important irregular verbs are **high-frequency verbs** used constantly in French:
**ÊTRE** (to be) - Most important verb in French
**AVOIR** (to have) - Essential auxiliary verb
**ALLER** (to go) - Movement and future tense
**FAIRE** (to do/make) - Common action verb
**VENIR** (to come) - Movement toward speaker

These five verbs are essential for basic French communication and appear in countless expressions and constructions.`,
    examples: [
      {
        spanish: 'Je suis français. (I am French.) - ÊTRE',
        english: 'Essential for identity and description',
        highlight: ['Je suis français']
      },
      {
        spanish: 'J\'ai vingt ans. (I am twenty years old.) - AVOIR',
        english: 'Essential for possession and age',
        highlight: ['J\'ai vingt ans']
      },
      {
        spanish: 'Je vais au cinéma. (I\'m going to the cinema.) - ALLER',
        english: 'Essential for movement and future',
        highlight: ['Je vais au cinéma']
      }
    ]
  },
  {
    title: 'ÊTRE (to be) - Most Important Verb',
    content: `**ÊTRE** is the most frequently used verb in French. It's used for identity, description, location, and as an auxiliary verb:`,
    conjugationTable: {
      title: 'ÊTRE (to be) - Present Tense',
      conjugations: [
        { pronoun: 'je', form: 'suis', english: 'I am' },
        { pronoun: 'tu', form: 'es', english: 'you are (informal)' },
        { pronoun: 'il/elle/on', form: 'est', english: 'he/she/one is' },
        { pronoun: 'nous', form: 'sommes', english: 'we are' },
        { pronoun: 'vous', form: 'êtes', english: 'you are (formal/plural)' },
        { pronoun: 'ils/elles', form: 'sont', english: 'they are' }
      ]
    },
    subsections: [
      {
        title: 'Uses of ÊTRE',
        content: 'Main functions of être in French:',
        examples: [
          {
            spanish: 'Identity: Je suis Marie. (I am Marie.)',
            english: 'Description: Il est grand. (He is tall.)',
            highlight: ['Je suis Marie', 'Il est grand']
          },
          {
            spanish: 'Location: Nous sommes à Paris. (We are in Paris.)',
            english: 'Profession: Elle est médecin. (She is a doctor.)',
            highlight: ['Nous sommes à Paris', 'Elle est médecin']
          }
        ]
      },
      {
        title: 'ÊTRE as Auxiliary',
        content: 'Être with past participles:',
        examples: [
          {
            spanish: 'Je suis arrivé(e). (I arrived.)',
            english: 'Nous sommes partis. (We left.)',
            highlight: ['suis arrivé(e)', 'sommes partis']
          }
        ]
      }
    ]
  },
  {
    title: 'AVOIR (to have) - Essential Auxiliary',
    content: `**AVOIR** expresses possession and is the most common auxiliary verb for compound tenses:`,
    conjugationTable: {
      title: 'AVOIR (to have) - Present Tense',
      conjugations: [
        { pronoun: 'je', form: 'ai', english: 'I have' },
        { pronoun: 'tu', form: 'as', english: 'you have (informal)' },
        { pronoun: 'il/elle/on', form: 'a', english: 'he/she/one has' },
        { pronoun: 'nous', form: 'avons', english: 'we have' },
        { pronoun: 'vous', form: 'avez', english: 'you have (formal/plural)' },
        { pronoun: 'ils/elles', form: 'ont', english: 'they have' }
      ]
    },
    subsections: [
      {
        title: 'Uses of AVOIR',
        content: 'Main functions of avoir:',
        examples: [
          {
            spanish: 'Possession: J\'ai une voiture. (I have a car.)',
            english: 'Age: Il a trente ans. (He is thirty years old.)',
            highlight: ['J\'ai une voiture', 'Il a trente ans']
          }
        ]
      },
      {
        title: 'AVOIR Expressions',
        content: 'Common expressions with avoir:',
        conjugationTable: {
          title: 'AVOIR Expressions',
          conjugations: [
            { pronoun: 'avoir faim', form: 'to be hungry', english: 'J\'ai faim.' },
            { pronoun: 'avoir soif', form: 'to be thirsty', english: 'Tu as soif.' },
            { pronoun: 'avoir peur', form: 'to be afraid', english: 'Il a peur.' },
            { pronoun: 'avoir chaud', form: 'to be hot', english: 'Nous avons chaud.' },
            { pronoun: 'avoir froid', form: 'to be cold', english: 'Vous avez froid.' },
            { pronoun: 'avoir raison', form: 'to be right', english: 'Ils ont raison.' }
          ]
        }
      }
    ]
  },
  {
    title: 'ALLER (to go) - Movement and Future',
    content: `**ALLER** expresses movement and forms the immediate future (futur proche):`,
    conjugationTable: {
      title: 'ALLER (to go) - Present Tense',
      conjugations: [
        { pronoun: 'je', form: 'vais', english: 'I go/am going' },
        { pronoun: 'tu', form: 'vas', english: 'you go/are going (informal)' },
        { pronoun: 'il/elle/on', form: 'va', english: 'he/she/one goes/is going' },
        { pronoun: 'nous', form: 'allons', english: 'we go/are going' },
        { pronoun: 'vous', form: 'allez', english: 'you go/are going (formal/plural)' },
        { pronoun: 'ils/elles', form: 'vont', english: 'they go/are going' }
      ]
    },
    subsections: [
      {
        title: 'ALLER for Movement',
        content: 'Using aller for going places:',
        examples: [
          {
            spanish: 'Je vais à l\'école. (I\'m going to school.)',
            english: 'Nous allons en France. (We\'re going to France.)',
            highlight: ['Je vais à l\'école', 'Nous allons en France']
          }
        ]
      },
      {
        title: 'Immediate Future with ALLER',
        content: 'Aller + infinitive = immediate future:',
        examples: [
          {
            spanish: 'Je vais manger. (I\'m going to eat.)',
            english: 'Il va partir. (He\'s going to leave.)',
            highlight: ['Je vais manger', 'Il va partir']
          }
        ]
      }
    ]
  },
  {
    title: 'FAIRE (to do/make) - Versatile Action Verb',
    content: `**FAIRE** is used for actions, activities, and weather expressions:`,
    conjugationTable: {
      title: 'FAIRE (to do/make) - Present Tense',
      conjugations: [
        { pronoun: 'je', form: 'fais', english: 'I do/make' },
        { pronoun: 'tu', form: 'fais', english: 'you do/make (informal)' },
        { pronoun: 'il/elle/on', form: 'fait', english: 'he/she/one does/makes' },
        { pronoun: 'nous', form: 'faisons', english: 'we do/make' },
        { pronoun: 'vous', form: 'faites', english: 'you do/make (formal/plural)' },
        { pronoun: 'ils/elles', form: 'font', english: 'they do/make' }
      ]
    },
    subsections: [
      {
        title: 'FAIRE Activities',
        content: 'Common activities with faire:',
        examples: [
          {
            spanish: 'faire du sport (to do sports)',
            english: 'faire les courses (to do shopping)',
            highlight: ['faire du sport', 'faire les courses']
          },
          {
            spanish: 'faire la cuisine (to cook)',
            english: 'faire ses devoirs (to do homework)',
            highlight: ['faire la cuisine', 'faire ses devoirs']
          }
        ]
      },
      {
        title: 'FAIRE Weather Expressions',
        content: 'Weather with faire:',
        examples: [
          {
            spanish: 'Il fait beau. (It\'s nice weather.)',
            english: 'Il fait froid. (It\'s cold.)',
            highlight: ['Il fait beau', 'Il fait froid']
          }
        ]
      }
    ]
  },
  {
    title: 'VENIR (to come) - Movement Toward Speaker',
    content: `**VENIR** expresses movement toward the speaker and recent past:`,
    conjugationTable: {
      title: 'VENIR (to come) - Present Tense',
      conjugations: [
        { pronoun: 'je', form: 'viens', english: 'I come/am coming' },
        { pronoun: 'tu', form: 'viens', english: 'you come/are coming (informal)' },
        { pronoun: 'il/elle/on', form: 'vient', english: 'he/she/one comes/is coming' },
        { pronoun: 'nous', form: 'venons', english: 'we come/are coming' },
        { pronoun: 'vous', form: 'venez', english: 'you come/are coming (formal/plural)' },
        { pronoun: 'ils/elles', form: 'viennent', english: 'they come/are coming' }
      ]
    },
    subsections: [
      {
        title: 'VENIR for Movement',
        content: 'Using venir for coming:',
        examples: [
          {
            spanish: 'Je viens de Paris. (I come from Paris.)',
            english: 'Il vient chez moi. (He\'s coming to my place.)',
            highlight: ['Je viens de Paris', 'Il vient chez moi']
          }
        ]
      },
      {
        title: 'Recent Past with VENIR DE',
        content: 'Venir de + infinitive = just did something:',
        examples: [
          {
            spanish: 'Je viens de manger. (I just ate.)',
            english: 'Elle vient d\'arriver. (She just arrived.)',
            highlight: ['Je viens de manger', 'Elle vient d\'arriver']
          }
        ]
      }
    ]
  },
  {
    title: 'Other Important Irregular Verbs',
    content: `Additional high-frequency irregular verbs:`,
    subsections: [
      {
        title: 'POUVOIR (can/to be able)',
        content: 'Modal verb for ability and permission:',
        conjugationTable: {
          title: 'POUVOIR - Present Tense',
          conjugations: [
            { pronoun: 'je', form: 'peux', english: 'I can' },
            { pronoun: 'tu', form: 'peux', english: 'you can' },
            { pronoun: 'il/elle/on', form: 'peut', english: 'he/she/one can' },
            { pronoun: 'nous', form: 'pouvons', english: 'we can' },
            { pronoun: 'vous', form: 'pouvez', english: 'you can' },
            { pronoun: 'ils/elles', form: 'peuvent', english: 'they can' }
          ]
        }
      },
      {
        title: 'VOULOIR (to want)',
        content: 'Modal verb for desire and polite requests:',
        examples: [
          {
            spanish: 'je veux, tu veux, il veut',
            english: 'nous voulons, vous voulez, ils veulent',
            highlight: ['veux', 'veut', 'voulons', 'voulez', 'veulent']
          }
        ]
      },
      {
        title: 'SAVOIR (to know)',
        content: 'Knowledge and skills:',
        examples: [
          {
            spanish: 'je sais, tu sais, il sait',
            english: 'nous savons, vous savez, ils savent',
            highlight: ['sais', 'sait', 'savons', 'savez', 'savent']
          }
        ]
      }
    ]
  },
  {
    title: 'Memory Strategies',
    content: `Tips for memorizing irregular verb conjugations:`,
    subsections: [
      {
        title: 'Grouping Similar Patterns',
        content: 'Some irregular verbs share patterns:',
        examples: [
          {
            spanish: 'VENIR family: venir, tenir, devenir',
            english: 'POUVOIR family: pouvoir, vouloir',
            highlight: ['venir', 'tenir', 'pouvoir', 'vouloir']
          }
        ]
      },
      {
        title: 'Practice Techniques',
        content: 'Effective memorization methods:',
        examples: [
          {
            spanish: '1. Daily conjugation practice',
            english: '2. Use verbs in context sentences',
            highlight: ['Daily practice', 'Context sentences']
          },
          {
            spanish: '3. Create flashcards for each verb',
            english: '4. Practice with native speaker audio',
            highlight: ['Flashcards', 'Native audio']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Irregular Verb Mistakes',
    content: `Here are frequent errors students make:

**1. Mixing regular and irregular patterns**: Using regular endings on irregular verbs
**2. Confusing similar verbs**: Mixing up être and avoir uses
**3. Wrong auxiliary choice**: Using avoir instead of être
**4. Forgetting liaison**: Not connecting sounds in speech`,
    examples: [
      {
        spanish: '❌ je suis avoir → ✅ j\'ai (I have)',
        english: 'Wrong: don\'t mix être and avoir',
        highlight: ['j\'ai']
      },
      {
        spanish: '❌ il a allé → ✅ il est allé (he went)',
        english: 'Wrong: aller uses être as auxiliary',
        highlight: ['il est allé']
      },
      {
        spanish: '❌ nous faisons [fay-sons] → ✅ nous faisons [fuh-zon]',
        english: 'Wrong: pronunciation of faisons',
        highlight: ['nous faisons']
      },
      {
        spanish: '❌ je vais à manger → ✅ je vais manger',
        english: 'Wrong: no preposition needed with infinitive',
        highlight: ['je vais manger']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Regular Verb Conjugation', url: '/grammar/french/verbs/regular-conjugation', difficulty: 'beginner' },
  { title: 'French Present Tense', url: '/grammar/french/verbs/present-tense', difficulty: 'beginner' },
  { title: 'French Auxiliary Verbs', url: '/grammar/french/verbs/auxiliary-verbs', difficulty: 'intermediate' },
  { title: 'French Modal Verbs', url: '/grammar/french/verbs/modal-verbs', difficulty: 'intermediate' }
];

export default function FrenchIrregularVerbsPage() {
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
              topic: 'irregular-verbs',
              title: 'French Irregular Verbs (Être, Avoir, Aller, Faire, Venir)',
              description: 'Master French irregular verbs including être, avoir, aller, faire, venir. Learn conjugation patterns and usage of high-frequency irregular verbs.',
              difficulty: 'intermediate',
              examples: [
                'être → je suis, tu es, il est',
                'avoir → j\'ai, tu as, il a',
                'aller → je vais, tu vas, il va',
                'faire → je fais, tu fais, il fait'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'irregular-verbs',
              title: 'French Irregular Verbs (Être, Avoir, Aller, Faire, Venir)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="irregular-verbs"
        title="French Irregular Verbs (Être, Avoir, Aller, Faire, Venir)"
        description="Master French irregular verbs including être, avoir, aller, faire, venir. Learn conjugation patterns and usage of high-frequency irregular verbs"
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/irregular-verbs/practice"
        quizUrl="/grammar/french/verbs/irregular-verbs/quiz"
        songUrl="/songs/fr?theme=grammar&topic=irregular-verbs"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
