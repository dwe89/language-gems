'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Upload, 
  FolderPlus, 
  Search, 
  Filter,
  BookOpen,
  MessageSquare,
  FileText,
  Edit,
  Trash2,
  Eye,
  Globe,
  Lock,
  Calendar,
  Volume2,
  Download,
  Copy,

  Loader2,
  Folder,
  FolderOpen,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { VocabularyUploadService, VocabularyFolder } from '../../services/vocabularyUploadService';
import { EnhancedVocabularyService, EnhancedVocabularyList } from '../../services/enhancedVocabularyService';
import InlineVocabularyCreator from './InlineVocabularyCreator';

interface VocabularyManagementSystemProps {
  onListSelect?: (list: EnhancedVocabularyList) => void;
}

export default function VocabularyManagementSystem({ onListSelect }: VocabularyManagementSystemProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  // Services
  const [uploadService, setUploadService] = useState<VocabularyUploadService | null>(null);
  const [vocabularyService, setVocabularyService] = useState<EnhancedVocabularyService | null>(null);
  
  // State
  const [loading, setLoading] = useState(true);
  const [vocabularyLists, setVocabularyLists] = useState<EnhancedVocabularyList[]>([]);
  const [folders, setFolders] = useState<VocabularyFolder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedContentType, setSelectedContentType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  
  // Upload modal state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);



  // Folder creation state
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');

  // Initialize services
  useEffect(() => {
    if (supabase) {
      setUploadService(new VocabularyUploadService(supabase));
      setVocabularyService(new EnhancedVocabularyService(supabase));
    }
  }, [supabase]);

  // Load data
  useEffect(() => {
    if (vocabularyService && user) {
      loadData();
    }
  }, [vocabularyService, user, currentFolder]);

  const loadData = async () => {
    if (!vocabularyService || !uploadService || !user) return;
    
    setLoading(true);
    try {
      // Load vocabulary lists
      const lists = await vocabularyService.getVocabularyLists({
        teacher_id: user.id
      });
      setVocabularyLists(lists);

      // Load folders
      const folderData = await uploadService.getFolders(user.id);
      setFolders(folderData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };



  // Create folder
  const handleCreateFolder = async () => {
    if (!uploadService || !user || !newFolderName.trim()) return;

    try {
      await uploadService.createFolder(
        newFolderName,
        user.id,
        newFolderDescription,
        currentFolder || undefined
      );
      
      await loadData();
      setShowFolderModal(false);
      setNewFolderName('');
      setNewFolderDescription('');
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder. Please try again.');
    }
  };

  // Filter lists
  const filteredLists = vocabularyLists.filter(list => {
    // Folder filter
    if (currentFolder && list.folder_id !== currentFolder) return false;
    if (!currentFolder && list.folder_id) return false;

    // Search filter
    if (searchTerm && !list.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !list.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Language filter
    if (selectedLanguage !== 'all' && list.language !== selectedLanguage) return false;

    // Content type filter
    if (selectedContentType !== 'all' && list.content_type !== selectedContentType) return false;

    // Difficulty filter
    if (selectedDifficulty !== 'all' && list.difficulty_level !== selectedDifficulty) return false;

    return true;
  });

  // Get current folder info
  const getCurrentFolder = () => {
    return folders.find(f => f.id === currentFolder);
  };

  // Get subfolders for current folder
  const getSubfolders = () => {
    return folders.filter(f => f.parent_folder_id === currentFolder);
  };

  // Get breadcrumb path
  const getBreadcrumbPath = () => {
    const path: VocabularyFolder[] = [];
    let current = getCurrentFolder();
    
    while (current) {
      path.unshift(current);
      current = folders.find(f => f.id === current?.parent_folder_id);
    }
    
    return path;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vocabulary Management</h2>
          <p className="text-gray-600">Create and organize your vocabulary collections</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFolderModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FolderPlus className="h-4 w-4" />
            New Folder
          </button>
          <button
            onClick={() => setShowUploadForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload Vocabulary
          </button>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      {currentFolder && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button
            onClick={() => setCurrentFolder(null)}
            className="hover:text-gray-900 transition-colors"
          >
            Home
          </button>
          {getBreadcrumbPath().map((folder, index) => (
            <React.Fragment key={folder.id}>
              <ChevronRight className="h-4 w-4" />
              <button
                onClick={() => setCurrentFolder(folder.id)}
                className="hover:text-gray-900 transition-colors"
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vocabulary lists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Languages</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="german">German</option>
          </select>

          <select
            value={selectedContentType}
            onChange={(e) => setSelectedContentType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Content Types</option>
            <option value="words">Words</option>
            <option value="sentences">Sentences</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folders Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">Folders</h3>
            <div className="space-y-1">
              {getSubfolders().map(folder => (
                <button
                  key={folder.id}
                  onClick={() => setCurrentFolder(folder.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Folder className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{folder.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vocabulary Lists */}
        <div className="lg:col-span-3">
          {filteredLists.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vocabulary lists found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedLanguage !== 'all' || selectedContentType !== 'all' || selectedDifficulty !== 'all'
                  ? 'Try adjusting your search filters'
                  : 'Create your first vocabulary list to get started'
                }
              </p>
              <button
                onClick={() => setShowUploadForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
                Upload Vocabulary
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLists.map(list => (
                <div key={list.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{list.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{list.description}</p>
                      
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
                        

                        
                        {list.is_public && (
                          <span className="px-2 py-1 text-xs rounded-full bg-cyan-100 text-cyan-800">
                            <Globe className="h-3 w-3 inline mr-1" />Public
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {list.word_count} items
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(list.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => onListSelect?.(list)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="View list"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                        title="Edit list"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete list"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500 capitalize">
                      {list.language}
                    </span>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all text-sm">
                        <Plus className="h-3 w-3" />
                        Assign
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inline Upload Form */}
      {showUploadForm && (
        <InlineVocabularyCreator
          onClose={() => setShowUploadForm(false)}
          onSuccess={loadData}
        />
      )}

      {/* Folder Creation Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Folder</h3>
                <button
                  onClick={() => setShowFolderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder Name *
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Spanish Vocabulary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newFolderDescription}
                  onChange={(e) => setNewFolderDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  placeholder="Optional description for this folder..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowFolderModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FolderPlus className="h-4 w-4" />
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
