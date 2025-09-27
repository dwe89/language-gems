import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adverbs',
  topic: 'degree',
  title: 'French Degree Adverbs (Très, Assez, Trop, Plutôt)',
  description: 'Master French degree adverbs for expressing intensity and extent. Learn très, assez, trop, plutôt, and how they modify adjectives and adverbs.',
  difficulty: 'beginner',
  keywords: [
    'french degree adverbs',
    'très assez trop',
    'plutôt beaucoup peu',
    'intensity adverbs french',
    'extent adverbs french',
    'modifying adjectives french'
  ],
  examples: [
    'Elle est très intelligente (She is very intelligent)',
    'Il mange assez bien (He eats quite well)',
    'C\'est trop cher (It\'s too expensive)',
    'Tu es plutôt sympa (You are rather nice)'
  ]
});

const sections = [
  {
    title: 'Understanding Degree Adverbs',
    content: `French degree adverbs express **intensity**, **extent**, or **degree**. They answer questions like "how much?" "to what extent?" or "how intense?"

These adverbs **modify adjectives**, **other adverbs**, or sometimes **verbs** to show the strength or level of a quality or action.

Degree adverbs are essential for expressing nuanced opinions and making precise descriptions.`,
    examples: [
      {
        spanish: 'Elle est très belle. (She is very beautiful.)',
        english: 'Très intensifies the adjective belle',
        highlight: ['très belle']
      },
      {
        spanish: 'Il parle assez bien français. (He speaks French quite well.)',
        english: 'Assez modifies the adverb bien',
        highlight: ['assez bien']
      },
      {
        spanish: 'Nous travaillons beaucoup. (We work a lot.)',
        english: 'Beaucoup modifies the verb travaillons',
        highlight: ['travaillons beaucoup']
      }
    ]
  },
  {
    title: 'High Intensity Adverbs',
    content: `Adverbs expressing strong or maximum intensity:`,
    subsections: [
      {
        title: 'TRÈS (Very)',
        content: 'The most common intensifier in French:',
        examples: [
          {
            spanish: 'Il est très intelligent. (He is very intelligent.)',
            english: 'Elle chante très bien. (She sings very well.)',
            highlight: ['très intelligent', 'très bien']
          },
          {
            spanish: 'C\'est très important. (It\'s very important.)',
            english: 'Tu parles très vite. (You speak very fast.)',
            highlight: ['très important', 'très vite']
          }
        ]
      },
      {
        title: 'EXTRÊMEMENT (Extremely)',
        content: 'Expresses maximum intensity:',
        examples: [
          {
            spanish: 'Il fait extrêmement froid. (It\'s extremely cold.)',
            english: 'Elle est extrêmement gentille. (She is extremely kind.)',
            highlight: ['extrêmement froid', 'extrêmement gentille']
          }
        ]
      },
      {
        title: 'VRAIMENT (Really)',
        content: 'Emphasizes truth or reality of the degree:',
        examples: [
          {
            spanish: 'C\'est vraiment délicieux. (It\'s really delicious.)',
            english: 'Il est vraiment fatigué. (He is really tired.)',
            highlight: ['vraiment délicieux', 'vraiment fatigué']
          }
        ]
      }
    ]
  },
  {
    title: 'Moderate Intensity Adverbs',
    content: `Adverbs expressing moderate or sufficient intensity:`,
    subsections: [
      {
        title: 'ASSEZ (Quite/Enough)',
        content: 'Expresses sufficient or moderate degree:',
        examples: [
          {
            spanish: 'Il est assez grand. (He is quite tall.)',
            english: 'Elle parle assez lentement. (She speaks quite slowly.)',
            highlight: ['assez grand', 'assez lentement']
          },
          {
            spanish: 'C\'est assez difficile. (It\'s quite difficult.)',
            english: 'Tu chantes assez bien. (You sing quite well.)',
            highlight: ['assez difficile', 'assez bien']
          }
        ]
      },
      {
        title: 'PLUTÔT (Rather/Quite)',
        content: 'Expresses moderate degree with slight preference:',
        examples: [
          {
            spanish: 'Il est plutôt sympa. (He is rather nice.)',
            english: 'Elle est plutôt jolie. (She is rather pretty.)',
            highlight: ['plutôt sympa', 'plutôt jolie']
          },
          {
            spanish: 'C\'est plutôt intéressant. (It\'s rather interesting.)',
            english: 'Tu es plutôt intelligent. (You are rather intelligent.)',
            highlight: ['plutôt intéressant', 'plutôt intelligent']
          }
        ]
      },
      {
        title: 'RELATIVEMENT (Relatively)',
        content: 'Expresses degree in comparison to something else:',
        examples: [
          {
            spanish: 'C\'est relativement facile. (It\'s relatively easy.)',
            english: 'Il est relativement jeune. (He is relatively young.)',
            highlight: ['relativement facile', 'relativement jeune']
          }
        ]
      }
    ]
  },
  {
    title: 'Excessive Degree Adverbs',
    content: `Adverbs expressing excessive or problematic intensity:`,
    subsections: [
      {
        title: 'TROP (Too/Too Much)',
        content: 'Expresses excessive degree (often negative):',
        examples: [
          {
            spanish: 'Il est trop jeune. (He is too young.)',
            english: 'C\'est trop cher. (It\'s too expensive.)',
            highlight: ['trop jeune', 'trop cher']
          },
          {
            spanish: 'Elle parle trop vite. (She speaks too fast.)',
            english: 'Tu travailles trop. (You work too much.)',
            highlight: ['trop vite', 'travailles trop']
          }
        ]
      },
      {
        title: 'TROP DE (Too Much/Too Many)',
        content: 'Used with nouns to express excessive quantity:',
        examples: [
          {
            spanish: 'Il y a trop de bruit. (There\'s too much noise.)',
            english: 'J\'ai trop de travail. (I have too much work.)',
            highlight: ['trop de bruit', 'trop de travail']
          }
        ]
      }
    ]
  },
  {
    title: 'Low Intensity Adverbs',
    content: `Adverbs expressing minimal or insufficient intensity:`,
    subsections: [
      {
        title: 'PEU (Little/Not Very)',
        content: 'Expresses low degree or small amount:',
        examples: [
          {
            spanish: 'Il est peu bavard. (He is not very talkative.)',
            english: 'Elle mange peu. (She eats little.)',
            highlight: ['peu bavard', 'mange peu']
          },
          {
            spanish: 'C\'est peu probable. (It\'s not very likely.)',
            english: 'Il dort peu. (He sleeps little.)',
            highlight: ['peu probable', 'dort peu']
          }
        ]
      },
      {
        title: 'UN PEU (A Little)',
        content: 'Expresses small but noticeable degree:',
        examples: [
          {
            spanish: 'Il est un peu fatigué. (He is a little tired.)',
            english: 'Elle parle un peu vite. (She speaks a little fast.)',
            highlight: ['un peu fatigué', 'un peu vite']
          }
        ]
      },
      {
        title: 'PAS TRÈS (Not Very)',
        content: 'Negates high intensity:',
        examples: [
          {
            spanish: 'Il n\'est pas très grand. (He is not very tall.)',
            english: 'Ce n\'est pas très difficile. (It\'s not very difficult.)',
            highlight: ['pas très grand', 'pas très difficile']
          }
        ]
      }
    ]
  },
  {
    title: 'Quantity-Based Degree Adverbs',
    content: `Adverbs expressing degree through quantity concepts:`,
    subsections: [
      {
        title: 'BEAUCOUP (Much/A Lot)',
        content: 'Expresses high degree or large quantity:',
        examples: [
          {
            spanish: 'Il travaille beaucoup. (He works a lot.)',
            english: 'Elle aime beaucoup la musique. (She likes music a lot.)',
            highlight: ['travaille beaucoup', 'aime beaucoup']
          },
          {
            spanish: 'C\'est beaucoup mieux. (It\'s much better.)',
            english: 'Il est beaucoup plus grand. (He is much taller.)',
            highlight: ['beaucoup mieux', 'beaucoup plus grand']
          }
        ]
      },
      {
        title: 'ÉNORMÉMENT (Enormously)',
        content: 'Expresses very high degree:',
        examples: [
          {
            spanish: 'Il travaille énormément. (He works enormously.)',
            english: 'Elle a énormément de talent. (She has enormous talent.)',
            highlight: ['travaille énormément', 'énormément de talent']
          }
        ]
      }
    ]
  },
  {
    title: 'Placement of Degree Adverbs',
    content: `Degree adverbs have specific placement rules depending on what they modify:`,
    examples: [
      {
        spanish: 'Before adjectives: très beau (very beautiful)',
        english: 'Before adverbs: assez bien (quite well)',
        highlight: ['très beau', 'assez bien']
      },
      {
        spanish: 'After verbs: Il mange beaucoup. (He eats a lot.)',
        english: 'With comparatives: beaucoup plus grand (much taller)',
        highlight: ['mange beaucoup', 'beaucoup plus grand']
      }
    ],
    subsections: [
      {
        title: 'Modifying Adjectives',
        content: 'Degree adverbs go before adjectives:',
        conjugationTable: {
          title: 'Adverb + Adjective',
          conjugations: [
            { pronoun: 'très + adjective', form: 'très beau', english: 'very beautiful' },
            { pronoun: 'assez + adjective', form: 'assez grand', english: 'quite tall' },
            { pronoun: 'trop + adjective', form: 'trop cher', english: 'too expensive' },
            { pronoun: 'plutôt + adjective', form: 'plutôt joli', english: 'rather pretty' }
          ]
        }
      },
      {
        title: 'Modifying Verbs',
        content: 'Degree adverbs usually go after verbs:',
        examples: [
          {
            spanish: 'Il mange beaucoup. (He eats a lot.)',
            english: 'Elle travaille énormément. (She works enormously.)',
            highlight: ['mange beaucoup', 'travaille énormément']
          }
        ]
      },
      {
        title: 'With Comparatives',
        content: 'Special placement with comparative structures:',
        examples: [
          {
            spanish: 'beaucoup plus grand (much taller)',
            english: 'un peu moins cher (a little less expensive)',
            highlight: ['beaucoup plus', 'un peu moins']
          }
        ]
      }
    ]
  },
  {
    title: 'Degree Adverbs in Context',
    content: `How degree adverbs change meaning and tone:`,
    examples: [
      {
        spanish: 'Il est intelligent. (He is intelligent.) - neutral',
        english: 'Il est très intelligent. (He is very intelligent.) - positive emphasis',
        highlight: ['intelligent', 'très intelligent']
      },
      {
        spanish: 'Il est assez intelligent. (He is quite intelligent.) - moderate praise',
        english: 'Il est trop intelligent. (He is too intelligent.) - possibly problematic',
        highlight: ['assez intelligent', 'trop intelligent']
      }
    ],
    subsections: [
      {
        title: 'Emotional Nuances',
        content: 'How different degree adverbs affect tone:',
        examples: [
          {
            spanish: 'Positive: vraiment beau (really beautiful)',
            english: 'Neutral: assez beau (quite beautiful)',
            highlight: ['vraiment beau', 'assez beau']
          },
          {
            spanish: 'Critical: trop bruyant (too noisy)',
            english: 'Mild: un peu bruyant (a little noisy)',
            highlight: ['trop bruyant', 'un peu bruyant']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Degree Adverb Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong placement**: Putting degree adverbs after adjectives
**2. Overuse of très**: Using très with everything instead of variety
**3. Trop confusion**: Using trop when assez is more appropriate
**4. Beaucoup with adjectives**: Using beaucoup directly with adjectives`,
    examples: [
      {
        spanish: '❌ Il est intelligent très → ✅ Il est très intelligent',
        english: 'Wrong: degree adverbs go before adjectives',
        highlight: ['très intelligent']
      },
      {
        spanish: '❌ Il est beaucoup intelligent → ✅ Il est très intelligent',
        english: 'Wrong: use très, not beaucoup, with adjectives',
        highlight: ['très intelligent']
      },
      {
        spanish: '❌ C\'est trop bon (when you like it) → ✅ C\'est très bon',
        english: 'Wrong: trop implies excess/problem, use très for positive',
        highlight: ['très bon']
      },
      {
        spanish: '❌ Elle est très très très belle → ✅ Elle est vraiment belle',
        english: 'Wrong: avoid repetition, use stronger adverbs',
        highlight: ['vraiment belle']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Comparative Adjectives', url: '/grammar/french/adjectives/comparative', difficulty: 'intermediate' },
  { title: 'French Adverb Placement', url: '/grammar/french/adverbs/placement', difficulty: 'intermediate' },
  { title: 'French Adjective Agreement', url: '/grammar/french/adjectives/agreement-rules', difficulty: 'beginner' },
  { title: 'French Quantities', url: '/grammar/french/expressions/quantities', difficulty: 'intermediate' }
];

export default function FrenchDegreeAdverbsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'adverbs',
              topic: 'degree',
              title: 'French Degree Adverbs (Très, Assez, Trop, Plutôt)',
              description: 'Master French degree adverbs for expressing intensity and extent. Learn très, assez, trop, plutôt, and how they modify adjectives and adverbs.',
              difficulty: 'beginner',
              examples: [
                'Elle est très intelligente (She is very intelligent)',
                'Il mange assez bien (He eats quite well)',
                'C\'est trop cher (It\'s too expensive)',
                'Tu es plutôt sympa (You are rather nice)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adverbs',
              topic: 'degree',
              title: 'French Degree Adverbs (Très, Assez, Trop, Plutôt)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adverbs"
        topic="degree"
        title="French Degree Adverbs (Très, Assez, Trop, Plutôt)"
        description="Master French degree adverbs for expressing intensity and extent. Learn très, assez, trop, plutôt, and how they modify adjectives and adverbs"
        difficulty="beginner"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/french/adverbs"
        practiceUrl="/grammar/french/adverbs/degree/practice"
        quizUrl="/grammar/french/adverbs/degree/quiz"
        songUrl="/songs/fr?theme=grammar&topic=degree"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
