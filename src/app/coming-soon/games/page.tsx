'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { 
  ArrowLeft, Play, Trophy, Users, BarChart3, Clock, Zap, Star, Gamepad2, Target, Award, 
  Crown, FileText, Calendar, Settings, GraduationCap, Gem, Bell, ChevronRight, Pickaxe,
  Eye, Brain, Construction, Puzzle, Zap as Lightning, Crosshair, Shuffle, Layers
} from 'lucide-react';

export default function GamesComingSoon() {
  const [activeTab, setActiveTab] = useState<'games' | 'teacher-preview' | 'student-preview'>('games');

  const allGames = [
    {
      id: 'memory-game',
      title: "Memory Match",
      description: "Match vocabulary words with images or translations in this classic memory game",
      features: ["Timed challenges", "Multiple difficulty levels", "Progress tracking", "Visual learning"],
      image: "/games/memory-game/backgrounds/forest.jpg",
      icon: <Brain className="w-6 h-6" />,
      category: "Memory",
      difficulty: "Easy",
      estimatedTime: "5-10 min"
    },
    {
      id: 'hangman',
      title: "Word Hangman", 
      description: "Classic hangman with language learning twist and hint system",
      features: ["Hint system", "Themed categories", "Multiplayer mode", "Progressive difficulty"],
      image: "/games/hangman/images/gallows.png",
      icon: <Target className="w-6 h-6" />,
      category: "Spelling",
      difficulty: "Medium",
      estimatedTime: "3-8 min"
    },
    {
      id: 'word-blast',
      title: "Word Blast",
      description: "Fast-paced word recognition and typing game with explosive action",
      features: ["Speed challenges", "Leaderboards", "Power-ups", "Real-time scoring"],
      image: "/games/speed-translation.jpg",
      icon: <Lightning className="w-6 h-6" />,
      category: "Speed",
      difficulty: "Hard",
      estimatedTime: "2-5 min"
    },
    {
      id: 'translation-tycoon',
      title: "Translation Tycoon",
      description: "Build your translation empire while mastering vocabulary and grammar",
      features: ["City building", "Economic simulation", "Achievement system", "Strategic gameplay"],
      image: "/games/translation-tycoon.jpg",
      icon: <Construction className="w-6 h-6" />,
      category: "Strategy",
      difficulty: "Medium",
      estimatedTime: "15-30 min"
    },
    {
      id: 'sentence-builder',
      title: "Sentence Builder",
      description: "Create stories and sentences using target vocabulary words",
      features: ["Creative writing", "Grammar practice", "Peer sharing", "Story templates"],
      image: "/games/conversation.jpg",
      icon: <FileText className="w-6 h-6" />,
      category: "Grammar",
      difficulty: "Medium",
      estimatedTime: "10-20 min"
    },
    {
      id: 'verb-conjugation-ladder',
      title: "Verb Ladder",
      description: "Climb the conjugation ladder by mastering verb forms",
      features: ["Progressive levels", "Multiple tenses", "Visual feedback", "Achievement tracking"],
      image: "/games/grammar-quest.jpg",
      icon: <Layers className="w-6 h-6" />,
      category: "Grammar",
      difficulty: "Hard",
      estimatedTime: "8-15 min"
    },
    {
      id: 'word-scramble',
      title: "Word Scramble",
      description: "Unscramble letters to form vocabulary words against the clock",
      features: ["Time pressure", "Hint system", "Multiple languages", "Difficulty scaling"],
      image: "/games/vocab-match.jpg",
      icon: <Shuffle className="w-6 h-6" />,
      category: "Spelling",
      difficulty: "Easy",
      estimatedTime: "3-7 min"
    },
    {
      id: 'speed-builder',
      title: "Speed Builder",
      description: "Rapid-fire vocabulary and grammar challenges for quick learners",
      features: ["Lightning rounds", "Daily challenges", "Custom word lists", "Streak tracking"],
      image: "/games/word-battle.jpg",
      icon: <Zap className="w-6 h-6" />,
      category: "Speed",
      difficulty: "Hard",
      estimatedTime: "2-5 min"
    },
    {
      id: 'word-association',
      title: "Word Association",
      description: "Connect related words and concepts to build vocabulary networks",
      features: ["Concept mapping", "Visual connections", "Semantic learning", "Progressive difficulty"],
      image: "/games/pronunciation.jpg",
      icon: <Puzzle className="w-6 h-6" />,
      category: "Vocabulary",
      difficulty: "Medium",
      estimatedTime: "5-12 min"
    },
    {
      id: 'sentence-towers',
      title: "Sentence Towers",
      description: "Stack words correctly to build grammatically correct sentences",
      features: ["Drag & drop", "Grammar rules", "Visual stacking", "Error correction"],
      image: "/games/grammar-quest.jpg",
      icon: <Construction className="w-6 h-6" />,
      category: "Grammar",
      difficulty: "Medium",
      estimatedTime: "7-15 min"
    },
    {
      id: 'noughts-and-crosses',
      title: "Vocabulary Tic-Tac-Toe",
      description: "Classic tic-tac-toe with vocabulary challenges for each move",
      features: ["Strategic gameplay", "Vocabulary questions", "AI opponent", "Multiplayer mode"],
      image: "/games/word-battle.jpg",
      icon: <Crosshair className="w-6 h-6" />,
      category: "Strategy",
      difficulty: "Easy",
      estimatedTime: "3-8 min"
    },
    {
      id: 'gem-collector',
      title: "Gem Collector",
      description: "Collect vocabulary gems while navigating challenging mazes",
      features: ["Maze navigation", "Collectible items", "Progressive levels", "Time challenges"],
      image: "/games/vocab-match.jpg",
      icon: <Gem className="w-6 h-6" />,
      category: "Adventure",
      difficulty: "Medium",
      estimatedTime: "8-18 min"
    }
  ];

  const teacherFeatures = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Class Management",
      description: "Create game assignments for your students with custom word lists and difficulty settings."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Progress Analytics", 
      description: "Track student performance, identify learning gaps, and celebrate achievements."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Curriculum Integration",
      description: "Align games with your lesson plans and learning objectives effortlessly."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Achievement System",
      description: "Motivate students with badges, points, and leaderboards that encourage healthy competition."
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Memory': return 'bg-purple-100 text-purple-700';
      case 'Speed': return 'bg-orange-100 text-orange-700';
      case 'Grammar': return 'bg-blue-100 text-blue-700';
      case 'Vocabulary': return 'bg-green-100 text-green-700';
      case 'Spelling': return 'bg-pink-100 text-pink-700';
      case 'Strategy': return 'bg-indigo-100 text-indigo-700';
      case 'Adventure': return 'bg-cyan-100 text-cyan-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 animate-pulse">
              <Gamepad2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Interactive Language <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">Games</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Make language learning addictive with gamified experiences that students actually want to play. 
              Coming soon with full teacher integration and progress tracking.
            </p>
            
            {/* Status Banner */}
            <div className="inline-flex items-center bg-yellow-500/20 border border-yellow-500/30 rounded-full px-6 py-3 text-yellow-200 mb-8">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-medium">Currently in Development • Available in localhost for testing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-2 border border-white/20">
            <button
              onClick={() => setActiveTab('games')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center ${
                activeTab === 'games'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Gamepad2 className="w-5 h-5 mr-2" />
              All Games
            </button>
            <button
              onClick={() => setActiveTab('teacher-preview')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center ${
                activeTab === 'teacher-preview'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              Teacher Dashboard
            </button>
            <button
              onClick={() => setActiveTab('student-preview')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center ${
                activeTab === 'student-preview'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              Student Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Games Gallery */}
      {activeTab === 'games' && (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">🎮 Complete Game Collection</h2>
            <p className="text-gray-400 text-lg">12 engaging games designed by language teachers, for language teachers</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {allGames.map((game, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                {/* Game Image */}
                <div className="relative h-48 bg-gradient-to-br from-purple-600 to-pink-600 overflow-hidden">
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                    <div className="text-white text-center">
                      {game.icon}
                      <div className="text-6xl opacity-20 mt-2">🎮</div>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(game.category)}`}>
                      {game.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    ⏱️ {game.estimatedTime}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                      {game.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white">{game.title}</h3>
                  </div>
                  <p className="text-gray-300 mb-6">{game.description}</p>
                  <div className="space-y-2">
                    {game.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-400">
                        <Star className="w-4 h-4 mr-2 text-yellow-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/20">
                    <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center">
                      <Play className="w-4 h-4 mr-2" />
                      Play Soon
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Teacher Features */}
          <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-3xl p-12 mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">👩‍🏫 Built for Teachers</h3>
              <p className="text-gray-300 text-lg">Complete classroom integration with powerful management tools</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {teacherFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Instant Engagement</h4>
              <p className="text-gray-400">Students learn without realizing they're studying. Games make practice feel like play.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Competitive Learning</h4>
              <p className="text-gray-400">Leaderboards and achievements motivate students to practice more and improve faster.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Data-Driven Insights</h4>
              <p className="text-gray-400">Detailed analytics help you identify which students need extra support and which topics need review.</p>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Dashboard Preview */}
      {activeTab === 'teacher-preview' && (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">👩‍🏫 Teacher Dashboard Preview</h2>
            <p className="text-gray-400 text-lg">Experience the complete teacher dashboard with all features</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20 mb-8">
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">LanguageGems Teacher Dashboard</h2>
                  <p className="opacity-90">Comprehensive classroom management at your fingertips</p>
                </div>
                <Crown className="h-12 w-12 opacity-80" />
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-slate-50">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-indigo-600 mb-1">127</div>
                <div className="text-sm text-slate-600">Active Students</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-purple-600 mb-1">8</div>
                <div className="text-sm text-slate-600">Classes</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-pink-600 mb-1">24</div>
                <div className="text-sm text-slate-600">Active Assignments</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-1">89%</div>
                <div className="text-sm text-slate-600">Avg. Completion</div>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-200 bg-white">
              {['Classes', 'Assignments', 'Analytics', 'Games', 'Students', 'Reports'].map((item, index) => (
                <div key={index} className={`px-6 py-3 font-medium whitespace-nowrap border-b-2 ${
                  index === 0 ? 'text-indigo-600 border-indigo-600' : 'text-slate-600 border-transparent'
                }`}>
                  {item}
                </div>
              ))}
            </div>
            
            {/* Content Area */}
            <div className="p-6 bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-indigo-600" />
                    Recent Classes
                  </h3>
                  {[
                    { name: 'Advanced Spanish (Year 11)', students: 24, assignments: 3 },
                    { name: 'French Beginners', students: 18, assignments: 2 },
                    { name: 'German GCSE Prep', students: 31, assignments: 5 }
                  ].map((classItem, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-800">{classItem.name}</div>
                        <div className="text-xs text-slate-500">{classItem.students} students • {classItem.assignments} active assignments</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                    Performance Overview
                  </h3>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-purple-600 mb-2">73%</div>
                      <div className="text-sm text-slate-600">Average Class Performance</div>
                    </div>
                    <div className="space-y-3">
                      {['Vocabulary Mastery: 85%', 'Grammar Understanding: 67%', 'Game Completion: 92%'].map((stat, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-slate-600">{stat.split(':')[0]}</span>
                          <span className="font-semibold text-purple-600">{stat.split(':')[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Dashboard Preview */}
      {activeTab === 'student-preview' && (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">👨‍🎓 Student Dashboard Preview</h2>
            <p className="text-gray-400 text-lg">See how students will experience the platform</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20 mb-8">
            {/* Dashboard Header */}
            <div className="bg-indigo-800 text-white py-3 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <Gem className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold">LanguageGems Student Portal</h2>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Bell className="h-5 w-5 text-indigo-200" />
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                    A
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-purple-100">
                <div className="text-3xl font-bold text-purple-600 mb-1">73%</div>
                <div className="text-sm text-slate-600">Overall Progress</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-purple-100">
                <div className="text-3xl font-bold text-indigo-600 mb-1">5</div>
                <div className="text-sm text-slate-600">Active Assignments</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-purple-100">
                <div className="text-3xl font-bold text-green-600 mb-1">247</div>
                <div className="text-sm text-slate-600">Words Mastered</div>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-200 bg-white">
              {['Assignments', 'Games', 'Progress', 'Achievements', 'Calendar'].map((item, index) => (
                <div key={index} className={`px-6 py-3 font-medium whitespace-nowrap border-b-2 ${
                  index === 0 ? 'text-purple-600 border-purple-600' : 'text-slate-600 border-transparent'
                }`}>
                  {item}
                </div>
              ))}
            </div>
            
            {/* Content Area */}
            <div className="p-6 bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-purple-600" />
                    Current Assignments
                  </h3>
                  {[
                    { title: 'Spanish Vocabulary Set #1', due: '3 days', progress: 80 },
                    { title: 'French Conversation Practice', due: '1 week', progress: 45 },
                    { title: 'German Grammar Quiz', due: '5 days', progress: 0 }
                  ].map((assignment, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-800">{assignment.title}</div>
                        <div className="text-xs text-slate-500">Due in {assignment.due} • {assignment.progress}% complete</div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-purple-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${assignment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 flex items-center">
                    <Gamepad2 className="h-5 w-5 mr-2 text-indigo-600" />
                    Recommended Games
                  </h3>
                  {[
                    { title: 'Memory Game - Level 3', desc: 'Perfect for vocabulary practice', icon: '🧠' },
                    { title: 'Word Builder Challenge', desc: 'Build sentences with new words', icon: '🏗️' },
                    { title: 'Translation Tycoon', desc: 'Manage your translation empire', icon: '🏙️' }
                  ].map((game, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">{game.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-800">{game.title}</div>
                        <div className="text-xs text-slate-500">{game.desc}</div>
                      </div>
                      <Play className="h-4 w-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="container mx-auto px-4 pb-16">
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Gamify Your Classroom?</h3>
          <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
            Create your account now to be first in line when Games launch. Plus, get immediate access to our Shop and Blog resources!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              href="/auth/signup"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              🚀 Create Account - It's Free!
            </Link>
            <Link 
              href="/shop"
              className="bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-colors"
            >
              🛒 Explore Shop Resources
            </Link>
          </div>

          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              No credit card required
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              Instant access to Shop & Blog
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              Early access to Games
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center text-purple-300 hover:text-white transition-colors text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
} 