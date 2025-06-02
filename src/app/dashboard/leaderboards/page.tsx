'use client';

// Add export config to skip static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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

  const supabase = createClientComponentClient<Database>();

  // Fetch real data from database
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch teacher's classes
        const { data: classesData, error: classesError } = await supabase
          .from('classes')
          .select('*')
          .eq('teacher_id', user.id);

        if (classesError) {
          console.error('Error fetching classes:', classesError);
        }

        // Fetch real students enrolled in this teacher's classes
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('class_enrollments')
          .select(`
            student_id,
            enrolled_at,
            classes!inner(id, name, teacher_id),
            user_profiles!inner(display_name, email)
          `)
          .eq('classes.teacher_id', user.id);

        if (enrollmentsError) {
          console.error('Error fetching enrollments:', enrollmentsError);
        }

        // Transform the data
        const studentsData: Student[] = enrollmentsData?.map((enrollment, index) => {
          const profile = enrollment.user_profiles;
          const classInfo = enrollment.classes;
          
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
  }, [user, supabase]);

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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-rose-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-teal-800 mb-2">Leaderboards & Rankings</h1>
          <p className="text-teal-600">Track competition and motivate your students with rankings</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="relative w-full sm:w-1/3">
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="all">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
                <Filter className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" size={16} />
              </div>
              
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    view === 'students' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600'
                  }`}
                  onClick={() => setView('students')}
                >
                  Students
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    view === 'classes' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600'
                  }`}
                  onClick={() => setView('classes')}
                >
                  Classes
                </button>
              </div>
            </div>
          </div>

          {view === 'students' ? (
            <>
              {filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                  <p className="text-gray-500 mb-6">
                    {students.length === 0 
                      ? "You don't have any students enrolled yet. Add students to your classes to start tracking their progress and create leaderboards."
                      : "Try adjusting your search or filter criteria."
                    }
                  </p>
                  {students.length === 0 && (
                    <Link 
                      href="/dashboard/classes"
                      className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Classes
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredStudents.map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center">
                          {index < 3 ? (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                            }`}>
                              {index + 1}
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                              {index + 1}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {student.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.class}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-gray-900">{student.stats.points}</div>
                          <div className="text-gray-500">Points</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-gray-900">{student.stats.completion}%</div>
                          <div className="text-gray-500">Complete</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-gray-900">{student.stats.streaks}</div>
                          <div className="text-gray-500">Streak</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Leaderboard Feature Coming Soon!</h4>
                    <p className="text-sm text-blue-700">
                      Points, streaks, and achievements will be automatically calculated once students start completing assignments and using the learning games.
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {classes.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No classes yet</h3>
                  <p className="text-gray-500 mb-6">Create your first class to start tracking class-wide progress and rankings.</p>
                  <Link 
                    href="/dashboard/classes/new"
                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Create Class
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classes.map((cls, index) => (
                    <div key={cls.id} className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl p-6 border border-indigo-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{cls.name}</h3>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Total Points</span>
                          <span className="font-medium text-gray-800">{cls.totalPoints}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Students</span>
                          <span className="font-medium text-gray-800">{cls.studentCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Top Student</span>
                          <span className="font-medium text-gray-800">{cls.topStudent}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cls.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                          cls.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {cls.level}
                        </span>
                        <button 
                          className="text-indigo-600 hover:text-indigo-900 flex items-center text-sm"
                          onClick={() => {
                            setSelectedClass(cls.id);
                            setView('students');
                          }}
                        >
                          View Students <ChevronRight size={16} className="ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 