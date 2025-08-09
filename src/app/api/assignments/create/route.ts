import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '../../../../lib/database.types';

type VocabularySelectionType = 'category_based' | 'subcategory_based' | 'theme_based' | 'topic_based' | 'custom_list' | 'difficulty_based';

interface CreateAssignmentRequest {
  // Basic assignment info
  title: string;
  description?: string;
  gameType: string;
  selectedGames?: string[]; // For multi-game assignments
  classId: string;
  dueDate?: string;
  timeLimit?: number;
  points?: number;
  instructions?: string;
  curriculumLevel?: string;

  // Vocabulary selection
  vocabularySelection: {
    type: VocabularySelectionType;
    language?: string;
    category?: string;
    subcategory?: string;
    theme?: string;
    topic?: string;
    customListId?: string;
    difficulty?: string;
    wordCount?: number;
    // KS4-specific parameters
    examBoard?: string;
    tier?: string;
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

    // Create the assignment with new structure
    console.log('Attempting to create assignment with data:', {
      title: body.title,
      game_type: body.gameType,
      teacher_id: user.id
    });

    const assignmentConfig = {
      selectedGames: body.selectedGames || [body.gameType],
      vocabularyConfig: {
        source: body.vocabularySelection.type,
        category: body.vocabularySelection.category,
        subcategory: body.vocabularySelection.subcategory,
        theme: body.vocabularySelection.theme,
        topic: body.vocabularySelection.topic,
        customListId: body.vocabularySelection.customListId,
        wordCount: body.vocabularySelection.wordCount || 20,
        difficulty: body.vocabularySelection.difficulty
      },
      gameConfig: gameConfig,
      multiGame: body.selectedGames && body.selectedGames.length > 1
    };

    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .insert({
        title: body.title,
        description: body.description,
        type: body.gameType, // Use 'type' not 'game_type'
        game_type: body.gameType, // Also set game_type for compatibility
        class_id: body.classId,
        due_date: body.dueDate,
        points: body.points || 10,
        vocabulary_assignment_list_id: vocabularyListId, // Keep for legacy compatibility
        vocabulary_selection_type: body.vocabularySelection.type, // Set the correct vocabulary selection type
        vocabulary_count: body.vocabularySelection.wordCount || 10,
        curriculum_level: body.curriculumLevel || 'KS3',
        exam_board: body.vocabularySelection.examBoard,
        tier: body.vocabularySelection.tier,
        created_by: user.id, // Use 'created_by' not 'teacher_id'
        status: 'active',
        game_config: assignmentConfig, // Store full config in game_config field
        vocabulary_criteria: body.vocabularySelection // Store vocabulary selection criteria
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
      assignmentId: assignment.id,
      assignment: {
        id: assignment.id,
        title: assignment.title,
        type: assignment.type,
        game_type: assignment.game_type,
        status: assignment.status,
        vocabularyListId,
        config: assignmentConfig
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
    // Use the vocabulary table (integer IDs) instead of centralized_vocabulary (UUID IDs)
    // Use centralized_vocabulary table with modern schema
    let query = supabase
      .from('centralized_vocabulary')
      .select('id, word, translation, category, subcategory, part_of_speech, language');

    // Apply language filter first (most important)
    if (criteria.language) {
      query = query.eq('language', criteria.language);
    }

    // Apply KS4-specific filters first
    if (criteria.examBoard) {
      query = query.eq('exam_board_code', criteria.examBoard);
    }
    if (criteria.tier) {
      query = query.eq('tier', criteria.tier);
    }

    // Apply filters based on criteria type using centralized_vocabulary schema
    switch (criteria.type) {
      case 'category_based':
        if (criteria.category) {
          query = query.eq('category', criteria.category);
        }
        break;
      case 'subcategory_based':
        if (criteria.category) {
          query = query.eq('category', criteria.category);
        }
        if (criteria.subcategory) {
          query = query.eq('subcategory', criteria.subcategory);
        }
        break;
      case 'theme_based':
        if (criteria.theme) {
          query = query.eq('category', criteria.theme);
        }
        break;
      case 'topic_based':
        if (criteria.topic) {
          query = query.eq('subcategory', criteria.topic);
        }
        break;
      default:
        // No specific filters, get general vocabulary
        break;
    }

    console.log('Vocabulary query criteria:', {
      type: criteria.type,
      category: criteria.category,
      subcategory: criteria.subcategory,
      theme: criteria.theme,
      topic: criteria.topic,
      language: criteria.language,
      mappedQuery: 'Using centralized_vocabulary table with category/subcategory'
    });

    // Execute the query to get all matching vocabulary
    let { data: allVocabulary, error: vocabularyError } = await query;

    console.log('Query executed, vocabulary error:', vocabularyError);
    console.log('Found vocabulary items:', allVocabulary?.length || 0);

    if (vocabularyError) {
      console.error('Vocabulary fetch error:', vocabularyError);
      
      // If the specific query fails, try a more general approach
      console.log('Attempting fallback vocabulary query...');
      const { data: fallbackVocabulary, error: fallbackError } = await supabase
        .from('centralized_vocabulary')
        .select('id, word, translation, category, subcategory, part_of_speech, language')
        .eq('language', criteria.language || 'es') // At least filter by language
        .not('word', 'is', null)
        .not('translation', 'is', null)
        .limit(Math.max(criteria.wordCount || 10, 20)); // Get at least the requested amount

      if (fallbackError) {
        console.error('Fallback vocabulary query also failed:', fallbackError);
        return;
      }

      allVocabulary = fallbackVocabulary;
      console.log('Using fallback vocabulary, count:', allVocabulary?.length || 0);
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
        centralized_vocabulary_id: word.id,
        order_position: index + 1, // Start from 1, not 0
        is_required: true,
        created_at: new Date().toISOString()
      }));

      console.log('Inserting vocabulary items:', vocabularyItems.length, 'items');
      const { data: insertedItems, error: insertError } = await supabase
        .from('vocabulary_assignment_items')
        .insert(vocabularyItems)
        .select();

      if (insertError) {
        console.error('Vocabulary items insertion error:', insertError);
        throw new Error(`Failed to insert vocabulary items: ${insertError.message}`);
      } else {
        console.log('Successfully inserted vocabulary items:', insertedItems?.length || 0);
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

    if (body.vocabularySelection &&
        body.vocabularySelection.type !== 'custom_list' &&
        ['category_based', 'subcategory_based', 'theme_based', 'topic_based'].includes(body.vocabularySelection.type)) {
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

 