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
  Grid3X3,
  Sparkles,
  Shuffle,

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
  onMoveToRoot?: () => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
  showActions: boolean;
  isPublic?: boolean;
}

function VocabularyCard({
  list,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onMoveToRoot,
  onDragStart,
  onDragEnd,
  showActions,
  isPublic
}: VocabularyCardProps) {
  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'spanish': return 'from-orange-400 to-red-500';
      case 'french': return 'from-blue-400 to-indigo-500';
      case 'german': return 'from-gray-600 to-yellow-500';
      default: return 'from-purple-400 to-pink-500';
    }
  };

  const getContentTypeColor = (contentType: string) => {
    switch (contentType) {
      case 'words': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800';
      case 'sentences': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800';
      default: return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800';
    }
  };

  return (
    <div
      className="group bg-white rounded-xl border border-gray-100 p-6 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300 cursor-move transform hover:-translate-y-1 hover:border-indigo-200"
      draggable={showActions}
      onDragStart={(e) => {
        if (!showActions) return;
        e.dataTransfer.setData('text/plain', list.id);
        e.dataTransfer.effectAllowed = 'move';
        onDragStart?.(list.id);
      }}
      onDragEnd={() => {
        onDragEnd?.();
      }}
    >
      {/* Color accent bar */}
      <div className={`h-1 bg-gradient-to-r ${getLanguageColor(list.language)} rounded-full mb-4`}></div>

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 bg-gradient-to-r ${getLanguageColor(list.language)} rounded-lg flex items-center justify-center`}>
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-indigo-700 transition-colors">
              {list.name}
            </h3>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{list.description}</p>

          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getContentTypeColor(list.content_type)}`}>
              {list.content_type === 'words' ? (
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Words
                </span>
              ) : list.content_type === 'sentences' ? (
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Sentences
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Shuffle className="h-3 w-3" />
                  Mixed
                </span>
              )}
            </span>

            {isPublic && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800">
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  Public
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 font-medium">
              <span className="inline-flex items-center gap-1">
                <span className="text-indigo-600 font-bold">{list.word_count}</span>
                <span>pairs</span>
              </span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="capitalize font-medium text-gray-700">{list.language}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-1 ml-4">
          <button
            onClick={onView}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 group-hover:shadow-md"
            title="View list"
          >
            <Eye className="h-4 w-4" />
          </button>

          {showActions && onEdit && (
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 group-hover:shadow-md"
              title="Edit list"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}

          {showActions && onDelete && (
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group-hover:shadow-md"
              title="Delete list"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          {isPublic && onDuplicate && (
            <button
              onClick={onDuplicate}
              className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200 group-hover:shadow-md"
              title="Duplicate list"
            >
              <Copy className="h-4 w-4" />
            </button>
          )}

          {showActions && onMoveToRoot && list.folder_id && (
            <button
              onClick={onMoveToRoot}
              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 group-hover:shadow-md"
              title="Move to root folder"
            >
              <ArrowLeft className="h-4 w-4" />
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
  const [draggedListId, setDraggedListId] = useState<string | null>(null);
  const [isRootDropHover, setIsRootDropHover] = useState(false);

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

  // Refresh data when page becomes visible (user returns from another page/tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && vocabularyService && uploadService && user) {
        console.log('📝 [VOCABULARY] Page became visible, refreshing data...');
        loadData();
      }
    };

    const handleFocus = () => {
      if (vocabularyService && uploadService && user) {
        console.log('📝 [VOCABULARY] Window gained focus, refreshing data...');
        loadData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [vocabularyService, uploadService, user]);

  useEffect(() => {
    if (draggedListId) {
      document.body.classList.add('select-none', 'cursor-grabbing');
    } else {
      document.body.classList.remove('select-none', 'cursor-grabbing');
      setIsRootDropHover(false);
      setDragHoverFolder(null);
    }

    return () => {
      document.body.classList.remove('select-none', 'cursor-grabbing');
    };
  }, [draggedListId]);

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
      setPublicLists(publicLists);

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

  const handleMoveToRoot = async (list: EnhancedVocabularyList) => {
    await handleMoveToFolder(list.id, null);
  };

  // Move vocabulary list to folder
  const handleMoveToFolder = async (listId: string, folderId: string | null) => {
    if (!vocabularyService) return;

    try {
      await vocabularyService.updateVocabularyList(listId, { folder_id: folderId ?? null });
      await loadData();
    } catch (error) {
      console.error('Error moving list to folder:', error);
      alert('Failed to move vocabulary list. Please try again.');
    }
  };

  const handleCardDragStart = (listId: string) => {
    setDraggedListId(listId);
  };

  const handleCardDragEnd = () => {
    setDraggedListId(null);
  };

  const handleRootDrop = async (listId?: string) => {
    const targetId = listId || draggedListId;
    if (!targetId) return;

    await handleMoveToFolder(targetId, null);
    setDraggedListId(null);
    setIsRootDropHover(false);
  };

  // Delete folder
  const handleDeleteFolder = async (folderId: string) => {
    if (!uploadService || !vocabularyService) return;
    if (!confirm('Are you sure you want to delete this folder? Lists inside will be moved to the root.')) return;

    try {
      // Move all lists in this folder to root
      const listsInFolder = myLists.filter(list => list.folder_id === folderId);
      for (const list of listsInFolder) {
        await vocabularyService.updateVocabularyList(list.id, { folder_id: null });
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
                <div className="text-sm text-gray-600">Pairs</div>
                <div className="text-2xl font-bold text-gray-900">{selectedList.word_count}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Language</div>
                <div className="text-2xl font-bold text-gray-900 capitalize">{selectedList.language}</div>
              </div>
            </div>

            {/* Vocabulary Pairs */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vocabulary Pairs</h3>
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
                  <p className="text-gray-600">No vocabulary pairs found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/50">
      {draggedListId && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm"></div>
          <div
            className={`pointer-events-auto fixed top-6 left-1/2 -translate-x-1/2 w-[92vw] max-w-3xl rounded-3xl border-2 ${
              isRootDropHover
                ? 'border-green-400 bg-green-100 shadow-2xl scale-105'
                : 'border-indigo-200 bg-white/90 shadow-xl'
            } transition-all duration-300 p-6 flex flex-col items-center gap-3`}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              setIsRootDropHover(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsRootDropHover(false);
            }}
            onDrop={async (e) => {
              e.preventDefault();
              const listId = e.dataTransfer.getData('text/plain') || undefined;
              await handleRootDrop(listId);
            }}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isRootDropHover ? 'bg-green-500 text-white' : 'bg-indigo-100 text-indigo-600'
            } transition-colors duration-300`}>
              <ArrowLeft className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">Drop here to move back to the main collection</p>
              <p className="text-sm text-gray-500">Release to remove this list from its current folder</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-indigo-700 transition-all duration-200 text-sm font-medium mb-6 hover:translate-x-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Link>

          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>

            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-2">
                      Vocabulary Studio
                    </h1>
                    <p className="text-gray-600 text-lg">Create, organize, and manage your language learning collections</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{myLists.length} collections</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{myLists.reduce((acc, list) => acc + list.word_count, 0)} total pairs</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFolderModal(true)}
                    className="flex items-center gap-2 px-4 py-3 text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    <FolderPlus className="h-5 w-5" />
                    New Folder
                  </button>
                  <Link
                    href="/vocabulary/new"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Plus className="h-5 w-5" />
                    Save Collection
                  </Link>
                </div>
              </div>
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

        {/* Enhanced Tab Navigation */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('my-content')}
              className={`flex-1 px-8 py-5 text-center font-semibold transition-all duration-300 relative ${
                activeTab === 'my-content'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
              }`}
            >
              {activeTab === 'my-content' && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <FileText className="h-5 w-5" />
                My Collections
                {myLists.length > 0 && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activeTab === 'my-content'
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {myLists.length}
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('content-library')}
              className={`flex-1 px-8 py-5 text-center font-semibold transition-all duration-300 relative ${
                activeTab === 'content-library'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
              }`}
            >
              {activeTab === 'content-library' && (
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600"></div>
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Globe className="h-5 w-5" />
                Public Library
                {publicLists.length > 0 && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activeTab === 'content-library'
                      ? 'bg-white/20 text-white'
                      : 'bg-teal-100 text-teal-700'
                  }`}>
                    {publicLists.length}
                  </span>
                )}
              </span>
            </button>
          </div>

          {/* Enhanced Filters */}
          <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-white/50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <option value="all">All Languages</option>
                  <option value="french">🇫🇷 French</option>
                  <option value="spanish">🇪🇸 Spanish</option>
                  <option value="german">🇩🇪 German</option>
                </select>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={contentTypeFilter}
                  onChange={(e) => setContentTypeFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <option value="all">All Types</option>
                  <option value="words">Vocabulary</option>
                  <option value="sentences">Sentences</option>
                </select>
              </div>

              <div className="md:col-span-2 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search collections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-20">
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Loading Your Collections</h3>
                <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
                  We're gathering your vocabulary collections and organizing them beautifully
                </p>
                <div className="flex justify-center gap-1 mt-6">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
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
                                  setDraggedListId(null);
                                  setIsRootDropHover(false);
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
                    <div className="text-center py-16">
                      <div className="relative mb-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <BookOpen className="h-12 w-12 text-indigo-600" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Your Vocabulary Journey</h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                        Create your first vocabulary collection and begin building personalized learning materials for your students
                      </p>
                      <Link
                        href="/vocabulary/new"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl hover:scale-105"
                      >
                        <Plus className="h-6 w-6" />
                        Create Your First Collection
                      </Link>
                    </div>
                  ) : filteredMyLists.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Folder className="h-10 w-10 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">No Collections Found</h3>
                      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                        {currentFolder ? 'This folder is empty. Try creating a new collection or moving items here.' : 'All your collections are organized in folders. Try adjusting your filters.'}
                      </p>
                      {!currentFolder && (
                        <Link
                          href="/vocabulary/new"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                        >
                          <Plus className="h-5 w-5" />
                          Create New Collection
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredMyLists.map(list => (
                        <VocabularyCard
                          key={list.id}
                          list={list}
                          onView={() => setSelectedList(list)}
                          onEdit={() => handleEditList(list)}
                          onDelete={() => handleDeleteList(list.id)}
                          onMoveToRoot={() => handleMoveToRoot(list)}
                          onDragStart={handleCardDragStart}
                          onDragEnd={handleCardDragEnd}
                          showActions={true}
                        />
                      ))}
                    </div>
                  )
                ) : (
                  filteredPublicLists.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Globe className="h-10 w-10 text-teal-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">No Public Collections Found</h3>
                      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                        Try adjusting your search terms or filters to discover more public vocabulary collections
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Enhanced Folder Creation Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-white/20 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FolderPlus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Create New Folder</h3>
                    <p className="text-sm text-gray-600">Organize your vocabulary collections</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFolderModal(false)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Description <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={newFolderDescription}
                  onChange={(e) => setNewFolderDescription(e.target.value)}
                  placeholder="Add a description for this folder..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200 shadow-sm resize-none"
                />
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button
                onClick={() => setShowFolderModal(false)}
                className="px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                <FolderPlus className="h-5 w-5" />
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}