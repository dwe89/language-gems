'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Eye, FileJson, Save, AlertCircle, CheckCircle, Download, Upload } from 'lucide-react';
import type {
  AQAReadingPaper,
  AQAReadingQuestion,
  ListPapersResponse,
  GetNextIdentifierResponse,
  CreatePaperResponse,
  UpdatePaperResponse,
  DeletePaperResponse,
} from '@/types/aqa-reading-admin';
import AQAQuestionEditor from './AQAQuestionEditor';

interface AQAReadingAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

type ViewMode = 'list' | 'create' | 'edit' | 'view';
type EditorMode = 'form' | 'json';

export default function AQAReadingAdminModal({ isOpen, onClose, onRefresh }: AQAReadingAdminModalProps) {
  // State management
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editorMode, setEditorMode] = useState<EditorMode>('form');
  const [papers, setPapers] = useState<AQAReadingPaper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<AQAReadingPaper | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter state
  const [filterLanguage, setFilterLanguage] = useState<string>('');
  const [filterTier, setFilterTier] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState<Partial<AQAReadingPaper>>({
    language: 'es',
    level: 'foundation',
    identifier: '',
    title: '',
    description: '',
    version: '1.0',
    is_active: true,
  });

  const [questions, setQuestions] = useState<AQAReadingQuestion[]>([]);
  const [jsonData, setJsonData] = useState<string>('');
  const [previewPaper, setPreviewPaper] = useState<AQAReadingPaper | null>(null);

  // Load papers on mount
  useEffect(() => {
    if (isOpen && viewMode === 'list') {
      loadPapers();
    }
  }, [isOpen, viewMode, filterLanguage, filterTier]);

  // Auto-fetch next identifier when language/tier changes
  useEffect(() => {
    if (viewMode === 'create' && formData.language && formData.level) {
      fetchNextIdentifier(formData.language, formData.level);
    }
  }, [formData.language, formData.level, viewMode]);

  // Load papers from API
  const loadPapers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filterLanguage) params.append('language', filterLanguage);
      if (filterTier) params.append('tier', filterTier);

      const response = await fetch(`/api/admin/aqa-reading/list?${params.toString()}`);
      const data: ListPapersResponse = await response.json();

      if (data.success) {
        setPapers(data.papers);
      } else {
        setError('Failed to load papers');
      }
    } catch (err) {
      setError('Error loading papers');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch next available identifier
  const fetchNextIdentifier = async (language: string, tier: string) => {
    try {
      const response = await fetch(
        `/api/admin/aqa-reading/get-next-identifier?language=${language}&tier=${tier}`
      );
      const data: GetNextIdentifierResponse = await response.json();

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          identifier: data.next_identifier,
        }));
      }
    } catch (err) {
      console.error('Error fetching next identifier:', err);
    }
  };

  // Handle create paper
  const handleCreate = () => {
    setViewMode('create');
    setEditorMode('form');
    setFormData({
      language: 'es',
      level: 'foundation',
      identifier: '',
      title: '',
      description: '',
      version: '1.0',
      is_active: true,
    });
    setQuestions([]);
    setError(null);
    setSuccess(null);
  };

  // Handle edit paper
  const handleEdit = async (paper: AQAReadingPaper) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/aqa-reading/get/${paper.id}`);
      const data = await response.json();

      if (data.success) {
        setSelectedPaper(data.paper);
        setFormData({
          language: data.paper.language,
          level: data.paper.level,
          identifier: data.paper.identifier,
          title: data.paper.title,
          description: data.paper.description,
          version: data.paper.version,
          is_active: data.paper.is_active,
        });
        setQuestions(data.paper.questions || []);
        setViewMode('edit');
        setEditorMode('form');
      } else {
        setError('Failed to load paper details');
      }
    } catch (err) {
      setError('Error loading paper details');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete paper
  const handleDelete = async (paperId: string) => {
    if (!confirm('Are you sure you want to delete this paper? This action cannot be undone if the paper has no student results.')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/aqa-reading/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperId }),
      });

      const data: DeletePaperResponse = await response.json();

      if (data.success) {
        setSuccess(data.message);
        loadPapers();
        if (onRefresh) onRefresh();
      } else {
        setError('Failed to delete paper');
      }
    } catch (err) {
      setError('Error deleting paper');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle export to JSON
  const handleExportJSON = () => {
    const exportData = {
      paper: formData,
      questions: questions,
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.identifier || 'paper'}-export.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handle import from JSON
  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        if (importData.paper) {
          setFormData(importData.paper);
        }
        if (importData.questions) {
          setQuestions(importData.questions);
        }
        setSuccess('Data imported successfully!');
      } catch (err) {
        setError('Failed to import JSON. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  // Handle preview
  const handlePreview = async (paper: AQAReadingPaper) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/aqa-reading/get/${paper.id}`);
      const data = await response.json();
      if (data.success) {
        setPreviewPaper(data.paper);
        setViewMode('view');
      }
    } catch (err) {
      setError('Failed to load paper for preview');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle save (create or update)
  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate required fields
      if (!formData.language || !formData.level || !formData.identifier || !formData.title) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      // Auto-generate description if empty
      const description = formData.description || 
        `AQA GCSE ${formData.language.toUpperCase()} Reading Assessment - ${formData.level === 'foundation' ? 'Foundation' : 'Higher'} Tier`;

      const payload = {
        paper: {
          ...formData,
          description,
          tier: formData.level, // Map level to tier for API
        },
        questions: editorMode === 'json' ? JSON.parse(jsonData).questions : questions,
      };

      if (viewMode === 'create') {
        // Create new paper
        const response = await fetch('/api/admin/aqa-reading/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data: CreatePaperResponse = await response.json();

        if (data.success) {
          setSuccess('Paper created successfully!');
          setTimeout(() => {
            setViewMode('list');
            loadPapers();
            if (onRefresh) onRefresh();
          }, 1500);
        } else {
          setError(data.error || 'Failed to create paper');
        }
      } else if (viewMode === 'edit' && selectedPaper) {
        // Update existing paper
        const response = await fetch('/api/admin/aqa-reading/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paperId: selectedPaper.id,
            ...payload,
          }),
        });

        const data: UpdatePaperResponse = await response.json();

        if (data.success) {
          setSuccess('Paper updated successfully!');
          setTimeout(() => {
            setViewMode('list');
            loadPapers();
            if (onRefresh) onRefresh();
          }, 1500);
        } else {
          setError('Failed to update paper');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error saving paper');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {viewMode === 'list' && 'Manage AQA Reading Papers'}
            {viewMode === 'create' && 'Create New Paper'}
            {viewMode === 'edit' && 'Edit Paper'}
            {viewMode === 'view' && 'View Paper'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800">{success}</p>
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === 'list' && (
            <div>
              {/* Filters and Create Button */}
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <select
                    value={filterLanguage}
                    onChange={(e) => setFilterLanguage(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Languages</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>

                  <select
                    value={filterTier}
                    onChange={(e) => setFilterTier(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Tiers</option>
                    <option value="foundation">Foundation</option>
                    <option value="higher">Higher</option>
                  </select>
                </div>

                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Create New Paper
                </button>
              </div>

              {/* Papers List */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Loading papers...</p>
                </div>
              ) : papers.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FileJson className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No papers found. Create your first paper to get started.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {papers.map((paper) => (
                    <div
                      key={paper.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{paper.title}</h3>
                          <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                            <span className="font-medium">
                              {paper.language === 'es' ? '🇪🇸 Spanish' : paper.language === 'fr' ? '🇫🇷 French' : '🇩🇪 German'}
                            </span>
                            <span>•</span>
                            <span className="capitalize">{paper.tier || paper.level}</span>
                            <span>•</span>
                            <span>{paper.identifier}</span>
                            <span>•</span>
                            <span>{paper.total_questions || 0} questions</span>
                            <span>•</span>
                            <span className="font-semibold">{paper.total_marks || 50} marks</span>
                            <span>•</span>
                            <span>{paper.time_limit_minutes} min</span>
                          </div>
                          {!paper.is_active && (
                            <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                              INACTIVE
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handlePreview(paper)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Preview paper"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(paper)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit paper"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => paper.id && handleDelete(paper.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete paper"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CREATE/EDIT VIEW */}
          {(viewMode === 'create' || viewMode === 'edit') && (
            <div>
              {/* Mode Toggle and Import/Export */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setEditorMode('form')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      editorMode === 'form'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Form Mode
                  </button>
                  <button
                    onClick={() => setEditorMode('json')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      editorMode === 'json'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    JSON Mode
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    Export JSON
                  </button>
                  <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Import JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* FORM MODE */}
              {editorMode === 'form' && (
                <div className="space-y-6">
                  {/* Paper Metadata */}
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Paper Details</h3>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Language */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.language}
                          onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={viewMode === 'edit'}
                        >
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>

                      {/* Tier */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tier <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.level}
                          onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={viewMode === 'edit'}
                        >
                          <option value="foundation">Foundation</option>
                          <option value="higher">Higher</option>
                        </select>
                      </div>
                    </div>

                    {/* Identifier (Auto-suggested) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Paper Identifier <span className="text-red-500">*</span>
                        <span className="text-gray-500 text-xs ml-2">(Auto-suggested based on existing papers)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.identifier}
                        onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., paper-1"
                        disabled={viewMode === 'edit'}
                      />
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., AQA GCSE Spanish Reading Assessment - Foundation Paper 1"
                      />
                    </div>

                    {/* Hardcoded Values Display */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-700 mb-1">Total Marks</p>
                        <p className="text-2xl font-bold text-blue-600">50</p>
                        <p className="text-xs text-gray-500 mt-1">Hardcoded for all papers</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-700 mb-1">Time Limit</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formData.level === 'foundation' ? '45' : '60'} min
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Auto-set based on tier</p>
                      </div>
                    </div>
                  </div>

                  {/* Questions Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <AQAQuestionEditor questions={questions} onChange={setQuestions} />
                  </div>
                </div>
              )}

              {/* JSON MODE */}
              {editorMode === 'json' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    JSON Data
                  </label>
                  <textarea
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    className="w-full h-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder='{"paper": {...}, "questions": [...]}'
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-4">
                <button
                  onClick={() => setViewMode('list')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {isLoading ? 'Saving...' : viewMode === 'create' ? 'Create Paper' : 'Update Paper'}
                </button>
              </div>
            </div>
          )}

          {/* PREVIEW VIEW */}
          {viewMode === 'view' && previewPaper && (
            <div>
              <button
                onClick={() => setViewMode('list')}
                className="mb-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-semibold"
              >
                ← Back to List
              </button>

              <div className="space-y-6">
                {/* Paper Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{previewPaper.title}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Language:</span>
                      <p className="font-semibold">
                        {previewPaper.language === 'es' ? '🇪🇸 Spanish' : previewPaper.language === 'fr' ? '🇫🇷 French' : '🇩🇪 German'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tier:</span>
                      <p className="font-semibold capitalize">{previewPaper.tier || previewPaper.level}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Marks:</span>
                      <p className="font-semibold text-blue-600">{previewPaper.total_marks || 50}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Time Limit:</span>
                      <p className="font-semibold">{previewPaper.time_limit_minutes} minutes</p>
                    </div>
                  </div>
                  {previewPaper.description && (
                    <p className="mt-4 text-gray-700">{previewPaper.description}</p>
                  )}
                </div>

                {/* Questions Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Questions Preview</h3>
                  {((previewPaper as any).questions || []).map((q: AQAReadingQuestion, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="font-bold text-lg text-gray-900">Question {q.question_number}</span>
                          <span className="ml-3 text-sm text-gray-600">
                            {q.question_type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </span>
                          <span className="ml-3 text-sm font-semibold text-blue-600">{q.marks} marks</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="font-semibold text-gray-900">{q.title}</p>
                        {q.instructions && (
                          <p className="text-sm text-gray-600 italic">{q.instructions}</p>
                        )}
                        {q.reading_text && (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-3">
                            <p className="text-sm font-serif text-gray-800 whitespace-pre-wrap">{q.reading_text}</p>
                          </div>
                        )}
                        <div className="mt-3 text-xs text-gray-500">
                          <span className="font-medium">Theme:</span> {q.theme} •
                          <span className="font-medium ml-2">Topic:</span> {q.topic} •
                          <span className="font-medium ml-2">Difficulty:</span> {q.difficulty_rating}/5
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

