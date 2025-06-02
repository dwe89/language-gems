'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function JapaneseLearningPage() {
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
        <h1 className="text-4xl font-bold mb-4 text-gradient-blue-purple">Learn Japanese</h1>
        <p className="text-xl max-w-2xl mx-auto text-white/80">
          Discover the elegance and complexity of the Japanese language with our comprehensive learning resources.
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
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">Japanese Language Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="mb-4">
                  Japanese is the national language of Japan, spoken by about 125 million people. It is a 
                  language known for its complex writing system that combines three scripts: hiragana, 
                  katakana, and kanji.
                </p>
                <p className="mb-4">
                  Despite its reputation for difficulty, Japanese grammar follows logical patterns and the 
                  pronunciation is relatively straightforward. Learning Japanese opens doors to experiencing 
                  a rich cultural heritage spanning ancient traditions, modern pop culture, technology, and 
                  business opportunities.
                </p>
                <Link href="/learn/japanese/about" className="gem-button inline-block mt-4">
                  Learn more about Japanese
                </Link>
              </div>
              <div className="bg-indigo-800/40 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-pink-300">Quick Facts</h3>
                <ul className="space-y-2">
                  <li><span className="font-bold">Family:</span> Japonic</li>
                  <li><span className="font-bold">Writing System:</span> Hiragana, Katakana, Kanji</li>
                  <li><span className="font-bold">Native Speakers:</span> ~125 million</li>
                  <li><span className="font-bold">Official Language in:</span> Japan</li>
                  <li><span className="font-bold">Notable Feature:</span> Three writing systems</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'vocabulary' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">Essential Japanese Vocabulary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-3 text-pink-300">Common Phrases</h3>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-indigo-700/50">
                      <td className="py-2 pr-4 font-medium">こんにちは (Konnichiwa)</td>
                      <td className="py-2">Hello / Good afternoon</td>
                    </tr>
                    <tr className="border-b border-indigo-700/50">
                      <td className="py-2 pr-4 font-medium">さようなら (Sayōnara)</td>
                      <td className="py-2">Goodbye</td>
                    </tr>
                    <tr className="border-b border-indigo-700/50">
                      <td className="py-2 pr-4 font-medium">ありがとう (Arigatō)</td>
                      <td className="py-2">Thank you</td>
                    </tr>
                    <tr className="border-b border-indigo-700/50">
                      <td className="py-2 pr-4 font-medium">お願いします (Onegaishimasu)</td>
                      <td className="py-2">Please</td>
                    </tr>
                    <tr className="border-b border-indigo-700/50">
                      <td className="py-2 pr-4 font-medium">すみません (Sumimasen)</td>
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
                    <p className="text-sm text-white/70">Words for Japanese cuisine and dining out</p>
                  </Link>
                  <Link 
                    href="/learn/travel" 
                    className="bg-indigo-800/40 p-3 rounded-lg hover:bg-indigo-700/40 transition-colors"
                  >
                    <h4 className="font-bold">Travel</h4>
                    <p className="text-sm text-white/70">Vocabulary for getting around in Japan</p>
                  </Link>
                  <Link 
                    href="/learn/culture" 
                    className="bg-indigo-800/40 p-3 rounded-lg hover:bg-indigo-700/40 transition-colors"
                  >
                    <h4 className="font-bold">Culture</h4>
                    <p className="text-sm text-white/70">Terms related to Japanese traditions and customs</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'grammar' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">Japanese Grammar Fundamentals</h2>
            <div className="space-y-6">
              <div className="bg-indigo-800/40 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-pink-300">Basic Sentence Structure</h3>
                <p className="mb-2">
                  Japanese follows a Subject-Object-Verb (SOV) word order, unlike English's Subject-Verb-Object (SVO) structure.
                </p>
                <div className="mt-4">
                  <h4 className="font-bold mb-2">Example</h4>
                  <p className="mb-1">English: I eat sushi. (SVO)</p>
                  <p className="mb-1">Japanese: 私は寿司を食べます。(Watashi wa sushi o tabemasu.) (SOV)</p>
                  <p className="mt-3 text-sm text-white/70">Literally: I (subject) sushi (object) eat (verb).</p>
                </div>
              </div>

              <div className="bg-indigo-800/40 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-pink-300">Particles</h3>
                <p className="mb-4">
                  Particles are small words that follow nouns, verbs, or sentences to indicate their grammatical function.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold mb-2">は (wa) - Topic marker</h4>
                    <p className="text-sm">Marks the topic of the sentence</p>
                    <p className="mt-1 italic">私<span className="font-bold">は</span>学生です。(Watashi wa gakusei desu.)</p>
                    <p className="text-xs text-white/70">I am a student.</p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">を (o) - Object marker</h4>
                    <p className="text-sm">Marks the direct object of an action</p>
                    <p className="mt-1 italic">本<span className="font-bold">を</span>読みます。(Hon o yomimasu.)</p>
                    <p className="text-xs text-white/70">I read a book.</p>
                  </div>
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
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">Japanese Exercises</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link 
                href="/exercises/vocabulary" 
                className="bg-indigo-800/40 p-6 rounded-lg hover:bg-indigo-700/40 transition-colors text-center"
              >
                <div className="text-4xl mb-2">📚</div>
                <h3 className="text-xl font-bold mb-2">Vocabulary</h3>
                <p className="text-white/70">Learn hiragana, katakana, and essential kanji</p>
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
                href="/exercises/writing" 
                className="bg-indigo-800/40 p-6 rounded-lg hover:bg-indigo-700/40 transition-colors text-center"
              >
                <div className="text-4xl mb-2">✍️</div>
                <h3 className="text-xl font-bold mb-2">Writing</h3>
                <p className="text-white/70">Practice writing Japanese characters</p>
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
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">Japanese Learning Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-indigo-800/40 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-pink-300">Books & Media</h3>
                <ul className="space-y-4">
                  <li>
                    <div className="font-bold">Genki: An Integrated Course in Elementary Japanese</div>
                    <p className="text-sm text-white/70">A comprehensive textbook series for beginners</p>
                  </li>
                  <li>
                    <div className="font-bold">Japanese the Manga Way</div>
                    <p className="text-sm text-white/70">Learn grammar through manga examples</p>
                  </li>
                  <li>
                    <div className="font-bold">Terrace House</div>
                    <p className="text-sm text-white/70">A reality TV show with natural Japanese conversation</p>
                  </li>
                </ul>
              </div>
              <div className="bg-indigo-800/40 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-pink-300">Online Resources</h3>
                <ul className="space-y-4">
                  <li>
                    <div className="font-bold">Tae Kim's Guide to Japanese</div>
                    <p className="text-sm text-white/70">A free online grammar guide with a logical approach</p>
                  </li>
                  <li>
                    <div className="font-bold">WaniKani</div>
                    <p className="text-sm text-white/70">A spaced repetition system for learning kanji</p>
                  </li>
                  <li>
                    <div className="font-bold">NHK Easy Japanese</div>
                    <p className="text-sm text-white/70">News articles written in simple Japanese</p>
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