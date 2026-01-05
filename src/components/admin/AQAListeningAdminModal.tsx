'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, FileJson, Save, AlertCircle, CheckCircle, Loader, Play, Volume2, Copy, Clipboard } from 'lucide-react';

interface AQAListeningAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

type ViewMode = 'list' | 'create' | 'edit';

interface AQAListeningPaper {
  id?: string;
  title: string;
  description?: string;
  level: 'foundation' | 'higher';
  language: 'es' | 'fr' | 'de';
  identifier: string;
  version?: string;
  total_questions?: number;
  time_limit_minutes: number;
  is_active?: boolean;
}

interface AQAListeningQuestion {
  question_number: number;
  sub_question_number?: string;
  question_type: 'letter-matching' | 'multiple-choice' | 'lifestyle-grid' | 'opinion-rating' | 'open-response' | 'activity-timing' | 'multi-part' | 'dictation';
  title: string;
  instructions: string;
  audio_text: string;
  audio_url?: string;
  audio_transcript?: string;
  question_data: any;
  marks: number;
  theme: string;
  topic: string;
  tts_config?: {
    voiceName?: string;
    multiSpeaker?: boolean;
    speakers?: Array<{ name: string; voiceName: string; style?: string }>;
    style?: string;
    pace?: 'very_slow' | 'slow' | 'normal' | 'fast';
    tone?: 'neutral' | 'cheerful' | 'serious' | 'excited' | 'calm' | 'formal' | 'friendly';
  };
  difficulty_rating?: number;
}

const THEMES = [
  'Theme 1: People and lifestyle',
  'Theme 2: Popular culture',
  'Theme 3: Communication and the world around us'
];

const TOPICS = [
  'Identity and relationships with others',
  'Healthy living and lifestyle',
  'Education and work',
  'Free-time activities',
  'Customs, festivals and celebrations',
  'Celebrity culture',
  'Travel and tourism, including places of interest',
  'Media and technology',
  'The environment and where people live'
];

const QUESTION_TYPES = [
  { value: 'letter-matching', label: 'Letter Matching' },
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'lifestyle-grid', label: 'Lifestyle Grid' },
  { value: 'opinion-rating', label: 'Opinion Rating' },
  { value: 'open-response', label: 'Open Response' },
  { value: 'activity-timing', label: 'Activity Timing' },
  { value: 'multi-part', label: 'Multi-Part' },
  { value: 'dictation', label: 'Dictation' }
];

