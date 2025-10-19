'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import type {
  AQAReadingQuestion,
  QuestionType,
  AQATheme,
  AQATopic,
  LetterMatchingData,
  MultipleChoiceData,
  StudentGridData,
  OpenResponseData,
  TimeSequenceData,
  SentenceCompletionData,
  HeadlineMatchingData,
  TranslationData,
  OpinionRatingData,
} from '@/types/aqa-reading-admin';
import {
  LetterMatchingEditor,
  MultipleChoiceEditor,
  StudentGridEditor,
  OpenResponseEditor,
  TimeSequenceEditor,
  SentenceCompletionEditor,
  HeadlineMatchingEditor,
  TranslationEditor,
  OpinionRatingEditor,
} from './question-editors';

interface AQAQuestionEditorProps {
  questions: AQAReadingQuestion[];
  onChange: (questions: AQAReadingQuestion[]) => void;
}

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'letter-matching', label: 'Letter Matching' },
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'student-grid', label: 'Student Grid' },
  { value: 'open-response', label: 'Open Response' },
  { value: 'time-sequence', label: 'Time Sequence' },
  { value: 'sentence-completion', label: 'Sentence Completion' },
  { value: 'headline-matching', label: 'Headline Matching' },
  { value: 'translation', label: 'Translation' },
  { value: 'opinion-rating', label: 'Opinion Rating' },
];

const AQA_THEMES: AQATheme[] = [
  'Theme 1: People and lifestyle',
  'Theme 2: Popular culture',
  'Theme 3: Communication and the world around us',
];

const AQA_TOPICS: AQATopic[] = [
  'Identity and relationships with others',
  'Healthy living and lifestyle',
  'Education and work',
  'Free-time activities',
  'Customs, festivals and celebrations',
  'Celebrity culture',
  'Travel and tourism, including places of interest',
  'Media and technology',
  'The environment and where people live',
];

