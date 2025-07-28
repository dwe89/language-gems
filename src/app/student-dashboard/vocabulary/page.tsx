'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useSupabase } from '../../../components/supabase/SupabaseProvider';
import Link from 'next/link';
import { 
  CheckCircle, XCircle, Clock, BookOpen, 
  BarChart2, Filter, Search, Calendar, 
  ListFilter, ArrowUpDown, PlayCircle
} from 'lucide-react';

// Proficiency level labels and colors
const proficiencyLevels = [
  { level: 0, label: 'Unknown', color: 'bg-gray-200', textColor: 'text-gray-800' },
  { level: 1, label: 'Seen', color: 'bg-red-200', textColor: 'text-red-800' },
  { level: 2, label: 'Recognized', color: 'bg-orange-200', textColor: 'text-orange-800' },
  { level: 3, label: 'Practiced', color: 'bg-yellow-200', textColor: 'text-yellow-800' },
  { level: 4, label: 'Mastered', color: 'bg-green-200', textColor: 'text-green-800' },
  { level: 5, label: 'Expert', color: 'bg-emerald-200', textColor: 'text-emerald-800' },
];

export default function VocabularyDashboard() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [vocabularyItems, setVocabularyItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [selectedProficiency, setSelectedProficiency] = useState('all');
  const [themes, setThemes] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'last_practiced', direction: 'desc' });
  const [stats, setStats] = useState({
    totalWords: 0,
    knownWords: 0,
    weakWords: 0,
    reviewDue: 0,
  });

  // Fetch vocabulary progress for the current user
  useEffect(() => {
    if (!user) return;

    const fetchVocabularyProgress = async () => {
      setLoading(true);
      
      try {
        // Query vocabulary practice data from the centralized table
        const { data: progressData, error } = await supabase
          .from('student_vocabulary_practice')
          .select(`
            id,
            vocabulary_id,
            mastery_level,
            correct_count,
            incorrect_count,
            last_practiced_at,
            next_review_at,
            centralized_vocabulary!inner(
              id,
              word,
              translation,
              example_sentence_original,
              example_sentence_translation,
              category,
              subcategory,
              difficulty_level,
              language
            )
          `)
          .eq('student_id', user.id);

        if (error) {
          console.error('Error fetching vocabulary progress:', error);
          return;
        }

        // Process and set vocabulary items
        const processedItems = progressData.map(item => ({
          progressId: item.id,
          vocabularyItemId: item.vocabulary_id,
          term: item.centralized_vocabulary.word,
          translation: item.centralized_vocabulary.translation,
          exampleSentence: item.centralized_vocabulary.example_sentence_original || '',
          exampleTranslation: item.centralized_vocabulary.example_sentence_translation || '',
          imageUrl: undefined, // Not available in centralized vocabulary
          audioUrl: undefined, // Not available in centralized vocabulary
          proficiencyLevel: item.mastery_level,
          correctAnswers: item.correct_count,
          incorrectAnswers: item.incorrect_count,
          lastPracticed: item.last_practiced_at,
          nextReview: item.next_review_at,
          listId: item.centralized_vocabulary.category,
          listName: item.centralized_vocabulary.category,
          themeId: item.centralized_vocabulary.category,
          topicId: item.centralized_vocabulary.subcategory,
          accuracy: item.correct_count + item.incorrect_count > 0
            ? Math.round((item.correct_count / (item.correct_count + item.incorrect_count)) * 100)
            : 0
        }));
        
        setVocabularyItems(processedItems);
        setFilteredItems(processedItems);
        
        // Extract unique themes
        const uniqueThemes = [...new Set(processedItems.map(item => item.themeId))];
        setThemes(uniqueThemes);
        
        // Calculate stats
        const totalWords = processedItems.length;
        const knownWords = processedItems.filter(item => item.proficiencyLevel >= 4).length;
        const weakWords = processedItems.filter(item => 
          item.accuracy < 70 && item.correctAnswers + item.incorrectAnswers > 0
        ).length;
        const reviewDue = processedItems.filter(item => 
          item.nextReview && new Date(item.nextReview) <= new Date()
        ).length;
        
        setStats({
          totalWords,
          knownWords,
          weakWords,
          reviewDue
        });
      } catch (error) {
        console.error('Error in vocabulary data processing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVocabularyProgress();
  }, [user, supabase]);

  // Apply filters
  useEffect(() => {
    if (!vocabularyItems.length) return;

    let filtered = [...vocabularyItems];
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.translation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply theme filter
    if (selectedTheme !== 'all') {
      filtered = filtered.filter(item => item.themeId === selectedTheme);
    }
    
    // Apply proficiency filter
    if (selectedProficiency !== 'all') {
      const profLevel = parseInt(selectedProficiency);
      filtered = filtered.filter(item => item.proficiencyLevel === profLevel);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortConfig.key === 'term') {
        return sortConfig.direction === 'asc' 
          ? a.term.localeCompare(b.term)
          : b.term.localeCompare(a.term);
      }
      
      if (sortConfig.key === 'proficiency_level') {
        return sortConfig.direction === 'asc' 
          ? a.proficiencyLevel - b.proficiencyLevel
          : b.proficiencyLevel - a.proficiencyLevel;
      }
      
      if (sortConfig.key === 'accuracy') {
        return sortConfig.direction === 'asc' 
          ? a.accuracy - b.accuracy
          : b.accuracy - a.accuracy;
      }
      
      if (sortConfig.key === 'last_practiced') {
        const dateA = a.lastPracticed ? new Date(a.lastPracticed) : new Date(0);
        const dateB = b.lastPracticed ? new Date(b.lastPracticed) : new Date(0);
        return sortConfig.direction === 'asc' 
          ? dateA - dateB
          : dateB - dateA;
      }
      
      return 0;
    });
    
    setFilteredItems(filtered);
  }, [vocabularyItems, searchTerm, selectedTheme, selectedProficiency, sortConfig]);

  // Handle sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Vocabulary</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-4 shadow-md">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm font-medium opacity-80">Total Words</p>
              <p className="text-2xl font-bold">{stats.totalWords}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-4 shadow-md">
          <div className="flex items-center">
                            <CheckCircle className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm font-medium opacity-80">Mastered Words</p>
              <p className="text-2xl font-bold">{stats.knownWords}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg p-4 shadow-md">
          <div className="flex items-center">
                            <XCircle className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm font-medium opacity-80">Weak Words</p>
              <p className="text-2xl font-bold">{stats.weakWords}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg p-4 shadow-md">
          <div className="flex items-center">
            <Clock className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm font-medium opacity-80">Due for Review</p>
              <p className="text-2xl font-bold">{stats.reviewDue}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link href="/student-dashboard/vocabulary/practice" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center">
          <PlayCircle className="mr-2 h-5 w-5" /> Practice Weak Words
        </Link>
        
        <Link href="/student-dashboard/vocabulary/review" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center">
          <Calendar className="mr-2 h-5 w-5" /> Review Due Words
        </Link>
        
        <Link href="/student-dashboard/vocabulary/progress" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center">
          <BarChart2 className="mr-2 h-5 w-5" /> View Progress
        </Link>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
              placeholder="Search terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
            <select
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
            >
              <option value="all">All Themes</option>
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <ListFilter className="w-5 h-5 text-gray-400" />
            </div>
            <select
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
              value={selectedProficiency}
              onChange={(e) => setSelectedProficiency(e.target.value)}
            >
              <option value="all">All Proficiency Levels</option>
              {proficiencyLevels.map((level) => (
                <option key={level.level} value={level.level}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Vocabulary Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('term')}
                >
                  <div className="flex items-center">
                    Term
                    {sortConfig.key === 'term' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Translation
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('proficiency_level')}
                >
                  <div className="flex items-center">
                    Proficiency
                    {sortConfig.key === 'proficiency_level' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('accuracy')}
                >
                  <div className="flex items-center">
                    Accuracy
                    {sortConfig.key === 'accuracy' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('last_practiced')}
                >
                  <div className="flex items-center">
                    Last Practiced
                    {sortConfig.key === 'last_practiced' && (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.progressId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.term}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.translation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${proficiencyLevels[item.proficiencyLevel].color} ${proficiencyLevels[item.proficiencyLevel].textColor}`}>
                        {proficiencyLevels[item.proficiencyLevel].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.correctAnswers + item.incorrectAnswers > 0 ? (
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              item.accuracy > 80 ? 'bg-green-600' : 
                              item.accuracy > 60 ? 'bg-yellow-400' : 'bg-red-600'
                            }`}
                            style={{ width: `${item.accuracy}%` }}
                          ></div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No data</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.lastPracticed ? new Date(item.lastPracticed).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/student-dashboard/vocabulary/practice?item=${item.vocabularyItemId}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Practice
                      </Link>
                      <Link
                        href={`/student-dashboard/vocabulary/detail?item=${item.vocabularyItemId}`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm || selectedTheme !== 'all' || selectedProficiency !== 'all' ? (
                      <p>No vocabulary items match your search filters.</p>
                    ) : (
                      <p>No vocabulary items found. Start learning to build your vocabulary!</p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 