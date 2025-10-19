import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'weather-verbs',
  title: 'Spanish Weather Verbs - Meteorological Expressions',
  description: 'Learn Spanish weather verbs and meteorological expressions including impersonal weather verbs and weather-related constructions.',
  difficulty: 'beginner',
  keywords: ['spanish weather verbs', 'meteorological expressions', 'weather vocabulary', 'impersonal verbs', 'climate expressions'],
  examples: ['Llueve mucho', 'Hace calor', 'Está nublado', 'Nieva en invierno']
});

const sections = [
  {
    title: 'Understanding Weather Verbs',
    content: 'Spanish weather verbs are **impersonal verbs** used to describe meteorological conditions. They are typically used in the third person singular and don\'t require a subject pronoun.',
    examples: [
      {
        spanish: 'Llueve todos los días.',
        english: 'It rains every day.',
        highlight: ['Llueve']
      },
      {
        spanish: 'Nieva en las montañas.',
        english: 'It snows in the mountains.',
        highlight: ['Nieva']
      },
      {
        spanish: 'Truena muy fuerte.',
        english: 'It thunders very loudly.',
        highlight: ['Truena']
      }
    ]
  },
  {
    title: 'Basic Weather Verbs',
    content: 'The most common **impersonal weather verbs** in Spanish.',
    examples: [
      {
        spanish: 'Llueve mucho en primavera.',
        english: 'It rains a lot in spring.',
        highlight: ['Llueve']
      },
      {
        spanish: 'Nieva en diciembre.',
        english: 'It snows in December.',
        highlight: ['Nieva']
      },
      {
        spanish: 'Graniza en verano.',
        english: 'It hails in summer.',
        highlight: ['Graniza']
      }
    ],
    subsections: [
      {
        title: 'Common Weather Verbs',
        content: 'Essential impersonal weather verbs.',
        conjugationTable: {
          title: 'Basic Weather Verbs',
          conjugations: [
            { pronoun: 'llover', form: 'llueve', english: 'it rains' },
            { pronoun: 'nevar', form: 'nieva', english: 'it snows' },
            { pronoun: 'granizar', form: 'graniza', english: 'it hails' },
            { pronoun: 'tronar', form: 'truena', english: 'it thunders' },
            { pronoun: 'relampaguear', form: 'relampaguea', english: 'it lightnings' },
            { pronoun: 'lloviznar', form: 'llovizna', english: 'it drizzles' }
          ]
        }
      },
      {
        title: 'Weather Verb Conjugation',
        content: 'Weather verbs in different tenses (third person singular only).',
        examples: [
          {
            spanish: 'Ayer llovió mucho.',
            english: 'It rained a lot yesterday.',
            highlight: ['llovió']
          },
          {
            spanish: 'Mañana nevará.',
            english: 'It will snow tomorrow.',
            highlight: ['nevará']
          },
          {
            spanish: 'Ha granizado esta mañana.',
            english: 'It has hailed this morning.',
            highlight: ['Ha granizado']
          }
        ]
      }
    ]
  },
  {
    title: 'HACER with Weather',
    content: 'The verb **"hacer"** is used with many weather expressions, especially for temperature and general conditions.',
    examples: [
      {
        spanish: 'Hace calor en verano.',
        english: 'It\'s hot in summer.',
        highlight: ['Hace calor']
      },
      {
        spanish: 'Hace frío en invierno.',
        english: 'It\'s cold in winter.',
        highlight: ['Hace frío']
      },
      {
        spanish: 'Hace buen tiempo hoy.',
        english: 'The weather is nice today.',
        highlight: ['Hace buen tiempo']
      }
    ],
    subsections: [
      {
        title: 'HACER + Weather Expressions',
        content: 'Common weather expressions with hacer.',
        conjugationTable: {
          title: 'HACER Weather Expressions',
          conjugations: [
            { pronoun: 'hacer calor', form: 'hace calor', english: 'it\'s hot' },
            { pronoun: 'hacer frío', form: 'hace frío', english: 'it\'s cold' },
            { pronoun: 'hacer viento', form: 'hace viento', english: 'it\'s windy' },
            { pronoun: 'hacer sol', form: 'hace sol', english: 'it\'s sunny' },
            { pronoun: 'hacer buen tiempo', form: 'hace buen tiempo', english: 'the weather is nice' },
            { pronoun: 'hacer mal tiempo', form: 'hace mal tiempo', english: 'the weather is bad' }
          ]
        }
      },
      {
        title: 'Temperature Expressions',
        content: 'Specific expressions for temperature.',
        examples: [
          {
            spanish: 'Hace mucho calor.',
            english: 'It\'s very hot.',
            highlight: ['mucho calor']
          },
          {
            spanish: 'Hace un frío terrible.',
            english: 'It\'s terribly cold.',
            highlight: ['un frío terrible']
          },
          {
            spanish: 'Hace un calor insoportable.',
            english: 'It\'s unbearably hot.',
            highlight: ['un calor insoportable']
          }
        ]
      }
    ]
  },
  {
    title: 'ESTAR with Weather',
    content: 'The verb **"estar"** is used with adjectives to describe weather conditions and atmospheric states.',
    examples: [
      {
        spanish: 'Está nublado.',
        english: 'It\'s cloudy.',
        highlight: ['Está nublado']
      },
      {
        spanish: 'Está despejado.',
        english: 'It\'s clear.',
        highlight: ['Está despejado']
      },
      {
        spanish: 'Está húmedo.',
        english: 'It\'s humid.',
        highlight: ['Está húmedo']
      }
    ],
    subsections: [
      {
        title: 'ESTAR + Weather Adjectives',
        content: 'Weather conditions with estar + adjective.',
        conjugationTable: {
          title: 'ESTAR Weather Expressions',
          conjugations: [
            { pronoun: 'estar nublado', form: 'está nublado', english: 'it\'s cloudy' },
            { pronoun: 'estar despejado', form: 'está despejado', english: 'it\'s clear' },
            { pronoun: 'estar húmedo', form: 'está húmedo', english: 'it\'s humid' },
            { pronoun: 'estar seco', form: 'está seco', english: 'it\'s dry' },
            { pronoun: 'estar brumoso', form: 'está brumoso', english: 'it\'s foggy' },
            { pronoun: 'estar tormentoso', form: 'está tormentoso', english: 'it\'s stormy' }
          ]
        }
      }
    ]
  },
  {
    title: 'HAY with Weather',
    content: 'The expression **"hay"** is used with weather phenomena that can be observed or present.',
    examples: [
      {
        spanish: 'Hay niebla esta mañana.',
        english: 'There\'s fog this morning.',
        highlight: ['Hay niebla']
      },
      {
        spanish: 'Hay tormenta en el mar.',
        english: 'There\'s a storm at sea.',
        highlight: ['Hay tormenta']
      },
      {
        spanish: 'Hay mucho viento hoy.',
        english: 'There\'s a lot of wind today.',
        highlight: ['Hay mucho viento']
      }
    ],
    subsections: [
      {
        title: 'HAY + Weather Phenomena',
        content: 'Weather expressions with hay.',
        conjugationTable: {
          title: 'HAY Weather Expressions',
          conjugations: [
            { pronoun: 'hay niebla', form: 'hay niebla', english: 'there\'s fog' },
            { pronoun: 'hay tormenta', form: 'hay tormenta', english: 'there\'s a storm' },
            { pronoun: 'hay viento', form: 'hay viento', english: 'there\'s wind' },
            { pronoun: 'hay nubes', form: 'hay nubes', english: 'there are clouds' },
            { pronoun: 'hay relámpagos', form: 'hay relámpagos', english: 'there\'s lightning' },
            { pronoun: 'hay escarcha', form: 'hay escarcha', english: 'there\'s frost' }
          ]
        }
      }
    ]
  },
  {
    title: 'Seasonal Weather Patterns',
    content: 'Describing **seasonal weather patterns** and typical conditions.',
    examples: [
      {
        spanish: 'En primavera llueve mucho.',
        english: 'It rains a lot in spring.',
        highlight: ['En primavera', 'llueve mucho']
      },
      {
        spanish: 'En verano hace mucho calor.',
        english: 'It\'s very hot in summer.',
        highlight: ['En verano', 'hace mucho calor']
      },
      {
        spanish: 'En invierno nieva frecuentemente.',
        english: 'It snows frequently in winter.',
        highlight: ['En invierno', 'nieva frecuentemente']
      }
    ],
    subsections: [
      {
        title: 'Seasonal Weather Descriptions',
        content: 'Typical weather for each season.',
        conjugationTable: {
          title: 'Seasonal Weather Patterns',
          conjugations: [
            { pronoun: 'Primavera', form: 'llueve, hace fresco', english: 'spring: rains, cool' },
            { pronoun: 'Verano', form: 'hace calor, hace sol', english: 'summer: hot, sunny' },
            { pronoun: 'Otoño', form: 'hace viento, está nublado', english: 'autumn: windy, cloudy' },
            { pronoun: 'Invierno', form: 'hace frío, nieva', english: 'winter: cold, snows' }
          ]
        }
      }
    ]
  },
  {
    title: 'Weather Intensity and Modifiers',
    content: 'Using **adverbs and adjectives** to express the intensity of weather conditions.',
    examples: [
      {
        spanish: 'Llueve torrencialmente.',
        english: 'It\'s raining torrentially.',
        highlight: ['torrencialmente']
      },
      {
        spanish: 'Hace un calor abrasador.',
        english: 'It\'s scorching hot.',
        highlight: ['un calor abrasador']
      },
      {
        spanish: 'Está ligeramente nublado.',
        english: 'It\'s slightly cloudy.',
        highlight: ['ligeramente nublado']
      }
    ],
    subsections: [
      {
        title: 'Weather Intensity Modifiers',
        content: 'Adverbs and adjectives to modify weather expressions.',
        conjugationTable: {
          title: 'Weather Intensity Expressions',
          conjugations: [
            { pronoun: 'Intensity', form: 'mucho, poco, bastante', english: 'a lot, little, quite' },
            { pronoun: 'Rain intensity', form: 'llovizna, llueve, diluvia', english: 'drizzles, rains, pours' },
            { pronoun: 'Wind intensity', form: 'brisa, viento, vendaval', english: 'breeze, wind, gale' },
            { pronoun: 'Cold intensity', form: 'fresco, frío, helado', english: 'cool, cold, freezing' },
            { pronoun: 'Heat intensity', form: 'tibio, calor, abrasador', english: 'warm, hot, scorching' },
            { pronoun: 'Cloud intensity', form: 'parcialmente, nublado, encapotado', english: 'partly, cloudy, overcast' }
          ]
        }
      }
    ]
  },
  {
    title: 'Weather Forecasting Language',
    content: 'Language used in **weather forecasts** and predictions.',
    examples: [
      {
        spanish: 'Mañana va a llover.',
        english: 'It\'s going to rain tomorrow.',
        highlight: ['va a llover']
      },
      {
        spanish: 'Es probable que nieve.',
        english: 'It\'s likely to snow.',
        highlight: ['Es probable que', 'nieve']
      },
      {
        spanish: 'El tiempo mejorará por la tarde.',
        english: 'The weather will improve in the afternoon.',
        highlight: ['El tiempo mejorará']
      }
    ],
    subsections: [
      {
        title: 'Weather Prediction Expressions',
        content: 'Common phrases for weather forecasts.',
        conjugationTable: {
          title: 'Weather Forecasting Language',
          conjugations: [
            { pronoun: 'Certainty', form: 'va a llover', english: 'it\'s going to rain' },
            { pronoun: 'Probability', form: 'es probable que llueva', english: 'it\'s likely to rain' },
            { pronoun: 'Possibility', form: 'puede que llueva', english: 'it might rain' },
            { pronoun: 'Improvement', form: 'el tiempo mejorará', english: 'weather will improve' },
            { pronoun: 'Deterioration', form: 'el tiempo empeorará', english: 'weather will worsen' },
            { pronoun: 'Change', form: 'el tiempo cambiará', english: 'weather will change' }
          ]
        }
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Conditional Tense', url: '/grammar/spanish/verbs/conditional', difficulty: 'intermediate' },
  { title: 'Subjunctive Present', url: '/grammar/spanish/verbs/subjunctive-present', difficulty: 'advanced' },
  { title: 'Present Perfect', url: '/grammar/spanish/verbs/present-perfect', difficulty: 'intermediate' },
  { title: 'Passive Voice', url: '/grammar/spanish/verbs/passive-voice', difficulty: 'advanced' }
];

export default function SpanishWeatherVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Weather Verbs - Meteorological Expressions',
            description: 'Learn Spanish weather verbs and meteorological expressions including impersonal weather verbs and weather-related constructions.',
            keywords: ['spanish weather verbs', 'meteorological expressions', 'weather vocabulary', 'impersonal verbs'],
            language: 'spanish',
            category: 'verbs',
            topic: 'weather-verbs'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="weather-verbs"
        title="Spanish Weather Verbs"
        description="Learn Spanish weather verbs and meteorological expressions including impersonal weather verbs and weather-related constructions."
        difficulty="beginner"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/weather-verbs/practice"
        quizUrl="/grammar/spanish/verbs/weather-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=weather-verbs"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
