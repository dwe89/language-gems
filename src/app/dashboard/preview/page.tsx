'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../../components/auth/AuthProvider';
import {
  ArrowLeft, Crown, Users, BookOpen, BarChart2, Gamepad2, 
  Award, Calendar, FileText, Settings, Star, Zap, Lock,
  Play, Eye, ChevronRight, Sparkles, GraduationCap
} from 'lucide-react';

export default function DashboardPreviewPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'teacher' | 'student'>('teacher');

  const teacherFeatures = [
    {
      icon: Users,
      title: 'Class Management',
      description: 'Create and manage multiple classes, add students, and track enrollment',
      status: 'ready'
    },
    {
      icon: FileText,
      title: 'Assignment Creation',
      description: 'Build custom assignments with vocabulary sets and game integration',
      status: 'ready'
    },
    {
      icon: BarChart2,
      title: 'Advanced Analytics',
      description: 'Deep insights into student progress, performance trends, and learning gaps',
      status: 'coming-soon'
    },
    {
      icon: BookOpen,
      title: 'Vocabulary Mining',
      description: 'AI-powered extraction of vocabulary from texts with automatic categorization',
      status: 'coming-soon'
    },
    {
      icon: Settings,
      title: 'Classroom Controls',
      description: 'Set time limits, restrict content, and manage student permissions',
      status: 'coming-soon'
    },
    {
      icon: Award,
      title: 'Progress Reports',
      description: 'Generate detailed reports for students, parents, and administrators',
      status: 'coming-soon'
    }
  ];

  const studentFeatures = [
    {
      icon: Gamepad2,
      title: 'Interactive Games',
      description: 'Engaging language games tailored to your learning level and assignments',
      status: 'ready'
    },
    {
      icon: FileText,
      title: 'Assignment Hub',
      description: 'View and complete assignments with real-time feedback and progress tracking',
      status: 'ready'
    },
    {
      icon: BarChart2,
      title: 'Personal Progress',
      description: 'Track your learning journey with detailed statistics and achievements',
      status: 'coming-soon'
    },
    {
      icon: Award,
      title: 'Achievement System',
      description: 'Earn badges and certificates as you master new vocabulary and skills',
      status: 'coming-soon'
    },
    {
      icon: Calendar,
      title: 'Study Planner',
      description: 'AI-powered study recommendations based on your progress and deadlines',
      status: 'coming-soon'
    },
    {
      icon: Star,
      title: 'Leaderboards',
      description: 'Compete with classmates and see your ranking in various categories',
      status: 'coming-soon'
    }
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'ready') {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          Ready
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
        Coming Soon
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account/upgrade"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Upgrade
          </Link>
          
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-6 relative">
              <Eye className="h-10 w-10 text-white" />
              <div className="absolute -top-1 -right-1 bg-blue-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                PREVIEW
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Dashboard <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Preview</span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Get a sneak peek at the powerful dashboards we're building for teachers and students. 
              Experience the future of language learning management!
            </p>
          </div>
        </div>

        {/* Dashboard Type Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('teacher')}
              className={`px-8 py-3 rounded-md font-semibold transition-all ${
                activeTab === 'teacher'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <GraduationCap className="h-5 w-5 mr-2 inline" />
              Teacher Dashboard
            </button>
            <button
              onClick={() => setActiveTab('student')}
              className={`px-8 py-3 rounded-md font-semibold transition-all ${
                activeTab === 'student'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Users className="h-5 w-5 mr-2 inline" />
              Student Dashboard
            </button>
          </div>
        </div>

        {/* Teacher Dashboard Preview */}
        {activeTab === 'teacher' && (
          <div className="space-y-12">
            {/* Dashboard Mockup */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Teacher Dashboard</h2>
                    <p className="opacity-90">Comprehensive classroom management at your fingertips</p>
                  </div>
                  <Crown className="h-12 w-12 opacity-80" />
                </div>
              </div>
              
              {/* Mockup Stats */}
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
              
              {/* Mockup Navigation */}
              <div className="flex overflow-x-auto border-b border-slate-200 bg-white">
                {['Classes', 'Assignments', 'Analytics', 'Vocabulary', 'Settings'].map((item, index) => (
                  <div key={index} className="px-6 py-3 text-slate-600 font-medium whitespace-nowrap">
                    {item}
                  </div>
                ))}
              </div>
              
              {/* Mockup Content Area */}
              <div className="p-6 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800">Recent Activity</h3>
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-800">Assignment submitted</div>
                          <div className="text-xs text-slate-500">2 minutes ago</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800">Top Performing Students</h3>
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <Award className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-800">Student Name</div>
                          <div className="text-xs text-slate-500">98% completion rate</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Features */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
                Teacher Dashboard Features
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teacherFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <StatusBadge status={feature.status} />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        {feature.title}
                      </h3>
                      
                      <p className="text-slate-600">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Student Dashboard Preview */}
        {activeTab === 'student' && (
          <div className="space-y-12">
            {/* Dashboard Mockup */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Student Dashboard</h2>
                    <p className="opacity-90">Your personalized learning journey starts here</p>
                  </div>
                  <Gamepad2 className="h-12 w-12 opacity-80" />
                </div>
              </div>
              
              {/* Mockup Progress */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-purple-600 mb-1">73%</div>
                  <div className="text-sm text-slate-600">Overall Progress</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-pink-600 mb-1">5</div>
                  <div className="text-sm text-slate-600">Active Assignments</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-1">247</div>
                  <div className="text-sm text-slate-600">Words Mastered</div>
                </div>
              </div>
              
              {/* Mockup Navigation */}
              <div className="flex overflow-x-auto border-b border-slate-200 bg-white">
                {['Assignments', 'Games', 'Progress', 'Achievements', 'Calendar'].map((item, index) => (
                  <div key={index} className="px-6 py-3 text-slate-600 font-medium whitespace-nowrap">
                    {item}
                  </div>
                ))}
              </div>
              
              {/* Mockup Content Area */}
              <div className="p-6 bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800">Current Assignments</h3>
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-800">Spanish Vocabulary Set #{item}</div>
                          <div className="text-xs text-slate-500">Due in 3 days</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800">Recommended Games</h3>
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                          <Gamepad2 className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-800">Memory Game - Level {item}</div>
                          <div className="text-xs text-slate-500">Perfect for vocabulary practice</div>
                        </div>
                        <Play className="h-4 w-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Student Features */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
                Student Dashboard Features
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <StatusBadge status={feature.status} />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        {feature.title}
                      </h3>
                      
                      <p className="text-slate-600">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-12 text-white">
          <Sparkles className="h-16 w-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Excited About What You See?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            This is just the beginning! We're building the most comprehensive language learning platform for educators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/games"
              className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
            >
              Try Our Games
            </Link>
            <Link
              href="/blog"
              className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors border border-white/20"
            >
              Read Our Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 