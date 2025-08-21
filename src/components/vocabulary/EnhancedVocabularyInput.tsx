'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader2, Sparkles, X } from 'lucide-react';
import { vocabularyCategorizationService } from '../../services/VocabularyCategorizationService';

interface VocabularyItem {
  id: string;
  term: string;
  translation: string;
  article?: string;
  gender?: 'm' | 'f' | 'n';
  part_of_speech?: string;
  context_sentence?: string;
  context_translation?: string;
  notes?: string;
  predicted_category?: string;
  predicted_subcategory?: string;
  category_confidence?: number;
  validation_errors?: string[];
}

interface EnhancedVocabularyInputProps {
  items: VocabularyItem[];
  onChange: (items: VocabularyItem[]) => void;
  language: 'spanish' | 'french' | 'german';
}

export default function EnhancedVocabularyInput({
  items,
  onChange,
  language
}: EnhancedVocabularyInputProps) {
  const [categorizingItems, setCategorizingItems] = useState<Set<string>>(new Set());
  const [showValidation, setShowValidation] = useState(true);

  const validateVocabularyItem = (item: VocabularyItem): string[] => {
    const errors: string[] = [];
    
    // Check for prohibited characters in main term
    if (item.term.includes('(') || item.term.includes(')')) {
      errors.push('Use separate fields for gender and articles instead of parentheses');
    }
    
    // Check for mixed content in term field
    if (item.term.includes(' - ') || item.term.includes(' = ')) {
      errors.push('Enter only the vocabulary term, use the translation field for meanings');
    }
    
    // Validate required fields
    if (!item.term.trim()) {
      errors.push('Vocabulary term is required');
    }
    
    if (!item.translation.trim()) {
      errors.push('Translation is required');
    }
    
    // Language-specific validation
    if (language === 'spanish') {
      // Check for common Spanish articles
      const spanishArticles = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas'];
      const termWords = item.term.toLowerCase().split(' ');
      
      if (spanishArticles.some(article => termWords.includes(article)) && !item.article) {
        errors.push('Consider moving the article to the separate article field');
      }
    }
    
    return errors;
  };

  const updateItem = (id: string, updates: Partial<VocabularyItem>) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        updated.validation_errors = validateVocabularyItem(updated);
        return updated;
      }
      return item;
    });
    onChange(updatedItems);
  };

  const categorizeItem = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item || !item.term || !item.translation) return;

    setCategorizingItems(prev => new Set([...prev, id]));

    try {
      const results = await vocabularyCategorizationService.categorizeVocabulary([{
        term: item.term,
        translation: item.translation,
        part_of_speech: item.part_of_speech,
        context_sentence: item.context_sentence
      }]);

      if (results.length > 0) {
        const result = results[0];
        updateItem(id, {
          predicted_category: result.predicted_category,
          predicted_subcategory: result.predicted_subcategory,
          category_confidence: result.category_confidence,
          article: result.article,
          gender: result.gender as 'm' | 'f' | 'n'
        });
      }
    } catch (error) {
      console.error('Error categorizing vocabulary:', error);
    } finally {
      setCategorizingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const addNewItem = () => {
    const newItem: VocabularyItem = {
      id: Date.now().toString(),
      term: '',
      translation: '',
      validation_errors: []
    };
    onChange([...items, newItem]);
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Validation Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Vocabulary Items</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showValidation}
            onChange={(e) => setShowValidation(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-600">Show validation hints</span>
        </label>
      </div>

      {/* Vocabulary Items */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">Item {index + 1}</span>
              <div className="flex items-center gap-2">
                {/* AI Categorization Button */}
                <button
                  onClick={() => categorizeItem(item.id)}
                  disabled={categorizingItems.has(item.id) || !item.term || !item.translation}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {categorizingItems.has(item.id) ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  AI Categorize
                </button>
                
                {/* Remove Button */}
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Main Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vocabulary Term *
                </label>
                <input
                  type="text"
                  value={item.term}
                  onChange={(e) => updateItem(item.id, { term: e.target.value })}
                  placeholder="e.g., coche, maison, Haus"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Translation *
                </label>
                <input
                  type="text"
                  value={item.translation}
                  onChange={(e) => updateItem(item.id, { translation: e.target.value })}
                  placeholder="e.g., car, house, house"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Linguistic Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Article
                </label>
                <select
                  value={item.article || ''}
                  onChange={(e) => updateItem(item.id, { article: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None</option>
                  {language === 'spanish' && (
                    <>
                      <option value="el">el</option>
                      <option value="la">la</option>
                      <option value="los">los</option>
                      <option value="las">las</option>
                      <option value="un">un</option>
                      <option value="una">una</option>
                    </>
                  )}
                  {language === 'french' && (
                    <>
                      <option value="le">le</option>
                      <option value="la">la</option>
                      <option value="les">les</option>
                      <option value="un">un</option>
                      <option value="une">une</option>
                    </>
                  )}
                  {language === 'german' && (
                    <>
                      <option value="der">der</option>
                      <option value="die">die</option>
                      <option value="das">das</option>
                      <option value="ein">ein</option>
                      <option value="eine">eine</option>
                    </>
                  )}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={item.gender || ''}
                  onChange={(e) => updateItem(item.id, { gender: e.target.value as 'm' | 'f' | 'n' || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None</option>
                  <option value="m">Masculine</option>
                  <option value="f">Feminine</option>
                  <option value="n">Neuter</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part of Speech
                </label>
                <select
                  value={item.part_of_speech || ''}
                  onChange={(e) => updateItem(item.id, { part_of_speech: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="noun">Noun</option>
                  <option value="verb">Verb</option>
                  <option value="adjective">Adjective</option>
                  <option value="adverb">Adverb</option>
                  <option value="preposition">Preposition</option>
                  <option value="conjunction">Conjunction</option>
                  <option value="interjection">Interjection</option>
                </select>
              </div>
            </div>

            {/* AI Predictions Display */}
            {item.predicted_category && (
              <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">AI Categorization</span>
                  <span className="text-xs text-purple-600">
                    {Math.round((item.category_confidence || 0) * 100)}% confidence
                  </span>
                </div>
                <div className="text-sm text-purple-700">
                  <strong>Category:</strong> {item.predicted_category}
                  {item.predicted_subcategory && (
                    <> → <strong>Subcategory:</strong> {item.predicted_subcategory}</>
                  )}
                </div>
              </div>
            )}

            {/* Validation Errors */}
            {showValidation && item.validation_errors && item.validation_errors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Validation Issues</span>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {item.validation_errors.map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Context Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Context Sentence
                </label>
                <input
                  type="text"
                  value={item.context_sentence || ''}
                  onChange={(e) => updateItem(item.id, { context_sentence: e.target.value || undefined })}
                  placeholder="Example sentence using this word"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Context Translation
                </label>
                <input
                  type="text"
                  value={item.context_translation || ''}
                  onChange={(e) => updateItem(item.id, { context_translation: e.target.value || undefined })}
                  placeholder="Translation of the example sentence"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Item Button */}
      <button
        onClick={addNewItem}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
      >
        + Add Another Vocabulary Item
      </button>
    </div>
  );
}
