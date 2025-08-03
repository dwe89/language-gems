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
  BookOpen, CheckCircle, Star, TrendingUp, AlertCircle, Bell, PenTool,
} from 'lucide-react';
import { supabaseBrowser } from '../../../components/auth/AuthProvider';
import type { Database } from '../../../lib/database.types';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';

// Type definitions
type Class = {
  id: string;
  name: string;
  teacher_id: string;
};

type Enrollment = {
  student_id: string;
  enrolled_at: string;
  class_id: string;
  classes?: Class;
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
  const [error, setError] = useState<string | null>(null);

  const supabase = supabaseBrowser;

  // --- MOCK DATA FOR DEMO PURPOSES ---
  const mockStudents = [
    {
      id: 'mock-1',
      name: 'Emma Thompson',
      email: 'emma.t@example.com',
      class: 'Year 7 French',
      classId: 'class-1',
      enrolled_at: '2024-01-15T10:00:00Z',
      progress: {
        overall: 85,
        vocabulary: 90,
        grammar: 80,
        listening: 75,
        speaking: 88,
      },
      activity: ['Completed Vocab Blast', 'Mastered 20 words'],
      strengths: ['Vocabulary retention', 'Reading comprehension'],
      areas_for_improvement: ['Grammar (verb tenses)'],
      isAtRisk: false,
      last_active: '2024-07-28T14:30:00Z'
    },
    {
      id: 'mock-2',
      name: 'James Wilson',
      email: 'james.w@example.com',
      class: 'Year 7 French',
      classId: 'class-1',
      enrolled_at: '2024-01-20T10:00:00Z',
      progress: {
        overall: 62,
        vocabulary: 70,
        grammar: 50,
        listening: 65,
        speaking: 60,
      },
      activity: ['Played Memory Match'],
      strengths: ['Listening skills'],
      areas_for_improvement: ['Grammar (verb tenses)', 'Reading speed'],
      isAtRisk: true,
      last_active: '2024-07-26T16:45:00Z'
    },
    {
      id: 'mock-3',
      name: 'Sarah Chen',
      email: 'sarah.c@example.com',
      class: 'Year 8 Spanish',
      classId: 'class-2',
      enrolled_at: '2024-01-22T09:15:00Z',
      progress: {
        overall: 91,
        vocabulary: 95,
        grammar: 88,
        listening: 92,
        speaking: 90,
      },
      activity: ['Completed Sentence Sprint'],
      strengths: ['Grammar', 'Speaking'],
      areas_for_improvement: ['Formal vs informal language'],
      isAtRisk: false,
      last_active: '2024-08-01T13:10:00Z'
    },
    {
      id: 'mock-4',
      name: 'Alex Johnson',
      email: 'alex.j@example.com',
      class: 'Year 7 French',
      classId: 'class-1',
      enrolled_at: '2024-01-25T11:30:00Z',
      progress: {
        overall: 78,
        vocabulary: 82,
        grammar: 75,
        listening: 70,
        speaking: 80,
      },
      activity: ['Completed Vocab Blast'],
      strengths: ['Vocabulary acquisition'],
      areas_for_improvement: ['Pronunciation'],
      isAtRisk: false,
      last_active: '2024-07-30T10:00:00Z'
    },
    {
      id: 'mock-5',
      name: 'Sophia Miller',
      email: 'sophia.m@example.com',
      class: 'Year 8 Spanish',
      classId: 'class-2',
      enrolled_at: '2024-01-28T14:45:00Z',
      progress: {
        overall: 55,
        vocabulary: 60,
        grammar: 45,
        listening: 50,
        speaking: 55,
      },
      activity: ['Played VocabMaster'],
      strengths: ['Basic vocabulary'],
      areas_for_improvement: ['Grammar (future tense)', 'Listening skills'],
      isAtRisk: true,
      last_active: '2024-07-25T14:45:00Z'
    },
  ];
  
  const mockClasses = [
    {
      id: 'class-1',
      name: 'Year 7 French',
      teacher_id: '1',
    },
    {
      id: 'class-2',
      name: 'Year 8 Spanish',
      teacher_id: '1',
    },
  ];
  
  const mockInsights = [
    {
      id: 'insight-1',
      title: 'Students struggling with Past Tense Verbs',
      description: 'AI has detected that James Wilson and Sophia Miller are consistently misusing past tense verbs.',
      recommendation: 'Create a targeted assignment focusing on irregular verbs.',
      icon: <Bell className="h-6 w-6 text-yellow-500" />,
      link: '/dashboard/analytics/past-tense-verbs',
    },
    {
      id: 'insight-2',
      title: 'Class B has low assignment completion',
      description: 'The average assignment completion rate for Year 8 Spanish is 65%, which is below the school average.',
      recommendation: 'Review engagement metrics and send a reminder to the class.',
      icon: <AlertCircle className="h-6 w-6 text-orange-500" />,
      link: '/dashboard/classes/class-2',
    },
  ];

  useEffect(() => {
    // Replace this with a real data fetch from supabase
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setStudents(mockStudents);
      setClasses(mockClasses);
      setLoading(false);
    };

    if (user) {
      fetchData();
    } else {
      setLoading(false);
      setError('Authentication required.');
    }
  }, [user]);
  // --- END MOCK DATA ---

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
  
  const getDaysSinceLastActive = (dateString: string) => {
    const now = new Date();
    const lastActive = new Date(dateString);
    const diffInMilliseconds = now.getTime() - lastActive.getTime();
    return Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center p-16 bg-white rounded-3xl shadow-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto mb-6"></div>
          <p className="text-slate-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center p-12 bg-white rounded-3xl shadow-2xl max-w-md">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-3xl flex items-center justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Error Loading Data</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">{error}</p>
          <Link 
            href="/dashboard"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  // The main component
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader
          title="Advanced Analytics"
          description="Monitor student progress and gain AI-powered insights"
          icon={<BarChart2 className="h-5 w-5 text-white" />}
        />

        {/* AI-Powered Insights Section (The Brain) */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
            <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                        <Bell className="h-6 w-6 mr-3 text-indigo-600" />
                        Predictive Insights
                    </h2>
                    <Link href="/dashboard/analytics/ai-insights" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors flex items-center">
                        View All Insights
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                </div>
                
                {mockInsights.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mockInsights.map((insight) => (
                            <div key={insight.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start space-x-4 shadow-sm">
                                <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-center">
                                    {insight.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-1">{insight.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-3">{insight.description}</p>
                                    <Link href={insight.link} className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                                        {insight.recommendation}
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                            <Bell className="h-10 w-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">No Insights Today</h3>
                        <p className="text-slate-600">The AI is currently analyzing student data. Check back soon for new insights.</p>
                    </div>
                )}
            </div>
        </div>

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
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div className="flex-1 space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">Student Progress</h2>
                  <p className="text-slate-600">Overview of student performance and engagement</p>
                </div>
                
                {/* Search and Filter */}
                <div className="flex max-w-3xl gap-3 flex-wrap">
                  <div className="relative flex-1 min-w-[250px]">
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  </div>
                  
                  <div className="relative">
                    <select
                      className="pl-4 pr-10 py-3 border border-slate-300 rounded-xl bg-white appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm font-medium text-slate-700 min-w-[150px]"
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
                  <div className="bg-slate-100 rounded-xl p-1 flex">
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
                getClassAverage={getClassAverage}
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
  onViewDetails,
}: { 
  students: any[], 
  sortBy: string, 
  sortDir: 'asc' | 'desc', 
  onSort: (criteria: string) => void, 
  onViewDetails: (student: any) => void,
  getClassAverage: (classId: string) => number
}) {
  if (students.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-3xl flex items-center justify-center mb-6 border border-indigo-200">
            <Users className="h-12 w-12 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">No students found</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">
            You don't have any students enrolled yet. Add students to your classes to start tracking their progress.
          </p>
          <Link 
            href="/dashboard/classes"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg inline-flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>Manage Classes</span>
          </Link>
        </div>
      </div>
    );
  }
  
  const getDaysSinceLastActive = (dateString: string) => {
    const now = new Date();
    const lastActive = new Date(dateString);
    const diffInMilliseconds = now.getTime() - lastActive.getTime();
    return Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (days: number) => {
    if (days < 2) return 'bg-emerald-100 text-emerald-700';
    if (days < 7) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-2xl font-bold text-slate-900">Student Progress Overview</h3>
        <p className="text-slate-600 text-sm mt-1">{students.length} student{students.length !== 1 ? 's' : ''} found</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
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
                Last Active
              </th>
              <th scope="col" className="relative px-6 py-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {students.map((student) => {
              const daysSinceActive = student.last_active ? getDaysSinceLastActive(student.last_active) : -1;
              const status = student.isAtRisk ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  At Risk
                </span>
              ) : (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(daysSinceActive)}`}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {daysSinceActive < 2 ? 'Active' : daysSinceActive < 7 ? 'Recent' : 'Inactive'}
                </span>
              )
              return (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-semibold">
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
                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${student.progress.overall}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 min-w-[35px]">{student.progress.overall}%</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {status}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-slate-400" />
                    <span>{student.last_active ? new Date(student.last_active).toLocaleDateString() : 'N/A'}</span>
                  </div>
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
            )})}
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
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-3xl flex items-center justify-center mb-6 border border-indigo-200">
            <BookOpen className="h-12 w-12 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">No classes yet</h3>
          <p className="text-slate-600 mb-8 leading-relaxed">Create your first class to start tracking student progress.</p>
          <Link 
            href="/dashboard/classes"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg inline-flex items-center space-x-2"
          >
            <BookOpen className="h-4 w-4" />
            <span>Create Class</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {classes.map(cls => {
        const classStudents = students.filter(s => s.classId === cls.id);
        const average = getClassAverage(cls.id);
        
        return (
          <div key={cls.id} className="bg-white rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
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
                <Link
                  href={`/dashboard/classes/${cls.id}`}
                  className="text-indigo-600 hover:text-indigo-900 flex items-center font-semibold text-sm transition-colors group-hover:text-purple-600"
                >
                  View Details <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
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
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
          >
            <ChevronRight size={20} className="rotate-180 mr-2" />
            Back to Progress
          </button>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">{student.name}</h2>
            <p className="text-slate-600">{student.class}</p>
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-indigo-600" />
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
        
        {/* Progress Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
              <BarChart2 className="h-5 w-5 text-indigo-600" />
            </div>
            Progress Status
          </h3>
          
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {student.progress.overall}%
            </div>
            <div className="text-slate-600 mb-4 font-medium">Overall Progress</div>
            <div className="w-full bg-slate-200 rounded-full h-4 mb-4">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-500" 
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
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
            <Clock className="h-5 w-5 text-indigo-600" />
          </div>
          Recent Activity
        </h3>
        
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-slate-100 rounded-3xl flex items-center justify-center mb-6 border border-slate-200">
            <Clock className="h-12 w-12 text-slate-400" />
          </div>
          <h4 className="text-xl font-semibold text-slate-900 mb-2">No activity data available</h4>
          <p className="text-slate-600 leading-relaxed max-w-md mx-auto">
            Activities will appear here once the student starts completing assignments and participating in games.
          </p>
        </div>
      </div>
    </div>
  );
}
