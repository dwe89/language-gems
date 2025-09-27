import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'pronouns',
  topic: 'demonstrative',
  title: 'French Demonstrative Pronouns (Celui, Celle, Ceux, Celles)',
  description: 'Master French demonstrative pronouns that replace demonstrative adjectives + nouns. Learn celui, celle, ceux, celles usage.',
  difficulty: 'intermediate',
  keywords: [
    'french demonstrative pronouns',
    'celui celle ceux celles',
    'celui-ci celle-là',
    'demonstrative french grammar',
    'this that pronouns french',
    'french pronouns advanced'
  ],
  examples: [
    'Celui-ci est mieux (This one is better)',
    'Celle-là est belle (That one is beautiful)',
    'Ceux qui travaillent (Those who work)',
    'Celles de Marie (Marie\'s ones)'
  ]
});

const sections = [
  {
    title: 'Understanding Demonstrative Pronouns',
    content: `French demonstrative pronouns **replace** demonstrative adjectives + nouns to avoid repetition. They mean "this one," "that one," "these," "those."

Unlike demonstrative adjectives (ce, cette, ces), demonstrative pronouns **stand alone** and must agree with the gender and number of what they replace.

They cannot be used alone - they must be followed by **-ci/-là**, **de**, or a **relative clause**.`,
    examples: [
      {
        spanish: 'Ce livre est intéressant, celui-là aussi. (This book is interesting, that one too.)',
        english: 'Celui-là replaces ce livre-là',
        highlight: ['celui-là']
      },
      {
        spanish: 'Cette voiture est chère, celle de Pierre est moins chère. (This car is expensive, Pierre\'s is less expensive.)',
        english: 'Celle replaces cette voiture',
        highlight: ['celle de Pierre']
      }
    ]
  },
  {
    title: 'The Four Basic Forms',
    content: `French demonstrative pronouns have four basic forms:`,
    subsections: [
      {
        title: 'Basic Demonstrative Pronoun Forms',
        content: 'The four forms that agree with gender and number:',
        conjugationTable: {
          title: 'French Demonstrative Pronouns',
          conjugations: [
            { pronoun: 'celui', form: 'masculine singular', english: 'this one/that one (m.s.)' },
            { pronoun: 'celle', form: 'feminine singular', english: 'this one/that one (f.s.)' },
            { pronoun: 'ceux', form: 'masculine plural', english: 'these/those (m.p.)' },
            { pronoun: 'celles', form: 'feminine plural', english: 'these/those (f.p.)' }
          ]
        }
      },
      {
        title: 'Agreement Rules',
        content: 'Demonstrative pronouns agree with what they replace:',
        examples: [
          {
            spanish: 'le livre → celui (masculine singular)',
            english: 'la voiture → celle (feminine singular)',
            highlight: ['celui', 'celle']
          },
          {
            spanish: 'les livres → ceux (masculine plural)',
            english: 'les voitures → celles (feminine plural)',
            highlight: ['ceux', 'celles']
          }
        ]
      }
    ]
  },
  {
    title: 'With -CI and -LÀ (This/That Distinction)',
    content: `To distinguish between "this" and "that," add **-ci** (here/near) or **-là** (there/far):`,
    examples: [
      {
        spanish: 'Quel livre préfères-tu? Celui-ci ou celui-là? (Which book do you prefer? This one or that one?)',
        english: 'Celui-ci = this one, celui-là = that one',
        highlight: ['Celui-ci', 'celui-là']
      },
      {
        spanish: 'Ces voitures sont belles, mais celle-ci est ma préférée. (These cars are beautiful, but this one is my favorite.)',
        english: 'Celle-ci = this one (feminine)',
        highlight: ['celle-ci']
      }
    ],
    subsections: [
      {
        title: 'All Forms with -CI and -LÀ',
        content: 'Complete system with near/far distinctions:',
        conjugationTable: {
          title: 'Demonstrative Pronouns + CI/LÀ',
          conjugations: [
            { pronoun: 'celui-ci/celui-là', form: 'this one/that one (m.s.)', english: 'Je préfère celui-ci. (I prefer this one.)' },
            { pronoun: 'celle-ci/celle-là', form: 'this one/that one (f.s.)', english: 'Celle-là est mieux. (That one is better.)' },
            { pronoun: 'ceux-ci/ceux-là', form: 'these/those (m.p.)', english: 'Ceux-ci sont nouveaux. (These are new.)' },
            { pronoun: 'celles-ci/celles-là', form: 'these/those (f.p.)', english: 'Celles-là sont vieilles. (Those are old.)' }
          ]
        }
      },
      {
        title: 'Usage in Comparisons',
        content: 'Common in comparing two items:',
        examples: [
          {
            spanish: 'Entre ces deux robes, je préfère celle-ci à celle-là. (Between these two dresses, I prefer this one to that one.)',
            english: 'Comparing two feminine items',
            highlight: ['celle-ci', 'celle-là']
          },
          {
            spanish: 'Ces livres sont intéressants: celui-ci parle d\'histoire, celui-là de science. (These books are interesting: this one talks about history, that one about science.)',
            english: 'Distinguishing between items',
            highlight: ['celui-ci', 'celui-là']
          }
        ]
      }
    ]
  },
  {
    title: 'With DE (Possession/Relationship)',
    content: `Demonstrative pronouns + **de** express possession or relationship:`,
    examples: [
      {
        spanish: 'Ma voiture et celle de Pierre (my car and Pierre\'s)',
        english: 'Celle de Pierre = Pierre\'s car',
        highlight: ['celle de Pierre']
      },
      {
        spanish: 'Tes livres et ceux de Marie (your books and Marie\'s)',
        english: 'Ceux de Marie = Marie\'s books',
        highlight: ['ceux de Marie']
      }
    ],
    subsections: [
      {
        title: 'Possession Examples',
        content: 'Using demonstrative pronouns to show ownership:',
        examples: [
          {
            spanish: 'Mon appartement est petit, celui de mes parents est grand. (My apartment is small, my parents\' is big.)',
            english: 'Celui de mes parents = my parents\' apartment',
            highlight: ['celui de mes parents']
          },
          {
            spanish: 'Nos idées et celles du professeur sont différentes. (Our ideas and the teacher\'s are different.)',
            english: 'Celles du professeur = the teacher\'s ideas',
            highlight: ['celles du professeur']
          }
        ]
      },
      {
        title: 'With Contractions',
        content: 'De contracts with articles as usual:',
        examples: [
          {
            spanish: 'celui de + le professeur = celui du professeur',
            english: 'celle de + les étudiants = celle des étudiants',
            highlight: ['du professeur', 'des étudiants']
          }
        ]
      }
    ]
  },
  {
    title: 'With Relative Clauses',
    content: `Demonstrative pronouns can be followed by **relative clauses** (qui, que, dont, où):`,
    examples: [
      {
        spanish: 'Celui qui travaille réussit. (The one who works succeeds.)',
        english: 'Celui qui = the one who',
        highlight: ['Celui qui']
      },
      {
        spanish: 'Celle que tu vois là-bas est ma sœur. (The one you see over there is my sister.)',
        english: 'Celle que = the one that/whom',
        highlight: ['Celle que']
      }
    ],
    subsections: [
      {
        title: 'With Different Relative Pronouns',
        content: 'Examples with various relative pronouns:',
        examples: [
          {
            spanish: 'QUI: Ceux qui étudient réussissent. (Those who study succeed.)',
            english: 'QUE: Celles que j\'ai vues étaient belles. (Those I saw were beautiful.)',
            highlight: ['Ceux qui', 'Celles que']
          },
          {
            spanish: 'DONT: Celui dont je parle est mon ami. (The one I\'m talking about is my friend.)',
            english: 'OÙ: Celle où nous allons est fermée. (The one where we\'re going is closed.)',
            highlight: ['Celui dont', 'Celle où']
          }
        ]
      },
      {
        title: 'General Statements',
        content: 'Using demonstrative pronouns for general statements:',
        examples: [
          {
            spanish: 'Celui qui ne risque rien n\'a rien. (He who risks nothing has nothing.)',
            english: 'General truth using celui qui',
            highlight: ['Celui qui']
          },
          {
            spanish: 'Celles qui travaillent dur réussissent. (Those who work hard succeed.)',
            english: 'General statement about women/feminine things',
            highlight: ['Celles qui']
          }
        ]
      }
    ]
  },
  {
    title: 'Special Forms: CE + Relative Pronouns',
    content: `For neutral concepts, use **ce** + relative pronouns instead of celui/celle:`,
    examples: [
      {
        spanish: 'Ce qui m\'intéresse, c\'est la musique. (What interests me is music.)',
        english: 'Ce qui = what (subject)',
        highlight: ['Ce qui']
      },
      {
        spanish: 'Ce que je veux, c\'est partir. (What I want is to leave.)',
        english: 'Ce que = what (object)',
        highlight: ['Ce que']
      }
    ],
    subsections: [
      {
        title: 'CE vs CELUI Distinction',
        content: 'When to use ce vs celui:',
        examples: [
          {
            spanish: 'Specific reference: Celui qui parle est mon ami. (The one who speaks is my friend.)',
            english: 'General/abstract: Ce qui compte, c\'est l\'amour. (What matters is love.)',
            highlight: ['Celui qui', 'Ce qui']
          }
        ]
      }
    ]
  },
  {
    title: 'Demonstrative Pronouns vs Adjectives',
    content: `Important distinction between demonstrative adjectives and pronouns:`,
    subsections: [
      {
        title: 'Adjectives vs Pronouns',
        content: 'Key differences in usage:',
        conjugationTable: {
          title: 'Adjectives vs Pronouns',
          conjugations: [
            { pronoun: 'Adjective + Noun', form: 'ce livre', english: 'this book (adjective modifies noun)' },
            { pronoun: 'Pronoun Alone', form: 'celui-ci', english: 'this one (pronoun replaces adjective + noun)' },
            { pronoun: 'Must have suffix', form: 'celui-ci/-là/de/qui', english: 'pronouns need -ci/-là, de, or relative clause' },
            { pronoun: 'Can stand alone', form: 'ce, cette, ces', english: 'adjectives can be used alone with nouns' }
          ]
        }
      },
      {
        title: 'Side-by-Side Examples',
        content: 'Comparing adjectives and pronouns:',
        examples: [
          {
            spanish: 'Adjective: J\'aime ce livre. (I like this book.)',
            english: 'Pronoun: J\'aime celui-ci. (I like this one.)',
            highlight: ['ce livre', 'celui-ci']
          },
          {
            spanish: 'Adjective: Ces voitures sont chères. (These cars are expensive.)',
            english: 'Pronoun: Celles-là sont chères. (Those are expensive.)',
            highlight: ['Ces voitures', 'Celles-là']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Demonstrative Pronoun Mistakes',
    content: `Here are frequent errors students make:

**1. Using alone**: Using celui/celle without -ci/-là, de, or relative clause
**2. Wrong agreement**: Not matching gender/number of replaced noun
**3. Confusion with adjectives**: Using adjectives instead of pronouns
**4. Wrong relative pronoun**: Incorrect relative pronoun after demonstrative`,
    examples: [
      {
        spanish: '❌ Je préfère celui → ✅ Je préfère celui-ci',
        english: 'Wrong: must add -ci/-là, de, or relative clause',
        highlight: ['celui-ci']
      },
      {
        spanish: '❌ Cette voiture et celui de Pierre → ✅ Cette voiture et celle de Pierre',
        english: 'Wrong: voiture is feminine, needs celle',
        highlight: ['celle de Pierre']
      },
      {
        spanish: '❌ Celui-ci livre → ✅ Ce livre / Celui-ci',
        english: 'Wrong: don\'t mix adjectives and pronouns',
        highlight: ['Ce livre', 'Celui-ci']
      },
      {
        spanish: '❌ Celui que parle → ✅ Celui qui parle',
        english: 'Wrong: subject of relative clause needs qui',
        highlight: ['qui parle']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Demonstrative Adjectives', url: '/grammar/french/adjectives/demonstrative', difficulty: 'beginner' },
  { title: 'French Relative Pronouns', url: '/grammar/french/pronouns/relative-pronouns', difficulty: 'advanced' },
  { title: 'French Possessive Pronouns', url: '/grammar/french/pronouns/possessive', difficulty: 'intermediate' },
  { title: 'French Gender Agreement', url: '/grammar/french/nouns/gender-rules', difficulty: 'beginner' }
];

export default function FrenchDemonstrativePronounsPage() {
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
              topic: 'demonstrative',
              title: 'French Demonstrative Pronouns (Celui, Celle, Ceux, Celles)',
              description: 'Master French demonstrative pronouns that replace demonstrative adjectives + nouns. Learn celui, celle, ceux, celles usage.',
              difficulty: 'intermediate',
              examples: [
                'Celui-ci est mieux (This one is better)',
                'Celle-là est belle (That one is beautiful)',
                'Ceux qui travaillent (Those who work)',
                'Celles de Marie (Marie\'s ones)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'pronouns',
              topic: 'demonstrative',
              title: 'French Demonstrative Pronouns (Celui, Celle, Ceux, Celles)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="pronouns"
        topic="demonstrative"
        title="French Demonstrative Pronouns (Celui, Celle, Ceux, Celles)"
        description="Master French demonstrative pronouns that replace demonstrative adjectives + nouns. Learn celui, celle, ceux, celles usage"
        difficulty="intermediate"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/french/pronouns"
        practiceUrl="/grammar/french/pronouns/demonstrative/practice"
        quizUrl="/grammar/french/pronouns/demonstrative/quiz"
        songUrl="/songs/fr?theme=grammar&topic=demonstrative"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
