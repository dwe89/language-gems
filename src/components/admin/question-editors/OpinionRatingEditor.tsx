'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { AQAReadingQuestion, OpinionRatingData } from '@/types/aqa-reading-admin';

interface OpinionRatingEditorProps {
  question: AQAReadingQuestion;
  onUpdate: (updates: Partial<AQAReadingQuestion>) => void;
}

export default function OpinionRatingEditor({ question, onUpdate }: OpinionRatingEditorProps) {
  const data = question.question_data as OpinionRatingData;

  const updateData = (updates: Partial<OpinionRatingData>) => {
    onUpdate({ question_data: { ...data, ...updates } });
  };

  const updateScale = (field: 'positive' | 'negative' | 'positiveNegative', value: string) => {
    updateData({
      scale: { ...(data.scale || { positive: '', negative: '', positiveNegative: '' }), [field]: value },
    });
  };

  const addStatement = () => {
    const newStatements = [
      ...(data.statements || []),
      { number: (data.statements?.length || 0) + 1, statement: '', correctAnswer: 'positive' as const },
    ];
    updateData({ statements: newStatements });
  };

  const updateStatement = (index: number, field: 'statement' | 'correctAnswer', value: string) => {
    const newStatements = [...(data.statements || [])];
    newStatements[index] = { ...newStatements[index], [field]: value as any };
    updateData({ statements: newStatements });
  };

  const deleteStatement = (index: number) => {
    const newStatements = (data.statements || []).filter((_, i) => i !== index);
    newStatements.forEach((s, i) => { s.number = i + 1; });
    updateData({ statements: newStatements });
  };

  return (
    <div className="space-y-6">
      {/* Scale Definition */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Opinion Scale</h4>
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Positive Label</label>
            <input
              type="text"
              value={data.scale?.positive || ''}
              onChange={(e) => updateScale('positive', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
              placeholder="e.g., P (Positive)"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Negative Label</label>
            <input
              type="text"
              value={data.scale?.negative || ''}
              onChange={(e) => updateScale('negative', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
              placeholder="e.g., N (Negative)"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Positive + Negative Label</label>
            <input
              type="text"
              value={data.scale?.positiveNegative || ''}
              onChange={(e) => updateScale('positiveNegative', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
              placeholder="e.g., P+N (Both Positive and Negative)"
            />
          </div>
        </div>
      </div>

      {/* Statements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-900">Statements to Rate</label>
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
            <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <span className="font-semibold text-gray-700">{statement.number}.</span>
                <button onClick={() => deleteStatement(index)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={statement.statement}
                  onChange={(e) => updateStatement(index, 'statement', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Statement text"
                />

                <select
                  value={statement.correctAnswer}
                  onChange={(e) => updateStatement(index, 'correctAnswer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                  <option value="positive-negative">Positive + Negative</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

