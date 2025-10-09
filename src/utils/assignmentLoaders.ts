import { createBrowserClient } from '../lib/supabase-client';

/**
 * Load sentences for sentence-based assignments
 */
export async function loadSentencesForAssignment(assignment: any): Promise<any[]> {
  const supabase = createBrowserClient();
  const criteria = assignment.vocabulary_criteria || {};

  console.log('📝 Loading sentences with criteria:', criteria);

  try {
    let query = supabase
      .from('centralized_sentences')
      .select('*');

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

    if (criteria.curriculum_level) {
      query = query.eq('curriculum_level', criteria.curriculum_level);
    }

    // KS4-specific filters
    if (criteria.exam_board) {
      query = query.eq('exam_board', criteria.exam_board);
    }

    if (criteria.tier) {
      query = query.eq('tier', criteria.tier);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error loading sentences:', error);
      throw error;
    }

    console.log(`✅ Loaded ${data?.length || 0} sentences`);
    return data || [];
  } catch (error) {
    console.error('❌ Failed to load sentences:', error);
    return [];
  }
}

