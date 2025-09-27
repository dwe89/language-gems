import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = {
  title: 'Spanish Present Continuous (estar + gerund) | LanguageGems',
  description: 'Master the Spanish present continuous tense with estar + gerund. Learn formation, usage, and when to use ongoing actions.',
  keywords: 'Spanish present continuous, estar gerund, Spanish progressive tense, ongoing actions Spanish, Spanish grammar',
  openGraph: {
    title: 'Spanish Present Continuous (estar + gerund) | LanguageGems',
    description: 'Master the Spanish present continuous tense with estar + gerund. Learn formation, usage, and when to use ongoing actions.',
    url: 'https://languagegems.com/grammar/spanish/verb-phrases/present-continuous',
    siteName: 'LanguageGems',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/verb-phrases/present-continuous',
  },
};

const grammarData = {
  title: "Spanish Present Continuous (estar + gerund)",
  description: "Learn how to form and use the Spanish present continuous tense to express ongoing actions happening right now.",
  
  sections: [
    {
      title: "Formation",
      content: "The Spanish present continuous is formed with the present tense of estar + gerund (present participle).",
      subsections: [
        {
          title: "Structure: estar + gerund",
          content: "Conjugate estar in present tense, then add the gerund:",
          examples: [
            { spanish: "yo estoy hablando", english: "I am speaking" },
            { spanish: "tú estás comiendo", english: "you are eating" },
            { spanish: "él/ella/usted está viviendo", english: "he/she/you is/are living" },
            { spanish: "nosotros/as estamos estudiando", english: "we are studying" },
            { spanish: "vosotros/as estáis trabajando", english: "you all are working" },
            { spanish: "ellos/ellas/ustedes están viajando", english: "they/you all are traveling" }
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
            { spanish: "ir → yendo", english: "going" },
            { spanish: "venir → viniendo", english: "coming" },
            { spanish: "decir → diciendo", english: "saying" },
            { spanish: "dormir → durmiendo", english: "sleeping" },
            { spanish: "morir → muriendo", english: "dying" },
            { spanish: "pedir → pidiendo", english: "asking for" },
            { spanish: "servir → sirviendo", english: "serving" }
          ]
        }
      ]
    },
    {
      title: "Usage",
      content: "The present continuous expresses actions happening right now or temporary ongoing actions.",
      subsections: [
        {
          title: "Actions Happening Right Now",
          content: "Actions occurring at the moment of speaking:",
          examples: [
            { spanish: "Estoy estudiando para el examen.", english: "I am studying for the exam." },
            { spanish: "¿Qué estás haciendo?", english: "What are you doing?" },
            { spanish: "Los niños están jugando en el parque.", english: "The children are playing in the park." }
          ]
        },
        {
          title: "Temporary Ongoing Actions",
          content: "Actions that are ongoing but not necessarily happening right now:",
          examples: [
            { spanish: "Estoy leyendo un libro muy interesante.", english: "I am reading a very interesting book." },
            { spanish: "Está trabajando en un proyecto importante.", english: "He is working on an important project." },
            { spanish: "Estamos aprendiendo español este año.", english: "We are learning Spanish this year." }
          ]
        },
        {
          title: "Emphasis on Ongoing Nature",
          content: "To emphasize that an action is in progress:",
          examples: [
            { spanish: "No puedo hablar ahora, estoy comiendo.", english: "I can't talk now, I am eating." },
            { spanish: "Están construyendo una casa nueva.", english: "They are building a new house." },
            { spanish: "¿Estás escuchando música?", english: "Are you listening to music?" }
          ]
        }
      ]
    },
    {
      title: "Present Continuous vs Simple Present",
      content: "Understanding when to use present continuous vs simple present:",
      subsections: [
        {
          title: "Use Present Continuous for:",
          content: "Ongoing actions happening now or temporarily:",
          examples: [
            { spanish: "Estoy comiendo ahora.", english: "I am eating now. (right now)" },
            { spanish: "Está lloviendo.", english: "It is raining. (currently happening)" },
            { spanish: "Estamos viviendo en Madrid este año.", english: "We are living in Madrid this year. (temporary)" }
          ]
        },
        {
          title: "Use Simple Present for:",
          content: "Habitual actions, facts, or general truths:",
          examples: [
            { spanish: "Como a las dos.", english: "I eat at two o'clock. (habitual)" },
            { spanish: "Llueve mucho en invierno.", english: "It rains a lot in winter. (general fact)" },
            { spanish: "Vivimos en Madrid.", english: "We live in Madrid. (permanent residence)" }
          ]
        }
      ]
    },
    {
      title: "Common Time Expressions",
      content: "Time expressions frequently used with the present continuous:",
      subsections: [
        {
          title: "Present Continuous Time Markers",
          content: "Expressions that indicate ongoing actions:",
          examples: [
            { spanish: "ahora", english: "now" },
            { spanish: "ahora mismo", english: "right now" },
            { spanish: "en este momento", english: "at this moment" },
            { spanish: "actualmente", english: "currently" },
            { spanish: "hoy", english: "today" },
            { spanish: "esta semana", english: "this week" },
            { spanish: "este mes", english: "this month" },
            { spanish: "temporalmente", english: "temporarily" }
          ]
        }
      ]
    },
    {
      title: "Examples in Context",
      content: "See how the present continuous is used in real conversations:",
      subsections: [
        {
          title: "Everyday Conversations",
          content: "Common uses in daily speech:",
          examples: [
            { spanish: "¿Qué estás haciendo?", english: "What are you doing?" },
            { spanish: "Estoy viendo la televisión.", english: "I am watching television." },
            { spanish: "Los estudiantes están tomando un examen.", english: "The students are taking an exam." },
            { spanish: "¿Está funcionando tu computadora?", english: "Is your computer working?" },
            { spanish: "No puedo salir, está lloviendo mucho.", english: "I can't go out, it's raining a lot." }
          ]
        }
      ]
    }
  ],

  youtubeVideoId: "KHKcVJOjhJE"
};

export default function SpanishPresentContinuousPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'present-continuous',
              title: 'Spanish Present Continuous',
              description: 'Master the Spanish present continuous tense (estar + gerund) with comprehensive explanations and examples',
              difficulty: 'beginner',
              estimatedTime: 15
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'present-continuous',
              title: 'Spanish Present Continuous'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="present-continuous"
        title="Spanish Present Continuous"
        description="Master the Spanish present continuous tense (estar + gerund) with comprehensive explanations and examples"
        difficulty="beginner"
        estimatedTime={15}
        sections={grammarData.sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/present-continuous/practice"
        quizUrl="/grammar/spanish/verbs/present-continuous/quiz"
        songUrl="/songs/es?theme=grammar&topic=present-continuous"
        youtubeVideoId={grammarData.youtubeVideoId}
        relatedTopics={[
          { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense' },
          { title: 'Periphrastic Future', url: '/grammar/spanish/verbs/periphrastic-future' },
          { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect' }
        ]}
      />
    </>
  );
}
