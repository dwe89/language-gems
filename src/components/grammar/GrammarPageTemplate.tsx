'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Target, Award, Clock, Users, Gem, Star, Play, Music } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../ui/GemTheme';
import FlagIcon from '../ui/FlagIcon';
import VideoPlayer from '../youtube/VideoPlayer';
import { useAuth } from '../auth/AuthProvider';

interface Example {
  spanish?: string;
  french?: string;
  german?: string;
  english: string;
  highlight?: string[];
}

interface ConjugationTable {
  title: string;
  conjugations: {
    pronoun: string;
    form: string;
    english?: string;
  }[];
}

interface Section {
  title: string;
  content?: string;
  examples?: Example[];
  conjugationTable?: ConjugationTable;
  subsections?: {
    title: string;
    content?: string;
    examples?: Example[];
    conjugationTable?: ConjugationTable;
  }[];
}

interface GrammarPageProps {
  language: 'spanish' | 'french' | 'german';
  category: string;
  topic: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  sections: Section[];
  backUrl: string;
  practiceUrl?: string;
  quizUrl?: string;
  songUrl?: string;
  youtubeVideoId?: string;
  relatedTopics?: {
    title: string;
    url: string;
    difficulty: string;
  }[];
}

const LANGUAGE_INFO = {
  spanish: { name: 'Spanish', countryCode: 'ES', color: 'from-red-500 to-yellow-500' },
  french: { name: 'French', countryCode: 'FR', color: 'from-blue-500 to-white' },
  german: { name: 'German', countryCode: 'DE', color: 'from-black to-red-500' }
};

const DIFFICULTY_COLORS = {
  beginner: 'from-green-500 to-green-600',
  intermediate: 'from-yellow-500 to-orange-500',
  advanced: 'from-red-500 to-red-600'
};

