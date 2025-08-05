import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

// Helper function to get available filters
async function getAvailableFilters(studentId: string) {
  // Get unique languages and curriculum levels from student's performance data
  const { data: performanceFilters } = await supabase
    .from('word_performance_logs')
    .select(`
      language,
      curriculum_level,
      enhanced_game_sessions!inner(student_id)
    `)
    .eq('enhanced_game_sessions.student_id', studentId);

  const languages = [...new Set(performanceFilters?.map(p => p.language).filter(Boolean))];
  const curriculumLevels = [...new Set(performanceFilters?.map(p => p.curriculum_level).filter(Boolean))];

  // Get categories and subcategories from vocabulary
  const { data: vocabFilters } = await supabase
    .from('centralized_vocabulary')
    .select('category, subcategory')
    .in('language', languages)
    .in('curriculum_level', curriculumLevels);

  const categories = [...new Set(vocabFilters?.map(v => v.category).filter(Boolean))];
  const subcategories = [...new Set(vocabFilters?.map(v => v.subcategory).filter(Boolean))];

  return {
    languages,
    categories,
    subcategories,
    curriculumLevels
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const language = searchParams.get('language') || '';
    const curriculumLevel = searchParams.get('curriculumLevel') || '';
    const category = searchParams.get('category') || '';
    const subcategory = searchParams.get('subcategory') || '';

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // STEP 1: Get performance data with filters applied directly
    let performanceQuery = supabase
      .from('word_performance_logs')
      .select(`
        word_text,
        translation_text,
        was_correct,
        timestamp,
        language,
        curriculum_level,
        enhanced_game_sessions!inner(student_id)
      `)
      .eq('enhanced_game_sessions.student_id', studentId);

    // Apply filters to performance data
    if (language && language.trim() !== '') {
      performanceQuery = performanceQuery.eq('language', language);
    }
    if (curriculumLevel && curriculumLevel.trim() !== '') {
      performanceQuery = performanceQuery.eq('curriculum_level', curriculumLevel);
    }

    const { data: performanceData, error: performanceError } = await performanceQuery;

    if (performanceError) {
      console.error('Error fetching performance data:', performanceError);
      return NextResponse.json({ error: 'Failed to fetch performance data' }, { status: 500 });
    }

    // Get available filters
    const availableFilters = await getAvailableFilters(studentId);

    if (!performanceData || performanceData.length === 0) {
      return NextResponse.json({
        summary: { totalWords: 0, weakWordsCount: 0, strongWordsCount: 0, averageAccuracy: 0 },
        weakWords: [],
        strongWords: [],
        availableFilters
      });
    }

    // STEP 2: Aggregate performance data by word
    const wordStats = new Map<string, {
      word: string;
      translation: string;
      totalAttempts: number;
      correctAttempts: number;
      lastPracticed: string;
      language: string;
      curriculumLevel: string;
    }>();

    performanceData.forEach(log => {
      const wordKey = log.word_text.toLowerCase();
      if (!wordStats.has(wordKey)) {
        wordStats.set(wordKey, {
          word: log.word_text,
          translation: log.translation_text,
          totalAttempts: 0,
          correctAttempts: 0,
          lastPracticed: log.timestamp,
          language: log.language,
          curriculumLevel: log.curriculum_level
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

    // Include all words with at least 1 attempt (no arbitrary filtering)
    const qualifiedWords = Array.from(wordStats.values()).filter(word => word.totalAttempts >= 1);

    // STEP 3: Get vocabulary metadata for matched words
    let vocabularyQuery = supabase
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

    // Apply same filters to vocabulary
    if (language && language.trim() !== '') {
      vocabularyQuery = vocabularyQuery.eq('language', language);
    }
    if (curriculumLevel && curriculumLevel.trim() !== '') {
      vocabularyQuery = vocabularyQuery.eq('curriculum_level', curriculumLevel);
    }
    if (category && category.trim() !== '') {
      vocabularyQuery = vocabularyQuery.eq('category', category);
    }
    if (subcategory && subcategory.trim() !== '') {
      vocabularyQuery = vocabularyQuery.eq('subcategory', subcategory);
    }

    const { data: vocabularyData, error: vocabError } = await vocabularyQuery;

    if (vocabError) {
      console.error('Error fetching vocabulary data:', vocabError);
      return NextResponse.json({ error: 'Failed to fetch vocabulary data' }, { status: 500 });
    }

    // If no vocabulary found with curriculum level filter, try without curriculum level constraint
    let fallbackVocabularyData = vocabularyData;
    if ((!vocabularyData || vocabularyData.length === 0) && curriculumLevel && curriculumLevel.trim() !== '') {
      console.log(`No vocabulary found for curriculum level ${curriculumLevel}, trying fallback...`);
      
      let fallbackQuery = supabase
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

      // Apply filters except curriculum_level
      if (language && language.trim() !== '') {
        fallbackQuery = fallbackQuery.eq('language', language);
      }
      if (category && category.trim() !== '') {
        fallbackQuery = fallbackQuery.eq('category', category);
      }
      if (subcategory && subcategory.trim() !== '') {
        fallbackQuery = fallbackQuery.eq('subcategory', subcategory);
      }

      const { data: fallbackData, error: fallbackError } = await fallbackQuery;
      
      if (!fallbackError && fallbackData && fallbackData.length > 0) {
        fallbackVocabularyData = fallbackData;
        console.log(`Found ${fallbackData.length} vocabulary items with fallback query`);
      }
    }

    // STEP 4: Match words to vocabulary and create final results
    const matchedWords = qualifiedWords.map(wordStat => {
      const accuracy = (wordStat.correctAttempts / wordStat.totalAttempts) * 100;
      
      // Find matching vocabulary entry - try exact curriculum level first, then any level
      let vocabMatch = fallbackVocabularyData?.find(vocab => {
        const vocabWord = vocab.word.toLowerCase();
        const perfWord = wordStat.word.toLowerCase();
        
        // Direct match or article variations
        return vocabWord === perfWord ||
               vocabWord.replace(/^(el|la|los|las|un|una)\s+/, '') === perfWord ||
               vocabWord === perfWord.replace(/^(el|la|los|las|un|una)\s+/, '');
      });

      return {
        word: wordStat.word,
        translation: wordStat.translation,
        accuracy: Math.round(accuracy),
        totalAttempts: wordStat.totalAttempts,
        correctAttempts: wordStat.correctAttempts,
        lastPracticed: wordStat.lastPracticed,
        language: wordStat.language,
        curriculumLevel: wordStat.curriculumLevel,
        category: vocabMatch?.category || 'General',
        subcategory: vocabMatch?.subcategory || '',
        vocabularyId: vocabMatch?.id || '',
        partOfSpeech: vocabMatch?.part_of_speech || '',
        exampleSentence: vocabMatch?.example_sentence || ''
      };
    });

    // STEP 5: Separate into weak and strong words
    const weakWords: WeakWord[] = matchedWords
      .filter(word => word.accuracy < 70)
      .map(word => ({
        id: word.vocabularyId,
        word: word.word,
        translation: word.translation,
        category: word.category,
        subcategory: word.subcategory,
        accuracy: word.accuracy,
        totalAttempts: word.totalAttempts,
        correctAttempts: word.correctAttempts,
        lastPracticed: word.lastPracticed,
        difficultyLevel: word.curriculumLevel,
        recommendedGames: ['Speed Builder', 'Word Scramble'],
        language: word.language,
        partOfSpeech: word.partOfSpeech,
        exampleSentence: word.exampleSentence
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 20);

    const strongWords: StrongWord[] = matchedWords
      .filter(word => word.accuracy >= 80)
      .map(word => ({
        id: word.vocabularyId,
        word: word.word,
        translation: word.translation,
        category: word.category,
        subcategory: word.subcategory,
        accuracy: word.accuracy,
        totalAttempts: word.totalAttempts,
        masteryLevel: word.accuracy >= 95 ? 5 : word.accuracy >= 90 ? 4 : 3,
        lastPracticed: word.lastPracticed,
        language: word.language,
        partOfSpeech: word.partOfSpeech,
        exampleSentence: word.exampleSentence
      }))
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 15);

    // STEP 6: Calculate summary
    const totalWords = matchedWords.length;
    const totalAccuracy = matchedWords.reduce((sum, word) => sum + word.accuracy, 0);
    const averageAccuracy = totalWords > 0 ? Math.round(totalAccuracy / totalWords) : 0;

    return NextResponse.json({
      summary: {
        totalWords,
        weakWordsCount: weakWords.length,
        strongWordsCount: strongWords.length,
        averageAccuracy
      },
      weakWords,
      strongWords,
      availableFilters
    });

  } catch (error) {
    console.error('Error in weak words analysis:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
