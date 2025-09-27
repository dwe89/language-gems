import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'pronouns',
  topic: 'personal',
  title: 'Spanish Personal Pronouns',
  description: 'Master Spanish personal pronouns: yo, tú, él, ella, nosotros, vosotros, ellos, ellas. Learn subject pronouns and their uses.',
  difficulty: 'beginner',
  keywords: [
    'spanish personal pronouns',
    'subject pronouns spanish',
    'yo tu el ella spanish',
    'spanish grammar pronouns',
    'pronombres personales español',
    'spanish subject pronouns'
  ],
  examples: [
    'yo hablo (I speak)',
    'tú comes (you eat)',
    'ella vive (she lives)'
  ]
});

const sections = [
  {
    title: 'Spanish Personal Pronouns Overview',
    content: `Spanish personal pronouns (also called **subject pronouns**) replace the names of people or things that perform actions. They tell us **who** is doing the action in a sentence.

**Key Features**:
- Replace nouns as the subject of sentences
- Often **optional** in Spanish (unlike English)
- Must match the verb conjugation
- Show person (1st, 2nd, 3rd) and number (singular, plural)

**Important**: Spanish verbs are conjugated differently for each pronoun, so the pronoun is often omitted when the meaning is clear.`,
    examples: [
      {
        spanish: 'Yo hablo español.',
        english: 'I speak Spanish.',
        highlight: ['Yo']
      },
      {
        spanish: 'Hablo español.',
        english: 'I speak Spanish. (pronoun omitted)',
        highlight: ['Hablo']
      },
      {
        spanish: 'Ella estudia medicina.',
        english: 'She studies medicine.',
        highlight: ['Ella']
      },
      {
        spanish: 'Estudia medicina.',
        english: 'She studies medicine. (pronoun omitted)',
        highlight: ['Estudia']
      }
    ]
  },
  {
    title: 'Complete List of Spanish Personal Pronouns',
    content: `Here are all the Spanish personal pronouns organized by person and number:`,
    subsections: [
      {
        title: 'Singular Personal Pronouns',
        content: `The singular forms refer to one person:`,
        conjugationTable: {
          title: 'Singular Personal Pronouns',
          conjugations: [
            { pronoun: 'yo', form: 'I', english: 'first person singular' },
            { pronoun: 'tú', form: 'you (informal)', english: 'second person singular' },
            { pronoun: 'usted', form: 'you (formal)', english: 'second person formal' },
            { pronoun: 'él', form: 'he', english: 'third person masculine' },
            { pronoun: 'ella', form: 'she', english: 'third person feminine' }
          ]
        },
        examples: [
          {
            spanish: 'Yo trabajo en una oficina.',
            english: 'I work in an office.',
            highlight: ['Yo']
          },
          {
            spanish: 'Tú vives en Madrid.',
            english: 'You live in Madrid. (informal)',
            highlight: ['Tú']
          },
          {
            spanish: 'Usted habla muy bien.',
            english: 'You speak very well. (formal)',
            highlight: ['Usted']
          },
          {
            spanish: 'Él es mi hermano.',
            english: 'He is my brother.',
            highlight: ['Él']
          },
          {
            spanish: 'Ella cocina delicioso.',
            english: 'She cooks deliciously.',
            highlight: ['Ella']
          }
        ]
      },
      {
        title: 'Plural Personal Pronouns',
        content: `The plural forms refer to more than one person:`,
        conjugationTable: {
          title: 'Plural Personal Pronouns',
          conjugations: [
            { pronoun: 'nosotros/nosotras', form: 'we', english: 'first person plural' },
            { pronoun: 'vosotros/vosotras', form: 'you all (informal)', english: 'second person plural (Spain)' },
            { pronoun: 'ustedes', form: 'you all', english: 'second person plural (formal/Latin America)' },
            { pronoun: 'ellos', form: 'they (masculine/mixed)', english: 'third person masculine plural' },
            { pronoun: 'ellas', form: 'they (feminine)', english: 'third person feminine plural' }
          ]
        },
        examples: [
          {
            spanish: 'Nosotros estudiamos juntos.',
            english: 'We study together.',
            highlight: ['Nosotros']
          },
          {
            spanish: 'Vosotros sois de España.',
            english: 'You all are from Spain. (informal, Spain)',
            highlight: ['Vosotros']
          },
          {
            spanish: 'Ustedes trabajan mucho.',
            english: 'You all work a lot.',
            highlight: ['Ustedes']
          },
          {
            spanish: 'Ellos juegan fútbol.',
            english: 'They play soccer. (masculine/mixed group)',
            highlight: ['Ellos']
          },
          {
            spanish: 'Ellas son profesoras.',
            english: 'They are teachers. (all women)',
            highlight: ['Ellas']
          }
        ]
      }
    ]
  },
  {
    title: 'Gender in Personal Pronouns',
    content: `Some Spanish personal pronouns change based on gender:`,
    subsections: [
      {
        title: 'Nosotros vs. Nosotras (We)',
        content: `**Nosotros**: Used for all-male groups or mixed groups
**Nosotras**: Used only for all-female groups`,
        examples: [
          {
            spanish: 'Nosotros somos estudiantes.',
            english: 'We are students. (all men or mixed group)',
            highlight: ['Nosotros']
          },
          {
            spanish: 'Nosotras somos estudiantes.',
            english: 'We are students. (all women)',
            highlight: ['Nosotras']
          },
          {
            spanish: 'Juan, María y yo → Nosotros',
            english: 'Juan, María and I → We (mixed, so masculine)',
            highlight: ['Nosotros']
          },
          {
            spanish: 'Ana, Carmen y yo → Nosotras',
            english: 'Ana, Carmen and I → We (all women)',
            highlight: ['Nosotras']
          }
        ]
      },
      {
        title: 'Vosotros vs. Vosotras (You All - Spain)',
        content: `**Vosotros**: Used for all-male groups or mixed groups (Spain only)
**Vosotras**: Used only for all-female groups (Spain only)

**Note**: In Latin America, "ustedes" is used instead of vosotros/vosotras.`,
        examples: [
          {
            spanish: 'Vosotros tenéis razón.',
            english: 'You all are right. (all men or mixed group, Spain)',
            highlight: ['Vosotros']
          },
          {
            spanish: 'Vosotras sois muy inteligentes.',
            english: 'You all are very intelligent. (all women, Spain)',
            highlight: ['Vosotras']
          },
          {
            spanish: 'Ustedes tienen razón.',
            english: 'You all are right. (Latin America - no gender distinction)',
            highlight: ['Ustedes']
          }
        ]
      },
      {
        title: 'Ellos vs. Ellas (They)',
        content: `**Ellos**: Used for all-male groups or mixed groups
**Ellas**: Used only for all-female groups`,
        examples: [
          {
            spanish: 'Ellos trabajan en el hospital.',
            english: 'They work in the hospital. (all men or mixed group)',
            highlight: ['Ellos']
          },
          {
            spanish: 'Ellas son doctoras.',
            english: 'They are doctors. (all women)',
            highlight: ['Ellas']
          },
          {
            spanish: 'Pedro y Ana → Ellos',
            english: 'Pedro and Ana → They (mixed, so masculine)',
            highlight: ['Ellos']
          },
          {
            spanish: 'María y Carmen → Ellas',
            english: 'María and Carmen → They (all women)',
            highlight: ['Ellas']
          }
        ]
      }
    ]
  },
  {
    title: 'Formal vs. Informal "You"',
    content: `Spanish has different forms for "you" depending on the level of formality and region:`,
    subsections: [
      {
        title: 'Tú vs. Usted (Singular You)',
        content: `**Tú**: Informal "you" - used with friends, family, children, peers
**Usted**: Formal "you" - used with strangers, elders, authority figures

**Important**: Usted uses third-person verb forms (like él/ella).`,
        examples: [
          {
            spanish: 'Tú eres mi amigo.',
            english: 'You are my friend. (informal)',
            highlight: ['Tú', 'eres']
          },
          {
            spanish: 'Usted es muy amable.',
            english: 'You are very kind. (formal)',
            highlight: ['Usted', 'es']
          },
          {
            spanish: '¿Cómo estás tú?',
            english: 'How are you? (informal)',
            highlight: ['estás', 'tú']
          },
          {
            spanish: '¿Cómo está usted?',
            english: 'How are you? (formal)',
            highlight: ['está', 'usted']
          }
        ]
      },
      {
        title: 'Vosotros vs. Ustedes (Plural You)',
        content: `**Vosotros/Vosotras**: Informal "you all" - used only in Spain
**Ustedes**: Formal "you all" in Spain, all "you all" in Latin America

**Regional Difference**: Latin America doesn't use vosotros at all.`,
        examples: [
          {
            spanish: 'Vosotros sois fantásticos.',
            english: 'You all are fantastic. (informal, Spain only)',
            highlight: ['Vosotros', 'sois']
          },
          {
            spanish: 'Ustedes son fantásticos.',
            english: 'You all are fantastic. (formal Spain / all Latin America)',
            highlight: ['Ustedes', 'son']
          },
          {
            spanish: '¿Qué hacéis vosotros?',
            english: 'What are you all doing? (informal, Spain)',
            highlight: ['hacéis', 'vosotros']
          },
          {
            spanish: '¿Qué hacen ustedes?',
            english: 'What are you all doing? (formal Spain / all Latin America)',
            highlight: ['hacen', 'ustedes']
          }
        ]
      }
    ]
  },
  {
    title: 'When to Use Personal Pronouns',
    content: `In Spanish, personal pronouns are often **optional** because the verb ending shows who is doing the action. However, there are specific times when you should use them:`,
    subsections: [
      {
        title: 'When Pronouns Are Required',
        content: `Use personal pronouns in these situations:

**1. For emphasis or contrast**
**2. To avoid confusion**  
**3. After certain words (también, tampoco, etc.)**
**4. In incomplete sentences**`,
        examples: [
          {
            spanish: 'Yo trabajo, pero él no trabaja.',
            english: 'I work, but he doesn\'t work. (contrast)',
            highlight: ['Yo', 'él']
          },
          {
            spanish: 'Ella habla inglés y ella habla francés.',
            english: 'She speaks English and she speaks French. (clarity)',
            highlight: ['Ella', 'ella']
          },
          {
            spanish: 'Yo también estudio español.',
            english: 'I also study Spanish. (after también)',
            highlight: ['Yo']
          },
          {
            spanish: '¿Quién viene? Yo.',
            english: 'Who\'s coming? Me. (incomplete sentence)',
            highlight: ['Yo']
          }
        ]
      },
      {
        title: 'When Pronouns Are Optional',
        content: `You can omit pronouns when the meaning is clear from context:`,
        examples: [
          {
            spanish: '(Yo) Hablo español.',
            english: 'I speak Spanish. (hablo clearly indicates "I")',
            highlight: ['Hablo']
          },
          {
            spanish: '(Nosotros) Vivimos en México.',
            english: 'We live in Mexico. (vivimos clearly indicates "we")',
            highlight: ['Vivimos']
          },
          {
            spanish: '(Tú) Estudias mucho.',
            english: 'You study a lot. (estudias clearly indicates "you")',
            highlight: ['Estudias']
          },
          {
            spanish: '(Ellos) Trabajan juntos.',
            english: 'They work together. (trabajan clearly indicates "they")',
            highlight: ['Trabajan']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Personal Pronoun Mistakes',
    content: `Here are common mistakes Spanish learners make with personal pronouns:

**Mistake 1**: Overusing pronouns when not needed
**Mistake 2**: Using wrong formality level (tú vs. usted)
**Mistake 3**: Incorrect gender agreement (nosotros vs. nosotras)
**Mistake 4**: Confusing usted verb forms

Learning to avoid these mistakes will make your Spanish sound more natural.`,
    examples: [
      {
        spanish: '❌ Yo hablo, yo como, yo trabajo → ✅ Hablo, como, trabajo',
        english: 'Wrong: I speak, I eat, I work → Right: (I) speak, (I) eat, (I) work',
        highlight: ['Yo hablo, yo como, yo trabajo', 'Hablo, como, trabajo']
      },
      {
        spanish: '❌ Tú es muy amable → ✅ Tú eres muy amable / Usted es muy amable',
        english: 'Wrong: You is very kind → Right: You are very kind (informal/formal)',
        highlight: ['Tú es', 'Tú eres', 'Usted es']
      },
      {
        spanish: '❌ Ana, María y yo → Nosotros → ✅ Ana, María y yo → Nosotras',
        english: 'Wrong: Ana, María and I → We (masc.) → Right: Ana, María and I → We (fem.)',
        highlight: ['Nosotros', 'Nosotras']
      },
      {
        spanish: '❌ Usted tienes → ✅ Usted tiene',
        english: 'Wrong: You (formal) have → Right: You (formal) have',
        highlight: ['tienes', 'tiene']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'Spanish Possessive Pronouns',
    url: '/grammar/spanish/pronouns/possessive',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Present Tense',
    url: '/grammar/spanish/verbs/present-tense',
    difficulty: 'beginner'
  },
  {
    title: 'Direct Object Pronouns',
    url: '/grammar/spanish/pronouns/direct-object',
    difficulty: 'intermediate'
  },
  {
    title: 'Spanish Verb Conjugation',
    url: '/grammar/spanish/verbs',
    difficulty: 'beginner'
  }
];

export default function SpanishPersonalPronounsPage() {
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
              topic: 'personal',
              title: 'Spanish Personal Pronouns',
              description: 'Master Spanish personal pronouns: yo, tú, él, ella, nosotros, vosotros, ellos, ellas. Learn subject pronouns and their uses.',
              difficulty: 'beginner',
              examples: [
                'yo hablo (I speak)',
                'tú comes (you eat)',
                'ella vive (she lives)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'pronouns',
              topic: 'personal',
              title: 'Spanish Personal Pronouns'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="pronouns"
        topic="personal"
        title="Spanish Personal Pronouns"
        description="Master Spanish personal pronouns: yo, tú, él, ella, nosotros, vosotros, ellos, ellas. Learn subject pronouns and their uses"
        difficulty="beginner"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/spanish/pronouns"
        practiceUrl="/grammar/spanish/pronouns/personal/practice"
        quizUrl="/grammar/spanish/pronouns/personal/quiz"
        songUrl="/songs/es?theme=grammar&topic=personal-pronouns"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
