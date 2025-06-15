'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../components/auth/AuthProvider';
import { createBrowserClient } from '@supabase/ssr';
import { 
  BookOpen, BarChart2, Edit, Award, Hexagon, Trophy, Loader2
} from 'lucide-react';
import type { Database } from '../../lib/database.types';

// Card component for dashboard sections
const DashboardCard = ({ 
  title, 
  icon, 
  href, 
  bgColor = 'bg-white',
  gemColor = 'text-blue-500',
  buttonColor = 'bg-blue-500'
}: { 
  title: string; 
  icon: React.ReactNode; 
  href: string;
  bgColor?: string;
  gemColor?: string;
  buttonColor?: string;
}) => {
  return (
    <div className={`${bgColor} rounded-xl shadow-lg p-6 flex flex-col items-center`}>
      <div className={`${gemColor} mb-4`}>
        <Hexagon className="h-16 w-16" strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <Link 
        href={href}
        className={`${buttonColor} text-white py-2 px-6 rounded-full font-medium mt-4 transition-transform hover:scale-105`}
      >
        Open {title}
      </Link>
    </div>
  );
};

// Statistics card for the welcome section
const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'bg-blue-500' 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode;
  color?: string;
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`${color} w-14 h-14 rounded-full flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-gray-600">{value}</p>
    </div>
  );
};

// Leaderboard entry component
const LeaderboardEntry = ({
  rank,
  name,
  score,
  avatar,
  isCurrentUser = false
}: {
  rank: number;
  name: string;
  score: string | number;
  avatar?: string;
  isCurrentUser?: boolean;
}) => {
  return (
    <div className={`flex items-center py-3 ${isCurrentUser ? 'bg-indigo-50 rounded-lg p-2' : ''}`}>
      <div className="w-8 text-center font-bold text-gray-500">{rank}</div>
      <div className="w-8 h-8 rounded-full overflow-hidden mx-3 bg-gray-200 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-700">{name.charAt(0).toUpperCase()}</span>
      </div>
      <div className="flex-grow font-medium">{name}</div>
      <div className="text-indigo-700 font-semibold">{typeof score === 'number' ? `${score} pts` : score}</div>
    </div>
  );
};

// Loading state component
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    <span className="ml-2 text-indigo-600">Loading your dashboard...</span>
  </div>
);

export default function StudentDashboard() {
  const { user } = useAuth();
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPoints: 0,
    completedAssignments: 0,
    level: 1,
    achievements: 0
  });
  const [assignments, setAssignments] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [classmates, setClassmates] = useState<any[]>([]);

  const username = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Student';
  
  useEffect(() => {
    if (!user) return;
    
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        // Get the student's class memberships
        const { data: classMemberships } = await supabase
          .from('class_enrollments')
          .select('class_id')
          .eq('student_id', user.id);
        
        const classIds = classMemberships?.map(cm => cm.class_id) || [];
        
        // Get assignments for these classes
        const { data: assignmentsData } = await supabase
          .from('assignments')
          .select('*')
          .in('class_id', classIds)
          .eq('status', 'active')
          .order('due_date', { ascending: true })
          .limit(5);
          
        setAssignments(assignmentsData || []);
        
        // Get assignment progress for this student
        const { data: progressData } = await supabase
          .from('assignment_progress')
          .select('*')
          .eq('student_id', user.id);
        
        // Calculate statistics
        const completedAssignments = progressData?.filter(p => p.status === 'completed')?.length || 0;
        const totalPoints = progressData?.reduce((sum, p) => sum + p.score, 0) || 0;
        
        // Calculate level based on points (simple algorithm)
        const level = Math.max(1, Math.floor(totalPoints / 100) + 1);
        
        setStats({
          totalPoints,
          completedAssignments,
          level,
          achievements: 0 // No achievements tracking yet
        });
        
        // Get leaderboard data (classmates)
        if (classIds.length > 0) {
          const { data: classmatesData } = await supabase
            .from('class_enrollments')
            .select(`
              student_id,
              user_profiles:user_id(display_name, email)
            `)
            .in('class_id', classIds);
            
          const studentIds = classmatesData?.map(cm => cm.student_id) || [];
          
          // Get progress for all classmates
          const { data: classProgressData } = await supabase
            .from('assignment_progress')
            .select('student_id, score')
            .in('student_id', studentIds);
            
          // Calculate total scores per student
          const scoresByStudent = (classProgressData || []).reduce((acc, curr) => {
            acc[curr.student_id] = (acc[curr.student_id] || 0) + curr.score;
            return acc;
          }, {} as Record<string, number>);
          
          // Create leaderboard with proper type handling
          const leaderboardData = (classmatesData || []).map(cm => {
            // Handle the case where user_profiles is an array or object
            const profile = Array.isArray(cm.user_profiles) 
              ? cm.user_profiles[0] 
              : cm.user_profiles;
            
            const displayName = profile?.display_name;
            const email = profile?.email;
            const name = displayName || (email ? email.split('@')[0] : 'Student');
            
            return {
              id: cm.student_id,
              name,
              score: scoresByStudent[cm.student_id] || 0,
              isCurrentUser: cm.student_id === user.id
            };
          });
          
          // Sort by score descending
          leaderboardData.sort((a, b) => b.score - a.score);
          
          setLeaderboard(leaderboardData.slice(0, 5));
          setClassmates(leaderboardData);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        // If there's an error, show placeholder data
        setStats({
          totalPoints: 250,
          completedAssignments: 15,
          level: 12,
          achievements: 8
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, [user, supabase]);
  
  if (loading) {
    return <LoadingState />;
  }
  
  return (
    <div className="space-y-8">
      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Assignments" 
          icon={<BookOpen />} 
          href="/student-dashboard/assignments"
          gemColor="text-purple-500"
          buttonColor="bg-purple-600"
        />
        <DashboardCard 
          title="Games" 
          icon={<Hexagon />} 
          href="/student-dashboard/games"
          gemColor="text-yellow-500"
          buttonColor="bg-yellow-500"
        />
        <DashboardCard 
          title="Progress" 
          icon={<BarChart2 />} 
          href="/student-dashboard/progress"
          gemColor="text-green-500"
          buttonColor="bg-green-600"
        />
        <DashboardCard 
          title="Exam Prep" 
          icon={<Edit />} 
          href="/student-dashboard/exam-prep"
          gemColor="text-pink-500"
          buttonColor="bg-pink-600"
        />
      </div>

      {/* Learning Mode Guide Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Hexagon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ready to Learn?</h3>
              <p className="text-gray-600 text-sm">Choose your learning style today</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              href="/student-dashboard/assignments"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              📚 Check Homework
            </Link>
            <Link 
              href="/student-dashboard/games"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              🎮 Play for Fun
            </Link>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
              <BookOpen className="h-3 w-3 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Assignments Mode</p>
              <p className="text-gray-600">Complete teacher-set tasks, earn assignment grades, and follow your learning plan.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
              <Hexagon className="h-3 w-3 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Free Play Mode</p>
              <p className="text-gray-600">Explore any game, practice weak topics, and earn gems at your own pace.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Welcome Section with Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-red-500 to-yellow-500 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-6">Welcome back, {username}! 🎉</h2>
          <div className="grid grid-cols-4 gap-4">
            <StatCard 
              title="Gems Earned" 
              value={stats.totalPoints} 
              icon={<Hexagon className="h-6 w-6 text-white" />}
              color="bg-blue-400"
            />
            <StatCard 
              title="Assignments Done" 
              value={stats.completedAssignments} 
              icon={<BookOpen className="h-6 w-6 text-white" />}
              color="bg-green-400"
            />
            <StatCard 
              title="Level" 
              value={stats.level}
              icon={<Award className="h-6 w-6 text-white" />}
              color="bg-purple-400"
            />
            <StatCard 
              title="Achievements" 
              value={stats.achievements}
              icon={<Trophy className="h-6 w-6 text-white" />}
              color="bg-pink-400"
            />
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Upcoming Assignments</h3>
              {assignments.length > 0 && (
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                  {assignments.length} pending
                </span>
              )}
            </div>
            {assignments.length > 0 ? (
              <div className="bg-white/20 rounded-lg p-4 space-y-2">
                {assignments.slice(0, 3).map((assignment) => (
                  <div key={assignment.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{assignment.title}</div>
                      <div className="text-sm opacity-90">Due: {new Date(assignment.due_date).toLocaleDateString()}</div>
                    </div>
                    <Link 
                      href={`/student-dashboard/assignments/${assignment.id}`}
                      className="bg-white/30 hover:bg-white/40 text-white px-4 py-1 rounded-full text-sm transition-colors"
                    >
                      Start
                    </Link>
                  </div>
                ))}
                {assignments.length > 3 && (
                  <div className="text-center pt-2">
                    <Link 
                      href="/student-dashboard/assignments"
                      className="text-white/80 hover:text-white text-sm underline"
                    >
                      View all {assignments.length} assignments →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 bg-white/20 rounded-lg">
                <Trophy className="h-8 w-8 mx-auto mb-2 opacity-60" />
                <p className="text-white/90 font-medium">All caught up!</p>
                <p className="text-white/70 text-sm">No pending assignments. Great work!</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center mt-6 space-x-4">
            <Link 
              href="/student-dashboard/assignments" 
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-full font-medium transition-colors"
            >
              📚 View Assignments
            </Link>
            <Link 
              href="/student-dashboard/games" 
              className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-6 rounded-full font-medium transition-colors"
            >
              🎮 Play Games
            </Link>
          </div>
        </div>
        
        {/* Leaderboard Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Leaderboard</h2>
            <Link href="/student-dashboard/leaderboard" className="text-indigo-600 text-sm">
              View All
            </Link>
          </div>
          
          {leaderboard.length > 0 ? (
            <div className="space-y-1">
              {leaderboard.map((entry, index) => (
                <LeaderboardEntry 
                  key={entry.id}
                  rank={index + 1} 
                  name={entry.name} 
                  score={entry.score}
                  avatar={entry.avatar}
                  isCurrentUser={entry.isCurrentUser}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No leaderboard data available yet.
              <div className="mt-2 text-sm">Complete assignments to see your ranking!</div>
            </div>
          )}
          
          <Link 
            href="/student-dashboard/games"
            className="block w-full text-center bg-indigo-100 text-indigo-700 py-2 rounded-lg mt-4 font-medium"
          >
            Challenge Yourself
          </Link>
        </div>
      </div>
    </div>
  );
}

// Force client-side rendering to avoid build issues with Supabase
export const dynamic = 'force-dynamic'; 