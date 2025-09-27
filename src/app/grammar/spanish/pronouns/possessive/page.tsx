import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'pronouns',
  topic: 'possessive',
  title: 'Spanish Possessive Pronouns',
  description: 'Master Spanish possessive pronouns: mi, tu, su, nuestro, vuestro. Learn to show ownership and relationships.',
  difficulty: 'beginner',
  keywords: [
    'spanish possessive pronouns',
    'mi tu su spanish',
    'nuestro vuestro spanish',
    'spanish grammar possessives',
    'pronombres posesivos español',
    'spanish ownership'
  ],
  examples: [
    'mi casa (my house)',
    'tu libro (your book)',
    'nuestro coche (our car)'
  ]
});

const sections = [
  {
    title: 'Spanish Possessive Pronouns Overview',
    content: `Spanish possessive pronouns show **ownership** or **relationships** between people and things. They answer the question "whose?" and must agree with the **noun they modify**, not the owner.

**Key Rule**: Possessive pronouns agree with the **thing possessed**, not the person who owns it.

**Two Types**:
- **Short forms**: mi, tu, su (go before noun)
- **Long forms**: mío, tuyo, suyo (go after noun or stand alone)

Most commonly, you'll use the short forms that go before the noun.`,
    examples: [
      {
        spanish: 'mi casa',
        english: 'my house (short form before noun)',
        highlight: ['mi']
      },
      {
        spanish: 'la casa es mía',
        english: 'the house is mine (long form after verb)',
        highlight: ['mía']
      },
      {
        spanish: 'nuestros libros',
        english: 'our books (agrees with "libros", not "we")',
        highlight: ['nuestros']
      }
    ]
  },
  {
    title: 'Short Form Possessive Pronouns',
    content: `Short form possessives go **before** the noun and are the most commonly used:`,
    subsections: [
      {
        title: 'Complete Short Forms Chart',
        content: `Here are all the short form possessive pronouns:`,
        conjugationTable: {
          title: 'Short Form Possessive Pronouns',
          conjugations: [
            { pronoun: 'mi / mis', form: 'my', english: 'mi casa / mis casas' },
            { pronoun: 'tu / tus', form: 'your (informal)', english: 'tu libro / tus libros' },
            { pronoun: 'su / sus', form: 'his/her/your (formal)', english: 'su coche / sus coches' },
            { pronoun: 'nuestro/a/os/as', form: 'our', english: 'nuestro perro / nuestra casa' },
            { pronoun: 'vuestro/a/os/as', form: 'your (plural, Spain)', english: 'vuestro amigo / vuestra amiga' },
            { pronoun: 'su / sus', form: 'their/your (plural)', english: 'su trabajo / sus trabajos' }
          ]
        },
        examples: [
          {
            spanish: 'mi hermana y mis hermanos',
            english: 'my sister and my brothers',
            highlight: ['mi', 'mis']
          },
          {
            spanish: 'tu madre y tus padres',
            english: 'your mother and your parents',
            highlight: ['tu', 'tus']
          },
          {
            spanish: 'su problema y sus soluciones',
            english: 'his/her problem and his/her solutions',
            highlight: ['su', 'sus']
          }
        ]
      },
      {
        title: 'Agreement Rules for Short Forms',
        content: `Short form possessives agree in **number** with the noun they modify:

**mi/tu/su**: Only change for plural (mis/tus/sus)
**nuestro/vuestro**: Change for both gender and number

**Important**: They agree with the thing possessed, not the owner.`,
        examples: [
          {
            spanish: 'mi casa → mis casas',
            english: 'my house → my houses (number agreement)',
            highlight: ['mi', 'mis']
          },
          {
            spanish: 'nuestro coche → nuestra casa',
            english: 'our car → our house (gender agreement)',
            highlight: ['nuestro', 'nuestra']
          },
          {
            spanish: 'nuestros libros → nuestras revistas',
            english: 'our books → our magazines (gender + number)',
            highlight: ['nuestros', 'nuestras']
          },
          {
            spanish: 'vuestro profesor → vuestra profesora',
            english: 'your teacher (m) → your teacher (f) (Spain)',
            highlight: ['vuestro', 'vuestra']
          }
        ]
      }
    ]
  },
  {
    title: 'The Ambiguous "Su/Sus"',
    content: `**Su** and **sus** can mean his, her, its, your (formal), their, or your (plural). This can cause confusion:`,
    subsections: [
      {
        title: 'Multiple Meanings of Su/Sus',
        content: `The same form "su" can refer to different owners:`,
        examples: [
          {
            spanish: 'su casa',
            english: 'his house / her house / your house (formal) / their house',
            highlight: ['su']
          },
          {
            spanish: 'sus libros',
            english: 'his books / her books / your books (formal) / their books',
            highlight: ['sus']
          }
        ]
      },
      {
        title: 'Clarifying Su/Sus',
        content: `To avoid confusion, you can use **de + pronoun** or **de + noun**:`,
        examples: [
          {
            spanish: 'su casa → la casa de él',
            english: 'his house → the house of him (his house)',
            highlight: ['su casa', 'la casa de él']
          },
          {
            spanish: 'su casa → la casa de ella',
            english: 'her house → the house of her (her house)',
            highlight: ['su casa', 'la casa de ella']
          },
          {
            spanish: 'su casa → la casa de usted',
            english: 'your house → the house of you (your house, formal)',
            highlight: ['su casa', 'la casa de usted']
          },
          {
            spanish: 'su casa → la casa de María',
            english: 'her house → María\'s house',
            highlight: ['su casa', 'la casa de María']
          }
        ]
      }
    ]
  },
  {
    title: 'Long Form Possessive Pronouns',
    content: `Long form possessives can **stand alone** or go **after** the noun. They agree in both gender and number:`,
    subsections: [
      {
        title: 'Complete Long Forms Chart',
        content: `Long forms have four forms each (masculine/feminine, singular/plural):`,
        conjugationTable: {
          title: 'Long Form Possessive Pronouns',
          conjugations: [
            { pronoun: 'mío/mía/míos/mías', form: 'mine', english: 'el libro mío / la casa mía' },
            { pronoun: 'tuyo/tuya/tuyos/tuyas', form: 'yours (informal)', english: 'el coche tuyo / la bici tuya' },
            { pronoun: 'suyo/suya/suyos/suyas', form: 'his/hers/yours (formal)', english: 'el perro suyo / la gata suya' },
            { pronoun: 'nuestro/nuestra/nuestros/nuestras', form: 'ours', english: 'el trabajo nuestro / la idea nuestra' },
            { pronoun: 'vuestro/vuestra/vuestros/vuestras', form: 'yours (plural, Spain)', english: 'el problema vuestro' },
            { pronoun: 'suyo/suya/suyos/suyas', form: 'theirs/yours (plural)', english: 'el éxito suyo / la victoria suya' }
          ]
        },
        examples: [
          {
            spanish: 'Este libro es mío.',
            english: 'This book is mine. (standing alone)',
            highlight: ['mío']
          },
          {
            spanish: 'Una amiga mía vive aquí.',
            english: 'A friend of mine lives here. (after noun)',
            highlight: ['mía']
          },
          {
            spanish: 'Los coches nuestros son nuevos.',
            english: 'Our cars are new. (after noun)',
            highlight: ['nuestros']
          }
        ]
      },
      {
        title: 'Uses of Long Forms',
        content: `Long forms are used in specific situations:

**1. After ser (to be)**: "Es mío" (It's mine)
**2. After articles**: "un amigo mío" (a friend of mine)  
**3. For emphasis**: "la casa mía" (MY house)
**4. Standing alone**: "¿De quién es? Mío." (Whose is it? Mine.)`,
        examples: [
          {
            spanish: 'La culpa es tuya.',
            english: 'The fault is yours. (after ser)',
            highlight: ['tuya']
          },
          {
            spanish: 'Un primo mío estudia medicina.',
            english: 'A cousin of mine studies medicine. (after article)',
            highlight: ['mío']
          },
          {
            spanish: 'La responsabilidad nuestra es grande.',
            english: 'OUR responsibility is great. (emphasis)',
            highlight: ['nuestra']
          },
          {
            spanish: '¿De quién son estos? Nuestros.',
            english: 'Whose are these? Ours. (standing alone)',
            highlight: ['Nuestros']
          }
        ]
      }
    ]
  },
  {
    title: 'Regional Differences: Vuestro vs. Ustedes',
    content: `There are important regional differences in possessive pronouns:`,
    subsections: [
      {
        title: 'Spain vs. Latin America',
        content: `**Spain**: Uses vuestro/vuestra/vuestros/vuestras for informal "your" (plural)
**Latin America**: Uses su/sus for all "your" (plural), both formal and informal

This matches the difference between vosotros (Spain) and ustedes (Latin America).`,
        examples: [
          {
            spanish: 'Vuestros libros están aquí.',
            english: 'Your books are here. (informal plural, Spain only)',
            highlight: ['Vuestros']
          },
          {
            spanish: 'Sus libros están aquí.',
            english: 'Your books are here. (plural, Latin America / formal Spain)',
            highlight: ['Sus']
          },
          {
            spanish: 'La casa vuestra es bonita.',
            english: 'Your house is pretty. (informal plural, Spain only)',
            highlight: ['vuestra']
          },
          {
            spanish: 'La casa suya es bonita.',
            english: 'Your house is pretty. (plural, Latin America / formal Spain)',
            highlight: ['suya']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Possessive Expressions',
    content: `Possessive pronouns appear in many common Spanish expressions:`,
    subsections: [
      {
        title: 'Family and Relationships',
        content: `Very common with family members and personal relationships:`,
        examples: [
          {
            spanish: 'mi familia',
            english: 'my family',
            highlight: ['mi']
          },
          {
            spanish: 'nuestros hijos',
            english: 'our children',
            highlight: ['nuestros']
          },
          {
            spanish: 'tu mejor amigo',
            english: 'your best friend',
            highlight: ['tu']
          },
          {
            spanish: 'sus padres',
            english: 'his/her/their parents',
            highlight: ['sus']
          }
        ]
      },
      {
        title: 'Common Phrases',
        content: `Frequent expressions with possessives:`,
        examples: [
          {
            spanish: 'a mi manera',
            english: 'my way / in my way',
            highlight: ['mi']
          },
          {
            spanish: 'por tu culpa',
            english: 'because of you / your fault',
            highlight: ['tu']
          },
          {
            spanish: 'en nuestro tiempo',
            english: 'in our time',
            highlight: ['nuestro']
          },
          {
            spanish: 'con sus propias manos',
            english: 'with his/her own hands',
            highlight: ['sus']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Possessive Mistakes',
    content: `Here are common mistakes Spanish learners make with possessive pronouns:

**Mistake 1**: Making possessives agree with the owner instead of the thing possessed
**Mistake 2**: Using long forms when short forms are needed
**Mistake 3**: Forgetting gender agreement with nuestro/vuestro
**Mistake 4**: Overusing su without clarification

Learning to avoid these mistakes will make your Spanish sound natural.`,
    examples: [
      {
        spanish: '❌ María tiene su casa (thinking "her" = feminine) → ✅ María tiene su casa',
        english: 'Wrong thinking → Right: María has her house (su agrees with casa, not María)',
        highlight: ['su casa']
      },
      {
        spanish: '❌ mi casa es mía → ✅ mi casa / la casa es mía',
        english: 'Wrong: my house is mine → Right: my house / the house is mine',
        highlight: ['mi casa', 'mía']
      },
      {
        spanish: '❌ nuestro casa → ✅ nuestra casa',
        english: 'Wrong: our house → Right: our house (feminine agreement)',
        highlight: ['nuestro casa', 'nuestra casa']
      },
      {
        spanish: '❌ su casa (ambiguous) → ✅ la casa de él/ella',
        english: 'Unclear: his/her house → Clear: his house / her house',
        highlight: ['su casa', 'la casa de él/ella']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'Spanish Personal Pronouns',
    url: '/grammar/spanish/pronouns/personal',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Noun Gender',
    url: '/grammar/spanish/nouns/gender',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Adjective Agreement',
    url: '/grammar/spanish/adjectives/agreement',
    difficulty: 'beginner'
  },
  {
    title: 'Direct Object Pronouns',
    url: '/grammar/spanish/pronouns/direct-object',
    difficulty: 'intermediate'
  }
];

export default function SpanishPossessivePronounsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'pronouns',
              topic: 'possessive',
              title: 'Spanish Possessive Pronouns',
              description: 'Master Spanish possessive pronouns: mi, tu, su, nuestro, vuestro. Learn to show ownership and relationships.',
              difficulty: 'beginner',
              examples: [
                'mi casa (my house)',
                'tu libro (your book)',
                'nuestro coche (our car)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'pronouns',
              topic: 'possessive',
              title: 'Spanish Possessive Pronouns'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="pronouns"
        topic="possessive"
        title="Spanish Possessive Pronouns"
        description="Master Spanish possessive pronouns: mi, tu, su, nuestro, vuestro. Learn to show ownership and relationships"
        difficulty="beginner"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/spanish/pronouns"
        practiceUrl="/grammar/spanish/pronouns/possessive/practice"
        quizUrl="/grammar/spanish/pronouns/possessive/quiz"
        songUrl="/songs/es?theme=grammar&topic=possessive-pronouns"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
