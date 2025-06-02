'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, Play, Pause, Volume2, VolumeX,
  AlertCircle, CheckCircle, X, HelpCircle, ArrowLeft, ArrowRight
} from 'lucide-react';

type Question = {
  id: string;
  type: 'multiple-choice' | 'short-answer' | 'dictation' | 'true-false';
  text: string;
  audioSrc: string;
  options?: string[];
  correctAnswer: string | string[];
  marks: number;
  tier: 'foundation' | 'higher' | 'both';
};

const listeningQuestions: Question[] = [
  {
    id: 'q1',
    type: 'multiple-choice',
    text: 'Listen to the conversation about hobbies. What does Carlos like to do in his free time?',
    audioSrc: '/audio/exam/hobbies.mp3',
    options: [
      'Play football',
      'Read books',
      'Watch movies',
      'Play video games'
    ],
    correctAnswer: 'Read books',
    marks: 1,
    tier: 'foundation'
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    text: 'Listen to the announcement at the train station. What time does the next train to Madrid leave?',
    audioSrc: '/audio/exam/train-station.mp3',
    options: [
      '10:15',
      '10:30',
      '10:45',
      '11:00'
    ],
    correctAnswer: '10:45',
    marks: 1,
    tier: 'foundation'
  },
  {
    id: 'q3',
    type: 'short-answer',
    text: 'Listen to the conversation about restaurants. What does María recommend and why?',
    audioSrc: '/audio/exam/restaurant.mp3',
    correctAnswer: ['La Tapería', 'good value', 'delicious tapas'],
    marks: 3,
    tier: 'foundation'
  },
  {
    id: 'q4',
    type: 'dictation',
    text: 'Listen and write exactly what you hear.',
    audioSrc: '/audio/exam/dictation-1.mp3',
    correctAnswer: 'Me gusta mucho viajar y conocer nuevas culturas.',
    marks: 4,
    tier: 'foundation'
  },
  {
    id: 'q5',
    type: 'true-false',
    text: 'Listen to the conversation about the weather forecast. Are these statements true or false?',
    audioSrc: '/audio/exam/weather.mp3',
    options: [
      'It will rain tomorrow.',
      'The temperature will be 25 degrees.',
      'It will be sunny on the weekend.',
      'It will be windy on Friday.'
    ],
    correctAnswer: ['true', 'false', 'true', 'true'],
    marks: 4,
    tier: 'foundation'
  },
  {
    id: 'q6',
    type: 'multiple-choice',
    text: 'Listen to the interview about environmental issues. What is the main concern of the speaker?',
    audioSrc: '/audio/exam/environment.mp3',
    options: [
      'Air pollution in cities',
      'Plastic in the oceans',
      'Climate change',
      'Deforestation'
    ],
    correctAnswer: 'Plastic in the oceans',
    marks: 1,
    tier: 'higher'
  },
  {
    id: 'q7',
    type: 'short-answer',
    text: 'Listen to the discussion about technology. What are the two main advantages and one disadvantage of social media mentioned?',
    audioSrc: '/audio/exam/technology.mp3',
    correctAnswer: ['connect with friends', 'share information quickly', 'privacy concerns'],
    marks: 3,
    tier: 'higher'
  },
  {
    id: 'q8',
    type: 'dictation',
    text: 'Listen and write exactly what you hear.',
    audioSrc: '/audio/exam/dictation-2.mp3',
    correctAnswer: 'Es fundamental que protejamos el medio ambiente para las futuras generaciones.',
    marks: 5,
    tier: 'higher'
  },
  {
    id: 'q9',
    type: 'multiple-choice',
    text: 'Listen to the conversation about future career plans. What profession does Elena want to pursue and why?',
    audioSrc: '/audio/exam/career.mp3',
    options: [
      'Doctor - to help people',
      'Engineer - to build things',
      'Teacher - to work with children',
      'Journalist - to travel the world'
    ],
    correctAnswer: 'Teacher - to work with children',
    marks: 1,
    tier: 'higher'
  },
  {
    id: 'q10',
    type: 'short-answer',
    text: 'Listen to the radio program about healthy living. List three recommendations given by the expert.',
    audioSrc: '/audio/exam/healthy-living.mp3',
    correctAnswer: ['exercise regularly', 'eat a balanced diet', 'get enough sleep', 'reduce stress'],
    marks: 3,
    tier: 'higher'
  }
];

