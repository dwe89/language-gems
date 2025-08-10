import { createBrowserClient } from '../lib/supabase-client';

export interface AssignmentData {
  id: string;
  title: string;
  vocabulary_criteria?: {
    language: string;
    category: string;
    subcategory?: string;
    wordCount?: number;
  };
  vocabulary_assignment_list_id?: string;
  curriculum_level?: string;
  exam_board?: string;
  tier?: string;
  game_config?: any;
}

export interface StandardVocabularyItem {
  id: string;
  word: string;
  translation: string;
  category: string;
  subcategory: string;
  part_of_speech: string;
  language: string;
  audio_url?: string;
  word_type?: string;
  gender?: string;
  article?: string;
  display_word?: string;
}

export async function loadAssignmentData(assignmentId: string): Promise<{
  assignment: AssignmentData;
  vocabulary: StandardVocabularyItem[];
}> {
  console.log('🔄 [LOADER] Loading assignment data:', { assignmentId });
  
  const supabase = createBrowserClient();

  // Load assignment data
  const { data: assignmentData, error: assignmentError } = await supabase
    .from('assignments')
    .select(`
      id,
      title,
      vocabulary_criteria,
      vocabulary_assignment_list_id,
      curriculum_level,
      exam_board,
      tier,
      game_config
    `)
    .eq('id', assignmentId)
    .single();

  if (assignmentError) {
    console.error('❌ [LOADER] Assignment error:', assignmentError);
    throw new Error(`Failed to load assignment: ${assignmentError.message}`);
  }

  if (!assignmentData) {
    console.error('❌ [LOADER] Assignment not found');
    throw new Error('Assignment not found');
  }

  console.log('✅ [LOADER] Assignment loaded:', assignmentData);

  // Load vocabulary data
  let vocabularyData: StandardVocabularyItem[] = [];

  // Try list-based approach first
  if (assignmentData.vocabulary_assignment_list_id) {
    console.log('🔄 [LOADER] Loading list-based vocabulary');
    
    const { data, error } = await supabase
      .from('vocabulary_assignment_list_items')
      .select(`
        order_position,
        centralized_vocabulary (
          id,
          word,
          translation,
          category,
          subcategory,
          part_of_speech,
          language,
          audio_url,
          word_type,
          gender,
          article,
          display_word
        )
      `)
      .eq('vocabulary_assignment_list_id', assignmentData.vocabulary_assignment_list_id)
      .order('order_position');

    if (!error && data) {
      vocabularyData = data
        .map((item: any) => item.centralized_vocabulary)
        .filter(Boolean);
      console.log('✅ [LOADER] List-based vocabulary loaded:', vocabularyData.length, 'items');
    } else {
      console.warn('⚠️ [LOADER] List-based vocabulary failed:', error);
    }
  }

  // If list-based approach failed or returned no data, try criteria-based approach
  if (vocabularyData.length === 0 && assignmentData.vocabulary_criteria) {
    console.log('🔄 [LOADER] Loading criteria-based vocabulary');
    
    const criteria = assignmentData.vocabulary_criteria;
    let query = supabase
      .from('centralized_vocabulary')
      .select(`
        id,
        word,
        translation,
        category,
        subcategory,
        part_of_speech,
        language,
        audio_url,
        word_type,
        gender,
        article,
        display_word
      `);

    // Apply filters based on criteria
    if (criteria.language) {
      query = query.eq('language', criteria.language);
    }
    if (criteria.category) {
      query = query.eq('category', criteria.category);
    }
    if (criteria.subcategory) {
      query = query.eq('subcategory', criteria.subcategory);
    }

    // Apply word count limit
    if (criteria.wordCount) {
      query = query.limit(criteria.wordCount);
    }

    const { data, error } = await query;

    if (!error && data) {
      vocabularyData = data;
      console.log('✅ [LOADER] Criteria-based vocabulary loaded:', vocabularyData.length, 'items');
    } else {
      console.warn('⚠️ [LOADER] Criteria-based vocabulary failed:', error);
    }
  }

  if (vocabularyData.length === 0) {
    console.error('❌ [LOADER] No vocabulary found');
    throw new Error('No vocabulary found for this assignment');
  }

  console.log('✅ [LOADER] Assignment data loaded successfully:', {
    assignment: assignmentData.title,
    vocabularyCount: vocabularyData.length
  });

  return {
    assignment: assignmentData,
    vocabulary: vocabularyData
  };
}

// Helper function to convert assignment data to game settings
export function createGameSettings(assignment: AssignmentData, vocabulary: StandardVocabularyItem[]) {
  const criteria = assignment.vocabulary_criteria;
  
  return {
    language: criteria?.language || 'spanish',
    category: criteria?.category || 'basics_core_language',
    subcategory: criteria?.subcategory || 'greetings_introductions',
    curriculumLevel: assignment.curriculum_level || 'KS3',
    examBoard: assignment.exam_board,
    tier: assignment.tier,
    difficulty: assignment.game_config?.difficulty || 'medium',
    theme: assignment.game_config?.theme || 'classic',
    timeLimit: assignment.game_config?.timeLimit || 120,
    vocabulary: vocabulary
  };
}
