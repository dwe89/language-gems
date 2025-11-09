'use client';

import React, { useState, useEffect } from 'react';
import {
  X, Save, Plus, Trash2, Edit, Filter, Download, Upload,
  PenTool, Loader2, AlertCircle, CheckCircle, Volume2
} from 'lucide-react';

interface DictationAssessment {
  id: string;
  title: string;
  description?: string;
  level: 'foundation' | 'higher';
  language: string;
  identifier: string;
  version: string;
  total_questions: number;
  time_limit_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface DictationQuestion {
  question_number: number;
  sentence_text: string;
  audio_url_normal?: string;
  audio_url_slow?: string;
  marks: number;
  difficulty_rating: number;
}

interface DictationAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function DictationAdminModal({
  isOpen,
  onClose,
  onRefresh,
}: DictationAdminModalProps) {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [assessments, setAssessments] = useState<DictationAssessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<DictationAssessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Filters
  const [filterLanguage, setFilterLanguage] = useState<string>('');
  const [filterLevel, setFilterLevel] = useState<string>('');

  // Form state
  const [editingAssessment, setEditingAssessment] = useState<DictationAssessment | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: 'es',
    level: 'foundation' as 'foundation' | 'higher',
    identifier: '',
    version: '1.0',
    total_questions: 10,
    time_limit_minutes: 20,
    is_active: true
  });

  // Question management
  const [questions, setQuestions] = useState<DictationQuestion[]>([]);
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

    setFilteredAssessments(filtered);
  }, [assessments, filterLanguage, filterLevel]);

  const loadAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/dictation/assessments');
      
      if (!response.ok) {
        throw new Error('Failed to load assessments');
      }

      const data = await response.json();
      const loadedAssessments = data.assessments || [];
      setAssessments(loadedAssessments);
      
      // Generate identifier suggestions based on existing assessments
      const identifiers = loadedAssessments.map((a: DictationAssessment) => a.identifier);
      setSuggestedIdentifiers(identifiers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  // Question management functions
  const addQuestion = () => {
    const newQuestion: DictationQuestion = {
      question_number: questions.length + 1,
      sentence_text: '',
      audio_url_normal: '',
      audio_url_slow: '',
      marks: 1,
      difficulty_rating: 3
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: keyof DictationQuestion, value: any) => {
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
    a.download = `dictation-${formData.identifier || 'assessment'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate suggested identifier based on existing ones
  const generateSuggestedIdentifier = () => {
    const { language, level } = formData;
    const prefix = `DICT-${language.toUpperCase()}-${level.charAt(0).toUpperCase()}`;
    
    // Find existing identifiers with this prefix
    const existing = suggestedIdentifiers.filter(id => id.startsWith(prefix));
    
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

  const handleCreateNew = () => {
    setEditingAssessment(null);
    setFormData({
      title: '',
      description: '',
      language: 'es',
      level: 'foundation',
      identifier: generateSuggestedIdentifier(),
      version: '1.0',
      total_questions: 10,
      time_limit_minutes: 20,
      is_active: true
    });
    setQuestions([]);
    setJsonMode(false);
    setJsonInput('');
    setView('create');
  };

  const handleEdit = (assessment: DictationAssessment) => {
    setEditingAssessment(assessment);
    setFormData({
      title: assessment.title,
      description: assessment.description || '',
      language: assessment.language,
      level: assessment.level,
      identifier: assessment.identifier,
      version: assessment.version,
      total_questions: assessment.total_questions,
      time_limit_minutes: assessment.time_limit_minutes,
      is_active: assessment.is_active
    });
    // Load questions for this assessment
    loadAssessmentQuestions(assessment.id);
    setJsonMode(false);
    setJsonInput('');
    setView('edit');
  };

  const loadAssessmentQuestions = async (assessmentId: string) => {
    try {
      const response = await fetch(`/api/dictation/questions?assessment_id=${assessmentId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.questions) {
          setQuestions(data.questions.map((q: any) => ({
            question_number: q.question_number,
            sentence_text: q.sentence_text,
            audio_url_normal: q.audio_url_normal || '',
            audio_url_slow: q.audio_url_slow || '',
            marks: q.marks || 1,
            difficulty_rating: q.difficulty_rating || 3
          })));
        }
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      let questionsData = questions;
      let assessmentData = { ...formData };

      // If JSON mode, parse the JSON input
      if (jsonMode) {
        try {
          const parsed = JSON.parse(jsonInput);
          questionsData = parsed.questions || [];
          
          // Update form data from JSON if provided
          if (parsed.title) assessmentData.title = parsed.title;
          if (parsed.description) assessmentData.description = parsed.description;
          if (parsed.language) assessmentData.language = parsed.language;
          if (parsed.level) assessmentData.level = parsed.level;
          if (parsed.identifier) assessmentData.identifier = parsed.identifier;
          if (parsed.version) assessmentData.version = parsed.version;
          if (parsed.time_limit_minutes) assessmentData.time_limit_minutes = parsed.time_limit_minutes;
        } catch (e) {
          throw new Error('Invalid JSON format');
        }
      }

      // Update total_questions based on questions array
      assessmentData.total_questions = questionsData.length;

      const url = editingAssessment
        ? `/api/dictation/assessments/${editingAssessment.id}`
        : '/api/dictation/assessments';

      const method = editingAssessment ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...assessmentData,
          questions: questionsData
        }),
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
      const response = await fetch(`/api/dictation/assessments/${id}`, {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <PenTool className="h-6 w-6 mr-3" />
            <h2 className="text-2xl font-bold">Manage Dictation Assessments</h2>
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
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
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
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">All Languages</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>

                    <select
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">All Levels</option>
                      <option value="foundation">Foundation</option>
                      <option value="higher">Higher</option>
                    </select>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  {filteredAssessments.length} assessment{filteredAssessments.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Assessments List */}
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading assessments...</p>
                </div>
              ) : filteredAssessments.length === 0 ? (
                <div className="text-center py-12">
                  <PenTool className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Assessments Found</h3>
                  <p className="text-gray-600">Create your first dictation assessment to get started.</p>
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
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
                        <div className="flex items-center">
                          <PenTool className="h-4 w-4 mr-2" />
                          <span>{assessment.total_questions} questions</span>
                        </div>
                        <div className="flex items-center">
                          <Volume2 className="h-4 w-4 mr-2" />
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
              {/* Header with JSON Mode Toggle */}
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {view === 'create' ? 'Create New Assessment' : 'Edit Assessment'}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setJsonMode(!jsonMode)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      jsonMode
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    JSON Mode
                  </button>
                  {!jsonMode && (
                    <button
                      onClick={handleExportJSON}
                      className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export JSON
                    </button>
                  )}
                  <button
                    onClick={() => setView('list')}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Back to List
                  </button>
                </div>
              </div>

              {jsonMode ? (
                /* JSON Input Mode */
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste JSON (must include title, identifier, language, level, and questions array)
                  </label>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    rows={20}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-mono text-sm"
                    placeholder={`{
  "title": "AQA Spanish Foundation Paper 1 Dictation",
  "description": "Practice dictation assessment",
  "language": "es",
  "level": "foundation",
  "identifier": "DICT-ES-F-001",
  "version": "1.0",
  "time_limit_minutes": 20,
  "questions": [
    {
      "question_number": 1,
      "sentence_text": "Me llamo María y tengo quince años.",
      "audio_url_normal": "/audio/dict-es-f-001-q1-normal.mp3",
      "audio_url_slow": "/audio/dict-es-f-001-q1-slow.mp3",
      "marks": 1,
      "difficulty_rating": 2
    }
  ]
}`}
                  />
                </div>
              ) : (
                /* Form Input Mode */
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., AQA Spanish Foundation Paper 1 Dictation"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Brief description of the assessment..."
                  />
                </div>

                {/* Language and Level */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language *
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level *
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as 'foundation' | 'higher' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="foundation">Foundation</option>
                      <option value="higher">Higher</option>
                    </select>
                  </div>
                </div>

                {/* Identifier and Version */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Identifier *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.identifier}
                        onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., DICT-ES-F-001"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, identifier: generateSuggestedIdentifier() })}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
                      >
                        Suggest ID
                      </button>
                    </div>
                    {suggestedIdentifiers.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Suggested: {generateSuggestedIdentifier()}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Version
                    </label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                    Active (visible to students)
                  </label>
                </div>

                {/* Questions Section */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Dictation Sentences</h4>
                    <button
                      onClick={addQuestion}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Sentence
                    </button>
                  </div>

                  {questions.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">No sentences yet. Click "Add Sentence" to create one.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {questions.map((q, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-start justify-between mb-3">
                            <h5 className="font-semibold text-gray-900">Sentence {index + 1}</h5>
                            <button
                              onClick={() => removeQuestion(index)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="space-y-3">
                            {/* Sentence Text */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sentence Text *
                              </label>
                              <input
                                type="text"
                                value={q.sentence_text}
                                onChange={(e) => updateQuestion(index, 'sentence_text', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Enter the sentence in target language..."
                              />
                            </div>

                            {/* Audio URLs */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Normal Speed Audio URL
                                </label>
                                <input
                                  type="text"
                                  value={q.audio_url_normal}
                                  onChange={(e) => updateQuestion(index, 'audio_url_normal', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                  placeholder="/audio/..."
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Slow Speed Audio URL
                                </label>
                                <input
                                  type="text"
                                  value={q.audio_url_slow}
                                  onChange={(e) => updateQuestion(index, 'audio_url_slow', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                  placeholder="/audio/..."
                                />
                              </div>
                            </div>

                            {/* Marks and Difficulty */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Marks
                                </label>
                                <input
                                  type="number"
                                  value={q.marks}
                                  onChange={(e) => updateQuestion(index, 'marks', parseInt(e.target.value))}
                                  min="1"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Difficulty (1-5)
                                </label>
                                <input
                                  type="number"
                                  value={q.difficulty_rating}
                                  onChange={(e) => updateQuestion(index, 'difficulty_rating', parseInt(e.target.value))}
                                  min="1"
                                  max="5"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              )}

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
                  disabled={saving || !formData.title || !formData.identifier}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
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
