import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'adjectives',
  topic: 'agreement',
  title: 'Spanish Adjective Agreement',
  description: 'Master Spanish adjective agreement rules. Learn how adjectives change to match nouns in gender and number.',
  difficulty: 'beginner',
  keywords: [
    'spanish adjective agreement',
    'adjective gender spanish',
    'adjective number spanish',
    'spanish grammar adjectives',
    'masculine feminine adjectives spanish',
    'plural adjectives spanish',
    'concordancia adjetivos'
  ],
  examples: [
    'la casa blanca (the white house)',
    'los libros rojos (the red books)',
    'una niña pequeña (a small girl)'
  ]
});

const sections = [
  {
    title: 'Spanish Adjective Agreement Overview',
    content: `Spanish adjectives must **agree** with the nouns they describe in both **gender** (masculine/feminine) and **number** (singular/plural). This is called **concordancia** in Spanish.

Unlike English, where adjectives never change form (e.g., "red car" vs "red cars"), Spanish adjectives change their endings to match the noun they modify.

**Key Rule**: Adjective endings must match the noun's gender and number.`,
    examples: [
      {
        spanish: 'el coche rojo',
        english: 'the red car (masculine singular)',
        highlight: ['rojo']
      },
      {
        spanish: 'la casa roja',
        english: 'the red house (feminine singular)',
        highlight: ['roja']
      },
      {
        spanish: 'los coches rojos',
        english: 'the red cars (masculine plural)',
        highlight: ['rojos']
      },
      {
        spanish: 'las casas rojas',
        english: 'the red houses (feminine plural)',
        highlight: ['rojas']
      }
    ]
  },
  {
    title: 'Gender Agreement Rules',
    content: `Spanish adjectives change their endings to match the gender of the noun they describe:`,
    subsections: [
      {
        title: 'Adjectives Ending in -o/-a',
        content: `Most Spanish adjectives follow the -o (masculine) / -a (feminine) pattern:`,
        conjugationTable: {
          title: 'Gender Agreement: -o/-a Adjectives',
          conjugations: [
            { pronoun: 'Masculine', form: '-o', english: 'alto, bueno, pequeño' },
            { pronoun: 'Feminine', form: '-a', english: 'alta, buena, pequeña' }
          ]
        },
        examples: [
          {
            spanish: 'el niño alto / la niña alta',
            english: 'the tall boy / the tall girl',
            highlight: ['alto', 'alta']
          },
          {
            spanish: 'un libro bueno / una película buena',
            english: 'a good book / a good movie',
            highlight: ['bueno', 'buena']
          },
          {
            spanish: 'el perro pequeño / la gata pequeña',
            english: 'the small dog / the small cat',
            highlight: ['pequeño', 'pequeña']
          }
        ]
      },
      {
        title: 'Adjectives Ending in -e',
        content: `Adjectives ending in -e have the same form for both masculine and feminine:`,
        conjugationTable: {
          title: 'Gender Agreement: -e Adjectives',
          conjugations: [
            { pronoun: 'Masculine', form: '-e', english: 'grande, inteligente, fuerte' },
            { pronoun: 'Feminine', form: '-e', english: 'grande, inteligente, fuerte' }
          ]
        },
        examples: [
          {
            spanish: 'el hombre inteligente / la mujer inteligente',
            english: 'the intelligent man / the intelligent woman',
            highlight: ['inteligente']
          },
          {
            spanish: 'un edificio grande / una casa grande',
            english: 'a big building / a big house',
            highlight: ['grande']
          },
          {
            spanish: 'el atleta fuerte / la atleta fuerte',
            english: 'the strong athlete (m) / the strong athlete (f)',
            highlight: ['fuerte']
          }
        ]
      },
      {
        title: 'Adjectives Ending in Consonants',
        content: `Most adjectives ending in consonants have the same form for both genders:`,
        conjugationTable: {
          title: 'Gender Agreement: Consonant Adjectives',
          conjugations: [
            { pronoun: 'Masculine', form: 'consonant', english: 'fácil, difícil, popular' },
            { pronoun: 'Feminine', form: 'consonant', english: 'fácil, difícil, popular' }
          ]
        },
        examples: [
          {
            spanish: 'el examen fácil / la tarea fácil',
            english: 'the easy exam / the easy homework',
            highlight: ['fácil']
          },
          {
            spanish: 'un problema difícil / una situación difícil',
            english: 'a difficult problem / a difficult situation',
            highlight: ['difícil']
          },
          {
            spanish: 'el cantante popular / la cantante popular',
            english: 'the popular singer (m) / the popular singer (f)',
            highlight: ['popular']
          }
        ]
      }
    ]
  },
  {
    title: 'Number Agreement Rules',
    content: `Spanish adjectives must also agree in number (singular/plural) with the nouns they describe:`,
    subsections: [
      {
        title: 'Making Adjectives Plural',
        content: `The rules for making adjectives plural are similar to making nouns plural:

**Adjectives ending in vowel**: Add -s
**Adjectives ending in consonant**: Add -es`,
        conjugationTable: {
          title: 'Number Agreement Rules',
          conjugations: [
            { pronoun: 'Vowel + s', form: 'alto → altos', english: 'rojo → rojos, grande → grandes' },
            { pronoun: 'Consonant + es', form: 'fácil → fáciles', english: 'popular → populares' }
          ]
        },
        examples: [
          {
            spanish: 'los coches rojos',
            english: 'the red cars (rojo + s = rojos)',
            highlight: ['rojos']
          },
          {
            spanish: 'las casas grandes',
            english: 'the big houses (grande + s = grandes)',
            highlight: ['grandes']
          },
          {
            spanish: 'los exámenes fáciles',
            english: 'the easy exams (fácil + es = fáciles)',
            highlight: ['fáciles']
          }
        ]
      }
    ]
  },
  {
    title: 'Complete Agreement Pattern',
    content: `When adjectives must agree in both gender and number, they follow this complete pattern:`,
    subsections: [
      {
        title: 'Four-Form Agreement (-o/-a adjectives)',
        content: `Adjectives ending in -o/-a have four different forms:`,
        conjugationTable: {
          title: 'Complete Agreement: Rojo (Red)',
          conjugations: [
            { pronoun: 'Masculine Singular', form: 'rojo', english: 'el coche rojo' },
            { pronoun: 'Feminine Singular', form: 'roja', english: 'la casa roja' },
            { pronoun: 'Masculine Plural', form: 'rojos', english: 'los coches rojos' },
            { pronoun: 'Feminine Plural', form: 'rojas', english: 'las casas rojas' }
          ]
        },
        examples: [
          {
            spanish: 'Tengo un gato negro y una gata negra.',
            english: 'I have a black cat (m) and a black cat (f).',
            highlight: ['negro', 'negra']
          },
          {
            spanish: 'Los zapatos nuevos y las camisas nuevas.',
            english: 'The new shoes and the new shirts.',
            highlight: ['nuevos', 'nuevas']
          }
        ]
      },
      {
        title: 'Two-Form Agreement (-e and consonant adjectives)',
        content: `Adjectives ending in -e or consonants have only two forms:`,
        conjugationTable: {
          title: 'Two-Form Agreement: Grande (Big)',
          conjugations: [
            { pronoun: 'Singular', form: 'grande', english: 'el/la estudiante grande' },
            { pronoun: 'Plural', form: 'grandes', english: 'los/las estudiantes grandes' }
          ]
        },
        examples: [
          {
            spanish: 'El problema difícil y los problemas difíciles.',
            english: 'The difficult problem and the difficult problems.',
            highlight: ['difícil', 'difíciles']
          }
        ]
      }
    ]
  },
  {
    title: 'Special Agreement Cases',
    content: `Some adjectives have special agreement patterns or exceptions:`,
    subsections: [
      {
        title: 'Nationality Adjectives',
        content: `Nationality adjectives follow special rules:

**Ending in -o**: Follow normal -o/-a pattern (mexicano/mexicana)
**Ending in consonant**: Add -a for feminine (español/española)
**Ending in -e**: No change (canadiense)`,
        examples: [
          {
            spanish: 'el chico mexicano / la chica mexicana',
            english: 'the Mexican boy / the Mexican girl',
            highlight: ['mexicano', 'mexicana']
          },
          {
            spanish: 'el profesor español / la profesora española',
            english: 'the Spanish teacher (m) / the Spanish teacher (f)',
            highlight: ['español', 'española']
          },
          {
            spanish: 'el estudiante canadiense / la estudiante canadiense',
            english: 'the Canadian student (m) / the Canadian student (f)',
            highlight: ['canadiense']
          }
        ]
      },
      {
        title: 'Shortened Adjectives',
        content: `Some adjectives shorten before masculine singular nouns:

**bueno → buen** (good)
**malo → mal** (bad)  
**grande → gran** (great/big)
**primero → primer** (first)
**tercero → tercer** (third)`,
        examples: [
          {
            spanish: 'un buen hombre / una buena mujer',
            english: 'a good man / a good woman',
            highlight: ['buen', 'buena']
          },
          {
            spanish: 'un gran día / una gran oportunidad',
            english: 'a great day / a great opportunity',
            highlight: ['gran']
          },
          {
            spanish: 'el primer capítulo / la primera página',
            english: 'the first chapter / the first page',
            highlight: ['primer', 'primera']
          }
        ]
      }
    ]
  },
  {
    title: 'Multiple Adjectives Agreement',
    content: `When multiple adjectives describe the same noun, each adjective must agree independently:

**Rule**: Each adjective agrees with the noun it modifies
**Position**: Multiple adjectives can go before and/or after the noun

This is common when giving detailed descriptions.`,
    examples: [
      {
        spanish: 'una casa grande y blanca',
        english: 'a big and white house (both adjectives agree with "casa")',
        highlight: ['grande', 'blanca']
      },
      {
        spanish: 'los coches nuevos y rojos',
        english: 'the new and red cars (both adjectives agree with "coches")',
        highlight: ['nuevos', 'rojos']
      },
      {
        spanish: 'una buena película española',
        english: 'a good Spanish movie (both adjectives agree with "película")',
        highlight: ['buena', 'española']
      },
      {
        spanish: 'unos estudiantes inteligentes y trabajadores',
        english: 'some intelligent and hardworking students',
        highlight: ['inteligentes', 'trabajadores']
      }
    ]
  },
  {
    title: 'Common Agreement Mistakes',
    content: `Here are the most common mistakes Spanish learners make with adjective agreement:

**Mistake 1**: Forgetting to change the adjective ending
**Mistake 2**: Using masculine form with feminine nouns
**Mistake 3**: Forgetting plural agreement
**Mistake 4**: Incorrect nationality adjective forms

Learning to avoid these mistakes will make your Spanish sound much more natural.`,
    examples: [
      {
        spanish: '❌ la casa rojo → ✅ la casa roja',
        english: 'Wrong: the red house → Right: the red house',
        highlight: ['rojo', 'roja']
      },
      {
        spanish: '❌ los libro grande → ✅ los libros grandes',
        english: 'Wrong: the big books → Right: the big books',
        highlight: ['libro grande', 'libros grandes']
      },
      {
        spanish: '❌ la profesora español → ✅ la profesora española',
        english: 'Wrong: the Spanish teacher → Right: the Spanish teacher',
        highlight: ['español', 'española']
      },
      {
        spanish: '❌ una bueno idea → ✅ una buena idea',
        english: 'Wrong: a good idea → Right: a good idea',
        highlight: ['bueno', 'buena']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'Spanish Adjective Position',
    url: '/grammar/spanish/adjectives/position',
    difficulty: 'intermediate'
  },
  {
    title: 'Spanish Noun Gender',
    url: '/grammar/spanish/nouns/gender',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Articles',
    url: '/grammar/spanish/nouns/articles',
    difficulty: 'beginner'
  },
  {
    title: 'Demonstrative Adjectives',
    url: '/grammar/spanish/adjectives/demonstrative',
    difficulty: 'beginner'
  }
];

export default function SpanishAdjectiveAgreementPage() {
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
              topic: 'agreement',
              title: 'Spanish Adjective Agreement',
              description: 'Master Spanish adjective agreement rules. Learn how adjectives change to match nouns in gender and number.',
              difficulty: 'beginner',
              examples: [
                'la casa blanca (the white house)',
                'los libros rojos (the red books)',
                'una niña pequeña (a small girl)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'adjectives',
              topic: 'agreement',
              title: 'Spanish Adjective Agreement'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="adjectives"
        topic="agreement"
        title="Spanish Adjective Agreement"
        description="Master Spanish adjective agreement rules. Learn how adjectives change to match nouns in gender and number"
        difficulty="beginner"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/spanish"
        practiceUrl="/grammar/spanish/adjectives/agreement/practice"
        quizUrl="/grammar/spanish/adjectives/agreement/quiz"
        songUrl="/songs/es?theme=grammar&topic=adjective-agreement"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
