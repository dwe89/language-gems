import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'verb-valency',
  title: 'Spanish Verb Valency - Argument Structure and Complements',
  description: 'Learn Spanish verb valency including monovalent, bivalent, and trivalent verbs, argument structure, and complement patterns.',
  difficulty: 'advanced',
  keywords: ['spanish verb valency', 'argument structure', 'monovalent verbs', 'bivalent verbs', 'trivalent verbs', 'complements'],
  examples: ['Juan duerme', 'María lee libros', 'Pedro da regalos a Ana', 'Llueve']
});

const sections = [
  {
    title: 'Understanding Verb Valency',
    content: 'Verb valency (valencia verbal) refers to the number and type of arguments (complements) that a verb requires or allows. It determines the basic sentence structure and helps classify verbs by their syntactic behavior.',
    examples: [
      {
        spanish: 'Juan duerme.',
        english: 'Juan sleeps. (1 argument)',
        highlight: ['Juan', 'duerme']
      },
      {
        spanish: 'María lee libros.',
        english: 'María reads books. (2 arguments)',
        highlight: ['María', 'lee', 'libros']
      }
    ]
  },
  {
    title: 'Monovalent Verbs (Intransitive)',
    content: 'Monovalent verbs require only **one argument** - the subject. They express complete actions or states without needing objects.',
    examples: [
      {
        spanish: 'El bebé duerme.',
        english: 'The baby sleeps.',
        highlight: ['El bebé', 'duerme']
      },
      {
        spanish: 'Los pájaros vuelan.',
        english: 'The birds fly.',
        highlight: ['Los pájaros', 'vuelan']
      },
      {
        spanish: 'María sonríe.',
        english: 'María smiles.',
        highlight: ['María', 'sonríe']
      }
    ],
    subsections: [
      {
        title: 'Types of Monovalent Verbs',
        content: 'Different semantic categories of single-argument verbs.',
        conjugationTable: {
          title: 'Common Monovalent Verbs',
          conjugations: [
            { pronoun: 'Movement', form: 'correr, caminar, volar', english: 'to run, walk, fly' },
            { pronoun: 'States', form: 'existir, vivir, morir', english: 'to exist, live, die' },
            { pronoun: 'Actions', form: 'dormir, sonreír, llorar', english: 'to sleep, smile, cry' },
            { pronoun: 'Weather', form: 'llover, nevar, tronar', english: 'to rain, snow, thunder' },
            { pronoun: 'Reflexive', form: 'levantarse, ducharse', english: 'to get up, shower' }
          ]
        }
      },
      {
        title: 'Optional Complements',
        content: 'Monovalent verbs can take optional adverbial complements without changing their valency.',
        examples: [
          {
            spanish: 'Juan duerme profundamente.',
            english: 'Juan sleeps deeply.',
            highlight: ['profundamente']
          },
          {
            spanish: 'Los niños corren en el parque.',
            english: 'The children run in the park.',
            highlight: ['en el parque']
          }
        ]
      }
    ]
  },
  {
    title: 'Bivalent Verbs (Transitive)',
    content: 'Bivalent verbs require **two arguments** - a subject and a direct object. They express actions that affect or involve another entity.',
    examples: [
      {
        spanish: 'Ana lee un libro.',
        english: 'Ana reads a book.',
        highlight: ['Ana', 'lee', 'un libro']
      },
      {
        spanish: 'Los estudiantes estudian español.',
        english: 'The students study Spanish.',
        highlight: ['Los estudiantes', 'estudian', 'español']
      }
    ],
    subsections: [
      {
        title: 'Common Bivalent Verbs',
        content: 'Verbs that require both subject and direct object.',
        conjugationTable: {
          title: 'Bivalent Verb Categories',
          conjugations: [
            { pronoun: 'Creation', form: 'hacer, construir, escribir', english: 'to make, build, write' },
            { pronoun: 'Consumption', form: 'comer, beber, leer', english: 'to eat, drink, read' },
            { pronoun: 'Possession', form: 'tener, poseer, obtener', english: 'to have, possess, obtain' },
            { pronoun: 'Perception', form: 'ver, oír, sentir', english: 'to see, hear, feel' },
            { pronoun: 'Mental', form: 'pensar, creer, saber', english: 'to think, believe, know' }
          ]
        }
      },
      {
        title: 'Personal "A"',
        content: 'When the direct object is a person, use the preposition "a".',
        examples: [
          {
            spanish: 'Conozco a María.',
            english: 'I know María.',
            highlight: ['a María']
          },
          {
            spanish: 'Veo al profesor.',
            english: 'I see the teacher.',
            highlight: ['al profesor']
          }
        ]
      }
    ]
  },
  {
    title: 'Trivalent Verbs (Ditransitive)',
    content: 'Trivalent verbs require **three arguments** - subject, direct object, and indirect object. They express transfer or communication actions.',
    examples: [
      {
        spanish: 'Pedro da un regalo a Ana.',
        english: 'Pedro gives a gift to Ana.',
        highlight: ['Pedro', 'da', 'un regalo', 'a Ana']
      },
      {
        spanish: 'La profesora enseña matemáticas a los estudiantes.',
        english: 'The teacher teaches mathematics to the students.',
        highlight: ['La profesora', 'enseña', 'matemáticas', 'a los estudiantes']
      }
    ],
    subsections: [
      {
        title: 'Common Trivalent Verbs',
        content: 'Verbs that require subject, direct object, and indirect object.',
        conjugationTable: {
          title: 'Trivalent Verb Categories',
          conjugations: [
            { pronoun: 'Transfer', form: 'dar, entregar, enviar', english: 'to give, deliver, send' },
            { pronoun: 'Communication', form: 'decir, contar, explicar', english: 'to say, tell, explain' },
            { pronoun: 'Teaching', form: 'enseñar, mostrar, demostrar', english: 'to teach, show, demonstrate' },
            { pronoun: 'Commerce', form: 'vender, comprar, prestar', english: 'to sell, buy, lend' }
          ]
        }
      },
      {
        title: 'Pronoun Doubling',
        content: 'Indirect objects are often doubled with pronouns.',
        examples: [
          {
            spanish: 'Le doy el libro a María.',
            english: 'I give the book to María.',
            highlight: ['Le', 'a María']
          },
          {
            spanish: 'Les explico la lección a los estudiantes.',
            english: 'I explain the lesson to the students.',
            highlight: ['Les', 'a los estudiantes']
          }
        ]
      }
    ]
  },
  {
    title: 'Avalent Verbs (Impersonal)',
    content: 'Avalent verbs have **no arguments** - they don\'t require a subject. These are typically weather verbs or impersonal expressions.',
    examples: [
      {
        spanish: 'Llueve mucho.',
        english: 'It rains a lot.',
        highlight: ['Llueve']
      },
      {
        spanish: 'Nieva en las montañas.',
        english: 'It snows in the mountains.',
        highlight: ['Nieva']
      }
    ],
    subsections: [
      {
        title: 'Types of Avalent Verbs',
        content: 'Verbs that don\'t require any arguments.',
        conjugationTable: {
          title: 'Avalent Verb Categories',
          conjugations: [
            { pronoun: 'Weather', form: 'llover, nevar, granizar', english: 'to rain, snow, hail' },
            { pronoun: 'Time', form: 'amanecer, anochecer', english: 'to dawn, get dark' },
            { pronoun: 'Impersonal', form: 'bastar, convenir, importar', english: 'to be enough, suit, matter' }
          ]
        }
      }
    ]
  },
  {
    title: 'Valency Alternations',
    content: 'Some verbs can change their valency through different constructions, affecting meaning and argument structure.',
    examples: [
      {
        spanish: 'Juan come. (monovalent)',
        english: 'Juan eats.',
        highlight: ['Juan', 'come']
      },
      {
        spanish: 'Juan come una manzana. (bivalent)',
        english: 'Juan eats an apple.',
        highlight: ['Juan', 'come', 'una manzana']
      }
    ],
    subsections: [
      {
        title: 'Causative Alternations',
        content: 'Some verbs can be used both intransitively and transitively.',
        conjugationTable: {
          title: 'Valency Alternation Examples',
          conjugations: [
            { pronoun: 'romper', form: 'Se rompió / Rompió el vaso', english: 'It broke / He broke the glass' },
            { pronoun: 'abrir', form: 'Se abrió / Abrió la puerta', english: 'It opened / He opened the door' },
            { pronoun: 'mover', form: 'Se movió / Movió la mesa', english: 'It moved / He moved the table' }
          ]
        }
      },
      {
        title: 'Reflexive Constructions',
        content: 'Reflexive pronouns can change verb valency and meaning.',
        examples: [
          {
            spanish: 'Lavo la ropa. → Me lavo.',
            english: 'I wash clothes. → I wash myself.',
            highlight: ['Lavo', 'Me lavo']
          }
        ]
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' },
  { title: 'Preterite Tense', url: '/grammar/spanish/verbs/preterite', difficulty: 'intermediate' },
  { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect', difficulty: 'intermediate' },
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future', difficulty: 'intermediate' }
];

export default function SpanishVerbValencyPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Verb Valency - Argument Structure and Complements',
            description: 'Learn Spanish verb valency including monovalent, bivalent, and trivalent verbs, argument structure, and complement patterns.',
            keywords: ['spanish verb valency', 'argument structure', 'monovalent verbs', 'bivalent verbs', 'trivalent verbs'],
            language: 'spanish',
            category: 'verbs',
            topic: 'verb-valency'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="verb-valency"
        title="Spanish Verb Valency"
        description="Learn Spanish verb valency including monovalent, bivalent, and trivalent verbs, argument structure, and complement patterns."
        difficulty="advanced"
        estimatedTime={22}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/verb-valency/practice"
        quizUrl="/grammar/spanish/verbs/verb-valency/quiz"
        songUrl="/songs/es?theme=grammar&topic=verb-valency"
        youtubeVideoId="verb-valency-spanish"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
