'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Edit, Trash2, Eye, Save, AlertCircle, CheckCircle, Download, Upload, Image as ImageIcon, Loader } from 'lucide-react';
import type {
  AQAWritingPaper,
  AQAWritingQuestion,
  ListPapersResponse,
  GetNextIdentifierResponse,
  CreatePaperResponse,
  UpdatePaperResponse,
  DeletePaperResponse,
  PhotoDescriptionData,
  ShortMessageData,
  GapFillData,
  TranslationData,
  ExtendedWritingData,
  OverlapWritingData,
  OpenWritingData,
} from '@/types/aqa-writing-admin';

interface AQAWritingAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

type ViewMode = 'list' | 'create' | 'edit' | 'view';

export default function AQAWritingAdminModal({ isOpen, onClose, onRefresh }: AQAWritingAdminModalProps) {
  const PHOTO_PROMPT = 'What is in this photo? Write five sentences in Spanish.';

  // State management
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [papers, setPapers] = useState<AQAWritingPaper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<AQAWritingPaper | null>(null);
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

  // Q1: Photo Description
  const [q1PhotoUrl, setQ1PhotoUrl] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  // Q2: Short Message
  const [q2Prompt, setQ2Prompt] = useState<string>('Write a short message to your friend about your holidays');
  const [q2WordCount, setQ2WordCount] = useState<number>(50);
  const [q2BulletPoints, setQ2BulletPoints] = useState<string[]>(['city', 'hotel', 'food', 'weather', 'beach']);

  // Q3: Gap Fill
  const [q3Sentences, setQ3Sentences] = useState<Array<{
    completeSentence: string;
    gapPosition: number;
    options: string[];
    correctAnswer: string;
  }>>([
    { completeSentence: '', gapPosition: 1, options: ['', '', '', ''], correctAnswer: '' }
  ]);

  // Q4: Translation
  const [q4Sentences, setQ4Sentences] = useState<Array<{ englishText: string; correctTranslation: string }>>([
    { englishText: '', correctTranslation: '' }
  ]);

  // Q5: Extended Writing (Foundation)
  const [q5Prompt, setQ5Prompt] = useState<string>('You are writing an article about your daily life and aspirations');
  const [q5WordCount, setQ5WordCount] = useState<number>(90);
  const [q5BulletPoints, setQ5BulletPoints] = useState<string[]>([
    'What you did yesterday (past tense)',
    'What you think about your current hobbies (present tense/opinion)',
    'What you will do next weekend (future tense)'
  ]);

  // Higher Tier Questions
  // H-Q1: Translation (same as Foundation Q4, but worth 10 marks, minimum 50 words total)
  const [hq1Sentences, setHq1Sentences] = useState<Array<{ englishText: string; correctTranslation: string }>>([
    { englishText: '', correctTranslation: '' }
  ]);

  // H-Q2: Overlap Writing (90 words, 3 bullets, choice of 2)
  const [hq2Option1Prompt, setHq2Option1Prompt] = useState<string>('Write about your school experiences');
  const [hq2Option1BulletPoints, setHq2Option1BulletPoints] = useState<string[]>(['', '', '']);
  const [hq2Option2Prompt, setHq2Option2Prompt] = useState<string>('Write about your hobbies and interests');
  const [hq2Option2BulletPoints, setHq2Option2BulletPoints] = useState<string[]>(['', '', '']);

  // H-Q3: Open Writing (150 words, 2 bullets, choice of 1 or 2)
  const [hq3Option1Prompt, setHq3Option1Prompt] = useState<string>('Write about your future aspirations');
  const [hq3Option1BulletPoints, setHq3Option1BulletPoints] = useState<string[]>(['', '']);
  const [hq3Option2Prompt, setHq3Option2Prompt] = useState<string>('');
  const [hq3Option2BulletPoints, setHq3Option2BulletPoints] = useState<string[]>(['', '']);
  const [hq3HasTwoOptions, setHq3HasTwoOptions] = useState<boolean>(false);

  // Theme and topic (same for all questions)
  const [theme, setTheme] = useState<string>('Theme 1: People and lifestyle');
  const [topic, setTopic] = useState<string>('Identity and relationships with others');

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

  const loadPapers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
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

  const fetchNextIdentifier = async (language: string, tier: string) => {
    try {
      const response = await fetch(
        `/api/admin/aqa-writing/get-next-identifier?language=${language}&tier=${tier}`
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

  const handleCreate = () => {
    setViewMode('create');
    // Reset all form data
    setFormData({
      language: 'es',
      level: 'foundation',
      identifier: '',
      title: '',
      description: '',
      version: '1.0',
      is_active: true,
    });
    // Reset question data
    setQ1PhotoUrl('');
    setQ2Prompt('Write a short message to your friend about your holidays');
    setQ2WordCount(50);
    setQ2BulletPoints(['city', 'hotel', 'food', 'weather', 'beach']);
    setQ3Sentences([{ completeSentence: '', gapPosition: 1, options: ['', '', '', ''], correctAnswer: '' }]);
    setQ4Sentences([{ englishText: '', correctTranslation: '' }]);
    setQ5Prompt('You are writing an article about your daily life and aspirations');
    setQ5WordCount(90);
    setQ5BulletPoints([
      'What you did yesterday (past tense)',
      'What you think about your current hobbies (present tense/opinion)',
      'What you will do next weekend (future tense)'
    ]);
    setTheme('Theme 1: People and lifestyle');
    setTopic('Identity and relationships with others');
    setError(null);
    setSuccess(null);
  };

  const handleEdit = async (paper: AQAWritingPaper) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/aqa-writing/get/${paper.id}`);
      const data = await response.json();

      if (data.success) {
        setSelectedPaper(data.paper);
        setFormData({
          language: data.paper.language,
          level: data.paper.level || data.paper.tier,
          identifier: data.paper.identifier,
          title: data.paper.title,
          description: data.paper.description,
          version: data.paper.version,
          is_active: data.paper.is_active,
        });

        // Load questions based on tier
        const questions = data.paper.questions || [];
        const tier = data.paper.level || data.paper.tier;

        if (tier === 'foundation') {
          // Foundation Q1: Photo Description
          const q1 = questions.find((q: any) => q.question_number === 1);
          if (q1?.question_data) {
            setQ1PhotoUrl(q1.question_data.photoUrl || '');
          }

          // Foundation Q2: Short Message
          const q2 = questions.find((q: any) => q.question_number === 2);
          if (q2?.question_data) {
            setQ2Prompt(q2.question_data.prompt || '');
            setQ2WordCount(q2.question_data.wordCount || 50);
            setQ2BulletPoints(q2.question_data.bulletPoints || ['', '', '', '', '']);
          }

          // Foundation Q3: Gap Fill
          const q3 = questions.find((q: any) => q.question_number === 3);
          if (q3?.question_data?.sentences) {
            setQ3Sentences(q3.question_data.sentences.map((s: any) => ({
              completeSentence: s.completeSentence || '',
              gapPosition: s.gapPosition || 1,
              options: s.options || ['', '', '', ''],
              correctAnswer: s.correctAnswer || ''
            })));
          }

          // Foundation Q4: Translation
          const q4 = questions.find((q: any) => q.question_number === 4);
          if (q4?.question_data?.sentences) {
            setQ4Sentences(q4.question_data.sentences.map((s: any) => ({
              englishText: s.englishText || '',
              correctTranslation: s.correctTranslation || ''
            })));
          }

          // Foundation Q5: Extended Writing
          const q5 = questions.find((q: any) => q.question_number === 5);
          if (q5?.question_data) {
            setQ5Prompt(q5.question_data.prompt || '');
            setQ5WordCount(q5.question_data.wordCount || 90);
            setQ5BulletPoints(q5.question_data.bulletPoints || ['', '', '']);
          }
        } else {
          // Higher Q1: Translation
          const hq1 = questions.find((q: any) => q.question_number === 1);
          if (hq1?.question_data?.sentences) {
            setHq1Sentences(hq1.question_data.sentences.map((s: any) => ({
              englishText: s.englishText || '',
              correctTranslation: s.correctTranslation || ''
            })));
          }

          // Higher Q2: Overlap Writing
          const hq2 = questions.find((q: any) => q.question_number === 2);
          if (hq2?.question_data) {
            setHq2Option1Prompt(hq2.question_data.option1?.prompt || '');
            setHq2Option1BulletPoints(hq2.question_data.option1?.bulletPoints || ['', '', '']);
            setHq2Option2Prompt(hq2.question_data.option2?.prompt || '');
            setHq2Option2BulletPoints(hq2.question_data.option2?.bulletPoints || ['', '', '']);
          }

          // Higher Q3: Open Writing
          const hq3 = questions.find((q: any) => q.question_number === 3);
          if (hq3?.question_data) {
            setHq3Option1Prompt(hq3.question_data.option1?.prompt || '');
            setHq3Option1BulletPoints(hq3.question_data.option1?.bulletPoints || ['', '']);
            setHq3Option2Prompt(hq3.question_data.option2?.prompt || '');
            setHq3Option2BulletPoints(hq3.question_data.option2?.bulletPoints || ['', '']);
            setHq3HasTwoOptions(!!hq3.question_data.option2);
          }
        }

        // Load theme and topic from first question
        if (questions.length > 0) {
          setTheme(questions[0].theme || 'Theme 1: People and lifestyle');
          setTopic(questions[0].topic || 'Identity and relationships with others');
        }

        setViewMode('edit');
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

  const handleDelete = async (paperId: string) => {
    if (!confirm('Are you sure you want to delete this paper? This action cannot be undone if the paper has no student results.')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/aqa-writing/delete', {
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
        setQ1PhotoUrl(result.photoUrl);
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
  
  const triggerPhotoPicker = () => {
    photoInputRef.current?.click();
  };

  const handleExportJSON = () => {
    const exportData = {
      paper: formData,
      q1: { photoUrl: q1PhotoUrl, photoPrompt: PHOTO_PROMPT },
      q2: { prompt: q2Prompt, wordCount: q2WordCount, bulletPoints: q2BulletPoints },
      q3: { sentences: q3Sentences },
      q4: { sentences: q4Sentences },
      q5: { prompt: q5Prompt, wordCount: q5WordCount, bulletPoints: q5BulletPoints },
      theme,
      topic,
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.identifier || 'writing-paper'}-export.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);

        if (importData.paper) setFormData(importData.paper);
        if (importData.q1) {
          setQ1PhotoUrl(importData.q1.photoUrl || '');
        }
        if (importData.q2) {
          setQ2Prompt(importData.q2.prompt || '');
          setQ2WordCount(importData.q2.wordCount || 50);
          setQ2BulletPoints(importData.q2.bulletPoints || []);
        }
        if (importData.q3) {
          setQ3Sentences(importData.q3.sentences || []);
        }
        if (importData.q4) {
          setQ4Sentences(importData.q4.sentences || []);
        }
        if (importData.q5) {
          setQ5Prompt(importData.q5.prompt || '');
          setQ5WordCount(importData.q5.wordCount || 90);
          setQ5BulletPoints(importData.q5.bulletPoints || []);
        }
        if (importData.theme) setTheme(importData.theme);
        if (importData.topic) setTopic(importData.topic);

        setSuccess('Data imported successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Failed to import JSON. Please check the file format.');
      }
    };
    reader.readAsText(file);
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
        // Q1: Photo Description
        {
          question_number: 1,
          question_type: 'photo-description',
          title: 'Photo Description',
          instructions: 'Write 5 sentences describing the photo.',
          question_data: {
            photoUrl: q1PhotoUrl,
            photoPrompt: PHOTO_PROMPT
          } as PhotoDescriptionData,
          marks: 10,
          theme: theme as any,
          topic: topic as any,
          difficulty_rating: 3,
        },
        // Q2: Short Message
        {
          question_number: 2,
          question_type: 'short-message',
          title: 'Short Message',
          instructions: `${q2Prompt}. Write approximately ${q2WordCount} words. In your message, you must mention all the bullet points.`,
          question_data: {
            prompt: q2Prompt,
            wordCount: q2WordCount,
            bulletPoints: q2BulletPoints
          } as ShortMessageData,
          marks: 10,
          word_count_requirement: q2WordCount,
          theme: theme as any,
          topic: topic as any,
          difficulty_rating: 3,
        },
        // Q3: Gap Fill
        {
          question_number: 3,
          question_type: 'gap-fill',
          title: 'Gap Fill',
          instructions: 'Fill in the gaps with the correct words.',
          question_data: {
            sentences: q3Sentences.map((s, i) => ({
              number: i + 1,
              ...s
            }))
          } as GapFillData,
          marks: 10,
          theme: theme as any,
          topic: topic as any,
          difficulty_rating: 3,
        },
        // Q4: Translation
        {
          question_number: 4,
          question_type: 'translation',
          title: 'Translation',
          instructions: 'Translate the following sentences into Spanish.',
          question_data: {
            sentences: q4Sentences.map((s, i) => ({
              number: i + 1,
              ...s
            }))
          } as TranslationData,
          marks: 10,
          theme: theme as any,
          topic: topic as any,
          difficulty_rating: 3,
        },
        // Q5: Extended Writing
        {
          question_number: 5,
          question_type: 'extended-writing',
          title: 'Extended Writing',
          instructions: `${q5Prompt}. Write approximately ${q5WordCount} words in Spanish. You must write something about each bullet point.`,
          question_data: {
            prompt: q5Prompt,
            wordCount: q5WordCount,
            bulletPoints: q5BulletPoints
          } as ExtendedWritingData,
          marks: 10,
          word_count_requirement: q5WordCount,
          theme: theme as any,
          topic: topic as any,
          difficulty_rating: 3,
        },
      ] : [
        // HIGHER TIER QUESTIONS
        // H-Q1: Translation (10 marks, minimum 50 words total)
        {
          question_number: 1,
          question_type: 'translation',
          title: 'Translation',
          instructions: 'Translate the following sentences from English into Spanish. Minimum 50 words in total.',
          question_data: {
            sentences: hq1Sentences.map((s, i) => ({
              number: i + 1,
              ...s
            }))
          } as TranslationData,
          marks: 10,
          word_count_requirement: 50,
          theme: theme as any,
          topic: topic as any,
          difficulty_rating: 4,
        },
        // H-Q2: Overlap Writing (15 marks, ~90 words, 3 bullets, choice of 2)
        {
          question_number: 2,
          question_type: 'overlap-writing',
          title: 'Overlap Writing',
          instructions: 'Choose ONE question. Write approximately 90 words. You must address all three bullet points.',
          question_data: {
            option1: {
              prompt: hq2Option1Prompt,
              wordCount: 90,
              bulletPoints: hq2Option1BulletPoints
            },
            option2: {
              prompt: hq2Option2Prompt,
              wordCount: 90,
              bulletPoints: hq2Option2BulletPoints
            }
          } as OverlapWritingData,
          marks: 15,
          word_count_requirement: 90,
          theme: theme as any,
          topic: topic as any,
          difficulty_rating: 4,
        },
        // H-Q3: Open Writing (25 marks, ~150 words, 2 bullets)
        {
          question_number: 3,
          question_type: 'open-writing',
          title: 'Open Writing',
          instructions: hq3HasTwoOptions
            ? 'Choose ONE question. Write approximately 150 words. You must address both bullet points.'
            : 'Write approximately 150 words. You must address both bullet points.',
          question_data: {
            option1: {
              prompt: hq3Option1Prompt,
              wordCount: 150,
              bulletPoints: hq3Option1BulletPoints
            },
            ...(hq3HasTwoOptions && {
              option2: {
                prompt: hq3Option2Prompt,
                wordCount: 150,
                bulletPoints: hq3Option2BulletPoints
              }
            })
          } as OpenWritingData,
          marks: 25,
          word_count_requirement: 150,
          theme: theme as any,
          topic: topic as any,
          difficulty_rating: 5,
        },
      ];

      const payload = {
        paper: {
          ...formData,
          exam_board: 'aqa',
          tier: formData.level,
        },
        questions: questions,
      };

      if (viewMode === 'create') {
        const response = await fetch('/api/admin/aqa-writing/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data: CreatePaperResponse = await response.json();

        if (data.success) {
          setSuccess('Paper created successfully!');
          setIsLoading(false);
          setTimeout(() => {
            setViewMode('list');
            loadPapers();
            if (onRefresh) onRefresh();
          }, 1500);
        } else {
          setError(data.error || 'Failed to create paper');
        }
      } else if (viewMode === 'edit' && selectedPaper) {
        const response = await fetch('/api/admin/aqa-writing/update', {
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
          setIsLoading(false);
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
      // Only set loading to false if it hasn't been set already
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {viewMode === 'list' && 'Manage AQA Writing Papers'}
            {viewMode === 'create' && 'Create New Writing Paper'}
            {viewMode === 'edit' && 'Edit Writing Paper'}
            {viewMode === 'view' && 'View Writing Paper'}
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
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Languages</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>

                  <select
                    value={filterTier}
                    onChange={(e) => setFilterTier(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Tiers</option>
                    <option value="foundation">Foundation</option>
                    <option value="higher">Higher</option>
                  </select>
                </div>

                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Create New Paper
                </button>
              </div>

              {/* Papers List */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  <p className="mt-4 text-gray-600">Loading papers...</p>
                </div>
              ) : papers.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
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
                        onChange={handleImportJSON}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={handleExportJSON}
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
                    <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="font-bold text-blue-900">
                        {formData.level === 'foundation' ? '70' : '75'} minutes
                      </span>
                      <span className="text-xs text-blue-700 ml-2">(Auto-set)</span>
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
                      placeholder="e.g., AQA GCSE Spanish Writing - Foundation Tier - Paper 1"
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

              {/* Theme and Topic (applies to all questions) */}
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
                  {/* Q1: Photo Description */}
                  <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-300">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Q1: Photo Description (10 marks)</h3>
                <p className="text-sm text-blue-800 mb-4">Students write 5 sentences describing the photo.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Photo *</label>
                    
                    {/* Hidden file input - kept outside conditional to prevent React DOM errors */}
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handlePhotoUpload}
                      disabled={isUploadingPhoto}
                      className="hidden"
                    />
                    
                    <div className="space-y-4">
                      {q1PhotoUrl ? (
                        <>
                          <div className="relative inline-block">
                            <img
                              src={q1PhotoUrl}
                              alt="Question photo"
                              className="w-full max-w-md rounded-lg border-2 border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => setQ1PhotoUrl('')}
                              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                              title="Remove photo"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={triggerPhotoPicker}
                              disabled={isUploadingPhoto}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-70"
                            >
                              {isUploadingPhoto ? (
                                <>
                                  <Loader className="w-4 h-4 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4" />
                                  Replace Photo
                                </>
                              )}
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white">
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <button
                            type="button"
                            onClick={triggerPhotoPicker}
                            disabled={isUploadingPhoto}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-70"
                          >
                            {isUploadingPhoto ? (
                              <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4" />
                                Upload Photo
                              </>
                            )}
                          </button>
                          <p className="text-sm text-gray-500 mt-2">JPEG, PNG, or WebP • Max 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Photo Prompt
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm">
                      {PHOTO_PROMPT}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">This prompt is fixed for all photo description questions.</p>
                  </div>
                </div>
              </div>

              {/* Q2: Short Message */}
              <div className="bg-green-50 rounded-lg p-6 border-2 border-green-300">
                <h3 className="text-lg font-bold text-green-900 mb-4">Q2: Short Message (10 marks)</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Prompt *</label>
                    <input
                      type="text"
                      value={q2Prompt}
                      onChange={(e) => setQ2Prompt(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Write a short message to your friend about your holidays"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Word Count *</label>
                    <input
                      type="number"
                      value={q2WordCount}
                      onChange={(e) => setQ2WordCount(parseInt(e.target.value) || 50)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Bullet Points (5 required)</label>
                    {q2BulletPoints.map((point, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => {
                            const newPoints = [...q2BulletPoints];
                            newPoints[index] = e.target.value;
                            setQ2BulletPoints(newPoints);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder={`Bullet point ${index + 1}`}
                        />
                        {q2BulletPoints.length > 1 && (
                          <button
                            onClick={() => setQ2BulletPoints(q2BulletPoints.filter((_, i) => i !== index))}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {q2BulletPoints.length < 5 && (
                      <button
                        onClick={() => setQ2BulletPoints([...q2BulletPoints, ''])}
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                      >
                        <Plus className="w-4 h-4 inline mr-1" />
                        Add Bullet Point
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Q3: Gap Fill */}
              <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300">
                <h3 className="text-lg font-bold text-yellow-900 mb-4">Q3: Gap Fill (10 marks)</h3>
                <p className="text-sm text-gray-700 mb-4">Students select the correct word to complete each sentence from 4 options.</p>

                <div className="space-y-6">
                  {q3Sentences.map((sentence, index) => {
                    const words = sentence.completeSentence.trim().split(/\s+/).filter(w => w);
                    const wordCount = words.length;

                    return (
                      <div key={index} className="bg-white rounded-lg p-4 border border-yellow-200">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-sm font-bold text-gray-700">Sentence {index + 1}</span>
                          {q3Sentences.length > 1 && (
                            <button
                              onClick={() => setQ3Sentences(q3Sentences.filter((_, i) => i !== index))}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Complete Sentence Input */}
                        <div className="mb-3">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Complete Sentence (in Spanish)
                          </label>
                          <input
                            type="text"
                            value={sentence.completeSentence}
                            onChange={(e) => {
                              const newSentences = [...q3Sentences];
                              newSentences[index].completeSentence = e.target.value;
                              setQ3Sentences(newSentences);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="e.g., ME GUSTA IR AL CINE"
                          />
                          {wordCount > 0 && (
                            <p className="text-xs text-gray-500 mt-1">{wordCount} words detected</p>
                          )}
                        </div>

                        {/* Gap Position Selector */}
                        <div className="mb-3">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Which word should be missing? (Position)
                          </label>
                          <select
                            value={sentence.gapPosition}
                            onChange={(e) => {
                              const newSentences = [...q3Sentences];
                              newSentences[index].gapPosition = parseInt(e.target.value);
                              // Auto-set correct answer to the word at that position
                              const words = sentence.completeSentence.trim().split(/\s+/).filter(w => w);
                              if (words[parseInt(e.target.value) - 1]) {
                                newSentences[index].correctAnswer = words[parseInt(e.target.value) - 1];
                              }
                              setQ3Sentences(newSentences);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            disabled={wordCount === 0}
                          >
                            {wordCount === 0 ? (
                              <option value={1}>Enter sentence first</option>
                            ) : (
                              Array.from({ length: wordCount }, (_, i) => i + 1).map(pos => (
                                <option key={pos} value={pos}>
                                  Word {pos}: {words[pos - 1]}
                                </option>
                              ))
                            )}
                          </select>
                        </div>

                        {/* Preview with Gap */}
                        {wordCount > 0 && (
                          <div className="mb-3 p-3 bg-gray-50 rounded border border-gray-200">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Preview:</label>
                            <p className="text-sm font-mono">
                              {words.map((word, i) => (
                                <span key={i}>
                                  {i === sentence.gapPosition - 1 ? (
                                    <span className="inline-block px-3 py-1 bg-yellow-200 border-2 border-yellow-400 rounded">
                                      _____
                                    </span>
                                  ) : (
                                    word
                                  )}
                                  {i < words.length - 1 && ' '}
                                </span>
                              ))}
                            </p>
                          </div>
                        )}

                        {/* 4 Multiple Choice Options */}
                        <div className="mb-3">
                          <label className="block text-xs font-semibold text-gray-700 mb-2">
                            4 Multiple Choice Options (one must be correct)
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {sentence.options.map((option, optIndex) => (
                              <input
                                key={optIndex}
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newSentences = [...q3Sentences];
                                  newSentences[index].options[optIndex] = e.target.value;
                                  setQ3Sentences(newSentences);
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                placeholder={`Option ${optIndex + 1}`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Correct Answer */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Correct Answer (must match one of the options above)
                          </label>
                          <input
                            type="text"
                            value={sentence.correctAnswer}
                            onChange={(e) => {
                              const newSentences = [...q3Sentences];
                              newSentences[index].correctAnswer = e.target.value;
                              setQ3Sentences(newSentences);
                            }}
                            className="w-full px-3 py-2 border border-green-300 bg-green-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-semibold"
                            placeholder="e.g., ir"
                          />
                        </div>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => setQ3Sentences([...q3Sentences, { completeSentence: '', gapPosition: 1, options: ['', '', '', ''], correctAnswer: '' }])}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Add Sentence
                  </button>
                </div>
              </div>

              {/* Q4: Translation */}
              <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-300">
                <h3 className="text-lg font-bold text-orange-900 mb-4">Q4: Translation (10 marks)</h3>
                <p className="text-sm text-gray-700 mb-4">Students translate sentences from English into Spanish.</p>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Sentences to Translate</label>
                  {q4Sentences.map((sentence, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-orange-200">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-bold text-gray-700">4.{index + 1}</span>
                        {q4Sentences.length > 1 && (
                          <button
                            onClick={() => setQ4Sentences(q4Sentences.filter((_, i) => i !== index))}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          English Sentence (what students will see)
                        </label>
                        <input
                          type="text"
                          value={sentence.englishText}
                          onChange={(e) => {
                            const newSentences = [...q4Sentences];
                            newSentences[index].englishText = e.target.value;
                            setQ4Sentences(newSentences);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="e.g., I like going to the cinema"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Correct Spanish Translation (for marking)
                        </label>
                        <input
                          type="text"
                          value={sentence.correctTranslation}
                          onChange={(e) => {
                            const newSentences = [...q4Sentences];
                            newSentences[index].correctTranslation = e.target.value;
                            setQ4Sentences(newSentences);
                          }}
                          className="w-full px-3 py-2 border border-green-300 bg-green-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-semibold"
                          placeholder="e.g., Me gusta ir al cine"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setQ4Sentences([...q4Sentences, { englishText: '', correctTranslation: '' }])}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Add Sentence
                  </button>
                </div>
              </div>

              {/* Q5: Extended Writing */}
              <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-300">
                <h3 className="text-lg font-bold text-purple-900 mb-4">Q5: Extended Writing (10 marks)</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Prompt *</label>
                    <input
                      type="text"
                      value={q5Prompt}
                      onChange={(e) => setQ5Prompt(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., You are writing an article about your daily life and aspirations"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Word Count *</label>
                    <input
                      type="number"
                      value={q5WordCount}
                      onChange={(e) => setQ5WordCount(parseInt(e.target.value) || 90)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="90"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Bullet Points (3 required)</label>
                    {q5BulletPoints.map((point, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => {
                            const newPoints = [...q5BulletPoints];
                            newPoints[index] = e.target.value;
                            setQ5BulletPoints(newPoints);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder={`Bullet point ${index + 1} (include tense requirement)`}
                        />
                        {q5BulletPoints.length > 1 && (
                          <button
                            onClick={() => setQ5BulletPoints(q5BulletPoints.filter((_, i) => i !== index))}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {q5BulletPoints.length < 3 && (
                      <button
                        onClick={() => setQ5BulletPoints([...q5BulletPoints, ''])}
                        className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
                      >
                        <Plus className="w-4 h-4 inline mr-1" />
                        Add Bullet Point
                      </button>
                    )}
                  </div>
                </div>
              </div>
                </>
              )}

              {/* HIGHER TIER QUESTIONS */}
              {formData.level === 'higher' && (
                <>
                  {/* H-Q1: Translation (10 marks, minimum 50 words) */}
                  <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-300">
                    <h3 className="text-lg font-bold text-orange-900 mb-4">Q1: Translation (10 marks)</h3>
                    <p className="text-sm text-orange-800 mb-4">Translate sentences from English into Spanish. Minimum 50 words total. 2 marks each.</p>

                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Sentences to Translate</label>
                      {hq1Sentences.map((sentence, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-orange-200">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-sm font-bold text-gray-700">Sentence {index + 1}</span>
                            {hq1Sentences.length > 1 && (
                              <button
                                onClick={() => setHq1Sentences(hq1Sentences.filter((_, i) => i !== index))}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={sentence.englishText}
                            onChange={(e) => {
                              const newSentences = [...hq1Sentences];
                              newSentences[index].englishText = e.target.value;
                              setHq1Sentences(newSentences);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-2"
                            placeholder="English sentence"
                          />
                          <input
                            type="text"
                            value={sentence.correctTranslation}
                            onChange={(e) => {
                              const newSentences = [...hq1Sentences];
                              newSentences[index].correctTranslation = e.target.value;
                              setHq1Sentences(newSentences);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Correct translation"
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => setHq1Sentences([...hq1Sentences, { englishText: '', correctTranslation: '' }])}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold"
                      >
                        <Plus className="w-4 h-4 inline mr-1" />
                        Add Sentence
                      </button>
                    </div>
                  </div>

                  {/* H-Q2: Overlap Writing (15 marks, ~90 words, 3 bullets, choice of 2) */}
                  <div className="bg-green-50 rounded-lg p-6 border-2 border-green-300">
                    <h3 className="text-lg font-bold text-green-900 mb-4">Q2: Overlap Writing (15 marks)</h3>
                    <p className="text-sm text-green-800 mb-4">Students choose ONE question. Write approximately 90 words addressing all 3 bullet points.</p>

                    <div className="space-y-6">
                      {/* Option 1 */}
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <h4 className="font-bold text-gray-900 mb-3">Option 1</h4>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={hq2Option1Prompt}
                            onChange={(e) => setHq2Option1Prompt(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., Write about your school experiences"
                          />
                          {hq2Option1BulletPoints.map((point, index) => (
                            <input
                              key={index}
                              type="text"
                              value={point}
                              onChange={(e) => {
                                const newPoints = [...hq2Option1BulletPoints];
                                newPoints[index] = e.target.value;
                                setHq2Option1BulletPoints(newPoints);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder={`Bullet point ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Option 2 */}
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <h4 className="font-bold text-gray-900 mb-3">Option 2</h4>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={hq2Option2Prompt}
                            onChange={(e) => setHq2Option2Prompt(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., Write about your hobbies and interests"
                          />
                          {hq2Option2BulletPoints.map((point, index) => (
                            <input
                              key={index}
                              type="text"
                              value={point}
                              onChange={(e) => {
                                const newPoints = [...hq2Option2BulletPoints];
                                newPoints[index] = e.target.value;
                                setHq2Option2BulletPoints(newPoints);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder={`Bullet point ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* H-Q3: Open Writing (25 marks, ~150 words, 2 bullets) */}
                  <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-300">
                    <h3 className="text-lg font-bold text-purple-900 mb-4">Q3: Open Writing (25 marks)</h3>
                    <p className="text-sm text-purple-800 mb-4">Write approximately 150 words addressing both bullet points.</p>

                    <div className="mb-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={hq3HasTwoOptions}
                          onChange={(e) => setHq3HasTwoOptions(e.target.checked)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm font-semibold text-gray-900">Provide choice of 2 questions (optional)</span>
                      </label>
                    </div>

                    <div className="space-y-6">
                      {/* Option 1 (always shown) */}
                      <div className="bg-white rounded-lg p-4 border border-purple-200">
                        <h4 className="font-bold text-gray-900 mb-3">{hq3HasTwoOptions ? 'Option 1' : 'Question'}</h4>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={hq3Option1Prompt}
                            onChange={(e) => setHq3Option1Prompt(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g., Write about your future aspirations"
                          />
                          {hq3Option1BulletPoints.map((point, index) => (
                            <input
                              key={index}
                              type="text"
                              value={point}
                              onChange={(e) => {
                                const newPoints = [...hq3Option1BulletPoints];
                                newPoints[index] = e.target.value;
                                setHq3Option1BulletPoints(newPoints);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder={`Bullet point ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Option 2 (conditional) */}
                      {hq3HasTwoOptions && (
                        <div className="bg-white rounded-lg p-4 border border-purple-200">
                          <h4 className="font-bold text-gray-900 mb-3">Option 2</h4>
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={hq3Option2Prompt}
                              onChange={(e) => setHq3Option2Prompt(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="e.g., Write about a memorable experience"
                            />
                            {hq3Option2BulletPoints.map((point, index) => (
                              <input
                                key={index}
                                type="text"
                                value={point}
                                onChange={(e) => {
                                  const newPoints = [...hq3Option2BulletPoints];
                                  newPoints[index] = e.target.value;
                                  setHq3Option2BulletPoints(newPoints);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder={`Bullet point ${index + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Save Button */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setViewMode('list')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {viewMode === 'create' ? 'Create Paper' : 'Update Paper'}
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

