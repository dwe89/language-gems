'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Circle,
  Lightbulb,
  Target,
  Award,
  Clock,
  Volume2,
  Eye,
  EyeOff,
  Gem,
  Star
} from 'lucide-react';
import { GemButton, GemCard } from '../ui/GemTheme';
import InteractiveConjugationTable from './InteractiveConjugationTable';

interface LessonSection {
  id: string;
  type: 'explanation' | 'example' | 'practice' | 'summary';
  title: string;
  content: string;
  visual_aids?: Array<{
    type: 'highlight_box' | 'info_box' | 'warning_box';
    content: string;
  }>;
  conjugation_table?: {
    verb: string;
    translation: string;
    stem: string;
    conjugations: Array<{
      person: string;
      form: string;
      translation: string;
      audio_url?: string;
    }>;
  };
  grammar_table?: {
    headers: string[];
    rows: string[][];
  };
  subsections?: Array<{
    title: string;
    content: string;
    examples?: Array<{
      text: string;
      translation: string;
    }>;
  }>;
  examples?: Array<{
    text: string;
    translation: string;
    audio_url?: string;
    highlight?: string[];
  }>;
  practice_items?: Array<{
    question: string;
    options?: string[];
    correct_answer: string;
    explanation: string;
    hint?: string;
  }>;
}

interface GrammarLessonData {
  id: string;
  title: string;
  description: string;
  difficulty_level: string;
  estimated_duration: number;
  learning_objectives: string[];
  sections: LessonSection[];
}

interface GrammarContentData {
  id: string;
  topic_id: string;
  content_type: string;
  title: string;
  content_data: {
    sections: LessonSection[];
  };
  difficulty_level: string;
  estimated_duration: number;
}

interface GrammarLessonProps {
  lessonData?: GrammarLessonData;
  contentData?: GrammarContentData;
  onComplete: (score: number, timeSpent: number, gemsEarned: number) => void;
  onExit: () => void;
  userId?: string;
  isAssignmentMode?: boolean;
}

