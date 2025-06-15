'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../../components/auth/AuthProvider';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Users, Award, Clock, Target, 
  TrendingUp, BarChart3, User, CheckCircle
} from 'lucide-react';

interface AssignmentAnalytics {
  assignment: {
    id: string;
    title: string;
    game_type: string;
    created_at: string;
    due_date: string | null;
    total_vocabulary: number;
  };
  overall_stats: {
    total_students: number;
    completed: number;
    in_progress: number;
    not_started: number;
    average_score: number;
    average_accuracy: number;
    average_time_spent: number;
  };
  student_progress: Array<{
    student_id: string;
    student_name: string;
    status: string;
    score: number;
    accuracy: number;
    attempts: number;
    time_spent: number;
    started_at: string | null;
    completed_at: string | null;
    vocabulary_mastery: Array<{
      vocabulary_id: number;
      spanish: string;
      english: string;
      mastery_level: number;
      attempts: number;
      correct_attempts: number;
    }>;
  }>;
  vocabulary_performance: Array<{
    vocabulary_id: number;
    spanish: string;
    english: string;
    theme: string;
    topic: string;
    total_attempts: number;
    correct_attempts: number;
    accuracy_rate: number;
    students_attempted: number;
    average_mastery: number;
  }>;
  class_info: {
    class_id: string;
    class_name: string;
    student_count: number;
  };
}

export default function AssignmentAnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const assignmentId = params?.assignmentId as string;
  
  const [analytics, setAnalytics] = useState<AssignmentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !assignmentId) return;

    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/assignments/${assignmentId}/analytics`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch analytics');
        }

        setAnalytics(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, assignmentId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
      case 'started':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMasteryColor = (level: number) => {
    if (level >= 4) return 'bg-green-500';
    if (level >= 3) return 'bg-yellow-500';
    if (level >= 2) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Failed to load analytics'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link 
            href="/dashboard/assignments"
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="text-gray-700" size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Assignment Analytics
            </h1>
            <h2 className="text-xl text-gray-600">{analytics.assignment.title}</h2>
            <p className="text-sm text-gray-500">
              {analytics.class_info.class_name} • {analytics.assignment.game_type}
            </p>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.overall_stats.total_students}
                </p>
                <p className="text-gray-600">Total Students</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.overall_stats.completed}
                </p>
                <p className="text-gray-600">Completed</p>
                <p className="text-sm text-gray-500">
                  {Math.round((analytics.overall_stats.completed / analytics.overall_stats.total_students) * 100)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.overall_stats.average_score}
                </p>
                <p className="text-gray-600">Avg Score</p>
                <p className="text-sm text-gray-500">
                  {analytics.overall_stats.average_accuracy}% accuracy
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(analytics.overall_stats.average_time_spent / 60)}m
                </p>
                <p className="text-gray-600">Avg Time</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Student Progress */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Student Progress
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {analytics.student_progress.map((student) => (
                  <div key={student.student_id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{student.student_name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                        {student.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Score</p>
                        <p className="font-medium">{student.score}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Accuracy</p>
                        <p className="font-medium">{student.accuracy}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Time</p>
                        <p className="font-medium">{Math.round(student.time_spent / 60)}m</p>
                      </div>
                    </div>
                    {student.vocabulary_mastery.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">Vocabulary Mastery</p>
                        <div className="flex flex-wrap gap-1">
                          {student.vocabulary_mastery.slice(0, 10).map((vocab) => (
                            <div
                              key={vocab.vocabulary_id}
                              className={`w-3 h-3 rounded-full ${getMasteryColor(vocab.mastery_level)}`}
                              title={`${vocab.spanish} - Level ${vocab.mastery_level}/5`}
                            />
                          ))}
                          {student.vocabulary_mastery.length > 10 && (
                            <span className="text-xs text-gray-500 ml-1">
                              +{student.vocabulary_mastery.length - 10} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vocabulary Performance */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Vocabulary Performance
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {analytics.vocabulary_performance
                  .sort((a, b) => a.accuracy_rate - b.accuracy_rate)
                  .map((vocab) => (
                  <div key={vocab.vocabulary_id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{vocab.spanish}</h4>
                        <p className="text-sm text-gray-600">{vocab.english}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {Math.round(vocab.accuracy_rate)}%
                        </p>
                        <p className="text-xs text-gray-500">accuracy</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Attempts</p>
                        <p className="font-medium">{vocab.total_attempts}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Students</p>
                        <p className="font-medium">{vocab.students_attempted}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Avg Mastery</p>
                        <p className="font-medium">{vocab.average_mastery.toFixed(1)}/5</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${vocab.accuracy_rate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 