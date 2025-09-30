'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, TrendingUp, Clock, Target, Award, Star,
  CheckCircle, AlertCircle, Calendar, Zap, Brain,
  BookOpen, Trophy, Gem, Heart, Users, Crown,
  ArrowUp, ArrowDown, Minus, ChevronRight
} from 'lucide-react';
import { useSupabase } from '../supabase/SupabaseProvider';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface AssignmentProgress {
  assignmentId: string;
  title: string;
  type: string;
  progress: number;
  score: number;
  maxScore: number;
  timeSpent: number; // in minutes
  completedSections: number;
  totalSections: number;
  lastActivity: Date;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpEarned: number;
  streakContribution: boolean;
}

interface ProgressMetrics {
  totalAssignments: number;
  completedAssignments: number;
  averageScore: number;
  totalTimeSpent: number;
  totalXpEarned: number;
  currentStreak: number;
  weeklyProgress: number[];
  strongestSubjects: string[];
  improvementAreas: string[];
}

interface AssignmentProgressTrackerProps {
  studentId?: string;
  assignments?: AssignmentProgress[];
  showDetailedView?: boolean;
}

// =====================================================
// PROGRESS RING COMPONENT
// =====================================================

const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showPercentage?: boolean;
}> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6',
  showPercentage = true
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-900">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
    );
  };

// =====================================================
// PROGRESS METRICS CARD
// =====================================================

const ProgressMetricsCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<any>;
  color: string;
}> = ({ title, value, change, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>

        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-sm ${change > 0 ? 'text-green-600' :
              change < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
            {change > 0 && <ArrowUp className="h-3 w-3" />}
            {change < 0 && <ArrowDown className="h-3 w-3" />}
            {change === 0 && <Minus className="h-3 w-3" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>

      <div className="text-2xl font-bold text-gray-900 mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
};

// =====================================================
// ASSIGNMENT PROGRESS ITEM
// =====================================================

const AssignmentProgressItem: React.FC<{
  assignment: AssignmentProgress;
  onClick?: () => void;
}> = ({ assignment, onClick }) => {
  const progressPercentage = (assignment.completedSections / assignment.totalSections) * 100;
  const scorePercentage = (assignment.score / assignment.maxScore) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      onClick={onClick}
      className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 student-font-display">
            {assignment.title}
          </h4>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(assignment.difficulty)}`}>
              {assignment.difficulty}
            </span>
            <span className="text-xs text-gray-500">{assignment.type}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">
            {assignment.completedSections}/{assignment.totalSections}
          </div>
          <div className="text-xs text-gray-500">sections</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {assignment.score}/{assignment.maxScore}
          </div>
          <div className="text-xs text-gray-500">Score</div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-900">
            {assignment.timeSpent}m
          </div>
          <div className="text-xs text-gray-500">Time</div>
        </div>

        <div>
          <div className="text-sm font-medium text-blue-600">
            +{assignment.xpEarned} XP
          </div>
          <div className="text-xs text-gray-500">Earned</div>
        </div>
      </div>

      {/* Last Activity */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>Last activity: {assignment.lastActivity.toLocaleDateString()}</span>
        </div>

        {assignment.streakContribution && (
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-500" />
            <span className="text-xs text-yellow-600">Streak</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// =====================================================
// MAIN ASSIGNMENT PROGRESS TRACKER COMPONENT
// =====================================================

export default function AssignmentProgressTracker({
  studentId,
  assignments = [],
  showDetailedView = false
}: AssignmentProgressTrackerProps) {
  const { supabase } = useSupabase();
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed'>('overview');
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetrics>({
    totalAssignments: 0,
    completedAssignments: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    totalXpEarned: 0,
    currentStreak: 0,
    weeklyProgress: [],
    strongestSubjects: [],
    improvementAreas: []
  });
  const [assignmentList, setAssignmentList] = useState<AssignmentProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // Load real assignment data
  useEffect(() => {
    if (studentId && supabase) {
      loadAssignmentProgress();
    }
  }, [studentId, supabase]);

  // Helper function to calculate weekly progress from actual data
  const calculateWeeklyProgress = async (submissions: any[]): Promise<number[]> => {
    const weeklyData = Array(7).fill(0);
    const now = new Date();

    submissions.forEach(submission => {
      if (submission.completed_at) {
        const completedDate = new Date(submission.completed_at);
        const daysAgo = Math.floor((now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysAgo < 7) {
          weeklyData[6 - daysAgo] = Math.max(weeklyData[6 - daysAgo], submission.best_score || 0);
        }
      }
    });

    return weeklyData;
  };

  // Helper function to analyze topic performance from vocabulary data
  const analyzeTopicPerformance = async (userId: string): Promise<{strongest: string[], needsImprovement: string[]}> => {
    try {
      // Get vocabulary performance grouped by topic
      const { data: vocabPerformance } = await supabase
        .from('word_performance_logs')
        .select(`
          was_correct,
          centralized_vocabulary!inner(
            topic_name,
            language
          )
        `)
        .eq('user_id', userId)
        .not('centralized_vocabulary.topic_name', 'is', null);

      if (!vocabPerformance || vocabPerformance.length === 0) {
        return {
          strongest: ['No data yet'],
          needsImprovement: []
        };
      }

      // Calculate accuracy by topic
      const topicScores: {[key: string]: {correct: number, total: number}} = {};

      vocabPerformance.forEach((log: any) => {
        const topic = log.centralized_vocabulary?.topic_name;
        const language = log.centralized_vocabulary?.language;
        
        if (topic && language) {
          const key = `${language.toUpperCase()} - ${topic}`;
          if (!topicScores[key]) {
            topicScores[key] = {correct: 0, total: 0};
          }
          topicScores[key].total += 1;
          if (log.was_correct) {
            topicScores[key].correct += 1;
          }
        }
      });

      // Calculate averages and sort
      const topicAverages = Object.entries(topicScores)
        .filter(([_, data]) => data.total >= 3) // Only topics with at least 3 attempts
        .map(([topic, data]) => ({
          topic,
          accuracy: (data.correct / data.total) * 100,
          attempts: data.total
        }))
        .sort((a, b) => b.accuracy - a.accuracy);

      const strongest = topicAverages.slice(0, 3).map(t => t.topic);
      const needsImprovement = topicAverages
        .filter(t => t.accuracy < 70)
        .slice(0, 3)
        .map(t => t.topic);

      return {
        strongest: strongest.length > 0 ? strongest : ['Keep practicing!'],
        needsImprovement: needsImprovement.length > 0 ? needsImprovement : []
      };
    } catch (error) {
      console.error('Error analyzing topic performance:', error);
      return {
        strongest: ['No data available'],
        needsImprovement: []
      };
    }
  };

  // Helper function to calculate current streak
  const calculateCurrentStreak = async (userId: string): Promise<number> => {
    try {
      const { data: sessions } = await supabase
        .from('enhanced_game_sessions')
        .select('created_at')
        .eq('student_id', userId)
        .order('created_at', { ascending: false })
        .limit(30);

      if (!sessions || sessions.length === 0) return 0;

      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < sessions.length; i++) {
        const sessionDate = new Date(sessions[i].created_at);
        sessionDate.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === streak) {
          streak++;
        } else if (daysDiff > streak) {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  };

  const loadAssignmentProgress = async () => {
    if (!studentId || !supabase) return;

    try {
      setLoading(true);

      // Get assignments for student's classes only (security: class-filtered)
      let assignmentData: any[] = [];

      // First get student's class enrollments
      const { data: enrollments } = await supabase
        .from('class_enrollments')
        .select('class_id')
        .eq('student_id', studentId);

      if (enrollments && enrollments.length > 0) {
        const classIds = enrollments.map(e => e.class_id);

        // Only get assignments from classes the student is enrolled in
        const { data: assignments, error } = await supabase
          .from('assignments')
          .select(`
            id,
            title,
            game_type,
            points
          `)
          .in('class_id', classIds); // Security: class-filtered

        if (error) {
          console.error('Error loading assignment progress:', error);
          return;
        }

        assignmentData = assignments || [];
      }



      // Get progress for this student - using enhanced_assignment_progress table
      const assignmentIds = assignmentData?.map(a => a.id) || [];
      const { data: progressData } = assignmentIds.length > 0 ? await supabase
        .from('enhanced_assignment_progress')
        .select('assignment_id, status, best_score, best_accuracy, total_time_spent, completed_at, updated_at')
        .eq('student_id', studentId)
        .in('assignment_id', assignmentIds) : { data: [] };

      // Create a map of progress by assignment_id
      const progressMap = new Map();
      (progressData || []).forEach(progress => {
        progressMap.set(progress.assignment_id, progress);
      });

      // Calculate metrics from real data
      const assignments = assignmentData || [];
      const completedAssignments = assignments.filter(a => {
        const progress = progressMap.get(a.id);
        return progress && progress.completed_at;
      });

      const totalScore = completedAssignments.reduce((sum, a) => {
        const progress = progressMap.get(a.id);
        return sum + (progress?.best_score || 0);
      }, 0);

      const averageScore = completedAssignments.length > 0 ?
        Math.round(totalScore / completedAssignments.length) : 0;

      const totalXpEarned = completedAssignments.reduce((sum, a) =>
        sum + (a.points || 0), 0
      );

      const totalTimeSpent = (progressData || []).reduce((sum, p) =>
        sum + (p.total_time_spent || 0), 0
      );

      // Create assignment progress objects for detailed view
      const assignmentProgressList: AssignmentProgress[] = assignments.map(assignment => {
        const progress = progressMap.get(assignment.id);
        const completed = progress?.completed_at !== null;
        const score = progress?.best_score || 0;
        const timeSpent = Math.round((progress?.total_time_spent || 0) / 60); // Convert to minutes

        return {
          assignmentId: assignment.id,
          title: assignment.title,
          type: assignment.game_type || 'Unknown',
          progress: completed ? 100 : 0,
          score: score,
          maxScore: 100, // Default max score since not stored in assignments
          timeSpent: timeSpent,
          completedSections: completed ? 1 : 0,
          totalSections: 1,
          lastActivity: progress?.updated_at ? new Date(progress.updated_at) : new Date(),
          difficulty: 'intermediate' as const, // Default since not stored in assignments
          xpEarned: completed ? (assignment.points || 0) : 0,
          streakContribution: completed
        };
      });

      // Create submission-like objects for analysis functions
      const submissionsForAnalysis = assignments.map(assignment => {
        const progress = progressMap.get(assignment.id);
        return {
          assignment_id: assignment.id,
          assignment: assignment,
          best_score: progress?.best_score || 0,
          completed_at: progress?.completed_at,
          status: progress?.status || 'not_started'
        };
      }).filter(s => s.best_score > 0 || s.completed_at); // Only include submissions with some progress

      // Calculate actual weekly progress from submissions
      const weeklyProgress = await calculateWeeklyProgress(submissionsForAnalysis);

      // Calculate strongest topics and improvement areas from vocabulary performance
      const topicAnalysis = await analyzeTopicPerformance(studentId);

      setProgressMetrics({
        totalAssignments: assignments.length,
        completedAssignments: completedAssignments.length,
        averageScore,
        totalTimeSpent: Math.round(totalTimeSpent / 60), // Convert seconds to minutes
        totalXpEarned,
        currentStreak: await calculateCurrentStreak(studentId),
        weeklyProgress,
        strongestSubjects: topicAnalysis.strongest,
        improvementAreas: topicAnalysis.needsImprovement
      });

      setAssignmentList(assignmentProgressList);

    } catch (error) {
      console.error('Error loading assignment progress:', error);
      // Keep default empty metrics
    } finally {
      setLoading(false);
    }
  };

  const completionRate = progressMetrics.totalAssignments > 0 ?
    (progressMetrics.completedAssignments / progressMetrics.totalAssignments) * 100 : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading assignment progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 student-font-display">
          Assignment Progress
        </h2>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedView('overview')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedView === 'overview'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedView('detailed')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedView === 'detailed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Detailed
          </button>
        </div>
      </div>

      {selectedView === 'overview' ? (
        <>
          {/* Overall Progress */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold student-font-display mb-2">
                  Overall Progress
                </h3>
                <p className="text-blue-100 mb-4">
                  {progressMetrics.completedAssignments} of {progressMetrics.totalAssignments} assignments completed
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{progressMetrics.averageScore}%</div>
                    <div className="text-blue-100 text-sm">Average Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{progressMetrics.totalTimeSpent}m</div>
                    <div className="text-blue-100 text-sm">Time Spent</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <ProgressRing
                  progress={completionRate}
                  size={100}
                  color="#FFFFFF"
                  showPercentage={true}
                />
                <div className="text-blue-100 text-sm mt-2">Completion Rate</div>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ProgressMetricsCard
              title="Total XP Earned"
              value={progressMetrics.totalXpEarned.toLocaleString()}
              icon={Gem}
              color="bg-blue-500"
            />

            <ProgressMetricsCard
              title="Current Streak"
              value={`${progressMetrics.currentStreak} days`}
              icon={Star}
              color="bg-orange-500"
            />

            <ProgressMetricsCard
              title="Assignments Done"
              value={progressMetrics.completedAssignments}
              icon={CheckCircle}
              color="bg-green-500"
            />

            <ProgressMetricsCard
              title="Average Score"
              value={`${progressMetrics.averageScore}%`}
              icon={Trophy}
              color="bg-purple-500"
            />
          </div>

          {/* Topic Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 student-font-display">
                Strongest Topics
              </h3>
              <div className="space-y-3">
                {progressMetrics.strongestSubjects.map((topic, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 student-font-display">
                Topics to Practice
              </h3>
              <div className="space-y-3">
                {progressMetrics.improvementAreas.map((area, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Target className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Detailed View */
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Showing detailed progress for all assignments
          </div>

          {assignmentList.length > 0 ? (
            assignmentList.map((assignment) => (
              <AssignmentProgressItem
                key={assignment.assignmentId}
                assignment={assignment}
                onClick={() => console.log('View assignment details:', assignment.assignmentId)}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No assignments to track yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Complete some assignments to see your progress here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
