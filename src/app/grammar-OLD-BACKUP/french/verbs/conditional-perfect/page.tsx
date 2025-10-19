import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'conditional-perfect',
  title: 'French Conditional Perfect (Conditionnel Passé)',
  description: 'Master the French conditional perfect for expressing hypothetical past actions, regrets, and unrealized possibilities.',
  difficulty: 'advanced',
  keywords: [
    'french conditional perfect',
    'conditionnel passé',
    'hypothetical past french',
    'regrets french',
    'unrealized possibilities',
    'si clauses french',
    'french advanced grammar'
  ],
  examples: [
    'J\'aurais aimé venir (I would have liked to come)',
    'Si j\'avais su, je serais venu (If I had known, I would have come)',
    'Elle aurait dû partir plus tôt (She should have left earlier)'
  ]
});

const sections = [
  {
    title: 'Understanding the Conditional Perfect',
    content: `The **conditional perfect** (conditionnel passé) expresses actions that would have happened in the past under different circumstances. It's used for hypothetical situations, regrets, and unrealized possibilities.

This tense is essential for expressing complex ideas about the past and is commonly used in formal writing and sophisticated speech.`,
    examples: [
      {
        spanish: 'J\'aurais aimé te voir.',
        english: 'I would have liked to see you.',
        highlight: ['aurais aimé']
      },
      {
        spanish: 'Si tu étais venu, nous aurions été contents.',
        english: 'If you had come, we would have been happy.',
        highlight: ['aurions été']
      },
      {
        spanish: 'Elle serait partie plus tôt si elle avait pu.',
        english: 'She would have left earlier if she could have.',
        highlight: ['serait partie']
      }
    ]
  },
  {
    title: 'Formation: Conditional + Past Participle',
    content: `The conditional perfect is formed with the **conditional tense** of avoir or être + **past participle**.

**Formula**: avoir/être (conditional) + past participle`,
    examples: [
      {
        spanish: 'avoir/être (conditional) + past participle',
        english: 'auxiliary (conditional) + past participle',
        highlight: ['conditional', 'past participle']
      }
    ],
    subsections: [
      {
        title: 'AVOIR in Conditional + Past Participle',
        content: 'Most verbs use avoir in the conditional as their auxiliary.',
        conjugationTable: {
          title: 'AVOIR (Conditional) + Past Participle',
          conjugations: [
            { pronoun: 'j\'', form: 'aurais parlé', english: 'I would have spoken' },
            { pronoun: 'tu', form: 'aurais parlé', english: 'you would have spoken' },
            { pronoun: 'il/elle', form: 'aurait parlé', english: 'he/she would have spoken' },
            { pronoun: 'nous', form: 'aurions parlé', english: 'we would have spoken' },
            { pronoun: 'vous', form: 'auriez parlé', english: 'you would have spoken' },
            { pronoun: 'ils/elles', form: 'auraient parlé', english: 'they would have spoken' }
          ]
        }
      },
      {
        title: 'ÊTRE in Conditional + Past Participle',
        content: 'Movement verbs and reflexive verbs use être in the conditional.',
        conjugationTable: {
          title: 'ÊTRE (Conditional) + Past Participle',
          conjugations: [
            { pronoun: 'je', form: 'serais parti(e)', english: 'I would have left' },
            { pronoun: 'tu', form: 'serais parti(e)', english: 'you would have left' },
            { pronoun: 'il/elle', form: 'serait parti(e)', english: 'he/she would have left' },
            { pronoun: 'nous', form: 'serions parti(e)s', english: 'we would have left' },
            { pronoun: 'vous', form: 'seriez parti(e)(s)', english: 'you would have left' },
            { pronoun: 'ils/elles', form: 'seraient parti(e)s', english: 'they would have left' }
          ]
        }
      }
    ]
  },
  {
    title: 'Uses of the Conditional Perfect',
    content: `The conditional perfect has several important uses:

**1. Hypothetical past situations**: What would have happened if...
**2. Regrets and missed opportunities**: What should have been done
**3. Polite expressions**: Softening statements about the past
**4. Reported speech**: Indirect speech in the past
**5. Probability in the past**: What probably happened`,
    examples: [
      {
        spanish: 'Si j\'avais étudié, j\'aurais réussi.',
        english: 'If I had studied, I would have succeeded. (hypothetical)',
        highlight: ['aurais réussi']
      },
      {
        spanish: 'J\'aurais dû t\'écouter.',
        english: 'I should have listened to you. (regret)',
        highlight: ['aurais dû']
      },
      {
        spanish: 'Auriez-vous pu m\'aider?',
        english: 'Could you have helped me? (polite)',
        highlight: ['Auriez-vous pu']
      }
    ]
  },
  {
    title: 'Si Clauses with Conditional Perfect',
    content: `The conditional perfect is commonly used in **si clauses** to express unreal past conditions:

**Pattern**: Si + pluperfect, conditional perfect
**Meaning**: If something had happened, something else would have happened

This structure expresses regret or speculation about past events.`,
    examples: [
      {
        spanish: 'Si tu étais venu, nous aurions mangé ensemble.',
        english: 'If you had come, we would have eaten together.',
        highlight: ['étais venu', 'aurions mangé']
      },
      {
        spanish: 'Si elle avait su, elle ne serait pas partie.',
        english: 'If she had known, she wouldn\'t have left.',
        highlight: ['avait su', 'serait pas partie']
      },
      {
        spanish: 'Si nous avions eu plus de temps, nous aurions visité le musée.',
        english: 'If we had had more time, we would have visited the museum.',
        highlight: ['avions eu', 'aurions visité']
      }
    ]
  },
  {
    title: 'Expressing Regrets and Missed Opportunities',
    content: `The conditional perfect is perfect for expressing what should have, could have, or would have happened:

**Regret**: J\'aurais dû... (I should have...)
**Possibility**: J\'aurais pu... (I could have...)
**Desire**: J\'aurais voulu... (I would have wanted...)

These expressions are very common in French conversation.`,
    examples: [
      {
        spanish: 'Tu aurais dû me téléphoner.',
        english: 'You should have called me.',
        highlight: ['aurais dû']
      },
      {
        spanish: 'Nous aurions pu partir plus tôt.',
        english: 'We could have left earlier.',
        highlight: ['aurions pu']
      },
      {
        spanish: 'Elle aurait voulu vous rencontrer.',
        english: 'She would have wanted to meet you.',
        highlight: ['aurait voulu']
      },
      {
        spanish: 'J\'aurais préféré rester à la maison.',
        english: 'I would have preferred to stay home.',
        highlight: ['aurais préféré']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Conditional', url: '/grammar/french/verbs/conditional', difficulty: 'advanced' },
  { title: 'French Pluperfect', url: '/grammar/french/verbs/pluperfect', difficulty: 'advanced' },
  { title: 'French Si Clauses', url: '/grammar/french/conditionals/si-clauses', difficulty: 'advanced' },
  { title: 'French Subjunctive', url: '/grammar/french/verbs/subjunctive', difficulty: 'advanced' }
];

export default function FrenchConditionalPerfectPage() {
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
              topic: 'conditional-perfect',
              title: 'French Conditional Perfect (Conditionnel Passé)',
              description: 'Master the French conditional perfect for expressing hypothetical past actions, regrets, and unrealized possibilities.',
              difficulty: 'advanced',
              examples: [
                'J\'aurais aimé venir (I would have liked to come)',
                'Si j\'avais su, je serais venu (If I had known, I would have come)',
                'Elle aurait dû partir plus tôt (She should have left earlier)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'conditional-perfect',
              title: 'French Conditional Perfect (Conditionnel Passé)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="conditional-perfect"
        title="French Conditional Perfect (Conditionnel Passé)"
        description="Master the French conditional perfect for expressing hypothetical past actions, regrets, and unrealized possibilities"
        difficulty="advanced"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/conditional-perfect/practice"
        quizUrl="/grammar/french/verbs/conditional-perfect/quiz"
        songUrl="/songs/fr?theme=grammar&topic=conditional-perfect"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
