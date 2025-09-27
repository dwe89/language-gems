import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'verbs',
  topic: 'present-tense',
  title: 'German Present Tense',
  description: 'Master German present tense conjugations for regular and irregular verbs. Complete guide with examples and practice.',
  difficulty: 'beginner',
  keywords: [
    'german present tense',
    'german verb conjugation',
    'präsens deutsch',
    'german grammar present',
    'german verbs present',
    'conjugate german verbs',
    'german grammar basics'
  ],
  examples: [
    'ich spreche Deutsch (I speak German)',
    'du gehst zur Schule (you go to school)',
    'er ist sehr nett (he is very nice)'
  ]
});

const sections = [
  {
    title: 'German Present Tense Overview',
    content: `The German present tense (**Präsens**) is used to express actions happening now, habitual actions, and general truths. Unlike English, German has only one present tense form, which can translate to multiple English forms.

German verbs are categorized into **regular (weak) verbs** and **irregular (strong) verbs**. Regular verbs follow predictable patterns, while irregular verbs have stem changes or unique conjugations.`,
    examples: [
      {
        spanish: 'Ich spreche jeden Tag Deutsch.',
        english: 'I speak German every day. (habitual action)',
        highlight: ['spreche']
      },
      {
        spanish: 'Sie arbeitet gerade im Büro.',
        english: 'She is working in the office right now. (current action)',
        highlight: ['arbeitet']
      },
      {
        spanish: 'Wasser kocht bei 100 Grad.',
        english: 'Water boils at 100 degrees. (general truth)',
        highlight: ['kocht']
      }
    ]
  },
  {
    title: 'Regular Verb Conjugation',
    content: `Regular German verbs follow a predictable pattern. Remove the **-en** ending from the infinitive and add the appropriate present tense endings.

**Formula**: Verb stem + present tense ending
**Example**: sprechen → sprech- → ich spreche, du sprichst, etc.`,
    subsections: [
      {
        title: 'Present Tense Endings',
        content: `All regular German verbs use these endings:`,
        conjugationTable: {
          title: 'Regular Present Tense Endings',
          conjugations: [
            { pronoun: 'ich', form: '-e', english: 'I' },
            { pronoun: 'du', form: '-st', english: 'you (informal)' },
            { pronoun: 'er/sie/es', form: '-t', english: 'he/she/it' },
            { pronoun: 'wir', form: '-en', english: 'we' },
            { pronoun: 'ihr', form: '-t', english: 'you (plural)' },
            { pronoun: 'sie/Sie', form: '-en', english: 'they/you (formal)' }
          ]
        },
        examples: [
          {
            spanish: 'sprechen → ich spreche, du sprichst, er spricht...',
            english: 'to speak → I speak, you speak, he speaks...',
            highlight: ['spreche', 'sprichst', 'spricht']
          }
        ]
      },
      {
        title: 'Regular Verb Examples',
        content: `Here are common regular verbs conjugated in the present tense:`,
        conjugationTable: {
          title: 'Lernen (to learn) - Present Tense',
          conjugations: [
            { pronoun: 'ich', form: 'lerne', english: 'I learn' },
            { pronoun: 'du', form: 'lernst', english: 'you learn' },
            { pronoun: 'er/sie/es', form: 'lernt', english: 'he/she/it learns' },
            { pronoun: 'wir', form: 'lernen', english: 'we learn' },
            { pronoun: 'ihr', form: 'lernt', english: 'you learn' },
            { pronoun: 'sie/Sie', form: 'lernen', english: 'they/you learn' }
          ]
        },
        examples: [
          {
            spanish: 'Ich lerne Deutsch in der Schule.',
            english: 'I learn German at school.',
            highlight: ['lerne']
          },
          {
            spanish: 'Wir arbeiten zusammen.',
            english: 'We work together. (arbeiten - to work)',
            highlight: ['arbeiten']
          },
          {
            spanish: 'Sie spielen Fußball.',
            english: 'They play football. (spielen - to play)',
            highlight: ['spielen']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Verbs (Strong Verbs)',
    content: `Irregular verbs in German often have **stem changes** in the du and er/sie/es forms. These changes must be memorized as they don't follow a predictable pattern.`,
    subsections: [
      {
        title: 'Common Stem Changes',
        content: `The most common stem changes in German irregular verbs:

**a → ä**: fahren → du fährst, er fährt
**e → i**: sprechen → du sprichst, er spricht  
**e → ie**: lesen → du liest, er liest
**o → ö**: stoßen → du stößt, er stößt`,
        conjugationTable: {
          title: 'Sprechen (to speak) - Irregular Present Tense',
          conjugations: [
            { pronoun: 'ich', form: 'spreche', english: 'I speak' },
            { pronoun: 'du', form: 'sprichst', english: 'you speak (e→i)' },
            { pronoun: 'er/sie/es', form: 'spricht', english: 'he/she/it speaks (e→i)' },
            { pronoun: 'wir', form: 'sprechen', english: 'we speak' },
            { pronoun: 'ihr', form: 'sprecht', english: 'you speak' },
            { pronoun: 'sie/Sie', form: 'sprechen', english: 'they/you speak' }
          ]
        },
        examples: [
          {
            spanish: 'Du sprichst sehr gut Deutsch!',
            english: 'You speak German very well!',
            highlight: ['sprichst']
          },
          {
            spanish: 'Er fährt mit dem Auto zur Arbeit.',
            english: 'He drives to work by car. (fahren → fährt)',
            highlight: ['fährt']
          },
          {
            spanish: 'Sie liest ein interessantes Buch.',
            english: 'She reads an interesting book. (lesen → liest)',
            highlight: ['liest']
          }
        ]
      }
    ]
  },
  {
    title: 'Most Important Irregular Verbs',
    content: `These are the most frequently used irregular verbs in German that you should master first:`,
    subsections: [
      {
        title: 'Sein (to be) - Completely Irregular',
        content: `**Sein** is the most important verb in German and is completely irregular:`,
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
            spanish: 'Ich bin Student.',
            english: 'I am a student.',
            highlight: ['bin']
          },
          {
            spanish: 'Du bist sehr nett.',
            english: 'You are very nice.',
            highlight: ['bist']
          },
          {
            spanish: 'Wir sind aus Deutschland.',
            english: 'We are from Germany.',
            highlight: ['sind']
          }
        ]
      },
      {
        title: 'Haben (to have) - Irregular',
        content: `**Haben** is essential for forming compound tenses:`,
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
            spanish: 'Ich habe einen Hund.',
            english: 'I have a dog.',
            highlight: ['habe']
          },
          {
            spanish: 'Du hast Recht.',
            english: 'You are right. (literally: You have right)',
            highlight: ['hast']
          },
          {
            spanish: 'Sie hat viel Zeit.',
            english: 'She has a lot of time.',
            highlight: ['hat']
          }
        ]
      },
      {
        title: 'Werden (to become) - Irregular',
        content: `**Werden** is used for future tense and passive voice:`,
        conjugationTable: {
          title: 'Werden (to become) - Present Tense',
          conjugations: [
            { pronoun: 'ich', form: 'werde', english: 'I become' },
            { pronoun: 'du', form: 'wirst', english: 'you become' },
            { pronoun: 'er/sie/es', form: 'wird', english: 'he/she/it becomes' },
            { pronoun: 'wir', form: 'werden', english: 'we become' },
            { pronoun: 'ihr', form: 'werdet', english: 'you become' },
            { pronoun: 'sie/Sie', form: 'werden', english: 'they/you become' }
          ]
        },
        examples: [
          {
            spanish: 'Ich werde müde.',
            english: 'I am getting tired.',
            highlight: ['werde']
          },
          {
            spanish: 'Du wirst Arzt.',
            english: 'You are becoming a doctor.',
            highlight: ['wirst']
          },
          {
            spanish: 'Es wird kalt.',
            english: 'It is getting cold.',
            highlight: ['wird']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses of German Present Tense',
    content: `The German present tense has several uses:

**1. Current actions**: What's happening now
**2. Habitual actions**: Regular activities  
**3. General truths**: Facts and universal statements
**4. Future actions**: Near future events (with time expressions)
**5. Historical present**: Dramatic narration

Understanding these uses helps you communicate effectively in German.`,
    examples: [
      {
        spanish: 'Ich esse gerade.',
        english: 'I am eating right now. (current action)',
        highlight: ['esse']
      },
      {
        spanish: 'Er arbeitet jeden Tag.',
        english: 'He works every day. (habitual)',
        highlight: ['arbeitet']
      },
      {
        spanish: 'Die Sonne scheint im Osten.',
        english: 'The sun shines in the east. (general truth)',
        highlight: ['scheint']
      },
      {
        spanish: 'Morgen fahre ich nach Berlin.',
        english: 'Tomorrow I\'m going to Berlin. (future with time expression)',
        highlight: ['fahre']
      }
    ]
  },
  {
    title: 'Word Order with Present Tense',
    content: `German word order is crucial for correct sentence construction:

**Main clause**: Subject + Verb + Object (SVO)
**Question**: Verb + Subject + Object (VSO)
**Time-Manner-Place**: Time expressions come before manner, which comes before place

German is a **V2 language**, meaning the verb always comes in the second position in main clauses.`,
    examples: [
      {
        spanish: 'Ich lese ein Buch.',
        english: 'I read a book. (SVO)',
        highlight: ['lese']
      },
      {
        spanish: 'Liest du ein Buch?',
        english: 'Are you reading a book? (VSO)',
        highlight: ['Liest']
      },
      {
        spanish: 'Heute fahre ich mit dem Auto nach München.',
        english: 'Today I drive by car to Munich. (Time-Manner-Place)',
        highlight: ['fahre']
      },
      {
        spanish: 'Morgen bin ich in der Schule.',
        english: 'Tomorrow I am at school. (Time expression + V2)',
        highlight: ['bin']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'German Past Tense',
    url: '/grammar/german/verbs/past-tense',
    difficulty: 'intermediate'
  },
  {
    title: 'German Modal Verbs',
    url: '/grammar/german/verbs/modal-verbs',
    difficulty: 'intermediate'
  },
  {
    title: 'German Cases',
    url: '/grammar/german/cases/nominative',
    difficulty: 'beginner'
  },
  {
    title: 'German Word Order',
    url: '/grammar/german/syntax/word-order',
    difficulty: 'intermediate'
  }
];

export default function GermanPresentTensePage() {
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
              topic: 'present-tense',
              title: 'German Present Tense',
              description: 'Master German present tense conjugations for regular and irregular verbs. Complete guide with examples and practice.',
              difficulty: 'beginner',
              examples: [
                'ich spreche Deutsch (I speak German)',
                'du gehst zur Schule (you go to school)',
                'er ist sehr nett (he is very nice)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'verbs',
              topic: 'present-tense',
              title: 'German Present Tense'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="german"
        category="verbs"
        topic="present-tense"
        title="German Present Tense"
        description="Master German present tense conjugations for regular and irregular verbs. Complete guide with examples and practice"
        difficulty="beginner"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/german/verbs"
        practiceUrl="/grammar/german/verbs/present-tense/practice"
        quizUrl="/grammar/german/verbs/present-tense/quiz"
        songUrl="/songs/de?theme=grammar&topic=present-tense"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
