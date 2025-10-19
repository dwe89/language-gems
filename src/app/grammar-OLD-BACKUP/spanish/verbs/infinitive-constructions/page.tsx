import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'infinitive-constructions',
  title: 'Spanish Infinitive Constructions',
  description: 'Master Spanish infinitive constructions: verb + infinitive patterns, prepositions with infinitives, and infinitive phrases.',
  difficulty: 'intermediate',
  keywords: [
    'spanish infinitive constructions',
    'spanish verb infinitive patterns',
    'spanish prepositions infinitive',
    'infinitive phrases spanish',
    'spanish infinitive grammar',
    'verb infinitive combinations'
  ]
});

const grammarData = {
  title: "Spanish Infinitive Constructions",
  description: "Learn how to use Spanish infinitive constructions with verbs, prepositions, and in various grammatical patterns.",
  
  sections: [
    {
      title: "Verb + Infinitive Patterns",
      content: "Many Spanish verbs are followed directly by infinitives without prepositions.",
      subsections: [
        {
          title: "Modal Verbs + Infinitive",
          content: "Modal verbs are directly followed by infinitives:",
          examples: [
            { spanish: "Puedo hablar español.", english: "I can speak Spanish." },
            { spanish: "Debes estudiar más.", english: "You should study more." },
            { spanish: "Quiere viajar a México.", english: "He wants to travel to Mexico." },
            { spanish: "Sabemos cocinar.", english: "We know how to cook." },
            { spanish: "Tengo que trabajar.", english: "I have to work." }
          ]
        },
        {
          title: "Other Verbs + Infinitive",
          content: "Common verbs that take infinitives directly:",
          examples: [
            { spanish: "Espero verte pronto.", english: "I hope to see you soon." },
            { spanish: "Necesita descansar.", english: "He needs to rest." },
            { spanish: "Prefiero caminar.", english: "I prefer to walk." },
            { spanish: "Suele llegar tarde.", english: "He usually arrives late." },
            { spanish: "Acaba de llegar.", english: "He just arrived." },
            { spanish: "Vuelve a intentar.", english: "Try again." }
          ]
        }
      ]
    },
    {
      title: "Preposition + Infinitive",
      content: "Many Spanish constructions require specific prepositions before infinitives.",
      subsections: [
        {
          title: "A + Infinitive",
          content: "Common verbs and expressions that require 'a' before infinitives:",
          examples: [
            { spanish: "Voy a estudiar.", english: "I'm going to study." },
            { spanish: "Aprende a cocinar.", english: "He's learning to cook." },
            { spanish: "Ayuda a limpiar.", english: "Help clean." },
            { spanish: "Empieza a llover.", english: "It's starting to rain." },
            { spanish: "Se dedica a enseñar.", english: "He dedicates himself to teaching." },
            { spanish: "Invita a cenar.", english: "He invites to dinner." }
          ]
        },
        {
          title: "De + Infinitive",
          content: "Verbs and expressions that require 'de' before infinitives:",
          examples: [
            { spanish: "Acaba de llegar.", english: "He just arrived." },
            { spanish: "Trata de entender.", english: "Try to understand." },
            { spanish: "Se olvida de llamar.", english: "He forgets to call." },
            { spanish: "Deja de fumar.", english: "Stop smoking." },
            { spanish: "Se alegra de verte.", english: "He's happy to see you." },
            { spanish: "Tiene ganas de viajar.", english: "He feels like traveling." }
          ]
        },
        {
          title: "En + Infinitive",
          content: "Less common but important uses of 'en' with infinitives:",
          examples: [
            { spanish: "Insiste en pagar.", english: "He insists on paying." },
            { spanish: "Piensa en viajar.", english: "He's thinking about traveling." },
            { spanish: "Se especializa en enseñar.", english: "He specializes in teaching." },
            { spanish: "Tarda en llegar.", english: "He takes time to arrive." }
          ]
        }
      ]
    },
    {
      title: "Infinitive as Subject or Object",
      content: "Infinitives can function as subjects or objects in Spanish sentences.",
      subsections: [
        {
          title: "Infinitive as Subject",
          content: "Infinitives can serve as the subject of a sentence:",
          examples: [
            { spanish: "Estudiar es importante.", english: "Studying is important." },
            { spanish: "Viajar me gusta mucho.", english: "I really like traveling." },
            { spanish: "Cocinar es mi pasión.", english: "Cooking is my passion." },
            { spanish: "Leer ayuda a aprender.", english: "Reading helps learning." },
            { spanish: "Caminar es bueno para la salud.", english: "Walking is good for health." }
          ]
        },
        {
          title: "Infinitive as Object",
          content: "Infinitives can serve as direct objects:",
          examples: [
            { spanish: "Me gusta bailar.", english: "I like to dance." },
            { spanish: "Prefiero caminar.", english: "I prefer to walk." },
            { spanish: "Odia trabajar los domingos.", english: "He hates working on Sundays." },
            { spanish: "Ama cocinar.", english: "She loves to cook." },
            { spanish: "Detesta madrugar.", english: "He detests getting up early." }
          ]
        }
      ]
    },
    {
      title: "Special Infinitive Constructions",
      content: "Unique Spanish constructions using infinitives.",
      subsections: [
        {
          title: "Al + Infinitive",
          content: "'Al' + infinitive expresses 'upon' or 'when' doing something:",
          examples: [
            { spanish: "Al llegar, me llamó.", english: "Upon arriving, he called me." },
            { spanish: "Al verla, sonrió.", english: "When he saw her, he smiled." },
            { spanish: "Al terminar, se fue.", english: "Upon finishing, he left." },
            { spanish: "Al despertar, desayuno.", english: "When I wake up, I have breakfast." }
          ]
        },
        {
          title: "Para + Infinitive",
          content: "'Para' + infinitive expresses purpose (in order to):",
          examples: [
            { spanish: "Estudio para aprender.", english: "I study in order to learn." },
            { spanish: "Trabajo para vivir.", english: "I work in order to live." },
            { spanish: "Ahorro para viajar.", english: "I save in order to travel." },
            { spanish: "Corro para estar en forma.", english: "I run to stay in shape." }
          ]
        },
        {
          title: "Sin + Infinitive",
          content: "'Sin' + infinitive means 'without' doing something:",
          examples: [
            { spanish: "Se fue sin decir adiós.", english: "He left without saying goodbye." },
            { spanish: "Comió sin hablar.", english: "He ate without speaking." },
            { spanish: "Trabaja sin descansar.", english: "He works without resting." },
            { spanish: "Vive sin preocuparse.", english: "He lives without worrying." }
          ]
        }
      ]
    }
  ],

  youtubeVideoId: ""
};

export default function SpanishInfinitiveConstructionsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'infinitive-constructions',
              title: 'Spanish Infinitive Constructions',
              description: 'Master Spanish infinitive constructions with comprehensive explanations and examples',
              difficulty: 'intermediate',
              estimatedTime: 25
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'infinitive-constructions',
              title: 'Spanish Infinitive Constructions'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="infinitive-constructions"
        title="Spanish Infinitive Constructions"
        description="Master Spanish infinitive constructions with comprehensive explanations and examples"
        difficulty="intermediate"
        estimatedTime={25}
        sections={grammarData.sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/infinitive-constructions/practice"
        quizUrl="/grammar/spanish/verbs/infinitive-constructions/quiz"
        songUrl="/songs/es?theme=grammar&topic=infinitive-constructions"
        youtubeVideoId={grammarData.youtubeVideoId}
        relatedTopics={[
          { title: 'Modal Verbs', url: '/grammar/spanish/verbs/modal-verbs' },
          { title: 'Prepositions', url: '/grammar/spanish/adverbial-prepositional/prepositions' },
          { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense' }
        ]}
      />
    </>
  );
}
