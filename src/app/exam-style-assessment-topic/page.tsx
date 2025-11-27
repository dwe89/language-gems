'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Target,
  ArrowLeft,
  ArrowRight,
  Play,
  Settings,
  BookOpen,
  Clock,
  FileText,
  Filter,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import TopicAssessmentAdminModal from '@/components/admin/TopicAssessmentAdminModal';

import { AQATopicAssessmentService, type AQATopicAssessmentDefinition } from '../../services/aqaTopicAssessmentService';

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
    id: 'My personal world',
    name: 'My personal world',
    topics: [
      'Family',
      'Friends and relationships',
      'Home',
      'Equality'
    ]
  },
  {
    id: 'Lifestyle and wellbeing',
    name: 'Lifestyle and wellbeing',
    topics: [
      'Physical wellbeing',
      'Mental wellbeing',
      'Healthy living',
      'Food and drink',
      'Sports',
      'Illnesses'
    ]
  },
  {
    id: 'My neighbourhood',
    name: 'My neighbourhood',
    topics: [
      'Home and local area',
      'Places in town',
      'Shopping',
      'The natural world',
      'Environmental issues'
    ]
  },
  {
    id: 'Media and technology',
    name: 'Media and technology',
    topics: [
      'Life online - advantages and disadvantages',
      'Technology',
      'TV and film',
      'Music',
      'Social media',
      'Gaming'
    ]
  },
  {
    id: 'Studying and my future',
    name: 'Studying and my future',
    topics: [
      'School subjects',
      'Opinions about school',
      'School rules',
      'Future plans',
      'Current employment',
      'Future employment'
    ]
  },
  {
    id: 'Travel and tourism',
    name: 'Travel and tourism',
    topics: [
      'Holidays',
      'Transport',
      'Accommodation',
      'Planning and describing a holiday',
      'Weather',
      'Tourist attractions'
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

export default function AssessmentsPage() {
  const { user } = useAuth();
  const [language, setLanguage] = useState('spanish');
  const [curriculumLevel, setCurriculumLevel] = useState('ks4'); // ks3, ks4 (GCSE)
  const [level, setLevel] = useState('foundation'); // foundation or higher (for GCSE)
  const [examBoard, setExamBoard] = useState('AQA'); // AQA or Edexcel (for GCSE)
  const [theme, setTheme] = useState('');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('reading'); // reading, writing, listening

  const [availableAssessments, setAvailableAssessments] = useState<AQATopicAssessmentDefinition[]>([]);
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(false);
  const [assessmentService] = useState(() => new AQATopicAssessmentService());
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Check if user is admin
  const isAdmin = user?.email === 'danieletienne89@gmail.com';

  // Get available themes based on curriculum level and exam board
  const getAvailableThemes = () => {
    if (curriculumLevel === 'ks3') {
      return []; // KS3 doesn't use themes, just topics
    } else if (curriculumLevel === 'ks4') {
      if (examBoard === 'AQA') {
        return AQA_THEMES;
      } else if (examBoard === 'Edexcel') {
        return EDEXCEL_THEMES;
      }
    }
    return [];
  };

  // Get available topics based on curriculum level, exam board, and theme
  const getAvailableTopics = () => {
    if (curriculumLevel === 'ks3') {
      return KS3_TOPICS;
    } else if (curriculumLevel === 'ks4') {
      if (!theme) return [];
      const themes = getAvailableThemes();
      const selectedTheme = themes.find(t => t.id === theme);
      return selectedTheme ? selectedTheme.topics : [];
    }
    return [];
  };

  // Load available assessments based on current filters - now uses API directly
  const loadAvailableAssessments = async () => {
    // Don't require all filters - load with whatever is selected
    if (!language) {
      setAvailableAssessments([]);
      return;
    }

    setIsLoadingAssessments(true);
    try {
      const languageMap: Record<string, string> = {
        'spanish': 'es',
        'french': 'fr',
        'german': 'de'
      };

      const languageCode = languageMap[language];

      // Build query parameters dynamically
      const params = new URLSearchParams();
      params.append('language', languageCode);

      if (curriculumLevel === 'ks4' && level) {
        params.append('level', level);
      }

      if (theme) {
        params.append('theme', theme);
      }

      if (topic) {
        params.append('topic', topic);
      }

      if (type) {
        params.append('type', type);
      }

      if (curriculumLevel) {
        params.append('curriculum_level', curriculumLevel);
      }

      // Call API directly with flexible filters
      const response = await fetch(`/api/topic-assessments?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setAvailableAssessments(data.assessments || []);
      } else {
        setAvailableAssessments([]);
      }
    } catch (error) {
      console.error('Error loading assessments:', error);
      setAvailableAssessments([]);
    } finally {
      setIsLoadingAssessments(false);
    }
  };

  // Load assessments when filters change - removed dependencies on all filters
  useEffect(() => {
    loadAvailableAssessments();
  }, [language, curriculumLevel, level, examBoard, theme, topic, type]);

  // Reset theme and topic when curriculum level changes
  useEffect(() => {
    setTheme('');
    setTopic('');
  }, [curriculumLevel]);

  // Reset topic when exam board or theme changes
  useEffect(() => {
    setTopic('');
  }, [examBoard, theme]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Button */}
        {isAdmin && (
          <button
            onClick={() => setShowAdminModal(true)}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
            title="Manage Topic Assessments (Admin only)"
          >
            <Settings className="w-5 h-5" />
            <span>Manage Assessments</span>
          </button>
        )}

        {/* Admin Modal */}
        {isAdmin && (
          <TopicAssessmentAdminModal
            isOpen={showAdminModal}
            onClose={() => setShowAdminModal(false)}
            onRefresh={loadAvailableAssessments}
          />
        )}

        {/* Header */}
        <div className="text-center mb-8">
          {/* Back Button */}
          <div className="flex justify-start mb-4">
            <Link
              href="/assessments"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessments
            </Link>
          </div>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-4">
              <span className="block">Topic-Based Assessments</span>
              <span className="block text-purple-600">Focused Practice</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Master specific topics with targeted assessments for Reading, Writing, and Listening.
              Available for AQA & Edexcel GCSE, and KS3.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Targeted Skill Practice
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Choose your exam board, theme, and topic to practice specific skills.
                Perfect for revision or testing your knowledge on particular subject areas.
              </p>
              <ul className="space-y-3">
                {[
                  'Exam Board specific themes (AQA & Edexcel)',
                  'Reading, Writing, and Listening skills',
                  'Foundation and Higher tier options',
                  'KS3 topic-based assessments',
                  'Instant feedback for Reading & Listening'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-purple-50 p-8 md:p-12 flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2573&q=80"
                  alt="Student studying"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="font-bold text-lg">Exam-Style Practice</p>
                    <p className="text-sm opacity-90">Build confidence for your exams</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Content</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </select>
            </div>

            {/* Assessment Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="reading">Reading</option>
                <option value="writing">Writing</option>
                <option value="listening">Listening</option>
              </select>
            </div>

            {/* Curriculum Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curriculum Level
              </label>
              <select
                value={curriculumLevel}
                onChange={(e) => setCurriculumLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="ks3">KS3</option>
                <option value="ks4">KS4 (GCSE)</option>
              </select>
            </div>

            {/* Exam Board Filter (only for KS4) */}
            {curriculumLevel === 'ks4' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Board
                </label>
                <select
                  value={examBoard}
                  onChange={(e) => setExamBoard(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="AQA">AQA</option>
                  <option value="Edexcel">Edexcel</option>
                </select>
              </div>
            )}

            {/* GCSE Level Filter (only for KS4) */}
            {curriculumLevel === 'ks4' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GCSE Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="foundation">Foundation</option>
                  <option value="higher">Higher</option>
                </select>
              </div>
            )}

            {/* Theme Filter (only for KS4) */}
            {curriculumLevel === 'ks4' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {examBoard} Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Themes</option>
                  {getAvailableThemes().map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Topic Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={curriculumLevel === 'ks4' && !theme}
              >
                <option value="">All Topics</option>
                {getAvailableTopics().map((t) => (
                  <option key={typeof t === 'string' ? t : t} value={typeof t === 'string' ? t : t}>
                    {typeof t === 'string' ? t : t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Assessment Cards */}
        <div className="space-y-6">
          {isLoadingAssessments ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Loading assessments...</p>
            </div>
          ) : availableAssessments.length > 0 ? (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Available Assessments ({availableAssessments.length})
                </h3>
                <p className="text-sm text-gray-600">
                  Select an assessment to begin
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden border border-gray-200"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {assessment.level.toUpperCase()}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {assessment.language.toUpperCase()}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${(assessment.type || 'reading') === 'listening' ? 'bg-yellow-100 text-yellow-800' :
                          (assessment.type || 'reading') === 'writing' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          } capitalize ml-2`}>
                          {assessment.type || 'reading'}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {assessment.title}
                      </h4>

                      {assessment.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {assessment.description}
                        </p>
                      )}

                      <div className="space-y-1 mb-4">
                        <div className="flex items-center text-xs text-gray-500">
                          <BookOpen className="h-3 w-3 mr-1" />
                          <span className="font-medium mr-1">Theme:</span>
                          <span className="truncate">{assessment.theme}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Target className="h-3 w-3 mr-1" />
                          <span className="font-medium mr-1">Topic:</span>
                          <span className="truncate">{assessment.topic}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span className="font-medium mr-1">Time:</span>
                          <span>{assessment.time_limit_minutes} minutes</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <FileText className="h-3 w-3 mr-1" />
                          <span className="font-medium mr-1">Questions:</span>
                          <span>{assessment.total_questions}</span>
                        </div>
                      </div>

                      <Link
                        href={
                          (assessment.type || 'reading') === 'writing'
                            ? `/aqa-writing-test-topic/${assessment.language}/${assessment.level}/${encodeURIComponent(assessment.theme)}/${encodeURIComponent(assessment.topic)}/${assessment.identifier}`
                            : (assessment.type || 'reading') === 'listening'
                              ? `/aqa-listening-test-topic/${assessment.language}/${assessment.level}/${encodeURIComponent(assessment.theme)}/${encodeURIComponent(assessment.topic)}/${assessment.identifier}`
                              : `/aqa-reading-test-topic/${assessment.language}/${assessment.level}/${encodeURIComponent(assessment.theme)}/${encodeURIComponent(assessment.topic)}/${assessment.identifier}`
                        }
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Assessment
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : !isLoadingAssessments && availableAssessments.length === 0 && language ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Assessments Found
              </h3>
              <p className="text-gray-600 mb-4">
                No assessments available for the selected filters.
              </p>
              <p className="text-sm text-gray-500">
                Try adjusting your filters or check back later for new assessments.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select Your Filters
              </h3>
              <p className="text-gray-600">
                Choose your language and other filters above to view available assessments.
                <br />
                Assessments will load automatically as you select filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
