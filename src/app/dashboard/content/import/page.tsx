'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { createBrowserClient } from '@supabase/ssr';
import { Upload, Download, CheckCircle, AlertCircle, FileText, Eye, Loader2 } from 'lucide-react';

interface VocabularyItem {
  theme: string;
  topic: string;
  partOfSpeech: string;
  spanishTerm: string;
  englishTranslation: string;
}

export default function VocabularyImportPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvContent, setCsvContent] = useState<string>('');
  const [parsedData, setParsedData] = useState<VocabularyItem[]>([]);
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState(false);
  const [importResults, setImportResults] = useState<{ success: number; errors: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Show loading spinner while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-rose-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated or not a teacher
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-rose-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
          <p className="text-gray-600">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  // Parse CSV content
  const parseCSV = (content: string): VocabularyItem[] => {
    const lines = content.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: VocabularyItem[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      // Better CSV parsing to handle quoted fields with commas
      const values = parseCSVLine(line);
      
      if (values.length >= 3) {
        // Map different possible column names
        const getColumn = (possibleNames: string[]) => {
          for (const name of possibleNames) {
            const index = headers.findIndex(h => h.toLowerCase().includes(name.toLowerCase()));
            if (index !== -1) return values[index] || '';
          }
          return '';
        };
        
        const item: VocabularyItem = {
          theme: getColumn(['theme']),
          topic: getColumn(['topic']),
          partOfSpeech: getColumn(['part of speech', 'part_of_speech', 'speech']),
          spanishTerm: getColumn(['headword spanish', 'headword_spanish', 'spanish', 'term']),
          englishTranslation: getColumn(['english equivalent', 'english_equivalent', 'english', 'translation'])
        };
        
        if (item.spanishTerm && item.englishTranslation) {
          data.push(item);
        }
      }
    }
    
    return data;
  };

  // Better CSV line parsing
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setError(null);
    setCsvFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvContent(content);
      
      try {
        const parsed = parseCSV(content);
        setParsedData(parsed);
        if (parsed.length > 0) {
          setPreview(true);
        } else {
          setError('No valid vocabulary items found in the CSV. Please check the format.');
        }
      } catch (error) {
        console.error('Error parsing CSV:', error);
        setError('Error parsing CSV file. Please check the format.');
      }
    };
    
    reader.onerror = () => {
      setError('Error reading the file. Please try again.');
    };
    
    reader.readAsText(file);
  };

  // Import vocabulary to database
  const handleImport = async () => {
    if (!parsedData.length) return;
    
    setImporting(true);
    setError(null);
    
    try {
      let successCount = 0;
      const errors: string[] = [];
      
      for (const item of parsedData) {
        try {
          const { data, error } = await supabase.rpc('import_gcse_vocabulary_simple', {
            theme_name: item.theme,
            topic_name: item.topic,
            part_of_speech: item.partOfSpeech,
            spanish_term: item.spanishTerm,
            english_translation: item.englishTranslation
          });
          
          if (error) {
            errors.push(`${item.spanishTerm}: ${error.message}`);
          } else {
            successCount++;
          }
        } catch (err) {
          errors.push(`${item.spanishTerm}: Unexpected error`);
        }
      }
      
      setImportResults({ success: successCount, errors });
      
      if (successCount > 0) {
        setPreview(false);
        setCsvFile(null);
        setParsedData([]);
      }
      
    } catch (error) {
      console.error('Import error:', error);
      setError('Failed to import vocabulary. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-rose-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Import GCSE Vocabulary</h1>
            <p className="text-gray-600">Upload your CSV file containing GCSE Spanish vocabulary organized by themes and topics.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {importResults && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 mr-2" />
                <strong>Import Complete!</strong>
              </div>
              <p>Successfully imported {importResults.success} vocabulary items.</p>
              {importResults.errors.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm">
                    {importResults.errors.length} errors occurred (click to view)
                  </summary>
                  <ul className="mt-2 text-sm list-disc list-inside">
                    {importResults.errors.slice(0, 10).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {importResults.errors.length > 10 && (
                      <li>... and {importResults.errors.length - 10} more errors</li>
                    )}
                  </ul>
                </details>
              )}
            </div>
          )}

          {/* CSV Format Guide */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Expected CSV Format:</h3>
            <div className="text-sm text-blue-800">
              <p>Your CSV should have these columns (any order):</p>
              <ul className="list-disc list-inside mt-2">
                <li><strong>Theme</strong> - e.g., "People and lifestyle"</li>
                <li><strong>Topic</strong> - e.g., "Education and work"</li>
                <li><strong>Part of Speech</strong> - e.g., "N (m)", "V", "Adj"</li>
                <li><strong>Headword Spanish</strong> - Spanish term</li>
                <li><strong>English Equivalent</strong> - English translation</li>
              </ul>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CSV File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
                disabled={importing}
              />
              <label
                htmlFor="csv-upload"
                className={`cursor-pointer bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors ${importing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Choose CSV File
              </label>
              {csvFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {csvFile.name} ({Math.round(csvFile.size / 1024)} KB)
                </p>
              )}
            </div>
          </div>

          {/* Preview and Import */}
          {preview && parsedData.length > 0 && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Preview ({parsedData.length} items found)
                </h3>
                <div className="space-x-2">
                  <button
                    onClick={() => setPreview(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={importing}
                    className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center ${importing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {importing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {importing ? 'Importing...' : 'Import All'}
                  </button>
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Spanish</th>
                      <th className="p-2 text-left">English</th>
                      <th className="p-2 text-left">Theme</th>
                      <th className="p-2 text-left">Topic</th>
                      <th className="p-2 text-left">Part of Speech</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(0, 10).map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{item.spanishTerm}</td>
                        <td className="p-2">{item.englishTranslation}</td>
                        <td className="p-2">{item.theme}</td>
                        <td className="p-2">{item.topic}</td>
                        <td className="p-2">{item.partOfSpeech}</td>
                      </tr>
                    ))}
                    {parsedData.length > 10 && (
                      <tr>
                        <td colSpan={5} className="p-2 text-center text-gray-500">
                          ... and {parsedData.length - 10} more items
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need a Template?</h3>
            <a
              href="/data/vocabulary/sample-gcse-structure.csv"
              download
              className="inline-flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Sample CSV
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Force client-side rendering to avoid build issues with Supabase
export const dynamic = 'force-dynamic'; 