import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'adverbial-prepositional',
  topic: 'personal-a',
  title: 'Spanish Personal A - When to Use A with Direct Objects',
  description: 'Master the Spanish personal a including when to use it with people, pets, and personified objects.',
  difficulty: 'beginner',
  keywords: [
    'spanish personal a',
    'personal a spanish grammar',
    'a preposition spanish',
    'direct object spanish a',
    'when use personal a'
  ],
  examples: [
    'Veo a María. (I see María.)',
    'Busco a mi perro. (I look for my dog.)',
    'Conozco a tu hermano. (I know your brother.)',
    'Amo a mis padres. (I love my parents.)'
  ]
});

const sections = [
  {
    title: 'Understanding the Spanish Personal A',
    content: `The **personal a** (a personal) is a **preposition** used before **direct objects** that refer to **people** or **personified beings**. It has **no English equivalent** and is one of the most distinctive features of Spanish grammar.

**Basic rule:**
Use **a** before direct objects that are **people, pets, or personified**

**Key concept:**
The personal a **marks** the direct object when it could be confused with the subject, especially when the direct object is **animate** (living) or **personified**.

**Why the personal a exists:**
- **Clarity**: Distinguishes subject from object
- **Respect**: Shows respect for people and living beings
- **Grammar**: Prevents ambiguity in flexible word order
- **Tradition**: Deep-rooted feature of Spanish

**When to use personal a:**
- **People**: Veo a Juan. (I see Juan.)
- **Pets**: Busco a mi gato. (I look for my cat.)
- **Personified objects**: Amo a España. (I love Spain.)
- **Indefinite people**: Busco a alguien. (I look for someone.)

Understanding the personal a is **essential** for **correct Spanish grammar**.`,
    examples: [
      {
        spanish: 'WITH PERSONAL A: Veo a María. (I see María.)',
        english: 'WITHOUT: Veo la mesa. (I see the table.)',
        highlight: ['a María', 'la mesa']
      },
      {
        spanish: 'PERSON: Conozco a tu hermano. (I know your brother.)',
        english: 'THING: Conozco la ciudad. (I know the city.)',
        highlight: ['a tu hermano', 'la ciudad']
      }
    ]
  },
  {
    title: 'When to Use Personal A',
    content: `**Use personal a** in these specific situations:`,
    conjugationTable: {
      title: 'Uses of Personal A',
      conjugations: [
        { pronoun: 'People (specific)', form: 'Veo a Juan', english: 'I see Juan' },
        { pronoun: 'People (indefinite)', form: 'Busco a alguien', english: 'I look for someone' },
        { pronoun: 'Pets/Animals', form: 'Amo a mi perro', english: 'I love my dog' },
        { pronoun: 'Personified places', form: 'Visito a España', english: 'I visit Spain' },
        { pronoun: 'Groups of people', form: 'Veo a los estudiantes', english: 'I see the students' }
      ]
    },
    examples: [
      {
        spanish: 'SPECIFIC PERSON: Llamo a mi madre. (I call my mother.)',
        english: 'INDEFINITE PERSON: Necesito a alguien. (I need someone.)',
        highlight: ['a mi madre', 'a alguien']
      },
      {
        spanish: 'PET: Cuido a mi gato. (I take care of my cat.)',
        english: 'PERSONIFIED: Amo a mi país. (I love my country.)',
        highlight: ['a mi gato', 'a mi país']
      }
    ]
  },
  {
    title: 'When NOT to Use Personal A',
    content: `**Do NOT use personal a** in these situations:`,
    conjugationTable: {
      title: 'When to Omit Personal A',
      conjugations: [
        { pronoun: 'Things/Objects', form: 'Veo la casa', english: 'I see the house' },
        { pronoun: 'After tener', form: 'Tengo un hermano', english: 'I have a brother' },
        { pronoun: 'Unspecified people', form: 'Busco secretaria', english: 'I look for a secretary (any)' },
        { pronoun: 'After hay', form: 'Hay estudiantes', english: 'There are students' }
      ]
    },
    examples: [
      {
        spanish: 'THINGS: Compro libros. (I buy books.)',
        english: 'TENER: Tengo tres hijos. (I have three children.)',
        highlight: ['libros', 'tres hijos']
      },
      {
        spanish: 'UNSPECIFIED: Necesito profesor. (I need a teacher - any teacher.)',
        english: 'HAY: Hay médicos aquí. (There are doctors here.)',
        highlight: ['profesor', 'médicos']
      }
    ]
  },
  {
    title: 'Personal A with Indefinite Pronouns',
    content: `**Use personal a** with indefinite pronouns referring to people:`,
    conjugationTable: {
      title: 'Indefinite Pronouns + Personal A',
      conjugations: [
        { pronoun: 'alguien', form: 'someone', english: 'Busco a alguien. (I look for someone.)' },
        { pronoun: 'nadie', form: 'no one', english: 'No veo a nadie. (I don\'t see anyone.)' },
        { pronoun: 'alguno', form: 'someone (specific)', english: 'Conozco a alguno. (I know someone.)' },
        { pronoun: 'ninguno', form: 'no one (specific)', english: 'No conozco a ninguno. (I don\'t know any.)' }
      ]
    },
    examples: [
      {
        spanish: 'SOMEONE: ¿Conoces a alguien aquí? (Do you know someone here?)',
        english: 'NO ONE: No conozco a nadie. (I don\'t know anyone.)',
        highlight: ['a alguien', 'a nadie']
      },
      {
        spanish: 'SPECIFIC: Invité a algunos. (I invited some people.)',
        english: 'NEGATIVE: No invité a ninguno. (I didn\'t invite any.)',
        highlight: ['a algunos', 'a ninguno']
      }
    ]
  },
  {
    title: 'Personal A with Animals',
    content: `**Use personal a** with **pets and beloved animals**:`,
    examples: [
      {
        spanish: 'PETS: Amo a mi perro. (I love my dog.)',
        english: 'BELOVED: Cuido a mi gato. (I take care of my cat.)',
        highlight: ['a mi perro', 'a mi gato']
      },
      {
        spanish: 'EMOTIONAL BOND: Extraño a mi caballo. (I miss my horse.)',
        english: 'GENERAL ANIMALS: Veo vacas. (I see cows. - no personal a)',
        highlight: ['a mi caballo', 'vacas']
      }
    ],
    subsections: [
      {
        title: 'Rule of Thumb',
        content: 'Use personal a with animals you have an emotional connection to:',
        examples: [
          {
            spanish: 'EMOTIONAL: Busco a mi perro perdido. (I look for my lost dog.)',
            english: 'GENERAL: El granjero alimenta pollos. (The farmer feeds chickens.)',
            highlight: ['a mi perro', 'pollos']
          }
        ]
      }
    ]
  },
  {
    title: 'Personal A with Personified Objects',
    content: `**Use personal a** with **personified places, concepts, or objects**:`,
    conjugationTable: {
      title: 'Personification Examples',
      conjugations: [
        { pronoun: 'Countries/Cities', form: 'Amo a España', english: 'I love Spain' },
        { pronoun: 'Institutions', form: 'Respeto a la universidad', english: 'I respect the university' },
        { pronoun: 'Abstract concepts', form: 'Busco a la verdad', english: 'I seek the truth' },
        { pronoun: 'Collective groups', form: 'Apoyo a mi equipo', english: 'I support my team' }
      ]
    },
    examples: [
      {
        spanish: 'COUNTRY: Visito a México. (I visit Mexico.)',
        english: 'INSTITUTION: Represento a mi empresa. (I represent my company.)',
        highlight: ['a México', 'a mi empresa']
      },
      {
        spanish: 'ABSTRACT: Busco a la felicidad. (I seek happiness.)',
        english: 'TEAM: Apoyo a mi equipo. (I support my team.)',
        highlight: ['a la felicidad', 'a mi equipo']
      }
    ]
  },
  {
    title: 'Special Cases and Exceptions',
    content: `**Special situations** with personal a:`,
    conjugationTable: {
      title: 'Special Cases',
      conjugations: [
        { pronoun: 'After tener', form: 'No personal a', english: 'Tengo un hermano. (I have a brother.)' },
        { pronoun: 'After hay', form: 'No personal a', english: 'Hay estudiantes. (There are students.)' },
        { pronoun: 'Unspecified people', form: 'No personal a', english: 'Busco secretaria. (I look for a secretary.)' },
        { pronoun: 'With querer (want)', form: 'Usually no personal a', english: 'Quiero un médico. (I want a doctor.)' }
      ]
    },
    examples: [
      {
        spanish: 'TENER: Tengo dos hermanas. (I have two sisters.)',
        english: 'SPECIFIED: Busco a mi hermana. (I look for my sister.)',
        highlight: ['dos hermanas', 'a mi hermana']
      },
      {
        spanish: 'UNSPECIFIED: Necesito profesor de español. (I need a Spanish teacher.)',
        english: 'SPECIFIED: Necesito a mi profesor. (I need my teacher.)',
        highlight: ['profesor', 'a mi profesor']
      }
    ]
  },
  {
    title: 'Personal A with Relative Pronouns',
    content: `**Personal a** is used with **relative pronouns** referring to people:`,
    examples: [
      {
        spanish: 'RELATIVE: La persona a quien veo... (The person whom I see...)',
        english: 'RELATIVE: El hombre a quien conozco... (The man whom I know...)',
        highlight: ['a quien veo', 'a quien conozco']
      },
      {
        spanish: 'COMPLEX: Es la mujer a la que amo. (She is the woman I love.)',
        english: 'FORMAL: La persona a la cual busco... (The person I look for...)',
        highlight: ['a la que amo', 'a la cual busco']
      }
    ]
  },
  {
    title: 'Regional and Stylistic Variations',
    content: `**Usage variations** across regions and styles:`,
    examples: [
      {
        spanish: 'STANDARD: Veo a María trabajando. (I see María working.)',
        english: 'SOME REGIONS: Veo María trabajando. (Less common)',
        highlight: ['a María']
      },
      {
        spanish: 'FORMAL: Respeto a la institución. (I respect the institution.)',
        english: 'INFORMAL: Respeto la institución. (Also acceptable)',
        highlight: ['a la institución']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Omitting personal a**: Forgetting a with people
**2. Overusing personal a**: Using with things or after tener
**3. Indefinite confusion**: Wrong usage with unspecified people
**4. Animal confusion**: Not understanding pet vs. general animal distinction`,
    examples: [
      {
        spanish: '❌ Veo María → ✅ Veo a María',
        english: 'Wrong: must use personal a with people',
        highlight: ['a María']
      },
      {
        spanish: '❌ Tengo a un hermano → ✅ Tengo un hermano',
        english: 'Wrong: no personal a after tener',
        highlight: ['un hermano']
      },
      {
        spanish: '❌ Veo a la mesa → ✅ Veo la mesa',
        english: 'Wrong: no personal a with things',
        highlight: ['la mesa']
      },
      {
        spanish: '❌ Busco a secretaria → ✅ Busco secretaria (unspecified) / Busco a la secretaria (specific)',
        english: 'Context matters: specific vs. unspecified',
        highlight: ['secretaria', 'a la secretaria']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Direct Object Pronouns', url: '/grammar/spanish/pronouns/direct-object', difficulty: 'intermediate' },
  { title: 'Spanish Basic Prepositions', url: '/grammar/spanish/prepositions/basic-prepositions', difficulty: 'beginner' },
  { title: 'Spanish Word Order', url: '/grammar/spanish/syntax/word-order', difficulty: 'intermediate' },
  { title: 'Spanish Relative Pronouns', url: '/grammar/spanish/pronouns/relative', difficulty: 'advanced' }
];

export default function SpanishPersonalAPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'adverbial-prepositional',
              topic: 'personal-a',
              title: 'Spanish Personal A - When to Use A with Direct Objects',
              description: 'Master the Spanish personal a including when to use it with people, pets, and personified objects.',
              difficulty: 'beginner',
              examples: [
                'Veo a María. (I see María.)',
                'Busco a mi perro. (I look for my dog.)',
                'Conozco a tu hermano. (I know your brother.)',
                'Amo a mis padres. (I love my parents.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'adverbial-prepositional',
              topic: 'personal-a',
              title: 'Spanish Personal A - When to Use A with Direct Objects'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="adverbial-prepositional"
        topic="personal-a"
        title="Spanish Personal A - When to Use A with Direct Objects"
        description="Master the Spanish personal a including when to use it with people, pets, and personified objects"
        difficulty="beginner"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/spanish/adverbial-prepositional"
        practiceUrl="/grammar/spanish/adverbial-prepositional/personal-a/practice"
        quizUrl="/grammar/spanish/adverbial-prepositional/personal-a/quiz"
        songUrl="/songs/es?theme=grammar&topic=personal-a"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
