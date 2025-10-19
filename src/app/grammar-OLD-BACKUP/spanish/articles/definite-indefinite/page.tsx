import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'articles',
  topic: 'definite-indefinite',
  title: 'Spanish Articles - Definite and Indefinite',
  description: 'Master Spanish definite (el, la, los, las) and indefinite (un, una, unos, unas) articles with comprehensive rules and practice.',
  difficulty: 'beginner',
  keywords: [
    'spanish articles',
    'el la los las',
    'un una unos unas',
    'definite articles spanish',
    'indefinite articles spanish',
    'spanish grammar articles',
    'article agreement spanish'
  ],
  examples: [
    'el libro (the book)',
    'la mesa (the table)',
    'un coche (a car)',
    'una casa (a house)'
  ]
});

const sections = [
  {
    title: 'What are Spanish Articles?',
    content: `Spanish articles are small words that go before nouns to indicate whether we're talking about something **specific** (definite) or **general** (indefinite). They must **agree** with the gender (masculine/feminine) and number (singular/plural) of the noun.

Spanish has two types of articles:
- **Definite articles**: el, la, los, las (the)
- **Indefinite articles**: un, una, unos, unas (a/an, some)`,
    examples: [
      {
        spanish: 'El perro está en el jardín.',
        english: 'The dog is in the garden. (specific dog)',
        highlight: ['El', 'el']
      },
      {
        spanish: 'Un perro está en el parque.',
        english: 'A dog is in the park. (any dog)',
        highlight: ['Un']
      }
    ]
  },
  {
    title: 'Definite Articles (The)',
    content: `Definite articles (**el, la, los, las**) refer to **specific** nouns that are already known to both speaker and listener. They're equivalent to "the" in English.`,
    subsections: [
      {
        title: 'Forms of Definite Articles',
        content: `The definite article changes based on the gender and number of the noun:`,
        conjugationTable: {
          title: 'Definite Articles',
          conjugations: [
            { pronoun: 'Masculine singular', form: 'el', english: 'the (masc. sing.)' },
            { pronoun: 'Feminine singular', form: 'la', english: 'the (fem. sing.)' },
            { pronoun: 'Masculine plural', form: 'los', english: 'the (masc. pl.)' },
            { pronoun: 'Feminine plural', form: 'las', english: 'the (fem. pl.)' }
          ]
        },
        examples: [
          {
            spanish: 'el profesor (the male teacher)',
            english: 'the male teacher',
            highlight: ['el']
          },
          {
            spanish: 'la profesora (the female teacher)',
            english: 'the female teacher',
            highlight: ['la']
          },
          {
            spanish: 'los estudiantes (the male/mixed students)',
            english: 'the male/mixed students',
            highlight: ['los']
          },
          {
            spanish: 'las estudiantes (the female students)',
            english: 'the female students',
            highlight: ['las']
          }
        ]
      },
      {
        title: 'When to Use Definite Articles',
        content: `Use definite articles when referring to:

**1. Specific, known objects:**
**2. Abstract concepts and general statements:**
**3. Languages (when they are the subject):**
**4. Days of the week (except after ser):**
**5. Body parts and clothing (often with reflexive verbs):**`,
        examples: [
          {
            spanish: 'La casa de María es grande.',
            english: 'Maria\'s house is big. (specific house)',
            highlight: ['La']
          },
          {
            spanish: 'El amor es importante.',
            english: 'Love is important. (abstract concept)',
            highlight: ['El']
          },
          {
            spanish: 'El español es fácil.',
            english: 'Spanish is easy. (language as subject)',
            highlight: ['El']
          },
          {
            spanish: 'Los lunes trabajo.',
            english: 'On Mondays I work.',
            highlight: ['Los']
          },
          {
            spanish: 'Me lavo las manos.',
            english: 'I wash my hands. (body parts)',
            highlight: ['las']
          }
        ]
      },
      {
        title: 'Contractions with Definite Articles',
        content: `Spanish has two mandatory contractions with definite articles:

**a + el = al** (to the)
**de + el = del** (of/from the)

Note: These contractions only occur with **el**, not with **la**, **los**, or **las**.`,
        examples: [
          {
            spanish: 'Voy al cine. (a + el = al)',
            english: 'I\'m going to the cinema.',
            highlight: ['al']
          },
          {
            spanish: 'Vengo del trabajo. (de + el = del)',
            english: 'I\'m coming from work.',
            highlight: ['del']
          },
          {
            spanish: 'Hablo a la profesora. (no contraction)',
            english: 'I speak to the teacher.',
            highlight: ['a la']
          }
        ]
      }
    ]
  },
  {
    title: 'Indefinite Articles (A/An)',
    content: `Indefinite articles (**un, una, unos, unas**) refer to **non-specific** nouns or introduce new information. They're equivalent to "a/an" (singular) or "some" (plural) in English.`,
    subsections: [
      {
        title: 'Forms of Indefinite Articles',
        content: `The indefinite article also agrees with gender and number:`,
        conjugationTable: {
          title: 'Indefinite Articles',
          conjugations: [
            { pronoun: 'Masculine singular', form: 'un', english: 'a/an (masc.)' },
            { pronoun: 'Feminine singular', form: 'una', english: 'a/an (fem.)' },
            { pronoun: 'Masculine plural', form: 'unos', english: 'some (masc.)' },
            { pronoun: 'Feminine plural', form: 'unas', english: 'some (fem.)' }
          ]
        },
        examples: [
          {
            spanish: 'un libro interesante',
            english: 'an interesting book',
            highlight: ['un']
          },
          {
            spanish: 'una mesa grande',
            english: 'a big table',
            highlight: ['una']
          },
          {
            spanish: 'unos amigos simpáticos',
            english: 'some nice friends',
            highlight: ['unos']
          },
          {
            spanish: 'unas flores bonitas',
            english: 'some beautiful flowers',
            highlight: ['unas']
          }
        ]
      },
      {
        title: 'When to Use Indefinite Articles',
        content: `Use indefinite articles when:

**1. Introducing something new or non-specific:**
**2. Expressing quantity (some):**
**3. With professions (after ser):**
**4. In exclamations:**`,
        examples: [
          {
            spanish: 'Necesito un coche.',
            english: 'I need a car. (any car)',
            highlight: ['un']
          },
          {
            spanish: 'Compré unas manzanas.',
            english: 'I bought some apples.',
            highlight: ['unas']
          },
          {
            spanish: 'Soy una doctora.',
            english: 'I am a doctor.',
            highlight: ['una']
          },
          {
            spanish: '¡Qué una sorpresa!',
            english: 'What a surprise!',
            highlight: ['una']
          }
        ]
      },
      {
        title: 'When to Omit Indefinite Articles',
        content: `Unlike English, Spanish often omits indefinite articles in certain cases:

**1. With professions after ser (sometimes):**
**2. After prepositions in some expressions:**
**3. With certain verbs like tener, hay:**
**4. In negative sentences with no:**`,
        examples: [
          {
            spanish: 'Es profesor. (or: Es un profesor)',
            english: 'He is a teacher.',
            highlight: ['profesor']
          },
          {
            spanish: 'Trabajo sin computadora.',
            english: 'I work without a computer.',
            highlight: ['computadora']
          },
          {
            spanish: 'No tengo coche.',
            english: 'I don\'t have a car.',
            highlight: ['coche']
          }
        ]
      }
    ]
  },
  {
    title: 'Article Agreement Rules',
    content: `Spanish articles must always agree with the gender and number of the noun they modify. This agreement is essential and affects the entire noun phrase.`,
    examples: [
      {
        spanish: 'el problema difícil → los problemas difíciles',
        english: 'the difficult problem → the difficult problems',
        highlight: ['el', 'los']
      },
      {
        spanish: 'una estudiante inteligente → unas estudiantes inteligentes',
        english: 'an intelligent student → some intelligent students',
        highlight: ['una', 'unas']
      },
      {
        spanish: 'la información importante → las informaciones importantes',
        english: 'the important information → the important pieces of information',
        highlight: ['la', 'las']
      }
    ]
  },
  {
    title: 'Common Mistakes to Avoid',
    content: `Here are frequent errors Spanish learners make with articles:

**1. Forgetting gender agreement:**
❌ *la problema* → ✅ **el problema**

**2. Using definite articles with general statements incorrectly:**
❌ *Me gusta el chocolate* (correct, but learners often omit it)

**3. Forgetting contractions:**
❌ *Voy a el cine* → ✅ **Voy al cine**

**4. Using articles with proper names:**
❌ *El Juan* → ✅ **Juan**`,
    examples: [
      {
        spanish: 'Me gusta el café.',
        english: 'I like coffee. (in general)',
        highlight: ['el']
      },
      {
        spanish: 'Voy al supermercado.',
        english: 'I\'m going to the supermarket.',
        highlight: ['al']
      },
      {
        spanish: 'María es mi hermana.',
        english: 'María is my sister. (no article with names)',
        highlight: ['María']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Noun Gender and Plurals', url: '/grammar/spanish/nouns/gender-and-plurals', difficulty: 'beginner' },
  { title: 'Adjective Agreement', url: '/grammar/spanish/adjectives/agreement', difficulty: 'beginner' },
  { title: 'Demonstrative Adjectives', url: '/grammar/spanish/adjectives/demonstrative', difficulty: 'beginner' },
  { title: 'Possessive Adjectives', url: '/grammar/spanish/adjectives/possessive', difficulty: 'beginner' }
];

export default function SpanishArticlesPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'articles',
              topic: 'definite-indefinite',
              title: 'Spanish Articles - Definite and Indefinite',
              description: 'Master Spanish definite and indefinite articles with comprehensive rules and practice.',
              difficulty: 'beginner',
              examples: [
                'el libro (the book)',
                'la mesa (the table)', 
                'un coche (a car)',
                'una casa (a house)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'articles',
              topic: 'definite-indefinite',
              title: 'Spanish Articles - Definite and Indefinite'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="articles"
        topic="definite-indefinite"
        title="Spanish Articles - Definite and Indefinite"
        description="Master Spanish definite and indefinite articles with comprehensive rules and examples"
        difficulty="beginner"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/spanish"
        practiceUrl="/grammar/spanish/articles/definite-indefinite/practice"
        quizUrl="/grammar/spanish/articles/definite-indefinite/quiz"
        songUrl="/songs/es?theme=grammar&topic=articles"
        youtubeVideoId=""
        relatedTopics={relatedTopics}
      />
    </>
  );
}