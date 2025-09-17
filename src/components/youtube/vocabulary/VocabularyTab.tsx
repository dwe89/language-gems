'use client';

import React, { useState } from 'react';
import { useVocabulary } from '@/hooks/useVocabulary';
import VocabularyWordButton from './VocabularyWordButton';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';

interface VocabularyItem {
  id: number;
  word: string;
  translation: string;
  example_sentence?: string;
  notes?: string;
  type: string;
}

interface VocabularyTabProps {
  vocabulary: VocabularyItem[];
  videoId: string;
  videoTitle: string;
  language: string;
}

export default function VocabularyTab({ vocabulary, videoId, videoTitle, language }: VocabularyTabProps) {
  const { loading, stats, addWord } = useVocabulary();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [addedToFlashcards, setAddedToFlashcards] = useState<{[key: number]: boolean}>({});
  
  // Filter vocabulary based on search term
  const filteredVocabulary = vocabulary.filter(
    item => item.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.translation.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group vocabulary by type
  const groupedVocabulary: Record<string, VocabularyItem[]> = {};
  filteredVocabulary.forEach(item => {
    if (!groupedVocabulary[item.type]) {
      groupedVocabulary[item.type] = [];
    }
    groupedVocabulary[item.type].push(item);
  });
  
  const types = Object.keys(groupedVocabulary).sort();
  
  // Handle adding word to flashcards
  const handleAddToFlashcards = async (item: VocabularyItem) => {
    if (!user) {
      alert('Please log in to add vocabulary to flashcards');
      return;
    }
    
    try {
      // Add vocabulary to user's flashcards collection
      const { data, error } = await supabase
        .from('user_flashcards')
        .upsert({
          user_id: user.id,
          term: item.word,
          definition: item.translation,
          example: item.example_sentence || '',
          source_video_id: videoId,
          source_type: 'video',
          source_title: videoTitle,
          language: language,
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      // Show visual confirmation
      setAddedToFlashcards(prev => ({ ...prev, [item.id]: true }));
      
      // Reset after 2 seconds
      setTimeout(() => {
        setAddedToFlashcards(prev => ({ ...prev, [item.id]: false }));
      }, 2000);
      
    } catch (error: any) {
      console.error('Error adding vocabulary to flashcards:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        fullError: error // Log the full error object
      });
      // Optionally, show a user-facing error message here
      // e.g., using a toast notification library
      alert('Failed to add word to flashcards. Please try again.'); // Simple alert for now
    }
  };
  
  if (vocabulary.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No vocabulary items available for this video.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="bg-indigo-50 p-4 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-indigo-600">{stats.totalWords}</div>
            <div className="text-xs text-gray-500">Total Words</div>
          </div>
          <div>
            <div className="text-xl font-bold text-indigo-600">{stats.wordsLearned}</div>
            <div className="text-xs text-gray-500">Words Learned</div>
          </div>
          <div>
            <div className="text-xl font-bold text-indigo-600">{stats.wordsToReview}</div>
            <div className="text-xs text-gray-500">Words to Review</div>
          </div>
        </div>
      </div>
      
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search vocabulary..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
      
      {/* Vocabulary List */}
      <div className="space-y-6">
        {types.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No matching vocabulary found.
          </div>
        ) : (
          types.map(type => (
            <div key={type} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <h3 className="text-md font-medium capitalize">{type}</h3>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedVocabulary[type].map(item => (
                    <div key={item.id} className="vocabulary-card bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-baseline">
                          <VocabularyWordButton
                            word={item.word}
                            translation={item.translation}
                            language={language}
                            context={item.example_sentence}
                            videoId={videoId}
                            videoTitle={videoTitle}
                          />
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-gray-700">{item.translation}</span>
                        </div>
                        <button 
                          className={`add-to-flashcards-btn w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold shadow transition-all ${
                            addedToFlashcards[item.id] 
                              ? 'bg-emerald-700 text-white' 
                              : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-md'
                          }`}
                          onClick={() => handleAddToFlashcards(item)}
                          title="Add to flashcards"
                        >
                          {addedToFlashcards[item.id] ? '✓' : '+'}
                        </button>
                      </div>
                      
                      {item.example_sentence && (
                        <div className="border-t border-gray-100 pt-3 mt-3">
                          <h4 className="text-sm font-semibold text-gray-600 mb-1">Example:</h4>
                          <p className="text-gray-700 text-sm italic">"{item.example_sentence}"</p>
                        </div>
                      )}
                      
                      {item.notes && (
                        <p className="text-gray-600 text-sm mt-2">{item.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 