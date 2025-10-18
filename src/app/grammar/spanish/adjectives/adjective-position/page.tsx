import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';

export const metadata: Metadata = {
  title: 'Spanish Adjective Position - LanguageGems',
  description: 'Learn the rules for Spanish adjective position. Understand when adjectives go before or after nouns and how position affects meaning.',
  keywords: 'Spanish adjectives, adjective position, Spanish grammar, before after nouns, adjective placement, Spanish word order',
  openGraph: {
    title: 'Spanish Adjective Position - LanguageGems',
    description: 'Learn the rules for Spanish adjective position and placement.',
    type: 'article',
  },
};

export default function SpanishAdjectivePositionPage() {
  const sections = [
    {
      title: 'Overview',
      content: 'In Spanish, the position of an adjective relative to the noun it modifies is very important. Unlike English, where adjectives almost always come before the noun, Spanish adjectives can come either before or after the noun, and the position often changes the meaning or emphasis of the phrase. Understanding adjective position is crucial for natural-sounding Spanish.'
    },
    {
      title: 'Adjectives That Go After the Noun',
      content: 'Most Spanish adjectives go after the noun they modify. This is the default position for descriptive adjectives that specify a quality or characteristic of the noun.',
      subsections: [
        {
          title: 'Color Adjectives',
          content: 'All color adjectives go after the noun. These describe the color of the noun.',
          examples: [
            {
              spanish: 'una casa blanca',
              english: 'a white house',
              highlight: ['blanca']
            },
            {
              spanish: 'el coche rojo',
              english: 'the red car',
              highlight: ['rojo']
            },
            {
              spanish: 'los ojos azules',
              english: 'the blue eyes',
              highlight: ['azules']
            },
            {
              spanish: 'la puerta negra',
              english: 'the black door',
              highlight: ['negra']
            }
          ]
        },
        {
          title: 'Nationality and Origin Adjectives',
          content: 'Adjectives indicating nationality or origin always go after the noun.',
          examples: [
            {
              spanish: 'un estudiante mexicano',
              english: 'a Mexican student',
              highlight: ['mexicano']
            },
            {
              spanish: 'la comida española',
              english: 'Spanish food',
              highlight: ['española']
            },
            {
              spanish: 'los vinos franceses',
              english: 'French wines',
              highlight: ['franceses']
            }
          ]
        },
        {
          title: 'Material and Composition Adjectives',
          content: 'Adjectives describing what something is made of go after the noun.',
          examples: [
            {
              spanish: 'una mesa de madera',
              english: 'a wooden table',
              highlight: ['madera']
            },
            {
              spanish: 'un anillo de oro',
              english: 'a gold ring',
              highlight: ['oro']
            },
            {
              spanish: 'una camisa de algodón',
              english: 'a cotton shirt',
              highlight: ['algodón']
            }
          ]
        },
        {
          title: 'Shape and Size Adjectives',
          content: 'Adjectives describing shape and size typically go after the noun.',
          examples: [
            {
              spanish: 'una mesa redonda',
              english: 'a round table',
              highlight: ['redonda']
            },
            {
              spanish: 'un hombre alto',
              english: 'a tall man',
              highlight: ['alto']
            },
            {
              spanish: 'una caja cuadrada',
              english: 'a square box',
              highlight: ['cuadrada']
            }
          ]
        },
        {
          title: 'Adjectives Ending in -ible, -able, -oso, -ista',
          content: 'These types of adjectives typically go after the noun.',
          examples: [
            {
              spanish: 'un libro interesante',
              english: 'an interesting book',
              highlight: ['interesante']
            },
            {
              spanish: 'una persona responsable',
              english: 'a responsible person',
              highlight: ['responsable']
            },
            {
              spanish: 'un día hermoso',
              english: 'a beautiful day',
              highlight: ['hermoso']
            }
          ]
        }
      ]
    },
    {
      title: 'Adjectives That Go Before the Noun',
      content: 'Some adjectives typically go before the noun. These are often called "limiting adjectives" because they limit or specify the noun rather than describe it.',
      subsections: [
        {
          title: 'Quantity Adjectives',
          content: 'Adjectives indicating quantity go before the noun.',
          examples: [
            {
              spanish: 'muchos libros',
              english: 'many books',
              highlight: ['muchos']
            },
            {
              spanish: 'pocos estudiantes',
              english: 'few students',
              highlight: ['pocos']
            },
            {
              spanish: 'varios amigos',
              english: 'several friends',
              highlight: ['varios']
            },
            {
              spanish: 'algunos problemas',
              english: 'some problems',
              highlight: ['algunos']
            }
          ]
        },
        {
          title: 'Demonstrative Adjectives',
          content: 'Demonstrative adjectives (this, that, these, those) go before the noun.',
          examples: [
            {
              spanish: 'este libro',
              english: 'this book',
              highlight: ['este']
            },
            {
              spanish: 'ese coche',
              english: 'that car',
              highlight: ['ese']
            },
            {
              spanish: 'aquella casa',
              english: 'that house (over there)',
              highlight: ['aquella']
            }
          ]
        },
        {
          title: 'Possessive Adjectives',
          content: 'Possessive adjectives (my, your, his, her, etc.) go before the noun.',
          examples: [
            {
              spanish: 'mi casa',
              english: 'my house',
              highlight: ['mi']
            },
            {
              spanish: 'tu libro',
              english: 'your book',
              highlight: ['tu']
            },
            {
              spanish: 'sus amigos',
              english: 'his/her/their friends',
              highlight: ['sus']
            }
          ]
        },
        {
          title: 'Ordinal Adjectives',
          content: 'Ordinal adjectives (first, second, third, etc.) go before the noun.',
          examples: [
            {
              spanish: 'el primer día',
              english: 'the first day',
              highlight: ['primer']
            },
            {
              spanish: 'la segunda vez',
              english: 'the second time',
              highlight: ['segunda']
            },
            {
              spanish: 'el último capítulo',
              english: 'the last chapter',
              highlight: ['último']
            }
          ]
        }
      ]
    },
    {
      title: 'Adjectives That Change Meaning Based on Position',
      content: 'Some adjectives have different meanings depending on whether they come before or after the noun. This is one of the most interesting aspects of Spanish adjective position.',
      subsections: [
        {
          title: 'GRANDE (big/great)',
          content: 'Before the noun: "great" or "important"\nAfter the noun: "big" or "large" in size',
          examples: [
            {
              spanish: 'un gran hombre',
              english: 'a great man (important, famous)',
              highlight: ['gran']
            },
            {
              spanish: 'un hombre grande',
              english: 'a big man (large in size)',
              highlight: ['grande']
            },
            {
              spanish: 'una gran ciudad',
              english: 'a great city (important)',
              highlight: ['gran']
            },
            {
              spanish: 'una ciudad grande',
              english: 'a big city (large in size)',
              highlight: ['grande']
            }
          ]
        },
        {
          title: 'VIEJO (old)',
          content: 'Before the noun: "old" in the sense of longtime or familiar\nAfter the noun: "old" in age or condition',
          examples: [
            {
              spanish: 'mi viejo amigo',
              english: 'my old friend (longtime friend)',
              highlight: ['viejo']
            },
            {
              spanish: 'un amigo viejo',
              english: 'an old friend (elderly)',
              highlight: ['viejo']
            }
          ]
        },
        {
          title: 'NUEVO (new)',
          content: 'Before the noun: "new" in the sense of another or different\nAfter the noun: "new" in the sense of brand new',
          examples: [
            {
              spanish: 'un nuevo coche',
              english: 'another car / a different car',
              highlight: ['nuevo']
            },
            {
              spanish: 'un coche nuevo',
              english: 'a brand new car',
              highlight: ['nuevo']
            }
          ]
        },
        {
          title: 'POBRE (poor)',
          content: 'Before the noun: "poor" in the sense of unfortunate or pitiful\nAfter the noun: "poor" in the sense of lacking money',
          examples: [
            {
              spanish: 'el pobre hombre',
              english: 'the poor man (unfortunate)',
              highlight: ['pobre']
            },
            {
              spanish: 'el hombre pobre',
              english: 'the poor man (lacking money)',
              highlight: ['pobre']
            }
          ]
        }
      ]
    },
    {
      title: 'Adjectives That Shorten Before Nouns',
      content: 'Some adjectives have shortened forms when they appear before certain nouns.',
      subsections: [
        {
          title: 'BUENO (good) → BUEN',
          content: 'Bueno becomes buen before masculine singular nouns.',
          examples: [
            {
              spanish: 'un buen estudiante',
              english: 'a good student',
              highlight: ['buen']
            },
            {
              spanish: 'un buen día',
              english: 'a good day',
              highlight: ['buen']
            },
            {
              spanish: 'una buena estudiante',
              english: 'a good student (female)',
              highlight: ['buena']
            }
          ]
        },
        {
          title: 'MALO (bad) → MAL',
          content: 'Malo becomes mal before masculine singular nouns.',
          examples: [
            {
              spanish: 'un mal día',
              english: 'a bad day',
              highlight: ['mal']
            },
            {
              spanish: 'un mal estudiante',
              english: 'a bad student',
              highlight: ['mal']
            }
          ]
        },
        {
          title: 'PRIMERO (first) → PRIMER',
          content: 'Primero becomes primer before masculine singular nouns.',
          examples: [
            {
              spanish: 'el primer día',
              english: 'the first day',
              highlight: ['primer']
            },
            {
              spanish: 'la primera vez',
              english: 'the first time',
              highlight: ['primera']
            }
          ]
        }
      ]
    },
    {
      title: 'Practical Examples',
      content: 'Study these sentences to see how adjective position works in context:',
      examples: [
        {
          spanish: 'Tengo un coche rojo y una casa blanca.',
          english: 'I have a red car and a white house.',
          highlight: ['rojo', 'blanca']
        },
        {
          spanish: 'Es un gran escritor con muchos libros interesantes.',
          english: 'He is a great writer with many interesting books.',
          highlight: ['gran', 'muchos', 'interesantes']
        },
        {
          spanish: 'Mi viejo amigo es un hombre grande y fuerte.',
          english: 'My old friend is a big and strong man.',
          highlight: ['viejo', 'grande', 'fuerte']
        },
        {
          spanish: 'El primer día fue un buen día en la nueva ciudad.',
          english: 'The first day was a good day in the new city.',
          highlight: ['primer', 'buen', 'nueva']
        }
      ]
    }
  ];

  return (
    <GrammarPageTemplate
      language="spanish"
      category="adjectives"
      topic="adjective-position"
      title="Adjective Position"
      description="Master Spanish adjective position rules and learn how placement affects meaning"
      difficulty="intermediate"
      estimatedTime={25}
      sections={sections}
      backUrl="/grammar/spanish"
      practiceUrl="/grammar/spanish/adjectives/adjective-position/practice"
      quizUrl="/grammar/spanish/adjectives/adjective-position/test"
      youtubeVideoId="EGaSgIRswcI"
      relatedTopics={[
        { title: 'Adjective Agreement', url: '/grammar/spanish/adjectives/adjective-agreement', difficulty: 'beginner' },
        { title: 'Comparatives', url: '/grammar/spanish/adjectives/comparatives', difficulty: 'intermediate' },
        { title: 'Superlatives', url: '/grammar/spanish/adjectives/superlatives', difficulty: 'intermediate' },
        { title: 'Spanish Word Order', url: '/grammar/spanish/syntax/word-order', difficulty: 'intermediate' }
      ]}
    />
  );
}
