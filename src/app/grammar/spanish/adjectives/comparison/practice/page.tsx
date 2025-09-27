'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../../../../components/auth/AuthProvider';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';
import { ArrowLeft, Target, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../../../../components/ui/GemTheme';
import FlagIcon from '../../../../../../components/ui/FlagIcon';

// Sample practice data for Spanish adjective comparison
const practiceData = [
  {
    id: '1',
    type: 'fill_blank' as const,
    question: 'María es _____ alta _____ Ana. (María is taller than Ana)',
    answer: 'más que',
    hint: 'Use "más... que" for comparisons of superiority',
    difficulty: 'beginner' as const,
    category: 'Comparatives'
  },
  {
    id: '2',
    type: 'fill_blank' as const,
    question: 'Pedro es _____ inteligente _____ Juan. (Pedro is less intelligent than Juan)',
    answer: 'menos que',
    hint: 'Use "menos... que" for comparisons of inferiority',
    difficulty: 'beginner' as const,
    category: 'Comparatives'
  },
  {
    id: '3',
    type: 'fill_blank' as const,
    question: 'Carmen es _____ alta _____ su hermana. (Carmen is as tall as her sister)',
    answer: 'tan como',
    hint: 'Use "tan... como" for equality comparisons',
    difficulty: 'beginner' as const,
    category: 'Equality'
  },
  {
    id: '4',
    type: 'translation' as const,
    question: 'The fastest car',
    answer: 'el coche más rápido',
    hint: 'Use "más" + adjective for superlatives',
    difficulty: 'intermediate' as const,
    category: 'Superlatives'
  },
  {
    id: '5',
    type: 'fill_blank' as const,
    question: 'Esta es la casa _____ grande _____ la ciudad. (This is the biggest house in the city)',
    answer: 'más de',
    hint: 'Use "más... de" in superlative constructions',
    difficulty: 'intermediate' as const,
    category: 'Superlatives'
  },
  {
    id: '6',
    type: 'fill_blank' as const,
    question: 'Mi hermano es _____ (better) que yo en matemáticas.',
    answer: 'mejor',
    hint: 'Some adjectives have irregular comparative forms',
    difficulty: 'intermediate' as const,
    category: 'Irregular Comparatives'
  },
  {
    id: '7',
    type: 'fill_blank' as const,
    question: 'Esta comida está _____ (worse) que la de ayer.',
    answer: 'peor',
    hint: '"Peor" is the irregular comparative of "malo"',
    difficulty: 'intermediate' as const,
    category: 'Irregular Comparatives'
  },
  {
    id: '8',
    type: 'translation' as const,
    question: 'The youngest student in the class',
    answer: 'el estudiante más joven de la clase',
    hint: 'Remember to use "de" after superlatives',
    difficulty: 'advanced' as const,
    category: 'Complex Superlatives'
  }
];

export default function SpanishAdjectiveComparisonPracticePage() {
  const { user } = useAuth();
  const [showPractice, setShowPractice] = useState(false);

  console.log('🎯 [ADJECTIVE COMPARISON PRACTICE] Page loaded, user:', !!user);

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
                href="/grammar/spanish/adjectives/comparison"
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
                  <h1 className="text-3xl font-bold text-gray-800">Comparison Practice</h1>
                  <p className="text-gray-600">Practice Spanish comparatives and superlatives</p>
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
                Practice Spanish comparatives and superlatives without any pressure. Master más que, 
                menos que, tan como, and superlative constructions.
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
