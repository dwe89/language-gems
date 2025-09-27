import { Metadata } from 'next';
import GrammarPageTemplate from '@/components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '@/components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'interrogatives',
  title: 'Spanish Interrogatives',
  description: 'Master Spanish question words and question formation. Learn qué, quién, dónde, cuándo, cómo, por qué, and more.',
  difficulty: 'beginner',
  keywords: [
    'spanish interrogatives',
    'spanish question words',
    'spanish questions',
    'qué quién dónde spanish',
    'spanish wh questions',
    'spanish question formation'
  ]
});

const grammarData = {
  title: "Spanish Interrogatives",
  description: "Learn how to form questions in Spanish using interrogative words and question patterns.",
  
  sections: [
    {
      title: "Basic Question Words",
      content: "Spanish interrogative words (question words) always carry written accents and are used to ask for specific information.",
      subsections: [
        {
          title: "Essential Question Words",
          content: "The most common Spanish interrogative words:",
          examples: [
            { spanish: "¿Qué?", english: "What?" },
            { spanish: "¿Quién? / ¿Quiénes?", english: "Who? (singular/plural)" },
            { spanish: "¿Dónde?", english: "Where?" },
            { spanish: "¿Cuándo?", english: "When?" },
            { spanish: "¿Cómo?", english: "How?" },
            { spanish: "¿Por qué?", english: "Why?" },
            { spanish: "¿Cuánto/a?", english: "How much?" },
            { spanish: "¿Cuántos/as?", english: "How many?" },
            { spanish: "¿Cuál? / ¿Cuáles?", english: "Which? / What? (singular/plural)" }
          ]
        },
        {
          title: "Question Words in Context",
          content: "Examples of question words used in complete sentences:",
          examples: [
            { spanish: "¿Qué haces?", english: "What are you doing?" },
            { spanish: "¿Quién es ella?", english: "Who is she?" },
            { spanish: "¿Dónde vives?", english: "Where do you live?" },
            { spanish: "¿Cuándo llegas?", english: "When do you arrive?" },
            { spanish: "¿Cómo estás?", english: "How are you?" },
            { spanish: "¿Por qué estudias español?", english: "Why do you study Spanish?" }
          ]
        }
      ]
    },
    {
      title: "Yes/No Questions",
      content: "Questions that can be answered with 'sí' or 'no' are formed by changing intonation or inverting word order.",
      subsections: [
        {
          title: "Intonation Questions",
          content: "The most common way to ask yes/no questions is by raising your voice at the end:",
          examples: [
            { spanish: "¿Hablas español?", english: "Do you speak Spanish?" },
            { spanish: "¿Tienes hambre?", english: "Are you hungry?" },
            { spanish: "¿Vas al cine?", english: "Are you going to the movies?" },
            { spanish: "¿Te gusta la música?", english: "Do you like music?" },
            { spanish: "¿Está en casa?", english: "Is he/she at home?" }
          ]
        },
        {
          title: "Tag Questions",
          content: "Add question tags like '¿verdad?', '¿no?', or '¿cierto?' to confirm information:",
          examples: [
            { spanish: "Hablas español, ¿verdad?", english: "You speak Spanish, right?" },
            { spanish: "No tienes hambre, ¿no?", english: "You're not hungry, are you?" },
            { spanish: "Vas al cine, ¿cierto?", english: "You're going to the movies, right?" },
            { spanish: "Te gusta la música, ¿verdad?", english: "You like music, don't you?" }
          ]
        }
      ]
    },
    {
      title: "Specific Question Patterns",
      content: "Different question words require specific patterns and usage rules.",
      subsections: [
        {
          title: "Qué vs Cuál",
          content: "'Qué' asks for definitions or general information, while 'cuál' asks for selection from options:",
          examples: [
            { spanish: "¿Qué es esto?", english: "What is this?" },
            { spanish: "¿Cuál prefieres?", english: "Which one do you prefer?" },
            { spanish: "¿Qué hora es?", english: "What time is it?" },
            { spanish: "¿Cuál es tu nombre?", english: "What is your name?" },
            { spanish: "¿Qué estudias?", english: "What do you study?" },
            { spanish: "¿Cuál de estos libros te gusta?", english: "Which of these books do you like?" }
          ]
        },
        {
          title: "Cuánto Agreement",
          content: "'Cuánto' must agree in gender and number with the noun it modifies:",
          examples: [
            { spanish: "¿Cuánto dinero tienes?", english: "How much money do you have?" },
            { spanish: "¿Cuánta agua necesitas?", english: "How much water do you need?" },
            { spanish: "¿Cuántos libros hay?", english: "How many books are there?" },
            { spanish: "¿Cuántas personas vienen?", english: "How many people are coming?" }
          ]
        },
        {
          title: "Prepositions with Question Words",
          content: "Prepositions often accompany question words:",
          examples: [
            { spanish: "¿De dónde eres?", english: "Where are you from?" },
            { spanish: "¿A dónde vas?", english: "Where are you going?" },
            { spanish: "¿Con quién vives?", english: "Who do you live with?" },
            { spanish: "¿Para qué sirve esto?", english: "What is this for?" },
            { spanish: "¿En qué trabajas?", english: "What do you work in?" }
          ]
        }
      ]
    },
    {
      title: "Question Formation Rules",
      content: "Important rules for forming questions correctly in Spanish.",
      subsections: [
        {
          title: "Punctuation Rules",
          content: "Spanish uses inverted question marks at the beginning and regular ones at the end:",
          examples: [
            { spanish: "¿Cómo te llamas?", english: "What's your name?" },
            { spanish: "¿Dónde está el baño?", english: "Where is the bathroom?" },
            { spanish: "¿Qué hora es?", english: "What time is it?" },
            { spanish: "¿Hablas inglés?", english: "Do you speak English?" }
          ]
        },
        {
          title: "Word Order in Questions",
          content: "Question word order can be flexible, but common patterns exist:",
          examples: [
            { spanish: "¿Qué haces tú?", english: "What do you do?" },
            { spanish: "¿Dónde vive María?", english: "Where does María live?" },
            { spanish: "¿Cuándo llega el tren?", english: "When does the train arrive?" },
            { spanish: "¿Por qué no vienes?", english: "Why aren't you coming?" }
          ]
        }
      ]
    }
  ],

  youtubeVideoId: ""
};

export default function SpanishInterrogativesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'interrogatives',
              title: 'Spanish Interrogatives',
              description: 'Master Spanish question words and question formation with comprehensive explanations and examples',
              difficulty: 'beginner',
              estimatedTime: 20
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'interrogatives',
              title: 'Spanish Interrogatives'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="interrogatives"
        title="Spanish Interrogatives"
        description="Master Spanish question words and question formation with comprehensive explanations and examples"
        difficulty="beginner"
        estimatedTime={20}
        sections={grammarData.sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/interrogatives/practice"
        quizUrl="/grammar/spanish/verbs/interrogatives/quiz"
        songUrl="/songs/es?theme=grammar&topic=interrogatives"
        youtubeVideoId={grammarData.youtubeVideoId}
        relatedTopics={[
          { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense' },
          { title: 'Negation', url: '/grammar/spanish/verbs/negation' },
          { title: 'Demonstrative Adjectives', url: '/grammar/spanish/adjectives/demonstrative' }
        ]}
      />
    </>
  );
}
