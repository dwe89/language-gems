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
  { id: 'italian', name: 'Italian', description: 'Italian language learning materials', resourceCount: 15 }
];

const KEY_STAGES: CurriculumLevel[] = [
  { id: 'ks3', name: 'KS3 (Years 7-9)', description: 'Foundation level resources', resourceCount: 67 },
  { id: 'ks4', name: 'KS4 (Years 10-11)', description: 'GCSE preparation materials', resourceCount: 45 },
  { id: 'ks5', name: 'KS5 (Years 12-13)', description: 'A-Level resources', resourceCount: 15 }
];

const TOPICS: Record<string, Topic[]> = {
  ks3: [
    { id: 'identity', name: 'Identity & Family', description: 'Personal information, family members, relationships', resourceCount: 12, icon: <Users className="h-5 w-5" /> },
    { id: 'school', name: 'School Life', description: 'Subjects, facilities, school routines', resourceCount: 8, icon: <Book className="h-5 w-5" /> },
    { id: 'free-time', name: 'Free Time & Hobbies', description: 'Sports, music, entertainment, leisure activities', resourceCount: 10, icon: <Globe className="h-5 w-5" /> },
    { id: 'local-area', name: 'Local Area', description: 'Towns, directions, transport, shopping', resourceCount: 9, icon: <Globe className="h-5 w-5" /> },
    { id: 'house-home', name: 'House & Home', description: 'Rooms, furniture, household items', resourceCount: 7, icon: <Globe className="h-5 w-5" /> },
    { id: 'food-drink', name: 'Food & Drink', description: 'Meals, restaurants, healthy eating', resourceCount: 8, icon: <Globe className="h-5 w-5" /> }
  ],
  ks4: [
    { id: 'technology', name: 'Technology & Social Media', description: 'Digital communication, online safety', resourceCount: 6, icon: <Globe className="h-5 w-5" /> },
    { id: 'environment', name: 'Environment & Global Issues', description: 'Climate change, conservation, social problems', resourceCount: 8, icon: <Globe className="h-5 w-5" /> },
    { id: 'travel-tourism', name: 'Travel & Tourism', description: 'Holidays, transport, cultural experiences', resourceCount: 7, icon: <Globe className="h-5 w-5" /> },
    { id: 'work-career', name: 'Work & Career', description: 'Jobs, work experience, future plans', resourceCount: 9, icon: <Globe className="h-5 w-5" /> },
    { id: 'culture', name: 'Culture & Festivals', description: 'Traditions, celebrations, cultural differences', resourceCount: 6, icon: <Globe className="h-5 w-5" /> }
  ],
  ks5: [
    { id: 'literature', name: 'Literature & Arts', description: 'Literary analysis, cultural movements', resourceCount: 5, icon: <Book className="h-5 w-5" /> },
    { id: 'politics-society', name: 'Politics & Society', description: 'Government, social issues, current affairs', resourceCount: 4, icon: <Globe className="h-5 w-5" /> },
    { id: 'business-economics', name: 'Business & Economics', description: 'Commercial language, economic concepts', resourceCount: 3, icon: <Globe className="h-5 w-5" /> },
    { id: 'science-technology', name: 'Science & Technology', description: 'Advanced technical vocabulary', resourceCount: 3, icon: <Globe className="h-5 w-5" /> }
  ]
};

export default function CurriculumNavigator({ onReturnToHub }: CurriculumNavigatorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedKeyStage, setSelectedKeyStage] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId);
    setSelectedKeyStage(null);
    setBreadcrumb([LANGUAGES.find(l => l.id === languageId)?.name || '']);
  };

  const handleKeyStageSelect = (keyStageId: string) => {
    setSelectedKeyStage(keyStageId);
    const keyStage = KEY_STAGES.find(ks => ks.id === keyStageId);
    setBreadcrumb(prev => [...prev.slice(0, 1), keyStage?.name || '']);
  };

  const handleTopicSelect = (topicId: string) => {
    const topic = TOPICS[selectedKeyStage || '']?.find(t => t.id === topicId);
    if (topic && selectedLanguage && selectedKeyStage) {
      // Navigate to specific topic page
      window.location.href = `/resources/${selectedLanguage}/${selectedKeyStage}/${topicId}`;
    }
  };

  const resetToLanguages = () => {
    setSelectedLanguage(null);
    setSelectedKeyStage(null);
    setBreadcrumb([]);
  };

  const resetToKeyStages = () => {
    setSelectedKeyStage(null);
    setBreadcrumb(prev => prev.slice(0, 1));
  };

  const renderBreadcrumb = () => (
    <div className="flex items-center space-x-2 mb-6 text-sm">
      <button
        onClick={onReturnToHub}
        className="text-indigo-600 hover:text-indigo-700 font-medium"
      >
        Resources Hub
      </button>
      <ChevronRight className="h-4 w-4 text-slate-400" />
      <span className="text-slate-600">Curriculum View</span>
      {breadcrumb.map((crumb, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-slate-400" />
          <button
            onClick={() => {
              if (index === 0) resetToKeyStages();
              else if (index === 1) resetToLanguages();
            }}
            className={`${index === breadcrumb.length - 1 ? 'text-slate-800 font-medium' : 'text-indigo-600 hover:text-indigo-700'}`}
          >
            {crumb}
          </button>
        </React.Fragment>
      ))}
    </div>
  );

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

      {/* Breadcrumb */}
      {breadcrumb.length > 0 && renderBreadcrumb()}

      {/* Language Selection */}
      {!selectedLanguage && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      )}

      {/* Key Stage Selection */}
      {selectedLanguage && !selectedKeyStage && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {KEY_STAGES.map((keyStage) => (
            <button
              key={keyStage.id}
              onClick={() => handleKeyStageSelect(keyStage.id)}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 text-left group"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600">
                  {keyStage.name}
                </h3>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-500" />
              </div>
              <p className="text-slate-600 mb-3">
                {keyStage.description}
              </p>
              <div className="text-sm text-indigo-600 font-medium">
                {keyStage.resourceCount} resources available
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Topic Selection */}
      {selectedLanguage && selectedKeyStage && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-800">Topics</h3>
            <Link
              href={`/resources/${selectedLanguage}/${selectedKeyStage}`}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <Search className="h-4 w-4 mr-2" />
              Search All Resources
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOPICS[selectedKeyStage]?.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(topic.id)}
                className="bg-white rounded-xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 text-left group"
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-indigo-100 rounded-lg mr-3 group-hover:bg-indigo-200">
                    {topic.icon}
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 flex-1">
                    {topic.name}
                  </h4>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-500" />
                </div>
                <p className="text-slate-600 mb-3 text-sm">
                  {topic.description}
                </p>
                <div className="text-sm text-indigo-600 font-medium">
                  {topic.resourceCount} resources
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 