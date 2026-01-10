'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import InlineVocabularyCreator from '../../../components/vocabulary/InlineVocabularyCreator';

export default function NewVocabularyPage() {
  const router = useRouter();

  const handleSuccess = () => {
    console.log('✅ [VOCABULARY] Vocabulary saved successfully, redirecting and refreshing...');
    router.push('/dashboard/vocabulary');
    router.refresh(); // Force refresh the page to show new data
  };

  const handleClose = () => {
    router.push('/dashboard/vocabulary');
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
          <h1 className="text-3xl font-bold text-gray-900">Create New Content Collection</h1>
          <p className="text-gray-600 mt-2">Build interactive vocabulary or sentence collections for your students</p>
        </div>

        {/* Content Creation Info */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">✨</span>
            <h3 className="text-lg font-semibold text-gray-900">
              Create Custom Vocabulary &amp; Sentence Collections
            </h3>
          </div>
          <p className="text-gray-700">
            Build personalized vocabulary or sentence collections for your students. Add words or sentences manually 
            with full control over the content and structure. Perfect for creating targeted learning materials.
          </p>
        </div>

        {/* Content */}
        <InlineVocabularyCreator
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
