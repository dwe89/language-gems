"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import GameLauncher from '../../../components/games/GameLauncher';

export default function GemCollectorGame() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL parameters
  const assignmentId = searchParams?.get('assignment');
  const language = searchParams?.get('language') || 'spanish';
  const difficulty = searchParams?.get('difficulty') || 'beginner';
  const theme = searchParams?.get('theme');
  const topic = searchParams?.get('topic');

  // Only redirect to login if not in demo mode and not authenticated
  if (!isLoading && !user && !isDemo) {
    router.push('/auth/login');
    return null;
  }

  // Show loading while authenticating
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading Enhanced Gem Collector...</p>
        </div>
      </div>
    );
  }

  return (
    <GameLauncher
      mode={assignmentId ? 'assignment' : 'free_play'}
      assignmentId={assignmentId || undefined}
      gameConfig={{
        language,
        difficulty,
        theme,
        topic
      }}
      onGameComplete={(results) => {
        console.log('Game completed:', results);
        // Handle game completion - could redirect to results page
      }}
      onExit={() => {
        router.push('/games');
      }}
    />
  );
}