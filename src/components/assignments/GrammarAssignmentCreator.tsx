'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  BookOpen, 
  Target, 
  Award, 
  Clock, 
  Users,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Settings
} from 'lucide-react';
import { GemButton, GemCard } from '../ui/GemTheme';

interface GrammarTopic {
  id: string;
  topic_name: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  curriculum_level: string;
  estimated_duration: number;
}

interface GrammarContent {
  id: string;
  topic_id: string;
  content_type: 'lesson' | 'quiz' | 'practice';
  title: string;
  difficulty_level: string;
  estimated_duration: number;
}

interface GrammarAssignmentConfig {
  title: string;
  description: string;
  language: 'es' | 'fr' | 'de';
  curriculum_level: 'KS3' | 'KS4';
  assignment_type: 'lesson' | 'quiz' | 'practice' | 'mixed';
  selected_topics: string[];
  selected_content: string[];
  difficulty_filter: string[];
  time_limit_minutes: number;
  max_attempts: number;
  show_hints: boolean;
  randomize_questions: boolean;
  due_date: string;
  class_id: string;
}

interface GrammarAssignmentCreatorProps {
  onSave: (config: GrammarAssignmentConfig) => void;
  onCancel: () => void;
  classes: Array<{ id: string; name: string }>;
  initialConfig?: Partial<GrammarAssignmentConfig>;
}

const LANGUAGES = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' }
];

const ASSIGNMENT_TYPES = [
  { value: 'lesson', label: 'Lessons Only', icon: BookOpen, description: 'Interactive grammar lessons' },
  { value: 'quiz', label: 'Quizzes Only', icon: Award, description: 'Assessment quizzes' },
  { value: 'practice', label: 'Practice Only', icon: Target, description: 'Practice exercises' },
  { value: 'mixed', label: 'Mixed Content', icon: Brain, description: 'Lessons, quizzes, and practice' }
];

const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'];

