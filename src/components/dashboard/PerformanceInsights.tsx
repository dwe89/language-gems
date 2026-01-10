'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award,
  Users,
  Clock,
  Lightbulb
} from 'lucide-react';
import { StudentProgress } from '@/services/teacherAssignmentAnalytics';

interface PerformanceInsightsProps {
  students: StudentProgress[];
  classAverage: number;
  completionRate: number;
}

interface Insight {
  type: 'warning' | 'success' | 'info' | 'tip';
  icon: React.ReactNode;
  title: string;
  description: string;
  actionable?: string;
}

export function PerformanceInsights({ 
  students, 
  classAverage, 
  completionRate 
}: PerformanceInsightsProps) {
  const insights: Insight[] = [];

  // Calculate metrics
  const completedStudents = students.filter(s => s.status === 'completed');
  const atRiskStudents = completedStudents.filter(s => 
    s.successScore < 50 || 
    s.weakRetrievalPercent > 60 ||
    s.failureRate > 40
  );
  
  const strugglingStudents = completedStudents.filter(s => 
    s.successScore >= 50 && s.successScore < 65
  );

  const topPerformers = completedStudents.filter(s => 
    s.successScore >= 85
  );

  const needsInterventionCount = students.filter(s => 
    s.interventionFlag !== null && s.interventionFlag !== undefined
  ).length;

  const avgTime = completedStudents.reduce((sum, s) => 
    sum + s.timeSpentMinutes, 0
  ) / (completedStudents.length || 1);

  const fastFinishers = completedStudents.filter(s => 
    s.timeSpentMinutes < avgTime * 0.6 && s.successScore >= 80
  );

  const slowStruggers = completedStudents.filter(s => 
    s.timeSpentMinutes > avgTime * 1.5 && s.successScore < 60
  );

  // Generate insights

  // At-risk students
  if (atRiskStudents.length > 0) {
    insights.push({
      type: 'warning',
      icon: <AlertTriangle className="h-5 w-5" />,
      title: `${atRiskStudents.length} Student${atRiskStudents.length !== 1 ? 's' : ''} At Risk`,
      description: `${atRiskStudents.map(s => s.studentName).join(', ')} ${atRiskStudents.length === 1 ? 'is' : 'are'} scoring below 50% or showing high failure rates.`,
      actionable: 'Consider one-on-one intervention or additional support materials.'
    });
  }

  // Low completion rate
  if (completionRate < 70) {
    const notStarted = students.filter(s => s.status === 'not_started').length;
    const inProgress = students.filter(s => s.status === 'in_progress').length;
    
    insights.push({
      type: 'warning',
      icon: <Clock className="h-5 w-5" />,
      title: 'Low Completion Rate',
      description: `Only ${completionRate.toFixed(0)}% of students have completed this assignment. ${notStarted} haven't started, ${inProgress} in progress.`,
      actionable: 'Send reminder notifications or extend the deadline.'
    });
  }

  // Class performing well
  if (classAverage >= 75 && completionRate >= 80) {
    insights.push({
      type: 'success',
      icon: <Award className="h-5 w-5" />,
      title: 'Excellent Class Performance',
      description: `Class average of ${classAverage.toFixed(1)}% with ${completionRate.toFixed(0)}% completion rate.`,
      actionable: 'Consider moving to more challenging material.'
    });
  }

  // Top performers
  if (topPerformers.length >= 3) {
    insights.push({
      type: 'success',
      icon: <TrendingUp className="h-5 w-5" />,
      title: `${topPerformers.length} High Achievers`,
      description: `${topPerformers.map(s => s.studentName).join(', ')} scoring 85% or higher.`,
      actionable: 'Recognize achievement and provide enrichment opportunities.'
    });
  }

  // Needs intervention
  if (needsInterventionCount > 0) {
    insights.push({
      type: 'warning',
      icon: <Target className="h-5 w-5" />,
      title: `${needsInterventionCount} Student${needsInterventionCount !== 1 ? 's' : ''} Need Support`,
      description: 'Multiple indicators suggest these students would benefit from targeted intervention.',
      actionable: 'Review individual analytics and plan personalized support.'
    });
  }

  // Fast finishers with high scores
  if (fastFinishers.length > 0) {
    insights.push({
      type: 'info',
      icon: <TrendingUp className="h-5 w-5" />,
      title: 'Fast & Accurate Learners',
      description: `${fastFinishers.length} student${fastFinishers.length !== 1 ? 's' : ''} completed quickly with strong scores.`,
      actionable: 'These students may be ready for advanced challenges.'
    });
  }

  // Slow struggling students
  if (slowStruggers.length > 0) {
    insights.push({
      type: 'warning',
      icon: <TrendingDown className="h-5 w-5" />,
      title: 'Students Taking Longer with Lower Scores',
      description: `${slowStruggers.length} student${slowStruggers.length !== 1 ? 's' : ''} spending extra time but still struggling.`,
      actionable: 'May indicate comprehension issues requiring different teaching approach.'
    });
  }

  // Struggling but passing
  if (strugglingStudents.length >= 3) {
    insights.push({
      type: 'tip',
      icon: <Users className="h-5 w-5" />,
      title: 'Middle-Tier Group Identified',
      description: `${strugglingStudents.length} students scoring 50-65%. This group could benefit from focused support.`,
      actionable: 'Consider small group intervention or review sessions.'
    });
  }

  // General tip if doing okay but not great
  if (classAverage >= 60 && classAverage < 75 && insights.length < 3) {
    insights.push({
      type: 'tip',
      icon: <Lightbulb className="h-5 w-5" />,
      title: 'Room for Improvement',
      description: 'Class performance is solid but could be enhanced with targeted review.',
      actionable: 'Identify common weak areas and plan whole-class review activities.'
    });
  }

  if (insights.length === 0) {
    return null;
  }

  const typeColors = {
    warning: 'bg-red-50 border-red-200 text-red-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    tip: 'bg-yellow-50 border-yellow-200 text-yellow-900'
  };

  const iconColors = {
    warning: 'text-red-600',
    success: 'text-green-600',
    info: 'text-blue-600',
    tip: 'text-yellow-600'
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          Performance Insights & Recommendations
        </h3>
        
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-2 ${typeColors[insight.type]}`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 ${iconColors[insight.type]}`}>
                  {insight.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold mb-1">{insight.title}</h4>
                  <p className="text-sm mb-2 opacity-90">{insight.description}</p>
                  {insight.actionable && (
                    <p className="text-sm font-medium italic">
                      💡 {insight.actionable}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
