import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'passe-compose',
  title: 'French Passé Composé',
  description: 'Master French passé composé with avoir and être. Complete guide to past tense formation, agreement rules, and examples.',
  difficulty: 'intermediate',
  keywords: [
    'french passé composé',
    'passé composé avoir être',
    'french past tense',
    'french compound past',
    'participe passé',
    'past participle french',
    'french grammar'
  ],
  examples: [
    'J\'ai mangé (I ate/have eaten)',
    'Elle est allée (She went/has gone)',
    'Nous avons fini (We finished/have finished)'
  ]
});

const sections = [
  {
    title: 'What is the Passé Composé?',
    content: `The French passé composé is a **compound past tense** used to express completed actions in the past. It's equivalent to both the English simple past ("I ate") and present perfect ("I have eaten").

The passé composé is formed with an **auxiliary verb** (avoir or être) in the present tense + a **past participle**. This is one of the most important tenses in French for everyday conversation.`,
    examples: [
      {
        spanish: 'J\'ai mangé une pomme.',
        english: 'I ate an apple. / I have eaten an apple.',
        highlight: ['ai mangé']
      },
      {
        spanish: 'Elle est arrivée hier.',
        english: 'She arrived yesterday. / She has arrived yesterday.',
        highlight: ['est arrivée']
      },
      {
        spanish: 'Nous avons fini nos devoirs.',
        english: 'We finished our homework. / We have finished our homework.',
        highlight: ['avons fini']
      }
    ]
  },
  {
    title: 'Formation with AVOIR',
    content: `Most French verbs form the passé composé with **avoir** as the auxiliary verb. This includes all transitive verbs (verbs that take a direct object) and most intransitive verbs.`,
    subsections: [
      {
        title: 'Avoir + Past Participle',
        content: `**Formula**: Subject + avoir (present) + past participle

The past participle formation depends on the verb group:
**-ER verbs**: -é (parlé, mangé, étudié)
**-IR verbs**: -i (fini, choisi, réussi)  
**-RE verbs**: -u (vendu, attendu, répondu)`,
        conjugationTable: {
          title: 'Manger (to eat) - Passé Composé with Avoir',
          conjugations: [
            { pronoun: 'j\'', form: 'ai mangé', english: 'I ate/have eaten' },
            { pronoun: 'tu', form: 'as mangé', english: 'you ate/have eaten' },
            { pronoun: 'il/elle/on', form: 'a mangé', english: 'he/she/one ate/has eaten' },
            { pronoun: 'nous', form: 'avons mangé', english: 'we ate/have eaten' },
            { pronoun: 'vous', form: 'avez mangé', english: 'you ate/have eaten' },
            { pronoun: 'ils/elles', form: 'ont mangé', english: 'they ate/have eaten' }
          ]
        },
        examples: [
          {
            spanish: 'J\'ai parlé avec le professeur.',
            english: 'I spoke with the teacher.',
            highlight: ['ai parlé']
          },
          {
            spanish: 'Tu as fini tes devoirs?',
            english: 'Did you finish your homework?',
            highlight: ['as fini']
          },
          {
            spanish: 'Ils ont vendu leur maison.',
            english: 'They sold their house.',
            highlight: ['ont vendu']
          }
        ]
      },
      {
        title: 'Irregular Past Participles',
        content: `Many common verbs have **irregular past participles** that must be memorized:`,
        conjugationTable: {
          title: 'Common Irregular Past Participles',
          conjugations: [
            { pronoun: 'avoir (to have)', form: 'eu', english: 'had' },
            { pronoun: 'être (to be)', form: 'été', english: 'been' },
            { pronoun: 'faire (to do/make)', form: 'fait', english: 'done/made' },
            { pronoun: 'voir (to see)', form: 'vu', english: 'seen' },
            { pronoun: 'prendre (to take)', form: 'pris', english: 'taken' },
            { pronoun: 'mettre (to put)', form: 'mis', english: 'put' }
          ]
        },
        examples: [
          {
            spanish: 'J\'ai eu de la chance.',
            english: 'I was lucky. (literally: I had luck)',
            highlight: ['ai eu']
          },
          {
            spanish: 'Elle a fait ses devoirs.',
            english: 'She did her homework.',
            highlight: ['a fait']
          },
          {
            spanish: 'Nous avons vu un film.',
            english: 'We saw a movie.',
            highlight: ['avons vu']
          }
        ]
      }
    ]
  },
  {
    title: 'Formation with ÊTRE',
    content: `Some French verbs use **être** as the auxiliary verb instead of avoir. These include verbs of movement, change of state, and all reflexive verbs.`,
    subsections: [
      {
        title: 'Verbs that use ÊTRE',
        content: `**Movement verbs**: aller, venir, partir, arriver, entrer, sortir, monter, descendre, passer, retourner, tomber, rester, naître, mourir

**Memory tip**: Use the acronym **DR MRS VANDERTRAMP** or think of them as verbs describing movement or change of state.`,
        conjugationTable: {
          title: 'Aller (to go) - Passé Composé with Être',
          conjugations: [
            { pronoun: 'je', form: 'suis allé(e)', english: 'I went/have gone' },
            { pronoun: 'tu', form: 'es allé(e)', english: 'you went/have gone' },
            { pronoun: 'il/elle/on', form: 'est allé/allée', english: 'he/she/one went/has gone' },
            { pronoun: 'nous', form: 'sommes allé(e)s', english: 'we went/have gone' },
            { pronoun: 'vous', form: 'êtes allé(e)(s)', english: 'you went/have gone' },
            { pronoun: 'ils/elles', form: 'sont allés/allées', english: 'they went/have gone' }
          ]
        },
        examples: [
          {
            spanish: 'Je suis allé au cinéma.',
            english: 'I went to the movies. (masculine speaker)',
            highlight: ['suis allé']
          },
          {
            spanish: 'Elle est arrivée en retard.',
            english: 'She arrived late.',
            highlight: ['est arrivée']
          },
          {
            spanish: 'Nous sommes partis tôt.',
            english: 'We left early.',
            highlight: ['sommes partis']
          }
        ]
      },
      {
        title: 'Agreement with ÊTRE',
        content: `When using être, the **past participle agrees** with the subject in gender and number:

**Masculine singular**: no change (allé)
**Feminine singular**: add -e (allée)
**Masculine plural**: add -s (allés)
**Feminine plural**: add -es (allées)`,
        conjugationTable: {
          title: 'Past Participle Agreement with ÊTRE',
          conjugations: [
            { pronoun: 'Il est allé', form: 'masculine singular', english: 'He went' },
            { pronoun: 'Elle est allée', form: 'feminine singular', english: 'She went' },
            { pronoun: 'Ils sont allés', form: 'masculine plural', english: 'They went (masc.)' },
            { pronoun: 'Elles sont allées', form: 'feminine plural', english: 'They went (fem.)' }
          ]
        },
        examples: [
          {
            spanish: 'Marie est née en France.',
            english: 'Marie was born in France.',
            highlight: ['est née']
          },
          {
            spanish: 'Les filles sont sorties ensemble.',
            english: 'The girls went out together.',
            highlight: ['sont sorties']
          },
          {
            spanish: 'Mon frère est resté à la maison.',
            english: 'My brother stayed home.',
            highlight: ['est resté']
          }
        ]
      }
    ]
  },
  {
    title: 'Reflexive Verbs in Passé Composé',
    content: `**All reflexive verbs** use être in the passé composé. The reflexive pronoun comes before the auxiliary verb, and the past participle usually agrees with the subject.`,
    subsections: [
      {
        title: 'Reflexive Verb Formation',
        content: `**Formula**: Subject + reflexive pronoun + être + past participle

The reflexive pronouns are: me, te, se, nous, vous, se`,
        conjugationTable: {
          title: 'Se laver (to wash oneself) - Reflexive Passé Composé',
          conjugations: [
            { pronoun: 'je', form: 'me suis lavé(e)', english: 'I washed myself' },
            { pronoun: 'tu', form: 't\'es lavé(e)', english: 'you washed yourself' },
            { pronoun: 'il/elle/on', form: 's\'est lavé/lavée', english: 'he/she washed himself/herself' },
            { pronoun: 'nous', form: 'nous sommes lavé(e)s', english: 'we washed ourselves' },
            { pronoun: 'vous', form: 'vous êtes lavé(e)(s)', english: 'you washed yourself/yourselves' },
            { pronoun: 'ils/elles', form: 'se sont lavés/lavées', english: 'they washed themselves' }
          ]
        },
        examples: [
          {
            spanish: 'Je me suis levé à huit heures.',
            english: 'I got up at eight o\'clock.',
            highlight: ['me suis levé']
          },
          {
            spanish: 'Elle s\'est couchée tard.',
            english: 'She went to bed late.',
            highlight: ['s\'est couchée']
          },
          {
            spanish: 'Nous nous sommes amusés.',
            english: 'We had fun.',
            highlight: ['nous sommes amusés']
          }
        ]
      }
    ]
  },
  {
    title: 'Negative and Interrogative Forms',
    content: `In negative and interrogative forms, the auxiliary verb (avoir or être) is modified, while the past participle remains unchanged.`,
    examples: [
      {
        spanish: 'Je n\'ai pas mangé.',
        english: 'I didn\'t eat. (negative with avoir)',
        highlight: ['n\'ai pas']
      },
      {
        spanish: 'Elle n\'est pas venue.',
        english: 'She didn\'t come. (negative with être)',
        highlight: ['n\'est pas']
      },
      {
        spanish: 'As-tu fini tes devoirs?',
        english: 'Did you finish your homework? (question with avoir)',
        highlight: ['As-tu']
      },
      {
        spanish: 'Est-elle arrivée?',
        english: 'Did she arrive? (question with être)',
        highlight: ['Est-elle']
      },
      {
        spanish: 'Qu\'est-ce que tu as fait?',
        english: 'What did you do? (question with qu\'est-ce que)',
        highlight: ['as fait']
      }
    ]
  },
  {
    title: 'When to Use Passé Composé',
    content: `Use the passé composé for:

**1. Completed actions**: Actions that are finished
**2. Specific events**: Actions that happened at a specific time
**3. Series of events**: Sequential actions in the past
**4. Actions with results**: Past actions affecting the present

The passé composé contrasts with the imparfait, which describes ongoing or habitual past actions.`,
    examples: [
      {
        spanish: 'J\'ai étudié hier soir.',
        english: 'I studied last night. (completed action)',
        highlight: ['ai étudié']
      },
      {
        spanish: 'Il est né le 15 mai.',
        english: 'He was born on May 15th. (specific event)',
        highlight: ['est né']
      },
      {
        spanish: 'Elle a ouvert la porte et elle est entrée.',
        english: 'She opened the door and entered. (series of events)',
        highlight: ['a ouvert', 'est entrée']
      },
      {
        spanish: 'J\'ai perdu mes clés.',
        english: 'I lost my keys. (result affects present)',
        highlight: ['ai perdu']
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
    title: 'French Imparfait',
    url: '/grammar/french/verbs/imparfait',
    difficulty: 'intermediate'
  },
  {
    title: 'French Reflexive Verbs',
    url: '/grammar/french/verbs/reflexive-verbs',
    difficulty: 'intermediate'
  },
  {
    title: 'French Past Participle Agreement',
    url: '/grammar/french/verbs/past-participle',
    difficulty: 'advanced'
  }
];

export default function FrenchPasseComposePage() {
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
              topic: 'passe-compose',
              title: 'French Passé Composé',
              description: 'Master French passé composé with avoir and être. Complete guide to past tense formation, agreement rules, and examples.',
              difficulty: 'intermediate',
              examples: [
                'J\'ai mangé (I ate/have eaten)',
                'Elle est allée (She went/has gone)',
                'Nous avons fini (We finished/have finished)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'passe-compose',
              title: 'French Passé Composé'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="passe-compose"
        title="French Passé Composé"
        description="Master French passé composé with avoir and être. Complete guide to past tense formation, agreement rules, and examples"
        difficulty="intermediate"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/passe-compose/practice"
        quizUrl="/grammar/french/verbs/passe-compose/quiz"
        songUrl="/songs/fr?theme=grammar&topic=passe-compose"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
