'use client';

import React from 'react';
import { Trophy, ArrowLeft, Play, Sparkles, Target, CheckCircle } from 'lucide-react';

interface GameCompletionModalProps {
    isOpen: boolean;
    gameId: string;
    gameName: string;
    uniqueCorrectWords: number;
    wordsRequired: number;
    assignmentProgress: number;
    isAssignmentComplete: boolean;
    onGoBack: () => void;
    onContinue: () => void;
}

export default function GameCompletionModal({
    isOpen,
    gameId,
    gameName,
    uniqueCorrectWords,
    wordsRequired,
    assignmentProgress,
    isAssignmentComplete,
    onGoBack,
    onContinue
}: GameCompletionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-scaleIn">
                {/* Header with celebration */}
                <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-6 text-center relative overflow-hidden">
                    {/* Animated sparkles background */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(12)].map((_, i) => (
                            <Sparkles
                                key={i}
                                className="absolute text-white/30 animate-pulse"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    width: `${16 + Math.random() * 16}px`,
                                    height: `${16 + Math.random() * 16}px`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Trophy icon */}
                    <div className="relative z-10">
                        <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
                            <Trophy className="w-10 h-10 text-yellow-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                            🎉 Game Complete!
                        </h2>
                        <p className="text-white/90 text-lg">
                            You've mastered {gameName}!
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="p-6">
                    {/* Achievement stats */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-4 border border-emerald-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-emerald-700 font-medium">Words Mastered</p>
                                    <p className="text-2xl font-bold text-emerald-900">
                                        {uniqueCorrectWords} / {wordsRequired}
                                    </p>
                                </div>
                            </div>
                            <div className="text-4xl">✨</div>
                        </div>
                    </div>

                    {/* Assignment progress */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <Target className="w-5 h-5 text-indigo-600" />
                            <span className="text-sm font-medium text-gray-700">Assignment Progress</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                            <div
                                className={`h-3 rounded-full transition-all duration-500 ${isAssignmentComplete
                                        ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                                        : 'bg-gradient-to-r from-indigo-400 to-purple-500'
                                    }`}
                                style={{ width: `${Math.min(100, assignmentProgress)}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-600">
                            {isAssignmentComplete ? (
                                <span className="text-emerald-600 font-semibold">
                                    🎊 Assignment Complete! Great job!
                                </span>
                            ) : (
                                <span>
                                    {assignmentProgress}% complete - keep going to finish the assignment!
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onGoBack}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 border border-gray-300"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Assignment
                        </button>
                        <button
                            onClick={onContinue}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30"
                        >
                            <Play className="w-5 h-5" />
                            Keep Playing
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.9) translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
      `}</style>
        </div>
    );
}
