'use client';

import React, { useState } from 'react';
import { FileText, Download, Loader2, Sparkles, BookOpen, PenTool, CheckCircle, AlertCircle } from 'lucide-react';

interface WorksheetFormData {
  subject: string;
  language: string;
  level: string;
  topic: string;
  worksheetType: 'grammar' | 'vocabulary' | 'mixed';
  exerciseTypes: string[];
  customPrompt: string;
}

interface GeneratedWorksheet {
  title: string;
  html: string;
  filename: string;
}

export default function AdminWorksheetsPage() {
  const [formData, setFormData] = useState<WorksheetFormData>({
    subject: 'Spanish',
    language: 'Spanish',
    level: 'Beginner',
    topic: '',
    worksheetType: 'grammar',
    exerciseTypes: ['fill-blank', 'multiple-choice'],
    customPrompt: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState<GeneratedWorksheet | null>(null);
  const [error, setError] = useState<string>('');

  const subjects = ['Spanish', 'French', 'Italian', 'German', 'Portuguese'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'GCSE Foundation', 'GCSE Higher', 'A-Level'];
  const exerciseTypeOptions = [
    { id: 'fill-blank', label: 'Fill in the Blanks' },
    { id: 'multiple-choice', label: 'Multiple Choice' },
    { id: 'translation', label: 'Translation' },
    { id: 'conjugation', label: 'Verb Conjugation' },
    { id: 'short-answer', label: 'Short Answer' }
  ];

  const handleExerciseTypeChange = (exerciseId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        exerciseTypes: [...prev.exerciseTypes, exerciseId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        exerciseTypes: prev.exerciseTypes.filter(id => id !== exerciseId)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');
    setGeneratedWorksheet(null);

    try {
      const response = await fetch('/api/admin/generate/worksheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate worksheet');
      }

      const result = await response.json();
      setGeneratedWorksheet({
        title: result.worksheet.title,
        html: result.html,
        filename: result.filename
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate worksheet');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate PDF using browser print functionality
  const openPrintView = async () => {
    if (!generatedWorksheet?.html) {
      setError('No worksheet content to print');
      return;
    }

    try {
      const response = await fetch('/api/admin/generate/worksheet/print', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: generatedWorksheet.html }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate print view');
      }

      const htmlContent = await response.text();
      
      // Create a new window/tab with the clean HTML
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Optional: Automatically open print dialog after a short delay
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 1000);
      } else {
        setError('Please allow popups to open the print view');
      }
    } catch (error) {
      console.error('Error opening print view:', error);
      setError('Failed to open print view');
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">AI Worksheet Generator</h1>
        <p className="text-slate-600">Create professional language learning worksheets with AI assistance</p>
        <div className="flex items-center mt-2 text-sm text-purple-600">
          <Sparkles className="w-4 h-4 mr-1" />
          <span>Powered by OpenAI gpt-4.1-nano</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <PenTool className="w-5 h-5 mr-2 text-purple-600" />
            Worksheet Configuration
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject & Language */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Topic
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="e.g., Present Tense Regular Verbs, Family Vocabulary, Food & Drinks"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Worksheet Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Worksheet Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['grammar', 'vocabulary', 'mixed'] as const).map(type => (
                  <label key={type} className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                      type="radio"
                      name="worksheetType"
                      value={type}
                      checked={formData.worksheetType === type}
                      onChange={(e) => setFormData(prev => ({ ...prev, worksheetType: e.target.value as any }))}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-2 ${formData.worksheetType === type ? 'border-purple-500 bg-purple-500' : 'border-slate-300'}`}>
                      {formData.worksheetType === type && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                    </div>
                    <span className="text-sm font-medium capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Exercise Types */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Exercise Types
              </label>
              <div className="space-y-2">
                {exerciseTypeOptions.map(option => (
                  <label key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.exerciseTypes.includes(option.id)}
                      onChange={(e) => handleExerciseTypeChange(option.id, e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-slate-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Prompt */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Additional Instructions (Optional)
              </label>
              <textarea
                value={formData.customPrompt}
                onChange={(e) => setFormData(prev => ({ ...prev, customPrompt: e.target.value }))}
                placeholder="e.g., Focus on irregular verbs, include cultural context, add pronunciation notes..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating || !formData.topic}
              className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Worksheet...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Worksheet
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-purple-600" />
            Generated Worksheet
          </h2>

          {/* Loading State */}
          {isGenerating && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Creating your worksheet...</p>
              <p className="text-sm text-slate-500 mt-2">This may take 30-60 seconds</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800 font-medium">Generation Failed</span>
              </div>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Success State */}
          {generatedWorksheet && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Worksheet Generated Successfully!</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-semibold text-slate-800 mb-2">{generatedWorksheet.title}</h3>
                <p className="text-sm text-slate-600 mb-4">Filename: {generatedWorksheet.filename}</p>
                
                <div className="space-y-2">
                  <button
                    onClick={() => openPrintView()}
                    className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-orange-600 transition-all duration-200 flex items-center justify-center"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Print Worksheet
                  </button>
                  
                  <button
                    onClick={() => window.print()}
                    className="w-full bg-slate-100 text-slate-700 py-2 px-4 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center justify-center"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Print Worksheet
                  </button>
                </div>
                
                {/* Worksheet Preview */}
                <div className="mt-6">
                  <h4 className="font-semibold text-slate-800 mb-3">Worksheet Preview</h4>
                  <div 
                    id="worksheet-preview-container"
                    className="border border-slate-200 rounded-lg bg-white max-h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: generatedWorksheet.html }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isGenerating && !error && !generatedWorksheet && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Configure and generate your worksheet to see results here</p>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg p-6 border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">💡 Tips for Better Worksheets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-purple-800 mb-2">Topic Ideas:</h4>
            <ul className="text-purple-700 space-y-1">
              <li>• Present Tense Regular Verbs</li>
              <li>• Family & Relationships</li>
              <li>• Food & Cooking Vocabulary</li>
              <li>• Travel & Transportation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-purple-800 mb-2">Best Practices:</h4>
            <ul className="text-purple-700 space-y-1">
              <li>• Be specific with topics</li>
              <li>• Mix different exercise types</li>
              <li>• Include cultural context notes</li>
              <li>• Consider student level carefully</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 