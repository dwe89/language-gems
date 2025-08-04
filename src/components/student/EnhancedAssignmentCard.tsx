'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Clock, Calendar, Star, CheckCircle, AlertCircle,
  PlayCircle, PauseCircle, RotateCcw, Trophy, Target,
  Zap, Heart, Brain, Users, Award, Gem, ChevronRight,
  Timer, BarChart3, TrendingUp, Flag, Lock, Unlock
} from 'lucide-react';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface Assignment {
  id: string;
  title: string;
  description: string;
  type: 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'speaking' | 'writing';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  dueDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  progress: number; // 0-100
  score?: number;
  maxScore: number;
  xpReward: number;
  language: string;
  topics: string[];
  requirements: string[];
  completedAt?: Date;
  attempts: number;
  maxAttempts: number;
  isLocked: boolean;
  prerequisites?: string[];
}

interface EnhancedAssignmentCardProps {
  assignment: Assignment;
  onStart?: (assignmentId: string) => void;
  onContinue?: (assignmentId: string) => void;
  onReview?: (assignmentId: string) => void;
  showDetails?: boolean;
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

const getTypeIcon = (type: Assignment['type']) => {
  switch (type) {
    case 'vocabulary': return BookOpen;
    case 'grammar': return Target;
    case 'listening': return Heart;
    case 'reading': return Brain;
    case 'speaking': return Users;
    case 'writing': return Award;
    default: return BookOpen;
  }
};

const getTypeColor = (type: Assignment['type']) => {
  switch (type) {
    case 'vocabulary': return 'from-blue-500 to-blue-600';
    case 'grammar': return 'from-green-500 to-green-600';
    case 'listening': return 'from-red-500 to-red-600';
    case 'reading': return 'from-purple-500 to-purple-600';
    case 'speaking': return 'from-orange-500 to-orange-600';
    case 'writing': return 'from-pink-500 to-pink-600';
    default: return 'from-gray-500 to-gray-600';
  }
};

const getDifficultyColor = (difficulty: Assignment['difficulty']) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-800';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'advanced': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: Assignment['status']) => {
  switch (status) {
    case 'completed': return 'text-green-600';
    case 'in_progress': return 'text-blue-600';
    case 'overdue': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const formatTimeRemaining = (dueDate: Date) => {
  const now = new Date();
  const timeLeft = dueDate.getTime() - now.getTime();
  
  if (timeLeft < 0) return 'Overdue';
  
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h left`;
  
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  return `${minutes}m left`;
};

// =====================================================
// ASSIGNMENT PROGRESS COMPONENT
// =====================================================

const AssignmentProgress: React.FC<{
  progress: number;
  status: Assignment['status'];
  score?: number;
  maxScore: number;
}> = ({ progress, status, score, maxScore }) => {
  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Progress</span>
        <span className="font-medium text-gray-900">{progress}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${
            status === 'completed' ? 'bg-green-500' :
            status === 'in_progress' ? 'bg-blue-500' :
            status === 'overdue' ? 'bg-red-500' : 'bg-gray-400'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      
      {/* Score Display */}
      {score !== undefined && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Score</span>
          <span className={`font-medium ${
            score >= maxScore * 0.8 ? 'text-green-600' :
            score >= maxScore * 0.6 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {score}/{maxScore}
          </span>
        </div>
      )}
    </div>
  );
};

// =====================================================
// ASSIGNMENT DETAILS COMPONENT
// =====================================================

