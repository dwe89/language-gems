import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface WeakWord {
  id: string;
  word: string;
  translation: string;
  category: string;
  subcategory: string;
  accuracy: number;
  totalAttempts: number;
  correctAttempts: number;
  lastPracticed: string;
  difficultyLevel: string;
  recommendedGames: string[];
  language: string;
  partOfSpeech: string;
  exampleSentence: string;
}

interface StrongWord {
  id: string;
  word: string;
  translation: string;
  category: string;
  subcategory: string;
  accuracy: number;
  totalAttempts: number;
  masteryLevel: number;
  lastPracticed: string;
  language: string;
  partOfSpeech: string;
  exampleSentence: string;
}

interface AIRecommendation {
  type: 'game' | 'practice' | 'review';
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  targetWords: string[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    // Extract filter parameters
    const language = searchParams.get('language'); // Spanish, French, German
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const curriculumLevel = searchParams.get('curriculum_level'); // KS2, KS3, KS4

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // CRITICAL FIX: We need to create a bridge between user_vocabulary_progress (legacy vocabulary IDs)
    // and centralized_vocabulary. For now, we'll use word_performance_logs which has word_text
    // that we can match to centralized_vocabulary

    // Get word performance data with centralized vocabulary
    const { data: wordPerformanceData, error: performanceError } = await supabase
      .from('word_performance_logs')
      .select(`
        word_text,
        translation_text,
        was_correct,
        timestamp,
        session_id,
        enhanced_game_sessions!inner(student_id)
      `)
      .eq('enhanced_game_sessions.student_id', studentId);

    if (performanceError) {
      console.error('Error fetching word performance data:', performanceError);
      return NextResponse.json({ error: 'Failed to fetch vocabulary data' }, { status: 500 });
    }

    // Get ALL centralized vocabulary data for matching (DO NOT apply filters here)
    const { data: centralizedVocabulary, error: vocabError } = await supabase
      .from('centralized_vocabulary')
      .select(`
        id,
        word,
        translation,
        language,
        category,
        subcategory,
        curriculum_level,
        part_of_speech,
        example_sentence
      `);

    if (vocabError) {
      console.error('Error fetching centralized vocabulary:', vocabError);
      return NextResponse.json({ error: 'Failed to fetch vocabulary data' }, { status: 500 });
    }

    if (!wordPerformanceData || wordPerformanceData.length === 0 || !centralizedVocabulary || centralizedVocabulary.length === 0) {
      return NextResponse.json({
        weakWords: [],
        strongWords: [],
        recommendations: [],
        summary: {
          totalWords: 0,
          weakWordsCount: 0,
          strongWordsCount: 0,
          averageAccuracy: 0
        },
        availableFilters: {
          languages: [],
          categories: [],
          subcategories: [],
          curriculumLevels: []
        }
      });
    }

    // Process word performance data to calculate accuracy for each word
    const wordStats = new Map<string, {
      word: string;
      translation: string;
      totalAttempts: number;
      correctAttempts: number;
      lastPracticed: string;
      vocabularyData?: any;
    }>();

    // Group performance data by word
    wordPerformanceData.forEach(log => {
      const wordKey = log.word_text.toLowerCase();
      if (!wordStats.has(wordKey)) {
        wordStats.set(wordKey, {
          word: log.word_text,
          translation: log.translation_text,
          totalAttempts: 0,
          correctAttempts: 0,
          lastPracticed: log.timestamp
        });
      }

      const stats = wordStats.get(wordKey)!;
      stats.totalAttempts++;
      if (log.was_correct) {
        stats.correctAttempts++;
      }
      if (new Date(log.timestamp) > new Date(stats.lastPracticed)) {
        stats.lastPracticed = log.timestamp;
      }
    });

    // Match word performance with centralized vocabulary - ONE ENTRY PER PERFORMANCE WORD
    const matchedWords: Array<{
      word: string;
      translation: string;
      category: string;
      subcategory: string;
      language: string;
      curriculumLevel: string;
      accuracy: number;
      totalAttempts: number;
      correctAttempts: number;
      lastPracticed: string;
      vocabularyId: string;
      partOfSpeech: string;
      exampleSentence: string;
    }> = [];

    // Create entries for performance words - one per unique curriculum/category combination
    wordStats.forEach((stats, performanceWord) => {
      if (stats.totalAttempts >= 3) { // Only include words with at least 3 attempts
        // Find ALL matching vocabulary entries for this performance word
        const matchingVocab = centralizedVocabulary.filter(vocabItem => {
          const vocabWord = vocabItem.word.toLowerCase();
          const perfWord = performanceWord.toLowerCase();

          // Direct match
          if (vocabWord === perfWord) return true;

          // Match without articles (el, la, los, las, un, una)
          const vocabWithoutArticle = vocabWord.replace(/^(el|la|los|las|un|una)\s+/, '');
          const perfWithoutArticle = perfWord.replace(/^(el|la|los|las|un|una)\s+/, '');

          if (vocabWithoutArticle === perfWithoutArticle) return true;
          if (vocabWithoutArticle === perfWord) return true;
          if (vocabWord === perfWithoutArticle) return true;

          return false;
        });

        // Group by curriculum level and pick the best match for each level
        const levelGroups = new Map<string, any>();

        matchingVocab.forEach(vocabItem => {
          const level = vocabItem.curriculum_level || 'unknown';
          const vocabWord = vocabItem.word.toLowerCase();
          const perfWord = performanceWord.toLowerCase();

          let matchScore = 0;
          if (vocabWord === perfWord) matchScore = 100;
          else matchScore = 80; // Article variations

          if (!levelGroups.has(level) || matchScore > levelGroups.get(level).score) {
            levelGroups.set(level, { vocab: vocabItem, score: matchScore });
          }
        });

        // Add one entry per curriculum level for this performance word
        levelGroups.forEach(({ vocab }) => {
          const accuracy = (stats.correctAttempts / stats.totalAttempts) * 100;

          matchedWords.push({
            word: stats.word, // Use the original performance word
            translation: stats.translation,
            category: vocab.category || 'General',
            subcategory: vocab.subcategory || '',
            language: vocab.language,
            curriculumLevel: vocab.curriculum_level || '',
            accuracy: Math.round(accuracy),
            totalAttempts: stats.totalAttempts,
            correctAttempts: stats.correctAttempts,
            lastPracticed: stats.lastPracticed,
            vocabularyId: vocab.id,
            partOfSpeech: vocab.part_of_speech || '',
            exampleSentence: vocab.example_sentence || ''
          });
        });
      }
    });

    // Apply filters to matched words BEFORE calculating weak/strong
    let filteredWords = matchedWords;

    if (language && language.trim() !== '') {
      filteredWords = filteredWords.filter(item => item.language === language);
    }
    if (curriculumLevel && curriculumLevel.trim() !== '') {
      filteredWords = filteredWords.filter(item => item.curriculumLevel === curriculumLevel);
    }
    if (category && category.trim() !== '') {
      filteredWords = filteredWords.filter(item => item.category === category);
    }
    if (subcategory && subcategory.trim() !== '') {
      filteredWords = filteredWords.filter(item => item.subcategory === subcategory);
    }

    // Process weak words (accuracy < 70%) from filtered results - avoid duplicates
    const weakWordsMap = new Map<string, any>();
    filteredWords
      .filter(item => item.accuracy < 70)
      .forEach(item => {
        if (!weakWordsMap.has(item.word)) {
          weakWordsMap.set(item.word, {
            id: item.vocabularyId,
            word: item.word,
            translation: item.translation,
            category: item.category,
            subcategory: item.subcategory,
            accuracy: item.accuracy,
            totalAttempts: item.totalAttempts,
            correctAttempts: item.correctAttempts,
            lastPracticed: item.lastPracticed,
            difficultyLevel: item.curriculumLevel || 'intermediate',
            recommendedGames: getRecommendedGames(item.category, item.accuracy),
            language: item.language,
            partOfSpeech: item.partOfSpeech,
            exampleSentence: item.exampleSentence
          });
        }
      });

    const weakWords: WeakWord[] = Array.from(weakWordsMap.values())
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 20); // Limit to top 20 weak words

