import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'defective-verbs',
  title: 'Spanish Defective Verbs - Incomplete Conjugation Patterns',
  description: 'Learn Spanish defective verbs that lack certain forms, including weather verbs, impersonal verbs, and verbs with limited conjugations.',
  difficulty: 'advanced',
  keywords: ['spanish defective verbs', 'incomplete verbs', 'weather verbs', 'impersonal verbs', 'soler', 'abolir'],
  examples: ['Llueve mucho', 'Suele llegar tarde', 'Atañe a todos', 'Graniza en invierno']
});

const sections = [
  {
    title: 'Understanding Spanish Defective Verbs',
    content: 'Defective verbs (verbos defectivos) are verbs that lack certain forms in their conjugation. They cannot be conjugated in all persons, tenses, or moods due to semantic, phonetic, or historical reasons.',
    examples: [
      {
        spanish: 'Llueve todos los días.',
        english: 'It rains every day.',
        highlight: ['Llueve']
      },
      {
        spanish: 'Suele estudiar por las noches.',
        english: 'He/She usually studies at night.',
        highlight: ['Suele']
      }
    ]
  },
  {
    title: 'Weather Verbs (Verbos Meteorológicos)',
    content: 'Weather verbs are typically used only in the third person singular because weather phenomena don\'t have a specific agent performing the action.',
    examples: [
      {
        spanish: 'Nieva en las montañas.',
        english: 'It snows in the mountains.',
        highlight: ['Nieva']
      },
      {
        spanish: 'Granizó ayer por la tarde.',
        english: 'It hailed yesterday afternoon.',
        highlight: ['Granizó']
      },
      {
        spanish: 'Truena mucho durante la tormenta.',
        english: 'It thunders a lot during the storm.',
        highlight: ['Truena']
      }
    ],
    subsections: [
      {
        title: 'Common Weather Verbs',
        content: 'These verbs are primarily used in third person singular forms.',
        conjugationTable: {
          title: 'Weather Verbs - Third Person Only',
          conjugations: [
            { pronoun: 'llover', form: 'llueve', english: 'it rains' },
            { pronoun: 'nevar', form: 'nieva', english: 'it snows' },
            { pronoun: 'granizar', form: 'graniza', english: 'it hails' },
            { pronoun: 'tronar', form: 'truena', english: 'it thunders' },
            { pronoun: 'relampaguear', form: 'relampaguea', english: 'it lightnings' },
            { pronoun: 'escampar', form: 'escampa', english: 'it clears up' }
          ]
        }
      },
      {
        title: 'Metaphorical Uses',
        content: 'Some weather verbs can be used metaphorically with other subjects.',
        examples: [
          {
            spanish: 'Le llueven las ofertas de trabajo.',
            english: 'Job offers are raining down on him/her.',
            highlight: ['llueven']
          },
          {
            spanish: 'Los problemas granizaron sobre él.',
            english: 'Problems hailed down on him.',
            highlight: ['granizaron']
          }
        ]
      }
    ]
  },
  {
    title: 'Soler - Habitual Action Verb',
    content: 'The verb **soler** (to usually do) is defective and only exists in present and imperfect tenses. It expresses habitual or customary actions.',
    examples: [
      {
        spanish: 'Suelo levantarme temprano.',
        english: 'I usually get up early.',
        highlight: ['Suelo']
      },
      {
        spanish: 'Solía vivir en Madrid.',
        english: 'I used to live in Madrid.',
        highlight: ['Solía']
      }
    ],
    subsections: [
      {
        title: 'Soler Conjugation',
        content: 'Only present and imperfect tenses exist for soler.',
        conjugationTable: {
          title: 'Soler - Present and Imperfect Only',
          conjugations: [
            { pronoun: 'yo', form: 'suelo / solía', english: 'I usually / I used to' },
            { pronoun: 'tú', form: 'sueles / solías', english: 'you usually / you used to' },
            { pronoun: 'él/ella/usted', form: 'suele / solía', english: 'he/she/you usually / used to' },
            { pronoun: 'nosotros', form: 'solemos / solíamos', english: 'we usually / we used to' },
            { pronoun: 'vosotros', form: 'soléis / solíais', english: 'you all usually / you all used to' },
            { pronoun: 'ellos/ellas/ustedes', form: 'suelen / solían', english: 'they/you all usually / used to' }
          ]
        }
      }
    ]
  },
  {
    title: 'Verbs with Limited Forms',
    content: 'Some verbs exist only in certain persons or have very restricted usage due to their meaning or phonetic difficulties.',
    examples: [
      {
        spanish: 'Este asunto atañe a todos.',
        english: 'This matter concerns everyone.',
        highlight: ['atañe']
      },
      {
        spanish: 'Los gastos ascienden a mil euros.',
        english: 'The expenses amount to a thousand euros.',
        highlight: ['ascienden']
      }
    ],
    subsections: [
      {
        title: 'Atañer - To Concern',
        content: 'Used primarily in third person forms.',
        conjugationTable: {
          title: 'Atañer - Limited Forms',
          conjugations: [
            { pronoun: 'Third person singular', form: 'atañe', english: 'it concerns' },
            { pronoun: 'Third person plural', form: 'atañen', english: 'they concern' },
            { pronoun: 'Gerund', form: 'atañendo', english: 'concerning' },
            { pronoun: 'Past participle', form: 'atañido', english: 'concerned' }
          ]
        }
      },
      {
        title: 'Abolir - To Abolish',
        content: 'Missing forms where the stem would end in a consonant + "o" or "a".',
        conjugationTable: {
          title: 'Abolir - Missing Forms',
          conjugations: [
            { pronoun: 'yo', form: '(no existe)', english: '(doesn\'t exist)' },
            { pronoun: 'tú', form: 'aboles', english: 'you abolish' },
            { pronoun: 'él/ella/usted', form: '(no existe)', english: '(doesn\'t exist)' },
            { pronoun: 'nosotros', form: 'abolimos', english: 'we abolish' },
            { pronoun: 'vosotros', form: 'abolís', english: 'you all abolish' },
            { pronoun: 'ellos/ellas/ustedes', form: 'abolen', english: 'they/you all abolish' }
          ]
        }
      }
    ]
  },
  {
    title: 'Impersonal Expressions',
    content: 'Some verbs are used only in impersonal constructions, typically in third person singular.',
    examples: [
      {
        spanish: 'Conviene estudiar más.',
        english: 'It\'s advisable to study more.',
        highlight: ['Conviene']
      },
      {
        spanish: 'Basta con intentarlo.',
        english: 'It\'s enough to try.',
        highlight: ['Basta']
      }
    ],
    subsections: [
      {
        title: 'Common Impersonal Verbs',
        content: 'These verbs are typically used only in third person singular.',
        conjugationTable: {
          title: 'Impersonal Expressions',
          conjugations: [
            { pronoun: 'convenir', form: 'conviene', english: 'it\'s advisable' },
            { pronoun: 'bastar', form: 'basta', english: 'it\'s enough' },
            { pronoun: 'urgir', form: 'urge', english: 'it\'s urgent' },
            { pronoun: 'importar', form: 'importa', english: 'it matters' },
            { pronoun: 'ocurrir', form: 'ocurre', english: 'it happens' },
            { pronoun: 'suceder', form: 'sucede', english: 'it happens' }
          ]
        }
      }
    ]
  },
  {
    title: 'Usage and Alternatives',
    content: 'When defective verbs lack needed forms, Spanish speakers use alternative expressions or synonyms.',
    examples: [
      {
        spanish: 'No puedo "abolir" → No puedo suprimir',
        english: 'I can\'t "abolish" → I can\'t suppress',
        highlight: ['suprimir']
      },
      {
        spanish: 'Quiero que "llueva" → Quiero que caiga lluvia',
        english: 'I want it to "rain" → I want rain to fall',
        highlight: ['caiga lluvia']
      }
    ],
    subsections: [
      {
        title: 'Workarounds for Missing Forms',
        content: '1. **Use synonyms** with complete conjugations\n2. **Rephrase with complete verbs**\n3. **Use periphrastic constructions**\n4. **Employ impersonal expressions**'
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Modal Verbs', url: '/grammar/spanish/verbs/modal-verbs', difficulty: 'intermediate' },
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future', difficulty: 'intermediate' },
  { title: 'Present Perfect', url: '/grammar/spanish/verbs/present-perfect', difficulty: 'intermediate' },
  { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect', difficulty: 'intermediate' }
];

export default function SpanishDefectiveVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Defective Verbs - Incomplete Conjugation Patterns',
            description: 'Learn Spanish defective verbs that lack certain forms, including weather verbs, impersonal verbs, and verbs with limited conjugations.',
            keywords: ['spanish defective verbs', 'incomplete verbs', 'weather verbs', 'impersonal verbs'],
            language: 'spanish',
            category: 'verbs',
            topic: 'defective-verbs',
            difficulty: 'advanced'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="defective-verbs"
        title="Spanish Defective Verbs"
        description="Learn Spanish defective verbs that lack certain forms, including weather verbs, impersonal verbs, and verbs with limited conjugations."
        difficulty="advanced"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/defective-verbs/practice"
        quizUrl="/grammar/spanish/verbs/defective-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=defective-verbs"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
