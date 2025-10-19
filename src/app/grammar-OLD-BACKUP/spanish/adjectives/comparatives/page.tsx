import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';

export const metadata: Metadata = {
  title: 'Spanish Comparative Adjectives - LanguageGems',
  description: 'Master Spanish comparative adjectives. Learn how to compare things using más que, menos que, tan como and irregular comparatives.',
  keywords: 'Spanish comparatives, comparative adjectives, más que, menos que, tan como, Spanish grammar, comparing things',
  openGraph: {
    title: 'Spanish Comparative Adjectives - LanguageGems',
    description: 'Master Spanish comparative adjectives and comparison structures.',
    type: 'article',
  },
};

export default function SpanishComparativesPage() {
  const sections = [
    {
      title: 'Overview',
      content: 'Comparative adjectives are used to compare two people, places, or things. In Spanish, there are three main types of comparisons: superiority (more...than), inferiority (less...than), and equality (as...as). Each type has its own structure and rules.'
    },
    {
      title: 'Comparisons of Superiority (más...que)',
      content: 'Use más + adjective + que to express that something has more of a quality than something else. This is the most common type of comparison.',
      subsections: [
        {
          title: 'Structure: más + adjective + que',
          content: 'The adjective must agree in gender and number with the noun it modifies. The structure is: Subject + ser + más + adjective + que + comparison.',
          examples: [
            {
              spanish: 'María es más alta que Juan.',
              english: 'María is taller than Juan.',
              highlight: ['más alta que']
            },
            {
              spanish: 'Este libro es más interesante que ese.',
              english: 'This book is more interesting than that one.',
              highlight: ['más interesante que']
            },
            {
              spanish: 'Las ciudades son más grandes que los pueblos.',
              english: 'Cities are bigger than towns.',
              highlight: ['más grandes que']
            },
            {
              spanish: 'Mi casa es más hermosa que la tuya.',
              english: 'My house is more beautiful than yours.',
              highlight: ['más hermosa que']
            }
          ]
        },
        {
          title: 'Comparisons with Numbers',
          content: 'When comparing with numbers, use "de" instead of "que".',
          examples: [
            {
              spanish: 'Tengo más de veinte años.',
              english: 'I am more than twenty years old.',
              highlight: ['más de']
            },
            {
              spanish: 'El proyecto costó más de mil dólares.',
              english: 'The project cost more than a thousand dollars.',
              highlight: ['más de']
            }
          ]
        }
      ]
    },
    {
      title: 'Comparisons of Inferiority (menos...que)',
      content: 'Use menos + adjective + que to express that something has less of a quality than something else.',
      subsections: [
        {
          title: 'Structure: menos + adjective + que',
          content: 'The structure is similar to superiority comparisons, but uses menos instead of más.',
          examples: [
            {
              spanish: 'Juan es menos alto que María.',
              english: 'Juan is less tall (shorter) than María.',
              highlight: ['menos alto que']
            },
            {
              spanish: 'Este libro es menos interesante que ese.',
              english: 'This book is less interesting than that one.',
              highlight: ['menos interesante que']
            },
            {
              spanish: 'Los pueblos son menos grandes que las ciudades.',
              english: 'Towns are less big (smaller) than cities.',
              highlight: ['menos grandes que']
            },
            {
              spanish: 'Mi coche es menos caro que el tuyo.',
              english: 'My car is less expensive than yours.',
              highlight: ['menos caro que']
            }
          ]
        }
      ]
    },
    {
      title: 'Comparisons of Equality (tan...como)',
      content: 'Use tan + adjective + como to express that two things have the same quality or degree.',
      subsections: [
        {
          title: 'Structure: tan + adjective + como',
          content: 'The adjective must agree in gender and number with the noun. The structure is: Subject + ser + tan + adjective + como + comparison.',
          examples: [
            {
              spanish: 'María es tan alta como Juan.',
              english: 'María is as tall as Juan.',
              highlight: ['tan alta como']
            },
            {
              spanish: 'Este libro es tan interesante como ese.',
              english: 'This book is as interesting as that one.',
              highlight: ['tan interesante como']
            },
            {
              spanish: 'Mi casa es tan hermosa como la tuya.',
              english: 'My house is as beautiful as yours.',
              highlight: ['tan hermosa como']
            },
            {
              spanish: 'Los dos estudiantes son tan inteligentes como trabajadores.',
              english: 'Both students are as intelligent as they are hardworking.',
              highlight: ['tan inteligentes como']
            }
          ]
        }
      ]
    },
    {
      title: 'Irregular Comparatives',
      content: 'Some common adjectives have irregular comparative forms that do not follow the más/menos pattern.',
      subsections: [
        {
          title: 'BUENO (good) → MEJOR (better)',
          conjugationTable: {
            title: 'Bueno Comparative Forms',
            conjugations: [
              { pronoun: 'Positive', form: 'bueno/a/os/as', english: 'good' },
              { pronoun: 'Comparative', form: 'mejor/mejores', english: 'better' },
              { pronoun: 'Superlative', form: 'el/la mejor', english: 'the best' }
            ]
          },
          examples: [
            {
              spanish: 'Este restaurante es mejor que ese.',
              english: 'This restaurant is better than that one.',
              highlight: ['mejor']
            },
            {
              spanish: 'Mi idea es mejor que la tuya.',
              english: 'My idea is better than yours.',
              highlight: ['mejor']
            }
          ]
        },
        {
          title: 'MALO (bad) → PEOR (worse)',
          conjugationTable: {
            title: 'Malo Comparative Forms',
            conjugations: [
              { pronoun: 'Positive', form: 'malo/a/os/as', english: 'bad' },
              { pronoun: 'Comparative', form: 'peor/peores', english: 'worse' },
              { pronoun: 'Superlative', form: 'el/la peor', english: 'the worst' }
            ]
          },
          examples: [
            {
              spanish: 'Este día es peor que el anterior.',
              english: 'This day is worse than the previous one.',
              highlight: ['peor']
            },
            {
              spanish: 'Su comportamiento es peor que el mío.',
              english: 'His behavior is worse than mine.',
              highlight: ['peor']
            }
          ]
        },
        {
          title: 'GRANDE (big) → MAYOR (bigger/older)',
          content: 'Mayor is used for size and age. For physical size, más grande is also acceptable.',
          conjugationTable: {
            title: 'Grande Comparative Forms',
            conjugations: [
              { pronoun: 'Positive', form: 'grande', english: 'big' },
              { pronoun: 'Comparative', form: 'mayor/mayores', english: 'bigger/older' },
              { pronoun: 'Superlative', form: 'el/la mayor', english: 'the biggest/oldest' }
            ]
          },
          examples: [
            {
              spanish: 'Mi hermano es mayor que yo.',
              english: 'My brother is older than me.',
              highlight: ['mayor']
            },
            {
              spanish: 'Nueva York es mayor que Boston.',
              english: 'New York is bigger than Boston.',
              highlight: ['mayor']
            }
          ]
        },
        {
          title: 'PEQUEÑO (small) → MENOR (smaller/younger)',
          content: 'Menor is used for size and age. For physical size, más pequeño is also acceptable.',
          conjugationTable: {
            title: 'Pequeño Comparative Forms',
            conjugations: [
              { pronoun: 'Positive', form: 'pequeño/a/os/as', english: 'small' },
              { pronoun: 'Comparative', form: 'menor/menores', english: 'smaller/younger' },
              { pronoun: 'Superlative', form: 'el/la menor', english: 'the smallest/youngest' }
            ]
          },
          examples: [
            {
              spanish: 'Mi hermana es menor que yo.',
              english: 'My sister is younger than me.',
              highlight: ['menor']
            },
            {
              spanish: 'Este pueblo es menor que la ciudad.',
              english: 'This town is smaller than the city.',
              highlight: ['menor']
            }
          ]
        }
      ]
    },
    {
      title: 'Comparative Structures with Nouns and Verbs',
      content: 'Comparisons can also be made with nouns and verbs, not just adjectives.',
      subsections: [
        {
          title: 'Noun Comparisons',
          content: 'Use más/menos + noun + que for noun comparisons.',
          examples: [
            {
              spanish: 'Tengo más libros que tú.',
              english: 'I have more books than you.',
              highlight: ['más libros que']
            },
            {
              spanish: 'Ella tiene menos dinero que él.',
              english: 'She has less money than him.',
              highlight: ['menos dinero que']
            }
          ]
        },
        {
          title: 'Verb Comparisons',
          content: 'Use más/menos + verb + que for verb comparisons.',
          examples: [
            {
              spanish: 'Yo trabajo más que tú.',
              english: 'I work more than you.',
              highlight: ['trabajo más que']
            },
            {
              spanish: 'Ella estudia menos que él.',
              english: 'She studies less than him.',
              highlight: ['estudia menos que']
            }
          ]
        }
      ]
    },
    {
      title: 'Practical Examples',
      content: 'Study these sentences to see how comparatives are used in context:',
      examples: [
        {
          spanish: 'María es más inteligente que Juan, pero Juan es más fuerte.',
          english: 'María is more intelligent than Juan, but Juan is stronger.',
          highlight: ['más inteligente que', 'más fuerte']
        },
        {
          spanish: 'Este restaurante es mejor que ese, pero es más caro.',
          english: 'This restaurant is better than that one, but it is more expensive.',
          highlight: ['mejor que', 'más caro']
        },
        {
          spanish: 'Mi hermano es mayor que yo, pero mi hermana es menor.',
          english: 'My brother is older than me, but my sister is younger.',
          highlight: ['mayor que', 'menor']
        },
        {
          spanish: 'El clima aquí es tan agradable como en mi país.',
          english: 'The climate here is as pleasant as in my country.',
          highlight: ['tan agradable como']
        },
        {
          spanish: 'Este proyecto es menos complicado que el anterior.',
          english: 'This project is less complicated than the previous one.',
          highlight: ['menos complicado que']
        }
      ]
    }
  ];

  return (
    <GrammarPageTemplate
      language="spanish"
      category="adjectives"
      topic="comparatives"
      title="Comparatives"
      description="Master Spanish comparative adjectives and learn how to compare people, places, and things"
      difficulty="intermediate"
      estimatedTime={25}
      sections={sections}
      backUrl="/grammar/spanish"
      practiceUrl="/grammar/spanish/adjectives/comparatives/practice"
      quizUrl="/grammar/spanish/adjectives/comparatives/test"
      youtubeVideoId="EGaSgIRswcI"
      relatedTopics={[
        { title: 'Superlatives', url: '/grammar/spanish/adjectives/superlatives', difficulty: 'intermediate' },
        { title: 'Adjective Agreement', url: '/grammar/spanish/adjectives/adjective-agreement', difficulty: 'beginner' },
        { title: 'Adjective Position', url: '/grammar/spanish/adjectives/adjective-position', difficulty: 'intermediate' }
      ]}
    />
  );
}
