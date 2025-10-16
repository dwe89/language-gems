'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

/**
 * Assignment Preview Redirect Page
 * 
 * This page handles teacher preview of assignments by redirecting to the appropriate game
 * with preview mode enabled. It reuses the same game routing logic from the old detail page.
 */
export default function AssignmentPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params?.assignmentId as string;

  useEffect(() => {
    if (!assignmentId) {
      router.push('/dashboard/assignments');
      return;
    }

    const redirectToGame = async () => {
      try {
        // Fetch assignment details
        const response = await fetch(`/api/assignments/${assignmentId}/vocabulary`);
        if (!response.ok) {
          throw new Error('Failed to fetch assignment details');
        }

        const data = await response.json();
        const assignment = data.assignment;
        const gameType = assignment.game_type || assignment.type;

        // Check if multi-game or assessment
        const isMultiGame = gameType === 'multi-game' || 
                           gameType === 'mixed-mode' ||
                           assignment.game_config?.multiGame ||
                           (assignment.config?.gameConfig?.selectedGames?.length > 1);

        if (isMultiGame) {
          router.push(`/student-dashboard/assignments/${assignmentId}?preview=true`);
          return;
        }

        if (gameType === 'assessment') {
          router.push(`/assessments/assignment/${assignmentId}?preview=true`);
          return;
        }

        // Single game - build game URL with parameters
        const gamePathMap: Record<string, string> = {
          'memory-game': 'memory-game',
          'memory-match': 'memory-game',
          'vocab-blast': 'vocab-blast',
          'vocab-master': 'vocab-master',
          'word-blast': 'word-blast',
          'hangman': 'hangman',
          'noughts-and-crosses': 'noughts-and-crosses',
          'speed-builder': 'speed-builder',
          'vocabulary-mining': 'vocabulary-mining',
          'gem-collector': 'vocabulary-mining',
          'translation-tycoon': 'speed-builder',
          'conjugation-duel': 'conjugation-duel',
          'detective-listening': 'detective-listening',
          'verb-quest': 'verb-quest',
          'word-scramble': 'word-scramble',
          'word-guesser': 'word-scramble',
          'word-towers': 'word-towers',
          'sentence-towers': 'sentence-towers',
          'case-file-translator': 'case-file-translator',
          'lava-temple-word-restore': 'lava-temple-word-restore',
          'sentence-builder': 'speed-builder',
        };

        const gamePath = gamePathMap[gameType] || 'memory-game';
        const gameUrl = `/games/${gamePath}?assignment=${assignmentId}&mode=assignment&preview=true`;
        
        router.push(gameUrl);
      } catch (error) {
        console.error('Error loading assignment preview:', error);
        alert('Failed to load assignment preview. Please try again.');
        router.push('/dashboard/assignments');
      }
    };

    redirectToGame();
  }, [assignmentId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">Loading assignment preview...</p>
      </div>
    </div>
  );
}

