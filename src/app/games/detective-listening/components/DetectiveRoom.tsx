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

  const currentEvidence = evidenceList[currentEvidenceIndex];

  const handlePlayEvidence = async () => {
    if (currentEvidence && replayCount < 2) {
      // Pass the actual word as fallback text for TTS
      await playEvidence(currentEvidence.audio, currentEvidence.word);
      if (!isPlaying) {
        setReplayCount(prev => prev + 1);
      }
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback || !currentEvidence) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    const isCorrect = answer === currentEvidence.correct;
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
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 relative overflow-hidden">
      {/* Detective Room Background */}
      <div className="absolute inset-0 opacity-40">
        {/* Desk */}
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-amber-800 to-amber-700"></div>
        
        {/* Filing Cabinet */}
        <div className="absolute bottom-96 right-10 w-40 h-80 bg-gray-700 rounded-t-lg shadow-2xl">
          <div className="w-full h-10 bg-gray-600 rounded-t-lg mb-2"></div>
          <div className="w-full h-10 bg-gray-600 mb-2"></div>
          <div className="w-full h-10 bg-gray-600"></div>
        </div>

        {/* Desk Lamp */}
        <div className="absolute bottom-96 left-10 w-20 h-40 bg-gray-600 rounded-full shadow-xl">
          <div className="w-24 h-24 bg-yellow-300 rounded-full -mt-6 -ml-2 opacity-70 blur-lg"></div>
        </div>

        {/* Case Board */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-80 h-60 bg-cork-board bg-amber-100 rounded-lg shadow-2xl border-4 border-amber-800">
          <div className="p-4">
            <div className="text-amber-900 font-bold text-center mb-2">CASE BOARD</div>
            <div className="grid grid-cols-5 gap-2">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded border-2 ${
                    i < gameProgress.correctAnswers
                      ? 'bg-green-400 border-green-600'
                      : i === currentEvidenceIndex
                      ? 'bg-yellow-400 border-yellow-600 animate-pulse'
                      : 'bg-gray-300 border-gray-400'
                  }`}
                />
              ))}
            </div>
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
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
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
