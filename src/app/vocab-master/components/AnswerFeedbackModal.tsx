import React from 'react';
import { CheckCircle, XCircle, Volume2, BookOpen, Clock } from 'lucide-react';
import { VocabularyWord } from '../types';

interface AnswerFeedbackModalProps {
  isCorrect: boolean;
  currentWord: VocabularyWord;
  userAnswer: string;
  correctAnswer: string;
  gameMode: string;
  streak?: number;
  responseTime?: number;
  isVisible: boolean;
  onPlayAudio?: (text: string, language: 'es' | 'en') => void;
  onContinue: () => void;
}

export const AnswerFeedbackModal: React.FC<AnswerFeedbackModalProps> = ({
  isCorrect,
  currentWord,
  userAnswer,
  correctAnswer,
  gameMode,
  streak = 0,
  responseTime = 0,
  isVisible,
  onPlayAudio,
  onContinue
}) => {
  if (!isVisible) return null;

  const feedbackData = {
    correct: {
      bgColor: 'from-green-600 to-green-700',
      icon: CheckCircle,
      iconColor: 'text-green-100',
      title: 'Correct!',
      subtitle: streak > 1 ? `${streak} in a row! 🔥` : 'Well done! ✨',
      borderColor: 'border-green-400/50',
      shadowColor: 'shadow-green-600/30'
    },
    incorrect: {
      bgColor: 'from-red-600 to-red-700',
      icon: XCircle,
      iconColor: 'text-red-100',
      title: 'Not quite right',
      subtitle: "Let's learn from this! 💪",
      borderColor: 'border-red-400/50',
      shadowColor: 'shadow-red-600/30'
    }
  };

  const feedback = isCorrect ? feedbackData.correct : feedbackData.incorrect;
  const FeedbackIcon = feedback.icon;

  // Get the Spanish word for audio playback
  const spanishWord = currentWord.spanish || currentWord.word || '';
  const englishTranslation = currentWord.english || currentWord.translation || '';

  // Format response time
  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  // Get mode-specific instruction
  const getModeInstruction = (mode: string) => {
    switch (mode) {
      case 'dictation':
        return 'Type what you hear in Spanish';
      case 'listening':
        return 'Type the English translation';
      case 'cloze':
        return 'Fill in the missing word';
      case 'typing':
        return 'Type the translation';
      default:
        return 'Select or type your answer';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className={`bg-gradient-to-br ${feedback.bgColor} rounded-3xl p-8 max-w-2xl mx-4 ${feedback.borderColor} border shadow-2xl ${feedback.shadowColor} transform animate-in zoom-in-95 duration-300`}>
        {/* Header */}
        <div className="text-center mb-6">
          <FeedbackIcon className={`h-16 w-16 mx-auto mb-4 ${feedback.iconColor}`} />
          <h2 className="text-white font-bold text-3xl mb-2">{feedback.title}</h2>
          <p className="text-white/80 text-lg">{feedback.subtitle}</p>
        </div>

        {/* Answer Comparison */}
        <div className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/20">
          <div className="grid grid-cols-1 gap-4">
            {/* Original Word */}
            <div className="text-center">
              <div className="text-white/70 text-sm font-medium mb-2">Spanish Word</div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-white font-bold text-2xl">{spanishWord}</span>
                {onPlayAudio && (
                  <button
                    onClick={() => onPlayAudio(spanishWord, 'es')}
                    className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    title="Play pronunciation"
                  >
                    <Volume2 className="h-5 w-5 text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/20"></div>

            {/* Correct Answer */}
            <div className="text-center">
              <div className="text-white/70 text-sm font-medium mb-2">Correct Answer</div>
              <span className="text-white font-bold text-xl">{correctAnswer}</span>
            </div>

            {/* User Answer (if incorrect) */}
            {!isCorrect && userAnswer.trim() && (
              <>
                <div className="border-t border-white/20"></div>
                <div className="text-center">
                  <div className="text-white/70 text-sm font-medium mb-2">Your Answer</div>
                  <span className="text-red-200 font-semibold text-lg">{userAnswer}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Example Sentence */}
        {(currentWord.example_sentence || currentWord.example_translation) && (
          <div className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-white/70" />
              <span className="text-white/70 text-sm font-medium">Example Usage</span>
            </div>
            
            {currentWord.example_sentence && (
              <div className="mb-2">
                <div className="text-white italic text-base">{currentWord.example_sentence}</div>
              </div>
            )}
            
            {currentWord.example_translation && (
              <div className="text-white/80 text-sm">{currentWord.example_translation}</div>
            )}
          </div>
        )}

        {/* Additional Info */}
        <div className="flex justify-between items-center mb-6 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <span>{getModeInstruction(gameMode)}</span>
          </div>
          {responseTime > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatResponseTime(responseTime)}</span>
            </div>
          )}
        </div>

        {/* Part of Speech */}
        {currentWord.part_of_speech && (
          <div className="text-center mb-6">
            <span className="inline-block bg-white/20 text-white/80 text-xs font-medium px-3 py-1 rounded-full">
              {currentWord.part_of_speech}
            </span>
          </div>
        )}

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={onContinue}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-200 border border-white/30 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
