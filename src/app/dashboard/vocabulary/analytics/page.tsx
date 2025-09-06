'use client';

import React from 'react';
import TeacherVocabularyAnalyticsDashboard from '../../../../components/teacher/TeacherVocabularyAnalyticsDashboard';

export default function VocabularyAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Vocabulary Analytics</h1>
          <p className="mt-2 text-gray-600">
            Monitor student vocabulary progress and performance across your classes
          </p>
        </div>
        <TeacherVocabularyAnalyticsDashboard />
      </div>
    </div>
  );
}
