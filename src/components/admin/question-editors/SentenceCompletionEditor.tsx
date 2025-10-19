'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { AQAReadingQuestion, SentenceCompletionData } from '@/types/aqa-reading-admin';

interface SentenceCompletionEditorProps {
  question: AQAReadingQuestion;
  onUpdate: (updates: Partial<AQAReadingQuestion>) => void;
}

export default function SentenceCompletionEditor({ question, onUpdate }: SentenceCompletionEditorProps) {
  const data = question.question_data as SentenceCompletionData;

  const updateData = (updates: Partial<SentenceCompletionData>) => {
    onUpdate({ question_data: { ...data, ...updates } });
  };

  const addSentence = () => {
    const newSentences = [
      ...(data.sentences || []),
      { number: (data.sentences?.length || 0) + 1, sentenceStart: '', options: ['', '', '', ''], correctAnswer: '' },
    ];
    updateData({ sentences: newSentences });
  };

  const updateSentence = (index: number, field: 'sentenceStart' | 'correctAnswer', value: string) => {
    const newSentences = [...(data.sentences || [])];
    newSentences[index] = { ...newSentences[index], [field]: value };
    updateData({ sentences: newSentences });
  };

  const updateOption = (sIndex: number, optIndex: number, value: string) => {
    const newSentences = [...(data.sentences || [])];
    const newOptions = [...newSentences[sIndex].options];
    newOptions[optIndex] = value;
    newSentences[sIndex] = { ...newSentences[sIndex], options: newOptions };
    updateData({ sentences: newSentences });
  };

  const deleteSentence = (index: number) => {
    const newSentences = (data.sentences || []).filter((_, i) => i !== index);
    newSentences.forEach((s, i) => { s.number = i + 1; });
    updateData({ sentences: newSentences });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-gray-900">Sentence Completion</label>
        <button
          onClick={addSentence}
          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
        >
          <Plus className="w-3 h-3" />
          Add Sentence
        </button>
      </div>

      <div className="space-y-4">
        {(data.sentences || []).map((sentence, sIndex) => (
          <div key={sIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start justify-between mb-3">
              <span className="font-semibold text-gray-700">{sentence.number}.</span>
              <button onClick={() => deleteSentence(sIndex)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Sentence Start</label>
                <input
                  type="text"
                  value={sentence.sentenceStart}
                  onChange={(e) => updateSentence(sIndex, 'sentenceStart', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="The beginning of the sentence..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Completion Options</label>
                <div className="space-y-2">
                  {sentence.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <span className="w-8 text-center font-semibold">{String.fromCharCode(65 + optIndex)}.</span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(sIndex, optIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Correct Answer</label>
                <select
                  value={sentence.correctAnswer}
                  onChange={(e) => updateSentence(sIndex, 'correctAnswer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select correct answer</option>
                  {sentence.options.map((_, optIndex) => (
                    <option key={optIndex} value={String.fromCharCode(65 + optIndex)}>
                      {String.fromCharCode(65 + optIndex)} - {sentence.options[optIndex]}
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

