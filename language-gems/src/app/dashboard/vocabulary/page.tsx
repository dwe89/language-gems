'use client';

// Skip static generation for this page
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import { BookOpen, Search, Filter, ArrowRight, Clock, Check, X } from 'lucide-react';

// Define types for our data
type WordList = {
  id: string;
  name: string;
  description: string;
  word_count: number;
  created_by: string;
  is_assigned: boolean;
  assigned_date?: string;
  due_date?: string;
  progress?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
};

export default function VocabularyPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [filteredLists, setFilteredLists] = useState<WordList[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  const [filters, setFilters] = useState({
    onlyAssigned: false,
    onlyCompleted: false,
    level: 'all',
    category: 'all'
  });

  // Get unique categories from all lists for filter options
  const categories = [...new Set(wordLists.map(list => list.category).filter(Boolean))];
  
  useEffect(() => {
    async function fetchWordLists() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // For demo purposes, using mock data
        // In a real app, we would fetch this from Supabase
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockLists: WordList[] = [
          {
            id: "list-123",
            name: "Essential Verbs - Beginner Level",
            description: "A collection of the most common verbs for beginner English learners",
            word_count: 20,
            created_by: "Teacher Smith",
            is_assigned: true,
            assigned_date: "2023-11-03T14:20:00Z",
            due_date: "2023-11-15T23:59:59Z",
            progress: 45,
            level: "beginner",
            category: "Grammar"
          },
          {
            id: "list-456",
            name: "Food and Cooking Vocabulary",
            description: "Learn common words related to food, ingredients, and cooking",
            word_count: 30,
            created_by: "Teacher Johnson",
            is_assigned: true,
            assigned_date: "2023-10-28T11:10:00Z",
            due_date: "2023-11-10T23:59:59Z",
            progress: 70,
            level: "intermediate",
            category: "Food"
          },
          {
            id: "list-789",
            name: "Technology Terms",
            description: "Modern vocabulary related to computers, mobile devices, and the internet",
            word_count: 25,
            created_by: "Teacher Davis",
            is_assigned: true,
            assigned_date: "2023-10-20T09:30:00Z",
            due_date: "2023-11-08T23:59:59Z",
            progress: 90,
            level: "intermediate",
            category: "Technology"
          },
          {
            id: "list-101",
            name: "Business English",
            description: "Essential vocabulary for professional situations and office environments",
            word_count: 40,
            created_by: "Teacher Wilson",
            is_assigned: false,
            level: "advanced",
            category: "Business"
          },
          {
            id: "list-102",
            name: "Travel and Tourism",
            description: "Useful words and phrases for travelers and tourists",
            word_count: 35,
            created_by: "Teacher Garcia",
            is_assigned: false,
            level: "beginner",
            category: "Travel"
          },
          {
            id: "list-103",
            name: "Medical Terminology",
            description: "Basic medical vocabulary for health-related discussions",
            word_count: 45,
            created_by: "Teacher Brown",
            is_assigned: false,
            level: "advanced",
            category: "Health"
          },
          {
            id: "list-104",
            name: "Weather and Climate",
            description: "Words to describe weather conditions and climate phenomena",
            word_count: 22,
            created_by: "Teacher Smith",
            is_assigned: false,
            level: "beginner",
            category: "Environment"
          }
        ];
        
        setWordLists(mockLists);
        setFilteredLists(mockLists);
      } catch (error) {
        console.error('Error fetching word lists:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchWordLists();
  }, [user]);
  
  // Apply filters and search
  useEffect(() => {
    let results = [...wordLists];
    
    // Apply search term
    if (searchTerm) {
      results = results.filter(list => 
        list.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        list.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (list.category && list.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply filters
    if (filters.onlyAssigned) {
      results = results.filter(list => list.is_assigned);
    }
    
    if (filters.onlyCompleted) {
      results = results.filter(list => (list.progress || 0) >= 100);
    }
    
    if (filters.level !== 'all') {
      results = results.filter(list => list.level === filters.level);
    }
    
    if (filters.category !== 'all') {
      results = results.filter(list => list.category === filters.category);
    }
    
    setFilteredLists(results);
  }, [searchTerm, filters, wordLists]);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const calculateDaysLeft = (dueDateString?: string) => {
    if (!dueDateString) return null;
    
    const dueDate = new Date(dueDateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const toggleFilters = () => {
    setFilterActive(!filterActive);
  };
  
  const resetFilters = () => {
    setFilters({
      onlyAssigned: false,
      onlyCompleted: false,
      level: 'all',
      category: 'all'
    });
    setSearchTerm('');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Vocabulary Lists</h1>
        <p className="text-gray-300">Browse and study vocabulary lists to enhance your language skills</p>
      </div>
      
      {/* Search and Filter */}
      <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vocabulary lists..."
              className="block w-full pl-10 pr-3 py-2 border border-indigo-700 rounded-md bg-indigo-800/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={toggleFilters}
            className="flex items-center px-4 py-2 bg-indigo-800/40 hover:bg-indigo-700/60 text-white rounded-md"
          >
            <Filter className="h-5 w-5 mr-2" />
            {filterActive ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {filterActive && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Status</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.onlyAssigned}
                    onChange={(e) => setFilters({...filters, onlyAssigned: e.target.checked})}
                    className="rounded bg-indigo-800 border-indigo-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span className="ml-2 text-gray-300">Assigned to me</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.onlyCompleted}
                    onChange={(e) => setFilters({...filters, onlyCompleted: e.target.checked})}
                    className="rounded bg-indigo-800 border-indigo-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span className="ml-2 text-gray-300">Completed</span>
                </label>
              </div>
            </div>
            
            <div>
              <label htmlFor="level-filter" className="text-gray-300 text-sm mb-1 block">Level</label>
              <select
                id="level-filter"
                value={filters.level}
                onChange={(e) => setFilters({...filters, level: e.target.value})}
                className="block w-full px-3 py-2 border border-indigo-700 rounded-md bg-indigo-800/40 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="category-filter" className="text-gray-300 text-sm mb-1 block">Category</label>
              <select
                id="category-filter"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="block w-full px-3 py-2 border border-indigo-700 rounded-md bg-indigo-800/40 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-gray-300 hover:text-white bg-indigo-800/40 hover:bg-indigo-700/60 rounded-md"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Word Lists */}
      <div className="space-y-4">
        {filteredLists.length === 0 ? (
          <div className="text-center py-12 bg-indigo-900/30 backdrop-blur-sm rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-2">No lists found</h2>
            <p className="text-gray-300">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {/* Assigned Lists Section */}
              {filteredLists.some(list => list.is_assigned) && (
                <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-6 col-span-full">
                  <h2 className="text-xl font-semibold text-white mb-6">Assigned to You</h2>
                  
                  <div className="space-y-4">
                    {filteredLists
                      .filter(list => list.is_assigned)
                      .map(list => (
                        <div key={list.id} className="bg-indigo-800/30 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-medium text-white">{list.name}</h3>
                              <p className="text-sm text-gray-300 mb-2">{list.description}</p>
                              <div className="flex items-center text-xs text-gray-400">
                                <span>Assigned by {list.created_by} • {formatDate(list.assigned_date)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              {list.due_date && (
                                <div className="text-xs font-medium text-gray-300">
                                  <span className={calculateDaysLeft(list.due_date)! <= 3 ? 'text-red-400' : 'text-green-400'}>
                                    {calculateDaysLeft(list.due_date)} days left
                                  </span>
                                </div>
                              )}
                              <div className="text-xs text-gray-400 mt-1">{list.word_count} words</div>
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium text-gray-300">{list.progress || 0}% complete</span>
                              <Link 
                                href={`/dashboard/vocabulary/${list.id}`}
                                className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
                              >
                                Continue
                              </Link>
                            </div>
                            <div className="w-full bg-indigo-950/50 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" 
                                style={{ width: `${list.progress || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Browse All Lists */}
            <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Browse Vocabulary Lists</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLists.map(list => (
                  <Link 
                    key={list.id} 
                    href={`/dashboard/vocabulary/${list.id}`}
                    className="bg-indigo-800/30 rounded-lg p-4 block hover:bg-indigo-700/40 transition duration-150"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-white mb-2">{list.name}</h3>
                        <p className="text-sm text-gray-300 line-clamp-2 mb-2">{list.description}</p>
                        
                        <div className="flex items-center text-xs gap-2 mb-1">
                          {list.level && (
                            <span className={`inline-block px-2 py-1 rounded-full ${
                              list.level === 'beginner' ? 'bg-green-900/40 text-green-300' :
                              list.level === 'intermediate' ? 'bg-yellow-900/40 text-yellow-300' :
                              'bg-red-900/40 text-red-300'
                            }`}>
                              {list.level.charAt(0).toUpperCase() + list.level.slice(1)}
                            </span>
                          )}
                          
                          {list.category && (
                            <span className="inline-block px-2 py-1 rounded-full bg-indigo-900/40 text-indigo-300">
                              {list.category}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex text-xs text-gray-400 mt-2">
                          <span>{list.word_count} words</span>
                          {list.is_assigned && (
                            <span className="ml-2 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Due {formatDate(list.due_date)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {list.is_assigned && list.progress !== undefined && (
                        <div className="flex flex-col items-center">
                          <div className="relative h-16 w-16">
                            <svg className="h-16 w-16" viewBox="0 0 36 36">
                              <circle 
                                cx="18" cy="18" r="16" 
                                fill="none" 
                                stroke="#1e2b4a" 
                                strokeWidth="2" 
                              />
                              <circle 
                                cx="18" cy="18" r="16" 
                                fill="none" 
                                stroke="url(#gradient)" 
                                strokeWidth="2" 
                                strokeDasharray={`${100 * Math.PI / 3.125}, 100`}
                                strokeDashoffset={`${(100 - list.progress) * Math.PI / 3.125}`} 
                                transform="rotate(-90 18 18)" 
                              />
                              <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#06b6d4" />
                                  <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">{list.progress}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <span className="text-cyan-400 text-sm flex items-center">
                        Study Now
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 