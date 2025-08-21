'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Users, Calendar, Clock, Settings, Plus, X, Check, 
  ChevronDown, Search, Filter, ArrowLeft, ArrowRight, Save, Upload
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { supabaseBrowser } from '../auth/AuthProvider';
import WorkingInlineVocabularyCreator from './WorkingInlineVocabularyCreator';

// Simplified game list without massive icons
const AVAILABLE_GAMES = [
  { id: 'vocabulary-mining', name: 'Vocabulary Mining', type: 'vocabulary', duration: '15 min', icon: '⛏️', category: 'Vocabulary' },
  { id: 'memory-game', name: 'Memory Match', type: 'vocabulary', duration: '10 min', icon: '🧠', category: 'Vocabulary' },
  { id: 'hangman', name: 'Hangman', type: 'vocabulary', duration: '8 min', icon: '🎯', category: 'Vocabulary' },
  { id: 'vocab-blast', name: 'Vocab Blast', type: 'vocabulary', duration: '12 min', icon: '💥', category: 'Vocabulary' },
  { id: 'word-scramble', name: 'Word Scramble', type: 'vocabulary', duration: '6 min', icon: '🔀', category: 'Vocabulary' },
  { id: 'noughts-and-crosses', name: 'Noughts & Crosses', type: 'vocabulary', duration: '5 min', icon: '⭕', category: 'Vocabulary' },
  { id: 'word-guesser', name: 'Word Guesser', type: 'vocabulary', duration: '8 min', icon: '🤔', category: 'Vocabulary' },
  { id: 'vocab-master', name: 'Vocab Master', type: 'vocabulary', duration: '12 min', icon: '🏆', category: 'Vocabulary' },
  { id: 'speed-builder', name: 'Speed Builder', type: 'sentence', duration: '10 min', icon: '⚡', category: 'Sentence' },
  { id: 'sentence-towers', name: 'Sentence Towers', type: 'sentence', duration: '12 min', icon: '🏗️', category: 'Sentence' },
  { id: 'conjugation-duel', name: 'Conjugation Duel', type: 'grammar', duration: '15 min', icon: '⚔️', category: 'Grammar' },
  { id: 'detective-listening', name: 'Detective Listening', type: 'listening', duration: '12 min', icon: '🕵️', category: 'Listening' },
  { id: 'word-blast', name: 'Word Blast', type: 'vocabulary', duration: '10 min', icon: '🚀', category: 'Vocabulary' },
  { id: 'gem-collector', name: 'Gem Collector', type: 'vocabulary', duration: '8 min', icon: '💎', category: 'Vocabulary' },
  { id: 'verb-quest', name: 'Verb Quest', type: 'grammar', duration: '18 min', icon: '🗡️', category: 'Grammar' },
  { id: 'case-file-translator', name: 'Case File Translator', type: 'translation', duration: '14 min', icon: '📁', category: 'Translation' },
  { id: 'lava-temple-word-restore', name: 'Lava Temple', type: 'vocabulary', duration: '10 min', icon: '🌋', category: 'Vocabulary' }
];

const CURRICULUM_LEVELS = [
  { id: 'KS3', name: 'KS3 (Year 7-9)', description: 'Foundation level' },
  { id: 'KS4', name: 'KS4 (GCSE)', description: 'Advanced level' }
];