const AssignmentDetails: React.FC<{
  assignment: Assignment;
  isExpanded: boolean;
}> = ({ assignment, isExpanded }) => {
  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-4 border-t border-gray-200 space-y-4">
            {/* Description */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600">{assignment.description}</p>
            </div>
            
            {/* Topics */}
            {assignment.topics.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Topics Covered</h4>
                <div className="flex flex-wrap gap-2">
                  {assignment.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Requirements */}
            {assignment.requirements.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                <ul className="space-y-1">
                  {assignment.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Prerequisites */}
            {assignment.prerequisites && assignment.prerequisites.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Prerequisites</h4>
                <div className="space-y-2">
                  {assignment.prerequisites.map((prereq, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <Lock className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600">{prereq}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Attempts */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Attempts</span>
              <span className="font-medium text-gray-900">
                {assignment.attempts}/{assignment.maxAttempts}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// =====================================================
// MAIN ENHANCED ASSIGNMENT CARD COMPONENT
// =====================================================

export default function EnhancedAssignmentCard({
  assignment,
  onStart,
  onContinue,
  onReview,
  showDetails = false
}: EnhancedAssignmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [isHovered, setIsHovered] = useState(false);

  const TypeIcon = getTypeIcon(assignment.type);
  const typeColor = getTypeColor(assignment.type);
  const difficultyColor = getDifficultyColor(assignment.difficulty);
  const statusColor = getStatusColor(assignment.status);
  
  const timeRemaining = formatTimeRemaining(assignment.dueDate);
  const isOverdue = assignment.status === 'overdue';
  const isCompleted = assignment.status === 'completed';
  const canStart = !assignment.isLocked && assignment.status === 'not_started';
  const canContinue = assignment.status === 'in_progress';
  const canReview = assignment.status === 'completed';

  const handlePrimaryAction = () => {
    if (canStart && onStart) {
      onStart(assignment.id);
    } else if (canContinue && onContinue) {
      onContinue(assignment.id);
    } else if (canReview && onReview) {
      onReview(assignment.id);
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-xl border-2 transition-all duration-200 ${
        assignment.isLocked ? 'border-gray-200 opacity-60' :
        isOverdue ? 'border-red-200 shadow-red-100' :
        isCompleted ? 'border-green-200 shadow-green-100' :
        'border-gray-200 hover:border-blue-300 hover:shadow-lg'
      }`}
      whileHover={!assignment.isLocked ? { scale: 1.02 } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${typeColor}`}>
              {assignment.isLocked ? (
                <Lock className="h-6 w-6 text-white" />
              ) : (
                <TypeIcon className="h-6 w-6 text-white" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 student-font-display">
                {assignment.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full ${difficultyColor}`}>
                  {assignment.difficulty}
                </span>
                <span className="text-xs text-gray-500">
                  {assignment.language}
                </span>
                <span className="text-xs text-gray-500">
                  ~{assignment.estimatedTime}min
                </span>
              </div>
            </div>
          </div>
          
          {/* Status & XP */}
          <div className="text-right">
            <div className={`text-sm font-medium ${statusColor}`}>
              {assignment.status.replace('_', ' ')}
            </div>
            <div className="flex items-center space-x-1 mt-1">
              <Gem className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-blue-600 font-medium">
                {assignment.xpReward} XP
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        {!assignment.isLocked && (
          <div className="mb-4">
            <AssignmentProgress
              progress={assignment.progress}
              status={assignment.status}
              score={assignment.score}
              maxScore={assignment.maxScore}
            />
          </div>
        )}

        {/* Due Date & Time */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Due {assignment.dueDate.toLocaleDateString()}</span>
          </div>
          
          <div className={`flex items-center space-x-1 text-sm ${
            isOverdue ? 'text-red-600' : 'text-gray-600'
          }`}>
            <Clock className="h-4 w-4" />
            <span>{timeRemaining}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span>Details</span>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </button>
          
          <div className="flex items-center space-x-2">
            {assignment.isLocked ? (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Lock className="h-4 w-4" />
                <span>Locked</span>
              </div>
            ) : (
              <motion.button
                onClick={handlePrimaryAction}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  canStart ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                  canContinue ? 'bg-green-500 hover:bg-green-600 text-white' :
                  canReview ? 'bg-purple-500 hover:bg-purple-600 text-white' :
                  'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={assignment.isLocked}
              >
                {canStart && (
                  <>
                    <PlayCircle className="h-4 w-4" />
                    <span>Start</span>
                  </>
                )}
                {canContinue && (
                  <>
                    <RotateCcw className="h-4 w-4" />
                    <span>Continue</span>
                  </>
                )}
                {canReview && (
                  <>
                    <BarChart3 className="h-4 w-4" />
                    <span>Review</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Assignment Details */}
        <AssignmentDetails assignment={assignment} isExpanded={isExpanded} />
      </div>

      {/* Hover Effects */}
      <AnimatePresence>
        {isHovered && !assignment.isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
