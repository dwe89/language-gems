import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'future',
  title: 'French Future Tense',
  description: 'Master French future tense (futur simple) conjugations and usage. Complete guide with regular and irregular verbs.',
  difficulty: 'intermediate',
  keywords: [
    'french future tense',
    'futur simple français',
    'french future conjugation',
    'will in french',
    'french grammar future',
    'irregular future french',
    'futur proche vs futur simple'
  ],
  examples: [
    'Je parlerai français (I will speak French)',
    'Elle viendra demain (She will come tomorrow)',
    'Nous finirons bientôt (We will finish soon)'
  ]
});

const sections = [
  {
    title: 'French Future Tense Overview',
    content: `The French future tense (**futur simple**) expresses actions that will happen in the future. It's equivalent to "will + verb" in English and is used for planned actions, predictions, and promises.

French also has the **futur proche** (near future: aller + infinitive), but the futur simple is more formal and used for more distant or definite future actions.`,
    examples: [
      {
        spanish: 'Je parlerai avec le directeur demain.',
        english: 'I will speak with the director tomorrow.',
        highlight: ['parlerai']
      },
      {
        spanish: 'Il pleuvra ce week-end.',
        english: 'It will rain this weekend.',
        highlight: ['pleuvra']
      },
      {
        spanish: 'Nous finirons le projet la semaine prochaine.',
        english: 'We will finish the project next week.',
        highlight: ['finirons']
      }
    ]
  },
  {
    title: 'Future Tense Formation',
    content: `The French future tense is formed by adding future endings to the **infinitive** of the verb. For -re verbs, drop the final -e before adding endings.

**Formula**: Infinitive (or stem) + future endings
**-ER/-IR verbs**: Keep full infinitive + endings
**-RE verbs**: Drop final -e + endings`,
    subsections: [
      {
        title: 'Future Tense Endings',
        content: `All French verbs use the same future endings:`,
        conjugationTable: {
          title: 'Future Tense Endings (All Verbs)',
          conjugations: [
            { pronoun: 'je', form: '-ai', english: 'I will' },
            { pronoun: 'tu', form: '-as', english: 'you will' },
            { pronoun: 'il/elle/on', form: '-a', english: 'he/she/one will' },
            { pronoun: 'nous', form: '-ons', english: 'we will' },
            { pronoun: 'vous', form: '-ez', english: 'you will' },
            { pronoun: 'ils/elles', form: '-ont', english: 'they will' }
          ]
        },
        examples: [
          {
            spanish: 'parler → je parlerai, tu parleras, il parlera...',
            english: 'to speak → I will speak, you will speak, he will speak...',
            highlight: ['parlerai', 'parleras', 'parlera']
          }
        ]
      },
      {
        title: 'Regular Verb Examples',
        content: `Here are examples for each verb group:`,
        conjugationTable: {
          title: 'Parler (to speak) - Future Tense',
          conjugations: [
            { pronoun: 'je', form: 'parlerai', english: 'I will speak' },
            { pronoun: 'tu', form: 'parleras', english: 'you will speak' },
            { pronoun: 'il/elle/on', form: 'parlera', english: 'he/she/one will speak' },
            { pronoun: 'nous', form: 'parlerons', english: 'we will speak' },
            { pronoun: 'vous', form: 'parlerez', english: 'you will speak' },
            { pronoun: 'ils/elles', form: 'parleront', english: 'they will speak' }
          ]
        },
        examples: [
          {
            spanish: 'Je finirai mes devoirs ce soir.',
            english: 'I will finish my homework tonight. (finir)',
            highlight: ['finirai']
          },
          {
            spanish: 'Nous vendrons notre maison.',
            english: 'We will sell our house. (vendre → vendr-)',
            highlight: ['vendrons']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Future Stems',
    content: `Some common verbs have irregular future stems that must be memorized. However, they still use the regular future endings.`,
    subsections: [
      {
        title: 'Common Irregular Future Stems',
        content: `These verbs have irregular stems in the future tense:`,
        conjugationTable: {
          title: 'Irregular Future Stems',
          conjugations: [
            { pronoun: 'être (to be)', form: 'ser-', english: 'je serai, tu seras...' },
            { pronoun: 'avoir (to have)', form: 'aur-', english: 'j\'aurai, tu auras...' },
            { pronoun: 'aller (to go)', form: 'ir-', english: 'j\'irai, tu iras...' },
            { pronoun: 'faire (to do/make)', form: 'fer-', english: 'je ferai, tu feras...' },
            { pronoun: 'voir (to see)', form: 'verr-', english: 'je verrai, tu verras...' },
            { pronoun: 'venir (to come)', form: 'viendr-', english: 'je viendrai, tu viendras...' }
          ]
        },
        examples: [
          {
            spanish: 'Je serai médecin un jour.',
            english: 'I will be a doctor one day.',
            highlight: ['serai']
          },
          {
            spanish: 'Tu auras de bonnes notes.',
            english: 'You will have good grades.',
            highlight: ['auras']
          },
          {
            spanish: 'Nous irons en vacances cet été.',
            english: 'We will go on vacation this summer.',
            highlight: ['irons']
          }
        ]
      },
      {
        title: 'More Irregular Stems',
        content: `Additional irregular future stems to memorize:`,
        conjugationTable: {
          title: 'More Irregular Future Stems',
          conjugations: [
            { pronoun: 'pouvoir (can)', form: 'pourr-', english: 'je pourrai (I will be able)' },
            { pronoun: 'vouloir (to want)', form: 'voudr-', english: 'je voudrai (I will want)' },
            { pronoun: 'savoir (to know)', form: 'saur-', english: 'je saurai (I will know)' },
            { pronoun: 'devoir (must)', form: 'devr-', english: 'je devrai (I will have to)' },
            { pronoun: 'recevoir (to receive)', form: 'recevr-', english: 'je recevrai (I will receive)' },
            { pronoun: 'envoyer (to send)', form: 'enverr-', english: 'j\'enverrai (I will send)' }
          ]
        },
        examples: [
          {
            spanish: 'Elle pourra venir avec nous.',
            english: 'She will be able to come with us.',
            highlight: ['pourra']
          },
          {
            spanish: 'Je devrai étudier plus.',
            english: 'I will have to study more.',
            highlight: ['devrai']
          },
          {
            spanish: 'Vous recevrez une réponse bientôt.',
            english: 'You will receive an answer soon.',
            highlight: ['recevrez']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses of the Future Tense',
    content: `The French future tense is used in several contexts:

**1. Future actions**: Planned or predicted events
**2. Promises**: Commitments and assurances  
**3. Suppositions**: Assumptions about the present
**4. Commands**: Polite orders or instructions
**5. After certain conjunctions**: quand, lorsque, dès que, aussitôt que`,
    examples: [
      {
        spanish: 'Je partirai à huit heures.',
        english: 'I will leave at eight o\'clock. (planned action)',
        highlight: ['partirai']
      },
      {
        spanish: 'Je t\'aiderai, c\'est promis.',
        english: 'I will help you, I promise. (promise)',
        highlight: ['aiderai']
      },
      {
        spanish: 'Il sera probablement en retard.',
        english: 'He will probably be late. (supposition)',
        highlight: ['sera']
      },
      {
        spanish: 'Tu feras tes devoirs avant de sortir.',
        english: 'You will do your homework before going out. (command)',
        highlight: ['feras']
      },
      {
        spanish: 'Quand tu arriveras, nous mangerons.',
        english: 'When you arrive, we will eat. (after quand)',
        highlight: ['arriveras', 'mangerons']
      }
    ]
  },
  {
    title: 'Future vs Futur Proche',
    content: `French has two ways to express the future:

**Futur Simple** (will + verb): More formal, distant future, definite plans
**Futur Proche** (going to + verb): Immediate future, informal, near certainty

Both are correct, but the choice depends on context and formality level.`,
    examples: [
      {
        spanish: 'Je parlerai français couramment un jour.',
        english: 'I will speak French fluently one day. (distant future)',
        highlight: ['parlerai']
      },
      {
        spanish: 'Je vais parler avec lui maintenant.',
        english: 'I\'m going to speak with him now. (immediate)',
        highlight: ['vais parler']
      },
      {
        spanish: 'Il pleuvra demain selon la météo.',
        english: 'It will rain tomorrow according to the weather. (prediction)',
        highlight: ['pleuvra']
      },
      {
        spanish: 'Il va pleuvoir, regarde ces nuages!',
        english: 'It\'s going to rain, look at those clouds! (immediate certainty)',
        highlight: ['va pleuvoir']
      }
    ]
  },
  {
    title: 'Time Expressions with Future',
    content: `Common time expressions used with the future tense:

**Near future**: demain, ce soir, la semaine prochaine, bientôt
**Distant future**: un jour, dans l'avenir, plus tard, dans dix ans
**Conditional time**: quand, lorsque, dès que, aussitôt que

These expressions help indicate when to use the future tense.`,
    examples: [
      {
        spanish: 'Demain, je commencerai un nouveau travail.',
        english: 'Tomorrow, I will start a new job.',
        highlight: ['commencerai']
      },
      {
        spanish: 'Dans dix ans, nous habiterons peut-être à l\'étranger.',
        english: 'In ten years, we will perhaps live abroad.',
        highlight: ['habiterons']
      },
      {
        spanish: 'Dès que j\'aurai de l\'argent, j\'achèterai une voiture.',
        english: 'As soon as I have money, I will buy a car.',
        highlight: ['aurai', 'achèterai']
      },
      {
        spanish: 'Un jour, tu comprendras.',
        english: 'One day, you will understand.',
        highlight: ['comprendras']
      }
    ]
  },
  {
    title: 'Future in Conditional Sentences',
    content: `In French, when the main clause is in the future, the subordinate clause after **si** (if) uses the **present tense**, not the future.

**Pattern**: Si + present, future
**English**: If + present, will + verb

This is different from English, where "will" can appear in both clauses.`,
    examples: [
      {
        spanish: 'Si tu étudies, tu réussiras.',
        english: 'If you study, you will succeed.',
        highlight: ['étudies', 'réussiras']
      },
      {
        spanish: 'Si il fait beau, nous irons à la plage.',
        english: 'If the weather is nice, we will go to the beach.',
        highlight: ['fait', 'irons']
      },
      {
        spanish: 'Si elle vient, je serai très content.',
        english: 'If she comes, I will be very happy.',
        highlight: ['vient', 'serai']
      },
      {
        spanish: '❌ Si tu viendras... ✅ Si tu viens, je viendrai.',
        english: '❌ If you will come... ✅ If you come, I will come.',
        highlight: ['viendras', 'viens', 'viendrai']
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
    title: 'French Conditional',
    url: '/grammar/french/verbs/conditional',
    difficulty: 'advanced'
  },
  {
    title: 'French Passé Composé',
    url: '/grammar/french/verbs/passe-compose',
    difficulty: 'intermediate'
  },
  {
    title: 'French Subjunctive',
    url: '/grammar/french/verbs/subjunctive',
    difficulty: 'advanced'
  }
];

export default function FrenchFuturePage() {
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
              topic: 'future',
              title: 'French Future Tense',
              description: 'Master French future tense (futur simple) conjugations and usage. Complete guide with regular and irregular verbs.',
              difficulty: 'intermediate',
              examples: [
                'Je parlerai français (I will speak French)',
                'Elle viendra demain (She will come tomorrow)',
                'Nous finirons bientôt (We will finish soon)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'future',
              title: 'French Future Tense'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="future"
        title="French Future Tense"
        description="Master French future tense (futur simple) conjugations and usage. Complete guide with regular and irregular verbs"
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/future/practice"
        quizUrl="/grammar/french/verbs/future/quiz"
        songUrl="/songs/fr?theme=grammar&topic=future"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
