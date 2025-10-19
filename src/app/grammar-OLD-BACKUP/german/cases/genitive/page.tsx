import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'cases',
  topic: 'genitive',
  title: 'German Genitive Case - Possession, Articles, and Usage',
  description: 'Master the German genitive case including possession, articles, prepositions, and formal usage patterns.',
  difficulty: 'intermediate',
  keywords: [
    'german genitive case',
    'genitiv german',
    'german possession',
    'genitive prepositions german',
    'german case system',
    'genitive articles german'
  ],
  examples: [
    'das Haus meines Vaters (my father\'s house)',
    'die Farbe des Autos (the color of the car)',
    'während des Sommers (during the summer)',
    'trotz des Regens (despite the rain)'
  ]
});

const sections = [
  {
    title: 'Understanding the German Genitive Case',
    content: `The **German genitive case** (der Genitiv) primarily expresses **possession** and **relationships between nouns**. It is the **most formal** of the four German cases and is increasingly **replaced by dative constructions** in spoken German.

**Main functions of the genitive case:**
- **Possession**: Showing ownership or belonging
- **Genitive prepositions**: Formal prepositions requiring genitive
- **Time expressions**: Certain temporal phrases
- **Descriptions**: Expressing characteristics or qualities
- **Formal language**: Academic, legal, and literary contexts

**Key characteristics:**
- **Fourth case**: The most complex and formal case
- **Possession marker**: Shows "of" or "'s" relationships
- **Declining usage**: Less common in spoken German
- **Formal register**: More frequent in written German
- **Article changes**: Distinctive genitive article forms

**Modern usage trends:**
- **Written German**: Still widely used in formal texts
- **Spoken German**: Often replaced by dative with "von"
- **Regional variation**: More preserved in some areas
- **Educational importance**: Essential for reading formal German

**Why learn the genitive:**
- **Reading comprehension**: Understanding formal texts
- **Academic German**: Required for university-level German
- **Professional contexts**: Business and legal German
- **Cultural competence**: Appreciating literary German

The genitive case is **crucial** for **advanced German proficiency** and **formal communication**.`,
    examples: [
      {
        spanish: 'POSSESSION: das Auto meines Bruders (my brother\'s car)',
        english: 'DESCRIPTION: ein Mann großer Intelligenz (a man of great intelligence)',
        highlight: ['meines Bruders', 'großer Intelligenz']
      },
      {
        spanish: 'PREPOSITION: während des Krieges (during the war)',
        english: 'TIME: eines Tages (one day)',
        highlight: ['während des Krieges', 'eines Tages']
      }
    ]
  },
  {
    title: 'Genitive Articles',
    content: `**Definite and indefinite articles** have distinctive forms in the genitive case:`,
    conjugationTable: {
      title: 'Genitive Articles',
      conjugations: [
        { pronoun: 'Masculine', form: 'des / eines', english: 'des Mannes (of the man) / eines Mannes (of a man)' },
        { pronoun: 'Feminine', form: 'der / einer', english: 'der Frau (of the woman) / einer Frau (of a woman)' },
        { pronoun: 'Neuter', form: 'des / eines', english: 'des Kindes (of the child) / eines Kindes (of a child)' },
        { pronoun: 'Plural', form: 'der / —', english: 'der Kinder (of the children) / — Kinder (of children)' }
      ]
    },
    examples: [
      {
        spanish: 'DEFINITE: das Haus des Mannes, der Frau, des Kindes',
        english: 'INDEFINITE: das Haus eines Mannes, einer Frau, eines Kindes',
        highlight: ['des Mannes, der Frau, des Kindes', 'eines Mannes, einer Frau, eines Kindes']
      }
    ],
    subsections: [
      {
        title: 'Noun Endings',
        content: 'Masculine and neuter nouns add -s or -es in genitive:',
        examples: [
          {
            spanish: 'der Mann → des Mannes, das Kind → des Kindes',
            english: 'das Auto → des Autos, der Tisch → des Tisches',
            highlight: ['des Mannes', 'des Kindes']
          }
        ]
      }
    ]
  },
  {
    title: 'Genitive Personal Pronouns',
    content: `**Personal pronouns** in genitive are **rarely used** in modern German:`,
    conjugationTable: {
      title: 'Genitive Personal Pronouns (Archaic)',
      conjugations: [
        { pronoun: 'ich', form: 'meiner', english: 'of me (archaic/poetic)' },
        { pronoun: 'du', form: 'deiner', english: 'of you (archaic/poetic)' },
        { pronoun: 'er', form: 'seiner', english: 'of him (archaic/poetic)' },
        { pronoun: 'sie', form: 'ihrer', english: 'of her (archaic/poetic)' },
        { pronoun: 'es', form: 'seiner', english: 'of it (archaic/poetic)' }
      ]
    },
    examples: [
      {
        spanish: 'ARCHAIC: Gedenke meiner! (Remember me!)',
        english: 'MODERN: Denk an mich! (Think of me!)',
        highlight: ['Gedenke meiner', 'Denk an mich']
      }
    ],
    subsections: [
      {
        title: 'Modern Alternatives',
        content: 'Modern German uses dative with "von" instead:',
        examples: [
          {
            spanish: 'OLD: das Haus meiner → NEW: das Haus von mir',
            english: 'Genitive pronouns sound very archaic today',
            highlight: ['das Haus von mir']
          }
        ]
      }
    ]
  },
  {
    title: 'Genitive Prepositions',
    content: `**Certain prepositions** require the genitive case (formal usage):`,
    conjugationTable: {
      title: 'Genitive Prepositions',
      conjugations: [
        { pronoun: 'während', form: 'during', english: 'während des Sommers (during the summer)' },
        { pronoun: 'wegen', form: 'because of', english: 'wegen des Regens (because of the rain)' },
        { pronoun: 'trotz', form: 'despite', english: 'trotz des Problems (despite the problem)' },
        { pronoun: 'statt/anstatt', form: 'instead of', english: 'statt des Autos (instead of the car)' },
        { pronoun: 'außerhalb', form: 'outside of', english: 'außerhalb der Stadt (outside the city)' },
        { pronoun: 'innerhalb', form: 'within', english: 'innerhalb eines Jahres (within a year)' }
      ]
    },
    examples: [
      {
        spanish: 'Während des Winters ist es kalt. (During winter it\'s cold.)',
        english: 'Wegen des Sturms blieben wir zu Hause. (Because of the storm we stayed home.)',
        highlight: ['Während des Winters', 'wegen des Sturms']
      },
      {
        spanish: 'Trotz des Regens gingen wir spazieren. (Despite the rain we went for a walk.)',
        english: 'Statt des Zuges nahmen wir das Auto. (Instead of the train we took the car.)',
        highlight: ['Trotz des Regens', 'Statt des Zuges']
      }
    ],
    subsections: [
      {
        title: 'Colloquial Alternatives',
        content: 'In spoken German, these often take dative:',
        examples: [
          {
            spanish: 'FORMAL: wegen des Regens',
            english: 'COLLOQUIAL: wegen dem Regen',
            highlight: ['wegen des Regens', 'wegen dem Regen']
          }
        ]
      }
    ]
  },
  {
    title: 'Expressing Possession',
    content: `The **primary function** of genitive is showing **possession** and **relationships**:`,
    examples: [
      {
        spanish: 'das Auto meines Vaters (my father\'s car)',
        english: 'die Bücher der Studenten (the students\' books)',
        highlight: ['meines Vaters', 'der Studenten']
      },
      {
        spanish: 'der Anfang des Films (the beginning of the movie)',
        english: 'das Ende der Geschichte (the end of the story)',
        highlight: ['des Films', 'der Geschichte']
      }
    ],
    subsections: [
      {
        title: 'Word Order',
        content: 'Genitive usually follows the noun it modifies:',
        examples: [
          {
            spanish: 'das Haus [GENITIVE] meines Vaters',
            english: 'Possessor comes after the possessed noun',
            highlight: ['meines Vaters']
          }
        ]
      }
    ]
  },
  {
    title: 'Genitive with Adjectives',
    content: `**Some adjectives** require genitive case (formal/archaic):`,
    conjugationTable: {
      title: 'Adjectives Taking Genitive',
      conjugations: [
        { pronoun: 'müde', form: 'tired of', english: 'Ich bin des Wartens müde. (I\'m tired of waiting.)' },
        { pronoun: 'sicher', form: 'certain of', english: 'Ich bin meiner Sache sicher. (I\'m certain of my case.)' },
        { pronoun: 'schuldig', form: 'guilty of', english: 'Er ist des Mordes schuldig. (He\'s guilty of murder.)' },
        { pronoun: 'würdig', form: 'worthy of', english: 'Das ist des Lobes würdig. (That\'s worthy of praise.)' }
      ]
    },
    examples: [
      {
        spanish: 'Ich bin des Lebens müde. (I\'m tired of life.) - Literary',
        english: 'Er ist seiner Sache sicher. (He\'s certain of his case.) - Formal',
        highlight: ['des Lebens müde', 'seiner Sache sicher']
      }
    ]
  },
  {
    title: 'Time Expressions with Genitive',
    content: `**Certain time expressions** use genitive (formal):`,
    conjugationTable: {
      title: 'Genitive Time Expressions',
      conjugations: [
        { pronoun: 'eines Tages', form: 'one day', english: 'Eines Tages werde ich reich sein. (One day I\'ll be rich.)' },
        { pronoun: 'eines Morgens', form: 'one morning', english: 'Eines Morgens war er weg. (One morning he was gone.)' },
        { pronoun: 'des Nachts', form: 'at night', english: 'Des Nachts ist es ruhig. (At night it\'s quiet.)' },
        { pronoun: 'des Öfteren', form: 'quite often', english: 'Das passiert des Öfteren. (That happens quite often.)' }
      ]
    },
    examples: [
      {
        spanish: 'Eines Tages werden wir uns wiedersehen. (One day we\'ll see each other again.)',
        english: 'Des Nachts hört man die Eulen. (At night you hear the owls.)',
        highlight: ['Eines Tages', 'Des Nachts']
      }
    ]
  },
  {
    title: 'Genitive vs von + Dative',
    content: `**Modern German** often replaces genitive with **von + dative**:`,
    conjugationTable: {
      title: 'Genitive vs von + Dative',
      conjugations: [
        { pronoun: 'Formal/Written', form: 'das Auto meines Vaters', english: 'my father\'s car (genitive)' },
        { pronoun: 'Informal/Spoken', form: 'das Auto von meinem Vater', english: 'my father\'s car (von + dative)' },
        { pronoun: 'Formal', form: 'die Farbe des Hauses', english: 'the color of the house (genitive)' },
        { pronoun: 'Informal', form: 'die Farbe von dem Haus', english: 'the color of the house (von + dative)' }
      ]
    },
    examples: [
      {
        spanish: 'WRITTEN: die Werke Goethes (Goethe\'s works)',
        english: 'SPOKEN: die Werke von Goethe (Goethe\'s works)',
        highlight: ['die Werke Goethes', 'die Werke von Goethe']
      }
    ]
  },
  {
    title: 'Proper Names in Genitive',
    content: `**Proper names** have special genitive forms:`,
    conjugationTable: {
      title: 'Proper Names in Genitive',
      conjugations: [
        { pronoun: 'Male names', form: 'Add -s', english: 'Peters Auto (Peter\'s car), Marks Buch (Mark\'s book)' },
        { pronoun: 'Female names', form: 'Add -s', english: 'Marias Haus (Maria\'s house), Annas Katze (Anna\'s cat)' },
        { pronoun: 'Names ending in -s', form: 'Add apostrophe', english: 'Klaus\' Auto (Klaus\'s car), Thomas\' Buch (Thomas\'s book)' },
        { pronoun: 'With articles', form: 'Regular genitive', english: 'das Auto des Peter (Peter\'s car - formal)' }
      ]
    },
    examples: [
      {
        spanish: 'Das ist Michaels Fahrrad. (That\'s Michael\'s bicycle.)',
        english: 'Wo ist Sabines Tasche? (Where is Sabine\'s bag?)',
        highlight: ['Michaels Fahrrad', 'Sabines Tasche']
      },
      {
        spanish: 'Klaus\' Meinung ist wichtig. (Klaus\'s opinion is important.)',
        english: 'Das ist Thomas\' Problem. (That\'s Thomas\'s problem.)',
        highlight: ['Klaus\' Meinung', 'Thomas\' Problem']
      }
    ]
  },
  {
    title: 'Common Mistakes with Genitive',
    content: `Here are frequent errors students make:

**1. Wrong article forms**: Confusing genitive articles
**2. Missing noun endings**: Forgetting -s/-es on masculine/neuter nouns
**3. Overusing in speech**: Using genitive in casual conversation
**4. Wrong preposition case**: Using accusative/dative with genitive prepositions`,
    examples: [
      {
        spanish: '❌ das Auto des Mann → ✅ das Auto des Mannes',
        english: 'Wrong: masculine nouns need -es ending in genitive',
        highlight: ['des Mannes']
      },
      {
        spanish: '❌ während dem Sommer → ✅ während des Sommers',
        english: 'Wrong: während takes genitive, not dative',
        highlight: ['während des Sommers']
      },
      {
        spanish: '❌ das Haus meiner Vater → ✅ das Haus meines Vaters',
        english: 'Wrong: need genitive article and noun ending',
        highlight: ['meines Vaters']
      },
      {
        spanish: '❌ Spoken: das Auto meines Vaters → ✅ das Auto von meinem Vater',
        english: 'Better: use von + dative in casual speech',
        highlight: ['von meinem Vater']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Dative Case', url: '/grammar/german/cases/dative', difficulty: 'intermediate' },
  { title: 'German Accusative Case', url: '/grammar/german/cases/accusative', difficulty: 'beginner' },
  { title: 'German Prepositions', url: '/grammar/german/cases/prepositions', difficulty: 'intermediate' },
  { title: 'German Noun Declension', url: '/grammar/german/nouns/declension', difficulty: 'intermediate' }
];

export default function GermanGenitivePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'german',
              category: 'cases',
              topic: 'genitive',
              title: 'German Genitive Case - Possession, Articles, and Usage',
              description: 'Master the German genitive case including possession, articles, prepositions, and formal usage patterns.',
              difficulty: 'intermediate',
              examples: [
                'das Haus meines Vaters (my father\'s house)',
                'die Farbe des Autos (the color of the car)',
                'während des Sommers (during the summer)',
                'trotz des Regens (despite the rain)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'cases',
              topic: 'genitive',
              title: 'German Genitive Case - Possession, Articles, and Usage'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="cases"
        topic="genitive"
        title="German Genitive Case - Possession, Articles, and Usage"
        description="Master the German genitive case including possession, articles, prepositions, and formal usage patterns"
        difficulty="intermediate"
        estimatedTime={16}
        sections={sections}
        backUrl="/grammar/german/cases"
        practiceUrl="/grammar/german/cases/genitive/practice"
        quizUrl="/grammar/german/cases/genitive/quiz"
        songUrl="/songs/de?theme=grammar&topic=genitive"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
