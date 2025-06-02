'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import Link from 'next/link';
import { ArrowLeft, Volume2, RotateCw, ThumbsUp, ThumbsDown, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRACTICE_MODES = {
  FLASHCARD: 'flashcard',
  MULTIPLE_CHOICE: 'multiple_choice',
  TYPING: 'typing',
  AUDIO: 'audio'
};

// Spaced repetition intervals (in days)
const SPACED_REPETITION_INTERVALS = [
  1,     // Level 0 -> 1: Review after 1 day
  3,     // Level 1 -> 2: Review after 3 days
  7,     // Level 2 -> 3: Review after 1 week
  14,    // Level 3 -> 4: Review after 2 weeks
  30,    // Level 4 -> 5: Review after 1 month
  90     // Level 5: Review after 3 months
];

export default function VocabularyPracticePage() {
  const searchParams = useSearchParams();
  const specificItem = searchParams.get('item');
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  const [loading, setLoading] = useState(true);
  const [practiceItems, setPracticeItems] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [practiceMode, setPracticeMode] = useState(PRACTICE_MODES.FLASHCARD);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [options, setOptions] = useState([]);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [practiceComplete, setPracticeComplete] = useState(false);
  
  // Fetch items to practice
  useEffect(() => {
    if (!user) return;
    
    const fetchPracticeItems = async () => {
      setLoading(true);
      
      try {
        let query = supabase
          .from('student_vocabulary_progress')
          .select(`
            id,
            vocabulary_item_id,
            proficiency_level,
            correct_answers,
            incorrect_answers,
            vocabulary_items(
              id,
              term,
              translation,
              example_sentence,
              example_translation,
              image_url,
              audio_url,
              list_id
            )
          `)
          .eq('student_id', user.id);
        
        // If a specific item ID was passed, only practice that item
        if (specificItem) {
          query = query.eq('vocabulary_item_id', specificItem);
        } else {
          // Otherwise, prioritize items due for review and weak items
          query = query.or(`next_review.lte.${new Date().toISOString()},proficiency_level.lt.3`);
        }
        
        // Limit to 20 items for a practice session
        const { data, error } = await query.limit(20);
        
        if (error) {
          console.error('Error fetching practice items:', error);
          return;
        }
        
        if (data.length === 0) {
          // If no items found that match criteria, get any items
          const { data: anyItems, error: anyError } = await supabase
            .from('student_vocabulary_progress')
            .select(`
              id,
              vocabulary_item_id,
              proficiency_level,
              correct_answers,
              incorrect_answers,
              vocabulary_items(
                id,
                term,
                translation,
                example_sentence,
                example_translation,
                image_url,
                audio_url,
                list_id
              )
            `)
            .eq('student_id', user.id)
            .limit(20);
            
          if (anyError) {
            console.error('Error fetching any practice items:', anyError);
            return;
          }
          
          processItems(anyItems);
        } else {
          processItems(data);
        }
      } catch (error) {
        console.error('Error in practice items fetching:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const processItems = (items) => {
      // Format items for practice
      const processedItems = items.map(item => ({
        progressId: item.id,
        itemId: item.vocabulary_item_id,
        term: item.vocabulary_items.term,
        translation: item.vocabulary_items.translation,
        exampleSentence: item.vocabulary_items.example_sentence,
        exampleTranslation: item.vocabulary_items.example_translation,
        imageUrl: item.vocabulary_items.image_url,
        audioUrl: item.vocabulary_items.audio_url,
        proficiencyLevel: item.proficiency_level,
        correctAnswers: item.correct_answers,
        incorrectAnswers: item.incorrect_answers
      }));
      
      // Shuffle the items
      const shuffledItems = [...processedItems].sort(() => Math.random() - 0.5);
      setPracticeItems(shuffledItems);
    };
    
    fetchPracticeItems();
  }, [user, supabase, specificItem]);
  
  // Generate multiple choice options
  useEffect(() => {
    if (practiceItems.length === 0 || practiceMode !== PRACTICE_MODES.MULTIPLE_CHOICE) return;
    
    const currentItem = practiceItems[currentItemIndex];
    const otherItems = practiceItems.filter((_, idx) => idx !== currentItemIndex);
    
    // Get 3 random items for incorrect options
    const shuffledItems = [...otherItems].sort(() => Math.random() - 0.5).slice(0, 3);
    
    // Combine with correct answer and shuffle
    const allOptions = [
      { text: currentItem.translation, isCorrect: true },
      ...shuffledItems.map(item => ({ text: item.translation, isCorrect: false }))
    ].sort(() => Math.random() - 0.5);
    
    setOptions(allOptions);
  }, [currentItemIndex, practiceItems, practiceMode]);
  
  // Update progress percentage
  useEffect(() => {
    if (practiceItems.length > 0) {
      setProgress(Math.round((currentItemIndex / practiceItems.length) * 100));
    }
  }, [currentItemIndex, practiceItems.length]);
  
  // Play audio if available
  const playAudio = useCallback(() => {
    if (practiceItems.length === 0) return;
    
    const currentItem = practiceItems[currentItemIndex];
    if (currentItem.audioUrl) {
      const audio = new Audio(currentItem.audioUrl);
      audio.play();
    }
  }, [currentItemIndex, practiceItems]);
  
  // Check user answer
  const checkAnswer = useCallback((answer, isOptionClick = false) => {
    if (practiceItems.length === 0) return;
    
    const currentItem = practiceItems[currentItemIndex];
    let correct = false;
    
    if (practiceMode === PRACTICE_MODES.MULTIPLE_CHOICE && isOptionClick) {
      correct = answer.isCorrect;
    } else if (practiceMode === PRACTICE_MODES.TYPING) {
      // Case insensitive comparison with trimmed whitespace
      correct = answer.trim().toLowerCase() === currentItem.translation.trim().toLowerCase();
    }
    
    setIsCorrect(correct);
    setShowAnswer(true);
    
    // Update stats
    setStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1)
    }));
    
    // Update proficiency level in the database
    updateProficiencyLevel(currentItem.progressId, currentItem.proficiencyLevel, correct);
  }, [currentItemIndex, practiceItems, practiceMode]);
  
  // Update proficiency level using spaced repetition algorithm
  const updateProficiencyLevel = async (progressId, currentLevel, wasCorrect) => {
    if (!user) return;
    
    try {
      let newLevel = currentLevel;
      
      if (wasCorrect) {
        // Progress to next level if answered correctly (max level 5)
        newLevel = Math.min(currentLevel + 1, 5);
      } else {
        // Move back a level if answered incorrectly (min level 0)
        newLevel = Math.max(currentLevel - 1, 0);
      }
      
      // Calculate next review date based on spaced repetition interval
      const interval = SPACED_REPETITION_INTERVALS[newLevel];
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + interval);
      
      // Update the database
      await supabase
        .from('student_vocabulary_progress')
        .update({
          proficiency_level: newLevel,
          correct_answers: wasCorrect 
            ? supabase.rpc('increment', { x: 1 }) 
            : undefined,
          incorrect_answers: !wasCorrect 
            ? supabase.rpc('increment', { x: 1 }) 
            : undefined,
          last_practiced: new Date().toISOString(),
          next_review: nextReview.toISOString()
        })
        .eq('id', progressId);
        
    } catch (error) {
      console.error('Error updating proficiency level:', error);
    }
  };
  
  // Move to next card
  const nextCard = () => {
    if (currentItemIndex < practiceItems.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
      setShowAnswer(false);
      setIsCorrect(null);
      setUserAnswer('');
    } else {
      // Practice session complete
      setPracticeComplete(true);
    }
  };
  
  // Handle flashcard reveal
  const handleFlashcardReveal = (knewIt) => {
    setIsCorrect(knewIt);
    setShowAnswer(true);
    
    // Update stats
    setStats(prev => ({
      correct: prev.correct + (knewIt ? 1 : 0),
      incorrect: prev.incorrect + (knewIt ? 0 : 1)
    }));
    
    // Update proficiency level
    if (practiceItems.length > 0) {
      const currentItem = practiceItems[currentItemIndex];
      updateProficiencyLevel(currentItem.progressId, currentItem.proficiencyLevel, knewIt);
    }
  };
  
  // Restart practice
  const restartPractice = () => {
    setPracticeComplete(false);
    setCurrentItemIndex(0);
    setShowAnswer(false);
    setIsCorrect(null);
    setUserAnswer('');
    setStats({ correct: 0, incorrect: 0 });
    
    // Reshuffle items
    setPracticeItems(prev => [...prev].sort(() => Math.random() - 0.5));
  };
  
  // Change practice mode
  const changePracticeMode = (mode) => {
    setPracticeMode(mode);
    setShowAnswer(false);
    setIsCorrect(null);
    setUserAnswer('');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (practiceItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/student-dashboard/vocabulary" className="inline-flex items-center text-indigo-600 mb-6">
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Vocabulary
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No Vocabulary to Practice</h2>
          <p className="text-gray-600 mb-6">
            There are no vocabulary items available for practice. Start learning new vocabulary to build your collection.
          </p>
          <Link 
            href="/student-dashboard/vocabulary" 
            className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Return to Vocabulary Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  if (practiceComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/student-dashboard/vocabulary" className="inline-flex items-center text-indigo-600 mb-6">
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Vocabulary
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Practice Complete!</h2>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
            <div className="bg-green-100 rounded-lg p-6 text-center flex-1">
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.correct}</div>
              <div className="text-green-800">Correct</div>
            </div>
            
            <div className="bg-red-100 rounded-lg p-6 text-center flex-1">
              <div className="text-4xl font-bold text-red-600 mb-2">{stats.incorrect}</div>
              <div className="text-red-800">Incorrect</div>
            </div>
            
            <div className="bg-blue-100 rounded-lg p-6 text-center flex-1">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100)}%
              </div>
              <div className="text-blue-800">Accuracy</div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={restartPractice}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 flex items-center"
            >
              <RotateCw className="mr-2 h-5 w-5" /> Practice Again
            </button>
            
            <Link 
              href="/student-dashboard/vocabulary" 
              className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 flex items-center"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const currentItem = practiceItems[currentItemIndex];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/student-dashboard/vocabulary" className="inline-flex items-center text-indigo-600">
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Vocabulary
        </Link>
        
        <div className="flex gap-2">
          <button 
            onClick={() => changePracticeMode(PRACTICE_MODES.FLASHCARD)}
            className={`px-3 py-1 rounded-md text-sm ${
              practiceMode === PRACTICE_MODES.FLASHCARD 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Flashcards
          </button>
          
          <button 
            onClick={() => changePracticeMode(PRACTICE_MODES.MULTIPLE_CHOICE)}
            className={`px-3 py-1 rounded-md text-sm ${
              practiceMode === PRACTICE_MODES.MULTIPLE_CHOICE 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Multiple Choice
          </button>
          
          <button 
            onClick={() => changePracticeMode(PRACTICE_MODES.TYPING)}
            className={`px-3 py-1 rounded-md text-sm ${
              practiceMode === PRACTICE_MODES.TYPING 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Typing
          </button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Progress counter */}
      <div className="text-right text-sm text-gray-600 mb-4">
        {currentItemIndex + 1} of {practiceItems.length}
      </div>
      
      {/* Practice card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="p-6 md:p-8">
          {/* Term with audio button if available */}
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-3xl font-bold text-center">{currentItem.term}</h2>
            {currentItem.audioUrl && (
              <button 
                onClick={playAudio}
                className="ml-3 text-indigo-600 hover:text-indigo-800"
              >
                <Volume2 className="h-6 w-6" />
              </button>
            )}
          </div>
          
          {/* Image if available */}
          {currentItem.imageUrl && (
            <div className="flex justify-center mb-6">
              <img 
                src={currentItem.imageUrl} 
                alt={currentItem.term} 
                className="max-h-40 object-contain rounded-md"
              />
            </div>
          )}
          
          {/* Practice mode content */}
          <AnimatePresence mode="wait">
            {practiceMode === PRACTICE_MODES.FLASHCARD && (
              <div className="space-y-6">
                {showAnswer ? (
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center"
                  >
                    <div className="text-2xl mb-4">{currentItem.translation}</div>
                    
                    {currentItem.exampleSentence && (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="italic text-gray-700 mb-2">{currentItem.exampleSentence}</p>
                        {currentItem.exampleTranslation && (
                          <p className="text-gray-500">{currentItem.exampleTranslation}</p>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={nextCard}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                      >
                        Next Card
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="question"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex flex-col items-center"
                  >
                    <p className="text-gray-600 mb-6 text-center">Do you know this word?</p>
                    
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleFlashcardReveal(false)}
                        className="bg-red-100 text-red-700 px-6 py-3 rounded-md hover:bg-red-200 flex items-center"
                      >
                        <ThumbsDown className="mr-2 h-5 w-5" /> Don't know
                      </button>
                      
                      <button
                        onClick={() => handleFlashcardReveal(true)}
                        className="bg-green-100 text-green-700 px-6 py-3 rounded-md hover:bg-green-200 flex items-center"
                      >
                        <ThumbsUp className="mr-2 h-5 w-5" /> Know it
                      </button>
                    </div>
                    
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="mt-6 text-indigo-600 underline hover:text-indigo-800"
                    >
                      Show Answer
                    </button>
                  </motion.div>
                )}
              </div>
            )}
            
            {practiceMode === PRACTICE_MODES.MULTIPLE_CHOICE && (
              <div className="space-y-6">
                <p className="text-gray-600 mb-6 text-center">Select the correct translation:</p>
                
                <div className="grid grid-cols-1 gap-3">
                  {options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => checkAnswer(option, true)}
                      disabled={showAnswer}
                      className={`p-4 rounded-md text-left ${
                        showAnswer
                          ? option.isCorrect
                            ? 'bg-green-100 border-2 border-green-500'
                            : isCorrect === false && options[index] === option
                              ? 'bg-red-100 border-2 border-red-500'
                              : 'bg-gray-100 text-gray-500'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center">
                        {showAnswer && option.isCorrect && (
                          <Check className="text-green-600 mr-2 h-5 w-5" />
                        )}
                        {showAnswer && !option.isCorrect && isCorrect === false && options[index] === option && (
                          <X className="text-red-600 mr-2 h-5 w-5" />
                        )}
                        {option.text}
                      </div>
                    </button>
                  ))}
                </div>
                
                {showAnswer && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={nextCard}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Next Card
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {practiceMode === PRACTICE_MODES.TYPING && (
              <div className="space-y-6">
                <p className="text-gray-600 mb-6 text-center">Type the translation:</p>
                
                <div>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={showAnswer}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !showAnswer) {
                        checkAnswer(userAnswer);
                      }
                    }}
                    className={`w-full p-3 border rounded-md ${
                      showAnswer
                        ? isCorrect
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                    }`}
                    placeholder="Type translation here..."
                    autoFocus
                  />
                  
                  {showAnswer && (
                    <div className={`mt-3 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrect ? 'Correct!' : `Correct answer: ${currentItem.translation}`}
                    </div>
                  )}
                </div>
                
                {!showAnswer ? (
                  <div className="flex justify-center">
                    <button
                      onClick={() => checkAnswer(userAnswer)}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Check Answer
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <button
                      onClick={nextCard}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Next Card
                    </button>
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 