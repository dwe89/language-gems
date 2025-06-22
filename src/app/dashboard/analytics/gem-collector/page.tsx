'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import GemCollectorAnalytics from '../../../../components/analytics/GemCollectorAnalytics';
import { Calendar, Filter, Download, RefreshCw } from 'lucide-react';

export default function GemCollectorAnalyticsPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    classId: '',
    assignmentId: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const supabase = supabaseBrowser;

      // Fetch teacher's classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id, name, description')
        .eq('teacher_id', user?.id)
        .order('name');

      if (classesError) {
        console.error('Error fetching classes:', classesError);
      } else {
        setClasses(classesData || []);
      }

      // Fetch gem collector assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select(`
          id,
          title,
          description,
          class_id,
          created_at,
          due_date,
          classes (
            name
          )
        `)
        .eq('created_by', user?.id)
        .eq('type', 'gem-collector')
        .order('created_at', { ascending: false });

      if (assignmentsError) {
        console.error('Error fetching assignments:', assignmentsError);
      } else {
        setAssignments(assignmentsData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset assignment filter when class changes
      ...(key === 'classId' ? { assignmentId: '' } : {})
    }));
  };

  const getFilteredAssignments = () => {
    if (!filters.classId) return assignments;
    return assignments.filter(assignment => assignment.class_id === filters.classId);
  };

  const exportData = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.classId) params.append('classId', filters.classId);
      if (filters.assignmentId) params.append('assignmentId', filters.assignmentId);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      params.append('format', 'csv');

      const response = await fetch(`/api/analytics/gem-collector/export?${params}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gem-collector-analytics-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gem Collector Analytics
          </h1>
          <p className="text-gray-600">
            Track student performance and engagement in the Gem Collector sentence translation game
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={fetchData}
                className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </button>
              <button
                onClick={exportData}
                className="flex items-center px-3 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Class Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                value={filters.classId}
                onChange={(e) => handleFilterChange('classId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment
              </label>
              <select
                value={filters.assignmentId}
                onChange={(e) => handleFilterChange('assignmentId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Assignments</option>
                {getFilteredAssignments().map(assignment => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Analytics Component */}
        <GemCollectorAnalytics
          classId={filters.classId || undefined}
          assignmentId={filters.assignmentId || undefined}
          dateRange={
            filters.dateFrom && filters.dateTo
              ? { from: filters.dateFrom, to: filters.dateTo }
              : undefined
          }
        />

        {/* Quick Stats */}
        {assignments.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Assignment Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">{assignments.length}</p>
                <p className="text-sm text-gray-600">Total Assignments</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{classes.length}</p>
                <p className="text-sm text-gray-600">Classes with Gem Collector</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {assignments.filter(a => new Date(a.due_date) > new Date()).length}
                </p>
                <p className="text-sm text-gray-600">Active Assignments</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
