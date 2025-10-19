import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';

export const metadata: Metadata = {
  title: 'Spanish Noun Gender - Language Gems',
  description: 'Master Spanish noun gender rules. Learn masculine and feminine noun patterns including word endings (-ión, -dad, -eza, -mente) with comprehensive examples.',
  keywords: 'Spanish noun gender, masculine feminine nouns, Spanish grammar, noun endings, -ión, -dad, -eza, -mente',
};

export default function SpanishNounGenderPage() {
  const sections = [
    {
      title: 'Overview',
      content: 'Every Spanish noun has a grammatical gender: either masculine or feminine. This gender is not always logical or based on biological sex. Instead, it is determined by the noun\'s ending and must be memorized. The gender of a noun is crucial because it affects the articles (el, la, los, las) and adjectives that accompany it.'
    },
    {
      title: 'Basic Gender Rules by Ending',
      content: 'While Spanish noun gender can seem arbitrary, there are patterns based on word endings that can help you determine or remember the gender of most nouns.',
      subsections: [
        {
          title: 'Masculine Nouns (-O)',
          content: 'The most reliable rule: nouns ending in -o are almost always masculine. This is the most consistent pattern in Spanish.',
          examples: [
            {
              spanish: 'el libro (the book), el gato (the cat), el carro (the car)',
              english: 'the book, the cat, the car',
              highlight: ['libro', 'gato', 'carro']
            },
            {
              spanish: 'el teléfono, el dinero, el trabajo, el tiempo',
              english: 'the telephone, the money, the work, the time',
              highlight: ['teléfono', 'dinero', 'trabajo', 'tiempo']
            }
          ]
        },
        {
          title: 'Feminine Nouns (-A)',
          content: 'Nouns ending in -a are usually feminine. This is the second most reliable pattern.',
          examples: [
            {
              spanish: 'la casa (the house), la mesa (the table), la ventana (the window)',
              english: 'the house, the table, the window',
              highlight: ['casa', 'mesa', 'ventana']
            },
            {
              spanish: 'la puerta, la silla, la planta, la música',
              english: 'the door, the chair, the plant, the music',
              highlight: ['puerta', 'silla', 'planta', 'música']
            }
          ]
        }
      ]
    },
    {
      title: 'Feminine Nouns by Ending',
      content: 'Certain word endings are almost always feminine, regardless of whether they end in -a.',
      subsections: [
        {
          title: 'Nouns Ending in -CIÓN',
          content: 'All nouns ending in -ción are feminine. This is a very reliable rule.',
          examples: [
            {
              spanish: 'la acción (the action), la canción (the song), la educación (the education)',
              english: 'the action, the song, the education',
              highlight: ['acción', 'canción', 'educación']
            },
            {
              spanish: 'la información, la situación, la solución, la dirección',
              english: 'the information, the situation, the solution, the direction',
              highlight: ['información', 'situación', 'solución', 'dirección']
            }
          ]
        },
        {
          title: 'Nouns Ending in -DAD',
          content: 'All nouns ending in -dad are feminine. This is another very reliable rule.',
          examples: [
            {
              spanish: 'la ciudad (the city), la verdad (the truth), la libertad (the freedom)',
              english: 'the city, the truth, the freedom',
              highlight: ['ciudad', 'verdad', 'libertad']
            },
            {
              spanish: 'la realidad, la personalidad, la responsabilidad, la oportunidad',
              english: 'the reality, the personality, the responsibility, the opportunity',
              highlight: ['realidad', 'personalidad', 'responsabilidad', 'oportunidad']
            }
          ]
        },
        {
          title: 'Nouns Ending in -EZA',
          content: 'Nouns ending in -eza are feminine. These often describe abstract qualities or states.',
          examples: [
            {
              spanish: 'la belleza (the beauty), la tristeza (the sadness), la naturaleza (the nature)',
              english: 'the beauty, the sadness, the nature',
              highlight: ['belleza', 'tristeza', 'naturaleza']
            },
            {
              spanish: 'la riqueza, la pobreza, la pureza, la fortaleza',
              english: 'the wealth, the poverty, the purity, the strength',
              highlight: ['riqueza', 'pobreza', 'pureza', 'fortaleza']
            }
          ]
        },
        {
          title: 'Nouns Ending in -MENTE',
          content: 'Nouns ending in -mente are feminine. These are often abstract nouns.',
          examples: [
            {
              spanish: 'la mente (the mind), la gente (the people), la mente',
              english: 'the mind, the people',
              highlight: ['mente', 'gente']
            }
          ]
        },
        {
          title: 'Nouns Ending in -TUDE',
          content: 'Nouns ending in -tude are feminine.',
          examples: [
            {
              spanish: 'la actitud (the attitude), la gratitud (the gratitude), la altitud (the altitude)',
              english: 'the attitude, the gratitude, the altitude',
              highlight: ['actitud', 'gratitud', 'altitud']
            }
          ]
        },
        {
          title: 'Nouns Ending in -SIÓN',
          content: 'Nouns ending in -sión are feminine, similar to -ción.',
          examples: [
            {
              spanish: 'la decisión (the decision), la televisión (the television), la versión (the version)',
              english: 'the decision, the television, the version',
              highlight: ['decisión', 'televisión', 'versión']
            }
          ]
        }
      ]
    },
    {
      title: 'Masculine Nouns by Ending',
      content: 'Certain word endings are typically masculine.',
      subsections: [
        {
          title: 'Nouns Ending in -O (Most Common)',
          content: 'As mentioned, -o is the most common masculine ending.',
          examples: [
            {
              spanish: 'el libro, el gato, el teléfono, el trabajo',
              english: 'the book, the cat, the telephone, the work',
              highlight: ['libro', 'gato', 'teléfono', 'trabajo']
            }
          ]
        },
        {
          title: 'Nouns Ending in Consonants',
          content: 'Many nouns ending in consonants are masculine, especially -l, -r, -n, -s.',
          examples: [
            {
              spanish: 'el papel (the paper), el color (the color), el pan (the bread), el mes (the month)',
              english: 'the paper, the color, the bread, the month',
              highlight: ['papel', 'color', 'pan', 'mes']
            },
            {
              spanish: 'el árbol, el profesor, el corazón, el país',
              english: 'the tree, the professor, the heart, the country',
              highlight: ['árbol', 'profesor', 'corazón', 'país']
            }
          ]
        }
      ]
    },
    {
      title: 'Important Exceptions',
      content: 'Some nouns do not follow the typical patterns and must be memorized.',
      subsections: [
        {
          title: 'Masculine Nouns Ending in -A',
          content: 'These are exceptions to the -a = feminine rule. They must be memorized.',
          examples: [
            {
              spanish: 'el día (the day), el mapa (the map), el problema (the problem)',
              english: 'the day, the map, the problem',
              highlight: ['día', 'mapa', 'problema']
            },
            {
              spanish: 'el sistema, el tema, el programa, el drama, el poeta, el planeta',
              english: 'the system, the theme, the program, the drama, the poet, the planet',
              highlight: ['sistema', 'tema', 'programa', 'drama', 'poeta', 'planeta']
            }
          ]
        },
        {
          title: 'Feminine Nouns Ending in -O',
          content: 'These are exceptions to the -o = masculine rule. They must be memorized.',
          examples: [
            {
              spanish: 'la mano (the hand), la foto (the photo), la moto (the motorcycle)',
              english: 'the hand, the photo, the motorcycle',
              highlight: ['mano', 'foto', 'moto']
            },
            {
              spanish: 'la radio, la soprano, la contralto',
              english: 'the radio, the soprano, the contralto',
              highlight: ['radio', 'soprano', 'contralto']
            }
          ]
        }
      ]
    },
    {
      title: 'Gender and Biological Sex',
      content: 'In Spanish, grammatical gender does not always correspond to biological sex. For example, "la persona" (the person) is feminine even when referring to a man. Similarly, "el personaje" (the character) is masculine even when referring to a female character.',
      examples: [
        {
          spanish: 'la persona importante (the important person - can be male or female)',
          english: 'the important person',
          highlight: ['persona']
        },
        {
          spanish: 'el médico (the doctor - can be male or female)',
          english: 'the doctor',
          highlight: ['médico']
        }
      ]
    },
    {
      title: 'Practical Examples',
      content: 'Study these sentences to see how noun gender affects articles and adjectives:',
      examples: [
        {
          spanish: 'El libro rojo está en la mesa grande.',
          english: 'The red book is on the big table.',
          highlight: ['libro', 'mesa']
        },
        {
          spanish: 'La ciudad es hermosa y la naturaleza es bella.',
          english: 'The city is beautiful and the nature is beautiful.',
          highlight: ['ciudad', 'naturaleza']
        },
        {
          spanish: 'El problema es importante y la solución es difícil.',
          english: 'The problem is important and the solution is difficult.',
          highlight: ['problema', 'solución']
        },
        {
          spanish: 'La información es clara y el sistema es complicado.',
          english: 'The information is clear and the system is complicated.',
          highlight: ['información', 'sistema']
        }
      ]
    }
  ];

  return (
    <GrammarPageTemplate
      language="spanish"
      category="nouns"
      topic="gender"
      title="Spanish Noun Gender"
      description="Master Spanish noun gender rules including masculine and feminine patterns with word endings like -ión, -dad, -eza, and -mente"
      difficulty="beginner"
      estimatedTime={25}
      sections={sections}
      backUrl="/grammar/spanish"
      practiceUrl="/grammar/spanish/nouns/gender/practice"
      quizUrl="/grammar/spanish/nouns/gender/test"
      youtubeVideoId="EGaSgIRswcI"
      relatedTopics={[
        { title: 'Plural Formation', url: '/grammar/spanish/nouns/plural-formation', difficulty: 'beginner' },
        { title: 'Definite Articles', url: '/grammar/spanish/articles/definite', difficulty: 'beginner' },
        { title: 'Adjective Agreement', url: '/grammar/spanish/adjectives/adjective-agreement', difficulty: 'beginner' }
      ]}
    />
  );
}
