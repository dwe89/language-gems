'use client';

// Add export config to skip static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useSupabase } from '../../../components/supabase/SupabaseProvider';
import { Users, BookOpen, Brain, ExternalLink } from 'lucide-react';
import { ClassSummaryDashboard } from '../../../components/dashboard/ClassSummaryDashboard';

interface ClassOption {
  id: string;
  name: string;
}

export default function ProgressPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const router = useRouter();
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadClasses();
    }
  }, [user]);

  const loadClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, name')
        .eq('teacher_id', user!.id)
        .order('name');

      if (error) throw error;

      setClasses(data || []);
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center p-12 bg-white rounded-3xl shadow-2xl max-w-md">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-3xl flex items-center justify-center mb-6">
            <Users className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Authentication Required</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">Please log in to access the analytics dashboard.</p>
        </div>
      </div>
    );
  }

  const handleStudentClick = (studentId: string) => {
    router.push(`/dashboard/progress/student/${studentId}`);
  };

  const handleAssignmentClick = (assignmentId: string) => {
    router.push(`/dashboard/progress/assignment/${assignmentId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Class Selector */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Teacher Intelligence Dashboard</h1>
              <p className="text-gray-600 mt-2">
                60-second overview of class performance, urgent interventions, and assignment efficacy
              </p>
            </div>

            {/* Class Selector */}
            {!loading && classes.length > 0 && (
              <div className="flex items-center space-x-3">
                <label htmlFor="class-select" className="text-sm font-medium text-gray-700">
                  Class:
                </label>
                <select
                  id="class-select"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                >
                  <option value="all">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Quick Links to Detailed Dashboards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/dashboard/vocabulary/analytics')}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="h-6 w-6 text-emerald-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Vocabulary Analytics</p>
                  <p className="text-sm text-gray-600">Deep dive into word-level mastery</p>
                </div>
              </div>
              <ExternalLink className="h-5 w-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => router.push('/dashboard/grammar/analytics')}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-3">
                <Brain className="h-6 w-6 text-purple-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Grammar Analytics</p>
                  <p className="text-sm text-gray-600">Deep dive into grammar mastery</p>
                </div>
              </div>
              <ExternalLink className="h-5 w-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <ClassSummaryDashboard
          teacherId={user.id}
          classId={selectedClassId === 'all' ? undefined : selectedClassId}
          onStudentClick={handleStudentClick}
          onAssignmentClick={handleAssignmentClick}
        />
      </div>
    </div>
  );
}
