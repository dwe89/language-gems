'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../components/auth/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { 
  Search, Bell, User as UserIcon, Menu, ChevronDown, ChevronRight,
  BookOpen, PenTool, BarChart2, Upload, Trophy, GraduationCap,
  Users, CheckCircle, Plus, Play, Award, Book, Zap, Clock, Calendar,
  Globe, MessageCircle, PieChart, Gamepad2, MinusCircle, PlusCircle
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log('User in dashboard:', {
      id: user?.id,
      email: user?.email,
      metadata: user?.user_metadata,
      role: user?.user_metadata?.role
    });
    
    // Set loading to false even if user is not fully loaded yet
    // This prevents getting stuck in loading state
    setLoading(false);
  }, [user]);
  
  // If auth is still loading, show a loading spinner
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  
  // Show loading state from local component state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
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
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!user) return;

    const fetchRealStats = async () => {
      try {
        // Get total enrolled students for this teacher
        const { data: enrollments } = await supabase
          .from('class_enrollments')
          .select(`
            student_id,
            classes!inner(teacher_id)
          `)
          .eq('classes.teacher_id', user.id);

        const activeStudents = enrollments?.length || 0;

        // Get active assignments for this teacher
        const { data: assignments } = await supabase
          .from('assignments')
          .select('id')
          .eq('teacher_id', user.id)
          .eq('status', 'active');

        const activeAssignments = assignments?.length || 0;

        // Calculate completion rate (only if there are assignments)
        let completionRate = 0;
        if (activeAssignments > 0) {
          const { data: progress } = await supabase
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
  }, [user, supabase]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-rose-100">
      {/* Remove Top Navigation Bar since it's in the layout now */}
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-8 bg-gradient-to-r from-teal-600 to-rose-400 rounded-xl p-6 shadow-lg text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold mb-1">
              Welcome, {username}! <span className="hidden sm:inline">Let's Spark Language Learning Today!</span>
            </h2>
            <div className="w-24 h-1 bg-coral-400 mb-6"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard 
                icon={<Users className="h-5 w-5" />} 
                label="Active Students" 
                value={stats.loading ? "..." : stats.activeStudents.toString()} 
                bgColor="bg-emerald-500/80"
              />
              <StatCard 
                icon={<PenTool className="h-5 w-5" />} 
                label="Active Assignments" 
                value={stats.loading ? "..." : stats.activeAssignments.toString()} 
                bgColor="bg-rose-400/80"
              />
              <StatCard 
                icon={<CheckCircle className="h-5 w-5" />} 
                label="Avg. Completion Rate" 
                value={stats.loading ? "..." : stats.activeAssignments > 0 ? `${stats.completionRate}%` : "N/A"} 
                bgColor="bg-amber-400/80"
              />
            </div>
            
            <Link href="/dashboard/classes/new" className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg shadow flex items-center transition-all duration-300 transform hover:scale-105 inline-flex">
              <Plus className="h-4 w-4 mr-2" />
              Create New Class
            </Link>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute top-4 right-4 opacity-10">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 40H170L150 160H50L30 40Z" stroke="white" strokeWidth="4"/>
              <path d="M60 20L70 40M140 20L130 40" stroke="white" strokeWidth="4"/>
              <circle cx="100" cy="100" r="30" stroke="white" strokeWidth="4"/>
              <path d="M70 100H130M100 70V130" stroke="white" strokeWidth="4"/>
            </svg>
          </div>
        </section>
        
        {/* Main Dashboard Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Row 1 */}
          <DashboardCard 
            title="Manage Classes & Students"
            description="Add students, generate logins, and view rosters"
            icon={<BookOpen className="h-8 w-8 text-emerald-600" />}
            buttonText="View Classes"
            buttonColor="bg-emerald-500 hover:bg-emerald-600"
            imageSrc="/classes-illustration.svg"
            href="/dashboard/classes"
          />
          
          <DashboardCard 
            title="Create & Assign Tasks"
            description="Set vocab games, grammar exercises, or exam prep"
            icon={<PenTool className="h-8 w-8 text-rose-500" />}
            buttonText="New Assignment"
            buttonColor="bg-rose-500 hover:bg-rose-600"
            imageSrc="/assignments-illustration.svg"
            href="/dashboard/assignments/new"
          />
          
          <DashboardCard 
            title="Track Student Progress"
            description="See scores, time spent, and skill mastery"
            icon={<BarChart2 className="h-8 w-8 text-amber-500" />}
            buttonText="View Reports"
            buttonColor="bg-amber-500 hover:bg-amber-600"
            imageSrc="/progress-illustration.svg"
            href="/dashboard/progress"
          />
          
          {/* Row 2 */}
          <DashboardCard 
            title="Browse Learning Content"
            description="Upload materials or browse our content library"
            icon={<Upload className="h-8 w-8 text-indigo-500" />}
            buttonText="Manage Content"
            buttonColor="bg-indigo-500 hover:bg-indigo-600"
            imageSrc="/content-illustration.svg"
            href="/dashboard/content"
          />
          
          <DashboardCard 
            title="Interactive Learning Games"
            description="Engage students with vocabulary and grammar games"
            icon={<Trophy className="h-8 w-8 text-purple-500" />}
            buttonText="View Games"
            buttonColor="bg-purple-500 hover:bg-purple-600"
            imageSrc="/games-illustration.svg"
            href="/dashboard/games"
          />
          
          <DashboardCard 
            title="Competition & Leaderboards"
            description="Motivate students with class competitions"
            icon={<GraduationCap className="h-8 w-8 text-pink-500" />}
            buttonText="View Rankings"
            buttonColor="bg-pink-500 hover:bg-pink-600"
            imageSrc="/competition-illustration.svg"
            href="/dashboard/leaderboards"
          />
        </section>
        
        {/* Quick Actions & Recent Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-montserrat font-bold text-gray-800 mb-4 flex items-center">
              <Zap className="h-5 w-5 text-amber-500 mr-2" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <NavLink 
                icon={<Plus className="h-4 w-4" />} 
                label="Create New Class" 
                href="/dashboard/classes/new" 
              />
              <NavLink 
                icon={<PenTool className="h-4 w-4" />} 
                label="Create Assignment" 
                href="/dashboard/assignments/new" 
              />
              <NavLink 
                icon={<BookOpen className="h-4 w-4" />} 
                label="Upload Vocabulary List" 
                href="/dashboard/vocabulary/new" 
              />
              <NavLink 
                icon={<Gamepad2 className="h-4 w-4" />} 
                label="Launch Class Game" 
                href="/dashboard/games/launch" 
              />
            </div>
          </div>
          
          {/* Getting Started Guide */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h3 className="font-montserrat font-bold text-gray-800 mb-4 flex items-center">
              <Clock className="h-5 w-5 text-teal-500 mr-2" />
              Getting Started
            </h3>
            
            {stats.activeStudents === 0 ? (
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="bg-blue-500 rounded-full p-1">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Create your first class</p>
                    <p className="text-xs text-gray-500">Add students and start teaching</p>
                    <Link href="/dashboard/classes/new" className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block">
                      Create Class →
                    </Link>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-gray-400 rounded-full p-1">
                    <PenTool className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">Create your first assignment</p>
                    <p className="text-xs text-gray-400">Available after creating a class</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg">
                  <div className="bg-emerald-500 rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">You have {stats.activeStudents} students enrolled</p>
                    <p className="text-xs text-gray-500">Ready to create assignments</p>
                  </div>
                </div>
                
                {stats.activeAssignments === 0 ? (
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="bg-blue-500 rounded-full p-1">
                      <PenTool className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Create your first assignment</p>
                      <p className="text-xs text-gray-500">Start engaging your students</p>
                      <Link href="/dashboard/assignments/new" className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block">
                        Create Assignment →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg">
                    <div className="bg-emerald-500 rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">You have {stats.activeAssignments} active assignments</p>
                      <p className="text-xs text-gray-500">Students are working on their tasks</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
        
        {/* Help Widget (conditionally shown) */}
        {helpWidgetVisible && (
          <div className="fixed bottom-6 right-6 bg-gradient-to-r from-teal-500 to-rose-400 text-white p-4 rounded-xl shadow-lg max-w-sm z-50">
            <button 
              onClick={() => setHelpWidgetVisible(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-200"
            >
              <MinusCircle className="h-4 w-4" />
            </button>
            <h4 className="font-bold mb-2">Welcome to LanguageGems! 🎓</h4>
            <p className="text-sm mb-3">Ready to get started? Create your first class and add students to begin their language learning journey.</p>
            <Link href="/dashboard/classes/new" className="inline-block bg-white text-teal-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              Create First Class
            </Link>
          </div>
        )}
      </main>
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] group">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="mr-3 bg-gray-100 rounded-full p-2 group-hover:animate-sparkle">
            {icon}
          </div>
          <h3 className="font-montserrat font-bold text-gray-800">{title}</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        
        <div className="flex justify-center mb-4 h-32 items-center">
          <img 
            src={imageSrc} 
            alt={title} 
            className="max-h-full max-w-full object-contain group-hover:animate-float"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </div>
        
        <Link href={href} className={`block w-full ${buttonColor} text-white py-2 rounded-lg transition-colors text-center`}>
          {buttonText}
        </Link>
      </div>
    </div>
  );
} 