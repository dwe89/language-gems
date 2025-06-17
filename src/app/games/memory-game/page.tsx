'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import LanguageTopicSelector from './components/LanguageTopicSelector';
import MemoryGameMain from './components/MemoryGameMain';
import CustomWordsModal from './components/CustomWordsModal';
import { WordPair } from './components/CustomWordsModal';
import './styles.css';

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
    if (assignmentId && user) {
      setLoading(true);
      fetch(`/api/assignments/${assignmentId}/vocabulary`)
        .then(res => res.json())
        .then(data => {
          if (data.vocabulary) {
            const wordPairs = data.vocabulary.map((vocab: any) => ({
              id: vocab.vocabulary_id || vocab.id,
              spanish: vocab.spanish,
              english: vocab.english,
              theme: vocab.theme,
              topic: vocab.topic
            }));
            setAssignmentData(data);
            setCustomWords(wordPairs);
            setStage('game');
          }
        })
        .catch(error => {
          console.error('Error loading assignment:', error);
          setError('Failed to load assignment. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [assignmentId, user]);

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

  if (loading) {
    return (
      <div className="memory-game-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="memory-game-container">
      {assignmentId && assignmentData ? (
        <div>
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold">Assignment: {assignmentData.assignment.title}</h3>
            <p className="text-sm">Complete this memory game with the assigned vocabulary</p>
          </div>
          <MemoryGameMain 
            language="Spanish" 
            topic="Assignment" 
            difficulty="medium"
            onBackToSettings={handleBackToSettings}
            customWords={customWords}
          />
        </div>
      ) : stage === 'selector' ? (
        <LanguageTopicSelector onStartGame={handleStartGame} />
      ) : (
        <MemoryGameMain 
          language={gameOptions.language} 
          topic={gameOptions.topic} 
          difficulty={gameOptions.difficulty}
          onBackToSettings={handleBackToSettings}
          customWords={customWords.length > 0 ? customWords : undefined}
        />
      )}

      <CustomWordsModal 
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onStartGame={handleCustomWordsStart}
      />
    </div>
  );
} 