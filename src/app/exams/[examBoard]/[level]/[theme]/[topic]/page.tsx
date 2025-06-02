'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AssessmentType } from '../../../../types';

// Topic names map
const topicNames: Record<string, string> = {
  '1': 'Identity and relationships with others',
  '2': 'Healthy living and lifestyle',
  '3': 'Education and work',
  '4': 'Free-time activities',
  '5': 'Customs, festivals and celebrations',
  '6': 'Celebrity culture',
  '7': 'Travel and tourism, including places of interest',
  '8': 'Media and technology',
  '9': 'The environment and where people live'
};

// Assessment types
const assessmentTypes = [
  {
    id: '1',
    type: 'Reading',
    description: 'Reading comprehension tests your ability to understand written text and answer questions about it.',
    icon: '📚',
    difficulty: ['Foundation', 'Higher']
  },
  {
    id: '2',
    type: 'Writing',
    description: 'Writing exercises test your ability to produce written text in the target language.',
    icon: '✏️',
    difficulty: ['Foundation', 'Higher']
  },
  {
    id: '3',
    type: 'Speaking',
    description: 'Speaking assessments test your ability to communicate orally in the target language.',
    icon: '🗣️',
    difficulty: ['Foundation', 'Higher']
  },
  {
    id: '4',
    type: 'Listening',
    description: 'Listening comprehension tests your ability to understand spoken language.',
    icon: '👂',
    difficulty: ['Foundation', 'Higher']
  }
];

export default function TopicPage() {
  const router = useRouter();
  const params = useParams<{ examBoard: string; level: string; theme: string; topic: string }>();
  const { examBoard = '', level = '', theme = '', topic = '' } = params || {};
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Foundation' | 'Higher'>('Foundation');

  // Get the topic name
  const topicName = topicNames[topic] || 'Unknown Topic';

  // Get the theme name
  const getThemeName = (code: string): string => {
    switch (code) {
      case 'Theme1': return 'Theme 1: People and lifestyle';
      case 'Theme2': return 'Theme 2: Popular culture';
      case 'Theme3': return 'Theme 3: Communication and the world around us';
      default: return code;
    }
  };

  const handleAssessmentSelect = (assessmentType: string) => {
    setSelectedAssessment(assessmentType);
    router.push(`/exams/${examBoard}/${level}/${theme}/${topic}/${assessmentType.toLowerCase()}?difficulty=${selectedDifficulty.toLowerCase()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <button
          onClick={() => router.push(`/exams/${examBoard}/${level}/${theme}`)}
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
          Back to Topics
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-2 text-center">
        {topicName}
      </h1>
      
      <p className="text-center mb-2 text-gray-600">
        {getThemeName(theme)}
      </p>
      
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
              selectedDifficulty === 'Foundation'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedDifficulty('Foundation')}
          >
            Foundation
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border rounded-r-lg ${
              selectedDifficulty === 'Higher'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedDifficulty('Higher')}
          >
            Higher
          </button>
        </div>
      </div>
      
      <p className="text-center mb-8 text-gray-600">
        Select an assessment type to begin
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {assessmentTypes.map((assessment) => (
          <div 
            key={assessment.id}
            className={`rounded-lg border p-6 hover:shadow-lg transition-all cursor-pointer ${
              selectedAssessment === assessment.type ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => handleAssessmentSelect(assessment.type)}
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{assessment.icon}</span>
              <h2 className="text-xl font-semibold">{assessment.type}</h2>
            </div>
            
            <p className="text-gray-600 mb-4">{assessment.description}</p>
            
            <div className="mt-4 flex justify-end">
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAssessmentSelect(assessment.type);
                }}
              >
                Start {assessment.type}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 