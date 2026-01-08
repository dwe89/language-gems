'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import UniversalGameWrapper from '../../../utils/universalGameWrapper';
import TicTacToeGameWrapper from '../../../components/games/noughts-and-crosses/TicTacToeGameWrapper';
import ThemeProvider from '../../../components/games/noughts-and-crosses/ThemeProvider';

export default function UnifiedNoughtsAndCrossesPageNew() {
  const router = useRouter();

  console.log('🎯 [Noughts NEW] Page component rendering');

  // Use universal game wrapper for all cases
  return (
    <UniversalGameWrapper gameId="noughts-and-crosses">
      {({ settings, isAssignmentMode, assignmentId, userId, loading, error }) => {
        console.log('🎯 [Noughts NEW] Universal wrapper result:', {
          isAssignmentMode,
          hasSettings: !!settings,
          loading,
          error,
          timestamp: new Date().toISOString()
        });

        if (loading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-lg">Loading assignment...</p>
              </div>
            </div>
          );
        }

        if (error) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Assignment</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Try Again
                </button>
              </div>
            </div>
          );
        }

        if (!settings) {
          return <div>No settings available</div>;
        }

        // Convert settings to the format expected by TicTacToeGameWrapper
        const gameSettings = {
          language: settings.language || 'spanish',
          difficulty: settings.difficulty || 'medium',
          category: settings.category || 'basics_core_language',
          subcategory: settings.subcategory || 'greetings_introductions',
          curriculumLevel: settings.curriculumLevel || 'KS3',
          examBoard: settings.examBoard,
          tier: settings.tier,
          theme: settings.theme || 'classic',
          timeLimit: settings.timeLimit || 120
        };

        console.log('🎯 [Noughts NEW] Game settings:', gameSettings);

        return (
          <ThemeProvider theme={gameSettings.theme}>
            <TicTacToeGameWrapper
              settings={gameSettings}
              assignmentId={assignmentId}
              userId={userId}
              onBackToMenu={() => router.push('/games/noughts-and-crosses')}
              onGameEnd={(result) => {
                console.log('Noughts and Crosses game ended:', result);
                if (isAssignmentMode) {
                  // TODO: Handle assignment completion
                  console.log('Assignment mode game completed');
                }
                router.push('/games/noughts-and-crosses');
              }}
            />
          </ThemeProvider>
        );
      }}
    </UniversalGameWrapper>
  );
}
