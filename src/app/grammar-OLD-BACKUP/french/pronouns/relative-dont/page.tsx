import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'pronouns',
  topic: 'relative-dont',
  title: 'French Relative Pronoun DONT - De + Relative Clauses',
  description: 'Master French relative pronoun DONT for expressions with DE including possession and verbal constructions.',
  difficulty: 'advanced',
  keywords: [
    'french relative pronoun dont',
    'dont french grammar',
    'french de relative clauses',
    'dont possession french',
    'french advanced pronouns'
  ],
  examples: [
    'Le livre dont je parle est intéressant. (The book I\'m talking about is interesting.)',
    'La femme dont le fils étudie ici. (The woman whose son studies here.)',
    'C\'est ce dont j\'ai besoin. (That\'s what I need.)',
    'La ville dont il vient est belle. (The city he comes from is beautiful.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Relative Pronoun DONT',
    content: `The French relative pronoun **DONT** replaces **de + noun** in relative clauses. It's one of the most sophisticated relative pronouns and essential for advanced French expression.

**What DONT replaces:**
- **de + noun**: Je parle de ce livre → Le livre dont je parle
- **Possession with de**: Le fils de cette femme → La femme dont le fils
- **Verbal constructions with de**: J'ai besoin de cela → Ce dont j'ai besoin

**Key functions:**
- **Verbal complements**: Verbs that require "de"
- **Possession**: Expressing "whose" relationships
- **Abstract concepts**: "What" with de constructions
- **Prepositional phrases**: Replacing de + complement

**DONT vs other pronouns:**
- **QUI**: subject of relative clause
- **QUE**: direct object of relative clause
- **DONT**: replaces "de + noun" constructions
- **OÙ**: place and time expressions

**Why DONT matters:**
- **Advanced French**: Mark sophisticated language use
- **Avoid repetition**: Elegant sentence construction
- **Natural expression**: Essential for fluent French
- **Complex ideas**: Express intricate relationships

**Basic pattern:**
**Antecedent + DONT + subject + verb + rest of clause**

Understanding DONT is **crucial** for **advanced French proficiency**.`,
    examples: [
      {
        spanish: 'SIMPLE: Je parle de ce livre. Ce livre est intéressant.',
        english: 'WITH DONT: Le livre dont je parle est intéressant.',
        highlight: ['dont je parle']
      },
      {
        spanish: 'POSSESSION: Le fils de cette femme étudie ici.',
        english: 'WITH DONT: La femme dont le fils étudie ici.',
        highlight: ['dont le fils']
      }
    ]
  },
  {
    title: 'DONT with Verbs Requiring DE',
    content: `**Many French verbs** require the preposition **de**:`,
    conjugationTable: {
      title: 'Common Verbs with DE',
      conjugations: [
        { pronoun: 'parler de', form: 'to talk about', english: 'Le sujet dont nous parlons (The subject we\'re talking about)' },
        { pronoun: 'avoir besoin de', form: 'to need', english: 'Ce dont j\'ai besoin (What I need)' },
        { pronoun: 'se souvenir de', form: 'to remember', english: 'L\'histoire dont je me souviens (The story I remember)' },
        { pronoun: 'rêver de', form: 'to dream of', english: 'La maison dont je rêve (The house I dream of)' },
        { pronoun: 'avoir peur de', form: 'to be afraid of', english: 'Ce dont il a peur (What he\'s afraid of)' },
        { pronoun: 'être fier de', form: 'to be proud of', english: 'Le travail dont elle est fière (The work she\'s proud of)' }
      ]
    },
    examples: [
      {
        spanish: 'PARLER DE: Le problème dont nous parlons est sérieux. (The problem we\'re talking about is serious.)',
        english: 'AVOIR BESOIN DE: C\'est exactement ce dont j\'avais besoin. (That\'s exactly what I needed.)',
        highlight: ['dont nous parlons', 'ce dont j\'avais besoin']
      },
      {
        spanish: 'SE SOUVENIR DE: L\'époque dont je me souviens était différente. (The time I remember was different.)',
        english: 'RÊVER DE: La carrière dont elle rêve est difficile. (The career she dreams of is difficult.)',
        highlight: ['dont je me souviens', 'dont elle rêve']
      }
    ]
  },
  {
    title: 'DONT Expressing Possession',
    content: `**DONT** expresses **possession** (whose, of which):`,
    conjugationTable: {
      title: 'Possession with DONT',
      conjugations: [
        { pronoun: 'Person + possession', form: 'dont + article + noun', english: 'L\'homme dont la voiture... (The man whose car...)' },
        { pronoun: 'Thing + part', form: 'dont + article + noun', english: 'Le livre dont la couverture... (The book whose cover...)' },
        { pronoun: 'Multiple possession', form: 'dont + les + noun', english: 'La famille dont les enfants... (The family whose children...)' },
        { pronoun: 'Abstract possession', form: 'dont + article + noun', english: 'Le projet dont le succès... (The project whose success...)' }
      ]
    },
    examples: [
      {
        spanish: 'PERSON: La femme dont le mari travaille ici est très gentille. (The woman whose husband works here is very kind.)',
        english: 'THING: Le château dont l\'architecture est magnifique date du 16e siècle. (The castle whose architecture is magnificent dates from the 16th century.)',
        highlight: ['dont le mari', 'dont l\'architecture']
      },
      {
        spanish: 'PLURAL: L\'école dont les professeurs sont excellents. (The school whose teachers are excellent.)',
        english: 'ABSTRACT: Le film dont le succès a surpris tout le monde. (The film whose success surprised everyone.)',
        highlight: ['dont les professeurs', 'dont le succès']
      }
    ]
  },
  {
    title: 'DONT with Adjectives Requiring DE',
    content: `**Adjectives** that require **de** also use DONT:`,
    conjugationTable: {
      title: 'Adjectives with DE',
      conjugations: [
        { pronoun: 'être content de', form: 'to be happy about', english: 'Le résultat dont il est content (The result he\'s happy about)' },
        { pronoun: 'être satisfait de', form: 'to be satisfied with', english: 'Le travail dont elle est satisfaite (The work she\'s satisfied with)' },
        { pronoun: 'être capable de', form: 'to be capable of', english: 'Ce dont il est capable (What he\'s capable of)' },
        { pronoun: 'être responsable de', form: 'to be responsible for', english: 'Le projet dont je suis responsable (The project I\'m responsible for)' }
      ]
    },
    examples: [
      {
        spanish: 'CONTENT: Le cadeau dont elle est très contente était parfait. (The gift she\'s very happy about was perfect.)',
        english: 'CAPABLE: C\'est quelque chose dont il n\'est pas capable. (That\'s something he\'s not capable of.)',
        highlight: ['dont elle est contente', 'dont il n\'est pas capable']
      }
    ]
  },
  {
    title: 'CE DONT - What (Abstract)',
    content: `**Ce dont** means **"what"** for abstract concepts with de:`,
    examples: [
      {
        spanish: 'NEED: C\'est ce dont j\'ai besoin. (That\'s what I need.)',
        english: 'TALK: Ce dont nous parlons est important. (What we\'re talking about is important.)',
        highlight: ['ce dont j\'ai besoin', 'Ce dont nous parlons']
      },
      {
        spanish: 'DREAM: Ce dont je rêve, c\'est de voyager. (What I dream of is traveling.)',
        english: 'AFRAID: Ce dont il a peur ne va pas arriver. (What he\'s afraid of won\'t happen.)',
        highlight: ['Ce dont je rêve', 'Ce dont il a peur']
      }
    ]
  },
  {
    title: 'DONT vs Other Relative Pronouns',
    content: `**Choosing** the correct relative pronoun:`,
    conjugationTable: {
      title: 'Relative Pronoun Comparison',
      conjugations: [
        { pronoun: 'QUI (subject)', form: 'L\'homme qui parle', english: 'The man who speaks' },
        { pronoun: 'QUE (object)', form: 'L\'homme que je vois', english: 'The man whom I see' },
        { pronoun: 'DONT (de + noun)', form: 'L\'homme dont je parle', english: 'The man I\'m talking about' },
        { pronoun: 'OÙ (place/time)', form: 'L\'endroit où je vais', english: 'The place where I\'m going' }
      ]
    },
    examples: [
      {
        spanish: 'SUBJECT: L\'étudiant qui étudie beaucoup réussit. (The student who studies a lot succeeds.)',
        english: 'OBJECT: L\'étudiant que je connais réussit. (The student whom I know succeeds.)',
        highlight: ['qui étudie', 'que je connais']
      },
      {
        spanish: 'DONT: L\'étudiant dont je parle réussit. (The student I\'m talking about succeeds.)',
        english: 'OÙ: L\'université où il étudie est excellente. (The university where he studies is excellent.)',
        highlight: ['dont je parle', 'où il étudie']
      }
    ]
  },
  {
    title: 'Complex DONT Constructions',
    content: `**Advanced patterns** with DONT:`,
    examples: [
      {
        spanish: 'MULTIPLE CLAUSES: L\'auteur dont le livre que j\'ai lu est célèbre.',
        english: 'TRANSLATION: The author whose book that I read is famous.',
        highlight: ['dont le livre que j\'ai lu']
      },
      {
        spanish: 'NESTED: C\'est la raison pour laquelle ce dont nous parlons est important.',
        english: 'TRANSLATION: That\'s the reason why what we\'re talking about is important.',
        highlight: ['ce dont nous parlons']
      },
      {
        spanish: 'EMPHASIS: Voilà ce dont il s\'agit! (That\'s what it\'s about!)',
        english: 'FORMAL: La question dont il est question... (The question in question...)',
        highlight: ['ce dont il s\'agit', 'dont il est question']
      }
    ]
  },
  {
    title: 'DONT in Different Tenses',
    content: `**DONT** works with **all tenses**:`,
    examples: [
      {
        spanish: 'PRESENT: Le film dont je parle passe ce soir. (The movie I\'m talking about is showing tonight.)',
        english: 'PAST: Le livre dont j\'ai parlé était excellent. (The book I talked about was excellent.)',
        highlight: ['dont je parle', 'dont j\'ai parlé']
      },
      {
        spanish: 'FUTURE: C\'est ce dont nous parlerons demain. (That\'s what we\'ll talk about tomorrow.)',
        english: 'CONDITIONAL: C\'est ce dont j\'aimerais parler. (That\'s what I\'d like to talk about.)',
        highlight: ['dont nous parlerons', 'dont j\'aimerais parler']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Using QUE instead of DONT**: With verbs requiring "de"
**2. Wrong word order**: Incorrect placement in possession
**3. Missing articles**: Forgetting articles in possession constructions
**4. Preposition confusion**: Adding extra "de" with DONT`,
    examples: [
      {
        spanish: '❌ Le livre que je parle de → ✅ Le livre dont je parle',
        english: 'Wrong: use DONT (not QUE) with "parler de"',
        highlight: ['dont je parle']
      },
      {
        spanish: '❌ L\'homme dont voiture → ✅ L\'homme dont la voiture',
        english: 'Wrong: need article in possession constructions',
        highlight: ['dont la voiture']
      },
      {
        spanish: '❌ Ce dont de j\'ai besoin → ✅ Ce dont j\'ai besoin',
        english: 'Wrong: don\'t add extra "de" with DONT',
        highlight: ['Ce dont j\'ai besoin']
      },
      {
        spanish: '❌ La femme dont son fils → ✅ La femme dont le fils',
        english: 'Wrong: use article (not possessive) with DONT',
        highlight: ['dont le fils']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Relative Pronoun QUI', url: '/grammar/french/pronouns/relative-qui', difficulty: 'intermediate' },
  { title: 'French Relative Pronoun QUE', url: '/grammar/french/pronouns/relative-que', difficulty: 'intermediate' },
  { title: 'French Preposition DE', url: '/grammar/french/prepositions/de', difficulty: 'intermediate' },
  { title: 'French Complex Sentences', url: '/grammar/french/syntax/complex-sentences', difficulty: 'advanced' }
];

export default function FrenchRelativeDontPage() {
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
              topic: 'relative-dont',
              title: 'French Relative Pronoun DONT - De + Relative Clauses',
              description: 'Master French relative pronoun DONT for expressions with DE including possession and verbal constructions.',
              difficulty: 'advanced',
              examples: [
                'Le livre dont je parle est intéressant. (The book I\'m talking about is interesting.)',
                'La femme dont le fils étudie ici. (The woman whose son studies here.)',
                'C\'est ce dont j\'ai besoin. (That\'s what I need.)',
                'La ville dont il vient est belle. (The city he comes from is beautiful.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'pronouns',
              topic: 'relative-dont',
              title: 'French Relative Pronoun DONT - De + Relative Clauses'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="pronouns"
        topic="relative-dont"
        title="French Relative Pronoun DONT - De + Relative Clauses"
        description="Master French relative pronoun DONT for expressions with DE including possession and verbal constructions"
        difficulty="advanced"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/french/pronouns"
        practiceUrl="/grammar/french/pronouns/relative-dont/practice"
        quizUrl="/grammar/french/pronouns/relative-dont/quiz"
        songUrl="/songs/fr?theme=grammar&topic=relative-dont"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
