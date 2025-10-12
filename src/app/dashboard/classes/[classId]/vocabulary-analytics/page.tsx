'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSupabase } from '@/components/supabase/SupabaseProvider';
import { Brain, TrendingUp, TrendingDown, Target, Download, Send, ArrowLeft, Search, Filter } from 'lucide-react';
import Link from 'next/link';

interface StudentWordAnalytics {
  student_id: string;
  student_name: string;
  student_email: string;
  vocabulary_id: string;
  word: string;
  translation: string;
  total_exposures: number;
  correct_count: number;
  incorrect_count: number;
  accuracy_percentage: number;
  mastery_level: string;
  topic: string;
  subtopic: string;
  seen_in_vocab_master: boolean;
  seen_in_games: boolean;
  seen_in_assignments: string[];
  last_seen: string;
}

interface TopicAnalytics {
  student_id: string;
  student_name: string;
  topic: string;
  total_words: number;
  average_accuracy: number;
  mastered_count: number;
  struggling_count: number;
}

export default function VocabularyAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const { supabase } = useSupabase();
  const classId = params.classId as string;

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [wordAnalytics, setWordAnalytics] = useState<StudentWordAnalytics[]>([]);
  const [topicAnalytics, setTopicAnalytics] = useState<TopicAnalytics[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMastery, setFilterMastery] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'accuracy' | 'exposures' | 'recent'>('accuracy');

  // Fetch class students
  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from('class_students')
        .select(`
          student_id,
          profiles:student_id (
            id,
            full_name,
            email
          )
        `)
        .eq('class_id', classId);

      if (!error && data) {
        setStudents(data.map(s => s.profiles).filter(Boolean));
      }
      setLoading(false);
    };

    fetchStudents();
  }, [classId, supabase]);

  // Fetch word-level analytics for selected student
  useEffect(() => {
    if (!selectedStudent) return;

    const fetchWordAnalytics = async () => {
      setLoading(true);

      // Use the teacher view for easy querying
      const { data, error } = await supabase
        .from('teacher_student_word_mastery')
        .select('*')
        .eq('student_id', selectedStudent);

      if (!error && data) {
        setWordAnalytics(data);
      }

      setLoading(false);
    };

    fetchWordAnalytics();
  }, [selectedStudent, supabase]);

  // Fetch topic analytics for selected student
  useEffect(() => {
    if (!selectedStudent) return;

    const fetchTopicAnalytics = async () => {
      const { data, error } = await supabase
        .from('teacher_topic_analysis')
        .select('*')
        .eq('student_id', selectedStudent)
        .order('average_accuracy', { ascending: false });

      if (!error && data) {
        setTopicAnalytics(data);
      }
    };

    fetchTopicAnalytics();
  }, [selectedStudent, supabase]);

  // Filter and sort word analytics
  const filteredWords = wordAnalytics
    .filter(word => {
      // Search filter
      if (searchTerm && !word.word?.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !word.translation?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Mastery filter
      if (filterMastery !== 'all' && word.mastery_level !== filterMastery) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'accuracy':
          return a.accuracy_percentage - b.accuracy_percentage;
        case 'exposures':
          return b.total_exposures - a.total_exposures;
        case 'recent':
          return new Date(b.last_seen).getTime() - new Date(a.last_seen).getTime();
        default:
          return 0;
      }
    });

  // Export to CSV
  const handleExport = () => {
    const csv = [
      ['Word', 'Translation', 'Total Exposures', 'Correct', 'Incorrect', 'Accuracy %', 'Mastery Level', 'Topic', 'Last Seen'],
      ...filteredWords.map(w => [
        w.word,
        w.translation,
        w.total_exposures,
        w.correct_count,
        w.incorrect_count,
        w.accuracy_percentage.toFixed(1),
        w.mastery_level,
        w.topic,
        new Date(w.last_seen).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vocabulary-analytics-${selectedStudent}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Send struggling words to VocabMaster
  const handleSendToVocabMaster = async () => {
    const strugglingWords = filteredWords.filter(w => w.mastery_level === 'struggling');
    
    if (strugglingWords.length === 0) {
      alert('No struggling words found for this student.');
      return;
    }

    // TODO: Create VocabMaster assignment with struggling words
    alert(`Would create VocabMaster assignment with ${strugglingWords.length} struggling words`);
  };

  if (loading && students.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/dashboard/classes/${classId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Class
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Brain className="h-8 w-8 text-indigo-600" />
                Vocabulary Analytics
              </h1>
              <p className="text-gray-600 mt-2">
                Word-level insights powered by unified analytics
              </p>
            </div>
          </div>
        </div>

        {/* Student Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Student
          </label>
          <select
            value={selectedStudent || ''}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a student...</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.full_name} ({student.email})
              </option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <>
            {/* Topic Analysis Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {topicAnalytics.slice(0, 3).map((topic, index) => (
                <div key={topic.topic} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{topic.topic}</h3>
                    {index === 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : index === topicAnalytics.length - 1 ? (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    ) : (
                      <Target className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Accuracy:</span>
                      <span className="font-semibold">{topic.average_accuracy.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Words:</span>
                      <span className="font-semibold">{topic.total_words}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mastered:</span>
                      <span className="font-semibold text-green-600">{topic.mastered_count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Struggling:</span>
                      <span className="font-semibold text-red-600">{topic.struggling_count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Word-Level Analytics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Filters and Actions */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search words..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <select
                  value={filterMastery}
                  onChange={(e) => setFilterMastery(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Mastery Levels</option>
                  <option value="new">New</option>
                  <option value="learning">Learning</option>
                  <option value="practiced">Practiced</option>
                  <option value="mastered">Mastered</option>
                  <option value="struggling">Struggling</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="accuracy">Sort by Accuracy</option>
                  <option value="exposures">Sort by Exposures</option>
                  <option value="recent">Sort by Recent</option>
                </select>

                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>

                <button
                  onClick={handleSendToVocabMaster}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send to VocabMaster
                </button>
              </div>

              {/* Word Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Word</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Translation</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Exposures</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Correct</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Accuracy</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Mastery</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredWords.map((word, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{word.word || 'N/A'}</td>
                        <td className="px-4 py-3 text-gray-600">{word.translation || 'N/A'}</td>
                        <td className="px-4 py-3 text-center">{word.total_exposures}</td>
                        <td className="px-4 py-3 text-center">{word.correct_count}/{word.total_exposures}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-semibold ${
                            word.accuracy_percentage >= 80 ? 'text-green-600' :
                            word.accuracy_percentage >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {word.accuracy_percentage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            word.mastery_level === 'mastered' ? 'bg-green-100 text-green-800' :
                            word.mastery_level === 'practiced' ? 'bg-blue-100 text-blue-800' :
                            word.mastery_level === 'learning' ? 'bg-yellow-100 text-yellow-800' :
                            word.mastery_level === 'struggling' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {word.mastery_level}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {word.seen_in_vocab_master && <span className="mr-2">📚 VM</span>}
                          {word.seen_in_games && <span className="mr-2">🎮 Games</span>}
                          {word.seen_in_assignments?.length > 0 && <span>📝 Assignments</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredWords.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No vocabulary data found for this student.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

