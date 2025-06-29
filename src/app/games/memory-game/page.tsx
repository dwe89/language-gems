'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import LanguageTopicSelector from './components/LanguageTopicSelector';
import MemoryGameMain from './components/MemoryGameMain';
import CustomWordsModal from './components/CustomWordsModal';
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
  const [showCustomModal, setShowCustomModal] = useState(false);
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

  const handleStartGame = (language: string, topic: string, difficulty: string) => {
    setGameOptions({
      language,
      topic,
      difficulty
    });

    if (topic.toLowerCase() === 'custom') {
      setShowCustomModal(true);
    } else {
      setStage('game');
    }
  };

  const handleCustomWordsStart = (wordPairs: WordPair[]) => {
    setCustomWords(wordPairs);
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
          <LanguageTopicSelector onStartGame={handleStartGame} />
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

      <CustomWordsModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onStartGame={handleCustomWordsStart}
      />
    </div>
  );
} 