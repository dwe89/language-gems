'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  PenTool,
  BarChart2,
  Users,
  CheckCircle,
  Plus,
  MinusCircle,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Target,
  Upload,
  Gamepad2,
  Trophy,
  Award,
  ClipboardCheck,
} from 'lucide-react';
import { useAuth } from '../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../components/auth/AuthProvider';
import BetaDashboardWrapper, { BetaStatsCard } from '../../components/beta/BetaDashboardWrapper';
import FeedbackWidget from '../../components/beta/FeedbackWidget';

// The main page component that handles authentication and renders the dashboard
export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  
  // Display a loading spinner while authentication is in progress
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-6"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If the user is not authenticated after loading, prompt them to sign in
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center p-12 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Welcome Back</h2>
          <p className="text-slate-600 mb-8">Please sign in to access your teaching dashboard</p>
          <Link href="/auth/login" className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:shadow-lg hover:scale-105 inline-block">
            Sign In to Continue
          </Link>
        </div>
      </div>
    );
  }

  // Get display name from user profile or fallback to email username
  const getDisplayName = () => {
    // Try display_name from user_metadata first (if it exists)
    if (user?.user_metadata?.display_name) {
      return user.user_metadata.display_name;
    }
    // Fallback to first part of email
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Teacher';
  };

  // Render the dashboard for authenticated teachers
  return (
    <BetaDashboardWrapper>
      <TeacherDashboard username={getDisplayName()} />
    </BetaDashboardWrapper>
  );
}

