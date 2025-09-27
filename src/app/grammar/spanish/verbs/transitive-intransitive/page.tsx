import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'transitive-intransitive',
  title: 'Spanish Transitive and Intransitive Verbs',
  description: 'Learn the difference between transitive and intransitive verbs in Spanish, including direct objects, indirect objects, and verb classifications.',
  difficulty: 'intermediate',
  keywords: ['spanish transitive verbs', 'intransitive verbs', 'direct object', 'indirect object', 'verb classification'],
  examples: ['Leo un libro', 'Ella corre', 'Le doy el regalo', 'Llueve mucho']
});

const sections = [
  {
    title: 'Understanding Transitive and Intransitive Verbs',
    content: 'Spanish verbs are classified as **transitive** or **intransitive** based on whether they require a direct object to complete their meaning. This classification affects sentence structure and pronoun usage.',
    examples: [
      {
        spanish: 'Leo un libro.',
        english: 'I read a book. (Transitive)',
        highlight: ['Leo', 'un libro']
      },
      {
        spanish: 'Ella corre.',
        english: 'She runs. (Intransitive)',
        highlight: ['corre']
      }
    ]
  },
  {
    title: 'Transitive Verbs (Verbos Transitivos)',
    content: 'Transitive verbs require a **direct object** to complete their meaning. The direct object receives the action of the verb and answers "what?" or "whom?"',
    examples: [
      {
        spanish: 'María compra flores.',
        english: 'María buys flowers.',
        highlight: ['compra', 'flores']
      },
      {
        spanish: 'Los estudiantes estudian español.',
        english: 'The students study Spanish.',
        highlight: ['estudian', 'español']
      },
      {
        spanish: 'Veo a mi hermano.',
        english: 'I see my brother.',
        highlight: ['Veo', 'a mi hermano']
      }
    ],
    subsections: [
      {
        title: 'Common Transitive Verbs',
        content: 'Many everyday Spanish verbs are transitive and require direct objects.',
        conjugationTable: {
          title: 'Common Transitive Verbs',
          conjugations: [
            { pronoun: 'leer', form: 'to read', english: 'Leo libros (I read books)' },
            { pronoun: 'escribir', form: 'to write', english: 'Escribo cartas (I write letters)' },
            { pronoun: 'comprar', form: 'to buy', english: 'Compro comida (I buy food)' },
            { pronoun: 'hacer', form: 'to do/make', english: 'Hago la tarea (I do homework)' },
            { pronoun: 'ver', form: 'to see', english: 'Veo la película (I see the movie)' },
            { pronoun: 'tener', form: 'to have', english: 'Tengo un coche (I have a car)' }
          ]
        }
      },
      {
        title: 'Personal "A"',
        content: 'When the direct object is a specific person or personified entity, use the preposition **a** before the object.',
        examples: [
          {
            spanish: 'Conozco a Juan.',
            english: 'I know Juan.',
            highlight: ['a Juan']
          },
          {
            spanish: 'Busco a mi gato.',
            english: 'I\'m looking for my cat.',
            highlight: ['a mi gato']
          }
        ]
      }
    ]
  },
  {
    title: 'Intransitive Verbs (Verbos Intransitivos)',
    content: 'Intransitive verbs do **not** require a direct object. They express complete actions or states by themselves.',
    examples: [
      {
        spanish: 'El bebé duerme.',
        english: 'The baby sleeps.',
        highlight: ['duerme']
      },
      {
        spanish: 'Llueve mucho.',
        english: 'It rains a lot.',
        highlight: ['Llueve']
      },
      {
        spanish: 'Mis padres viajan.',
        english: 'My parents travel.',
        highlight: ['viajan']
      }
    ],
    subsections: [
      {
        title: 'Common Intransitive Verbs',
        content: 'These verbs express complete actions without needing direct objects.',
        conjugationTable: {
          title: 'Common Intransitive Verbs',
          conjugations: [
            { pronoun: 'dormir', form: 'to sleep', english: 'Duermo bien (I sleep well)' },
            { pronoun: 'correr', form: 'to run', english: 'Corro rápido (I run fast)' },
            { pronoun: 'llegar', form: 'to arrive', english: 'Llego tarde (I arrive late)' },
            { pronoun: 'existir', form: 'to exist', english: 'Existo (I exist)' },
            { pronoun: 'morir', form: 'to die', english: 'Muere (he/she dies)' },
            { pronoun: 'nacer', form: 'to be born', english: 'Nace (he/she is born)' }
          ]
        }
      }
    ]
  },
  {
    title: 'Ditransitive Verbs',
    content: 'Some transitive verbs can take both a **direct object** and an **indirect object**. These are called ditransitive verbs.',
    examples: [
      {
        spanish: 'Le doy el libro a María.',
        english: 'I give the book to María.',
        highlight: ['Le', 'el libro', 'a María']
      },
      {
        spanish: 'Les envío cartas a mis amigos.',
        english: 'I send letters to my friends.',
        highlight: ['Les', 'cartas', 'a mis amigos']
      }
    ],
    subsections: [
      {
        title: 'Structure: Subject + Verb + Indirect Object + Direct Object',
        content: 'The indirect object (who receives) comes before the direct object (what is given/sent).',
        conjugationTable: {
          title: 'Common Ditransitive Verbs',
          conjugations: [
            { pronoun: 'dar', form: 'to give', english: 'Le doy dinero (I give him/her money)' },
            { pronoun: 'enviar', form: 'to send', english: 'Te envío fotos (I send you photos)' },
            { pronoun: 'mostrar', form: 'to show', english: 'Les muestro el camino (I show them the way)' },
            { pronoun: 'prestar', form: 'to lend', english: 'Me presta libros (he/she lends me books)' }
          ]
        }
      }
    ]
  },
  {
    title: 'Verbs That Can Be Both',
    content: 'Some Spanish verbs can function as either transitive or intransitive depending on the context.',
    examples: [
      {
        spanish: 'Como a las dos. (intransitive)',
        english: 'I eat at two o\'clock.',
        highlight: ['Como']
      },
      {
        spanish: 'Como una manzana. (transitive)',
        english: 'I eat an apple.',
        highlight: ['Como', 'una manzana']
      }
    ],
    subsections: [
      {
        title: 'Context-Dependent Verbs',
        content: 'These verbs change meaning or emphasis based on whether they have a direct object.',
        conjugationTable: {
          title: 'Flexible Verbs',
          conjugations: [
            { pronoun: 'comer', form: 'eat (intrans.)', english: 'Como bien (I eat well)' },
            { pronoun: 'comer', form: 'eat (trans.)', english: 'Como pan (I eat bread)' },
            { pronoun: 'cantar', form: 'sing (intrans.)', english: 'Canta bien (he/she sings well)' },
            { pronoun: 'cantar', form: 'sing (trans.)', english: 'Canta una canción (he/she sings a song)' }
          ]
        }
      }
    ]
  },
  {
    title: 'Practical Applications',
    content: 'Understanding transitive and intransitive verbs helps with pronoun placement, sentence structure, and meaning.',
    subsections: [
      {
        title: 'Key Points to Remember',
        content: '1. **Transitive verbs** need direct objects\n2. **Intransitive verbs** stand alone\n3. Use **personal "a"** with human direct objects\n4. **Indirect objects** use pronouns (le, les, me, te, nos)\n5. Some verbs can be **both** depending on context'
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Subjunctive Present', url: '/grammar/spanish/verbs/subjunctive-present', difficulty: 'advanced' },
  { title: 'Preterite Tense', url: '/grammar/spanish/verbs/preterite', difficulty: 'intermediate' },
  { title: 'Past Participles', url: '/grammar/spanish/verbs/past-participles', difficulty: 'intermediate' },
  { title: 'Gerunds', url: '/grammar/spanish/verbs/gerunds', difficulty: 'intermediate' }
];

export default function SpanishTransitiveIntransitivePage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Transitive and Intransitive Verbs',
            description: 'Learn the difference between transitive and intransitive verbs in Spanish, including direct objects, indirect objects, and verb classifications.',
            keywords: ['spanish transitive verbs', 'intransitive verbs', 'direct object', 'indirect object'],
            language: 'spanish',
            category: 'verbs',
            topic: 'transitive-intransitive'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="transitive-intransitive"
        title="Spanish Transitive and Intransitive Verbs"
        description="Learn the difference between transitive and intransitive verbs in Spanish, including direct objects, indirect objects, and verb classifications."
        difficulty="intermediate"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/transitive-intransitive/practice"
        quizUrl="/grammar/spanish/verbs/transitive-intransitive/quiz"
        songUrl="/songs/es?theme=grammar&topic=transitive-intransitive"
        youtubeVideoId="transitive-intransitive-spanish"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
