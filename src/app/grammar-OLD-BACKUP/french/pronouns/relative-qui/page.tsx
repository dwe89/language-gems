import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'pronouns',
  topic: 'relative-qui',
  title: 'French Relative Pronoun QUI - Subject Relative Clauses',
  description: 'Master French relative pronoun QUI for subject relative clauses including usage with people and things.',
  difficulty: 'intermediate',
  keywords: [
    'french relative pronoun qui',
    'qui french grammar',
    'french relative clauses',
    'qui subject pronoun french',
    'french subordinate clauses'
  ],
  examples: [
    'L\'homme qui parle est mon père. (The man who speaks is my father.)',
    'Le livre qui est sur la table. (The book that is on the table.)',
    'Les étudiants qui étudient réussissent. (The students who study succeed.)',
    'C\'est moi qui ai raison. (It\'s me who is right.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Relative Pronoun QUI',
    content: `The French relative pronoun **QUI** introduces **relative clauses** where QUI functions as the **subject** of the relative clause. It connects two clauses and avoids repetition.

**Basic function:**
**QUI = subject of the relative clause**

**Key features:**
- **Subject function**: QUI is always the subject
- **No agreement**: QUI never changes form
- **People and things**: Used for both animate and inanimate
- **Essential tool**: Creates complex, sophisticated sentences

**What QUI replaces:**
- **People as subjects**: L'homme parle → L'homme qui parle
- **Things as subjects**: Le livre est là → Le livre qui est là
- **Abstract concepts**: L'idée plaît → L'idée qui plaît

**Why QUI matters:**
- **Sentence complexity**: Create sophisticated structures
- **Avoid repetition**: Connect related ideas smoothly
- **Natural French**: Essential for fluent expression
- **Written French**: Particularly important in formal writing

**Basic pattern:**
**Antecedent + QUI + verb + rest of clause**

Understanding QUI is **crucial** for **intermediate French proficiency**.`,
    examples: [
      {
        spanish: 'SIMPLE: L\'homme parle. Il est grand. (The man speaks. He is tall.)',
        english: 'WITH QUI: L\'homme qui parle est grand. (The man who speaks is tall.)',
        highlight: ['qui parle']
      },
      {
        spanish: 'SIMPLE: Le livre est intéressant. Il est sur la table.',
        english: 'WITH QUI: Le livre qui est sur la table est intéressant.',
        highlight: ['qui est sur la table']
      }
    ]
  },
  {
    title: 'QUI as Subject of Relative Clause',
    content: `**QUI** always functions as the **subject** of the relative clause:`,
    conjugationTable: {
      title: 'QUI as Subject',
      conjugations: [
        { pronoun: 'Person subject', form: 'qui + verb', english: 'La femme qui chante (The woman who sings)' },
        { pronoun: 'Thing subject', form: 'qui + verb', english: 'Le chien qui aboie (The dog that barks)' },
        { pronoun: 'Abstract subject', form: 'qui + verb', english: 'L\'idée qui me plaît (The idea that pleases me)' },
        { pronoun: 'Plural subject', form: 'qui + verb', english: 'Les gens qui travaillent (The people who work)' }
      ]
    },
    examples: [
      {
        spanish: 'PERSON: L\'étudiant qui étudie beaucoup réussit. (The student who studies a lot succeeds.)',
        english: 'THING: La voiture qui roule vite est dangereuse. (The car that goes fast is dangerous.)',
        highlight: ['qui étudie', 'qui roule']
      },
      {
        spanish: 'ABSTRACT: Le problème qui m\'inquiète est sérieux. (The problem that worries me is serious.)',
        english: 'PLURAL: Les livres qui sont chers ne se vendent pas. (The books that are expensive don\'t sell.)',
        highlight: ['qui m\'inquiète', 'qui sont chers']
      }
    ]
  },
  {
    title: 'QUI with Different Tenses',
    content: `**QUI** can be used with **any tense** in the relative clause:`,
    conjugationTable: {
      title: 'QUI with Various Tenses',
      conjugations: [
        { pronoun: 'Present', form: 'qui + present', english: 'L\'homme qui parle (The man who speaks)' },
        { pronoun: 'Past', form: 'qui + passé composé', english: 'La femme qui est venue (The woman who came)' },
        { pronoun: 'Imperfect', form: 'qui + imperfect', english: 'L\'enfant qui jouait (The child who was playing)' },
        { pronoun: 'Future', form: 'qui + future', english: 'Les gens qui viendront (The people who will come)' },
        { pronoun: 'Conditional', form: 'qui + conditional', english: 'Celui qui pourrait aider (The one who could help)' }
      ]
    },
    examples: [
      {
        spanish: 'PRESENT: Je connais l\'homme qui habite ici. (I know the man who lives here.)',
        english: 'PAST: Voici la personne qui m\'a aidé. (Here is the person who helped me.)',
        highlight: ['qui habite', 'qui m\'a aidé']
      },
      {
        spanish: 'IMPERFECT: C\'était l\'époque qui était difficile. (It was the time that was difficult.)',
        english: 'FUTURE: Les étudiants qui réussiront seront contents. (The students who will succeed will be happy.)',
        highlight: ['qui était', 'qui réussiront']
      }
    ]
  },
  {
    title: 'QUI vs QUE - Key Difference',
    content: `**Important distinction** between QUI (subject) and QUE (object):`,
    conjugationTable: {
      title: 'QUI vs QUE Usage',
      conjugations: [
        { pronoun: 'QUI (subject)', form: 'qui + verb', english: 'L\'homme qui parle (The man who speaks)' },
        { pronoun: 'QUE (object)', form: 'que + subject + verb', english: 'L\'homme que je vois (The man whom I see)' },
        { pronoun: 'QUI test', form: 'Can replace with il/elle', english: 'Il parle → qui parle' },
        { pronoun: 'QUE test', form: 'Can replace with le/la', english: 'Je le vois → que je vois' }
      ]
    },
    examples: [
      {
        spanish: 'QUI (SUBJECT): Le livre qui est intéressant... (The book that is interesting...)',
        english: 'QUE (OBJECT): Le livre que je lis... (The book that I read...)',
        highlight: ['qui est', 'que je lis']
      },
      {
        spanish: 'QUI TEST: Le livre est intéressant → Il est intéressant → qui est intéressant',
        english: 'QUE TEST: Je lis le livre → Je le lis → que je lis',
        highlight: ['qui est intéressant', 'que je lis']
      }
    ]
  },
  {
    title: 'QUI in Different Sentence Positions',
    content: `**QUI clauses** can appear in various positions:`,
    examples: [
      {
        spanish: 'MIDDLE: L\'homme qui travaille ici est sympa. (The man who works here is nice.)',
        english: 'END: Je connais quelqu\'un qui peut t\'aider. (I know someone who can help you.)',
        highlight: ['qui travaille ici', 'qui peut t\'aider']
      },
      {
        spanish: 'BEGINNING: Qui vivra verra. (He who lives will see. / Time will tell.)',
        english: 'EMPHASIS: C\'est lui qui a raison. (It\'s him who is right.)',
        highlight: ['Qui vivra', 'qui a raison']
      }
    ]
  },
  {
    title: 'QUI with Prepositions',
    content: `**QUI** can follow prepositions when referring to **people**:`,
    conjugationTable: {
      title: 'Preposition + QUI (People Only)',
      conjugations: [
        { pronoun: 'avec qui', form: 'with whom', english: 'La personne avec qui je parle (The person with whom I speak)' },
        { pronoun: 'pour qui', form: 'for whom', english: 'L\'ami pour qui je travaille (The friend for whom I work)' },
        { pronoun: 'chez qui', form: 'at whose place', english: 'La famille chez qui j\'habite (The family at whose place I live)' },
        { pronoun: 'sans qui', form: 'without whom', english: 'L\'homme sans qui rien n\'est possible (The man without whom nothing is possible)' }
      ]
    },
    examples: [
      {
        spanish: 'PEOPLE: La fille avec qui je sors est gentille. (The girl with whom I go out is nice.)',
        english: 'PEOPLE: Le professeur pour qui je travaille est exigeant. (The teacher for whom I work is demanding.)',
        highlight: ['avec qui je sors', 'pour qui je travaille']
      }
    ],
    subsections: [
      {
        title: 'Important Note',
        content: 'Preposition + QUI is only for people. For things, use other forms:',
        examples: [
          {
            spanish: 'PEOPLE: L\'ami avec qui je voyage (The friend with whom I travel)',
            english: 'THINGS: La voiture avec laquelle je voyage (The car with which I travel)',
            highlight: ['avec qui', 'avec laquelle']
          }
        ]
      }
    ]
  },
  {
    title: 'QUI in Fixed Expressions',
    content: `**Common fixed expressions** with QUI:`,
    conjugationTable: {
      title: 'Fixed Expressions with QUI',
      conjugations: [
        { pronoun: 'Qui vivra verra', form: 'Time will tell', english: 'Literal: Who will live will see' },
        { pronoun: 'Qui ne dit mot consent', form: 'Silence means consent', english: 'Who says nothing consents' },
        { pronoun: 'C\'est... qui', form: 'It\'s... who/that', english: 'C\'est moi qui ai raison. (It\'s me who is right.)' },
        { pronoun: 'Qui que ce soit', form: 'Whoever it may be', english: 'Je ne parle à qui que ce soit. (I don\'t speak to anyone.)' }
      ]
    },
    examples: [
      {
        spanish: 'EMPHASIS: C\'est toi qui as tort ! (It\'s you who are wrong!)',
        english: 'PROVERB: Qui ne risque rien n\'a rien. (Nothing ventured, nothing gained.)',
        highlight: ['C\'est toi qui', 'Qui ne risque rien']
      }
    ]
  },
  {
    title: 'QUI in Questions vs Relative Clauses',
    content: `**Distinguish** between interrogative QUI and relative QUI:`,
    conjugationTable: {
      title: 'Interrogative vs Relative QUI',
      conjugations: [
        { pronoun: 'Interrogative QUI', form: 'Who? (question)', english: 'Qui parle ? (Who is speaking?)' },
        { pronoun: 'Relative QUI', form: 'who/that (relative)', english: 'L\'homme qui parle (The man who speaks)' },
        { pronoun: 'Question context', form: 'Standalone or with est-ce que', english: 'Qui est-ce qui parle ?' },
        { pronoun: 'Relative context', form: 'After antecedent noun', english: 'Je vois l\'homme qui parle.' }
      ]
    },
    examples: [
      {
        spanish: 'QUESTION: Qui vient ce soir ? (Who is coming tonight?)',
        english: 'RELATIVE: Les amis qui viennent ce soir sont sympa. (The friends who are coming tonight are nice.)',
        highlight: ['Qui vient', 'qui viennent']
      }
    ]
  },
  {
    title: 'Complex Sentences with QUI',
    content: `**Building complex sentences** with multiple QUI clauses:`,
    examples: [
      {
        spanish: 'MULTIPLE: L\'homme qui travaille ici et qui parle français est mon collègue.',
        english: 'TRANSLATION: The man who works here and who speaks French is my colleague.',
        highlight: ['qui travaille', 'qui parle']
      },
      {
        spanish: 'NESTED: Je connais la femme qui a écrit le livre qui a gagné le prix.',
        english: 'TRANSLATION: I know the woman who wrote the book that won the prize.',
        highlight: ['qui a écrit', 'qui a gagné']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. QUI vs QUE confusion**: Using wrong relative pronoun
**2. Missing antecedent**: Using QUI without clear antecedent
**3. Preposition errors**: Wrong preposition + QUI usage
**4. Agreement confusion**: Thinking QUI changes form`,
    examples: [
      {
        spanish: '❌ L\'homme que parle → ✅ L\'homme qui parle',
        english: 'Wrong: QUI is subject, QUE is object',
        highlight: ['qui parle']
      },
      {
        spanish: '❌ Je vois qui parle → ✅ Je vois l\'homme qui parle',
        english: 'Wrong: need clear antecedent for relative QUI',
        highlight: ['l\'homme qui parle']
      },
      {
        spanish: '❌ La table avec qui → ✅ La table avec laquelle',
        english: 'Wrong: preposition + QUI only for people',
        highlight: ['avec laquelle']
      },
      {
        spanish: '❌ Les femmes quis parlent → ✅ Les femmes qui parlent',
        english: 'Wrong: QUI never changes form',
        highlight: ['qui parlent']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Relative Pronoun QUE', url: '/grammar/french/pronouns/relative-que', difficulty: 'intermediate' },
  { title: 'French Relative Pronoun DONT', url: '/grammar/french/pronouns/relative-dont', difficulty: 'advanced' },
  { title: 'French Complex Sentences', url: '/grammar/french/syntax/complex-sentences', difficulty: 'advanced' },
  { title: 'French Interrogative Pronouns', url: '/grammar/french/pronouns/interrogative', difficulty: 'intermediate' }
];

export default function FrenchRelativeQuiPage() {
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
              topic: 'relative-qui',
              title: 'French Relative Pronoun QUI - Subject Relative Clauses',
              description: 'Master French relative pronoun QUI for subject relative clauses including usage with people and things.',
              difficulty: 'intermediate',
              examples: [
                'L\'homme qui parle est mon père. (The man who speaks is my father.)',
                'Le livre qui est sur la table. (The book that is on the table.)',
                'Les étudiants qui étudient réussissent. (The students who study succeed.)',
                'C\'est moi qui ai raison. (It\'s me who is right.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'pronouns',
              topic: 'relative-qui',
              title: 'French Relative Pronoun QUI - Subject Relative Clauses'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="pronouns"
        topic="relative-qui"
        title="French Relative Pronoun QUI - Subject Relative Clauses"
        description="Master French relative pronoun QUI for subject relative clauses including usage with people and things"
        difficulty="intermediate"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/french/pronouns"
        practiceUrl="/grammar/french/pronouns/relative-qui/practice"
        quizUrl="/grammar/french/pronouns/relative-qui/quiz"
        songUrl="/songs/fr?theme=grammar&topic=relative-qui"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
