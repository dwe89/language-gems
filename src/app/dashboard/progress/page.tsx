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
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '../../../lib/database.types';

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
            classes!inner(id, name, teacher_id)
          `)
          .eq('classes.teacher_id', user.id);

        if (enrollmentsError) {
          console.error('Error fetching enrollments:', enrollmentsError);
        }

        // Get student profiles separately
        let studentsData: any[] = [];
        if (enrollmentsData && enrollmentsData.length > 0) {
          const studentIds = enrollmentsData.map(enrollment => enrollment.student_id);
          
          const { data: userProfiles } = await supabase
            .from('user_profiles')
            .select('user_id, display_name, email')
            .in('user_id', studentIds);

          // Transform the data to match our student format
          studentsData = enrollmentsData.map(enrollment => {
            const profile = userProfiles?.find(p => p.user_id === enrollment.student_id);
            const classInfo = enrollment.classes[0]; // Get first class (should only be one due to inner join)
            
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-rose-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-teal-800 mb-2">Progress Tracking</h1>
          <p className="text-teal-600">Monitor your students' progress and identify areas for improvement</p>
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
                        view === 'list' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600'
                      }`}
                      onClick={() => setView('list')}
                    >
                      List View
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${
                        view === 'class' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600'
                      }`}
                      onClick={() => setView('class')}
                    >
                      Class View
                    </button>
                  </div>
                </div>
              </div>

              {view === 'list' ? (
                <div className="overflow-hidden">
                  {sortedStudents.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                      <p className="text-gray-500 mb-6">
                        {students.length === 0 
                          ? "You don't have any students enrolled yet. Add students to your classes to start tracking their progress."
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
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button 
                              className="flex items-center space-x-1 hover:text-teal-600"
                              onClick={() => toggleSort('name')}
                            >
                              <span>Student</span>
                              {sortBy === 'name' && (
                                sortDir === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                              )}
                            </button>
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button 
                              className="flex items-center space-x-1 hover:text-teal-600"
                              onClick={() => toggleSort('class')}
                            >
                              <span>Class</span>
                              {sortBy === 'class' && (
                                sortDir === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                              )}
                            </button>
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button 
                              className="flex items-center space-x-1 hover:text-teal-600"
                              onClick={() => toggleSort('progress')}
                            >
                              <span>Overall Progress</span>
                              {sortBy === 'progress' && (
                                sortDir === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                              )}
                            </button>
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Enrollment Date
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sortedStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-teal-600 rounded-full flex items-center justify-center text-white">
                                  {student.name.charAt(0)}
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-gray-900">{student.name}</div>
                                  <div className="text-sm text-gray-500">{student.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {student.class}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-36">
                                  <div 
                                    className="bg-gray-400 h-2.5 rounded-full" 
                                    style={{ width: `${student.progress.overall}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700">{student.progress.overall}%</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                No progress data yet
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.enrolled_at ? new Date(student.enrolled_at).toLocaleDateString() : 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                className="text-teal-600 hover:text-teal-900 flex items-center"
                                onClick={() => handleViewDetails(student)}
                              >
                                <span className="mr-1">Details</span>
                                <ChevronRight size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classes.map(cls => {
                    const classStudents = students.filter(s => s.classId === cls.id);
                    return (
                      <div key={cls.id} className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">{cls.name}</h3>
                          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {classStudents.length} students
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Class Average</span>
                            <span className="font-medium text-gray-800">0%</span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: '0%' }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">
                            {classStudents.length} Students
                          </span>
                          <button 
                            className="text-teal-600 hover:text-teal-900 flex items-center"
                            onClick={() => {
                              setSelectedClass(cls.id);
                              setView('list');
                            }}
                          >
                            View Students <ChevronRight size={16} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  
                  {classes.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No classes yet</h3>
                      <p className="text-gray-500 mb-6">Create your first class to start tracking student progress.</p>
                      <Link 
                        href="/dashboard/classes/new"
                        className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Create Class
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-teal-600 hover:text-teal-800"
        >
          <ChevronRight size={20} className="rotate-180 mr-1" />
          Back to Progress
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Award className="mr-2 text-teal-600" size={20} />
            Student Information
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{student.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Class:</span>
              <span className="font-medium">{student.class}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Enrolled:</span>
              <span className="font-medium">
                {student.enrolled_at ? new Date(student.enrolled_at).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart2 className="mr-2 text-teal-600" size={20} />
            Progress Status
          </h3>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-2">0%</div>
            <div className="text-gray-500 mb-4">Overall Progress</div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              No assignments completed yet
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Clock className="mr-2 text-teal-600" size={20} />
          Recent Activity
        </h3>
        
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No activity data available</p>
          <p className="text-sm text-gray-400 mt-1">Activities will appear here once the student starts completing assignments</p>
        </div>
      </div>
    </div>
  );
} 