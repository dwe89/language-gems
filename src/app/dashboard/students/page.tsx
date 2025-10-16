'use client';

import { useState, useEffect } from 'react';
import { useAuth, supabaseBrowser } from '../../../components/auth/AuthProvider';
import Link from 'next/link';
import { Search, UserPlus, Filter, Mail, ArrowUpDown, BookOpen, UserCheck, UserX, Download, ArrowLeft } from 'lucide-react';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';

// Define types for our data
type Student = {
  id: string;
  name: string;
  username: string;
  email: string;
  class_name: string;
  last_active: string;
  overall_performance: number;
};

export default function StudentsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  const [filters, setFilters] = useState({
    class: 'all',
    activity: 'all' // all, active, inactive
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Student | '';
    direction: 'ascending' | 'descending';
  }>({
    key: '',
    direction: 'ascending'
  });

  // Extracted from student data for filter dropdowns
  const classes = [...new Set(students.map(student => student.class_name))];
  
  useEffect(() => {
    async function fetchStudents() {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch all students enrolled in teacher's classes
        const { data: enrollments, error: enrollmentError } = await supabaseBrowser
          .from('class_enrollments')
          .select(`
            student_id,
            enrolled_at,
            classes!inner(
              id,
              name,
              teacher_id
            )
          `)
          .eq('classes.teacher_id', user.id)
          .eq('status', 'active');

        if (enrollmentError) {
          console.error('Error fetching enrollments:', enrollmentError);
          setStudents([]);
          setFilteredStudents([]);
          return;
        }

        if (!enrollments || enrollments.length === 0) {
          setStudents([]);
          setFilteredStudents([]);
          return;
        }

        // Get unique student IDs
        const studentIds = [...new Set(enrollments.map(e => e.student_id))];

        // Fetch student profiles
        const { data: profiles, error: profileError } = await supabaseBrowser
          .from('user_profiles')
          .select('user_id, display_name, username, email')
          .in('user_id', studentIds);

        if (profileError) {
          console.error('Error fetching profiles:', profileError);
        }

        // Fetch last activity for each student
        const { data: lastActivities, error: activityError } = await supabaseBrowser
          .from('enhanced_game_sessions')
          .select('student_id, ended_at')
          .in('student_id', studentIds)
          .not('ended_at', 'is', null)
          .order('ended_at', { ascending: false });

        if (activityError) {
          console.error('Error fetching activities:', activityError);
        }

        // Create lookup maps
        const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));
        const activityMap = new Map<string, string>();

        // Get most recent activity per student
        (lastActivities || []).forEach(activity => {
          if (!activityMap.has(activity.student_id)) {
            activityMap.set(activity.student_id, activity.ended_at);
          }
        });

        // Create enrollment map (student_id -> class_name)
        const enrollmentMap = new Map<string, string>();
        enrollments.forEach(e => {
          if (!enrollmentMap.has(e.student_id)) {
            enrollmentMap.set(e.student_id, (e.classes as any).name);
          }
        });

        // Fetch total gems for each student
        const { data: gemsData } = await supabaseBrowser
          .from('student_consolidated_xp_analytics')
          .select('student_id, total_gems')
          .in('student_id', studentIds);

        const gemsMap = new Map();
        if (gemsData) {
          gemsData.forEach(analytics => {
            gemsMap.set(analytics.student_id, analytics.total_gems || 0);
          });
        }

        // Transform data to match Student interface
        const formattedStudents: Student[] = studentIds.map(studentId => {
          const profile = profileMap.get(studentId);
          const lastActive = activityMap.get(studentId);
          const className = enrollmentMap.get(studentId) || 'Unknown Class';
          const totalGems = gemsMap.get(studentId);

          return {
            id: studentId,
            name: profile?.display_name || 'Unknown',
            username: profile?.username || '',
            email: profile?.email || '',
            class_name: className,
            last_active: lastActive || new Date().toISOString(),
            overall_performance: totalGems || 0
          };
        });

        setStudents(formattedStudents);
        setFilteredStudents(formattedStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, [user]);
  
  // Apply filters and search
  useEffect(() => {
    let results = [...students];

    // Apply search term
    if (searchTerm) {
      results = results.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.class !== 'all') {
      results = results.filter(student => student.class_name === filters.class);
    }

    if (filters.activity !== 'all') {
      const now = new Date();
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      if (filters.activity === 'active') {
        results = results.filter(student => new Date(student.last_active) >= twoWeeksAgo);
      } else if (filters.activity === 'inactive') {
        results = results.filter(student => new Date(student.last_active) < twoWeeksAgo);
      }
    }
    
    // Apply sorting
    if (sortConfig.key !== '') {
      results.sort((a, b) => {
        const key = sortConfig.key as keyof Student;
        
        // For numeric values
        if (typeof a[key] === 'number') {
          return sortConfig.direction === 'ascending' 
            ? (a[key] as number) - (b[key] as number)
            : (b[key] as number) - (a[key] as number);
        }
        
        // For dates
        if (key === 'last_active') {
          const dateA = new Date(a[key] as string).getTime();
          const dateB = new Date(b[key] as string).getTime();
          return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
        }
        
        // For strings
        if (typeof a[key] === 'string') {
          const valueA = (a[key] as string).toLowerCase();
          const valueB = (b[key] as string).toLowerCase();
          if (valueA < valueB) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (valueA > valueB) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        }
        
        return 0;
      });
    }
    
    setFilteredStudents(results);
  }, [searchTerm, filters, students, sortConfig]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const toggleFilters = () => {
    setFilterActive(!filterActive);
  };
  
  const resetFilters = () => {
    setFilters({
      class: 'all',
      activity: 'all'
    });
    setSearchTerm('');
    setSortConfig({ key: '', direction: 'ascending' });
  };
  
  const handleSort = (key: keyof Student) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };
  
  const renderSortArrow = (key: keyof Student) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    
    return sortConfig.direction === 'ascending' 
      ? <ArrowUpDown className="h-4 w-4 ml-1 text-cyan-400" /> 
      : <ArrowUpDown className="h-4 w-4 ml-1 text-cyan-400 transform rotate-180" />;
  };
  
  const getActivityStatus = (lastActiveDate: string) => {
    const now = new Date();
    const lastActive = new Date(lastActiveDate);
    const diffInDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 2) return { status: 'Active', color: 'text-green-400' };
    if (diffInDays < 7) return { status: 'Recent', color: 'text-teal-400' };
    if (diffInDays < 14) return { status: 'Away', color: 'text-yellow-400' };
    return { status: 'Inactive', color: 'text-red-400' };
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Students</h1>
          <p className="text-gray-600 mt-2">View and search all students across all your classes</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students by name, username, or email..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={toggleFilters}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
              >
                <Filter className="h-5 w-5 mr-2" />
                {filterActive ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>

          {filterActive && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="class-filter" className="text-gray-700 text-sm mb-1 block font-medium">Class</label>
                <select
                  id="class-filter"
                  value={filters.class}
                  onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Classes</option>
                  {classes.map((className, index) => (
                    <option key={index} value={className}>{className}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="activity-filter" className="text-gray-700 text-sm mb-1 block font-medium">Activity</label>
                <select
                  id="activity-filter"
                  value={filters.activity}
                  onChange={(e) => setFilters({ ...filters, activity: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Students</option>
                  <option value="active">Active (Last 2 weeks)</option>
                  <option value="inactive">Inactive ({'>'}2 weeks)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Students List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Student List</h2>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">{filteredStudents.length} students</span>
              <button
                className="flex items-center px-3 py-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm transition-colors"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-700 font-medium">
                      <button
                        className="flex items-center focus:outline-none"
                        onClick={() => handleSort('name')}
                      >
                        Name
                        {renderSortArrow('name')}
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 font-medium hidden md:table-cell">
                      <button
                        className="flex items-center focus:outline-none hover:text-gray-900"
                        onClick={() => handleSort('username')}
                      >
                        Username
                        {renderSortArrow('username')}
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 font-medium hidden lg:table-cell">
                      <button
                        className="flex items-center focus:outline-none hover:text-gray-900"
                        onClick={() => handleSort('class_name')}
                      >
                        Class
                        {renderSortArrow('class_name')}
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 font-medium hidden xl:table-cell">
                      <button
                        className="flex items-center focus:outline-none hover:text-gray-900"
                        onClick={() => handleSort('last_active')}
                      >
                        Last Login
                        {renderSortArrow('last_active')}
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 font-medium hidden md:table-cell">
                      <button
                        className="flex items-center focus:outline-none hover:text-gray-900"
                        onClick={() => handleSort('overall_performance')}
                      >
                        Performance
                        {renderSortArrow('overall_performance')}
                      </button>
                    </th>
                    <th className="text-right py-3 px-4 text-gray-700 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => {
                    const activityStatus = getActivityStatus(student.last_active);

                    return (
                      <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 flex-shrink-0 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium">{student.name.charAt(0)}</span>
                            </div>
                            <div className="ml-3">
                              <div className="text-gray-900 font-medium">{student.name}</div>
                              <div className="text-gray-500 text-sm flex items-center md:hidden">
                                @{student.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          <div className="text-gray-700 text-sm">@{student.username}</div>
                        </td>
                        <td className="py-4 px-4 hidden lg:table-cell">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {student.class_name}
                          </span>
                        </td>
                        <td className="py-4 px-4 hidden xl:table-cell">
                          <div className={`text-sm font-medium ${activityStatus.color}`}>
                            {activityStatus.status}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {formatDate(student.last_active)}
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2 max-w-[100px]">
                              <div
                                className={`h-2 rounded-full ${
                                  student.overall_performance >= 75
                                    ? 'bg-green-500'
                                    : student.overall_performance >= 50
                                    ? 'bg-blue-500'
                                    : student.overall_performance >= 25
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${student.overall_performance}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-700 text-sm font-medium">{student.overall_performance}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/progress/student/${student.id}`}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Performance"
                            >
                              <BookOpen className="h-5 w-5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}