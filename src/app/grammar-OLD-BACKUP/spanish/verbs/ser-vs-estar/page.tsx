import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'ser-vs-estar',
  title: 'Ser vs Estar in Spanish',
  description: 'Master the difference between ser and estar in Spanish. Complete guide with rules, examples, and practice exercises.',
  difficulty: 'intermediate',
  keywords: [
    'ser vs estar',
    'spanish ser estar',
    'difference ser estar',
    'when to use ser estar',
    'spanish grammar',
    'spanish verbs to be',
    'ser estar rules'
  ],
  examples: [
    'Ella es doctora (She is a doctor) - permanent',
    'Ella está enferma (She is sick) - temporary',
    'La mesa es de madera (The table is made of wood) - characteristic'
  ]
});

const sections = [
  {
    title: 'Ser vs Estar: The Two Ways to Say "To Be"',
    content: `Spanish has two verbs that mean "to be": **ser** and **estar**. This is one of the most challenging concepts for English speakers because English only has one verb "to be."

The key difference is that **ser** expresses permanent or inherent characteristics, while **estar** expresses temporary states, locations, and conditions. Understanding when to use each verb is crucial for speaking Spanish correctly.`,
    examples: [
      {
        spanish: 'María es profesora.',
        english: 'María is a teacher. (permanent profession)',
        highlight: ['es']
      },
      {
        spanish: 'María está enferma.',
        english: 'María is sick. (temporary condition)',
        highlight: ['está']
      },
      {
        spanish: 'El café es caliente.',
        english: 'Coffee is hot. (characteristic of coffee)',
        highlight: ['es']
      },
      {
        spanish: 'El café está caliente.',
        english: 'The coffee is hot. (current temperature)',
        highlight: ['está']
      }
    ]
  },
  {
    title: 'When to Use SER',
    content: `**SER** is used for permanent, inherent, or essential characteristics that define what something or someone IS. Use the acronym **DOCTOR** to remember when to use ser:

**D**escription (physical characteristics)
**O**ccupation (jobs, professions)
**C**haracteristics (personality traits)
**T**ime (dates, days, time)
**O**rigin (nationality, where from)
**R**elationships (family, personal connections)`,
    subsections: [
      {
        title: 'SER Conjugation',
        content: `**SER** is completely irregular and must be memorized:`,
        conjugationTable: {
          title: 'SER - Present Tense',
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
            spanish: 'Yo soy alto y delgado.',
            english: 'I am tall and thin. (physical description)',
            highlight: ['soy']
          },
          {
            spanish: 'Ella es médica.',
            english: 'She is a doctor. (occupation)',
            highlight: ['es']
          },
          {
            spanish: 'Nosotros somos inteligentes.',
            english: 'We are intelligent. (characteristics)',
            highlight: ['somos']
          }
        ]
      },
      {
        title: 'Uses of SER',
        content: `Here are the main uses of SER with examples:`,
        examples: [
          {
            spanish: 'Mi hermana es rubia.',
            english: 'My sister is blonde. (Description)',
            highlight: ['es']
          },
          {
            spanish: 'Juan es ingeniero.',
            english: 'Juan is an engineer. (Occupation)',
            highlight: ['es']
          },
          {
            spanish: 'Tú eres muy amable.',
            english: 'You are very kind. (Characteristics)',
            highlight: ['eres']
          },
          {
            spanish: 'Hoy es lunes.',
            english: 'Today is Monday. (Time)',
            highlight: ['es']
          },
          {
            spanish: 'Ellos son de México.',
            english: 'They are from Mexico. (Origin)',
            highlight: ['son']
          },
          {
            spanish: 'Ana es mi prima.',
            english: 'Ana is my cousin. (Relationships)',
            highlight: ['es']
          }
        ]
      }
    ]
  },
  {
    title: 'When to Use ESTAR',
    content: `**ESTAR** is used for temporary states, locations, conditions, and ongoing actions. Use the acronym **PLACE** to remember when to use estar:

**P**osition (location, where something is)
**L**ocation (geographic position)
**A**ction (progressive tenses)
**C**ondition (temporary states)
**E**motion (feelings, moods)`,
    subsections: [
      {
        title: 'ESTAR Conjugation',
        content: `**ESTAR** is also irregular and must be memorized:`,
        conjugationTable: {
          title: 'ESTAR - Present Tense',
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
            english: 'I am at home. (location)',
            highlight: ['estoy']
          },
          {
            spanish: 'Ella está estudiando.',
            english: 'She is studying. (ongoing action)',
            highlight: ['está']
          },
          {
            spanish: 'Nosotros estamos cansados.',
            english: 'We are tired. (temporary condition)',
            highlight: ['estamos']
          }
        ]
      },
      {
        title: 'Uses of ESTAR',
        content: `Here are the main uses of ESTAR with examples:`,
        examples: [
          {
            spanish: 'El libro está en la mesa.',
            english: 'The book is on the table. (Position)',
            highlight: ['está']
          },
          {
            spanish: 'Madrid está en España.',
            english: 'Madrid is in Spain. (Location)',
            highlight: ['está']
          },
          {
            spanish: 'Estoy leyendo un libro.',
            english: 'I am reading a book. (Action - progressive)',
            highlight: ['Estoy']
          },
          {
            spanish: 'La puerta está cerrada.',
            english: 'The door is closed. (Condition)',
            highlight: ['está']
          },
          {
            spanish: 'Él está triste hoy.',
            english: 'He is sad today. (Emotion)',
            highlight: ['está']
          }
        ]
      }
    ]
  },
  {
    title: 'Ser vs Estar with Adjectives',
    content: `Many adjectives can be used with both ser and estar, but the meaning changes depending on which verb you use:

**With SER**: The adjective describes an inherent, permanent characteristic
**With ESTAR**: The adjective describes a temporary state or condition

This distinction is crucial for expressing exactly what you mean in Spanish.`,
    examples: [
      {
        spanish: 'Juan es aburrido. / Juan está aburrido.',
        english: 'Juan is boring (personality). / Juan is bored (feeling).',
        highlight: ['es', 'está']
      },
      {
        spanish: 'La manzana es verde. / La manzana está verde.',
        english: 'The apple is green (color). / The apple is unripe (condition).',
        highlight: ['es', 'está']
      },
      {
        spanish: 'María es lista. / María está lista.',
        english: 'María is smart (characteristic). / María is ready (state).',
        highlight: ['es', 'está']
      },
      {
        spanish: 'El café es rico. / El café está rico.',
        english: 'Coffee is delicious (in general). / The coffee tastes good (right now).',
        highlight: ['es', 'está']
      }
    ]
  },
  {
    title: 'Common Mistakes and Tips',
    content: `Here are the most common mistakes English speakers make with ser and estar, along with tips to avoid them:

**Mistake 1**: Using ser for location
**Mistake 2**: Using estar for professions
**Mistake 3**: Confusing temporary vs permanent states
**Mistake 4**: Using ser with progressive tenses

Remember: When in doubt, ask yourself "Is this a permanent characteristic (ser) or a temporary state (estar)?"`,
    examples: [
      {
        spanish: '❌ Yo soy en casa. ✅ Yo estoy en casa.',
        english: '❌ I am at home. ✅ I am at home.',
        highlight: ['soy', 'estoy']
      },
      {
        spanish: '❌ Él está profesor. ✅ Él es profesor.',
        english: '❌ He is a teacher. ✅ He is a teacher.',
        highlight: ['está', 'es']
      },
      {
        spanish: '❌ Yo soy estudiando. ✅ Yo estoy estudiando.',
        english: '❌ I am studying. ✅ I am studying.',
        highlight: ['soy', 'estoy']
      },
      {
        spanish: '❌ La comida es caliente. ✅ La comida está caliente.',
        english: '❌ The food is hot (right now). ✅ The food is hot (right now).',
        highlight: ['es', 'está']
      }
    ]
  },
  {
    title: 'Practice Strategies',
    content: `To master ser vs estar, practice these strategies:

**1. Memorize the acronyms**: DOCTOR (ser) and PLACE (estar)
**2. Practice with context**: Always consider whether something is permanent or temporary
**3. Learn common phrases**: Memorize fixed expressions with each verb
**4. Use both verbs**: Practice sentences that use both ser and estar
**5. Think in Spanish**: Don't translate directly from English`,
    examples: [
      {
        spanish: 'Mi hermano es médico y está trabajando en el hospital.',
        english: 'My brother is a doctor and is working at the hospital.',
        highlight: ['es', 'está']
      },
      {
        spanish: 'La casa es grande pero está sucia.',
        english: 'The house is big but it\'s dirty.',
        highlight: ['es', 'está']
      },
      {
        spanish: 'Somos estudiantes y estamos estudiando para el examen.',
        english: 'We are students and we are studying for the exam.',
        highlight: ['Somos', 'estamos']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Passive Voice', url: '/grammar/spanish/verbs/passive-voice', difficulty: 'advanced' },
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future', difficulty: 'intermediate' },
  { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect', difficulty: 'intermediate' },
  { title: 'Negation', url: '/grammar/spanish/verbs/negation', difficulty: 'beginner' }
];

export default function SerVsEstarPage() {
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
              topic: 'ser-vs-estar',
              title: 'Ser vs Estar in Spanish',
              description: 'Master the difference between ser and estar in Spanish. Complete guide with rules, examples, and practice exercises.',
              difficulty: 'intermediate',
              examples: [
                'Ella es doctora (She is a doctor) - permanent',
                'Ella está enferma (She is sick) - temporary',
                'La mesa es de madera (The table is made of wood) - characteristic'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'ser-vs-estar',
              title: 'Ser vs Estar in Spanish'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="ser-vs-estar"
        title="Ser vs Estar in Spanish"
        description="Master the difference between ser and estar in Spanish. Complete guide with rules, examples, and practice exercises"
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/ser-vs-estar/practice"
        quizUrl="/grammar/spanish/verbs/ser-vs-estar/quiz"
        songUrl="/songs/es?theme=grammar&topic=ser-vs-estar"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
