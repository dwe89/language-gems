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
import { CrosswordGrid } from '../components/CrosswordGrid';
import { CrosswordClues } from '../components/CrosswordClues';
import { CrosswordData } from '../types/crossword';

export default function CrosswordResultPage() {
  const router = useRouter();
  const [crosswordData, setCrosswordData] = useState<CrosswordData | null>(null);
  const [title, setTitle] = useState('Crossword Puzzle');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);

  // Load puzzle data from sessionStorage
  useEffect(() => {
    try {
      const storedPuzzle = sessionStorage.getItem('crosswordPuzzle');
      const storedTitle = sessionStorage.getItem('crosswordTitle');
      
      if (storedPuzzle) {
        const puzzleData = JSON.parse(storedPuzzle);
        setCrosswordData(puzzleData);
        if (storedTitle) {
          setTitle(storedTitle);
        }
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
    if (!crosswordData) return;

    try {
      // Generate HTML using the crossword generator
      const htmlResponse = await fetch('/api/worksheets/generate-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          worksheet: {
            id: 'crossword-' + Date.now(),
            title: title,
            subject: 'Language Learning',
            topic: 'Crossword Puzzle',
            difficulty: 'intermediate',
            template_id: 'crossword',
            rawContent: {
              grid: crosswordData.grid,
              acrossClues: crosswordData.acrossClues,
              downClues: crosswordData.downClues,
              gridSize: {
                rows: crosswordData.grid.length,
                cols: crosswordData.grid[0]?.length || 0
              },
              instructions: 'Complete the crossword using the clues below.'
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
          filename: title.replace(/[^a-zA-Z0-9]/g, '_')
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
      a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
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
    if (!crosswordData) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this crossword puzzle: ${title}`,
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
    router.push('/tools/crossword');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-slate-600">Loading your crossword puzzle...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !crosswordData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Puzzle Not Found</h2>
          <p className="text-slate-600 mb-6">{error || 'No puzzle data available.'}</p>
          <Link href="/tools/crossword">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/tools/crossword" passHref>
              <Button variant="outline" size="icon" className="hover:bg-white hover:shadow-md transition-all duration-200">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Crossword Generated!
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
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button onClick={handlePrint} variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownload} className="bg-gradient-to-r from-purple-600 to-indigo-600">
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
                    <span className="font-medium">{title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Grid Size:</span>
                    <Badge variant="secondary">{crosswordData.gridSize.rows}×{crosswordData.gridSize.cols}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Words:</span>
                    <Badge variant="secondary">{crosswordData.placedWords.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Across Clues:</span>
                    <Badge variant="outline">{crosswordData.acrossClues.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Down Clues:</span>
                    <Badge variant="outline">{crosswordData.downClues.length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setShowAnswers(!showAnswers)} 
                  variant="outline" 
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showAnswers ? 'Hide Answers' : 'Show Answers'}
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
                  <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
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
                    <strong>Instructions:</strong> Complete the crossword using the clues below. Words can be across or down.
                  </p>
                </div>

                {/* Crossword Grid and Clues Layout */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  {/* Grid - centered */}
                  <div className="flex-1 flex justify-center">
                    <CrosswordGrid
                      data={crosswordData}
                      showAnswers={showAnswers}
                      className="w-full max-w-2xl"
                    />
                  </div>
                  {/* Clues */}
                  <div className="flex-1 min-w-[300px]">
                    <CrosswordClues data={crosswordData} showAnswers={showAnswers} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
