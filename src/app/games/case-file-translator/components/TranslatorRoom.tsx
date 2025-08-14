'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileText, CheckCircle, Languages, Clock } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { VOCABULARY_CATEGORIES } from '../../../../components/games/ModernCategorySelector';
import { StandardVocabularyItem, AssignmentData, GameProgress } from '../../../../components/games/templates/GameAssignmentWrapper';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface TranslationSentence {
  id: string;
  source_sentence: string;
  english_translation: string;
  case_context: string;
  detective_prompt: string;
  case_difficulty: number;
  word_count: number;
  complexity_score: number;
}

interface CaseGameProgress {
  correctAnswers: number;
  totalQuestions: number;
  score: number;
  timeSpent: number;
  accuracy: number;
  completedAt: string | null;
}

interface TranslatorRoomProps {
  caseType: string;
  subcategory: string | null;
  language: string;
  onGameComplete: (progress: CaseGameProgress) => void;
  onBack: () => void;
  assignmentMode?: {
    assignment: AssignmentData;
    vocabulary: StandardVocabularyItem[];
    onProgressUpdate: (progress: Partial<GameProgress>) => void;
    onGameComplete: (finalProgress: GameProgress) => void;
  };
  gameSessionId?: string | null;
  gameService?: EnhancedGameService | null;
}

