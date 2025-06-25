'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, FileText, Users, Target } from 'lucide-react';
import FreebiesBreadcrumb from '../../../../components/freebies/FreebiesBreadcrumb';

interface TopicConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  resourceCount: number;
}

// Topic configurations for each key stage
const TOPIC_CONFIGS = {
  ks3: [
    { id: 'identity', name: 'Identity', description: 'Personal information, family, and relationships', icon: '👤', resourceCount: 12 },
    { id: 'school', name: 'School', description: 'Education, subjects, and school life', icon: '🏫', resourceCount: 8 },
    { id: 'free-time', name: 'Free Time', description: 'Hobbies, sports, and leisure activities', icon: '⚽', resourceCount: 15 },
    { id: 'local-area', name: 'Local Area', description: 'Town, directions, and local facilities', icon: '🏘️', resourceCount: 10 },
    { id: 'house-home', name: 'House & Home', description: 'Home, rooms, and household items', icon: '🏠', resourceCount: 9 },
    { id: 'food-drink', name: 'Food & Drink', description: 'Meals, restaurants, and shopping', icon: '🍕', resourceCount: 11 }
  ],
  ks4: [
    { id: 'technology', name: 'Technology', description: 'Social media, internet, and digital life', icon: '💻', resourceCount: 13 },
    { id: 'environment', name: 'Environment', description: 'Climate change, pollution, and sustainability', icon: '🌍', resourceCount: 10 },
    { id: 'travel-tourism', name: 'Travel & Tourism', description: 'Holidays, transport, and cultural exchange', icon: '✈️', resourceCount: 14 },
    { id: 'work-career', name: 'Work & Career', description: 'Jobs, ambitions, and professional life', icon: '💼', resourceCount: 8 },
    { id: 'culture', name: 'Culture', description: 'Festivals, traditions, and cultural identity', icon: '🎭', resourceCount: 12 }
  ],
  ks5: [
    { id: 'literature', name: 'Literature', description: 'Literary analysis, authors, and critical thinking', icon: '📚', resourceCount: 6 },
    { id: 'politics-society', name: 'Politics & Society', description: 'Government, social issues, and civic engagement', icon: '🏛️', resourceCount: 8 },
    { id: 'business-economics', name: 'Business & Economics', description: 'Commerce, economics, and entrepreneurship', icon: '📈', resourceCount: 5 },
    { id: 'science-technology', name: 'Science & Technology', description: 'Innovation, research, and technological advancement', icon: '🔬', resourceCount: 7 }
  ]
};

const LANGUAGE_CONFIGS = {
  spanish: { name: 'Spanish', flag: '🇪🇸', color: 'from-red-500 to-yellow-500' },
  french: { name: 'French', flag: '🇫🇷', color: 'from-blue-500 to-white' },
  german: { name: 'German', flag: '🇩🇪', color: 'from-black to-red-500' },
  italian: { name: 'Italian', flag: '🇮🇹', color: 'from-green-500 to-red-500' }
};

interface PageProps {
  params: {
    language: string;
    keyStage: string;
  };
}

export default function LanguageKeyStage({ params }: PageProps) {
  const { language, keyStage } = params;
  
  const languageConfig = LANGUAGE_CONFIGS[language as keyof typeof LANGUAGE_CONFIGS];
  const topicConfigs = TOPIC_CONFIGS[keyStage as keyof typeof TOPIC_CONFIGS];
  
  if (!languageConfig || !topicConfigs) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
          <Link href="/resources" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  const capitalizedLanguage = languageConfig.name;
  const keyStageUpper = keyStage.toUpperCase();
  
  const breadcrumbItems = [
    { label: 'Resources', href: '/resources' },
    { label: capitalizedLanguage, href: `/resources/${language}` },
    { label: keyStageUpper, active: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FreebiesBreadcrumb items={breadcrumbItems} />
          
          <div className="flex items-center mb-4">
            <Link 
              href={`/resources/${language}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {capitalizedLanguage}
            </Link>
          </div>
          
          <div className="flex items-center mb-6">
            <div className={`w-16 h-16 bg-gradient-to-r ${languageConfig.color} rounded-xl flex items-center justify-center text-2xl mr-6 shadow-lg`}>
              {languageConfig.flag}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {capitalizedLanguage} {keyStageUpper} Resources
              </h1>
              <p className="text-gray-600 mt-2">
                Curriculum-aligned resources for {keyStageUpper} {capitalizedLanguage} students
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topicConfigs.map((topic) => (
            <Link
              key={topic.id}
              href={`/resources/${language}/${keyStage}/${topic.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4">{topic.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{topic.name}</h3>
                  <p className="text-sm text-gray-500">{topic.resourceCount} resources</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{topic.description}</p>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                <FileText className="h-4 w-4 mr-1" />
                View Resources
              </div>
            </Link>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {capitalizedLanguage} {keyStageUpper} Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {topicConfigs.length}
              </div>
              <div className="text-gray-600">Topics Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {topicConfigs.reduce((sum, topic) => sum + topic.resourceCount, 0)}
              </div>
              <div className="text-gray-600">Total Resources</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                FREE
              </div>
              <div className="text-gray-600">All Resources</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 