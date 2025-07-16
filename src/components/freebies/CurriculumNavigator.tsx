import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Book, Users, Globe, ArrowLeft, Search } from 'lucide-react';

interface CurriculumLevel {
  id: string;
  name: string;
  description: string;
  resourceCount: number;
}

interface Topic {
  id: string;
  name: string;
  description: string;
  resourceCount: number;
  icon: React.ReactNode;
}

interface CurriculumNavigatorProps {
  onReturnToHub: () => void;
}

const LANGUAGES: CurriculumLevel[] = [
  { id: 'spanish', name: 'Spanish', description: 'Comprehensive Spanish language resources', resourceCount: 45 },
  { id: 'french', name: 'French', description: 'Complete French curriculum materials', resourceCount: 38 },
  { id: 'german', name: 'German', description: 'Structured German learning resources', resourceCount: 29 },
];

const KEY_STAGES: CurriculumLevel[] = [
  { id: 'ks3', name: 'KS3 (Years 7-9)', description: 'Foundation level resources', resourceCount: 67 },
  { id: 'ks4', name: 'KS4 (Years 10-11)', description: 'GCSE preparation materials', resourceCount: 45 },
  { id: 'ks5', name: 'KS5 (Years 12-13)', description: 'A-Level resources', resourceCount: 15 }
];

const TOPICS: Record<string, Topic[]> = {
  ks3: [
    { id: 'basics-core-language', name: 'Basics & Core Language', description: 'Greetings, common phrases, numbers, classroom language, and more', resourceCount: 10, icon: <Users className="h-5 w-5" /> },
    { id: 'identity-personal-life', name: 'Identity & Personal Life', description: 'Personal information, family, friends, and pets', resourceCount: 10, icon: <Users className="h-5 w-5" /> },
    { id: 'home-local-area', name: 'Home & Local Area', description: 'House, local area, shops, and directions', resourceCount: 10, icon: <Globe className="h-5 w-5" /> },
    { id: 'school-education', name: 'School & Education', description: 'School subjects, rules, objects, and routines', resourceCount: 10, icon: <Book className="h-5 w-5" /> },
    { id: 'free-time-leisure', name: 'Free Time & Leisure', description: 'Hobbies, sports, music, and social activities', resourceCount: 10, icon: <Globe className="h-5 w-5" /> },
    { id: 'food-drink', name: 'Food & Drink', description: 'Meals, food vocabulary, shopping, and eating out', resourceCount: 10, icon: <Globe className="h-5 w-5" /> },
    { id: 'clothes-shopping', name: 'Clothes & Shopping', description: 'Clothes, accessories, and shopping phrases', resourceCount: 10, icon: <Globe className="h-5 w-5" /> },
    { id: 'technology-communication', name: 'Technology & Communication', description: 'Mobile phones, social media, and digital devices', resourceCount: 10, icon: <Globe className="h-5 w-5" /> },
    { id: 'health-lifestyle', name: 'Health & Lifestyle', description: 'Body, illnesses, doctor, and healthy living', resourceCount: 10, icon: <Globe className="h-5 w-5" /> },
    { id: 'holidays-travel', name: 'Holidays & Travel', description: 'Countries, transport, accommodation, and weather', resourceCount: 10, icon: <Globe className="h-5 w-5" /> },
    { id: 'jobs-future-plans', name: 'Jobs & Future Plans', description: 'Professions, ambitions, and job qualities', resourceCount: 10, icon: <Globe className="h-5 w-5" /> },
    { id: 'nature-environment', name: 'Nature & Environment', description: 'Animals, weather, environmental problems, and global issues', resourceCount: 10, icon: <Globe className="h-5 w-5" /> },
    { id: 'culture-festivals', name: 'Culture & Festivals', description: 'Traditions, festivals, and celebrations in Spanish-speaking countries', resourceCount: 10, icon: <Globe className="h-5 w-5" /> },
  ],
  ks4: [
    { id: 'identity-and-relationships-with-others', name: 'Identity and relationships with others', description: 'Personal identity, family, friends, and social relationships', resourceCount: 8, icon: <Users className="h-5 w-5" /> },
    { id: 'healthy-living-and-lifestyle', name: 'Healthy living and lifestyle', description: 'Health, fitness, diet, and lifestyle choices', resourceCount: 7, icon: <Globe className="h-5 w-5" /> },
    { id: 'education-and-work', name: 'Education and work', description: 'School life, career choices, and work experience', resourceCount: 9, icon: <Book className="h-5 w-5" /> },
    { id: 'free-time-activities', name: 'Free-time activities', description: 'Hobbies, sports, entertainment, and leisure', resourceCount: 10, icon: <Globe className="h-5 w-5" /> },
    { id: 'customs-festivals-and-celebrations', name: 'Customs, festivals and celebrations', description: 'Traditions, cultural events, and celebrations', resourceCount: 6, icon: <Globe className="h-5 w-5" /> },
    { id: 'celebrity-culture', name: 'Celebrity culture', description: 'Famous people, media, and popular culture', resourceCount: 5, icon: <Globe className="h-5 w-5" /> },
    { id: 'travel-and-tourism-including-places-of-interest', name: 'Travel and tourism, including places of interest', description: 'Holidays, transport, destinations, and tourist attractions', resourceCount: 8, icon: <Globe className="h-5 w-5" /> },
    { id: 'media-and-technology', name: 'Media and technology', description: 'Digital communication, social media, and modern technology', resourceCount: 7, icon: <Globe className="h-5 w-5" /> },
    { id: 'the-environment-and-where-people-live', name: 'The environment and where people live', description: 'Environmental issues, housing, and local areas', resourceCount: 9, icon: <Globe className="h-5 w-5" /> }
  ],
  ks5: [
    { id: 'literature', name: 'Literature & Arts', description: 'Literary analysis, cultural movements', resourceCount: 5, icon: <Book className="h-5 w-5" /> },
    { id: 'politics-society', name: 'Politics & Society', description: 'Government, social issues, current affairs', resourceCount: 4, icon: <Globe className="h-5 w-5" /> },
    { id: 'business-economics', name: 'Business & Economics', description: 'Commercial language, economic concepts', resourceCount: 3, icon: <Globe className="h-5 w-5" /> },
    { id: 'science-technology', name: 'Science & Technology', description: 'Advanced technical vocabulary', resourceCount: 3, icon: <Globe className="h-5 w-5" /> }
  ]
};

export default function CurriculumNavigator({ onReturnToHub }: CurriculumNavigatorProps) {
  const handleLanguageSelect = (languageId: string) => {
    // Navigate directly to the language page
    window.location.href = `/resources/${languageId}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <button
          onClick={onReturnToHub}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Resources Hub
        </button>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Browse by Curriculum
        </h2>
        <p className="text-xl text-slate-600">
          Find resources organized by language, key stage, and topic
        </p>
      </div>

      {/* Language Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LANGUAGES.map((language) => (
          <button
            key={language.id}
            onClick={() => handleLanguageSelect(language.id)}
            className="bg-white rounded-xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 text-left group"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600">
                {language.name}
              </h3>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-500" />
            </div>
            <p className="text-slate-600 mb-3">
              {language.description}
            </p>
            <div className="text-sm text-indigo-600 font-medium">
              {language.resourceCount} resources available
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 