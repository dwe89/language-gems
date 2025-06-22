'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { VocabularyMiningService } from '../../../../services/vocabulary-mining';
import { GemDisplay } from '../../../../components/vocabulary-mining/GemDisplay';
import { 
  GemCollection, 
  VocabularyGem 
} from '../../../../types/vocabulary-mining';
import { 
  getGemInfo,
  getGemStageInfo 
} from '../../../../utils/vocabulary-mining';
import { 
  Search, 
  Filter, 
  ArrowLeft,
  Star,
  Trophy,
  Target,
  Zap,
  Crown,
  Gem,
  Sparkles,
  Eye,
  Play,
  Volume2
} from 'lucide-react';
import Link from 'next/link';

interface GemStage {
  stage: number;
  name: string;
  emoji: string;
  description: string;
  color: string;
  glowColor: string;
}

const GEM_STAGES: GemStage[] = [
  { stage: 1, name: 'Rock', emoji: '🪨', description: 'Initial encounter', color: '#6B7280', glowColor: '#9CA3AF' },
  { stage: 2, name: 'Crystal', emoji: '🔹', description: 'Basic recognition', color: '#3B82F6', glowColor: '#60A5FA' },
  { stage: 3, name: 'Gemstone', emoji: '💎', description: 'Good understanding', color: '#8B5CF6', glowColor: '#A78BFA' },
  { stage: 4, name: 'Jewel', emoji: '💍', description: 'Strong mastery', color: '#F59E0B', glowColor: '#FBBF24' },
  { stage: 5, name: 'Crown Jewel', emoji: '👑', description: 'Complete mastery', color: '#EF4444', glowColor: '#F87171' }
];

export default function VocabularyMiningCollectionPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [miningService] = useState(() => new VocabularyMiningService(supabase));
  
  const [loading, setLoading] = useState(true);
  const [gemCollection, setGemCollection] = useState<GemCollection[]>([]);
  const [filteredGems, setFilteredGems] = useState<GemCollection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'mastered' | 'learning' | 'review'>('all');
  const [selectedStage, setSelectedStage] = useState<number | 'all'>('all');
  const [selectedGem, setSelectedGem] = useState<GemCollection | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'mastery' | 'alphabetical'>('recent');

  useEffect(() => {
    if (user) {
      loadGemCollection();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortGems();
  }, [gemCollection, searchTerm, selectedFilter, selectedStage, sortBy]);

  const loadGemCollection = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const collection = await miningService.getGemCollection(user.id);
      setGemCollection(collection);
    } catch (error) {
      console.error('Error loading gem collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortGems = () => {
    let filtered = [...gemCollection];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(gem => 
        gem.vocabularyGem.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gem.vocabularyGem.translation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    switch (selectedFilter) {
      case 'mastered':
        filtered = filtered.filter(gem => gem.masteryLevel >= 4);
        break;
      case 'learning':
        filtered = filtered.filter(gem => gem.masteryLevel >= 2 && gem.masteryLevel < 4);
        break;
      case 'review':
        filtered = filtered.filter(gem => gem.nextReviewDate && new Date(gem.nextReviewDate) <= new Date());
        break;
    }

    // Apply stage filter
    if (selectedStage !== 'all') {
      filtered = filtered.filter(gem => gem.masteryLevel === selectedStage);
    }

    // Apply sorting
    switch (sortBy) {
      case 'mastery':
        filtered.sort((a, b) => b.masteryLevel - a.masteryLevel);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.vocabularyGem.term.localeCompare(b.vocabularyGem.term));
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.lastPracticed).getTime() - new Date(a.lastPracticed).getTime());
        break;
    }

    setFilteredGems(filtered);
  };

  const getGemStage = (masteryLevel: number): GemStage => {
    return GEM_STAGES[Math.max(0, Math.min(4, masteryLevel - 1))];
  };

  const playAudio = (audioUrl?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(console.error);
    }
  };

  const getCollectionStats = () => {
    const total = gemCollection.length;
    const mastered = gemCollection.filter(gem => gem.masteryLevel >= 4).length;
    const learning = gemCollection.filter(gem => gem.masteryLevel >= 2 && gem.masteryLevel < 4).length;
    const needsReview = gemCollection.filter(gem => 
      gem.nextReviewDate && new Date(gem.nextReviewDate) <= new Date()
    ).length;

    return { total, mastered, learning, needsReview };
  };

  const stats = getCollectionStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading your gem collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/student-dashboard/vocabulary-mining"
                className="text-white/80 hover:text-white mr-4"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <Gem className="w-8 h-8 mr-3 text-purple-300" />
                  My Gem Vault
                </h1>
                <p className="text-indigo-200">Your personal collection of vocabulary gems</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-indigo-200">Total Gems</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Collection Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-green-400 mb-1">{stats.mastered}</div>
            <div className="text-sm text-indigo-200">Mastered</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.learning}</div>
            <div className="text-sm text-indigo-200">Learning</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-orange-400 mb-1">{stats.needsReview}</div>
            <div className="text-sm text-indigo-200">Need Review</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0}%
            </div>
            <div className="text-sm text-indigo-200">Completion</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your gems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as any)}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Gems</option>
              <option value="mastered">Mastered</option>
              <option value="learning">Learning</option>
              <option value="review">Need Review</option>
            </select>
            
            {/* Stage Filter */}
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Stages</option>
              {GEM_STAGES.map(stage => (
                <option key={stage.stage} value={stage.stage}>
                  {stage.emoji} {stage.name}
                </option>
              ))}
            </select>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="recent">Recently Practiced</option>
              <option value="mastery">Mastery Level</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Gem Collection Grid */}
        {filteredGems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💎</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {gemCollection.length === 0 ? 'No gems yet!' : 'No gems match your filters'}
            </h3>
            <p className="text-indigo-200 mb-6">
              {gemCollection.length === 0 
                ? 'Start practicing to collect your first gems!'
                : 'Try adjusting your search or filters'
              }
            </p>
            {gemCollection.length === 0 && (
              <Link
                href="/student-dashboard/vocabulary-mining/practice"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700"
              >
                Start Mining
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGems.map((gem) => {
              const stage = getGemStage(gem.masteryLevel);
              const gemInfo = getGemInfo(gem.vocabularyGem.gemType);
              
              return (
                <motion.div
                  key={gem.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300"
                  onClick={() => setSelectedGem(gem)}
                  style={{
                    boxShadow: `0 0 20px ${stage.glowColor}40`
                  }}
                >
                  {/* Gem Stage Display */}
                  <div className="text-center mb-4">
                    <motion.div
                      className="text-4xl mb-2"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      {stage.emoji}
                    </motion.div>
                    <div className="text-xs text-white/80 font-medium">{stage.name}</div>
                  </div>
                  
                  {/* Word Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-white mb-1">{gem.vocabularyGem.term}</h3>
                    <p className="text-indigo-200 text-sm">{gem.vocabularyGem.translation}</p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-white/80 mb-1">
                      <span>Mastery</span>
                      <span>{gem.masteryLevel}/5</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <motion.div 
                        className="h-2 rounded-full"
                        style={{ backgroundColor: stage.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(gem.masteryLevel / 5) * 100}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-white font-medium">{gem.correctAnswers}</div>
                      <div className="text-white/60">Correct</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-medium">{gem.currentStreak}</div>
                      <div className="text-white/60">Streak</div>
                    </div>
                  </div>
                  
                  {/* Review Status */}
                  {gem.nextReviewDate && new Date(gem.nextReviewDate) <= new Date() && (
                    <div className="mt-3 text-center">
                      <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-xs">
                        Ready for Review
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Gem Detail Modal */}
      <AnimatePresence>
        {selectedGem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedGem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-3">{getGemStage(selectedGem.masteryLevel).emoji}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedGem.vocabularyGem.term}</h2>
                <p className="text-gray-600 text-lg">{selectedGem.vocabularyGem.translation}</p>
                <div className="mt-2">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {getGemStage(selectedGem.masteryLevel).name}
                  </span>
                </div>
              </div>
              
              {/* Detailed Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedGem.correctAnswers}</div>
                  <div className="text-sm text-gray-600">Correct Answers</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedGem.totalAttempts}</div>
                  <div className="text-sm text-gray-600">Total Attempts</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{selectedGem.currentStreak}</div>
                  <div className="text-sm text-gray-600">Current Streak</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedGem.bestStreak}</div>
                  <div className="text-sm text-gray-600">Best Streak</div>
                </div>
              </div>
              
              {/* Example Sentence */}
              {selectedGem.vocabularyGem.exampleSentence && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Example:</h4>
                  <p className="text-gray-700 italic">"{selectedGem.vocabularyGem.exampleSentence}"</p>
                  {selectedGem.vocabularyGem.exampleTranslation && (
                    <p className="text-gray-600 text-sm mt-1">"{selectedGem.vocabularyGem.exampleTranslation}"</p>
                  )}
                </div>
              )}
              
              {/* Actions */}
              <div className="flex space-x-3">
                {selectedGem.vocabularyGem.audioUrl && (
                  <button
                    onClick={() => playAudio(selectedGem.vocabularyGem.audioUrl)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Play Audio
                  </button>
                )}
                
                <Link
                  href={`/student-dashboard/vocabulary-mining/practice?word=${selectedGem.vocabularyGem.id}`}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Practice
                </Link>
                
                <button
                  onClick={() => setSelectedGem(null)}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
