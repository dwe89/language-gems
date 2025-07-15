'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../../components/auth/AuthProvider';
import { 
  ArrowLeft, Crown, Check, Star, Zap, Shield, Users, BookOpen, 
  BarChart2, Gamepad2, Award, Calendar, FileText, MessageSquare,
  Video, Headphones, Globe, Sparkles, GraduationCap, Target,
  Play, Eye, ChevronRight, Bell, Gem, Brain, Construction, 
  Puzzle, Shuffle, Layers, Crosshair, Bolt
} from 'lucide-react';

export default function UpgradePage() {
  const { user } = useAuth();
  const [activePreview, setActivePreview] = useState<'features' | 'teacher-dashboard' | 'student-dashboard' | 'games'>('features');

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Please sign in to upgrade</h2>
          <Link 
            href="/auth/login"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const coreFeatures = [
    {
      icon: Crown,
      title: 'Full Dashboard Access',
      description: 'Complete access to teacher and student dashboards with all premium tools',
      preview: '/images/features/dashboard-preview.png'
    },
    {
      icon: Users,
      title: 'Class Management',
      description: 'Create unlimited classes, manage students, and track progress in real-time',
      preview: '/images/features/class-management.png'
    },
    {
      icon: FileText,
      title: 'Assignment System',
      description: 'Create custom assignments, track submissions, and provide detailed feedback',
      preview: '/images/features/assignments.png'
    },
    {
      icon: BarChart2,
      title: 'Advanced Analytics',
      description: 'Detailed progress tracking, performance analytics, and custom reports',
      preview: '/images/features/analytics.png'
    },
    {
      icon: Gamepad2,
      title: 'Interactive Games',
      description: '15+ premium learning games with customizable difficulty and topics',
      preview: '/images/features/games.png'
    },
    {
      icon: BookOpen,
      title: 'Vocabulary Mining',
      description: 'AI-powered vocabulary extraction from texts and automatic list generation',
      preview: '/images/features/vocabulary-mining.png'
    }
  ];

  const advancedFeatures = [
    {
      icon: MessageSquare,
      title: 'AI Conversation Practice',
      description: 'Real-time conversations with AI tutors for speaking practice'
    },
    {
      icon: Video,
      title: 'Virtual Classrooms',
      description: 'Integrated video calls and screen sharing for remote learning'
    },
    {
      icon: Headphones,
      title: 'Pronunciation Analysis',
      description: 'AI-powered speech recognition and pronunciation feedback'
    },
    {
      icon: Globe,
      title: 'Multi-language Support',
      description: 'Support for 12+ languages with native speaker audio'
    },
    {
      icon: Award,
      title: 'Certification System',
      description: 'Generate certificates and track learning milestones'
    },
    {
      icon: Target,
      title: 'Adaptive Learning',
      description: 'AI that adapts to each student\'s learning pace and style'
    }
  ];

  const allGames = [
    {
      title: "Memory Match",
      description: "Match vocabulary words with images or translations",
      icon: <Brain className="w-6 h-6" />,
      category: "Memory",
      difficulty: "Easy"
    },
    {
      title: "Word Hangman", 
      description: "Classic hangman with language learning twist",
      icon: <Target className="w-6 h-6" />,
      category: "Spelling",
      difficulty: "Medium"
    },
    {
      title: "Word Blast",
      description: "Fast-paced word recognition and typing game",
      icon: <Bolt className="w-6 h-6" />,
      category: "Speed",
      difficulty: "Hard"
    },
    {
      title: "Translation Tycoon",
      description: "Build your translation empire while learning",
      icon: <Construction className="w-6 h-6" />,
      category: "Strategy",
      difficulty: "Medium"
    },
    {
      title: "Sentence Builder",
      description: "Create stories using target vocabulary",
      icon: <FileText className="w-6 h-6" />,
      category: "Grammar",
      difficulty: "Medium"
    },
    {
      title: "Verb Ladder",
      description: "Climb the conjugation ladder",
      icon: <Layers className="w-6 h-6" />,
      category: "Grammar",
      difficulty: "Hard"
    },
    {
      title: "Word Scramble",
      description: "Unscramble letters to form words",
      icon: <Shuffle className="w-6 h-6" />,
      category: "Spelling",
      difficulty: "Easy"
    },
    {
      title: "Speed Builder",
      description: "Rapid-fire vocabulary challenges",
      icon: <Zap className="w-6 h-6" />,
      category: "Speed",
      difficulty: "Hard"
    },
    {
      title: "Word Association",
      description: "Connect related words and concepts",
      icon: <Puzzle className="w-6 h-6" />,
      category: "Vocabulary",
      difficulty: "Medium"
    },
    {
      title: "Vocabulary Tic-Tac-Toe",
      description: "Classic game with vocabulary challenges",
      icon: <Crosshair className="w-6 h-6" />,
      category: "Strategy",
      difficulty: "Easy"
    },
    {
      title: "Gem Collector",
      description: "Collect vocabulary gems in mazes",
      icon: <Gem className="w-6 h-6" />,
      category: "Adventure",
      difficulty: "Medium"
    },
    {
      title: "Sentence Towers",
      description: "Stack words to build correct sentences",
      icon: <Construction className="w-6 h-6" />,
      category: "Grammar",
      difficulty: "Medium"
    }
  ];

  const pricingPlans = [
    {
      name: 'Teacher Starter',
      price: '£29',
      period: 'per month',
      description: 'Perfect for individual teachers',
      features: [
        'Up to 3 classes',
        'Up to 90 students',
        'Basic analytics',
        'All core games',
        'Assignment system',
        'Email support'
      ],
      highlighted: false,
      comingSoon: true
    },
    {
      name: 'Teacher Pro',
      price: '£49',
      period: 'per month',
      description: 'For serious educators',
      features: [
        'Unlimited classes',
        'Unlimited students',
        'Advanced analytics',
        'All premium games',
        'Vocabulary mining',
        'Priority support',
        'Custom themes',
        'Export capabilities'
      ],
      highlighted: true,
      comingSoon: true
    },
    {
      name: 'School License',
      price: 'Custom',
      period: 'pricing',
      description: 'For schools and institutions',
      features: [
        'Everything in Pro',
        'Multiple teacher accounts',
        'Admin dashboard',
        'Custom branding',
        'Integration support',
        'Training sessions',
        'Dedicated support'
      ],
      highlighted: false,
      comingSoon: true
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Memory': return 'bg-purple-100 text-purple-700';
      case 'Speed': return 'bg-orange-100 text-orange-700';
      case 'Grammar': return 'bg-blue-100 text-blue-700';
      case 'Vocabulary': return 'bg-green-100 text-green-700';
      case 'Spelling': return 'bg-pink-100 text-pink-700';
      case 'Strategy': return 'bg-indigo-100 text-indigo-700';
      case 'Adventure': return 'bg-cyan-100 text-cyan-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account
          </Link>
          
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-6 relative">
              <Crown className="h-10 w-10 text-white" />
              <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                SOON
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Coming Soon
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              We're building the most comprehensive language learning platform for educators. 
              Get ready for powerful tools, engaging games, and insights that will transform your classroom!
            </p>

            {/* Preview Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-xl p-2 shadow-lg border border-slate-200">
                <button
                  onClick={() => setActivePreview('features')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center ${
                    activePreview === 'features'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Features
                </button>
                <button
                  onClick={() => setActivePreview('teacher-dashboard')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center ${
                    activePreview === 'teacher-dashboard'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Teacher
                </button>
                <button
                  onClick={() => setActivePreview('student-dashboard')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center ${
                    activePreview === 'student-dashboard'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Student
                </button>
                <button
                  onClick={() => setActivePreview('games')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center ${
                    activePreview === 'games'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  Games
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        {activePreview === 'features' && (
          <div className="space-y-16">
            {/* Core Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all group">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{feature.title}</h3>
                  </div>
                  <p className="text-slate-600 mb-6">{feature.description}</p>
                  <div className="text-center">
                    <div className="bg-slate-100 rounded-lg h-32 flex items-center justify-center mb-4">
                      <Eye className="h-8 w-8 text-slate-400" />
                      <span className="ml-2 text-slate-500">Preview Coming Soon</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Advanced Features */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Advanced Features</h2>
                <p className="text-indigo-100 text-lg">Cutting-edge technology for modern language learning</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {advancedFeatures.map((feature, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="font-semibold">{feature.title}</h4>
                    </div>
                    <p className="text-indigo-100 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Teacher Dashboard Preview */}
        {activePreview === 'teacher-dashboard' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Teacher Dashboard Preview</h2>
              <p className="text-xl text-slate-600">Comprehensive classroom management at your fingertips</p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
              {/* Dashboard Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">LanguageGems Teacher Dashboard</h2>
                    <p className="opacity-90">Comprehensive classroom management at your fingertips</p>
                  </div>
                  <Crown className="h-12 w-12 opacity-80" />
                </div>
              </div>
              
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-slate-50">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-indigo-600 mb-1">127</div>
                  <div className="text-sm text-slate-600">Active Students</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-purple-600 mb-1">8</div>
                  <div className="text-sm text-slate-600">Classes</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-pink-600 mb-1">24</div>
                  <div className="text-sm text-slate-600">Active Assignments</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-1">89%</div>
                  <div className="text-sm text-slate-600">Avg. Completion</div>
                </div>
              </div>
              
              {/* Navigation Tabs */}
              <div className="flex overflow-x-auto border-b border-slate-200 bg-white">
                {['Classes', 'Assignments', 'Analytics', 'Games', 'Students', 'Reports'].map((item, index) => (
                  <div key={index} className={`px-6 py-3 font-medium whitespace-nowrap border-b-2 ${
                    index === 0 ? 'text-indigo-600 border-indigo-600' : 'text-slate-600 border-transparent'
                  }`}>
                    {item}
                  </div>
                ))}
              </div>
              
              {/* Content Area */}
              <div className="p-6 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-indigo-600" />
                      Recent Classes
                    </h3>
                    {[
                      { name: 'Advanced Spanish (Year 11)', students: 24, assignments: 3 },
                      { name: 'French Beginners', students: 18, assignments: 2 },
                      { name: 'German GCSE Prep', students: 31, assignments: 5 }
                    ].map((classItem, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-800">{classItem.name}</div>
                          <div className="text-xs text-slate-500">{classItem.students} students • {classItem.assignments} active assignments</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 flex items-center">
                      <BarChart2 className="h-5 w-5 mr-2 text-purple-600" />
                      Performance Overview
                    </h3>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold text-purple-600 mb-2">73%</div>
                        <div className="text-sm text-slate-600">Average Class Performance</div>
                      </div>
                      <div className="space-y-3">
                        {['Vocabulary Mastery: 85%', 'Grammar Understanding: 67%', 'Game Completion: 92%'].map((stat, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-slate-600">{stat.split(':')[0]}</span>
                            <span className="font-semibold text-purple-600">{stat.split(':')[1]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Dashboard Preview */}
        {activePreview === 'student-dashboard' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Student Dashboard Preview</h2>
              <p className="text-xl text-slate-600">Engaging and intuitive learning experience</p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
              {/* Dashboard Header */}
              <div className="bg-indigo-800 text-white py-3 px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                      <Gem className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold">LanguageGems Student Portal</h2>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Bell className="h-5 w-5 text-indigo-200" />
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                      A
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Progress Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-purple-100">
                  <div className="text-3xl font-bold text-purple-600 mb-1">73%</div>
                  <div className="text-sm text-slate-600">Overall Progress</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-purple-100">
                  <div className="text-3xl font-bold text-indigo-600 mb-1">5</div>
                  <div className="text-sm text-slate-600">Active Assignments</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-purple-100">
                  <div className="text-3xl font-bold text-green-600 mb-1">247</div>
                  <div className="text-sm text-slate-600">Words Mastered</div>
                </div>
              </div>
              
              {/* Navigation Tabs */}
              <div className="flex overflow-x-auto border-b border-slate-200 bg-white">
                {['Assignments', 'Games', 'Progress', 'Achievements', 'Calendar'].map((item, index) => (
                  <div key={index} className={`px-6 py-3 font-medium whitespace-nowrap border-b-2 ${
                    index === 0 ? 'text-purple-600 border-purple-600' : 'text-slate-600 border-transparent'
                  }`}>
                    {item}
                  </div>
                ))}
              </div>
              
              {/* Content Area */}
              <div className="p-6 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-purple-600" />
                      Current Assignments
                    </h3>
                    {[
                      { title: 'Spanish Vocabulary Set #1', due: '3 days', progress: 80 },
                      { title: 'French Conversation Practice', due: '1 week', progress: 45 },
                      { title: 'German Grammar Quiz', due: '5 days', progress: 0 }
                    ].map((assignment, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-800">{assignment.title}</div>
                          <div className="text-xs text-slate-500">Due in {assignment.due} • {assignment.progress}% complete</div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-purple-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${assignment.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800 flex items-center">
                      <Gamepad2 className="h-5 w-5 mr-2 text-indigo-600" />
                      Recommended Games
                    </h3>
                    {[
                      { title: 'Memory Game - Level 3', desc: 'Perfect for vocabulary practice', icon: '🧠' },
                      { title: 'Word Builder Challenge', desc: 'Build sentences with new words', icon: '🏗️' },
                      { title: 'Translation Tycoon', desc: 'Manage your translation empire', icon: '🏙️' }
                    ].map((game, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg">{game.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-800">{game.title}</div>
                          <div className="text-xs text-slate-500">{game.desc}</div>
                        </div>
                        <Play className="h-4 w-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Games Preview */}
        {activePreview === 'games' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Complete Games Collection</h2>
              <p className="text-xl text-slate-600">12 engaging games designed for language learning</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allGames.map((game, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      {game.icon}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(game.category)}`}>
                        {game.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                        {game.difficulty}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{game.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{game.description}</p>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center">
                    <Play className="w-4 h-4 mr-2" />
                    Coming Soon
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Section */}
        <div className="bg-white rounded-3xl p-12 shadow-lg border border-slate-200 mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-slate-600">Flexible pricing for educators of all sizes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`rounded-2xl p-8 border-2 ${
                plan.highlighted 
                  ? 'border-purple-500 bg-gradient-to-b from-purple-50 to-pink-50 transform scale-105' 
                  : 'border-slate-200 bg-white'
              }`}>
                {plan.highlighted && (
                  <div className="text-center mb-4">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-slate-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  disabled={plan.comingSoon}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {plan.comingSoon ? 'Coming Soon' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Teaching?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join the waitlist to be first in line when LanguageGems launches. Plus, get early access to our development updates!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Sparkles className="h-5 w-5 mr-2 inline" />
                Join Waitlist
              </Link>
              <Link
                href="/coming-soon/games"
                className="px-8 py-4 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition-colors border-2 border-white/20"
              >
                <Eye className="h-5 w-5 mr-2 inline" />
                View More Previews
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 