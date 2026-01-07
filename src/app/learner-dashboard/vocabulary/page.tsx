'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Search,
  Star,
  Play,
  Lock,
  Crown,
  TrendingUp,
  Target,
  Gamepad2,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

interface VocabularyStats {
  wordsLearned: number;
  totalWordsPracticed: number;
  accuracy: number;
  gamesPlayed: number;
}

interface LanguageStats {
  gamesPlayed: number;
  wordsLearned: number;
  avgAccuracy: number;
}

interface RecentWord {
  word: string;
  translation: string;
  correct: boolean;
  gameType: string;
  practicedAt: string;
}

export default function LearnerVocabularyPage() {
  const { user, hasSubscription } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('spanish');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<VocabularyStats>({
    wordsLearned: 0,
    totalWordsPracticed: 0,
    accuracy: 0,
    gamesPlayed: 0
  });
  const [languageStats, setLanguageStats] = useState<Record<string, LanguageStats>>({});
  const [recentWords, setRecentWords] = useState<RecentWord[]>([]);
  const [topics, setTopics] = useState<any[]>([]);

  const languages = [
    { code: 'spanish', name: 'Spanish', flag: '🇪🇸' },
    { code: 'french', name: 'French', flag: '🇫🇷' },
    { code: 'german', name: 'German', flag: '🇩🇪' }
  ];

  useEffect(() => {
    if (user) {
      loadVocabularyData();
    }
  }, [user, selectedLanguage]);

  const loadVocabularyData = async () => {
    try {
      setLoading(true);

      // Fetch stats from the API
      const response = await fetch('/api/learner/progress?type=all');
      if (response.ok) {
        const data = await response.json();

        if (data.stats) {
          setStats({
            wordsLearned: data.stats.wordsLearned || 0,
            totalWordsPracticed: data.stats.wordsLearned || 0,
            accuracy: data.stats.accuracy || 0,
            gamesPlayed: data.stats.gamesPlayed || 0
          });
        }

        if (data.languages) {
          setLanguageStats(data.languages);
        }
      }

      // Fetch recent word attempts from gem_events (which tracks individual word answers)
      const { data: gemEvents, error: gemError } = await supabase
        .from('gem_events')
        .select('word_text, translation_text, game_type, created_at')
        .eq('student_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!gemError && gemEvents) {
        const words = gemEvents.map(event => ({
          word: event.word_text || '',
          translation: event.translation_text || '',
          correct: true, // Gems only awarded for correct answers
          gameType: event.game_type || 'Unknown',
          practicedAt: event.created_at
        })).filter(w => w.word && !w.word.startsWith('Bonus:'));

        setRecentWords(words);
      }

      // Fetch available topics/themes for the selected language
      const { data: themesData, error: themesError } = await supabase
        .from('themes')
        .select('id, name, description, language')
        .eq('language', selectedLanguage)
        .order('name');

      if (!themesError && themesData) {
        // Get word counts for each theme
        const topicsWithCounts = await Promise.all(
          themesData.slice(0, 12).map(async (theme) => {
            const { count } = await supabase
              .from('centralized_vocabulary')
              .select('*', { count: 'exact', head: true })
              .eq('theme_id', theme.id);

            return {
              ...theme,
              wordCount: count || 0,
              learned: 0, // Would need to track this per user
              color: getThemeColor(theme.name)
            };
          })
        );

        setTopics(topicsWithCounts.filter(t => t.wordCount > 0));
      }

    } catch (error) {
      console.error('Error loading vocabulary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getThemeColor = (name: string): string => {
    const colors = ['green', 'blue', 'orange', 'purple', 'red', 'indigo', 'pink', 'teal'];
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      orange: 'bg-orange-100 text-orange-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      pink: 'bg-pink-100 text-pink-600',
      teal: 'bg-teal-100 text-teal-600'
    };
    return colors[color] || 'bg-gray-100 text-gray-600';
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (topic.description && topic.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentLangStats = languageStats[selectedLanguage];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Vocabulary</h1>
          <p className="text-gray-600">Track your vocabulary progress and practice words</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.wordsLearned}</span>
            </div>
            <p className="text-sm text-gray-600">Words practiced correctly</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.accuracy}%</span>
            </div>
            <p className="text-sm text-gray-600">Overall accuracy</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.gamesPlayed}</span>
            </div>
            <p className="text-sm text-gray-600">Games played</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {currentLangStats?.wordsLearned || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600">{languages.find(l => l.code === selectedLanguage)?.name} words</p>
          </motion.div>
        </div>

        {/* Language Selector & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex space-x-2">
            {languages.map((lang) => {
              const langStats = languageStats[lang.code];
              return (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${selectedLanguage === lang.code
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-purple-50 shadow-sm'
                    }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {langStats && (
                    <span className={`text-xs ${selectedLanguage === lang.code ? 'text-purple-200' : 'text-gray-400'}`}>
                      ({langStats.wordsLearned})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Premium Banner */}
        {!hasSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Unlock All Vocabulary</h3>
                  <p className="text-purple-100">Access all topics and advanced vocabulary lists</p>
                </div>
              </div>
              <Link
                href="/pricing"
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                Upgrade Now
              </Link>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Topics/Themes to Practice */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Practice by Topic</h2>

            {filteredTopics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTopics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(topic.color)}`}>
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <span className="text-sm text-gray-500">{topic.wordCount} words</span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">{topic.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                      {topic.description || `Practice ${topic.name.toLowerCase()} vocabulary`}
                    </p>

                    <Link
                      href={`/games?language=${selectedLanguage}&theme=${encodeURIComponent(topic.name)}`}
                      className="flex items-center justify-center py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Practice Now
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Topics Found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try a different search term' : 'No vocabulary topics available for this language yet'}
                </p>
              </div>
            )}
          </div>

          {/* Recent Words Sidebar */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Recent Words
              </h3>

              {recentWords.length > 0 ? (
                <div className="space-y-3">
                  {recentWords.slice(0, 10).map((word, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{word.word}</p>
                        <p className="text-sm text-gray-500">{word.translation}</p>
                      </div>
                      <div className="text-right">
                        <CheckCircle className="w-4 h-4 text-green-500 ml-auto mb-1" />
                        <p className="text-xs text-gray-400">{formatTimeAgo(word.practicedAt)}</p>
                      </div>
                    </div>
                  ))}

                  {recentWords.length > 10 && (
                    <button className="text-purple-600 text-sm font-medium flex items-center hover:text-purple-700 mt-4">
                      View all words
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No words practiced yet</p>
                  <p className="text-gray-400 text-sm mt-1">Start playing games to see your vocabulary!</p>
                </div>
              )}
            </div>

            {/* Quick Practice Button */}
            <div className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Quick Practice</h3>
              <p className="text-purple-100 text-sm mb-4">Jump into a random vocabulary game</p>
              <Link
                href="/games/vocab-master"
                className="block text-center py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                <Gamepad2 className="w-5 h-5 inline mr-2" />
                Start VocabMaster
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
