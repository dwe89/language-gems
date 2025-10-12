'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, Target, TrendingUp, BarChart3, Zap, Award, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VocabMasterMarketingLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Brain className="h-16 w-16 text-yellow-300" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              VocabMaster
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              The Fastest Path to Language Fluency
            </p>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Adaptive learning fueled by intelligent spaced repetition.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/signup"
                className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link
                href="/signup"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                Start Free Trial
                <Sparkles className="h-5 w-5" />
              </Link>
            </div>

            {/* Mock Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative max-w-5xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-white/20">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-white/80 text-sm font-medium">VocabMaster Dashboard</span>
                </div>
                <img 
                  src="/images/vocabmaster-dashboard-preview.png" 
                  alt="VocabMaster Dashboard Preview"
                  className="w-full"
                  onError={(e) => {
                    // Fallback to placeholder
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"%3E%3Crect fill="%23f3f4f6" width="1200" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%239ca3af"%3EDashboard Preview%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why VocabMaster Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on proven learning science and designed specifically for UK curriculum requirements
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Intelligent Learning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Intelligent Spaced Repetition
              </h3>
              <p className="text-gray-600 mb-4">
                Review words at the perfect moment—before you forget them. Our FSRS algorithm adapts to each student's learning pace.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Personalized review schedules</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Automatic difficulty adjustment</span>
                </li>
              </ul>
            </motion.div>

            {/* Feature 2: Curriculum Alignment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                UK Curriculum Aligned
              </h3>
              <p className="text-gray-600 mb-4">
                Practice tied directly to KS3, KS4, and GCSE requirements. AQA and Edexcel exam board support.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Topic-specific vocabulary lists</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Foundation & Higher tier support</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Exam-ready practice modes</span>
                </li>
              </ul>
            </motion.div>

            {/* Feature 3: Teacher Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 border border-green-100"
            >
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Actionable Teacher Insights
              </h3>
              <p className="text-gray-600 mb-4">
                Our unified dashboard gives teachers instant visibility into student progress and struggling areas.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Word-level accuracy tracking</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Identify struggling students instantly</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Export data for intervention planning</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Language Teaching?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of schools already using VocabMaster to improve student outcomes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?subject=VocabMaster%20School%20Demo"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              Request School Demo
              <ArrowRight className="h-5 w-5" />
            </Link>
            
            <Link
              href="/pricing"
              className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

