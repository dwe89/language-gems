'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Loader2,
  Download,
  Eye,
  Sparkles,
  BookOpen,
  PenSquare,
  Puzzle,
  RotateCcw,
  Search,
  ArrowLeft,
  Zap,
  Target,
  Brain,
  ArrowRight
} from 'lucide-react';
// Worksheet template definitions
interface WorksheetTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'core' | 'reading' | 'puzzles' | 'advanced';
  subjects: string[];
  defaultQuestionTypes: string[];
  color: string;
}

const WORKSHEET_TEMPLATES: WorksheetTemplate[] = [
  // Core Skills (Bread & Butter)
  {
    id: 'vocabulary_builder',
    title: 'Vocabulary Builder',
    description: 'Mixed activities from a topic: matching, articles, translations',
    icon: Brain,
    category: 'core',
    subjects: ['spanish', 'french', 'german'],
    defaultQuestionTypes: ['matching', 'fill_in_blank', 'translation'],
    color: 'bg-blue-500'
  },
  {
    id: 'verb_conjugation',
    title: 'Verb Conjugation Drill',
    description: 'Practice sentences with blanks for verb forms',
    icon: RotateCcw,
    category: 'core',
    subjects: ['spanish', 'french', 'german'],
    defaultQuestionTypes: ['fill_in_blank'],
    color: 'bg-green-500'
  },
  {
    id: 'sentence_builder',
    title: 'Sentence Builder',
    description: 'Jumbled sentences for students to unscramble',
    icon: PenSquare,
    category: 'core',
    subjects: ['spanish', 'french', 'german'],
    defaultQuestionTypes: ['ordering'],
    color: 'bg-purple-500'
  },

  // Reading & Comprehension
  {
    id: 'reading_comprehension',
    title: 'Reading Comprehension',
    description: 'Short text with comprehension questions',
    icon: BookOpen,
    category: 'reading',
    subjects: ['spanish', 'french', 'german'],
    defaultQuestionTypes: ['multiple_choice', 'short_answer', 'true_false'],
    color: 'bg-indigo-500'
  },
  {
    id: 'guided_reading',
    title: 'Guided Reading (Gap-Fill)',
    description: 'Text with key words removed for fill-in-the-blank',
    icon: Target,
    category: 'reading',
    subjects: ['spanish', 'french', 'german'],
    defaultQuestionTypes: ['fill_in_blank'],
    color: 'bg-cyan-500'
  },

  // Puzzles & Starters
  {
    id: 'word_search',
    title: 'Word Search',
    description: 'Generate a word search puzzle from vocabulary',
    icon: Search,
    category: 'puzzles',
    subjects: ['spanish', 'french', 'german'],
    defaultQuestionTypes: ['word_search'],
    color: 'bg-yellow-500'
  },
  {
    id: 'crossword',
    title: 'Crossword',
    description: 'Create a crossword with clues from vocabulary',
    icon: Puzzle,
    category: 'puzzles',
    subjects: ['spanish', 'french', 'german'],
    defaultQuestionTypes: ['crossword'],
    color: 'bg-orange-500'
  },

  // Advanced
  {
    id: 'revision_sheet',
    title: 'All-in-One Revision Sheet',
    description: 'Multi-section worksheet: vocab, grammar, and translation',
    icon: Zap,
    category: 'advanced',
    subjects: ['spanish', 'french', 'german'],
    defaultQuestionTypes: ['matching', 'fill_in_blank', 'translation'],
    color: 'bg-red-500'
  }
];

interface WorksheetFormData {
  template: string;
  subject: string;
  targetLanguage?: string;
  topic: string;
  difficulty: string;
  gradeLevel: number;
  targetQuestionCount: number;
  questionTypes: string[];
  customPrompt: string;
  customVocabulary?: string;
  curriculumLevel?: string;
  examBoard?: string;
  advancedOptions?: any;
}

interface GeneratedWorksheet {
  id: string;
  title: string;
  subject: string;
  sections: any[];
  markdown: string;
  rawContent?: any; // For reading comprehension and other special formats
}

