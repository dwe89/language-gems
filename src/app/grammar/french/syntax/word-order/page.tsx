import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'syntax',
  topic: 'word-order',
  title: 'French Word Order (Subject-Verb-Object, Adjective Placement)',
  description: 'Master French word order including subject-verb-object patterns, adjective placement, pronoun order, and inversion rules.',
  difficulty: 'intermediate',
  keywords: [
    'french word order',
    'subject verb object french',
    'adjective placement french',
    'pronoun order french',
    'inversion french',
    'french syntax'
  ],
  examples: [
    'Je mange une pomme. (I eat an apple.)',
    'Une belle maison (a beautiful house)',
    'Je la vois. (I see her.)',
    'Parlez-vous français? (Do you speak French?)'
  ]
});

const sections = [
  {
    title: 'Understanding French Word Order',
    content: `French word order follows **specific patterns** that differ from English in important ways. Understanding these patterns is crucial for natural French expression.

**Basic French word order:**
- **Standard**: Subject + Verb + Object (SVO)
- **Questions**: Inversion or question words
- **Adjectives**: Most follow nouns, some precede
- **Pronouns**: Specific order before verbs
- **Adverbs**: Various positions depending on type

**Key principles:**
1. **Subject-Verb-Object** is the foundation
2. **Pronouns** have fixed positions
3. **Adjectives** follow placement rules
4. **Questions** change word order
5. **Emphasis** can alter standard patterns

Mastering French word order helps you sound natural and avoid common mistakes.`,
    examples: [
      {
        spanish: 'Marie mange une pomme rouge. (Marie eats a red apple.)',
        english: 'Standard SVO order with adjective after noun',
        highlight: ['Marie mange une pomme rouge']
      },
      {
        spanish: 'Je la lui donne. (I give it to him/her.)',
        english: 'Pronoun order: direct object + indirect object',
        highlight: ['Je la lui donne']
      },
      {
        spanish: 'Parlez-vous français? (Do you speak French?)',
        english: 'Question inversion: verb-subject order',
        highlight: ['Parlez-vous français?']
      }
    ]
  },
  {
    title: 'Basic Word Order: Subject-Verb-Object',
    content: `French follows **Subject-Verb-Object (SVO)** order in declarative sentences:`,
    conjugationTable: {
      title: 'Basic SVO Pattern',
      conjugations: [
        { pronoun: 'Subject', form: 'Verb', english: 'Object' },
        { pronoun: 'Je', form: 'mange', english: 'une pomme. (I eat an apple.)' },
        { pronoun: 'Tu', form: 'lis', english: 'un livre. (You read a book.)' },
        { pronoun: 'Elle', form: 'regarde', english: 'la télé. (She watches TV.)' },
        { pronoun: 'Nous', form: 'visitons', english: 'Paris. (We visit Paris.)' },
        { pronoun: 'Ils', form: 'achètent', english: 'des fleurs. (They buy flowers.)' }
      ]
    },
    subsections: [
      {
        title: 'Extended SVO Patterns',
        content: 'Adding complements and modifiers:',
        examples: [
          {
            spanish: 'Marie mange une pomme rouge dans le jardin. (Marie eats a red apple in the garden.)',
            english: 'Subject + Verb + Object + Adjective + Prepositional phrase',
            highlight: ['Marie mange une pomme rouge dans le jardin']
          }
        ]
      }
    ]
  },
  {
    title: 'Adjective Placement',
    content: `French adjectives have **specific placement rules**:`,
    examples: [
      {
        spanish: 'Une voiture rouge (a red car) - Color after noun',
        english: 'Une belle voiture (a beautiful car) - Beauty before noun',
        highlight: ['voiture rouge', 'belle voiture']
      },
      {
        spanish: 'Un homme grand (a tall man) - Size after noun',
        english: 'Un grand homme (a great man) - Figurative before noun',
        highlight: ['homme grand', 'grand homme']
      }
    ],
    subsections: [
      {
        title: 'BAGS Adjectives (Before Noun)',
        content: 'Beauty, Age, Goodness, Size adjectives precede:',
        examples: [
          {
            spanish: 'Beauty: beau, joli → une belle maison',
            english: 'Age: jeune, vieux → un jeune homme',
            highlight: ['belle maison', 'jeune homme']
          },
          {
            spanish: 'Goodness: bon, mauvais → un bon livre',
            english: 'Size: grand, petit → une petite voiture',
            highlight: ['bon livre', 'petite voiture']
          }
        ]
      },
      {
        title: 'Most Adjectives Follow Noun',
        content: 'Color, nationality, shape, material:',
        examples: [
          {
            spanish: 'une robe bleue (blue dress)',
            english: 'un étudiant français (French student)',
            highlight: ['robe bleue', 'étudiant français']
          },
          {
            spanish: 'une table ronde (round table)',
            english: 'une chaise en bois (wooden chair)',
            highlight: ['table ronde', 'chaise en bois']
          }
        ]
      },
      {
        title: 'Multiple Adjectives',
        content: 'When using several adjectives:',
        examples: [
          {
            spanish: 'une belle voiture rouge (a beautiful red car)',
            english: 'un petit chat noir (a small black cat)',
            highlight: ['belle voiture rouge', 'petit chat noir']
          }
        ]
      }
    ]
  },
  {
    title: 'Pronoun Order',
    content: `French pronouns follow a **strict order** before the verb:`,
    conjugationTable: {
      title: 'Pronoun Order Pattern',
      conjugations: [
        { pronoun: '1. me, te, se, nous, vous', form: 'reflexive/indirect', english: 'Je me lave.' },
        { pronoun: '2. le, la, les', form: 'direct object', english: 'Je le vois.' },
        { pronoun: '3. lui, leur', form: 'indirect object', english: 'Je lui parle.' },
        { pronoun: '4. y', form: 'location/there', english: 'J\'y vais.' },
        { pronoun: '5. en', form: 'of it/some', english: 'J\'en veux.' }
      ]
    },
    subsections: [
      {
        title: 'Single Pronouns',
        content: 'One pronoun before verb:',
        examples: [
          {
            spanish: 'Je le vois. (I see him/it.)',
            english: 'Elle nous parle. (She speaks to us.)',
            highlight: ['Je le vois', 'Elle nous parle']
          }
        ]
      },
      {
        title: 'Multiple Pronouns',
        content: 'Following the order pattern:',
        examples: [
          {
            spanish: 'Je la lui donne. (I give it to him/her.)',
            english: 'Il nous en parle. (He speaks to us about it.)',
            highlight: ['Je la lui donne', 'Il nous en parle']
          },
          {
            spanish: 'Elle me l\'explique. (She explains it to me.)',
            english: 'Nous vous y emmenons. (We take you there.)',
            highlight: ['Elle me l\'explique', 'Nous vous y emmenons']
          }
        ]
      }
    ]
  },
  {
    title: 'Question Word Order',
    content: `Questions change French word order in several ways:`,
    examples: [
      {
        spanish: 'Tu parles français? (You speak French?) - Intonation',
        english: 'Est-ce que tu parles français? (Do you speak French?) - Est-ce que',
        highlight: ['Tu parles français?', 'Est-ce que tu parles français?']
      },
      {
        spanish: 'Parles-tu français? (Do you speak French?) - Inversion',
        english: 'Où vas-tu? (Where are you going?) - Question word + inversion',
        highlight: ['Parles-tu français?', 'Où vas-tu?']
      }
    ],
    subsections: [
      {
        title: 'Inversion Rules',
        content: 'Verb-subject inversion patterns:',
        examples: [
          {
            spanish: 'Simple: Parlez-vous? (Do you speak?)',
            english: 'With pronoun: Parle-t-il? (Does he speak?)',
            highlight: ['Parlez-vous?', 'Parle-t-il?']
          }
        ]
      },
      {
        title: 'Question Words',
        content: 'Interrogative words affect order:',
        examples: [
          {
            spanish: 'Que fais-tu? (What are you doing?)',
            english: 'Comment allez-vous? (How are you?)',
            highlight: ['Que fais-tu?', 'Comment allez-vous?']
          }
        ]
      }
    ]
  },
  {
    title: 'Adverb Placement',
    content: `French adverbs have **different positions** depending on their type:`,
    conjugationTable: {
      title: 'Adverb Placement Rules',
      conjugations: [
        { pronoun: 'Manner adverbs', form: 'after verb', english: 'Il parle bien. (He speaks well.)' },
        { pronoun: 'Time adverbs', form: 'beginning/end', english: 'Hier, j\'ai travaillé. (Yesterday, I worked.)' },
        { pronoun: 'Frequency adverbs', form: 'after verb', english: 'Je mange souvent ici. (I often eat here.)' },
        { pronoun: 'Intensity adverbs', form: 'before adjective', english: 'C\'est très beau. (It\'s very beautiful.)' }
      ]
    },
    subsections: [
      {
        title: 'Short Adverbs',
        content: 'Common short adverbs after verb:',
        examples: [
          {
            spanish: 'Il mange bien. (He eats well.)',
            english: 'Elle chante mal. (She sings badly.)',
            highlight: ['mange bien', 'chante mal']
          }
        ]
      },
      {
        title: 'Long Adverbs',
        content: 'Longer adverbs often at end:',
        examples: [
          {
            spanish: 'Il parle couramment. (He speaks fluently.)',
            english: 'Elle travaille sérieusement. (She works seriously.)',
            highlight: ['parle couramment', 'travaille sérieusement']
          }
        ]
      }
    ]
  },
  {
    title: 'Negation and Word Order',
    content: `Negation affects French word order:`,
    examples: [
      {
        spanish: 'Je ne parle pas français. (I don\'t speak French.)',
        english: 'Il n\'a jamais mangé ça. (He has never eaten that.)',
        highlight: ['ne parle pas', 'n\'a jamais mangé']
      },
      {
        spanish: 'Je ne le vois pas. (I don\'t see him.)',
        english: 'Elle ne nous en parle jamais. (She never speaks to us about it.)',
        highlight: ['ne le vois pas', 'ne nous en parle jamais']
      }
    ],
    subsections: [
      {
        title: 'Negation with Pronouns',
        content: 'Pronouns stay before verb in negation:',
        examples: [
          {
            spanish: 'Je ne la connais pas. (I don\'t know her.)',
            english: 'Il ne nous aide plus. (He no longer helps us.)',
            highlight: ['ne la connais pas', 'ne nous aide plus']
          }
        ]
      }
    ]
  },
  {
    title: 'Compound Tenses Word Order',
    content: `Word order in compound tenses (passé composé, etc.):`,
    examples: [
      {
        spanish: 'J\'ai mangé une pomme. (I ate an apple.)',
        english: 'Elle est partie hier. (She left yesterday.)',
        highlight: ['J\'ai mangé', 'Elle est partie']
      },
      {
        spanish: 'Je l\'ai vu. (I saw him/it.)',
        english: 'Il nous a parlé. (He spoke to us.)',
        highlight: ['Je l\'ai vu', 'Il nous a parlé']
      }
    ],
    subsections: [
      {
        title: 'Pronouns in Compound Tenses',
        content: 'Pronouns before auxiliary verb:',
        examples: [
          {
            spanish: 'Je la lui ai donnée. (I gave it to him/her.)',
            english: 'Nous vous en avons parlé. (We spoke to you about it.)',
            highlight: ['Je la lui ai donnée', 'Nous vous en avons parlé']
          }
        ]
      }
    ]
  },
  {
    title: 'Emphasis and Special Word Orders',
    content: `French uses special structures for emphasis:`,
    examples: [
      {
        spanish: 'C\'est Marie qui chante. (It\'s Marie who sings.) - Emphasis on subject',
        english: 'C\'est un livre que je lis. (It\'s a book that I\'m reading.) - Emphasis on object',
        highlight: ['C\'est Marie qui chante', 'C\'est un livre que je lis']
      }
    ],
    subsections: [
      {
        title: 'C\'est...qui/que Construction',
        content: 'Emphasizing different elements:',
        examples: [
          {
            spanish: 'C\'est aujourd\'hui que je pars. (It\'s today that I\'m leaving.)',
            english: 'C\'est à Paris qu\'il habite. (It\'s in Paris that he lives.)',
            highlight: ['C\'est aujourd\'hui que', 'C\'est à Paris qu\'il']
          }
        ]
      },
      {
        title: 'Moi, je... Construction',
        content: 'Emphasizing with stressed pronouns:',
        examples: [
          {
            spanish: 'Moi, je préfère le thé. (As for me, I prefer tea.)',
            english: 'Lui, il ne comprend pas. (As for him, he doesn\'t understand.)',
            highlight: ['Moi, je préfère', 'Lui, il ne comprend pas']
          }
        ]
      }
    ]
  },
  {
    title: 'Infinitive Constructions',
    content: `Word order with infinitive constructions:`,
    examples: [
      {
        spanish: 'Je veux le voir. (I want to see him/it.)',
        english: 'Il faut y aller. (We must go there.)',
        highlight: ['Je veux le voir', 'Il faut y aller']
      },
      {
        spanish: 'Elle peut nous aider. (She can help us.)',
        english: 'Nous devons en parler. (We must talk about it.)',
        highlight: ['Elle peut nous aider', 'Nous devons en parler']
      }
    ],
    subsections: [
      {
        title: 'Pronouns with Infinitives',
        content: 'Pronouns before infinitive:',
        examples: [
          {
            spanish: 'Je vais la voir. (I\'m going to see her.)',
            english: 'Il veut nous parler. (He wants to speak to us.)',
            highlight: ['Je vais la voir', 'Il veut nous parler']
          }
        ]
      }
    ]
  },
  {
    title: 'Regional and Stylistic Variations',
    content: `Word order can vary by region and style:`,
    subsections: [
      {
        title: 'Formal vs Informal',
        content: 'Register affects word order choices:',
        examples: [
          {
            spanish: 'Formal: Pourriez-vous m\'aider? (Could you help me?)',
            english: 'Informal: Tu peux m\'aider? (Can you help me?)',
            highlight: ['Pourriez-vous m\'aider?', 'Tu peux m\'aider?']
          }
        ]
      },
      {
        title: 'Literary Style',
        content: 'Literature may use different patterns:',
        examples: [
          {
            spanish: 'Literary: Vint alors Marie. (Then came Marie.)',
            english: 'Standard: Marie est venue alors. (Marie came then.)',
            highlight: ['Vint alors Marie', 'Marie est venue alors']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Word Order Mistakes',
    content: `Here are frequent errors students make:

**1. English word order**: Applying English patterns to French
**2. Adjective placement**: Putting all adjectives after nouns
**3. Pronoun order**: Wrong sequence of multiple pronouns
**4. Question formation**: Incorrect inversion patterns`,
    examples: [
      {
        spanish: '❌ Je vois le → ✅ Je le vois',
        english: 'Wrong: pronoun must come before verb',
        highlight: ['Je le vois']
      },
      {
        spanish: '❌ une voiture belle → ✅ une belle voiture',
        english: 'Wrong: beauty adjectives precede noun',
        highlight: ['une belle voiture']
      },
      {
        spanish: '❌ Je lui le donne → ✅ Je le lui donne',
        english: 'Wrong: direct object pronoun before indirect',
        highlight: ['Je le lui donne']
      },
      {
        spanish: '❌ Comment tu t\'appelles? → ✅ Comment tu t\'appelles? or Comment t\'appelles-tu?',
        english: 'Wrong: question word requires proper structure',
        highlight: ['Comment t\'appelles-tu?']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Adjective Agreement', url: '/grammar/french/adjectives/agreement-rules', difficulty: 'intermediate' },
  { title: 'French Pronouns', url: '/grammar/french/pronouns/subject-pronouns', difficulty: 'intermediate' },
  { title: 'French Questions', url: '/grammar/french/verbs/interrogative-forms', difficulty: 'intermediate' },
  { title: 'French Negation', url: '/grammar/french/syntax/negation', difficulty: 'intermediate' }
];

export default function FrenchWordOrderPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'syntax',
              topic: 'word-order',
              title: 'French Word Order (Subject-Verb-Object, Adjective Placement)',
              description: 'Master French word order including subject-verb-object patterns, adjective placement, pronoun order, and inversion rules.',
              difficulty: 'intermediate',
              examples: [
                'Je mange une pomme. (I eat an apple.)',
                'Une belle maison (a beautiful house)',
                'Je la vois. (I see her.)',
                'Parlez-vous français? (Do you speak French?)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'syntax',
              topic: 'word-order',
              title: 'French Word Order (Subject-Verb-Object, Adjective Placement)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="syntax"
        topic="word-order"
        title="French Word Order (Subject-Verb-Object, Adjective Placement)"
        description="Master French word order including subject-verb-object patterns, adjective placement, pronoun order, and inversion rules"
        difficulty="intermediate"
        estimatedTime={16}
        sections={sections}
        backUrl="/grammar/french/syntax"
        practiceUrl="/grammar/french/syntax/word-order/practice"
        quizUrl="/grammar/french/syntax/word-order/quiz"
        songUrl="/songs/fr?theme=grammar&topic=word-order"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
