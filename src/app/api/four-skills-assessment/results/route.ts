import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { assessmentSkillTrackingService, type ListeningSkillMetrics, type ReadingSkillMetrics, type WritingSkillMetrics, type SpeakingSkillMetrics } from '@/services/assessmentSkillTrackingService';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface AssessmentResults {
  skillResults: SkillResult[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  passed: boolean;
  completedAt: Date;
}

interface SkillResult {
  skill: 'reading' | 'writing' | 'listening' | 'speaking';
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  questionResults: QuestionResult[];
}

interface QuestionResult {
  questionId: string;
  userAnswer: any;
  correctAnswer?: any;
  score: number;
  maxScore: number;
  feedback?: string;
  timeSpent: number;
}

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      language, 
      level, 
      difficulty, 
      examBoard, 
      results, 
      assignmentMode 
    } = await request.json();

    // Validate input
    if (!userId || !language || !level || !difficulty || !results) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save overall assessment results
    const { data: savedResult, error: saveError } = await supabase
      .from('four_skills_assessment_results')
      .insert({
        user_id: userId,
        language,
        level,
        difficulty,
        exam_board: examBoard,
        total_score: results.totalScore,
        max_score: results.maxScore,
        percentage: results.percentage,
        time_spent: results.timeSpent,
        passed: results.passed,
        assignment_mode: assignmentMode || false,
        completed_at: results.completedAt
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving four skills assessment results:', saveError);
      return NextResponse.json(
        { error: 'Failed to save results' },
        { status: 500 }
      );
    }

    // Save individual skill results
    for (const skillResult of results.skillResults) {
      const { error: skillError } = await supabase
        .from('skill_assessment_results')
        .insert({
          assessment_result_id: savedResult.id,
          skill: skillResult.skill,
          score: skillResult.score,
          max_score: skillResult.maxScore,
          percentage: skillResult.percentage,
          time_spent: skillResult.timeSpent,
          question_results: skillResult.questionResults
        });

      if (skillError) {
        console.error('Error saving skill result:', skillError);
      }
    }

    // Track individual skills in assessment_skill_breakdown table
    await trackFourSkillsBreakdown(userId, savedResult.id, language, results);

    // Update user statistics
    await updateUserFourSkillsStats(userId, results);

    // If this is part of an assignment, update assignment progress
    if (assignmentMode) {
      await updateAssignmentProgress(userId, results);
    }

    return NextResponse.json({
      success: true,
      resultId: savedResult.id,
      message: 'Results saved successfully'
    });

  } catch (error) {
    console.error('Error processing four skills assessment results:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function updateUserFourSkillsStats(userId: string, results: AssessmentResults) {
  try {
    // Get current user stats
    const { data: currentStats, error: statsError } = await supabase
      .from('user_four_skills_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (statsError && statsError.code !== 'PGRST116') {
      console.error('Error fetching user four skills stats:', statsError);
      return;
    }

    const now = new Date().toISOString();
    
    if (currentStats) {
      // Update existing stats
      const newStats = {
        total_assessments: currentStats.total_assessments + 1,
        total_score: currentStats.total_score + results.totalScore,
        total_max_score: currentStats.total_max_score + results.maxScore,
        total_time_spent: currentStats.total_time_spent + results.timeSpent,
        assessments_passed: currentStats.assessments_passed + (results.passed ? 1 : 0),
        average_percentage: Math.round(
          ((currentStats.average_percentage * currentStats.total_assessments) + results.percentage) / 
          (currentStats.total_assessments + 1)
        ),
        best_percentage: Math.max(currentStats.best_percentage, results.percentage),
        current_streak: results.passed ? currentStats.current_streak + 1 : 0,
        best_streak: results.passed ? 
          Math.max(currentStats.best_streak, currentStats.current_streak + 1) : 
          currentStats.best_streak,
        updated_at: now
      };

      // Update skill-specific stats
      for (const skillResult of results.skillResults) {
        const skillField = `${skillResult.skill}_score`;
        const skillMaxField = `${skillResult.skill}_max_score`;
        const skillCountField = `${skillResult.skill}_count`;
        
        if (currentStats[skillField] !== undefined) {
          newStats[skillField] = currentStats[skillField] + skillResult.score;
          newStats[skillMaxField] = currentStats[skillMaxField] + skillResult.maxScore;
          newStats[skillCountField] = currentStats[skillCountField] + 1;
        }
      }

      const { error: updateError } = await supabase
        .from('user_four_skills_stats')
        .update(newStats)
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating user four skills stats:', updateError);
      }
    } else {
      // Create new stats record
      const newStats: any = {
        user_id: userId,
        total_assessments: 1,
        total_score: results.totalScore,
        total_max_score: results.maxScore,
        total_time_spent: results.timeSpent,
        assessments_passed: results.passed ? 1 : 0,
        average_percentage: results.percentage,
        best_percentage: results.percentage,
        current_streak: results.passed ? 1 : 0,
        best_streak: results.passed ? 1 : 0,
        reading_score: 0,
        reading_max_score: 0,
        reading_count: 0,
        writing_score: 0,
        writing_max_score: 0,
        writing_count: 0,
        listening_score: 0,
        listening_max_score: 0,
        listening_count: 0,
        speaking_score: 0,
        speaking_max_score: 0,
        speaking_count: 0,
        created_at: now,
        updated_at: now
      };

      // Set skill-specific stats
      for (const skillResult of results.skillResults) {
        newStats[`${skillResult.skill}_score`] = skillResult.score;
        newStats[`${skillResult.skill}_max_score`] = skillResult.maxScore;
        newStats[`${skillResult.skill}_count`] = 1;
      }

      const { error: insertError } = await supabase
        .from('user_four_skills_stats')
        .insert(newStats);

      if (insertError) {
        console.error('Error creating user four skills stats:', insertError);
      }
    }

  } catch (error) {
    console.error('Error in updateUserFourSkillsStats:', error);
  }
}

