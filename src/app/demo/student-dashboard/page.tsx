'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Home, BookOpen, Trophy, BarChart3, Settings, Bell, Search,
  User, Menu, X, ChevronRight, Star, Flame, Zap, Crown,
  Calendar, Clock, Target, Award, Gem, Heart, Brain,
  PlayCircle, Gamepad2, ArrowRight, ArrowLeft,
  CheckCircle, AlertCircle, TrendingUp, Sparkles,
  Percent, BarChart2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  getDemoStudentData,
  DEMO_STUDENT_NOTIFICATIONS,
  ALL_DEMO_STUDENTS,
  DEMO_CLASSES,
} from '../../../lib/demo/demoData';
import { DemoProvider } from '../../../lib/demo/DemoContext';
import { GemRarity } from '../../../services/rewards/RewardEngine';

// =====================================================
// HELPER COMPONENTS
// =====================================================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  color: string;
  progress?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, color, progress }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
  >
    <div className={`absolute -inset-1 z-0 opacity-10 bg-gradient-to-br ${color} rounded-2xl`}></div>
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full bg-gradient-to-br ${color} shadow-md`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {progress !== undefined && (
          <div className="text-right">
            <div className="text-xs text-gray-500 font-medium">Progress</div>
            <div className="text-sm font-bold text-gray-900">{progress}%</div>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-base font-semibold text-gray-600">{title}</h3>
        <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      
      {progress !== undefined && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    </div>
  </motion.div>
);

const GemDisplay: React.FC<{ gemsByRarity: Record<GemRarity, number>; totalGems: number }> = ({ gemsByRarity, totalGems }) => {
  const rarityConfig = {
    new_discovery: { color: 'from-gray-400 to-gray-500', label: 'New', emoji: '✨' },
    common: { color: 'from-green-400 to-green-500', label: 'Common', emoji: '💚' },
    uncommon: { color: 'from-blue-400 to-blue-500', label: 'Uncommon', emoji: '💙' },
    rare: { color: 'from-purple-400 to-purple-500', label: 'Rare', emoji: '💜' },
    epic: { color: 'from-orange-400 to-orange-500', label: 'Epic', emoji: '🧡' },
    legendary: { color: 'from-yellow-400 to-yellow-500', label: 'Legendary', emoji: '💛' },
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
            <Gem className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Gem Collection</h3>
            <p className="text-sm text-gray-500">{totalGems} total gems</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {(Object.entries(rarityConfig) as [GemRarity, typeof rarityConfig[GemRarity]][]).map(([rarity, config]) => (
          <motion.div
            key={rarity}
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-br ${config.color} rounded-xl p-3 text-center text-white shadow-md`}
          >
            <div className="text-2xl mb-1">{config.emoji}</div>
            <div className="text-xl font-bold">{gemsByRarity[rarity] || 0}</div>
            <div className="text-xs opacity-90">{config.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const AssignmentCard: React.FC<{ assignment: any }> = ({ assignment }) => {
  const statusColors = {
    completed: 'bg-green-500 text-white',
    in_progress: 'bg-blue-500 text-white',
    not_started: 'bg-gray-400 text-white',
  };

  const statusGradients = {
    completed: 'from-green-500 to-emerald-600',
    in_progress: 'from-blue-600 to-indigo-600',
    not_started: 'from-gray-400 to-slate-500',
  };

  const statusKey = (assignment.status || 'not_started') as keyof typeof statusGradients;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group relative bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${statusGradients[statusKey]}`}></div>

      <div className="p-5 pt-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-lg font-bold text-gray-900 leading-snug flex-1">
            {assignment.title}
          </h3>
          <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusColors[statusKey]}`}>
            {statusKey.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Clock className="h-4 w-4 text-indigo-500" />
          <span className="font-medium">
            Due: {new Date(assignment.due_date).toLocaleDateString('en-GB')}
          </span>
        </div>

        {assignment.status === 'completed' && (
          <div className="mb-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center text-green-700">
                <Trophy className="h-4 w-4 mr-2" />
                <div>
                  <div className="font-semibold text-sm">{assignment.score}</div>
                  <div className="text-green-600">Score</div>
                </div>
              </div>
              <div className="flex items-center text-green-700">
                <Percent className="h-4 w-4 mr-2" />
                <div>
                  <div className="font-semibold text-sm">{assignment.bestAccuracy}%</div>
                  <div className="text-green-600">Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <button className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
          assignment.status === 'completed'
            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
        }`}>
          <span>{assignment.status === 'completed' ? 'Review' : 'Start'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

const AchievementBadge: React.FC<{ achievement: any }> = ({ achievement }) => {
  const rarityColors = {
    common: 'from-green-400 to-green-500 border-green-300',
    uncommon: 'from-blue-400 to-blue-500 border-blue-300',
    rare: 'from-purple-400 to-purple-500 border-purple-300',
    legendary: 'from-yellow-400 to-amber-500 border-yellow-300',
  };

  const colorClass = rarityColors[achievement.rarity as keyof typeof rarityColors] || rarityColors.common;

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 2 }}
      className={`bg-gradient-to-br ${colorClass} rounded-2xl p-4 text-center shadow-lg border-2`}
    >
      <div className="text-3xl mb-2">{achievement.icon}</div>
      <h4 className="font-bold text-white text-sm">{achievement.name}</h4>
      <p className="text-xs text-white/80 mt-1">{achievement.description}</p>
    </motion.div>
  );
};

const VocabularyWordCard: React.FC<{ word: any }> = ({ word }) => {
  const masteryColors = [
    'bg-gray-200',
    'bg-green-200',
    'bg-blue-200',
    'bg-purple-200',
    'bg-orange-200',
    'bg-yellow-200',
  ];

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-gray-900">{word.word}</span>
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i < word.mastery_level ? masteryColors[word.mastery_level] : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600">{word.translation}</p>
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>{word.category}</span>
        <span className={word.accuracy >= 70 ? 'text-green-600' : word.accuracy >= 50 ? 'text-amber-600' : 'text-red-600'}>
          {word.accuracy}% accuracy
        </span>
      </div>
    </div>
  );
};

// =====================================================
// CHART DATA HELPERS
// =====================================================

const getWeeklyProgressData = (sessions: any[]) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => ({
    name: day,
    sessions: Math.floor(Math.random() * 5) + 1,
    accuracy: 50 + Math.floor(Math.random() * 45),
    xp: 50 + Math.floor(Math.random() * 150),
  }));
};

const getSkillsRadarData = () => [
  { skill: 'Vocabulary', value: 78 },
  { skill: 'Grammar', value: 65 },
  { skill: 'Reading', value: 82 },
  { skill: 'Listening', value: 71 },
  { skill: 'Writing', value: 58 },
  { skill: 'Speaking', value: 63 },
];

// =====================================================
// MAIN COMPONENT
// =====================================================

function DemoStudentDashboardContent() {
  const [currentView, setCurrentView] = useState<'home' | 'assignments' | 'vocabulary' | 'achievements' | 'analytics'>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(ALL_DEMO_STUDENTS[0].id);

  const studentData = getDemoStudentData(selectedStudentId);
  const { student, class: classData, assignments, gameSessions, vocabularyProgress, achievements, gemsAnalytics, dashboardMetrics } = studentData;
  
  const weeklyProgressData = getWeeklyProgressData(gameSessions);
  const skillsRadarData = getSkillsRadarData();

  const navigationItems = [
    { id: 'home', label: 'Dashboard', icon: Home, color: 'from-blue-500 to-indigo-600' },
    { id: 'assignments', label: 'Assignments', icon: BookOpen, color: 'from-green-500 to-emerald-600' },
    { id: 'vocabulary', label: 'Vocabulary', icon: Brain, color: 'from-purple-500 to-pink-600' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, color: 'from-amber-500 to-orange-600' },
    { id: 'analytics', label: 'My Progress', icon: BarChart3, color: 'from-cyan-500 to-blue-600' },
  ];

  // =====================================================
  // RENDER METHODS
  // =====================================================

  const renderHome = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold mb-2">
                Welcome back, {student.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-lg text-white/90">
                You're doing great! Keep up the amazing work in {classData.language}.
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Flame className="h-5 w-5 text-orange-300" />
                  <span className="font-bold">{student.streak} day streak</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Crown className="h-5 w-5 text-yellow-300" />
                  <span className="font-bold">Level {student.level}</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-center">
                <div className="text-6xl mb-2">{classData.icon}</div>
                <div className="text-sm font-medium opacity-90">{classData.language}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total XP"
          value={student.xp.toLocaleString()}
          subtitle={`${1000 - (student.xp % 1000)} XP to next level`}
          icon={Zap}
          color="from-purple-500 to-indigo-600"
          progress={((student.xp % 1000) / 1000) * 100}
        />
        <StatCard
          title="Words Learned"
          value={student.wordsLearned}
          subtitle={`${dashboardMetrics.masteredWords} mastered`}
          icon={Brain}
          color="from-green-500 to-emerald-600"
        />
        <StatCard
          title="Accuracy"
          value={`${student.accuracy}%`}
          subtitle="Overall performance"
          icon={Target}
          color="from-blue-500 to-cyan-600"
        />
        <StatCard
          title="Assignments"
          value={`${student.assignmentsCompleted}/${assignments.length}`}
          subtitle="Completed"
          icon={CheckCircle}
          color="from-amber-500 to-orange-600"
          progress={(student.assignmentsCompleted / assignments.length) * 100}
        />
      </div>

      {/* Gem Collection & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GemDisplay gemsByRarity={gemsAnalytics.gemsByRarity} totalGems={student.totalGems} />

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Upcoming Assignments</h3>
            <button
              onClick={() => setCurrentView('assignments')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="space-y-3">
            {assignments.filter(a => a.status !== 'completed').slice(0, 3).map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Gamepad2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{assignment.title}</p>
                    <p className="text-xs text-gray-500">Due {new Date(assignment.due_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Weekly Progress</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyProgressData}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area type="monotone" dataKey="xp" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorXp)" name="XP Earned" />
              <Area type="monotone" dataKey="accuracy" stroke="#10b981" fillOpacity={1} fill="url(#colorAcc)" name="Accuracy %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Achievements</h3>
          <button
            onClick={() => setCurrentView('achievements')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.slice(0, 4).map((achievement) => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Assignments</h2>
        <div className="flex items-center space-x-3">
          <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Completed</option>
            <option>In Progress</option>
            <option>Not Started</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <AssignmentCard key={assignment.id} assignment={assignment} />
        ))}
      </div>
    </div>
  );

  const renderVocabulary = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Vocabulary</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-green-600">{dashboardMetrics.masteredWords}</span> mastered •{' '}
            <span className="font-semibold text-amber-600">{dashboardMetrics.wordsReadyForReview}</span> to review •{' '}
            <span className="font-semibold text-red-600">{dashboardMetrics.strugglingWords}</span> struggling
          </div>
        </div>
      </div>

      {/* Vocabulary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="h-8 w-8 opacity-80" />
            <span className="text-3xl font-bold">{dashboardMetrics.masteredWords}</span>
          </div>
          <h4 className="font-semibold">Mastered</h4>
          <p className="text-sm opacity-80">Words you know well</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <Brain className="h-8 w-8 opacity-80" />
            <span className="text-3xl font-bold">{dashboardMetrics.memoryStrength}%</span>
          </div>
          <h4 className="font-semibold">Memory Strength</h4>
          <p className="text-sm opacity-80">Average retention</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-8 w-8 opacity-80" />
            <span className="text-3xl font-bold">{dashboardMetrics.wordsReadyForReview}</span>
          </div>
          <h4 className="font-semibold">Ready for Review</h4>
          <p className="text-sm opacity-80">Words to practice</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="h-8 w-8 opacity-80" />
            <span className="text-3xl font-bold">{dashboardMetrics.strugglingWords}</span>
          </div>
          <h4 className="font-semibold">Struggling</h4>
          <p className="text-sm opacity-80">Need more practice</p>
        </div>
      </div>

      {/* Word Grid */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Word Collection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vocabularyProgress.slice(0, 12).map((word) => (
            <VocabularyWordCard key={word.id} word={word} />
          ))}
        </div>
        {vocabularyProgress.length > 12 && (
          <div className="text-center mt-6">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              View All {vocabularyProgress.length} Words
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Achievements</h2>
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-purple-600">{achievements.length}</span> earned
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {achievements.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Progress</h2>

      {/* Skills Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Skills Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillsRadarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} />
                <Radar name="Skills" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Game Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gameSessions.slice(0, 7).map((s, i) => ({
                name: `Day ${i + 1}`,
                score: s.score,
                accuracy: s.accuracy_percentage,
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="score" fill="#8b5cf6" name="Score" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Assessment Results */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Assessment Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {studentData.assessmentResults.map((result) => (
            <div key={result.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">{result.assessment_type.charAt(0).toUpperCase() + result.assessment_type.slice(1)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  result.percentage_score >= 80 ? 'bg-green-100 text-green-700' :
                  result.percentage_score >= 60 ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  Grade {result.gcse_grade}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{result.percentage_score}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    result.percentage_score >= 80 ? 'bg-green-500' :
                    result.percentage_score >= 60 ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${result.percentage_score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 text-center text-sm">
        <span className="font-semibold">🎭 Demo Mode</span> - You're viewing the Student Dashboard for{' '}
        <select
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          className="bg-white/20 rounded px-2 py-0.5 font-semibold border-0 text-white"
        >
          {ALL_DEMO_STUDENTS.slice(0, 10).map((s) => (
            <option key={s.id} value={s.id} className="text-gray-900">
              {s.name}
            </option>
          ))}
        </select>
        {' '}•{' '}
        <Link href="/demo" className="underline hover:no-underline">
          Back to Demo Home
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/demo" className="text-gray-400 hover:text-gray-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{student.name}</h1>
                  <p className="text-sm text-gray-500">{classData.icon} {classData.name}</p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {/* Level badge */}
              <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1.5 rounded-full">
                <Crown className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-bold text-purple-700">Lvl {student.level}</span>
              </div>

              {/* Gems */}
              <div className="flex items-center space-x-1 bg-amber-100 px-3 py-1.5 rounded-full">
                <Gem className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-bold text-amber-700">{student.totalGems}</span>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {DEMO_STUDENT_NOTIFICATIONS.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b sticky top-16 z-10 overflow-x-auto">
        <div className="flex px-4 py-2 space-x-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === item.id
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentView === 'home' && renderHome()}
            {currentView === 'assignments' && renderAssignments()}
            {currentView === 'vocabulary' && renderVocabulary()}
            {currentView === 'achievements' && renderAchievements()}
            {currentView === 'analytics' && renderAnalytics()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// =====================================================
// MAIN EXPORT
// =====================================================

export default function DemoStudentDashboard() {
  return (
    <DemoProvider initialMode="student">
      <DemoStudentDashboardContent />
    </DemoProvider>
  );
}
