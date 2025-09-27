import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'subjunctive',
  title: 'French Subjunctive Mood',
  description: 'Master French subjunctive mood for expressing doubt, emotion, necessity, and subjectivity. Complete conjugation guide.',
  difficulty: 'advanced',
  keywords: [
    'french subjunctive',
    'subjonctif français',
    'french subjunctive mood',
    'doubt emotion french',
    'necessity french',
    'que + subjunctive',
    'french grammar subjunctive'
  ],
  examples: [
    'Il faut que tu viennes (You must come)',
    'Je doute qu\'il soit là (I doubt he is there)',
    'Je suis content que vous soyez ici (I\'m happy you are here)'
  ]
});

const sections = [
  {
    title: 'French Subjunctive Mood Overview',
    content: `The French subjunctive mood (**subjonctif**) expresses subjectivity, doubt, emotion, necessity, and uncertainty. Unlike the indicative mood, which states facts, the subjunctive expresses personal opinions, feelings, and hypothetical situations.

The subjunctive is typically used after **que** (that) and is triggered by specific expressions that convey doubt, emotion, necessity, or subjectivity.`,
    examples: [
      {
        spanish: 'Il faut que tu viennes.',
        english: 'You must come. (necessity)',
        highlight: ['viennes']
      },
      {
        spanish: 'Je doute qu\'il comprenne.',
        english: 'I doubt he understands. (doubt)',
        highlight: ['comprenne']
      },
      {
        spanish: 'Je suis heureux que vous soyez là.',
        english: 'I\'m happy that you are here. (emotion)',
        highlight: ['soyez']
      }
    ]
  },
  {
    title: 'Present Subjunctive Formation',
    content: `The present subjunctive is formed by taking the **ils/elles form** of the present indicative, dropping **-ent**, and adding subjunctive endings.

**Formula**: ils/elles form - ent + subjunctive endings
**Example**: ils parlent → parl- → que je parle`,
    subsections: [
      {
        title: 'Subjunctive Endings',
        content: `All verbs use the same subjunctive endings:`,
        conjugationTable: {
          title: 'Present Subjunctive Endings',
          conjugations: [
            { pronoun: 'que je', form: '-e', english: 'that I' },
            { pronoun: 'que tu', form: '-es', english: 'that you' },
            { pronoun: 'qu\'il/elle/on', form: '-e', english: 'that he/she/one' },
            { pronoun: 'que nous', form: '-ions', english: 'that we' },
            { pronoun: 'que vous', form: '-iez', english: 'that you' },
            { pronoun: 'qu\'ils/elles', form: '-ent', english: 'that they' }
          ]
        },
        examples: [
          {
            spanish: 'parler → ils parlent → que je parle, que tu parles...',
            english: 'to speak → they speak → that I speak, that you speak...',
            highlight: ['parlent', 'parle', 'parles']
          }
        ]
      },
      {
        title: 'Regular Subjunctive Examples',
        content: `Examples of subjunctive formation for each verb group:`,
        conjugationTable: {
          title: 'Parler (to speak) - Present Subjunctive',
          conjugations: [
            { pronoun: 'que je', form: 'parle', english: 'that I speak' },
            { pronoun: 'que tu', form: 'parles', english: 'that you speak' },
            { pronoun: 'qu\'il/elle/on', form: 'parle', english: 'that he/she/one speaks' },
            { pronoun: 'que nous', form: 'parlions', english: 'that we speak' },
            { pronoun: 'que vous', form: 'parliez', english: 'that you speak' },
            { pronoun: 'qu\'ils/elles', form: 'parlent', english: 'that they speak' }
          ]
        },
        examples: [
          {
            spanish: 'Il faut que je finisse mes devoirs.',
            english: 'I must finish my homework. (finir)',
            highlight: ['finisse']
          },
          {
            spanish: 'Je veux que vous vendiez la voiture.',
            english: 'I want you to sell the car. (vendre)',
            highlight: ['vendiez']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Subjunctive Verbs',
    content: `Some common verbs have irregular subjunctive forms that must be memorized:`,
    subsections: [
      {
        title: 'Most Common Irregular Subjunctives',
        content: `These verbs have completely irregular subjunctive forms:`,
        conjugationTable: {
          title: 'Être (to be) - Subjunctive',
          conjugations: [
            { pronoun: 'que je', form: 'sois', english: 'that I be' },
            { pronoun: 'que tu', form: 'sois', english: 'that you be' },
            { pronoun: 'qu\'il/elle/on', form: 'soit', english: 'that he/she/one be' },
            { pronoun: 'que nous', form: 'soyons', english: 'that we be' },
            { pronoun: 'que vous', form: 'soyez', english: 'that you be' },
            { pronoun: 'qu\'ils/elles', form: 'soient', english: 'that they be' }
          ]
        },
        examples: [
          {
            spanish: 'Je suis content que tu sois là.',
            english: 'I\'m happy that you are here.',
            highlight: ['sois']
          },
          {
            spanish: 'Il faut que nous soyons à l\'heure.',
            english: 'We must be on time.',
            highlight: ['soyons']
          }
        ]
      },
      {
        title: 'Other Important Irregular Subjunctives',
        content: `More irregular subjunctive forms to memorize:`,
        conjugationTable: {
          title: 'Common Irregular Subjunctives',
          conjugations: [
            { pronoun: 'avoir (to have)', form: 'que j\'aie, que tu aies, qu\'il ait...', english: 'that I have...' },
            { pronoun: 'aller (to go)', form: 'que j\'aille, que tu ailles, qu\'il aille...', english: 'that I go...' },
            { pronoun: 'faire (to do)', form: 'que je fasse, que tu fasses, qu\'il fasse...', english: 'that I do...' },
            { pronoun: 'pouvoir (can)', form: 'que je puisse, que tu puisses, qu\'il puisse...', english: 'that I can...' },
            { pronoun: 'savoir (to know)', form: 'que je sache, que tu saches, qu\'il sache...', english: 'that I know...' },
            { pronoun: 'vouloir (to want)', form: 'que je veuille, que tu veuilles, qu\'il veuille...', english: 'that I want...' }
          ]
        },
        examples: [
          {
            spanish: 'Je doute qu\'il ait raison.',
            english: 'I doubt he is right.',
            highlight: ['ait']
          },
          {
            spanish: 'Il faut que j\'aille chez le médecin.',
            english: 'I must go to the doctor.',
            highlight: ['aille']
          },
          {
            spanish: 'Je ne pense pas qu\'elle puisse venir.',
            english: 'I don\'t think she can come.',
            highlight: ['puisse']
          }
        ]
      }
    ]
  },
  {
    title: 'When to Use the Subjunctive',
    content: `The subjunctive is used after certain expressions that convey:

**1. Necessity/Obligation**: Il faut que, il est nécessaire que
**2. Doubt/Uncertainty**: Je doute que, il est possible que
**3. Emotion/Feeling**: Je suis content que, j'ai peur que
**4. Opinion/Judgment**: Il vaut mieux que, il est important que
**5. Will/Desire**: Je veux que, j'aimerais que`,
    examples: [
      {
        spanish: 'Il faut que tu études plus.',
        english: 'You must study more. (necessity)',
        highlight: ['études']
      },
      {
        spanish: 'Je doute qu\'il vienne.',
        english: 'I doubt he will come. (doubt)',
        highlight: ['vienne']
      },
      {
        spanish: 'Je suis triste qu\'elle parte.',
        english: 'I\'m sad that she is leaving. (emotion)',
        highlight: ['parte']
      },
      {
        spanish: 'Il vaut mieux que vous restiez.',
        english: 'It\'s better that you stay. (judgment)',
        highlight: ['restiez']
      },
      {
        spanish: 'Je veux que tu comprennes.',
        english: 'I want you to understand. (will)',
        highlight: ['comprennes']
      }
    ]
  },
  {
    title: 'Subjunctive Triggers',
    content: `Certain expressions consistently trigger the subjunctive mood:

**Necessity**: Il faut que, il est nécessaire que, il est essentiel que
**Doubt**: Je doute que, il est possible que, il se peut que
**Emotion**: Je suis content/triste que, j'ai peur que, je regrette que
**Opinion**: Il vaut mieux que, il est important que, il est bizarre que
**Will**: Je veux que, j'aimerais que, je préfère que`,
    examples: [
      {
        spanish: 'Il est nécessaire que vous compreniez.',
        english: 'It\'s necessary that you understand.',
        highlight: ['compreniez']
      },
      {
        spanish: 'Il se peut qu\'il pleuve.',
        english: 'It might rain.',
        highlight: ['pleuve']
      },
      {
        spanish: 'J\'ai peur qu\'elle soit malade.',
        english: 'I\'m afraid she might be sick.',
        highlight: ['soit']
      },
      {
        spanish: 'Il est bizarre qu\'il ne réponde pas.',
        english: 'It\'s strange that he doesn\'t answer.',
        highlight: ['réponde']
      }
    ]
  },
  {
    title: 'Subjunctive vs Indicative',
    content: `The choice between subjunctive and indicative depends on the main clause:

**Subjunctive**: After expressions of doubt, emotion, necessity, subjectivity
**Indicative**: After expressions of certainty, fact, belief

**Key**: If the main clause expresses certainty or fact, use indicative. If it expresses doubt, emotion, or subjectivity, use subjunctive.`,
    examples: [
      {
        spanish: 'Je pense qu\'il viendra. (certainty - indicative)',
        english: 'I think he will come.',
        highlight: ['viendra']
      },
      {
        spanish: 'Je doute qu\'il vienne. (doubt - subjunctive)',
        english: 'I doubt he will come.',
        highlight: ['vienne']
      },
      {
        spanish: 'Je sais qu\'elle est là. (fact - indicative)',
        english: 'I know she is there.',
        highlight: ['est']
      },
      {
        spanish: 'Je suis content qu\'elle soit là. (emotion - subjunctive)',
        english: 'I\'m happy she is there.',
        highlight: ['soit']
      }
    ]
  },
  {
    title: 'Avoiding the Subjunctive',
    content: `Sometimes you can avoid the subjunctive by restructuring the sentence:

**1. Use infinitive**: When the subject is the same in both clauses
**2. Use different expressions**: Choose expressions that don't require subjunctive
**3. Change the structure**: Rephrase to avoid "que" clauses

This is useful when you're unsure about subjunctive forms.`,
    examples: [
      {
        spanish: 'Je veux partir. (same subject - infinitive)',
        english: 'I want to leave.',
        highlight: ['partir']
      },
      {
        spanish: 'Je veux que tu partes. (different subjects - subjunctive)',
        english: 'I want you to leave.',
        highlight: ['partes']
      },
      {
        spanish: 'Il est probable qu\'il viendra. (indicative)',
        english: 'He will probably come.',
        highlight: ['viendra']
      },
      {
        spanish: 'Il est possible qu\'il vienne. (subjunctive)',
        english: 'He might come.',
        highlight: ['vienne']
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
    title: 'French Imperative',
    url: '/grammar/french/verbs/imperative',
    difficulty: 'intermediate'
  },
  {
    title: 'French Expressions with Que',
    url: '/grammar/french/expressions/que-expressions',
    difficulty: 'advanced'
  }
];

export default function FrenchSubjunctivePage() {
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
              topic: 'subjunctive',
              title: 'French Subjunctive Mood',
              description: 'Master French subjunctive mood for expressing doubt, emotion, necessity, and subjectivity. Complete conjugation guide.',
              difficulty: 'advanced',
              examples: [
                'Il faut que tu viennes (You must come)',
                'Je doute qu\'il soit là (I doubt he is there)',
                'Je suis content que vous soyez ici (I\'m happy you are here)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'subjunctive',
              title: 'French Subjunctive Mood'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="subjunctive"
        title="French Subjunctive Mood"
        description="Master French subjunctive mood for expressing doubt, emotion, necessity, and subjectivity. Complete conjugation guide"
        difficulty="advanced"
        estimatedTime={28}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/subjunctive/practice"
        quizUrl="/grammar/french/verbs/subjunctive/quiz"
        songUrl="/songs/fr?theme=grammar&topic=subjunctive"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
