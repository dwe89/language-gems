import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'auxiliary-verbs',
  title: 'Spanish Auxiliary Verbs - Haber, Ser, Estar, and More',
  description: 'Master Spanish auxiliary verbs including haber for perfect tenses, ser for passive voice, estar for progressive tenses, and other helping verbs.',
  difficulty: 'intermediate',
  keywords: ['spanish auxiliary verbs', 'haber', 'ser', 'estar', 'helping verbs', 'perfect tenses', 'passive voice', 'progressive tenses'],
  examples: ['He comido', 'Está corriendo', 'Fue construido', 'Va a llover']
});

const sections = [
  {
    title: 'Understanding Spanish Auxiliary Verbs',
    content: 'Auxiliary verbs (verbos auxiliares) are helping verbs that combine with main verbs to form compound tenses, passive constructions, and other grammatical structures. The main auxiliary verbs in Spanish are **haber**, **ser**, **estar**, **ir**, and **tener**.',
    examples: [
      {
        spanish: 'He estudiado español.',
        english: 'I have studied Spanish.',
        highlight: ['He', 'estudiado']
      },
      {
        spanish: 'Está lloviendo.',
        english: 'It is raining.',
        highlight: ['Está', 'lloviendo']
      }
    ]
  },
  {
    title: 'Haber - Perfect Tenses',
    content: 'The auxiliary verb **haber** is used to form all perfect tenses in Spanish. It combines with past participles to express completed actions.',
    examples: [
      {
        spanish: 'He terminado mi tarea.',
        english: 'I have finished my homework.',
        highlight: ['He', 'terminado']
      },
      {
        spanish: 'Habían llegado temprano.',
        english: 'They had arrived early.',
        highlight: ['Habían', 'llegado']
      }
    ],
    subsections: [
      {
        title: 'Present Perfect (Pretérito Perfecto)',
        content: '**Haber** (present) + past participle',
        conjugationTable: {
          title: 'Haber - Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'he', english: 'I have' },
            { pronoun: 'tú', form: 'has', english: 'you have' },
            { pronoun: 'él/ella/usted', form: 'ha', english: 'he/she/you have' },
            { pronoun: 'nosotros', form: 'hemos', english: 'we have' },
            { pronoun: 'vosotros', form: 'habéis', english: 'you all have' },
            { pronoun: 'ellos/ellas/ustedes', form: 'han', english: 'they/you all have' }
          ]
        }
      },
      {
        title: 'Other Perfect Tenses',
        content: '**Pluperfect**: había + past participle\n**Future Perfect**: habré + past participle\n**Conditional Perfect**: habría + past participle'
      }
    ]
  },
  {
    title: 'Ser - Passive Voice',
    content: 'The auxiliary verb **ser** is used to form the passive voice, emphasizing the action rather than who performs it.',
    examples: [
      {
        spanish: 'La casa fue construida en 1950.',
        english: 'The house was built in 1950.',
        highlight: ['fue', 'construida']
      },
      {
        spanish: 'Los libros son vendidos aquí.',
        english: 'Books are sold here.',
        highlight: ['son', 'vendidos']
      }
    ],
    subsections: [
      {
        title: 'Passive Voice Formation',
        content: '**Ser** (conjugated) + past participle + **por** (agent)',
        conjugationTable: {
          title: 'Common Ser Forms for Passive',
          conjugations: [
            { pronoun: 'Present', form: 'es/son', english: 'is/are' },
            { pronoun: 'Preterite', form: 'fue/fueron', english: 'was/were' },
            { pronoun: 'Imperfect', form: 'era/eran', english: 'was/were (ongoing)' },
            { pronoun: 'Future', form: 'será/serán', english: 'will be' }
          ]
        }
      }
    ]
  },
  {
    title: 'Estar - Progressive Tenses',
    content: 'The auxiliary verb **estar** combines with present participles (gerunds) to form progressive tenses, expressing ongoing actions.',
    examples: [
      {
        spanish: 'Estoy estudiando para el examen.',
        english: 'I am studying for the exam.',
        highlight: ['Estoy', 'estudiando']
      },
      {
        spanish: 'Estaban durmiendo cuando llegué.',
        english: 'They were sleeping when I arrived.',
        highlight: ['Estaban', 'durmiendo']
      }
    ],
    subsections: [
      {
        title: 'Progressive Tense Formation',
        content: '**Estar** (conjugated) + present participle (-ando/-iendo)',
        conjugationTable: {
          title: 'Estar - Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'estoy', english: 'I am' },
            { pronoun: 'tú', form: 'estás', english: 'you are' },
            { pronoun: 'él/ella/usted', form: 'está', english: 'he/she/you are' },
            { pronoun: 'nosotros', form: 'estamos', english: 'we are' },
            { pronoun: 'vosotros', form: 'estáis', english: 'you all are' },
            { pronoun: 'ellos/ellas/ustedes', form: 'están', english: 'they/you all are' }
          ]
        }
      }
    ]
  },
  {
    title: 'Ir - Future Constructions',
    content: 'The auxiliary verb **ir** is used to form the periphrastic future (ir a + infinitive) and other constructions.',
    examples: [
      {
        spanish: 'Voy a estudiar esta noche.',
        english: 'I am going to study tonight.',
        highlight: ['Voy a', 'estudiar']
      },
      {
        spanish: 'Van a llegar mañana.',
        english: 'They are going to arrive tomorrow.',
        highlight: ['Van a', 'llegar']
      }
    ]
  },
  {
    title: 'Other Auxiliary Verbs',
    content: 'Several other verbs can function as auxiliaries in specific constructions.',
    examples: [
      {
        spanish: 'Tengo que trabajar.',
        english: 'I have to work.',
        highlight: ['Tengo que', 'trabajar']
      },
      {
        spanish: 'Debo estudiar más.',
        english: 'I must study more.',
        highlight: ['Debo', 'estudiar']
      }
    ],
    subsections: [
      {
        title: 'Common Auxiliary Constructions',
        content: '**Tener que** + infinitive: obligation\n**Deber** + infinitive: duty/should\n**Poder** + infinitive: ability/permission\n**Querer** + infinitive: desire\n**Soler** + infinitive: habitual action'
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Irregular Verbs', url: '/grammar/spanish/verbs/irregular-verbs', difficulty: 'intermediate' },
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future', difficulty: 'intermediate' },
  { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect', difficulty: 'intermediate' },
  { title: 'Subjunctive Imperfect', url: '/grammar/spanish/verbs/subjunctive-imperfect', difficulty: 'advanced' }
];

export default function SpanishAuxiliaryVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Auxiliary Verbs - Haber, Ser, Estar, and More',
            description: 'Master Spanish auxiliary verbs including haber for perfect tenses, ser for passive voice, estar for progressive tenses, and other helping verbs.',
            keywords: ['spanish auxiliary verbs', 'haber', 'ser', 'estar', 'helping verbs', 'perfect tenses'],
            language: 'spanish',
            category: 'verbs',
            topic: 'auxiliary-verbs'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="auxiliary-verbs"
        title="Spanish Auxiliary Verbs"
        description="Master Spanish auxiliary verbs including haber for perfect tenses, ser for passive voice, estar for progressive tenses, and other helping verbs."
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/auxiliary-verbs/practice"
        quizUrl="/grammar/spanish/verbs/auxiliary-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=auxiliary-verbs"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
