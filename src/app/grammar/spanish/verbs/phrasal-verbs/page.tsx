import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'phrasal-verbs',
  title: 'Spanish Phrasal Verbs - Multi-word Verb Expressions',
  description: 'Learn Spanish phrasal verbs and multi-word verb expressions including verb + preposition combinations and their meanings.',
  difficulty: 'intermediate',
  keywords: ['spanish phrasal verbs', 'multi-word verbs', 'verb expressions', 'verb preposition combinations', 'compound verbs'],
  examples: ['Salir de casa', 'Llegar a tiempo', 'Contar con alguien', 'Dar con la solución']
});

const sections = [
  {
    title: 'Understanding Spanish Phrasal Verbs',
    content: 'Spanish phrasal verbs are **multi-word expressions** consisting of a verb plus one or more prepositions or adverbs that create a meaning different from the individual words. Unlike English, Spanish phrasal verbs are less common but still important.',
    examples: [
      {
        spanish: 'Salir de casa temprano.',
        english: 'Leave home early.',
        highlight: ['Salir de']
      },
      {
        spanish: 'Dar con la respuesta.',
        english: 'Find/come across the answer.',
        highlight: ['Dar con']
      }
    ]
  },
  {
    title: 'Verb + DE Combinations',
    content: 'Many Spanish phrasal verbs use the preposition **"de"** to create specific meanings.',
    examples: [
      {
        spanish: 'Salir de la oficina a las cinco.',
        english: 'Leave the office at five.',
        highlight: ['Salir de']
      },
      {
        spanish: 'Tratar de entender el problema.',
        english: 'Try to understand the problem.',
        highlight: ['Tratar de']
      },
      {
        spanish: 'Acabar de llegar del trabajo.',
        english: 'Just arrive from work.',
        highlight: ['Acabar de']
      }
    ],
    subsections: [
      {
        title: 'Common Verb + DE Phrasal Verbs',
        content: 'Frequently used combinations with "de".',
        conjugationTable: {
          title: 'Verb + DE Combinations',
          conjugations: [
            { pronoun: 'salir de', form: 'salgo de casa', english: 'to leave (a place)' },
            { pronoun: 'tratar de', form: 'trato de ayudar', english: 'to try to' },
            { pronoun: 'acabar de', form: 'acabo de comer', english: 'to have just (done)' },
            { pronoun: 'dejar de', form: 'dejo de fumar', english: 'to stop (doing)' },
            { pronoun: 'acordarse de', form: 'me acuerdo de ti', english: 'to remember' },
            { pronoun: 'olvidarse de', form: 'me olvido de todo', english: 'to forget' }
          ]
        }
      },
      {
        title: 'Recent Past with ACABAR DE',
        content: 'The construction "acabar de + infinitive" expresses recent past.',
        examples: [
          {
            spanish: 'Acabo de terminar el trabajo.',
            english: 'I just finished the work.',
            highlight: ['Acabo de']
          },
          {
            spanish: 'Acabamos de llegar a casa.',
            english: 'We just arrived home.',
            highlight: ['Acabamos de']
          }
        ]
      }
    ]
  },
  {
    title: 'Verb + A Combinations',
    content: 'Phrasal verbs with the preposition **"a"** often express direction, purpose, or beginning.',
    examples: [
      {
        spanish: 'Llegar a tiempo es importante.',
        english: 'Arriving on time is important.',
        highlight: ['Llegar a']
      },
      {
        spanish: 'Empezar a estudiar español.',
        english: 'Start studying Spanish.',
        highlight: ['Empezar a']
      },
      {
        spanish: 'Volver a intentarlo mañana.',
        english: 'Try again tomorrow.',
        highlight: ['Volver a']
      }
    ],
    subsections: [
      {
        title: 'Common Verb + A Phrasal Verbs',
        content: 'Frequently used combinations with "a".',
        conjugationTable: {
          title: 'Verb + A Combinations',
          conjugations: [
            { pronoun: 'llegar a', form: 'llego a casa', english: 'to arrive at/reach' },
            { pronoun: 'empezar a', form: 'empiezo a trabajar', english: 'to start to' },
            { pronoun: 'volver a', form: 'vuelvo a intentar', english: 'to do again' },
            { pronoun: 'ir a', form: 'voy a estudiar', english: 'to be going to' },
            { pronoun: 'aprender a', form: 'aprendo a cocinar', english: 'to learn to' },
            { pronoun: 'ayudar a', form: 'ayudo a mi madre', english: 'to help (someone)' }
          ]
        }
      },
      {
        title: 'Repetition with VOLVER A',
        content: 'The construction "volver a + infinitive" expresses repetition.',
        examples: [
          {
            spanish: 'Volvió a llamar por teléfono.',
            english: 'He called again.',
            highlight: ['Volvió a']
          },
          {
            spanish: 'No vuelvas a hacer eso.',
            english: 'Don\'t do that again.',
            highlight: ['vuelvas a']
          }
        ]
      }
    ]
  },
  {
    title: 'Verb + CON Combinations',
    content: 'Phrasal verbs with **"con"** often express accompaniment, means, or discovery.',
    examples: [
      {
        spanish: 'Contar con tu ayuda.',
        english: 'Count on your help.',
        highlight: ['Contar con']
      },
      {
        spanish: 'Dar con la solución perfecta.',
        english: 'Find the perfect solution.',
        highlight: ['Dar con']
      },
      {
        spanish: 'Soñar con unas vacaciones.',
        english: 'Dream of a vacation.',
        highlight: ['Soñar con']
      }
    ],
    subsections: [
      {
        title: 'Common Verb + CON Phrasal Verbs',
        content: 'Frequently used combinations with "con".',
        conjugationTable: {
          title: 'Verb + CON Combinations',
          conjugations: [
            { pronoun: 'contar con', form: 'cuento contigo', english: 'to count on/rely on' },
            { pronoun: 'dar con', form: 'doy con la respuesta', english: 'to find/come across' },
            { pronoun: 'soñar con', form: 'sueño con viajar', english: 'to dream of/about' },
            { pronoun: 'encontrarse con', form: 'me encuentro con Juan', english: 'to meet/run into' },
            { pronoun: 'casarse con', form: 'me caso con María', english: 'to marry' },
            { pronoun: 'quedarse con', form: 'me quedo con esto', english: 'to keep/take' }
          ]
        }
      }
    ]
  },
  {
    title: 'Verb + EN Combinations',
    content: 'Phrasal verbs with **"en"** often express focus, transformation, or involvement.',
    examples: [
      {
        spanish: 'Pensar en el futuro.',
        english: 'Think about the future.',
        highlight: ['Pensar en']
      },
      {
        spanish: 'Convertirse en médico.',
        english: 'Become a doctor.',
        highlight: ['Convertirse en']
      },
      {
        spanish: 'Fijarse en los detalles.',
        english: 'Notice the details.',
        highlight: ['Fijarse en']
      }
    ],
    subsections: [
      {
        title: 'Common Verb + EN Phrasal Verbs',
        content: 'Frequently used combinations with "en".',
        conjugationTable: {
          title: 'Verb + EN Combinations',
          conjugations: [
            { pronoun: 'pensar en', form: 'pienso en ti', english: 'to think about' },
            { pronoun: 'convertirse en', form: 'me convierto en', english: 'to become/turn into' },
            { pronoun: 'fijarse en', form: 'me fijo en todo', english: 'to notice/pay attention to' },
            { pronoun: 'confiar en', form: 'confío en ti', english: 'to trust in' },
            { pronoun: 'insistir en', form: 'insisto en ir', english: 'to insist on' },
            { pronoun: 'influir en', form: 'influyo en la decisión', english: 'to influence' }
          ]
        }
      }
    ]
  },
  {
    title: 'Verb + POR Combinations',
    content: 'Phrasal verbs with **"por"** often express cause, exchange, or concern.',
    examples: [
      {
        spanish: 'Preguntar por tu hermana.',
        english: 'Ask about your sister.',
        highlight: ['Preguntar por']
      },
      {
        spanish: 'Preocuparse por los exámenes.',
        english: 'Worry about the exams.',
        highlight: ['Preocuparse por']
      },
      {
        spanish: 'Luchar por la libertad.',
        english: 'Fight for freedom.',
        highlight: ['Luchar por']
      }
    ],
    subsections: [
      {
        title: 'Common Verb + POR Phrasal Verbs',
        content: 'Frequently used combinations with "por".',
        conjugationTable: {
          title: 'Verb + POR Combinations',
          conjugations: [
            { pronoun: 'preguntar por', form: 'pregunto por ti', english: 'to ask about' },
            { pronoun: 'preocuparse por', form: 'me preocupo por todo', english: 'to worry about' },
            { pronoun: 'luchar por', form: 'lucho por mis sueños', english: 'to fight for' },
            { pronoun: 'optar por', form: 'opto por estudiar', english: 'to opt for/choose' },
            { pronoun: 'interesarse por', form: 'me intereso por el arte', english: 'to be interested in' },
            { pronoun: 'pasar por', form: 'paso por tu casa', english: 'to pass by/go through' }
          ]
        }
      }
    ]
  },
  {
    title: 'Idiomatic Phrasal Verbs',
    content: 'Some Spanish phrasal verbs have **idiomatic meanings** that cannot be deduced from their individual parts.',
    examples: [
      {
        spanish: 'Echar de menos a mi familia.',
        english: 'Miss my family.',
        highlight: ['Echar de menos']
      },
      {
        spanish: 'Darse cuenta del error.',
        english: 'Realize the mistake.',
        highlight: ['Darse cuenta de']
      },
      {
        spanish: 'Llevarse bien con todos.',
        english: 'Get along well with everyone.',
        highlight: ['Llevarse bien con']
      }
    ],
    subsections: [
      {
        title: 'Common Idiomatic Phrasal Verbs',
        content: 'Phrasal verbs with special idiomatic meanings.',
        conjugationTable: {
          title: 'Idiomatic Phrasal Verbs',
          conjugations: [
            { pronoun: 'echar de menos', form: 'echo de menos casa', english: 'to miss (feel absence of)' },
            { pronoun: 'darse cuenta de', form: 'me doy cuenta de todo', english: 'to realize/notice' },
            { pronoun: 'llevarse bien con', form: 'me llevo bien con él', english: 'to get along with' },
            { pronoun: 'hacer caso a', form: 'hago caso a mi madre', english: 'to pay attention to/heed' },
            { pronoun: 'tener ganas de', form: 'tengo ganas de viajar', english: 'to feel like (doing)' },
            { pronoun: 'estar harto de', form: 'estoy harto de esperar', english: 'to be fed up with' }
          ]
        }
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' },
  { title: 'Ser vs Estar', url: '/grammar/spanish/verbs/ser-vs-estar', difficulty: 'beginner' },
  { title: 'Past Participles', url: '/grammar/spanish/verbs/past-participles', difficulty: 'intermediate' },
  { title: 'Reflexive Verbs', url: '/grammar/spanish/verbs/reflexive', difficulty: 'intermediate' }
];

export default function SpanishPhrasalVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Phrasal Verbs - Multi-word Verb Expressions',
            description: 'Learn Spanish phrasal verbs and multi-word verb expressions including verb + preposition combinations and their meanings.',
            keywords: ['spanish phrasal verbs', 'multi-word verbs', 'verb expressions', 'verb preposition combinations'],
            language: 'spanish',
            category: 'verbs',
            topic: 'phrasal-verbs'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="phrasal-verbs"
        title="Spanish Phrasal Verbs"
        description="Learn Spanish phrasal verbs and multi-word verb expressions including verb + preposition combinations and their meanings."
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/phrasal-verbs/practice"
        quizUrl="/grammar/spanish/verbs/phrasal-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=phrasal-verbs"
        youtubeVideoId="phrasal-verbs-spanish"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
