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

    // Prepare game configuration based on game type
    let gameConfig = body.gameConfig || {};

    let vocabularyListId = null;

    // Handle sentence-based games (like Speed Builder) differently
    if (body.gameType === 'speed-builder') {
      console.log('Creating Speed Builder assignment - using sentence-based approach');
      
      // For Speed Builder, we don't create a vocabulary list
      // Instead, the game config will specify the sentence selection criteria
      gameConfig = {
        ...gameConfig,
        mode: 'assignment',
        language: 'spanish',
        difficulty: body.vocabularySelection?.difficulty || 'beginner',
        theme: body.vocabularySelection?.theme,
        topic: body.vocabularySelection?.topic,
        tier: 'Foundation', // Default to Foundation tier
        sentenceCount: Math.min(body.vocabularySelection?.wordCount || 15, 20), // Limit sentences
        timeLimit: body.timeLimit || 600, // 10 minutes default
        allowRetries: true,
        showProgress: true
      };

      console.log('Speed Builder game config:', gameConfig);
      
    } else {
      // Handle vocabulary-based games (existing logic)
      console.log('Creating vocabulary-based assignment');
      
      vocabularyListId = await createVocabularyList(supabase, user.id, body);
      if (!vocabularyListId) {
        return NextResponse.json(
          { error: 'Failed to create vocabulary list' },
          { status: 500 }
        );
      }
    }

    // Create the assignment - temporarily without game_config to test schema issue
    console.log('Attempting to create assignment with data:', {
      title: body.title,
      game_type: body.gameType,
      teacher_id: user.id
    });
    
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .insert({
        title: body.title,
        description: body.description,
        type: body.gameType, // Use 'type' not 'game_type'
        class_id: body.classId,
        due_date: body.dueDate,
        points: body.points || 10,
        vocabulary_assignment_list_id: vocabularyListId, // This column exists!
        created_by: user.id, // Use 'created_by' not 'teacher_id'
        status: 'active',
        // Store game config in vocabulary_criteria for now since game_config doesn't exist
        vocabulary_criteria: gameConfig
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
        type: assignment.game_type,
        status: assignment.status,
        vocabularyListId,
        gameConfig
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
      .select('id, spanish, english, theme, topic, part_of_speech');

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

    // First get all matching vocabulary to enable random selection
    const { data: allVocabulary, error: vocabularyError } = await query;

    if (vocabularyError) {
      console.error('Vocabulary fetch error:', vocabularyError);
      return;
    }

    if (allVocabulary && allVocabulary.length > 0) {
      // Limit the number of words with random selection
      const wordCount = Math.min(criteria.wordCount || 10, allVocabulary.length);
      
      // Randomly shuffle and select the specified number of words
      const shuffled = [...allVocabulary].sort(() => 0.5 - Math.random());
      const selectedWords = shuffled.slice(0, wordCount);
      
      console.log(`Selected ${selectedWords.length} vocabulary items from ${allVocabulary.length} available for theme: ${criteria.theme}, topic: ${criteria.topic}`);

      // Insert vocabulary items into the assignment list
      const vocabularyItems = selectedWords.map((word: any, index: number) => ({
        assignment_list_id: listId,
        vocabulary_id: word.id,
        order_position: index
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

async function createVocabularyList(
  supabase: any,
  teacherId: string,
  body: CreateAssignmentRequest
) {
  try {
    let vocabularyListId: string | null = null;

    if (body.vocabularySelection && body.vocabularySelection.type !== 'custom_list') {
      // Create a new vocabulary assignment list
      const { data: newVocabList, error: vocabListError } = await supabase
        .from('vocabulary_assignment_lists')
        .insert([{
          name: `${body.title} - Vocabulary List`,
          description: `Auto-generated vocabulary list for ${body.title}`,
          teacher_id: teacherId,
          theme: body.vocabularySelection.theme || null,
          topic: body.vocabularySelection.topic || null,
          difficulty_level: body.vocabularySelection.difficulty || 'beginner',
          word_count: Math.min(
            body.vocabularySelection.wordCount || 10,
            // Enforce 10-item limit for theme/topic based selections
            (body.vocabularySelection.type === 'theme_based' || body.vocabularySelection.type === 'topic_based') ? 10 : 50
          ),
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

    return vocabularyListId;
  } catch (error) {
    console.error('Error creating vocabulary list:', error);
    return null;
  }
}

 