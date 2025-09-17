'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, BookOpen, Star, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabase } from '@/hooks/useSupabase';
import { useAuth } from '@/components/auth/AuthProvider';

interface YouTubeVideo {
  id: string;
  title: string;
  youtube_id: string;
  language: string;
  level: string;
  description: string;
  thumbnail_url: string;
  duration_seconds: number;
  is_premium: boolean;
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

export default function YouTubeVideosPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [progress, setProgress] = useState<Record<string, VideoProgress>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const { supabase } = useSupabase();
  const { user } = useAuth();

  useEffect(() => {
    fetchVideos();
    if (user) {
      fetchProgress();
    }
  }, [user, languageFilter, levelFilter, sortBy]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('youtube_videos')
        .select('*')
        .eq('is_active', true);

      // Apply filters
      if (languageFilter !== 'all') {
        query = query.eq('language', languageFilter);
      }
      
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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getLanguageLabel = (lang: string) => {
    const labels = { es: 'Spanish', fr: 'French', de: 'German' };
    return labels[lang as keyof typeof labels] || lang;
  };

  const getLevelColor = (level: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">YouTube Learning Videos</h1>
        <p className="text-gray-600">
          Learn languages through engaging video content with interactive vocabulary
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 space-y-4">
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
              <Card className="group hover:shadow-lg transition-shadow duration-200">
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
                    {video.is_premium && (
                      <Badge variant="secondary">Premium</Badge>
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
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">
                        {getLanguageLabel(video.language)}
                      </Badge>
                      <Badge className={`text-xs ${getLevelColor(video.level)}`}>
                        {video.level}
                      </Badge>
                    </div>
                    
                    {video.vocabulary_count > 0 && (
                      <div className="flex items-center text-xs text-gray-500">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {video.vocabulary_count} words
                      </div>
                    )}
                  </div>

                  <Link href={`/youtube/video/${video.id}`}>
                    <Button className="w-full" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      {videoProgress?.completed ? 'Watch Again' : 'Watch & Learn'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredVideos.length === 0 && !loading && (
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
    </div>
  );
}
