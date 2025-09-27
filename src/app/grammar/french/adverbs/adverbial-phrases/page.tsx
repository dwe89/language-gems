import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adverbs',
  topic: 'adverbial-phrases',
  title: 'French Common Adverbial Phrases (En fait, Bien sûr, Tout à fait)',
  description: 'Master French common adverbial phrases including en fait, bien sûr, tout à fait, par exemple, and their usage in conversation.',
  difficulty: 'intermediate',
  keywords: [
    'french adverbial phrases',
    'en fait french',
    'bien sûr french',
    'tout à fait french',
    'par exemple french',
    'french conversation phrases',
    'common french expressions'
  ],
  examples: [
    'En fait, je ne sais pas. (Actually, I don\'t know.)',
    'Bien sûr, c\'est possible. (Of course, it\'s possible.)',
    'Tout à fait d\'accord. (Completely agree.)',
    'Par exemple, cette voiture. (For example, this car.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Adverbial Phrases',
    content: `French adverbial phrases are **multi-word expressions** that function as single adverbs, providing **nuance, emphasis, and natural flow** to conversation and writing.

**Main categories:**
- **Certainty/Agreement**: bien sûr, tout à fait, sans doute
- **Clarification**: en fait, en réalité, c'est-à-dire
- **Examples**: par exemple, notamment, entre autres
- **Time/Sequence**: tout d'abord, ensuite, enfin
- **Manner**: en général, d'habitude, par hasard

**Key characteristics:**
- **Fixed expressions**: Cannot be changed or separated
- **Conversational**: Essential for natural French speech
- **Positioning**: Usually at beginning or end of clauses
- **Register**: Range from formal to informal
- **Frequency**: Used constantly by native speakers

These phrases are crucial for sounding natural and expressing subtle meanings in French.`,
    examples: [
      {
        spanish: 'En fait, je préfère le thé. (Actually, I prefer tea.)',
        english: 'Clarifies or corrects previous information',
        highlight: ['En fait, je préfère le thé']
      },
      {
        spanish: 'Bien sûr que oui! (Of course, yes!)',
        english: 'Expresses strong agreement or certainty',
        highlight: ['Bien sûr que oui']
      },
      {
        spanish: 'Par exemple, cette solution. (For example, this solution.)',
        english: 'Introduces a specific example',
        highlight: ['Par exemple, cette solution']
      }
    ]
  },
  {
    title: 'Certainty and Agreement Phrases',
    content: `Expressions showing **certainty, agreement, or strong opinion**:`,
    conjugationTable: {
      title: 'Certainty/Agreement Phrases',
      conjugations: [
        { pronoun: 'bien sûr', form: 'of course', english: 'Bien sûr, je viendrai. (Of course, I\'ll come.)' },
        { pronoun: 'tout à fait', form: 'completely, exactly', english: 'Tout à fait d\'accord. (Completely agree.)' },
        { pronoun: 'sans doute', form: 'no doubt, probably', english: 'Sans doute, il viendra. (No doubt, he\'ll come.)' },
        { pronoun: 'bien entendu', form: 'of course, naturally', english: 'Bien entendu, c\'est gratuit. (Of course, it\'s free.)' },
        { pronoun: 'évidemment', form: 'obviously', english: 'Évidemment, c\'est difficile. (Obviously, it\'s difficult.)' },
        { pronoun: 'certainement', form: 'certainly', english: 'Certainement, nous acceptons. (Certainly, we accept.)' }
      ]
    },
    examples: [
      {
        spanish: 'Bien sûr que je t\'aiderai! (Of course I\'ll help you!)',
        english: 'Tout à fait raison. (Absolutely right.)',
        highlight: ['Bien sûr que je t\'aiderai', 'Tout à fait raison']
      }
    ],
    subsections: [
      {
        title: 'BIEN SÛR vs BIEN ENTENDU',
        content: 'Both mean "of course" with slight differences:',
        examples: [
          {
            spanish: 'BIEN SÛR = of course (common, informal)',
            english: 'BIEN ENTENDU = of course (more formal)',
            highlight: ['BIEN SÛR', 'BIEN ENTENDU']
          }
        ]
      },
      {
        title: 'TOUT À FAIT Usage',
        content: 'Can stand alone or modify other words:',
        examples: [
          {
            spanish: 'Tout à fait! (Exactly!/Absolutely!)',
            english: 'Tout à fait d\'accord. (Completely agree.)',
            highlight: ['Tout à fait!', 'Tout à fait d\'accord']
          }
        ]
      }
    ]
  },
  {
    title: 'Clarification and Reality Phrases',
    content: `Expressions for **clarifying, correcting, or revealing truth**:`,
    conjugationTable: {
      title: 'Clarification Phrases',
      conjugations: [
        { pronoun: 'en fait', form: 'actually, in fact', english: 'En fait, je ne peux pas venir. (Actually, I can\'t come.)' },
        { pronoun: 'en réalité', form: 'in reality', english: 'En réalité, c\'est plus compliqué. (In reality, it\'s more complicated.)' },
        { pronoun: 'c\'est-à-dire', form: 'that is to say', english: 'C\'est-à-dire, demain matin. (That is to say, tomorrow morning.)' },
        { pronoun: 'autrement dit', form: 'in other words', english: 'Autrement dit, c\'est impossible. (In other words, it\'s impossible.)' },
        { pronoun: 'en d\'autres termes', form: 'in other terms', english: 'En d\'autres termes, nous refusons. (In other terms, we refuse.)' }
      ]
    },
    examples: [
      {
        spanish: 'En fait, j\'ai changé d\'avis. (Actually, I changed my mind.)',
        english: 'C\'est-à-dire que tu ne viens pas? (That is to say, you\'re not coming?)',
        highlight: ['En fait, j\'ai changé d\'avis', 'C\'est-à-dire que tu ne viens pas']
      }
    ],
    subsections: [
      {
        title: 'EN FAIT Usage',
        content: 'Most common clarification phrase:',
        examples: [
          {
            spanish: 'Je pensais venir, mais en fait, je suis occupé. (I thought I\'d come, but actually, I\'m busy.)',
            english: 'Often corrects or modifies previous statements',
            highlight: ['mais en fait, je suis occupé']
          }
        ]
      }
    ]
  },
  {
    title: 'Example and Illustration Phrases',
    content: `Expressions for **giving examples or illustrations**:`,
    conjugationTable: {
      title: 'Example Phrases',
      conjugations: [
        { pronoun: 'par exemple', form: 'for example', english: 'Par exemple, cette voiture. (For example, this car.)' },
        { pronoun: 'notamment', form: 'notably, in particular', english: 'Notamment, les enfants. (Notably, the children.)' },
        { pronoun: 'entre autres', form: 'among others', english: 'Pierre, entre autres. (Pierre, among others.)' },
        { pronoun: 'comme par exemple', form: 'such as for example', english: 'Des fruits, comme par exemple des pommes. (Fruits, such as apples.)' },
        { pronoun: 'à titre d\'exemple', form: 'as an example', english: 'À titre d\'exemple, voici... (As an example, here is...)' }
      ]
    },
    examples: [
      {
        spanish: 'J\'aime les sports, par exemple le tennis. (I like sports, for example tennis.)',
        english: 'Plusieurs personnes viendront, notamment Marie. (Several people will come, notably Marie.)',
        highlight: ['par exemple le tennis', 'notamment Marie']
      }
    ]
  },
  {
    title: 'Time and Sequence Phrases',
    content: `Expressions for **organizing time and sequence**:`,
    conjugationTable: {
      title: 'Time/Sequence Phrases',
      conjugations: [
        { pronoun: 'tout d\'abord', form: 'first of all', english: 'Tout d\'abord, préparons le matériel. (First of all, let\'s prepare the materials.)' },
        { pronoun: 'ensuite', form: 'then, next', english: 'Ensuite, nous partirons. (Then, we\'ll leave.)' },
        { pronoun: 'enfin', form: 'finally', english: 'Enfin, nous arriverons. (Finally, we\'ll arrive.)' },
        { pronoun: 'en premier lieu', form: 'in the first place', english: 'En premier lieu, étudions le problème. (In the first place, let\'s study the problem.)' },
        { pronoun: 'pour finir', form: 'to finish', english: 'Pour finir, signons le contrat. (To finish, let\'s sign the contract.)' }
      ]
    },
    examples: [
      {
        spanish: 'Tout d\'abord, je vous remercie. (First of all, I thank you.)',
        english: 'Ensuite, nous discuterons. (Then, we\'ll discuss.)',
        highlight: ['Tout d\'abord, je vous remercie', 'Ensuite, nous discuterons']
      }
    ]
  },
  {
    title: 'Manner and Habit Phrases',
    content: `Expressions describing **how things usually happen**:`,
    conjugationTable: {
      title: 'Manner/Habit Phrases',
      conjugations: [
        { pronoun: 'en général', form: 'in general', english: 'En général, je me lève tôt. (In general, I get up early.)' },
        { pronoun: 'd\'habitude', form: 'usually', english: 'D\'habitude, il arrive à l\'heure. (Usually, he arrives on time.)' },
        { pronoun: 'par hasard', form: 'by chance', english: 'Par hasard, j\'ai rencontré Paul. (By chance, I met Paul.)' },
        { pronoun: 'de toute façon', form: 'anyway', english: 'De toute façon, c\'est trop tard. (Anyway, it\'s too late.)' },
        { pronoun: 'en principe', form: 'in principle', english: 'En principe, c\'est possible. (In principle, it\'s possible.)' }
      ]
    },
    examples: [
      {
        spanish: 'En général, les Français mangent tard. (In general, French people eat late.)',
        english: 'D\'habitude, je prends le métro. (Usually, I take the metro.)',
        highlight: ['En général, les Français mangent tard', 'D\'habitude, je prends le métro']
      }
    ]
  },
  {
    title: 'Contrast and Opposition Phrases',
    content: `Expressions showing **contrast or opposition**:`,
    conjugationTable: {
      title: 'Contrast Phrases',
      conjugations: [
        { pronoun: 'par contre', form: 'on the other hand', english: 'Par contre, c\'est cher. (On the other hand, it\'s expensive.)' },
        { pronoun: 'en revanche', form: 'however, on the other hand', english: 'En revanche, c\'est de qualité. (However, it\'s quality.)' },
        { pronoun: 'au contraire', form: 'on the contrary', english: 'Au contraire, c\'est facile. (On the contrary, it\'s easy.)' },
        { pronoun: 'malgré tout', form: 'despite everything', english: 'Malgré tout, j\'y vais. (Despite everything, I\'m going.)' },
        { pronoun: 'quand même', form: 'still, anyway', english: 'C\'est cher, mais j\'achète quand même. (It\'s expensive, but I\'m buying anyway.)' }
      ]
    },
    examples: [
      {
        spanish: 'Il pleut, par contre il fait chaud. (It\'s raining, on the other hand it\'s warm.)',
        english: 'C\'est difficile, mais j\'essaie quand même. (It\'s difficult, but I\'m trying anyway.)',
        highlight: ['par contre il fait chaud', 'j\'essaie quand même']
      }
    ]
  },
  {
    title: 'Probability and Possibility Phrases',
    content: `Expressions indicating **likelihood or possibility**:`,
    conjugationTable: {
      title: 'Probability Phrases',
      conjugations: [
        { pronoun: 'peut-être', form: 'maybe, perhaps', english: 'Peut-être qu\'il viendra. (Maybe he\'ll come.)' },
        { pronoun: 'sans doute', form: 'probably', english: 'Sans doute, il est en retard. (Probably, he\'s late.)' },
        { pronoun: 'probablement', form: 'probably', english: 'Probablement, nous partirons. (Probably, we\'ll leave.)' },
        { pronoun: 'vraisemblablement', form: 'likely', english: 'Vraisemblablement, il pleuvra. (Likely, it will rain.)' },
        { pronoun: 'apparemment', form: 'apparently', english: 'Apparemment, c\'est fermé. (Apparently, it\'s closed.)' }
      ]
    },
    examples: [
      {
        spanish: 'Peut-être que nous irons au cinéma. (Maybe we\'ll go to the movies.)',
        english: 'Apparemment, le magasin est fermé. (Apparently, the store is closed.)',
        highlight: ['Peut-être que nous irons', 'Apparemment, le magasin est fermé']
      }
    ]
  },
  {
    title: 'Position and Usage in Sentences',
    content: `Adverbial phrases have **flexible positioning** but follow patterns:`,
    examples: [
      {
        spanish: 'En fait, je ne peux pas venir. (Actually, I can\'t come.) - Beginning',
        english: 'Je ne peux pas venir, en fait. (I can\'t come, actually.) - End',
        highlight: ['En fait, je ne peux pas venir', 'Je ne peux pas venir, en fait']
      }
    ],
    subsections: [
      {
        title: 'Beginning Position',
        content: 'Most common position for emphasis:',
        examples: [
          {
            spanish: 'Bien sûr, c\'est possible. (Of course, it\'s possible.)',
            english: 'Par exemple, cette voiture. (For example, this car.)',
            highlight: ['Bien sûr, c\'est possible', 'Par exemple, cette voiture']
          }
        ]
      },
      {
        title: 'Mid-Sentence Position',
        content: 'Some phrases can interrupt sentences:',
        examples: [
          {
            spanish: 'Il est, bien sûr, très intelligent. (He is, of course, very intelligent.)',
            english: 'Nous devons, par exemple, étudier plus. (We must, for example, study more.)',
            highlight: ['Il est, bien sûr, très intelligent', 'Nous devons, par exemple, étudier plus']
          }
        ]
      }
    ]
  },
  {
    title: 'Register and Formality',
    content: `Different phrases suit different **levels of formality**:`,
    conjugationTable: {
      title: 'Formality Levels',
      conjugations: [
        { pronoun: 'Informal', form: 'bien sûr, par contre', english: 'Casual conversation' },
        { pronoun: 'Standard', form: 'en fait, par exemple', english: 'General use' },
        { pronoun: 'Formal', form: 'bien entendu, notamment', english: 'Professional/academic' },
        { pronoun: 'Very formal', form: 'en d\'autres termes, vraisemblablement', english: 'Written/official' }
      ]
    }
  },
  {
    title: 'Common Combinations',
    content: `Phrases often used together in natural speech:`,
    examples: [
      {
        spanish: 'Bon, en fait, je pense que... (Well, actually, I think that...)',
        english: 'Alors, par exemple, nous pourrions... (So, for example, we could...)',
        highlight: ['Bon, en fait, je pense que', 'Alors, par exemple, nous pourrions']
      }
    ],
    subsections: [
      {
        title: 'Conversation Starters',
        content: 'Beginning conversations naturally:',
        examples: [
          {
            spanish: 'Bon, alors, tout d\'abord... (Well, so, first of all...)',
            english: 'Écoute, en fait... (Listen, actually...)',
            highlight: ['Bon, alors, tout d\'abord', 'Écoute, en fait']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes with Adverbial Phrases',
    content: `Here are frequent errors students make:

**1. Literal translation**: Translating word-for-word from English
**2. Wrong register**: Using formal phrases in casual contexts
**3. Overuse**: Using too many phrases in one sentence
**4. Position errors**: Wrong placement in sentences`,
    examples: [
      {
        spanish: '❌ En fait de fait → ✅ En fait',
        english: 'Wrong: redundant construction',
        highlight: ['En fait']
      },
      {
        spanish: '❌ Bien entendu, mec! → ✅ Bien sûr, mec!',
        english: 'Wrong: formal phrase with informal address',
        highlight: ['Bien sûr, mec!']
      },
      {
        spanish: '❌ En fait, par exemple, bien sûr... → ✅ En fait, par exemple...',
        english: 'Wrong: too many phrases together',
        highlight: ['En fait, par exemple...']
      },
      {
        spanish: '❌ Je en fait ne peux pas → ✅ En fait, je ne peux pas',
        english: 'Wrong: phrase should be at beginning or end',
        highlight: ['En fait, je ne peux pas']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Conversation Starters', url: '/grammar/french/expressions/conversation', difficulty: 'intermediate' },
  { title: 'French Conjunctions', url: '/grammar/french/conjunctions/coordinating', difficulty: 'beginner' },
  { title: 'French Formal vs Informal', url: '/grammar/french/verbs/modes-of-address', difficulty: 'beginner' },
  { title: 'French Discourse Markers', url: '/grammar/french/syntax/complex-sentences', difficulty: 'advanced' }
];

export default function FrenchAdverbialPhrasesPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'adverbs',
              topic: 'adverbial-phrases',
              title: 'French Common Adverbial Phrases (En fait, Bien sûr, Tout à fait)',
              description: 'Master French common adverbial phrases including en fait, bien sûr, tout à fait, par exemple, and their usage in conversation.',
              difficulty: 'intermediate',
              examples: [
                'En fait, je ne sais pas. (Actually, I don\'t know.)',
                'Bien sûr, c\'est possible. (Of course, it\'s possible.)',
                'Tout à fait d\'accord. (Completely agree.)',
                'Par exemple, cette voiture. (For example, this car.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adverbs',
              topic: 'adverbial-phrases',
              title: 'French Common Adverbial Phrases (En fait, Bien sûr, Tout à fait)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adverbs"
        topic="adverbial-phrases"
        title="French Common Adverbial Phrases (En fait, Bien sûr, Tout à fait)"
        description="Master French common adverbial phrases including en fait, bien sûr, tout à fait, par exemple, and their usage in conversation"
        difficulty="intermediate"
        estimatedTime={14}
        sections={sections}
        backUrl="/grammar/french/adverbs"
        practiceUrl="/grammar/french/adverbs/adverbial-phrases/practice"
        quizUrl="/grammar/french/adverbs/adverbial-phrases/quiz"
        songUrl="/songs/fr?theme=grammar&topic=adverbial-phrases"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
