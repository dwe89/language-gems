'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { AQAReadingQuestion, StudentGridData } from '@/types/aqa-reading-admin';

interface StudentGridEditorProps {
  question: AQAReadingQuestion;
  onUpdate: (updates: Partial<AQAReadingQuestion>) => void;
}

export default function StudentGridEditor({ question, onUpdate }: StudentGridEditorProps) {
  const data = question.question_data as StudentGridData;

  const updateData = (updates: Partial<StudentGridData>) => {
    onUpdate({ question_data: { ...data, ...updates } });
  };

  const addStudent = () => {
    const newStudents = [
      ...(data.students || []),
      { name: '', letter: String.fromCharCode(65 + (data.students?.length || 0)) },
    ];
    updateData({ students: newStudents });
  };

  const updateStudent = (index: number, field: 'name' | 'letter', value: string) => {
    const newStudents = [...(data.students || [])];
    newStudents[index] = { ...newStudents[index], [field]: value };
    updateData({ students: newStudents });
  };

  const deleteStudent = (index: number) => {
    updateData({ students: (data.students || []).filter((_, i) => i !== index) });
  };

  const addQuestion = () => {
    const newQuestions = [...(data.questions || []), { question: '', correctAnswer: '' }];
    updateData({ questions: newQuestions });
  };

  const updateQuestion = (index: number, field: 'question' | 'correctAnswer', value: string) => {
    const newQuestions = [...(data.questions || [])];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    updateData({ questions: newQuestions });
  };

  const deleteQuestion = (index: number) => {
    updateData({ questions: (data.questions || []).filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-900">Students</label>
          <button
            onClick={addStudent}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
          >
            <Plus className="w-3 h-3" />
            Add Student
          </button>
        </div>
        <div className="space-y-2">
          {(data.students || []).map((student, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={student.letter}
                onChange={(e) => updateStudent(index, 'letter', e.target.value)}
                className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center font-bold"
                placeholder="A"
                maxLength={1}
              />
              <input
                type="text"
                value={student.name}
                onChange={(e) => updateStudent(index, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Student name"
              />
              <button onClick={() => deleteStudent(index)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-900">Questions</label>
          <button
            onClick={addQuestion}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
          >
            <Plus className="w-3 h-3" />
            Add Question
          </button>
        </div>
        <div className="space-y-2">
          {(data.questions || []).map((q, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-8 text-center font-semibold">{index + 1}.</span>
              <input
                type="text"
                value={q.question}
                onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Question"
              />
              <select
                value={q.correctAnswer}
                onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Answer</option>
                {(data.students || []).map((s) => (
                  <option key={s.letter} value={s.letter}>
                    {s.letter}
                  </option>
                ))}
              </select>
              <button onClick={() => deleteQuestion(index)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

