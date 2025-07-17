import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Gamepad2, Clock, Users } from 'lucide-react';

const SPANISH_VOCABULARY_GAMES = [
  {
    id: 'spanish-word-match',
    name: 'Spanish Word Match',
    description: 'Match Spanish words with their English translations',
    difficulty: 'Beginner',
    duration: '5-10 min',
    players: 'Single Player'
  },
  {
    id: 'spanish-crossword',
    name: 'Spanish Crossword Puzzles',
    description: 'Interactive crossword puzzles with Spanish vocabulary',
    difficulty: 'Intermediate',
    duration: '15-20 min',
    players: 'Single Player'
  },
  {
    id: 'spanish-memory-cards',
    name: 'Spanish Memory Cards',
    description: 'Flip cards to match Spanish words with images',
    difficulty: 'Beginner',
    duration: '10-15 min',
    players: 'Single Player'
  },
  {
    id: 'spanish-word-builder',
    name: 'Spanish Word Builder',
    description: 'Build Spanish words from scrambled letters',
    difficulty: 'Intermediate',
    duration: '8-12 min',
    players: 'Single Player'
  },
  {
    id: 'spanish-quiz-challenge',
    name: 'Spanish Quiz Challenge',
    description: 'Timed Spanish vocabulary quizzes with scoring',
    difficulty: 'All Levels',
    duration: '5-15 min',
    players: 'Single/Multi Player'
  },
  {
    id: 'spanish-story-builder',
    name: 'Spanish Story Builder',
    description: 'Create stories using Spanish vocabulary words',
    difficulty: 'Advanced',
    duration: '20-30 min',
    players: 'Single Player'
  }
];

export default function SpanishVocabularyGamesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/resources" className="text-green-600 hover:text-green-700">Resources</Link>
          <span className="text-slate-400">/</span>
          <Link href="/resources/skills" className="text-green-600 hover:text-green-700">Skills</Link>
          <span className="text-slate-400">/</span>
          <Link href="/resources/skills/spanish" className="text-green-600 hover:text-green-700">Spanish</Link>
          <span className="text-slate-400">/</span>
          <Link href="/resources/skills/spanish/vocabulary" className="text-green-600 hover:text-green-700">Vocabulary</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600">Games</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/resources/skills/spanish/vocabulary" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Spanish Vocabulary Games</h1>
              <p className="text-slate-600 mt-2">Interactive Spanish vocabulary games and activities</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              <span>{SPANISH_VOCABULARY_GAMES.length} Games Available</span>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPANISH_VOCABULARY_GAMES.map((game) => (
            <div key={game.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-800">{game.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    game.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    game.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    game.difficulty === 'All Levels' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {game.difficulty}
                  </span>
                </div>
                
                <p className="text-slate-600 mb-4 text-sm">{game.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-500">{game.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-500">{game.players}</span>
                  </div>
                </div>
                
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                  <Gamepad2 className="h-4 w-4" />
                  Play Spanish Game
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}