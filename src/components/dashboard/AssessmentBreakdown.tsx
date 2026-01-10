'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, ChevronUp, FileText, Award, Clock, 
  TrendingUp, Users, CheckCircle, AlertCircle 
} from 'lucide-react';
import { AssessmentTypeSummary } from '@/services/teacherAssignmentAnalytics';
import { getAssessmentTypeDisplayName } from '@/utils/assignmentTypeDetector';

interface AssessmentBreakdownProps {
  assessmentSummary: AssessmentTypeSummary[];
  onViewDetails?: (assessmentType: string) => void;
  onViewStudentBreakdown?: (assessmentType: string) => void;
}

export function AssessmentBreakdown({ assessmentSummary, onViewDetails, onViewStudentBreakdown }: AssessmentBreakdownProps) {
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());

  if (!assessmentSummary || assessmentSummary.length === 0) {
    return null;
  }

  const toggleExpanded = (assessmentType: string) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(assessmentType)) {
      newExpanded.delete(assessmentType);
    } else {
      newExpanded.add(assessmentType);
    }
    setExpandedTypes(newExpanded);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Assessment Breakdown
        </CardTitle>
        <p className="text-sm text-slate-600 mt-1">
          Performance by assessment type • {assessmentSummary.length} type{assessmentSummary.length !== 1 ? 's' : ''}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {assessmentSummary.map((summary) => {
          const isExpanded = expandedTypes.has(summary.assessmentType);
          const displayName = getAssessmentTypeDisplayName(summary.assessmentType as any);
          
          return (
            <div 
              key={summary.assessmentType}
              className="border rounded-lg overflow-hidden transition-all hover:shadow-md"
            >
              {/* Summary Header */}
              <div 
                className="p-4 bg-slate-50 cursor-pointer"
                onClick={() => toggleExpanded(summary.assessmentType)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{displayName}</h3>
                      <p className="text-sm text-slate-600">
                        {summary.paperCount} paper{summary.paperCount !== 1 ? 's' : ''} • 
                        {summary.attempts} attempt{summary.attempts !== 1 ? 's' : ''} • 
                        {summary.completedAttempts} completed
                      </p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 mr-4">
                    <div className={`px-4 py-2 rounded-lg border-2 ${getScoreColor(summary.avgScore)}`}>
                      <div className="flex items-center gap-2">
                        {getScoreIcon(summary.avgScore)}
                        <div>
                          <p className="text-xs font-medium">Avg Score</p>
                          <p className="text-xl font-bold">{summary.avgScore}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">{summary.avgTimeMinutes}m</span>
                      </div>
                      <p className="text-xs text-slate-500">avg time</p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(summary.assessmentType);
                    }}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-4 border-t bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Papers */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Papers</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">{summary.paperCount}</p>
                      <p className="text-xs text-blue-700 mt-1">
                        {summary.paperCount === 1 ? 'Unique paper' : 'Different papers'}
                      </p>
                    </div>

                    {/* Completion Rate */}
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Completion</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900">
                        {summary.attempts > 0 ? Math.round((summary.completedAttempts / summary.attempts) * 100) : 0}%
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        {summary.completedAttempts} of {summary.attempts} finished
                      </p>
                    </div>

                    {/* Performance */}
                    <div className={`p-4 rounded-lg border ${getScoreColor(summary.avgScore)}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4" />
                        <span className="text-sm font-medium">Performance</span>
                      </div>
                      <p className="text-2xl font-bold">{summary.avgScore}%</p>
                      <p className="text-xs mt-1">
                        {summary.avgScore >= 80 ? 'Excellent' : summary.avgScore >= 60 ? 'Good' : 'Needs Work'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {(onViewDetails || onViewStudentBreakdown) && (
                    <div className="flex gap-2">
                      {onViewStudentBreakdown && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => onViewStudentBreakdown(summary.assessmentType)}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          View Student Details
                        </Button>
                      )}
                      {onViewDetails && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => onViewDetails(summary.assessmentType)}
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          View Question Breakdown
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Insights */}
                  {summary.avgScore < 60 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-900">Action Needed</p>
                          <p className="text-xs text-amber-700 mt-1">
                            Class performance is below target. Consider reviewing content or providing additional support.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {summary.avgScore >= 80 && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-900">Great Performance!</p>
                          <p className="text-xs text-green-700 mt-1">
                            Students are demonstrating strong understanding of this content.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
