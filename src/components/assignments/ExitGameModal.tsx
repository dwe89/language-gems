'use client';

import React from 'react';
import { AlertTriangle, ArrowLeft, Play, Target, XCircle } from 'lucide-react';

interface ExitGameModalProps {
    isOpen: boolean;
    gameName: string;
    currentProgress: number;
    wordsRequired: number;
    uniqueCorrectWords: number;
    onConfirmExit: () => void;
    onCancel: () => void;
}

export default function ExitGameModal({
    isOpen,
    gameName,
    currentProgress,
    wordsRequired,
    uniqueCorrectWords,
    onConfirmExit,
    onCancel
}: ExitGameModalProps) {
    if (!isOpen) return null;

    const wordsRemaining = Math.max(0, wordsRequired - uniqueCorrectWords);
    const isNearCompletion = currentProgress >= 70;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-scaleIn">
                {/* Header */}
                <div className={`p-6 text-center ${isNearCompletion
                        ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                        : 'bg-gradient-to-br from-gray-600 to-gray-700'
                    }`}>
                    <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                        {isNearCompletion ? (
                            <AlertTriangle className="w-8 h-8 text-white" />
                        ) : (
                            <XCircle className="w-8 h-8 text-white" />
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">
                        {isNearCompletion ? 'You\'re Almost There!' : 'Leave Game?'}
                    </h2>
                    <p className="text-white/90">
                        {isNearCompletion
                            ? `Just ${wordsRemaining} more word${wordsRemaining > 1 ? 's' : ''} to complete!`
                            : 'Your progress will be saved'
                        }
                    </p>
                </div>

                <div className="p-6">
                    {/* Progress indicator */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <Target className="w-5 h-5 text-indigo-600" />
                            <span className="text-sm font-medium text-gray-700">{gameName} Progress</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                            <div
                                className={`h-3 rounded-full transition-all duration-500 ${isNearCompletion
                                        ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                                        : 'bg-gradient-to-r from-indigo-400 to-purple-500'
                                    }`}
                                style={{ width: `${Math.min(100, currentProgress)}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-600">
                            {uniqueCorrectWords} / {wordsRequired} words correct ({currentProgress}%)
                        </p>
                    </div>

                    {/* Encouragement message for near completion */}
                    {isNearCompletion && (
                        <div className="bg-amber-50 rounded-lg p-3 mb-4 border border-amber-200">
                            <p className="text-sm text-amber-800">
                                💪 <strong>Keep going!</strong> You're {currentProgress}% complete.
                                Just a few more correct answers to finish this game!
                            </p>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onConfirmExit}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 border border-gray-300"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Exit Anyway
                        </button>
                        <button
                            onClick={onCancel}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-xl transition-all duration-200 shadow-lg ${isNearCompletion
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/30'
                                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-indigo-500/30'
                                }`}
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
