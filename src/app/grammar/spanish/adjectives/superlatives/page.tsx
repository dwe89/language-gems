import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';

export const metadata: Metadata = {
  title: 'Spanish Superlative Adjectives - LanguageGems',
  description: 'Learn Spanish superlative adjectives. Master el más, la más, los más, las más and absolute superlatives with -ísimo.',
  keywords: 'Spanish superlatives, superlative adjectives, el más, la más, -ísimo, Spanish grammar, most least',
  openGraph: {
    title: 'Spanish Superlative Adjectives - LanguageGems',
    description: 'Learn Spanish superlative adjectives and superlative structures.',
    type: 'article',
  },
};

export default function SpanishSuperlativesPage() {
  const sections = [
    {
      title: 'Overview',
      content: 'Superlative adjectives express the highest or lowest degree of a quality. They are used to identify something as the most or least of a particular characteristic within a group. Spanish has two types of superlatives: relative superlatives (which compare within a group) and absolute superlatives (which express an extreme quality without comparison).'
    },
    {
      title: 'Relative Superlatives (Comparisons Within a Group)',
      content: 'Relative superlatives compare one item to all others in a group. They use the definite article (el, la, los, las) + más/menos + adjective.',
      subsections: [
        {
          title: 'Structure: el/la/los/las + más + adjective + de',
          content: 'The definite article must agree in gender and number with the noun. Use "de" to specify the group being compared.',
          examples: [
            {
              spanish: 'Es el estudiante más inteligente de la clase.',
              english: 'He is the most intelligent student in the class.',
              highlight: ['el más inteligente de']
            },
            {
              spanish: 'Esta es la película más interesante del año.',
              english: 'This is the most interesting movie of the year.',
              highlight: ['la más interesante del']
            },
            {
              spanish: 'Son los edificios más altos de la ciudad.',
              english: 'They are the tallest buildings in the city.',
              highlight: ['los más altos de']
            },
            {
              spanish: 'Estas son las casas más hermosas del barrio.',
              english: 'These are the most beautiful houses in the neighborhood.',
              highlight: ['las más hermosas del']
            }
          ]
        },
        {
          title: 'Superlatives of Inferiority (menos)',
          content: 'Use el/la/los/las + menos + adjective + de to express the least of a quality.',
          examples: [
            {
              spanish: 'Es el estudiante menos inteligente de la clase.',
              english: 'He is the least intelligent student in the class.',
              highlight: ['el menos inteligente de']
            },
            {
              spanish: 'Esta es la película menos interesante del año.',
              english: 'This is the least interesting movie of the year.',
              highlight: ['la menos interesante del']
            },
            {
              spanish: 'Son los edificios menos altos de la ciudad.',
              english: 'They are the least tall buildings in the city.',
              highlight: ['los menos altos de']
            }
          ]
        }
      ]
    },
    {
      title: 'Irregular Superlatives',
      content: 'Some common adjectives have irregular superlative forms.',
      subsections: [
        {
          title: 'BUENO (good) → EL MEJOR (the best)',
          conjugationTable: {
            title: 'Bueno Superlative Forms',
            conjugations: [
              { pronoun: 'Masculine Singular', form: 'el mejor', english: 'the best' },
              { pronoun: 'Feminine Singular', form: 'la mejor', english: 'the best' },
              { pronoun: 'Masculine Plural', form: 'los mejores', english: 'the best' },
              { pronoun: 'Feminine Plural', form: 'las mejores', english: 'the best' }
            ]
          },
          examples: [
            {
              spanish: 'Este es el mejor restaurante de la ciudad.',
              english: 'This is the best restaurant in the city.',
              highlight: ['el mejor']
            },
            {
              spanish: 'Ella es la mejor estudiante de la clase.',
              english: 'She is the best student in the class.',
              highlight: ['la mejor']
            }
          ]
        },
        {
          title: 'MALO (bad) → EL PEOR (the worst)',
          conjugationTable: {
            title: 'Malo Superlative Forms',
            conjugations: [
              { pronoun: 'Masculine Singular', form: 'el peor', english: 'the worst' },
              { pronoun: 'Feminine Singular', form: 'la peor', english: 'the worst' },
              { pronoun: 'Masculine Plural', form: 'los peores', english: 'the worst' },
              { pronoun: 'Feminine Plural', form: 'las peores', english: 'the worst' }
            ]
          },
          examples: [
            {
              spanish: 'Fue el peor día de mi vida.',
              english: 'It was the worst day of my life.',
              highlight: ['el peor']
            },
            {
              spanish: 'Esta es la peor película que he visto.',
              english: 'This is the worst movie I have seen.',
              highlight: ['la peor']
            }
          ]
        },
        {
          title: 'GRANDE (big) → EL MAYOR (the biggest/oldest)',
          conjugationTable: {
            title: 'Grande Superlative Forms',
            conjugations: [
              { pronoun: 'Masculine Singular', form: 'el mayor', english: 'the biggest/oldest' },
              { pronoun: 'Feminine Singular', form: 'la mayor', english: 'the biggest/oldest' },
              { pronoun: 'Masculine Plural', form: 'los mayores', english: 'the biggest/oldest' },
              { pronoun: 'Feminine Plural', form: 'las mayores', english: 'the biggest/oldest' }
            ]
          },
          examples: [
            {
              spanish: 'Nueva York es la mayor ciudad de Estados Unidos.',
              english: 'New York is the biggest city in the United States.',
              highlight: ['la mayor']
            },
            {
              spanish: 'Mi hermano es el mayor de la familia.',
              english: 'My brother is the oldest in the family.',
              highlight: ['el mayor']
            }
          ]
        },
        {
          title: 'PEQUEÑO (small) → EL MENOR (the smallest/youngest)',
          conjugationTable: {
            title: 'Pequeño Superlative Forms',
            conjugations: [
              { pronoun: 'Masculine Singular', form: 'el menor', english: 'the smallest/youngest' },
              { pronoun: 'Feminine Singular', form: 'la menor', english: 'the smallest/youngest' },
              { pronoun: 'Masculine Plural', form: 'los menores', english: 'the smallest/youngest' },
              { pronoun: 'Feminine Plural', form: 'las menores', english: 'the smallest/youngest' }
            ]
          },
          examples: [
            {
              spanish: 'Mi hermana es la menor de la familia.',
              english: 'My sister is the youngest in the family.',
              highlight: ['la menor']
            },
            {
              spanish: 'Este es el menor de los tres pueblos.',
              english: 'This is the smallest of the three towns.',
              highlight: ['el menor']
            }
          ]
        }
      ]
    },
    {
      title: 'Absolute Superlatives (-ísimo)',
      content: 'Absolute superlatives express an extreme quality without comparing to a group. They are formed by adding -ísimo/-ísima/-ísimos/-ísimas to the adjective. This expresses "very" or "extremely" the quality.',
      subsections: [
        {
          title: 'Formation Rules',
          content: 'Remove the final vowel from the adjective and add -ísimo (masculine singular), -ísima (feminine singular), -ísimos (masculine plural), or -ísimas (feminine plural).\n\nSpecial cases:\n• Adjectives ending in -z change to -c: feliz → felicísimo\n• Adjectives ending in -ble change to -bilísimo: amable → amabilísimo\n• Adjectives ending in -ío drop the -o: frío → friísimo (or frío → frío)\n• Some adjectives have irregular forms: bueno → bonísimo, malo → malísimo',
          examples: [
            {
              spanish: 'Este libro es interesantísimo.',
              english: 'This book is extremely interesting.',
              highlight: ['interesantísimo']
            },
            {
              spanish: 'La película fue bellísima.',
              english: 'The movie was extremely beautiful.',
              highlight: ['bellísima']
            },
            {
              spanish: 'Los niños estaban felicísimos.',
              english: 'The children were extremely happy.',
              highlight: ['felicísimos']
            },
            {
              spanish: 'Hace un calor abrasador. ¡Qué día tan calurosísimo!',
              english: 'It is extremely hot. What an extremely hot day!',
              highlight: ['calurosísimo']
            }
          ]
        },
        {
          title: 'Common Absolute Superlatives',
          content: 'altísimo (extremely tall), bellísimo (extremely beautiful), bonísimo (extremely good), calurosísimo (extremely hot), clarísi mo (extremely clear), difícilísimo (extremely difficult), fácilísimo (extremely easy), felicísimo (extremely happy), fríísimo (extremely cold), grandísimo (extremely big), hermosísimo (extremely beautiful), interesantísimo (extremely interesting), largísimo (extremely long), malísimo (extremely bad), pequeñísimo (extremely small), riquísimo (extremely rich), tristísimo (extremely sad)'
        }
      ]
    },
    {
      title: 'Comparison: Relative vs. Absolute Superlatives',
      content: 'RELATIVE SUPERLATIVES (within a group):\n• Es el estudiante más inteligente de la clase (He is the most intelligent student in the class)\n• Ella es la mejor cantante del país (She is the best singer in the country)\n\nABSOLUTE SUPERLATIVES (extreme quality):\n• Es un estudiante inteligentísimo (He is an extremely intelligent student)\n• Ella es una cantante bellísima (She is an extremely beautiful singer)'
    },
    {
      title: 'Practical Examples',
      content: 'Study these sentences to see how superlatives are used in context:',
      examples: [
        {
          spanish: 'Este es el mejor restaurante de la ciudad, y la comida es deliciosa.',
          english: 'This is the best restaurant in the city, and the food is delicious.',
          highlight: ['el mejor', 'deliciosa']
        },
        {
          spanish: 'Fue la peor experiencia de mi vida, absolutamente terribilísima.',
          english: 'It was the worst experience of my life, absolutely terrible.',
          highlight: ['la peor', 'terribilísima']
        },
        {
          spanish: 'Mi hermano es el mayor de la familia y es un hombre sapientísimo.',
          english: 'My brother is the oldest in the family and is an extremely wise man.',
          highlight: ['el mayor', 'sapientísimo']
        },
        {
          spanish: 'Estas son las montañas más altas del mundo, absolutamente espectaculares.',
          english: 'These are the highest mountains in the world, absolutely spectacular.',
          highlight: ['las más altas', 'espectaculares']
        },
        {
          spanish: 'Es la película más interesante del año, simplemente fantástica.',
          english: 'It is the most interesting movie of the year, simply fantastic.',
          highlight: ['la más interesante', 'fantástica']
        }
      ]
    }
  ];

  return (
    <GrammarPageTemplate
      language="spanish"
      category="adjectives"
      topic="superlatives"
      title="Superlatives"
      description="Master Spanish superlative adjectives including relative superlatives and absolute superlatives with -ísimo"
      difficulty="intermediate"
      estimatedTime={25}
      sections={sections}
      backUrl="/grammar/spanish"
      practiceUrl="/grammar/spanish/adjectives/superlatives/practice"
      quizUrl="/grammar/spanish/adjectives/superlatives/test"
      youtubeVideoId="EGaSgIRswcI"
      relatedTopics={[
        { title: 'Comparatives', url: '/grammar/spanish/adjectives/comparatives', difficulty: 'intermediate' },
        { title: 'Adjective Agreement', url: '/grammar/spanish/adjectives/adjective-agreement', difficulty: 'beginner' },
        { title: 'Adjective Position', url: '/grammar/spanish/adjectives/adjective-position', difficulty: 'intermediate' }
      ]}
    />
  );
}
