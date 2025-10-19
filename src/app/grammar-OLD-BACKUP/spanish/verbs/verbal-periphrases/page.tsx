import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'verbal-periphrases',
  title: 'Spanish Verbal Periphrases - Complex Verb Constructions',
  description: 'Master Spanish verbal periphrases including modal, aspectual, and temporal constructions with auxiliary verbs and infinitives.',
  difficulty: 'advanced',
  keywords: ['spanish verbal periphrases', 'complex verbs', 'modal constructions', 'aspectual verbs', 'auxiliary verbs'],
  examples: ['Voy a estudiar', 'Acabo de llegar', 'Tengo que trabajar', 'Suelo madrugar']
});

const sections = [
  {
    title: 'Understanding Verbal Periphrases',
    content: 'Verbal periphrases (perífrasis verbales) are complex verb constructions formed by an **auxiliary verb** + **infinitive**, **gerund**, or **past participle**. They express nuances of meaning that simple tenses cannot convey.',
    examples: [
      {
        spanish: 'Voy a estudiar esta noche.',
        english: 'I am going to study tonight.',
        highlight: ['Voy a', 'estudiar']
      },
      {
        spanish: 'Acabo de terminar el trabajo.',
        english: 'I have just finished the work.',
        highlight: ['Acabo de', 'terminar']
      }
    ]
  },
  {
    title: 'Modal Periphrases',
    content: 'Modal periphrases express **obligation**, **necessity**, **possibility**, or **ability**. They modify the meaning of the main verb.',
    examples: [
      {
        spanish: 'Tengo que estudiar para el examen.',
        english: 'I have to study for the exam.',
        highlight: ['Tengo que', 'estudiar']
      },
      {
        spanish: 'Puedo ayudarte con la tarea.',
        english: 'I can help you with the homework.',
        highlight: ['Puedo', 'ayudarte']
      }
    ],
    subsections: [
      {
        title: 'Obligation and Necessity',
        content: 'These periphrases express different degrees of obligation.',
        conjugationTable: {
          title: 'Modal Periphrases - Obligation',
          conjugations: [
            { pronoun: 'tener que + inf.', form: 'tengo que estudiar', english: 'I have to study (strong obligation)' },
            { pronoun: 'haber de + inf.', form: 'he de estudiar', english: 'I must study (formal obligation)' },
            { pronoun: 'deber + inf.', form: 'debo estudiar', english: 'I should study (moral duty)' },
            { pronoun: 'haber que + inf.', form: 'hay que estudiar', english: 'one must study (impersonal)' }
          ]
        }
      },
      {
        title: 'Possibility and Ability',
        content: 'These express capability, permission, or possibility.',
        conjugationTable: {
          title: 'Modal Periphrases - Possibility',
          conjugations: [
            { pronoun: 'poder + inf.', form: 'puedo estudiar', english: 'I can study (ability/permission)' },
            { pronoun: 'saber + inf.', form: 'sé estudiar', english: 'I know how to study (learned skill)' },
            { pronoun: 'venir a + inf.', form: 'viene a costar', english: 'it comes to cost (approximation)' }
          ]
        }
      }
    ]
  },
  {
    title: 'Aspectual Periphrases',
    content: 'Aspectual periphrases indicate the **phase** or **aspect** of an action: beginning, continuation, repetition, or completion.',
    examples: [
      {
        spanish: 'Empiezo a entender el problema.',
        english: 'I\'m beginning to understand the problem.',
        highlight: ['Empiezo a', 'entender']
      },
      {
        spanish: 'Sigo trabajando en el proyecto.',
        english: 'I continue working on the project.',
        highlight: ['Sigo', 'trabajando']
      }
    ],
    subsections: [
      {
        title: 'Ingressive (Beginning)',
        content: 'These periphrases indicate the start of an action.',
        conjugationTable: {
          title: 'Aspectual Periphrases - Beginning',
          conjugations: [
            { pronoun: 'empezar a + inf.', form: 'empiezo a estudiar', english: 'I start to study' },
            { pronoun: 'comenzar a + inf.', form: 'comienzo a estudiar', english: 'I begin to study' },
            { pronoun: 'ponerse a + inf.', form: 'me pongo a estudiar', english: 'I start studying (suddenly)' },
            { pronoun: 'echarse a + inf.', form: 'se echa a llorar', english: 'he/she starts crying (suddenly)' }
          ]
        }
      },
      {
        title: 'Continuative (Ongoing)',
        content: 'These express continuation or persistence of an action.',
        conjugationTable: {
          title: 'Aspectual Periphrases - Continuation',
          conjugations: [
            { pronoun: 'seguir + ger.', form: 'sigo estudiando', english: 'I continue studying' },
            { pronoun: 'continuar + ger.', form: 'continúo estudiando', english: 'I continue studying' },
            { pronoun: 'estar + ger.', form: 'estoy estudiando', english: 'I am studying (progressive)' },
            { pronoun: 'andar + ger.', form: 'anda diciendo', english: 'he/she goes around saying' }
          ]
        }
      },
      {
        title: 'Terminative (Completion)',
        content: 'These indicate the end or completion of an action.',
        conjugationTable: {
          title: 'Aspectual Periphrases - Completion',
          conjugations: [
            { pronoun: 'acabar de + inf.', form: 'acabo de estudiar', english: 'I have just studied' },
            { pronoun: 'terminar de + inf.', form: 'termino de estudiar', english: 'I finish studying' },
            { pronoun: 'dejar de + inf.', form: 'dejo de estudiar', english: 'I stop studying' },
            { pronoun: 'cesar de + inf.', form: 'cesa de llover', english: 'it stops raining' }
          ]
        }
      }
    ]
  },
  {
    title: 'Temporal Periphrases',
    content: 'Temporal periphrases express **future intentions**, **habitual actions**, or **temporal relationships**.',
    examples: [
      {
        spanish: 'Voy a viajar el próximo mes.',
        english: 'I am going to travel next month.',
        highlight: ['Voy a', 'viajar']
      },
      {
        spanish: 'Suelo levantarme temprano.',
        english: 'I usually get up early.',
        highlight: ['Suelo', 'levantarme']
      }
    ],
    subsections: [
      {
        title: 'Future and Intention',
        content: 'These express future plans or intentions.',
        conjugationTable: {
          title: 'Temporal Periphrases - Future',
          conjugations: [
            { pronoun: 'ir a + inf.', form: 'voy a estudiar', english: 'I am going to study (near future)' },
            { pronoun: 'estar a punto de + inf.', form: 'está a punto de llover', english: 'it\'s about to rain' },
            { pronoun: 'estar para + inf.', form: 'está para llover', english: 'it\'s about to rain' }
          ]
        }
      },
      {
        title: 'Habitual and Repetitive',
        content: 'These express habitual or repeated actions.',
        conjugationTable: {
          title: 'Temporal Periphrases - Habitual',
          conjugations: [
            { pronoun: 'soler + inf.', form: 'suelo estudiar', english: 'I usually study' },
            { pronoun: 'acostumbrar a + inf.', form: 'acostumbro a estudiar', english: 'I am accustomed to studying' },
            { pronoun: 'volver a + inf.', form: 'vuelvo a estudiar', english: 'I study again (repetition)' }
          ]
        }
      }
    ]
  },
  {
    title: 'Periphrases with Gerund',
    content: 'Some periphrases use gerunds to express ongoing actions or manner of action.',
    examples: [
      {
        spanish: 'Anda buscando trabajo.',
        english: 'He/She is looking for work.',
        highlight: ['Anda', 'buscando']
      },
      {
        spanish: 'Viene corriendo desde casa.',
        english: 'He/She comes running from home.',
        highlight: ['Viene', 'corriendo']
      }
    ],
    subsections: [
      {
        title: 'Common Gerund Periphrases',
        content: 'These add nuance to the manner or progression of actions.',
        conjugationTable: {
          title: 'Periphrases with Gerund',
          conjugations: [
            { pronoun: 'ir + ger.', form: 'va caminando', english: 'he/she goes walking' },
            { pronoun: 'venir + ger.', form: 'viene corriendo', english: 'he/she comes running' },
            { pronoun: 'salir + ger.', form: 'sale corriendo', english: 'he/she leaves running' },
            { pronoun: 'llevar + ger.', form: 'llevo esperando una hora', english: 'I\'ve been waiting for an hour' }
          ]
        }
      }
    ]
  },
  {
    title: 'Usage and Style',
    content: 'Verbal periphrases add precision and nuance to Spanish expression. They are essential for natural, fluent Spanish.',
    examples: [
      {
        spanish: 'Tengo que irme. (obligation)',
        english: 'I have to leave.',
        highlight: ['Tengo que']
      },
      {
        spanish: 'Acabo de llegar. (recent completion)',
        english: 'I have just arrived.',
        highlight: ['Acabo de']
      }
    ],
    subsections: [
      {
        title: 'Key Usage Points',
        content: '1. **Choose the right auxiliary** for the intended meaning\n2. **Maintain agreement** between auxiliary and subject\n3. **Use appropriate prepositions** (a, de, que)\n4. **Consider register** (formal vs. informal)\n5. **Practice combinations** for fluency'
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Conditional Tense', url: '/grammar/spanish/verbs/conditional', difficulty: 'intermediate' },
  { title: 'Subjunctive Imperfect', url: '/grammar/spanish/verbs/subjunctive-imperfect', difficulty: 'advanced' },
  { title: 'Gerunds', url: '/grammar/spanish/verbs/gerunds', difficulty: 'intermediate' },
  { title: 'Por vs Para', url: '/grammar/spanish/verbs/por-vs-para', difficulty: 'intermediate' }
];

export default function SpanishVerbalPeriphrasesPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Verbal Periphrases - Complex Verb Constructions',
            description: 'Master Spanish verbal periphrases including modal, aspectual, and temporal constructions with auxiliary verbs and infinitives.',
            keywords: ['spanish verbal periphrases', 'complex verbs', 'modal constructions', 'aspectual verbs'],
            language: 'spanish',
            category: 'verbs',
            topic: 'verbal-periphrases'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="verbal-periphrases"
        title="Spanish Verbal Periphrases"
        description="Master Spanish verbal periphrases including modal, aspectual, and temporal constructions with auxiliary verbs and infinitives."
        difficulty="advanced"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/verbal-periphrases/practice"
        quizUrl="/grammar/spanish/verbs/verbal-periphrases/quiz"
        songUrl="/songs/es?theme=grammar&topic=verbal-periphrases"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
