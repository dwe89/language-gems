import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'pronouns',
  topic: 'subject-pronouns',
  title: 'Spanish Subject Pronouns (Personal Pronouns, Usage, Omission)',
  description: 'Master Spanish subject pronouns including yo, tú, él/ella, nosotros, vosotros, ellos/ellas, usage rules, and when to omit them.',
  difficulty: 'beginner',
  keywords: [
    'spanish subject pronouns',
    'personal pronouns spanish',
    'yo tu el ella spanish',
    'nosotros vosotros spanish',
    'pronoun omission spanish',
    'spanish pronoun usage'
  ],
  examples: [
    'Yo hablo español. (I speak Spanish.)',
    'Tú eres inteligente. (You are intelligent.)',
    'Él vive en Madrid. (He lives in Madrid.)',
    'Nosotros estudiamos juntos. (We study together.)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Subject Pronouns',
    content: `Spanish subject pronouns (pronombres personales sujeto) **replace nouns** as the **subject** of sentences. Unlike English, Spanish subject pronouns are **often omitted** because verb endings indicate the subject.

**Spanish subject pronouns:**
- **yo** (I) - first person singular
- **tú** (you - informal) - second person singular
- **él/ella/usted** (he/she/you formal) - third person singular
- **nosotros/nosotras** (we) - first person plural
- **vosotros/vosotras** (you all - Spain) - second person plural
- **ellos/ellas/ustedes** (they/you all) - third person plural

**Key characteristics:**
- **Often omitted**: Verb endings show the subject
- **Used for emphasis**: When you want to stress who does the action
- **Used for clarity**: When the subject might be ambiguous
- **Regional differences**: Vosotros used in Spain, ustedes in Latin America
- **Gender distinction**: Nosotros/nosotras, vosotros/vosotras, ellos/ellas

Understanding when to **use** and when to **omit** subject pronouns is crucial for **natural Spanish communication**.`,
    examples: [
      {
        spanish: 'Hablo español. (I speak Spanish.) - Pronoun omitted',
        english: 'Yo hablo español. (I speak Spanish.) - Pronoun for emphasis',
        highlight: ['Hablo español', 'Yo hablo español']
      },
      {
        spanish: 'Estudia medicina. (He/She studies medicine.) - Could be ambiguous',
        english: 'Él estudia medicina. (He studies medicine.) - Pronoun for clarity',
        highlight: ['Estudia medicina', 'Él estudia medicina']
      },
      {
        spanish: 'Somos estudiantes. (We are students.) - Pronoun omitted',
        english: 'Nosotros somos de España, ellas son de México. (We are from Spain, they are from Mexico.) - Pronouns for contrast',
        highlight: ['Somos estudiantes', 'Nosotros somos', 'ellas son']
      }
    ]
  },
  {
    title: 'First Person Pronouns',
    content: `**First person pronouns** refer to the **speaker(s)**:`,
    conjugationTable: {
      title: 'First Person Subject Pronouns',
      conjugations: [
        { pronoun: 'yo', form: 'I', english: 'Yo hablo español. (I speak Spanish.)' },
        { pronoun: 'nosotros', form: 'we (masculine/mixed)', english: 'Nosotros estudiamos. (We study.)' },
        { pronoun: 'nosotras', form: 'we (feminine)', english: 'Nosotras trabajamos. (We work.)' }
      ]
    },
    examples: [
      {
        spanish: 'Yo soy profesor. (I am a teacher.)',
        english: 'Nosotros vivimos en Madrid. (We live in Madrid.)',
        highlight: ['Yo soy', 'Nosotros vivimos']
      },
      {
        spanish: 'Nosotras somos hermanas. (We are sisters.)',
        english: 'All female group uses nosotras',
        highlight: ['Nosotras somos']
      }
    ],
    subsections: [
      {
        title: 'YO - Never Capitalized',
        content: 'Unlike English "I", Spanish "yo" is lowercase:',
        examples: [
          {
            spanish: 'Yo hablo, tú escuchas. (I speak, you listen.)',
            english: 'Only capitalized at sentence beginning',
            highlight: ['Yo hablo']
          }
        ]
      },
      {
        title: 'NOSOTROS vs NOSOTRAS',
        content: 'Gender agreement in first person plural:',
        examples: [
          {
            spanish: 'Nosotros (men or mixed group)',
            english: 'Nosotras (all women)',
            highlight: ['Nosotros', 'Nosotras']
          }
        ]
      }
    ]
  },
  {
    title: 'Second Person Pronouns',
    content: `**Second person pronouns** refer to the **person(s) being addressed**:`,
    conjugationTable: {
      title: 'Second Person Subject Pronouns',
      conjugations: [
        { pronoun: 'tú', form: 'you (informal singular)', english: 'Tú eres inteligente. (You are intelligent.)' },
        { pronoun: 'usted', form: 'you (formal singular)', english: 'Usted es muy amable. (You are very kind.)' },
        { pronoun: 'vosotros', form: 'you all (informal, Spain)', english: 'Vosotros sois estudiantes. (You all are students.)' },
        { pronoun: 'vosotras', form: 'you all (informal, feminine, Spain)', english: 'Vosotras sois amigas. (You all are friends.)' },
        { pronoun: 'ustedes', form: 'you all (formal/Latin America)', english: 'Ustedes son bienvenidos. (You all are welcome.)' }
      ]
    },
    examples: [
      {
        spanish: 'Tú hablas muy bien. (You speak very well.) - Informal',
        english: 'Usted habla muy bien. (You speak very well.) - Formal',
        highlight: ['Tú hablas', 'Usted habla']
      },
      {
        spanish: 'Vosotros vivís en España. (You all live in Spain.) - Spain',
        english: 'Ustedes viven en México. (You all live in Mexico.) - Latin America',
        highlight: ['Vosotros vivís', 'Ustedes viven']
      }
    ],
    subsections: [
      {
        title: 'TÚ vs USTED',
        content: 'Informal vs formal address:',
        examples: [
          {
            spanish: 'TÚ: friends, family, peers, children',
            english: 'USTED: strangers, elders, authority figures',
            highlight: ['TÚ', 'USTED']
          }
        ]
      },
      {
        title: 'Regional Differences',
        content: 'Spain vs Latin America:',
        examples: [
          {
            spanish: 'SPAIN: tú, vosotros/vosotras, usted',
            english: 'LATIN AMERICA: tú, ustedes (no vosotros)',
            highlight: ['vosotros/vosotras', 'ustedes']
          }
        ]
      }
    ]
  },
  {
    title: 'Third Person Pronouns',
    content: `**Third person pronouns** refer to **people or things being talked about**:`,
    conjugationTable: {
      title: 'Third Person Subject Pronouns',
      conjugations: [
        { pronoun: 'él', form: 'he', english: 'Él trabaja aquí. (He works here.)' },
        { pronoun: 'ella', form: 'she', english: 'Ella estudia medicina. (She studies medicine.)' },
        { pronoun: 'usted', form: 'you (formal)', english: 'Usted es muy amable. (You are very kind.)' },
        { pronoun: 'ellos', form: 'they (masculine/mixed)', english: 'Ellos son hermanos. (They are brothers.)' },
        { pronoun: 'ellas', form: 'they (feminine)', english: 'Ellas son hermanas. (They are sisters.)' },
        { pronoun: 'ustedes', form: 'you all', english: 'Ustedes son estudiantes. (You all are students.)' }
      ]
    },
    examples: [
      {
        spanish: 'Él es médico, ella es profesora. (He is a doctor, she is a teacher.)',
        english: 'Ellos viven juntos. (They live together.)',
        highlight: ['Él es médico', 'ella es profesora', 'Ellos viven']
      },
      {
        spanish: 'Ellas son muy inteligentes. (They are very intelligent.) - All female',
        english: 'Ustedes hablan español muy bien. (You all speak Spanish very well.)',
        highlight: ['Ellas son', 'Ustedes hablan']
      }
    ],
    subsections: [
      {
        title: 'Gender Agreement',
        content: 'Third person plural shows gender:',
        examples: [
          {
            spanish: 'ELLOS: men or mixed group',
            english: 'ELLAS: all women',
            highlight: ['ELLOS', 'ELLAS']
          }
        ]
      },
      {
        title: 'USTED/USTEDES',
        content: 'Formal pronouns use third person verb forms:',
        examples: [
          {
            spanish: 'Usted habla (you speak - formal)',
            english: 'Same verb form as él/ella habla',
            highlight: ['Usted habla']
          }
        ]
      }
    ]
  },
  {
    title: 'When to Use Subject Pronouns',
    content: `**Use subject pronouns** in these situations:`,
    examples: [
      {
        spanish: 'EMPHASIS: Yo trabajo, tú descansas. (I work, you rest.)',
        english: 'CONTRAST: Él estudia medicina, ella estudia arte. (He studies medicine, she studies art.)',
        highlight: ['Yo trabajo, tú descansas', 'Él estudia', 'ella estudia']
      },
      {
        spanish: 'CLARITY: Usted es muy amable. (You are very kind.) - Could be él/ella without pronoun',
        english: 'AFTER PREPOSITIONS: según él (according to him), para nosotros (for us)',
        highlight: ['Usted es muy amable', 'según él', 'para nosotros']
      }
    ],
    subsections: [
      {
        title: 'Emphasis and Contrast',
        content: 'Highlighting who does what:',
        examples: [
          {
            spanish: 'Yo cocino, tú limpias. (I cook, you clean.)',
            english: 'Nosotros trabajamos, ellos descansan. (We work, they rest.)',
            highlight: ['Yo cocino, tú limpias', 'Nosotros trabajamos, ellos descansan']
          }
        ]
      },
      {
        title: 'Avoiding Ambiguity',
        content: 'When verb form could refer to multiple subjects:',
        examples: [
          {
            spanish: 'Habla español. (He/She/You speak Spanish.) - Ambiguous',
            english: 'Él habla español. (He speaks Spanish.) - Clear',
            highlight: ['Él habla español']
          }
        ]
      }
    ]
  },
  {
    title: 'When to Omit Subject Pronouns',
    content: `**Omit subject pronouns** in these situations:`,
    examples: [
      {
        spanish: 'NORMAL CONVERSATION: Hablo español. (I speak Spanish.)',
        english: 'CLEAR CONTEXT: Estudiamos juntos. (We study together.)',
        highlight: ['Hablo español', 'Estudiamos juntos']
      },
      {
        spanish: 'CONTINUOUS SUBJECT: María llega tarde. Trabaja mucho. (María arrives late. [She] works a lot.)',
        english: 'Same subject continues in next sentence',
        highlight: ['María llega tarde. Trabaja mucho']
      }
    ],
    subsections: [
      {
        title: 'Verb Endings Show Subject',
        content: 'Spanish verb endings indicate the subject:',
        examples: [
          {
            spanish: 'hablo (I speak), hablas (you speak), habla (he/she speaks)',
            english: 'Pronouns usually unnecessary',
            highlight: ['hablo', 'hablas', 'habla']
          }
        ]
      }
    ]
  },
  {
    title: 'Formal vs Informal Address',
    content: `**Choosing the right level of formality**:`,
    conjugationTable: {
      title: 'Formality Levels',
      conjugations: [
        { pronoun: 'TÚ (informal)', form: 'Friends, family, peers', english: 'Tú eres mi amigo. (You are my friend.)' },
        { pronoun: 'USTED (formal)', form: 'Strangers, elders, authority', english: 'Usted es muy amable. (You are very kind.)' },
        { pronoun: 'VOSOTROS (informal plural)', form: 'Spain only', english: 'Vosotros sois estudiantes. (You all are students.)' },
        { pronoun: 'USTEDES (formal/general plural)', form: 'Everywhere', english: 'Ustedes son bienvenidos. (You all are welcome.)' }
      ]
    },
    examples: [
      {
        spanish: 'TÚ: ¿Cómo estás? (How are you?) - To a friend',
        english: 'USTED: ¿Cómo está usted? (How are you?) - To a stranger',
        highlight: ['¿Cómo estás?', '¿Cómo está usted?']
      }
    ]
  },
  {
    title: 'Regional Variations',
    content: `**Different Spanish-speaking regions** have variations:`,
    conjugationTable: {
      title: 'Regional Differences',
      conjugations: [
        { pronoun: 'Spain', form: 'tú, vosotros/vosotras, usted', english: 'Full pronoun system' },
        { pronoun: 'Latin America', form: 'tú, ustedes', english: 'No vosotros (ustedes for all plural)' },
        { pronoun: 'Argentina/Uruguay', form: 'vos instead of tú', english: 'Vos sos (You are)' },
        { pronoun: 'Some regions', form: 'More usted usage', english: 'Formal even with family' }
      ]
    },
    examples: [
      {
        spanish: 'SPAIN: Vosotros sois estudiantes. (You all are students.)',
        english: 'LATIN AMERICA: Ustedes son estudiantes. (You all are students.)',
        highlight: ['Vosotros sois', 'Ustedes son']
      }
    ]
  },
  {
    title: 'Subject Pronouns with SER and ESTAR',
    content: `**Subject pronouns** with the verbs **"to be"**:`,
    examples: [
      {
        spanish: 'Yo soy profesor. (I am a teacher.) - SER for profession',
        english: 'Tú estás cansado. (You are tired.) - ESTAR for temporary state',
        highlight: ['Yo soy profesor', 'Tú estás cansado']
      },
      {
        spanish: 'Él es alto. (He is tall.) - SER for characteristics',
        english: 'Ella está en casa. (She is at home.) - ESTAR for location',
        highlight: ['Él es alto', 'Ella está en casa']
      }
    ]
  },
  {
    title: 'Subject Pronouns in Questions',
    content: `**Subject pronouns in interrogative sentences**:`,
    examples: [
      {
        spanish: '¿Tú hablas español? (Do you speak Spanish?)',
        english: '¿Él vive aquí? (Does he live here?)',
        highlight: ['¿Tú hablas español?', '¿Él vive aquí?']
      },
      {
        spanish: '¿Ustedes son estudiantes? (Are you all students?)',
        english: '¿Nosotros vamos juntos? (Are we going together?)',
        highlight: ['¿Ustedes son estudiantes?', '¿Nosotros vamos juntos?']
      }
    ]
  },
  {
    title: 'Common Mistakes with Subject Pronouns',
    content: `Here are frequent errors students make:

**1. Overusing pronouns**: Using them when unnecessary
**2. Wrong formality level**: Using tú when usted is appropriate
**3. Gender confusion**: Wrong gender for nosotros/nosotras, ellos/ellas
**4. Regional confusion**: Using vosotros in Latin American context`,
    examples: [
      {
        spanish: '❌ Yo hablo y yo como → ✅ Hablo y como',
        english: 'Wrong: unnecessary repetition of yo',
        highlight: ['Hablo y como']
      },
      {
        spanish: '❌ Tú es profesor → ✅ Tú eres profesor',
        english: 'Wrong: tú uses eres, not es',
        highlight: ['Tú eres profesor']
      },
      {
        spanish: '❌ Nosotras somos hermanos → ✅ Nosotras somos hermanas',
        english: 'Wrong: all-female group should use feminine forms',
        highlight: ['Nosotras somos hermanas']
      },
      {
        spanish: '❌ Vosotros sois (in Mexico) → ✅ Ustedes son',
        english: 'Wrong: vosotros not used in Latin America',
        highlight: ['Ustedes son']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Verb Conjugation', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' },
  { title: 'Spanish Ser vs Estar', url: '/grammar/spanish/verbs/ser-estar', difficulty: 'beginner' },
  { title: 'Spanish Object Pronouns', url: '/grammar/spanish/pronouns/object-pronouns', difficulty: 'intermediate' },
  { title: 'Spanish Formal vs Informal', url: '/grammar/spanish/syntax/formality', difficulty: 'intermediate' }
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
              topic: 'subject-pronouns',
              title: 'Spanish Subject Pronouns (Personal Pronouns, Usage, Omission)',
              description: 'Master Spanish subject pronouns including yo, tú, él/ella, nosotros, vosotros, ellos/ellas, usage rules, and when to omit them.',
              difficulty: 'beginner',
              examples: [
                'Yo hablo español. (I speak Spanish.)',
                'Tú eres inteligente. (You are intelligent.)',
                'Él vive en Madrid. (He lives in Madrid.)',
                'Nosotros estudiamos juntos. (We study together.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'pronouns',
              topic: 'subject-pronouns',
              title: 'Spanish Subject Pronouns (Personal Pronouns, Usage, Omission)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="pronouns"
        topic="subject-pronouns"
        title="Spanish Subject Pronouns (Personal Pronouns, Usage, Omission)"
        description="Master Spanish subject pronouns including yo, tú, él/ella, nosotros, vosotros, ellos/ellas, usage rules, and when to omit them"
        difficulty="beginner"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/spanish/pronouns"
        practiceUrl="/grammar/spanish/pronouns/subject-pronouns/practice"
        quizUrl="/grammar/spanish/pronouns/subject-pronouns/quiz"
        songUrl="/songs/es?theme=grammar&topic=subject-pronouns"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
