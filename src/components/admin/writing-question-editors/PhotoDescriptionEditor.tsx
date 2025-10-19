'use client';

import React, { useState } from 'react';
import { Upload, Image as ImageIcon, X, Loader } from 'lucide-react';
import type { AQAWritingQuestion, PhotoDescriptionData } from '@/types/aqa-writing-admin';

interface PhotoDescriptionEditorProps {
  question: AQAWritingQuestion;
  onUpdate: (updates: Partial<AQAWritingQuestion>) => void;
}

export default function PhotoDescriptionEditor({ question, onUpdate }: PhotoDescriptionEditorProps) {
  const data = question.question_data as PhotoDescriptionData;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const updateData = (updates: Partial<PhotoDescriptionData>) => {
    onUpdate({
      question_data: { ...data, ...updates },
    });
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/aqa-writing/upload-photo', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        updateData({ photoUrl: result.photoUrl });
      } else {
        setUploadError(result.error || 'Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setUploadError('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = () => {
    updateData({ photoUrl: '' });
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>Q1: Photo Description</strong> - Students write 5 sentences describing the photo.
        </p>
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Photo</label>
        
        {data.photoUrl ? (
          <div className="relative">
            <img
              src={data.photoUrl}
              alt="Question photo"
              className="w-full max-w-md rounded-lg border-2 border-gray-300"
            />
            <button
              onClick={removePhoto}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                {isUploading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </>
                )}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handlePhotoUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">
              JPEG, PNG, or WebP • Max 5MB
            </p>
          </div>
        )}

        {uploadError && (
          <p className="text-sm text-red-600 mt-2">{uploadError}</p>
        )}
      </div>

      {/* Optional Photo Prompt */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Photo Prompt (Optional)
        </label>
        <input
          type="text"
          value={data.photoPrompt || ''}
          onChange={(e) => updateData({ photoPrompt: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Describe what you see in the photo"
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional additional context or instructions for the photo
        </p>
      </div>
    </div>
  );
}

