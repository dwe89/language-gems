'use client';

import React, { useState, useEffect } from 'react';
import {
  X, Save, Plus, Trash2, Edit, Filter, Download, Upload,
  BookOpen, Loader2, AlertCircle, CheckCircle
} from 'lucide-react';

interface Question {
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'gap-fill';
  options?: string[];
  correct_answer: string | string[];
  points?: number;
  explanation?: string;
}

interface ReadingTask {
  id: string;
  title: string;
  language: string;
  curriculum_level?: string;
  exam_board?: string;
  theme_topic?: string;
  category?: string;
  subcategory?: string;
  difficulty: string;
  content: string;
  word_count?: number;
  estimated_reading_time?: number;
  reading_comprehension_questions?: any[];
}

interface Category {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  displayName: string;
  categoryId: string;
}

interface EdexcelTheme {
  id: string;
  name: string;
  topics: EdexcelTopic[];
}

interface EdexcelTopic {
  id: string;
  name: string;
}

interface ReadingComprehensionAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function ReadingComprehensionAdminModal({
  isOpen,
  onClose,
  onRefresh,
}: ReadingComprehensionAdminModalProps) {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [tasks, setTasks] = useState<ReadingTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<ReadingTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Categories from API
  const [categories, setCategories] = useState<Category[]>([]);

  // AQA themes (hardcoded structure)
  const aqaThemes = [
    {
      id: 'people_lifestyle',
      name: 'Theme 1: People and lifestyle',
      topics: [
        { id: 'identity_relationships', name: 'Identity and relationships with others' },
        { id: 'healthy_living_lifestyle', name: 'Healthy living and lifestyle' },
        { id: 'education_work', name: 'Education and work' }
      ]
    },
    {
      id: 'popular_culture',
      name: 'Popular culture',
      topics: [
        { id: 'free_time_activities', name: 'Free-time activities' },
        { id: 'customs_festivals', name: 'Customs, festivals, traditions and celebrations' },
        { id: 'celebrity_culture', name: 'Celebrity culture' }
      ]
    },
    {
      id: 'communication_world',
      name: 'Communication and the world around us',
      topics: [
        { id: 'travel_tourism', name: 'Travel and tourism, including places of interest' },
        { id: 'media_technology', name: 'Media and technology' },
        { id: 'environment_where_people_live', name: 'The environment and where people live' }
      ]
    }
  ];

  // Edexcel themes (hardcoded structure)
  const edexcelThemes: EdexcelTheme[] = [
    {
      id: 'my_personal_world',
      name: 'My personal world',
      topics: [
        { id: 'family', name: 'Family' },
        { id: 'friends_relationships', name: 'Friends and relationships' },
        { id: 'home', name: 'Home' },
        { id: 'equality', name: 'Equality' }
      ]
    },
    {
      id: 'lifestyle_wellbeing',
      name: 'Lifestyle and wellbeing',
      topics: [
        { id: 'physical_wellbeing', name: 'Physical wellbeing' },
        { id: 'mental_wellbeing', name: 'Mental wellbeing' },
        { id: 'healthy_living', name: 'Healthy living' },
        { id: 'food_drink', name: 'Food and drink' },
        { id: 'sports', name: 'Sports' },
        { id: 'illnesses', name: 'Illnesses' }
      ]
    },
    {
      id: 'my_neighbourhood',
      name: 'My neighbourhood',
      topics: [
        { id: 'home_local_area', name: 'Home and local area' },
        { id: 'places_in_town', name: 'Places in town' },
        { id: 'shopping', name: 'Shopping' },
        { id: 'natural_world', name: 'The natural world' },
        { id: 'environmental_issues', name: 'Environmental issues' }
      ]
    },
    {
      id: 'media_technology',
      name: 'Media and technology',
      topics: [
        { id: 'life_online', name: 'Life online - advantages and disadvantages' },
        { id: 'technology', name: 'Technology' },
        { id: 'tv_film', name: 'TV and film' },
        { id: 'music', name: 'Music' },
        { id: 'social_media', name: 'Social media' },
        { id: 'gaming', name: 'Gaming' }
      ]
    },
    {
      id: 'studying_future',
      name: 'Studying and my future',
      topics: [
        { id: 'school_subjects', name: 'School subjects' },
        { id: 'school_opinions', name: 'Opinions about school' },
        { id: 'school_rules', name: 'School rules' },
        { id: 'future_plans', name: 'Future plans' },
        { id: 'current_employment', name: 'Current employment' },
        { id: 'future_employment', name: 'Future employment' }
      ]
    },
    {
      id: 'travel_tourism',
      name: 'Travel and tourism',
      topics: [
        { id: 'holidays', name: 'Holidays' },
        { id: 'transport', name: 'Transport' },
        { id: 'accommodation', name: 'Accommodation' },
        { id: 'planning_holidays', name: 'Planning and describing a holiday' },
        { id: 'weather', name: 'Weather' },
        { id: 'tourist_attractions', name: 'Tourist attractions' }
      ]
    }
  ];

  // Filters
  const [filterLanguage, setFilterLanguage] = useState<string>('');
  const [filterCurriculum, setFilterCurriculum] = useState<string>('');
  const [filterExamBoard, setFilterExamBoard] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterSubcategory, setFilterSubcategory] = useState<string>('');
  const [filterThemeTopic, setFilterThemeTopic] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');

  // Form state
  const [editingTask, setEditingTask] = useState<ReadingTask | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    language: 'spanish',
    curriculum_level: '',
    exam_board: '',
    theme_topic: '',
    category: '',
    subcategory: '',
    difficulty: 'foundation',
    content: '',
    word_count: 0,
    estimated_reading_time: 0,
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonInput, setJsonInput] = useState('');



  useEffect(() => {
    if (isOpen) {
      loadTasks();
      loadCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    applyFilters();
  }, [tasks, filterLanguage, filterCurriculum, filterExamBoard, filterCategory, filterSubcategory, filterThemeTopic, filterDifficulty]);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/reading-comprehension/tasks');
      if (!response.ok) throw new Error('Failed to load tasks');

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/reading-comprehension/categories');
      if (!response.ok) throw new Error('Failed to load categories');

      const data = await response.json();
      if (data.success && data.categories) {
        setCategories(data.categories.ks3 || []);
      }
    } catch (err: any) {
      console.error('Error loading categories:', err);
    }
  };

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    if (filterLanguage) {
      filtered = filtered.filter(t => t.language === filterLanguage);
    }
    if (filterCurriculum) {
      filtered = filtered.filter(t => t.curriculum_level === filterCurriculum);
    }
    if (filterExamBoard) {
      filtered = filtered.filter(t => t.exam_board === filterExamBoard);
    }
    if (filterCategory) {
      filtered = filtered.filter(t => t.category === filterCategory);
    }
    if (filterSubcategory) {
      filtered = filtered.filter(t => t.subcategory === filterSubcategory);
    }
    if (filterThemeTopic) {
      filtered = filtered.filter(t => t.theme_topic === filterThemeTopic);
    }
    if (filterDifficulty) {
      filtered = filtered.filter(t => t.difficulty === filterDifficulty);
    }

    setFilteredTasks(filtered);
  };

  const handleCreate = () => {
    setView('create');
    setEditingTask(null);
    setFormData({
      title: '',
      language: 'spanish',
      curriculum_level: '',
      exam_board: '',
      theme_topic: '',
      category: '',
      subcategory: '',
      difficulty: 'foundation',
      content: '',
      word_count: 0,
      estimated_reading_time: 0,
    });
    setQuestions([]);
    setJsonMode(false);
    setJsonInput('');
  };

  const handleEdit = (task: ReadingTask) => {
    setView('edit');
    setEditingTask(task);
    setFormData({
      title: task.title,
      language: task.language,
      curriculum_level: task.curriculum_level || '',
      exam_board: task.exam_board || '',
      theme_topic: task.theme_topic || '',
      category: task.category || '',
      subcategory: task.subcategory || '',
      difficulty: task.difficulty,
      content: task.content,
      word_count: task.word_count || 0,
      estimated_reading_time: task.estimated_reading_time || 0,
    });
    setQuestions(task.reading_comprehension_questions?.map(q => ({
      question: q.question,
      type: q.type,
      options: q.options,
      correct_answer: q.correct_answer,
      points: q.points,
      explanation: q.explanation,
    })) || []);
    setJsonMode(false);
    setJsonInput('');
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this reading comprehension task?')) {
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/reading-comprehension/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) throw new Error('Failed to delete task');

      showSuccessToast('Task deleted successfully');
      await loadTasks();
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      let questionsData = questions;

      // If JSON mode, parse the JSON input
      if (jsonMode) {
        try {
          const parsed = JSON.parse(jsonInput);
          questionsData = parsed.questions || [];
          
          // Update form data from JSON if provided
          if (parsed.title) formData.title = parsed.title;
          if (parsed.content) formData.content = parsed.content;
          if (parsed.difficulty) formData.difficulty = parsed.difficulty;
        } catch (e) {
          throw new Error('Invalid JSON format');
        }
      }

      const endpoint = view === 'create'
        ? '/api/admin/reading-comprehension/create'
        : '/api/admin/reading-comprehension/update';

      // Sanitize formData based on curriculum level
      const sanitizedFormData = { ...formData };

      // KS3: Clear theme_topic, keep category/subcategory
      if (sanitizedFormData.curriculum_level === 'ks3') {
        sanitizedFormData.theme_topic = '';
      }

      // KS4: Clear category/subcategory, keep theme_topic
      if (sanitizedFormData.curriculum_level === 'ks4') {
        sanitizedFormData.category = '';
        sanitizedFormData.subcategory = '';
      }

      const payload = view === 'create'
        ? { ...sanitizedFormData, questions: questionsData }
        : { taskId: editingTask?.id, updates: sanitizedFormData, questions: questionsData };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save task');
      }

      showSuccessToast(view === 'create' ? 'Task created successfully' : 'Task updated successfully');
      await loadTasks();
      onRefresh();
      setView('list');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleExportJSON = () => {
    const exportData = {
      ...formData,
      questions,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reading-task-${formData.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correct_answer: '',
      points: 1,
      explanation: '',
    }]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    (updated[index] as any)[field] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">
              {view === 'list' ? 'Manage Reading Comprehension' : view === 'create' ? 'Create New Task' : 'Edit Task'}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {view === 'list' ? 'View, edit, and manage all reading comprehension tasks' : 'Configure task details and questions'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* LIST VIEW */}
          {view === 'list' && (
            <>
              {/* Filters */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-4">
                  <Filter className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                </div>

                {/* First Row: Language, Curriculum, Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={filterLanguage}
                      onChange={(e) => setFilterLanguage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Languages</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Curriculum</label>
                    <select
                      value={filterCurriculum}
                      onChange={(e) => {
                        setFilterCurriculum(e.target.value);
                        // Reset filters when curriculum changes
                        setFilterExamBoard('');
                        setFilterCategory('');
                        setFilterSubcategory('');
                        setFilterThemeTopic('');
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Levels</option>
                      <option value="ks3">KS3</option>
                      <option value="ks4">KS4</option>
                      <option value="ks5">KS5</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <select
                      value={filterDifficulty}
                      onChange={(e) => setFilterDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Difficulties</option>
                      <option value="foundation">Foundation</option>
                      <option value="higher">Higher</option>
                    </select>
                  </div>
                </div>

                {/* Second Row: Conditional filters based on curriculum */}
                {filterCurriculum === 'ks3' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category (KS3)</label>
                      <select
                        value={filterCategory}
                        onChange={(e) => {
                          setFilterCategory(e.target.value);
                          setFilterSubcategory('');
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.displayName}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory (KS3)</label>
                      <select
                        value={filterSubcategory}
                        onChange={(e) => setFilterSubcategory(e.target.value)}
                        disabled={!filterCategory}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      >
                        <option value="">All Subcategories</option>
                        {filterCategory && categories
                          .find(cat => cat.id === filterCategory)
                          ?.subcategories.map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.displayName}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                )}

                {filterCurriculum === 'ks4' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Exam Board (KS4)</label>
                      <select
                        value={filterExamBoard}
                        onChange={(e) => {
                          setFilterExamBoard(e.target.value);
                          setFilterThemeTopic('');
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Exam Boards</option>
                        <option value="aqa">AQA</option>
                        <option value="edexcel">Edexcel</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Theme/Topic (KS4)</label>
                      {filterExamBoard === 'aqa' ? (
                        <select
                          value={filterThemeTopic}
                          onChange={(e) => setFilterThemeTopic(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Themes/Topics</option>
                          {aqaThemes.map(theme => (
                            <optgroup key={theme.id} label={theme.name}>
                              {theme.topics.map(topic => (
                                <option key={topic.id} value={`${theme.id}_${topic.id}`}>
                                  {topic.name}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      ) : filterExamBoard === 'edexcel' ? (
                        <select
                          value={filterThemeTopic}
                          onChange={(e) => setFilterThemeTopic(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Themes/Topics</option>
                          {edexcelThemes.map(theme => (
                            <optgroup key={theme.id} label={theme.name}>
                              {theme.topics.map(topic => (
                                <option key={topic.id} value={`${theme.id}:${topic.id}`}>
                                  {topic.name}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      ) : (
                        <select
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        >
                          <option value="">Select exam board first</option>
                        </select>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Create Button */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tasks ({filteredTasks.length})
                </h3>
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create New Task
                </button>
              </div>

              {/* Tasks List */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No tasks found matching your filters</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map((task) => {
                    // Helper function to format theme/topic display
                    const formatThemeTopic = (themeTopic: string | undefined, examBoard: string | undefined) => {
                      if (!themeTopic) return null;

                      if (examBoard === 'aqa') {
                        // AQA format: theme_id_topic_id
                        const parts = themeTopic.split('_');
                        if (parts.length >= 2) {
                          const themeId = parts[0] + '_' + parts[1]; // e.g., people_lifestyle
                          const topicId = parts.slice(2).join('_'); // e.g., identity_relationships

                          const theme = aqaThemes.find(t => t.id === themeId);
                          const topic = theme?.topics.find(t => t.id === topicId);

                          return {
                            theme: theme?.name || themeId,
                            topic: topic?.name || topicId
                          };
                        }
                      } else if (examBoard === 'edexcel') {
                        // Edexcel format: theme_id:topic_id
                        const [themeId, topicId] = themeTopic.split(':');

                        const theme = edexcelThemes.find(t => t.id === themeId);
                        const topic = theme?.topics.find(t => t.id === topicId);

                        return {
                          theme: theme?.name || themeId,
                          topic: topic?.name || topicId
                        };
                      }

                      return null;
                    };

                    const themeTopicInfo = formatThemeTopic(task.theme_topic, task.exam_board);

                    return (
                      <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">{task.title}</h4>

                            {/* Badges Row */}
                            <div className="flex flex-wrap gap-2 text-sm mb-3">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                {task.language}
                              </span>
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">
                                {task.difficulty}
                              </span>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                              {task.curriculum_level && (
                                <>
                                  <div className="font-medium">Level:</div>
                                  <div className="uppercase">{task.curriculum_level}</div>
                                </>
                              )}

                              {/* KS3: Show Category and Subcategory */}
                              {task.curriculum_level === 'ks3' && task.category && (
                                <>
                                  <div className="font-medium">Category:</div>
                                  <div>{task.category.replace(/_/g, ' ')}</div>
                                  {task.subcategory && (
                                    <>
                                      <div className="font-medium">Topic:</div>
                                      <div>{task.subcategory.replace(/_/g, ' ')}</div>
                                    </>
                                  )}
                                </>
                              )}

                              {/* KS4: Show Exam Board, Theme, and Topic */}
                              {task.curriculum_level === 'ks4' && (
                                <>
                                  {task.exam_board && (
                                    <>
                                      <div className="font-medium">Exam Board:</div>
                                      <div className="uppercase">{task.exam_board}</div>
                                    </>
                                  )}
                                  {themeTopicInfo && (
                                    <>
                                      <div className="font-medium">Theme:</div>
                                      <div>{themeTopicInfo.theme}</div>
                                      <div className="font-medium">Topic:</div>
                                      <div>{themeTopicInfo.topic}</div>
                                    </>
                                  )}
                                </>
                              )}

                              {task.word_count && (
                                <>
                                  <div className="font-medium">{task.word_count} words</div>
                                  <div>{task.estimated_reading_time || 0} min read</div>
                                </>
                              )}

                              <div className="font-medium">Questions:</div>
                              <div>{task.reading_comprehension_questions?.length || 0}</div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEdit(task)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit task"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* CREATE/EDIT VIEW */}
          {(view === 'create' || view === 'edit') && (
            <>
              {/* Back Button */}
              <button
                onClick={() => setView('list')}
                className="mb-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to List
              </button>

              {/* JSON Mode Toggle */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Task Details</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setJsonMode(!jsonMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      jsonMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    JSON Mode
                  </button>
                  {!jsonMode && (
                    <button
                      onClick={handleExportJSON}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export JSON
                    </button>
                  )}
                </div>
              </div>

              {jsonMode ? (
                /* JSON Input Mode */
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste JSON (must include title, content, difficulty, and questions array)
                  </label>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    rows={20}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder={`{
  "title": "Food and Restaurants",
  "language": "spanish",
  "difficulty": "foundation",
  "content": "Your reading passage here...",
  "questions": [
    {
      "question": "What is the main topic?",
      "type": "multiple-choice",
      "options": ["Food", "Sports", "Travel", "School"],
      "correct_answer": "Food",
      "points": 1
    }
  ]
}`}
                  />
                </div>
              ) : (
                /* Form Input Mode - Continue in next part */
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language *
                      </label>
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                      </select>
                    </div>
                  </div>

                  {/* Curriculum & Classification */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Curriculum Level
                      </label>
                      <select
                        value={formData.curriculum_level}
                        onChange={(e) => {
                          const newLevel = e.target.value;
                          // Clear category/subcategory when switching to KS4
                          // Clear theme_topic when switching to KS3
                          if (newLevel === 'ks4') {
                            setFormData({
                              ...formData,
                              curriculum_level: newLevel,
                              category: '',
                              subcategory: ''
                            });
                          } else if (newLevel === 'ks3') {
                            setFormData({
                              ...formData,
                              curriculum_level: newLevel,
                              theme_topic: ''
                            });
                          } else {
                            setFormData({ ...formData, curriculum_level: newLevel });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">None</option>
                        <option value="ks3">KS3</option>
                        <option value="ks4">KS4</option>
                        <option value="ks5">KS5</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exam Board
                      </label>
                      <select
                        value={formData.exam_board}
                        onChange={(e) => setFormData({ ...formData, exam_board: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">None</option>
                        <option value="aqa">AQA</option>
                        <option value="edexcel">Edexcel</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty *
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="foundation">Foundation</option>
                        <option value="higher">Higher</option>
                      </select>
                    </div>
                  </div>

                  {/* KS3: Category & Subcategory */}
                  {formData.curriculum_level === 'ks3' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category (KS3)
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => {
                            setFormData({ ...formData, category: e.target.value, subcategory: '' });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select category</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.displayName}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subcategory (KS3)
                        </label>
                        <select
                          value={formData.subcategory}
                          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                          disabled={!formData.category}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        >
                          <option value="">Select subcategory</option>
                          {formData.category && categories
                            .find(cat => cat.id === formData.category)
                            ?.subcategories.map(sub => (
                              <option key={sub.id} value={sub.id}>{sub.displayName}</option>
                            ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* KS4: Theme/Topic - Conditional based on exam board */}
                  {formData.curriculum_level === 'ks4' && formData.exam_board === 'aqa' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        AQA Theme/Topic
                      </label>
                      <select
                        value={formData.theme_topic}
                        onChange={(e) => setFormData({ ...formData, theme_topic: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select theme/topic</option>
                        {aqaThemes.map(theme => (
                          <optgroup key={theme.id} label={theme.name}>
                            {theme.topics.map(topic => (
                              <option key={topic.id} value={`${theme.id}_${topic.id}`}>
                                {topic.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  )}

                  {formData.curriculum_level === 'ks4' && formData.exam_board === 'edexcel' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Edexcel Theme/Topic
                      </label>
                      <select
                        value={formData.theme_topic}
                        onChange={(e) => setFormData({ ...formData, theme_topic: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select theme/topic</option>
                        {edexcelThemes.map(theme => (
                          <optgroup key={theme.id} label={theme.name}>
                            {theme.topics.map(topic => (
                              <option key={topic.id} value={`${theme.id}:${topic.id}`}>
                                {topic.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  )}

                  {formData.curriculum_level === 'ks4' && !formData.exam_board && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme/Topic
                      </label>
                      <input
                        type="text"
                        value={formData.theme_topic}
                        onChange={(e) => setFormData({ ...formData, theme_topic: e.target.value })}
                        placeholder="Select an exam board (AQA or Edexcel) to see theme options"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Please select an exam board above
                      </p>
                    </div>
                  )}

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reading Passage *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => {
                        const content = e.target.value;
                        const wordCount = content.trim().split(/\s+/).length;
                        const readingTime = Math.ceil(wordCount / 200);
                        setFormData({
                          ...formData,
                          content,
                          word_count: wordCount,
                          estimated_reading_time: readingTime
                        });
                      }}
                      rows={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter the reading passage in the target language..."
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.word_count} words • ~{formData.estimated_reading_time} min read
                    </p>
                  </div>

                  {/* Questions Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
                      <button
                        onClick={addQuestion}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Question
                      </button>
                    </div>

                    {questions.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">No questions yet. Click "Add Question" to create one.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {questions.map((q, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">Question {index + 1}</h4>
                              <button
                                onClick={() => removeQuestion(index)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-3">
                              {/* Question Text */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Question Text
                                </label>
                                <input
                                  type="text"
                                  value={q.question}
                                  onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter the question..."
                                />
                              </div>

                              {/* Question Type & Points */}
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                  </label>
                                  <select
                                    value={q.type}
                                    onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="multiple-choice">Multiple Choice</option>
                                    <option value="true-false">True/False</option>
                                    <option value="short-answer">Short Answer</option>
                                    <option value="gap-fill">Gap Fill</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Points
                                  </label>
                                  <input
                                    type="number"
                                    value={q.points}
                                    onChange={(e) => updateQuestion(index, 'points', parseInt(e.target.value))}
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>

                              {/* Options (for multiple-choice) */}
                              {q.type === 'multiple-choice' && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Options (one per line)
                                  </label>
                                  <div className="space-y-2">
                                    {(q.options || []).map((opt, optIndex) => (
                                      <input
                                        key={optIndex}
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                          const newOptions = [...(q.options || [])];
                                          newOptions[optIndex] = e.target.value;
                                          updateQuestion(index, 'options', newOptions);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder={`Option ${optIndex + 1}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Correct Answer */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Correct Answer
                                </label>
                                {q.type === 'multiple-choice' ? (
                                  <select
                                    value={q.correct_answer as string}
                                    onChange={(e) => updateQuestion(index, 'correct_answer', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="">Select correct answer</option>
                                    {(q.options || []).map((opt, optIndex) => (
                                      <option key={optIndex} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                ) : q.type === 'true-false' ? (
                                  <select
                                    value={q.correct_answer as string}
                                    onChange={(e) => updateQuestion(index, 'correct_answer', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="">Select answer</option>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                  </select>
                                ) : (
                                  <input
                                    type="text"
                                    value={q.correct_answer as string}
                                    onChange={(e) => updateQuestion(index, 'correct_answer', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter the correct answer..."
                                  />
                                )}
                              </div>

                              {/* Explanation (optional) */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Explanation (optional)
                                </label>
                                <textarea
                                  value={q.explanation}
                                  onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                                  rows={2}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  placeholder="Explain why this is the correct answer..."
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {(view === 'create' || view === 'edit') && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3">
            <button
              onClick={() => setView('list')}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !formData.title || !formData.content}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {view === 'create' ? 'Create Task' : 'Update Task'}
                </>
              )}
            </button>
          </div>
        )}
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[200]">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}

