import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'adverbial-prepositional',
  topic: 'superlatives',
  title: 'Spanish Superlatives - El Más, El Menos, -ísimo Endings',
  description: 'Master Spanish superlative forms including relative superlatives (el más) and absolute superlatives (-ísimo).',
  difficulty: 'intermediate',
  keywords: [
    'spanish superlatives',
    'el mas spanish',
    'isimo spanish endings',
    'spanish absolute superlative',
    'spanish relative superlative'
  ],
  examples: [
    'Es el estudiante más inteligente de la clase. (He is the most intelligent student in the class.)',
    'Esta es la casa más cara del barrio. (This is the most expensive house in the neighborhood.)',
    'Está contentísimo. (He is extremely happy.)',
    'Es facilísimo. (It is extremely easy.)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Superlatives',
    content: `Spanish **superlatives** (superlativos) express the **highest or lowest degree** of a quality. They show that something or someone has a quality **to the maximum or minimum extent**.

**Two types of superlatives:**
- **Relative superlative**: Compares within a group (el más/menos... de)
- **Absolute superlative**: Expresses extreme degree without comparison (-ísimo, muy)

**Relative superlative structure:**
**el/la/los/las + más/menos + adjective + de + group**

**Absolute superlative forms:**
- **-ísimo/a/os/as**: adjective + -ísimo
- **muy + adjective**: very + adjective
- **súper/ultra/extra**: prefix intensifiers

**Key features:**
- **Article agreement**: Definite article agrees with noun
- **Group reference**: "de" introduces the comparison group
- **Irregular forms**: Some adjectives have special superlative forms
- **Emphasis**: Express extreme qualities

**Why superlatives matter:**
- **Emphasis**: Express extreme qualities and degrees
- **Descriptive power**: Create vivid descriptions
- **Natural expression**: Common in everyday Spanish
- **Advanced communication**: Show sophisticated language use

Understanding superlatives is **crucial** for **expressive Spanish communication**.`,
    examples: [
      {
        spanish: 'RELATIVE: Es el libro más interesante de la biblioteca. (It\'s the most interesting book in the library.)',
        english: 'ABSOLUTE: Es un libro interesantísimo. (It\'s an extremely interesting book.)',
        highlight: ['más interesante de', 'interesantísimo']
      },
      {
        spanish: 'RELATIVE: María es la menos tímida del grupo. (María is the least shy in the group.)',
        english: 'ABSOLUTE: Pedro es altísimo. (Pedro is extremely tall.)',
        highlight: ['menos tímida del', 'altísimo']
      }
    ]
  },
  {
    title: 'Relative Superlatives - El Más/Menos... De',
    content: `**Relative superlatives** compare within a specific group:`,
    conjugationTable: {
      title: 'Relative Superlative Structure',
      conjugations: [
        { pronoun: 'Masculine singular', form: 'el más/menos + adj + de', english: 'el más alto de (the tallest of)' },
        { pronoun: 'Feminine singular', form: 'la más/menos + adj + de', english: 'la más bonita de (the prettiest of)' },
        { pronoun: 'Masculine plural', form: 'los más/menos + adj + de', english: 'los más inteligentes de (the most intelligent of)' },
        { pronoun: 'Feminine plural', form: 'las más/menos + adj + de', english: 'las más caras de (the most expensive of)' }
      ]
    },
    examples: [
      {
        spanish: 'SUPERIORITY: Juan es el estudiante más trabajador de la clase. (Juan is the most hardworking student in the class.)',
        english: 'INFERIORITY: Esta es la película menos interesante del año. (This is the least interesting movie of the year.)',
        highlight: ['más trabajador de', 'menos interesante del']
      },
      {
        spanish: 'PLURAL: Son los coches más caros de la tienda. (They are the most expensive cars in the store.)',
        english: 'FEMININE: Es la ciudad más bella del país. (It\'s the most beautiful city in the country.)',
        highlight: ['más caros de', 'más bella del']
      }
    ]
  },
  {
    title: 'Article Agreement in Superlatives',
    content: `**Definite articles** must agree with the **noun being described**:`,
    conjugationTable: {
      title: 'Article Agreement Rules',
      conjugations: [
        { pronoun: 'el + masculine noun', form: 'el más/menos', english: 'el hombre más alto (the tallest man)' },
        { pronoun: 'la + feminine noun', form: 'la más/menos', english: 'la mujer más inteligente (the most intelligent woman)' },
        { pronoun: 'los + masculine plural', form: 'los más/menos', english: 'los libros más caros (the most expensive books)' },
        { pronoun: 'las + feminine plural', form: 'las más/menos', english: 'las casas más grandes (the biggest houses)' }
      ]
    },
    examples: [
      {
        spanish: 'AGREEMENT: El problema más difícil de todos. (The most difficult problem of all.)',
        english: 'AGREEMENT: La solución más fácil del mundo. (The easiest solution in the world.)',
        highlight: ['El problema más difícil', 'La solución más fácil']
      },
      {
        spanish: 'PLURAL: Los ejercicios más complicados del libro. (The most complicated exercises in the book.)',
        english: 'PLURAL: Las preguntas más importantes del examen. (The most important questions on the exam.)',
        highlight: ['Los ejercicios más complicados', 'Las preguntas más importantes']
      }
    ]
  },
  {
    title: 'Irregular Superlatives',
    content: `**Some adjectives** have **irregular superlative forms**:`,
    conjugationTable: {
      title: 'Irregular Superlative Forms',
      conjugations: [
        { pronoun: 'bueno → el mejor', form: 'the best', english: 'Es el mejor estudiante de la clase. (He\'s the best student in the class.)' },
        { pronoun: 'malo → el peor', form: 'the worst', english: 'Es el peor día del año. (It\'s the worst day of the year.)' },
        { pronoun: 'grande → el mayor', form: 'the biggest/oldest', english: 'Es el mayor de los hermanos. (He\'s the oldest of the brothers.)' },
        { pronoun: 'pequeño → el menor', form: 'the smallest/youngest', english: 'Es la menor de la familia. (She\'s the youngest in the family.)' }
      ]
    },
    examples: [
      {
        spanish: 'BEST: Este es el mejor restaurante de la ciudad. (This is the best restaurant in the city.)',
        english: 'WORST: Fue el peor error de mi vida. (It was the worst mistake of my life.)',
        highlight: ['el mejor restaurante', 'el peor error']
      },
      {
        spanish: 'OLDEST: Mi hermano mayor estudia medicina. (My oldest brother studies medicine.)',
        english: 'YOUNGEST: La hermana menor tiene cinco años. (The youngest sister is five years old.)',
        highlight: ['hermano mayor', 'hermana menor']
      }
    ]
  },
  {
    title: 'Absolute Superlatives - -ísimo Endings',
    content: `**Absolute superlatives** express **extreme degree** without comparison:`,
    conjugationTable: {
      title: 'Absolute Superlative Formation',
      conjugations: [
        { pronoun: 'Regular formation', form: 'adjective + -ísimo/a/os/as', english: 'alto → altísimo (extremely tall)' },
        { pronoun: 'Drop final vowel', form: 'remove -o/-a + -ísimo', english: 'grande → grandísimo (extremely big)' },
        { pronoun: 'Consonant ending', form: 'add -ísimo directly', english: 'fácil → facilísimo (extremely easy)' },
        { pronoun: 'Spelling changes', form: 'maintain pronunciation', english: 'rico → riquísimo (extremely rich)' }
      ]
    },
    examples: [
      {
        spanish: 'REGULAR: La película es divertidísima. (The movie is extremely funny.)',
        english: 'CONSONANT: El examen fue facilísimo. (The exam was extremely easy.)',
        highlight: ['divertidísima', 'facilísimo']
      },
      {
        spanish: 'SPELLING CHANGE: El postre está riquísimo. (The dessert is extremely delicious.)',
        english: 'AGREEMENT: Las casas son carísimas. (The houses are extremely expensive.)',
        highlight: ['riquísimo', 'carísimas']
      }
    ]
  },
  {
    title: 'Spelling Changes in -ísimo Forms',
    content: `**Spelling changes** preserve pronunciation in -ísimo forms:`,
    conjugationTable: {
      title: 'Common Spelling Changes',
      conjugations: [
        { pronoun: 'c → qu', form: 'rico → riquísimo', english: 'extremely rich' },
        { pronoun: 'g → gu', form: 'largo → larguísimo', english: 'extremely long' },
        { pronoun: 'z → c', form: 'feliz → felicísimo', english: 'extremely happy' },
        { pronoun: 'ble → bil', form: 'amable → amabilísimo', english: 'extremely kind' }
      ]
    },
    examples: [
      {
        spanish: 'C→QU: Este café está riquísimo. (This coffee is extremely delicious.)',
        english: 'G→GU: El viaje fue larguísimo. (The trip was extremely long.)',
        highlight: ['riquísimo', 'larguísimo']
      },
      {
        spanish: 'Z→C: Estoy felicísimo con los resultados. (I am extremely happy with the results.)',
        english: 'BLE→BIL: Es una persona amabilísima. (He/she is an extremely kind person.)',
        highlight: ['felicísimo', 'amabilísima']
      }
    ]
  },
  {
    title: 'Alternative Absolute Superlative Forms',
    content: `**Other ways** to express absolute superlatives:`,
    conjugationTable: {
      title: 'Alternative Superlative Forms',
      conjugations: [
        { pronoun: 'muy + adjective', form: 'very + adjective', english: 'muy inteligente (very intelligent)' },
        { pronoun: 'súper + adjective', form: 'super + adjective', english: 'súper fácil (super easy)' },
        { pronoun: 'ultra + adjective', form: 'ultra + adjective', english: 'ultra moderno (ultra modern)' },
        { pronoun: 'extra + adjective', form: 'extra + adjective', english: 'extra grande (extra large)' }
      ]
    },
    examples: [
      {
        spanish: 'MUY: La comida está muy rica. (The food is very delicious.)',
        english: 'SÚPER: El examen fue súper difícil. (The exam was super difficult.)',
        highlight: ['muy rica', 'súper difícil']
      },
      {
        spanish: 'ULTRA: Es un diseño ultra moderno. (It\'s an ultra modern design.)',
        english: 'EXTRA: Quiero una pizza extra grande. (I want an extra large pizza.)',
        highlight: ['ultra moderno', 'extra grande']
      }
    ]
  },
  {
    title: 'Superlatives with Adverbs',
    content: `**Adverbs** can also form superlatives:`,
    examples: [
      {
        spanish: 'RELATIVE: Él habla más claramente de todos. (He speaks most clearly of all.)',
        english: 'ABSOLUTE: Habla clarísimamente. (He speaks extremely clearly.)',
        highlight: ['más claramente de', 'clarísimamente']
      },
      {
        spanish: 'IRREGULAR: Canta mejor que nadie. (He sings better than anyone.)',
        english: 'EMPHASIS: Trabaja muchísimo. (He works an enormous amount.)',
        highlight: ['mejor que nadie', 'muchísimo']
      }
    ]
  },
  {
    title: 'Superlatives in Context',
    content: `**Using superlatives** in different contexts:`,
    examples: [
      {
        spanish: 'DESCRIPTION: Es la persona más generosa que conozco. (He/she is the most generous person I know.)',
        english: 'OPINION: Creo que es importantísimo estudiar idiomas. (I think it\'s extremely important to study languages.)',
        highlight: ['más generosa que conozco', 'importantísimo']
      },
      {
        spanish: 'EXPERIENCE: Fue el viaje más emocionante de mi vida. (It was the most exciting trip of my life.)',
        english: 'EMPHASIS: Estoy cansadísimo después del trabajo. (I am extremely tired after work.)',
        highlight: ['más emocionante de', 'cansadísimo']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Article disagreement**: Wrong article with superlative
**2. De vs en**: Using wrong preposition with superlative
**3. Double marking**: Using both más and -ísimo together
**4. Spelling errors**: Wrong spelling changes in -ísimo forms`,
    examples: [
      {
        spanish: '❌ la más alto → ✅ el más alto',
        english: 'Wrong: article must agree with noun (hombre)',
        highlight: ['el más alto']
      },
      {
        spanish: '❌ el más inteligente en la clase → ✅ el más inteligente de la clase',
        english: 'Wrong: use "de" (not "en") with superlatives',
        highlight: ['de la clase']
      },
      {
        spanish: '❌ el más facilísimo → ✅ facilísimo OR el más fácil',
        english: 'Wrong: don\'t use both más and -ísimo together',
        highlight: ['facilísimo']
      },
      {
        spanish: '❌ ricísimo → ✅ riquísimo',
        english: 'Wrong: must change c to qu before -ísimo',
        highlight: ['riquísimo']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Comparatives', url: '/grammar/spanish/adverbial-prepositional/comparatives', difficulty: 'intermediate' },
  { title: 'Spanish Adjective Agreement', url: '/grammar/spanish/adjectives/agreement', difficulty: 'beginner' },
  { title: 'Spanish Definite Articles', url: '/grammar/spanish/articles/definite', difficulty: 'beginner' },
  { title: 'Spanish Adverb Formation', url: '/grammar/spanish/adverbs/formation', difficulty: 'intermediate' }
];

export default function SpanishSuperlativesPage() {
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
              topic: 'superlatives',
              title: 'Spanish Superlatives - El Más, El Menos, -ísimo Endings',
              description: 'Master Spanish superlative forms including relative superlatives (el más) and absolute superlatives (-ísimo).',
              difficulty: 'intermediate',
              examples: [
                'Es el estudiante más inteligente de la clase. (He is the most intelligent student in the class.)',
                'Esta es la casa más cara del barrio. (This is the most expensive house in the neighborhood.)',
                'Está contentísimo. (He is extremely happy.)',
                'Es facilísimo. (It is extremely easy.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'adverbial-prepositional',
              topic: 'superlatives',
              title: 'Spanish Superlatives - El Más, El Menos, -ísimo Endings'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="adverbial-prepositional"
        topic="superlatives"
        title="Spanish Superlatives - El Más, El Menos, -ísimo Endings"
        description="Master Spanish superlative forms including relative superlatives (el más) and absolute superlatives (-ísimo)"
        difficulty="intermediate"
        estimatedTime={14}
        sections={sections}
        backUrl="/grammar/spanish/adverbial-prepositional"
        practiceUrl="/grammar/spanish/adverbial-prepositional/superlatives/practice"
        quizUrl="/grammar/spanish/adverbial-prepositional/superlatives/quiz"
        songUrl="/songs/es?theme=grammar&topic=superlatives"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
