import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';

export const metadata: Metadata = {
  title: 'Spanish Present Tense Regular Verbs - Language Gems',
  description: 'Master Spanish regular verb conjugation in present tense. Learn -ar, -er, and -ir verb patterns with comprehensive conjugation tables, detailed explanations, and practice exercises.',
  keywords: 'Spanish regular verbs, present tense conjugation, ar er ir verbs, Spanish grammar, verb patterns, hablar, comer, vivir',
};

export default function SpanishPresentRegularPage() {
  const sections = [
    {
      title: 'Overview',
      content: 'Spanish regular verbs in the present tense follow predictable patterns based on their infinitive ending. There are three main categories: -AR verbs, -ER verbs, and -IR verbs. Once you master these patterns, you can conjugate hundreds of Spanish verbs correctly.'
    },
    {
      title: 'The Three Regular Verb Patterns',
      content: 'Regular verbs are called "regular" because they follow consistent conjugation patterns. To conjugate a regular verb, remove the infinitive ending (-ar, -er, or -ir) and add the appropriate present tense ending for each pronoun.',
      subsections: [
        {
          title: '-AR Verbs (First Conjugation)',
          content: 'AR verbs are the most common type of regular verb in Spanish. Common examples include: hablar (to speak), estudiar (to study), trabajar (to work), caminar (to walk), comprar (to buy), and cantar (to sing).',
          conjugationTable: {
            title: 'Hablar (to speak) - AR Verb Pattern',
            conjugations: [
              { pronoun: 'yo', form: 'hablo', english: 'I speak' },
              { pronoun: 'tú', form: 'hablas', english: 'you speak' },
              { pronoun: 'él/ella/usted', form: 'habla', english: 'he/she/you (formal) speak' },
              { pronoun: 'nosotros/as', form: 'hablamos', english: 'we speak' },
              { pronoun: 'vosotros/as', form: 'habláis', english: 'you all speak (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'hablan', english: 'they/you all speak' }
            ]
          },
          examples: [
            {
              spanish: 'Yo hablo español con mis amigos.',
              english: 'I speak Spanish with my friends.',
              highlight: ['hablo']
            },
            {
              spanish: 'Ella estudia medicina en la universidad.',
              english: 'She studies medicine at the university.',
              highlight: ['estudia']
            },
            {
              spanish: 'Nosotros trabajamos en una oficina grande.',
              english: 'We work in a large office.',
              highlight: ['trabajamos']
            },
            {
              spanish: 'Ellos caminan por el parque cada mañana.',
              english: 'They walk through the park every morning.',
              highlight: ['caminan']
            }
          ]
        },
        {
          title: '-ER Verbs (Second Conjugation)',
          content: 'ER verbs follow a similar pattern to AR verbs, with slightly different endings. Common examples include: comer (to eat), beber (to drink), leer (to read), vender (to sell), aprender (to learn), and comprender (to understand).',
          conjugationTable: {
            title: 'Comer (to eat) - ER Verb Pattern',
            conjugations: [
              { pronoun: 'yo', form: 'como', english: 'I eat' },
              { pronoun: 'tú', form: 'comes', english: 'you eat' },
              { pronoun: 'él/ella/usted', form: 'come', english: 'he/she/you (formal) eat' },
              { pronoun: 'nosotros/as', form: 'comemos', english: 'we eat' },
              { pronoun: 'vosotros/as', form: 'coméis', english: 'you all eat (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'comen', english: 'they/you all eat' }
            ]
          },
          examples: [
            {
              spanish: 'Yo como una manzana cada día.',
              english: 'I eat an apple every day.',
              highlight: ['como']
            },
            {
              spanish: 'Tú bebes café por la mañana.',
              english: 'You drink coffee in the morning.',
              highlight: ['bebes']
            },
            {
              spanish: 'Nosotros leemos libros interesantes.',
              english: 'We read interesting books.',
              highlight: ['leemos']
            },
            {
              spanish: 'Ellos venden frutas en el mercado.',
              english: 'They sell fruits at the market.',
              highlight: ['venden']
            }
          ]
        },
        {
          title: '-IR Verbs (Third Conjugation)',
          content: 'IR verbs are the least common of the three regular verb types. They share most endings with ER verbs, with differences only in the nosotros and vosotros forms. Common examples include: vivir (to live), escribir (to write), recibir (to receive), partir (to leave), y subir (to go up).',
          conjugationTable: {
            title: 'Vivir (to live) - IR Verb Pattern',
            conjugations: [
              { pronoun: 'yo', form: 'vivo', english: 'I live' },
              { pronoun: 'tú', form: 'vives', english: 'you live' },
              { pronoun: 'él/ella/usted', form: 'vive', english: 'he/she/you (formal) live' },
              { pronoun: 'nosotros/as', form: 'vivimos', english: 'we live' },
              { pronoun: 'vosotros/as', form: 'vivís', english: 'you all live (Spain)' },
              { pronoun: 'ellos/ellas/ustedes', form: 'viven', english: 'they/you all live' }
            ]
          },
          examples: [
            {
              spanish: 'Yo vivo en una casa grande.',
              english: 'I live in a large house.',
              highlight: ['vivo']
            },
            {
              spanish: 'Ella escribe cartas a su familia.',
              english: 'She writes letters to her family.',
              highlight: ['escribe']
            },
            {
              spanish: 'Nosotros recibimos paquetes cada semana.',
              english: 'We receive packages every week.',
              highlight: ['recibimos']
            },
            {
              spanish: 'Ellos suben las escaleras rápidamente.',
              english: 'They go up the stairs quickly.',
              highlight: ['suben']
            }
          ]
        }
      ]
    },
    {
      title: 'Key Conjugation Rules',
      content: '• Remove the infinitive ending (-ar, -er, or -ir) to get the verb stem\n• Add the appropriate present tense ending based on the subject pronoun\n• AR and ER verbs share the same endings for yo, él/ella/usted, and ellos/ellas/ustedes\n• ER and IR verbs share most endings, differing only in nosotros and vosotros forms\n• The nosotros form is the same for AR and ER verbs (-amos, -emos)\n• The nosotros form for IR verbs is -imos\n• Vosotros forms are primarily used in Spain; Latin America uses ustedes instead'
    },
    {
      title: 'Common Regular Verbs by Category',
      content: 'AR Verbs: hablar (speak), estudiar (study), trabajar (work), caminar (walk), comprar (buy), cantar (sing), bailar (dance), jugar (play), mirar (look), escuchar (listen), enseñar (teach), viajar (travel), descansar (rest), esperar (wait/hope)\n\nER Verbs: comer (eat), beber (drink), leer (read), vender (sell), aprender (learn), comprender (understand), creer (believe), temer (fear), responder (respond), correr (run), meter (put), perder (lose)\n\nIR Verbs: vivir (live), escribir (write), recibir (receive), partir (leave), subir (go up), abrir (open), sufrir (suffer), compartir (share), decidir (decide), discutir (discuss), existir (exist), insistir (insist)'
    },
    {
      title: 'Practical Examples in Context',
      content: 'Study these sentences to see how regular verbs are used in real situations:',
      examples: [
        {
          spanish: 'Yo estudio español cada día porque quiero viajar a España.',
          english: 'I study Spanish every day because I want to travel to Spain.',
          highlight: ['estudio', 'viajar']
        },
        {
          spanish: 'Mi hermana trabaja en una tienda y vende ropa bonita.',
          english: 'My sister works in a store and sells beautiful clothes.',
          highlight: ['trabaja', 'vende']
        },
        {
          spanish: 'Nosotros comemos pizza los viernes y bebemos refrescos.',
          english: 'We eat pizza on Fridays and drink soft drinks.',
          highlight: ['comemos', 'bebemos']
        },
        {
          spanish: 'Ellos viven en la ciudad, escriben libros y enseñan en la universidad.',
          english: 'They live in the city, write books, and teach at the university.',
          highlight: ['viven', 'escriben', 'enseñan']
        },
        {
          spanish: '¿Dónde vives tú? ¿Qué haces en tu tiempo libre?',
          english: 'Where do you live? What do you do in your free time?',
          highlight: ['vives', 'haces']
        }
      ]
    }
  ];

  return (
    <GrammarPageTemplate
      language="spanish"
      category="verbs"
      topic="present-regular"
      title="Present Tense Regular Verbs"
      description="Master the three regular verb patterns in Spanish present tense: -AR, -ER, and -IR verbs with comprehensive conjugation tables and examples"
      difficulty="beginner"
      estimatedTime={25}
      sections={sections}
      backUrl="/grammar/spanish"
      practiceUrl="/grammar/spanish/verbs/present-regular/practice"
      quizUrl="/grammar/spanish/verbs/present-regular/test"
      youtubeVideoId="EGaSgIRswcI"
      relatedTopics={[
        { title: 'Present Irregular Verbs', url: '/grammar/spanish/verbs/present-irregular', difficulty: 'intermediate' },
        { title: 'Preterite Tense', url: '/grammar/spanish/verbs/preterite-tense', difficulty: 'intermediate' },
        { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect-tense', difficulty: 'intermediate' },
        { title: 'Subject Pronouns', url: '/grammar/spanish/pronouns/subject', difficulty: 'beginner' }
      ]}
    />
  );
}
