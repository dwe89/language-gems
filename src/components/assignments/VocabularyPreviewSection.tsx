'use client';

import React, { useState, useEffect } from 'react';
import { Eye, X, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

interface VocabularyItem {
  id: string | number;
  term: string;
  translation: string;
  part_of_speech?: string;
  context_sentence?: string;
  context_translation?: string;
  difficulty_level?: string;
  selected: boolean;
}

interface VocabularyPreviewSectionProps {
  vocabularyConfig: {
    source: string;
    customListId?: string;
    categories?: string[];
    subcategories?: string[];
    theme?: string;
    unit?: string;
    examBoard?: string;
    tier?: string;
    language?: string;
    wordCount?: number;
    curriculumLevel?: string;
  };
  onVocabularyChange: (selectedItems: VocabularyItem[], wordCount: number) => void;
  maxWords?: number;
}

export default function VocabularyPreviewSection({
  vocabularyConfig,
  onVocabularyChange,
  maxWords = 100
}: VocabularyPreviewSectionProps) {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch vocabulary based on configuration
  useEffect(() => {
    if (!vocabularyConfig.source || vocabularyConfig.source === '') {
      setVocabulary([]);
      return;
    }

    fetchVocabulary();
  }, [
    vocabularyConfig.source,
    vocabularyConfig.customListId,
    vocabularyConfig.categories,
    vocabularyConfig.subcategories,
    vocabularyConfig.theme,
    vocabularyConfig.unit,
    vocabularyConfig.wordCount
  ]);

  const fetchVocabulary = async () => {
    setLoading(true);
    setError(null);

    try {
      let items: VocabularyItem[] = [];

      if (vocabularyConfig.source === 'custom' && vocabularyConfig.customListId) {
        // Fetch from custom vocabulary list
        const { data, error: fetchError } = await supabase
          .from('enhanced_vocabulary_lists')
          .select(`
            id,
            name,
            enhanced_vocabulary_items (
              id,
              term,
              translation,
              part_of_speech,
              context_sentence,
              context_translation,
              difficulty_level
            )
          `)
          .eq('id', vocabularyConfig.customListId)
          .single();

        if (fetchError) throw fetchError;

        if (data?.enhanced_vocabulary_items) {
          items = data.enhanced_vocabulary_items.map((item: any) => ({
            id: item.id,
            term: item.term,
            translation: item.translation,
            part_of_speech: item.part_of_speech,
            context_sentence: item.context_sentence,
            context_translation: item.context_translation,
            difficulty_level: item.difficulty_level,
            selected: true
          }));
        }
      } else if (vocabularyConfig.subcategories && vocabularyConfig.subcategories.length > 0) {
        // Fetch from centralized vocabulary by subcategories
        const { data, error: fetchError } = await supabase
          .from('centralized_vocabulary')
          .select('id, spanish, english, part_of_speech, category, subcategory')
          .in('subcategory', vocabularyConfig.subcategories)
          .limit(maxWords);

        if (fetchError) throw fetchError;

        items = (data || []).map((item: any) => ({
          id: item.id,
          term: item.spanish,
          translation: item.english,
          part_of_speech: item.part_of_speech,
          selected: true
        }));
      } else if (vocabularyConfig.categories && vocabularyConfig.categories.length > 0) {
        // Fetch from centralized vocabulary by categories
        const { data, error: fetchError } = await supabase
          .from('centralized_vocabulary')
          .select('id, spanish, english, part_of_speech, category, subcategory')
          .in('category', vocabularyConfig.categories)
          .limit(maxWords);

        if (fetchError) throw fetchError;

        items = (data || []).map((item: any) => ({
          id: item.id,
          term: item.spanish,
          translation: item.english,
          part_of_speech: item.part_of_speech,
          selected: true
        }));
      } else if (vocabularyConfig.theme && vocabularyConfig.unit) {
        // Fetch KS4 vocabulary by theme and unit
        const { data, error: fetchError } = await supabase
          .from('centralized_vocabulary')
          .select('id, spanish, english, part_of_speech, ks4_theme, ks4_unit')
          .eq('ks4_theme', vocabularyConfig.theme)
          .eq('ks4_unit', vocabularyConfig.unit)
          .limit(maxWords);

        if (fetchError) throw fetchError;

        items = (data || []).map((item: any) => ({
          id: item.id,
          term: item.spanish,
          translation: item.english,
          part_of_speech: item.part_of_speech,
          selected: true
        }));
      }

      // Limit to requested word count
      if (vocabularyConfig.wordCount && items.length > vocabularyConfig.wordCount) {
        items = items.slice(0, vocabularyConfig.wordCount);
      }

      setVocabulary(items);
      onVocabularyChange(items, items.length);
    } catch (err) {
      console.error('Error fetching vocabulary:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch vocabulary');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (itemId: string | number) => {
    const updatedVocabulary = vocabulary.map(item =>
      item.id === itemId ? { ...item, selected: !item.selected } : item
    );
    setVocabulary(updatedVocabulary);
    
    const selectedItems = updatedVocabulary.filter(item => item.selected);
    onVocabularyChange(selectedItems, selectedItems.length);
  };

  const selectAll = () => {
    const updatedVocabulary = vocabulary.map(item => ({ ...item, selected: true }));
    setVocabulary(updatedVocabulary);
    onVocabularyChange(updatedVocabulary, updatedVocabulary.length);
  };

  const deselectAll = () => {
    const updatedVocabulary = vocabulary.map(item => ({ ...item, selected: false }));
    setVocabulary(updatedVocabulary);
    onVocabularyChange([], 0);
  };

  const selectedCount = vocabulary.filter(item => item.selected).length;

  if (!vocabularyConfig.source || vocabularyConfig.source === '') {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center">
          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
            <Eye className="h-4 w-4 text-blue-600" />
          </div>
          Vocabulary Preview
        </h4>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
        >
          {showPreview ? 'Hide' : 'Show'} Preview
          <Eye className="h-4 w-4 ml-2" />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading vocabulary...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-900">Error loading vocabulary</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchVocabulary}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Try Again
            </button>
          </div>
        </div>
      )}

      {!loading && !error && vocabulary.length > 0 && (
        <>
          <div className="bg-white rounded-lg p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  {selectedCount} of {vocabulary.length} words selected
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={selectAll}
                className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors"
              >
                Select All
              </button>
              <button
                onClick={deselectAll}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>

          {showPreview && (
            <div className="bg-white rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                      Select
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Term
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Translation
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vocabulary.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        !item.selected ? 'opacity-50' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => toggleItem(item.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{item.term}</div>
                        {item.context_sentence && (
                          <div className="text-xs text-gray-500 mt-1 italic">{item.context_sentence}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700">{item.translation}</div>
                        {item.context_translation && (
                          <div className="text-xs text-gray-500 mt-1 italic">{item.context_translation}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {item.part_of_speech && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.part_of_speech}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!loading && !error && vocabulary.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">No vocabulary found for the selected configuration.</p>
          <p className="text-xs mt-1">Try selecting different categories or content sources.</p>
        </div>
      )}
    </div>
  );
}

