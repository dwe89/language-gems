import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '../../../../../lib/database.types';

interface StudentProgress {
  student_id: string;
  student_name: string;
  status: string;
  score: number;
  accuracy: number;
  attempts: number;
  time_spent: number;
  started_at: string | null;
  completed_at: string | null;
  vocabulary_mastery: Array<{
    vocabulary_id: number;
    spanish: string;
    english: string;
    mastery_level: number;
    attempts: number;
    correct_attempts: number;
  }>;
}

interface AssignmentAnalytics {
  assignment: {
    id: string;
    title: string;
    game_type: string;
    created_at: string;
    due_date: string | null;
    total_vocabulary: number;
  };
  overall_stats: {
    total_students: number;
    completed: number;
    in_progress: number;
    not_started: number;
    average_score: number;
    average_accuracy: number;
    average_time_spent: number;
  };
  student_progress: StudentProgress[];
  vocabulary_performance: Array<{
    vocabulary_id: number;
    spanish: string;
    english: string;
    theme: string;
    topic: string;
    total_attempts: number;
    correct_attempts: number;
    accuracy_rate: number;
    students_attempted: number;
    average_mastery: number;
  }>;
  class_info: {
    class_id: string;
    class_name: string;
    student_count: number;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const supabase = createServerClient<Database>({ cookies });
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assignmentId = params.assignmentId;

    // Get assignment and verify teacher ownership
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select(`
        id,
        title,
        game_type,
        created_at,
        due_date,
        teacher_id,
        class_id,
        vocabulary_list_id
      `)
      .eq('id', assignmentId)
      .eq('teacher_id', user.id)
      .single();

    if (assignmentError || !assignment) {
      return NextResponse.json(
        { error: 'Assignment not found or unauthorized' },
        { status: 404 }
      );
    }

    // Get class information
    const { data: classInfo, error: classError } = await supabase
      .from('classes')
      .select('id, name')
      .eq('id', assignment.class_id)
      .single();

    if (classError) {
      console.error('Error fetching class info:', classError);
    }

    // Get students in the class
    const { data: classStudents, error: studentsError } = await supabase
      .from('class_students')
      .select(`
        student_id,
        profiles (
          first_name,
          last_name
        )
      `)
      .eq('class_id', assignment.class_id);

    if (studentsError) {
      console.error('Error fetching students:', studentsError);
    }

    // Get assignment progress for all students
    const { data: progressData, error: progressError } = await supabase
      .from('assignment_progress')
      .select('*')
      .eq('assignment_id', assignmentId);

    if (progressError) {
      console.error('Error fetching progress:', progressError);
    }

    // Get vocabulary count for this assignment
    let vocabularyCount = 0;
    if (assignment.vocabulary_list_id) {
      const { data: vocabCount, error: vocabCountError } = await supabase
        .from('vocabulary_assignment_items')
        .select('id')
        .eq('assignment_list_id', assignment.vocabulary_list_id);

      if (!vocabCountError && vocabCount) {
        vocabularyCount = vocabCount.length;
      }
    }

    // Get vocabulary-level progress for analytics
    const { data: vocabularyProgress, error: vocabProgressError } = await supabase
      .from('student_vocabulary_assignment_progress')
      .select(`
        vocabulary_id,
        student_id,
        attempts,
        correct_attempts,
        mastery_level,
        vocabulary (
          spanish,
          english,
          theme,
          topic
        )
      `)
      .eq('assignment_id', assignmentId);

    if (vocabProgressError) {
      console.error('Error fetching vocabulary progress:', vocabProgressError);
    }

    // Process data into analytics format
    const studentProgressMap = new Map();
    const vocabularyStatsMap = new Map();

    // Initialize student progress data
    if (classStudents) {
      classStudents.forEach(student => {
        const progress = progressData?.find(p => p.student_id === student.student_id);
        const studentName = student.profiles ? 
          `${student.profiles.first_name} ${student.profiles.last_name}` : 
          'Unknown Student';

        studentProgressMap.set(student.student_id, {
          student_id: student.student_id,
          student_name: studentName,
          status: progress?.status || 'not_started',
          score: progress?.score || 0,
          accuracy: progress?.accuracy || 0,
          attempts: progress?.attempts || 0,
          time_spent: progress?.time_spent || 0,
          started_at: progress?.started_at || null,
          completed_at: progress?.completed_at || null,
          vocabulary_mastery: []
        });
      });
    }

    // Process vocabulary progress
    if (vocabularyProgress) {
      vocabularyProgress.forEach((vocabProgress: any) => {
        const vocabId = vocabProgress.vocabulary_id;
        const studentId = vocabProgress.student_id;

        // Add to student's vocabulary mastery
        const studentProgress = studentProgressMap.get(studentId);
        if (studentProgress) {
          studentProgress.vocabulary_mastery.push({
            vocabulary_id: vocabId,
            spanish: vocabProgress.vocabulary.spanish,
            english: vocabProgress.vocabulary.english,
            mastery_level: vocabProgress.mastery_level,
            attempts: vocabProgress.attempts,
            correct_attempts: vocabProgress.correct_attempts
          });
        }

        // Aggregate vocabulary statistics
        if (!vocabularyStatsMap.has(vocabId)) {
          vocabularyStatsMap.set(vocabId, {
            vocabulary_id: vocabId,
            spanish: vocabProgress.vocabulary.spanish,
            english: vocabProgress.vocabulary.english,
            theme: vocabProgress.vocabulary.theme,
            topic: vocabProgress.vocabulary.topic,
            total_attempts: 0,
            correct_attempts: 0,
            students_attempted: new Set(),
            mastery_levels: []
          });
        }

        const vocabStats = vocabularyStatsMap.get(vocabId);
        vocabStats.total_attempts += vocabProgress.attempts;
        vocabStats.correct_attempts += vocabProgress.correct_attempts;
        vocabStats.students_attempted.add(studentId);
        vocabStats.mastery_levels.push(vocabProgress.mastery_level);
      });
    }

    // Calculate overall statistics
    const studentProgresses = Array.from(studentProgressMap.values());
    const completedCount = studentProgresses.filter(p => p.status === 'completed').length;
    const inProgressCount = studentProgresses.filter(p => p.status === 'in_progress' || p.status === 'started').length;
    const notStartedCount = studentProgresses.filter(p => p.status === 'not_started').length;

    const averageScore = studentProgresses.length > 0 ?
      studentProgresses.reduce((sum, p) => sum + p.score, 0) / studentProgresses.length : 0;
    
    const averageAccuracy = studentProgresses.length > 0 ?
      studentProgresses.reduce((sum, p) => sum + p.accuracy, 0) / studentProgresses.length : 0;
    
    const averageTimeSpent = studentProgresses.length > 0 ?
      studentProgresses.reduce((sum, p) => sum + p.time_spent, 0) / studentProgresses.length : 0;

    // Process vocabulary performance
    const vocabularyPerformance = Array.from(vocabularyStatsMap.values()).map(stats => ({
      vocabulary_id: stats.vocabulary_id,
      spanish: stats.spanish,
      english: stats.english,
      theme: stats.theme,
      topic: stats.topic,
      total_attempts: stats.total_attempts,
      correct_attempts: stats.correct_attempts,
      accuracy_rate: stats.total_attempts > 0 ? (stats.correct_attempts / stats.total_attempts) * 100 : 0,
      students_attempted: stats.students_attempted.size,
      average_mastery: stats.mastery_levels.length > 0 ?
        stats.mastery_levels.reduce((sum: number, level: number) => sum + level, 0) / stats.mastery_levels.length : 0
    }));

    const analytics: AssignmentAnalytics = {
      assignment: {
        id: assignment.id,
        title: assignment.title,
        game_type: assignment.game_type,
        created_at: assignment.created_at,
        due_date: assignment.due_date,
        total_vocabulary: vocabularyCount
      },
      overall_stats: {
        total_students: studentProgresses.length,
        completed: completedCount,
        in_progress: inProgressCount,
        not_started: notStartedCount,
        average_score: Math.round(averageScore * 100) / 100,
        average_accuracy: Math.round(averageAccuracy * 100) / 100,
        average_time_spent: Math.round(averageTimeSpent)
      },
      student_progress: studentProgresses,
      vocabulary_performance: vocabularyPerformance,
      class_info: {
        class_id: assignment.class_id,
        class_name: classInfo?.name || 'Unknown Class',
        student_count: studentProgresses.length
      }
    };

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Assignment analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 