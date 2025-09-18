'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Search,
  Filter,
  Star,
  Play,
  Lock,
  Crown,
  Globe,
  TrendingUp,
  Target,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

export default function LearnerVocabularyPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [vocabularyLists, setVocabularyLists] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('spanish');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [stats, setStats] = useState({
    wordsLearned: 0,
    totalWords: 0,
    accuracy: 0
  });

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

      // Check premium status
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('subscription_status, subscription_type')
        .eq('user_id', user?.id)
        .single();

      // Default to FREE unless explicitly premium
      setIsPremium(profile?.subscription_status === 'active' && profile?.subscription_type === 'premium');

      // Create mock vocabulary lists based on freemium model
      const mockLists = [
        {
          id: 1,
          name: 'Basic Greetings',
          description: 'Essential greetings and polite expressions',
          wordCount: 15,
          learned: 8,
          difficulty: 'Beginner',
          category: 'basics',
          isFree: true,
          color: 'green'
        },
        {
          id: 2,
          name: 'Family & Friends',
          description: 'Words for family members and relationships',
          wordCount: 25,
          learned: 12,
          difficulty: 'Beginner',
          category: 'family',
          isFree: true,
          color: 'blue'
        },
        {
          id: 3,
          name: 'Food & Drink',
          description: 'Common foods and beverages',
          wordCount: 30,
          learned: 5,
          difficulty: 'Beginner',
          category: 'food',
          isFree: true,
          color: 'orange'
        },
        {
          id: 4,
          name: 'Travel & Transport',
          description: 'Vocabulary for traveling and transportation',
          wordCount: 40,
          learned: 0,
          difficulty: 'Intermediate',
          category: 'travel',
          isFree: false,
          color: 'purple'
        },
        {
          id: 5,
          name: 'Business & Work',
          description: 'Professional vocabulary and workplace terms',
          wordCount: 50,
          learned: 0,
          difficulty: 'Advanced',
          category: 'business',
          isFree: false,
          color: 'red'
        },
        {
          id: 6,
          name: 'GCSE Higher Tier',
          description: 'Advanced vocabulary for GCSE higher tier',
          wordCount: 200,
          learned: 0,
          difficulty: 'Advanced',
          category: 'gcse',
          isFree: false,
          color: 'indigo'
        }
      ];

      setVocabularyLists(mockLists);

      // Calculate stats
      const totalLearned = mockLists.reduce((sum, list) => sum + list.learned, 0);
      const totalWords = isPremium 
        ? mockLists.reduce((sum, list) => sum + list.wordCount, 0)
        : mockLists.filter(list => list.isFree).reduce((sum, list) => sum + list.wordCount, 0);

      setStats({
        wordsLearned: totalLearned,
        totalWords: totalWords,
        accuracy: totalLearned > 0 ? Math.round((totalLearned / totalWords) * 100) : 0
      });

    } catch (error) {
      console.error('Error loading vocabulary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLists = vocabularyLists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    list.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-600',
      'Intermediate': 'bg-yellow-100 text-yellow-600',
      'Advanced': 'bg-red-100 text-red-600'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getListColor = (color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      orange: 'bg-orange-100 text-orange-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600',
      indigo: 'bg-indigo-100 text-indigo-600'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

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
          <p className="text-gray-600">Build your vocabulary with curated word lists</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <p className="text-sm text-gray-600">Words learned</p>
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
              <span className="text-2xl font-bold text-gray-900">{stats.totalWords}</span>
            </div>
            <p className="text-sm text-gray-600">Total available</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.accuracy}%</span>
            </div>
            <p className="text-sm text-gray-600">Progress</p>
          </motion.div>
        </div>

        {/* Language Selector & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex space-x-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedLanguage === lang.code
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-purple-50'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search vocabulary lists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Premium Banner */}
        {!isPremium && (
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
                  <p className="text-purple-100">Access 1000+ words across all difficulty levels</p>
                </div>
              </div>
              <Link
                href="/learner-dashboard/upgrade"
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                Upgrade Now
              </Link>
            </div>
          </motion.div>
        )}

        {/* Vocabulary Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLists.map((list, index) => {
            const progress = (list.learned / list.wordCount) * 100;
            const isLocked = !isPremium && !list.isFree;

            return (
              <motion.div
                key={list.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl p-6 shadow-lg relative ${isLocked ? 'opacity-60' : ''}`}
              >
                {isLocked && (
                  <div className="absolute top-4 right-4">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getListColor(list.color)}`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(list.difficulty)}`}>
                    {list.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{list.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{list.description}</p>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{list.learned} / {list.wordCount} words</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {isLocked ? (
                  <div className="flex items-center justify-center py-2 bg-gray-100 text-gray-500 rounded-lg">
                    <Lock className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Premium Only</span>
                  </div>
                ) : (
                  <Link
                    href={`/games?vocabulary=${list.category}`}
                    className="flex items-center justify-center py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Practice Now
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
