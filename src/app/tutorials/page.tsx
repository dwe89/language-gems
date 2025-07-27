'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Play, Clock, Users, Star, BookOpen, Gamepad2, 
  BarChart3, Settings, ChevronRight, Search, Filter,
  PlayCircle, Download, ExternalLink, CheckCircle
} from 'lucide-react';
import Footer from '../../components/layout/Footer';

export default function TutorialsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const categories = [
    { id: 'all', name: 'All Tutorials', icon: BookOpen },
    { id: 'getting-started', name: 'Getting Started', icon: Play },
    { id: 'games', name: 'Games & Activities', icon: Gamepad2 },
    { id: 'assignments', name: 'Assignment Creation', icon: Users },
    { id: 'analytics', name: 'Analytics & Reports', icon: BarChart3 },
    { id: 'advanced', name: 'Advanced Features', icon: Settings },
  ];

  const tutorials = [
    {
      id: 1,
      title: 'Getting Started with Language Gems',
      description: 'Complete walkthrough for new teachers - from account setup to your first assignment',
      category: 'getting-started',
      difficulty: 'beginner',
      duration: '15 min',
      views: '12.5k',
      rating: 4.9,
      thumbnail: '/images/tutorials/getting-started.jpg',
      videoUrl: '#',
      topics: ['Account Setup', 'Dashboard Overview', 'First Assignment']
    },
    {
      id: 2,
      title: 'Creating Your First Assignment',
      description: 'Step-by-step guide to creating engaging assignments using our game library',
      category: 'assignments',
      difficulty: 'beginner',
      duration: '12 min',
      views: '8.3k',
      rating: 4.8,
      thumbnail: '/images/tutorials/first-assignment.jpg',
      videoUrl: '#',
      topics: ['Game Selection', 'Vocabulary Setup', 'Class Assignment']
    },
    {
      id: 3,
      title: 'Mastering Memory Match Game',
      description: 'Advanced strategies and customization options for the Memory Match game',
      category: 'games',
      difficulty: 'intermediate',
      duration: '10 min',
      views: '6.7k',
      rating: 4.7,
      thumbnail: '/images/tutorials/memory-match.jpg',
      videoUrl: '#',
      topics: ['Game Mechanics', 'Theme Selection', 'Difficulty Settings']
    },
    {
      id: 4,
      title: 'Understanding Student Analytics',
      description: 'How to interpret student performance data and use insights effectively',
      category: 'analytics',
      difficulty: 'intermediate',
      duration: '18 min',
      views: '5.2k',
      rating: 4.9,
      thumbnail: '/images/tutorials/analytics.jpg',
      videoUrl: '#',
      topics: ['Performance Metrics', 'Progress Tracking', 'Report Generation']
    },
    {
      id: 5,
      title: 'Custom Vocabulary Management',
      description: 'Upload, organize, and manage your own vocabulary lists for personalized learning',
      category: 'advanced',
      difficulty: 'advanced',
      duration: '14 min',
      views: '4.1k',
      rating: 4.6,
      thumbnail: '/images/tutorials/vocabulary.jpg',
      videoUrl: '#',
      topics: ['File Upload', 'Organization', 'Game Integration']
    },
    {
      id: 6,
      title: 'Hangman Game Deep Dive',
      description: 'Explore all features and customization options of the Hangman game',
      category: 'games',
      difficulty: 'beginner',
      duration: '8 min',
      views: '7.8k',
      rating: 4.5,
      thumbnail: '/images/tutorials/hangman.jpg',
      videoUrl: '#',
      topics: ['Game Setup', 'Hint System', 'Category Selection']
    }
  ];

  const learningPaths = [
    {
      title: 'New Teacher Onboarding',
      description: 'Complete path for teachers new to Language Gems',
      duration: '45 min',
      tutorials: 4,
      difficulty: 'beginner',
      steps: [
        'Getting Started with Language Gems',
        'Creating Your First Assignment',
        'Understanding Student Analytics',
        'Managing Your Classes'
      ]
    },
    {
      title: 'Game Master Certification',
      description: 'Become an expert in all our interactive games',
      duration: '2 hours',
      tutorials: 8,
      difficulty: 'intermediate',
      steps: [
        'Memory Match Mastery',
        'Hangman Advanced Features',
        'Noughts & Crosses Strategies',
        'Vocab Blast Optimization'
      ]
    },
    {
      title: 'Data-Driven Teaching',
      description: 'Use analytics to improve student outcomes',
      duration: '1 hour',
      tutorials: 5,
      difficulty: 'advanced',
      steps: [
        'Analytics Dashboard Overview',
        'Performance Interpretation',
        'Custom Report Creation',
        'Intervention Strategies'
      ]
    }
  ];

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = searchQuery === '' || 
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Video Tutorials</h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Learn how to make the most of Language Gems with our comprehensive video guides and step-by-step tutorials
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Learning Paths */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Learning Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPaths.map((path, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{path.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(path.difficulty)}`}>
                    {path.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{path.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {path.duration}
                  </span>
                  <span className="flex items-center">
                    <PlayCircle className="h-4 w-4 mr-1" />
                    {path.tutorials} tutorials
                  </span>
                </div>
                <div className="space-y-2 mb-6">
                  {path.steps.slice(0, 3).map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {step}
                    </div>
                  ))}
                  {path.steps.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{path.steps.length - 3} more steps
                    </div>
                  )}
                </div>
                <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                  Start Learning Path
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tutorial Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">All Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map((tutorial) => (
              <div key={tutorial.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-48 flex items-center justify-center">
                    <PlayCircle className="h-16 w-16 text-white opacity-80" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                      {tutorial.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {tutorial.duration}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tutorial.title}</h3>
                  <p className="text-gray-600 mb-4">{tutorial.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      {tutorial.rating}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {tutorial.views} views
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tutorial.topics.slice(0, 2).map((topic, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {topic}
                      </span>
                    ))}
                    {tutorial.topics.length > 2 && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        +{tutorial.topics.length - 2} more
                      </span>
                    )}
                  </div>
                  
                  <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center">
                    <Play className="h-5 w-5 mr-2" />
                    Watch Tutorial
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTutorials.length === 0 && (
            <div className="text-center py-12">
              <PlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tutorials found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Jump into Language Gems and start creating engaging assignments for your students
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Go to Dashboard
            </Link>
            <Link
              href="/help-center"
              className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-indigo-600 transition-colors flex items-center justify-center"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Get Help
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
