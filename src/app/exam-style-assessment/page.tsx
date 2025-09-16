'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import FlagIcon from '../../components/ui/FlagIcon';
import {
  GraduationCap,
  Target,
  ArrowLeft,
  ArrowRight,
  Play,
  Settings,
  Award,
  CheckCircle,
  BookOpen,
  PenTool,
  Headphones,
  MessageSquare,
  Clock,
  TrendingUp,
  Lightbulb,
  FileText
} from 'lucide-react';

import { AQAReadingAssessmentService, type AQAAssessmentDefinition } from '../../services/aqaReadingAssessmentService';
import { AQAListeningAssessmentService, type AQAListeningAssessmentDefinition } from '../../services/aqaListeningAssessmentService';
import { AQAWritingAssessmentService, type AQAWritingAssessmentDefinition } from '../../services/aqaWritingAssessmentService';
import { EdexcelListeningAssessmentService, type EdexcelListeningAssessmentDefinition } from '../../services/edexcelListeningAssessmentService';

// Language options with country flags
const AVAILABLE_LANGUAGES = [
  {
    code: 'spanish',
    countryCode: 'ES',
    name: 'Spanish',
    icon: <FlagIcon countryCode="ES" size="lg" />,
    description: 'Learn Spanish vocabulary',
    color: 'from-red-500 to-yellow-500'
  },
  {
    code: 'french',
    countryCode: 'FR',
    name: 'French',
    icon: <FlagIcon countryCode="FR" size="lg" />,
    description: 'Master French language skills',
    color: 'from-blue-500 to-red-500'
  },
  {
    code: 'german',
    countryCode: 'DE',
    name: 'German',
    icon: <FlagIcon countryCode="DE" size="lg" />,
    description: 'Build German language proficiency',
    color: 'from-gray-800 to-red-600'
  },
];

