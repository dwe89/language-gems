import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'cognitive-verbs',
  title: 'Spanish Cognitive Verbs - Thinking, Knowing, and Mental Processes',
  description: 'Learn Spanish cognitive verbs including saber, conocer, pensar, creer, and other verbs expressing mental processes and knowledge.',
  difficulty: 'intermediate',
  keywords: ['spanish cognitive verbs', 'thinking verbs', 'saber', 'conocer', 'pensar', 'creer', 'mental processes', 'knowledge verbs'],
  examples: ['Sé la respuesta', 'Conozco a María', 'Pienso en ti', 'Creo que es verdad']
});

const sections = [
  {
    title: 'Understanding Cognitive Verbs',
    content: 'Cognitive verbs express **mental processes** such as thinking, knowing, believing, remembering, and understanding. They describe activities of the mind and intellectual processes.',
    examples: [
      {
        spanish: 'Sé que tienes razón.',
        english: 'I know you\'re right.',
        highlight: ['Sé']
      },
      {
        spanish: 'Pienso en las vacaciones.',
        english: 'I think about vacation.',
        highlight: ['Pienso']
      },
      {
        spanish: 'Recuerdo mi infancia.',
        english: 'I remember my childhood.',
        highlight: ['Recuerdo']
      }
    ]
  },
  {
    title: 'SABER - Knowing Facts/Information',
    content: 'The verb **"saber"** means "to know" facts, information, or how to do something.',
    examples: [
      {
        spanish: 'Sé la respuesta correcta.',
        english: 'I know the correct answer.',
        highlight: ['Sé']
      },
      {
        spanish: 'Sabe hablar francés.',
        english: 'He knows how to speak French.',
        highlight: ['Sabe']
      },
      {
        spanish: 'No sabemos qué hacer.',
        english: 'We don\'t know what to do.',
        highlight: ['sabemos']
      }
    ],
    subsections: [
      {
        title: 'SABER Conjugation',
        content: 'SABER is irregular in several tenses.',
        conjugationTable: {
          title: 'SABER Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'sé', english: 'I know' },
            { pronoun: 'tú', form: 'sabes', english: 'you know' },
            { pronoun: 'él/ella', form: 'sabe', english: 'he/she knows' },
            { pronoun: 'nosotros', form: 'sabemos', english: 'we know' },
            { pronoun: 'vosotros', form: 'sabéis', english: 'you all know' },
            { pronoun: 'ellos', form: 'saben', english: 'they know' }
          ]
        }
      },
      {
        title: 'SABER + Infinitive',
        content: 'SABER + infinitive means "to know how to do something".',
        examples: [
          {
            spanish: 'Sé nadar muy bien.',
            english: 'I know how to swim very well.',
            highlight: ['Sé nadar']
          },
          {
            spanish: 'Sabe cocinar platos italianos.',
            english: 'She knows how to cook Italian dishes.',
            highlight: ['Sabe cocinar']
          }
        ]
      }
    ]
  },
  {
    title: 'CONOCER - Knowing People/Places',
    content: 'The verb **"conocer"** means "to know" people, places, or to be familiar with something.',
    examples: [
      {
        spanish: 'Conozco a tu hermana.',
        english: 'I know your sister.',
        highlight: ['Conozco']
      },
      {
        spanish: 'Conocemos bien esta ciudad.',
        english: 'We know this city well.',
        highlight: ['Conocemos']
      },
      {
        spanish: 'No conozco esa película.',
        english: 'I don\'t know that movie.',
        highlight: ['conozco']
      }
    ],
    subsections: [
      {
        title: 'CONOCER Conjugation',
        content: 'CONOCER is irregular in the first person singular.',
        conjugationTable: {
          title: 'CONOCER Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'conozco', english: 'I know' },
            { pronoun: 'tú', form: 'conoces', english: 'you know' },
            { pronoun: 'él/ella', form: 'conoce', english: 'he/she knows' },
            { pronoun: 'nosotros', form: 'conocemos', english: 'we know' },
            { pronoun: 'vosotros', form: 'conocéis', english: 'you all know' },
            { pronoun: 'ellos', form: 'conocen', english: 'they know' }
          ]
        }
      },
      {
        title: 'SABER vs CONOCER',
        content: 'SABER is for facts/skills; CONOCER is for familiarity.',
        examples: [
          {
            spanish: 'Sé su número de teléfono. (fact)',
            english: 'I know his phone number.',
            highlight: ['Sé']
          },
          {
            spanish: 'Conozco a Juan. (person)',
            english: 'I know Juan.',
            highlight: ['Conozco']
          },
          {
            spanish: 'Sé dónde vive. (information)',
            english: 'I know where he lives.',
            highlight: ['Sé']
          },
          {
            spanish: 'Conozco su casa. (familiarity)',
            english: 'I know his house.',
            highlight: ['Conozco']
          }
        ]
      }
    ]
  },
  {
    title: 'PENSAR - Thinking',
    content: 'The verb **"pensar"** means "to think" and expresses mental reflection or opinion.',
    examples: [
      {
        spanish: 'Pienso en mi familia.',
        english: 'I think about my family.',
        highlight: ['Pienso']
      },
      {
        spanish: 'Piensa que es una buena idea.',
        english: 'He thinks it\'s a good idea.',
        highlight: ['Piensa']
      },
      {
        spanish: 'Pensamos viajar en verano.',
        english: 'We\'re thinking of traveling in summer.',
        highlight: ['Pensamos']
      }
    ],
    subsections: [
      {
        title: 'PENSAR Conjugation',
        content: 'PENSAR is stem-changing (e→ie).',
        conjugationTable: {
          title: 'PENSAR Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'pienso', english: 'I think' },
            { pronoun: 'tú', form: 'piensas', english: 'you think' },
            { pronoun: 'él/ella', form: 'piensa', english: 'he/she thinks' },
            { pronoun: 'nosotros', form: 'pensamos', english: 'we think' },
            { pronoun: 'vosotros', form: 'pensáis', english: 'you all think' },
            { pronoun: 'ellos', form: 'piensan', english: 'they think' }
          ]
        }
      },
      {
        title: 'PENSAR Constructions',
        content: 'Different ways to use pensar.',
        examples: [
          {
            spanish: 'Pensar en (think about)',
            english: 'Pienso en ti.',
            highlight: ['Pensar en']
          },
          {
            spanish: 'Pensar que (think that)',
            english: 'Pienso que es verdad.',
            highlight: ['Pensar que']
          },
          {
            spanish: 'Pensar + infinitive (plan to)',
            english: 'Pienso estudiar.',
            highlight: ['Pienso estudiar']
          }
        ]
      }
    ]
  },
  {
    title: 'CREER - Believing',
    content: 'The verb **"creer"** means "to believe" and expresses faith, opinion, or conviction.',
    examples: [
      {
        spanish: 'Creo en la justicia.',
        english: 'I believe in justice.',
        highlight: ['Creo']
      },
      {
        spanish: 'Cree que va a llover.',
        english: 'She believes it\'s going to rain.',
        highlight: ['Cree']
      },
      {
        spanish: 'No creemos esa historia.',
        english: 'We don\'t believe that story.',
        highlight: ['creemos']
      }
    ],
    subsections: [
      {
        title: 'CREER Constructions',
        content: 'Different ways to use creer.',
        conjugationTable: {
          title: 'CREER Usage Patterns',
          conjugations: [
            { pronoun: 'creer en', form: 'creo en Dios', english: 'I believe in God' },
            { pronoun: 'creer que', form: 'creo que es verdad', english: 'I believe it\'s true' },
            { pronoun: 'creer a alguien', form: 'le creo', english: 'I believe him' },
            { pronoun: 'creerse', form: 'se cree muy listo', english: 'he thinks he\'s very smart' },
            { pronoun: 'no creer', form: 'no me lo creo', english: 'I don\'t believe it' },
            { pronoun: 'hacer creer', form: 'me hace creer', english: 'makes me believe' }
          ]
        }
      }
    ]
  },
  {
    title: 'RECORDAR - Remembering',
    content: 'The verb **"recordar"** means "to remember" or "to recall" information or experiences.',
    examples: [
      {
        spanish: 'Recuerdo mi primer día de escuela.',
        english: 'I remember my first day of school.',
        highlight: ['Recuerdo']
      },
      {
        spanish: 'No recuerda dónde puso las llaves.',
        english: 'He doesn\'t remember where he put the keys.',
        highlight: ['recuerda']
      },
      {
        spanish: 'Recordamos los buenos tiempos.',
        english: 'We remember the good times.',
        highlight: ['Recordamos']
      }
    ],
    subsections: [
      {
        title: 'RECORDAR Conjugation',
        content: 'RECORDAR is stem-changing (o→ue).',
        conjugationTable: {
          title: 'RECORDAR Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'recuerdo', english: 'I remember' },
            { pronoun: 'tú', form: 'recuerdas', english: 'you remember' },
            { pronoun: 'él/ella', form: 'recuerda', english: 'he/she remembers' },
            { pronoun: 'nosotros', form: 'recordamos', english: 'we remember' },
            { pronoun: 'vosotros', form: 'recordáis', english: 'you all remember' },
            { pronoun: 'ellos', form: 'recuerdan', english: 'they remember' }
          ]
        }
      },
      {
        title: 'RECORDAR vs ACORDARSE',
        content: 'RECORDAR (remember) vs ACORDARSE DE (remember/recall).',
        examples: [
          {
            spanish: 'Recuerdo la película. (direct)',
            english: 'I remember the movie.',
            highlight: ['Recuerdo']
          },
          {
            spanish: 'Me acuerdo de la película. (reflexive)',
            english: 'I remember the movie.',
            highlight: ['Me acuerdo de']
          }
        ]
      }
    ]
  },
  {
    title: 'OLVIDAR - Forgetting',
    content: 'The verb **"olvidar"** means "to forget" something or someone.',
    examples: [
      {
        spanish: 'Olvido los nombres fácilmente.',
        english: 'I forget names easily.',
        highlight: ['Olvido']
      },
      {
        spanish: 'Olvidó traer el libro.',
        english: 'He forgot to bring the book.',
        highlight: ['Olvidó']
      },
      {
        spanish: 'No olvides llamarme.',
        english: 'Don\'t forget to call me.',
        highlight: ['olvides']
      }
    ],
    subsections: [
      {
        title: 'OLVIDAR vs OLVIDARSE',
        content: 'OLVIDAR (forget) vs OLVIDARSE DE (forget about).',
        conjugationTable: {
          title: 'OLVIDAR vs OLVIDARSE',
          conjugations: [
            { pronoun: 'olvidar', form: 'olvido las llaves', english: 'I forget the keys' },
            { pronoun: 'olvidarse de', form: 'me olvido de las llaves', english: 'I forget about the keys' },
            { pronoun: 'olvidar', form: 'olvida el problema', english: 'forget the problem' },
            { pronoun: 'olvidarse de', form: 'se olvida del problema', english: 'forget about the problem' },
            { pronoun: 'olvidar', form: 'olvido + infinitive', english: 'forget to do something' },
            { pronoun: 'olvidarse de', form: 'me olvido de + infinitive', english: 'forget to do something' }
          ]
        }
      }
    ]
  },
  {
    title: 'ENTENDER/COMPRENDER - Understanding',
    content: 'The verbs **"entender"** and **"comprender"** both mean "to understand," with slight differences in usage.',
    examples: [
      {
        spanish: 'Entiendo la explicación.',
        english: 'I understand the explanation.',
        highlight: ['Entiendo']
      },
      {
        spanish: 'Comprende la situación.',
        english: 'He understands the situation.',
        highlight: ['Comprende']
      },
      {
        spanish: 'No entendemos el problema.',
        english: 'We don\'t understand the problem.',
        highlight: ['entendemos']
      }
    ],
    subsections: [
      {
        title: 'ENTENDER Conjugation',
        content: 'ENTENDER is stem-changing (e→ie).',
        conjugationTable: {
          title: 'ENTENDER Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'entiendo', english: 'I understand' },
            { pronoun: 'tú', form: 'entiendes', english: 'you understand' },
            { pronoun: 'él/ella', form: 'entiende', english: 'he/she understands' },
            { pronoun: 'nosotros', form: 'entendemos', english: 'we understand' },
            { pronoun: 'vosotros', form: 'entendéis', english: 'you all understand' },
            { pronoun: 'ellos', form: 'entienden', english: 'they understand' }
          ]
        }
      },
      {
        title: 'ENTENDER vs COMPRENDER',
        content: 'ENTENDER is more immediate; COMPRENDER is deeper understanding.',
        examples: [
          {
            spanish: 'Entiendo las palabras. (immediate)',
            english: 'I understand the words.',
            highlight: ['Entiendo']
          },
          {
            spanish: 'Comprendo el significado. (deeper)',
            english: 'I understand the meaning.',
            highlight: ['Comprendo']
          }
        ]
      }
    ]
  },
  {
    title: 'Other Cognitive Verbs',
    content: 'Additional important verbs for mental processes and cognition.',
    examples: [
      {
        spanish: 'Imagino un mundo mejor.',
        english: 'I imagine a better world.',
        highlight: ['Imagino']
      },
      {
        spanish: 'Duda de sus habilidades.',
        english: 'He doubts his abilities.',
        highlight: ['Duda']
      },
      {
        spanish: 'Reflexionamos sobre el futuro.',
        english: 'We reflect on the future.',
        highlight: ['Reflexionamos']
      }
    ],
    subsections: [
      {
        title: 'Mental Process Verbs',
        content: 'Various verbs for different mental activities.',
        conjugationTable: {
          title: 'Cognitive Verb Categories',
          conjugations: [
            { pronoun: 'Imagination', form: 'imaginar, soñar, fantasear', english: 'imagine, dream, fantasize' },
            { pronoun: 'Doubt/Certainty', form: 'dudar, estar seguro, confiar', english: 'doubt, be sure, trust' },
            { pronoun: 'Analysis', form: 'analizar, reflexionar, considerar', english: 'analyze, reflect, consider' },
            { pronoun: 'Decision', form: 'decidir, elegir, optar', english: 'decide, choose, opt' },
            { pronoun: 'Learning', form: 'aprender, estudiar, memorizar', english: 'learn, study, memorize' },
            { pronoun: 'Concentration', form: 'concentrarse, enfocarse, meditar', english: 'concentrate, focus, meditate' }
          ]
        }
      },
      {
        title: 'Cognitive Verb Constructions',
        content: 'Common patterns with cognitive verbs.',
        examples: [
          {
            spanish: 'Me parece que... (It seems to me that...)',
            english: 'It seems to me that...',
            highlight: ['Me parece que']
          },
          {
            spanish: 'Tengo la impresión de que... (I have the impression that...)',
            english: 'I have the impression that...',
            highlight: ['Tengo la impresión de que']
          }
        ]
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Past Participles', url: '/grammar/spanish/verbs/past-participles', difficulty: 'intermediate' },
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' },
  { title: 'Irregular Verbs', url: '/grammar/spanish/verbs/irregular-verbs', difficulty: 'intermediate' },
  { title: 'Modal Verbs', url: '/grammar/spanish/verbs/modal-verbs', difficulty: 'intermediate' }
];

export default function SpanishCognitiveVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Cognitive Verbs - Thinking, Knowing, and Mental Processes',
            description: 'Learn Spanish cognitive verbs including saber, conocer, pensar, creer, and other verbs expressing mental processes and knowledge.',
            keywords: ['spanish cognitive verbs', 'thinking verbs', 'saber', 'conocer', 'pensar', 'creer', 'mental processes'],
            language: 'spanish',
            category: 'verbs',
            topic: 'cognitive-verbs'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="cognitive-verbs"
        title="Spanish Cognitive Verbs"
        description="Learn Spanish cognitive verbs including saber, conocer, pensar, creer, and other verbs expressing mental processes and knowledge."
        difficulty="intermediate"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/cognitive-verbs/practice"
        quizUrl="/grammar/spanish/verbs/cognitive-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=cognitive-verbs"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
