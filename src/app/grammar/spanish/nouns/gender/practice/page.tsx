'use client';

import React from 'react';
import { useAuth } from '../../../../../../components/auth/AuthProvider';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';
import { ArrowLeft, Target, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { GemCard } from '../../../../../../components/ui/GemTheme';
import FlagIcon from '../../../../../../components/ui/FlagIcon';

export default function SpanishNounGenderPracticePage() {
  const { user } = useAuth();

  console.log('🎯 [NOUN GENDER PRACTICE] Page loaded, user:', !!user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/grammar/spanish/nouns/gender"
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-4">
                <FlagIcon countryCode="ES" size="lg" />
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Noun Gender Practice</h1>
                  <p className="text-gray-600">Practice identifying masculine and feminine nouns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Practice Mode Info */}
          <div className="mb-8">
            <GemCard className="shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Practice Mode</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Free for everyone
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    No time limit
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Practice identifying Spanish noun gender without any pressure. Get immediate feedback 
                and unlimited attempts to master the concepts.
              </p>
              {!user && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-700 text-sm">
                    💡 <strong>Tip:</strong> Create a free account to track your progress and earn gems for correct answers!
                  </p>
                </div>
              )}
            </GemCard>
          </div>

          {/* Practice Component */}
          <GrammarPractice
            language="es"
            category="nouns"
            topic="gender"
            title="Spanish Noun Gender"
            onComplete={() => {
              console.log('🎯 [NOUN GENDER PRACTICE] Practice completed');
            }}
            onExit={() => {
              console.log('🎯 [NOUN GENDER PRACTICE] Practice exited');
              window.location.href = '/grammar/spanish/nouns/gender';
            }}
            userId={user?.id}
            gamified={!!user}
          />
        </div>
      </div>
    </div>
  );
}
