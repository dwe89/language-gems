'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  PenTool, 
  Headphones, 
  Mic,
  Clock,
  Target,
  Star,
  ArrowRight,
  CheckCircle,
  Settings
} from 'lucide-react';

export default function FourSkillsAssessmentPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'es' | 'fr' | 'de'>('es');
  const [selectedLevel, setSelectedLevel] = useState<'KS3' | 'KS4'>('KS3');
  const [selectedSkills, setSelectedSkills] = useState<('reading' | 'writing' | 'listening' | 'speaking')[]>(['reading', 'writing', 'listening', 'speaking']);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'foundation' | 'higher'>('foundation');
  const [selectedExamBoard, setSelectedExamBoard] = useState<'AQA' | 'Edexcel' | 'Eduqas' | 'General'>('General');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');

  const skills = [
    {
      id: 'reading' as const,
      name: 'Reading',
      description: 'Comprehension of written texts, inference, and analysis',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'text-blue-600 bg-blue-100 border-blue-200',
      estimatedTime: '15-20 minutes'
    },
    {
      id: 'writing' as const,
      name: 'Writing',
      description: 'Written communication, translation, and essay composition',
      icon: <PenTool className="h-8 w-8" />,
      color: 'text-green-600 bg-green-100 border-green-200',
      estimatedTime: '20-30 minutes'
    },
    {
      id: 'listening' as const,
      name: 'Listening',
      description: 'Audio comprehension and understanding of spoken language',
      icon: <Headphones className="h-8 w-8" />,
      color: 'text-purple-600 bg-purple-100 border-purple-200',
      estimatedTime: '10-15 minutes'
    },
    {
      id: 'speaking' as const,
      name: 'Speaking',
      description: 'Oral communication, pronunciation, and fluency',
      icon: <Mic className="h-8 w-8" />,
      color: 'text-red-600 bg-red-100 border-red-200',
      estimatedTime: '5-10 minutes'
    }
  ];

  const examBoards = [
    { id: 'General', name: 'General Assessment', description: 'Standard assessment format' },
    { id: 'AQA', name: 'AQA', description: 'AQA style format' },
    { id: 'Edexcel', name: 'Edexcel', description: 'Pearson Edexcel format' },
    { id: 'Eduqas', name: 'Eduqas', description: 'WJEC Eduqas format' }
  ];

  const categories = [
    'food_drink',
    'home_local_area',
    'school_jobs_future',
    'identity_personal_life',
    'free_time_leisure',
    'holidays_travel_culture',
    'nature_environment',
    'technology_media'
  ];

  const handleSkillToggle = (skillId: 'reading' | 'writing' | 'listening' | 'speaking') => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(s => s !== skillId)
        : [...prev, skillId]
    );
  };

  const handleStartAssessment = () => {
    if (selectedSkills.length === 0) {
      alert('Please select at least one skill to assess.');
      return;
    }

    const params = new URLSearchParams({
      language: selectedLanguage,
      level: selectedLevel,
      skills: selectedSkills.join(','),
      difficulty: selectedDifficulty,
      examBoard: selectedExamBoard,
      ...(selectedCategory && { category: selectedCategory }),
      ...(selectedSubcategory && { subcategory: selectedSubcategory })
    });
    
    router.push(`/four-skills-assessment/test?${params.toString()}`);
  };

  const getTotalEstimatedTime = () => {
    const timeRanges = selectedSkills.map(skillId => {
      const skill = skills.find(s => s.id === skillId);
      if (!skill) return [0, 0];
      
      const [min, max] = skill.estimatedTime.match(/\d+/g)?.map(Number) || [0, 0];
      return [min, max];
    });

    const totalMin = timeRanges.reduce((sum, [min]) => sum + min, 0);
    const totalMax = timeRanges.reduce((sum, [, max]) => sum + max, 0);
    
    return `${totalMin}-${totalMax} minutes`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Target className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Four Skills Assessment</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive assessment of Reading, Writing, Listening, and Speaking skills based on UK exam board standards
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <Settings className="h-6 w-6 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold">Assessment Configuration</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as 'es' | 'fr' | 'de')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            {/* Level Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as 'KS3' | 'KS4')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="KS3">KS3 (Years 7-9)</option>
                <option value="KS4">KS4 (Years 10-11)</option>
              </select>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as 'foundation' | 'higher')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="foundation">Foundation</option>
                <option value="higher">Higher</option>
              </select>
            </div>

            {/* Exam Board Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Board
              </label>
              <select
                value={selectedExamBoard}
                onChange={(e) => setSelectedExamBoard(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {examBoards.map(board => (
                  <option key={board.id} value={board.id}>{board.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Selection (Optional) */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category (Optional)
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory (Optional)
              </label>
              <input
                type="text"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                placeholder="Enter specific subcategory..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Skills Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Skills to Assess</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {skills.map(skill => (
              <div
                key={skill.id}
                onClick={() => handleSkillToggle(skill.id)}
                className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all duration-200 ${
                  selectedSkills.includes(skill.id)
                    ? `${skill.color} border-current`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {selectedSkills.includes(skill.id) && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="h-5 w-5 text-current" />
                  </div>
                )}
                
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-lg mr-3 ${selectedSkills.includes(skill.id) ? 'bg-white bg-opacity-50' : skill.color}`}>
                    {skill.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{skill.name}</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{skill.description}</p>
                
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{skill.estimatedTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Assessment Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{selectedSkills.length}</div>
              <div className="text-sm text-gray-600">Skills Selected</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{getTotalEstimatedTime()}</div>
              <div className="text-sm text-gray-600">Estimated Time</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{selectedExamBoard}</div>
              <div className="text-sm text-gray-600">Exam Board Format</div>
            </div>
          </div>
        </div>

        {/* Exam Board Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Exam Board Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {examBoards.map(board => (
              <div
                key={board.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedExamBoard === board.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <h3 className="font-semibold text-lg mb-2">{board.name}</h3>
                <p className="text-sm text-gray-600">{board.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Start Assessment Button */}
        <div className="text-center">
          <button
            onClick={handleStartAssessment}
            disabled={selectedSkills.length === 0}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Target className="h-6 w-6 mr-3" />
            Start Assessment
            <ArrowRight className="h-6 w-6 ml-3" />
          </button>
          
          {selectedSkills.length === 0 && (
            <p className="text-red-500 text-sm mt-2">Please select at least one skill to assess</p>
          )}
        </div>

        {/* Assessment Information */}
        <div className="mt-12 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Assessment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">What to Expect:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Questions based on UK exam board standards</li>
                <li>• Automatic marking for objective questions</li>
                <li>• Immediate feedback and results</li>
                <li>• Progress tracking and analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Technical Requirements:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Microphone access for speaking assessments</li>
                <li>• Audio playback for listening assessments</li>
                <li>• Stable internet connection</li>
                <li>• Modern web browser</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
