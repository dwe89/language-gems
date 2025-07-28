'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Clock, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { geminiTTSExamQuestions } from '../../data/gemini-tts-exam-questions';

interface GeminiTTSDemoProps {
  language: 'spanish' | 'french' | 'german';
  onComplete: (results: any) => void;
}

export default function GeminiTTSDemo({ language, onComplete }: GeminiTTSDemoProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const MAX_PLAYS = 2;

  // Get questions for selected language
  const questions = geminiTTSExamQuestions[language] || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Generate audio for current question
  const generateAudio = async () => {
    if (!currentQuestion?.audioText) return;

    setIsGeneratingAudio(true);
    try {
      const response = await fetch('/api/admin/generate-gemini-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentQuestion.audioText,
          language: language,
          questionId: currentQuestion.id,
          type: currentQuestion.ttsConfig?.multiSpeaker ? 'multi' : 'exam',
          voiceName: currentQuestion.ttsConfig?.voiceName,
          speakers: currentQuestion.ttsConfig?.speakers,
          options: {
            includeInstructions: true,
            speakingSpeed: 'normal',
            tone: 'neutral'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const data = await response.json();
      setAudioUrl(data.audioUrl);
    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Failed to generate audio. Please try again.');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // Load audio when question changes
  useEffect(() => {
    if (currentQuestion) {
      setAudioUrl(null);
      setPlayCount(0);
      setQuestionStartTime(new Date());
      generateAudio();
    }
  }, [currentQuestionIndex, currentQuestion]);

  // Play audio
  const playAudio = () => {
    if (audioRef.current && audioUrl && playCount < MAX_PLAYS) {
      audioRef.current.play();
      setIsPlaying(true);
      setPlayCount(prev => prev + 1);
    }
  };

  // Handle audio events
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // Handle answer submission
  const handleAnswerSubmit = (answer: any) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));

    // Move to next question or complete
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Complete assessment
      const results = {
        questionsCompleted: questions.length,
        answers: { ...userAnswers, [currentQuestion.id]: answer },
        totalTimeSpent: Math.floor((Date.now() - (questionStartTime?.getTime() || Date.now())) / 1000)
      };
      onComplete(results);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No questions available for {language}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Progress Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <div className="text-sm text-gray-500">
            {currentQuestion.type.replace('-', ' ').toUpperCase()}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentQuestion.title}</h3>
        <p className="text-gray-600 mb-6">{currentQuestion.instructions}</p>

        {/* Audio Controls */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={playAudio}
                disabled={!audioUrl || playCount >= MAX_PLAYS || isGeneratingAudio}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isGeneratingAudio ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5 mr-2" />
                ) : (
                  <Play className="h-5 w-5 mr-2" />
                )}
                {isGeneratingAudio ? 'Generating...' : 'Play Audio'}
              </button>
              
              <div className="flex items-center text-sm text-gray-600">
                <Volume2 className="h-4 w-4 mr-1" />
                Plays remaining: {MAX_PLAYS - playCount}
              </div>
            </div>

            {currentQuestion.ttsConfig?.multiSpeaker && (
              <div className="text-sm text-gray-500">
                🎭 Multi-speaker conversation
              </div>
            )}
          </div>

          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={handleAudioEnded}
              className="w-full"
              controls
            />
          )}

          {isGeneratingAudio && (
            <div className="text-center py-4">
              <div className="inline-flex items-center text-sm text-gray-600">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating audio with Google Gemini TTS...
              </div>
            </div>
          )}
        </div>

        {/* Question Interface */}
        <div className="space-y-4">
          {currentQuestion.type === 'multiple-choice' && (
            <div>
              <p className="font-medium text-gray-900 mb-4">{currentQuestion.data.question}</p>
              <div className="space-y-2">
                {currentQuestion.data.options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSubmit(option)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentQuestion.type === 'dictation' && (
            <div>
              <p className="font-medium text-gray-900 mb-4">Write exactly what you hear:</p>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                rows={3}
                placeholder="Type what you hear..."
                onBlur={(e) => handleAnswerSubmit(e.target.value)}
              />
            </div>
          )}

          {currentQuestion.type === 'open-response' && (
            <div>
              <p className="font-medium text-gray-900 mb-4">{currentQuestion.data.question}</p>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                rows={4}
                placeholder="Write your answer..."
                onBlur={(e) => handleAnswerSubmit(e.target.value)}
              />
            </div>
          )}

          {currentQuestion.type === 'opinion-rating' && (
            <div>
              <p className="font-medium text-gray-900 mb-4">Rate each opinion as Positive (P), Negative (N), or Both (P+N):</p>
              <div className="space-y-3">
                {currentQuestion.data.statements.map((statement: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span>{statement.person} - {statement.topic}</span>
                    <div className="flex space-x-2">
                      {['P', 'N', 'P+N'].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleAnswerSubmit({ [statement.person]: rating })}
                          className="px-3 py-1 border border-gray-300 rounded hover:bg-purple-50 hover:border-purple-300"
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TTS Info */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-sm text-green-800">
            <CheckCircle className="h-4 w-4 mr-2" />
            Audio generated using Google Gemini TTS with voice: {currentQuestion.ttsConfig?.voiceName || 'Default'}
          </div>
        </div>
      </div>
    </div>
  );
}
