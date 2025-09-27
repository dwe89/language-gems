'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../../../../components/auth/AuthProvider';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';
import { ArrowLeft, Award, Users, Clock, Trophy } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../../../../components/ui/GemTheme';
import FlagIcon from '../../../../../../components/ui/FlagIcon';
import { Metadata } from 'next';

// Sample quiz data for Spanish adjective agreement
const quizData = {
  id: 'spanish-adjective-agreement-quiz',
  title: 'Spanish Adjective Agreement Quiz',
  description: 'Test your knowledge of Spanish adjective agreement',
  difficulty_level: 'beginner',
  estimated_duration: 10,
  questions: [
    {
      id: '1',
      question_text: 'Choose the correct form: La mesa _____ (blanco)',
      question_type: 'multiple_choice' as const,
      correct_answer: 'blanca',
      options: ['blanco', 'blanca', 'blancos', 'blancas'],
      explanation: 'Mesa is feminine singular, so the adjective must be "blanca" (feminine singular).',
      difficulty_level: 'beginner',
      hint_text: 'Look at the gender and number of "mesa"'
    },
    {
      id: '2',
      question_text: 'Choose the correct form: Los coches _____ (nuevo)',
      question_type: 'multiple_choice' as const,
      correct_answer: 'nuevos',
      options: ['nuevo', 'nueva', 'nuevos', 'nuevas'],
      explanation: 'Coches is masculine plural, so the adjective must be "nuevos" (masculine plural).',
      difficulty_level: 'beginner',
      hint_text: 'Look at the gender and number of "coches"'
    },
    {
      id: '3',
      question_text: 'Complete: Las chicas _____ (hermoso)',
      question_type: 'fill_blank' as const,
      correct_answer: 'hermosas',
      explanation: 'Chicas is feminine plural, so the adjective must be "hermosas" (feminine plural).',
      difficulty_level: 'beginner',
      hint_text: 'The adjective must match both gender and number'
    },
    {
      id: '4',
      question_text: 'Complete: El estudiante _____ (inteligente)',
      question_type: 'fill_blank' as const,
      correct_answer: 'inteligente',
      explanation: 'Adjectives ending in -e like "inteligente" don\'t change for gender, only for number.',
      difficulty_level: 'intermediate',
      hint_text: 'Some adjectives don\'t change for gender'
    },
    {
      id: '5',
      question_text: 'Which is correct for "flores verdes" (green flowers)?',
      question_type: 'multiple_choice' as const,
      correct_answer: 'Both adjective and noun are plural',
      options: [
        'Only the noun is plural',
        'Only the adjective is plural', 
        'Both adjective and noun are plural',
        'Neither is plural'
      ],
      explanation: 'Both "flores" (flowers) and "verdes" (green) are plural forms.',
      difficulty_level: 'intermediate',
      hint_text: 'Count the number of flowers'
    },
    {
      id: '6',
      question_text: 'True or False: Adjectives of nationality always agree in gender and number',
      question_type: 'true_false' as const,
      correct_answer: 'false',
      explanation: 'Some nationality adjectives like "canadiense" don\'t change for gender.',
      difficulty_level: 'intermediate',
      hint_text: 'Think about words ending in -e'
    },
    {
      id: '7',
      question_text: 'Choose the correct form: Una casa _____ (grande)',
      question_type: 'multiple_choice' as const,
      correct_answer: 'grande',
      options: ['grande', 'grandes', 'granda', 'grandas'],
      explanation: '"Grande" shortens to "gran" before singular nouns but keeps its full form after.',
      difficulty_level: 'advanced',
      hint_text: 'This adjective has the same form for masculine and feminine'
    },
    {
      id: '8',
      question_text: 'Complete: Unos problemas _____ (fácil)',
      question_type: 'fill_blank' as const,
      correct_answer: 'fáciles',
      explanation: 'Problemas is masculine plural, so the adjective becomes "fáciles" (plural).',
      difficulty_level: 'intermediate',
      hint_text: 'Remember that "problema" is masculine despite ending in -a'
    }
  ]
};

export default function SpanishAdjectiveAgreementQuizPage() {
  const { user } = useAuth();
  const [showQuiz, setShowQuiz] = useState(false);

  console.log('🏆 [ADJECTIVE AGREEMENT QUIZ] Page loaded, user:', !!user);

  const handleComplete = async (score: number, answers: any[], timeSpent: number) => {
    console.log('Quiz completed!', { score, answers, timeSpent });
    
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
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Adjective Agreement Quiz</h1>
                  <p className="text-gray-600">Test your knowledge of Spanish adjective agreement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Quiz Mode Info */}
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

          {/* Start Quiz Button */}
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
