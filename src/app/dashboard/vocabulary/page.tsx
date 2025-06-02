'use client';

// Skip static generation for this page
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useSupabase } from '../../../components/supabase/SupabaseProvider';
import Link from 'next/link';
import { 
  PlusCircle, Search, Filter, Edit, Trash2, 
  Download, Upload, BookOpen, Users, Clock,
  ChevronDown, Eye, BarChart2, ListFilter
} from 'lucide-react';

// Define types for our data
type WordList = {
  id: string;
  name: string;
  description: string;
  word_count: number;
  created_by: string;
  is_assigned: boolean;
  assigned_date?: string;
  due_date?: string;
  progress?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
};

export default function TeacherVocabularyDashboard() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [vocabularyLists, setVocabularyLists] = useState<WordList[]>([]);
  const [filteredLists, setFilteredLists] = useState<WordList[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [themes, setThemes] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalLists: 0,
    totalAssignments: 0,
    totalItems: 0,
    themeBreakdown: []
  });

  // Fetch vocabulary lists
  useEffect(() => {
    if (!user) return;

    const fetchVocabularyData = async () => {
      setLoading(true);
      
      try {
        // Fetch vocabulary lists
        const { data: listsData, error: listsError } = await supabase
          .from('vocabulary_lists')
          .select('*, vocabulary_items(id)');
        
        if (listsError) {
          console.error('Error fetching vocabulary lists:', listsError);
          return;
        }
        
        // Fetch assignments
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('class_vocabulary_assignments')
          .select(`
            *,
            classes(id, name),
            vocabulary_lists(id, name)
          `)
          .eq('teacher_id', user.id);
        
        if (assignmentsError) {
          console.error('Error fetching vocabulary assignments:', assignmentsError);
        }
        
        // Process lists data
        const processedLists = listsData.map(list => ({
          id: list.id,
          name: list.name,
          description: list.description,
          themeId: list.theme_id,
          topicId: list.topic_id,
          difficulty: list.difficulty,
          itemCount: list.vocabulary_items ? list.vocabulary_items.length : 0,
          createdAt: list.created_at,
          updatedAt: list.updated_at
        }));
        
        setVocabularyLists(processedLists);
        setFilteredLists(processedLists);
        
        // Process assignments data
        setAssignments(assignmentsData || []);
        
        // Extract unique themes
        const uniqueThemes = [...new Set(processedLists.map(list => list.themeId))];
        setThemes(uniqueThemes);
        
        // Calculate stats
        const totalLists = processedLists.length;
        const totalAssignments = assignmentsData ? assignmentsData.length : 0;
        const totalItems = processedLists.reduce((sum, list) => sum + list.itemCount, 0);
        
        // Theme breakdown
        const themeBreakdown = uniqueThemes.map(theme => {
          const listsInTheme = processedLists.filter(list => list.themeId === theme);
          const itemsInTheme = listsInTheme.reduce((sum, list) => sum + list.itemCount, 0);
          
          return {
            theme,
            listCount: listsInTheme.length,
            itemCount: itemsInTheme
          };
        });
        
        setStats({
          totalLists,
          totalAssignments,
          totalItems,
          themeBreakdown
        });
      } catch (error) {
        console.error('Error in vocabulary data processing:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVocabularyData();
  }, [user, supabase]);
  
  // Apply filters
  useEffect(() => {
    if (!vocabularyLists.length) return;
    
    let filtered = [...vocabularyLists];
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(list => 
        list.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (list.description && list.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply theme filter
    if (selectedTheme !== 'all') {
      filtered = filtered.filter(list => list.themeId === selectedTheme);
    }
    
    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      const diffLevel = parseInt(selectedDifficulty);
      filtered = filtered.filter(list => list.difficulty === diffLevel);
    }
    
    setFilteredLists(filtered);
  }, [vocabularyLists, searchTerm, selectedTheme, selectedDifficulty]);
  
  // Handle list deletion
  const handleDeleteList = async (listId) => {
    if (window.confirm('Are you sure you want to delete this vocabulary list? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('vocabulary_lists')
          .delete()
          .eq('id', listId);
        
        if (error) {
          console.error('Error deleting vocabulary list:', error);
          return;
        }
        
        // Update state
        setVocabularyLists(prev => prev.filter(list => list.id !== listId));
      } catch (error) {
        console.error('Error deleting vocabulary list:', error);
      }
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vocabulary Management</h1>
        
        <Link 
          href="/dashboard/vocabulary/create" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Create New List
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-4 shadow-md">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm font-medium opacity-80">Total Lists</p>
              <p className="text-2xl font-bold">{stats.totalLists}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-4 shadow-md">
          <div className="flex items-center">
            <Users className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm font-medium opacity-80">Class Assignments</p>
              <p className="text-2xl font-bold">{stats.totalAssignments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg p-4 shadow-md">
          <div className="flex items-center">
            <Clock className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm font-medium opacity-80">Total Vocabulary Items</p>
              <p className="text-2xl font-bold">{stats.totalItems}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link 
          href="/dashboard/vocabulary/import" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Upload className="mr-2 h-5 w-5" /> Import List
        </Link>
        
        <Link 
          href="/dashboard/vocabulary/export" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Download className="mr-2 h-5 w-5" /> Export List
        </Link>
        
        <Link 
          href="/dashboard/vocabulary/analytics" 
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <BarChart2 className="mr-2 h-5 w-5" /> View Analytics
        </Link>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
              placeholder="Search lists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
            <select
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
            >
              <option value="all">All Themes</option>
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <ListFilter className="w-5 h-5 text-gray-400" />
            </div>
            <select
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="1">Beginner (1)</option>
              <option value="2">Elementary (2)</option>
              <option value="3">Intermediate (3)</option>
              <option value="4">Advanced (4)</option>
              <option value="5">Expert (5)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Vocabulary Lists Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  List Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Theme
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLists.length > 0 ? (
                filteredLists.map((list) => (
                  <tr key={list.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {list.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {list.themeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        list.difficulty <= 2 ? 'bg-green-100 text-green-800' :
                        list.difficulty === 3 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {list.difficulty === 1 ? 'Beginner' :
                         list.difficulty === 2 ? 'Elementary' :
                         list.difficulty === 3 ? 'Intermediate' :
                         list.difficulty === 4 ? 'Advanced' : 'Expert'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {list.itemCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(list.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          href={`/dashboard/vocabulary/view/${list.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/dashboard/vocabulary/edit/${list.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteList(list.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm || selectedTheme !== 'all' || selectedDifficulty !== 'all' ? (
                      <p>No vocabulary lists match your search filters.</p>
                    ) : (
                      <p>No vocabulary lists found. Create your first list to get started!</p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent Assignments */}
      <h2 className="text-2xl font-bold mt-12 mb-6">Recent Assignments</h2>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  List Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.length > 0 ? (
                assignments.slice(0, 5).map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {assignment.vocabulary_lists?.name || 'Unknown List'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.classes?.name || 'Unknown Class'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.due_date ? formatDate(assignment.due_date) : 'No due date'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          href={`/dashboard/assignments/view/${assignment.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Progress
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    <p>No vocabulary assignments found. Assign vocabulary lists to your classes to get started!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {assignments.length > 5 && (
          <div className="px-6 py-3 bg-gray-50 text-right">
            <Link href="/dashboard/assignments" className="text-indigo-600 hover:text-indigo-900 font-medium">
              View All Assignments
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 