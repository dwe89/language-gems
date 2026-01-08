'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/auth/AuthProvider';
import { useSupabase } from '../../components/supabase/SupabaseProvider';
import { BookOpen, List, Search, Filter, X, ArrowRight, Check } from 'lucide-react';

interface VocabWord {
  id: string;
  term: string;
  translation: string;
}

interface VocabList {
  id: string;
  name: string;
  description: string | null;
  themeId: string;
  difficulty: number;
  itemCount: number;
  words: VocabWord[];
}

interface GameVocabularyProps {
  onSelect: (selectedWords: VocabWord[]) => void;
  maxWords?: number;
  gameType?: string;
  onCancel?: () => void;
}

export default function GameVocabularySelector({ 
  onSelect, 
  maxWords = 20, 
  gameType,
  onCancel
}: GameVocabularyProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [vocabularyLists, setVocabularyLists] = useState<VocabList[]>([]);
  const [filteredLists, setFilteredLists] = useState<VocabList[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [themes, setThemes] = useState<string[]>([]);
  const [selectedList, setSelectedList] = useState<VocabList | null>(null);
  const [selectedWords, setSelectedWords] = useState<VocabWord[]>([]);
  const [step, setStep] = useState<'select-list' | 'select-words' | 'review'>('select-list');

  // Fetch vocabulary lists
  useEffect(() => {
    if (!user) return;

    const fetchVocabularyLists = async () => {
      setLoading(true);
      
      try {
        // Get all vocabulary lists
        const { data: lists, error: listsError } = await supabase
          .from('vocabulary_lists')
          .select(`
            id, 
            name, 
            description, 
            theme_id,
            difficulty,
            vocabulary_items(count)
          `);
        
        if (listsError) {
          console.error('Error fetching vocabulary lists:', listsError);
          return;
        }
        
        // Process lists data
        const processedLists = lists.map(list => ({
          id: list.id,
          name: list.name,
          description: list.description,
          themeId: list.theme_id,
          difficulty: list.difficulty,
          itemCount: list.vocabulary_items?.[0]?.count || 0,
          words: [] // Will be loaded when list is selected
        }));
        
        setVocabularyLists(processedLists);
        setFilteredLists(processedLists);
        
        // Extract unique themes
        const uniqueThemes = [...new Set(processedLists.map(list => list.themeId))];
        setThemes(uniqueThemes);
      } catch (error) {
        console.error('Error in vocabulary lists processing:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVocabularyLists();
  }, [user, supabase]);
  
  // Apply search and theme filters
  useEffect(() => {
    if (!vocabularyLists.length) return;
    
    let filtered = [...vocabularyLists];
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(list => 
        list.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (list.description && list.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply theme filter
    if (selectedTheme !== 'all') {
      filtered = filtered.filter(list => list.themeId === selectedTheme);
    }
    
    setFilteredLists(filtered);
  }, [vocabularyLists, searchTerm, selectedTheme]);
  
  // Load words for a selected list
  const loadListWords = async (list: VocabList) => {
    setLoading(true);
    
    try {
      const { data: words, error } = await supabase
        .from('vocabulary_items')
        .select('id, term, translation')
        .eq('list_id', list.id);
      
      if (error) {
        console.error('Error fetching vocabulary items:', error);
        return;
      }
      
      const listWithWords = {
        ...list,
        words: words
      };
      
      setSelectedList(listWithWords);
      setStep('select-words');
    } catch (error) {
      console.error('Error loading vocabulary items:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle word selection
  const toggleWordSelection = (word: VocabWord) => {
    if (selectedWords.some(w => w.id === word.id)) {
      setSelectedWords(prev => prev.filter(w => w.id !== word.id));
    } else {
      if (selectedWords.length < maxWords) {
        setSelectedWords(prev => [...prev, word]);
      }
    }
  };
  
  // Select all words
  const selectAllWords = () => {
    if (!selectedList) return;
    
    const wordsToSelect = selectedList.words.slice(0, maxWords);
    setSelectedWords(wordsToSelect);
  };
  
  // Clear all selected words
  const clearSelectedWords = () => {
    setSelectedWords([]);
  };
  
  // Complete the selection
  const completeSelection = () => {
    onSelect(selectedWords);
  };
  
  // Go back to previous step
  const goBack = () => {
    if (step === 'select-words') {
      setStep('select-list');
      setSelectedList(null);
      setSelectedWords([]);
    } else if (step === 'review') {
      setStep('select-words');
    }
  };
  
  // Go to review step
  const goToReview = () => {
    setStep('review');
  };
  
  if (loading && step === 'select-list') {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">
          {step === 'select-list' ? 'Select Vocabulary List' :
           step === 'select-words' ? 'Select Words' : 'Review Selection'}
        </h2>
        <button onClick={onCancel} className="text-white hover:text-gray-200">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      {step === 'select-list' && (
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                  placeholder="Search lists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="md:w-1/3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Filter className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                >
                  <option value="all">All Themes</option>
                  {themes.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredLists.length > 0 ? (
              filteredLists.map((list) => (
                <div
                  key={list.id}
                  className="border rounded-lg hover:border-indigo-500 transition-colors cursor-pointer"
                  onClick={() => loadListWords(list)}
                >
                  <div className="p-4">
                    <div className="flex items-start">
                      <BookOpen className="w-5 h-5 text-indigo-600 mr-2 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900">{list.name}</h3>
                        {list.description && (
                          <p className="text-sm text-gray-500 line-clamp-2">{list.description}</p>
                        )}
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <List className="w-4 h-4 mr-1" />
                          <span>{list.itemCount} words</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No vocabulary lists found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {step === 'select-words' && selectedList && (
        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{selectedList.name}</h3>
            <p className="text-sm text-gray-500 mb-4">
              Select up to {maxWords} words to use in your game.
              Currently selected: {selectedWords.length}/{maxWords}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={selectAllWords}
                className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm rounded-md"
              >
                Select All
              </button>
              <button
                onClick={clearSelectedWords}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-md"
              >
                Clear
              </button>
              <button
                onClick={goBack}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-md"
              >
                Back to Lists
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto mb-6">
            {selectedList.words.map((word) => {
              const isSelected = selectedWords.some(w => w.id === word.id);
              return (
                <div 
                  key={word.id}
                  onClick={() => toggleWordSelection(word)}
                  className={`p-3 border rounded-md cursor-pointer flex items-start ${
                    isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full mr-3 flex-shrink-0 ${
                    isSelected ? 'bg-indigo-500 text-white' : 'bg-gray-200'
                  } flex items-center justify-center`}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{word.term}</div>
                    <div className="text-sm text-gray-500">{word.translation}</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={goToReview}
              disabled={selectedWords.length === 0}
              className={`flex items-center px-4 py-2 rounded-md ${
                selectedWords.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Review Selection <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {step === 'review' && (
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Review Selected Words</h3>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">
              You've selected {selectedWords.length} words for your game:
            </p>
            <div className="max-h-64 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Term
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Translation
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedWords.map((word) => (
                    <tr key={word.id}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {word.term}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {word.translation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={goBack}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            
            <button
              onClick={completeSelection}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Use These Words
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 