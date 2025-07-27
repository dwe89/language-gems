'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  BookOpen, Gamepad2, Users, Settings, BarChart3, 
  ChevronRight, Search, Download, ExternalLink,
  Play, Target, Trophy, Clock, Star, Zap
} from 'lucide-react';
import Footer from '../../components/layout/Footer';

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('overview');

  const sections = [
    { id: 'overview', name: 'Platform Overview', icon: BookOpen },
    { id: 'games', name: 'Games & Activities', icon: Gamepad2 },
    { id: 'assignments', name: 'Assignment Management', icon: Users },
    { id: 'analytics', name: 'Analytics & Reports', icon: BarChart3 },
    { id: 'settings', name: 'Account Settings', icon: Settings },
  ];

  const gameDocumentation = [
    {
      name: 'Memory Match',
      description: 'Classic memory card game with vocabulary pairs',
      features: ['Customizable grid sizes', 'Theme support', 'Progress tracking'],
      difficulty: 'Beginner to Advanced'
    },
    {
      name: 'Hangman',
      description: 'Traditional word guessing game with hints',
      features: ['Category selection', 'Custom vocabulary', 'Visual feedback'],
      difficulty: 'Beginner to Intermediate'
    },
    {
      name: 'Noughts & Crosses',
      description: 'Tic-tac-toe with vocabulary challenges',
      features: ['Multiple themes', 'AI opponents', 'Multiplayer mode'],
      difficulty: 'Beginner to Advanced'
    },
    {
      name: 'Word Scramble',
      description: 'Unscramble letters to form words',
      features: ['Hint system', 'Time challenges', 'Difficulty scaling'],
      difficulty: 'Intermediate'
    },
    {
      name: 'Vocab Blast',
      description: 'Fast-paced vocabulary matching game',
      features: ['Theme integration', 'Power-ups', 'Leaderboards'],
      difficulty: 'Intermediate to Advanced'
    },
    {
      name: 'Detective Listening',
      description: 'Audio-based vocabulary recognition',
      features: ['Native speaker audio', 'Case progression', 'Evidence collection'],
      difficulty: 'Advanced'
    }
  ];

  const quickStart = [
    {
      step: 1,
      title: 'Create Your Account',
      description: 'Sign up as a teacher and set up your school profile'
    },
    {
      step: 2,
      title: 'Add Students',
      description: 'Import class lists or generate student access codes'
    },
    {
      step: 3,
      title: 'Create Assignments',
      description: 'Choose games, select vocabulary, and assign to classes'
    },
    {
      step: 4,
      title: 'Monitor Progress',
      description: 'Track student performance through detailed analytics'
    }
  ];

  const features = [
    {
      category: 'Content Management',
      items: [
        'GCSE vocabulary database with 1000+ words',
        'Custom vocabulary upload and management',
        'Multi-language support (French, Spanish, German)',
        'Curriculum-aligned content organization'
      ]
    },
    {
      category: 'Game Mechanics',
      items: [
        '15+ interactive game types',
        'Multiple difficulty levels and themes',
        'Real-time progress tracking',
        'Achievement and reward systems'
      ]
    },
    {
      category: 'Teacher Tools',
      items: [
        'Comprehensive assignment creation',
        'Class management and student tracking',
        'Detailed analytics and reporting',
        'Customizable learning paths'
      ]
    },
    {
      category: 'Student Experience',
      items: [
        'Intuitive student dashboard',
        'Cross-device compatibility',
        'Offline capability for select games',
        'Social features and leaderboards'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Documentation</h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Complete guides and references for using Language Gems effectively in your classroom
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Documentation</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                      selectedSection === section.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon className="h-5 w-5 mr-3" />
                    {section.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedSection === 'overview' && (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Platform Overview</h2>
                  <p className="text-lg text-gray-700 mb-8">
                    Language Gems is a comprehensive language learning platform designed specifically for educators. 
                    Our interactive games and tools help students engage with vocabulary, grammar, and language skills 
                    in an immersive, gamified environment.
                  </p>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Start Guide</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {quickStart.map((item) => (
                      <div key={item.step} className="flex items-start space-x-4">
                        <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                      <div key={index}>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">{feature.category}</h4>
                        <ul className="space-y-2">
                          {feature.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start">
                              <ChevronRight className="h-4 w-4 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedSection === 'games' && (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Games & Activities</h2>
                  <p className="text-lg text-gray-700 mb-8">
                    Our platform features 15+ interactive games designed to make language learning engaging and effective. 
                    Each game can be customized with your own vocabulary or our extensive GCSE database.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {gameDocumentation.map((game, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900">{game.name}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <Target className="h-4 w-4 mr-1" />
                            {game.difficulty}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">{game.description}</p>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                          <ul className="space-y-1">
                            {game.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                                <Star className="h-3 w-3 text-yellow-500 mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedSection === 'assignments' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Assignment Management</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Creating Assignments</h3>
                    <p className="text-gray-700 mb-4">
                      Use our Smart Multi-Game Assignment Creator to build comprehensive learning experiences. 
                      Select from multiple games, customize vocabulary, set difficulty levels, and assign to specific classes.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Student Management</h3>
                    <p className="text-gray-700 mb-4">
                      Organize students into classes, track individual progress, and provide personalized feedback. 
                      Generate student access codes or import existing class lists.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Progress Tracking</h3>
                    <p className="text-gray-700">
                      Monitor completion rates, accuracy scores, and time spent on activities. 
                      Identify students who need additional support and celebrate achievements.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedSection === 'analytics' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Analytics & Reports</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Performance Metrics</h3>
                    <p className="text-gray-700 mb-4">
                      Access detailed analytics including accuracy rates, completion times, and learning progression. 
                      View data at individual student, class, or school level.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Reports</h3>
                    <p className="text-gray-700 mb-4">
                      Generate custom reports for parent conferences, administrative reviews, or curriculum planning. 
                      Export data in multiple formats including PDF and CSV.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Insights</h3>
                    <p className="text-gray-700">
                      Get instant feedback on student engagement and performance. 
                      Identify trends and adjust teaching strategies based on data-driven insights.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedSection === 'settings' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Profile Management</h3>
                    <p className="text-gray-700 mb-4">
                      Update your teacher profile, school information, and contact details. 
                      Manage notification preferences and privacy settings.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Subscription & Billing</h3>
                    <p className="text-gray-700 mb-4">
                      View your current subscription plan, update payment methods, and access billing history. 
                      Upgrade or downgrade your plan as needed.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Integration Settings</h3>
                    <p className="text-gray-700">
                      Connect with your school's learning management system, export data to external platforms, 
                      and configure API access for advanced integrations.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Explore our additional resources and support options
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tutorials"
              className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Play className="h-5 w-5 mr-2" />
              Video Tutorials
            </Link>
            <Link
              href="/help-center"
              className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-indigo-600 transition-colors flex items-center justify-center"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Help Center
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