export default function TranslatorRoom({
  caseType,
  subcategory,
  language,
  onGameComplete,
  onBack,
  assignmentMode,
  gameSessionId,
  gameService
}: TranslatorRoomProps) {
  // Initialize FSRS spaced repetition system

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [sentences, setSentences] = useState<TranslationSentence[]>([]);
  const [userTranslation, setUserTranslation] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameStartTime] = useState(Date.now());
  const [translationStartTime, setTranslationStartTime] = useState<number>(0);
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);
  
  const [gameProgress, setGameProgress] = useState({
    correctAnswers: 0,
    totalSentences: 10,
    translationsCompleted: [] as TranslationSentence[],
    startTime: Date.now()
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Map language codes for database queries
  const mapLanguageForDB = (lang: string): string => {
    const mapping: { [key: string]: string } = {
      'es': 'spanish',
      'fr': 'french', 
      'de': 'german'
    };
    return mapping[lang] || lang;
  };

  // Initialize background music
  useEffect(() => {
    const music = new Audio('/audio/detective-listening/background-music.mp3');
    music.loop = true;
    music.volume = 0.3;
    setBackgroundMusic(music);

    return () => {
      if (music) {
        music.pause();
        music.currentTime = 0;
      }
    };
  }, []);

  // Start background music on first user interaction
  const ensureBackgroundMusic = async () => {
    if (backgroundMusic && backgroundMusic.paused) {
      try {
        await backgroundMusic.play();
      } catch (error) {
        console.log('Background music autoplay prevented:', error);
      }
    }
  };

  // Load sentences from database
  useEffect(() => {
    const loadSentences = async () => {
      try {
        setLoading(true);
        setError(null);

        const dbLanguage = mapLanguageForDB(language);
        
        let query = supabase
          .from('sentences')
          .select('*')
          .eq('source_language', dbLanguage)
          .eq('is_active', true)
          .eq('is_public', true);

        // Add category filter
        if (caseType) {
          query = query.eq('category', caseType);
        }

        // Add subcategory filter if specified
        if (subcategory) {
          query = query.eq('subcategory', subcategory);
        }

        // Limit to 10 sentences and randomize
        query = query.limit(10);

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        if (!data || data.length === 0) {
          throw new Error('No translation sentences found for this category and language combination.');
        }

        // Shuffle the sentences for variety
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setSentences(shuffled);
        setGameProgress(prev => ({ ...prev, totalSentences: shuffled.length }));

      } catch (err) {
        console.error('Error loading sentences:', err);
        setError(err instanceof Error ? err.message : 'Failed to load translation sentences');
      } finally {
        setLoading(false);
      }
    };

    if (language && caseType) {
      loadSentences();
    }
  }, [language, caseType, subcategory]);

  // Set translation start time when sentence changes
  useEffect(() => {
    if (sentences.length > 0 && !showFeedback) {
      setTranslationStartTime(Date.now());
    }
  }, [currentSentenceIndex, sentences.length, showFeedback]);

  // Focus textarea when sentence changes
  useEffect(() => {
    if (textareaRef.current && !showFeedback) {
      textareaRef.current.focus();
    }
  }, [currentSentenceIndex, showFeedback]);

  // Play sound effects
  const playSound = async (soundType: 'correct' | 'incorrect' | 'complete') => {
    try {
      let audioPath = '';
      switch (soundType) {
        case 'correct':
          audioPath = '/audio/detective-listening/correct-answer.mp3';
          break;
        case 'incorrect':
          audioPath = '/audio/detective-listening/wrong-answer.mp3';
          break;
        case 'complete':
          audioPath = '/audio/detective-listening/case-solved.mp3';
          break;
      }
      
      const audio = new Audio(audioPath);
      audio.volume = 0.5;
      await audio.play();
    } catch (error) {
      console.log('Sound effect failed to play:', error);
    }
  };

  // Check if translation is correct (flexible matching)
  const checkTranslation = (userInput: string, correctTranslation: string): boolean => {
    const normalize = (text: string) => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[.,!?;:]/g, '') // Remove punctuation
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/\b(a|an|the)\b/g, '') // Remove articles (optional)
        .trim();
    };

    const normalizedUser = normalize(userInput);
    const normalizedCorrect = normalize(correctTranslation);

    // Exact match
    if (normalizedUser === normalizedCorrect) return true;

    // Check if user translation contains most key words (70% threshold)
    const correctWords = normalizedCorrect.split(' ').filter(word => word.length > 2);
    const userWords = normalizedUser.split(' ');
    
    const matchingWords = correctWords.filter(word => 
      userWords.some(userWord => 
        userWord.includes(word) || word.includes(userWord)
      )
    );

    return matchingWords.length >= Math.ceil(correctWords.length * 0.7);
  };

  const handleSubmitTranslation = async () => {
    if (!userTranslation.trim()) return;

    await ensureBackgroundMusic();

    const currentSentence = sentences[currentSentenceIndex];
    const correct = checkTranslation(userTranslation, currentSentence.english_translation);
    const responseTime = translationStartTime > 0 ? Date.now() - translationStartTime : 0;

    // Record translation practice with FSRS system (works in both assignment and free play modes)
    if (currentSentence) {
      try {
        // Extract key words from the sentence for FSRS tracking
        const sourceWords = currentSentence.source_sentence
          .toLowerCase()
          .replace(/[.,!?;:]/g, '')
          .split(' ')
          .filter(word => word.length > 2); // Focus on meaningful words

        // Record practice for each significant word in the sentence
        for (const word of sourceWords.slice(0, 3)) { // Limit to first 3 words to avoid spam
          // Create a safe ID by hashing the word to avoid special characters
          const wordHash = btoa(word).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
          const wordData = {
            id: `case-file-${currentSentence.id}-${wordHash}`,
            word: word,
            translation: currentSentence.english_translation, // Full translation as context
            language: language === 'spanish' ? 'es' : language === 'french' ? 'fr' : 'en'
          };

          // Calculate confidence based on translation accuracy and complexity
          let confidence = 0.6; // Base confidence for translation tasks

          if (correct) {
            confidence += 0.2; // Bonus for correct translation

            // Bonus for speed (translations should be thoughtful, not rushed)
            if (responseTime > 10000 && responseTime < 60000) {
              confidence += 0.1; // Sweet spot for translation time
            }

            // Bonus for sentence complexity
            if (currentSentence.complexity_score && currentSentence.complexity_score > 3) {
              confidence += 0.1; // Bonus for complex sentences
            }
          } else {
            confidence = 0.2; // Lower confidence for incorrect translations
          }

          confidence = Math.max(0.1, Math.min(0.95, confidence));

          // Record practice with FSRS

          if (fsrsResult) {
            console.log(`FSRS recorded for case-file word "${word}":`, {
              algorithm: fsrsResult.algorithm,
              points: fsrsResult.points,
              nextReview: fsrsResult.nextReviewDate,
              interval: fsrsResult.interval,
              masteryLevel: fsrsResult.masteryLevel
            });
          }
        }
      } catch (error) {
        console.error('Error recording FSRS practice for case-file-translator:', error);
      }
    }

    // Record sentence translation attempt using new gems system
    if (gameSessionId) {
      try {
        const sessionService = new EnhancedGameSessionService();
        await sessionService.recordSentenceAttempt(gameSessionId, 'case-file-translator', {
          sentenceId: currentSentence.id, // ✅ FIXED: Use sentence ID for sentence-based tracking
          sourceText: currentSentence.source_sentence,
          targetText: currentSentence.english_translation,
          responseTimeMs: responseTime,
          wasCorrect: correct,
          hintUsed: false,
          streakCount: correctTranslations,
          masteryLevel: correct ? 2 : 0,
          maxGemRarity: 'epic', // Allow epic gems for translation work
          gameMode: 'sentence_translation',
          difficultyLevel: currentSentence.complexity_score > 3 ? 'advanced' : 'intermediate',
          skipSpacedRepetition: true, // Skip SRS - FSRS is handling spaced repetition
          contextData: {
            caseContext: currentSentence.case_context,
            wordCount: currentSentence.word_count,
            complexityScore: currentSentence.complexity_score,
            userTranslation: userTranslation.trim(),
            translationType: 'sentence_translation'
          }
        });
      } catch (error) {
        console.error('Error recording word attempt:', error);
      }
    }

    setIsCorrect(correct);
    setShowFeedback(true);

    // Play sound effect
    await playSound(correct ? 'correct' : 'incorrect');

    // Update progress
    setGameProgress(prev => ({
      ...prev,
      correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
      translationsCompleted: [...prev.translationsCompleted, currentSentence]
    }));

    // Update assignment progress if in assignment mode
    if (assignmentMode) {
      const correctCount = correct ? gameProgress.correctAnswers + 1 : gameProgress.correctAnswers;
      const progress: Partial<GameProgress> = {
        wordsCompleted: correctCount,
        totalWords: gameProgress.totalSentences,
        score: Math.round((correctCount / gameProgress.totalSentences) * 100),
        timeSpent: Math.floor((Date.now() - gameStartTime) / 1000),
        accuracy: (correctCount / (currentSentenceIndex + 1)) * 100
      };
      assignmentMode.onProgressUpdate(progress);
    }
  };

  const handleNextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
      setUserTranslation('');
      setShowFeedback(false);
      setIsCorrect(false);
    } else {
      // Game complete
      handleGameComplete();
    }
  };

  const handleGameComplete = async () => {
    await playSound('complete');
    
    const finalProgress: CaseGameProgress = {
      correctAnswers: gameProgress.correctAnswers,
      totalQuestions: gameProgress.totalSentences,
      score: Math.round((gameProgress.correctAnswers / gameProgress.totalSentences) * 100),
      timeSpent: Math.floor((Date.now() - gameStartTime) / 1000),
      accuracy: (gameProgress.correctAnswers / gameProgress.totalSentences) * 100,
      completedAt: new Date().toISOString()
    };

    if (assignmentMode) {
      const assignmentProgress: GameProgress = {
        assignmentId: assignmentMode.assignment.id,
        gameId: 'case-file-translator',
        studentId: '',
        wordsCompleted: finalProgress.correctAnswers,
        totalWords: finalProgress.totalQuestions,
        score: finalProgress.score,
        maxScore: 100,
        timeSpent: finalProgress.timeSpent,
        accuracy: finalProgress.accuracy,
        completedAt: new Date(),
        sessionData: finalProgress
      };
      assignmentMode.onGameComplete(assignmentProgress);
    }

    onGameComplete(finalProgress);
  };

  // Get category info for display
  const categoryInfo = VOCABULARY_CATEGORIES.find(cat => cat.id === caseType);
  const subcategoryInfo = categoryInfo?.subcategories.find(sub => sub.id === subcategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-400 text-lg">Loading intercepted communications...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-900/20 border border-red-500 rounded-lg p-8 max-w-md mx-auto text-center"
        >
          <div className="text-red-400 text-6xl mb-4">📁</div>
          <h2 className="text-red-400 text-xl font-bold mb-4">Case File Error</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <button
            onClick={onBack}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Return to Case Selection
          </button>
        </motion.div>
      </div>
    );
  }

  const currentSentence = sentences[currentSentenceIndex];
  const progress = ((currentSentenceIndex + 1) / sentences.length) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image - more prominent */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/games/detective-listening/detective-office-bg.jpg)' }}
      />
      
      {/* Very light overlay - let background show through */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Compact Header */}
      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors bg-black/40 px-3 py-1 rounded-lg backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cases
          </button>
          
          <div className="text-center bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm">
            <h1 className="text-xl font-bold text-amber-400">Case File Translator</h1>
            <p className="text-amber-300/70 text-xs">
              {categoryInfo?.name} • {currentSentenceIndex + 1}/{sentences.length} • {gameProgress.correctAnswers} correct
            </p>
          </div>

          <div className="bg-black/40 px-3 py-2 rounded-lg backdrop-blur-sm">
            <div className="w-24 bg-slate-700 rounded-full h-1 mb-1">
              <motion.div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="text-amber-300 text-xs text-center">{Math.round(progress)}%</div>
          </div>
        </div>
      </div>

      {/* Main Content - Moved Down */}
      <div className="relative z-10 px-6 pb-6 mt-16">
        <div className="max-w-6xl mx-auto flex gap-6">
          {/* Case File Document */}
          <motion.div
            key={currentSentenceIndex}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 max-w-lg"
          >
            <div className="bg-white/95 backdrop-blur-sm border-2 border-amber-200 shadow-xl rounded-lg p-6 relative min-h-[400px]">
              {/* Document header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-300">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-800" />
                  <span className="text-amber-800 font-bold">CASE FILE #{currentSentenceIndex + 1}</span>
                </div>
                <div className="text-amber-700 text-sm">CLASSIFIED</div>
              </div>

              {/* Case context */}
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800 mb-2">INTERCEPTED COMMUNICATION</h2>
                <p className="text-gray-600 text-sm">{currentSentence.case_context}</p>
              </div>

              {/* Detective briefing */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="text-yellow-600 font-bold text-sm mb-1">DETECTIVE BRIEFING:</div>
                <p className="text-gray-700 text-sm">{currentSentence.detective_prompt}</p>
              </div>

              {/* Intercepted message */}
              <div className="bg-gray-50 border-2 border-gray-300 p-4 relative">
                <div className="absolute -top-2 left-4 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
                  INTERCEPTED
                </div>
                <div className="mt-2">
                  <div className="text-gray-500 text-xs mb-2">Original Message:</div>
                  <p className="text-gray-800 text-lg font-mono leading-relaxed border-l-4 border-blue-500 pl-4">
                    "{currentSentence.source_sentence}"
                  </p>
                </div>
              </div>

              {/* Translation required stamp */}
              <div className="absolute bottom-4 right-4 transform rotate-12">
                <div className="border-4 border-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <div className="text-red-600 font-bold text-center">
                    <div className="text-sm">TRANSLATION</div>
                    <div className="text-sm">REQUIRED</div>
                  </div>
                </div>
              </div>

              {/* Paper texture overlay */}
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-gradient-to-br from-gray-400 via-transparent to-gray-400 rounded-lg"></div>
            </div>
          </motion.div>

          {/* Translation Workstation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 max-w-lg space-y-4"
          >
            {/* Workstation header */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Languages className="h-6 w-6 text-amber-400" />
                <div>
                  <h3 className="text-amber-400 font-bold">Translation Workstation</h3>
                  <p className="text-amber-300/70 text-sm">Decode the intercepted message</p>
                </div>
              </div>
            </div>

            {/* Translation input area */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600 rounded-lg p-6">
              <label className="block text-amber-400 font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                English Translation:
              </label>
              
              <div className="relative mb-4">
                <textarea
                  ref={textareaRef}
                  value={userTranslation}
                  onChange={(e) => setUserTranslation(e.target.value)}
                  placeholder="Enter your English translation of the intercepted message..."
                  className="w-full h-32 bg-white/95 border-2 border-gray-300 rounded-lg p-4 text-gray-800 placeholder-gray-500 resize-none focus:outline-none focus:border-amber-500 transition-colors font-mono text-lg leading-relaxed"
                  disabled={showFeedback}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey && !showFeedback) {
                      handleSubmitTranslation();
                    }
                  }}
                />
                
                {/* Typing indicator */}
                {userTranslation && !showFeedback && (
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {userTranslation.length} characters
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-slate-400 text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Press Ctrl+Enter to submit
                </div>
                
                {!showFeedback ? (
                  <button
                    onClick={handleSubmitTranslation}
                    disabled={!userTranslation.trim()}
                    className="bg-amber-600 hover:bg-amber-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors font-semibold flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Submit Translation
                  </button>
                ) : (
                  <button
                    onClick={handleNextSentence}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                    {currentSentenceIndex < sentences.length - 1 ? 'Next Case File' : 'Complete Investigation'}
                  </button>
                )}
              </div>
            </div>

            {/* Progress indicator */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-amber-400 font-semibold">Investigation Progress</span>
                <span className="text-amber-300">{currentSentenceIndex + 1} / {sentences.length}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>Evidence Collected: {gameProgress.correctAnswers}</span>
                <span>Accuracy: {Math.round((gameProgress.correctAnswers / (currentSentenceIndex + 1)) * 100) || 0}%</span>
              </div>
            </div>
          </motion.div>
        </div>

      {/* Feedback Modal */}
      <AnimatePresence mode="wait">
        {showFeedback && (
          <motion.div
            key={`feedback-${currentSentenceIndex}-${isCorrect}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleNextSentence();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`max-w-2xl w-full p-8 rounded-xl border-2 ${
                isCorrect 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-red-50 border-red-500'
              } shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className={`text-6xl mb-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {isCorrect ? '✅' : '❌'}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Evidence Secured!' : 'Translation Incomplete'}
                </h3>
                <p className={`text-lg ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect 
                    ? 'Your translation successfully decoded the intercepted message.'
                    : 'The translation needs refinement to extract proper evidence.'
                  }
                </p>
              </div>

              {!isCorrect && (
                <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6">
                  <h4 className="text-gray-800 font-bold mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Correct Translation:
                  </h4>
                  <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-gray-800 font-mono text-lg">
                      "{currentSentence.english_translation}"
                    </p>
                  </div>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={handleNextSentence}
                  className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                    isCorrect 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {currentSentenceIndex < sentences.length - 1 ? 'Continue Investigation' : 'Close Case'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
