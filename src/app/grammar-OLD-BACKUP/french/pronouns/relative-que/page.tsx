import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'pronouns',
  topic: 'relative-que',
  title: 'French Relative Pronoun QUE - Object Relative Clauses',
  description: 'Master French relative pronoun QUE for object relative clauses including elision and past participle agreement.',
  difficulty: 'intermediate',
  keywords: [
    'french relative pronoun que',
    'que french grammar',
    'french object relative clauses',
    'que elision french',
    'french past participle agreement'
  ],
  examples: [
    'Le livre que je lis est intéressant. (The book that I read is interesting.)',
    'La femme qu\'il aime est belle. (The woman whom he loves is beautiful.)',
    'Les films que nous avons vus. (The films that we saw.)',
    'C\'est la voiture que j\'ai achetée. (It\'s the car that I bought.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Relative Pronoun QUE',
    content: `The French relative pronoun **QUE** introduces **relative clauses** where QUE functions as the **direct object** of the relative clause. It connects clauses and replaces the direct object to avoid repetition.

**Basic function:**
**QUE = direct object of the relative clause**

**Key features:**
- **Object function**: QUE is always the direct object
- **Elision**: QUE becomes QU' before vowels
- **Agreement**: Triggers past participle agreement in compound tenses
- **Universal usage**: Used for both people and things

**What QUE replaces:**
- **People as objects**: Je vois la femme → La femme que je vois
- **Things as objects**: J'achète le livre → Le livre que j'achète
- **Abstract concepts**: J'aime l'idée → L'idée que j'aime

**Why QUE matters:**
- **Sentence complexity**: Create sophisticated structures
- **Avoid repetition**: Connect related ideas smoothly
- **Natural French**: Essential for fluent expression
- **Grammar accuracy**: Triggers important agreement rules

**Basic pattern:**
**Antecedent + QUE + subject + verb + rest of clause**

Understanding QUE is **crucial** for **intermediate French proficiency**.`,
    examples: [
      {
        spanish: 'SIMPLE: J\'achète un livre. Le livre est intéressant.',
        english: 'WITH QUE: Le livre que j\'achète est intéressant.',
        highlight: ['que j\'achète']
      },
      {
        spanish: 'SIMPLE: Elle connaît cet homme. Cet homme travaille ici.',
        english: 'WITH QUE: L\'homme qu\'elle connaît travaille ici.',
        highlight: ['qu\'elle connaît']
      }
    ]
  },
  {
    title: 'QUE as Direct Object',
    content: `**QUE** always functions as the **direct object** of the relative clause:`,
    conjugationTable: {
      title: 'QUE as Direct Object',
      conjugations: [
        { pronoun: 'Person object', form: 'que + subject + verb', english: 'La femme que je vois (The woman whom I see)' },
        { pronoun: 'Thing object', form: 'que + subject + verb', english: 'Le livre que tu lis (The book that you read)' },
        { pronoun: 'Abstract object', form: 'que + subject + verb', english: 'L\'idée que nous aimons (The idea that we love)' },
        { pronoun: 'Plural object', form: 'que + subject + verb', english: 'Les films que vous regardez (The films that you watch)' }
      ]
    },
    examples: [
      {
        spanish: 'PERSON: L\'ami que je rencontre souvent est sympa. (The friend whom I meet often is nice.)',
        english: 'THING: La voiture que nous avons achetée est chère. (The car that we bought is expensive.)',
        highlight: ['que je rencontre', 'que nous avons achetée']
      },
      {
        spanish: 'ABSTRACT: Le problème que tu mentionnes est sérieux. (The problem that you mention is serious.)',
        english: 'PLURAL: Les chansons que j\'écoute sont belles. (The songs that I listen to are beautiful.)',
        highlight: ['que tu mentionnes', 'que j\'écoute']
      }
    ]
  },
  {
    title: 'Elision: QUE becomes QU\'',
    content: `**QUE** becomes **QU\'** before vowels and silent h:`,
    conjugationTable: {
      title: 'Elision Rules with QUE',
      conjugations: [
        { pronoun: 'Before vowel', form: "qu'", english: "L'homme qu'elle aime (The man whom she loves)" },
        { pronoun: 'Before silent h', form: "qu'", english: "L'hôtel qu'ils ont choisi (The hotel that they chose)" },
        { pronoun: 'Before consonant', form: 'que', english: 'Le livre que je lis (The book that I read)' },
        { pronoun: 'Before aspirated h', form: 'que', english: 'Le héros que nous admirons (The hero whom we admire)' }
      ]
    },
    examples: [
      {
        spanish: 'ELISION: La maison qu\'il achète est grande. (The house that he buys is big.)',
        english: 'NO ELISION: La maison que Pierre achète est grande. (The house that Pierre buys is big.)',
        highlight: ['qu\'il achète', 'que Pierre achète']
      },
      {
        spanish: 'VOWEL: L\'université qu\'elle fréquente. (The university that she attends.)',
        english: 'CONSONANT: L\'université que Marie fréquente. (The university that Marie attends.)',
        highlight: ['qu\'elle fréquente', 'que Marie fréquente']
      }
    ]
  },
  {
    title: 'QUE vs QUI - Key Differences',
    content: `**Critical distinction** between QUE (object) and QUI (subject):`,
    conjugationTable: {
      title: 'QUE vs QUI Comparison',
      conjugations: [
        { pronoun: 'QUE (object)', form: 'que + subject + verb', english: 'Le livre que je lis (The book that I read)' },
        { pronoun: 'QUI (subject)', form: 'qui + verb', english: 'Le livre qui est intéressant (The book that is interesting)' },
        { pronoun: 'QUE test', form: 'Can replace with le/la', english: 'Je le lis → que je lis' },
        { pronoun: 'QUI test', form: 'Can replace with il/elle', english: 'Il est intéressant → qui est intéressant' }
      ]
    },
    examples: [
      {
        spanish: 'QUE (OBJECT): La voiture que j\'ai achetée... (The car that I bought...)',
        english: 'QUI (SUBJECT): La voiture qui est rouge... (The car that is red...)',
        highlight: ['que j\'ai achetée', 'qui est rouge']
      },
      {
        spanish: 'QUE TEST: J\'ai acheté la voiture → Je l\'ai achetée → que j\'ai achetée',
        english: 'QUI TEST: La voiture est rouge → Elle est rouge → qui est rouge',
        highlight: ['que j\'ai achetée', 'qui est rouge']
      }
    ]
  },
  {
    title: 'Past Participle Agreement with QUE',
    content: `**QUE triggers past participle agreement** in compound tenses:`,
    conjugationTable: {
      title: 'Past Participle Agreement Rules',
      conjugations: [
        { pronoun: 'Masculine singular', form: 'que j\'ai vu', english: 'Le film que j\'ai vu (The film that I saw)' },
        { pronoun: 'Feminine singular', form: 'que j\'ai vue', english: 'La pièce que j\'ai vue (The play that I saw)' },
        { pronoun: 'Masculine plural', form: 'que j\'ai vus', english: 'Les films que j\'ai vus (The films that I saw)' },
        { pronoun: 'Feminine plural', form: 'que j\'ai vues', english: 'Les pièces que j\'ai vues (The plays that I saw)' }
      ]
    },
    examples: [
      {
        spanish: 'MASCULINE: Le livre que j\'ai lu était intéressant. (The book that I read was interesting.)',
        english: 'FEMININE: La lettre que j\'ai écrite est importante. (The letter that I wrote is important.)',
        highlight: ['que j\'ai lu', 'que j\'ai écrite']
      },
      {
        spanish: 'PLURAL M: Les romans que nous avons lus. (The novels that we read.)',
        english: 'PLURAL F: Les histoires que vous avez racontées. (The stories that you told.)',
        highlight: ['que nous avons lus', 'que vous avez racontées']
      }
    ]
  },
  {
    title: 'QUE in Different Tenses',
    content: `**QUE** can be used with **any tense** in the relative clause:`,
    conjugationTable: {
      title: 'QUE with Various Tenses',
      conjugations: [
        { pronoun: 'Present', form: 'que + present', english: 'Le livre que je lis (The book that I read)' },
        { pronoun: 'Past', form: 'que + passé composé', english: 'Le film que j\'ai vu (The film that I saw)' },
        { pronoun: 'Imperfect', form: 'que + imperfect', english: 'La maison que nous habitions (The house that we lived in)' },
        { pronoun: 'Future', form: 'que + future', english: 'Le projet que nous ferons (The project that we will do)' },
        { pronoun: 'Conditional', form: 'que + conditional', english: 'Le voyage que j\'aimerais faire (The trip that I would like to take)' }
      ]
    },
    examples: [
      {
        spanish: 'PRESENT: La musique que j\'écoute me plaît. (The music that I listen to pleases me.)',
        english: 'PAST: La personne que j\'ai rencontrée était gentille. (The person whom I met was kind.)',
        highlight: ['que j\'écoute', 'que j\'ai rencontrée']
      },
      {
        spanish: 'IMPERFECT: Le restaurant que nous fréquentions a fermé. (The restaurant that we used to go to has closed.)',
        english: 'FUTURE: Les livres que tu liras seront utiles. (The books that you will read will be useful.)',
        highlight: ['que nous fréquentions', 'que tu liras']
      }
    ]
  },
  {
    title: 'QUE in Complex Sentences',
    content: `**QUE** in more complex sentence structures:`,
    examples: [
      {
        spanish: 'MULTIPLE CLAUSES: L\'homme que je connais et que tu as rencontré hier.',
        english: 'TRANSLATION: The man whom I know and whom you met yesterday.',
        highlight: ['que je connais', 'que tu as rencontré']
      },
      {
        spanish: 'NESTED: Le livre que l\'auteur que nous admirons a écrit.',
        english: 'TRANSLATION: The book that the author whom we admire wrote.',
        highlight: ['que l\'auteur', 'que nous admirons']
      },
      {
        spanish: 'WITH INFINITIVE: C\'est quelque chose que je veux faire.',
        english: 'TRANSLATION: It\'s something that I want to do.',
        highlight: ['que je veux faire']
      }
    ]
  },
  {
    title: 'QUE in Fixed Expressions',
    content: `**Common expressions** and idioms with QUE:`,
    conjugationTable: {
      title: 'Fixed Expressions with QUE',
      conjugations: [
        { pronoun: 'Ce que', form: 'what (that which)', english: 'Je sais ce que tu veux. (I know what you want.)' },
        { pronoun: 'Tout ce que', form: 'everything that', english: 'Tout ce que je sais... (Everything that I know...)' },
        { pronoun: 'C\'est... que', form: 'it\'s... that', english: 'C\'est lui que je cherche. (It\'s him that I\'m looking for.)' },
        { pronoun: 'Il faut que', form: 'it\'s necessary that', english: 'Il faut que tu viennes. (You must come.)' }
      ]
    },
    examples: [
      {
        spanish: 'CE QUE: Je ne comprends pas ce que tu dis. (I don\'t understand what you say.)',
        english: 'TOUT CE QUE: Tout ce que nous avons fait était inutile. (Everything that we did was useless.)',
        highlight: ['ce que tu dis', 'tout ce que nous avons fait']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. QUE vs QUI confusion**: Using wrong relative pronoun
**2. Missing elision**: Not eliding QUE before vowels
**3. Agreement errors**: Wrong past participle agreement
**4. Word order**: Incorrect placement in relative clause`,
    examples: [
      {
        spanish: '❌ L\'homme qui je vois → ✅ L\'homme que je vois',
        english: 'Wrong: QUE is object, QUI is subject',
        highlight: ['que je vois']
      },
      {
        spanish: '❌ La femme que elle aime → ✅ La femme qu\'elle aime',
        english: 'Wrong: must elide QUE before vowel',
        highlight: ['qu\'elle aime']
      },
      {
        spanish: '❌ La voiture que j\'ai acheté → ✅ La voiture que j\'ai achetée',
        english: 'Wrong: past participle must agree with feminine antecedent',
        highlight: ['que j\'ai achetée']
      },
      {
        spanish: '❌ Le livre que je le lis → ✅ Le livre que je lis',
        english: 'Wrong: don\'t use both QUE and direct object pronoun',
        highlight: ['que je lis']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Relative Pronoun QUI', url: '/grammar/french/pronouns/relative-qui', difficulty: 'intermediate' },
  { title: 'French Past Participle Agreement', url: '/grammar/french/verbs/past-participle-agreement', difficulty: 'intermediate' },
  { title: 'French Relative Pronoun DONT', url: '/grammar/french/pronouns/relative-dont', difficulty: 'advanced' },
  { title: 'French Complex Sentences', url: '/grammar/french/syntax/complex-sentences', difficulty: 'advanced' }
];

export default function FrenchRelativeQuePage() {
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
              topic: 'relative-que',
              title: 'French Relative Pronoun QUE - Object Relative Clauses',
              description: 'Master French relative pronoun QUE for object relative clauses including elision and past participle agreement.',
              difficulty: 'intermediate',
              examples: [
                'Le livre que je lis est intéressant. (The book that I read is interesting.)',
                'La femme qu\'il aime est belle. (The woman whom he loves is beautiful.)',
                'Les films que nous avons vus. (The films that we saw.)',
                'C\'est la voiture que j\'ai achetée. (It\'s the car that I bought.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'pronouns',
              topic: 'relative-que',
              title: 'French Relative Pronoun QUE - Object Relative Clauses'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="pronouns"
        topic="relative-que"
        title="French Relative Pronoun QUE - Object Relative Clauses"
        description="Master French relative pronoun QUE for object relative clauses including elision and past participle agreement"
        difficulty="intermediate"
        estimatedTime={14}
        sections={sections}
        backUrl="/grammar/french/pronouns"
        practiceUrl="/grammar/french/pronouns/relative-que/practice"
        quizUrl="/grammar/french/pronouns/relative-que/quiz"
        songUrl="/songs/fr?theme=grammar&topic=relative-que"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
