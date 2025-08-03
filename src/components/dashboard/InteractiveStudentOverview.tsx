'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, Download, ChevronDown, ChevronUp,
  TrendingUp, TrendingDown, Minus, Eye, BarChart3, Clock,
  Star, Award, AlertTriangle, CheckCircle, Calendar,
  BookOpen, Target, Zap, Brain, MessageSquare
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

export interface StudentPerformanceData {
  id: string;
  name: string;
  email: string;
  class_id: string;
  class_name: string;
  enrolled_at: string;
  last_active: string;
  
  // Overall metrics
  overall_progress: number;
  assignments_completed: number;
  assignments_total: number;
  average_score: number;
  average_accuracy: number;
  total_time_spent: number; // minutes
  
  // Skill breakdown
  vocabulary_mastery: number;
  grammar_mastery: number;
  listening_mastery: number;
  speaking_mastery: number;
  
  // Engagement metrics
  current_streak: number;
  longest_streak: number;
  login_frequency: number; // days per week
  session_duration_avg: number; // minutes
  
  // Learning analytics
  words_learned: number;
  words_mastered: number;
  improvement_rate: number; // percentage change
  difficulty_preference: 'easy' | 'medium' | 'hard';
  
  // Risk indicators
  at_risk: boolean;
  risk_factors: string[];
  last_struggle_area: string;
  
  // Gamification
  total_xp: number;
  current_level: number;
  achievements_count: number;
  leaderboard_position: number;
}

interface FilterOptions {
  class_id: string;
  language: string;
  time_period: string;
  performance_level: string;
  at_risk_only: boolean;
  sort_by: string;
  sort_direction: 'asc' | 'desc';
}

interface ColumnConfig {
  key: string;
  label: string;
  sortable: boolean;
  width: string;
  render?: (value: any, student: StudentPerformanceData) => React.ReactNode;
}

// =====================================================
// INTERACTIVE STUDENT OVERVIEW COMPONENT
// =====================================================

