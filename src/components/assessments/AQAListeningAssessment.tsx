'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Headphones,
  Info,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { AQAListeningAssessmentService, type AQAListeningAssessmentDefinition, type AQAListeningQuestionDefinition } from '../../services/aqaListeningAssessmentService';

// Question Types for AQA Listening Assessment
export interface AQAListeningQuestion {
  id: string;
  question_type: 'letter-matching' | 'multiple-choice' | 'lifestyle-grid' | 'opinion-rating' | 'open-response' | 'activity-timing' | 'multi-part' | 'dictation';
  title: string;
  instructions: string;
  questionNumber?: number; // Question number for proper audio introduction
  audioUrl?: string; // Optional - can be generated dynamically
  audioText?: string; // Text to convert to speech with Gemini TTS
  audioTranscript?: string; // For development/testing
  timeLimit?: number; // in seconds
  data: any; // Question-specific data structure
  ttsConfig?: {
    voiceName?: string;
    multiSpeaker?: boolean;
    speakers?: Array<{ name: string; voiceName: string }>;
    style?: string;
  };
  sentenceAudioUrls?: Record<string, string>; // For dictation: individual sentence audio URLs
}

interface AQAListeningAssessmentProps {
  language: 'es' | 'fr' | 'de';
  level: 'KS3' | 'KS4';
  difficulty: 'foundation' | 'higher';
  identifier: string; // paper-1, paper-2, etc.
  onComplete: (results: any) => void;
  onQuestionComplete?: (questionId: string, answer: any, timeSpent: number) => void;
}

