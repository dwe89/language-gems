'use client';

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import InlineVocabularyCreator from '../../../components/vocabulary/InlineVocabularyCreator';

import AIVocabularyUpload from '../../../components/vocabulary/AIVocabularyUpload';

export default function NewVocabularyPage() {
  const router = useRouter();
  const [uploadMethod, setUploadMethod] = useState<'manual' | 'ai'>('ai');

  const handleSuccess = () => {
    router.push('/dashboard/vocabulary');
  };

  const handleClose = () => {
    router.push('/dashboard/vocabulary');
  };

  const handleAIUploadComplete = (items: any[]) => {
    // Handle the completed AI upload
    console.log('AI upload completed with', items.length, 'items');
    // You could redirect to a success page or show a success message
    handleSuccess();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Vocabulary
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Vocabulary Collection</h1>
          <p className="text-gray-600 mt-2">Build an interactive vocabulary collection for your students</p>
        </div>

        {/* AI Categorization Explanation */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">✨</span>
            <h3 className="text-lg font-semibold text-gray-900">
              Smart Vocabulary Analytics System
            </h3>
          </div>
          <p className="text-gray-700">
            LanguageGems automatically categorizes your custom vocabulary to maintain full analytics capabilities.
            Our hybrid approach ensures accurate categorization while keeping costs minimal.
          </p>
        </div>

        {/* Upload Method Selection */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Upload Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setUploadMethod('ai')}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                uploadMethod === 'ai'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className={`h-6 w-6 ${uploadMethod === 'ai' ? 'text-purple-600' : 'text-gray-400'}`} />
                <span className="font-semibold text-gray-900">Smart AI Upload (Recommended)</span>
              </div>
              <p className="text-sm text-gray-600">
                Bulk upload with automatic categorization. Perfect for large vocabulary lists.
                AI matches existing database first, then categorizes unknown words.
              </p>
              <div className="mt-2 text-xs text-green-600">
                ✓ Automatic categorization ✓ Bulk upload ✓ Full analytics
              </div>
            </button>

            <button
              onClick={() => setUploadMethod('manual')}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                uploadMethod === 'manual'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Upload className={`h-6 w-6 ${uploadMethod === 'manual' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="font-semibold text-gray-900">Manual Entry</span>
              </div>
              <p className="text-sm text-gray-600">
                Add vocabulary items one by one with full control over categorization.
                Best for small lists or when you want complete manual control.
              </p>
              <div className="mt-2 text-xs text-blue-600">
                ✓ Full control ✓ Detailed input ✓ Custom categories
              </div>
            </button>
          </div>
        </div>

        {/* Content based on selected method */}
        {uploadMethod === 'ai' ? (
          <AIVocabularyUpload
            onUploadComplete={handleAIUploadComplete}
            language="spanish"
          />
        ) : (
          <InlineVocabularyCreator
            onClose={handleClose}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
}
