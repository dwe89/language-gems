import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'nouns',
  topic: 'possessive-adj',
  title: 'Spanish Possessive Adjectives - Mi, Tu, Su, Nuestro',
  description: 'Master Spanish possessive adjectives including short forms (mi, tu, su) and long forms (mío, tuyo, suyo) with agreement rules.',
  difficulty: 'beginner',
  keywords: [
    'spanish possessive adjectives',
    'mi tu su spanish',
    'mio tuyo suyo spanish',
    'spanish possessives grammar',
    'nuestro vuestro spanish'
  ],
  examples: [
    'Mi casa es grande. (My house is big.)',
    'Tu hermano es simpático. (Your brother is nice.)',
    'Nuestros padres trabajan. (Our parents work.)',
    'La casa mía es nueva. (My house is new.)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Possessive Adjectives',
    content: `Spanish **possessive adjectives** (adjetivos posesivos) show **ownership or relationship**. Spanish has **two types**: **short forms** (unstressed) and **long forms** (stressed).

**Two types of possessive adjectives:**
- **Short forms**: mi, tu, su, nuestro/a, vuestro/a (before noun)
- **Long forms**: mío/a, tuyo/a, suyo/a, nuestro/a, vuestro/a (after noun)

**Key features:**
- **Agreement**: Must agree with the **thing possessed**, not the possessor
- **Position**: Short forms before noun, long forms after
- **Gender/Number**: Most forms change for gender and number
- **Ambiguity**: Su/suyo can mean his, her, your, or their

**Why possessive adjectives matter:**
- **Express relationships**: Show ownership and connections
- **Essential communication**: Describe what belongs to whom
- **Avoid repetition**: Replace longer possessive phrases
- **Natural Spanish**: Required for fluent expression

Understanding possessive adjectives is **fundamental** for **basic Spanish communication**.`,
    examples: [
      {
        spanish: 'SHORT FORM: Mi libro está aquí. (My book is here.)',
        english: 'LONG FORM: El libro mío está aquí. (My book is here.)',
        highlight: ['Mi libro', 'libro mío']
      },
      {
        spanish: 'AGREEMENT: Mis libros, mis casas. (My books, my houses.)',
        english: 'POSSESSION: Su coche es nuevo. (His/her/your car is new.)',
        highlight: ['Mis libros', 'Su coche']
      }
    ]
  },
  {
    title: 'Short Form Possessive Adjectives',
    content: `**Short forms** go **before** the noun and are **unstressed**:`,
    conjugationTable: {
      title: 'Short Form Possessives',
      conjugations: [
        { pronoun: 'mi/mis', form: 'my', english: 'mi casa, mis casas (my house, my houses)' },
        { pronoun: 'tu/tus', form: 'your (informal)', english: 'tu libro, tus libros (your book, your books)' },
        { pronoun: 'su/sus', form: 'his/her/your/their', english: 'su coche, sus coches (his/her car, their cars)' },
        { pronoun: 'nuestro/a/os/as', form: 'our', english: 'nuestro hijo, nuestra hija (our son, our daughter)' },
        { pronoun: 'vuestro/a/os/as', form: 'your (plural, Spain)', english: 'vuestro perro, vuestra casa (your dog, your house)' }
      ]
    },
    examples: [
      {
        spanish: 'SINGULAR: mi hermano, tu hermana, su padre',
        english: 'PLURAL: mis hermanos, tus hermanas, sus padres',
        highlight: ['mi hermano', 'mis hermanos']
      },
      {
        spanish: 'GENDER: nuestro hijo, nuestra hija',
        english: 'PLURAL: nuestros hijos, nuestras hijas',
        highlight: ['nuestro hijo', 'nuestra hija']
      }
    ]
  },
  {
    title: 'Agreement Rules for Short Forms',
    content: `**Short forms** agree in **number** (and gender for nuestro/vuestro):`,
    examples: [
      {
        spanish: 'NUMBER ONLY: mi casa → mis casas, tu libro → tus libros',
        english: 'GENDER + NUMBER: nuestro coche → nuestros coches, nuestra casa → nuestras casas',
        highlight: ['mis casas', 'nuestras casas']
      },
      {
        spanish: 'INVARIABLE: su (his/her/your/their) never changes for gender',
        english: 'EXAMPLE: su hijo, su hija, sus hijos, sus hijas',
        highlight: ['su hijo', 'su hija']
      }
    ],
    subsections: [
      {
        title: 'Key Point',
        content: 'Agreement is with the thing possessed, not the possessor:',
        examples: [
          {
            spanish: 'María tiene su libro. (María has her book.)',
            english: 'María tiene sus libros. (María has her books.)',
            highlight: ['su libro', 'sus libros']
          }
        ]
      }
    ]
  },
  {
    title: 'Long Form Possessive Adjectives',
    content: `**Long forms** go **after** the noun and are **stressed**:`,
    conjugationTable: {
      title: 'Long Form Possessives',
      conjugations: [
        { pronoun: 'mío/a/os/as', form: 'mine', english: 'un amigo mío (a friend of mine)' },
        { pronoun: 'tuyo/a/os/as', form: 'yours (informal)', english: 'la casa tuya (your house)' },
        { pronoun: 'suyo/a/os/as', form: 'his/hers/yours/theirs', english: 'el coche suyo (his/her car)' },
        { pronoun: 'nuestro/a/os/as', form: 'ours', english: 'la idea nuestra (our idea)' },
        { pronoun: 'vuestro/a/os/as', form: 'yours (plural, Spain)', english: 'los libros vuestros (your books)' }
      ]
    },
    examples: [
      {
        spanish: 'EMPHASIS: La casa mía es grande. (My house is big.)',
        english: 'CONTRAST: Tu coche y el coche mío. (Your car and my car.)',
        highlight: ['casa mía', 'coche mío']
      },
      {
        spanish: 'AFTER NOUN: Un amigo tuyo vino. (A friend of yours came.)',
        english: 'WITH ARTICLE: El problema nuestro es serio. (Our problem is serious.)',
        highlight: ['amigo tuyo', 'problema nuestro']
      }
    ]
  },
  {
    title: 'When to Use Long Forms',
    content: `**Long forms** are used for **emphasis, contrast, or after ser**:`,
    examples: [
      {
        spanish: 'EMPHASIS: ¡La culpa es mía! (The fault is mine!)',
        english: 'CONTRAST: Tu opinión y la opinión mía. (Your opinion and my opinion.)',
        highlight: ['es mía', 'opinión mía']
      },
      {
        spanish: 'AFTER SER: Este libro es tuyo. (This book is yours.)',
        english: 'INDEFINITE: Un primo suyo vive aquí. (A cousin of his lives here.)',
        highlight: ['es tuyo', 'primo suyo']
      },
      {
        spanish: 'VOCATIVE: ¡Dios mío! (My God!)',
        english: 'EXCLAMATION: ¡Hijo mío! (My son!)',
        highlight: ['Dios mío', 'Hijo mío']
      }
    ]
  },
  {
    title: 'Clarifying Su/Suyo Ambiguity',
    content: `**Su/suyo** can be ambiguous. Use **de + pronoun** for clarity:`,
    conjugationTable: {
      title: 'Clarifying Possession',
      conjugations: [
        { pronoun: 'su casa', form: 'ambiguous', english: 'his/her/your/their house' },
        { pronoun: 'la casa de él', form: 'his house', english: 'Clear: his house' },
        { pronoun: 'la casa de ella', form: 'her house', english: 'Clear: her house' },
        { pronoun: 'la casa de usted', form: 'your house', english: 'Clear: your house (formal)' },
        { pronoun: 'la casa de ellos', form: 'their house', english: 'Clear: their house' }
      ]
    },
    examples: [
      {
        spanish: 'AMBIGUOUS: Su hermano llegó. (His/her/your brother arrived.)',
        english: 'CLEAR: El hermano de ella llegó. (Her brother arrived.)',
        highlight: ['Su hermano', 'hermano de ella']
      },
      {
        spanish: 'CONTEXT CLEAR: María habla con su madre. (María talks with her mother.)',
        english: 'NEEDS CLARITY: Su madre es doctora. → La madre de él es doctora.',
        highlight: ['su madre', 'madre de él']
      }
    ]
  },
  {
    title: 'Regional Variations',
    content: `**Different usage** across Spanish-speaking regions:`,
    conjugationTable: {
      title: 'Regional Usage',
      conjugations: [
        { pronoun: 'Spain', form: 'Uses vuestro/a', english: 'vuestro coche (your car - plural informal)' },
        { pronoun: 'Latin America', form: 'Uses su for plural', english: 'su coche (your car - plural)' },
        { pronoun: 'Argentina', form: 'tu → vos forms', english: 'tu casa → tu casa (same possessive)' },
        { pronoun: 'Formal contexts', form: 'Prefer su over tu', english: 'su opinión (your opinion - formal)' }
      ]
    },
    examples: [
      {
        spanish: 'SPAIN: ¿Dónde está vuestro coche? (Where is your car?)',
        english: 'LATIN AMERICA: ¿Dónde está su coche? (Where is your car?)',
        highlight: ['vuestro coche', 'su coche']
      }
    ]
  },
  {
    title: 'Possessives with Body Parts and Clothing',
    content: `With **body parts and clothing**, Spanish often uses **definite articles** instead:`,
    examples: [
      {
        spanish: 'BODY PARTS: Me duele la cabeza. (My head hurts.)',
        english: 'NOT: Me duele mi cabeza. (Less natural)',
        highlight: ['la cabeza']
      },
      {
        spanish: 'CLOTHING: Me pongo el abrigo. (I put on my coat.)',
        english: 'REFLEXIVE: Se lava las manos. (He washes his hands.)',
        highlight: ['el abrigo', 'las manos']
      },
      {
        spanish: 'EXCEPTION: When emphasizing ownership',
        english: 'EMPHASIS: Mis manos están frías. (My hands are cold - emphasis)',
        highlight: ['Mis manos']
      }
    ]
  },
  {
    title: 'Common Expressions',
    content: `**Fixed expressions** with possessive adjectives:`,
    conjugationTable: {
      title: 'Common Expressions',
      conjugations: [
        { pronoun: 'Dios mío', form: 'My God', english: '¡Dios mío, qué sorpresa!' },
        { pronoun: 'por mi parte', form: 'as for me', english: 'Por mi parte, estoy de acuerdo.' },
        { pronoun: 'a tu manera', form: 'your way', english: 'Hazlo a tu manera.' },
        { pronoun: 'en su lugar', form: 'in his/her place', english: 'En su lugar, yo no iría.' }
      ]
    },
    examples: [
      {
        spanish: 'EXCLAMATION: ¡Madre mía! (Good heavens!)',
        english: 'OPINION: A mi parecer... (In my opinion...)',
        highlight: ['Madre mía', 'mi parecer']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong agreement**: Agreeing with possessor instead of possessed
**2. Article confusion**: Using articles with short forms
**3. Position errors**: Wrong placement of long/short forms
**4. Ambiguity**: Not clarifying su when needed`,
    examples: [
      {
        spanish: '❌ María tiene su libros → ✅ María tiene sus libros',
        english: 'Wrong: must agree with thing possessed (libros = plural)',
        highlight: ['sus libros']
      },
      {
        spanish: '❌ la mi casa → ✅ mi casa',
        english: 'Wrong: no article with short form possessives',
        highlight: ['mi casa']
      },
      {
        spanish: '❌ mío hermano → ✅ mi hermano / el hermano mío',
        english: 'Wrong: short form before noun, long form after',
        highlight: ['mi hermano']
      },
      {
        spanish: '❌ nuestro casa → ✅ nuestra casa',
        english: 'Wrong: nuestro must agree in gender',
        highlight: ['nuestra casa']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Possessive Pronouns', url: '/grammar/spanish/pronouns/possessive', difficulty: 'intermediate' },
  { title: 'Spanish Articles', url: '/grammar/spanish/nouns/articles', difficulty: 'beginner' },
  { title: 'Spanish Demonstrative Adjectives', url: '/grammar/spanish/nouns/demonstrative', difficulty: 'beginner' },
  { title: 'Spanish Adjective Agreement', url: '/grammar/spanish/adjectives/agreement', difficulty: 'beginner' }
];

export default function SpanishPossessiveAdjectivesPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'nouns',
              topic: 'possessive-adj',
              title: 'Spanish Possessive Adjectives - Mi, Tu, Su, Nuestro',
              description: 'Master Spanish possessive adjectives including short forms (mi, tu, su) and long forms (mío, tuyo, suyo) with agreement rules.',
              difficulty: 'beginner',
              examples: [
                'Mi casa es grande. (My house is big.)',
                'Tu hermano es simpático. (Your brother is nice.)',
                'Nuestros padres trabajan. (Our parents work.)',
                'La casa mía es nueva. (My house is new.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'nouns',
              topic: 'possessive-adj',
              title: 'Spanish Possessive Adjectives - Mi, Tu, Su, Nuestro'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="nouns"
        topic="possessive-adj"
        title="Spanish Possessive Adjectives - Mi, Tu, Su, Nuestro"
        description="Master Spanish possessive adjectives including short forms (mi, tu, su) and long forms (mío, tuyo, suyo) with agreement rules"
        difficulty="beginner"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/spanish/nouns"
        practiceUrl="/grammar/spanish/nouns/possessive-adj/practice"
        quizUrl="/grammar/spanish/nouns/possessive-adj/quiz"
        songUrl="/songs/es?theme=grammar&topic=possessive-adj"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
