import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'pronouns',
  topic: 'object-pronouns',
  title: 'German Object Pronouns - Accusative and Dative Forms',
  description: 'Master German object pronouns including accusative (direct object) and dative (indirect object) forms with position rules.',
  difficulty: 'intermediate',
  keywords: [
    'german object pronouns',
    'accusative pronouns german',
    'dative pronouns german',
    'mich dich ihn sie es',
    'mir dir ihm ihr',
    'german pronoun order'
  ],
  examples: [
    'Ich sehe ihn. (I see him.)',
    'Er gibt mir das Buch. (He gives me the book.)',
    'Sie hilft uns. (She helps us.)',
    'Wir kennen sie. (We know them.)'
  ]
});

const sections = [
  {
    title: 'Understanding German Object Pronouns',
    content: `German **object pronouns** replace nouns that function as **direct objects** (accusative) or **indirect objects** (dative). They are **essential** for avoiding repetition and creating **natural-sounding German**.

**Two types of object pronouns:**
- **Accusative pronouns**: Replace direct objects (who/what receives action)
- **Dative pronouns**: Replace indirect objects (to/for whom action is done)

**Key features:**
- **Case-dependent**: Different forms for accusative and dative
- **Position-sensitive**: Specific word order rules
- **Frequency**: Used constantly in everyday German
- **Efficiency**: Replace longer noun phrases

**Why object pronouns matter:**
- **Natural speech**: Essential for fluent German
- **Avoid repetition**: Replace previously mentioned nouns
- **Sentence flow**: Create smoother, more connected discourse
- **Precision**: Show exact grammatical relationships

**Learning strategy**: Master **accusative pronouns first** (more common), then add **dative pronouns**, finally learn **position rules**.

Understanding object pronouns is **crucial** for **intermediate German** and **natural communication**.`,
    examples: [
      {
        spanish: 'ACCUSATIVE: Ich sehe den Mann → Ich sehe ihn. (I see him.)',
        english: 'DATIVE: Ich helfe der Frau → Ich helfe ihr. (I help her.)',
        highlight: ['Ich sehe ihn', 'Ich helfe ihr']
      },
      {
        spanish: 'BOTH: Er gibt mir das Buch → Er gibt es mir. (He gives it to me.)',
        english: 'PLURAL: Wir kennen die Leute → Wir kennen sie. (We know them.)',
        highlight: ['Er gibt es mir', 'Wir kennen sie']
      }
    ]
  },
  {
    title: 'Accusative Pronouns (Direct Objects)',
    content: `**Accusative pronouns** replace **direct objects** (who/what receives the action):`,
    conjugationTable: {
      title: 'Accusative Pronoun Forms',
      conjugations: [
        { pronoun: 'mich', form: 'me', english: 'Er sieht mich. (He sees me.)' },
        { pronoun: 'dich', form: 'you (informal)', english: 'Ich kenne dich. (I know you.)' },
        { pronoun: 'ihn', form: 'him/it (masculine)', english: 'Sie liebt ihn. (She loves him.)' },
        { pronoun: 'sie', form: 'her/it (feminine)', english: 'Wir besuchen sie. (We visit her.)' },
        { pronoun: 'es', form: 'it (neuter)', english: 'Ich kaufe es. (I buy it.)' },
        { pronoun: 'uns', form: 'us', english: 'Sie kennen uns. (They know us.)' },
        { pronoun: 'euch', form: 'you (informal plural)', english: 'Wir sehen euch. (We see you.)' },
        { pronoun: 'sie', form: 'them', english: 'Ich mag sie. (I like them.)' },
        { pronoun: 'Sie', form: 'you (formal)', english: 'Wir besuchen Sie. (We visit you.)' }
      ]
    },
    examples: [
      {
        spanish: 'PEOPLE: Ich sehe ihn/sie. (I see him/her.)',
        english: 'THINGS: Ich kaufe es. (I buy it.)',
        highlight: ['sehe ihn/sie', 'kaufe es']
      },
      {
        spanish: 'PLURAL: Sie kennen uns/euch/sie. (They know us/you/them.)',
        english: 'FORMAL: Ich besuche Sie. (I visit you - formal.)',
        highlight: ['kennen uns/euch/sie', 'besuche Sie']
      }
    ]
  },
  {
    title: 'Dative Pronouns (Indirect Objects)',
    content: `**Dative pronouns** replace **indirect objects** (to/for whom the action is done):`,
    conjugationTable: {
      title: 'Dative Pronoun Forms',
      conjugations: [
        { pronoun: 'mir', form: 'to/for me', english: 'Er gibt mir das Buch. (He gives me the book.)' },
        { pronoun: 'dir', form: 'to/for you (informal)', english: 'Ich helfe dir. (I help you.)' },
        { pronoun: 'ihm', form: 'to/for him/it (masculine)', english: 'Sie schreibt ihm. (She writes to him.)' },
        { pronoun: 'ihr', form: 'to/for her/it (feminine)', english: 'Wir danken ihr. (We thank her.)' },
        { pronoun: 'ihm', form: 'to/for it (neuter)', english: 'Das gehört ihm. (That belongs to it.)' },
        { pronoun: 'uns', form: 'to/for us', english: 'Sie hilft uns. (She helps us.)' },
        { pronoun: 'euch', form: 'to/for you (informal plural)', english: 'Ich gebe euch Zeit. (I give you time.)' },
        { pronoun: 'ihnen', form: 'to/for them', english: 'Er antwortet ihnen. (He answers them.)' },
        { pronoun: 'Ihnen', form: 'to/for you (formal)', english: 'Ich danke Ihnen. (I thank you.)' }
      ]
    },
    examples: [
      {
        spanish: 'GIVING: Er gibt mir/dir/ihm/ihr das Buch. (He gives me/you/him/her the book.)',
        english: 'HELPING: Ich helfe uns/euch/ihnen. (I help us/you/them.)',
        highlight: ['gibt mir das Buch', 'helfe ihnen']
      },
      {
        spanish: 'BELONGING: Das gehört mir/dir/ihm. (That belongs to me/you/him.)',
        english: 'THANKING: Wir danken Ihnen. (We thank you - formal.)',
        highlight: ['gehört mir', 'danken Ihnen']
      }
    ]
  },
  {
    title: 'Pronoun Position Rules',
    content: `**Object pronouns** follow specific **position rules** in German sentences:`,
    conjugationTable: {
      title: 'Basic Position Rules',
      conjugations: [
        { pronoun: 'Single pronoun', form: 'After conjugated verb', english: 'Ich sehe ihn. (I see him.)' },
        { pronoun: 'Two pronouns', form: 'Accusative before dative', english: 'Ich gebe es ihm. (I give it to him.)' },
        { pronoun: 'Pronoun + noun', form: 'Pronoun first', english: 'Ich gebe ihm das Buch. (I give him the book.)' },
        { pronoun: 'Questions', form: 'After question word', english: 'Wann siehst du ihn? (When do you see him?)' }
      ]
    },
    examples: [
      {
        spanish: 'SINGLE: Ich kenne sie. (I know her.)',
        english: 'TWO PRONOUNS: Ich gebe es dir. (I give it to you.)',
        highlight: ['kenne sie', 'gebe es dir']
      },
      {
        spanish: 'PRONOUN + NOUN: Ich gebe ihm das Buch. (I give him the book.)',
        english: 'QUESTION: Warum hilfst du ihr? (Why do you help her?)',
        highlight: ['gebe ihm das Buch', 'hilfst du ihr']
      }
    ]
  },
  {
    title: 'Two Pronoun Order: Accusative Before Dative',
    content: `When using **two pronouns**, **accusative comes before dative**:`,
    examples: [
      {
        spanish: 'PATTERN: Subject + Verb + ACCUSATIVE + DATIVE + ...',
        english: 'EXAMPLE: Ich gebe es ihm. (I give it to him.)',
        highlight: ['es ihm']
      },
      {
        spanish: 'MORE: Er zeigt sie mir. (He shows her to me.)',
        english: 'QUESTION: Gibst du es ihr? (Do you give it to her?)',
        highlight: ['sie mir', 'es ihr']
      }
    ],
    subsections: [
      {
        title: 'Memory Aid',
        content: 'Remember: Accusative before Dative (A before D alphabetically):',
        examples: [
          {
            spanish: 'CORRECT: Ich gebe es (A) ihm (D).',
            english: 'WRONG: Ich gebe ihm (D) es (A).',
            highlight: ['es ihm']
          }
        ]
      }
    ]
  },
  {
    title: 'Pronoun vs Noun Order',
    content: `When mixing **pronouns and nouns**, **pronouns come first**:`,
    conjugationTable: {
      title: 'Pronoun vs Noun Positioning',
      conjugations: [
        { pronoun: 'Pronoun + Noun', form: 'Pronoun first', english: 'Ich gebe ihm das Buch. (I give him the book.)' },
        { pronoun: 'Noun + Pronoun', form: 'Avoid this order', english: 'Awkward: Ich gebe das Buch ihm.' },
        { pronoun: 'Two nouns', form: 'Dative before accusative', english: 'Ich gebe dem Mann das Buch.' }
      ]
    },
    examples: [
      {
        spanish: 'GOOD: Ich zeige dir das Foto. (I show you the photo.)',
        english: 'AWKWARD: Ich zeige das Foto dir.',
        highlight: ['zeige dir das Foto']
      },
      {
        spanish: 'GOOD: Sie gibt uns die Bücher. (She gives us the books.)',
        english: 'AWKWARD: Sie gibt die Bücher uns.',
        highlight: ['gibt uns die Bücher']
      }
    ]
  },
  {
    title: 'Reflexive Pronouns',
    content: `**Reflexive pronouns** refer back to the subject:`,
    conjugationTable: {
      title: 'Reflexive Pronoun Forms',
      conjugations: [
        { pronoun: 'Accusative', form: 'mich, dich, sich, uns, euch, sich', english: 'Ich wasche mich. (I wash myself.)' },
        { pronoun: 'Dative', form: 'mir, dir, sich, uns, euch, sich', english: 'Ich kaufe mir ein Auto. (I buy myself a car.)' },
        { pronoun: '3rd person', form: 'sich (all genders)', english: 'Er/Sie/Es wäscht sich. (He/She/It washes himself/herself/itself.)' },
        { pronoun: 'Formal', form: 'sich', english: 'Sie waschen sich. (You wash yourself/yourselves.)' }
      ]
    },
    examples: [
      {
        spanish: 'ACCUSATIVE: Ich sehe mich im Spiegel. (I see myself in the mirror.)',
        english: 'DATIVE: Er kauft sich ein Buch. (He buys himself a book.)',
        highlight: ['sehe mich', 'kauft sich']
      }
    ]
  },
  {
    title: 'Pronouns with Prepositions',
    content: `**Object pronouns** can follow **prepositions**:`,
    conjugationTable: {
      title: 'Pronouns with Prepositions',
      conjugations: [
        { pronoun: 'für + accusative', form: 'für mich/dich/ihn/sie/es', english: 'Das ist für mich. (That is for me.)' },
        { pronoun: 'mit + dative', form: 'mit mir/dir/ihm/ihr', english: 'Kommst du mit mir? (Are you coming with me?)' },
        { pronoun: 'von + dative', form: 'von uns/euch/ihnen', english: 'Ein Brief von ihnen. (A letter from them.)' },
        { pronoun: 'zu + dative', form: 'zu mir/dir/ihm/ihr', english: 'Komm zu mir! (Come to me!)' }
      ]
    },
    examples: [
      {
        spanish: 'ACCUSATIVE PREP: ohne mich (without me), gegen ihn (against him)',
        english: 'DATIVE PREP: bei dir (at your place), nach uns (after us)',
        highlight: ['ohne mich', 'bei dir']
      }
    ]
  },
  {
    title: 'Emphasis and Contrast',
    content: `**Object pronouns** can be **emphasized** for contrast:`,
    examples: [
      {
        spanish: 'EMPHASIS: MICH sieht er, nicht dich! (He sees ME, not you!)',
        english: 'CONTRAST: Ihm gebe ich es, nicht ihr. (I give it to HIM, not her.)',
        highlight: ['MICH sieht er', 'Ihm gebe ich es']
      },
      {
        spanish: 'CLARIFICATION: Ich meine SIE, nicht ihn. (I mean HER, not him.)',
        english: 'STRESS: UNS hilft sie gern. (She likes to help US.)',
        highlight: ['meine SIE', 'UNS hilft sie']
      }
    ]
  },
  {
    title: 'Common Verbs with Object Pronouns',
    content: `**Frequent verbs** that commonly take object pronouns:`,
    conjugationTable: {
      title: 'Common Verb + Pronoun Combinations',
      conjugations: [
        { pronoun: 'sehen + acc', form: 'Ich sehe ihn/sie/es.', english: 'I see him/her/it.' },
        { pronoun: 'helfen + dat', form: 'Ich helfe ihm/ihr/ihnen.', english: 'I help him/her/them.' },
        { pronoun: 'geben + dat + acc', form: 'Ich gebe es ihm.', english: 'I give it to him.' },
        { pronoun: 'kennen + acc', form: 'Ich kenne sie.', english: 'I know her/them.' },
        { pronoun: 'danken + dat', form: 'Ich danke Ihnen.', english: 'I thank you.' },
        { pronoun: 'schreiben + dat', form: 'Ich schreibe ihr.', english: 'I write to her.' }
      ]
    },
    examples: [
      {
        spanish: 'ACCUSATIVE VERBS: besuchen, kaufen, lieben, verstehen + ihn/sie/es',
        english: 'DATIVE VERBS: antworten, folgen, gehören, gratulieren + ihm/ihr/ihnen',
        highlight: ['besuchen sie', 'antworten ihm']
      }
    ]
  },
  {
    title: 'Formal vs Informal Object Pronouns',
    content: `**Formality levels** affect pronoun choice:`,
    conjugationTable: {
      title: 'Formal vs Informal',
      conjugations: [
        { pronoun: 'Informal accusative', form: 'dich/euch', english: 'Ich sehe dich/euch. (I see you.)' },
        { pronoun: 'Formal accusative', form: 'Sie', english: 'Ich sehe Sie. (I see you.)' },
        { pronoun: 'Informal dative', form: 'dir/euch', english: 'Ich helfe dir/euch. (I help you.)' },
        { pronoun: 'Formal dative', form: 'Ihnen', english: 'Ich helfe Ihnen. (I help you.)' }
      ]
    },
    examples: [
      {
        spanish: 'TO FRIEND: Ich rufe dich an. (I call you.)',
        english: 'TO STRANGER: Ich rufe Sie an. (I call you.)',
        highlight: ['rufe dich an', 'rufe Sie an']
      }
    ]
  },
  {
    title: 'Common Mistakes with Object Pronouns',
    content: `Here are frequent errors students make:

**1. Wrong case**: Using accusative instead of dative or vice versa
**2. Wrong order**: Putting dative before accusative with two pronouns
**3. Wrong position**: Placing pronouns incorrectly in sentence
**4. Gender confusion**: Wrong pronoun for noun gender`,
    examples: [
      {
        spanish: '❌ Ich helfe ihn → ✅ Ich helfe ihm',
        english: 'Wrong: helfen takes dative, not accusative',
        highlight: ['helfe ihm']
      },
      {
        spanish: '❌ Ich gebe ihm es → ✅ Ich gebe es ihm',
        english: 'Wrong: accusative (es) before dative (ihm)',
        highlight: ['gebe es ihm']
      },
      {
        spanish: '❌ der Tisch → ich sehe sie → ✅ der Tisch → ich sehe ihn',
        english: 'Wrong: masculine nouns use ihn, not sie',
        highlight: ['sehe ihn']
      },
      {
        spanish: '❌ Ich das Buch gebe ihm → ✅ Ich gebe ihm das Buch',
        english: 'Wrong: pronoun comes before noun',
        highlight: ['gebe ihm das Buch']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Subject Pronouns', url: '/grammar/german/pronouns/subject-pronouns', difficulty: 'beginner' },
  { title: 'German Cases Overview', url: '/grammar/german/cases/overview', difficulty: 'intermediate' },
  { title: 'German Word Order', url: '/grammar/german/syntax/word-order', difficulty: 'intermediate' },
  { title: 'German Reflexive Pronouns', url: '/grammar/german/pronouns/reflexive', difficulty: 'intermediate' }
];

export default function GermanObjectPronounsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'german',
              category: 'pronouns',
              topic: 'object-pronouns',
              title: 'German Object Pronouns - Accusative and Dative Forms',
              description: 'Master German object pronouns including accusative (direct object) and dative (indirect object) forms with position rules.',
              difficulty: 'intermediate',
              examples: [
                'Ich sehe ihn. (I see him.)',
                'Er gibt mir das Buch. (He gives me the book.)',
                'Sie hilft uns. (She helps us.)',
                'Wir kennen sie. (We know them.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'pronouns',
              topic: 'object-pronouns',
              title: 'German Object Pronouns - Accusative and Dative Forms'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="pronouns"
        topic="object-pronouns"
        title="German Object Pronouns - Accusative and Dative Forms"
        description="Master German object pronouns including accusative (direct object) and dative (indirect object) forms with position rules"
        difficulty="intermediate"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/german/pronouns"
        practiceUrl="/grammar/german/pronouns/object-pronouns/practice"
        quizUrl="/grammar/german/pronouns/object-pronouns/quiz"
        songUrl="/songs/de?theme=grammar&topic=object-pronouns"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
