'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../../../../components/auth/AuthProvider';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';
import { ArrowLeft, Target, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../../../../components/ui/GemTheme';
import FlagIcon from '../../../../../../components/ui/FlagIcon';

// Sample practice data for Spanish noun gender
const practiceData = [
  {
    id: '1',
    type: 'fill_blank' as const,
    question: 'La mesa es _____ (feminine)',
    answer: 'femenina',
    hint: 'Nouns ending in -a are usually feminine',
    difficulty: 'beginner' as const,
    category: 'Gender Recognition'
  },
  {
    id: '2',
    type: 'fill_blank' as const,
    question: 'El coche es _____ (masculine)',
    answer: 'masculino',
    hint: 'Nouns ending in -e can be masculine or feminine, but coche is masculine',
    difficulty: 'beginner' as const,
    category: 'Gender Recognition'
  },
  {
    id: '3',
    type: 'translation' as const,
    question: 'The house (feminine)',
    answer: 'la casa',
    hint: 'Use "la" for feminine nouns',
    difficulty: 'beginner' as const,
    category: 'Articles and Gender'
  },
  {
    id: '4',
    type: 'translation' as const,
    question: 'The book (masculine)',
    answer: 'el libro',
    hint: 'Use "el" for masculine nouns',
    difficulty: 'beginner' as const,
    category: 'Articles and Gender'
  },
  {
    id: '5',
    type: 'fill_blank' as const,
    question: '_____ problema (the problem)',
    answer: 'El',
    hint: 'Problema is masculine despite ending in -a',
    difficulty: 'intermediate' as const,
    category: 'Exceptions'
  },
  {
    id: '6',
    type: 'fill_blank' as const,
    question: '_____ mano (the hand)',
    answer: 'La',
    hint: 'Mano is feminine despite ending in -o',
    difficulty: 'intermediate' as const,
    category: 'Exceptions'
  },
  {
    id: '7',
    type: 'translation' as const,
    question: 'The student (female)',
    answer: 'la estudiante',
    hint: 'Use la for the female version',
    difficulty: 'intermediate' as const,
    category: 'People and Professions'
  },
  {
    id: '8',
    type: 'translation' as const,
    question: 'The teacher (male)',
    answer: 'el profesor',
    hint: 'Use el for the male version',
    difficulty: 'intermediate' as const,
    category: 'People and Professions'
  }
];

export default function SpanishNounGenderPracticePage() {
  const { user } = useAuth();
  const [showPractice, setShowPractice] = useState(false);

  console.log('🎯 [NOUN GENDER PRACTICE] Page loaded, user:', !!user);

  const handleComplete = async (score: number, gemsEarned: number, timeSpent: number) => {
    console.log('Practice completed!', { score, gemsEarned, timeSpent });
    
    if (user) {
      // Save progress to database for logged-in users
      // TODO: Implement database saving
      alert(`Great job! You scored ${score} points and earned ${gemsEarned} gems!`);
    } else {
      // Show results without saving for free users
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
        category="nouns"
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