// The main dashboard content for teachers
function TeacherDashboard({ username: initialUsername }: { username: string }) {
  const { user } = useAuth();
  const [username, setUsername] = useState(initialUsername);
  const [helpWidgetVisible, setHelpWidgetVisible] = useState(false);
  const [schoolCode, setSchoolCode] = useState<string | null>(null);
  const [viewScope, setViewScope] = useState<'my' | 'school'>('my');
  const [scopeLoading, setScopeLoading] = useState(false);
  const [hasSchoolAccess, setHasSchoolAccess] = useState(false);
  const [stats, setStats] = useState({
    totalClasses: 0,
    activeStudents: 0,
    activeAssignments: 0,
    completionRate: 'N/A',
    totalWords: 0,
    totalGameSessions: 0,
    activeStudents7d: 0,
    loading: true
  });

  useEffect(() => {
    if (!user) return;

    // Fetch dashboard data with a single, more efficient query
    async function fetchDashboardData() {
      try {
        // Set loading state when scope changes
        setScopeLoading(true);

        // Fetch teacher's school code and display name
        const { data: profileData, error: profileError } = await supabaseBrowser
          .from('user_profiles')
          .select('school_code, school_initials, display_name, is_school_owner, school_owner_id')
          .eq('user_id', user.id)
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

          // Update username with display_name if available
          if (profileData.display_name) {
            setUsername(profileData.display_name);
          }
        }

        // Fetch classes based on viewScope
        let classesData;
        if (viewScope === 'school' && profileData?.school_code) {
          // Get all teachers in the school
          const { data: teacherProfiles } = await supabaseBrowser
            .from('user_profiles')
            .select('user_id')
            .eq('school_code', profileData.school_code)
            .in('role', ['teacher', 'admin']);

          const teacherIds = teacherProfiles?.map(t => t.user_id) || [];

          // Get classes from all teachers in school
          const { data, error } = await supabaseBrowser
            .from('classes')
            .select(`
              id,
              class_enrollments(student_id),
              assignments(id)
            `)
            .in('teacher_id', teacherIds);

          classesData = { data, error };
        } else {
          // Get only this teacher's classes
          const { data, error } = await supabaseBrowser
            .from('classes')
            .select(`
              id,
              class_enrollments(student_id),
              assignments(id)
            `)
            .eq('teacher_id', user.id);

          classesData = { data, error };
        }

        const { data, error } = classesData;

        if (error) {
          console.error('Error fetching dashboard data:', error);
          setStats(prev => ({ ...prev, loading: false }));
          return;
        }
        
        // Flatten the data for easier processing
        const allEnrollments = data.flatMap(cls => cls.class_enrollments);
        const allAssignments = data.flatMap(cls => cls.assignments);

        // Get unique student count
        const uniqueStudents = new Set(allEnrollments.map(e => e.student_id));
        const activeStudents = uniqueStudents.size;

        // Get assignment count
        const activeAssignments = allAssignments.length;

        // Get total classes count
        const totalClasses = data.length;

        // Calculate actual completion rate from assignment submissions
        const { data: submissionData } = await supabaseBrowser
          .from('enhanced_assignment_progress')
          .select('status')
          .in('assignment_id', allAssignments.map(a => a.id));

        const completedSubmissions = submissionData?.filter(s => s.status === 'completed').length || 0;
        const totalSubmissions = submissionData?.length || 0;
        const completionRate = totalSubmissions > 0 ? `${Math.round((completedSubmissions / totalSubmissions) * 100)}%` : 'N/A';

        // Get all student IDs for this teacher
        const studentIds = Array.from(uniqueStudents);

        // Calculate actual total words practiced from vocabulary_gem_collection
        const { data: vocabularyData } = await supabaseBrowser
          .from('vocabulary_gem_collection')
          .select('vocabulary_item_id')
          .in('student_id', studentIds);

        const totalWords = vocabularyData ? new Set(vocabularyData.map(v => v.vocabulary_item_id)).size : 0;

        // Get total game sessions
        const { count: sessionCount } = await supabaseBrowser
          .from('enhanced_game_sessions')
          .select('*', { count: 'exact', head: true })
          .in('student_id', studentIds);

        const totalGameSessions = sessionCount || 0;

        // Get active students in last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: recentActivityData } = await supabaseBrowser
          .from('vocabulary_gem_collection')
          .select('student_id')
          .in('student_id', studentIds)
          .gte('last_encountered_at', sevenDaysAgo.toISOString());

        const activeStudents7d = recentActivityData ? new Set(recentActivityData.map(r => r.student_id)).size : 0;

        setStats({
          totalClasses,
          activeStudents,
          activeAssignments,
          completionRate,
          totalWords,
          totalGameSessions,
          activeStudents7d,
          loading: false
        });

        // Clear scope loading state
        setScopeLoading(false);

        // Show welcome widget if the user has no classes
        setHelpWidgetVisible(data.length === 0);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(prev => ({ ...prev, loading: false }));
        setScopeLoading(false);
      }
    }

    fetchDashboardData();
  }, [user, viewScope]);
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section with a simpler, cleaner design */}
      <section className="bg-white/70 backdrop-blur-md border-b border-slate-200">
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-8 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
                Welcome back, {username}!
              </h1>
              <p className="text-slate-600 text-lg max-w-2xl leading-relaxed">
                {viewScope === 'my'
                  ? 'Transform learning with cutting-edge tools and insights.'
                  : `School-wide overview for ${schoolCode || 'your school'}`
                }
              </p>
              {schoolCode && (
                <div className="mt-4 inline-flex items-center px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                  <span className="text-sm font-medium text-purple-900">School Code: </span>
                  <span className="ml-2 text-sm font-bold text-purple-700">{schoolCode}</span>
                </div>
              )}
            </div>

            {/* View Scope Toggle */}
            {hasSchoolAccess && (
              <div className="flex bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setViewScope('my')}
                  disabled={scopeLoading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewScope === 'my'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  } ${scopeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  My Classes
                </button>
                <button
                  onClick={() => setViewScope('school')}
                  disabled={scopeLoading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewScope === 'school'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  } ${scopeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  School
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Loading Overlay */}
      {scopeLoading && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-200 border-t-indigo-600"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-slate-900">
                {viewScope === 'school' ? 'Loading school-wide data...' : 'Loading your classes...'}
              </p>
              <p className="text-sm text-slate-600">This may take a few moments</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Dashboard Grid with Enhanced Design */}
      {!scopeLoading && (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <StatCard
            label="Total Classes"
            value={stats.loading ? "..." : stats.totalClasses.toString()}
            icon={<BookOpen className="h-7 w-7" />}
            gradient="from-indigo-500 to-blue-600"
            bgGradient="from-indigo-50 to-blue-50"
          />
          <StatCard
            label="Total Students"
            value={stats.loading ? "..." : stats.activeStudents.toString()}
            icon={<Users className="h-7 w-7" />}
            gradient="from-emerald-500 to-teal-600"
            bgGradient="from-emerald-50 to-teal-50"
          />
          <StatCard
            label="Active (7 days)"
            value={stats.loading ? "..." : stats.activeStudents7d.toString()}
            icon={<CheckCircle className="h-7 w-7" />}
            gradient="from-green-500 to-emerald-600"
            bgGradient="from-green-50 to-emerald-50"
          />
          <StatCard
            label="Words Practiced"
            value={stats.loading ? "..." : stats.totalWords.toString()}
            icon={<Award className="h-7 w-7" />}
            gradient="from-purple-500 to-pink-600"
            bgGradient="from-purple-50 to-pink-50"
          />
          <StatCard
            label="Game Sessions"
            value={stats.loading ? "..." : stats.totalGameSessions.toLocaleString()}
            icon={<Gamepad2 className="h-7 w-7" />}
            gradient="from-orange-500 to-red-500"
            bgGradient="from-orange-50 to-red-50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DashboardCard
            title="Manage Classes & Students"
            description="Organize your classroom, add students, generate secure logins, and manage comprehensive rosters."
            icon={<BookOpen className="h-8 w-8" />}
            gradient="from-indigo-500 to-blue-600"
            href="/dashboard/classes"
          />
          <DashboardCard
            title="Create & Track Assignments"
            description="Design custom assignments with AI assistance, set learning objectives, and monitor real-time student progress."
            icon={<PenTool className="h-8 w-8" />}
            gradient="from-orange-500 to-red-500"
            href="/dashboard/assignments"
          />
          <DashboardCard
            title="Advanced Analytics"
            description="Get deep insights with detailed reports on scores, engagement time, skill mastery, and learning patterns."
            icon={<BarChart2 className="h-8 w-8" />}
            gradient="from-purple-500 to-pink-500"
            href="/dashboard/progress"
          />
          <DashboardCard
            title="Vocabulary Management"
            description="Build comprehensive vocabulary libraries, import custom content, and create themed word collections."
            icon={<Upload className="h-8 w-8" />}
            gradient="from-emerald-500 to-teal-600"
            href="/dashboard/vocabulary"
          />
          <DashboardCard
            title="Vocabulary Tests"
            description="Create comprehensive vocabulary assessments with detailed analytics and automatic grading for student evaluation."
            icon={<ClipboardCheck className="h-8 w-8" />}
            gradient="from-rose-500 to-pink-600"
            href="/dashboard/vocabulary-tests"
          />
          <DashboardCard
            title="Competitions & Rankings"
            description="Motivate students with class challenges, achievement badges, and dynamic leaderboards that celebrate progress."
            icon={<Trophy className="h-8 w-8" />}
            gradient="from-amber-500 to-yellow-500"
            href="/dashboard/leaderboards"
          />
        </div>
      </section>
      )}

      {/* Help Widget */}
      {helpWidgetVisible && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 max-w-sm animate-in slide-in-from-right duration-500">
            <button 
              onClick={() => setHelpWidgetVisible(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
            >
              <MinusCircle className="h-5 w-5" />
            </button>
            
            <div className="mb-6">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center">
                    Welcome to LanguageGems! 
                    <Sparkles className="h-4 w-4 ml-2 text-yellow-500" />
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Ready to revolutionize your teaching? Create your first class and invite students to begin their personalized learning journey.
                  </p>
                </div>
              </div>
            </div>
            
            <Link href="/dashboard/classes" className="w-full group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 overflow-hidden text-center inline-block">
              <div className="relative flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Class
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Beta Feedback Widget */}
      <FeedbackWidget source="dashboard" />
    </div>
  );
}

// Reusable component for the dashboard stat cards
function StatCard({ 
  label, 
  value, 
  icon, 
  gradient,
  bgGradient,
}: { 
  label: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  bgGradient: string;
}) {
  return (
    <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${bgGradient} shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
        <div className="text-slate-600 font-medium text-sm">{label}</div>
      </div>
    </div>
  );
}

// Reusable component for the main dashboard action cards
function DashboardCard({ 
  title, 
  description, 
  icon, 
  gradient,
  href,
}: { 
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200/50 overflow-hidden block"
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      <div className="relative p-8">
        <div className="flex flex-col h-full">
          {/* Icon */}
          <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 mb-6 self-start`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
          
          {/* Content */}
          <h3 className="font-bold text-slate-900 text-xl leading-tight mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-indigo-600 transition-all duration-300">
            {title}
          </h3>
          <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
            {description}
          </p>
          
          {/* Action area */}
          <div className="flex items-center justify-end pt-4 border-t border-slate-100 group-hover:border-indigo-100 transition-colors duration-300">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110`}>
              <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
