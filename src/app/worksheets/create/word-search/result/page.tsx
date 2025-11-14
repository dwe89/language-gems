'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  Eye,
  Edit3,
  Printer,
  Share2,
  RefreshCw,

  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// Word search puzzle data interface
interface WordSearchData {
  id: string;
  title: string;
  subject: string;
  language: string;
  level: string;
  gridSize: number;
  words: string[];
  grid: string[][];
  instructions: string;
  estimatedTime: number;
  difficulty: string;
  settings: any;
  vocabularyConfig: any;
  createdAt: string;
  wordPositions: Array<{
    word: string;
    path: Array<{ x: number; y: number }>;
  }>;
}

export default function WordSearchResultPage() {
  const router = useRouter();
  const [wordSearchData, setWordSearchData] = useState<WordSearchData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load puzzle data from sessionStorage
  useEffect(() => {
    try {
      const storedPuzzle = sessionStorage.getItem('wordSearchPuzzle');
      if (storedPuzzle) {
        const puzzleData = JSON.parse(storedPuzzle);
        setWordSearchData(puzzleData);
      } else {
        setError('No puzzle data found. Please generate a puzzle first.');
      }
    } catch (err) {
      console.error('Error loading puzzle data:', err);
      setError('Failed to load puzzle data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDownload = async () => {
    if (!wordSearchData) return;

    try {
      // Generate HTML using the word search generator
      const htmlResponse = await fetch('/api/worksheets/generate-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          worksheet: {
            id: wordSearchData.id,
            title: wordSearchData.title,
            subject: wordSearchData.subject,
            topic: wordSearchData.language,
            difficulty: wordSearchData.difficulty,
            template_id: 'word-search',
            rawContent: {
              word_search_words: wordSearchData.words,
              word_search_difficulty: wordSearchData.difficulty
            }
          }
        })
      });

      if (!htmlResponse.ok) {
        throw new Error('Failed to generate HTML');
      }

      const { html } = await htmlResponse.json();

      // Generate PDF
      const pdfResponse = await fetch('/api/worksheets/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html,
          filename: wordSearchData.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
        })
      });

      if (!pdfResponse.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Download the PDF
      const blob = await pdfResponse.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${wordSearchData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (!wordSearchData) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: wordSearchData.title,
          text: `Check out this word search puzzle: ${wordSearchData.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleEdit = () => {
    // Store current puzzle data and navigate back to edit
    if (wordSearchData) {
      sessionStorage.setItem('editWordSearchPuzzle', JSON.stringify(wordSearchData));
    }
    router.push('/worksheets/create/word-search');
  };

  const regeneratePuzzle = async () => {
    if (!wordSearchData) return;

    // Navigate back to creation page with current settings
    sessionStorage.setItem('regenerateWordSearch', JSON.stringify({
      title: wordSearchData.title,
      subject: wordSearchData.subject,
      language: wordSearchData.language,
      words: wordSearchData.words,
      settings: wordSearchData.settings,
      vocabularyConfig: wordSearchData.vocabularyConfig,
      instructions: wordSearchData.instructions
    }));
    router.push('/worksheets/create/word-search');
  };

  const previewStudentView = () => {
    // Open a new window with student view
    const studentHTML = generateStudentViewHTML(wordSearchData);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(studentHTML);
      newWindow.document.close();
    }
  };

  // Helper functions for generating HTML
  const generatePrintableHTML = (data: WordSearchData) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .grid { border-collapse: collapse; margin: 20px auto; }
            .grid td { width: 25px; height: 25px; border: 1px solid #000; text-align: center; font-weight: bold; }
            .words { margin: 20px 0; }
            .word-list { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
          </style>
        </head>
        <body>
          <h1>${data.title}</h1>
          <p>${data.instructions}</p>
          ${renderGridHTML(data.grid)}
          <div class="words">
            <h3>Words to Find:</h3>
            <div class="word-list">
              ${data.words.map(word => `<div>${word}</div>`).join('')}
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const generateStudentViewHTML = (data: WordSearchData | null) => {
    if (!data) return '';
    return generatePrintableHTML(data);
  };

  const renderGridHTML = (grid: string[][]) => {
    return `
      <table class="grid">
        ${grid.map(row =>
          `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
        ).join('')}
      </table>
    `;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-slate-600">Loading your word search puzzle...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !wordSearchData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Puzzle Not Found</h2>
          <p className="text-slate-600 mb-6">{error || 'No puzzle data available.'}</p>
          <Link href="/worksheets/create/word-search">
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Create New Puzzle
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/worksheets/create/word-search" passHref>
              <Button variant="outline" size="icon" className="hover:bg-white hover:shadow-md transition-all duration-200">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Word Search Generated!
              </h1>
              <p className="text-slate-600 text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Your puzzle is ready
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button onClick={regeneratePuzzle} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleDownload} className="bg-gradient-to-r from-green-600 to-emerald-600">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Puzzle Info Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puzzle Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Title:</span>
                    <span className="font-medium">{wordSearchData.title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subject:</span>
                    <Badge variant="outline">{wordSearchData.subject}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Level:</span>
                    <Badge variant="outline">{wordSearchData.level}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Grid Size:</span>
                    <Badge variant="secondary">{wordSearchData.gridSize}×{wordSearchData.gridSize}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Words:</span>
                    <Badge variant="secondary">{wordSearchData.words.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Difficulty:</span>
                    <Badge variant="outline">{wordSearchData.difficulty}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Est. Time:</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-sm">{wordSearchData.estimatedTime} min</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Word List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Word List</CardTitle>
                <CardDescription>Words hidden in the puzzle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                  {wordSearchData.words.map((word, index) => (
                    <div key={index} className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-100 hover:shadow-sm transition-all">
                      <span className="font-mono text-sm font-bold text-slate-800">{word}</span>
                      <Badge variant="outline" className="text-xs bg-white border-purple-200 text-purple-700">
                        {word.length} letters
                      </Badge>
                    </div>
                  ))}
                </div>
                {wordSearchData.words.length > 8 && (
                  <div className="mt-3 text-center">
                    <Badge variant="secondary" className="text-xs">
                      {wordSearchData.words.length} words total
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={previewStudentView} variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Student View
                </Button>
                <Button onClick={handlePrint} variant="outline" className="w-full">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Worksheet
                </Button>
                <Button onClick={handleDownload} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Puzzle Display */}
          <div className="lg:col-span-2">
            <Card className="h-fit">
              <CardContent className="p-8">
                {/* Centered Header - matching PDF */}
                <div className="text-center mb-8">
                  <h1 className="text-sm font-semibold text-slate-500 tracking-wide mb-2">LanguageGems</h1>
                  <h2 className="text-3xl font-bold text-slate-900">Word Search Puzzle</h2>
                </div>

                {/* Inline Name & Class fields - matching PDF */}
                <div className="flex gap-8 mb-6 pb-4 border-b-2 border-slate-200">
                  <div className="flex items-center gap-3 flex-1">
                    <label className="font-semibold text-slate-700 text-sm">Name:</label>
                    <div className="flex-1 border-b border-slate-300 h-6"></div>
                  </div>
                  <div className="flex items-center gap-3 flex-1">
                    <label className="font-semibold text-slate-700 text-sm">Class:</label>
                    <div className="flex-1 border-b border-slate-300 h-6"></div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-8">
                  <p className="text-sm text-slate-700">
                    <strong>Instructions:</strong> {wordSearchData.instructions}
                  </p>
                </div>

                {/* Larger Centered Word Search Grid - matching PDF */}
                <div className="flex justify-center mb-8">
                  <table className="border-collapse border-3 border-slate-800">
                    <tbody>
                      {wordSearchData.grid.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, colIndex) => (
                            <td
                              key={colIndex}
                              className="w-10 h-10 border border-slate-400 text-center font-mono font-bold text-lg bg-white hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Words in 6 Columns - matching PDF */}
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b-2 border-blue-500">
                    Words to Find:
                  </h3>
                  <div className="grid grid-cols-6 gap-3">
                    {wordSearchData.words.map((word, index) => (
                      <div
                        key={index}
                        className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-center text-sm font-semibold text-slate-700 uppercase"
                      >
                        {word}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips for Students - keeping this helpful info */}
                <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Tips for Students:
                  </h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Look for words horizontally, vertically, and diagonally</li>
                    <li>• Words can be forwards or backwards</li>
                    <li>• Check off each word as you find it</li>
                    <li>• Take your time and be systematic</li>
                    <li>• Use a pencil to circle or highlight found words</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}