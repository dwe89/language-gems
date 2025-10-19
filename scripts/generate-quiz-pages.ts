import fs from 'fs';
import path from 'path';

interface QuizPageConfig {
  language: string;
  category: string;
  topic: string;
  topicTitle: string;
}

const SPANISH_TOPICS: QuizPageConfig[] = [
  // Adjectives
  { language: 'spanish', category: 'adjectives', topic: 'agreement', topicTitle: 'Adjective Agreement' },
  { language: 'spanish', category: 'adjectives', topic: 'comparison', topicTitle: 'Comparison' },
  { language: 'spanish', category: 'adjectives', topic: 'demonstrative', topicTitle: 'Demonstrative Adjectives' },
  { language: 'spanish', category: 'adjectives', topic: 'possessive', topicTitle: 'Possessive Adjectives' },
  
  // Adverbs
  { language: 'spanish', category: 'adverbs', topic: 'formation', topicTitle: 'Adverb Formation' },
  { language: 'spanish', category: 'adverbs', topic: 'placement', topicTitle: 'Adverb Placement' },
  
  // Articles
  { language: 'spanish', category: 'articles', topic: 'definite', topicTitle: 'Definite Articles' },
  { language: 'spanish', category: 'articles', topic: 'indefinite', topicTitle: 'Indefinite Articles' },
  
  // Nouns
  { language: 'spanish', category: 'nouns', topic: 'gender', topicTitle: 'Noun Gender' },
  { language: 'spanish', category: 'nouns', topic: 'plurals', topicTitle: 'Noun Plurals' },
  
  // Prepositions
  { language: 'spanish', category: 'prepositions', topic: 'common', topicTitle: 'Common Prepositions' },
  
  // Pronouns
  { language: 'spanish', category: 'pronouns', topic: 'subject', topicTitle: 'Subject Pronouns' },
  { language: 'spanish', category: 'pronouns', topic: 'object', topicTitle: 'Object Pronouns' },
  { language: 'spanish', category: 'pronouns', topic: 'reflexive', topicTitle: 'Reflexive Pronouns' },
  
  // Verbs
  { language: 'spanish', category: 'verbs', topic: 'present-tense', topicTitle: 'Present Tense' },
  { language: 'spanish', category: 'verbs', topic: 'preterite-tense', topicTitle: 'Preterite Tense' },
  { language: 'spanish', category: 'verbs', topic: 'imperfect-tense', topicTitle: 'Imperfect Tense' },
  { language: 'spanish', category: 'verbs', topic: 'future-tense', topicTitle: 'Future Tense' },
  { language: 'spanish', category: 'verbs', topic: 'conditional', topicTitle: 'Conditional' },
  { language: 'spanish', category: 'verbs', topic: 'ser-vs-estar', topicTitle: 'Ser vs Estar' },
];

const FRENCH_TOPICS: QuizPageConfig[] = [
  // Adjectives
  { language: 'french', category: 'adjectives', topic: 'agreement-rules', topicTitle: 'Adjective Agreement' },
  { language: 'french', category: 'adjectives', topic: 'placement', topicTitle: 'Adjective Placement' },
  { language: 'french', category: 'adjectives', topic: 'comparison', topicTitle: 'Comparison' },
  
  // Adverbs
  { language: 'french', category: 'adverbs', topic: 'formation', topicTitle: 'Adverb Formation' },
  
  // Articles
  { language: 'french', category: 'nouns', topic: 'articles', topicTitle: 'Articles' },
  { language: 'french', category: 'nouns', topic: 'gender', topicTitle: 'Noun Gender' },
  
  // Pronouns
  { language: 'french', category: 'pronouns', topic: 'subject', topicTitle: 'Subject Pronouns' },
  { language: 'french', category: 'pronouns', topic: 'object', topicTitle: 'Object Pronouns' },
  
  // Verbs
  { language: 'french', category: 'verbs', topic: 'present-tense', topicTitle: 'Present Tense' },
  { language: 'french', category: 'verbs', topic: 'passe-compose', topicTitle: 'Passé Composé' },
  { language: 'french', category: 'verbs', topic: 'imparfait', topicTitle: 'Imparfait' },
  { language: 'french', category: 'verbs', topic: 'future-tense', topicTitle: 'Future Tense' },
];

const GERMAN_TOPICS: QuizPageConfig[] = [
  // Adjectives
  { language: 'german', category: 'adjectives', topic: 'endings', topicTitle: 'Adjective Endings' },
  { language: 'german', category: 'adjectives', topic: 'comparison', topicTitle: 'Comparison' },
  
  // Cases
  { language: 'german', category: 'cases', topic: 'nominative', topicTitle: 'Nominative Case' },
  { language: 'german', category: 'cases', topic: 'accusative', topicTitle: 'Accusative Case' },
  { language: 'german', category: 'cases', topic: 'dative', topicTitle: 'Dative Case' },
  { language: 'german', category: 'cases', topic: 'genitive', topicTitle: 'Genitive Case' },
  
  // Nouns
  { language: 'german', category: 'nouns', topic: 'gender', topicTitle: 'Noun Gender' },
  { language: 'german', category: 'nouns', topic: 'plurals', topicTitle: 'Noun Plurals' },
  
  // Pronouns
  { language: 'german', category: 'pronouns', topic: 'personal', topicTitle: 'Personal Pronouns' },
  
  // Verbs
  { language: 'german', category: 'verbs', topic: 'present-tense', topicTitle: 'Present Tense' },
  { language: 'german', category: 'verbs', topic: 'past-tense', topicTitle: 'Past Tense' },
  { language: 'german', category: 'verbs', topic: 'future-tense', topicTitle: 'Future Tense' },
];

function generateQuizPageContent(config: QuizPageConfig): string {
  return `'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function ${config.language.charAt(0).toUpperCase() + config.language.slice(1)}${config.category.charAt(0).toUpperCase() + config.category.slice(1).replace(/-/g, '')}${config.topic.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}QuizPage() {
  return (
    <GrammarQuizPage
      language="${config.language}"
      category="${config.category}"
      topic="${config.topic}"
      topicTitle="${config.topicTitle}"
      backUrl="/grammar/${config.language}/${config.category}/${config.topic}"
    />
  );
}
`;
}

function createQuizPage(config: QuizPageConfig): void {
  const dir = path.join(
    process.cwd(),
    'src/app/grammar',
    config.language,
    config.category,
    config.topic,
    'quiz'
  );

  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, 'page.tsx');
  const content = generateQuizPageContent(config);

  fs.writeFileSync(filePath, content);
  console.log(`✓ Created: ${filePath}`);
}

function main(): void {
  console.log('Generating quiz pages...\n');

  const allTopics = [...SPANISH_TOPICS, ...FRENCH_TOPICS, ...GERMAN_TOPICS];

  allTopics.forEach(config => {
    try {
      createQuizPage(config);
    } catch (error) {
      console.error(`✗ Error creating quiz page for ${config.language}/${config.category}/${config.topic}:`, error);
    }
  });

  console.log(`\n✓ Generated ${allTopics.length} quiz pages`);
}

main();

