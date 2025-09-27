import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'copular-verbs',
  title: 'Spanish Copular Verbs - Ser, Estar, and Linking Verbs',
  description: 'Master Spanish copular verbs including ser, estar, parecer, and other linking verbs that connect subjects with predicates.',
  difficulty: 'intermediate',
  keywords: ['spanish copular verbs', 'linking verbs', 'ser', 'estar', 'parecer', 'predicate', 'subject complement'],
  examples: ['Soy profesor', 'Está cansado', 'Parece inteligente', 'Se volvió famoso']
});

const sections = [
  {
    title: 'Understanding Copular Verbs',
    content: 'Copular verbs (verbos copulativos) are linking verbs that connect the subject with a **predicate** (noun, adjective, or phrase) that describes or identifies the subject. They don\'t express action but rather a state or relationship.',
    examples: [
      {
        spanish: 'María es doctora.',
        english: 'María is a doctor.',
        highlight: ['es', 'doctora']
      },
      {
        spanish: 'El café está caliente.',
        english: 'The coffee is hot.',
        highlight: ['está', 'caliente']
      }
    ]
  },
  {
    title: 'Ser - Essential Identity and Characteristics',
    content: 'The verb **ser** expresses **permanent characteristics**, **identity**, **origin**, **time**, and **essential qualities**.',
    examples: [
      {
        spanish: 'Soy estudiante de medicina.',
        english: 'I am a medical student.',
        highlight: ['Soy', 'estudiante']
      },
      {
        spanish: 'La mesa es de madera.',
        english: 'The table is made of wood.',
        highlight: ['es', 'de madera']
      },
      {
        spanish: 'Son las tres de la tarde.',
        english: 'It\'s three in the afternoon.',
        highlight: ['Son', 'las tres']
      }
    ],
    subsections: [
      {
        title: 'Uses of Ser',
        content: 'Ser connects subjects with essential or permanent characteristics.',
        conjugationTable: {
          title: 'Main Uses of Ser',
          conjugations: [
            { pronoun: 'Identity', form: 'Soy María', english: 'I am María' },
            { pronoun: 'Profession', form: 'Es médico', english: 'He is a doctor' },
            { pronoun: 'Nationality', form: 'Somos españoles', english: 'We are Spanish' },
            { pronoun: 'Material', form: 'Es de oro', english: 'It\'s made of gold' },
            { pronoun: 'Time', form: 'Son las dos', english: 'It\'s two o\'clock' },
            { pronoun: 'Personality', form: 'Es inteligente', english: 'He/She is intelligent' }
          ]
        }
      }
    ]
  },
  {
    title: 'Estar - States and Conditions',
    content: 'The verb **estar** expresses **temporary states**, **conditions**, **locations**, and **ongoing situations**.',
    examples: [
      {
        spanish: 'Estoy cansado después del trabajo.',
        english: 'I am tired after work.',
        highlight: ['Estoy', 'cansado']
      },
      {
        spanish: 'Los niños están en el parque.',
        english: 'The children are in the park.',
        highlight: ['están', 'en el parque']
      },
      {
        spanish: 'La comida está deliciosa.',
        english: 'The food is delicious.',
        highlight: ['está', 'deliciosa']
      }
    ],
    subsections: [
      {
        title: 'Uses of Estar',
        content: 'Estar connects subjects with temporary states or conditions.',
        conjugationTable: {
          title: 'Main Uses of Estar',
          conjugations: [
            { pronoun: 'Location', form: 'Está en casa', english: 'He/She is at home' },
            { pronoun: 'Temporary state', form: 'Estoy feliz', english: 'I am happy' },
            { pronoun: 'Condition', form: 'Está roto', english: 'It\'s broken' },
            { pronoun: 'Progressive', form: 'Está estudiando', english: 'He/She is studying' },
            { pronoun: 'Result', form: 'Está terminado', english: 'It\'s finished' },
            { pronoun: 'Weather', form: 'Está nublado', english: 'It\'s cloudy' }
          ]
        }
      }
    ]
  },
  {
    title: 'Parecer - Appearance and Opinion',
    content: 'The verb **parecer** expresses **appearance**, **seeming**, or **opinion**. It can be followed by adjectives, nouns, or clauses.',
    examples: [
      {
        spanish: 'Parece una persona amable.',
        english: 'He/She seems like a kind person.',
        highlight: ['Parece', 'una persona amable']
      },
      {
        spanish: 'Me parece interesante.',
        english: 'It seems interesting to me.',
        highlight: ['Me parece', 'interesante']
      },
      {
        spanish: 'Parece que va a llover.',
        english: 'It seems like it\'s going to rain.',
        highlight: ['Parece que', 'va a llover']
      }
    ],
    subsections: [
      {
        title: 'Constructions with Parecer',
        content: 'Different ways to use parecer as a copular verb.',
        conjugationTable: {
          title: 'Parecer Constructions',
          conjugations: [
            { pronoun: 'Appearance', form: 'Parece cansado', english: 'He seems tired' },
            { pronoun: 'Opinion', form: 'Me parece bien', english: 'It seems fine to me' },
            { pronoun: 'Resemblance', form: 'Parece su hermano', english: 'He looks like his brother' },
            { pronoun: 'Clause', form: 'Parece que llueve', english: 'It seems like it\'s raining' }
          ]
        }
      }
    ]
  },
  {
    title: 'Other Copular Verbs',
    content: 'Spanish has several other verbs that can function as copular verbs, connecting subjects with predicates.',
    examples: [
      {
        spanish: 'Se volvió famoso.',
        english: 'He became famous.',
        highlight: ['Se volvió', 'famoso']
      },
      {
        spanish: 'Permanece callado.',
        english: 'He remains quiet.',
        highlight: ['Permanece', 'callado']
      },
      {
        spanish: 'Resultó difícil.',
        english: 'It turned out difficult.',
        highlight: ['Resultó', 'difícil']
      }
    ],
    subsections: [
      {
        title: 'Change of State Verbs',
        content: 'These verbs express becoming or changing into a state.',
        conjugationTable: {
          title: 'Change of State Copular Verbs',
          conjugations: [
            { pronoun: 'volverse', form: 'se volvió rico', english: 'he became rich (gradual change)' },
            { pronoun: 'ponerse', form: 'se puso nervioso', english: 'he became nervous (sudden change)' },
            { pronoun: 'hacerse', form: 'se hizo médico', english: 'he became a doctor (effort)' },
            { pronoun: 'llegar a ser', form: 'llegó a ser famoso', english: 'he came to be famous (achievement)' },
            { pronoun: 'convertirse en', form: 'se convirtió en líder', english: 'he became a leader (transformation)' }
          ]
        }
      },
      {
        title: 'State Maintenance Verbs',
        content: 'These verbs express continuing in a state.',
        conjugationTable: {
          title: 'State Maintenance Copular Verbs',
          conjugations: [
            { pronoun: 'permanecer', form: 'permanece tranquilo', english: 'he remains calm' },
            { pronoun: 'seguir', form: 'sigue enfermo', english: 'he continues sick' },
            { pronoun: 'continuar', form: 'continúa preocupado', english: 'he continues worried' },
            { pronoun: 'mantenerse', form: 'se mantiene activo', english: 'he stays active' }
          ]
        }
      },
      {
        title: 'Result and Appearance Verbs',
        content: 'These verbs express results or appearances.',
        conjugationTable: {
          title: 'Result and Appearance Copular Verbs',
          conjugations: [
            { pronoun: 'resultar', form: 'resultó fácil', english: 'it turned out easy' },
            { pronoun: 'salir', form: 'salió caro', english: 'it turned out expensive' },
            { pronoun: 'quedar', form: 'quedó perfecto', english: 'it turned out perfect' },
            { pronoun: 'verse', form: 'se ve cansado', english: 'he looks tired' }
          ]
        }
      }
    ]
  },
  {
    title: 'Predicate Types',
    content: 'Copular verbs can be followed by different types of predicates that describe or identify the subject.',
    examples: [
      {
        spanish: 'Es profesor. (noun)',
        english: 'He is a teacher.',
        highlight: ['profesor']
      },
      {
        spanish: 'Está contento. (adjective)',
        english: 'He is happy.',
        highlight: ['contento']
      },
      {
        spanish: 'Está en casa. (prepositional phrase)',
        english: 'He is at home.',
        highlight: ['en casa']
      }
    ],
    subsections: [
      {
        title: 'Types of Predicates',
        content: 'Different grammatical forms that can serve as predicates.',
        conjugationTable: {
          title: 'Predicate Types with Copular Verbs',
          conjugations: [
            { pronoun: 'Noun', form: 'Es estudiante', english: 'He/She is a student' },
            { pronoun: 'Adjective', form: 'Está feliz', english: 'He/She is happy' },
            { pronoun: 'Prepositional phrase', form: 'Está de viaje', english: 'He/She is traveling' },
            { pronoun: 'Past participle', form: 'Está terminado', english: 'It is finished' },
            { pronoun: 'Adverb', form: 'Está bien', english: 'He/She is well' }
          ]
        }
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Reflexive Verbs', url: '/grammar/spanish/verbs/reflexive', difficulty: 'intermediate' },
  { title: 'Gerunds', url: '/grammar/spanish/verbs/gerunds', difficulty: 'intermediate' },
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future', difficulty: 'intermediate' },
  { title: 'Stem-changing Verbs', url: '/grammar/spanish/verbs/stem-changing', difficulty: 'intermediate' }
];

export default function SpanishCopularVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Copular Verbs - Ser, Estar, and Linking Verbs',
            description: 'Master Spanish copular verbs including ser, estar, parecer, and other linking verbs that connect subjects with predicates.',
            keywords: ['spanish copular verbs', 'linking verbs', 'ser', 'estar', 'parecer', 'predicate'],
            language: 'spanish',
            category: 'verbs',
            topic: 'copular-verbs'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="copular-verbs"
        title="Spanish Copular Verbs"
        description="Master Spanish copular verbs including ser, estar, parecer, and other linking verbs that connect subjects with predicates."
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/copular-verbs/practice"
        quizUrl="/grammar/spanish/verbs/copular-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=copular-verbs"
        youtubeVideoId="copular-verbs-spanish"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
