import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'voice-constructions',
  title: 'Spanish Voice Constructions - Active vs Passive Voice',
  description: 'Master Spanish voice constructions including active voice, passive voice with ser, reflexive passive, and impersonal constructions.',
  difficulty: 'intermediate',
  keywords: ['spanish voice', 'active voice', 'passive voice', 'ser passive', 'reflexive passive', 'impersonal constructions'],
  examples: ['La casa fue construida por Juan', 'Se venden casas', 'Se dice que...']
});

const sections = [
  {
    title: 'Understanding Spanish Voice Constructions',
    content: 'Spanish voice constructions allow speakers to change the focus of a sentence by emphasizing different elements. The main types are **active voice**, **passive voice**, **reflexive passive**, and **impersonal constructions**.',
    examples: [
      {
        spanish: 'Juan construyó la casa.',
        english: 'Juan built the house. (Active)',
        highlight: ['Juan', 'construyó']
      },
      {
        spanish: 'La casa fue construida por Juan.',
        english: 'The house was built by Juan. (Passive)',
        highlight: ['fue construida', 'por Juan']
      }
    ]
  },
  {
    title: 'Active Voice (Voz Activa)',
    content: 'In active voice, the subject performs the action directly. This is the most common construction in Spanish.',
    examples: [
      {
        spanish: 'Los estudiantes estudian español.',
        english: 'The students study Spanish.',
        highlight: ['estudiantes', 'estudian']
      },
      {
        spanish: 'María escribió una carta.',
        english: 'María wrote a letter.',
        highlight: ['María', 'escribió']
      }
    ]
  },
  {
    title: 'Passive Voice with Ser (Voz Pasiva)',
    content: 'The passive voice with **ser** + past participle emphasizes the action rather than who performs it. The agent (who performs the action) is introduced with **por**.',
    examples: [
      {
        spanish: 'El libro fue escrito por García Márquez.',
        english: 'The book was written by García Márquez.',
        highlight: ['fue escrito', 'por García Márquez']
      },
      {
        spanish: 'Las ventanas fueron abiertas por el viento.',
        english: 'The windows were opened by the wind.',
        highlight: ['fueron abiertas', 'por el viento']
      }
    ],
    subsections: [
      {
        title: 'Formation',
        content: 'Passive voice = **ser** (conjugated) + **past participle** + **por** + agent',
        conjugationTable: {
          title: 'Passive Voice Formation',
          conjugations: [
            { pronoun: 'Present', form: 'es/son + past participle', english: 'is/are + past participle' },
            { pronoun: 'Preterite', form: 'fue/fueron + past participle', english: 'was/were + past participle' },
            { pronoun: 'Imperfect', form: 'era/eran + past participle', english: 'was/were being + past participle' },
            { pronoun: 'Future', form: 'será/serán + past participle', english: 'will be + past participle' }
          ]
        }
      }
    ]
  },
  {
    title: 'Reflexive Passive (Pasiva Refleja)',
    content: 'The reflexive passive uses **se** + third person verb. This construction is very common in Spanish and doesn\'t mention the agent.',
    examples: [
      {
        spanish: 'Se venden casas.',
        english: 'Houses are sold / Houses for sale.',
        highlight: ['Se venden']
      },
      {
        spanish: 'Se habla español aquí.',
        english: 'Spanish is spoken here.',
        highlight: ['Se habla']
      },
      {
        spanish: 'Se construyeron muchos edificios.',
        english: 'Many buildings were built.',
        highlight: ['Se construyeron']
      }
    ]
  },
  {
    title: 'Impersonal Constructions',
    content: 'Impersonal constructions with **se** express general statements without specifying who performs the action.',
    examples: [
      {
        spanish: 'Se dice que va a llover.',
        english: 'It is said that it\'s going to rain.',
        highlight: ['Se dice']
      },
      {
        spanish: 'Se cree que es verdad.',
        english: 'It is believed to be true.',
        highlight: ['Se cree']
      },
      {
        spanish: 'Se sabe que estudia mucho.',
        english: 'It is known that he/she studies a lot.',
        highlight: ['Se sabe']
      }
    ]
  },
  {
    title: 'Usage Guidelines',
    content: 'Choose the appropriate voice construction based on what you want to emphasize and the level of formality.',
    subsections: [
      {
        title: 'When to Use Each Construction',
        content: '**Active voice**: Most common, direct action\n**Passive with ser**: Formal writing, emphasis on action\n**Reflexive passive**: Common in signs, advertisements\n**Impersonal se**: General statements, rumors'
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' },
  { title: 'Irregular Verbs', url: '/grammar/spanish/verbs/irregular-verbs', difficulty: 'intermediate' },
  { title: 'Ser vs Estar', url: '/grammar/spanish/verbs/ser-vs-estar', difficulty: 'beginner' },
  { title: 'Subjunctive Imperfect', url: '/grammar/spanish/verbs/subjunctive-imperfect', difficulty: 'advanced' }
];

export default function SpanishVoiceConstructionsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Voice Constructions - Active vs Passive Voice',
            description: 'Master Spanish voice constructions including active voice, passive voice with ser, reflexive passive, and impersonal constructions.',
            keywords: ['spanish voice', 'active voice', 'passive voice', 'ser passive', 'reflexive passive'],
            language: 'spanish',
            category: 'verbs',
            topic: 'voice-constructions'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="voice-constructions"
        title="Spanish Voice Constructions"
        description="Master Spanish voice constructions including active voice, passive voice with ser, reflexive passive, and impersonal constructions."
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/voice-constructions/practice"
        quizUrl="/grammar/spanish/verbs/voice-constructions/quiz"
        songUrl="/songs/es?theme=grammar&topic=voice-constructions"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
