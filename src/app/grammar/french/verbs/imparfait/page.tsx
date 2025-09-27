import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'imparfait',
  title: 'French Imparfait Tense',
  description: 'Master French imparfait for describing past habits, ongoing actions, and background descriptions. Complete conjugation guide.',
  difficulty: 'intermediate',
  keywords: [
    'french imparfait',
    'imparfait français',
    'french imperfect tense',
    'past habits french',
    'ongoing actions french',
    'french grammar',
    'imparfait vs passé composé'
  ],
  examples: [
    'Je parlais français (I was speaking French)',
    'Il faisait beau (The weather was nice)',
    'Nous habitions à Paris (We used to live in Paris)'
  ]
});

const sections = [
  {
    title: 'What is the French Imparfait?',
    content: `The French imparfait (imperfect tense) describes **ongoing, habitual, or background actions** in the past. Unlike the passé composé, which expresses completed actions, the imparfait paints a picture of what was happening or what used to happen.

The imparfait is essential for storytelling, describing past habits, and setting the scene in narratives. It's equivalent to "was/were + -ing" or "used to" in English.`,
    examples: [
      {
        spanish: 'Je parlais avec mon ami.',
        english: 'I was talking with my friend. (ongoing action)',
        highlight: ['parlais']
      },
      {
        spanish: 'Quand j\'étais petit, je jouais au football.',
        english: 'When I was little, I used to play football. (past habit)',
        highlight: ['étais', 'jouais']
      },
      {
        spanish: 'Il faisait beau ce jour-là.',
        english: 'The weather was nice that day. (background description)',
        highlight: ['faisait']
      }
    ]
  },
  {
    title: 'Imparfait Formation',
    content: `The imparfait is one of the most regular tenses in French. It's formed by taking the **nous form** of the present tense, removing **-ons**, and adding imparfait endings.

**Formula**: nous form - ons + imparfait endings
**Example**: nous parlons → parl- → je parlais`,
    subsections: [
      {
        title: 'Imparfait Endings',
        content: `All French verbs use the same imparfait endings, regardless of their group:`,
        conjugationTable: {
          title: 'Imparfait Endings (All Verbs)',
          conjugations: [
            { pronoun: 'je', form: '-ais', english: 'I was/used to' },
            { pronoun: 'tu', form: '-ais', english: 'you were/used to' },
            { pronoun: 'il/elle/on', form: '-ait', english: 'he/she/one was/used to' },
            { pronoun: 'nous', form: '-ions', english: 'we were/used to' },
            { pronoun: 'vous', form: '-iez', english: 'you were/used to' },
            { pronoun: 'ils/elles', form: '-aient', english: 'they were/used to' }
          ]
        },
        examples: [
          {
            spanish: 'Je parlais, tu parlais, il parlait...',
            english: 'I was speaking, you were speaking, he was speaking...',
            highlight: ['parlais', 'parlait']
          }
        ]
      },
      {
        title: 'Regular Verb Examples',
        content: `Here are examples of imparfait formation for each verb group:`,
        conjugationTable: {
          title: 'Parler (to speak) - Imparfait',
          conjugations: [
            { pronoun: 'je', form: 'parlais', english: 'I was speaking/used to speak' },
            { pronoun: 'tu', form: 'parlais', english: 'you were speaking/used to speak' },
            { pronoun: 'il/elle/on', form: 'parlait', english: 'he/she/one was speaking/used to speak' },
            { pronoun: 'nous', form: 'parlions', english: 'we were speaking/used to speak' },
            { pronoun: 'vous', form: 'parliez', english: 'you were speaking/used to speak' },
            { pronoun: 'ils/elles', form: 'parlaient', english: 'they were speaking/used to speak' }
          ]
        },
        examples: [
          {
            spanish: 'Je finissais mes devoirs.',
            english: 'I was finishing my homework. (finir → finissais)',
            highlight: ['finissais']
          },
          {
            spanish: 'Nous vendions notre voiture.',
            english: 'We were selling our car. (vendre → vendions)',
            highlight: ['vendions']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Verbs in Imparfait',
    content: `Most verbs follow the regular formation pattern, but there are a few important exceptions:`,
    subsections: [
      {
        title: 'Être (to be) - Only Irregular Verb',
        content: `**Être** is the only truly irregular verb in the imparfait:`,
        conjugationTable: {
          title: 'Être (to be) - Imparfait',
          conjugations: [
            { pronoun: 'j\'', form: 'étais', english: 'I was' },
            { pronoun: 'tu', form: 'étais', english: 'you were' },
            { pronoun: 'il/elle/on', form: 'était', english: 'he/she/one was' },
            { pronoun: 'nous', form: 'étions', english: 'we were' },
            { pronoun: 'vous', form: 'étiez', english: 'you were' },
            { pronoun: 'ils/elles', form: 'étaient', english: 'they were' }
          ]
        },
        examples: [
          {
            spanish: 'J\'étais très fatigué.',
            english: 'I was very tired.',
            highlight: ['étais']
          },
          {
            spanish: 'Nous étions en vacances.',
            english: 'We were on vacation.',
            highlight: ['étions']
          }
        ]
      },
      {
        title: 'Verbs with Spelling Changes',
        content: `Some verbs have spelling changes in the imparfait to maintain pronunciation:`,
        conjugationTable: {
          title: 'Spelling Changes in Imparfait',
          conjugations: [
            { pronoun: 'manger → nous mangions', form: 'je mangeais', english: 'I was eating (keep -e-)' },
            { pronoun: 'commencer → nous commencions', form: 'je commençais', english: 'I was starting (ç before -a-)' },
            { pronoun: 'étudier → nous étudiions', form: 'j\'étudiais', english: 'I was studying (double -i-)' }
          ]
        },
        examples: [
          {
            spanish: 'Nous mangions au restaurant.',
            english: 'We were eating at the restaurant.',
            highlight: ['mangions']
          },
          {
            spanish: 'Je commençais à comprendre.',
            english: 'I was starting to understand.',
            highlight: ['commençais']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses of the Imparfait',
    content: `The imparfait has several specific uses that distinguish it from other past tenses:

**1. Ongoing actions**: What was happening at a specific moment
**2. Habitual actions**: What used to happen regularly
**3. Background descriptions**: Setting the scene
**4. Physical/mental states**: How someone felt or appeared
**5. Time and age**: Telling time or age in the past`,
    examples: [
      {
        spanish: 'Je lisais quand tu as appelé.',
        english: 'I was reading when you called. (ongoing action)',
        highlight: ['lisais']
      },
      {
        spanish: 'Tous les étés, nous allions à la plage.',
        english: 'Every summer, we used to go to the beach. (habitual)',
        highlight: ['allions']
      },
      {
        spanish: 'Il faisait froid et il pleuvait.',
        english: 'It was cold and it was raining. (background)',
        highlight: ['faisait', 'pleuvait']
      },
      {
        spanish: 'Elle était très heureuse.',
        english: 'She was very happy. (mental state)',
        highlight: ['était']
      },
      {
        spanish: 'Il était trois heures.',
        english: 'It was three o\'clock. (time)',
        highlight: ['était']
      }
    ]
  },
  {
    title: 'Imparfait vs Passé Composé',
    content: `Understanding when to use imparfait versus passé composé is crucial for correct French expression:

**Imparfait**: Ongoing, habitual, background, descriptions
**Passé Composé**: Completed, specific, sequential actions

Often both tenses appear in the same sentence to show the relationship between ongoing and completed actions.`,
    examples: [
      {
        spanish: 'Je dormais quand le téléphone a sonné.',
        english: 'I was sleeping when the phone rang. (ongoing + completed)',
        highlight: ['dormais', 'a sonné']
      },
      {
        spanish: 'Hier, il pleuvait, alors je suis resté à la maison.',
        english: 'Yesterday it was raining, so I stayed home. (background + decision)',
        highlight: ['pleuvait', 'suis resté']
      },
      {
        spanish: 'Quand j\'étais petit, j\'ai cassé ma jambe.',
        english: 'When I was little, I broke my leg. (background + specific event)',
        highlight: ['étais', 'ai cassé']
      },
      {
        spanish: 'Elle portait une robe rouge et elle souriait.',
        english: 'She was wearing a red dress and she was smiling. (descriptions)',
        highlight: ['portait', 'souriait']
      }
    ]
  },
  {
    title: 'Common Time Expressions with Imparfait',
    content: `Certain time expressions often signal the use of imparfait:

**Habitual**: tous les jours, chaque semaine, souvent, toujours, d'habitude
**Background**: pendant que, tandis que, comme
**Descriptive**: à cette époque, en ce temps-là, autrefois

These expressions help you recognize when to use imparfait in context.`,
    examples: [
      {
        spanish: 'Tous les matins, je prenais le bus.',
        english: 'Every morning, I used to take the bus.',
        highlight: ['prenais']
      },
      {
        spanish: 'Pendant que je cuisinais, il regardait la télé.',
        english: 'While I was cooking, he was watching TV.',
        highlight: ['cuisinais', 'regardait']
      },
      {
        spanish: 'À cette époque, nous habitions à Lyon.',
        english: 'At that time, we lived in Lyon.',
        highlight: ['habitions']
      },
      {
        spanish: 'Autrefois, les gens voyageaient moins.',
        english: 'In the past, people used to travel less.',
        highlight: ['voyageaient']
      }
    ]
  },
  {
    title: 'Storytelling with Imparfait',
    content: `The imparfait is essential for storytelling in French. It sets the scene, describes characters, and provides background information, while the passé composé moves the story forward with specific events.

**Pattern**: Imparfait for description + Passé composé for action

This creates vivid, engaging narratives in French.`,
    examples: [
      {
        spanish: 'Il était une fois une princesse qui habitait dans un château.',
        english: 'Once upon a time there was a princess who lived in a castle.',
        highlight: ['était', 'habitait']
      },
      {
        spanish: 'Le soleil brillait et les oiseaux chantaient quand soudain...',
        english: 'The sun was shining and the birds were singing when suddenly...',
        highlight: ['brillait', 'chantaient']
      },
      {
        spanish: 'Nous nous promenions dans le parc quand nous avons vu un accident.',
        english: 'We were walking in the park when we saw an accident.',
        highlight: ['promenions', 'avons vu']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'French Passé Composé',
    url: '/grammar/french/verbs/passe-compose',
    difficulty: 'intermediate'
  },
  {
    title: 'French Present Tense',
    url: '/grammar/french/verbs/present-tense',
    difficulty: 'beginner'
  },
  {
    title: 'French Future Tense',
    url: '/grammar/french/verbs/future',
    difficulty: 'intermediate'
  },
  {
    title: 'French Conditional',
    url: '/grammar/french/verbs/conditional',
    difficulty: 'advanced'
  }
];

export default function FrenchImparfaitPage() {
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
              topic: 'imparfait',
              title: 'French Imparfait Tense',
              description: 'Master French imparfait for describing past habits, ongoing actions, and background descriptions. Complete conjugation guide.',
              difficulty: 'intermediate',
              examples: [
                'Je parlais français (I was speaking French)',
                'Il faisait beau (The weather was nice)',
                'Nous habitions à Paris (We used to live in Paris)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'imparfait',
              title: 'French Imparfait Tense'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="imparfait"
        title="French Imparfait Tense"
        description="Master French imparfait for describing past habits, ongoing actions, and background descriptions. Complete conjugation guide"
        difficulty="intermediate"
        estimatedTime={22}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/imparfait/practice"
        quizUrl="/grammar/french/verbs/imparfait/quiz"
        songUrl="/songs/fr?theme=grammar&topic=imparfait"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
