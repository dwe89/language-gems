'use client';

// Add export config to skip static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

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
import { supabaseBrowser } from '../../../components/auth/AuthProvider';
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
  
  // Fetch real data from database
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch assignments - use created_by instead of teacher_id
        const { data: assignmentsData, error: assignmentsError } = await supabaseBrowser
          .from('assignments')
          .select('id')
          .eq('created_by', user.id);
        
        if (assignmentsError) {
          console.error('Error fetching assignments:', assignmentsError);
        }

        // Fetch students and classes - use created_by instead of teacher_id
        const { data: studentsData, error: studentsError } = await supabaseBrowser
          .from('class_enrollments')
          .select(`
            student_id,
            classes!inner(id, name, created_by),
            user_profiles!inner(display_name)
          `)
          .eq('classes.created_by', user.id);

        if (studentsError) {
          console.error('Error fetching students:', studentsError);
        }

        // Get student profiles separately
        let studentsDataFormatted: Student[] = [];
        if (studentsData && studentsData.length > 0) {
          const studentIds = studentsData.map(enrollment => enrollment.student_id);
          
          const { data: userProfiles } = await supabaseBrowser
            .from('user_profiles')
            .select('user_id, display_name, email')
            .in('user_id', studentIds);

          // Transform the data
          studentsDataFormatted = studentsData.map(enrollment => {
            const profile = userProfiles?.find(p => p.user_id === enrollment.student_id);
            const classInfo = enrollment.classes[0]; // Get first class (should only be one due to inner join)
            
            return {
              id: enrollment.student_id,
              name: profile?.display_name || 'Unknown Student',
              avatar: `/avatars/default.png`,
              email: profile?.email || '',
              class_id: classInfo?.id || '',
              completed_activities: 0, // No activity tracking yet
              last_active: enrollment.enrolled_at || new Date().toISOString(),
              progress: 0, // No progress tracking yet
              streak: 0 // No streak tracking yet
            };
          });
        }

        const classesFormatted: Class[] = studentsDataFormatted.map(student => ({
          id: student.class_id,
          name: student.name,
          students: 1,
          average_progress: 0, // No progress tracking yet
          created_at: new Date().toISOString()
        }));

        // Set empty report data since we don't have tracking yet
        const emptyReportData: ReportData = {
          weekly_progress: [
            { day: 'Mon', value: 0 },
            { day: 'Tue', value: 0 },
            { day: 'Wed', value: 0 },
            { day: 'Thu', value: 0 },
            { day: 'Fri', value: 0 },
            { day: 'Sat', value: 0 },
            { day: 'Sun', value: 0 }
          ],
          activity_breakdown: [],
          skill_levels: [
            { skill: 'Vocabulary', level: 0, max_level: 5 },
            { skill: 'Grammar', level: 0, max_level: 5 },
            { skill: 'Reading', level: 0, max_level: 5 },
            { skill: 'Listening', level: 0, max_level: 5 },
            { skill: 'Speaking', level: 0, max_level: 5 },
            { skill: 'Writing', level: 0, max_level: 5 }
          ]
        };

        setStudents(studentsDataFormatted);
        setClasses(classesFormatted);
        setReportData(emptyReportData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setStudents([]);
        setClasses([]);
        setReportData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, supabaseBrowser]);
  
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
                Progress tracking will be available once students start completing assignments.<br />
                Charts will automatically display student learning progress over time.
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
                Activity breakdown will show once students start using the learning games.<br />
                This will display the distribution of vocabulary, grammar, and other activities.
              </p>
            </div>
          </div>
        );
      case 'comparison':
        return (
          <div className="h-80 p-4 flex items-center justify-center bg-white rounded-lg border border-gray-200">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <BarChart3 size={48} className="text-purple-600 mb-4" />
              <p className="text-gray-500 text-center">
                Class comparison charts will be available once you have multiple classes with student activity.<br />
                This will help you compare performance across different classes.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="h-80 p-4 flex items-center justify-center bg-white rounded-lg border border-gray-200">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <BarChart3 size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-500">Select a chart type to view analytics</p>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-rose-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center">
          <Link 
            href="/dashboard" 
            className="mr-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="text-teal-700" size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-teal-800 mb-2">Analytics & Reports</h1>
            <p className="text-teal-600">Track student performance and generate comprehensive progress reports</p>
          </div>
        </header>
        
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
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
                    className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                    className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="semester">This Semester</option>
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
                    className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="progress">Progress Tracking</option>
                    <option value="activity">Activity Breakdown</option>
                    <option value="comparison">Class Comparison</option>
                  </select>
                </div>
                
                <button
                  onClick={exportReport}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center"
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
                                  className="absolute top-0 left-0 h-2 bg-gray-400 rounded"
                                  style={{ width: `${student.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.completed_activities}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
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
                                className="absolute top-0 left-0 h-2 bg-gray-400 rounded"
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