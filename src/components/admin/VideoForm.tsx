'use client';

import React, { useState, useEffect } from 'react';

import { 
  Save, 
  X, 
  ExternalLink, 
  BookOpen, 
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { VOCABULARY_CATEGORIES } from '@/components/games/ModernCategorySelector';
import { GRAMMAR_CATEGORIES } from '@/lib/grammar-categories';

interface YouTubeVideo {
  id?: string;
  title: string;
  youtube_id: string;
  language: string;
  level: string;
  theme?: string;
  topic?: string;
  subtopic?: string;
  description?: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  vocabulary_count?: number;
  is_featured: boolean;
  is_active: boolean;
}

interface VideoFormProps {
  video?: YouTubeVideo | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function VideoForm({ video, onSave, onCancel }: VideoFormProps) {
  const [formData, setFormData] = useState<YouTubeVideo>({
    title: '',
    youtube_id: '',
    language: 'es',
    level: 'beginner',
    theme: '',
    topic: '',
    subtopic: '',
    description: '',
    vocabulary_count: 0,
    is_featured: false,
    is_active: true
  });
  
  const [loading, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || '',
        youtube_id: video.youtube_id || '',
        language: video.language || 'es',
        level: video.level || 'beginner',
        theme: video.theme || '',
        topic: video.topic || '',
        subtopic: video.subtopic || '',
        description: video.description || '',
        vocabulary_count: video.vocabulary_count || 0,
        is_featured: video.is_featured || false,
        is_active: video.is_active !== undefined ? video.is_active : true
      });
    }
  }, [video]);

  const extractYouTubeId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  const fetchVideoInfo = async (youtubeId: string) => {
    try {
      // This would typically call YouTube API to get video info
      // For now, we'll generate thumbnail URL
      const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
      setFormData(prev => ({
        ...prev,
        thumbnail_url: thumbnailUrl
      }));
    } catch (error) {
      console.error('Error fetching video info:', error);
    }
  };

  const handleYouTubeIdChange = (value: string) => {
    const extractedId = extractYouTubeId(value);
    setFormData(prev => ({
      ...prev,
      youtube_id: extractedId
    }));
    
    if (extractedId && extractedId.length === 11) {
      fetchVideoInfo(extractedId);
    }
  };

  const getCurrentCategories = () => {
    if (formData.theme === 'vocabulary') return VOCABULARY_CATEGORIES;
    if (formData.theme === 'grammar') return GRAMMAR_CATEGORIES;
    return [];
  };

  const getCurrentSubcategories = () => {
    const categories = getCurrentCategories();
    const category = categories.find(cat => cat.id === formData.topic);
    return category?.subcategories || [];
  };

  const handleThemeChange = (theme: string) => {
    setFormData(prev => ({
      ...prev,
      theme,
      topic: '',
      subtopic: ''
    }));
  };

  const handleTopicChange = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topic,
      subtopic: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.youtube_id || !formData.language) {
        throw new Error('Please fill in all required fields');
      }

      const videoData = {
        ...formData,
        theme: formData.theme || null,
        topic: formData.topic || null,
        subtopic: formData.subtopic || null,
        description: formData.description || null,
        vocabulary_count: formData.vocabulary_count || 0,
        updated_at: new Date().toISOString()
      };

      if (video?.id) {
        // Update existing video
        const { error } = await supabase
          .from('youtube_videos')
          .update(videoData)
          .eq('id', video.id);

        if (error) throw error;
        setSuccess('Video updated successfully!');
      } else {
        // Create new video
        const { error } = await supabase
          .from('youtube_videos')
          .insert([videoData]);

        if (error) throw error;
        setSuccess('Video added successfully!');
      }

      // Call onSave immediately to refresh the list
      onSave();

    } catch (error: any) {
      setError(error.message || 'An error occurred while saving the video');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto" key={video?.id || 'new'}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {video?.id ? (
                <>
                  <Target className="w-5 h-5" />
                  Edit Video
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  Add New Video
                </>
              )}
            </CardTitle>
            <Button variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                <CheckCircle className="w-4 h-4" />
                {success}
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter video title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="youtube_id">YouTube URL or ID *</Label>
                  <Input
                    id="youtube_id"
                    value={formData.youtube_id}
                    onChange={(e) => handleYouTubeIdChange(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or video ID"
                    required
                  />
                  {formData.youtube_id && (
                    <div className="mt-2">
                      <a
                        href={`https://youtube.com/watch?v=${formData.youtube_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Preview on YouTube
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter video description"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {/* Thumbnail Preview */}
                {formData.youtube_id && (
                  <div>
                    <Label>Thumbnail Preview</Label>
                    <img
                      src={`https://img.youtube.com/vi/${formData.youtube_id}/mqdefault.jpg`}
                      alt="Video thumbnail"
                      className="w-full max-w-xs rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Language and Level */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="language">Language *</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="level">Level *</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="vocabulary_count">Vocabulary Count</Label>
                <Input
                  id="vocabulary_count"
                  type="number"
                  value={formData.vocabulary_count}
                  onChange={(e) => setFormData(prev => ({ ...prev, vocabulary_count: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Content Categorization</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={formData.theme} onValueChange={handleThemeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Theme</SelectItem>
                      <SelectItem value="vocabulary">Vocabulary</SelectItem>
                      <SelectItem value="grammar">Grammar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.theme && (
                  <div>
                    <Label htmlFor="topic">Category</Label>
                    <Select value={formData.topic} onValueChange={handleTopicChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Category</SelectItem>
                        {getCurrentCategories().map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.topic && getCurrentSubcategories().length > 0 && (
                  <div>
                    <Label htmlFor="subtopic">Subcategory</Label>
                    <Select value={formData.subtopic} onValueChange={(value) => setFormData(prev => ({ ...prev, subtopic: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Subcategory</SelectItem>
                        {getCurrentSubcategories().map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id}>
                            {subcategory.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Settings</h3>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="is_active" className="text-base font-medium">
                    Active Status
                  </Label>
                  <p className="text-sm text-gray-600">
                    Active videos are visible to users
                  </p>
                </div>
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: !!checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="is_featured" className="text-base font-medium">
                    Featured Video
                  </Label>
                  <p className="text-sm text-gray-600">
                    Featured videos appear prominently in listings
                  </p>
                </div>
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: !!checked }))}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    {video?.id ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {video?.id ? 'Update Video' : 'Add Video'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
