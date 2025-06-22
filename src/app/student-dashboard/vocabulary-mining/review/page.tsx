'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { VocabularyMiningService } from '../../../../services/vocabulary-mining';
import { GemDisplay } from '../../../../components/vocabulary-mining/GemDisplay';
import { 
  VocabularyGem, 
  GemCollection, 
  SessionType 
} from '../../../../types/vocabulary-mining';
import { 
  calculatePointsEarned,
  getGemInfo,
  determinePerformanceQuality,
  getNextReviewText 
} from '../../../../utils/vocabulary-mining';
import { 
  RefreshCw, 
  Clock, 
  Target, 
  Zap,
  CheckCircle,
  XCircle,
  ArrowRight,
  Home,
  RotateCcw,
  Calendar,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface ReviewSession {
  sessionId: string;
  currentGem: VocabularyGem | null;
  currentCollection: GemCollection | null;
  currentIndex: number;
  totalGems: number;
  correctAnswers: number;
  startTime: Date;
  reviewItems: (VocabularyGem & { collection: GemCollection })[];
}

export default function VocabularyMiningReviewPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [miningService] = useState(() => new VocabularyMiningService(supabase));
  
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<ReviewSession | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [responseTime, setResponseTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    totalTime: 0,
    accuracy: 0,
    gemsReviewed: 0,
    pointsEarned: 0,
    gemsUpgraded: 0
  });

  useEffect(() => {
    if (user) {
      initializeReviewSession();
    }
  }, [user]);

  useEffect(() => {
    if (session?.currentGem && !showResult) {
      setQuestionStartTime(new Date());
    }
  }, [session?.currentGem, showResult]);

  const initializeReviewSession = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get items needing review
      const reviewItems = await miningService.getItemsForReview(user.id, 20);
      
      if (reviewItems.length === 0) {
        setLoading(false);
        return;
      }
      
      // Get vocabulary details for review items
      const reviewGemsWithCollection = await Promise.all(
        reviewItems.map(async (collection) => {
          const gems = await miningService.getVocabularyGems();
          const gem = gems.find(g => g.id === collection.vocabularyItemId);
          return gem ? { ...gem, collection } : null;
        })
      );
      
      const validReviewItems = reviewGemsWithCollection.filter(item => item !== null) as (VocabularyGem & { collection: GemCollection })[];
      
      if (validReviewItems.length === 0) {
        setLoading(false);
        return;
      }
      
      // Start review session
      const sessionId = await miningService.startMiningSession(
        user.id,
        'review' as SessionType
      );
      
      // Initialize session
      const newSession: ReviewSession = {
        sessionId,
        currentGem: validReviewItems[0],
        currentCollection: validReviewItems[0].collection,
        currentIndex: 0,
        totalGems: validReviewItems.length,
        correctAnswers: 0,
        startTime: new Date(),
        reviewItems: validReviewItems
      };
      
      setSession(newSession);
      setLoading(false);
      
    } catch (error) {
      console.error('Error initializing review session:', error);
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!session || !session.currentGem || !questionStartTime) return;
    
    const currentTime = new Date();
    const timeTaken = currentTime.getTime() - questionStartTime.getTime();
    setResponseTime(timeTaken);
    
    // Check if answer is correct (case-insensitive)
    const correct = userAnswer.toLowerCase().trim() === session.currentGem.translation.toLowerCase().trim();
    setIsCorrect(correct);
    setShowResult(true);
    
    // Record the practice result
    try {
      await miningService.recordPracticeResult(
        session.sessionId,
        user!.id,
        session.currentGem.id,
        correct,
        timeTaken
      );
      
      if (correct) {
        setSession(prev => prev ? {
          ...prev,
          correctAnswers: prev.correctAnswers + 1
        } : null);
      }
    } catch (error) {
      console.error('Error recording review result:', error);
    }
  };

  const handleNextQuestion = () => {
    if (!session) return;
    
    const nextIndex = session.currentIndex + 1;
    
    if (nextIndex >= session.totalGems) {
      // Session complete
      completeSession();
    } else {
      // Move to next question
      const nextItem = session.reviewItems[nextIndex];
      setSession({
        ...session,
        currentIndex: nextIndex,
        currentGem: nextItem,
        currentCollection: nextItem.collection
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
      // End the review session
      const sessionResult = await miningService.endMiningSession(session.sessionId);
      
      const totalTime = Math.floor((new Date().getTime() - session.startTime.getTime()) / 1000);
      const accuracy = Math.round((session.correctAnswers / session.totalGems) * 100);
      
      setSessionStats({
        totalTime,
        accuracy,
        gemsReviewed: session.totalGems,
        pointsEarned: sessionResult.sessionScore,
        gemsUpgraded: sessionResult.gemsUpgraded
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
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Preparing your review session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Due</h2>
          <p className="text-gray-600 mb-6">Great job! You're all caught up with your vocabulary reviews.</p>
          <div className="space-y-3">
            <Link
              href="/student-dashboard/vocabulary-mining/practice"
              className="block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
            >
              Practice New Words
            </Link>
            <Link
              href="/student-dashboard/vocabulary-mining"
              className="block bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Session Complete!</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{sessionStats.gemsReviewed}</div>
              <div className="text-sm text-gray-600">Gems Reviewed</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{sessionStats.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{sessionStats.gemsUpgraded}</div>
              <div className="text-sm text-gray-600">Gems Upgraded</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{sessionStats.pointsEarned}</div>
              <div className="text-sm text-gray-600">Points Earned</div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={initializeReviewSession}
              className="flex-1 bg-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-700 flex items-center justify-center"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Review Again
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
  const currentCollection = session.currentCollection;
  const gemInfo = currentGem ? getGemInfo(currentGem.gemType) : null;
  const progress = Math.round(((session.currentIndex + 1) / session.totalGems) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <RefreshCw className="w-6 h-6 text-orange-400 mr-3" />
              <span className="text-white font-medium">Spaced Repetition Review</span>
            </div>
            
            <div className="flex items-center space-x-4 text-white">
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                <span className="text-sm">{session.currentIndex + 1}/{session.totalGems}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{session.correctAnswers} correct</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-orange-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentGem && currentCollection && (
          <div className="bg-white rounded-xl shadow-2xl p-8">
            {/* Gem Display with Review Info */}
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
                {gemInfo?.name} Gem • Level {currentCollection.gemLevel}
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {currentGem.term}
              </h2>
              
              {/* Review Stats */}
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>{Math.round((currentCollection.correctEncounters / currentCollection.totalEncounters) * 100)}% accuracy</span>
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  <span>{currentCollection.currentStreak} streak</span>
                </div>
              </div>
              
              {/* Next Review Info */}
              {currentCollection.nextReviewAt && (
                <div className="text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-full inline-block mb-4">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Due: {getNextReviewText(currentCollection.nextReviewAt)}
                </div>
              )}
              
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Type your answer..."
                    autoFocus
                  />
                </div>
                
                <button
                  onClick={handleAnswerSubmit}
                  disabled={!userAnswer.trim()}
                  className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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
                    {isCorrect ? 'Excellent!' : 'Keep Practicing'}
                  </h3>
                  
                  <p className="text-gray-700 mb-2">
                    <strong>Correct answer:</strong> {currentGem.translation}
                  </p>
                  
                  {!isCorrect && (
                    <p className="text-gray-600">
                      <strong>Your answer:</strong> {userAnswer}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{(responseTime / 1000).toFixed(1)}s</span>
                  </div>
                </div>
                
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-orange-700 flex items-center justify-center transition-colors"
                >
                  {session.currentIndex + 1 >= session.totalGems ? 'Complete Review' : 'Next Review'}
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
