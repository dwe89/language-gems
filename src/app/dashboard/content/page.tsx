'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../../components/auth/AuthProvider';
import type { Database } from '../../../lib/database.types';
import { 
  Plus, Trash2, Edit, Save, X, Search, 
  Download, Upload, ArrowRight, Eye, 
  BookOpen, CheckCircle, ArrowUpRight
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
  
  // Filter word lists based on search term
  const filteredWordLists = searchTerm
    ? wordLists.filter(list => 
        list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (list.description && list.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : wordLists;
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Custom Content</h1>
          <p className="text-gray-300">Create and manage your custom vocabulary lists</p>
        </div>
        <Link 
          href="/dashboard/content/create" 
          className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Vocabulary List
        </Link>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Search and create form */}
      <div className="bg-indigo-900/30 backdrop-blur-sm p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 bg-indigo-800/50 border border-indigo-700 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Search vocabulary lists..." 
            />
          </div>
        </div>
      </div>
      
      {showCreateForm && (
        <div className="bg-indigo-900/30 backdrop-blur-sm p-6 rounded-lg mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-white">Create New Vocabulary List</h2>
            <button 
              onClick={() => setShowCreateForm(false)}
              className="p-1 hover:bg-indigo-800 rounded-full"
            >
              <X className="h-5 w-5 text-gray-300" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="listName" className="block text-sm font-medium text-gray-300 mb-1">
                List Name*
              </label>
              <input
                id="listName"
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full px-3 py-2 bg-indigo-800/50 border border-indigo-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. Essential Spanish Vocabulary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="listDescription" className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="listDescription"
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
                className="w-full px-3 py-2 bg-indigo-800/50 border border-indigo-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="A short description of this vocabulary list"
                rows={2}
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="isPublic"
                type="checkbox"
                checked={newListIsPublic}
                onChange={(e) => setNewListIsPublic(e.target.checked)}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-300">
                Make this list public (other teachers can use it)
              </label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-indigo-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateWordList}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Create List
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredWordLists.length === 0 ? (
          <div className="col-span-full bg-indigo-900/30 backdrop-blur-sm p-8 rounded-lg text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No vocabulary lists found</h3>
            <p className="text-gray-300 mb-6">
              {searchTerm ? 'Try a different search term or' : 'Create your first vocabulary list to'} get started
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setShowCreateForm(true);
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md"
            >
              Create Vocabulary List
            </button>
          </div>
        ) : (
          filteredWordLists.map(list => (
            <div key={list.id} className="bg-indigo-900/30 backdrop-blur-sm p-6 rounded-lg hover:bg-indigo-900/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-white">{list.name}</h3>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => viewWordList(list)}
                    className="p-1.5 hover:bg-indigo-800 rounded text-teal-400 hover:text-teal-300"
                    title="View list"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => deleteWordList(list.id)}
                    className="p-1.5 hover:bg-indigo-800 rounded text-red-400 hover:text-red-300"
                    title="Delete list"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {list.description && (
                <p className="text-sm text-gray-300 mb-3 line-clamp-2">{list.description}</p>
              )}
              
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 text-gray-400 mr-1.5" />
                  <span className="text-sm text-gray-300">{list.word_count} words</span>
                </div>
                {list.is_public && (
                  <span className="text-xs px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded-full">
                    Public
                  </span>
                )}
              </div>
              
              <button
                onClick={() => viewWordList(list)}
                className="w-full mt-2 px-3 py-1.5 border border-teal-700 rounded text-teal-400 hover:bg-teal-900/30 flex items-center justify-center"
              >
                View Vocabulary
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          ))
        )}
      </div>
      
      {/* Selected word list view */}
      {selectedList && (
        <div className="bg-indigo-900/30 backdrop-blur-sm p-6 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">{selectedList.name}</h2>
              {selectedList.description && (
                <p className="text-gray-300 mt-1">{selectedList.description}</p>
              )}
            </div>
            <div className="flex space-x-2">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-3 py-1.5 border border-gray-600 rounded text-gray-300 hover:bg-indigo-800 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1.5" />
                    Cancel
                  </button>
                  <button
                    onClick={saveChanges}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 rounded text-white flex items-center"
                  >
                    <Save className="h-4 w-4 mr-1.5" />
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedList(null)}
                    className="px-3 py-1.5 border border-gray-600 rounded text-gray-300 hover:bg-indigo-800 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1.5" />
                    Close
                  </button>
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 rounded text-white flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1.5" />
                    Edit List
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="mb-4 flex justify-between items-center">
            <div className="flex space-x-3">
              <div className="text-sm text-gray-300">
                <span className="text-gray-400">Created:</span> {new Date(selectedList.created_at).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-300">
                <span className="text-gray-400">Updated:</span> {new Date(selectedList.updated_at).toLocaleDateString()}
              </div>
              {selectedList.language && (
                <div className="text-sm text-gray-300">
                  <span className="text-gray-400">Language:</span> {selectedList.language}
                </div>
              )}
            </div>
            
            {editMode && (
              <button
                onClick={() => addWordPair(selectedList.id)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-white flex items-center text-sm"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Word
              </button>
            )}
          </div>
          
          <div className="bg-indigo-950/50 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-indigo-800 bg-indigo-900/50">
              <div className="col-span-5 font-medium text-gray-300">Term</div>
              <div className="col-span-6 font-medium text-gray-300">Definition</div>
              <div className="col-span-1"></div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {selectedList.words.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-300 mb-4">No words added to this list yet.</p>
                  {editMode && (
                    <button
                      onClick={() => addWordPair(selectedList.id)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-white flex items-center mx-auto"
                    >
                      <Plus className="h-4 w-4 mr-1.5" />
                      Add First Word
                    </button>
                  )}
                </div>
              ) : (
                selectedList.words.map((word, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b border-indigo-800 last:border-0">
                    <div className="col-span-5">
                      {editMode ? (
                        <input
                          type="text"
                          value={word.term}
                          onChange={(e) => updateWordPair(selectedList.id, index, 'term', e.target.value)}
                          className="w-full px-3 py-1.5 bg-indigo-800/50 border border-indigo-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      ) : (
                        <span className="text-white">{word.term}</span>
                      )}
                    </div>
                    <div className="col-span-6">
                      {editMode ? (
                        <input
                          type="text"
                          value={word.definition}
                          onChange={(e) => updateWordPair(selectedList.id, index, 'definition', e.target.value)}
                          className="w-full px-3 py-1.5 bg-indigo-800/50 border border-indigo-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      ) : (
                        <span className="text-white">{word.definition}</span>
                      )}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {editMode && (
                        <button
                          onClick={() => removeWordPair(selectedList.id, index)}
                          className="p-1 hover:bg-indigo-800 rounded text-red-400 hover:text-red-300"
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
  );
} 