import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'pronouns',
  topic: 'relative',
  title: 'Spanish Relative Pronouns - Que, Quien, Cual, Cuyo',
  description: 'Master Spanish relative pronouns including que, quien, cual, cuyo, and donde with usage rules and examples.',
  difficulty: 'advanced',
  keywords: [
    'spanish relative pronouns',
    'que quien cual spanish',
    'cuyo spanish grammar',
    'spanish relative clauses',
    'donde spanish pronoun'
  ],
  examples: [
    'El libro que leo es interesante. (The book that I read is interesting.)',
    'La persona con quien hablo es mi amiga. (The person with whom I speak is my friend.)',
    'El coche cuyo motor está roto. (The car whose engine is broken.)',
    'La ciudad donde vivo es grande. (The city where I live is big.)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Relative Pronouns',
    content: `Spanish **relative pronouns** (pronombres relativos) connect clauses and refer back to a **noun or pronoun** mentioned earlier (the antecedent). They create complex sentences and avoid repetition.

**Main relative pronouns:**
- **que** (that, which, who)
- **quien/quienes** (who, whom)
- **cual/cuales** (which, what)
- **cuyo/cuya/cuyos/cuyas** (whose)
- **donde** (where)

**Key functions:**
- **Connect clauses**: Link main and subordinate clauses
- **Avoid repetition**: Replace repeated nouns
- **Add information**: Provide additional details
- **Create complexity**: Build sophisticated sentences

**Two types of relative clauses:**
- **Restrictive**: Essential information (no commas)
- **Non-restrictive**: Additional information (with commas)

**Why relative pronouns matter:**
- **Advanced grammar**: Mark sophisticated Spanish
- **Written Spanish**: Essential for formal writing
- **Natural flow**: Create smooth, connected discourse
- **Precise meaning**: Express complex relationships

Understanding relative pronouns is **crucial** for **advanced Spanish proficiency**.`,
    examples: [
      {
        spanish: 'SIMPLE: Tengo un libro. El libro es interesante.',
        english: 'WITH RELATIVE: Tengo un libro que es interesante.',
        highlight: ['que es interesante']
      },
      {
        spanish: 'RESTRICTIVE: Los estudiantes que estudian aprueban. (Essential info)',
        english: 'NON-RESTRICTIVE: Los estudiantes, que son inteligentes, aprueban. (Additional info)',
        highlight: ['que estudian', 'que son inteligentes']
      }
    ]
  },
  {
    title: 'QUE - The Most Common Relative Pronoun',
    content: `**QUE** is the most frequently used relative pronoun in Spanish:`,
    conjugationTable: {
      title: 'Uses of QUE',
      conjugations: [
        { pronoun: 'Subject (people)', form: 'who', english: 'La mujer que habla es mi madre. (The woman who speaks is my mother.)' },
        { pronoun: 'Subject (things)', form: 'that/which', english: 'El libro que está aquí es mío. (The book that is here is mine.)' },
        { pronoun: 'Direct object (people)', form: 'whom', english: 'El hombre que veo es alto. (The man whom I see is tall.)' },
        { pronoun: 'Direct object (things)', form: 'that/which', english: 'La casa que compré es grande. (The house that I bought is big.)' }
      ]
    },
    examples: [
      {
        spanish: 'SUBJECT: El perro que ladra es mío. (The dog that barks is mine.)',
        english: 'OBJECT: La película que vimos fue buena. (The movie that we saw was good.)',
        highlight: ['que ladra', 'que vimos']
      },
      {
        spanish: 'PEOPLE: La persona que llamó era mi hermana. (The person who called was my sister.)',
        english: 'THINGS: Los libros que leí eran interesantes. (The books that I read were interesting.)',
        highlight: ['que llamó', 'que leí']
      }
    ]
  },
  {
    title: 'QUIEN/QUIENES - For People Only',
    content: `**QUIEN** (singular) and **QUIENES** (plural) refer only to **people**:`,
    conjugationTable: {
      title: 'Uses of QUIEN/QUIENES',
      conjugations: [
        { pronoun: 'After prepositions', form: 'whom', english: 'La persona con quien hablo. (The person with whom I speak.)' },
        { pronoun: 'Non-restrictive clauses', form: 'who', english: 'Mi hermano, quien vive en Madrid, viene. (My brother, who lives in Madrid, is coming.)' },
        { pronoun: 'After comma', form: 'who', english: 'Los estudiantes, quienes estudian mucho, aprueban. (The students, who study a lot, pass.)' },
        { pronoun: 'Formal style', form: 'who/whom', english: 'Quien mucho abarca, poco aprieta. (He who tries to do too much accomplishes little.)' }
      ]
    },
    examples: [
      {
        spanish: 'PREPOSITION: El amigo de quien te hablé. (The friend about whom I told you.)',
        english: 'NON-RESTRICTIVE: María, quien es doctora, me ayudó. (María, who is a doctor, helped me.)',
        highlight: ['de quien te hablé', 'quien es doctora']
      },
      {
        spanish: 'PLURAL: Los profesores con quienes estudio son buenos. (The teachers with whom I study are good.)',
        english: 'FORMAL: Quien bien te quiere te hará llorar. (He who loves you will make you cry.)',
        highlight: ['con quienes estudio', 'Quien bien te quiere']
      }
    ]
  },
  {
    title: 'EL/LA CUAL, LOS/LAS CUALES - Formal Alternative',
    content: `**EL CUAL** and its forms are more formal alternatives to QUE:`,
    conjugationTable: {
      title: 'Forms of CUAL',
      conjugations: [
        { pronoun: 'el cual', form: 'which (masc. sing.)', english: 'El problema, el cual es serio... (The problem, which is serious...)' },
        { pronoun: 'la cual', form: 'which (fem. sing.)', english: 'La casa, la cual es grande... (The house, which is big...)' },
        { pronoun: 'los cuales', form: 'which (masc. plur.)', english: 'Los libros, los cuales son caros... (The books, which are expensive...)' },
        { pronoun: 'las cuales', form: 'which (fem. plur.)', english: 'Las ideas, las cuales son buenas... (The ideas, which are good...)' }
      ]
    },
    examples: [
      {
        spanish: 'FORMAL: El edificio, el cual es muy alto, se ve desde aquí.',
        english: 'INFORMAL: El edificio, que es muy alto, se ve desde aquí.',
        highlight: ['el cual es muy alto', 'que es muy alto']
      },
      {
        spanish: 'AFTER PREPOSITION: La razón por la cual vine. (The reason for which I came.)',
        english: 'CLARITY: Los problemas, los cuales son complejos, requieren tiempo.',
        highlight: ['por la cual vine', 'los cuales son complejos']
      }
    ]
  },
  {
    title: 'CUYO/CUYA/CUYOS/CUYAS - Possessive Relative',
    content: `**CUYO** expresses **possession** and agrees with the **thing possessed**:`,
    conjugationTable: {
      title: 'Forms of CUYO',
      conjugations: [
        { pronoun: 'cuyo', form: 'whose (masc. sing.)', english: 'El hombre cuyo coche es rojo. (The man whose car is red.)' },
        { pronoun: 'cuya', form: 'whose (fem. sing.)', english: 'La mujer cuya casa es grande. (The woman whose house is big.)' },
        { pronoun: 'cuyos', form: 'whose (masc. plur.)', english: 'El autor cuyos libros leo. (The author whose books I read.)' },
        { pronoun: 'cuyas', form: 'whose (fem. plur.)', english: 'La persona cuyas ideas admiro. (The person whose ideas I admire.)' }
      ]
    },
    examples: [
      {
        spanish: 'AGREEMENT: El estudiante cuya madre es profesora. (The student whose mother is a teacher.)',
        english: 'PLURAL: Los niños cuyos padres trabajan aquí. (The children whose parents work here.)',
        highlight: ['cuya madre', 'cuyos padres']
      },
      {
        spanish: 'FORMAL: La empresa cuyas acciones subieron. (The company whose shares went up.)',
        english: 'POSSESSION: El escritor cuyo nombre olvidé. (The writer whose name I forgot.)',
        highlight: ['cuyas acciones', 'cuyo nombre']
      }
    ]
  },
  {
    title: 'DONDE - Relative Adverb of Place',
    content: `**DONDE** refers to **places** and means "where":`,
    examples: [
      {
        spanish: 'PLACE: La ciudad donde vivo es bonita. (The city where I live is pretty.)',
        english: 'LOCATION: El lugar donde nos conocimos. (The place where we met.)',
        highlight: ['donde vivo', 'donde nos conocimos']
      },
      {
        spanish: 'ABSTRACT: La situación donde nos encontramos. (The situation where we find ourselves.)',
        english: 'DIRECTION: El país adonde vamos. (The country where we are going.)',
        highlight: ['donde nos encontramos', 'adonde vamos']
      }
    ],
    subsections: [
      {
        title: 'DONDE vs ADONDE',
        content: 'DONDE = location, ADONDE = direction (where to):',
        examples: [
          {
            spanish: 'LOCATION: La casa donde vivo. (The house where I live.)',
            english: 'DIRECTION: La ciudad adonde voy. (The city where I\'m going.)',
            highlight: ['donde vivo', 'adonde voy']
          }
        ]
      }
    ]
  },
  {
    title: 'Relative Pronouns with Prepositions',
    content: `**Prepositions** with relative pronouns follow specific patterns:`,
    conjugationTable: {
      title: 'Preposition + Relative Pronoun',
      conjugations: [
        { pronoun: 'con quien', form: 'with whom', english: 'La persona con quien hablo. (The person with whom I speak.)' },
        { pronoun: 'de quien', form: 'of/about whom', english: 'El amigo de quien te hablé. (The friend about whom I told you.)' },
        { pronoun: 'en que/donde', form: 'in which/where', english: 'La casa en que vivo. (The house in which I live.)' },
        { pronoun: 'por el cual', form: 'for which', english: 'La razón por la cual vine. (The reason for which I came.)' }
      ]
    },
    examples: [
      {
        spanish: 'PEOPLE: El profesor con quien estudio es excelente.',
        english: 'THINGS: El tema sobre el que escribo es interesante.',
        highlight: ['con quien estudio', 'sobre el que escribo']
      },
      {
        spanish: 'FORMAL: La manera en la cual lo hizo fue perfecta.',
        english: 'INFORMAL: La manera en que lo hizo fue perfecta.',
        highlight: ['en la cual lo hizo', 'en que lo hizo']
      }
    ]
  },
  {
    title: 'Restrictive vs Non-Restrictive Clauses',
    content: `**Punctuation** changes the meaning of relative clauses:`,
    conjugationTable: {
      title: 'Clause Types',
      conjugations: [
        { pronoun: 'Restrictive', form: 'No commas', english: 'Los estudiantes que estudian aprueban. (Only those who study pass.)' },
        { pronoun: 'Non-restrictive', form: 'With commas', english: 'Los estudiantes, que son inteligentes, aprueban. (All students, who happen to be intelligent, pass.)' },
        { pronoun: 'Essential info', form: 'Restrictive', english: 'El libro que compré es caro. (Specifies which book)' },
        { pronoun: 'Additional info', form: 'Non-restrictive', english: 'Mi libro, que es caro, me gusta. (Adds information about the book)' }
      ]
    },
    examples: [
      {
        spanish: 'RESTRICTIVE: Las personas que llegan tarde no entran. (People who arrive late don\'t enter.)',
        english: 'NON-RESTRICTIVE: Las personas, que son puntuales, ya entraron. (The people, who are punctual, already entered.)',
        highlight: ['que llegan tarde', 'que son puntuales']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong relative pronoun**: Using que instead of quien with prepositions
**2. CUYO agreement**: Not agreeing cuyo with thing possessed
**3. Comma confusion**: Wrong punctuation in relative clauses
**4. Preposition placement**: Wrong preposition with relative pronouns`,
    examples: [
      {
        spanish: '❌ La persona con que hablo → ✅ La persona con quien hablo',
        english: 'Wrong: use quien (not que) with prepositions for people',
        highlight: ['con quien hablo']
      },
      {
        spanish: '❌ El hombre cuyas coche → ✅ El hombre cuyo coche',
        english: 'Wrong: cuyo must agree with thing possessed (coche = masculine)',
        highlight: ['cuyo coche']
      },
      {
        spanish: '❌ Los estudiantes, que estudian mucho aprueban → ✅ Los estudiantes que estudian mucho aprueban',
        english: 'Wrong: restrictive clauses don\'t use commas',
        highlight: ['que estudian mucho']
      },
      {
        spanish: '❌ El lugar que voy → ✅ El lugar adonde voy',
        english: 'Wrong: use adonde for direction (where to)',
        highlight: ['adonde voy']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Interrogative Pronouns', url: '/grammar/spanish/pronouns/interrogative', difficulty: 'intermediate' },
  { title: 'Spanish Complex Sentences', url: '/grammar/spanish/syntax/complex-sentences', difficulty: 'advanced' },
  { title: 'Spanish Subjunctive in Relative Clauses', url: '/grammar/spanish/verbs/subjunctive-relative', difficulty: 'advanced' },
  { title: 'Spanish Word Order', url: '/grammar/spanish/syntax/word-order', difficulty: 'intermediate' }
];

export default function SpanishRelativePronounsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'pronouns',
              topic: 'relative',
              title: 'Spanish Relative Pronouns - Que, Quien, Cual, Cuyo',
              description: 'Master Spanish relative pronouns including que, quien, cual, cuyo, and donde with usage rules and examples.',
              difficulty: 'advanced',
              examples: [
                'El libro que leo es interesante. (The book that I read is interesting.)',
                'La persona con quien hablo es mi amiga. (The person with whom I speak is my friend.)',
                'El coche cuyo motor está roto. (The car whose engine is broken.)',
                'La ciudad donde vivo es grande. (The city where I live is big.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'pronouns',
              topic: 'relative',
              title: 'Spanish Relative Pronouns - Que, Quien, Cual, Cuyo'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="pronouns"
        topic="relative"
        title="Spanish Relative Pronouns - Que, Quien, Cual, Cuyo"
        description="Master Spanish relative pronouns including que, quien, cual, cuyo, and donde with usage rules and examples"
        difficulty="advanced"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/spanish/pronouns"
        practiceUrl="/grammar/spanish/pronouns/relative/practice"
        quizUrl="/grammar/spanish/pronouns/relative/quiz"
        songUrl="/songs/es?theme=grammar&topic=relative"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
