'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  CheckCircle,
  XCircle,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  FileText,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface Question {
  questionId: string;
  questionNumber: number;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  points: number;
  maxPoints: number;
  timeSpent?: number;
  feedback?: string;
  holisticScores?: { AO1?: number; AO3?: number };
  aiGrading?: {
    breakdown?: Record<string, number>;
    suggestions?: string[];
    model?: string;
  };
}

interface StudentResultWithMeta extends StudentResult {
  resultId: string;
}

interface StudentResult {
  resultId: string;
  studentId: string;
  studentName: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  questions: Question[];
}

interface QuestionBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentId: string;
  assessmentType: string;
  initialStudentId?: string;
}

export function QuestionBreakdownModal({
  isOpen,
  onClose,
  assignmentId,
  assessmentType,
  initialStudentId
}: QuestionBreakdownModalProps) {
  const [loading, setLoading] = useState(false);
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchQuestionData();
    }
  }, [isOpen, assignmentId, assessmentType]);

  useEffect(() => {
    if (initialStudentId && studentResults.length > 0) {
      const index = studentResults.findIndex(r => r.studentId === initialStudentId);
      if (index !== -1) {
        setCurrentStudentIndex(index);
      }
    }
  }, [initialStudentId, studentResults]);

  const fetchQuestionData = async () => {
    try {
      setLoading(true);
      const url = `/api/assessments/question-details?assignmentId=${assignmentId}&assessmentType=${assessmentType}`;

      const response = await fetch(url, { cache: 'no-store' });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API error:', response.status, errorText);
        throw new Error('Failed to fetch question details');
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setStudentResults(data.results);
      } else {
        setStudentResults([]);
      }
    } catch (error) {
      console.error('❌ Error fetching question breakdown:', error);
      setStudentResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleManualOverride = async (
    resultId: string,
    questionId: string,
    options: {
      markAsCorrect?: boolean;
      setScore?: number;
      ao1Score?: number;
      ao3Score?: number;
    }
  ) => {
    try {
      const { markAsCorrect = false, setScore, ao1Score, ao3Score } = options;

      const response = await fetch('/api/assessments/manual-override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resultId,
          questionId,
          markAsCorrect,
          assessmentType,
          setScore,
          ao1Score,
          ao3Score
        })
      });

      if (!response.ok) {
        throw new Error('Failed to override score');
      }

      // Refresh data
      await fetchQuestionData();
    } catch (error) {
      console.error('❌ Manual override error:', error);
      alert('Failed to update answer. Please try again.');
    }
  };

  const currentStudent = studentResults[currentStudentIndex];
  const currentQuestion = currentStudent?.questions[selectedQuestionIndex];

  const goToNextStudent = () => {
    if (currentStudentIndex < studentResults.length - 1) {
      setCurrentStudentIndex(currentStudentIndex + 1);
      setSelectedQuestionIndex(0);
    }
  };

  const goToPreviousStudent = () => {
    if (currentStudentIndex > 0) {
      setCurrentStudentIndex(currentStudentIndex - 1);
      setSelectedQuestionIndex(0);
    }
  };

  const isDictation = assessmentType === 'dictation' || assessmentType === 'aqa-dictation';
  const isWriting = assessmentType === 'gcse-writing' || assessmentType === 'aqa-writing';

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Question-by-Question Breakdown
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : currentStudent ? (
          <div className="space-y-6">
            {/* Student Navigation */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousStudent}
                disabled={currentStudentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous Student
              </Button>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-slate-600" />
                <div>
                  <h3 className="font-semibold text-slate-900">{currentStudent.studentName}</h3>
                  <p className="text-sm text-slate-600">
                    Student {currentStudentIndex + 1} of {studentResults.length}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextStudent}
                disabled={currentStudentIndex === studentResults.length - 1}
              >
                Next Student
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Student Overview */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Overall Score</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  {currentStudent.percentage}%
                </p>
                <p className="text-xs text-purple-700 mt-1">
                  {currentStudent.score} / {currentStudent.maxScore} points
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Time Spent</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {Math.round(currentStudent.timeSpent / 60)}m
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {currentStudent.timeSpent} seconds
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Questions Correct</span>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {currentStudent.questions.filter(q => q.isCorrect).length}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  of {currentStudent.questions.length} questions
                </p>
              </div>
            </div>

            {/* Question Grid */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Question Navigator</h4>
              <div className="flex flex-wrap gap-2">
                {currentStudent.questions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedQuestionIndex(index)}
                    className={`
                      w-10 h-10 flex items-center justify-center rounded-lg border-2 font-semibold transition-all
                      ${selectedQuestionIndex === index
                        ? 'ring-2 ring-indigo-500 scale-105'
                        : ''
                      }
                      ${q.isCorrect
                        ? 'bg-green-50 border-green-300 text-green-900 hover:bg-green-100'
                        : q.points > 0
                          ? 'bg-yellow-50 border-yellow-300 text-yellow-900 hover:bg-yellow-100'
                          : 'bg-red-50 border-red-300 text-red-900 hover:bg-red-100'
                      }
                    `}
                  >
                    {q.questionNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Question Detail */}
            {currentQuestion && (
              <div className="border-2 rounded-lg p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-slate-900">
                    Question {currentQuestion.questionNumber}
                  </h4>
                  <Badge
                    variant={currentQuestion.isCorrect ? 'default' : 'destructive'}
                    className="text-sm"
                  >
                    {currentQuestion.isCorrect ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Correct
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-1" />
                        Incorrect
                      </>
                    )}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {/* Question Text */}
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-600 mb-2">Question:</p>
                    <p className="text-slate-900 whitespace-pre-wrap">{currentQuestion.questionText}</p>
                  </div>

                  {/* Student Answer */}
                  <div className={`p-4 rounded-lg border-2 ${currentQuestion.isCorrect
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                    }`}>
                    <p className="text-sm font-medium mb-2">Student's Answer:</p>
                    <p className="font-medium whitespace-pre-wrap">{currentQuestion.studentAnswer}</p>
                  </div>

                  {/* Correct Answer - Always show for teachers */}
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <p className="text-sm font-medium text-green-900 mb-2">
                      Correct Answer:
                    </p>
                    <p className="font-medium text-green-900 whitespace-pre-wrap">
                      {currentQuestion.correctAnswer}
                    </p>
                  </div>

                  {/* Grading Controls */}
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <h5 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-600" />
                      Teacher Grading
                    </h5>

                    {isDictation ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg">
                        {/* Dictation: AO1 Score */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 flex justify-between">
                            <span>AO1: Communication</span>
                            <span className="font-bold text-indigo-600">{currentQuestion.holisticScores?.AO1 ?? 0}/4</span>
                          </label>
                          <div className="flex gap-2">
                            {[0, 1, 2, 3, 4].map((score) => (
                              <Button
                                key={`ao1-${score}`}
                                size="sm"
                                variant={(currentQuestion.holisticScores?.AO1 ?? 0) === score ? "default" : "outline"}
                                className={`flex-1 ${(currentQuestion.holisticScores?.AO1 ?? 0) === score ? "bg-indigo-600" : ""}`}
                                onClick={() => handleManualOverride(
                                  currentStudent.resultId,
                                  currentQuestion.questionId,
                                  {
                                    ao1Score: score,
                                    ao3Score: currentQuestion.holisticScores?.AO3 ?? 0
                                  }
                                )}
                              >
                                {score}
                              </Button>
                            ))}
                          </div>
                          <p className="text-xs text-slate-500">Conveying meaning effectively</p>
                        </div>

                        {/* Dictation: AO3 Score */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 flex justify-between">
                            <span>AO3: Accuracy</span>
                            <span className="font-bold text-indigo-600">{currentQuestion.holisticScores?.AO3 ?? 0}/4</span>
                          </label>
                          <div className="flex gap-2">
                            {[0, 1, 2, 3, 4].map((score) => (
                              <Button
                                key={`ao3-${score}`}
                                size="sm"
                                variant={(currentQuestion.holisticScores?.AO3 ?? 0) === score ? "default" : "outline"}
                                className={`flex-1 ${(currentQuestion.holisticScores?.AO3 ?? 0) === score ? "bg-indigo-600" : ""}`}
                                onClick={() => handleManualOverride(
                                  currentStudent.resultId,
                                  currentQuestion.questionId,
                                  {
                                    ao1Score: currentQuestion.holisticScores?.AO1 ?? 0,
                                    ao3Score: score
                                  }
                                )}
                              >
                                {score}
                              </Button>
                            ))}
                          </div>
                          <p className="text-xs text-slate-500">Grammar and spelling accuracy</p>
                        </div>
                      </div>
                    ) : isWriting ? (
                      <div className="space-y-4">
                        {/* Score Override */}
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                          <span className="font-medium">Score:</span>
                          <input
                            type="number"
                            min="0"
                            max={currentQuestion.maxPoints}
                            value={currentQuestion.points}
                            onChange={(e) => handleManualOverride(
                              currentStudent.resultId,
                              currentQuestion.questionId,
                              { setScore: parseInt(e.target.value) || 0 }
                            )}
                            className="w-20 p-2 border rounded text-center font-bold text-lg"
                          />
                          <span className="text-slate-500">/ {currentQuestion.maxPoints}</span>
                        </div>

                        {/* Additional AI Grading Details if available */}
                        {currentQuestion.aiGrading && (
                          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                            <h6 className="font-semibold text-indigo-900 flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4" />
                              Detailed Breakdown
                            </h6>

                            {currentQuestion.aiGrading.breakdown && (
                              <div className="grid grid-cols-3 gap-2 mb-3">
                                {Object.entries(currentQuestion.aiGrading.breakdown).map(([key, score]) => (
                                  <div key={key} className="bg-white p-2 rounded border text-center">
                                    <div className="text-xs text-slate-500 uppercase font-bold">{key}</div>
                                    <div className="font-bold text-indigo-600">{score}</div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {currentQuestion.aiGrading.suggestions && currentQuestion.aiGrading.suggestions.length > 0 && (
                              <div className="text-sm bg-white p-3 rounded">
                                <div className="font-semibold text-indigo-900 mb-1">Suggestions:</div>
                                <ul className="list-disc pl-4 space-y-1 text-slate-700">
                                  {currentQuestion.aiGrading.suggestions.map((s, i) => (
                                    <li key={i}>{s}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Standard 0, 1, Max buttons for Reading/Listening
                      <div className="flex gap-2">
                        <Button
                          variant={currentQuestion.points === 0 ? "default" : "outline"}
                          size="sm"
                          className={currentQuestion.points === 0 ? "bg-red-600 hover:bg-red-700" : ""}
                          onClick={() => handleManualOverride(currentStudent.resultId, currentQuestion.questionId, { markAsCorrect: false, setScore: 0 })}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          0 Marks
                        </Button>
                        <Button
                          variant={currentQuestion.points === 1 ? "default" : "outline"}
                          size="sm"
                          className={currentQuestion.points === 1 ? "bg-yellow-600 hover:bg-yellow-700" : ""}
                          onClick={() => handleManualOverride(currentStudent.resultId, currentQuestion.questionId, { markAsCorrect: false, setScore: 1 })}
                        >
                          1 Mark
                        </Button>
                        <Button
                          variant={currentQuestion.points === currentQuestion.maxPoints ? "default" : "outline"}
                          size="sm"
                          className={currentQuestion.points === currentQuestion.maxPoints ? "bg-green-600 hover:bg-green-700" : ""}
                          onClick={() => handleManualOverride(currentStudent.resultId, currentQuestion.questionId, { markAsCorrect: true, setScore: currentQuestion.maxPoints })}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {currentQuestion.maxPoints} Marks
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Feedback (generic or AI) */}
                  {currentQuestion.feedback && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h6 className="font-semibold text-blue-900 flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4" />
                        AI Feedback
                      </h6>
                      <p className="text-sm text-slate-800 whitespace-pre-wrap">{currentQuestion.feedback}</p>
                    </div>
                  )}

                  {/* Points & Time */}
                  <div className="flex gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      <span>
                        {currentQuestion.points} / {currentQuestion.maxPoints} points
                      </span>
                    </div>
                    {currentQuestion.timeSpent && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{currentQuestion.timeSpent}s</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-600">
            No question data available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
