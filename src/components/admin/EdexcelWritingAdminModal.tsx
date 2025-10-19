'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Edit, Trash2, Eye, Save, AlertCircle, CheckCircle, Download, Upload, Image as ImageIcon, Loader, FileText } from 'lucide-react';
import type {
  AQAWritingPaper,
  AQAWritingQuestion,
  ListPapersResponse,
  GetNextIdentifierResponse,
  CreatePaperResponse,
  UpdatePaperResponse,
  DeletePaperResponse,
  PhotoDescriptionData,
  TranslationData,
  ChoiceWritingData,
  ParagraphTranslationData,
} from '@/types/aqa-writing-admin';

interface EdexcelWritingAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

type ViewMode = 'list' | 'create' | 'edit' | 'view';

export default function EdexcelWritingAdminModal({ isOpen, onClose, onRefresh }: EdexcelWritingAdminModalProps) {
  const PHOTO_PROMPT = 'What is in this photo? Write four sentences in Spanish.';

  // State management
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [papers, setPapers] = useState<AQAWritingPaper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<AQAWritingPaper | null>(null);
  const [editingPaperId, setEditingPaperId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter state
  const [filterLanguage, setFilterLanguage] = useState<string>('');
  const [filterTier, setFilterTier] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState<Partial<AQAWritingPaper>>({
    language: 'es',
    level: 'foundation',
    identifier: '',
    title: '',
    description: '',
    version: '1.0',
    is_active: true,
  });

  // Theme and Topic (required by database)
  const [theme, setTheme] = useState<string>('Theme 1: People and lifestyle');
  const [topic, setTopic] = useState<string>('Identity and relationships with others');

  // FOUNDATION QUESTIONS

  // F-Q1: Photo Description (4 sentences, 8 marks)
  const [fq1PhotoUrl, setFq1PhotoUrl] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  // F-Q2: Choice Writing (40-50 words, 14 marks, 3 bullets)
  const [fq2OptionAPrompt, setFq2OptionAPrompt] = useState<string>('Write an article about a music group you know');
  const [fq2OptionABullets, setFq2OptionABullets] = useState<string[]>(['a description of the group', 'your opinion of their music', 'when you will next listen to music']);
  const [fq2OptionBPrompt, setFq2OptionBPrompt] = useState<string>('Write about your favourite hobby');
  const [fq2OptionBBullets, setFq2OptionBBullets] = useState<string[]>(['what the hobby is', 'why you enjoy it', 'when you do this hobby']);

  // F-Q3: Choice Writing (80-90 words, 18 marks, 4 bullets)
  const [fq3OptionAPrompt, setFq3OptionAPrompt] = useState<string>('Write a letter to your friend about your school');
  const [fq3OptionABullets, setFq3OptionABullets] = useState<string[]>(['what your school is like', 'your opinion of one of your subjects with reasons', 'what you did in school last week', 'what you will do after school this week']);
  const [fq3OptionBPrompt, setFq3OptionBPrompt] = useState<string>('Write about your daily routine');
  const [fq3OptionBBullets, setFq3OptionBBullets] = useState<string[]>(['what time you wake up', 'what you do in the morning', 'your opinion of your routine', 'what you will change next year']);

  // F-Q4: Translation (5 sentences, 10 marks)
  const [fq4Sentences, setFq4Sentences] = useState<Array<{ englishText: string; correctTranslation: string }>>([
    { englishText: '', correctTranslation: '' }
  ]);

  // HIGHER QUESTIONS

  // H-Q1: Choice Writing (80-90 words, 18 marks, 4 bullets)
  const [hq1OptionAPrompt, setHq1OptionAPrompt] = useState<string>('Write a letter to your friend about your school');
  const [hq1OptionABullets, setHq1OptionABullets] = useState<string[]>(['what your school is like', 'your opinion of one of your subjects with reasons', 'what you did in school last week', 'what you will do after school this week']);
  const [hq1OptionBPrompt, setHq1OptionBPrompt] = useState<string>('Write about your daily routine');
  const [hq1OptionBBullets, setHq1OptionBBullets] = useState<string[]>(['what time you wake up', 'what you do in the morning', 'your opinion of your routine', 'what you will change next year']);

  // H-Q2: Choice Writing (130-150 words, 22 marks, 4 bullets)
  const [hq2OptionAPrompt, setHq2OptionAPrompt] = useState<string>('Write a blog about music');
  const [hq2OptionABullets, setHq2OptionABullets] = useState<string[]>(['when you like to listen to music', 'the pros and cons of going to concerts', 'a singer or group that you liked in the past', 'the music you are going to listen to next weekend']);
  const [hq2OptionBPrompt, setHq2OptionBPrompt] = useState<string>('Write about your future plans');
  const [hq2OptionBBullets, setHq2OptionBBullets] = useState<string[]>(['what you want to study', 'your dream job and why', 'where you would like to live', 'what you will do to achieve your goals']);

  // H-Q3: Paragraph Translation (10 marks)
  const [hq3EnglishParagraph, setHq3EnglishParagraph] = useState<string>('');
  const [hq3CorrectTranslation, setHq3CorrectTranslation] = useState<string>('');

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

  if (!isOpen) return null;

  const loadPapers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('exam_board', 'edexcel');
      if (filterLanguage) params.append('language', filterLanguage);
      if (filterTier) params.append('tier', filterTier);

      const response = await fetch(`/api/admin/aqa-writing/list?${params.toString()}`);
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

  const fetchNextIdentifier = async (language: string, level: string) => {
    try {
      const response = await fetch(`/api/admin/aqa-writing/next-identifier?exam_board=edexcel&language=${language}&tier=${level}`);
      const data: GetNextIdentifierResponse = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, identifier: data.next_identifier }));
      }
    } catch (err) {
      console.error('Error fetching next identifier:', err);
    }
  };

  const handleCreate = () => {
    setViewMode('create');
    setSelectedPaper(null);
    setFormData({
      language: 'es',
      level: 'foundation',
      identifier: '',
      title: '',
      description: '',
      version: '1.0',
      is_active: true,
    });
    
    // Reset all question data
    setFq1PhotoUrl('');
    setFq2OptionAPrompt('Write an article about a music group you know');
    setFq2OptionABullets(['a description of the group', 'your opinion of their music', 'when you will next listen to music']);
    setFq2OptionBPrompt('Write about your favourite hobby');
    setFq2OptionBBullets(['what the hobby is', 'why you enjoy it', 'when you do this hobby']);
    setFq3OptionAPrompt('Write a letter to your friend about your school');
    setFq3OptionABullets(['what your school is like', 'your opinion of one of your subjects with reasons', 'what you did in school last week', 'what you will do after school this week']);
    setFq3OptionBPrompt('Write about your daily routine');
    setFq3OptionBBullets(['what time you wake up', 'what you do in the morning', 'your opinion of your routine', 'what you will change next year']);
    setFq4Sentences([{ englishText: '', correctTranslation: '' }]);
    
    setHq1OptionAPrompt('Write a letter to your friend about your school');
    setHq1OptionABullets(['what your school is like', 'your opinion of one of your subjects with reasons', 'what you did in school last week', 'what you will do after school this week']);
    setHq1OptionBPrompt('Write about your daily routine');
    setHq1OptionBBullets(['what time you wake up', 'what you do in the morning', 'your opinion of your routine', 'what you will change next year']);
    setHq2OptionAPrompt('Write a blog about music');
    setHq2OptionABullets(['when you like to listen to music', 'the pros and cons of going to concerts', 'a singer or group that you liked in the past', 'the music you are going to listen to next weekend']);
    setHq2OptionBPrompt('Write about your future plans');
    setHq2OptionBBullets(['what you want to study', 'your dream job and why', 'where you would like to live', 'what you will do to achieve your goals']);
    setHq3EnglishParagraph('');
    setHq3CorrectTranslation('');
    
    setTheme('Theme 1: People and lifestyle');
    setTopic('Identity and relationships with others');
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setError(null);
    setSuccess(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/admin/aqa-writing/upload-photo', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success) {
        setFq1PhotoUrl(result.photoUrl);
        setSuccess('Photo uploaded successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || 'Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Failed to upload photo. Please try again.');
    } finally {
      setIsUploadingPhoto(false);
      // Clear input AFTER all state updates to allow re-selecting same file
      if (event.target) {
        event.target.value = '';
      }
    }
  };

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

      // Build questions based on tier
      const questions: AQAWritingQuestion[] = formData.level === 'foundation' ? [
        // F-Q1: Photo Description (8 marks, 4 sentences)
        {
          question_number: 1,
          question_type: 'photo-description',
          title: 'Photo Description',
          instructions: 'Write 4 sentences describing the photo.',
          question_data: {
            photoUrl: fq1PhotoUrl,
            photoPrompt: 'Look at the photo.',
            sentenceCount: 4
          } as PhotoDescriptionData,
          marks: 8,
          theme: theme as any,
          topic: topic as any,
          difficulty_rating: 3,
        },
        // F-Q2: Choice Writing (14 marks, 40-50 words, 3 bullets)
        {
          question_number: 2,
          question_type: 'choice-writing',
          title: 'Choice Writing',
          instructions: 'Choose either Question 2(a) or Question 2(b). Write 40-50 words.',
          question_data: {
            optionA: {
              prompt: fq2OptionAPrompt,
              wordCount: 45,
              bulletPoints: fq2OptionABullets,
              marks: 14
            },
            optionB: {
              prompt: fq2OptionBPrompt,
              wordCount: 45,
              bulletPoints: fq2OptionBBullets,
              marks: 14
            }
          } as ChoiceWritingData,
          marks: 14,
          word_count_requirement: 45,
          theme: theme as any,
          topic: topic as any,
          difficulty_rating: 3,
        },
        // F-Q3: Choice Writing (18 marks, 80-90 words, 4 bullets)
        {
          question_number: 3,
          question_type: 'choice-writing',
          title: 'Choice Writing',
          instructions: 'Choose either Question 3(a) or Question 3(b). Write 80-90 words.',
          question_data: {
            optionA: {
              prompt: fq3OptionAPrompt,
              wordCount: 85,
              bulletPoints: fq3OptionABullets,
              marks: 18
            },
            optionB: {
              prompt: fq3OptionBPrompt,
              wordCount: 85,
              bulletPoints: fq3OptionBBullets,
              marks: 18
            }
          } as ChoiceWritingData,
          marks: 18,
          word_count_requirement: 85,
          theme: theme as any,
          topic: topic as any,
          difficulty_rating: 3,
        },
        // F-Q4: Translation (10 marks, 5 sentences)
        {
          question_number: 4,
          question_type: 'translation',
          title: 'Translation',
          instructions: 'Translate the following sentences into Spanish.',
          question_data: {
            sentences: fq4Sentences.map((s, i) => ({
              number: i + 1,
              ...s
            }))
          } as TranslationData,
          marks: 10,
          theme: theme as any,
          topic: topic as any,
          difficulty_rating: 3,
        },
      ] : [
        // HIGHER TIER QUESTIONS
        // H-Q1: Choice Writing (18 marks, 80-90 words, 4 bullets)
        {
          question_number: 1,
          question_type: 'choice-writing',
          title: 'Choice Writing',
          instructions: 'Choose either Question 1(a) or Question 1(b). Write 80-90 words.',
          question_data: {
            optionA: {
              prompt: hq1OptionAPrompt,
              wordCount: 85,
              bulletPoints: hq1OptionABullets,
              marks: 18
            },
            optionB: {
              prompt: hq1OptionBPrompt,
              wordCount: 85,
              bulletPoints: hq1OptionBBullets,
              marks: 18
            }
          } as ChoiceWritingData,
          marks: 18,
          word_count_requirement: 85,
          theme: theme as any,
          topic: topic as any,
          difficulty_rating: 4,
        },
        // H-Q2: Choice Writing (22 marks, 130-150 words, 4 bullets)
        {
          question_number: 2,
          question_type: 'choice-writing',
          title: 'Choice Writing',
          instructions: 'Choose either Question 2(a) or Question 2(b). Write 130-150 words.',
          question_data: {
            optionA: {
              prompt: hq2OptionAPrompt,
              wordCount: 140,
              bulletPoints: hq2OptionABullets,
              marks: 22
            },
            optionB: {
              prompt: hq2OptionBPrompt,
              wordCount: 140,
              bulletPoints: hq2OptionBBullets,
              marks: 22
            }
          } as ChoiceWritingData,
          marks: 22,
          word_count_requirement: 140,
          theme: theme as any,
          topic: topic as any,
          difficulty_rating: 4,
        },
        // H-Q3: Paragraph Translation (10 marks)
        {
          question_number: 3,
          question_type: 'paragraph-translation',
          title: 'Paragraph Translation',
          instructions: 'Translate the following paragraph into Spanish.',
          question_data: {
            englishParagraph: hq3EnglishParagraph,
            correctTranslation: hq3CorrectTranslation,
            marks: 10
          } as ParagraphTranslationData,
          marks: 10,
          theme: theme as any,
          topic: topic as any,
          difficulty_rating: 4,
        },
      ];

      const payload = {
        paper: {
          ...formData,
          exam_board: 'edexcel',
          tier: formData.level,
          time_limit_minutes: formData.level === 'foundation' ? 75 : 80,
          total_marks: 50,
        },
        questions: questions,
      };

      const endpoint = viewMode === 'edit' && editingPaperId
        ? `/api/admin/aqa-writing/update?id=${editingPaperId}`
        : '/api/admin/aqa-writing/create';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(viewMode === 'edit' ? 'Paper updated successfully!' : 'Paper created successfully!');
        setIsLoading(false);

        setTimeout(() => {
          setSuccess(null);
          setViewMode('list');
          loadPapers();
          if (onRefresh) onRefresh();
        }, 1500);
      } else {
        setError(result.error || 'Failed to save paper');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error saving paper:', error);
      setError('Failed to save paper. Please try again.');
      setIsLoading(false);
    }
  };

  const handleEdit = async (paper: AQAWritingPaper) => {
    setEditingPaperId(paper.id || null);
    setFormData({
      language: paper.language,
      level: paper.level,
      identifier: paper.identifier,
      title: paper.title,
      description: paper.description || '',
      time_limit_minutes: paper.time_limit_minutes,
      total_marks: paper.total_marks,
    });

    // TODO: Load questions and populate state variables
    // This requires fetching questions from the API
    setViewMode('edit');
  };

  const handleDelete = async (paperId: string) => {
    if (!confirm('Are you sure you want to delete this paper? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/aqa-writing/delete?id=${paperId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Paper deleted successfully!');
        setTimeout(() => {
          setSuccess(null);
          loadPapers();
          if (onRefresh) onRefresh();
        }, 1500);
      } else {
        setError(result.error || 'Failed to delete paper');
      }
    } catch (error) {
      console.error('Error deleting paper:', error);
      setError('Failed to delete paper. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edexcel Writing Papers</h2>
            <p className="text-sm text-gray-600 mt-1">
              {viewMode === 'list' && 'Manage Edexcel GCSE Writing assessment papers'}
              {viewMode === 'create' && 'Create new Edexcel Writing paper'}
              {viewMode === 'edit' && 'Edit Edexcel Writing paper'}
              {viewMode === 'view' && 'View Edexcel Writing paper'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-green-800">{success}</p>
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === 'list' && (
            <div>
              {/* Filters */}
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Language</label>
                  <select
                    value={filterLanguage}
                    onChange={(e) => setFilterLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Languages</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Tier</label>
                  <select
                    value={filterTier}
                    onChange={(e) => setFilterTier(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Tiers</option>
                    <option value="foundation">Foundation</option>
                    <option value="higher">Higher</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleCreate}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    Create New Paper
                  </button>
                </div>
              </div>

              {/* Papers List */}
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading papers...</p>
                </div>
              ) : papers.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No Edexcel papers found</p>
                  <p className="text-sm text-gray-500">Create your first paper to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {papers.map((paper) => (
                    <div
                      key={paper.id}
                      className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900">{paper.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {paper.language?.toUpperCase()} • {paper.level === 'foundation' ? 'Foundation' : 'Higher'} • {paper.identifier}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(paper)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
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
            <div className="space-y-6">
              {/* Paper Metadata */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Paper Details</h3>

                  {/* Import/Export Buttons */}
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Import JSON
                      <input
                        type="file"
                        accept="application/json"
                        className="hidden"
                      />
                    </label>
                    <button
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export JSON
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Language *
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Tier *
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="foundation">Foundation</option>
                      <option value="higher">Higher</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Paper Identifier *
                    </label>
                    <input
                      type="text"
                      value={formData.identifier}
                      onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., paper-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Time Limit
                    </label>
                    <div className="px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                      <span className="font-bold text-purple-900">
                        {formData.level === 'foundation' ? '75' : '80'} minutes
                      </span>
                      <span className="text-xs text-purple-700 ml-2">(Auto-set)</span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Edexcel GCSE Spanish Writing - Foundation Tier - Paper 1"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={2}
                      placeholder="Optional description"
                    />
                  </div>
                </div>
              </div>

              {/* Theme and Topic */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Theme & Topic (All Questions)</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Theme</label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Theme 1: People and lifestyle">Theme 1: People and lifestyle</option>
                      <option value="Theme 2: Popular culture">Theme 2: Popular culture</option>
                      <option value="Theme 3: Communication and the world around us">Theme 3: Communication and the world around us</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Topic</label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Identity and relationships with others">Identity and relationships with others</option>
                      <option value="Healthy living and lifestyle">Healthy living and lifestyle</option>
                      <option value="Education and work">Education and work</option>
                      <option value="Free-time activities">Free-time activities</option>
                      <option value="Customs, festivals and celebrations">Customs, festivals and celebrations</option>
                      <option value="Celebrity culture">Celebrity culture</option>
                      <option value="Travel and tourism, including places of interest">Travel and tourism, including places of interest</option>
                      <option value="Media and technology">Media and technology</option>
                      <option value="The environment and where people live">The environment and where people live</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* FOUNDATION TIER QUESTIONS */}
              {formData.level === 'foundation' && (
                <>
                  {/* F-Q1: Photo Description (8 marks, 4 sentences) */}
                  <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-300">
                    <h3 className="text-lg font-bold text-blue-900 mb-4">Q1: Photo Description (8 marks)</h3>
                    <p className="text-sm text-blue-800 mb-4">Students write 4 sentences describing the photo.</p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Photo *</label>

                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handlePhotoUpload}
                          disabled={isUploadingPhoto}
                          className="hidden"
                        />

                        <div className="space-y-4">
                          {fq1PhotoUrl ? (
                            <div className="relative">
                              <img
                                src={fq1PhotoUrl}
                                alt="Question photo"
                                className="w-full max-w-md rounded-lg border-2 border-blue-300"
                              />
                              <button
                                onClick={() => setFq1PhotoUrl('')}
                                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                title="Remove photo"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => photoInputRef.current?.click()}
                              disabled={isUploadingPhoto}
                              className="w-full max-w-md px-6 py-8 border-2 border-dashed border-blue-400 rounded-lg hover:border-blue-600 hover:bg-blue-100 transition-colors flex flex-col items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isUploadingPhoto ? (
                                <>
                                  <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                                  <span className="text-blue-700 font-medium">Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <ImageIcon className="w-8 h-8 text-blue-600" />
                                  <span className="text-blue-700 font-medium">Click to upload photo</span>
                                  <span className="text-xs text-blue-600">JPEG, PNG, or WebP (max 5MB)</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* F-Q2: Choice Writing (14 marks, 40-50 words, 3 bullets) */}
                  <div className="bg-green-50 rounded-lg p-6 border-2 border-green-300">
                    <h3 className="text-lg font-bold text-green-900 mb-4">Q2: Choice Writing (14 marks)</h3>
                    <p className="text-sm text-green-800 mb-4">Students choose between option (a) or (b). 40-50 words, 3 bullet points.</p>

                    <div className="space-y-6">
                      {/* Option A */}
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <h4 className="font-bold text-gray-900 mb-3">Option (a)</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Prompt</label>
                            <input
                              type="text"
                              value={fq2OptionAPrompt}
                              onChange={(e) => setFq2OptionAPrompt(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              placeholder="e.g., Write an article about a music group you know"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Bullet Points (3)</label>
                            {fq2OptionABullets.map((bullet, index) => (
                              <input
                                key={index}
                                type="text"
                                value={bullet}
                                onChange={(e) => {
                                  const newBullets = [...fq2OptionABullets];
                                  newBullets[index] = e.target.value;
                                  setFq2OptionABullets(newBullets);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 mb-2"
                                placeholder={`Bullet point ${index + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Option B */}
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <h4 className="font-bold text-gray-900 mb-3">Option (b)</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Prompt</label>
                            <input
                              type="text"
                              value={fq2OptionBPrompt}
                              onChange={(e) => setFq2OptionBPrompt(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              placeholder="e.g., Write about your favourite hobby"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Bullet Points (3)</label>
                            {fq2OptionBBullets.map((bullet, index) => (
                              <input
                                key={index}
                                type="text"
                                value={bullet}
                                onChange={(e) => {
                                  const newBullets = [...fq2OptionBBullets];
                                  newBullets[index] = e.target.value;
                                  setFq2OptionBBullets(newBullets);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 mb-2"
                                placeholder={`Bullet point ${index + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* F-Q3: Choice Writing (18 marks, 80-90 words, 4 bullets) */}
                  <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300">
                    <h3 className="text-lg font-bold text-yellow-900 mb-4">Q3: Choice Writing (18 marks)</h3>
                    <p className="text-sm text-yellow-800 mb-4">Students choose between option (a) or (b). 80-90 words, 4 bullet points.</p>

                    <div className="space-y-6">
                      {/* Option A */}
                      <div className="bg-white rounded-lg p-4 border border-yellow-200">
                        <h4 className="font-bold text-gray-900 mb-3">Option (a)</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Prompt</label>
                            <input
                              type="text"
                              value={fq3OptionAPrompt}
                              onChange={(e) => setFq3OptionAPrompt(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                              placeholder="e.g., Write a letter to your friend about your school"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Bullet Points (4)</label>
                            {fq3OptionABullets.map((bullet, index) => (
                              <input
                                key={index}
                                type="text"
                                value={bullet}
                                onChange={(e) => {
                                  const newBullets = [...fq3OptionABullets];
                                  newBullets[index] = e.target.value;
                                  setFq3OptionABullets(newBullets);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 mb-2"
                                placeholder={`Bullet point ${index + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Option B */}
                      <div className="bg-white rounded-lg p-4 border border-yellow-200">
                        <h4 className="font-bold text-gray-900 mb-3">Option (b)</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Prompt</label>
                            <input
                              type="text"
                              value={fq3OptionBPrompt}
                              onChange={(e) => setFq3OptionBPrompt(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                              placeholder="e.g., Write about your daily routine"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Bullet Points (4)</label>
                            {fq3OptionBBullets.map((bullet, index) => (
                              <input
                                key={index}
                                type="text"
                                value={bullet}
                                onChange={(e) => {
                                  const newBullets = [...fq3OptionBBullets];
                                  newBullets[index] = e.target.value;
                                  setFq3OptionBBullets(newBullets);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 mb-2"
                                placeholder={`Bullet point ${index + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* F-Q4: Translation (10 marks, 5 sentences) */}
                  <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-300">
                    <h3 className="text-lg font-bold text-orange-900 mb-4">Q4: Translation (10 marks)</h3>
                    <p className="text-sm text-orange-800 mb-4">Students translate 5 English sentences into the target language.</p>

                    <div className="space-y-4">
                      {fq4Sentences.map((sentence, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-orange-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-gray-900">Sentence {index + 1}</h4>
                            {fq4Sentences.length > 1 && (
                              <button
                                onClick={() => setFq4Sentences(fq4Sentences.filter((_, i) => i !== index))}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Remove sentence"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-semibold text-gray-900 mb-2">English Text</label>
                              <input
                                type="text"
                                value={sentence.englishText}
                                onChange={(e) => {
                                  const newSentences = [...fq4Sentences];
                                  newSentences[index].englishText = e.target.value;
                                  setFq4Sentences(newSentences);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter English sentence"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-900 mb-2">Correct Translation (for teacher reference)</label>
                              <input
                                type="text"
                                value={sentence.correctTranslation}
                                onChange={(e) => {
                                  const newSentences = [...fq4Sentences];
                                  newSentences[index].correctTranslation = e.target.value;
                                  setFq4Sentences(newSentences);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter correct translation"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => setFq4Sentences([...fq4Sentences, { englishText: '', correctTranslation: '' }])}
                        className="w-full px-4 py-3 border-2 border-dashed border-orange-400 rounded-lg hover:border-orange-600 hover:bg-orange-100 transition-colors text-orange-700 font-semibold flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Add Sentence
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* HIGHER TIER QUESTIONS */}
              {formData.level === 'higher' && (
                <>
                  {/* H-Q1: Choice Writing (18 marks, 80-90 words, 4 bullets) */}
                  <div className="bg-green-50 rounded-lg p-6 border-2 border-green-300">
                    <h3 className="text-lg font-bold text-green-900 mb-4">Q1: Choice Writing (18 marks)</h3>
                    <p className="text-sm text-green-800 mb-4">Students choose between option (a) or (b). 80-90 words, 4 bullet points.</p>

                    <div className="space-y-6">
                      {/* Option A */}
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <h4 className="font-bold text-gray-900 mb-3">Option (a)</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Prompt</label>
                            <input
                              type="text"
                              value={hq1OptionAPrompt}
                              onChange={(e) => setHq1OptionAPrompt(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              placeholder="e.g., Write a letter to your friend about your school"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Bullet Points (4)</label>
                            {hq1OptionABullets.map((bullet, index) => (
                              <input
                                key={index}
                                type="text"
                                value={bullet}
                                onChange={(e) => {
                                  const newBullets = [...hq1OptionABullets];
                                  newBullets[index] = e.target.value;
                                  setHq1OptionABullets(newBullets);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 mb-2"
                                placeholder={`Bullet point ${index + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Option B */}
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <h4 className="font-bold text-gray-900 mb-3">Option (b)</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Prompt</label>
                            <input
                              type="text"
                              value={hq1OptionBPrompt}
                              onChange={(e) => setHq1OptionBPrompt(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              placeholder="e.g., Write about your daily routine"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Bullet Points (4)</label>
                            {hq1OptionBBullets.map((bullet, index) => (
                              <input
                                key={index}
                                type="text"
                                value={bullet}
                                onChange={(e) => {
                                  const newBullets = [...hq1OptionBBullets];
                                  newBullets[index] = e.target.value;
                                  setHq1OptionBBullets(newBullets);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 mb-2"
                                placeholder={`Bullet point ${index + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* H-Q2: Choice Writing (22 marks, 130-150 words, 4 bullets) */}
                  <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300">
                    <h3 className="text-lg font-bold text-yellow-900 mb-4">Q2: Choice Writing (22 marks)</h3>
                    <p className="text-sm text-yellow-800 mb-4">Students choose between option (a) or (b). 130-150 words, 4 bullet points.</p>

                    <div className="space-y-6">
                      {/* Option A */}
                      <div className="bg-white rounded-lg p-4 border border-yellow-200">
                        <h4 className="font-bold text-gray-900 mb-3">Option (a)</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Prompt</label>
                            <input
                              type="text"
                              value={hq2OptionAPrompt}
                              onChange={(e) => setHq2OptionAPrompt(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                              placeholder="e.g., Write a blog about music"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Bullet Points (4)</label>
                            {hq2OptionABullets.map((bullet, index) => (
                              <input
                                key={index}
                                type="text"
                                value={bullet}
                                onChange={(e) => {
                                  const newBullets = [...hq2OptionABullets];
                                  newBullets[index] = e.target.value;
                                  setHq2OptionABullets(newBullets);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 mb-2"
                                placeholder={`Bullet point ${index + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Option B */}
                      <div className="bg-white rounded-lg p-4 border border-yellow-200">
                        <h4 className="font-bold text-gray-900 mb-3">Option (b)</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Prompt</label>
                            <input
                              type="text"
                              value={hq2OptionBPrompt}
                              onChange={(e) => setHq2OptionBPrompt(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                              placeholder="e.g., Write about your future plans"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Bullet Points (4)</label>
                            {hq2OptionBBullets.map((bullet, index) => (
                              <input
                                key={index}
                                type="text"
                                value={bullet}
                                onChange={(e) => {
                                  const newBullets = [...hq2OptionBBullets];
                                  newBullets[index] = e.target.value;
                                  setHq2OptionBBullets(newBullets);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 mb-2"
                                placeholder={`Bullet point ${index + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* H-Q3: Paragraph Translation (10 marks) */}
                  <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-300">
                    <h3 className="text-lg font-bold text-orange-900 mb-4">Q3: Paragraph Translation (10 marks)</h3>
                    <p className="text-sm text-orange-800 mb-4">Students translate a full paragraph from English into the target language.</p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">English Paragraph</label>
                        <textarea
                          value={hq3EnglishParagraph}
                          onChange={(e) => setHq3EnglishParagraph(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          rows={4}
                          placeholder="Enter the English paragraph to be translated..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Correct Translation (for teacher reference)</label>
                        <textarea
                          value={hq3CorrectTranslation}
                          onChange={(e) => setHq3CorrectTranslation(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          rows={4}
                          placeholder="Enter the correct translation..."
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Save/Cancel Buttons */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setViewMode('list')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {viewMode === 'create' ? 'Create Paper' : 'Save Changes'}
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

