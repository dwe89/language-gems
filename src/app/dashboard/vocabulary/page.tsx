'use client';

// Skip static generation for this page
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  BookOpen,
  MessageSquare,
  FileText,
  Edit,
  Trash2,
  Eye,
  Globe,
  Copy,
  Folder,
  FolderOpen,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Play,
  X,
  ArrowLeft,

} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useSupabase } from '../../../components/supabase/SupabaseProvider';
import { EnhancedVocabularyService, EnhancedVocabularyList } from '../../../services/enhancedVocabularyService';
import { VocabularyUploadService, VocabularyFolder } from '../../../services/vocabularyUploadService';

interface VocabularyCardProps {
  list: EnhancedVocabularyList;
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  showActions: boolean;
  isPublic?: boolean;
}

function VocabularyCard({ list, onView, onEdit, onDelete, onDuplicate, showActions, isPublic }: VocabularyCardProps) {
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-move"
      draggable={showActions}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', list.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 mb-1 truncate">{list.name}</h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-1">{list.description}</p>

          <div className="flex items-center gap-1 mb-2">
            <span className={`px-1.5 py-0.5 text-xs rounded ${
              list.content_type === 'words' ? 'bg-blue-100 text-blue-700' :
              list.content_type === 'sentences' ? 'bg-green-100 text-green-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {list.content_type === 'words' ? 'Words' :
               list.content_type === 'sentences' ? 'Sentences' : 'Mixed'}
            </span>

            {isPublic && (
              <span className="px-1.5 py-0.5 text-xs rounded bg-cyan-100 text-cyan-700">
                Public
              </span>
            )}
          </div>

          <div className="text-xs text-gray-500">
            {list.word_count} items • {list.language}
          </div>
        </div>

        <div className="flex gap-1 ml-2">
          <button
            onClick={onView}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all"
            title="View list"
          >
            <Eye className="h-3 w-3" />
          </button>

          {showActions && onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-all"
              title="Edit list"
            >
              <Edit className="h-3 w-3" />
            </button>
          )}

          {showActions && onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
              title="Delete list"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}

          {isPublic && onDuplicate && (
            <button
              onClick={onDuplicate}
              className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-all"
              title="Duplicate list"
            >
              <Copy className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VocabularyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { supabase } = useSupabase();

  const [activeTab, setActiveTab] = useState<'my-content' | 'content-library'>('my-content');
  const [selectedList, setSelectedList] = useState<EnhancedVocabularyList | null>(null);
  const [vocabularyService, setVocabularyService] = useState<EnhancedVocabularyService | null>(null);
  const [uploadService, setUploadService] = useState<VocabularyUploadService | null>(null);
  const [myLists, setMyLists] = useState<EnhancedVocabularyList[]>([]);
  const [publicLists, setPublicLists] = useState<EnhancedVocabularyList[]>([]);
  const [folders, setFolders] = useState<VocabularyFolder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');

  // Folder modal state
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [dragHoverFolder, setDragHoverFolder] = useState<string | null>(null);

  // Initialize services
  useEffect(() => {
    if (supabase) {
      setVocabularyService(new EnhancedVocabularyService(supabase));
      setUploadService(new VocabularyUploadService(supabase));
    }
  }, [supabase]);

  // Load data
  useEffect(() => {
    if (vocabularyService && uploadService && user) {
      loadData();
    }
  }, [vocabularyService, uploadService, user]);

  const loadData = async () => {
    if (!vocabularyService || !uploadService || !user) return;

    setLoading(true);
    try {
      // Load user's vocabulary lists
      const userLists = await vocabularyService.getVocabularyLists({
        teacher_id: user.id
      });
      setMyLists(userLists);

      // Load public vocabulary lists
      const publicLists = await vocabularyService.getVocabularyLists({
        is_public: true
      });
      setPublicLists(publicLists.filter(list => list.teacher_id !== user.id));

      // Load folders
      const folderData = await uploadService.getFolders(user.id);
      setFolders(folderData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!confirm('Are you sure you want to delete this vocabulary list?')) return;

    try {
      await vocabularyService?.deleteVocabularyList(listId);
      await loadData();
    } catch (error) {
      console.error('Error deleting list:', error);
      alert('Failed to delete vocabulary list. Please try again.');
    }
  };

  const handleEditList = (list: EnhancedVocabularyList) => {
    // Navigate to edit page (we'll implement this)
    router.push(`/vocabulary/edit/${list.id}`);
  };

  const handleDuplicateList = async (list: EnhancedVocabularyList) => {
    if (!vocabularyService || !user) return;

    try {
      // Create a copy of the list for the current user
      const duplicatedList = {
        ...list,
        name: `${list.name} (Copy)`,
        teacher_id: user.id,
        is_public: false
      };

      // Remove the ID so it creates a new record
      delete (duplicatedList as any).id;

      await vocabularyService.createVocabularyList(duplicatedList, list.items || []);
      await loadData();
      alert('Vocabulary list duplicated successfully!');
    } catch (error) {
      console.error('Error duplicating list:', error);
      alert('Failed to duplicate vocabulary list. Please try again.');
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

  // Get current folder info
  const getCurrentFolder = () => {
    return folders.find(f => f.id === currentFolder);
  };

  // Get subfolders for current folder
  const getSubfolders = () => {
    return folders.filter(f => f.parent_folder_id === currentFolder);
  };

  // Get lists in a specific folder
  const getListsInFolder = (folderId: string) => {
    return myLists.filter(list => list.folder_id === folderId);
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

  // Move vocabulary list to folder
  const handleMoveToFolder = async (listId: string, folderId: string | null) => {
    if (!vocabularyService) return;

    try {
      await vocabularyService.updateVocabularyList(listId, { folder_id: folderId || undefined });
      await loadData();
    } catch (error) {
      console.error('Error moving list to folder:', error);
      alert('Failed to move vocabulary list. Please try again.');
    }
  };

  // Delete folder
  const handleDeleteFolder = async (folderId: string) => {
    if (!uploadService || !vocabularyService) return;
    if (!confirm('Are you sure you want to delete this folder? Lists inside will be moved to the root.')) return;

    try {
      // Move all lists in this folder to root
      const listsInFolder = myLists.filter(list => list.folder_id === folderId);
      for (const list of listsInFolder) {
        await vocabularyService.updateVocabularyList(list.id, { folder_id: undefined });
      }

      // Delete the folder from database
      await supabase
        .from('vocabulary_folders')
        .delete()
        .eq('id', folderId);

      await loadData();
    } catch (error) {
      console.error('Error deleting folder:', error);
      alert('Failed to delete folder. Please try again.');
    }
  };

  // Toggle folder expansion
  const toggleFolderExpansion = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  // Filter lists based on search and filters
  const filterLists = (lists: EnhancedVocabularyList[]) => {
    return lists.filter(list => {
      // Folder filter
      if (currentFolder && list.folder_id !== currentFolder) return false;
      if (!currentFolder && list.folder_id) return false;

      const matchesSearch = list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           list.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLanguage = languageFilter === 'all' || list.language === languageFilter;
      const matchesContentType = contentTypeFilter === 'all' || list.content_type === contentTypeFilter;

      return matchesSearch && matchesLanguage && matchesContentType;
    });
  };

  const filteredMyLists = filterLists(myLists);
  const filteredPublicLists = filterLists(publicLists);

  // If viewing a specific list
  if (selectedList) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedList.name}</h2>
                <p className="text-gray-600 mt-1">{selectedList.description}</p>
              </div>
              <button
                onClick={() => setSelectedList(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to Lists
              </button>
            </div>

            {/* List Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Items</div>
                <div className="text-2xl font-bold text-gray-900">{selectedList.word_count}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Language</div>
                <div className="text-2xl font-bold text-gray-900 capitalize">{selectedList.language}</div>
              </div>
            </div>

            {/* Vocabulary Items */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vocabulary Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedList.items?.map((item: any, index: number) => (
                  <div key={index} className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-indigo-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <div className="flex gap-1">
                        <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-indigo-600 rounded transition-all">
                          <Eye className="h-3 w-3" />
                        </button>
                        <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-green-600 rounded transition-all">
                          <Play className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-semibold text-gray-900 text-lg">{item.term}</div>
                      <div className="text-gray-600 border-t pt-2">{item.translation}</div>
                      {item.context_sentence && (
                        <div className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
                          "{item.context_sentence}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {(!selectedList.items || selectedList.items.length === 0) && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No vocabulary items found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Vocabulary Management
                </h1>
                <p className="text-gray-600">Create and manage your vocabulary collections</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFolderModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FolderPlus className="h-4 w-4" />
                New Folder
              </button>
              <Link
                href="/vocabulary/new"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5" />
                Create New 
              </Link>
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        {currentFolder && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
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

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab('my-content')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'my-content'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              My Content
            </button>
            <button
              onClick={() => setActiveTab('content-library')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'content-library'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Public Content
            </button>

          </div>

          {/* Filters */}
          <div className="p-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Languages</option>
                <option value="french">French</option>
                <option value="spanish">Spanish</option>
                <option value="german">German</option>
              </select>

              <select
                value={contentTypeFilter}
                onChange={(e) => setContentTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="words">Vocabulary</option>
                <option value="sentences">Sentences</option>
              </select>

              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading vocabulary lists...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Folders Sidebar - Only show for My Content */}
                {activeTab === 'my-content' && (
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Folders</h3>
                        <span className="text-xs text-gray-500">{myLists.length} total lists</span>
                      </div>

                      {/* Root folder drop zone */}
                      <div
                        className={`mb-4 p-3 border-2 border-dashed rounded-lg text-center text-sm transition-all ${
                          dragHoverFolder === 'root'
                            ? 'border-green-400 bg-green-50 text-green-700'
                            : 'border-gray-300 text-gray-500 hover:border-gray-400'
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                          setDragHoverFolder('root');
                        }}
                        onDragLeave={() => setDragHoverFolder(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          const listId = e.dataTransfer.getData('text/plain');
                          handleMoveToFolder(listId, null);
                          setDragHoverFolder(null);
                        }}
                      >
                        {dragHoverFolder === 'root' ? (
                          <div className="flex items-center justify-center gap-2">
                            <Plus className="h-4 w-4 text-green-600" />
                            <span className="font-medium">Drop to move to root</span>
                          </div>
                        ) : (
                          'Drop here to remove from folders'
                        )}
                      </div>

                      <div className="space-y-2">
                        {getSubfolders().map(folder => {
                          const listsInFolder = getListsInFolder(folder.id);
                          const isExpanded = expandedFolders.has(folder.id);
                          const isDragHover = dragHoverFolder === folder.id;

                          return (
                            <div key={folder.id} className="group">
                              <div
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                                  isDragHover
                                    ? 'bg-green-50 border-2 border-green-300'
                                    : 'hover:bg-gray-50 border-2 border-transparent'
                                }`}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  e.dataTransfer.dropEffect = 'move';
                                  setDragHoverFolder(folder.id);
                                }}
                                onDragLeave={() => setDragHoverFolder(null)}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  const listId = e.dataTransfer.getData('text/plain');
                                  handleMoveToFolder(listId, folder.id);
                                  setDragHoverFolder(null);
                                }}
                              >
                                <button
                                  onClick={() => toggleFolderExpansion(folder.id)}
                                  className="p-1 hover:bg-gray-200 rounded"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </button>

                                <button
                                  onClick={() => setCurrentFolder(folder.id)}
                                  className="flex items-center gap-2 flex-1 text-left"
                                >
                                  {isExpanded ? (
                                    <FolderOpen className="h-5 w-5 text-blue-500" />
                                  ) : (
                                    <Folder className="h-5 w-5 text-gray-400" />
                                  )}
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">{folder.name}</div>
                                    <div className="text-xs text-gray-500">{listsInFolder.length} lists</div>
                                  </div>
                                </button>

                                {isDragHover && (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <Plus className="h-4 w-4" />
                                    <span className="text-sm font-medium">Drop here</span>
                                  </div>
                                )}

                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingFolder(folder.id);
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded"
                                    title="Edit folder"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteFolder(folder.id);
                                    }}
                                    className="p-1 hover:bg-red-100 text-red-600 rounded"
                                    title="Delete folder"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Expanded folder content */}
                              {isExpanded && (
                                <div className="ml-8 mt-2 space-y-1">
                                  {listsInFolder.length === 0 ? (
                                    <div className="text-xs text-gray-400 italic py-1">Empty folder</div>
                                  ) : (
                                    listsInFolder.map(list => (
                                      <div
                                        key={list.id}
                                        className="flex items-center gap-2 px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
                                      >
                                        <BookOpen className="h-3 w-3" />
                                        <span className="truncate">{list.name}</span>
                                        <span className="text-xs text-gray-400">({list.word_count})</span>
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Content */}
                <div className={activeTab === 'my-content' ? 'lg:col-span-3' : 'lg:col-span-5'}>
                  {activeTab === 'my-content' ? (
                  filteredMyLists.length === 0 && myLists.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No vocabulary lists yet</h3>
                      <p className="text-gray-600 mb-6">Create your first vocabulary collection to get started</p>
                      <Link
                        href="/vocabulary/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Create New Content
                      </Link>
                    </div>
                  ) : filteredMyLists.length === 0 ? (
                    <div className="text-center py-12">
                      <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No lists in this view</h3>
                      <p className="text-gray-600 mb-6">
                        {currentFolder ? 'This folder is empty' : 'All your lists are organized in folders'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredMyLists.map(list => (
                        <VocabularyCard
                          key={list.id}
                          list={list}
                          onView={() => setSelectedList(list)}
                          onEdit={() => handleEditList(list)}
                          onDelete={() => handleDeleteList(list.id)}
                          showActions={true}
                        />
                      ))}
                    </div>
                  )
                ) : (
                  filteredPublicLists.length === 0 ? (
                    <div className="text-center py-12">
                      <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No public content found</h3>
                      <p className="text-gray-600">Try adjusting your search or filters</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredPublicLists.map(list => (
                        <VocabularyCard
                          key={list.id}
                          list={list}
                          onView={() => setSelectedList(list)}
                          onDuplicate={() => handleDuplicateList(list)}
                          showActions={false}
                          isPublic={true}
                        />
                      ))}
                    </div>
                  )
                )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
                  Folder Name
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newFolderDescription}
                  onChange={(e) => setNewFolderDescription(e.target.value)}
                  placeholder="Enter folder description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
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
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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