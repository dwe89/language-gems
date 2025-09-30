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
  Puzzle, Shuffle, Layers, Crosshair, Bolt, User, Phone, Mail
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

  const basicFeatures = [
    {
      icon: Gamepad2,
      title: '15+ Interactive Games',
      description: 'Full access to all learning games for whole-class gameplay',
      plans: ['basic', 'standard', 'large']
    },
    {
      icon: Globe,
      title: 'All Languages',
      description: 'Complete access to Spanish, French, and German content',
      plans: ['basic', 'standard', 'large']
    },
    {
      icon: Users,
      title: 'Teacher Access',
      description: 'All MFL teachers can use the platform for classroom activities',
      plans: ['basic', 'standard', 'large']
    }
  ];

  const standardFeatures = [
    {
      icon: User,
      title: 'Individual Student Logins',
      description: 'Personal accounts for up to 750 students with progress tracking',
      plans: ['standard', 'large']
    },
    {
      icon: FileText,
      title: 'Assignment System',
      description: 'Create homework assignments with automated marking and feedback',
      plans: ['standard', 'large']
    },
    {
      icon: BarChart2,
      title: 'Advanced Analytics',
      description: 'Detailed progress tracking, performance insights, and custom reports',
      plans: ['standard', 'large']
    },
    {
      icon: BookOpen,
      title: 'Custom Vocabulary Lists',
      description: 'Create and manage personalized vocabulary collections',
      plans: ['standard', 'large']
    },
    {
      icon: GraduationCap,
      title: 'GCSE Alignment',
      description: 'AQA/Edexcel GCSE vocabulary specifications with tier filtering',
      plans: ['standard', 'large']
    },
    {
      icon: Award,
      title: 'Spaced Repetition & Gems',
      description: 'AI-powered learning optimization with gamified rewards',
      plans: ['standard', 'large']
    }
  ];

  const largeSchoolFeatures = [
    {
      icon: Users,
      title: 'Unlimited Students',
      description: 'No limits on student accounts - perfect for large schools',
      plans: ['large']
    },
    {
      icon: Phone,
      title: 'Priority Support',
      description: 'Dedicated email and chat support with faster response times',
      plans: ['large']
    },
    {
      icon: Star,
      title: 'Strategic Partnership',
      description: 'Direct input on feature development and priority feedback',
      plans: ['large']
    }
  ];

  const allGames = [
    {
      title: "VocabMaster",
      description: "Master vocabulary with smart, personalized reviews, adaptive learning, and 8 engaging game modes",
      icon: <BookOpen className="w-6 h-6" />,
      category: "Vocabulary"
    },
    {
      title: "Sentence Sprint",
      description: "Drag and drop words to build sentences correctly before time runs out",
      icon: <Zap className="w-6 h-6" />,
      category: "Sentences"
    },
    {
      title: "Word Blast",
      description: "Launch rockets with correct word translations before time runs out!",
      icon: <Target className="w-6 h-6" />,
      category: "Vocabulary"
    },
    {
      title: "Word Towers",
      description: "Build towers by matching words to translations. Wrong answers make towers fall!",
      icon: <Construction className="w-6 h-6" />,
      category: "Vocabulary"
    },
    {
      title: "Hangman",
      description: "Guess the word before the hangman is complete. Excellent for vocabulary practice",
      icon: <Target className="w-6 h-6" />,
      category: "Vocabulary"
    },
    {
      title: "Memory Match",
      description: "Match pairs of cards to build vocabulary and memory skills",
      icon: <Brain className="w-6 h-6" />,
      category: "Vocabulary"
    },
    {
      title: "Noughts and Crosses",
      description: "Play tic-tac-toe while practicing language terms",
      icon: <Crosshair className="w-6 h-6" />,
      category: "Vocabulary"
    },
    {
      title: "Conjugation Duel",
      description: "Epic verb conjugation battles in different arenas and leagues",
      icon: <Zap className="w-6 h-6" />,
      category: "Grammar"
    },
    {
      title: "Word Scramble",
      description: "Unscramble jumbled words to improve spelling and word recognition",
      icon: <Shuffle className="w-6 h-6" />,
      category: "Spelling"
    },
    {
      title: "Detective Listening Game",
      description: "Solve cases by identifying evidence through listening to words and finding their translations",
      icon: <Headphones className="w-6 h-6" />,
      category: "Listening"
    },
    {
      title: "Case File Translator",
      description: "Solve detective cases by translating intercepted communications",
      icon: <FileText className="w-6 h-6" />,
      category: "Sentences"
    },
    {
      title: "Lava Temple: Word Restore",
      description: "Restore ancient inscriptions by filling in missing words. Become a linguistic archaeologist!",
      icon: <Gem className="w-6 h-6" />,
      category: "Sentences"
    },
    {
      title: "Verb Quest",
      description: "Embark on an epic RPG adventure to master verb conjugations!",
      icon: <GraduationCap className="w-6 h-6" />,
      category: "Grammar"
    },
    {
      title: "Vocab Blast",
      description: "Click vocabulary gems to pop and translate them quickly",
      icon: <Bolt className="w-6 h-6" />,
      category: "Vocabulary"
    }
  ];

  const pricingPlans = [
    {
      name: 'Basic Plan',
      price: '£399',
      period: '/year',
      description: 'Perfect for smaller schools focusing on core vocabulary acquisition with shared classroom access.',
      features: [
        '✅ All MFL teachers - classroom-wide access',
        '✅ All students - whole-class gameplay',
        '✅ 15+ interactive learning games',
        '✅ Spanish, French, German content',
        '✅ Professional audio integration',
        '✅ WCAG 2.1 AA accessibility',
        '❌ Individual student logins',
        '❌ Custom vocabulary lists',
        '❌ Homework assignments',
        '❌ Advanced analytics'
      ],
      highlighted: false,
      comingSoon: false,
      limitations: [
        'No individual student tracking',
        'Shared classroom access only',
        'No assignment creation',
        'No custom content'
      ]
    },
    {
      name: 'Standard Plan',
      price: '£799',
      period: '/year',
      description: 'Complete solution for most secondary schools with individual student tracking and advanced features.',
      features: [
        '✅ Everything in Basic Plan',
        '✅ Individual logins for 750 students',
        '✅ Homework assignments with auto-marking',
        '✅ Custom vocabulary lists',
        '✅ Advanced analytics & reports',
        '✅ AQA/Edexcel GCSE alignment',
        '✅ Spaced repetition system',
        '✅ Competition leaderboards',
        '✅ Progress tracking per student',
        '✅ Multi-game assignment system'
      ],
      highlighted: true,
      comingSoon: false,
      bestValue: true
    },
    {
      name: 'Large School Plan',
      price: '£1,199',
      period: '/year',
      description: 'Enterprise solution for large schools with unlimited students and premium support.',
      features: [
        '✅ Everything in Standard Plan',
        '✅ Unlimited student accounts',
        '✅ Priority email & chat support',
        '✅ Custom reports & analytics',
        '✅ Dedicated onboarding support',
        '✅ Strategic partnership benefits',
        '✅ Feature request priority',
        '✅ Advanced admin controls',
        '✅ Multi-school management',
        '✅ White-label options'
      ],
      highlighted: false,
      comingSoon: false,
      enterprise: true
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Vocabulary': return 'bg-green-100 text-green-700';
      case 'Grammar': return 'bg-blue-100 text-blue-700';
      case 'Sentences': return 'bg-purple-100 text-purple-700';
      case 'Spelling': return 'bg-pink-100 text-pink-700';
      case 'Listening': return 'bg-orange-100 text-orange-700';
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
            <div className="mx-auto flex items-center justify-center h-20 w-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-6">
              <Crown className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Upgrade to Premium
              </span>
            </h1>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Unlock the full power of LanguageGems with comprehensive tools, advanced analytics,
              and premium features designed to transform your language teaching experience.
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
            {/* Basic Plan Features */}
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">What's Included in Each Plan</h2>
                <p className="text-xl text-slate-600">Compare features across all pricing tiers</p>
              </div>

              <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
                <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  Basic Plan Features (£399/year)
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {basicFeatures.map((feature, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                          <feature.icon className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="font-bold text-slate-800">{feature.title}</h4>
                      </div>
                      <p className="text-slate-600 text-sm">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Standard Plan Features */}
              <div className="bg-purple-50 rounded-2xl p-8 border border-purple-200">
                <h3 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  Standard Plan Features (£799/year) - Most Popular
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {standardFeatures.map((feature, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                          <feature.icon className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="font-bold text-slate-800">{feature.title}</h4>
                      </div>
                      <p className="text-slate-600 text-sm">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Large School Features */}
              <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-200">
                <h3 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  Large School Plan Features (£1,199/year)
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {largeSchoolFeatures.map((feature, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-indigo-100">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
                          <feature.icon className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="font-bold text-slate-800">{feature.title}</h4>
                      </div>
                      <p className="text-slate-600 text-sm">{feature.description}</p>
                    </div>
                  ))}
                </div>
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
              <p className="text-xl text-slate-600">{allGames.length} engaging games designed for language learning - available in all plans</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allGames.map((game, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      {game.icon}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(game.category)}`}>
                      {game.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{game.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{game.description}</p>
                  <Link
                    href="/games"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Try Demo
                  </Link>
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

                {plan.bestValue && (
                  <div className="text-center mb-4">
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Best Value
                    </span>
                  </div>
                )}

                {plan.enterprise && (
                  <div className="text-center mb-4">
                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Enterprise
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

                <Link
                  href={`/schools/contact?plan=${plan.name.toLowerCase().replace(' plan', '')}`}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all text-center block ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                      : plan.enterprise
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700'
                      : 'bg-slate-800 text-white hover:bg-slate-900'
                  }`}
                >
                  {plan.enterprise ? 'Contact Sales' : 'Get Started'}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Language Teaching?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Choose the perfect plan for your school and unlock the full potential of LanguageGems.
              Start with our demo or contact us for a personalized consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/games"
                className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Play className="h-5 w-5 mr-2 inline" />
                Try Demo Games
              </Link>
              <Link
                href="/schools/contact"
                className="px-8 py-4 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition-colors border-2 border-white/20"
              >
                <Mail className="h-5 w-5 mr-2 inline" />
                Contact Sales
              </Link>
            </div>
            <p className="text-purple-200 text-sm mt-6">
              Questions? Email us at <a href="mailto:support@languagegems.com" className="underline hover:text-white">support@languagegems.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 