export default function AQAListeningAssessment({
  language,
  level,
  difficulty,
  identifier,
  onComplete,
  onQuestionComplete
}: AQAListeningAssessmentProps) {
  // Database integration state
  const [assessment, setAssessment] = useState<AQAListeningAssessmentDefinition | null>(null);
  const [questions, setQuestions] = useState<AQAListeningQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // assessmentService is initialized once and doesn't change
  const [assessmentService] = useState(() => new AQAListeningAssessmentService());
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  // Assessment state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [generatedAudioUrls, setGeneratedAudioUrls] = useState<Record<string, string>>({});
  const [volume, setVolume] = useState(0.8);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);

  // Refs for audio element and timer interval
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Maximum plays allowed per question
  const MAX_PLAYS = 2;

  // Memoized function to generate audio using Gemini TTS API
  const generateAudioWithGemini = useCallback(async (question: AQAListeningQuestion): Promise<string> => {
    if (!question.audioText) {
      throw new Error('No audio text provided for TTS generation');
    }

    setIsGeneratingAudio(true);
    try {
      const response = await fetch('/api/admin/generate-gemini-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: question.audioText,
          language: language === 'es' ? 'spanish' : language === 'fr' ? 'french' : 'german',
          questionId: question.id,
          type: question.ttsConfig?.multiSpeaker ? 'multi' : 'exam',
          voiceName: question.ttsConfig?.voiceName,
          speakers: question.ttsConfig?.speakers,
          options: {
            includeInstructions: true,
            speakingSpeed: 'normal',
            tone: 'neutral',
            questionNumber: question.questionNumber
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const data = await response.json();
      return data.audioUrl;
    } catch (error) {
      console.error('Error generating audio:', error);
      throw error;
    } finally {
      setIsGeneratingAudio(false);
    }
  }, [language]); // Dependency: language ensures the correct TTS language is used

  // Memoized function to get or generate audio URL for current question
  const getAudioUrl = useCallback(async (question: AQAListeningQuestion): Promise<string> => {
    // If audio URL is already provided in the question definition, use it
    if (question.audioUrl) {
      return question.audioUrl;
    }

    // Check if we already generated audio for this question in the current session
    if (generatedAudioUrls[question.id]) {
      return generatedAudioUrls[question.id];
    }

    // If no pre-defined URL and no previously generated URL, generate new audio using Gemini TTS
    if (question.audioText) {
      const audioUrl = await generateAudioWithGemini(question);
      setGeneratedAudioUrls(prev => ({
        ...prev,
        [question.id]: audioUrl
      }));
      return audioUrl;
    }

    // If no audioUrl or audioText, throw an error
    throw new Error('No audio source available for this question');
  }, [generatedAudioUrls, generateAudioWithGemini, setGeneratedAudioUrls]); // Dependencies: state and memoized function

  // Effect to load assessment data from the database
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setIsLoading(true);
        console.log('Loading assessment with params:', { difficulty, language, identifier });
        const assessmentData = await assessmentService.getAssessmentByLevel(difficulty, language, identifier);
        console.log('Assessment data received:', assessmentData);

        if (!assessmentData) {
          console.error('Assessment not found for level:', difficulty, 'language:', language, 'identifier:', identifier);
          return;
        }

        setAssessment(assessmentData);
        setAssessmentId(assessmentData.id);

        // Fetch questions for the loaded assessment
        const questionsData = await assessmentService.getAssessmentQuestions(assessmentData.id);
        console.log('Loaded questions data:', questionsData);

        // Format raw question data into AQAListeningQuestion interface
        const formattedQuestions: AQAListeningQuestion[] = questionsData.map(q => ({
          id: q.id,
          question_type: q.question_type as any, // Type assertion for question_type
          title: q.title,
          instructions: q.instructions,
          questionNumber: q.question_number,
          audioText: q.audio_text,
          audioUrl: q.audio_url,
          audioTranscript: q.audio_transcript,
          data: q.question_data,
          ttsConfig: q.tts_config || {},
          sentenceAudioUrls: q.sentence_audio_urls || undefined
        }));

        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Error loading assessment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessment();
  }, [difficulty, language, identifier, assessmentService]); // Dependencies: props and service instance

  // Effect for the question timer
  useEffect(() => {
    // Only start timer if question has started and assessment is not completed
    if (questionStartTime && !isCompleted) {
      timerRef.current = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - questionStartTime.getTime()) / 1000));
      }, 1000);
      return () => {
        // Cleanup function: clear interval when component unmounts or dependencies change
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [questionStartTime, isCompleted]); // Dependencies: when to start/stop the timer

  // Effect to initialize question timer and load audio for the current question
  useEffect(() => {
    // Ensure questions array is loaded and current question index is valid before proceeding
    if (questions.length === 0 || currentQuestionIndex >= questions.length || !questions[currentQuestionIndex]) {
      return; // Skip if data isn't ready or index is out of bounds
    }

    const questionToLoad = questions[currentQuestionIndex];

    // Reset states for the new question
    setQuestionStartTime(new Date());
    setTimeSpent(0);
    setPlayCount(0);
    setIsAudioLoaded(false); // Audio needs to be reloaded for the new question
    setAudioProgress(0); // Reset audio progress bar

    // Pause and reset current audio if any
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }

    // Load audio for the current question using the memoized getAudioUrl function
    if (questionToLoad.audioUrl || questionToLoad.audioText) {
      getAudioUrl(questionToLoad).then(audioUrl => {
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.volume = volume;
          audioRef.current.load(); // Load the new audio source
        }
      }).catch(error => {
        console.error('Error loading audio:', error);
        setIsAudioLoaded(false);
      });
    } else {
        console.warn('No audio source (audioUrl or audioText) for current question:', questionToLoad.id);
        setIsAudioLoaded(true); // If no audio is expected, consider it loaded
    }
  }, [currentQuestionIndex, questions, getAudioUrl, volume]); // Dependencies: current question changes, or audio related functions/states

  // Show loading state if questions haven't loaded yet
  if (isLoading || !questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Assessment...</h2>
          <p className="text-gray-600">Please wait while we prepare your listening assessment.</p>
          {!isLoading && questions && questions.length === 0 && (
            <p className="text-red-600 mt-2">No questions found for this assessment.</p>
          )}
        </div>
      </div>
    );
  }

  // Use database-loaded questions
  const currentQuestion = questions[currentQuestionIndex];

  // Additional safety check for current question
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Question Not Found</h2>
          <p className="text-gray-600">Unable to load question {currentQuestionIndex + 1}.</p>
        </div>
      </div>
    );
  }

  // Calculate total marks based on question types
  const calculateTotalMarks = () => {
    let total = 0;
    questions.forEach(question => {
      if (question.question_type === 'letter-matching') {
        total += question.data.questions.length; // 1 mark per question
      } else if (question.question_type === 'multiple-choice') {
        total += question.data.questions.length; // 1 mark per question
      } else if (question.question_type === 'lifestyle-grid') {
        total += question.data.speakers.length * 2; // 2 marks per speaker (good + needs improvement)
      } else if (question.question_type === 'opinion-rating') {
        total += question.data.aspects.length; // 1 mark per aspect
      } else if (question.question_type === 'open-response') {
        total += question.data.questions.reduce((sum: number, q: any) => sum + q.marks, 0);
      } else if (question.question_type === 'activity-timing') {
        total += question.data.questions.length * 2; // 2 marks per question (activity + timing)
      } else if (question.question_type === 'multi-part') {
        total += question.data.parts.reduce((sum: number, part: any) => sum + part.marks, 0);
      } else if (question.question_type === 'dictation') {
        total += question.data.sentences.length * 2; // 2 marks per sentence
      }
    });
    return total;
  };

  const totalMarks = calculateTotalMarks();
  const expectedMarks = difficulty === 'foundation' ? 40 : 50; // AQA specific expected marks

  // Audio event handlers
  const handlePlayPause = () => {
    if (audioRef.current && playCount < MAX_PLAYS) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        // Increment play count only if it's the first play for the current question
        // Subsequent plays via replay button will handle their own increment
        if (playCount === 0) {
          setPlayCount(1);
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setAudioCurrentTime(audioRef.current.currentTime);
      const progress = audioDuration > 0 ? (audioRef.current.currentTime / audioDuration) * 100 : 0;
      setAudioProgress(progress);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
      setIsAudioLoaded(true);
      audioRef.current.volume = volume; // Ensure volume is set on load
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSeek = (seekTime: number) => {
    if (audioRef.current && isAudioLoaded) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const handleReplay = () => {
    if (audioRef.current && playCount < MAX_PLAYS) {
      audioRef.current.currentTime = 0; // Reset audio to beginning
      setPlayCount(prev => prev + 1); // Increment play count
      if (!isPlaying) {
        audioRef.current.play(); // Play if not already playing
        setIsPlaying(true);
      }
    }
  };

  // Answer handling
  const handleAnswerChange = (questionId: string, answer: any) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    // Record answer for current question before moving to the next
    if (onQuestionComplete && questionStartTime) {
      const timeSpentOnQuestion = Math.floor((Date.now() - questionStartTime.getTime()) / 1000);
      onQuestionComplete(currentQuestion.id, userAnswers[currentQuestion.id], timeSpentOnQuestion);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1); // Move to next question
    } else {
      // If it's the last question, complete the assessment
      setIsCompleted(true);
      if (onComplete) {
        onComplete({
          answers: userAnswers,
          totalTimeSpent: timeSpent,
          questionsCompleted: questions.length
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1); // Move to previous question
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render assessment completion screen
  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">Assessment Complete!</h2>
          <p className="text-green-700">Your listening assessment has been submitted successfully.</p>
          <div className="mt-4 text-sm text-green-600">
            Time spent: {formatTime(timeSpent)} | Questions completed: {questions.length}
          </div>
        </div>
      </div>
    );
  }

  // Language configuration for display
  const languageConfig = {
    es: { name: 'Spanish', flag: '🇪🇸' },
    fr: { name: 'French', flag: '🇫🇷' },
    de: { name: 'German', flag: '🇩🇪' }
  };

  const currentLanguage = languageConfig[language];
  const paperNumber = identifier.replace('paper-', ''); // Extract paper number from identifier

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Disclaimer Notice */}
      <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-4 flex items-start text-sm mb-6">
        <Info className="h-5 w-5 flex-shrink-0 mr-3 text-blue-500" />
        <div>
          <p className="font-medium mb-1">Important: Practice Assessment</p>
          <p>This is an original practice assessment designed to reflect AQA listening exam formats. LanguageGems is not affiliated with AQA or any official examination board. <a href="/legal/disclaimer" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-blue-900">Read our full disclaimer.</a></p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Headphones className="h-6 w-6 text-purple-600 mr-2" />
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{formatTime(timeSpent)}</span>
              </div>
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Audio Player */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Audio Player</h3>
          <div className="flex items-center space-x-2">
            {isGeneratingAudio && (
              <div className="text-sm text-blue-600 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Generating audio...
              </div>
            )}
            <div className="flex items-center space-x-4 text-sm">
              <div className={`px-2 py-1 rounded-full ${
                playCount >= MAX_PLAYS
                  ? 'bg-red-100 text-red-800'
                  : playCount > 0
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                Plays: {playCount}/{MAX_PLAYS}
              </div>
              {isAudioLoaded && (
                <div className="text-green-600 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Audio ready
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Audio Status Notice */}
        {!currentQuestion?.audioUrl && !generatedAudioUrls[currentQuestion?.id] && !isGeneratingAudio && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Headphones className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-800">
                  <strong>Audio not yet available.</strong> Click play to generate audio for this question.
                </p>
              </div>
            </div>
          </div>
        )}

        <audio
          ref={audioRef}
          onEnded={handleAudioEnded}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          preload="metadata"
        />

        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={handlePlayPause}
            disabled={playCount >= MAX_PLAYS || isGeneratingAudio || !isAudioLoaded}
            className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
              playCount >= MAX_PLAYS || isGeneratingAudio || !isAudioLoaded
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isPlaying
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
          </button>

          <button
            onClick={handleReplay}
            disabled={playCount >= MAX_PLAYS || isGeneratingAudio || !isAudioLoaded}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
              playCount >= MAX_PLAYS || isGeneratingAudio || !isAudioLoaded
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          <div className="flex-1">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{formatTime(Math.floor(audioCurrentTime))}</span>
              <div
                className="flex-1 bg-gray-200 rounded-full h-2 cursor-pointer"
                onClick={(e) => {
                  if (audioDuration > 0 && isAudioLoaded) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const seekTime = (clickX / rect.width) * audioDuration;
                    handleSeek(seekTime);
                  }
                }}
              >
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
              <span>{formatTime(Math.floor(audioDuration))}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <Volume2 className="h-5 w-5 text-gray-600" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #9333ea 0%, #9333ea ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
              }}
            />
            <span className="text-xs text-gray-500 w-8">{Math.round(volume * 100)}%</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> You can listen to each audio clip a maximum of {MAX_PLAYS} times. 
          </p>
        </div>
      </div>

      {/* Question Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{currentQuestion.title}</h2>
          <p className="text-gray-700 mb-4">{currentQuestion.instructions}</p>
        </div>

        {/* Render question based on type */}
        {currentQuestion.question_type === 'letter-matching' && (
          <LetterMatchingQuestion
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        )}

        {currentQuestion.question_type === 'multiple-choice' && (
          <MultipleChoiceQuestion
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        )}

        {currentQuestion.question_type === 'lifestyle-grid' && (
          <LifestyleGridQuestion
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        )}

        {currentQuestion.question_type === 'opinion-rating' && (
          <OpinionRatingQuestion
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        )}

        {currentQuestion.question_type === 'open-response' && (
          <OpenResponseQuestion
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        )}

        {currentQuestion.question_type === 'activity-timing' && (
          <ActivityTimingQuestion
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        )}

        {currentQuestion.question_type === 'multi-part' && (
          <MultiPartQuestion
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        )}

        {currentQuestion.question_type === 'dictation' && (
          <DictationQuestion
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pb-6"> {/* Added padding-bottom */}
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Previous
        </button>

        <div className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Complete Assessment' : 'Next'}
          <ArrowRight className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  );
}

// Question Type Components (No changes needed here as they are separate components)

interface QuestionComponentProps {
  question: AQAListeningQuestion;
  userAnswer: any;
  onAnswerChange: (answer: any) => void;
}

// Type 1: Letter Matching (Carlos's week example)
function LetterMatchingQuestion({ question, userAnswer, onAnswerChange }: QuestionComponentProps) {
  const answers = userAnswer || {};

  const handleAnswerSelect = (questionId: string, letter: string) => {
    const newAnswers = { ...answers, [questionId]: letter };
    onAnswerChange(newAnswers);
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Options:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {question.data.options.map((option: any) => (
            <div key={option.letter} className="flex items-center">
              <span className="font-bold text-purple-600 mr-2 w-6">{option.letter}</span>
              <span className="text-gray-700">{option.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {question.data.questions.map((q: any) => (
          <div key={q.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <span className="font-medium text-gray-900 mr-4 min-w-[80px]">{q.label}</span>
            </div>
            <div className="flex space-x-2">
              {question.data.options.map((option: any) => (
                <button
                  key={option.letter}
                  onClick={() => handleAnswerSelect(q.id, option.letter)}
                  className={`w-10 h-10 rounded-lg border-2 font-semibold transition-all ${
                    answers[q.id] === option.letter
                      ? 'border-purple-600 bg-purple-600 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-purple-400'
                  }`}
                >
                  {option.letter}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Type 2: Multiple Choice (Holiday traditions example)
function MultipleChoiceQuestion({ question, userAnswer, onAnswerChange }: QuestionComponentProps) {
  const answers = userAnswer || {};

  const handleAnswerSelect = (questionId: string, letter: string) => {
    const newAnswers = { ...answers, [questionId]: letter };
    onAnswerChange(newAnswers);
  };

  return (
    <div className="space-y-6">
      {question.data.questions.map((q: any, index: number) => (
        <div key={q.id} className="border border-gray-200 rounded-lg p-4">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              {index + 1}. {q.question}
            </h4>
          </div>

          <div className="space-y-3">
            {q.options.map((option: any) => (
              <button
                key={option.letter}
                onClick={() => handleAnswerSelect(q.id, option.letter)}
                className={`w-full text-left p-3 border-2 rounded-lg transition-all ${
                  answers[q.id] === option.letter
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="font-bold text-purple-600 mr-3 w-6">{option.letter}</span>
                  <span className="text-gray-900">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Type 3: Lifestyle Grid (Spanish podcast example)
function LifestyleGridQuestion({ question, userAnswer, onAnswerChange }: QuestionComponentProps) {
  const answers = userAnswer || {};

  const handleAnswerSelect = (speakerId: string, category: 'good' | 'needsImprovement', letter: string) => {
    const newAnswers = {
      ...answers,
      [speakerId]: {
        ...answers[speakerId],
        [category]: letter
      }
    };
    onAnswerChange(newAnswers);
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Lifestyle aspects:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {question.data.options.map((option: any) => (
            <div key={option.letter} className="flex items-center">
              <span className="font-bold text-purple-600 mr-2 w-6">{option.letter}</span>
              <span className="text-gray-700">{option.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left font-semibold">Speaker</th>
              <th className="border border-gray-300 p-3 text-center font-semibold">Good</th>
              <th className="border border-gray-300 p-3 text-center font-semibold">Needs to Improve</th>
            </tr>
          </thead>
          <tbody>
            {question.data.speakers.map((speaker: any) => (
              <tr key={speaker.id}>
                <td className="border border-gray-300 p-3 font-medium">{speaker.name}</td>
                <td className="border border-gray-300 p-3 text-center">
                  <div className="flex justify-center space-x-1">
                    {question.data.options.map((option: any) => (
                      <button
                        key={option.letter}
                        onClick={() => handleAnswerSelect(speaker.id, 'good', option.letter)}
                        className={`w-8 h-8 rounded border-2 text-sm font-semibold transition-all ${
                          answers[speaker.id]?.good === option.letter
                            ? 'border-green-600 bg-green-600 text-white'
                            : 'border-gray-300 text-gray-700 hover:border-green-400'
                        }`}
                      >
                        {option.letter}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  <div className="flex justify-center space-x-1">
                    {question.data.options.map((option: any) => (
                      <button
                        key={option.letter}
                        onClick={() => handleAnswerSelect(speaker.id, 'needsImprovement', option.letter)}
                        className={`w-8 h-8 rounded border-2 text-sm font-semibold transition-all ${
                          answers[speaker.id]?.needsImprovement === option.letter
                            ? 'border-red-600 bg-red-600 text-white'
                            : 'border-gray-300 text-gray-700 hover:border-red-400'
                        }`}
                      >
                        {option.letter}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Type 5: Open Response (Reality TV star example)
function OpenResponseQuestion({ question, userAnswer, onAnswerChange }: QuestionComponentProps) {
  const answers = userAnswer || {};

  const handleAnswerChange = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    onAnswerChange(newAnswers);
  };

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">Answer in English</h4>
        <p className="text-sm text-yellow-800">
          Write your answers in English. Be concise but complete in your responses.
        </p>
      </div>

      <div className="space-y-4">
        {question.data.questions.map((q: any, index: number) => (
          <div key={q.id} className="border border-gray-200 rounded-lg p-4">
            <label className="block font-medium text-gray-900 mb-2">
              {index + 1}. {q.question}
            </label>
            <textarea
              value={answers[q.id] || ''}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Type your answer in English..."
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Type 6: Activity Timing (Phone conversation example)
function ActivityTimingQuestion({ question, userAnswer, onAnswerChange }: QuestionComponentProps) {
  const answers = userAnswer || {};

  const handleAnswerSelect = (questionId: string, type: 'activity' | 'time', value: string | number) => {
    const newAnswers = {
      ...answers,
      [questionId]: {
        ...answers[questionId],
        [type]: value
      }
    };
    onAnswerChange(newAnswers);
  };

  return (
    <div className="space-y-6">
      {/* Activities */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Activities:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {question.data.activities.map((activity: any) => (
            <div key={activity.number} className="flex items-center">
              <span className="font-bold text-purple-600 mr-2 w-6">{activity.number}</span>
              <span className="text-gray-700">{activity.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Time Options */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">When:</h4>
        <div className="flex space-x-6">
          {question.data.timeOptions.map((option: any) => (
            <div key={option.letter} className="flex items-center">
              <span className="font-bold text-purple-600 mr-2 w-6">{option.letter}</span>
              <span className="text-gray-700">{option.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {question.data.questions.map((q: any, index: number) => (
          <div key={q.id} className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-4">Question {index + 1}</h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Activity Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity</label>
                <div className="flex space-x-2">
                  {question.data.activities.map((activity: any) => (
                    <button
                      key={activity.number}
                      onClick={() => handleAnswerSelect(q.id, 'activity', activity.number)}
                      className={`w-10 h-10 rounded-lg border-2 font-semibold transition-all ${
                        answers[q.id]?.activity === activity.number
                          ? 'border-purple-600 bg-purple-600 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-purple-400'
                      }`}
                    >
                      {activity.number}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">When</label>
                <div className="flex space-x-2">
                  {question.data.timeOptions.map((option: any) => (
                    <button
                      key={option.letter}
                      onClick={() => handleAnswerSelect(q.id, 'time', option.letter)}
                      className={`w-10 h-10 rounded-lg border-2 font-semibold transition-all ${
                        answers[q.id]?.time === option.letter
                          ? 'border-purple-600 bg-purple-600 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-purple-400'
                      }`}
                    >
                      {option.letter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Type 7: Multi-Part (University conversation example)
function MultiPartQuestion({ question, userAnswer, onAnswerChange }: QuestionComponentProps) {
  const answers = userAnswer || {};

  const handleAnswerSelect = (partId: string, letter: string) => {
    const newAnswers = { ...answers, [partId]: letter };
    onAnswerChange(newAnswers);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Multi-part question</h4>
        <p className="text-sm text-blue-800">
          Listen to the continuous audio and answer both parts of the question.
        </p>
      </div>

      <div className="space-y-6">
        {question.data.parts.map((part: any, index: number) => (
          <div key={part.id} className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-4">
              {index + 1}. {part.question} {/* Corrected question numbering */}
            </h5>

            <div className="space-y-3">
              {part.options.map((option: any) => (
                <button
                  key={option.letter}
                  onClick={() => handleAnswerSelect(part.id, option.letter)}
                  className={`w-full text-left p-3 border-2 rounded-lg transition-all ${
                    answers[part.id] === option.letter
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="font-bold text-purple-600 mr-3 w-6">{option.letter}</span>
                    <span className="text-gray-900">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Type 8: Dictation
function DictationQuestion({ question, userAnswer, onAnswerChange }: QuestionComponentProps) {
  const answers = userAnswer || {};
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isPlayingSentence, setIsPlayingSentence] = useState(false);
  const [playbackStage, setPlaybackStage] = useState<'full' | 'sections' | 'full-again'>('full');
  const sentenceAudioRef = useRef<HTMLAudioElement>(null);

  const handleAnswerChange = (sentenceId: string, value: string) => {
    const newAnswers = { ...answers, [sentenceId]: value };
    onAnswerChange(newAnswers);
  };

  const playSentence = async (sentenceIndex: number, stage: 'full' | 'sections' | 'full-again' = 'full') => {
    setCurrentSentence(sentenceIndex);
    setPlaybackStage(stage);
    setIsPlayingSentence(true);

    try {
      const sentence = question.data.sentences[sentenceIndex];

      // Check if we have individual sentence audio URLs
      if (question.sentenceAudioUrls && question.sentenceAudioUrls[sentence.id]) {
        const audioUrl = question.sentenceAudioUrls[sentence.id];
        console.log(`Playing sentence audio: ${audioUrl}`);

        // Create and play audio
        const audio = new Audio(audioUrl);
        audio.onended = () => setIsPlayingSentence(false);
        audio.onerror = () => {
          console.error('Error playing sentence audio');
          setIsPlayingSentence(false);
        };

        await audio.play();
      } else {
        // Fallback: use main audio if individual sentence audio not available
        console.log('Individual sentence audio not available, using fallback');
        // Simulate audio duration for now
        setTimeout(() => setIsPlayingSentence(false), 3000);
      }
    } catch (error) {
      console.error('Error playing sentence audio:', error);
      setIsPlayingSentence(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h4 className="font-semibold text-orange-900 mb-2">Dictation Instructions</h4>
        <div className="text-sm text-orange-800 space-y-1">
          <p>• Each sentence will be played three times</p>
          <p>• First: Full sentence</p>
          <p>• Second: In short sections with pauses</p>
          <p>• Third: Full sentence again</p>
          <p>• Write exactly what you hear in Spanish</p>
          <p>• Missing accents are acceptable</p>
        </div>
      </div>

      <div className="space-y-6">
        {question.data.sentences.map((sentence: any, index: number) => (
          <div key={sentence.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium text-gray-900">Sentence {index + 1}</h5>
              <div className="flex space-x-2">
                <button
                  onClick={() => playSentence(index, 'full')}
                  disabled={isPlayingSentence}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 disabled:opacity-50"
                >
                  Full
                </button>
                <button
                  onClick={() => playSentence(index, 'sections')}
                  disabled={isPlayingSentence}
                  className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
                >
                  Sections
                </button>
                <button
                  onClick={() => playSentence(index, 'full-again')}
                  disabled={isPlayingSentence}
                  className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200 disabled:opacity-50"
                >
                  Full Again
                </button>
              </div>
            </div>

            {currentSentence === index && isPlayingSentence && (
              <div className="mb-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm text-yellow-800">
                Playing: {playbackStage === 'full' ? 'Full sentence' : playbackStage === 'sections' ? 'In sections' : 'Full sentence again'}
              </div>
            )}

            <textarea
              value={answers[sentence.id] || ''}
              onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono"
              rows={2}
              placeholder="Write the sentence you hear in Spanish"
            />
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Helpful Tips:</h4>
        <div className="text-sm text-gray-700 space-y-1">
          <p>• Listen for familiar words and sounds</p>
          <p>• Use your knowledge of Spanish grammar</p>
          <p>• Don't worry about perfect accents (tenía = tenia is acceptable)</p>
          <p>• Check that your spelling makes sense</p>
        </div>
      </div>
    </div>
  );
}

// Type 4: Opinion Rating (TV chat show example)
function OpinionRatingQuestion({ question, userAnswer, onAnswerChange }: QuestionComponentProps) {
  const answers = userAnswer || {};

  const handleAnswerSelect = (aspectId: string, opinion: string) => {
    const newAnswers = { ...answers, [aspectId]: opinion };
    onAnswerChange(newAnswers);
  };

  const opinionOptions = [
    { value: 'P', label: 'P (Positive)', color: 'green' },
    { value: 'N', label: 'N (Negative)', color: 'red' },
    { value: 'P+N', label: 'P+N (Positive and Negative)', color: 'yellow' }
  ];

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">How to answer:</h4>
        <div className="space-y-1 text-sm text-blue-800">
          <div><strong>P</strong> = Positive opinion</div>
          <div><strong>N</strong> = Negative opinion</div>
          <div><strong>P+N</strong> = Both positive and negative opinions</div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {question.data.aspects.map((aspect: any) => (
          <div key={aspect.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-gray-900">{aspect.label}</h5>
            </div>
            <div className="flex space-x-3">
              {opinionOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswerSelect(aspect.id, option.value)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    answers[aspect.id] === option.value
                      ? option.color === 'green'
                        ? 'border-green-600 bg-green-600 text-white'
                        : option.color === 'red'
                        ? 'border-red-600 bg-red-600 text-white'
                        : 'border-yellow-600 bg-yellow-600 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
