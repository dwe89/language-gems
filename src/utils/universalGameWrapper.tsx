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

  // If no user, provide default settings (but read from URL params if available)
  if (!user) {
    const defaultSettings = {
      language: searchParams?.get('lang') === 'es' ? 'spanish' : 
                searchParams?.get('lang') === 'fr' ? 'french' :
                searchParams?.get('lang') === 'de' ? 'german' : 'spanish',
      category: searchParams?.get('cat') || 'basics_core_language',
      subcategory: searchParams?.get('subcat') || 'greetings_introductions',
      curriculumLevel: searchParams?.get('level') || 'KS3',
      difficulty: searchParams?.get('difficulty') || 'medium',
      theme: searchParams?.get('theme') || 'classic',
      timeLimit: 120
    };

    console.log(`🎯 [${gameId}] Default settings from URL:`, {
      urlParams: {
        lang: searchParams?.get('lang'),
        cat: searchParams?.get('cat'),
        subcat: searchParams?.get('subcat'),
        level: searchParams?.get('level'),
        theme: searchParams?.get('theme')
      },
      finalSettings: defaultSettings
    });

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
      searchParams={searchParams}
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
