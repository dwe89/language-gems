'use client';

import { useState } from 'react';
import Link from 'next/link';
import FlagIcon from '@/components/ui/FlagIcon';
import { ArrowLeft, FileText, MessageSquare, User, Home, School, Gamepad2, Utensils, Shirt, Monitor, Heart, Plane, Briefcase, TreePine, PartyPopper, BookOpen, Building2, TrendingUp, Microscope } from 'lucide-react';



interface Theme {
  theme: string;
  topics: string[];
}

const KS4_AQA_THEMES: Theme[] = [
  {
    theme: 'Theme 1: People and lifestyle',
    topics: [
      'Identity and relationships with others',
      'Healthy living and lifestyle',
      'Education and work',
    ],
  },
  {
    theme: 'Theme 2: Popular culture',
    topics: [
      'Free-time activities',
      'Customs, festivals and celebrations',
      'Celebrity culture',
    ],
  },
  {
    theme: 'Theme 3: Communication and the world around us',
    topics: [
      'Travel and tourism, including places of interest',
      'Media and technology',
      'The environment and where people live',
    ],
  },
];

const TOPIC_CONFIGS = {
  ks3: [
    {
      id: 'basics-core-language',
      name: 'Basics & Core Language',
      description: 'Greetings, common phrases, numbers, classroom language, and more',
      icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
      subcategories: [
        'Greetings & Introductions',
        'Common Phrases & Opinions',
        'Numbers, Dates, Time',
        'Colours',
        'Days, Months & Seasons',
        'Classroom Language',
      ],
    },
    {
      id: 'identity-personal-life',
      name: 'Identity & Personal Life',
      description: 'Personal information, family, friends, and pets',
      icon: <User className="h-8 w-8 text-indigo-600" />,
      subcategories: [
        'Personal Information',
        'Family & Friends',
        'Physical & Personality Descriptions',
        'Pets',
      ],
    },
    {
      id: 'home-local-area',
      name: 'Home & Local Area',
      description: 'House, local area, shops, and directions',
      icon: <Home className="h-8 w-8 text-indigo-600" />,
      subcategories: [
        'House, Rooms & Furniture',
        'Household Items & Chores',
        'Types of Housing',
        'Local Area & Places in Town',
        'Shops & Services',
        'Directions & Prepositions',
      ],
    },
    {
      id: 'school-education',
      name: 'School & Education',
      description: 'School subjects, rules, objects, and routines',
      icon: <School className="h-8 w-8 text-indigo-600" />,
      subcategories: [
        'School Subjects & Timetable',
        'School Rules & Opinions',
        'Classroom Objects',
        'Daily Routine at School',
      ],
    },
    {
      id: 'free-time-leisure',
      name: 'Free Time & Leisure',
      description: 'Hobbies, sports, music, and social activities',
      icon: <Gamepad2 className="h-8 w-8 text-indigo-600" />,
      subcategories: [
        'Hobbies & Interests',
        'Sports',
        'Music, TV & Film',
        'Social Activities',
      ],
    },
    {
      id: 'food-drink',
      name: 'Food & Drink',
      description: 'Meals, food vocabulary, shopping, and eating out',
      icon: <Utensils className="h-8 w-8 text-indigo-600" />,
      subcategories: [
        'Meals & Eating Habits',
        'Food & Drink Vocabulary',
        'Ordering in Cafés & Restaurants',
        'Shopping for Food',
      ],
    },
    {
      id: 'clothes-shopping',
      name: 'Clothes & Shopping',
      description: 'Clothes, accessories, and shopping phrases',
      icon: <Shirt className="h-8 w-8 text-indigo-600" />,
      subcategories: [
        'Clothes & Accessories',
        'Shopping Phrases & Prices',
      ],
    },
    {
      id: 'technology-communication',
      name: 'Technology & Communication',
      description: 'Mobile phones, social media, and digital devices',
      icon: <Monitor className="h-8 w-8 text-indigo-600" />,
      subcategories: [
        'Mobile Phones & Social Media',
        'Internet & Digital Devices',
      ],
    },
    {
      id: 'health-lifestyle',
      name: 'Health & Lifestyle',
      description: 'Body, illnesses, doctor, and healthy living',
      icon: <Heart className="h-8 w-8 text-indigo-600" />,
      subcategories: [
        'Parts of the Body',
        'Illnesses & Symptoms',
        'At the Doctors',
        'Healthy Living',
      ],
    },
    {
      id: 'holidays-travel',
      name: 'Holidays & Travel',
      description: 'Countries, transport, accommodation, and weather',
      icon: <Plane className="h-8 w-8 text-indigo-600" />,
      subcategories: [
        'Countries & Nationalities',
        'Transport & Travel Phrases',
        'Accommodation',
        'Holiday Activities',
        'Weather',
      ],
    },
    {
      id: 'jobs-future-plans',
      name: 'Jobs & Future Plans',
      description: 'Professions, ambitions, and job qualities',
      icon: <Briefcase className="h-8 w-8 text-indigo-600" />,
      subcategories: [
        'Professions & Jobs',
        'Future Ambitions',
        'Qualities for Jobs',
      ],
    },
    {
      id: 'nature-environment',
      name: 'Nature & Environment',
      description: 'Animals, weather, environmental problems, and global issues',
      icon: <TreePine className="h-8 w-8 text-indigo-600" />,
      subcategories: [
        'Animals & Plants',
        'Weather & Seasons',
        'Environmental Problems',
        'Global Issues',
      ],
    },
    {
      id: 'culture-festivals',
      name: 'Culture & Festivals',
      description: 'Traditions, festivals, and celebrations in Spanish-speaking countries',
      icon: <PartyPopper className="h-8 w-8 text-indigo-600" />,
      subcategories: [
        'Spanish-speaking Countries & Traditions',
        'Festivals & Celebrations (Christmas, Día de los Muertos, etc.)',
      ],
    },,
  ],
  ks4: KS4_AQA_THEMES, // Now themes, not flat topics
  ks5: [
    { id: 'literature', name: 'Literature', description: 'Literary analysis, authors, and critical thinking', icon: <BookOpen className="h-8 w-8 text-indigo-600" />, resourceCount: 6 },
    { id: 'politics-society', name: 'Politics & Society', description: 'Government, social issues, and civic engagement', icon: <Building2 className="h-8 w-8 text-indigo-600" />, resourceCount: 8 },
    { id: 'business-economics', name: 'Business & Economics', description: 'Commerce, economics, and entrepreneurship', icon: <TrendingUp className="h-8 w-8 text-indigo-600" />, resourceCount: 5 },
    { id: 'science-technology', name: 'Science & Technology', description: 'Innovation, research, and technological advancement', icon: <Microscope className="h-8 w-8 text-indigo-600" />, resourceCount: 7 }
  ]
};

