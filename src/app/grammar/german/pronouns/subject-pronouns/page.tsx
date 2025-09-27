import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'pronouns',
  topic: 'subject-pronouns',
  title: 'German Subject Pronouns - ich, du, er, sie, es, wir, ihr, Sie',
  description: 'Master German subject pronouns including formal/informal address, agreement rules, and proper usage in sentences.',
  difficulty: 'beginner',
  keywords: [
    'german subject pronouns',
    'ich du er sie es german',
    'wir ihr Sie german',
    'german personal pronouns',
    'formal informal german',
    'du vs Sie german'
  ],
  examples: [
    'Ich bin Student. (I am a student.)',
    'Du bist nett. (You are nice.)',
    'Er kommt morgen. (He comes tomorrow.)',
    'Sie arbeitet hier. (She works here.)'
  ]
});

const sections = [
  {
    title: 'Understanding German Subject Pronouns',
    content: `German **subject pronouns** (Personalpronomen im Nominativ) replace nouns as the **subject** of sentences. They are **essential** for basic German communication and show **who** is performing the action.

**German subject pronouns:**
- **ich**: I (1st person singular)
- **du**: you (2nd person singular, informal)
- **er**: he (3rd person singular, masculine)
- **sie**: she (3rd person singular, feminine)
- **es**: it (3rd person singular, neuter)
- **wir**: we (1st person plural)
- **ihr**: you (2nd person plural, informal)
- **sie**: they (3rd person plural)
- **Sie**: you (formal, singular and plural)

**Key features:**
- **Case**: Always in nominative case (subject position)
- **Agreement**: Must agree with verb conjugation
- **Formality**: Distinction between informal (du/ihr) and formal (Sie)
- **Gender**: Third person singular shows gender (er/sie/es)
- **Capitalization**: Only "Sie" (formal you) and "Ich" at sentence start

**Why subject pronouns matter:**
- **Basic communication**: Essential for forming sentences
- **Verb agreement**: Determine verb conjugation
- **Social appropriateness**: Formal vs informal address
- **Clarity**: Avoid repetition of nouns

Understanding subject pronouns is **fundamental** for **German sentence structure** and **social interaction**.`,
    examples: [
      {
        spanish: 'SINGULAR: Ich lerne Deutsch. Du bist Student. Er arbeitet.',
        english: 'PLURAL: Wir gehen nach Hause. Ihr seid müde. Sie kommen.',
        highlight: ['Ich lerne', 'Du bist', 'Wir gehen', 'Sie kommen']
      },
      {
        spanish: 'INFORMAL: Du bist nett. (You are nice - to friend)',
        english: 'FORMAL: Sie sind nett. (You are nice - to stranger/boss)',
        highlight: ['Du bist nett', 'Sie sind nett']
      }
    ]
  },
  {
    title: 'First Person Pronouns',
    content: `**First person pronouns** refer to the **speaker**:`,
    conjugationTable: {
      title: 'First Person Pronouns',
      conjugations: [
        { pronoun: 'ich', form: 'I', english: 'ich bin (I am), ich gehe (I go)' },
        { pronoun: 'wir', form: 'we', english: 'wir sind (we are), wir gehen (we go)' }
      ]
    },
    examples: [
      {
        spanish: 'SINGULAR: Ich bin müde. (I am tired.)',
        english: 'PLURAL: Wir sind Studenten. (We are students.)',
        highlight: ['Ich bin müde', 'Wir sind Studenten']
      },
      {
        spanish: 'ACTIONS: Ich arbeite heute. (I work today.)',
        english: 'GROUP: Wir lernen Deutsch. (We learn German.)',
        highlight: ['Ich arbeite heute', 'Wir lernen Deutsch']
      }
    ],
    subsections: [
      {
        title: 'Capitalization',
        content: 'ich is only capitalized at the beginning of sentences:',
        examples: [
          {
            spanish: 'CORRECT: Ich bin hier. Heute bin ich müde.',
            english: 'WRONG: heute bin Ich müde (don\'t capitalize mid-sentence)',
            highlight: ['Ich bin hier', 'bin ich müde']
          }
        ]
      }
    ]
  },
  {
    title: 'Second Person Pronouns - Informal',
    content: `**Informal second person** pronouns for **friends**, **family**, and **peers**:`,
    conjugationTable: {
      title: 'Informal Second Person',
      conjugations: [
        { pronoun: 'du', form: 'you (singular)', english: 'du bist (you are), du gehst (you go)' },
        { pronoun: 'ihr', form: 'you (plural)', english: 'ihr seid (you are), ihr geht (you go)' }
      ]
    },
    examples: [
      {
        spanish: 'TO ONE FRIEND: Du bist sehr nett. (You are very nice.)',
        english: 'TO MULTIPLE FRIENDS: Ihr seid sehr nett. (You are very nice.)',
        highlight: ['Du bist sehr nett', 'Ihr seid sehr nett']
      },
      {
        spanish: 'QUESTIONS: Wo wohnst du? (Where do you live?)',
        english: 'PLURAL: Was macht ihr heute? (What are you doing today?)',
        highlight: ['wohnst du', 'macht ihr heute']
      }
    ],
    subsections: [
      {
        title: 'When to Use Informal',
        content: 'Use du/ihr with:',
        examples: [
          {
            spanish: 'FAMILY: Du bist mein Bruder. (You are my brother.)',
            english: 'FRIENDS: Ihr seid meine Freunde. (You are my friends.)',
            highlight: ['Du bist mein', 'Ihr seid meine']
          }
        ]
      }
    ]
  },
  {
    title: 'Second Person Pronouns - Formal',
    content: `**Formal second person** pronoun **Sie** for **strangers**, **authority figures**, and **professional contexts**:`,
    conjugationTable: {
      title: 'Formal Second Person',
      conjugations: [
        { pronoun: 'Sie', form: 'you (formal)', english: 'Sie sind (you are), Sie gehen (you go)' },
        { pronoun: 'Note', form: 'Always capitalized', english: 'Same form for singular and plural' },
        { pronoun: 'Verb', form: 'Uses plural conjugation', english: 'Same as sie (they) verb forms' }
      ]
    },
    examples: [
      {
        spanish: 'POLITE: Wie heißen Sie? (What is your name?)',
        english: 'PROFESSIONAL: Können Sie mir helfen? (Can you help me?)',
        highlight: ['heißen Sie', 'Können Sie helfen']
      },
      {
        spanish: 'STRANGER: Wo wohnen Sie? (Where do you live?)',
        english: 'RESPECT: Sie sind sehr freundlich. (You are very kind.)',
        highlight: ['wohnen Sie', 'Sie sind freundlich']
      }
    ],
    subsections: [
      {
        title: 'When to Use Formal',
        content: 'Use Sie with:',
        examples: [
          {
            spanish: 'STRANGERS: Entschuldigen Sie. (Excuse me.)',
            english: 'BUSINESS: Sind Sie der Chef? (Are you the boss?)',
            highlight: ['Entschuldigen Sie', 'Sind Sie der Chef']
          }
        ]
      }
    ]
  },
  {
    title: 'Third Person Pronouns',
    content: `**Third person pronouns** replace **specific nouns** and show **gender**:`,
    conjugationTable: {
      title: 'Third Person Pronouns',
      conjugations: [
        { pronoun: 'er', form: 'he/it (masculine)', english: 'er ist (he is), er geht (he goes)' },
        { pronoun: 'sie', form: 'she/it (feminine)', english: 'sie ist (she is), sie geht (she goes)' },
        { pronoun: 'es', form: 'it (neuter)', english: 'es ist (it is), es geht (it goes)' },
        { pronoun: 'sie', form: 'they (plural)', english: 'sie sind (they are), sie gehen (they go)' }
      ]
    },
    examples: [
      {
        spanish: 'MASCULINE: Der Mann → Er ist groß. (The man → He is tall.)',
        english: 'FEMININE: Die Frau → Sie ist nett. (The woman → She is nice.)',
        highlight: ['Er ist groß', 'Sie ist nett']
      },
      {
        spanish: 'NEUTER: Das Kind → Es spielt. (The child → It plays.)',
        english: 'PLURAL: Die Kinder → Sie spielen. (The children → They play.)',
        highlight: ['Es spielt', 'Sie spielen']
      }
    ],
    subsections: [
      {
        title: 'Gender Agreement',
        content: 'Pronoun must match the gender of the noun it replaces:',
        examples: [
          {
            spanish: 'der Tisch (masculine) → er (he/it)',
            english: 'die Lampe (feminine) → sie (she/it)',
            highlight: ['er', 'sie']
          }
        ]
      }
    ]
  },
  {
    title: 'Pronoun-Verb Agreement',
    content: `**Subject pronouns** determine **verb conjugation**:`,
    conjugationTable: {
      title: 'Pronoun-Verb Agreement (sein - to be)',
      conjugations: [
        { pronoun: 'ich', form: 'bin', english: 'ich bin (I am)' },
        { pronoun: 'du', form: 'bist', english: 'du bist (you are - informal)' },
        { pronoun: 'er/sie/es', form: 'ist', english: 'er/sie/es ist (he/she/it is)' },
        { pronoun: 'wir', form: 'sind', english: 'wir sind (we are)' },
        { pronoun: 'ihr', form: 'seid', english: 'ihr seid (you are - informal plural)' },
        { pronoun: 'sie/Sie', form: 'sind', english: 'sie/Sie sind (they are/you are formal)' }
      ]
    },
    examples: [
      {
        spanish: 'REGULAR VERB (gehen): ich gehe, du gehst, er geht',
        english: 'MODAL VERB (können): ich kann, du kannst, er kann',
        highlight: ['ich gehe, du gehst', 'ich kann, du kannst']
      }
    ]
  },
  {
    title: 'Formal vs Informal Address',
    content: `**Choosing** between **du/ihr** and **Sie** depends on **relationship** and **context**:`,
    conjugationTable: {
      title: 'Formal vs Informal Guidelines',
      conjugations: [
        { pronoun: 'Family', form: 'du/ihr', english: 'Always informal with family members' },
        { pronoun: 'Close friends', form: 'du/ihr', english: 'Informal with people you know well' },
        { pronoun: 'Children', form: 'du/ihr', english: 'Adults use du with children under 16' },
        { pronoun: 'Strangers', form: 'Sie', english: 'Formal with people you don\'t know' },
        { pronoun: 'Professional', form: 'Sie', english: 'Formal in business/work contexts' },
        { pronoun: 'Authority', form: 'Sie', english: 'Formal with teachers, doctors, police' }
      ]
    },
    examples: [
      {
        spanish: 'INFORMAL: Mama, wo bist du? (Mom, where are you?)',
        english: 'FORMAL: Herr Schmidt, wo sind Sie? (Mr. Schmidt, where are you?)',
        highlight: ['wo bist du', 'wo sind Sie']
      },
      {
        spanish: 'FRIENDS: Kommst du mit? (Are you coming along?)',
        english: 'BUSINESS: Kommen Sie mit? (Are you coming along?)',
        highlight: ['Kommst du mit', 'Kommen Sie mit']
      }
    ]
  },
  {
    title: 'Pronoun Position in Sentences',
    content: `**Subject pronouns** typically come **early** in German sentences:`,
    examples: [
      {
        spanish: 'STATEMENT: Ich gehe morgen nach Berlin. (I go to Berlin tomorrow.)',
        english: 'QUESTION: Gehst du morgen nach Berlin? (Do you go to Berlin tomorrow?)',
        highlight: ['Ich gehe morgen', 'Gehst du morgen']
      },
      {
        spanish: 'TIME FIRST: Morgen gehe ich nach Berlin. (Tomorrow I go to Berlin.)',
        english: 'SUBORDINATE: Ich weiß, dass du morgen gehst. (I know that you go tomorrow.)',
        highlight: ['gehe ich', 'dass du gehst']
      }
    ],
    subsections: [
      {
        title: 'Word Order Rules',
        content: 'Subject pronouns follow standard German word order:',
        examples: [
          {
            spanish: 'POSITION 1: Ich arbeite. (I work.)',
            english: 'POSITION 3: Heute arbeite ich. (Today I work.)',
            highlight: ['Ich arbeite', 'arbeite ich']
          }
        ]
      }
    ]
  },
  {
    title: 'Special Uses and Expressions',
    content: `**Subject pronouns** in **common expressions** and **special contexts**:`,
    conjugationTable: {
      title: 'Special Uses',
      conjugations: [
        { pronoun: 'es gibt', form: 'there is/are', english: 'Es gibt ein Problem. (There is a problem.)' },
        { pronoun: 'es ist/war', form: 'it is/was', english: 'Es ist kalt. (It is cold.)' },
        { pronoun: 'man', form: 'one/people', english: 'Man sagt... (One says.../People say...)' },
        { pronoun: 'Emphasis', form: 'ICH bin das!', english: 'I am the one! (stressed pronoun)' }
      ]
    },
    examples: [
      {
        spanish: 'WEATHER: Es regnet heute. (It rains today.)',
        english: 'TIME: Es ist 3 Uhr. (It is 3 o\'clock.)',
        highlight: ['Es regnet heute', 'Es ist 3 Uhr']
      },
      {
        spanish: 'IMPERSONAL: Man lernt nie aus. (One never stops learning.)',
        english: 'EMPHASIS: DU bist schuld! (YOU are to blame!)',
        highlight: ['Man lernt nie', 'DU bist schuld']
      }
    ]
  },
  {
    title: 'Contractions and Omissions',
    content: `**Subject pronouns** can sometimes be **omitted** or **contracted**:`,
    examples: [
      {
        spanish: 'IMPERATIVE: Geh! (Go!) - du omitted in commands',
        english: 'INFORMAL SPEECH: Bin müde. (Am tired.) - ich sometimes dropped',
        highlight: ['Geh!', 'Bin müde']
      },
      {
        spanish: 'QUESTIONS: Kommst? (Coming?) - du sometimes omitted informally',
        english: 'STANDARD: Kommst du? (Are you coming?) - full form preferred',
        highlight: ['Kommst?', 'Kommst du?']
      }
    ],
    subsections: [
      {
        title: 'Recommendation',
        content: 'Always use full pronouns in formal contexts:',
        examples: [
          {
            spanish: 'INFORMAL: Bin da. (Am here.)',
            english: 'FORMAL: Ich bin da. (I am here.)',
            highlight: ['Ich bin da']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes with Subject Pronouns',
    content: `Here are frequent errors students make:

**1. Wrong formality level**: Using du instead of Sie or vice versa
**2. Gender confusion**: Wrong pronoun for noun gender
**3. Capitalization errors**: Not capitalizing Sie or capitalizing ich mid-sentence
**4. Verb agreement**: Wrong verb form with pronoun`,
    examples: [
      {
        spanish: '❌ du sind → ✅ du bist / Sie sind',
        english: 'Wrong: du takes singular verb, Sie takes plural verb',
        highlight: ['du bist', 'Sie sind']
      },
      {
        spanish: '❌ der Tisch → sie ist groß → ✅ der Tisch → er ist groß',
        english: 'Wrong: masculine nouns use er, not sie',
        highlight: ['er ist groß']
      },
      {
        spanish: '❌ Heute bin Ich müde → ✅ Heute bin ich müde',
        english: 'Wrong: don\'t capitalize ich mid-sentence',
        highlight: ['bin ich müde']
      },
      {
        spanish: '❌ Herr Schmidt, wo bist du? → ✅ Herr Schmidt, wo sind Sie?',
        english: 'Wrong: use formal Sie with strangers/titles',
        highlight: ['wo sind Sie']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Object Pronouns', url: '/grammar/german/pronouns/object-pronouns', difficulty: 'intermediate' },
  { title: 'German Possessive Pronouns', url: '/grammar/german/pronouns/possessive', difficulty: 'beginner' },
  { title: 'German Present Tense', url: '/grammar/german/verbs/present-tense', difficulty: 'beginner' },
  { title: 'German Formal Address', url: '/grammar/german/social/formal-address', difficulty: 'beginner' }
];

export default function GermanSubjectPronounsPage() {
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
              topic: 'subject-pronouns',
              title: 'German Subject Pronouns - ich, du, er, sie, es, wir, ihr, Sie',
              description: 'Master German subject pronouns including formal/informal address, agreement rules, and proper usage in sentences.',
              difficulty: 'beginner',
              examples: [
                'Ich bin Student. (I am a student.)',
                'Du bist nett. (You are nice.)',
                'Er kommt morgen. (He comes tomorrow.)',
                'Sie arbeitet hier. (She works here.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'pronouns',
              topic: 'subject-pronouns',
              title: 'German Subject Pronouns - ich, du, er, sie, es, wir, ihr, Sie'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="pronouns"
        topic="subject-pronouns"
        title="German Subject Pronouns - ich, du, er, sie, es, wir, ihr, Sie"
        description="Master German subject pronouns including formal/informal address, agreement rules, and proper usage in sentences"
        difficulty="beginner"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/german/pronouns"
        practiceUrl="/grammar/german/pronouns/subject-pronouns/practice"
        quizUrl="/grammar/german/pronouns/subject-pronouns/quiz"
        songUrl="/songs/de?theme=grammar&topic=subject-pronouns"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
