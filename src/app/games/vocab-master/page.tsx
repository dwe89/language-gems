"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import VocabMasterLauncher from '../../../components/games/VocabMasterLauncher';

export default function VocabMasterGame() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL parameters
  const assignmentId = searchParams?.get('assignment');
  const language = searchParams?.get('language') || 'spanish';
  const difficulty = searchParams?.get('difficulty') || 'beginner';
  const theme = searchParams?.get('theme');
  const topic = searchParams?.get('topic');

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    router.push('/auth/login');
    return null;
  }

  // Show loading while authenticating
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading VocabMaster...</p>
        </div>
      </div>
    );
  }

  return (
    <VocabMasterLauncher
      mode={assignmentId ? 'assignment' : 'free_play'}
      assignmentId={assignmentId || undefined}
      gameConfig={{
        language,
        difficulty,
        theme,
        topic
      }}
      onGameComplete={(results: any) => {
        console.log('Game completed:', results);
        // Redirect to dashboard with results
        router.push('/dashboard?tab=progress&gameResults=' + encodeURIComponent(JSON.stringify(results)));
      }}
      onExit={() => {
        router.push('/dashboard');
      }}
    />
  );
}
