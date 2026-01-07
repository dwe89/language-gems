'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { 
  Upload, 
  Download, 
  BookOpen, 
  Target, 
  CheckCircle,
  AlertCircle,
  FileText,
  Layers,
  Tag,
  TrendingUp,
  Users,
  Calendar,
  Star,
  Zap,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface CurriculumSet {
  id: string;
  name: string;
  description: string;
  language: string;
  level: string;
  totalWords: number;
  topics: string[];
  themes: string[];
  source: string;
  createdAt: Date;
  isActive: boolean;
}

interface ImportProgress {
  total: number;
  processed: number;
  errors: string[];
  isComplete: boolean;
}

export default function CurriculumIntegrationPage() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  const [loading, setLoading] = useState(true);
  const [curriculumSets, setCurriculumSets] = useState<CurriculumSet[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'import' | 'manage'>('browse');

  // Predefined curriculum sets
  const PREDEFINED_CURRICULA = [
    {
      id: 'gcse-spanish-2000',
      name: 'GCSE Spanish 2000 Essential Words',
      description: 'Complete vocabulary set for GCSE Spanish examination covering all essential topics and themes.',
      language: 'Spanish',
      level: 'GCSE',
      totalWords: 2000,
      topics: ['Family', 'School', 'Travel', 'Food', 'Hobbies', 'Work', 'Environment', 'Technology'],
      themes: ['Identity', 'Relationships', 'Education', 'Leisure', 'Environment', 'Future Plans'],
      source: 'Official GCSE Curriculum',
      downloadUrl: '/curriculum/gcse-spanish-2000.csv'
    },
    {
      id: 'a-level-french-3000',
      name: 'A-Level French 3000 Advanced Words',
      description: 'Advanced vocabulary for A-Level French students including complex topics and abstract concepts.',
      language: 'French',
      level: 'A-Level',
      totalWords: 3000,
      topics: ['Politics', 'Literature', 'Philosophy', 'Science', 'Arts', 'History', 'Economics'],
      themes: ['Society', 'Culture', 'Global Issues', 'Technology', 'Ethics', 'Future'],
      source: 'A-Level Curriculum Board',
      downloadUrl: '/curriculum/a-level-french-3000.csv'
    },
    {
      id: 'ib-german-2500',
      name: 'IB German 2500 Core Vocabulary',
      description: 'International Baccalaureate German vocabulary covering all prescribed topics.',
      language: 'German',
      level: 'IB',
      totalWords: 2500,
      topics: ['Identity', 'Experiences', 'Human Ingenuity', 'Social Organization', 'Sharing the Planet'],
      themes: ['Communication', 'Creativity', 'Connections'],
      source: 'IB Organization',
      downloadUrl: '/curriculum/ib-german-2500.csv'
    }
  ];

  useEffect(() => {
    if (user) {
      loadCurriculumSets();
    }
  }, [user]);

  const loadCurriculumSets = async () => {
    try {
      setLoading(true);
      
      // Load imported curriculum sets from database
      const { data: importedSets, error } = await supabase
        .from('curriculum_sets')
        .select('*')
        .eq('teacher_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedSets: CurriculumSet[] = (importedSets || []).map(set => ({
        id: set.id,
        name: set.name,
        description: set.description,
        language: set.language,
        level: set.level,
        totalWords: set.total_words,
        topics: set.topics || [],
        themes: set.themes || [],
        source: set.source || 'Custom Import',
        createdAt: new Date(set.created_at),
        isActive: set.is_active
      }));

      setCurriculumSets(processedSets);
    } catch (error) {
      console.error('Error loading curriculum sets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setSelectedFile(file);
    } else {
      alert('Please select a CSV file');
    }
  };

  const handleImportFile = async () => {
    if (!selectedFile || !user) return;

    try {
      setImporting(true);
      setImportProgress({ total: 0, processed: 0, errors: [], isComplete: false });

      // Read file content
      const fileContent = await selectedFile.text();
      const lines = fileContent.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Validate headers
      const requiredHeaders = ['term', 'translation', 'topic', 'theme'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
      }

      const totalRows = lines.length - 1; // Exclude header
      setImportProgress(prev => prev ? { ...prev, total: totalRows } : null);

      // Process vocabulary items
      const vocabularyItems = [];
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        try {
          const values = lines[i].split(',').map(v => v.trim());
          const item: any = {};
          
          headers.forEach((header, index) => {
            item[header] = values[index] || '';
          });

          // Validate required fields
          if (!item.term || !item.translation) {
            errors.push(`Row ${i + 1}: Missing term or translation`);
            continue;
          }

          vocabularyItems.push({
            term: item.term,
            translation: item.translation,
            topic: item.topic || 'General',
            theme: item.theme || 'General',
            difficulty: item.difficulty || 'intermediate',
            frequency_score: parseInt(item.frequency_score) || 50,
            example_sentence: item.example_sentence || null,
            example_translation: item.example_translation || null,
            audio_url: item.audio_url || null,
            image_url: item.image_url || null,
            notes: item.notes || null
          });

          setImportProgress(prev => prev ? { ...prev, processed: i, errors } : null);
        } catch (error) {
          errors.push(`Row ${i + 1}: ${error}`);
        }
      }

      // Create curriculum set
      const curriculumSetData = {
        name: selectedFile.name.replace('.csv', ''),
        description: `Imported from ${selectedFile.name}`,
        language: 'Unknown', // Could be detected or specified by user
        level: 'Custom',
        total_words: vocabularyItems.length,
        topics: [...new Set(vocabularyItems.map(item => item.topic))],
        themes: [...new Set(vocabularyItems.map(item => item.theme))],
        source: 'File Import',
        teacher_id: user.id,
        is_active: true
      };

      const { data: curriculumSet, error: setError } = await supabase
        .from('curriculum_sets')
        .insert(curriculumSetData)
        .select()
        .single();

      if (setError) throw setError;

      // Create vocabulary list
      const { data: vocabularyList, error: listError } = await supabase
        .from('vocabulary_lists')
        .insert({
          name: curriculumSetData.name,
          description: curriculumSetData.description,
          language: curriculumSetData.language,
          difficulty: 'mixed',
          teacher_id: user.id,
          curriculum_set_id: curriculumSet.id
        })
        .select()
        .single();

      if (listError) throw listError;

      // Insert vocabulary items
      const itemsWithListId = vocabularyItems.map(item => ({
        ...item,
        list_id: vocabularyList.id,
        teacher_id: user.id
      }));

      const { error: itemsError } = await supabase
        .from('vocabulary_items')
        .insert(itemsWithListId);

      if (itemsError) throw itemsError;

      setImportProgress(prev => prev ? { ...prev, isComplete: true } : null);
      
      // Reload curriculum sets
      await loadCurriculumSets();
      
      // Reset form
      setSelectedFile(null);
      setActiveTab('manage');

    } catch (error) {
      console.error('Error importing curriculum:', error);
      setImportProgress(prev => prev ? { 
        ...prev, 
        errors: [...prev.errors, `Import failed: ${error}`],
        isComplete: true 
      } : null);
    } finally {
      setImporting(false);
    }
  };

  const downloadPredefinedCurriculum = async (curriculum: any) => {
    // In a real implementation, this would download from your server
    // For now, we'll create a sample CSV
    const csvContent = generateSampleCSV(curriculum);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${curriculum.id}.csv`;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    // Safe cleanup with timeout
    setTimeout(() => {
      try {
        window.URL.revokeObjectURL(url);
        if (a.parentNode === document.body) {
          document.body.removeChild(a);
        }
      } catch (removeError) {
        console.warn('Failed to remove download link from DOM:', removeError);
      }
    }, 100);
  };

  const generateSampleCSV = (curriculum: any) => {
    const headers = 'term,translation,topic,theme,difficulty,frequency_score,example_sentence,example_translation\n';
    const sampleRows = [
      'hola,hello,greetings,communication,beginner,95,"Hola, ¿cómo estás?","Hello, how are you?"',
      'casa,house,home,family,beginner,90,"Mi casa es grande","My house is big"',
      'escuela,school,education,learning,beginner,85,"Voy a la escuela","I go to school"'
    ].join('\n');
    
    return headers + sampleRows;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading curriculum tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Curriculum Integration</h1>
              <p className="text-gray-600">Import and manage curriculum-specific vocabulary sets</p>
            </div>
            
            <Link
              href="/dashboard/vocabulary-mining"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
            >
              Back to Analytics
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'browse'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="inline mr-1" size={16} />
            Browse Curricula
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'import'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Upload className="inline mr-1" size={16} />
            Import Custom
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'manage'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="inline mr-1" size={16} />
            Manage Sets ({curriculumSets.length})
          </button>
        </div>

        {/* Browse Predefined Curricula */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Official Curriculum Sets</h3>
              <p className="text-gray-600 mb-6">
                Download professionally curated vocabulary sets aligned with official curricula.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PREDEFINED_CURRICULA.map((curriculum) => (
                  <div key={curriculum.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <BookOpen className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <span className="text-sm font-medium text-indigo-600">{curriculum.level}</span>
                          <span className="text-sm text-gray-500 ml-2">{curriculum.language}</span>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{curriculum.totalWords}</span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">{curriculum.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{curriculum.description}</p>
                    
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-1">Topics:</div>
                      <div className="flex flex-wrap gap-1">
                        {curriculum.topics.slice(0, 3).map(topic => (
                          <span key={topic} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {topic}
                          </span>
                        ))}
                        {curriculum.topics.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                            +{curriculum.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => downloadPredefinedCurriculum(curriculum)}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download CSV
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Import Custom Curriculum */}
        {activeTab === 'import' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Custom Curriculum</h3>
              <p className="text-gray-600 mb-6">
                Upload your own vocabulary sets in CSV format. Make sure your file includes the required columns.
              </p>
              
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="mb-4">
                  <label className="cursor-pointer">
                    <span className="text-indigo-600 hover:text-indigo-700 font-medium">
                      Choose a CSV file
                    </span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  <span className="text-gray-600"> or drag and drop</span>
                </div>
                <p className="text-sm text-gray-500">CSV files only, up to 10MB</p>
              </div>
              
              {selectedFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-900">{selectedFile.name}</span>
                    <span className="text-blue-600 ml-2">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                </div>
              )}
              
              {/* Required Format */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Required CSV Format</h4>
                <p className="text-sm text-gray-600 mb-3">Your CSV file must include these columns:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <span className="bg-white px-2 py-1 rounded border font-mono">term</span>
                  <span className="bg-white px-2 py-1 rounded border font-mono">translation</span>
                  <span className="bg-white px-2 py-1 rounded border font-mono">topic</span>
                  <span className="bg-white px-2 py-1 rounded border font-mono">theme</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Optional columns: difficulty, frequency_score, example_sentence, example_translation, audio_url, image_url, notes
                </p>
              </div>
              
              {/* Import Button */}
              <button
                onClick={handleImportFile}
                disabled={!selectedFile || importing}
                className="bg-green-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
              >
                {importing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Curriculum
                  </>
                )}
              </button>
              
              {/* Import Progress */}
              {importProgress && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Import Progress</span>
                    <span className="text-sm text-gray-600">
                      {importProgress.processed} / {importProgress.total}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(importProgress.processed / importProgress.total) * 100}%` }}
                    />
                  </div>
                  
                  {importProgress.errors.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-red-900 mb-2">Errors:</h5>
                      <div className="max-h-32 overflow-y-auto">
                        {importProgress.errors.map((error, index) => (
                          <div key={index} className="text-sm text-red-700 mb-1">
                            {error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {importProgress.isComplete && (
                    <div className="flex items-center text-green-700 mt-2">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Import completed!</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manage Curriculum Sets */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Your Curriculum Sets</h3>
                <button
                  onClick={loadCurriculumSets}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
              
              {curriculumSets.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No curriculum sets yet</h4>
                  <p className="text-gray-600 mb-6">Import your first curriculum set to get started.</p>
                  <button
                    onClick={() => setActiveTab('import')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
                  >
                    Import Curriculum
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {curriculumSets.map((set) => (
                    <div key={set.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg ${set.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <BookOpen className={`w-5 h-5 ${set.isActive ? 'text-green-600' : 'text-gray-600'}`} />
                          </div>
                          <div className="ml-3">
                            <span className="text-sm font-medium text-gray-900">{set.level}</span>
                            <span className="text-sm text-gray-500 ml-2">{set.language}</span>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{set.totalWords}</span>
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 mb-2">{set.name}</h4>
                      <p className="text-sm text-gray-600 mb-4">{set.description}</p>
                      
                      <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-1">Topics ({set.topics.length}):</div>
                        <div className="flex flex-wrap gap-1">
                          {set.topics.slice(0, 3).map(topic => (
                            <span key={topic} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {topic}
                            </span>
                          ))}
                          {set.topics.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                              +{set.topics.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>Created: {set.createdAt.toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full ${set.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {set.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/assignments/new?curriculum=${set.id}`}
                          className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-indigo-700 text-center"
                        >
                          Create Assignment
                        </Link>
                        <Link
                          href={`/dashboard/vocabulary-mining/curriculum/${set.id}/coverage`}
                          className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-green-700 text-center"
                        >
                          Track Coverage
                        </Link>
                        <Link
                          href={`/dashboard/vocabulary?curriculum=${set.id}`}
                          className="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-gray-700 text-center"
                        >
                          View Words
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
