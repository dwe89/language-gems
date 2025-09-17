'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSupabase } from '@/hooks/useSupabase';
import { Plus, BookOpen, Trash2 } from 'lucide-react';

interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  language: string;
  example?: string;
  notes?: string;
  created_at: string;
}

export default function VocabularyBuilder() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWord, setNewWord] = useState({
    word: '',
    translation: '',
    language: 'spanish',
    example: '',
    notes: ''
  });

  // Load user's vocabulary
  React.useEffect(() => {
    if (user) {
      loadVocabulary();
    }
  }, [user]);

  const loadVocabulary = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVocabulary(data || []);
    } catch (error) {
      console.error('Error loading vocabulary:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWord = async () => {
    if (!user || !newWord.word.trim() || !newWord.translation.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_flashcards')
        .insert({
          user_id: user.id,
          term: newWord.word.trim(),
          definition: newWord.translation.trim(),
          language: newWord.language,
          example: newWord.example.trim() || null,
          source_type: 'manual',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setVocabulary(prev => [data, ...prev]);
      setNewWord({
        word: '',
        translation: '',
        language: 'spanish',
        example: '',
        notes: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding word:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteWord = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_flashcards')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setVocabulary(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting word:', error);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please log in to use the vocabulary builder.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <BookOpen className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">My Vocabulary</h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Word
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Add New Word</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Word
              </label>
              <input
                type="text"
                value={newWord.word}
                onChange={(e) => setNewWord(prev => ({ ...prev, word: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter word..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Translation
              </label>
              <input
                type="text"
                value={newWord.translation}
                onChange={(e) => setNewWord(prev => ({ ...prev, translation: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter translation..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={newWord.language}
                onChange={(e) => setNewWord(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
                <option value="italian">Italian</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Example (optional)
              </label>
              <input
                type="text"
                value={newWord.example}
                onChange={(e) => setNewWord(prev => ({ ...prev, example: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Example sentence..."
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addWord}
              disabled={loading || !newWord.word.trim() || !newWord.translation.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Adding...' : 'Add Word'}
            </button>
          </div>
        </div>
      )}

      {loading && vocabulary.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading vocabulary...</p>
        </div>
      ) : vocabulary.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No vocabulary words yet. Add your first word!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vocabulary.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{item.term}</h4>
                  <p className="text-gray-600">{item.definition}</p>
                  {item.example && (
                    <p className="text-sm text-gray-500 italic mt-1">"{item.example}"</p>
                  )}
                </div>
                <button
                  onClick={() => deleteWord(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span className="capitalize">{item.language}</span>
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