export default function ExamStyleAssessmentPage() {
  // Initialize states to empty strings, allowing users to make their first selection
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [examBoard, setExamBoard] = useState('');
  const [skill, setSkill] = useState('');

  const [availableAssessments, setAvailableAssessments] = useState<AQAAssessmentDefinition[]>([]);
  const [availableListeningAssessments, setAvailableListeningAssessments] = useState<AQAListeningAssessmentDefinition[]>([]);
  const [availableWritingAssessments, setAvailableWritingAssessments] = useState<AQAWritingAssessmentDefinition[]>([]);
  const [availableEdexcelListeningAssessments, setAvailableEdexcelListeningAssessments] = useState<EdexcelListeningAssessmentDefinition[]>([]);
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(false);
  const [assessmentService] = useState(() => new AQAReadingAssessmentService());
  const [listeningAssessmentService] = useState(() => new AQAListeningAssessmentService());
  const [writingAssessmentService] = useState(() => new AQAWritingAssessmentService());
  const [edexcelListeningAssessmentService] = useState(() => new EdexcelListeningAssessmentService());

  const [showAQAAssessments, setShowAQAAssessments] = useState(false);
  const [showEdexcelAssessments, setShowEdexcelAssessments] = useState(false);

  useEffect(() => {
    // Show specific assessments section based on exam board and skill
    setShowAQAAssessments(examBoard === 'AQA' && (skill === 'reading' || skill === 'listening' || skill === 'writing'));
    setShowEdexcelAssessments(examBoard === 'Edexcel' && (skill === 'listening'));
  }, [examBoard, skill]);

  const examBoards = [
    { id: 'AQA', name: 'AQA', description: 'AQA style format with Foundation (45 min) and Higher (60 min) reading papers' },
    { id: 'Edexcel', name: 'Edexcel', description: 'Pearson Edexcel exam format with Foundation (45 min) and Higher (60 min) reading papers' }
  ];

  const skillsAssessed = [
    { name: 'Reading', icon: BookOpen, description: 'Text comprehension and analysis' },
    { name: 'Writing', icon: PenTool, description: 'Translation and creative writing' },
    { name: 'Listening', icon: Headphones, description: 'Audio comprehension tasks' },
    { name: 'Speaking', icon: MessageSquare, description: 'Oral communication assessment' }
  ];

  // The form is always considered valid to allow dynamic filtering.
  // The 'Start Assessment' button will navigate to a generic page,
  // while specific AQA papers are linked directly within their section.
  const isFormValid = true; 

  const getEstimatedTime = () => {
    if (skill === 'reading') {
      return difficulty === 'foundation' ? '45 minutes' : '60 minutes';
    } else if (skill === 'listening') {
      return '35-45 minutes';
    } else if (skill === 'writing') {
      return '60-75 minutes';
    } else if (skill === 'speaking') {
      return '10-12 minutes';
    }
    return 'N/A';
  };

  const handleStartAssessment = () => {
    // This button is for starting a generic assessment based on current filters,
    // primarily for 'General', 'Edexcel', and 'AQA speaking/writing' cases.
    // Specific AQA Reading/Listening papers have direct links.
    const params = new URLSearchParams({
      language,
      level,
      difficulty,
      examBoard,
      skill
    });
    window.location.href = `/exam-style-assessment/task?${params.toString()}`;
  };

  // Helper to find the language details
  const getCurrentLanguageDetails = (langCode: string) => {
    return AVAILABLE_LANGUAGES.find(lang => lang.code === langCode);
  };

  // Load available assessments based on current filters (for AQA and Edexcel)
  const loadAvailableAssessments = async () => {
    // Load specific assessments based on exam board and skill
    if ((examBoard === 'AQA' && (skill === 'reading' || skill === 'listening' || skill === 'writing')) ||
        (examBoard === 'Edexcel' && skill === 'listening')) {
      setIsLoadingAssessments(true);
      try {
        const languageMap: Record<string, string> = {
          'spanish': 'es',
          'french': 'fr',
          'german': 'de'
        };

        const languageCode = languageMap[language];

        // Only fetch if language and difficulty are selected
        if (languageCode && difficulty) {
          if (examBoard === 'AQA') {
            if (skill === 'reading') {
              const assessments = await assessmentService.getAssessmentsByLevel(
                difficulty as 'foundation' | 'higher',
                languageCode
              );
              setAvailableAssessments(assessments || []);
              setAvailableListeningAssessments([]);
              setAvailableWritingAssessments([]);
              setAvailableEdexcelListeningAssessments([]);
            } else if (skill === 'listening') {
              console.log('Loading AQA listening assessments for:', { difficulty, languageCode });
              const listeningAssessments = await listeningAssessmentService.getAssessmentsByLevel(
                difficulty as 'foundation' | 'higher',
                languageCode
              );
              console.log('AQA Listening assessments loaded:', listeningAssessments);
              setAvailableListeningAssessments(listeningAssessments || []);
              setAvailableAssessments([]);
              setAvailableWritingAssessments([]);
              setAvailableEdexcelListeningAssessments([]);
            } else if (skill === 'writing') {
              console.log('Loading AQA writing assessments for:', { difficulty, languageCode });
              const writingAssessments = await writingAssessmentService.getAssessmentsByLevel(
                difficulty as 'foundation' | 'higher',
                languageCode
              );
              console.log('AQA Writing assessments loaded:', writingAssessments);
              setAvailableWritingAssessments(writingAssessments || []);
              setAvailableAssessments([]);
              setAvailableListeningAssessments([]);
              setAvailableEdexcelListeningAssessments([]);
            }
          } else if (examBoard === 'Edexcel' && skill === 'listening') {
            console.log('Loading Edexcel listening assessments for:', { difficulty, languageCode });
            const edexcelListeningAssessments = await edexcelListeningAssessmentService.getAssessmentsByLevel(
              difficulty as 'foundation' | 'higher',
              languageCode
            );
            console.log('Edexcel Listening assessments loaded:', edexcelListeningAssessments);
            setAvailableEdexcelListeningAssessments(edexcelListeningAssessments || []);
            setAvailableAssessments([]);
            setAvailableListeningAssessments([]);
            setAvailableWritingAssessments([]);
          }
        } else {
          setAvailableAssessments([]);
          setAvailableListeningAssessments([]);
          setAvailableWritingAssessments([]);
          setAvailableEdexcelListeningAssessments([]);
        }
      } catch (error) {
        console.error('Error loading assessments:', error);
        setAvailableAssessments([]);
        setAvailableListeningAssessments([]);
      } finally {
        setIsLoadingAssessments(false);
      }
    } else {
      setAvailableAssessments([]);
      setAvailableListeningAssessments([]);
      setAvailableWritingAssessments([]);
      setAvailableEdexcelListeningAssessments([]);
    }
  };

  // Load assessments when filters change
  useEffect(() => {
    loadAvailableAssessments();
  }, [examBoard, skill, language, difficulty]);

  return (
    <>
      <Head>
        <title>Exam-Style Assessment | GCSE Language Testing | Language Gems</title>
        <meta name="description" content="Practice GCSE-style assessments in Spanish, French, and German. AQA, Edexcel, OCR compliant reading, writing, listening, and speaking assessments for exam preparation." />
        <meta name="keywords" content="GCSE exam assessments, AQA language assessment, GCSE Spanish test, GCSE French test, GCSE German test, language exam practice, GCSE assessment preparation" />
        <link rel="canonical" href="https://languagegems.com/exam-style-assessment" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center mb-4">
            <Link
              href="/assessments"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Assessments
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Exam-Style Assessment
            </h1>
            <p className="text-lg text-gray-600">
              Practice with authentic UK exam board formats and question types
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Configuration Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
            <Settings className="h-6 w-6 mr-2 text-blue-600" />
            Configure Your Assessment
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Click to select your desired options below to see available assessments.
          </p>

          {/* Exam Board Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Exam Board
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {examBoards.map(board => (
                <div
                  key={board.id}
                  onClick={() => setExamBoard(board.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    examBoard === board.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{board.name}</h3>
                  <p className="text-sm text-gray-600">{board.description}</p>
                </div>
              ))}
            </div>
            {!examBoard && <p className="text-blue-600 text-xs mt-1">Click to select an exam board.</p>}
          </div>

          {/* Language, Level, Difficulty, Skill */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Click to select language</option>
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              {!language && <p className="text-blue-600 text-xs mt-1">Click to select language.</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Click to select level</option>
                <option value="KS3">KS3 (Years 7-9)</option>
                <option value="KS4">KS4 (Years 10-11)</option>
              </select>
              {!level && <p className="text-blue-600 text-xs mt-1">Click to select level.</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Click to select difficulty</option>
                <option value="foundation">Foundation</option>
                <option value="higher">Higher</option>
              </select>
              {!difficulty && <p className="text-blue-600 text-xs mt-1">Click to select difficulty.</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill
              </label>
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-border-transparent"
              >
                <option value="">Click to select skill</option>
                <option value="reading">Reading</option>
                <option value="listening">Listening</option>
                <option value="speaking">Speaking</option>
                <option value="writing">Writing</option>
              </select>
              {!skill && <p className="text-blue-600 text-xs mt-1">Click to select skill.</p>}
            </div>
          </div>

          {/* Estimated Time - moved here to be part of the configuration */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Time
            </label>
            <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
              <Clock className="h-5 w-5 mr-2 text-gray-500" />
              <span>{getEstimatedTime()}</span>
            </div>
          </div>
        </div>

        {/* Dynamic AQA Assessments Section */}
        {showAQAAssessments && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              {skill === 'reading' && <BookOpen className="h-6 w-6 mr-2 text-blue-600" />}
              {skill === 'listening' && <Headphones className="h-6 w-6 mr-2 text-green-600" />}
              AQA {skill.charAt(0).toUpperCase() + skill.slice(1)} Assessments
            </h2>

            {skill === 'reading' && (
              <>
                {/* Current Filter Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        {/* Only show flag if language is selected */}
                        {language && getCurrentLanguageDetails(language) && (
                          <FlagIcon
                            countryCode={getCurrentLanguageDetails(language)?.countryCode || 'ES'}
                            size="sm"
                            className="mr-3"
                          />
                        )}
                        <span className="font-medium text-gray-900 capitalize">{language || 'Not Selected'}</span>
                      </div>
                      <div className="text-gray-600">•</div>
                      <div className="font-medium text-gray-900">{level || 'Not Selected'}</div>
                      <div className="text-gray-600">•</div>
                      <div className="font-medium text-gray-900 capitalize">{difficulty || 'Not Selected'}</div>
                      <div className="text-gray-600">•</div>
                      <div className="font-medium text-gray-900 capitalize">{skill || 'Not Selected'}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {isLoadingAssessments ? 'Loading...' :
                        skill === 'reading'
                          ? `${availableAssessments.length} paper${availableAssessments.length !== 1 ? 's' : ''} found`
                          : `${availableListeningAssessments.length} paper${availableListeningAssessments.length !== 1 ? 's' : ''} found`
                      }
                    </div>
                  </div>
                </div>

                {isLoadingAssessments ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading assessments...</p>
                  </div>
                ) : (!language || !difficulty) ? ( // Check if language or difficulty are missing for AQA Reading
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select Your Criteria</h3>
                    <p className="text-gray-600">
                      Please select a **Language** and **Difficulty** above to see available AQA Reading papers.
                    </p>
                  </div>
                ) : availableAssessments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {availableAssessments.map((assessment, index) => {
                      const paperNumber = assessment.identifier.split('-')[1] || (index + 1);
                      const isFoundation = assessment.level === 'foundation';

                      return (
                        <Link
                          key={assessment.id}
                          href={`/aqa-reading-test/${assessment.language}/${assessment.level}/${assessment.identifier}`}
                          className={`block p-4 bg-gradient-to-br ${
                            isFoundation
                              ? 'from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300'
                              : 'from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300'
                          } rounded-lg border transition-all group`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <FileText className={`h-5 w-5 ${isFoundation ? 'text-blue-600' : 'text-purple-600'} mr-2`} />
                              <h4 className="font-semibold text-gray-900">Paper {paperNumber}</h4>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              isFoundation ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {assessment.level.charAt(0).toUpperCase() + assessment.level.slice(1)}
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 mb-3">
                            {assessment.description || `Complete AQA-style ${assessment.level} reading assessment with 40 questions.`}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              <div className="flex items-center mb-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {assessment.time_limit_minutes} minutes
                              </div>
                              <div>40 marks total</div>
                            </div>
                            <ArrowRight className={`h-4 w-4 ${
                              isFoundation ? 'text-blue-600 group-hover:text-blue-700' : 'text-purple-600 group-hover:text-purple-700'
                            } group-hover:translate-x-1 transition-transform`} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  // This is for when language and difficulty are selected, but no papers are found.
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Assessments Found</h3>
                    <p className="text-gray-600">
                      No AQA Reading assessments found for {language} ({difficulty} tier). Try different filter combinations.
                    </p>
                  </div>
                )}

                {/* Information Box - always present within AQA Reading section */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">Assessment Information</h4>
                  <p className="text-sm text-amber-800">
                    Results are filtered by your selections: {examBoard || 'N/A'} • {language || 'N/A'} • {level || 'N/A'} • {difficulty || 'N/A'} • {skill || 'N/A'}.
                    Change the filters above to see different assessments.
                  </p>
                </div>
              </>
            )}

            {skill === 'listening' && (
              <>
                {/* Current Filter Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        {/* Only show flag if language is selected */}
                        {language && getCurrentLanguageDetails(language) && (
                          <FlagIcon
                            countryCode={getCurrentLanguageDetails(language)?.countryCode || 'ES'}
                            size="sm"
                            className="mr-3"
                          />
                        )}
                        <span className="font-medium text-gray-900 capitalize">{language || 'Not Selected'}</span>
                      </div>
                      <div className="text-gray-600">•</div>
                      <div className="font-medium text-gray-900">{level || 'Not Selected'}</div>
                      <div className="text-gray-600">•</div>
                      <div className="font-medium text-gray-900 capitalize">{difficulty || 'Not Selected'}</div>
                      <div className="text-gray-600">•</div>
                      <div className="font-medium text-gray-900 capitalize">{skill || 'Not Selected'}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {isLoadingAssessments ? 'Loading...' : `${availableListeningAssessments.length} paper${availableListeningAssessments.length !== 1 ? 's' : ''} found`}
                    </div>
                  </div>
                </div>

                {/* Available Listening Assessments */}
                {isLoadingAssessments ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading listening assessments...</p>
                  </div>
                ) : availableListeningAssessments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {availableListeningAssessments.map((assessment) => {
                      const isFoundation = assessment.level === 'foundation';
                      const paperNumber = assessment.identifier.split('-')[1];

                      return (
                        <Link
                          key={assessment.id}
                          href={`/aqa-listening-test/${assessment.language}/${assessment.level}/${assessment.identifier}`}
                          className={`block p-4 bg-gradient-to-br ${
                            isFoundation
                              ? 'from-green-50 to-green-100 border-green-200 hover:border-green-300'
                              : 'from-emerald-50 to-emerald-100 border-emerald-200 hover:border-emerald-300'
                          } rounded-lg border transition-all group`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <Headphones className={`h-5 w-5 ${isFoundation ? 'text-green-600' : 'text-emerald-600'} mr-2`} />
                              <h4 className="font-semibold text-gray-900">Paper {paperNumber}</h4>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              isFoundation
                                ? 'bg-green-100 text-green-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {assessment.level === 'foundation' ? 'Foundation' : 'Higher'}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {assessment.description || `Complete AQA-style listening assessment with authentic audio and 8 question types.`}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{assessment.total_questions} questions</span>
                            <span>{assessment.time_limit_minutes} minutes</span>
                          </div>
                          <div className={`flex items-center text-sm ${isFoundation ? 'text-green-600 group-hover:text-green-700' : 'text-emerald-600 group-hover:text-emerald-700'} mt-2`}>
                            <span className="font-medium">Audio included • Google Gemini TTS</span>
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Headphones className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Listening Assessments Found</h3>
                    <p className="text-gray-600 mb-4">
                      No listening assessments match your current selection. Try adjusting your filters above.
                    </p>
                  </div>
                )}

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">Assessment Information</h4>
                  <p className="text-sm text-amber-800">
                    Results are filtered by your selections: {examBoard || 'N/A'} • {language || 'N/A'} • {level || 'N/A'} • {difficulty || 'N/A'} • {skill || 'N/A'}.
                    Change the filters above to see different assessments.
                  </p>
                </div>
              </>
            )}

            {skill === 'writing' && (
              <>
                {/* Current Filter Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        {/* Only show flag if language is selected */}
                        {language && getCurrentLanguageDetails(language) && (
                          <FlagIcon
                            countryCode={getCurrentLanguageDetails(language)?.countryCode || 'ES'}
                            size="sm"
                            className="mr-3"
                          />
                        )}
                        <span className="font-medium text-gray-900 capitalize">{language || 'Not Selected'}</span>
                      </div>
                      <div className="text-gray-600">•</div>
                      <div className="font-medium text-gray-900">{level || 'Not Selected'}</div>
                      <div className="text-gray-600">•</div>
                      <div className="font-medium text-gray-900 capitalize">{difficulty || 'Not Selected'}</div>
                      <div className="text-gray-600">•</div>
                      <div className="font-medium text-gray-900 capitalize">{skill || 'Not Selected'}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {isLoadingAssessments ? 'Loading...' : `${availableWritingAssessments.length} paper${availableWritingAssessments.length !== 1 ? 's' : ''} found`}
                    </div>
                  </div>
                </div>

                {/* Available Writing Assessments */}
                {isLoadingAssessments ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading writing assessments...</p>
                  </div>
                ) : (!language || !difficulty) ? (
                  <div className="text-center py-8">
                    <PenTool className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select Your Criteria</h3>
                    <p className="text-gray-600">
                      Please select a **Language** and **Difficulty** above to see available AQA Writing papers.
                    </p>
                  </div>
                ) : availableWritingAssessments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {availableWritingAssessments.map((assessment) => {
                      const isFoundation = assessment.level === 'foundation';
                      const paperNumber = assessment.identifier.split('-')[1];

                      return (
                        <Link
                          key={assessment.id}
                          href={`/aqa-writing-test/${assessment.language}/${assessment.level}/${assessment.identifier}`}
                          className={`block p-4 bg-gradient-to-br ${
                            isFoundation
                              ? 'from-red-50 to-red-100 border-red-200 hover:border-red-300'
                              : 'from-orange-50 to-orange-100 border-orange-200 hover:border-orange-300'
                          } rounded-lg border transition-all group`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <PenTool className={`h-5 w-5 ${isFoundation ? 'text-red-600' : 'text-orange-600'} mr-2`} />
                              <h4 className="font-semibold text-gray-900">Paper {paperNumber}</h4>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              isFoundation
                                ? 'bg-red-100 text-red-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {assessment.level === 'foundation' ? 'Foundation' : 'Higher'}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {assessment.description || `Complete AQA-style writing assessment with 5 questions covering all writing skills.`}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{assessment.total_questions} questions</span>
                            <span>{assessment.time_limit_minutes} minutes</span>
                          </div>
                          <div className={`flex items-center text-sm ${isFoundation ? 'text-red-600 group-hover:text-red-700' : 'text-orange-600 group-hover:text-orange-700'} mt-2`}>
                            <span className="font-medium">{assessment.total_marks} marks total</span>
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <PenTool className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Writing Assessments Found</h3>
                    <p className="text-gray-600 mb-4">
                      No writing assessments match your current selection. Try adjusting your filters above.
                    </p>
                  </div>
                )}

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">Assessment Information</h4>
                  <p className="text-sm text-amber-800">
                    Results are filtered by your selections: {examBoard || 'N/A'} • {language || 'N/A'} • {level || 'N/A'} • {difficulty || 'N/A'} • {skill || 'N/A'}.
                    Change the filters above to see different assessments.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Dynamic Edexcel Assessments Section */}
        {showEdexcelAssessments && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Headphones className="h-6 w-6 mr-2 text-purple-600" />
              Edexcel Listening Assessments
            </h2>

            {/* Current Filter Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {language && getCurrentLanguageDetails(language) && (
                      <FlagIcon
                        countryCode={getCurrentLanguageDetails(language)?.countryCode || 'ES'}
                        size="sm"
                        className="mr-3"
                      />
                    )}
                    <span className="font-medium text-gray-900 capitalize">{language || 'Not Selected'}</span>
                  </div>
                  <div className="text-gray-600">•</div>
                  <div className="font-medium text-gray-900">{level || 'Not Selected'}</div>
                  <div className="text-gray-600">•</div>
                  <div className="font-medium text-gray-900 capitalize">{difficulty || 'Not Selected'}</div>
                  <div className="text-gray-600">•</div>
                  <div className="font-medium text-gray-900 capitalize">{skill || 'Not Selected'}</div>
                </div>
                <div className="text-sm text-gray-500">
                  {isLoadingAssessments ? 'Loading...' : `${availableEdexcelListeningAssessments.length} paper${availableEdexcelListeningAssessments.length !== 1 ? 's' : ''} found`}
                </div>
              </div>
            </div>

            {/* Available Edexcel Listening Assessments */}
            {isLoadingAssessments ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Edexcel listening assessments...</p>
              </div>
            ) : (!language || !difficulty) ? (
              <div className="text-center py-8">
                <Headphones className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select Your Criteria</h3>
                <p className="text-gray-600">
                  Please select a **Language** and **Difficulty** above to see available Edexcel Listening papers.
                </p>
              </div>
            ) : availableEdexcelListeningAssessments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {availableEdexcelListeningAssessments.map((assessment) => {
                  const isFoundation = assessment.level === 'foundation';
                  const paperNumber = assessment.identifier.split('-')[1];

                  return (
                    <Link
                      key={assessment.id}
                      href={`/edexcel-listening-test/${assessment.language}/${assessment.level}/${assessment.identifier}`}
                      className={`block p-4 bg-gradient-to-br ${
                        isFoundation
                          ? 'from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300'
                          : 'from-indigo-50 to-indigo-100 border-indigo-200 hover:border-indigo-300'
                      } rounded-lg border transition-all group`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Headphones className={`h-5 w-5 ${isFoundation ? 'text-purple-600' : 'text-indigo-600'} mr-2`} />
                          <h4 className="font-semibold text-gray-900">Paper {paperNumber}</h4>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          isFoundation
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {assessment.level === 'foundation' ? 'Foundation' : 'Higher'}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {assessment.description || `Complete Edexcel-style listening assessment with Section A (40 marks) and Section B dictation (10 marks).`}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>{assessment.total_questions} questions</span>
                        <span>{assessment.time_limit_minutes} minutes</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>50 marks total</span>
                        <span>3x audio playback</span>
                      </div>
                      <div className={`flex items-center text-sm ${isFoundation ? 'text-purple-600 group-hover:text-purple-700' : 'text-indigo-600 group-hover:text-indigo-700'} mt-2`}>
                        <span className="font-medium">Sections A & B • Crossover questions</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Headphones className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Edexcel Listening Assessments Found</h3>
                <p className="text-gray-600 mb-4">
                  No Edexcel listening assessments match your current selection. Try adjusting your filters above.
                </p>
              </div>
            )}

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-semibold text-amber-900 mb-2">Assessment Information</h4>
              <p className="text-sm text-amber-800">
                Results are filtered by your selections: {examBoard || 'N/A'} • {language || 'N/A'} • {level || 'N/A'} • {difficulty || 'N/A'} • {skill || 'N/A'}.
                Change the filters above to see different assessments.
              </p>
            </div>
          </div>
        )}

        {/* Placeholder for other Edexcel skills */}
        {examBoard === 'Edexcel' && skill !== 'listening' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              {skill === 'reading' && <BookOpen className="h-6 w-6 mr-2 text-blue-600" />}
              {skill === 'writing' && <PenTool className="h-6 w-6 mr-2 text-red-600" />}
              {skill === 'speaking' && <MessageSquare className="h-6 w-6 mr-2 text-orange-600" />}
              Edexcel {skill ? skill.charAt(0).toUpperCase() + skill.slice(1) : ''} Assessment
            </h2>

            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <p className="text-gray-700 mb-3 text-lg font-medium">
                <span className="block text-4xl mb-2">🚧</span>
                Edexcel {skill} assessments are coming soon!
              </p>
              <p className="text-gray-600">
                We're actively developing comprehensive Edexcel-style {skill} assessments to provide the best practice experience.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                In the meantime, explore our fully available **Edexcel Listening** assessments!
              </p>
              <div className="flex justify-center gap-3 mt-6">
                 <button
                    onClick={() => setSkill('listening')}
                    className="flex items-center px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                 >
                    <Headphones className="h-4 w-4 mr-1" /> Listening
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* Speaking Placeholder for AQA */}
        {examBoard === 'AQA' && skill === 'speaking' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <MessageSquare className="h-6 w-6 mr-2 text-orange-600" />
              AQA Speaking Assessment
            </h2>

            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <p className="text-gray-700 mb-3 text-lg font-medium">
                <span className="block text-4xl mb-2">🚀</span>
                Speaking assessments are coming soon!
              </p>
              <p className="text-gray-600">
                We're actively developing comprehensive AQA-style speaking assessments to provide the best practice experience.
              </p>
              <p className="text-sm text-gray-600 mt-2">
               In the meantime, explore our fully available <strong>Reading</strong>, <strong>Listening</strong>, and <strong>Writing</strong> assessments!
              </p>
              <div className="flex justify-center gap-3 mt-6">
                 <button
                    onClick={() => setSkill('reading')}
                    className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                 >
                    <BookOpen className="h-4 w-4 mr-1" /> Reading
                 </button>
                 <button
                    onClick={() => setSkill('listening')}
                    className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                 >
                    <Headphones className="h-4 w-4 mr-1" /> Listening
                 </button>
                 <button
                    onClick={() => setSkill('writing')}
                    className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                 >
                    <PenTool className="h-4 w-4 mr-1" /> Writing
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* Skills Assessed - Keep this section as it's general information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Target className="h-6 w-6 mr-2 text-green-600" />
            Skills Assessed
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillsAssessed.map((skillItem, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <skillItem.icon className="h-6 w-6 text-gray-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">{skillItem.name}</h3>
                  <p className="text-sm text-gray-600">{skillItem.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Features - Keep this section as it's general information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Award className="h-6 w-6 mr-2 text-yellow-600" />
            Why Choose LanguageGems Assessments?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-orange-500" />
                Boost Your Exam Readiness
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Authentic exam question formats mirroring official papers</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Receive estimated grade boundary predictions for your score</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Get valuable exam technique tips to maximize your performance</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Simulate real mock exams under timed conditions</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                Track Your Progress
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start text-gray-700">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Detailed performance analytics to pinpoint strengths and weaknesses</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Skill-specific feedback to guide your improvement</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Visual progress tracking over time to see your growth</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                  <span>Earn achievement badges and rewards for your hard work</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Start Assessment Button - always visible, but dynamic text */}
        <div className="text-center mt-10">
          <button
            onClick={handleStartAssessment}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-lg transition-all flex items-center mx-auto shadow-lg"
          >
            <Play className="h-5 w-5 mr-2" />
            Start Assessment
          </button>

          <p className="text-gray-600 text-sm mt-4">
            Select your options above to find specific papers or click "Start Assessment" for a general practice session.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
