import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'nouns',
  topic: 'gender-rules',
  title: 'German Noun Gender Rules - Masculine, Feminine, Neuter Patterns',
  description: 'Master German noun gender rules including patterns for masculine, feminine, and neuter nouns with endings and exceptions.',
  difficulty: 'beginner',
  keywords: [
    'german noun gender',
    'der die das german',
    'german gender rules',
    'masculine feminine neuter german',
    'german noun endings',
    'german gender patterns'
  ],
  examples: [
    'der Mann (masculine) - male person',
    'die Frau (feminine) - female person',
    'das Kind (neuter) - child',
    'die Nation (feminine) - -tion ending'
  ]
});

const sections = [
  {
    title: 'Understanding German Noun Gender',
    content: `German nouns have **three genders**: **masculine** (der), **feminine** (die), and **neuter** (das). Unlike English, German gender is **grammatical**, not biological, meaning even inanimate objects have gender. Learning gender patterns is **essential** for correct German.

**The three genders:**
- **Masculine (der)**: About 45% of German nouns
- **Feminine (die)**: About 35% of German nouns  
- **Neuter (das)**: About 20% of German nouns

**Why gender matters:**
- **Article agreement**: der/die/das must match the noun
- **Adjective endings**: Adjectives change based on gender
- **Pronoun reference**: er/sie/es depends on noun gender
- **Case declension**: Articles change differently by gender

**Learning strategies:**
- **Pattern recognition**: Many endings indicate specific genders
- **Semantic groups**: Certain categories tend toward one gender
- **Memorization**: Always learn nouns with their articles
- **Practice**: Regular exposure builds intuition

**Key principle**: German gender is **largely predictable** through patterns, though there are always exceptions. Learning the main rules covers about **80%** of German nouns.

Understanding gender patterns is **fundamental** for **German fluency** and **grammatical accuracy**.`,
    examples: [
      {
        spanish: 'MASCULINE: der Mann, der Tisch, der Montag',
        english: 'FEMININE: die Frau, die Lampe, die Nation',
        highlight: ['der Mann, der Tisch', 'die Frau, die Lampe']
      },
      {
        spanish: 'NEUTER: das Kind, das Haus, das Mädchen',
        english: 'PATTERN: -tion is always feminine (die Nation, die Station)',
        highlight: ['das Kind, das Haus', 'die Nation, die Station']
      }
    ]
  },
  {
    title: 'Masculine Gender Patterns (der)',
    content: `**Masculine nouns** often follow predictable patterns:`,
    conjugationTable: {
      title: 'Masculine Gender Rules',
      conjugations: [
        { pronoun: 'Male persons', form: 'der Mann, der Vater', english: 'Male people and animals' },
        { pronoun: 'Days/months', form: 'der Montag, der Januar', english: 'Days of week, months, seasons' },
        { pronoun: 'Weather', form: 'der Regen, der Schnee', english: 'Weather phenomena' },
        { pronoun: 'Directions', form: 'der Norden, der Süden', english: 'Cardinal directions' },
        { pronoun: 'Car brands', form: 'der BMW, der Mercedes', english: 'Car manufacturers' },
        { pronoun: 'Alcoholic drinks', form: 'der Wein, der Whisky', english: 'Alcoholic beverages (except das Bier)' }
      ]
    },
    examples: [
      {
        spanish: 'PEOPLE: der Lehrer, der Student, der Arzt',
        english: 'TIME: der Dienstag, der März, der Winter',
        highlight: ['der Lehrer, der Student', 'der Dienstag, der März']
      },
      {
        spanish: 'WEATHER: der Wind, der Sturm, der Nebel',
        english: 'BRANDS: der Volkswagen, der Audi, der Porsche',
        highlight: ['der Wind, der Sturm', 'der Volkswagen, der Audi']
      }
    ]
  },
  {
    title: 'Masculine Endings',
    content: `**Masculine noun endings** that indicate der:`,
    conjugationTable: {
      title: 'Masculine Endings',
      conjugations: [
        { pronoun: '-er (agent)', form: 'der Lehrer, der Arbeiter', english: 'Person who does something' },
        { pronoun: '-ling', form: 'der Frühling, der Schmetterling', english: 'Various meanings' },
        { pronoun: '-ig', form: 'der König, der Honig', english: 'Various meanings' },
        { pronoun: '-ismus', form: 'der Kapitalismus, der Tourismus', english: 'Ideologies, systems' },
        { pronoun: '-ant', form: 'der Elefant, der Diamant', english: 'Often borrowed words' },
        { pronoun: '-ent', form: 'der Student, der Präsident', english: 'Often borrowed words' }
      ]
    },
    examples: [
      {
        spanish: 'AGENTS: der Fahrer (driver), der Bäcker (baker)',
        english: 'SYSTEMS: der Sozialismus, der Realismus',
        highlight: ['der Fahrer, der Bäcker', 'der Sozialismus, der Realismus']
      }
    ]
  },
  {
    title: 'Feminine Gender Patterns (die)',
    content: `**Feminine nouns** have very clear patterns:`,
    conjugationTable: {
      title: 'Feminine Gender Rules',
      conjugations: [
        { pronoun: 'Female persons', form: 'die Frau, die Mutter', english: 'Female people and animals' },
        { pronoun: 'Numbers', form: 'die Eins, die Zwei', english: 'Numbers as nouns' },
        { pronoun: 'Many flowers', form: 'die Rose, die Tulpe', english: 'Most flower names' },
        { pronoun: 'Many fruits', form: 'die Banane, die Orange', english: 'Many fruit names' },
        { pronoun: 'Many trees', form: 'die Eiche, die Birke', english: 'Many tree names' },
        { pronoun: 'Ships/planes', form: 'die Titanic, die Boeing', english: 'Vehicles (ships, planes)' }
      ]
    },
    examples: [
      {
        spanish: 'PEOPLE: die Lehrerin, die Studentin, die Ärztin',
        english: 'NATURE: die Rose, die Banane, die Eiche',
        highlight: ['die Lehrerin, die Studentin', 'die Rose, die Banane']
      }
    ]
  },
  {
    title: 'Feminine Endings',
    content: `**Feminine endings** are very reliable indicators:`,
    conjugationTable: {
      title: 'Feminine Endings (Very Reliable)',
      conjugations: [
        { pronoun: '-tion', form: 'die Nation, die Station', english: '100% feminine - no exceptions' },
        { pronoun: '-heit', form: 'die Gesundheit, die Wahrheit', english: '100% feminine - abstract concepts' },
        { pronoun: '-keit', form: 'die Möglichkeit, die Schwierigkeit', english: '100% feminine - abstract concepts' },
        { pronoun: '-ung', form: 'die Zeitung, die Wohnung', english: '100% feminine - actions/results' },
        { pronoun: '-schaft', form: 'die Freundschaft, die Gesellschaft', english: '100% feminine - relationships' },
        { pronoun: '-in (female)', form: 'die Lehrerin, die Ärztin', english: '100% feminine - female persons' }
      ]
    },
    examples: [
      {
        spanish: 'ABSTRACTS: die Freiheit (freedom), die Einsamkeit (loneliness)',
        english: 'ACTIONS: die Bildung (education), die Hoffnung (hope)',
        highlight: ['die Freiheit, die Einsamkeit', 'die Bildung, die Hoffnung']
      }
    ]
  },
  {
    title: 'Neuter Gender Patterns (das)',
    content: `**Neuter nouns** have distinctive patterns:`,
    conjugationTable: {
      title: 'Neuter Gender Rules',
      conjugations: [
        { pronoun: 'Young beings', form: 'das Kind, das Baby', english: 'Young people and animals' },
        { pronoun: 'Metals', form: 'das Gold, das Silber', english: 'Most metals' },
        { pronoun: 'Colors', form: 'das Rot, das Blau', english: 'Colors as nouns' },
        { pronoun: 'Languages', form: 'das Deutsch, das Englisch', english: 'Languages as nouns' },
        { pronoun: 'Hotels/cafes', form: 'das Hilton, das Café', english: 'Hotels, restaurants, cafes' },
        { pronoun: 'Continents', form: 'das Europa, das Afrika', english: 'Continents (when used with article)' }
      ]
    },
    examples: [
      {
        spanish: 'YOUNG: das Mädchen (girl), das Kätzchen (kitten)',
        english: 'MATERIALS: das Eisen (iron), das Kupfer (copper)',
        highlight: ['das Mädchen, das Kätzchen', 'das Eisen, das Kupfer']
      }
    ]
  },
  {
    title: 'Neuter Endings',
    content: `**Neuter endings** that indicate das:`,
    conjugationTable: {
      title: 'Neuter Endings',
      conjugations: [
        { pronoun: '-chen', form: 'das Mädchen, das Kätzchen', english: 'Diminutives - always neuter' },
        { pronoun: '-lein', form: 'das Fräulein, das Büchlein', english: 'Diminutives - always neuter' },
        { pronoun: '-ment', form: 'das Dokument, das Instrument', english: 'Often borrowed words' },
        { pronoun: '-um', form: 'das Museum, das Zentrum', english: 'Often Latin borrowings' },
        { pronoun: '-tum', form: 'das Eigentum, das Wachstum', english: 'Abstract concepts' },
        { pronoun: 'Ge- + -e', form: 'das Gebäude, das Gebirge', english: 'Collective nouns' }
      ]
    },
    examples: [
      {
        spanish: 'DIMINUTIVES: das Häuschen (little house), das Tischlein (little table)',
        english: 'COLLECTIVES: das Gepäck (luggage), das Gemüse (vegetables)',
        highlight: ['das Häuschen, das Tischlein', 'das Gepäck, das Gemüse']
      }
    ]
  },
  {
    title: 'Compound Noun Gender',
    content: `**Compound nouns** take the gender of the **last element**:`,
    examples: [
      {
        spanish: 'der Tisch + die Lampe = die Tischlampe (table lamp)',
        english: 'das Haus + die Tür = die Haustür (front door)',
        highlight: ['die Tischlampe', 'die Haustür']
      },
      {
        spanish: 'die Arbeit + der Platz = der Arbeitsplatz (workplace)',
        english: 'das Auto + der Schlüssel = der Autoschlüssel (car key)',
        highlight: ['der Arbeitsplatz', 'der Autoschlüssel']
      }
    ],
    subsections: [
      {
        title: 'Rule',
        content: 'The final element always determines the gender:',
        examples: [
          {
            spanish: 'PATTERN: [any word] + [final word] = [gender of final word]',
            english: 'This rule has no exceptions in German',
            highlight: ['gender of final word']
          }
        ]
      }
    ]
  },
  {
    title: 'Tricky Cases and Exceptions',
    content: `**Some nouns** don't follow the expected patterns:`,
    conjugationTable: {
      title: 'Common Exceptions',
      conjugations: [
        { pronoun: 'das Mädchen', form: 'neuter', english: 'Girl - neuter because of -chen ending' },
        { pronoun: 'das Fräulein', form: 'neuter', english: 'Young lady - neuter because of -lein' },
        { pronoun: 'der Käse', form: 'masculine', english: 'Cheese - ends in -e but masculine' },
        { pronoun: 'das Bier', form: 'neuter', english: 'Beer - alcoholic drink but neuter' },
        { pronoun: 'die Person', form: 'feminine', english: 'Person - always feminine, even for males' },
        { pronoun: 'das Weib', form: 'neuter', english: 'Woman - archaic/derogatory, neuter' }
      ]
    },
    examples: [
      {
        spanish: 'DIMINUTIVE RULE: das Mädchen (girl is neuter because of -chen)',
        english: 'PERSON RULE: die Person ist nett (the person is nice - always feminine)',
        highlight: ['das Mädchen', 'die Person']
      }
    ]
  },
  {
    title: 'Gender Learning Strategies',
    content: `**Effective methods** for learning German gender:`,
    conjugationTable: {
      title: 'Learning Strategies',
      conjugations: [
        { pronoun: 'Color coding', form: 'Blue=der, Red=die, Green=das', english: 'Visual memory aids' },
        { pronoun: 'Article memorization', form: 'Always learn: der Tisch', english: 'Never learn just: Tisch' },
        { pronoun: 'Pattern practice', form: 'Group by endings', english: 'All -tion words together' },
        { pronoun: 'Sentence context', form: 'Use in sentences', english: 'Der Tisch ist groß.' },
        { pronoun: 'Flashcards', form: 'Article + noun', english: 'Test yourself regularly' }
      ]
    },
    examples: [
      {
        spanish: 'GOOD: der Tisch, die Lampe, das Buch (with articles)',
        english: 'BAD: Tisch, Lampe, Buch (without articles)',
        highlight: ['der Tisch, die Lampe, das Buch']
      }
    ]
  },
  {
    title: 'Common Mistakes with Gender',
    content: `Here are frequent errors students make:

**1. Forgetting articles**: Learning nouns without gender
**2. English interference**: Assuming logical gender
**3. Overgeneralizing**: Applying rules too broadly
**4. Ignoring exceptions**: Not memorizing irregular cases`,
    examples: [
      {
        spanish: '❌ Mädchen ist schön → ✅ Das Mädchen ist schön',
        english: 'Wrong: must include article to show gender',
        highlight: ['Das Mädchen ist schön']
      },
      {
        spanish: '❌ die Sonne ist masculine → ✅ die Sonne ist feminine',
        english: 'Wrong: don\'t assume gender based on English logic',
        highlight: ['die Sonne ist feminine']
      },
      {
        spanish: '❌ der Käse (thinking -e = feminine) → ✅ der Käse (exception)',
        english: 'Wrong: -e ending usually feminine, but Käse is masculine',
        highlight: ['der Käse']
      },
      {
        spanish: '❌ das Person → ✅ die Person',
        english: 'Wrong: Person is always feminine, even for males',
        highlight: ['die Person']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Articles', url: '/grammar/german/nouns/articles', difficulty: 'beginner' },
  { title: 'German Plural Formation', url: '/grammar/german/nouns/plural-formation', difficulty: 'beginner' },
  { title: 'German Compound Nouns', url: '/grammar/german/nouns/compound-nouns', difficulty: 'intermediate' },
  { title: 'German Adjective Endings', url: '/grammar/german/adjectives/endings', difficulty: 'intermediate' }
];

export default function GermanGenderRulesPage() {
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
              topic: 'gender-rules',
              title: 'German Noun Gender Rules - Masculine, Feminine, Neuter Patterns',
              description: 'Master German noun gender rules including patterns for masculine, feminine, and neuter nouns with endings and exceptions.',
              difficulty: 'beginner',
              examples: [
                'der Mann (masculine) - male person',
                'die Frau (feminine) - female person',
                'das Kind (neuter) - child',
                'die Nation (feminine) - -tion ending'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'nouns',
              topic: 'gender-rules',
              title: 'German Noun Gender Rules - Masculine, Feminine, Neuter Patterns'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="nouns"
        topic="gender-rules"
        title="German Noun Gender Rules - Masculine, Feminine, Neuter Patterns"
        description="Master German noun gender rules including patterns for masculine, feminine, and neuter nouns with endings and exceptions"
        difficulty="beginner"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/german/nouns"
        practiceUrl="/grammar/german/nouns/gender-rules/practice"
        quizUrl="/grammar/german/nouns/gender-rules/quiz"
        songUrl="/songs/de?theme=grammar&topic=gender-rules"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
