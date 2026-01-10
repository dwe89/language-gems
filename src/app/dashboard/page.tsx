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
  X,
  Home,
  Settings,
  Swords,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../components/auth/AuthProvider';
import { BetaStatsCard } from '../../components/beta/BetaDashboardWrapper';

// The main page component that handles authentication and renders the dashboard
export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();

  // Display a loading spinner while authentication is in progress
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
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
      <div className="flex items-center justify-center min-h-screen bg-[#F3F5F9]">
        <div className="text-center p-12 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 max-w-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <GraduationCap className="h-10 w-10 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Welcome Back</h2>
          <p className="text-slate-600 mb-8 text-lg">Sign in to access your premium teaching dashboard</p>
          <Link href="/auth/login" className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center">
            Sign In to Continue <ArrowRight className="ml-2 h-5 w-5" />
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
    <div className="min-h-screen bg-[#F3F5F9] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-200/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        <TeacherDashboard username={getDisplayName()} />
      </div>
    </div>
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
          .eq('user_id', user?.id)
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
            .eq('teacher_id', user?.id);

          classesData = { data, error };
        }

        const { data, error } = classesData;

        if (error) {
          console.error('Error fetching dashboard data:', error);
          setStats(prev => ({ ...prev, loading: false }));
          return;
        }

        // Flatten the data for easier processing
        const allEnrollments = data?.flatMap(cls => cls.class_enrollments) || [];
        const allAssignments = data?.flatMap(cls => cls.assignments) || [];

        // Get unique student count
        const uniqueStudents = new Set(allEnrollments.map(e => e.student_id));
        const activeStudents = uniqueStudents.size;

        // Get assignment count
        const activeAssignments = allAssignments.length;

        // Get total classes count
        const totalClasses = data?.length || 0;

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
        setHelpWidgetVisible(data?.length === 0);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(prev => ({ ...prev, loading: false }));
        setScopeLoading(false);
      }
    }

    fetchDashboardData();
  }, [user, viewScope]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-end space-x-8 mb-8 text-slate-500 font-medium text-sm">
        <Link href="/" className="flex items-center hover:text-indigo-600 transition-colors">
          <Home className="w-4 h-4 mr-2" />
          Home
        </Link>
        <Link href="/dashboard/leaderboards" className="flex items-center hover:text-indigo-600 transition-colors">
          <Swords className="w-4 h-4 mr-2" />
          Competitions
        </Link>
        <Link href="/account" className="flex items-center hover:text-indigo-600 transition-colors">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Link>
      </nav>

      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              Welcome back, {username.split(' ')[0]}!
            </h1>
          </div>
          <p className="text-slate-500 text-lg">
            Reimagined with the LanguageGems dashboard
          </p>
        </div>

        {schoolCode && (
          <div className="bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-200 shadow-sm flex items-center">
            <span className="text-slate-500 font-medium mr-2">School Code:</span>
            <span className="text-slate-900 font-bold">{schoolCode}</span>
          </div>
        )}
      </header>

      {/* School Code Update Notification */}
      {schoolCode && !scopeLoading && (
        <SchoolCodeNotification schoolCode={schoolCode} />
      )}

      {/* Loading Overlay */}
      {scopeLoading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-slate-600 font-medium">Loading data...</p>
        </div>
      )}

      {/* Stats Grid */}
      {!scopeLoading && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <StatCard
            label="Total Classes"
            value={stats.loading ? "..." : stats.totalClasses.toString()}
            icon={<BookOpen className="h-6 w-6 text-white" />}
            iconBg="bg-blue-500"
            cardBg="bg-blue-50/80"
            borderColor="border-blue-100"
            trend="12% from last month"
            trendColor="text-emerald-600"
          />
          <StatCard
            label="Active Students"
            value={stats.loading ? "..." : stats.activeStudents.toString()}
            icon={<Users className="h-6 w-6 text-emerald-900" />}
            iconBg="bg-emerald-200"
            cardBg="bg-emerald-50/80"
            borderColor="border-emerald-100"
            trend="16% from last month"
            trendColor="text-emerald-600"
          />
          <StatCard
            label="Active Assignments"
            value={stats.loading ? "..." : stats.activeAssignments.toString()}
            icon={<CheckCircle className="h-6 w-6 text-lime-900" />}
            iconBg="bg-lime-200"
            cardBg="bg-lime-50/80"
            borderColor="border-lime-100"
            trend="8% from last month"
            trendColor="text-emerald-600"
          />
          <StatCard
            label="Game Sessions"
            value={stats.loading ? "..." : stats.totalGameSessions.toLocaleString()}
            icon={<Gamepad2 className="h-6 w-6 text-rose-900" />}
            iconBg="bg-rose-200"
            cardBg="bg-rose-50/80"
            borderColor="border-rose-100"
            trend="24% from last month"
            trendColor="text-emerald-600"
          />
          <StatCard
            label="Words Practiced"
            value={stats.loading ? "..." : stats.totalWords.toLocaleString()}
            icon={<Award className="h-6 w-6 text-amber-900" />}
            iconBg="bg-amber-200"
            cardBg="bg-amber-50/80"
            borderColor="border-amber-100"
            trend="19% from last month"
            trendColor="text-emerald-600"
          />
        </section>
      )}

      {/* Main Dashboard Actions Grid */}
      {!scopeLoading && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-24">
          <DashboardCard
            title="Manage Classes"
            subtitle="Organize your classroom & students"
            icon={<BookOpen className="h-10 w-10 text-blue-600" />}
            cardBg="bg-blue-50/80"
            hoverBorder="group-hover:border-blue-200"
            hoverShadow="group-hover:shadow-blue-500/10"
            href="/dashboard/classes"
          />
          <DashboardCard
            title="Track Assignments"
            subtitle="Monitor progress & set objectives"
            icon={<PenTool className="h-10 w-10 text-emerald-600" />}
            cardBg="bg-emerald-50/80"
            hoverBorder="group-hover:border-emerald-200"
            hoverShadow="group-hover:shadow-emerald-500/10"
            href="/dashboard/assignments"
          />
          <DashboardCard
            title="Advanced Analytics"
            subtitle="Deep dive into student performance"
            icon={<BarChart2 className="h-10 w-10 text-purple-600" />}
            cardBg="bg-purple-50/80"
            hoverBorder="group-hover:border-purple-200"
            hoverShadow="group-hover:shadow-purple-500/10"
            href="/dashboard/analytics?tab=overview"
          />
          <DashboardCard
            title="Content Manager"
            subtitle="Build custom vocabulary & sentences"
            icon={<Upload className="h-10 w-10 text-amber-600" />}
            cardBg="bg-amber-50/80"
            hoverBorder="group-hover:border-amber-200"
            hoverShadow="group-hover:shadow-amber-500/10"
            href="/dashboard/vocabulary"
          />
          <DashboardCard
            title="Tests & Quizzes"
            subtitle="Create assessments & grading"
            icon={<ClipboardCheck className="h-10 w-10 text-rose-600" />}
            cardBg="bg-rose-50/80"
            hoverBorder="group-hover:border-rose-200"
            hoverShadow="group-hover:shadow-rose-500/10"
            href="/dashboard/vocabulary-tests"
          />
          <DashboardCard
            title="Competitions"
            subtitle="Badges, leaderboards & challenges"
            icon={<Trophy className="h-10 w-10 text-indigo-600" />}
            cardBg="bg-indigo-50/80"
            hoverBorder="group-hover:border-indigo-200"
            hoverShadow="group-hover:shadow-indigo-500/10"
            href="/dashboard/leaderboards"
          />
        </section>
      )}

      {/* Floating Action Button for Help/Beta */}
      <div className="fixed bottom-8 right-8 z-50 flex gap-4">
        <button
          onClick={() => window.open('https://forms.gle/xyz', '_blank')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95"
        >
          <MessageSquare className="w-5 h-5" />
          Beta Feedback
        </button>
      </div>

    </div>
  );
}

