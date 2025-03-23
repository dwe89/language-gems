'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart3, 
  LineChart, 
  PieChart,
  Calendar, 
  Download,
  Filter,
  Users,
  ArrowLeft,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '../../../lib/database.types';

// Type definitions
type Student = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  class_id: string;
  completed_activities: number;
  last_active: string;
  progress: number;
  streak: number;
};

type Class = {
  id: string;
  name: string;
  students: number;
  average_progress: number;
  created_at: string;
};

type ReportData = {
  weekly_progress: {
    day: string;
    value: number;
  }[];
  activity_breakdown: {
    activity: string;
    count: number;
    percentage: number;
  }[];
  skill_levels: {
    skill: string;
    level: number;
    max_level: number;
  }[];
};

export default function ReportsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('week');
  const [selectedChart, setSelectedChart] = useState<string>('progress');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  
  const supabase = createClientComponentClient<Database>();
  
  // Simulate loading data
  useEffect(() => {
    // In a real implementation, we would fetch from Supabase
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample data
      const sampleStudents: Student[] = [
        { 
          id: '1', 
          name: 'Emma Thompson', 
          avatar: '/avatars/girl1.png', 
          email: 'emma@example.com',
          class_id: 'class1',
          completed_activities: 42,
          last_active: '2023-05-15T10:30:00',
          progress: 78,
          streak: 5
        },
        { 
          id: '2', 
          name: 'Liam Johnson', 
          avatar: '/avatars/boy1.png', 
          email: 'liam@example.com',
          class_id: 'class1',
          completed_activities: 36,
          last_active: '2023-05-14T14:20:00',
          progress: 65,
          streak: 3
        },
        { 
          id: '3', 
          name: 'Sophia Wang', 
          avatar: '/avatars/girl2.png', 
          email: 'sophia@example.com',
          class_id: 'class2',
          completed_activities: 58,
          last_active: '2023-05-15T16:45:00',
          progress: 92,
          streak: 12
        },
        { 
          id: '4', 
          name: 'Noah Garcia', 
          avatar: '/avatars/boy2.png', 
          email: 'noah@example.com',
          class_id: 'class2',
          completed_activities: 29,
          last_active: '2023-05-13T09:15:00',
          progress: 45,
          streak: 1
        },
        { 
          id: '5', 
          name: 'Ava Martinez', 
          avatar: '/avatars/girl3.png', 
          email: 'ava@example.com',
          class_id: 'class3',
          completed_activities: 51,
          last_active: '2023-05-15T11:30:00',
          progress: 88,
          streak: 7
        }
      ];
      
      const sampleClasses: Class[] = [
        {
          id: 'class1',
          name: 'French 101',
          students: 24,
          average_progress: 72,
          created_at: '2023-01-15T08:00:00'
        },
        {
          id: 'class2',
          name: 'Spanish Beginners',
          students: 18,
          average_progress: 68,
          created_at: '2023-02-10T09:30:00'
        },
        {
          id: 'class3',
          name: 'Japanese Advanced',
          students: 12,
          average_progress: 85,
          created_at: '2023-03-05T10:15:00'
        }
      ];
      
      const sampleReportData: ReportData = {
        weekly_progress: [
          { day: 'Mon', value: 65 },
          { day: 'Tue', value: 72 },
          { day: 'Wed', value: 68 },
          { day: 'Thu', value: 76 },
          { day: 'Fri', value: 82 },
          { day: 'Sat', value: 79 },
          { day: 'Sun', value: 85 }
        ],
        activity_breakdown: [
          { activity: 'Vocabulary Practice', count: 145, percentage: 42 },
          { activity: 'Grammar Exercises', count: 98, percentage: 28 },
          { activity: 'Reading Comprehension', count: 56, percentage: 16 },
          { activity: 'Listening Activities', count: 32, percentage: 9 },
          { activity: 'Speaking Practice', count: 18, percentage: 5 }
        ],
        skill_levels: [
          { skill: 'Vocabulary', level: 4, max_level: 5 },
          { skill: 'Grammar', level: 3, max_level: 5 },
          { skill: 'Reading', level: 4, max_level: 5 },
          { skill: 'Listening', level: 3, max_level: 5 },
          { skill: 'Speaking', level: 2, max_level: 5 },
          { skill: 'Writing', level: 3, max_level: 5 }
        ]
      };
      
      setStudents(sampleStudents);
      setClasses(sampleClasses);
      setReportData(sampleReportData);
      setLoading(false);
    };

    fetchData();
  }, []);
  
  // Filter students based on selected class
  const filteredStudents = selectedClass === 'all' 
    ? students 
    : students.filter(student => student.class_id === selectedClass);
    
  // Calculate class averages
  const classAverages = classes.map(cls => ({
    name: cls.name,
    progress: cls.average_progress
  }));
  
  // Export report functionality (placeholder)
  const exportReport = () => {
    // In a real implementation, this would generate a CSV or PDF
    alert('Report exported successfully!');
  };
  
  // Function to render the selected chart
  const renderChart = () => {
    // In a real implementation, these would be actual charts from a library like Chart.js or Recharts
    switch(selectedChart) {
      case 'progress':
        return (
          <div className="h-80 p-4 flex items-center justify-center bg-white rounded-lg border border-gray-200">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <LineChart size={48} className="text-teal-600 mb-4" />
              <p className="text-gray-500 text-center">
                This is where a progress chart would be displayed.<br />
                In a real implementation, this would be a line chart showing student progress over time.
              </p>
            </div>
          </div>
        );
      case 'activity':
        return (
          <div className="h-80 p-4 flex items-center justify-center bg-white rounded-lg border border-gray-200">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <PieChart size={48} className="text-indigo-600 mb-4" />
              <p className="text-gray-500 text-center">
                This is where an activity breakdown chart would be displayed.<br />
                In a real implementation, this would be a pie chart showing the distribution of activities.
              </p>
            </div>
          </div>
        );
      case 'skills':
        return (
          <div className="h-80 p-4 flex items-center justify-center bg-white rounded-lg border border-gray-200">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <BarChart3 size={48} className="text-emerald-600 mb-4" />
              <p className="text-gray-500 text-center">
                This is where a skills assessment chart would be displayed.<br />
                In a real implementation, this would be a bar chart showing skill levels.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-indigo-100 to-rose-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center">
          <Link 
            href="/dashboard" 
            className="mr-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="text-indigo-700" size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-indigo-800 mb-2">Reports & Analytics</h1>
            <p className="text-indigo-600">Track student progress and performance metrics</p>
          </div>
        </header>
        
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Dashboard Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2">
                  <label htmlFor="class-select" className="block text-sm font-medium text-gray-700">
                    Class Filter
                  </label>
                  <select
                    id="class-select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Classes</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="timeframe-select" className="block text-sm font-medium text-gray-700">
                    Timeframe
                  </label>
                  <select
                    id="timeframe-select"
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                    <option value="quarter">Past Quarter</option>
                    <option value="year">Past Year</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="chart-select" className="block text-sm font-medium text-gray-700">
                    Chart Type
                  </label>
                  <select
                    id="chart-select"
                    value={selectedChart}
                    onChange={(e) => setSelectedChart(e.target.value)}
                    className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="progress">Progress Over Time</option>
                    <option value="activity">Activity Breakdown</option>
                    <option value="skills">Skills Assessment</option>
                  </select>
                </div>
                
                <button
                  onClick={exportReport}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center"
                >
                  <Download size={18} className="mr-2" />
                  Export Report
                </button>
              </div>
            </div>
            
            {/* Main Chart */}
            <div className="mb-8">
              {renderChart()}
            </div>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Students</p>
                    <h3 className="text-3xl font-semibold mt-1">
                      {selectedClass === 'all' 
                        ? students.length 
                        : filteredStudents.length}
                    </h3>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="text-blue-600" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <ArrowUpRight size={16} className="mr-1" />
                  <span>4% increase from last month</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Average Progress</p>
                    <h3 className="text-3xl font-semibold mt-1">
                      {selectedClass === 'all'
                        ? Math.round(students.reduce((acc, student) => acc + student.progress, 0) / students.length)
                        : Math.round(filteredStudents.reduce((acc, student) => acc + student.progress, 0) / filteredStudents.length)}%
                    </h3>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <LineChart className="text-green-600" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <ArrowUpRight size={16} className="mr-1" />
                  <span>7% increase from last week</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Active Streak Average</p>
                    <h3 className="text-3xl font-semibold mt-1">
                      {selectedClass === 'all'
                        ? Math.round(students.reduce((acc, student) => acc + student.streak, 0) / students.length)
                        : Math.round(filteredStudents.reduce((acc, student) => acc + student.streak, 0) / filteredStudents.length)} days
                    </h3>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Calendar className="text-orange-600" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <ArrowUpRight size={16} className="mr-1" />
                  <span>2 days longer than last month</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Achievements Earned</p>
                    <h3 className="text-3xl font-semibold mt-1">142</h3>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Sparkles className="text-purple-600" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <ArrowUpRight size={16} className="mr-1" />
                  <span>12 new achievements this week</span>
                </div>
              </div>
            </div>
            
            {/* Student Performance Table */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Performance</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activities Completed
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Streak
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map(student => {
                      const studentClass = classes.find(cls => cls.id === student.class_id);
                      return (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                                  {student.name.charAt(0)}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                <div className="text-sm text-gray-500">{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{studentClass?.name || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="mr-2 text-sm font-medium text-gray-900">{student.progress}%</div>
                              <div className="relative w-16 h-2 bg-gray-200 rounded">
                                <div 
                                  className="absolute top-0 left-0 h-2 bg-green-500 rounded"
                                  style={{ width: `${student.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.completed_activities}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                              {student.streak} days
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(student.last_active).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Class Comparison */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Class Comparison</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Students
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Average Progress
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {classes.map(cls => (
                      <tr key={cls.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {cls.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cls.students}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="mr-2 text-sm font-medium text-gray-900">{cls.average_progress}%</div>
                            <div className="relative w-16 h-2 bg-gray-200 rounded">
                              <div 
                                className="absolute top-0 left-0 h-2 bg-indigo-500 rounded"
                                style={{ width: `${cls.average_progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(cls.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 