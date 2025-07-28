'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Info
} from 'lucide-react';

// Question Types for AQA Listening Assessment
export interface AQAListeningQuestion {
  id: string;
  type: 'letter-matching' | 'multiple-choice' | 'lifestyle-grid' | 'opinion-rating' | 'open-response' | 'activity-timing' | 'multi-part' | 'dictation';
  title: string;
  instructions: string;
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
}

interface AQAListeningAssessmentProps {
  language: 'es' | 'fr' | 'de';
  level: 'KS3' | 'KS4';
  difficulty: 'foundation' | 'higher';
  onComplete: (results: any) => void;
  onQuestionComplete?: (questionId: string, answer: any, timeSpent: number) => void;
}

export default function AQAListeningAssessment({
  language,
  level,
  difficulty,
  onComplete,
  onQuestionComplete
}: AQAListeningAssessmentProps) {
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

  // Maximum plays allowed per question
  const MAX_PLAYS = 2;

  // Generate audio using Gemini TTS
  const generateAudioWithGemini = async (question: AQAListeningQuestion): Promise<string> => {
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
            tone: 'neutral'
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
  };

  // Get or generate audio URL for current question
  const getAudioUrl = async (question: AQAListeningQuestion): Promise<string> => {
    // If audio URL is already provided, use it
    if (question.audioUrl) {
      return question.audioUrl;
    }

    // Check if we already generated audio for this question
    if (generatedAudioUrls[question.id]) {
      return generatedAudioUrls[question.id];
    }

    // Generate new audio using Gemini TTS
    if (question.audioText) {
      const audioUrl = await generateAudioWithGemini(question);
      setGeneratedAudioUrls(prev => ({
        ...prev,
        [question.id]: audioUrl
      }));
      return audioUrl;
    }

    throw new Error('No audio source available for this question');
  };
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate questions based on difficulty level
  const getQuestionsForLevel = (): AQAListeningQuestion[] => {
    const baseQuestions: AQAListeningQuestion[] = [
      {
        id: 'q1',
        type: 'letter-matching',
        title: 'Weekend activities',
        instructions: 'María is describing her weekend plans to a friend. What activity does she mention for each time? Write the correct letter in each box.',
        audioUrl: '', // Audio files removed - placeholder for future implementation
        data: {
          options: [
            { letter: 'A', text: 'Swimming at the pool' },
            { letter: 'B', text: 'Visiting the museum' },
            { letter: 'C', text: 'Playing tennis' },
            { letter: 'D', text: 'Going to the market' },
            { letter: 'E', text: 'Meeting friends for coffee' },
            { letter: 'F', text: 'Studying at the library' }
          ],
          questions: [
            { id: 'q1_1', label: 'Saturday morning', correctAnswer: 'A', marks: 1 },
            { id: 'q1_2', label: 'Saturday afternoon', correctAnswer: 'C', marks: 1 },
            { id: 'q1_3', label: 'Sunday morning', correctAnswer: 'D', marks: 1 },
            { id: 'q1_4', label: 'Sunday evening', correctAnswer: 'E', marks: 1 }
          ]
        }
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        title: 'Holiday traditions',
        instructions: 'Listen to Roberto talking about his family traditions. Write the correct letter in each box.',
        audioUrl: '',
        data: {
          questions: [
            {
              id: 'q2_1',
              question: "What does Roberto's family always do on New Year's Eve?",
              options: [
                { letter: 'A', text: 'Watch fireworks from the balcony' },
                { letter: 'B', text: 'Have dinner at a restaurant' },
                { letter: 'C', text: 'Visit their grandparents' }
              ],
              correctAnswer: 'C',
              marks: 1
            },
            {
              id: 'q2_2',
              question: "What special food do they prepare for Christmas?",
              options: [
                { letter: 'A', text: 'Traditional paella' },
                { letter: 'B', text: 'Homemade churros' },
                { letter: 'C', text: 'Roasted lamb' }
              ],
              correctAnswer: 'A',
              marks: 1
            },
            {
              id: 'q2_3',
              question: "Who usually organizes the family gatherings?",
              options: [
                { letter: 'A', text: 'His mother' },
                { letter: 'B', text: 'His grandmother' },
                { letter: 'C', text: 'His aunt' }
              ],
              correctAnswer: 'B',
              marks: 1
            },
            {
              id: 'q2_4',
              question: "What time do they typically start celebrating?",
              options: [
                { letter: 'A', text: 'At 6 PM' },
                { letter: 'B', text: 'At 8 PM' },
                { letter: 'C', text: 'At 10 PM' }
              ],
              correctAnswer: 'B',
              marks: 1
            }
          ]
        }
      },
      {
        id: 'q3',
        type: 'lifestyle-grid',
        title: 'Health and wellness radio show',
        instructions: 'You are listening to a Spanish radio show about health. The callers are discussing their daily habits. Which aspect of each caller\'s routine is working well? Which aspect needs improvement?',
        audioUrl: '',
        data: {
          options: [
            { letter: 'A', text: 'Morning routine' },
            { letter: 'B', text: 'Physical activity' },
            { letter: 'C', text: 'Meal planning' },
            { letter: 'D', text: 'Work-life balance' },
            { letter: 'E', text: 'Relaxation time' },
            { letter: 'F', text: 'Screen time management' }
          ],
          speakers: [
            { id: 'caller1', name: 'Caller 1', good: 'A', needsImprovement: 'B', marks: 1 },
            { id: 'caller2', name: 'Caller 2', good: 'C', needsImprovement: 'E', marks: 1 }
          ]
        }
      },
      {
        id: 'q4',
        type: 'opinion-rating',
        title: 'Sports interview',
        instructions: 'Listen to a Spanish footballer being interviewed about his career. What is his opinion of these aspects of professional football? Write P for positive, N for negative, P+N for positive and negative.',
        audioUrl: '',
        data: {
          aspects: [
            { id: 'training', label: 'Daily training schedule', correctAnswer: 'P+N', marks: 1 },
            { id: 'travel', label: 'Traveling for matches', correctAnswer: 'N', marks: 1 },
            { id: 'teammates', label: 'Team relationships', correctAnswer: 'P', marks: 1 },
            { id: 'media', label: 'Media attention', correctAnswer: 'P+N', marks: 1 }
          ]
        }
      },
    {
      id: 'q5',
      type: 'open-response',
      title: 'Young entrepreneur',
      instructions: 'Listen to Ana talking about Diego, a young Spanish entrepreneur. Answer the questions in English.',
      audioUrl: '',
      data: {
        questions: [
          { id: 'q5_1', question: 'What type of business did he start?', correctAnswer: 'An eco-friendly clothing company' },
          { id: 'q5_2', question: 'What was his main motivation?', correctAnswer: 'To help protect the environment' },
          { id: 'q5_3', question: 'What does he find most difficult about running a business?', correctAnswer: 'Managing finances and cash flow' }
        ]
      }
    },
    {
      id: 'q6',
      type: 'activity-timing',
      title: 'Exchange student experience',
      instructions: 'Carmen is calling her parents from her exchange program in Madrid. She talks about different activities. Write the correct number of the activity that Carmen mentions. Write the correct letter for when it takes place.',
      audioUrl: '',
      data: {
        activities: [
          { number: 1, text: 'Museum visit with host family' },
          { number: 2, text: 'Spanish cooking class' },
          { number: 3, text: 'Flamenco dance workshop' },
          { number: 4, text: 'Day trip to Toledo' }
        ],
        timeOptions: [
          { letter: 'P', text: 'Past' },
          { letter: 'N', text: 'Now' },
          { letter: 'F', text: 'Future' }
        ],
        questions: [
          { id: 'q6_1', correctActivity: 2, correctTime: 'P' },
          { id: 'q6_2', correctActivity: 1, correctTime: 'N' },
          { id: 'q6_3', correctActivity: 4, correctTime: 'F' }
        ]
      }
    },
    {
      id: 'q7',
      type: 'multi-part',
      title: 'Planning a gap year',
      instructions: 'Listen to Sofia discussing her gap year plans with her father. What do they say? Write the correct letter in each box. Answer both parts of the question.',
      audioUrl: '',
      data: {
        parts: [
          {
            id: 'part1',
            question: 'Sofia wants to improve her...',
            options: [
              { letter: 'A', text: 'language skills' },
              { letter: 'B', text: 'work experience' },
              { letter: 'C', text: 'confidence' }
            ],
            correctAnswer: 'A'
          },
          {
            id: 'part2',
            question: "Sofia's father thinks the most important thing is to...",
            options: [
              { letter: 'A', text: 'save money for university' },
              { letter: 'B', text: 'stay safe while traveling' },
              { letter: 'C', text: 'make new friends' }
            ],
            correctAnswer: 'B'
          }
        ]
      }
    },
      {
        id: 'q8',
        type: 'dictation',
        title: 'Dictation',
        instructions: 'You will now hear 4 short sentences. Listen carefully and using your knowledge of Spanish sounds, write down in Spanish exactly what you hear for each sentence. You will hear each sentence three times: the first time as a full sentence, the second time in short sections and the third time again as a full sentence.',
        audioUrl: '',
        data: {
          sentences: [
            { id: 'sent1', correctAnswer: 'El clima en España es muy agradable', audioUrl: '', marks: 2 },
            { id: 'sent2', correctAnswer: 'Mis padres trabajan en el centro de la ciudad', audioUrl: '', marks: 2 },
            { id: 'sent3', correctAnswer: 'Los estudiantes practican deportes después de clase', audioUrl: '', marks: 2 },
            { id: 'sent4', correctAnswer: 'Durante las vacaciones visitamos muchos lugares interesantes', audioUrl: '', marks: 2 }
          ]
        }
      }
    ];

    // Add additional questions for Higher level to reach 50 marks
    if (difficulty === 'higher') {
      baseQuestions.push(
        {
          id: 'q9',
          type: 'open-response',
          title: 'Cultural exchange program',
          instructions: 'Listen to Elena talking about her experience in a cultural exchange program. Answer the questions in English.',
          audioUrl: '',
          data: {
            questions: [
              { id: 'q9_1', question: 'What was the most challenging aspect of living with a host family?', correctAnswer: 'Adapting to different meal times and family routines', marks: 2 },
              { id: 'q9_2', question: 'How did the experience change her perspective on Spanish culture?', correctAnswer: 'She realized Spanish families are more close-knit than she expected', marks: 2 },
              { id: 'q9_3', question: 'What advice would she give to future exchange students?', correctAnswer: 'Be patient and open-minded about cultural differences', marks: 2 }
            ]
          }
        },
        {
          id: 'q10',
          type: 'multi-part',
          title: 'Environmental awareness',
          instructions: 'Listen to a discussion about environmental issues in Spanish schools. What do they say? Write the correct letter in each box. Answer both parts of the question.',
          audioUrl: '',
          data: {
            parts: [
              {
                id: 'part1',
                question: 'The main environmental problem mentioned is...',
                options: [
                  { letter: 'A', text: 'plastic waste in the cafeteria' },
                  { letter: 'B', text: 'energy consumption in classrooms' },
                  { letter: 'C', text: 'lack of recycling bins' }
                ],
                correctAnswer: 'A',
                marks: 2
              },
              {
                id: 'part2',
                question: 'The proposed solution involves...',
                options: [
                  { letter: 'A', text: 'installing solar panels' },
                  { letter: 'B', text: 'organizing student committees' },
                  { letter: 'C', text: 'changing suppliers' }
                ],
                correctAnswer: 'B',
                marks: 2
              }
            ]
          }
        }
      );
    }

    return baseQuestions;
  };

  const questions = getQuestionsForLevel();
  const currentQuestion = questions[currentQuestionIndex];

  // Calculate total marks
  const calculateTotalMarks = () => {
    let total = 0;
    questions.forEach(question => {
      if (question.type === 'letter-matching') {
        total += question.data.questions.length; // 1 mark per question
      } else if (question.type === 'multiple-choice') {
        total += question.data.questions.length; // 1 mark per question
      } else if (question.type === 'lifestyle-grid') {
        total += question.data.speakers.length * 2; // 2 marks per speaker (good + needs improvement)
      } else if (question.type === 'opinion-rating') {
        total += question.data.aspects.length; // 1 mark per aspect
      } else if (question.type === 'open-response') {
        total += question.data.questions.reduce((sum: number, q: any) => sum + q.marks, 0);
      } else if (question.type === 'activity-timing') {
        total += question.data.questions.length * 2; // 2 marks per question (activity + timing)
      } else if (question.type === 'multi-part') {
        total += question.data.parts.reduce((sum: number, part: any) => sum + part.marks, 0);
      } else if (question.type === 'dictation') {
        total += question.data.sentences.length * 2; // 2 marks per sentence
      }
    });
    return total;
  };

  const totalMarks = calculateTotalMarks();
  const expectedMarks = difficulty === 'foundation' ? 40 : 50;

  // Timer effect
  useEffect(() => {
    if (questionStartTime && !isCompleted) {
      timerRef.current = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - questionStartTime.getTime()) / 1000));
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [questionStartTime, isCompleted]);

  // Initialize question timer
  useEffect(() => {
    setQuestionStartTime(new Date());
    setTimeSpent(0);
    setPlayCount(0);
  }, [currentQuestionIndex]);

  // Audio event handlers
  const handlePlayPause = () => {
    if (audioRef.current && playCount < MAX_PLAYS) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
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
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const handleReplay = () => {
    if (audioRef.current && playCount < MAX_PLAYS) {
      audioRef.current.currentTime = 0;
      setPlayCount(prev => prev + 1);
      if (!isPlaying) {
        audioRef.current.play();
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
    // Record answer for current question
    if (onQuestionComplete && questionStartTime) {
      const timeSpentOnQuestion = Math.floor((Date.now() - questionStartTime.getTime()) / 1000);
      onQuestionComplete(currentQuestion.id, userAnswers[currentQuestion.id], timeSpentOnQuestion);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Complete assessment
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
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Headphones className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AQA Listening Assessment</h1>
              <p className="text-gray-600">Spanish • {level} • {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</p>
              <p className="text-sm text-gray-500">Total marks: {totalMarks} {totalMarks !== expectedMarks && <span className="text-amber-600">(Expected: {expectedMarks})</span>}</p>
            </div>
          </div>
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

        {/* Progress bar */}
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
          <div className="text-sm text-amber-600">
            Audio files not available
          </div>
        </div>

        {/* Audio Not Available Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Headphones className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-800">
                <strong>Audio files are not currently available.</strong> This is a demonstration of the assessment structure and question types.
              </p>
            </div>
          </div>
        </div>
        
        <audio
          ref={audioRef}
          src={currentQuestion.audioUrl}
          onEnded={handleAudioEnded}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          preload="metadata"
        />
        
        <div className="flex items-center space-x-4 mb-4">
          <button
            disabled={true}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-300 text-gray-500 cursor-not-allowed"
          >
            <Play className="h-6 w-6 ml-1" />
          </button>

          <button
            disabled={true}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-500 cursor-not-allowed"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{formatTime(Math.floor(audioCurrentTime))}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${audioDuration ? (audioCurrentTime / audioDuration) * 100 : 0}%` }}
                />
              </div>
              <span>{formatTime(Math.floor(audioDuration))}</span>
            </div>
          </div>
          
          <Volume2 className="h-5 w-5 text-gray-600" />
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a demonstration of the AQA listening assessment format. In a real assessment, you would listen to each audio clip a maximum of 2 times.
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
        {currentQuestion.type === 'letter-matching' && (
          <LetterMatchingQuestion
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        )}

        {currentQuestion.type === 'multiple-choice' && (
          <MultipleChoiceQuestion
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        )}

        {currentQuestion.type === 'lifestyle-grid' && (
          <LifestyleGridQuestion
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        )}

        {currentQuestion.type === 'opinion-rating' && (
          <OpinionRatingQuestion
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        )}

        {currentQuestion.type === 'open-response' && (
          <OpenResponseQuestion
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        )}

        {currentQuestion.type === 'activity-timing' && (
          <ActivityTimingQuestion
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        )}

        {currentQuestion.type === 'multi-part' && (
          <MultiPartQuestion
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        )}

        {currentQuestion.type === 'dictation' && (
          <DictationQuestion
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
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

// Question Type Components

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
              {index + 1}.{index + 1} {part.question}
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

  const playSentence = (sentenceIndex: number, stage: 'full' | 'sections' | 'full-again' = 'full') => {
    setCurrentSentence(sentenceIndex);
    setPlaybackStage(stage);
    // In a real implementation, you would play different audio files or segments
    // For now, we'll just simulate the playback
    setIsPlayingSentence(true);
    setTimeout(() => setIsPlayingSentence(false), 3000); // Simulate audio duration
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
              placeholder="Escribe lo que escuchas en español..."
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
