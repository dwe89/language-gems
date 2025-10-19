import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'nouns',
  topic: 'weak-nouns',
  title: 'German Weak Nouns - N-Declension Pattern and Examples',
  description: 'Master German weak nouns (n-declension) including identification patterns and complete declension rules.',
  difficulty: 'intermediate',
  keywords: [
    'german weak nouns',
    'n declension german',
    'german weak masculine nouns',
    'der junge german',
    'german noun endings'
  ],
  examples: [
    'der Junge → den Jungen → dem Jungen → des Jungen',
    'der Student → den Studenten → dem Studenten → des Studenten',
    'der Herr → den Herrn → dem Herrn → des Herrn',
    'der Löwe → den Löwen → dem Löwen → des Löwen'
  ]
});

const sections = [
  {
    title: 'Understanding German Weak Nouns',
    content: `German **weak nouns** (schwache Substantive) follow the **n-declension** pattern, adding **-n or -en** to all cases except nominative singular. They are **exclusively masculine** and typically refer to **living beings**.

**Key characteristics:**
- **Only masculine**: All weak nouns are masculine (der)
- **Living beings**: Usually people, animals, or personified concepts
- **N-declension**: Add -n/-en in all cases except nominative singular
- **Predictable pattern**: Once identified, declension is regular

**Basic pattern:**
- **Nominative**: der Junge (no ending)
- **Accusative**: den Jungen (-n ending)
- **Dative**: dem Jungen (-n ending)
- **Genitive**: des Jungen (-n ending)

**Why weak nouns matter:**
- **Common usage**: Many everyday nouns are weak
- **Grammatical accuracy**: Essential for correct German
- **Pattern recognition**: Learn to identify weak nouns
- **Advanced proficiency**: Mark sophisticated understanding

**Identification clues:**
- **Ending patterns**: -e, -ant, -ent, -ist, -oge
- **Living beings**: People, animals, professions
- **Foreign origins**: Many borrowed words

Understanding weak nouns is **crucial** for **correct German declension**.`,
    examples: [
      {
        spanish: 'WEAK NOUN: der Junge → den Jungen → dem Jungen → des Jungen',
        english: 'STRONG NOUN: der Mann → den Mann → dem Mann → des Mannes',
        highlight: ['den Jungen', 'des Mannes']
      },
      {
        spanish: 'LIVING BEING: der Student (student), der Löwe (lion)',
        english: 'PROFESSION: der Journalist (journalist), der Architekt (architect)',
        highlight: ['der Student', 'der Journalist']
      }
    ]
  },
  {
    title: 'Complete Weak Noun Declension Pattern',
    content: `**N-declension pattern** for all weak nouns:`,
    conjugationTable: {
      title: 'Weak Noun Declension',
      conjugations: [
        { pronoun: 'Nominative', form: 'der + noun', english: 'der Junge (the boy)' },
        { pronoun: 'Accusative', form: 'den + noun + (e)n', english: 'den Jungen (the boy - object)' },
        { pronoun: 'Dative', form: 'dem + noun + (e)n', english: 'dem Jungen (to/for the boy)' },
        { pronoun: 'Genitive', form: 'des + noun + (e)n', english: 'des Jungen (of the boy)' }
      ]
    },
    examples: [
      {
        spanish: 'SINGULAR: der Student → den Studenten → dem Studenten → des Studenten',
        english: 'PLURAL: die Studenten → die Studenten → den Studenten → der Studenten',
        highlight: ['den Studenten', 'des Studenten']
      },
      {
        spanish: 'PATTERN: All cases except nominative add -n or -en',
        english: 'CONSISTENCY: Same ending throughout accusative, dative, genitive',
        highlight: ['-n or -en']
      }
    ]
  },
  {
    title: 'Weak Nouns Ending in -e',
    content: `**Most common weak nouns** end in **-e** and add **-n**:`,
    conjugationTable: {
      title: 'Weak Nouns Ending in -e',
      conjugations: [
        { pronoun: 'der Junge', form: 'boy', english: 'den Jungen, dem Jungen, des Jungen' },
        { pronoun: 'der Kunde', form: 'customer', english: 'den Kunden, dem Kunden, des Kunden' },
        { pronoun: 'der Kollege', form: 'colleague', english: 'den Kollegen, dem Kollegen, des Kollegen' },
        { pronoun: 'der Experte', form: 'expert', english: 'den Experten, dem Experten, des Experten' },
        { pronoun: 'der Löwe', form: 'lion', english: 'den Löwen, dem Löwen, des Löwen' },
        { pronoun: 'der Hase', form: 'rabbit', english: 'den Hasen, dem Hasen, des Hasen' }
      ]
    },
    examples: [
      {
        spanish: 'PEOPLE: Ich sehe den Jungen. (I see the boy.)',
        english: 'ANIMALS: Der Löwe jagt in der Savanne. → Ich fotografiere den Löwen.',
        highlight: ['den Jungen', 'den Löwen']
      },
      {
        spanish: 'PROFESSION: Der Kollege arbeitet hier. → Ich spreche mit dem Kollegen.',
        english: 'CUSTOMER: Der Kunde wartet. → Ich helfe dem Kunden.',
        highlight: ['dem Kollegen', 'dem Kunden']
      }
    ]
  },
  {
    title: 'Weak Nouns with Foreign Endings',
    content: `**Foreign-origin weak nouns** with specific endings add **-en**:`,
    conjugationTable: {
      title: 'Foreign Weak Noun Endings',
      conjugations: [
        { pronoun: '-ant', form: 'der Elefant', english: 'den Elefanten, dem Elefanten, des Elefanten' },
        { pronoun: '-ent', form: 'der Student', english: 'den Studenten, dem Studenten, des Studenten' },
        { pronoun: '-ist', form: 'der Journalist', english: 'den Journalisten, dem Journalisten, des Journalisten' },
        { pronoun: '-oge', form: 'der Biologe', english: 'den Biologen, dem Biologen, des Biologen' },
        { pronoun: '-at', form: 'der Kandidat', english: 'den Kandidaten, dem Kandidaten, des Kandidaten' },
        { pronoun: '-et', form: 'der Poet', english: 'den Poeten, dem Poeten, des Poeten' }
      ]
    },
    examples: [
      {
        spanish: 'PROFESSIONS: der Architekt → den Architekten, der Präsident → den Präsidenten',
        english: 'ANIMALS: der Elefant → den Elefanten, der Leopard → den Leoparden',
        highlight: ['den Architekten', 'den Elefanten']
      },
      {
        spanish: 'ACADEMIC: der Student studiert → Ich kenne den Studenten.',
        english: 'MEDIA: der Journalist schreibt → Ich lese den Artikel des Journalisten.',
        highlight: ['den Studenten', 'des Journalisten']
      }
    ]
  },
  {
    title: 'Special Weak Nouns',
    content: `**Some weak nouns** have **irregular patterns** or special forms:`,
    conjugationTable: {
      title: 'Special Weak Nouns',
      conjugations: [
        { pronoun: 'der Herr', form: 'gentleman/Mr.', english: 'den Herrn, dem Herrn, des Herrn (-n only)' },
        { pronoun: 'der Mensch', form: 'human being', english: 'den Menschen, dem Menschen, des Menschen' },
        { pronoun: 'der Nachbar', form: 'neighbor', english: 'den Nachbarn, dem Nachbarn, des Nachbarn' },
        { pronoun: 'der Bauer', form: 'farmer', english: 'den Bauern, dem Bauern, des Bauern' },
        { pronoun: 'der Held', form: 'hero', english: 'den Helden, dem Helden, des Helden' }
      ]
    },
    examples: [
      {
        spanish: 'HERR: Guten Tag, Herr Schmidt! → Ich spreche mit Herrn Schmidt.',
        english: 'MENSCH: Der Mensch denkt. → Das Leben des Menschen ist kurz.',
        highlight: ['Herrn Schmidt', 'des Menschen']
      },
      {
        spanish: 'NACHBAR: Mein Nachbar ist nett. → Ich helfe dem Nachbarn.',
        english: 'HELD: Der Held kämpft. → Die Geschichte des Helden ist bekannt.',
        highlight: ['dem Nachbarn', 'des Helden']
      }
    ]
  },
  {
    title: 'Identifying Weak Nouns',
    content: `**How to recognize** weak nouns:`,
    conjugationTable: {
      title: 'Identification Patterns',
      conjugations: [
        { pronoun: 'Ending in -e', form: 'Usually weak', english: 'der Junge, der Kunde, der Löwe' },
        { pronoun: 'Living beings', form: 'Often weak', english: 'der Student, der Elefant, der Mensch' },
        { pronoun: 'Foreign suffixes', form: '-ant, -ent, -ist', english: 'der Präsident, der Journalist' },
        { pronoun: 'Professions', form: 'Many are weak', english: 'der Architekt, der Biologe' },
        { pronoun: 'Animals', form: 'Many are weak', english: 'der Löwe, der Affe, der Hase' }
      ]
    },
    examples: [
      {
        spanish: 'PATTERN RECOGNITION: If masculine + living being + ends in -e → likely weak',
        english: 'FOREIGN WORDS: If masculine + foreign suffix → check if weak',
        highlight: ['masculine + living being', 'foreign suffix']
      },
      {
        spanish: 'SAFE ASSUMPTION: Most masculine nouns referring to people/animals ending in -e are weak',
        english: 'DICTIONARY CHECK: When in doubt, check dictionary for declension pattern',
        highlight: ['people/animals ending in -e']
      }
    ]
  },
  {
    title: 'Weak Nouns in Plural',
    content: `**Plural forms** of weak nouns:`,
    conjugationTable: {
      title: 'Weak Noun Plurals',
      conjugations: [
        { pronoun: 'Nominative', form: 'die + plural', english: 'die Jungen (the boys)' },
        { pronoun: 'Accusative', form: 'die + plural', english: 'die Jungen (the boys - object)' },
        { pronoun: 'Dative', form: 'den + plural + n', english: 'den Jungen (to/for the boys)' },
        { pronoun: 'Genitive', form: 'der + plural', english: 'der Jungen (of the boys)' }
      ]
    },
    examples: [
      {
        spanish: 'PLURAL: die Studenten → die Studenten → den Studenten → der Studenten',
        english: 'DATIVE PLURAL: mit den Studenten (with the students)',
        highlight: ['den Studenten']
      },
      {
        spanish: 'ANIMALS: die Löwen leben in Afrika → Ich sehe die Löwen im Zoo.',
        english: 'PEOPLE: die Kollegen arbeiten → Ich spreche mit den Kollegen.',
        highlight: ['die Löwen', 'den Kollegen']
      }
    ]
  },
  {
    title: 'Weak Nouns with Adjectives',
    content: `**Adjectives** also decline when modifying weak nouns:`,
    examples: [
      {
        spanish: 'NOMINATIVE: der kleine Junge (the little boy)',
        english: 'ACCUSATIVE: Ich sehe den kleinen Jungen. (I see the little boy.)',
        highlight: ['der kleine Junge', 'den kleinen Jungen']
      },
      {
        spanish: 'DATIVE: Ich gebe dem netten Kollegen das Buch. (I give the book to the nice colleague.)',
        english: 'GENITIVE: Das Auto des reichen Kunden ist teuer. (The rich customer\'s car is expensive.)',
        highlight: ['dem netten Kollegen', 'des reichen Kunden']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Missing endings**: Forgetting -n/-en in non-nominative cases
**2. Wrong identification**: Not recognizing weak nouns
**3. Plural confusion**: Wrong plural declension
**4. Adjective agreement**: Incorrect adjective endings with weak nouns`,
    examples: [
      {
        spanish: '❌ Ich sehe den Junge → ✅ Ich sehe den Jungen',
        english: 'Wrong: weak nouns need -n ending in accusative',
        highlight: ['den Jungen']
      },
      {
        spanish: '❌ Das Buch des Student → ✅ Das Buch des Studenten',
        english: 'Wrong: weak nouns need -en ending in genitive',
        highlight: ['des Studenten']
      },
      {
        spanish: '❌ mit den Kollege → ✅ mit den Kollegen',
        english: 'Wrong: weak nouns need -n ending in dative',
        highlight: ['den Kollegen']
      },
      {
        spanish: '❌ der große Student → den große Studenten → ✅ den großen Studenten',
        english: 'Wrong: adjective must also decline with weak noun',
        highlight: ['den großen Studenten']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Noun Declension', url: '/grammar/german/nouns/declension', difficulty: 'intermediate' },
  { title: 'German Cases Overview', url: '/grammar/german/cases/overview', difficulty: 'beginner' },
  { title: 'German Adjective Declension', url: '/grammar/german/adjectives/declension', difficulty: 'advanced' },
  { title: 'German Masculine Nouns', url: '/grammar/german/nouns/masculine', difficulty: 'beginner' }
];

export default function GermanWeakNounsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'german',
              category: 'nouns',
              topic: 'weak-nouns',
              title: 'German Weak Nouns - N-Declension Pattern and Examples',
              description: 'Master German weak nouns (n-declension) including identification patterns and complete declension rules.',
              difficulty: 'intermediate',
              examples: [
                'der Junge → den Jungen → dem Jungen → des Jungen',
                'der Student → den Studenten → dem Studenten → des Studenten',
                'der Herr → den Herrn → dem Herrn → des Herrn',
                'der Löwe → den Löwen → dem Löwen → des Löwen'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'nouns',
              topic: 'weak-nouns',
              title: 'German Weak Nouns - N-Declension Pattern and Examples'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="nouns"
        topic="weak-nouns"
        title="German Weak Nouns - N-Declension Pattern and Examples"
        description="Master German weak nouns (n-declension) including identification patterns and complete declension rules"
        difficulty="intermediate"
        estimatedTime={16}
        sections={sections}
        backUrl="/grammar/german/nouns"
        practiceUrl="/grammar/german/nouns/weak-nouns/practice"
        quizUrl="/grammar/german/nouns/weak-nouns/quiz"
        songUrl="/songs/de?theme=grammar&topic=weak-nouns"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
