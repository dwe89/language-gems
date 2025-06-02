'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { VocabularyItem, DifficultyLevel, TranslationDirection } from '../types';

interface TranslationChallengeProps {
  vocabularyItem: VocabularyItem;
  onCorrectAnswer: (item: VocabularyItem, timeTaken: number) => void;
  onIncorrectAnswer: (item: VocabularyItem, userAnswer: string) => void;
  translationDirection: TranslationDirection;
  difficulty: DifficultyLevel;
}

const TranslationChallenge: React.FC<TranslationChallengeProps> = ({
  vocabularyItem,
  onCorrectAnswer,
  onIncorrectAnswer,
  translationDirection,
  difficulty
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'none' }>({ 
    message: '', 
    type: 'none' 
  });
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Reset input and start time when vocabulary item changes
    setUserAnswer('');
    setStartTime(Date.now());
    setFeedback({ message: '', type: 'none' });
    
    // Focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [vocabularyItem]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if the answer is empty
    if (!userAnswer.trim()) {
      return;
    }
    
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const correctAnswer = translationDirection === 'fromNative' 
      ? vocabularyItem.translatedText.toLowerCase() 
      : vocabularyItem.originalText.toLowerCase();
    const userAnswerLower = userAnswer.trim().toLowerCase();
    
    // Check if the answer is correct
    if (userAnswerLower === correctAnswer) {
      setFeedback({ 
        message: 'Correct! Great job!', 
        type: 'success' 
      });
      
      // Call the onCorrectAnswer callback
      onCorrectAnswer(vocabularyItem, timeTaken);
      
      // Reset the input after a short delay
      setTimeout(() => {
        setUserAnswer('');
        setFeedback({ message: '', type: 'none' });
      }, 1000);
    } else {
      setFeedback({ 
        message: `Incorrect! The correct answer is "${correctAnswer}"`, 
        type: 'error' 
      });
      
      // Call the onIncorrectAnswer callback
      onIncorrectAnswer(vocabularyItem, userAnswerLower);
      
      // Reset the input after a longer delay
      setTimeout(() => {
        setUserAnswer('');
        setFeedback({ message: '', type: 'none' });
      }, 2000);
    }
  };
  
  // Get the prompt based on translation direction
  const promptText = translationDirection === 'fromNative' 
    ? vocabularyItem.originalText 
    : vocabularyItem.translatedText;
  
  return (
    <div className="translation-challenge">
      <div className="challenge-word">
        {promptText}
        {vocabularyItem.isChallenge && (
          <span className="challenge-word-marker">
            <Sparkles size={14} className="inline mr-1" />
            BONUS
          </span>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-center md:gap-2">
        <div className="flex-1">
          <input
            ref={inputRef}
            type="text"
            className={`translation-input w-full ${
              feedback.type === 'success' ? 'border-green-500' : 
              feedback.type === 'error' ? 'border-red-500' : ''
            }`}
            value={userAnswer}
            onChange={handleInputChange}
            placeholder={`Enter the ${translationDirection === 'fromNative' ? 'translation' : 'original word'}`}
            disabled={feedback.type !== 'none'}
          />
          
          {feedback.message && (
            <div className={`md:absolute md:bottom-1 text-sm ${
              feedback.type === 'success' ? 'text-green-600' : 
              feedback.type === 'error' ? 'text-red-600' : ''
            }`}>
              {feedback.message}
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          className="submit-btn w-full md:w-auto"
          disabled={!userAnswer.trim() || feedback.type !== 'none'}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default TranslationChallenge; 