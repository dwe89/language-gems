#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to generate the correct practice page template
function generatePracticePageTemplate(topicName, practiceItems) {
  const topicSlug = topicName.toLowerCase().replace(/\s+/g, '-');
  const topicTitle = topicName.charAt(0).toUpperCase() + topicName.slice(1).replace(/-/g, ' ');
  const componentName = topicTitle.replace(/\s+/g, '');
  
  return `'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Gem, User, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { GemButton, GemCard } from '../../../../../../components/ui/GemTheme';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';
import { useAuth } from '../../../../../../components/auth/AuthProvider';

// Practice data for Spanish ${topicTitle}
const practiceData = ${JSON.stringify(practiceItems, null, 2)};

export default function Spanish${componentName}PracticePage() {
  const { user } = useAuth();
  const [showPractice, setShowPractice] = useState(false);

  const handleComplete = async (score: number, gemsEarned: number, timeSpent: number) => {
    console.log('Practice completed!', { score, gemsEarned, timeSpent });
    
    if (user) {
      // Save progress to database for logged-in users
      // TODO: Implement database saving
      alert(\`Great job! You scored \${score} points and earned \${gemsEarned} gems!\`);
    } else {
      // Show results without saving for free users
      alert(\`Great job! You scored \${score} points! Sign up to save your progress and earn gems.\`);
    }
    
    setShowPractice(false);
  };

  const handleExit = () => {
    setShowPractice(false);
  };

  if (showPractice) {
    return (
      <GrammarPractice
        language="spanish"
        category="verbs"
        difficulty="intermediate"
        practiceItems={practiceData}
        onComplete={handleComplete}
        onExit={handleExit}
        gamified={!!user} // Only gamified for logged-in users
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/grammar/spanish/verbs/${topicSlug}"
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">${topicTitle} Practice</h1>
                  <p className="text-gray-600 text-lg">Test your Spanish ${topicTitle.toLowerCase()} skills</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <GemCard className="shadow-xl border border-gray-200">
            <div className="text-center">
              <div className="mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full">
                    <Target className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Practice?</h2>
                <p className="text-gray-600 text-lg mb-6">
                  Test your knowledge with \${practiceData.length} interactive exercises.
                </p>
              </div>

              {/* User Status */}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-center mb-4">
                  {user ? (
                    <UserCheck className="w-8 h-8 text-green-600 mr-3" />
                  ) : (
                    <User className="w-8 h-8 text-gray-500 mr-3" />
                  )}
                  <h3 className="text-xl font-semibold text-gray-800">
                    {user ? 'Premium Practice Mode' : 'Free Practice Mode'}
                  </h3>
                </div>
                <div className="text-gray-600">
                  {user ? (
                    <div>
                      <p className="mb-2">✅ Progress tracking and gem rewards</p>
                      <p className="mb-2">✅ Detailed performance analytics</p>
                      <p>✅ Unlimited practice attempts</p>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2">✅ Full access to practice exercises</p>
                      <p className="mb-2">❌ Progress tracking (sign up to unlock)</p>
                      <p>❌ Gem rewards (sign up to unlock)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Start Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GemButton
                  variant="gem"
                  gemType={user ? "rare" : "common"}
                  onClick={() => setShowPractice(true)}
                  className="px-8 py-4 text-lg"
                >
                  <Target className="w-6 h-6 mr-2" />
                  Start Practice
                </GemButton>
                
                {!user && (
                  <GemButton
                    variant="gem"
                    gemType="epic"
                    onClick={() => window.location.href = '/auth/signup'}
                    className="px-8 py-4 text-lg"
                  >
                    <Gem className="w-6 h-6 mr-2" />
                    Sign Up for Full Features
                  </GemButton>
                )}
              </div>
            </div>
          </GemCard>
        </div>
      </div>
    </div>
  );
}
`;
}

console.log('Practice page template generator ready!');
console.log('Use this to generate templates for each topic.');
