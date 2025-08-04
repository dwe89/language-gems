'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, XCircle, AlertTriangle, TrendingUp, TrendingDown,
  Target, Clock, Star, Award, BookOpen, Brain, Zap, Heart,
  BarChart3, PieChart, Activity, Lightbulb, ArrowRight,
  ThumbsUp, ThumbsDown, MessageCircle, RefreshCw, Play,
  ChevronRight, ChevronDown, Eye, Download, Share2
} from 'lucide-react';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface AssignmentFeedback {
  assignmentId: string;
  assignmentTitle: string;
  completedAt: Date;
  totalScore: number;
  maxScore: number;
  timeSpent: number; // in minutes
  accuracy: number; // percentage
  attempts: number;
  status: 'completed' | 'in_progress' | 'needs_review';
  gameResults: GameResult[];
  overallFeedback: FeedbackSection;
  recommendations: Recommendation[];
  strengths: string[];
  improvementAreas: string[];
  nextSteps: string[];
}

interface GameResult {
  gameId: string;
  gameName: string;
  gameType: 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'speaking' | 'writing';
  score: number;
  maxScore: number;
  accuracy: number;
  timeSpent: number;
  attempts: number;
  mistakes: Mistake[];
  feedback: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface Mistake {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  concept: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface FeedbackSection {
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  icon: React.ComponentType<any>;
  color: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'practice' | 'review' | 'advance' | 'help';
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  action: {
    text: string;
    onClick: () => void;
  };
}

interface EnhancedAssignmentFeedbackProps {
  assignmentId: string;
  onClose?: () => void;
  onRetry?: () => void;
  onContinue?: () => void;
}

// =====================================================
// PERFORMANCE METRICS COMPONENT
// =====================================================

const PerformanceMetrics: React.FC<{
  feedback: AssignmentFeedback;
}> = ({ feedback }) => {
  const scorePercentage = (feedback.totalScore / feedback.maxScore) * 100;
  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 70) return 'text-blue-600 bg-blue-100';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const metrics = [
    {
      label: 'Final Score',
      value: `${feedback.totalScore}/${feedback.maxScore}`,
      percentage: scorePercentage,
      icon: Target,
      color: getScoreColor(scorePercentage)
    },
    {
      label: 'Accuracy',
      value: `${feedback.accuracy}%`,
      percentage: feedback.accuracy,
      icon: CheckCircle,
      color: feedback.accuracy >= 80 ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
    },
    {
      label: 'Time Spent',
      value: `${feedback.timeSpent}m`,
      percentage: Math.min((feedback.timeSpent / 60) * 100, 100),
      icon: Clock,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Attempts',
      value: feedback.attempts.toString(),
      percentage: Math.max(100 - (feedback.attempts - 1) * 20, 20),
      icon: RefreshCw,
      color: feedback.attempts === 1 ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => {
        const MetricIcon = metric.icon;
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${metric.color}`}>
                <MetricIcon className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {metric.value}
                </div>
                <div className="text-xs text-gray-600">
                  {metric.label}
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${metric.color.includes('green') ? 'bg-green-500' : 
                  metric.color.includes('blue') ? 'bg-blue-500' :
                  metric.color.includes('yellow') ? 'bg-yellow-500' :
                  metric.color.includes('orange') ? 'bg-orange-500' : 'bg-red-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${metric.percentage}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// =====================================================
// GAME RESULTS BREAKDOWN COMPONENT
// =====================================================

const GameResultsBreakdown: React.FC<{
  gameResults: GameResult[];
}> = ({ gameResults }) => {
  const [expandedGame, setExpandedGame] = useState<string | null>(null);

  const getGameIcon = (type: GameResult['gameType']) => {
    switch (type) {
      case 'vocabulary': return BookOpen;
      case 'grammar': return Brain;
      case 'listening': return Activity;
      case 'reading': return Eye;
      case 'speaking': return MessageCircle;
      case 'writing': return PieChart;
      default: return Star;
    }
  };

  const getGameColor = (accuracy: number) => {
    if (accuracy >= 90) return 'border-green-200 bg-green-50';
    if (accuracy >= 70) return 'border-blue-200 bg-blue-50';
    if (accuracy >= 50) return 'border-yellow-200 bg-yellow-50';
    return 'border-red-200 bg-red-50';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 student-font-display">
        Game Performance Breakdown
      </h3>
      
      {gameResults.map((game, index) => {
        const GameIcon = getGameIcon(game.gameType);
        const isExpanded = expandedGame === game.gameId;
        
        return (
          <motion.div
            key={game.gameId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border rounded-xl p-4 ${getGameColor(game.accuracy)}`}
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedGame(isExpanded ? null : game.gameId)}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg">
                  <GameIcon className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{game.gameName}</h4>
                  <p className="text-sm text-gray-600 capitalize">
                    {game.gameType} • {game.difficulty}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {game.score}/{game.maxScore}
                  </div>
                  <div className="text-sm text-gray-600">
                    {game.accuracy}% accuracy
                  </div>
                </div>
                
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </motion.div>
              </div>
            </div>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {game.timeSpent}m
                      </div>
                      <div className="text-sm text-gray-600">Time Spent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {game.attempts}
                      </div>
                      <div className="text-sm text-gray-600">Attempts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {game.mistakes.length}
                      </div>
                      <div className="text-sm text-gray-600">Mistakes</div>
                    </div>
                  </div>
                  
                  {game.feedback && (
                    <div className="bg-white rounded-lg p-3 mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">Feedback:</h5>
                      <p className="text-sm text-gray-700">{game.feedback}</p>
                    </div>
                  )}
                  
                  {game.mistakes.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900">Common Mistakes:</h5>
                      {game.mistakes.slice(0, 3).map((mistake, mistakeIndex) => (
                        <div key={mistakeIndex} className="bg-white rounded-lg p-3 text-sm">
                          <div className="font-medium text-gray-900 mb-1">
                            {mistake.question}
                          </div>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className="text-red-600">
                              Your answer: {mistake.userAnswer}
                            </span>
                            <span className="text-green-600">
                              Correct: {mistake.correctAnswer}
                            </span>
                          </div>
                          {mistake.explanation && (
                            <div className="mt-2 text-gray-600">
                              {mistake.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

// =====================================================
// RECOMMENDATIONS COMPONENT
// =====================================================

const RecommendationsSection: React.FC<{
  recommendations: Recommendation[];
}> = ({ recommendations }) => {
  const getPriorityColor = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 text-red-700';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-700';
      case 'low': return 'border-blue-200 bg-blue-50 text-blue-700';
    }
  };

  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'practice': return RefreshCw;
      case 'review': return Eye;
      case 'advance': return TrendingUp;
      case 'help': return Lightbulb;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 student-font-display">
        Personalized Recommendations
      </h3>
      
      {recommendations.map((rec, index) => {
        const TypeIcon = getTypeIcon(rec.type);
        
        return (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TypeIcon className="h-5 w-5 text-blue-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                    {rec.priority} priority
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">
                  {rec.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Estimated time: {rec.estimatedTime} minutes
                  </span>
                  
                  <button
                    onClick={rec.action.onClick}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    <span>{rec.action.text}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// =====================================================
// MAIN ENHANCED ASSIGNMENT FEEDBACK COMPONENT
// =====================================================

export default function EnhancedAssignmentFeedback({
  assignmentId,
  onClose,
  onRetry,
  onContinue
}: EnhancedAssignmentFeedbackProps) {
  const [feedback, setFeedback] = useState<AssignmentFeedback | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading feedback data
    const loadFeedback = async () => {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockFeedback: AssignmentFeedback = {
        assignmentId,
        assignmentTitle: 'Spanish Vocabulary: Family Members',
        completedAt: new Date(),
        totalScore: 42,
        maxScore: 50,
        timeSpent: 25,
        accuracy: 84,
        attempts: 1,
        status: 'completed',
        gameResults: [
          {
            gameId: '1',
            gameName: 'Memory Match',
            gameType: 'vocabulary',
            score: 18,
            maxScore: 20,
            accuracy: 90,
            timeSpent: 8,
            attempts: 1,
            mistakes: [
              {
                question: 'What is "grandmother" in Spanish?',
                userAnswer: 'abuela',
                correctAnswer: 'abuela',
                explanation: 'Correct! "Abuela" means grandmother.',
                concept: 'Family vocabulary',
                difficulty: 'easy'
              }
            ],
            feedback: 'Excellent work on vocabulary recognition!',
            difficulty: 'beginner'
          },
          {
            gameId: '2',
            gameName: 'Fill in the Blanks',
            gameType: 'grammar',
            score: 24,
            maxScore: 30,
            accuracy: 80,
            timeSpent: 17,
            attempts: 1,
            mistakes: [
              {
                question: 'Mi ___ es muy alta.',
                userAnswer: 'hermana',
                correctAnswer: 'hermana',
                explanation: 'Good! "Hermana" means sister.',
                concept: 'Family relationships',
                difficulty: 'medium'
              }
            ],
            feedback: 'Good understanding of family relationships in context.',
            difficulty: 'intermediate'
          }
        ],
        overallFeedback: {
          title: 'Great Progress!',
          message: 'You showed strong vocabulary recognition and good understanding of family relationships. Keep practicing to improve your grammar accuracy.',
          type: 'success',
          icon: CheckCircle,
          color: 'from-green-400 to-green-600'
        },
        recommendations: [
          {
            id: '1',
            title: 'Practice Grammar Patterns',
            description: 'Focus on sentence structure with family vocabulary to improve accuracy.',
            type: 'practice',
            priority: 'medium',
            estimatedTime: 15,
            action: {
              text: 'Start Practice',
              onClick: () => console.log('Start grammar practice')
            }
          },
          {
            id: '2',
            title: 'Review Mistakes',
            description: 'Go through the questions you got wrong to reinforce learning.',
            type: 'review',
            priority: 'high',
            estimatedTime: 10,
            action: {
              text: 'Review Now',
              onClick: () => console.log('Review mistakes')
            }
          }
        ],
        strengths: [
          'Excellent vocabulary recognition',
          'Good pronunciation awareness',
          'Strong memory retention'
        ],
        improvementAreas: [
          'Grammar accuracy in context',
          'Sentence structure patterns',
          'Complex family relationships'
        ],
        nextSteps: [
          'Complete advanced family vocabulary',
          'Practice grammar exercises',
          'Try conversation practice'
        ]
      };
      
      setTimeout(() => {
        setFeedback(mockFeedback);
        setLoading(false);
      }, 1000);
    };

    loadFeedback();
  }, [assignmentId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="text-gray-500">Failed to load feedback. Please try again.</div>
      </div>
    );
  }

  const FeedbackIcon = feedback.overallFeedback.icon;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 student-font-display">
            Assignment Feedback
          </h1>
          <p className="text-gray-600">{feedback.assignmentTitle}</p>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Close
          </button>
        )}
      </div>

      {/* Overall Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${feedback.overallFeedback.color} rounded-xl p-6 text-white`}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <FeedbackIcon className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold student-font-display">
            {feedback.overallFeedback.title}
          </h2>
        </div>
        <p className="text-white/90">{feedback.overallFeedback.message}</p>
      </motion.div>

      {/* Performance Metrics */}
      <PerformanceMetrics feedback={feedback} />

      {/* Game Results */}
      <GameResultsBreakdown gameResults={feedback.gameResults} />

      {/* Recommendations */}
      <RecommendationsSection recommendations={feedback.recommendations} />

      {/* Strengths and Improvements */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h3 className="font-semibold text-green-900 mb-3 flex items-center">
            <ThumbsUp className="h-5 w-5 mr-2" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="text-green-800 text-sm flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                {strength}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {feedback.improvementAreas.map((area, index) => (
              <li key={index} className="text-blue-800 text-sm flex items-center">
                <Target className="h-4 w-4 mr-2 text-blue-600" />
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-4 pt-6">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        )}
        
        {onContinue && (
          <button
            onClick={onContinue}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            <span>Continue Learning</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
