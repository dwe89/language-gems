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
        vocabulary_criteria,
        game_config,
        game_type,
        due_date,
        description
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

    console.log('Assignment API Debug:', {
      assignmentId,
      userId: user.id,
      assignmentCreatedBy: assignment.created_by,
      isTeacher,
      classId: assignment.class_id
    });

    // Get students in the class for both teachers and students
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

    // If teacher, allow access immediately
    if (isTeacher) {
      console.log('Teacher access granted');
    } else {
      // Check if user is a student in the class
      const student = students?.find((student: any) => student.user_id === user.id);
      const isStudent = !!student;

      console.log('Student access check:', {
        userId: user.id,
        studentIds,
        isStudent,
        foundStudent: student
      });

      if (!isStudent) {
        return NextResponse.json(
          { error: 'Access denied - not enrolled in class' },
          { status: 403 }
        );
      }
    }

    // Handle different assignment types
    let vocabularyItems: any[] = [];

    // Check if this is an Enhanced Assignment Creator assignment (has game_config field)
    if (assignment.game_config && typeof assignment.game_config === 'object') {
      const config = assignment.game_config as any;

      // Handle Enhanced Assignment Creator vocabulary configuration
      if (config.vocabularyConfig) {
        const vocabConfig = config.vocabularyConfig;

        // Build query based on vocabulary source
        let query = supabase.from('centralized_vocabulary').select('*');

        // Filter by language if specified
        if (vocabConfig.language) {
          query = query.eq('language', vocabConfig.language);
        }

        if (vocabConfig.source === 'category' && vocabConfig.category) {
          query = query.eq('category', vocabConfig.category);
          if (vocabConfig.subcategory) {
            query = query.eq('subcategory', vocabConfig.subcategory);
          }
        } else if (vocabConfig.source === 'theme' && vocabConfig.theme) {
          query = query.eq('theme_name', vocabConfig.theme);
        } else if (vocabConfig.source === 'topic' && vocabConfig.topic) {
          query = query.eq('topic', vocabConfig.topic);
        }

        // Apply word count limit
        const wordCount = vocabConfig.wordCount || 20;
        query = query.limit(wordCount);

        const { data: vocabularyData, error: vocabError } = await query;

        if (vocabError) {
          console.error('Error fetching centralized vocabulary:', vocabError);
          return NextResponse.json(
            { error: 'Failed to fetch vocabulary' },
            { status: 500 }
          );
        }

        // Format vocabulary for memory game
        vocabularyItems = vocabularyData?.map((vocab: any, index: number) => ({
          id: vocab.id,
          spanish: vocab.word,
          english: vocab.translation,
          theme: vocab.theme_name || vocab.category,
          topic: vocab.subcategory || vocab.topic,
          part_of_speech: vocab.part_of_speech,
          order_position: index + 1
        })) || [];
      }
    } else if (assignment.vocabulary_assignment_list_id) {
      // Handle legacy vocabulary assignment list format
      // (existing code for vocabulary_assignment_list_id)
    }

    // If no vocabulary found yet, return empty
    if (vocabularyItems.length === 0 && !assignment.vocabulary_assignment_list_id) {
      return NextResponse.json({
        assignment: {
          id: assignment.id,
          title: assignment.title,
          type: assignment.type,
          config: assignment.config || assignment.vocabulary_criteria || {}
        },
        vocabulary: []
      });
    }

    // Handle legacy vocabulary assignment list format (only if not already loaded)
    if (assignment.vocabulary_assignment_list_id && vocabularyItems.length === 0) {
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
      // ONLY if vocabulary_id is not null (legacy assignments have vocabulary_id, Enhanced Creator uses vocabulary_criteria)
      if (assignmentItems && assignmentItems.length > 0) {
        const vocabularyIds = assignmentItems
          .map(item => item.vocabulary_id)
          .filter(id => id !== null); // Filter out null IDs

        // Only query if we have valid vocabulary IDs
        if (vocabularyIds.length > 0) {
          const { data: vocabularyData, error: vocabError } = await supabase
            .from('centralized_vocabulary')
            .select('id, word, translation, category, subcategory, part_of_speech, language')
            .in('id', vocabularyIds);

          if (vocabError) {
            console.error('Error fetching vocabulary:', vocabError);
            return NextResponse.json(
              { error: 'Failed to fetch vocabulary details' },
              { status: 500 }
            );
          }

          // Combine the data with order positions
          const legacyVocabItems = assignmentItems.map(item => {
            const vocab = vocabularyData?.find(v => v.id === item.vocabulary_id);
            return {
              vocabulary_id: item.vocabulary_id,
              order_position: item.order_position,
              vocabulary: vocab
            };
          }).filter(item => item.vocabulary); // Remove items where vocabulary wasn't found

          // Format legacy vocabulary for consistency (map centralized_vocabulary fields to legacy format)
          vocabularyItems = legacyVocabItems.map((item: any) => ({
            id: item.vocabulary.id,
            spanish: item.vocabulary.word, // word field in centralized_vocabulary
            english: item.vocabulary.translation, // translation field
            theme: item.vocabulary.category, // category maps to theme
            topic: item.vocabulary.subcategory, // subcategory maps to topic
            part_of_speech: item.vocabulary.part_of_speech,
            order_position: item.order_position
          }));
        }
      }
    }

    // vocabularyItems is already formatted correctly from above logic
    const vocabulary: VocabularyItem[] = vocabularyItems;

    return NextResponse.json({
      assignment: {
        id: assignment.id,
        title: assignment.title,
        type: assignment.type,
        game_type: assignment.game_type,
        config: assignment.config || assignment.vocabulary_criteria || {}
      },
      vocabulary,
      students: (students || []).map((student: any) => ({
        id: student.user_id,
        displayName: student.display_name
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