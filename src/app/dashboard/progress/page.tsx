'use client';

// Add export config to skip static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import Link from 'next/link';
import { 
  Search, Filter, BarChart2, ArrowUp, ArrowDown, 
  Users, User, ChevronRight, Calendar, Clock, Award,
  BookOpen, CheckCircle, Star, TrendingUp
} from 'lucide-react';
import { supabaseBrowser } from '../../../components/auth/AuthProvider';
import type { Database } from '../../../lib/database.types';

// Define types for our data
type Enrollment = {
  student_id: string;
  enrolled_at: string;
  classes: {
    id: string;
    name: string;
    teacher_id: string;
  }[] | null;
};

type UserProfile = {
  user_id: string;
  display_name: string | null;
  email: string;
};

interface AssignmentOverview {
  id: string;
  title: string;
  class_name: string;
  total_students: number;
  submissions: number;
  created_by: string;
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [view, setView] = useState<'list' | 'class' | 'detailed'>('list');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const supabase = supabaseBrowser;

  // Fetch real data from database
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch teacher's classes
        const { data: classesData, error: classesError } = await supabase
          .from('classes')
          .select('*')
          .eq('created_by', user.id);

        if (classesError) {
          console.error('Error fetching classes:', classesError);
        }

        // Fetch real students enrolled in this teacher's classes
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('class_enrollments')
          .select(`
            student_id,
            enrolled_at,
            class_id,
            classes!inner(id, name, created_by)
          `)
          .eq('classes.created_by', user.id);

        if (enrollmentsError) {
          console.error('Error fetching enrollments:', enrollmentsError);
        }

        // Get student profiles separately
        let studentsData: any[] = [];
        if (enrollmentsData && enrollmentsData.length > 0) {
          const studentIds = enrollmentsData.map((enrollment: Enrollment) => enrollment.student_id);
          
          const { data: userProfiles } = await supabase
            .from('user_profiles')
            .select('user_id, display_name, email')
            .in('user_id', studentIds);

          // Transform the data to match our student format
          studentsData = enrollmentsData.map((enrollment: Enrollment) => {
            const profile = userProfiles?.find((p: UserProfile) => p.user_id === enrollment.student_id);
            const classInfo = enrollment.classes?.[0];
            
            return {
              id: enrollment.student_id,
              name: profile?.display_name || 'Unknown Student',
              email: profile?.email || '',
              class: classInfo?.name || 'Unknown Class',
              classId: classInfo?.id || '',
              enrolled_at: enrollment.enrolled_at,
              // Since we don't have progress tracking yet, show 0
              progress: {
                overall: 0,
                vocabulary: 0,
                grammar: 0,
                listening: 0,
                speaking: 0
              },
              activity: [],
              strengths: [],
              areas_for_improvement: []
            };
          });
        }

        setStudents(studentsData);
        setClasses(classesData || []);
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

