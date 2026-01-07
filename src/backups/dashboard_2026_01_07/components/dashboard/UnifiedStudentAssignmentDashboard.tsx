// Unified Student Assignment Dashboard
// Displays all assignments across games with consistent interface

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Clock, Target, Award, Play, CheckCircle, 
  AlertCircle, Calendar, TrendingUp, Brain, Gamepad2,
  Filter, Search, ArrowRight, Star, Trophy, Gem
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { supabaseBrowser } from '../auth/AuthProvider';
import { UnifiedAssignmentService } from '../../services/UnifiedAssignmentService';
import { UnifiedAssignment } from '../../interfaces/UnifiedAssignmentInterface';

interface AssignmentCardProps {
  assignment: UnifiedAssignment;
  onStartAssignment: (assignmentId: string, gameType: string) => void;
}

const GAME_ICONS: Record<string, React.ReactNode> = {
  'hangman': <Target className="w-5 h-5" />,
  'memory-game': <Brain className="w-5 h-5" />,
  'word-scramble': <Gamepad2 className="w-5 h-5" />,
  'vocab-blast': <Star className="w-5 h-5" />,
  'word-guesser': <BookOpen className="w-5 h-5" />,
  'noughts-crosses': <Trophy className="w-5 h-5" />,
  'vocab-master': <Gem className="w-5 h-5" />
};

const GAME_COLORS: Record<string, string> = {
  'hangman': 'from-purple-500 to-indigo-600',
  'memory-game': 'from-blue-500 to-cyan-600',
  'word-scramble': 'from-green-500 to-teal-600',
  'vocab-blast': 'from-yellow-500 to-orange-600',
  'word-guesser': 'from-pink-500 to-rose-600',
  'noughts-crosses': 'from-red-500 to-pink-600',
  'vocab-master': 'from-yellow-600 to-yellow-400'
};

const humanizeGameId = (id: string) => id.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

