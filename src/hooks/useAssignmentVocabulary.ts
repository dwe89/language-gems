'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '../lib/supabase-client';
import { loadSentencesForAssignment } from '../utils/assignmentLoaders';

export interface StandardVocabularyItem {
  id: string;          // UUID from centralized_vocabulary
  word: string;        // Spanish/target language
  translation: string; // English translation
  category: string;    // Modern category field
  subcategory: string; // Modern subcategory field
  part_of_speech: string;
  language: string;
  audio_url?: string;  // Audio URL for listening activities
  word_type?: string;  // Additional word type information
  gender?: string;     // Gender for nouns
  article?: string;    // Article for nouns
  display_word?: string; // Display version of word
  order_position?: number;
}

export interface AssignmentData {
  id: string;
  title: string;
  description: string;
  game_config: any;
  vocabulary_assignment_list_id: string;
  due_date: string;
  class_name?: string;
  vocabulary_criteria: any;
  curriculum_level?: string;
  exam_board?: string;
  tier?: string;
}

interface UseAssignmentVocabularyReturn {
  assignment: AssignmentData | null;
  vocabulary: StandardVocabularyItem[];
  sentences: any[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to load assignment data and vocabulary
 * Handles both vocabulary-based and sentence-based assignments
 */
export function useAssignmentVocabulary(
  assignmentId: string,
  gameId: string
): UseAssignmentVocabularyReturn {
  const [assignment, setAssignment] = useState<AssignmentData | null>(null);
  const [vocabulary, setVocabulary] = useState<StandardVocabularyItem[]>([]);
  const [sentences, setSentences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastLoadTime, setLastLoadTime] = useState<string | null>(null);

  useEffect(() => {
    const loadAssignmentData = async () => {
      console.log('🔧 [HOOK] useAssignmentVocabulary called [DEBUG-v2]:', {
        assignmentId,
        gameId,
        vocabularyLength: vocabulary.length,
        lastLoadTime,
        timestamp: new Date().toISOString()
      });

      try {
        setLoading(true);
        const supabase = createBrowserClient();

        // Load assignment
        const { data: assignmentData, error: assignmentError } = await supabase
          .from('assignments')
          .select('*')
          .eq('id', assignmentId)
          .single();

        if (assignmentError) throw assignmentError;
        if (!assignmentData) throw new Error('Assignment not found');

        setAssignment(assignmentData);

        // Determine if this is a sentence-based or vocabulary-based assignment
        const isSentenceBased = assignmentData.vocabulary_criteria?.content_type === 'sentences';

        if (isSentenceBased) {
          // Load sentences for sentence-based games
          console.log('📝 [HOOK] Loading sentences for assignment:', assignmentId);
          const loadedSentences = await loadSentencesForAssignment(assignmentData);
          setSentences(loadedSentences);
          setVocabulary([]); // No vocabulary for sentence-based assignments
        } else {
          // Load vocabulary for vocabulary-based games
          console.log('📚 [HOOK] Loading vocabulary for assignment:', assignmentId);

          const listId = assignmentData.vocabulary_assignment_list_id;
          if (!listId) {
            console.warn('[HOOK] No vocabulary list ID found, falling back to criteria-based query');
            const criteria = assignmentData.vocabulary_criteria || {};

            // Fallback: derive vocabulary from criteria (language/category/subcategory/etc.)
            let vq = supabase.from('centralized_vocabulary').select('*');
            if (criteria.language) {
              vq = vq.eq('language', criteria.language);
            }
            if (criteria.category) {
              vq = vq.eq('category', criteria.category);
            }
            if (criteria.subcategory) {
              vq = vq.eq('subcategory', criteria.subcategory);
            }
            // Curriculum level: allow partial matches or null
            if (criteria.curriculum_level && criteria.curriculum_level !== 'KS3') {
              vq = vq.or(`curriculum_level.ilike.%${criteria.curriculum_level}%,curriculum_level.is.null`);
            }
            // KS4-specific filters
            if (criteria.exam_board) {
              vq = vq.eq('exam_board_code', criteria.exam_board);
            }
            if (criteria.tier) {
              vq = vq.like('tier', `%${criteria.tier}%`);
            }

            const { data: fallbackVocab, error: fallbackErr } = await vq.limit(1000);
            if (fallbackErr) throw fallbackErr;

            const vocabularyItems: StandardVocabularyItem[] = (fallbackVocab || []).map((vocab: any) => ({
              id: vocab.id,
              word: vocab.word,
              translation: vocab.translation,
              category: vocab.category || 'general',
              subcategory: vocab.subcategory || 'general',
              part_of_speech: vocab.part_of_speech || 'noun',
              language: vocab.language || 'spanish',
              audio_url: vocab.audio_url,
              word_type: vocab.word_type,
              gender: vocab.gender,
              article: vocab.article,
              display_word: vocab.display_word
            }));

            setVocabulary(vocabularyItems);
            setSentences([]);
            setLastLoadTime(new Date().toISOString());
            setError(null);
            return; // Stop here; we handled via fallback
          }

          // Load vocabulary items from the assignment list
          const { data: listItems, error: listError } = await supabase
            .from('vocabulary_assignment_items')
            .select(`
              vocabulary_id,
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
            .eq('assignment_list_id', listId)
            .order('order_position', { ascending: true });

          if (listError) throw listError;

          // Transform to StandardVocabularyItem format
          const vocabularyItems: StandardVocabularyItem[] = (listItems || [])
            .filter(item => item.centralized_vocabulary)
            .map(item => {
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
                word_type: vocab.word_type,
                gender: vocab.gender,
                article: vocab.article,
                display_word: vocab.display_word,
                order_position: item.order_position
              };
            });

          setVocabulary(vocabularyItems);
          setSentences([]); // No sentences for vocabulary-based assignments
        }

        setLastLoadTime(new Date().toISOString());
        setError(null);
      } catch (err) {
        console.error('❌ [HOOK] Error loading assignment data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load assignment');
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId && gameId) {
      loadAssignmentData();
    }
  }, [assignmentId, gameId]); // Only reload if assignmentId or gameId changes

  return { assignment, vocabulary, sentences, loading, error };
}

