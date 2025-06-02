'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Mock data for topics based on theme
const topicsByTheme = {
  Theme1: [
    { id: '1', name: 'Identity and relationships with others', description: 'Family, friends, relationships and personal information.' },
    { id: '2', name: 'Healthy living and lifestyle', description: 'Diet, exercise, health, well-being and daily routines.' },
    { id: '3', name: 'Education and work', description: 'School subjects, facilities, future plans and careers.' }
  ],
  Theme2: [
    { id: '4', name: 'Free-time activities', description: 'Sports, hobbies, entertainment and leisure activities.' },
    { id: '5', name: 'Customs, festivals and celebrations', description: 'Holidays, traditions, cultural events and celebrations.' },
    { id: '6', name: 'Celebrity culture', description: 'Famous people, media influence and role models.' }
  ],
  Theme3: [
    { id: '7', name: 'Travel and tourism, including places of interest', description: 'Transport, accommodation, destinations and travel experiences.' },
    { id: '8', name: 'Media and technology', description: 'Social media, devices, digital world and communication.' },
    { id: '9', name: 'The environment and where people live', description: 'Climate change, conservation, homes and local area.' }
  ]
};

export default function ThemePage() {
  const router = useRouter();
  const params = useParams<{ examBoard: string; level: string; theme: string }>();
  const { examBoard = '', level = '', theme = '' } = params || {};
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Get the theme topics
  const topics = topicsByTheme[theme as keyof typeof topicsByTheme] || [];

  // Get the theme name
  const getThemeName = (code: string): string => {
    switch (code) {
      case 'Theme1': return 'Theme 1: People and lifestyle';
      case 'Theme2': return 'Theme 2: Popular culture';
      case 'Theme3': return 'Theme 3: Communication and the world around us';
      default: return code;
    }
  };

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    router.push(`/exams/${examBoard}/${level}/${theme}/${topicId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <button
          onClick={() => router.push(`/exams/${examBoard}/${level}`)}
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
          Back to Themes
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">
        {getThemeName(theme)}
      </h1>
      
      <p className="text-center mb-8 text-gray-600">
        Select a topic to explore assessments
      </p>
      
      <div className="space-y-6 max-w-4xl mx-auto">
        {topics.map((topic) => (
          <div 
            key={topic.id}
            className={`rounded-lg border p-6 hover:shadow-lg transition-all cursor-pointer ${
              selectedTopic === topic.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => handleTopicSelect(topic.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{topic.name}</h2>
            </div>
            
            <p className="text-gray-600 mb-4">{topic.description}</p>
            
            <div className="mt-4 flex justify-end space-x-4">
              <button 
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/exams/${examBoard}/${level}/${theme}/${topic.id}/vocabulary`);
                }}
              >
                Vocabulary
              </button>
              <button 
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/exams/${examBoard}/${level}/${theme}/${topic.id}/grammar`);
                }}
              >
                Grammar
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTopicSelect(topic.id);
                }}
              >
                Assessments
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 