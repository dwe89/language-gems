'use client';

import React, { useEffect, useState } from 'react';
import TeacherVocabularyAnalyticsDashboard from '../../../../components/teacher/TeacherVocabularyAnalyticsDashboard';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';

interface ClassOption { id: string; name: string }

export default function VocabularyAnalyticsPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('all');

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

        <div className="mb-6 flex items-center gap-3">
          <label className="text-sm text-gray-600">Filter by class</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white"
          >
            <option value="all">All classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <TeacherVocabularyAnalyticsDashboard classId={selectedClassId} />
      </div>
    </div>
  );
}
