'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import VocabularyBuilder from '@/components/vocabulary/VocabularyBuilder';

export default function VocabularyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const initialAuthCheckDone = useRef(false);

  useEffect(() => {
    if (initialAuthCheckDone.current) return;

    if (user === undefined) {
      return;
    }
    
    initialAuthCheckDone.current = true;

    if (!user) {
      router.push('/login?redirect=/vocabulary');
    }
  }, [user, router]);

  if (!initialAuthCheckDone.current) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div> 
        <p className="ml-4">Loading Vocabulary...</p>
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24"> {/* Added pt-24 for nav */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Vocabulary Builder</h1>
        
        <div className="mb-8">
          <VocabularyBuilder />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">How to Use the Vocabulary Builder</h2>
          <ul className="space-y-2 text-gray-700 list-disc pl-5">
            <li>Add words you want to learn to your personal vocabulary list</li>
            <li>Use the flashcards feature to review your vocabulary regularly</li>
            <li>Words are reviewed using a spaced repetition system for optimal learning</li>
            <li>Your progress is tracked, helping you focus on words that need more practice</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 