import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'pronouns',
  topic: 'interrogative',
  title: 'French Interrogative Pronouns - Qui, Que, Quoi, Lequel',
  description: 'Master French interrogative pronouns including qui, que, quoi, lequel and their usage in questions.',
  difficulty: 'intermediate',
  keywords: [
    'french interrogative pronouns',
    'qui que quoi french',
    'lequel french pronoun',
    'french question words',
    'french interrogation'
  ],
  examples: [
    'Qui est-ce? (Who is it?)',
    'Que fais-tu? (What are you doing?)',
    'Avec quoi écris-tu? (What are you writing with?)',
    'Lequel préfères-tu? (Which one do you prefer?)'
  ]
});

const sections = [
  {
    title: 'Understanding French Interrogative Pronouns',
    content: `French **interrogative pronouns** (pronoms interrogatifs) are used to **ask questions** about people, things, or to make choices. They replace the unknown element in a question.

**Main interrogative pronouns:**
- **QUI**: who, whom (for people)
- **QUE**: what (for things - direct object)
- **QUOI**: what (for things - after prepositions)
- **LEQUEL/LAQUELLE/LESQUELS/LESQUELLES**: which one(s)

**Key functions:**
- **Subject questions**: Qui est là? (Who is there?)
- **Object questions**: Que veux-tu? (What do you want?)
- **Prepositional questions**: Avec quoi? (With what?)
- **Choice questions**: Lequel choisis-tu? (Which one do you choose?)

**Why interrogative pronouns matter:**
- **Essential communication**: Ask questions naturally
- **Avoid repetition**: Replace unknown elements
- **Precise questioning**: Different pronouns for different contexts
- **Advanced French**: Show sophisticated language use

**Basic patterns:**
- **QUI + verb**: Qui parle? (Who speaks?)
- **QUE + subject + verb**: Que fais-tu? (What are you doing?)
- **Preposition + QUOI**: Avec quoi? (With what?)
- **LEQUEL + agreement**: Lequel veux-tu? (Which one do you want?)

Understanding interrogative pronouns is **crucial** for **effective French communication**.`,
    examples: [
      {
        spanish: 'PERSON: Qui est cette femme? (Who is this woman?)',
        english: 'THING: Que regardes-tu? (What are you looking at?)',
        highlight: ['Qui est', 'Que regardes-tu']
      },
      {
        spanish: 'PREPOSITION: De quoi parles-tu? (What are you talking about?)',
        english: 'CHOICE: Laquelle préfères-tu? (Which one do you prefer?)',
        highlight: ['De quoi', 'Laquelle préfères-tu']
      }
    ]
  },
  {
    title: 'QUI - Who/Whom (People)',
    content: `**QUI** is used for **people** in both subject and object positions:`,
    conjugationTable: {
      title: 'QUI Usage Patterns',
      conjugations: [
        { pronoun: 'Subject', form: 'Qui + verb', english: 'Qui parle? (Who speaks?)' },
        { pronoun: 'Direct object', form: 'Qui + subject + verb', english: 'Qui vois-tu? (Whom do you see?)' },
        { pronoun: 'After preposition', form: 'Preposition + qui', english: 'Avec qui sors-tu? (With whom are you going out?)' },
        { pronoun: 'Qui est-ce qui', form: 'Emphatic subject', english: 'Qui est-ce qui chante? (Who is singing?)' },
        { pronoun: 'Qui est-ce que', form: 'Emphatic object', english: 'Qui est-ce que tu connais? (Whom do you know?)' }
      ]
    },
    examples: [
      {
        spanish: 'SUBJECT: Qui arrive ce soir? (Who is arriving tonight?)',
        english: 'OBJECT: Qui invites-tu à la fête? (Whom are you inviting to the party?)',
        highlight: ['Qui arrive', 'Qui invites-tu']
      },
      {
        spanish: 'PREPOSITION: Pour qui travailles-tu? (For whom do you work?)',
        english: 'EMPHATIC: Qui est-ce qui a téléphoné? (Who called?)',
        highlight: ['Pour qui', 'Qui est-ce qui']
      }
    ]
  },
  {
    title: 'QUE - What (Things - Direct Object)',
    content: `**QUE** is used for **things** as **direct object**:`,
    conjugationTable: {
      title: 'QUE Usage Patterns',
      conjugations: [
        { pronoun: 'Direct object', form: 'Que + subject + verb', english: 'Que fais-tu? (What are you doing?)' },
        { pronoun: 'Inversion', form: 'Que + verb + subject', english: 'Que dit-il? (What does he say?)' },
        { pronoun: 'Qu\'est-ce que', form: 'Emphatic form', english: 'Qu\'est-ce que tu veux? (What do you want?)' },
        { pronoun: 'Qu\'est-ce qui', form: 'Subject form', english: 'Qu\'est-ce qui se passe? (What is happening?)' }
      ]
    },
    examples: [
      {
        spanish: 'SIMPLE: Que lis-tu? (What are you reading?)',
        english: 'EMPHATIC: Qu\'est-ce que tu lis? (What are you reading?)',
        highlight: ['Que lis-tu', 'Qu\'est-ce que tu lis']
      },
      {
        spanish: 'SUBJECT: Qu\'est-ce qui fait ce bruit? (What is making this noise?)',
        english: 'INVERSION: Que veut-elle? (What does she want?)',
        highlight: ['Qu\'est-ce qui fait', 'Que veut-elle']
      }
    ]
  },
  {
    title: 'QUOI - What (After Prepositions)',
    content: `**QUOI** is used for **things** after **prepositions**:`,
    conjugationTable: {
      title: 'QUOI Usage Patterns',
      conjugations: [
        { pronoun: 'After preposition', form: 'Preposition + quoi', english: 'Avec quoi? (With what?)' },
        { pronoun: 'De quoi', form: 'About what', english: 'De quoi parles-tu? (What are you talking about?)' },
        { pronoun: 'À quoi', form: 'To what', english: 'À quoi penses-tu? (What are you thinking about?)' },
        { pronoun: 'Standalone', form: 'Quoi?', english: 'Quoi? (What? - informal)' }
      ]
    },
    examples: [
      {
        spanish: 'INSTRUMENT: Avec quoi écris-tu? (What are you writing with?)',
        english: 'TOPIC: De quoi avez-vous besoin? (What do you need?)',
        highlight: ['Avec quoi', 'De quoi']
      },
      {
        spanish: 'THINKING: À quoi sert cet outil? (What is this tool for?)',
        english: 'INFORMAL: Tu dis quoi? (What are you saying?)',
        highlight: ['À quoi sert', 'Tu dis quoi']
      }
    ]
  },
  {
    title: 'LEQUEL - Which One(s)',
    content: `**LEQUEL** agrees in **gender and number** and asks for **choice**:`,
    conjugationTable: {
      title: 'LEQUEL Agreement Forms',
      conjugations: [
        { pronoun: 'lequel', form: 'masculine singular', english: 'Lequel veux-tu? (Which one do you want?)' },
        { pronoun: 'laquelle', form: 'feminine singular', english: 'Laquelle préfères-tu? (Which one do you prefer?)' },
        { pronoun: 'lesquels', form: 'masculine plural', english: 'Lesquels choisis-tu? (Which ones do you choose?)' },
        { pronoun: 'lesquelles', form: 'feminine plural', english: 'Lesquelles achètes-tu? (Which ones are you buying?)' }
      ]
    },
    examples: [
      {
        spanish: 'MASCULINE: Lequel de ces livres lis-tu? (Which of these books are you reading?)',
        english: 'FEMININE: Laquelle de ces voitures préfères-tu? (Which of these cars do you prefer?)',
        highlight: ['Lequel de ces livres', 'Laquelle de ces voitures']
      },
      {
        spanish: 'PLURAL M: Lesquels de ces films as-tu vus? (Which of these movies have you seen?)',
        english: 'PLURAL F: Lesquelles de ces chansons aimes-tu? (Which of these songs do you like?)',
        highlight: ['Lesquels de ces films', 'Lesquelles de ces chansons']
      }
    ]
  },
  {
    title: 'LEQUEL with Prepositions',
    content: `**LEQUEL** contracts with **à** and **de**:`,
    conjugationTable: {
      title: 'LEQUEL Contractions',
      conjugations: [
        { pronoun: 'auquel', form: 'à + lequel', english: 'Auquel penses-tu? (Which one are you thinking of?)' },
        { pronoun: 'à laquelle', form: 'à + laquelle', english: 'À laquelle participes-tu? (Which one are you participating in?)' },
        { pronoun: 'duquel', form: 'de + lequel', english: 'Duquel parles-tu? (Which one are you talking about?)' },
        { pronoun: 'de laquelle', form: 'de + laquelle', english: 'De laquelle as-tu besoin? (Which one do you need?)' }
      ]
    },
    examples: [
      {
        spanish: 'CONTRACTION: Auquel de ces projets travailles-tu? (Which of these projects are you working on?)',
        english: 'NO CONTRACTION: À laquelle de ces universités postules-tu? (Which of these universities are you applying to?)',
        highlight: ['Auquel de ces projets', 'À laquelle de ces universités']
      },
      {
        spanish: 'DE CONTRACTION: Duquel de ces restaurants viens-tu? (Which of these restaurants are you coming from?)',
        english: 'PLURAL: Desquels parlez-vous? (Which ones are you talking about?)',
        highlight: ['Duquel de ces restaurants', 'Desquels']
      }
    ]
  },
  {
    title: 'Formal vs Informal Questions',
    content: `**Different levels** of formality in interrogative pronouns:`,
    conjugationTable: {
      title: 'Formality Levels',
      conjugations: [
        { pronoun: 'Very formal', form: 'Que faites-vous?', english: 'What are you doing?' },
        { pronoun: 'Standard', form: 'Qu\'est-ce que vous faites?', english: 'What are you doing?' },
        { pronoun: 'Informal', form: 'Vous faites quoi?', english: 'What are you doing?' },
        { pronoun: 'Very informal', form: 'Tu fais quoi?', english: 'What are you doing?' }
      ]
    },
    examples: [
      {
        spanish: 'FORMAL: Qui désirez-vous voir? (Whom do you wish to see?)',
        english: 'INFORMAL: Tu veux voir qui? (Who do you want to see?)',
        highlight: ['Qui désirez-vous voir', 'Tu veux voir qui']
      }
    ]
  },
  {
    title: 'Complex Interrogative Structures',
    content: `**Advanced patterns** with interrogative pronouns:`,
    examples: [
      {
        spanish: 'DOUBLE QUESTION: Qui fait quoi? (Who does what?)',
        english: 'INDIRECT: Je ne sais pas qui vient. (I don\'t know who is coming.)',
        highlight: ['Qui fait quoi', 'qui vient']
      },
      {
        spanish: 'RELATIVE: C\'est celui dont je parle. (It\'s the one I\'m talking about.)',
        english: 'EXCLAMATION: Comme c\'est beau! (How beautiful it is!)',
        highlight: ['celui dont', 'Comme c\'est beau']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. QUE vs QUOI**: Using que after prepositions instead of quoi
**2. Agreement errors**: Wrong agreement with lequel forms
**3. Contraction mistakes**: Not contracting lequel with à/de
**4. Formality mix-up**: Using wrong formality level`,
    examples: [
      {
        spanish: '❌ Avec que écris-tu? → ✅ Avec quoi écris-tu?',
        english: 'Wrong: use quoi (not que) after prepositions',
        highlight: ['Avec quoi']
      },
      {
        spanish: '❌ Lequel de ces filles? → ✅ Laquelle de ces filles?',
        english: 'Wrong: lequel must agree with feminine noun',
        highlight: ['Laquelle de ces filles']
      },
      {
        spanish: '❌ À lequel penses-tu? → ✅ Auquel penses-tu?',
        english: 'Wrong: must contract à + lequel = auquel',
        highlight: ['Auquel penses-tu']
      },
      {
        spanish: '❌ Qu\'est-ce qui tu fais? → ✅ Qu\'est-ce que tu fais?',
        english: 'Wrong: use que (not qui) for object questions',
        highlight: ['Qu\'est-ce que tu fais']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Question Formation', url: '/grammar/french/syntax/questions', difficulty: 'intermediate' },
  { title: 'French Relative Pronouns', url: '/grammar/french/pronouns/relative-qui', difficulty: 'intermediate' },
  { title: 'French Prepositions', url: '/grammar/french/prepositions/common', difficulty: 'beginner' },
  { title: 'French Formal vs Informal', url: '/grammar/french/register/formality', difficulty: 'intermediate' }
];

export default function FrenchInterrogativePage() {
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
              topic: 'interrogative',
              title: 'French Interrogative Pronouns - Qui, Que, Quoi, Lequel',
              description: 'Master French interrogative pronouns including qui, que, quoi, lequel and their usage in questions.',
              difficulty: 'intermediate',
              examples: [
                'Qui est-ce? (Who is it?)',
                'Que fais-tu? (What are you doing?)',
                'Avec quoi écris-tu? (What are you writing with?)',
                'Lequel préfères-tu? (Which one do you prefer?)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'pronouns',
              topic: 'interrogative',
              title: 'French Interrogative Pronouns - Qui, Que, Quoi, Lequel'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="pronouns"
        topic="interrogative"
        title="French Interrogative Pronouns - Qui, Que, Quoi, Lequel"
        description="Master French interrogative pronouns including qui, que, quoi, lequel and their usage in questions"
        difficulty="intermediate"
        estimatedTime={16}
        sections={sections}
        backUrl="/grammar/french/pronouns"
        practiceUrl="/grammar/french/pronouns/interrogative/practice"
        quizUrl="/grammar/french/pronouns/interrogative/quiz"
        songUrl="/songs/fr?theme=grammar&topic=interrogative"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
