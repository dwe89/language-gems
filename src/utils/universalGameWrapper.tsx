'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../components/auth/AuthProvider';
import AssignmentModeHandler from './assignmentModeHandler';

interface UniversalGameWrapperProps {
  gameId: string;
  children: (props: {
    settings: any;
    isAssignmentMode: boolean;
    assignmentId?: string;
    userId?: string;
    loading: boolean;
    error: string | null;
  }) => React.ReactNode;
}

/**
 * Universal wrapper that handles assignment mode for any game.
 * Ensures all games receive proper settings, whether in assignment mode or not.
 */
export default function UniversalGameWrapper({
  gameId,
  children
}: UniversalGameWrapperProps) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  console.log(`🎯 [${gameId}] Universal wrapper check:`, {
    assignmentId,
    mode,
    hasUser: !!user,
    userId: user?.id,
    timestamp: new Date().toISOString()
  });

  // If no user, provide default settings
  if (!user) {
    const defaultSettings = {
      language: 'spanish',
      category: 'basics_core_language',
      subcategory: 'greetings_introductions',
      curriculumLevel: 'KS3',
      difficulty: 'medium',
      theme: 'classic',
      timeLimit: 120
    };

    return (
      <>
        {children({
          settings: defaultSettings,
          isAssignmentMode: false,
          loading: false,
          error: null
        })}
      </>
    );
  }

  // Use assignment mode handler
  return (
    <AssignmentModeHandler
      assignmentId={assignmentId}
      mode={mode}
      userId={user.id}
      gameId={gameId}
    >
      {({ isAssignmentMode, settings, loading, error }) => {
        console.log(`🎯 [${gameId}] Assignment handler result:`, {
          isAssignmentMode,
          hasSettings: !!settings,
          loading,
          error,
          timestamp: new Date().toISOString()
        });

        return (
          <>
            {children({
              settings,
              isAssignmentMode,
              assignmentId: isAssignmentMode ? assignmentId || undefined : undefined,
              userId: user.id,
              loading,
              error
            })}
          </>
        );
      }}
    </AssignmentModeHandler>
  );
}
