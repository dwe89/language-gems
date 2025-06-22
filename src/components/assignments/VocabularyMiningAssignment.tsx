'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { VocabularyMiningService } from '../../services/vocabulary-mining';
import { ProgressDashboard } from '../vocabulary-mining/ProgressDashboard';
import { 
  VocabularyGem, 
  GemCollection, 
  DailyGoal,
  TopicPerformance 
} from '../../types/vocabulary-mining';
import { 
  calculateDailyGoalProgress,
  formatDuration 
} from '../../utils/vocabulary-mining';
import { 
  Pickaxe, 
  Target, 
  Zap, 
  Calendar, 
  TrendingUp,
  CheckCircle,
  Play,
  Clock,
  Star,
  Trophy,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface VocabularyMiningAssignmentProps {
  assignment: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    points: number;
    miningSettings: {
      targetGems: number;
      targetMastery: number;
      allowReview: boolean;
      spacedRepetition: boolean;
      difficultyAdaptive: boolean;
      topicFocus: string[];
      gemTypes: string[];
      dailyGoal: number;
      streakTarget: number;
    };
  };
  onComplete?: () => void;
}

export function VocabularyMiningAssignment({ 
  assignment, 
  onComplete 
}: VocabularyMiningAssignmentProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [miningService] = useState(() => new VocabularyMiningService(supabase));
  
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({
    gemsCollected: 0,
    masteryPercentage: 0,
    currentStreak: 0,
    dailyGoalProgress: 0,
    isComplete: false
  });
  const [gemCollection, setGemCollection] = useState<GemCollection[]>([]);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);
  const [topicPerformance, setTopicPerformance] = useState<TopicPerformance[]>([]);

  useEffect(() => {
    if (user) {
      loadAssignmentProgress();
    }
  }, [user, assignment.id]);

  const loadAssignmentProgress = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Load student's progress
      const summary = await miningService.getStudentProgressSummary(user.id);
      const gems = await miningService.getGemCollection(user.id);
      const goal = await miningService.getDailyGoal(user.id);
      const topics = await miningService.getTopicPerformance(user.id);
      
      setGemCollection(gems);
      setDailyGoal(goal);
      setTopicPerformance(topics);
      
      // Calculate assignment-specific progress
      const masteryPercentage = gems.length > 0 
        ? Math.round((gems.filter(g => g.masteryLevel >= 4).length / gems.length) * 100)
        : 0;
      
      const dailyGoalProgress = goal ? calculateDailyGoalProgress(
        goal.wordsPracticed,
        assignment.miningSettings.dailyGoal,
        goal.minutesPracticed,
        15 // Default target minutes
      ).overallProgress : 0;
      
      const isComplete = 
        gems.length >= assignment.miningSettings.targetGems &&
        masteryPercentage >= assignment.miningSettings.targetMastery &&
        summary.currentStreak >= assignment.miningSettings.streakTarget;
      
      setProgress({
        gemsCollected: gems.length,
        masteryPercentage,
        currentStreak: summary.currentStreak,
        dailyGoalProgress,
        isComplete
      });
      
      if (isComplete && onComplete) {
        onComplete();
      }
      
    } catch (error) {
      console.error('Error loading assignment progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBgColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-3 bg-yellow-500 rounded-xl mr-4">
            <Pickaxe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{assignment.title}</h3>
            <p className="text-gray-600">{assignment.description}</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <Trophy className="w-4 h-4 mr-1" />
              <span>{assignment.points} points</span>
            </div>
          </div>
        </div>
        
        {progress.isComplete && (
          <div className="flex items-center bg-green-100 text-green-800 px-3 py-2 rounded-full">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Complete!</span>
          </div>
        )}
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Gems Collected</span>
            <Target className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline">
            <span className={`text-2xl font-bold ${getProgressColor(progress.gemsCollected, assignment.miningSettings.targetGems)}`}>
              {progress.gemsCollected}
            </span>
            <span className="text-gray-500 ml-1">/ {assignment.miningSettings.targetGems}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBgColor(progress.gemsCollected, assignment.miningSettings.targetGems)}`}
              style={{ width: `${Math.min(100, (progress.gemsCollected / assignment.miningSettings.targetGems) * 100)}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Mastery Level</span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="flex items-baseline">
            <span className={`text-2xl font-bold ${getProgressColor(progress.masteryPercentage, assignment.miningSettings.targetMastery)}`}>
              {progress.masteryPercentage}%
            </span>
            <span className="text-gray-500 ml-1">/ {assignment.miningSettings.targetMastery}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBgColor(progress.masteryPercentage, assignment.miningSettings.targetMastery)}`}
              style={{ width: `${Math.min(100, (progress.masteryPercentage / assignment.miningSettings.targetMastery) * 100)}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Current Streak</span>
            <Zap className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="flex items-baseline">
            <span className={`text-2xl font-bold ${getProgressColor(progress.currentStreak, assignment.miningSettings.streakTarget)}`}>
              {progress.currentStreak}
            </span>
            <span className="text-gray-500 ml-1">/ {assignment.miningSettings.streakTarget}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBgColor(progress.currentStreak, assignment.miningSettings.streakTarget)}`}
              style={{ width: `${Math.min(100, (progress.currentStreak / assignment.miningSettings.streakTarget) * 100)}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Daily Goal</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline">
            <span className={`text-2xl font-bold ${progress.dailyGoalProgress >= 100 ? 'text-green-600' : 'text-gray-600'}`}>
              {progress.dailyGoalProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${progress.dailyGoalProgress >= 100 ? 'bg-green-500' : 'bg-gray-400'}`}
              style={{ width: `${Math.min(100, progress.dailyGoalProgress)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Assignment Requirements */}
      <div className="bg-white rounded-lg p-4 border mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Assignment Requirements</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Target Gems:</span>
            <span className="font-medium">{assignment.miningSettings.targetGems}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Target Mastery:</span>
            <span className="font-medium">{assignment.miningSettings.targetMastery}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Streak Target:</span>
            <span className="font-medium">{assignment.miningSettings.streakTarget} days</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Daily Goal:</span>
            <span className="font-medium">{assignment.miningSettings.dailyGoal} gems/day</span>
          </div>
        </div>
        
        {assignment.miningSettings.gemTypes.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <span className="text-sm text-gray-600 block mb-2">Allowed Gem Types:</span>
            <div className="flex flex-wrap gap-2">
              {assignment.miningSettings.gemTypes.map(type => (
                <span 
                  key={type}
                  className="px-2 py-1 rounded-full text-xs font-medium text-white capitalize"
                  style={{ 
                    backgroundColor: 
                      type === 'common' ? '#94a3b8' :
                      type === 'uncommon' ? '#22c55e' :
                      type === 'rare' ? '#3b82f6' :
                      type === 'epic' ? '#a855f7' : '#f59e0b'
                  }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/student-dashboard/vocabulary-mining/practice"
          className="flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Mining
        </Link>
        
        {assignment.miningSettings.allowReview && (
          <Link
            href="/student-dashboard/vocabulary-mining/review"
            className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
          >
            <Clock className="w-4 h-4 mr-2" />
            Review Gems
          </Link>
        )}
        
        <Link
          href="/student-dashboard/vocabulary-mining"
          className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          View Progress
        </Link>
      </div>

      {/* Completion Status */}
      {!progress.isComplete && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm text-blue-800">
              Keep mining to complete this assignment! You're making great progress.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
