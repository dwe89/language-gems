'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ThemeCategory } from '../../types';

// Mock data for themes based on AQA GCSE
const themes = [
  {
    id: '1',
    name: 'Theme 1: People and lifestyle',
    code: 'Theme1',
    description: 'Identity and relationships with others, Healthy living and lifestyle, Education and work',
    topics: [
      { id: '1', name: 'Identity and relationships with others', description: 'Family, friends, relationships' },
      { id: '2', name: 'Healthy living and lifestyle', description: 'Diet, exercise, health' },
      { id: '3', name: 'Education and work', description: 'School, future plans, careers' }
    ]
  },
  {
    id: '2',
    name: 'Theme 2: Popular culture',
    code: 'Theme2',
    description: 'Free-time activities, Customs, festivals and celebrations, Celebrity culture',
    topics: [
      { id: '4', name: 'Free-time activities', description: 'Sports, hobbies, entertainment' },
      { id: '5', name: 'Customs, festivals and celebrations', description: 'Holidays, traditions, events' },
      { id: '6', name: 'Celebrity culture', description: 'Famous people, media, influence' }
    ]
  },
  {
    id: '3',
    name: 'Theme 3: Communication and the world around us',
    code: 'Theme3',
    description: 'Travel and tourism including places of interest, Media and technology, The environment and where people live',
    topics: [
      { id: '7', name: 'Travel and tourism, including places of interest', description: 'Transport, accommodation, destinations' },
      { id: '8', name: 'Media and technology', description: 'Social media, devices, digital world' },
      { id: '9', name: 'The environment and where people live', description: 'Climate change, conservation, homes' }
    ]
  }
];

export default function EducationLevelPage() {
  const router = useRouter();
  const params = useParams<{ examBoard: string; level: string }>();
  const { examBoard = '', level = '' } = params || {};
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  // Get the level name to display in the title
  const getLevelName = (code: string): string => {
    switch (code) {
      case 'primary': return 'Primary';
      case 'ks3': return 'KS3';
      case 'ks4_gcse': return 'GCSE';
      case 'ks5_alevel': return 'A-Level';
      default: return code.toUpperCase();
    }
  };

  // Get the exam board name
  const getExamBoardName = (code: string): string => {
    switch (code) {
      case 'aqa': return 'AQA';
      case 'edexcel': return 'Edexcel';
      case 'ocr': return 'OCR';
      case 'wjec': return 'WJEC';
      case 'cie': return 'CIE';
      default: return code.toUpperCase();
    }
  };

  const handleThemeSelect = (themeCode: string) => {
    setSelectedTheme(themeCode);
    router.push(`/exams/${examBoard}/${level}/${themeCode}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <button
          onClick={() => router.push(`/exams/${examBoard}`)}
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Education Levels
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">
        {getExamBoardName(examBoard)} {getLevelName(level)} Themes
      </h1>
      
      <p className="text-center mb-8 text-gray-600">
        Select a theme to explore topics and assessments
      </p>
      
      <div className="space-y-6 max-w-4xl mx-auto">
        {themes.map((theme) => (
          <div 
            key={theme.id}
            className={`rounded-lg border p-6 hover:shadow-lg transition-all cursor-pointer ${
              selectedTheme === theme.code ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => handleThemeSelect(theme.code)}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{theme.name}</h2>
            </div>
            
            <p className="text-gray-600 mb-4">{theme.description}</p>
            
            <div className="mt-2">
              <h3 className="font-medium text-gray-700 mb-2">Topics:</h3>
              <ul className="list-disc pl-5 text-sm text-gray-600">
                {theme.topics.map((topic) => (
                  <li key={topic.id}>{topic.name}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleThemeSelect(theme.code);
                }}
              >
                Explore Theme
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 