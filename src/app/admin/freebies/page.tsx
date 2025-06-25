'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, supabaseBrowser } from '../../../components/auth/AuthProvider';
import FreebiesUploadForm from '../../../components/admin/FreebiesUploadForm';
import { 
  Plus, Upload, Download, Edit, Trash2, Search, Filter, 
  FileText, Globe, BookOpen, GraduationCap, Star, Eye,
  Calendar, Tag, Languages, Users, CheckCircle, X,
  AlertCircle, Save, MoreVertical
} from 'lucide-react';

interface FreebieResource {
  id: string;
  title: string;
  description: string;
  language: string;
  category: string;
  topic: string;
  year_groups: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  pages: number;
  featured: boolean;
  premium: boolean;
  download_count: number;
  file_url: string;
  file_name: string;
  file_size: number;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const LANGUAGES = ['Spanish', 'French', 'German', 'Italian', 'All Languages'];
const YEAR_GROUPS = ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13', 'KS3', 'KS4', 'KS5'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const CATEGORIES = [
  { id: 'themes', name: 'Themed Worksheets', icon: '🌍', description: 'Topic-based vocabulary and conversation practice' },
  { id: 'grammar', name: 'Grammar Essentials', icon: '📚', description: 'Structured grammar practice and reference sheets' },
  { id: 'exam-prep', name: 'Exam Preparation', icon: '🎓', description: 'GCSE and A-Level focused materials' },
  { id: 'vocabulary', name: 'Vocabulary Building', icon: '📝', description: 'Word lists and vocabulary exercises' },
  { id: 'culture', name: 'Culture & Traditions', icon: '🎭', description: 'Cultural insights and traditional practices' },
  { id: 'assessment', name: 'Assessment Tools', icon: '📊', description: 'Tests, quizzes, and evaluation materials' }
];

const TOPICS = {
  themes: ['Identity & Family', 'School Life', 'Free Time & Hobbies', 'Local Area & Town', 'House & Home', 'Food & Drink', 'Technology', 'Environment', 'Travel & Holidays'],
  grammar: ['Present Tense', 'Past Tense', 'Future Tense', 'Ser vs Estar', 'Adjectives', 'Numbers', 'Pronouns', 'Prepositions'],
  'exam-prep': ['Speaking Practice', 'Listening Exercises', 'Reading Comprehension', 'Writing Tasks', 'Photo Cards', 'Role Play'],
  vocabulary: ['Basic Vocabulary', 'Advanced Vocabulary', 'Thematic Lists', 'Cognates', 'False Friends'],
  culture: ['Festivals', 'Food Culture', 'History', 'Art & Literature', 'Music & Dance', 'Traditions'],
  assessment: ['Progress Tests', 'Unit Assessments', 'Mock Exams', 'Self-Assessment', 'Rubrics']
};

export default function FreebiesAdminPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<FreebieResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'title' | 'download_count'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock data for now - replace with actual database calls
  useEffect(() => {
    // In production, fetch from Supabase
    setResources([
      {
        id: '1',
        title: 'House and Home - Vocabulary Builder',
        description: 'Essential vocabulary for describing your house, rooms, and furniture.',
        language: 'Spanish',
        category: 'themes',
        topic: 'House & Home',
        year_groups: ['Year 7', 'Year 8', 'KS3'],
        level: 'Beginner',
        pages: 4,
        featured: true,
        premium: false,
        download_count: 234,
        file_url: '/freebies/downloads/house-home-spanish.pdf',
        file_name: 'house-home-spanish.pdf',
        file_size: 1024 * 1024 * 2.5, // 2.5MB
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        title: 'Ser vs Estar - Complete Guide',
        description: 'Master the difference between ser and estar with clear explanations.',
        language: 'Spanish',
        category: 'grammar',
        topic: 'Ser vs Estar',
        year_groups: ['Year 9', 'Year 10', 'Year 11'],
        level: 'Intermediate',
        pages: 8,
        featured: false,
        premium: true,
        download_count: 156,
        file_url: '/freebies/downloads/ser-estar-spanish.pdf',
        file_name: 'ser-estar-spanish.pdf',
        file_size: 1024 * 1024 * 4.2,
        created_at: '2024-01-10T14:20:00Z',
        updated_at: '2024-01-12T09:15:00Z'
      }
    ]);
    setLoading(false);
  }, []);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = !searchTerm || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLanguage = !selectedLanguage || resource.language === selectedLanguage;
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    const matchesLevel = !selectedLevel || resource.level === selectedLevel;

    return matchesSearch && matchesLanguage && matchesCategory && matchesLevel;
  }).sort((a, b) => {
    const order = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'created_at') {
      return order * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === 'title') {
      return order * a.title.localeCompare(b.title);
    } else if (sortBy === 'download_count') {
      return order * (a.download_count - b.download_count);
    }
    return 0;
  });

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-UK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleSaveResource = async (formData: any) => {
    // In production, this would:
    // 1. Upload the file to Supabase Storage
    // 2. Save the metadata to the database
    // 3. Update the local state
    console.log('Saving resource:', formData);
    
    // Mock implementation
    const newResource: FreebieResource = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      language: formData.language,
      category: formData.category,
      topic: formData.topic,
      year_groups: formData.yearGroups,
      level: formData.level,
      pages: formData.pages,
      featured: formData.featured,
      premium: formData.premium,
      download_count: 0,
      file_url: `/freebies/downloads/${formData.file?.name || 'new-resource.pdf'}`,
      file_name: formData.file?.name || 'new-resource.pdf',
      file_size: formData.file?.size || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setResources(prev => [newResource, ...prev]);
  };

  const stats = {
    total: resources.length,
    featured: resources.filter(r => r.featured).length,
    premium: resources.filter(r => r.premium).length,
    totalDownloads: resources.reduce((sum, r) => sum + r.download_count, 0)
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Freebies Management</h1>
          <p className="text-slate-600">Upload, organize, and manage your free language learning resources</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Resource
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Resources</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Featured</p>
              <p className="text-3xl font-bold text-slate-900">{stats.featured}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Premium Resources</p>
              <p className="text-3xl font-bold text-slate-900">{stats.premium}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Downloads</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalDownloads.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Download className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Languages</option>
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Levels</option>
            {LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as typeof sortBy);
              setSortOrder(order as typeof sortOrder);
            }}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="download_count-desc">Most Downloaded</option>
            <option value="download_count-asc">Least Downloaded</option>
          </select>
        </div>
      </div>

      {/* Resources Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Resource</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Language</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Category</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Level</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Downloads</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Created</th>
                <th className="text-right py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No resources found
                  </td>
                </tr>
              ) : (
                filteredResources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-indigo-600" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {resource.title}
                          </p>
                          <p className="text-sm text-slate-500 truncate">
                            {resource.pages} pages • {formatFileSize(resource.file_size)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {resource.language}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-900">
                        {CATEGORIES.find(c => c.id === resource.category)?.name}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        resource.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                        resource.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {resource.level}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {resource.featured && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                        {resource.premium && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            Premium
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-900">
                      {resource.download_count.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-500">
                      {formatDate(resource.created_at)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-slate-400 hover:text-slate-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-slate-400 hover:text-indigo-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-slate-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <FreebiesUploadForm
          onClose={() => setShowUploadModal(false)}
          onSave={handleSaveResource}
        />
      )}
    </div>
  );
} 