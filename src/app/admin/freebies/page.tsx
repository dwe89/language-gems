'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, supabaseBrowser } from '../../../components/auth/AuthProvider';
import FreebiesUploadForm from '../../../components/admin/FreebiesUploadForm';
import { 
  Plus, Upload, Download, Edit, Trash2, Search, Filter, 
  FileText, Globe, BookOpen, GraduationCap, Star, Eye,
  Calendar, Tag, Languages, Users, CheckCircle, X,
  AlertCircle, Save, MoreVertical, ExternalLink
} from 'lucide-react';

interface FreebieResource {
  id: string;
  title: string;
  description: string;
  language: string;
  keyStage: string;
  topic: string;
  type: 'worksheet' | 'audio' | 'video' | 'interactive' | 'assessment';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  pages?: number;
  duration?: string;
  featured: boolean;
  premium: boolean;
  skills: string[];
  file_url: string;
  preview_url?: string;
  file_name: string;
  file_size: number;
  created_at: string;
  updated_at: string;
}

const LANGUAGES = ['spanish', 'french', 'german', 'italian'];
const KEY_STAGES = ['ks3', 'ks4', 'ks5'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const RESOURCE_TYPES = ['worksheet', 'audio', 'video', 'interactive', 'assessment'];

// Topic configurations by key stage (matching our dynamic page structure)
const TOPICS_BY_KEY_STAGE: Record<string, Record<string, string>> = {
  ks3: {
    identity: 'Identity & Family',
    school: 'School Life',
    'free-time': 'Free Time & Hobbies',
    'local-area': 'Local Area',
    'house-home': 'House & Home',
    'food-drink': 'Food & Drink'
  },
  ks4: {
    technology: 'Technology & Social Media',
    environment: 'Environment & Global Issues',
    'travel-tourism': 'Travel & Tourism',
    'work-career': 'Work & Career',
    culture: 'Culture & Festivals'
  },
  ks5: {
    literature: 'Literature & Arts',
    'politics-society': 'Politics & Society',
    'business-economics': 'Business & Economics',
    'science-technology': 'Science & Technology'
  }
};

const COMMON_SKILLS = [
  'Vocabulary', 'Grammar', 'Reading', 'Writing', 'Speaking', 'Listening', 
  'Pronunciation', 'Cultural Knowledge', 'Assessment', 'Comprehension'
];

export default function FreebiesAdminPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<FreebieResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedKeyStage, setSelectedKeyStage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'title'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock data for demonstration - in production, fetch from Supabase
  useEffect(() => {
    const mockResources: FreebieResource[] = [
      {
        id: '1',
        title: 'Identity & Family Vocabulary Builder',
        description: 'Essential vocabulary for describing yourself, family members, and relationships.',
        language: 'spanish',
        keyStage: 'ks3',
        topic: 'identity',
        type: 'worksheet',
        level: 'Beginner',
        pages: 4,
        featured: true,
        premium: false,
        skills: ['Vocabulary', 'Reading', 'Writing'],
        file_url: '/freebies/downloads/identity-vocabulary-spanish.pdf',
        preview_url: '/freebies/preview/identity-vocabulary-spanish',
        file_name: 'identity-vocabulary-spanish.pdf',
        file_size: 1024 * 1024 * 2.5, // 2.5MB
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        title: 'School Life Grammar Practice',
        description: 'Grammar structures and patterns for school-related topics with clear explanations.',
        language: 'spanish',
        keyStage: 'ks3',
        topic: 'school',
        type: 'worksheet',
        level: 'Intermediate',
        pages: 6,
        featured: false,
        premium: false,
        skills: ['Grammar', 'Writing', 'Speaking'],
        file_url: '/freebies/downloads/school-grammar-spanish.pdf',
        file_name: 'school-grammar-spanish.pdf',
        file_size: 1024 * 1024 * 3.2,
        created_at: '2024-01-10T14:20:00Z',
        updated_at: '2024-01-12T09:15:00Z'
      },
      {
        id: '3',
        title: 'Technology Listening Practice',
        description: 'Audio exercises with native speakers discussing technology topics.',
        language: 'spanish',
        keyStage: 'ks4',
        topic: 'technology',
        type: 'audio',
        level: 'Advanced',
        duration: '15 mins',
        featured: true,
        premium: false,
        skills: ['Listening', 'Comprehension'],
        file_url: '/freebies/downloads/technology-listening-spanish.zip',
        file_name: 'technology-listening-spanish.zip',
        file_size: 1024 * 1024 * 12.5,
        created_at: '2024-01-08T16:45:00Z',
        updated_at: '2024-01-08T16:45:00Z'
      }
    ];
    
    setResources(mockResources);
    setLoading(false);
  }, []);

  const getAvailableTopics = () => {
    if (!selectedKeyStage) return {};
    return TOPICS_BY_KEY_STAGE[selectedKeyStage] || {};
  };

      const filteredResources = resources.filter(resource => {
    const matchesSearch = !searchTerm || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLanguage = !selectedLanguage || resource.language === selectedLanguage;
    const matchesKeyStage = !selectedKeyStage || resource.keyStage === selectedKeyStage;
    const matchesTopic = !selectedTopic || resource.topic === selectedTopic;
    const matchesType = !selectedType || resource.type === selectedType;
    const matchesLevel = !selectedLevel || resource.level === selectedLevel;

    return matchesSearch && matchesLanguage && matchesKeyStage && matchesTopic && matchesType && matchesLevel;
  }).sort((a, b) => {
    const order = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'created_at') {
      return order * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === 'title') {
      return order * a.title.localeCompare(b.title);
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
    console.log('Saving resource:', formData);
    
    const newResource: FreebieResource = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      language: formData.language,
      keyStage: formData.keyStage,
      topic: formData.topic,
      type: formData.type,
      level: formData.level,
      pages: formData.pages,
      duration: formData.duration,
      featured: formData.featured,
      premium: formData.premium,
      skills: formData.skills || [],
      file_url: `/freebies/downloads/${formData.file?.name || 'new-resource.pdf'}`,
      preview_url: formData.previewUrl,
      file_name: formData.file?.name || 'new-resource.pdf',
      file_size: formData.file?.size || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setResources(prev => [newResource, ...prev]);
    setShowUploadModal(false);
  };

  const generateTopicPageUrl = (resource: FreebieResource) => {
    return `/freebies/${resource.language}/${resource.keyStage}/${resource.topic}`;
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
          <p className="text-sm text-slate-500 mt-1">
            Resources are organized by language → key stage → topic structure
          </p>
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

      {/* Topic Structure Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Resource Organization</h3>
        <p className="text-blue-700 mb-4">
          Resources are automatically organized into topic pages based on the structure below:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {Object.entries(TOPICS_BY_KEY_STAGE).map(([keyStage, topics]) => (
            <div key={keyStage} className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">{keyStage.toUpperCase()}</h4>
              <ul className="space-y-1">
                {Object.entries(topics).map(([slug, name]) => (
                  <li key={slug} className="text-blue-700">
                    <code className="text-xs bg-blue-100 px-1 rounded">{slug}</code> → {name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
              <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
            ))}
          </select>

          <select
            value={selectedKeyStage}
            onChange={(e) => {
              setSelectedKeyStage(e.target.value);
              setSelectedTopic(''); // Reset topic when key stage changes
            }}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Key Stages</option>
            {KEY_STAGES.map(ks => (
              <option key={ks} value={ks}>{ks.toUpperCase()}</option>
            ))}
          </select>

          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={!selectedKeyStage}
          >
            <option value="">All Topics</option>
            {Object.entries(getAvailableTopics()).map(([slug, name]) => (
              <option key={slug} value={slug}>{name}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Types</option>
            {RESOURCE_TYPES.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
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
                <th className="text-left py-3 px-4 font-medium text-slate-700">Location</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Level</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Downloads</th>
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
                    No resources found matching your filters
                  </td>
                </tr>
              ) : (
                filteredResources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div>
                        <h3 className="font-medium text-slate-900">{resource.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{resource.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {resource.skills.map((skill) => (
                            <span key={skill} className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block bg-slate-100 text-slate-700 text-sm px-2 py-1 rounded">
                        {resource.language.charAt(0).toUpperCase() + resource.language.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div>{resource.keyStage.toUpperCase()}</div>
                        <div className="text-slate-500">
                          {TOPICS_BY_KEY_STAGE[resource.keyStage]?.[resource.topic] || resource.topic}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded">
                        {resource.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block text-sm px-2 py-1 rounded ${
                        resource.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                        resource.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {resource.level}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {resource.featured && (
                          <span className="flex items-center text-yellow-600">
                            <Star className="h-4 w-4 mr-1" />
                            <span className="text-xs">Featured</span>
                          </span>
                        )}
                        {resource.premium && (
                          <span className="flex items-center text-purple-600">
                            <GraduationCap className="h-4 w-4 mr-1" />
                            <span className="text-xs">Premium</span>
                          </span>
                        )}
                        {!resource.featured && !resource.premium && (
                          <span className="text-gray-500 text-xs">Standard</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm">
                        <div className="font-medium text-slate-600">
                          {formatFileSize(resource.file_size)}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={generateTopicPageUrl(resource)}
                          className="text-indigo-600 hover:text-indigo-700"
                          title="View on topic page"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button className="text-slate-600 hover:text-slate-700">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
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
          onSave={handleSaveResource}
          onCancel={() => setShowUploadModal(false)}
          topicsByKeyStage={TOPICS_BY_KEY_STAGE}
          languages={LANGUAGES}
          keyStages={KEY_STAGES}
          levels={LEVELS}
          resourceTypes={RESOURCE_TYPES}
          commonSkills={COMMON_SKILLS}
        />
      )}
    </div>
  );
} 