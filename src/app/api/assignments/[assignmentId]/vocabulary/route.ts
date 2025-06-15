import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '../../../../../lib/database.types';

interface VocabularyItem {
  id: number;
  spanish: string;
  english: string;
  theme: string;
  topic: string;
  part_of_speech: string;
  order_position: number;
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

    // Verify the user has access to this assignment (either as student or teacher)
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select(`
        id,
        title,
        game_type,
        vocabulary_list_id,
        teacher_id,
        class_id,
        time_limit,
        points,
        game_config
      `)
      .eq('id', assignmentId)
      .single();

    if (assignmentError || !assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    // Check if user is the teacher
    const isTeacher = assignment.teacher_id === user.id;
    
    // Check if user is a student in the class
    let isStudent = false;
    if (!isTeacher) {
      const { data: studentClass, error: studentError } = await supabase
        .from('class_students')
        .select('id')
        .eq('class_id', assignment.class_id)
        .eq('student_id', user.id)
        .single();

      isStudent = !studentError && !!studentClass;
    }

    if (!isTeacher && !isStudent) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get the vocabulary list for this assignment
    if (!assignment.vocabulary_list_id) {
      return NextResponse.json({
        assignment: {
          id: assignment.id,
          title: assignment.title,
          gameType: assignment.game_type,
          timeLimit: assignment.time_limit,
          points: assignment.points,
          gameConfig: assignment.game_config
        },
        vocabulary: []
      });
    }

    // Fetch the fixed vocabulary list for this assignment
    const { data: vocabularyItems, error: vocabError } = await supabase
      .from('vocabulary_assignment_items')
      .select(`
        vocabulary_id,
        order_position,
        vocabulary (
          id,
          spanish,
          english,
          theme,
          topic,
          part_of_speech
        )
      `)
      .eq('assignment_list_id', assignment.vocabulary_list_id)
      .order('order_position');

    if (vocabError) {
      console.error('Error fetching vocabulary:', vocabError);
      return NextResponse.json(
        { error: 'Failed to fetch vocabulary' },
        { status: 500 }
      );
    }

    // Format the vocabulary data
    const vocabulary: VocabularyItem[] = vocabularyItems?.map((item: any) => ({
      id: item.vocabulary.id,
      spanish: item.vocabulary.spanish,
      english: item.vocabulary.english,
      theme: item.vocabulary.theme,
      topic: item.vocabulary.topic,
      part_of_speech: item.vocabulary.part_of_speech,
      order_position: item.order_position
    })) || [];

    // If this is a student request, also get/create their progress record
    let studentProgress = null;
    if (isStudent) {
      const { data: progress, error: progressError } = await supabase
        .from('assignment_progress')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('student_id', user.id)
        .single();

      if (progressError && progressError.code !== 'PGRST116') {
        console.error('Error fetching progress:', progressError);
      } else if (!progress) {
        // Create progress record if it doesn't exist
        const { data: newProgress, error: createError } = await supabase
          .from('assignment_progress')
          .insert([{
            assignment_id: assignmentId,
            student_id: user.id,
            status: 'not_started'
          }])
          .select()
          .single();

        if (createError) {
          console.error('Error creating progress:', createError);
        } else {
          studentProgress = newProgress;
        }
      } else {
        studentProgress = progress;
      }
    }

    return NextResponse.json({
      assignment: {
        id: assignment.id,
        title: assignment.title,
        gameType: assignment.game_type,
        timeLimit: assignment.time_limit,
        points: assignment.points,
        gameConfig: assignment.game_config
      },
      vocabulary,
      studentProgress: isStudent ? studentProgress : null
    });

  } catch (error) {
    console.error('Assignment vocabulary fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 