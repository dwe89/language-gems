'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Target, Award } from 'lucide-react';
import ReadingComprehensionTask from '../../../../../components/reading-comprehension/ReadingComprehensionTask';

interface TaskInfo {
  id: string;
  title: string;
  difficulty: string;
  curriculum_level: string;
  word_count: number;
  estimated_reading_time: number;
}

export default function ReadingComprehensionPage() {
  const params = useParams();
  const language = params.language as string;
  const category = params.category as string;
  const subcategory = params.subcategory as string;
  
  const [availableTasks, setAvailableTasks] = useState<TaskInfo[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Language mapping
  const languageMap: Record<string, { name: string; flag: string; code: string }> = {
    spanish: { name: 'Spanish', flag: '🇪🇸', code: 'spanish' },
    french: { name: 'French', flag: '🇫🇷', code: 'french' },
    german: { name: 'German', flag: '🇩🇪', code: 'german' }
  };

  // Category mapping
  const categoryMap: Record<string, { name: string; icon: string }> = {
    'basics_core_language': { name: 'Basics & Core Language', icon: '📚' },
    'identity_personal_life': { name: 'Identity & Personal Life', icon: '👤' },
    'home_local_area': { name: 'Home & Local Area', icon: '🏠' },
    'school_jobs_future': { name: 'School, Jobs & Future Plans', icon: '🎓' },
    'free_time_leisure': { name: 'Free Time & Leisure', icon: '🎮' },
    'food_drink': { name: 'Food & Drink', icon: '🍽️' },
    'clothes_shopping': { name: 'Clothes & Shopping', icon: '👕' },
    'technology_media': { name: 'Technology & Media', icon: '📱' },
    'health_lifestyle': { name: 'Health & Lifestyle', icon: '⚕️' },
    'holidays_travel_culture': { name: 'Holidays, Travel & Culture', icon: '✈️' },
    'nature_environment': { name: 'Nature & Environment', icon: '🌿' },
    'social_global_issues': { name: 'Social & Global Issues', icon: '🌍' }
  };

  // Subcategory mapping
  const subcategoryMap: Record<string, string> = {
    'greetings_introductions': 'Greetings & Introductions',
    'common_phrases': 'Common Phrases',
    'opinions': 'Opinions',
    'numbers_1_30': 'Numbers 1-30',
    'numbers_40_100': 'Numbers 40-100',
    'colours': 'Colours',
    'days': 'Days',
    'months': 'Months',
    'personal_information': 'Personal Information',
    'family_friends': 'Family & Friends',
    'physical_personality_descriptions': 'Physical & Personality Descriptions',
    'pets': 'Pets',
    'house_rooms_furniture': 'House, Rooms & Furniture',
    'household_items_chores': 'Household Items & Chores',
    'types_housing': 'Types of Housing',
    'local_area_places_town': 'Local Area & Places in Town',
    'shops_services': 'Shops & Services',
    'directions_prepositions': 'Directions & Prepositions',
    'school_subjects': 'School Subjects',
    'school_rules': 'School Rules',
    'classroom_objects': 'Classroom Objects',
    'daily_routine_school': 'Daily Routine at School',
    'professions_jobs': 'Professions & Jobs',
    'future_ambitions': 'Future Ambitions',
    'qualities_jobs': 'Qualities for Jobs'
  };

  // Validate parameters
  if (!language || !languageMap[language]) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Language</h1>
          <p className="text-gray-600 mb-4">Please select a valid language (Spanish, French, or German).</p>
          <Link href="/reading-comprehension" className="text-blue-600 hover:text-blue-800">
            Back to Reading Comprehension
          </Link>
        </div>
      </div>
    );
  }

  if (!category || !categoryMap[category]) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Category</h1>
          <p className="text-gray-600 mb-4">Please select a valid category.</p>
          <Link href="/reading-comprehension" className="text-blue-600 hover:text-blue-800">
            Back to Reading Comprehension
          </Link>
        </div>
      </div>
    );
  }

  const languageInfo = languageMap[language];
  const categoryInfo = categoryMap[category];
  const subcategoryName = subcategoryMap[subcategory] || subcategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Load available tasks
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          language: languageInfo.code,
          category,
          subcategory,
          limit: '10'
        });

        const response = await fetch(`/api/reading-comprehension/tasks?${params.toString()}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.tasks && data.tasks.length > 0) {
            setAvailableTasks(data.tasks.map((task: any) => ({
              id: task.id,
              title: task.title,
              difficulty: task.difficulty,
              curriculum_level: task.curriculum_level,
              word_count: task.word_count,
              estimated_reading_time: task.estimated_reading_time
            })));
          } else {
            setError('No reading comprehension tasks found for this category.');
          }
        } else {
          setError('Failed to load reading comprehension tasks.');
        }
      } catch (err) {
        setError('Error loading tasks. Please try again.');
        console.error('Error loading tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [language, category, subcategory, languageInfo.code]);

  const handleTaskComplete = (results: any) => {
    console.log('Reading comprehension task completed:', results);
    setSelectedTask(null);
    // Could add analytics/progress tracking here
  };

  if (selectedTask) {
    return (
      <ReadingComprehensionTask
        language={languageInfo.code as 'spanish' | 'french' | 'german'}
        category={category}
        subcategory={subcategory}
        onComplete={handleTaskComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/reading-comprehension"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Reading Comprehension
              </Link>
              <div className="flex items-center">
                <span className="text-3xl mr-3">{languageInfo.flag}</span>
                <span className="text-2xl mr-3">{categoryInfo.icon}</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {languageInfo.name} Reading Comprehension
                  </h1>
                  <p className="text-gray-600">{categoryInfo.name} • {subcategoryName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reading comprehension tasks...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Tasks Available</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              href="/reading-comprehension"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Other Categories
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Reading Tasks</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {availableTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        <span className="capitalize">{task.difficulty}</span>
                        <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs uppercase">
                          {task.curriculum_level}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span>{task.word_count} words</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>~{task.estimated_reading_time} min read</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Start Reading Task →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
