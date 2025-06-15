'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/auth/AuthProvider';
import Link from 'next/link';
import { 
  Search, Bell, User as UserIcon, Menu, ChevronDown, ChevronRight,
  BookOpen, PenTool, BarChart2, Upload, Trophy, GraduationCap,
  Users, CheckCircle, Plus, Play, Award, Book, Zap, Clock, Calendar,
  Globe, MessageCircle, PieChart, Gamepad2, MinusCircle, PlusCircle
} from 'lucide-react';
import { supabaseBrowser } from '../../components/auth/AuthProvider';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  
  useEffect(() => {
    console.log('User in dashboard:', {
      id: user?.id,
      email: user?.email,
      metadata: user?.user_metadata,
      role: user?.user_metadata?.role
    });
  }, [user]);
  
  // If auth is still loading, show a loading spinner
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // This route is only for teachers - students should use /student-dashboard
  return <TeacherDashboard username={user?.user_metadata?.name || 'Teacher'} />;
}

function TeacherDashboard({ username = 'Ms. Carter' }: { username?: string }) {
  const { user } = useAuth();
  const [helpWidgetVisible, setHelpWidgetVisible] = useState(true);
  const [stats, setStats] = useState({
    activeStudents: 0,
    activeAssignments: 0,
    completionRate: 0,
    loading: true
  });

  useEffect(() => {
    if (!user) return;

    const fetchRealStats = async () => {
      try {
        // Get total enrolled students for this teacher
        const { data: enrollments } = await supabaseBrowser
          .from('class_enrollments')
          .select(`
            student_id,
            classes!inner(teacher_id)
          `)
          .eq('classes.teacher_id', user.id);

        const activeStudents = enrollments?.length || 0;

        // Get active assignments for this teacher
        const { data: assignments } = await supabaseBrowser
          .from('assignments')
          .select('id')
          .eq('teacher_id', user.id)
          .eq('status', 'active');

        const activeAssignments = assignments?.length || 0;

        // Calculate completion rate (only if there are assignments)
        let completionRate = 0;
        if (activeAssignments > 0) {
          const { data: progress } = await supabaseBrowser
            .from('assignment_progress')
            .select('status, assignment_id')
            .in('assignment_id', assignments?.map(a => a.id) || []);

          if (progress && progress.length > 0) {
            const completed = progress.filter(p => p.status === 'completed').length;
            completionRate = Math.round((completed / progress.length) * 100);
          }
        }

        setStats({
          activeStudents,
          activeAssignments,
          completionRate,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats({
          activeStudents: 0,
          activeAssignments: 0,
          completionRate: 0,
          loading: false
        });
      }
    };

    fetchRealStats();
  }, [user]);
  
  return (
    <div className="min-h-screen">
      {/* Welcome Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-8 shadow-2xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
            
            <div className="relative z-10">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Welcome back, {username}! ✨
                </h2>
                <p className="text-indigo-100 text-lg max-w-2xl">
                  Let's create amazing learning experiences for your students today
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {stats.loading ? "..." : stats.activeStudents.toString()}
                      </div>
                      <div className="text-indigo-100 text-sm font-medium">Active Students</div>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-emerald-300" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {stats.loading ? "..." : stats.activeAssignments.toString()}
                      </div>
                      <div className="text-indigo-100 text-sm font-medium">Active Assignments</div>
                    </div>
                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                      <PenTool className="h-6 w-6 text-orange-300" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {stats.loading ? "..." : stats.activeAssignments > 0 ? `${stats.completionRate}%` : "N/A"}
                      </div>
                      <div className="text-indigo-100 text-sm font-medium">Avg. Completion</div>
                    </div>
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-yellow-300" />
                    </div>
                  </div>
                </div>
              </div>
              
              <Link 
                href="/dashboard/classes/new" 
                className="inline-flex items-center px-6 py-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Class
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Dashboard Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DashboardCard 
            title="Manage Classes & Students"
            description="Add students, generate logins, and view rosters"
            icon={<BookOpen className="h-7 w-7 text-indigo-600" />}
            buttonText="View Classes"
            buttonColor="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
            imageSrc="/classes-illustration.svg"
            href="/dashboard/classes"
          />
          
          <DashboardCard 
            title="Create & Assign Tasks"
            description="Set vocabulary games, grammar exercises, or exam prep"
            icon={<PenTool className="h-7 w-7 text-orange-600" />}
            buttonText="New Assignment"
            buttonColor="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            imageSrc="/assignments-illustration.svg"
            href="/dashboard/assignments/new"
          />
          
          <DashboardCard 
            title="Track Student Progress"
            description="See scores, time spent, and skill mastery"
            icon={<BarChart2 className="h-7 w-7 text-purple-600" />}
            buttonText="View Reports"
            buttonColor="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            imageSrc="/progress-illustration.svg"
            href="/dashboard/progress"
          />
          
          <DashboardCard 
            title="Browse Learning Content"
            description="Upload materials or browse our content library"
            icon={<Upload className="h-7 w-7 text-emerald-600" />}
            buttonText="Manage Content"
            buttonColor="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
            imageSrc="/content-illustration.svg"
            href="/dashboard/content"
          />
          
          <DashboardCard 
            title="Interactive Learning Games"
            description="Engage students with fun, educational activities"
            icon={<Gamepad2 className="h-7 w-7 text-pink-600" />}
            buttonText="Explore Games"
            buttonColor="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800"
            imageSrc="/games-illustration.svg"
            href="/dashboard/games"
          />
          
          <DashboardCard 
            title="Competition & Leaderboards"
            description="Motivate students with challenges and rankings"
            icon={<Trophy className="h-7 w-7 text-amber-600" />}
            buttonText="View Leaderboards"
            buttonColor="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            imageSrc="/competition-illustration.svg"
            href="/dashboard/leaderboards"
          />
        </div>
      </section>

      {/* Help Widget */}
      {helpWidgetVisible && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-sm">
            <button 
              onClick={() => setHelpWidgetVisible(false)}
              className="absolute top-3 right-3 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <MinusCircle className="h-4 w-4 text-slate-500" />
            </button>
            <div className="mb-4">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
                Welcome to LanguageGems! 🎉
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Ready to get started? Create your first class and add students to begin their language learning journey.
              </p>
              <Link 
                href="/dashboard/classes/new"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                Create First Class
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavLink({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <Link href={href} className="flex items-center text-gray-600 hover:text-teal-600 hover:bg-teal-50 p-2 rounded-lg transition-colors">
      <span className="mr-1.5">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}

function StatCard({ icon, label, value, bgColor }: { 
  icon: React.ReactNode, 
  label: string, 
  value: string,
  bgColor: string
}) {
  return (
    <div className={`${bgColor} rounded-lg p-4 flex items-center shadow-sm`}>
      <div className="mr-3 bg-white/20 rounded-full p-2">
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-sm opacity-90">{label}</div>
      </div>
    </div>
  );
}

function DashboardCard({ 
  title, 
  description, 
  icon, 
  buttonText, 
  buttonColor, 
  imageSrc,
  href
}: { 
  title: string, 
  description: string, 
  icon: React.ReactNode, 
  buttonText: string, 
  buttonColor: string,
  imageSrc: string,
  href: string
}) {
  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-slate-100/80 rounded-xl group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg leading-tight">{title}</h3>
              <p className="text-slate-600 text-sm mt-1 leading-relaxed">{description}</p>
            </div>
          </div>
        </div>
        
        {/* Illustration area with better placeholder */}
        <div className="flex justify-center items-center h-24 mb-8 rounded-xl bg-slate-50/50 group-hover:bg-slate-100/50 transition-colors duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center">
            {icon}
          </div>
        </div>
        
        <Link 
          href={href} 
          className={`block w-full ${buttonColor} text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 text-center shadow-md hover:shadow-lg group-hover:scale-105`}
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
} 