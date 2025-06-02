'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function FrenchLearningPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'vocabulary', label: 'Vocabulary' },
    { id: 'grammar', label: 'Grammar' },
    { id: 'exercises', label: 'Exercises' },
    { id: 'resources', label: 'Resources' },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 text-gradient-blue-purple">Learn French</h1>
        <p className="text-xl max-w-2xl mx-auto text-white/80">
          Discover the beauty of the French language with our comprehensive learning resources.
        </p>
      </div>

      {/* Section Navigation */}
      <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-4 mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeSection === section.id 
                  ? 'bg-white/20 text-white font-medium' 
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-indigo-900/20 backdrop-blur-sm rounded-lg p-6">
        {activeSection === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">French Language Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="mb-4">
                  French is a Romance language spoken by approximately 275 million people worldwide. 
                  It is the official language of 29 countries and is widely used in international diplomacy, 
                  cuisine, arts, and fashion.
                </p>
                <p className="mb-4">
                  Learning French opens doors to rich cultural experiences, enhances career opportunities, 
                  and allows you to connect with French-speaking communities around the world.
                </p>
                <Link href="/learn/french/about" className="gem-button inline-block mt-4">
                  Learn more about French
                </Link>
              </div>
              <div className="bg-indigo-800/40 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-pink-300">Quick Facts</h3>
                <ul className="space-y-2">
                  <li><span className="font-bold">Family:</span> Romance</li>
                  <li><span className="font-bold">Writing System:</span> Latin alphabet</li>
                  <li><span className="font-bold">Native Speakers:</span> ~80 million</li>
                  <li><span className="font-bold">Total Speakers:</span> ~275 million</li>
                  <li><span className="font-bold">Official Language in:</span> 29 countries</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'vocabulary' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">Essential French Vocabulary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-3 text-pink-300">Common Phrases</h3>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-indigo-700/50">
                      <td className="py-2 pr-4 font-medium">Bonjour</td>
                      <td className="py-2">Hello / Good day</td>
                    </tr>
                    <tr className="border-b border-indigo-700/50">
                      <td className="py-2 pr-4 font-medium">Au revoir</td>
                      <td className="py-2">Goodbye</td>
                    </tr>
                    <tr className="border-b border-indigo-700/50">
                      <td className="py-2 pr-4 font-medium">Merci</td>
                      <td className="py-2">Thank you</td>
                    </tr>
                    <tr className="border-b border-indigo-700/50">
                      <td className="py-2 pr-4 font-medium">S'il vous plaît</td>
                      <td className="py-2">Please</td>
                    </tr>
                    <tr className="border-b border-indigo-700/50">
                      <td className="py-2 pr-4 font-medium">Excusez-moi</td>
                      <td className="py-2">Excuse me</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-pink-300">Themed Vocabulary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/learn/daily-life" 
                    className="bg-indigo-800/40 p-3 rounded-lg hover:bg-indigo-700/40 transition-colors"
                  >
                    <h4 className="font-bold">Daily Life</h4>
                    <p className="text-sm text-white/70">Essential vocabulary for everyday situations</p>
                  </Link>
                  <Link 
                    href="/learn/food" 
                    className="bg-indigo-800/40 p-3 rounded-lg hover:bg-indigo-700/40 transition-colors"
                  >
                    <h4 className="font-bold">Food & Dining</h4>
                    <p className="text-sm text-white/70">Words for food, cooking, and restaurants</p>
                  </Link>
                  <Link 
                    href="/learn/travel" 
                    className="bg-indigo-800/40 p-3 rounded-lg hover:bg-indigo-700/40 transition-colors"
                  >
                    <h4 className="font-bold">Travel</h4>
                    <p className="text-sm text-white/70">Vocabulary for getting around in French-speaking countries</p>
                  </Link>
                  <Link 
                    href="/learn/business" 
                    className="bg-indigo-800/40 p-3 rounded-lg hover:bg-indigo-700/40 transition-colors"
                  >
                    <h4 className="font-bold">Business</h4>
                    <p className="text-sm text-white/70">Professional and business terminology</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'grammar' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">French Grammar Fundamentals</h2>
            <div className="space-y-6">
              <div className="bg-indigo-800/40 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-pink-300">Gender in French</h3>
                <p className="mb-2">
                  All French nouns are either masculine or feminine. This affects articles, adjectives, and some verb forms.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-bold mb-2">Masculine</h4>
                    <ul className="list-disc list-inside">
                      <li>le livre (the book)</li>
                      <li>un garçon (a boy)</li>
                      <li>le chat (the cat)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Feminine</h4>
                    <ul className="list-disc list-inside">
                      <li>la table (the table)</li>
                      <li>une fille (a girl)</li>
                      <li>la maison (the house)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-800/40 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-pink-300">Present Tense</h3>
                <p className="mb-4">
                  The present tense in French is used to express current actions or states.
                </p>
                <h4 className="font-bold mb-2">Conjugation of -er verbs (parler - to speak)</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div>je parle (I speak)</div>
                  <div>tu parles (you speak)</div>
                  <div>il/elle parle (he/she speaks)</div>
                  <div>nous parlons (we speak)</div>
                  <div>vous parlez (you speak)</div>
                  <div>ils/elles parlent (they speak)</div>
                </div>
              </div>
            </div>
            <Link
              href="/exercises/grammar"
              className="gem-button inline-block mt-6"
            >
              Practice Grammar Exercises
            </Link>
          </div>
        )}

        {activeSection === 'exercises' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">French Exercises</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link 
                href="/exercises/vocabulary" 
                className="bg-indigo-800/40 p-6 rounded-lg hover:bg-indigo-700/40 transition-colors text-center"
              >
                <div className="text-4xl mb-2">📚</div>
                <h3 className="text-xl font-bold mb-2">Vocabulary</h3>
                <p className="text-white/70">Build your French vocabulary with flashcards and quizzes</p>
              </Link>
              <Link 
                href="/exercises/listening" 
                className="bg-indigo-800/40 p-6 rounded-lg hover:bg-indigo-700/40 transition-colors text-center"
              >
                <div className="text-4xl mb-2">🎧</div>
                <h3 className="text-xl font-bold mb-2">Listening</h3>
                <p className="text-white/70">Improve your comprehension with audio exercises</p>
              </Link>
              <Link 
                href="/exercises/conversation" 
                className="bg-indigo-800/40 p-6 rounded-lg hover:bg-indigo-700/40 transition-colors text-center"
              >
                <div className="text-4xl mb-2">💬</div>
                <h3 className="text-xl font-bold mb-2">Conversation</h3>
                <p className="text-white/70">Practice dialogue patterns and improve fluency</p>
              </Link>
            </div>
            <div className="mt-8 text-center">
              <Link href="/games" className="gem-button">
                Play Language Games
              </Link>
            </div>
          </div>
        )}

        {activeSection === 'resources' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">French Learning Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-indigo-800/40 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-pink-300">Books & Media</h3>
                <ul className="space-y-4">
                  <li>
                    <div className="font-bold">Easy French Step-by-Step</div>
                    <p className="text-sm text-white/70">Perfect for beginners who want a solid foundation in grammar</p>
                  </li>
                  <li>
                    <div className="font-bold">Le Petit Prince (The Little Prince)</div>
                    <p className="text-sm text-white/70">A classic novel that's accessible for intermediate learners</p>
                  </li>
                  <li>
                    <div className="font-bold">French TV Series: "Call My Agent!" (Dix Pour Cent)</div>
                    <p className="text-sm text-white/70">A popular show about talent agents in Paris</p>
                  </li>
                </ul>
              </div>
              <div className="bg-indigo-800/40 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-pink-300">Online Resources</h3>
                <ul className="space-y-4">
                  <li>
                    <div className="font-bold">TV5Monde</div>
                    <p className="text-sm text-white/70">Free exercises based on French-language videos and news</p>
                  </li>
                  <li>
                    <div className="font-bold">Coffee Break French</div>
                    <p className="text-sm text-white/70">Podcast series for learners at various levels</p>
                  </li>
                  <li>
                    <div className="font-bold">Français Authentique</div>
                    <p className="text-sm text-white/70">YouTube channel with natural French explanations</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/premium"
                className="purple-gem-button"
              >
                Access Premium Resources
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 