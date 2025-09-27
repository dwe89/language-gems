import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'pronouns',
  topic: 'indirect-object',
  title: 'French Indirect Object Pronouns (Me, Te, Lui, Nous, Vous, Leur)',
  description: 'Master French indirect object pronouns with à verbs. Learn me, te, lui, nous, vous, leur placement and usage.',
  difficulty: 'intermediate',
  keywords: [
    'french indirect object pronouns',
    'me te lui nous vous leur',
    'indirect object french',
    'à verbs french',
    'french grammar pronouns',
    'lui leur french'
  ],
  examples: [
    'Je lui parle (I speak to him/her)',
    'Elle nous donne (She gives to us)',
    'Tu leur écris (You write to them)',
    'Il me téléphone (He calls me)'
  ]
});

const sections = [
  {
    title: 'Understanding Indirect Object Pronouns',
    content: `French indirect object pronouns replace **indirect objects** - the person or thing that indirectly receives the action of the verb.

They answer "to whom?" or "for whom?" and typically replace phrases with **à** (to). Many French verbs require **à** before their object.

Like direct object pronouns, they go **before** the conjugated verb to avoid repetition.`,
    examples: [
      {
        spanish: 'Je parle à Marie. → Je lui parle. (I speak to Marie. → I speak to her.)',
        english: 'Lui replaces à Marie',
        highlight: ['lui parle']
      },
      {
        spanish: 'Nous donnons le livre aux enfants. → Nous leur donnons le livre. (We give the book to the children. → We give the book to them.)',
        english: 'Leur replaces aux enfants',
        highlight: ['leur donnons']
      }
    ]
  },
  {
    title: 'The Six Indirect Object Pronouns',
    content: `French has six indirect object pronouns:`,
    subsections: [
      {
        title: 'Complete Indirect Object Pronoun System',
        content: 'All French indirect object pronouns:',
        conjugationTable: {
          title: 'French Indirect Object Pronouns',
          conjugations: [
            { pronoun: 'me (m\')', form: '1st person singular', english: 'to me' },
            { pronoun: 'te (t\')', form: '2nd person singular', english: 'to you (informal)' },
            { pronoun: 'lui', form: '3rd person singular', english: 'to him/her' },
            { pronoun: 'nous', form: '1st person plural', english: 'to us' },
            { pronoun: 'vous', form: '2nd person plural/formal', english: 'to you (formal/plural)' },
            { pronoun: 'leur', form: '3rd person plural', english: 'to them' }
          ]
        }
      },
      {
        title: 'Key Differences from Direct Object Pronouns',
        content: 'Important differences to remember:',
        examples: [
          {
            spanish: 'Third person: lui (both masculine and feminine singular)',
            english: 'No separate le/la forms - lui works for both',
            highlight: ['lui']
          },
          {
            spanish: 'Third person plural: leur (both masculine and feminine)',
            english: 'Not les - leur is specifically for indirect objects',
            highlight: ['leur']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Verbs with Indirect Objects',
    content: `Many French verbs require **à** and therefore use indirect object pronouns:`,
    subsections: [
      {
        title: 'Communication Verbs',
        content: 'Verbs about speaking and communication:',
        conjugationTable: {
          title: 'Communication Verbs + À',
          conjugations: [
            { pronoun: 'parler à', form: 'to speak to', english: 'Je lui parle. (I speak to him/her.)' },
            { pronoun: 'téléphoner à', form: 'to call', english: 'Elle me téléphone. (She calls me.)' },
            { pronoun: 'écrire à', form: 'to write to', english: 'Tu leur écris. (You write to them.)' },
            { pronoun: 'répondre à', form: 'to answer', english: 'Il nous répond. (He answers us.)' }
          ]
        }
      },
      {
        title: 'Giving and Showing Verbs',
        content: 'Verbs about giving and showing:',
        examples: [
          {
            spanish: 'donner à (to give to): Je lui donne le livre. (I give the book to him/her.)',
            english: 'offrir à (to offer to): Elle nous offre du café. (She offers us coffee.)',
            highlight: ['lui donne', 'nous offre']
          },
          {
            spanish: 'montrer à (to show to): Tu leur montres la photo. (You show them the photo.)',
            english: 'envoyer à (to send to): Il me envoie une lettre. (He sends me a letter.)',
            highlight: ['leur montres', 'me envoie']
          }
        ]
      },
      {
        title: 'Other Common À Verbs',
        content: 'Additional verbs requiring indirect objects:',
        examples: [
          {
            spanish: 'plaire à (to please): Ce film lui plaît. (This movie pleases him/her.)',
            english: 'ressembler à (to resemble): Tu me ressembles. (You resemble me.)',
            highlight: ['lui plaît', 'me ressembles']
          },
          {
            spanish: 'obéir à (to obey): Les enfants leur obéissent. (The children obey them.)',
            english: 'mentir à (to lie to): Il nous ment. (He lies to us.)',
            highlight: ['leur obéissent', 'nous ment']
          }
        ]
      }
    ]
  },
  {
    title: 'Pronoun Placement Rules',
    content: `Indirect object pronouns follow the same placement rules as direct object pronouns:`,
    examples: [
      {
        spanish: 'Je lui parle. (I speak to him/her.)',
        english: 'Present tense - pronoun before verb',
        highlight: ['lui parle']
      },
      {
        spanish: 'Elle nous a téléphoné. (She called us.)',
        english: 'Passé composé - pronoun before auxiliary',
        highlight: ['nous a']
      },
      {
        spanish: 'Tu leur écriras. (You will write to them.)',
        english: 'Future tense - pronoun before verb',
        highlight: ['leur écriras']
      }
    ],
    subsections: [
      {
        title: 'With Infinitives',
        content: 'Pronouns go before the infinitive:',
        examples: [
          {
            spanish: 'Je veux lui parler. (I want to speak to him/her.)',
            english: 'Elle va nous téléphoner. (She is going to call us.)',
            highlight: ['lui parler', 'nous téléphoner']
          }
        ]
      },
      {
        title: 'With Imperatives',
        content: 'Positive commands: after verb; Negative commands: before verb:',
        examples: [
          {
            spanish: 'Parle-lui! (Speak to him/her!)',
            english: 'Ne lui parle pas! (Don\'t speak to him/her!)',
            highlight: ['Parle-lui', 'lui parle']
          }
        ]
      }
    ]
  },
  {
    title: 'LUI vs LEUR Usage',
    content: `The key distinction in third person indirect object pronouns:`,
    examples: [
      {
        spanish: 'Je parle à Pierre. → Je lui parle. (I speak to Pierre. → I speak to him.)',
        english: 'Singular person - use lui',
        highlight: ['lui parle']
      },
      {
        spanish: 'Je parle à Marie. → Je lui parle. (I speak to Marie. → I speak to her.)',
        english: 'Singular person - use lui (same for feminine)',
        highlight: ['lui parle']
      },
      {
        spanish: 'Je parle aux enfants. → Je leur parle. (I speak to the children. → I speak to them.)',
        english: 'Plural people - use leur',
        highlight: ['leur parle']
      }
    ],
    subsections: [
      {
        title: 'LUI - Singular (Both Genders)',
        content: 'Lui replaces any singular person:',
        examples: [
          {
            spanish: 'À mon père → lui: Je lui téléphone. (I call him.)',
            english: 'À ma mère → lui: Je lui téléphone. (I call her.)',
            highlight: ['lui téléphone']
          },
          {
            spanish: 'Au professeur → lui: Tu lui réponds. (You answer him.)',
            english: 'À la professeure → lui: Tu lui réponds. (You answer her.)',
            highlight: ['lui réponds']
          }
        ]
      },
      {
        title: 'LEUR - Plural (Both Genders)',
        content: 'Leur replaces any plural people:',
        examples: [
          {
            spanish: 'Aux garçons → leur: Elle leur donne des bonbons. (She gives them candy.)',
            english: 'Aux filles → leur: Elle leur donne des bonbons. (She gives them candy.)',
            highlight: ['leur donne']
          }
        ]
      }
    ]
  },
  {
    title: 'No Past Participle Agreement',
    content: `Unlike direct object pronouns, indirect object pronouns do **NOT** cause past participle agreement:`,
    examples: [
      {
        spanish: 'Je lui ai parlé. (I spoke to him/her.)',
        english: 'Parlé stays unchanged - no agreement with lui',
        highlight: ['lui ai parlé']
      },
      {
        spanish: 'Elle leur a téléphoné. (She called them.)',
        english: 'Téléphoné stays unchanged - no agreement with leur',
        highlight: ['leur a téléphoné']
      }
    ],
    subsections: [
      {
        title: 'Comparison with Direct Objects',
        content: 'Direct vs indirect object agreement:',
        examples: [
          {
            spanish: 'Direct: Je l\'ai vue. (I saw her.) - agreement with la',
            english: 'Indirect: Je lui ai parlé. (I spoke to her.) - no agreement',
            highlight: ['l\'ai vue', 'lui ai parlé']
          },
          {
            spanish: 'Direct: Je les ai vus. (I saw them.) - agreement with les',
            english: 'Indirect: Je leur ai parlé. (I spoke to them.) - no agreement',
            highlight: ['les ai vus', 'leur ai parlé']
          }
        ]
      }
    ]
  },
  {
    title: 'Double Pronoun Order',
    content: `When using both direct and indirect object pronouns, there\'s a specific order:`,
    examples: [
      {
        spanish: 'Je donne le livre à Marie. → Je le lui donne. (I give the book to Marie. → I give it to her.)',
        english: 'Order: le (direct) + lui (indirect)',
        highlight: ['le lui donne']
      },
      {
        spanish: 'Il nous montre les photos. → Il nous les montre. (He shows us the photos. → He shows them to us.)',
        english: 'Order: nous (indirect) + les (direct)',
        highlight: ['nous les montre']
      }
    ],
    subsections: [
      {
        title: 'Double Pronoun Order Rules',
        content: 'The order depends on which pronouns are used:',
        conjugationTable: {
          title: 'Double Pronoun Order',
          conjugations: [
            { pronoun: 'me/te/nous/vous', form: '+ le/la/les', english: 'Il me le donne. (He gives it to me.)' },
            { pronoun: 'le/la/les', form: '+ lui/leur', english: 'Je le lui donne. (I give it to him/her.)' }
          ]
        }
      }
    ]
  },
  {
    title: 'Common Indirect Object Pronoun Mistakes',
    content: `Here are frequent errors students make:

**1. Using direct instead of indirect**: Using le/la instead of lui
**2. Wrong plural form**: Using les instead of leur
**3. Unnecessary agreement**: Adding agreement with past participles
**4. Wrong verb choice**: Not recognizing à verbs`,
    examples: [
      {
        spanish: '❌ Je le parle (to him) → ✅ Je lui parle',
        english: 'Wrong: parler à requires indirect object',
        highlight: ['lui parle']
      },
      {
        spanish: '❌ Je les parle (to them) → ✅ Je leur parle',
        english: 'Wrong: plural indirect object is leur',
        highlight: ['leur parle']
      },
      {
        spanish: '❌ Je lui ai parlée → ✅ Je lui ai parlé',
        english: 'Wrong: no agreement with indirect objects',
        highlight: ['lui ai parlé']
      },
      {
        spanish: '❌ Je regarde lui → ✅ Je le regarde',
        english: 'Wrong: regarder takes direct object',
        highlight: ['le regarde']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Direct Object Pronouns', url: '/grammar/french/pronouns/direct-object', difficulty: 'intermediate' },
  { title: 'French Verbs with À', url: '/grammar/french/verbs/preposition-a', difficulty: 'intermediate' },
  { title: 'French Double Pronouns', url: '/grammar/french/pronouns/double-pronouns', difficulty: 'advanced' },
  { title: 'French Past Participle Agreement', url: '/grammar/french/verbs/past-participle-agreement', difficulty: 'advanced' }
];

export default function FrenchIndirectObjectPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'pronouns',
              topic: 'indirect-object',
              title: 'French Indirect Object Pronouns (Me, Te, Lui, Nous, Vous, Leur)',
              description: 'Master French indirect object pronouns with à verbs. Learn me, te, lui, nous, vous, leur placement and usage.',
              difficulty: 'intermediate',
              examples: [
                'Je lui parle (I speak to him/her)',
                'Elle nous donne (She gives to us)',
                'Tu leur écris (You write to them)',
                'Il me téléphone (He calls me)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'pronouns',
              topic: 'indirect-object',
              title: 'French Indirect Object Pronouns (Me, Te, Lui, Nous, Vous, Leur)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="pronouns"
        topic="indirect-object"
        title="French Indirect Object Pronouns (Me, Te, Lui, Nous, Vous, Leur)"
        description="Master French indirect object pronouns with à verbs. Learn me, te, lui, nous, vous, leur placement and usage"
        difficulty="intermediate"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/french/pronouns"
        practiceUrl="/grammar/french/pronouns/indirect-object/practice"
        quizUrl="/grammar/french/pronouns/indirect-object/quiz"
        songUrl="/songs/fr?theme=grammar&topic=indirect-object"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
