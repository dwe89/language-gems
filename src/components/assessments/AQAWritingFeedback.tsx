'use client';

import React from 'react';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  BookOpen,
  PenTool,
  Star,
  Target,
  Clock,
  ArrowRight
} from 'lucide-react';
import type { MarkingResult } from '../../services/aiMarkingService';

interface AQAWritingFeedbackProps {
  totalScore: number;
  maxScore: number;
  percentage: number;
  questionResults: MarkingResult[];
  overallFeedback: string;
  timeSpent: number;
  language: string;
  difficulty: 'foundation' | 'higher';
  isAssignmentMode?: boolean;
  onRetry: () => void;
  onBackToMenu: () => void;
}

export function AQAWritingFeedback({
  totalScore,
  maxScore,
  percentage,
  questionResults,
  overallFeedback,
  timeSpent,
  language,
  difficulty,
  isAssignmentMode = false,
  onRetry,
  onBackToMenu
}: AQAWritingFeedbackProps) {
  const languageNames = {
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German'
  };

  const getGradeInfo = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A*', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    if (percentage >= 50) return { grade: 'D', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
    if (percentage >= 40) return { grade: 'E', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    return { grade: 'U', color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
  };

  const gradeInfo = getGradeInfo(percentage);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionTitle = (index: number, difficulty: string) => {
    if (difficulty === 'foundation') {
      const titles = [
        'Photo Description',
        'Short Message',
        'Gap Fill',
        'Translation',
        'Extended Writing'
      ];
      return titles[index] || `Question ${index + 1}`;
    } else {
      const titles = [
        'Translation',
        'Extended Writing',
        'Advanced Writing'
      ];
      return titles[index] || `Question ${index + 1}`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className={`p-4 rounded-full ${gradeInfo.bgColor} ${gradeInfo.borderColor} border-2`}>
            <CheckCircle className={`h-12 w-12 ${gradeInfo.color}`} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
        <p className="text-gray-600">
          AQA Writing Assessment - {languageNames[language as keyof typeof languageNames]} {difficulty === 'foundation' ? 'Foundation' : 'Higher'}
        </p>
      </div>

      {/* Score Summary */}
      <div className={`${gradeInfo.bgColor} ${gradeInfo.borderColor} border-2 rounded-xl p-6 mb-8`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className={`text-4xl font-bold ${gradeInfo.color} mb-2`}>
              {gradeInfo.grade}
            </div>
            <p className="text-sm text-gray-600">Grade</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {totalScore}/{maxScore}
            </div>
            <p className="text-sm text-gray-600">Marks</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {percentage}%
            </div>
            <p className="text-sm text-gray-600">Score</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {formatTime(timeSpent)}
            </div>
            <p className="text-sm text-gray-600">Time</p>
          </div>
        </div>
      </div>

      {/* Overall Feedback */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Star className="h-6 w-6 text-yellow-500 mr-2" />
          Overall Feedback
        </h2>
        <p className="text-gray-700 leading-relaxed">{overallFeedback}</p>
      </div>

      {/* Question-by-Question Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Target className="h-6 w-6 text-blue-500 mr-2" />
          Question Results
        </h2>
        
        <div className="space-y-6">
          {questionResults.map((result, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">
                  Question {index + 1}: {getQuestionTitle(index, difficulty)}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    result.percentage >= 70 
                      ? 'bg-green-100 text-green-800' 
                      : result.percentage >= 50 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {result.score}/{result.maxScore} marks
                  </span>
                  <span className="text-sm text-gray-500">({result.percentage}%)</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-3">{result.feedback}</p>
              
              {result.detailedFeedback.strengths.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-medium text-green-700 mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Strengths
                  </h4>
                  <ul className="list-disc list-inside text-sm text-green-600 space-y-1">
                    {result.detailedFeedback.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.detailedFeedback.improvements.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-medium text-orange-700 mb-2 flex items-center">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    Areas for Improvement
                  </h4>
                  <ul className="list-disc list-inside text-sm text-orange-600 space-y-1">
                    {result.detailedFeedback.improvements.map((improvement, i) => (
                      <li key={i}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.detailedFeedback.grammarErrors && result.detailedFeedback.grammarErrors.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-700 mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Grammar Points
                  </h4>
                  <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                    {result.detailedFeedback.grammarErrors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRetry}
          className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          <PenTool className="h-5 w-5 mr-2" />
          Try Again
        </button>
        <button
          onClick={onBackToMenu}
          className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          <BookOpen className="h-5 w-5 mr-2" />
          {isAssignmentMode ? 'Back to Assignment' : 'Back to Assessments'}
        </button>
      </div>

      {/* Study Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Study Tips for Next Time
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Writing Skills:</h4>
            <ul className="space-y-1">
              <li>• Practice verb conjugations daily</li>
              <li>• Build vocabulary with flashcards</li>
              <li>• Read texts in {languageNames[language as keyof typeof languageNames]}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Exam Technique:</h4>
            <ul className="space-y-1">
              <li>• Plan your writing before starting</li>
              <li>• Check word counts regularly</li>
              <li>• Leave time for proofreading</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
