'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, BookOpen, BookmarkIcon, FileText, 
  Users, AlarmClock, Clock, Rocket, Building2, Castle, 
  DollarSign, CircleOff, DoorOpen, Puzzle, PlayCircle, 
  RefreshCw, CheckCircle, Headphones, Mic, Volume2, MessageSquare, 
  PenTool, FileEdit, Feather, Award
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '../../../../lib/database.types';

// Game type definitions
const GAME_TYPES = [
  { 
    id: 'speed_builder', 
    name: 'Speed Builder 🏗️', 
    description: 'Students must drag and drop words into the correct order to build a sentence before time runs out.',
    icon: <Building2 className="text-indigo-500" size={24} />,
    configOptions: ['sentences', 'timeLimit', 'ghostMode']
  },
  { 
    id: 'word_blast', 
    name: 'Word Blast 🚀', 
    description: 'Students launch rockets by selecting the correct translation of a word before time runs out.',
    icon: <Rocket className="text-orange-500" size={24} />,
    configOptions: ['vocabulary', 'timeLimit', 'survivalMode', 'powerUps']
  },
  { 
    id: 'sentence_towers', 
    name: 'Sentence Towers 🏰', 
    description: 'Each correct answer adds a block to a tower. Build the highest tower before time runs out.',
    icon: <Castle className="text-amber-500" size={24} />,
    configOptions: ['vocabulary', 'sentences', 'timeLimit', 'towerFalling']
  },
  { 
    id: 'translation_tycoon', 
    name: 'Translation Tycoon 💰', 
    description: 'Students earn virtual money by correctly translating words and build their translation business.',
    icon: <DollarSign className="text-emerald-500" size={24} />,
    configOptions: ['vocabulary', 'sentences', 'challengeWords', 'startingCurrency']
  },
  { 
    id: 'balloon_pop', 
    name: 'Balloon Pop Quiz 🎈', 
    description: 'Students see a word and must pop the balloon with the correct translation.',
    icon: <CircleOff className="text-pink-500" size={24} />,
    configOptions: ['vocabulary', 'freezePenalty', 'progressiveDifficulty']
  },
  { 
    id: 'escape_translation', 
    name: 'Escape the Translation Trap 🏃‍♀️🔐', 
    description: 'Students must translate key words correctly to escape a room.',
    icon: <DoorOpen className="text-purple-500" size={24} />,
    configOptions: ['vocabulary', 'sentences', 'trickWords', 'lives']
  },
  { 
    id: 'hangman', 
    name: 'Hangman', 
    description: 'Classic word guessing game where students guess letters to reveal a hidden word.',
    icon: <Puzzle className="text-cyan-500" size={24} />,
    configOptions: ['vocabulary', 'hintMode', 'difficultyLevel']
  }
];

