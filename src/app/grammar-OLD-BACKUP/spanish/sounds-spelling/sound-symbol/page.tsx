import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'sounds-spelling',
  topic: 'sound-symbol',
  title: 'Spanish Sound-Symbol Correspondences (Pronunciation and Spelling)',
  description: 'Master Spanish sound-symbol correspondences including pronunciation rules, spelling patterns, and phonetic relationships.',
  difficulty: 'beginner',
  keywords: [
    'spanish pronunciation',
    'spanish spelling',
    'sound symbol spanish',
    'spanish phonetics',
    'pronunciation rules spanish',
    'spanish orthography'
  ],
  examples: [
    'c + e/i = /θ/ (Spain) or /s/ (Latin America)',
    'g + e/i = /x/ (like English h)',
    'j = /x/ (like English h)',
    'ñ = /ɲ/ (like ny in canyon)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Sound-Symbol Correspondences',
    content: `Spanish has **highly regular** sound-symbol correspondences, making it one of the **most phonetic languages** in the world. Unlike English, Spanish spelling is **highly predictable** from pronunciation and vice versa.

**Key characteristics:**
- **Phonetic language**: What you see is what you say
- **Regular patterns**: Consistent spelling rules
- **Few exceptions**: Very predictable system
- **Regional variations**: Some sounds differ between Spain and Latin America
- **Clear vowel system**: Only 5 vowel sounds

**Why this matters:**
- **Easy to read**: Once you know the rules, reading is straightforward
- **Predictable spelling**: Hearing a word helps you spell it
- **Pronunciation confidence**: Clear rules reduce uncertainty
- **Learning efficiency**: Systematic approach to pronunciation

**Main sound-symbol relationships:**
- **Vowels**: a, e, i, o, u (always the same sounds)
- **Consonants**: Most are consistent, some have variations
- **Special combinations**: ch, ll, rr, qu, gu
- **Regional differences**: c/z, ll/y variations

Understanding these correspondences is **fundamental** for **accurate pronunciation** and **correct spelling**.`,
    examples: [
      {
        spanish: 'casa /ˈka.sa/ (house) - Each letter = one sound',
        english: 'mesa /ˈme.sa/ (table) - Completely phonetic',
        highlight: ['casa /ˈka.sa/', 'mesa /ˈme.sa/']
      },
      {
        spanish: 'perro /ˈpe.ro/ (dog) - rr = rolled r sound',
        english: 'niño /ˈni.ɲo/ (child) - ñ = ny sound',
        highlight: ['perro /ˈpe.ro/', 'niño /ˈni.ɲo/']
      },
      {
        spanish: 'queso /ˈke.so/ (cheese) - qu = k sound',
        english: 'guerra /ˈge.ra/ (war) - gu = g sound',
        highlight: ['queso /ˈke.so/', 'guerra /ˈge.ra/']
      }
    ]
  },
  {
    title: 'Spanish Vowel System',
    content: `Spanish has **5 pure vowel sounds** that never change:`,
    conjugationTable: {
      title: 'Spanish Vowel Sounds',
      conjugations: [
        { pronoun: 'a', form: '/a/', english: 'Like "ah" in father - casa, mapa, hablar' },
        { pronoun: 'e', form: '/e/', english: 'Like "eh" in bet - mesa, verde, comer' },
        { pronoun: 'i', form: '/i/', english: 'Like "ee" in see - sí, vivir, niño' },
        { pronoun: 'o', form: '/o/', english: 'Like "oh" in more - solo, color, amor' },
        { pronoun: 'u', form: '/u/', english: 'Like "oo" in moon - tú, mucho, azul' }
      ]
    },
    examples: [
      {
        spanish: 'a: casa, mapa, hablar, trabajar',
        english: 'e: mesa, verde, comer, beber',
        highlight: ['casa, mapa', 'mesa, verde']
      },
      {
        spanish: 'i: sí, vivir, niño, escribir',
        english: 'o: solo, color, amor, doctor',
        highlight: ['sí, vivir', 'solo, color']
      },
      {
        spanish: 'u: tú, mucho, azul, estudiar',
        english: 'Always the same sound in any position',
        highlight: ['tú, mucho, azul']
      }
    ],
    subsections: [
      {
        title: 'No Vowel Reduction',
        content: 'Spanish vowels never reduce in unstressed syllables:',
        examples: [
          {
            spanish: 'teléfono - all vowels clear: /te.ˈle.fo.no/',
            english: 'English "telephone" reduces vowels: /ˈtel.ɪ.foʊn/',
            highlight: ['/te.ˈle.fo.no/']
          }
        ]
      }
    ]
  },
  {
    title: 'Regular Consonant Correspondences',
    content: `**Most Spanish consonants** have **one consistent sound**:`,
    conjugationTable: {
      title: 'Regular Consonant Sounds',
      conjugations: [
        { pronoun: 'b/v', form: '/b/', english: 'Both letters = same sound - boca, vaca' },
        { pronoun: 'd', form: '/d/', english: 'Like English d - día, donde' },
        { pronoun: 'f', form: '/f/', english: 'Like English f - familia, café' },
        { pronoun: 'l', form: '/l/', english: 'Like English l - libro, sol' },
        { pronoun: 'm', form: '/m/', english: 'Like English m - mesa, comer' },
        { pronoun: 'n', form: '/n/', english: 'Like English n - no, pan' },
        { pronoun: 'p', form: '/p/', english: 'Like English p (no aspiration) - papa, copa' },
        { pronoun: 's', form: '/s/', english: 'Like English s - casa, es' },
        { pronoun: 't', form: '/t/', english: 'Like English t (no aspiration) - tú, gato' }
      ]
    },
    examples: [
      {
        spanish: 'b/v: boca (mouth), vaca (cow) - Same sound!',
        english: 'p/t: papa (potato), tú (you) - No aspiration',
        highlight: ['boca, vaca', 'papa, tú']
      }
    ]
  },
  {
    title: 'Variable Consonant Correspondences',
    content: `**Some consonants** have **different sounds** depending on context:`,
    conjugationTable: {
      title: 'Context-Dependent Consonants',
      conjugations: [
        { pronoun: 'c + a,o,u', form: '/k/', english: 'casa, color, cubo' },
        { pronoun: 'c + e,i', form: '/θ/ (Spain) /s/ (Latin America)', english: 'centro, cinco' },
        { pronoun: 'g + a,o,u', form: '/g/', english: 'gato, goma, gusto' },
        { pronoun: 'g + e,i', form: '/x/', english: 'gente, gimnasio' },
        { pronoun: 'z', form: '/θ/ (Spain) /s/ (Latin America)', english: 'zapato, azul' },
        { pronoun: 'j', form: '/x/', english: 'joven, trabajo' }
      ]
    },
    examples: [
      {
        spanish: 'c: casa /ˈka.sa/ vs. centro /ˈθen.tro/ (Spain)',
        english: 'g: gato /ˈga.to/ vs. gente /ˈxen.te/',
        highlight: ['casa /ˈka.sa/', 'centro /ˈθen.tro/', 'gato /ˈga.to/', 'gente /ˈxen.te/']
      }
    ]
  },
  {
    title: 'Special Letter Combinations',
    content: `**Digraphs and special combinations** in Spanish:`,
    conjugationTable: {
      title: 'Spanish Digraphs and Combinations',
      conjugations: [
        { pronoun: 'ch', form: '/tʃ/', english: 'Like English ch - chocolate, mucho' },
        { pronoun: 'll', form: '/ʎ/ or /ʝ/', english: 'Regional variation - llamar, calle' },
        { pronoun: 'ñ', form: '/ɲ/', english: 'Like ny in canyon - niño, año' },
        { pronoun: 'rr', form: '/r/', english: 'Rolled r - perro, carro' },
        { pronoun: 'qu', form: '/k/', english: 'Always before e,i - queso, quién' },
        { pronoun: 'gu + e,i', form: '/g/', english: 'guerra, guitarra' }
      ]
    },
    examples: [
      {
        spanish: 'ch: chocolate /tʃo.ko.ˈla.te/, mucho /ˈmu.tʃo/',
        english: 'ñ: niño /ˈni.ɲo/, año /ˈa.ɲo/',
        highlight: ['chocolate', 'niño']
      },
      {
        spanish: 'rr: perro /ˈpe.ro/, carro /ˈka.ro/',
        english: 'qu: queso /ˈke.so/, quién /kjen/',
        highlight: ['perro', 'queso']
      }
    ]
  },
  {
    title: 'Regional Pronunciation Differences',
    content: `**Main regional variations** in Spanish pronunciation:`,
    conjugationTable: {
      title: 'Spain vs Latin America',
      conjugations: [
        { pronoun: 'c + e,i', form: 'Spain: /θ/ (th sound)', english: 'Latin America: /s/ (s sound)' },
        { pronoun: 'z', form: 'Spain: /θ/ (th sound)', english: 'Latin America: /s/ (s sound)' },
        { pronoun: 'll', form: 'Traditional: /ʎ/ (ly sound)', english: 'Modern: /ʝ/ (y sound) - yeísmo' },
        { pronoun: 'y', form: 'Most regions: /ʝ/', english: 'Argentina: /ʃ/ or /ʒ/ (sh/zh sounds)' }
      ]
    },
    examples: [
      {
        spanish: 'SPAIN: cinco /ˈθin.ko/, zapato /θa.ˈpa.to/',
        english: 'LATIN AMERICA: cinco /ˈsin.ko/, zapato /sa.ˈpa.to/',
        highlight: ['/ˈθin.ko/', '/ˈsin.ko/', '/θa.ˈpa.to/', '/sa.ˈpa.to/']
      },
      {
        spanish: 'TRADITIONAL: llamar /ʎa.ˈmar/, calle /ˈka.ʎe/',
        english: 'MODERN: llamar /ʝa.ˈmar/, calle /ˈka.ʝe/',
        highlight: ['/ʎa.ˈmar/', '/ʝa.ˈmar/']
      }
    ]
  },
  {
    title: 'Silent Letters and Exceptions',
    content: `**Very few silent letters** in Spanish:`,
    examples: [
      {
        spanish: 'h: Always silent - hola /ˈo.la/, hacer /a.ˈθer/',
        english: 'u in qu: Silent - queso /ˈke.so/, quién /kjen/',
        highlight: ['hola /ˈo.la/', 'queso /ˈke.so/']
      },
      {
        spanish: 'u in gu + e,i: Silent - guerra /ˈge.ra/, guitarra /gi.ˈta.ra/',
        english: 'But pronounced in gü: pingüino /pin.ˈgwi.no/',
        highlight: ['guerra /ˈge.ra/', 'pingüino /pin.ˈgwi.no/']
      }
    ],
    subsections: [
      {
        title: 'The Letter H',
        content: 'H is always silent in Spanish:',
        examples: [
          {
            spanish: 'hola (hello), hacer (to do), hospital (hospital)',
            english: 'Pronounced as if the h weren\'t there',
            highlight: ['hola', 'hacer', 'hospital']
          }
        ]
      }
    ]
  },
  {
    title: 'Spelling Rules from Sound',
    content: `**How to spell** what you hear in Spanish:`,
    conjugationTable: {
      title: 'Sound to Spelling Rules',
      conjugations: [
        { pronoun: '/k/ sound', form: 'c (+ a,o,u), qu (+ e,i)', english: 'casa, queso' },
        { pronoun: '/g/ sound', form: 'g (+ a,o,u), gu (+ e,i)', english: 'gato, guerra' },
        { pronoun: '/θ/ or /s/', form: 'c (+ e,i), z (+ a,o,u)', english: 'centro, zapato' },
        { pronoun: '/x/ sound', form: 'j (anywhere), g (+ e,i)', english: 'joven, gente' },
        { pronoun: '/b/ sound', form: 'b or v (same sound)', english: 'boca, vaca' }
      ]
    },
    examples: [
      {
        spanish: '/k/: casa, queso, kilo (foreign words)',
        english: '/x/: joven, gente, México',
        highlight: ['casa, queso', 'joven, gente']
      }
    ]
  },
  {
    title: 'Common Spelling Challenges',
    content: `**Tricky spellings** for Spanish learners:`,
    examples: [
      {
        spanish: 'b vs v: Both sound the same - escribir, vivir',
        english: 'c vs z: Context determines usage - centro, zapato',
        highlight: ['escribir, vivir', 'centro, zapato']
      },
      {
        spanish: 'g vs j: Before e,i they sound the same - gente, joven',
        english: 'y vs ll: Often sound the same - calle, mayo',
        highlight: ['gente, joven', 'calle, mayo']
      }
    ],
    subsections: [
      {
        title: 'B vs V Challenge',
        content: 'Same sound, different spelling:',
        examples: [
          {
            spanish: 'MEMORY AID: "B" words often relate to "being"',
            english: 'V words often relate to movement or life',
            highlight: ['B', 'V']
          }
        ]
      }
    ]
  },
  {
    title: 'Phonetic Transcription Basics',
    content: `**Understanding phonetic symbols** for Spanish:`,
    conjugationTable: {
      title: 'Key Phonetic Symbols',
      conjugations: [
        { pronoun: '/a/', form: 'Open central vowel', english: 'casa /ˈka.sa/' },
        { pronoun: '/e/', form: 'Mid front vowel', english: 'mesa /ˈme.sa/' },
        { pronoun: '/i/', form: 'High front vowel', english: 'sí /si/' },
        { pronoun: '/o/', form: 'Mid back vowel', english: 'solo /ˈso.lo/' },
        { pronoun: '/u/', form: 'High back vowel', english: 'tú /tu/' },
        { pronoun: '/θ/', form: 'Voiceless th (Spain)', english: 'cinco /ˈθin.ko/' },
        { pronoun: '/x/', form: 'Voiceless velar fricative', english: 'joven /ˈxo.βen/' },
        { pronoun: '/ɲ/', form: 'Palatal nasal', english: 'niño /ˈni.ɲo/' }
      ]
    },
    examples: [
      {
        spanish: 'hola /ˈo.la/ - stress on first syllable',
        english: 'español /es.pa.ˈɲol/ - stress on last syllable',
        highlight: ['/ˈo.la/', '/es.pa.ˈɲol/']
      }
    ]
  },
  {
    title: 'Common Pronunciation Mistakes',
    content: `Here are frequent errors students make:

**1. Vowel reduction**: Pronouncing unstressed vowels like English
**2. Aspiration**: Adding puff of air to p, t, k sounds
**3. B/V confusion**: Trying to make different sounds
**4. Silent H**: Trying to pronounce the letter H`,
    examples: [
      {
        spanish: '❌ teléfono /təˈlefəno/ → ✅ teléfono /te.ˈle.fo.no/',
        english: 'Wrong: don\'t reduce unstressed vowels',
        highlight: ['/te.ˈle.fo.no/']
      },
      {
        spanish: '❌ papa /pʰapa/ → ✅ papa /ˈpa.pa/',
        english: 'Wrong: no aspiration on p, t, k',
        highlight: ['/ˈpa.pa/']
      },
      {
        spanish: '❌ vaca /vaka/ → ✅ vaca /ˈba.ka/',
        english: 'Wrong: v sounds like b in Spanish',
        highlight: ['/ˈba.ka/']
      },
      {
        spanish: '❌ hola /hola/ → ✅ hola /ˈo.la/',
        english: 'Wrong: h is always silent',
        highlight: ['/ˈo.la/']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Stress Patterns', url: '/grammar/spanish/sounds-spelling/stress-patterns', difficulty: 'intermediate' },
  { title: 'Spanish Written Accents', url: '/grammar/spanish/sounds-spelling/written-accents', difficulty: 'intermediate' },
  { title: 'Spanish Pronunciation Guide', url: '/pronunciation/spanish', difficulty: 'beginner' },
  { title: 'Spanish Regional Variations', url: '/culture/spanish/regional-variations', difficulty: 'intermediate' }
];

export default function SpanishSoundSymbolPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'sounds-spelling',
              topic: 'sound-symbol',
              title: 'Spanish Sound-Symbol Correspondences (Pronunciation and Spelling)',
              description: 'Master Spanish sound-symbol correspondences including pronunciation rules, spelling patterns, and phonetic relationships.',
              difficulty: 'beginner',
              examples: [
                'c + e/i = /θ/ (Spain) or /s/ (Latin America)',
                'g + e/i = /x/ (like English h)',
                'j = /x/ (like English h)',
                'ñ = /ɲ/ (like ny in canyon)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'sounds-spelling',
              topic: 'sound-symbol',
              title: 'Spanish Sound-Symbol Correspondences (Pronunciation and Spelling)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="sounds-spelling"
        topic="sound-symbol"
        title="Spanish Sound-Symbol Correspondences (Pronunciation and Spelling)"
        description="Master Spanish sound-symbol correspondences including pronunciation rules, spelling patterns, and phonetic relationships"
        difficulty="beginner"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/spanish/sounds-spelling"
        practiceUrl="/grammar/spanish/sounds-spelling/sound-symbol/practice"
        quizUrl="/grammar/spanish/sounds-spelling/sound-symbol/quiz"
        songUrl="/songs/es?theme=grammar&topic=sound-symbol"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
