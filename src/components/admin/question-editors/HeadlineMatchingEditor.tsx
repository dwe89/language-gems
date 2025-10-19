'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { AQAReadingQuestion, HeadlineMatchingData } from '@/types/aqa-reading-admin';

interface HeadlineMatchingEditorProps {
  question: AQAReadingQuestion;
  onUpdate: (updates: Partial<AQAReadingQuestion>) => void;
}

export default function HeadlineMatchingEditor({ question, onUpdate }: HeadlineMatchingEditorProps) {
  const data = question.question_data as HeadlineMatchingData;

  const updateData = (updates: Partial<HeadlineMatchingData>) => {
    onUpdate({ question_data: { ...data, ...updates } });
  };

  const addHeadline = () => {
    const newHeadlines = [
      ...(data.headlines || []),
      { letter: String.fromCharCode(65 + (data.headlines?.length || 0)), headline: '' },
    ];
    updateData({ headlines: newHeadlines });
  };

  const updateHeadline = (index: number, field: 'letter' | 'headline', value: string) => {
    const newHeadlines = [...(data.headlines || [])];
    newHeadlines[index] = { ...newHeadlines[index], [field]: value };
    updateData({ headlines: newHeadlines });
  };

  const deleteHeadline = (index: number) => {
    updateData({ headlines: (data.headlines || []).filter((_, i) => i !== index) });
  };

  const addArticle = () => {
    const newArticles = [
      ...(data.articles || []),
      { number: (data.articles?.length || 0) + 1, article: '', correctAnswer: '' },
    ];
    updateData({ articles: newArticles });
  };

  const updateArticle = (index: number, field: 'article' | 'correctAnswer', value: string) => {
    const newArticles = [...(data.articles || [])];
    newArticles[index] = { ...newArticles[index], [field]: value };
    updateData({ articles: newArticles });
  };

  const deleteArticle = (index: number) => {
    const newArticles = (data.articles || []).filter((_, i) => i !== index);
    newArticles.forEach((a, i) => { a.number = i + 1; });
    updateData({ articles: newArticles });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-900">Headlines</label>
          <button
            onClick={addHeadline}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
          >
            <Plus className="w-3 h-3" />
            Add Headline
          </button>
        </div>
        <div className="space-y-2">
          {(data.headlines || []).map((headline, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={headline.letter}
                onChange={(e) => updateHeadline(index, 'letter', e.target.value)}
                className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center font-bold"
                placeholder="A"
                maxLength={1}
              />
              <input
                type="text"
                value={headline.headline}
                onChange={(e) => updateHeadline(index, 'headline', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Headline text"
              />
              <button onClick={() => deleteHeadline(index)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-900">Articles</label>
          <button
            onClick={addArticle}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
          >
            <Plus className="w-3 h-3" />
            Add Article
          </button>
        </div>
        <div className="space-y-2">
          {(data.articles || []).map((article, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <span className="font-semibold text-gray-700">{article.number}.</span>
                <button onClick={() => deleteArticle(index)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={article.article}
                onChange={(e) => updateArticle(index, 'article', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                rows={2}
                placeholder="Article text"
              />
              <select
                value={article.correctAnswer}
                onChange={(e) => updateArticle(index, 'correctAnswer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select matching headline</option>
                {(data.headlines || []).map((h) => (
                  <option key={h.letter} value={h.letter}>
                    {h.letter} - {h.headline}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

