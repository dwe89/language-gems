import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'present-tense',
  title: 'French Present Tense',
  description: 'Master French present tense conjugations for -er, -ir, and -re verbs. Complete guide with examples and irregular verbs.',
  difficulty: 'beginner',
  keywords: [
    'french present tense',
    'présent français',
    'french verb conjugation',
    'french -er verbs',
    'french -ir verbs',
    'french -re verbs',
    'french grammar'
  ],
  examples: [
    'Je parle français (I speak French)',
    'Tu finis tes devoirs (You finish your homework)',
    'Il vend sa voiture (He sells his car)'
  ]
});

const sections = [
  {
    title: 'French Present Tense Overview',
    content: `The French present tense (**le présent**) is used to express actions happening now, habitual actions, and general truths. Unlike English, French has only one present tense form, which can translate to multiple English forms.

French verbs are categorized into three main groups based on their infinitive endings: **-er verbs** (first group), **-ir verbs** (second group), and **-re verbs** (third group). Each group follows specific conjugation patterns.`,
    examples: [
      {
        spanish: 'Je parle français tous les jours.',
        english: 'I speak French every day. (habitual action)',
        highlight: ['parle']
      },
      {
        spanish: 'Elle mange maintenant.',
        english: 'She is eating now. (current action)',
        highlight: ['mange']
      },
      {
        spanish: 'L\'eau bout à 100 degrés.',
        english: 'Water boils at 100 degrees. (general truth)',
        highlight: ['bout']
      }
    ]
  },
  {
    title: 'First Group: -ER Verbs',
    content: `**-ER verbs** are the largest and most regular group in French. They include common verbs like parler (to speak), manger (to eat), and étudier (to study). Most new verbs added to French follow this pattern.`,
    subsections: [
      {
        title: 'Regular -ER Verb Conjugation',
        content: `To conjugate regular -ER verbs, remove the **-er** ending and add the present tense endings:`,
        conjugationTable: {
          title: 'Parler (to speak) - Regular -ER Verb',
          conjugations: [
            { pronoun: 'je', form: 'parle', english: 'I speak' },
            { pronoun: 'tu', form: 'parles', english: 'you speak' },
            { pronoun: 'il/elle/on', form: 'parle', english: 'he/she/one speaks' },
            { pronoun: 'nous', form: 'parlons', english: 'we speak' },
            { pronoun: 'vous', form: 'parlez', english: 'you speak (formal/plural)' },
            { pronoun: 'ils/elles', form: 'parlent', english: 'they speak' }
          ]
        },
        examples: [
          {
            spanish: 'Je parle avec mes amis.',
            english: 'I speak with my friends.',
            highlight: ['parle']
          },
          {
            spanish: 'Nous étudions le français.',
            english: 'We study French.',
            highlight: ['étudions']
          },
          {
            spanish: 'Ils travaillent ensemble.',
            english: 'They work together.',
            highlight: ['travaillent']
          }
        ]
      },
      {
        title: 'Spelling Changes in -ER Verbs',
        content: `Some -ER verbs have **spelling changes** to maintain pronunciation:

**Verbs ending in -ger**: Add **e** before **-ons** (nous mangeons)
**Verbs ending in -cer**: Change **c** to **ç** before **-ons** (nous commençons)
**Verbs with é**: Change **é** to **è** in some forms (préférer → je préfère)`,
        conjugationTable: {
          title: 'Manger (to eat) - Spelling Changes',
          conjugations: [
            { pronoun: 'je', form: 'mange', english: 'I eat' },
            { pronoun: 'tu', form: 'manges', english: 'you eat' },
            { pronoun: 'il/elle/on', form: 'mange', english: 'he/she/one eats' },
            { pronoun: 'nous', form: 'mangeons', english: 'we eat (+ e)' },
            { pronoun: 'vous', form: 'mangez', english: 'you eat' },
            { pronoun: 'ils/elles', form: 'mangent', english: 'they eat' }
          ]
        },
        examples: [
          {
            spanish: 'Nous mangeons au restaurant.',
            english: 'We eat at the restaurant.',
            highlight: ['mangeons']
          },
          {
            spanish: 'Je préfère le thé.',
            english: 'I prefer tea.',
            highlight: ['préfère']
          },
          {
            spanish: 'Nous commençons à huit heures.',
            english: 'We start at eight o\'clock.',
            highlight: ['commençons']
          }
        ]
      }
    ]
  },
  {
    title: 'Second Group: -IR Verbs',
    content: `**-IR verbs** of the second group are regular and include verbs like finir (to finish), choisir (to choose), and réussir (to succeed). They add **-iss-** in plural forms.`,
    subsections: [
      {
        title: 'Regular -IR Verb Conjugation',
        content: `To conjugate regular -IR verbs, remove **-ir** and add the endings. Note the **-iss-** in plural forms:`,
        conjugationTable: {
          title: 'Finir (to finish) - Regular -IR Verb',
          conjugations: [
            { pronoun: 'je', form: 'finis', english: 'I finish' },
            { pronoun: 'tu', form: 'finis', english: 'you finish' },
            { pronoun: 'il/elle/on', form: 'finit', english: 'he/she/one finishes' },
            { pronoun: 'nous', form: 'finissons', english: 'we finish' },
            { pronoun: 'vous', form: 'finissez', english: 'you finish' },
            { pronoun: 'ils/elles', form: 'finissent', english: 'they finish' }
          ]
        },
        examples: [
          {
            spanish: 'Je finis mes devoirs.',
            english: 'I finish my homework.',
            highlight: ['finis']
          },
          {
            spanish: 'Nous choisissons un restaurant.',
            english: 'We choose a restaurant.',
            highlight: ['choisissons']
          },
          {
            spanish: 'Ils réussissent à l\'examen.',
            english: 'They succeed on the exam.',
            highlight: ['réussissent']
          }
        ]
      }
    ]
  },
  {
    title: 'Third Group: -RE Verbs',
    content: `**-RE verbs** are less regular and include verbs like vendre (to sell), attendre (to wait), and répondre (to answer). They form the third group of French verbs.`,
    subsections: [
      {
        title: 'Regular -RE Verb Conjugation',
        content: `To conjugate regular -RE verbs, remove **-re** and add the endings:`,
        conjugationTable: {
          title: 'Vendre (to sell) - Regular -RE Verb',
          conjugations: [
            { pronoun: 'je', form: 'vends', english: 'I sell' },
            { pronoun: 'tu', form: 'vends', english: 'you sell' },
            { pronoun: 'il/elle/on', form: 'vend', english: 'he/she/one sells' },
            { pronoun: 'nous', form: 'vendons', english: 'we sell' },
            { pronoun: 'vous', form: 'vendez', english: 'you sell' },
            { pronoun: 'ils/elles', form: 'vendent', english: 'they sell' }
          ]
        },
        examples: [
          {
            spanish: 'Je vends ma voiture.',
            english: 'I sell my car.',
            highlight: ['vends']
          },
          {
            spanish: 'Nous attendons l\'autobus.',
            english: 'We wait for the bus.',
            highlight: ['attendons']
          },
          {
            spanish: 'Elle répond à la question.',
            english: 'She answers the question.',
            highlight: ['répond']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Irregular Verbs',
    content: `Some of the most frequently used French verbs are irregular and must be memorized. These include être (to be), avoir (to have), aller (to go), and faire (to do/make).`,
    subsections: [
      {
        title: 'Être (to be)',
        content: `**Être** is the most important irregular verb in French:`,
        conjugationTable: {
          title: 'Être (to be) - Irregular',
          conjugations: [
            { pronoun: 'je', form: 'suis', english: 'I am' },
            { pronoun: 'tu', form: 'es', english: 'you are' },
            { pronoun: 'il/elle/on', form: 'est', english: 'he/she/one is' },
            { pronoun: 'nous', form: 'sommes', english: 'we are' },
            { pronoun: 'vous', form: 'êtes', english: 'you are' },
            { pronoun: 'ils/elles', form: 'sont', english: 'they are' }
          ]
        },
        examples: [
          {
            spanish: 'Je suis étudiant.',
            english: 'I am a student.',
            highlight: ['suis']
          },
          {
            spanish: 'Nous sommes français.',
            english: 'We are French.',
            highlight: ['sommes']
          }
        ]
      },
      {
        title: 'Avoir (to have)',
        content: `**Avoir** is essential for forming compound tenses:`,
        conjugationTable: {
          title: 'Avoir (to have) - Irregular',
          conjugations: [
            { pronoun: 'j\'', form: 'ai', english: 'I have' },
            { pronoun: 'tu', form: 'as', english: 'you have' },
            { pronoun: 'il/elle/on', form: 'a', english: 'he/she/one has' },
            { pronoun: 'nous', form: 'avons', english: 'we have' },
            { pronoun: 'vous', form: 'avez', english: 'you have' },
            { pronoun: 'ils/elles', form: 'ont', english: 'they have' }
          ]
        },
        examples: [
          {
            spanish: 'J\'ai vingt ans.',
            english: 'I am twenty years old.',
            highlight: ['ai']
          },
          {
            spanish: 'Ils ont une voiture.',
            english: 'They have a car.',
            highlight: ['ont']
          }
        ]
      },
      {
        title: 'Aller (to go)',
        content: `**Aller** is used for movement and forming the near future:`,
        conjugationTable: {
          title: 'Aller (to go) - Irregular',
          conjugations: [
            { pronoun: 'je', form: 'vais', english: 'I go' },
            { pronoun: 'tu', form: 'vas', english: 'you go' },
            { pronoun: 'il/elle/on', form: 'va', english: 'he/she/one goes' },
            { pronoun: 'nous', form: 'allons', english: 'we go' },
            { pronoun: 'vous', form: 'allez', english: 'you go' },
            { pronoun: 'ils/elles', form: 'vont', english: 'they go' }
          ]
        },
        examples: [
          {
            spanish: 'Je vais à l\'école.',
            english: 'I go to school.',
            highlight: ['vais']
          },
          {
            spanish: 'Nous allons partir.',
            english: 'We are going to leave.',
            highlight: ['allons']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses of the French Present Tense',
    content: `The French present tense has several uses:

**1. Current actions**: What's happening now
**2. Habitual actions**: Regular activities
**3. General truths**: Facts and universal statements
**4. Near future**: Actions about to happen
**5. Historical present**: Dramatic narration

Understanding these uses helps you communicate more effectively in French.`,
    examples: [
      {
        spanish: 'Je mange maintenant.',
        english: 'I am eating now. (current action)',
        highlight: ['mange']
      },
      {
        spanish: 'Il travaille tous les jours.',
        english: 'He works every day. (habitual)',
        highlight: ['travaille']
      },
      {
        spanish: 'L\'eau gèle à zéro degré.',
        english: 'Water freezes at zero degrees. (general truth)',
        highlight: ['gèle']
      },
      {
        spanish: 'Je pars demain.',
        english: 'I leave tomorrow. (near future)',
        highlight: ['pars']
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
    title: 'French Future Tense',
    url: '/grammar/french/verbs/future',
    difficulty: 'intermediate'
  },
  {
    title: 'French Irregular Verbs',
    url: '/grammar/french/verbs/irregular',
    difficulty: 'intermediate'
  },
  {
    title: 'French Reflexive Verbs',
    url: '/grammar/french/verbs/reflexive-verbs',
    difficulty: 'intermediate'
  }
];

export default function FrenchPresentTensePage() {
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
              topic: 'present-tense',
              title: 'French Present Tense',
              description: 'Master French present tense conjugations for -er, -ir, and -re verbs. Complete guide with examples and irregular verbs.',
              difficulty: 'beginner',
              examples: [
                'Je parle français (I speak French)',
                'Tu finis tes devoirs (You finish your homework)',
                'Il vend sa voiture (He sells his car)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'present-tense',
              title: 'French Present Tense'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="present-tense"
        title="French Present Tense"
        description="Master French present tense conjugations for -er, -ir, and -re verbs. Complete guide with examples and irregular verbs"
        difficulty="beginner"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/present-tense/practice"
        quizUrl="/grammar/french/verbs/present-tense/quiz"
        songUrl="/songs/fr?theme=grammar&topic=present-tense"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
