'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileText, CheckCircle, Languages, Clock, Gem, Star, Volume2, VolumeX, Settings, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { VOCABULARY_CATEGORIES } from '../../../../components/games/ModernCategorySelector';
import { StandardVocabularyItem, AssignmentData, GameProgress } from '../../../../components/games/templates/GameAssignmentWrapper';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import { useTranslationGame } from '../../../../hooks/useSentenceGame';

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
  onOpenSettings?: () => void;
}

export default function TranslatorRoom({
  caseType,
  subcategory,
  language,
  onGameComplete,
  onBack,
  assignmentMode,
  gameSessionId,
  gameService,
  onOpenSettings
}: TranslatorRoomProps) {
  const router = useRouter();

  // Initialize sentence game service for vocabulary tracking
  const sentenceGame = useTranslationGame(
    gameSessionId || `case-file-${Date.now()}`,
    language
  );

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
  const [showIntroModal, setShowIntroModal] = useState(true);

  // Game settings state
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sentenceAudio, setSentenceAudio] = useState<HTMLAudioElement | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

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

  // Start background music immediately
  const startBackgroundMusic = async () => {
    if (isMuted) {
      console.log('Background music muted');
      return;
    }

    if (backgroundMusic && backgroundMusic.paused) {
      try {
        await backgroundMusic.play();
        console.log('Background music started');
      } catch (error) {
        console.log('Background music autoplay prevented:', error);
      }
    }
  };

  // Handle intro modal start
  const handleStartGame = async () => {
    setShowIntroModal(false);
    await startBackgroundMusic();
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
    if (isMuted) {
      console.log(`Sound ${soundType} muted`);
      return;
    }

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

    const currentSentence = sentences[currentSentenceIndex];
    const correct = checkTranslation(userTranslation, currentSentence.english_translation);
    const responseTime = translationStartTime > 0 ? Date.now() - translationStartTime : 0;

    // Immediately show feedback and play sound - don't wait for vocabulary processing
    setIsCorrect(correct);
    setShowFeedback(true);

    // Play sound effect in background (non-blocking)
    playSound(correct ? 'correct' : 'incorrect').catch(error => 
      console.warn('Sound playback failed:', error)
    );

    // Process sentence with vocabulary tracking system in the background (non-blocking)
    setTimeout(async () => {
      try {
        const result = await sentenceGame.processSentence(
          currentSentence.source_sentence,
          correct,
          responseTime,
          false, // hintUsed
          currentSentence.id
        );

        if (result) {
          console.log(`🎯 Case File Translator: Processed sentence "${currentSentence.source_sentence}"`);
          console.log(`📊 Vocabulary matches: ${result.vocabularyMatches.length}`);
          console.log(`💎 Gems awarded: ${result.totalGems}`);
          console.log(`⭐ XP earned: ${result.totalXP}`);
          console.log(`📈 Coverage: ${result.coveragePercentage}%`);

          // Log individual vocabulary matches
          result.gemsAwarded.forEach((gem, index) => {
            console.log(`  ${index + 1}. "${gem.word}" → ${gem.gemRarity} gem (+${gem.xpAwarded} XP)`);
          });
        }
      } catch (error) {
        console.error('Error processing sentence with vocabulary tracking:', error);
      }
    }, 0);

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

  // Control background music based on mute state
  useEffect(() => {
    if (backgroundMusic) {
      if (isMuted) {
        backgroundMusic.pause();
        console.log('Background music paused due to mute');
      } else {
        // When unmuting, always try to start/restart the music
        backgroundMusic.play().catch(error => {
          console.log('Background music start failed:', error);
        });
        console.log('Background music started due to unmute');
      }
    }
  }, [isMuted, backgroundMusic]);

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
  const progress = sentences.length > 0 ? ((currentSentenceIndex + 1) / sentences.length) * 100 : 0;
  const totalSentences = sentences.length || gameProgress.totalSentences;
  const currentPosition = Math.min(currentSentenceIndex + 1, Math.max(totalSentences, 1));
  const accuracyPercent = currentPosition > 0 ? Math.round((gameProgress.correctAnswers / currentPosition) * 100) : 0;
  const remainingCases = Math.max(totalSentences - currentPosition, 0);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image - more prominent */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/games/detective-listening/detective-office-bg.jpg)' }}
      />
      
      {/* Very light overlay - let background show through */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Top Status Header */}
      <div className="relative z-10 pt-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => {
                  if (assignmentMode) {
                    router.push(`/student-dashboard/assignments/${assignmentMode.assignment.id}`);
                  } else {
                    onBack();
                  }
                }}
                className="flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors bg-black/40 px-3 py-2 rounded-xl backdrop-blur-sm shadow-lg shadow-black/30"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-semibold tracking-wide uppercase">Exit</span>
              </button>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs uppercase tracking-[0.35em] text-amber-300/60">
                  Current Briefing
                </span>
                <span className="text-sm font-semibold text-amber-100">
                  {categoryInfo?.name || 'Custom Case'}
                  {subcategoryInfo ? ` • ${subcategoryInfo.name}` : ''}
                </span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold text-amber-400 tracking-wide">
                Case File Translator
              </h1>
              <p className="text-amber-200/70 text-xs uppercase tracking-[0.3em]">
                Case {currentPosition} of {totalSentences}
              </p>
            </div>

            <div className="flex items-center justify-center lg:justify-end gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="bg-black/40 backdrop-blur-sm text-amber-400 p-2 rounded-xl hover:bg-black/60 transition-colors shadow-lg shadow-black/30"
                aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => onOpenSettings?.()}
                className="bg-black/40 backdrop-blur-sm text-amber-400 px-3 py-2 rounded-xl hover:bg-black/60 transition-colors shadow-lg shadow-black/30 flex items-center gap-2"
                aria-label="Game settings"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium tracking-wide">
                  Settings
                </span>
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-black/30 border border-amber-500/15 px-5 py-4 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-amber-200/80 text-xs uppercase tracking-[0.3em]">
                <Clock className="h-4 w-4" />
                Mission Timeline
              </div>
              <div className="flex flex-wrap justify-end gap-x-6 gap-y-2 text-xs text-amber-200/80 tracking-[0.25em] uppercase">
                <span>Case Files {currentPosition}/{totalSentences}</span>
                <span>Evidence {gameProgress.correctAnswers}</span>
                <span>Accuracy {accuracyPercent}%</span>
              </div>
            </div>
            <div className="mt-3 h-2 bg-slate-900/70 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-12 pt-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl"
          >
            <div className="bg-slate-800/60 backdrop-blur-sm border border-amber-500/40 rounded-2xl px-6 py-5 text-center shadow-xl shadow-black/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <Languages className="h-6 w-6 text-amber-400" />
                  <h3 className="text-amber-300 text-xl font-semibold tracking-wide">
                    Translation Workstation
                  </h3>
                </div>
                <p className="text-amber-200/70 text-sm sm:text-xs uppercase tracking-[0.3em]">
                  Decode intercepted intelligence precisely
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
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

                {/* Translation required stamp - moved to top */}
                <div className="flex justify-center mb-4">
                  <div className="transform -rotate-3">
                    <div className="border-4 border-red-600 bg-red-50 px-4 py-2 rounded-lg shadow-lg">
                      <div className="text-red-600 font-bold text-center">
                        <div className="text-sm">TRANSLATION</div>
                        <div className="text-sm">REQUIRED</div>
                      </div>
                    </div>
                  </div>
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
                <div className="bg-gray-50 border-2 border-gray-300 p-4 relative mb-4">
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

                {/* Paper texture overlay */}
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-gradient-to-br from-gray-400 via-transparent to-gray-400 rounded-lg"></div>
              </div>
            </motion.div>

            {/* Translation Input Area */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 max-w-lg space-y-4"
            >

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
                      if (e.key === 'Enter' && !showFeedback) {
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
                    Press Enter to submit
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

              {/* Vocabulary Intelligence Stats */}
              {sentenceGame.hasProcessedSentences && (
                <div className="bg-slate-800/60 backdrop-blur-sm border border-green-500/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Gem className="h-5 w-5 text-green-400" />
                    <span className="text-green-400 font-semibold">Intelligence Gathered</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 flex items-center justify-center gap-1">
                        <Gem className="h-5 w-5" />
                        {sentenceGame.totalGems}
                      </div>
                      <div className="text-xs text-green-300">Vocabulary Gems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-1">
                        <Star className="h-5 w-5" />
                        {sentenceGame.totalXP}
                      </div>
                      <div className="text-xs text-yellow-300">Intelligence XP</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mt-2 text-center">
                    Avg: {Math.round(sentenceGame.averageGemsPerSentence * 10) / 10} gems/case
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
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

      {/* Intro Modal */}
      <AnimatePresence>
        {showIntroModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 max-w-lg w-full border-2 border-red-600/50 shadow-2xl shadow-red-600/20"
            >
              {/* Classified Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-600 text-white px-3 py-1 text-xs font-bold tracking-wider rounded">
                  CLASSIFIED
                </div>
                <div className="text-red-500 text-xs font-mono">
                  DETECTIVE ACCESS
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-amber-400 mb-2">
                  🕵️ Case File Translator
                </h2>
                <p className="text-slate-300 text-sm">
                  Translate intercepted messages to solve the case
                </p>
              </div>

              {/* Quick Instructions */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <span className="text-amber-400">📋</span>
                  <span>Read the detective briefing for context</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <span className="text-red-400">🎯</span>
                  <span>Translate messages accurately into English</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <span className="text-blue-400">💡</span>
                  <span>Focus on meaning, not word-for-word</span>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-600/30"
              >
                🔍 Begin Investigation
              </button>

              {/* Case Status Footer */}
              <div className="mt-4 text-center text-slate-500 text-xs font-mono border-t border-slate-700 pt-3">
                CASE STATUS: ACTIVE | PRIORITY: HIGH
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
