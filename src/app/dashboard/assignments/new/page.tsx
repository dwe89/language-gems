'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Shuffle, Grid3X3, Type, Layers, Smile, Pickaxe, Gem, Map
} from 'lucide-react';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';

// Complete games list aligned with actual games directory
const AVAILABLE_GAMES = [
  {
    id: 'vocabulary-mining',
    name: '🔥 Vocabulary Mining',
    description: '✨ Advanced vocabulary learning with spaced repetition, voice recognition, multiple modes (Learn/Match/Voice), and adaptive difficulty. Like Memrise + Quizlet combined!',
    icon: <Pickaxe className="text-yellow-500" size={20} />,
    category: 'vocabulary',
    difficulty: 'adaptive',
    timeToComplete: '10-20 min',
    path: '/student-dashboard/vocabulary-mining/practice',
    featured: true // Mark as featured for highlighting
  },

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
    id: 'conjugation-duel', 
    name: 'Conjugation Duel', 
    description: 'Epic verb conjugation battles in different arenas and leagues',
    icon: <Layers className="text-red-500" size={20} />,
    category: 'grammar',
    difficulty: 'intermediate',
    timeToComplete: '10-20 min',
    path: '/games/conjugation-duel'
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
    description: 'Unscramble letters to form vocabulary words',
    icon: <Shuffle className="text-violet-500" size={20} />,
    category: 'vocabulary',
    difficulty: 'beginner',
    timeToComplete: '4-8 min',
    path: '/games/word-scramble'
  },
  {
    id: 'detective-listening',
    name: 'Detective Listening',
    description: 'Solve cases by listening to radio transmissions and identifying evidence',
    icon: <Headphones className="text-amber-600" size={20} />,
    category: 'listening',
    difficulty: 'intermediate',
    timeToComplete: '8-15 min',
    path: '/games/detective-listening'
  },
  {
    id: 'vocab-blast',
    name: 'Vocab Blast',
    description: 'Fast-paced vocabulary action with themed adventures',
    icon: <Zap className="text-yellow-500" size={20} />,
    category: 'vocabulary',
    difficulty: 'intermediate',
    timeToComplete: '5-12 min',
    path: '/games/vocab-blast'
  },
  {
    id: 'verb-quest',
    name: 'Verb Quest',
    description: 'Adventure through different worlds mastering verb conjugations',
    icon: <Map className="text-emerald-600" size={20} />,
    category: 'grammar',
    difficulty: 'advanced',
    timeToComplete: '15-25 min',
    path: '/games/verb-quest'
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
    time_limit: 30,
    curriculum_level: 'KS3'
  });

  // Vocabulary assignment state
  const [vocabularySelection, setVocabularySelection] = useState({
    type: 'category_based' as 'category_based' | 'subcategory_based' | 'custom_list',
    language: 'es',
    category: '',
    subcategory: '',
    customListId: '',
    wordCount: 10
  });

  // Activity selection state
  const [selectedActivities, setSelectedActivities] = useState<SelectedActivity[]>([]);
  const [activeTab, setActiveTab] = useState<'games' | 'grammar' | 'exam_prep'>('games');

  // Vocabulary mining specific state
  const [miningSettings, setMiningSettings] = useState({
    targetGems: 10,
    targetMastery: 80, // percentage
    allowReview: true,
    spacedRepetition: true,
    difficultyAdaptive: true,
    topicFocus: [] as string[],
    dailyGoal: 5,
    streakTarget: 3
  });

  // Create a ref to track if data has already been fetched
  const [dataFetched, setDataFetched] = useState(false);
  const [vocabularyPreview, setVocabularyPreview] = useState<any[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableSubcategories, setAvailableSubcategories] = useState<Record<string, string[]>>({});
  const [customWordlists, setCustomWordlists] = useState<any[]>([]);

  // Standard vocabulary categories from centralized database
  const standardCategories = {
    'basics_core_language': [
      'greetings_introductions',
      'common_phrases',
      'opinions',
      'numbers_1_20',
      'numbers_1_50',
      'numbers_1_100',
      'colours',
      'days',
      'months'
    ],
    'identity_personal_life': [
      'personal_information',
      'family_friends',
      'physical_personality_descriptions',
      'pets'
    ],
    'home_local_area': [
      'house_rooms_furniture',
      'household_items_chores',
      'types_of_housing',
      'local_area_places_town',
      'shops_services',
      'directions_prepositions'
    ],
    'school_jobs_future': [
      'school_subjects',
      'school_rules',
      'classroom_objects',
      'daily_routine_school',
      'professions_jobs',
      'future_ambitions',
      'qualities_for_jobs'
    ],
    'free_time_entertainment': [
      'hobbies_interests',
      'sports',
      'music_instruments',
      'tv_films_books',
      'social_activities',
      'technology_social_media'
    ],
    'travel_holidays': [
      'countries',
      'holiday_activities',
      'transport',
      'accommodation',
      'weather_seasons',
      'tourist_attractions'
    ],
    'health_lifestyle': [
      'body_parts',
      'health_illness',
      'food_drink_vocabulary',
      'healthy_unhealthy_lifestyle',
      'exercise_fitness',
      'medical_emergencies'
    ],
    'shopping_money': [
      'clothes_accessories',
      'shopping_phrases_prices',
      'money_currency',
      'shops_services',
      'online_shopping',
      'consumer_rights'
    ]
  };

  // Memory Game grid configurations
  const MEMORY_GAME_GRIDS = [
    { pairs: 3, grid: '3×2', description: 'Easy - 3 pairs', totalCards: 6 },
    { pairs: 4, grid: '4×2', description: 'Easy - 4 pairs', totalCards: 8 },
    { pairs: 5, grid: '5×2', description: 'Medium - 5 pairs', totalCards: 10 },
    { pairs: 6, grid: '4×3', description: 'Medium - 6 pairs', totalCards: 12 },
    { pairs: 8, grid: '4×4', description: 'Hard - 8 pairs', totalCards: 16 },
    { pairs: 10, grid: '5×4', description: 'Expert - 10 pairs', totalCards: 20 }
  ];

  // Get recommended grid size for selected activities
  const getRecommendedGridSize = () => {
    const memoryGame = selectedActivities.find(a => a.id === 'memory-game');
    if (memoryGame) {
      const wordCount = vocabularySelection.wordCount || 6;
      const bestGrid = MEMORY_GAME_GRIDS.find(g => g.pairs >= wordCount) || MEMORY_GAME_GRIDS[MEMORY_GAME_GRIDS.length - 1];
      return bestGrid;
    }
    return null;
  };

  // Fetch data function without dependencies that cause loops
  const fetchData = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const supabase = supabaseBrowser;

      // Fetch classes using teacher_id instead of created_by
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', user.id);

      if (classesError) {
        console.error('Error fetching classes:', classesError);
        setError('Failed to load classes');
        return;
      }

      setClasses(classesData || []);

      // Fetch vocabulary lists
      const { data: vocabularyListsData, error: vocabularyListsError } = await supabase
        .from('vocabulary_assignment_lists')
        .select('*')
        .eq('teacher_id', user.id);

      if (vocabularyListsError) {
        console.error('Error fetching vocabulary lists:', vocabularyListsError);
      } else {
        setVocabularyLists(vocabularyListsData || []);
      }

      // Load categories from centralized vocabulary database filtered by curriculum level and language
      console.log('Loading categories with filters:', {
        curriculum_level: formData.curriculum_level,
        language: vocabularySelection.language
      });

      let query = supabase
        .from('centralized_vocabulary')
        .select('category, subcategory')
        .not('category', 'is', null)
        .not('subcategory', 'is', null);

      // Filter by curriculum level if selected
      if (formData.curriculum_level) {
        query = query.eq('curriculum_level', formData.curriculum_level);
      }

      // Filter by language
      if (vocabularySelection.language) {
        query = query.eq('language', vocabularySelection.language);
      }

      const { data: categoriesData, error: categoriesError } = await query;

      console.log('Categories query result:', { categoriesData, categoriesError });

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        // Fallback to standard categories
        setAvailableCategories(Object.keys(standardCategories));
        setAvailableSubcategories(standardCategories);
      } else {
        // Process the data to get unique categories and their subcategories
        const categoryMap: Record<string, Set<string>> = {};

        categoriesData?.forEach(item => {
          if (!categoryMap[item.category]) {
            categoryMap[item.category] = new Set();
          }
          categoryMap[item.category].add(item.subcategory);
        });

        const categories = Object.keys(categoryMap).sort();
        const subcategoriesMap: Record<string, string[]> = {};

        Object.entries(categoryMap).forEach(([category, subcatSet]) => {
          subcategoriesMap[category] = Array.from(subcatSet).sort();
        });

        setAvailableCategories(categories);
        setAvailableSubcategories(subcategoriesMap);
      }

    } catch (err) {
      console.error('Error in fetchData:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
      setDataFetched(true);
    }
  }, [user]);

  // Effect for data fetching - run when user is available, curriculum level, or language changes
  useEffect(() => {
    if (user && (!dataFetched || formData.curriculum_level || vocabularySelection.language)) {
      fetchData();
    } else if (!user) {
      setLoading(false);
      setError('Please log in to create assignments');
    }
  }, [user, dataFetched, fetchData, formData.curriculum_level, vocabularySelection.language]);

  // Separate effect for handling URL parameters (only run once)
  useEffect(() => {
    const gameParam = searchParams?.get('game');
    if (gameParam) {
      // Map game IDs from dashboard/games to assignment creation game IDs
      const gameIdMap: Record<string, string> = {
        '1': 'translation-tycoon', // Translation Tycoon (doesn't exist in AVAILABLE_GAMES)
        '2': 'memory-game',        // Memory Game
        '3': 'vocab-blast',        // Vocab Blast
        '4': 'hangman',           // Hangman
        '5': 'speed-builder',     // Speed Builder
        '6': 'sentence-towers',   // Sentence Tower
        '7': 'noughts-and-crosses', // Noughts and Crosses
        '8': 'conjugation-duel',  // Verb Conjugation Ladder
        '9': 'word-association',  // Word Association
        '10': 'word-scramble',    // Word Scramble
        'vocab-master': 'vocabulary-mining' // Vocabulary Mining (legacy mapping)
      };

      const mappedGameId = gameIdMap[gameParam] || gameParam;
      const selectedGame = AVAILABLE_GAMES.find(g => g.id === mappedGameId);

      if (selectedGame) {
        setSelectedActivities([selectedGame]);
      }
    }
  }, [searchParams]); // Include searchParams as dependency

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVocabularyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // If changing category, clear subcategory
    if (name === 'category') {
      setVocabularySelection(prev => ({ ...prev, [name]: value, subcategory: '' }));
    } else {
      setVocabularySelection(prev => ({ ...prev, [name]: value }));
    }

    // Clear preview when selection changes
    setVocabularyPreview([]);
  };

  const handleMiningSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setMiningSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    }));
  };

  const fetchVocabularyPreview = async () => {
    try {
      setPreviewLoading(true);
      const response = await fetch('/api/vocabulary/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...vocabularySelection,
          language: vocabularySelection.language || 'es' // Ensure language is included
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setVocabularyPreview(result.vocabulary || []);
      } else {
        console.error('Preview error:', result.error);
        setError('Failed to load vocabulary preview');
      }
    } catch (error) {
      console.error('Preview fetch error:', error);
      setError('Failed to load vocabulary preview');
    } finally {
      setPreviewLoading(false);
    }
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
    console.log('=== ASSIGNMENT CREATION STARTED ===');
    console.log('Form data:', formData);
    console.log('Selected activities:', selectedActivities);
    console.log('Vocabulary selection:', vocabularySelection);
    console.log('Mining settings:', miningSettings);
    console.log('User:', user);

    if (!user) {
      console.error('No user found');
      return;
    }

    if (selectedActivities.length === 0) {
      console.error('No activities selected');
      setError('Please select at least one activity for the assignment');
      return;
    }

    try {
      console.log('Starting assignment creation process...');
      setSubmitting(true);
      setError('');
      setSuccess('');

      // Create a single multi-game assignment instead of multiple assignments
      const assignmentData = {
        title: formData.title || 'Multi-Game Assignment',
        description: formData.description,
        gameType: 'multi-game',
        selectedGames: selectedActivities.map(activity => activity.id),
        classId: formData.assigned_to,
        dueDate: formData.due_date,
        timeLimit: formData.time_limit,
        curriculumLevel: formData.curriculum_level,
        vocabularySelection: vocabularySelection,
        gameConfig: {
          miningSettings: selectedActivities.some(a => a.id === 'vocabulary-mining') ? miningSettings : undefined
        }
      };

      console.log('Assignment data prepared:', assignmentData);
      console.log('Making API call to /api/assignments/create...');

      const response = await fetch('/api/assignments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assignmentData)
      });

      console.log('API response status:', response.status);
      console.log('API response headers:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('API response data:', result);

      if (!response.ok) {
        console.error('API call failed:', result);
        throw new Error(result.error || 'Failed to create assignment');
      }

      setSuccess(`Successfully created assignment with ${selectedActivities.length} game${selectedActivities.length > 1 ? 's' : ''}!`);

      // Use a more reliable navigation approach to avoid DOM manipulation conflicts
      setTimeout(() => {
        try {
          router.push('/dashboard/assignments');
        } catch (navError) {
          console.error('Navigation error:', navError);
          // Fallback: use window.location if router fails
          window.location.href = '/dashboard/assignments';
        }
      }, 1500);

    } catch (err) {
      console.error('=== ASSIGNMENT CREATION ERROR ===');
      console.error('Error details:', err);
      console.error('Error stack:', err instanceof Error ? err.stack : 'No stack trace');
      console.error('Form data at error:', formData);
      console.error('Vocabulary selection at error:', vocabularySelection);
      console.error('Selected activities at error:', selectedActivities);
      setError(err instanceof Error ? err.message : 'Failed to create assignment');
    } finally {
      console.log('Assignment creation process completed');
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
            <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl text-green-800 shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-green-800">Assignment Created Successfully!</h3>
                  <p className="text-green-700 mt-1">{success}</p>
                  <p className="text-green-600 text-sm mt-2">Redirecting to assignments page...</p>
                </div>
              </div>
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
                  <label htmlFor="curriculum_level" className="block text-sm font-medium text-gray-700 mb-2">
                    Curriculum Level *
                  </label>
                  <select
                    id="curriculum_level"
                    name="curriculum_level"
                    value={formData.curriculum_level || 'KS3'}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  >
                    <option value="KS3">KS3 (Years 7-9)</option>
                    <option value="KS4">KS4 (GCSE)</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Select the appropriate curriculum level for vocabulary filtering
                  </p>
                </div>

              </div>
            </div>

            {/* Vocabulary Assignment Configuration */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="mr-2 text-indigo-600" size={24} />
                Vocabulary Assignment
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={vocabularySelection.language}
                    onChange={handleVocabularyChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                  </select>
                </div>

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
                    <option value="category_based">Category-based Selection</option>
                    <option value="subcategory_based">Subcategory-based Selection</option>
                    <option value="custom_list">Custom Vocabulary List</option>
                  </select>
                  
                  {/* Selection Type Info */}
                  {(vocabularySelection.type === 'theme_based' || vocabularySelection.type === 'topic_based') && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start">
                        <Shuffle className="mr-2 text-amber-600 mt-0.5" size={16} />
                        <div className="text-sm text-amber-800">
                          <p className="font-medium">Random Selection</p>
                          <p>When you select a theme or topic, up to <strong>10 vocabulary items</strong> will be randomly selected from all available words in that category. This ensures a manageable and varied gameplay experience.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {vocabularySelection.type === 'category_based' && (
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={vocabularySelection.category}
                      onChange={handleVocabularyChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Select a category</option>
                      {availableCategories.map(category => (
                        <option key={category} value={category}>
                          {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {vocabularySelection.type === 'subcategory_based' && (
                  <>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={vocabularySelection.category}
                        onChange={handleVocabularyChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      >
                        <option value="">Select a category</option>
                        {availableCategories.map(category => (
                          <option key={category} value={category}>
                            {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>

                    {vocabularySelection.category && (
                      <div>
                        <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
                          Subcategory
                        </label>
                        <select
                          id="subcategory"
                          name="subcategory"
                          value={vocabularySelection.subcategory}
                          onChange={handleVocabularyChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        >
                          <option value="">Select a subcategory</option>
                          {(availableSubcategories[vocabularySelection.category] || []).map(subcategory => (
                            <option key={subcategory} value={subcategory}>
                              {subcategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}

                {vocabularySelection.type === 'custom_list' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="customListId" className="block text-sm font-medium text-gray-700">
                        Custom List
                      </label>
                      <Link
                        href="/dashboard/vocabulary/create"
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors"
                      >
                        <Plus size={12} className="mr-1" />
                        Create New List
                      </Link>
                    </div>
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
                    
                    {vocabularyLists.length === 0 && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start">
                          <BookOpen className="mr-2 text-blue-600 mt-0.5" size={16} />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium">No Custom Lists Found</p>
                            <p>You haven't created any custom vocabulary lists yet. Click "Create New List" above to get started.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="wordCount" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Words
                    {(vocabularySelection.type === 'theme_based' || vocabularySelection.type === 'topic_based') && (
                      <span className="text-amber-600 ml-1">(max 20 for theme/topic selection)</span>
                    )}
                  </label>
                  <input
                    type="number"
                    id="wordCount"
                    name="wordCount"
                    value={vocabularySelection.wordCount}
                    onChange={handleVocabularyChange}
                    min="5"
                    max={
                      (vocabularySelection.type === 'category_based' || vocabularySelection.type === 'subcategory_based')
                        ? "20"
                        : "50"
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  {(vocabularySelection.type === 'category_based' || vocabularySelection.type === 'subcategory_based') && vocabularySelection.wordCount > 20 && (
                    <p className="mt-1 text-sm text-amber-600">
                      Word count will be limited to 20 for optimal gameplay experience.
                    </p>
                  )}
                </div>
              </div>

              {/* Vocabulary Preview Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Vocabulary Preview</h3>
                  <button
                    type="button"
                    onClick={fetchVocabularyPreview}
                    disabled={previewLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {previewLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2" size={16} />
                        Preview Vocabulary
                      </>
                    )}
                  </button>
                </div>

                {/* Grid Size Recommendation for Memory Game */}
                {getRecommendedGridSize() && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Brain className="mr-2 text-blue-600" size={16} />
                      <span className="font-medium text-blue-900">Memory Game Grid Recommendation</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      For {vocabularySelection.wordCount} words, we recommend a{' '}
                      <strong>{getRecommendedGridSize()?.grid}</strong> grid ({getRecommendedGridSize()?.description}).
                      This will create {getRecommendedGridSize()?.totalCards} cards total.
                    </p>
                  </div>
                )}

                {vocabularyPreview.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                    {vocabularyPreview.map((word, index) => (
                      <div key={word.id || index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-gray-900">{word.spanish}</span>
                          <span className="text-xs text-gray-500">#{index + 1}</span>
                        </div>
                        <span className="text-sm text-gray-600">{word.english}</span>
                        {word.theme && (
                          <div className="mt-1">
                            <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded">
                              {word.theme}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {vocabularyPreview.length === 0 && !previewLoading && (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="mx-auto mb-2" size={32} />
                    <p>Click "Preview Vocabulary" to see the words that will be used in this assignment.</p>
                  </div>
                )}
              </div>
            </div>



            {/* Vocabulary Mining Settings */}
            {selectedActivities.some(activity => activity.id === 'vocabulary-mining') && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6 border-2 border-yellow-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Pickaxe className="mr-2 text-yellow-600" size={20} />
                    🔥 Vocabulary Mining Settings
                  </h3>
                </div>
                
                <div className="bg-white/70 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>🎯 Advanced Learning Features:</strong> Voice recognition, adaptive difficulty, spaced repetition, multiple learning modes (Learn/Match/Voice), and real-time visual feedback.
                  </p>
                  <p className="text-xs text-gray-600">
                    Students get Memrise + Quizlet level experience with gem collection, streak tracking, and personalized learning paths.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Target Goals */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Target Goals</h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Gems to Collect
                      </label>
                      <input
                        type="number"
                        name="targetGems"
                        value={miningSettings.targetGems}
                        onChange={handleMiningSettingsChange}
                        min="1"
                        max="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Mastery Level (%)
                      </label>
                      <input
                        type="number"
                        name="targetMastery"
                        value={miningSettings.targetMastery}
                        onChange={handleMiningSettingsChange}
                        min="50"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Daily Goal (gems per day)
                      </label>
                      <input
                        type="number"
                        name="dailyGoal"
                        value={miningSettings.dailyGoal}
                        onChange={handleMiningSettingsChange}
                        min="1"
                        max="20"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                  </div>

                  {/* Mining Features */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Mining Features</h4>

                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="allowReview"
                          checked={miningSettings.allowReview}
                          onChange={handleMiningSettingsChange}
                          className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Allow spaced repetition reviews</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="spacedRepetition"
                          checked={miningSettings.spacedRepetition}
                          onChange={handleMiningSettingsChange}
                          className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enable intelligent spaced repetition</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="difficultyAdaptive"
                          checked={miningSettings.difficultyAdaptive}
                          onChange={handleMiningSettingsChange}
                          className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Adaptive difficulty based on performance</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Streak Target
                      </label>
                      <input
                        type="number"
                        name="streakTarget"
                        value={miningSettings.streakTarget}
                        onChange={handleMiningSettingsChange}
                        min="1"
                        max="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                  </div>
                </div>


              </div>
            )}

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