// Add assignment categories
const ASSIGNMENT_CATEGORIES = [
  {
    id: 'games',
    name: 'Games',
    description: 'Interactive language learning games',
    icon: <PlayCircle className="text-blue-500" size={24} />,
    types: GAME_TYPES
  },
  {
    id: 'grammar',
    name: 'Grammar',
    description: 'Grammar exercises and quizzes',
    icon: <BookOpen className="text-purple-500" size={24} />,
    types: [
      {
        id: 'sentence_builder',
        name: 'Sentence Builder',
        description: 'Build correct sentences from given words',
        icon: <Building2 className="text-indigo-500" size={24} />,
        configOptions: ['difficulty', 'timeLimit', 'hints']
      },
      {
        id: 'verb_conjugation',
        name: 'Verb Conjugation',
        description: 'Practice verb conjugations in different tenses',
        icon: <RefreshCw className="text-green-500" size={24} />,
        configOptions: ['tense', 'verbs', 'difficulty']
      },
      {
        id: 'grammar_quiz',
        name: 'Grammar Quiz',
        description: 'Multiple choice grammar questions',
        icon: <CheckCircle className="text-amber-500" size={24} />,
        configOptions: ['questions', 'timeLimit', 'feedback']
      }
    ]
  },
  {
    id: 'exam_prep',
    name: 'Exam Preparation',
    description: 'Practice tests and exam preparation materials',
    icon: <Award className="text-red-500" size={24} />,
    types: [
      {
        id: 'practice_test',
        name: 'Practice Test',
        description: 'Full-length practice exam',
        icon: <FileText className="text-red-500" size={24} />,
        configOptions: ['duration', 'sections', 'scoring']
      },
      {
        id: 'vocabulary_test',
        name: 'Vocabulary Test',
        description: 'Test vocabulary knowledge',
        icon: <BookmarkIcon className="text-orange-500" size={24} />,
        configOptions: ['wordCount', 'difficulty', 'timeLimit']
      },
      {
        id: 'listening_test',
        name: 'Listening Test',
        description: 'Practice listening comprehension',
        icon: <Headphones className="text-blue-500" size={24} />,
        configOptions: ['audioClips', 'questions', 'repeats']
      }
    ]
  },
  {
    id: 'speaking',
    name: 'Speaking Practice',
    description: 'Speaking and pronunciation exercises',
    icon: <Mic className="text-green-500" size={24} />,
    types: [
      {
        id: 'pronunciation',
        name: 'Pronunciation Practice',
        description: 'Practice pronunciation with audio feedback',
        icon: <Volume2 className="text-teal-500" size={24} />,
        configOptions: ['words', 'feedback', 'difficulty']
      },
      {
        id: 'conversation',
        name: 'Conversation Practice',
        description: 'Practice conversations with AI',
        icon: <MessageSquare className="text-purple-500" size={24} />,
        configOptions: ['topics', 'difficulty', 'timeLimit']
      }
    ]
  },
  {
    id: 'writing',
    name: 'Writing',
    description: 'Writing exercises and assignments',
    icon: <PenTool className="text-amber-500" size={24} />,
    types: [
      {
        id: 'essay',
        name: 'Essay Writing',
        description: 'Write essays on given topics',
        icon: <FileEdit className="text-blue-500" size={24} />,
        configOptions: ['topics', 'wordLimit', 'timeLimit']
      },
      {
        id: 'creative_writing',
        name: 'Creative Writing',
        description: 'Creative writing prompts and exercises',
        icon: <Feather className="text-purple-500" size={24} />,
        configOptions: ['prompts', 'style', 'wordLimit']
      }
    ]
  }
];

