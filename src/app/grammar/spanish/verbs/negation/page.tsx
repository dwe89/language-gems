import { Metadata } from 'next';
import GrammarPageTemplate from '@/components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '@/components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'negation',
  title: 'Spanish Negation',
  description: 'Master Spanish negation patterns. Learn how to form negative sentences, double negatives, and negative expressions.',
  difficulty: 'beginner',
  keywords: [
    'spanish negation',
    'spanish negative sentences',
    'no spanish grammar',
    'double negative spanish',
    'negative expressions spanish',
    'spanish negative words'
  ]
});

const grammarData = {
  title: "Spanish Negation",
  description: "Learn how to form negative sentences in Spanish and master negative expressions and double negatives.",
  
  sections: [
    {
      title: "Basic Negation with 'No'",
      content: "The most common way to make a sentence negative in Spanish is by placing 'no' directly before the verb.",
      subsections: [
        {
          title: "Simple Negation",
          content: "Place 'no' immediately before the conjugated verb:",
          examples: [
            { spanish: "Hablo español. → No hablo español.", english: "I speak Spanish. → I don't speak Spanish." },
            { spanish: "Comes mucho. → No comes mucho.", english: "You eat a lot. → You don't eat a lot." },
            { spanish: "Vive aquí. → No vive aquí.", english: "He lives here. → He doesn't live here." },
            { spanish: "Tenemos tiempo. → No tenemos tiempo.", english: "We have time. → We don't have time." },
            { spanish: "Son estudiantes. → No son estudiantes.", english: "They are students. → They are not students." }
          ]
        },
        {
          title: "Negation with Object Pronouns",
          content: "When object pronouns are present, 'no' goes before the pronouns:",
          examples: [
            { spanish: "Te veo. → No te veo.", english: "I see you. → I don't see you." },
            { spanish: "Lo comprendo. → No lo comprendo.", english: "I understand it. → I don't understand it." },
            { spanish: "Me gusta. → No me gusta.", english: "I like it. → I don't like it." },
            { spanish: "Se levanta. → No se levanta.", english: "He gets up. → He doesn't get up." },
            { spanish: "Nos hablan. → No nos hablan.", english: "They talk to us. → They don't talk to us." }
          ]
        },
        {
          title: "Negation with Compound Tenses",
          content: "In compound tenses, 'no' goes before the auxiliary verb:",
          examples: [
            { spanish: "He comido. → No he comido.", english: "I have eaten. → I haven't eaten." },
            { spanish: "Había llegado. → No había llegado.", english: "He had arrived. → He hadn't arrived." },
            { spanish: "Habremos terminado. → No habremos terminado.", english: "We will have finished. → We won't have finished." },
            { spanish: "Está hablando. → No está hablando.", english: "She is speaking. → She isn't speaking." }
          ]
        }
      ]
    },
    {
      title: "Negative Words",
      content: "Spanish has several negative words that can be used alone or with 'no' for emphasis.",
      subsections: [
        {
          title: "Common Negative Words",
          content: "Key negative words and their meanings:",
          examples: [
            { spanish: "nada", english: "nothing, not anything" },
            { spanish: "nadie", english: "nobody, not anyone" },
            { spanish: "nunca", english: "never, not ever" },
            { spanish: "jamás", english: "never, not ever (stronger)" },
            { spanish: "ninguno/a", english: "none, not any" },
            { spanish: "tampoco", english: "neither, not either" },
            { spanish: "ni", english: "neither, nor" },
            { spanish: "ni siquiera", english: "not even" }
          ]
        },
        {
          title: "Using Negative Words Alone",
          content: "Negative words can be used without 'no' when they come before the verb:",
          examples: [
            { spanish: "Nadie viene.", english: "Nobody is coming." },
            { spanish: "Nunca llueve aquí.", english: "It never rains here." },
            { spanish: "Nada funciona.", english: "Nothing works." },
            { spanish: "Ningún estudiante llegó.", english: "No student arrived." },
            { spanish: "Tampoco me gusta.", english: "I don't like it either." }
          ]
        }
      ]
    },
    {
      title: "Double Negatives",
      content: "Unlike English, Spanish allows and often requires double negatives for emphasis.",
      subsections: [
        {
          title: "No + Negative Word",
          content: "When negative words come after the verb, 'no' is required before the verb:",
          examples: [
            { spanish: "No viene nadie.", english: "Nobody is coming." },
            { spanish: "No llueve nunca aquí.", english: "It never rains here." },
            { spanish: "No funciona nada.", english: "Nothing works." },
            { spanish: "No llegó ningún estudiante.", english: "No student arrived." },
            { spanish: "No me gusta tampoco.", english: "I don't like it either." }
          ]
        },
        {
          title: "Multiple Negatives",
          content: "Spanish can use multiple negative words in the same sentence:",
          examples: [
            { spanish: "No dice nada nunca.", english: "He never says anything." },
            { spanish: "No viene nadie nunca.", english: "Nobody ever comes." },
            { spanish: "No tengo ningún problema tampoco.", english: "I don't have any problems either." },
            { spanish: "Nunca nadie dice nada.", english: "Nobody ever says anything." },
            { spanish: "No hay nada para nadie.", english: "There's nothing for anyone." }
          ]
        }
      ]
    },
    {
      title: "Negative Expressions",
      content: "Common negative expressions and phrases used in everyday Spanish.",
      subsections: [
        {
          title: "Common Negative Phrases",
          content: "Useful negative expressions for daily conversation:",
          examples: [
            { spanish: "De nada", english: "You're welcome (literally: of nothing)" },
            { spanish: "Para nada", english: "Not at all, absolutely not" },
            { spanish: "Ni hablar", english: "No way, out of the question" },
            { spanish: "Ni modo", english: "No way, too bad" },
            { spanish: "En absoluto", english: "Absolutely not" },
            { spanish: "Qué va", english: "No way, come on" },
            { spanish: "Ni por asomo", english: "Not by a long shot" },
            { spanish: "Ni loco", english: "No way, not crazy" }
          ]
        },
        {
          title: "Negative Questions",
          content: "How to form and respond to negative questions:",
          examples: [
            { spanish: "¿No vienes? - No, no vengo.", english: "Aren't you coming? - No, I'm not coming." },
            { spanish: "¿No te gusta? - Sí, sí me gusta.", english: "Don't you like it? - Yes, I do like it." },
            { spanish: "¿Nunca has estado aquí? - No, nunca.", english: "Have you never been here? - No, never." },
            { spanish: "¿No hay nadie? - No, no hay nadie.", english: "Isn't there anyone? - No, there's no one." }
          ]
        }
      ]
    }
  ],

  youtubeVideoId: ""
};

export default function SpanishNegationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'negation',
              title: 'Spanish Negation',
              description: 'Master Spanish negation patterns with comprehensive explanations and examples',
              difficulty: 'beginner',
              estimatedTime: 20
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'negation',
              title: 'Spanish Negation'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="negation"
        title="Spanish Negation"
        description="Master Spanish negation patterns with comprehensive explanations and examples"
        difficulty="beginner"
        estimatedTime={20}
        sections={grammarData.sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/negation/practice"
        quizUrl="/grammar/spanish/verbs/negation/quiz"
        songUrl="/songs/es?theme=grammar&topic=negation"
        youtubeVideoId={grammarData.youtubeVideoId}
        relatedTopics={[
          { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense' },
          { title: 'Interrogatives', url: '/grammar/spanish/verbs/interrogatives' },
          { title: 'Indefinite Adjectives', url: '/grammar/spanish/adjectives/indefinite' }
        ]}
      />
    </>
  );
}
