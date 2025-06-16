'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../../components/auth/AuthProvider';
import type { Database } from '../../../lib/database.types';
import { 
  Plus, Trash2, Edit, Save, X, Search, 
  Download, Upload, ArrowRight, Eye, 
  BookOpen, CheckCircle, ArrowUpRight,
  Globe, Lock, Calendar, Users, Filter
} from 'lucide-react';

// Add export config to skip static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

type WordPair = {
  term: string;
  definition: string;
};

type WordList = {
  id: string;
  name: string;
  description: string | null;
  words: WordPair[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  language?: string;
  word_count: number;
};

export default function ContentPage() {
  const { user } = useAuth();
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedList, setSelectedList] = useState<WordList | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [newListIsPublic, setNewListIsPublic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'public' | 'private'>('all');
  
  const supabase = supabaseBrowser;
  
  useEffect(() => {
    loadWordLists();
  }, [user]);
  
  // Load word lists
  const loadWordLists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample data for development
      const sampleWordLists: WordList[] = [
        {
          id: '1',
          name: 'Basic French Vocabulary',
          description: 'Essential words for beginners',
          words: [
            { term: 'bonjour', definition: 'hello' },
            { term: 'au revoir', definition: 'goodbye' },
            { term: 'merci', definition: 'thank you' },
            { term: 's\'il vous plaît', definition: 'please' },
            { term: 'oui', definition: 'yes' },
            { term: 'non', definition: 'no' }
          ],
          is_public: true,
          created_at: '2023-01-10T12:00:00Z',
          updated_at: '2023-01-15T14:30:00Z',
          created_by: 'teacher1',
          language: 'French',
          word_count: 6
        },
        {
          id: '2',
          name: 'Spanish Food Terms',
          description: 'Common food vocabulary in Spanish',
          words: [
            { term: 'manzana', definition: 'apple' },
            { term: 'pan', definition: 'bread' },
            { term: 'queso', definition: 'cheese' },
            { term: 'agua', definition: 'water' },
            { term: 'leche', definition: 'milk' }
          ],
          is_public: true,
          created_at: '2023-02-05T10:20:00Z',
          updated_at: '2023-02-10T16:45:00Z',
          created_by: 'teacher1',
          language: 'Spanish',
          word_count: 5
        },
        {
          id: '3',
          name: 'German Verbs',
          description: 'Essential German verbs with conjugations',
          words: [
            { term: 'sein', definition: 'to be' },
            { term: 'haben', definition: 'to have' },
            { term: 'gehen', definition: 'to go' },
            { term: 'kommen', definition: 'to come' },
            { term: 'machen', definition: 'to make/do' }
          ],
          is_public: false,
          created_at: '2023-03-15T09:00:00Z',
          updated_at: '2023-03-20T13:15:00Z',
          created_by: 'teacher1',
          language: 'German',
          word_count: 5
        }
      ];
      
      setWordLists(sampleWordLists);
    } catch (error) {
      console.error('Error loading word lists:', error);
      setError('Failed to load vocabulary lists. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateWordList = async () => {
    if (!newListName.trim()) {
      setError('Please provide a name for your vocabulary list');
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newList: WordList = {
        id: Date.now().toString(),
        name: newListName,
        description: newListDescription || null,
        words: [],
        is_public: newListIsPublic,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user?.id || 'unknown',
        word_count: 0
      };
      
      setWordLists([newList, ...wordLists]);
      setNewListName('');
      setNewListDescription('');
      setNewListIsPublic(false);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating word list:', error);
      setError('Failed to create the vocabulary list. Please try again.');
    }
  };
  
  const addWordPair = (listId: string) => {
    if (!selectedList) return;
    
    const updatedList = {
      ...selectedList,
      words: [...selectedList.words, { term: '', definition: '' }],
      word_count: selectedList.word_count + 1
    };
    
    setSelectedList(updatedList);
    
    // Update in the main list
    const updatedLists = wordLists.map(list => 
      list.id === listId ? updatedList : list
    );
    
    setWordLists(updatedLists);
  };
  
  const removeWordPair = (listId: string, index: number) => {
    if (!selectedList) return;
    
    const updatedWords = [...selectedList.words];
    updatedWords.splice(index, 1);
    
    const updatedList = {
      ...selectedList,
      words: updatedWords,
      word_count: updatedWords.length
    };
    
    setSelectedList(updatedList);
    
    // Update in the main list
    const updatedLists = wordLists.map(list => 
      list.id === listId ? updatedList : list
    );
    
    setWordLists(updatedLists);
  };
  
  const updateWordPair = (listId: string, index: number, field: 'term' | 'definition', value: string) => {
    if (!selectedList) return;
    
    const updatedWords = [...selectedList.words];
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
    const updatedLists = wordLists.map(list => 
      list.id === listId ? updatedList : list
    );
    
    setWordLists(updatedLists);
  };
  
  const deleteWordList = async (listId: string) => {
    if (!confirm('Are you sure you want to delete this vocabulary list?')) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from state
      const updatedLists = wordLists.filter(list => list.id !== listId);
      setWordLists(updatedLists);
      
      if (selectedList && selectedList.id === listId) {
        setSelectedList(null);
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error deleting word list:', error);
      setError('Failed to delete the vocabulary list. Please try again.');
    }
  };
  
  const viewWordList = (list: WordList) => {
    setSelectedList(list);
    setEditMode(false);
  };
  
  const saveChanges = async () => {
    if (!selectedList) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the word list in state with the current timestamp
      const updatedList = {
        ...selectedList,
        updated_at: new Date().toISOString()
      };
      
      const updatedLists = wordLists.map(list => 
        list.id === selectedList.id ? updatedList : list
      );
      
      setWordLists(updatedLists);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      setError('Failed to save changes. Please try again.');
    }
  };
  
  // Filter word lists based on search term and status
  const filteredWordLists = wordLists.filter(list => {
    const matchesSearch = searchTerm === '' || 
      list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (list.description && list.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'public' && list.is_public) ||
      (filterStatus === 'private' && !list.is_public);
    
    return matchesSearch && matchesFilter;
  });
  
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
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-bold text-white mb-3">Content Library</h1>
            <p className="text-xl text-slate-300">Create and manage your custom vocabulary collections</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New List
          </button>
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

        {/* Search and Filter Section */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-2xl mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                placeholder="Search vocabulary lists..." 
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {['all', 'public', 'private'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterStatus(filter as any)}
                  className={`px-4 py-3 rounded-lg capitalize transition-all ${
                    filterStatus === filter
                      ? 'bg-cyan-600 text-white shadow-lg'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {filter === 'all' && <Filter className="h-4 w-4 mr-2 inline" />}
                  {filter === 'public' && <Globe className="h-4 w-4 mr-2 inline" />}
                  {filter === 'private' && <Lock className="h-4 w-4 mr-2 inline" />}
                  {filter}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md transition-all ${
                  viewMode === 'list' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                <div className="w-4 h-4 flex flex-col gap-1">
                  <div className="bg-current h-0.5 rounded"></div>
                  <div className="bg-current h-0.5 rounded"></div>
                  <div className="bg-current h-0.5 rounded"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {showCreateForm && (
          <div className="mb-8 bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-semibold text-white">Create New Vocabulary List</h2>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-slate-300" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="listName" className="block text-sm font-medium text-slate-300 mb-2">
                  List Name *
                </label>
                <input
                  id="listName"
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="e.g. Essential Spanish Vocabulary"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="listDescription" className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  id="listDescription"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="A short description of this vocabulary list"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="isPublic"
                  type="checkbox"
                  checked={newListIsPublic}
                  onChange={(e) => setNewListIsPublic(e.target.checked)}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-white/20 rounded bg-white/10"
                />
                <label htmlFor="isPublic" className="ml-3 block text-sm text-slate-300">
                  <Globe className="h-4 w-4 inline mr-1" />
                  Make this list public (other teachers can use it)
                </label>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 border border-white/20 rounded-lg text-slate-300 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateWordList}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg flex items-center transition-all"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Create List
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Content Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredWordLists.length === 0 ? (
              <div className="col-span-full bg-white/10 backdrop-blur-md p-12 rounded-xl text-center border border-white/20">
                <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-cyan-600/20 text-cyan-400 mb-6">
                  <BookOpen className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-3">No vocabulary lists found</h3>
                <p className="text-slate-300 mb-8 text-lg">
                  {searchTerm ? 'Try a different search term or' : 'Create your first vocabulary list to'} get started
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setShowCreateForm(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg transition-all"
                >
                  Create Vocabulary List
                </button>
              </div>
            ) : (
              filteredWordLists.map(list => (
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
                      <button 
                        onClick={() => deleteWordList(list.id)}
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
                        <span className="text-xs px-2 py-1 bg-cyan-600/20 text-cyan-300 rounded-full">
                          {list.language}
                        </span>
                      )}
                      {list.is_public && (
                        <div className="flex items-center text-xs text-green-400">
                          <Globe className="h-3 w-3 mr-1" />
                          Public
                        </div>
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
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <h3 className="text-lg font-semibold text-white">Vocabulary Lists</h3>
            </div>
            <div className="divide-y divide-white/10">
              {filteredWordLists.map(list => (
                <div key={list.id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-white">{list.name}</h4>
                        {list.is_public && (
                          <div className="flex items-center text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded-full">
                            <Globe className="h-3 w-3 mr-1" />
                            Public
                          </div>
                        )}
                        {list.language && (
                          <span className="text-xs px-2 py-1 bg-cyan-600/20 text-cyan-300 rounded-full">
                            {list.language}
                          </span>
                        )}
                      </div>
                      {list.description && (
                        <p className="text-slate-300 mb-2">{list.description}</p>
                      )}
                      <div className="flex items-center text-sm text-slate-400">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {list.word_count} words
                        <span className="mx-2">•</span>
                        <Calendar className="h-4 w-4 mr-1" />
                        Updated {new Date(list.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => viewWordList(list)}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </button>
                      <button 
                        onClick={() => deleteWordList(list.id)}
                        className="p-2 hover:bg-red-600/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                        title="Delete list"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected word list view */}
        {selectedList && (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-2xl">
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
                  Created: {new Date(selectedList.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Updated: {new Date(selectedList.updated_at).toLocaleDateString()}
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
                {selectedList.words.length === 0 ? (
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
      </div>
    </div>
  );
} 