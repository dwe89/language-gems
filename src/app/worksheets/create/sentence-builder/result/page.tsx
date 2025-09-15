'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Grid3x3,
  Languages,
  BookOpen,
  Copy
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
// import { toast } from 'sonner';

interface SentenceBuilderColumn {
  title: string;
  items: Array<{
    text: string;
    translation: string;
  }>;
}

interface SentenceBuilderWorksheet {
  title: string;
  instructions: string;
  subject: string;
  language: string;
  topic: string;
  columns: SentenceBuilderColumn[];
  exampleSentences: string[];
  difficulty: string;
  estimatedTime: string;
}

export default function SentenceBuilderResultPage() {
  const [sentenceBuilderData, setSentenceBuilderData] = useState<SentenceBuilderWorksheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get data from sessionStorage
    try {
      const storedData = sessionStorage.getItem('sentenceBuilderData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setSentenceBuilderData(parsedData);
        console.log('Loaded sentence builder data from sessionStorage:', parsedData);
      } else {
        setError('No sentence builder data found. Please generate a worksheet first.');
      }
    } catch (err) {
      console.error('Error loading sentence builder data:', err);
      setError('Failed to load sentence builder data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEdit = () => {
    window.location.href = '/worksheets/create/sentence-builder';
  };

  const handleRegenerate = () => {
    // Clear current data and redirect to generator
    sessionStorage.removeItem('sentenceBuilderData');
    window.location.href = '/worksheets/create/sentence-builder';
  };

  const handleShare = async () => {
    try {
      const shareUrl = window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast.error('Failed to copy link');
    }
  };

  const handleDownload = () => {
    if (!sentenceBuilderData) return;

    // Generate a simple text version for download
    const content = generateTextVersion(sentenceBuilderData);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sentenceBuilderData.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Worksheet downloaded!');
  };

  const handlePrint = () => {
    if (!sentenceBuilderData) return;
    
    const printContent = generatePrintHTML(sentenceBuilderData);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(printContent);
      newWindow.document.close();
      newWindow.print();
    }
  };

  const generateTextVersion = (data: SentenceBuilderWorksheet): string => {
    let content = `${data.title}\n`;
    content += `${'='.repeat(data.title.length)}\n\n`;
    content += `Subject: ${data.subject.charAt(0).toUpperCase() + data.subject.slice(1)}\n`;
    content += `Topic: ${data.topic}\n`;
    content += `Difficulty: ${data.difficulty}\n`;
    content += `Estimated Time: ${data.estimatedTime}\n\n`;
    content += `Instructions:\n${data.instructions}\n\n`;
    
    // Add columns
    data.columns.forEach((column, index) => {
      content += `Column ${index + 1}: ${column.title}\n`;
      content += `${'-'.repeat(column.title.length + 10)}\n`;
      column.items.forEach((item, itemIndex) => {
        content += `${itemIndex + 1}. ${item.text} (${item.translation})\n`;
      });
      content += '\n';
    });

    // Add example sentences
    if (data.exampleSentences && data.exampleSentences.length > 0) {
      content += 'Example Sentences:\n';
      content += '==================\n';
      data.exampleSentences.forEach((sentence, index) => {
        content += `${index + 1}. ${sentence}\n`;
      });
    }

    return content;
  };

  const generatePrintHTML = (data: SentenceBuilderWorksheet): string => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .subtitle { color: #666; margin-bottom: 20px; }
            .instructions { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            .grid { display: grid; grid-template-columns: repeat(${data.columns.length}, 1fr); gap: 20px; margin-bottom: 30px; }
            .column { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
            .column-title { font-weight: bold; margin-bottom: 10px; text-align: center; background: #e9ecef; padding: 8px; border-radius: 3px; }
            .column-item { margin-bottom: 8px; padding: 5px; border-bottom: 1px dotted #ccc; }
            .translation { color: #666; font-style: italic; }
            .examples { margin-top: 30px; }
            .example { margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-left: 4px solid #007bff; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${data.title}</div>
            <div class="subtitle">${data.subject.charAt(0).toUpperCase() + data.subject.slice(1)} - ${data.topic} (${data.difficulty})</div>
          </div>
          
          <div class="instructions">
            <strong>Instructions:</strong> ${data.instructions}
          </div>
          
          <div class="grid">
            ${data.columns.map(column => `
              <div class="column">
                <div class="column-title">${column.title}</div>
                ${column.items.map(item => `
                  <div class="column-item">
                    <div>${item.text}</div>
                    <div class="translation">(${item.translation})</div>
                  </div>
                `).join('')}
              </div>
            `).join('')}
          </div>
          
          ${data.exampleSentences && data.exampleSentences.length > 0 ? `
            <div class="examples">
              <h3>Example Sentences:</h3>
              ${data.exampleSentences.map(sentence => `
                <div class="example">${sentence}</div>
              `).join('')}
            </div>
          ` : ''}
        </body>
      </html>
    `;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading sentence builder worksheet...</p>
        </div>
      </div>
    );
  }

  if (error || !sentenceBuilderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Worksheet Not Found</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link href="/worksheets/create/sentence-builder">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Generator
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/worksheets/create/sentence-builder">
              <Button variant="outline" size="icon" className="hover:bg-white hover:shadow-md transition-all duration-200">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {sentenceBuilderData.title}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Languages className="h-3 w-3 mr-1" />
                  {sentenceBuilderData.subject.charAt(0).toUpperCase() + sentenceBuilderData.subject.slice(1)}
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {sentenceBuilderData.topic}
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Clock className="h-3 w-3 mr-1" />
                  {sentenceBuilderData.estimatedTime}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleEdit} className="hover:bg-slate-50">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={handleRegenerate} className="hover:bg-slate-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
            <Button variant="outline" onClick={handleShare} className="hover:bg-slate-50">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={handlePrint} className="hover:bg-slate-50">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownload} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sentence Builder Grid */}
          <div className="lg:col-span-3">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-purple-100/50">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Grid3x3 className="h-6 w-6" />
                  </div>
                  Sentence Builder Grid
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Use words from each column to build complete sentences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* Instructions */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Instructions:</h4>
                      <p className="text-slate-700 leading-relaxed">{sentenceBuilderData.instructions}</p>
                    </div>
                  </div>
                </div>

                {/* Gender Agreement Legend */}
                {sentenceBuilderData.columns.some(col => col.items.some((item: any) => item.group)) && (
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-b">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1 bg-amber-100 rounded">
                        <span className="text-amber-600 text-sm font-bold">⚡</span>
                      </div>
                      <h4 className="font-semibold text-amber-900 text-sm">Gender Agreement Guide</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-50 border border-blue-300 rounded"></div>
                        <span className="text-blue-900">Masculine Singular</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-pink-50 border border-pink-300 rounded"></div>
                        <span className="text-pink-900">Feminine Singular</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-100 border border-blue-400 rounded"></div>
                        <span className="text-blue-900 font-semibold">Masculine Plural</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-pink-100 border border-pink-400 rounded"></div>
                        <span className="text-pink-900 font-semibold">Feminine Plural</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Grid Display */}
                <div className="p-6">
                  <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${sentenceBuilderData.columns.length}, 1fr)` }}>
                    {sentenceBuilderData.columns.map((column, columnIndex) => (
                      <div key={columnIndex} className="bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg border-2 border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white p-4 text-center">
                          <h3 className="font-bold text-sm">{column.title}</h3>
                        </div>
                        <div className="p-3 space-y-2">
                          {column.items.map((item, itemIndex) => {
                            // Gender-based color coding
                            const getGenderStyles = (group?: string) => {
                              switch (group) {
                                case 'MASCULINE_SINGULAR':
                                  return 'border-blue-300 bg-blue-50 text-blue-900';
                                case 'FEMININE_SINGULAR':
                                  return 'border-pink-300 bg-pink-50 text-pink-900';
                                case 'MASCULINE_PLURAL':
                                  return 'border-blue-400 bg-blue-100 text-blue-900 font-semibold';
                                case 'FEMININE_PLURAL':
                                  return 'border-pink-400 bg-pink-100 text-pink-900 font-semibold';
                                default:
                                  return 'border-slate-200 bg-white text-slate-800';
                              }
                            };

                            const genderStyles = getGenderStyles((item as any).group);

                            return (
                              <div
                                key={itemIndex}
                                className={`rounded-lg p-3 border hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105 ${genderStyles}`}
                              >
                                <div className="font-medium text-sm mb-1">
                                  {item.text}
                                </div>
                                <div className="text-xs opacity-75 italic">
                                  ({item.translation})
                                </div>
                                {(item as any).group && (
                                  <div className="text-xs mt-1 opacity-60 font-mono">
                                    {(item as any).group.replace('_', ' ').toLowerCase()}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Example Sentences */}
                {sentenceBuilderData.exampleSentences && sentenceBuilderData.exampleSentences.length > 0 && (
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-t">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 mb-3">Example Sentences:</h4>
                        <div className="space-y-2">
                          {sentenceBuilderData.exampleSentences.map((sentence, index) => (
                            <div key={index} className="bg-white rounded-lg p-3 border border-green-200 shadow-sm">
                              <p className="text-slate-700 font-medium">{sentence}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Worksheet Info */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-slate-100/50">
              <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5" />
                  Worksheet Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Subject</Label>
                  <p className="text-slate-800 font-medium capitalize">{sentenceBuilderData.subject}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Topic</Label>
                  <p className="text-slate-800 font-medium">{sentenceBuilderData.topic}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Difficulty</Label>
                  <Badge variant="outline" className="capitalize">
                    {sentenceBuilderData.difficulty}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Estimated Time</Label>
                  <p className="text-slate-800 font-medium">{sentenceBuilderData.estimatedTime}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Columns</Label>
                  <p className="text-slate-800 font-medium">{sentenceBuilderData.columns.length}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Total Items</Label>
                  <p className="text-slate-800 font-medium">
                    {sentenceBuilderData.columns.reduce((sum, col) => sum + col.items.length, 0)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-orange-100/50">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Grid3x3 className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="w-full justify-start hover:bg-orange-50 hover:border-orange-300"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Worksheet
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full justify-start hover:bg-green-50 hover:border-green-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full justify-start hover:bg-blue-50 hover:border-blue-300"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
