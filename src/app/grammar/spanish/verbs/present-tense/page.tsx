import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'present-tense',
  title: 'Spanish Present Tense',
  description: 'Master Spanish present tense conjugations with comprehensive explanations, examples, and practice exercises. Learn regular and irregular verb patterns.',
  difficulty: 'beginner',
  keywords: [
    'spanish present tense',
    'spanish verb conjugation',
    'presente de indicativo',
    'spanish regular verbs',
    'spanish irregular verbs',
    'ar er ir verbs',
    'spanish grammar rules'
  ],
  examples: [
    'Yo hablo español (I speak Spanish)',
    'Ella come pizza (She eats pizza)',
    'Nosotros vivimos en Madrid (We live in Madrid)'
  ]
});

const sections = [
  {
    title: 'What is the Spanish Present Tense?',
    content: `The Spanish present tense (**presente de indicativo**) is used to describe actions happening now, habitual actions, and general truths. It's equivalent to both the simple present ("I speak") and present continuous ("I am speaking") in English.

The present tense is one of the most important tenses in Spanish and forms the foundation for learning other tenses. Once you master present tense conjugations, you'll be able to express a wide variety of ideas and situations.`,
    examples: [
      {
        spanish: 'Yo estudio español todos los días.',
        english: 'I study Spanish every day.',
        highlight: ['estudio']
      },
      {
        spanish: 'María trabaja en una oficina.',
        english: 'María works in an office.',
        highlight: ['trabaja']
      },
      {
        spanish: 'Los niños juegan en el parque.',
        english: 'The children play in the park.',
        highlight: ['juegan']
      }
    ]
  },
  {
    title: 'Regular Verb Conjugations',
    content: `Spanish verbs are divided into three groups based on their infinitive endings: **-ar**, **-er**, and **-ir** verbs. Each group follows a specific conjugation pattern in the present tense.`,
    subsections: [
      {
        title: '-AR Verbs (like hablar - to speak)',
        content: `**-AR verbs** are the most common type in Spanish. To conjugate them, remove the **-ar** ending and add the appropriate present tense endings:`,
        conjugationTable: {
          title: 'AR Verb Endings',
          conjugations: [
            { pronoun: 'yo', form: '-o', english: 'I speak' },
            { pronoun: 'tú', form: '-as', english: 'you speak' },
            { pronoun: 'él/ella/usted', form: '-a', english: 'he/she speaks, you speak' },
            { pronoun: 'nosotros/nosotras', form: '-amos', english: 'we speak' },
            { pronoun: 'vosotros/vosotras', form: '-áis', english: 'you all speak' },
            { pronoun: 'ellos/ellas/ustedes', form: '-an', english: 'they speak, you all speak' }
          ]
        },
        examples: [
          {
            spanish: 'Yo hablo con mi madre.',
            english: 'I speak with my mother.',
            highlight: ['hablo']
          },
          {
            spanish: 'Tú caminas muy rápido.',
            english: 'You walk very fast.',
            highlight: ['caminas']
          },
          {
            spanish: 'Nosotros estudiamos juntos.',
            english: 'We study together.',
            highlight: ['estudiamos']
          }
        ]
      },
      {
        title: '-ER Verbs (like comer - to eat)',
        content: `**-ER verbs** follow their own conjugation pattern. Remove the **-er** ending and add:`,
        conjugationTable: {
          title: 'ER Verb Endings',
          conjugations: [
            { pronoun: 'yo', form: '-o', english: 'I eat' },
            { pronoun: 'tú', form: '-es', english: 'you eat' },
            { pronoun: 'él/ella/usted', form: '-e', english: 'he/she eats, you eat' },
            { pronoun: 'nosotros/nosotras', form: '-emos', english: 'we eat' },
            { pronoun: 'vosotros/vosotras', form: '-éis', english: 'you all eat' },
            { pronoun: 'ellos/ellas/ustedes', form: '-en', english: 'they eat, you all eat' }
          ]
        },
        examples: [
          {
            spanish: 'Yo como frutas.',
            english: 'I eat fruits.',
            highlight: ['como']
          },
          {
            spanish: 'Ella bebe agua.',
            english: 'She drinks water.',
            highlight: ['bebe']
          },
          {
            spanish: 'Ellos corren en el parque.',
            english: 'They run in the park.',
            highlight: ['corren']
          }
        ]
      },
      {
        title: '-IR Verbs (like vivir - to live)',
        content: `**-IR verbs** have endings similar to **-ER verbs**, with slight differences. Remove the **-ir** ending and add:`,
        conjugationTable: {
          title: 'IR Verb Endings',
          conjugations: [
            { pronoun: 'yo', form: '-o', english: 'I live' },
            { pronoun: 'tú', form: '-es', english: 'you live' },
            { pronoun: 'él/ella/usted', form: '-e', english: 'he/she lives, you live' },
            { pronoun: 'nosotros/nosotras', form: '-imos', english: 'we live' },
            { pronoun: 'vosotros/vosotras', form: '-ís', english: 'you all live' },
            { pronoun: 'ellos/ellas/ustedes', form: '-en', english: 'they live, you all live' }
          ]
        },
        examples: [
          {
            spanish: 'Yo vivo en España.',
            english: 'I live in Spain.',
            highlight: ['vivo']
          },
          {
            spanish: 'Tú escribes cartas.',
            english: 'You write letters.',
            highlight: ['escribes']
          },
          {
            spanish: 'Nosotros abrimos la puerta.',
            english: 'We open the door.',
            highlight: ['abrimos']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Irregular Verbs',
    content: `Some of the most frequently used Spanish verbs are irregular in the present tense. These verbs don't follow the standard conjugation patterns and must be memorized.`,
    subsections: [
      {
        title: 'Ser (to be) - Permanent States',
        content: `**Ser** is used for permanent characteristics, identity, and essential qualities:`,
        conjugationTable: {
          title: 'Ser Conjugation',
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
            spanish: 'Yo soy estudiante.',
            english: 'I am a student.',
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
        title: 'Estar (to be) - Temporary States',
        content: `**Estar** is used for temporary conditions, locations, and ongoing actions:`,
        conjugationTable: {
          title: 'Estar Conjugation',
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
            spanish: 'Yo estoy cansado.',
            english: 'I am tired.',
            highlight: ['estoy']
          },
          {
            spanish: 'Ellos están en casa.',
            english: 'They are at home.',
            highlight: ['están']
          }
        ]
      },
      {
        title: 'Tener (to have)',
        content: `**Tener** is used to express possession and in many idiomatic expressions:`,
        conjugationTable: {
          title: 'Tener Conjugation',
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
            spanish: 'Yo tengo un coche.',
            english: 'I have a car.',
            highlight: ['tengo']
          },
          {
            spanish: 'Ella tiene hambre.',
            english: 'She is hungry.',
            highlight: ['tiene']
          }
        ]
      }
    ]
  },
  {
    title: 'When to Use the Present Tense',
    content: `The Spanish present tense is used in several situations:

**1. Current actions**: Actions happening right now
**2. Habitual actions**: Things you do regularly
**3. General truths**: Facts that are always true
**4. Future plans**: Near future events (with time expressions)
**5. Historical present**: Dramatic narration of past events`,
    examples: [
      {
        spanish: 'Leo un libro ahora.',
        english: 'I am reading a book now. (current action)',
        highlight: ['Leo']
      },
      {
        spanish: 'Siempre desayuno a las ocho.',
        english: 'I always have breakfast at eight. (habitual)',
        highlight: ['desayuno']
      },
      {
        spanish: 'El agua hierve a 100 grados.',
        english: 'Water boils at 100 degrees. (general truth)',
        highlight: ['hierve']
      },
      {
        spanish: 'Mañana viajo a París.',
        english: 'Tomorrow I travel to Paris. (near future)',
        highlight: ['viajo']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'Spanish Past Tense (Preterite)',
    url: '/grammar/spanish/verbs/preterite',
    difficulty: 'intermediate'
  },
  {
    title: 'Spanish Irregular Verbs',
    url: '/grammar/spanish/verbs/irregular-verbs',
    difficulty: 'intermediate'
  },
  {
    title: 'Ser vs Estar',
    url: '/grammar/spanish/verbs/ser-vs-estar',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Verb Moods',
    url: '/grammar/spanish/verbs/moods',
    difficulty: 'advanced'
  }
];

export default function SpanishPresentTensePage() {
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
              topic: 'present-tense',
              title: 'Spanish Present Tense',
              description: 'Master Spanish present tense conjugations with comprehensive explanations, examples, and practice exercises.',
              difficulty: 'beginner',
              examples: [
                'Yo hablo español (I speak Spanish)',
                'Ella come pizza (She eats pizza)',
                'Nosotros vivimos en Madrid (We live in Madrid)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'present-tense',
              title: 'Spanish Present Tense'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="present-tense"
        title="Spanish Present Tense"
        description="Master Spanish present tense conjugations with comprehensive explanations and examples"
        difficulty="beginner"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/present-tense/practice"
        quizUrl="/grammar/spanish/verbs/present-tense/quiz"
        songUrl="/songs/es?theme=grammar&topic=present-tense"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
