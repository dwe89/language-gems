'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  FileText, 
  Clock, 
  Target,
  ArrowLeft,
  Play,
  Settings,
  Award,
  CheckCircle,
  BookOpen,
  PenTool,
  Headphones,
  MessageSquare
} from 'lucide-react';

export default function ExamStyleAssessmentPage() {
  const [language, setLanguage] = useState('spanish');
  const [level, setLevel] = useState('KS4');
  const [difficulty, setDifficulty] = useState('foundation');
  const [examBoard, setExamBoard] = useState('General');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');

  const examBoards = [
    { id: 'General', name: 'General', description: 'Standard exam-style questions suitable for all boards' },
    { id: 'AQA', name: 'AQA', description: 'AQA style format' },
    { id: 'Edexcel', name: 'Edexcel', description: 'Pearson Edexcel exam format' },
    { id: 'Eduqas', name: 'Eduqas', description: 'Eduqas (WJEC) exam format' }
  ];

  const skillsAssessed = [
    { name: 'Reading', icon: BookOpen, description: 'Text comprehension and analysis' },
    { name: 'Writing', icon: PenTool, description: 'Translation and creative writing' },
    { name: 'Listening', icon: Headphones, description: 'Audio comprehension tasks' },
    { name: 'Speaking', icon: MessageSquare, description: 'Oral communication assessment' }
  ];

  const handleStartAssessment = () => {
    const params = new URLSearchParams({
      language,
      level,
      difficulty,
      examBoard,
      ...(category && { category }),
      ...(subcategory && { subcategory })
    });
    
    window.location.href = `/exam-style-assessment/task?${params.toString()}`;
  };

  return (
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
        {/* Exam Board Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <GraduationCap className="h-6 w-6 mr-2 text-purple-600" />
            Select Exam Board
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Configuration */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Settings className="h-6 w-6 mr-2 text-blue-600" />
            Assessment Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="KS3">KS3 (Years 7-9)</option>
                <option value="KS4">KS4 (Years 10-11)</option>
              </select>
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
                <option value="foundation">Foundation</option>
                <option value="higher">Higher</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Time
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                30-45 minutes
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category (Optional)
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., food_drink, school_life..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory (Optional)
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g., ordering_cafes_restaurants..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Skills Assessed */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Target className="h-6 w-6 mr-2 text-green-600" />
            Skills Assessed
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillsAssessed.map((skill, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <skill.icon className="h-6 w-6 text-gray-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">{skill.name}</h3>
                  <p className="text-sm text-gray-600">{skill.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Features */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Award className="h-6 w-6 mr-2 text-yellow-600" />
            Assessment Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Exam Preparation</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Authentic exam question formats
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Grade boundary predictions
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Exam technique tips
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Mock exam simulation
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Performance Tracking</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  Detailed performance analytics
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  Skill-specific feedback
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  Progress tracking over time
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  Achievement badges and rewards
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={handleStartAssessment}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-lg transition-all flex items-center mx-auto"
          >
            <Play className="h-5 w-5 mr-2" />
            Start {examBoard} Exam Assessment
          </button>
          
          <p className="text-gray-600 text-sm mt-4">
            This assessment will simulate the {examBoard} exam format with authentic question types and timing
          </p>
        </div>
      </div>
    </div>
  );
}
