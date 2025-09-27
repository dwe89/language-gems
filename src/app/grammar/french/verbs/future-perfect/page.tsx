import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'future-perfect',
  title: 'French Future Perfect (Futur Antérieur)',
  description: 'Master the French future perfect for expressing actions completed before a future point. Learn formation and usage with examples.',
  difficulty: 'advanced',
  keywords: [
    'french future perfect',
    'futur antérieur',
    'future anterior french',
    'completed future actions',
    'french advanced tenses',
    'temporal sequences french'
  ],
  examples: [
    'J\'aurai fini avant midi (I will have finished before noon)',
    'Quand tu arriveras, j\'aurai déjà mangé (When you arrive, I will have already eaten)',
    'Elle sera partie avant ton retour (She will have left before your return)'
  ]
});

const sections = [
  {
    title: 'Understanding the Future Perfect',
    content: `The **future perfect** (futur antérieur) expresses actions that will be completed **before** a specific future moment or another future action. It establishes the chronological order of future events.

This tense is essential for expressing complex temporal relationships and is commonly used in formal writing and sophisticated speech.`,
    examples: [
      {
        spanish: 'J\'aurai terminé mon travail avant 17 heures.',
        english: 'I will have finished my work before 5 PM.',
        highlight: ['aurai terminé']
      },
      {
        spanish: 'Quand tu reviendras, nous aurons déjà dîné.',
        english: 'When you come back, we will have already had dinner.',
        highlight: ['aurons dîné']
      },
      {
        spanish: 'Elle sera arrivée avant le début du film.',
        english: 'She will have arrived before the movie starts.',
        highlight: ['sera arrivée']
      }
    ]
  },
  {
    title: 'Formation: Future + Past Participle',
    content: `The future perfect is formed with the **future tense** of avoir or être + **past participle**.

**Formula**: avoir/être (future) + past participle

The same verbs that use être in other compound tenses also use être in the future perfect.`,
    examples: [
      {
        spanish: 'avoir/être (future) + past participle',
        english: 'auxiliary (future) + past participle',
        highlight: ['future', 'past participle']
      }
    ],
    subsections: [
      {
        title: 'AVOIR in Future + Past Participle',
        content: 'Most verbs use avoir in the future as their auxiliary.',
        conjugationTable: {
          title: 'AVOIR (Future) + Past Participle',
          conjugations: [
            { pronoun: 'j\'', form: 'aurai parlé', english: 'I will have spoken' },
            { pronoun: 'tu', form: 'auras parlé', english: 'you will have spoken' },
            { pronoun: 'il/elle', form: 'aura parlé', english: 'he/she will have spoken' },
            { pronoun: 'nous', form: 'aurons parlé', english: 'we will have spoken' },
            { pronoun: 'vous', form: 'aurez parlé', english: 'you will have spoken' },
            { pronoun: 'ils/elles', form: 'auront parlé', english: 'they will have spoken' }
          ]
        }
      },
      {
        title: 'ÊTRE in Future + Past Participle',
        content: 'Movement verbs and reflexive verbs use être in the future.',
        conjugationTable: {
          title: 'ÊTRE (Future) + Past Participle',
          conjugations: [
            { pronoun: 'je', form: 'serai parti(e)', english: 'I will have left' },
            { pronoun: 'tu', form: 'seras parti(e)', english: 'you will have left' },
            { pronoun: 'il/elle', form: 'sera parti(e)', english: 'he/she will have left' },
            { pronoun: 'nous', form: 'serons parti(e)s', english: 'we will have left' },
            { pronoun: 'vous', form: 'serez parti(e)(s)', english: 'you will have left' },
            { pronoun: 'ils/elles', form: 'seront parti(e)s', english: 'they will have left' }
          ]
        }
      }
    ]
  },
  {
    title: 'Uses of the Future Perfect',
    content: `The future perfect has several important uses:

**1. Actions completed before a future moment**: By a specific time
**2. Actions completed before another future action**: Temporal sequences
**3. Assumptions about completed actions**: What will probably have happened
**4. Formal/literary style**: Sophisticated temporal relationships

This tense adds precision to future time expressions.`,
    examples: [
      {
        spanish: 'À midi, j\'aurai fini mes courses.',
        english: 'By noon, I will have finished my shopping. (before a time)',
        highlight: ['aurai fini']
      },
      {
        spanish: 'Dès que tu auras lu ce livre, tu comprendras.',
        english: 'As soon as you have read this book, you will understand. (before another action)',
        highlight: ['auras lu']
      },
      {
        spanish: 'Il aura sûrement oublié notre rendez-vous.',
        english: 'He will surely have forgotten our appointment. (assumption)',
        highlight: ['aura oublié']
      }
    ]
  },
  {
    title: 'Temporal Conjunctions with Future Perfect',
    content: `The future perfect is often used with temporal conjunctions that introduce time clauses:

**Common conjunctions**: quand, lorsque, dès que, aussitôt que, après que, une fois que

**Pattern**: Temporal conjunction + future perfect, simple future

This creates precise temporal sequences in French.`,
    examples: [
      {
        spanish: 'Quand j\'aurai terminé, je t\'appellerai.',
        english: 'When I have finished, I will call you.',
        highlight: ['aurai terminé', 't\'appellerai']
      },
      {
        spanish: 'Dès qu\'elle sera arrivée, nous partirons.',
        english: 'As soon as she has arrived, we will leave.',
        highlight: ['sera arrivée', 'partirons']
      },
      {
        spanish: 'Après que tu auras mangé, nous irons au cinéma.',
        english: 'After you have eaten, we will go to the movies.',
        highlight: ['auras mangé', 'irons']
      },
      {
        spanish: 'Une fois que nous aurons fini, nous nous reposerons.',
        english: 'Once we have finished, we will rest.',
        highlight: ['aurons fini', 'reposerons']
      }
    ]
  },
  {
    title: 'Future Perfect vs Other Tenses',
    content: `Understanding when to use future perfect versus other tenses:

**Future Perfect**: Action completed before another future action/time
**Simple Future**: Action that will happen in the future
**Present Perfect**: Action completed before now
**Pluperfect**: Action completed before another past action

The key is the temporal relationship between actions.`,
    examples: [
      {
        spanish: 'Je finirai demain. / J\'aurai fini avant demain.',
        english: 'I will finish tomorrow. / I will have finished before tomorrow.',
        highlight: ['finirai', 'aurai fini']
      },
      {
        spanish: 'Quand il arrivera, je partirai. / Quand il sera arrivé, je partirai.',
        english: 'When he arrives, I will leave. / When he has arrived, I will leave.',
        highlight: ['arrivera', 'sera arrivé']
      }
    ]
  },
  {
    title: 'Agreement Rules',
    content: `The same agreement rules apply as in other compound tenses:

**With ÊTRE**: Past participle agrees with the subject
**With AVOIR**: Agreement only when direct object precedes the verb
**Reflexive verbs**: Use être and follow agreement rules

These rules ensure grammatical accuracy in the future perfect.`,
    examples: [
      {
        spanish: 'Elle sera partie. / Elles seront parties.',
        english: 'She will have left. / They (f) will have left. (être agreement)',
        highlight: ['partie', 'parties']
      },
      {
        spanish: 'J\'aurai vu Marie. / Je l\'aurai vue.',
        english: 'I will have seen Marie. / I will have seen her. (avoir agreement)',
        highlight: ['vu', 'vue']
      },
      {
        spanish: 'Elle se sera levée tôt.',
        english: 'She will have gotten up early. (reflexive agreement)',
        highlight: ['levée']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Future Tense', url: '/grammar/french/verbs/future', difficulty: 'intermediate' },
  { title: 'French Present Perfect', url: '/grammar/french/verbs/present-perfect', difficulty: 'intermediate' },
  { title: 'French Pluperfect', url: '/grammar/french/verbs/pluperfect', difficulty: 'advanced' },
  { title: 'French Time Expressions', url: '/grammar/french/expressions/time-expressions', difficulty: 'intermediate' }
];

export default function FrenchFuturePerfectPage() {
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
              topic: 'future-perfect',
              title: 'French Future Perfect (Futur Antérieur)',
              description: 'Master the French future perfect for expressing actions completed before a future point.',
              difficulty: 'advanced',
              examples: [
                'J\'aurai fini avant midi (I will have finished before noon)',
                'Quand tu arriveras, j\'aurai déjà mangé (When you arrive, I will have already eaten)',
                'Elle sera partie avant ton retour (She will have left before your return)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'future-perfect',
              title: 'French Future Perfect (Futur Antérieur)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="future-perfect"
        title="French Future Perfect (Futur Antérieur)"
        description="Master the French future perfect for expressing actions completed before a future point"
        difficulty="advanced"
        estimatedTime={22}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/future-perfect/practice"
        quizUrl="/grammar/french/verbs/future-perfect/quiz"
        songUrl="/songs/fr?theme=grammar&topic=future-perfect"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
