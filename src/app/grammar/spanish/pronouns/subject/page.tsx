import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'pronouns',
  topic: 'subject',
  title: 'Spanish Subject Pronouns - Yo, Tú, Él, Ella, Nosotros',
  description: 'Master Spanish subject pronouns including usage rules, when to omit them, and formal vs informal distinctions.',
  difficulty: 'beginner',
  keywords: [
    'spanish subject pronouns',
    'yo tu el ella spanish',
    'spanish personal pronouns',
    'usted vs tu spanish',
    'spanish pronoun usage'
  ],
  examples: [
    'Yo hablo español. (I speak Spanish.)',
    'Tú eres mi amigo. (You are my friend.)',
    '¿Usted habla inglés? (Do you speak English?)',
    'Nosotros vivimos aquí. (We live here.)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Subject Pronouns',
    content: `Spanish **subject pronouns** (pronombres personales de sujeto) replace the **subject** of a sentence. Unlike English, Spanish subject pronouns are **often omitted** because the verb ending indicates the subject.

**Complete set of subject pronouns:**
- **yo** (I)
- **tú** (you - informal)
- **él/ella/usted** (he/she/you - formal)
- **nosotros/nosotras** (we)
- **vosotros/vosotras** (you all - Spain)
- **ellos/ellas/ustedes** (they/you all)

**Key features:**
- **Optional usage**: Often omitted in Spanish
- **Emphasis**: Used for emphasis or clarity
- **Formality levels**: Tú (informal) vs usted (formal)
- **Gender distinction**: Nosotros/nosotras, ellos/ellas

**Why subject pronouns matter:**
- **Emphasis and contrast**: Highlight the subject
- **Clarity**: Avoid ambiguity when needed
- **Politeness**: Formal vs informal address
- **Regional variation**: Different usage patterns

Understanding when to use or omit subject pronouns is **essential** for **natural Spanish**.`,
    examples: [
      {
        spanish: 'WITH PRONOUN: Yo hablo español. (I speak Spanish.)',
        english: 'WITHOUT PRONOUN: Hablo español. (I speak Spanish.)',
        highlight: ['Yo hablo', 'Hablo']
      },
      {
        spanish: 'EMPHASIS: Yo trabajo, tú estudias. (I work, you study.)',
        english: 'NORMAL: Trabajo y estudias. (I work and you study.)',
        highlight: ['Yo trabajo, tú estudias']
      }
    ]
  },
  {
    title: 'Complete Subject Pronoun System',
    content: `**All Spanish subject pronouns** with their English equivalents:`,
    conjugationTable: {
      title: 'Subject Pronouns',
      conjugations: [
        { pronoun: 'yo', form: 'I', english: 'Yo soy estudiante. (I am a student.)' },
        { pronoun: 'tú', form: 'you (informal)', english: 'Tú eres inteligente. (You are intelligent.)' },
        { pronoun: 'él', form: 'he', english: 'Él trabaja aquí. (He works here.)' },
        { pronoun: 'ella', form: 'she', english: 'Ella vive en Madrid. (She lives in Madrid.)' },
        { pronoun: 'usted', form: 'you (formal)', english: 'Usted habla bien. (You speak well.)' },
        { pronoun: 'nosotros/as', form: 'we', english: 'Nosotros estudiamos. (We study.)' },
        { pronoun: 'vosotros/as', form: 'you all (Spain)', english: 'Vosotros coméis. (You all eat.)' },
        { pronoun: 'ellos/as', form: 'they', english: 'Ellos trabajan. (They work.)' },
        { pronoun: 'ustedes', form: 'you all', english: 'Ustedes viven aquí. (You all live here.)' }
      ]
    },
    examples: [
      {
        spanish: 'SINGULAR: Yo, tú, él, ella, usted',
        english: 'PLURAL: Nosotros, vosotros, ellos, ellas, ustedes',
        highlight: ['Yo, tú, él', 'Nosotros, vosotros']
      }
    ]
  },
  {
    title: 'When to Use Subject Pronouns',
    content: `**Use subject pronouns** in these specific situations:`,
    examples: [
      {
        spanish: 'EMPHASIS: Yo trabajo, tú descansas. (I work, you rest.)',
        english: 'CONTRAST: Él estudia medicina, ella estudia arte. (He studies medicine, she studies art.)',
        highlight: ['Yo trabajo, tú descansas', 'Él estudia, ella estudia']
      },
      {
        spanish: 'CLARITY: Usted habla muy bien. (You speak very well.)',
        english: 'AFTER PREPOSITIONS: Es para él. (It\'s for him.)',
        highlight: ['Usted habla', 'para él']
      },
      {
        spanish: 'QUESTIONS: ¿Tú vienes? (Are you coming?)',
        english: 'COMPOUND SUBJECTS: María y yo vamos. (María and I go.)',
        highlight: ['¿Tú vienes?', 'María y yo']
      }
    ]
  },
  {
    title: 'When to Omit Subject Pronouns',
    content: `**Omit subject pronouns** when the context is clear:`,
    examples: [
      {
        spanish: 'CLEAR CONTEXT: Hablo español. (I speak Spanish.)',
        english: 'CONTINUOUS SUBJECT: Trabajo en una oficina y vivo cerca. (I work in an office and live nearby.)',
        highlight: ['Hablo español', 'Trabajo y vivo']
      },
      {
        spanish: 'QUESTIONS: ¿Hablas inglés? (Do you speak English?)',
        english: 'COMMANDS: ¡Ven aquí! (Come here!)',
        highlight: ['¿Hablas inglés?', '¡Ven aquí!']
      }
    ]
  },
  {
    title: 'Formal vs Informal Address',
    content: `**Formality levels** in Spanish address:`,
    conjugationTable: {
      title: 'Formality Levels',
      conjugations: [
        { pronoun: 'tú', form: 'Informal singular', english: 'Friends, family, peers' },
        { pronoun: 'usted', form: 'Formal singular', english: 'Strangers, elders, authority' },
        { pronoun: 'vosotros', form: 'Informal plural (Spain)', english: 'Friends, family group' },
        { pronoun: 'ustedes', form: 'Formal/general plural', english: 'Any group (Latin America: all)' }
      ]
    },
    examples: [
      {
        spanish: 'INFORMAL: ¿Tú cómo estás? (How are you?)',
        english: 'FORMAL: ¿Usted cómo está? (How are you?)',
        highlight: ['Tú cómo estás', 'Usted cómo está']
      },
      {
        spanish: 'SPAIN INFORMAL: ¿Vosotros venís? (Are you all coming?)',
        english: 'LATIN AMERICA: ¿Ustedes vienen? (Are you all coming?)',
        highlight: ['Vosotros venís', 'Ustedes vienen']
      }
    ]
  },
  {
    title: 'Gender Distinctions',
    content: `**Gender forms** for plural pronouns:`,
    conjugationTable: {
      title: 'Gender Forms',
      conjugations: [
        { pronoun: 'nosotros', form: 'we (masculine/mixed)', english: 'All male or mixed group' },
        { pronoun: 'nosotras', form: 'we (feminine)', english: 'All female group' },
        { pronoun: 'vosotros', form: 'you all (masc/mixed)', english: 'All male or mixed group' },
        { pronoun: 'vosotras', form: 'you all (feminine)', english: 'All female group' },
        { pronoun: 'ellos', form: 'they (masculine/mixed)', english: 'All male or mixed group' },
        { pronoun: 'ellas', form: 'they (feminine)', english: 'All female group' }
      ]
    },
    examples: [
      {
        spanish: 'MIXED GROUP: Nosotros (Juan y María) vamos. (We are going.)',
        english: 'ALL FEMALE: Nosotras (Ana y Carmen) vamos. (We are going.)',
        highlight: ['Nosotros vamos', 'Nosotras vamos']
      }
    ]
  },
  {
    title: 'Regional Variations',
    content: `**Different usage** across Spanish-speaking regions:`,
    conjugationTable: {
      title: 'Regional Usage',
      conjugations: [
        { pronoun: 'Spain', form: 'tú/vosotros vs usted/ustedes', english: 'Clear informal/formal distinction' },
        { pronoun: 'Latin America', form: 'tú vs usted/ustedes', english: 'No vosotros; ustedes for all plural' },
        { pronoun: 'Argentina', form: 'vos instead of tú', english: 'Vos tenés (You have)' },
        { pronoun: 'Colombia', form: 'Mixed vos/tú usage', english: 'Regional variation within country' }
      ]
    },
    examples: [
      {
        spanish: 'SPAIN: Vosotros tenéis razón. (You all are right.)',
        english: 'LATIN AMERICA: Ustedes tienen razón. (You all are right.)',
        highlight: ['Vosotros tenéis', 'Ustedes tienen']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Overusing pronouns**: Using them when unnecessary
**2. Wrong formality**: Mixing tú/usted inappropriately
**3. Gender errors**: Wrong gender for plural pronouns
**4. Regional confusion**: Using vosotros in Latin America`,
    examples: [
      {
        spanish: '❌ Yo trabajo y yo vivo → ✅ Trabajo y vivo',
        english: 'Wrong: unnecessary repetition of yo',
        highlight: ['Trabajo y vivo']
      },
      {
        spanish: '❌ ¿Tú puede ayudarme? → ✅ ¿Usted puede ayudarme?',
        english: 'Wrong: use formal with strangers',
        highlight: ['¿Usted puede']
      },
      {
        spanish: '❌ Nosotros (all women) → ✅ Nosotras',
        english: 'Wrong: use feminine form for all-female groups',
        highlight: ['Nosotras']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Direct Object Pronouns', url: '/grammar/spanish/pronouns/direct-object', difficulty: 'intermediate' },
  { title: 'Spanish Indirect Object Pronouns', url: '/grammar/spanish/pronouns/indirect-object', difficulty: 'intermediate' },
  { title: 'Spanish Present Tense', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' },
  { title: 'Spanish Formal vs Informal', url: '/grammar/spanish/verbs/imperative', difficulty: 'intermediate' }
];

export default function SpanishSubjectPronounsPage() {
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
              topic: 'subject',
              title: 'Spanish Subject Pronouns - Yo, Tú, Él, Ella, Nosotros',
              description: 'Master Spanish subject pronouns including usage rules, when to omit them, and formal vs informal distinctions.',
              difficulty: 'beginner',
              examples: [
                'Yo hablo español. (I speak Spanish.)',
                'Tú eres mi amigo. (You are my friend.)',
                '¿Usted habla inglés? (Do you speak English?)',
                'Nosotros vivimos aquí. (We live here.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'pronouns',
              topic: 'subject',
              title: 'Spanish Subject Pronouns - Yo, Tú, Él, Ella, Nosotros'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="pronouns"
        topic="subject"
        title="Spanish Subject Pronouns - Yo, Tú, Él, Ella, Nosotros"
        description="Master Spanish subject pronouns including usage rules, when to omit them, and formal vs informal distinctions"
        difficulty="beginner"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/spanish/pronouns"
        practiceUrl="/grammar/spanish/pronouns/subject/practice"
        quizUrl="/grammar/spanish/pronouns/subject/quiz"
        songUrl="/songs/es?theme=grammar&topic=subject-pronouns"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
