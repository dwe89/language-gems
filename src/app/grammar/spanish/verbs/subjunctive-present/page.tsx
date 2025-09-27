import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'subjunctive-present',
  title: 'Spanish Present Subjunctive',
  description: 'Master the Spanish present subjunctive with comprehensive explanations, formation rules, and usage examples.',
  difficulty: 'advanced',
  keywords: [
    'spanish present subjunctive',
    'presente de subjuntivo',
    'subjunctive mood',
    'que + subjunctive',
    'spanish subjunctive conjugation'
  ],
  examples: [
    'Espero que tengas un buen día (I hope you have a good day)',
    'Es importante que estudies (It\'s important that you study)',
    'Dudo que venga mañana (I doubt he\'ll come tomorrow)'
  ]
});

const sections = [
  {
    title: 'What is the Spanish Present Subjunctive?',
    content: `The Spanish present subjunctive (**presente de subjuntivo**) is a mood used to express doubt, emotion, desire, possibility, and hypothetical situations. Unlike the indicative mood which states facts, the subjunctive expresses subjective attitudes and uncertain events.

The subjunctive is one of the most challenging aspects of Spanish grammar, but mastering it is essential for advanced fluency.`,
    examples: [
      {
        spanish: 'Quiero que vengas conmigo.',
        english: 'I want you to come with me.',
        highlight: ['que vengas']
      },
      {
        spanish: 'Es posible que llueva mañana.',
        english: 'It\'s possible that it will rain tomorrow.',
        highlight: ['que llueva']
      },
      {
        spanish: 'Me alegra que estés aquí.',
        english: 'I\'m glad that you\'re here.',
        highlight: ['que estés']
      }
    ]
  },
  {
    title: 'Formation of the Present Subjunctive',
    content: `The present subjunctive is formed by taking the yo form of the present indicative, dropping the -o, and adding subjunctive endings.`,
    subsections: [
      {
        title: 'Regular -AR Verbs',
        content: 'For -ar verbs, add -e, -es, -e, -emos, -éis, -en:',
        conjugationTable: {
          title: 'Hablar - Present Subjunctive',
          conjugations: [
            { pronoun: 'yo', form: 'hable', english: 'I speak' },
            { pronoun: 'tú', form: 'hables', english: 'you speak' },
            { pronoun: 'él/ella/usted', form: 'hable', english: 'he/she/you speak' },
            { pronoun: 'nosotros', form: 'hablemos', english: 'we speak' },
            { pronoun: 'vosotros', form: 'habléis', english: 'you all speak' },
            { pronoun: 'ellos/ellas/ustedes', form: 'hablen', english: 'they/you all speak' }
          ]
        }
      },
      {
        title: 'Regular -ER/-IR Verbs',
        content: 'For -er and -ir verbs, add -a, -as, -a, -amos, -áis, -an:',
        conjugationTable: {
          title: 'Comer - Present Subjunctive',
          conjugations: [
            { pronoun: 'yo', form: 'coma', english: 'I eat' },
            { pronoun: 'tú', form: 'comas', english: 'you eat' },
            { pronoun: 'él/ella/usted', form: 'coma', english: 'he/she/you eat' },
            { pronoun: 'nosotros', form: 'comamos', english: 'we eat' },
            { pronoun: 'vosotros', form: 'comáis', english: 'you all eat' },
            { pronoun: 'ellos/ellas/ustedes', form: 'coman', english: 'they/you all eat' }
          ]
        }
      },
      {
        title: 'Irregular Verbs',
        content: 'Some common irregular subjunctive forms:',
        examples: [
          {
            spanish: 'ser → sea, seas, sea, seamos, seáis, sean',
            english: 'to be',
            highlight: ['sea']
          },
          {
            spanish: 'estar → esté, estés, esté, estemos, estéis, estén',
            english: 'to be',
            highlight: ['esté']
          },
          {
            spanish: 'ir → vaya, vayas, vaya, vayamos, vayáis, vayan',
            english: 'to go',
            highlight: ['vaya']
          },
          {
            spanish: 'saber → sepa, sepas, sepa, sepamos, sepáis, sepan',
            english: 'to know',
            highlight: ['sepa']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses of the Present Subjunctive',
    content: `The present subjunctive is used in various contexts, often introduced by "que".`,
    subsections: [
      {
        title: 'Expressing Desire and Emotion',
        content: 'Used after verbs expressing desire, emotion, or preference:',
        examples: [
          {
            spanish: 'Quiero que estudies más.',
            english: 'I want you to study more.',
            highlight: ['que estudies']
          },
          {
            spanish: 'Me alegra que vengas a la fiesta.',
            english: 'I\'m happy that you\'re coming to the party.',
            highlight: ['que vengas']
          },
          {
            spanish: 'Espero que tengas suerte.',
            english: 'I hope you have luck.',
            highlight: ['que tengas']
          }
        ]
      },
      {
        title: 'Expressing Doubt and Uncertainty',
        content: 'Used after expressions of doubt, uncertainty, or denial:',
        examples: [
          {
            spanish: 'Dudo que sea verdad.',
            english: 'I doubt that it\'s true.',
            highlight: ['que sea']
          },
          {
            spanish: 'No creo que llueva hoy.',
            english: 'I don\'t think it will rain today.',
            highlight: ['que llueva']
          },
          {
            spanish: 'Es posible que lleguen tarde.',
            english: 'It\'s possible they\'ll arrive late.',
            highlight: ['que lleguen']
          }
        ]
      },
      {
        title: 'Impersonal Expressions',
        content: 'Used after impersonal expressions of opinion, necessity, or judgment:',
        examples: [
          {
            spanish: 'Es importante que hables español.',
            english: 'It\'s important that you speak Spanish.',
            highlight: ['que hables']
          },
          {
            spanish: 'Es necesario que estudies.',
            english: 'It\'s necessary that you study.',
            highlight: ['que estudies']
          },
          {
            spanish: 'Es mejor que vayamos temprano.',
            english: 'It\'s better that we go early.',
            highlight: ['que vayamos']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Subjunctive Triggers',
    content: `Key words and phrases that trigger the subjunctive mood.`,
    examples: [
      {
        spanish: 'Verbs of emotion: alegrarse, temer, sentir',
        english: 'Me alegra que estés bien.',
        highlight: ['Me alegra que estés']
      },
      {
        spanish: 'Verbs of desire: querer, desear, preferir',
        english: 'Quiero que vengas conmigo.',
        highlight: ['Quiero que vengas']
      },
      {
        spanish: 'Expressions of doubt: dudar, no creer',
        english: 'Dudo que sea cierto.',
        highlight: ['Dudo que sea']
      },
      {
        spanish: 'Impersonal expressions: es importante, es necesario',
        english: 'Es importante que sepas esto.',
        highlight: ['es importante que sepas']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Stem-changing Verbs', url: '/grammar/spanish/verbs/stem-changing', difficulty: 'intermediate' },
  { title: 'Modal Verbs', url: '/grammar/spanish/verbs/modal-verbs', difficulty: 'intermediate' },
  { title: 'Subjunctive Present', url: '/grammar/spanish/verbs/subjunctive-present', difficulty: 'advanced' },
  { title: 'Ser vs Estar', url: '/grammar/spanish/verbs/ser-vs-estar', difficulty: 'beginner' }
];

export default function SpanishPresentSubjunctivePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'subjunctive-present',
              title: 'Spanish Present Subjunctive',
              description: 'Master the Spanish present subjunctive with comprehensive explanations and examples',
              difficulty: 'advanced',
              estimatedTime: 35
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'subjunctive-present',
              title: 'Spanish Present Subjunctive'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="subjunctive-present"
        title="Spanish Present Subjunctive"
        description="Master the Spanish present subjunctive with comprehensive explanations and examples"
        difficulty="advanced"
        estimatedTime={35}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/subjunctive-present/practice"
        quizUrl="/grammar/spanish/verbs/subjunctive-present/quiz"
        songUrl="/songs/es?theme=grammar&topic=subjunctive-present"
        youtubeVideoId="dQw4w9WgXcQ"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
