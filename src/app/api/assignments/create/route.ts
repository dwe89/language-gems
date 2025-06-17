import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '../../../../lib/database.types';

type VocabularySelectionType = 'theme_based' | 'topic_based' | 'custom_list' | 'difficulty_based';

interface CreateAssignmentRequest {
  // Basic assignment info
  title: string;
  description?: string;
  gameType: string;
  classId: string;
  dueDate?: string;
  timeLimit?: number;
  points?: number;
  instructions?: string;
  
  // Vocabulary selection
  vocabularySelection: {
    type: VocabularySelectionType;
    theme?: string;
    topic?: string;
    customListId?: string;
    difficulty?: string;
    wordCount?: number;
  };
  
  // Game configuration
  gameConfig?: Record<string, any>;
}

const createClient = async () => {
  const cookieStore = await cookies();
  
  return createServerClient(
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
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateAssignmentRequest = await request.json();
    
    // Validate required fields
    if (!body.title || !body.gameType || !body.classId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, gameType, classId' },
        { status: 400 }
      );
    }

    // Validate that the class belongs to the teacher
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('id, teacher_id')
      .eq('id', body.classId)
      .eq('teacher_id', user.id)
      .single();

    if (classError || !classData) {
      return NextResponse.json(
        { error: 'Class not found or unauthorized' },
        { status: 403 }
      );
    }

    // Create vocabulary assignment list based on selection criteria
    let vocabularyListId: string | null = null;
    
    if (body.vocabularySelection && body.vocabularySelection.type !== 'custom_list') {
      // Create a new vocabulary assignment list
      const { data: newVocabList, error: vocabListError } = await supabase
        .from('vocabulary_assignment_lists')
        .insert([{
          name: `${body.title} - Vocabulary List`,
          description: `Auto-generated vocabulary list for ${body.title}`,
          teacher_id: user.id,
          theme: body.vocabularySelection.theme || null,
          topic: body.vocabularySelection.topic || null,
          difficulty_level: body.vocabularySelection.difficulty || 'beginner',
          word_count: body.vocabularySelection.wordCount || 20,
          vocabulary_items: [], // Will be populated later
          is_public: false
        }])
        .select()
        .single();

      if (vocabListError) {
        console.error('Vocabulary list creation error:', vocabListError);
        // Continue without vocabulary list if creation fails
      } else {
        vocabularyListId = newVocabList.id;
        
        // Populate vocabulary list based on selection criteria
        if (vocabularyListId) {
          await populateVocabularyList(supabase, vocabularyListId, body.vocabularySelection);
        }
      }
    } else if (body.vocabularySelection?.customListId) {
      vocabularyListId = body.vocabularySelection.customListId;
    }

    // Create the assignment
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .insert({
        title: body.title,
        description: body.description,
        type: body.gameType,
        class_id: body.classId,
        due_date: body.dueDate,
        points: body.points || 10,
        vocabulary_assignment_list_id: vocabularyListId,
        created_by: user.id,
        config: body.gameConfig,
        status: 'active'
      })
      .select()
      .single();

    if (assignmentError) {
      console.error('Assignment creation error:', assignmentError);
      return NextResponse.json(
        { error: 'Failed to create assignment' },
        { status: 500 }
      );
    }

    // Don't create assignment_progress entries here - they will be created when students start the assignment
    // The student_vocabulary_assignment_progress table will track individual vocabulary progress

    return NextResponse.json({
      success: true,
      assignment: {
        id: assignment.id,
        title: assignment.title,
        type: assignment.type,
        status: assignment.status,
        vocabularyListId
      }
    });

  } catch (error) {
    console.error('Assignment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function populateVocabularyList(
  supabase: any,
  listId: string,
  criteria: CreateAssignmentRequest['vocabularySelection']
) {
  try {
    let query = supabase
      .from('vocabulary')
      .select('id, word, translation, difficulty, theme, topic');

    // Apply filters based on selection criteria
    if (criteria.theme) {
      query = query.eq('theme', criteria.theme);
    }
    
    if (criteria.topic) {
      query = query.eq('topic', criteria.topic);
    }
    
    if (criteria.difficulty) {
      query = query.eq('difficulty', criteria.difficulty);
    }

    // Limit the number of words
    const wordCount = criteria.wordCount || 20;
    query = query.limit(wordCount);

    const { data: vocabularyWords, error: vocabularyError } = await query;

    if (vocabularyError) {
      console.error('Vocabulary fetch error:', vocabularyError);
      return;
    }

    if (vocabularyWords && vocabularyWords.length > 0) {
      // Insert vocabulary items into the assignment list
      const vocabularyItems = vocabularyWords.map((word: any, index: number) => ({
        vocabulary_assignment_list_id: listId,
        vocabulary_id: word.id,
        order_index: index
      }));

      const { error: insertError } = await supabase
        .from('vocabulary_assignment_items')
        .insert(vocabularyItems);

      if (insertError) {
        console.error('Vocabulary items insertion error:', insertError);
      }
    }
  } catch (error) {
    console.error('Error populating vocabulary list:', error);
  }
}

 