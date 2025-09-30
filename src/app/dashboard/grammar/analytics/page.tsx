'use client';

import React from 'react';
import TeacherGrammarAnalyticsDashboard from '../../../../components/teacher/TeacherGrammarAnalyticsDashboard';

export default function GrammarAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Grammar Analytics</h1>
          <p className="mt-2 text-gray-600">
            Monitor student grammar progress and performance across your classes
          </p>
        </div>
        <TeacherGrammarAnalyticsDashboard />
      </div>
    </div>
  );
}

