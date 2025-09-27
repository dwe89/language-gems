import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'verb-serialization',
  title: 'Spanish Verb Serialization - Consecutive Verb Constructions',
  description: 'Learn Spanish verb serialization including consecutive verb constructions, verb chains, and complex predicate structures.',
  difficulty: 'advanced',
  keywords: ['spanish verb serialization', 'consecutive verbs', 'verb chains', 'complex predicates', 'serial verbs'],
  examples: ['Voy a empezar a estudiar', 'Quiero poder ayudarte', 'Suele venir a visitarnos', 'Acaba de dejar de fumar']
});

const sections = [
  {
    title: 'Understanding Verb Serialization',
    content: 'Verb serialization in Spanish refers to **consecutive verb constructions** where multiple verbs are linked together to express complex actions, aspects, or modalities. These constructions create verb chains with specific meanings.',
    examples: [
      {
        spanish: 'Voy a empezar a estudiar.',
        english: 'I\'m going to start studying.',
        highlight: ['Voy a', 'empezar a']
      },
      {
        spanish: 'Quiero poder ayudarte.',
        english: 'I want to be able to help you.',
        highlight: ['Quiero', 'poder']
      }
    ]
  },
  {
    title: 'Modal + Infinitive Chains',
    content: 'Modal verbs can be chained with other modals and infinitives to express complex meanings.',
    examples: [
      {
        spanish: 'Debo poder terminarlo hoy.',
        english: 'I should be able to finish it today.',
        highlight: ['Debo', 'poder']
      },
      {
        spanish: 'Quiere saber hacer paella.',
        english: 'She wants to know how to make paella.',
        highlight: ['Quiere', 'saber hacer']
      },
      {
        spanish: 'Puede llegar a ser médico.',
        english: 'He can become a doctor.',
        highlight: ['Puede', 'llegar a ser']
      }
    ],
    subsections: [
      {
        title: 'Common Modal Chains',
        content: 'Frequently used combinations of modal verbs.',
        conjugationTable: {
          title: 'Modal Verb Serialization',
          conjugations: [
            { pronoun: 'querer poder', form: 'quiero poder ir', english: 'to want to be able to' },
            { pronoun: 'deber saber', form: 'debo saber cocinar', english: 'should know how to' },
            { pronoun: 'poder llegar a', form: 'puede llegar a ser', english: 'can come to be' },
            { pronoun: 'soler querer', form: 'suele querer ayudar', english: 'usually wants to' },
            { pronoun: 'tener que poder', form: 'tengo que poder hacerlo', english: 'have to be able to' },
            { pronoun: 'necesitar saber', form: 'necesito saber hablar', english: 'need to know how to' }
          ]
        }
      }
    ]
  },
  {
    title: 'Aspectual Verb Chains',
    content: 'Aspectual verbs expressing beginning, continuation, or completion can be serialized.',
    examples: [
      {
        spanish: 'Acaba de empezar a llover.',
        english: 'It just started to rain.',
        highlight: ['Acaba de', 'empezar a']
      },
      {
        spanish: 'Sigue tratando de entender.',
        english: 'He keeps trying to understand.',
        highlight: ['Sigue', 'tratando de']
      },
      {
        spanish: 'Terminó de dejar de fumar.',
        english: 'He finished quitting smoking.',
        highlight: ['Terminó de', 'dejar de']
      }
    ],
    subsections: [
      {
        title: 'Aspectual Serialization Patterns',
        content: 'Common patterns with aspectual verbs.',
        conjugationTable: {
          title: 'Aspectual Verb Chains',
          conjugations: [
            { pronoun: 'acabar de empezar a', form: 'acabo de empezar a trabajar', english: 'just started to' },
            { pronoun: 'seguir tratando de', form: 'sigo tratando de aprender', english: 'keep trying to' },
            { pronoun: 'terminar de dejar de', form: 'terminé de dejar de beber', english: 'finished quitting' },
            { pronoun: 'volver a empezar a', form: 'vuelvo a empezar a estudiar', english: 'start again to' },
            { pronoun: 'dejar de intentar', form: 'dejé de intentar llamar', english: 'stopped trying to' },
            { pronoun: 'continuar queriendo', form: 'continúo queriendo viajar', english: 'continue wanting to' }
          ]
        }
      },
      {
        title: 'Complex Aspectual Meanings',
        content: 'How serialized aspectual verbs create nuanced meanings.',
        examples: [
          {
            spanish: 'Volvió a empezar a estudiar francés.',
            english: 'He started studying French again.',
            highlight: ['Volvió a', 'empezar a']
          },
          {
            spanish: 'Dejó de intentar convencerla.',
            english: 'He stopped trying to convince her.',
            highlight: ['Dejó de', 'intentar']
          }
        ]
      }
    ]
  },
  {
    title: 'Periphrastic Future Chains',
    content: 'The periphrastic future "ir a" can be combined with other verbs to create complex future meanings.',
    examples: [
      {
        spanish: 'Voy a empezar a trabajar mañana.',
        english: 'I\'m going to start working tomorrow.',
        highlight: ['Voy a', 'empezar a']
      },
      {
        spanish: 'Va a dejar de llover pronto.',
        english: 'It\'s going to stop raining soon.',
        highlight: ['Va a', 'dejar de']
      },
      {
        spanish: 'Vamos a tratar de llegar temprano.',
        english: 'We\'re going to try to arrive early.',
        highlight: ['Vamos a', 'tratar de']
      }
    ],
    subsections: [
      {
        title: 'Future + Aspectual Combinations',
        content: 'Combining future with aspectual meanings.',
        conjugationTable: {
          title: 'Future Serialization Patterns',
          conjugations: [
            { pronoun: 'ir a empezar a', form: 'voy a empezar a cocinar', english: 'going to start to' },
            { pronoun: 'ir a dejar de', form: 'va a dejar de trabajar', english: 'going to stop' },
            { pronoun: 'ir a tratar de', form: 'vamos a tratar de ayudar', english: 'going to try to' },
            { pronoun: 'ir a volver a', form: 'van a volver a intentar', english: 'going to do again' },
            { pronoun: 'ir a seguir', form: 'voy a seguir estudiando', english: 'going to continue' },
            { pronoun: 'ir a acabar de', form: 'va a acabar de terminar', english: 'going to just finish' }
          ]
        }
      }
    ]
  },
  {
    title: 'Causative Verb Chains',
    content: 'Causative verbs like "hacer", "dejar", "mandar" can be serialized with other verbs.',
    examples: [
      {
        spanish: 'Me hizo empezar a pensar.',
        english: 'It made me start thinking.',
        highlight: ['Me hizo', 'empezar a']
      },
      {
        spanish: 'Lo dejé tratar de explicar.',
        english: 'I let him try to explain.',
        highlight: ['Lo dejé', 'tratar de']
      },
      {
        spanish: 'Le mandé dejar de gritar.',
        english: 'I ordered him to stop shouting.',
        highlight: ['Le mandé', 'dejar de']
      }
    ],
    subsections: [
      {
        title: 'Causative Serialization',
        content: 'Patterns with causative verbs.',
        conjugationTable: {
          title: 'Causative Verb Chains',
          conjugations: [
            { pronoun: 'hacer empezar a', form: 'me hace empezar a dudar', english: 'makes (me) start to' },
            { pronoun: 'dejar tratar de', form: 'lo dejo tratar de ayudar', english: 'lets (him) try to' },
            { pronoun: 'mandar dejar de', form: 'le mando dejar de hablar', english: 'orders (him) to stop' },
            { pronoun: 'permitir seguir', form: 'le permito seguir trabajando', english: 'allows (him) to continue' },
            { pronoun: 'obligar a empezar', form: 'lo obligo a empezar', english: 'forces (him) to start' },
            { pronoun: 'ayudar a terminar', form: 'la ayudo a terminar', english: 'helps (her) to finish' }
          ]
        }
      }
    ]
  },
  {
    title: 'Perception Verb Chains',
    content: 'Perception verbs can be combined with other verbs to express complex perceptual experiences.',
    examples: [
      {
        spanish: 'Lo vi empezar a correr.',
        english: 'I saw him start running.',
        highlight: ['Lo vi', 'empezar a']
      },
      {
        spanish: 'La oí tratar de cantar.',
        english: 'I heard her trying to sing.',
        highlight: ['La oí', 'tratar de']
      },
      {
        spanish: 'Los sentí dejar de hablar.',
        english: 'I felt them stop talking.',
        highlight: ['Los sentí', 'dejar de']
      }
    ],
    subsections: [
      {
        title: 'Perception + Action Chains',
        content: 'Combining perception with action verbs.',
        conjugationTable: {
          title: 'Perception Verb Serialization',
          conjugations: [
            { pronoun: 'ver empezar a', form: 'lo veo empezar a trabajar', english: 'see (him) start to' },
            { pronoun: 'oír tratar de', form: 'la oigo tratar de cantar', english: 'hear (her) try to' },
            { pronoun: 'sentir dejar de', form: 'los siento dejar de moverse', english: 'feel (them) stop' },
            { pronoun: 'mirar intentar', form: 'la miro intentar saltar', english: 'watch (her) try to' },
            { pronoun: 'escuchar seguir', form: 'lo escucho seguir hablando', english: 'listen to (him) continue' },
            { pronoun: 'observar volver a', form: 'los observo volver a intentar', english: 'observe (them) try again' }
          ]
        }
      }
    ]
  },
  {
    title: 'Complex Serialization Patterns',
    content: 'Very complex verb chains can express highly nuanced meanings with multiple layers of aspect, modality, and action.',
    examples: [
      {
        spanish: 'Quiero poder volver a empezar a estudiar.',
        english: 'I want to be able to start studying again.',
        highlight: ['Quiero', 'poder', 'volver a', 'empezar a']
      },
      {
        spanish: 'Debe dejar de tratar de convencerme.',
        english: 'He should stop trying to convince me.',
        highlight: ['Debe', 'dejar de', 'tratar de']
      },
      {
        spanish: 'Suele acabar de terminar de trabajar tarde.',
        english: 'He usually just finishes working late.',
        highlight: ['Suele', 'acabar de', 'terminar de']
      }
    ],
    subsections: [
      {
        title: 'Multi-layered Verb Chains',
        content: 'Understanding complex serialization with multiple semantic layers.',
        conjugationTable: {
          title: 'Complex Serialization Examples',
          conjugations: [
            { pronoun: 'Modal + Aspectual + Action', form: 'quiero empezar a estudiar', english: 'want to start studying' },
            { pronoun: 'Modal + Modal + Action', form: 'debo poder ayudar', english: 'should be able to help' },
            { pronoun: 'Aspectual + Aspectual + Action', form: 'sigo tratando de entender', english: 'keep trying to understand' },
            { pronoun: 'Future + Aspectual + Action', form: 'voy a dejar de fumar', english: 'going to stop smoking' },
            { pronoun: 'Causative + Aspectual + Action', form: 'me hace querer estudiar', english: 'makes me want to study' },
            { pronoun: 'Perception + Aspectual + Action', form: 'lo veo empezar a correr', english: 'see him start running' }
          ]
        }
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Por vs Para', url: '/grammar/spanish/verbs/por-vs-para', difficulty: 'intermediate' },
  { title: 'Subjunctive Present', url: '/grammar/spanish/verbs/subjunctive-present', difficulty: 'advanced' },
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future', difficulty: 'intermediate' },
  { title: 'Modal Verbs', url: '/grammar/spanish/verbs/modal-verbs', difficulty: 'intermediate' }
];

export default function SpanishVerbSerializationPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Verb Serialization - Consecutive Verb Constructions',
            description: 'Learn Spanish verb serialization including consecutive verb constructions, verb chains, and complex predicate structures.',
            keywords: ['spanish verb serialization', 'consecutive verbs', 'verb chains', 'complex predicates'],
            language: 'spanish',
            category: 'verbs',
            topic: 'verb-serialization'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="verb-serialization"
        title="Spanish Verb Serialization"
        description="Learn Spanish verb serialization including consecutive verb constructions, verb chains, and complex predicate structures."
        difficulty="advanced"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/verb-serialization/practice"
        quizUrl="/grammar/spanish/verbs/verb-serialization/quiz"
        songUrl="/songs/es?theme=grammar&topic=verb-serialization"
        youtubeVideoId="verb-serialization-spanish"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
