import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'irregular-verbs',
  title: 'Spanish Irregular Verbs',
  description: 'Master Spanish irregular verbs with comprehensive conjugation patterns, common irregulars, and usage examples.',
  difficulty: 'intermediate',
  keywords: [
    'spanish irregular verbs',
    'verbos irregulares español',
    'spanish verb conjugation',
    'irregular conjugation spanish',
    'spanish grammar',
    'stem changing verbs',
    'spanish verb patterns'
  ],
  examples: [
    'Yo soy estudiante (I am a student)',
    'Él tiene veinte años (He is twenty years old)',
    'Nosotros vamos al cine (We are going to the movies)'
  ]
});

const sections = [
  {
    title: 'What are Spanish Irregular Verbs?',
    content: `Spanish irregular verbs (**verbos irregulares**) don't follow the standard conjugation patterns. Instead of simply adding regular endings to the stem, these verbs undergo changes in their stem, endings, or both.

Understanding irregular verbs is crucial because many of the most common and useful Spanish verbs are irregular, including ser (to be), tener (to have), and ir (to go).`,
    examples: [
      {
        spanish: 'Yo soy profesor de español.',
        english: 'I am a Spanish teacher.',
        highlight: ['soy']
      },
      {
        spanish: 'Ella tiene tres hermanos.',
        english: 'She has three brothers.',
        highlight: ['tiene']
      },
      {
        spanish: 'Nosotros vamos a la playa.',
        english: 'We are going to the beach.',
        highlight: ['vamos']
      }
    ]
  },
  {
    title: 'Types of Irregular Verbs',
    content: `Spanish irregular verbs can be categorized into several types based on their patterns of irregularity:

**1. Completely Irregular**: Verbs with unique forms (ser, ir, haber)
**2. Stem-Changing**: Verbs that change their stem vowel (pensar, dormir)
**3. First Person Irregular**: Verbs irregular only in the "yo" form (hacer, poner)
**4. Spelling Changes**: Verbs with orthographic changes (conocer, dirigir)`,
    examples: [
      {
        spanish: 'Soy, eres, es... (ser - completely irregular)',
        english: 'I am, you are, he is... (to be)',
        highlight: ['Soy', 'eres', 'es']
      },
      {
        spanish: 'Pienso, piensas, piensa... (pensar - stem-changing)',
        english: 'I think, you think, he thinks...',
        highlight: ['Pienso', 'piensas', 'piensa']
      },
      {
        spanish: 'Hago, haces, hace... (hacer - yo irregular)',
        english: 'I do, you do, he does...',
        highlight: ['Hago']
      }
    ]
  },
  {
    title: 'Most Common Irregular Verbs',
    content: `These are the most frequently used irregular verbs in Spanish that you should master first:`,
    subsections: [
      {
        title: 'Ser (to be - permanent characteristics)',
        content: `**Ser** is used for permanent characteristics, identity, and essential qualities:`,
        conjugationTable: {
          title: 'Ser - Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'soy', english: 'I am' },
            { pronoun: 'tú', form: 'eres', english: 'you are' },
            { pronoun: 'él/ella/usted', form: 'es', english: 'he/she is, you are' },
            { pronoun: 'nosotros/nosotras', form: 'somos', english: 'we are' },
            { pronoun: 'vosotros/vosotras', form: 'sois', english: 'you all are' },
            { pronoun: 'ellos/ellas/ustedes', form: 'son', english: 'they are, you all are' }
          ]
        },
        examples: [
          {
            spanish: 'Yo soy médico.',
            english: 'I am a doctor.',
            highlight: ['soy']
          },
          {
            spanish: 'Ella es muy inteligente.',
            english: 'She is very intelligent.',
            highlight: ['es']
          }
        ]
      },
      {
        title: 'Estar (to be - temporary states/location)',
        content: `**Estar** is used for temporary states, locations, and conditions:`,
        conjugationTable: {
          title: 'Estar - Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'estoy', english: 'I am' },
            { pronoun: 'tú', form: 'estás', english: 'you are' },
            { pronoun: 'él/ella/usted', form: 'está', english: 'he/she is, you are' },
            { pronoun: 'nosotros/nosotras', form: 'estamos', english: 'we are' },
            { pronoun: 'vosotros/vosotras', form: 'estáis', english: 'you all are' },
            { pronoun: 'ellos/ellas/ustedes', form: 'están', english: 'they are, you all are' }
          ]
        },
        examples: [
          {
            spanish: 'Yo estoy en casa.',
            english: 'I am at home.',
            highlight: ['estoy']
          },
          {
            spanish: 'Ellos están cansados.',
            english: 'They are tired.',
            highlight: ['están']
          }
        ]
      },
      {
        title: 'Tener (to have)',
        content: `**Tener** is used to express possession, age, and many idiomatic expressions:`,
        conjugationTable: {
          title: 'Tener - Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'tengo', english: 'I have' },
            { pronoun: 'tú', form: 'tienes', english: 'you have' },
            { pronoun: 'él/ella/usted', form: 'tiene', english: 'he/she has, you have' },
            { pronoun: 'nosotros/nosotras', form: 'tenemos', english: 'we have' },
            { pronoun: 'vosotros/vosotras', form: 'tenéis', english: 'you all have' },
            { pronoun: 'ellos/ellas/ustedes', form: 'tienen', english: 'they have, you all have' }
          ]
        },
        examples: [
          {
            spanish: 'Yo tengo veinticinco años.',
            english: 'I am twenty-five years old.',
            highlight: ['tengo']
          },
          {
            spanish: 'Ella tiene hambre.',
            english: 'She is hungry.',
            highlight: ['tiene']
          }
        ]
      },
      {
        title: 'Ir (to go)',
        content: `**Ir** is used for movement and to form the near future (ir + a + infinitive):`,
        conjugationTable: {
          title: 'Ir - Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'voy', english: 'I go' },
            { pronoun: 'tú', form: 'vas', english: 'you go' },
            { pronoun: 'él/ella/usted', form: 'va', english: 'he/she goes, you go' },
            { pronoun: 'nosotros/nosotras', form: 'vamos', english: 'we go' },
            { pronoun: 'vosotros/vosotras', form: 'vais', english: 'you all go' },
            { pronoun: 'ellos/ellas/ustedes', form: 'van', english: 'they go, you all go' }
          ]
        },
        examples: [
          {
            spanish: 'Yo voy al trabajo en autobús.',
            english: 'I go to work by bus.',
            highlight: ['voy']
          },
          {
            spanish: 'Vamos a estudiar esta noche.',
            english: 'We are going to study tonight.',
            highlight: ['Vamos']
          }
        ]
      }
    ]
  },
  {
    title: 'Stem-Changing Verbs',
    content: `Stem-changing verbs (verbos con cambios de raíz) change their stem vowel in certain conjugations. The changes occur in all forms except nosotros and vosotros in the present tense.`,
    subsections: [
      {
        title: 'E → IE Changes',
        content: `These verbs change **e** to **ie** in stressed syllables:`,
        conjugationTable: {
          title: 'Pensar (to think) - e→ie',
          conjugations: [
            { pronoun: 'yo', form: 'pienso', english: 'I think' },
            { pronoun: 'tú', form: 'piensas', english: 'you think' },
            { pronoun: 'él/ella/usted', form: 'piensa', english: 'he/she thinks, you think' },
            { pronoun: 'nosotros/nosotras', form: 'pensamos', english: 'we think' },
            { pronoun: 'vosotros/vosotras', form: 'pensáis', english: 'you all think' },
            { pronoun: 'ellos/ellas/ustedes', form: 'piensan', english: 'they think, you all think' }
          ]
        },
        examples: [
          {
            spanish: 'Yo pienso en ti todos los días.',
            english: 'I think about you every day.',
            highlight: ['pienso']
          },
          {
            spanish: 'Ella quiere ir al cine.',
            english: 'She wants to go to the movies.',
            highlight: ['quiere']
          }
        ]
      },
      {
        title: 'O → UE Changes',
        content: `These verbs change **o** to **ue** in stressed syllables:`,
        conjugationTable: {
          title: 'Dormir (to sleep) - o→ue',
          conjugations: [
            { pronoun: 'yo', form: 'duermo', english: 'I sleep' },
            { pronoun: 'tú', form: 'duermes', english: 'you sleep' },
            { pronoun: 'él/ella/usted', form: 'duerme', english: 'he/she sleeps, you sleep' },
            { pronoun: 'nosotros/nosotras', form: 'dormimos', english: 'we sleep' },
            { pronoun: 'vosotros/vosotras', form: 'dormís', english: 'you all sleep' },
            { pronoun: 'ellos/ellas/ustedes', form: 'duermen', english: 'they sleep, you all sleep' }
          ]
        },
        examples: [
          {
            spanish: 'Yo duermo ocho horas cada noche.',
            english: 'I sleep eight hours every night.',
            highlight: ['duermo']
          },
          {
            spanish: 'Él puede ayudarte mañana.',
            english: 'He can help you tomorrow.',
            highlight: ['puede']
          }
        ]
      },
      {
        title: 'E → I Changes',
        content: `These verbs change **e** to **i** in stressed syllables (only -ir verbs):`,
        conjugationTable: {
          title: 'Pedir (to ask for) - e→i',
          conjugations: [
            { pronoun: 'yo', form: 'pido', english: 'I ask for' },
            { pronoun: 'tú', form: 'pides', english: 'you ask for' },
            { pronoun: 'él/ella/usted', form: 'pide', english: 'he/she asks for, you ask for' },
            { pronoun: 'nosotros/nosotras', form: 'pedimos', english: 'we ask for' },
            { pronoun: 'vosotros/vosotras', form: 'pedís', english: 'you all ask for' },
            { pronoun: 'ellos/ellas/ustedes', form: 'piden', english: 'they ask for, you all ask for' }
          ]
        },
        examples: [
          {
            spanish: 'Yo pido ayuda cuando la necesito.',
            english: 'I ask for help when I need it.',
            highlight: ['pido']
          },
          {
            spanish: 'Ellos sirven comida deliciosa.',
            english: 'They serve delicious food.',
            highlight: ['sirven']
          }
        ]
      }
    ]
  },
  {
    title: 'First Person Irregular Verbs',
    content: `These verbs are irregular only in the **yo** form, while other forms follow regular patterns:`,
    examples: [
      {
        spanish: 'Yo hago ejercicio todos los días.',
        english: 'I exercise every day. (hacer → hago)',
        highlight: ['hago']
      },
      {
        spanish: 'Yo pongo la mesa para cenar.',
        english: 'I set the table for dinner. (poner → pongo)',
        highlight: ['pongo']
      },
      {
        spanish: 'Yo salgo de casa a las ocho.',
        english: 'I leave home at eight. (salir → salgo)',
        highlight: ['salgo']
      },
      {
        spanish: 'Yo conozco a tu hermana.',
        english: 'I know your sister. (conocer → conozco)',
        highlight: ['conozco']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'Spanish Present Tense',
    url: '/grammar/spanish/verbs/present-tense',
    difficulty: 'beginner'
  },
  {
    title: 'Ser vs Estar',
    url: '/grammar/spanish/verbs/ser-vs-estar',
    difficulty: 'intermediate'
  },
  {
    title: 'Spanish Past Tense (Preterite)',
    url: '/grammar/spanish/verbs/preterite',
    difficulty: 'intermediate'
  },
  {
    title: 'Spanish Subjunctive Mood',
    url: '/grammar/spanish/verbs/subjunctive',
    difficulty: 'advanced'
  }
];

export default function SpanishIrregularVerbsPage() {
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
              topic: 'irregular-verbs',
              title: 'Spanish Irregular Verbs',
              description: 'Master Spanish irregular verbs with comprehensive conjugation patterns, common irregulars, and usage examples.',
              difficulty: 'intermediate',
              examples: [
                'Yo soy estudiante (I am a student)',
                'Él tiene veinte años (He is twenty years old)',
                'Nosotros vamos al cine (We are going to the movies)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'irregular-verbs',
              title: 'Spanish Irregular Verbs'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="irregular-verbs"
        title="Spanish Irregular Verbs"
        description="Master Spanish irregular verbs with comprehensive conjugation patterns, common irregulars, and usage examples"
        difficulty="intermediate"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/irregular-verbs/practice"
        quizUrl="/grammar/spanish/verbs/irregular-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=irregular-verbs"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
