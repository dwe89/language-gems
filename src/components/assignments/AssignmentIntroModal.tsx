'use client';

import React from 'react';
import { Target, Trophy, Lightbulb, Play, Gamepad2, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

interface GameThreshold {
    gameId: string;
    gameName: string;
    wordsRequired: number;
}

interface AssignmentIntroModalProps {
    isOpen: boolean;
    assignmentTitle: string;
    perGameThresholds: GameThreshold[];
    assignmentThreshold: {
        wordsRequired: number;
        totalWords: number;
        percentRequired: number;
    };
    tips: string[];
    onStart: () => void;
    onClose?: () => void;
}

export default function AssignmentIntroModal({
    isOpen,
    assignmentTitle,
    perGameThresholds,
    assignmentThreshold,
    tips,
    onStart,
    onClose
}: AssignmentIntroModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-scaleIn max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 text-center relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(8)].map((_, i) => (
                            <Sparkles
                                key={i}
                                className="absolute text-white/20 animate-pulse"
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

                    <div className="relative z-10">
                        <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                            {assignmentTitle}
                        </h2>
                        <p className="text-white/90">
                            Here's how to complete this assignment
                        </p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Assignment Goal */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-emerald-900 text-lg mb-1">Assignment Goal</h3>
                                <p className="text-emerald-700">
                                    Learn <span className="font-bold text-emerald-900">{assignmentThreshold.wordsRequired}</span> out of {assignmentThreshold.totalWords} words ({assignmentThreshold.percentRequired}% coverage)
                                </p>
                                <p className="text-sm text-emerald-600 mt-1">
                                    Words you learn in any game count toward this goal!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Per-Game Requirements */}
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Gamepad2 className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-bold text-gray-900">Complete Each Game By:</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {perGameThresholds.map((game, index) => (
                                <div
                                    key={game.gameId}
                                    className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200"
                                >
                                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 text-sm">{game.gameName}</p>
                                        <p className="text-xs text-gray-500">
                                            {game.wordsRequired} correct words
                                        </p>
                                    </div>
                                    <Target className="w-4 h-4 text-gray-400" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                        <div className="flex items-center gap-3 mb-3">
                            <Lightbulb className="w-5 h-5 text-amber-600" />
                            <h3 className="font-bold text-amber-900">Tips for Success</h3>
                        </div>
                        <ul className="space-y-2">
                            {tips.map((tip, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
                                    <span className="text-amber-500 mt-0.5">•</span>
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Start Button */}
                    <button
                        onClick={onStart}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 group"
                    >
                        <Play className="w-6 h-6" />
                        Let's Go!
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
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
            transform: scale(0.95) translateY(20px); 
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