function AssignmentCard({ assignment, onStartAssignment }: AssignmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const isOverdue = assignment.dueDate && new Date() > assignment.dueDate && assignment.status !== 'completed';
  const actualStatus = isOverdue ? 'overdue' : assignment.status;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Header with game type indicator */}
      <div className={`h-2 bg-gradient-to-r ${GAME_COLORS[assignment.gameType] || 'from-gray-400 to-gray-500'}`} />
      
      <div className="p-6">
        {/* Title and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{assignment.title}</h3>
            {assignment.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{assignment.description}</p>
            )}
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(actualStatus)}`}>
            {getStatusIcon(actualStatus)}
            <span className="capitalize">{actualStatus.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Game and Curriculum Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {GAME_ICONS[assignment.gameType] || <Gamepad2 className="w-4 h-4" />}
            <span className="capitalize">{assignment.gameType.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Gem className="w-4 h-4" />
            <span>{assignment.vocabularyConfig.curriculumLevel || 'KS3'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BookOpen className="w-4 h-4" />
            <span>{assignment.vocabularyConfig.wordCount || 20} words</span>
          </div>
        </div>

        {/* Due Date */}
        {assignment.dueDate && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Calendar className="w-4 h-4" />
            <span>Due: {assignment.dueDate.toLocaleDateString()}</span>
          </div>
        )}

        {/* Progress Bar (if started) */}
        {assignment.status === 'in_progress' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>In Progress</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full w-1/3"></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onStartAssignment(assignment.assignmentId, assignment.gameType)}
          disabled={assignment.status === 'completed'}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            assignment.status === 'completed'
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : `bg-gradient-to-r ${GAME_COLORS[assignment.gameType] || 'from-blue-500 to-indigo-600'} text-white hover:shadow-lg transform hover:scale-105`
          }`}
        >
          {assignment.status === 'completed' ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Completed
            </>
          ) : assignment.status === 'in_progress' ? (
            <>
              <Play className="w-4 h-4" />
              Continue Assignment
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start Assignment
            </>
          )}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export default function UnifiedStudentAssignmentDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<UnifiedAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [assignmentService] = useState(() => new UnifiedAssignmentService(supabaseBrowser));

  useEffect(() => {
    if (user) {
      loadAssignments();
    }
  }, [user]);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allAssignments = await assignmentService.getStudentAssignments(user!.id);
      setAssignments(allAssignments);
    } catch (err: any) {
      console.error('Error loading assignments:', err);
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssignment = async (assignmentId: string, gameType: string) => {
    try {
      // Fetch assignment details to get vocabulary criteria
      const response = await fetch(`/api/assignments/${assignmentId}/vocabulary`);
      if (!response.ok) {
        throw new Error('Failed to fetch assignment details');
      }

      const data = await response.json();
      const assignment = data.assignment;
      const config = assignment.config || {};

      // Check if it's an assessment assignment
      if (assignment.game_type === 'assessment') {
        // For assessment assignments, navigate to the assessment assignment page
        window.location.href = `/assessments/assignment/${assignmentId}`;
        return;
      }

      // Check if it's a multi-game assignment
      const isMultiGame = config.multiGame && config.selectedGames?.length > 1;
      if (isMultiGame) {
        // For multi-game assignments, navigate to the multi-game assignment page
        window.location.href = `/games/multi-game?assignment=${assignmentId}&mode=assignment`;
        return;
      }

      // Extract vocabulary criteria from assignment config
      const vocabularyConfig = config.vocabularyConfig || config;

      // Map game types to their URL paths
      const gameRoutes: Record<string, string> = {
        'hangman': '/games/hangman',
        'memory-game': '/games/memory-game',
        'word-scramble': '/games/word-scramble',
        'vocab-blast': '/games/vocab-blast',
        'vocab-master': '/games/vocab-master',
        'word-guesser': '/games/word-guesser',
        'noughts-crosses': '/games/noughts-crosses',
        'vocabulary-mining': '/games/vocabulary-mining',
        'word-blast': '/games/word-blast',
        'detective-listening': '/games/detective-listening',
        'multi-game': '/games/multi-game'
      };

      const gamePath = gameRoutes[gameType];
      if (!gamePath) {
        console.error('Unknown game type:', gameType);
        return;
      }

      // Build URL parameters from assignment vocabulary criteria
      const params = new URLSearchParams();

      // Language mapping (default to Spanish if not specified)
      const language = vocabularyConfig.language || 'es';
      params.set('lang', language);

      // Level (curriculum level)
      const level = assignment.curriculum_level || 'KS3';
      params.set('level', level);

      // Category and subcategory
      const category = vocabularyConfig.category || vocabularyConfig.theme || 'basics_core_language';
      const subcategory = vocabularyConfig.subcategory || vocabularyConfig.topic || 'greetings_introductions';
      params.set('cat', category);
      params.set('subcat', subcategory);

      // Theme (default to 'default')
      const theme = vocabularyConfig.theme || 'default';
      params.set('theme', theme);

      // Add assignment mode parameters
      params.set('assignment', assignmentId);
      params.set('mode', 'assignment');

  const gameUrl = `${gamePath}?${params.toString()}`;
      console.log('🚀 Navigating to assignment game:', gameUrl);
      window.location.href = gameUrl;

    } catch (error) {
      console.error('Error starting assignment:', error);
      // Fallback to old method if new method fails
      const gameRoutes: Record<string, string> = {
        'hangman': '/games/hangman/assignment',
        'memory-game': '/games/memory-game/assignment',
        'word-scramble': '/games/word-scramble/assignment',
        'vocab-blast': '/games/vocab-blast/assignment',
        'vocab-master': '/games/vocab-master/assignment',
        'word-guesser': '/games/word-guesser/assignment',
        'noughts-crosses': '/games/noughts-crosses/assignment'
      };

      const route = gameRoutes[gameType];
      if (route) {
        window.location.href = `${route}/${assignmentId}`;
      } else {
        console.error('Unknown game type:', gameType);
      }
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    // Apply status filter
    const now = new Date();
    const isOverdue = assignment.dueDate && now > assignment.dueDate && assignment.status !== 'completed';
    
    let statusMatch = true;
    switch (filter) {
      case 'active':
        statusMatch = assignment.status === 'active' || assignment.status === 'in_progress';
        break;
      case 'completed':
        statusMatch = assignment.status === 'completed';
        break;
      case 'overdue':
        statusMatch = !!isOverdue;
        break;
    }

    // Apply search filter
    const searchMatch = !searchTerm || 
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.gameType.toLowerCase().includes(searchTerm.toLowerCase());

    return statusMatch && searchMatch;
  });

  const getFilterCounts = () => {
    const now = new Date();
    return {
      all: assignments.length,
      active: assignments.filter(a => a.status === 'active' || a.status === 'in_progress').length,
      completed: assignments.filter(a => a.status === 'completed').length,
      overdue: assignments.filter(a => a.dueDate && now > a.dueDate && a.status !== 'completed').length
    };
  };

  const filterCounts = getFilterCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Assignments</h1>
          <p className="text-lg text-gray-600">Complete your language learning assignments across all games</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Status Filters */}
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'All', count: filterCounts.all },
                { key: 'active', label: 'Active', count: filterCounts.active },
                { key: 'completed', label: 'Completed', count: filterCounts.completed },
                { key: 'overdue', label: 'Overdue', count: filterCounts.overdue }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === key
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error loading assignments</span>
            </div>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}

        {/* Assignments Grid */}
        {filteredAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.assignmentId}
                  assignment={assignment}
                  onStartAssignment={handleStartAssignment}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No assignments yet' : `No ${filter} assignments`}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Your teacher will assign language learning activities here.'
                : `You don't have any ${filter} assignments at the moment.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