export default function NewAssignmentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [wordlists, setWordlists] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null);
  
  const supabase = createClientComponentClient<Database>();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'game',
    category: 'games',
    game_type: '',
    assigned_to: '',
    due_date: '',
    status: 'draft',
    points: '10',
    time_limit: '15',
    vocabulary_list_id: '',
    game_config: {
      ghostMode: false,
      survivalMode: false,
      powerUps: false,
      towerFalling: false,
      challengeWords: false,
      freezePenalty: false,
      progressiveDifficulty: false,
      trickWords: false,
      lives: 3,
      hintMode: false,
      difficultyLevel: 'medium',
      sentences: []
    }
  });

  useEffect(() => {
    // In a real implementation, we would fetch classes from the database
    const sampleClasses = [
      { id: '1', name: 'Spanish 101', level: 'Beginner' },
      { id: '2', name: 'Spanish 201', level: 'Intermediate' },
      { id: '3', name: 'Japanese Beginners', level: 'Beginner' },
      { id: '4', name: 'German 301', level: 'Advanced' },
    ];
    
    const sampleWordlists = [
      { id: '1', name: 'Basic Spanish Vocabulary', word_count: 50 },
      { id: '2', name: 'Food and Dining', word_count: 30 },
      { id: '3', name: 'Travel Phrases', word_count: 25 },
      { id: '4', name: 'Common Verbs', word_count: 40 },
    ];
    
    setClasses(sampleClasses);
    setWordlists(sampleWordlists);
    setLoading(false);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'game_type') {
      setSelectedGameType(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      game_config: {
        ...prev.game_config,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      // Validate form
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      
      if (!formData.assigned_to) {
        throw new Error('Please select a class');
      }
      
      if (!formData.due_date) {
        throw new Error('Due date is required');
      }
      
      if (!formData.game_type) {
        throw new Error('Please select a game type');
      }
      
      // In a real implementation, we would save to the database
      // const { data, error } = await supabase
      //   .from('assignments')
      //   .insert([{ 
      //     title: formData.title,
      //     description: formData.description,
      //     teacher_id: user?.id,
      //     class_id: formData.assigned_to,
      //     game_type: formData.game_type,
      //     due_date: formData.due_date,
      //     status: formData.status,
      //     points: parseInt(formData.points),
      //     time_limit: parseInt(formData.time_limit),
      //     vocabulary_list_id: formData.vocabulary_list_id || null,
      //     game_config: formData.game_config
      //   }])
      //   .select();
      
      // if (error) throw error;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to assignments page
      router.push('/dashboard/assignments');
    } catch (err: any) {
      setError(err.message || 'Failed to create assignment');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-rose-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center">
          <Link 
            href="/dashboard/assignments" 
            className="mr-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="text-teal-700" size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-teal-800 mb-2">Create New Assignment</h1>
            <p className="text-teal-600">Set up an assignment for your students</p>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="e.g. French Food Vocabulary Quiz"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Describe what students need to do"
                />
              </div>
              
              {/* Assignment Category Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Assignment Category*
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ASSIGNMENT_CATEGORIES.map((category) => (
                    <div 
                      key={category.id}
                      onClick={() => {
                        setFormData(prev => ({ 
                          ...prev, 
                          category: category.id,
                          type: category.id === 'games' ? 'game' : 'assignment'
                        }));
                      }}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.category === category.id 
                          ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500' 
                          : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50/30'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        {category.icon}
                        <h3 className="ml-2 font-medium">{category.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Assignment Type Selection - shown only when a category is selected */}
              {formData.category && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {formData.category === 'games' ? 'Game Type*' : 'Assignment Type*'}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ASSIGNMENT_CATEGORIES.find(c => c.id === formData.category)?.types.map((type) => (
                      <div 
                        key={type.id}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, game_type: type.id }));
                        }}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.game_type === type.id 
                            ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500' 
                            : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50/30'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          {type.icon}
                          <h3 className="ml-2 font-medium">{type.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Game Configuration Options - shown only when a game type is selected */}
              {selectedGameType && (
                <div className="border rounded-lg p-4 bg-teal-50/50">
                  <div className="flex justify-between mb-3">
                    <h3 className="font-medium text-teal-800">Game Configuration</h3>
                    <Link
                      href={`/games/${selectedGameType.replace('_', '-')}`}
                      target="_blank"
                      className="text-teal-600 hover:text-teal-800 flex items-center text-sm"
                    >
                      <PlayCircle size={16} className="mr-1" />
                      Try this game
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Vocabulary List Selection */}
                    {GAME_TYPES.find(g => g.id === selectedGameType)?.configOptions.includes('vocabulary') && (
                      <div>
                        <label htmlFor="vocabulary_list_id" className="block text-sm font-medium text-gray-700 mb-1">
                          Vocabulary List
                        </label>
                        <select
                          id="vocabulary_list_id"
                          name="vocabulary_list_id"
                          value={formData.vocabulary_list_id}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        >
                          <option value="">Select a vocabulary list</option>
                          {wordlists.map(list => (
                            <option key={list.id} value={list.id}>
                              {list.name} ({list.word_count} words)
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    {/* Boolean Options */}
                    {selectedGameType === 'speed_builder' && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="ghostMode"
                          name="ghostMode"
                          checked={formData.game_config.ghostMode}
                          onChange={handleConfigChange}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <label htmlFor="ghostMode" className="text-sm text-gray-700">
                          Enable Ghost Mode (sentence disappears)
                        </label>
                      </div>
                    )}
                    
                    {selectedGameType === 'word_blast' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="survivalMode"
                            name="survivalMode"
                            checked={formData.game_config.survivalMode}
                            onChange={handleConfigChange}
                            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          />
                          <label htmlFor="survivalMode" className="text-sm text-gray-700">
                            Enable Survival Mode
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="powerUps"
                            name="powerUps"
                            checked={formData.game_config.powerUps}
                            onChange={handleConfigChange}
                            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          />
                          <label htmlFor="powerUps" className="text-sm text-gray-700">
                            Enable Power-Ups
                          </label>
                        </div>
                      </>
                    )}
                    
                    {selectedGameType === 'sentence_towers' && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="towerFalling"
                          name="towerFalling"
                          checked={formData.game_config.towerFalling}
                          onChange={handleConfigChange}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <label htmlFor="towerFalling" className="text-sm text-gray-700">
                          Enable Tower Falling on Mistakes
                        </label>
                      </div>
                    )}
                    
                    {selectedGameType === 'translation_tycoon' && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="challengeWords"
                          name="challengeWords"
                          checked={formData.game_config.challengeWords}
                          onChange={handleConfigChange}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <label htmlFor="challengeWords" className="text-sm text-gray-700">
                          Include Challenge Words (Bonus Points)
                        </label>
                      </div>
                    )}
                    
                    {selectedGameType === 'balloon_pop' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="freezePenalty"
                            name="freezePenalty"
                            checked={formData.game_config.freezePenalty}
                            onChange={handleConfigChange}
                            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          />
                          <label htmlFor="freezePenalty" className="text-sm text-gray-700">
                            Enable Freeze Penalty
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="progressiveDifficulty"
                            name="progressiveDifficulty"
                            checked={formData.game_config.progressiveDifficulty}
                            onChange={handleConfigChange}
                            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          />
                          <label htmlFor="progressiveDifficulty" className="text-sm text-gray-700">
                            Progressive Difficulty
                          </label>
                        </div>
                      </>
                    )}
                    
                    {selectedGameType === 'escape_translation' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="trickWords"
                            name="trickWords"
                            checked={formData.game_config.trickWords}
                            onChange={handleConfigChange}
                            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          />
                          <label htmlFor="trickWords" className="text-sm text-gray-700">
                            Include Trick Words (Extra Challenge)
                          </label>
                        </div>
                        <div>
                          <label htmlFor="lives" className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Lives
                          </label>
                          <input
                            type="number"
                            id="lives"
                            name="lives"
                            value={formData.game_config.lives}
                            onChange={handleConfigChange}
                            min="1"
                            max="5"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>
                      </>
                    )}
                    
                    {selectedGameType === 'hangman' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="hintMode"
                            name="hintMode"
                            checked={formData.game_config.hintMode}
                            onChange={handleConfigChange}
                            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          />
                          <label htmlFor="hintMode" className="text-sm text-gray-700">
                            Enable Hints
                          </label>
                        </div>
                        <div>
                          <label htmlFor="difficultyLevel" className="block text-sm font-medium text-gray-700 mb-1">
                            Difficulty Level
                          </label>
                          <select
                            id="difficultyLevel"
                            name="difficultyLevel"
                            value={formData.game_config.difficultyLevel}
                            onChange={handleConfigChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700 mb-1">
                    Assign to Class*
                  </label>
                  <div className="relative">
                    <select
                      id="assigned_to"
                      name="assigned_to"
                      value={formData.assigned_to}
                      onChange={handleChange}
                      className="w-full appearance-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    >
                      <option value="">Select a class</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="due_date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full appearance-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="draft">Draft - Save for later</option>
                      <option value="active">Active - Assign immediately</option>
                      <option value="scheduled">Scheduled - Assign on specific date</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">
                    Points
                  </label>
                  <input
                    type="number"
                    id="points"
                    name="points"
                    value={formData.points}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="time_limit" className="block text-sm font-medium text-gray-700 mb-1">
                    Time Limit (minutes)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="time_limit"
                      name="time_limit"
                      value={formData.time_limit}
                      onChange={handleChange}
                      min="0"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <Link 
                  href="/dashboard/assignments"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating...' : 'Create Assignment'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 