// Reusable component for the dashboard stat cards - Glassmorphism Style
function StatCard({
  label,
  value,
  icon,
  iconBg,
  cardBg,
  borderColor,
  trend,
  trendColor
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  cardBg: string;
  borderColor: string;
  trend?: string;
  trendColor?: string;
}) {
  return (
    <div className={`relative p-6 rounded-3xl ${cardBg} backdrop-blur-xl border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-300 group`}>
      <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 box-border border-2 ${borderColor}`}></div>

      <div className="flex flex-col h-full justify-between relative z-10">
        <div className={`w-14 h-14 rounded-2xl ${iconBg} bg-gradient-to-br from-white/40 to-white/10 flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>

        <div>
          <div className="text-4xl font-bold text-slate-800 tracking-tight mb-2">{value}</div>
          <div className="text-slate-600 font-medium text-base">{label}</div>
          {trend && (
            <div className={`text-sm font-semibold mt-3 ${trendColor || 'text-emerald-500'} flex items-center`}>
              ↑ {trend}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable component for the main dashboard cards - "School Cards" Style
function DashboardCard({
  title,
  subtitle,
  icon,
  cardBg,
  hoverBorder,
  hoverShadow,
  href,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  cardBg: string;
  hoverBorder: string;
  hoverShadow: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative ${cardBg} backdrop-blur-md rounded-[2rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 overflow-hidden flex flex-col items-center text-center ${hoverBorder} hover:border-transparent`}
    >

      {/* Icon Container with Shadow Lift */}
      <div className={`relative z-10 w-24 h-24 rounded-3xl bg-white/80 shadow-md flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${hoverShadow}`}>
        {icon}
      </div>

      {/* Text Content */}
      <div className="relative z-10">
        <h3 className="font-bold text-slate-900 text-2xl mb-2 group-hover:text-indigo-900 transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 text-base leading-relaxed max-w-[240px] mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Bottom Indicator */}
      <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
        <div className="w-12 h-1 rounded-full bg-slate-400 group-hover:bg-indigo-400"></div>
      </div>
    </Link>
  );
}

function SchoolCodeNotification({ schoolCode }: { schoolCode: string | null }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if previously dismissed
    const dismissed = localStorage.getItem('school_code_update_dismissed_v1');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('school_code_update_dismissed_v1', 'true');
  };

  if (!isVisible || !schoolCode) return null;

  return (
    <div className="mb-12 animate-in slide-in-from-top duration-500 fade-in">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors z-20"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4 z-10 relative">
          <div className="flex-shrink-0 p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20">
            <Sparkles className="h-6 w-6 text-yellow-300" />
          </div>
          <div>
            <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
              School Code Update
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-200 text-xs border border-green-500/30">Resolved</span>
            </h3>
            <p className="text-indigo-100 leading-relaxed max-w-3xl">
              Good news! We've updated the student login system. Your students can now log in using your specific School Code:
              <span className="inline-block mx-2 px-3 py-1 bg-white/20 rounded-lg font-mono font-bold text-white border border-white/30 tracking-wider">
                {schoolCode}
              </span>
              (Previous school initials will also continue to work).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
