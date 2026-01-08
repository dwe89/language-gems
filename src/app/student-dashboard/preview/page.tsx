'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../../components/auth/AuthProvider';
import {
  ArrowLeft, Crown, Users, BookOpen, BarChart2, Gamepad2, 
  Award, Calendar, FileText, Settings, Star, Zap, Lock,
  Play, Eye, ChevronRight, Sparkles, GraduationCap, Trophy,
  Target, Gem, Bell
} from 'lucide-react';

export default function StudentDashboardPreviewPage() {
  const { user } = useAuth();

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
    },
    {
      icon: Target,
      title: 'Personalized Learning',
      description: 'AI adapts to your learning style and provides customized content',
      status: 'coming-soon'
    },
    {
      icon: Trophy,
      title: 'Competitions',
      description: 'Join class and school-wide competitions to test your skills',
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account/upgrade"
            className="inline-flex items-center text-indigo-100 hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Upgrade
          </Link>
          
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 relative border border-white/30">
              <Gem className="h-10 w-10 text-white" />
              <div className="absolute -top-1 -right-1 bg-blue-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                PREVIEW
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Student Dashboard <span className="text-yellow-300">Preview</span>
            </h1>
            
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
              Experience the future of personalized language learning. See how students will engage with assignments, track progress, and master new skills.
            </p>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20 mb-12">
          {/* Dashboard Header */}
          <div className="bg-indigo-800 text-white py-3 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Gem className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">LanguageGems Dashboard</h2>
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
                  { title: 'Translation Tycoon', desc: 'Manage your translation empire', icon: '🏢' }
                ].map((game, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-lg">
                      {game.icon}
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

        {/* Student Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Student Dashboard Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all border border-white/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <StatusBadge status={feature.status} />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-indigo-100 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* What Students Will Love */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-16 border border-white/20">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            What Students Will Love
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="h-8 w-8 text-yellow-900" />
              </div>
              <h3 className="text-xl font-semibold text-white">Gamified Learning</h3>
              <p className="text-indigo-100">
                Turn language learning into an adventure with points, badges, and leaderboards
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto">
                <Target className="h-8 w-8 text-green-900" />
              </div>
              <h3 className="text-xl font-semibold text-white">Personalized Path</h3>
              <p className="text-indigo-100">
                AI adapts to each student's learning style and pace for optimal progress
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-pink-900" />
              </div>
              <h3 className="text-xl font-semibold text-white">Social Learning</h3>
              <p className="text-indigo-100">
                Collaborate with classmates and compete in friendly challenges
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
          <Sparkles className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Transform Learning?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-indigo-100">
            This is just the beginning! We're building the most engaging language learning experience for students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/activities"
              className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
            >
              Try Our Games Now
            </Link>
            <Link
              href="/dashboard/preview"
              className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors border border-white/20"
            >
              See Teacher Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 