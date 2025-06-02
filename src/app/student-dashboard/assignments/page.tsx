'use client';

import React from 'react';
import { Hexagon, Clock, CheckCircle, BookOpen, Gamepad2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Assignment = {
  id: string;
  title: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'not-started';
  progress?: number;
  gemType: 'purple' | 'blue' | 'yellow' | 'green' | 'red';
  gameCount?: number;
  activities?: string[];
};

// Assignment Card Component
const AssignmentCard = ({ 
  assignment 
}: { 
  assignment: Assignment 
}) => {
  const gemColors = {
    'purple': 'text-purple-500',
    'blue': 'text-blue-500',
    'yellow': 'text-yellow-500',
    'green': 'text-green-500',
    'red': 'text-red-500'
  };
  
  const statusColors = {
    'completed': 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'not-started': 'bg-gray-100 text-gray-800'
  };
  
  const statusText = {
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'not-started': 'Not Started'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex items-center mb-4">
        <div className={`${gemColors[assignment.gemType]} mr-4`}>
          <Hexagon className="h-10 w-10" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900">{assignment.title}</h3>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock className="h-4 w-4 mr-1" />
            <span>Due: {assignment.dueDate}</span>
          </div>
          {assignment.gameCount && (
            <div className="flex items-center text-sm text-indigo-600 mt-1">
              <Gamepad2 className="h-4 w-4 mr-1" />
              <span>{assignment.gameCount} games included</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className={`${statusColors[assignment.status]} inline-flex items-center px-3 py-1 rounded-full text-xs font-medium`}>
          {assignment.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
          {statusText[assignment.status]}
        </div>
        
        {assignment.activities && assignment.activities.length > 0 && (
          <div className="text-xs text-gray-500">
            {assignment.activities.slice(0, 2).join(', ')}
            {assignment.activities.length > 2 && ` +${assignment.activities.length - 2} more`}
          </div>
        )}
      </div>
      
      {assignment.status === 'in-progress' && assignment.progress !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress: {assignment.progress}%</span>
            <span>{Math.round((assignment.progress / 100) * (assignment.gameCount || 1))} / {assignment.gameCount || 1} activities</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300" 
              style={{ width: `${assignment.progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="flex space-x-2">
        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center">
          {assignment.status === 'completed' ? 'Review Assignment' : 'Continue Assignment'}
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
        {assignment.status !== 'completed' && (
          <Link 
            href="/student-dashboard/games"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
          >
            Free Play
          </Link>
        )}
      </div>
    </div>
  );
};

export default function AssignmentsPage() {
  // Sample data with enhanced information
  const currentAssignments: Assignment[] = [
    {
      id: '1',
      title: 'Basic Spanish Verbs',
      dueDate: 'Tomorrow, 11:59 PM',
      status: 'in-progress',
      progress: 75,
      gemType: 'purple',
      gameCount: 4,
      activities: ['Gem Collector', 'Translation Tycoon', 'Speed Builder', 'Vocabulary Quiz']
    },
    {
      id: '2',
      title: 'French Vocabulary Quiz',
      dueDate: 'Today, 5:00 PM',
      status: 'not-started',
      gemType: 'blue',
      gameCount: 2,
      activities: ['Memory Game', 'Word Blast']
    },
    {
      id: '3',
      title: 'German Grammar Exercise',
      dueDate: 'Friday, 3:00 PM',
      status: 'not-started',
      gemType: 'yellow',
      gameCount: 3,
      activities: ['Hangman', 'Sentence Towers', 'Grammar Challenge']
    }
  ];
  
  const completedAssignments: Assignment[] = [
    {
      id: '4',
      title: 'Italian Pronunciation',
      dueDate: 'Yesterday',
      status: 'completed',
      gemType: 'green',
      gameCount: 2,
      activities: ['Pronunciation Game', 'Audio Matching']
    },
    {
      id: '5',
      title: 'Spanish Conversation',
      dueDate: 'May 10, 2023',
      status: 'completed',
      gemType: 'red',
      gameCount: 5,
      activities: ['Dialogue Builder', 'Role Play', 'Conversation Practice']
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">📚 Assignments</h1>
          <p className="text-indigo-100 mt-2">Complete teacher-set tasks to earn assignment grades</p>
        </div>
        <Link 
          href="/student-dashboard/games"
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Gamepad2 className="h-4 w-4" />
          <span>Free Play Games</span>
        </Link>
      </div>

      {/* Mode Info Banner */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">🎯 Assignment Mode</h2>
            <p className="text-gray-600">Guided learning with teacher-set goals and deadlines</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <p className="text-gray-700 font-medium mb-2">✨ Assignment Benefits:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Structured learning path designed by your teacher</li>
                <li>• Grades count towards your course progress</li>
                <li>• Targeted practice on specific topics</li>
                <li>• Clear deadlines to keep you on track</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link 
                href="/student-dashboard/games"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                🎮 Free Play Instead
              </Link>
              <Link 
                href="/student-dashboard/progress"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                📊 View Progress
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Current Assignments */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">⏰ Current Assignments</h2>
          <div className="flex items-center space-x-4">
            <span className="text-indigo-600 font-medium">{currentAssignments.length} assignments</span>
            {currentAssignments.some(a => a.status === 'in-progress') && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {currentAssignments.filter(a => a.status === 'in-progress').length} in progress
              </span>
            )}
          </div>
        </div>
        
        {currentAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-500 mb-4">No current assignments. Check back later for new tasks.</p>
            <Link 
              href="/student-dashboard/games"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🎮 Play Games for Fun
            </Link>
          </div>
        )}
      </div>
      
      {/* Completed Assignments */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">✅ Completed Assignments</h2>
          <span className="text-green-600 font-medium">{completedAssignments.length} completed</span>
        </div>
        
        {completedAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No completed assignments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
} 