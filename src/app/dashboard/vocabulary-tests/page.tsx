'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  BookOpen,
  Users,
  Clock,
  Target,
  TrendingUp,
  BarChart3,
  Settings,
  Play,
  Eye,
  Edit,
  Trash2,
  Copy,
  Filter,
  Search,
  Download
} from 'lucide-react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useSupabase } from '../../../components/supabase/SupabaseProvider';
import { VocabularyTestService, VocabularyTest } from '../../../services/vocabularyTestService';
import VocabularyTestCreator from '../../../components/vocabulary-tests/VocabularyTestCreator';
import VocabularyTestAnalytics from '../../../components/vocabulary-tests/VocabularyTestAnalytics';

interface TestWithStats extends VocabularyTest {
  total_attempts: number;
  completed_attempts: number;
  average_score: number;
  pass_rate: number;
  last_attempt: string | null;
}

export default function VocabularyTestsPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [testService, setTestService] = useState<VocabularyTestService | null>(null);

  // Debug component mount
  useEffect(() => {
    console.log('🔍 [VocabularyTestsPage] Component mounted, user:', !!user, 'supabase:', !!supabase);
  }, []);

  // Initialize test service when supabase is ready
  useEffect(() => {
    console.log('🔍 [VocabularyTestsPage] Initializing test service, supabase:', !!supabase);
    if (supabase) {
      console.log('🔍 [VocabularyTestsPage] Creating VocabularyTestService');
      setTestService(new VocabularyTestService(supabase));
    }
  }, [supabase]);

  // Expose navigation function for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).goToCreateTest = () => {
        setCurrentView('create');
      };
      console.log('🧪 [DEBUG] goToCreateTest function is now available on window object');
    }
  }, []);

  // State
  const [tests, setTests] = useState<TestWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'analytics'>('list');
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'active' | 'archived'>('all');

  useEffect(() => {
    if (user && testService) {
      loadTests();
    }
  }, [user, testService]);

  const loadTests = async () => {
    if (!user || !testService) return;

    try {
      setLoading(true);
      setError(null);

      // Load basic tests
      const basicTests = await testService.getTestsByTeacher(user.id);

      // Enhance with statistics
      const testsWithStats: TestWithStats[] = await Promise.all(
        basicTests.map(async (test) => {
          try {
            // Get test statistics
            const { data: results, error } = await supabase
              .from('vocabulary_test_results')
              .select('percentage_score, passed, completion_time')
              .eq('test_id', test.id);

            if (error) throw error;

            const totalAttempts = results?.length || 0;
            const completedAttempts = results?.filter(r => r.completion_time).length || 0;
            const averageScore = totalAttempts > 0 
              ? results.reduce((sum, r) => sum + r.percentage_score, 0) / totalAttempts 
              : 0;
            const passRate = totalAttempts > 0 
              ? (results.filter(r => r.passed).length / totalAttempts) * 100 
              : 0;
            const lastAttempt = results?.length > 0 
              ? results.sort((a, b) => new Date(b.completion_time || '').getTime() - new Date(a.completion_time || '').getTime())[0]?.completion_time 
              : null;

            return {
              ...test,
              total_attempts: totalAttempts,
              completed_attempts: completedAttempts,
              average_score: averageScore,
              pass_rate: passRate,
              last_attempt: lastAttempt
            };
          } catch (error) {
            console.error(`Error loading stats for test ${test.id}:`, error);
            return {
              ...test,
              total_attempts: 0,
              completed_attempts: 0,
              average_score: 0,
              pass_rate: 0,
              last_attempt: null
            };
          }
        })
      );

      setTests(testsWithStats);
    } catch (error: any) {
      setError(error.message || 'Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const handleTestCreated = (testId: string) => {
    setCurrentView('list');
    loadTests(); // Refresh the list
  };

  const handleDeleteTest = async (testId: string) => {
    if (!confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('vocabulary_tests')
        .delete()
        .eq('id', testId);

      if (error) throw error;

      setTests(prev => prev.filter(test => test.id !== testId));
    } catch (error: any) {
      alert('Failed to delete test: ' + error.message);
    }
  };

  const handleToggleStatus = async (testId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'archived' : 'active';

    try {
      const { error } = await supabase
        .from('vocabulary_tests')
        .update({ status: newStatus })
        .eq('id', testId);

      if (error) throw error;

      setTests(prev => prev.map(test => 
        test.id === testId ? { ...test, status: newStatus as any } : test
      ));
    } catch (error: any) {
      alert('Failed to update test status: ' + error.message);
    }
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || test.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (currentView === 'create') {
    return (
      <VocabularyTestCreator
        onTestCreated={handleTestCreated}
        onCancel={() => setCurrentView('list')}
      />
    );
  }

  if (currentView === 'analytics' && selectedTestId) {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('list')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <span>← Back to Tests</span>
          </button>
        </div>
        <VocabularyTestAnalytics testId={selectedTestId} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vocabulary Tests</h1>
          <p className="text-gray-600 mt-2">Create and manage comprehensive vocabulary assessments</p>
        </div>
        
        <button
          onClick={() => setCurrentView('create')}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Create Test</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-3xl font-bold text-gray-900">{tests.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tests</p>
              <p className="text-3xl font-bold text-gray-900">
                {tests.filter(t => t.status === 'active').length}
              </p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Attempts</p>
              <p className="text-3xl font-bold text-gray-900">
                {tests.reduce((sum, test) => sum + test.total_attempts, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Pass Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {tests.length > 0 
                  ? (tests.reduce((sum, test) => sum + test.pass_rate, 0) / tests.length).toFixed(1)
                  : 0}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tests List */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tests...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center p-12">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button
            onClick={loadTests}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="text-center p-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {tests.length === 0 ? 'No tests created yet' : 'No tests match your filters'}
          </h3>
          <p className="text-gray-600 mb-6">
            {tests.length === 0 
              ? 'Create your first vocabulary test to get started'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
          {tests.length === 0 && (
            <button
              onClick={() => setCurrentView('create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Create Your First Test
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              {/* Test Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{test.title}</h3>
                  {test.description && (
                    <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(test.status)}`}>
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {test.language.toUpperCase()} • {test.curriculum_level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Test Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{test.total_attempts}</div>
                  <div className="text-xs text-gray-500">Attempts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{test.average_score.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">Avg Score</div>
                </div>
              </div>

              {/* Test Details */}
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Questions:</span>
                  <span className="font-medium">{test.word_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Time Limit:</span>
                  <span className="font-medium">{test.time_limit_minutes}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pass Rate:</span>
                  <span className="font-medium">{test.pass_rate.toFixed(1)}%</span>
                </div>
                {test.last_attempt && (
                  <div className="flex items-center justify-between">
                    <span>Last Attempt:</span>
                    <span className="font-medium">{formatDate(test.last_attempt)}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTestId(test.id);
                      setCurrentView('analytics');
                    }}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 text-sm">
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </button>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleToggleStatus(test.id, test.status)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title={test.status === 'active' ? 'Archive' : 'Activate'}
                  >
                    {test.status === 'active' ? <Settings className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  
                  <button className="p-1 text-gray-400 hover:text-gray-600" title="Duplicate">
                    <Copy className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteTest(test.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
