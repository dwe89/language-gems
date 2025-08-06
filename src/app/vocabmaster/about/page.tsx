'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  Sparkles,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Headphones,
  Keyboard,
  Zap,
  Trophy,
  BarChart3
} from 'lucide-react';

export default function VocabMasterAboutPage() {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Intelligent Spaced Repetition",
      description: "Scientifically-proven algorithm that shows you words just before you forget them, maximizing long-term retention."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Adaptive Learning",
      description: "AI-powered system that adjusts difficulty and frequency based on your individual performance and learning patterns."
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "8 Engaging Game Modes",
      description: "From flashcards to dictation, multiple ways to practice vocabulary that keep learning fresh and engaging."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Detailed Progress Tracking",
      description: "Comprehensive analytics show your vocabulary growth, weak areas, and learning streaks."
    }
  ];

  const gameModes = [
    { icon: <BookOpen className="h-6 w-6" />, name: "Learn New Words", description: "Guided introduction to unfamiliar vocabulary" },
    { icon: <Target className="h-6 w-6" />, name: "Review Weak Words", description: "Targeted practice on challenging vocabulary" },
    { icon: <Headphones className="h-6 w-6" />, name: "Listening Comprehension", description: "Audio-based vocabulary practice" },
    { icon: <Keyboard className="h-6 w-6" />, name: "Dictation", description: "Listen and type in target language" },
    { icon: <Zap className="h-6 w-6" />, name: "Speed Challenge", description: "Fast-paced vocabulary testing" },
    { icon: <BookOpen className="h-6 w-6" />, name: "Context Practice", description: "Learn words in sentence context" },
    { icon: <Brain className="h-6 w-6" />, name: "Flashcards", description: "Classic self-assessment method" },
    { icon: <Sparkles className="h-6 w-6" />, name: "Mixed Review", description: "Variety of exercise types" }
  ];

  const benefits = [
    "Built on smart review science for lasting memory.",
    "Reduces study time while improving learning outcomes",
    "Adapts to your individual learning pace and style",
    "Works for Spanish, French, and German vocabulary",
    "Suitable for all curriculum levels (KS2-KS5)",
    "Teacher-approved for classroom use"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-yellow-300 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <Brain className="h-16 w-16 text-yellow-300 mr-4" />
              <h1 className="text-5xl md:text-6xl font-bold">VocabMaster</h1>
            </div>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              The most effective way to master vocabulary using intelligent spaced repetition and adaptive learning
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/vocabmaster"
                className="inline-flex items-center px-8 py-4 bg-white text-purple-700 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Start Learning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/games"
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl font-semibold text-lg hover:bg-white/20 transition-colors"
              >
                Explore All Games
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why VocabMaster Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on proven learning science and designed for maximum retention and engagement
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">8 Engaging Learning Modes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to practice vocabulary that adapt to your learning style and keep you engaged
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gameModes.map((mode, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-600 mb-3 flex justify-center">{mode.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{mode.name}</h3>
                <p className="text-sm text-gray-600">{mode.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Proven Results</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
Join students and teachers who are transforming their vocabulary learning.            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-8"
            >
              <div className="text-center">
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Master Vocabulary?</h3>
                <p className="text-gray-600 mb-6">
                  Start your journey with intelligent spaced repetition and see the difference in your language learning.
                </p>
                <Link
                  href="/vocabmaster"
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
