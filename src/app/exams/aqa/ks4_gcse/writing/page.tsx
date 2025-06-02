'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, Clock, Save, AlertCircle, 
  CheckCircle, X, HelpCircle, Edit, ArrowLeft, ArrowRight
} from 'lucide-react';
import Image from 'next/image';

type Question = {
  id: string;
  type: 'photo' | 'short-email' | 'grammar' | 'translation' | 'article' | 'extended';
  text: string;
  bullets?: string[];
  marks: number;
  image?: string;
  options?: {
    id: string;
    options: string[];
    correct: string;
  }[];
  sentences?: string[];
  wordLimit?: number;
};

// Foundation tier questions
const foundationQuestions: Question[] = [
  {
    id: 'f1',
    type: 'photo',
    text: 'What is in this photo? Write five sentences in Spanish.',
    marks: 10,
    image: '/images/exam/family-photo.jpg',
    wordLimit: 50
  },
  {
    id: 'f2',
    type: 'short-email',
    text: 'Write an email to your Spanish friend about your daily routine. Write approximately 50 words in Spanish. You must write something about each bullet point.',
    bullets: [
      'your morning routine',
      'your meals',
      'your school subjects',
      'your hobbies',
      'your weekend activities'
    ],
    marks: 10,
    wordLimit: 50
  },
  {
    id: 'f3',
    type: 'grammar',
    text: 'Using your knowledge of grammar, complete the following sentences in Spanish. Choose the correct Spanish word from the three options in the grid.',
    options: [
      {
        id: 'g1',
        options: ['voy', 'vas', 'va'],
        correct: 'voy'
      },
      {
        id: 'g2',
        options: ['come', 'comen', 'comemos'],
        correct: 'comemos'
      },
      {
        id: 'g3',
        options: ['trabajas', 'trabajo', 'trabaja'],
        correct: 'trabajas'
      },
      {
        id: 'g4',
        options: ['viven', 'vivimos', 'vive'],
        correct: 'viven'
      },
      {
        id: 'g5',
        options: ['estudia', 'estudio', 'estudian'],
        correct: 'estudia'
      }
    ],
    marks: 5
  },
  {
    id: 'f4',
    type: 'translation',
    text: 'Translate the following sentences into Spanish:',
    sentences: [
      'I enjoy playing sports with my friends.',
      'My sister watches TV every evening.',
      'We want to visit Barcelona next summer.',
      'They have a beautiful house near the beach.',
      'Yesterday I went to the cinema with my family.'
    ],
    marks: 10,
    wordLimit: 100
  },
  {
    id: 'f5',
    type: 'article',
    text: 'You are writing an article about your town and local area. Write approximately 90 words in Spanish. You must write something about each bullet point.',
    bullets: [
      'what you like or dislike about your town',
      'what facilities are available for young people',
      'what you did in town last weekend'
    ],
    marks: 15,
    wordLimit: 90
  }
];

// Higher tier questions
const higherQuestions: Question[] = [
  {
    id: 'h1',
    type: 'translation',
    text: 'Translate the following sentences into Spanish:',
    sentences: [
      'I have been studying Spanish for three years.',
      'My parents would like to visit South America next year.',
      'If I had more time, I would learn another language.',
      'When I arrived at the station, the train had already left.',
      'We should protect the environment for future generations.'
    ],
    marks: 10,
    wordLimit: 100
  },
  {
    id: 'h2',
    type: 'article',
    text: 'You are writing an article about technology in your life. Write approximately 90 words in Spanish. You must write something about each bullet point.',
    bullets: [
      'how you use technology in your daily life',
      'the advantages and disadvantages of social media',
      'how you used technology during a recent holiday'
    ],
    marks: 15,
    wordLimit: 90
  },
  {
    id: 'h3',
    type: 'extended',
    text: 'You are writing a blog post for a Spanish website about the environment. Write approximately 150 words in Spanish. You must write something about both bullet points.',
    bullets: [
      'the environmental problems in your local area and what could be done to solve them',
      'what you personally do to protect the environment and why it is important'
    ],
    marks: 25,
    wordLimit: 150
  }
];

