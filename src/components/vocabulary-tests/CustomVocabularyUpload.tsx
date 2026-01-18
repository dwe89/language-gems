'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  Plus,
  X,
  CheckCircle,
  AlertTriangle,
  Download,
  Info
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';

interface CustomVocabularyUploadProps {
  language: string;
  onVocabularyCreated: (vocabularyData: any) => void;
  onCancel: () => void;
}

interface VocabularyItem {
  target_word: string;
  english_translation: string;
  category?: string;
  subcategory?: string;
  difficulty?: string;
}

export default function CustomVocabularyUpload({
  language,
  onVocabularyCreated,
  onCancel
}: CustomVocabularyUploadProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();

  // State
  const [uploadMethod, setUploadMethod] = useState<'manual' | 'csv' | 'paste'>('manual');
  const [vocabularyItems, setVocabularyItems] = useState<VocabularyItem[]>([
    { target_word: '', english_translation: '', category: 'Custom', subcategory: 'Test Vocabulary', difficulty: 'intermediate' }
  ]);
  const [csvText, setCsvText] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const addVocabularyItem = () => {
    setVocabularyItems(prev => [
      ...prev,
      { target_word: '', english_translation: '', category: 'Custom', subcategory: 'Test Vocabulary', difficulty: 'intermediate' }
    ]);
  };

  const removeVocabularyItem = (index: number) => {
    setVocabularyItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateVocabularyItem = (index: number, field: keyof VocabularyItem, value: string) => {
    setVocabularyItems(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const parseCsvText = (text: string): VocabularyItem[] => {
    const lines = text.trim().split('\n');
    const items: VocabularyItem[] = [];

    lines.forEach((line, index) => {
      if (line.trim()) {
        const parts = line.split(',').map(part => part.trim().replace(/"/g, ''));

        if (parts.length >= 2) {
          items.push({
            target_word: parts[0],
            english_translation: parts[1],
            category: parts[2] || 'Custom',
            subcategory: parts[3] || 'Test Vocabulary',
            difficulty: parts[4] || 'intermediate'
          });
        }
      }
    });

    return items;
  };

  const parsePasteText = (text: string): VocabularyItem[] => {
    const lines = text.trim().split('\n');
    const items: VocabularyItem[] = [];

    lines.forEach((line, index) => {
      if (line.trim()) {
        // Try tab-separated first, then comma-separated
        let parts = line.split('\t').map(part => part.trim());

        // If only one part found with tabs, try commas
        if (parts.length < 2) {
          parts = line.split(',').map(part => part.trim().replace(/"/g, ''));
        }

        // Also try semicolons as a fallback
        if (parts.length < 2) {
          parts = line.split(';').map(part => part.trim());
        }

        if (parts.length >= 2) {
          items.push({
            target_word: parts[0],
            english_translation: parts[1],
            category: parts[2] || 'Custom',
            subcategory: parts[3] || 'Test Vocabulary',
            difficulty: parts[4] || 'intermediate'
          });
        }
      }
    });

    return items;
  };

  const handleCsvImport = () => {
    try {
      const items = parseCsvText(csvText);
      if (items.length === 0) {
        setError('No valid vocabulary items found in CSV text');
        return;
      }
      setVocabularyItems(items);
      setUploadMethod('manual'); // Switch to manual view to show imported items
      setError(null);
    } catch (error) {
      setError('Error parsing CSV text. Please check the format.');
    }
  };

  const handlePasteImport = () => {
    try {
      const items = parsePasteText(pasteText);
      if (items.length === 0) {
        setError('No valid vocabulary items found in pasted text');
        return;
      }
      setVocabularyItems(items);
      setUploadMethod('manual'); // Switch to manual view to show imported items
      setError(null);
    } catch (error) {
      setError('Error parsing pasted text. Please check the format.');
    }
  };

  const validateVocabularyItems = (): boolean => {
    const validItems = vocabularyItems.filter(item =>
      item.target_word.trim() && item.english_translation.trim()
    );

    if (validItems.length === 0) {
      setError('Please add at least one vocabulary item with both target word and English translation');
      return false;
    }

    if (validItems.length !== vocabularyItems.length) {
      setError('All vocabulary items must have both target word and English translation');
      return false;
    }

    return true;
  };

  const handleSaveVocabulary = async () => {
    if (!user || !supabase) return;

    if (!validateVocabularyItems()) return;

    setLoading(true);
    setError(null);

    try {
      // Prepare vocabulary items - these will be stored in the test's vocabulary_criteria JSONB field
      // NOT in centralized_vocabulary table (which is for permanent, curated vocabulary)
      const vocabularyData = vocabularyItems.map(item => ({
        id: uuidv4(), // Generate UUID for tracking
        language: language,
        word: item.target_word.trim(),
        translation: item.english_translation.trim(),
        category: item.category || 'Custom',
        subcategory: item.subcategory || 'Test Vocabulary',
        difficulty: item.difficulty || 'intermediate'
      }));

      setSuccess(true);

      // Return the vocabulary data array to parent component
      // Parent expects just the array, not an object
      onVocabularyCreated(vocabularyData);

    } catch (error: any) {
      setError(error.message || 'Failed to save vocabulary');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `Target Word,English Translation
hola,hello
adiós,goodbye
casa,house
comer,to eat`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vocabulary_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vocabulary Saved!</h2>
          <p className="text-gray-600 mb-6">
            Your custom vocabulary has been successfully added to the database and is ready to use in tests.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => {
                setSuccess(false);
                setVocabularyItems([{ target_word: '', english_translation: '', category: 'Custom', subcategory: 'Test Vocabulary', difficulty: 'intermediate' }]);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Add More Vocabulary
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Custom Vocabulary</h2>
            <p className="text-gray-600">Create custom vocabulary for your test</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Upload Method Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">How would you like to add vocabulary?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setUploadMethod('manual')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${uploadMethod === 'manual'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <Plus className="h-5 w-5 text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900">Manual Entry</h4>
              <p className="text-sm text-gray-600">Add words one by one</p>
            </button>

            <button
              onClick={() => setUploadMethod('csv')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${uploadMethod === 'csv'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <FileText className="h-5 w-5 text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900">CSV Import</h4>
              <p className="text-sm text-gray-600">Paste CSV formatted text</p>
            </button>

            <button
              onClick={() => setUploadMethod('paste')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${uploadMethod === 'paste'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <Upload className="h-5 w-5 text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900">Bulk Paste</h4>
              <p className="text-sm text-gray-600">Paste word pairs</p>
            </button>
          </div>
        </div>

        {/* CSV Import */}
        {uploadMethod === 'csv' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">CSV Import</h4>
              <button
                onClick={downloadTemplate}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Download className="h-4 w-4" />
                <span>Download Template</span>
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">CSV Format:</p>
                  <p>Target Word, English Translation</p>
                  <p className="mt-1">Example: hola, hello</p>
                </div>
              </div>
            </div>

            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full h-32 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Paste your CSV data here..."
            />

            <button
              onClick={handleCsvImport}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Import CSV Data
            </button>
          </div>
        )}

        {/* Bulk Paste */}
        {uploadMethod === 'paste' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Bulk Paste</h4>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium">Supported Formats:</p>
                  <p>• Tab-separated: word1[tab]translation1</p>
                  <p>• Comma-separated: word1, translation1</p>
                  <p>• Semicolon-separated: word1; translation1</p>
                  <p className="mt-1">Example: hola[tab]hello</p>
                  <p className="mt-1">Or: hola, hello</p>
                </div>
              </div>
            </div>

            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              className="w-full h-32 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Paste your vocabulary data here (one pair per line)..."
            />

            <button
              onClick={handlePasteImport}
              className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Import Pasted Data
            </button>
          </div>
        )}

        {/* Manual Entry */}
        {uploadMethod === 'manual' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Vocabulary Items ({vocabularyItems.length})</h4>
              <button
                onClick={addVocabularyItem}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {vocabularyItems.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={item.target_word}
                    onChange={(e) => updateVocabularyItem(index, 'target_word', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Target word"
                  />
                  <input
                    type="text"
                    value={item.english_translation}
                    onChange={(e) => updateVocabularyItem(index, 'english_translation', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="English translation"
                  />
                  <input
                    type="text"
                    value={item.category || ''}
                    onChange={(e) => updateVocabularyItem(index, 'category', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Category"
                  />
                  <input
                    type="text"
                    value={item.subcategory || ''}
                    onChange={(e) => updateVocabularyItem(index, 'subcategory', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Subcategory"
                  />
                  <select
                    value={item.difficulty || 'intermediate'}
                    onChange={(e) => updateVocabularyItem(index, 'difficulty', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <button
                    onClick={() => removeVocabularyItem(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                    disabled={vocabularyItems.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800 px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveVocabulary}
            disabled={loading || vocabularyItems.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : `Save ${vocabularyItems.length} Items`}
          </button>
        </div>
      </div>
    </div>
  );
}
