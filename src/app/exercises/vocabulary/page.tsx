'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function VocabularyExercisePage() {
  const [currentView, setCurrentView] = useState('overview');
  
  // Sample vocabulary sets
  const vocabularySets = [
    { id: 'beginner', title: 'Beginner Vocabulary', wordCount: 100, difficulty: 'Beginner' },
    { id: 'travel', title: 'Travel Phrases', wordCount: 75, difficulty: 'Beginner' },
    { id: 'food', title: 'Food & Dining', wordCount: 120, difficulty: 'Intermediate' },
    { id: 'business', title: 'Business Terminology', wordCount: 150, difficulty: 'Advanced' },
    { id: 'idioms', title: 'Common Idioms', wordCount: 60, difficulty: 'Advanced' },
  ];
  
  // Sample flashcards for demo
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const demoFlashcards = [
    { term: 'bonjour', definition: 'hello / good day', example: 'Bonjour, comment allez-vous?' },
    { term: 'au revoir', definition: 'goodbye', example: 'Au revoir, à demain!' },
    { term: 'merci', definition: 'thank you', example: 'Merci beaucoup pour votre aide.' },
    { term: 'excusez-moi', definition: 'excuse me', example: 'Excusez-moi, où est la bibliothèque?' },
    { term: 'je m\'appelle', definition: 'my name is', example: 'Je m\'appelle Marie.' },
  ];
  
  const nextCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % demoFlashcards.length);
  };
  
  const prevCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + demoFlashcards.length) % demoFlashcards.length);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 text-gradient-blue-purple">Vocabulary Exercises</h1>
        <p className="text-xl max-w-2xl mx-auto text-white/80">
          Build your vocabulary with interactive flashcards, quizzes, and games.
        </p>
      </div>
      
      <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-4 mb-8">
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setCurrentView('overview')}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentView === 'overview' 
                ? 'bg-white/20 text-white font-medium' 
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentView('flashcards')}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentView === 'flashcards' 
                ? 'bg-white/20 text-white font-medium' 
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setCurrentView('quizzes')}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentView === 'quizzes' 
                ? 'bg-white/20 text-white font-medium' 
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            Quizzes
          </button>
          <button
            onClick={() => setCurrentView('games')}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentView === 'games' 
                ? 'bg-white/20 text-white font-medium' 
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            Games
          </button>
        </div>
      </div>
      
      <div className="bg-indigo-900/20 backdrop-blur-sm rounded-lg p-6">
        {currentView === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-cyan-300">Available Vocabulary Sets</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vocabularySets.map((set) => (
                <div 
                  key={set.id} 
                  className="bg-indigo-800/40 p-4 rounded-lg hover:bg-indigo-700/40 transition-colors cursor-pointer"
                  onClick={() => setCurrentView('flashcards')}
                >
                  <h3 className="text-lg font-bold mb-2">{set.title}</h3>
                  <div className="flex justify-between text-sm text-white/70">
                    <span>{set.wordCount} words</span>
                    <span>{set.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-cyan-300">Why Learn Vocabulary?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-800/40 p-4 rounded-lg">
                  <h3 className="text-xl font-bold mb-3 text-pink-300">Benefits of Regular Practice</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Rapidly expand your usable vocabulary</li>
                    <li>Improve reading and listening comprehension</li>
                    <li>Build confidence in speaking and writing</li>
                    <li>Connect with native speakers more effectively</li>
                    <li>Understand cultural nuances through language</li>
                  </ul>
                </div>
                <div className="bg-indigo-800/40 p-4 rounded-lg">
                  <h3 className="text-xl font-bold mb-3 text-pink-300">Recommended Study Techniques</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Use spaced repetition for better retention</li>
                    <li>Learn words in context rather than in isolation</li>
                    <li>Practice with images for stronger associations</li>
                    <li>Group words by theme or grammatical function</li>
                    <li>Review before sleeping to enhance memory</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {currentView === 'flashcards' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-cyan-300">Flashcards</h2>
            
            <div className="max-w-xl mx-auto">
              <div className="relative h-64 bg-indigo-800/40 rounded-xl p-6 flex items-center justify-center mb-6">
                {/* Flashcard */}
                <div 
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => setShowAnswer(!showAnswer)}
                >
                  {!showAnswer ? (
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">{demoFlashcards[currentCardIndex].term}</div>
                      <p className="text-white/60 text-sm">Click to reveal answer</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2 text-cyan-300">{demoFlashcards[currentCardIndex].definition}</div>
                      <p className="italic text-white/80">"{demoFlashcards[currentCardIndex].example}"</p>
                    </div>
                  )}
                </div>
                
                {/* Card counter */}
                <div className="absolute bottom-2 left-0 right-0 text-center text-sm text-white/60">
                  Card {currentCardIndex + 1} of {demoFlashcards.length}
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={prevCard}
                  className="bg-indigo-700/60 hover:bg-indigo-700/80 px-4 py-2 rounded-full transition-colors"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="bg-cyan-700/60 hover:bg-cyan-700/80 px-4 py-2 rounded-full transition-colors"
                >
                  {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </button>
                <button 
                  onClick={nextCard}
                  className="bg-indigo-700/60 hover:bg-indigo-700/80 px-4 py-2 rounded-full transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
        
        {currentView === 'quizzes' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-cyan-300">Vocabulary Quizzes</h2>
            <div className="text-center mb-8">
              <p className="text-lg max-w-2xl mx-auto mb-6 text-white/80">
                Test your knowledge with interactive quizzes across different difficulty levels and topics.
              </p>
              <Link 
                href="/premium" 
                className="purple-gem-button"
              >
                Access Full Quiz Collection (Premium)
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-indigo-800/40 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Multiple Choice</h3>
                <p className="mb-4 text-white/70">Choose the correct translation or definition from options.</p>
                <button className="gem-button w-full">Start Demo Quiz</button>
              </div>
              <div className="bg-indigo-800/40 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Fill in the Blank</h3>
                <p className="mb-4 text-white/70">Complete sentences with the appropriate vocabulary words.</p>
                <button className="gem-button w-full">Start Demo Quiz</button>
              </div>
            </div>
          </div>
        )}
        
        {currentView === 'games' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-cyan-300">Vocabulary Games</h2>
            <div className="text-center mb-8">
              <p className="text-lg max-w-2xl mx-auto mb-6 text-white/80">
                Make learning fun with interactive games that reinforce vocabulary while you play.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/games/hangman" className="block bg-purple-500 p-6 rounded-lg text-center hover:bg-purple-600 transition-colors">
                <div className="text-4xl mb-3">🎮</div>
                <h3 className="text-xl font-bold mb-2">Hangman</h3>
                <p className="text-white/80">Guess the hidden word before time runs out!</p>
              </Link>
              <Link href="/games/memory-game" className="block bg-blue-500 p-6 rounded-lg text-center hover:bg-blue-600 transition-colors">
                <div className="text-4xl mb-3">🧠</div>
                <h3 className="text-xl font-bold mb-2">Memory Match</h3>
                <p className="text-white/80">Pair words with their translations or images.</p>
              </Link>
              <Link href="/games" className="block bg-emerald-600 p-6 rounded-lg text-center hover:bg-emerald-700 transition-colors">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl font-bold mb-2">More Games</h3>
                <p className="text-white/80">Explore all language learning games.</p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 