export default function AQAListeningAdminModal({ isOpen, onClose, onRefresh }: AQAListeningAdminModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [papers, setPapers] = useState<AQAListeningPaper[]>([]);
  const [editingPaperId, setEditingPaperId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filter state
  const [filterLanguage, setFilterLanguage] = useState<string>('');
  const [filterTier, setFilterTier] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState<AQAListeningPaper>({
    title: '',
    description: '',
    level: 'foundation',
    language: 'es',
    identifier: '',
    version: '1.0',
    time_limit_minutes: 35,
    is_active: true,
  });

  const [questions, setQuestions] = useState<AQAListeningQuestion[]>([]);

  // Audio generation state
  const [audioGenerationStatus, setAudioGenerationStatus] = useState<{
    [key: number]: 'not-generated' | 'generating' | 'generated' | 'error'
  }>({});

  const [audioUrls, setAudioUrls] = useState<{ [key: number]: string }>({});

  // Process imported JSON string
  const processImportJson = (jsonString: string) => {
    try {
      const json = JSON.parse(jsonString);

      if (!json.paper || !Array.isArray(json.questions)) {
        throw new Error('Invalid JSON format: missing paper or questions');
      }

      if (confirm(`Importing "${json.paper.title}". This will replace current form data. Continue?`)) {
        setFormData({
          ...json.paper,
          id: undefined, // Don't import ID
          is_active: true
        });

        // Reset audio generation status but preserve check for existing URLS
        const urls: { [key: number]: string } = {};
        const status: { [key: number]: 'not-generated' | 'generating' | 'generated' | 'error' } = {};

        // Map questions and preserve audio_url if available internally but missing in import
        const processedQuestions = json.questions.map((q: any, idx: number) => {
          // Smart mapping for Themes (Old Spec -> New Spec)
          if (!THEMES.includes(q.theme)) {
            const t = (q.theme || '').toLowerCase();
            if (t.includes('identity')) q.theme = 'Theme 1: People and lifestyle';
            else if (t.includes('popular') || t.includes('celebrity') || t.includes('culture')) q.theme = 'Theme 2: Popular culture';
            else if (t.includes('study') || t.includes('employment') || t.includes('work')) q.theme = 'Theme 1: People and lifestyle';
            else if (t.includes('global') || t.includes('current') || t.includes('communication') || t.includes('world')) q.theme = 'Theme 3: Communication and the world around us';
            else q.theme = THEMES[0];
          }

          // Smart mapping for Topics (Old Spec -> New Spec)
          if (!TOPICS.includes(q.topic)) {
            const t = (q.topic || '').toLowerCase();
            if (t.includes('family') || t.includes('friend') || t.includes('relationship')) q.topic = 'Identity and relationships with others';
            else if (t.includes('health') || t.includes('lifestyle')) q.topic = 'Healthy living and lifestyle';
            else if (t.includes('jobs') || t.includes('career') || t.includes('work') || t.includes('school') || t.includes('studies') || t.includes('education')) q.topic = 'Education and work';
            else if (t.includes('free-time') || t.includes('hobbies') || t.includes('sport') || t.includes('leisure')) q.topic = 'Free-time activities';
            else if (t.includes('customs') || t.includes('festivals') || t.includes('celebration')) q.topic = 'Customs, festivals and celebrations';
            else if (t.includes('celebrity') || t.includes('famous')) q.topic = 'Celebrity culture';
            else if (t.includes('travel') || t.includes('tourism') || t.includes('holiday') || t.includes('places')) q.topic = 'Travel and tourism, including places of interest';
            else if (t.includes('technology') || t.includes('media') || t.includes('mobile') || t.includes('internet') || t.includes('social')) q.topic = 'Media and technology';
            else if (t.includes('environment') || t.includes('town') || t.includes('neighbourhood') || t.includes('global') || t.includes('live')) q.topic = 'The environment and where people live';
            else q.topic = TOPICS[0];
          }

          // Check if we have an existing URL for this index
          const existingUrl = audioUrls[idx] || (questions[idx] && questions[idx].audio_url);

          if (q.audio_url) {
            urls[idx] = q.audio_url;
            status[idx] = 'generated';
            return q;
          } else if (existingUrl) {
            console.log(`Preserving existing audio for question ${idx + 1}`);
            urls[idx] = existingUrl;
            status[idx] = 'generated';
            return { ...q, audio_url: existingUrl };
          } else {
            status[idx] = 'not-generated';
            return q;
          }
        });

        setQuestions(processedQuestions);
        setAudioUrls(urls);
        setAudioGenerationStatus(status);

        setSuccess('Paper imported successfully');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(`Failed to import JSON: ${err.message}`);
    }
  };

  // Handle JSON Export (Copy to Clipboard)
  const handleExport = async () => {
    const exportData = {
      paper: formData,
      questions: questions
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      setSuccess('JSON copied to clipboard!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to copy to clipboard');
      console.error(err);
    }
  };

  // Handle JSON Import (Paste from Clipboard)
  const handleImport = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        processImportJson(text);
      } else {
        const manualText = prompt("Clipboard access failed or empty. Paste JSON here:");
        if (manualText) processImportJson(manualText);
      }
    } catch (err) {
      const manualText = prompt("Paste your JSON here for import:");
      if (manualText) processImportJson(manualText);
    }
  };

  // Load papers on mount
  useEffect(() => {
    if (isOpen && viewMode === 'list') {
      loadPapers();
    }
  }, [isOpen, viewMode, filterLanguage, filterTier]);

  // Auto-set time limit based on tier
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      time_limit_minutes: prev.level === 'foundation' ? 35 : 45
    }));
  }, [formData.level]);

  // Auto-generate identifier and title in create mode
  useEffect(() => {
    if (viewMode === 'create') {
      const determineNextPaper = async () => {
        try {
          const params = new URLSearchParams();
          params.append('language', formData.language);
          params.append('tier', formData.level);

          const response = await fetch(`/api/admin/aqa-listening/list?${params.toString()}`);
          const result = await response.json();

          if (result.success && result.papers) {
            const existingPapers = result.papers;
            let maxNum = 0;
            existingPapers.forEach((p: any) => {
              const match = p.identifier.match(/paper-(\d+)/);
              if (match) {
                const num = parseInt(match[1]);
                if (num > maxNum) maxNum = num;
              }
            });

            const nextNum = maxNum + 1;
            const nextIdentifier = `paper-${nextNum}`;

            const langLabel = {
              'es': 'Spanish',
              'fr': 'French',
              'de': 'German'
            }[formData.language] || 'Spanish';

            const tierLabel = formData.level.charAt(0).toUpperCase() + formData.level.slice(1);

            const nextTitle = `AQA GCSE ${langLabel} Listening - ${tierLabel} Tier - Paper ${nextNum}`;

            setFormData(prev => ({
              ...prev,
              identifier: nextIdentifier,
              title: nextTitle
            }));
          }
        } catch (error) {
          console.error("Failed to auto-generate paper details", error);
        }
      };

      determineNextPaper();
    }
  }, [viewMode, formData.language, formData.level]);

  // Load papers from API
  const loadPapers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filterLanguage) params.append('language', filterLanguage);
      if (filterTier) params.append('tier', filterTier);

      const response = await fetch(`/api/admin/aqa-listening/list?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setPapers(data.papers || []);
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

  // Handle create new paper
  const handleCreate = () => {
    setViewMode('create');
    setEditingPaperId(null);
    setFormData({
      title: '',
      description: '',
      level: 'foundation',
      language: 'es',
      identifier: '',
      version: '1.0',
      time_limit_minutes: 35,
      is_active: true,
    });
    setQuestions([]);
    setAudioGenerationStatus({});
    setAudioUrls({});
    setError(null);
    setSuccess(null);
  };

  // Add new question
  const handleAddQuestion = () => {
    const newQuestion: AQAListeningQuestion = {
      question_number: questions.length + 1,
      question_type: 'multiple-choice',
      title: '',
      instructions: '',
      audio_text: '',
      question_data: {},
      marks: 1,
      theme: THEMES[0],
      topic: TOPICS[0],
      tts_config: {
        multiSpeaker: false,
        pace: 'normal',
        tone: 'neutral'
      },
      difficulty_rating: 3
    };
    setQuestions([...questions, newQuestion]);
  };

  // Update question
  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  // Remove question
  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
    // Remove audio status and URL for this question
    const newStatus = { ...audioGenerationStatus };
    const newUrls = { ...audioUrls };
    delete newStatus[index];
    delete newUrls[index];
    setAudioGenerationStatus(newStatus);
    setAudioUrls(newUrls);
  };

  // Generate audio for a single question
  const handleGenerateAudio = async (questionIndex: number) => {
    const question = questions[questionIndex];

    if (!question.audio_text || question.audio_text.trim() === '') {
      setError('Please enter audio text before generating audio');
      return;
    }

    setAudioGenerationStatus(prev => ({
      ...prev,
      [questionIndex]: 'generating'
    }));
    setError(null);

    try {
      const languageMap: { [key: string]: string } = {
        'es': 'spanish',
        'fr': 'french',
        'de': 'german'
      };

      const response = await fetch('/api/admin/generate-gemini-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: question.audio_text,
          language: languageMap[formData.language],
          questionId: `${formData.identifier}_q${question.question_number}`,
          type: question.tts_config?.multiSpeaker ? 'multi' : 'exam',
          speakers: question.tts_config?.speakers,
          options: {
            includeInstructions: true,
            speakingSpeed: question.tts_config?.pace || 'normal',
            tone: question.tts_config?.tone || 'neutral',
            questionNumber: question.question_number
          }
        })
      });

      const result = await response.json();

      if (result.success && result.audioUrl) {
        setAudioUrls(prev => ({
          ...prev,
          [questionIndex]: result.audioUrl
        }));

        setAudioGenerationStatus(prev => ({
          ...prev,
          [questionIndex]: 'generated'
        }));

        // Update question with audio URL
        updateQuestion(questionIndex, 'audio_url', result.audioUrl);
      } else {
        throw new Error(result.error || 'Failed to generate audio');
      }
    } catch (error: any) {
      console.error('Error generating audio:', error);
      setError(`Failed to generate audio: ${error.message}`);
      setAudioGenerationStatus(prev => ({
        ...prev,
        [questionIndex]: 'error'
      }));
    }
  };

  // Generate all audio
  const handleGenerateAllAudio = async () => {
    for (let i = 0; i < questions.length; i++) {
      if (audioGenerationStatus[i] !== 'generated') {
        await handleGenerateAudio(i);
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  // Handle save paper
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

      // Validate all questions have audio generated (either new or existing)
      const missingAudio = questions.filter((q, idx) => !audioUrls[idx] && !q.audio_url);
      if (missingAudio.length > 0) {
        setError(`Please generate audio for all ${questions.length} questions before saving (Missing: ${missingAudio.length})`);
        setIsLoading(false);
        return;
      }

      // Build questions with audio URLs and sanitise data
      const questionsWithAudio = questions.map((q, idx) => {
        let theme = q.theme;
        let topic = q.topic;

        // Validate and map Theme
        if (!THEMES.includes(theme)) {
          const t = (theme || '').toLowerCase();
          if (t.includes('identity')) theme = 'Theme 1: People and lifestyle';
          else if (t.includes('popular') || t.includes('celebrity') || t.includes('culture')) theme = 'Theme 2: Popular culture';
          else if (t.includes('study') || t.includes('employment') || t.includes('work')) theme = 'Theme 1: People and lifestyle';
          else if (t.includes('global') || t.includes('current') || t.includes('communication') || t.includes('world')) theme = 'Theme 3: Communication and the world around us';
          else theme = THEMES[0];
        }

        // Validate and map Topic
        if (!TOPICS.includes(topic)) {
          const t = (topic || '').toLowerCase();
          if (t.includes('family') || t.includes('friend') || t.includes('relationship')) topic = 'Identity and relationships with others';
          else if (t.includes('health') || t.includes('lifestyle')) topic = 'Healthy living and lifestyle';
          else if (t.includes('jobs') || t.includes('career') || t.includes('work') || t.includes('school') || t.includes('studies') || t.includes('education')) topic = 'Education and work';
          else if (t.includes('free-time') || t.includes('hobbies') || t.includes('sport') || t.includes('leisure')) topic = 'Free-time activities';
          else if (t.includes('customs') || t.includes('festivals') || t.includes('celebration')) topic = 'Customs, festivals and celebrations';
          else if (t.includes('celebrity') || t.includes('famous')) topic = 'Celebrity culture';
          else if (t.includes('travel') || t.includes('tourism') || t.includes('holiday') || t.includes('places')) topic = 'Travel and tourism, including places of interest';
          else if (t.includes('technology') || t.includes('media') || t.includes('mobile') || t.includes('internet') || t.includes('social')) topic = 'Media and technology';
          else if (t.includes('environment') || t.includes('town') || t.includes('neighbourhood') || t.includes('global') || t.includes('live')) topic = 'The environment and where people live';
          else topic = TOPICS[0];
        }

        return {
          ...q,
          theme,
          topic,
          audio_url: audioUrls[idx] || q.audio_url
        };
      });

      const payload = {
        paper: {
          ...formData,
          total_questions: questions.length,
        },
        questions: questionsWithAudio,
      };

      const endpoint = viewMode === 'edit' && editingPaperId
        ? `/api/admin/aqa-listening/update?id=${editingPaperId}`
        : '/api/admin/aqa-listening/create';

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
        throw new Error(result.error + (result.details ? `: ${result.details}` : '') || 'Failed to save paper');
      }
    } catch (error: any) {
      console.error('Error saving paper:', error);
      setError(`Failed to save paper: ${error.message}`);
      setIsLoading(false);
    }
  };

  // Handle edit paper
  const handleEdit = async (paper: AQAListeningPaper) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/aqa-listening/get/${paper.id}`);
      const data = await response.json();

      if (data.success) {
        setEditingPaperId(paper.id!);
        setFormData({
          language: data.paper.language,
          level: data.paper.level,
          identifier: data.paper.identifier,
          title: data.paper.title,
          description: data.paper.description,
          version: data.paper.version,
          time_limit_minutes: data.paper.time_limit_minutes,
          is_active: data.paper.is_active,
        });
        setQuestions(data.questions || []);

        // Set audio URLs and status for existing questions
        const urls: { [key: number]: string } = {};
        const status: { [key: number]: 'not-generated' | 'generating' | 'generated' | 'error' } = {};

        data.questions?.forEach((q: any, idx: number) => {
          if (q.audio_url) {
            urls[idx] = q.audio_url;
            status[idx] = 'generated';
          }
        });

        setAudioUrls(urls);
        setAudioGenerationStatus(status);
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

  // Handle delete paper
  const handleDelete = async (paper: AQAListeningPaper) => {
    if (!confirm(`Are you sure you want to delete "${paper.title}"? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/aqa-listening/delete?id=${paper.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Paper deleted successfully!');
        loadPapers();
        setTimeout(() => setSuccess(null), 3000);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">AQA Listening Admin Panel</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-800 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-green-800">{success}</p>
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === 'list' && (
            <div>
              {/* Filter Controls */}
              <div className="mb-6 flex items-center gap-4">
                <select
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Languages</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>

                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Tiers</option>
                  <option value="foundation">Foundation</option>
                  <option value="higher">Higher</option>
                </select>

                <button
                  onClick={handleCreate}
                  className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Paper
                </button>
              </div>

              {/* Papers List */}
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader className="h-12 w-12 animate-spin text-green-600 mx-auto" />
                  <p className="text-gray-600 mt-4">Loading papers...</p>
                </div>
              ) : papers.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {papers.map((paper) => (
                    <div
                      key={paper.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{paper.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{paper.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="font-medium">{paper.language.toUpperCase()}</span>
                            <span>•</span>
                            <span className="capitalize">{paper.level}</span>
                            <span>•</span>
                            <span>{paper.identifier}</span>
                            <span>•</span>
                            <span>{paper.time_limit_minutes} min</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(paper)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(paper)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileJson className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>No papers found. Create your first listening paper!</p>
                </div>
              )}
            </div>
          )}

          {/* CREATE/EDIT VIEW */}
          {(viewMode === 'create' || viewMode === 'edit') && (
            <div>
              {/* Paper Metadata */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Paper Details</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleImport}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center text-sm border border-gray-300 transition-colors"
                      title="Paste JSON from Clipboard"
                    >
                      <Clipboard className="h-4 w-4 mr-2" />
                      Paste JSON
                    </button>
                    <button
                      onClick={handleExport}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center text-sm border border-gray-300 transition-colors"
                      title="Copy JSON to Clipboard"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy JSON
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language *
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tier *
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="foundation">Foundation (35 min)</option>
                      <option value="higher">Higher (45 min)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Identifier * (e.g., paper-1)
                    </label>
                    <input
                      type="text"
                      value={formData.identifier}
                      onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                      placeholder="paper-1"
                      disabled={viewMode === 'create'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.time_limit_minutes}
                      onChange={(e) => setFormData({ ...formData, time_limit_minutes: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      disabled
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="AQA GCSE Spanish Listening - Foundation Tier - Paper 1"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      rows={2}
                      placeholder="Optional description..."
                    />
                  </div>
                </div>
              </div>

              {/* Questions Section - Will continue in next edit */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Questions ({questions.length})</h3>
                  <div className="flex items-center gap-2">
                    {questions.length > 0 && (
                      <button
                        onClick={handleGenerateAllAudio}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center text-sm"
                      >
                        <Volume2 className="h-4 w-4 mr-2" />
                        Generate All Audio
                      </button>
                    )}
                    <button
                      onClick={handleAddQuestion}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Question
                    </button>
                  </div>
                </div>

                {questions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <p>No questions yet. Click "Add Question" to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {questions.map((question, index) => (
                      <div key={index} className="border-2 border-gray-200 rounded-lg p-6 bg-white">
                        {/* Question Header */}
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-bold text-gray-900">
                            Question {question.question_number}
                          </h4>
                          <button
                            onClick={() => removeQuestion(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Question Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Question Type *
                            </label>
                            <select
                              value={question.question_type}
                              onChange={(e) => updateQuestion(index, 'question_type', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                              {QUESTION_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Marks *
                            </label>
                            <input
                              type="number"
                              value={question.marks}
                              onChange={(e) => updateQuestion(index, 'marks', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              min="1"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Theme *
                            </label>
                            <select
                              value={question.theme}
                              onChange={(e) => updateQuestion(index, 'theme', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                              {THEMES.map(theme => (
                                <option key={theme} value={theme}>{theme}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Topic *
                            </label>
                            <select
                              value={question.topic}
                              onChange={(e) => updateQuestion(index, 'topic', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                              {TOPICS.map(topic => (
                                <option key={topic} value={topic}>{topic}</option>
                              ))}
                            </select>
                          </div>

                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Title *
                            </label>
                            <input
                              type="text"
                              value={question.title}
                              onChange={(e) => updateQuestion(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              placeholder="e.g., Listen to the conversation about hobbies"
                            />
                          </div>

                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Instructions *
                            </label>
                            <textarea
                              value={question.instructions}
                              onChange={(e) => updateQuestion(index, 'instructions', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                              rows={2}
                              placeholder="e.g., Listen to the audio and answer the questions below"
                            />
                          </div>
                        </div>

                        {/* Audio Section */}
                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                          <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Volume2 className="h-5 w-5 mr-2 text-blue-600" />
                            Audio Configuration
                          </h5>

                          {/* Audio Text */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Audio Text * (Text to be spoken)
                            </label>
                            <textarea
                              value={question.audio_text}
                              onChange={(e) => updateQuestion(index, 'audio_text', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                              rows={4}
                              placeholder="Enter the text that will be converted to speech..."
                            />
                          </div>

                          {/* TTS Settings */}
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Speaking Pace
                              </label>
                              <select
                                value={question.tts_config?.pace || 'normal'}
                                onChange={(e) => updateQuestion(index, 'tts_config', {
                                  ...question.tts_config,
                                  pace: e.target.value
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                              >
                                <option value="very_slow">Very Slow</option>
                                <option value="slow">Slow</option>
                                <option value="normal">Normal</option>
                                <option value="fast">Fast</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tone
                              </label>
                              <select
                                value={question.tts_config?.tone || 'neutral'}
                                onChange={(e) => updateQuestion(index, 'tts_config', {
                                  ...question.tts_config,
                                  tone: e.target.value
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                              >
                                <option value="neutral">Neutral</option>
                                <option value="cheerful">Cheerful</option>
                                <option value="serious">Serious</option>
                                <option value="friendly">Friendly</option>
                                <option value="formal">Formal</option>
                              </select>
                            </div>

                            <div className="flex items-end">
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={question.tts_config?.multiSpeaker || false}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    const currentConfig = question.tts_config || {};
                                    const newConfig = { ...currentConfig, multiSpeaker: isChecked };

                                    // Initialize default speakers if enabling and none exist
                                    if (isChecked && (!newConfig.speakers || newConfig.speakers.length === 0)) {
                                      newConfig.speakers = [
                                        { name: 'Speaker 1', voiceName: 'Puck' },
                                        { name: 'Speaker 2', voiceName: 'Aoede' }
                                      ];
                                    }

                                    updateQuestion(index, 'tts_config', newConfig);
                                  }}
                                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Multi-Speaker</span>
                              </label>
                            </div>
                          </div>

                          {/* Multi-Speaker Configuration */}
                          {question.tts_config?.multiSpeaker && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-center mb-2">
                                <h6 className="text-sm font-semibold text-gray-900">Speakers (Max 2)</h6>
                                <span className="text-xs text-gray-500">Match names to script usage!</span>
                              </div>

                              {(question.tts_config.speakers || []).map((speaker, sIdx) => (
                                <div key={sIdx} className="flex gap-2 mb-2">
                                  <input
                                    placeholder="Speaker Name (e.g. Carlos)"
                                    value={speaker.name}
                                    onChange={e => {
                                      const newSpeakers = [...(question.tts_config?.speakers || [])];
                                      newSpeakers[sIdx] = { ...newSpeakers[sIdx], name: e.target.value };
                                      updateQuestion(index, 'tts_config', { ...question.tts_config, speakers: newSpeakers });
                                    }}
                                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                  />
                                  <select
                                    value={speaker.voiceName}
                                    onChange={e => {
                                      const newSpeakers = [...(question.tts_config?.speakers || [])];
                                      newSpeakers[sIdx] = { ...newSpeakers[sIdx], voiceName: e.target.value };
                                      updateQuestion(index, 'tts_config', { ...question.tts_config, speakers: newSpeakers });
                                    }}
                                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                  >
                                    <option value="Puck">Puck (Male)</option>
                                    <option value="Charon">Charon (Male)</option>
                                    <option value="Aoede">Aoede (Female)</option>
                                    <option value="Kore">Kore (Female)</option>
                                    <option value="Fenrir">Fenrir (Male)</option>
                                    <option value="Leda">Leda (Female)</option>
                                  </select>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Generate Audio Button */}
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleGenerateAudio(index)}
                              disabled={audioGenerationStatus[index] === 'generating' || !question.audio_text}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {audioGenerationStatus[index] === 'generating' ? (
                                <>
                                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                                  Generating...
                                </>
                              ) : audioGenerationStatus[index] === 'generated' ? (
                                <>
                                  <Volume2 className="h-5 w-5 mr-2" />
                                  Regenerate Audio
                                </>
                              ) : (
                                <>
                                  <Volume2 className="h-5 w-5 mr-2" />
                                  Generate Audio
                                </>
                              )}
                            </button>

                            {/* Status Indicator */}
                            {audioGenerationStatus[index] === 'generated' && (
                              <span className="text-green-600 flex items-center text-sm font-medium">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Audio Generated
                              </span>
                            )}

                            {audioGenerationStatus[index] === 'error' && (
                              <span className="text-red-600 flex items-center text-sm font-medium">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                Generation Failed
                              </span>
                            )}
                          </div>

                          {/* Audio Preview */}
                          {audioUrls[index] && (
                            <div className="mt-4 bg-white rounded-lg p-4 border border-blue-200">
                              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Play className="h-4 w-4 mr-2 text-blue-600" />
                                Audio Preview:
                              </p>
                              <audio controls src={audioUrls[index]} className="w-full" />
                            </div>
                          )}
                        </div>

                        {/* Question Data (simplified for now) */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 font-mono text-xs"
                            rows={6}
                            placeholder='{"options": ["A", "B", "C"], "correctAnswer": "A"}'
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Enter question-specific data (options, correct answers, etc.) in JSON format
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setViewMode('list')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50"
                >
                  {isLoading && <Loader className="h-5 w-5 mr-2 animate-spin" />}
                  <Save className="h-5 w-5 mr-2" />
                  {viewMode === 'edit' ? 'Update Paper' : 'Create Paper'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