const LANGUAGE_CONFIGS = {
  spanish: { name: 'Spanish', countryCode: 'ES' },
  french: { name: 'French', countryCode: 'FR' },
  german: { name: 'German', countryCode: 'DE' }
};

interface PageProps {
  params: {
    language: string;
    keyStage: string;
  };
}

// Helper function to convert topic names to URL slugs
function getTopicSlug(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

export default function LanguageKeyStage({ params }: PageProps) {
  const { language, keyStage } = params;
  const languageConfig = LANGUAGE_CONFIGS[language as keyof typeof LANGUAGE_CONFIGS];
  const isKS4 = keyStage.toLowerCase() === 'ks4';
  const topicConfigs = TOPIC_CONFIGS[keyStage.toLowerCase() as keyof typeof TOPIC_CONFIGS];

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

  // Only show exam board filter if keyStage is 'KS4'
  const showExamBoardFilter = isKS4;
  const EXAM_BOARD_OPTIONS = ['AQA', 'Edexcel'];
  const [selectedExamBoard, setSelectedExamBoard] = useState<string>('AQA'); // Default to AQA

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-4">
            <Link 
              href={`/resources/${language}`}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {capitalizedLanguage}
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mr-6">
                <FlagIcon
                  countryCode={languageConfig.countryCode}
                  size="lg"
                  className="rounded-full"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {capitalizedLanguage} {keyStageUpper} Resources
                </h1>
                <p className="text-slate-600 mt-2">
                  Professional curriculum-aligned materials for {keyStageUpper} {capitalizedLanguage} students
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Exam Board Filter for KS4 */}
        {showExamBoardFilter && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <label htmlFor="exam-board" className="block text-sm font-medium text-slate-700 mb-2">
                Exam Board
              </label>
              <select
                id="exam-board"
                value={selectedExamBoard}
                onChange={e => setSelectedExamBoard(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {EXAM_BOARD_OPTIONS.map(board => (
                  <option key={board} value={board}>{board}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full">
            {/* Non-KS4 Topics */}
            {!isKS4 && topicConfigs.map((topic: any) => (
              <div
                key={topic.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group border border-slate-200"
              >
                {/* Card Header */}
                <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 relative overflow-hidden">
                  <div className="text-4xl">{topic.icon}</div>
                </div>
                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
                    {topic.name}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">{topic.description}</p>
                  {/* Subcategories List */}
                  {topic.subcategories && (
                    <ul className="mb-4 pl-4 list-disc text-slate-700 text-sm">
                      {topic.subcategories.map((sub: string) => (
                        <li key={sub}>{sub}</li>
                      ))}
                    </ul>
                  )}
                  <div className="flex items-center text-indigo-600 text-sm font-medium">
                    <FileText className="h-4 w-4 mr-1" />
                    <Link href={`/resources/${language}/${keyStage}/${topic.id}`} className="underline hover:text-indigo-800">Explore {topic.name}</Link>
                  </div>
                </div>
              </div>
            ))}
            {/* KS4 Themes/Topics */}
            {isKS4 && selectedExamBoard === 'AQA' && KS4_AQA_THEMES.map((theme, index) => (
              <div key={theme.theme} className="border border-slate-200 rounded-lg p-4 bg-white flex flex-col">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-3 ${
                  index === 0 ? 'bg-pink-100 text-pink-700' :
                  index === 1 ? 'bg-indigo-100 text-indigo-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  Theme {index + 1}
                </div>
                <h3 className="font-semibold text-slate-900 mb-3">{theme.theme}</h3>
                <div className="space-y-2 flex-1">
                  {theme.topics.map((topic, topicIndex) => (
                    <Link
                      key={topic}
                      href={`/resources/${language}/${keyStage}/${getTopicSlug(topic)}`}
                      className="block p-3 rounded-lg border border-slate-100 hover:border-indigo-300 hover:bg-slate-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-700 group-hover:text-indigo-600">
                          {topic}
                        </div>
                        <FileText className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <a
              href={`/resources/${language}/${keyStage}/all`}
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg text-lg font-semibold shadow hover:bg-indigo-700 transition-colors"
            >
              Browse All Resources
            </a>
          </div>
        </div>

        {/* Overview Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            {capitalizedLanguage} {keyStageUpper} Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                {isKS4 ? KS4_AQA_THEMES.length : topicConfigs.length}
              </div>
              <div className="text-slate-600 text-sm">{isKS4 ? 'Themes Covered' : 'Topics Available'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {isKS4 ? KS4_AQA_THEMES.reduce((sum, t) => sum + t.topics.length, 0) : 'Professional'}
              </div>
              <div className="text-slate-600 text-sm">{isKS4 ? 'Total Topics' : 'Quality Materials'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                Curriculum
              </div>
              <div className="text-slate-600 text-sm">Aligned Content</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 