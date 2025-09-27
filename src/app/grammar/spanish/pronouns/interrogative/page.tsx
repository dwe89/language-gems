import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'pronouns',
  topic: 'interrogative',
  title: 'Spanish Interrogative Pronouns - Qué, Quién, Cuál, Dónde',
  description: 'Master Spanish interrogative pronouns including qué, quién, cuál, dónde, cuándo, cómo, and por qué with usage rules.',
  difficulty: 'intermediate',
  keywords: [
    'spanish interrogative pronouns',
    'que quien cual spanish',
    'spanish question words',
    'donde cuando como spanish',
    'spanish wh questions'
  ],
  examples: [
    '¿Qué quieres? (What do you want?)',
    '¿Quién es él? (Who is he?)',
    '¿Cuál prefieres? (Which one do you prefer?)',
    '¿Dónde vives? (Where do you live?)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Interrogative Pronouns',
    content: `Spanish **interrogative pronouns** (pronombres interrogativos) are used to **ask questions** about people, things, places, time, and manner. They **always carry written accents** in questions and exclamations.

**Main interrogative pronouns:**
- **qué** (what)
- **quién/quiénes** (who)
- **cuál/cuáles** (which, what)
- **dónde** (where)
- **cuándo** (when)
- **cómo** (how)
- **por qué** (why)
- **cuánto/a/os/as** (how much/many)

**Key features:**
- **Written accents**: Always accented in questions/exclamations
- **Word order**: Often trigger inversion
- **Direct/Indirect**: Used in both direct and indirect questions
- **Gender/Number**: Some agree with their referent

**Why interrogative pronouns matter:**
- **Essential questions**: Form all types of questions
- **Natural communication**: Required for conversations
- **Information gathering**: Get specific details
- **Advanced grammar**: Complex question structures

Understanding interrogative pronouns is **crucial** for **interactive Spanish communication**.`,
    examples: [
      {
        spanish: 'DIRECT: ¿Qué estudias? (What do you study?)',
        english: 'INDIRECT: No sé qué estudias. (I don\'t know what you study.)',
        highlight: ['¿Qué estudias?', 'qué estudias']
      },
      {
        spanish: 'PERSON: ¿Quién viene? (Who is coming?)',
        english: 'THING: ¿Cuál quieres? (Which one do you want?)',
        highlight: ['¿Quién viene?', '¿Cuál quieres?']
      }
    ]
  },
  {
    title: 'Qué (What)',
    content: `**Qué** asks about **things, actions, or definitions**:`,
    conjugationTable: {
      title: 'Uses of Qué',
      conjugations: [
        { pronoun: 'What (thing)', form: '¿Qué es esto?', english: 'What is this?' },
        { pronoun: 'What (action)', form: '¿Qué haces?', english: 'What are you doing?' },
        { pronoun: 'What (definition)', form: '¿Qué significa?', english: 'What does it mean?' },
        { pronoun: 'What + noun', form: '¿Qué libro lees?', english: 'What book are you reading?' }
      ]
    },
    examples: [
      {
        spanish: 'THING: ¿Qué quieres? (What do you want?)',
        english: 'ACTION: ¿Qué está pasando? (What is happening?)',
        highlight: ['¿Qué quieres?', '¿Qué está pasando?']
      },
      {
        spanish: 'WITH NOUN: ¿Qué color prefieres? (What color do you prefer?)',
        english: 'DEFINITION: ¿Qué es la democracia? (What is democracy?)',
        highlight: ['¿Qué color', '¿Qué es']
      }
    ]
  },
  {
    title: 'Quién/Quiénes (Who)',
    content: `**Quién** asks about **people** (singular/plural):`,
    conjugationTable: {
      title: 'Forms of Quién',
      conjugations: [
        { pronoun: 'quién', form: 'who (singular)', english: '¿Quién es? (Who is it?)' },
        { pronoun: 'quiénes', form: 'who (plural)', english: '¿Quiénes son? (Who are they?)' },
        { pronoun: 'a quién', form: 'whom (direct object)', english: '¿A quién ves? (Whom do you see?)' },
        { pronoun: 'de quién', form: 'whose', english: '¿De quién es? (Whose is it?)' }
      ]
    },
    examples: [
      {
        spanish: 'SUBJECT: ¿Quién habla? (Who is speaking?)',
        english: 'PLURAL: ¿Quiénes vienen? (Who are coming?)',
        highlight: ['¿Quién habla?', '¿Quiénes vienen?']
      },
      {
        spanish: 'DIRECT OBJECT: ¿A quién buscas? (Whom are you looking for?)',
        english: 'POSSESSION: ¿De quién es este libro? (Whose book is this?)',
        highlight: ['¿A quién buscas?', '¿De quién es']
      }
    ]
  },
  {
    title: 'Cuál/Cuáles (Which, What)',
    content: `**Cuál** asks for **selection from options**:`,
    conjugationTable: {
      title: 'Uses of Cuál',
      conjugations: [
        { pronoun: 'cuál', form: 'which one (singular)', english: '¿Cuál prefieres? (Which one do you prefer?)' },
        { pronoun: 'cuáles', form: 'which ones (plural)', english: '¿Cuáles quieres? (Which ones do you want?)' },
        { pronoun: 'cuál + ser', form: 'what is (specific)', english: '¿Cuál es tu nombre? (What is your name?)' },
        { pronoun: 'cuál de', form: 'which of', english: '¿Cuál de estos? (Which of these?)' }
      ]
    },
    examples: [
      {
        spanish: 'SELECTION: ¿Cuál te gusta más? (Which one do you like more?)',
        english: 'PLURAL: ¿Cuáles son tus favoritos? (Which ones are your favorites?)',
        highlight: ['¿Cuál te gusta', '¿Cuáles son']
      },
      {
        spanish: 'SPECIFIC INFO: ¿Cuál es tu dirección? (What is your address?)',
        english: 'FROM GROUP: ¿Cuál de los dos? (Which of the two?)',
        highlight: ['¿Cuál es', '¿Cuál de los dos']
      }
    ]
  },
  {
    title: 'Qué vs Cuál',
    content: `**Important distinction** between qué and cuál:`,
    conjugationTable: {
      title: 'Qué vs Cuál Usage',
      conjugations: [
        { pronoun: 'qué + noun', form: 'what + noun', english: '¿Qué libro? (What book?)' },
        { pronoun: 'cuál + no noun', form: 'which one', english: '¿Cuál? (Which one?)' },
        { pronoun: 'qué + ser (definition)', form: 'what is', english: '¿Qué es esto? (What is this?)' },
        { pronoun: 'cuál + ser (specific)', form: 'what is', english: '¿Cuál es tu nombre? (What is your name?)' }
      ]
    },
    examples: [
      {
        spanish: 'QUÉ + NOUN: ¿Qué coche tienes? (What car do you have?)',
        english: 'CUÁL ALONE: ¿Cuál tienes? (Which one do you have?)',
        highlight: ['¿Qué coche', '¿Cuál tienes']
      },
      {
        spanish: 'QUÉ (definition): ¿Qué es un médico? (What is a doctor?)',
        english: 'CUÁL (specific): ¿Cuál es tu médico? (Who is your doctor?)',
        highlight: ['¿Qué es', '¿Cuál es']
      }
    ]
  },
  {
    title: 'Dónde (Where)',
    content: `**Dónde** asks about **location and direction**:`,
    conjugationTable: {
      title: 'Forms with Dónde',
      conjugations: [
        { pronoun: 'dónde', form: 'where (location)', english: '¿Dónde vives? (Where do you live?)' },
        { pronoun: 'adónde', form: 'where to (direction)', english: '¿Adónde vas? (Where are you going?)' },
        { pronoun: 'de dónde', form: 'where from', english: '¿De dónde eres? (Where are you from?)' },
        { pronoun: 'por dónde', form: 'which way', english: '¿Por dónde pasamos? (Which way do we go?)' }
      ]
    },
    examples: [
      {
        spanish: 'LOCATION: ¿Dónde está el banco? (Where is the bank?)',
        english: 'DIRECTION: ¿Adónde vamos? (Where are we going?)',
        highlight: ['¿Dónde está', '¿Adónde vamos']
      },
      {
        spanish: 'ORIGIN: ¿De dónde vienes? (Where do you come from?)',
        english: 'ROUTE: ¿Por dónde llegaste? (Which way did you arrive?)',
        highlight: ['¿De dónde vienes', '¿Por dónde llegaste']
      }
    ]
  },
  {
    title: 'Cuándo (When) and Cómo (How)',
    content: `**Cuándo** asks about **time**, **cómo** asks about **manner**:`,
    conjugationTable: {
      title: 'Time and Manner Questions',
      conjugations: [
        { pronoun: 'cuándo', form: 'when', english: '¿Cuándo llegas? (When do you arrive?)' },
        { pronoun: 'desde cuándo', form: 'since when', english: '¿Desde cuándo vives aquí? (Since when do you live here?)' },
        { pronoun: 'cómo', form: 'how (manner)', english: '¿Cómo lo haces? (How do you do it?)' },
        { pronoun: 'cómo + ser/estar', form: 'what...like', english: '¿Cómo es? (What is he/she like?)' }
      ]
    },
    examples: [
      {
        spanish: 'TIME: ¿Cuándo es tu cumpleaños? (When is your birthday?)',
        english: 'MANNER: ¿Cómo vienes al trabajo? (How do you come to work?)',
        highlight: ['¿Cuándo es', '¿Cómo vienes']
      },
      {
        spanish: 'DESCRIPTION: ¿Cómo está tu madre? (How is your mother?)',
        english: 'DURATION: ¿Desde cuándo estudias español? (Since when do you study Spanish?)',
        highlight: ['¿Cómo está', '¿Desde cuándo']
      }
    ]
  },
  {
    title: 'Por qué (Why) and Cuánto (How much/many)',
    content: `**Por qué** asks for **reasons**, **cuánto** asks for **quantity**:`,
    conjugationTable: {
      title: 'Reason and Quantity Questions',
      conjugations: [
        { pronoun: 'por qué', form: 'why', english: '¿Por qué estudias? (Why do you study?)' },
        { pronoun: 'para qué', form: 'what for', english: '¿Para qué sirve? (What is it for?)' },
        { pronoun: 'cuánto/a', form: 'how much', english: '¿Cuánto cuesta? (How much does it cost?)' },
        { pronoun: 'cuántos/as', form: 'how many', english: '¿Cuántos años tienes? (How old are you?)' }
      ]
    },
    examples: [
      {
        spanish: 'REASON: ¿Por qué no vienes? (Why don\'t you come?)',
        english: 'PURPOSE: ¿Para qué lo necesitas? (What do you need it for?)',
        highlight: ['¿Por qué no', '¿Para qué']
      },
      {
        spanish: 'QUANTITY: ¿Cuánto dinero tienes? (How much money do you have?)',
        english: 'NUMBER: ¿Cuántas hermanas tienes? (How many sisters do you have?)',
        highlight: ['¿Cuánto dinero', '¿Cuántas hermanas']
      }
    ]
  },
  {
    title: 'Indirect Questions',
    content: `**Interrogative pronouns** in **indirect questions** (still accented):`,
    examples: [
      {
        spanish: 'INDIRECT: No sé qué quiere. (I don\'t know what he wants.)',
        english: 'DIRECT: ¿Qué quiere? (What does he want?)',
        highlight: ['qué quiere', '¿Qué quiere?']
      },
      {
        spanish: 'INDIRECT: Dime dónde vives. (Tell me where you live.)',
        english: 'INDIRECT: Pregunta cuándo viene. (Ask when he\'s coming.)',
        highlight: ['dónde vives', 'cuándo viene']
      },
      {
        spanish: 'INDIRECT: No entiendo por qué lo hace. (I don\'t understand why he does it.)',
        english: 'INDIRECT: Explícame cómo funciona. (Explain to me how it works.)',
        highlight: ['por qué lo hace', 'cómo funciona']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Missing accents**: Forgetting written accents in questions
**2. Qué vs cuál**: Wrong choice between qué and cuál
**3. Word order**: Incorrect question word order
**4. Prepositions**: Wrong prepositions with interrogatives`,
    examples: [
      {
        spanish: '❌ Que quieres? → ✅ ¿Qué quieres?',
        english: 'Wrong: must have written accent in questions',
        highlight: ['¿Qué quieres?']
      },
      {
        spanish: '❌ ¿Cuál libro? → ✅ ¿Qué libro?',
        english: 'Wrong: use qué before nouns',
        highlight: ['¿Qué libro?']
      },
      {
        spanish: '❌ ¿Qué es tu nombre? → ✅ ¿Cuál es tu nombre?',
        english: 'Wrong: use cuál for specific information',
        highlight: ['¿Cuál es tu nombre?']
      },
      {
        spanish: '❌ ¿Dónde vas? → ✅ ¿Adónde vas?',
        english: 'Wrong: use adónde for direction (where to)',
        highlight: ['¿Adónde vas?']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Question Formation', url: '/grammar/spanish/verbs/interrogatives', difficulty: 'beginner' },
  { title: 'Spanish Relative Pronouns', url: '/grammar/spanish/pronouns/relative', difficulty: 'advanced' },
  { title: 'Spanish Word Order', url: '/grammar/spanish/syntax/word-order', difficulty: 'intermediate' },
  { title: 'Spanish Direct Object Pronouns', url: '/grammar/spanish/pronouns/direct-object', difficulty: 'intermediate' }
];

export default function SpanishInterrogativePronounsPage() {
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
              topic: 'interrogative',
              title: 'Spanish Interrogative Pronouns - Qué, Quién, Cuál, Dónde',
              description: 'Master Spanish interrogative pronouns including qué, quién, cuál, dónde, cuándo, cómo, and por qué with usage rules.',
              difficulty: 'intermediate',
              examples: [
                '¿Qué quieres? (What do you want?)',
                '¿Quién es él? (Who is he?)',
                '¿Cuál prefieres? (Which one do you prefer?)',
                '¿Dónde vives? (Where do you live?)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'pronouns',
              topic: 'interrogative',
              title: 'Spanish Interrogative Pronouns - Qué, Quién, Cuál, Dónde'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="pronouns"
        topic="interrogative"
        title="Spanish Interrogative Pronouns - Qué, Quién, Cuál, Dónde"
        description="Master Spanish interrogative pronouns including qué, quién, cuál, dónde, cuándo, cómo, and por qué with usage rules"
        difficulty="intermediate"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/spanish/pronouns"
        practiceUrl="/grammar/spanish/pronouns/interrogative/practice"
        quizUrl="/grammar/spanish/pronouns/interrogative/quiz"
        songUrl="/songs/es?theme=grammar&topic=interrogative"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
