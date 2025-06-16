'use client';

// Add export config to skip static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../../components/auth/AuthProvider';
import Link from 'next/link';
import { 
  Trophy, Medal, Award, Star, Target, TrendingUp, Users, ChevronRight, Filter,
  Crown, Zap, Calendar, User, BarChart3, ChevronDown, ChevronUp, Search
} from 'lucide-react';
import type { Database } from '../../../lib/database.types';

type Student = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  class: string;
  classId: string;
  stats: {
    points: number;
    streaks: number;
    accuracy: number;
    completion: number;
    rank: number;
  };
  badges: string[];
  recentAchievements: Array<{
    date: string;
    type: string;
    title: string;
    icon: string;
    points: number;
  }>;
};

type Class = {
  id: string;
  name: string;
  level: string;
  totalPoints: number;
  studentCount: number;
  topStudent: string;
  rank: number;
};

export default function LeaderboardsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [view, setView] = useState<'students' | 'classes'>('students');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch real data from database
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch teacher's classes
        const { data: classesData, error: classesError } = await supabaseBrowser
          .from('classes')
          .select('*')
          .eq('created_by', user.id);

        if (classesError) {
          console.error('Error fetching classes:', classesError);
        }

        // Fetch real students enrolled in this teacher's classes
        const { data: enrollmentsData, error: enrollmentsError } = await supabaseBrowser
          .from('class_enrollments')
          .select(`
            student_id,
            enrolled_at,
            class_id
          `)
          .in('class_id', classesData?.map(c => c.id) || []);

        if (enrollmentsError) {
          console.error('Error fetching enrollments:', enrollmentsError);
          return;
        }

        // Get student profiles separately
        const studentIds = enrollmentsData?.map(e => e.student_id) || [];
        const { data: profilesData, error: profilesError } = await supabaseBrowser
          .from('user_profiles')
          .select('user_id, display_name, email')
          .in('user_id', studentIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          return;
        }

        // Transform the data
        const studentsData: Student[] = enrollmentsData?.map((enrollment, index) => {
          const profile = profilesData?.find(p => p.user_id === enrollment.student_id);
          const classInfo = classesData?.find(c => c.id === enrollment.class_id);
          
          return {
            id: enrollment.student_id,
            name: profile?.display_name || 'Unknown Student',
            email: profile?.email || '',
            avatar: (profile?.display_name || 'U').charAt(0).toUpperCase(),
            class: classInfo?.name || 'Unknown Class',
            classId: classInfo?.id || '',
            stats: {
              points: 0, // No points system implemented yet
              streaks: 0, // No streak tracking yet
              accuracy: 0, // No accuracy tracking yet
              completion: 0, // No completion tracking yet
              rank: index + 1
            },
            badges: [], // No badge system implemented yet
            recentAchievements: [] // No achievements yet
          };
        }) || [];

        const classesFormatted: Class[] = classesData?.map((cls, index) => {
          const classStudents = studentsData.filter(s => s.classId === cls.id);
          return {
            id: cls.id,
            name: cls.name,
            level: cls.level || 'Beginner',
            totalPoints: 0, // No points tracking yet
            studentCount: classStudents.length,
            topStudent: classStudents.length > 0 ? classStudents[0].name : 'No students',
            rank: index + 1
          };
        }) || [];

        setStudents(studentsData);
        setClasses(classesFormatted);
      } catch (error) {
        console.error('Error fetching data:', error);
        setStudents([]);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, supabaseBrowser]);

  // Filter students based on selected class and search query
  const filteredStudents = students.filter(student => {
    const matchesClass = selectedClass === 'all' || student.classId === selectedClass;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesClass && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Leaderboards & Rankings</h1>
              <p className="text-slate-600">Track competition and motivate your students with achievements</p>
            </div>
          </div>
        </header>

        {/* Controls Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-6 mb-8">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
            {/* Search and Filter */}
            <div className="flex flex-1 max-w-3xl gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[250px]">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full pl-11 pr-4 py-3 border border-slate-300/60 rounded-xl bg-white/80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              </div>
              
              <div className="relative">
                <select
                  className="pl-4 pr-10 py-3 border border-slate-300/60 rounded-xl bg-white/80 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm font-medium text-slate-700 min-w-[150px]"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="all">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
            
            {/* View Controls */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-100/80 rounded-xl p-1 flex">
                <button
                  onClick={() => setView('students')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    view === 'students'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Users className="h-4 w-4 mr-2 inline" />
                  Students
                </button>
                <button
                  onClick={() => setView('classes')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    view === 'classes'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Trophy className="h-4 w-4 mr-2 inline" />
                  Classes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {view === 'students' ? (
          <StudentLeaderboard students={filteredStudents} />
        ) : (
          <ClassLeaderboard classes={classes} />
        )}
      </div>
    </div>
  );
}

// Student Leaderboard Component
function StudentLeaderboard({ students }: { students: Student[] }) {
  if (students.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200/50">
            <Trophy className="h-10 w-10 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">No students found</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">
            You don't have any students enrolled yet. Add students to your classes to start tracking their progress and create leaderboards.
          </p>
          <Link 
            href="/dashboard/classes"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>Manage Classes</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top 3 Students */}
      {students.length >= 3 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">🏆 Top Performers</h3>
          <div className="flex justify-center items-end gap-6">
            {/* Second Place */}
            {students[1] && (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-3 mx-auto">
                  {students[1].avatar}
                </div>
                <div className="bg-slate-100 px-4 py-3 rounded-xl">
                  <div className="font-bold text-slate-900">{students[1].name}</div>
                  <div className="text-sm text-slate-600">{students[1].stats.points} pts</div>
                  <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mt-2">
                    2
                  </div>
                </div>
              </div>
            )}
            
            {/* First Place */}
            {students[0] && (
              <div className="text-center transform -translate-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-3 mx-auto border-4 border-yellow-300">
                  {students[0].avatar}
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 px-6 py-4 rounded-xl border border-yellow-200">
                  <div className="font-bold text-slate-900 text-lg">{students[0].name}</div>
                  <div className="text-sm text-yellow-700 font-semibold">{students[0].stats.points} pts</div>
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mt-3">
                    <Crown className="h-5 w-5" />
                  </div>
                </div>
              </div>
            )}
            
            {/* Third Place */}
            {students[2] && (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-3 mx-auto">
                  {students[2].avatar}
                </div>
                <div className="bg-amber-50 px-4 py-3 rounded-xl border border-amber-200">
                  <div className="font-bold text-slate-900">{students[2].name}</div>
                  <div className="text-sm text-amber-700">{students[2].stats.points} pts</div>
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mt-2">
                    3
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-200/60">
          <h3 className="text-lg font-bold text-slate-900">Student Rankings</h3>
          <p className="text-slate-600 text-sm mt-1">{students.length} student{students.length !== 1 ? 's' : ''} enrolled</p>
        </div>

        <div className="space-y-1">
          {students.map((student, index) => {
            const isTopThree = index < 3;
            const rankColor = index === 0 ? 'from-yellow-500 to-yellow-600' :
                            index === 1 ? 'from-slate-400 to-slate-500' :
                            index === 2 ? 'from-amber-600 to-amber-700' :
                            'from-slate-300 to-slate-400';
            
            return (
              <div 
                key={student.id} 
                className={`flex items-center justify-between p-6 transition-all duration-200 ${
                  isTopThree 
                    ? 'bg-gradient-to-r from-indigo-50/50 to-purple-50/50 hover:from-indigo-50 hover:to-purple-50' 
                    : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                    isTopThree ? `bg-gradient-to-br ${rankColor}` : 'bg-slate-300'
                  }`}>
                    {index < 3 && index === 0 ? <Crown className="h-5 w-5" /> : index + 1}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {student.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{student.name}</div>
                      <div className="text-sm text-slate-600">{student.class}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-8 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-slate-900 text-lg">{student.stats.points}</div>
                    <div className="text-slate-500">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-slate-900">{student.stats.completion}%</div>
                    <div className="text-slate-500">Complete</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-slate-900">{student.stats.streaks}</div>
                    <div className="text-slate-500">Streak</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="p-6 bg-indigo-50/50 border-t border-slate-200/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Star className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900">Leaderboard Feature Coming Soon!</h4>
              <p className="text-sm text-indigo-700">
                Points, streaks, and achievements will be automatically calculated once students start completing assignments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Class Leaderboard Component
function ClassLeaderboard({ classes }: { classes: Class[] }) {
  if (classes.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200/50">
            <Users className="h-10 w-10 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">No classes yet</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Create your first class to start tracking class-wide progress and rankings.
          </p>
          <Link 
            href="/dashboard/classes"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>Create Class</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {classes.map((cls, index) => {
        const isTopThree = index < 3;
        const rankColor = index === 0 ? 'from-yellow-500 to-yellow-600' :
                        index === 1 ? 'from-slate-400 to-slate-500' :
                        index === 2 ? 'from-amber-600 to-amber-700' :
                        'from-indigo-500 to-purple-600';
        
        return (
          <div 
            key={cls.id} 
            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <div className={`bg-gradient-to-br ${rankColor} p-6 text-white relative`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{cls.name}</h3>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                  isTopThree ? 'bg-white/20 backdrop-blur-sm' : 'bg-white/10'
                }`}>
                  {index === 0 ? <Crown className="h-5 w-5" /> : index + 1}
                </div>
              </div>
              <p className="text-white/80 text-sm">Level: {cls.level}</p>
              
              {isTopThree && (
                <div className="absolute top-4 right-4 opacity-20">
                  <Trophy className="h-12 w-12" />
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <div className="text-2xl font-bold text-slate-900">{cls.totalPoints}</div>
                  <div className="text-sm text-slate-600">Total Points</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <div className="text-2xl font-bold text-slate-900">{cls.studentCount}</div>
                  <div className="text-sm text-slate-600">Students</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 font-medium">Top Student</span>
                  <span className="font-semibold text-slate-900">{cls.topStudent}</span>
                </div>
              </div>
              
              <button 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-lg"
              >
                <span>View Details</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
} 