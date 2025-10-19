import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'adjectives',
  topic: 'possessive',
  title: 'Spanish Possessive Adjectives',
  description: 'Master Spanish possessive adjectives: mi, tu, su, nuestro, vuestro with agreement rules, examples, and practice exercises.',
  difficulty: 'beginner',
  keywords: [
    'spanish possessive adjectives',
    'mi tu su nuestro vuestro',
    'possessive determiners spanish',
    'my your his her our their spanish',
    'spanish grammar possessives',
    'possessive agreement spanish'
  ],
  examples: [
    'mi casa (my house)',
    'tu libro (your book)',
    'nuestro coche (our car)',
    'sus padres (his/her/their parents)'
  ]
});

const sections = [
  {
    title: 'What are Possessive Adjectives?',
    content: `Spanish possessive adjectives indicate **ownership** or **relationship** between the speaker and a noun. They answer the question "whose?" and must agree with the **noun they modify** (not with the owner).

Important: Spanish possessive adjectives agree with the **thing possessed**, not the **possessor**. This is different from English, where we choose based on who owns something.`,
    examples: [
      {
        spanish: 'Es mi libro.',
        english: 'It\'s my book.',
        highlight: ['mi']
      },
      {
        spanish: 'Nuestra casa es grande.',
        english: 'Our house is big.',
        highlight: ['Nuestra']
      },
      {
        spanish: 'Sus hijos son inteligentes.',
        english: 'His/her/their children are intelligent.',
        highlight: ['Sus']
      }
    ]
  },
  {
    title: 'Short Form Possessive Adjectives',
    content: `The **short forms** are the most common possessive adjectives in Spanish. They go **before** the noun and some agree with gender and number.`,
    subsections: [
      {
        title: 'Forms of Possessive Adjectives',
        content: `Here are all the short forms with their agreement patterns:`,
        conjugationTable: {
          title: 'Short Form Possessive Adjectives',
          conjugations: [
            { pronoun: 'mi (my)', form: 'mi, mi, mis, mis', english: 'my (invariable for gender)' },
            { pronoun: 'tu (your - informal)', form: 'tu, tu, tus, tus', english: 'your (invariable for gender)' },
            { pronoun: 'su (his/her/your formal)', form: 'su, su, sus, sus', english: 'his/her/your (invariable for gender)' },
            { pronoun: 'nuestro (our)', form: 'nuestro, nuestra, nuestros, nuestras', english: 'our (agrees in gender & number)' },
            { pronoun: 'vuestro (your - plural)', form: 'vuestro, vuestra, vuestros, vuestras', english: 'your plural (agrees in gender & number)' },
            { pronoun: 'su (their/your formal pl.)', form: 'su, su, sus, sus', english: 'their/your (invariable for gender)' }
          ]
        },
        examples: [
          {
            spanish: 'mi hermano, mi hermana',
            english: 'my brother, my sister',
            highlight: ['mi', 'mi']
          },
          {
            spanish: 'nuestro padre, nuestra madre',
            english: 'our father, our mother',
            highlight: ['nuestro', 'nuestra']
          },
          {
            spanish: 'sus libros, sus casas',
            english: 'his/her/their books, his/her/their houses',
            highlight: ['sus', 'sus']
          }
        ]
      },
      {
        title: 'Agreement Rules',
        content: `**Key Agreement Rules:**

1. **Mi, tu, su** only agree in **number** (singular/plural), not gender
2. **Nuestro, vuestro** agree in both **gender and number**
3. The adjective agrees with the **thing possessed**, not the owner`,
        examples: [
          {
            spanish: 'mi casa, mis casas (feminine noun, but mi doesn\'t change)',
            english: 'my house, my houses',
            highlight: ['mi', 'mis']
          },
          {
            spanish: 'nuestro coche (masc.), nuestra bicicleta (fem.)',
            english: 'our car, our bicycle',
            highlight: ['nuestro', 'nuestra']
          },
          {
            spanish: 'María habla con su madre (María is female, but su doesn\'t change)',
            english: 'María talks with her mother',
            highlight: ['su']
          }
        ]
      }
    ]
  },
  {
    title: 'Individual Possessive Adjectives',
    content: `Let's examine each possessive adjective in detail:`,
    subsections: [
      {
        title: 'Mi (My)',
        content: `**Mi** is invariable for gender - it's the same whether the noun is masculine or feminine. Only changes for number:`,
        examples: [
          {
            spanish: 'mi padre (masculine)',
            english: 'my father',
            highlight: ['mi']
          },
          {
            spanish: 'mi madre (feminine)',
            english: 'my mother',
            highlight: ['mi']
          },
          {
            spanish: 'mis padres (plural)',
            english: 'my parents',
            highlight: ['mis']
          },
          {
            spanish: 'mis hermanas (plural)',
            english: 'my sisters',
            highlight: ['mis']
          }
        ]
      },
      {
        title: 'Tu (Your - informal)',
        content: `**Tu** refers to one person you know well (informal "you"). Like mi, it only agrees in number:

⚠️ **Note**: Don't confuse **tu** (your) with **tú** (you). **Tu** has no accent mark.`,
        examples: [
          {
            spanish: 'tu hermano',
            english: 'your brother',
            highlight: ['tu']
          },
          {
            spanish: 'tu hermana',
            english: 'your sister',
            highlight: ['tu']
          },
          {
            spanish: 'tus amigos',
            english: 'your friends',
            highlight: ['tus']
          },
          {
            spanish: '¿Dónde están tus llaves?',
            english: 'Where are your keys?',
            highlight: ['tus']
          }
        ]
      },
      {
        title: 'Su (His, Her, Your formal, Their)',
        content: `**Su** is the most complex possessive adjective because it can mean:
- **his** (de él)
- **her** (de ella) 
- **your** formal (de usted)
- **their** (de ellos/ellas)
- **your** plural formal (de ustedes)

Context usually makes the meaning clear:`,
        examples: [
          {
            spanish: 'Juan busca su libro. (his book)',
            english: 'Juan looks for his book.',
            highlight: ['su']
          },
          {
            spanish: 'María ama a su familia. (her family)',
            english: 'María loves her family.',
            highlight: ['su']
          },
          {
            spanish: '¿Cuál es su nombre? (your name - formal)',
            english: 'What is your name?',
            highlight: ['su']
          },
          {
            spanish: 'Los estudiantes tienen sus libros. (their books)',
            english: 'The students have their books.',
            highlight: ['sus']
          }
        ]
      },
      {
        title: 'Nuestro (Our)',
        content: `**Nuestro** agrees in both gender and number with the possessed noun:`,
        conjugationTable: {
          title: 'Nuestro Forms',
          conjugations: [
            { pronoun: 'Masculine singular', form: 'nuestro', english: 'our (masc. sing.)' },
            { pronoun: 'Feminine singular', form: 'nuestra', english: 'our (fem. sing.)' },
            { pronoun: 'Masculine plural', form: 'nuestros', english: 'our (masc. pl.)' },
            { pronoun: 'Feminine plural', form: 'nuestras', english: 'our (fem. pl.)' }
          ]
        },
        examples: [
          {
            spanish: 'nuestro perro',
            english: 'our dog',
            highlight: ['nuestro']
          },
          {
            spanish: 'nuestra casa',
            english: 'our house',
            highlight: ['nuestra']
          },
          {
            spanish: 'nuestros hijos',
            english: 'our children',
            highlight: ['nuestros']
          },
          {
            spanish: 'nuestras ideas',
            english: 'our ideas',
            highlight: ['nuestras']
          }
        ]
      },
      {
        title: 'Vuestro (Your - plural informal)',
        content: `**Vuestro** is used in Spain for informal "your" when talking to multiple people. Like nuestro, it agrees in gender and number:

**Note**: In Latin America, **su** is used instead of **vuestro**.`,
        conjugationTable: {
          title: 'Vuestro Forms',
          conjugations: [
            { pronoun: 'Masculine singular', form: 'vuestro', english: 'your pl. (masc. sing.)' },
            { pronoun: 'Feminine singular', form: 'vuestra', english: 'your pl. (fem. sing.)' },
            { pronoun: 'Masculine plural', form: 'vuestros', english: 'your pl. (masc. pl.)' },
            { pronoun: 'Feminine plural', form: 'vuestras', english: 'your pl. (fem. pl.)' }
          ]
        },
        examples: [
          {
            spanish: 'vuestro coche (Spain)',
            english: 'your (plural) car',
            highlight: ['vuestro']
          },
          {
            spanish: 'vuestra casa (Spain)',
            english: 'your (plural) house',
            highlight: ['vuestra']
          },
          {
            spanish: 'su coche (Latin America)',
            english: 'your (plural) car',
            highlight: ['su']
          }
        ]
      }
    ]
  },
  {
    title: 'Clarifying Su - Avoiding Ambiguity',
    content: `Since **su** can mean "his," "her," "your," or "their," it can sometimes be ambiguous. Spanish offers ways to clarify:`,
    subsections: [
      {
        title: 'Using Prepositional Phrases',
        content: `To clarify who the owner is, you can use **de + pronoun**:`,
        examples: [
          {
            spanish: 'el libro de él (his book)',
            english: 'his book (clarifying)',
            highlight: ['de él']
          },
          {
            spanish: 'el libro de ella (her book)',
            english: 'her book (clarifying)',
            highlight: ['de ella']
          },
          {
            spanish: 'el libro de usted (your book - formal)',
            english: 'your book (clarifying)',
            highlight: ['de usted']
          },
          {
            spanish: 'el libro de ellos (their book - masculine group)',
            english: 'their book (clarifying)',
            highlight: ['de ellos']
          }
        ]
      },
      {
        title: 'When Clarification is Needed',
        content: `Clarification is most needed when:
1. **Multiple possible owners** are mentioned
2. **Formal/polite situations** where precision matters
3. **Emphasis** is desired`,
        examples: [
          {
            spanish: 'Juan y María están aquí. El coche de él es rojo.',
            english: 'Juan and María are here. His car is red. (clarifying whose car)',
            highlight: ['de él']
          },
          {
            spanish: '¿Es este el bolso de usted?',
            english: 'Is this your purse? (formal, clarifying)',
            highlight: ['de usted']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes and Tips',
    content: `Here are frequent errors to avoid with possessive adjectives:

**1. Wrong agreement:**
❌ *nuestra padre* → ✅ **nuestro padre**

**2. Confusing tu (your) with tú (you):**
❌ *tú libro* → ✅ **tu libro**

**3. Overusing clarification:**
Usually **su** is clear from context - only clarify when truly ambiguous.

**4. Forgetting that agreement is with the possessed noun:**
Remember: **mi hermana** (my sister) - **mi** agrees with **hermana**, not with "I"`,
    examples: [
      {
        spanish: 'Nuestro profesor es muy bueno.',
        english: 'Our teacher is very good. (profesor is masculine)',
        highlight: ['Nuestro']
      },
      {
        spanish: 'Tu hermana es simpática.',
        english: 'Your sister is nice. (no accent on tu)',
        highlight: ['Tu']
      },
      {
        spanish: 'María tiene su libro. (context makes it clear = her book)',
        english: 'María has her book.',
        highlight: ['su']
      }
    ]
  },
  {
    title: 'Long Form Possessive Adjectives',
    content: `Spanish also has **long forms** that go **after** the noun and are used for emphasis or in certain expressions. These are less common but important to recognize:

**Long forms**: mío, tuyo, suyo, nuestro, vuestro (all agree in gender and number)

These are typically used:
- **For emphasis**
- **After the verb ser**
- **In exclamations**`,
    examples: [
      {
        spanish: 'un amigo mío',
        english: 'a friend of mine',
        highlight: ['mío']
      },
      {
        spanish: '¡Dios mío!',
        english: 'My God!',
        highlight: ['mío']
      },
      {
        spanish: 'El libro es tuyo.',
        english: 'The book is yours.',
        highlight: ['tuyo']
      },
      {
        spanish: 'Esta casa es nuestra.',
        english: 'This house is ours.',
        highlight: ['nuestra']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Demonstrative Adjectives', url: '/grammar/spanish/adjectives/demonstrative', difficulty: 'beginner' },
  { title: 'Indefinite Adjectives', url: '/grammar/spanish/adjectives/indefinite', difficulty: 'intermediate' },
  { title: 'Adjective Agreement', url: '/grammar/spanish/adjectives/agreement', difficulty: 'beginner' },
  { title: 'Personal Pronouns', url: '/grammar/spanish/pronouns/personal', difficulty: 'beginner' }
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
              category: 'adjectives',
              topic: 'possessive',
              title: 'Spanish Possessive Adjectives',
              description: 'Master Spanish possessive adjectives with comprehensive explanations and practice.',
              difficulty: 'beginner',
              examples: [
                'mi casa (my house)',
                'tu libro (your book)',
                'nuestro coche (our car)',
                'sus padres (his/her/their parents)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'adjectives',
              topic: 'possessive',
              title: 'Spanish Possessive Adjectives'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="adjectives"
        topic="possessive"
        title="Spanish Possessive Adjectives"
        description="Master Spanish possessive adjectives: mi, tu, su, nuestro, vuestro with agreement rules"
        difficulty="beginner"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/spanish"
        practiceUrl="/grammar/spanish/adjectives/possessive/practice"
        quizUrl="/grammar/spanish/adjectives/possessive/quiz"
        songUrl="/songs/es?theme=grammar&topic=possessive-adjectives"
        youtubeVideoId=""
        relatedTopics={relatedTopics}
      />
    </>
  );
}