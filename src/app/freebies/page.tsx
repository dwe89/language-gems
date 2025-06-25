'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/auth/AuthProvider';
import CurriculumNavigator from '../../components/freebies/CurriculumNavigator';
import FreebiesNavTabs from '../../components/freebies/FreebiesNavTabs';
import FreebiesBreadcrumb from '../../components/freebies/FreebiesBreadcrumb';
import { 
  Download, Search, Filter, Star, BookOpen, Users, 
  GraduationCap, Globe, Music, Home, MapPin, Laptop,
  Leaf, Plane, School, User, Calculator, Clock,
  FileText, Gift, Lock, CheckCircle
} from 'lucide-react';

interface WorksheetCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  worksheets: Worksheet[];
}

interface Worksheet {
  id: string;
  title: string;
  description: string;
  yearGroups: string[];
  language: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  pages: number;
  fileType: 'PDF';
  downloadUrl: string;
  featured?: boolean;
  premium?: boolean;
}

const YEAR_GROUPS = [
  'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 
  'Year 12', 'Year 13', 'KS3', 'KS4', 'KS5'
];

const LANGUAGES = ['Spanish', 'French', 'German', 'Italian', 'All Languages'];

export default function FreebiesPage() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'hub' | 'curriculum'>('hub');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYearGroup, setSelectedYearGroup] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Mock data - in production this would come from your database
  const categories: WorksheetCategory[] = [
    {
      id: 'themes',
      name: 'Themed Worksheets',
      icon: <Globe className="h-6 w-6" />,
      description: 'Topic-based vocabulary and conversation practice',
      worksheets: [
        {
          id: 'house-home',
          title: 'House and Home - Vocabulary Builder',
          description: 'Essential vocabulary for describing your house, rooms, and furniture. Includes exercises on prepositions and house descriptions.',
          yearGroups: ['Year 7', 'Year 8', 'KS3'],
          language: 'Spanish',
          level: 'Beginner',
          pages: 4,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/house-home-spanish.pdf',
          featured: true
        },
        {
          id: 'local-area',
          title: 'My Local Area - Places and Directions',
          description: 'Learn to describe your town, give directions, and talk about local amenities. Perfect for GCSE preparation.',
          yearGroups: ['Year 9', 'Year 10', 'Year 11', 'KS4'],
          language: 'Spanish',
          level: 'Intermediate',
          pages: 6,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/local-area-spanish.pdf'
        },
        {
          id: 'music-entertainment',
          title: 'Music and Entertainment',
          description: 'Vocabulary and phrases for discussing music, films, TV shows, and entertainment preferences.',
          yearGroups: ['Year 8', 'Year 9', 'Year 10'],
          language: 'French',
          level: 'Intermediate',
          pages: 5,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/music-entertainment-french.pdf'
        },
        {
          id: 'technology',
          title: 'Technology in Daily Life',
          description: 'Modern vocabulary for smartphones, social media, and digital communication.',
          yearGroups: ['Year 9', 'Year 10', 'Year 11'],
          language: 'German',
          level: 'Intermediate',
          pages: 4,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/technology-german.pdf',
          featured: true
        },
        {
          id: 'free-time',
          title: 'Free Time Activities and Hobbies',
          description: 'Express your interests and talk about leisure activities with confidence.',
          yearGroups: ['Year 7', 'Year 8', 'Year 9'],
          language: 'Spanish',
          level: 'Beginner',
          pages: 5,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/free-time-spanish.pdf'
        },
        {
          id: 'environment',
          title: 'The Environment and Climate Change',
          description: 'Essential vocabulary for discussing environmental issues and climate change.',
          yearGroups: ['Year 10', 'Year 11', 'Year 12'],
          language: 'Spanish',
          level: 'Advanced',
          pages: 7,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/environment-spanish.pdf'
        },
        {
          id: 'holidays',
          title: 'Holidays and Travel',
          description: 'Everything you need for booking trips, describing holidays, and travel experiences.',
          yearGroups: ['Year 8', 'Year 9', 'Year 10'],
          language: 'French',
          level: 'Intermediate',
          pages: 6,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/holidays-french.pdf'
        },
        {
          id: 'school-education',
          title: 'School and Education',
          description: 'Vocabulary for subjects, school facilities, and education systems.',
          yearGroups: ['Year 7', 'Year 8', 'KS3'],
          language: 'German',
          level: 'Beginner',
          pages: 4,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/school-german.pdf'
        },
        {
          id: 'all-about-me',
          title: 'All About Me - Identity and Personality',
          description: 'Describe yourself, your family, and personality traits.',
          yearGroups: ['Year 7', 'Year 8'],
          language: 'Spanish',
          level: 'Beginner',
          pages: 3,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/identity-spanish.pdf',
          featured: true
        }
      ]
    },
    {
      id: 'grammar',
      name: 'Grammar Essentials',
      icon: <BookOpen className="h-6 w-6" />,
      description: 'Structured grammar practice and reference sheets',
      worksheets: [
        {
          id: 'numbers-1-10',
          title: 'Numbers 1-10 Practice Pack',
          description: 'Complete practice set for numbers 1-10 with pronunciation guide and exercises.',
          yearGroups: ['Year 7', 'KS3'],
          language: 'All Languages',
          level: 'Beginner',
          pages: 3,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/numbers-1-10.pdf'
        },
        {
          id: 'numbers-1-50',
          title: 'Numbers 1-50 Mastery',
          description: 'Extended number practice including patterns, calculations, and real-world applications.',
          yearGroups: ['Year 7', 'Year 8'],
          language: 'Spanish',
          level: 'Beginner',
          pages: 5,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/numbers-1-50-spanish.pdf'
        },
        {
          id: 'numbers-1-100',
          title: 'Numbers 1-100 Complete Guide',
          description: 'Comprehensive number practice with complex calculations and advanced exercises.',
          yearGroups: ['Year 8', 'Year 9'],
          language: 'French',
          level: 'Intermediate',
          pages: 6,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/numbers-1-100-french.pdf'
        },
        {
          id: 'ser-vs-estar',
          title: 'Ser vs Estar - Complete Guide',
          description: 'Master the difference between ser and estar with clear explanations and practice exercises.',
          yearGroups: ['Year 9', 'Year 10', 'Year 11'],
          language: 'Spanish',
          level: 'Intermediate',
          pages: 8,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/ser-estar-spanish.pdf'
        },
        {
          id: 'present-tense-regular',
          title: 'Present Tense - Regular Verbs',
          description: 'Foundation worksheet for regular present tense verb conjugations.',
          yearGroups: ['Year 7', 'Year 8'],
          language: 'Spanish',
          level: 'Beginner',
          pages: 4,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/present-regular-spanish.pdf'
        },
        {
          id: 'past-tense-intro',
          title: 'Past Tense Introduction',
          description: 'Introduction to past tense forms with common irregular verbs.',
          yearGroups: ['Year 9', 'Year 10'],
          language: 'French',
          level: 'Intermediate',
          pages: 7,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/past-tense-french.pdf'
        },
        {
          id: 'adjective-agreement',
          title: 'Adjective Agreement Rules',
          description: 'Complete guide to adjective agreement including position and exceptions.',
          yearGroups: ['Year 8', 'Year 9', 'Year 10'],
          language: 'French',
          level: 'Intermediate',
          pages: 5,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/adjectives-french.pdf'
        }
      ]
    },
    {
      id: 'exam-prep',
      name: 'Exam Preparation',
      icon: <GraduationCap className="h-6 w-6" />,
      description: 'GCSE and A-Level focused materials',
      worksheets: [
        {
          id: 'gcse-speaking-prep',
          title: 'GCSE Speaking Exam Preparation',
          description: 'Practice questions and model answers for the GCSE Spanish speaking exam.',
          yearGroups: ['Year 10', 'Year 11', 'KS4'],
          language: 'Spanish',
          level: 'Intermediate',
          pages: 12,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/gcse-speaking-spanish.pdf',
          premium: true
        },
        {
          id: 'photo-card-practice',
          title: 'Photo Card Description Practice',
          description: 'Sample photo cards with vocabulary and phrases for exam preparation.',
          yearGroups: ['Year 10', 'Year 11'],
          language: 'French',
          level: 'Intermediate',
          pages: 8,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/photo-cards-french.pdf',
          premium: true
        },
        {
          id: 'role-play-scenarios',
          title: 'Role Play Scenarios',
          description: 'Common role play situations with helpful phrases and responses.',
          yearGroups: ['Year 9', 'Year 10', 'Year 11'],
          language: 'German',
          level: 'Intermediate',
          pages: 10,
          fileType: 'PDF',
          downloadUrl: '/freebies/downloads/role-play-german.pdf',
          premium: true
        }
      ]
    }
  ];

  const getAllWorksheets = () => {
    return categories.flatMap(cat => cat.worksheets);
  };

  const getFilteredWorksheets = () => {
    let worksheets = getAllWorksheets();

    if (selectedCategory) {
      const category = categories.find(cat => cat.id === selectedCategory);
      worksheets = category ? category.worksheets : [];
    }

    if (searchTerm) {
      worksheets = worksheets.filter(worksheet => 
        worksheet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worksheet.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedYearGroup) {
      worksheets = worksheets.filter(worksheet =>
        worksheet.yearGroups.includes(selectedYearGroup)
      );
    }

    if (selectedLanguage && selectedLanguage !== 'All Languages') {
      worksheets = worksheets.filter(worksheet =>
        worksheet.language === selectedLanguage || worksheet.language === 'All Languages'
      );
    }

    return worksheets;
  };

  const handleDownload = (worksheet: Worksheet) => {
    if (worksheet.premium && !user) {
      setShowAuthPrompt(true);
      return;
    }

    // In production, this would trigger the actual download
    // For now, we'll just show an alert
    if (worksheet.premium && !user) {
      alert('Please sign in to download premium worksheets');
      return;
    }

    // Create download link
    const link = document.createElement('a');
    link.href = worksheet.downloadUrl;
    link.download = `${worksheet.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const featuredWorksheets = getAllWorksheets().filter(w => w.featured);

  const breadcrumbItems = [
    { label: 'Freebies', href: '/freebies', active: true }
  ];

  const handleReturnToHub = () => {
    setActiveView('hub');
  };

  const renderHubContent = () => (
    <>
      {/* Featured Resources */}
      {featuredWorksheets.length > 0 && (
        <div className="py-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              ⭐ Featured Resources
            </h2>
            <p className="text-xl text-slate-600">
              Our most popular and highly-rated worksheets
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {featuredWorksheets.slice(0, 3).map((worksheet) => (
              <div key={worksheet.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-indigo-100">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">Featured</span>
                    <Star className="h-5 w-5 text-yellow-300 fill-current" />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {worksheet.title}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-3">
                    {worksheet.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                      {worksheet.language}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {worksheet.level}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {worksheet.pages} pages
                    </span>
                  </div>
                  
                  <div className="text-sm text-slate-500 mb-4">
                    Suitable for: {worksheet.yearGroups.join(', ')}
                  </div>
                  
                  <button
                    onClick={() => handleDownload(worksheet)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
                      worksheet.premium && !user
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                    }`}
                  >
                    {worksheet.premium && !user ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Sign In to Download
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Free Download
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Find Your Perfect Worksheet</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search worksheets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Year Group Filter */}
          <select
            value={selectedYearGroup || ''}
            onChange={(e) => setSelectedYearGroup(e.target.value || null)}
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Year Groups</option>
            {YEAR_GROUPS.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Language Filter */}
          <select
            value={selectedLanguage || ''}
            onChange={(e) => setSelectedLanguage(e.target.value || null)}
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Languages</option>
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {(searchTerm || selectedCategory || selectedYearGroup || selectedLanguage) && (
          <div className="mt-4">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(null);
                setSelectedYearGroup(null);
                setSelectedLanguage(null);
              }}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {getFilteredWorksheets().map((worksheet) => (
          <div key={worksheet.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-800 line-clamp-2 flex-1">
                  {worksheet.title}
                </h3>
                {worksheet.premium && (
                  <div className="ml-2">
                    <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full">
                      Premium
                    </span>
                  </div>
                )}
              </div>
              
              <p className="text-slate-600 mb-4 line-clamp-3 text-sm">
                {worksheet.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                  {worksheet.language}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {worksheet.level}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {worksheet.pages} pages
                </span>
              </div>
              
              <div className="text-sm text-slate-500 mb-4">
                {worksheet.yearGroups.join(', ')}
              </div>
              
              <button
                onClick={() => handleDownload(worksheet)}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center text-sm ${
                  worksheet.premium && !user
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {worksheet.premium && !user ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Sign In Required
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {getFilteredWorksheets().length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-slate-600 mb-2">
            No worksheets found
          </h3>
          <p className="text-slate-500">
            Try adjusting your search criteria or browse all categories
          </p>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full">
                <Gift className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Free Language Learning Resources
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Download high-quality worksheets, practice materials, and study guides 
              designed by language teachers for students of all levels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center text-indigo-200">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Curriculum Aligned</span>
              </div>
              <div className="flex items-center text-indigo-200">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Teacher Created</span>
              </div>
              <div className="flex items-center text-indigo-200">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Instant Download</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <FreebiesBreadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Navigation Tabs */}
        <FreebiesNavTabs 
          activeTab={activeView} 
          onTabChange={(tab) => setActiveView(tab as 'hub' | 'curriculum')}
          className="mb-8"
        />

        {/* Conditional Content */}
        {activeView === 'curriculum' ? (
          <CurriculumNavigator onReturnToHub={handleReturnToHub} />
        ) : (
          renderHubContent()
        )}
      </div>

      {/* Explore More Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Want More Learning Resources?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Explore our interactive games, structured lessons, and comprehensive learning paths
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/games"
              className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🎮</div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Interactive Games</h3>
                <p className="text-slate-600 mb-4">
                  Learn vocabulary and grammar through engaging games and activities
                </p>
                <span className="text-blue-600 font-medium group-hover:text-blue-700">
                  Play Now →
                </span>
              </div>
            </Link>
            
            <Link
              href="/learn"
              className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Structured Courses</h3>
                <p className="text-slate-600 mb-4">
                  Follow guided learning paths designed by language experts
                </p>
                <span className="text-green-600 font-medium group-hover:text-green-700">
                  Start Learning →
                </span>
              </div>
            </Link>
            
            <Link
              href="/shop"
              className="group bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-8 border border-purple-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">📖</div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Premium Resources</h3>
                <p className="text-slate-600 mb-4">
                  Access exclusive materials and advanced learning tools
                </p>
                <span className="text-purple-600 font-medium group-hover:text-purple-700">
                  Browse Shop →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Sign-up CTA */}
      {!user && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                Want Access to Premium Worksheets?
              </h2>
              <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Sign up for a free account to access our premium worksheet collection, 
                track your downloads, and get notified about new resources.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/auth/login"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 