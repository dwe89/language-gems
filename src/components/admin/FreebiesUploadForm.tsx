import React, { useState, useRef } from 'react';
import { 
  Upload, X, FileText, Save, AlertCircle, CheckCircle,
  Globe, BookOpen, GraduationCap, Tag, Languages, Users
} from 'lucide-react';

interface FreebiesUploadFormProps {
  onClose: () => void;
  onSave: (formData: FreebieFormData) => Promise<void>;
}

interface FreebieFormData {
  title: string;
  description: string;
  language: string;
  category: string;
  topic: string;
  yearGroups: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  pages: number;
  featured: boolean;
  premium: boolean;
  file: File | null;
  keywords: string[];
}

const LANGUAGES = ['Spanish', 'French', 'German', 'Italian', 'All Languages'];
const YEAR_GROUPS = ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13', 'KS3', 'KS4', 'KS5'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const CATEGORIES = [
  { id: 'themes', name: 'Themed Worksheets', description: 'Topic-based vocabulary and conversation practice' },
  { id: 'grammar', name: 'Grammar Essentials', description: 'Structured grammar practice and reference sheets' },
  { id: 'exam-prep', name: 'Exam Preparation', description: 'GCSE and A-Level focused materials' },
  { id: 'vocabulary', name: 'Vocabulary Building', description: 'Word lists and vocabulary exercises' },
  { id: 'culture', name: 'Culture & Traditions', description: 'Cultural insights and traditional practices' },
  { id: 'assessment', name: 'Assessment Tools', description: 'Tests, quizzes, and evaluation materials' }
];

const TOPICS = {
  themes: ['Identity & Family', 'School Life', 'Free Time & Hobbies', 'Local Area & Town', 'House & Home', 'Food & Drink', 'Technology', 'Environment', 'Travel & Holidays'],
  grammar: ['Present Tense', 'Past Tense', 'Future Tense', 'Ser vs Estar', 'Adjectives', 'Numbers', 'Pronouns', 'Prepositions'],
  'exam-prep': ['Speaking Practice', 'Listening Exercises', 'Reading Comprehension', 'Writing Tasks', 'Photo Cards', 'Role Play'],
  vocabulary: ['Basic Vocabulary', 'Advanced Vocabulary', 'Thematic Lists', 'Cognates', 'False Friends'],
  culture: ['Festivals', 'Food Culture', 'History', 'Art & Literature', 'Music & Dance', 'Traditions'],
  assessment: ['Progress Tests', 'Unit Assessments', 'Mock Exams', 'Self-Assessment', 'Rubrics']
};

export default function FreebiesUploadForm({ onClose, onSave }: FreebiesUploadFormProps) {
  const [formData, setFormData] = useState<FreebieFormData>({
    title: '',
    description: '',
    language: '',
    category: '',
    topic: '',
    yearGroups: [],
    level: 'Beginner',
    pages: 1,
    featured: false,
    premium: false,
    file: null,
    keywords: []
  });

  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newKeyword, setNewKeyword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrors({ file: 'Only PDF files are allowed' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setErrors({ file: 'File size must be less than 10MB' });
      return;
    }

    setFormData(prev => ({ ...prev, file }));
    setErrors(prev => ({ ...prev, file: '' }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleYearGroupToggle = (yearGroup: string) => {
    setFormData(prev => ({
      ...prev,
      yearGroups: prev.yearGroups.includes(yearGroup)
        ? prev.yearGroups.filter(yg => yg !== yearGroup)
        : [...prev.yearGroups, yearGroup]
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.language) newErrors.language = 'Language is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.topic) newErrors.topic = 'Topic is required';
    if (formData.yearGroups.length === 0) newErrors.yearGroups = 'At least one year group is required';
    if (!formData.file) newErrors.file = 'PDF file is required';
    if (formData.pages < 1) newErrors.pages = 'Pages must be at least 1';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setUploading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error uploading freebie:', error);
      setErrors({ submit: 'Failed to upload resource. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const availableTopics = formData.category ? TOPICS[formData.category as keyof typeof TOPICS] || [] : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Add New Freebies Resource</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                PDF File *
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive ? 'border-indigo-400 bg-indigo-50' : 
                  formData.file ? 'border-green-400 bg-green-50' : 
                  'border-slate-300 hover:border-slate-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
                
                {formData.file ? (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-slate-800">{formData.file.name}</p>
                      <p className="text-sm text-slate-500">
                        {(formData.file.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 mb-2">
                      Drag and drop your PDF file here, or{' '}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-sm text-slate-500">PDF files up to 10MB</p>
                  </div>
                )}
              </div>
              {errors.file && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.file}
                </p>
              )}
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., House and Home - Vocabulary Builder"
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pages *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.pages}
                  onChange={(e) => setFormData(prev => ({ ...prev, pages: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.pages && (
                  <p className="text-red-600 text-sm mt-1">{errors.pages}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Brief description of the resource and what students will learn..."
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Categorization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Language *
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Language</option>
                  {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                {errors.language && (
                  <p className="text-red-600 text-sm mt-1">{errors.language}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, category: e.target.value, topic: '' }));
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Topic *
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={!formData.category}
                >
                  <option value="">Select Topic</option>
                  {availableTopics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
                {errors.topic && (
                  <p className="text-red-600 text-sm mt-1">{errors.topic}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Level *
              </label>
              <div className="flex space-x-4">
                {LEVELS.map(level => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="level"
                      value={level}
                      checked={formData.level === level}
                      onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as typeof formData.level }))}
                      className="mr-2 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Year Groups */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Year Groups * <span className="text-sm text-slate-500">(Select all applicable)</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {YEAR_GROUPS.map(yearGroup => (
                  <label key={yearGroup} className="flex items-center p-2 border rounded-lg hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={formData.yearGroups.includes(yearGroup)}
                      onChange={() => handleYearGroupToggle(yearGroup)}
                      className="mr-2 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700">{yearGroup}</span>
                  </label>
                ))}
              </div>
              {errors.yearGroups && (
                <p className="text-red-600 text-sm mt-1">{errors.yearGroups}</p>
              )}
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Keywords <span className="text-sm text-slate-500">(Optional - helps with search)</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.keywords.map(keyword => (
                  <span key={keyword} className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-1 text-indigo-600 hover:text-indigo-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add keyword..."
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-4 py-2 bg-slate-100 border border-l-0 border-slate-300 rounded-r-lg hover:bg-slate-200"
                >
                  <Tag className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Status Options */}
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">Featured Resource</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.premium}
                  onChange={(e) => setFormData(prev => ({ ...prev, premium: e.target.checked }))}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">Premium (Sign-in required)</span>
              </label>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-red-600">{errors.submit}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Resource
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 