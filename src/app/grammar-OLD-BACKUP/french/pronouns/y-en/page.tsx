import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'pronouns',
  topic: 'y-en',
  title: 'French Pronouns Y and EN - Usage, Placement, and Examples',
  description: 'Master French pronouns Y and EN including their meanings, placement rules, and usage with prepositions.',
  difficulty: 'intermediate',
  keywords: [
    'french pronoun y',
    'french pronoun en',
    'y en french grammar',
    'french adverbial pronouns',
    'y en placement french'
  ],
  examples: [
    'J\'y vais. (I\'m going there.)',
    'J\'en veux. (I want some.)',
    'Il y pense. (He thinks about it.)',
    'Elle en parle. (She talks about it.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Pronouns Y and EN',
    content: `French pronouns **Y** and **EN** are **adverbial pronouns** that replace prepositional phrases and avoid repetition. They are essential for natural, fluent French.

**Y replaces:**
- **à + thing/place**: J'y vais (I go there)
- **Prepositions of place**: J'y habite (I live there)
- **à + infinitive**: J'y pense (I think about it)

**EN replaces:**
- **de + thing**: J'en parle (I talk about it)
- **Partitive articles**: J'en veux (I want some)
- **Quantities**: J'en ai trois (I have three of them)
- **de + infinitive**: J'en rêve (I dream of it)

**Key features:**
- **Placement**: Before conjugated verb
- **Meaning**: Context-dependent
- **Elision**: No elision with Y/EN
- **Order**: Y comes before EN when both used

**Why Y and EN matter:**
- **Avoid repetition**: Replace long prepositional phrases
- **Natural French**: Essential for fluent expression
- **Concise communication**: Make speech more efficient
- **Advanced grammar**: Mark intermediate proficiency

Understanding Y and EN is **crucial** for **natural French expression**.`,
    examples: [
      {
        spanish: 'WITHOUT Y: Je vais à Paris. → WITH Y: J\'y vais.',
        english: 'WITHOUT EN: Je parle de ce livre. → WITH EN: J\'en parle.',
        highlight: ["J'y vais", "J'en parle"]
      },
      {
        spanish: 'PLACE: Il habite à Lyon. → Il y habite.',
        english: 'QUANTITY: Je veux du pain. → J\'en veux.',
        highlight: ['Il y habite', "J'en veux"]
      }
    ]
  },
  {
    title: 'The Pronoun Y - Usage and Meaning',
    content: `**Y** replaces phrases with **à, dans, sur, chez** + place or thing:`,
    conjugationTable: {
      title: 'Uses of Y',
      conjugations: [
        { pronoun: 'à + place', form: 'there', english: 'Je vais à Paris. → J\'y vais. (I go there.)' },
        { pronoun: 'à + thing', form: 'to/about it', english: 'Je pense à ce problème. → J\'y pense. (I think about it.)' },
        { pronoun: 'dans + place', form: 'in it/there', english: 'Il vit dans cette ville. → Il y vit. (He lives there.)' },
        { pronoun: 'sur + thing', form: 'on it', english: 'Je compte sur toi. → J\'y compte. (I count on it.)' }
      ]
    },
    examples: [
      {
        spanish: 'PLACE: Tu vas au cinéma ? → Oui, j\'y vais. (Yes, I\'m going there.)',
        english: 'THING: Tu penses à l\'examen ? → Oui, j\'y pense. (Yes, I think about it.)',
        highlight: ["j'y vais", "j'y pense"]
      },
      {
        spanish: 'LOCATION: Elle habite en France. → Elle y habite. (She lives there.)',
        english: 'ABSTRACT: Il croit à cette idée. → Il y croit. (He believes in it.)',
        highlight: ['Elle y habite', 'Il y croit']
      }
    ]
  },
  {
    title: 'The Pronoun EN - Usage and Meaning',
    content: `**EN** replaces phrases with **de** + thing, quantities, and partitive articles:`,
    conjugationTable: {
      title: 'Uses of EN',
      conjugations: [
        { pronoun: 'de + thing', form: 'of/about it', english: 'Je parle de ce livre. → J\'en parle. (I talk about it.)' },
        { pronoun: 'du/de la/des', form: 'some/any', english: 'Je veux du pain. → J\'en veux. (I want some.)' },
        { pronoun: 'quantity', form: 'of them', english: 'J\'ai trois livres. → J\'en ai trois. (I have three of them.)' },
        { pronoun: 'de + place', form: 'from there', english: 'Je viens de Paris. → J\'en viens. (I come from there.)' }
      ]
    },
    examples: [
      {
        spanish: 'TOPIC: Tu parles de ton travail ? → Oui, j\'en parle. (Yes, I talk about it.)',
        english: 'PARTITIVE: Tu veux du café ? → Oui, j\'en veux. (Yes, I want some.)',
        highlight: ["j'en parle", "j'en veux"]
      },
      {
        spanish: 'QUANTITY: Tu as des frères ? → Oui, j\'en ai deux. (Yes, I have two.)',
        english: 'ORIGIN: Tu viens de Londres ? → Oui, j\'en viens. (Yes, I come from there.)',
        highlight: ["j'en ai deux", "j'en viens"]
      }
    ]
  },
  {
    title: 'Placement of Y and EN',
    content: `**Y and EN** go **before the conjugated verb**:`,
    examples: [
      {
        spanish: 'PRESENT: J\'y vais maintenant. (I\'m going there now.)',
        english: 'NEGATIVE: Je n\'y vais pas. (I\'m not going there.)',
        highlight: ["J'y vais", "n'y vais pas"]
      },
      {
        spanish: 'COMPOUND: J\'y suis allé(e). (I went there.)',
        english: 'FUTURE: J\'y irai demain. (I\'ll go there tomorrow.)',
        highlight: ["J'y suis allé", "J'y irai"]
      },
      {
        spanish: 'INFINITIVE: Je vais y aller. (I\'m going to go there.)',
        english: 'MODAL: Je peux en parler. (I can talk about it.)',
        highlight: ['y aller', 'en parler']
      }
    ]
  },
  {
    title: 'Y and EN with Common Verbs',
    content: `**Essential verb combinations** with Y and EN:`,
    conjugationTable: {
      title: 'Common Verb + Y/EN Combinations',
      conjugations: [
        { pronoun: 'aller + Y', form: 'to go there', english: 'J\'y vais. (I\'m going there.)' },
        { pronoun: 'penser + Y', form: 'to think about it', english: 'J\'y pense. (I think about it.)' },
        { pronoun: 'parler + EN', form: 'to talk about it', english: 'J\'en parle. (I talk about it.)' },
        { pronoun: 'avoir + EN', form: 'to have some', english: 'J\'en ai. (I have some.)' },
        { pronoun: 'venir + EN', form: 'to come from there', english: 'J\'en viens. (I come from there.)' },
        { pronoun: 'rêver + EN', form: 'to dream of it', english: 'J\'en rêve. (I dream of it.)' }
      ]
    },
    examples: [
      {
        spanish: 'HABITER: Tu habites à Paris ? → Oui, j\'y habite. (Yes, I live there.)',
        english: 'VOULOIR: Tu veux du thé ? → Oui, j\'en veux. (Yes, I want some.)',
        highlight: ["j'y habite", "j'en veux"]
      }
    ]
  },
  {
    title: 'Y and EN Together',
    content: `When **both Y and EN** are used, **Y comes first**:`,
    examples: [
      {
        spanish: 'BOTH: Il y en a beaucoup. (There are many of them there.)',
        english: 'ORDER: Y + EN: Il y en a trois. (There are three of them there.)',
        highlight: ['Il y en a']
      },
      {
        spanish: 'QUESTION: Y en a-t-il ? (Are there any there?)',
        english: 'NEGATIVE: Il n\'y en a pas. (There aren\'t any there.)',
        highlight: ['Y en a-t-il', "n'y en a pas"]
      }
    ],
    subsections: [
      {
        title: 'Fixed Expression',
        content: 'Il y en a (there are some) is a very common fixed expression:',
        examples: [
          {
            spanish: 'AFFIRMATIVE: Il y en a trois. (There are three.)',
            english: 'QUESTION: Y en a-t-il assez ? (Are there enough?)',
            highlight: ['Il y en a', 'Y en a-t-il']
          }
        ]
      }
    ]
  },
  {
    title: 'Y and EN in Questions',
    content: `**Question formation** with Y and EN:`,
    conjugationTable: {
      title: 'Question Forms',
      conjugations: [
        { pronoun: 'Est-ce que', form: 'Est-ce que tu y vas ?', english: 'Are you going there?' },
        { pronoun: 'Inversion', form: 'Y vas-tu ?', english: 'Are you going there?' },
        { pronoun: 'Est-ce que + EN', form: 'Est-ce que tu en veux ?', english: 'Do you want some?' },
        { pronoun: 'Inversion + EN', form: 'En veux-tu ?', english: 'Do you want some?' }
      ]
    },
    examples: [
      {
        spanish: 'Y QUESTION: Tu y penses souvent ? (Do you think about it often?)',
        english: 'EN QUESTION: Tu en as combien ? (How many do you have?)',
        highlight: ['Tu y penses', 'Tu en as']
      }
    ]
  },
  {
    title: 'Y and EN in Imperative',
    content: `In **positive commands**, Y and EN come **after** the verb:`,
    conjugationTable: {
      title: 'Imperative Forms',
      conjugations: [
        { pronoun: 'Positive Y', form: 'Vas-y !', english: 'Go there! / Go ahead!' },
        { pronoun: 'Negative Y', form: 'N\'y va pas !', english: 'Don\'t go there!' },
        { pronoun: 'Positive EN', form: 'Prends-en !', english: 'Take some!' },
        { pronoun: 'Negative EN', form: 'N\'en prends pas !', english: 'Don\'t take any!' }
      ]
    },
    examples: [
      {
        spanish: 'POSITIVE: Penses-y ! (Think about it!)',
        english: 'NEGATIVE: N\'y pense pas ! (Don\'t think about it!)',
        highlight: ['Penses-y', "N'y pense pas"]
      },
      {
        spanish: 'POSITIVE: Parles-en ! (Talk about it!)',
        english: 'NEGATIVE: N\'en parle pas ! (Don\'t talk about it!)',
        highlight: ['Parles-en', "N'en parle pas"]
      }
    ]
  },
  {
    title: 'Special Cases and Idioms',
    content: `**Idiomatic expressions** with Y and EN:`,
    conjugationTable: {
      title: 'Common Idioms',
      conjugations: [
        { pronoun: 'Il y a', form: 'there is/are', english: 'Il y a un problème. (There is a problem.)' },
        { pronoun: 'Ça y est !', form: 'That\'s it!', english: 'Ça y est, j\'ai fini ! (That\'s it, I\'m done!)' },
        { pronoun: 'Je m\'en vais', form: 'I\'m leaving', english: 'Je m\'en vais maintenant. (I\'m leaving now.)' },
        { pronoun: 'Il s\'en va', form: 'he\'s leaving', english: 'Il s\'en va déjà. (He\'s already leaving.)' }
      ]
    },
    examples: [
      {
        spanish: 'IDIOM: J\'en ai marre ! (I\'m fed up!)',
        english: 'IDIOM: Il s\'en fiche. (He doesn\'t care.)',
        highlight: ["J'en ai marre", "s'en fiche"]
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong replacement**: Using Y/EN for people instead of pronouns
**2. Placement errors**: Wrong position in sentence
**3. Overuse**: Using when not needed
**4. Order confusion**: Wrong order when using both Y and EN`,
    examples: [
      {
        spanish: '❌ Je pense à Marie. → J\'y pense. (Wrong: use à elle for people)',
        english: '✅ Je pense à Marie. → Je pense à elle.',
        highlight: ['Je pense à elle']
      },
      {
        spanish: '❌ Je vais y. → ✅ J\'y vais.',
        english: 'Wrong: Y must come before conjugated verb',
        highlight: ["J'y vais"]
      },
      {
        spanish: '❌ Il en y a. → ✅ Il y en a.',
        english: 'Wrong: Y comes before EN',
        highlight: ['Il y en a']
      },
      {
        spanish: '❌ Je veux y aller à Paris. → ✅ Je veux aller à Paris. / Je veux y aller.',
        english: 'Wrong: don\'t use both Y and the original phrase',
        highlight: ['Je veux y aller']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Object Pronouns', url: '/grammar/french/pronouns/object-pronouns', difficulty: 'intermediate' },
  { title: 'French Prepositions', url: '/grammar/french/prepositions/basic-prepositions', difficulty: 'beginner' },
  { title: 'French Partitive Articles', url: '/grammar/french/articles/partitive', difficulty: 'beginner' },
  { title: 'French Question Formation', url: '/grammar/french/verbs/interrogatives', difficulty: 'intermediate' }
];

export default function FrenchYEnPronounsPage() {
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
              topic: 'y-en',
              title: 'French Pronouns Y and EN - Usage, Placement, and Examples',
              description: 'Master French pronouns Y and EN including their meanings, placement rules, and usage with prepositions.',
              difficulty: 'intermediate',
              examples: [
                'J\'y vais. (I\'m going there.)',
                'J\'en veux. (I want some.)',
                'Il y pense. (He thinks about it.)',
                'Elle en parle. (She talks about it.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'pronouns',
              topic: 'y-en',
              title: 'French Pronouns Y and EN - Usage, Placement, and Examples'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="pronouns"
        topic="y-en"
        title="French Pronouns Y and EN - Usage, Placement, and Examples"
        description="Master French pronouns Y and EN including their meanings, placement rules, and usage with prepositions"
        difficulty="intermediate"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/french/pronouns"
        practiceUrl="/grammar/french/pronouns/y-en/practice"
        quizUrl="/grammar/french/pronouns/y-en/quiz"
        songUrl="/songs/fr?theme=grammar&topic=y-en"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
