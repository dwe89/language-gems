'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Plus, Trash2, Puzzle, RefreshCw, Wand2, BookOpen, GraduationCap, Award } from 'lucide-react';
import { useToast } from '../../../components/ui/use-toast';
import { generateCrosswordLayout } from './utils/crosswordGenerator';
import { CrosswordData, WordEntry } from './types/crossword';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

// Import category system
import { VOCABULARY_CATEGORIES, CURRICULUM_LEVELS_CONFIG } from '@/components/games/ModernCategorySelector';
import { getCategoriesByCurriculum } from '@/components/games/KS4CategorySystem';
import type { Category, Subcategory } from '@/components/games/ModernCategorySelector';

interface VocabularyConfig {
  language: string;
  curriculumLevel: 'KS2' | 'KS3' | 'KS4' | 'KS5';
  categoryId: string;
  subcategoryId?: string;
  examBoard?: 'AQA' | 'edexcel';
  tier?: 'foundation' | 'higher';
}

export default function CrosswordPage() {
  const router = useRouter();
  const [title, setTitle] = useState('LanguageGems Crossword');
  const [vocabularyConfig, setVocabularyConfig] = useState<VocabularyConfig>({
    language: 'es',
    curriculumLevel: 'KS3',
    categoryId: '',
    subcategoryId: undefined,
  });
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);
  
  const [inputWords, setInputWords] = useState<WordEntry[]>([
    { id: '1', word: 'HOLA', clue: 'Spanish greeting meaning "hello"' },
    { id: '2', word: 'CASA', clue: 'Spanish word for "house"' },
    { id: '3', word: 'AGUA', clue: 'Spanish word for "water"' },
    { id: '4', word: 'GATO', clue: 'Spanish word for "cat"' },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('Spanish basic vocabulary');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const { toast} = useToast();

  // Load categories based on curriculum level and exam board
  useEffect(() => {
    if (vocabularyConfig.curriculumLevel === 'KS3') {
      setAvailableCategories(VOCABULARY_CATEGORIES);
    } else if (vocabularyConfig.curriculumLevel === 'KS4') {
      const ks4Categories = getCategoriesByCurriculum('KS4', vocabularyConfig.examBoard || 'AQA');
      setAvailableCategories(ks4Categories);
    } else {
      setAvailableCategories(VOCABULARY_CATEGORIES);
    }
  }, [vocabularyConfig.curriculumLevel, vocabularyConfig.examBoard]);

  // Load subcategories when category changes
  useEffect(() => {
    if (vocabularyConfig.categoryId) {
      const selectedCategory = availableCategories.find(cat => cat.id === vocabularyConfig.categoryId);
      if (selectedCategory?.subcategories) {
        setAvailableSubcategories(selectedCategory.subcategories);
      } else {
        setAvailableSubcategories([]);
      }
    }
  }, [vocabularyConfig.categoryId, availableCategories]);

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
  }, []);

  const removeWord = useCallback((id: string) => {
    setInputWords(prev => prev.filter(item => item.id !== id));
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
        // Store in sessionStorage and redirect to result page
        sessionStorage.setItem('crosswordPuzzle', JSON.stringify(data));
        sessionStorage.setItem('crosswordTitle', title);
        
        toast({
          title: "Crossword Generated",
          description: `Successfully created crossword with ${data.placedWords.length} words.`,
        });
        
        // Redirect to result page
        router.push('/tools/crossword/result');
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
  }, [inputWords, title, toast, router]);

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
    toast({
      title: "Sample Words Loaded",
      description: "Sample crossword words loaded. You can edit them as needed.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-12">
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

                <div className="space-y-8">
          {/* Basic Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Crossword Title</CardTitle>
              <CardDescription>Set the title for your crossword puzzle</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                id="crossword-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter crossword title"
                className="bg-white border-slate-300 hover:border-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </CardContent>
          </Card>

          {/* AI Generation Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Wand2 className="h-6 w-6" />
                AI Word Generation
              </CardTitle>
              <CardDescription className="text-blue-100">
                Generate vocabulary with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div>
                <Label htmlFor="ai-prompt" className="text-slate-700 font-semibold mb-2 block">
                  Topic/Theme
                </Label>
                <Textarea
                  id="ai-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., Spanish food vocabulary, French travel terms, German animals"
                  rows={3}
                  className="bg-white border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  onClick={handleAIGenerate}
                  disabled={isGeneratingAI}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md h-11"
                >
                  {isGeneratingAI ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      <span className="font-medium">Generating...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      <span className="font-medium">Generate with AI</span>
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleLoadSample}
                  variant="outline"
                  className="border-slate-300 hover:bg-slate-50 h-11 text-slate-700"
                >
                  <span className="font-medium">Load Sample Words</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Vocabulary Categories Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <BookOpen className="h-6 w-6" />
                Vocabulary Selection
              </CardTitle>
              <CardDescription className="text-purple-100">
                Choose vocabulary categories for word generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="curriculumLevel" className="text-slate-700 font-semibold flex items-center gap-2 mb-2">
                    <GraduationCap className="h-4 w-4 text-slate-500" />
                    Curriculum Level
                  </Label>
                  <Select
                    value={vocabularyConfig.curriculumLevel}
                    onValueChange={(value: any) => setVocabularyConfig({ ...vocabularyConfig, curriculumLevel: value, categoryId: '', subcategoryId: undefined })}
                  >
                    <SelectTrigger className="bg-white border-slate-300 hover:border-slate-400 focus:border-purple-500 focus:ring-purple-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 shadow-lg">
                      <SelectItem value="KS3" className="hover:bg-purple-50">
                        <div className="flex items-center justify-between w-full">
                          <span>KS3</span>
                          <Badge variant="outline" className="ml-2 text-xs">Ages 11-14</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="KS4" className="hover:bg-purple-50">
                        <div className="flex items-center justify-between w-full">
                          <span>KS4</span>
                          <Badge variant="outline" className="ml-2 text-xs">GCSE</Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {vocabularyConfig.curriculumLevel === 'KS4' && (
                  <div>
                    <Label htmlFor="examBoard" className="text-slate-700 font-semibold flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-slate-500" />
                      Exam Board
                    </Label>
                    <Select
                      value={vocabularyConfig.examBoard || 'AQA'}
                      onValueChange={(value: any) => setVocabularyConfig({ ...vocabularyConfig, examBoard: value, categoryId: '', subcategoryId: undefined })}
                    >
                      <SelectTrigger className="bg-white border-slate-300 hover:border-slate-400 focus:border-purple-500 focus:ring-purple-500/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 shadow-lg">
                        <SelectItem value="AQA" className="hover:bg-purple-50">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-blue-500" />
                            AQA
                          </div>
                        </SelectItem>
                        <SelectItem value="edexcel" className="hover:bg-purple-50">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-green-500" />
                            Edexcel
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-slate-700 font-semibold mb-3 block">Category</Label>
                <Select
                  value={vocabularyConfig.categoryId}
                  onValueChange={(value) => setVocabularyConfig({ ...vocabularyConfig, categoryId: value, subcategoryId: undefined })}
                >
                  <SelectTrigger className="bg-white border-slate-300 hover:border-slate-400 focus:border-purple-500 focus:ring-purple-500/20">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 shadow-lg">
                    {availableCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} className="hover:bg-purple-50">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {availableSubcategories.length > 0 && (
                <div>
                  <Label className="text-slate-700 font-semibold mb-3 block">Subcategory (Optional)</Label>
                  <Select
                    value={vocabularyConfig.subcategoryId || ''}
                    onValueChange={(value) => setVocabularyConfig({ ...vocabularyConfig, subcategoryId: value || undefined })}
                  >
                    <SelectTrigger className="bg-white border-slate-300 hover:border-slate-400 focus:border-purple-500 focus:ring-purple-500/20">
                      <SelectValue placeholder="Select a subcategory (optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 shadow-lg">
                      <SelectItem value="" className="hover:bg-purple-50">All</SelectItem>
                      {availableSubcategories.map((subcat) => (
                        <SelectItem key={subcat.id} value={subcat.id} className="hover:bg-purple-50">
                          {subcat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {vocabularyConfig.categoryId && (
                <Button
                  onClick={async () => {
                    // TODO: Implement loading vocabulary from categories
                    toast({
                      title: "Feature Coming Soon",
                      description: "Loading vocabulary from categories will be available soon!",
                    });
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-11"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Load Words from Category
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Words & Clues Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Words & Clues</CardTitle>
                  <CardDescription>
                    Add words and their clues for the crossword
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {inputWords.filter(w => w.word.trim() && w.clue.trim()).length} words
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Add your vocabulary words and clues</span>
                <Button
                  variant="outline"
                  size="default"
                  onClick={addWord}
                  className="border-slate-300 hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="font-medium">Add Word</span>
                </Button>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {inputWords.map((item, index) => (
                  <div key={item.id} className="group relative bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-xl border-2 border-slate-200 hover:border-purple-300 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-grow space-y-3">
                        <Input
                          placeholder="WORD"
                          value={item.word}
                          onChange={(e) => updateWord(item.id, 'word', e.target.value)}
                          className="h-10 text-sm font-mono font-bold border-slate-300 focus:border-purple-500 focus:ring-purple-500/20 bg-white"
                        />
                        <Textarea
                          placeholder="Clue for this word"
                          value={item.clue}
                          onChange={(e) => updateWord(item.id, 'clue', e.target.value)}
                          rows={2}
                          className="text-sm resize-none border-slate-300 focus:border-purple-500 focus:ring-purple-500/20 bg-white"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWord(item.id)}
                        className="flex-shrink-0 h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
      </div>
    </div>
  );
}