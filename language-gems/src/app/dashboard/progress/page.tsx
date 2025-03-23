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

  // Sample data - would be replaced with actual database calls
  useEffect(() => {
    const sampleStudents = [
      {
        id: '1',
        name: 'Alex Johnson',
        email: 'alex.j@example.com',
        class: 'Spanish 101',
        classId: '1',
        progress: {
          overall: 78,
          vocabulary: 82,
          grammar: 75,
          listening: 68,
          speaking: 80
        },
        activity: [
          { date: '2023-06-10', score: 85, type: 'Quiz', title: 'Food Vocabulary' },
          { date: '2023-06-12', score: 72, type: 'Exercise', title: 'Present Tense Verbs' },
          { date: '2023-06-15', score: 90, type: 'Project', title: 'Cultural Presentation' }
        ],
        strengths: ['Vocabulary', 'Speaking'],
        areas_for_improvement: ['Listening', 'Grammar']
      },
      {
        id: '2',
        name: 'Maria Garcia',
        email: 'maria.g@example.com',
        class: 'Spanish 101',
        classId: '1',
        progress: {
          overall: 92,
          vocabulary: 95,
          grammar: 90,
          listening: 88,
          speaking: 94
        },
        activity: [
          { date: '2023-06-11', score: 98, type: 'Quiz', title: 'Food Vocabulary' },
          { date: '2023-06-13', score: 92, type: 'Exercise', title: 'Present Tense Verbs' },
          { date: '2023-06-16', score: 95, type: 'Project', title: 'Cultural Presentation' }
        ],
        strengths: ['Vocabulary', 'Grammar', 'Speaking'],
        areas_for_improvement: []
      },
      {
        id: '3',
        name: 'James Wilson',
        email: 'james.w@example.com',
        class: 'Spanish 101',
        classId: '1',
        progress: {
          overall: 65,
          vocabulary: 70,
          grammar: 60,
          listening: 62,
          speaking: 68
        },
        activity: [
          { date: '2023-06-10', score: 65, type: 'Quiz', title: 'Food Vocabulary' },
          { date: '2023-06-13', score: 60, type: 'Exercise', title: 'Present Tense Verbs' },
          { date: '2023-06-15', score: 68, type: 'Project', title: 'Cultural Presentation' }
        ],
        strengths: ['Vocabulary'],
        areas_for_improvement: ['Grammar', 'Listening', 'Speaking']
      },
      {
        id: '4',
        name: 'Sophia Chen',
        email: 'sophia.c@example.com',
        class: 'Japanese Beginners',
        classId: '3',
        progress: {
          overall: 88,
          vocabulary: 90,
          grammar: 85,
          listening: 90,
          speaking: 80
        },
        activity: [
          { date: '2023-06-09', score: 92, type: 'Quiz', title: 'Hiragana Quiz' },
          { date: '2023-06-12', score: 85, type: 'Exercise', title: 'Basic Phrases' },
          { date: '2023-06-14', score: 88, type: 'Project', title: 'Intro Presentation' }
        ],
        strengths: ['Vocabulary', 'Listening'],
        areas_for_improvement: ['Speaking']
      },
      {
        id: '5',
        name: 'Ethan Roberts',
        email: 'ethan.r@example.com',
        class: 'German 301',
        classId: '4',
        progress: {
          overall: 76,
          vocabulary: 80,
          grammar: 72,
          listening: 75,
          speaking: 78
        },
        activity: [
          { date: '2023-06-08', score: 78, type: 'Quiz', title: 'Advanced Vocabulary' },
          { date: '2023-06-11', score: 74, type: 'Exercise', title: 'Past Perfect Tense' },
          { date: '2023-06-14', score: 80, type: 'Project', title: 'Literature Analysis' }
        ],
        strengths: ['Vocabulary'],
        areas_for_improvement: ['Grammar']
      }
    ];

    const sampleClasses = [
      { id: '1', name: 'Spanish 101', level: 'Beginner', avgProgress: 78 },
      { id: '2', name: 'Spanish 201', level: 'Intermediate', avgProgress: 72 },
      { id: '3', name: 'Japanese Beginners', level: 'Beginner', avgProgress: 85 },
      { id: '4', name: 'German 301', level: 'Advanced', avgProgress: 76 },
    ];
    
    // In a real implementation, we would fetch from the database
    // const fetchStudents = async () => {
    //   const { data, error } = await supabase
    //     .from('students')
    //     .select('*')
    //     .eq('teacher_id', user?.id);
    //   
    //   if (error) console.error('Error fetching students:', error);
    //   else setStudents(data || []);
    // };
    
    setStudents(sampleStudents);
    setClasses(sampleClasses);
    setLoading(false);
    
    // fetchStudents();
  }, [user]);

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
                  
                  <div className="flex space-x-2">
                    <button
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        view === 'list' 
                          ? 'bg-teal-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setView('list')}
                    >
                      <User size={16} className="mr-2" />
                      Students
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        view === 'class' 
                          ? 'bg-teal-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setView('class')}
                    >
                      <Users size={16} className="mr-2" />
                      Classes
                    </button>
                  </div>
                </div>
              </div>
              
              {view === 'list' ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => toggleSort('name')}
                        >
                          <div className="flex items-center">
                            Student
                            {sortBy === 'name' && (
                              sortDir === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => toggleSort('class')}
                        >
                          <div className="flex items-center">
                            Class
                            {sortBy === 'class' && (
                              sortDir === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => toggleSort('progress')}
                        >
                          <div className="flex items-center">
                            Overall Progress
                            {sortBy === 'progress' && (
                              sortDir === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strengths</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Areas for Improvement</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedStudents.length > 0 ? (
                        sortedStudents.map((student) => (
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
                              {student.class}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-36">
                                  <div 
                                    className={`h-2.5 rounded-full ${
                                      student.progress.overall >= 80 ? 'bg-emerald-500' :
                                      student.progress.overall >= 65 ? 'bg-amber-500' :
                                      'bg-red-500'
                                    }`} 
                                    style={{ width: `${student.progress.overall}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700">{student.progress.overall}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-wrap gap-1">
                                {student.strengths.map((strength: string, idx: number) => (
                                  <span 
                                    key={idx} 
                                    className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800"
                                  >
                                    {strength}
                                  </span>
                                ))}
                                {student.strengths.length === 0 && (
                                  <span className="text-sm text-gray-500">None identified</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-wrap gap-1">
                                {student.areas_for_improvement.map((area: string, idx: number) => (
                                  <span 
                                    key={idx} 
                                    className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800"
                                  >
                                    {area}
                                  </span>
                                ))}
                                {student.areas_for_improvement.length === 0 && (
                                  <span className="text-sm text-gray-500">None identified</span>
                                )}
                              </div>
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                            No students found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classes.map(cls => (
                    <div 
                      key={cls.id} 
                      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{cls.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">Level: {cls.level}</p>
                        
                        <div className="mb-6">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Average Progress</span>
                            <span className="font-medium">{getClassAverage(cls.id)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                getClassAverage(cls.id) >= 80 ? 'bg-emerald-500' :
                                getClassAverage(cls.id) >= 65 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`} 
                              style={{ width: `${getClassAverage(cls.id)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Vocabulary</div>
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-indigo-500 h-2 rounded-full" 
                                  style={{ width: `${getClassAverage(cls.id, 'vocabulary')}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">{getClassAverage(cls.id, 'vocabulary')}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Grammar</div>
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-indigo-500 h-2 rounded-full" 
                                  style={{ width: `${getClassAverage(cls.id, 'grammar')}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">{getClassAverage(cls.id, 'grammar')}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Listening</div>
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-indigo-500 h-2 rounded-full" 
                                  style={{ width: `${getClassAverage(cls.id, 'listening')}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">{getClassAverage(cls.id, 'listening')}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Speaking</div>
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-indigo-500 h-2 rounded-full" 
                                  style={{ width: `${getClassAverage(cls.id, 'speaking')}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">{getClassAverage(cls.id, 'speaking')}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">
                            {students.filter(s => s.classId === cls.id).length} Students
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
                    </div>
                  ))}
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
  const skillColors: Record<string, string> = {
    vocabulary: 'bg-blue-500',
    grammar: 'bg-violet-500',
    listening: 'bg-amber-500',
    speaking: 'bg-emerald-500'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
          <p className="text-gray-500">{student.class} · {student.email}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Award className="mr-2 text-teal-600" size={20} />
            Overall Progress
          </h3>
          
          <div className="flex items-center justify-between mb-6">
            <div className="text-3xl font-bold text-gray-800">{student.progress.overall}%</div>
            <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
              student.progress.overall >= 80 ? 'bg-emerald-500' :
              student.progress.overall >= 65 ? 'bg-amber-500' :
              'bg-red-500'
            }`}>
              {student.progress.overall >= 80 ? 'Excellent' :
              student.progress.overall >= 65 ? 'Good' : 'Needs Improvement'}
            </div>
          </div>
          
          <div className="space-y-4">
            {Object.entries(student.progress)
              .filter(([key]) => key !== 'overall')
              .map(([skill, value]) => (
                <div key={skill}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-gray-700">{skill}</span>
                    <span className="font-medium text-gray-900">{value as number}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`${skillColors[skill]} h-2.5 rounded-full`} 
                      style={{ width: `${value as number}%` }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="mr-2 text-teal-600" size={20} />
            Performance Summary
          </h3>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Strengths</h4>
            <div className="flex flex-wrap gap-2">
              {student.strengths.length > 0 ? student.strengths.map((strength: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                  {strength}
                </span>
              )) : (
                <p className="text-sm text-gray-500">No specific strengths identified yet</p>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Areas for Improvement</h4>
            <div className="flex flex-wrap gap-2">
              {student.areas_for_improvement.length > 0 ? student.areas_for_improvement.map((area: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                  {area}
                </span>
              )) : (
                <p className="text-sm text-gray-500">No specific areas for improvement identified</p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Recommendations</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {student.areas_for_improvement.length > 0 ? (
                <>
                  {student.areas_for_improvement.includes('Grammar') && (
                    <li>Assign additional grammar exercises focusing on weak areas</li>
                  )}
                  {student.areas_for_improvement.includes('Vocabulary') && (
                    <li>Provide additional vocabulary flashcards and memory games</li>
                  )}
                  {student.areas_for_improvement.includes('Listening') && (
                    <li>Recommend listening comprehension activities and podcasts</li>
                  )}
                  {student.areas_for_improvement.includes('Speaking') && (
                    <li>Schedule conversation practice sessions with peers</li>
                  )}
                </>
              ) : (
                <li>Continue challenging this student with advanced material</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-5 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Clock className="mr-2 text-teal-600" size={20} />
          Recent Activity
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {student.activity.map((activity: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(activity.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="mr-2">
                        {activity.type === 'Quiz' && <BookOpen className="text-indigo-500" size={16} />}
                        {activity.type === 'Exercise' && <CheckCircle className="text-emerald-500" size={16} />}
                        {activity.type === 'Project' && <Star className="text-amber-500" size={16} />}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                        <div className="text-xs text-gray-500">{activity.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activity.score >= 80 ? 'bg-emerald-100 text-emerald-800' :
                      activity.score >= 65 ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {activity.score}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Back to List
        </button>
        
        <div className="space-x-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Message Student
          </button>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            Create Custom Assignment
          </button>
        </div>
      </div>
    </div>
  );
} 