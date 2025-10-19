import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'pronouns',
  topic: 'reflexive',
  title: 'Spanish Reflexive Pronouns',
  description: 'Master Spanish reflexive pronouns: me, te, se, nos, os, se. Learn reflexive verbs and actions done to oneself.',
  difficulty: 'intermediate',
  keywords: [
    'spanish reflexive pronouns',
    'me te se spanish',
    'nos os se spanish',
    'spanish reflexive verbs',
    'pronombres reflexivos español',
    'spanish reflexive actions'
  ],
  examples: [
    'me lavo (I wash myself)',
    'se levanta (he/she gets up)',
    'nos vestimos (we get dressed)'
  ]
});

const sections = [
  {
    title: 'Spanish Reflexive Pronouns Overview',
    content: `Spanish reflexive pronouns are used when the **subject** and **object** of an action are the same person. They indicate that someone is doing something **to themselves**.

**Key Concept**: The action "reflects back" to the person doing it
**Position**: Usually go **before** the conjugated verb
**Usage**: With reflexive verbs and to show self-directed actions

**Reflexive vs. Non-reflexive**: Many verbs can be used both ways depending on whether the action is done to oneself or to someone/something else.`,
    examples: [
      {
        spanish: 'Me lavo las manos.',
        english: 'I wash my hands. (I wash myself)',
        highlight: ['Me lavo']
      },
      {
        spanish: 'Lavo el coche.',
        english: 'I wash the car. (not reflexive)',
        highlight: ['Lavo']
      },
      {
        spanish: 'Se mira en el espejo.',
        english: 'He/she looks at himself/herself in the mirror.',
        highlight: ['Se mira']
      },
      {
        spanish: 'Mira la televisión.',
        english: 'He/she watches television. (not reflexive)',
        highlight: ['Mira']
      }
    ]
  },
  {
    title: 'Complete List of Reflexive Pronouns',
    content: `Spanish reflexive pronouns correspond to each personal pronoun:`,
    subsections: [
      {
        title: 'Reflexive Pronouns Chart',
        content: `Each person has a corresponding reflexive pronoun:`,
        conjugationTable: {
          title: 'Spanish Reflexive Pronouns',
          conjugations: [
            { pronoun: 'me', form: 'myself', english: 'Me lavo (I wash myself)' },
            { pronoun: 'te', form: 'yourself (informal)', english: 'Te vistes (You dress yourself)' },
            { pronoun: 'se', form: 'himself/herself/yourself (formal)', english: 'Se levanta (He/she gets up)' },
            { pronoun: 'nos', form: 'ourselves', english: 'Nos preparamos (We prepare ourselves)' },
            { pronoun: 'os', form: 'yourselves (informal, Spain)', english: 'Os bañáis (You all bathe yourselves)' },
            { pronoun: 'se', form: 'themselves/yourselves', english: 'Se acuestan (They go to bed)' }
          ]
        },
        examples: [
          {
            spanish: 'Me despierto a las siete.',
            english: 'I wake up at seven. (I wake myself up)',
            highlight: ['Me despierto']
          },
          {
            spanish: 'Te peinas muy bien.',
            english: 'You comb your hair very well. (You comb yourself)',
            highlight: ['Te peinas']
          },
          {
            spanish: 'Nos divertimos mucho.',
            english: 'We have a lot of fun. (We amuse ourselves)',
            highlight: ['Nos divertimos']
          },
          {
            spanish: 'Se van mañana.',
            english: 'They leave tomorrow. (They take themselves away)',
            highlight: ['Se van']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Reflexive Verbs',
    content: `Many Spanish verbs are commonly used reflexively. Here are the most important categories:`,
    subsections: [
      {
        title: 'Daily Routine Verbs',
        content: `These verbs describe daily personal care activities:`,
        examples: [
          {
            spanish: 'levantarse (to get up) → Me levanto temprano.',
            english: 'to get up → I get up early.',
            highlight: ['Me levanto']
          },
          {
            spanish: 'ducharse (to shower) → Te duchas por la mañana.',
            english: 'to shower → You shower in the morning.',
            highlight: ['Te duchas']
          },
          {
            spanish: 'vestirse (to get dressed) → Se viste rápidamente.',
            english: 'to get dressed → He/she gets dressed quickly.',
            highlight: ['Se viste']
          },
          {
            spanish: 'peinarse (to comb hair) → Nos peinamos antes de salir.',
            english: 'to comb hair → We comb our hair before leaving.',
            highlight: ['Nos peinamos']
          },
          {
            spanish: 'acostarse (to go to bed) → Se acuestan tarde.',
            english: 'to go to bed → They go to bed late.',
            highlight: ['Se acuestan']
          }
        ]
      },
      {
        title: 'Emotional and Mental State Verbs',
        content: `These verbs describe emotional or mental changes:`,
        examples: [
          {
            spanish: 'sentirse (to feel) → Me siento bien.',
            english: 'to feel → I feel good.',
            highlight: ['Me siento']
          },
          {
            spanish: 'preocuparse (to worry) → Te preocupas demasiado.',
            english: 'to worry → You worry too much.',
            highlight: ['Te preocupas']
          },
          {
            spanish: 'enojarse (to get angry) → Se enoja fácilmente.',
            english: 'to get angry → He/she gets angry easily.',
            highlight: ['Se enoja']
          },
          {
            spanish: 'divertirse (to have fun) → Nos divertimos en la fiesta.',
            english: 'to have fun → We have fun at the party.',
            highlight: ['Nos divertimos']
          },
          {
            spanish: 'aburrirse (to get bored) → Se aburren en clase.',
            english: 'to get bored → They get bored in class.',
            highlight: ['Se aburren']
          }
        ]
      },
      {
        title: 'Movement and Position Verbs',
        content: `These verbs describe changes in position or movement:`,
        examples: [
          {
            spanish: 'sentarse (to sit down) → Me siento aquí.',
            english: 'to sit down → I sit down here.',
            highlight: ['Me siento']
          },
          {
            spanish: 'pararse (to stand up) → Te paras muy derecho.',
            english: 'to stand up → You stand up very straight.',
            highlight: ['Te paras']
          },
          {
            spanish: 'irse (to leave/go away) → Se va a casa.',
            english: 'to leave/go away → He/she goes home.',
            highlight: ['Se va']
          },
          {
            spanish: 'quedarse (to stay) → Nos quedamos en casa.',
            english: 'to stay → We stay at home.',
            highlight: ['Nos quedamos']
          }
        ]
      }
    ]
  },
  {
    title: 'Reflexive Pronoun Placement',
    content: `Reflexive pronouns follow the same placement rules as other object pronouns:`,
    subsections: [
      {
        title: 'Standard Placement Rules',
        content: `**Before conjugated verbs**: Most common position
**Attached to infinitives**: With verb + infinitive constructions
**Attached to present participles**: With -ando/-iendo forms
**Attached to affirmative commands**: ¡Levántate! (Get up!)`,
        examples: [
          {
            spanish: 'Me voy a levantar. = Voy a levantarme.',
            english: 'I\'m going to get up. (both forms correct)',
            highlight: ['Me voy', 'levantarme']
          },
          {
            spanish: 'Estoy vistiéndome.',
            english: 'I am getting dressed. (with accent mark)',
            highlight: ['vistiéndome']
          },
          {
            spanish: '¡Siéntate! vs. ¡No te sientes!',
            english: 'Sit down! vs. Don\'t sit down!',
            highlight: ['Siéntate', 'te sientes']
          }
        ]
      }
    ]
  },
  {
    title: 'Reflexive vs. Non-Reflexive Meanings',
    content: `Many verbs change meaning when used reflexively:`,
    subsections: [
      {
        title: 'Meaning Changes with Reflexive Use',
        content: `Some verbs have different meanings when used reflexively vs. non-reflexively:`,
        examples: [
          {
            spanish: 'dormir (to sleep) vs. dormirse (to fall asleep)',
            english: 'Duermo ocho horas vs. Me duermo temprano',
            highlight: ['dormir', 'dormirse']
          },
          {
            spanish: 'ir (to go) vs. irse (to leave/go away)',
            english: 'Voy al trabajo vs. Me voy de aquí',
            highlight: ['ir', 'irse']
          },
          {
            spanish: 'llamar (to call) vs. llamarse (to be named)',
            english: 'Llamo a María vs. Me llamo Juan',
            highlight: ['llamar', 'llamarse']
          },
          {
            spanish: 'poner (to put) vs. ponerse (to put on/become)',
            english: 'Pongo el libro vs. Me pongo la camisa',
            highlight: ['poner', 'ponerse']
          }
        ]
      }
    ]
  },
  {
    title: 'Reciprocal Actions',
    content: `Reflexive pronouns can also express **reciprocal actions** (each other):`,
    subsections: [
      {
        title: 'Expressing "Each Other"',
        content: `With plural subjects, reflexive pronouns can mean "each other":

**Context determines meaning**: reflexive vs. reciprocal
**Common with**: nos, os, se (plural forms)
**Clarification**: Add "mutuamente" or "el uno al otro" if needed`,
        examples: [
          {
            spanish: 'Nos vemos mañana.',
            english: 'We see each other tomorrow. (reciprocal)',
            highlight: ['Nos vemos']
          },
          {
            spanish: 'Se escriben cartas.',
            english: 'They write letters to each other. (reciprocal)',
            highlight: ['Se escriben']
          },
          {
            spanish: 'Os conocéis bien.',
            english: 'You all know each other well. (reciprocal, Spain)',
            highlight: ['Os conocéis']
          },
          {
            spanish: 'Se ayudan mutuamente.',
            english: 'They help each other. (clarified reciprocal)',
            highlight: ['Se ayudan mutuamente']
          }
        ]
      }
    ]
  },
  {
    title: 'Reflexive Verbs in Different Tenses',
    content: `Reflexive verbs work in all tenses - the pronoun stays with the subject:`,
    subsections: [
      {
        title: 'Conjugation Examples',
        content: `Here's how reflexive verbs work in different tenses using "levantarse" (to get up):`,
        conjugationTable: {
          title: 'Levantarse (To Get Up) - Different Tenses',
          conjugations: [
            { pronoun: 'Present', form: 'me levanto', english: 'I get up' },
            { pronoun: 'Preterite', form: 'me levanté', english: 'I got up' },
            { pronoun: 'Imperfect', form: 'me levantaba', english: 'I used to get up' },
            { pronoun: 'Future', form: 'me levantaré', english: 'I will get up' },
            { pronoun: 'Conditional', form: 'me levantaría', english: 'I would get up' }
          ]
        },
        examples: [
          {
            spanish: 'Ayer me levanté tarde.',
            english: 'Yesterday I got up late. (preterite)',
            highlight: ['me levanté']
          },
          {
            spanish: 'Cuando era niño, me levantaba temprano.',
            english: 'When I was a child, I used to get up early. (imperfect)',
            highlight: ['me levantaba']
          },
          {
            spanish: 'Mañana me levantaré a las seis.',
            english: 'Tomorrow I will get up at six. (future)',
            highlight: ['me levantaré']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Reflexive Pronoun Mistakes',
    content: `Here are common mistakes Spanish learners make with reflexive pronouns:

**Mistake 1**: Forgetting the reflexive pronoun with reflexive verbs
**Mistake 2**: Using reflexive pronouns with non-reflexive verbs
**Mistake 3**: Wrong pronoun placement with infinitives
**Mistake 4**: Forgetting accent marks with participles

Learning to avoid these mistakes will make your Spanish sound natural.`,
    examples: [
      {
        spanish: '❌ Levanto temprano → ✅ Me levanto temprano',
        english: 'Wrong: I get up early → Right: I get up early (with reflexive)',
        highlight: ['Levanto', 'Me levanto']
      },
      {
        spanish: '❌ Me como la pizza → ✅ Como la pizza',
        english: 'Wrong: I eat myself the pizza → Right: I eat the pizza',
        highlight: ['Me como', 'Como']
      },
      {
        spanish: '❌ Voy me levantar → ✅ Me voy a levantar / Voy a levantarme',
        english: 'Wrong: I go me get up → Right: I\'m going to get up',
        highlight: ['me levantar', 'Me voy a levantar']
      },
      {
        spanish: '❌ Estoy levantandome → ✅ Estoy levantándome',
        english: 'Wrong: I am getting up → Right: I am getting up (with accent)',
        highlight: ['levantandome', 'levantándome']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'Direct Object Pronouns',
    url: '/grammar/spanish/pronouns/direct-object',
    difficulty: 'intermediate'
  },
  {
    title: 'Indirect Object Pronouns',
    url: '/grammar/spanish/pronouns/indirect-object',
    difficulty: 'intermediate'
  },
  {
    title: 'Spanish Present Tense',
    url: '/grammar/spanish/verbs/present-tense',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Daily Routines',
    url: '/vocabulary/spanish/daily-routines',
    difficulty: 'beginner'
  }
];

export default function SpanishReflexivePronounsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'pronouns',
              topic: 'reflexive',
              title: 'Spanish Reflexive Pronouns',
              description: 'Master Spanish reflexive pronouns: me, te, se, nos, os, se. Learn reflexive verbs and actions done to oneself.',
              difficulty: 'intermediate',
              examples: [
                'me lavo (I wash myself)',
                'se levanta (he/she gets up)',
                'nos vestimos (we get dressed)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'pronouns',
              topic: 'reflexive',
              title: 'Spanish Reflexive Pronouns'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="pronouns"
        topic="reflexive"
        title="Spanish Reflexive Pronouns"
        description="Master Spanish reflexive pronouns: me, te, se, nos, os, se. Learn reflexive verbs and actions done to oneself"
        difficulty="intermediate"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/spanish/pronouns"
        practiceUrl="/grammar/spanish/pronouns/reflexive/practice"
        quizUrl="/grammar/spanish/pronouns/reflexive/quiz"
        songUrl="/songs/es?theme=grammar&topic=reflexive-pronouns"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
