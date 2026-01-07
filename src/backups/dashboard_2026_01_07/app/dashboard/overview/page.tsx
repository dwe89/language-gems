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
  const [schoolCode, setSchoolCode] = useState<string | null>(null);
  const [viewScope, setViewScope] = useState<'my' | 'school'>('my');
  const [hasSchoolAccess, setHasSchoolAccess] = useState(false);

  useEffect(() => {
    if (user) {
      loadClasses();
    }
  }, [user, viewScope]);

  const loadClasses = async () => {
    try {
      // Fetch teacher's profile to check school access
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('school_code, school_initials, school_owner_id, is_school_owner')
        .eq('user_id', user!.id)
        .single();

      if (!profileError && profileData) {
        const schoolIdentifier = profileData.school_code || profileData.school_initials;
        setSchoolCode(schoolIdentifier);

        // Check if user has school access
        const hasAccess = !!(
          profileData.is_school_owner ||
          profileData.school_owner_id ||
          schoolIdentifier
        );
        setHasSchoolAccess(hasAccess);
      }

      // Fetch classes based on view scope
      if (viewScope === 'my') {
        // Only user's classes
        const { data, error } = await supabase
          .from('classes')
          .select('id, name')
          .eq('teacher_id', user!.id)
          .order('name');

        if (error) throw error;
        setClasses(data || []);
      } else {
        // School-wide classes
        const response = await fetch('/api/classes/school-filtered?scope=school');
        const result = await response.json();

        if (result.success) {
          setClasses(result.classes.map((c: any) => ({ id: c.id, name: c.name })) || []);
        }
      }
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
              <h1 className="text-3xl font-bold text-gray-900">
                {viewScope === 'my' ? 'My Classes' : 'School'} Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                {viewScope === 'my'
                  ? '60-second overview of your class performance, urgent interventions, and assignment efficacy'
                  : `School-wide overview of all classes in ${schoolCode || 'your school'}`
                }
              </p>
              {schoolCode && (
                <div className="mt-3 inline-flex items-center px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
                  <span className="text-sm font-medium text-purple-900">School Code: </span>
                  <span className="ml-2 text-sm font-bold text-purple-700">{schoolCode}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* View Scope Toggle */}
              {hasSchoolAccess && (
                <div className="flex bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => {
                      setViewScope('my');
                      setSelectedClassId('all');
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      viewScope === 'my'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    My Classes
                  </button>
                  <button
                    onClick={() => {
                      setViewScope('school');
                      setSelectedClassId('all');
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      viewScope === 'school'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    School
                  </button>
                </div>
              )}

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
          viewScope={viewScope}
          schoolCode={schoolCode || undefined}
          onStudentClick={handleStudentClick}
          onAssignmentClick={handleAssignmentClick}
        />
      </div>
    </div>
  );
}
