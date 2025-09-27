import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adjectives',
  topic: 'indefinite-adjectives',
  title: 'French Indefinite Adjectives (Quelque, Chaque, Tout, Autre)',
  description: 'Master French indefinite adjectives including quelque, chaque, tout, autre, plusieurs, and their agreement patterns.',
  difficulty: 'intermediate',
  keywords: [
    'french indefinite adjectives',
    'quelque french',
    'chaque french',
    'tout french adjective',
    'autre french',
    'plusieurs french',
    'indefinite determiners french'
  ],
  examples: [
    'Quelques amis sont venus. (Some friends came.)',
    'Chaque étudiant a un livre. (Each student has a book.)',
    'Tout le monde est là. (Everyone is there.)',
    'J\'ai d\'autres idées. (I have other ideas.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Indefinite Adjectives',
    content: `French indefinite adjectives express **indefinite quantity, quality, or identity**. They modify nouns without specifying exact amounts or specific items.

**Main indefinite adjectives:**
- **quelque(s)**: some, a few
- **chaque**: each, every
- **tout/toute/tous/toutes**: all, every, whole
- **autre(s)**: other, another
- **plusieurs**: several
- **certain(s)/certaine(s)**: certain, some

**Key characteristics:**
- **Agreement**: Most agree in gender and number with the noun
- **Position**: Usually placed before the noun
- **Meaning**: Express vague or indefinite concepts
- **Usage**: Essential for expressing approximation and generalization

These adjectives are crucial for natural French expression and avoiding overly specific language.`,
    examples: [
      {
        spanish: 'Quelques personnes sont arrivées. (Some people arrived.)',
        english: 'Indefinite quantity - not specifying exactly how many',
        highlight: ['Quelques personnes']
      },
      {
        spanish: 'Chaque enfant a un cadeau. (Each child has a gift.)',
        english: 'Distributive meaning - every single one individually',
        highlight: ['Chaque enfant']
      },
      {
        spanish: 'Tout le travail est fini. (All the work is finished.)',
        english: 'Totality - the complete amount',
        highlight: ['Tout le travail']
      }
    ]
  },
  {
    title: 'QUELQUE(S) - Some, A Few',
    content: `**QUELQUE** expresses an **indefinite small quantity**:`,
    conjugationTable: {
      title: 'Quelque Agreement Forms',
      conjugations: [
        { pronoun: 'Masculine singular', form: 'quelque', english: 'quelque temps (some time)' },
        { pronoun: 'Feminine singular', form: 'quelque', english: 'quelque chose (something)' },
        { pronoun: 'Masculine plural', form: 'quelques', english: 'quelques amis (some friends)' },
        { pronoun: 'Feminine plural', form: 'quelques', english: 'quelques idées (some ideas)' }
      ]
    },
    examples: [
      {
        spanish: 'J\'ai quelques questions. (I have some questions.)',
        english: 'Il reste quelque temps. (There\'s some time left.)',
        highlight: ['quelques questions', 'quelque temps']
      },
      {
        spanish: 'Quelques étudiants sont absents. (Some students are absent.)',
        english: 'Elle a quelque difficulté. (She has some difficulty.)',
        highlight: ['Quelques étudiants', 'quelque difficulté']
      }
    ],
    subsections: [
      {
        title: 'Singular QUELQUE',
        content: 'Used with uncountable or abstract nouns:',
        examples: [
          {
            spanish: 'Il a quelque talent. (He has some talent.)',
            english: 'avec quelque difficulté (with some difficulty)',
            highlight: ['quelque talent', 'quelque difficulté']
          }
        ]
      },
      {
        title: 'Plural QUELQUES',
        content: 'Used with countable nouns (most common):',
        examples: [
          {
            spanish: 'Quelques minutes plus tard... (A few minutes later...)',
            english: 'J\'ai acheté quelques livres. (I bought some books.)',
            highlight: ['Quelques minutes', 'quelques livres']
          }
        ]
      }
    ]
  },
  {
    title: 'CHAQUE - Each, Every',
    content: `**CHAQUE** is **invariable** and expresses **distributive meaning**:`,
    examples: [
      {
        spanish: 'Chaque étudiant a réussi. (Each student succeeded.)',
        english: 'Chaque fois que je viens... (Each time I come...)',
        highlight: ['Chaque étudiant', 'Chaque fois']
      },
      {
        spanish: 'Chaque jour, il court. (Every day, he runs.)',
        english: 'Chaque personne est unique. (Each person is unique.)',
        highlight: ['Chaque jour', 'Chaque personne']
      }
    ],
    subsections: [
      {
        title: 'Invariable Form',
        content: 'CHAQUE never changes form:',
        examples: [
          {
            spanish: 'chaque homme, chaque femme, chaque enfant',
            english: 'Always the same form regardless of gender',
            highlight: ['chaque homme', 'chaque femme', 'chaque enfant']
          }
        ]
      },
      {
        title: 'Distributive Meaning',
        content: 'Emphasizes individual items in a group:',
        examples: [
          {
            spanish: 'Chaque élève a son livre. (Each student has his/her book.)',
            english: 'Focus on individual possession, not group',
            highlight: ['Chaque élève a son livre']
          }
        ]
      },
      {
        title: 'Common Expressions',
        content: 'Frequent phrases with CHAQUE:',
        examples: [
          {
            spanish: 'chaque fois (each time), chaque jour (every day)',
            english: 'chaque année (every year), chaque mois (every month)',
            highlight: ['chaque fois', 'chaque jour', 'chaque année']
          }
        ]
      }
    ]
  },
  {
    title: 'TOUT/TOUTE/TOUS/TOUTES - All, Every, Whole',
    content: `**TOUT** agrees in gender and number and expresses **totality**:`,
    conjugationTable: {
      title: 'Tout Agreement Forms',
      conjugations: [
        { pronoun: 'Masculine singular', form: 'tout', english: 'tout le monde (everyone)' },
        { pronoun: 'Feminine singular', form: 'toute', english: 'toute la journée (all day)' },
        { pronoun: 'Masculine plural', form: 'tous', english: 'tous les jours (every day)' },
        { pronoun: 'Feminine plural', form: 'toutes', english: 'toutes les femmes (all women)' }
      ]
    },
    examples: [
      {
        spanish: 'Tout le monde est là. (Everyone is there.)',
        english: 'Toute la classe écoute. (The whole class is listening.)',
        highlight: ['Tout le monde', 'Toute la classe']
      },
      {
        spanish: 'Tous les étudiants travaillent. (All students work.)',
        english: 'Toutes les voitures sont rouges. (All cars are red.)',
        highlight: ['Tous les étudiants', 'Toutes les voitures']
      }
    ],
    subsections: [
      {
        title: 'TOUT + Definite Article',
        content: 'Most common pattern with le/la/les:',
        examples: [
          {
            spanish: 'tout le temps (all the time)',
            english: 'toute la nuit (all night)',
            highlight: ['tout le temps', 'toute la nuit']
          }
        ]
      },
      {
        title: 'TOUS/TOUTES LES + Plural',
        content: 'Expressing "every" with plural nouns:',
        examples: [
          {
            spanish: 'tous les jours (every day)',
            english: 'toutes les semaines (every week)',
            highlight: ['tous les jours', 'toutes les semaines']
          }
        ]
      },
      {
        title: 'Fixed Expressions',
        content: 'Common phrases with TOUT:',
        examples: [
          {
            spanish: 'tout le monde (everyone), tout à fait (completely)',
            english: 'tout de suite (right away), tout à l\'heure (later)',
            highlight: ['tout le monde', 'tout de suite']
          }
        ]
      }
    ]
  },
  {
    title: 'AUTRE(S) - Other, Another',
    content: `**AUTRE** agrees in number and expresses **difference or addition**:`,
    examples: [
      {
        spanish: 'J\'ai une autre idée. (I have another idea.)',
        english: 'Les autres étudiants sont partis. (The other students left.)',
        highlight: ['une autre idée', 'Les autres étudiants']
      },
      {
        spanish: 'Donnez-moi d\'autres exemples. (Give me other examples.)',
        english: 'C\'est une autre histoire. (That\'s another story.)',
        highlight: ['d\'autres exemples', 'une autre histoire']
      }
    ],
    subsections: [
      {
        title: 'UN(E) AUTRE - Another',
        content: 'Singular form meaning "another":',
        examples: [
          {
            spanish: 'Je veux un autre café. (I want another coffee.)',
            english: 'Elle a une autre voiture. (She has another car.)',
            highlight: ['un autre café', 'une autre voiture']
          }
        ]
      },
      {
        title: 'LES AUTRES - The Others',
        content: 'Plural form meaning "the others":',
        examples: [
          {
            spanish: 'Où sont les autres? (Where are the others?)',
            english: 'Les autres livres sont là. (The other books are there.)',
            highlight: ['les autres', 'Les autres livres']
          }
        ]
      },
      {
        title: 'D\'AUTRES - Other (Some)',
        content: 'Partitive form meaning "other/some other":',
        examples: [
          {
            spanish: 'Il y a d\'autres solutions. (There are other solutions.)',
            english: 'J\'ai d\'autres questions. (I have other questions.)',
            highlight: ['d\'autres solutions', 'd\'autres questions']
          }
        ]
      }
    ]
  },
  {
    title: 'PLUSIEURS - Several',
    content: `**PLUSIEURS** is **invariable** and means **several**:`,
    examples: [
      {
        spanish: 'Plusieurs personnes sont venues. (Several people came.)',
        english: 'J\'ai lu plusieurs livres. (I read several books.)',
        highlight: ['Plusieurs personnes', 'plusieurs livres']
      },
      {
        spanish: 'Il a plusieurs voitures. (He has several cars.)',
        english: 'Plusieurs fois par jour... (Several times a day...)',
        highlight: ['plusieurs voitures', 'Plusieurs fois']
      }
    ],
    subsections: [
      {
        title: 'Invariable Form',
        content: 'PLUSIEURS never changes:',
        examples: [
          {
            spanish: 'plusieurs hommes, plusieurs femmes',
            english: 'Same form for all genders and contexts',
            highlight: ['plusieurs hommes', 'plusieurs femmes']
          }
        ]
      },
      {
        title: 'Meaning Range',
        content: 'Usually means 3-10 items:',
        examples: [
          {
            spanish: 'J\'ai attendu plusieurs heures. (I waited several hours.)',
            english: 'More than "quelques" but not "beaucoup"',
            highlight: ['plusieurs heures']
          }
        ]
      }
    ]
  },
  {
    title: 'CERTAIN(S)/CERTAINE(S) - Certain, Some',
    content: `**CERTAIN** agrees and means **certain/some** (indefinite):`,
    conjugationTable: {
      title: 'Certain Agreement Forms',
      conjugations: [
        { pronoun: 'Masculine singular', form: 'certain', english: 'un certain temps (a certain time)' },
        { pronoun: 'Feminine singular', form: 'certaine', english: 'une certaine idée (a certain idea)' },
        { pronoun: 'Masculine plural', form: 'certains', english: 'certains étudiants (some students)' },
        { pronoun: 'Feminine plural', form: 'certaines', english: 'certaines personnes (some people)' }
      ]
    },
    examples: [
      {
        spanish: 'Certaines personnes pensent que... (Some people think that...)',
        english: 'Il a un certain charme. (He has a certain charm.)',
        highlight: ['Certaines personnes', 'un certain charme']
      }
    ],
    subsections: [
      {
        title: 'Indefinite Usage',
        content: 'When meaning "some" (plural):',
        examples: [
          {
            spanish: 'Certains étudiants sont absents. (Some students are absent.)',
            english: 'More formal than "quelques"',
            highlight: ['Certains étudiants']
          }
        ]
      },
      {
        title: 'Specific but Vague Usage',
        content: 'When meaning "a certain" (singular):',
        examples: [
          {
            spanish: 'Il y a une certaine logique. (There\'s a certain logic.)',
            english: 'Suggests something specific but undefined',
            highlight: ['une certaine logique']
          }
        ]
      }
    ]
  },
  {
    title: 'Position and Word Order',
    content: `Indefinite adjectives usually come **before the noun**:`,
    examples: [
      {
        spanish: 'quelques amis, chaque jour, tout le monde',
        english: 'Standard position before the noun',
        highlight: ['quelques amis', 'chaque jour', 'tout le monde']
      },
      {
        spanish: 'plusieurs fois, certaines personnes, d\'autres idées',
        english: 'Consistent pre-noun placement',
        highlight: ['plusieurs fois', 'certaines personnes', 'd\'autres idées']
      }
    ],
    subsections: [
      {
        title: 'With Other Adjectives',
        content: 'Order when combined with other adjectives:',
        examples: [
          {
            spanish: 'quelques belles voitures (some beautiful cars)',
            english: 'Indefinite + descriptive adjective',
            highlight: ['quelques belles voitures']
          }
        ]
      }
    ]
  },
  {
    title: 'Indefinite Adjectives vs Pronouns',
    content: `Same words can function as adjectives or pronouns:`,
    conjugationTable: {
      title: 'Adjective vs Pronoun Usage',
      conjugations: [
        { pronoun: 'Adjective', form: 'quelques livres', english: 'modifies noun "livres"' },
        { pronoun: 'Pronoun', form: 'quelques-uns', english: 'replaces noun entirely' },
        { pronoun: 'Adjective', form: 'tous les étudiants', english: 'modifies noun "étudiants"' },
        { pronoun: 'Pronoun', form: 'tous', english: 'replaces noun entirely' }
      ]
    },
    examples: [
      {
        spanish: 'J\'ai quelques livres. → J\'en ai quelques-uns. (I have some books. → I have some.)',
        english: 'Adjective becomes pronoun with -uns/-unes',
        highlight: ['quelques livres', 'quelques-uns']
      }
    ]
  },
  {
    title: 'Common Expressions and Idioms',
    content: `Fixed expressions with indefinite adjectives:`,
    examples: [
      {
        spanish: 'tout le monde (everyone), tout à fait (completely)',
        english: 'chaque fois (each time), d\'autres part (on the other hand)',
        highlight: ['tout le monde', 'chaque fois']
      },
      {
        spanish: 'quelque chose (something), quelque part (somewhere)',
        english: 'certains disent (some say), plusieurs fois (several times)',
        highlight: ['quelque chose', 'certains disent']
      }
    ]
  },
  {
    title: 'Common Mistakes with Indefinite Adjectives',
    content: `Here are frequent errors students make:

**1. Agreement errors**: Wrong gender/number agreement
**2. Confusing adjectives and pronouns**: Using wrong forms
**3. Position mistakes**: Placing after noun instead of before
**4. Overuse**: Using when more specific terms would be better`,
    examples: [
      {
        spanish: '❌ quelque personnes → ✅ quelques personnes',
        english: 'Wrong: plural noun needs plural adjective',
        highlight: ['quelques personnes']
      },
      {
        spanish: '❌ tous le monde → ✅ tout le monde',
        english: 'Wrong: singular "monde" needs singular "tout"',
        highlight: ['tout le monde']
      },
      {
        spanish: '❌ personnes quelques → ✅ quelques personnes',
        english: 'Wrong: indefinite adjectives come before noun',
        highlight: ['quelques personnes']
      },
      {
        spanish: '❌ chaques étudiants → ✅ chaque étudiant',
        english: 'Wrong: "chaque" is invariable and takes singular noun',
        highlight: ['chaque étudiant']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Demonstrative Adjectives', url: '/grammar/french/adjectives/demonstrative', difficulty: 'beginner' },
  { title: 'French Possessive Adjectives', url: '/grammar/french/adjectives/possessive-adjectives', difficulty: 'beginner' },
  { title: 'French Indefinite Pronouns', url: '/grammar/french/pronouns/indefinite', difficulty: 'advanced' },
  { title: 'French Quantifiers', url: '/grammar/french/adverbs/quantifiers', difficulty: 'intermediate' }
];

export default function FrenchIndefiniteAdjectivesPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'adjectives',
              topic: 'indefinite-adjectives',
              title: 'French Indefinite Adjectives (Quelque, Chaque, Tout, Autre)',
              description: 'Master French indefinite adjectives including quelque, chaque, tout, autre, plusieurs, and their agreement patterns.',
              difficulty: 'intermediate',
              examples: [
                'Quelques amis sont venus. (Some friends came.)',
                'Chaque étudiant a un livre. (Each student has a book.)',
                'Tout le monde est là. (Everyone is there.)',
                'J\'ai d\'autres idées. (I have other ideas.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adjectives',
              topic: 'indefinite-adjectives',
              title: 'French Indefinite Adjectives (Quelque, Chaque, Tout, Autre)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adjectives"
        topic="indefinite-adjectives"
        title="French Indefinite Adjectives (Quelque, Chaque, Tout, Autre)"
        description="Master French indefinite adjectives including quelque, chaque, tout, autre, plusieurs, and their agreement patterns"
        difficulty="intermediate"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/french/adjectives"
        practiceUrl="/grammar/french/adjectives/indefinite-adjectives/practice"
        quizUrl="/grammar/french/adjectives/indefinite-adjectives/quiz"
        songUrl="/songs/fr?theme=grammar&topic=indefinite-adjectives"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
