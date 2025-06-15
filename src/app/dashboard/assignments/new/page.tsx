'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, BookOpen, BookmarkIcon, FileText, 
  Users, AlarmClock, Clock, Rocket, Building2, Castle, 
  DollarSign, CircleOff, DoorOpen, Puzzle, PlayCircle, 
  RefreshCw, CheckCircle, Headphones, Mic, Volume2, MessageSquare, 
  PenTool, FileEdit, Feather, Award, Plus, X, Eye, Trash2,
  Zap, Brain, Target, Gamepad2, Timer, Star, Settings,
  Shuffle, Grid3X3, Type, Layers, Smile
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../../../../lib/database.types';

// Complete games list aligned with actual games directory
const AVAILABLE_GAMES = [
  { 
    id: 'speed-builder', 
    name: 'Speed Builder', 
    description: 'Build sentences by dragging words into the correct order before time runs out',
    icon: <Building2 className="text-indigo-500" size={20} />,
    category: 'grammar',
    difficulty: 'intermediate',
    timeToComplete: '5-10 min',
    path: '/games/speed-builder'
  },
  { 
    id: 'gem-collector', 
    name: 'Gem Collector', 
    description: 'Collect translation gems while avoiding wrong answers in this fast-paced adventure',
    icon: <Star className="text-purple-500" size={20} />,
    category: 'vocabulary',
    difficulty: 'beginner',
    timeToComplete: '3-8 min',
    path: '/games/gem-collector'
  },
  { 
    id: 'translation-tycoon', 
    name: 'Translation Tycoon', 
    description: 'Build your translation business empire by earning coins from correct translations',
    icon: <DollarSign className="text-emerald-500" size={20} />,
    category: 'vocabulary',
    difficulty: 'intermediate',
    timeToComplete: '8-15 min',
    path: '/games/translation-tycoon'
  },
  { 
    id: 'word-blast', 
    name: 'Word Blast', 
    description: 'Launch rockets by selecting correct translations before time runs out',
    icon: <Rocket className="text-orange-500" size={20} />,
    category: 'vocabulary',
    difficulty: 'beginner',
    timeToComplete: '5-12 min',
    path: '/games/word-blast'
  },
  { 
    id: 'hangman', 
    name: 'Hangman', 
    description: 'Classic word guessing game with vocabulary practice',
    icon: <Puzzle className="text-cyan-500" size={20} />,
    category: 'vocabulary',
    difficulty: 'beginner',
    timeToComplete: '3-7 min',
    path: '/games/hangman'
  },
  { 
    id: 'memory-game', 
    name: 'Memory Match', 
    description: 'Match vocabulary pairs in this memory-building card game',
    icon: <Brain className="text-pink-500" size={20} />,
    category: 'vocabulary',
    difficulty: 'beginner',
    timeToComplete: '5-10 min',
    path: '/games/memory-game'
  },
  { 
    id: 'verb-conjugation-ladder', 
    name: 'Verb Conjugation Ladder', 
    description: 'Climb the ladder by mastering verb conjugations step by step',
    icon: <Layers className="text-blue-500" size={20} />,
    category: 'grammar',
    difficulty: 'intermediate',
    timeToComplete: '8-15 min',
    path: '/games/verb-conjugation-ladder'
  },
  { 
    id: 'word-guesser', 
    name: 'Word Guesser', 
    description: 'Guess words from clues and context in this engaging challenge',
    icon: <Target className="text-red-500" size={20} />,
    category: 'vocabulary',
    difficulty: 'intermediate',
    timeToComplete: '5-12 min',
    path: '/games/word-guesser'
  },
  { 
    id: 'sentence-towers', 
    name: 'Sentence Towers', 
    description: 'Build towering sentences by stacking words in the correct order',
    icon: <Castle className="text-amber-500" size={20} />,
    category: 'grammar',
    difficulty: 'intermediate',
    timeToComplete: '6-12 min',
    path: '/games/sentence-towers'
  },
  { 
    id: 'noughts-and-crosses', 
    name: 'Tic-Tac-Toe Vocabulary', 
    description: 'Win tic-tac-toe by answering vocabulary questions correctly',
    icon: <Grid3X3 className="text-green-500" size={20} />,
    category: 'vocabulary',
    difficulty: 'beginner',
    timeToComplete: '3-8 min',
    path: '/games/noughts-and-crosses'
  },
  { 
    id: 'sentence-builder', 
    name: 'Sentence Builder', 
    description: 'Construct grammatically correct sentences from word fragments',
    icon: <Type className="text-violet-500" size={20} />,
    category: 'grammar',
    difficulty: 'intermediate',
    timeToComplete: '5-10 min',
    path: '/games/sentence-builder'
  },
  { 
    id: 'word-association', 
    name: 'Word Association', 
    description: 'Connect related words and build vocabulary through associations',
    icon: <RefreshCw className="text-teal-500" size={20} />,
    category: 'vocabulary',
    difficulty: 'intermediate',
    timeToComplete: '4-9 min',
    path: '/games/word-association'
  },
  { 
    id: 'word-scramble', 
    name: 'Word Scramble', 
    description: 'Unscramble letters to form correct vocabulary words',
    icon: <Shuffle className="text-lime-500" size={20} />,
    category: 'vocabulary',
    difficulty: 'beginner',
    timeToComplete: '3-7 min',
    path: '/games/word-scramble'
  }
];