// Template Card Component
const TemplateCard = ({
  template,
  onClick
}: {
  template: WorksheetTemplate;
  onClick: () => void;
}) => {
  const IconComponent = template.icon;

  return (
    <div
      className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="p-8">
        <div className="flex flex-col h-full">
          {/* Icon */}
          <div className={`inline-flex p-4 rounded-2xl ${template.color} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 mb-6 self-start`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>

          {/* Content */}
          <h3 className="font-bold text-slate-900 text-xl leading-tight mb-3 group-hover:text-indigo-600 transition-all duration-300">
            {template.title}
          </h3>
          <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
            {template.description}
          </p>

          {/* Subjects */}
          <div className="flex flex-wrap gap-1 mb-6">
            {template.subjects.map(subject => (
              <span
                key={subject}
                className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full capitalize font-medium"
              >
                {subject}
              </span>
            ))}
          </div>

          {/* Action area */}
          <div className="flex items-center justify-end pt-4 border-t border-slate-100 group-hover:border-indigo-100 transition-colors duration-300">
            <div className={`p-2 rounded-xl ${template.color} group-hover:scale-110 transition-all duration-300`}>
              <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for template-specific placeholders
const getTopicPlaceholder = (templateId?: string) => {
  switch (templateId) {
    case 'vocabulary_builder':
      return 'e.g., Family members, Food and drink, School subjects';
    case 'verb_conjugation':
      return 'e.g., Present tense -er verbs, Past tense irregular verbs';
    case 'sentence_builder':
      return 'e.g., Describing people, Talking about hobbies';
    case 'reading_comprehension':
      return 'e.g., A day at school, Weekend activities';
    case 'guided_reading':
      return 'e.g., My family, Shopping at the market';
    case 'word_search':
    case 'crossword':
      return 'e.g., Animals, Colors, Numbers 1-20';
    case 'revision_sheet':
      return 'e.g., Unit 3: My town, Chapter 2: Daily routine';
    default:
      return 'e.g., Present tense verbs';
  }
};

export default function WorksheetBuilder() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState<WorksheetFormData>({
    template: '',
    subject: 'spanish',
    targetLanguage: 'spanish',
    topic: '',
    difficulty: 'medium',
    gradeLevel: 7,
    targetQuestionCount: 10,
    questionTypes: ['multiple_choice'],
    customPrompt: '',
    curriculumLevel: 'KS3',
    examBoard: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState<GeneratedWorksheet | null>(null);
  const [error, setError] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState({ status: '', progress: 0, message: '' });
  const [worksheetId, setWorksheetId] = useState<string | null>(null);

  const selectedTemplateData = selectedTemplate ? WORKSHEET_TEMPLATES.find(t => t.id === selectedTemplate) : null;

  // Sync formData when template is selected
  useEffect(() => {
    if (selectedTemplate && selectedTemplateData) {
      console.log('📋 Template selected, updating formData:', selectedTemplate);
      setFormData(prev => ({
        ...prev,
        template: selectedTemplate,
        questionTypes: selectedTemplateData.defaultQuestionTypes
      }));
    }
  }, [selectedTemplate, selectedTemplateData]);

  const allSubjects = [
    { id: 'spanish', name: 'Spanish' },
    { id: 'french', name: 'French' },
    { id: 'german', name: 'German' }
  ];

  // Filter subjects based on selected template
  const availableSubjects = selectedTemplateData
    ? allSubjects.filter(subject => selectedTemplateData.subjects.includes(subject.id))
    : allSubjects;

  const questionTypes = [
    { id: 'multiple_choice', name: 'Multiple Choice' },
    { id: 'fill_in_blank', name: 'Fill in the Blank' },
    { id: 'short_answer', name: 'Short Answer' },
    { id: 'matching', name: 'Matching' },
    { id: 'translation', name: 'Translation' },
    { id: 'true_false', name: 'True/False' }
  ];

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionTypeChange = (typeId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      questionTypes: checked
        ? [...prev.questionTypes, typeId]
        : prev.questionTypes.filter(t => t !== typeId)
    }));
  };

  // Reset form to clean state
  const resetForm = () => {
    console.log('🔄 Resetting form to clean state');
    setFormData({
      template: selectedTemplate || '',
      subject: 'spanish',
      targetLanguage: 'spanish', 
      topic: '',
      difficulty: 'medium',
      gradeLevel: 7,
      targetQuestionCount: 10,
      questionTypes: selectedTemplateData?.defaultQuestionTypes || ['multiple_choice'],
      customPrompt: ''
    });
    setError('');
    setIsGenerating(false);
    setGeneratedWorksheet(null);
    setJobId(null);
    setProgress({ status: '', progress: 0, message: '' });
    setWorksheetId(null);
  };

  const pollProgress = async (jobId: string) => {
    try {
      const response = await fetch(`/api/worksheets/progress/${jobId}`);
      const data = await response.json();

      console.log('📊 Poll response:', data);

      setProgress({
        status: data.status,
        progress: data.progress,
        message: data.message
      });

      // Handle the case where job completed but wasn't found in memory
      if (data.assumedComplete && data.status === 'completed') {
        console.log('🎯 Job assumed complete, setting success state');
        setProgress({
          status: 'completed',
          progress: 100,
          message: 'Worksheet generated successfully! Please check your worksheets or refresh the page.'
        });
        setIsGenerating(false);
        return true;
      }

      if (data.status === 'completed' && data.result) {
        setGeneratedWorksheet(data.result.worksheet);
        if (data.result.worksheetId) {
          setWorksheetId(data.result.worksheetId);
        }
        setIsGenerating(false);
        return true;
      } else if (data.status === 'failed') {
        setError(data.error || 'Worksheet generation failed');
        setIsGenerating(false);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error polling progress:', error);
      // If polling fails consistently, assume the job might have completed
      return false;
    }
  };

  const handlePreview = () => {
    if (worksheetId) {
      window.open(`/worksheets/${worksheetId}`, '_blank');
    } else {
      setError('No worksheet available to preview');
    }
  };

  const handleDownloadPDF = async () => {
    if (!generatedWorksheet) {
      setError('No worksheet available to download');
      return;
    }

    try {
      // Generate HTML if not available
      const response = await fetch('/api/worksheets/generate-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worksheet: generatedWorksheet })
      });

      if (!response.ok) {
        throw new Error('Failed to generate HTML');
      }

      const result = await response.json();

      // Generate PDF
      const pdfResponse = await fetch('/api/worksheets/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: result.html,
          filename: `${generatedWorksheet.title.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}`
        })
      });

      if (!pdfResponse.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Download the PDF
      const blob = await pdfResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedWorksheet.title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Track download if we have a worksheet ID
      if (worksheetId) {
        await fetch('/api/worksheets/track-download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            worksheetId: worksheetId,
            fileName: a.download
          })
        });
      }

    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download PDF');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');
    setGeneratedWorksheet(null);
    setJobId(null);

    try {
      console.log('🚀 Starting worksheet generation with data:', formData);
      
      // Client-side validation before sending to API
      if (!formData.template) {
        throw new Error('Please select a template before generating');
      }
      if (!formData.subject) {
        throw new Error('Please select a subject before generating');
      }
      if (formData.questionTypes.length === 0) {
        throw new Error('Please select at least one question type');
      }
      
      const response = await fetch('/api/worksheets/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('📡 API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        console.error('📝 Error details:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          formDataSent: formData
        });
        
        // Provide specific error messages for common issues
        if (response.status === 400) {
          if (errorData.error?.includes('Subject is required')) {
            throw new Error('Subject validation failed. Please try resetting the form and selecting a template again.');
          } else if (errorData.error?.includes('Unsupported subject')) {
            throw new Error(`The subject "${formData.subject}" is not supported. Please select a different subject.`);
          }
        }
        
        throw new Error(errorData.error || 'Failed to generate worksheet');
      }

      const result = await response.json();
      console.log('✅ API Success:', result);
      setJobId(result.jobId);

      // Start polling for progress
      let pollAttempts = 0;
      const maxPollAttempts = 150; // 5 minutes at 2-second intervals
      
      const pollInterval = setInterval(async () => {
        pollAttempts++;
        const completed = await pollProgress(result.jobId);
        if (completed) {
          clearInterval(pollInterval);
        } else if (pollAttempts >= maxPollAttempts) {
          // Polling timeout - likely the job completed but we lost track
          clearInterval(pollInterval);
          if (isGenerating) {
            console.log('🕐 Polling timeout reached, checking if worksheet was actually generated');
            setProgress({
              status: 'completed',
              progress: 100,
              message: 'Generation may have completed successfully. Please refresh the page to see your worksheet.'
            });
            setIsGenerating(false);
          }
        }
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate worksheet');
      setIsGenerating(false);
    }
  };

  // Template Selection View
  if (!selectedTemplate) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              <Sparkles className="inline-block w-10 h-10 mr-3 text-yellow-500" />
              AI Worksheet Studio
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choose a resource to create for your classroom. Each template is optimized for specific teaching needs.
            </p>
          </div>

          {/* Template Categories */}
          <div className="space-y-12">
            {/* Core Skills */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
                <Target className="w-6 h-6 mr-2 text-indigo-600" />
                Core Skills
                <span className="ml-3 text-sm font-normal text-slate-500">Essential worksheets for daily teaching</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {WORKSHEET_TEMPLATES.filter(t => t.category === 'core').map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setFormData(prev => ({
                        ...prev,
                        template: template.id,
                        questionTypes: template.defaultQuestionTypes
                      }));
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Reading & Comprehension */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-indigo-600" />
                Reading & Comprehension
                <span className="ml-3 text-sm font-normal text-slate-500">Text-based activities and comprehension</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {WORKSHEET_TEMPLATES.filter(t => t.category === 'reading').map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setFormData(prev => ({
                        ...prev,
                        template: template.id,
                        questionTypes: template.defaultQuestionTypes
                      }));
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Puzzles & Starters */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
                <Puzzle className="w-6 h-6 mr-2 text-indigo-600" />
                Puzzles & Starters
                <span className="ml-3 text-sm font-normal text-slate-500">Engaging activities and brain teasers</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {WORKSHEET_TEMPLATES.filter(t => t.category === 'puzzles').map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onClick={() => {
                      if (template.id === 'crossword') {
                        router.push('/tools/crossword');
                        return;
                      }
                      if (template.id === 'word_search') {
                        router.push('/tools/wordsearch');
                        return;
                      }
                      setSelectedTemplate(template.id);
                      setFormData(prev => ({
                        ...prev,
                        template: template.id,
                        questionTypes: template.defaultQuestionTypes
                      }));
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Advanced */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-indigo-600" />
                Power Tools
                <span className="ml-3 text-sm font-normal text-slate-500">Comprehensive multi-section worksheets</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {WORKSHEET_TEMPLATES.filter(t => t.category === 'advanced').map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setFormData(prev => ({
                        ...prev,
                        template: template.id,
                        questionTypes: template.defaultQuestionTypes
                      }));
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generator View (when template is selected)
  const isLanguageSubject = ['spanish', 'french', 'german'].includes(formData.subject);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => setSelectedTemplate(null)}
            className="group mr-4 p-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              {selectedTemplateData && <selectedTemplateData.icon className="w-8 h-8 mr-3 text-slate-700" />}
              {selectedTemplateData?.title}
            </h1>
            <p className="text-slate-600 mt-1">{selectedTemplateData?.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-4 bg-indigo-500 rounded-2xl shadow-lg mr-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Worksheet Configuration</h2>
                  <p className="text-slate-600">Configure your worksheet settings and content requirements</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => handleFormChange('subject', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      {availableSubjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Curriculum Level for Language Subjects */}
                  {isLanguageSubject && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Curriculum Level</label>
                      <select
                        value={formData.curriculumLevel || 'KS3'}
                        onChange={(e) => handleFormChange('curriculumLevel', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="KS3">KS3 (Years 7-9)</option>
                        <option value="KS4">GCSE (Years 10-11)</option>
                      </select>
                    </div>
                  )}

                  {/* Exam Board Selection for GCSE */}
                  {isLanguageSubject && formData.curriculumLevel === 'KS4' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Exam Board</label>
                      <select
                        value={formData.examBoard || ''}
                        onChange={(e) => handleFormChange('examBoard', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        required={formData.curriculumLevel === 'KS4'}
                      >
                        <option value="">Select Exam Board</option>
                        <option value="AQA">AQA</option>
                        <option value="Edexcel">Edexcel</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Topic</label>
                    <input
                      type="text"
                      value={formData.topic}
                      onChange={(e) => handleFormChange('topic', e.target.value)}
                      placeholder={getTopicPlaceholder(selectedTemplateData?.id)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Difficulty</label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => handleFormChange('difficulty', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Grade Level</label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={formData.gradeLevel}
                        onChange={(e) => handleFormChange('gradeLevel', parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Number of Questions</label>
                    <input
                      type="number"
                      min="5"
                      max="25"
                      value={formData.targetQuestionCount}
                      onChange={(e) => handleFormChange('targetQuestionCount', parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Show question types only for advanced templates */}
                  {selectedTemplateData?.category === 'advanced' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-3">Question Types</label>
                      <div className="grid grid-cols-2 gap-3">
                        {questionTypes.map(type => (
                          <label key={type.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.questionTypes.includes(type.id)}
                              onChange={(e) => handleQuestionTypeChange(type.id, e.target.checked)}
                              className="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 focus:ring-2"
                            />
                            <span className="text-sm text-slate-700 font-medium">{type.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Additional Instructions (Optional)</label>
                    <textarea
                      value={formData.customPrompt}
                      onChange={(e) => handleFormChange('customPrompt', e.target.value)}
                      placeholder="Any specific requirements or focus areas..."
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>
                </div>

                {/* Custom Vocabulary for Language Subjects */}
                {isLanguageSubject && (
                  <div className="border-t border-slate-200 pt-6">
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Custom Vocabulary (Optional)</label>
                    <textarea
                      value={formData.customVocabulary || ''}
                      onChange={(e) => handleFormChange('customVocabulary', e.target.value)}
                      placeholder="Enter specific words to include, separated by commas (e.g., casa, familia, amigo)"
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Leave blank to use general vocabulary for the selected topic
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isGenerating || formData.questionTypes.length === 0}
                    className="w-full group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="relative flex items-center justify-center">
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          Generating Worksheet...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-3" />
                          Generate Worksheet
                        </>
                      )}
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full px-4 py-2 border border-slate-300 text-slate-600 hover:text-slate-700 hover:border-slate-400 rounded-lg transition-colors duration-200 text-sm"
                  >
                    <RotateCcw className="w-4 h-4 mr-2 inline" />
                    Reset Form
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview/Results Section */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-4 bg-emerald-500 rounded-2xl shadow-lg mr-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Worksheet Preview</h2>
                  <p className="text-slate-600">Your generated worksheet will appear here</p>
                </div>
              </div>

              <div className="min-h-[400px] flex items-center justify-center">
                {isGenerating && (
                  <div className="text-center py-8">
                    <div className="relative mb-6">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{progress.message || 'Starting generation...'}</p>
                    <div className="w-full bg-slate-200 rounded-full h-2 max-w-xs mx-auto">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{progress.progress}% complete</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md">
                    <p className="text-red-800 text-sm font-medium">{error}</p>
                  </div>
                )}

                {generatedWorksheet && (
                  <div className="space-y-6 w-full">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                      <h3 className="font-bold text-emerald-800 mb-2 text-lg">{generatedWorksheet.title}</h3>
                      <p className="text-emerald-700 text-sm">
                        Worksheet generated successfully! {(() => {
                          // Handle different worksheet types
                          if (selectedTemplate === 'reading_comprehension' && generatedWorksheet.rawContent) {
                            const rawContent = generatedWorksheet.rawContent as any;
                            const activities = [];
                            if (rawContent.true_false_questions) activities.push('True/False');
                            if (rawContent.multiple_choice_questions) activities.push('Multiple Choice');
                            if (rawContent.word_hunt_words) activities.push('Word Hunt');
                            if (rawContent.vocabulary_writing) activities.push('Vocabulary');
                            if (rawContent.unscramble_sentences) activities.push('Sentence Unscramble');
                            if (rawContent.translation_sentences) activities.push('Translation');
                            return `${activities.length} activities created: ${activities.join(', ')}`;
                          } else {
                            const sectionCount = generatedWorksheet.sections?.length || 0;
                            return `${sectionCount} section${sectionCount !== 1 ? 's' : ''} created`;
                          }
                        })()}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handlePreview}
                        disabled={!worksheetId}
                        className="flex-1 group px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Eye className="w-4 h-4 mr-2 inline" />
                        Preview
                      </button>
                      <button
                        onClick={handleDownloadPDF}
                        disabled={!generatedWorksheet}
                        className="flex-1 group px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="w-4 h-4 mr-2 inline" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                )}

                {!isGenerating && !generatedWorksheet && !error && (
                  <div className="text-center py-12 text-slate-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Configure your worksheet settings and click "Generate Worksheet" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
