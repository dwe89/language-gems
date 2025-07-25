'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  X, 
  Save, 
  Upload, 
  Download, 
  BookOpen, 
  MessageSquare,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  FileText,
  Mic,
  Volume2
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { supabaseBrowser } from '../auth/AuthProvider';

interface VocabularyItem {
  id: string;
  type: 'word' | 'sentence' | 'phrase';
  term: string;
  translation: string;
  part_of_speech?: string;
  context_sentence?: string;
  context_translation?: string;
  audio_url?: string;
  image_url?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  notes?: string;
  tags?: string[];
}

interface VocabularyList {
  id?: string;
  name: string;
  description: string;
  language: 'spanish' | 'french' | 'german' | 'italian';
  theme?: string;
  topic?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  content_type: 'words' | 'sentences' | 'mixed';
  is_public: boolean;
  items: VocabularyItem[];
}

interface EnhancedVocabularyCreatorProps {
  onSave: (list: VocabularyList) => void;
  onCancel: () => void;
  initialData?: Partial<VocabularyList>;
  mode?: 'create' | 'edit';
}

const CONTENT_TYPES = [
  { id: 'words', label: 'Individual Words', description: 'Single vocabulary words with translations', icon: BookOpen },
  { id: 'sentences', label: 'Full Sentences', description: 'Complete sentences for translation practice', icon: MessageSquare },
  { id: 'mixed', label: 'Mixed Content', description: 'Combination of words and sentences', icon: FileText }
];

const LANGUAGES = [
  { id: 'spanish', label: 'Spanish', flag: '🇪🇸' },
  { id: 'french', label: 'French', flag: '🇫🇷' },
  { id: 'german', label: 'German', flag: '🇩🇪' },
  { id: 'italian', label: 'Italian', flag: '🇮🇹' }
];

