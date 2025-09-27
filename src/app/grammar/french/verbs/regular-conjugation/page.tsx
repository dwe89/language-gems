import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'regular-conjugation',
  title: 'French Regular Verb Conjugation (-er, -ir, -re Patterns)',
  description: 'Master French regular verb conjugation patterns for -er, -ir, and -re verbs. Learn systematic conjugation rules with examples.',
  difficulty: 'beginner',
  keywords: [
    'french regular verbs',
    'french verb conjugation',
    'er ir re verbs french',
    'french verb patterns',
    'conjugating french verbs',
    'french verb endings'
  ],
  examples: [
    'parler → je parle, tu parles, il parle',
    'finir → je finis, tu finis, il finit',
    'vendre → je vends, tu vends, il vend',
    'nous parlons, vous parlez, ils parlent'
  ]
});

const sections = [
  {
    title: 'Understanding French Regular Verb Conjugation',
    content: `French regular verbs follow **predictable patterns** based on their infinitive endings. There are three main groups of regular verbs in French:

**-ER verbs** (First Group) - Most common (90% of French verbs)
**-IR verbs** (Second Group) - Regular -ir verbs with -iss- stem extension
**-RE verbs** (Third Group) - Regular -re verbs

Each group has specific conjugation patterns that remain consistent across all verbs in that group. Mastering these patterns is essential for French communication.`,
    examples: [
      {
        spanish: 'parler (to speak) → je parle (I speak)',
        english: '-ER verb example',
        highlight: ['parler', 'je parle']
      },
      {
        spanish: 'finir (to finish) → je finis (I finish)',
        english: '-IR verb example',
        highlight: ['finir', 'je finis']
      },
      {
        spanish: 'vendre (to sell) → je vends (I sell)',
        english: '-RE verb example',
        highlight: ['vendre', 'je vends']
      }
    ]
  },
  {
    title: '-ER Verbs (First Group)',
    content: `**-ER verbs** are the most common in French. To conjugate them, remove the -er ending and add the appropriate endings:`,
    conjugationTable: {
      title: 'PARLER (to speak) - Present Tense',
      conjugations: [
        { pronoun: 'je', form: 'parle', english: 'I speak' },
        { pronoun: 'tu', form: 'parles', english: 'you speak (informal)' },
        { pronoun: 'il/elle/on', form: 'parle', english: 'he/she/one speaks' },
        { pronoun: 'nous', form: 'parlons', english: 'we speak' },
        { pronoun: 'vous', form: 'parlez', english: 'you speak (formal/plural)' },
        { pronoun: 'ils/elles', form: 'parlent', english: 'they speak' }
      ]
    },
    subsections: [
      {
        title: '-ER Verb Endings',
        content: 'Standard endings for all regular -ER verbs:',
        examples: [
          {
            spanish: 'je → -e, tu → -es, il/elle/on → -e',
            english: 'nous → -ons, vous → -ez, ils/elles → -ent',
            highlight: ['-e', '-es', '-e', '-ons', '-ez', '-ent']
          }
        ]
      },
      {
        title: 'Common -ER Verbs',
        content: 'Frequently used regular -ER verbs:',
        conjugationTable: {
          title: 'Common -ER Verbs',
          conjugations: [
            { pronoun: 'aimer', form: 'to love/like', english: 'j\'aime, tu aimes, il aime...' },
            { pronoun: 'regarder', form: 'to watch', english: 'je regarde, tu regardes, il regarde...' },
            { pronoun: 'écouter', form: 'to listen', english: 'j\'écoute, tu écoutes, il écoute...' },
            { pronoun: 'travailler', form: 'to work', english: 'je travaille, tu travailles, il travaille...' },
            { pronoun: 'habiter', form: 'to live', english: 'j\'habite, tu habites, il habite...' },
            { pronoun: 'étudier', form: 'to study', english: 'j\'étudie, tu étudies, il étudie...' }
          ]
        }
      }
    ]
  },
  {
    title: '-IR Verbs (Second Group)',
    content: `**Regular -IR verbs** add **-iss-** to the stem in plural forms. Remove -ir and add the appropriate endings:`,
    conjugationTable: {
      title: 'FINIR (to finish) - Present Tense',
      conjugations: [
        { pronoun: 'je', form: 'finis', english: 'I finish' },
        { pronoun: 'tu', form: 'finis', english: 'you finish (informal)' },
        { pronoun: 'il/elle/on', form: 'finit', english: 'he/she/one finishes' },
        { pronoun: 'nous', form: 'finissons', english: 'we finish' },
        { pronoun: 'vous', form: 'finissez', english: 'you finish (formal/plural)' },
        { pronoun: 'ils/elles', form: 'finissent', english: 'they finish' }
      ]
    },
    subsections: [
      {
        title: '-IR Verb Pattern',
        content: 'Notice the -iss- extension in plural forms:',
        examples: [
          {
            spanish: 'Singular: je finis, tu finis, il finit',
            english: 'Plural: nous finissons, vous finissez, ils finissent',
            highlight: ['finis', 'finit', 'finissons', 'finissez', 'finissent']
          }
        ]
      },
      {
        title: 'Common -IR Verbs (Regular)',
        content: 'Regular -IR verbs with -iss- pattern:',
        conjugationTable: {
          title: 'Common Regular -IR Verbs',
          conjugations: [
            { pronoun: 'choisir', form: 'to choose', english: 'je choisis, nous choisissons' },
            { pronoun: 'réussir', form: 'to succeed', english: 'je réussis, nous réussissons' },
            { pronoun: 'grandir', form: 'to grow', english: 'je grandis, nous grandissons' },
            { pronoun: 'rougir', form: 'to blush', english: 'je rougis, nous rougissons' },
            { pronoun: 'obéir', form: 'to obey', english: 'j\'obéis, nous obéissons' },
            { pronoun: 'réfléchir', form: 'to think', english: 'je réfléchis, nous réfléchissons' }
          ]
        }
      }
    ]
  },
  {
    title: '-RE Verbs (Third Group)',
    content: `**Regular -RE verbs** drop the final -e in the third person singular. Remove -re and add the appropriate endings:`,
    conjugationTable: {
      title: 'VENDRE (to sell) - Present Tense',
      conjugations: [
        { pronoun: 'je', form: 'vends', english: 'I sell' },
        { pronoun: 'tu', form: 'vends', english: 'you sell (informal)' },
        { pronoun: 'il/elle/on', form: 'vend', english: 'he/she/one sells' },
        { pronoun: 'nous', form: 'vendons', english: 'we sell' },
        { pronoun: 'vous', form: 'vendez', english: 'you sell (formal/plural)' },
        { pronoun: 'ils/elles', form: 'vendent', english: 'they sell' }
      ]
    },
    subsections: [
      {
        title: '-RE Verb Endings',
        content: 'Standard endings for regular -RE verbs:',
        examples: [
          {
            spanish: 'je → -s, tu → -s, il/elle/on → (no ending)',
            english: 'nous → -ons, vous → -ez, ils/elles → -ent',
            highlight: ['-s', '-s', 'no ending', '-ons', '-ez', '-ent']
          }
        ]
      },
      {
        title: 'Common -RE Verbs',
        content: 'Frequently used regular -RE verbs:',
        conjugationTable: {
          title: 'Common -RE Verbs',
          conjugations: [
            { pronoun: 'attendre', form: 'to wait', english: 'j\'attends, tu attends, il attend...' },
            { pronoun: 'entendre', form: 'to hear', english: 'j\'entends, tu entends, il entend...' },
            { pronoun: 'perdre', form: 'to lose', english: 'je perds, tu perds, il perd...' },
            { pronoun: 'répondre', form: 'to answer', english: 'je réponds, tu réponds, il répond...' },
            { pronoun: 'descendre', form: 'to go down', english: 'je descends, tu descends, il descend...' },
            { pronoun: 'rendre', form: 'to return', english: 'je rends, tu rends, il rend...' }
          ]
        }
      }
    ]
  },
  {
    title: 'Conjugation Steps',
    content: `Follow these systematic steps to conjugate any regular French verb:`,
    subsections: [
      {
        title: 'Step-by-Step Process',
        content: 'Universal conjugation method:',
        examples: [
          {
            spanish: '1. Identify the verb group (-er, -ir, or -re)',
            english: '2. Remove the infinitive ending',
            highlight: ['Identify', 'Remove']
          },
          {
            spanish: '3. Add the appropriate ending for the subject',
            english: '4. Check for any spelling changes or irregularities',
            highlight: ['Add ending', 'Check changes']
          }
        ]
      },
      {
        title: 'Practice Example: DANSER (to dance)',
        content: 'Applying the conjugation steps:',
        examples: [
          {
            spanish: '1. DANSER is an -ER verb (First Group)',
            english: '2. Remove -ER: DANS-',
            highlight: ['DANSER', '-ER verb', 'DANS-']
          },
          {
            spanish: '3. Add endings: je danse, tu danses, il danse',
            english: '4. Complete: nous dansons, vous dansez, ils dansent',
            highlight: ['danse', 'danses', 'dansons', 'dansez', 'dansent']
          }
        ]
      }
    ]
  },
  {
    title: 'Pronunciation Patterns',
    content: `Understanding pronunciation helps with conjugation:`,
    subsections: [
      {
        title: 'Silent Endings',
        content: 'Many conjugated forms sound the same:',
        examples: [
          {
            spanish: '-ER verbs: je parle, tu parles, il parle, ils parlent',
            english: 'All pronounced the same: [parl]',
            highlight: ['parle', 'parles', 'parlent']
          }
        ]
      },
      {
        title: 'Liaison and Pronunciation',
        content: 'Connecting sounds in speech:',
        examples: [
          {
            spanish: 'ils aiment [il-z-aiment] - liaison with -s',
            english: 'nous aimons [nou-z-aimons] - liaison with -s',
            highlight: ['ils aiment', 'nous aimons']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes to Avoid',
    content: `Here are frequent errors students make with regular verb conjugation:

**1. Mixing up verb groups**: Confusing -IR patterns
**2. Forgetting -iss- extension**: In regular -IR verbs (plural forms)
**3. Adding extra letters**: In -RE verbs (third person singular)
**4. Wrong endings**: Mixing up subject pronouns`,
    examples: [
      {
        spanish: '❌ je finis, nous finons → ✅ je finis, nous finissons',
        english: 'Wrong: forgot -iss- extension in plural',
        highlight: ['nous finissons']
      },
      {
        spanish: '❌ il vendes → ✅ il vend',
        english: 'Wrong: -RE verbs have no ending in 3rd person singular',
        highlight: ['il vend']
      },
      {
        spanish: '❌ vous parles → ✅ vous parlez',
        english: 'Wrong: vous always takes -ez ending',
        highlight: ['vous parlez']
      },
      {
        spanish: '❌ ils parlons → ✅ ils parlent',
        english: 'Wrong: ils/elles take -ent ending',
        highlight: ['ils parlent']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Present Tense', url: '/grammar/french/verbs/present-tense', difficulty: 'beginner' },
  { title: 'French Irregular Verbs', url: '/grammar/french/verbs/irregular-verbs', difficulty: 'intermediate' },
  { title: 'French Verb Conjugation Practice', url: '/grammar/french/verbs/conjugation-practice', difficulty: 'beginner' },
  { title: 'French Subject Pronouns', url: '/grammar/french/pronouns/subject-pronouns', difficulty: 'beginner' }
];

export default function FrenchRegularConjugationPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'verbs',
              topic: 'regular-conjugation',
              title: 'French Regular Verb Conjugation (-er, -ir, -re Patterns)',
              description: 'Master French regular verb conjugation patterns for -er, -ir, and -re verbs. Learn systematic conjugation rules with examples.',
              difficulty: 'beginner',
              examples: [
                'parler → je parle, tu parles, il parle',
                'finir → je finis, tu finis, il finit',
                'vendre → je vends, tu vends, il vend',
                'nous parlons, vous parlez, ils parlent'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'regular-conjugation',
              title: 'French Regular Verb Conjugation (-er, -ir, -re Patterns)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="regular-conjugation"
        title="French Regular Verb Conjugation (-er, -ir, -re Patterns)"
        description="Master French regular verb conjugation patterns for -er, -ir, and -re verbs. Learn systematic conjugation rules with examples"
        difficulty="beginner"
        estimatedTime={16}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/regular-conjugation/practice"
        quizUrl="/grammar/french/verbs/regular-conjugation/quiz"
        songUrl="/songs/fr?theme=grammar&topic=regular-verbs"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
