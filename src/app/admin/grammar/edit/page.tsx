'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Save, X, ArrowLeft } from 'lucide-react';

interface GrammarPageData {
  title: string;
  description: string;
  difficulty: string;
  estimated_time: number;
  youtube_video_id?: string | null;
  sections: any[];
  related_topics?: any[] | null;
  practice_url?: string | null;
  quiz_url?: string | null;
}

export default function GrammarEditPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const language = searchParams.get('language');
  const category = searchParams.get('category');
  const topic = searchParams.get('topic');

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<GrammarPageData | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [youtubeVideoId, setYoutubeVideoId] = useState('');
  const [sectionsJson, setSectionsJson] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!language || !category || !topic) {
      setError('Missing required parameters');
      setLoading(false);
      return;
    }

    fetchGrammarPage();
  }, [mounted, language, category, topic]);

  const fetchGrammarPage = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      const { data: page, error: fetchError } = await supabase
        .from('grammar_pages')
        .select('*')
        .eq('language', language)
        .eq('category', category)
        .eq('topic_slug', topic)
        .single();

      if (fetchError) throw fetchError;

      setData(page);
      setTitle(page.title);
      setDescription(page.description);
      setDifficulty(page.difficulty);
      setEstimatedTime(page.estimated_time);
      setYoutubeVideoId(page.youtube_video_id || '');
      setSectionsJson(JSON.stringify(page.sections, null, 2));
    } catch (err: any) {
      console.error('Error fetching grammar page:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Validate JSON
      let parsedSections;
      try {
        parsedSections = JSON.parse(sectionsJson);
      } catch (e) {
        throw new Error('Invalid JSON in sections field');
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
          topic_slug: topic,
          updates,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update grammar page');
      }

      setSuccess(true);
      // Refresh the data to show updated content
      await fetchGrammarPage();
    } catch (err: any) {
      console.error('Error saving grammar page:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to page
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Grammar Page</h1>
          <p className="text-gray-600 mt-2">
            {language} / {category} / {topic}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">✅ Changes saved successfully!</p>
            <a
              href={`/grammar-v2/${language}/${category}/${topic}`}
              className="text-green-700 underline text-sm mt-2 inline-block"
            >
              View updated page →
            </a>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">❌ {error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Estimated Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Time (minutes)
            </label>
            <input
              type="number"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* YouTube Video ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube Video ID (optional)
            </label>
            <input
              type="text"
              value={youtubeVideoId}
              onChange={(e) => setYoutubeVideoId(e.target.value)}
              placeholder="e.g., EGaSgIRswcI"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sections (JSON) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sections (JSON)
            </label>
            <textarea
              value={sectionsJson}
              onChange={(e) => setSectionsJson(e.target.value)}
              rows={20}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              spellCheck={false}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>

            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