export default function GrammarPageTemplate({
  language,
  category,
  topic,
  title,
  description,
  difficulty,
  estimatedTime,
  sections,
  backUrl,
  practiceUrl,
  quizUrl,
  songUrl,
  youtubeVideoId,
  relatedTopics = []
}: GrammarPageProps) {
  const { user } = useAuth();
  const languageInfo = LANGUAGE_INFO[language];

  const renderExample = (example: Example, index: number) => {
    // Get the text in the appropriate language
    const languageText = example[language] || example.spanish || example.french || example.german || '';
    
    return (
      <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-3 sm:p-4 md:p-6 rounded-xl shadow-sm">
        <div className="space-y-2 sm:space-y-3">
          <div className="text-base sm:text-lg font-semibold text-gray-800 break-words">
            {example.highlight ? (
              <span>
                {languageText.split(' ').map((word, i) => (
                  <span
                    key={i}
                    className={example.highlight?.includes(word) ? 'bg-yellow-300 px-1 sm:px-2 py-1 rounded-md font-bold' : ''}
                  >
                    {word}{' '}
                  </span>
                ))}
              </span>
            ) : (
              languageText
            )}
          </div>
          <div className="text-gray-600 italic text-sm sm:text-base break-words">{example.english}</div>
        </div>
      </div>
    );
  };

  const renderConjugationTable = (table: ConjugationTable) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 sm:p-4">
        <h4 className="text-base sm:text-lg font-semibold break-words">{table.title}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Pronoun</th>
              <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Conjugation</th>
              {table.conjugations[0]?.english && (
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">English</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.conjugations.map((conj, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">{conj.pronoun}</td>
                <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-xs sm:text-sm font-bold text-blue-600 break-words">{conj.form}</td>
                {conj.english && (
                  <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-600 italic break-words">{conj.english}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSection = (section: Section, index: number) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="mb-8 sm:mb-12"
    >
      <GemCard className="shadow-lg border border-gray-200">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 break-words">{section.title}</h2>
        <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none mb-4 sm:mb-6">
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: (section.content || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
          />
        </div>

        {section.conjugationTable && (
          <div className="mb-8">
            {renderConjugationTable(section.conjugationTable)}
          </div>
        )}

        {section.examples && section.examples.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500" />
              Examples
            </h3>
            <div className="grid gap-3 sm:gap-4">
              {section.examples.map(renderExample)}
            </div>
          </div>
        )}

        {section.subsections && section.subsections.map((subsection, subIndex) => (
          <div key={subIndex} className="mt-6 sm:mt-8 pl-3 sm:pl-6 border-l-2 sm:border-l-4 border-purple-200">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 break-words">{subsection.title}</h3>
            <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none mb-3 sm:mb-4">
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: (subsection.content || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
              />
            </div>

            {subsection.conjugationTable && (
              <div className="mb-4 sm:mb-6">
                {renderConjugationTable(subsection.conjugationTable)}
              </div>
            )}

            {subsection.examples && subsection.examples.length > 0 && (
              <div className="grid gap-3 sm:gap-4">
                {subsection.examples.map(renderExample)}
              </div>
            )}
          </div>
        ))}
      </GemCard>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex items-start sm:items-center space-x-2 sm:space-x-4">
              <Link
                href={backUrl}
                className="p-2 sm:p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors shadow-sm flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </Link>
              <div className="flex items-start sm:items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                <FlagIcon countryCode={languageInfo.countryCode} size="xl" className="flex-shrink-0" />
                <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg flex-shrink-0">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-2 break-words">{title}</h1>
                  <p className="text-gray-600 text-sm sm:text-base md:text-lg break-words">{description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap gap-2">
              <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r ${DIFFICULTY_COLORS[difficulty]} text-white shadow-lg whitespace-nowrap`}>
                {difficulty}
              </span>
              <div className="flex items-center space-x-1.5 sm:space-x-2 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-200 shadow-sm">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">{estimatedTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* YouTube Video Section */}
          {youtubeVideoId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 sm:mb-12"
            >
              <GemCard className="shadow-xl border border-gray-200">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg mr-3 sm:mr-4 flex-shrink-0">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 break-words">Learn with Video</h3>
                    <p className="text-sm sm:text-base text-gray-600 break-words">Watch our comprehensive video lesson</p>
                  </div>
                </div>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <VideoPlayer
                    videoId={youtubeVideoId}
                    autoplay={false}
                    height="100%"
                    width="100%"
                    language={language}
                  />
                </div>
              </GemCard>
            </motion.div>
          )}

          {/* Main Content */}
          <div className="mb-8 sm:mb-12">
            {sections.map(renderSection)}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12">
            {practiceUrl && (
              <GemButton
                variant="gem"
                gemType={user ? "rare" : "common"}
                onClick={() => window.location.href = practiceUrl}
                className="w-full text-sm sm:text-base"
              >
                <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {user ? 'Practice Exercises' : 'Free Practice'}
              </GemButton>
            )}
            {quizUrl && (
              <GemButton
                variant="gem"
                gemType={user ? "epic" : "common"}
                onClick={() => window.location.href = quizUrl}
                className="w-full text-sm sm:text-base"
              >
                <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {user ? 'Take Quiz' : 'Free Quiz'}
              </GemButton>
            )}

            {songUrl && (
              <GemButton
                variant="gem"
                gemType="legendary"
                onClick={() => window.location.href = songUrl}
                className="w-full text-sm sm:text-base"
              >
                <Music className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Learn with Song
              </GemButton>
            )}
          </div>

          {/* Related Topics */}
          {relatedTopics.length > 0 && (
            <GemCard className="shadow-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 break-words">Related Topics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {relatedTopics.map((topic, index) => (
                  <Link key={index} href={topic.url}>
                    <div className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-sm sm:text-base text-gray-800 break-words flex-1 min-w-0">{topic.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap flex-shrink-0 ${
                          topic.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                          topic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {topic.difficulty}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </GemCard>
          )}
        </div>
      </div>
    </div>
  );
}