export default function GrammarLesson({
  lessonData,
  contentData,
  onComplete,
  onExit,
  userId,
  isAssignmentMode = false
}: GrammarLessonProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  const [startTime] = useState(Date.now());
  const [showTranslations, setShowTranslations] = useState<Record<string, boolean>>({});
  const [gemsEarned, setGemsEarned] = useState(0);
  const [interactionCount, setInteractionCount] = useState(0);

  // Use contentData if available, otherwise fall back to lessonData
  const sections = contentData?.content_data?.sections || lessonData?.sections || [];
  const title = contentData?.title || lessonData?.title || 'Grammar Lesson';
  const estimatedDuration = contentData?.estimated_duration || lessonData?.estimated_duration || 15;

  // Guard against empty sections
  if (sections.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <GemCard className="max-w-md w-full text-center">
          <div className="text-gray-500 mb-4">
            <Target className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg">No lesson content available</p>
            <p className="text-sm">Please try again later or contact support if this persists.</p>
          </div>
          <GemButton variant="gem" gemType="common" onClick={onExit}>
            Return to Menu
          </GemButton>
        </GemCard>
      </div>
    );
  }

  const currentSectionData = sections[currentSection];
  const isLastSection = currentSection === sections.length - 1;
  const isFirstSection = currentSection === 0;

  const handleSectionComplete = async () => {
    setCompletedSections(prev => new Set([...prev, currentSection]));

    // Award gems for section completion
    const sectionGems = calculateSectionGems();
    setGemsEarned(prev => prev + sectionGems);

    // Save progress to database
    if (contentData && userId) {
      await saveProgress();
    }

    if (isLastSection) {
      // Calculate final score and time
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      const score = calculateScore();
      onComplete(score, timeSpent, gemsEarned + sectionGems);
    } else {
      setCurrentSection(prev => prev + 1);
    }
  };

  const calculateSectionGems = () => {
    // For assignment mode, award fixed gems per lesson completion
    if (isAssignmentMode) {
      return isLastSection ? 10 : 2; // 10 gems for completing the lesson, 2 per section
    }

    // For free play mode, use dynamic calculation
    const baseGems = 2;
    const practiceBonus = currentSectionData?.type === 'practice' ? 3 : 0;
    const interactionBonus = Math.min(interactionCount, 5);
    return baseGems + practiceBonus + interactionBonus;
  };

  const saveProgress = async () => {
    try {
      const progressData = {
        content_id: contentData!.id,
        status: isLastSection ? 'completed' : 'in_progress',
        score: calculateScore(),
        time_spent_seconds: Math.round((Date.now() - startTime) / 1000),
        progress_data: {
          current_section: currentSection,
          completed_sections: Array.from(completedSections),
          practice_answers: practiceAnswers,
          gems_earned: gemsEarned,
          interactions: interactionCount
        }
      };

      await fetch('/api/grammar/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData)
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const calculateScore = () => {
    const practiceQuestions = sections
      .filter(section => section.type === 'practice')
      .flatMap(section => section.practice_items || []);

    if (practiceQuestions.length === 0) return 100;

    const correctAnswers = practiceQuestions.filter(item =>
      practiceAnswers[item.question] === item.correct_answer
    ).length;

    return Math.round((correctAnswers / practiceQuestions.length) * 100);
  };

  const handlePracticeAnswer = (question: string, answer: string) => {
    setPracticeAnswers(prev => ({
      ...prev,
      [question]: answer
    }));
    setInteractionCount(prev => prev + 1);
  };

  const toggleAnswerVisibility = (question: string) => {
    setShowAnswers(prev => ({
      ...prev,
      [question]: !prev[question]
    }));
  };

  const toggleTranslation = (exampleId: string) => {
    setShowTranslations(prev => ({
      ...prev,
      [exampleId]: !prev[exampleId]
    }));
  };

  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(console.error);
    }
  };

  const renderSection = () => {
    if (!currentSectionData) return null;

    // Handle database content structure (no type field)
    if (!currentSectionData.type) {
      return (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Grammar Explanation</h3>
            </div>
            <div className="prose prose-blue max-w-none mb-4">
              <p className="text-gray-700">{currentSectionData.content}</p>
            </div>

            {/* Examples */}
            {(currentSectionData as any).examples && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Examples</h4>
                <div className="space-y-4">
                  {(currentSectionData as any).examples.map((example: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-lg font-medium text-gray-900">
                          {example.spanish}
                        </p>
                      </div>
                      <p className="text-gray-600 mb-2">{example.english}</p>
                      {example.explanation && (
                        <p className="text-sm text-blue-600 italic">{example.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vocabulary */}
            {(currentSectionData as any).vocabulary && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Vocabulary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(currentSectionData as any).vocabulary.map((vocab: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-purple-100">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-lg font-medium text-purple-900">
                          {vocab.spanish}
                        </p>
                      </div>
                      <p className="text-gray-600 mb-2">{vocab.english}</p>
                      {vocab.example && (
                        <p className="text-sm text-gray-500 italic">{vocab.example}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    switch (currentSectionData.type) {
      case 'explanation':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Grammar Explanation</h3>
              </div>
              <div
                className="prose prose-blue max-w-none mb-4"
                dangerouslySetInnerHTML={{ __html: currentSectionData.content }}
              />

              {/* Visual Aids */}
              {currentSectionData.visual_aids?.map((aid, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    aid.type === 'highlight_box' ? 'bg-yellow-50 border-yellow-400' :
                    aid.type === 'info_box' ? 'bg-blue-50 border-blue-400' :
                    'bg-red-50 border-red-400'
                  }`}
                >
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: aid.content }}
                  />
                </div>
              ))}

              {/* Interactive Conjugation Table */}
              {currentSectionData.conjugation_table && (
                <div className="mt-6">
                  <InteractiveConjugationTable
                    data={currentSectionData.conjugation_table}
                    onConjugationClick={(conjugation) => {
                      setInteractionCount(prev => prev + 1);
                      if (conjugation.audio_url) {
                        const audio = new Audio(conjugation.audio_url);
                        audio.play().catch(console.error);
                      }
                    }}
                  />
                </div>
              )}

              {/* Grammar Table */}
              {currentSectionData.grammar_table && (
                <div className="mt-6">
                  <GemCard className="overflow-hidden">
                    <div className="p-4">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gradient-to-r from-purple-500 to-blue-500">
                              {currentSectionData.grammar_table.headers.map((header, index) => (
                                <th
                                  key={index}
                                  className="border border-purple-300 px-4 py-3 text-left font-semibold text-white"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {currentSectionData.grammar_table.rows.map((row, rowIndex) => (
                              <tr
                                key={rowIndex}
                                className={`${
                                  rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                } hover:bg-purple-50 transition-colors`}
                              >
                                {row.map((cell, cellIndex) => (
                                  <td
                                    key={cellIndex}
                                    className="border border-gray-300 px-4 py-3 text-gray-800"
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </GemCard>
                </div>
              )}

              {/* Subsections */}
              {currentSectionData.subsections && (
                <div className="mt-6 space-y-4">
                  {currentSectionData.subsections.map((subsection, index) => (
                    <GemCard key={index} className="p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </span>
                        {subsection.title}
                      </h4>
                      <div 
                        className="text-gray-700 mb-4"
                        dangerouslySetInnerHTML={{ __html: subsection.content }}
                      />
                      {subsection.examples && (
                        <div className="space-y-2">
                          {subsection.examples.map((example, exampleIndex) => (
                            <div 
                              key={exampleIndex} 
                              className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg"
                            >
                              <p className="font-medium text-blue-900">{example.text}</p>
                              <p className="text-blue-700 text-sm italic">{example.translation}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </GemCard>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'example':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900">Examples</h3>
              </div>
              
              <div className="space-y-4">
                {currentSectionData.examples?.map((example, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-lg font-medium text-gray-900">
                        {example.text}
                      </p>
                      <div className="flex items-center space-x-2">
                        {example.audio_url && (
                          <button
                            onClick={() => playAudio(example.audio_url!)}
                            className="p-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
                          >
                            <Volume2 className="w-4 h-4 text-green-600" />
                          </button>
                        )}
                        <button
                          onClick={() => toggleTranslation(`${currentSection}-${index}`)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          {showTranslations[`${currentSection}-${index}`] ? (
                            <EyeOff className="w-4 h-4 text-gray-600" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {showTranslations[`${currentSection}-${index}`] && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-gray-600 italic"
                        >
                          {example.translation}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'practice':
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-900">Practice Exercises</h3>
              </div>
              
              <div className="space-y-6">
                {currentSectionData.practice_items?.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-purple-100">
                    <h4 className="font-medium text-gray-900 mb-3">{item.question}</h4>
                    
                    {item.options ? (
                      <div className="space-y-2">
                        {item.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                          >
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={option}
                              checked={practiceAnswers[item.question] === option}
                              onChange={() => handlePracticeAnswer(item.question, option)}
                              className="text-purple-600"
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="text"
                        placeholder="Type your answer..."
                        value={practiceAnswers[item.question] || ''}
                        onChange={(e) => handlePracticeAnswer(item.question, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    )}
                    
                    {practiceAnswers[item.question] && (
                      <div className="mt-3">
                        <GemButton
                          variant="secondary"
                          size="sm"
                          onClick={() => toggleAnswerVisibility(item.question)}
                        >
                          {showAnswers[item.question] ? 'Hide Answer' : 'Show Answer'}
                        </GemButton>
                        
                        <AnimatePresence>
                          {showAnswers[item.question] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                Correct Answer: {item.correct_answer}
                              </p>
                              <p className="text-sm text-gray-600">{item.explanation}</p>
                              {practiceAnswers[item.question] === item.correct_answer && (
                                <div className="flex items-center space-x-2 mt-2 text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-sm font-medium">Correct!</span>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-yellow-900">Lesson Summary</h3>
              </div>
              
              <div 
                className="prose prose-yellow max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: currentSectionData.content }}
              />
              
              <div className="bg-white rounded-lg p-4 border border-yellow-100">
                <h4 className="font-semibold text-gray-900 mb-3">What you've learned:</h4>
                <ul className="space-y-2">
                  {(lessonData?.learning_objectives || []).map((objective, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onExit}
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                <p className="text-sm text-gray-600">
                  Section {currentSection + 1} of {sections.length}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200">
                <Clock className="w-4 h-4" />
                <span>~{estimatedDuration} min</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-purple-600 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
                <Gem className="w-4 h-4" />
                <span>{gemsEarned} gems</span>
              </div>
              <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200">
                {completedSections.size}/{sections.length} completed
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <GemCard className="mb-8 shadow-xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                {currentSectionData.title}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="capitalize bg-gray-100 px-3 py-1 rounded-full">{currentSectionData.type}</span>
                <span>•</span>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Step {currentSection + 1}</span>
              </div>
            </div>

            {renderSection()}
          </GemCard>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <GemButton
              variant="secondary"
              onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
              disabled={isFirstSection}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </GemButton>
            
            <div className="flex items-center space-x-2">
              {sections.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSection
                      ? 'bg-purple-500'
                      : completedSections.has(index)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <GemButton
              variant="gem"
              gemType="rare"
              onClick={handleSectionComplete}
            >
              {isLastSection ? 'Complete Lesson' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </GemButton>
          </div>
        </div>
      </div>
    </div>
  );
}
