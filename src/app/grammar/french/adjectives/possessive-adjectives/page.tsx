import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adjectives',
  topic: 'possessive-adjectives',
  title: 'French Possessive Adjectives (Mon, Ton, Son, Notre, Votre, Leur)',
  description: 'Master French possessive adjectives including mon/ma/mes, ton/ta/tes, son/sa/ses, notre/nos, votre/vos, leur/leurs.',
  difficulty: 'beginner',
  keywords: [
    'french possessive adjectives',
    'mon ma mes french',
    'ton ta tes french',
    'son sa ses french',
    'notre nos french',
    'votre vos french',
    'leur leurs french'
  ],
  examples: [
    'Mon livre est sur la table. (My book is on the table.)',
    'Sa voiture est rouge. (His/her car is red.)',
    'Nos amis arrivent demain. (Our friends arrive tomorrow.)',
    'Leurs enfants jouent dehors. (Their children play outside.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Possessive Adjectives',
    content: `French possessive adjectives show **ownership or relationship** and must agree with the **noun they modify**, not the possessor.

**Key principle**: Agreement is with the **possessed object**, not the **possessor**:
- **mon livre** (my book) - masculine singular
- **ma voiture** (my car) - feminine singular  
- **mes livres** (my books) - plural

**Complete system:**
- **mon/ma/mes**: my
- **ton/ta/tes**: your (informal)
- **son/sa/ses**: his/her/its
- **notre/nos**: our
- **votre/vos**: your (formal/plural)
- **leur/leurs**: their

This agreement system is fundamental to French and differs significantly from English, where possessive adjectives don't change form.`,
    examples: [
      {
        spanish: 'Pierre lit son livre. (Pierre reads his book.)',
        english: 'Agreement with "livre" (masculine), not with Pierre',
        highlight: ['son livre']
      },
      {
        spanish: 'Marie lit son livre. (Marie reads her book.)',
        english: 'Same form "son" because "livre" is masculine',
        highlight: ['son livre']
      },
      {
        spanish: 'Pierre conduit sa voiture. (Pierre drives his car.)',
        english: 'Agreement with "voiture" (feminine), not with Pierre',
        highlight: ['sa voiture']
      }
    ]
  },
  {
    title: 'MON/MA/MES - My',
    content: `**MON/MA/MES** agree with the possessed noun:`,
    conjugationTable: {
      title: 'Mon/Ma/Mes Agreement',
      conjugations: [
        { pronoun: 'Masculine singular', form: 'mon', english: 'mon père (my father)' },
        { pronoun: 'Feminine singular', form: 'ma', english: 'ma mère (my mother)' },
        { pronoun: 'Plural (both genders)', form: 'mes', english: 'mes parents (my parents)' },
        { pronoun: 'Fem. before vowel', form: 'mon', english: 'mon école (my school)' }
      ]
    },
    examples: [
      {
        spanish: 'Mon chien est mignon. (My dog is cute.)',
        english: 'Ma maison est grande. (My house is big.)',
        highlight: ['Mon chien', 'Ma maison']
      },
      {
        spanish: 'Mes amis arrivent. (My friends are arriving.)',
        english: 'Mon école est fermée. (My school is closed.)',
        highlight: ['Mes amis', 'Mon école']
      }
    ],
    subsections: [
      {
        title: 'Special Case: MON before Feminine Vowels',
        content: 'Use MON (not MA) before feminine nouns starting with vowels:',
        examples: [
          {
            spanish: 'mon école (my school) - feminine but starts with vowel',
            english: 'mon amie (my friend) - feminine but starts with vowel',
            highlight: ['mon école', 'mon amie']
          }
        ]
      }
    ]
  },
  {
    title: 'TON/TA/TES - Your (Informal)',
    content: `**TON/TA/TES** used with people you address as **TU**:`,
    conjugationTable: {
      title: 'Ton/Ta/Tes Agreement',
      conjugations: [
        { pronoun: 'Masculine singular', form: 'ton', english: 'ton frère (your brother)' },
        { pronoun: 'Feminine singular', form: 'ta', english: 'ta sœur (your sister)' },
        { pronoun: 'Plural (both genders)', form: 'tes', english: 'tes livres (your books)' },
        { pronoun: 'Fem. before vowel', form: 'ton', english: 'ton amie (your friend)' }
      ]
    },
    examples: [
      {
        spanish: 'Ton travail est excellent. (Your work is excellent.)',
        english: 'Ta voiture est belle. (Your car is beautiful.)',
        highlight: ['Ton travail', 'Ta voiture']
      },
      {
        spanish: 'Tes enfants sont sages. (Your children are well-behaved.)',
        english: 'Ton université est loin? (Is your university far?)',
        highlight: ['Tes enfants', 'Ton université']
      }
    ]
  },
  {
    title: 'SON/SA/SES - His/Her/Its',
    content: `**SON/SA/SES** used for third person singular possession:`,
    conjugationTable: {
      title: 'Son/Sa/Ses Agreement',
      conjugations: [
        { pronoun: 'Masculine singular', form: 'son', english: 'son père (his/her father)' },
        { pronoun: 'Feminine singular', form: 'sa', english: 'sa mère (his/her mother)' },
        { pronoun: 'Plural (both genders)', form: 'ses', english: 'ses parents (his/her parents)' },
        { pronoun: 'Fem. before vowel', form: 'son', english: 'son école (his/her school)' }
      ]
    },
    examples: [
      {
        spanish: 'Pierre aime son travail. (Pierre loves his work.)',
        english: 'Marie aime son travail. (Marie loves her work.)',
        highlight: ['son travail', 'son travail']
      },
      {
        spanish: 'Il cherche sa clé. (He\'s looking for his key.)',
        english: 'Elle cherche sa clé. (She\'s looking for her key.)',
        highlight: ['sa clé', 'sa clé']
      }
    ],
    subsections: [
      {
        title: 'Gender Ambiguity',
        content: 'SON/SA/SES don\'t indicate possessor\'s gender:',
        examples: [
          {
            spanish: 'Paul parle à sa mère. (Paul talks to his mother.)',
            english: 'Marie parle à sa mère. (Marie talks to her mother.)',
            highlight: ['sa mère', 'sa mère']
          }
        ]
      },
      {
        title: 'Clarification When Needed',
        content: 'Add clarification if context unclear:',
        examples: [
          {
            spanish: 'Pierre parle à sa mère à lui. (Pierre talks to his own mother.)',
            english: 'Marie parle à sa mère à elle. (Marie talks to her own mother.)',
            highlight: ['sa mère à lui', 'sa mère à elle']
          }
        ]
      }
    ]
  },
  {
    title: 'NOTRE/NOS - Our',
    content: `**NOTRE/NOS** used for first person plural possession:`,
    conjugationTable: {
      title: 'Notre/Nos Agreement',
      conjugations: [
        { pronoun: 'Singular (both genders)', form: 'notre', english: 'notre maison (our house)' },
        { pronoun: 'Plural (both genders)', form: 'nos', english: 'nos enfants (our children)' }
      ]
    },
    examples: [
      {
        spanish: 'Notre voiture est en panne. (Our car is broken down.)',
        english: 'Notre école est moderne. (Our school is modern.)',
        highlight: ['Notre voiture', 'Notre école']
      },
      {
        spanish: 'Nos amis viennent dîner. (Our friends are coming for dinner.)',
        english: 'Nos vacances commencent demain. (Our vacation starts tomorrow.)',
        highlight: ['Nos amis', 'Nos vacances']
      }
    ],
    subsections: [
      {
        title: 'No Gender Distinction',
        content: 'NOTRE is the same for masculine and feminine:',
        examples: [
          {
            spanish: 'notre père, notre mère (our father, our mother)',
            english: 'Same form regardless of gender',
            highlight: ['notre père', 'notre mère']
          }
        ]
      }
    ]
  },
  {
    title: 'VOTRE/VOS - Your (Formal/Plural)',
    content: `**VOTRE/VOS** used with people you address as **VOUS**:`,
    conjugationTable: {
      title: 'Votre/Vos Agreement',
      conjugations: [
        { pronoun: 'Singular (both genders)', form: 'votre', english: 'votre travail (your work)' },
        { pronoun: 'Plural (both genders)', form: 'vos', english: 'vos idées (your ideas)' }
      ]
    },
    examples: [
      {
        spanish: 'Votre présentation était excellente. (Your presentation was excellent.)',
        english: 'Votre fille est très polie. (Your daughter is very polite.)',
        highlight: ['Votre présentation', 'Votre fille']
      },
      {
        spanish: 'Vos documents sont prêts. (Your documents are ready.)',
        english: 'Vos suggestions sont intéressantes. (Your suggestions are interesting.)',
        highlight: ['Vos documents', 'Vos suggestions']
      }
    ],
    subsections: [
      {
        title: 'Formal Address',
        content: 'Used in professional/formal contexts:',
        examples: [
          {
            spanish: 'Monsieur, votre commande est prête. (Sir, your order is ready.)',
            english: 'Madame, votre rendez-vous est confirmé. (Madam, your appointment is confirmed.)',
            highlight: ['votre commande', 'votre rendez-vous']
          }
        ]
      },
      {
        title: 'Plural Address',
        content: 'Used when addressing multiple people:',
        examples: [
          {
            spanish: 'Vos enfants sont adorables. (Your children are adorable.)',
            english: 'Speaking to parents about their children',
            highlight: ['Vos enfants']
          }
        ]
      }
    ]
  },
  {
    title: 'LEUR/LEURS - Their',
    content: `**LEUR/LEURS** used for third person plural possession:`,
    conjugationTable: {
      title: 'Leur/Leurs Agreement',
      conjugations: [
        { pronoun: 'Singular (both genders)', form: 'leur', english: 'leur maison (their house)' },
        { pronoun: 'Plural (both genders)', form: 'leurs', english: 'leurs enfants (their children)' }
      ]
    },
    examples: [
      {
        spanish: 'Leur voiture est neuve. (Their car is new.)',
        english: 'Leur fille étudie à Paris. (Their daughter studies in Paris.)',
        highlight: ['Leur voiture', 'Leur fille']
      },
      {
        spanish: 'Leurs amis habitent loin. (Their friends live far away.)',
        english: 'Leurs vacances ont été formidables. (Their vacation was wonderful.)',
        highlight: ['Leurs amis', 'Leurs vacances']
      }
    ],
    subsections: [
      {
        title: 'LEUR vs LEURS',
        content: 'Only number agreement, no gender distinction:',
        examples: [
          {
            spanish: 'leur père, leur mère (their father, their mother)',
            english: 'leurs pères, leurs mères (their fathers, their mothers)',
            highlight: ['leur père', 'leurs pères']
          }
        ]
      }
    ]
  },
  {
    title: 'Agreement Rules Summary',
    content: `Key agreement principles for possessive adjectives:`,
    conjugationTable: {
      title: 'Agreement Summary',
      conjugations: [
        { pronoun: 'With masculine singular', form: 'mon, ton, son, notre, votre, leur', english: 'mon livre, ton père, leur chat' },
        { pronoun: 'With feminine singular', form: 'ma, ta, sa, notre, votre, leur', english: 'ma voiture, ta mère, leur maison' },
        { pronoun: 'With plural', form: 'mes, tes, ses, nos, vos, leurs', english: 'mes livres, tes parents, leurs chats' },
        { pronoun: 'Fem. + vowel', form: 'mon, ton, son', english: 'mon école, ton amie, son université' }
      ]
    },
    subsections: [
      {
        title: 'Agreement with Possessed Object',
        content: 'Always agree with the noun being possessed:',
        examples: [
          {
            spanish: 'Pierre et sa voiture (Pierre and his car)',
            english: 'Marie et sa voiture (Marie and her car)',
            highlight: ['sa voiture', 'sa voiture']
          }
        ]
      }
    ]
  },
  {
    title: 'Possessive Adjectives vs Possessive Pronouns',
    content: `Don't confuse possessive adjectives with possessive pronouns:`,
    conjugationTable: {
      title: 'Adjectives vs Pronouns',
      conjugations: [
        { pronoun: 'Adjective', form: 'mon livre', english: 'modifies noun "livre"' },
        { pronoun: 'Pronoun', form: 'le mien', english: 'replaces noun entirely' },
        { pronoun: 'Adjective', form: 'sa voiture', english: 'modifies noun "voiture"' },
        { pronoun: 'Pronoun', form: 'la sienne', english: 'replaces noun entirely' }
      ]
    },
    examples: [
      {
        spanish: 'C\'est mon livre. → C\'est le mien. (It\'s my book. → It\'s mine.)',
        english: 'Adjective becomes pronoun',
        highlight: ['mon livre', 'le mien']
      }
    ]
  },
  {
    title: 'Common Expressions with Possessive Adjectives',
    content: `Frequent phrases and idioms:`,
    examples: [
      {
        spanish: 'à mon avis (in my opinion)',
        english: 'de notre côté (on our side)',
        highlight: ['à mon avis', 'de notre côté']
      },
      {
        spanish: 'pour ma part (for my part)',
        english: 'à votre service (at your service)',
        highlight: ['pour ma part', 'à votre service']
      }
    ],
    subsections: [
      {
        title: 'Body Parts',
        content: 'Often used with body parts:',
        examples: [
          {
            spanish: 'Il lève sa main. (He raises his hand.)',
            english: 'Elle ferme ses yeux. (She closes her eyes.)',
            highlight: ['sa main', 'ses yeux']
          }
        ]
      },
      {
        title: 'Family Members',
        content: 'Common with family vocabulary:',
        examples: [
          {
            spanish: 'ma famille, mes parents, notre grand-mère',
            english: 'Family relationships frequently use possessives',
            highlight: ['ma famille', 'mes parents', 'notre grand-mère']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes with Possessive Adjectives',
    content: `Here are frequent errors students make:

**1. Wrong agreement**: Agreeing with possessor instead of possessed object
**2. Forgetting vowel rule**: Using MA instead of MON before feminine vowels
**3. Confusing formal/informal**: Wrong choice between TON/TA/TES and VOTRE/VOS
**4. Number errors**: Wrong singular/plural forms`,
    examples: [
      {
        spanish: '❌ Marie et son voiture → ✅ Marie et sa voiture',
        english: 'Wrong: must agree with "voiture" (feminine)',
        highlight: ['sa voiture']
      },
      {
        spanish: '❌ ma école → ✅ mon école',
        english: 'Wrong: use MON before feminine words starting with vowels',
        highlight: ['mon école']
      },
      {
        spanish: '❌ Monsieur, ton travail → ✅ Monsieur, votre travail',
        english: 'Wrong: use VOTRE in formal situations',
        highlight: ['votre travail']
      },
      {
        spanish: '❌ leur enfants → ✅ leurs enfants',
        english: 'Wrong: plural noun needs plural possessive',
        highlight: ['leurs enfants']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Possessive Pronouns', url: '/grammar/french/pronouns/possessive', difficulty: 'intermediate' },
  { title: 'French Articles', url: '/grammar/french/nouns/definite-articles', difficulty: 'beginner' },
  { title: 'French Adjective Agreement', url: '/grammar/french/adjectives/agreement-rules', difficulty: 'intermediate' },
  { title: 'French Tu vs Vous', url: '/grammar/french/verbs/modes-of-address', difficulty: 'beginner' }
];

export default function FrenchPossessiveAdjectivesPage() {
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
              topic: 'possessive-adjectives',
              title: 'French Possessive Adjectives (Mon, Ton, Son, Notre, Votre, Leur)',
              description: 'Master French possessive adjectives including mon/ma/mes, ton/ta/tes, son/sa/ses, notre/nos, votre/vos, leur/leurs.',
              difficulty: 'beginner',
              examples: [
                'Mon livre est sur la table. (My book is on the table.)',
                'Sa voiture est rouge. (His/her car is red.)',
                'Nos amis arrivent demain. (Our friends arrive tomorrow.)',
                'Leurs enfants jouent dehors. (Their children play outside.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adjectives',
              topic: 'possessive-adjectives',
              title: 'French Possessive Adjectives (Mon, Ton, Son, Notre, Votre, Leur)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adjectives"
        topic="possessive-adjectives"
        title="French Possessive Adjectives (Mon, Ton, Son, Notre, Votre, Leur)"
        description="Master French possessive adjectives including mon/ma/mes, ton/ta/tes, son/sa/ses, notre/nos, votre/vos, leur/leurs"
        difficulty="beginner"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/french/adjectives"
        practiceUrl="/grammar/french/adjectives/possessive-adjectives/practice"
        quizUrl="/grammar/french/adjectives/possessive-adjectives/quiz"
        songUrl="/songs/fr?theme=grammar&topic=possessive-adjectives"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
