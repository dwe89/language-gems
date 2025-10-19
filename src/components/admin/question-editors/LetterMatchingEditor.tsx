'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { AQAReadingQuestion, LetterMatchingData } from '@/types/aqa-reading-admin';

interface LetterMatchingEditorProps {
  question: AQAReadingQuestion;
  onUpdate: (updates: Partial<AQAReadingQuestion>) => void;
}

export default function LetterMatchingEditor({ question, onUpdate }: LetterMatchingEditorProps) {
  const data = question.question_data as LetterMatchingData;

  const updateData = (updates: Partial<LetterMatchingData>) => {
    onUpdate({
      question_data: { ...data, ...updates },
    });
  };

  const addOption = () => {
    const newOptions = [
      ...(data.options || []),
      { letter: String.fromCharCode(65 + (data.options?.length || 0)), subject: '' },
    ];
    updateData({ options: newOptions });
  };

  const updateOption = (index: number, field: 'letter' | 'subject', value: string) => {
    const newOptions = [...(data.options || [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    updateData({ options: newOptions });
  };

  const deleteOption = (index: number) => {
    const newOptions = (data.options || []).filter((_, i) => i !== index);
    updateData({ options: newOptions });
  };

  const addStatement = () => {
    const newStatements = [
      ...(data.statements || []),
      { number: (data.statements?.length || 0) + 1, statement: '', correctAnswer: '' },
    ];
    updateData({ statements: newStatements });
  };

  const updateStatement = (
    index: number,
    field: 'number' | 'statement' | 'correctAnswer',
    value: string | number
  ) => {
    const newStatements = [...(data.statements || [])];
    newStatements[index] = { ...newStatements[index], [field]: value };
    updateData({ statements: newStatements });
  };

  const deleteStatement = (index: number) => {
    const newStatements = (data.statements || []).filter((_, i) => i !== index);
    // Renumber statements
    newStatements.forEach((s, i) => {
      s.number = i + 1;
    });
    updateData({ statements: newStatements });
  };

  return (
    <div className="space-y-6">
      {/* Options Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-900">
            Options (Letters & Subjects)
          </label>
          <button
            onClick={addOption}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
          >
            <Plus className="w-3 h-3" />
            Add Option
          </button>
        </div>

        <div className="space-y-2">
          {(data.options || []).map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={option.letter}
                onChange={(e) => updateOption(index, 'letter', e.target.value)}
                className="w-16 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-bold"
                placeholder="A"
                maxLength={1}
              />
              <input
                type="text"
                value={option.subject}
                onChange={(e) => updateOption(index, 'subject', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Subject (e.g., Football, Music)"
              />
              <button
                onClick={() => deleteOption(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Statements Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-900">Statements to Match</label>
          <button
            onClick={addStatement}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
          >
            <Plus className="w-3 h-3" />
            Add Statement
          </button>
        </div>

        <div className="space-y-2">
          {(data.statements || []).map((statement, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-8 text-center font-semibold text-gray-700">
                {statement.number}.
              </span>
              <input
                type="text"
                value={statement.statement}
                onChange={(e) => updateStatement(index, 'statement', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Statement text"
              />
              <select
                value={statement.correctAnswer}
                onChange={(e) => updateStatement(index, 'correctAnswer', e.target.value)}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Answer</option>
                {(data.options || []).map((opt) => (
                  <option key={opt.letter} value={opt.letter}>
                    {opt.letter}
                  </option>
                ))}
              </select>
              <button
                onClick={() => deleteStatement(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

