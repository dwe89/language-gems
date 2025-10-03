import { Metadata } from 'next';
import { getGameSchema, getBreadcrumbSchema } from '../../lib/seo/structuredData';
import { GAME_KEYWORDS } from '../../lib/seo/keywords';

interface GameSEOData {
  id: string;
  name: string;
  description: string;
  category: string;
  languages: string[];
  path: string;
  features?: string[];
  educationalLevel?: string;
  targetAudience?: string;
}

// Game SEO data mapping
export const GAME_SEO_DATA: Record<string, GameSEOData> = {
  'vocabulary-mining': {
    id: 'vocabulary-mining',
    name: 'Vocabulary Mining',
    description: 'Master GCSE vocabulary through intelligent spaced repetition and adaptive learning. Mine rare vocabulary gems while building long-term retention with our scientifically-proven memory techniques.',
    category: 'vocabulary',
    languages: ['Spanish', 'French', 'German', 'Italian'],
    path: '/games/vocabulary-mining',
    features: ['Spaced Repetition', 'Adaptive Learning', 'Progress Tracking', 'Audio Pronunciation'],
    educationalLevel: 'GCSE, A-Level',
    targetAudience: 'Secondary school students, GCSE candidates'
  },
  'memory-match': {
    id: 'memory-match',
    name: 'Memory Match',
    description: 'Enhance vocabulary retention with engaging memory card games. Match words with translations, images, or audio to strengthen neural pathways and improve recall speed.',
    category: 'vocabulary',
    languages: ['Spanish', 'French', 'German', 'Italian'],
    path: '/games/memory-match',
    features: ['Visual Memory Training', 'Audio Integration', 'Difficulty Scaling', 'Performance Analytics'],
    educationalLevel: 'KS3, GCSE',
    targetAudience: 'Language learners of all levels'
  },
  'hangman': {
    id: 'hangman',
    name: 'Hangman',
    description: 'Practice spelling and vocabulary recognition with our educational hangman game. Features GCSE-specific vocabulary lists and progressive difficulty levels.',
    category: 'vocabulary',
    languages: ['Spanish', 'French', 'German', 'Italian'],
    path: '/games/hangman',
    features: ['Spelling Practice', 'Vocabulary Recognition', 'Category Selection', 'Hint System'],
    educationalLevel: 'KS3, GCSE',
    targetAudience: 'Students learning vocabulary spelling'
  },
  'conjugation-duel': {
    id: 'conjugation-duel',
    name: 'Conjugation Duel',
    description: 'Master verb conjugations through competitive gameplay. Battle opponents while practicing Spanish, French, and German verb forms with real-time feedback.',
    category: 'grammar',
    languages: ['Spanish', 'French', 'German'],
    path: '/games/conjugation-duel',
    features: ['Verb Conjugation Practice', 'Competitive Gameplay', 'Real-time Feedback', 'Progress Tracking'],
    educationalLevel: 'GCSE, A-Level',
    targetAudience: 'Students struggling with verb conjugations'
  },
  'detective-listening': {
    id: 'detective-listening',
    name: 'Detective Listening',
    description: 'Develop listening comprehension skills through immersive detective scenarios. Solve cases while improving audio comprehension and vocabulary recognition.',
    category: 'listening',
    languages: ['Spanish', 'French', 'German'],
    path: '/games/detective-listening',
    features: ['Audio Comprehension', 'Story-based Learning', 'Context Clues', 'Vocabulary in Context'],
    educationalLevel: 'GCSE, A-Level',
    targetAudience: 'Students developing listening skills'
  },
  'word-scramble': {
    id: 'word-scramble',
    name: 'Word Scramble',
    description: 'Unscramble vocabulary words to reinforce spelling and recognition. Features themed categories and adaptive difficulty for optimal learning progression.',
    category: 'vocabulary',
    languages: ['Spanish', 'French', 'German', 'Italian'],
    path: '/games/word-scramble',
    features: ['Spelling Reinforcement', 'Pattern Recognition', 'Themed Categories', 'Time Challenges'],
    educationalLevel: 'KS3, GCSE',
    targetAudience: 'Students improving spelling and recognition'
  },
  'gem-collector': {
    id: 'gem-collector',
    name: 'Gem Collector',
    description: 'Collect gems while learning vocabulary through engaging gameplay and spaced repetition techniques.',
    category: 'vocabulary',
    languages: ['Spanish', 'French', 'German', 'Italian'],
    path: '/games/gem-collector',
    features: ['Gem Collection', 'Spaced Repetition', 'Progress Tracking', 'Achievement System'],
    educationalLevel: 'KS3, GCSE',
    targetAudience: 'Students who enjoy gamified learning'
  },
  'noughts-and-crosses': {
    id: 'noughts-and-crosses',
    name: 'Noughts and Crosses',
    description: 'Classic tic-tac-toe with a language learning twist. Answer vocabulary questions to claim your squares.',
    category: 'vocabulary',
    languages: ['Spanish', 'French', 'German', 'Italian'],
    path: '/games/noughts-and-crosses',
    features: ['Strategic Gameplay', 'Vocabulary Practice', 'Competitive Elements', 'Quick Sessions'],
    educationalLevel: 'KS3, GCSE',
    targetAudience: 'Students who enjoy strategy games'
  },
  'sentence-builder': {
    id: 'sentence-builder',
    name: 'Sentence Builder',
    description: 'Construct grammatically correct sentences by arranging words and phrases in the right order.',
    category: 'grammar',
    languages: ['Spanish', 'French', 'German'],
    path: '/games/sentence-builder',
    features: ['Grammar Practice', 'Sentence Construction', 'Drag and Drop', 'Immediate Feedback'],
    educationalLevel: 'GCSE, A-Level',
    targetAudience: 'Students learning sentence structure'
  },
  'verb-quest': {
    id: 'verb-quest',
    name: 'Verb Quest',
    description: 'Embark on an RPG adventure to master Spanish verb conjugations through epic battles.',
    category: 'grammar',
    languages: ['Spanish'],
    path: '/games/verb-quest',
    features: ['RPG Adventure', 'Verb Conjugations', 'Character Progression', 'Epic Battles'],
    educationalLevel: 'GCSE, A-Level',
    targetAudience: 'Students learning verb conjugations'
  },
  'vocab-blast': {
    id: 'vocab-blast',
    name: 'Vocab Blast',
    description: 'Fast-paced vocabulary practice with click-to-reveal translations and themed challenges.',
    category: 'vocabulary',
    languages: ['Spanish', 'French', 'German', 'Italian'],
    path: '/games/vocab-blast',
    features: ['Fast-paced Action', 'Translation Practice', 'Themed Challenges', 'High Scores'],
    educationalLevel: 'KS3, GCSE',
    targetAudience: 'Students who enjoy fast-paced games'
  },
  'vocab-master': {
    id: 'vocab-master',
    name: 'Vocab Master',
    description: 'Master vocabulary through comprehensive practice sessions with multiple game modes including flashcards, speed challenges, pronunciation practice, and adaptive learning.',
    category: 'vocabulary',
    languages: ['Spanish', 'French', 'German', 'Italian'],
    path: '/games/vocab-master',
    features: ['Multiple Game Modes', 'Adaptive Difficulty', 'Pronunciation Practice', 'Progress Analytics', 'Flashcards', 'Speed Challenges'],
    educationalLevel: 'KS3, GCSE, A-Level',
    targetAudience: 'Students seeking comprehensive vocabulary practice'
  }
};

