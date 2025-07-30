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
  Users,
  Globe
} from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import { AQATopicAssessmentService, type AQATopicAssessmentDefinition } from '../../services/aqaTopicAssessmentService';

// Language options with country flags
const AVAILABLE_LANGUAGES = [
  {
    code: 'spanish',
    countryCode: 'ES',
    name: 'Spanish',
    icon: <ReactCountryFlag countryCode="ES" svg style={{ width: '2rem', height: '2rem' }} className="rounded-full shadow-lg" />,
    description: 'Learn Spanish vocabulary',
    color: 'from-red-500 to-yellow-500'
  },
  {
    code: 'french',
    countryCode: 'FR',
    name: 'French',
    icon: <ReactCountryFlag countryCode="FR" svg style={{ width: '2rem', height: '2rem' }} className="rounded-full shadow-lg" />,
    description: 'Master French language skills',
    color: 'from-blue-500 to-red-500'
  },
  {
    code: 'german',
    countryCode: 'DE',
    name: 'German',
    icon: <ReactCountryFlag countryCode="DE" svg style={{ width: '2rem', height: '2rem' }} className="rounded-full shadow-lg" />,
    description: 'Build German language proficiency',
    color: 'from-gray-800 to-red-600'
  },
];

// AQA Themes and Topics
const AQA_THEMES = [
  {
    id: 'Theme 1: People and lifestyle',
    name: 'Theme 1: People and lifestyle',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    topics: [
      'Identity and relationships with others',
      'Healthy living and lifestyle',
      'Education and work'
    ]
  },
  {
    id: 'Theme 2: Popular culture',
    name: 'Theme 2: Popular culture',
    icon: Target,
    color: 'from-purple-500 to-pink-500',
    topics: [
      'Free-time activities',
      'Customs, festivals and celebrations',
      'Celebrity culture'
    ]
  },
  {
    id: 'Theme 3: Communication and the world around us',
    name: 'Theme 3: Communication and the world around us',
    icon: Globe,
    color: 'from-green-500 to-teal-500',
    topics: [
      'Travel and tourism, including places of interest',
      'Media and technology',
      'The environment and where people live'
    ]
  }
];