const GRAMMAR_ACTIVITIES = [
  {
    id: 'verb_conjugation_drill',
    name: 'Verb Conjugation Drill',
    description: 'Practice verb conjugations in different tenses',
    icon: <RefreshCw className="text-green-500" size={20} />,
    category: 'grammar',
    difficulty: 'intermediate',
    timeToComplete: '10-15 min',
    path: undefined
  }
];

const EXAM_PREP_ACTIVITIES = [
  {
    id: 'gcse_vocabulary_review',
    name: 'GCSE Vocabulary Review',
    description: 'Review essential GCSE vocabulary with targeted practice',
    icon: <Award className="text-gold-500" size={20} />,
    category: 'exam_prep',
    difficulty: 'advanced',
    timeToComplete: '15-25 min',
    path: undefined
  }
];

interface SelectedActivity {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  difficulty: string;
  timeToComplete: string;
  path?: string;
}

export default function NewAssignmentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [vocabularyLists, setVocabularyLists] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    due_date: '',
    status: 'active',
    points: 10,
    time_limit: 30
  });

  // Vocabulary assignment state
  const [vocabularySelection, setVocabularySelection] = useState({
    type: 'theme_based' as 'theme_based' | 'topic_based' | 'custom_list' | 'difficulty_based',
    theme: '',
    topic: '',
    customListId: '',
    difficulty: 'beginner',
    wordCount: 20
  });

  // Activity selection state
  const [selectedActivities, setSelectedActivities] = useState<SelectedActivity[]>([]);
  const [activeTab, setActiveTab] = useState<'games' | 'grammar' | 'exam_prep'>('games');

  useEffect(() => {
    if (user) {
      fetchData();
      
      // Check for pre-selected game from URL params
      const gameParam = searchParams?.get('game');
      if (gameParam === '3') { // Speed Builder
        const speedBuilder = AVAILABLE_GAMES.find(g => g.id === 'speed-builder');
        if (speedBuilder) {
          setSelectedActivities([speedBuilder]);
        }
      }
    } else if (!user && loading) {
      setLoading(false);
      setError('Please log in to create assignments');
    }
  }, [user, loading, searchParams]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

      // Fetch classes with better error handling
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', user!.id)
        .order('name');

      if (classesError) {
        console.error('Classes fetch error:', classesError);
        throw new Error(`Failed to load classes: ${classesError.message}`);
      }

      setClasses(classesData || []);

      // Fetch vocabulary assignment lists
      const { data: vocabularyData, error: vocabularyError } = await supabase
        .from('vocabulary_assignment_lists')
        .select('*')
        .eq('teacher_id', user!.id)
        .order('name');

      if (vocabularyError) {
        console.error('Vocabulary lists fetch error:', vocabularyError);
        // Don't throw error for vocabulary lists as they're optional
      }

      setVocabularyLists(vocabularyData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVocabularyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVocabularySelection(prev => ({ ...prev, [name]: value }));
  };

  const addActivity = (activity: SelectedActivity) => {
    if (!selectedActivities.find(a => a.id === activity.id)) {
      setSelectedActivities(prev => [...prev, activity]);
    }
  };

  const removeActivity = (activityId: string) => {
    setSelectedActivities(prev => prev.filter(a => a.id !== activityId));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'intermediate': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'advanced': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (selectedActivities.length === 0) {
      setError('Please select at least one activity for the assignment');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const results = [];
      
      for (const activity of selectedActivities) {
        const assignmentData = {
          title: selectedActivities.length === 1 
            ? formData.title || activity.name
            : `${formData.title || 'Assignment'}: ${activity.name}`,
          description: formData.description,
          gameType: activity.id,
          classId: formData.assigned_to,
          dueDate: formData.due_date,
          timeLimit: formData.time_limit,
          points: formData.points,
          vocabularySelection: vocabularySelection
        };

        const response = await fetch('/api/assignments/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(assignmentData)
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to create assignment');
        }
        
        results.push(result);
      }

      setSuccess(`Successfully created ${results.length} assignment${results.length > 1 ? 's' : ''}!`);
      
      setTimeout(() => {
        router.push('/dashboard/assignments');
      }, 2000);

    } catch (err) {
      console.error('Error creating assignment:', err);
      setError(err instanceof Error ? err.message : 'Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const getCurrentActivities = () => {
    switch (activeTab) {
      case 'games': return AVAILABLE_GAMES;
      case 'grammar': return GRAMMAR_ACTIVITIES;
      case 'exam_prep': return EXAM_PREP_ACTIVITIES;
      default: return AVAILABLE_GAMES;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/dashboard/assignments" 
            className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Assignments
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Create New Assignment</h1>
            <p className="text-lg text-gray-600">
              Build engaging assignments by selecting activities and vocabulary for your students
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="mr-2 text-indigo-600" size={24} />
                Assignment Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Week 3 Vocabulary Practice"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Class *
                  </label>
                  <select
                    id="assigned_to"
                    name="assigned_to"
                    value={formData.assigned_to}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  >
                    <option value="">Select a class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                  {classes.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      No classes found. Create a class first before creating assignments.
                    </p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Add instructions or context for this assignment..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    id="due_date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    id="points"
                    name="points"
                    value={formData.points}
                    onChange={handleChange}
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Vocabulary Assignment Configuration */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="mr-2 text-indigo-600" size={24} />
                Vocabulary Assignment
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="vocabularyType" className="block text-sm font-medium text-gray-700 mb-2">
                    Vocabulary Selection Method
                  </label>
                  <select
                    id="vocabularyType"
                    name="type"
                    value={vocabularySelection.type}
                    onChange={handleVocabularyChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="theme_based">Theme-based Selection</option>
                    <option value="topic_based">Topic-based Selection</option>
                    <option value="custom_list">Custom Vocabulary List</option>
                    <option value="difficulty_based">Difficulty-based Selection</option>
                  </select>
                </div>

                {vocabularySelection.type === 'theme_based' && (
                  <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      id="theme"
                      name="theme"
                      value={vocabularySelection.theme}
                      onChange={handleVocabularyChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Select a theme</option>
                      <option value="family">Family & Relationships</option>
                      <option value="food">Food & Drink</option>
                      <option value="travel">Travel & Transportation</option>
                      <option value="school">School & Education</option>
                      <option value="hobbies">Hobbies & Interests</option>
                    </select>
                  </div>
                )}

                {vocabularySelection.type === 'custom_list' && (
                  <div>
                    <label htmlFor="customListId" className="block text-sm font-medium text-gray-700 mb-2">
                      Custom List
                    </label>
                    <select
                      id="customListId"
                      name="customListId"
                      value={vocabularySelection.customListId}
                      onChange={handleVocabularyChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Select a custom list</option>
                      {vocabularyLists.map(list => (
                        <option key={list.id} value={list.id}>{list.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {vocabularySelection.type === 'difficulty_based' && (
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      value={vocabularySelection.difficulty}
                      onChange={handleVocabularyChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="wordCount" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Words
                  </label>
                  <input
                    type="number"
                    id="wordCount"
                    name="wordCount"
                    value={vocabularySelection.wordCount}
                    onChange={handleVocabularyChange}
                    min="5"
                    max="50"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {selectedActivities.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="mr-2 text-green-600" size={20} />
                  Selected Activities ({selectedActivities.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {activity.icon}
                        <div>
                          <h4 className="font-medium text-gray-900">{activity.name}</h4>
                          <p className="text-sm text-gray-600">{activity.timeToComplete}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {activity.path && (
                          <Link
                            href={activity.path}
                            target="_blank"
                            className="p-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 rounded"
                          >
                            <Eye size={16} />
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => removeActivity(activity.id)}
                          className="p-1 text-red-600 hover:text-red-700 hover:bg-red-100 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Plus className="mr-2 text-indigo-600" size={20} />
                Add Activities
              </h3>
              
              <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('games')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'games'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Gamepad2 className="inline mr-1" size={16} />
                  Games ({AVAILABLE_GAMES.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('grammar')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'grammar'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BookOpen className="inline mr-1" size={16} />
                  Grammar
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('exam_prep')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'exam_prep'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Award className="inline mr-1" size={16} />
                  Exam Prep
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCurrentActivities().map((activity) => {
                  const isSelected = selectedActivities.find(a => a.id === activity.id);
                  
                  return (
                    <div
                      key={activity.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                      }`}
                      onClick={() => isSelected ? removeActivity(activity.id) : addActivity(activity)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          {activity.icon}
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full border ${getDifficultyColor(activity.difficulty)}`}>
                            {activity.difficulty}
                          </span>
                        </div>
                        {isSelected && <CheckCircle className="text-green-600" size={20} />}
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 mb-1">{activity.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                          <Timer className="mr-1" size={12} />
                          {activity.timeToComplete}
                        </span>
                        {activity.path && (
                          <Link
                            href={activity.path}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="text-indigo-600 hover:text-indigo-700 flex items-center"
                          >
                            <Eye className="mr-1" size={12} />
                            Preview
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link 
                href="/dashboard/assignments"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting || selectedActivities.length === 0}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  `Create Assignment${selectedActivities.length > 1 ? 's' : ''}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
