'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Plus, Trash2, Puzzle, Printer, RefreshCw, Download, Wand2 } from 'lucide-react';
import { useToast } from '../../../components/ui/use-toast';
import { CrosswordGrid } from './components/CrosswordGrid';
import { CrosswordClues } from './components/CrosswordClues';
import { generateCrosswordLayout } from './utils/crosswordGenerator';
import { CrosswordData, WordEntry } from './types/crossword';

export default function CrosswordPage() {
  const [title, setTitle] = useState('LanguageGems Crossword');
  const [inputWords, setInputWords] = useState<WordEntry[]>([
    { id: '1', word: 'HOLA', clue: 'Spanish greeting meaning "hello"' },
    { id: '2', word: 'CASA', clue: 'Spanish word for "house"' },
    { id: '3', word: 'AGUA', clue: 'Spanish word for "water"' },
    { id: '4', word: 'GATO', clue: 'Spanish word for "cat"' },
  ]);
  const [crosswordData, setCrosswordData] = useState<CrosswordData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('Spanish basic vocabulary');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const { toast } = useToast();

  const addWord = useCallback(() => {
    setInputWords(prev => [
      ...prev,
      { id: Date.now().toString(), word: '', clue: '' },
    ]);
  }, []);

  const updateWord = useCallback((id: string, field: 'word' | 'clue', value: string) => {
    setInputWords(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: field === 'word' ? value.toUpperCase().replace(/[^A-Z]/g, '') : value } : item
      )
    );
    setCrosswordData(null); // Invalidate generated data
  }, []);

  const removeWord = useCallback((id: string) => {
    setInputWords(prev => prev.filter(item => item.id !== id));
    setCrosswordData(null); // Invalidate generated data
  }, []);

  const handleGenerate = useCallback(async () => {
    const validWords = inputWords.filter(w => w.word.trim() && w.clue.trim());
    if (validWords.length < 3) {
      toast({
        title: "Insufficient Words",
        description: "Please enter at least 3 words and clues to generate a crossword.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const data = await generateCrosswordLayout(validWords);
      if (data) {
        setCrosswordData(data);
        toast({
          title: "Crossword Generated",
          description: `Successfully created crossword with ${data.placedWords.length} words.`,
        });
      } else {
        toast({
          title: "Generation Failed",
          description: "Could not generate crossword with the provided words. Try different words or add more variety.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Crossword generation error:', error);
      toast({
        title: "Generation Error",
        description: "An error occurred while generating the crossword.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [inputWords, toast]);

  const handlePrint = useCallback(() => {
    if (!crosswordData) return;

    // Create a print-optimized HTML version
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - Print Version</title>
          <style>
            @media print {
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .no-print { display: none; }
              .page-break { page-break-before: always; }
            }
            @media print {
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .no-print { display: none; }
              .page-break { page-break-before: always; }
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: white; }
            .crossword-container { display: flex; gap: 40px; margin-bottom: 40px; }
            .grid { border-collapse: collapse; margin: 0 auto; }
            .grid td {
              width: 35px;
              height: 35px;
              border: 2px solid #000;
              text-align: center;
              font-weight: bold;
              font-size: 14px;
              vertical-align: middle;
              position: relative;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .grid td.black {
              background-color: #000 !important;
              background-image: linear-gradient(to bottom, #000 0%, #000 100%) !important;
              border: 2px solid #000;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .grid td.white {
              background-color: #fff !important;
              border: 2px solid #000;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .clues { flex: 1; max-width: 300px; }
            .clue-section { margin-bottom: 25px; }
            h1 { text-align: center; font-size: 24px; margin-bottom: 30px; }
            h3 { font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #000; padding-bottom: 5px; }
            .clue { margin-bottom: 8px; line-height: 1.4; font-size: 14px; }
            .clue-number { font-weight: bold; display: inline-block; width: 25px; }
            .print-button {
              position: fixed;
              top: 20px;
              right: 20px;
              padding: 10px 20px;
              background: #007bff;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
            }
            @media print {
              .print-button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="background: #f0f8ff; border: 1px solid #0066cc; padding: 10px; margin-bottom: 20px; border-radius: 5px; font-size: 12px; color: #0066cc;">
            <strong>💡 Print Tip:</strong> For best results, enable "Background graphics" in your browser's print settings (usually found in Print Preview → More Settings).
          </div>
          <button class="print-button no-print" onclick="window.print()">Print Crossword</button>
          <h1>${title}</h1>
          <div class="crossword-container">
            <div>
              <table class="grid">
                ${crosswordData.grid.map(row =>
                  `<tr>${row.map(cell => {
                    const isBlack = cell.isBlack;
                    const bgColor = isBlack ? '#000' : '#fff';
                    const textColor = '#000';
                    return `<td class="${isBlack ? 'black' : 'white'}" style="background-color: ${bgColor}; border: 2px solid #000; color: ${textColor}; -webkit-print-color-adjust: exact; print-color-adjust: exact;">${cell.number ? `<span style="font-size: 10px; position: absolute; top: 2px; left: 2px; color: ${textColor};">${cell.number}</span>` : ''}${showAnswers ? cell.letter : ''}</td>`;
                  }).join('')}</tr>`
                ).join('')}
              </table>
            </div>
            <div class="clues">
              <div class="clue-section">
                <h3>Across</h3>
                ${crosswordData.acrossClues.map(clue =>
                  `<div class="clue"><span class="clue-number">${clue.number}.</span> ${clue.clue}</div>`
                ).join('')}
              </div>
              <div class="clue-section">
                <h3>Down</h3>
                ${crosswordData.downClues.map(clue =>
                  `<div class="clue"><span class="clue-number">${clue.number}.</span> ${clue.clue}</div>`
                ).join('')}
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Open in new window and print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();

      // Wait a bit for content to load, then print
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  }, [crosswordData, title, showAnswers]);

  const handleDownload = useCallback(() => {
    if (!crosswordData) return;
    
    // Create a simple HTML version for download
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .crossword-container { display: flex; gap: 40px; }
            .grid { border-collapse: collapse; }
            .grid td { width: 30px; height: 30px; border: 1px solid #ccc; text-align: center; font-weight: bold; }
            .grid .black { background: #000; }
            .grid .white { background: #fff; }
            .clues { flex: 1; }
            .clue-section { margin-bottom: 20px; }
            h1 { text-align: center; }
            h3 { margin-bottom: 10px; }
            .clue { margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="crossword-container">
            <div>
              <table class="grid">
                ${crosswordData.grid.map(row => 
                  `<tr>${row.map(cell => 
                    `<td class="${cell.isBlack ? 'black' : 'white'}">${cell.number || (showAnswers ? cell.letter : '')}</td>`
                  ).join('')}</tr>`
                ).join('')}
              </table>
            </div>
            <div class="clues">
              <div class="clue-section">
                <h3>Across</h3>
                ${crosswordData.acrossClues.map(clue => 
                  `<div class="clue">${clue.number}. ${clue.clue}</div>`
                ).join('')}
              </div>
              <div class="clue-section">
                <h3>Down</h3>
                ${crosswordData.downClues.map(clue => 
                  `<div class="clue">${clue.number}. ${clue.clue}</div>`
                ).join('')}
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [crosswordData, title, showAnswers]);

  const handleAIGenerate = useCallback(async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a topic for AI generation.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/ai/generate-crossword-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!response.ok) {
        throw new Error('AI generation failed');
      }

      const result = await response.json();
      if (result.words && Array.isArray(result.words)) {
        setInputWords(
          result.words.map((item: any, index: number) => ({
            id: (Date.now() + index).toString(),
            word: item.word.toUpperCase().replace(/[^A-Z]/g, ''),
            clue: item.clue,
          }))
        );
        setCrosswordData(null);
        toast({
          title: "AI Words Generated",
          description: `Generated ${result.words.length} words. You can edit them before generating the crossword.`,
        });
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast({
        title: "AI Generation Failed",
        description: "Could not generate words using AI. Please try again or enter words manually.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  }, [aiPrompt, toast]);

  const handleLoadSample = useCallback(() => {
    const sampleWords = [
      { word: 'SPANISH', clue: 'Language spoken in Spain and Latin America' },
      { word: 'FRENCH', clue: 'Language of France' },
      { word: 'GERMAN', clue: 'Language of Germany' },
      { word: 'HELLO', clue: 'Common greeting' },
      { word: 'GOODBYE', clue: 'Farewell expression' },
      { word: 'PLEASE', clue: 'Polite request word' },
      { word: 'THANK', clue: 'Express gratitude' },
      { word: 'WATER', clue: 'H2O' },
      { word: 'HOUSE', clue: 'Place where people live' },
      { word: 'SCHOOL', clue: 'Place of learning' },
    ];
    
    setInputWords(
      sampleWords.map((item, index) => ({
        id: (Date.now() + index).toString(),
        word: item.word,
        clue: item.clue,
      }))
    );
    setCrosswordData(null);
    toast({
      title: "Sample Words Loaded",
      description: "Sample crossword words loaded. You can edit them as needed.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
              <Puzzle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Crossword Generator
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Create engaging educational crossword puzzles for language learning with AI assistance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-4 space-y-6">
              {/* AI Generation Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                  <h3 className="font-semibold text-white flex items-center">
                    <Wand2 className="h-5 w-5 mr-2" />
                    AI Word Generation
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">Generate vocabulary with AI</p>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label htmlFor="ai-prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Topic/Theme
                    </label>
                    <Textarea
                      id="ai-prompt"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g., Spanish food vocabulary, French travel terms, German animals"
                      rows={3}
                      className="text-sm border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleAIGenerate}
                      disabled={isGeneratingAI}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md h-10"
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
                      onClick={handleLoadSample}
                      variant="outline"
                      size="sm"
                      className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 h-10 text-slate-700 dark:text-slate-300"
                    >
                      <span className="text-sm font-medium">Load Sample</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Title Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
                <label htmlFor="crossword-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Crossword Title
                </label>
                <Input
                  id="crossword-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter crossword title"
                  className="border-slate-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Words & Clues Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">
                      Words & Clues
                    </h3>
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                      {inputWords.filter(w => w.word.trim() && w.clue.trim()).length} words
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Add your vocabulary words</span>
                    <Button
                      variant="outline"
                      size="default"
                      onClick={addWord}
                      className="h-10 px-4 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="font-medium">Add Word</span>
                    </Button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {inputWords.map((item, index) => (
                      <div key={item.id} className="group relative bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-grow space-y-3">
                            <Input
                              placeholder="WORD"
                              value={item.word}
                              onChange={(e) => updateWord(item.id, 'word', e.target.value)}
                              className="h-10 text-sm font-mono font-bold border-slate-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                            />
                            <Textarea
                              placeholder="Clue for this word"
                              value={item.clue}
                              onChange={(e) => updateWord(item.id, 'clue', e.target.value)}
                              rows={2}
                              className="text-sm resize-none border-slate-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWord(item.id)}
                            className="flex-shrink-0 h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                className="w-full h-14 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
                onClick={handleGenerate}
                disabled={isGenerating || inputWords.filter(w => w.word.trim() && w.clue.trim()).length < 3}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                    Generating Crossword...
                  </>
                ) : (
                  <>
                    <Puzzle className="h-5 w-5 mr-3" />
                    Generate Crossword
                  </>
                )}
              </Button>
            </div>

            {/* Crossword Display Panel */}
            <div className="lg:col-span-8">
              {crosswordData ? (
                <div className="space-y-6">
                  {/* Controls Header */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                          {crosswordData.stats.placedWords} words • {crosswordData.stats.intersections} intersections
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          variant={showAnswers ? "default" : "outline"}
                          size="default"
                          onClick={() => setShowAnswers(!showAnswers)}
                          className={`h-11 px-4 ${showAnswers ?
                            "bg-green-500 hover:bg-green-600 text-white border-green-500" :
                            "border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {showAnswers ? (
                            <>
                              <span className="mr-2">👁️</span>
                              <span className="font-medium">Hide Answers</span>
                            </>
                          ) : (
                            <>
                              <span className="mr-2">👁️‍🗨️</span>
                              <span className="font-medium">Show Answers</span>
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="default"
                          onClick={handleDownload}
                          className="h-11 px-4 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          <span className="font-medium">Download</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="default"
                          onClick={handlePrint}
                          className="h-11 px-4 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          <Printer className="h-4 w-4 mr-2" />
                          <span className="font-medium">Print</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Crossword Grid and Clues */}
                  <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    <div className="xl:col-span-3">
                      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
                        <CrosswordGrid
                          data={crosswordData}
                          showAnswers={showAnswers}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="xl:col-span-2">
                      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
                        <CrosswordClues data={crosswordData} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-12">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-2xl mb-6">
                      <Puzzle className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Ready to Create Your Crossword?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                      Add at least 3 words with their clues, then click "Generate Crossword" to create your educational puzzle.
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        AI-powered word generation
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Interactive grid
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        Print-ready design
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
