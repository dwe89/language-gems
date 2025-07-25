'use client';

// Skip static generation for this page
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useSupabase } from '../../../components/supabase/SupabaseProvider';
import Link from 'next/link';
import {
  Plus, PlusCircle, Search, Filter, Edit, Trash2,
  Download, Upload, BookOpen, Users, Clock, Save, X,
  ChevronDown, Eye, BarChart2, ListFilter, Calendar,
  Globe, Lock, ArrowRight, MessageSquare, FileText,
  Sparkles, Template, Copy, Star
} from 'lucide-react';
import { EnhancedVocabularyService, EnhancedVocabularyList } from '../../../services/enhancedVocabularyService';
import EnhancedVocabularyCreator from '../../../components/vocabulary/EnhancedVocabularyCreator';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';

// Define types for our data
type WordPair = {
  term: string;
  definition: string;
};

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
  difficulty_level?: string;
  theme?: string;
  topic?: string;
  language?: string;
  created_at?: string;
  updated_at?: string;
  words?: WordPair[];
  is_public?: boolean;
};

export default function TeacherVocabularyDashboard() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Enhanced vocabulary state
  const [enhancedLists, setEnhancedLists] = useState<EnhancedVocabularyList[]>([]);
  const [vocabularyService, setVocabularyService] = useState<EnhancedVocabularyService | null>(null);
  const [showEnhancedCreator, setShowEnhancedCreator] = useState(false);
  const [editingList, setEditingList] = useState<EnhancedVocabularyList | null>(null);

  // Legacy vocabulary state (for backward compatibility)
  const [vocabularyLists, setVocabularyLists] = useState<WordList[]>([]);
  const [filteredLists, setFilteredLists] = useState<WordList[]>([]);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedContentType, setSelectedContentType] = useState('all');
  const [showLegacyLists, setShowLegacyLists] = useState(false);

  // UI state
  const [themes, setThemes] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedList, setSelectedList] = useState<WordList | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    totalLists: 0,
    totalAssignments: 0,
    totalItems: 0,
    enhancedLists: 0,
    legacyLists: 0,
    themeBreakdown: [] as Array<{theme: string, listCount: number, itemCount: number}>
  });

  // Initialize enhanced vocabulary service
  useEffect(() => {
    if (supabase) {
      const service = new EnhancedVocabularyService(supabase);
      setVocabularyService(service);
    }
  }, [supabase]);

  // Fetch enhanced vocabulary lists
  const fetchEnhancedVocabularyLists = async () => {
    if (!vocabularyService || !user) return;

    try {
      const lists = await vocabularyService.getVocabularyLists({
        teacher_id: user.id
      });
      setEnhancedLists(lists);
    } catch (error) {
      console.error('Error fetching enhanced vocabulary lists:', error);
    }
  };

  // Fetch vocabulary lists
  useEffect(() => {
    if (!user || !vocabularyService) return;

    const fetchVocabularyData = async () => {
      setLoading(true);

      try {
        // Fetch enhanced vocabulary lists
        await fetchEnhancedVocabularyLists();
        // Fetch vocabulary lists created by the current teacher
        const { data: listsData, error: listsError } = await supabase
          .from('vocabulary_assignment_lists')
          .select(`
            *,
            vocabulary_assignment_items(
              id,
              vocabulary_id,
              vocabulary(id, spanish, english, theme, topic)
            )
          `)
          .eq('teacher_id', user.id)
          .order('created_at', { ascending: false });
        
        if (listsError) {
          console.error('Error fetching vocabulary lists:', listsError);
          setError('Failed to load vocabulary lists');
          setLoading(false);
          return;
        }
        
        // Process lists data
        const processedLists = listsData?.map(list => ({
          id: list.id,
          name: list.name,
          description: list.description || '',
          word_count: list.word_count || 0,
          created_by: list.teacher_id,
          is_assigned: false, // We'll update this based on assignments
          assigned_date: undefined,
          due_date: undefined,
          progress: 0,
          level: list.difficulty_level as 'beginner' | 'intermediate' | 'advanced' | undefined,
          category: list.theme || list.topic || 'General',
          difficulty_level: list.difficulty_level,
          theme: list.theme,
          topic: list.topic,
          language: list.language || 'Spanish', // Default to Spanish if not specified
          created_at: list.created_at,
          updated_at: list.updated_at
        })) || [];
        
        setVocabularyLists(processedLists);
        setFilteredLists(processedLists);
        
        // Extract unique themes from the vocabulary lists
        const uniqueThemes = [...new Set(listsData?.map(list => list.theme).filter(Boolean))];
        setThemes(uniqueThemes);
        
        // Calculate stats
        const totalLists = processedLists.length;
        const totalItems = processedLists.reduce((sum, list) => sum + list.word_count, 0);
        
        // Theme breakdown
        const themeBreakdown = uniqueThemes.map(theme => {
          const listsInTheme = processedLists.filter(list => list.category === theme);
          const itemsInTheme = listsInTheme.reduce((sum, list) => sum + list.word_count, 0);
          
          return {
            theme,
            listCount: listsInTheme.length,
            itemCount: itemsInTheme
          };
        });
        
        setStats({
          totalLists,
          totalAssignments: 0, // We'll calculate this if needed
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
      filtered = filtered.filter(list => list.theme === selectedTheme);
    }
    
    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(list => list.difficulty_level === selectedDifficulty);
    }

    // Apply language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(list => list.language === selectedLanguage);
    }
    
    setFilteredLists(filtered);
  }, [vocabularyLists, searchTerm, selectedTheme, selectedDifficulty, selectedLanguage]);
  
  // Handle list deletion
  const handleDeleteList = async (listId: string) => {
    if (window.confirm('Are you sure you want to delete this vocabulary list? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('vocabulary_assignment_lists')
          .delete()
          .eq('id', listId);
        
        if (error) {
          console.error('Error deleting vocabulary list:', error);
          return;
        }
        
        // Update state
        setVocabularyLists(prev => prev.filter(list => list.id !== listId));
        
        // Close selected list if it was deleted
        if (selectedList && selectedList.id === listId) {
          setSelectedList(null);
          setEditMode(false);
        }
      } catch (error) {
        console.error('Error deleting vocabulary list:', error);
      }
    }
  };

  // View word list details
  const viewWordList = (list: WordList) => {
    setSelectedList(list);
    setEditMode(false);
  };

  // Add word pair to selected list
  const addWordPair = (listId: string) => {
    if (!selectedList) return;
    
    const updatedList = {
      ...selectedList,
      words: [...(selectedList.words || []), { term: '', definition: '' }],
      word_count: selectedList.word_count + 1
    };
    
    setSelectedList(updatedList);
    
    // Update in the main list
    const updatedLists = vocabularyLists.map(list => 
      list.id === listId ? updatedList : list
    );
    
    setVocabularyLists(updatedLists);
  };

  // Remove word pair from selected list
  const removeWordPair = (listId: string, index: number) => {
    if (!selectedList) return;
    
    const updatedWords = [...(selectedList.words || [])];
    updatedWords.splice(index, 1);
    
    const updatedList = {
      ...selectedList,
      words: updatedWords,
      word_count: updatedWords.length
    };
    
    setSelectedList(updatedList);
    
    // Update in the main list
    const updatedLists = vocabularyLists.map(list => 
      list.id === listId ? updatedList : list
    );
    
    setVocabularyLists(updatedLists);
  };

  // Update word pair in selected list
  const updateWordPair = (listId: string, index: number, field: 'term' | 'definition', value: string) => {
    if (!selectedList) return;
    
    const updatedWords = [...(selectedList.words || [])];
    updatedWords[index] = {
      ...updatedWords[index],
      [field]: value
    };
    
    const updatedList = {
      ...selectedList,
      words: updatedWords
    };
    
    setSelectedList(updatedList);
    
    // Update in the main list
    const updatedLists = vocabularyLists.map(list => 
      list.id === listId ? updatedList : list
    );
    
    setVocabularyLists(updatedLists);
  };

  // Save changes to selected list
  const saveChanges = async () => {
    if (!selectedList) return;
    
    try {
      // Here you would update the database with the changes
      // For now, we'll just update the local state
      const updatedList = {
        ...selectedList,
        updated_at: new Date().toISOString()
      };
      
      const updatedLists = vocabularyLists.map(list => 
        list.id === selectedList.id ? updatedList : list
      );
      
      setVocabularyLists(updatedLists);
      setSelectedList(updatedList);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      setError('Failed to save changes. Please try again.');
    }
  };

  // Enhanced vocabulary handlers
  const handleCreateEnhancedList = async (listData: any) => {
    if (!vocabularyService || !user) return;

    try {
      const { items, ...listInfo } = listData;
      const newList = await vocabularyService.createVocabularyList(
        {
          ...listInfo,
          teacher_id: user.id
        },
        items
      );

      setEnhancedLists(prev => [newList, ...prev]);
      setShowEnhancedCreator(false);
      await fetchEnhancedVocabularyLists(); // Refresh the list
    } catch (error) {
      console.error('Error creating enhanced vocabulary list:', error);
      throw error;
    }
  };

  const handleEditEnhancedList = async (listData: any) => {
    if (!vocabularyService || !editingList) return;

    try {
      const { items, ...listInfo } = listData;
      await vocabularyService.updateVocabularyList(
        editingList.id,
        listInfo,
        items
      );

      setEditingList(null);
      setShowEnhancedCreator(false);
      await fetchEnhancedVocabularyLists(); // Refresh the list
    } catch (error) {
      console.error('Error updating enhanced vocabulary list:', error);
      throw error;
    }
  };

  const handleDeleteEnhancedList = async (listId: string) => {
    if (!vocabularyService) return;

    if (window.confirm('Are you sure you want to delete this vocabulary list? This action cannot be undone.')) {
      try {
        await vocabularyService.deleteVocabularyList(listId);
        setEnhancedLists(prev => prev.filter(list => list.id !== listId));
      } catch (error) {
        console.error('Error deleting enhanced vocabulary list:', error);
        setError('Failed to delete vocabulary list');
      }
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-6 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Return to Dashboard
          </Link>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-bold text-white mb-3">Vocabulary Management</h1>
            <p className="text-xl text-slate-300">Create and manage your vocabulary collections</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span>Enhanced lists: {enhancedLists.length}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <BookOpen className="h-4 w-4 text-blue-400" />
                <span>Legacy lists: {vocabularyLists.length}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowEnhancedCreator(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Create Enhanced List
            </button>
            <Link
              href="/dashboard/vocabulary/create"
              className="flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Legacy List
            </Link>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 text-red-100 rounded-xl backdrop-blur-sm">
            <div className="flex items-center">
              <X className="h-5 w-5 mr-2" />
              {error}
            </div>
          </div>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md text-white rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 mr-3 text-cyan-400" />
              <div>
                <p className="text-sm font-medium text-slate-300">Total Lists</p>
                <p className="text-2xl font-bold">{stats.totalLists}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md text-white rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <Users className="h-8 w-8 mr-3 text-green-400" />
              <div>
                <p className="text-sm font-medium text-slate-300">Class Assignments</p>
                <p className="text-2xl font-bold">{stats.totalAssignments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md text-white rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center">
              <Clock className="h-8 w-8 mr-3 text-purple-400" />
              <div>
                <p className="text-sm font-medium text-slate-300">Total Vocabulary Items</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link 
            href="/dashboard/vocabulary/import" 
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-3 rounded-xl flex items-center border border-white/20 transition-all"
          >
            <Upload className="mr-2 h-5 w-5" /> Import List
          </Link>
          
          <Link 
            href="/dashboard/vocabulary/export" 
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-3 rounded-xl flex items-center border border-white/20 transition-all"
          >
            <Download className="mr-2 h-5 w-5" /> Export List
          </Link>
          
          <Link 
            href="/dashboard/vocabulary/analytics" 
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-3 rounded-xl flex items-center border border-white/20 transition-all"
          >
            <BarChart2 className="mr-2 h-5 w-5" /> View Analytics
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-2xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                placeholder="Search lists..." 
              />
            </div>

            {/* Theme Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-slate-400" />
              </div>
              <select
                className="pl-12 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent appearance-none"
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
              >
                <option value="all">All Themes</option>
                {themes.map((theme) => (
                  <option key={theme} value={theme} className="bg-slate-800">
                    {theme}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ListFilter className="h-5 w-5 text-slate-400" />
              </div>
              <select
                className="pl-12 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent appearance-none"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="all">All Difficulties</option>
                <option value="1" className="bg-slate-800">Beginner (1)</option>
                <option value="2" className="bg-slate-800">Elementary (2)</option>
                <option value="3" className="bg-slate-800">Intermediate (3)</option>
                <option value="4" className="bg-slate-800">Advanced (4)</option>
                <option value="5" className="bg-slate-800">Expert (5)</option>
              </select>
            </div>

            {/* Language Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-slate-400" />
              </div>
              <select
                className="pl-12 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent appearance-none"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="all">All Languages</option>
                <option value="Spanish" className="bg-slate-800">Spanish</option>
                <option value="French" className="bg-slate-800">French</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white/10 rounded-lg p-1 border border-white/20">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-3 py-2 rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5 mx-auto">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex-1 px-3 py-2 rounded-md transition-all ${
                  viewMode === 'table' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                <div className="w-4 h-4 flex flex-col gap-1 mx-auto">
                  <div className="bg-current h-0.5 rounded"></div>
                  <div className="bg-current h-0.5 rounded"></div>
                  <div className="bg-current h-0.5 rounded"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Vocabulary Lists Section */}
        {enhancedLists.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Enhanced Vocabulary Lists</h2>
              <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-medium">
                New System
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enhancedLists.map((list) => (
                <div key={list.id} className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:border-purple-400/50 transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{list.name}</h3>
                      <p className="text-slate-300 text-sm mb-3 line-clamp-2">{list.description}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          list.content_type === 'words' ? 'bg-blue-100 text-blue-800' :
                          list.content_type === 'sentences' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {list.content_type === 'words' ? (
                            <><BookOpen className="h-3 w-3 inline mr-1" />Words</>
                          ) : list.content_type === 'sentences' ? (
                            <><MessageSquare className="h-3 w-3 inline mr-1" />Sentences</>
                          ) : (
                            <><FileText className="h-3 w-3 inline mr-1" />Mixed</>
                          )}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          list.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
                          list.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {list.difficulty_level}
                        </span>
                        {list.is_public && (
                          <span className="px-2 py-1 text-xs rounded-full bg-cyan-100 text-cyan-800">
                            <Globe className="h-3 w-3 inline mr-1" />Public
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {list.word_count} items
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(list.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => {
                          setEditingList(list);
                          setShowEnhancedCreator(true);
                        }}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        title="Edit list"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEnhancedList(list.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete list"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-sm text-slate-400">
                      {list.language.charAt(0).toUpperCase() + list.language.slice(1)}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/assignments/create?vocabulary_list=${list.id}&enhanced=true`}
                        className="flex items-center gap-1 px-3 py-1 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-all text-sm"
                      >
                        <Plus className="h-3 w-3" />
                        Assign
                      </Link>
                      <button className="flex items-center gap-1 px-3 py-1 bg-cyan-600/20 text-cyan-400 rounded-lg hover:bg-cyan-600/30 transition-all text-sm">
                        <Eye className="h-3 w-3" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legacy Vocabulary Lists Section */}
        {vocabularyLists.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Legacy Vocabulary Lists</h2>
                <span className="px-3 py-1 bg-blue-400/20 text-blue-400 rounded-full text-sm font-medium">
                  Legacy System
                </span>
              </div>
              <button
                onClick={() => setShowLegacyLists(!showLegacyLists)}
                className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white transition-colors"
              >
                {showLegacyLists ? 'Hide' : 'Show'} Legacy Lists
                <ChevronDown className={`h-4 w-4 transition-transform ${showLegacyLists ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showLegacyLists && (
              <>

        {/* Content Grid/Table View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredLists.length === 0 ? (
              <div className="col-span-full bg-white/10 backdrop-blur-md p-12 rounded-xl text-center border border-white/20">
                <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-cyan-600/20 text-cyan-400 mb-6">
                  <BookOpen className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-3">No vocabulary lists found</h3>
                <p className="text-slate-300 mb-8 text-lg">
                  {searchTerm || selectedTheme !== 'all' || selectedDifficulty !== 'all' || selectedLanguage !== 'all' ? 'Try different search filters or' : 'Create your first vocabulary list to'} get started
                </p>
                <Link
                  href="/dashboard/vocabulary/create"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg transition-all"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Vocabulary List
                </Link>
              </div>
            ) : (
              filteredLists.map(list => (
                <div key={list.id} className="bg-white/10 backdrop-blur-md p-6 rounded-xl hover:bg-white/15 transition-all duration-200 border border-white/20 group hover:shadow-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">{list.name}</h3>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => viewWordList(list)}
                        className="p-2 hover:bg-white/10 rounded-lg text-cyan-400 hover:text-cyan-300 transition-colors"
                        title="View list"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <Link
                        href={`/dashboard/vocabulary/edit/${list.id}`}
                        className="p-2 hover:bg-white/10 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
                        title="Edit list"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button 
                        onClick={() => handleDeleteList(list.id)}
                        className="p-2 hover:bg-white/10 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                        title="Delete list"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {list.description && (
                    <p className="text-sm text-slate-300 mb-4 line-clamp-2">{list.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-sm text-slate-300">{list.word_count} words</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {list.language && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          list.language === 'Spanish' ? 'bg-orange-600/20 text-orange-300' : 'bg-blue-600/20 text-blue-300'
                        }`}>
                          {list.language}
                        </span>
                      )}
                      {list.difficulty_level && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          list.difficulty_level === '1' || list.difficulty_level === '2' ? 'bg-green-600/20 text-green-300' :
                          list.difficulty_level === '3' ? 'bg-yellow-600/20 text-yellow-300' :
                          'bg-red-600/20 text-red-300'
                        }`}>
                          Level {list.difficulty_level}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => viewWordList(list)}
                    className="w-full mt-2 px-4 py-2 border border-cyan-600 rounded-lg text-cyan-400 hover:bg-cyan-600 hover:text-white flex items-center justify-center transition-all"
                  >
                    View Vocabulary
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white/10 border-b border-white/20">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      List Name
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Language
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Theme
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Items
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredLists.length > 0 ? (
                    filteredLists.map((list) => (
                      <tr key={list.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {list.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            list.language === 'Spanish' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {list.language || 'Spanish'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {list.theme || list.category || 'General'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            list.difficulty_level === '1' || list.difficulty_level === '2' ? 'bg-green-100 text-green-800' :
                            list.difficulty_level === '3' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {list.difficulty_level === '1' ? 'Beginner' :
                             list.difficulty_level === '2' ? 'Elementary' :
                             list.difficulty_level === '3' ? 'Intermediate' :
                             list.difficulty_level === '4' ? 'Advanced' : 
                             list.difficulty_level === '5' ? 'Expert' : 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {list.word_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {list.updated_at ? formatDate(list.updated_at) : (list.created_at ? formatDate(list.created_at) : 'Unknown')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => viewWordList(list)}
                              className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <Link
                              href={`/dashboard/vocabulary/edit/${list.id}`}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Edit className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteList(list.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-300">
                        {searchTerm || selectedTheme !== 'all' || selectedDifficulty !== 'all' || selectedLanguage !== 'all' ? (
                          <div>
                            <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <p className="text-lg mb-4">No vocabulary lists match your search filters.</p>
                            <button
                              onClick={() => {
                                setSearchTerm('');
                                setSelectedTheme('all');
                                setSelectedDifficulty('all');
                                setSelectedLanguage('all');
                              }}
                              className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              Clear filters
                            </button>
                          </div>
                        ) : (
                          <div>
                            <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <p className="text-lg mb-4">No vocabulary lists found. Create your first list to get started!</p>
                            <Link
                              href="/dashboard/vocabulary/create"
                              className="inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Create New List
                            </Link>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
              </>
            )}
          </div>
        )}

        {/* Selected word list view */}
        {selectedList && (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-2xl mb-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-semibold text-white">{selectedList.name}</h2>
                {selectedList.description && (
                  <p className="text-slate-300 mt-2 text-lg">{selectedList.description}</p>
                )}
              </div>
              <div className="flex space-x-3">
                {editMode ? (
                  <>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 border border-white/20 rounded-lg text-slate-300 hover:bg-white/10 flex items-center transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={saveChanges}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white flex items-center transition-colors"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setSelectedList(null)}
                      className="px-4 py-2 border border-white/20 rounded-lg text-slate-300 hover:bg-white/10 flex items-center transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Close
                    </button>
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white flex items-center transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit List
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="mb-6 flex justify-between items-center">
              <div className="flex space-x-6 text-sm text-slate-300">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created: {selectedList.created_at ? formatDate(selectedList.created_at) : 'Unknown'}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Updated: {selectedList.updated_at ? formatDate(selectedList.updated_at) : 'Unknown'}
                </div>
                {selectedList.language && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    Language: {selectedList.language}
                  </div>
                )}
              </div>
              
              {editMode && (
                <button
                  onClick={() => addWordPair(selectedList.id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white flex items-center transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Word
                </button>
              )}
            </div>
            
            <div className="bg-white/10 rounded-xl overflow-hidden border border-white/20">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/20 bg-white/10">
                <div className="col-span-5 font-medium text-slate-300">Term</div>
                <div className="col-span-6 font-medium text-slate-300">Definition</div>
                <div className="col-span-1"></div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {(!selectedList.words || selectedList.words.length === 0) ? (
                  <div className="p-12 text-center">
                    <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-300 mb-6 text-lg">No words added to this list yet.</p>
                    {editMode && (
                      <button
                        onClick={() => addWordPair(selectedList.id)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white flex items-center mx-auto transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Word
                      </button>
                    )}
                  </div>
                ) : (
                  selectedList.words.map((word, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                      <div className="col-span-5">
                        {editMode ? (
                          <input
                            type="text"
                            value={word.term}
                            onChange={(e) => updateWordPair(selectedList.id, index, 'term', e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                            placeholder="Enter term"
                          />
                        ) : (
                          <span className="text-white font-medium">{word.term}</span>
                        )}
                      </div>
                      <div className="col-span-6">
                        {editMode ? (
                          <input
                            type="text"
                            value={word.definition}
                            onChange={(e) => updateWordPair(selectedList.id, index, 'definition', e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                            placeholder="Enter definition"
                          />
                        ) : (
                          <span className="text-slate-300">{word.definition}</span>
                        )}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        {editMode && (
                          <button
                            onClick={() => removeWordPair(selectedList.id, index)}
                            className="p-2 hover:bg-red-600/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Assignments */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-2xl font-semibold text-white">Recent Assignments</h2>
          </div>
          <div className="divide-y divide-white/10">
            {assignments.length > 0 ? (
              assignments.slice(0, 5).map((assignment) => (
                <div key={assignment.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-white">{assignment.vocabulary_lists?.name || 'Unknown List'}</h4>
                      </div>
                      <div className="flex items-center text-sm text-slate-400">
                        <Users className="h-4 w-4 mr-1" />
                        {assignment.classes?.name || 'Unknown Class'}
                        <span className="mx-2">•</span>
                        <Calendar className="h-4 w-4 mr-1" />
                        Due: {assignment.due_date ? formatDate(assignment.due_date) : 'No due date'}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/dashboard/assignments/view/${assignment.id}`}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Progress
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300 mb-6 text-lg">No vocabulary assignments found.</p>
                <p className="text-slate-400">Assign vocabulary lists to your classes to get started!</p>
              </div>
            )}
          </div>
          
          {assignments.length > 5 && (
            <div className="px-6 py-3 bg-white/10 text-right border-t border-white/20">
              <Link href="/dashboard/assignments" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                View All Assignments
              </Link>
            </div>
          )}
        </div>

        {/* Enhanced Vocabulary Creator Modal */}
        {showEnhancedCreator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <EnhancedVocabularyCreator
                onSave={editingList ? handleEditEnhancedList : handleCreateEnhancedList}
                onCancel={() => {
                  setShowEnhancedCreator(false);
                  setEditingList(null);
                }}
                initialData={editingList || undefined}
                mode={editingList ? 'edit' : 'create'}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}