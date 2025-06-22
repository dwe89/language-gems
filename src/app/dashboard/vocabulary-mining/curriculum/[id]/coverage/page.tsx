'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../../../components/supabase/SupabaseProvider';
import { VocabularyMiningService } from '../../../../../../services/vocabulary-mining';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  TrendingDown,
  Users,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  Star,
  Award,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface CurriculumCoverageProps {
  params: { id: string };
}

interface TopicCoverage {
  topicName: string;
  totalWords: number;
  studentsStarted: number;
  studentsCompleted: number;
  averageMastery: number;
  weakestWords: string[];
  strongestWords: string[];
}

interface StudentProgress {
  studentId: string;
  studentName: string;
  totalWordsAttempted: number;
  totalWordsMastered: number;
  topicProgress: { [topic: string]: number };
  overallMastery: number;
  lastActive: Date | null;
}

interface CurriculumSet {
  id: string;
  name: string;
  description: string;
  language: string;
  level: string;
  totalWords: number;
  topics: string[];
  themes: string[];
}

export default function CurriculumCoveragePage({ params }: CurriculumCoverageProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [miningService] = useState(() => new VocabularyMiningService(supabase));
  
  const [loading, setLoading] = useState(true);
  const [curriculumSet, setCurriculumSet] = useState<CurriculumSet | null>(null);
  const [topicCoverage, setTopicCoverage] = useState<TopicCoverage[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    if (user && params.id) {
      loadCurriculumData();
    }
  }, [user, params.id, selectedClass, selectedTopic]);

  const loadCurriculumData = async () => {
    try {
      setLoading(true);
      
      // Load curriculum set details
      const { data: curriculumData, error: curriculumError } = await supabase
        .from('curriculum_sets')
        .select('*')
        .eq('id', params.id)
        .eq('teacher_id', user?.id)
        .single();

      if (curriculumError) throw curriculumError;
      
      setCurriculumSet({
        id: curriculumData.id,
        name: curriculumData.name,
        description: curriculumData.description,
        language: curriculumData.language,
        level: curriculumData.level,
        totalWords: curriculumData.total_words,
        topics: curriculumData.topics || [],
        themes: curriculumData.themes || []
      });

      // Load teacher's classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id, name')
        .eq('teacher_id', user?.id);

      if (classesError) throw classesError;
      setClasses(classesData || []);

      // Load vocabulary items for this curriculum
      const { data: vocabularyData, error: vocabularyError } = await supabase
        .from('vocabulary_items')
        .select(`
          id, term, translation, topic_tags, theme_tags,
          vocabulary_lists!inner(curriculum_set_id)
        `)
        .eq('vocabulary_lists.curriculum_set_id', params.id);

      if (vocabularyError) throw vocabularyError;

      // Calculate topic coverage
      const topicCoverageMap = new Map<string, TopicCoverage>();
      
      // Initialize topics
      curriculumData.topics.forEach((topic: string) => {
        topicCoverageMap.set(topic, {
          topicName: topic,
          totalWords: 0,
          studentsStarted: 0,
          studentsCompleted: 0,
          averageMastery: 0,
          weakestWords: [],
          strongestWords: []
        });
      });

      // Count words per topic
      vocabularyData?.forEach(item => {
        const topics = item.topic_tags || [];
        topics.forEach((topic: string) => {
          const coverage = topicCoverageMap.get(topic);
          if (coverage) {
            coverage.totalWords++;
            topicCoverageMap.set(topic, coverage);
          }
        });
      });

      // Load student progress data
      // This would involve complex queries to get actual student progress
      // For now, we'll use mock data
      const mockStudentProgress: StudentProgress[] = [
        {
          studentId: 'student1',
          studentName: 'Alice Johnson',
          totalWordsAttempted: 150,
          totalWordsMastered: 120,
          topicProgress: { 'Family': 85, 'School': 92, 'Travel': 78 },
          overallMastery: 80,
          lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          studentId: 'student2',
          studentName: 'Bob Smith',
          totalWordsAttempted: 200,
          totalWordsMastered: 140,
          topicProgress: { 'Family': 70, 'School': 85, 'Travel': 65 },
          overallMastery: 70,
          lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ];

      setStudentProgress(mockStudentProgress);
      setTopicCoverage(Array.from(topicCoverageMap.values()));

    } catch (error) {
      console.error('Error loading curriculum coverage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading curriculum coverage...</p>
        </div>
      </div>
    );
  }

  if (!curriculumSet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Curriculum Not Found</h2>
          <p className="text-gray-600 mb-4">The requested curriculum set could not be found.</p>
          <Link
            href="/dashboard/vocabulary-mining/curriculum"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
          >
            Back to Curriculum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Link
                  href="/dashboard/vocabulary-mining/curriculum"
                  className="text-indigo-600 hover:text-indigo-800 mr-2"
                >
                  Curriculum
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600 ml-2">Coverage Tracking</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{curriculumSet.name}</h1>
              <p className="text-gray-600">{curriculumSet.description}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <span>{curriculumSet.level}</span>
                <span className="mx-2">•</span>
                <span>{curriculumSet.language}</span>
                <span className="mx-2">•</span>
                <span>{curriculumSet.totalWords} words</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
              <button
                onClick={loadCurriculumData}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
            
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Topics</option>
              {curriculumSet.topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Topics</p>
                <p className="text-2xl font-bold text-gray-900">{curriculumSet.topics.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">{studentProgress.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg Mastery</p>
                <p className="text-2xl font-bold text-gray-900">
                  {studentProgress.length > 0 
                    ? Math.round(studentProgress.reduce((sum, s) => sum + s.overallMastery, 0) / studentProgress.length)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Words Practiced</p>
                <p className="text-2xl font-bold text-gray-900">
                  {studentProgress.reduce((sum, s) => sum + s.totalWordsAttempted, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Topic Coverage */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Coverage</h3>
          <div className="space-y-4">
            {topicCoverage.map((topic) => (
              <div key={topic.topicName} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{topic.topicName}</h4>
                  <span className="text-sm text-gray-600">{topic.totalWords} words</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Students Started:</span>
                    <span className="ml-2 font-medium">{topic.studentsStarted}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Students Completed:</span>
                    <span className="ml-2 font-medium">{topic.studentsCompleted}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Avg Mastery:</span>
                    <span className={`ml-2 font-medium ${getProgressColor(topic.averageMastery)}`}>
                      {topic.averageMastery}%
                    </span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressBgColor(topic.averageMastery)}`}
                      style={{ width: `${topic.averageMastery}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Progress */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Progress</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 text-sm font-medium text-gray-600">Student</th>
                  <th className="py-2 text-sm font-medium text-gray-600">Words Attempted</th>
                  <th className="py-2 text-sm font-medium text-gray-600">Words Mastered</th>
                  <th className="py-2 text-sm font-medium text-gray-600">Overall Mastery</th>
                  <th className="py-2 text-sm font-medium text-gray-600">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {studentProgress.map((student) => (
                  <tr key={student.studentId} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="font-medium text-gray-900">{student.studentName}</div>
                    </td>
                    <td className="py-3 text-sm">{student.totalWordsAttempted}</td>
                    <td className="py-3 text-sm">
                      <span className="text-green-600 font-medium">{student.totalWordsMastered}</span>
                    </td>
                    <td className="py-3 text-sm">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressBgColor(student.overallMastery)}`}
                            style={{ width: `${student.overallMastery}%` }}
                          />
                        </div>
                        <span className={`font-medium ${getProgressColor(student.overallMastery)}`}>
                          {student.overallMastery}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {student.lastActive ? student.lastActive.toLocaleDateString() : 'Never'}
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
