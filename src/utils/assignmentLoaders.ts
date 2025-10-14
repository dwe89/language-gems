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
      .from('sentences')
      .select('*')
      .eq('is_active', true); // Only load active sentences

    // Apply filters based on criteria
    // Map language codes to full names (sentences table uses source_language)
    if (criteria.language) {
      const languageMap: Record<string, string> = {
        'es': 'spanish',
        'fr': 'french',
        'de': 'german',
        'spanish': 'spanish',
        'french': 'french',
        'german': 'german'
      };
      const sourceLang = languageMap[criteria.language.toLowerCase()] || criteria.language;
      query = query.eq('source_language', sourceLang);
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

    // Limit to reasonable number
    query = query.limit(100);

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

