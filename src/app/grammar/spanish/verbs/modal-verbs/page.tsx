import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'modal-verbs',
  title: 'Spanish Modal Verbs',
  description: 'Master Spanish modal verbs: poder, deber, querer, saber, tener que. Learn ability, obligation, desire, and necessity.',
  difficulty: 'intermediate',
  keywords: [
    'spanish modal verbs',
    'poder deber querer spanish',
    'spanish auxiliary verbs',
    'tener que spanish',
    'spanish ability obligation',
    'modal auxiliaries spanish'
  ]
});

const grammarData = {
  title: "Spanish Modal Verbs",
  description: "Learn how to use Spanish modal verbs to express ability, obligation, desire, necessity, and possibility.",
  
  sections: [
    {
      title: "Poder (Can/To Be Able To)",
      content: "Poder expresses ability, possibility, or permission.",
      subsections: [
        {
          title: "Present Tense Conjugation",
          content: "Poder is an irregular stem-changing verb (o→ue):",
          examples: [
            { spanish: "yo puedo", english: "I can" },
            { spanish: "tú puedes", english: "you can" },
            { spanish: "él/ella/usted puede", english: "he/she/you can" },
            { spanish: "nosotros/as podemos", english: "we can" },
            { spanish: "vosotros/as podéis", english: "you all can" },
            { spanish: "ellos/ellas/ustedes pueden", english: "they/you all can" }
          ]
        },
        {
          title: "Uses of Poder",
          content: "Different meanings and uses of poder:",
          examples: [
            { spanish: "Puedo hablar español.", english: "I can speak Spanish. (ability)" },
            { spanish: "¿Puedes ayudarme?", english: "Can you help me? (request)" },
            { spanish: "Puede llover mañana.", english: "It might rain tomorrow. (possibility)" },
            { spanish: "¿Puedo entrar?", english: "May I come in? (permission)" },
            { spanish: "No puedo venir hoy.", english: "I can't come today. (inability)" }
          ]
        }
      ]
    },
    {
      title: "Deber (Should/Must/Ought To)",
      content: "Deber expresses obligation, duty, or strong recommendation.",
      subsections: [
        {
          title: "Present Tense Conjugation",
          content: "Deber is a regular -er verb:",
          examples: [
            { spanish: "yo debo", english: "I should/must" },
            { spanish: "tú debes", english: "you should/must" },
            { spanish: "él/ella/usted debe", english: "he/she/you should/must" },
            { spanish: "nosotros/as debemos", english: "we should/must" },
            { spanish: "vosotros/as debéis", english: "you all should/must" },
            { spanish: "ellos/ellas/ustedes deben", english: "they/you all should/must" }
          ]
        },
        {
          title: "Uses of Deber",
          content: "Different meanings and uses of deber:",
          examples: [
            { spanish: "Debes estudiar más.", english: "You should study more. (advice)" },
            { spanish: "Debo llegar temprano.", english: "I must arrive early. (obligation)" },
            { spanish: "Debemos respetar las reglas.", english: "We must respect the rules. (duty)" },
            { spanish: "Debe de estar en casa.", english: "He must be at home. (probability)" },
            { spanish: "No debes fumar.", english: "You shouldn't smoke. (prohibition)" }
          ]
        }
      ]
    },
    {
      title: "Querer (To Want)",
      content: "Querer expresses desire, wish, or intention.",
      subsections: [
        {
          title: "Present Tense Conjugation",
          content: "Querer is an irregular stem-changing verb (e→ie):",
          examples: [
            { spanish: "yo quiero", english: "I want" },
            { spanish: "tú quieres", english: "you want" },
            { spanish: "él/ella/usted quiere", english: "he/she/you want" },
            { spanish: "nosotros/as queremos", english: "we want" },
            { spanish: "vosotros/as queréis", english: "you all want" },
            { spanish: "ellos/ellas/ustedes quieren", english: "they/you all want" }
          ]
        },
        {
          title: "Uses of Querer",
          content: "Different meanings and uses of querer:",
          examples: [
            { spanish: "Quiero aprender español.", english: "I want to learn Spanish. (desire)" },
            { spanish: "¿Quieres café?", english: "Do you want coffee? (offer)" },
            { spanish: "Queremos viajar a España.", english: "We want to travel to Spain. (intention)" },
            { spanish: "Te quiero mucho.", english: "I love you very much. (affection)" },
            { spanish: "¿Qué quiere decir esto?", english: "What does this mean? (meaning)" }
          ]
        }
      ]
    },
    {
      title: "Tener que (To Have To)",
      content: "Tener que expresses strong obligation or necessity.",
      subsections: [
        {
          title: "Formation",
          content: "Tener que is formed with tener + que + infinitive:",
          examples: [
            { spanish: "tengo que", english: "I have to" },
            { spanish: "tienes que", english: "you have to" },
            { spanish: "tiene que", english: "he/she/you have to" },
            { spanish: "tenemos que", english: "we have to" },
            { spanish: "tenéis que", english: "you all have to" },
            { spanish: "tienen que", english: "they/you all have to" }
          ]
        },
        {
          title: "Uses of Tener que",
          content: "Expressing necessity and strong obligation:",
          examples: [
            { spanish: "Tengo que trabajar mañana.", english: "I have to work tomorrow." },
            { spanish: "Tienes que estudiar para el examen.", english: "You have to study for the exam." },
            { spanish: "Tenemos que llegar a tiempo.", english: "We have to arrive on time." },
            { spanish: "¿Tienes que irte ya?", english: "Do you have to leave now?" },
            { spanish: "No tengo que trabajar los domingos.", english: "I don't have to work on Sundays." }
          ]
        }
      ]
    },
    {
      title: "Other Modal Expressions",
      content: "Additional ways to express modality in Spanish.",
      subsections: [
        {
          title: "Saber (To Know How To)",
          content: "Saber + infinitive expresses learned ability or skill:",
          examples: [
            { spanish: "Sé nadar.", english: "I know how to swim." },
            { spanish: "¿Sabes cocinar?", english: "Do you know how to cook?" },
            { spanish: "No sabe conducir.", english: "He doesn't know how to drive." },
            { spanish: "Sabemos hablar francés.", english: "We know how to speak French." }
          ]
        },
        {
          title: "Hay que (One Must/It's Necessary)",
          content: "Hay que expresses general obligation or necessity:",
          examples: [
            { spanish: "Hay que estudiar mucho.", english: "One must study a lot." },
            { spanish: "Hay que llegar temprano.", english: "It's necessary to arrive early." },
            { spanish: "No hay que gritar.", english: "One mustn't shout." },
            { spanish: "¿Hay que reservar?", english: "Is it necessary to make a reservation?" }
          ]
        }
      ]
    }
  ],

  youtubeVideoId: ""
};

export default function SpanishModalVerbsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'modal-verbs',
              title: 'Spanish Modal Verbs',
              description: 'Master Spanish modal verbs with comprehensive explanations and examples',
              difficulty: 'intermediate',
              estimatedTime: 25
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'modal-verbs',
              title: 'Spanish Modal Verbs'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="modal-verbs"
        title="Spanish Modal Verbs"
        description="Master Spanish modal verbs with comprehensive explanations and examples"
        difficulty="intermediate"
        estimatedTime={25}
        sections={grammarData.sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/modal-verbs/practice"
        quizUrl="/grammar/spanish/verbs/modal-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=modal-verbs"
        youtubeVideoId={grammarData.youtubeVideoId}
        relatedTopics={[
          { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense' },
          { title: 'Infinitive Constructions', url: '/grammar/spanish/verbs/infinitive-constructions' },
          { title: 'Irregular Verbs', url: '/grammar/spanish/verbs/irregular-verbs' }
        ]}
      />
    </>
  );
}
