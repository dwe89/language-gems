'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import DetectiveListeningGameWrapper from './components/DetectiveListeningGameWrapper';
import DetectiveListeningAssignmentWrapper from './components/DetectiveListeningAssignmentWrapper';
import AssignmentLoadingScreen from '../../../components/ui/AssignmentLoadingScreen';
import AssignmentErrorScreen from '../../../components/ui/AssignmentErrorScreen';
import UniversalGameWrapper from '../../../utils/universalGameWrapper';

export default function UnifiedDetectiveListeningPage() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  console.log('🎯 [Detective Listening] URL params [DEBUG-v3]:', {
    assignmentId,
    mode,
    searchParams: searchParams?.toString(),
    timestamp: new Date().toISOString()
  });





  console.log('🎯 [Detective Listening] Assignment mode check [DEBUG-v6]:', {
    assignmentId,
    mode,
    hasUser: !!user,
    userId: user?.id,
    searchParams: searchParams?.toString(),
    timestamp: new Date().toISOString()
  });

  // If assignment mode, use the assignment wrapper directly
  if (assignmentId && mode === 'assignment' && user) {
    return (
      <DetectiveListeningAssignmentWrapper assignmentId={assignmentId} />
    );
  }

  // Use universal game wrapper for all cases
  return (
    <UniversalGameWrapper gameId="detective-listening">
      {({ settings, isAssignmentMode, assignmentId: assignmentIdFromWrapper, userId, loading, error }) => {
          console.log('🎯 [Detective Listening] Assignment handler result:', {
            isAssignmentMode,
            hasSettings: !!settings,
            loading,
            error,
            timestamp: new Date().toISOString()
          });

          if (loading) {
            return <AssignmentLoadingScreen />;
          }

          if (error) {
            return <AssignmentErrorScreen error={error} onRetry={() => window.location.reload()} />;
          }

          if (!settings) {
            return <div>No settings available</div>;
          }

          // Convert settings to the format expected by DetectiveListeningGameWrapper
          const gameSettings = {
            caseType: settings.category || 'basics_core_language',
            language: settings.language || 'spanish',
            difficulty: settings.difficulty || 'medium',
            category: settings.category || 'basics_core_language',
            subcategory: settings.subcategory || 'greetings_introductions',
            curriculumLevel: settings.curriculumLevel || 'KS3',
            examBoard: settings.examBoard,
            tier: settings.tier
          };

          return (
            <DetectiveListeningGameWrapper
              settings={gameSettings}
              assignmentId={assignmentIdFromWrapper}
              userId={userId}
              onBackToMenu={() => router.push('/games/detective-listening')}
              onGameEnd={(result) => {
                console.log('Detective Listening game ended:', result);
                if (isAssignmentMode) {
                  // TODO: Handle assignment completion
                  console.log('Assignment mode game completed');
                }
                router.push('/games/detective-listening');
              }}
            />
          );
      }}
    </UniversalGameWrapper>
  );

}


