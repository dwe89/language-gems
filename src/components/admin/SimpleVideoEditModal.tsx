'use client';

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabaseBrowser } from '@/components/auth/AuthProvider';
import { VOCABULARY_CATEGORIES } from '@/components/games/ModernCategorySelector';
import { GRAMMAR_CATEGORIES } from '@/lib/grammar-categories';

interface YouTubeVideo {
  id: string;
  title: string;
  youtube_id: string;
  language: string;
  level: string;
  theme: string;
  topic?: string; // Renamed from category to match database
  subtopic?: string; // Renamed from subcategory to match database
  description?: string;
  duration?: number;
  view_count?: number;
  vocabulary_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SimpleVideoEditModalProps {
  video: YouTubeVideo | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function SimpleVideoEditModal({ video, isOpen, onClose, onSave }: SimpleVideoEditModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    youtube_id: '',
    language: 'es',
    level: 'beginner',
    theme: '',
    category: '',
    subcategory: '',
    description: '',
    is_active: true
  });
  
  const [saving, setSaving] = useState(false);

  // Load video data when modal opens
  useEffect(() => {
    if (video && isOpen) {
      setFormData({
        title: video.title || '',
        youtube_id: video.youtube_id || '',
        language: video.language || 'es',
        level: video.level || 'beginner',
        theme: video.theme || '',
        category: video.topic || '', // Map topic to category for form
        subcategory: video.subtopic || '', // Map subtopic to subcategory for form
        description: video.description || '',
        is_active: video.is_active ?? true
      });
    }
  }, [video, isOpen]);

  const handleSave = async () => {
    if (!video) return;
    
    setSaving(true);
    try {
      console.log('Saving video:', video.id, formData);
      
      const { error } = await supabaseBrowser
        .from('youtube_videos')
        .update({
          title: formData.title,
          youtube_id: formData.youtube_id,
          language: formData.language,
          level: formData.level,
          theme: formData.theme,
          topic: formData.category, // Map category to topic column
          subtopic: formData.subcategory, // Map subcategory to subtopic column
          description: formData.description,
          is_active: formData.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', video.id);

      if (error) {
        console.error('Error updating video:', error);
        alert(`Error updating video: ${error.message}`);
        return;
      }

      console.log('Video updated successfully');
      onSave(); // Refresh the parent list
      onClose(); // Close modal
      
    } catch (error) {
      console.error('Error saving video:', error);
      alert(`Failed to save video: ${error}`);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !video) return null;

  const availableCategories = formData.theme === 'vocabulary' 
    ? VOCABULARY_CATEGORIES 
    : GRAMMAR_CATEGORIES;

  const availableSubcategories = availableCategories
    .find(cat => cat.id === formData.category)?.subcategories || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Video</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Video title"
            />
          </div>

          <div>
            <Label htmlFor="youtube_id">YouTube ID</Label>
            <Input
              id="youtube_id"
              value={formData.youtube_id}
              onChange={(e) => setFormData(prev => ({ ...prev, youtube_id: e.target.value }))}
              placeholder="YouTube video ID"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Language</Label>
              <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}>
                <SelectTrigger>
                  <SelectValue />
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
              <Label>Level</Label>
              <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Theme</Label>
            <Select value={formData.theme} onValueChange={(value) => setFormData(prev => ({ ...prev, theme: value, category: '', subcategory: '' }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vocabulary">Vocabulary</SelectItem>
                <SelectItem value="grammar">Grammar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.theme && (
            <div>
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value, subcategory: '' }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.category && availableSubcategories.length > 0 && (
            <div>
              <Label>Subcategory</Label>
              <Select value={formData.subcategory} onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubcategories.map((subcat) => (
                    <SelectItem key={subcat.id} value={subcat.id}>
                      {subcat.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Video description"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2 p-6 border-t">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