const CONTENT_CATEGORIES = [
  { 
    id: 'basics_core_language', 
    name: 'Basics & Core Language', 
    topics: 24,
    subcategories: ['greetings', 'numbers', 'dates_time', 'weather', 'directions', 'personal_information']
  },
  { 
    id: 'food_drink', 
    name: 'Food & Drink', 
    topics: 8,
    subcategories: ['restaurant_vocabulary', 'food_items', 'drinks_beverages', 'cooking_terms']
  },
  { 
    id: 'family_relationships', 
    name: 'Family & Relationships', 
    topics: 6,
    subcategories: ['family_members', 'relationships', 'describing_people']
  },
  { 
    id: 'school_education', 
    name: 'School & Education', 
    topics: 12,
    subcategories: ['school_subjects', 'classroom_objects', 'education_system', 'university_life']
  },
  { 
    id: 'home_local_area', 
    name: 'Home & Local Area', 
    topics: 10,
    subcategories: ['home_rooms', 'furniture', 'local_amenities', 'neighborhood']
  },
  { 
    id: 'free_time_leisure', 
    name: 'Free Time & Leisure', 
    topics: 15,
    subcategories: ['sports', 'hobbies', 'entertainment', 'music', 'reading']
  },
  { 
    id: 'holidays_travel_culture', 
    name: 'Holidays, Travel & Culture', 
    topics: 18,
    subcategories: ['travel_transport', 'accommodation', 'cultural_events', 'traditions', 'sightseeing']
  },
  { 
    id: 'health_lifestyle', 
    name: 'Health & Lifestyle', 
    topics: 12,
    subcategories: ['health_problems', 'body_parts', 'exercise_fitness', 'healthy_living']
  }
];

interface CompactAssignmentCreatorProps {
  onAssignmentCreated?: (assignmentId: string) => void;
  onCancel?: () => void;
}

