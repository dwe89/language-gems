'use client';

import React from 'react';
import TeacherGrammarAnalyticsDashboard from '../../../../components/teacher/TeacherGrammarAnalyticsDashboard';
import { Info } from 'lucide-react';
import Link from 'next/link';

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

        {/* Cross-Class Info Banner */}
        <div className="mb-6 bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-purple-900 mb-1">Cross-Class Analytics</h3>
              <p className="text-sm text-purple-800">
                This page shows grammar data across all your classes. To view analytics for a specific class,
                go to <Link href="/dashboard/classes" className="font-semibold underline hover:text-purple-900">Classes</Link>,
                select a class, and click the <strong>Grammar</strong> tab.
              </p>
            </div>
          </div>
        </div>

        <TeacherGrammarAnalyticsDashboard />
      </div>
    </div>
  );
}

