'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function FlashcardsPage() {
  // Dynamic imports with fallbacks
  let Flashcards;
  let useAuth;
  
  try {
    // Try to dynamically import these components
    Flashcards = require('@/components/vocabulary/Flashcards').default;
    useAuth = require('@/components/auth/AuthContext').useAuth;
    
    console.log('Flashcards imports successful:', {
      Flashcards: typeof Flashcards,
      useAuth: typeof useAuth
    });
  } catch (err) {
    console.error('Import error in flashcards:', err);
    // Fallback components
    Flashcards = () => (
      <div className="p-4 border rounded bg-gray-100">
        <h3 className="text-lg font-medium">Flashcards</h3>
        <p>Unable to load flashcards. Please try again later.</p>
      </div>
    );
    
    useAuth = () => ({ 
      user: null 
    });
  }

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
        router.push('/login?redirect=/flashcards');
    }

  }, [user, router]);

  if (!initialAuthCheckDone.current) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div> 
        <p className="ml-4">Loading Flashcards...</p>
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24"> {/* Added pt-24 for nav */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Flashcards</h1>
        
        {/* Integrate the Flashcards component */}
        {/* You might need to pass language or other props here */}
        <Flashcards /> 

        {/* Add other relevant sections like filtering by language/deck */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Manage Decks</h2>
            {/* Placeholder */}
            <p className="text-gray-600">Deck management features coming soon.</p> 
          </div>
      </div>
    </div>
  );
} 