'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../../../../components/auth/AuthProvider';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';
import { ArrowLeft, Award, Users, Clock, Trophy } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../../../../components/ui/GemTheme';
import FlagIcon from '../../../../../../components/ui/FlagIcon';

// Sample quiz data for Spanish adjective comparison
const quizData = {
  id: 'spanish-adjective-comparison-quiz',
  title: 'Spanish Comparison Quiz',
  description: 'Test your knowledge of Spanish comparatives and superlatives',
  difficulty_level: 'beginner',
  estimated_duration: 10,
  questions: [
    {
      id: '1',
      question_text: 'Choose the correct form: María es _____ alta _____ Ana.',
      question_type: 'multiple_choice' as const,
      correct_answer: 'más que',
      options: ['más que', 'menos que', 'tan como', 'más de'],
      explanation: 'Use "más... que" to express superiority comparisons (María is taller than Ana).',
      difficulty_level: 'beginner',
      hint_text: 'This expresses that María is taller'
    },
    {
      id: '2',
      question_text: 'Complete: Este coche es _____ rápido _____ el otro.',
      question_type: 'fill_blank' as const,
      correct_answer: 'menos que',
      explanation: 'Use "menos... que" to express inferiority comparisons.',
      difficulty_level: 'beginner',
      hint_text: 'This car is less fast than the other'
    },
    {
      id: '3',
      question_text: 'Choose the correct form: Carmen es _____ alta _____ su hermana.',
      question_type: 'multiple_choice' as const,
      correct_answer: 'tan como',
      options: ['más que', 'menos que', 'tan como', 'mejor que'],
      explanation: 'Use "tan... como" to express equality in comparisons.',
      difficulty_level: 'beginner',
      hint_text: 'They are the same height'
    },
    {
      id: '4',
      question_text: 'What is the correct superlative: "The fastest car"?',
      question_type: 'multiple_choice' as const,
      correct_answer: 'el coche más rápido',
      options: ['el coche más rápido', 'el coche menos rápido', 'el coche tan rápido', 'el coche muy rápido'],
      explanation: 'Superlatives are formed with "el/la/los/las + más + adjective".',
      difficulty_level: 'intermediate',
      hint_text: 'Think about the structure for superlatives'
    },
    {
      id: '5',
      question_text: 'Complete: Mi hermano es _____ (better) que yo.',
      question_type: 'fill_blank' as const,
      correct_answer: 'mejor',
      explanation: '"Mejor" is the irregular comparative form of "bueno" (good).',
      difficulty_level: 'intermediate',
      hint_text: 'This is an irregular comparative'
    },
    {
      id: '6',
      question_text: 'True or False: "Peor" is the comparative form of "malo"',
      question_type: 'true_false' as const,
      correct_answer: 'true',
      explanation: '"Peor" (worse) is indeed the irregular comparative form of "malo" (bad).',
      difficulty_level: 'intermediate',
      hint_text: 'Think about irregular comparatives'
    }
  ]
};

export default function SpanishAdjectiveComparisonQuizPage() {
  const { user } = useAuth();
  const [showQuiz, setShowQuiz] = useState(false);

  const handleComplete = async (score: number, answers: any[], timeSpent: number) => {
    if (user) {
      const percentage = Math.round((score / quizData.questions.length) * 100);
      alert(`Great job! You scored ${score}/${quizData.questions.length} (${percentage}%) in ${Math.round(timeSpent / 1000)} seconds!`);
    } else {
      const percentage = Math.round((score / quizData.questions.length) * 100);
      alert(`Great job! You scored ${score}/${quizData.questions.length} (${percentage}%)! Sign up to track your progress.`);
    }
    setShowQuiz(false);
  };

  const handleExit = () => {
    setShowQuiz(false);
  };

  if (showQuiz) {
    return (
      <GrammarQuiz
        quizData={quizData}
        onComplete={handleComplete}
        onExit={handleExit}
        showHints={true}
        timeLimit={user ? 300 : undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
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
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Comparison Quiz</h1>
                  <p className="text-gray-600">Test your knowledge of Spanish comparatives and superlatives</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <GemCard className="shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Quiz Mode</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {user ? (
                    <>
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 mr-1 text-purple-500" />
                        Progress tracked
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Timed assessment
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Free for everyone
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        No time limit
                      </div>
                    </>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                {user 
                  ? 'Test your knowledge with this comprehensive quiz. Your results will be saved and contribute to your learning progress.'
                  : 'Test your knowledge with this comprehensive quiz. Results won\'t be saved, but you\'ll get immediate feedback on your answers.'
                }
              </p>
              {!user && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-700 text-sm">
                    💎 <strong>Upgrade:</strong> Create a free account to track your quiz results, earn gems, and unlock advanced features!
                  </p>
                </div>
              )}
            </GemCard>
          </div>

          <div className="text-center">
            <GemButton
              onClick={() => setShowQuiz(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              <Award className="w-5 h-5 mr-2" />
              Start Quiz
            </GemButton>
          </div>
        </div>
      </div>
    </div>
  );
}
