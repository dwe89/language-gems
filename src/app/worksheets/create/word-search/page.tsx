'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Download,
  Eye,
  ArrowLeft,
  Loader2,
  Settings,
  FileText,
  CheckSquare,
  Sparkles,
  Palette,
  ListChecks,
  ChevronDown,
  ChevronRight,
  Target,
  FileEdit,
  Globe,
  BarChart3,
  GraduationCap,
  Award,
  Trophy,
  Edit3,
  ClipboardList,
  Search,
  Grid3x3,
  Plus,
  Trash2,
  Wand2,
  Shuffle
} from 'lucide-react';

import { LoadingModal } from '@/components/ui/loading-modal';
import { useRouter } from 'next/navigation';

// Import category system
import { VOCABULARY_CATEGORIES, CURRICULUM_LEVELS_CONFIG } from '@/components/games/ModernCategorySelector';
import { getCategoriesByCurriculum } from '@/components/games/KS4CategorySystem';
import type { Category, Subcategory } from '@/components/games/ModernCategorySelector';

// Corrected shadcn/ui component imports using the '@/' alias
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Types for vocabulary configuration
interface VocabularyConfig {
  language: string;
  curriculumLevel: 'KS2' | 'KS3' | 'KS4' | 'KS5';
  categoryId: string;
  subcategoryId?: string;
  // KS4-specific fields
  examBoard?: 'AQA' | 'edexcel';
  tier?: 'foundation' | 'higher';
}

interface WordSearchSettings {
  gridSize: number;
  directions: {
    horizontal: boolean;
    vertical: boolean;
    diagonal: boolean;
    backwards: boolean;
  };
  showWordList: boolean;
  theme: string;
}

