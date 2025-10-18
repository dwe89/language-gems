import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';

export const metadata: Metadata = {
  title: 'Spanish Adjective Agreement - LanguageGems',
  description: 'Master Spanish adjective agreement rules with comprehensive lessons and practice exercises. Learn how adjectives change to match nouns in gender and number.',
  keywords: 'Spanish adjectives, adjective agreement, Spanish grammar, gender agreement, number agreement, masculine feminine, singular plural',
  openGraph: {
    title: 'Spanish Adjective Agreement - LanguageGems',
    description: 'Master Spanish adjective agreement rules with comprehensive lessons and practice exercises.',
    type: 'article',
  },
};

export default function SpanishAdjectiveAgreementPage() {
  const sections = [
    {
      title: 'Overview',
      content: 'In Spanish, adjectives must agree with the nouns they modify in both gender (masculine or feminine) and number (singular or plural). This is one of the fundamental rules of Spanish grammar. Unlike English, where adjectives never change form, Spanish adjectives change their endings to match the gender and number of the noun they describe.'
    },
    {
      title: 'Gender Agreement',
      content: 'Adjectives must match the gender of the noun they modify. Spanish nouns are either masculine or feminine, and adjectives must reflect this.',
      subsections: [
        {
          title: 'Adjectives Ending in -O (Most Common)',
          content: 'Adjectives ending in -o are typically masculine. To make them feminine, change the -o to -a. These are the most common type of adjective in Spanish.',
          examples: [
            {
              spanish: 'un libro rojo, una casa roja',
              english: 'a red book, a red house',
              highlight: ['rojo', 'roja']
            },
            {
              spanish: 'el gato negro, la gata negra',
              english: 'the black cat (male), the black cat (female)',
              highlight: ['negro', 'negra']
            },
            {
              spanish: 'un día hermoso, una noche hermosa',
              english: 'a beautiful day, a beautiful night',
              highlight: ['hermoso', 'hermosa']
            },
            {
              spanish: 'el niño pequeño, la niña pequeña',
              english: 'the small boy, the small girl',
              highlight: ['pequeño', 'pequeña']
            }
          ]
        },
        {
          title: 'Adjectives Ending in -E',
          content: 'Adjectives ending in -e do not change for gender. They remain the same whether the noun is masculine or feminine. Only the number changes (add -s for plural).',
          examples: [
            {
              spanish: 'un libro interesante, una película interesante',
              english: 'an interesting book, an interesting movie',
              highlight: ['interesante', 'interesante']
            },
            {
              spanish: 'el coche grande, la casa grande',
              english: 'the big car, the big house',
              highlight: ['grande', 'grande']
            },
            {
              spanish: 'un problema importante, una decisión importante',
              english: 'an important problem, an important decision',
              highlight: ['importante', 'importante']
            }
          ]
        },
        {
          title: 'Adjectives Ending in Consonants',
          content: 'Most adjectives ending in consonants do not change for gender. However, adjectives ending in -or, -ón, -án, and -ín do change for gender (add -a for feminine).',
          examples: [
            {
              spanish: 'un hombre trabajador, una mujer trabajadora',
              english: 'a hardworking man, a hardworking woman',
              highlight: ['trabajador', 'trabajadora']
            },
            {
              spanish: 'un niño travieso, una niña traviesa',
              english: 'a mischievous boy, a mischievous girl',
              highlight: ['travieso', 'traviesa']
            },
            {
              spanish: 'un examen fácil, una pregunta fácil',
              english: 'an easy exam, an easy question',
              highlight: ['fácil', 'fácil']
            }
          ]
        }
      ]
    },
    {
      title: 'Number Agreement',
      content: 'Adjectives must also match the number of the noun they modify. Singular nouns take singular adjectives, and plural nouns take plural adjectives.',
      subsections: [
        {
          title: 'Forming Plural Adjectives',
          content: 'To form the plural of an adjective, follow these rules:\n• If the adjective ends in a vowel (-o, -a, -e), add -s\n• If the adjective ends in a consonant, add -es\n• Adjectives ending in -z change to -c and add -es',
          examples: [
            {
              spanish: 'un libro rojo, dos libros rojos',
              english: 'a red book, two red books',
              highlight: ['rojo', 'rojos']
            },
            {
              spanish: 'una casa grande, dos casas grandes',
              english: 'a big house, two big houses',
              highlight: ['grande', 'grandes']
            },
            {
              spanish: 'un coche azul, dos coches azules',
              english: 'a blue car, two blue cars',
              highlight: ['azul', 'azules']
            },
            {
              spanish: 'un problema difícil, dos problemas difíciles',
              english: 'a difficult problem, two difficult problems',
              highlight: ['difícil', 'difíciles']
            }
          ]
        }
      ]
    },
    {
      title: 'Complete Agreement Patterns',
      content: 'Here are the complete patterns for adjective agreement:',
      subsections: [
        {
          title: 'Pattern 1: -O Adjectives (Most Common)',
          conjugationTable: {
            title: 'Rojo (red) - Complete Agreement Pattern',
            conjugations: [
              { pronoun: 'Masculine Singular', form: 'rojo', english: 'red (m.s.)' },
              { pronoun: 'Feminine Singular', form: 'roja', english: 'red (f.s.)' },
              { pronoun: 'Masculine Plural', form: 'rojos', english: 'red (m.p.)' },
              { pronoun: 'Feminine Plural', form: 'rojas', english: 'red (f.p.)' }
            ]
          }
        },
        {
          title: 'Pattern 2: -E Adjectives',
          conjugationTable: {
            title: 'Grande (big) - Complete Agreement Pattern',
            conjugations: [
              { pronoun: 'Masculine Singular', form: 'grande', english: 'big (m.s.)' },
              { pronoun: 'Feminine Singular', form: 'grande', english: 'big (f.s.)' },
              { pronoun: 'Masculine Plural', form: 'grandes', english: 'big (m.p.)' },
              { pronoun: 'Feminine Plural', form: 'grandes', english: 'big (f.p.)' }
            ]
          }
        },
        {
          title: 'Pattern 3: Consonant Adjectives (-or)',
          conjugationTable: {
            title: 'Trabajador (hardworking) - Complete Agreement Pattern',
            conjugations: [
              { pronoun: 'Masculine Singular', form: 'trabajador', english: 'hardworking (m.s.)' },
              { pronoun: 'Feminine Singular', form: 'trabajadora', english: 'hardworking (f.s.)' },
              { pronoun: 'Masculine Plural', form: 'trabajadores', english: 'hardworking (m.p.)' },
              { pronoun: 'Feminine Plural', form: 'trabajadoras', english: 'hardworking (f.p.)' }
            ]
          }
        }
      ]
    },
    {
      title: 'Multiple Adjectives',
      content: 'When using multiple adjectives with one noun, each adjective must agree with the noun in gender and number. The adjectives can be connected with "y" (and) or listed separately.',
      examples: [
        {
          spanish: 'una casa grande y hermosa',
          english: 'a big and beautiful house',
          highlight: ['grande', 'hermosa']
        },
        {
          spanish: 'los niños pequeños e inteligentes',
          english: 'the small and intelligent children',
          highlight: ['pequeños', 'inteligentes']
        },
        {
          spanish: 'una mujer joven, talentosa y ambiciosa',
          english: 'a young, talented, and ambitious woman',
          highlight: ['joven', 'talentosa', 'ambiciosa']
        }
      ]
    },
    {
      title: 'Common Adjectives and Their Forms',
      content: 'Here are some common adjectives and how they change:\n\n-O Adjectives: alto (tall), bajo (short), bueno (good), malo (bad), nuevo (new), viejo (old), joven (young), rico (rich), pobre (poor), fuerte (strong), débil (weak)\n\n-E Adjectives: grande (big), pequeño (small), interesante (interesting), importante (important), posible (possible), imposible (impossible), fácil (easy), difícil (difficult)\n\nConsonant Adjectives: trabajador (hardworking), hablador (talkative), travieso (mischievous), azul (blue), gris (gray), fácil (easy), difícil (difficult)'
    },
    {
      title: 'Practical Examples',
      content: 'Study these sentences to see how adjective agreement works in context:',
      examples: [
        {
          spanish: 'El estudiante inteligente y trabajador aprobó el examen difícil.',
          english: 'The intelligent and hardworking student passed the difficult exam.',
          highlight: ['inteligente', 'trabajador', 'difícil']
        },
        {
          spanish: 'Las niñas pequeñas y alegres jugaban en el parque grande.',
          english: 'The small and happy girls were playing in the big park.',
          highlight: ['pequeñas', 'alegres', 'grande']
        },
        {
          spanish: 'Tengo un coche rojo y una casa azul.',
          english: 'I have a red car and a blue house.',
          highlight: ['rojo', 'azul']
        },
        {
          spanish: 'Los libros antiguos y valiosos están en la biblioteca nacional.',
          english: 'The old and valuable books are in the national library.',
          highlight: ['antiguos', 'valiosos', 'nacional']
        }
      ]
    }
  ];

  return (
    <GrammarPageTemplate
      language="spanish"
      category="adjectives"
      topic="adjective-agreement"
      title="Adjective Agreement"
      description="Master Spanish adjective agreement rules for gender and number with comprehensive explanations and examples"
      difficulty="beginner"
      estimatedTime={20}
      sections={sections}
      backUrl="/grammar/spanish"
      practiceUrl="/grammar/spanish/adjectives/adjective-agreement/practice"
      quizUrl="/grammar/spanish/adjectives/adjective-agreement/test"
      youtubeVideoId="EGaSgIRswcI"
      relatedTopics={[
        { title: 'Adjective Position', url: '/grammar/spanish/adjectives/adjective-position', difficulty: 'intermediate' },
        { title: 'Comparatives', url: '/grammar/spanish/adjectives/comparatives', difficulty: 'intermediate' },
        { title: 'Superlatives', url: '/grammar/spanish/adjectives/superlatives', difficulty: 'intermediate' },
        { title: 'Noun Gender', url: '/grammar/spanish/nouns/gender', difficulty: 'beginner' }
      ]}
    />
  );
}
