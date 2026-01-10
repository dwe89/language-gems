'use client';

import React, { useEffect, useState } from 'react';
import TeacherVocabularyAnalyticsDashboard from '../../../../components/teacher/TeacherVocabularyAnalyticsDashboard';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { Info, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ClassOption { id: string; name: string }

type TimeRange = 'all_time' | 'last_7_days' | 'last_30_days' | 'current_term';
type VocabularySource = 'all' | 'centralized' | 'custom';

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 'all_time', label: 'All Time' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'current_term', label: 'This Term' },
];

const VOCABULARY_SOURCE_OPTIONS: { value: VocabularySource; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All Vocabulary', icon: <BookOpen className="h-4 w-4" /> },
  { value: 'centralized', label: 'Curriculum', icon: <BookOpen className="h-4 w-4" /> },
  { value: 'custom', label: 'My Custom Lists', icon: <Sparkles className="h-4 w-4" /> },
];

function getDateRangeFromTimeRange(timeRange: TimeRange): { from: string; to: string } | undefined {
  if (timeRange === 'all_time') return undefined;
  const now = new Date();
  const to = now.toISOString().split('T')[0];
  let from: Date;
  switch (timeRange) {
    case 'last_7_days':
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'last_30_days':
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'current_term':
      from = new Date(now.getTime() - 84 * 24 * 60 * 60 * 1000);
      break;
    default:
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  return { from: from.toISOString().split('T')[0], to };
}

export default function VocabularyAnalyticsPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<TimeRange>('all_time');
  const [vocabularySource, setVocabularySource] = useState<VocabularySource>('all');

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('classes')
        .select('id, name')
        .eq('teacher_id', user.id)
        .order('name');
      if (!error && data) setClasses(data as ClassOption[]);
    };
    load();
  }, [user, supabase]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Vocabulary Analytics</h1>
          <p className="mt-2 text-gray-600">
            Monitor student vocabulary progress and performance across your classes
          </p>
        </div>

        {/* Cross-Class Info Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Cross-Class Analytics</h3>
              <p className="text-sm text-blue-800">
                This page shows vocabulary data across all your classes. To view analytics for a specific class,
                go to <Link href="/dashboard/classes" className="font-semibold underline hover:text-blue-900">Classes</Link>,
                select a class, and click the <strong>Vocabulary</strong> tab.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            {/* Class Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Class</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All classes</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Time Range Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Time period</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {TIME_RANGE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Vocabulary Source Filter - NEW */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Vocabulary</label>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                {VOCABULARY_SOURCE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setVocabularySource(opt.value)}
                    className={`px-3 py-2 text-sm flex items-center gap-1.5 transition-colors ${vocabularySource === opt.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                      } ${opt.value !== 'all' ? 'border-l border-gray-300' : ''}`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Vocabulary Info */}
          {vocabularySource === 'custom' && (
            <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-purple-800 text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Showing progress for vocabulary from your custom lists created in <Link href="/vocabulary/new" className="underline font-semibold">My Vocabulary</Link></span>
              </div>
            </div>
          )}
        </div>

        <TeacherVocabularyAnalyticsDashboard
          classId={selectedClassId}
          dateRange={getDateRangeFromTimeRange(timeRange)}
          vocabularySource={vocabularySource}
        />
      </div>
    </div>
  );
}

