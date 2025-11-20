'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Clock, Target, Award, BookOpen,
  CheckCircle, AlertCircle, Calendar, FileText, Headphones,
  Eye, Brain, Zap, Star, ChevronRight, PlayCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useSupabase } from '../../../components/supabase/SupabaseProvider';
import PendingAssessmentsList from '../../../components/student/PendingAssessmentsList';

interface AssessmentResult {
  id: string;
  assessment_type: 'listening' | 'reading' | 'speaking' | 'writing';
  curriculum_level: string;
  exam_board: string;
  difficulty: 'foundation' | 'higher';
  score: number;
  max_score: number;
  percentage: number;
  completed_at: string;
  time_taken: number;
  questions_correct: number;
  questions_total: number;
}

interface AssessmentAnalytics {
  totalAssessments: number;
  averageScore: number;
  bestScore: number;
  recentTrend: 'improving' | 'declining' | 'stable';
  byType: {
    listening: { count: number; average: number; best: number };
    reading: { count: number; average: number; best: number };
    speaking: { count: number; average: number; best: number };
    writing: { count: number; average: number; best: number };
  };
  byLevel: {
    foundation: { count: number; average: number };
    higher: { count: number; average: number };
  };
  recentResults: AssessmentResult[];
  weakAreas: string[];
  strongAreas: string[];
}

export default function AssessmentsAnalyticsPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [analytics, setAnalytics] = useState<AssessmentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'all' | 'listening' | 'reading' | 'speaking' | 'writing'>('all');

  useEffect(() => {
    if (user?.id) {
      loadAssessmentAnalytics();
    }
  }, [user?.id]);

  const loadAssessmentAnalytics = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Query assessment sessions from enhanced_game_sessions
      // Assessment types: reading-comprehension, gcse-reading, gcse-listening, gcse-writing, dictation, four-skills
      const assessmentTypes = [
        'reading-comprehension',
        'gcse-reading',
        'gcse-listening',
        'gcse-writing',
        'dictation',
        'four-skills'
      ];

      const { data: assessmentSessions, error: assessmentError } = await supabase
        .from('enhanced_game_sessions')
        .select('*')
        .eq('student_id', user.id)
        .in('game_type', assessmentTypes)
        .not('ended_at', 'is', null)
        .order('ended_at', { ascending: false });

      if (assessmentError) {
        console.error('Error loading assessments:', assessmentError);
        // Fall back to empty state
        setAnalytics({
          totalAssessments: 0,
          averageScore: 0,
          bestScore: 0,
          recentTrend: 'stable',
          byType: {
            listening: { count: 0, average: 0, best: 0 },
            reading: { count: 0, average: 0, best: 0 },
            speaking: { count: 0, average: 0, best: 0 },
            writing: { count: 0, average: 0, best: 0 }
          },
          byLevel: {
            foundation: { count: 0, average: 0 },
            higher: { count: 0, average: 0 }
          },
          recentResults: [],
          weakAreas: [],
          strongAreas: []
        });
        return;
      }

      // If no assessment results found, show empty state
      if (!assessmentSessions || assessmentSessions.length === 0) {
        setAnalytics({
          totalAssessments: 0,
          averageScore: 0,
          bestScore: 0,
          recentTrend: 'stable',
          byType: {
            listening: { count: 0, average: 0, best: 0 },
            reading: { count: 0, average: 0, best: 0 },
            speaking: { count: 0, average: 0, best: 0 },
            writing: { count: 0, average: 0, best: 0 }
          },
          byLevel: {
            foundation: { count: 0, average: 0 },
            higher: { count: 0, average: 0 }
          },
          recentResults: [],
          weakAreas: [],
          strongAreas: []
        });
        return;
      }

      // Process real assessment data from sessions
      const totalAssessments = assessmentSessions.length;
      const averageScore = totalAssessments > 0
        ? assessmentSessions.reduce((sum, session) => sum + (session.accuracy_percentage || 0), 0) / totalAssessments
        : 0;
      const bestScore = totalAssessments > 0
        ? Math.max(...assessmentSessions.map(session => session.accuracy_percentage || 0))
        : 0;

      // Calculate trend (simplified)
      const recentTrend = totalAssessments >= 2
        ? (assessmentSessions[0].accuracy_percentage || 0) > (assessmentSessions[1].accuracy_percentage || 0) ? 'improving' : 'declining'
        : 'stable';

      // Group by type
      const byType = {
        listening: { count: 0, average: 0, best: 0 },
        reading: { count: 0, average: 0, best: 0 },
        speaking: { count: 0, average: 0, best: 0 },
        writing: { count: 0, average: 0, best: 0 }
      };

      // Map game_type to assessment type
      const mapGameTypeToAssessmentType = (gameType: string): string => {
        if (gameType === 'reading-comprehension' || gameType === 'gcse-reading') return 'reading';
        if (gameType === 'gcse-listening') return 'listening';
        if (gameType === 'gcse-writing') return 'writing';
        if (gameType === 'dictation') return 'listening'; // Dictation is a listening skill
        if (gameType === 'four-skills') return 'reading'; // Default to reading
        return 'reading';
      };

      assessmentSessions.forEach(session => {
        const type = mapGameTypeToAssessmentType(session.game_type) as keyof typeof byType;
        if (byType[type]) {
          byType[type].count++;
          byType[type].average += session.accuracy_percentage || 0;
          byType[type].best = Math.max(byType[type].best, session.accuracy_percentage || 0);
        }
      });

      // Calculate averages
      Object.keys(byType).forEach(type => {
        const typeKey = type as keyof typeof byType;
        if (byType[typeKey].count > 0) {
          byType[typeKey].average = byType[typeKey].average / byType[typeKey].count;
        }
      });

      // Group by level - extract from session_data
      const byLevel = {
        foundation: { count: 0, average: 0 },
        higher: { count: 0, average: 0 }
      };

      assessmentSessions.forEach(session => {
        const sessionData = session.session_data as any;
        const difficulty = sessionData?.difficulty || 'foundation';
        const level = difficulty as keyof typeof byLevel;
        if (byLevel[level]) {
          byLevel[level].count++;
          byLevel[level].average += session.accuracy_percentage || 0;
        }
      });

      // Calculate level averages
      Object.keys(byLevel).forEach(level => {
        const levelKey = level as keyof typeof byLevel;
        if (byLevel[levelKey].count > 0) {
          byLevel[levelKey].average = byLevel[levelKey].average / byLevel[levelKey].count;
        }
      });

      const processedAnalytics: AssessmentAnalytics = {
        totalAssessments,
        averageScore: Math.round(averageScore * 10) / 10,
        bestScore,
        recentTrend,
        byType,
        byLevel,
        recentResults: assessmentSessions.slice(0, 5).map(session => {
          const sessionData = session.session_data as any;
          return {
            id: session.id,
            assessment_type: mapGameTypeToAssessmentType(session.game_type) as AssessmentResult['assessment_type'],
            curriculum_level: sessionData?.level || 'KS3',
            exam_board: sessionData?.examBoard || 'General',
            difficulty: sessionData?.difficulty || 'foundation',
            score: session.final_score || 0,
            max_score: session.max_score_possible || 100,
            percentage: session.accuracy_percentage || 0,
            completed_at: session.ended_at || session.created_at,
            time_taken: session.duration_seconds || 0,
            questions_correct: session.words_correct || 0,
            questions_total: session.words_attempted || 0
          };
        }),
        weakAreas: [], // Could be calculated from detailed results
        strongAreas: [] // Could be calculated from detailed results
      };

      setAnalytics(processedAnalytics);

    } catch (error) {
      console.error('Error loading assessment analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'listening': return Headphones;
      case 'reading': return BookOpen;
      case 'speaking': return Brain;
      case 'writing': return FileText;
      default: return Target;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'listening': return 'bg-blue-500';
      case 'reading': return 'bg-green-500';
      case 'speaking': return 'bg-purple-500';
      case 'writing': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Assessment Data</h3>
          <p className="text-gray-600 mb-4">You haven't completed any assessments yet.</p>
          <Link
            href="/assessments"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Take Your First Assessment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Analytics</h1>
          <p className="text-gray-600">Track your progress across listening, reading, speaking, and writing assessments</p>
        </div>

        {/* Pending Assessments */}
        <PendingAssessmentsList />

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.totalAssessments}</div>
                <div className="text-sm text-gray-600">Total Assessments</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.averageScore.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-500 rounded-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.bestScore}%</div>
                <div className="text-sm text-gray-600">Best Score</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${
                analytics.recentTrend === 'improving' ? 'bg-green-500' :
                analytics.recentTrend === 'declining' ? 'bg-red-500' : 'bg-gray-500'
              }`}>
                <TrendingUp className={`h-6 w-6 text-white ${
                  analytics.recentTrend === 'declining' ? 'rotate-180' : ''
                }`} />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 capitalize">{analytics.recentTrend}</div>
                <div className="text-sm text-gray-600">Recent Trend</div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Type Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance by Assessment Type</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(analytics.byType).map(([type, data]) => {
              const Icon = getTypeIcon(type);
              const colorClass = getTypeColor(type);
              
              return (
                <div key={type} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 ${colorClass} rounded-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-medium text-gray-900 capitalize">{type}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Completed:</span>
                      <span className="text-sm font-medium">{data.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average:</span>
                      <span className="text-sm font-medium">{data.average}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Best:</span>
                      <span className="text-sm font-medium text-green-600">{data.best}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Assessment Results</h2>
            <Link
              href="/assessments"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
            >
              <span>Take New Assessment</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {analytics.recentResults.map((result) => {
              const Icon = getTypeIcon(result.assessment_type);
              const colorClass = getTypeColor(result.assessment_type);
              
              return (
                <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 ${colorClass} rounded-lg`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 capitalize">
                          {result.assessment_type} Assessment
                        </h3>
                        <p className="text-sm text-gray-600">
                          {result.exam_board} • {result.curriculum_level} • {result.difficulty}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{result.percentage}%</div>
                      <div className="text-sm text-gray-600">
                        {result.questions_correct}/{result.questions_total} correct
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <span>Completed {new Date(result.completed_at).toLocaleDateString()}</span>
                    <span>Time: {Math.floor(result.time_taken / 60)}m {result.time_taken % 60}s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Strong Areas</span>
            </h3>
            <ul className="space-y-2">
              {analytics.strongAreas.map((area, index) => (
                <li key={index} className="text-green-700 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Areas for Improvement</span>
            </h3>
            <ul className="space-y-2">
              {analytics.weakAreas.map((area, index) => (
                <li key={index} className="text-orange-700 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
