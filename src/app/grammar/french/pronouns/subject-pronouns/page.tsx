import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'pronouns',
  topic: 'subject-pronouns',
  title: 'French Subject Pronouns (Je, Tu, Il, Elle, Nous, Vous, Ils, Elles)',
  description: 'Master French subject pronouns with verb conjugation. Learn je, tu, il, elle, nous, vous, ils, elles usage and agreement.',
  difficulty: 'beginner',
  keywords: [
    'french subject pronouns',
    'je tu il elle nous vous',
    'ils elles french',
    'french personal pronouns',
    'subject pronouns french',
    'french grammar pronouns'
  ],
  examples: [
    'je parle (I speak)',
    'tu manges (you eat)',
    'il/elle est (he/she is)',
    'nous avons (we have)'
  ]
});

const sections = [
  {
    title: 'Understanding Subject Pronouns',
    content: `French subject pronouns replace nouns as the **subject** of a sentence. They tell us **who** is performing the action of the verb.

French has eight subject pronouns that must agree with the verb conjugation. Unlike English, French subject pronouns are usually required - you cannot omit them.

These pronouns are essential for all French verb conjugation and sentence construction.`,
    examples: [
      {
        spanish: 'Marie parle. → Elle parle. (Marie speaks. → She speaks.)',
        english: 'Pronoun replaces the noun subject',
        highlight: ['Elle parle']
      },
      {
        spanish: 'Les enfants jouent. → Ils jouent. (The children play. → They play.)',
        english: 'Pronoun replaces plural noun subject',
        highlight: ['Ils jouent']
      }
    ]
  },
  {
    title: 'The Eight French Subject Pronouns',
    content: `French has eight subject pronouns covering all persons and numbers:`,
    subsections: [
      {
        title: 'Complete Subject Pronoun System',
        content: 'All French subject pronouns with their English equivalents:',
        conjugationTable: {
          title: 'French Subject Pronouns',
          conjugations: [
            { pronoun: 'je', form: '1st person singular', english: 'I' },
            { pronoun: 'tu', form: '2nd person singular', english: 'you (informal)' },
            { pronoun: 'il', form: '3rd person masculine singular', english: 'he/it' },
            { pronoun: 'elle', form: '3rd person feminine singular', english: 'she/it' },
            { pronoun: 'nous', form: '1st person plural', english: 'we' },
            { pronoun: 'vous', form: '2nd person plural/formal', english: 'you (formal/plural)' },
            { pronoun: 'ils', form: '3rd person masculine plural', english: 'they (masculine/mixed)' },
            { pronoun: 'elles', form: '3rd person feminine plural', english: 'they (feminine only)' }
          ]
        }
      }
    ]
  },
  {
    title: 'First Person Pronouns (I, We)',
    content: `First person pronouns refer to the speaker(s):`,
    examples: [
      {
        spanish: 'Je suis étudiant. (I am a student.)',
        english: 'First person singular - the speaker',
        highlight: ['Je suis']
      },
      {
        spanish: 'Nous parlons français. (We speak French.)',
        english: 'First person plural - speaker + others',
        highlight: ['Nous parlons']
      }
    ],
    subsections: [
      {
        title: 'JE → J\' Before Vowels',
        content: 'Je becomes j\' before verbs starting with vowels or silent h:',
        examples: [
          {
            spanish: 'j\'ai (I have) - not je ai',
            english: 'j\'aime (I love) - not je aime',
            highlight: ['j\'ai', 'j\'aime']
          },
          {
            spanish: 'j\'habite (I live) - silent h',
            english: 'j\'étudie (I study) - vowel sound',
            highlight: ['j\'habite', 'j\'étudie']
          }
        ]
      },
      {
        title: 'NOUS Usage',
        content: 'Nous includes the speaker plus one or more others:',
        examples: [
          {
            spanish: 'Nous (speaker + you): Nous allons au cinéma. (We\'re going to the movies.)',
            english: 'Including the person you\'re talking to',
            highlight: ['Nous allons']
          },
          {
            spanish: 'Nous (speaker + others): Nous travaillons ensemble. (We work together.)',
            english: 'Including other people, not necessarily the listener',
            highlight: ['Nous travaillons']
          }
        ]
      }
    ]
  },
  {
    title: 'Second Person Pronouns (You)',
    content: `French has two forms of "you" with important social distinctions:`,
    subsections: [
      {
        title: 'TU - Informal You',
        content: 'Use tu with family, friends, children, and peers:',
        examples: [
          {
            spanish: 'Tu es mon ami. (You are my friend.)',
            english: 'Informal relationship',
            highlight: ['Tu es']
          },
          {
            spanish: 'Comment tu t\'appelles? (What\'s your name?)',
            english: 'Speaking to someone familiar',
            highlight: ['tu t\'appelles']
          }
        ]
      },
      {
        title: 'VOUS - Formal/Plural You',
        content: 'Use vous for formal situations, strangers, or multiple people:',
        examples: [
          {
            spanish: 'Vous êtes très gentil. (You are very kind.) - formal singular',
            english: 'Polite form to one person',
            highlight: ['Vous êtes']
          },
          {
            spanish: 'Vous parlez français? (Do you speak French?) - to multiple people',
            english: 'Speaking to several people',
            highlight: ['Vous parlez']
          }
        ]
      },
      {
        title: 'Tu vs Vous Guidelines',
        content: 'When to use each form:',
        conjugationTable: {
          title: 'Tu vs Vous Usage',
          conjugations: [
            { pronoun: 'Use TU with:', form: 'Family, friends, children', english: 'Tu veux jouer? (Do you want to play?)' },
            { pronoun: 'Use VOUS with:', form: 'Strangers, bosses, elderly', english: 'Vous pouvez m\'aider? (Can you help me?)' },
            { pronoun: 'Use VOUS for:', form: 'Multiple people (any age)', english: 'Vous êtes prêts? (Are you ready?)' }
          ]
        }
      }
    ]
  },
  {
    title: 'Third Person Pronouns (He, She, It, They)',
    content: `Third person pronouns replace people or things being talked about:`,
    subsections: [
      {
        title: 'IL and ELLE (He/She/It)',
        content: 'Singular third person pronouns:',
        examples: [
          {
            spanish: 'Pierre travaille. → Il travaille. (Pierre works. → He works.)',
            english: 'Il replaces masculine person',
            highlight: ['Il travaille']
          },
          {
            spanish: 'Marie chante. → Elle chante. (Marie sings. → She sings.)',
            english: 'Elle replaces feminine person',
            highlight: ['Elle chante']
          },
          {
            spanish: 'Le livre est intéressant. → Il est intéressant. (The book is interesting. → It is interesting.)',
            english: 'Il replaces masculine thing',
            highlight: ['Il est']
          },
          {
            spanish: 'La voiture est rouge. → Elle est rouge. (The car is red. → It is red.)',
            english: 'Elle replaces feminine thing',
            highlight: ['Elle est']
          }
        ]
      },
      {
        title: 'ILS and ELLES (They)',
        content: 'Plural third person pronouns:',
        examples: [
          {
            spanish: 'Les garçons jouent. → Ils jouent. (The boys play. → They play.)',
            english: 'Ils for masculine plural',
            highlight: ['Ils jouent']
          },
          {
            spanish: 'Les filles dansent. → Elles dansent. (The girls dance. → They dance.)',
            english: 'Elles for feminine plural',
            highlight: ['Elles dansent']
          },
          {
            spanish: 'Pierre et Marie arrivent. → Ils arrivent. (Pierre and Marie arrive. → They arrive.)',
            english: 'Mixed group uses masculine ils',
            highlight: ['Ils arrivent']
          }
        ]
      },
      {
        title: 'Gender Agreement Rules',
        content: 'Important rules for choosing il/elle and ils/elles:',
        examples: [
          {
            spanish: 'Masculine singular: il (le livre → il)',
            english: 'Feminine singular: elle (la table → elle)',
            highlight: ['il', 'elle']
          },
          {
            spanish: 'All masculine plural: ils (les garçons → ils)',
            english: 'All feminine plural: elles (les filles → elles)',
            highlight: ['ils', 'elles']
          },
          {
            spanish: 'Mixed group: ils (les garçons et les filles → ils)',
            english: 'Mixed groups always use masculine ils',
            highlight: ['ils']
          }
        ]
      }
    ]
  },
  {
    title: 'Subject Pronouns with Verb Conjugation',
    content: `Subject pronouns determine verb conjugation. Each pronoun requires a specific verb form:`,
    examples: [
      {
        spanish: 'être (to be): je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont',
        english: 'Each pronoun has its own verb form',
        highlight: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont']
      },
      {
        spanish: 'avoir (to have): j\'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont',
        english: 'Verb endings change with each pronoun',
        highlight: ['ai', 'as', 'a', 'avons', 'avez', 'ont']
      }
    ],
    subsections: [
      {
        title: 'Regular -ER Verb Example (parler)',
        content: 'How subject pronouns work with regular verbs:',
        conjugationTable: {
          title: 'Parler (to speak) Conjugation',
          conjugations: [
            { pronoun: 'je parle', form: 'I speak', english: 'Je parle français.' },
            { pronoun: 'tu parles', form: 'you speak', english: 'Tu parles anglais.' },
            { pronoun: 'il/elle parle', form: 'he/she speaks', english: 'Il parle italien.' },
            { pronoun: 'nous parlons', form: 'we speak', english: 'Nous parlons espagnol.' },
            { pronoun: 'vous parlez', form: 'you speak', english: 'Vous parlez allemand.' },
            { pronoun: 'ils/elles parlent', form: 'they speak', english: 'Ils parlent chinois.' }
          ]
        }
      }
    ]
  },
  {
    title: 'Special Cases and Usage Notes',
    content: `Important points about French subject pronouns:`,
    examples: [
      {
        spanish: 'On (informal "we"): On va au cinéma. (We\'re going to the movies.)',
        english: 'On is often used instead of nous in spoken French',
        highlight: ['On va']
      },
      {
        spanish: 'Emphasis: Moi, je pense que... (I think that...)',
        english: 'Stress pronouns can be added for emphasis',
        highlight: ['Moi, je']
      }
    ],
    subsections: [
      {
        title: 'ON as Informal "We"',
        content: 'On is very common in spoken French:',
        examples: [
          {
            spanish: 'Formal: Nous allons au restaurant. (We\'re going to the restaurant.)',
            english: 'Informal: On va au restaurant. (We\'re going to the restaurant.)',
            highlight: ['Nous allons', 'On va']
          },
          {
            spanish: 'On takes 3rd person singular verb forms like il/elle',
            english: 'On est contents. (We are happy.)',
            highlight: ['On est']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Subject Pronoun Mistakes',
    content: `Here are frequent errors students make with subject pronouns:

**1. Omitting pronouns**: Forgetting required subject pronouns
**2. Wrong gender**: Using il for feminine nouns
**3. Tu/vous confusion**: Wrong formality level
**4. Mixed group gender**: Using elles for mixed groups`,
    examples: [
      {
        spanish: '❌ Suis étudiant → ✅ Je suis étudiant',
        english: 'Wrong: must include subject pronoun',
        highlight: ['Je suis']
      },
      {
        spanish: '❌ La table... il est → ✅ La table... elle est',
        english: 'Wrong: table is feminine, needs elle',
        highlight: ['elle est']
      },
      {
        spanish: '❌ (to teacher) Tu es gentil → ✅ Vous êtes gentil',
        english: 'Wrong: use vous for formal situations',
        highlight: ['Vous êtes']
      },
      {
        spanish: '❌ Pierre et Marie... elles → ✅ Pierre et Marie... ils',
        english: 'Wrong: mixed groups use masculine ils',
        highlight: ['ils']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Verb Conjugation', url: '/grammar/french/verbs/present-tense', difficulty: 'beginner' },
  { title: 'French Direct Object Pronouns', url: '/grammar/french/pronouns/direct-object', difficulty: 'intermediate' },
  { title: 'French Stress Pronouns', url: '/grammar/french/pronouns/stress-pronouns', difficulty: 'intermediate' },
  { title: 'French Formal vs Informal', url: '/grammar/french/expressions/formal-informal', difficulty: 'beginner' }
];

export default function FrenchSubjectPronounsPage() {
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
              topic: 'subject-pronouns',
              title: 'French Subject Pronouns (Je, Tu, Il, Elle, Nous, Vous, Ils, Elles)',
              description: 'Master French subject pronouns with verb conjugation. Learn je, tu, il, elle, nous, vous, ils, elles usage and agreement.',
              difficulty: 'beginner',
              examples: [
                'je parle (I speak)',
                'tu manges (you eat)',
                'il/elle est (he/she is)',
                'nous avons (we have)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'pronouns',
              topic: 'subject-pronouns',
              title: 'French Subject Pronouns (Je, Tu, Il, Elle, Nous, Vous, Ils, Elles)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="pronouns"
        topic="subject-pronouns"
        title="French Subject Pronouns (Je, Tu, Il, Elle, Nous, Vous, Ils, Elles)"
        description="Master French subject pronouns with verb conjugation. Learn je, tu, il, elle, nous, vous, ils, elles usage and agreement"
        difficulty="beginner"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/french/pronouns"
        practiceUrl="/grammar/french/pronouns/subject-pronouns/practice"
        quizUrl="/grammar/french/pronouns/subject-pronouns/quiz"
        songUrl="/songs/fr?theme=grammar&topic=subject-pronouns"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
