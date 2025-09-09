'use client';

import React, { useState, useEffect } from 'react';
import { loadAssignmentData, createGameSettings } from './assignmentLoader';

interface AssignmentModeHandlerProps {
  assignmentId: string | null;
  mode: string | null;
  userId: string;
  gameId: string;
  searchParams?: any; // URL search params for reading category/subcategory
  children: (props: {
    isAssignmentMode: boolean;
    settings: any;
    loading: boolean;
    error: string | null;
  }) => React.ReactNode;
}

export default function AssignmentModeHandler({
  assignmentId,
  mode,
  userId,
  gameId,
  searchParams,
  children
}: AssignmentModeHandlerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);

  // If assignmentId is present, we're in assignment mode regardless of mode parameter
  const isAssignmentMode = !!assignmentId;

  console.log('🎯 [ASSIGNMENT HANDLER] Mode detection:', {
    assignmentId,
    mode,
    isAssignmentMode,
    gameId,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    if (isAssignmentMode && assignmentId) {
      console.log('🔄 [ASSIGNMENT HANDLER] Loading assignment data:', { assignmentId, gameId });
      setLoading(true);
      setError(null);

      loadAssignmentData(assignmentId)
        .then(({ assignment, vocabulary }) => {
          console.log('✅ [ASSIGNMENT HANDLER] Assignment data loaded:', {
            assignment: assignment.title,
            vocabularyCount: vocabulary.length
          });

          const gameSettings = createGameSettings(assignment, vocabulary);
          setSettings(gameSettings);
          setLoading(false);
        })
        .catch((err) => {
          console.error('❌ [ASSIGNMENT HANDLER] Failed to load assignment:', err);
          setError(err instanceof Error ? err.message : 'Failed to load assignment');
          setLoading(false);
        });
    } else {
      // Not assignment mode, use URL parameters if available, otherwise default settings
      console.log('🎯 [ASSIGNMENT HANDLER] Not assignment mode, using URL settings');
      setSettings({
        language: searchParams?.get('lang') === 'es' ? 'spanish' : 
                  searchParams?.get('lang') === 'fr' ? 'french' :
                  searchParams?.get('lang') === 'de' ? 'german' : 'spanish',
        category: searchParams?.get('cat') || 'basics_core_language',
        subcategory: searchParams?.get('subcat') || 'greetings_introductions',
        curriculumLevel: searchParams?.get('level') || 'KS3',
        difficulty: searchParams?.get('difficulty') || 'medium',
        theme: searchParams?.get('theme') || 'classic',
        timeLimit: 120
      });
      setLoading(false);
    }
  }, [isAssignmentMode, assignmentId, gameId]);

  return (
    <>
      {children({
        isAssignmentMode,
        settings,
        loading,
        error
      })}
    </>
  );
}

// Simple loading component
export function AssignmentLoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg">Loading assignment...</p>
      </div>
    </div>
  );
}

// Simple error component
export function AssignmentErrorScreen({ 
  error, 
  onRetry 
}: { 
  error: string; 
  onRetry: () => void; 
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Assignment</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
