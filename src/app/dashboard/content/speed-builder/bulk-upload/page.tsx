'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Save,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

interface CSVSentence {
  spanish_text: string;
  english_text: string;
  grammar_focus?: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  curriculum_tier: 'Foundation' | 'Higher';
  theme?: string;
  topic?: string;
  row: number;
  valid: boolean;
  errors: string[];
}

export default function BulkUploadPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedSentences, setParsedSentences] = useState<CSVSentence[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{ success: number; failed: number; } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // CSV parsing and validation
  const parseCSV = useCallback((csvText: string): CSVSentence[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const results: CSVSentence[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const sentence: CSVSentence = {
        spanish_text: '',
        english_text: '',
        difficulty_level: 'medium',
        curriculum_tier: 'Foundation',
        row: i + 1,
        valid: true,
        errors: []
      };
      
      // Map CSV values to sentence properties
      headers.forEach((header, index) => {
        const value = values[index] || '';
        switch (header) {
          case 'spanish_text':
            sentence.spanish_text = value;
            break;
          case 'english_text':
            sentence.english_text = value;
            break;
          case 'grammar_focus':
            sentence.grammar_focus = value;
            break;
          case 'difficulty_level':
            if (['easy', 'medium', 'hard'].includes(value)) {
              sentence.difficulty_level = value as 'easy' | 'medium' | 'hard';
            } else {
              sentence.errors.push(`Invalid difficulty: ${value}`);
            }
            break;
          case 'curriculum_tier':
            if (['Foundation', 'Higher'].includes(value)) {
              sentence.curriculum_tier = value as 'Foundation' | 'Higher';
            } else {
              sentence.errors.push(`Invalid tier: ${value}`);
            }
            break;
          case 'theme':
            sentence.theme = value;
            break;
          case 'topic':
            sentence.topic = value;
            break;
        }
      });
      
      // Validate required fields
      if (!sentence.spanish_text) {
        sentence.errors.push('Spanish text is required');
      }
      if (!sentence.english_text) {
        sentence.errors.push('English text is required');
      }
      
      sentence.valid = sentence.errors.length === 0;
      results.push(sentence);
    }
    
    return results;
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setCsvFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const parsed = parseCSV(csvText);
      setParsedSentences(parsed);
      setShowPreview(true);
    };
    reader.readAsText(file);
  }, [parseCSV]);

  // Upload sentences to database
  const handleUpload = async () => {
    if (!parsedSentences.length) return;
    
    setIsUploading(true);
    let successCount = 0;
    let failedCount = 0;
    
    try {
      const validSentences = parsedSentences.filter(s => s.valid);
      
      for (const sentence of validSentences) {
        try {
          const { error } = await supabase
            .from('teacher_sentences')
            .insert({
              spanish_text: sentence.spanish_text,
              english_text: sentence.english_text,
              grammar_focus: sentence.grammar_focus,
              difficulty_level: sentence.difficulty_level,
              curriculum_tier: sentence.curriculum_tier,
              theme: sentence.theme,
              topic: sentence.topic
            });
          
          if (error) {
            console.error('Error inserting sentence:', error);
            failedCount++;
          } else {
            successCount++;
          }
        } catch (error) {
          console.error('Error processing sentence:', error);
          failedCount++;
        }
      }
      
      setUploadResults({ success: successCount, failed: failedCount });
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Download CSV template
  const downloadTemplate = () => {
    const templateContent = `spanish_text,english_text,grammar_focus,difficulty_level,curriculum_tier,theme,topic
"Me llamo María","My name is María","introductions","easy","Foundation","Identity","Personal Information"
"Tengo quince años","I am fifteen years old","numbers","easy","Foundation","Identity","Age"
"Vivo en Madrid","I live in Madrid","present-tense","medium","Foundation","Location","Where I Live"`;
    
    const blob = new Blob([templateContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'speed_builder_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = parsedSentences.filter(s => s.valid).length;
  const invalidCount = parsedSentences.length - validCount;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/content/speed-builder">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bulk Upload Sentences</h1>
            <p className="text-gray-600">Upload multiple sentences from a CSV file</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={downloadTemplate}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
        >
          <Download className="w-4 h-4 inline mr-2" />
          Download Template
        </motion.button>
      </div>

      {/* Upload Results */}
      {uploadResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Upload Complete</h3>
              <p className="text-green-600">
                {uploadResults.success} sentences uploaded successfully
                {uploadResults.failed > 0 && `, ${uploadResults.failed} failed`}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Upload Section */}
      {!showPreview && (
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="text-center">
            <motion.div
              className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"
              whileHover={{ scale: 1.1 }}
            >
              <Upload className="w-8 h-8 text-blue-600" />
            </motion.div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload CSV File</h2>
            <p className="text-gray-600 mb-6">
              Upload a CSV file with your sentences. Make sure to follow the template format.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer flex flex-col items-center space-y-3"
              >
                <FileText className="w-12 h-12 text-gray-400" />
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900">Choose CSV file</p>
                  <p className="text-sm text-gray-500">or drag and drop it here</p>
                </div>
              </label>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">CSV Format Requirements:</h3>
              <ul className="text-sm text-blue-800 space-y-1 text-left max-w-md mx-auto">
                <li>• <strong>spanish_text</strong> (required): The Spanish sentence</li>
                <li>• <strong>english_text</strong> (required): The English translation</li>
                <li>• <strong>difficulty_level</strong> (required): easy, medium, or hard</li>
                <li>• <strong>curriculum_tier</strong> (required): Foundation or Higher</li>
                <li>• <strong>grammar_focus</strong> (optional): Grammar concept</li>
                <li>• <strong>theme</strong> (optional): Subject theme</li>
                <li>• <strong>topic</strong> (optional): Specific topic</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Preview Section */}
      {showPreview && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-green-600">Valid Sentences</p>
                  <p className="text-xl font-bold text-green-800">{validCount}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <XCircle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="text-sm text-red-600">Invalid Sentences</p>
                  <p className="text-xl font-bold text-red-800">{invalidCount}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600">Total Rows</p>
                  <p className="text-xl font-bold text-blue-800">{parsedSentences.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowPreview(false);
                setParsedSentences([]);
                setCsvFile(null);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Upload Different File
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpload}
              disabled={validCount === 0 || isUploading}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 inline mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 inline mr-2" />
                  Upload {validCount} Valid Sentences
                </>
              )}
            </motion.button>
          </div>

          {/* Preview Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Row</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spanish</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Errors</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parsedSentences.map((sentence, index) => (
                    <tr key={index} className={sentence.valid ? 'bg-white' : 'bg-red-50'}>
                      <td className="px-4 py-3 text-sm text-gray-900">{sentence.row}</td>
                      <td className="px-4 py-3">
                        {sentence.valid ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                        {sentence.spanish_text}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                        {sentence.english_text}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sentence.difficulty_level === 'easy' ? 'bg-green-100 text-green-800' :
                          sentence.difficulty_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {sentence.difficulty_level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sentence.curriculum_tier === 'Foundation' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {sentence.curriculum_tier}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-red-600">
                        {sentence.errors.length > 0 && (
                          <div className="space-y-1">
                            {sentence.errors.map((error, i) => (
                              <div key={i} className="text-xs">{error}</div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 