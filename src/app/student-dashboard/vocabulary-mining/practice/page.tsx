'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { VocabularyMiningService } from '../../../../services/vocabulary-mining';
import { 
  VocabularyGem, 
  GemCollection, 
  SessionType,
  GemType 
} from '../../../../types/vocabulary-mining';
import { 
  calculatePointsEarned,
  getGemInfo,
  determinePerformanceQuality 
} from '../../../../utils/vocabulary-mining';
import { 
  Pickaxe, 
  Star, 
  Clock, 
  Target, 
  Zap,
  CheckCircle,
  XCircle,
  ArrowRight,
  Home,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PracticeSession {
  sessionId: string;
  currentGem: VocabularyGem | null;
  currentIndex: number;
  totalGems: number;
  correctAnswers: number;
  startTime: Date;
  sessionGems: VocabularyGem[];
  theme?: string;
  topic?: string;
}

function VocabularyMiningPracticeContent() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [miningService] = useState(() => new VocabularyMiningService(supabase));
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [responseTime, setResponseTime] = useState(0);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    totalTime: 0,
    accuracy: 0,
    gemsCollected: 0,
    pointsEarned: 0
  });

  // Get theme and topic from URL parameters
  const selectedTheme = searchParams?.get('theme');
  const selectedTopic = searchParams?.get('topic');

  useEffect(() => {
    if (user) {
      initializePracticeSession();
    }
    
    // Cleanup timer on unmount
    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, [user]);

  useEffect(() => {
    if (session?.currentGem && !showResult) {
      setQuestionStartTime(new Date());
    }
  }, [session?.currentGem, showResult]);

  const initializePracticeSession = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Load vocabulary words from the vocabulary table based on theme/topic
      let vocabularyQuery = supabase.from('vocabulary').select('*');
      
      if (selectedTheme) {
        vocabularyQuery = vocabularyQuery.eq('theme', selectedTheme);
      }
      
      if (selectedTopic) {
        vocabularyQuery = vocabularyQuery.eq('topic', selectedTopic);
      }
      
      // Limit to 20 words for a reasonable practice session
      vocabularyQuery = vocabularyQuery.limit(20).order('id');
      
      const { data: vocabularyWords, error: vocabError } = await vocabularyQuery;
      
      if (vocabError) {
        console.error('Error loading vocabulary:', vocabError);
        setLoading(false);
        return;
      }
      
      if (!vocabularyWords || vocabularyWords.length === 0) {
        // No vocabulary available
        setLoading(false);
        return;
      }
      
      // Load user's existing progress for these vocabulary items
      const { data: existingProgress } = await supabase
        .from('student_vocabulary_practice')
        .select('vocabulary_id, mastery_level, gem_level, total_attempts, correct_attempts')
        .eq('student_id', user.id)
        .in('vocabulary_id', vocabularyWords.map((w: any) => w.id));
      
      // Create a progress map for quick lookup
      const progressMap = new Map();
      if (existingProgress) {
        existingProgress.forEach(progress => {
          progressMap.set(progress.vocabulary_id, progress);
        });
      }
      
      // Convert vocabulary words to VocabularyGem objects with actual progress
      const gemsWithProgress: Array<VocabularyGem & { masteryLevel: number; totalAttempts: number; correctAttempts: number }> = vocabularyWords.map((word: any) => {
        const progress = progressMap.get(word.id);
        const masteryLevel = progress?.mastery_level || 0;
        const gemLevel = progress?.gem_level || 1;
        
        // Determine gem type based on mastery level
        let gemType: GemType;
        if (masteryLevel >= 5) gemType = 'legendary';
        else if (masteryLevel >= 4) gemType = 'epic';
        else if (masteryLevel >= 3) gemType = 'rare';
        else if (masteryLevel >= 2) gemType = 'uncommon';
        else gemType = 'common';
        
        console.log(`Word: ${word.spanish} -> Mastery: ${masteryLevel}, GemType: ${gemType}`, progress);
        
        return {
          id: `vocab-${word.id}`,
          term: word.spanish,
          translation: word.english,
          gemType,
          gemColor: getGemColorFromType(gemType),
          frequencyScore: 50,
          curriculumTags: [],
          topicTags: [word.topic],
          themeTags: [word.theme],
          imageUrl: undefined,
          audioUrl: undefined,
          exampleSentence: '',
          exampleTranslation: '',
          notes: '',
          // Store progress info for display
          masteryLevel,
          totalAttempts: progress?.total_attempts || 0,
          correctAttempts: progress?.correct_attempts || 0
        };
      });
      
      // Sort gems to prioritize words that need more practice
      // Put unmastered words first, then by lowest mastery level
      gemsWithProgress.sort((a, b) => {
        const aMastery = a.masteryLevel || 0;
        const bMastery = b.masteryLevel || 0;
        
        // Prioritize unmastered words (mastery < 4)
        if (aMastery < 4 && bMastery >= 4) return -1;
        if (bMastery < 4 && aMastery >= 4) return 1;
        
        // Within the same mastery category, sort by mastery level (lowest first)
        return aMastery - bMastery;
      });
      
      // Convert back to VocabularyGem array for session
      const gems: VocabularyGem[] = gemsWithProgress;
      
      // Start mining session (with fallback)
      let sessionId: string;
      try {
        sessionId = await miningService.startMiningSession(
          user.id,
          'practice' as SessionType
        );
      } catch (error) {
        console.warn('Failed to start formal mining session, using fallback:', error);
        // Create a simple session ID for tracking
        sessionId = `practice-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      }
      
      // Initialize session
      const newSession: PracticeSession = {
        sessionId,
        currentGem: gems[0],
        currentIndex: 0,
        totalGems: gems.length,
        correctAnswers: 0,
        startTime: new Date(),
        sessionGems: gems,
        theme: selectedTheme || undefined,
        topic: selectedTopic || undefined
      };
      
      setSession(newSession);
      setLoading(false);
      
    } catch (error) {
      console.error('Error initializing practice session:', error);
      setLoading(false);
    }
  };

  // Helper functions for gem properties
  const getGemTypeFromDifficulty = (difficulty: string): GemType => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'common';
      case 'medium': return 'uncommon';
      case 'hard': return 'rare';
      default: return 'common';
    }
  };

  const getGemColorFromType = (gemType: GemType): string => {
    switch (gemType) {
      case 'common': return 'gray';
      case 'uncommon': return 'green';
      case 'rare': return 'blue';
      case 'epic': return 'purple';
      case 'legendary': return 'gold';
      default: return 'gray';
    }
  };

  // Flexible answer validation
  const isAnswerCorrect = (userInput: string, correctAnswer: string): boolean => {
    const normalizeText = (text: string) => 
      text.toLowerCase()
          .trim()
          .replace(/[.,;:!?()]/g, '') // Remove punctuation
          .replace(/\s+/g, ' '); // Normalize whitespace

    const userNormalized = normalizeText(userInput);
    const correctNormalized = normalizeText(correctAnswer);

    // Exact match
    if (userNormalized === correctNormalized) {
      return true;
    }

    // Parse multiple acceptable answers from the correct answer
    // Handle formats like: "new, another (pre-noun), new, newly-made (post-noun)"
    const acceptableAnswers = correctAnswer
      .split(',')
      .map(part => {
        // Remove parenthetical information like "(pre-noun)" or "(post-noun)"
        return part.replace(/\([^)]*\)/g, '').trim();
      })
      .filter(part => part.length > 0)
      .map(normalizeText);

    // Also split by common separators
    const moreSeparators = correctAnswer
      .split(/[,;\/|]/)
      .map(part => normalizeText(part.replace(/\([^)]*\)/g, '').trim()))
      .filter(part => part.length > 0);

    const allAcceptableAnswers = [...new Set([...acceptableAnswers, ...moreSeparators])];

    // Check if user's answer matches any acceptable answer
    return allAcceptableAnswers.some(acceptable => {
      return acceptable === userNormalized || 
             // Also allow partial matches for multi-word translations
             (acceptable.includes(' ') && userNormalized.includes(acceptable)) ||
             (userNormalized.includes(' ') && acceptable.includes(userNormalized));
    });
  };

  const handleAnswerSubmit = async () => {
    if (!session || !session.currentGem || !questionStartTime) return;
    
    const currentTime = new Date();
    const timeTaken = currentTime.getTime() - questionStartTime.getTime();
    setResponseTime(timeTaken);
    
    // Check if answer is correct with flexible validation
    const correct = isAnswerCorrect(userAnswer, session.currentGem.translation);
    setIsCorrect(correct);
    setShowResult(true);
    
    // Record the practice result (with fallback to direct tracking)
    try {
      await miningService.recordPracticeResult(
        session.sessionId,
        user!.id,
        session.currentGem.id,
        correct,
        timeTaken
      );
    } catch (error) {
      console.warn('Mining service failed, using direct tracking:', error);
      
      // Extract vocabulary ID from the gem ID (format: "vocab-123")
      const vocabularyId = parseInt(session.currentGem.id.replace('vocab-', ''));
      
      // Use our custom function to track vocabulary practice
      try {
        const { error: trackingError } = await supabase.rpc('track_vocabulary_practice', {
          p_student_id: user!.id,
          p_session_id: session.sessionId,
          p_vocabulary_id: vocabularyId,
          p_spanish_term: session.currentGem.term,
          p_english_translation: session.currentGem.translation,
          p_was_correct: correct,
          p_response_time: timeTaken
        });
        
        if (trackingError) {
          console.error('Failed to track vocabulary practice:', trackingError);
        } else {
          console.log('Successfully tracked vocabulary practice directly');
        }
      } catch (directTrackingError) {
        console.error('Direct tracking also failed:', directTrackingError);
      }
    }
    
    if (correct) {
      setSession(prev => prev ? {
        ...prev,
        correctAnswers: prev.correctAnswers + 1
      } : null);
      
      // Auto-advance to next question after a short delay for correct answers
      const timer = setTimeout(() => {
        if (session && session.currentIndex + 1 < session.totalGems) {
          handleNextQuestion();
        }
      }, 1500); // 1.5 second delay to show the success message
      
      setAutoAdvanceTimer(timer);
    }
  };

  const handleNextQuestion = () => {
    if (!session) return;
    
    // Clear auto-advance timer if it exists
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    
    const nextIndex = session.currentIndex + 1;
    
    if (nextIndex >= session.totalGems) {
      // Session complete
      completeSession();
    } else {
      // Move to next question
      setSession({
        ...session,
        currentIndex: nextIndex,
        currentGem: session.sessionGems[nextIndex]
      });
      
      setUserAnswer('');
      setShowResult(false);
      setIsCorrect(false);
      setResponseTime(0);
    }
  };

  const completeSession = async () => {
    if (!session) return;
    
    try {
      const totalTime = Math.floor((new Date().getTime() - session.startTime.getTime()) / 1000);
      const accuracy = Math.round((session.correctAnswers / session.totalGems) * 100);
      const sessionScore = session.correctAnswers * 10;
      
      // Try to end the mining session properly
      try {
        const sessionResult = await miningService.endMiningSession(session.sessionId);
      } catch (error) {
        console.warn('Mining service failed to end session, updating manually:', error);
        
        // Update the session manually in the database
        try {
          const { error: updateError } = await supabase
            .from('vocabulary_mining_sessions')
            .update({
              ended_at: new Date().toISOString(),
              total_words_attempted: session.totalGems,
              total_words_correct: session.correctAnswers,
              gems_collected: session.correctAnswers,
              session_score: sessionScore,
              accuracy_percentage: accuracy,
              time_spent_seconds: totalTime,
              updated_at: new Date().toISOString()
            })
            .eq('id', session.sessionId);
            
          if (updateError) {
            console.error('Failed to update session manually:', updateError);
          } else {
            console.log('Successfully updated session manually');
          }
        } catch (manualUpdateError) {
          console.error('Manual session update failed:', manualUpdateError);
        }
      }
      
      setSessionStats({
        totalTime,
        accuracy,
        gemsCollected: session.correctAnswers,
        pointsEarned: sessionScore
      });
      
      setSessionComplete(true);
      
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showResult && userAnswer.trim()) {
      handleAnswerSubmit();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Preparing your mining session...</p>
          {selectedTheme && selectedTopic && (
            <p className="text-indigo-200 text-sm mt-2">
              Loading vocabulary from: {selectedTheme} → {selectedTopic}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <Pickaxe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Vocabulary Found</h2>
          <p className="text-gray-600 mb-2">
            {selectedTheme && selectedTopic 
              ? `No vocabulary found for: ${selectedTheme} → ${selectedTopic}`
              : 'No vocabulary available for practice right now.'
            }
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Try selecting a different topic or check back later.
          </p>
          <Link
            href="/student-dashboard/vocabulary-mining"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mining Session Complete!</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{sessionStats.gemsCollected}</div>
              <div className="text-sm text-gray-600">Gems Collected</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{sessionStats.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{sessionStats.pointsEarned}</div>
              <div className="text-sm text-gray-600">Points Earned</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{Math.floor(sessionStats.totalTime / 60)}m</div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={initializePracticeSession}
              className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Practice Again
            </button>
            
            <Link
              href="/student-dashboard/vocabulary-mining"
              className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentGem = session.currentGem;
  const gemInfo = currentGem ? getGemInfo(currentGem.gemType) : null;
  const progress = Math.round(((session.currentIndex + 1) / session.totalGems) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Pickaxe className="w-6 h-6 text-yellow-400 mr-3" />
              <div>
                <span className="text-white font-medium">Vocabulary Mining Practice</span>
                {session.theme && session.topic && (
                  <div className="text-indigo-200 text-sm mt-1">
                    {session.theme} → {session.topic}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-white">
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                <span className="text-sm">{session.currentIndex + 1}/{session.totalGems}</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                <span className="text-sm">{session.correctAnswers} correct</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentGem && (
          <div className="bg-white rounded-xl shadow-2xl p-8">
            {/* Gem Display */}
            <div className="text-center mb-8">
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl border-4"
                style={{ 
                  backgroundColor: gemInfo?.color + '20',
                  borderColor: gemInfo?.color,
                  color: gemInfo?.color
                }}
              >
                {gemInfo?.icon}
              </div>
              <div className="text-sm font-medium text-gray-600 mb-2">
                {gemInfo?.name} Gem
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {currentGem.term}
              </h2>
              {currentGem.exampleSentence && (
                <p className="text-gray-600 italic">
                  "{currentGem.exampleSentence}"
                </p>
              )}
            </div>

            {/* Answer Input */}
            {!showResult ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What does this word mean in English?
                  </label>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Type your answer..."
                    autoFocus
                  />
                </div>
                
                <button
                  onClick={handleAnswerSubmit}
                  disabled={!userAnswer.trim()}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Answer
                </button>
              </div>
            ) : (
              /* Result Display */
              <div className="space-y-6">
                <div className={`text-center p-6 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center justify-center mb-4">
                    {isCorrect ? (
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    ) : (
                      <XCircle className="w-12 h-12 text-red-500" />
                    )}
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </h3>
                  
                  <p className="text-gray-700 mb-2">
                    <strong>Correct answer:</strong> {currentGem.translation}
                  </p>
                  
                  {!isCorrect && (
                    <>
                      <p className="text-gray-600 mb-2">
                        <strong>Your answer:</strong> {userAnswer}
                      </p>
                      <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded">
                        <p className="mb-1"><strong>Any of these would be accepted:</strong></p>
                        <p className="text-green-600">
                          {currentGem.translation
                            .split(',')
                            .map(part => part.replace(/\([^)]*\)/g, '').trim())
                            .filter(part => part.length > 0)
                            .join(' • ')}
                        </p>
                      </div>
                    </>
                  )}

                  {isCorrect && (
                    <p className="text-green-600 text-sm">
                      ✨ Great job! Moving to next gem automatically...
                    </p>
                  )}
                  
                  <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{(responseTime / 1000).toFixed(1)}s</span>
                  </div>
                </div>
                
                <button
                  onClick={handleNextQuestion}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg flex items-center justify-center transition-colors ${
                    isCorrect 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {session.currentIndex + 1 >= session.totalGems ? 'Complete Session' : 
                   isCorrect ? 'Next Gem (Auto-advancing...)' : 'Next Gem'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Loading component for Suspense
function PracticePageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Loading practice session...</p>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function VocabularyMiningPracticePage() {
  return (
    <Suspense fallback={<PracticePageLoading />}>
      <VocabularyMiningPracticeContent />
    </Suspense>
  );
}