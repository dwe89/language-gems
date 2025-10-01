'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Play,
  Eye,
  EyeOff,
  Upload,
  Download,
  RefreshCw,
  BookOpen,
  Target,
  Clock,
  Users,
  BarChart3,
  Settings,
  ExternalLink,
  Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, supabaseBrowser } from '@/components/auth/AuthProvider';
import { VOCABULARY_CATEGORIES } from '@/components/games/ModernCategorySelector';
import { GRAMMAR_CATEGORIES } from '@/lib/grammar-categories';
import VideoForm from '@/components/admin/VideoForm';
import SimpleVideoEditModal from '@/components/admin/SimpleVideoEditModal';
import BulkVideoImport from '@/components/admin/BulkVideoImport';
import VideoContentManagerModal from '@/components/admin/VideoContentManagerModal';
import Link from 'next/link';

interface YouTubeVideo {
  id: string;
  title: string;
  youtube_id: string;
  language: string;
  level: string;
  theme?: string;
  topic?: string;
  subtopic?: string;
  description?: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  vocabulary_count?: number;
  view_count?: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface VideoStats {
  total: number;
  active: number;
  inactive: number;
  byLanguage: Record<string, number>;
  byTheme: Record<string, number>;
  byLevel: Record<string, number>;
}

export default function VideoManagementPage() {
  console.log('🎬 VideoManagementPage: Component is rendering!');

  const { user, isAdmin } = useAuth();

  console.log('VideoManagementPage: Auth state:', { user: !!user, isAdmin });
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<YouTubeVideo[]>([]);
  const [stats, setStats] = useState<VideoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit' | 'stats' | 'bulk'>('list');
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [editingVideo, setEditingVideo] = useState<YouTubeVideo | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [contentModalVideo, setContentModalVideo] = useState<YouTubeVideo | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [themeFilter, setThemeFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    console.log('VideoManagementPage: useEffect triggered, isAdmin:', isAdmin);
    if (isAdmin) {
      console.log('VideoManagementPage: Admin confirmed, fetching videos...');
      fetchVideos();
      fetchStats();
    } else {
      console.log('VideoManagementPage: Not admin, skipping fetch');
    }
  }, [isAdmin]);

