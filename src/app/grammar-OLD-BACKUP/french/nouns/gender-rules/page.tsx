import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'nouns',
  topic: 'gender-rules',
  title: 'French Noun Gender Rules',
  description: 'Master French noun gender with clear rules and patterns. Learn masculine and feminine endings, exceptions, and memory techniques.',
  difficulty: 'beginner',
  keywords: [
    'french noun gender',
    'masculine feminine french',
    'french gender rules',
    'le la french',
    'noun endings french',
    'french grammar gender'
  ],
  examples: [
    'le livre (masculine book)',
    'la table (feminine table)',
    'le problème (masculine problem)',
    'la nation (feminine nation)'
  ]
});

const sections = [
  {
    title: 'Understanding French Gender',
    content: `Every French noun has a **gender** - either **masculine** or **feminine**. This is a fundamental aspect of French grammar that affects articles, adjectives, and pronouns.

Unlike English, French gender is not always logical - it's a grammatical property that must be learned. However, there are helpful patterns and rules that can guide you.`,
    examples: [
      {
        spanish: 'le chat (masculine) - the cat',
        english: 'la chatte (feminine) - the female cat',
        highlight: ['le', 'la']
      },
      {
        spanish: 'un livre (masculine) - a book',
        english: 'une table (feminine) - a table',
        highlight: ['un', 'une']
      }
    ]
  },
  {
    title: 'Masculine Noun Patterns',
    content: `Many masculine nouns follow predictable patterns. Learning these endings will help you identify masculine nouns:`,
    subsections: [
      {
        title: 'Common Masculine Endings',
        content: 'These endings typically indicate masculine nouns:',
        conjugationTable: {
          title: 'Masculine Endings',
          conjugations: [
            { pronoun: '-age', form: 'le voyage', english: 'the trip' },
            { pronoun: '-ment', form: 'le moment', english: 'the moment' },
            { pronoun: '-eau', form: 'le bureau', english: 'the office' },
            { pronoun: '-eu', form: 'le feu', english: 'the fire' },
            { pronoun: '-ou', form: 'le genou', english: 'the knee' },
            { pronoun: '-isme', form: 'le tourisme', english: 'tourism' }
          ]
        }
      },
      {
        title: 'Masculine Categories',
        content: 'Certain categories of nouns are typically masculine:',
        examples: [
          {
            spanish: 'Days: le lundi, le mardi, le mercredi',
            english: 'Days: Monday, Tuesday, Wednesday',
            highlight: ['le lundi', 'le mardi', 'le mercredi']
          },
          {
            spanish: 'Months: le janvier, le février, le mars',
            english: 'Months: January, February, March',
            highlight: ['le janvier', 'le février', 'le mars']
          },
          {
            spanish: 'Seasons: le printemps, l\'été, l\'automne, l\'hiver',
            english: 'Seasons: spring, summer, autumn, winter',
            highlight: ['le printemps', 'l\'été', 'l\'automne', 'l\'hiver']
          },
          {
            spanish: 'Languages: le français, l\'anglais, l\'espagnol',
            english: 'Languages: French, English, Spanish',
            highlight: ['le français', 'l\'anglais', 'l\'espagnol']
          }
        ]
      }
    ]
  },
  {
    title: 'Feminine Noun Patterns',
    content: `Feminine nouns also have recognizable patterns. These endings usually indicate feminine gender:`,
    subsections: [
      {
        title: 'Common Feminine Endings',
        content: 'These endings typically indicate feminine nouns:',
        conjugationTable: {
          title: 'Feminine Endings',
          conjugations: [
            { pronoun: '-tion', form: 'la nation', english: 'the nation' },
            { pronoun: '-sion', form: 'la mission', english: 'the mission' },
            { pronoun: '-té', form: 'la liberté', english: 'freedom' },
            { pronoun: '-ée', form: 'la journée', english: 'the day' },
            { pronoun: '-ure', form: 'la culture', english: 'culture' },
            { pronoun: '-ance', form: 'la chance', english: 'luck' }
          ]
        }
      },
      {
        title: 'More Feminine Endings',
        content: 'Additional feminine patterns:',
        conjugationTable: {
          title: 'Additional Feminine Endings',
          conjugations: [
            { pronoun: '-ence', form: 'la science', english: 'science' },
            { pronoun: '-ie', form: 'la vie', english: 'life' },
            { pronoun: '-ette', form: 'la cigarette', english: 'cigarette' },
            { pronoun: '-elle', form: 'la nouvelle', english: 'the news' },
            { pronoun: '-esse', form: 'la richesse', english: 'wealth' },
            { pronoun: '-ise', form: 'la surprise', english: 'surprise' }
          ]
        }
      }
    ]
  },
  {
    title: 'Important Exceptions',
    content: `While patterns are helpful, there are important exceptions you must memorize:`,
    examples: [
      {
        spanish: 'le problème (masculine despite -ème)',
        english: 'the problem',
        highlight: ['le problème']
      },
      {
        spanish: 'le système (masculine despite -ème)',
        english: 'the system',
        highlight: ['le système']
      },
      {
        spanish: 'la page (feminine despite no typical ending)',
        english: 'the page',
        highlight: ['la page']
      },
      {
        spanish: 'la plage (feminine despite -age)',
        english: 'the beach',
        highlight: ['la plage']
      }
    ],
    subsections: [
      {
        title: 'Common Masculine Exceptions',
        content: 'These nouns are masculine despite their endings:',
        conjugationTable: {
          title: 'Masculine Exceptions',
          conjugations: [
            { pronoun: 'le musée', form: '(despite -ée)', english: 'the museum' },
            { pronoun: 'le lycée', form: '(despite -ée)', english: 'the high school' },
            { pronoun: 'le silence', form: '(despite -ence)', english: 'silence' },
            { pronoun: 'le groupe', form: '(no pattern)', english: 'the group' }
          ]
        }
      },
      {
        title: 'Common Feminine Exceptions',
        content: 'These nouns are feminine despite their endings:',
        conjugationTable: {
          title: 'Feminine Exceptions',
          conjugations: [
            { pronoun: 'la cage', form: '(despite -age)', english: 'the cage' },
            { pronoun: 'la rage', form: '(despite -age)', english: 'rage' },
            { pronoun: 'la image', form: '(despite -age)', english: 'the image' },
            { pronoun: 'la nage', form: '(despite -age)', english: 'swimming' }
          ]
        }
      }
    ]
  },
  {
    title: 'Memory Strategies',
    content: `Here are effective strategies for remembering French noun gender:

**1. Learn with articles**: Always learn nouns with their articles (le/la/un/une)
**2. Use color coding**: Assign colors to masculine and feminine in your notes
**3. Practice patterns**: Focus on the most common ending patterns
**4. Group similar words**: Learn word families together
**5. Use mnemonics**: Create memory devices for difficult exceptions`,
    examples: [
      {
        spanish: 'Always learn: le livre (not just livre)',
        english: 'Always learn: the book (not just book)',
        highlight: ['le livre']
      },
      {
        spanish: 'Word family: la nation, la création, la situation',
        english: 'Word family: nation, creation, situation',
        highlight: ['la nation', 'la création', 'la situation']
      },
      {
        spanish: 'Mnemonic: "Le problème avec les hommes" (masculine)',
        english: 'Mnemonic: "The problem with men" (masculine)',
        highlight: ['Le problème']
      }
    ]
  },
  {
    title: 'Gender and Meaning Changes',
    content: `Some nouns change meaning based on their gender:`,
    examples: [
      {
        spanish: 'le livre (book) vs la livre (pound)',
        english: 'the book vs the pound (weight/currency)',
        highlight: ['le livre', 'la livre']
      },
      {
        spanish: 'le tour (turn/trip) vs la tour (tower)',
        english: 'the turn/trip vs the tower',
        highlight: ['le tour', 'la tour']
      },
      {
        spanish: 'le mode (method) vs la mode (fashion)',
        english: 'the method vs fashion',
        highlight: ['le mode', 'la mode']
      },
      {
        spanish: 'le poste (job/post) vs la poste (post office)',
        english: 'the job/post vs the post office',
        highlight: ['le poste', 'la poste']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Definite Articles', url: '/grammar/french/nouns/definite-articles', difficulty: 'beginner' },
  { title: 'French Indefinite Articles', url: '/grammar/french/nouns/indefinite-articles', difficulty: 'beginner' },
  { title: 'French Adjective Agreement', url: '/grammar/french/adjectives/agreement-rules', difficulty: 'beginner' },
  { title: 'French Plural Formation', url: '/grammar/french/nouns/plural-formation', difficulty: 'beginner' }
];

export default function FrenchGenderRulesPage() {
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
              topic: 'gender-rules',
              title: 'French Noun Gender Rules',
              description: 'Master French noun gender with clear rules and patterns. Learn masculine and feminine endings, exceptions, and memory techniques.',
              difficulty: 'beginner',
              examples: [
                'le livre (masculine book)',
                'la table (feminine table)',
                'le problème (masculine problem)',
                'la nation (feminine nation)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'nouns',
              topic: 'gender-rules',
              title: 'French Noun Gender Rules'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="nouns"
        topic="gender-rules"
        title="French Noun Gender Rules"
        description="Master French noun gender with clear rules and patterns. Learn masculine and feminine endings, exceptions, and memory techniques"
        difficulty="beginner"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/french/nouns"
        practiceUrl="/grammar/french/nouns/gender-rules/practice"
        quizUrl="/grammar/french/nouns/gender-rules/quiz"
        songUrl="/songs/fr?theme=grammar&topic=gender-rules"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