// Languages available for practice
const languages = [
  { id: 'spanish', name: 'Spanish', flag: '🇪🇸' },
  { id: 'french', name: 'French', flag: '🇫🇷' },
  { id: 'german', name: 'German', flag: '🇩🇪' },
  { id: 'italian', name: 'Italian', flag: '🇮🇹' }
];

export default function ListeningPracticePage() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // State
  const [tier, setTier] = useState<'foundation' | 'higher'>('foundation');
  const [selectedLanguage, setSelectedLanguage] = useState('spanish');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string | string[]}>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  // Get questions based on tier
  const filteredQuestions = listeningQuestions.filter(
    q => q.tier === tier || q.tier === 'both'
  );
  
  const currentQuestion = filteredQuestions[currentQuestionIdx];
  
  // Play/pause audio
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Handle audio end
  useEffect(() => {
    const handleAudioEnd = () => {
      setIsPlaying(false);
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnd);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnd);
      }
    };
  }, [audioRef.current]);
  
  // Handle answer change for multiple-choice or short-answer
  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value
    });
  };
  
  // Handle answer change for true-false
  const handleTrueFalseChange = (idx: number, value: string) => {
    const questionId = currentQuestion.id;
    const currentAnswers = [...(answers[questionId] as string[] || [])];
    
    // Update the answer at the specific index
    currentAnswers[idx] = value;
    
    setAnswers({
      ...answers,
      [questionId]: currentAnswers
    });
  };
  
  // Start assessment
  const startAssessment = () => {
    setHasStarted(true);
  };
  
  // Go to next question
  const nextQuestion = () => {
    if (currentQuestionIdx < filteredQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setIsPlaying(false);
    }
  };
  
  // Go to previous question
  const prevQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
      setIsPlaying(false);
    }
  };
  
  // Submit assessment
  const handleSubmit = () => {
    setIsSubmitted(true);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };
  
  // Reset assessment
  const resetAssessment = () => {
    setAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIdx(0);
    setHasStarted(false);
  };
  
  // Calculate score
  const calculateScore = () => {
    if (!isSubmitted) return 0;
    
    let score = 0;
    let totalMarks = 0;
    
    filteredQuestions.forEach(question => {
      totalMarks += question.marks;
      
      if (question.type === 'true-false') {
        // For true-false questions, check each statement
        const userAnswers = answers[question.id] as string[] || [];
        const correctAnswers = question.correctAnswer as string[];
        
        correctAnswers.forEach((ans, idx) => {
          if (userAnswers[idx] === ans) {
            score += question.marks / correctAnswers.length;
          }
        });
      } else if (question.type === 'short-answer') {
        // For short-answer questions, partial credit possible
        const userAnswer = (answers[question.id] as string || '').toLowerCase();
        const correctAnswers = (question.correctAnswer as string[]).map(a => a.toLowerCase());
        
        // Check how many key points were included
        let matchCount = 0;
        correctAnswers.forEach(point => {
          if (userAnswer.includes(point)) {
            matchCount++;
          }
        });
        
        score += (matchCount / correctAnswers.length) * question.marks;
      } else if (question.type === 'dictation') {
        // For dictation, check similarity (simplified)
        const userAnswer = (answers[question.id] as string || '').toLowerCase().trim();
        const correctAnswer = (question.correctAnswer as string).toLowerCase().trim();
        
        if (userAnswer === correctAnswer) {
          score += question.marks;
        } else {
          // Simplified partial scoring based on word match
          const userWords = userAnswer.split(/\s+/);
          const correctWords = correctAnswer.split(/\s+/);
          let matchCount = 0;
          
          userWords.forEach(word => {
            if (correctWords.includes(word)) {
              matchCount++;
            }
          });
          
          score += (matchCount / correctWords.length) * question.marks;
        }
      } else if (question.type === 'multiple-choice') {
        // For multiple-choice, all or nothing
        if (answers[question.id] === question.correctAnswer) {
          score += question.marks;
        }
      }
    });
    
    return Math.round(score);
  };
  
  // Render question based on type
  const renderQuestion = () => {
    if (!currentQuestion) return null;
    
    return (
      <div>
        <div className="mb-4">
          <p className="text-lg font-medium">{currentQuestion.text}</p>
        </div>
        
        <div className="mb-4 flex items-center justify-center">
          <audio ref={audioRef} src={currentQuestion.audioSrc} className="hidden" />
          <button
            onClick={toggleAudio}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
        </div>
        
        <div className="mb-6">
          {currentQuestion.type === 'multiple-choice' && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option, idx) => (
                <label key={idx} className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={() => handleAnswerChange(option)}
                    disabled={isSubmitted}
                    className="mr-3"
                  />
                  <span>{option}</span>
                  
                  {isSubmitted && (
                    <>
                      {option === currentQuestion.correctAnswer && (
                        <CheckCircle className="ml-auto text-green-500 h-5 w-5" />
                      )}
                      {answers[currentQuestion.id] === option && option !== currentQuestion.correctAnswer && (
                        <X className="ml-auto text-red-500 h-5 w-5" />
                      )}
                    </>
                  )}
                </label>
              ))}
            </div>
          )}
          
          {currentQuestion.type === 'short-answer' && (
            <div>
              <textarea
                value={answers[currentQuestion.id] as string || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-32"
                placeholder="Write your answer..."
                disabled={isSubmitted}
              />
              
              {isSubmitted && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                  <p className="font-medium text-blue-800">Key points to include:</p>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {(currentQuestion.correctAnswer as string[]).map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {currentQuestion.type === 'dictation' && (
            <div>
              <textarea
                value={answers[currentQuestion.id] as string || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-24"
                placeholder="Write exactly what you hear..."
                disabled={isSubmitted}
              />
              
              {isSubmitted && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                  <p className="font-medium text-blue-800">Correct answer:</p>
                  <p className="mt-2">{currentQuestion.correctAnswer}</p>
                </div>
              )}
            </div>
          )}
          
          {currentQuestion.type === 'true-false' && (
            <div className="space-y-4">
              {currentQuestion.options?.map((statement, idx) => (
                <div key={idx} className="p-3 border rounded-md">
                  <p className="mb-2 font-medium">{statement}</p>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`${currentQuestion.id}_${idx}`}
                        value="true"
                        checked={(answers[currentQuestion.id] as string[] || [])[idx] === 'true'}
                        onChange={() => handleTrueFalseChange(idx, 'true')}
                        disabled={isSubmitted}
                        className="mr-2"
                      />
                      <span>True</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`${currentQuestion.id}_${idx}`}
                        value="false"
                        checked={(answers[currentQuestion.id] as string[] || [])[idx] === 'false'}
                        onChange={() => handleTrueFalseChange(idx, 'false')}
                        disabled={isSubmitted}
                        className="mr-2"
                      />
                      <span>False</span>
                    </label>
                    
                    {isSubmitted && (
                      <span className="ml-auto">
                        {(answers[currentQuestion.id] as string[] || [])[idx] === (currentQuestion.correctAnswer as string[])[idx] ? (
                          <CheckCircle className="text-green-500 h-5 w-5" />
                        ) : (
                          <X className="text-red-500 h-5 w-5" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="text-right text-sm text-gray-600">
          <span>Question worth {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}</span>
        </div>
      </div>
    );
  };
  
  // Determine progress
  const progress = Math.round(((currentQuestionIdx + 1) / filteredQuestions.length) * 100);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <Link href="/exams/aqa/ks4_gcse">
            <button className="flex items-center text-blue-500 hover:text-blue-600">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to GCSE
            </button>
          </Link>
          
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center text-blue-500 hover:text-blue-600"
          >
            <HelpCircle className="h-5 w-5 mr-1" />
            {showHelp ? 'Hide Help' : 'Show Help'}
          </button>
        </div>
        
        <h1 className="text-3xl font-bold mt-4 text-center">
          GCSE {languages.find(l => l.id === selectedLanguage)?.name || 'Spanish'} Listening Practice
        </h1>
        
        {!hasStarted && (
          <div className="max-w-xl mx-auto mt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Language
              </label>
              <div className="flex gap-2">
                {languages.map(language => (
                  <button
                    key={language.id}
                    onClick={() => setSelectedLanguage(language.id)}
                    className={`px-3 py-2 rounded-md border ${
                      selectedLanguage === language.id
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{language.flag}</span>
                    {language.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Tier
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTier('foundation')}
                  className={`px-4 py-2 rounded-md border ${
                    tier === 'foundation'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Foundation Tier (Grades 1–5)
                </button>
                <button
                  onClick={() => setTier('higher')}
                  className={`px-4 py-2 rounded-md border ${
                    tier === 'higher'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Higher Tier (Grades 4–9)
                </button>
              </div>
            </div>
            
            <div className="mb-6 bg-blue-50 p-4 rounded-md border border-blue-100">
              <div className="flex items-start">
                <Volume2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Assessment Information:</p>
                  <ul className="mt-2 text-blue-700 text-sm space-y-1">
                    <li>• You will need to use headphones or speakers</li>
                    <li>• You can play each audio as many times as you need</li>
                    <li>• Answer all questions to the best of your ability</li>
                    <li>• {filteredQuestions.length} questions, various question types</li>
                    <li>• Use the navigation below to move between questions</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <button
              onClick={startAssessment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Start Listening Practice
            </button>
          </div>
        )}
      </div>
      
      {/* Help panel */}
      {showHelp && (
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <h3 className="font-bold text-lg mb-2">Listening Assessment Tips</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <span>Read the questions before listening to know what to listen for</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <span>Listen for key words and phrases related to the questions</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <span>Pay attention to tone of voice and background sounds for context</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <span>For dictation, focus on spelling and accents</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <span>Don't panic if you miss something - you can replay the audio</span>
            </li>
          </ul>
          <button
            onClick={() => setShowHelp(false)}
            className="mt-3 text-blue-600 hover:underline text-sm"
          >
            Hide Tips
          </button>
        </div>
      )}
      
      {/* Assessment content */}
      {hasStarted && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Progress indicator */}
          <div className="px-6 pt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Question {currentQuestionIdx + 1} of {filteredQuestions.length}</span>
              <span>Progress: {progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Question navigation */}
          <div className="px-6 mb-4 flex flex-wrap gap-2">
            {filteredQuestions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentQuestionIdx(idx);
                  setIsPlaying(false);
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border ${
                  idx === currentQuestionIdx
                    ? 'bg-blue-600 text-white border-blue-600'
                    : answers[q.id]
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          
          {/* Current question */}
          <div className="p-6 border-t">
            {renderQuestion()}
          </div>
          
          {/* Navigation buttons */}
          <div className="p-6 border-t bg-gray-50 flex justify-between">
            <button
              onClick={prevQuestion}
              className="px-4 py-2 border rounded-md flex items-center text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              disabled={currentQuestionIdx === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>
            
            {currentQuestionIdx < filteredQuestions.length - 1 ? (
              <button
                onClick={nextQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700"
                disabled={isSubmitted}
              >
                Finish
                <CheckCircle className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
          
          {/* Results */}
          {isSubmitted && (
            <div className="p-6 border-t">
              <h2 className="text-xl font-bold mb-4">Assessment Complete</h2>
              
              <div className="mb-6 bg-blue-50 p-4 rounded-md border border-blue-100">
                <p className="font-medium text-blue-800">Your score:</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">
                  {calculateScore()} out of {filteredQuestions.reduce((total, q) => total + q.marks, 0)} marks
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={resetAssessment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Try Again
                </button>
                <Link href="/exams/aqa/ks4_gcse">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    Return to GCSE
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 