'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { supabase } from '../../../../lib/supabase';
import { ArrowLeft, ArrowRight, Check, X, Volume2, Bookmark, BookmarkCheck } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

// Define types for our data
type Word = {
  id: string;
  term: string;
  definition: string;
  example?: string;
  mastered: boolean;
};

type WordList = {
  id: string;
  name: string;
  description: string;
  words: Word[];
  progress: number;
  assigned_by?: string;
  due_date?: string;
};

// Learning modes
type Mode = 'browse' | 'flashcards' | 'quiz' | 'match';

type VocabularyListParams = {
  listId: string
};

export default function VocabularyListPage({ params }: { params: { listId: string } }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [vocabularyList, setVocabularyList] = useState<VocabularyList | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [mode, setMode] = useState<Mode>('browse');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [matchPairs, setMatchPairs] = useState<MatchPair[]>([]);
  const [selectedMatchPair, setSelectedMatchPair] = useState<SelectedMatchPair | null>(null);
  const [completedPairs, setCompletedPairs] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  
  const listId = params.listId;
  
  useEffect(() => {
    async function fetchWordList() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // For demo purposes, using mock data
        // In a real app, we would fetch this from Supabase
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockList: WordList = {
          id: params.listId,
          name: "Essential Verbs - Beginner Level",
          description: "A collection of the most common verbs for beginner English learners",
          progress: 45,
          assigned_by: "Teacher Smith",
          due_date: "2023-11-15T23:59:59Z",
          words: [
            {
              id: "w1",
              term: "go",
              definition: "to move or travel to a place",
              example: "I go to school every day.",
              mastered: true
            },
            {
              id: "w2",
              term: "eat",
              definition: "to put food in your mouth and swallow it",
              example: "We eat dinner at 7 PM.",
              mastered: true
            },
            {
              id: "w3",
              term: "sleep",
              definition: "to rest with your eyes closed and your mind and body not awake",
              example: "Children should sleep for at least 8 hours.",
              mastered: false
            },
            {
              id: "w4",
              term: "work",
              definition: "to do an activity involving physical or mental effort",
              example: "My father works in a hospital.",
              mastered: false
            },
            {
              id: "w5",
              term: "read",
              definition: "to look at and understand written words",
              example: "She likes to read books before bedtime.",
              mastered: false
            },
            {
              id: "w6",
              term: "write",
              definition: "to make letters or numbers on a surface",
              example: "Please write your name at the top of the page.",
              mastered: false
            },
            {
              id: "w7",
              term: "speak",
              definition: "to say words to express thoughts, opinions, or feelings",
              example: "He speaks three languages fluently.",
              mastered: false
            },
            {
              id: "w8",
              term: "listen",
              definition: "to pay attention to something you can hear",
              example: "We listened to the teacher's instructions carefully.",
              mastered: false
            }
          ]
        };
        
        setVocabularyList(mockList);
        setWords(mockList.words);
      } catch (error) {
        console.error('Error fetching word list:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchWordList();
  }, [params.listId, user]);
  
  const toggleWordMastery = (wordId: string) => {
    if (!vocabularyList) return;
    
    setVocabularyList({
      ...vocabularyList,
      words: vocabularyList.words.map(word => 
        word.id === wordId 
          ? { ...word, mastered: !word.mastered } 
          : word
      ),
      progress: calculateProgress(vocabularyList.words.map(word => 
        word.id === wordId 
          ? { ...word, mastered: !word.mastered } 
          : word
      ))
    });
  };
  
  const calculateProgress = (words: Word[]): number => {
    if (words.length === 0) return 0;
    const mastered = words.filter(word => word.mastered).length;
    return Math.round((mastered / words.length) * 100);
  };
  
  const nextCard = () => {
    if (!vocabularyList) return;
    setShowTranslation(false);
    setCurrentCardIndex((currentCardIndex + 1) % vocabularyList.words.length);
  };
  
  const prevCard = () => {
    if (!vocabularyList) return;
    setShowTranslation(false);
    setCurrentCardIndex((currentCardIndex - 1 + vocabularyList.words.length) % vocabularyList.words.length);
  };
  
  const handleQuizSubmit = () => {
    if (!vocabularyList) return;
    
    let correct = 0;
    vocabularyList.words.forEach(word => {
      if (quizAnswers[word.id]?.toLowerCase().trim() === word.term.toLowerCase().trim()) {
        correct++;
      }
    });
    
    const score = Math.round((correct / vocabularyList.words.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
  };
  
  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };
  
  // Function to speak the term using browser's speech synthesis
  const speakWord = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }
  
  if (!vocabularyList) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Word List Not Found</h2>
        <p className="text-gray-300 mb-6">The vocabulary list you're looking for doesn't exist or you don't have access to it.</p>
        <Link 
          href="/dashboard/vocabulary" 
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Vocabulary Lists
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <Link 
          href="/dashboard/vocabulary" 
          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to All Lists
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">{vocabularyList.name}</h1>
        <p className="text-gray-300">{vocabularyList.description}</p>
        
        {vocabularyList.assigned_by && vocabularyList.due_date && (
          <div className="mt-2 text-sm text-gray-400">
            Assigned by {vocabularyList.assigned_by} • Due {new Date(vocabularyList.due_date).toLocaleDateString()}
          </div>
        )}
        
        <div className="mt-4 flex flex-wrap items-center">
          <div className="mr-4 mb-2">
            <div className="text-sm font-medium text-gray-300">{vocabularyList.progress}% mastered</div>
            <div className="w-48 bg-indigo-950/50 rounded-full h-2 mt-1">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" 
                style={{ width: `${vocabularyList.progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-sm text-gray-400">
            {vocabularyList.words.filter(w => w.mastered).length} of {vocabularyList.words.length} words mastered
          </div>
        </div>
      </div>
      
      {/* Study Mode Selector */}
      <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-4 mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMode('browse')}
            className={`px-4 py-2 rounded-md ${mode === 'browse' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-800/40 text-gray-300 hover:bg-indigo-700/40'}`}
          >
            Browse All
          </button>
          <button
            onClick={() => setMode('flashcards')}
            className={`px-4 py-2 rounded-md ${mode === 'flashcards' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-800/40 text-gray-300 hover:bg-indigo-700/40'}`}
          >
            Flashcards
          </button>
          <button
            onClick={() => { setMode('quiz'); resetQuiz(); }}
            className={`px-4 py-2 rounded-md ${mode === 'quiz' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-800/40 text-gray-300 hover:bg-indigo-700/40'}`}
          >
            Quiz
          </button>
        </div>
      </div>
      
      {/* Browse Mode */}
      {mode === 'browse' && (
        <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">All Words</h2>
          
          <div className="space-y-4">
            {vocabularyList.words.map(word => (
              <div 
                key={word.id} 
                className={`p-4 rounded-lg ${word.mastered 
                  ? 'bg-green-900/20 border border-green-800' 
                  : 'bg-indigo-800/30'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-white mr-2">{word.term}</h3>
                      <button 
                        onClick={() => speakWord(word.term)} 
                        className="text-cyan-400 hover:text-cyan-300"
                        aria-label="Pronounce word"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-gray-300 mt-1">{word.definition}</p>
                    {word.example && (
                      <p className="text-gray-400 text-sm mt-2 italic">"{word.example}"</p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => toggleWordMastery(word.id)}
                    className={`flex items-center px-3 py-1 rounded-md ${
                      word.mastered 
                        ? 'bg-green-600/30 text-green-300 hover:bg-green-600/40' 
                        : 'bg-indigo-700/30 text-gray-300 hover:bg-indigo-700/50'
                    }`}
                  >
                    {word.mastered ? (
                      <>
                        <BookmarkCheck className="h-4 w-4 mr-1" />
                        Mastered
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4 mr-1" />
                        Mark as Mastered
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Flashcard Mode */}
      {mode === 'flashcards' && vocabularyList.words.length > 0 && (
        <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Flashcards</h2>
          
          <div className="flex justify-center mb-6">
            <div className="text-gray-300">
              Card {currentCardIndex + 1} of {vocabularyList.words.length}
            </div>
          </div>
          
          <div 
            className="bg-indigo-800/40 rounded-lg p-8 min-h-[300px] flex flex-col items-center justify-center cursor-pointer mx-auto max-w-xl"
            onClick={() => setShowTranslation(!showTranslation)}
          >
            {!showTranslation ? (
              <>
                <h3 className="text-2xl font-bold text-white mb-4">{vocabularyList.words[currentCardIndex].term}</h3>
                <p className="text-cyan-400 text-sm">Click to reveal definition</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); speakWord(vocabularyList.words[currentCardIndex].term); }} 
                  className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-300"
                  aria-label="Pronounce word"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-medium text-white mb-2">{vocabularyList.words[currentCardIndex].term}</h3>
                <p className="text-gray-300 text-center mb-4">{vocabularyList.words[currentCardIndex].definition}</p>
                {vocabularyList.words[currentCardIndex].example && (
                  <p className="text-gray-400 text-sm italic text-center">"{vocabularyList.words[currentCardIndex].example}"</p>
                )}
                <p className="text-cyan-400 text-sm mt-4">Click to see term</p>
              </>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevCard}
              className="flex items-center px-4 py-2 bg-indigo-700/40 hover:bg-indigo-700/60 text-white rounded-md"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>
            
            <button
              onClick={() => toggleWordMastery(vocabularyList.words[currentCardIndex].id)}
              className={`flex items-center px-4 py-2 rounded-md ${
                vocabularyList.words[currentCardIndex].mastered 
                  ? 'bg-green-600/30 text-green-300 hover:bg-green-600/40' 
                  : 'bg-indigo-700/30 text-gray-300 hover:bg-indigo-700/50'
              }`}
            >
              {vocabularyList.words[currentCardIndex].mastered ? (
                <>
                  <BookmarkCheck className="h-4 w-4 mr-1" />
                  Mastered
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 mr-1" />
                  Mark as Mastered
                </>
              )}
            </button>
            
            <button
              onClick={nextCard}
              className="flex items-center px-4 py-2 bg-indigo-700/40 hover:bg-indigo-700/60 text-white rounded-md"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      )}
      
      {/* Quiz Mode */}
      {mode === 'quiz' && (
        <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Quiz Yourself</h2>
          
          {!quizSubmitted ? (
            <>
              <p className="text-gray-300 mb-6">
                Type in the correct term for each definition. Try to recall as many words as you can!
              </p>
              
              <div className="space-y-6">
                {vocabularyList.words.map((word, index) => (
                  <div key={word.id} className="bg-indigo-800/30 rounded-lg p-4">
                    <div className="mb-2">
                      <span className="text-gray-400 text-sm">#{index + 1}</span>
                    </div>
                    <p className="text-white mb-4">{word.definition}</p>
                    {word.example && (
                      <p className="text-gray-400 text-sm mb-4 italic">"{word.example}"</p>
                    )}
                    
                    <div>
                      <label htmlFor={`answer-${word.id}`} className="sr-only">Your answer</label>
                      <input
                        id={`answer-${word.id}`}
                        type="text"
                        value={quizAnswers[word.id] || ''}
                        onChange={e => setQuizAnswers({...quizAnswers, [word.id]: e.target.value})}
                        placeholder="Type your answer..."
                        className="w-full px-3 py-2 border border-indigo-700 rounded-md bg-indigo-800/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleQuizSubmit}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                >
                  Submit Answers
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-800/50 mb-4">
                  <span className="text-3xl font-bold text-white">{quizScore}%</span>
                </div>
                <h3 className="text-xl font-medium text-white">
                  {quizScore >= 90 ? 'Excellent!' : 
                   quizScore >= 70 ? 'Good job!' : 
                   quizScore >= 50 ? 'Keep practicing!' : 
                   'Don\'t give up!'}
                </h3>
              </div>
              
              <div className="space-y-4 mb-8">
                {vocabularyList.words.map(word => {
                  const userAnswer = quizAnswers[word.id] || '';
                  const isCorrect = userAnswer.toLowerCase().trim() === word.term.toLowerCase().trim();
                  
                  return (
                    <div 
                      key={word.id} 
                      className={`p-4 rounded-lg ${isCorrect 
                        ? 'bg-green-900/20 border border-green-800' 
                        : 'bg-red-900/20 border border-red-800'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-1">
                            {isCorrect ? (
                              <Check className="h-5 w-5 text-green-400 mr-2" />
                            ) : (
                              <X className="h-5 w-5 text-red-400 mr-2" />
                            )}
                            <p className="text-gray-300">{word.definition}</p>
                          </div>
                          
                          <div className="mt-2">
                            <span className="text-gray-400 text-sm mr-2">Correct answer:</span>
                            <span className="text-white font-medium">{word.term}</span>
                          </div>
                          
                          {!isCorrect && (
                            <div className="mt-1">
                              <span className="text-gray-400 text-sm mr-2">Your answer:</span>
                              <span className="text-red-300">{userAnswer || '(no answer)'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setMode('browse')}
                  className="px-6 py-2 bg-indigo-700/40 hover:bg-indigo-700/60 text-white rounded-md"
                >
                  Review Words
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 