'use client';

import { useState, useEffect } from 'react';
import { useAuth, supabaseBrowser } from '../../../components/auth/AuthProvider';
import Link from 'next/link';
import { Search, UserPlus, Filter, Mail, ArrowUpDown, BookOpen, UserCheck, UserX, Download } from 'lucide-react';

// Define types for our data
type Student = {
  id: string;
  name: string;
  email: string;
  joined_date: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  last_active: string;
  completed_lists: number;
  total_lists: number;
  classes: string[];
};

export default function StudentsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  const [filters, setFilters] = useState({
    level: 'all',
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
  const classes = [...new Set(students.flatMap(student => student.classes))];
  
  useEffect(() => {
    async function fetchStudents() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch real students data from Supabase
        const { data: teacherStudents, error } = await supabaseBrowser
          .rpc('get_teacher_students', { teacher_user_id: user.id });
        
        if (error) {
          console.error('Error fetching students:', error);
          setStudents([]);
          setFilteredStudents([]);
          return;
        }
        
        // Transform data to match Student interface
        const formattedStudents: Student[] = (teacherStudents || []).map((student: any) => ({
          id: student.user_id,
          name: student.display_name,
          email: student.email,
          joined_date: student.enrolled_at,
          level: 'beginner', // TODO: Get real level from user preferences
          progress: 0, // TODO: Calculate real progress from completed assignments
          last_active: student.enrolled_at, // TODO: Get real last active from user activity
          completed_lists: 0, // TODO: Get real count from assignment completion
          total_lists: 0, // TODO: Get real count from assigned vocabulary lists
          classes: [student.class_name]
        }));
        
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
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply filters
    if (filters.level !== 'all') {
      results = results.filter(student => student.level === filters.level);
    }
    
    if (filters.class !== 'all') {
      results = results.filter(student => student.classes.includes(filters.class));
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
        if (key === 'joined_date' || key === 'last_active') {
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
      level: 'all',
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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Students</h1>
        <p className="text-gray-300">Manage and track progress of your students across all classes</p>
      </div>
      
      {/* Search and Filter */}
      <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search students by name or email..."
              className="block w-full pl-10 pr-3 py-2 border border-indigo-700 rounded-md bg-indigo-800/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={toggleFilters}
              className="flex items-center px-4 py-2 bg-indigo-800/40 hover:bg-indigo-700/60 text-white rounded-md"
            >
              <Filter className="h-5 w-5 mr-2" />
              {filterActive ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <Link
              href="/dashboard/students/invite"
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add Student
            </Link>
          </div>
        </div>
        
        {filterActive && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="level-filter" className="text-gray-300 text-sm mb-1 block">Level</label>
              <select
                id="level-filter"
                value={filters.level}
                onChange={(e) => setFilters({...filters, level: e.target.value})}
                className="block w-full px-3 py-2 border border-indigo-700 rounded-md bg-indigo-800/40 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="class-filter" className="text-gray-300 text-sm mb-1 block">Class</label>
              <select
                id="class-filter"
                value={filters.class}
                onChange={(e) => setFilters({...filters, class: e.target.value})}
                className="block w-full px-3 py-2 border border-indigo-700 rounded-md bg-indigo-800/40 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Classes</option>
                {classes.map((className, index) => (
                  <option key={index} value={className}>{className}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="activity-filter" className="text-gray-300 text-sm mb-1 block">Activity</label>
              <select
                id="activity-filter"
                value={filters.activity}
                onChange={(e) => setFilters({...filters, activity: e.target.value})}
                className="block w-full px-3 py-2 border border-indigo-700 rounded-md bg-indigo-800/40 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Students</option>
                <option value="active">Active (Last 2 weeks)</option>
                <option value="inactive">Inactive ({'>'}2 weeks)</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-gray-300 hover:text-white bg-indigo-800/40 hover:bg-indigo-700/60 rounded-md"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Students List */}
      <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Student List</h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-sm">{filteredStudents.length} students</span>
            <button
              className="flex items-center px-3 py-1 bg-indigo-800/40 hover:bg-indigo-700/60 text-white rounded-md text-sm"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
        </div>
        
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-2">No students found</h3>
            <p className="text-gray-300">Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-indigo-800">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('name')}
                    >
                      Student
                      {renderSortArrow('name')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium hidden lg:table-cell">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('level')}
                    >
                      Level
                      {renderSortArrow('level')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium hidden md:table-cell">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('progress')}
                    >
                      Progress
                      {renderSortArrow('progress')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium hidden xl:table-cell">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('last_active')}
                    >
                      Last Active
                      {renderSortArrow('last_active')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium hidden lg:table-cell">Classes</th>
                  <th className="text-right py-3 px-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-800/50">
                {filteredStudents.map(student => {
                  const activityStatus = getActivityStatus(student.last_active);
                  
                  return (
                    <tr key={student.id} className="hover:bg-indigo-800/20">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 flex-shrink-0 bg-indigo-700 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">{student.name.charAt(0)}</span>
                          </div>
                          <div className="ml-3">
                            <div className="text-white font-medium">{student.name}</div>
                            <div className="text-gray-400 text-sm flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          student.level === 'beginner' ? 'bg-green-900/40 text-green-300' :
                          student.level === 'intermediate' ? 'bg-yellow-900/40 text-yellow-300' :
                          'bg-red-900/40 text-red-300'
                        }`}>
                          {student.level.charAt(0).toUpperCase() + student.level.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <div className="flex items-center">
                          <div className="w-full bg-indigo-950/50 rounded-full h-2 mr-2 max-w-[100px]">
                            <div 
                              className={`h-2 rounded-full ${
                                student.progress >= 75 ? 'bg-green-500' :
                                student.progress >= 50 ? 'bg-cyan-500' :
                                student.progress >= 25 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-white text-sm">{student.progress}%</span>
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          {student.completed_lists}/{student.total_lists} lists
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden xl:table-cell">
                        <div className={`text-sm ${activityStatus.color}`}>
                          {activityStatus.status}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {formatDate(student.last_active)}
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {student.classes.map((className, index) => (
                            <span 
                              key={index}
                              className="inline-block px-2 py-1 bg-indigo-900/50 text-indigo-300 rounded text-xs"
                            >
                              {className}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/students/${student.id}/performance`}
                            className="p-1 text-cyan-400 hover:text-cyan-300 rounded"
                            title="View Performance"
                          >
                            <BookOpen className="h-5 w-5" />
                          </Link>
                          <Link
                            href={`/dashboard/students/${student.id}/message`}
                            className="p-1 text-cyan-400 hover:text-cyan-300 rounded"
                            title="Message Student"
                          >
                            <Mail className="h-5 w-5" />
                          </Link>
                          <button
                            className="p-1 text-red-400 hover:text-red-300 rounded"
                            title="Remove Student"
                          >
                            <UserX className="h-5 w-5" />
                          </button>
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
  );
} 