export default function WordSearchPage() {
  const router = useRouter();
  
  const [title, setTitle] = useState('Word Search Puzzle');
  const [subject, setSubject] = useState('spanish');
  const [level, setLevel] = useState('intermediate');
  const [instructions, setInstructions] = useState('Find all the hidden words in the puzzle below.');

  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const generationSteps = [
    "Selecting vocabulary words...",
    "Creating puzzle grid...", 
    "Placing words in grid...",
    "Adding random letters...",
    "Finalizing puzzle..."
  ];

  // Vocabulary selection
  const [vocabularyConfig, setVocabularyConfig] = useState<VocabularyConfig>({
    language: 'es',
    curriculumLevel: 'KS3',
    categoryId: '',
    subcategoryId: undefined,
  });

  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);

  const [useCustomWords, setUseCustomWords] = useState(false);
  const [words, setWords] = useState<string[]>([
    'CASA', 'PERRO', 'GATO', 'AGUA', 'COMIDA', 'FAMILIA', 'ESCUELA', 'LIBRO'
  ]);

  const [newWord, setNewWord] = useState('');

  const [settings, setSettings] = useState<WordSearchSettings>({
    gridSize: 15,
    directions: {
      horizontal: true,
      vertical: true,
      diagonal: true,
      backwards: false
    },
    showWordList: true,
    theme: 'standard'
  });

  // Load categories based on curriculum level and exam board
  useEffect(() => {
    console.log('Loading categories for:', vocabularyConfig.curriculumLevel, vocabularyConfig.examBoard);
    
    if (vocabularyConfig.curriculumLevel === 'KS3') {
      console.log('Setting KS3 categories:', VOCABULARY_CATEGORIES);
      setAvailableCategories(VOCABULARY_CATEGORIES);
    } else if (vocabularyConfig.curriculumLevel === 'KS4') {
      const ks4Categories = getCategoriesByCurriculum('KS4', vocabularyConfig.examBoard || 'AQA');
      console.log('Setting KS4 categories:', ks4Categories);
      setAvailableCategories(ks4Categories);
    } else {
      // Default to KS3 categories if no level specified
      console.log('Setting default categories:', VOCABULARY_CATEGORIES);
      setAvailableCategories(VOCABULARY_CATEGORIES);
    }
  }, [vocabularyConfig.curriculumLevel, vocabularyConfig.examBoard]);

  // Load subcategories when category changes
  useEffect(() => {
    if (vocabularyConfig.categoryId) {
      const selectedCategory = availableCategories.find(cat => cat.id === vocabularyConfig.categoryId);
      if (selectedCategory) {
        setAvailableSubcategories(selectedCategory.subcategories || []);
      }
    } else {
      setAvailableSubcategories([]);
    }
  }, [vocabularyConfig.categoryId, availableCategories]);

  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    const languageMap: { [key: string]: string } = {
      spanish: 'es',
      french: 'fr',
      german: 'de',
      english: 'en',
    };
    setVocabularyConfig((prev: VocabularyConfig) => ({
      ...prev,
      language: languageMap[newSubject] || 'es',
      categoryId: '',
      subcategoryId: undefined,
    }));
  };

  const addWord = () => {
    if (newWord.trim() && !words.includes(newWord.toUpperCase())) {
      setWords([...words, newWord.toUpperCase().trim()]);
      setNewWord('');
    }
  };

  const removeWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addWord();
    }
  };

  const generateWithAI = async () => {
    // Validate that we have a selected category
    if (!vocabularyConfig.categoryId) {
      alert('Please select a vocabulary category before generating words with AI.');
      return;
    }

    setIsGenerating(true);
    setGenerationStep(0);

    try {
      setGenerationStep(0);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate words using AI
      const response = await fetch('/api/ai/generate-word-search-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: vocabularyConfig.categoryId,
          subcategory: vocabularyConfig.subcategoryId,
          language: vocabularyConfig.language,
          curriculumLevel: vocabularyConfig.curriculumLevel,
          wordCount: 12
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('AI generated words:', result);

      setGenerationStep(1);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update words and enable custom mode
      setWords(result.words);
      setUseCustomWords(true);

      setGenerationStep(2);
      await new Promise(resolve => setTimeout(resolve, 500));

      alert(`Successfully generated ${result.words.length} words! You can now generate the puzzle or edit the words.`);
    } catch (error) {
      console.error('AI generation failed:', error);
      alert('Failed to generate words with AI. Please try again or add words manually.');
    } finally {
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  const generatePuzzle = async () => {
    // Validate that we have either custom words or a selected category
    if (!useCustomWords && !vocabularyConfig.categoryId) {
      alert('Please select a vocabulary category or enable custom words before generating.');
      return;
    }

    if (useCustomWords && words.length === 0) {
      alert('Please add some words before generating the puzzle.');
      return;
    }

    setIsGenerating(true);
    setGenerationStep(0);

    try {
      let wordsToUse = words;

      // If not using custom words, fetch vocabulary words
      if (!useCustomWords && vocabularyConfig.categoryId) {
        setGenerationStep(0);
        await new Promise(resolve => setTimeout(resolve, 500));

        const vocabResponse = await fetch(`/api/vocabulary/words?${new URLSearchParams({
          language: vocabularyConfig.language,
          category: vocabularyConfig.categoryId,
          ...(vocabularyConfig.subcategoryId && { subcategory: vocabularyConfig.subcategoryId }),
          curriculumLevel: vocabularyConfig.curriculumLevel,
          ...(vocabularyConfig.examBoard && { examBoard: vocabularyConfig.examBoard }),
          ...(vocabularyConfig.tier && { tier: vocabularyConfig.tier }),
          limit: '15'
        })}`);

        if (!vocabResponse.ok) {
          throw new Error('Failed to fetch vocabulary words');
        }

        const vocabResult = await vocabResponse.json();
        wordsToUse = vocabResult.words.map((w: any) => w.word);
        console.log('Fetched vocabulary words:', wordsToUse);
      }

      setGenerationStep(1);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate the actual word search puzzle
      const puzzleResponse = await fetch('/api/word-search/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subject,
          language: vocabularyConfig.language,
          words: wordsToUse,
          settings,
          vocabularyConfig,
          instructions
        }),
      });

      if (!puzzleResponse.ok) {
        throw new Error(`Failed to generate puzzle: ${puzzleResponse.statusText}`);
      }

      const puzzleResult = await puzzleResponse.json();
      console.log('Generated puzzle:', puzzleResult);

      setGenerationStep(2);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Store puzzle data in sessionStorage for the result page
      sessionStorage.setItem('wordSearchPuzzle', JSON.stringify(puzzleResult.puzzle));

      setGenerationStep(3);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirect to result page
      router.push('/worksheets/create/word-search/result');
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate puzzle. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };



  const updateDirection = (direction: keyof typeof settings.directions, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      directions: { ...prev.directions, [direction]: checked }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <LoadingModal 
        isOpen={isGenerating}
        title="Generating Your Word Search"
        description="Please wait while we create your puzzle..."
        steps={generationSteps}
        currentStep={generationStep}
      />
        {/* Hero Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-12">
          <Link href="/worksheets/create" passHref>
            <Button variant="outline" size="icon" aria-label="Back to Create" className="hover:bg-white hover:shadow-md transition-all duration-200">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Word Search Generator
            </h1>
            <p className="text-slate-600 text-lg flex items-center gap-2">
              Create word search puzzles for vocabulary practice
              <Sparkles className="h-5 w-5 text-red-500" />
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Basic Settings</CardTitle>
              <CardDescription>Configure the basic details for your word search puzzle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title" className="text-slate-700 font-semibold flex items-center gap-2">
                    <FileEdit className="h-4 w-4 text-slate-500" />
                    Puzzle Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter puzzle title"
                    className="mt-2 bg-white border-slate-300 hover:border-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-slate-700 font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-500" />
                    Subject
                  </Label>
                  <Select value={subject} onValueChange={handleSubjectChange}>
                    <SelectTrigger className="mt-2 bg-white border-slate-300 hover:border-slate-400 focus:border-purple-500 focus:ring-purple-500/20">
                      <SelectValue placeholder="Select a subject..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 shadow-lg">
                      <SelectItem value="spanish" className="hover:bg-purple-50">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🇪🇸</span>
                          Spanish
                        </div>
                      </SelectItem>
                      <SelectItem value="french" className="hover:bg-purple-50">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🇫🇷</span>
                          French
                        </div>
                      </SelectItem>
                      <SelectItem value="german" className="hover:bg-purple-50">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🇩🇪</span>
                          German
                        </div>
                      </SelectItem>
                      <SelectItem value="english" className="hover:bg-purple-50">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🇬🇧</span>
                          English
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="gridSize" className="text-slate-700 font-semibold flex items-center gap-2">
                    <Grid3x3 className="h-4 w-4 text-slate-500" />
                    Grid Size
                  </Label>
                  <Select
                    value={settings.gridSize.toString()}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, gridSize: parseInt(value) }))}
                  >
                    <SelectTrigger className="mt-2 bg-white border-slate-300 hover:border-slate-400 focus:border-purple-500 focus:ring-purple-500/20">
                      <SelectValue placeholder="Select grid size..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 shadow-lg">
                      <SelectItem value="10" className="hover:bg-purple-50">
                        <div className="flex items-center justify-between w-full">
                          <span>10×10</span>
                          <Badge variant="outline" className="ml-2 text-xs">Small</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="15" className="hover:bg-purple-50">
                        <div className="flex items-center justify-between w-full">
                          <span>15×15</span>
                          <Badge variant="outline" className="ml-2 text-xs">Medium</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="20" className="hover:bg-purple-50">
                        <div className="flex items-center justify-between w-full">
                          <span>20×20</span>
                          <Badge variant="outline" className="ml-2 text-xs">Large</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="25" className="hover:bg-purple-50">
                        <div className="flex items-center justify-between w-full">
                          <span>25×25</span>
                          <Badge variant="outline" className="ml-2 text-xs">Extra Large</Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="instructions" className="text-slate-700 font-semibold flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-slate-500" />
                    Instructions
                  </Label>
                  <Textarea
                    id="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Enter instructions for students"
                    rows={3}
                    className="mt-2 bg-white border-slate-300 hover:border-slate-400 focus:border-purple-500 focus:ring-purple-500/20 resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vocabulary Selection */}
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
                  <Label htmlFor="curriculumLevel" className="text-slate-700 font-semibold flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-slate-500" />
                    Curriculum Level
                  </Label>
                  <Select
                    value={vocabularyConfig.curriculumLevel}
                    onValueChange={(value) => setVocabularyConfig(prev => ({
                      ...prev,
                      curriculumLevel: value as 'KS2' | 'KS3' | 'KS4' | 'KS5',
                      categoryId: '',
                      subcategoryId: undefined,
                    }))}
                  >
                    <SelectTrigger className="mt-2 bg-white border-slate-300 hover:border-slate-400 focus:border-purple-500 focus:ring-purple-500/20">
                      <SelectValue placeholder="Select curriculum level..." />
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
                      <SelectItem value="KS5" className="hover:bg-purple-50">
                        <div className="flex items-center justify-between w-full">
                          <span>KS5</span>
                          <Badge variant="outline" className="ml-2 text-xs">A-Level</Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {vocabularyConfig.curriculumLevel === 'KS4' && (
                  <>
                    <div>
                      <Label htmlFor="examBoard" className="text-slate-700 font-semibold flex items-center gap-2">
                        <Award className="h-4 w-4 text-slate-500" />
                        Exam Board
                      </Label>
                      <Select
                        value={vocabularyConfig.examBoard || ''}
                        onValueChange={(value) => setVocabularyConfig(prev => ({
                          ...prev,
                          examBoard: value as 'AQA' | 'edexcel',
                          categoryId: '',
                          subcategoryId: undefined,
                        }))}
                      >
                        <SelectTrigger className="mt-2 bg-white border-slate-300 hover:border-slate-400 focus:border-purple-500 focus:ring-purple-500/20">
                          <SelectValue placeholder="Select exam board..." />
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

                    <div>
                      <Label htmlFor="tier" className="text-slate-700 font-semibold flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-slate-500" />
                        Tier
                      </Label>
                      <Select
                        value={vocabularyConfig.tier || ''}
                        onValueChange={(value) => setVocabularyConfig(prev => ({
                          ...prev,
                          tier: value as 'foundation' | 'higher',
                        }))}
                      >
                        <SelectTrigger className="mt-2 bg-white border-slate-300 hover:border-slate-400 focus:border-purple-500 focus:ring-purple-500/20">
                          <SelectValue placeholder="Select tier..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 shadow-lg">
                          <SelectItem value="foundation" className="hover:bg-purple-50">
                            <div className="flex items-center gap-2">
                              <Trophy className="h-4 w-4 text-bronze-500" />
                              Foundation
                            </div>
                          </SelectItem>
                          <SelectItem value="higher" className="hover:bg-purple-50">
                            <div className="flex items-center gap-2">
                              <Trophy className="h-4 w-4 text-gold-500" />
                              Higher
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>

              {/* Category Selection */}
              <div>
                <Label className="text-slate-700 font-semibold mb-4 block">
                  Choose Vocabulary Category
                </Label>
                
                {availableCategories.length === 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-amber-700 mb-2">
                      <Target className="h-4 w-4" />
                      <span className="font-medium">Select Curriculum Level</span>
                    </div>
                    <p className="text-sm text-amber-600">
                      Please select a curriculum level above to see available vocabulary categories.
                    </p>
                  </div>
                )}

                {availableCategories.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {availableCategories.map((category) => {
                      const IconComponent = category.icon;
                      const isSelected = vocabularyConfig.categoryId === category.id;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() =>
                            setVocabularyConfig(prev => ({
                              ...prev,
                              categoryId: category.id,
                              subcategoryId: undefined,
                            }))
                          }
                          className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                            isSelected
                              ? `bg-gradient-to-r ${category.color} text-white border-transparent shadow-lg scale-105`
                              : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-md hover:scale-102'
                          }`}
                        >
                          <IconComponent className="h-6 w-6" />
                          <span className="text-center leading-tight">{category.displayName}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {vocabularyConfig.categoryId && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <CheckSquare className="h-4 w-4" />
                      <span className="font-medium">Category Selected</span>
                    </div>
                    <p className="text-sm text-green-600">
                      Words will be generated from: <strong>{availableCategories.find(cat => cat.id === vocabularyConfig.categoryId)?.displayName}</strong>
                    </p>
                  </div>
                )}

                {availableSubcategories.length > 0 && (
                  <div className="mt-6">
                    <Label className="text-slate-700 font-semibold mb-3 block">
                      Subcategory (Optional)
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {availableSubcategories.map((subcategory) => {
                        const isSelected = vocabularyConfig.subcategoryId === subcategory.id;
                        return (
                          <button
                            key={subcategory.id}
                            type="button"
                            onClick={() =>
                              setVocabularyConfig(prev => ({
                                ...prev,
                                subcategoryId: isSelected ? undefined : subcategory.id,
                              }))
                            }
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                              isSelected
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-transparent shadow-lg'
                                : 'bg-white border-slate-200 hover:border-green-300 hover:shadow-md'
                            }`}
                          >
                            <span className="text-center">{subcategory.displayName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Custom Words Option */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Word Options</CardTitle>
                  <CardDescription>
                    Choose between vocabulary categories or add custom words
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useCustomWords"
                    checked={useCustomWords}
                    onCheckedChange={(checked) => setUseCustomWords(checked === true)}
                  />
                  <Label htmlFor="useCustomWords" className="text-sm font-medium">
                    Use Custom Words
                  </Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {useCustomWords && (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value.toUpperCase())}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter a word"
                      className="flex-1 bg-white border-slate-300 hover:border-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                    />
                    <Button onClick={addWord} disabled={!newWord.trim()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  {words.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {words.map((word, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                          <span className="font-mono text-sm">{word}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWord(index)}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {words.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Grid3x3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No words added yet. Enter words above to build your puzzle.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Puzzle Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Puzzle Configuration</CardTitle>
              <CardDescription>Configure how words are placed in the puzzle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-semibold mb-3 block">Word Directions</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="horizontal"
                        checked={settings.directions.horizontal}
                        onCheckedChange={(checked) => updateDirection('horizontal', checked as boolean)}
                      />
                      <Label htmlFor="horizontal">Horizontal →</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="vertical"
                        checked={settings.directions.vertical}
                        onCheckedChange={(checked) => updateDirection('vertical', checked as boolean)}
                      />
                      <Label htmlFor="vertical">Vertical ↓</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="diagonal"
                        checked={settings.directions.diagonal}
                        onCheckedChange={(checked) => updateDirection('diagonal', checked as boolean)}
                      />
                      <Label htmlFor="diagonal">Diagonal ↘</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="backwards"
                        checked={settings.directions.backwards}
                        onCheckedChange={(checked) => updateDirection('backwards', checked as boolean)}
                      />
                      <Label htmlFor="backwards">Backwards ←</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block">Puzzle Stats</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Words</span>
                      <Badge variant="secondary">{words.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Grid Size</span>
                      <Badge variant="secondary">{settings.gridSize}×{settings.gridSize}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Directions</span>
                      <Badge variant="secondary">{Object.values(settings.directions).filter(Boolean).length}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Est. Time</span>
                      <Badge variant="secondary">{Math.max(5, words.length * 2)} min</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generation Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generate Puzzle</CardTitle>
              <CardDescription>Ready to create your word search? Click below to generate!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={generateWithAI} 
                  variant="outline" 
                  className="flex-1"
                  disabled={isGenerating}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Words with AI
                </Button>
                <Button 
                  onClick={generatePuzzle} 
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500"
                  disabled={isGenerating || (!useCustomWords && !vocabularyConfig.categoryId) || (useCustomWords && words.length === 0)}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Shuffle className="h-4 w-4 mr-2" />
                      Generate Word Search
                    </>
                  )}
                </Button>
              </div>
              
              {!useCustomWords && !vocabularyConfig.categoryId && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-amber-700 mb-2">
                    <Target className="h-4 w-4" />
                    <span className="font-medium">Ready to Generate?</span>
                  </div>
                  <p className="text-sm text-amber-600">
                    Please select a vocabulary category above or enable "Use Custom Words" to add your own words before generating.
                  </p>
                </div>
              )}

              {words.length > 0 && useCustomWords && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Tips for Better Puzzles:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use 8-15 words for optimal difficulty</li>
                    <li>• Mix short (3-5 letters) and long (6-10 letters) words</li>
                    <li>• Choose words with common letters for better placement</li>
                    <li>• Avoid very similar words that might confuse students</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
