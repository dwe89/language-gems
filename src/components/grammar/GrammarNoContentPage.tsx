'use client';

import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, Edit } from 'lucide-react';
import Link from 'next/link';
import { GemCard } from '@/components/ui/GemTheme';
import GrammarPageEditModal from '@/components/admin/GrammarPageEditModal';

interface GrammarNoContentPageProps {
  params: {
    language: string;
    category: string;
    topic: string;
  };
  isAdmin: boolean;
}

export function GrammarNoContentPage({ params, isAdmin }: GrammarNoContentPageProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  // Format topic name for display
  const formatTopicName = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const topicName = formatTopicName(params.topic);
  const categoryName = formatTopicName(params.category);
  const languageName = params.language.charAt(0).toUpperCase() + params.language.slice(1);

  // Create initial empty page data for admin
  const emptyPageData = {
    language: params.language,
    category: params.category,
    topic_slug: params.topic,
    title: topicName,
    description: `Learn about ${topicName} in ${languageName}`,
    difficulty: 'beginner' as const,
    estimated_time: 10,
    sections: [],
    related_topics: [],
    youtube_video_id: null,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href={`/grammar/${params.language}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {languageName} Grammar
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <GemCard className="text-center py-16">
            <AlertCircle className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
            
            {isAdmin ? (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  No Content Yet
                </h1>
                <p className="text-xl text-gray-600 mb-2">
                  <strong>{topicName}</strong>
                </p>
                <p className="text-gray-500 mb-8">
                  {categoryName} • {languageName}
                </p>
                <p className="text-gray-600 mb-8">
                  This page exists in the index but has no content yet. Click below to add content.
                </p>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Edit className="w-5 h-5" />
                  Add Content to This Page
                </button>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Content Coming Soon
                </h1>
                <p className="text-xl text-gray-600 mb-2">
                  <strong>{topicName}</strong>
                </p>
                <p className="text-gray-500 mb-8">
                  {categoryName} • {languageName}
                </p>
                <p className="text-gray-600 mb-8">
                  This grammar topic is being prepared. Check back soon for comprehensive lessons and exercises!
                </p>
                <Link
                  href={`/grammar/${params.language}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Browse Other Topics
                </Link>
              </>
            )}
          </GemCard>
        </div>
      </div>

      {/* Admin Edit Modal */}
      {isAdmin && showEditModal && (
        <GrammarPageEditModal
          pageId="new"
          language={params.language}
          category={params.category}
          topic={params.topic}
          initialData={emptyPageData}
          onClose={() => setShowEditModal(false)}
          onSave={() => {
            setShowEditModal(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

