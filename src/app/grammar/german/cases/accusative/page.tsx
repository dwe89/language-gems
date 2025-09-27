import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'cases',
  topic: 'accusative',
  title: 'German Accusative Case',
  description: 'Master the German Accusative case - the direct object case. Learn den/die/das forms and when to use Akkusativ.',
  difficulty: 'beginner',
  keywords: [
    'german accusative case',
    'akkusativ deutsch',
    'den die das accusative',
    'german direct object',
    'german grammar accusative',
    'wen oder was',
    'german articles accusative'
  ],
  examples: [
    'Ich sehe den Mann (I see the man)',
    'Sie kauft das Buch (She buys the book)',
    'Wir haben eine Katze (We have a cat)'
  ]
});

const sections = [
  {
    title: 'German Accusative Case Overview',
    content: `The Accusative case (**Akkusativ**) is the **direct object case** in German. It answers the questions "**Wen?**" (Whom?) or "**Was?**" (What?) and identifies who or what directly receives the action of the verb.

The Accusative case is the second most important case after Nominative and is essential for forming complete German sentences with transitive verbs.

**Key Function**: The Accusative case identifies the **direct object** - the person or thing that directly receives the action of the verb.`,
    examples: [
      {
        spanish: 'Ich lese das Buch.',
        english: 'I read the book. (das Buch = direct object in Accusative)',
        highlight: ['das Buch']
      },
      {
        spanish: 'Sie sieht den Hund.',
        english: 'She sees the dog. (den Hund = direct object in Accusative)',
        highlight: ['den Hund']
      },
      {
        spanish: 'Wir kaufen eine Lampe.',
        english: 'We buy a lamp. (eine Lampe = direct object in Accusative)',
        highlight: ['eine Lampe']
      }
    ]
  },
  {
    title: 'Accusative Articles',
    content: `In the Accusative case, German articles change from their Nominative forms. Only **masculine articles** change - feminine, neuter, and plural remain the same.

**Key Change**: der → den (masculine definite article)
**Key Change**: ein → einen (masculine indefinite article)

This is the most important change to remember for the Accusative case.`,
    subsections: [
      {
        title: 'Definite Articles - Accusative',
        content: `The definite articles in Accusative case:`,
        conjugationTable: {
          title: 'Definite Articles - Accusative Case',
          conjugations: [
            { pronoun: 'Masculine', form: 'den', english: 'the (masculine) - CHANGES!' },
            { pronoun: 'Feminine', form: 'die', english: 'the (feminine) - same as Nominative' },
            { pronoun: 'Neuter', form: 'das', english: 'the (neuter) - same as Nominative' },
            { pronoun: 'Plural', form: 'die', english: 'the (plural) - same as Nominative' }
          ]
        },
        examples: [
          {
            spanish: 'Ich sehe den Mann. (der Mann → den Mann)',
            english: 'I see the man. (masculine changes)',
            highlight: ['den Mann']
          },
          {
            spanish: 'Ich sehe die Frau. (die Frau → die Frau)',
            english: 'I see the woman. (feminine stays same)',
            highlight: ['die Frau']
          },
          {
            spanish: 'Ich sehe das Kind. (das Kind → das Kind)',
            english: 'I see the child. (neuter stays same)',
            highlight: ['das Kind']
          },
          {
            spanish: 'Ich sehe die Kinder. (die Kinder → die Kinder)',
            english: 'I see the children. (plural stays same)',
            highlight: ['die Kinder']
          }
        ]
      },
      {
        title: 'Indefinite Articles - Accusative',
        content: `The indefinite articles in Accusative case:`,
        conjugationTable: {
          title: 'Indefinite Articles - Accusative Case',
          conjugations: [
            { pronoun: 'Masculine', form: 'einen', english: 'a/an (masculine) - CHANGES!' },
            { pronoun: 'Feminine', form: 'eine', english: 'a/an (feminine) - same as Nominative' },
            { pronoun: 'Neuter', form: 'ein', english: 'a/an (neuter) - same as Nominative' },
            { pronoun: 'Plural', form: '(keine)', english: 'no plural indefinite article' }
          ]
        },
        examples: [
          {
            spanish: 'Ich kaufe einen Tisch. (ein Tisch → einen Tisch)',
            english: 'I buy a table. (masculine changes)',
            highlight: ['einen Tisch']
          },
          {
            spanish: 'Ich kaufe eine Lampe. (eine Lampe → eine Lampe)',
            english: 'I buy a lamp. (feminine stays same)',
            highlight: ['eine Lampe']
          },
          {
            spanish: 'Ich kaufe ein Auto. (ein Auto → ein Auto)',
            english: 'I buy a car. (neuter stays same)',
            highlight: ['ein Auto']
          }
        ]
      }
    ]
  },
  {
    title: 'When to Use Accusative Case',
    content: `The Accusative case is used in several specific situations:`,
    subsections: [
      {
        title: '1. Direct Object of Transitive Verbs',
        content: `The most common use - the person or thing directly receiving the action:`,
        examples: [
          {
            spanish: 'Der Lehrer erklärt die Lektion.',
            english: 'The teacher explains the lesson. (die Lektion = direct object)',
            highlight: ['die Lektion']
          },
          {
            spanish: 'Ich trinke einen Kaffee.',
            english: 'I drink a coffee. (einen Kaffee = direct object)',
            highlight: ['einen Kaffee']
          },
          {
            spanish: 'Sie liest das Buch.',
            english: 'She reads the book. (das Buch = direct object)',
            highlight: ['das Buch']
          }
        ]
      },
      {
        title: '2. Time Expressions (Duration)',
        content: `Accusative is used for expressions of time duration:`,
        examples: [
          {
            spanish: 'Ich arbeite den ganzen Tag.',
            english: 'I work the whole day. (time duration)',
            highlight: ['den ganzen Tag']
          },
          {
            spanish: 'Wir bleiben eine Woche.',
            english: 'We stay for a week. (time duration)',
            highlight: ['eine Woche']
          },
          {
            spanish: 'Er schläft jeden Tag acht Stunden.',
            english: 'He sleeps eight hours every day. (time duration)',
            highlight: ['jeden Tag', 'acht Stunden']
          }
        ]
      },
      {
        title: '3. Accusative Prepositions',
        content: `Certain prepositions always require Accusative case:`,
        conjugationTable: {
          title: 'Accusative Prepositions',
          conjugations: [
            { pronoun: 'durch', form: 'through', english: 'durch den Park (through the park)' },
            { pronoun: 'für', form: 'for', english: 'für den Mann (for the man)' },
            { pronoun: 'gegen', form: 'against', english: 'gegen die Wand (against the wall)' },
            { pronoun: 'ohne', form: 'without', english: 'ohne das Auto (without the car)' },
            { pronoun: 'um', form: 'around/at', english: 'um den Tisch (around the table)' }
          ]
        },
        examples: [
          {
            spanish: 'Ich gehe durch den Park.',
            english: 'I walk through the park.',
            highlight: ['durch den Park']
          },
          {
            spanish: 'Das Geschenk ist für die Mutter.',
            english: 'The gift is for the mother.',
            highlight: ['für die Mutter']
          },
          {
            spanish: 'Wir fahren ohne das Auto.',
            english: 'We drive without the car.',
            highlight: ['ohne das Auto']
          }
        ]
      }
    ]
  },
  {
    title: 'Identifying the Accusative Case',
    content: `To identify the Accusative case in a sentence, ask these questions:

**"Wen?"** (Whom?) - for people
**"Was?"** (What?) - for things

The answer to these questions will be in the Accusative case. This helps you identify the direct object.

**Important**: The subject (Nominative) performs the action, the direct object (Accusative) receives it.`,
    examples: [
      {
        spanish: 'Der Student liest ein Buch.',
        english: 'The student reads a book. → Was liest er? → ein Buch (Accusative)',
        highlight: ['ein Buch']
      },
      {
        spanish: 'Die Mutter ruft den Sohn.',
        english: 'The mother calls the son. → Wen ruft sie? → den Sohn (Accusative)',
        highlight: ['den Sohn']
      },
      {
        spanish: 'Wir sehen die Berge.',
        english: 'We see the mountains. → Was sehen wir? → die Berge (Accusative)',
        highlight: ['die Berge']
      },
      {
        spanish: 'Er kauft einen Computer.',
        english: 'He buys a computer. → Was kauft er? → einen Computer (Accusative)',
        highlight: ['einen Computer']
      }
    ]
  },
  {
    title: 'Accusative Pronouns',
    content: `Personal pronouns in the Accusative case are used as direct objects:`,
    subsections: [
      {
        title: 'Personal Pronouns - Accusative',
        content: `These are the direct object pronouns in German:`,
        conjugationTable: {
          title: 'Personal Pronouns - Accusative Case',
          conjugations: [
            { pronoun: 'mich', form: 'me', english: 'first person singular' },
            { pronoun: 'dich', form: 'you', english: 'second person singular (informal)' },
            { pronoun: 'ihn', form: 'him', english: 'third person singular masculine' },
            { pronoun: 'sie', form: 'her', english: 'third person singular feminine' },
            { pronoun: 'es', form: 'it', english: 'third person singular neuter' },
            { pronoun: 'uns', form: 'us', english: 'first person plural' },
            { pronoun: 'euch', form: 'you', english: 'second person plural (informal)' },
            { pronoun: 'sie', form: 'them', english: 'third person plural' },
            { pronoun: 'Sie', form: 'you', english: 'formal (singular/plural)' }
          ]
        },
        examples: [
          {
            spanish: 'Er sieht mich.',
            english: 'He sees me.',
            highlight: ['mich']
          },
          {
            spanish: 'Ich kenne dich.',
            english: 'I know you.',
            highlight: ['dich']
          },
          {
            spanish: 'Sie liebt ihn.',
            english: 'She loves him.',
            highlight: ['ihn']
          },
          {
            spanish: 'Wir besuchen sie.',
            english: 'We visit them.',
            highlight: ['sie']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Accusative Patterns',
    content: `Certain sentence patterns always use the Accusative case:

**Pattern 1**: Subject + Transitive Verb + Direct Object (Accusative)
**Pattern 2**: Subject + Verb + Accusative Preposition + Object
**Pattern 3**: "Es gibt" + Accusative Object (There is/are)

Understanding these patterns helps you use the Accusative case correctly.`,
    examples: [
      {
        spanish: 'Der Hund frisst das Fleisch.',
        english: 'The dog eats the meat. (transitive verb pattern)',
        highlight: ['das Fleisch']
      },
      {
        spanish: 'Ich gehe durch den Wald.',
        english: 'I walk through the forest. (accusative preposition)',
        highlight: ['durch den Wald']
      },
      {
        spanish: 'Es gibt einen Park in der Stadt.',
        english: 'There is a park in the city. ("es gibt" + accusative)',
        highlight: ['einen Park']
      },
      {
        spanish: 'Sie macht ihre Hausaufgaben.',
        english: 'She does her homework. (transitive verb)',
        highlight: ['ihre Hausaufgaben']
      }
    ]
  },
  {
    title: 'Accusative in Sentences with Multiple Objects',
    content: `Some sentences have both Accusative (direct object) and Dative (indirect object):

**Pattern**: Subject + Verb + Dative (indirect) + Accusative (direct)
**Word Order**: Dative usually comes before Accusative
**Pronouns**: Accusative pronouns come before Dative nouns

This is common with verbs like "geben" (to give), "schenken" (to give as gift), "zeigen" (to show).`,
    examples: [
      {
        spanish: 'Ich gebe dem Mann das Buch.',
        english: 'I give the man the book. (dem Mann = Dative, das Buch = Accusative)',
        highlight: ['dem Mann', 'das Buch']
      },
      {
        spanish: 'Sie schenkt der Tochter eine Puppe.',
        english: 'She gives the daughter a doll. (der Tochter = Dative, eine Puppe = Accusative)',
        highlight: ['der Tochter', 'eine Puppe']
      },
      {
        spanish: 'Er zeigt es dem Lehrer.',
        english: 'He shows it to the teacher. (es = Accusative pronoun before Dative noun)',
        highlight: ['es', 'dem Lehrer']
      },
      {
        spanish: 'Wir kaufen ihm einen Computer.',
        english: 'We buy him a computer. (ihm = Dative, einen Computer = Accusative)',
        highlight: ['ihm', 'einen Computer']
      }
    ]
  },
  {
    title: 'Accusative vs Nominative',
    content: `Distinguishing between Nominative (subject) and Accusative (direct object) is crucial:

**Nominative**: Who/what does the action (subject)
**Accusative**: Who/what receives the action (direct object)

**Memory tip**: The Nominative "does" something TO the Accusative.
**Article changes**: Only masculine articles change (der→den, ein→einen)`,
    examples: [
      {
        spanish: 'Der Hund (Nom.) sieht den Kater (Acc.).',
        english: 'The dog sees the cat.',
        highlight: ['Der Hund', 'den Kater']
      },
      {
        spanish: 'Die Mutter (Nom.) ruft die Tochter (Acc.).',
        english: 'The mother calls the daughter.',
        highlight: ['Die Mutter', 'die Tochter']
      },
      {
        spanish: 'Das Kind (Nom.) hat einen Ball (Acc.).',
        english: 'The child has a ball.',
        highlight: ['Das Kind', 'einen Ball']
      },
      {
        spanish: 'Ein Mann (Nom.) kauft das Auto (Acc.).',
        english: 'A man buys the car.',
        highlight: ['Ein Mann', 'das Auto']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'German Nominative Case',
    url: '/grammar/german/cases/nominative',
    difficulty: 'beginner'
  },
  {
    title: 'German Dative Case',
    url: '/grammar/german/cases/dative',
    difficulty: 'intermediate'
  },
  {
    title: 'German Prepositions',
    url: '/grammar/german/prepositions/accusative-prepositions',
    difficulty: 'intermediate'
  },
  {
    title: 'German Articles',
    url: '/grammar/german/nouns/articles',
    difficulty: 'beginner'
  }
];

export default function GermanAccusativePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'german',
              category: 'cases',
              topic: 'accusative',
              title: 'German Accusative Case',
              description: 'Master the German Accusative case - the direct object case. Learn den/die/das forms and when to use Akkusativ.',
              difficulty: 'beginner',
              examples: [
                'Ich sehe den Mann (I see the man)',
                'Sie kauft das Buch (She buys the book)',
                'Wir haben eine Katze (We have a cat)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'cases',
              topic: 'accusative',
              title: 'German Accusative Case'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="german"
        category="cases"
        topic="accusative"
        title="German Accusative Case"
        description="Master the German Accusative case - the direct object case. Learn den/die/das forms and when to use Akkusativ"
        difficulty="beginner"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/german/cases"
        practiceUrl="/grammar/german/cases/accusative/practice"
        quizUrl="/grammar/german/cases/accusative/quiz"
        songUrl="/songs/de?theme=grammar&topic=accusative"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
