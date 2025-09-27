import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'verbs',
  topic: 'perfect-tense',
  title: 'German Perfect Tense (Perfekt)',
  description: 'Master German perfect tense with haben and sein auxiliaries. Essential for spoken German and conversational fluency.',
  difficulty: 'intermediate',
  keywords: [
    'german perfect tense',
    'perfekt deutsch',
    'haben sein auxiliary',
    'german past participle',
    'german conversational past',
    'german compound tense',
    'partizip perfekt'
  ],
  examples: [
    'Ich habe gesprochen (I have spoken)',
    'Du bist gegangen (You have gone)',
    'Er hat gearbeitet (He has worked)'
  ]
});

const sections = [
  {
    title: 'German Perfect Tense (Perfekt) Overview',
    content: `The German perfect tense (**Perfekt**) is the most commonly used past tense in **spoken German**. It's formed with an auxiliary verb (haben or sein) plus the past participle.

**Formula**: haben/sein + past participle
**Usage**: Conversational German, informal situations, completed actions

The Perfekt is essential for everyday German communication and is preferred over Präteritum in speech.`,
    examples: [
      {
        spanish: 'Ich habe Deutsch gelernt.',
        english: 'I have learned German. / I learned German.',
        highlight: ['habe', 'gelernt']
      },
      {
        spanish: 'Sie ist nach Hause gegangen.',
        english: 'She has gone home. / She went home.',
        highlight: ['ist', 'gegangen']
      },
      {
        spanish: 'Wir haben einen Film gesehen.',
        english: 'We have seen a movie. / We saw a movie.',
        highlight: ['haben', 'gesehen']
      }
    ]
  },
  {
    title: 'Auxiliary Verbs: Haben vs Sein',
    content: `The choice between **haben** and **sein** as auxiliary verbs follows specific rules:

**Haben** (most verbs):
- Transitive verbs (with direct object)
- Modal verbs
- Reflexive verbs
- Most other verbs

**Sein** (specific verbs):
- Verbs of motion (gehen, fahren, fliegen)
- Verbs of change of state (werden, sterben)
- Verbs of being/remaining (sein, bleiben)`,
    subsections: [
      {
        title: 'Verbs with Haben',
        content: `Most German verbs use **haben** as auxiliary:`,
        conjugationTable: {
          title: 'Haben (to have) - Present Tense',
          conjugations: [
            { pronoun: 'ich', form: 'habe', english: 'I have' },
            { pronoun: 'du', form: 'hast', english: 'you have' },
            { pronoun: 'er/sie/es', form: 'hat', english: 'he/she/it has' },
            { pronoun: 'wir', form: 'haben', english: 'we have' },
            { pronoun: 'ihr', form: 'habt', english: 'you have' },
            { pronoun: 'sie/Sie', form: 'haben', english: 'they/you have' }
          ]
        },
        examples: [
          {
            spanish: 'Ich habe ein Buch gelesen.',
            english: 'I have read a book. (transitive verb)',
            highlight: ['habe', 'gelesen']
          },
          {
            spanish: 'Du hast gut geschlafen.',
            english: 'You have slept well. (intransitive, no motion)',
            highlight: ['hast', 'geschlafen']
          },
          {
            spanish: 'Er hat sich gewaschen.',
            english: 'He has washed himself. (reflexive verb)',
            highlight: ['hat', 'gewaschen']
          }
        ]
      },
      {
        title: 'Verbs with Sein',
        content: `Specific verbs use **sein** as auxiliary:`,
        conjugationTable: {
          title: 'Sein (to be) - Present Tense',
          conjugations: [
            { pronoun: 'ich', form: 'bin', english: 'I am' },
            { pronoun: 'du', form: 'bist', english: 'you are' },
            { pronoun: 'er/sie/es', form: 'ist', english: 'he/she/it is' },
            { pronoun: 'wir', form: 'sind', english: 'we are' },
            { pronoun: 'ihr', form: 'seid', english: 'you are' },
            { pronoun: 'sie/Sie', form: 'sind', english: 'they/you are' }
          ]
        },
        examples: [
          {
            spanish: 'Ich bin nach Berlin gefahren.',
            english: 'I have driven to Berlin. (motion)',
            highlight: ['bin', 'gefahren']
          },
          {
            spanish: 'Du bist müde geworden.',
            english: 'You have become tired. (change of state)',
            highlight: ['bist', 'geworden']
          },
          {
            spanish: 'Sie ist zu Hause geblieben.',
            english: 'She has stayed at home. (remaining)',
            highlight: ['ist', 'geblieben']
          }
        ]
      }
    ]
  },
  {
    title: 'Past Participle Formation',
    content: `The past participle (**Partizip Perfekt**) is formed differently for regular and irregular verbs:

**Regular verbs**: ge- + stem + -t
**Irregular verbs**: ge- + changed stem + -en
**Separable verbs**: prefix + ge- + stem + -t/-en
**Inseparable verbs**: no ge- prefix`,
    subsections: [
      {
        title: 'Regular Past Participles',
        content: `Regular verbs follow the pattern: **ge- + stem + -t**`,
        conjugationTable: {
          title: 'Regular Past Participles',
          conjugations: [
            { pronoun: 'lernen', form: 'gelernt', english: 'learned' },
            { pronoun: 'arbeiten', form: 'gearbeitet', english: 'worked' },
            { pronoun: 'spielen', form: 'gespielt', english: 'played' },
            { pronoun: 'kaufen', form: 'gekauft', english: 'bought' },
            { pronoun: 'machen', form: 'gemacht', english: 'made/done' },
            { pronoun: 'sagen', form: 'gesagt', english: 'said' }
          ]
        },
        examples: [
          {
            spanish: 'Ich habe Deutsch gelernt.',
            english: 'I have learned German.',
            highlight: ['gelernt']
          },
          {
            spanish: 'Du hast hart gearbeitet.',
            english: 'You have worked hard.',
            highlight: ['gearbeitet']
          },
          {
            spanish: 'Wir haben Fußball gespielt.',
            english: 'We have played football.',
            highlight: ['gespielt']
          }
        ]
      },
      {
        title: 'Irregular Past Participles',
        content: `Irregular verbs follow the pattern: **ge- + changed stem + -en**`,
        conjugationTable: {
          title: 'Irregular Past Participles',
          conjugations: [
            { pronoun: 'sprechen', form: 'gesprochen', english: 'spoken' },
            { pronoun: 'gehen', form: 'gegangen', english: 'gone' },
            { pronoun: 'sehen', form: 'gesehen', english: 'seen' },
            { pronoun: 'kommen', form: 'gekommen', english: 'come' },
            { pronoun: 'nehmen', form: 'genommen', english: 'taken' },
            { pronoun: 'geben', form: 'gegeben', english: 'given' }
          ]
        },
        examples: [
          {
            spanish: 'Ich habe mit ihm gesprochen.',
            english: 'I have spoken with him.',
            highlight: ['gesprochen']
          },
          {
            spanish: 'Sie ist nach Hause gegangen.',
            english: 'She has gone home.',
            highlight: ['gegangen']
          },
          {
            spanish: 'Wir haben den Film gesehen.',
            english: 'We have seen the movie.',
            highlight: ['gesehen']
          }
        ]
      }
    ]
  },
  {
    title: 'Separable and Inseparable Verbs',
    content: `Separable and inseparable prefix verbs have special past participle formation rules:`,
    subsections: [
      {
        title: 'Separable Verbs',
        content: `**ge-** goes between the prefix and the stem:`,
        conjugationTable: {
          title: 'Separable Verb Past Participles',
          conjugations: [
            { pronoun: 'aufstehen', form: 'aufgestanden', english: 'gotten up' },
            { pronoun: 'ankommen', form: 'angekommen', english: 'arrived' },
            { pronoun: 'einkaufen', form: 'eingekauft', english: 'shopped' },
            { pronoun: 'mitkommen', form: 'mitgekommen', english: 'come along' },
            { pronoun: 'zurückgehen', form: 'zurückgegangen', english: 'gone back' }
          ]
        },
        examples: [
          {
            spanish: 'Ich bin früh aufgestanden.',
            english: 'I got up early.',
            highlight: ['aufgestanden']
          },
          {
            spanish: 'Der Zug ist angekommen.',
            english: 'The train has arrived.',
            highlight: ['angekommen']
          },
          {
            spanish: 'Wir haben eingekauft.',
            english: 'We have gone shopping.',
            highlight: ['eingekauft']
          }
        ]
      },
      {
        title: 'Inseparable Verbs',
        content: `**No ge-** prefix with inseparable verbs:`,
        conjugationTable: {
          title: 'Inseparable Verb Past Participles',
          conjugations: [
            { pronoun: 'verstehen', form: 'verstanden', english: 'understood' },
            { pronoun: 'bekommen', form: 'bekommen', english: 'received' },
            { pronoun: 'erzählen', form: 'erzählt', english: 'told' },
            { pronoun: 'besuchen', form: 'besucht', english: 'visited' },
            { pronoun: 'entscheiden', form: 'entschieden', english: 'decided' }
          ]
        },
        examples: [
          {
            spanish: 'Ich habe alles verstanden.',
            english: 'I have understood everything.',
            highlight: ['verstanden']
          },
          {
            spanish: 'Du hast einen Brief bekommen.',
            english: 'You have received a letter.',
            highlight: ['bekommen']
          },
          {
            spanish: 'Sie hat uns besucht.',
            english: 'She has visited us.',
            highlight: ['besucht']
          }
        ]
      }
    ]
  },
  {
    title: 'Word Order in Perfect Tense',
    content: `German word order in perfect tense follows specific rules:

**Main clause**: Subject + auxiliary verb + ... + past participle (at end)
**Question**: Auxiliary verb + subject + ... + past participle (at end)
**Subordinate clause**: Subject + ... + past participle + auxiliary verb (at end)

The past participle goes to the end of the clause in main clauses and questions.`,
    examples: [
      {
        spanish: 'Ich habe gestern einen Film gesehen.',
        english: 'I saw a movie yesterday. (main clause)',
        highlight: ['habe', 'gesehen']
      },
      {
        spanish: 'Hast du das Buch gelesen?',
        english: 'Have you read the book? (question)',
        highlight: ['Hast', 'gelesen']
      },
      {
        spanish: 'Ich weiß, dass er gekommen ist.',
        english: 'I know that he has come. (subordinate clause)',
        highlight: ['gekommen', 'ist']
      },
      {
        spanish: 'Sie ist nach Berlin gefahren und hat dort gearbeitet.',
        english: 'She went to Berlin and worked there. (compound sentence)',
        highlight: ['ist', 'gefahren', 'hat', 'gearbeitet']
      }
    ]
  },
  {
    title: 'Perfect Tense vs Other Past Tenses',
    content: `Understanding when to use Perfekt vs other past tenses:

**Perfekt (Perfect)**:
- Spoken German (most common)
- Conversational situations
- Completed actions with present relevance

**Präteritum (Simple Past)**:
- Written German (stories, news)
- Formal situations
- Modal verbs (even in speech)

**Plusquamperfekt (Past Perfect)**:
- Actions completed before another past action
- "Had done" constructions`,
    examples: [
      {
        spanish: 'Spoken: Ich habe das Buch gelesen.',
        english: 'Spoken: I have read the book. (Perfekt)',
        highlight: ['habe', 'gelesen']
      },
      {
        spanish: 'Written: Ich las das Buch.',
        english: 'Written: I read the book. (Präteritum)',
        highlight: ['las']
      },
      {
        spanish: 'Sequence: Nachdem ich das Buch gelesen hatte, ging ich schlafen.',
        english: 'Sequence: After I had read the book, I went to sleep. (Plusquamperfekt + Präteritum)',
        highlight: ['gelesen hatte', 'ging']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'German Present Tense',
    url: '/grammar/german/verbs/present-tense',
    difficulty: 'beginner'
  },
  {
    title: 'German Past Tense',
    url: '/grammar/german/verbs/past-tense',
    difficulty: 'intermediate'
  },
  {
    title: 'German Separable Verbs',
    url: '/grammar/german/verbs/separable-verbs',
    difficulty: 'intermediate'
  },
  {
    title: 'German Word Order',
    url: '/grammar/german/syntax/word-order',
    difficulty: 'intermediate'
  }
];

export default function GermanPerfectTensePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'german',
              category: 'verbs',
              topic: 'perfect-tense',
              title: 'German Perfect Tense (Perfekt)',
              description: 'Master German perfect tense with haben and sein auxiliaries. Essential for spoken German and conversational fluency.',
              difficulty: 'intermediate',
              examples: [
                'Ich habe gesprochen (I have spoken)',
                'Du bist gegangen (You have gone)',
                'Er hat gearbeitet (He has worked)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'verbs',
              topic: 'perfect-tense',
              title: 'German Perfect Tense (Perfekt)'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="german"
        category="verbs"
        topic="perfect-tense"
        title="German Perfect Tense (Perfekt)"
        description="Master German perfect tense with haben and sein auxiliaries. Essential for spoken German and conversational fluency"
        difficulty="intermediate"
        estimatedTime={35}
        sections={sections}
        backUrl="/grammar/german/verbs"
        practiceUrl="/grammar/german/verbs/perfect-tense/practice"
        quizUrl="/grammar/german/verbs/perfect-tense/quiz"
        songUrl="/songs/de?theme=grammar&topic=perfect-tense"
        youtubeVideoId="dQw4w9WgXcQ"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