export default function GrammarAssignmentCreator({ 
  onSave, 
  onCancel, 
  classes,
  initialConfig 
}: GrammarAssignmentCreatorProps) {
  const [config, setConfig] = useState<GrammarAssignmentConfig>({
    title: '',
    description: '',
    language: 'es',
    curriculum_level: 'KS3',
    assignment_type: 'mixed',
    selected_topics: [],
    selected_content: [],
    difficulty_filter: ['beginner', 'intermediate'],
    time_limit_minutes: 30,
    max_attempts: 3,
    show_hints: true,
    randomize_questions: true,
    due_date: '',
    class_id: '',
    ...initialConfig
  });

  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [content, setContent] = useState<GrammarContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadGrammarData();
  }, [config.language, config.curriculum_level]);

  const loadGrammarData = async () => {
    try {
      setLoading(true);
      
      // Load topics
      const topicsResponse = await fetch(
        `/api/grammar/topics?language=${config.language}&curriculumLevel=${config.curriculum_level}`
      );
      const topicsData = await topicsResponse.json();
      
      if (topicsData.success) {
        setTopics(topicsData.data);
      }

      // Load content
      const contentResponse = await fetch(
        `/api/grammar/content?language=${config.language}`
      );
      const contentData = await contentResponse.json();
      
      if (contentData.success) {
        setContent(contentData.data);
      }
    } catch (error) {
      console.error('Error loading grammar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicToggle = (topicId: string) => {
    setConfig(prev => ({
      ...prev,
      selected_topics: prev.selected_topics.includes(topicId)
        ? prev.selected_topics.filter(id => id !== topicId)
        : [...prev.selected_topics, topicId]
    }));
  };

  const handleContentToggle = (contentId: string) => {
    setConfig(prev => ({
      ...prev,
      selected_content: prev.selected_content.includes(contentId)
        ? prev.selected_content.filter(id => id !== contentId)
        : [...prev.selected_content, contentId]
    }));
  };

  const toggleTopicExpansion = (topicId: string) => {
    setExpandedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      return newSet;
    });
  };

  const getTopicContent = (topicId: string) => {
    return content.filter(item => 
      item.topic_id === topicId && 
      (config.assignment_type === 'mixed' || item.content_type === config.assignment_type) &&
      config.difficulty_filter.includes(item.difficulty_level)
    );
  };

  const calculateEstimatedDuration = () => {
    const selectedContentItems = content.filter(item => 
      config.selected_content.includes(item.id)
    );
    return selectedContentItems.reduce((total, item) => total + item.estimated_duration, 0);
  };

  const handleSave = () => {
    if (!config.title.trim() || !config.class_id || config.selected_topics.length === 0) {
      alert('Please fill in all required fields and select at least one topic.');
      return;
    }
    onSave(config);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Grammar Assignment</h1>
          <p className="text-gray-600">Design comprehensive grammar learning experiences</p>
        </div>
        <div className="flex items-center space-x-3">
          <GemButton variant="secondary" onClick={onCancel}>
            Cancel
          </GemButton>
          <GemButton variant="gem" gemType="rare" onClick={handleSave}>
            Create Assignment
          </GemButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <GemCard title="Assignment Details">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Spanish Verb Conjugations"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={config.description}
                  onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Brief description of the assignment..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language *
                </label>
                <select
                  value={config.language}
                  onChange={(e) => setConfig(prev => ({ ...prev, language: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Curriculum Level *
                </label>
                <select
                  value={config.curriculum_level}
                  onChange={(e) => setConfig(prev => ({ ...prev, curriculum_level: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="KS3">KS3 (Ages 11-14)</option>
                  <option value="KS4">KS4 (Ages 14-16)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Class *
                </label>
                <select
                  value={config.class_id}
                  onChange={(e) => setConfig(prev => ({ ...prev, class_id: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a class...</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={config.due_date}
                  onChange={(e) => setConfig(prev => ({ ...prev, due_date: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </GemCard>

          <GemCard title="Assignment Type">
            <div className="space-y-3">
              {ASSIGNMENT_TYPES.map(type => {
                const Icon = type.icon;
                return (
                  <label
                    key={type.value}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      config.assignment_type === type.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="assignment_type"
                      value={type.value}
                      checked={config.assignment_type === type.value}
                      onChange={(e) => setConfig(prev => ({ ...prev, assignment_type: e.target.value as any }))}
                      className="text-purple-600"
                    />
                    <Icon className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">{type.label}</p>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </GemCard>

          <GemCard title="Settings">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  value={config.time_limit_minutes}
                  onChange={(e) => setConfig(prev => ({ ...prev, time_limit_minutes: parseInt(e.target.value) || 30 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  min="5"
                  max="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Attempts
                </label>
                <input
                  type="number"
                  value={config.max_attempts}
                  onChange={(e) => setConfig(prev => ({ ...prev, max_attempts: parseInt(e.target.value) || 3 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  min="1"
                  max="10"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.show_hints}
                    onChange={(e) => setConfig(prev => ({ ...prev, show_hints: e.target.checked }))}
                    className="text-purple-600"
                  />
                  <span className="text-sm text-gray-700">Allow hints</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={config.randomize_questions}
                    onChange={(e) => setConfig(prev => ({ ...prev, randomize_questions: e.target.checked }))}
                    className="text-purple-600"
                  />
                  <span className="text-sm text-gray-700">Randomize question order</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Levels
                </label>
                <div className="space-y-2">
                  {DIFFICULTY_LEVELS.map(level => (
                    <label key={level} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={config.difficulty_filter.includes(level)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setConfig(prev => ({
                              ...prev,
                              difficulty_filter: [...prev.difficulty_filter, level]
                            }));
                          } else {
                            setConfig(prev => ({
                              ...prev,
                              difficulty_filter: prev.difficulty_filter.filter(l => l !== level)
                            }));
                          }
                        }}
                        className="text-purple-600"
                      />
                      <span className="text-sm text-gray-700 capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </GemCard>
        </div>

        {/* Content Selection Panel */}
        <div className="lg:col-span-2">
          <GemCard title="Select Grammar Topics">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading grammar topics...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topics.map(topic => {
                  const topicContent = getTopicContent(topic.id);
                  const isExpanded = expandedTopics.has(topic.id);
                  const isSelected = config.selected_topics.includes(topic.id);
                  
                  return (
                    <div key={topic.id} className="border border-gray-200 rounded-lg">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleTopicToggle(topic.id)}
                              className="text-purple-600"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                              <p className="text-sm text-gray-600">{topic.description}</p>
                              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                <span className="capitalize">{topic.category}</span>
                                <span className="capitalize">{topic.difficulty_level}</span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>~{topic.estimated_duration} min</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {topicContent.length > 0 && (
                            <button
                              onClick={() => toggleTopicExpansion(topic.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          )}
                        </div>
                        
                        {isExpanded && topicContent.length > 0 && (
                          <div className="mt-4 pl-6 space-y-2">
                            {topicContent.map(contentItem => (
                              <label
                                key={contentItem.id}
                                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                              >
                                <input
                                  type="checkbox"
                                  checked={config.selected_content.includes(contentItem.id)}
                                  onChange={() => handleContentToggle(contentItem.id)}
                                  className="text-purple-600"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">{contentItem.title}</p>
                                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                                    <span className="capitalize">{contentItem.content_type}</span>
                                    <span className="capitalize">{contentItem.difficulty_level}</span>
                                    <span>~{contentItem.estimated_duration} min</span>
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GemCard>

          {/* Summary */}
          {(config.selected_topics.length > 0 || config.selected_content.length > 0) && (
            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Assignment Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-purple-700 font-medium">Topics Selected</p>
                  <p className="text-purple-900">{config.selected_topics.length}</p>
                </div>
                <div>
                  <p className="text-purple-700 font-medium">Content Items</p>
                  <p className="text-purple-900">{config.selected_content.length}</p>
                </div>
                <div>
                  <p className="text-purple-700 font-medium">Estimated Duration</p>
                  <p className="text-purple-900">~{calculateEstimatedDuration()} min</p>
                </div>
                <div>
                  <p className="text-purple-700 font-medium">Assignment Type</p>
                  <p className="text-purple-900 capitalize">{config.assignment_type}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
