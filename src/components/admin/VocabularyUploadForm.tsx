'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Download,
  RefreshCw,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { supabaseBrowser } from '../auth/AuthProvider';
import { KS3_SPANISH_CATEGORIES, getCategoryOptions, getSubcategoryOptions } from '../../utils/categories';

interface VocabularyUploadFormProps {
  onUploadComplete: () => void;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface UploadStats {
  total: number;
  successful: number;
  failed: number;
  duplicates: number;
  audioGenerated: number;
}

export default function VocabularyUploadForm({ onUploadComplete }: VocabularyUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [uploadStats, setUploadStats] = useState<UploadStats | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    word: '',
    translation: '',
    language: 'es', // Default to Spanish for KS3
    category: '',
    subcategory: '',
    part_of_speech: 'noun',
    difficulty_level: 'beginner',
    curriculum_level: 'KS3',
    example_sentence: '',
    example_translation: '',
    tags: '',
    article: '',
    base_word: ''
  });

  const downloadTemplate = () => {
    const headers = [
      'word', 'translation', 'language', 'category', 'subcategory',
      'part_of_speech', 'difficulty_level', 'curriculum_level',
      'example_sentence', 'example_translation', 'phonetic',
      'gender', 'irregular_forms', 'synonyms', 'antonyms', 'tags',
      'article', 'base_word'
    ];

    const sampleData = [
      [
        'hola', 'hello', 'es', 'basics_core_language', 'greetings_introductions',
        'interjection', 'beginner', 'KS3',
        'Hola, ¿cómo estás?', 'Hello, how are you?', '/ˈo.la/',
        '', '', 'saludos', 'adiós', 'greeting,basic,polite',
        '', 'hola'
      ],
      [
        'mi familia', 'my family', 'es', 'identity_personal_life', 'family_friends',
        'noun', 'beginner', 'KS3',
        'Mi familia es muy grande.', 'My family is very big.', '/mi fa.ˈmi.lja/',
        'feminine', '', 'parientes', '', 'family,basic,relationships',
        'mi', 'familia'
      ],
      [
        'el dormitorio', 'the bedroom', 'es', 'home_local_area', 'house_rooms_furniture',
        'noun', 'beginner', 'KS3',
        'Mi dormitorio es azul.', 'My bedroom is blue.', '/el dor.mi.ˈto.rjo/',
        'masculine', '', 'habitación', '', 'house,rooms,furniture',
        'el', 'dormitorio'
      ]
    ];

    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vocabulary_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadBulkTemplate = () => {
    const headers = [
      'word', 'translation', 'language', 'category', 'subcategory',
      'part_of_speech', 'difficulty_level', 'curriculum_level',
      'example_sentence', 'example_translation', 'phonetic',
      'gender', 'irregular_forms', 'synonyms', 'antonyms', 'tags',
      'article', 'base_word'
    ];

    // Generate template rows for each subcategory
    const templateRows = KS3_SPANISH_CATEGORIES.flatMap(category => 
      category.subcategories.map(subcategory => [
        '', // word - to be filled
        '', // translation - to be filled
        'es', // Spanish
        category.id,
        subcategory.id,
        'noun', // default part of speech
        'beginner',
        'KS3',
        '', // example_sentence - to be filled
        '', // example_translation - to be filled
        '', // phonetic - to be filled
        '', // gender - to be filled
        '', // irregular_forms
        '', // synonyms
        '', // antonyms
        '', // tags - to be filled
        '', // article - to be filled
        '' // base_word - to be filled
      ])
    );

    const csvContent = [
      headers.join(','),
      ...templateRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ks3_spanish_bulk_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setValidationErrors([]);
    setUploadStats(null);

    // Preview the file
    try {
      const text = await selectedFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      
      const previewData = lines.slice(1, 6).map(line => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim());
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      });

      setPreview(previewData);
    } catch (error) {
      console.error('Error previewing file:', error);
    }
  };

  const validateVocabularyData = (data: any[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    const requiredFields = ['word', 'translation', 'language', 'category'];

    data.forEach((item, index) => {
      requiredFields.forEach(field => {
        if (!item[field] || item[field].trim() === '') {
          errors.push({
            row: index + 2, // +2 because we skip header and start from 1
            field,
            message: `${field} is required`
          });
        }
      });

      // Validate language code
      if (item.language && !['fr', 'es', 'de', 'it', 'pt'].includes(item.language.toLowerCase())) {
        errors.push({
          row: index + 2,
          field: 'language',
          message: 'Language must be one of: fr, es, de, it, pt'
        });
      }
    });

    return errors;
  };

  const uploadVocabulary = async () => {
    if (!file) return;

    setUploading(true);
    setValidationErrors([]);
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.replace(/"/g, '').trim());
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      }).filter(item => item.word); // Filter out empty rows

      // Validate data
      const errors = validateVocabularyData(data);
      if (errors.length > 0) {
        setValidationErrors(errors);
        setUploading(false);
        return;
      }

      // Upload to database
      const stats: UploadStats = {
        total: data.length,
        successful: 0,
        failed: 0,
        duplicates: 0,
        audioGenerated: 0
      };

      for (const item of data) {
        try {
          // Check for duplicates
          const { data: existing } = await supabaseBrowser
            .from('centralized_vocabulary')
            .select('id')
            .eq('word', item.word)
            .eq('language', item.language)
            .single();

          if (existing) {
            stats.duplicates++;
            continue;
          }

          // Prepare data for insertion
          const vocabularyItem = {
            word: item.word,
            translation: item.translation,
            language: item.language.toLowerCase(),
            category: item.category,
            subcategory: item.subcategory || null,
            part_of_speech: item.part_of_speech || null,
            difficulty_level: item.difficulty_level || 'beginner',
            curriculum_level: item.curriculum_level || null,
            example_sentence: item.example_sentence || null,
            example_translation: item.example_translation || null,
            phonetic: item.phonetic || null,
            gender: item.gender || null,
            irregular_forms: item.irregular_forms || null,
            synonyms: item.synonyms || null,
            antonyms: item.antonyms || null,
            tags: item.tags ? item.tags.split(',').map((t: string) => t.trim()) : [],
            frequency_rank: item.frequency_rank ? parseInt(item.frequency_rank) : null,
            article: item.article || null,
            base_word: item.base_word || null
          };

          const { data: inserted, error } = await supabaseBrowser
            .from('centralized_vocabulary')
            .insert(vocabularyItem)
            .select()
            .single();

          if (error) throw error;

          stats.successful++;

          // Generate audio for the new word
          try {
            await generateAudioForWord(
              inserted.id, 
              item.word, 
              item.language.toLowerCase(), 
              item.category || 'general',
              item.base_word
            );
            stats.audioGenerated++;
          } catch (audioError) {
            console.error(`Failed to generate audio for ${item.word}:`, audioError);
          }

        } catch (error) {
          console.error(`Failed to insert ${item.word}:`, error);
          stats.failed++;
        }
      }

      setUploadStats(stats);
      onUploadComplete();

    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading vocabulary. Please check the file format.');
    } finally {
      setUploading(false);
    }
  };

  const generateAudioForWord = async (vocabularyId: string, word: string, language: string, category: string = 'general', base_word?: string) => {
    try {
      const response = await fetch('/api/admin/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word,
          language,
          vocabularyId,
          category,
          base_word
        }),
      });

      if (!response.ok) throw new Error('Failed to generate audio');

      const result = await response.json();
      
      // Update vocabulary item with audio URL
      await supabaseBrowser
        .from('centralized_vocabulary')
        .update({ audio_url: result.audioUrl })
        .eq('id', vocabularyId);

    } catch (error) {
      console.error('Error generating audio:', error);
      throw error;
    }
  };

  const addManualEntry = async () => {
    if (!manualEntry.word || !manualEntry.translation || !manualEntry.language || !manualEntry.category) {
      alert('Please fill in all required fields (word, translation, language, category)');
      return;
    }

    try {
      setUploading(true);

      // Check for duplicates
      const { data: existing } = await supabaseBrowser
        .from('centralized_vocabulary')
        .select('id')
        .eq('word', manualEntry.word)
        .eq('language', manualEntry.language)
        .single();

      if (existing) {
        alert('This word already exists in the database');
        setUploading(false);
        return;
      }

      const vocabularyItem = {
        ...manualEntry,
        tags: manualEntry.tags ? manualEntry.tags.split(',').map(t => t.trim()) : [],
        subcategory: manualEntry.subcategory || null,
        curriculum_level: manualEntry.curriculum_level || null,
        example_sentence: manualEntry.example_sentence || null,
        example_translation: manualEntry.example_translation || null
      };

      const { data: inserted, error } = await supabaseBrowser
        .from('centralized_vocabulary')
        .insert(vocabularyItem)
        .select()
        .single();

      if (error) throw error;

      // Generate audio
      try {
        await generateAudioForWord(
          inserted.id, 
          manualEntry.word, 
          manualEntry.language, 
          manualEntry.category || 'general',
          manualEntry.base_word || undefined
        );
      } catch (audioError) {
        console.error('Failed to generate audio:', audioError);
      }

      // Reset form
      setManualEntry({
        word: '',
        translation: '',
        language: 'es',
        category: '',
        subcategory: '',
        part_of_speech: 'noun',
        difficulty_level: 'beginner',
        curriculum_level: 'KS3',
        example_sentence: '',
        example_translation: '',
        tags: '',
        article: '',
        base_word: ''
      });

      alert('Vocabulary item added successfully!');
      onUploadComplete();

    } catch (error) {
      console.error('Error adding manual entry:', error);
      alert('Error adding vocabulary item');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Options */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-slate-900">Add Vocabulary</h3>
          <div className="flex gap-3">
            <button
              onClick={() => setShowManualEntry(!showManualEntry)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Manual Entry
            </button>
            <button
              onClick={downloadTemplate}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Template
            </button>
            <button
              onClick={downloadBulkTemplate}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Bulk KS3 Template
            </button>
          </div>
        </div>

        {/* Manual Entry Form */}
        {showManualEntry && (
          <div className="mb-8 p-4 bg-slate-50 rounded-lg">
            <h4 className="text-md font-medium text-slate-900 mb-4">Add Single Word</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Word *
                </label>
                <input
                  type="text"
                  value={manualEntry.word}
                  onChange={(e) => setManualEntry({...manualEntry, word: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Translation *
                </label>
                <input
                  type="text"
                  value={manualEntry.translation}
                  onChange={(e) => setManualEntry({...manualEntry, translation: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Language *
                </label>
                <select
                  value={manualEntry.language}
                  onChange={(e) => setManualEntry({...manualEntry, language: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={manualEntry.category}
                  onChange={(e) => {
                    setManualEntry({
                      ...manualEntry, 
                      category: e.target.value,
                      subcategory: '' // Reset subcategory when category changes
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Select a category...</option>
                  {getCategoryOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Subcategory
                </label>
                <select
                  value={manualEntry.subcategory}
                  onChange={(e) => setManualEntry({...manualEntry, subcategory: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  disabled={!manualEntry.category}
                >
                  <option value="">Select a subcategory...</option>
                  {getSubcategoryOptions(manualEntry.category).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Part of Speech
                </label>
                <select
                  value={manualEntry.part_of_speech}
                  onChange={(e) => setManualEntry({...manualEntry, part_of_speech: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="noun">Noun</option>
                  <option value="verb">Verb</option>
                  <option value="adjective">Adjective</option>
                  <option value="adverb">Adverb</option>
                  <option value="preposition">Preposition</option>
                  <option value="interjection">Interjection</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={manualEntry.difficulty_level}
                  onChange={(e) => setManualEntry({...manualEntry, difficulty_level: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            
            {/* Article and Base Word Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Article (optional)
                  <span className="text-xs text-slate-500 block">e.g., el, la, le, der, die, das</span>
                </label>
                <input
                  type="text"
                  value={manualEntry.article}
                  onChange={(e) => setManualEntry({...manualEntry, article: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="el, la, le..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Base Word (optional)
                  <span className="text-xs text-slate-500 block">Word without article, used for audio</span>
                </label>
                <input
                  type="text"
                  value={manualEntry.base_word}
                  onChange={(e) => setManualEntry({...manualEntry, base_word: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Leave empty to auto-generate"
                />
              </div>
            </div>
            
            {/* Tags Field */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tags (optional)
                <span className="text-xs text-slate-500 block">Comma-separated tags</span>
              </label>
              <input
                type="text"
                value={manualEntry.tags}
                onChange={(e) => setManualEntry({...manualEntry, tags: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="animals,pets,basic"
              />
            </div>
            
            <div className="mt-4">
              <button
                onClick={addManualEntry}
                disabled={uploading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Add Word
              </button>
            </div>
          </div>
        )}

        {/* File Upload */}
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-slate-900 mb-2">Upload CSV File</h4>
          <p className="text-slate-600 mb-4">
            Upload a CSV file with vocabulary data. Download the template to see the required format.
          </p>
          
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="vocabulary-file"
          />
          <label
            htmlFor="vocabulary-file"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
          >
            <FileText className="w-4 h-4 mr-2" />
            Choose CSV File
          </label>
          
          {file && (
            <p className="mt-2 text-sm text-slate-600">
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* File Preview */}
        {preview.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-slate-900 mb-3">File Preview (First 5 rows)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-lg">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left border-b">Word</th>
                    <th className="px-3 py-2 text-left border-b">Translation</th>
                    <th className="px-3 py-2 text-left border-b">Language</th>
                    <th className="px-3 py-2 text-left border-b">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-3 py-2">{item.word}</td>
                      <td className="px-3 py-2">{item.translation}</td>
                      <td className="px-3 py-2">{item.language}</td>
                      <td className="px-3 py-2">{item.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h4 className="text-md font-medium text-red-900">Validation Errors</h4>
              </div>
              <div className="space-y-1">
                {validationErrors.map((error, index) => (
                  <p key={index} className="text-sm text-red-700">
                    Row {error.row}: {error.field} - {error.message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upload Stats */}
        {uploadStats && (
          <div className="mt-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="text-md font-medium text-green-900">Upload Complete</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <p className="font-medium">Total</p>
                  <p className="text-slate-600">{uploadStats.total}</p>
                </div>
                <div>
                  <p className="font-medium text-green-700">Successful</p>
                  <p className="text-green-600">{uploadStats.successful}</p>
                </div>
                <div>
                  <p className="font-medium text-red-700">Failed</p>
                  <p className="text-red-600">{uploadStats.failed}</p>
                </div>
                <div>
                  <p className="font-medium text-yellow-700">Duplicates</p>
                  <p className="text-yellow-600">{uploadStats.duplicates}</p>
                </div>
                <div>
                  <p className="font-medium text-blue-700">Audio Generated</p>
                  <p className="text-blue-600">{uploadStats.audioGenerated}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        {file && validationErrors.length === 0 && (
          <div className="mt-6">
            <button
              onClick={uploadVocabulary}
              disabled={uploading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Uploading and Generating Audio...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Vocabulary
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
