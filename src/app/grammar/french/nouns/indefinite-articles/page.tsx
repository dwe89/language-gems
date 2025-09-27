import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'nouns',
  topic: 'indefinite-articles',
  title: 'French Indefinite Articles (Un, Une, Des)',
  description: 'Master French indefinite articles un, une, des with gender agreement and usage rules. Learn when to use "a/an/some" in French.',
  difficulty: 'beginner',
  keywords: [
    'french indefinite articles',
    'un une des french',
    'french articles',
    'a an some french',
    'french grammar articles',
    'indefinite articles french'
  ],
  examples: [
    'un livre (a book)',
    'une table (a table)',
    'des enfants (some children)',
    'Je n\'ai pas de voiture (I don\'t have a car)'
  ]
});

const sections = [
  {
    title: 'Understanding Indefinite Articles',
    content: `French indefinite articles correspond to "a," "an," and "some" in English. Like definite articles, they must **agree** with the gender and number of the noun.

French has three indefinite articles: **un** (masculine singular), **une** (feminine singular), and **des** (plural for both genders).

These articles introduce non-specific nouns - things that haven't been mentioned before or aren't uniquely identified.`,
    examples: [
      {
        spanish: 'un chat (a cat - masculine)',
        english: 'une chaise (a chair - feminine)',
        highlight: ['un', 'une']
      },
      {
        spanish: 'des livres (some books)',
        english: 'des tables (some tables)',
        highlight: ['des']
      },
      {
        spanish: 'J\'ai un problème. (I have a problem.)',
        english: 'Elle achète une voiture. (She\'s buying a car.)',
        highlight: ['un problème', 'une voiture']
      }
    ]
  },
  {
    title: 'The Three Indefinite Articles',
    content: `Each indefinite article corresponds to specific gender and number combinations:`,
    subsections: [
      {
        title: 'Complete Indefinite Article System',
        content: 'Here are all French indefinite articles:',
        conjugationTable: {
          title: 'French Indefinite Articles',
          conjugations: [
            { pronoun: 'un', form: 'masculine singular', english: 'un livre (a book)' },
            { pronoun: 'une', form: 'feminine singular', english: 'une table (a table)' },
            { pronoun: 'des', form: 'plural (both genders)', english: 'des amis (some friends)' }
          ]
        }
      },
      {
        title: 'Gender Agreement Examples',
        content: 'The article must match the noun\'s gender:',
        examples: [
          {
            spanish: 'un homme (a man) - masculine',
            english: 'une femme (a woman) - feminine',
            highlight: ['un homme', 'une femme']
          },
          {
            spanish: 'un problème (a problem) - masculine',
            english: 'une solution (a solution) - feminine',
            highlight: ['un problème', 'une solution']
          },
          {
            spanish: 'des hommes (some men)',
            english: 'des femmes (some women)',
            highlight: ['des hommes', 'des femmes']
          }
        ]
      }
    ]
  },
  {
    title: 'When to Use Indefinite Articles',
    content: `Indefinite articles are used to introduce new, non-specific, or countable items:`,
    examples: [
      {
        spanish: 'Je cherche un restaurant. (I\'m looking for a restaurant.)',
        english: 'Non-specific - any restaurant will do',
        highlight: ['un restaurant']
      },
      {
        spanish: 'Elle a une idée. (She has an idea.)',
        english: 'Introducing something new to the conversation',
        highlight: ['une idée']
      },
      {
        spanish: 'Il y a des étudiants dans la classe. (There are students in the class.)',
        english: 'Some/several - indefinite quantity',
        highlight: ['des étudiants']
      }
    ],
    subsections: [
      {
        title: 'Specific Uses',
        content: 'Common situations requiring indefinite articles:',
        examples: [
          {
            spanish: 'Professions: Il est un bon médecin. (He is a good doctor.)',
            english: 'With adjectives describing professions',
            highlight: ['un bon médecin']
          },
          {
            spanish: 'Quantities: J\'ai des questions. (I have some questions.)',
            english: 'Indefinite plural quantities',
            highlight: ['des questions']
          },
          {
            spanish: 'First mention: J\'ai vu un film. (I saw a movie.)',
            english: 'Introducing something for the first time',
            highlight: ['un film']
          }
        ]
      }
    ]
  },
  {
    title: 'Indefinite Articles in Negative Sentences',
    content: `In negative sentences, indefinite articles change to **de** (or **d\'** before vowels). This is a crucial rule that students often forget.

**Pattern**: ne + verb + pas + de + noun (no article)`,
    examples: [
      {
        spanish: 'J\'ai un chat. → Je n\'ai pas de chat.',
        english: 'I have a cat. → I don\'t have a cat.',
        highlight: ['un chat', 'de chat']
      },
      {
        spanish: 'Elle achète une voiture. → Elle n\'achète pas de voiture.',
        english: 'She buys a car. → She doesn\'t buy a car.',
        highlight: ['une voiture', 'de voiture']
      },
      {
        spanish: 'Il y a des étudiants. → Il n\'y a pas d\'étudiants.',
        english: 'There are students. → There are no students.',
        highlight: ['des étudiants', 'd\'étudiants']
      }
    ],
    subsections: [
      {
        title: 'Exception: Être + Negative',
        content: 'With the verb être, indefinite articles usually remain unchanged:',
        examples: [
          {
            spanish: 'C\'est un problème. → Ce n\'est pas un problème.',
            english: 'It\'s a problem. → It\'s not a problem.',
            highlight: ['un problème']
          },
          {
            spanish: 'Elle est une amie. → Elle n\'est pas une amie.',
            english: 'She is a friend. → She is not a friend.',
            highlight: ['une amie']
          }
        ]
      }
    ]
  },
  {
    title: 'Indefinite vs Definite Articles',
    content: `Understanding when to use indefinite versus definite articles is crucial:

**Indefinite (un/une/des)**: First mention, non-specific, "a/an/some"
**Definite (le/la/les)**: Specific, already mentioned, general statements

The choice affects the meaning of your sentence.`,
    examples: [
      {
        spanish: 'Je cherche un livre. (any book)',
        english: 'Je cherche le livre. (a specific book)',
        highlight: ['un livre', 'le livre']
      },
      {
        spanish: 'Il y a une voiture dehors. (some car)',
        english: 'La voiture est dehors. (the specific car)',
        highlight: ['une voiture', 'La voiture']
      },
      {
        spanish: 'Des enfants jouent. (some children)',
        english: 'Les enfants jouent. (the specific children)',
        highlight: ['Des enfants', 'Les enfants']
      }
    ]
  },
  {
    title: 'Common Expressions and Idioms',
    content: `Some expressions use indefinite articles in fixed patterns:`,
    examples: [
      {
        spanish: 'avoir un rhume (to have a cold)',
        english: 'avoir une idée (to have an idea)',
        highlight: ['un rhume', 'une idée']
      },
      {
        spanish: 'faire un voyage (to take a trip)',
        english: 'faire une promenade (to take a walk)',
        highlight: ['un voyage', 'une promenade']
      },
      {
        spanish: 'Il fait un temps magnifique. (The weather is magnificent.)',
        english: 'Fixed weather expression',
        highlight: ['un temps magnifique']
      },
      {
        spanish: 'C\'est une catastrophe! (It\'s a disaster!)',
        english: 'Exclamatory expressions',
        highlight: ['une catastrophe']
      }
    ]
  },
  {
    title: 'Common Mistakes to Avoid',
    content: `Here are frequent errors with indefinite articles:

**1. Wrong gender**: Using un with feminine nouns
**2. Forgetting negative rule**: Not changing to "de" in negatives
**3. Confusion with definite**: Using wrong article type
**4. Plural confusion**: Using un/une with plural nouns`,
    examples: [
      {
        spanish: '❌ un table → ✅ une table',
        english: 'Wrong gender - table is feminine',
        highlight: ['une table']
      },
      {
        spanish: '❌ Je n\'ai pas un chat → ✅ Je n\'ai pas de chat',
        english: 'Must use "de" in negatives',
        highlight: ['de chat']
      },
      {
        spanish: '❌ J\'aime un chocolat → ✅ J\'aime le chocolat',
        english: 'General preference needs definite article',
        highlight: ['le chocolat']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Gender Rules', url: '/grammar/french/nouns/gender-rules', difficulty: 'beginner' },
  { title: 'French Definite Articles', url: '/grammar/french/nouns/definite-articles', difficulty: 'beginner' },
  { title: 'French Partitive Articles', url: '/grammar/french/nouns/partitive-articles', difficulty: 'intermediate' },
  { title: 'French Negation', url: '/grammar/french/verbs/negation', difficulty: 'intermediate' }
];

export default function FrenchIndefiniteArticlesPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'nouns',
              topic: 'indefinite-articles',
              title: 'French Indefinite Articles (Un, Une, Des)',
              description: 'Master French indefinite articles un, une, des with gender agreement and usage rules.',
              difficulty: 'beginner',
              examples: [
                'un livre (a book)',
                'une table (a table)',
                'des enfants (some children)',
                'Je n\'ai pas de voiture (I don\'t have a car)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'nouns',
              topic: 'indefinite-articles',
              title: 'French Indefinite Articles (Un, Une, Des)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="nouns"
        topic="indefinite-articles"
        title="French Indefinite Articles (Un, Une, Des)"
        description="Master French indefinite articles un, une, des with gender agreement and usage rules"
        difficulty="beginner"
        estimatedTime={8}
        sections={sections}
        backUrl="/grammar/french/nouns"
        practiceUrl="/grammar/french/nouns/indefinite-articles/practice"
        quizUrl="/grammar/french/nouns/indefinite-articles/quiz"
        songUrl="/songs/fr?theme=grammar&topic=indefinite-articles"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
