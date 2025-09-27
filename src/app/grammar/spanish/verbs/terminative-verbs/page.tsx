import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'terminative-verbs',
  title: 'Spanish Terminative Verbs - Ending and Finishing Actions',
  description: 'Learn Spanish terminative verbs including terminar, acabar, finalizar, and other verbs expressing the end or completion of actions and states.',
  difficulty: 'intermediate',
  keywords: ['spanish terminative verbs', 'ending verbs', 'terminar', 'acabar', 'finalizar', 'finishing verbs', 'completion verbs'],
  examples: ['Termino el trabajo', 'Acaba la clase', 'Finaliza el proyecto', 'Deja de llover']
});

const sections = [
  {
    title: 'Understanding Terminative Verbs',
    content: 'Terminative verbs express the **end**, **completion**, or **cessation** of actions, states, or processes. They indicate when something finishes or stops happening.',
    examples: [
      {
        spanish: 'Termino el trabajo a las cinco.',
        english: 'I finish work at five.',
        highlight: ['Termino']
      },
      {
        spanish: 'Acaba la película.',
        english: 'The movie ends.',
        highlight: ['Acaba']
      },
      {
        spanish: 'Deja de llover.',
        english: 'It stops raining.',
        highlight: ['Deja de']
      }
    ]
  },
  {
    title: 'TERMINAR - Finishing/Ending',
    content: 'The verb **"terminar"** is the most common way to express "to finish" or "to end" in Spanish.',
    examples: [
      {
        spanish: 'Termino la tarea esta noche.',
        english: 'I finish the homework tonight.',
        highlight: ['Termino']
      },
      {
        spanish: 'La clase termina a las tres.',
        english: 'The class ends at three.',
        highlight: ['termina']
      },
      {
        spanish: 'Terminamos el proyecto ayer.',
        english: 'We finished the project yesterday.',
        highlight: ['Terminamos']
      }
    ],
    subsections: [
      {
        title: 'TERMINAR Constructions',
        content: 'Different ways to use terminar.',
        conjugationTable: {
          title: 'TERMINAR Usage Patterns',
          conjugations: [
            { pronoun: 'terminar + noun', form: 'termino el libro', english: 'I finish the book' },
            { pronoun: 'terminar de + infinitive', form: 'termino de comer', english: 'I finish eating' },
            { pronoun: 'terminar por + infinitive', form: 'termino por aceptar', english: 'I end up accepting' },
            { pronoun: 'terminar en + noun', form: 'termina en desastre', english: 'ends in disaster' },
            { pronoun: 'terminar con + noun', form: 'termina con él', english: 'breaks up with him' },
            { pronoun: 'terminarse', form: 'se termina la comida', english: 'the food runs out' }
          ]
        }
      },
      {
        title: 'TERMINAR DE vs TERMINAR POR',
        content: 'Different meanings with prepositions.',
        examples: [
          {
            spanish: 'Termino de estudiar. (finish studying)',
            english: 'I finish studying.',
            highlight: ['Termino de']
          },
          {
            spanish: 'Termino por rendirme. (end up giving up)',
            english: 'I end up giving up.',
            highlight: ['Termino por']
          }
        ]
      }
    ]
  },
  {
    title: 'ACABAR - Finishing/Ending',
    content: 'The verb **"acabar"** means "to finish" or "to end" and is often interchangeable with terminar.',
    examples: [
      {
        spanish: 'Acabo el trabajo temprano.',
        english: 'I finish work early.',
        highlight: ['Acabo']
      },
      {
        spanish: 'La reunión acaba pronto.',
        english: 'The meeting ends soon.',
        highlight: ['acaba']
      },
      {
        spanish: 'Acabamos de llegar.',
        english: 'We just arrived.',
        highlight: ['Acabamos de']
      }
    ],
    subsections: [
      {
        title: 'ACABAR DE - Just Did Something',
        content: 'ACABAR DE + infinitive means "to have just done something".',
        conjugationTable: {
          title: 'ACABAR DE Usage',
          conjugations: [
            { pronoun: 'Recent past', form: 'acabo de llegar', english: 'I just arrived' },
            { pronoun: 'Just finished', form: 'acaba de terminar', english: 'he just finished' },
            { pronoun: 'Recent action', form: 'acabamos de comer', english: 'we just ate' },
            { pronoun: 'Just happened', form: 'acaba de pasar', english: 'it just happened' },
            { pronoun: 'Recent completion', form: 'acaban de salir', english: 'they just left' },
            { pronoun: 'Just started', form: 'acaba de empezar', english: 'it just started' }
          ]
        }
      },
      {
        title: 'ACABAR CON - Putting an End To',
        content: 'ACABAR CON means "to put an end to" or "to finish off".',
        examples: [
          {
            spanish: 'Acaba con el problema.',
            english: 'Put an end to the problem.',
            highlight: ['Acaba con']
          },
          {
            spanish: 'Acabó con sus ahorros.',
            english: 'He used up his savings.',
            highlight: ['Acabó con']
          }
        ]
      }
    ]
  },
  {
    title: 'FINALIZAR - Finalizing/Concluding',
    content: 'The verb **"finalizar"** means "to finalize" or "to conclude" and is more formal than terminar or acabar.',
    examples: [
      {
        spanish: 'Finaliza el contrato mañana.',
        english: 'The contract ends tomorrow.',
        highlight: ['Finaliza']
      },
      {
        spanish: 'Finalizamos la presentación.',
        english: 'We finalize the presentation.',
        highlight: ['Finalizamos']
      },
      {
        spanish: 'El evento finalizó con éxito.',
        english: 'The event concluded successfully.',
        highlight: ['finalizó']
      }
    ],
    subsections: [
      {
        title: 'FINALIZAR Usage Contexts',
        content: 'FINALIZAR is used in formal, business, or official contexts.',
        conjugationTable: {
          title: 'FINALIZAR Contexts',
          conjugations: [
            { pronoun: 'Business', form: 'finalizar contrato', english: 'finalize contract' },
            { pronoun: 'Academic', form: 'finalizar curso', english: 'complete course' },
            { pronoun: 'Official', form: 'finalizar proceso', english: 'conclude process' },
            { pronoun: 'Events', form: 'finalizar ceremonia', english: 'conclude ceremony' },
            { pronoun: 'Projects', form: 'finalizar proyecto', english: 'finalize project' },
            { pronoun: 'Documents', form: 'finalizar informe', english: 'finalize report' }
          ]
        }
      }
    ]
  },
  {
    title: 'DEJAR DE - Stopping/Ceasing',
    content: 'The expression **"dejar de"** means "to stop" or "to cease" doing something.',
    examples: [
      {
        spanish: 'Dejo de fumar.',
        english: 'I stop smoking.',
        highlight: ['Dejo de']
      },
      {
        spanish: 'Deja de llover.',
        english: 'It stops raining.',
        highlight: ['Deja de']
      },
      {
        spanish: 'No dejes de llamarme.',
        english: 'Don\'t stop calling me.',
        highlight: ['dejes de']
      }
    ],
    subsections: [
      {
        title: 'DEJAR DE Usage Patterns',
        content: 'Used for stopping ongoing actions or habits.',
        conjugationTable: {
          title: 'DEJAR DE Patterns',
          conjugations: [
            { pronoun: 'Stop habit', form: 'deja de fumar', english: 'stops smoking' },
            { pronoun: 'Cease activity', form: 'deja de trabajar', english: 'stops working' },
            { pronoun: 'End behavior', form: 'deja de molestar', english: 'stops bothering' },
            { pronoun: 'Weather stops', form: 'deja de llover', english: 'stops raining' },
            { pronoun: 'Negative command', form: 'no dejes de estudiar', english: 'don\'t stop studying' },
            { pronoun: 'Continuous action', form: 'no deja de hablar', english: 'doesn\'t stop talking' }
          ]
        }
      }
    ]
  },
  {
    title: 'PARAR - Stopping/Halting',
    content: 'The verb **"parar"** means "to stop" or "to halt," often referring to movement or machines.',
    examples: [
      {
        spanish: 'Para el coche aquí.',
        english: 'Stop the car here.',
        highlight: ['Para']
      },
      {
        spanish: 'El reloj se paró.',
        english: 'The clock stopped.',
        highlight: ['se paró']
      },
      {
        spanish: 'No para de hablar.',
        english: 'He doesn\'t stop talking.',
        highlight: ['No para de']
      }
    ],
    subsections: [
      {
        title: 'PARAR vs DEJAR DE',
        content: 'PARAR is for physical stopping; DEJAR DE is for ceasing activities.',
        conjugationTable: {
          title: 'PARAR vs DEJAR DE',
          conjugations: [
            { pronoun: 'Physical stop', form: 'para el coche', english: 'stop the car' },
            { pronoun: 'Cease activity', form: 'deja de conducir', english: 'stop driving' },
            { pronoun: 'Machine halt', form: 'para la máquina', english: 'stop the machine' },
            { pronoun: 'End habit', form: 'deja de beber', english: 'stop drinking' },
            { pronoun: 'Movement stop', form: 'para de correr', english: 'stop running' },
            { pronoun: 'Activity cease', form: 'deja de correr', english: 'quit running' }
          ]
        }
      }
    ]
  },
  {
    title: 'CESAR - Ceasing/Stopping',
    content: 'The verb **"cesar"** means "to cease" and is formal, often used in official or literary contexts.',
    examples: [
      {
        spanish: 'Cesa la lluvia.',
        english: 'The rain ceases.',
        highlight: ['Cesa']
      },
      {
        spanish: 'Cesó en su cargo.',
        english: 'He ceased in his position.',
        highlight: ['Cesó']
      },
      {
        spanish: 'No cesa de trabajar.',
        english: 'He doesn\'t cease working.',
        highlight: ['No cesa de']
      }
    ],
    subsections: [
      {
        title: 'CESAR Usage Contexts',
        content: 'CESAR is formal and often used in official or literary language.',
        conjugationTable: {
          title: 'CESAR Contexts',
          conjugations: [
            { pronoun: 'Official', form: 'cesar en el cargo', english: 'cease in position' },
            { pronoun: 'Weather', form: 'cesar la lluvia', english: 'rain ceases' },
            { pronoun: 'Formal stop', form: 'cesar actividades', english: 'cease activities' },
            { pronoun: 'Literary', form: 'cesar el dolor', english: 'pain ceases' },
            { pronoun: 'Continuous', form: 'no cesar de', english: 'not cease to' },
            { pronoun: 'Employment', form: 'cesar al empleado', english: 'dismiss employee' }
          ]
        }
      }
    ]
  },
  {
    title: 'CONCLUIR - Concluding',
    content: 'The verb **"concluir"** means "to conclude" and implies a formal or logical ending.',
    examples: [
      {
        spanish: 'Concluye su discurso.',
        english: 'He concludes his speech.',
        highlight: ['Concluye']
      },
      {
        spanish: 'Concluimos que es verdad.',
        english: 'We conclude that it\'s true.',
        highlight: ['Concluimos']
      },
      {
        spanish: 'El estudio concluyó ayer.',
        english: 'The study concluded yesterday.',
        highlight: ['concluyó']
      }
    ],
    subsections: [
      {
        title: 'CONCLUIR Usage Patterns',
        content: 'Used for formal conclusions and logical endings.',
        conjugationTable: {
          title: 'CONCLUIR Patterns',
          conjugations: [
            { pronoun: 'Logical conclusion', form: 'concluyo que...', english: 'I conclude that...' },
            { pronoun: 'Formal ending', form: 'concluye la reunión', english: 'concludes the meeting' },
            { pronoun: 'Study results', form: 'concluye el estudio', english: 'concludes the study' },
            { pronoun: 'Speech ending', form: 'concluye el discurso', english: 'concludes the speech' },
            { pronoun: 'Process end', form: 'concluye el proceso', english: 'concludes the process' },
            { pronoun: 'Investigation', form: 'concluye la investigación', english: 'concludes investigation' }
          ]
        }
      }
    ]
  },
  {
    title: 'COMPLETAR - Completing',
    content: 'The verb **"completar"** means "to complete" and emphasizes finishing something entirely.',
    examples: [
      {
        spanish: 'Completo el formulario.',
        english: 'I complete the form.',
        highlight: ['Completo']
      },
      {
        spanish: 'Completa la colección.',
        english: 'He completes the collection.',
        highlight: ['Completa']
      },
      {
        spanish: 'Completamos el círculo.',
        english: 'We complete the circle.',
        highlight: ['Completamos']
      }
    ],
    subsections: [
      {
        title: 'COMPLETAR vs TERMINAR',
        content: 'COMPLETAR emphasizes totality; TERMINAR emphasizes ending.',
        conjugationTable: {
          title: 'COMPLETAR vs TERMINAR',
          conjugations: [
            { pronoun: 'Total completion', form: 'completa el puzzle', english: 'completes the puzzle' },
            { pronoun: 'Simple ending', form: 'termina el puzzle', english: 'finishes the puzzle' },
            { pronoun: 'Fill entirely', form: 'completa el formulario', english: 'completes the form' },
            { pronoun: 'Finish task', form: 'termina el formulario', english: 'finishes the form' },
            { pronoun: 'Make whole', form: 'completa la serie', english: 'completes the series' },
            { pronoun: 'End activity', form: 'termina la serie', english: 'finishes the series' }
          ]
        }
      }
    ]
  },
  {
    title: 'Terminative Expressions with Time',
    content: 'Special expressions for **time periods** ending.',
    examples: [
      {
        spanish: 'Se acaba el tiempo.',
        english: 'Time is running out.',
        highlight: ['Se acaba']
      },
      {
        spanish: 'Termina el plazo.',
        english: 'The deadline ends.',
        highlight: ['Termina']
      },
      {
        spanish: 'Expira el contrato.',
        english: 'The contract expires.',
        highlight: ['Expira']
      }
    ],
    subsections: [
      {
        title: 'Time-related Terminative Verbs',
        content: 'Specific verbs for time endings.',
        conjugationTable: {
          title: 'Time Terminative Verbs',
          conjugations: [
            { pronoun: 'Time runs out', form: 'se acaba el tiempo', english: 'time runs out' },
            { pronoun: 'Deadline ends', form: 'termina el plazo', english: 'deadline ends' },
            { pronoun: 'Contract expires', form: 'expira el contrato', english: 'contract expires' },
            { pronoun: 'Period ends', form: 'finaliza el período', english: 'period ends' },
            { pronoun: 'Term concludes', form: 'concluye el término', english: 'term concludes' },
            { pronoun: 'Duration finishes', form: 'se agota la duración', english: 'duration is exhausted' }
          ]
        }
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Imperative', url: '/grammar/spanish/verbs/imperative', difficulty: 'intermediate' },
  { title: 'Irregular Verbs', url: '/grammar/spanish/verbs/irregular-verbs', difficulty: 'intermediate' },
  { title: 'Subjunctive Present', url: '/grammar/spanish/verbs/subjunctive-present', difficulty: 'advanced' },
  { title: 'Past Participles', url: '/grammar/spanish/verbs/past-participles', difficulty: 'intermediate' }
];

export default function SpanishTerminativeVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Terminative Verbs - Ending and Finishing Actions',
            description: 'Learn Spanish terminative verbs including terminar, acabar, finalizar, and other verbs expressing the end or completion of actions and states.',
            keywords: ['spanish terminative verbs', 'ending verbs', 'terminar', 'acabar', 'finalizar', 'finishing verbs'],
            language: 'spanish',
            category: 'verbs',
            topic: 'terminative-verbs'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="terminative-verbs"
        title="Spanish Terminative Verbs"
        description="Learn Spanish terminative verbs including terminar, acabar, finalizar, and other verbs expressing the end or completion of actions and states."
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/terminative-verbs/practice"
        quizUrl="/grammar/spanish/verbs/terminative-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=terminative-verbs"
        youtubeVideoId="terminative-verbs-spanish"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
