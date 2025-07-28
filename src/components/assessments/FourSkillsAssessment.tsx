'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import {
  BookOpen,
  PenTool,
  Headphones,
  Mic,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  Play,
  Square,
  Upload,
  Info
} from 'lucide-react';
import { examStyleContent } from '../../data/exam-style-questions';
import AQAListeningAssessment from './AQAListeningAssessment';

interface FourSkillsAssessmentProps {
  language: 'es' | 'fr' | 'de';
  level: 'KS3' | 'KS4';
  skills: ('reading' | 'writing' | 'listening' | 'speaking')[];
  category?: string;
  subcategory?: string;
  difficulty: 'foundation' | 'higher';
  examBoard: 'AQA' | 'Edexcel' | 'Eduqas' | 'General';
  assignmentMode?: boolean;
  onComplete?: (results: AssessmentResults) => void;
}

interface AssessmentResults {
  skillResults: SkillResult[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  passed: boolean;
  completedAt: Date;
}

interface SkillResult {
  skill: 'reading' | 'writing' | 'listening' | 'speaking';
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  questionResults: QuestionResult[];
}

interface QuestionResult {
  questionId: string;
  userAnswer: any;
  correctAnswer?: any;
  score: number;
  maxScore: number;
  feedback?: string;
  timeSpent: number;
}

export default function FourSkillsAssessment({
  language,
  level,
  skills,
  category,
  subcategory,
  difficulty,
  examBoard,
  assignmentMode = false,
  onComplete
}: FourSkillsAssessmentProps) {
  const { user } = useAuth();
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [skillResults, setSkillResults] = useState<SkillResult[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [skillStartTime, setSkillStartTime] = useState<Date | null>(null);
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<string, Date>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // Timer effect
  useEffect(() => {
    if (startTime && !isCompleted) {
      const timer = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, isCompleted]);

  // Load questions for current skill
  useEffect(() => {
    if (skills.length > 0) {
      loadQuestionsForSkill(skills[currentSkillIndex]);
      setStartTime(new Date());
      setSkillStartTime(new Date());
    }
  }, [currentSkillIndex, skills]);

  const loadQuestionsForSkill = (skill: string) => {
    const languageKey = language === 'es' ? 'spanish' : language === 'fr' ? 'french' : 'german';
    let availableQuestions = examStyleContent.questions[languageKey] || [];

    // Filter by skill, level, difficulty, and optionally category/subcategory
    availableQuestions = availableQuestions.filter(q => 
      q.skill === skill &&
      q.level === level &&
      q.difficulty === difficulty &&
      (examBoard === 'General' || q.examBoard === examBoard) &&
      (!category || q.category === category) &&
      (!subcategory || q.subcategory === subcategory)
    );

    // If no questions found, get any questions for the skill
    if (availableQuestions.length === 0) {
      availableQuestions = examStyleContent.questions[languageKey]?.filter(q => 
        q.skill === skill && q.level === level && q.difficulty === difficulty
      ) || [];
    }

    // Select up to 5 questions per skill
    const selectedQuestions = availableQuestions.slice(0, 5);
    setQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);

    // Initialize question start times
    if (selectedQuestions.length > 0) {
      setQuestionStartTimes({ [selectedQuestions[0].id]: new Date() });
    }
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const nextQuestionId = questions[nextIndex].id;
      setQuestionStartTimes(prev => ({
        ...prev,
        [nextQuestionId]: new Date()
      }));
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextSkill = async () => {
    // Calculate results for current skill
    const skillResult = calculateSkillResult(skills[currentSkillIndex]);
    setSkillResults(prev => [...prev, skillResult]);

    if (currentSkillIndex < skills.length - 1) {
      // Move to next skill
      setCurrentSkillIndex(currentSkillIndex + 1);
      setUserAnswers({});
      setSkillStartTime(new Date());
    } else {
      // Complete assessment
      await completeAssessment([...skillResults, skillResult]);
    }
  };

  const calculateSkillResult = (skill: string): SkillResult => {
    const questionResults: QuestionResult[] = questions.map(question => {
      const userAnswer = userAnswers[question.id];
      const { score, maxScore, feedback } = evaluateAnswer(question, userAnswer);
      const questionStartTime = questionStartTimes[question.id];
      const timeSpent = questionStartTime ? Date.now() - questionStartTime.getTime() : 0;

      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        score,
        maxScore,
        feedback,
        timeSpent: Math.round(timeSpent / 1000)
      };
    });

    const totalScore = questionResults.reduce((sum, r) => sum + r.score, 0);
    const maxScore = questionResults.reduce((sum, r) => sum + r.maxScore, 0);
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const skillTimeSpent = skillStartTime ? Date.now() - skillStartTime.getTime() : 0;

    return {
      skill: skill as any,
      score: totalScore,
      maxScore,
      percentage,
      timeSpent: Math.round(skillTimeSpent / 1000),
      questionResults
    };
  };

  const evaluateAnswer = (question: any, userAnswer: any): { score: number; maxScore: number; feedback?: string } => {
    const maxScore = question.points;

    if (!userAnswer) {
      return { score: 0, maxScore, feedback: 'No answer provided' };
    }

    switch (question.questionType) {
      case 'multiple-choice':
        return {
          score: userAnswer === question.correctAnswer ? maxScore : 0,
          maxScore,
          feedback: userAnswer === question.correctAnswer ? 'Correct!' : `Correct answer: ${question.correctAnswer}`
        };

      case 'true-false':
        return {
          score: userAnswer === question.correctAnswer ? maxScore : 0,
          maxScore,
          feedback: userAnswer === question.correctAnswer ? 'Correct!' : `Correct answer: ${question.correctAnswer}`
        };

      case 'gap-fill':
        if (Array.isArray(question.correctAnswer) && Array.isArray(userAnswer)) {
          const correctCount = userAnswer.filter((answer, index) => 
            answer && answer.toLowerCase().trim() === question.correctAnswer[index]?.toLowerCase().trim()
          ).length;
          return {
            score: Math.round((correctCount / question.correctAnswer.length) * maxScore),
            maxScore,
            feedback: `${correctCount}/${question.correctAnswer.length} correct`
          };
        }
        return { score: 0, maxScore };

      case 'translation':
        // For translation, give partial credit based on key words
        if (Array.isArray(question.correctAnswer)) {
          const userText = userAnswer.toLowerCase();
          const correctWords = question.correctAnswer.map(answer => answer.toLowerCase());
          const matchedWords = correctWords.filter(word => userText.includes(word)).length;
          return {
            score: Math.round((matchedWords / correctWords.length) * maxScore),
            maxScore,
            feedback: `${matchedWords}/${correctWords.length} key elements correct`
          };
        }
        return { score: 0, maxScore };

      case 'short-answer':
      case 'essay':
        // For writing tasks, give full marks for now (would need manual marking in real scenario)
        return {
          score: userAnswer.trim().length > 10 ? maxScore : Math.round(maxScore * 0.5),
          maxScore,
          feedback: 'Answer submitted for review'
        };

      case 'listening-comprehension':
        return {
          score: userAnswer === question.correctAnswer ? maxScore : 0,
          maxScore,
          feedback: userAnswer === question.correctAnswer ? 'Correct!' : `Correct answer: ${question.correctAnswer}`
        };

      case 'speaking-prompt':
      case 'photo-description':
        // For speaking tasks, give full marks for attempting (would need manual assessment)
        return {
          score: audioBlob ? maxScore : 0,
          maxScore,
          feedback: audioBlob ? 'Recording submitted for assessment' : 'No recording provided'
        };

      default:
        return { score: 0, maxScore };
    }
  };

  const completeAssessment = async (allSkillResults: SkillResult[]) => {
    const totalScore = allSkillResults.reduce((sum, skill) => sum + skill.score, 0);
    const maxScore = allSkillResults.reduce((sum, skill) => sum + skill.maxScore, 0);
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const passed = percentage >= (difficulty === 'foundation' ? 60 : 70);

    const results: AssessmentResults = {
      skillResults: allSkillResults,
      totalScore,
      maxScore,
      percentage,
      timeSpent,
      passed,
      completedAt: new Date()
    };

    // Save results to database
    try {
      await fetch('/api/four-skills-assessment/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          language,
          level,
          difficulty,
          examBoard,
          results,
          assignmentMode
        })
      });
    } catch (error) {
      console.error('Error saving assessment results:', error);
    }