// Languages available for practice
const languages = [
  { id: 'spanish', name: 'Spanish', flag: '🇪🇸' },
  { id: 'french', name: 'French', flag: '🇫🇷' },
  { id: 'german', name: 'German', flag: '🇩🇪' },
  { id: 'italian', name: 'Italian', flag: '🇮🇹' }
];

export default function WritingPracticePage() {
  const router = useRouter();
  
  // State
  const [tier, setTier] = useState<'foundation' | 'higher'>('foundation');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [remainingTime, setRemainingTime] = useState(tier === 'foundation' ? 4200 : 4500); // 70 or 75 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('spanish');
  
  // Current questions based on tier
  const questions = tier === 'foundation' ? foundationQuestions : higherQuestions;
  const currentQuestion = questions[currentQuestionIdx];
  
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      handleSubmit();
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, remainingTime]);
  
  // Update timer when tier changes
  useEffect(() => {
    setRemainingTime(tier === 'foundation' ? 4200 : 4500); // 70 or 75 minutes
  }, [tier]);
  
  // Handle text input change
  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value
    });
  };
  
  // Change question
  const goToQuestion = (idx: number) => {
    if (idx >= 0 && idx < questions.length) {
      setCurrentQuestionIdx(idx);
    }
  };
  
  // Start assessment
  const startAssessment = () => {
    setIsTimerRunning(true);
  };
  
  // Pause/resume timer
  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };
  
  // Submit assessment
  const handleSubmit = () => {
    setIsTimerRunning(false);
    setIsSubmitted(true);
  };
  
  // Count words
  const countWords = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };
  
  // Reset assessment
  const resetAssessment = () => {
    setAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIdx(0);
    setRemainingTime(tier === 'foundation' ? 4200 : 4500);
    setIsTimerRunning(false);
  };
  
  // Render appropriate question type
  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'photo':
        return (
          <div>
            <div className="mb-4">
              <p className="text-lg font-medium">{currentQuestion.text}</p>
            </div>
            
            <div className="mb-6 max-w-md mx-auto">
              {currentQuestion.image && (
                <div className="relative h-64 w-full mb-4 border rounded">
                  <Image
                    src={currentQuestion.image}
                    alt="Question image"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
            </div>
            
            <div>
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-32"
                placeholder="Write your answer in Spanish..."
                disabled={isSubmitted}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{answers[currentQuestion.id] ? countWords(answers[currentQuestion.id]) : 0} words</span>
                <span>{currentQuestion.marks} marks</span>
              </div>
            </div>
          </div>
        );
        
      case 'short-email':
      case 'article':
      case 'extended':
        return (
          <div>
            <div className="mb-4">
              <p className="text-lg font-medium">{currentQuestion.text}</p>
              
              {currentQuestion.bullets && (
                <div className="mt-3 bg-gray-50 p-4 rounded-md">
                  <p className="font-medium mb-2">Mention:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {currentQuestion.bullets.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-3 text-sm text-gray-600">
                <p>Word limit: approximately {currentQuestion.wordLimit} words</p>
              </div>
            </div>
            
            <div>
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-40"
                placeholder="Write your answer in Spanish..."
                disabled={isSubmitted}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{answers[currentQuestion.id] ? countWords(answers[currentQuestion.id]) : 0} words</span>
                <span>{currentQuestion.marks} marks</span>
              </div>
            </div>
          </div>
        );
        
      case 'grammar':
        return (
          <div>
            <div className="mb-4">
              <p className="text-lg font-medium">{currentQuestion.text}</p>
            </div>
            
            <div className="space-y-6">
              {currentQuestion.options?.map((option, idx) => (
                <div key={option.id} className="bg-gray-50 p-4 rounded-md">
                  <p className="font-medium mb-2">Sentence {idx + 1}:</p>
                  <div className="flex items-center flex-wrap gap-2">
                    <p>Yo</p>
                    <select
                      value={answers[option.id] || ''}
                      onChange={(e) => setAnswers({...answers, [option.id]: e.target.value})}
                      className="px-3 py-1 border rounded-md"
                      disabled={isSubmitted}
                    >
                      <option value="">Select</option>
                      {option.options.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <p>a la escuela todos los días.</p>
                  </div>
                  
                  {isSubmitted && (
                    <div className="mt-2">
                      {answers[option.id] === option.correct ? (
                        <p className="text-green-600 text-sm flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Correct: {option.correct}
                        </p>
                      ) : (
                        <p className="text-red-600 text-sm flex items-center">
                          <X className="h-4 w-4 mr-1" />
                          Incorrect. Correct answer: {option.correct}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'translation':
        return (
          <div>
            <div className="mb-4">
              <p className="text-lg font-medium">{currentQuestion.text}</p>
            </div>
            
            <div className="space-y-6">
              {currentQuestion.sentences?.map((sentence, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-md">
                  <p className="font-medium mb-2">Sentence {idx + 1}:</p>
                  <p className="mb-3">{sentence}</p>
                  
                  <textarea
                    value={answers[`${currentQuestion.id}_${idx}`] || ''}
                    onChange={(e) => setAnswers({...answers, [`${currentQuestion.id}_${idx}`]: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md h-20"
                    placeholder="Write your translation in Spanish..."
                    disabled={isSubmitted}
                  />
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return <p>Question type not supported</p>;
    }
  };
  
  // Determine progress
  const progress = Math.round(((currentQuestionIdx + 1) / questions.length) * 100);
  
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
          GCSE {languages.find(l => l.id === selectedLanguage)?.name || 'Spanish'} Writing Practice
        </h1>
        
        {!isTimerRunning && !isSubmitted && (
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
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Assessment Information:</p>
                  <ul className="mt-2 text-blue-700 text-sm space-y-1">
                    <li>• Foundation Tier: 1 hour 10 minutes (70 minutes)</li>
                    <li>• Higher Tier: 1 hour 15 minutes (75 minutes)</li>
                    <li>• {tier === 'foundation' ? 'Five' : 'Three'} questions, 50 marks total</li>
                    <li>• You can use the navigation below to move between questions</li>
                    <li>• The timer will start when you click "Start Assessment"</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <button
              onClick={startAssessment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Start Assessment
            </button>
          </div>
        )}
      </div>
      
      {/* Help panel */}
      {showHelp && (
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <h3 className="font-bold text-lg mb-2">Writing Assessment Tips</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <span>Read the question carefully and make sure you cover all the bullet points</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <span>Pay attention to the word count - aim to be within 10% of the target</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <span>Use a variety of vocabulary, tenses, and structures to achieve higher marks</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <span>Include opinions and justifications in your longer responses</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <span>Check your work for spelling, gender, and agreement errors</span>
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
      {isTimerRunning || isSubmitted ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Timer and controls */}
          <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-medium mr-2">Time Remaining:</span>
              <span className={`font-mono ${remainingTime < 300 ? 'text-red-600' : ''}`}>
                {formatTime(remainingTime)}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={toggleTimer}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded border text-sm flex items-center"
                disabled={isSubmitted}
              >
                {isTimerRunning ? 'Pause' : 'Resume'}
              </button>
              
              <button
                onClick={handleSubmit}
                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded border text-sm flex items-center"
                disabled={isSubmitted}
              >
                <Save className="h-4 w-4 mr-1" />
                Submit
              </button>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="px-6 pt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
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
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => goToQuestion(idx)}
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
              onClick={() => goToQuestion(currentQuestionIdx - 1)}
              className="px-4 py-2 border rounded-md flex items-center text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              disabled={currentQuestionIdx === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>
            
            {currentQuestionIdx < questions.length - 1 ? (
              <button
                onClick={() => goToQuestion(currentQuestionIdx + 1)}
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
              <p className="mb-4">
                Your answers have been recorded. In a real exam, your writing would be marked by an examiner.
              </p>
              
              <div className="mb-6 bg-blue-50 p-4 rounded-md border border-blue-100">
                <p className="font-medium text-blue-800">Writing Assessment Criteria:</p>
                <ul className="mt-2 text-blue-700 text-sm space-y-1">
                  <li>• Communication: How clearly you convey your message</li>
                  <li>• Range and accuracy of language: Vocabulary and grammar</li>
                  <li>• Translation accuracy: How well you translate from English</li>
                  <li>• Quality of language: Complexity and sophistication</li>
                </ul>
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
      ) : null}
    </div>
  );
} 