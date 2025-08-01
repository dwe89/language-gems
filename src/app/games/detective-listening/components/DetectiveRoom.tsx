'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, RotateCcw, Volume2, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useVocabularyByCategory } from '../../../../hooks/useVocabulary';
import { VOCABULARY_CATEGORIES } from '../../../../components/games/ModernCategorySelector';
import { useAudioManager } from '../hooks/useAudioManager';
import { Evidence } from '../types';
import { StandardVocabularyItem, AssignmentData, GameProgress, calculateStandardScore } from '../../../../components/games/templates/GameAssignmentWrapper';

interface AssignmentMode {
  assignment: AssignmentData;
  vocabulary: StandardVocabularyItem[];
  onProgressUpdate: (progress: Partial<GameProgress>) => void;
  onGameComplete: (finalProgress: GameProgress) => void;
}

interface DetectiveRoomProps {
  caseType: string;
  subcategory: string | null;
  language: string;
  onGameComplete: (results: any) => void;
  onBack: () => void;
  assignmentMode?: AssignmentMode;
}

export default function DetectiveRoom({ caseType, subcategory, language, onGameComplete, onBack, assignmentMode }: DetectiveRoomProps) {
  const [currentEvidenceIndex, setCurrentEvidenceIndex] = useState(0);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [replayCount, setReplayCount] = useState(0);
  const [gameProgress, setGameProgress] = useState({
    correctAnswers: 0,
    totalEvidence: 10,
    evidenceCollected: [] as Evidence[]
  });

  // Audio state and refs
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);
  const [audioEffects, setAudioEffects] = useState<{
    radioStatic: HTMLAudioElement | null;
    radioBeep: HTMLAudioElement | null;
    correctAnswer: HTMLAudioElement | null;
    wrongAnswer: HTMLAudioElement | null;
  }>({
    radioStatic: null,
    radioBeep: null,
    correctAnswer: null,
    wrongAnswer: null
  });

  // Map language for vocabulary loading
  const mapLanguageForVocab = (lang: string) => {
    const mapping: Record<string, string> = {
      'spanish': 'es',
      'french': 'fr',
      'german': 'de'
    };
    return mapping[lang] || 'es';
  };

  // Load vocabulary using the category system (only if not in assignment mode)
  const { vocabulary: categoryVocabulary, loading: vocabularyLoading } = useVocabularyByCategory({
    language: mapLanguageForVocab(language),
    categoryId: caseType,
    subcategoryId: subcategory,
    difficultyLevel: 'beginner',
    curriculumLevel: 'KS3'
  });

  // Use assignment vocabulary if available, otherwise use category vocabulary
  const vocabulary = assignmentMode ? assignmentMode.vocabulary : categoryVocabulary;

  const { playEvidence, isPlaying } = useAudioManager();

  // Get category info for display
  const categoryInfo = VOCABULARY_CATEGORIES.find(cat => cat.id === caseType);
  const subcategoryInfo = categoryInfo?.subcategories.find(sub => sub.id === subcategory);

  // Initialize evidence list from vocabulary
  useEffect(() => {
    if (vocabulary && vocabulary.length > 0) {
      // Create distractors from other vocabulary items
      const createDistractors = (correctTranslation: string, allVocab: any[]) => {
        const otherTranslations = allVocab
          .filter(item => item.translation !== correctTranslation)
          .map(item => item.translation)
          .slice(0, 3); // Take up to 3 distractors

        // If we don't have enough distractors, add some generic ones
        const genericDistractors = ['option A', 'option B', 'option C'];
        while (otherTranslations.length < 2) {
          const generic = genericDistractors[otherTranslations.length];
          if (!otherTranslations.includes(generic)) {
            otherTranslations.push(generic);
          }
        }

        return otherTranslations.slice(0, 2); // Return 2 distractors
      };

      const evidence: Evidence[] = vocabulary.slice(0, 10).map((item, index) => {
        const distractors = createDistractors(item.translation, vocabulary);
        return {
          id: `evidence-${index}`,
          audio: item.audio_url || `detective_${item.word}.mp3`, // Use actual audio URL if available
          correct: item.translation,
          options: [item.translation, ...distractors].sort(() => Math.random() - 0.5),
          answered: false,
          attempts: 0,
          word: item.word
        };
      });

      setEvidenceList(evidence);
    }
  }, [vocabulary]);

  // Initialize audio effects
  useEffect(() => {
    console.log('Initializing audio effects...');
    
    // Initialize background music
    const bgMusic = new Audio('/audio/detective-listening/background-music.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.15; // Keep it subtle
    bgMusic.addEventListener('error', (e) => console.error('Background music load error:', e));
    bgMusic.addEventListener('canplaythrough', () => console.log('Background music loaded successfully'));
    setBackgroundMusic(bgMusic);

    // Initialize sound effects
    const effects = {
      radioStatic: new Audio('/audio/detective-listening/radio-static.mp3'),
      radioBeep: new Audio('/audio/detective-listening/radio-beep.mp3'),
      correctAnswer: new Audio('/audio/detective-listening/correct-answer.mp3'),
      wrongAnswer: new Audio('/audio/detective-listening/wrong-answer.mp3')
    };

    // Add error handling and set volumes for each effect
    Object.entries(effects).forEach(([name, audio]) => {
      if (audio) {
        audio.addEventListener('error', (e) => console.error(`${name} load error:`, e));
        audio.addEventListener('canplaythrough', () => console.log(`${name} loaded successfully`));
        
        // Set volumes
        switch(name) {
          case 'radioStatic':
            audio.volume = 0.3;
            break;
          case 'radioBeep':
            audio.volume = 0.4;
            break;
          case 'correctAnswer':
            audio.volume = 0.5;
            break;
          case 'wrongAnswer':
            audio.volume = 0.4;
            break;
        }
      }
    });

    console.log('Audio effects initialized:', effects);
    setAudioEffects(effects);

    // Start background music
    const playBgMusic = async () => {
      try {
        console.log('Attempting to play background music');
        await bgMusic.play();
        console.log('Background music started successfully');
      } catch (error) {
        console.log('Background music autoplay blocked - will play on first user interaction:', error);
      }
    };
    playBgMusic();

    // Cleanup function
    return () => {
      bgMusic.pause();
      bgMusic.currentTime = 0;
      Object.values(effects).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

  // Helper function to play sound effects
  const playSound = async (soundType: keyof typeof audioEffects) => {
    console.log(`Attempting to play ${soundType}:`, audioEffects);
    const sound = audioEffects[soundType];
    console.log(`Sound object for ${soundType}:`, sound);
    if (sound) {
      try {
        sound.currentTime = 0; // Reset to beginning
        console.log(`Playing ${soundType} sound`);
        await sound.play();
        console.log(`${soundType} sound played successfully`);
      } catch (error) {
        console.error(`Could not play ${soundType} sound:`, error);
      }
    } else {
      console.error(`${soundType} sound not found in audioEffects`);
      // Try creating and playing the sound directly as fallback
      try {
        const directSound = new Audio(`/audio/detective-listening/${soundType === 'radioStatic' ? 'radio-static' : soundType === 'radioBeep' ? 'radio-beep' : soundType === 'correctAnswer' ? 'correct-answer' : 'wrong-answer'}.mp3`);
        directSound.volume = 0.4;
        await directSound.play();
        console.log(`Direct ${soundType} sound played successfully`);
      } catch (directError) {
        console.error(`Direct ${soundType} sound also failed:`, directError);
      }
    }
  };

  // Ensure background music starts on first user interaction
  const ensureBackgroundMusic = async () => {
    console.log('ensureBackgroundMusic called, backgroundMusic:', backgroundMusic);
    if (backgroundMusic && backgroundMusic.paused) {
      try {
        console.log('Starting background music...');
        await backgroundMusic.play();
        console.log('Background music started successfully');
      } catch (error) {
        console.error('Could not start background music:', error);
      }
    } else if (backgroundMusic) {
      console.log('Background music is already playing');
    } else {
      console.log('Background music not initialized yet');
    }
  };

  const currentEvidence = evidenceList[currentEvidenceIndex];

  const handlePlayEvidence = async () => {
    if (currentEvidence && replayCount < 2) {
      // Ensure background music is playing on first interaction
      await ensureBackgroundMusic();
      
      // Play radio static first
      await playSound('radioStatic');
      
      // Small delay then play radio beep
      setTimeout(async () => {
        await playSound('radioBeep');
        
        // Another small delay then play the evidence audio
        setTimeout(async () => {
          await playEvidence(currentEvidence.audio, currentEvidence.word);
          if (!isPlaying) {
            setReplayCount(prev => prev + 1);
          }
        }, 300);
      }, 500);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback || !currentEvidence) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    const isCorrect = answer === currentEvidence.correct;
    
    // Play feedback sound effect
    if (isCorrect) {
      playSound('correctAnswer');
    } else {
      playSound('wrongAnswer');
    }
    
    const updatedEvidence = {
      ...currentEvidence,
      answered: true,
      isCorrect,
      attempts: currentEvidence.attempts + 1
    };

    // Update evidence list
    const newEvidenceList = [...evidenceList];
    newEvidenceList[currentEvidenceIndex] = updatedEvidence;
    setEvidenceList(newEvidenceList);

    // Update progress
    const newCorrectAnswers = gameProgress.correctAnswers + (isCorrect ? 1 : 0);
    const wordsCompleted = currentEvidenceIndex + 1;

    if (isCorrect) {
      setGameProgress(prev => ({
        ...prev,
        correctAnswers: newCorrectAnswers,
        evidenceCollected: [...prev.evidenceCollected, updatedEvidence]
      }));
    }

    // Update assignment progress if in assignment mode
    if (assignmentMode) {
      const { score, accuracy, maxScore } = calculateStandardScore(
        newCorrectAnswers,
        wordsCompleted,
        Date.now(),
        120
      );

      assignmentMode.onProgressUpdate({
        wordsCompleted,
        totalWords: evidenceList.length,
        score,
        maxScore,
        accuracy,
        sessionData: {
          totalCases: wordsCompleted,
          perfectCases: newCorrectAnswers,
          totalAttempts: wordsCompleted,
          averageResponseTime: 0
        }
      });
    }

    // Auto-advance after feedback
    setTimeout(() => {
      if (currentEvidenceIndex < evidenceList.length - 1) {
        setCurrentEvidenceIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setReplayCount(0);
      } else {
        // Game complete
        const finalCorrectAnswers = gameProgress.correctAnswers + (isCorrect ? 1 : 0);
        const totalWords = evidenceList.length;

        if (assignmentMode) {
          // Assignment mode completion
          const { score, accuracy, maxScore } = calculateStandardScore(
            finalCorrectAnswers,
            totalWords,
            Date.now(),
            120 // Base points for detective work
          );

          assignmentMode.onGameComplete({
            assignmentId: assignmentMode.assignment.id,
            gameId: 'detective-listening',
            studentId: '', // Will be set by wrapper
            wordsCompleted: totalWords,
            totalWords,
            score,
            maxScore,
            accuracy,
            timeSpent: 0, // Will be calculated by wrapper
            completedAt: new Date(),
            sessionData: {
              totalCases: totalWords,
              perfectCases: finalCorrectAnswers,
              totalAttempts: totalWords,
              averageResponseTime: 0
            }
          });
        } else {
          // Regular game completion
          onGameComplete({
            correctAnswers: finalCorrectAnswers,
            totalEvidence: totalWords,
            evidenceCollected: [...gameProgress.evidenceCollected, updatedEvidence]
          });
        }
      }
    }, 2000);
  };

  if (!currentEvidence) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 to-red-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading evidence...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/games/detective-listening/detective-office-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Progress Indicator - subtle and integrated */}
      <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 h-auto bg-black/30 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 z-10">
        <div className="p-4">
          <div className="text-white/90 font-semibold text-center mb-3 text-sm">EVIDENCE PROGRESS</div>
          <div className="grid grid-cols-10 gap-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full border ${
                  i < gameProgress.correctAnswers
                    ? 'bg-green-500/80 border-green-400'
                    : i === currentEvidenceIndex
                    ? 'bg-yellow-500/80 border-yellow-400 animate-pulse'
                    : 'bg-white/20 border-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="absolute top-8 left-8 z-20 flex items-center space-x-2 bg-slate-800/80 backdrop-blur-sm text-slate-200 px-4 py-2 rounded-lg hover:bg-slate-700/80 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </motion.button>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-amber-100/10 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-amber-900" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-amber-100">
                    {categoryInfo?.displayName} {subcategoryInfo ? `- ${subcategoryInfo.displayName}` : ''} Case
                  </h1>
                  <p className="text-amber-200">
                    {language.charAt(0).toUpperCase() + language.slice(1)} • Evidence {currentEvidenceIndex + 1} of {evidenceList.length}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-amber-100 font-bold text-lg">
                  {gameProgress.correctAnswers} / {gameProgress.totalEvidence}
                </div>
                <div className="text-amber-200 text-sm">Evidence Confirmed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radio Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-100 mb-2">
                Radio Transmission
              </h2>
              <p className="text-gray-400 text-sm">
                Evidence coming in over the radio...
              </p>
            </div>

            {/* Radio Interface */}
            <div className="bg-black rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePlayEvidence}
                  disabled={isPlaying || replayCount >= 2}
                  aria-label={
                    isPlaying
                      ? 'Audio playing...'
                      : replayCount >= 2
                      ? 'Maximum replays reached'
                      : `Play evidence audio (${2 - replayCount} replays remaining)`
                  }
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl
                    focus:outline-none focus:ring-4 focus:ring-blue-400/50
                    ${isPlaying
                      ? 'bg-red-600 animate-pulse'
                      : replayCount >= 2
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                    }
                  `}
                >
                  {isPlaying ? (
                    <Volume2 className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </motion.button>
              </div>
              
              <div className="text-center">
                <div className="text-green-400 font-mono text-sm mb-2">
                  {isPlaying ? 'TRANSMITTING...' : 'READY TO RECEIVE'}
                </div>
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-4 rounded-full ${
                        isPlaying && i < 4 ? 'bg-green-400' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Replay Counter */}
            <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
              <RotateCcw className="h-4 w-4" />
              <span>Replays: {replayCount} / 2</span>
            </div>
          </motion.div>

          {/* Evidence Identification */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-amber-100/10 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/30"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-amber-100 mb-2">
                Identify Evidence
              </h2>
              <p className="text-amber-200 text-sm">
                Select the correct English translation
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              {currentEvidence.options.map((option, index) => (
                <motion.button
                  key={option}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: showFeedback ? 1 : 1.02 }}
                  whileTap={{ scale: showFeedback ? 1 : 0.98 }}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback}
                  aria-label={`Select answer: ${option}`}
                  aria-pressed={selectedAnswer === option}
                  className={`
                    w-full p-4 rounded-xl border-2 text-left font-semibold transition-all duration-300
                    focus:outline-none focus:ring-4 focus:ring-amber-400/50
                    ${showFeedback
                      ? option === currentEvidence.correct
                        ? 'bg-green-600/20 border-green-400 text-green-100'
                        : option === selectedAnswer
                        ? 'bg-red-600/20 border-red-400 text-red-100'
                        : 'bg-gray-600/20 border-gray-500 text-gray-300'
                      : 'bg-amber-100/10 border-amber-300/50 text-amber-100 hover:bg-amber-100/20 hover:border-amber-300'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option.toUpperCase()}</span>
                    {showFeedback && (
                      <div>
                        {option === currentEvidence.correct ? (
                          <CheckCircle className="h-6 w-6 text-green-400" />
                        ) : option === selectedAnswer ? (
                          <XCircle className="h-6 w-6 text-red-400" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 text-center"
                >
                  {selectedAnswer === currentEvidence.correct ? (
                    <div className="text-green-400">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                      <p className="font-bold">Evidence Confirmed!</p>
                      <p className="text-sm text-green-300">
                        Excellent detective work!
                      </p>
                    </div>
                  ) : (
                    <div className="text-red-400">
                      <XCircle className="h-8 w-8 mx-auto mb-2" />
                      <p className="font-bold">Re-examine the evidence</p>
                      <p className="text-sm text-red-300">
                        The correct answer was: {currentEvidence.correct}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