const DIFFICULTY_LEVELS = [
  { id: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
  { id: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800' }
];

const PARTS_OF_SPEECH = [
  'noun', 'verb', 'adjective', 'adverb', 'preposition', 'pronoun', 'conjunction', 'interjection', 'phrase', 'sentence'
];

export default function EnhancedVocabularyCreator({
  onSave,
  onCancel,
  initialData,
  mode = 'create'
}: EnhancedVocabularyCreatorProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [vocabularyList, setVocabularyList] = useState<VocabularyList>({
    name: '',
    description: '',
    language: 'spanish',
    difficulty_level: 'intermediate',
    content_type: 'words',
    is_public: false,
    items: [],
    ...initialData
  });

  // Item editing state
  const [editingItem, setEditingItem] = useState<VocabularyItem | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [itemForm, setItemForm] = useState<Partial<VocabularyItem>>({
    type: 'word',
    term: '',
    translation: '',
    part_of_speech: 'noun',
    difficulty_level: 'intermediate'
  });

  // Bulk import state
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const resetItemForm = () => {
    setItemForm({
      type: vocabularyList.content_type === 'words' ? 'word' : 
            vocabularyList.content_type === 'sentences' ? 'sentence' : 'word',
      term: '',
      translation: '',
      part_of_speech: 'noun',
      difficulty_level: vocabularyList.difficulty_level
    });
  };

  const handleAddItem = () => {
    if (!itemForm.term || !itemForm.translation) {
      setError('Term and translation are required');
      return;
    }

    const newItem: VocabularyItem = {
      id: editingItem?.id || `temp-${Date.now()}`,
      type: itemForm.type || 'word',
      term: itemForm.term,
      translation: itemForm.translation,
      part_of_speech: itemForm.part_of_speech,
      context_sentence: itemForm.context_sentence,
      context_translation: itemForm.context_translation,
      difficulty_level: itemForm.difficulty_level || vocabularyList.difficulty_level,
      notes: itemForm.notes,
      tags: itemForm.tags
    };

    if (editingItem) {
      // Update existing item
      setVocabularyList(prev => ({
        ...prev,
        items: prev.items.map(item => item.id === editingItem.id ? newItem : item)
      }));
      setEditingItem(null);
    } else {
      // Add new item
      setVocabularyList(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
    }

    resetItemForm();
    setShowItemForm(false);
    setError('');
  };

  const handleEditItem = (item: VocabularyItem) => {
    setEditingItem(item);
    setItemForm(item);
    setShowItemForm(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setVocabularyList(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const handleBulkImport = () => {
    if (!bulkText.trim()) return;

    const lines = bulkText.trim().split('\n');
    const newItems: VocabularyItem[] = [];

    lines.forEach((line, index) => {
      const parts = line.split('\t').length > 1 ? line.split('\t') : line.split(',');
      if (parts.length >= 2) {
        const [term, translation, partOfSpeech, context, contextTranslation] = parts.map(p => p.trim());
        
        newItems.push({
          id: `bulk-${Date.now()}-${index}`,
          type: vocabularyList.content_type === 'sentences' ? 'sentence' : 'word',
          term,
          translation,
          part_of_speech: partOfSpeech || 'noun',
          context_sentence: context,
          context_translation: contextTranslation,
          difficulty_level: vocabularyList.difficulty_level
        });
      }
    });

    setVocabularyList(prev => ({
      ...prev,
      items: [...prev.items, ...newItems]
    }));

    setBulkText('');
    setShowBulkImport(false);
    setSuccess(`Added ${newItems.length} items successfully!`);
  };

  const handleSave = async () => {
    if (!vocabularyList.name.trim()) {
      setError('List name is required');
      return;
    }

    if (vocabularyList.items.length === 0) {
      setError('At least one vocabulary item is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSave(vocabularyList);
      setSuccess('Vocabulary list saved successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to save vocabulary list');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Term', 'Translation', 'Part of Speech', 'Context Sentence', 'Context Translation', 'Difficulty', 'Notes'];
    const rows = vocabularyList.items.map(item => [
      item.term,
      item.translation,
      item.part_of_speech || '',
      item.context_sentence || '',
      item.context_translation || '',
      item.difficulty_level,
      item.notes || ''
    ]);

    const csvContent = [headers, ...rows].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${vocabularyList.name.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Create' : 'Edit'} Vocabulary List
          </h2>
          <p className="text-gray-600 mt-1">
            Create custom vocabulary content for your students
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save List'}
          </button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg flex items-center gap-2">
          <Check className="h-4 w-4" />
          {success}
        </div>
      )}

      {/* Basic Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              List Name *
            </label>
            <input
              type="text"
              value={vocabularyList.name}
              onChange={(e) => setVocabularyList(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Spanish Food Vocabulary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={vocabularyList.description}
              onChange={(e) => setVocabularyList(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Describe what this vocabulary list covers..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={vocabularyList.language}
              onChange={(e) => setVocabularyList(prev => ({ ...prev, language: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type
            </label>
            <div className="space-y-2">
              {CONTENT_TYPES.map(type => (
                <label key={type.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="content_type"
                    value={type.id}
                    checked={vocabularyList.content_type === type.id}
                    onChange={(e) => setVocabularyList(prev => ({ ...prev, content_type: e.target.value as any }))}
                    className="text-blue-600"
                  />
                  <div className="flex items-center space-x-2">
                    <type.icon className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={vocabularyList.difficulty_level}
              onChange={(e) => setVocabularyList(prev => ({ ...prev, difficulty_level: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {DIFFICULTY_LEVELS.map(level => (
                <option key={level.id} value={level.id}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_public"
              checked={vocabularyList.is_public}
              onChange={(e) => setVocabularyList(prev => ({ ...prev, is_public: e.target.checked }))}
              className="text-blue-600"
            />
            <label htmlFor="is_public" className="text-sm text-gray-700">
              Make this list public (other teachers can use it)
            </label>
          </div>
        </div>
      </div>

      {/* Vocabulary Items Section */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Vocabulary Items ({vocabularyList.items.length})
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBulkImport(true)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Bulk Import
            </button>
            {vocabularyList.items.length > 0 && (
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            )}
            <button
              onClick={() => {
                resetItemForm();
                setShowItemForm(true);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>
        </div>

        {/* Items List */}
        {vocabularyList.items.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {vocabularyList.items.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.type === 'word' ? 'bg-blue-100 text-blue-800' :
                      item.type === 'sentence' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {item.type}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      DIFFICULTY_LEVELS.find(d => d.id === item.difficulty_level)?.color
                    }`}>
                      {item.difficulty_level}
                    </span>
                  </div>
                  <div className="font-medium text-gray-900">{item.term}</div>
                  <div className="text-gray-600">{item.translation}</div>
                  {item.context_sentence && (
                    <div className="text-sm text-gray-500 mt-1">
                      Context: {item.context_sentence}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No vocabulary items added yet</p>
            <p className="text-sm">Click "Add Item" to get started</p>
          </div>
        )}
      </div>

      {/* Add/Edit Item Modal */}
      {showItemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingItem ? 'Edit' : 'Add'} Vocabulary Item
              </h3>
              <button
                onClick={() => {
                  setShowItemForm(false);
                  setEditingItem(null);
                  resetItemForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {vocabularyList.content_type === 'mixed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Type
                  </label>
                  <select
                    value={itemForm.type}
                    onChange={(e) => setItemForm(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="word">Word</option>
                    <option value="sentence">Sentence</option>
                    <option value="phrase">Phrase</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {itemForm.type === 'sentence' ? 'Sentence' : 'Term'} *
                  </label>
                  <input
                    type="text"
                    value={itemForm.term}
                    onChange={(e) => setItemForm(prev => ({ ...prev, term: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={itemForm.type === 'sentence' ? 'Enter sentence...' : 'Enter term...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Translation *
                  </label>
                  <input
                    type="text"
                    value={itemForm.translation}
                    onChange={(e) => setItemForm(prev => ({ ...prev, translation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter translation..."
                  />
                </div>
              </div>

              {itemForm.type !== 'sentence' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Part of Speech
                    </label>
                    <select
                      value={itemForm.part_of_speech}
                      onChange={(e) => setItemForm(prev => ({ ...prev, part_of_speech: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {PARTS_OF_SPEECH.map(pos => (
                        <option key={pos} value={pos}>
                          {pos.charAt(0).toUpperCase() + pos.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={itemForm.difficulty_level}
                      onChange={(e) => setItemForm(prev => ({ ...prev, difficulty_level: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {DIFFICULTY_LEVELS.map(level => (
                        <option key={level.id} value={level.id}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Context Sentence
                  </label>
                  <input
                    type="text"
                    value={itemForm.context_sentence || ''}
                    onChange={(e) => setItemForm(prev => ({ ...prev, context_sentence: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Example sentence using this term..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Context Translation
                  </label>
                  <input
                    type="text"
                    value={itemForm.context_translation || ''}
                    onChange={(e) => setItemForm(prev => ({ ...prev, context_translation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Translation of context sentence..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={itemForm.notes || ''}
                  onChange={(e) => setItemForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Additional notes or hints..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowItemForm(false);
                  setEditingItem(null);
                  resetItemForm();
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Check className="h-4 w-4" />
                {editingItem ? 'Update' : 'Add'} Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Bulk Import</h3>
              <button
                onClick={() => setShowBulkImport(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Paste your vocabulary data below. Use one line per item with tab or comma separation:
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Format: Term, Translation, Part of Speech (optional), Context Sentence (optional), Context Translation (optional)
                </p>
                <textarea
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={10}
                  placeholder={`gato, cat, noun, El gato es negro, The cat is black
perro, dog, noun, Mi perro es grande, My dog is big
correr, to run, verb, Me gusta correr, I like to run`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowBulkImport(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkImport}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
                Import Items
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
