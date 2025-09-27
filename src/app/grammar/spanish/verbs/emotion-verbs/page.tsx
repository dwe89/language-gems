import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'emotion-verbs',
  title: 'Spanish Emotion Verbs - Feelings and Psychological States',
  description: 'Learn Spanish emotion verbs including gustar, encantar, molestar, and other verbs expressing feelings, emotions, and psychological states.',
  difficulty: 'intermediate',
  keywords: ['spanish emotion verbs', 'feeling verbs', 'gustar', 'encantar', 'molestar', 'psychological verbs', 'emotional expressions'],
  examples: ['Me gusta la música', 'Le encanta bailar', 'Nos molesta el ruido', 'Te preocupa el examen']
});

const sections = [
  {
    title: 'Understanding Emotion Verbs',
    content: 'Spanish emotion verbs express **feelings**, **emotions**, and **psychological states**. Many follow the "gustar" pattern where the thing causing the emotion is the subject, and the person experiencing it is the indirect object.',
    examples: [
      {
        spanish: 'Me gusta la música.',
        english: 'I like music. (Music pleases me)',
        highlight: ['Me gusta']
      },
      {
        spanish: 'Le encanta bailar.',
        english: 'She loves dancing. (Dancing delights her)',
        highlight: ['Le encanta']
      },
      {
        spanish: 'Nos preocupa el futuro.',
        english: 'The future worries us.',
        highlight: ['Nos preocupa']
      }
    ]
  },
  {
    title: 'GUSTAR - Liking/Pleasing',
    content: 'The verb **"gustar"** means "to please" or "to be pleasing to." The person who likes something is the indirect object, not the subject.',
    examples: [
      {
        spanish: 'Me gusta el chocolate.',
        english: 'I like chocolate. (Chocolate pleases me)',
        highlight: ['Me gusta']
      },
      {
        spanish: 'Te gustan los deportes.',
        english: 'You like sports. (Sports please you)',
        highlight: ['Te gustan']
      },
      {
        spanish: 'Les gusta viajar.',
        english: 'They like traveling. (Traveling pleases them)',
        highlight: ['Les gusta']
      }
    ],
    subsections: [
      {
        title: 'GUSTAR Conjugation Pattern',
        content: 'GUSTAR typically uses only third person forms.',
        conjugationTable: {
          title: 'GUSTAR Pattern',
          conjugations: [
            { pronoun: 'me', form: 'me gusta/gustan', english: 'I like (it pleases me)' },
            { pronoun: 'te', form: 'te gusta/gustan', english: 'you like (it pleases you)' },
            { pronoun: 'le', form: 'le gusta/gustan', english: 'he/she likes (it pleases him/her)' },
            { pronoun: 'nos', form: 'nos gusta/gustan', english: 'we like (it pleases us)' },
            { pronoun: 'os', form: 'os gusta/gustan', english: 'you all like (it pleases you all)' },
            { pronoun: 'les', form: 'les gusta/gustan', english: 'they like (it pleases them)' }
          ]
        }
      },
      {
        title: 'Singular vs Plural with GUSTAR',
        content: 'Use "gusta" with singular nouns/infinitives, "gustan" with plural nouns.',
        examples: [
          {
            spanish: 'Me gusta la pizza. (singular)',
            english: 'I like pizza.',
            highlight: ['gusta']
          },
          {
            spanish: 'Me gustan las pizzas. (plural)',
            english: 'I like pizzas.',
            highlight: ['gustan']
          },
          {
            spanish: 'Me gusta comer. (infinitive)',
            english: 'I like to eat.',
            highlight: ['gusta']
          }
        ]
      }
    ]
  },
  {
    title: 'ENCANTAR - Loving/Delighting',
    content: 'The verb **"encantar"** expresses strong liking or love, meaning "to delight" or "to enchant."',
    examples: [
      {
        spanish: 'Me encanta la música clásica.',
        english: 'I love classical music.',
        highlight: ['Me encanta']
      },
      {
        spanish: 'Le encantan los libros.',
        english: 'He loves books.',
        highlight: ['Le encantan']
      },
      {
        spanish: 'Nos encanta viajar.',
        english: 'We love traveling.',
        highlight: ['Nos encanta']
      }
    ],
    subsections: [
      {
        title: 'ENCANTAR vs GUSTAR',
        content: 'ENCANTAR expresses stronger emotion than GUSTAR.',
        conjugationTable: {
          title: 'Intensity Comparison',
          conjugations: [
            { pronoun: 'gustar', form: 'me gusta', english: 'I like (mild preference)' },
            { pronoun: 'encantar', form: 'me encanta', english: 'I love (strong preference)' },
            { pronoun: 'gustar mucho', form: 'me gusta mucho', english: 'I really like' },
            { pronoun: 'encantar', form: 'me encanta', english: 'I absolutely love' },
            { pronoun: 'gustar bastante', form: 'me gusta bastante', english: 'I quite like' },
            { pronoun: 'encantar', form: 'me encanta', english: 'I adore' }
          ]
        }
      }
    ]
  },
  {
    title: 'MOLESTAR - Bothering/Annoying',
    content: 'The verb **"molestar"** means "to bother" or "to annoy," expressing negative emotions.',
    examples: [
      {
        spanish: 'Me molesta el ruido.',
        english: 'Noise bothers me.',
        highlight: ['Me molesta']
      },
      {
        spanish: 'Le molestan las interrupciones.',
        english: 'Interruptions bother him.',
        highlight: ['Le molestan']
      },
      {
        spanish: 'Nos molesta esperar.',
        english: 'Waiting bothers us.',
        highlight: ['Nos molesta']
      }
    ],
    subsections: [
      {
        title: 'Negative Emotion Verbs',
        content: 'Verbs expressing annoyance and displeasure.',
        conjugationTable: {
          title: 'Negative Emotion Verbs',
          conjugations: [
            { pronoun: 'molestar', form: 'me molesta', english: 'it bothers me' },
            { pronoun: 'fastidiar', form: 'me fastidia', english: 'it annoys me' },
            { pronoun: 'irritar', form: 'me irrita', english: 'it irritates me' },
            { pronoun: 'disgustar', form: 'me disgusta', english: 'it disgusts me' },
            { pronoun: 'cansar', form: 'me cansa', english: 'it tires me' },
            { pronoun: 'aburrir', form: 'me aburre', english: 'it bores me' }
          ]
        }
      }
    ]
  },
  {
    title: 'PREOCUPAR - Worrying',
    content: 'The verb **"preocupar"** means "to worry" someone, expressing concern or anxiety.',
    examples: [
      {
        spanish: 'Me preocupa el examen.',
        english: 'The exam worries me.',
        highlight: ['Me preocupa']
      },
      {
        spanish: 'Le preocupan sus hijos.',
        english: 'His children worry him.',
        highlight: ['Le preocupan']
      },
      {
        spanish: 'Nos preocupa la situación.',
        english: 'The situation worries us.',
        highlight: ['Nos preocupa']
      }
    ],
    subsections: [
      {
        title: 'PREOCUPAR vs PREOCUPARSE',
        content: 'PREOCUPAR (worry someone) vs PREOCUPARSE (worry about).',
        conjugationTable: {
          title: 'PREOCUPAR vs PREOCUPARSE',
          conjugations: [
            { pronoun: 'preocupar', form: 'me preocupa el futuro', english: 'the future worries me' },
            { pronoun: 'preocuparse', form: 'me preocupo por el futuro', english: 'I worry about the future' },
            { pronoun: 'preocupar', form: 'le preocupa María', english: 'María worries him' },
            { pronoun: 'preocuparse', form: 'se preocupa por María', english: 'he worries about María' },
            { pronoun: 'preocupar', form: 'nos preocupa el dinero', english: 'money worries us' },
            { pronoun: 'preocuparse', form: 'nos preocupamos por el dinero', english: 'we worry about money' }
          ]
        }
      }
    ]
  },
  {
    title: 'INTERESAR - Interesting',
    content: 'The verb **"interesar"** means "to interest" someone, expressing curiosity or engagement.',
    examples: [
      {
        spanish: 'Me interesa la historia.',
        english: 'History interests me.',
        highlight: ['Me interesa']
      },
      {
        spanish: 'Le interesan las ciencias.',
        english: 'Sciences interest her.',
        highlight: ['Le interesan']
      },
      {
        spanish: 'Nos interesa aprender idiomas.',
        english: 'Learning languages interests us.',
        highlight: ['Nos interesa']
      }
    ],
    subsections: [
      {
        title: 'Interest and Curiosity Verbs',
        content: 'Verbs expressing intellectual and emotional engagement.',
        conjugationTable: {
          title: 'Interest and Curiosity Verbs',
          conjugations: [
            { pronoun: 'interesar', form: 'me interesa', english: 'it interests me' },
            { pronoun: 'fascinar', form: 'me fascina', english: 'it fascinates me' },
            { pronoun: 'intrigar', form: 'me intriga', english: 'it intrigues me' },
            { pronoun: 'emocionar', form: 'me emociona', english: 'it excites me' },
            { pronoun: 'impresionar', form: 'me impresiona', english: 'it impresses me' },
            { pronoun: 'sorprender', form: 'me sorprende', english: 'it surprises me' }
          ]
        }
      }
    ]
  },
  {
    title: 'DOLER - Hurting/Aching',
    content: 'The verb **"doler"** means "to hurt" or "to ache," expressing physical or emotional pain.',
    examples: [
      {
        spanish: 'Me duele la cabeza.',
        english: 'My head hurts. (The head hurts me)',
        highlight: ['Me duele']
      },
      {
        spanish: 'Le duelen los pies.',
        english: 'His feet hurt. (The feet hurt him)',
        highlight: ['Le duelen']
      },
      {
        spanish: 'Nos duele la separación.',
        english: 'The separation hurts us.',
        highlight: ['Nos duele']
      }
    ],
    subsections: [
      {
        title: 'DOLER Conjugation',
        content: 'DOLER is a stem-changing verb (o→ue).',
        conjugationTable: {
          title: 'DOLER Pattern',
          conjugations: [
            { pronoun: 'me', form: 'me duele/duelen', english: 'it hurts me' },
            { pronoun: 'te', form: 'te duele/duelen', english: 'it hurts you' },
            { pronoun: 'le', form: 'le duele/duelen', english: 'it hurts him/her' },
            { pronoun: 'nos', form: 'nos duele/duelen', english: 'it hurts us' },
            { pronoun: 'os', form: 'os duele/duelen', english: 'it hurts you all' },
            { pronoun: 'les', form: 'les duele/duelen', english: 'it hurts them' }
          ]
        }
      },
      {
        title: 'Body Parts with DOLER',
        content: 'Common body parts used with doler.',
        examples: [
          {
            spanish: 'Me duele la espalda.',
            english: 'My back hurts.',
            highlight: ['la espalda']
          },
          {
            spanish: 'Le duelen las muelas.',
            english: 'His teeth hurt.',
            highlight: ['las muelas']
          }
        ]
      }
    ]
  },
  {
    title: 'FALTAR - Missing/Lacking',
    content: 'The verb **"faltar"** means "to be missing" or "to lack," expressing absence or need.',
    examples: [
      {
        spanish: 'Me falta dinero.',
        english: 'I lack money. (Money is missing to me)',
        highlight: ['Me falta']
      },
      {
        spanish: 'Le faltan cinco minutos.',
        english: 'He needs five more minutes. (Five minutes are missing to him)',
        highlight: ['Le faltan']
      },
      {
        spanish: 'Nos falta tiempo.',
        english: 'We lack time.',
        highlight: ['Nos falta']
      }
    ],
    subsections: [
      {
        title: 'FALTAR Usage Patterns',
        content: 'Different meanings of faltar.',
        conjugationTable: {
          title: 'FALTAR Meanings',
          conjugations: [
            { pronoun: 'Need/Lack', form: 'me falta dinero', english: 'I need money' },
            { pronoun: 'Time remaining', form: 'me faltan 5 minutos', english: 'I have 5 minutes left' },
            { pronoun: 'Distance remaining', form: 'me faltan 2 km', english: 'I have 2 km left' },
            { pronoun: 'Missing items', form: 'me faltan llaves', english: 'I\'m missing keys' },
            { pronoun: 'Absent from', form: 'me falta a clase', english: 'I\'m absent from class' },
            { pronoun: 'Disrespect', form: 'me falta al respeto', english: 'he disrespects me' }
          ]
        }
      }
    ]
  },
  {
    title: 'Other Emotion Verbs',
    content: 'Additional verbs expressing various emotions and psychological states.',
    examples: [
      {
        spanish: 'Me da miedo la oscuridad.',
        english: 'Darkness scares me.',
        highlight: ['Me da miedo']
      },
      {
        spanish: 'Le da vergüenza hablar en público.',
        english: 'Speaking in public embarrasses him.',
        highlight: ['Le da vergüenza']
      },
      {
        spanish: 'Nos da pena verla triste.',
        english: 'It makes us sad to see her sad.',
        highlight: ['Nos da pena']
      }
    ],
    subsections: [
      {
        title: 'DAR + Emotion Expressions',
        content: 'Using DAR with emotion nouns.',
        conjugationTable: {
          title: 'DAR + Emotion Patterns',
          conjugations: [
            { pronoun: 'dar miedo', form: 'me da miedo', english: 'it scares me' },
            { pronoun: 'dar vergüenza', form: 'me da vergüenza', english: 'it embarrasses me' },
            { pronoun: 'dar pena', form: 'me da pena', english: 'it makes me sad' },
            { pronoun: 'dar rabia', form: 'me da rabia', english: 'it makes me angry' },
            { pronoun: 'dar asco', form: 'me da asco', english: 'it disgusts me' },
            { pronoun: 'dar envidia', form: 'me da envidia', english: 'it makes me envious' }
          ]
        }
      },
      {
        title: 'Complex Emotion Verbs',
        content: 'More sophisticated emotion expressions.',
        examples: [
          {
            spanish: 'Me llama la atención su comportamiento.',
            english: 'His behavior catches my attention.',
            highlight: ['Me llama la atención']
          },
          {
            spanish: 'Le hace ilusión el viaje.',
            english: 'The trip excites her.',
            highlight: ['Le hace ilusión']
          }
        ]
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Ser vs Estar', url: '/grammar/spanish/verbs/ser-vs-estar', difficulty: 'beginner' },
  { title: 'Stem-changing Verbs', url: '/grammar/spanish/verbs/stem-changing', difficulty: 'intermediate' },
  { title: 'Subjunctive Imperfect', url: '/grammar/spanish/verbs/subjunctive-imperfect', difficulty: 'advanced' },
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' }
];

export default function SpanishEmotionVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Emotion Verbs - Feelings and Psychological States',
            description: 'Learn Spanish emotion verbs including gustar, encantar, molestar, and other verbs expressing feelings, emotions, and psychological states.',
            keywords: ['spanish emotion verbs', 'feeling verbs', 'gustar', 'encantar', 'molestar', 'psychological verbs'],
            language: 'spanish',
            category: 'verbs',
            topic: 'emotion-verbs'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="emotion-verbs"
        title="Spanish Emotion Verbs"
        description="Learn Spanish emotion verbs including gustar, encantar, molestar, and other verbs expressing feelings, emotions, and psychological states."
        difficulty="intermediate"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/emotion-verbs/practice"
        quizUrl="/grammar/spanish/verbs/emotion-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=emotion-verbs"
        youtubeVideoId="emotion-verbs-spanish"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