export default function AssessmentsPage() {
  // Initialize states to empty strings, allowing users to make their first selection
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [examBoard, setExamBoard] = useState('');
  const [skill, setSkill] = useState('');
  const [theme, setTheme] = useState('');
  const [topic, setTopic] = useState('');

  const [availableAssessments, setAvailableAssessments] = useState<AQATopicAssessmentDefinition[]>([]);
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(false);
  const [assessmentService] = useState(() => new AQATopicAssessmentService());

  const [showAQAAssessments, setShowAQAAssessments] = useState(false);

  useEffect(() => {
    // Only show the specific AQA assessments section if AQA is selected
    // and the skill is reading.
    setShowAQAAssessments(examBoard === 'AQA' && skill === 'reading');
  }, [examBoard, skill]);

  const examBoards = [
    { id: 'AQA', name: 'AQA', description: 'AQA topic-based practice with focused theme and topic assessments' },
    { id: 'Edexcel', name: 'Edexcel', description: 'Pearson Edexcel topic practice (coming soon)' }
  ];

  const getEstimatedTime = () => {
    if (skill === 'reading') {
      return '15-25 minutes'; // Topic-based assessments are shorter
    } else if (skill === 'listening') {
      return '15-20 minutes';
    } else if (skill === 'writing') {
      return '20-30 minutes';
    } else if (skill === 'speaking') {
      return '5-8 minutes';
    }
    return 'N/A';
  };

  const handleStartAssessment = () => {
    // This button is for starting a generic assessment based on current filters
    const params = new URLSearchParams({
      language,
      level,
      difficulty,
      examBoard,
      skill,
      theme,
      topic
    });
    window.location.href = `/assessments/task?${params.toString()}`;
  };

  // Helper to find the language details
  const getCurrentLanguageDetails = (langCode: string) => {
    return AVAILABLE_LANGUAGES.find(lang => lang.code === langCode);
  };

  // Get available topics for selected theme
  const getAvailableTopics = () => {
    const selectedTheme = AQA_THEMES.find(t => t.id === theme);
    return selectedTheme ? selectedTheme.topics : [];
  };

  // Load available assessments based on current filters (only for AQA reading)
  const loadAvailableAssessments = async () => {
    // Only attempt to load specific assessments if AQA is selected AND it's a reading skill
    if (examBoard === 'AQA' && skill === 'reading') {
      setIsLoadingAssessments(true);
      try {
        const languageMap: Record<string, string> = {
          'spanish': 'es',
          'french': 'fr',
          'german': 'de'
        };

        const languageCode = languageMap[language];

        // Only fetch if all required filters are selected
        if (languageCode && difficulty && theme && topic) {
          const assessments = await assessmentService.getAssessmentsByFilters(
            difficulty as 'foundation' | 'higher',
            languageCode,
            theme,
            topic
          );
          setAvailableAssessments(assessments || []);
        } else {
          setAvailableAssessments([]); // Clear assessments if filters are incomplete
        }
      } catch (error) {
        console.error('Error loading assessments:', error);
        setAvailableAssessments([]);
      } finally {
        setIsLoadingAssessments(false);
      }
    } else {
      setAvailableAssessments([]); // Clear assessments if not AQA reading
    }
  };

  // Load assessments when filters change
  useEffect(() => {
    loadAvailableAssessments();
  }, [examBoard, skill, language, difficulty, theme, topic]);

  // Reset topic when theme changes
  useEffect(() => {
    setTopic('');
  }, [theme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center mb-4">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Topic-Based Assessments
            </h1>
            <p className="text-lg text-gray-600">
              Practice specific themes and topics with focused assessments
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          {/* Language Selection */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Globe className="h-6 w-6 text-purple-600 mr-2" />
              1. Choose Language
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {AVAILABLE_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 ${
                    language === lang.code
                      ? 'border-purple-600 ring-4 ring-purple-200 shadow-md'
                      : 'border-gray-200 hover:border-purple-400'
                  } transition-all duration-200`}
                  onClick={() => setLanguage(lang.code)}
                >
                  <div className="mb-2">{lang.icon}</div>
                  <span className="font-medium text-gray-800">{lang.name}</span>
                  <p className="text-sm text-gray-500 text-center">{lang.description}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Level & Difficulty Selection */}
          {language && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <BookOpen className="h-6 w-6 text-purple-600 mr-2" />
                2. Select Level & Difficulty
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Level */}
                <div className="flex flex-col">
                  <label htmlFor="level-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    id="level-select"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md shadow-sm"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option value="">Select a level</option>
                    <option value="KS3">KS3</option>
                    <option value="GCSE">GCSE</option>
                    <option value="A-Level">A-Level</option>
                  </select>
                </div>
                {/* Difficulty */}
                <div className="flex flex-col">
                  <label htmlFor="difficulty-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    id="difficulty-select"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md shadow-sm"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="">Select difficulty</option>
                    <option value="foundation">Foundation</option>
                    <option value="higher">Higher</option>
                  </select>
                </div>
              </div>
            </section>
          )}

          {/* Exam Board Selection */}
          {language && level && difficulty && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="h-6 w-6 text-purple-600 mr-2" />
                3. Choose Exam Board
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {examBoards.map((board) => (
                  <button
                    key={board.id}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 ${
                      examBoard === board.id
                        ? 'border-purple-600 ring-4 ring-purple-200 shadow-md'
                        : 'border-gray-200 hover:border-purple-400'
                    } transition-all duration-200`}
                    onClick={() => setExamBoard(board.id)}
                  >
                    <span className="font-medium text-gray-800 mb-1">{board.name}</span>
                    <p className="text-sm text-gray-500 text-center">{board.description}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Skill Selection */}
          {language && level && difficulty && examBoard && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Target className="h-6 w-6 text-purple-600 mr-2" />
                4. Select Skill
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['reading', 'listening', 'writing', 'speaking'].map((s) => (
                  <button
                    key={s}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 capitalize ${
                      skill === s
                        ? 'border-purple-600 ring-4 ring-purple-200 shadow-md'
                        : 'border-gray-200 hover:border-purple-400'
                    } transition-all duration-200`}
                    onClick={() => setSkill(s)}
                  >
                    <span className="font-medium text-gray-800">{s}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* AQA Specific Theme and Topic Selection (Conditional) */}
          {showAQAAssessments && language && difficulty && (
            <section className="mb-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Users className="h-6 w-6 text-purple-600 mr-2" />
                5. AQA Theme & Topic
              </h2>
              <p className="text-gray-600 mb-4">
                Select an AQA theme and topic for your focused reading assessment.
              </p>

              {/* Theme Selection */}
              <div className="mb-6">
                <label htmlFor="theme-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Theme
                </label>
                <select
                  id="theme-select"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md shadow-sm"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="">Choose a Theme</option>
                  {AQA_THEMES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic Selection */}
              {theme && (
                <div className="mb-6">
                  <label htmlFor="topic-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Topic
                  </label>
                  <select
                    id="topic-select"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md shadow-sm"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={!theme} // Disable until a theme is selected
                  >
                    <option value="">Choose a Topic</option>
                    {getAvailableTopics().map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Available Assessments List */}
              {theme && topic && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Available Assessments:</h3>
                  {isLoadingAssessments ? (
                    <p className="text-gray-600">Loading assessments...</p>
                  ) : availableAssessments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableAssessments.map((assessment) => (
                        <div
                          key={assessment.id}
                          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between"
                        >
                          <div>
                            <p className="text-sm text-purple-700 font-semibold">{assessment.level.toUpperCase()} - {assessment.language.toUpperCase()}</p>
                            <h4 className="font-bold text-gray-900 text-base mb-1">{assessment.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{assessment.description}</p>
                            <p className="text-xs text-gray-500">Theme: {assessment.theme}</p>
                            <p className="text-xs text-gray-500">Topic: {assessment.topic}</p>
                          </div>
                          <Link
                            href={`/aqa-reading-test-topic/${assessment.language}/${assessment.level}/${encodeURIComponent(assessment.theme)}/${encodeURIComponent(assessment.topic)}/${assessment.identifier}`}
                            className="mt-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start Assessment
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No specific AQA assessments found for your selection. Try adjusting your filters.</p>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Generic Assessment Start (if AQA-specific is not shown or not fully selected) */}
          {!(showAQAAssessments && theme && topic && availableAssessments.length > 0) &&
            language && level && difficulty && examBoard && skill && (
              <section className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Play className="h-6 w-6 text-purple-600 mr-2" />
                  6. Start Your Assessment
                </h2>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        Estimated Time: <span className="font-medium">{getEstimatedTime()}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleStartAssessment}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                  <Play className="h-5 w-5 mr-3" />
                  Begin Assessment
                  <ArrowRight className="h-5 w-5 ml-3" />
                </button>
              </section>
            )}
        </div>
      </main>

      {/* Footer (Optional, you can add it here if needed) */}
    </div>
  );
}