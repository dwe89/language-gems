'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { EnhancedVocabularyService, EnhancedVocabularyList } from '../../../../services/enhancedVocabularyService';
import InlineVocabularyCreator from '../../../../components/vocabulary/InlineVocabularyCreator';

export default function EditVocabularyPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  const [vocabularyService, setVocabularyService] = useState<EnhancedVocabularyService | null>(null);
  const [vocabularyList, setVocabularyList] = useState<EnhancedVocabularyList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize service
  useEffect(() => {
    if (supabase) {
      setVocabularyService(new EnhancedVocabularyService(supabase));
    }
  }, [supabase]);

  // Load vocabulary list
  useEffect(() => {
    if (vocabularyService && params.id && user) {
      loadVocabularyList();
    }
  }, [vocabularyService, params.id, user]);

  const loadVocabularyList = async () => {
    if (!vocabularyService || !params.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const list = await vocabularyService.getVocabularyList(params.id as string);
      
      if (!list) {
        setError('Vocabulary list not found');
        return;
      }
      
      // Check if user owns this list
      if (list.teacher_id !== user?.id) {
        setError('You do not have permission to edit this vocabulary list');
        return;
      }
      
      setVocabularyList(list);
    } catch (error) {
      console.error('Error loading vocabulary list:', error);
      setError('Failed to load vocabulary list');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    router.push('/dashboard/vocabulary');
  };

  const handleClose = () => {
    router.push('/dashboard/vocabulary');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading vocabulary list...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Vocabulary
          </button>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-red-600 text-lg font-medium mb-2">Error</div>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Return to Vocabulary
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!vocabularyList) {
    return null;
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Content Collection</h1>
          <p className="text-gray-600 mt-2">Update your vocabulary or sentence collection: {vocabularyList.name}</p>
        </div>

        {/* Vocabulary Editor */}
        <InlineVocabularyCreator
          onClose={handleClose}
          onSuccess={handleSuccess}
          initialData={{
            id: vocabularyList.id,
            name: vocabularyList.name,
            description: vocabularyList.description,
            language: vocabularyList.language,
            theme: vocabularyList.theme,
            topic: vocabularyList.topic,
            difficulty_level: vocabularyList.difficulty_level,
            content_type: vocabularyList.content_type,
            is_public: vocabularyList.is_public,
            folder_id: vocabularyList.folder_id,
            items: vocabularyList.items?.map(item => ({
              id: item.id,
              learningWord: item.term,
              supportWord: item.translation,
              partOfSpeech: item.part_of_speech || 'noun',
              contextSentence: item.context_sentence,
              contextTranslation: item.context_translation,
              difficultyLevel: item.difficulty_level,
              notes: item.notes,
              tags: item.tags || []
            })) || []
          }}
          mode="edit"
        />
      </div>
    </div>
  );
}
