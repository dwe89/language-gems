'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../components/auth/AuthProvider';
import DeleteAccountModal from '../../components/account/DeleteAccountModal';
import { 
  User, ShoppingBag, Settings, Crown, ArrowRight, School, BookOpen, Users, 
  ClipboardList, TrendingUp, BellRing, Sparkles, Zap, Target, Award,
  BarChart3, Calendar, Clock, Star, ChevronRight, Plus, Activity, Trash2
} from 'lucide-react';

export default function AccountPage() {
  const { user, isLoading, userRole, hasSubscription, isAdmin, isTeacher, isStudent } = useAuth();
  const [schoolInfo, setSchoolInfo] = useState<{schoolCode: string, schoolInitials: string} | null>(null);
  const [teacherStats, setTeacherStats] = useState<{
    totalClasses: number;
    activeStudents: number;
    assignmentsCreated: number;
    recentStudentActivity: any[];
  }>({
    totalClasses: 0,
    activeStudents: 0,
    assignmentsCreated: 0,
    recentStudentActivity: [] // To store actual recent student activity
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  // Redirect students to their dashboard - they shouldn't access the account page
  useEffect(() => {
    if (!isLoading && isStudent) {
      setTimeout(() => {
        router.replace('/student-dashboard');
      }, 150);
    }
  }, [isLoading, isStudent, router]);

  // Load school information and teacher specific stats for teachers
  useEffect(() => {
    async function loadTeacherData() {
      if (!user || !isTeacher) return;

      try {
        // Get teacher's school information from their profile
        const { data: profile, error: profileError } = await supabaseBrowser
          .from('user_profiles')
          .select('school_code, school_initials')
          .eq('user_id', user.id)
          .single();

        if (profileError || !profile?.school_initials) {
          console.error("Error fetching teacher profile:", profileError);
          return;
        }

        // If user has a school_code, use it directly
        if (profile.school_code) {
          setSchoolInfo({
            schoolCode: profile.school_code,
            schoolInitials: profile.school_initials || profile.school_code
          });
        } else if (profile.school_initials) {
          // Fallback: Get school code from school_codes table (for legacy users)
          const { data: schoolData, error: schoolError } = await supabaseBrowser
            .from('school_codes')
            .select('code, school_initials')
            .eq('school_initials', profile.school_initials)
            .single();

          if (!schoolError && schoolData) {
            setSchoolInfo({
              schoolCode: schoolData.code,
              schoolInitials: schoolData.school_initials
            });
          } else {
            console.error("Error fetching school data:", schoolError);
          }
        }

        // --- Fetch Teacher-specific Stats ---
        // Placeholder: Replace with actual Supabase queries to your database
        // Example: Fetch total classes created by the teacher
        const { count: classesCount, error: classesError } = await supabaseBrowser
          .from('classes')
          .select('*', { count: 'exact' })
          .eq('teacher_id', user.id);

        // Fetch total active students associated with the teacher's classes
        // First get the teacher's class IDs
        const { data: teacherClasses, error: teacherClassesError } = await supabaseBrowser
          .from('classes')
          .select('id')
          .eq('teacher_id', user.id);

        let studentsCount = 0;
        let studentsError = null;

        if (!teacherClassesError && teacherClasses && teacherClasses.length > 0) {
          const classIds = teacherClasses.map(c => c.id);
          const { count, error } = await supabaseBrowser
            .from('class_enrollments')
            .select('*', { count: 'exact' })
            .in('class_id', classIds)
            .eq('status', 'active');

          studentsCount = count || 0;
          studentsError = error;
        }

        // Fetch total assignments created by the teacher
        const { count: assignmentsCount, error: assignmentsError } = await supabaseBrowser
          .from('assignments')
          .select('*', { count: 'exact' })
          .eq('created_by', user.id);

        // Fetch recent student activity (e.g., last 5 completed assignments)
        // First get the teacher's assignment IDs
        const { data: teacherAssignments, error: teacherAssignmentsError } = await supabaseBrowser
          .from('assignments')
          .select('id')
          .eq('created_by', user.id);

  let recentActivityData: any[] = [];
  let recentActivityError: any = null;

        if (!teacherAssignmentsError && teacherAssignments && teacherAssignments.length > 0) {
          const assignmentIds = teacherAssignments.map(a => a.id);
          const { data, error } = await supabaseBrowser
            .from('enhanced_assignment_progress')
            .select(`
              student_id,
              assignment_id,
              completed_at,
              assignments!inner(title)
            `)
            .in('assignment_id', assignmentIds)
            .not('completed_at', 'is', null)
            .order('completed_at', { ascending: false })
            .limit(5);

          recentActivityData = data || [];
          recentActivityError = error;
        }


        setTeacherStats({
          totalClasses: classesCount || 0,
          activeStudents: studentsCount || 0,
          assignmentsCreated: assignmentsCount || 0,
          recentStudentActivity: recentActivityData || []
        });

        if (classesError) console.error("Error fetching classes count:", classesError);
        if (teacherClassesError) console.error("Error fetching teacher classes:", teacherClassesError);
        if (studentsError) console.error("Error fetching students count:", studentsError);
        if (assignmentsError) console.error("Error fetching assignments count:", assignmentsError);
        if (teacherAssignmentsError) console.error("Error fetching teacher assignments:", teacherAssignmentsError);
        if (recentActivityError) console.error("Error fetching recent student activity:", recentActivityError);


      } catch (error) {
        console.error('Error loading teacher info:', error);
      }
    }

    loadTeacherData();
  }, [user, isTeacher]);

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  // Redirect students - they shouldn't access this page
  if (isStudent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Please sign in to view your account</h2>
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Define account sections, conditionally showing Teacher Dashboard based on subscription
  const accountSections = [
    // Only show Teacher Dashboard for teachers with active subscriptions
    ...(isTeacher && hasSubscription ? [{
      title: 'Teacher Dashboard',
      description: 'Manage your classes, assignments, and student progress',
      icon: School,
      href: '/dashboard',
      color: 'from-indigo-500 to-blue-600'
    }] : []),
    // School Management for teachers with subscriptions
    ...(isTeacher && hasSubscription ? [{
      title: 'School Management',
      description: 'Add teachers to your school and manage memberships',
      icon: Users,
      href: '/account/school',
      color: 'from-green-500 to-emerald-600'
    }] : []),
    {
      title: 'My Orders',
      description: 'View your purchase history and download your resources',
      icon: ShoppingBag,
      href: '/account/orders',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Account Settings',
      description: 'Update your profile, password, and preferences',
      icon: Settings,
      href: '/account/settings',
      color: 'from-slate-500 to-slate-600'
    },
    // Show upgrade option for teachers without subscription
    ...(isTeacher && !hasSubscription ? [{
      title: 'Upgrade to Premium',
      description: 'Unlock the Teacher Dashboard and advanced features for your students',
      icon: Crown,
      href: '/account/upgrade',
      color: 'from-purple-500 to-pink-600',
      featured: true
    }] : [])
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Email verification notice */}
        {user && !(user.email_confirmed_at || (user as any).confirmed_at) && (
          <div className="mb-6 max-w-3xl mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg flex items-start justify-between">
              <div className="pr-4">
                <h3 className="text-lg font-semibold text-yellow-800">Please verify your email</h3>
                <p className="text-sm text-yellow-700">We sent a verification link to <span className="font-medium">{user.email}</span>. Click the link in your inbox to activate your account.</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/auth/resend-verification', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: user.email })
                      });

                      const data = await res.json();
                      if (!res.ok) {
                        // eslint-disable-next-line no-console
                        console.error('Resend failed', data);
                        alert(data.error || 'Failed to resend verification email');
                        return;
                      }

                      alert(data.message || 'Verification email sent');
                    } catch (err) {
                      // eslint-disable-next-line no-console
                      console.error('Error resending verification', err);
                      alert('Failed to resend verification email');
                    }
                  }}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-medium rounded-lg shadow-sm"
                >
                  Resend Email
                </button>
                <button
                  onClick={async () => {
                    // Refresh session/user metadata - call provider refresh
                    try {
                      // The useAuth provider exposes refreshSession; call via window to avoid TS import cycles
                      // @ts-ignore
                      const auth = (await import('../../components/auth/AuthProvider')).refreshSession;
                      if (typeof auth === 'function') await auth();
                    } catch (e) {
                      // Fallback: reload the page to get updated session
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm"
                >
                  I verified — refresh
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {user.email?.split('@')[0]}! 
                  <Sparkles className="inline-block h-8 w-8 ml-2 text-yellow-300" />
                </h1>
                <p className="text-white/80 text-lg mb-3">Ready to inspire your students today?</p>
                <div className="flex items-center space-x-3">
                  {userRole && (
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full capitalize border border-white/30">
                      {userRole}
                    </span>
                  )}
                  {hasSubscription && (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm rounded-full flex items-center font-medium">
                      <Crown className="h-4 w-4 mr-1" />
                      Premium
                    </span>
                  )}
                  {schoolInfo && isTeacher && (
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full flex items-center border border-white/30">
                      <School className="h-4 w-4 mr-1" />
                      {schoolInfo.schoolCode}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {isTeacher && hasSubscription && (
              <div className="hidden lg:block">
                <Link
                  href="/dashboard"
                  className="group bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-4 rounded-xl transition-all duration-300 flex items-center space-x-3 border border-white/30 hover:border-white/50"
                >
                  <Zap className="h-6 w-6" />
                  <span className="font-semibold">Launch Dashboard</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}

            {isTeacher && !hasSubscription && (
              <div className="hidden lg:block">
                <Link
                  href="/account/upgrade"
                  className="group bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-8 py-4 rounded-xl transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl"
                >
                  <Crown className="h-6 w-6" />
                  <span className="font-semibold">Upgrade to Premium</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Teacher Dashboard - Prominent Feature for Subscribed Teachers */}
        {isTeacher && hasSubscription && (
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <School className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                      Teacher Dashboard
                      <Target className="h-6 w-6 ml-2 text-yellow-300" />
                    </h2>
                    <p className="text-white/90 text-lg">
                      Manage classes, create assignments, and track student progress
                    </p>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className="flex items-center text-white/80 text-sm">
                        <Users className="h-4 w-4 mr-1" />
                        {teacherStats.activeStudents} Students
                      </span>
                      <span className="flex items-center text-white/80 text-sm">
                        <ClipboardList className="h-4 w-4 mr-1" />
                        {teacherStats.assignmentsCreated} Assignments
                      </span>
                      <span className="flex items-center text-white/80 text-sm">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {teacherStats.totalClasses} Classes
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="hidden md:flex flex-col items-center text-white/80">
                    <Activity className="h-8 w-8 mb-1" />
                    <span className="text-xs">Live Stats</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:bg-white/30 transition-colors">
                    <ChevronRight className="h-8 w-8 text-white group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Subscription Upgrade Section for Teachers without Premium */}
        {isTeacher && !hasSubscription && (
          <div className="mb-8">
            <div className="relative overflow-hidden bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl shadow-xl p-8">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Crown className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        Upgrade to Premium
                      </h2>
                      <p className="text-white/90 text-lg">
                        Unlock the Teacher Dashboard and advanced features
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <School className="h-5 w-5 text-white" />
                      <span className="text-white font-medium">Teacher Dashboard</span>
                    </div>
                    <p className="text-white/80 text-sm">Full access to class management and analytics</p>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <Users className="h-5 w-5 text-white" />
                      <span className="text-white font-medium">Unlimited Students</span>
                    </div>
                    <p className="text-white/80 text-sm">Add as many students as you need</p>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <BarChart3 className="h-5 w-5 text-white" />
                      <span className="text-white font-medium">Advanced Analytics</span>
                    </div>
                    <p className="text-white/80 text-sm">Detailed progress tracking and insights</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/account/upgrade"
                    className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    <Crown className="h-5 w-5 mr-2" />
                    Start Premium Trial
                  </Link>
                  <Link
                    href="/account/upgrade"
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center border border-white/30"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions for Teachers */}
        {isTeacher && hasSubscription && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/dashboard/classes"
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-slate-200 hover:border-indigo-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Create Class</h3>
              <p className="text-slate-600 text-sm">Set up a new class and invite students</p>
            </Link>

            <Link
              href="/dashboard/assignments/new"
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-slate-200 hover:border-green-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ClipboardList className="h-6 w-6 text-white" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">New Assignment</h3>
              <p className="text-slate-600 text-sm">Create engaging vocabulary tasks</p>
            </Link>

            <Link
              href="/dashboard/analytics"
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-slate-200 hover:border-purple-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">View Analytics</h3>
              <p className="text-slate-600 text-sm">Track student progress and insights</p>
            </Link>
          </div>
        )}

        {/* Account Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountSections.filter(section => section.title !== 'Teacher Dashboard').map((section) => {
            const IconComponent = section.icon;
            const isUpgrade = section.title === 'Upgrade to Premium';
            
            return (
              <Link
                key={section.title}
                href={section.href}
                className={`group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-slate-200 hover:border-slate-300 ${
                  isUpgrade ? 'ring-2 ring-purple-200 hover:ring-purple-300' : ''
                }`}
              >
                {isUpgrade && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                    Popular
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                </div>

                <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  {section.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {section.description}
                </p>

                {isUpgrade && (
                  <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                    <Star className="h-4 w-4 mr-1" />
                    Unlock Premium Features
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Danger Zone - Account Deletion */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-red-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Danger Zone</h3>
                <p className="text-slate-600 mb-4 max-w-md">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Teaching Performance Stats */}
        {isTeacher && (
          <div className="mt-8 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl shadow-lg p-8 border border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center">
                  <TrendingUp className="h-7 w-7 text-indigo-600 mr-3" />
                  Your Teaching Impact
                </h2>
                <p className="text-slate-600">Track your progress and student engagement</p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-600 font-medium">Live Data</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">{teacherStats.totalClasses}</div>
                    <div className="text-xs text-green-600 font-medium">+2 this month</div>
                  </div>
                </div>
                <div className="text-slate-600 font-medium">Classes Created</div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">{teacherStats.activeStudents}</div>
                    <div className="text-xs text-green-600 font-medium">+5 this week</div>
                  </div>
                </div>
                <div className="text-slate-600 font-medium">Active Students</div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <ClipboardList className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">{teacherStats.assignmentsCreated}</div>
                    <div className="text-xs text-green-600 font-medium">+3 today</div>
                  </div>
                </div>
                <div className="text-slate-600 font-medium">Assignments Created</div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '90%'}}></div>
                </div>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="mt-8 p-6 bg-white rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Award className="h-5 w-5 text-yellow-500 mr-2" />
                Recent Achievements
              </h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg border border-yellow-200">
                  <Star className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Class Creator</span>
                </div>
                <div className="flex items-center bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200">
                  <Target className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Assignment Master</span>
                </div>
                <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-200">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Student Mentor</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity Feed */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center">
                <BellRing className="h-7 w-7 text-orange-500 mr-3" />
                Student Activity Feed
              </h2>
              <p className="text-slate-600">Stay updated with your students' progress</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-sm text-slate-500">
                <Clock className="h-4 w-4 mr-1" />
                Live updates
              </div>
              <Link
                href="/dashboard/analytics"
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          {teacherStats.recentStudentActivity.length > 0 ? (
            <div className="space-y-4">
              {teacherStats.recentStudentActivity.map((activity, index) => (
                <div key={index} className="group flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-800 font-medium">
                        Student {activity.student_id} completed{' '}
                        <span className="text-indigo-600 font-semibold">
                          {activity.assignments?.title || 'an assignment'}
                        </span>
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-slate-500 text-sm flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(activity.completed_at).toLocaleString()}
                        </p>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                          Completed
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link 
                    href={`/dashboard/student/${activity.student_id}`} 
                    className="opacity-0 group-hover:opacity-100 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center"
                  >
                    View Progress
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-12 w-12 text-indigo-400" />
                </div>
                <div className="absolute top-0 right-1/2 translate-x-8 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-3">Ready to see some action?</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Create your first assignment and watch as your students engage with interactive vocabulary games and assessments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard/assignments/new"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create First Assignment
                </Link>
                <Link
                  href="/dashboard/classes"
                  className="bg-white hover:bg-slate-50 text-slate-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center border border-slate-300 hover:border-slate-400"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Set Up Class
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteAccountModal 
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          userType={isTeacher ? 'teacher' : 'student'}
        />
      )}
    </div>
  );
}