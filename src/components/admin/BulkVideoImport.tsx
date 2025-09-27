'use client';

import React, { useState } from 'react';

import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  X,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

interface BulkVideoImportProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface VideoImportData {
  title: string;
  youtube_id: string;
  language: string;
  level: string;
  theme?: string;
  topic?: string;
  subtopic?: string;
  description?: string;
}

export default function BulkVideoImport({ onComplete, onCancel }: BulkVideoImportProps) {
  const [importData, setImportData] = useState('');
  const [defaultLanguage, setDefaultLanguage] = useState('es');
  const [defaultLevel, setDefaultLevel] = useState('beginner');
  const [defaultTheme, setDefaultTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null);

  const sampleData = `Title,YouTube ID,Language,Level,Theme,Topic,Description
Spanish Numbers Song,EGaSgIRswcI,es,beginner,vocabulary,numbers,Learn numbers 1-20 in Spanish
French Verb Conjugation,EGaSgIRswcI,fr,intermediate,grammar,verbs,Master present tense verbs
German Greetings,EGaSgIRswcI,de,beginner,vocabulary,basics_core_language,Common German greetings`;

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Title,YouTube ID,Language,Level,Theme,Topic,Subtopic,Description\n" +
      "Spanish Numbers Song,EGaSgIRswcI,es,beginner,vocabulary,numbers,,Learn numbers 1-20\n" +
      "French Verbs,EGaSgIRswcI,fr,intermediate,grammar,verbs,present_tense,Present tense conjugation";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "video_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSV = (csvText: string): VideoImportData[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const video: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        switch (header) {
          case 'title':
            video.title = value;
            break;
          case 'youtube id':
          case 'youtube_id':
            video.youtube_id = value;
            break;
          case 'language':
            video.language = value || defaultLanguage;
            break;
          case 'level':
            video.level = value || defaultLevel;
            break;
          case 'theme':
            video.theme = value || defaultTheme;
            break;
          case 'topic':
            video.topic = value;
            break;
          case 'subtopic':
            video.subtopic = value;
            break;
          case 'description':
            video.description = value;
            break;
        }
      });
      
      return video as VideoImportData;
    });
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      alert('Please enter CSV data to import');
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const videos = parseCSV(importData);
      const errors: string[] = [];
      let successCount = 0;

      for (const [index, video] of videos.entries()) {
        try {
          // Validate required fields
          if (!video.title || !video.youtube_id) {
            errors.push(`Row ${index + 2}: Missing title or YouTube ID`);
            continue;
          }

          // Prepare video data
          const videoData = {
            title: video.title,
            youtube_id: video.youtube_id,
            language: video.language,
            level: video.level,
            theme: video.theme || null,
            topic: video.topic || null,
            subtopic: video.subtopic || null,
            description: video.description || null,
            thumbnail_url: `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`,
            is_active: true,
            is_featured: false,
            vocabulary_count: 0
          };

          const { error } = await supabase
            .from('youtube_videos')
            .insert([videoData]);

          if (error) {
            if (error.code === '23505') { // Unique constraint violation
              errors.push(`Row ${index + 2}: Video with YouTube ID "${video.youtube_id}" already exists`);
            } else {
              errors.push(`Row ${index + 2}: ${error.message}`);
            }
          } else {
            successCount++;
          }
        } catch (error: any) {
          errors.push(`Row ${index + 2}: ${error.message}`);
        }
      }

      setResults({ success: successCount, errors });

    } catch (error: any) {
      setResults({ success: 0, errors: [`Import failed: ${error.message}`] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Bulk Video Import
            </CardTitle>
            <Button variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Import Instructions</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Prepare your data in CSV format with headers</li>
              <li>• Required fields: Title, YouTube ID</li>
              <li>• Optional fields: Language, Level, Theme, Topic, Subtopic, Description</li>
              <li>• Use the template below or download the CSV template</li>
            </ul>
          </div>

          {/* Template Download */}
          <div className="flex items-center gap-4">
            <Button onClick={downloadTemplate} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download CSV Template
            </Button>
            <Button 
              onClick={() => setImportData(sampleData)} 
              variant="outline"
            >
              <FileText className="w-4 h-4 mr-2" />
              Use Sample Data
            </Button>
          </div>

          {/* Default Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="defaultLanguage">Default Language</Label>
              <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="defaultLevel">Default Level</Label>
              <Select value={defaultLevel} onValueChange={setDefaultLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="defaultTheme">Default Theme (Optional)</Label>
              <Select value={defaultTheme} onValueChange={setDefaultTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="No default theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Default</SelectItem>
                  <SelectItem value="vocabulary">Vocabulary</SelectItem>
                  <SelectItem value="grammar">Grammar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* CSV Input */}
          <div>
            <Label htmlFor="csvData">CSV Data</Label>
            <Textarea
              id="csvData"
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your CSV data here..."
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                <CheckCircle className="w-4 h-4" />
                Successfully imported {results.success} video{results.success !== 1 ? 's' : ''}
              </div>

              {results.errors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <AlertCircle className="w-4 h-4" />
                    {results.errors.length} error{results.errors.length !== 1 ? 's' : ''} occurred
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <ul className="text-sm text-red-700 space-y-1">
                      {results.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={loading || !importData.trim()}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Videos
                </>
              )}
            </Button>
            {results && results.success > 0 && (
              <Button onClick={onComplete}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