    setIsCompleted(true);
    if (onComplete) {
      onComplete(results);
    }
  };

  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        handleAnswerChange(questions[currentQuestionIndex].id, blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case 'reading': return <BookOpen className="h-6 w-6" />;
      case 'writing': return <PenTool className="h-6 w-6" />;
      case 'listening': return <Headphones className="h-6 w-6" />;
      case 'speaking': return <Mic className="h-6 w-6" />;
      default: return <BookOpen className="h-6 w-6" />;
    }
  };

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'reading': return 'text-blue-600 bg-blue-100';
      case 'writing': return 'text-green-600 bg-green-100';
      case 'listening': return 'text-purple-600 bg-purple-100';
      case 'speaking': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Questions Available</h2>
          <p className="text-gray-500">No assessment questions found for the selected criteria.</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const results = {
      skillResults,
      totalScore: skillResults.reduce((sum, skill) => sum + skill.score, 0),
      maxScore: skillResults.reduce((sum, skill) => sum + skill.maxScore, 0),
      percentage: 0,
      timeSpent,
      passed: false,
      completedAt: new Date()
    };
    results.percentage = results.maxScore > 0 ? Math.round((results.totalScore / results.maxScore) * 100) : 0;
    results.passed = results.percentage >= (difficulty === 'foundation' ? 60 : 70);

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              results.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {results.passed ? (
                <CheckCircle className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {results.passed ? 'Assessment Complete!' : 'Keep Practicing!'}
            </h2>
            <p className="text-gray-600">
              {results.passed ? 'You have successfully completed the assessment' : 'You can improve with more practice'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{results.percentage}%</div>
              <div className="text-gray-600">Overall Score</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {results.totalScore}/{results.maxScore}
              </div>
              <div className="text-gray-600">Points</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {formatTime(results.timeSpent)}
              </div>
              <div className="text-gray-600">Time</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">
                {results.passed ? 'PASSED' : 'FAILED'}
              </div>
              <div className="text-gray-600">Status</div>
            </div>
          </div>

          {/* Skill breakdown */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Skills Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.skillResults.map((skillResult, index) => (
                <div key={skillResult.skill} className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-lg mr-3 ${getSkillColor(skillResult.skill)}`}>
                      {getSkillIcon(skillResult.skill)}
                    </div>
                    <div>
                      <h4 className="font-semibold capitalize">{skillResult.skill}</h4>
                      <p className="text-sm text-gray-500">{skillResult.percentage}% • {formatTime(skillResult.timeSpent)}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${skillResult.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {skillResult.score}/{skillResult.maxScore} points
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!assignmentMode && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Menu
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentSkill = skills[currentSkillIndex];
  const currentQuestion = questions[currentQuestionIndex];

  // Use AQA Listening Assessment for AQA exam board and listening skill
  if (examBoard === 'AQA' && currentSkill === 'listening') {
    return (
      <AQAListeningAssessment
        language={language}
        level={level}
        difficulty={difficulty}
        onComplete={(results) => {
          // Convert AQA results to our format
          const skillResult: SkillResult = {
            skill: 'listening',
            score: results.questionsCompleted * 10, // Placeholder scoring
            maxScore: questions.length * 10,
            percentage: Math.round((results.questionsCompleted / questions.length) * 100),
            timeSpent: results.totalTimeSpent,
            questionResults: [] // Would need to map from AQA format
          };

          const newSkillResults = [...skillResults, skillResult];
          setSkillResults(newSkillResults);

          // Move to next skill or complete
          if (currentSkillIndex < skills.length - 1) {
            setCurrentSkillIndex(prev => prev + 1);
            setCurrentQuestionIndex(0);
            setSkillStartTime(new Date());
          } else {
            setIsCompleted(true);
            if (onComplete) {
              onComplete({
                skillResults: newSkillResults,
                totalScore: newSkillResults.reduce((sum, skill) => sum + skill.score, 0),
                maxScore: newSkillResults.reduce((sum, skill) => sum + skill.maxScore, 0),
                percentage: 0,
                timeSpent,
                passed: false,
                completedAt: new Date()
              });
            }
          }
        }}
        onQuestionComplete={(questionId, answer, timeSpent) => {
          // Handle individual question completion if needed
          console.log('Question completed:', questionId, answer, timeSpent);
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Disclaimer Notice */}
      <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-4 flex items-start text-sm mb-6">
        <Info className="h-5 w-5 flex-shrink-0 mr-3 text-blue-500" />
        <div>
          <p className="font-medium mb-1">Important: Practice Assessment</p>
          <p>This is an original practice assessment designed to reflect {examBoard} exam formats. LanguageGems is not affiliated with {examBoard} or any official examination board. <a href="/legal/disclaimer" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-blue-900">Read our full disclaimer.</a></p>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Four Skills Assessment</h1>
            <p className="text-gray-600">
              {currentSkill.charAt(0).toUpperCase() + currentSkill.slice(1)} • Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-700">
              Time: {formatTime(timeSpent)}
            </div>
            <div className="text-sm text-gray-500">
              {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
            </div>
          </div>
        </div>
        
        {/* Progress indicators */}
        <div className="mt-4">
          <div className="flex space-x-2 mb-2">
            {skills.map((skill, index) => (
              <div
                key={skill}
                className={`flex-1 h-2 rounded-full ${
                  index < currentSkillIndex ? 'bg-green-500' :
                  index === currentSkillIndex ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              ></div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Question content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className={`p-3 rounded-lg mr-3 ${getSkillColor(currentSkill)}`}>
              {getSkillIcon(currentSkill)}
            </div>
            <div>
              <h2 className="text-xl font-semibold capitalize">{currentSkill} Assessment</h2>
              <p className="text-sm text-gray-500">{examBoard} • {level} • {difficulty}</p>
            </div>
          </div>

          {currentQuestion.context && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Context:</h3>
              <p className="text-gray-700 whitespace-pre-line">{currentQuestion.context}</p>
            </div>
          )}

          <div className="mb-4">
            <h3 className="font-medium mb-2">Question {currentQuestionIndex + 1}:</h3>
            <p className="text-lg">{currentQuestion.question}</p>
          </div>
        </div>

        {/* Answer input */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
          
          {/* Render different input types based on question type */}
          {currentQuestion.questionType === 'multiple-choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option: string, index: number) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 border">
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={userAnswers[currentQuestion.id] === option}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {(currentQuestion.questionType === 'short-answer' || currentQuestion.questionType === 'essay') && (
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={currentQuestion.questionType === 'essay' ? 8 : 4}
              placeholder="Write your answer here..."
              value={userAnswers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            />
          )}

          {currentQuestion.questionType === 'translation' && (
            <div className="space-y-3">
              {Array.isArray(currentQuestion.correctAnswer) ? (
                currentQuestion.correctAnswer.map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Translation ${index + 1}...`}
                    value={(userAnswers[currentQuestion.id] as string[])?.[index] || ''}
                    onChange={(e) => {
                      const currentAnswers = (userAnswers[currentQuestion.id] as string[]) || [];
                      const newAnswers = [...currentAnswers];
                      newAnswers[index] = e.target.value;
                      handleAnswerChange(currentQuestion.id, newAnswers);
                    }}
                  />
                ))
              ) : (
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Write your translation here..."
                  value={userAnswers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                />
              )}
            </div>
          )}

          {(currentQuestion.questionType === 'speaking-prompt' || currentQuestion.questionType === 'photo-description') && (
            <div className="space-y-4">
              <div className="text-center">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex items-center justify-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Mic className="h-5 w-5 mr-2" />
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex items-center justify-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Stop Recording
                  </button>
                )}
              </div>
              {audioBlob && (
                <div className="text-center text-green-600">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2" />
                  Recording completed
                </div>
              )}
            </div>
          )}

          {currentQuestion.questionType === 'listening-comprehension' && (
            <div className="space-y-4">
              {currentQuestion.audioUrl && (
                <div className="text-center">
                  <audio controls className="w-full">
                    <source src={currentQuestion.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              <div className="space-y-3">
                {currentQuestion.options?.map((option: string, index: number) => (
                  <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 border">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={userAnswers[currentQuestion.id] === option}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </button>
            
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleNextSkill}
                className="flex items-center px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                {currentSkillIndex === skills.length - 1 ? (
                  <>
                    <Award className="h-4 w-4 mr-2" />
                    Complete Assessment
                  </>
                ) : (
                  <>
                    Next Skill
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
