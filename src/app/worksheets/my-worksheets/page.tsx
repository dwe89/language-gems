'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Clock, Target, Eye, Trash2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Worksheet {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: string;
  estimated_time_minutes: number;
  question_count: number;
  created_at: string;
  is_public: boolean;
}

export default function MyWorksheetsPage() {
  const router = useRouter();
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const supabase = createClient();

  useEffect(() => {
    loadWorksheets();
  }, []);

  const loadWorksheets = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('worksheets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setWorksheets(data || []);
    } catch (err) {
      console.error('Error loading worksheets:', err);
      setError(err instanceof Error ? err.message : 'Failed to load worksheets');
    } finally {
      setLoading(false);
    }
  };

  const deleteWorksheet = async (id: string) => {
    if (!confirm('Are you sure you want to delete this worksheet?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('worksheets')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      setWorksheets(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      console.error('Error deleting worksheet:', err);
      setError('Failed to delete worksheet');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading worksheets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Worksheets</h1>
            <p className="text-slate-600 mt-2">Manage your generated worksheets</p>
          </div>
          <button
            onClick={() => router.push('/worksheets/create')}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Worksheet
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Worksheets Grid */}
        {worksheets.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No worksheets yet</h3>
            <p className="text-slate-600 mb-6">Create your first worksheet to get started</p>
            <button
              onClick={() => router.push('/worksheets/create')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2 inline" />
              Create Worksheet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {worksheets.map((worksheet) => (
              <div
                key={worksheet.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">
                        {worksheet.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {worksheet.subject} • {worksheet.topic}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 ml-4">
                      <button
                        onClick={() => router.push(`/worksheets/${worksheet.id}`)}
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View worksheet"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteWorksheet(worksheet.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete worksheet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <Target className="w-4 h-4 mr-2" />
                      <span>Difficulty: </span>
                      <span className="ml-1 capitalize font-medium">{worksheet.difficulty}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Est. Time: </span>
                      <span className="ml-1 font-medium">{worksheet.estimated_time_minutes} min</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>Questions: </span>
                      <span className="ml-1 font-medium">{worksheet.question_count}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500">
                      {new Date(worksheet.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => router.push(`/worksheets/${worksheet.id}`)}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
