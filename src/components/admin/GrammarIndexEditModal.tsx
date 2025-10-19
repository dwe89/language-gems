'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, FolderPlus } from 'lucide-react';

interface GrammarIndexEditModalProps {
  language: string;
  categories: Array<{
    name: string;
    key: string;
    topics: Array<{ name: string; slug: string; category: string }>;
  }>;
  onClose: () => void;
  onSave: () => void;
}

export default function GrammarIndexEditModal({
  language,
  categories,
  onClose,
  onSave,
}: GrammarIndexEditModalProps) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.key || '');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicSlug, setNewTopicSlug] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('beginner');
  const [curriculumLevel, setCurriculumLevel] = useState('KS3');
  const [saving, setSaving] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryKey, setNewCategoryKey] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('from-blue-500 to-blue-600');

  // Color options for categories
  const colorOptions = [
    { name: 'Blue', value: 'from-blue-500 to-blue-600' },
    { name: 'Purple', value: 'from-purple-500 to-purple-600' },
    { name: 'Green', value: 'from-green-500 to-green-600' },
    { name: 'Orange', value: 'from-orange-500 to-orange-600' },
    { name: 'Pink', value: 'from-pink-500 to-pink-600' },
    { name: 'Indigo', value: 'from-indigo-500 to-indigo-600' },
    { name: 'Yellow', value: 'from-yellow-500 to-yellow-600' },
    { name: 'Cyan', value: 'from-cyan-500 to-cyan-600' },
    { name: 'Red', value: 'from-red-500 to-red-600' },
    { name: 'Teal', value: 'from-teal-500 to-teal-600' },
  ];

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setNewTopicTitle(title);
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setNewTopicSlug(slug);
  };

  // Auto-generate category key from name
  const handleCategoryNameChange = (name: string) => {
    setNewCategoryName(name);
    const key = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setNewCategoryKey(key);
  };

  const handleAddTopic = async () => {
    if (!newTopicTitle || !newTopicSlug || !selectedCategory) {
      alert('Please fill in all fields');
      return;
    }

    setSaving(true);
    try {
      // Map language to code
      const languageCodeMap: Record<string, string> = {
        spanish: 'es',
        french: 'fr',
        german: 'de',
      };
      const languageCode = languageCodeMap[language] || language;

      // Create grammar_topics entry
      const topicResponse = await fetch('/api/admin/grammar/topics/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: languageCode,
          category: selectedCategory,
          slug: newTopicSlug,
          title: newTopicTitle,
          difficulty_level: difficultyLevel,
          curriculum_level: curriculumLevel,
        }),
      });

      if (!topicResponse.ok) {
        const errorData = await topicResponse.json();
        throw new Error(errorData.error || 'Failed to create topic');
      }

      const topicData = await topicResponse.json();

      // Create grammar_pages entry
      const pageResponse = await fetch('/api/admin/grammar/pages/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: language,
          category: selectedCategory,
          topic_slug: newTopicSlug,
          title: newTopicTitle,
          description: `Learn about ${newTopicTitle} in ${language.charAt(0).toUpperCase() + language.slice(1)}`,
          difficulty: 'beginner',
          estimated_time: 10,
          sections: [],
          related_topics: [],
        }),
      });

      if (!pageResponse.ok) {
        throw new Error('Failed to create page');
      }

      alert(`✅ Successfully created "${newTopicTitle}"!`);
      setNewTopicTitle('');
      setNewTopicSlug('');
      onSave();
    } catch (error) {
      console.error('Error creating topic:', error);
      alert('❌ Failed to create topic');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTopic = async (topicSlug: string, topicName: string) => {
    if (!confirm(`Are you sure you want to delete "${topicName}"? This will remove the topic from the index but NOT delete the page content.`)) {
      return;
    }

    setSaving(true);
    try {
      const languageCodeMap: Record<string, string> = {
        spanish: 'es',
        french: 'fr',
        german: 'de',
      };
      const languageCode = languageCodeMap[language] || language;

      const response = await fetch('/api/admin/grammar/topics/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: languageCode,
          category: selectedCategory,
          slug: topicSlug,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete topic');
      }

      alert(`✅ Successfully deleted "${topicName}"!`);
      onSave();
    } catch (error) {
      console.error('Error deleting topic:', error);
      alert('❌ Failed to delete topic');
    } finally {
      setSaving(false);
    }
  };

  const selectedCategoryData = categories.find(c => c.key === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Manage Grammar Topics</h2>
            <p className="text-blue-100 text-sm mt-1">
              {language.charAt(0).toUpperCase() + language.slice(1)} Grammar
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Create New Category Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <FolderPlus className="w-4 h-4" />
              {showCategoryForm ? 'Cancel' : 'Create New Category'}
            </button>
          </div>

          {/* Create New Category Form */}
          {showCategoryForm && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-indigo-600" />
                Create New Category
              </h3>

              <div className="space-y-4">
                {/* Category Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => handleCategoryNameChange(e.target.value)}
                    placeholder="e.g., Conjunctions"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Category Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Key (auto-generated)
                  </label>
                  <input
                    type="text"
                    value={newCategoryKey}
                    onChange={(e) => setNewCategoryKey(e.target.value)}
                    placeholder="e.g., conjunctions"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                  />
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Color
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setNewCategoryColor(color.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          newCategoryColor === color.value
                            ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105'
                            : 'hover:scale-105'
                        } bg-gradient-to-r ${color.value} text-white`}
                      >
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Creating a category only adds it to the CATEGORY_CONFIG in SpanishGrammarClient.tsx.
                    You'll need to manually update the code to make it permanent.
                  </p>
                </div>

                {/* Create Button */}
                <button
                  onClick={() => {
                    alert(`Category "${newCategoryName}" would be created with key "${newCategoryKey}" and color "${newCategoryColor}". Please manually add this to CATEGORY_CONFIG in SpanishGrammarClient.tsx.`);
                    setShowCategoryForm(false);
                    setNewCategoryName('');
                    setNewCategoryKey('');
                  }}
                  disabled={!newCategoryName || !newCategoryKey}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Show Category Config
                </button>
              </div>
            </div>
          )}

          {/* Add New Topic */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600" />
              Add New Topic
            </h3>

            <div className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic Title
                </label>
                <input
                  type="text"
                  value={newTopicTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Adjective Agreement"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Topic Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug (auto-generated)
                </label>
                <input
                  type="text"
                  value={newTopicSlug}
                  onChange={(e) => setNewTopicSlug(e.target.value)}
                  placeholder="e.g., adjective-agreement"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL: /grammar/{language}/{selectedCategory}/{newTopicSlug}
                </p>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Curriculum Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Curriculum Level
                </label>
                <select
                  value={curriculumLevel}
                  onChange={(e) => setCurriculumLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="KS3">KS3</option>
                  <option value="KS4">KS4</option>
                </select>
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddTopic}
                disabled={saving || !newTopicTitle || !newTopicSlug}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Creating...' : 'Add Topic'}
              </button>
            </div>
          </div>

          {/* Existing Topics */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Existing Topics in {selectedCategoryData?.name}
            </h3>

            {selectedCategoryData && selectedCategoryData.topics.length > 0 ? (
              <div className="space-y-2">
                {selectedCategoryData.topics.map((topic) => (
                  <div
                    key={topic.slug}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{topic.name}</h4>
                      <p className="text-sm text-gray-500 font-mono">{topic.slug}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteTopic(topic.slug, topic.name)}
                      disabled={saving}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete topic"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No topics in this category yet
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

