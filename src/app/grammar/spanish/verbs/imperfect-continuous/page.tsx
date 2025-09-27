import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'imperfect-continuous',
  title: 'Spanish Imperfect Continuous',
  description: 'Master the Spanish imperfect continuous tense (estaba + gerund). Learn formation, usage, and examples.',
  difficulty: 'intermediate',
  keywords: [
    'spanish imperfect continuous',
    'estaba gerund',
    'spanish past continuous',
    'imperfecto continuo',
    'spanish progressive past',
    'spanish grammar tenses'
  ]
});

const grammarData = {
  title: "Spanish Imperfect Continuous Tense",
  description: "Learn how to form and use the Spanish imperfect continuous tense to express ongoing actions in the past.",
  
  sections: [
    {
      title: "Formation",
      content: "The Spanish imperfect continuous is formed with the imperfect tense of estar + gerund (present participle).",
      subsections: [
        {
          title: "Estar in Imperfect",
          content: "Imperfect tense forms of the auxiliary verb estar:",
          examples: [
            { spanish: "yo estaba", english: "I was" },
            { spanish: "tú estabas", english: "you were" },
            { spanish: "él/ella/usted estaba", english: "he/she/you were" },
            { spanish: "nosotros/as estábamos", english: "we were" },
            { spanish: "vosotros/as estabais", english: "you all were" },
            { spanish: "ellos/ellas/ustedes estaban", english: "they/you all were" }
          ]
        },
        {
          title: "Gerund Formation",
          content: "Regular gerunds are formed by adding endings to the verb stem:",
          examples: [
            { spanish: "-ar verbs: -ando", english: "hablar → hablando (speaking)" },
            { spanish: "-er verbs: -iendo", english: "comer → comiendo (eating)" },
            { spanish: "-ir verbs: -iendo", english: "vivir → viviendo (living)" }
          ]
        },
        {
          title: "Irregular Gerunds",
          content: "Some verbs have irregular gerund forms:",
          examples: [
            { spanish: "leer → leyendo", english: "reading" },
            { spanish: "oír → oyendo", english: "hearing" },
            { spanish: "caer → cayendo", english: "falling" },
            { spanish: "ir → yendo", english: "going" },
            { spanish: "poder → pudiendo", english: "being able" },
            { spanish: "venir → viniendo", english: "coming" },
            { spanish: "decir → diciendo", english: "saying" },
            { spanish: "dormir → durmiendo", english: "sleeping" },
            { spanish: "morir → muriendo", english: "dying" }
          ]
        }
      ]
    },
    {
      title: "Usage",
      content: "The imperfect continuous describes actions that were in progress at a specific time in the past.",
      subsections: [
        {
          title: "Ongoing Past Actions",
          content: "Actions that were happening at a specific moment in the past:",
          examples: [
            { spanish: "Estaba estudiando cuando llegaste.", english: "I was studying when you arrived." },
            { spanish: "¿Qué estabas haciendo ayer a las ocho?", english: "What were you doing yesterday at eight?" },
            { spanish: "Estábamos cenando cuando sonó el teléfono.", english: "We were having dinner when the phone rang." }
          ]
        },
        {
          title: "Interrupted Actions",
          content: "Actions that were interrupted by another action in the past:",
          examples: [
            { spanish: "Estaba durmiendo cuando empezó la tormenta.", english: "I was sleeping when the storm started." },
            { spanish: "Los niños estaban jugando cuando comenzó a llover.", english: "The children were playing when it started to rain." },
            { spanish: "Estábamos viendo la televisión cuando se fue la luz.", english: "We were watching TV when the power went out." }
          ]
        },
        {
          title: "Parallel Past Actions",
          content: "Two or more actions happening simultaneously in the past:",
          examples: [
            { spanish: "Mientras yo estaba cocinando, él estaba limpiando.", english: "While I was cooking, he was cleaning." },
            { spanish: "Estaba lloviendo y estábamos corriendo.", english: "It was raining and we were running." },
            { spanish: "Los estudiantes estaban escribiendo mientras el profesor estaba explicando.", english: "The students were writing while the teacher was explaining." }
          ]
        }
      ]
    },
    {
      title: "Time Expressions",
      content: "Common time expressions used with the imperfect continuous:",
      subsections: [
        {
          title: "Common Time Markers",
          content: "Expressions that typically accompany the imperfect continuous:",
          examples: [
            { spanish: "mientras", english: "while" },
            { spanish: "cuando", english: "when" },
            { spanish: "a las... (time)", english: "at... (time)" },
            { spanish: "ayer a las...", english: "yesterday at..." },
            { spanish: "anoche", english: "last night" },
            { spanish: "el otro día", english: "the other day" },
            { spanish: "en ese momento", english: "at that moment" },
            { spanish: "durante", english: "during" },
            { spanish: "todo el día", english: "all day" },
            { spanish: "toda la mañana", english: "all morning" }
          ]
        }
      ]
    },
    {
      title: "Examples in Context",
      content: "See how the imperfect continuous is used in real situations:",
      subsections: [
        {
          title: "Everyday Conversations",
          content: "Common uses in daily speech:",
          examples: [
            { spanish: "¿Qué estabas haciendo cuando te llamé?", english: "What were you doing when I called you?" },
            { spanish: "Estaba pensando en ti.", english: "I was thinking about you." },
            { spanish: "Los niños estaban durmiendo cuando llegamos.", english: "The children were sleeping when we arrived." },
            { spanish: "Estábamos esperando el autobús cuando empezó a nevar.", english: "We were waiting for the bus when it started to snow." },
            { spanish: "¿Estabas trabajando ayer por la tarde?", english: "Were you working yesterday afternoon?" }
          ]
        }
      ]
    }
  ],

  youtubeVideoId: ""
};

export default function SpanishImperfectContinuousPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'imperfect-continuous',
              title: 'Spanish Imperfect Continuous',
              description: 'Master the Spanish imperfect continuous tense (estaba + gerund) with comprehensive explanations and examples',
              difficulty: 'intermediate',
              estimatedTime: 20
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'imperfect-continuous',
              title: 'Spanish Imperfect Continuous'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="imperfect-continuous"
        title="Spanish Imperfect Continuous"
        description="Master the Spanish imperfect continuous tense (estaba + gerund) with comprehensive explanations and examples"
        difficulty="intermediate"
        estimatedTime={20}
        sections={grammarData.sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/imperfect-continuous/practice"
        quizUrl="/grammar/spanish/verbs/imperfect-continuous/quiz"
        songUrl="/songs/es?theme=grammar&topic=imperfect-continuous"
        youtubeVideoId={grammarData.youtubeVideoId}
        relatedTopics={[
          { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect' },
          { title: 'Present Continuous', url: '/grammar/spanish/verbs/present-continuous' },
          { title: 'Preterite Tense', url: '/grammar/spanish/verbs/preterite' }
        ]}
      />
    </>
  );
}