export default function CompactAssignmentCreator({ 
  onAssignmentCreated, 
  onCancel 
}: CompactAssignmentCreatorProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // State
  const [classes, setClasses] = useState<any[]>([]);
  const [customLists, setCustomLists] = useState<any[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    curriculum_level: 'KS3',
    due_date: '',
    assessment_type: 'formative',
    max_attempts: 3
  });
  const [contentConfig, setContentConfig] = useState({
    source: 'categories',
    categories: [] as string[],
    customListIds: [] as string[],
    word_count: 20,
    language: 'spanish',
    custom_list_id: '',
    show_custom_creator: false
  });

  const steps = [
    { id: 'basic', title: 'Basic Info', icon: BookOpen },
    { id: 'games', title: 'Select Games', icon: Settings },
    { id: 'content', title: 'Content', icon: Filter },
    { id: 'review', title: 'Review', icon: Check }
  ];

  // Fetch classes
  useEffect(() => {
    if (!user) return;
    fetchClasses();
    fetchCustomLists();
  }, [user]);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabaseBrowser
        .from('classes')
        .select('*')
        .eq('teacher_id', user?.id);
      
      if (!error) {
        setClasses(data || []);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchCustomLists = async () => {
    try {
      const { data, error } = await supabaseBrowser
        .from('enhanced_vocabulary_lists')
        .select('id, name, word_count, language, content_type, difficulty_level, folder_id')
        .eq('teacher_id', user?.id)
        .order('created_at', { ascending: false });

      if (!error) {
        setCustomLists(data || []);
      }
    } catch (error) {
      console.error('Error fetching custom lists:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGameToggle = (gameId: string) => {
    setSelectedGames(prev => 
      prev.includes(gameId)
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };

  const handleCategoryToggle = (categoryId: string) => {
    setContentConfig(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleSubmit = async () => {
    if (selectedClasses.length === 0 || selectedGames.length === 0) {
      alert('Please select at least one class and one game');
      return;
    }

    setLoading(true);
    try {
      // Create assignment for each selected class
      for (const classId of selectedClasses) {
        const assignmentData = {
          title: formData.title,
          description: formData.description,
          teacher_id: user?.id,
          class_id: classId,
          game_type: selectedGames[0], // Primary game
          curriculum_level: formData.curriculum_level,
          due_date: formData.due_date,
          assessment_type: formData.assessment_type,
          max_attempts: formData.max_attempts,
          config: {
            selectedGames,
            contentConfig,
            vocabulary_selection: {
              type: 'category_based',
              categories: contentConfig.categories,
              language: contentConfig.language,
              wordCount: contentConfig.word_count
            }
          }
        };

        const { data, error } = await supabaseBrowser
          .from('assignments')
          .insert(assignmentData)
          .select()
          .single();

        if (error) throw error;
      }

      onAssignmentCreated?.('success');
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Error creating assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Create Smart Assignment</h1>
              <p className="text-purple-200 mt-2">Design engaging learning experiences for your students</p>
            </div>
            <div className="text-sm text-purple-200 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  index <= currentStep 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                    : 'bg-white/20 text-purple-200'
                }`}>
                  {index < currentStep ? <Check size={18} /> : index + 1}
                </div>
                <span className={`ml-3 text-sm font-medium ${
                  index <= currentStep ? 'text-white' : 'text-purple-300'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-px mx-6 transition-all ${
                    index < currentStep ? 'bg-green-500' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form Content */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="min-h-[500px]">
        {/* Step 1: Basic Info */}
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Assignment Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Week 3 Spanish Vocabulary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Curriculum Level *
                </label>
                <select
                  value={formData.curriculum_level}
                  onChange={(e) => setFormData(prev => ({ ...prev, curriculum_level: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent text-gray-900"
                >
                  {CURRICULUM_LEVELS.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.name} - {level.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Assessment Type
                </label>
                <select
                  value={formData.assessment_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, assessment_type: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent text-gray-900"
                >
                  <option value="formative">Formative Assessment</option>
                  <option value="summative">Summative Assessment</option>
                  <option value="diagnostic">Diagnostic Assessment</option>
                  <option value="practice">Practice Session</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Max Attempts
                </label>
                <select
                  value={formData.max_attempts}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_attempts: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent text-gray-900"
                >
                  <option value={1}>1 attempt</option>
                  <option value={2}>2 attempts</option>
                  <option value={3}>3 attempts</option>
                  <option value={5}>5 attempts</option>
                  <option value={-1}>Unlimited</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Add instructions or context for this assignment..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Assign to Classes * (Select multiple)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {classes.map(cls => (
                  <label key={cls.id} className="flex items-center p-4 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 cursor-pointer transition-all backdrop-blur-sm">
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(cls.id)}
                      onChange={() => {
                        setSelectedClasses(prev => 
                          prev.includes(cls.id)
                            ? prev.filter(id => id !== cls.id)
                            : [...prev, cls.id]
                        );
                      }}
                      className="mr-3 w-4 h-4 text-purple-600 bg-white/90 border-white/20 rounded focus:ring-purple-300"
                    />
                    <div>
                      <div className="font-medium text-white">{cls.name}</div>
                      <div className="text-sm text-purple-200">{cls.year_group} • {cls.subject}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Game Selection */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Select Games</h3>
            <p className="text-purple-200 mb-6">Choose up to 5 games for your assignment ({selectedGames.length} selected)</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AVAILABLE_GAMES.map(game => (
                <label
                  key={game.id}
                  className={`flex items-center p-4 rounded-xl cursor-pointer transition-all backdrop-blur-sm border ${
                    selectedGames.includes(game.id)
                      ? 'bg-green-500/20 border-green-400 shadow-lg shadow-green-500/20'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedGames.includes(game.id)}
                    onChange={() => handleGameToggle(game.id)}
                    className="mr-3 w-4 h-4 text-green-500 bg-white/90 border-white/20 rounded focus:ring-green-300"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">{game.name}</div>
                    <div className="text-sm text-purple-200 capitalize">
                      {game.type} • {game.duration}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Content Selection */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Configure Content</h3>
            
            {/* Content Source Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-3">
                Content Source
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`flex items-center p-4 rounded-xl cursor-pointer transition-all backdrop-blur-sm border ${
                  contentConfig.source === 'categories'
                    ? 'bg-purple-500/20 border-purple-400'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}>
                  <input
                    type="radio"
                    name="contentSource"
                    value="categories"
                    checked={contentConfig.source === 'categories'}
                    onChange={(e) => setContentConfig(prev => ({ 
                      ...prev, 
                      source: e.target.value as 'categories' | 'custom'
                    }))}
                    className="mr-3 w-4 h-4 text-purple-500"
                  />
                  <div>
                    <div className="font-medium text-white">Vocabulary Categories</div>
                    <div className="text-sm text-purple-200">Use pre-built vocabulary topics</div>
                  </div>
                </label>
                
                <label className={`flex items-center p-4 rounded-xl cursor-pointer transition-all backdrop-blur-sm border ${
                  contentConfig.source === 'custom'
                    ? 'bg-purple-500/20 border-purple-400'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}>
                  <input
                    type="radio"
                    name="contentSource"
                    value="custom"
                    checked={contentConfig.source === 'custom'}
                    onChange={(e) => setContentConfig(prev => ({ 
                      ...prev, 
                      source: e.target.value as 'categories' | 'custom'
                    }))}
                    className="mr-3 w-4 h-4 text-purple-500"
                  />
                  <div>
                    <div className="font-medium text-white">Custom Vocabulary</div>
                    <div className="text-sm text-purple-200">Upload or create your own lists</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Language and Word Count */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Language
                </label>
                <select
                  value={contentConfig.language}
                  onChange={(e) => setContentConfig(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent text-gray-900"
                >
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Word Count
                </label>
                <select
                  value={contentConfig.word_count}
                  onChange={(e) => setContentConfig(prev => ({ ...prev, word_count: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent text-gray-900"
                >
                  <option value={10}>10 words</option>
                  <option value={15}>15 words</option>
                  <option value={20}>20 words</option>
                  <option value={25}>25 words</option>
                  <option value={30}>30 words</option>
                </select>
              </div>
            </div>

            {/* Categories Selection */}
            {contentConfig.source === 'categories' && (
              <div>
                <h4 className="font-medium text-white mb-3">
                  Select Categories ({contentConfig.categories.length} selected)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {CONTENT_CATEGORIES.map(category => (
                    <div key={category.id} className="space-y-2">
                      <label className={`flex items-center p-4 rounded-xl cursor-pointer transition-all backdrop-blur-sm border ${
                        contentConfig.categories.includes(category.id)
                          ? 'bg-blue-500/20 border-blue-400'
                          : 'bg-white/10 border-white/20 hover:bg-white/20'
                      }`}>
                        <input
                          type="checkbox"
                          checked={contentConfig.categories.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                          className="mr-3 w-4 h-4 text-blue-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-white">{category.name}</div>
                          <div className="text-sm text-purple-200">{category.topics} topics available</div>
                          <div className="text-xs text-purple-300 mt-1">
                            {category.subcategories.join(', ')}
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Lists Selection */}
            {contentConfig.source === 'custom' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-white mb-3">
                    Select Custom Lists ({contentConfig.customListIds.length} selected)
                  </h4>
                  {customLists.length > 0 ? (
                    <div className="space-y-3">
                      {customLists.map(list => (
                        <label
                          key={list.id}
                          className={`flex items-center p-4 rounded-xl cursor-pointer transition-all backdrop-blur-sm border ${
                            contentConfig.customListIds.includes(list.id)
                              ? 'bg-blue-500/20 border-blue-400'
                              : 'bg-white/10 border-white/20 hover:bg-white/20'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={contentConfig.customListIds.includes(list.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setContentConfig(prev => ({
                                  ...prev,
                                  customListIds: [...prev.customListIds, list.id]
                                }));
                              } else {
                                setContentConfig(prev => ({
                                  ...prev,
                                  customListIds: prev.customListIds.filter(id => id !== list.id)
                                }));
                              }
                            }}
                            className="mr-3 w-4 h-4 text-blue-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-white">{list.name}</div>
                            <div className="text-sm text-purple-200">
                              {list.word_count} items • {list.language} • {list.content_type} • {list.difficulty_level}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-purple-200 bg-white/5 rounded-xl border border-white/10">
                      <p>No custom vocabulary lists found.</p>
                      <p className="text-sm">Create one using the vocabulary creator below.</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/20 pt-6">
                  <h4 className="font-medium text-white mb-3">Create New Vocabulary List</h4>
                  <WorkingInlineVocabularyCreator
                    onSave={(vocabularyData) => {
                      // Create the vocabulary list and add it to customLists
                      const newList = {
                        id: `temp-${Date.now()}`, // Temporary ID - would be replaced by database ID
                        name: vocabularyData.name,
                        word_count: vocabularyData.items.length,
                        language: vocabularyData.language
                      };
                      setCustomLists(prev => [newList, ...prev]);
                      setContentConfig(prev => ({
                        ...prev,
                        customListIds: [...prev.customListIds, newList.id]
                      }));
                    }}
                    onCancel={() => {
                      // Handle cancel if needed
                    }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 4: Review */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Review Assignment</h3>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-white mb-3">Assignment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-200">Title:</span>
                    <span className="text-white font-medium">{formData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Level:</span>
                    <span className="text-white font-medium">{formData.curriculum_level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Classes:</span>
                    <span className="text-white font-medium">{selectedClasses.length} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Due Date:</span>
                    <span className="text-white font-medium">{formData.due_date || 'No due date'}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/20 pt-4">
                <h4 className="font-semibold text-white mb-3">Games ({selectedGames.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedGames.map(gameId => {
                    const game = AVAILABLE_GAMES.find(g => g.id === gameId);
                    return (
                      <div key={gameId} className="flex items-center p-2 bg-white/5 rounded-lg">
                        <span className="text-lg mr-2">{game?.icon}</span>
                        <span className="text-white text-sm font-medium">{game?.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="border-t border-white/20 pt-4">
                <h4 className="font-semibold text-white mb-3">Content Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-200">Language:</span>
                    <span className="text-white font-medium capitalize">{contentConfig.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Categories:</span>
                    <span className="text-white font-medium">{contentConfig.categories.length} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Word Count:</span>
                    <span className="text-white font-medium">{contentConfig.word_count} words</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-white/20">
        <div>
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              className="flex items-center px-4 py-2 text-purple-200 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Previous
            </button>
          )}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-purple-200 hover:text-white transition-colors"
          >
            Cancel
          </button>
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 0 && (!formData.title || selectedClasses.length === 0)) ||
                (currentStep === 1 && selectedGames.length === 0) ||
                (currentStep === 2 && contentConfig.categories.length === 0)
              }
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              Next
              <ArrowRight size={16} className="ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold disabled:opacity-50 transition-all duration-200 shadow-lg"
            >
              <Save size={16} className="mr-2" />
              {loading ? 'Creating...' : 'Create Assignment'}
            </button>
          )}
        </div>
      </div>
    </div>

    {/* Right Column - Assignment Summary */}
    <div className="lg:col-span-1">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 sticky top-6">
              <h3 className="text-xl font-bold text-white mb-4">Assignment Summary</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-200">Students:</span>
                  <span className="text-white font-medium">
                    {selectedClasses.reduce((total, classId) => {
                      const cls = classes.find(c => c.id === classId);
                      return total + (cls?.student_count || 0);
                    }, 0)} students
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-purple-200">Games Selected:</span>
                  <span className="text-white font-medium">{selectedGames.length} games</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-purple-200">Content Source:</span>
                  <span className="text-white font-medium">
                    {contentConfig.source === 'categories' ? 'Categories' : 'Custom Lists'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-purple-200">Estimated Time:</span>
                  <span className="text-white font-medium">
                    {selectedGames.length > 0 ? `${selectedGames.length * 10}-${selectedGames.length * 15} min` : '0 min'}
                  </span>
                </div>
                
                {formData.due_date && (
                  <div className="flex justify-between">
                    <span className="text-purple-200">Due Date:</span>
                    <span className="text-white font-medium">
                      {new Date(formData.due_date).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center justify-center space-x-2 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Time saved: 3.5 hours</span>
                  </div>
                  <p className="text-xs text-purple-200 text-center mt-1">vs. manual creation and grading</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
