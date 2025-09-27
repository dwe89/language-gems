import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'verb-complementation',
  title: 'Spanish Verb Complementation - Argument Structure and Complements',
  description: 'Learn Spanish verb complementation including direct objects, indirect objects, prepositional complements, and clausal complements.',
  difficulty: 'advanced',
  keywords: ['spanish verb complementation', 'direct objects', 'indirect objects', 'prepositional complements', 'clausal complements', 'argument structure'],
  examples: ['Le doy el libro a María', 'Pienso que tienes razón', 'Confío en ti', 'Me alegro de verte']
});

const sections = [
  {
    title: 'Understanding Verb Complementation',
    content: 'Verb complementation refers to the **types of complements** that verbs can take to complete their meaning. Spanish verbs can take various types of complements including direct objects, indirect objects, prepositional phrases, and clauses.',
    examples: [
      {
        spanish: 'María lee libros. (direct object)',
        english: 'María reads books.',
        highlight: ['libros']
      },
      {
        spanish: 'Le doy flores a mi madre. (indirect + direct object)',
        english: 'I give flowers to my mother.',
        highlight: ['Le', 'flores', 'a mi madre']
      }
    ]
  },
  {
    title: 'Direct Object Complements',
    content: 'Direct objects are **noun phrases** that receive the action of transitive verbs directly.',
    examples: [
      {
        spanish: 'Compré una casa nueva.',
        english: 'I bought a new house.',
        highlight: ['una casa nueva']
      },
      {
        spanish: 'Veo a mi hermano.',
        english: 'I see my brother.',
        highlight: ['a mi hermano']
      },
      {
        spanish: 'Estudia medicina en la universidad.',
        english: 'He studies medicine at university.',
        highlight: ['medicina']
      }
    ],
    subsections: [
      {
        title: 'Personal "A" with Direct Objects',
        content: 'When the direct object is a person or personified entity, use "a".',
        conjugationTable: {
          title: 'Direct Object Patterns',
          conjugations: [
            { pronoun: 'Thing', form: 'Veo la casa', english: 'I see the house' },
            { pronoun: 'Person', form: 'Veo a María', english: 'I see María' },
            { pronoun: 'Pet', form: 'Busco a mi perro', english: 'I\'m looking for my dog' },
            { pronoun: 'Indefinite person', form: 'Necesito a alguien', english: 'I need someone' },
            { pronoun: 'Personified', form: 'Amo a mi país', english: 'I love my country' },
            { pronoun: 'Collective person', form: 'Conozco a la familia', english: 'I know the family' }
          ]
        }
      }
    ]
  },
  {
    title: 'Indirect Object Complements',
    content: 'Indirect objects indicate **to whom** or **for whom** an action is performed. They are often doubled with pronouns.',
    examples: [
      {
        spanish: 'Le escribo una carta a mi abuela.',
        english: 'I write a letter to my grandmother.',
        highlight: ['Le', 'a mi abuela']
      },
      {
        spanish: 'Les compré regalos a los niños.',
        english: 'I bought gifts for the children.',
        highlight: ['Les', 'a los niños']
      },
      {
        spanish: 'Me duele la cabeza.',
        english: 'My head hurts (to me).',
        highlight: ['Me']
      }
    ],
    subsections: [
      {
        title: 'Indirect Object Doubling',
        content: 'Indirect objects are typically doubled with pronouns.',
        conjugationTable: {
          title: 'Indirect Object Patterns',
          conjugations: [
            { pronoun: 'me', form: 'Me da dinero (a mí)', english: 'gives money to me' },
            { pronoun: 'te', form: 'Te compro flores (a ti)', english: 'buys flowers for you' },
            { pronoun: 'le', form: 'Le escribo (a él/ella)', english: 'writes to him/her' },
            { pronoun: 'nos', form: 'Nos explica (a nosotros)', english: 'explains to us' },
            { pronoun: 'os', form: 'Os doy consejos (a vosotros)', english: 'gives advice to you all' },
            { pronoun: 'les', form: 'Les enseña (a ellos)', english: 'teaches them' }
          ]
        }
      }
    ]
  },
  {
    title: 'Prepositional Complements',
    content: 'Many verbs require **specific prepositions** to introduce their complements.',
    examples: [
      {
        spanish: 'Confío en mis amigos.',
        english: 'I trust my friends.',
        highlight: ['en mis amigos']
      },
      {
        spanish: 'Hablamos de política.',
        english: 'We talk about politics.',
        highlight: ['de política']
      },
      {
        spanish: 'Sueña con ser famoso.',
        english: 'He dreams of being famous.',
        highlight: ['con ser famoso']
      }
    ],
    subsections: [
      {
        title: 'Common Prepositional Complements',
        content: 'Verbs with their required prepositions.',
        conjugationTable: {
          title: 'Prepositional Complement Patterns',
          conjugations: [
            { pronoun: 'DE', form: 'hablar de, tratar de, acordarse de', english: 'talk about, try to, remember' },
            { pronoun: 'A', form: 'ir a, venir a, aprender a', english: 'go to, come to, learn to' },
            { pronoun: 'EN', form: 'pensar en, confiar en, insistir en', english: 'think about, trust in, insist on' },
            { pronoun: 'CON', form: 'soñar con, contar con, casarse con', english: 'dream of, count on, marry' },
            { pronoun: 'POR', form: 'preguntar por, luchar por, optar por', english: 'ask about, fight for, opt for' },
            { pronoun: 'PARA', form: 'servir para, estudiar para, trabajar para', english: 'serve for, study for, work for' }
          ]
        }
      }
    ]
  },
  {
    title: 'Infinitive Complements',
    content: 'Many verbs take **infinitive complements** either directly or with prepositions.',
    examples: [
      {
        spanish: 'Quiero estudiar medicina.',
        english: 'I want to study medicine.',
        highlight: ['estudiar medicina']
      },
      {
        spanish: 'Empezó a llover.',
        english: 'It started to rain.',
        highlight: ['a llover']
      },
      {
        spanish: 'Dejó de fumar.',
        english: 'He stopped smoking.',
        highlight: ['de fumar']
      }
    ],
    subsections: [
      {
        title: 'Infinitive Complement Patterns',
        content: 'Different patterns for infinitive complements.',
        conjugationTable: {
          title: 'Infinitive Complement Types',
          conjugations: [
            { pronoun: 'Direct infinitive', form: 'querer estudiar', english: 'want to study' },
            { pronoun: 'A + infinitive', form: 'empezar a trabajar', english: 'start to work' },
            { pronoun: 'DE + infinitive', form: 'dejar de fumar', english: 'stop smoking' },
            { pronoun: 'EN + infinitive', form: 'insistir en ir', english: 'insist on going' },
            { pronoun: 'CON + infinitive', form: 'soñar con viajar', english: 'dream of traveling' },
            { pronoun: 'POR + infinitive', form: 'luchar por conseguir', english: 'fight to achieve' }
          ]
        }
      }
    ]
  },
  {
    title: 'Clausal Complements',
    content: 'Verbs can take **finite clauses** as complements, often introduced by "que".',
    examples: [
      {
        spanish: 'Creo que tienes razón.',
        english: 'I think you\'re right.',
        highlight: ['que tienes razón']
      },
      {
        spanish: 'Espero que vengas mañana.',
        english: 'I hope you come tomorrow.',
        highlight: ['que vengas mañana']
      },
      {
        spanish: 'Me alegro de que estés aquí.',
        english: 'I\'m glad you\'re here.',
        highlight: ['de que estés aquí']
      }
    ],
    subsections: [
      {
        title: 'Indicative vs Subjunctive Complements',
        content: 'Different verbs require different moods in their clausal complements.',
        conjugationTable: {
          title: 'Clausal Complement Patterns',
          conjugations: [
            { pronoun: 'Indicative', form: 'Creo que viene', english: 'I think he\'s coming' },
            { pronoun: 'Subjunctive', form: 'Espero que venga', english: 'I hope he comes' },
            { pronoun: 'DE + subjunctive', form: 'Me alegro de que vengas', english: 'I\'m glad you\'re coming' },
            { pronoun: 'A + subjunctive', form: 'Te obligo a que estudies', english: 'I force you to study' },
            { pronoun: 'EN + subjunctive', form: 'Insisto en que vengas', english: 'I insist that you come' },
            { pronoun: 'CON + subjunctive', form: 'Sueño con que me visites', english: 'I dream that you visit me' }
          ]
        }
      }
    ]
  },
  {
    title: 'Complex Complementation',
    content: 'Some verbs can take **multiple complements** simultaneously.',
    examples: [
      {
        spanish: 'Le dije a María que viniera.',
        english: 'I told María to come.',
        highlight: ['Le', 'a María', 'que viniera']
      },
      {
        spanish: 'Les enseño español a los estudiantes.',
        english: 'I teach Spanish to the students.',
        highlight: ['Les', 'español', 'a los estudiantes']
      },
      {
        spanish: 'Me pidió que le ayudara con la tarea.',
        english: 'He asked me to help him with homework.',
        highlight: ['Me', 'que le ayudara']
      }
    ],
    subsections: [
      {
        title: 'Multiple Complement Patterns',
        content: 'Verbs taking multiple types of complements.',
        conjugationTable: {
          title: 'Complex Complementation Examples',
          conjugations: [
            { pronoun: 'IO + DO + PP', form: 'Le doy flores a María', english: 'I give flowers to María' },
            { pronoun: 'IO + Clause', form: 'Le digo que venga', english: 'I tell him to come' },
            { pronoun: 'DO + PP', form: 'Pongo el libro en la mesa', english: 'I put the book on the table' },
            { pronoun: 'IO + DO + Clause', form: 'Le enseño español que es fácil', english: 'I teach him Spanish which is easy' },
            { pronoun: 'Reflexive + PP', form: 'Me acuerdo de ti', english: 'I remember you' },
            { pronoun: 'IO + Infinitive', form: 'Le ayudo a estudiar', english: 'I help him study' }
          ]
        }
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' },
  { title: 'Gerunds', url: '/grammar/spanish/verbs/gerunds', difficulty: 'intermediate' },
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future', difficulty: 'intermediate' },
  { title: 'Por vs Para', url: '/grammar/spanish/verbs/por-vs-para', difficulty: 'intermediate' }
];

export default function SpanishVerbComplementationPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Verb Complementation - Argument Structure and Complements',
            description: 'Learn Spanish verb complementation including direct objects, indirect objects, prepositional complements, and clausal complements.',
            keywords: ['spanish verb complementation', 'direct objects', 'indirect objects', 'prepositional complements'],
            language: 'spanish',
            category: 'verbs',
            topic: 'verb-complementation'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="verb-complementation"
        title="Spanish Verb Complementation"
        description="Learn Spanish verb complementation including direct objects, indirect objects, prepositional complements, and clausal complements."
        difficulty="advanced"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/verb-complementation/practice"
        quizUrl="/grammar/spanish/verbs/verb-complementation/quiz"
        songUrl="/songs/es?theme=grammar&topic=verb-complementation"
        youtubeVideoId="verb-complementation-spanish"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
