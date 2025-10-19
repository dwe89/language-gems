'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowLeft, CheckCircle, Clock, Award, Lightbulb } from 'lucide-react';

export default function GCSESpeakingExamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/assessments"
            className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-4 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessments
          </Link>
          
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white mr-4">
              <MessageSquare className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">GCSE Speaking Exam</h1>
              <p className="text-xl text-gray-600 mt-2">
                Practice with official exam-style speaking assessments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Coming Soon Section */}
        <div className="bg-white rounded-xl shadow-lg p-12 text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-orange-100 mb-6">
            <MessageSquare className="h-12 w-12 text-orange-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We're currently developing interactive GCSE speaking exam practice with AI-powered feedback and assessment.
          </p>

          <div className="inline-flex items-center px-6 py-3 bg-orange-100 text-orange-800 rounded-lg font-medium">
            <Lightbulb className="h-5 w-5 mr-2" />
            In Development
          </div>
        </div>

        {/* What to Expect Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What to Expect When It Launches
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Role-play scenarios based on exam themes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Photo card description practice</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>General conversation on familiar topics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>AI-powered pronunciation feedback</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Real-time grammar and vocabulary suggestions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Simulated exam conditions with timing</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Structure</h3>
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <MessageSquare className="h-5 w-5 text-orange-600 mr-2" />
                    <p className="font-semibold text-orange-900">Role-play</p>
                  </div>
                  <p className="text-sm text-gray-600">2 minutes preparation + 2 minutes speaking</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <MessageSquare className="h-5 w-5 text-orange-600 mr-2" />
                    <p className="font-semibold text-orange-900">Photo Card</p>
                  </div>
                  <p className="text-sm text-gray-600">Foundation: 2 min prep + 2 min speaking</p>
                  <p className="text-sm text-gray-600">Higher: 1 min prep + 3 min speaking</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <MessageSquare className="h-5 w-5 text-orange-600 mr-2" />
                    <p className="font-semibold text-orange-900">General Conversation</p>
                  </div>
                  <p className="text-sm text-gray-600">Foundation: 3-5 minutes</p>
                  <p className="text-sm text-gray-600">Higher: 5-7 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Boards Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Supported Exam Boards
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">AQA</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">Foundation: 7-9 minutes + 12 min prep</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">Higher: 10-12 minutes + 12 min prep</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">60 marks total</span>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Edexcel</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">Foundation: 7-9 minutes + 12 min prep</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">Higher: 10-12 minutes + 12 min prep</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">70 marks total</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Want to be notified when this launches?</h2>
          <p className="text-lg mb-6 opacity-90">
            Sign up for updates and be the first to try our interactive speaking practice
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Notified
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </Link>
        </div>

        {/* Alternative Practice Section */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">In the Meantime...</h3>
          <p className="text-gray-600 mb-6">
            While we develop the speaking exam feature, you can practice other essential GCSE skills:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/assessments/gcse-reading"
              className="block bg-white border-2 border-blue-300 rounded-lg p-4 hover:shadow-lg hover:border-blue-500 transition-all"
            >
              <h4 className="font-semibold text-gray-900 mb-2">Reading Practice</h4>
              <p className="text-sm text-gray-600">Build comprehension skills</p>
            </Link>

            <Link
              href="/assessments/gcse-listening"
              className="block bg-white border-2 border-blue-300 rounded-lg p-4 hover:shadow-lg hover:border-blue-500 transition-all"
            >
              <h4 className="font-semibold text-gray-900 mb-2">Listening Practice</h4>
              <p className="text-sm text-gray-600">Improve audio comprehension</p>
            </Link>

            <Link
              href="/assessments/gcse-writing"
              className="block bg-white border-2 border-blue-300 rounded-lg p-4 hover:shadow-lg hover:border-blue-500 transition-all"
            >
              <h4 className="font-semibold text-gray-900 mb-2">Writing Practice</h4>
              <p className="text-sm text-gray-600">Master written expression</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

