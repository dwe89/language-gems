'use client';

import React, { useState, useEffect } from 'react';
import { useVocabulary, VocabularyItem } from '@/hooks/useVocabulary';

interface VocabularyTrackerProps {
  language?: string;
  videoId?: string;
  onlyShowDue?: boolean;
}

export default function VocabularyTracker({ language = 'spanish', videoId, onlyShowDue = false }: VocabularyTrackerProps) {
  const { vocabulary, loading, stats, addWord, reviewWord, getDueWords } = useVocabulary();
  const [filteredWords, setFilteredWords] = useState<VocabularyItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWord, setNewWord] = useState({ word: '', translation: '', context: '' });
  
  useEffect(() => {
    if (loading) return;
    
    let filtered = vocabulary;
    
    // Filter by language
    filtered = filtered.filter(word => word.language === language);
    
    // Filter by video ID if provided
    if (videoId) {
      filtered = filtered.filter(word => word.source_video_id === videoId);
    }
    
    // Filter to only show words due for review if requested
    if (onlyShowDue) {
      const now = new Date();
      filtered = filtered.filter(word => 
        word.next_review && new Date(word.next_review) <= now
      );
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(word => 
        word.word.toLowerCase().includes(query) || 
        word.translation.toLowerCase().includes(query)
      );
    }
    
    setFilteredWords(filtered);
  }, [vocabulary, loading, language, videoId, onlyShowDue, searchQuery]);
  
  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.word || !newWord.translation) return;
    
    await addWord(
      newWord.word.trim(), 
      newWord.translation.trim(), 
      language, 
      newWord.context.trim()
    );
    
    setNewWord({ word: '', translation: '', context: '' });
    setShowAddForm(false);
  };
  
  const handleReview = async (id: string, quality: number) => {
    await reviewWord(id, quality);
  };
  
  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header and Stats */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Vocabulary Tracker</h2>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm"
          >
            {showAddForm ? 'Cancel' : 'Add Word'}
          </button>
        </div>
        
        <div className="mt-3 grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-2xl font-bold text-indigo-600">{stats.totalWords}</div>
            <div className="text-xs text-gray-500">Total Words</div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-2xl font-bold text-green-600">{stats.wordsLearned}</div>
            <div className="text-xs text-gray-500">Words Learned</div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-2xl font-bold text-yellow-600">{stats.wordsToReview}</div>
            <div className="text-xs text-gray-500">Due for Review</div>
          </div>
        </div>
      </div>
      
      {/* Add Word Form */}
      {showAddForm && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <form onSubmit={handleAddWord}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="word" className="block text-sm font-medium text-gray-700">Word</label>
                <input
                  type="text"
                  id="word"
                  value={newWord.word}
                  onChange={(e) => setNewWord({...newWord, word: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  placeholder="Enter word"
                  required
                />
              </div>
              <div>
                <label htmlFor="translation" className="block text-sm font-medium text-gray-700">Translation</label>
                <input
                  type="text"
                  id="translation"
                  value={newWord.translation}
                  onChange={(e) => setNewWord({...newWord, translation: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  placeholder="Enter translation"
                  required
                />
              </div>
            </div>
            <div className="mt-3">
              <label htmlFor="context" className="block text-sm font-medium text-gray-700">Context (Optional)</label>
              <input
                type="text"
                id="context"
                value={newWord.context}
                onChange={(e) => setNewWord({...newWord, context: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                placeholder="Example sentence or context"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                Add to Vocabulary
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search vocabulary..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>
      
      {/* Vocabulary List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredWords.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? 'No matching words found.' : 'No vocabulary words added yet.'}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredWords.map((item) => (
              <li key={item.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-base font-medium text-gray-900">{item.word}</h3>
                      <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                        {Math.min(100, item.mastery_level || 0)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{item.translation}</p>
                    {item.context && (
                      <p className="mt-1 text-xs text-gray-500 italic">"{item.context}"</p>
                    )}
                    {item.source_video_title && (
                      <p className="mt-1 text-xs text-gray-400">From: {item.source_video_title}</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleReview(item.id, 1)}
                        className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded hover:bg-red-200"
                      >
                        Hard
                      </button>
                      <button
                        onClick={() => handleReview(item.id, 3)}
                        className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded hover:bg-yellow-200"
                      >
                        Good
                      </button>
                      <button
                        onClick={() => handleReview(item.id, 5)}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded hover:bg-green-200"
                      >
                        Easy
                      </button>
                    </div>
                    {item.next_review && (
                      <p className="mt-1 text-xs text-gray-400 text-right">
                        Next: {new Date(item.next_review).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 