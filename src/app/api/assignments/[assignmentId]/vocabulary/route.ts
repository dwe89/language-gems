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
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            cookieStore.set(name, value, options);
          },
          remove(name, options) {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          },
        },
      }
    );

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assignmentId } = await params;

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
        vocabulary_criteria
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

    // Get students in the class - using manual join since foreign key relationship may not be defined
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('class_enrollments')
      .select('student_id')
      .eq('class_id', assignment.class_id);

    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError);
      return NextResponse.json(
        { error: 'Failed to fetch class enrollments' },
        { status: 500 }
      );
    }

    // Get user profiles for the enrolled students
    const studentIds = enrollments?.map(e => e.student_id) || [];
    const { data: students, error: studentsError } = await supabase
      .from('user_profiles')
      .select('user_id, display_name, email')
      .in('user_id', studentIds);

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
      const student = students?.find((student: any) => student.user_id === user.id);
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
          config: assignment.vocabulary_criteria || {}
        },
        vocabulary: []
      });
    }

    // Fetch the fixed vocabulary list for this assignment - using manual join
    // First get the vocabulary assignment items
    const { data: assignmentItems, error: itemsError } = await supabase
      .from('vocabulary_assignment_items')
      .select('vocabulary_id, order_position')
      .eq('assignment_list_id', assignment.vocabulary_assignment_list_id)
      .order('order_position');

    if (itemsError) {
      console.error('Error fetching assignment items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to fetch assignment vocabulary items' },
        { status: 500 }
      );
    }

    // Then get the vocabulary details for those items
    let vocabularyItems: any[] = [];
    if (assignmentItems && assignmentItems.length > 0) {
      const vocabularyIds = assignmentItems.map(item => item.vocabulary_id);

      const { data: vocabularyData, error: vocabError } = await supabase
        .from('vocabulary')
        .select('id, spanish, english, theme, topic, part_of_speech')
        .in('id', vocabularyIds);

      if (vocabError) {
        console.error('Error fetching vocabulary:', vocabError);
        return NextResponse.json(
          { error: 'Failed to fetch vocabulary details' },
          { status: 500 }
        );
      }

      // Combine the data with order positions
      vocabularyItems = assignmentItems.map(item => {
        const vocab = vocabularyData?.find(v => v.id === item.vocabulary_id);
        return {
          vocabulary_id: item.vocabulary_id,
          order_position: item.order_position,
          vocabulary: vocab
        };
      }).filter(item => item.vocabulary); // Remove items where vocabulary wasn't found
    }

    // Error handling is now done within the vocabulary fetching logic above

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
        config: assignment.vocabulary_criteria || {}
      },
      vocabulary,
      students: students?.map((student: any) => ({
        id: student.user_id,
        displayName: student.display_name
      })) || []
    });

  } catch (error) {
    console.error('Assignment vocabulary fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 