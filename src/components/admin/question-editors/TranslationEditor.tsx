'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { AQAReadingQuestion, TranslationData } from '@/types/aqa-reading-admin';

interface TranslationEditorProps {
  question: AQAReadingQuestion;
  onUpdate: (updates: Partial<AQAReadingQuestion>) => void;
}

export default function TranslationEditor({ question, onUpdate }: TranslationEditorProps) {
  const data = question.question_data as TranslationData;

  const updateData = (updates: Partial<TranslationData>) => {
    onUpdate({ question_data: { ...data, ...updates } });
  };

  const addSentence = () => {
    const newSentences = [
      ...(data.sentences || []),
      { number: (data.sentences?.length || 0) + 1, sourceText: '', correctTranslation: '', alternativeTranslations: [] },
    ];
    updateData({ sentences: newSentences });
  };

  const updateSentence = (index: number, field: 'sourceText' | 'correctTranslation', value: string) => {
    const newSentences = [...(data.sentences || [])];
    newSentences[index] = { ...newSentences[index], [field]: value };
    updateData({ sentences: newSentences });
  };

  const addAlternative = (sIndex: number) => {
    const newSentences = [...(data.sentences || [])];
    if (!newSentences[sIndex].alternativeTranslations) {
      newSentences[sIndex].alternativeTranslations = [];
    }
    newSentences[sIndex].alternativeTranslations!.push('');
    updateData({ sentences: newSentences });
  };

  const updateAlternative = (sIndex: number, altIndex: number, value: string) => {
    const newSentences = [...(data.sentences || [])];
    newSentences[sIndex].alternativeTranslations![altIndex] = value;
    updateData({ sentences: newSentences });
  };

  const deleteAlternative = (sIndex: number, altIndex: number) => {
    const newSentences = [...(data.sentences || [])];
    newSentences[sIndex].alternativeTranslations = newSentences[sIndex].alternativeTranslations!.filter((_, i) => i !== altIndex);
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
        <label className="text-sm font-semibold text-gray-900">Translation Sentences</label>
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
                <label className="block text-xs font-medium text-gray-700 mb-1">Source Text (Foreign Language)</label>
                <input
                  type="text"
                  value={sentence.sourceText}
                  onChange={(e) => updateSentence(sIndex, 'sourceText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-serif"
                  placeholder="Text in foreign language"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Correct Translation (English)</label>
                <input
                  type="text"
                  value={sentence.correctTranslation}
                  onChange={(e) => updateSentence(sIndex, 'correctTranslation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="English translation"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-700">Alternative Translations (Optional)</label>
                  <button
                    onClick={() => addAlternative(sIndex)}
                    className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                  >
                    <Plus className="w-3 h-3" />
                    Add Alternative
                  </button>
                </div>
                <div className="space-y-2">
                  {(sentence.alternativeTranslations || []).map((alt, altIndex) => (
                    <div key={altIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={alt}
                        onChange={(e) => updateAlternative(sIndex, altIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Alternative translation"
                      />
                      <button
                        onClick={() => deleteAlternative(sIndex, altIndex)}
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

