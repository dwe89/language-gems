/**
 * Hook to filter outstanding words for assignments
 * Returns only words that haven't been mastered yet
 */

import { useState, useEffect } from 'react';
import { AssignmentProgressTrackingService } from '../services/AssignmentProgressTrackingService';
import { supabaseBrowser } from '../components/auth/AuthProvider';

export interface UseOutstandingWordsOptions {
  assignmentId: string;
  studentId: string;
  enabled?: boolean;
  excludeMastered?: boolean;
  excludeSeen?: boolean;
  minAccuracyThreshold?: number;
}

export function useOutstandingWords(options: UseOutstandingWordsOptions) {
  const {
    assignmentId,
    studentId,
    enabled = true,
    excludeMastered = true,
    excludeSeen = false,
    minAccuracyThreshold = 80
  } = options;

  const [outstandingWords, setOutstandingWords] = useState<any[]>([]);
  const [allWords, setAllWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    outstanding: 0,
    mastered: 0,
    seen: 0
  });

  useEffect(() => {
    if (!enabled || !assignmentId || !studentId) {
      setLoading(false);
      return;
    }

    const loadOutstandingWords = async () => {
      try {
        setLoading(true);
        setError(null);

        const progressService = new AssignmentProgressTrackingService(supabaseBrowser);

        // Get outstanding words
        const outstanding = await progressService.getOutstandingWords({
          assignmentId,
          studentId,
          excludeMastered,
          excludeSeen,
          minAccuracyThreshold
        });

        // Get all words for comparison
        const all = await progressService.getOutstandingWords({
          assignmentId,
          studentId,
          excludeMastered: false,
          excludeSeen: false
        });

        // Get mastery status
        const masteryData = await progressService.getWordMasteryStatus(assignmentId, studentId);
        const masteredCount = masteryData.filter(m => m.isMastered).length;
        const seenCount = masteryData.filter(m => m.totalEncounters > 0).length;

        setOutstandingWords(outstanding);
        setAllWords(all);
        setStats({
          total: all.length,
          outstanding: outstanding.length,
          mastered: masteredCount,
          seen: seenCount
        });

        console.log('📚 Outstanding words loaded:', {
          assignmentId,
          total: all.length,
          outstanding: outstanding.length,
          mastered: masteredCount,
          seen: seenCount,
          excludeMastered,
          excludeSeen
        });

      } catch (err) {
        console.error('Error loading outstanding words:', err);
        setError(err instanceof Error ? err.message : 'Failed to load words');
      } finally {
        setLoading(false);
      }
    };

    loadOutstandingWords();
  }, [assignmentId, studentId, enabled, excludeMastered, excludeSeen, minAccuracyThreshold]);

  return {
    outstandingWords,
    allWords,
    loading,
    error,
    stats
  };
}

