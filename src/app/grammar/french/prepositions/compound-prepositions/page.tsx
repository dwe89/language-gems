import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'prepositions',
  topic: 'compound-prepositions',
  title: 'French Compound Prepositions (À côté de, En face de, Au lieu de)',
  description: 'Master French compound prepositions including à côté de, en face de, au lieu de, and other multi-word prepositional phrases.',
  difficulty: 'intermediate',
  keywords: [
    'french compound prepositions',
    'à côté de french',
    'en face de french',
    'au lieu de french',
    'french prepositional phrases',
    'multi-word prepositions french'
  ],
  examples: [
    'À côté de la maison (next to the house)',
    'En face de l\'école (opposite the school)',
    'Au lieu de partir (instead of leaving)',
    'À cause de la pluie (because of the rain)'
  ]
});

const sections = [
  {
    title: 'Understanding French Compound Prepositions',
    content: `French **compound prepositions** are multi-word expressions that function as single prepositions. They typically consist of:

**Structure: Preposition + Noun + DE**
- **à côté de** (next to) = à + côté + de
- **en face de** (opposite) = en + face + de
- **au lieu de** (instead of) = au + lieu + de

These compound prepositions are essential for expressing:
- **Location relationships**: à côté de, en face de, au-dessus de
- **Time relationships**: au cours de, à partir de, jusqu'à
- **Cause and reason**: à cause de, grâce à, faute de
- **Manner and means**: au moyen de, à l'aide de, à force de

Understanding compound prepositions greatly improves your ability to express complex relationships in French.`,
    examples: [
      {
        spanish: 'La banque est à côté de la poste. (The bank is next to the post office.)',
        english: 'Location relationship - physical proximity',
        highlight: ['à côté de la poste']
      },
      {
        spanish: 'Au lieu de travailler, il regarde la télé. (Instead of working, he watches TV.)',
        english: 'Contrast relationship - alternative action',
        highlight: ['Au lieu de travailler']
      },
      {
        spanish: 'À cause de la grève, les trains ne marchent pas. (Because of the strike, trains aren\'t running.)',
        english: 'Causal relationship - reason for situation',
        highlight: ['À cause de la grève']
      }
    ]
  },
  {
    title: 'Location Compound Prepositions',
    content: `Compound prepositions expressing spatial relationships:`,
    conjugationTable: {
      title: 'Common Location Compound Prepositions',
      conjugations: [
        { pronoun: 'à côté de', form: 'next to/beside', english: 'à côté de la maison (next to the house)' },
        { pronoun: 'en face de', form: 'opposite/across from', english: 'en face de l\'école (opposite the school)' },
        { pronoun: 'au-dessus de', form: 'above/over', english: 'au-dessus de la table (above the table)' },
        { pronoun: 'au-dessous de', form: 'below/under', english: 'au-dessous du pont (under the bridge)' },
        { pronoun: 'au milieu de', form: 'in the middle of', english: 'au milieu de la rue (in the middle of the street)' },
        { pronoun: 'autour de', form: 'around', english: 'autour de la ville (around the city)' }
      ]
    },
    subsections: [
      {
        title: 'Proximity and Position',
        content: 'Expressing relative position:',
        examples: [
          {
            spanish: 'Le café est à côté du cinéma. (The café is next to the cinema.)',
            english: 'Ma voiture est en face de la tienne. (My car is opposite yours.)',
            highlight: ['à côté du cinéma', 'en face de la tienne']
          }
        ]
      },
      {
        title: 'Vertical Relationships',
        content: 'Above, below, and middle positions:',
        examples: [
          {
            spanish: 'L\'avion vole au-dessus des nuages. (The plane flies above the clouds.)',
            english: 'Le métro passe au-dessous de la rivière. (The subway passes under the river.)',
            highlight: ['au-dessus des nuages', 'au-dessous de la rivière']
          }
        ]
      }
    ]
  },
  {
    title: 'Time Compound Prepositions',
    content: `Compound prepositions expressing temporal relationships:`,
    conjugationTable: {
      title: 'Common Time Compound Prepositions',
      conjugations: [
        { pronoun: 'au cours de', form: 'during/in the course of', english: 'au cours de la réunion (during the meeting)' },
        { pronoun: 'à partir de', form: 'from/starting from', english: 'à partir de lundi (from Monday)' },
        { pronoun: 'jusqu\'à', form: 'until/up to', english: 'jusqu\'à demain (until tomorrow)' },
        { pronoun: 'au bout de', form: 'after/at the end of', english: 'au bout d\'une heure (after an hour)' },
        { pronoun: 'à la fin de', form: 'at the end of', english: 'à la fin du mois (at the end of the month)' },
        { pronoun: 'au début de', form: 'at the beginning of', english: 'au début de l\'année (at the beginning of the year)' }
      ]
    },
    subsections: [
      {
        title: 'Duration and Periods',
        content: 'Expressing time spans:',
        examples: [
          {
            spanish: 'Au cours de l\'été, nous voyageons. (During the summer, we travel.)',
            english: 'Au bout de trois ans, il a réussi. (After three years, he succeeded.)',
            highlight: ['Au cours de l\'été', 'Au bout de trois ans']
          }
        ]
      },
      {
        title: 'Starting and Ending Points',
        content: 'Beginning and conclusion times:',
        examples: [
          {
            spanish: 'À partir de maintenant, je fais du sport. (From now on, I\'m doing sports.)',
            english: 'Jusqu\'à la fin, elle a espéré. (Until the end, she hoped.)',
            highlight: ['À partir de maintenant', 'Jusqu\'à la fin']
          }
        ]
      }
    ]
  },
  {
    title: 'Cause and Reason Compound Prepositions',
    content: `Compound prepositions expressing causation:`,
    conjugationTable: {
      title: 'Cause and Reason Compound Prepositions',
      conjugations: [
        { pronoun: 'à cause de', form: 'because of (negative)', english: 'à cause de la pluie (because of the rain)' },
        { pronoun: 'grâce à', form: 'thanks to (positive)', english: 'grâce à ton aide (thanks to your help)' },
        { pronoun: 'faute de', form: 'for lack of', english: 'faute d\'argent (for lack of money)' },
        { pronoun: 'en raison de', form: 'due to/because of', english: 'en raison du mauvais temps (due to bad weather)' },
        { pronoun: 'par suite de', form: 'as a result of', english: 'par suite de l\'accident (as a result of the accident)' },
        { pronoun: 'sous prétexte de', form: 'under the pretext of', english: 'sous prétexte de maladie (under the pretext of illness)' }
      ]
    },
    subsections: [
      {
        title: 'Positive vs Negative Causation',
        content: 'Distinguishing between positive and negative causes:',
        examples: [
          {
            spanish: 'Grâce à tes conseils, j\'ai réussi. (Thanks to your advice, I succeeded.)',
            english: 'À cause du bruit, je ne peux pas dormir. (Because of the noise, I can\'t sleep.)',
            highlight: ['Grâce à tes conseils', 'À cause du bruit']
          }
        ]
      },
      {
        title: 'Formal Causation',
        content: 'More formal expressions of cause:',
        examples: [
          {
            spanish: 'En raison des travaux, la route est fermée. (Due to construction work, the road is closed.)',
            english: 'Par suite de sa négligence, il a eu un accident. (As a result of his negligence, he had an accident.)',
            highlight: ['En raison des travaux', 'Par suite de sa négligence']
          }
        ]
      }
    ]
  },
  {
    title: 'Manner and Means Compound Prepositions',
    content: `Compound prepositions expressing how something is done:`,
    conjugationTable: {
      title: 'Manner and Means Compound Prepositions',
      conjugations: [
        { pronoun: 'au moyen de', form: 'by means of', english: 'au moyen d\'un ordinateur (by means of a computer)' },
        { pronoun: 'à l\'aide de', form: 'with the help of', english: 'à l\'aide d\'un dictionnaire (with the help of a dictionary)' },
        { pronoun: 'à force de', form: 'by dint of/through', english: 'à force de travailler (through working)' },
        { pronoun: 'faute de', form: 'for want of', english: 'faute de mieux (for want of better)' },
        { pronoun: 'en dépit de', form: 'in spite of', english: 'en dépit des difficultés (in spite of difficulties)' },
        { pronoun: 'à la place de', form: 'instead of/in place of', english: 'à la place de son frère (instead of his brother)' }
      ]
    },
    subsections: [
      {
        title: 'Tools and Methods',
        content: 'Expressing means and instruments:',
        examples: [
          {
            spanish: 'Il a réparé la voiture au moyen d\'outils spéciaux. (He repaired the car by means of special tools.)',
            english: 'J\'ai traduit le texte à l\'aide d\'un dictionnaire. (I translated the text with the help of a dictionary.)',
            highlight: ['au moyen d\'outils spéciaux', 'à l\'aide d\'un dictionnaire']
          }
        ]
      },
      {
        title: 'Effort and Persistence',
        content: 'Expressing sustained effort:',
        examples: [
          {
            spanish: 'À force de répéter, il a appris. (Through repetition, he learned.)',
            english: 'En dépit de la fatigue, elle a continué. (In spite of fatigue, she continued.)',
            highlight: ['À force de répéter', 'En dépit de la fatigue']
          }
        ]
      }
    ]
  },
  {
    title: 'Replacement and Alternative Compound Prepositions',
    content: `Expressing substitution and alternatives:`,
    examples: [
      {
        spanish: 'Au lieu de regarder la télé, lis un livre. (Instead of watching TV, read a book.)',
        english: 'À la place du sucre, utilise du miel. (Instead of sugar, use honey.)',
        highlight: ['Au lieu de regarder', 'À la place du sucre']
      }
    ],
    subsections: [
      {
        title: 'AU LIEU DE vs À LA PLACE DE',
        content: 'Subtle differences in usage:',
        examples: [
          {
            spanish: 'Au lieu de + action: Au lieu de partir, reste.',
            english: 'À la place de + person/thing: À la place de Paul, je viendrais.',
            highlight: ['Au lieu de + action', 'À la place de + person/thing']
          }
        ]
      }
    ]
  },
  {
    title: 'Contractions with Compound Prepositions',
    content: `Many compound prepositions contract with articles:`,
    conjugationTable: {
      title: 'Common Contractions',
      conjugations: [
        { pronoun: 'à côté de + le', form: 'à côté du', english: 'à côté du magasin (next to the store)' },
        { pronoun: 'à côté de + les', form: 'à côté des', english: 'à côté des arbres (next to the trees)' },
        { pronoun: 'au lieu de + le', form: 'au lieu du', english: 'au lieu du café (instead of coffee)' },
        { pronoun: 'au cours de + le', form: 'au cours du', english: 'au cours du voyage (during the trip)' },
        { pronoun: 'grâce à + le', form: 'grâce au', english: 'grâce au professeur (thanks to the teacher)' },
        { pronoun: 'grâce à + les', form: 'grâce aux', english: 'grâce aux amis (thanks to friends)' }
      ]
    },
    subsections: [
      {
        title: 'Mandatory Contractions',
        content: 'Contractions that must be used:',
        examples: [
          {
            spanish: '✅ à côté du parc (next to the park)',
            english: '❌ à côté de le parc (incorrect)',
            highlight: ['à côté du parc']
          }
        ]
      }
    ]
  },
  {
    title: 'Usage in Different Registers',
    content: `Compound prepositions vary by formality level:`,
    subsections: [
      {
        title: 'Informal/Spoken French',
        content: 'Common in everyday conversation:',
        examples: [
          {
            spanish: 'à côté de, en face de, à cause de',
            english: 'grâce à, au lieu de, à partir de',
            highlight: ['à côté de', 'grâce à']
          }
        ]
      },
      {
        title: 'Formal/Written French',
        content: 'More sophisticated expressions:',
        examples: [
          {
            spanish: 'en raison de, par suite de, en dépit de',
            english: 'au moyen de, sous prétexte de, faute de',
            highlight: ['en raison de', 'au moyen de']
          }
        ]
      }
    ]
  },
  {
    title: 'Compound Prepositions with Infinitives',
    content: `Some compound prepositions can be followed by infinitives:`,
    examples: [
      {
        spanish: 'Au lieu de partir, il est resté. (Instead of leaving, he stayed.)',
        english: 'À force de travailler, elle a réussi. (Through working, she succeeded.)',
        highlight: ['Au lieu de partir', 'À force de travailler']
      },
      {
        spanish: 'Faute de pouvoir venir, il a téléphoné. (Unable to come, he called.)',
        english: 'À l\'aide de bien expliquer, il a convaincu. (By explaining well, he convinced.)',
        highlight: ['Faute de pouvoir venir', 'À l\'aide de bien expliquer']
      }
    ]
  },
  {
    title: 'Regional Variations',
    content: `Some compound prepositions vary by region:`,
    subsections: [
      {
        title: 'France vs Quebec',
        content: 'Different preferences in usage:',
        examples: [
          {
            spanish: 'France: en face de l\'école',
            english: 'Quebec: vis-à-vis l\'école (also used)',
            highlight: ['en face de', 'vis-à-vis']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes with Compound Prepositions',
    content: `Here are frequent errors students make:

**1. Missing DE**: Forgetting the final "de" in compound prepositions
**2. Wrong contractions**: Not contracting with definite articles
**3. Confusion with similar meanings**: Mixing up à cause de vs grâce à
**4. Word order**: Placing elements in wrong order`,
    examples: [
      {
        spanish: '❌ à côté la maison → ✅ à côté de la maison',
        english: 'Wrong: missing "de" in compound preposition',
        highlight: ['à côté de la maison']
      },
      {
        spanish: '❌ à côté de le magasin → ✅ à côté du magasin',
        english: 'Wrong: not contracting "de + le" to "du"',
        highlight: ['à côté du magasin']
      },
      {
        spanish: '❌ À cause de ton aide → ✅ Grâce à ton aide',
        english: 'Wrong: using negative causation for positive result',
        highlight: ['Grâce à ton aide']
      },
      {
        spanish: '❌ au de lieu partir → ✅ au lieu de partir',
        english: 'Wrong: incorrect word order in compound preposition',
        highlight: ['au lieu de partir']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Basic Prepositions', url: '/grammar/french/prepositions/basic-prepositions', difficulty: 'beginner' },
  { title: 'French Location Prepositions', url: '/grammar/french/prepositions/location', difficulty: 'intermediate' },
  { title: 'French Articles and Contractions', url: '/grammar/french/nouns/contractions', difficulty: 'intermediate' },
  { title: 'French Conjunctions', url: '/grammar/french/conjunctions/coordinating', difficulty: 'intermediate' }
];

export default function FrenchCompoundPrepositionsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'prepositions',
              topic: 'compound-prepositions',
              title: 'French Compound Prepositions (À côté de, En face de, Au lieu de)',
              description: 'Master French compound prepositions including à côté de, en face de, au lieu de, and other multi-word prepositional phrases.',
              difficulty: 'intermediate',
              examples: [
                'À côté de la maison (next to the house)',
                'En face de l\'école (opposite the school)',
                'Au lieu de partir (instead of leaving)',
                'À cause de la pluie (because of the rain)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'prepositions',
              topic: 'compound-prepositions',
              title: 'French Compound Prepositions (À côté de, En face de, Au lieu de)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="prepositions"
        topic="compound-prepositions"
        title="French Compound Prepositions (À côté de, En face de, Au lieu de)"
        description="Master French compound prepositions including à côté de, en face de, au lieu de, and other multi-word prepositional phrases"
        difficulty="intermediate"
        estimatedTime={14}
        sections={sections}
        backUrl="/grammar/french/prepositions"
        practiceUrl="/grammar/french/prepositions/compound-prepositions/practice"
        quizUrl="/grammar/french/prepositions/compound-prepositions/quiz"
        songUrl="/songs/fr?theme=grammar&topic=compound-prepositions"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
