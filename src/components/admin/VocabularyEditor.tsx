'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  X, 
  Volume2, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { supabaseBrowser } from '../auth/AuthProvider';

interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  language: string;
  category: string;
  subcategory?: string;
  part_of_speech?: string;
  curriculum_level?: string;
  example_sentence?: string;
  example_translation?: string;
  gender?: string;
  audio_url?: string;
  has_audio: boolean;
  article?: string;
  base_word?: string;
  display_word?: string;
}

interface VocabularyEditorProps {
  vocabulary: VocabularyItem;
  onSave: () => void;
  onCancel: () => void;
}

export default function VocabularyEditor({ vocabulary, onSave, onCancel }: VocabularyEditorProps) {
  const [formData, setFormData] = useState({
    word: vocabulary.word,
    translation: vocabulary.translation,
    language: vocabulary.language,
    category: vocabulary.category,
    subcategory: vocabulary.subcategory || '',
    article: vocabulary.article || '',
    base_word: vocabulary.base_word || '',
    display_word: vocabulary.display_word || '',
    part_of_speech: vocabulary.part_of_speech || 'noun',
    curriculum_level: vocabulary.curriculum_level || '',
    example_sentence: vocabulary.example_sentence || '',
    example_translation: vocabulary.example_translation || '',
    gender: vocabulary.gender || ''
  });

  const [saving, setSaving] = useState(false);
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateAudio = async () => {
    if (!formData.word || !formData.language) return;

    setGeneratingAudio(true);
    try {
      const response = await fetch('/api/admin/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: formData.word,
          language: formData.language,
          vocabularyId: vocabulary.id
        }),
      });

      if (!response.ok) throw new Error('Failed to generate audio');

      const result = await response.json();
      
      // Update the vocabulary item with the new audio URL
      await supabaseBrowser
        .from('centralized_vocabulary')
        .update({ audio_url: result.audioUrl })
        .eq('id', vocabulary.id);

      alert('Audio generated successfully!');
    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Error generating audio. Please try again.');
    } finally {
      setGeneratingAudio(false);
    }
  };

  const playAudio = () => {
    if (vocabulary.audio_url) {
      const audio = new Audio(vocabulary.audio_url);
      audio.play();
    }
  };

  const handleSave = async () => {
    if (!formData.word || !formData.translation || !formData.language || !formData.category) {
      setError('Please fill in all required fields (word, translation, language, category)');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const updateData = {
        word: formData.word,
        translation: formData.translation,
        language: formData.language,
        category: formData.category,
        subcategory: formData.subcategory || null,
        article: formData.article || null,
        base_word: formData.base_word || null,
        // Remove display_word from updates since it's a generated column
        part_of_speech: formData.part_of_speech || null,
        curriculum_level: formData.curriculum_level || null,
        example_sentence: formData.example_sentence || null,
        example_translation: formData.example_translation || null,
        gender: formData.gender || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabaseBrowser
        .from('centralized_vocabulary')
        .update(updateData)
        .eq('id', vocabulary.id);

      if (error) throw error;

      onSave();
    } catch (error) {
      console.error('Error saving vocabulary:', error);
      setError('Error saving vocabulary item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-slate-900">Edit Vocabulary Item</h3>
        <div className="flex items-center gap-2">
          {vocabulary.audio_url && (
            <button
              onClick={playAudio}
              className="p-2 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={generateAudio}
            disabled={generatingAudio}
            className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 disabled:opacity-50 flex items-center gap-2"
          >
            {generatingAudio ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
            {generatingAudio ? 'Generating...' : 'Generate Audio'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-slate-900">Basic Information</h4>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Word *
            </label>
            <input
              type="text"
              value={formData.word}
              onChange={(e) => handleInputChange('word', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Translation *
            </label>
            <input
              type="text"
              value={formData.translation}
              onChange={(e) => handleInputChange('translation', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Language *
            </label>
            <select
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category *
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Subcategory
            </label>
            <input
              type="text"
              value={formData.subcategory}
              onChange={(e) => handleInputChange('subcategory', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Article <span className="text-xs text-slate-500">(e.g., le, la, der, die, das)</span>
            </label>
            <input
              type="text"
              value={formData.article}
              onChange={(e) => handleInputChange('article', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter grammatical article"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Base Word <span className="text-xs text-slate-500">(word without article, used for audio)</span>
            </label>
            <input
              type="text"
              value={formData.base_word}
              onChange={(e) => handleInputChange('base_word', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter base word without article"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Display Word <span className="text-xs text-slate-500">(full word as shown to users)</span>
            </label>
            <input
              type="text"
              value={formData.display_word}
              onChange={(e) => handleInputChange('display_word', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter complete display word"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Part of Speech
            </label>
            <select
              value={formData.part_of_speech}
              onChange={(e) => handleInputChange('part_of_speech', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="noun">Noun</option>
              <option value="verb">Verb</option>
              <option value="adjective">Adjective</option>
              <option value="adverb">Adverb</option>
              <option value="preposition">Preposition</option>
              <option value="interjection">Interjection</option>
            </select>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-slate-900">Additional Information</h4>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Curriculum Level
            </label>
            <input
              type="text"
              value={formData.curriculum_level}
              onChange={(e) => handleInputChange('curriculum_level', e.target.value)}
              placeholder="e.g., KS3, GCSE_Foundation, GCSE_Higher"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Gender
            </label>
            <input
              type="text"
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              placeholder="e.g., masculine, feminine"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Examples Section */}
      <div className="mt-6">
        <h4 className="text-md font-medium text-slate-900 mb-4">Examples</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Example Sentence
            </label>
            <textarea
              value={formData.example_sentence}
              onChange={(e) => handleInputChange('example_sentence', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Example Translation
            </label>
            <textarea
              value={formData.example_translation}
              onChange={(e) => handleInputChange('example_translation', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-slate-200">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </motion.div>
  );
}
