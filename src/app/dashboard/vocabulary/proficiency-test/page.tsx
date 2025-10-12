'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '../../../../lib/supabase-client';

interface WordProficiency {
  word: string;
  translation: string;
  accuracy: number;
  proficiency_level: 'struggling' | 'learning' | 'proficient';
  total_students: number;
  students_struggling: number;
  students_learning: number;
  students_proficient: number;
  total_encounters: number;
}

interface ProficiencySummary {
  proficiency_level: string;
  word_count: number;
  avg_accuracy: number;
  total_encounters: number;
}

export default function ProficiencyTestPage() {
  const [strugglingWords, setStrugglingWords] = useState<WordProficiency[]>([]);
  const [proficientWords, setProficientWords] = useState<WordProficiency[]>([]);
  const [summary, setSummary] = useState<ProficiencySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch struggling words
        const { data: struggling } = await supabase
          .from('teacher_vocabulary_proficiency')
          .select('*')
          .eq('proficiency_level', 'struggling')
          .order('accuracy', { ascending: true })
          .limit(10);

        // Fetch proficient words
        const { data: proficient } = await supabase
          .from('teacher_vocabulary_proficiency')
          .select('*')
          .eq('proficiency_level', 'proficient')
          .order('total_encounters', { ascending: false })
          .limit(10);

        // Fetch summary
        const { data: summaryData } = await supabase
          .rpc('get_proficiency_summary');

        setStrugglingWords(struggling || []);
        setProficientWords(proficient || []);
        setSummary(summaryData || []);
      } catch (error) {
        console.error('Error fetching proficiency data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getProficiencyBadge = (level: string) => {
    switch (level) {
      case 'struggling':
        return <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">🔴 Struggling</span>;
      case 'learning':
        return <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">🟡 Learning</span>;
      case 'proficient':
        return <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">🟢 Proficient</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vocabulary Proficiency Test</h1>
        <p className="text-gray-600 mb-8">Testing the new 3-tier proficiency system</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {summary.map((item) => (
            <div key={item.proficiency_level} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                {getProficiencyBadge(item.proficiency_level)}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Words:</span>
                  <span className="font-semibold">{item.word_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Accuracy:</span>
                  <span className="font-semibold">{item.avg_accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Encounters:</span>
                  <span className="font-semibold">{item.total_encounters}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Struggling Words */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            🔴 Most Challenging Words
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Word</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Translation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accuracy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proficiency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {strugglingWords.map((word, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{word.word}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{word.translation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2 max-w-[100px]">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${word.accuracy}%` }}
                          />
                        </div>
                        <span className="text-gray-900 font-medium">{word.accuracy}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getProficiencyBadge(word.proficiency_level)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="text-xs space-y-1">
                        <div>🔴 {word.students_struggling} struggling</div>
                        <div>🟡 {word.students_learning} learning</div>
                        <div>🟢 {word.students_proficient} proficient</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Proficient Words */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            🟢 Proficient Words
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Word</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Translation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accuracy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proficiency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {proficientWords.map((word, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{word.word}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{word.translation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2 max-w-[100px]">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${word.accuracy}%` }}
                          />
                        </div>
                        <span className="text-gray-900 font-medium">{word.accuracy}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getProficiencyBadge(word.proficiency_level)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="text-xs space-y-1">
                        <div>🔴 {word.students_struggling} struggling</div>
                        <div>🟡 {word.students_learning} learning</div>
                        <div>🟢 {word.students_proficient} proficient</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

