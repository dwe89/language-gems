import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'adjectives',
  topic: 'demonstrative',
  title: 'Spanish Demonstrative Adjectives',
  description: 'Master Spanish demonstrative adjectives: este, ese, aquel and their forms. Learn to point out specific people and things.',
  difficulty: 'beginner',
  keywords: [
    'spanish demonstrative adjectives',
    'este ese aquel spanish',
    'demonstratives spanish',
    'spanish grammar demonstratives',
    'adjetivos demostrativos español',
    'this that spanish'
  ],
  examples: [
    'este libro (this book)',
    'esa casa (that house)',
    'aquellas montañas (those mountains over there)'
  ]
});

const sections = [
  {
    title: 'Spanish Demonstrative Adjectives Overview',
    content: `Spanish demonstrative adjectives point out specific people, places, or things. They indicate **distance** from the speaker and **agree** with the noun in gender and number.

**Three levels of distance**:
- **este/esta** = this (close to speaker)
- **ese/esa** = that (close to listener)  
- **aquel/aquella** = that (far from both)

**Key Rule**: Demonstratives always go **before** the noun and must agree in gender and number.`,
    examples: [
      {
        spanish: 'este libro',
        english: 'this book (close to me)',
        highlight: ['este']
      },
      {
        spanish: 'esa mesa',
        english: 'that table (close to you)',
        highlight: ['esa']
      },
      {
        spanish: 'aquella montaña',
        english: 'that mountain (far from both of us)',
        highlight: ['aquella']
      }
    ]
  },
  {
    title: 'Este/Esta/Estos/Estas (This/These)',
    content: `Use **este** forms to point out things **close to the speaker** (near me):`,
    subsections: [
      {
        title: 'Forms of Este',
        content: `Este changes form to agree with the noun:`,
        conjugationTable: {
          title: 'Este Forms (This/These)',
          conjugations: [
            { pronoun: 'Masculine Singular', form: 'este', english: 'this (m.s.)' },
            { pronoun: 'Feminine Singular', form: 'esta', english: 'this (f.s.)' },
            { pronoun: 'Masculine Plural', form: 'estos', english: 'these (m.p.)' },
            { pronoun: 'Feminine Plural', form: 'estas', english: 'these (f.p.)' }
          ]
        },
        examples: [
          {
            spanish: 'este coche',
            english: 'this car (masculine singular)',
            highlight: ['este']
          },
          {
            spanish: 'esta casa',
            english: 'this house (feminine singular)',
            highlight: ['esta']
          },
          {
            spanish: 'estos libros',
            english: 'these books (masculine plural)',
            highlight: ['estos']
          },
          {
            spanish: 'estas flores',
            english: 'these flowers (feminine plural)',
            highlight: ['estas']
          }
        ]
      },
      {
        title: 'Using Este in Context',
        content: `Este indicates things physically or conceptually close to the speaker:`,
        examples: [
          {
            spanish: 'Este restaurante es muy bueno.',
            english: 'This restaurant is very good. (the one I\'m at/near)',
            highlight: ['Este']
          },
          {
            spanish: 'Esta semana tengo mucho trabajo.',
            english: 'This week I have a lot of work. (current week)',
            highlight: ['Esta']
          },
          {
            spanish: 'Estos estudiantes son muy inteligentes.',
            english: 'These students are very intelligent. (the ones near me)',
            highlight: ['Estos']
          },
          {
            spanish: 'Me gustan estas canciones.',
            english: 'I like these songs. (the ones I\'m listening to)',
            highlight: ['estas']
          }
        ]
      }
    ]
  },
  {
    title: 'Ese/Esa/Esos/Esas (That/Those)',
    content: `Use **ese** forms to point out things **close to the listener** (near you):`,
    subsections: [
      {
        title: 'Forms of Ese',
        content: `Ese changes form to agree with the noun:`,
        conjugationTable: {
          title: 'Ese Forms (That/Those)',
          conjugations: [
            { pronoun: 'Masculine Singular', form: 'ese', english: 'that (m.s.)' },
            { pronoun: 'Feminine Singular', form: 'esa', english: 'that (f.s.)' },
            { pronoun: 'Masculine Plural', form: 'esos', english: 'those (m.p.)' },
            { pronoun: 'Feminine Plural', form: 'esas', english: 'those (f.p.)' }
          ]
        },
        examples: [
          {
            spanish: 'ese perro',
            english: 'that dog (masculine singular)',
            highlight: ['ese']
          },
          {
            spanish: 'esa bicicleta',
            english: 'that bicycle (feminine singular)',
            highlight: ['esa']
          },
          {
            spanish: 'esos zapatos',
            english: 'those shoes (masculine plural)',
            highlight: ['esos']
          },
          {
            spanish: 'esas mesas',
            english: 'those tables (feminine plural)',
            highlight: ['esas']
          }
        ]
      },
      {
        title: 'Using Ese in Context',
        content: `Ese indicates things close to the person you\'re talking to:`,
        examples: [
          {
            spanish: '¿Te gusta ese libro que tienes?',
            english: 'Do you like that book you have? (the one near you)',
            highlight: ['ese']
          },
          {
            spanish: 'Esa camisa te queda muy bien.',
            english: 'That shirt looks very good on you. (the one you\'re wearing)',
            highlight: ['Esa']
          },
          {
            spanish: '¿Cuánto cuestan esos pantalones?',
            english: 'How much do those pants cost? (the ones you\'re looking at)',
            highlight: ['esos']
          },
          {
            spanish: 'Esas ideas son muy interesantes.',
            english: 'Those ideas are very interesting. (the ones you mentioned)',
            highlight: ['Esas']
          }
        ]
      }
    ]
  },
  {
    title: 'Aquel/Aquella/Aquellos/Aquellas (That/Those Over There)',
    content: `Use **aquel** forms to point out things **far from both speaker and listener**:`,
    subsections: [
      {
        title: 'Forms of Aquel',
        content: `Aquel changes form to agree with the noun:`,
        conjugationTable: {
          title: 'Aquel Forms (That/Those Over There)',
          conjugations: [
            { pronoun: 'Masculine Singular', form: 'aquel', english: 'that (m.s.) over there' },
            { pronoun: 'Feminine Singular', form: 'aquella', english: 'that (f.s.) over there' },
            { pronoun: 'Masculine Plural', form: 'aquellos', english: 'those (m.p.) over there' },
            { pronoun: 'Feminine Plural', form: 'aquellas', english: 'those (f.p.) over there' }
          ]
        },
        examples: [
          {
            spanish: 'aquel edificio',
            english: 'that building over there (masculine singular)',
            highlight: ['aquel']
          },
          {
            spanish: 'aquella montaña',
            english: 'that mountain over there (feminine singular)',
            highlight: ['aquella']
          },
          {
            spanish: 'aquellos árboles',
            english: 'those trees over there (masculine plural)',
            highlight: ['aquellos']
          },
          {
            spanish: 'aquellas nubes',
            english: 'those clouds over there (feminine plural)',
            highlight: ['aquellas']
          }
        ]
      },
      {
        title: 'Using Aquel in Context',
        content: `Aquel indicates things distant from both speaker and listener, or things in the past:`,
        examples: [
          {
            spanish: '¿Ves aquel castillo en la colina?',
            english: 'Do you see that castle on the hill? (far away)',
            highlight: ['aquel']
          },
          {
            spanish: 'Aquella época fue muy difícil.',
            english: 'That time/era was very difficult. (distant past)',
            highlight: ['Aquella']
          },
          {
            spanish: 'Aquellos días en París fueron increíbles.',
            english: 'Those days in Paris were incredible. (distant past)',
            highlight: ['Aquellos']
          },
          {
            spanish: 'Me acuerdo de aquellas vacaciones.',
            english: 'I remember those vacations. (distant past)',
            highlight: ['aquellas']
          }
        ]
      }
    ]
  },
  {
    title: 'Distance and Context Rules',
    content: `The choice between este, ese, and aquel depends on physical and conceptual distance:`,
    subsections: [
      {
        title: 'Physical Distance',
        content: `Use demonstratives based on physical proximity:

**Este**: Object is close to speaker
**Ese**: Object is close to listener  
**Aquel**: Object is far from both`,
        examples: [
          {
            spanish: 'Este bolígrafo (en mi mano) escribe bien.',
            english: 'This pen (in my hand) writes well.',
            highlight: ['Este']
          },
          {
            spanish: 'Ese libro (en tu mesa) parece interesante.',
            english: 'That book (on your table) looks interesting.',
            highlight: ['Ese']
          },
          {
            spanish: 'Aquel coche (en la calle) es muy caro.',
            english: 'That car (on the street) is very expensive.',
            highlight: ['Aquel']
          }
        ]
      },
      {
        title: 'Temporal Distance',
        content: `Demonstratives also express time relationships:

**Este**: Present time, current
**Ese**: Recent past/future  
**Aquel**: Distant past`,
        examples: [
          {
            spanish: 'Este año voy a estudiar más.',
            english: 'This year I\'m going to study more. (current year)',
            highlight: ['Este']
          },
          {
            spanish: 'Ese día que mencionaste fue importante.',
            english: 'That day you mentioned was important. (recent)',
            highlight: ['Ese']
          },
          {
            spanish: 'Aquellos tiempos eran diferentes.',
            english: 'Those times were different. (long ago)',
            highlight: ['Aquellos']
          }
        ]
      }
    ]
  },
  {
    title: 'Demonstrative Adjectives vs. Pronouns',
    content: `**Important distinction**: Demonstrative adjectives go with nouns, demonstrative pronouns replace nouns.

**Adjective**: este libro (this book) - modifies "libro"
**Pronoun**: éste (this one) - replaces the noun

**Note**: Demonstrative pronouns traditionally had accent marks, but modern Spanish often omits them when context is clear.`,
    examples: [
      {
        spanish: 'Me gusta este coche, pero prefiero ese.',
        english: 'I like this car, but I prefer that one. (ese = pronoun)',
        highlight: ['este', 'ese']
      },
      {
        spanish: 'Esta casa es grande, aquella es pequeña.',
        english: 'This house is big, that one (over there) is small.',
        highlight: ['Esta', 'aquella']
      },
      {
        spanish: 'Estos libros son míos, esos son tuyos.',
        english: 'These books are mine, those are yours.',
        highlight: ['Estos', 'esos']
      }
    ]
  },
  {
    title: 'Common Uses and Expressions',
    content: `Demonstratives appear in many common Spanish expressions and situations:`,
    subsections: [
      {
        title: 'Shopping and Pointing',
        content: `Very common when shopping or indicating specific items:`,
        examples: [
          {
            spanish: '¿Cuánto cuesta esta camisa?',
            english: 'How much does this shirt cost?',
            highlight: ['esta']
          },
          {
            spanish: 'Quiero esos zapatos, por favor.',
            english: 'I want those shoes, please.',
            highlight: ['esos']
          },
          {
            spanish: 'Me gusta aquella mesa de allá.',
            english: 'I like that table over there.',
            highlight: ['aquella']
          }
        ]
      },
      {
        title: 'Time Expressions',
        content: `Common time expressions with demonstratives:`,
        examples: [
          {
            spanish: 'esta mañana',
            english: 'this morning',
            highlight: ['esta']
          },
          {
            spanish: 'ese momento',
            english: 'that moment',
            highlight: ['ese']
          },
          {
            spanish: 'aquellos días',
            english: 'those days (long ago)',
            highlight: ['aquellos']
          },
          {
            spanish: 'esta noche',
            english: 'tonight',
            highlight: ['esta']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Demonstrative Mistakes',
    content: `Here are common mistakes Spanish learners make with demonstratives:

**Mistake 1**: Forgetting gender/number agreement
**Mistake 2**: Using wrong distance level  
**Mistake 3**: Putting demonstrative after noun
**Mistake 4**: Confusing adjectives with pronouns

Learning to avoid these mistakes will make your Spanish sound natural.`,
    examples: [
      {
        spanish: '❌ este casa → ✅ esta casa',
        english: 'Wrong: this house (wrong gender) → Right: this house',
        highlight: ['este casa', 'esta casa']
      },
      {
        spanish: '❌ libro este → ✅ este libro',
        english: 'Wrong: book this → Right: this book',
        highlight: ['libro este', 'este libro']
      },
      {
        spanish: '❌ esos mesa → ✅ esas mesas',
        english: 'Wrong: those table → Right: those tables',
        highlight: ['esos mesa', 'esas mesas']
      },
      {
        spanish: '❌ aquel para cosas cerca → ✅ este para cosas cerca',
        english: 'Wrong: aquel for nearby things → Right: este for nearby things',
        highlight: ['aquel', 'este']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'Spanish Adjective Agreement',
    url: '/grammar/spanish/adjectives/agreement',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Adjective Position',
    url: '/grammar/spanish/adjectives/position',
    difficulty: 'intermediate'
  },
  {
    title: 'Spanish Possessive Pronouns',
    url: '/grammar/spanish/pronouns/possessive',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Noun Gender',
    url: '/grammar/spanish/nouns/gender',
    difficulty: 'beginner'
  }
];

export default function SpanishDemonstrativeAdjectivesPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'adjectives',
              topic: 'demonstrative',
              title: 'Spanish Demonstrative Adjectives',
              description: 'Master Spanish demonstrative adjectives: este, ese, aquel and their forms. Learn to point out specific people and things.',
              difficulty: 'beginner',
              examples: [
                'este libro (this book)',
                'esa casa (that house)',
                'aquellas montañas (those mountains over there)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'adjectives',
              topic: 'demonstrative',
              title: 'Spanish Demonstrative Adjectives'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="adjectives"
        topic="demonstrative"
        title="Spanish Demonstrative Adjectives"
        description="Master Spanish demonstrative adjectives: este, ese, aquel and their forms. Learn to point out specific people and things"
        difficulty="beginner"
        estimatedTime={8}
        sections={sections}
        backUrl="/grammar/spanish/adjectives"
        practiceUrl="/grammar/spanish/adjectives/demonstrative/practice"
        quizUrl="/grammar/spanish/adjectives/demonstrative/quiz"
        songUrl="/songs/es?theme=grammar&topic=demonstratives"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
