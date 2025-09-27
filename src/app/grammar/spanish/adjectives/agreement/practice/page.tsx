'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../../../../components/auth/AuthProvider';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';
import { ArrowLeft, Target, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../../../../components/ui/GemTheme';
import FlagIcon from '../../../../../../components/ui/FlagIcon';
import { Metadata } from 'next';

// Sample practice data for Spanish adjective agreement
const practiceData = [
  {
    id: '1',
    type: 'fill_blank' as const,
    question: 'La casa _____ (blanco)',
    answer: 'blanca',
    hint: 'The adjective must agree with the feminine noun "casa"',
    difficulty: 'beginner' as const,
    category: 'Gender Agreement'
  },
  {
    id: '2',
    type: 'fill_blank' as const,
    question: 'El coche _____ (rojo)',
    answer: 'rojo',
    hint: 'The adjective agrees with the masculine noun "coche"',
    difficulty: 'beginner' as const,
    category: 'Gender Agreement'
  },
  {
    id: '3',
    type: 'fill_blank' as const,
    question: 'Las casas _____ (grande)',
    answer: 'grandes',
    hint: 'The adjective must be plural to match "casas"',
    difficulty: 'beginner' as const,
    category: 'Number Agreement'
  },
  {
    id: '4',
    type: 'fill_blank' as const,
    question: 'Los coches _____ (azul)',
    answer: 'azules',
    hint: 'The adjective must be plural and masculine',
    difficulty: 'beginner' as const,
    category: 'Number Agreement'
  },
  {
    id: '5',
    type: 'translation' as const,
    question: 'The beautiful girls',
    answer: 'las chicas hermosas',
    hint: 'Both article and adjective must agree with feminine plural noun',
    difficulty: 'intermediate' as const,
    category: 'Complete Agreement'
  },
  {
    id: '6',
    type: 'translation' as const,
    question: 'The tall boy',
    answer: 'el chico alto',
    hint: 'Masculine singular agreement',
    difficulty: 'intermediate' as const,
    category: 'Complete Agreement'
  },
  {
    id: '7',
    type: 'fill_blank' as const,
    question: 'Una estudiante muy _____ (inteligente)',
    answer: 'inteligente',
    hint: 'Some adjectives like "inteligente" don\'t change form for gender',
    difficulty: 'intermediate' as const,
    category: 'Invariant Adjectives'
  },
  {
    id: '8',
    type: 'fill_blank' as const,
    question: 'Unas flores _____ (verde)',
    answer: 'verdes',
    hint: 'Color adjectives ending in -e only change for number',
    difficulty: 'intermediate' as const,
    category: 'Invariant Adjectives'
  }
];

export default function SpanishAdjectiveAgreementPracticePage() {
  const { user } = useAuth();
  const [showPractice, setShowPractice] = useState(false);

  console.log('🎯 [ADJECTIVE AGREEMENT PRACTICE] Page loaded, user:', !!user);

  const handleComplete = async (score: number, gemsEarned: number, timeSpent: number) => {
    console.log('Practice completed!', { score, gemsEarned, timeSpent });
    
    if (user) {
      alert(`Great job! You scored ${score} points and earned ${gemsEarned} gems!`);
    } else {
      alert(`Great job! You scored ${score} points! Sign up to save your progress and earn gems.`);
    }
    
    setShowPractice(false);
  };

  const handleExit = () => {
    setShowPractice(false);
  };

  if (showPractice) {
    return (
      <GrammarPractice
        language="es"
        category="adjectives"
        difficulty="beginner"
        practiceItems={practiceData}
        onComplete={handleComplete}
        onExit={handleExit}
        gamified={!!user}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/grammar/spanish/adjectives/agreement"
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
                  <h1 className="text-3xl font-bold text-gray-800">Adjective Agreement Practice</h1>
                  <p className="text-gray-600">Practice Spanish adjective gender and number agreement</p>
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
                Practice Spanish adjective agreement without any pressure. Get immediate feedback 
                and unlimited attempts to master gender and number agreement.
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

          {/* Start Practice Button */}
          <div className="text-center">
            <GemButton
              onClick={() => setShowPractice(true)}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Target className="w-5 h-5 mr-2" />
              Start Practice
            </GemButton>
          </div>
        </div>
      </div>
    </div>
  );
}
