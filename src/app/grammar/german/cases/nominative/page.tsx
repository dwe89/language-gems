import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'cases',
  topic: 'nominative',
  title: 'German Nominative Case',
  description: 'Master the German Nominative case - the subject case. Learn der/die/das forms and when to use Nominativ.',
  difficulty: 'beginner',
  keywords: [
    'german nominative case',
    'nominativ deutsch',
    'der die das nominative',
    'german subject case',
    'german grammar nominative',
    'german articles nominative',
    'wer oder was'
  ],
  examples: [
    'Der Mann ist groß (The man is tall)',
    'Die Frau arbeitet (The woman works)',
    'Das Kind spielt (The child plays)'
  ]
});

const sections = [
  {
    title: 'German Nominative Case Overview',
    content: `The Nominative case (**Nominativ**) is the **subject case** in German. It answers the questions "**Wer?**" (Who?) or "**Was?**" (What?) and identifies who or what is performing the action in a sentence.

The Nominative case is the **default case** - it's the form you'll find in dictionaries and the form used for the subject of sentences. Every German sentence has at least one noun or pronoun in the Nominative case.

**Key Function**: The Nominative case identifies the **subject** of the sentence - the person, animal, or thing that performs the action.`,
    examples: [
      {
        spanish: 'Der Hund bellt.',
        english: 'The dog barks. (Der Hund = subject in Nominative)',
        highlight: ['Der Hund']
      },
      {
        spanish: 'Die Katze schläft.',
        english: 'The cat sleeps. (Die Katze = subject in Nominative)',
        highlight: ['Die Katze']
      },
      {
        spanish: 'Das Auto ist rot.',
        english: 'The car is red. (Das Auto = subject in Nominative)',
        highlight: ['Das Auto']
      }
    ]
  },
  {
    title: 'Nominative Articles',
    content: `In the Nominative case, German articles have their basic dictionary forms. These are the forms you should memorize first when learning German nouns.`,
    subsections: [
      {
        title: 'Definite Articles (The)',
        content: `The definite articles in Nominative case:`,
        conjugationTable: {
          title: 'Definite Articles - Nominative Case',
          conjugations: [
            { pronoun: 'Masculine', form: 'der', english: 'the (masculine)' },
            { pronoun: 'Feminine', form: 'die', english: 'the (feminine)' },
            { pronoun: 'Neuter', form: 'das', english: 'the (neuter)' },
            { pronoun: 'Plural', form: 'die', english: 'the (plural)' }
          ]
        },
        examples: [
          {
            spanish: 'der Mann (the man), der Tisch (the table)',
            english: 'Masculine nouns use "der"',
            highlight: ['der']
          },
          {
            spanish: 'die Frau (the woman), die Lampe (the lamp)',
            english: 'Feminine nouns use "die"',
            highlight: ['die']
          },
          {
            spanish: 'das Kind (the child), das Haus (the house)',
            english: 'Neuter nouns use "das"',
            highlight: ['das']
          },
          {
            spanish: 'die Männer (the men), die Frauen (the women)',
            english: 'All plural nouns use "die"',
            highlight: ['die']
          }
        ]
      },
      {
        title: 'Indefinite Articles (A/An)',
        content: `The indefinite articles in Nominative case:`,
        conjugationTable: {
          title: 'Indefinite Articles - Nominative Case',
          conjugations: [
            { pronoun: 'Masculine', form: 'ein', english: 'a/an (masculine)' },
            { pronoun: 'Feminine', form: 'eine', english: 'a/an (feminine)' },
            { pronoun: 'Neuter', form: 'ein', english: 'a/an (neuter)' },
            { pronoun: 'Plural', form: '(keine)', english: 'no plural indefinite article' }
          ]
        },
        examples: [
          {
            spanish: 'ein Mann (a man), ein Tisch (a table)',
            english: 'Masculine nouns use "ein"',
            highlight: ['ein']
          },
          {
            spanish: 'eine Frau (a woman), eine Lampe (a lamp)',
            english: 'Feminine nouns use "eine"',
            highlight: ['eine']
          },
          {
            spanish: 'ein Kind (a child), ein Haus (a house)',
            english: 'Neuter nouns use "ein"',
            highlight: ['ein']
          },
          {
            spanish: 'Männer (men), Frauen (women) - no article',
            english: 'Plural has no indefinite article',
            highlight: ['Männer', 'Frauen']
          }
        ]
      }
    ]
  },
  {
    title: 'When to Use Nominative Case',
    content: `The Nominative case is used in several specific situations:`,
    subsections: [
      {
        title: '1. Subject of the Sentence',
        content: `The most common use - the person or thing performing the action:`,
        examples: [
          {
            spanish: 'Der Lehrer erklärt die Lektion.',
            english: 'The teacher explains the lesson.',
            highlight: ['Der Lehrer']
          },
          {
            spanish: 'Eine Katze sitzt auf dem Dach.',
            english: 'A cat sits on the roof.',
            highlight: ['Eine Katze']
          },
          {
            spanish: 'Das Wetter ist heute schön.',
            english: 'The weather is nice today.',
            highlight: ['Das Wetter']
          }
        ]
      },
      {
        title: '2. Predicate Nominative (with "sein")',
        content: `After the verb "sein" (to be), both the subject and the predicate use Nominative:`,
        examples: [
          {
            spanish: 'Er ist ein guter Lehrer.',
            english: 'He is a good teacher. (both "Er" and "ein Lehrer" are Nominative)',
            highlight: ['Er', 'ein guter Lehrer']
          },
          {
            spanish: 'Das ist meine Schwester.',
            english: 'That is my sister. (both "Das" and "meine Schwester" are Nominative)',
            highlight: ['Das', 'meine Schwester']
          },
          {
            spanish: 'Die Frau ist eine Ärztin.',
            english: 'The woman is a doctor. (both "Die Frau" and "eine Ärztin" are Nominative)',
            highlight: ['Die Frau', 'eine Ärztin']
          }
        ]
      },
      {
        title: '3. Other Linking Verbs',
        content: `Verbs like "werden" (to become), "bleiben" (to remain) also use Nominative for both subject and predicate:`,
        examples: [
          {
            spanish: 'Er wird ein Arzt.',
            english: 'He is becoming a doctor.',
            highlight: ['Er', 'ein Arzt']
          },
          {
            spanish: 'Sie bleibt eine gute Freundin.',
            english: 'She remains a good friend.',
            highlight: ['Sie', 'eine gute Freundin']
          },
          {
            spanish: 'Das Kind wird müde.',
            english: 'The child is getting tired.',
            highlight: ['Das Kind']
          }
        ]
      }
    ]
  },
  {
    title: 'Identifying the Nominative Case',
    content: `To identify the Nominative case in a sentence, ask these questions:

**"Wer?"** (Who?) - for people
**"Was?"** (What?) - for things

The answer to these questions will be in the Nominative case. This is the most reliable way to identify the subject of a German sentence.`,
    examples: [
      {
        spanish: 'Der Student liest ein Buch.',
        english: 'The student reads a book. → Wer liest? → Der Student (Nominative)',
        highlight: ['Der Student']
      },
      {
        spanish: 'Die Sonne scheint hell.',
        english: 'The sun shines brightly. → Was scheint? → Die Sonne (Nominative)',
        highlight: ['Die Sonne']
      },
      {
        spanish: 'Ein Auto fährt schnell.',
        english: 'A car drives fast. → Was fährt? → Ein Auto (Nominative)',
        highlight: ['Ein Auto']
      },
      {
        spanish: 'Meine Eltern kommen morgen.',
        english: 'My parents are coming tomorrow. → Wer kommt? → Meine Eltern (Nominative)',
        highlight: ['Meine Eltern']
      }
    ]
  },
  {
    title: 'Nominative Pronouns',
    content: `Personal pronouns in the Nominative case are used as subjects:`,
    subsections: [
      {
        title: 'Personal Pronouns - Nominative',
        content: `These are the subject pronouns in German:`,
        conjugationTable: {
          title: 'Personal Pronouns - Nominative Case',
          conjugations: [
            { pronoun: 'ich', form: 'I', english: 'first person singular' },
            { pronoun: 'du', form: 'you', english: 'second person singular (informal)' },
            { pronoun: 'er', form: 'he', english: 'third person singular masculine' },
            { pronoun: 'sie', form: 'she', english: 'third person singular feminine' },
            { pronoun: 'es', form: 'it', english: 'third person singular neuter' },
            { pronoun: 'wir', form: 'we', english: 'first person plural' },
            { pronoun: 'ihr', form: 'you', english: 'second person plural (informal)' },
            { pronoun: 'sie', form: 'they', english: 'third person plural' },
            { pronoun: 'Sie', form: 'you', english: 'formal (singular/plural)' }
          ]
        },
        examples: [
          {
            spanish: 'Ich bin müde.',
            english: 'I am tired.',
            highlight: ['Ich']
          },
          {
            spanish: 'Du bist sehr nett.',
            english: 'You are very nice.',
            highlight: ['Du']
          },
          {
            spanish: 'Er kommt aus Deutschland.',
            english: 'He comes from Germany.',
            highlight: ['Er']
          },
          {
            spanish: 'Wir lernen Deutsch.',
            english: 'We are learning German.',
            highlight: ['Wir']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Nominative Patterns',
    content: `Certain sentence patterns always use the Nominative case:

**Pattern 1**: Subject + Verb + Object (Subject is always Nominative)
**Pattern 2**: Subject + "sein" + Predicate Nominative (Both are Nominative)
**Pattern 3**: "Es gibt" + Accusative (Note: "Es" is Nominative, but the object is Accusative)

Understanding these patterns helps you use the Nominative case correctly.`,
    examples: [
      {
        spanish: 'Der Hund spielt im Garten.',
        english: 'The dog plays in the garden. (Subject + Verb pattern)',
        highlight: ['Der Hund']
      },
      {
        spanish: 'Mein Bruder ist ein Ingenieur.',
        english: 'My brother is an engineer. (Subject + sein + Predicate)',
        highlight: ['Mein Bruder', 'ein Ingenieur']
      },
      {
        spanish: 'Es gibt einen Park in der Stadt.',
        english: 'There is a park in the city. ("Es" is Nominative)',
        highlight: ['Es']
      },
      {
        spanish: 'Die Kinder werden groß.',
        english: 'The children are getting big. (Subject + werden + Adjective)',
        highlight: ['Die Kinder']
      }
    ]
  },
  {
    title: 'Nominative vs Other Cases',
    content: `The Nominative case is different from the other three German cases:

**Nominative**: Subject (who/what does the action)
**Accusative**: Direct object (who/what receives the action)
**Dative**: Indirect object (to/for whom the action is done)
**Genitive**: Possessive (whose/of what)

Learning to distinguish between these cases is crucial for German grammar mastery.`,
    examples: [
      {
        spanish: 'Der Mann gibt der Frau das Buch.',
        english: 'The man gives the woman the book.',
        highlight: ['Der Mann']
      },
      {
        spanish: '↳ Der Mann (Nominative - subject)',
        english: '↳ The man (who gives)',
        highlight: ['Der Mann']
      },
      {
        spanish: '↳ der Frau (Dative - indirect object)',
        english: '↳ to the woman (to whom)',
        highlight: ['der Frau']
      },
      {
        spanish: '↳ das Buch (Accusative - direct object)',
        english: '↳ the book (what is given)',
        highlight: ['das Buch']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'German Accusative Case',
    url: '/grammar/german/cases/accusative',
    difficulty: 'beginner'
  },
  {
    title: 'German Dative Case',
    url: '/grammar/german/cases/dative',
    difficulty: 'intermediate'
  },
  {
    title: 'German Articles',
    url: '/grammar/german/nouns/articles',
    difficulty: 'beginner'
  },
  {
    title: 'German Present Tense',
    url: '/grammar/german/verbs/present-tense',
    difficulty: 'beginner'
  }
];

export default function GermanNominativePage() {
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
              topic: 'nominative',
              title: 'German Nominative Case',
              description: 'Master the German Nominative case - the subject case. Learn der/die/das forms and when to use Nominativ.',
              difficulty: 'beginner',
              examples: [
                'Der Mann ist groß (The man is tall)',
                'Die Frau arbeitet (The woman works)',
                'Das Kind spielt (The child plays)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'cases',
              topic: 'nominative',
              title: 'German Nominative Case'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="german"
        category="cases"
        topic="nominative"
        title="German Nominative Case"
        description="Master the German Nominative case - the subject case. Learn der/die/das forms and when to use Nominativ"
        difficulty="beginner"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/german/cases"
        practiceUrl="/grammar/german/cases/nominative/practice"
        quizUrl="/grammar/german/cases/nominative/quiz"
        songUrl="/songs/de?theme=grammar&topic=nominative"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
