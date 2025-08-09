'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../components/auth/AuthProvider';
import { User, ShoppingBag, Settings, CreditCard, Crown, ArrowRight, School, BookOpen, Users, ClipboardList, TrendingUp, BellRing } from 'lucide-react'; // Added new icons

export default function AccountPage() {
  const { user, isLoading, userRole, hasSubscription, isAdmin, isTeacher, isStudent } = useAuth();
  const [schoolInfo, setSchoolInfo] = useState<{schoolCode: string, schoolInitials: string} | null>(null);
  const [teacherStats, setTeacherStats] = useState({
    totalClasses: 0,
    activeStudents: 0,
    assignmentsCreated: 0,
    recentStudentActivity: [] // To store actual recent student activity
  });
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
        // Get teacher's school initials from their profile
        const { data: profile, error: profileError } = await supabaseBrowser
          .from('user_profiles')
          .select('school_initials')
          .eq('user_id', user.id)
          .single();

        if (profileError || !profile?.school_initials) {
          console.error("Error fetching teacher profile:", profileError);
          return;
        }

        // Get school code from school_codes table
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

        // --- Fetch Teacher-specific Stats ---
        // Placeholder: Replace with actual Supabase queries to your database
        // Example: Fetch total classes created by the teacher
        const { count: classesCount, error: classesError } = await supabaseBrowser
          .from('classes')
          .select('*', { count: 'exact' })
          .eq('teacher_id', user.id);

        // Example: Fetch total active students associated with the teacher's classes
        // This would require a join or a more complex query depending on your schema
        const { count: studentsCount, error: studentsError } = await supabaseBrowser
          .from('students_in_classes')
          .select('*', { count: 'exact' })
          .in('class_id', (await supabaseBrowser.from('classes').select('id').eq('teacher_id', user.id)).data.map(c => c.id));

        // Example: Fetch total assignments created by the teacher
        const { count: assignmentsCount, error: assignmentsError } = await supabaseBrowser
          .from('assignments')
          .select('*', { count: 'exact' })
          .eq('creator_id', user.id);

        // Example: Fetch recent student activity (e.g., last 5 completed assignments)
        const { data: recentActivityData, error: recentActivityError } = await supabaseBrowser
          .from('student_assignment_completions') // Assuming a table for completed assignments
          .select(`
            student_id,
            assignments(title),
            completed_at
          `)
          .in('assignment_id', (await supabaseBrowser.from('assignments').select('id').eq('creator_id', user.id)).data.map(a => a.id)) // Only show for *this* teacher's assignments
          .order('completed_at', { ascending: false })
          .limit(5);


        setTeacherStats({
          totalClasses: classesCount || 0,
          activeStudents: studentsCount || 0,
          assignmentsCreated: assignmentsCount || 0,
          recentStudentActivity: recentActivityData || []
        });

        if (classesError) console.error("Error fetching classes count:", classesError);
        if (studentsError) console.error("Error fetching students count:", studentsError);
        if (assignmentsError) console.error("Error fetching assignments count:", assignmentsError);
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

  // Define account sections, prioritizing Teacher Dashboard
  const accountSections = [
    ...(isTeacher ? [{
      title: 'Teacher Dashboard',
      description: 'Manage your classes, assignments, and student progress',
      icon: School, // Changed to School icon for broader teacher context
      href: '/dashboard',
      color: 'from-indigo-500 to-blue-600'
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
    ...(hasSubscription ? [] : [{
      title: 'Upgrade to Premium',
      description: 'Unlock advanced features and content for your students',
      icon: Crown,
      href: '/account/upgrade',
      color: 'from-purple-500 to-pink-600'
    }])
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome back!</h1>
              <p className="text-slate-600">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                {userRole && (
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full capitalize">
                    {userRole}
                  </span>
                )}
                {hasSubscription && (
                  <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full flex items-center">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </span>
                )}
                {schoolInfo && isTeacher && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
                    <School className="h-3 w-3 mr-1" />
                    School Code: {schoolInfo.schoolCode}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Link
                key={section.title}
                href={section.href}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>

                <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  {section.title}
                </h3>

                <p className="text-slate-600 mb-4">
                  {section.description}
                </p>

                <div className="flex items-center text-indigo-600 group-hover:text-indigo-700">
                  <span className="text-sm font-medium">Go to section</span> {/* Changed text */}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Teacher Quick Stats (Replaced Account Overview) */}
        {isTeacher && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 text-indigo-600 mr-2" />
              Your Teaching Snapshot
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{teacherStats.totalClasses}</div>
                <div className="text-slate-600 flex items-center justify-center"><BookOpen className="h-5 w-5 mr-1" /> Classes Created</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{teacherStats.activeStudents}</div>
                <div className="text-slate-600 flex items-center justify-center"><Users className="h-5 w-5 mr-1" /> Active Students</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{teacherStats.assignmentsCreated}</div>
                <div className="text-slate-600 flex items-center justify-center"><ClipboardList className="h-5 w-5 mr-1" /> Assignments Created</div>
              </div>
            </div>
            {/* Quick action buttons */}
            <div className="mt-8 flex justify-center space-x-4">
              <Link
                href="/dashboard/classes/new" // Example path to create new class
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <BookOpen className="h-5 w-5 mr-2" /> Create New Class
              </Link>
              <Link
                href="/dashboard/assignments/new" // Example path to create new assignment
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <ClipboardList className="h-5 w-5 mr-2" /> Create Assignment
              </Link>
            </div>
          </div>
        )}

        {/* Recent Activity (Teacher-focused) */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
            <BellRing className="h-6 w-6 text-orange-500 mr-2" />
            Recent Student Activity
          </h2>

          {teacherStats.recentStudentActivity.length > 0 ? (
            <ul className="divide-y divide-slate-200">
              {teacherStats.recentStudentActivity.map((activity, index) => (
                <li key={index} className="py-4 flex items-center justify-between">
                  <div>
                    <p className="text-slate-800 font-medium">
                      Student {activity.student_id} completed <span className="text-indigo-600">{activity.assignments?.title || 'an assignment'}</span>
                    </p>
                    <p className="text-slate-500 text-sm">
                      {new Date(activity.completed_at).toLocaleString()}
                    </p>
                  </div>
                  <Link href={`/dashboard/student/${activity.student_id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    View Progress <ArrowRight className="inline-block h-3 w-3 ml-1" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">No recent student activity yet!</h3>
              <p className="text-slate-500 mb-6">Assign some vocabulary or grammar tasks to see progress here.</p>
              <Link
                href="/dashboard/assignments/new"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Your First Assignment
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}