// Generate metadata for game pages
export function generateGameMetadata(gameId: string): Metadata {
  const game = GAME_SEO_DATA[gameId];
  if (!game) {
    return {
      title: 'Game Not Found',
      description: 'The requested game could not be found.'
    };
  }

  const keywords = GAME_KEYWORDS[gameId as keyof typeof GAME_KEYWORDS] || [];
  const title = `${game.name} - Interactive ${game.category} Game for GCSE Language Learning`;
  
  return {
    title,
    description: game.description,
    keywords: [
      ...keywords,
      `${game.name.toLowerCase()} game`,
      `GCSE ${game.category}`,
      `interactive ${game.category} game`,
      ...game.languages.map(lang => `${lang.toLowerCase()} ${game.category}`)
    ],
    openGraph: {
      title,
      description: game.description,
      type: 'website',
      images: [
        {
          url: `/images/games/${gameId}-og.jpg`,
          width: 1200,
          height: 630,
          alt: `${game.name} - Language Learning Game`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: game.description,
      images: [`/images/games/${gameId}-og.jpg`],
    },
    alternates: {
      canonical: game.path,
    },
  };
}

// Generate structured data for game pages
export function generateGameStructuredData(gameId: string) {
  const game = GAME_SEO_DATA[gameId];
  if (!game) return null;

  const gameSchema = getGameSchema(game);
  
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Games', url: '/games' },
    { name: game.name, url: game.path }
  ]);

  return {
    game: gameSchema,
    breadcrumb: breadcrumbSchema
  };
}

// Game page content structure for SEO
export interface GamePageContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
  };
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  howItWorks: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  benefits: Array<{
    title: string;
    description: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
}

// Generate SEO-optimized content for game pages
export function generateGamePageContent(gameId: string): GamePageContent | null {
  const game = GAME_SEO_DATA[gameId];
  if (!game) return null;

  return {
    hero: {
      title: `Master ${game.category} with ${game.name}`,
      subtitle: `Interactive ${game.category} game for GCSE language learning`,
      description: game.description,
      cta: `Start Playing ${game.name}`
    },
    features: game.features?.map(feature => ({
      title: feature,
      description: `Advanced ${feature.toLowerCase()} to enhance your learning experience`,
      icon: '🎯'
    })) || [],
    howItWorks: [
      {
        step: 1,
        title: 'Choose Your Language',
        description: `Select from ${game.languages.join(', ')} to start your learning journey`
      },
      {
        step: 2,
        title: 'Play & Learn',
        description: `Engage with interactive ${game.category} exercises designed for GCSE success`
      },
      {
        step: 3,
        title: 'Track Progress',
        description: 'Monitor your improvement with detailed analytics and performance insights'
      }
    ],
    benefits: [
      {
        title: 'GCSE-Aligned Content',
        description: 'All content is specifically designed to support GCSE language learning objectives'
      },
      {
        title: 'Adaptive Learning',
        description: 'The game adapts to your skill level, providing optimal challenge and support'
      },
      {
        title: 'Progress Tracking',
        description: 'Detailed analytics help you identify strengths and areas for improvement'
      }
    ],
    faq: [
      {
        question: `How does ${game.name} help with GCSE preparation?`,
        answer: `${game.name} uses ${game.category}-focused exercises that align with GCSE curriculum requirements, helping students build essential skills through engaging gameplay.`
      },
      {
        question: 'Which languages are supported?',
        answer: `Currently, ${game.name} supports ${game.languages.join(', ')}, with more languages being added regularly.`
      },
      {
        question: 'Is this suitable for classroom use?',
        answer: `Yes, ${game.name} is designed for both individual study and classroom activities, with teacher dashboard features for monitoring student progress.`
      }
    ]
  };
}
