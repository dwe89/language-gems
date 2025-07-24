'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../../../components/auth/AuthProvider';
import GameSettings from './components/GameSettings';
import MemoryGameMain from './components/MemoryGameMain';
import { WordPair } from './components/CustomWordsModal';
import './styles.css';

// Smart vocabulary rotation function
function selectVocabularyWithRotation(allVocabulary: any[], maxCount: number, assignmentId: string): any[] {
  // Get previously used vocabulary from localStorage
  const storageKey = `vocabulary-rotation-${assignmentId}`;
  const usedVocabularyIds = JSON.parse(localStorage.getItem(storageKey) || '[]') as number[];

  // Separate unused and used vocabulary
  const unusedVocabulary = allVocabulary.filter(vocab => !usedVocabularyIds.includes(vocab.id));
  const usedVocabulary = allVocabulary.filter(vocab => usedVocabularyIds.includes(vocab.id));

  let selectedVocabulary: any[] = [];

  // First, prioritize unused vocabulary
  if (unusedVocabulary.length >= maxCount) {
    // We have enough unused vocabulary, randomly select from unused
    selectedVocabulary = [...unusedVocabulary]
      .sort(() => 0.5 - Math.random())
      .slice(0, maxCount);
  } else {
    // Not enough unused vocabulary, use all unused + some used
    selectedVocabulary = [...unusedVocabulary];

    const remainingCount = maxCount - unusedVocabulary.length;
    if (remainingCount > 0 && usedVocabulary.length > 0) {
      const additionalVocabulary = [...usedVocabulary]
        .sort(() => 0.5 - Math.random())
        .slice(0, remainingCount);
      selectedVocabulary.push(...additionalVocabulary);
    }
  }

  // If we've used all vocabulary, reset the rotation
  if (unusedVocabulary.length === 0 && usedVocabulary.length > 0) {
    console.log('All vocabulary has been practiced. Resetting rotation.');
    localStorage.removeItem(storageKey);
  }

  // Store the selected vocabulary IDs as used
  const newUsedIds = [...usedVocabularyIds, ...selectedVocabulary.map(v => v.id)];
  const uniqueUsedIds = [...new Set(newUsedIds)];
  localStorage.setItem(storageKey, JSON.stringify(uniqueUsedIds));

  console.log(`Smart rotation: Selected ${selectedVocabulary.length} words (${unusedVocabulary.length} unused, ${usedVocabulary.length} used)`);

  return selectedVocabulary;
}

export default function MemoryGamePage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  
  const [stage, setStage] = useState<'selector' | 'game'>('selector');
  const [gameOptions, setGameOptions] = useState({
    language: '',
    topic: '',
    difficulty: ''
  });
  const [customWords, setCustomWords] = useState<WordPair[]>([]);
  const [assignmentData, setAssignmentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Load assignment data if assignment ID is provided
  useEffect(() => {
    if (assignmentId) {
      setLoading(true);
      setError('');

      fetch(`/api/assignments/${assignmentId}/vocabulary`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          return res.json();
        })
        .then(data => {
          if (data.vocabulary && data.vocabulary.length > 0) {
            // Limit vocabulary to maximum 10 items for playability
            const maxVocabulary = 10;
            let vocabularyToUse = data.vocabulary;

            if (data.vocabulary.length > maxVocabulary) {
              console.warn(`Assignment has ${data.vocabulary.length} vocabulary items. Limiting to ${maxVocabulary} for better gameplay.`);
              // Smart vocabulary rotation: prioritize unused words
              vocabularyToUse = selectVocabularyWithRotation(data.vocabulary, maxVocabulary, assignmentId);
            }
            
            const wordPairs = vocabularyToUse.map((vocab: any) => ({
              id: vocab.vocabulary_id || vocab.id,
              term: vocab.spanish,  // Spanish word as the term
              translation: vocab.english,  // English as the translation
              type: 'word' as const,
              theme: vocab.theme,
              topic: vocab.topic
            }));
            setAssignmentData({
              ...data,
              vocabulary: vocabularyToUse
            });
            setCustomWords(wordPairs);
            setStage('game');
          } else {
            setError('No vocabulary found for this assignment.');
          }
        })
        .catch(error => {
          console.error('Error loading assignment:', error);
          setError(`Failed to load assignment: ${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [assignmentId]);

  const handleStartGame = (settings: { 
    language: string; 
    topic: string; 
    difficulty: string;
    theme: string;
    customWords?: WordPair[];
  }) => {
    setGameOptions({
      language: settings.language,
      topic: settings.topic,
      difficulty: settings.difficulty
    });

    if (settings.customWords) {
      setCustomWords(settings.customWords);
    }

    setStage('game');
  };

  const handleBackToSettings = () => {
    // In assignment mode, don't allow going back to selector
    if (assignmentId) {
      // Could redirect to dashboard or show a message
      window.history.back(); // Go back to previous page (likely dashboard)
      return;
    }
    setStage('selector');
    setCustomWords([]);
  };

  const handleGameProgress = async (progressData: any) => {
    if (assignmentId) {
      try {
        await fetch(`/api/assignments/${assignmentId}/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(progressData),
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };



  return (
    <div className="memory-game-container">
      {assignmentId ? (
        // Assignment Mode - either loading or playing
        assignmentData ? (
          <MemoryGameMain
            language="Spanish"
            topic="Assignment"
            difficulty="medium"
            onBackToSettings={handleBackToSettings}
            customWords={customWords}
            isAssignmentMode={true}
            assignmentTitle={assignmentData.assignment.title}
            assignmentId={assignmentId}
          />
        ) : error ? (
          // Error loading assignment
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Assignment Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Go Back
              </button>
            </div>
          </div>
        ) : (
          // Loading assignment data - don't show selector
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading assignment...</p>
            </div>
          </div>
        )
      ) : (
        // Free Play Mode - show selector or game
        stage === 'selector' ? (
          <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
            {/* Header */}
            <motion.div
              className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link href="/games" className="text-white hover:text-white/80 transition-colors">
                <motion.div
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full transition-all border border-white/30"
                  whileHover={{ scale: 1.05, x: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">←</span>
                  <span className="font-medium">Back to Games</span>
                </motion.div>
              </Link>

              <motion.h1
                className="text-3xl md:text-4xl font-bold text-white text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                🧠 Memory Match
              </motion.h1>

              <div className="w-32"></div> {/* Spacer for centering */}
            </motion.div>

            {/* Main Content */}
            <div className="flex items-center justify-center p-6">
              <GameSettings onStartGame={handleStartGame} />
            </div>
          </div>
        ) : (
          <MemoryGameMain
            language={gameOptions.language}
            topic={gameOptions.topic}
            difficulty={gameOptions.difficulty}
            onBackToSettings={handleBackToSettings}
            customWords={customWords.length > 0 ? customWords : undefined}
            isAssignmentMode={false}
          />
        )
      )}
    </div>
  );
} 