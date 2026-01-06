'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../components/auth/AuthProvider';
import {
  User, ShoppingBag, Settings, Crown, ArrowRight, School, BookOpen, Users,
  ClipboardList, Target,
  BarChart3, Star, ChevronRight, Activity, Plus
} from 'lucide-react';

export default function AccountPage() {
  const { user, isLoading, userRole, hasSubscription, isAdmin, isTeacher, isStudent, isLearner } = useAuth();
  const [schoolInfo, setSchoolInfo] = useState<{
    schoolCode: string;
    schoolInitials: string;
    isOwner: boolean;
    memberCount: number;
    subscriptionType?: string;
  } | null>(null);
  const [teacherStats, setTeacherStats] = useState<{
    totalClasses: number;
    activeStudents: number;
    assignmentsCreated: number;
  }>({
    totalClasses: 0,
    activeStudents: 0,
    assignmentsCreated: 0
  });
  const router = useRouter();

  // Redirect students and learners to their dashboard - they shouldn't access the account page
  useEffect(() => {
    if (!isLoading) {
      if (isStudent) {
        setTimeout(() => {
          router.replace('/student-dashboard');
        }, 150);
      } else if (isLearner) {
        setTimeout(() => {
          router.replace('/learner-dashboard');
        }, 150);
      }
    }
  }, [isLoading, isStudent, isLearner, router]);

  // Load school information and teacher specific stats for teachers
  useEffect(() => {
    async function loadTeacherData() {
      if (!user || !isTeacher) return;

      try {
        // Get teacher's school information from their profile
        const { data: profile, error: profileError } = await supabaseBrowser
          .from('user_profiles')
          .select('school_code, school_initials, is_school_owner, subscription_type')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error("Error fetching teacher profile:", profileError);
          return;
        }

        // If user has a school_code, fetch school details and member count
        if (profile?.school_code) {
          // Fetch school details from school_codes table
          const { data: schoolData, error: schoolError } = await supabaseBrowser
            .from('school_codes')
            .select('code, school_name, school_initials')
            .eq('code', profile.school_code)
            .single();

          if (schoolError) {
            console.error("Error fetching school data:", schoolError);
            return;
          }

          // Fetch member count
          const { count } = await supabaseBrowser
            .from('school_memberships')
            .select('*', { count: 'exact', head: true })
            .eq('school_code', profile.school_code)
            .eq('status', 'active');

          const memberCount = count || 0;

          setSchoolInfo({
            schoolCode: schoolData.code,
            schoolInitials: schoolData.school_initials || schoolData.code,
            isOwner: profile.is_school_owner || false,
            memberCount,
            subscriptionType: profile.subscription_type
          });
        } else if (profile?.school_initials) {
          // Legacy users with only school_initials (no school_code yet)
          setSchoolInfo({
            schoolCode: profile.school_initials,
            schoolInitials: profile.school_initials,
            isOwner: profile.is_school_owner || false,
            memberCount: 0
          });
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

        setTeacherStats({
          totalClasses: classesCount || 0,
          activeStudents: studentsCount || 0,
          assignmentsCreated: assignmentsCount || 0
        });

        if (classesError) console.error("Error fetching classes count:", classesError);
        if (teacherClassesError) console.error("Error fetching teacher classes:", teacherClassesError);
        if (studentsError) console.error("Error fetching students count:", studentsError);
        if (assignmentsError) console.error("Error fetching assignments count:", assignmentsError);


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

  if (isStudent || isLearner) {
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
    // Conditionally add School Management for school owners (excluding individual teachers)
    ...(isTeacher && hasSubscription && schoolInfo && schoolInfo.isOwner && schoolInfo.subscriptionType !== 'individual_teacher' ? [{
      title: 'School Management',
      description: 'Add teachers to your school and manage memberships',
      icon: School,
      href: '/account/school',
      color: 'from-green-500 to-emerald-500',
      // meta items will be rendered as small badges under description
      meta: [
        { icon: School, text: schoolInfo.schoolCode },
        { icon: Users, text: `${schoolInfo.memberCount} ${schoolInfo.memberCount === 1 ? 'Teacher' : 'Teachers'}` },
        { text: schoolInfo.isOwner ? 'Owner' : 'Member', badge: true }
      ]
    }] : []),
    // Add "Student Enrollment" card for Individual Teachers
    ...(isTeacher && hasSubscription && schoolInfo && schoolInfo.subscriptionType === 'individual_teacher' ? [{
      title: 'Student Enrollment',
      description: 'Your unique code for students to join your classes',
      icon: Users,
      href: '/dashboard/classes',
      color: 'from-green-500 to-emerald-500',
      meta: [
        { icon: School, text: `Code: ${schoolInfo.schoolCode}`, badge: true },
        { text: '150 Student Limit' }
      ]
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
              href="/dashboard"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {accountSections.map((section) => {
            const IconComponent = section.icon;
            const isUpgrade = section.title === 'Upgrade to Premium';

            return (
              <Link
                key={section.title}
                href={section.href}
                className={`group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-slate-200 hover:border-slate-300 ${isUpgrade ? 'ring-2 ring-purple-200 hover:ring-purple-300' : ''
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

                {/* Optional meta badges (e.g. school code, counts, owner badge) */}
                {section.meta && (
                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                    {section.meta.map((m: any, idx: number) => {
                      const MetaIcon = m.icon;
                      return (
                        <span key={idx} className={`inline-flex items-center gap-2 ${m.badge ? 'px-2 py-1 bg-slate-100 text-slate-700 rounded-full' : ''}`}>
                          {MetaIcon ? <MetaIcon className="h-4 w-4 text-slate-400" /> : null}
                          <span>{m.text}</span>
                        </span>
                      );
                    })}
                  </div>
                )}

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






      </div>
    </div>
  );
}