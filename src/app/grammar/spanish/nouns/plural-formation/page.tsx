import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';

export const metadata: Metadata = {
  title: 'Spanish Plural Formation - Language Gems',
  description: 'Master Spanish plural formation rules. Learn how to make Spanish nouns plural with comprehensive rules and examples.',
  keywords: 'Spanish plurals, plural formation, Spanish grammar rules, noun plurals Spanish',
};

export default function SpanishPluralFormationPage() {
  const sections = [
    {
      title: 'Overview',
      content: 'Spanish plurals are formed by adding suffixes to nouns or, in some cases, by changing the final letter. The rules depend on the final sound or letter of the noun. Most Spanish plurals follow predictable patterns, though there are some exceptions that must be memorized.'
    },
    {
      title: 'Regular Plural Formation',
      content: 'Most Spanish nouns follow one of two basic rules for forming plurals.',
      subsections: [
        {
          title: 'Rule 1: Nouns Ending in Vowels (a, e, i, o, u) - Add -S',
          content: 'When a noun ends in an unstressed vowel, simply add -s to form the plural.',
          examples: [
            {
              spanish: 'libro → libros (book → books)',
              english: 'book → books',
              highlight: ['libro', 'libros']
            },
            {
              spanish: 'casa → casas (house → houses)',
              english: 'house → houses',
              highlight: ['casa', 'casas']
            },
            {
              spanish: 'mesa → mesas (table → tables)',
              english: 'table → tables',
              highlight: ['mesa', 'mesas']
            },
            {
              spanish: 'coche → coches (car → cars)',
              english: 'car → cars',
              highlight: ['coche', 'coches']
            },
            {
              spanish: 'estudiante → estudiantes (student → students)',
              english: 'student → students',
              highlight: ['estudiante', 'estudiantes']
            }
          ]
        },
        {
          title: 'Rule 2: Nouns Ending in Consonants - Add -ES',
          content: 'When a noun ends in a consonant, add -es to form the plural. This adds a syllable to the word.',
          examples: [
            {
              spanish: 'profesor → profesores (teacher → teachers)',
              english: 'teacher → teachers',
              highlight: ['profesor', 'profesores']
            },
            {
              spanish: 'animal → animales (animal → animals)',
              english: 'animal → animals',
              highlight: ['animal', 'animales']
            },
            {
              spanish: 'ciudad → ciudades (city → cities)',
              english: 'city → cities',
              highlight: ['ciudad', 'ciudades']
            },
            {
              spanish: 'papel → papeles (paper → papers)',
              english: 'paper → papers',
              highlight: ['papel', 'papeles']
            },
            {
              spanish: 'árbol → árboles (tree → trees)',
              english: 'tree → trees',
              highlight: ['árbol', 'árboles']
            }
          ]
        }
      ]
    },
    {
      title: 'Special Cases and Exceptions',
      content: 'Some nouns have special plural formations that do not follow the basic rules.',
      subsections: [
        {
          title: 'Nouns Ending in -Z: Change to -CES',
          content: 'Nouns ending in -z change the -z to -c and add -es.',
          examples: [
            {
              spanish: 'lápiz → lápices (pencil → pencils)',
              english: 'pencil → pencils',
              highlight: ['lápiz', 'lápices']
            },
            {
              spanish: 'feliz → felices (happy → happy plural)',
              english: 'happy → happy (plural)',
              highlight: ['feliz', 'felices']
            },
            {
              spanish: 'cruz → cruces (cross → crosses)',
              english: 'cross → crosses',
              highlight: ['cruz', 'cruces']
            },
            {
              spanish: 'luz → luces (light → lights)',
              english: 'light → lights',
              highlight: ['luz', 'luces']
            }
          ]
        },
        {
          title: 'Nouns Ending in Stressed Vowel + S: Add -ES',
          content: 'When a noun ends in a stressed vowel followed by -s, add -es (not just -s).',
          examples: [
            {
              spanish: 'autobús → autobuses (bus → buses)',
              english: 'bus → buses',
              highlight: ['autobús', 'autobuses']
            },
            {
              spanish: 'compás → compases (compass → compasses)',
              english: 'compass → compasses',
              highlight: ['compás', 'compases']
            },
            {
              spanish: 'país → países (country → countries)',
              english: 'country → countries',
              highlight: ['país', 'países']
            }
          ]
        },
        {
          title: 'Nouns Ending in Unstressed Vowel + S: No Change',
          content: 'When a noun ends in an unstressed vowel followed by -s, the plural is the same as the singular.',
          examples: [
            {
              spanish: 'crisis → crisis (crisis → crises)',
              english: 'crisis → crises',
              highlight: ['crisis']
            },
            {
              spanish: 'tesis → tesis (thesis → theses)',
              english: 'thesis → theses',
              highlight: ['tesis']
            },
            {
              spanish: 'análisis → análisis (analysis → analyses)',
              english: 'analysis → analyses',
              highlight: ['análisis']
            }
          ]
        },
        {
          title: 'Nouns Ending in -X: No Change',
          content: 'Nouns ending in -x typically do not change in the plural.',
          examples: [
            {
              spanish: 'tórax → tórax (thorax → thoraxes)',
              english: 'thorax → thoraxes',
              highlight: ['tórax']
            }
          ]
        }
      ]
    },
    {
      title: 'Accent Mark Changes',
      content: 'When adding -es to a noun, the stress pattern may change, requiring accent mark adjustments.',
      subsections: [
        {
          title: 'Accent Marks on Singular Nouns',
          content: 'Some singular nouns have accent marks that are removed in the plural because the stress naturally falls on a different syllable.',
          examples: [
            {
              spanish: 'orden → órdenes (order → orders)',
              english: 'order → orders',
              highlight: ['orden', 'órdenes']
            },
            {
              spanish: 'carácter → caracteres (character → characters)',
              english: 'character → characters',
              highlight: ['carácter', 'caracteres']
            }
          ]
        }
      ]
    },
    {
      title: 'Irregular Plurals',
      content: 'A few nouns have completely irregular plural forms that must be memorized.',
      subsections: [
        {
          title: 'Common Irregular Plurals',
          content: 'These nouns do not follow standard pluralization rules.',
          examples: [
            {
              spanish: 'el virus → los virus (the virus → the viruses)',
              english: 'the virus → the viruses',
              highlight: ['virus']
            },
            {
              spanish: 'el fénix → los fénix (the phoenix → the phoenixes)',
              english: 'the phoenix → the phoenixes',
              highlight: ['fénix']
            }
          ]
        }
      ]
    },
    {
      title: 'Plural of Compound Nouns',
      content: 'Compound nouns (nouns made of two or more words) typically pluralize only the first word.',
      examples: [
        {
          spanish: 'el guardaespaldas → los guardaespaldas (the bodyguard → the bodyguards)',
          english: 'the bodyguard → the bodyguards',
          highlight: ['guardaespaldas']
        },
        {
          spanish: 'la madrastra → las madrastras (the stepmother → the stepmothers)',
          english: 'the stepmother → the stepmothers',
          highlight: ['madrastra']
        }
      ]
    },
    {
      title: 'Practical Examples',
      content: 'Study these sentences to see how plurals are used in context:',
      examples: [
        {
          spanish: 'Los libros están en las mesas de la biblioteca.',
          english: 'The books are on the tables in the library.',
          highlight: ['libros', 'mesas']
        },
        {
          spanish: 'Los profesores enseñan a los estudiantes en las aulas.',
          english: 'The teachers teach the students in the classrooms.',
          highlight: ['profesores', 'estudiantes', 'aulas']
        },
        {
          spanish: 'Los lápices y los bolígrafos están en las cajas.',
          english: 'The pencils and the pens are in the boxes.',
          highlight: ['lápices', 'bolígrafos', 'cajas']
        },
        {
          spanish: 'Las ciudades tienen muchos autobuses y taxis.',
          english: 'The cities have many buses and taxis.',
          highlight: ['ciudades', 'autobuses', 'taxis']
        }
      ]
    }
  ];

  return (
    <GrammarPageTemplate
      language="spanish"
      category="nouns"
      topic="plural-formation"
      title="Plural Formation"
      description="Master Spanish plural formation rules including regular patterns, special cases, and irregular plurals"
      difficulty="beginner"
      estimatedTime={25}
      sections={sections}
      backUrl="/grammar/spanish"
      practiceUrl="/grammar/spanish/nouns/plural-formation/practice"
      quizUrl="/grammar/spanish/nouns/plural-formation/test"
      youtubeVideoId="EGaSgIRswcI"
      relatedTopics={[
        { title: 'Noun Gender', url: '/grammar/spanish/nouns/gender', difficulty: 'beginner' },
        { title: 'Definite Articles', url: '/grammar/spanish/articles/definite', difficulty: 'beginner' },
        { title: 'Adjective Agreement', url: '/grammar/spanish/adjectives/adjective-agreement', difficulty: 'beginner' }
      ]}
    />
  );
}