export default function AQAQuestionEditor({ questions, onChange }: AQAQuestionEditorProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set([0]));

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  const addQuestion = () => {
    const newQuestion: AQAReadingQuestion = {
      question_number: questions.length + 1,
      question_type: 'multiple-choice',
      title: `Question ${questions.length + 1}`,
      instructions: '',
      reading_text: '',
      question_data: { questions: [] } as MultipleChoiceData,
      marks: 1,
      theme: 'Theme 1: People and lifestyle',
      topic: 'Identity and relationships with others',
      difficulty_rating: 3,
    };
    onChange([...questions, newQuestion]);
    setExpandedQuestions(new Set([...expandedQuestions, questions.length]));
  };

  const updateQuestion = (index: number, updates: Partial<AQAReadingQuestion>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    onChange(newQuestions);
  };

  const deleteQuestion = (index: number) => {
    if (confirm('Are you sure you want to delete this question?')) {
      const newQuestions = questions.filter((_, i) => i !== index);
      // Renumber questions
      newQuestions.forEach((q, i) => {
        q.question_number = i + 1;
      });
      onChange(newQuestions);
    }
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[targetIndex]] = [
      newQuestions[targetIndex],
      newQuestions[index],
    ];

    // Renumber questions
    newQuestions.forEach((q, i) => {
      q.question_number = i + 1;
    });

    onChange(newQuestions);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Questions ({questions.length})
        </h3>
        <button
          onClick={addQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </button>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600">No questions yet. Click "Add Question" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((question, index) => (
            <QuestionCard
              key={index}
              question={question}
              index={index}
              isExpanded={expandedQuestions.has(index)}
              onToggleExpanded={() => toggleExpanded(index)}
              onUpdate={(updates) => updateQuestion(index, updates)}
              onDelete={() => deleteQuestion(index)}
              onMoveUp={() => moveQuestion(index, 'up')}
              onMoveDown={() => moveQuestion(index, 'down')}
              canMoveUp={index > 0}
              canMoveDown={index < questions.length - 1}
            />
          ))}
        </div>
      )}

      {/* Total Marks Display */}
      {questions.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total Marks:</span>
            <span className="text-2xl font-bold text-blue-600">
              {questions.reduce((sum, q) => sum + (q.marks || 0), 0)} / 50
            </span>
          </div>
          {questions.reduce((sum, q) => sum + (q.marks || 0), 0) !== 50 && (
            <p className="text-xs text-orange-600 mt-2">
              ⚠️ Warning: Total marks should equal 50
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface QuestionCardProps {
  question: AQAReadingQuestion;
  index: number;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onUpdate: (updates: Partial<AQAReadingQuestion>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

function QuestionCard({
  question,
  index,
  isExpanded,
  onToggleExpanded,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: QuestionCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      {/* Question Header */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 border-b border-gray-200">
        {/* Drag Handle */}
        <div className="flex flex-col gap-1">
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <GripVertical className="w-4 h-4 text-gray-400" />
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Question Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">Q{question.question_number}</span>
            <span className="text-sm text-gray-600">
              {QUESTION_TYPES.find((t) => t.value === question.question_type)?.label}
            </span>
            <span className="text-sm font-semibold text-blue-600">{question.marks} marks</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{question.title || 'Untitled question'}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleExpanded}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Question Details (Expanded) */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Basic Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Title
              </label>
              <input
                type="text"
                value={question.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Reading comprehension"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type
              </label>
              <select
                value={question.question_type}
                onChange={(e) => onUpdate({ question_type: e.target.value as QuestionType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {QUESTION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
            <textarea
              value={question.instructions}
              onChange={(e) => onUpdate({ instructions: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Instructions for the student..."
            />
          </div>

          {/* Reading Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reading Text (Optional)
            </label>
            <textarea
              value={question.reading_text || ''}
              onChange={(e) => onUpdate({ reading_text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-serif"
              rows={4}
              placeholder="The text students will read..."
            />
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
              <input
                type="number"
                min="1"
                max="20"
                value={question.marks}
                onChange={(e) => onUpdate({ marks: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={question.difficulty_rating || 3}
                onChange={(e) => onUpdate({ difficulty_rating: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">1 - Very Easy</option>
                <option value="2">2 - Easy</option>
                <option value="3">3 - Medium</option>
                <option value="4">4 - Hard</option>
                <option value="5">5 - Very Hard</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <select
                value={question.theme}
                onChange={(e) => onUpdate({ theme: e.target.value as AQATheme })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {AQA_THEMES.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
            <select
              value={question.topic}
              onChange={(e) => onUpdate({ topic: e.target.value as AQATopic })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {AQA_TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          {/* Question Type Specific Editor */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Question Content</h4>
            <QuestionDataEditor question={question} onUpdate={onUpdate} />
          </div>
        </div>
      )}
    </div>
  );
}

// Question Data Editor - Renders appropriate editor based on question type
function QuestionDataEditor({
  question,
  onUpdate,
}: {
  question: AQAReadingQuestion;
  onUpdate: (updates: Partial<AQAReadingQuestion>) => void;
}) {
  switch (question.question_type) {
    case 'letter-matching':
      return <LetterMatchingEditor question={question} onUpdate={onUpdate} />;
    case 'multiple-choice':
      return <MultipleChoiceEditor question={question} onUpdate={onUpdate} />;
    case 'student-grid':
      return <StudentGridEditor question={question} onUpdate={onUpdate} />;
    case 'open-response':
      return <OpenResponseEditor question={question} onUpdate={onUpdate} />;
    case 'time-sequence':
      return <TimeSequenceEditor question={question} onUpdate={onUpdate} />;
    case 'sentence-completion':
      return <SentenceCompletionEditor question={question} onUpdate={onUpdate} />;
    case 'headline-matching':
      return <HeadlineMatchingEditor question={question} onUpdate={onUpdate} />;
    case 'translation':
      return <TranslationEditor question={question} onUpdate={onUpdate} />;
    case 'opinion-rating':
      return <OpinionRatingEditor question={question} onUpdate={onUpdate} />;
    default:
      return <div className="text-gray-500 text-sm">Unknown question type</div>;
  }
}

