'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  BookOpen, 
  Target, 
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Upload
} from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

interface TeacherSentence {
  id: string;
  spanish_text: string;
  english_text: string;
  grammar_focus?: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  curriculum_tier: 'Foundation' | 'Higher';
  theme?: string;
  topic?: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

interface SentenceFormData {
  spanish_text: string;
  english_text: string;
  grammar_focus: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  curriculum_tier: 'Foundation' | 'Higher';
  theme: string;
  topic: string;
}

const defaultFormData: SentenceFormData = {
  spanish_text: '',
  english_text: '',
  grammar_focus: '',
  difficulty_level: 'medium',
  curriculum_tier: 'Foundation',
  theme: '',
  topic: ''
};

const grammarFocusOptions = [
  'present-tense',
  'past-tense',
  'future-tense',
  'ser-estar',
  'adjective-agreement',
  'gustar-verb',
  'reflexive-verbs',
  'question-formation',
  'negation',
  'articles',
  'possessives',
  'family-vocabulary',
  'school-vocabulary',
  'food-vocabulary',
  'time-expressions',
  'weather-vocabulary',
  'numbers-age',
  'colors-descriptions',
  'transport',
  'house-descriptions'
];

const themeOptions = [
  'People and lifestyle',
  'Communication and the world around us',
  'Popular culture',
  'Identity and relationships',
  'Healthy living and lifestyle',
  'Education and work',
  'Environment and where people live',
  'Free time activities',
  'Customs, festivals and celebrations'
];

export default function SpeedBuilderContentPage() {
  const [sentences, setSentences] = useState<TeacherSentence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSentence, setEditingSentence] = useState<TeacherSentence | null>(null);
  const [formData, setFormData] = useState<SentenceFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState({
    difficulty: 'all',
    tier: 'all',
    grammarFocus: 'all'
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchSentences();
  }, []);

