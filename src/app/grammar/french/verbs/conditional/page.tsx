import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'conditional',
  title: 'French Conditional Mood',
  description: 'Master French conditional mood for polite requests, hypothetical situations, and expressing wishes. Complete conjugation guide.',
  difficulty: 'advanced',
  keywords: [
    'french conditional',
    'conditionnel français',
    'french conditional mood',
    'polite requests french',
    'hypothetical french',
    'would in french',
    'french grammar conditional'
  ],
  examples: [
    'Je voudrais un café (I would like a coffee)',
    'Si j\'étais riche, je voyagerais (If I were rich, I would travel)',
    'Pourriez-vous m\'aider? (Could you help me?)'
  ]
});

const sections = [
  {
    title: 'French Conditional Mood Overview',
    content: `The French conditional mood (**conditionnel**) expresses actions that would happen under certain conditions. It's equivalent to "would + verb" in English and is essential for polite requests, hypothetical situations, and expressing wishes or suggestions.

The conditional is formed using the same stems as the future tense, but with different endings (similar to imparfait endings).`,
    examples: [
      {
        spanish: 'Je voudrais un café, s\'il vous plaît.',
        english: 'I would like a coffee, please. (polite request)',
        highlight: ['voudrais']
      },
      {
        spanish: 'Si j\'avais de l\'argent, j\'achèterais une voiture.',
        english: 'If I had money, I would buy a car. (hypothetical)',
        highlight: ['achèterais']
      },
      {
        spanish: 'Tu devrais étudier plus.',
        english: 'You should study more. (suggestion)',
        highlight: ['devrais']
      }
    ]
  },
  {
    title: 'Conditional Formation',
    content: `The conditional is formed by taking the **future stem** and adding **imparfait endings**:

**Formula**: Future stem + imparfait endings
**Regular verbs**: Use infinitive as stem (drop -e for -re verbs)
**Irregular verbs**: Use the same irregular stems as the future tense`,
    subsections: [
      {
        title: 'Conditional Endings',
        content: `All verbs use the same conditional endings (same as imparfait):`,
        conjugationTable: {
          title: 'Conditional Endings (All Verbs)',
          conjugations: [
            { pronoun: 'je', form: '-ais', english: 'I would' },
            { pronoun: 'tu', form: '-ais', english: 'you would' },
            { pronoun: 'il/elle/on', form: '-ait', english: 'he/she/one would' },
            { pronoun: 'nous', form: '-ions', english: 'we would' },
            { pronoun: 'vous', form: '-iez', english: 'you would' },
            { pronoun: 'ils/elles', form: '-aient', english: 'they would' }
          ]
        },
        examples: [
          {
            spanish: 'parler → je parlerais, tu parlerais, il parlerait...',
            english: 'to speak → I would speak, you would speak, he would speak...',
            highlight: ['parlerais', 'parlerait']
          }
        ]
      },
      {
        title: 'Regular Conditional Examples',
        content: `Examples of conditional formation for each verb group:`,
        conjugationTable: {
          title: 'Parler (to speak) - Conditional',
          conjugations: [
            { pronoun: 'je', form: 'parlerais', english: 'I would speak' },
            { pronoun: 'tu', form: 'parlerais', english: 'you would speak' },
            { pronoun: 'il/elle/on', form: 'parlerait', english: 'he/she/one would speak' },
            { pronoun: 'nous', form: 'parlerions', english: 'we would speak' },
            { pronoun: 'vous', form: 'parleriez', english: 'you would speak' },
            { pronoun: 'ils/elles', form: 'parleraient', english: 'they would speak' }
          ]
        },
        examples: [
          {
            spanish: 'Je finirais mes devoirs si j\'avais le temps.',
            english: 'I would finish my homework if I had time. (finir)',
            highlight: ['finirais']
          },
          {
            spanish: 'Nous vendrions notre maison si nécessaire.',
            english: 'We would sell our house if necessary. (vendre)',
            highlight: ['vendrions']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Conditional Stems',
    content: `The conditional uses the **same irregular stems** as the future tense. If you know the future stem, you know the conditional stem.`,
    subsections: [
      {
        title: 'Common Irregular Conditional Verbs',
        content: `These verbs have irregular stems in the conditional:`,
        conjugationTable: {
          title: 'Irregular Conditional Stems',
          conjugations: [
            { pronoun: 'être (to be)', form: 'ser-', english: 'je serais, tu serais...' },
            { pronoun: 'avoir (to have)', form: 'aur-', english: 'j\'aurais, tu aurais...' },
            { pronoun: 'aller (to go)', form: 'ir-', english: 'j\'irais, tu irais...' },
            { pronoun: 'faire (to do)', form: 'fer-', english: 'je ferais, tu ferais...' },
            { pronoun: 'vouloir (to want)', form: 'voudr-', english: 'je voudrais, tu voudrais...' },
            { pronoun: 'pouvoir (can)', form: 'pourr-', english: 'je pourrais, tu pourrais...' }
          ]
        },
        examples: [
          {
            spanish: 'Je serais content de vous aider.',
            english: 'I would be happy to help you.',
            highlight: ['serais']
          },
          {
            spanish: 'Auriez-vous l\'heure, s\'il vous plaît?',
            english: 'Would you have the time, please?',
            highlight: ['Auriez']
          },
          {
            spanish: 'Nous irions au cinéma si tu veux.',
            english: 'We would go to the movies if you want.',
            highlight: ['irions']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses of the Conditional',
    content: `The French conditional has several important uses:

**1. Polite requests**: Making requests more courteous
**2. Hypothetical situations**: What would happen if...
**3. Wishes and desires**: Expressing what you'd like
**4. Suggestions and advice**: Giving recommendations
**5. Reported speech**: Indirect speech in the past
**6. Probability in the past**: What probably happened`,
    examples: [
      {
        spanish: 'Pourriez-vous fermer la fenêtre?',
        english: 'Could you close the window? (polite request)',
        highlight: ['Pourriez']
      },
      {
        spanish: 'Si j\'étais toi, je partirais.',
        english: 'If I were you, I would leave. (hypothetical)',
        highlight: ['partirais']
      },
      {
        spanish: 'J\'aimerais visiter la France.',
        english: 'I would like to visit France. (wish)',
        highlight: ['aimerais']
      },
      {
        spanish: 'Tu devrais te reposer.',
        english: 'You should rest. (advice)',
        highlight: ['devrais']
      },
      {
        spanish: 'Il a dit qu\'il viendrait.',
        english: 'He said he would come. (reported speech)',
        highlight: ['viendrait']
      }
    ]
  },
  {
    title: 'Conditional in Si Clauses',
    content: `The conditional is often used with **si** (if) clauses to express hypothetical situations:

**Pattern**: Si + imparfait, conditional
**English**: If + past tense, would + verb

This structure expresses what would happen if a condition were met.`,
    examples: [
      {
        spanish: 'Si j\'avais de l\'argent, je voyagerais.',
        english: 'If I had money, I would travel.',
        highlight: ['avais', 'voyagerais']
      },
      {
        spanish: 'Si tu étudiais plus, tu réussirais.',
        english: 'If you studied more, you would succeed.',
        highlight: ['étudiais', 'réussirais']
      },
      {
        spanish: 'Si nous habitions à Paris, nous visiterions les musées.',
        english: 'If we lived in Paris, we would visit the museums.',
        highlight: ['habitions', 'visiterions']
      },
      {
        spanish: 'Que ferais-tu si tu gagnais à la loterie?',
        english: 'What would you do if you won the lottery?',
        highlight: ['ferais', 'gagnais']
      }
    ]
  },
  {
    title: 'Polite Expressions with Conditional',
    content: `The conditional is essential for polite French conversation. These expressions are used daily:

**Vouloir**: Je voudrais (I would like)
**Pouvoir**: Pourriez-vous (Could you)
**Aimer**: J'aimerais (I would like/love)
**Devoir**: Vous devriez (You should)

Using these forms shows good manners and cultural awareness.`,
    examples: [
      {
        spanish: 'Je voudrais une baguette, s\'il vous plaît.',
        english: 'I would like a baguette, please.',
        highlight: ['voudrais']
      },
      {
        spanish: 'Pourriez-vous répéter, s\'il vous plaît?',
        english: 'Could you repeat, please?',
        highlight: ['Pourriez']
      },
      {
        spanish: 'J\'aimerais réserver une table pour deux.',
        english: 'I would like to reserve a table for two.',
        highlight: ['aimerais']
      },
      {
        spanish: 'Vous devriez essayer ce restaurant.',
        english: 'You should try this restaurant.',
        highlight: ['devriez']
      },
      {
        spanish: 'Auriez-vous la gentillesse de m\'aider?',
        english: 'Would you be so kind as to help me?',
        highlight: ['Auriez']
      }
    ]
  },
  {
    title: 'Conditional vs Other Moods',
    content: `Understanding when to use conditional versus other moods:

**Conditional vs Future**: Conditional expresses what would happen (hypothetical), future expresses what will happen (certain)
**Conditional vs Subjunctive**: Conditional expresses what would happen, subjunctive expresses doubt/emotion
**Conditional vs Imparfait**: Conditional expresses hypothetical actions, imparfait describes past habits

The choice depends on the level of certainty and the type of action being expressed.`,
    examples: [
      {
        spanish: 'Je partirai demain. / Je partirais si possible.',
        english: 'I will leave tomorrow. / I would leave if possible. (future vs conditional)',
        highlight: ['partirai', 'partirais']
      },
      {
        spanish: 'Je doute qu\'il vienne. / Il viendrait s\'il pouvait.',
        english: 'I doubt he will come. / He would come if he could. (subjunctive vs conditional)',
        highlight: ['vienne', 'viendrait']
      },
      {
        spanish: 'Je parlais français. / Je parlerais français si j\'étudiais.',
        english: 'I was speaking French. / I would speak French if I studied. (imparfait vs conditional)',
        highlight: ['parlais', 'parlerais']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'French Future Tense',
    url: '/grammar/french/verbs/future',
    difficulty: 'intermediate'
  },
  {
    title: 'French Imparfait',
    url: '/grammar/french/verbs/imparfait',
    difficulty: 'intermediate'
  },
  {
    title: 'French Subjunctive',
    url: '/grammar/french/verbs/subjunctive',
    difficulty: 'advanced'
  },
  {
    title: 'French Si Clauses',
    url: '/grammar/french/verbs/si-clauses',
    difficulty: 'advanced'
  }
];

export default function FrenchConditionalPage() {
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
              topic: 'conditional',
              title: 'French Conditional Mood',
              description: 'Master French conditional mood for polite requests, hypothetical situations, and expressing wishes. Complete conjugation guide.',
              difficulty: 'advanced',
              examples: [
                'Je voudrais un café (I would like a coffee)',
                'Si j\'étais riche, je voyagerais (If I were rich, I would travel)',
                'Pourriez-vous m\'aider? (Could you help me?)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'conditional',
              title: 'French Conditional Mood'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="conditional"
        title="French Conditional Mood"
        description="Master French conditional mood for polite requests, hypothetical situations, and expressing wishes. Complete conjugation guide"
        difficulty="advanced"
        estimatedTime={22}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/conditional/practice"
        quizUrl="/grammar/french/verbs/conditional/quiz"
        songUrl="/songs/fr?theme=grammar&topic=conditional"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
