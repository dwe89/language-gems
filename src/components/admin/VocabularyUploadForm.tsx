'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { parse } from 'csv-parse/sync';
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Plus,
  AlertTriangle,
  Edit3,
  Save,
  Eye,
  EyeOff,
  Trash2,
  X
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
  const [fullData, setFullData] = useState<any[]>([]);
  const [showFullEditor, setShowFullEditor] = useState(false);
  const [editableData, setEditableData] = useState<any[]>([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    word: '',
    translation: '',
    language: 'ES', // Default to Spanish for KS3
    category: '',
    subcategory: '',
    part_of_speech: 'noun',
    curriculum_level: 'KS3',
    example_sentence: '',
    example_translation: '',
    gender: '',
    article: '',
    base_word: ''
  });
  const [showJsonPaste, setShowJsonPaste] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  const parseCSVContent = (csvContent: string) => {
    try {
      // Remove BOM if present
      const cleanContent = csvContent.replace(/^\uFEFF/, '');

      // Parse CSV with proper handling of quotes, commas, and special characters
      const records = parse(cleanContent, {
        columns: true, // Use first row as column headers
        skip_empty_lines: true,
        trim: true,
        quote: '"',
        delimiter: ',',
        escape: '"',
        relax_column_count: true, // Allow inconsistent column counts
        cast: (value) => {
          // Clean up values
          if (typeof value === 'string') {
            return value.trim();
          }
          return value;
        }
      });

      console.log(`📋 Parsed ${records.length} records from CSV`);

      // Log column headers for debugging
      if (records.length > 0) {
        console.log('📝 Column headers found:', Object.keys(records[0] as Record<string, any>));
      }

      return records;

    } catch (error) {
      console.error('❌ CSV parsing error:', error);
      throw new Error(`Failed to parse CSV: ${error}`);
    }
  };

  const downloadBulkTemplate = () => {
    const headers = [
      'word', 'translation', 'language', 'category', 'subcategory',
      'part_of_speech', 'curriculum_level', 'example_sentence',
      'example_translation', 'gender', 'article', 'base_word'
    ];

    // Generate template rows for each subcategory
    const templateRows = KS3_SPANISH_CATEGORIES.flatMap(category =>
      category.subcategories.map(subcategory => [
        '', // word - to be filled
        '', // translation - to be filled
        'ES', // Spanish
        category.id,
        subcategory.id,
        'noun', // default part of speech
        'KS3',
        '', // example_sentence - to be filled
        '', // example_translation - to be filled
        '', // gender - to be filled
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
    a.download = 'vocabulary_template_ks3_spanish.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setValidationErrors([]);
    setUploadStats(null);
    setShowFullEditor(false);

    // Parse the entire file using proper CSV parser
    try {
      const text = await selectedFile.text();
      const allData = parseCSVContent(text).filter((item: any) => item.word && item.word.trim()); // Filter out empty rows

      console.log(`📊 Loaded ${allData.length} vocabulary entries`);

      // Set preview (first 5 rows for quick view)
      const previewData = allData.slice(0, 5);
      setPreview(previewData);

      // Set full data for editing
      setFullData(allData);
      setEditableData([...allData]); // Create editable copy
    } catch (error) {
      console.error('Error parsing file:', error);
      alert(`Error parsing CSV file: ${error}`);
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
      if (item.language && !['fr', 'es', 'de', 'it', 'pt', 'FR', 'ES', 'DE', 'IT', 'PT'].includes(item.language)) {
        errors.push({
          row: index + 2,
          field: 'language',
          message: 'Language must be one of: FR, ES, DE, IT, PT (or lowercase equivalents)'
        });
      }
    });

    return errors;
  };

  const handleCellEdit = (rowIndex: number, field: string, value: string) => {
    const updatedData = [...editableData];
    updatedData[rowIndex] = { ...updatedData[rowIndex], [field]: value };
    setEditableData(updatedData);
  };

  const handleAddRow = () => {
    const newRow = {
      word: '',
      translation: '',
      language: 'ES',
      category: '',
      subcategory: '',
      part_of_speech: '',
      curriculum_level: 'KS3',
      example_sentence: '',
      example_translation: '',
      gender: '',
      article: '',
      base_word: ''
    };
    setEditableData([...editableData, newRow]);
  };

  const handleRemoveRow = (rowIndex: number) => {
    const updatedData = editableData.filter((_, index) => index !== rowIndex);
    setEditableData(updatedData);
  };

  const handleSaveEdits = () => {
    // Validate the edited data
    const errors = validateVocabularyData(editableData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Clear any previous errors and proceed with upload
    setValidationErrors([]);
    uploadEditedVocabulary();
  };

  const uploadEditedVocabulary = async () => {
    if (!editableData.length) return;

    setUploading(true);

    try {
      // Upload to database using the edited data
      const stats: UploadStats = {
        total: editableData.length,
        successful: 0,
        failed: 0,
        duplicates: 0,
        audioGenerated: 0
      };

      for (const item of editableData) {
        try {
          // Check for duplicates
          const { data: existing } = await supabaseBrowser
            .from('centralized_vocabulary')
            .select('id')
            .eq('word', item.word)
            .eq('language', item.language.toLowerCase())
            .single();

          if (existing) {
            stats.duplicates++;
            continue;
          }

          // Prepare vocabulary item
          const vocabularyItem = {
            word: item.word,
            translation: item.translation,
            language: item.language.toLowerCase(),
            category: item.category || null,
            subcategory: item.subcategory || null,
            part_of_speech: item.part_of_speech || 'noun',
            curriculum_level: item.curriculum_level || 'KS3',
            example_sentence: item.example_sentence || null,
            example_translation: item.example_translation || null,
            gender: item.gender || null,
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
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const uploadVocabulary = async () => {
    if (!file) return;

    setUploading(true);
    setValidationErrors([]);
    
    try {
      const text = await file.text();
      const data = parseCSVContent(text).filter((item: any) => item.word); // Filter out empty rows

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

      for (const item of data as any[]) {
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
            curriculum_level: item.curriculum_level || null,
            example_sentence: item.example_sentence || null,
            example_translation: item.example_translation || null,
            gender: item.gender || null,
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

  const handleJsonPaste = () => {
    try {
      const parsed = JSON.parse(jsonInput.trim());
      
      // Helper function to get value from various field name formats
      const getValue = (obj: any, fieldName: string, alternates: string[] = []): string => {
        // Try exact match first
        if (obj[fieldName]) return obj[fieldName];
        
        // Try alternates
        for (const alt of alternates) {
          if (obj[alt]) return obj[alt];
        }
        
        // Try case-insensitive match
        const keys = Object.keys(obj);
        for (const key of keys) {
          if (key.toLowerCase() === fieldName.toLowerCase()) {
            return obj[key];
          }
        }
        
        return '';
      };
      
      // Map various field name formats
      const word = getValue(parsed, 'word', ['Word']);
      const translation = getValue(parsed, 'translation', ['Translation']);
      const language = getValue(parsed, 'language', ['Language']);
      
      // Validate required fields
      if (!word || !translation || !language) {
        alert('JSON must contain at least word, translation, and language fields');
        return;
      }
      
      // Convert language to lowercase code if it's a full language name
      let languageCode = language.toLowerCase();
      if (language.toLowerCase() === 'spanish') languageCode = 'es';
      else if (language.toLowerCase() === 'french') languageCode = 'fr';
      else if (language.toLowerCase() === 'german') languageCode = 'de';
      else if (language.toLowerCase() === 'italian') languageCode = 'it';
      else if (language.toLowerCase() === 'portuguese') languageCode = 'pt';
      
      // Convert category format - handle various category names
      let category = getValue(parsed, 'category', ['Category']);
      if (category) {
        const categoryLower = category.toLowerCase();
        if (categoryLower.includes('basic') || categoryLower.includes('properties') || categoryLower.includes('color') || categoryLower.includes('colour')) {
          category = 'basics_core_language';
        } else if (categoryLower.includes('identity') || categoryLower.includes('personal') || categoryLower.includes('family')) {
          category = 'identity_personal_life';
        } else if (categoryLower.includes('home') || categoryLower.includes('local') || categoryLower.includes('area')) {
          category = 'home_local_area';
        } else if (categoryLower.includes('school') || categoryLower.includes('education')) {
          category = 'school_college_future_career';
        } else if (categoryLower.includes('free time') || categoryLower.includes('leisure') || categoryLower.includes('hobby')) {
          category = 'free_time_leisure';
        } else if (categoryLower.includes('travel') || categoryLower.includes('tourism')) {
          category = 'travel_tourism';
        } else if (categoryLower.includes('technology') || categoryLower.includes('social media')) {
          category = 'technology_social_media';
        } else if (categoryLower.includes('customs') || categoryLower.includes('festivals') || categoryLower.includes('traditions')) {
          category = 'customs_festivals_traditions';
        } else if (categoryLower.includes('global') || categoryLower.includes('social') || categoryLower.includes('issues')) {
          category = 'global_dimension_social_issues';
        }
      }
      
      // Create a new manual entry object with all fields
      const newEntry = {
        word: word,
        translation: translation,
        language: languageCode,
        category: category,
        subcategory: (() => {
          const subcat = getValue(parsed, 'subcategory', ['Subcategory']);
          // If no subcategory provided but we can infer from tags or word meaning
          if (!subcat && category === 'basics_core_language') {
            const tags = getValue(parsed, 'tags', ['Tags']).toLowerCase();
            const word = getValue(parsed, 'word', ['Word']).toLowerCase();
            if (tags.includes('color') || tags.includes('colour') || 
                ['braun', 'brown', 'azul', 'blue', 'rojo', 'red', 'verde', 'green', 'amarillo', 'yellow', 'negro', 'black', 'blanco', 'white'].includes(word)) {
              return 'colours';
            }
          }
          return subcat;
        })(),
        part_of_speech: getValue(parsed, 'part_of_speech', ['Part of Speech', 'partOfSpeech']).toLowerCase() || 'adjective',
        difficulty_level: getValue(parsed, 'difficulty_level', ['Difficulty Level', 'difficultyLevel']).toLowerCase() || 'beginner',
        curriculum_level: getValue(parsed, 'curriculum_level', ['Curriculum Level', 'curriculumLevel']) || 'KS3',
        tags: (() => {
          const tags = getValue(parsed, 'tags', ['Tags']);
          if (Array.isArray(parsed.tags || parsed.Tags)) {
            return (parsed.tags || parsed.Tags).join(', ');
          }
          return tags;
        })(),
        frequency_rank: (() => {
          const rank = getValue(parsed, 'frequency_rank', ['Frequency Rank', 'frequencyRank']);
          return rank ? rank.toString() : '';
        })(),
        example_sentence: getValue(parsed, 'example_sentence', ['Example Sentence', 'exampleSentence']),
        example_translation: getValue(parsed, 'example_translation', ['Example Translation', 'exampleTranslation']),
        gender: getValue(parsed, 'gender', ['Gender']).toLowerCase(),
        article: getValue(parsed, 'article', ['Article']),
        base_word: getValue(parsed, 'base_word', ['Base Word', 'baseWord']) || word,
        metadata: (() => {
          const metadata = parsed.metadata || parsed.Metadata;
          if (metadata) {
            return typeof metadata === 'string' ? metadata : JSON.stringify(metadata);
          }
          return '';
        })()
      };
      
      setManualEntry(newEntry);
      setJsonInput('');
      setShowJsonPaste(false);
      alert('JSON data loaded successfully!');
      
    } catch (error) {
      alert('Invalid JSON format. Please check your input.');
      console.error('JSON parse error:', error);
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
      const { data: existing, error: duplicateCheckError } = await supabaseBrowser
        .from('centralized_vocabulary')
        .select('id')
        .eq('word', manualEntry.word)
        .eq('language', manualEntry.language)
        .limit(1);

      // If we found an existing word (and no error), it's a duplicate
      if (existing && existing.length > 0) {
        alert('This word already exists in the database');
        setUploading(false);
        return;
      }

      const vocabularyItem = {
        word: manualEntry.word,
        translation: manualEntry.translation,
        language: manualEntry.language,
        category: manualEntry.category,
        subcategory: manualEntry.subcategory || null,
        part_of_speech: manualEntry.part_of_speech || null,
        curriculum_level: manualEntry.curriculum_level || null,
        example_sentence: manualEntry.example_sentence || null,
        example_translation: manualEntry.example_translation || null,
        gender: manualEntry.gender || null,
        article: manualEntry.article || null,
        base_word: manualEntry.base_word || null
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
        language: 'ES',
        category: '',
        subcategory: '',
        part_of_speech: 'noun',
        curriculum_level: 'KS3',
        example_sentence: '',
        example_translation: '',
        gender: '',
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
              onClick={downloadBulkTemplate}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Template
            </button>
          </div>
        </div>

        {/* Manual Entry Form */}
        {showManualEntry && (
          <div className="mb-8 p-4 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-slate-900">Add Single Word</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowJsonPaste(!showJsonPaste)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  Paste JSON
                </button>
              </div>
            </div>

            {/* JSON Paste Section */}
            {showJsonPaste && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="text-sm font-medium text-blue-900 mb-2">Paste JSON Data</h5>
                <p className="text-xs text-blue-700 mb-3">
                  Paste a JSON object with vocabulary data. All fields will be automatically filled.
                </p>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full h-24 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                  placeholder='{"word": "casa", "translation": "house", "language": "es", "category": "basics_core_language", ...}'
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleJsonPaste}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Apply JSON
                  </button>
                  <button
                    onClick={() => {
                      setJsonInput('');
                      setShowJsonPaste(false);
                    }}
                    className="px-3 py-1 bg-slate-500 text-white rounded text-sm hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Core Fields */}
            <div className="mb-6">
              <h5 className="text-sm font-semibold text-slate-800 mb-3">Required Fields</h5>
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
                    placeholder="e.g., casa"
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
                    placeholder="e.g., house"
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
              </div>
            </div>

            {/* Basic Properties */}
            <div className="mb-6">
              <h5 className="text-sm font-semibold text-slate-800 mb-3">Basic Properties</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <option value="pronoun">Pronoun</option>
                    <option value="conjunction">Conjunction</option>
                    <option value="interjection">Interjection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Curriculum Level
                  </label>
                  <select
                    value={manualEntry.curriculum_level}
                    onChange={(e) => setManualEntry({...manualEntry, curriculum_level: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="">Select level...</option>
                    <option value="KS1">KS1</option>
                    <option value="KS2">KS2</option>
                    <option value="KS3">KS3</option>
                    <option value="KS4">KS4</option>
                    <option value="GCSE">GCSE</option>
                    <option value="A-Level">A-Level</option>
                    <option value="Adult">Adult</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={manualEntry.gender}
                    onChange={(e) => setManualEntry({...manualEntry, gender: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="">Select gender...</option>
                    <option value="masculine">Masculine</option>
                    <option value="feminine">Feminine</option>
                    <option value="neuter">Neuter</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Word Components */}
            <div className="mb-6">
              <h5 className="text-sm font-semibold text-slate-800 mb-3">Word Components</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Article
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
                    Base Word
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
            </div>

            {/* Additional Information */}
            <div className="mb-6">
              <h5 className="text-sm font-semibold text-slate-800 mb-3">Additional Information</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Example Sentence
                  </label>
                  <input
                    type="text"
                    value={manualEntry.example_sentence}
                    onChange={(e) => setManualEntry({...manualEntry, example_sentence: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Mi casa es grande."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Example Translation
                  </label>
                  <input
                    type="text"
                    value={manualEntry.example_translation}
                    onChange={(e) => setManualEntry({...manualEntry, example_translation: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="My house is big."
                  />
                </div>

              </div>
            </div>
            
            <div className="flex gap-3">
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
              <button
                onClick={() => {
                  setManualEntry({
                    word: '',
                    translation: '',
                    language: 'ES',
                    category: '',
                    subcategory: '',
                    part_of_speech: 'noun',
                    curriculum_level: 'KS3',
                    example_sentence: '',
                    example_translation: '',
                    gender: '',
                    article: '',
                    base_word: ''
                  });
                }}
                className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 flex items-center gap-2"
              >
                Clear Form
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
        {preview.length > 0 && !showFullEditor && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-medium text-slate-900">File Preview (First 5 rows)</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFullEditor(true)}
                  className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit All ({fullData.length} rows)
                </button>
              </div>
            </div>
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
            {fullData.length > 5 && (
              <p className="text-sm text-slate-500 mt-2">
                ... and {fullData.length - 5} more rows. Click "Edit All" to view and edit all entries.
              </p>
            )}
          </div>
        )}

        {/* Full Data Editor */}
        {showFullEditor && editableData.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-slate-900">
                Edit All Vocabulary ({editableData.length} entries)
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={handleAddRow}
                  className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Row
                </button>
                <button
                  onClick={() => setShowFullEditor(false)}
                  className="inline-flex items-center px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
                >
                  <EyeOff className="w-4 h-4 mr-1" />
                  Show Preview
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-2 py-2 text-left border-b text-xs">#</th>
                    <th className="px-2 py-2 text-left border-b text-xs">Word*</th>
                    <th className="px-2 py-2 text-left border-b text-xs">Translation*</th>
                    <th className="px-2 py-2 text-left border-b text-xs">Language*</th>
                    <th className="px-2 py-2 text-left border-b text-xs">Category*</th>
                    <th className="px-2 py-2 text-left border-b text-xs">Subcategory</th>
                    <th className="px-2 py-2 text-left border-b text-xs">Part of Speech</th>
                    <th className="px-2 py-2 text-left border-b text-xs">Curriculum</th>
                    <th className="px-2 py-2 text-left border-b text-xs">Example Sentence</th>
                    <th className="px-2 py-2 text-left border-b text-xs">Example Translation</th>
                    <th className="px-2 py-2 text-left border-b text-xs">Gender</th>
                    <th className="px-2 py-2 text-left border-b text-xs">Article</th>
                    <th className="px-2 py-2 text-left border-b text-xs">Base Word</th>
                    <th className="px-2 py-2 text-left border-b text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {editableData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50">
                      <td className="px-2 py-2 text-xs text-slate-500">{index + 1}</td>

                      {/* Word */}
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={item.word || ''}
                          onChange={(e) => handleCellEdit(index, 'word', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Word"
                        />
                      </td>

                      {/* Translation */}
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={item.translation || ''}
                          onChange={(e) => handleCellEdit(index, 'translation', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Translation"
                        />
                      </td>

                      {/* Language */}
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={item.language || ''}
                          onChange={(e) => handleCellEdit(index, 'language', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="es, fr, de, etc."
                        />
                      </td>

                      {/* Category */}
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={item.category || ''}
                          onChange={(e) => handleCellEdit(index, 'category', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Category"
                        />
                      </td>

                      {/* Subcategory */}
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={item.subcategory || ''}
                          onChange={(e) => handleCellEdit(index, 'subcategory', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Subcategory"
                        />
                      </td>

                      {/* Part of Speech */}
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={item.part_of_speech || ''}
                          onChange={(e) => handleCellEdit(index, 'part_of_speech', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="noun, verb, etc."
                        />
                      </td>

                      {/* Curriculum Level */}
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={item.curriculum_level || ''}
                          onChange={(e) => handleCellEdit(index, 'curriculum_level', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="KS3, GCSE, etc."
                        />
                      </td>

                      {/* Example Sentence */}
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={item.example_sentence || ''}
                          onChange={(e) => handleCellEdit(index, 'example_sentence', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Example sentence"
                        />
                      </td>

                      {/* Example Translation */}
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={item.example_translation || ''}
                          onChange={(e) => handleCellEdit(index, 'example_translation', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Example translation"
                        />
                      </td>

                      {/* Gender */}
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={item.gender || ''}
                          onChange={(e) => handleCellEdit(index, 'gender', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="masculine, feminine, etc."
                        />
                      </td>

                      {/* Article */}
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={item.article || ''}
                          onChange={(e) => handleCellEdit(index, 'article', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="el, la, les, etc."
                        />
                      </td>

                      {/* Base Word */}
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={item.base_word || ''}
                          onChange={(e) => handleCellEdit(index, 'base_word', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Base word"
                        />
                      </td>

                      {/* Actions */}
                      <td className="px-2 py-2">
                        <button
                          onClick={() => handleRemoveRow(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Remove row"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-slate-600">
                * Required fields. Total entries: {editableData.length}
              </p>
              <button
                onClick={handleSaveEdits}
                disabled={uploading}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save & Upload All
                  </>
                )}
              </button>
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

        {/* Upload Button - Only show when not in full editor mode */}
        {file && validationErrors.length === 0 && !showFullEditor && (
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
                  Upload Vocabulary (Quick Upload)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
