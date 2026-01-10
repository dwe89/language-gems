'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, Headphones, Mic, PenTool, BookOpen, 
  Star, Clipboard, Gamepad2, BookMarked, TrendingUp, 
  TrendingDown, Minus 
} from 'lucide-react';
import { AssessmentTypeSummary } from '@/services/teacherAssignmentAnalytics';
import { AssessmentCategory } from '@/services/teacherAssignmentAnalytics';

interface AssessmentTypeCardsProps {
  assessmentSummary: AssessmentTypeSummary[];
  onViewDetails?: (assessmentType: string) => void;
}

const ASSESSMENT_ICONS: Record<string, React.ComponentType<any>> = {
  'reading-comprehension': BookOpen,
  'aqa-reading': FileText,
  'aqa-listening': Headphones,
  'aqa-dictation': Mic,
  'aqa-writing': PenTool,
  'four-skills': Star,
  'exam-style': Clipboard,
  'vocabulary-game': Gamepad2,
  'grammar-practice': BookMarked,
  'gcse-reading': FileText,
  'gcse-listening': Headphones,
  'gcse-writing': PenTool,
  'gcse-dictation': Mic,
  'edexcel-listening': Headphones,
};

const ASSESSMENT_COLORS: Record<string, string> = {
  'reading-comprehension': 'blue',
  'aqa-reading': 'indigo',
  'aqa-listening': 'purple',
  'aqa-dictation': 'orange',
  'aqa-writing': 'green',
  'four-skills': 'yellow',
  'exam-style': 'red',
  'vocabulary-game': 'cyan',
  'grammar-practice': 'pink',
  'gcse-reading': 'indigo',
  'gcse-listening': 'purple',
  'gcse-writing': 'green',
  'gcse-dictation': 'orange',
  'edexcel-listening': 'purple',
};

export function AssessmentTypeCards({ assessmentSummary, onViewDetails }: AssessmentTypeCardsProps) {
  if (!assessmentSummary || assessmentSummary.length === 0) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getTrendIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <Minus className="h-4 w-4 text-yellow-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes === 0) return `${secs}s`;
    if (secs === 0) return `${minutes}m`;
    return `${minutes}m ${secs}s`;
  };

  const getColorClasses = (type: AssessmentCategory) => {
    const color = ASSESSMENT_COLORS[type] || 'gray';
    return {
      border: `border-${color}-200`,
      bg: `bg-${color}-50`,
      text: `text-${color}-700`,
      iconBg: `bg-${color}-100`,
      iconText: `text-${color}-600`,
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {assessmentSummary.map((summary) => {
        const Icon = ASSESSMENT_ICONS[summary.assessmentType] || FileText;
        const colors = getColorClasses(summary.assessmentType);
        const completionRate = summary.paperCount > 0 
          ? Math.round((summary.completedAttempts / summary.attempts) * 100)
          : 0;

        return (
          <Card 
            key={summary.assessmentType}
            className="group border-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden relative"
            onClick={() => onViewDetails?.(summary.assessmentType)}
          >
            <CardContent className="p-6">
              {/* Header with Icon and Badge */}
              <div className="flex items-start justify-between mb-5">
                <div className={`p-3 rounded-xl ${colors.iconBg} group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${colors.iconText}`} />
                </div>
                {getTrendIcon(summary.avgScore)}
              </div>

              {/* Title */}
              <h3 className={`text-lg font-bold mb-1 ${colors.text}`}>
                {summary.assessmentType.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </h3>

              {/* Large Score Display */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-extrabold tracking-tight ${getScoreColor(summary.avgScore)}`}>
                    {Math.round(summary.avgScore)}%
                  </span>
                  <span className="text-sm font-medium text-gray-500 mb-2">avg score</span>
                </div>
              </div>

              {/* Stats Grid with Better Spacing */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-xs font-medium text-gray-500 mb-1">Attempts</div>
                  <div className="text-xl font-bold text-gray-900">{summary.attempts}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-xs font-medium text-gray-500 mb-1">Papers</div>
                  <div className="text-xl font-bold text-gray-900">{summary.paperCount}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-xs font-medium text-gray-500 mb-1">Avg Time</div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatTime(Math.round(summary.avgTimeMinutes * 60))}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-xs font-medium text-gray-500 mb-1">Completion</div>
                  <div className={`text-xl font-bold ${getCompletionColor(completionRate)}`}>
                    {completionRate}%
                  </div>
                </div>
              </div>

              {/* Performance Indicator with Badge */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Performance</span>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  summary.avgScore >= 80 ? 'bg-green-100 text-green-700' :
                  summary.avgScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {summary.avgScore >= 80 ? 'Excellent' : 
                   summary.avgScore >= 60 ? 'Good' : 'Needs Support'}
                </span>
              </div>

              {/* Subtle Gradient Overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/40 to-transparent rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