  const fetchSentences = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('teacher_sentences')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSentences(data || []);
    } catch (error) {
      console.error('Error fetching sentences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingSentence) {
        // Update existing sentence
        const { error } = await supabase
          .from('teacher_sentences')
          .update({
            spanish_text: formData.spanish_text,
            english_text: formData.english_text,
            grammar_focus: formData.grammar_focus,
            difficulty_level: formData.difficulty_level,
            curriculum_tier: formData.curriculum_tier,
            theme: formData.theme,
            topic: formData.topic
          })
          .eq('id', editingSentence.id);

        if (error) throw error;
      } else {
        // Create new sentence
        const { error } = await supabase
          .from('teacher_sentences')
          .insert({
            spanish_text: formData.spanish_text,
            english_text: formData.english_text,
            grammar_focus: formData.grammar_focus,
            difficulty_level: formData.difficulty_level,
            curriculum_tier: formData.curriculum_tier,
            theme: formData.theme,
            topic: formData.topic
          });

        if (error) throw error;
      }

      // Reset form and close
      setFormData(defaultFormData);
      setShowCreateForm(false);
      setEditingSentence(null);
      fetchSentences();
    } catch (error) {
      console.error('Error saving sentence:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (sentence: TeacherSentence) => {
    setEditingSentence(sentence);
    setFormData({
      spanish_text: sentence.spanish_text,
      english_text: sentence.english_text,
      grammar_focus: sentence.grammar_focus || '',
      difficulty_level: sentence.difficulty_level,
      curriculum_tier: sentence.curriculum_tier,
      theme: sentence.theme || '',
      topic: sentence.topic || ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (sentenceId: string) => {
    if (!confirm('Are you sure you want to delete this sentence?')) return;

    try {
      const { error } = await supabase
        .from('teacher_sentences')
        .update({ is_active: false })
        .eq('id', sentenceId);

      if (error) throw error;
      fetchSentences();
    } catch (error) {
      console.error('Error deleting sentence:', error);
    }
  };

  const handleCancel = () => {
    setFormData(defaultFormData);
    setShowCreateForm(false);
    setEditingSentence(null);
  };

  const filteredSentences = sentences.filter(sentence => {
    if (filter.difficulty !== 'all' && sentence.difficulty_level !== filter.difficulty) return false;
    if (filter.tier !== 'all' && sentence.curriculum_tier !== filter.tier) return false;
    if (filter.grammarFocus !== 'all' && sentence.grammar_focus !== filter.grammarFocus) return false;
    return true;
  });

  const stats = {
    total: sentences.length,
    foundation: sentences.filter(s => s.curriculum_tier === 'Foundation').length,
    higher: sentences.filter(s => s.curriculum_tier === 'Higher').length,
    totalUsage: sentences.reduce((sum, s) => sum + s.usage_count, 0)
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Speed Builder Content Manager
            </h1>
            <p className="text-gray-600">
              Create and manage custom sentences for your Speed Builder assignments
            </p>
          </div>
          <div className="flex space-x-3">
            <Link href="/dashboard/content/speed-builder/bulk-upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-3 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors"
              >
                <Upload className="w-5 h-5 inline mr-2" />
                Bulk Upload
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Create Sentence
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 shadow-md border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Sentences</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.foundation}</div>
                <div className="text-sm text-gray-600">Foundation</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.higher}</div>
                <div className="text-sm text-gray-600">Higher</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-orange-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.totalUsage}</div>
                <div className="text-sm text-gray-600">Total Uses</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <select
              value={filter.difficulty}
              onChange={(e) => setFilter(prev => ({ ...prev, difficulty: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Curriculum Tier
            </label>
            <select
              value={filter.tier}
              onChange={(e) => setFilter(prev => ({ ...prev, tier: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Tiers</option>
              <option value="Foundation">Foundation</option>
              <option value="Higher">Higher</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grammar Focus
            </label>
            <select
              value={filter.grammarFocus}
              onChange={(e) => setFilter(prev => ({ ...prev, grammarFocus: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Grammar Points</option>
              {grammarFocusOptions.map(option => (
                <option key={option} value={option}>
                  {option.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingSentence ? 'Edit Sentence' : 'Create New Sentence'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Spanish Sentence *
                    </label>
                    <textarea
                      value={formData.spanish_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, spanish_text: e.target.value }))}
                      placeholder="Enter the Spanish sentence..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      English Translation *
                    </label>
                    <textarea
                      value={formData.english_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, english_text: e.target.value }))}
                      placeholder="Enter the English translation..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grammar Focus
                    </label>
                    <select
                      value={formData.grammar_focus}
                      onChange={(e) => setFormData(prev => ({ ...prev, grammar_focus: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select grammar focus</option>
                      {grammarFocusOptions.map(option => (
                        <option key={option} value={option}>
                          {option.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={formData.difficulty_level}
                      onChange={(e) => setFormData(prev => ({ ...prev, difficulty_level: e.target.value as 'easy' | 'medium' | 'hard' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Curriculum Tier
                    </label>
                    <select
                      value={formData.curriculum_tier}
                      onChange={(e) => setFormData(prev => ({ ...prev, curriculum_tier: e.target.value as 'Foundation' | 'Higher' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Foundation">Foundation</option>
                      <option value="Higher">Higher</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Theme
                    </label>
                    <select
                      value={formData.theme}
                      onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select theme</option>
                      {themeOptions.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={formData.topic}
                      onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                      placeholder="Enter specific topic (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.spanish_text || !formData.english_text}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? 'Saving...' : editingSentence ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sentences List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Your Sentences ({filteredSentences.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sentences...</p>
          </div>
        ) : filteredSentences.length === 0 ? (
          <div className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sentences found</h3>
            <p className="text-gray-600 mb-4">
              Create your first custom sentence to get started!
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Your First Sentence
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredSentences.map((sentence) => (
              <motion.div
                key={sentence.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2">
                      <div className="text-lg font-medium text-gray-900 mb-1">
                        {sentence.spanish_text}
                      </div>
                      <div className="text-gray-600 italic">
                        {sentence.english_text}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sentence.difficulty_level === 'easy' ? 'bg-green-100 text-green-800' :
                        sentence.difficulty_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sentence.difficulty_level}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sentence.curriculum_tier === 'Foundation' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {sentence.curriculum_tier}
                      </span>
                      {sentence.grammar_focus && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          {sentence.grammar_focus.replace('-', ' ')}
                        </span>
                      )}
                      {sentence.theme && (
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                          {sentence.theme}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Used {sentence.usage_count} times
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Created {new Date(sentence.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(sentence)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit sentence"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sentence.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete sentence"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 