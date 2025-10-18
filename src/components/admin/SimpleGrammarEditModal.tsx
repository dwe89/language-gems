'use client';

import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

interface SimpleGrammarEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
  category: string;
  topicSlug: string;
  initialData: {
    title: string;
    description: string;
    difficulty: string;
    estimated_time: number;
    youtube_video_id?: string | null;
    sections: any[];
  };
}

export default function SimpleGrammarEditModal({
  isOpen,
  onClose,
  language,
  category,
  topicSlug,
  initialData,
}: SimpleGrammarEditModalProps) {
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [difficulty, setDifficulty] = useState(initialData.difficulty);
  const [estimatedTime, setEstimatedTime] = useState(initialData.estimated_time);
  const [youtubeVideoId, setYoutubeVideoId] = useState(initialData.youtube_video_id || '');
  const [sectionsJson, setSectionsJson] = useState(JSON.stringify(initialData.sections, null, 2));

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validate JSON
      let parsedSections;
      try {
        parsedSections = JSON.parse(sectionsJson);
      } catch (e) {
        alert('Invalid JSON in sections field');
        setSaving(false);
        return;
      }

      const updates = {
        title,
        description,
        difficulty,
        estimated_time: estimatedTime,
        youtube_video_id: youtubeVideoId || null,
        sections: parsedSections,
      };

      const response = await fetch('/api/admin/grammar/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          category,
          topic_slug: topicSlug,
          updates,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update');
      }

      // Show success toast
      alert('✅ Page edited successfully!');
      
      // Reload the page to show changes
      window.location.reload();
    } catch (err: any) {
      alert('❌ Error: ' + err.message);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Edit Grammar Page</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Difficulty & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time (minutes)
                </label>
                <input
                  type="number"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* YouTube Video ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube Video ID
              </label>
              <input
                type="text"
                value={youtubeVideoId}
                onChange={(e) => setYoutubeVideoId(e.target.value)}
                placeholder="e.g., EGaSgIRswcI"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sections JSON */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sections (JSON)
              </label>
              <textarea
                value={sectionsJson}
                onChange={(e) => setSectionsJson(e.target.value)}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

