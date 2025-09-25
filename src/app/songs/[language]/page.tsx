'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  BookOpen, 
  Gamepad2, 
  Clock, 
  Star, 
  ArrowLeft,
  Search,
  Filter,
  Trophy,
  Target,
  Volume2,
  Users,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FlagIcon from '@/components/ui/FlagIcon';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSupabase } from '@/hooks/useSupabase';
import { VOCABULARY_CATEGORIES } from '@/components/games/ModernCategorySelector';
import { GRAMMAR_CATEGORIES } from '@/lib/grammar-categories';

import SongCategoryFilter from '@/components/songs/SongCategoryFilter';

interface YouTubeVideo {
  id: string;
  title: string;
  youtube_id: string;
  language: string;
  level: string;
  description: string;
  thumbnail_url: string;
  duration_seconds: number;
  vocabulary_count: number;
  view_count: number;
  is_featured: boolean;
  created_at: string;
  theme?: string;
  topic?: string;
  subtopic?: string;
}

interface VideoProgress {
  video_id: string;
  progress_percentage: number;
  completed: boolean;
  last_watched_at: string;
}

export default function LanguageSongsPage() {
  const params = useParams();
  const router = useRouter();
  const language = params.language as string;
  
  const [allVideos, setAllVideos] = useState<YouTubeVideo[]>([]); // Store all videos
  const [progress, setProgress] = useState<Record<string, VideoProgress>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [activeTab, setActiveTab] = useState('videos');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>('all');
  const [themeFilter, setThemeFilter] = useState<string>('all'); // 'vocabulary' or 'grammar'
  const [examBoardFilter, setExamBoardFilter] = useState<string>('all'); // 'AQA' or 'edexcel'
  const [tierFilter, setTierFilter] = useState<string>('all'); // 'foundation' or 'higher'

  const { user } = useAuth();
  const { supabase } = useSupabase();

  // Only re-fetch when language, user, or level changes - not for theme/category filters
  useEffect(() => {
    if (language) {
      fetchAllVideos();
      if (user) {
        fetchProgress();
      }
    }
  }, [language, user, levelFilter, sortBy, examBoardFilter, tierFilter]);

  // Set up real-time subscription for video changes
  useEffect(() => {
    if (!language) return;

    console.log(`Setting up real-time subscription for ${language} videos...`);

    const channel = supabase
      .channel('youtube_videos_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'youtube_videos',
          filter: `language=eq.${language}`
        },
        (payload) => {
          console.log('Video change detected:', payload);
          
          // Refresh videos when any change occurs
          setTimeout(() => {
            fetchAllVideos();
          }, 500); // Small delay to ensure DB consistency
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    // Fallback: Poll for changes every 30 seconds
    const pollInterval = setInterval(() => {
      console.log('Polling for video changes...');
      fetchAllVideos();
    }, 30000);

    return () => {
      console.log('Cleaning up video subscription...');
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [language]);

  const fetchAllVideos = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('youtube_videos')
        .select('*')
        .eq('is_active', true)
        .eq('language', language);

      // Apply level filter (this still requires server-side filtering)
      if (levelFilter !== 'all') {
        if (levelFilter === 'KS4') {
          query = query.eq('curriculum_level', 'KS4');

          // Apply KS4-specific filters
          if (examBoardFilter !== 'all') {
            query = query.eq('exam_board_code', examBoardFilter);
          }
          if (tierFilter !== 'all') {
            query = query.eq('tier', tierFilter);
          }
        } else {
          query = query.eq('level', levelFilter);
        }
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'popular':
          query = query.order('view_count', { ascending: false });
          break;
        case 'featured':
          query = query.order('is_featured', { ascending: false });
          break;
        case 'vocabulary':
          query = query.order('vocabulary_count', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching videos:', error);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} videos for ${language}:`, {
        timestamp: new Date().toISOString(),
        query: query.toString(),
        videoIds: data?.map(v => v.id).slice(0, 5) // Show first 5 IDs for debugging
      });
      setAllVideos(data || []);
      
    } catch (error) {
      console.error('Error fetching videos:', error);
      // Don't clear existing videos on error, just show an error state
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh function
  const refreshVideos = async () => {
    console.log('Manually refreshing videos...');
    await fetchAllVideos();
    if (user) {
      await fetchProgress();
    }
    console.log('Videos refreshed successfully');
  };

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('video_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const progressMap: Record<string, VideoProgress> = {};
      data?.forEach(p => {
        progressMap[p.video_id] = p;
      });
      setProgress(progressMap);
      
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  // Client-side filtering to avoid loading flash
  const getFilteredVideos = () => {
    if (!allVideos || allVideos.length === 0) return [];
    
    let filtered = [...allVideos];

    // Apply theme filter
    if (themeFilter !== 'all') {
      filtered = filtered.filter(video => video && video.theme === themeFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(video => video && video.topic === categoryFilter);
    }

    // Apply subcategory filter
    if (subcategoryFilter !== 'all') {
      filtered = filtered.filter(video => video && video.subtopic === subcategoryFilter);
    }

    return filtered.filter(video => video && video.id); // Ensure all videos have required properties
  };

  // Get filtered videos based on current filters
  const videos = getFilteredVideos();

  // Apply search filter on top of other filters
  const filteredVideos = videos.filter(video => {
    if (!video) return false;
    
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const title = video.title?.toLowerCase() || '';
      const description = video.description?.toLowerCase() || '';
      
      return title.includes(query) || description.includes(query);
    }
    return true;
  });

  const getLanguageInfo = (lang: string) => {
    const info = {
      es: { name: 'Spanish', flag: 'ES', color: 'from-red-500 to-yellow-500' },
      fr: { name: 'French', flag: 'FR', color: 'from-blue-500 to-red-500' },
      de: { name: 'German', flag: 'DE', color: 'from-red-600 to-yellow-400' }
    };
    return info[lang as keyof typeof info] || { name: lang, flag: 'GB', color: 'from-gray-500 to-gray-600' };
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handler for theme filter changes - reset category filter when theme changes
  const handleThemeFilterChange = (value: string) => {
    setThemeFilter(value);
    setCategoryFilter('all'); // Reset category filter when theme changes
    setSubcategoryFilter('all'); // Reset subcategory filter when theme changes
  };

  // Handler for category filter changes - reset subcategory filter when category changes
  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setSubcategoryFilter('all'); // Reset subcategory filter when category changes
  };

  // Handler for level filter changes - reset KS4-specific filters when level changes
  const handleLevelFilterChange = (value: string) => {
    setLevelFilter(value);
    if (value !== 'KS4') {
      setExamBoardFilter('all');
      setTierFilter('all');
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setLevelFilter('all');
    setThemeFilter('all');
    setCategoryFilter('all');
    setSubcategoryFilter('all');
    setExamBoardFilter('all');
    setTierFilter('all');
    setSortBy('newest');
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (levelFilter !== 'all') count++;
    if (themeFilter !== 'all') count++;
    if (categoryFilter !== 'all') count++;
    if (subcategoryFilter !== 'all') count++;
    if (examBoardFilter !== 'all') count++;
    if (tierFilter !== 'all') count++;
    if (sortBy !== 'newest') count++;
    return count;
  };

  const getLevelColor = (level: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const langInfo = getLanguageInfo(language);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading {langInfo.name} content...</p>
        </div>
      </div>
    );
  }

  // Don't render if no videos to prevent hydration mismatch
  if (!allVideos || allVideos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>No videos available for {langInfo.name}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className={`bg-gradient-to-r ${langInfo.color} rounded-lg p-3 mr-4`}>
              <FlagIcon countryCode={langInfo.flag} className="w-8 h-8" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold">{langInfo.name} Songs</h1>
              <p className="text-gray-600">Learn {langInfo.name} through music and videos</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <div className="flex items-center">
                <Play className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium">{videos.length} Videos</span>
              </div>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium">{videos.reduce((sum: number, v: YouTubeVideo) => sum + (v.vocabulary_count || 0), 0)} Words</span>
              </div>
            </div>
            {user && (
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                <div className="flex items-center">
                  <Trophy className="w-4 h-4 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium">{Object.values(progress).filter(p => p.completed).length} Completed</span>
                </div>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={refreshVideos}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <TabsTrigger
              value="videos"
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-50"
            >
              <Play className="w-4 h-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger
              value="vocabulary"
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-50"
            >
              <BookOpen className="w-4 h-4" />
              Vocabulary
            </TabsTrigger>
            <TabsTrigger
              value="games"
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-50"
            >
              <Gamepad2 className="w-4 h-4" />
              Games
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-50"
            >
              <Trophy className="w-4 h-4" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-6">
            {/* New Category Filter Component */}
            <div className="mb-8">
              <SongCategoryFilter
                themeFilter={themeFilter}
                categoryFilter={categoryFilter}
                subcategoryFilter={subcategoryFilter}
                searchQuery={searchQuery}
                onThemeChange={handleThemeFilterChange}
                onCategoryChange={handleCategoryFilterChange}
                onSubcategoryChange={setSubcategoryFilter}
                onSearchChange={setSearchQuery}
                onClearFilters={clearAllFilters}
                activeFiltersCount={getActiveFiltersCount()}
                resultsCount={filteredVideos.length}
              />
            </div>

            {/* Level and Sort Filters */}
            <div className="mb-6 flex gap-4">
              <Select value={levelFilter} onValueChange={handleLevelFilterChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="KS4">KS4 (GCSE)</SelectItem>
                </SelectContent>
              </Select>

              {/* KS4-specific filters */}
              {levelFilter === 'KS4' && (
                <>
                  <Select value={examBoardFilter} onValueChange={setExamBoardFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Exam Board" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Boards</SelectItem>
                      <SelectItem value="AQA">AQA</SelectItem>
                      <SelectItem value="edexcel">Edexcel</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="foundation">Foundation</SelectItem>
                      <SelectItem value="higher">Higher</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="vocabulary">Most Vocabulary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" key={`video-grid-${themeFilter}-${categoryFilter}-${subcategoryFilter}`}>
              {filteredVideos.length > 0 ? (
                filteredVideos.map((video, index) => {
                  const videoProgress = progress[video.id];
                  
                  return (
                    <motion.div
                      key={`video-${video.id}-${video.youtube_id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: Math.min(index * 0.05, 0.5), // Cap the delay to prevent too long delays
                        duration: 0.3,
                        ease: "easeOut"
                      }}
                    >
                    <Link href={`/songs/${language}/video/${video.id}`}>
                      <Card className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full">
                        <div className="relative">
                          {/* Thumbnail */}
                          <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                            {video.thumbnail_url || video.youtube_id ? (
                              <img
                                src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
                                alt={video.title || 'Video thumbnail'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                loading="lazy"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder-video.jpg'; // Fallback image
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Play className="w-8 h-8 text-gray-400" />
                              </div>
                            )}

                            {/* Play overlay */}
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-white/90 rounded-full p-3">
                                <Play className="w-6 h-6 text-gray-800" />
                              </div>
                            </div>
                          </div>

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {video.is_featured && (
                            <Badge className="bg-yellow-500 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}

                          {/* Theme Badge */}
                          {video.theme && (
                            <Badge
                              className={`text-white ${
                                video.theme === 'vocabulary'
                                  ? 'bg-blue-500'
                                  : video.theme === 'grammar'
                                  ? 'bg-green-500'
                                  : 'bg-gray-500'
                              }`}
                            >
                              {video.theme === 'vocabulary' ? (
                                <BookOpen className="w-3 h-3 mr-1" />
                              ) : video.theme === 'grammar' ? (
                                <Target className="w-3 h-3 mr-1" />
                              ) : null}
                              {video.theme.charAt(0).toUpperCase() + video.theme.slice(1)}
                            </Badge>
                          )}

                          {/* Category Badge */}
                          {video.topic && (
                            <Badge variant="outline" className="bg-white/90 text-gray-700 text-xs">
                              {(() => {
                                // Find display name for vocabulary categories
                                const vocabCategory = VOCABULARY_CATEGORIES.find(cat => cat.id === video.topic);
                                if (vocabCategory) return vocabCategory.displayName;

                                // Find display name for grammar categories
                                const grammarCategory = GRAMMAR_CATEGORIES.find(cat => cat.id === video.topic);
                                if (grammarCategory) return grammarCategory.displayName;

                                // Fallback to topic name
                                return video.topic.charAt(0).toUpperCase() + video.topic.slice(1);
                              })()}
                            </Badge>
                          )}

                          {/* Subcategory Badge */}
                          {video.subtopic && video.subtopic !== 'general' && (
                            <Badge variant="outline" className="bg-white/80 text-gray-600 text-xs">
                              {(() => {
                                // Find display name for subcategories
                                const categories = [...VOCABULARY_CATEGORIES, ...GRAMMAR_CATEGORIES];
                                const category = categories.find(cat => cat.id === video.topic);
                                const subcategory = category?.subcategories.find(sub => sub.id === video.subtopic);

                                if (subcategory) return subcategory.displayName;

                                // Fallback to subtopic name
                                return video.subtopic.charAt(0).toUpperCase() + video.subtopic.slice(1).replace(/_/g, ' ');
                              })()}
                            </Badge>
                          )}
                        </div>

                        {/* Duration */}
                        <div className="absolute bottom-2 right-2">
                          <Badge variant="secondary" className="bg-black/70 text-white">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDuration(video.duration_seconds)}
                          </Badge>
                        </div>

                        {/* Progress bar */}
                        {videoProgress && videoProgress.progress_percentage > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                            <div
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${videoProgress.progress_percentage}%` }}
                            />
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                            {video.title}
                          </h3>
                        </div>

                        {video.description && (
                          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                            {video.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mb-3">
                          <Badge className={`text-xs ${getLevelColor(video.level)}`}>
                            {video.level}
                          </Badge>
                          
                          {video.vocabulary_count > 0 && (
                            <div className="flex items-center text-xs text-gray-500">
                              <BookOpen className="w-3 h-3 mr-1" />
                              {video.vocabulary_count} words
                            </div>
                          )}
                        </div>

                          <div className="mt-4">
                            <Button className="w-full" size="sm">
                              <Play className="w-4 h-4 mr-2" />
                              {videoProgress?.completed ? 'Watch Again' : 'Watch & Learn'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No videos found matching your criteria</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="vocabulary" className="mt-6">
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Vocabulary Practice</h3>
              <p className="text-gray-600 mb-6">
                Practice vocabulary from videos with flashcards and spaced repetition
              </p>
              <Link href={`/songs/${language}/vocabulary`}>
                <Button>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Vocabulary Practice
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="games" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Video Vocabulary Match</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Match vocabulary words with their meanings from video contexts
                  </p>
                  <Link href={`/songs/${language}/games/vocabulary-match`}>
                    <Button className="w-full">
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Play Game
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Volume2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Lyric Completion</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Fill in missing words from song lyrics and video content
                  </p>
                  <Link href={`/songs/${language}/games/lyric-completion`}>
                    <Button className="w-full">
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Play Game
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            {user ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {Object.values(progress).filter(p => p.completed).length}
                      </div>
                      <p className="text-sm text-gray-600">Videos Completed</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {Object.values(progress).reduce((sum, p) => sum + (p.progress_percentage || 0), 0).toFixed(0)}%
                      </div>
                      <p className="text-sm text-gray-600">Average Progress</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">
                        {videos.reduce((sum, v) => sum + v.vocabulary_count, 0)}
                      </div>
                      <p className="text-sm text-gray-600">Words Available</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sign in to track progress</h3>
                <p className="text-gray-600 mb-6">
                  Create an account to save your progress and earn gems
                </p>
                <Link href="/auth/login">
                  <Button>Sign In</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
