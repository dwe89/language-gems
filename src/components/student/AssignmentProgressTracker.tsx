'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, TrendingUp, Clock, Target, Award, Star,
  CheckCircle, AlertCircle, Calendar, Zap, Brain,
  BookOpen, Trophy, Gem, Heart, Users, Crown,
  ArrowUp, ArrowDown, Minus, ChevronRight
} from 'lucide-react';

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
          <div className={`flex items-center space-x-1 text-sm ${
            change > 0 ? 'text-green-600' :
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

  // Mock data for demonstration
  useEffect(() => {
    const mockAssignments: AssignmentProgress[] = [
      {
        assignmentId: '1',
        title: 'Spanish Vocabulary: Family',
        type: 'vocabulary',
        progress: 85,
        score: 42,
        maxScore: 50,
        timeSpent: 25,
        completedSections: 4,
        totalSections: 5,
        lastActivity: new Date(Date.now() - 86400000),
        difficulty: 'beginner',
        xpEarned: 120,
        streakContribution: true
      },
      {
        assignmentId: '2',
        title: 'French Grammar: Present Tense',
        type: 'grammar',
        progress: 60,
        score: 28,
        maxScore: 40,
        timeSpent: 35,
        completedSections: 3,
        totalSections: 5,
        lastActivity: new Date(Date.now() - 172800000),
        difficulty: 'intermediate',
        xpEarned: 95,
        streakContribution: false
      },
      {
        assignmentId: '3',
        title: 'German Listening: Daily Conversations',
        type: 'listening',
        progress: 100,
        score: 38,
        maxScore: 40,
        timeSpent: 20,
        completedSections: 4,
        totalSections: 4,
        lastActivity: new Date(Date.now() - 259200000),
        difficulty: 'advanced',
        xpEarned: 180,
        streakContribution: true
      }
    ];

    const mockMetrics: ProgressMetrics = {
      totalAssignments: 12,
      completedAssignments: 8,
      averageScore: 82,
      totalTimeSpent: 240,
      totalXpEarned: 1450,
      currentStreak: 7,
      weeklyProgress: [65, 72, 78, 85, 82, 88, 92],
      strongestSubjects: ['Vocabulary', 'Listening'],
      improvementAreas: ['Grammar', 'Writing']
    };

    setProgressMetrics(mockMetrics);
  }, []);

  const completionRate = (progressMetrics.completedAssignments / progressMetrics.totalAssignments) * 100;

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
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'overview'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedView('detailed')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'detailed'
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
              change={12}
              icon={Gem}
              color="bg-blue-500"
            />
            
            <ProgressMetricsCard
              title="Current Streak"
              value={`${progressMetrics.currentStreak} days`}
              change={2}
              icon={Star}
              color="bg-orange-500"
            />
            
            <ProgressMetricsCard
              title="Assignments Done"
              value={progressMetrics.completedAssignments}
              change={8}
              icon={CheckCircle}
              color="bg-green-500"
            />
            
            <ProgressMetricsCard
              title="Average Score"
              value={`${progressMetrics.averageScore}%`}
              change={5}
              icon={Trophy}
              color="bg-purple-500"
            />
          </div>

          {/* Subject Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 student-font-display">
                Strongest Subjects
              </h3>
              <div className="space-y-3">
                {progressMetrics.strongestSubjects.map((subject, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900">{subject}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 student-font-display">
                Areas for Improvement
              </h3>
              <div className="space-y-3">
                {progressMetrics.improvementAreas.map((area, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Target className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span className="font-medium text-gray-900">{area}</span>
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
          
          {assignments.length > 0 ? (
            assignments.map((assignment) => (
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
