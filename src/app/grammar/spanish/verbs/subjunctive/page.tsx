import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'subjunctive',
  title: 'Spanish Subjunctive Mood',
  description: 'Master Spanish subjunctive mood for expressing doubt, emotion, desire, and hypothetical situations. Complete guide with examples.',
  difficulty: 'advanced',
  keywords: [
    'spanish subjunctive',
    'subjuntivo español',
    'spanish subjunctive conjugation',
    'subjunctive mood spanish',
    'spanish grammar advanced',
    'doubt emotion spanish',
    'hypothetical spanish'
  ],
  examples: [
    'Espero que tengas un buen día (I hope you have a good day)',
    'Dudo que venga mañana (I doubt he will come tomorrow)',
    'Es importante que estudies (It\'s important that you study)'
  ]
});

const sections = [
  {
    title: 'What is the Spanish Subjunctive Mood?',
    content: `The Spanish subjunctive mood (**subjuntivo**) expresses subjectivity, uncertainty, emotion, desire, and hypothetical situations. Unlike the indicative mood, which states facts, the subjunctive expresses what might be, what we hope for, or what we doubt.

The subjunctive is one of the most challenging aspects of Spanish grammar but is essential for expressing nuanced thoughts and emotions.`,
    examples: [
      {
        spanish: 'Espero que tengas un buen día.',
        english: 'I hope you have a good day.',
        highlight: ['tengas']
      },
      {
        spanish: 'Dudo que María venga a la fiesta.',
        english: 'I doubt María will come to the party.',
        highlight: ['venga']
      },
      {
        spanish: 'Es importante que estudies para el examen.',
        english: 'It\'s important that you study for the exam.',
        highlight: ['estudies']
      }
    ]
  },
  {
    title: 'Present Subjunctive Formation',
    content: `The present subjunctive is formed by taking the **yo form** of the present indicative, dropping the **-o** ending, and adding subjunctive endings. This method works for most verbs, including many irregulars.`,
    subsections: [
      {
        title: 'Regular -AR Verbs',
        content: `For **-AR verbs**, take the yo form, drop -o, and add -e endings:`,
        conjugationTable: {
          title: 'AR Verbs: hablar → hable',
          conjugations: [
            { pronoun: 'yo', form: 'hable', english: 'I speak/may speak' },
            { pronoun: 'tú', form: 'hables', english: 'you speak/may speak' },
            { pronoun: 'él/ella/usted', form: 'hable', english: 'he/she speaks, you speak' },
            { pronoun: 'nosotros/nosotras', form: 'hablemos', english: 'we speak/may speak' },
            { pronoun: 'vosotros/vosotras', form: 'habléis', english: 'you all speak/may speak' },
            { pronoun: 'ellos/ellas/ustedes', form: 'hablen', english: 'they speak, you all speak' }
          ]
        },
        examples: [
          {
            spanish: 'Quiero que hables más despacio.',
            english: 'I want you to speak more slowly.',
            highlight: ['hables']
          },
          {
            spanish: 'Es necesario que estudiemos juntos.',
            english: 'It\'s necessary that we study together.',
            highlight: ['estudiemos']
          }
        ]
      },
      {
        title: 'Regular -ER/-IR Verbs',
        content: `For **-ER and -IR verbs**, take the yo form, drop -o, and add -a endings:`,
        conjugationTable: {
          title: 'ER/IR Verbs: comer/vivir → coma/viva',
          conjugations: [
            { pronoun: 'yo', form: 'coma/viva', english: 'I eat/live' },
            { pronoun: 'tú', form: 'comas/vivas', english: 'you eat/live' },
            { pronoun: 'él/ella/usted', form: 'coma/viva', english: 'he/she eats/lives' },
            { pronoun: 'nosotros/nosotras', form: 'comamos/vivamos', english: 'we eat/live' },
            { pronoun: 'vosotros/vosotras', form: 'comáis/viváis', english: 'you all eat/live' },
            { pronoun: 'ellos/ellas/ustedes', form: 'coman/vivan', english: 'they eat/live' }
          ]
        },
        examples: [
          {
            spanish: 'No creo que coma carne.',
            english: 'I don\'t think he eats meat.',
            highlight: ['coma']
          },
          {
            spanish: 'Espero que vivan felices.',
            english: 'I hope they live happily.',
            highlight: ['vivan']
          }
        ]
      },
      {
        title: 'Stem-Changing Verbs',
        content: `**Stem-changing verbs** follow the same pattern as in the present indicative, but -ir verbs have additional changes in nosotros and vosotros forms:`,
        conjugationTable: {
          title: 'Stem Changes: pensar → piense, dormir → duerma',
          conjugations: [
            { pronoun: 'pensar (e→ie)', form: 'piense, pienses, piense, pensemos, penséis, piensen', english: 'to think' },
            { pronoun: 'dormir (o→ue, o→u)', form: 'duerma, duermas, duerma, durmamos, durmáis, duerman', english: 'to sleep' },
            { pronoun: 'pedir (e→i)', form: 'pida, pidas, pida, pidamos, pidáis, pidan', english: 'to ask for' }
          ]
        },
        examples: [
          {
            spanish: 'Dudo que piense en nosotros.',
            english: 'I doubt he thinks about us.',
            highlight: ['piense']
          },
          {
            spanish: 'Es raro que durmamos tan poco.',
            english: 'It\'s strange that we sleep so little.',
            highlight: ['durmamos']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Subjunctive Verbs',
    content: `Some verbs have completely irregular subjunctive forms that must be memorized:`,
    subsections: [
      {
        title: 'Common Irregular Verbs',
        content: `These verbs have irregular subjunctive stems:`,
        conjugationTable: {
          title: 'Irregular Subjunctive Forms',
          conjugations: [
            { pronoun: 'ser (to be)', form: 'sea, seas, sea, seamos, seáis, sean', english: 'be' },
            { pronoun: 'estar (to be)', form: 'esté, estés, esté, estemos, estéis, estén', english: 'be (location/condition)' },
            { pronoun: 'ir (to go)', form: 'vaya, vayas, vaya, vayamos, vayáis, vayan', english: 'go' },
            { pronoun: 'haber (to have)', form: 'haya, hayas, haya, hayamos, hayáis, hayan', english: 'have (auxiliary)' },
            { pronoun: 'saber (to know)', form: 'sepa, sepas, sepa, sepamos, sepáis, sepan', english: 'know' },
            { pronoun: 'dar (to give)', form: 'dé, des, dé, demos, deis, den', english: 'give' }
          ]
        },
        examples: [
          {
            spanish: 'No creo que sea verdad.',
            english: 'I don\'t think it\'s true.',
            highlight: ['sea']
          },
          {
            spanish: 'Espero que estés bien.',
            english: 'I hope you\'re well.',
            highlight: ['estés']
          },
          {
            spanish: 'Quiero que vayas conmigo.',
            english: 'I want you to go with me.',
            highlight: ['vayas']
          }
        ]
      }
    ]
  },
  {
    title: 'When to Use the Subjunctive',
    content: `The subjunctive is used in specific situations, often triggered by certain expressions or conjunctions:

**1. Doubt and Denial**: When expressing uncertainty or negation
**2. Emotion**: When expressing feelings about something
**3. Desire and Influence**: When wanting someone to do something
**4. Impersonal Expressions**: With expressions like "es importante que"
**5. Certain Conjunctions**: After specific connecting words`,
    examples: [
      {
        spanish: 'Dudo que llueva mañana.',
        english: 'I doubt it will rain tomorrow. (doubt)',
        highlight: ['llueva']
      },
      {
        spanish: 'Me alegra que vengas a visitarme.',
        english: 'I\'m happy that you\'re coming to visit me. (emotion)',
        highlight: ['vengas']
      },
      {
        spanish: 'Quiero que me ayudes.',
        english: 'I want you to help me. (desire/influence)',
        highlight: ['ayudes']
      },
      {
        spanish: 'Es necesario que estudies más.',
        english: 'It\'s necessary that you study more. (impersonal expression)',
        highlight: ['estudies']
      }
    ]
  },
  {
    title: 'Subjunctive Triggers',
    content: `Certain words and phrases consistently trigger the subjunctive mood:

**Doubt/Denial**: dudar que, no creer que, negar que
**Emotion**: alegrarse de que, temer que, sorprender que
**Desire/Influence**: querer que, pedir que, recomendar que
**Impersonal**: es importante que, es necesario que, es posible que
**Conjunctions**: para que, antes de que, sin que, aunque`,
    examples: [
      {
        spanish: 'No creo que entienda la lección.',
        english: 'I don\'t think he understands the lesson.',
        highlight: ['entienda']
      },
      {
        spanish: 'Me sorprende que no haya llamado.',
        english: 'I\'m surprised he hasn\'t called.',
        highlight: ['haya']
      },
      {
        spanish: 'Te llamo para que sepas la verdad.',
        english: 'I\'m calling you so that you know the truth.',
        highlight: ['sepas']
      },
      {
        spanish: 'Aunque llueva, iremos al parque.',
        english: 'Even if it rains, we\'ll go to the park.',
        highlight: ['llueva']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Ser vs Estar', url: '/grammar/spanish/verbs/ser-vs-estar', difficulty: 'beginner' },
  { title: 'Stem-changing Verbs', url: '/grammar/spanish/verbs/stem-changing', difficulty: 'intermediate' },
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' },
  { title: 'Past Participles', url: '/grammar/spanish/verbs/past-participles', difficulty: 'intermediate' }
];

export default function SpanishSubjunctivePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'subjunctive',
              title: 'Spanish Subjunctive Mood',
              description: 'Master Spanish subjunctive mood for expressing doubt, emotion, desire, and hypothetical situations.',
              difficulty: 'advanced',
              examples: [
                'Espero que tengas un buen día (I hope you have a good day)',
                'Dudo que venga mañana (I doubt he will come tomorrow)',
                'Es importante que estudies (It\'s important that you study)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'subjunctive',
              title: 'Spanish Subjunctive Mood'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="subjunctive"
        title="Spanish Subjunctive Mood"
        description="Master Spanish subjunctive mood for expressing doubt, emotion, desire, and hypothetical situations"
        difficulty="advanced"
        estimatedTime={28}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/subjunctive/practice"
        quizUrl="/grammar/spanish/verbs/subjunctive/quiz"
        songUrl="/songs/es?theme=grammar&topic=subjunctive"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
