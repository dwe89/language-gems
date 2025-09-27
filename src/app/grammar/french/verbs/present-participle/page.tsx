import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'present-participle',
  title: 'French Present Participle (Participe Présent)',
  description: 'Master the French present participle with EN for expressing simultaneous actions and manner. Learn formation and usage rules.',
  difficulty: 'advanced',
  keywords: [
    'french present participle',
    'participe présent',
    'en + participe présent',
    'simultaneous actions french',
    'manner expressions french',
    'french advanced grammar'
  ],
  examples: [
    'En parlant français, j\'apprends (While speaking French, I learn)',
    'Il travaille en écoutant de la musique (He works while listening to music)',
    'En arrivant, elle a souri (Upon arriving, she smiled)'
  ]
});

const sections = [
  {
    title: 'Understanding the Present Participle',
    content: `The **present participle** (participe présent) is a verb form ending in **-ant** that expresses an action happening at the same time as the main verb. It's most commonly used with **EN** to show simultaneous actions or manner.

The present participle is essential for expressing complex relationships between actions and is commonly used in both spoken and written French.`,
    examples: [
      {
        spanish: 'En marchant, je réfléchis.',
        english: 'While walking, I think.',
        highlight: ['En marchant']
      },
      {
        spanish: 'Elle chante en cuisinant.',
        english: 'She sings while cooking.',
        highlight: ['en cuisinant']
      },
      {
        spanish: 'En étudiant, on apprend.',
        english: 'By studying, one learns.',
        highlight: ['En étudiant']
      }
    ]
  },
  {
    title: 'Formation of Present Participle',
    content: `The present participle is formed by taking the **nous form** of the present tense, removing **-ons**, and adding **-ant**.

**Formation**: nous form (present) - ons + ant

This formation is regular for almost all verbs in French.`,
    examples: [
      {
        spanish: 'parler → nous parlons → parl- + ant = parlant',
        english: 'to speak → we speak → speak + ing = speaking',
        highlight: ['nous parlons', 'parlant']
      },
      {
        spanish: 'finir → nous finissons → finiss- + ant = finissant',
        english: 'to finish → we finish → finish + ing = finishing',
        highlight: ['nous finissons', 'finissant']
      }
    ],
    subsections: [
      {
        title: 'Regular Formation Examples',
        content: 'Most verbs follow the regular formation pattern.',
        conjugationTable: {
          title: 'Present Participle Formation',
          conjugations: [
            { pronoun: 'parler', form: 'parlant', english: 'speaking' },
            { pronoun: 'finir', form: 'finissant', english: 'finishing' },
            { pronoun: 'vendre', form: 'vendant', english: 'selling' },
            { pronoun: 'manger', form: 'mangeant', english: 'eating' },
            { pronoun: 'commencer', form: 'commençant', english: 'beginning' },
            { pronoun: 'étudier', form: 'étudiant', english: 'studying' }
          ]
        }
      },
      {
        title: 'Irregular Present Participles',
        content: 'Only three verbs have irregular present participles.',
        conjugationTable: {
          title: 'Irregular Present Participles',
          conjugations: [
            { pronoun: 'avoir', form: 'ayant', english: 'having' },
            { pronoun: 'être', form: 'étant', english: 'being' },
            { pronoun: 'savoir', form: 'sachant', english: 'knowing' }
          ]
        }
      }
    ]
  },
  {
    title: 'EN + Present Participle',
    content: `The most common use of the present participle is with **EN** to express:

**1. Simultaneous actions**: While doing something
**2. Manner**: How something is done
**3. Means**: By doing something
**4. Time**: When/upon doing something

This construction is called the **gérondif** in French grammar.`,
    examples: [
      {
        spanish: 'En travaillant dur, il a réussi.',
        english: 'By working hard, he succeeded. (means)',
        highlight: ['En travaillant']
      },
      {
        spanish: 'Elle pleure en regardant le film.',
        english: 'She cries while watching the movie. (simultaneous)',
        highlight: ['en regardant']
      },
      {
        spanish: 'En arrivant, j\'ai vu Marie.',
        english: 'Upon arriving, I saw Marie. (time)',
        highlight: ['En arrivant']
      },
      {
        spanish: 'Il répond en souriant.',
        english: 'He answers while smiling. (manner)',
        highlight: ['en souriant']
      }
    ]
  },
  {
    title: 'Uses and Functions',
    content: `The present participle with EN has several important functions:

**Simultaneous Actions**: Two actions happening at the same time
**Cause and Effect**: Showing how one action leads to another
**Manner of Action**: Describing how something is done
**Time Relationships**: Expressing when something happens

The subject of both verbs must be the same person.`,
    examples: [
      {
        spanish: 'En lisant ce livre, j\'ai appris beaucoup.',
        english: 'By reading this book, I learned a lot. (cause/effect)',
        highlight: ['En lisant']
      },
      {
        spanish: 'Il est parti en claquant la porte.',
        english: 'He left slamming the door. (manner)',
        highlight: ['en claquant']
      },
      {
        spanish: 'En me levant, j\'ai mal au dos.',
        english: 'When getting up, my back hurts. (time)',
        highlight: ['En me levant']
      }
    ]
  },
  {
    title: 'Present Participle vs Other Forms',
    content: `Understanding when to use present participle versus other constructions:

**EN + present participle**: Simultaneous actions with same subject
**PENDANT QUE + verb**: Simultaneous actions with different subjects
**QUAND + verb**: When something happens (specific time)
**Infinitive**: Purpose or intention

The choice depends on the relationship between the actions and subjects.`,
    examples: [
      {
        spanish: 'En mangeant, je regarde la télé. (same subject)',
        english: 'While eating, I watch TV.',
        highlight: ['En mangeant']
      },
      {
        spanish: 'Pendant que je mange, il regarde la télé. (different subjects)',
        english: 'While I eat, he watches TV.',
        highlight: ['Pendant que']
      },
      {
        spanish: 'Quand je mange, je suis content. (specific time)',
        english: 'When I eat, I am happy.',
        highlight: ['Quand']
      }
    ]
  },
  {
    title: 'Common Expressions with Present Participle',
    content: `Several fixed expressions use the present participle:

**En attendant**: While waiting / In the meantime
**En passant**: By the way / While passing by
**En général**: Generally speaking
**Tout en + present participle**: While (emphasizing simultaneity)

These expressions are very common in everyday French.`,
    examples: [
      {
        spanish: 'En attendant le bus, je lis.',
        english: 'While waiting for the bus, I read.',
        highlight: ['En attendant']
      },
      {
        spanish: 'En passant, as-tu vu Marie?',
        english: 'By the way, did you see Marie?',
        highlight: ['En passant']
      },
      {
        spanish: 'Tout en parlant, il écrit.',
        english: 'While talking, he writes. (emphasis on simultaneity)',
        highlight: ['Tout en parlant']
      },
      {
        spanish: 'En général, je me lève tôt.',
        english: 'Generally speaking, I get up early.',
        highlight: ['En général']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Infinitive', url: '/grammar/french/verbs/infinitive', difficulty: 'intermediate' },
  { title: 'French Past Participle', url: '/grammar/french/verbs/past-participle', difficulty: 'intermediate' },
  { title: 'French Time Expressions', url: '/grammar/french/expressions/time-expressions', difficulty: 'intermediate' },
  { title: 'French Subjunctive', url: '/grammar/french/verbs/subjunctive', difficulty: 'advanced' }
];

export default function FrenchPresentParticiplePage() {
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
              topic: 'present-participle',
              title: 'French Present Participle (Participe Présent)',
              description: 'Master the French present participle with EN for expressing simultaneous actions and manner.',
              difficulty: 'advanced',
              examples: [
                'En parlant français, j\'apprends (While speaking French, I learn)',
                'Il travaille en écoutant de la musique (He works while listening to music)',
                'En arrivant, elle a souri (Upon arriving, she smiled)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'present-participle',
              title: 'French Present Participle (Participe Présent)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="present-participle"
        title="French Present Participle (Participe Présent)"
        description="Master the French present participle with EN for expressing simultaneous actions and manner"
        difficulty="advanced"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/present-participle/practice"
        quizUrl="/grammar/french/verbs/present-participle/quiz"
        songUrl="/songs/fr?theme=grammar&topic=present-participle"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
