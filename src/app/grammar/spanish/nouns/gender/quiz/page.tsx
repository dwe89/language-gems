'use client';

import React from 'react';
import { useAuth } from '../../../../../../components/auth/AuthProvider';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';
import { ArrowLeft, Award, Users, Clock, Trophy } from 'lucide-react';
import Link from 'next/link';
import { GemCard } from '../../../../../../components/ui/GemTheme';
import FlagIcon from '../../../../../../components/ui/FlagIcon';

export default function SpanishNounGenderQuizPage() {
  const { user } = useAuth();

  console.log('🏆 [NOUN GENDER QUIZ] Page loaded, user:', !!user);

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
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Noun Gender Quiz</h1>
                  <p className="text-gray-600">Test your knowledge of Spanish noun gender</p>
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

          {/* Quiz Component */}
          <GrammarQuiz
            language="es"
            category="nouns"
            topic="gender"
            title="Spanish Noun Gender Quiz"
            onComplete={(score) => {
              console.log('🏆 [NOUN GENDER QUIZ] Quiz completed with score:', score);
            }}
            onExit={() => {
              console.log('🏆 [NOUN GENDER QUIZ] Quiz exited');
              window.location.href = '/grammar/spanish/nouns/gender';
            }}
            userId={user?.id}
            trackProgress={!!user}
            timeLimit={user ? 300 : undefined} // 5 minutes for logged-in users
          />
        </div>
      </div>
    </div>
  );
}
