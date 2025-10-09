'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '../lib/supabase-client';
import type { StandardVocabularyItem } from './useAssignmentVocabulary';

interface VocabularyProgress {
  vocabulary_id: string;
  seen_count: number;
  correct_count: number;
  last_seen_at: string;
}

interface UseSessionVocabularySelectorOptions {
  enabled: boolean;
  assignmentId: string;
  studentId: string;
  fullVocabulary: StandardVocabularyItem[];
  sessionSize?: number;
}

/**
 * Progressive Coverage Hook
 * 
 * Implements adaptive learning by selecting a subset of vocabulary for each session
 * based on student progress. Prioritizes unseen words, then weak words.
 */
export function useSessionVocabularySelector({
  enabled,
  assignmentId,
  studentId,
  fullVocabulary,
  sessionSize = 10
}: UseSessionVocabularySelectorOptions) {
  const [sessionVocabulary, setSessionVocabulary] = useState<StandardVocabularyItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !assignmentId || !studentId || fullVocabulary.length === 0) {
      setSessionVocabulary([]);
      return;
    }

    const selectSessionVocabulary = async () => {
      setLoading(true);
      console.log('🎯 [SESSION SELECTOR] Selecting vocabulary for session:', {
        assignmentId,
        studentId,
        totalWords: fullVocabulary.length,
        sessionSize
      });

      try {
        const supabase = createBrowserClient();

        // Load student's progress for this assignment
        const { data: progressData, error: progressError } = await supabase
          .from('assignment_vocabulary_progress')
          .select('vocabulary_id, seen_count, correct_count, last_seen_at')
          .eq('assignment_id', assignmentId)
          .eq('student_id', studentId);

        if (progressError) {
          console.error('❌ Error loading progress:', progressError);
          // Fallback to first N words
          setSessionVocabulary(fullVocabulary.slice(0, sessionSize));
          return;
        }

        // Create progress map
        const progressMap = new Map<string, VocabularyProgress>();
        (progressData || []).forEach(p => {
          progressMap.set(p.vocabulary_id, p);
        });

        // Separate unseen and seen words
        const withOrder = fullVocabulary.map((v, idx) => ({ ...v, originalIndex: idx }));
        const unseen = withOrder.filter(v => {
          const p = progressMap.get(v.id);
          return !p || (p.seen_count ?? 0) === 0;
        });

        // Smart Reset: if nothing unseen remains, rank the whole pool by weakness + recency
        const allSeen = unseen.length === 0;

        if (allSeen) {
          console.log('🔄 [SESSION SELECTOR] All words seen, selecting weakest words');
          
          // Rank by weakness (low correct_count / seen_count ratio) and recency
          const ranked = withOrder
            .map(v => {
              const p = progressMap.get(v.id);
              const seenCount = p?.seen_count || 1;
              const correctCount = p?.correct_count || 0;
              const accuracy = correctCount / seenCount;
              const lastSeen = p?.last_seen_at ? new Date(p.last_seen_at).getTime() : 0;
              const recencyScore = Date.now() - lastSeen;
              
              // Lower score = weaker word (prioritize for review)
              const weaknessScore = accuracy - (recencyScore / 1000000000); // Normalize recency
              
              return { ...v, weaknessScore };
            })
            .sort((a, b) => a.weaknessScore - b.weaknessScore);

          setSessionVocabulary(ranked.slice(0, sessionSize));
        } else {
          console.log('✨ [SESSION SELECTOR] Selecting unseen words first');
          
          // Prioritize unseen words, fill remainder with weak words
          if (unseen.length >= sessionSize) {
            // Enough unseen words
            setSessionVocabulary(unseen.slice(0, sessionSize));
          } else {
            // Mix unseen + weak seen words
            const seen = withOrder.filter(v => !unseen.includes(v));
            const ranked = seen
              .map(v => {
                const p = progressMap.get(v.id);
                const seenCount = p?.seen_count || 1;
                const correctCount = p?.correct_count || 0;
                const accuracy = correctCount / seenCount;
                return { ...v, accuracy };
              })
              .sort((a, b) => a.accuracy - b.accuracy);

            const needed = sessionSize - unseen.length;
            const weakWords = ranked.slice(0, needed);
            
            setSessionVocabulary([...unseen, ...weakWords]);
          }
        }

        console.log('✅ [SESSION SELECTOR] Session vocabulary selected:', {
          sessionSize: sessionVocabulary.length,
          unseenCount: unseen.length,
          allSeen
        });
      } catch (error) {
        console.error('❌ [SESSION SELECTOR] Error selecting vocabulary:', error);
        // Fallback to first N words
        setSessionVocabulary(fullVocabulary.slice(0, sessionSize));
      } finally {
        setLoading(false);
      }
    };

    selectSessionVocabulary();
  }, [enabled, assignmentId, studentId, fullVocabulary.length, sessionSize]);

  return { sessionVocabulary, loading };
}

