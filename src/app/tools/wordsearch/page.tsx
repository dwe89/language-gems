'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Plus, Trash2, Search, Printer, RefreshCw, Download, Wand2 } from 'lucide-react';
import { useToast } from '../../../components/ui/use-toast';
import { generateWordSearch, WordSearchGrid } from '../../../utils/wordSearchGenerator';
import { WordEntry } from './types/wordsearch';

export default function WordSearchPage() {
  const [title, setTitle] = useState('LanguageGems Word Search');
  const [inputWords, setInputWords] = useState<WordEntry[]>([
    { id: '1', word: 'HELLO' },
    { id: '2', word: 'WORLD' },
    { id: '3', word: 'SEARCH' },
    { id: '4', word: 'PUZZLE' },
    { id: '5', word: 'LANGUAGE' },
  ]);
  const [wordSearchData, setWordSearchData] = useState<WordSearchGrid | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('Spanish basic vocabulary');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const { toast } = useToast();

  const addWord = useCallback(() => {
    setInputWords(prev => [
      ...prev,
      { id: Date.now().toString(), word: '' },
    ]);
  }, []);

  const updateWord = useCallback((id: string, value: string) => {
    setInputWords(prev =>
      prev.map(item =>
        item.id === id ? { ...item, word: value.toUpperCase().replace(/[^A-Z]/g, '') } : item
      )
    );
    setWordSearchData(null); // Invalidate generated data
  }, []);

  const removeWord = useCallback((id: string) => {
    setInputWords(prev => prev.filter(item => item.id !== id));
    setWordSearchData(null); // Invalidate generated data
  }, []);

  const handleGenerate = useCallback(async () => {
    const validWords = inputWords.filter(w => w.word.trim());
    if (validWords.length < 3) {
      toast({
        title: "Insufficient Words",
        description: "Please enter at least 3 words to generate a word search.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const data = generateWordSearch({
        words: validWords.map(w => w.word),
        gridSize: 15,
        difficulty: 'medium',
      });

      if (data) {
        setWordSearchData(data);
        toast({
          title: "Word Search Generated",
          description: `Successfully created word search with ${data.words.length} words.`,
        });
      } else {
        toast({
          title: "Generation Failed",
          description: "Could not generate word search with the provided words. Try different words.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Word search generation error:', error);
      toast({
        title: "Generation Error",
        description: "An error occurred while generating the word search.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [inputWords, toast]);

  const handlePrint = useCallback(() => {
    if (!wordSearchData) return;

    // Helpful tip so users can remove browser headers/footers
    toast({
      title: 'Print setup tip',
      description: 'In the print dialog, disable "Headers and footers" and enable "Background graphics" for best results.'
    });

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const beautifulHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title} - Word Search Puzzle</title>
          <style>
            @page { margin: 12mm; }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1f2937; background: white; }
            .container { max-width: 100%; margin: 0 auto; }
            .header { text-align: center; padding: 8mm 0 5mm; border-bottom: 2px solid #94a3b8; margin-bottom: 10mm; }
            .header h1 { font-size: 26px; font-weight: 800; color: #0f172a; }
            .print-hint { background: #eef2ff; border: 1px solid #c7d2fe; color: #3730a3; padding: 8px 12px; border-radius: 8px; margin: 10px auto 0; width: fit-content; font-size: 12px; }
            @media print { .print-hint { display: none; } }
            .puzzle-wrapper { display: flex; justify-content: center; }
            .grid-container { background: #f8fafc; border: 2px solid #94a3b8; border-radius: 10px; padding: 10px; }
            .word-search-grid { border-collapse: separate; border-spacing: 1px; background: #1f2937; border-radius: 6px; padding: 8px; }
            .word-search-grid td { width: 28px; height: 28px; background: #ffffff; border: 1px solid #000; text-align: center; font-weight: 800; font-size: 13px; color: #111827; }
            .words-title { text-align: center; font-size: 18px; font-weight: 800; color: #0f172a; margin: 10mm 0 4mm; }
            .words-list { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
            .word-item { text-align: center; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 999px; font-weight: 700; font-size: 12px; }
            @media (max-width: 768px) { .words-list { grid-template-columns: repeat(2, 1fr); } }
            @media print { .footer { display: none !important; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${title}</h1>
              <div class="print-hint">Tip: Turn off browser "Headers and footers" and turn on "Background graphics".</div>
            </div>
            <div class="puzzle-wrapper">
              <div class="grid-container">
                <table class="word-search-grid">
                  ${wordSearchData.grid.map(row =>
                    `<tr>${row.map(cell => `<td>${cell || ''}</td>`).join('')}</tr>`
                  ).join('')}
                </table>
              </div>
            </div>
            <h2 class="words-title">Words to Find</h2>
            <div class="words-list">
              ${wordSearchData.words.map((wordObj) => `<div class="word-item">${wordObj.word}</div>`).join('')}
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(beautifulHTML);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }, [wordSearchData, title, toast]);

  const handleDownload = useCallback(() => {
    if (!wordSearchData) return;

    // Create a beautiful, professional HTML version for download
    const beautifulHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title} - Word Search Puzzle</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            .content { padding: 40px; }

            .puzzle-section { display: flex; justify-content: center; }

            .grid-container {
              overflow: hidden;
              backdrop-filter: blur(10px);
            }

            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 40px 40px 30px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }

            .header::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="80" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="60" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="60" cy="30" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
              animation: float 20s ease-in-out infinite;
            }

            @keyframes float {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              33% { transform: translate(30px, -30px) rotate(120deg); }
              66% { transform: translate(-20px, 20px) rotate(240deg); }
            }

            .header h1 {
              font-size: 3rem;
              font-weight: 700;
              margin-bottom: 10px;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
              position: relative;
              z-index: 2;
            }

            .header .subtitle {
              font-size: 1.2rem;
              opacity: 0.9;
              font-weight: 300;
              position: relative;
              z-index: 2;
            }

            .content {
              padding: 40px;
              display: flex;
              gap: 40px;
              align-items: flex-start;
            }

            .puzzle-section {
              flex: 1;
              display: flex;
              justify-content: center;
            }

            .grid-container {
              background: linear-gradient(145deg, #ffffff, #f8f9fa);
              border-radius: 15px;
              padding: 30px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              border: 3px solid #e9ecef;
            }

            .word-search-grid {
              border-collapse: separate;
              border-spacing: 2px;
              background: #2c3e50;
              border-radius: 10px;
              padding: 15px;
              margin: 0 auto;
              box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
            }

            .word-search-grid td {
              width: 35px;
              height: 35px;
              background: linear-gradient(145deg, #ffffff, #f8f9fa);
              border: 2px solid #dee2e6;
              text-align: center;
              font-weight: 700;
              font-size: 16px;
              color: #2c3e50;
              border-radius: 6px;
              transition: all 0.3s ease;
              position: relative;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .word-search-grid td:hover {
              transform: scale(1.1);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              z-index: 10;
            }

            .word-search-grid td:empty {
              background: linear-gradient(145deg, #f8f9fa, #e9ecef);
            }

            .words-section { margin-top: 32px; }

            .words-title { font-size: 1.8rem; font-weight: 800; color: #2c3e50; margin: 10px 0 16px; text-align: center; }

            .words-list { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }

            .word-item {
              background: linear-gradient(135deg, #667eea, #764ba2);
              color: white;
              padding: 12px 20px;
              border-radius: 25px;
              font-weight: 600;
              font-size: 1rem;
              text-align: center;
              box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
              transition: all 0.3s ease;
              position: relative;
              overflow: hidden;
            }

            .word-item::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
              transition: left 0.5s;
            }

            .word-item:hover::before {
              left: 100%;
            }

            .word-item:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
            }

            .footer {
              background: linear-gradient(135deg, #2c3e50, #34495e);
              color: white;
              padding: 20px 40px;
              text-align: center;
            }

            .footer p {
              font-size: 0.9rem;
              opacity: 0.8;
              margin: 0;
            }

            .stats {
              display: flex;
              justify-content: center;
              gap: 30px;
              margin-top: 20px;
              flex-wrap: wrap;
            }

            .stat-item {
              background: rgba(255, 255, 255, 0.1);
              padding: 15px 25px;
              border-radius: 10px;
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .stat-label {
              font-size: 0.8rem;
              opacity: 0.7;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 5px;
            }

            .stat-value {
              font-size: 1.5rem;
              font-weight: 700;
            }

            @media (max-width: 1024px) { .words-list { grid-template-columns: repeat(3, 1fr); } }
            @media (max-width: 640px) { .words-list { grid-template-columns: repeat(2, 1fr); } }

            @media print {
              body {
                background: white !important;
                padding: 20px !important;
              }

              .container {
                box-shadow: none !important;
                border-radius: 0 !important;
              }

              .header {
                background: #f8f9fa !important;
                color: #333 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              .word-search-grid td {
                border: 1px solid #000 !important;
                background: white !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              .word-item {
                background: #f8f9fa !important;
                color: #333 !important;
                border: 1px solid #ddd !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${title}</h1>
              <p class="subtitle">Find all the hidden words in the puzzle!</p>
            </div>

            <div class="content">
              <div class="puzzle-section">
                <div class="grid-container">
                  <table class="word-search-grid">
                    ${wordSearchData.grid.map(row =>
                      `<tr>${row.map(cell => `<td>${cell || ''}</td>`).join('')}</tr>`
                    ).join('')}
                  </table>
                </div>
              </div>

              <div class="words-section">
                <h2 class="words-title">Words to Find</h2>
                <div class="words-list">
                  ${wordSearchData.words.map((wordObj) => `<div class="word-item">${wordObj.word}</div>`).join('')}
                </div>
              </div>
            </div>

            <div class="footer">
              <div class="stats">
                <div class="stat-item">
                  <div class="stat-label">Words</div>
                  <div class="stat-value">${wordSearchData.words.length}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">Grid Size</div>
                  <div class="stat-value">${wordSearchData.size.rows} × ${wordSearchData.size.cols}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">Created</div>
                  <div class="stat-value">${new Date().toLocaleDateString()}</div>
                </div>
              </div>
              <p style="margin-top: 20px;">Created with ❤️ by LanguageGems</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Create and download the file
    const blob = new Blob([beautifulHTML], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}_WordSearch.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show success message
    toast({
      title: "Download Complete! 🎉",
      description: "Your beautiful word search has been downloaded as an HTML file.",
    });
  }, [wordSearchData, title, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl shadow-2xl mb-6 animate-pulse">
            <Search className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Word Search Generator
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Create engaging word search puzzles for language learning with AI assistance and beautiful, printable designs
          </p>
          <div className="flex justify-center mt-6 space-x-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Generation Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/30 transition-all duration-500 hover:-translate-y-1">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 animate-pulse"></div>
                <div className="relative z-10">
                  <h3 className="font-bold text-white text-xl flex items-center mb-2">
                    <Wand2 className="h-6 w-6 mr-3 animate-spin" style={{ animationDuration: '3s' }} />
                    AI Word Generation
                  </h3>
                  <p className="text-emerald-100 text-sm leading-relaxed">Generate vocabulary with AI assistance</p>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label htmlFor="ai-prompt" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                    Topic/Theme
                  </label>
                  <Textarea
                    id="ai-prompt"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., Spanish food vocabulary, French travel terms, German animals"
                    rows={3}
                    className="text-sm border-slate-300 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-700 rounded-xl transition-all duration-300 hover:bg-white dark:hover:bg-slate-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => {
                      // TODO: Implement AI generation
                      toast({
                        title: "Coming Soon",
                        description: "AI word generation for word search will be available soon!",
                      });
                    }}
                    disabled={isGeneratingAI}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-emerald-500/25 h-12 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                    size="sm"
                  >
                    {isGeneratingAI ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        <span className="text-sm font-medium">Generating...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Generate AI</span>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      const sampleWords = [
                        { word: 'SPANISH' },
                        { word: 'FRENCH' },
                        { word: 'GERMAN' },
                        { word: 'HELLO' },
                        { word: 'GOODBYE' },
                        { word: 'PLEASE' },
                        { word: 'THANKYOU' },
                        { word: 'WATER' },
                        { word: 'HOUSE' },
                        { word: 'SCHOOL' },
                      ];

                      setInputWords(
                        sampleWords.map((item, index) => ({
                          id: (Date.now() + index).toString(),
                          word: item.word,
                        }))
                      );
                      setWordSearchData(null);
                    }}
                    variant="outline"
                    size="sm"
                    className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 h-12 rounded-xl text-slate-700 dark:text-slate-300 hover:border-emerald-300 transition-all duration-300 hover:scale-105"
                  >
                    <span className="text-sm font-medium">Load Sample</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Title Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-teal-200/50 dark:hover:shadow-teal-900/30 transition-all duration-500 hover:-translate-y-1">
              <label htmlFor="wordsearch-title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center">
                <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                Word Search Title
              </label>
              <Input
                id="wordsearch-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter word search title"
                className="border-slate-300 dark:border-slate-600 focus:border-teal-500 focus:ring-teal-500 bg-slate-50 dark:bg-slate-700 rounded-xl h-12 text-lg font-medium transition-all duration-300 hover:bg-white dark:hover:bg-slate-600"
              />
            </div>

            {/* Words Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-cyan-200/50 dark:hover:shadow-cyan-900/30 transition-all duration-500 hover:-translate-y-1">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 animate-pulse"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <h3 className="font-bold text-white text-xl">
                    Words to Find
                  </h3>
                  <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full font-semibold backdrop-blur-sm">
                    {inputWords.filter(w => w.word.trim()).length} words
                  </span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Add your vocabulary words</span>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={addWord}
                    className="h-12 px-6 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:border-cyan-300 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-cyan-500/25"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Add Word</span>
                  </Button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {inputWords.map((item, index) => (
                    <div key={item.id} className="group relative bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 p-5 rounded-2xl border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                          {index + 1}
                        </div>
                        <Input
                          placeholder="WORD"
                          value={item.word}
                          onChange={(e) => updateWord(item.id, e.target.value)}
                          className="flex-grow h-12 text-lg font-mono font-bold border-slate-300 dark:border-slate-600 focus:border-cyan-500 focus:ring-cyan-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 rounded-xl transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeWord(item.id)}
                          className="flex-shrink-0 h-10 w-10 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl hover:scale-110"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              className="w-full h-16 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 text-white font-bold text-xl shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-[1.02] transition-all duration-500 rounded-2xl border-2 border-white/20 backdrop-blur-sm"
              onClick={handleGenerate}
              disabled={isGenerating || inputWords.filter(w => w.word.trim()).length < 3}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-6 w-6 mr-4 animate-spin" />
                  Generating Word Search...
                </>
              ) : (
                <>
                  <Search className="h-6 w-6 mr-4 animate-bounce" />
                  Generate Word Search
                </>
              )}
            </Button>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-8">
            {wordSearchData ? (
              <div className="space-y-6">
                {/* Controls */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/30 transition-all duration-500 hover:-translate-y-1">
                  <div className="flex flex-wrap items-center gap-4 justify-center">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handleDownload}
                      className="h-14 px-8 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl hover:border-emerald-300 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-emerald-500/25 font-semibold"
                    >
                      <Download className="h-5 w-5 mr-3" />
                      <span className="text-lg">Download</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handlePrint}
                      className="h-14 px-8 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl hover:border-teal-300 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-teal-500/25 font-semibold"
                    >
                      <Printer className="h-5 w-5 mr-3" />
                      <span className="text-lg">Print</span>
                    </Button>
                  </div>
                </div>

                {/* Word Search Grid */}
                                {/* Word Search Grid */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 hover:shadow-teal-200/50 dark:hover:shadow-teal-900/30 transition-all duration-500 hover:-translate-y-1">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-8 text-center">{title}</h2>
                  <div className="flex justify-center">
                    <div className="inline-block bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 p-8 rounded-3xl border-4 border-slate-200 dark:border-slate-600 shadow-inner">
                      <div
                        className="grid gap-1"
                        style={{
                          gridTemplateColumns: `repeat(${wordSearchData.size.cols}, minmax(0, 1fr))`,
                        }}
                      >
                        {wordSearchData.grid.flat().map((cell, index) => (
                          <div
                            key={index}
                            className="w-10 h-10 border-2 border-slate-300 dark:border-slate-500 flex items-center justify-center text-lg font-mono font-bold bg-white dark:bg-slate-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all duration-200 rounded-lg shadow-sm hover:shadow-md hover:scale-110"
                          >
                            {cell}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Words List */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 hover:shadow-cyan-200/50 dark:hover:shadow-cyan-900/30 transition-all duration-500 hover:-translate-y-1">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 text-center flex items-center justify-center">
                    <span className="mr-3">🔍</span>
                    Find These Words
                    <span className="ml-3">📝</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {wordSearchData.words.map((wordObj, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 px-4 py-3 rounded-2xl text-center font-mono font-bold text-slate-800 dark:text-slate-200 border-2 border-cyan-200 dark:border-cyan-700 hover:border-cyan-400 dark:hover:border-cyan-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
                      >
                        {wordObj.word}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-16 text-center hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/30 transition-all duration-500 hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-3xl mb-8">
                  <Search className="h-12 w-12 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Ready to Generate</h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-md mx-auto">
                  Add at least 3 words and click "Generate Word Search" to create your engaging puzzle.
                </p>
                <div className="flex justify-center space-x-3">
                  <div className="w-4 h-4 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-4 h-4 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
