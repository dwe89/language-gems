import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'verb-government',
  title: 'Spanish Verb Government - Prepositions and Complements',
  description: 'Master Spanish verb government including which prepositions verbs require and how verbs govern their complements.',
  difficulty: 'advanced',
  keywords: ['spanish verb government', 'verb prepositions', 'verb complements', 'régimen verbal', 'prepositions with verbs'],
  examples: ['Depende de ti', 'Sueño con viajar', 'Confío en él', 'Se enamoró de ella']
});

const sections = [
  {
    title: 'Understanding Verb Government',
    content: 'Verb government (régimen verbal) refers to the **specific prepositions** or **complement structures** that certain verbs require. Unlike English, Spanish verbs often govern specific prepositions that must be used with them.',
    examples: [
      {
        spanish: 'Dependo de mis padres.',
        english: 'I depend on my parents.',
        highlight: ['Dependo de']
      },
      {
        spanish: 'Sueño con ser médico.',
        english: 'I dream of being a doctor.',
        highlight: ['Sueño con']
      }
    ]
  },
  {
    title: 'Verbs with "DE"',
    content: 'Many Spanish verbs require the preposition **"de"** to connect with their complements.',
    examples: [
      {
        spanish: 'Me acuerdo de ti.',
        english: 'I remember you.',
        highlight: ['Me acuerdo de']
      },
      {
        spanish: 'Se trata de un problema serio.',
        english: 'It\'s about a serious problem.',
        highlight: ['Se trata de']
      },
      {
        spanish: 'Dejó de fumar.',
        english: 'He stopped smoking.',
        highlight: ['Dejó de']
      }
    ],
    subsections: [
      {
        title: 'Common Verbs with DE',
        content: 'Verbs that consistently require the preposition "de".',
        conjugationTable: {
          title: 'Verbs Governing DE',
          conjugations: [
            { pronoun: 'acordarse de', form: 'me acuerdo de', english: 'to remember' },
            { pronoun: 'olvidarse de', form: 'me olvido de', english: 'to forget' },
            { pronoun: 'tratarse de', form: 'se trata de', english: 'to be about' },
            { pronoun: 'depender de', form: 'dependo de', english: 'to depend on' },
            { pronoun: 'enamorarse de', form: 'me enamoro de', english: 'to fall in love with' },
            { pronoun: 'disfrutar de', form: 'disfruto de', english: 'to enjoy' }
          ]
        }
      },
      {
        title: 'Verbs of Cessation with DE',
        content: 'Verbs expressing stopping or ceasing require "de" before infinitives.',
        examples: [
          {
            spanish: 'Dejé de estudiar a las diez.',
            english: 'I stopped studying at ten.',
            highlight: ['Dejé de']
          },
          {
            spanish: 'Terminó de trabajar tarde.',
            english: 'He finished working late.',
            highlight: ['Terminó de']
          }
        ]
      }
    ]
  },
  {
    title: 'Verbs with "A"',
    content: 'Many Spanish verbs require the preposition **"a"** to connect with their complements, especially with movement or direction.',
    examples: [
      {
        spanish: 'Voy a estudiar.',
        english: 'I\'m going to study.',
        highlight: ['Voy a']
      },
      {
        spanish: 'Aprendí a conducir.',
        english: 'I learned to drive.',
        highlight: ['Aprendí a']
      },
      {
        spanish: 'Se parece a su madre.',
        english: 'He looks like his mother.',
        highlight: ['Se parece a']
      }
    ],
    subsections: [
      {
        title: 'Common Verbs with A',
        content: 'Verbs that consistently require the preposition "a".',
        conjugationTable: {
          title: 'Verbs Governing A',
          conjugations: [
            { pronoun: 'ir a', form: 'voy a', english: 'to go to / be going to' },
            { pronoun: 'venir a', form: 'vengo a', english: 'to come to' },
            { pronoun: 'aprender a', form: 'aprendo a', english: 'to learn to' },
            { pronoun: 'enseñar a', form: 'enseño a', english: 'to teach to' },
            { pronoun: 'ayudar a', form: 'ayudo a', english: 'to help to' },
            { pronoun: 'parecerse a', form: 'me parezco a', english: 'to look like' }
          ]
        }
      },
      {
        title: 'Movement and Direction Verbs',
        content: 'Verbs expressing movement or direction typically use "a".',
        examples: [
          {
            spanish: 'Subió al segundo piso.',
            english: 'He went up to the second floor.',
            highlight: ['Subió al']
          },
          {
            spanish: 'Bajó a la cocina.',
            english: 'He went down to the kitchen.',
            highlight: ['Bajó a']
          }
        ]
      }
    ]
  },
  {
    title: 'Verbs with "CON"',
    content: 'Some Spanish verbs require the preposition **"con"** to express accompaniment, means, or association.',
    examples: [
      {
        spanish: 'Sueño con viajar por Europa.',
        english: 'I dream of traveling through Europe.',
        highlight: ['Sueño con']
      },
      {
        spanish: 'Cuenta con mi apoyo.',
        english: 'Count on my support.',
        highlight: ['Cuenta con']
      },
      {
        spanish: 'Se casó con su novia.',
        english: 'He married his girlfriend.',
        highlight: ['Se casó con']
      }
    ],
    subsections: [
      {
        title: 'Common Verbs with CON',
        content: 'Verbs that consistently require the preposition "con".',
        conjugationTable: {
          title: 'Verbs Governing CON',
          conjugations: [
            { pronoun: 'soñar con', form: 'sueño con', english: 'to dream of/about' },
            { pronoun: 'contar con', form: 'cuento con', english: 'to count on' },
            { pronoun: 'casarse con', form: 'me caso con', english: 'to marry' },
            { pronoun: 'encontrarse con', form: 'me encuentro con', english: 'to meet with' },
            { pronoun: 'conformarse con', form: 'me conformo con', english: 'to be satisfied with' },
            { pronoun: 'tropezar con', form: 'tropiezo con', english: 'to stumble upon' }
          ]
        }
      }
    ]
  },
  {
    title: 'Verbs with "EN"',
    content: 'Certain Spanish verbs require the preposition **"en"** to express location, focus, or involvement.',
    examples: [
      {
        spanish: 'Confío en ti.',
        english: 'I trust you.',
        highlight: ['Confío en']
      },
      {
        spanish: 'Piensa en el futuro.',
        english: 'Think about the future.',
        highlight: ['Piensa en']
      },
      {
        spanish: 'Insiste en venir.',
        english: 'He insists on coming.',
        highlight: ['Insiste en']
      }
    ],
    subsections: [
      {
        title: 'Common Verbs with EN',
        content: 'Verbs that consistently require the preposition "en".',
        conjugationTable: {
          title: 'Verbs Governing EN',
          conjugations: [
            { pronoun: 'confiar en', form: 'confío en', english: 'to trust in' },
            { pronoun: 'pensar en', form: 'pienso en', english: 'to think about' },
            { pronoun: 'insistir en', form: 'insisto en', english: 'to insist on' },
            { pronoun: 'convertirse en', form: 'me convierto en', english: 'to become' },
            { pronoun: 'fijarse en', form: 'me fijo en', english: 'to notice' },
            { pronoun: 'influir en', form: 'influyo en', english: 'to influence' }
          ]
        }
      }
    ]
  },
  {
    title: 'Verbs with "POR"',
    content: 'Some Spanish verbs require the preposition **"por"** to express cause, means, or exchange.',
    examples: [
      {
        spanish: 'Pregunta por ti.',
        english: 'He asks about you.',
        highlight: ['Pregunta por']
      },
      {
        spanish: 'Se preocupa por sus hijos.',
        english: 'She worries about her children.',
        highlight: ['Se preocupa por']
      },
      {
        spanish: 'Luchó por la justicia.',
        english: 'He fought for justice.',
        highlight: ['Luchó por']
      }
    ],
    subsections: [
      {
        title: 'Common Verbs with POR',
        content: 'Verbs that consistently require the preposition "por".',
        conjugationTable: {
          title: 'Verbs Governing POR',
          conjugations: [
            { pronoun: 'preguntar por', form: 'pregunto por', english: 'to ask about' },
            { pronoun: 'preocuparse por', form: 'me preocupo por', english: 'to worry about' },
            { pronoun: 'luchar por', form: 'lucho por', english: 'to fight for' },
            { pronoun: 'optar por', form: 'opto por', english: 'to opt for' },
            { pronoun: 'interesarse por', form: 'me intereso por', english: 'to be interested in' },
            { pronoun: 'decidirse por', form: 'me decido por', english: 'to decide on' }
          ]
        }
      }
    ]
  },
  {
    title: 'Variable Government',
    content: 'Some verbs can govern different prepositions depending on their meaning or context.',
    examples: [
      {
        spanish: 'Pienso en ti. (think about)',
        english: 'I think about you.',
        highlight: ['Pienso en']
      },
      {
        spanish: 'Pienso que tienes razón. (believe)',
        english: 'I think you\'re right.',
        highlight: ['Pienso que']
      }
    ],
    subsections: [
      {
        title: 'Context-Dependent Government',
        content: 'Verbs that change prepositions based on meaning.',
        conjugationTable: {
          title: 'Variable Government Examples',
          conjugations: [
            { pronoun: 'pensar en', form: 'pienso en ti', english: 'to think about (someone/something)' },
            { pronoun: 'pensar que', form: 'pienso que...', english: 'to think that (opinion)' },
            { pronoun: 'quedar en', form: 'quedamos en vernos', english: 'to agree to meet' },
            { pronoun: 'quedar con', form: 'quedo con María', english: 'to arrange to meet someone' },
            { pronoun: 'hablar de', form: 'hablo de política', english: 'to talk about (topic)' },
            { pronoun: 'hablar con', form: 'hablo con Juan', english: 'to talk with (person)' }
          ]
        }
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Modal Verbs', url: '/grammar/spanish/verbs/modal-verbs', difficulty: 'intermediate' },
  { title: 'Present Perfect', url: '/grammar/spanish/verbs/present-perfect', difficulty: 'intermediate' },
  { title: 'Past Participles', url: '/grammar/spanish/verbs/past-participles', difficulty: 'intermediate' },
  { title: 'Interrogatives', url: '/grammar/spanish/verbs/interrogatives', difficulty: 'beginner' }
];

export default function SpanishVerbGovernmentPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Verb Government - Prepositions and Complements',
            description: 'Master Spanish verb government including which prepositions verbs require and how verbs govern their complements.',
            keywords: ['spanish verb government', 'verb prepositions', 'verb complements', 'régimen verbal'],
            language: 'spanish',
            category: 'verbs',
            topic: 'verb-government'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="verb-government"
        title="Spanish Verb Government"
        description="Master Spanish verb government including which prepositions verbs require and how verbs govern their complements."
        difficulty="advanced"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/verb-government/practice"
        quizUrl="/grammar/spanish/verbs/verb-government/quiz"
        songUrl="/songs/es?theme=grammar&topic=verb-government"
        youtubeVideoId="verb-government-spanish"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
