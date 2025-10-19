'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  type: string;
  correct_answer: string;
  options?: string[];
  explanation?: string;
  hint?: string;
  difficulty?: string;
}

interface GrammarTestEditModalProps {
  contentId: string;
  language: string;
  category: string;
  topic: string;
  initialData: {
    title: string;
    difficulty_level: string;
    questions: Question[];
  };
  onClose: () => void;
  onSave: () => void;
}

export default function GrammarTestEditModal({
  contentId,
  language,
  category,
  topic,
  initialData,
  onClose,
  onSave,
}: GrammarTestEditModalProps) {
  const [title, setTitle] = useState(initialData.title);
  const [difficulty, setDifficulty] = useState(initialData.difficulty_level);
  const [questions, setQuestions] = useState<Question[]>(initialData.questions);
  const [saving, setSaving] = useState(false);
  const [showJsonImport, setShowJsonImport] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [importMode, setImportMode] = useState<'replace' | 'add'>('replace');

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      question: '',
      type: 'fill_blank',
      correct_answer: '',
      options: [],
      explanation: '',
      hint: '',
      difficulty: 'beginner',
    };
    setQuestions([...questions, newQuestion]);
  };

  const deleteQuestion = (index: number) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOptions = (index: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    const options = [...(updated[index].options || [])];
    options[optionIndex] = value;
    updated[index] = { ...updated[index], options };
    setQuestions(updated);
  };

  const addOption = (index: number) => {
    const updated = [...questions];
    const options = [...(updated[index].options || []), ''];
    updated[index] = { ...updated[index], options };
    setQuestions(updated);
  };

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    const options = (updated[questionIndex].options || []).filter((_, i) => i !== optionIndex);
    updated[questionIndex] = { ...updated[questionIndex], options };
    setQuestions(updated);
  };

  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed)) {
        // Validate and transform the questions
        const importedQuestions = parsed.map((q: any, index: number) => ({
          id: q.id || `q_${Date.now()}_${index}`,
          question: q.question || '',
          type: q.type || 'fill_blank',
          correct_answer: q.correct_answer || '',
          options: q.options || [],
          explanation: q.explanation || '',
          hint: q.hint || '',
          difficulty: q.difficulty || 'beginner',
        }));
        
        // Combine questions based on import mode
        const finalQuestions = importMode === 'add' 
          ? [...questions, ...importedQuestions] 
          : importedQuestions;
        
        setQuestions(finalQuestions);
        setShowJsonImport(false);
        setJsonInput('');
        setImportMode('replace'); // Reset to default
        
        const action = importMode === 'add' ? 'added' : 'imported';
        alert(`✅ Successfully ${action} ${importedQuestions.length} questions! Total: ${finalQuestions.length}`);
      } else {
        alert('❌ JSON must be an array of questions');
      }
    } catch (error) {
      alert('❌ Invalid JSON format. Please check your input.');
      console.error('JSON parse error:', error);
    }
  };

  const exportToJson = () => {
    const json = JSON.stringify(questions, null, 2);
    navigator.clipboard.writeText(json);
    alert('✅ Questions copied to clipboard as JSON!');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/grammar/test/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          language,
          category,
          topic,
          updates: {
            title,
            difficulty_level: difficulty,
            content_data: { questions },
            updated_at: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      alert(contentId === 'new' ? '✅ Test created successfully!' : '✅ Test updated successfully!');
      onSave();
    } catch (error) {
      console.error('Error saving test:', error);
      alert('❌ Failed to save test');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Edit Test</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Title and Difficulty */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Questions ({questions.length})
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={exportToJson}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Export JSON
                </button>
                <button
                  onClick={() => setShowJsonImport(!showJsonImport)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Import JSON
                </button>
                <button
                  onClick={addQuestion}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>
            </div>

            {/* JSON Import Section */}
            {showJsonImport && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Import Questions from JSON</h4>
                <p className="text-sm text-purple-700 mb-3">
                  Paste an array of question objects.
                </p>
                
                {/* Import Mode Toggle */}
                <div className="mb-4 flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Import Mode:</label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setImportMode('replace')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        importMode === 'replace'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      🔄 Replace All
                    </button>
                    <button
                      onClick={() => setImportMode('add')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        importMode === 'add'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      ➕ Add Questions
                    </button>
                  </div>
                  {questions.length > 0 && importMode === 'add' && (
                    <span className="text-sm text-gray-600">
                      ({questions.length} current)
                    </span>
                  )}
                </div>
                
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  rows={8}
                  placeholder='[{"id": "1", "question": "...", "type": "fill_blank", "correct_answer": "...", ...}]'
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleJsonImport}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    {importMode === 'add' ? '➕ Add Questions' : '🔄 Replace All'}
                  </button>
                  <button
                    onClick={() => {
                      setShowJsonImport(false);
                      setJsonInput('');
                      setImportMode('replace');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {questions.map((q, index) => (
              <div key={q.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Question {index + 1}</h4>
                  <button
                    onClick={() => deleteQuestion(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Text
                    </label>
                    <textarea
                      value={q.question}
                      onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={q.type}
                        onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="fill_blank">Fill Blank</option>
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="word_order">Word Order</option>
                        <option value="translation">Translation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correct Answer
                      </label>
                      <input
                        type="text"
                        value={q.correct_answer}
                        onChange={(e) => updateQuestion(index, 'correct_answer', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Difficulty
                      </label>
                      <select
                        value={q.difficulty}
                        onChange={(e) => updateQuestion(index, 'difficulty', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  {/* Options for multiple choice */}
                  {q.type === 'multiple_choice' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Options
                        </label>
                        <button
                          onClick={() => addOption(index)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          + Add Option
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(q.options || []).map((option, optIndex) => (
                          <div key={optIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOptions(index, optIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder={`Option ${optIndex + 1}`}
                            />
                            <button
                              onClick={() => deleteOption(index, optIndex)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hint
                      </label>
                      <input
                        type="text"
                        value={q.hint || ''}
                        onChange={(e) => updateQuestion(index, 'hint', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Explanation
                      </label>
                      <input
                        type="text"
                        value={q.explanation || ''}
                        onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

