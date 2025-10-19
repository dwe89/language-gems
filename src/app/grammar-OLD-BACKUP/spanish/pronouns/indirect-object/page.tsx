import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'pronouns',
  topic: 'indirect-object',
  title: 'Spanish Indirect Object Pronouns',
  description: 'Master Spanish indirect object pronouns: me, te, le, nos, os, les. Learn to show to whom or for whom actions are done.',
  difficulty: 'intermediate',
  keywords: [
    'spanish indirect object pronouns',
    'me te le spanish',
    'nos os les spanish',
    'spanish grammar indirect pronouns',
    'pronombres objeto indirecto español',
    'to whom for whom spanish'
  ],
  examples: [
    'le doy (I give to him/her)',
    'nos escriben (they write to us)',
    'te hablo (I speak to you)'
  ]
});

const sections = [
  {
    title: 'Spanish Indirect Object Pronouns Overview',
    content: `Spanish indirect object pronouns show **to whom** or **for whom** an action is done. They replace indirect objects to avoid repetition and make speech more natural.

**Key Function**: Show the recipient or beneficiary of an action
**Position**: Usually go **before** the conjugated verb (same as direct object pronouns)
**Test**: Ask "to whom?" or "for whom?" after the verb

**Important**: Indirect object pronouns do NOT change for gender (unlike direct object pronouns).`,
    examples: [
      {
        spanish: 'Doy el libro a María → Le doy el libro.',
        english: 'I give the book to María → I give the book to her.',
        highlight: ['a María', 'Le']
      },
      {
        spanish: 'Escribo una carta a mis padres → Les escribo una carta.',
        english: 'I write a letter to my parents → I write a letter to them.',
        highlight: ['a mis padres', 'Les']
      },
      {
        spanish: 'Compro flores para ti → Te compro flores.',
        english: 'I buy flowers for you → I buy flowers for you.',
        highlight: ['para ti', 'Te']
      }
    ]
  },
  {
    title: 'Complete List of Indirect Object Pronouns',
    content: `Here are all Spanish indirect object pronouns:`,
    subsections: [
      {
        title: 'Indirect Object Pronouns Chart',
        content: `Notice that indirect object pronouns do NOT change for gender:`,
        conjugationTable: {
          title: 'Spanish Indirect Object Pronouns',
          conjugations: [
            { pronoun: 'me', form: 'to/for me', english: 'Me das el libro (You give the book to me)' },
            { pronoun: 'te', form: 'to/for you (informal)', english: 'Te hablo (I speak to you)' },
            { pronoun: 'le', form: 'to/for him/her/you (formal)', english: 'Le escribo (I write to him/her)' },
            { pronoun: 'nos', form: 'to/for us', english: 'Nos explican (They explain to us)' },
            { pronoun: 'os', form: 'to/for you all (informal, Spain)', english: 'Os digo (I tell you all)' },
            { pronoun: 'les', form: 'to/for them/you all', english: 'Les compro (I buy for them)' }
          ]
        },
        examples: [
          {
            spanish: 'Mi madre me cocina.',
            english: 'My mother cooks for me.',
            highlight: ['me']
          },
          {
            spanish: 'Te voy a explicar.',
            english: 'I\'m going to explain to you.',
            highlight: ['Te']
          },
          {
            spanish: 'Le damos dinero.',
            english: 'We give money to him/her.',
            highlight: ['Le']
          },
          {
            spanish: 'Les mandamos cartas.',
            english: 'We send letters to them.',
            highlight: ['Les']
          }
        ]
      }
    ]
  },
  {
    title: 'No Gender Agreement',
    content: `Unlike direct object pronouns, indirect object pronouns do NOT change for gender:`,
    subsections: [
      {
        title: 'Le and Les for All Genders',
        content: `**Le** = to/for him, her, you (formal) - same form for all
**Les** = to/for them, you all - same form for all

This is different from direct object pronouns (lo/la, los/las).`,
        examples: [
          {
            spanish: 'Le hablo a Juan. (masculine)',
            english: 'I speak to Juan.',
            highlight: ['Le']
          },
          {
            spanish: 'Le hablo a María. (feminine)',
            english: 'I speak to María.',
            highlight: ['Le']
          },
          {
            spanish: 'Les escribo a mis hermanos. (masculine)',
            english: 'I write to my brothers.',
            highlight: ['Les']
          },
          {
            spanish: 'Les escribo a mis hermanas. (feminine)',
            english: 'I write to my sisters.',
            highlight: ['Les']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Verbs with Indirect Objects',
    content: `Many Spanish verbs commonly take indirect objects:`,
    subsections: [
      {
        title: 'Giving and Receiving Verbs',
        content: `These verbs often involve giving or receiving something:`,
        examples: [
          {
            spanish: 'dar (to give) → Le doy dinero.',
            english: 'to give → I give money to him/her.',
            highlight: ['Le doy']
          },
          {
            spanish: 'regalar (to give as gift) → Te regalo flores.',
            english: 'to give as gift → I give you flowers.',
            highlight: ['Te regalo']
          },
          {
            spanish: 'prestar (to lend) → Nos prestan el coche.',
            english: 'to lend → They lend us the car.',
            highlight: ['Nos prestan']
          },
          {
            spanish: 'devolver (to return) → Les devuelvo el libro.',
            english: 'to return → I return the book to them.',
            highlight: ['Les devuelvo']
          }
        ]
      },
      {
        title: 'Communication Verbs',
        content: `Verbs involving communication often use indirect objects:`,
        examples: [
          {
            spanish: 'decir (to say/tell) → Me dice la verdad.',
            english: 'to say/tell → He/she tells me the truth.',
            highlight: ['Me dice']
          },
          {
            spanish: 'hablar (to speak) → Te hablo en español.',
            english: 'to speak → I speak to you in Spanish.',
            highlight: ['Te hablo']
          },
          {
            spanish: 'escribir (to write) → Le escribo una carta.',
            english: 'to write → I write a letter to him/her.',
            highlight: ['Le escribo']
          },
          {
            spanish: 'explicar (to explain) → Nos explican la lección.',
            english: 'to explain → They explain the lesson to us.',
            highlight: ['Nos explican']
          }
        ]
      },
      {
        title: 'Verbs Like "Gustar"',
        content: `Some verbs work backwards - the thing liked is the subject, the person is the indirect object:`,
        examples: [
          {
            spanish: 'gustar (to like) → Me gusta el café.',
            english: 'to like → I like coffee. (Coffee is pleasing to me)',
            highlight: ['Me gusta']
          },
          {
            spanish: 'encantar (to love) → Te encanta la música.',
            english: 'to love → You love music. (Music is enchanting to you)',
            highlight: ['Te encanta']
          },
          {
            spanish: 'interesar (to interest) → Le interesan los libros.',
            english: 'to interest → Books interest him/her.',
            highlight: ['Le interesan']
          },
          {
            spanish: 'doler (to hurt) → Nos duele la cabeza.',
            english: 'to hurt → Our head hurts. (The head hurts to us)',
            highlight: ['Nos duele']
          }
        ]
      }
    ]
  },
  {
    title: 'Clarifying Le and Les',
    content: `Since **le** and **les** can refer to multiple people, Spanish often adds clarification:`,
    subsections: [
      {
        title: 'Adding Clarification',
        content: `Use **a + pronoun** or **a + noun** to clarify who le/les refers to:

**Le** can mean: to him, to her, to you (formal)
**Les** can mean: to them, to you all

Add clarification when context isn't clear.`,
        examples: [
          {
            spanish: 'Le hablo a él.',
            english: 'I speak to him. (clarifies le = to him)',
            highlight: ['Le', 'a él']
          },
          {
            spanish: 'Le hablo a ella.',
            english: 'I speak to her. (clarifies le = to her)',
            highlight: ['Le', 'a ella']
          },
          {
            spanish: 'Le hablo a usted.',
            english: 'I speak to you. (clarifies le = to you formal)',
            highlight: ['Le', 'a usted']
          },
          {
            spanish: 'Les escribo a mis padres.',
            english: 'I write to my parents. (clarifies les = to parents)',
            highlight: ['Les', 'a mis padres']
          }
        ]
      },
      {
        title: 'Redundant Pronouns',
        content: `In Spanish, it's common to use both the pronoun AND the clarifying phrase:

This is called **redundant pronoun use** and is grammatically correct in Spanish.`,
        examples: [
          {
            spanish: 'A María le gusta el chocolate.',
            english: 'María likes chocolate. (redundant: a María + le)',
            highlight: ['A María', 'le']
          },
          {
            spanish: 'A mis hermanos les compro regalos.',
            english: 'I buy gifts for my brothers. (redundant: a mis hermanos + les)',
            highlight: ['A mis hermanos', 'les']
          },
          {
            spanish: 'A ti te digo la verdad.',
            english: 'I tell you the truth. (redundant: a ti + te)',
            highlight: ['A ti', 'te']
          }
        ]
      }
    ]
  },
  {
    title: 'Pronoun Placement with Indirect Objects',
    content: `Indirect object pronouns follow the same placement rules as direct object pronouns:`,
    subsections: [
      {
        title: 'Standard Placement Rules',
        content: `**Before conjugated verbs**: Most common position
**Attached to infinitives**: Optional with verb + infinitive
**Attached to present participles**: With -ando/-iendo forms
**Attached to affirmative commands**: ¡Dime! (Tell me!)`,
        examples: [
          {
            spanish: 'Te voy a dar el libro. = Voy a darte el libro.',
            english: 'I\'m going to give you the book. (both correct)',
            highlight: ['Te voy', 'darte']
          },
          {
            spanish: 'Estoy diciéndole la verdad.',
            english: 'I am telling him/her the truth. (with accent)',
            highlight: ['diciéndole']
          },
          {
            spanish: '¡Dime! vs. ¡No me digas!',
            english: 'Tell me! vs. Don\'t tell me!',
            highlight: ['Dime', 'me digas']
          }
        ]
      }
    ]
  },
  {
    title: 'Double Object Pronouns',
    content: `When using both direct and indirect object pronouns together:

**Order**: Indirect + Direct (me lo, te la, se los, etc.)
**Le/Les + Lo/La/Los/Las**: Changes to **se**
**Position**: Both pronouns stay together`,
    examples: [
      {
        spanish: 'Me lo das. (You give it to me)',
        english: 'indirect (me) + direct (lo) = me lo',
        highlight: ['Me lo']
      },
      {
        spanish: 'Te la explico. (I explain it to you)',
        english: 'indirect (te) + direct (la) = te la',
        highlight: ['Te la']
      },
      {
        spanish: 'Se lo digo. (I tell it to him/her)',
        english: 'le + lo = se lo (le changes to se)',
        highlight: ['Se lo']
      },
      {
        spanish: 'Se las compro. (I buy them for him/her)',
        english: 'les + las = se las (les changes to se)',
        highlight: ['Se las']
      }
    ]
  },
  {
    title: 'Common Indirect Object Pronoun Mistakes',
    content: `Here are common mistakes Spanish learners make with indirect object pronouns:

**Mistake 1**: Confusing direct and indirect objects
**Mistake 2**: Trying to make le/les agree with gender
**Mistake 3**: Forgetting clarification with le/les
**Mistake 4**: Wrong order with double pronouns

Learning to avoid these mistakes will make your Spanish sound natural.`,
    examples: [
      {
        spanish: '❌ Lo doy el libro (should be indirect) → ✅ Le doy el libro',
        english: 'Wrong: I him give the book → Right: I give the book to him',
        highlight: ['Lo doy', 'Le doy']
      },
      {
        spanish: '❌ La hablo a María (trying gender agreement) → ✅ Le hablo a María',
        english: 'Wrong: I her speak to María → Right: I speak to María',
        highlight: ['La hablo', 'Le hablo']
      },
      {
        spanish: '❌ Le hablo (unclear who) → ✅ Le hablo a él/ella',
        english: 'Unclear: I speak to him/her → Clear: I speak to him/her',
        highlight: ['Le hablo', 'Le hablo a él/ella']
      },
      {
        spanish: '❌ Lo me das → ✅ Me lo das',
        english: 'Wrong: It me you give → Right: You give it to me',
        highlight: ['Lo me', 'Me lo']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'Direct Object Pronouns',
    url: '/grammar/spanish/pronouns/direct-object',
    difficulty: 'intermediate'
  },
  {
    title: 'Spanish Verb "Gustar"',
    url: '/grammar/spanish/verbs/gustar',
    difficulty: 'intermediate'
  },
  {
    title: 'Spanish Personal Pronouns',
    url: '/grammar/spanish/pronouns/personal',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Commands',
    url: '/grammar/spanish/verbs/commands',
    difficulty: 'intermediate'
  }
];

export default function SpanishIndirectObjectPronounsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'pronouns',
              topic: 'indirect-object',
              title: 'Spanish Indirect Object Pronouns',
              description: 'Master Spanish indirect object pronouns: me, te, le, nos, os, les. Learn to show to whom or for whom actions are done.',
              difficulty: 'intermediate',
              examples: [
                'le doy (I give to him/her)',
                'nos escriben (they write to us)',
                'te hablo (I speak to you)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'pronouns',
              topic: 'indirect-object',
              title: 'Spanish Indirect Object Pronouns'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="pronouns"
        topic="indirect-object"
        title="Spanish Indirect Object Pronouns"
        description="Master Spanish indirect object pronouns: me, te, le, nos, os, les. Learn to show to whom or for whom actions are done"
        difficulty="intermediate"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/spanish/pronouns"
        practiceUrl="/grammar/spanish/pronouns/indirect-object/practice"
        quizUrl="/grammar/spanish/pronouns/indirect-object/quiz"
        songUrl="/songs/es?theme=grammar&topic=indirect-object-pronouns"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
