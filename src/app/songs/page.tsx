'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain,
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
      vocabStats?.forEach((vocab: any) => {
        const language = vocab.youtube_videos?.language;
        if (language && statsMap[language]) {
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
          progressData.forEach((progress: any) => {
            const language = progress.youtube_videos?.language;
            if (language && statsMap[language] && statsMap[language].userProgress) {
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
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex justify-center mb-8">
              <motion.div
                className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-6 shadow-2xl"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Music className="w-16 h-16 text-white" />
              </motion.div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight">
              Learn Languages<br/>Through Music
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
              Master vocabulary, grammar, and pronunciation with engaging songs and interactive videos
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              <motion.div 
                className="flex items-center bg-white/90 backdrop-blur rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.05 }}
              >
                <Headphones className="w-5 h-5 mr-2 text-purple-600" />
                <span className="font-medium text-gray-800">Interactive Videos</span>
              </motion.div>
              <motion.div 
                className="flex items-center bg-white/90 backdrop-blur rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.05 }}
              >
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                <span className="font-medium text-gray-800">Smart Vocabulary</span>
              </motion.div>
              <motion.div 
                className="flex items-center bg-white/90 backdrop-blur rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                <span className="font-medium text-gray-800">Quiz Games</span>
              </motion.div>
              <motion.div 
                className="flex items-center bg-white/90 backdrop-blur rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.05 }}
              >
                <Target className="w-5 h-5 mr-2 text-green-600" />
                <span className="font-medium text-gray-800">Grammar Notes</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Language Selection */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Choose Your Language
          </h2>
          <div className="max-w-6xl mx-auto space-y-6">
            {languageStats.map((langStat, index) => {
              const langInfo = getLanguageInfo(langStat.language);
              
              return (
                <motion.div
                  key={langStat.language}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
                >
                  <Link href={`/songs/${langStat.language}`}>
                    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200">
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${langInfo.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                      
                      {/* Content */}
                      <div className="relative p-8 md:p-10">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                          {/* Left: Language Info */}
                          <div className="flex items-center gap-6 flex-1">
                            <div className={`bg-gradient-to-br ${langInfo.color} rounded-2xl p-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                              <Music className="w-10 h-10 text-white" />
                            </div>
                            
                            <div>
                              <h3 className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                                {langInfo.name}
                              </h3>
                              <p className="text-gray-600 text-lg">
                                Learn through music and interactive videos
                              </p>
                            </div>
                          </div>

                          {/* Right: Stats Grid */}
                          <div className="flex flex-wrap gap-4 items-center">
                            <div className="bg-purple-50 rounded-xl px-5 py-3 min-w-[120px]">
                              <div className="text-sm text-purple-600 font-medium mb-1">Videos</div>
                              <div className="text-2xl font-bold text-purple-900">{langStat.videoCount}</div>
                            </div>
                            
                            <div className="bg-pink-50 rounded-xl px-5 py-3 min-w-[120px]">
                              <div className="text-sm text-pink-600 font-medium mb-1">Vocabulary</div>
                              <div className="text-2xl font-bold text-pink-900">{langStat.vocabularyCount}</div>
                            </div>
                            
                            {langStat.userProgress && langStat.userProgress.videosCompleted > 0 && (
                              <div className="bg-green-50 rounded-xl px-5 py-3 min-w-[120px]">
                                <div className="text-sm text-green-600 font-medium mb-1">Completed</div>
                                <div className="text-2xl font-bold text-green-900">
                                  {langStat.userProgress.videosCompleted}
                                </div>
                              </div>
                            )}
                            
                            {langStat.userProgress && langStat.userProgress.totalWatchTime > 0 && (
                              <div className="bg-blue-50 rounded-xl px-5 py-3 min-w-[120px]">
                                <div className="text-sm text-blue-600 font-medium mb-1">Watch Time</div>
                                <div className="text-2xl font-bold text-blue-900">
                                  {formatWatchTime(langStat.userProgress.totalWatchTime)}
                                </div>
                              </div>
                            )}

                            {/* Arrow */}
                            <div className="ml-4">
                              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-3 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                                <ChevronRight className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar (if user has progress) */}
                        {langStat.userProgress && langStat.userProgress.videosCompleted > 0 && (
                          <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Your Progress</span>
                              <span className="text-sm font-bold text-purple-600">
                                {Math.round((langStat.userProgress.videosCompleted / langStat.videoCount) * 100)}%
                              </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                initial={{ width: 0 }}
                                animate={{ 
                                  width: `${(langStat.userProgress.videosCompleted / langStat.videoCount) * 100}%` 
                                }}
                                transition={{ delay: index * 0.15 + 0.3, duration: 0.8 }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Learn with Songs?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Research shows music accelerates language learning and improves retention
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 w-fit mb-4">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Immersive Listening</h3>
              <p className="text-gray-600">
                Develop your ear with native speakers and authentic pronunciation in real songs
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 w-fit mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Better Retention</h3>
              <p className="text-gray-600">
                Music creates emotional connections that help you remember vocabulary longer
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 w-fit mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cultural Context</h3>
              <p className="text-gray-600">
                Discover culture, slang, and authentic expressions used by native speakers
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 w-fit mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fun & Engaging</h3>
              <p className="text-gray-600">
                Make learning enjoyable with interactive quizzes and games based on songs
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
