'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EducationLevel } from '../types';

// Mock data for education levels
const educationLevels = [
  {
    id: '1',
    name: 'Primary',
    code: 'primary',
    description: 'Primary education for ages 5-11'
  },
  {
    id: '2',
    name: 'KS3',
    code: 'ks3',
    description: 'Key Stage 3 education for ages 11-14'
  },
  {
    id: '3',
    name: 'KS4 GCSE',
    code: 'ks4_gcse',
    description: 'GCSE preparation for ages 14-16'
  },
  {
    id: '4',
    name: 'KS5 A Level',
    code: 'ks5_alevel',
    description: 'A-Level preparation for ages 16-18'
  }
];

export default function ExamBoardPage() {
  const router = useRouter();
  const params = useParams<{ examBoard: string }>();
  const examBoard = params?.examBoard || '';
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // Get the exam board name to display in the title
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

  const handleLevelSelect = (levelCode: string) => {
    setSelectedLevel(levelCode);
    router.push(`/exams/${examBoard}/${levelCode}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <button
          onClick={() => router.push('/exams')}
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
          Back to Exam Boards
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">
        {getExamBoardName(examBoard)} Educational Levels
      </h1>
      
      <p className="text-center mb-8 text-gray-600">
        Select the educational level you are teaching or preparing for
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {educationLevels.map((level) => (
          <div 
            key={level.id}
            className={`rounded-lg border p-6 hover:shadow-lg transition-all cursor-pointer ${
              selectedLevel === level.code ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => handleLevelSelect(level.code)}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{level.name}</h2>
            </div>
            
            <p className="text-gray-600 text-sm">{level.description}</p>
            
            <div className="mt-4 flex justify-end">
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLevelSelect(level.code);
                }}
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 