async function updateAssignmentProgress(userId: string, results: AssessmentResults) {
  try {
    // This would be implemented based on how assignments are structured
    // For now, we'll just log that it would update assignment progress
    console.log('Would update assignment progress for user:', userId, 'with results:', results);
  } catch (error) {
    console.error('Error in updateAssignmentProgress:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const language = searchParams.get('language');
    const level = searchParams.get('level');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('four_skills_assessment_results')
      .select(`
        *,
        skill_assessment_results (*)
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (language) {
      query = query.eq('language', language);
    }

    if (level) {
      query = query.eq('level', level);
    }

    const { data: results, error } = await query;

    if (error) {
      console.error('Error fetching four skills assessment results:', error);
      return NextResponse.json(
        { error: 'Failed to fetch results' },
        { status: 500 }
      );
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('Error in GET four skills assessment results:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Track individual skills breakdown for Four Skills Assessment
async function trackFourSkillsBreakdown(
  userId: string,
  assessmentId: string,
  language: string,
  results: AssessmentResults
) {
  try {
    for (const skillResult of results.skillResults) {
      const totalQuestions = skillResult.questionResults?.length || 1;
      const correctAnswers = skillResult.questionResults?.filter(q => q.correct).length ||
                           Math.round(totalQuestions * (skillResult.percentage / 100));

      switch (skillResult.skill) {
        case 'listening':
          const listeningMetrics: ListeningSkillMetrics = {
            audioComprehensionAccuracy: skillResult.percentage,
            responseTimePerEvidence: skillResult.timeSpent / totalQuestions,
            listeningSkillProgression: skillResult.percentage,
            audioPlaybackCount: 1, // Default - could be enhanced with actual play counts
            comprehensionSpeed: skillResult.timeSpent > 0 ? (totalQuestions / skillResult.timeSpent) * 60 : 0,
            contextualUnderstanding: skillResult.percentage
          };

          await assessmentSkillTrackingService.trackListeningSkills(
            userId,
            assessmentId,
            'four_skills_listening',
            language,
            listeningMetrics,
            totalQuestions,
            correctAnswers,
            skillResult.timeSpent
          );
          break;

        case 'reading':
          const readingMetrics: ReadingSkillMetrics = {
            textComprehensionAccuracy: skillResult.percentage,
            inferenceAbility: skillResult.percentage * 0.9,
            vocabularyInContext: skillResult.percentage * 0.95,
            readingSpeed: skillResult.timeSpent > 0 ? (totalQuestions / skillResult.timeSpent) * 60 : 0,
            detailRetention: skillResult.percentage,
            criticalAnalysis: skillResult.percentage * 0.85
          };

          await assessmentSkillTrackingService.trackReadingSkills(
            userId,
            assessmentId,
            'four_skills_reading',
            language,
            readingMetrics,
            totalQuestions,
            correctAnswers,
            skillResult.timeSpent
          );
          break;

        case 'writing':
          const writingMetrics: WritingSkillMetrics = {
            grammarAccuracy: skillResult.percentage * 0.8,
            vocabularyUsage: skillResult.percentage * 0.9,
            structuralCoherence: skillResult.percentage * 0.85,
            creativityScore: skillResult.percentage * 0.7,
            wordCountAccuracy: 85, // Default
            taskCompletion: skillResult.percentage
          };

          await assessmentSkillTrackingService.trackWritingSkills(
            userId,
            assessmentId,
            'four_skills_writing',
            language,
            writingMetrics,
            totalQuestions,
            correctAnswers,
            skillResult.timeSpent
          );
          break;

        case 'speaking':
          const speakingMetrics: SpeakingSkillMetrics = {
            pronunciationAccuracy: skillResult.percentage * 0.85,
            fluencyScore: skillResult.percentage * 0.9,
            grammarInSpeech: skillResult.percentage * 0.8,
            vocabularyRange: skillResult.percentage * 0.9,
            communicativeEffectiveness: skillResult.percentage,
            confidenceLevel: skillResult.percentage * 0.75
          };

          await assessmentSkillTrackingService.trackSpeakingSkills(
            userId,
            assessmentId,
            'four_skills_speaking',
            language,
            speakingMetrics,
            totalQuestions,
            correctAnswers,
            skillResult.timeSpent
          );
          break;
      }
    }
  } catch (error) {
    console.error('Error tracking four skills breakdown:', error);
  }
}
