import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'adjectives',
  topic: 'comparison',
  title: 'Spanish Comparative & Superlative',
  description: 'Master Spanish comparisons with más que, menos que, tan como, and superlatives. Learn to compare people, places, and things.',
  difficulty: 'intermediate',
  keywords: [
    'spanish comparative superlative',
    'más que menos que spanish',
    'tan como spanish',
    'spanish comparisons',
    'comparativo superlativo español',
    'spanish grammar comparisons'
  ],
  examples: [
    'más alto que (taller than)',
    'el más inteligente (the most intelligent)',
    'tan rápido como (as fast as)'
  ]
});

const sections = [
  {
    title: 'Spanish Comparisons Overview',
    content: `Spanish has three main types of comparisons:

**1. Superiority**: más... que (more... than)
**2. Inferiority**: menos... que (less... than)  
**3. Equality**: tan... como (as... as)

Plus **superlatives** to express "the most" or "the least" of something.

These structures allow you to compare people, places, things, and actions in Spanish.`,
    examples: [
      {
        spanish: 'María es más alta que Juan.',
        english: 'María is taller than Juan. (superiority)',
        highlight: ['más alta que']
      },
      {
        spanish: 'Este libro es menos interesante que el otro.',
        english: 'This book is less interesting than the other one. (inferiority)',
        highlight: ['menos interesante que']
      },
      {
        spanish: 'Pedro es tan inteligente como Ana.',
        english: 'Pedro is as intelligent as Ana. (equality)',
        highlight: ['tan inteligente como']
      }
    ]
  },
  {
    title: 'Comparative of Superiority: Más... que',
    content: `Use **más + adjective + que** to express "more... than" or "-er than":

**Structure**: [Subject] + ser + más + [adjective] + que + [comparison]

This is the most common type of comparison in Spanish.`,
    subsections: [
      {
        title: 'Basic Superiority Comparisons',
        content: `The adjective agrees with the subject being described:`,
        examples: [
          {
            spanish: 'Mi casa es más grande que tu casa.',
            english: 'My house is bigger than your house.',
            highlight: ['más grande que']
          },
          {
            spanish: 'Los gatos son más independientes que los perros.',
            english: 'Cats are more independent than dogs.',
            highlight: ['más independientes que']
          },
          {
            spanish: 'Esta película es más emocionante que la anterior.',
            english: 'This movie is more exciting than the previous one.',
            highlight: ['más emocionante que']
          },
          {
            spanish: 'Ella es más trabajadora que él.',
            english: 'She is more hardworking than he is.',
            highlight: ['más trabajadora que']
          }
        ]
      },
      {
        title: 'Comparing with Numbers',
        content: `When comparing with numbers, use **más de** instead of **más que**:`,
        examples: [
          {
            spanish: 'Tengo más de veinte libros.',
            english: 'I have more than twenty books.',
            highlight: ['más de']
          },
          {
            spanish: 'Cuesta más de cien euros.',
            english: 'It costs more than one hundred euros.',
            highlight: ['más de']
          },
          {
            spanish: 'Hay más de mil estudiantes.',
            english: 'There are more than a thousand students.',
            highlight: ['más de']
          }
        ]
      }
    ]
  },
  {
    title: 'Comparative of Inferiority: Menos... que',
    content: `Use **menos + adjective + que** to express "less... than":

**Structure**: [Subject] + ser + menos + [adjective] + que + [comparison]

This is less common than más... que but equally important.`,
    examples: [
      {
        spanish: 'Este ejercicio es menos difícil que el anterior.',
        english: 'This exercise is less difficult than the previous one.',
        highlight: ['menos difícil que']
      },
      {
        spanish: 'Los niños son menos pacientes que los adultos.',
        english: 'Children are less patient than adults.',
        highlight: ['menos pacientes que']
      },
      {
        spanish: 'Mi hermana es menos alta que yo.',
        english: 'My sister is less tall than I am.',
        highlight: ['menos alta que']
      },
      {
        spanish: 'Esta ciudad es menos ruidosa que Madrid.',
        english: 'This city is less noisy than Madrid.',
        highlight: ['menos ruidosa que']
      }
    ]
  },
  {
    title: 'Comparative of Equality: Tan... como',
    content: `Use **tan + adjective + como** to express "as... as":

**Structure**: [Subject] + ser + tan + [adjective] + como + [comparison]

This shows that two things are equal in some quality.`,
    examples: [
      {
        spanish: 'Mi coche es tan rápido como el tuyo.',
        english: 'My car is as fast as yours.',
        highlight: ['tan rápido como']
      },
      {
        spanish: 'Ella es tan inteligente como su hermano.',
        english: 'She is as intelligent as her brother.',
        highlight: ['tan inteligente como']
      },
      {
        spanish: 'Este problema es tan complicado como el otro.',
        english: 'This problem is as complicated as the other one.',
        highlight: ['tan complicado como']
      },
      {
        spanish: 'Los estudiantes son tan dedicados como los profesores.',
        english: 'The students are as dedicated as the teachers.',
        highlight: ['tan dedicados como']
      }
    ]
  },
  {
    title: 'Irregular Comparatives',
    content: `Some adjectives have irregular comparative forms that don't use más:`,
    subsections: [
      {
        title: 'Common Irregular Comparatives',
        content: `These adjectives have special comparative forms:`,
        conjugationTable: {
          title: 'Irregular Comparatives',
          conjugations: [
            { pronoun: 'bueno (good)', form: 'mejor', english: 'better' },
            { pronoun: 'malo (bad)', form: 'peor', english: 'worse' },
            { pronoun: 'grande (big)', form: 'mayor', english: 'bigger/older' },
            { pronoun: 'pequeño (small)', form: 'menor', english: 'smaller/younger' },
            { pronoun: 'viejo (old)', form: 'mayor', english: 'older' },
            { pronoun: 'joven (young)', form: 'menor', english: 'younger' }
          ]
        },
        examples: [
          {
            spanish: 'Este restaurante es mejor que el otro.',
            english: 'This restaurant is better than the other one.',
            highlight: ['mejor']
          },
          {
            spanish: 'Mi hermana mayor es doctora.',
            english: 'My older sister is a doctor.',
            highlight: ['mayor']
          },
          {
            spanish: 'El tiempo está peor hoy.',
            english: 'The weather is worse today.',
            highlight: ['peor']
          },
          {
            spanish: 'Mi hermano menor tiene quince años.',
            english: 'My younger brother is fifteen years old.',
            highlight: ['menor']
          }
        ]
      }
    ]
  },
  {
    title: 'Superlatives: The Most/Least',
    content: `Superlatives express the highest or lowest degree of a quality. Spanish has two types of superlatives:`,
    subsections: [
      {
        title: 'Relative Superlative',
        content: `Use **el/la/los/las + más/menos + adjective + de** to express "the most/least... of/in":

**Structure**: el/la + (noun) + más/menos + adjective + de + group`,
        examples: [
          {
            spanish: 'María es la más inteligente de la clase.',
            english: 'María is the most intelligent in the class.',
            highlight: ['la más inteligente de']
          },
          {
            spanish: 'Este es el libro más interesante del mundo.',
            english: 'This is the most interesting book in the world.',
            highlight: ['el más interesante del']
          },
          {
            spanish: 'Son los estudiantes menos perezosos de la escuela.',
            english: 'They are the least lazy students in the school.',
            highlight: ['los menos perezosos de']
          },
          {
            spanish: 'Es la ciudad más bella de España.',
            english: 'It is the most beautiful city in Spain.',
            highlight: ['la más bella de']
          }
        ]
      },
      {
        title: 'Irregular Superlatives',
        content: `Irregular comparatives also have irregular superlative forms:`,
        conjugationTable: {
          title: 'Irregular Superlatives',
          conjugations: [
            { pronoun: 'mejor', form: 'el/la mejor', english: 'the best' },
            { pronoun: 'peor', form: 'el/la peor', english: 'the worst' },
            { pronoun: 'mayor', form: 'el/la mayor', english: 'the biggest/oldest' },
            { pronoun: 'menor', form: 'el/la menor', english: 'the smallest/youngest' }
          ]
        },
        examples: [
          {
            spanish: 'Es el mejor estudiante de la universidad.',
            english: 'He is the best student in the university.',
            highlight: ['el mejor']
          },
          {
            spanish: 'Fue la peor película del año.',
            english: 'It was the worst movie of the year.',
            highlight: ['la peor']
          },
          {
            spanish: 'Mi hermana mayor vive en Madrid.',
            english: 'My oldest sister lives in Madrid.',
            highlight: ['mayor']
          }
        ]
      },
      {
        title: 'Absolute Superlative',
        content: `Use **-ísimo/a/os/as** to express "very" or "extremely":

**Formation**: Remove final vowel + ísimo/a/os/as
**Meaning**: Expresses extreme degree without comparison`,
        examples: [
          {
            spanish: 'La comida está buenísima.',
            english: 'The food is extremely good/delicious.',
            highlight: ['buenísima']
          },
          {
            spanish: 'Es una película interesantísima.',
            english: 'It is a very interesting movie.',
            highlight: ['interesantísima']
          },
          {
            spanish: 'Los exámenes son dificilísimos.',
            english: 'The exams are extremely difficult.',
            highlight: ['dificilísimos']
          },
          {
            spanish: 'Estoy cansadísima.',
            english: 'I am extremely tired.',
            highlight: ['cansadísima']
          }
        ]
      }
    ]
  },
  {
    title: 'Comparing Actions with Adverbs',
    content: `You can also compare actions using adverbs with the same structures:

**más + adverb + que** (more... than)
**menos + adverb + que** (less... than)  
**tan + adverb + como** (as... as)`,
    examples: [
      {
        spanish: 'Ella habla más rápidamente que él.',
        english: 'She speaks more quickly than he does.',
        highlight: ['más rápidamente que']
      },
      {
        spanish: 'Trabajo menos frecuentemente que antes.',
        english: 'I work less frequently than before.',
        highlight: ['menos frecuentemente que']
      },
      {
        spanish: 'Canta tan bellamente como un ángel.',
        english: 'She sings as beautifully as an angel.',
        highlight: ['tan bellamente como']
      },
      {
        spanish: 'Estudia mejor que su hermano.',
        english: 'He studies better than his brother.',
        highlight: ['mejor que']
      }
    ]
  },
  {
    title: 'Common Comparison Mistakes',
    content: `Here are common mistakes Spanish learners make with comparisons:

**Mistake 1**: Using "más bueno" instead of "mejor"
**Mistake 2**: Forgetting "de" in superlatives  
**Mistake 3**: Using "que" with numbers instead of "de"
**Mistake 4**: Incorrect agreement in superlatives

Avoiding these mistakes will make your Spanish comparisons sound natural.`,
    examples: [
      {
        spanish: '❌ más bueno que → ✅ mejor que',
        english: 'Wrong: more good than → Right: better than',
        highlight: ['más bueno', 'mejor']
      },
      {
        spanish: '❌ el más alto que la clase → ✅ el más alto de la clase',
        english: 'Wrong: the tallest than the class → Right: the tallest in the class',
        highlight: ['que la clase', 'de la clase']
      },
      {
        spanish: '❌ más que cien → ✅ más de cien',
        english: 'Wrong: more than hundred → Right: more than a hundred',
        highlight: ['más que', 'más de']
      },
      {
        spanish: '❌ la más alto → ✅ la más alta',
        english: 'Wrong: the most tall (f) → Right: the tallest (f)',
        highlight: ['más alto', 'más alta']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'Spanish Adjective Agreement',
    url: '/grammar/spanish/adjectives/agreement',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Adjective Position',
    url: '/grammar/spanish/adjectives/position',
    difficulty: 'intermediate'
  },
  {
    title: 'Spanish Adverbs',
    url: '/grammar/spanish/adverbs',
    difficulty: 'intermediate'
  },
  {
    title: 'Spanish Numbers',
    url: '/grammar/spanish/numbers',
    difficulty: 'beginner'
  }
];

export default function SpanishAdjectiveComparisonPage() {
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
              topic: 'comparison',
              title: 'Spanish Comparative & Superlative',
              description: 'Master Spanish comparisons with más que, menos que, tan como, and superlatives. Learn to compare people, places, and things.',
              difficulty: 'intermediate',
              examples: [
                'más alto que (taller than)',
                'el más inteligente (the most intelligent)',
                'tan rápido como (as fast as)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'adjectives',
              topic: 'comparison',
              title: 'Spanish Comparative & Superlative'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="adjectives"
        topic="comparison"
        title="Spanish Comparative & Superlative"
        description="Master Spanish comparisons with más que, menos que, tan como, and superlatives. Learn to compare people, places, and things"
        difficulty="intermediate"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/spanish"
        practiceUrl="/grammar/spanish/adjectives/comparison/practice"
        quizUrl="/grammar/spanish/adjectives/comparison/quiz"
        songUrl="/songs/es?theme=grammar&topic=comparisons"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
