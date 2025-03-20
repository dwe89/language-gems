'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function GermanLearningPage() {
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
        <h1 className="text-4xl font-bold mb-4 text-gradient-blue-purple">Learn German</h1>
        <p className="text-xl max-w-2xl mx-auto text-white/80">
          Discover the precision and beauty of the German language with our comprehensive learning resources.
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
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">German Language Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="mb-4">
                  German is a West Germanic language spoken by approximately 95 million native speakers and 
                  80 million non-native speakers worldwide. It is the official language of Germany, Austria, 
                  and one of the official languages of Switzerland, Liechtenstein, Luxembourg, and Belgium.
                </p>
                <p className="mb-4">
                  Known for its compound words and precise grammar, German is a valuable language for business, 
                  science, philosophy, and engineering fields. It's also the second most commonly used scientific 
                  language and has contributed significantly to literature and thought.
                </p>
                <Link href="/learn/german/about" className="gem-button inline-block mt-4">
                  Learn more about German
                </Link>
              </div>
              <div className="bg-indigo-800/40 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-pink-300">Quick Facts</h3>
                <ul className="space-y-2">
                  <li><span className="font-bold">Family:</span> Indo-European, Germanic</li>
                  <li><span className="font-bold">Writing System:</span> Latin alphabet</li>
                  <li><span className="font-bold">Native Speakers:</span> ~95 million</li>
                  <li><span className="font-bold">Total Speakers:</span> ~175 million</li>
                  <li><span className="font-bold">Official Language in:</span> 6 countries</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'vocabulary' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">Essential German Vocabulary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-3 text-pink-300">Common Phrases</h3>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-indigo-700/50">
                      <td className="py-2 pr-4 font-medium">Hallo</td>
                      <td className="py-2">Hello</td>
                    </tr>
                    <tr className="border-b border-indigo-700/50">
                      <td className="py-2 pr-4 font-medium">Auf Wiedersehen</td>
                      <td className="py-2">Goodbye</td>
                    </tr>
                    <tr className="border-b border-indigo-700/50">
                      <td className="py-2 pr-4 font-medium">Danke</td>
                      <td className="py-2">Thank you</td>
                    </tr>
                    <tr className="border-b border-indigo-700/50">
                      <td className="py-2 pr-4 font-medium">Bitte</td>
                      <td className="py-2">Please / You're welcome</td>
                    </tr>
                    <tr className="border-b border-indigo-700/50">
                      <td className="py-2 pr-4 font-medium">Entschuldigung</td>
                      <td className="py-2">Excuse me / I'm sorry</td>
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
                    <p className="text-sm text-white/70">Vocabulary for getting around in German-speaking countries</p>
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
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">German Grammar Fundamentals</h2>
            <div className="space-y-6">
              <div className="bg-indigo-800/40 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-pink-300">Grammatical Gender</h3>
                <p className="mb-2">
                  German has three grammatical genders: masculine, feminine, and neuter. Each noun is assigned one of these genders.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <h4 className="font-bold mb-2">Masculine (der)</h4>
                    <ul className="list-disc list-inside">
                      <li>der Mann (the man)</li>
                      <li>der Tisch (the table)</li>
                      <li>der Wein (the wine)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Feminine (die)</h4>
                    <ul className="list-disc list-inside">
                      <li>die Frau (the woman)</li>
                      <li>die Tasche (the bag)</li>
                      <li>die Milch (the milk)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Neuter (das)</h4>
                    <ul className="list-disc list-inside">
                      <li>das Kind (the child)</li>
                      <li>das Buch (the book)</li>
                      <li>das Wasser (the water)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-800/40 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-pink-300">Cases in German</h3>
                <p className="mb-4">
                  German uses four cases to indicate a noun's role in a sentence: Nominative (subject), Accusative (direct object), 
                  Dative (indirect object), and Genitive (possession).
                </p>
                <h4 className="font-bold mb-2">Example with "der Mann" (the man)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>Nominative: <strong>Der</strong> Mann ist hier. (The man is here.)</div>
                  <div>Accusative: Ich sehe <strong>den</strong> Mann. (I see the man.)</div>
                  <div>Dative: Ich gebe <strong>dem</strong> Mann ein Buch. (I give the man a book.)</div>
                  <div>Genitive: Das Auto <strong>des</strong> Mannes ist rot. (The man's car is red.)</div>
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
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">German Exercises</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link 
                href="/exercises/vocabulary" 
                className="bg-indigo-800/40 p-6 rounded-lg hover:bg-indigo-700/40 transition-colors text-center"
              >
                <div className="text-4xl mb-2">📚</div>
                <h3 className="text-xl font-bold mb-2">Vocabulary</h3>
                <p className="text-white/70">Build your German vocabulary with flashcards and quizzes</p>
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
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">German Learning Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-indigo-800/40 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-pink-300">Books & Media</h3>
                <ul className="space-y-4">
                  <li>
                    <div className="font-bold">Hammer's German Grammar and Usage</div>
                    <p className="text-sm text-white/70">A comprehensive reference for German grammar</p>
                  </li>
                  <li>
                    <div className="font-bold">Der Vorleser (The Reader)</div>
                    <p className="text-sm text-white/70">A novel by Bernhard Schlink suitable for intermediate learners</p>
                  </li>
                  <li>
                    <div className="font-bold">TV Series: "Dark"</div>
                    <p className="text-sm text-white/70">A popular German Netflix series with complex storytelling</p>
                  </li>
                </ul>
              </div>
              <div className="bg-indigo-800/40 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-pink-300">Online Resources</h3>
                <ul className="space-y-4">
                  <li>
                    <div className="font-bold">Deutsche Welle</div>
                    <p className="text-sm text-white/70">Free German courses for all levels with news and cultural content</p>
                  </li>
                  <li>
                    <div className="font-bold">Coffee Break German</div>
                    <p className="text-sm text-white/70">Podcast series for learners at various levels</p>
                  </li>
                  <li>
                    <div className="font-bold">Easy German</div>
                    <p className="text-sm text-white/70">YouTube channel with authentic German street interviews</p>
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