import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'nouns',
  topic: 'definite-indefinite',
  title: 'Spanish Definite and Indefinite Articles',
  description: 'Master Spanish articles (el, la, los, las, un, una, unos, unas) with comprehensive rules and examples.',
  difficulty: 'beginner',
  keywords: [
    'spanish articles',
    'el la los las',
    'un una unos unas',
    'definite articles spanish',
    'indefinite articles spanish',
    'spanish grammar articles',
    'when to use spanish articles'
  ],
  examples: [
    'el libro (the book)',
    'la mesa (the table)',
    'un gato (a cat)',
    'una casa (a house)'
  ]
});

const sections = [
  {
    title: 'Spanish Articles Overview',
    content: `Spanish articles are words that come before nouns to indicate whether we're talking about something **specific** (definite) or **general** (indefinite). Unlike English, Spanish articles must agree with the **gender** (masculine/feminine) and **number** (singular/plural) of the noun they modify.

Understanding Spanish articles is fundamental because they're used constantly in everyday speech and help clarify the meaning of sentences.`,
    examples: [
      {
        spanish: 'El perro está en el jardín.',
        english: 'The dog is in the garden. (specific dog)',
        highlight: ['El', 'el']
      },
      {
        spanish: 'Un perro está en el jardín.',
        english: 'A dog is in the garden. (any dog)',
        highlight: ['Un']
      },
      {
        spanish: 'La profesora enseña español.',
        english: 'The teacher teaches Spanish. (specific teacher)',
        highlight: ['La']
      },
      {
        spanish: 'Una profesora enseña español.',
        english: 'A teacher teaches Spanish. (any teacher)',
        highlight: ['Una']
      }
    ]
  },
  {
    title: 'Definite Articles (The)',
    content: `Definite articles in Spanish correspond to "the" in English. They indicate that we're talking about a **specific** or **known** noun. Spanish has four definite articles that must match the gender and number of the noun.`,
    subsections: [
      {
        title: 'Definite Article Forms',
        content: `Spanish definite articles change based on gender and number:`,
        conjugationTable: {
          title: 'Definite Articles',
          conjugations: [
            { pronoun: 'Masculine Singular', form: 'el', english: 'the (masc. sing.)' },
            { pronoun: 'Feminine Singular', form: 'la', english: 'the (fem. sing.)' },
            { pronoun: 'Masculine Plural', form: 'los', english: 'the (masc. plural)' },
            { pronoun: 'Feminine Plural', form: 'las', english: 'the (fem. plural)' }
          ]
        },
        examples: [
          {
            spanish: 'el libro (masculine singular)',
            english: 'the book',
            highlight: ['el']
          },
          {
            spanish: 'la mesa (feminine singular)',
            english: 'the table',
            highlight: ['la']
          },
          {
            spanish: 'los libros (masculine plural)',
            english: 'the books',
            highlight: ['los']
          },
          {
            spanish: 'las mesas (feminine plural)',
            english: 'the tables',
            highlight: ['las']
          }
        ]
      },
      {
        title: 'When to Use Definite Articles',
        content: `Use definite articles when referring to:

**1. Specific items**: Things already mentioned or known
**2. General concepts**: Abstract ideas or general categories
**3. Body parts**: When talking about body parts
**4. Languages**: When languages are the subject
**5. Days of the week**: Except after ser
**6. Titles**: When talking about someone (not to them)`,
        examples: [
          {
            spanish: 'El libro que compré ayer es interesante.',
            english: 'The book I bought yesterday is interesting. (specific)',
            highlight: ['El']
          },
          {
            spanish: 'Me gusta la música clásica.',
            english: 'I like classical music. (general concept)',
            highlight: ['la']
          },
          {
            spanish: 'Me duele la cabeza.',
            english: 'My head hurts. (body part)',
            highlight: ['la']
          },
          {
            spanish: 'El español es fácil.',
            english: 'Spanish is easy. (language as subject)',
            highlight: ['El']
          },
          {
            spanish: 'Los lunes trabajo.',
            english: 'On Mondays I work. (days of the week)',
            highlight: ['Los']
          },
          {
            spanish: 'La doctora García es muy buena.',
            english: 'Dr. García is very good. (title)',
            highlight: ['La']
          }
        ]
      }
    ]
  },
  {
    title: 'Indefinite Articles (A/An/Some)',
    content: `Indefinite articles correspond to "a," "an," and "some" in English. They indicate that we're talking about **non-specific** or **unknown** nouns. Like definite articles, they must agree with the gender and number of the noun.`,
    subsections: [
      {
        title: 'Indefinite Article Forms',
        content: `Spanish indefinite articles change based on gender and number:`,
        conjugationTable: {
          title: 'Indefinite Articles',
          conjugations: [
            { pronoun: 'Masculine Singular', form: 'un', english: 'a/an (masc. sing.)' },
            { pronoun: 'Feminine Singular', form: 'una', english: 'a/an (fem. sing.)' },
            { pronoun: 'Masculine Plural', form: 'unos', english: 'some (masc. plural)' },
            { pronoun: 'Feminine Plural', form: 'unas', english: 'some (fem. plural)' }
          ]
        },
        examples: [
          {
            spanish: 'un perro (masculine singular)',
            english: 'a dog',
            highlight: ['un']
          },
          {
            spanish: 'una gata (feminine singular)',
            english: 'a cat',
            highlight: ['una']
          },
          {
            spanish: 'unos libros (masculine plural)',
            english: 'some books',
            highlight: ['unos']
          },
          {
            spanish: 'unas flores (feminine plural)',
            english: 'some flowers',
            highlight: ['unas']
          }
        ]
      },
      {
        title: 'When to Use Indefinite Articles',
        content: `Use indefinite articles when referring to:

**1. Non-specific items**: Any member of a group
**2. Introducing new information**: First mention of something
**3. Professions**: After ser (sometimes optional)
**4. Quantities**: Approximate amounts
**5. Descriptions**: When describing characteristics`,
        examples: [
          {
            spanish: 'Necesito un bolígrafo.',
            english: 'I need a pen. (any pen)',
            highlight: ['un']
          },
          {
            spanish: 'Hay una mujer en la puerta.',
            english: 'There\'s a woman at the door. (new information)',
            highlight: ['una']
          },
          {
            spanish: 'Mi padre es un médico.',
            english: 'My father is a doctor. (profession)',
            highlight: ['un']
          },
          {
            spanish: 'Tengo unos veinte años.',
            english: 'I\'m about twenty years old. (approximate)',
            highlight: ['unos']
          },
          {
            spanish: 'Es una persona muy amable.',
            english: 'He/She is a very kind person. (description)',
            highlight: ['una']
          }
        ]
      }
    ]
  },
  {
    title: 'Special Cases and Contractions',
    content: `Spanish has some special rules and contractions with articles that you need to know:`,
    subsections: [
      {
        title: 'Contractions: al and del',
        content: `Spanish has two **mandatory contractions** with the definite article **el**:

**a + el = al** (to the)
**de + el = del** (of the/from the)

These contractions are required and cannot be written separately.`,
        conjugationTable: {
          title: 'Mandatory Contractions',
          conjugations: [
            { pronoun: 'a + el', form: 'al', english: 'to the (masculine)' },
            { pronoun: 'de + el', form: 'del', english: 'of/from the (masculine)' },
            { pronoun: 'a + la', form: 'a la', english: 'to the (feminine) - no contraction' },
            { pronoun: 'de + la', form: 'de la', english: 'of/from the (feminine) - no contraction' }
          ]
        },
        examples: [
          {
            spanish: 'Voy al mercado.',
            english: 'I\'m going to the market. (a + el = al)',
            highlight: ['al']
          },
          {
            spanish: 'El libro del profesor.',
            english: 'The teacher\'s book. (de + el = del)',
            highlight: ['del']
          },
          {
            spanish: 'Vamos a la playa.',
            english: 'We\'re going to the beach. (no contraction)',
            highlight: ['a la']
          },
          {
            spanish: 'La casa de la abuela.',
            english: 'Grandmother\'s house. (no contraction)',
            highlight: ['de la']
          }
        ]
      },
      {
        title: 'Feminine Nouns Starting with Stressed A',
        content: `Feminine nouns that begin with **stressed a** or **ha** use **el** in the singular (but remain feminine) and **las** in the plural:`,
        conjugationTable: {
          title: 'Feminine Nouns with Stressed A/HA',
          conjugations: [
            { pronoun: 'el agua (fem.)', form: 'las aguas', english: 'the water(s)' },
            { pronoun: 'el alma (fem.)', form: 'las almas', english: 'the soul(s)' },
            { pronoun: 'el hacha (fem.)', form: 'las hachas', english: 'the axe(s)' },
            { pronoun: 'el águila (fem.)', form: 'las águilas', english: 'the eagle(s)' }
          ]
        },
        examples: [
          {
            spanish: 'El agua está fría.',
            english: 'The water is cold. (feminine noun with el)',
            highlight: ['El', 'fría']
          },
          {
            spanish: 'Las aguas del río son cristalinas.',
            english: 'The river waters are crystal clear. (plural uses las)',
            highlight: ['Las']
          },
          {
            spanish: 'Un alma buena.',
            english: 'A good soul. (indefinite article remains una)',
            highlight: ['Un', 'buena']
          }
        ]
      }
    ]
  },
  {
    title: 'When NOT to Use Articles',
    content: `There are specific cases where Spanish **omits articles** where English might use them:

**1. After ser with professions**: (sometimes)
**2. With certain prepositions**: en casa, por ejemplo
**3. In lists and enumerations**: Sometimes omitted
**4. With some expressions**: tener hambre, hacer calor
**5. After certain verbs**: hablar español (not as subject)`,
    examples: [
      {
        spanish: 'Soy profesora.',
        english: 'I am a teacher. (profession after ser)',
        highlight: ['profesora']
      },
      {
        spanish: 'Estoy en casa.',
        english: 'I\'m at home. (fixed expression)',
        highlight: ['casa']
      },
      {
        spanish: 'Hablo español e inglés.',
        english: 'I speak Spanish and English. (languages as objects)',
        highlight: ['español', 'inglés']
      },
      {
        spanish: 'Tengo hambre.',
        english: 'I\'m hungry. (fixed expression)',
        highlight: ['hambre']
      },
      {
        spanish: 'Hace calor.',
        english: 'It\'s hot. (weather expression)',
        highlight: ['calor']
      }
    ]
  },
  {
    title: 'Common Mistakes with Articles',
    content: `Here are the most common mistakes English speakers make with Spanish articles:

**Mistake 1**: Using wrong gender article
**Mistake 2**: Forgetting contractions (al, del)
**Mistake 3**: Using articles where they shouldn't be used
**Mistake 4**: Not using articles where they should be used
**Mistake 5**: Forgetting plural agreement`,
    examples: [
      {
        spanish: '❌ la problema ✅ el problema',
        english: '❌ the problem ✅ the problem (masculine)',
        highlight: ['la', 'el']
      },
      {
        spanish: '❌ a el mercado ✅ al mercado',
        english: '❌ to the market ✅ to the market (contraction)',
        highlight: ['a el', 'al']
      },
      {
        spanish: '❌ Me gusta el música ✅ Me gusta la música',
        english: '❌ I like the music ✅ I like music (feminine)',
        highlight: ['el', 'la']
      },
      {
        spanish: '❌ Hablo el español ✅ Hablo español',
        english: '❌ I speak the Spanish ✅ I speak Spanish (no article)',
        highlight: ['el español', 'español']
      },
      {
        spanish: '❌ los mesa ✅ las mesas',
        english: '❌ the tables ✅ the tables (feminine plural)',
        highlight: ['los', 'las']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'Spanish Noun Gender',
    url: '/grammar/spanish/nouns/gender',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Noun Plurals',
    url: '/grammar/spanish/nouns/plurals',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Adjective Agreement',
    url: '/grammar/spanish/adjectives/agreement',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Prepositions',
    url: '/grammar/spanish/prepositions/basic',
    difficulty: 'intermediate'
  }
];

export default function SpanishDefiniteIndefinitePage() {
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
              topic: 'definite-indefinite',
              title: 'Spanish Definite and Indefinite Articles',
              description: 'Master Spanish articles (el, la, los, las, un, una, unos, unas) with comprehensive rules and examples.',
              difficulty: 'beginner',
              examples: [
                'el libro (the book)',
                'la mesa (the table)',
                'un gato (a cat)',
                'una casa (a house)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'nouns',
              topic: 'definite-indefinite',
              title: 'Spanish Definite and Indefinite Articles'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="nouns"
        topic="definite-indefinite"
        title="Spanish Definite and Indefinite Articles"
        description="Master Spanish articles (el, la, los, las, un, una, unos, unas) with comprehensive rules and examples"
        difficulty="beginner"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/spanish/nouns"
        practiceUrl="/grammar/spanish/nouns/definite-indefinite/practice"
        quizUrl="/grammar/spanish/nouns/definite-indefinite/quiz"
        songUrl="/songs/es?theme=grammar&topic=articles"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
