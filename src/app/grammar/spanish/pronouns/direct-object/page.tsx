import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'pronouns',
  topic: 'direct-object',
  title: 'Spanish Direct Object Pronouns',
  description: 'Master Spanish direct object pronouns: me, te, lo, la, nos, os, los, las. Learn to replace direct objects and avoid repetition.',
  difficulty: 'intermediate',
  keywords: [
    'spanish direct object pronouns',
    'me te lo la spanish',
    'nos os los las spanish',
    'spanish grammar object pronouns',
    'pronombres objeto directo español',
    'spanish pronoun placement'
  ],
  examples: [
    'lo veo (I see him/it)',
    'la compro (I buy it)',
    'nos llaman (they call us)'
  ]
});

const sections = [
  {
    title: 'Spanish Direct Object Pronouns Overview',
    content: `Spanish direct object pronouns replace **direct objects** to avoid repetition and make speech more natural. They answer "what?" or "whom?" after the verb.

**Key Function**: Replace nouns that receive the action directly
**Position**: Usually go **before** the conjugated verb
**Agreement**: Must match the gender and number of the noun they replace

**Direct Object Test**: Ask "what?" or "whom?" after the verb. If there's an answer, it's a direct object that can be replaced with a pronoun.`,
    examples: [
      {
        spanish: 'Veo el libro → Lo veo.',
        english: 'I see the book → I see it. (lo replaces "el libro")',
        highlight: ['el libro', 'Lo']
      },
      {
        spanish: 'Compro la casa → La compro.',
        english: 'I buy the house → I buy it. (la replaces "la casa")',
        highlight: ['la casa', 'La']
      },
      {
        spanish: 'Llaman a María → La llaman.',
        english: 'They call María → They call her. (la replaces "a María")',
        highlight: ['a María', 'La']
      }
    ]
  },
  {
    title: 'Complete List of Direct Object Pronouns',
    content: `Here are all Spanish direct object pronouns:`,
    subsections: [
      {
        title: 'Direct Object Pronouns Chart',
        content: `Direct object pronouns must match the gender and number of the noun they replace:`,
        conjugationTable: {
          title: 'Spanish Direct Object Pronouns',
          conjugations: [
            { pronoun: 'me', form: 'me', english: 'Me ven (They see me)' },
            { pronoun: 'te', form: 'you (informal)', english: 'Te llamo (I call you)' },
            { pronoun: 'lo', form: 'him/it/you (formal m.)', english: 'Lo conozco (I know him)' },
            { pronoun: 'la', form: 'her/it/you (formal f.)', english: 'La veo (I see her)' },
            { pronoun: 'nos', form: 'us', english: 'Nos invitan (They invite us)' },
            { pronoun: 'os', form: 'you all (informal, Spain)', english: 'Os escucho (I listen to you all)' },
            { pronoun: 'los', form: 'them/you all (masculine)', english: 'Los compro (I buy them)' },
            { pronoun: 'las', form: 'them/you all (feminine)', english: 'Las leo (I read them)' }
          ]
        },
        examples: [
          {
            spanish: 'El profesor me ayuda.',
            english: 'The teacher helps me.',
            highlight: ['me']
          },
          {
            spanish: 'Te veo mañana.',
            english: 'I see you tomorrow.',
            highlight: ['Te']
          },
          {
            spanish: 'Lo necesito ahora.',
            english: 'I need it/him now.',
            highlight: ['Lo']
          },
          {
            spanish: 'Las estudiamos juntas.',
            english: 'We study them together. (feminine plural)',
            highlight: ['Las']
          }
        ]
      }
    ]
  },
  {
    title: 'Gender and Number Agreement',
    content: `Direct object pronouns must agree with the noun they replace:`,
    subsections: [
      {
        title: 'Third Person Agreement (lo, la, los, las)',
        content: `The third person pronouns change based on the gender and number of the replaced noun:

**Masculine singular**: lo (him/it)
**Feminine singular**: la (her/it)  
**Masculine plural**: los (them)
**Feminine plural**: las (them)`,
        examples: [
          {
            spanish: 'el libro → lo leo',
            english: 'the book → I read it (masculine singular)',
            highlight: ['el libro', 'lo']
          },
          {
            spanish: 'la revista → la leo',
            english: 'the magazine → I read it (feminine singular)',
            highlight: ['la revista', 'la']
          },
          {
            spanish: 'los coches → los vendo',
            english: 'the cars → I sell them (masculine plural)',
            highlight: ['los coches', 'los']
          },
          {
            spanish: 'las casas → las compro',
            english: 'the houses → I buy them (feminine plural)',
            highlight: ['las casas', 'las']
          }
        ]
      },
      {
        title: 'People vs. Things',
        content: `Direct object pronouns work the same for people and things:

**For people**: Use lo/la/los/las based on gender
**For things**: Use lo/la/los/las based on grammatical gender
**Important**: "A" before people doesn't change the pronoun choice`,
        examples: [
          {
            spanish: 'Veo a Juan → Lo veo.',
            english: 'I see Juan → I see him. (masculine person)',
            highlight: ['a Juan', 'Lo']
          },
          {
            spanish: 'Conozco a María → La conozco.',
            english: 'I know María → I know her. (feminine person)',
            highlight: ['a María', 'La']
          },
          {
            spanish: 'Invito a mis amigos → Los invito.',
            english: 'I invite my friends → I invite them. (masculine plural)',
            highlight: ['a mis amigos', 'Los']
          },
          {
            spanish: 'Llamo a las chicas → Las llamo.',
            english: 'I call the girls → I call them. (feminine plural)',
            highlight: ['a las chicas', 'Las']
          }
        ]
      }
    ]
  },
  {
    title: 'Pronoun Placement Rules',
    content: `Direct object pronouns have specific placement rules in Spanish:`,
    subsections: [
      {
        title: 'Before Conjugated Verbs',
        content: `The most common position is **before** the conjugated verb:

**Rule**: Pronoun + conjugated verb
**Applies to**: All tenses and moods`,
        examples: [
          {
            spanish: 'Lo veo todos los días.',
            english: 'I see him every day. (present tense)',
            highlight: ['Lo veo']
          },
          {
            spanish: 'La compré ayer.',
            english: 'I bought it yesterday. (preterite)',
            highlight: ['La compré']
          },
          {
            spanish: 'Los vamos a estudiar.',
            english: 'We are going to study them. (near future)',
            highlight: ['Los vamos']
          },
          {
            spanish: 'No te entiendo.',
            english: 'I don\'t understand you. (with negation)',
            highlight: ['te entiendo']
          }
        ]
      },
      {
        title: 'Attached to Infinitives',
        content: `With infinitives, you can attach the pronoun to the end:

**Option 1**: Before conjugated verb (Lo voy a hacer)
**Option 2**: Attached to infinitive (Voy a hacerlo)
**Both are correct** and equally common`,
        examples: [
          {
            spanish: 'Lo quiero comprar. = Quiero comprarlo.',
            english: 'I want to buy it. (both forms correct)',
            highlight: ['Lo quiero', 'comprarlo']
          },
          {
            spanish: 'La vamos a ver. = Vamos a verla.',
            english: 'We are going to see her. (both forms correct)',
            highlight: ['La vamos', 'verla']
          },
          {
            spanish: 'Los puedo ayudar. = Puedo ayudarlos.',
            english: 'I can help them. (both forms correct)',
            highlight: ['Los puedo', 'ayudarlos']
          }
        ]
      },
      {
        title: 'Attached to Present Participles',
        content: `With present participles (-ando/-iendo), attach the pronoun to the end:

**Rule**: Present participle + pronoun
**Note**: Add accent mark to maintain stress`,
        examples: [
          {
            spanish: 'Estoy leyéndolo.',
            english: 'I am reading it. (accent on é)',
            highlight: ['leyéndolo']
          },
          {
            spanish: 'Están comprándola.',
            english: 'They are buying it. (accent on á)',
            highlight: ['comprándola']
          },
          {
            spanish: 'Estamos viéndolos.',
            english: 'We are seeing them. (accent on é)',
            highlight: ['viéndolos']
          }
        ]
      },
      {
        title: 'Attached to Affirmative Commands',
        content: `With affirmative commands, attach the pronoun to the end:

**Affirmative**: Attach to end (¡Cómpralo!)
**Negative**: Before verb (¡No lo compres!)`,
        examples: [
          {
            spanish: '¡Cómpralo! vs. ¡No lo compres!',
            english: 'Buy it! vs. Don\'t buy it!',
            highlight: ['Cómpralo', 'lo compres']
          },
          {
            spanish: '¡Léela! vs. ¡No la leas!',
            english: 'Read it! vs. Don\'t read it!',
            highlight: ['Léela', 'la leas']
          },
          {
            spanish: '¡Ayúdanos! vs. ¡No nos ayudes!',
            english: 'Help us! vs. Don\'t help us!',
            highlight: ['Ayúdanos', 'nos ayudes']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Verbs with Direct Objects',
    content: `Many Spanish verbs commonly take direct objects that can be replaced with pronouns:`,
    subsections: [
      {
        title: 'Everyday Verbs',
        content: `These verbs frequently use direct object pronouns:`,
        examples: [
          {
            spanish: 'ver (to see) → Lo veo.',
            english: 'to see → I see him/it.',
            highlight: ['Lo veo']
          },
          {
            spanish: 'comprar (to buy) → La compro.',
            english: 'to buy → I buy it.',
            highlight: ['La compro']
          },
          {
            spanish: 'hacer (to do/make) → Los hago.',
            english: 'to do/make → I do/make them.',
            highlight: ['Los hago']
          },
          {
            spanish: 'leer (to read) → Las leo.',
            english: 'to read → I read them.',
            highlight: ['Las leo']
          },
          {
            spanish: 'conocer (to know) → Te conozco.',
            english: 'to know → I know you.',
            highlight: ['Te conozco']
          },
          {
            spanish: 'llamar (to call) → Me llaman.',
            english: 'to call → They call me.',
            highlight: ['Me llaman']
          }
        ]
      }
    ]
  },
  {
    title: 'Direct vs. Indirect Objects',
    content: `It's important to distinguish between direct and indirect objects:

**Direct Object**: Receives the action directly (answers "what?" or "whom?")
**Indirect Object**: Shows to/for whom the action is done (answers "to whom?" or "for whom?")

**Test**: Try putting "to" or "for" before the noun. If it makes sense, it's likely indirect.`,
    examples: [
      {
        spanish: 'Veo a María. (Direct: Whom do I see? María)',
        english: 'I see María. → La veo.',
        highlight: ['La veo']
      },
      {
        spanish: 'Doy el libro a María. (Indirect: To whom? To María)',
        english: 'I give the book to María. → Le doy el libro.',
        highlight: ['Le doy']
      },
      {
        spanish: 'Compro flores. (Direct: What do I buy? Flowers)',
        english: 'I buy flowers. → Las compro.',
        highlight: ['Las compro']
      },
      {
        spanish: 'Compro flores para María. (Indirect: For whom? For María)',
        english: 'I buy flowers for María. → Le compro flores.',
        highlight: ['Le compro']
      }
    ]
  },
  {
    title: 'Common Direct Object Pronoun Mistakes',
    content: `Here are common mistakes Spanish learners make with direct object pronouns:

**Mistake 1**: Wrong gender/number agreement
**Mistake 2**: Incorrect placement with infinitives
**Mistake 3**: Confusing direct and indirect objects
**Mistake 4**: Forgetting accent marks with participles

Learning to avoid these mistakes will make your Spanish sound natural.`,
    examples: [
      {
        spanish: '❌ La veo (referring to "el libro") → ✅ Lo veo',
        english: 'Wrong: I see it (wrong gender) → Right: I see it (masculine)',
        highlight: ['La veo', 'Lo veo']
      },
      {
        spanish: '❌ Quiero lo comprar → ✅ Lo quiero comprar / Quiero comprarlo',
        english: 'Wrong: I want it buy → Right: I want to buy it',
        highlight: ['lo comprar', 'Lo quiero comprar']
      },
      {
        spanish: '❌ Lo doy el libro (should be indirect) → ✅ Le doy el libro',
        english: 'Wrong: I him give the book → Right: I give the book to him',
        highlight: ['Lo doy', 'Le doy']
      },
      {
        spanish: '❌ Estoy leyendolo → ✅ Estoy leyéndolo',
        english: 'Wrong: I am reading it → Right: I am reading it (with accent)',
        highlight: ['leyendolo', 'leyéndolo']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'Indirect Object Pronouns',
    url: '/grammar/spanish/pronouns/indirect-object',
    difficulty: 'intermediate'
  },
  {
    title: 'Spanish Personal Pronouns',
    url: '/grammar/spanish/pronouns/personal',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Present Tense',
    url: '/grammar/spanish/verbs/present-tense',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Commands',
    url: '/grammar/spanish/verbs/commands',
    difficulty: 'intermediate'
  }
];

export default function SpanishDirectObjectPronounsPage() {
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
              topic: 'direct-object',
              title: 'Spanish Direct Object Pronouns',
              description: 'Master Spanish direct object pronouns: me, te, lo, la, nos, os, los, las. Learn to replace direct objects and avoid repetition.',
              difficulty: 'intermediate',
              examples: [
                'lo veo (I see him/it)',
                'la compro (I buy it)',
                'nos llaman (they call us)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'pronouns',
              topic: 'direct-object',
              title: 'Spanish Direct Object Pronouns'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="pronouns"
        topic="direct-object"
        title="Spanish Direct Object Pronouns"
        description="Master Spanish direct object pronouns: me, te, lo, la, nos, os, los, las. Learn to replace direct objects and avoid repetition"
        difficulty="intermediate"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/spanish/pronouns"
        practiceUrl="/grammar/spanish/pronouns/direct-object/practice"
        quizUrl="/grammar/spanish/pronouns/direct-object/quiz"
        songUrl="/songs/es?theme=grammar&topic=direct-object-pronouns"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
