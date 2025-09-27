import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'verbs',
  topic: 'passive-voice',
  title: 'German Passive Voice - Werden + Past Participle Formation',
  description: 'Master German passive voice including formation with werden, usage rules, and alternatives like man.',
  difficulty: 'advanced',
  keywords: [
    'german passive voice',
    'werden passive german',
    'german past participle',
    'passiv german grammar',
    'von durch german passive'
  ],
  examples: [
    'Das Haus wird gebaut. (The house is being built.)',
    'Der Brief wurde geschrieben. (The letter was written.)',
    'Das Auto ist repariert worden. (The car has been repaired.)',
    'Das Buch wird von ihm gelesen. (The book is read by him.)'
  ]
});

const sections = [
  {
    title: 'Understanding German Passive Voice',
    content: `German **passive voice** (Passiv) shifts focus from the **subject performing an action** to the **action itself** or the **object receiving the action**. It's formed with **werden + past participle**.

**Active vs Passive:**
- **Active**: Der Mann baut das Haus. (The man builds the house.)
- **Passive**: Das Haus wird gebaut. (The house is being built.)

**Key components:**
- **werden** (auxiliary verb) - conjugated according to tense
- **Past participle** - main verb in past participle form
- **Agent** (optional) - who performs the action (von + dative)

**When to use passive:**
- **Focus on action**: What happens is more important than who does it
- **Unknown agent**: Don't know who performs the action
- **General statements**: Impersonal constructions
- **Formal writing**: Academic, scientific, official texts

**Passive formation:**
**Subject + werden + past participle (+ von/durch + agent)**

**Why passive voice matters:**
- **Formal German**: Essential for academic and professional writing
- **News and reports**: Common in journalism
- **Instructions**: Recipes, manuals, procedures
- **Advanced proficiency**: Mark sophisticated German usage

Understanding passive voice is **crucial** for **advanced German proficiency**.`,
    examples: [
      {
        spanish: 'ACTIVE: Der Lehrer erklärt die Regel. (The teacher explains the rule.)',
        english: 'PASSIVE: Die Regel wird erklärt. (The rule is explained.)',
        highlight: ['wird erklärt']
      },
      {
        spanish: 'ACTIVE: Jemand hat das Auto gestohlen. (Someone stole the car.)',
        english: 'PASSIVE: Das Auto ist gestohlen worden. (The car has been stolen.)',
        highlight: ['ist gestohlen worden']
      }
    ]
  },
  {
    title: 'Formation of German Passive Voice',
    content: `**Passive formation** uses **werden + past participle**:`,
    conjugationTable: {
      title: 'Passive Formation Pattern',
      conjugations: [
        { pronoun: 'Present', form: 'wird/werden + past participle', english: 'Das Buch wird gelesen. (The book is read.)' },
        { pronoun: 'Past', form: 'wurde/wurden + past participle', english: 'Das Buch wurde gelesen. (The book was read.)' },
        { pronoun: 'Perfect', form: 'ist/sind + past participle + worden', english: 'Das Buch ist gelesen worden. (The book has been read.)' },
        { pronoun: 'Future', form: 'wird/werden + past participle + werden', english: 'Das Buch wird gelesen werden. (The book will be read.)' }
      ]
    },
    examples: [
      {
        spanish: 'PRESENT: Der Brief wird geschrieben. (The letter is being written.)',
        english: 'PAST: Der Brief wurde geschrieben. (The letter was written.)',
        highlight: ['wird geschrieben', 'wurde geschrieben']
      },
      {
        spanish: 'PERFECT: Der Brief ist geschrieben worden. (The letter has been written.)',
        english: 'FUTURE: Der Brief wird geschrieben werden. (The letter will be written.)',
        highlight: ['ist geschrieben worden', 'wird geschrieben werden']
      }
    ]
  },
  {
    title: 'Present Passive Formation',
    content: `**Present passive** uses present tense of werden + past participle:`,
    conjugationTable: {
      title: 'Present Passive Conjugation',
      conjugations: [
        { pronoun: 'ich', form: 'werde + past participle', english: 'Ich werde gefragt. (I am asked.)' },
        { pronoun: 'du', form: 'wirst + past participle', english: 'Du wirst gefragt. (You are asked.)' },
        { pronoun: 'er/sie/es', form: 'wird + past participle', english: 'Er wird gefragt. (He is asked.)' },
        { pronoun: 'wir', form: 'werden + past participle', english: 'Wir werden gefragt. (We are asked.)' },
        { pronoun: 'ihr', form: 'werdet + past participle', english: 'Ihr werdet gefragt. (You are asked.)' },
        { pronoun: 'sie/Sie', form: 'werden + past participle', english: 'Sie werden gefragt. (They/You are asked.)' }
      ]
    },
    examples: [
      {
        spanish: 'SINGULAR: Das Haus wird gebaut. (The house is being built.)',
        english: 'PLURAL: Die Häuser werden gebaut. (The houses are being built.)',
        highlight: ['wird gebaut', 'werden gebaut']
      },
      {
        spanish: 'PERSON: Ich werde oft gefragt. (I am often asked.)',
        english: 'THING: Das Problem wird diskutiert. (The problem is discussed.)',
        highlight: ['werde gefragt', 'wird diskutiert']
      }
    ]
  },
  {
    title: 'Past Passive Formation',
    content: `**Past passive** uses past tense of werden (wurde) + past participle:`,
    conjugationTable: {
      title: 'Past Passive Conjugation',
      conjugations: [
        { pronoun: 'ich', form: 'wurde + past participle', english: 'Ich wurde gefragt. (I was asked.)' },
        { pronoun: 'du', form: 'wurdest + past participle', english: 'Du wurdest gefragt. (You were asked.)' },
        { pronoun: 'er/sie/es', form: 'wurde + past participle', english: 'Er wurde gefragt. (He was asked.)' },
        { pronoun: 'wir', form: 'wurden + past participle', english: 'Wir wurden gefragt. (We were asked.)' },
        { pronoun: 'ihr', form: 'wurdet + past participle', english: 'Ihr wurdet gefragt. (You were asked.)' },
        { pronoun: 'sie/Sie', form: 'wurden + past participle', english: 'Sie wurden gefragt. (They/You were asked.)' }
      ]
    },
    examples: [
      {
        spanish: 'PAST: Das Auto wurde repariert. (The car was repaired.)',
        english: 'PAST: Die Bücher wurden verkauft. (The books were sold.)',
        highlight: ['wurde repariert', 'wurden verkauft']
      }
    ]
  },
  {
    title: 'Perfect Passive Formation',
    content: `**Perfect passive** uses sein + past participle + **worden** (not geworden):`,
    conjugationTable: {
      title: 'Perfect Passive Conjugation',
      conjugations: [
        { pronoun: 'ich', form: 'bin + past participle + worden', english: 'Ich bin gefragt worden. (I have been asked.)' },
        { pronoun: 'du', form: 'bist + past participle + worden', english: 'Du bist gefragt worden. (You have been asked.)' },
        { pronoun: 'er/sie/es', form: 'ist + past participle + worden', english: 'Er ist gefragt worden. (He has been asked.)' },
        { pronoun: 'wir', form: 'sind + past participle + worden', english: 'Wir sind gefragt worden. (We have been asked.)' },
        { pronoun: 'ihr', form: 'seid + past participle + worden', english: 'Ihr seid gefragt worden. (You have been asked.)' },
        { pronoun: 'sie/Sie', form: 'sind + past participle + worden', english: 'Sie sind gefragt worden. (They/You have been asked.)' }
      ]
    },
    examples: [
      {
        spanish: 'PERFECT: Das Problem ist gelöst worden. (The problem has been solved.)',
        english: 'PERFECT: Die Aufgabe ist gemacht worden. (The task has been done.)',
        highlight: ['ist gelöst worden', 'ist gemacht worden']
      }
    ],
    subsections: [
      {
        title: 'Important Note',
        content: 'In perfect passive, use "worden" (not "geworden"):',
        examples: [
          {
            spanish: '✅ Das ist gemacht worden. (That has been done.)',
            english: '❌ Das ist gemacht geworden. (Incorrect)',
            highlight: ['worden']
          }
        ]
      }
    ]
  },
  {
    title: 'Agent in Passive Voice - Von vs Durch',
    content: `**Agent** (who performs the action) can be expressed with **von** or **durch**:`,
    conjugationTable: {
      title: 'Von vs Durch Usage',
      conjugations: [
        { pronoun: 'von + dative', form: 'by (person/agent)', english: 'Das Buch wird von ihm gelesen. (The book is read by him.)' },
        { pronoun: 'durch + accusative', form: 'by means of/through', english: 'Das Haus wurde durch Feuer zerstört. (The house was destroyed by fire.)' },
        { pronoun: 'von (person)', form: 'human agent', english: 'Der Brief wurde von der Sekretärin geschrieben. (The letter was written by the secretary.)' },
        { pronoun: 'durch (means)', form: 'instrument/cause', english: 'Die Stadt wurde durch Bomben zerstört. (The city was destroyed by bombs.)' }
      ]
    },
    examples: [
      {
        spanish: 'VON (PERSON): Das Auto wird vom Mechaniker repariert. (The car is repaired by the mechanic.)',
        english: 'DURCH (MEANS): Das Fenster wurde durch den Ball zerbrochen. (The window was broken by the ball.)',
        highlight: ['vom Mechaniker', 'durch den Ball']
      }
    ]
  },
  {
    title: 'Passive with Modal Verbs',
    content: `**Modal verbs** can be used with passive infinitive:`,
    conjugationTable: {
      title: 'Modal Verbs + Passive',
      conjugations: [
        { pronoun: 'können', form: 'can be', english: 'Das kann gemacht werden. (That can be done.)' },
        { pronoun: 'müssen', form: 'must be', english: 'Das muss repariert werden. (That must be repaired.)' },
        { pronoun: 'sollen', form: 'should be', english: 'Das soll verkauft werden. (That should be sold.)' },
        { pronoun: 'dürfen', form: 'may be', english: 'Das darf nicht gesagt werden. (That may not be said.)' }
      ]
    },
    examples: [
      {
        spanish: 'KÖNNEN: Die Aufgabe kann heute gemacht werden. (The task can be done today.)',
        english: 'MÜSSEN: Das Auto muss repariert werden. (The car must be repaired.)',
        highlight: ['kann gemacht werden', 'muss repariert werden']
      }
    ]
  },
  {
    title: 'Alternatives to Passive Voice',
    content: `**German alternatives** to passive voice:`,
    conjugationTable: {
      title: 'Passive Alternatives',
      conjugations: [
        { pronoun: 'man + active', form: 'one/people', english: 'Man baut das Haus. (One builds the house.)' },
        { pronoun: 'sich lassen', form: 'can be done', english: 'Das lässt sich machen. (That can be done.)' },
        { pronoun: 'sein + zu + infinitive', form: 'is to be done', english: 'Das ist zu machen. (That is to be done.)' },
        { pronoun: '-bar adjectives', form: 'able to be', english: 'Das ist machbar. (That is doable.)' }
      ]
    },
    examples: [
      {
        spanish: 'MAN: Man spricht hier Deutsch. (German is spoken here.)',
        english: 'SICH LASSEN: Das Problem lässt sich lösen. (The problem can be solved.)',
        highlight: ['Man spricht', 'lässt sich lösen']
      },
      {
        spanish: 'SEIN + ZU: Die Aufgabe ist zu schwer zu machen. (The task is too hard to do.)',
        english: 'ADJECTIVE: Das ist nicht machbar. (That is not doable.)',
        highlight: ['ist zu machen', 'ist machbar']
      }
    ]
  },
  {
    title: 'Impersonal Passive',
    content: `**Impersonal passive** with intransitive verbs (no direct object):`,
    examples: [
      {
        spanish: 'INTRANSITIVE: Hier wird getanzt. (Dancing is done here. / There is dancing here.)',
        english: 'IMPERSONAL: Es wird viel gearbeitet. (A lot of work is done. / People work a lot.)',
        highlight: ['wird getanzt', 'wird gearbeitet']
      },
      {
        spanish: 'ACTIVITY: In der Küche wird gekocht. (Cooking is done in the kitchen.)',
        english: 'GENERAL: Sonntags wird nicht gearbeitet. (No work is done on Sundays.)',
        highlight: ['wird gekocht', 'wird nicht gearbeitet']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong auxiliary**: Using haben instead of sein in perfect passive
**2. Worden vs geworden**: Using geworden instead of worden
**3. Case errors**: Wrong case with von/durch
**4. Word order**: Wrong position of past participle`,
    examples: [
      {
        spanish: '❌ Das ist gemacht geworden → ✅ Das ist gemacht worden',
        english: 'Wrong: use "worden" (not "geworden") in perfect passive',
        highlight: ['ist gemacht worden']
      },
      {
        spanish: '❌ Das hat gemacht worden → ✅ Das ist gemacht worden',
        english: 'Wrong: use "sein" (not "haben") as auxiliary in passive',
        highlight: ['ist gemacht worden']
      },
      {
        spanish: '❌ von den Mechaniker → ✅ vom Mechaniker',
        english: 'Wrong: von takes dative case',
        highlight: ['vom Mechaniker']
      },
      {
        spanish: '❌ Das wird von durch ihn gemacht → ✅ Das wird von ihm gemacht',
        english: 'Wrong: don\'t mix von and durch',
        highlight: ['von ihm gemacht']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Past Participles', url: '/grammar/german/verbs/past-participles', difficulty: 'intermediate' },
  { title: 'German Modal Verbs', url: '/grammar/german/verbs/modal-verbs', difficulty: 'intermediate' },
  { title: 'German Perfect Tense', url: '/grammar/german/verbs/perfect-tense', difficulty: 'intermediate' },
  { title: 'German Word Order', url: '/grammar/german/syntax/word-order', difficulty: 'intermediate' }
];

export default function GermanPassiveVoicePage() {
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
              topic: 'passive-voice',
              title: 'German Passive Voice - Werden + Past Participle Formation',
              description: 'Master German passive voice including formation with werden, usage rules, and alternatives like man.',
              difficulty: 'advanced',
              examples: [
                'Das Haus wird gebaut. (The house is being built.)',
                'Der Brief wurde geschrieben. (The letter was written.)',
                'Das Auto ist repariert worden. (The car has been repaired.)',
                'Das Buch wird von ihm gelesen. (The book is read by him.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'verbs',
              topic: 'passive-voice',
              title: 'German Passive Voice - Werden + Past Participle Formation'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="verbs"
        topic="passive-voice"
        title="German Passive Voice - Werden + Past Participle Formation"
        description="Master German passive voice including formation with werden, usage rules, and alternatives like man"
        difficulty="advanced"
        estimatedTime={22}
        sections={sections}
        backUrl="/grammar/german/verbs"
        practiceUrl="/grammar/german/verbs/passive-voice/practice"
        quizUrl="/grammar/german/verbs/passive-voice/quiz"
        songUrl="/songs/de?theme=grammar&topic=passive-voice"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
