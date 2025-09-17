'use client';

import React, { useState, useEffect } from 'react';
import { useVocabulary, VocabularyItem } from '@/hooks/useVocabulary';
import { useAuth } from '@/components/auth/AuthProvider';

interface VocabularyBuilderProps {
  language?: string;
}

export default function VocabularyBuilder({ language = 'spanish' }: VocabularyBuilderProps) {
  const { user } = useAuth();
  const { vocabulary, loading, stats, addWord } = useVocabulary();
  const [newWord, setNewWord] = useState({
    word: '',
    translation: '',
    context: ''
  });
  const [filteredVocabulary, setFilteredVocabulary] = useState<VocabularyItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'view'

  useEffect(() => {
    if (!loading) {
      setFilteredVocabulary(
        vocabulary
          .filter(item => 
            item.language === language &&
            (searchTerm === '' || 
              item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.translation.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
          .sort((a, b) => new Date(b.last_reviewed || 0).getTime() - new Date(a.last_reviewed || 0).getTime())
      );
    }
  }, [vocabulary, loading, language, searchTerm]);

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!newWord.word.trim() || !newWord.translation.trim()) {
      return;
    }
    
    await addWord(
      newWord.word.trim(),
      newWord.translation.trim(),
      language,
      newWord.context.trim() || undefined
    );
    
    // Clear form
    setNewWord({
      word: '',
      translation: '',
      context: ''
    });
  };

  const getDifficultyClass = (level: number) => {
    if (level >= 80) return 'bg-green-100 text-green-800';
    if (level >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse h-64 w-full bg-gray-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 p-4 text-white">
        <h2 className="text-xl font-semibold">Vocabulary Builder</h2>
        <div className="text-indigo-100 text-sm mt-1">
          Build your personalized vocabulary list and master new words
        </div>
      </div>
      
      {/* Stats */}
      <div className="bg-indigo-50 p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-indigo-600">{stats.totalWords}</div>
            <div className="text-xs text-gray-500">Total Words</div>
          </div>
          <div>
            <div className="text-xl font-bold text-indigo-600">{stats.wordsLearned}</div>
            <div className="text-xs text-gray-500">Words Mastered</div>
          </div>
          <div>
            <div className="text-xl font-bold text-indigo-600">{stats.wordsToReview}</div>
            <div className="text-xs text-gray-500">Due for Review</div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 text-center w-1/2 font-medium text-sm ${
              activeTab === 'add'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Add Words
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`px-4 py-2 text-center w-1/2 font-medium text-sm ${
              activeTab === 'view'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Vocabulary
          </button>
        </nav>
      </div>
      
      {/* Add Words Tab */}
      {activeTab === 'add' && (
        <div className="p-4">
          <form onSubmit={handleAddWord} className="space-y-4">
            <div>
              <label htmlFor="word" className="block text-sm font-medium text-gray-700">Word/Phrase</label>
              <input
                type="text"
                id="word"
                value={newWord.word}
                onChange={(e) => setNewWord({...newWord, word: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter a word or phrase"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter the translation"
                required
              />
            </div>
            
            <div>
              <label htmlFor="context" className="block text-sm font-medium text-gray-700">Context (Optional)</label>
              <input
                type="text"
                id="context"
                value={newWord.context}
                onChange={(e) => setNewWord({...newWord, context: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Example sentence or context"
              />
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add to My Vocabulary
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* View Words Tab */}
      {activeTab === 'view' && (
        <div className="p-4">
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search your vocabulary..."
            />
          </div>
          
          {/* Vocabulary List */}
          {filteredVocabulary.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No matching vocabulary found.' : 'You haven\'t added any vocabulary words yet.'}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredVocabulary.map(item => (
                <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.word}</h3>
                      <p className="text-gray-600">{item.translation}</p>
                      {item.context && (
                        <p className="text-gray-500 text-sm mt-1 italic">"{item.context}"</p>
                      )}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${getDifficultyClass(item.mastery_level)}`}>
                      {item.mastery_level}%
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Added: {new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
                    {item.last_reviewed && (
                      <span>Last reviewed: {new Date(item.last_reviewed).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 