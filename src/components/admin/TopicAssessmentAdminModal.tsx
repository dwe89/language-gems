'use client';

import React, { useState, useEffect } from 'react';
import {
  X, Save, Plus, Trash2, Edit, Filter, Download, Upload,
  Target, Loader2, AlertCircle, CheckCircle, BookOpen, FileJson, ListChecks
} from 'lucide-react';

interface TopicAssessment {
  id: string;
  title: string;
  description?: string;
  level: 'foundation' | 'higher';
  language: string;
  identifier: string;
  theme: string;
  topic: string;
  version: string;
  total_questions: number;
  time_limit_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TopicQuestion {
  question_number: number;
  question_type: string;
  title: string;
  instructions: string;
  reading_text?: string;
  marks: number;
  difficulty_rating: number;
  question_data: any;
}

interface TopicAssessmentAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

// AQA Themes and Topics
const AQA_THEMES = [
  {
    id: 'Theme 1: People and lifestyle',
    name: 'Theme 1: People and lifestyle',
    topics: [
      'Identity and relationships with others',
      'Healthy living and lifestyle',
      'Education and work'
    ]
  },
  {
    id: 'Theme 2: Popular culture',
    name: 'Theme 2: Popular culture',
    topics: [
      'Free-time activities',
      'Customs, festivals and celebrations',
      'Celebrity culture'
    ]
  },
  {
    id: 'Theme 3: Communication and the world around us',
    name: 'Theme 3: Communication and the world around us',
    topics: [
      'Travel and tourism, including places of interest',
      'Media and technology',
      'The environment and where people live'
    ]
  }
];

// Edexcel Themes and Topics
const EDEXCEL_THEMES = [
  {
    id: 'Theme 1: Identity and culture',
    name: 'Theme 1: Identity and culture',
    topics: [
      'Me, my family and friends',
      'Technology in everyday life',
      'Free-time activities',
      'Customs and festivals'
    ]
  },
  {
    id: 'Theme 2: Local, national, international and global areas of interest',
    name: 'Theme 2: Local, national, international and global areas of interest',
    topics: [
      'Home, town, neighbourhood and region',
      'Social issues',
      'Global issues',
      'Travel and tourism'
    ]
  },
  {
    id: 'Theme 3: Current and future study and employment',
    name: 'Theme 3: Current and future study and employment',
    topics: [
      'My studies',
      'Life at school/college',
      'Education post-16',
      'Jobs, career choices and ambitions'
    ]
  }
];

// KS3 Topics (simplified, not exam-board specific)
const KS3_TOPICS = [
  'Personal information',
  'Family and friends',
  'School life',
  'Free time and hobbies',
  'Food and drink',
  'Home and local area',
  'Shopping',
  'Weather and seasons',
  'Travel and holidays',
  'Technology and media',
  'Health and fitness',
  'Daily routine'
];

export default function TopicAssessmentAdminModal({
  isOpen,
  onClose,
  onRefresh,
}: TopicAssessmentAdminModalProps) {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [assessments, setAssessments] = useState<TopicAssessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<TopicAssessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Filters
  const [filterLanguage, setFilterLanguage] = useState<string>('');
  const [filterLevel, setFilterLevel] = useState<string>('');
  const [filterTheme, setFilterTheme] = useState<string>('');
  const [filterTopic, setFilterTopic] = useState<string>('');

  // Form state
  const [editingAssessment, setEditingAssessment] = useState<TopicAssessment | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: 'es',
    curriculum_level: 'ks4' as 'ks3' | 'ks4',
    exam_board: 'AQA' as 'AQA' | 'Edexcel',
    level: 'foundation' as 'foundation' | 'higher',
    identifier: '',
    theme: '',
    topic: '',
    version: '1.0',
    total_questions: 5,
    time_limit_minutes: 20,
    is_active: true
  });

  // Question management
  const [questions, setQuestions] = useState<TopicQuestion[]>([]);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  // Paper identifier suggestions
  const [suggestedIdentifiers, setSuggestedIdentifiers] = useState<string[]>([]);

  // Load assessments
  useEffect(() => {
    if (isOpen) {
      loadAssessments();
    }
  }, [isOpen]);

  // Apply filters
  useEffect(() => {
    let filtered = assessments;

    if (filterLanguage) {
      filtered = filtered.filter(a => a.language === filterLanguage);
    }

    if (filterLevel) {
      filtered = filtered.filter(a => a.level === filterLevel);
    }

    if (filterTheme) {
      filtered = filtered.filter(a => a.theme === filterTheme);
    }

    if (filterTopic) {
      filtered = filtered.filter(a => a.topic === filterTopic);
    }

    setFilteredAssessments(filtered);
  }, [assessments, filterLanguage, filterLevel, filterTheme, filterTopic]);

  const loadAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/topic-assessments');
      
      if (!response.ok) {
        throw new Error('Failed to load assessments');
      }

      const data = await response.json();
      const loadedAssessments = data.assessments || [];
      setAssessments(loadedAssessments);
      
      // Generate identifier suggestions based on existing assessments
      const identifiers = loadedAssessments.map((a: TopicAssessment) => a.identifier);
      setSuggestedIdentifiers(identifiers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  // Question management functions
  const addQuestion = () => {
    const newQuestion: TopicQuestion = {
      question_number: questions.length + 1,
      question_type: 'multiple-choice',
      title: '',
      instructions: '',
      reading_text: '',
      marks: 5,
      difficulty_rating: 3,
      question_data: {}
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: keyof TopicQuestion, value: any) => {
    const updated = [...questions];
    (updated[index] as any)[field] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    // Renumber questions
    updated.forEach((q, i) => {
      q.question_number = i + 1;
    });
    setQuestions(updated);
  };

  const handleExportJSON = () => {
    const exportData = {
      ...formData,
      questions
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `topic-assessment-${formData.identifier || 'assessment'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate suggested identifier based on existing ones
  const generateSuggestedIdentifier = () => {
    const { language, level, theme, topic } = formData;
    
    // Create a short code from theme and topic
    const themeCode = theme.includes('Theme 1') ? 'T1' : 
                      theme.includes('Theme 2') ? 'T2' : 
                      theme.includes('Theme 3') ? 'T3' : 'T0';
    
    const topicCode = topic.substring(0, 3).toUpperCase().replace(/\s/g, '');
    
    const prefix = `AQA-${language.toUpperCase()}-${level.charAt(0).toUpperCase()}-${themeCode}-${topicCode}`;
    
    // Find existing identifiers with similar prefix
    const existing = suggestedIdentifiers.filter(id => id.includes(themeCode) && id.includes(topicCode));
    
    if (existing.length === 0) {
      return `${prefix}-001`;
    }
    
    // Extract numbers and find the highest
    const numbers = existing.map(id => {
      const match = id.match(/\d+$/);
      return match ? parseInt(match[0]) : 0;
    });
    
    const highest = Math.max(...numbers);
    const next = (highest + 1).toString().padStart(3, '0');
    
    return `${prefix}-${next}`;
  };

  // Load questions for a specific assessment
  const loadAssessmentQuestions = async (assessmentId: string) => {
    try {
      const response = await fetch(`/api/topic-assessments/${assessmentId}/questions`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions || []);
      } else {
        setQuestions([]);
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
      setQuestions([]);
    }
  };

  const handleCreateNew = () => {
    setEditingAssessment(null);
    setFormData({
      title: '',
      description: '',
      language: 'es',
      curriculum_level: 'ks4',
      exam_board: 'AQA',
      level: 'foundation',
      identifier: '',
      theme: '',
      topic: '',
      version: '1.0',
      total_questions: 5,
      time_limit_minutes: 20,
      is_active: true
    });
    setQuestions([]);
    setJsonMode(false);
    setJsonInput('');
    
    // Generate suggested identifier for new assessment
    const suggested = generateSuggestedIdentifier();
    setFormData(prev => ({ ...prev, identifier: suggested }));
    
    setView('create');
  };

  const handleEdit = (assessment: TopicAssessment) => {
    setEditingAssessment(assessment);
    setFormData({
      title: assessment.title,
      description: assessment.description || '',
      language: assessment.language,
      curriculum_level: 'ks4', // Default, since existing assessments may not have this
      exam_board: 'AQA', // Default for existing assessments
      level: assessment.level,
      identifier: assessment.identifier,
      theme: assessment.theme,
      topic: assessment.topic,
      version: assessment.version,
      total_questions: assessment.total_questions,
      time_limit_minutes: assessment.time_limit_minutes,
      is_active: assessment.is_active
    });
    setJsonMode(false);
    setJsonInput('');
    
    // Load questions if editing existing assessment
    if (assessment.id) {
      loadAssessmentQuestions(assessment.id);
    }
    
    setView('edit');
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      let dataToSave = formData;

      // If in JSON mode, parse the JSON input
      if (jsonMode) {
        try {
          const parsedData = JSON.parse(jsonInput);
          dataToSave = {
            ...formData,
            ...parsedData
          };
          
          // Extract questions if present in JSON
          if (parsedData.questions) {
            setQuestions(parsedData.questions);
          }
        } catch (err) {
          throw new Error('Invalid JSON format. Please check your JSON syntax.');
        }
      }

      const url = editingAssessment
        ? `/api/topic-assessments/${editingAssessment.id}`
        : '/api/topic-assessments';

      const method = editingAssessment ? 'PUT' : 'POST';

      // Include questions in the save payload
      const payload = {
        ...dataToSave,
        questions: questions
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save assessment');
      }

      showSuccessToast(editingAssessment ? 'Assessment updated successfully' : 'Assessment created successfully');
      setView('list');
      loadAssessments();
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save assessment');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    try {
      const response = await fetch(`/api/topic-assessments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete assessment');
      }

      showSuccessToast('Assessment deleted successfully');
      loadAssessments();
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete assessment');
    }
  };

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getLanguageName = (code: string): string => {
    const names: Record<string, string> = {
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German'
    };
    return names[code] || code;
  };

  // Get themes based on curriculum level and exam board
  const getAvailableThemes = () => {
    if (formData.curriculum_level === 'ks3') {
      return []; // KS3 doesn't use themes
    } else if (formData.curriculum_level === 'ks4') {
      return formData.exam_board === 'AQA' ? AQA_THEMES : EDEXCEL_THEMES;
    }
    return [];
  };

  const getAvailableTopics = () => {
    if (formData.curriculum_level === 'ks3') {
      return KS3_TOPICS; // Return KS3 topics directly
    } else if (formData.curriculum_level === 'ks4') {
      const themes = getAvailableThemes();
      const selectedTheme = themes.find(t => t.id === formData.theme);
      return selectedTheme ? selectedTheme.topics : [];
    }
    return [];
  };

  const getFilteredThemes = () => {
    // For filter dropdown in list view
    return AQA_THEMES; // Can expand this to support Edexcel filtering too
  };

  const getFilteredTopics = () => {
    const selectedTheme = AQA_THEMES.find(t => t.id === filterTheme);
    return selectedTheme ? selectedTheme.topics : [];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Target className="h-6 w-6 mr-3" />
            <h2 className="text-2xl font-bold">Manage Topic-Based Assessments</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Toast Notification */}
          {showToast && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800">{toastMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          {/* List View */}
          {view === 'list' && (
            <>
              {/* Toolbar */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleCreateNew}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Assessment
                  </button>

                  {/* Filters */}
                  <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <select
                      value={filterLanguage}
                      onChange={(e) => setFilterLanguage(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">All Languages</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>

                    <select
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">All Levels</option>
                      <option value="foundation">Foundation</option>
                      <option value="higher">Higher</option>
                    </select>

                    <select
                      value={filterTheme}
                      onChange={(e) => {
                        setFilterTheme(e.target.value);
                        setFilterTopic(''); // Reset topic when theme changes
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">All Themes</option>
                      {AQA_THEMES.map(theme => (
                        <option key={theme.id} value={theme.id}>{theme.name}</option>
                      ))}
                    </select>

                    {filterTheme && (
                      <select
                        value={filterTopic}
                        onChange={(e) => setFilterTopic(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">All Topics</option>
                        {getFilteredTopics().map(topic => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  {filteredAssessments.length} assessment{filteredAssessments.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Assessments List */}
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading assessments...</p>
                </div>
              ) : filteredAssessments.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Assessments Found</h3>
                  <p className="text-gray-600">Create your first topic-based assessment to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAssessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {assessment.title}
                          </h3>
                          <div className="flex items-center flex-wrap gap-2 mb-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {getLanguageName(assessment.language)}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                              {assessment.level}
                            </span>
                            <span className="text-xs text-gray-500">
                              {assessment.identifier}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(assessment)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(assessment.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <div><strong>Theme:</strong> {assessment.theme}</div>
                        <div><strong>Topic:</strong> {assessment.topic}</div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          <span>{assessment.total_questions} questions</span>
                        </div>
                        <div className="flex items-center">
                          <Target className="h-4 w-4 mr-2" />
                          <span>{assessment.time_limit_minutes} minutes</span>
                        </div>
                        {assessment.description && (
                          <p className="mt-2 text-gray-600">{assessment.description}</p>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                          Status: {assessment.is_active ? (
                            <span className="text-green-600 font-medium">Active</span>
                          ) : (
                            <span className="text-red-600 font-medium">Inactive</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Create/Edit Form */}
          {(view === 'create' || view === 'edit') && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {view === 'create' ? 'Create New Assessment' : 'Edit Assessment'}
                </h3>
                <button
                  onClick={() => setView('list')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Back to List
                </button>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., AQA Spanish Foundation - Identity and Relationships"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Brief description of the assessment..."
                  />
                </div>

                {/* Language and Curriculum Level */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language *
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Curriculum Level *
                    </label>
                    <select
                      value={formData.curriculum_level}
                      onChange={(e) => setFormData({ ...formData, curriculum_level: e.target.value as 'ks3' | 'ks4', theme: '', topic: '' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="ks3">KS3</option>
                      <option value="ks4">KS4 (GCSE)</option>
                    </select>
                  </div>
                </div>

                {/* Exam Board and GCSE Level (only for KS4) */}
                {formData.curriculum_level === 'ks4' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exam Board *
                      </label>
                      <select
                        value={formData.exam_board}
                        onChange={(e) => setFormData({ ...formData, exam_board: e.target.value as 'AQA' | 'Edexcel', theme: '', topic: '' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="AQA">AQA</option>
                        <option value="Edexcel">Edexcel</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GCSE Level *
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value as 'foundation' | 'higher' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="foundation">Foundation</option>
                        <option value="higher">Higher</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Theme and Topic */}
                {formData.curriculum_level === 'ks4' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme *
                      </label>
                      <select
                        value={formData.theme}
                        onChange={(e) => {
                          setFormData({ ...formData, theme: e.target.value, topic: '' });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select a theme</option>
                        {getAvailableThemes().map(theme => (
                          <option key={theme.id} value={theme.id}>{theme.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Topic *
                      </label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={!formData.theme}
                      >
                        <option value="">Select a topic</option>
                        {getAvailableTopics().map(topic => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Topic only (for KS3) */}
                {formData.curriculum_level === 'ks3' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic *
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select a topic</option>
                      {getAvailableTopics().map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Identifier and Version */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Identifier * <span className="text-xs text-gray-500">(Auto-suggested based on existing papers)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.identifier}
                        onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., AQA-ES-F-T1-IDE-001"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const suggested = generateSuggestedIdentifier();
                          setFormData({ ...formData, identifier: suggested });
                        }}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors whitespace-nowrap"
                      >
                        Suggest ID
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Version
                    </label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., 1.0"
                    />
                  </div>
                </div>

                {/* Total Questions and Time Limit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Questions *
                    </label>
                    <input
                      type="number"
                      value={formData.total_questions}
                      onChange={(e) => setFormData({ ...formData, total_questions: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Limit (minutes) *
                    </label>
                    <input
                      type="number"
                      value={formData.time_limit_minutes}
                      onChange={(e) => setFormData({ ...formData, time_limit_minutes: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>

                {/* Is Active */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                    Active (visible to students)
                  </label>
                </div>

                {/* JSON Mode Toggle */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileJson className="w-5 h-5 text-purple-600" />
                      <h3 className="text-lg font-semibold text-gray-900">JSON Mode</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setJsonMode(!jsonMode)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        jsonMode
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {jsonMode ? 'Form Mode' : 'JSON Mode'}
                    </button>
                  </div>

                  {jsonMode && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Paste Assessment JSON
                          </label>
                          <button
                            type="button"
                            onClick={handleExportJSON}
                            className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Export JSON
                          </button>
                        </div>
                        <textarea
                          value={jsonInput}
                          onChange={(e) => setJsonInput(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                          rows={20}
                          placeholder={`{
  "title": "Assessment Title",
  "description": "Assessment description",
  "language": "es",
  "level": "foundation",
  "theme": "Theme 1: Identity and Culture",
  "topic": "Identity",
  "identifier": "AQA-ES-F-T1-IDE-001",
  "questions": [
    {
      "question_number": 1,
      "question_type": "multiple-choice",
      "title": "Question Title",
      "instructions": "Choose the correct answer",
      "marks": 5,
      "difficulty_rating": 3,
      "question_data": {
        "options": ["A", "B", "C", "D"],
        "correct_answer": "A"
      }
    }
  ]
}`}
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        💡 Paste complete assessment JSON including questions array. You can export current data using the "Export JSON" button above.
                      </p>
                    </div>
                  )}
                </div>

                {/* Questions Section (only in form mode) */}
                {!jsonMode && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <ListChecks className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
                        <span className="text-sm text-gray-500">({questions.length} questions)</span>
                      </div>
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Question
                      </button>
                    </div>

                    {questions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No questions added yet. Click "Add Question" to create one.
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {questions.map((question, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-medium text-gray-900">Question {question.question_number}</h4>
                              <button
                                type="button"
                                onClick={() => removeQuestion(index)}
                                className="text-red-600 hover:text-red-700 p-1"
                                title="Remove question"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-3">
                              {/* Question Type */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Question Type
                                </label>
                                <select
                                  value={question.question_type}
                                  onChange={(e) => updateQuestion(index, 'question_type', e.target.value)}
                                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                >
                                  <option value="multiple-choice">Multiple Choice</option>
                                  <option value="short-answer">Short Answer</option>
                                  <option value="translation">Translation</option>
                                  <option value="reading-comprehension">Reading Comprehension</option>
                                  <option value="essay">Essay</option>
                                </select>
                              </div>

                              {/* Title */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={question.title}
                                  onChange={(e) => updateQuestion(index, 'title', e.target.value)}
                                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                  placeholder="Question title"
                                />
                              </div>

                              {/* Instructions */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Instructions
                                </label>
                                <textarea
                                  value={question.instructions}
                                  onChange={(e) => updateQuestion(index, 'instructions', e.target.value)}
                                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                  rows={2}
                                  placeholder="Question instructions"
                                />
                              </div>

                              {/* Reading Text (optional) */}
                              {question.question_type === 'reading-comprehension' && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Reading Text
                                  </label>
                                  <textarea
                                    value={question.reading_text || ''}
                                    onChange={(e) => updateQuestion(index, 'reading_text', e.target.value)}
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                    rows={4}
                                    placeholder="Reading passage text"
                                  />
                                </div>
                              )}

                              {/* Marks and Difficulty */}
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Marks
                                  </label>
                                  <input
                                    type="number"
                                    value={question.marks}
                                    onChange={(e) => updateQuestion(index, 'marks', parseInt(e.target.value))}
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                    min="1"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Difficulty (1-5)
                                  </label>
                                  <input
                                    type="number"
                                    value={question.difficulty_rating}
                                    onChange={(e) => updateQuestion(index, 'difficulty_rating', parseInt(e.target.value))}
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                    min="1"
                                    max="5"
                                  />
                                </div>
                              </div>

                              {/* Question Data (JSON editor for flexible question content) */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Question Data (JSON)
                                </label>
                                <textarea
                                  value={JSON.stringify(question.question_data, null, 2)}
                                  onChange={(e) => {
                                    try {
                                      const parsed = JSON.parse(e.target.value);
                                      updateQuestion(index, 'question_data', parsed);
                                    } catch (err) {
                                      // Invalid JSON, don't update
                                    }
                                  }}
                                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 font-mono"
                                  rows={4}
                                  placeholder='{"options": ["A", "B", "C"], "correct_answer": "A"}'
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Store question-specific data like options, correct answers, etc.
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="mt-8 flex items-center justify-end space-x-4">
                <button
                  onClick={() => setView('list')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.title || !formData.identifier || !formData.theme || !formData.topic}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Save Assessment
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
