'use client';

import React from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  ArrowRight,
  Lightbulb,
  Target,
  TrendingUp,
} from 'lucide-react';

interface CriteriaScore {
  score: number;
  max: number;
  feedback?: string;
}

interface ErrorDetail {
  type: 'grammar' | 'vocabulary' | 'pronunciation' | 'structure';
  issue: string;
  correction?: string;
  example?: string;
}

interface GradingDisplayProps {
  questionNumber: number;
  totalQuestions: number;
  score: number;
  maxScore: number;
  criteriaScores: Record<string, CriteriaScore>;
  criteriaMet: Record<string, boolean>;
  errors: ErrorDetail[];
  feedback: string;
  suggestions: string[];
  onNext: () => void;
  isLastQuestion?: boolean;
  className?: string;
}

export function GradingDisplay({
  questionNumber,
  totalQuestions,
  score,
  maxScore,
  criteriaScores,
  criteriaMet,
  errors,
  feedback,
  suggestions,
  onNext,
  isLastQuestion = false,
  className = '',
}: GradingDisplayProps) {
  // Calculate percentage
  const percentage = Math.round((score / maxScore) * 100);

  // Get performance level
  const getPerformanceLevel = () => {
    if (percentage >= 90) return { label: 'Excellent!', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (percentage >= 70) return { label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (percentage >= 50) return { label: 'Satisfactory', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { label: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const performance = getPerformanceLevel();

  // Get stars based on percentage
  const getStars = () => {
    if (percentage >= 90) return 5;
    if (percentage >= 80) return 4;
    if (percentage >= 60) return 3;
    if (percentage >= 40) return 2;
    return 1;
  };

  const stars = getStars();

  // Format criteria name for display
  const formatCriteriaName = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get error type icon and color
  const getErrorStyle = (type: string) => {
    switch (type) {
      case 'grammar':
        return { color: 'text-red-600', bg: 'bg-red-50', label: 'Grammar' };
      case 'vocabulary':
        return { color: 'text-purple-600', bg: 'bg-purple-50', label: 'Vocabulary' };
      case 'pronunciation':
        return { color: 'text-orange-600', bg: 'bg-orange-50', label: 'Pronunciation' };
      case 'structure':
        return { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Structure' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', label: 'Other' };
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* Header with score */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Question {questionNumber} of {totalQuestions}
        </h3>
        
        {/* Score display */}
        <div className="flex items-center gap-2">
          <span className={`text-3xl font-bold ${performance.color}`}>
            {score}/{maxScore}
          </span>
          
          {/* Stars */}
          <div className="flex items-center gap-0.5 ml-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Performance badge */}
      <div className={`inline-flex items-center self-start px-4 py-2 rounded-full ${performance.bgColor}`}>
        <span className={`text-sm font-medium ${performance.color}`}>
          {performance.label}
        </span>
      </div>

      {/* Criteria breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Criteria Breakdown
          </h4>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {/* Criteria scores */}
          {Object.entries(criteriaScores).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between px-4 py-3">
              <span className="text-gray-700 dark:text-gray-300">
                {formatCriteriaName(key)}
              </span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${(value.score / value.max) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                  {value.score}/{value.max}
                </span>
              </div>
            </div>
          ))}

          {/* Criteria met checklist */}
          {Object.entries(criteriaMet).length > 0 && (
            <div className="px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {Object.entries(criteriaMet).map(([key, met]) => (
                  <div
                    key={key}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
                      met
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {met ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <span>{formatCriteriaName(key)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Errors section */}
      {errors.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-3 bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800">
            <h4 className="font-medium text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Corrections ({errors.length})
            </h4>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {errors.map((error, index) => {
              const style = getErrorStyle(error.type);
              return (
                <div key={index} className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.color}`}>
                      {style.label}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white">
                        {error.issue}
                      </p>
                      {error.correction && (
                        <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                          ✓ {error.correction}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Feedback section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Feedback
            </h4>
            <p className="text-blue-800 dark:text-blue-200">
              {feedback}
            </p>
          </div>
        </div>
      </div>

      {/* Suggestions section */}
      {suggestions.length > 0 && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                Tips for Improvement
              </h4>
              <ul className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-purple-800 dark:text-purple-200 flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Next button */}
      <button
        onClick={onNext}
        className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 
                 text-white font-medium rounded-lg transition-colors shadow-md"
      >
        <span>{isLastQuestion ? 'View Results' : 'Next Question'}</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default GradingDisplay;
