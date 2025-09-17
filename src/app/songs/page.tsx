'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Music, 
  BookOpen, 
  Trophy, 
  Star, 
  Clock, 
  Users,
  Headphones,
  Target,
  Zap,
  Globe,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FlagIcon from '@/components/ui/FlagIcon';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSupabase } from '@/hooks/useSupabase';

interface LanguageStats {
  language: string;
  videoCount: number;
  vocabularyCount: number;
  userProgress?: {
    videosCompleted: number;
    vocabularyLearned: number;
    totalWatchTime: number;
  };
}

export default function SongsPage() {
  const [languageStats, setLanguageStats] = useState<LanguageStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { supabase } = useSupabase();

  useEffect(() => {
    fetchLanguageStats();
  }, [user]);

  const fetchLanguageStats = async () => {
    try {
      setLoading(true);
      
      // Get video counts by language
      const { data: videoStats, error: videoError } = await supabase
        .from('youtube_videos')
        .select('language, id')
        .eq('is_active', true);
      
      if (videoError) throw videoError;

      // Get vocabulary counts by language from video_vocabulary
      const { data: vocabStats, error: vocabError } = await supabase
        .from('video_vocabulary')
        .select(`
          video_id,
          youtube_videos!inner(language)
        `);
      
      if (vocabError) throw vocabError;

      // Process stats by language
      const statsMap: Record<string, LanguageStats> = {};
      
      // Count videos by language
      videoStats?.forEach(video => {
        if (!statsMap[video.language]) {
          statsMap[video.language] = {
            language: video.language,
            videoCount: 0,
            vocabularyCount: 0
          };
        }
        statsMap[video.language].videoCount++;
      });

      // Count vocabulary by language
      vocabStats?.forEach(vocab => {
        const language = vocab.youtube_videos.language;
        if (statsMap[language]) {
          statsMap[language].vocabularyCount++;
        }
      });

      // Get user progress if logged in
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('video_progress')
          .select(`
            video_id,
            completed,
            vocabulary_learned_count,
            total_watch_time_seconds,
            youtube_videos!inner(language)
          `)
          .eq('user_id', user.id);

        if (!progressError && progressData) {
          // Initialize user progress for each language
          Object.keys(statsMap).forEach(language => {
            statsMap[language].userProgress = {
              videosCompleted: 0,
              vocabularyLearned: 0,
              totalWatchTime: 0
            };
          });

          // Aggregate user progress by language
          progressData.forEach(progress => {
            const language = progress.youtube_videos.language;
            if (statsMap[language] && statsMap[language].userProgress) {
              if (progress.completed) {
                statsMap[language].userProgress!.videosCompleted++;
              }
              statsMap[language].userProgress!.vocabularyLearned += progress.vocabulary_learned_count || 0;
              statsMap[language].userProgress!.totalWatchTime += progress.total_watch_time_seconds || 0;
            }
          });
        }
      }

      setLanguageStats(Object.values(statsMap));
      
    } catch (error) {
      console.error('Error fetching language stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageInfo = (lang: string) => {
    const info = {
      es: { name: 'Spanish', flag: 'ES', color: 'from-red-500 to-yellow-500' },
      fr: { name: 'French', flag: 'FR', color: 'from-blue-500 to-red-500' },
      de: { name: 'German', flag: 'DE', color: 'from-red-600 to-yellow-400' }
    };
    return info[lang as keyof typeof info] || { name: lang, flag: 'GB', color: 'from-gray-500 to-gray-600' };
  };

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading songs platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-4">
                <Music className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Language Songs
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Learn languages through music and interactive videos. Master vocabulary, grammar, and pronunciation with engaging songs.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
                <Music className="w-4 h-4 mr-2 text-purple-500" />
                Interactive Videos
              </div>
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
                <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                Vocabulary Learning
              </div>
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
                <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                Quiz Games
              </div>
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
                <Target className="w-4 h-4 mr-2 text-green-500" />
                Grammar Notes
              </div>
            </div>
          </motion.div>
        </div>

        {/* Language Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Browse by Language</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {languageStats.map((langStat, index) => {
              const langInfo = getLanguageInfo(langStat.language);
              
              return (
                <motion.div
                  key={langStat.language}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/songs/${langStat.language}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-300 h-full">
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                            <Music className="w-8 h-8 text-purple-600" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{langInfo.name} Songs</h3>
                          <p className="text-sm text-gray-600">Learn through music & videos</p>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Videos:</span>
                            <Badge variant="secondary">{langStat.videoCount}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Vocabulary:</span>
                            <Badge variant="secondary">{langStat.vocabularyCount}</Badge>
                          </div>
                          
                          {langStat.userProgress && (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Completed:</span>
                                <Badge className="bg-green-100 text-green-700">
                                  {langStat.userProgress.videosCompleted}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Watch Time:</span>
                                <Badge className="bg-blue-100 text-blue-700">
                                  {formatWatchTime(langStat.userProgress.totalWatchTime)}
                                </Badge>
                              </div>
                            </>
                          )}
                        </div>
                        
                        <div className="mt-4">
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 group-hover:scale-105 transition-transform">
                            <Play className="w-4 h-4 mr-2" />
                            Explore {langStat.videoCount} Videos
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
