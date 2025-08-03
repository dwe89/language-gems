'use client';

import React, { useState } from 'react';
import { Upload, Plus, X, Save, Download } from 'lucide-react';

interface VocabularyItem {
  term: string;
  translation: string;
  part_of_speech?: string;
  context_sentence?: string;
  context_translation?: string;
}

interface WorkingInlineVocabularyCreatorProps {
  onSave: (vocabularyData: {
    name: string;
    items: VocabularyItem[];
    language: string;
    difficulty_level: string;
  }) => void;
  onCancel: () => void;
  language?: string;
}

export default function WorkingInlineVocabularyCreator({
  onSave,
  onCancel,
  language = 'spanish'
}: WorkingInlineVocabularyCreatorProps) {
  const [listName, setListName] = useState('');
  const [items, setItems] = useState<VocabularyItem[]>([]);
  const [currentItem, setCurrentItem] = useState<VocabularyItem>({
    term: '',
    translation: '',
    part_of_speech: 'noun'
  });
  const [bulkText, setBulkText] = useState('');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [saving, setSaving] = useState(false);

  const addCurrentItem = () => {
    if (!currentItem.term.trim() || !currentItem.translation.trim()) {
      alert('Please fill in both term and translation');
      return;
    }

    setItems(prev => [...prev, { ...currentItem }]);
    setCurrentItem({
      term: '',
      translation: '',
      part_of_speech: 'noun'
    });
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleBulkImport = () => {
    if (!bulkText.trim()) return;

    const lines = bulkText.trim().split('\n');
    const newItems: VocabularyItem[] = [];

    lines.forEach(line => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        newItems.push({
          term: parts[0],
          translation: parts[1],
          part_of_speech: parts[2] || 'noun',
          context_sentence: parts[3] || '',
          context_translation: parts[4] || ''
        });
      }
    });

    setItems(prev => [...prev, ...newItems]);
    setBulkText('');
    setShowBulkImport(false);
  };

  const handleSave = async () => {
    if (!listName.trim()) {
      alert('Please enter a list name');
      return;
    }

    if (items.length === 0) {
      alert('Please add at least one vocabulary item');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name: listName,
        items,
        language,
        difficulty_level: 'intermediate'
      });
    } catch (error) {
      console.error('Error saving vocabulary:', error);
      alert('Error saving vocabulary list');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Create Custom Vocabulary List</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      {/* List Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          List Name *
        </label>
        <input
          type="text"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., My Custom Food Vocabulary"
        />
      </div>

      {/* Add Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Add Vocabulary Items</h4>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBulkImport(!showBulkImport)}
              className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded hover:bg-blue-50"
            >
              <Upload size={14} />
              Bulk Import
            </button>
          </div>
        </div>

        {/* Bulk Import */}
        {showBulkImport && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste vocabulary (one per line, comma-separated)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Format: Spanish term, English translation, part of speech (optional)
            </p>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="gato, cat, noun&#10;perro, dog, noun&#10;correr, to run, verb"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleBulkImport}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Import
              </button>
              <button
                onClick={() => setShowBulkImport(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Single Item Input */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            value={currentItem.term}
            onChange={(e) => setCurrentItem(prev => ({ ...prev, term: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            placeholder={`${language === 'spanish' ? 'Spanish' : language === 'french' ? 'French' : 'German'} term`}
          />
          <input
            type="text"
            value={currentItem.translation}
            onChange={(e) => setCurrentItem(prev => ({ ...prev, translation: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="English translation"
          />
          <select
            value={currentItem.part_of_speech}
            onChange={(e) => setCurrentItem(prev => ({ ...prev, part_of_speech: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="noun">Noun</option>
            <option value="verb">Verb</option>
            <option value="adjective">Adjective</option>
            <option value="adverb">Adverb</option>
            <option value="pronoun">Pronoun</option>
            <option value="preposition">Preposition</option>
            <option value="conjunction">Conjunction</option>
            <option value="interjection">Interjection</option>
          </select>
          <button
            onClick={addCurrentItem}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* Items List */}
      {items.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Vocabulary Items ({items.length})</h4>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{item.term}</span>
                  <span className="text-gray-500 mx-2">→</span>
                  <span className="text-gray-700">{item.translation}</span>
                  {item.part_of_speech && (
                    <span className="text-xs text-gray-500 ml-2">({item.part_of_speech})</span>
                  )}
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving || !listName.trim() || items.length === 0}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save List'}
        </button>
      </div>
    </div>
  );
}
