'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, Users, Gamepad2, FileCheck, Settings, Edit } from 'lucide-react';
import { StepProps } from '../types/AssignmentTypes';

// Import game definitions to map IDs to objects
const AVAILABLE_GAMES = [
  { id: 'vocabulary-mining', name: 'Vocabulary Mining', estimatedTime: '10-20 min', features: ['Gem collection', 'Spaced repetition', 'Voice recognition'] },
  { id: 'memory-game', name: 'Memory Match', estimatedTime: '5-10 min', features: ['Memory training', 'Visual learning'] },
  { id: 'hangman', name: 'Hangman', estimatedTime: '3-7 min', features: ['Classic gameplay', 'Letter guessing'] },
  { id: 'word-blast', name: 'Word Blast', estimatedTime: '5-12 min', features: ['Action gameplay', 'Visual effects'] },
  { id: 'noughts-and-crosses', name: 'Tic-Tac-Toe Vocabulary', estimatedTime: '3-8 min', features: ['Strategic gameplay', 'Quick questions'] },
  { id: 'word-scramble', name: 'Word Scramble', estimatedTime: '4-8 min', features: ['Letter manipulation', 'Spelling practice'] },
  { id: 'vocab-blast', name: 'Vocab Blast', estimatedTime: '5-12 min', features: ['Themed adventures', 'Fast-paced action'] },
  { id: 'speed-builder', name: 'Speed Builder', estimatedTime: '5-10 min', features: ['Drag & drop', 'Grammar focus'] },
  { id: 'sentence-towers', name: 'Sentence Towers', estimatedTime: '6-12 min', features: ['Tower building', 'Complex grammar'] },
  { id: 'conjugation-duel', name: 'Conjugation Duel', estimatedTime: '10-20 min', features: ['Battle system', 'League progression'] },
  { id: 'sentence-builder', name: 'Sentence Builder', estimatedTime: '5-10 min', features: ['Fragment assembly', 'Grammar rules'] },
  { id: 'detective-listening', name: 'Detective Listening', estimatedTime: '8-15 min', features: ['Audio comprehension', 'Detective theme'] }
];

const getGameById = (id: string) => AVAILABLE_GAMES.find(game => game.id === id) || { id, name: 'Unknown Game', estimatedTime: 'N/A', features: [] };

export default function ReviewStep({
  assignmentDetails,
  gameConfig,
  assessmentConfig,
  onStepComplete,
  classes,
}: StepProps) {

  // This step is always completed when reached
  useEffect(() => {
    onStepComplete('review', true);
  }, [onStepComplete]);

  const selectedClasses = classes.filter(cls => assignmentDetails.selectedClasses.includes(cls.id));
  const totalStudents = selectedClasses.reduce((sum, cls) => sum + (cls.student_count || 0), 0);
  
  const hasGames = gameConfig.selectedGames.length > 0;
  const hasAssessments = assessmentConfig.selectedAssessments.length > 0;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Review & Launch</h2>
        <p className="text-sm text-gray-600">Review your assignment details before creating</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Assignment Details */}
        <div className="space-y-6">
          {/* Basic Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Assignment Details
              </h3>
              <button className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Title:</span>
                <p className="text-gray-900 font-medium">{assignmentDetails.title || 'Untitled Assignment'}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600">Description:</span>
                <p className="text-gray-900 text-sm">{assignmentDetails.description || 'No description provided'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due Date:
                  </span>
                  <p className="text-gray-900 text-sm">{formatDate(assignmentDetails.dueDate)}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Est. Time:
                  </span>
                  <p className="text-gray-900 text-sm">{assignmentDetails.estimatedTime} minutes</p>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Classes ({selectedClasses.length}):
                </span>
                <div className="mt-1 space-y-1">
                  {selectedClasses.map(cls => (
                    <div key={cls.id} className="text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded">
                      {cls.name} ({cls.student_count || 0} students)
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Total: {totalStudents} students</p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              <Settings className="h-5 w-5 text-gray-500 mr-2" />
              Assignment Settings
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${assignmentDetails.allowLateSubmissions ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={assignmentDetails.allowLateSubmissions ? 'text-gray-900' : 'text-gray-500'}>
                  Late submissions {assignmentDetails.allowLateSubmissions ? 'allowed' : 'not allowed'}
                </span>
              </div>
              
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${assignmentDetails.showResults ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={assignmentDetails.showResults ? 'text-gray-900' : 'text-gray-500'}>
                  Results {assignmentDetails.showResults ? 'shown' : 'hidden'}
                </span>
              </div>
              
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${assignmentDetails.randomizeOrder ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={assignmentDetails.randomizeOrder ? 'text-gray-900' : 'text-gray-500'}>
                  Order {assignmentDetails.randomizeOrder ? 'randomized' : 'fixed'}
                </span>
              </div>
              
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                <span className="text-gray-900">Max attempts: {assignmentDetails.maxAttempts}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Activities */}
        <div className="space-y-6">
          {/* Games */}
          {hasGames && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Gamepad2 className="h-5 w-5 text-blue-500 mr-2" />
                  Practice Games ({gameConfig.selectedGames.length})
                </h3>
                <button className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="space-y-2">
                {gameConfig.selectedGames.map((gameId, index) => {
                  const game = getGameById(gameId);
                  return (
                    <div key={gameId} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{game.name}</p>
                          <p className="text-xs text-gray-600">{game.estimatedTime} • {game.features.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Assessments */}
          {hasAssessments && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileCheck className="h-5 w-5 text-indigo-500 mr-2" />
                  Assessments ({assessmentConfig.selectedAssessments.length})
                </h3>
                <button className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
              
              <div className="space-y-2">
                {assessmentConfig.selectedAssessments.map((assessment, index) => (
                  <div key={assessment.id} className="p-3 bg-indigo-50 rounded">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{assessment.name}</p>
                        <p className="text-xs text-gray-600">{assessment.estimatedTime} • {assessment.skills?.join(', ') || 'Assessment skills'}</p>
                      </div>
                    </div>
                    
                    <div className="ml-9 grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <span>
                        Language: <span className="font-medium text-indigo-700">
                          {assessment.instanceConfig?.language || assessmentConfig.generalLanguage}
                        </span>
                      </span>
                      <span>
                        Difficulty: <span className="font-medium text-indigo-700">
                          {assessment.instanceConfig?.difficulty || assessmentConfig.generalDifficulty}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {assignmentDetails.instructions && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions for Students</h3>
              <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">{assignmentDetails.instructions}</p>
            </div>
          )}
        </div>
      </div>

      {/* Final Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-5">
        <div className="flex items-center mb-3">
          <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Ready to Launch</h3>
        </div>
        <p className="text-gray-700 text-sm mb-3">
          Your assignment is configured and ready to be created. It will be assigned to {totalStudents} students across {selectedClasses.length} class{selectedClasses.length !== 1 ? 'es' : ''}.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{hasGames ? gameConfig.selectedGames.length : 0}</div>
            <div className="text-gray-600">Practice Games</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{hasAssessments ? assessmentConfig.selectedAssessments.length : 0}</div>
            <div className="text-gray-600">Assessments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalStudents}</div>
            <div className="text-gray-600">Students</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
