'use client';

import React from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import type { AQAReadingQuestion, OpenResponseData } from '@/types/aqa-reading-admin';

interface OpenResponseEditorProps {
  question: AQAReadingQuestion;
  onUpdate: (updates: Partial<AQAReadingQuestion>) => void;
}

export default function OpenResponseEditor({ question, onUpdate }: OpenResponseEditorProps) {
  const data = question.question_data as OpenResponseData;

  const updateData = (updates: Partial<OpenResponseData>) => {
    onUpdate({
      question_data: { ...data, ...updates },
    });
  };

  const addQuestion = () => {
    const newQuestions = [
      ...(data.questions || []),
      { question: '', acceptableAnswers: [''], keywords: [] },
    ];
    updateData({ questions: newQuestions });
  };

  const updateQuestion = (index: number, field: 'question', value: string) => {
    const newQuestions = [...(data.questions || [])];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    updateData({ questions: newQuestions });
  };

  const addAcceptableAnswer = (qIndex: number) => {
    const newQuestions = [...(data.questions || [])];
    newQuestions[qIndex].acceptableAnswers.push('');
    updateData({ questions: newQuestions });
  };

  const updateAcceptableAnswer = (qIndex: number, ansIndex: number, value: string) => {
    const newQuestions = [...(data.questions || [])];
    newQuestions[qIndex].acceptableAnswers[ansIndex] = value;
    updateData({ questions: newQuestions });
  };

  const deleteAcceptableAnswer = (qIndex: number, ansIndex: number) => {
    const newQuestions = [...(data.questions || [])];
    newQuestions[qIndex].acceptableAnswers = newQuestions[qIndex].acceptableAnswers.filter(
      (_, i) => i !== ansIndex
    );
    updateData({ questions: newQuestions });
  };

  const addKeyword = (qIndex: number) => {
    const newQuestions = [...(data.questions || [])];
    if (!newQuestions[qIndex].keywords) {
      newQuestions[qIndex].keywords = [];
    }
    newQuestions[qIndex].keywords!.push('');
    updateData({ questions: newQuestions });
  };

  const updateKeyword = (qIndex: number, kwIndex: number, value: string) => {
    const newQuestions = [...(data.questions || [])];
    newQuestions[qIndex].keywords![kwIndex] = value;
    updateData({ questions: newQuestions });
  };

  const deleteKeyword = (qIndex: number, kwIndex: number) => {
    const newQuestions = [...(data.questions || [])];
    newQuestions[qIndex].keywords = newQuestions[qIndex].keywords!.filter((_, i) => i !== kwIndex);
    updateData({ questions: newQuestions });
  };

  const deleteQuestion = (index: number) => {
    const newQuestions = (data.questions || []).filter((_, i) => i !== index);
    updateData({ questions: newQuestions });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-gray-900">Open Response Questions</label>
        <button
          onClick={addQuestion}
          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
        >
          <Plus className="w-3 h-3" />
          Add Question
        </button>
      </div>

      <div className="space-y-4">
        {(data.questions || []).map((q, qIndex) => (
          <div key={qIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start justify-between mb-3">
              <span className="font-semibold text-gray-700">Question {qIndex + 1}</span>
              <button
                onClick={() => deleteQuestion(qIndex)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Question</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Question text"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-700">Acceptable Answers</label>
                  <button
                    onClick={() => addAcceptableAnswer(qIndex)}
                    className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                  >
                    <Plus className="w-3 h-3" />
                    Add Answer
                  </button>
                </div>
                <div className="space-y-2">
                  {q.acceptableAnswers.map((answer, ansIndex) => (
                    <div key={ansIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => updateAcceptableAnswer(qIndex, ansIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Acceptable answer"
                      />
                      <button
                        onClick={() => deleteAcceptableAnswer(qIndex, ansIndex)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Keywords (Optional)
                  </label>
                  <button
                    onClick={() => addKeyword(qIndex)}
                    className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                  >
                    <Plus className="w-3 h-3" />
                    Add Keyword
                  </button>
                </div>
                <div className="space-y-2">
                  {(q.keywords || []).map((keyword, kwIndex) => (
                    <div key={kwIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => updateKeyword(qIndex, kwIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Keyword"
                      />
                      <button
                        onClick={() => deleteKeyword(qIndex, kwIndex)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
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

