'use client';

import React, { useState } from 'react';
import { Upload, Sparkles, Loader2, CheckCircle, AlertTriangle, X, Eye } from 'lucide-react';
import { vocabularyCategorizationService } from '../../services/VocabularyCategorizationService';
import CategoryReviewInterface from './CategoryReviewInterface';

interface VocabularyItem {
  id: string;
  term: string;
  translation: string;
  article?: string;
  gender?: 'm' | 'f' | 'n';
  part_of_speech?: string;
  context_sentence?: string;
  predicted_category?: string;
  predicted_subcategory?: string;
  category_confidence?: number;
  needs_review?: boolean;
}

interface AIVocabularyUploadProps {
  onUploadComplete: (items: VocabularyItem[]) => void;
  language: 'spanish' | 'french' | 'german';
}

export default function AIVocabularyUpload({
  onUploadComplete,
  language
}: AIVocabularyUploadProps) {
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'input' | 'categorizing' | 'review' | 'complete'>('input');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [useAI, setUseAI] = useState(true);
  const [bulkInput, setBulkInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const parseBulkInput = (input: string): VocabularyItem[] => {
    const lines = input.trim().split('\n').filter(line => line.trim());
    const parsed: VocabularyItem[] = [];

    lines.forEach((line, index) => {
      const parts = line.split(/[,\t]/).map(p => p.trim());
      if (parts.length >= 2) {
        parsed.push({
          id: `item-${index}`,
          term: parts[0],
          translation: parts[1],
          context_sentence: parts[2] || undefined,
          part_of_speech: parts[3] || undefined
        });
      }
    });

    return parsed;
  };

  const handleBulkInputChange = (input: string) => {
    setBulkInput(input);
    if (input.trim()) {
      const parsed = parseBulkInput(input);
      setItems(parsed);
    } else {
      setItems([]);
    }
  };

  const categorizeVocabulary = async () => {
    if (items.length === 0) return;

    setProcessing(true);
    setCurrentStep('categorizing');
    setProgress({ current: 0, total: items.length });
    setError(null);

    try {
      // Process in batches to avoid rate limits
      const batchSize = 20;
      const batches = [];
      for (let i = 0; i < items.length; i += batchSize) {
        batches.push(items.slice(i, i + batchSize));
      }

      const allResults: any[] = [];

      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        
        try {
          const response = await fetch('/api/vocabulary/categorize', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: batch.map(item => ({
                term: item.term,
                translation: item.translation,
                part_of_speech: item.part_of_speech,
                context_sentence: item.context_sentence
              })),
              language,
              use_ai: useAI
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Categorization failed');
          }

          const data = await response.json();
          allResults.push(...data.results);
          
          setProgress({ 
            current: Math.min((batchIndex + 1) * batchSize, items.length), 
            total: items.length 
          });

          // Small delay between batches to respect rate limits
          if (batchIndex < batches.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }

        } catch (error) {
          console.error('Batch categorization error:', error);
          // Continue with remaining batches, use fallback for failed items
          const fallbackResults = batch.map(item => ({
            predicted_category: 'General',
            predicted_subcategory: 'Uncategorized',
            category_confidence: 0.3,
            base_word: item.term,
            raw_input: item.term
          }));
          allResults.push(...fallbackResults);
        }
      }

      // Update items with categorization results
      const updatedItems = items.map((item, index) => {
        const result = allResults[index];
        return {
          ...item,
          predicted_category: result?.predicted_category || 'General',
          predicted_subcategory: result?.predicted_subcategory || 'Uncategorized',
          category_confidence: result?.category_confidence || 0.3,
          needs_review: !result || result.category_confidence < 0.8
        };
      });

      setItems(updatedItems);
      setCurrentStep('review');

    } catch (error) {
      console.error('Categorization error:', error);
      setError(error instanceof Error ? error.message : 'Categorization failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleReviewComplete = () => {
    setCurrentStep('complete');
    onUploadComplete(items);
  };

  const resetUpload = () => {
    setItems([]);
    setBulkInput('');
    setCurrentStep('input');
    setProgress({ current: 0, total: 0 });
    setError(null);
  };

  if (currentStep === 'review') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Review AI Categorizations</h3>
          <button
            onClick={resetUpload}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Start Over
          </button>
        </div>
        <CategoryReviewInterface
          vocabularyItems={items.map(item => ({
            id: item.id,
            term: item.term,
            translation: item.translation,
            suggestedCategory: item.predicted_category || 'General',
            suggestedSubcategory: item.predicted_subcategory || 'Uncategorized',
            confidence: item.category_confidence || 0.5,
            teacherApprovedCategory: undefined
          }))}
          onReviewComplete={handleReviewComplete}
        />
      </div>
    );
  }

  if (currentStep === 'complete') {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Complete!</h3>
        <p className="text-gray-600 mb-4">
          {items.length} vocabulary items have been processed and categorized.
        </p>
        <button
          onClick={resetUpload}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Upload More Vocabulary
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upload Vocabulary</h3>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Use AI categorization</span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bulk Vocabulary Input
            </label>
            <textarea
              value={bulkInput}
              onChange={(e) => handleBulkInputChange(e.target.value)}
              placeholder={`Enter vocabulary items, one per line. Format:
Spanish Word, English Translation, Context (optional), Part of Speech (optional)

Example:
coche, car, El coche es rojo, noun
hablar, to speak, Me gusta hablar español, verb
rojo, red, , adjective`}
              className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supports comma or tab-separated values. Maximum 100 items per upload.
            </p>
          </div>

          {items.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Preview ({items.length} items)</span>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {items.slice(0, 5).map((item, index) => (
                  <div key={index} className="text-xs text-gray-600">
                    <strong>{item.term}</strong> → {item.translation}
                    {item.context_sentence && <span className="text-gray-500"> ({item.context_sentence})</span>}
                  </div>
                ))}
                {items.length > 5 && (
                  <div className="text-xs text-gray-500">... and {items.length - 5} more items</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Processing Section */}
      {currentStep === 'categorizing' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            <h3 className="text-lg font-semibold text-blue-900">
              {useAI ? 'AI Categorizing Vocabulary...' : 'Processing Vocabulary...'}
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-blue-700">
              <span>Progress: {progress.current} of {progress.total} items</span>
              <span>{Math.round((progress.current / progress.total) * 100)}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
            <p className="text-sm text-blue-600">
              {useAI 
                ? 'Matching against curated database and using AI for unknown words...'
                : 'Using rule-based categorization...'
              }
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-red-800 font-medium">Error</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {items.length > 0 && (
            <span>{items.length} vocabulary items ready for processing</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {items.length > 0 && (
            <button
              onClick={resetUpload}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear
            </button>
          )}
          <button
            onClick={categorizeVocabulary}
            disabled={items.length === 0 || processing}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {processing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : useAI ? (
              <Sparkles className="h-4 w-4" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {processing ? 'Processing...' : useAI ? 'Categorize with AI' : 'Process Vocabulary'}
          </button>
        </div>
      </div>
    </div>
  );
}
