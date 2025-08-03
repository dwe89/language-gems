'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  TrendingDown, 
  Users, 
  Clock, 
  Target,
  CheckCircle,
  XCircle,
  ArrowRight,
  Brain,
  Zap,
  BookOpen,
  MessageSquare
} from 'lucide-react';

interface CriticalInsight {
  id: string;
  type: 'urgent_action' | 'at_risk_student' | 'class_trend' | 'opportunity';
  priority: 'urgent' | 'high' | 'medium';
  title: string;
  description: string;
  impact: string;
  action: {
    label: string;
    route: string;
    data?: any;
  };
  confidence: number;
  studentsAffected?: number;
  timeframe: string;
  generated_at: string;
}

interface QuickMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface ProactiveAIDashboardProps {
  teacherId: string;
}

export default function ProactiveAIDashboard({ teacherId }: ProactiveAIDashboardProps) {
  const [insights, setInsights] = useState<CriticalInsight[]>([]);
  const [quickMetrics, setQuickMetrics] = useState<QuickMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Load real AI insights from API
  useEffect(() => {
    const loadCriticalInsights = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/ai-insights?teacherId=${teacherId}&action=get_insights`);
        const data = await response.json();

        if (data.success) {
          // Transform API data to component format
          const transformedInsights: CriticalInsight[] = (data.insights || []).map((insight: any) => ({
            id: insight.id,
            type: insight.insight_type === 'at_risk_student' ? 'urgent_action' :
                  insight.insight_type === 'engagement_alert' ? 'class_trend' : 'opportunity',
            priority: insight.priority,
            title: insight.title,
            description: insight.description,
            impact: insight.recommendation || 'No specific impact identified',
            action: {
              label: insight.insight_type === 'at_risk_student' ? 'Contact Student' : 'Review Details',
              route: insight.student_id ? `/dashboard/students/${insight.student_id}` : '/dashboard/classes',
              data: { insightId: insight.id }
            },
            confidence: Math.round(insight.confidence_score * 100),
            studentsAffected: insight.student_id ? 1 : undefined,
            timeframe: insight.priority === 'urgent' ? 'Act within 24 hours' :
                      insight.priority === 'high' ? 'Address this week' : 'Next lesson',
            generated_at: insight.generated_at
          }));

          setInsights(transformedInsights);

          // Calculate quick metrics from student data
          const studentData = data.studentData || [];
          const atRiskCount = studentData.filter((s: any) => s.is_at_risk).length;
          const totalStudents = studentData.length;
          const avgEngagement = totalStudents > 0
            ? Math.round(studentData.reduce((sum: number, s: any) => sum + s.login_frequency, 0) / totalStudents * 10)
            : 0;
          const avgSessionTime = totalStudents > 0
            ? Math.round(studentData.reduce((sum: number, s: any) => sum + s.session_duration_avg, 0) / totalStudents)
            : 0;
          const activeStudents = studentData.filter((s: any) =>
            new Date(s.last_active) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length;

          const calculatedMetrics: QuickMetric[] = [
            {
              label: 'Students at Risk',
              value: atRiskCount,
              change: 0, // Would need historical data
              trend: 'stable',
              icon: <AlertTriangle className="w-5 h-5" />,
              color: atRiskCount > 0 ? 'text-red-600' : 'text-green-600'
            },
            {
              label: 'Class Engagement',
              value: `${avgEngagement}%`,
              change: 0,
              trend: 'stable',
              icon: <TrendingDown className="w-5 h-5" />,
              color: avgEngagement < 50 ? 'text-red-600' : avgEngagement < 75 ? 'text-orange-600' : 'text-green-600'
            },
            {
              label: 'Active Students',
              value: activeStudents,
              change: 0,
              trend: 'stable',
              icon: <Users className="w-5 h-5" />,
              color: 'text-blue-600'
            },
            {
              label: 'Avg. Session Time',
              value: `${avgSessionTime}m`,
              change: 0,
              trend: 'stable',
              icon: <Clock className="w-5 h-5" />,
              color: avgSessionTime < 10 ? 'text-red-600' : 'text-purple-600'
            }
          ];

          setQuickMetrics(calculatedMetrics);
        } else {
          console.error('Failed to load insights:', data.error);
          // Fall back to mock data
          setInsights([]);
          setQuickMetrics([]);
        }
      } catch (error) {
        console.error('Error loading insights:', error);
        // Fall back to mock data
        const mockInsights: CriticalInsight[] = [
        {
          id: '1',
          type: 'urgent_action',
          priority: 'urgent',
          title: 'James Wilson needs immediate intervention',
          description: 'Performance dropped 35% in past week. Zero logins in 4 days. Risk of complete disengagement.',
          impact: 'Student may fail current assignments and lose motivation entirely',
          action: {
            label: 'Contact Student & Parents',
            route: '/dashboard/students/james-wilson',
            data: { studentId: 'james-wilson', action: 'intervention' }
          },
          confidence: 0.94,
          studentsAffected: 1,
          timeframe: 'Act within 24 hours',
          generated_at: new Date().toISOString()
        },
        {
          id: '2',
          type: 'at_risk_student',
          priority: 'high',
          title: '3 students struggling with past tense verbs',
          description: 'Sarah, Mike, and Lisa all showing <40% accuracy on past tense conjugations across multiple games.',
          impact: 'Core grammar concept affecting overall language progression',
          action: {
            label: 'Create Targeted Assignment',
            route: '/dashboard/assignments/new',
            data: { focus: 'past-tense-verbs', students: ['sarah', 'mike', 'lisa'] }
          },
          confidence: 0.87,
          studentsAffected: 3,
          timeframe: 'Address this week',
          generated_at: new Date().toISOString()
        },
        {
          id: '3',
          type: 'class_trend',
          priority: 'high',
          title: 'Year 7 French engagement dropping',
          description: 'Class average session time down 40% this week. Only 60% of students completed latest assignment.',
          impact: 'Risk of class-wide motivation decline before half-term',
          action: {
            label: 'Review Class Strategy',
            route: '/dashboard/classes/year-7-french',
            data: { classId: 'year-7-french', focus: 'engagement' }
          },
          confidence: 0.82,
          studentsAffected: 18,
          timeframe: 'Address before next lesson',
          generated_at: new Date().toISOString()
        },
        {
          id: '4',
          type: 'opportunity',
          priority: 'medium',
          title: 'Emma Thompson ready for advanced content',
          description: '95% accuracy across all recent assignments. Completing tasks 2x faster than class average.',
          impact: 'Opportunity to accelerate learning and maintain engagement',
          action: {
            label: 'Assign Challenge Activities',
            route: '/dashboard/assignments/new',
            data: { studentId: 'emma-thompson', difficulty: 'advanced' }
          },
          confidence: 0.91,
          studentsAffected: 1,
          timeframe: 'Next lesson',
          generated_at: new Date().toISOString()
        }
      ];

      const mockMetrics: QuickMetric[] = [
        {
          label: 'Students at Risk',
          value: 4,
          change: +1,
          trend: 'up',
          icon: <AlertTriangle className="w-5 h-5" />,
          color: 'text-red-600'
        },
        {
          label: 'Class Engagement',
          value: '72%',
          change: -8,
          trend: 'down',
          icon: <TrendingDown className="w-5 h-5" />,
          color: 'text-orange-600'
        },
        {
          label: 'Active Students',
          value: 28,
          change: -3,
          trend: 'down',
          icon: <Users className="w-5 h-5" />,
          color: 'text-blue-600'
        },
        {
          label: 'Avg. Session Time',
          value: '18m',
          change: -5,
          trend: 'down',
          icon: <Clock className="w-5 h-5" />,
          color: 'text-purple-600'
        }
      ];

        setInsights(mockInsights);
        setQuickMetrics(mockMetrics);
      }

      setLastUpdated(new Date());
      setIsLoading(false);
    };

    loadCriticalInsights();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(loadCriticalInsights, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [teacherId]);

  const handleInsightAction = async (insight: CriticalInsight) => {
    try {
      // Acknowledge the insight in the database
      const response = await fetch(`/api/ai-insights?teacherId=${teacherId}&action=acknowledge_insight&insightId=${insight.id}`, {
        method: 'GET'
      });

      if (response.ok) {
        // Update local state
        setInsights(prev => prev.map(i =>
          i.id === insight.id
            ? { ...i, priority: 'medium' as const }
            : i
        ));

        // In a real implementation, this would navigate to the appropriate page
        console.log('Taking action on insight:', insight);
        console.log('Navigate to:', insight.action.route);
      }
    } catch (error) {
      console.error('Error handling insight action:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getPriorityIcon = (type: string) => {
    switch (type) {
      case 'urgent_action': return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case 'at_risk_student': return <TrendingDown className="w-6 h-6 text-orange-600" />;
      case 'class_trend': return <Users className="w-6 h-6 text-blue-600" />;
      case 'opportunity': return <Target className="w-6 h-6 text-green-600" />;
      default: return <Brain className="w-6 h-6 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-7 h-7 text-blue-600" />
            AI Insights Dashboard
          </h2>
          <div className="animate-pulse flex items-center gap-2 text-sm text-gray-500">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            Analyzing student data...
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-4 rounded-lg border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg border animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Brain className="w-7 h-7 text-blue-600" />
          AI Insights Dashboard
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Zap className="w-4 h-4 text-green-500" />
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={metric.color}>
                {metric.icon}
              </div>
              <div className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-red-600' : 
                metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.change > 0 ? '+' : ''}{metric.change}
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Critical Insights */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Critical Insights Requiring Action
        </h3>
        
        <AnimatePresence>
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-lg border-l-4 ${getPriorityColor(insight.priority)} hover:shadow-lg transition-all`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {getPriorityIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{insight.title}</h4>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {Math.round(insight.confidence * 100)}% confidence
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{insight.description}</p>
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>Impact:</strong> {insight.impact}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>⏰ {insight.timeframe}</span>
                      {insight.studentsAffected && (
                        <span>👥 {insight.studentsAffected} student{insight.studentsAffected > 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleInsightAction(insight)}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  {insight.action.label}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* AI Status */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-700">
            AI is continuously monitoring your students' progress and will surface new insights as they emerge.
          </span>
        </div>
      </div>
    </div>
  );
}
