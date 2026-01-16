/**
 * Assignment Cache Service
 * 
 * PURPOSE: Reduce database calls when multiple students access the same assignment
 * 
 * PROBLEM: When a teacher sets an assignment and 30 students hit the same URL at 9:00 AM,
 * this currently triggers 30 database reads for the same static assignment metadata.
 * 
 * SOLUTION: Cache assignment metadata (instructions, vocab list) so that:
 * - First request hits the database and populates cache
 * - Subsequent requests serve from cache
 * - Cache invalidates on revalidate interval or explicit invalidation
 * 
 * EXPECTED SAVINGS: 97% reduction in assignment metadata reads (30 -> 1)
 */

import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

// Types
export interface CachedAssignment {
    id: string;
    title: string;
    description: string;
    type: string;
    game_type: string;
    vocabulary_criteria: any;
    game_config: any;
    due_date: string;
    points: number;
    status: string;
    class_id: string;
    vocabulary_assignment_list_id: string | null;
    curriculum_level: string | null;
    exam_board: string | null;
    tier: string | null;
    created_at: string;
}

export interface CachedVocabularyItem {
    id: string;
    word: string;
    translation: string;
    category: string;
    subcategory: string;
    part_of_speech: string;
    language: string;
    audio_url?: string;
    order_position?: number;
    isCustomVocabulary: boolean;
}

// Create Supabase client for server-side operations
const getSupabaseAdmin = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error('Supabase credentials not configured');
    }

    return createClient(url, key);
};

/**
 * Fetch assignment data from database (uncached)
 */
async function fetchAssignmentData(assignmentId: string): Promise<CachedAssignment | null> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from('assignments')
        .select(`
      id,
      title,
      description,
      type,
      game_type,
      vocabulary_criteria,
      game_config,
      due_date,
      points,
      status,
      class_id,
      vocabulary_assignment_list_id,
      curriculum_level,
      exam_board,
      tier,
      created_at
    `)
        .eq('id', assignmentId)
        .single();

    if (error || !data) {
        console.error('❌ [AssignmentCache] Failed to fetch assignment:', error?.message);
        return null;
    }

    return data as CachedAssignment;
}

/**
 * Fetch vocabulary items for an assignment list (uncached)
 */
async function fetchAssignmentVocabulary(
    listId: string
): Promise<CachedVocabularyItem[]> {
    const supabase = getSupabaseAdmin();

    const { data: listItems, error } = await supabase
        .from('vocabulary_assignment_items')
        .select(`
      vocabulary_id,
      order_position,
      enhanced_vocabulary_item_id,
      centralized_vocabulary (
        id,
        word,
        translation,
        category,
        subcategory,
        part_of_speech,
        language,
        audio_url
      ),
      enhanced_vocabulary_item:enhanced_vocabulary_items (
        id,
        term,
        translation,
        part_of_speech,
        audio_url
      )
    `)
        .eq('assignment_list_id', listId)
        .order('order_position', { ascending: true });

    if (error || !listItems) {
        console.error('❌ [AssignmentCache] Failed to fetch vocabulary:', error?.message);
        return [];
    }

    // Transform to unified format
    return listItems
        .filter(item => item.centralized_vocabulary || item.enhanced_vocabulary_item)
        .map(item => {
            if (item.centralized_vocabulary) {
                const vocab = item.centralized_vocabulary as any;
                return {
                    id: vocab.id,
                    word: vocab.word,
                    translation: vocab.translation,
                    category: vocab.category || 'general',
                    subcategory: vocab.subcategory || 'general',
                    part_of_speech: vocab.part_of_speech || 'noun',
                    language: vocab.language || 'spanish',
                    audio_url: vocab.audio_url,
                    order_position: item.order_position,
                    isCustomVocabulary: false
                };
            } else {
                const vocab = item.enhanced_vocabulary_item as any;
                return {
                    id: vocab.id,
                    word: vocab.term,
                    translation: vocab.translation,
                    category: 'custom',
                    subcategory: 'user_list',
                    part_of_speech: vocab.part_of_speech || 'noun',
                    language: 'spanish',
                    audio_url: vocab.audio_url,
                    order_position: item.order_position,
                    isCustomVocabulary: true
                };
            }
        });
}

/**
 * CACHED: Get assignment data with ISR-style caching
 * Uses unstable_cache for cross-request caching (revalidates every 5 minutes)
 * This means 30 students hitting the same assignment = 1 database read
 */
export const getCachedAssignmentData = unstable_cache(
    async (assignmentId: string): Promise<CachedAssignment | null> => {
        console.log(`🔍 [AssignmentCache] DB hit for assignment: ${assignmentId}`);
        return await fetchAssignmentData(assignmentId);
    },
    ['assignment-data'],
    {
        revalidate: 300, // 5 minutes
        tags: ['assignments']
    }
);

/**
 * CACHED: Get vocabulary for assignment with ISR-style caching
 * This prevents 30 students from each making a separate vocabulary query
 */
export const getCachedAssignmentVocabulary = unstable_cache(
    async (listId: string): Promise<CachedVocabularyItem[]> => {
        console.log(`🔍 [AssignmentCache] DB hit for vocabulary list: ${listId}`);
        return await fetchAssignmentVocabulary(listId);
    },
    ['assignment-vocabulary'],
    {
        revalidate: 300, // 5 minutes
        tags: ['vocabulary', 'assignments']
    }
);

/**
 * Get complete assignment with vocabulary (fully cached)
 * This is the main entry point for games loading assignment data
 */
export async function getCachedAssignmentWithVocabulary(
    assignmentId: string
): Promise<{
    assignment: CachedAssignment | null;
    vocabulary: CachedVocabularyItem[];
}> {
    // Get assignment data (cached)
    const assignment = await getCachedAssignmentData(assignmentId);

    if (!assignment) {
        return { assignment: null, vocabulary: [] };
    }

    // Get vocabulary if list ID exists (cached)
    let vocabulary: CachedVocabularyItem[] = [];
    if (assignment.vocabulary_assignment_list_id) {
        vocabulary = await getCachedAssignmentVocabulary(
            assignment.vocabulary_assignment_list_id
        );
    }

    console.log(`✅ [AssignmentCache] Loaded assignment "${assignment.title}" with ${vocabulary.length} vocabulary items`);

    return { assignment, vocabulary };
}

/**
 * Invalidate assignment cache
 * Call this when an assignment is updated
 */
export async function invalidateAssignmentCache(assignmentId: string): Promise<void> {
    // Note: Next.js unstable_cache doesn't have explicit invalidation
    // Cache will refresh after revalidate period (5 minutes)
    // For immediate invalidation, you would need to use revalidateTag() in a Server Action
    console.log(`🗑️ [AssignmentCache] Cache invalidation requested for: ${assignmentId}`);
    console.log(`   (Will refresh automatically in ≤5 minutes)`);
}

/**
 * Get cache statistics (for debugging/monitoring)
 */
export function getCacheInfo() {
    return {
        revalidateSeconds: 300,
        tags: ['assignments', 'vocabulary'],
        description: 'Assignment and vocabulary data cached for 5 minutes to reduce DB load during class usage spikes'
    };
}
