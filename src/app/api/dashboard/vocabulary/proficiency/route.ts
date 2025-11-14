import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/dashboard/vocabulary/proficiency
 *
 * Returns vocabulary analytics using simple Proficiency Level system:
 * 🔴 Struggling: Accuracy < 60% OR total_encounters < 3
 * 🟡 Learning: Accuracy 60-89% AND total_encounters >= 3
 * 🟢 Proficient: Accuracy >= 90% AND total_encounters >= 5
 *
 * This endpoint returns data in the SAME format as the old analytics endpoint
 * but uses proficiency levels instead of FSRS mastery levels.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const searchParams = request.nextUrl.searchParams;
    const teacherId = searchParams.get('teacherId');

    if (!teacherId) {
      return NextResponse.json(
        { error: 'teacherId is required' },
        { status: 400 }
      );
    }

    // Get all proficiency data
    const { data: allWords, error: wordsError } = await supabase
      .from('teacher_vocabulary_proficiency')
      .select('*')
      .order('accuracy', { ascending: true });

    if (wordsError) {
      console.error('Error fetching proficiency data:', wordsError);
      return NextResponse.json(
        { error: 'Failed to fetch proficiency data', details: wordsError.message },
        { status: 500 }
      );
    }

    // Get summary stats using raw SQL
    const { data: summaryData } = await supabase.rpc('exec_sql', {
      query: `
        SELECT
          proficiency_level,
          COUNT(*) as word_count,
          ROUND(AVG(accuracy), 1) as avg_accuracy,
          SUM(total_encounters) as total_encounters
        FROM teacher_vocabulary_proficiency
        GROUP BY proficiency_level
        ORDER BY
          CASE proficiency_level
            WHEN 'struggling' THEN 1
            WHEN 'learning' THEN 2
            WHEN 'proficient' THEN 3
          END
      `
    });

    const summary = summaryData || [];
    const strugglingCount = summary.find((s: any) => s.proficiency_level === 'struggling')?.word_count || 0;
    const learningCount = summary.find((s: any) => s.proficiency_level === 'learning')?.word_count || 0;
    const proficientCount = summary.find((s: any) => s.proficiency_level === 'proficient')?.word_count || 0;

    console.log('📊 [PROFICIENCY API] Summary stats:', {
      strugglingCount,
      learningCount,
      proficientCount,
      totalWords: allWords?.length || 0
    });

    // Transform data to match old analytics format
    const detailedWords = (allWords || []).map((word: any) => ({
      word: word.word,
      translation: word.translation,
      category: word.category,
      subcategory: word.subcategory,
      language: word.language,
      totalEncounters: word.total_encounters,
      correctEncounters: word.correct_encounters,
      accuracy: word.accuracy,
      proficiencyLevel: word.proficiency_level, // NEW: 'struggling', 'learning', 'proficient'
      studentsStruggling: word.students_struggling,
      studentsLearning: word.students_learning,
      studentsProficient: word.students_proficient,
      totalStudents: word.total_students,
      // Legacy fields for backward compatibility (will be removed)
      masteryLevel: 0, // Deprecated
      studentsMastered: word.students_proficient // Map to proficient for now
    }));

    // Return in same format as old analytics endpoint
    const analytics = {
      classStats: {
        totalWords: allWords?.length || 0,
        strugglingWords: strugglingCount,
        learningWords: learningCount,
        proficientWords: proficientCount,
        totalEncounters: summary.reduce((sum: number, s: any) => sum + (s.total_encounters || 0), 0),
        averageAccuracy: allWords?.length > 0
          ? allWords.reduce((sum: number, w: any) => sum + w.accuracy, 0) / allWords.length
          : 0,
        // Legacy fields
        masteredWords: proficientCount,
        averageMastery: 0,
        topPerformingStudents: [],
        strugglingStudents: [],
        totalStudents: 0,
        studentsWithOverdueWords: 0,
        totalWordsReadyForReview: 0
      },
      detailedWords,
      studentProgress: [],
      topicAnalysis: [],
      trends: [],
      insights: {
        classRecommendations: [],
        strugglingStudents: [],
        topPerformers: [],
        studentsNeedingAttention: [],
        weakestTopics: [],
        strongestTopics: []
      }
    };

    return NextResponse.json({ analytics });

  } catch (error) {
    console.error('Error in proficiency API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

