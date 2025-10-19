'use client';

import React, { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface Section {
  heading: string;
  content: string;
}

interface GrammarPageEditModalProps {
  pageId: string; // 'new' for creating, actual ID for editing
  language: string;
  category: string;
  topic: string;
  initialData: {
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimated_time: number;
    youtube_video_id?: string | null;
    sections: Section[];
    related_topics?: string[];
  };
  onClose: () => void;
  onSave: () => void;
}

export default function GrammarPageEditModal({
  pageId,
  language,
  category,
  topic,
  initialData,
  onClose,
  onSave,
}: GrammarPageEditModalProps) {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [difficulty, setDifficulty] = useState(initialData.difficulty);
  const [estimatedTime, setEstimatedTime] = useState(initialData.estimated_time);
  const [youtubeVideoId, setYoutubeVideoId] = useState(initialData.youtube_video_id || '');
  const [sections, setSections] = useState<Section[]>(initialData.sections || []);
  const [saving, setSaving] = useState(false);

  const addSection = () => {
    setSections([...sections, { heading: '', content: '' }]);
  };

  const updateSection = (index: number, field: 'heading' | 'content', value: string) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const deleteSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const endpoint = pageId === 'new'
        ? '/api/admin/grammar/pages/create'
        : '/api/admin/grammar/pages/update';

      const payload = pageId === 'new'
        ? {
            language,
            category,
            topic_slug: topic,
            title,
            description,
            difficulty,
            estimated_time: estimatedTime,
            youtube_video_id: youtubeVideoId || null,
            sections,
            related_topics: [],
          }
        : {
            pageId,
            updates: {
              title,
              description,
              difficulty,
              estimated_time: estimatedTime,
              youtube_video_id: youtubeVideoId || null,
              sections,
              updated_at: new Date().toISOString(),
            },
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save page');
      }

      alert(pageId === 'new' ? '✅ Page created successfully!' : '✅ Page updated successfully!');
      onSave();
    } catch (error) {
      console.error('Error saving page:', error);
      alert('❌ Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">
              {pageId === 'new' ? 'Create Grammar Page' : 'Edit Grammar Page'}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {language} • {category} • {topic}
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
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Time (minutes)
              </label>
              <input
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video ID (optional)
              </label>
              <input
                type="text"
                value={youtubeVideoId}
                onChange={(e) => setYoutubeVideoId(e.target.value)}
                placeholder="e.g., dQw4w9WgXcQ"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sections */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Content Sections</h3>
              <button
                onClick={addSection}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Section
              </button>
            </div>

            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Section {index + 1}</h4>
                    <button
                      onClick={() => deleteSection(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Heading
                      </label>
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => updateSection(index, 'heading', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content (Markdown supported)
                      </label>
                      <textarea
                        value={section.content}
                        onChange={(e) => updateSection(index, 'content', e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {sections.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No sections yet. Click "Add Section" to create content.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Page'}
          </button>
        </div>
      </div>
    </div>
  );
}