  // Sort students based on selected criteria
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDir === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'progress') {
      return sortDir === 'asc'
        ? a.progress.overall - b.progress.overall
        : b.progress.overall - a.progress.overall;
    } else if (sortBy === 'class') {
      return sortDir === 'asc'
        ? a.class.localeCompare(b.class)
        : b.class.localeCompare(a.class);
    }
    return 0;
  });

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student);
    setView('detailed');
  };

  const getClassAverage = (classId: string, aspect: string = 'overall') => {
    const classStudents = students.filter(s => s.classId === classId);
    if (classStudents.length === 0) return 0;
    
    return Math.round(
      classStudents.reduce((sum, student) => sum + student.progress[aspect], 0) / classStudents.length
    );
  };

  const toggleSort = (criteria: string) => {
    if (sortBy === criteria) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortDir('asc');
    }
  };

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
              <BarChart2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Student Progress</h1>
              <p className="text-slate-600">Monitor your students' learning journey and achievements</p>
            </div>
          </div>
        </header>

        {view === 'detailed' && selectedStudent ? (
          <StudentDetailView 
            student={selectedStudent} 
            onBack={() => {
              setView('list');
              setSelectedStudent(null);
            }} 
          />
        ) : (
          <>
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
                      onClick={() => setView('list')}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                        view === 'list'
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      <Users className="h-4 w-4 mr-2 inline" />
                      List View
                    </button>
                    <button
                      onClick={() => setView('class')}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                        view === 'class'
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      <BookOpen className="h-4 w-4 mr-2 inline" />
                      Class View
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Content */}
            {view === 'list' ? (
              <StudentListView 
                students={sortedStudents}
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={toggleSort}
                onViewDetails={handleViewDetails}
              />
            ) : (
              <ClassProgressView 
                classes={classes}
                students={students}
                getClassAverage={getClassAverage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Student List View Component
function StudentListView({ 
  students, 
  sortBy, 
  sortDir, 
  onSort, 
  onViewDetails 
}: { 
  students: any[], 
  sortBy: string, 
  sortDir: 'asc' | 'desc', 
  onSort: (criteria: string) => void, 
  onViewDetails: (student: any) => void 
}) {
  if (students.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200/50">
            <Users className="h-10 w-10 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">No students found</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">
            You don't have any students enrolled yet. Add students to your classes to start tracking their progress.
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
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg overflow-hidden">
      <div className="p-6 border-b border-slate-200/60">
        <h3 className="text-lg font-bold text-slate-900">Student Progress Overview</h3>
        <p className="text-slate-600 text-sm mt-1">{students.length} student{students.length !== 1 ? 's' : ''} found</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/60">
          <thead className="bg-slate-50/50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <button 
                  className="flex items-center space-x-1 hover:text-indigo-600 transition-colors"
                  onClick={() => onSort('name')}
                >
                  <span>Student</span>
                  {sortBy === 'name' && (
                    sortDir === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </button>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <button 
                  className="flex items-center space-x-1 hover:text-indigo-600 transition-colors"
                  onClick={() => onSort('class')}
                >
                  <span>Class</span>
                  {sortBy === 'class' && (
                    sortDir === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </button>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <button 
                  className="flex items-center space-x-1 hover:text-indigo-600 transition-colors"
                  onClick={() => onSort('progress')}
                >
                  <span>Overall Progress</span>
                  {sortBy === 'progress' && (
                    sortDir === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  )}
                </button>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Enrolled
              </th>
              <th scope="col" className="relative px-6 py-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200/60">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold">
                      {student.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold text-slate-900">{student.name}</div>
                      <div className="text-sm text-slate-500">{student.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
                    {student.class}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full bg-slate-200 rounded-full h-2.5 mr-3 max-w-32">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${student.progress.overall}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 min-w-[35px]">{student.progress.overall}%</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    No progress data yet
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {student.enrolled_at ? new Date(student.enrolled_at).toLocaleDateString() : 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    className="text-indigo-600 hover:text-indigo-900 flex items-center font-semibold transition-colors"
                    onClick={() => onViewDetails(student)}
                  >
                    <span className="mr-1">Details</span>
                    <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Class Progress View Component
function ClassProgressView({ 
  classes, 
  students, 
  getClassAverage 
}: { 
  classes: any[], 
  students: any[], 
  getClassAverage: (classId: string) => number 
}) {
  if (classes.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200/50">
            <BookOpen className="h-10 w-10 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">No classes yet</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">Create your first class to start tracking student progress.</p>
          <Link 
            href="/dashboard/classes"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
          >
            <BookOpen className="h-4 w-4" />
            <span>Create Class</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {classes.map(cls => {
        const classStudents = students.filter(s => s.classId === cls.id);
        const average = getClassAverage(cls.id);
        
        return (
          <div key={cls.id} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{cls.name}</h3>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                  {classStudents.length} students
                </div>
              </div>
              <p className="text-indigo-100 text-sm">{cls.description || 'No description available'}</p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 font-medium">Class Average</span>
                  <span className="font-bold text-slate-900">{average}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${average}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{classStudents.length} students enrolled</span>
                  </div>
                </div>
                <button 
                  className="text-indigo-600 hover:text-indigo-900 flex items-center font-semibold text-sm transition-colors group-hover:text-purple-600"
                >
                  View Details <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StudentDetailView({ 
  student, 
  onBack 
}: { 
  student: any, 
  onBack: () => void 
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
          >
            <ChevronRight size={20} className="rotate-180 mr-2" />
            Back to Progress
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
            <p className="text-slate-600">{student.class}</p>
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <User className="h-4 w-4 text-white" />
            </div>
            Student Information
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Email:</span>
              <span className="font-semibold text-slate-900">{student.email}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Class:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
                {student.class}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-slate-600 font-medium">Enrolled:</span>
              <span className="font-semibold text-slate-900">
                {student.enrolled_at ? new Date(student.enrolled_at).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <BarChart2 className="h-4 w-4 text-white" />
            </div>
            Progress Status
          </h3>
          
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {student.progress.overall}%
            </div>
            <div className="text-slate-600 mb-4 font-medium">Overall Progress</div>
            <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${student.progress.overall}%` }}
              ></div>
            </div>
            <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-xl text-sm font-semibold border border-amber-200">
              No assignments completed yet
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <Clock className="h-4 w-4 text-white" />
          </div>
          Recent Activity
        </h3>
        
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6 border border-slate-200">
            <Clock className="h-10 w-10 text-slate-400" />
          </div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">No activity data available</h4>
          <p className="text-slate-600 leading-relaxed max-w-md mx-auto">
            Activities will appear here once the student starts completing assignments and participating in games.
          </p>
        </div>
      </div>
    </div>
  );
} 