    // Process strong words (accuracy >= 80%) from filtered results - avoid duplicates
    const strongWordsMap = new Map<string, any>();
    filteredWords
      .filter(item => item.accuracy >= 80)
      .forEach(item => {
        if (!strongWordsMap.has(item.word)) {
          strongWordsMap.set(item.word, {
            id: item.vocabularyId,
            word: item.word,
            translation: item.translation,
            category: item.category,
            subcategory: item.subcategory,
            accuracy: item.accuracy,
            totalAttempts: item.totalAttempts,
            masteryLevel: item.accuracy >= 95 ? 5 : item.accuracy >= 90 ? 4 : 3,
            lastPracticed: item.lastPracticed,
            language: item.language,
            partOfSpeech: item.partOfSpeech,
            exampleSentence: item.exampleSentence
          });
        }
      });

    const strongWords: StrongWord[] = Array.from(strongWordsMap.values())
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 15); // Limit to top 15 strong words

    // Generate AI recommendations
    const recommendations = generateAIRecommendations(weakWords, strongWords);

    // Calculate summary statistics from filtered results (count unique words only)
    const uniqueWords = new Set(filteredWords.map(item => item.word));
    const totalWords = uniqueWords.size;

    // Calculate average accuracy per unique word (not per entry)
    const wordAccuracies = new Map<string, number>();
    filteredWords.forEach(item => {
      if (!wordAccuracies.has(item.word)) {
        wordAccuracies.set(item.word, item.accuracy);
      }
    });

    const totalAccuracy = Array.from(wordAccuracies.values()).reduce((sum, acc) => sum + acc, 0);

    const summary = {
      totalWords,
      weakWordsCount: weakWords.length,
      strongWordsCount: strongWords.length,
      averageAccuracy: totalWords > 0 ? Math.round(totalAccuracy / totalWords) : 0
    };

    // Get available filter options from centralized vocabulary
    const { data: allVocabulary } = await supabase
      .from('centralized_vocabulary')
      .select('language, category, subcategory, curriculum_level');

    const availableFilters = {
      languages: [...new Set(allVocabulary?.map(v => v.language).filter(Boolean))].sort(),
      categories: [...new Set(allVocabulary?.map(v => v.category).filter(Boolean))].sort(),
      subcategories: [...new Set(allVocabulary?.map(v => v.subcategory).filter(Boolean))].sort(),
      curriculumLevels: [...new Set(allVocabulary?.map(v => v.curriculum_level).filter(Boolean))].sort()
    };

    return NextResponse.json({
      weakWords,
      strongWords,
      recommendations,
      summary,
      availableFilters,
      appliedFilters: {
        language,
        category,
        subcategory,
        curriculumLevel
      }
    });

  } catch (error) {
    console.error('Error in weak-words-analysis API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getRecommendedGames(category: string, accuracy: number): string[] {
  const games = [];
  
  // Base recommendations for all categories
  if (accuracy < 40) {
    games.push('memory-game', 'word-scramble');
  } else if (accuracy < 60) {
    games.push('speed-builder', 'sentence-towers');
  } else {
    games.push('vocab-master', 'word-towers');
  }

  // Category-specific recommendations
  switch (category.toLowerCase()) {
    case 'numbers':
      games.push('number-practice');
      break;
    case 'colors':
      games.push('color-match');
      break;
    case 'family':
      games.push('family-tree');
      break;
    case 'food':
      games.push('restaurant-game');
      break;
    case 'animals':
      games.push('animal-sounds');
      break;
    default:
      games.push('vocabulary-mining');
  }

  return games.slice(0, 3); // Return top 3 recommendations
}

function generateAIRecommendations(weakWords: WeakWord[], strongWords: StrongWord[]): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];

  if (weakWords.length > 0) {
    // High priority: Focus on weakest words
    const weakestWords = weakWords.slice(0, 5);
    recommendations.push({
      type: 'practice',
      title: 'Focus on Your Weakest Words',
      description: `Practice your 5 most challenging words: ${weakestWords.map(w => w.word).join(', ')}`,
      action: '/student-dashboard/vocabulary/practice?focus=weak',
      priority: 'high',
      estimatedTime: '10-15 minutes',
      targetWords: weakestWords.map(w => w.word)
    });

    // Medium priority: Category-specific practice
    const categoryGroups = groupWordsByCategory(weakWords);
    const topCategory = Object.keys(categoryGroups)[0];
    if (topCategory) {
      recommendations.push({
        type: 'game',
        title: `Improve ${topCategory} Vocabulary`,
        description: `You have ${categoryGroups[topCategory].length} weak words in ${topCategory}. Try targeted games!`,
        action: `/student-dashboard/games?category=${topCategory}`,
        priority: 'medium',
        estimatedTime: '15-20 minutes',
        targetWords: categoryGroups[topCategory].map(w => w.word)
      });
    }
  }

  if (strongWords.length > 0) {
    // Low priority: Maintain strong words
    recommendations.push({
      type: 'review',
      title: 'Maintain Your Strong Words',
      description: `Keep practicing your ${strongWords.length} mastered words to maintain proficiency`,
      action: '/student-dashboard/vocabulary/review?focus=strong',
      priority: 'low',
      estimatedTime: '5-10 minutes',
      targetWords: strongWords.slice(0, 10).map(w => w.word)
    });
  }

  return recommendations;
}

function groupWordsByCategory(words: WeakWord[]): Record<string, WeakWord[]> {
  return words.reduce((groups, word) => {
    const category = word.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(word);
    return groups;
  }, {} as Record<string, WeakWord[]>);
}
