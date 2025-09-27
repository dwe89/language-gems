import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'verbs',
  topic: 'past-tense',
  title: 'German Past Tense (Präteritum)',
  description: 'Master German simple past tense (Präteritum) for narrative and formal writing. Complete guide with regular and irregular verbs.',
  difficulty: 'intermediate',
  keywords: [
    'german past tense',
    'präteritum deutsch',
    'german simple past',
    'german narrative tense',
    'german preterite',
    'german imperfect',
    'german past conjugation'
  ],
  examples: [
    'Ich sprach Deutsch (I spoke German)',
    'Du warst müde (You were tired)',
    'Er hatte Zeit (He had time)'
  ]
});

const sections = [
  {
    title: 'German Past Tense (Präteritum) Overview',
    content: `The German past tense (**Präteritum**), also called simple past or imperfect, is primarily used in **written German** for storytelling, news reports, and formal writing. In spoken German, the perfect tense (Perfekt) is more commonly used.

**Key Uses:**
- **Narrative writing**: Stories, novels, fairy tales
- **News reports**: Formal journalism
- **Historical accounts**: Academic and formal texts
- **Modal verbs**: Even in spoken German, modal verbs often use Präteritum

The Präteritum is essential for reading German literature and understanding formal German texts.`,
    examples: [
      {
        spanish: 'Es war einmal ein König...',
        english: 'Once upon a time there was a king... (fairy tale)',
        highlight: ['war']
      },
      {
        spanish: 'Der Präsident sprach gestern im Parlament.',
        english: 'The president spoke yesterday in parliament. (news)',
        highlight: ['sprach']
      },
      {
        spanish: 'Sie konnte nicht kommen.',
        english: 'She couldn\'t come. (modal verb in spoken German)',
        highlight: ['konnte']
      }
    ]
  },
  {
    title: 'Regular Verbs in Präteritum',
    content: `Regular verbs (weak verbs) form the Präteritum by adding **-te** to the verb stem, plus personal endings.

**Formula**: Verb stem + -te + personal ending
**Example**: lernen → lern- → lernte, lerntest, lernte...

The pattern is predictable and follows the same rules for all regular verbs.`,
    subsections: [
      {
        title: 'Regular Past Tense Endings',
        content: `All regular German verbs use these Präteritum endings:`,
        conjugationTable: {
          title: 'Regular Präteritum Endings',
          conjugations: [
            { pronoun: 'ich', form: '-te', english: 'I (verb)ed' },
            { pronoun: 'du', form: '-test', english: 'you (verb)ed' },
            { pronoun: 'er/sie/es', form: '-te', english: 'he/she/it (verb)ed' },
            { pronoun: 'wir', form: '-ten', english: 'we (verb)ed' },
            { pronoun: 'ihr', form: '-tet', english: 'you (verb)ed' },
            { pronoun: 'sie/Sie', form: '-ten', english: 'they/you (verb)ed' }
          ]
        },
        examples: [
          {
            spanish: 'lernen → ich lernte, du lerntest, er lernte...',
            english: 'to learn → I learned, you learned, he learned...',
            highlight: ['lernte', 'lerntest']
          }
        ]
      },
      {
        title: 'Regular Verb Examples',
        content: `Common regular verbs conjugated in Präteritum:`,
        conjugationTable: {
          title: 'Arbeiten (to work) - Präteritum',
          conjugations: [
            { pronoun: 'ich', form: 'arbeitete', english: 'I worked' },
            { pronoun: 'du', form: 'arbeitetest', english: 'you worked' },
            { pronoun: 'er/sie/es', form: 'arbeitete', english: 'he/she/it worked' },
            { pronoun: 'wir', form: 'arbeiteten', english: 'we worked' },
            { pronoun: 'ihr', form: 'arbeitetet', english: 'you worked' },
            { pronoun: 'sie/Sie', form: 'arbeiteten', english: 'they/you worked' }
          ]
        },
        examples: [
          {
            spanish: 'Ich arbeitete gestern im Büro.',
            english: 'I worked in the office yesterday.',
            highlight: ['arbeitete']
          },
          {
            spanish: 'Sie spielten Fußball im Park.',
            english: 'They played football in the park.',
            highlight: ['spielten']
          },
          {
            spanish: 'Wir lernten Deutsch in der Schule.',
            english: 'We learned German at school.',
            highlight: ['lernten']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Verbs in Präteritum',
    content: `Irregular verbs (strong verbs) change their stem vowel in the Präteritum and don't add **-te**. These forms must be memorized.

**Pattern**: Vowel change + different endings
**Example**: sprechen → sprach, gehen → ging, sein → war

The most common irregular verbs are essential for reading German texts.`,
    subsections: [
      {
        title: 'Irregular Präteritum Endings',
        content: `Irregular verbs use these endings (no -te):`,
        conjugationTable: {
          title: 'Irregular Präteritum Endings',
          conjugations: [
            { pronoun: 'ich', form: '(no ending)', english: 'I' },
            { pronoun: 'du', form: '-st', english: 'you' },
            { pronoun: 'er/sie/es', form: '(no ending)', english: 'he/she/it' },
            { pronoun: 'wir', form: '-en', english: 'we' },
            { pronoun: 'ihr', form: '-t', english: 'you' },
            { pronoun: 'sie/Sie', form: '-en', english: 'they/you' }
          ]
        }
      },
      {
        title: 'Common Irregular Verbs',
        content: `Essential irregular verbs in Präteritum:`,
        conjugationTable: {
          title: 'Sprechen (to speak) - Präteritum',
          conjugations: [
            { pronoun: 'ich', form: 'sprach', english: 'I spoke' },
            { pronoun: 'du', form: 'sprachst', english: 'you spoke' },
            { pronoun: 'er/sie/es', form: 'sprach', english: 'he/she/it spoke' },
            { pronoun: 'wir', form: 'sprachen', english: 'we spoke' },
            { pronoun: 'ihr', form: 'spracht', english: 'you spoke' },
            { pronoun: 'sie/Sie', form: 'sprachen', english: 'they/you spoke' }
          ]
        },
        examples: [
          {
            spanish: 'Er sprach sehr gut Deutsch.',
            english: 'He spoke German very well.',
            highlight: ['sprach']
          },
          {
            spanish: 'Wir gingen ins Theater.',
            english: 'We went to the theater. (gehen → gingen)',
            highlight: ['gingen']
          },
          {
            spanish: 'Sie kam zu spät.',
            english: 'She came too late. (kommen → kam)',
            highlight: ['kam']
          }
        ]
      }
    ]
  },
  {
    title: 'Most Important Irregular Verbs',
    content: `These irregular verbs appear frequently in German texts and must be memorized:`,
    subsections: [
      {
        title: 'Sein (to be) - Completely Irregular',
        content: `**Sein** has unique forms in Präteritum:`,
        conjugationTable: {
          title: 'Sein (to be) - Präteritum',
          conjugations: [
            { pronoun: 'ich', form: 'war', english: 'I was' },
            { pronoun: 'du', form: 'warst', english: 'you were' },
            { pronoun: 'er/sie/es', form: 'war', english: 'he/she/it was' },
            { pronoun: 'wir', form: 'waren', english: 'we were' },
            { pronoun: 'ihr', form: 'wart', english: 'you were' },
            { pronoun: 'sie/Sie', form: 'waren', english: 'they/you were' }
          ]
        },
        examples: [
          {
            spanish: 'Ich war gestern krank.',
            english: 'I was sick yesterday.',
            highlight: ['war']
          },
          {
            spanish: 'Du warst sehr müde.',
            english: 'You were very tired.',
            highlight: ['warst']
          },
          {
            spanish: 'Wir waren im Urlaub.',
            english: 'We were on vacation.',
            highlight: ['waren']
          }
        ]
      },
      {
        title: 'Haben (to have) - Irregular',
        content: `**Haben** in Präteritum:`,
        conjugationTable: {
          title: 'Haben (to have) - Präteritum',
          conjugations: [
            { pronoun: 'ich', form: 'hatte', english: 'I had' },
            { pronoun: 'du', form: 'hattest', english: 'you had' },
            { pronoun: 'er/sie/es', form: 'hatte', english: 'he/she/it had' },
            { pronoun: 'wir', form: 'hatten', english: 'we had' },
            { pronoun: 'ihr', form: 'hattet', english: 'you had' },
            { pronoun: 'sie/Sie', form: 'hatten', english: 'they/you had' }
          ]
        },
        examples: [
          {
            spanish: 'Ich hatte keine Zeit.',
            english: 'I had no time.',
            highlight: ['hatte']
          },
          {
            spanish: 'Sie hatten viel Glück.',
            english: 'They had a lot of luck.',
            highlight: ['hatten']
          }
        ]
      }
    ]
  },
  {
    title: 'Modal Verbs in Präteritum',
    content: `Modal verbs are commonly used in Präteritum even in spoken German. They have unique irregular forms:

**können → konnte** (could)
**müssen → musste** (had to)
**wollen → wollte** (wanted to)
**sollen → sollte** (should have)
**dürfen → durfte** (was allowed to)
**mögen → mochte** (liked)

These forms are essential for everyday German communication.`,
    examples: [
      {
        spanish: 'Ich konnte nicht kommen.',
        english: 'I couldn\'t come.',
        highlight: ['konnte']
      },
      {
        spanish: 'Du musstest früh aufstehen.',
        english: 'You had to get up early.',
        highlight: ['musstest']
      },
      {
        spanish: 'Er wollte Arzt werden.',
        english: 'He wanted to become a doctor.',
        highlight: ['wollte']
      },
      {
        spanish: 'Wir durften nicht rauchen.',
        english: 'We weren\'t allowed to smoke.',
        highlight: ['durften']
      }
    ]
  },
  {
    title: 'Präteritum vs Perfekt',
    content: `Understanding when to use Präteritum vs Perfekt is crucial:

**Präteritum (Simple Past)**:
- Written German (stories, news, formal texts)
- Modal verbs (even in speech)
- Formal situations

**Perfekt (Present Perfect)**:
- Spoken German
- Conversational situations
- Informal communication

Both express past actions, but the choice depends on context and register.`,
    examples: [
      {
        spanish: 'Written: Der König lebte in einem großen Schloss.',
        english: 'Written: The king lived in a large castle. (Präteritum)',
        highlight: ['lebte']
      },
      {
        spanish: 'Spoken: Der König hat in einem großen Schloss gelebt.',
        english: 'Spoken: The king lived in a large castle. (Perfekt)',
        highlight: ['hat', 'gelebt']
      },
      {
        spanish: 'Both: Ich konnte nicht schlafen.',
        english: 'Both: I couldn\'t sleep. (modal verbs use Präteritum)',
        highlight: ['konnte']
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
    title: 'German Perfect Tense',
    url: '/grammar/german/verbs/perfect-tense',
    difficulty: 'intermediate'
  },
  {
    title: 'German Modal Verbs',
    url: '/grammar/german/verbs/modal-verbs',
    difficulty: 'intermediate'
  },
  {
    title: 'German Irregular Verbs',
    url: '/grammar/german/verbs/irregular-verbs',
    difficulty: 'intermediate'
  }
];

export default function GermanPastTensePage() {
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
              topic: 'past-tense',
              title: 'German Past Tense (Präteritum)',
              description: 'Master German simple past tense (Präteritum) for narrative and formal writing. Complete guide with regular and irregular verbs.',
              difficulty: 'intermediate',
              examples: [
                'Ich sprach Deutsch (I spoke German)',
                'Du warst müde (You were tired)',
                'Er hatte Zeit (He had time)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'verbs',
              topic: 'past-tense',
              title: 'German Past Tense (Präteritum)'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="german"
        category="verbs"
        topic="past-tense"
        title="German Past Tense (Präteritum)"
        description="Master German simple past tense (Präteritum) for narrative and formal writing. Complete guide with regular and irregular verbs"
        difficulty="intermediate"
        estimatedTime={30}
        sections={sections}
        backUrl="/grammar/german/verbs"
        practiceUrl="/grammar/german/verbs/past-tense/practice"
        quizUrl="/grammar/german/verbs/past-tense/quiz"
        songUrl="/songs/de?theme=grammar&topic=past-tense"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
