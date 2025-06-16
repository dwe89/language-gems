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

    // Get assignment and verify teacher ownership
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select(`
        id,
        title,
        type,
        class_id,
        vocabulary_assignment_list_id,
        created_by,
        config
      `)
      .eq('id', assignmentId)
      .single();

    if (assignmentError || !assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    const isTeacher = assignment.created_by === user.id;

    // Get students in the class
    const { data: students, error: studentsError } = await supabase
      .from('class_enrollments')
      .select(`
        student_id,
        user_profiles!inner(
          id,
          display_name
        )
      `)
      .eq('class_id', assignment.class_id);

    if (studentsError) {
      console.error('Error fetching students:', studentsError);
      return NextResponse.json(
        { error: 'Failed to fetch students' },
        { status: 500 }
      );
    }

    // Check if user is a student in the class
    let isStudent = false;
    if (!isTeacher) {
      const student = students.find((student: any) => student.student_id === user.id);
      isStudent = !!student;
    }

    if (!isTeacher && !isStudent) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get the vocabulary list for this assignment
    if (!assignment.vocabulary_assignment_list_id) {
      return NextResponse.json({
        assignment: {
          id: assignment.id,
          title: assignment.title,
          type: assignment.type,
          config: assignment.config
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
      .eq('assignment_list_id', assignment.vocabulary_assignment_list_id)
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

    return NextResponse.json({
      assignment: {
        id: assignment.id,
        title: assignment.title,
        type: assignment.type,
        config: assignment.config
      },
      vocabulary,
      students: students.map((student: any) => ({
        id: student.student_id,
        displayName: student.user_profiles.display_name
      }))
    });

  } catch (error) {
    console.error('Assignment vocabulary fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 