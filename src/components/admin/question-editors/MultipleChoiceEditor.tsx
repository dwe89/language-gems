'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { AQAReadingQuestion, MultipleChoiceData } from '@/types/aqa-reading-admin';

interface MultipleChoiceEditorProps {
  question: AQAReadingQuestion;
  onUpdate: (updates: Partial<AQAReadingQuestion>) => void;
}

export default function MultipleChoiceEditor({ question, onUpdate }: MultipleChoiceEditorProps) {
  const data = question.question_data as MultipleChoiceData;

  const updateData = (updates: Partial<MultipleChoiceData>) => {
    onUpdate({
      question_data: { ...data, ...updates },
    });
  };

  const addQuestion = () => {
    const newQuestions = [
      ...(data.questions || []),
      { question: '', options: ['', '', '', ''], correctAnswer: '' },
    ];
    updateData({ questions: newQuestions });
  };

  const updateQuestion = (index: number, field: 'question' | 'correctAnswer', value: string) => {
    const newQuestions = [...(data.questions || [])];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    updateData({ questions: newQuestions });
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const newQuestions = [...(data.questions || [])];
    const newOptions = [...newQuestions[qIndex].options];
    newOptions[optIndex] = value;
    newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions };
    updateData({ questions: newQuestions });
  };

  const deleteQuestion = (index: number) => {
    const newQuestions = (data.questions || []).filter((_, i) => i !== index);
    updateData({ questions: newQuestions });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-gray-900">Multiple Choice Questions</label>
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
              <input
                type="text"
                value={q.question}
                onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Question text"
              />

              <div className="space-y-2">
                {q.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <span className="w-8 text-center font-semibold text-gray-600">
                      {String.fromCharCode(65 + optIndex)}.
                    </span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Correct Answer
                </label>
                <select
                  value={q.correctAnswer}
                  onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select correct answer</option>
                  {q.options.map((_, optIndex) => (
                    <option key={optIndex} value={String.fromCharCode(65 + optIndex)}>
                      {String.fromCharCode(65 + optIndex)} - {q.options[optIndex]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

