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
  Users
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
  
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [progress, setProgress] = useState<Record<string, VideoProgress>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [activeTab, setActiveTab] = useState('videos');

  const { user } = useAuth();
  const { supabase } = useSupabase();

  useEffect(() => {
    if (language) {
      fetchVideos();
      if (user) {
        fetchProgress();
      }
    }
  }, [language, user, levelFilter, sortBy]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('youtube_videos')
        .select('*')
        .eq('is_active', true)
        .eq('language', language);

      // Apply level filter
      if (levelFilter !== 'all') {
        query = query.eq('level', levelFilter);
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
      
      if (error) throw error;
      setVideos(data || []);
      
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
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

  const filteredVideos = videos.filter(video => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        video.title.toLowerCase().includes(query) ||
        video.description?.toLowerCase().includes(query)
      );
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
                <span className="text-sm font-medium">{videos.reduce((sum, v) => sum + v.vocabulary_count, 0)} Words</span>
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
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="videos">
              <Play className="w-4 h-4 mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="vocabulary">
              <BookOpen className="w-4 h-4 mr-2" />
              Vocabulary
            </TabsTrigger>
            <TabsTrigger value="games">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Games
            </TabsTrigger>
            <TabsTrigger value="progress">
              <Trophy className="w-4 h-4 mr-2" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-6">
            {/* Filters */}
            <div className="mb-6 space-y-4">
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

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="popular">Popular</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="vocabulary">Vocabulary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video, index) => {
                const videoProgress = progress[video.id];
                
                return (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/songs/${language}/video/${video.id}`}>
                      <Card className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                        <div className="relative">
                          {/* Thumbnail */}
                          <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                            <img
                              src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />

                            {/* Play overlay */}
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-white/90 rounded-full p-3">
                                <Play className="w-6 h-6 text-gray-800" />
                              </div>
                            </div>
                          </div>

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex gap-1">
                          {video.is_featured && (
                            <Badge className="bg-yellow-500 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
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
              })}
            </div>

            {filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Play className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No videos found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
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
