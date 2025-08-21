'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export default function TestAIPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAICategorization = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/vocabulary/categorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              term: 'la papelera',
              translation: 'wastebasket',
              part_of_speech: 'noun'
            },
            {
              term: 'el diccionario',
              translation: 'dictionary',
              part_of_speech: 'noun'
            },
            {
              term: 'el pasillo',
              translation: 'hallway',
              part_of_speech: 'noun'
            }
          ],
          language: 'spanish',
          use_ai: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Categorization Test</h1>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test GPT-5 Nano Integration</h2>
          <p className="text-gray-600 mb-4">
            This will test the AI categorization API with sample Spanish vocabulary.
          </p>
          
          <button
            onClick={testAICategorization}
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? 'Testing AI...' : 'Test AI Categorization'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-green-800 font-medium mb-4">AI Categorization Results</h3>
            
            <div className="space-y-4">
              {result.results?.map((item: any, index: number) => (
                <div key={index} className="bg-white border border-gray-200 rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {['la papelera', 'el diccionario', 'el pasillo'][index]} → {['wastebasket', 'dictionary', 'hallway'][index]}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.category_confidence >= 0.8 
                        ? 'bg-green-100 text-green-800'
                        : item.category_confidence >= 0.6
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {Math.round(item.category_confidence * 100)}% confidence
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p><strong>Category:</strong> {item.predicted_category}</p>
                    <p><strong>Subcategory:</strong> {item.predicted_subcategory}</p>
                    {item.centralized_match_id && (
                      <p><strong>Centralized Match:</strong> Found (ID: {item.centralized_match_id})</p>
                    )}
                    <p><strong>Base Word:</strong> {item.base_word}</p>
                    {item.article && <p><strong>Article:</strong> {item.article}</p>}
                    {item.gender && <p><strong>Gender:</strong> {item.gender}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gray-100 rounded-md">
              <h4 className="font-medium text-gray-900 mb-2">API Response Metadata</h4>
              <pre className="text-xs text-gray-600 overflow-x-auto">
                {JSON.stringify(result.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