  useEffect(() => {
    filterVideos();
  }, [videos, searchQuery, languageFilter, themeFilter, levelFilter, statusFilter]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      console.log('Fetching videos from database...');
      const { data, error } = await supabaseBrowser
        .from('youtube_videos')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Fetch videos result:', { data: data?.length, error });

      if (error) throw error;
      setVideos(data || []);
      console.log('Videos loaded:', data?.length || 0);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabaseBrowser
        .from('youtube_videos')
        .select('language, theme, level, is_active');

      if (error) throw error;

      const stats: VideoStats = {
        total: data.length,
        active: data.filter(v => v.is_active).length,
        inactive: data.filter(v => !v.is_active).length,
        byLanguage: {},
        byTheme: {},
        byLevel: {}
      };

      data.forEach(video => {
        // Language stats
        stats.byLanguage[video.language] = (stats.byLanguage[video.language] || 0) + 1;

        // Theme stats
        if (video.theme) {
          stats.byTheme[video.theme] = (stats.byTheme[video.theme] || 0) + 1;
        }

        // Level stats
        if (video.level) {
          stats.byLevel[video.level] = (stats.byLevel[video.level] || 0) + 1;
        }
      });

      setStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filterVideos = () => {
    let filtered = videos;

    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (languageFilter !== 'all') {
      filtered = filtered.filter(video => video.language === languageFilter);
    }

    if (themeFilter !== 'all') {
      filtered = filtered.filter(video => video.theme === themeFilter);
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(video => video.level === levelFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(video =>
        statusFilter === 'active' ? video.is_active : !video.is_active
      );
    }

    setFilteredVideos(filtered);
  };

  const toggleVideoStatus = async (videoId: string, currentStatus: boolean) => {
    try {
      console.log('Toggling video status:', { videoId, currentStatus, newStatus: !currentStatus });
      const { data, error } = await supabaseBrowser
        .from('youtube_videos')
        .update({ is_active: !currentStatus })
        .eq('id', videoId)
        .select();

      console.log('Toggle result:', { data, error });

      if (error) {
        console.error('Toggle error details:', error);
        alert(`Error updating video status: ${error.message}`);
        throw error;
      }

      setVideos(videos.map(video =>
        video.id === videoId
          ? { ...video, is_active: !currentStatus }
          : video
      ));

      fetchStats(); // Refresh stats
      console.log('Video status updated successfully');
    } catch (error) {
      console.error('Error updating video status:', error);
      alert(`Failed to update video status: ${error}`);
    }
  };

  const deleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('Attempting to delete video with ID:', videoId);
      const { data, error } = await supabaseBrowser
        .from('youtube_videos')
        .delete()
        .eq('id', videoId)
        .select();

      console.log('Delete result:', { data, error });

      if (error) {
        console.error('Delete error details:', error);
        alert(`Error deleting video: ${error.message}`);
        throw error;
      }

      console.log('Video deleted successfully, refreshing list...');
      setVideos(videos.filter(video => video.id !== videoId));
      fetchStats(); // Refresh stats
      alert('Video deleted successfully!');
    } catch (error) {
      console.error('Error deleting video:', error);
      alert(`Failed to delete video: ${error}`);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleEditVideo = (video: YouTubeVideo) => {
    console.log('Opening edit modal for video:', video.id);
    setEditingVideo(video);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    console.log('Closing edit modal');
    setShowEditModal(false);
    setEditingVideo(null);
  };

  const openContentModal = (video: YouTubeVideo) => {
    setContentModalVideo(video);
    setShowContentModal(true);
  };

  const closeContentModal = () => {
    setShowContentModal(false);
    setContentModalVideo(null);
  };

  const handleContentUpdated = () => {
    fetchVideos();
    fetchStats();
  };

  const handleSaveVideo = () => {
    console.log('Video saved, refreshing list');
    fetchVideos(); // Refresh the video list
    fetchStats(); // Refresh stats
  };

  const getCategoryDisplayName = (theme: string, topic: string) => {
    const categories = theme === 'vocabulary' ? VOCABULARY_CATEGORIES : GRAMMAR_CATEGORIES;
    const category = categories.find(cat => cat.id === topic);
    return category?.displayName || topic;
  };

  const getSubcategoryDisplayName = (theme: string, topic: string, subtopic: string) => {
    const categories = theme === 'vocabulary' ? VOCABULARY_CATEGORIES : GRAMMAR_CATEGORIES;
    const category = categories.find(cat => cat.id === topic);
    const subcategory = category?.subcategories.find(sub => sub.id === subtopic);
    return subcategory?.displayName || subtopic;
  };

  // Test database connection
  const testDatabaseConnection = async () => {
    try {
      console.log('Testing database connection...');
      const { data, error } = await supabaseBrowser
        .from('youtube_videos')
        .select('id, title')
        .limit(5);

      console.log('Database test result:', { data, error });
      alert('Database test: ' + (error ? `Error: ${error.message}` : `Success: Found ${data?.length || 0} videos`));
    } catch (error) {
      console.error('Database test failed:', error);
      alert('Database test failed: ' + error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600">You need admin privileges to access video management.</p>
        <Button onClick={testDatabaseConnection} className="mt-4">
          Test Database Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Video Management</h1>
          <p className="text-slate-600">Manage YouTube videos, categories, and content organization</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={testDatabaseConnection}
            variant="outline"
            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          >
            <Database className="w-4 h-4 mr-2" />
            Test DB
          </Button>
          <Button
            onClick={() => setCurrentView('add')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Video
          </Button>
          <Button
            onClick={() => setCurrentView('bulk')}
            className="bg-green-600 hover:bg-green-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
          <Button
            onClick={() => setCurrentView('stats')}
            variant="outline"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Statistics
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)} className="mb-6">
        <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <TabsTrigger
            value="list"
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-50"
          >
            <Play className="w-4 h-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger
            value="add"
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
            Add New
          </TabsTrigger>
          <TabsTrigger
            value="bulk"
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            Bulk Import
          </TabsTrigger>

          <TabsTrigger
            value="stats"
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-50"
          >
            <BarChart3 className="w-4 h-4" />
            Statistics
          </TabsTrigger>
        </TabsList>


      {/* Content */}
      <TabsContent value="list" className="mt-0 min-h-[400px]">
        <div className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search videos..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Select value={languageFilter} onValueChange={setLanguageFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Languages</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="it">Italian</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={themeFilter} onValueChange={setThemeFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Themes</SelectItem>
                          <SelectItem value="vocabulary">Vocabulary</SelectItem>
                          <SelectItem value="grammar">Grammar</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={levelFilter} onValueChange={setLevelFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        onClick={fetchVideos}
                        variant="outline"
                        size="sm"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Videos List */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading videos...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredVideos.map((video) => (
                    <Card key={video.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Thumbnail */}
                          <div className="flex-shrink-0">
                            <img
                              src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                              alt={video.title}
                              className="w-32 h-20 object-cover rounded-lg"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-lg text-gray-900 truncate">
                                {video.title}
                              </h3>
                              <div className="flex items-center gap-2 ml-4">
                                <Badge variant={video.is_active ? "default" : "secondary"}>
                                  {video.is_active ? "Active" : "Inactive"}
                                </Badge>
                                {video.is_featured && (
                                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {video.description && (
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {video.description}
                              </p>
                            )}

                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatDuration(video.duration_seconds)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {video.view_count || 0} views
                              </span>
                              {video.vocabulary_count && (
                                <span className="flex items-center gap-1">
                                  <BookOpen className="w-4 h-4" />
                                  {video.vocabulary_count} words
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                              <Badge variant="outline" className="text-xs">
                                {video.language.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {video.level}
                              </Badge>
                              {video.theme && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    video.theme === 'vocabulary'
                                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                                      : 'bg-green-50 text-green-700 border-green-200'
                                  }`}
                                >
                                  {video.theme === 'vocabulary' ? (
                                    <BookOpen className="w-3 h-3 mr-1" />
                                  ) : (
                                    <Target className="w-3 h-3 mr-1" />
                                  )}
                                  {video.theme}
                                </Badge>
                              )}
                              {video.topic && (
                                <Badge variant="outline" className="text-xs">
                                  {getCategoryDisplayName(video.theme || '', video.topic)}
                                </Badge>
                              )}
                              {video.subtopic && video.subtopic !== 'general' && (
                                <Badge variant="outline" className="text-xs bg-gray-50">
                                  {getSubcategoryDisplayName(video.theme || '', video.topic || '', video.subtopic)}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-400">
                                Added {new Date(video.created_at).toLocaleDateString()}
                              </div>

                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/songs/${video.language}`}
                                  target="_blank"
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Link>
                                <Button
                                  onClick={() => openContentModal(video)}
                                  variant="outline"
                                  size="sm"
                                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                  <BookOpen className="w-4 h-4 mr-1" />
                                  Manage Content
                                </Button>
                                <Button
                                  onClick={() => handleEditVideo(video)}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => toggleVideoStatus(video.id, video.is_active)}
                                  variant="outline"
                                  size="sm"
                                  className={video.is_active ? "text-orange-600" : "text-green-600"}
                                >
                                  {video.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                                <Button
                                  onClick={() => deleteVideo(video.id)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredVideos.length === 0 && (
                    <div className="text-center py-12">
                      <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No videos found</h3>
                      <p className="text-gray-600">
                        {searchQuery || languageFilter !== 'all' || themeFilter !== 'all' || levelFilter !== 'all' || statusFilter !== 'all'
                          ? 'Try adjusting your filters'
                          : 'Add your first video to get started'
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
        </div>
      </TabsContent>

      <TabsContent value="add" className="mt-0 min-h-[400px]">
        <VideoForm
          onSave={() => {
            fetchVideos();
            fetchStats();
            setCurrentView('list');
          }}
          onCancel={() => setCurrentView('list')}
        />
      </TabsContent>

      <TabsContent value="bulk" className="mt-0 min-h-[400px]">
        <BulkVideoImport
          onComplete={() => {
            fetchVideos();
            fetchStats();
            setCurrentView('list');
          }}
          onCancel={() => setCurrentView('list')}
        />
      </TabsContent>

      <TabsContent value="edit" className="mt-0 min-h-[400px]">
        {selectedVideo ? (
          <VideoForm
            video={selectedVideo}
            onSave={() => {
              fetchVideos();
              fetchStats();
              setCurrentView('list');
              setSelectedVideo(null);
            }}
            onCancel={() => {
              setCurrentView('list');
              setSelectedVideo(null);
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60 p-12 text-center text-slate-500">
            Select a video from the list to edit its details.
          </div>
        )}
      </TabsContent>

      <TabsContent value="stats" className="mt-0 min-h-[400px]">
        {stats && (
        <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Videos</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                      </div>
                      <Play className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Videos</p>
                        <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                      </div>
                      <Eye className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Inactive Videos</p>
                        <p className="text-3xl font-bold text-orange-600">{stats.inactive}</p>
                      </div>
                      <EyeOff className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      By Language
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(stats.byLanguage).map(([language, count]) => (
                        <div key={language} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{language.toUpperCase()}</span>
                          <span className="text-sm text-gray-600">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      By Theme
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(stats.byTheme).map(([theme, count]) => (
                        <div key={theme} className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">{theme}</span>
                          <span className="text-sm text-gray-600">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      By Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(stats.byLevel).map(([level, count]) => (
                        <div key={level} className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">{level}</span>
                          <span className="text-sm text-gray-600">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
        </div>
        )}
      </TabsContent>
      </Tabs>

      {/* Simple Edit Modal */}
      <SimpleVideoEditModal
        video={editingVideo}
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSave={handleSaveVideo}
      />

      <VideoContentManagerModal
        video={contentModalVideo}
        isOpen={showContentModal}
        onClose={closeContentModal}
        onContentUpdated={handleContentUpdated}
      />
    </div>
  );
}