export default function InteractiveStudentOverview() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  // State management
  const [students, setStudents] = useState<StudentPerformanceData[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentPerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentPerformanceData | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    class_id: 'all',
    language: 'all',
    time_period: '30_days',
    performance_level: 'all',
    at_risk_only: false,
    sort_by: 'name',
    sort_direction: 'asc'
  });

  // Column configuration
  const columns: ColumnConfig[] = [
    {
      key: 'name',
      label: 'Student',
      sortable: true,
      width: 'w-48',
      render: (value, student) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {student.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{student.name}</div>
            <div className="text-sm text-gray-500">{student.class_name}</div>
          </div>
        </div>
      )
    },
    {
      key: 'overall_progress',
      label: 'Progress',
      sortable: true,
      width: 'w-32',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{value}%</span>
        </div>
      )
    },
    {
      key: 'average_score',
      label: 'Avg Score',
      sortable: true,
      width: 'w-24',
      render: (value) => (
        <div className={`text-center font-semibold ${
          value >= 80 ? 'text-green-600' : 
          value >= 60 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {value}%
        </div>
      )
    },
    {
      key: 'assignments_completed',
      label: 'Assignments',
      sortable: true,
      width: 'w-28',
      render: (value, student) => (
        <div className="text-center">
          <div className="font-semibold">{value}/{student.assignments_total}</div>
          <div className="text-xs text-gray-500">
            {Math.round((value / student.assignments_total) * 100)}% complete
          </div>
        </div>
      )
    },
    {
      key: 'current_streak',
      label: 'Streak',
      sortable: true,
      width: 'w-20',
      render: (value) => (
        <div className="flex items-center justify-center space-x-1">
          <Zap className={`h-4 w-4 ${value > 0 ? 'text-yellow-500' : 'text-gray-400'}`} />
          <span className="font-semibold">{value}</span>
        </div>
      )
    },
    {
      key: 'at_risk',
      label: 'Status',
      sortable: true,
      width: 'w-24',
      render: (value, student) => (
        <div className="flex justify-center">
          {value ? (
            <div className="flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
              <AlertTriangle className="h-3 w-3" />
              <span>At Risk</span>
            </div>
          ) : student.average_score >= 80 ? (
            <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              <CheckCircle className="h-3 w-3" />
              <span>Excellent</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              <Minus className="h-3 w-3" />
              <span>Good</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'last_active',
      label: 'Last Active',
      sortable: true,
      width: 'w-32',
      render: (value) => (
        <div className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    }
  ];

  // Load data on component mount
  useEffect(() => {
    if (user) {
      loadStudentData();
    }
  }, [user]);

  // Apply filters and search
  useEffect(() => {
    applyFiltersAndSearch();
  }, [students, searchQuery, filters]);

  // =====================================================
  // DATA LOADING FUNCTIONS
  // =====================================================

  const loadStudentData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockStudents: StudentPerformanceData[] = [
        {
          id: '1',
          name: 'Emma Thompson',
          email: 'emma.t@school.com',
          class_id: 'class-1',
          class_name: 'Year 7 French',
          enrolled_at: '2024-01-15T10:00:00Z',
          last_active: '2024-08-02T14:30:00Z',
          overall_progress: 85,
          assignments_completed: 12,
          assignments_total: 15,
          average_score: 88,
          average_accuracy: 92,
          total_time_spent: 240,
          vocabulary_mastery: 90,
          grammar_mastery: 85,
          listening_mastery: 80,
          speaking_mastery: 88,
          current_streak: 7,
          longest_streak: 12,
          login_frequency: 5,
          session_duration_avg: 25,
          words_learned: 156,
          words_mastered: 142,
          improvement_rate: 15.2,
          difficulty_preference: 'medium',
          at_risk: false,
          risk_factors: [],
          last_struggle_area: '',
          total_xp: 2450,
          current_level: 8,
          achievements_count: 15,
          leaderboard_position: 3
        },
        {
          id: '2',
          name: 'James Wilson',
          email: 'james.w@school.com',
          class_id: 'class-1',
          class_name: 'Year 7 French',
          enrolled_at: '2024-01-20T09:00:00Z',
          last_active: '2024-07-30T16:45:00Z',
          overall_progress: 45,
          assignments_completed: 6,
          assignments_total: 15,
          average_score: 52,
          average_accuracy: 68,
          total_time_spent: 120,
          vocabulary_mastery: 55,
          grammar_mastery: 40,
          listening_mastery: 48,
          speaking_mastery: 45,
          current_streak: 0,
          longest_streak: 3,
          login_frequency: 2,
          session_duration_avg: 15,
          words_learned: 78,
          words_mastered: 45,
          improvement_rate: -5.8,
          difficulty_preference: 'easy',
          at_risk: true,
          risk_factors: ['Low completion rate', 'Infrequent logins', 'Declining performance'],
          last_struggle_area: 'Past tense verbs',
          total_xp: 890,
          current_level: 3,
          achievements_count: 4,
          leaderboard_position: 18
        },
        {
          id: '3',
          name: 'Sophia Miller',
          email: 'sophia.m@school.com',
          class_id: 'class-2',
          class_name: 'Year 8 Spanish',
          enrolled_at: '2024-01-28T14:45:00Z',
          last_active: '2024-08-01T11:20:00Z',
          overall_progress: 72,
          assignments_completed: 10,
          assignments_total: 14,
          average_score: 76,
          average_accuracy: 82,
          total_time_spent: 180,
          vocabulary_mastery: 78,
          grammar_mastery: 70,
          listening_mastery: 75,
          speaking_mastery: 72,
          current_streak: 4,
          longest_streak: 8,
          login_frequency: 4,
          session_duration_avg: 22,
          words_learned: 124,
          words_mastered: 98,
          improvement_rate: 8.5,
          difficulty_preference: 'medium',
          at_risk: false,
          risk_factors: [],
          last_struggle_area: '',
          total_xp: 1850,
          current_level: 6,
          achievements_count: 11,
          leaderboard_position: 7
        }
      ];

      setStudents(mockStudents);
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...students];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.class_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply class filter
    if (filters.class_id !== 'all') {
      filtered = filtered.filter(student => student.class_id === filters.class_id);
    }

    // Apply performance level filter
    if (filters.performance_level !== 'all') {
      filtered = filtered.filter(student => {
        switch (filters.performance_level) {
          case 'excellent': return student.average_score >= 80;
          case 'good': return student.average_score >= 60 && student.average_score < 80;
          case 'needs_improvement': return student.average_score < 60;
          default: return true;
        }
      });
    }

    // Apply at-risk filter
    if (filters.at_risk_only) {
      filtered = filtered.filter(student => student.at_risk);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[filters.sort_by as keyof StudentPerformanceData];
      const bValue = b[filters.sort_by as keyof StudentPerformanceData];
      
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      }
      
      return filters.sort_direction === 'desc' ? -comparison : comparison;
    });

    setFilteredStudents(filtered);
  };

  // =====================================================
  // EVENT HANDLERS
  // =====================================================

  const handleSort = (columnKey: string) => {
    setFilters(prev => ({
      ...prev,
      sort_by: columnKey,
      sort_direction: prev.sort_by === columnKey && prev.sort_direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleRowExpansion = (studentId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(studentId)) {
      newExpanded.delete(studentId);
    } else {
      newExpanded.add(studentId);
    }
    setExpandedRows(newExpanded);
  };

  const handleExportData = () => {
    // Implement CSV export functionality
    console.log('Exporting student data...');
  };

  // =====================================================
  // RENDER FUNCTIONS
  // =====================================================

  const renderTableHeader = () => (
    <thead className="bg-gray-50">
      <tr>
        <th className="w-8 px-6 py-3"></th>
        {columns.map((column) => (
          <th
            key={column.key}
            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.width} ${
              column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
            }`}
            onClick={() => column.sortable && handleSort(column.key)}
          >
            <div className="flex items-center space-x-1">
              <span>{column.label}</span>
              {column.sortable && filters.sort_by === column.key && (
                filters.sort_direction === 'asc' ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </th>
        ))}
        <th className="w-20 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  );

  const renderStudentRow = (student: StudentPerformanceData) => {
    const isExpanded = expandedRows.has(student.id);
    
    return (
      <React.Fragment key={student.id}>
        <motion.tr
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white hover:bg-gray-50 transition-colors"
        >
          <td className="px-6 py-4">
            <button
              onClick={() => toggleRowExpansion(student.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </td>
          
          {columns.map((column) => (
            <td key={column.key} className={`px-6 py-4 whitespace-nowrap ${column.width}`}>
              {column.render ? 
                column.render(student[column.key as keyof StudentPerformanceData], student) :
                student[column.key as keyof StudentPerformanceData]
              }
            </td>
          ))}
          
          <td className="px-6 py-4 whitespace-nowrap text-center">
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setSelectedStudent(student)}
                className="text-blue-600 hover:text-blue-800"
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                className="text-green-600 hover:text-green-800"
                title="Send Message"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
            </div>
          </td>
        </motion.tr>

        {/* Expanded Row Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.tr
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50"
            >
              <td colSpan={columns.length + 2} className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Skill Breakdown */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Skill Mastery</h4>
                    <div className="space-y-2">
                      {[
                        { label: 'Vocabulary', value: student.vocabulary_mastery },
                        { label: 'Grammar', value: student.grammar_mastery },
                        { label: 'Listening', value: student.listening_mastery },
                        { label: 'Speaking', value: student.speaking_mastery }
                      ].map((skill) => (
                        <div key={skill.label} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{skill.label}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${skill.value}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-8">{skill.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learning Analytics */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Learning Analytics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Words Learned:</span>
                        <span className="font-medium">{student.words_learned}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Words Mastered:</span>
                        <span className="font-medium">{student.words_mastered}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Improvement Rate:</span>
                        <span className={`font-medium flex items-center space-x-1 ${
                          student.improvement_rate > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {student.improvement_rate > 0 ? 
                            <TrendingUp className="h-3 w-3" /> : 
                            <TrendingDown className="h-3 w-3" />
                          }
                          <span>{Math.abs(student.improvement_rate)}%</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Time:</span>
                        <span className="font-medium">{student.total_time_spent} min</span>
                      </div>
                    </div>
                  </div>

                  {/* Gamification & Engagement */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Engagement</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Level:</span>
                        <span className="font-medium">{student.current_level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total XP:</span>
                        <span className="font-medium">{student.total_xp.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Achievements:</span>
                        <span className="font-medium">{student.achievements_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Leaderboard:</span>
                        <span className="font-medium">#{student.leaderboard_position}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                {student.at_risk && student.risk_factors.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-semibold text-red-800 mb-2">Risk Factors:</h5>
                    <div className="flex flex-wrap gap-2">
                      {student.risk_factors.map((factor, index) => (
                        <span key={index} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </td>
            </motion.tr>
          )}
        </AnimatePresence>
      </React.Fragment>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Student Performance Overview</h2>
            <p className="text-gray-600">Interactive analysis and mastery tracking</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name, email, or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    value={filters.class_id}
                    onChange={(e) => setFilters(prev => ({ ...prev, class_id: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Classes</option>
                    <option value="class-1">Year 7 French</option>
                    <option value="class-2">Year 8 Spanish</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Performance Level</label>
                  <select
                    value={filters.performance_level}
                    onChange={(e) => setFilters(prev => ({ ...prev, performance_level: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Levels</option>
                    <option value="excellent">Excellent (80%+)</option>
                    <option value="good">Good (60-79%)</option>
                    <option value="needs_improvement">Needs Improvement (&lt;60%)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                  <select
                    value={filters.time_period}
                    onChange={(e) => setFilters(prev => ({ ...prev, time_period: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="7_days">Last 7 days</option>
                    <option value="30_days">Last 30 days</option>
                    <option value="90_days">Last 90 days</option>
                    <option value="all_time">All time</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.at_risk_only}
                      onChange={(e) => setFilters(prev => ({ ...prev, at_risk_only: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">At-risk students only</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Student Performance Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {renderTableHeader()}
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map(renderStudentRow)}
            </tbody>
          </table>
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
