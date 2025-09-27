import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'imperative',
  title: 'Spanish Imperative',
  description: 'Master Spanish imperative mood for commands and requests. Learn formal and informal commands, positive and negative forms.',
  difficulty: 'intermediate',
  keywords: [
    'spanish imperative',
    'spanish commands',
    'imperativo español',
    'formal commands spanish',
    'informal commands spanish',
    'negative commands spanish'
  ]
});

const grammarData = {
  title: "Spanish Imperative Mood",
  description: "Learn how to form and use the Spanish imperative mood to give commands, make requests, and offer suggestions.",
  
  sections: [
    {
      title: "Informal Commands (Tú)",
      content: "Informal commands are used with people you address as 'tú' - friends, family, children, peers.",
      subsections: [
        {
          title: "Positive Tú Commands",
          content: "For regular verbs, use the third person singular (él/ella) form of the present tense:",
          examples: [
            { spanish: "¡Habla más despacio!", english: "Speak more slowly!" },
            { spanish: "¡Come las verduras!", english: "Eat the vegetables!" },
            { spanish: "¡Escribe la carta!", english: "Write the letter!" },
            { spanish: "¡Estudia para el examen!", english: "Study for the exam!" },
            { spanish: "¡Abre la ventana!", english: "Open the window!" }
          ]
        },
        {
          title: "Irregular Positive Tú Commands",
          content: "Some verbs have irregular positive tú command forms:",
          examples: [
            { spanish: "decir → ¡di!", english: "say!" },
            { spanish: "hacer → ¡haz!", english: "do/make!" },
            { spanish: "ir → ¡ve!", english: "go!" },
            { spanish: "poner → ¡pon!", english: "put!" },
            { spanish: "salir → ¡sal!", english: "leave/go out!" },
            { spanish: "ser → ¡sé!", english: "be!" },
            { spanish: "tener → ¡ten!", english: "have!" },
            { spanish: "venir → ¡ven!", english: "come!" }
          ]
        },
        {
          title: "Negative Tú Commands",
          content: "Negative tú commands use the present subjunctive form with 'no':",
          examples: [
            { spanish: "¡No hables tan rápido!", english: "Don't speak so fast!" },
            { spanish: "¡No comas tanto!", english: "Don't eat so much!" },
            { spanish: "¡No escribas en el libro!", english: "Don't write in the book!" },
            { spanish: "¡No vayas solo!", english: "Don't go alone!" },
            { spanish: "¡No seas tonto!", english: "Don't be silly!" }
          ]
        }
      ]
    },
    {
      title: "Formal Commands (Usted/Ustedes)",
      content: "Formal commands are used with people you address as 'usted' or 'ustedes' - strangers, authority figures, formal situations.",
      subsections: [
        {
          title: "Usted Commands",
          content: "Both positive and negative usted commands use the present subjunctive form:",
          examples: [
            { spanish: "¡Hable más despacio, por favor!", english: "Please speak more slowly!" },
            { spanish: "¡No fume aquí!", english: "Don't smoke here!" },
            { spanish: "¡Venga mañana!", english: "Come tomorrow!" },
            { spanish: "¡No se preocupe!", english: "Don't worry!" },
            { spanish: "¡Tenga cuidado!", english: "Be careful!" }
          ]
        },
        {
          title: "Ustedes Commands",
          content: "Ustedes commands (used for both formal and informal plural in Latin America):",
          examples: [
            { spanish: "¡Hablen en español!", english: "Speak in Spanish!" },
            { spanish: "¡No corran en el pasillo!", english: "Don't run in the hallway!" },
            { spanish: "¡Vengan acá!", english: "Come here!" },
            { spanish: "¡No se vayan todavía!", english: "Don't leave yet!" },
            { spanish: "¡Siéntense, por favor!", english: "Please sit down!" }
          ]
        }
      ]
    },
    {
      title: "Commands with Pronouns",
      content: "Object and reflexive pronouns attach to positive commands but precede negative commands.",
      subsections: [
        {
          title: "Positive Commands with Pronouns",
          content: "Pronouns attach to the end of positive commands:",
          examples: [
            { spanish: "¡Dímelo!", english: "Tell it to me!" },
            { spanish: "¡Cómpralo!", english: "Buy it!" },
            { spanish: "¡Levántate!", english: "Get up!" },
            { spanish: "¡Dáselo!", english: "Give it to him/her!" },
            { spanish: "¡Háblame!", english: "Talk to me!" }
          ]
        },
        {
          title: "Negative Commands with Pronouns",
          content: "Pronouns precede negative commands:",
          examples: [
            { spanish: "¡No me lo digas!", english: "Don't tell it to me!" },
            { spanish: "¡No lo compres!", english: "Don't buy it!" },
            { spanish: "¡No te levantes!", english: "Don't get up!" },
            { spanish: "¡No se lo des!", english: "Don't give it to him/her!" },
            { spanish: "¡No me hables!", english: "Don't talk to me!" }
          ]
        }
      ]
    },
    {
      title: "Softening Commands",
      content: "Ways to make commands more polite and less direct:",
      subsections: [
        {
          title: "Polite Expressions",
          content: "Add polite words to soften commands:",
          examples: [
            { spanish: "¡Habla más despacio, por favor!", english: "Please speak more slowly!" },
            { spanish: "¿Podrías ayudarme?", english: "Could you help me?" },
            { spanish: "¿Te importaría cerrar la puerta?", english: "Would you mind closing the door?" },
            { spanish: "Si fueras tan amable...", english: "If you would be so kind..." },
            { spanish: "¿Serías tan amable de...?", english: "Would you be so kind as to...?" }
          ]
        },
        {
          title: "Suggestions Instead of Commands",
          content: "Use suggestions to be more diplomatic:",
          examples: [
            { spanish: "¿Por qué no vienes mañana?", english: "Why don't you come tomorrow?" },
            { spanish: "¿Qué tal si estudiamos juntos?", english: "How about we study together?" },
            { spanish: "Deberías descansar más.", english: "You should rest more." },
            { spanish: "Sería mejor si llegaras temprano.", english: "It would be better if you arrived early." }
          ]
        }
      ]
    }
  ],

  youtubeVideoId: ""
};

export default function SpanishImperativePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'imperative',
              title: 'Spanish Imperative',
              description: 'Master Spanish imperative mood for commands and requests with comprehensive explanations and examples',
              difficulty: 'intermediate',
              estimatedTime: 25
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'imperative',
              title: 'Spanish Imperative'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="imperative"
        title="Spanish Imperative"
        description="Master Spanish imperative mood for commands and requests with comprehensive explanations and examples"
        difficulty="intermediate"
        estimatedTime={25}
        sections={grammarData.sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/imperative/practice"
        quizUrl="/grammar/spanish/verbs/imperative/quiz"
        songUrl="/songs/es?theme=grammar&topic=imperative"
        youtubeVideoId={grammarData.youtubeVideoId}
        relatedTopics={[
          { title: 'Present Subjunctive', url: '/grammar/spanish/verbs/subjunctive' },
          { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense' },
          { title: 'Formal vs Informal', url: '/grammar/spanish/pronouns/formal-informal' }
        ]}
      />
    </>
  );
}
