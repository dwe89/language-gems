'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users, GraduationCap, BarChart3, Trophy, Sparkles,
  BookOpen, Gamepad2, Target, Gem, Award, ArrowRight,
  ChevronRight, Play, Monitor, Smartphone, Star,
  CheckCircle, Zap, Brain, Heart
} from 'lucide-react';
import {
  DEMO_CLASSES,
  ALL_DEMO_STUDENTS,
  DEMO_TEACHER_STATS,
  getDemoTeacherDashboardData,
} from '../../lib/demo/demoData';

export default function DemoPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  const teacherData = getDemoTeacherDashboardData();
  
  const features = [
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track student progress with comprehensive analytics and insights',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Gamepad2,
      title: '10+ Learning Games',
      description: 'Engaging vocabulary games that make learning fun and effective',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: Target,
      title: 'GCSE Aligned',
      description: 'Content perfectly aligned with AQA, Edexcel, and OCR specifications',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Gem,
      title: 'Gamified Rewards',
      description: 'Gems, XP, levels, and achievements to motivate students',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: Brain,
      title: 'FSRS Spaced Repetition',
      description: 'AI-powered memory optimization for long-term retention',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: BookOpen,
      title: 'Full Assessments',
      description: 'Reading, Writing, Listening & Speaking practice exams',
      color: 'from-rose-500 to-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Badge */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Live Demo - No Sign Up Required
            </span>
          </div>

          {/* Main headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold text-center text-white mb-6"
          >
            Experience{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400 bg-clip-text text-transparent">
              Language Gems
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-300 text-center max-w-3xl mx-auto mb-12"
          >
            See exactly how our teacher and student dashboards work with real data. 
            Explore comprehensive analytics, gamified learning, and GCSE exam preparation.
          </motion.p>

          {/* Stats bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8 mb-16"
          >
            {[
              { value: '3', label: 'Demo Classes', icon: BookOpen },
              { value: `${ALL_DEMO_STUDENTS.length}`, label: 'Demo Students', icon: Users },
              { value: '10+', label: 'Game Types', icon: Gamepad2 },
              { value: '1000+', label: 'Vocabulary Items', icon: Brain },
            ].map((stat, i) => (
              <div key={i} className="flex items-center space-x-3 bg-white/5 backdrop-blur-lg rounded-xl px-6 py-3 border border-white/10">
                <stat.icon className="w-6 h-6 text-purple-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Dashboard Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Teacher Dashboard Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onMouseEnter={() => setHoveredCard('teacher')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Link href="/demo/teacher-dashboard">
                <div className={`relative group bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 cursor-pointer ${hoveredCard === 'teacher' ? 'scale-[1.02] shadow-2xl shadow-blue-500/20' : ''}`}>
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                    <Users className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h2 className="text-3xl font-bold text-white mb-3">Teacher Dashboard</h2>
                  <p className="text-gray-300 mb-6">
                    Manage classes, track student progress, view analytics, and create assignments. 
                    See how teachers monitor learning across {DEMO_CLASSES.length} language classes.
                  </p>

                  {/* Features list */}
                  <div className="space-y-3 mb-8">
                    {[
                      'Multi-class overview with real-time stats',
                      'Individual student progress tracking',
                      'Assignment creation and management',
                      'Comprehensive analytics dashboard',
                      'Vocabulary mastery insights',
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center text-gray-300">
                        <CheckCircle className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Demo data preview */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {DEMO_CLASSES.map((cls) => (
                      <div key={cls.id} className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-2xl mb-1">{cls.icon}</div>
                        <div className="text-xs text-gray-400">{cls.language}</div>
                        <div className="text-sm font-semibold text-white">{cls.student_count} students</div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-semibold">Explore Teacher View</span>
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Student Dashboard Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              onMouseEnter={() => setHoveredCard('student')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Link href="/demo/student-dashboard">
                <div className={`relative group bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 cursor-pointer ${hoveredCard === 'student' ? 'scale-[1.02] shadow-2xl shadow-purple-500/20' : ''}`}>
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h2 className="text-3xl font-bold text-white mb-3">Student Dashboard</h2>
                  <p className="text-gray-300 mb-6">
                    Experience learning as a student! See assignments, play vocabulary games, 
                    track progress, earn gems, and level up through gamified learning.
                  </p>

                  {/* Features list */}
                  <div className="space-y-3 mb-8">
                    {[
                      'Personal progress tracking & stats',
                      'Gamified rewards with gems & levels',
                      'FSRS-powered vocabulary mastery',
                      'Assignment completion tracking',
                      'Achievement badges & streaks',
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center text-gray-300">
                        <CheckCircle className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Demo student preview */}
                  <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        E
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold">Emma Smith</div>
                        <div className="text-sm text-gray-400">French GCSE • Year 10</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-amber-400">
                          <Gem className="w-4 h-4 mr-1" />
                          <span className="font-bold">234</span>
                        </div>
                        <div className="text-sm text-gray-400">Level 8</div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-semibold">Explore Student View</span>
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need for{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Language Learning
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Language Gems combines cutting-edge technology with proven learning methods 
              to create an engaging, effective language learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Languages Section */}
      <div className="py-16 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Supported Languages</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { flag: '🇫🇷', name: 'French', students: 28 },
              { flag: '🇪🇸', name: 'Spanish', students: 24 },
              { flag: '🇩🇪', name: 'German', students: 22 },
            ].map((lang, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-lg rounded-2xl px-8 py-6 border border-white/10 flex items-center space-x-4">
                <span className="text-4xl">{lang.flag}</span>
                <div className="text-left">
                  <div className="text-xl font-semibold text-white">{lang.name}</div>
                  <div className="text-sm text-gray-400">{lang.students} demo students</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-xl rounded-3xl p-12 border border-purple-500/30">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Explore?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Dive into our fully-featured demo dashboards. No sign-up required!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo/teacher-dashboard">
                <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Teacher Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/demo/student-dashboard">
                <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center space-x-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>Student Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center pb-12 text-gray-500 text-sm">
        <p>This demo uses synthetic data to showcase Language Gems features.</p>
        <p className="mt-1">
          <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors">
            ← Back to Language Gems
          </Link>
        </p>
      </div>

      {/* CSS for blob animation */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
