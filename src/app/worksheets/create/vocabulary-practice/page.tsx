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
} from 'lucide-react';

// Import category system
import { VOCABULARY_CATEGORIES, CURRICULUM_LEVELS_CONFIG } from '@/components/games/ModernCategorySelector';
import { getCategoriesByCurriculum } from '@/components/games/KS4CategorySystem';
import type { Category, Subcategory } from '@/components/games/ModernCategorySelector';

// Corrected shadcn/ui component imports using the '@/' alias
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  customMode?: boolean;
  // KS4-specific fields
  examBoard?: 'AQA' | 'edexcel';
  tier?: 'foundation' | 'higher';
}

export default function VocabularyPracticePage() {
  const [title, setTitle] = useState('Vocabulary Practice Worksheet');
  const [subject, setSubject] = useState('spanish');
  const [instructions, setInstructions] = useState(
    'Complete the vocabulary exercises below.',
  );
  const [customPrompt, setCustomPrompt] = useState('');

  // Exercise types
  const [exerciseTypes, setExerciseTypes] = useState({
    matching: true,
    fillBlanks: true,
    definitions: false,
    translations: true,
    wordBank: true,
    wordsearch: false,
    crossword: false,
  });

  // Vocabulary selection
  const [vocabularyConfig, setVocabularyConfig] = useState<VocabularyConfig>({
    language: 'es',
    curriculumLevel: 'KS3',
    categoryId: '',
    subcategoryId: undefined,
  });

  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);

  const [useCustomVocabulary, setUseCustomVocabulary] = useState(false);
  const [customVocabulary, setCustomVocabulary] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState<any>(null);
  const [worksheetId, setWorksheetId] = useState<string | null>(null);

  // Load categories based on curriculum level and exam board
  useEffect(() => {
    if (vocabularyConfig.curriculumLevel === 'KS3') {
      setAvailableCategories(VOCABULARY_CATEGORIES);
    } else if (vocabularyConfig.curriculumLevel === 'KS4') {
      const ks4Categories = getCategoriesByCurriculum('KS4', vocabularyConfig.examBoard || 'AQA');
      setAvailableCategories(ks4Categories);
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

  const updateExerciseType = (
    type: keyof typeof exerciseTypes,
    checked: boolean,
  ) => {
    setExerciseTypes((prev) => ({ ...prev, [type]: checked }));
  };

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

  const generateWorksheet = async () => {
    if (!vocabularyConfig.categoryId && !useCustomVocabulary) {
      alert('Please select a vocabulary category or provide custom vocabulary');
      return;
    }

    setIsGenerating(true);
    setGeneratedWorksheet(null);
    setWorksheetId(null);
    
    const requestBody = {
      template: 'vocabulary_practice',
      subject: subject,
      topic: vocabularyConfig.categoryId || 'Custom Vocabulary',
      targetQuestionCount: 15,
      questionTypes: Object.entries(exerciseTypes)
        .filter(([_, enabled]) => enabled)
        .map(([type, _]) => type),
      customPrompt: customPrompt || instructions,
      customVocabulary: useCustomVocabulary ? customVocabulary : '',
      curriculumLevel: vocabularyConfig.curriculumLevel,
      examBoard: vocabularyConfig.examBoard,
      tier: vocabularyConfig.tier,
      category: vocabularyConfig.categoryId,
      subcategory: vocabularyConfig.subcategoryId,
    };

    console.log('Sending worksheet generation request:', requestBody);

    try {
      const response = await fetch('/api/worksheets/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Generation response:', result);

      if (result.jobId) {
        console.log('Job started successfully with ID:', result.jobId);
        pollForCompletion(result.jobId);
      } else {
        throw new Error('No job ID returned from server');
      }
    } catch (error) {
      console.error('Error generating worksheet:', error);
      alert('Failed to generate worksheet: ' + (error as Error).message);
      setIsGenerating(false);
    }
  };

  const pollForCompletion = async (jobId: string) => {
    console.log('Starting to poll for job:', jobId);
    const maxAttempts = 30;
    let attempts = 0;

    const poll = async () => {
      try {
        console.log(`Polling attempt ${attempts + 1}/${maxAttempts} for job:`, jobId);
        const response = await fetch(`/api/worksheets/progress/${jobId}`);
        
        if (!response.ok) {
          console.log(`Status check failed with status: ${response.status}`);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const status = await response.json();
        console.log('Job status response:', status);

        if (status.status === 'completed') {
          console.log('Worksheet generation completed successfully');

          if (status.result?.worksheet) {
            // We have the worksheet data directly
            setGeneratedWorksheet(status.result.worksheet);
            // Also extract the database worksheet ID if available
            if (status.result.worksheetId) {
              setWorksheetId(status.result.worksheetId);
            }
          } else if (status.assumedComplete) {
            // Job completed but we need to redirect to the worksheets page
            console.log('Job assumed complete, redirecting to worksheets page');
            alert('Worksheet generated successfully! Redirecting to your worksheets...');
            window.location.href = '/worksheets';
            return;
          } else {
            // Fallback: assume completion and redirect
            console.log('Job completed but no worksheet data, redirecting to worksheets page');
            alert('Worksheet generated successfully! Redirecting to your worksheets...');
            window.location.href = '/worksheets';
            return;
          }
          
          setIsGenerating(false);
          return;
        }

        if (status.status === 'failed') {
          console.error('Worksheet generation failed:', status);
          alert('Worksheet generation failed: ' + (status.error || 'Unknown error'));
          setIsGenerating(false);
          return;
        }

        // Job is still in progress
        console.log(`Job status: ${status.status}, progress: ${status.progress || 'unknown'}`);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          console.error('Polling timed out after', maxAttempts, 'attempts');
          alert('Worksheet generation may have completed. Please check your worksheets page.');
          window.location.href = '/worksheets';
        }
      } catch (error) {
        console.error('Error polling status:', error);
        attempts++;
        if (attempts < maxAttempts) {
          // Continue polling even on errors, in case it's a temporary issue
          setTimeout(poll, 2000);
        } else {
          alert('Worksheet generation may have completed. Please check your worksheets page.');
          window.location.href = '/worksheets';
        }
      }
    };

    poll();
  };

  const previewWorksheet = () => {
    // Use the database worksheet ID if available, otherwise fall back to the generated worksheet ID
    const idToUse = worksheetId || (generatedWorksheet?.id !== 'completed' ? generatedWorksheet?.id : null);

    if (idToUse) {
      window.open(`/worksheets/${idToUse}`, '_blank');
    } else {
      // Fallback: redirect to worksheets page
      window.location.href = '/worksheets';
    }
  };

  const downloadWorksheet = () => {
    // Use the database worksheet ID if available, otherwise fall back to the generated worksheet ID
    const idToUse = worksheetId || (generatedWorksheet?.id !== 'completed' ? generatedWorksheet?.id : null);

    if (idToUse) {
      window.open(`/api/worksheets/${idToUse}/download`, '_blank');
    } else {
      // Fallback: redirect to worksheets page where they can download
      window.location.href = '/worksheets';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-12">
          <Link href="/worksheets/create" passHref>
            <Button variant="outline" size="icon" aria-label="Back to Create" className="hover:bg-white hover:shadow-md transition-all duration-200">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vocabulary Practice Creator
            </h1>
            <p className="text-slate-600 text-lg flex items-center gap-2">
              Design comprehensive vocabulary exercises and activities
              <Sparkles className="h-5 w-5 text-purple-500" />
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-8">
            {/* Worksheet Settings */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-blue-100/50 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Palette className="h-6 w-6" />
                  </div>
                  Worksheet Details
                </CardTitle>
                <CardDescription className="text-blue-100 flex items-center gap-2">
                  Configure the basic properties for your worksheet
                  <Target className="h-4 w-4" />
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-slate-700 font-semibold">Worksheet Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Spanish Food Vocabulary"
                    className="border-2 border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="subject" className="text-slate-700 font-semibold">Subject Language</Label>
                  <select
                    id="subject"
                    value={subject}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    className="flex h-12 w-full rounded-md border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                  </select>
                </div>
                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="instructions" className="text-slate-700 font-semibold flex items-center gap-2">
                    Instructions for Students
                    <FileEdit className="h-4 w-4 text-slate-500" />
                  </Label>
                  <Textarea
                    id="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Enter instructions for students"
                    rows={3}
                    className="resize-none border-2 border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Vocabulary Selection */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-green-100/50 hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  Vocabulary Source
                </CardTitle>
                <CardDescription className="text-green-100 flex items-center gap-2">
                  Choose from curriculum vocabulary or provide your own custom list
                  <ClipboardList className="h-4 w-4" />
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="flex items-center space-x-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 hover:bg-emerald-100 transition-all duration-200">
                  <Checkbox
                    id="useCustom"
                    checked={useCustomVocabulary}
                    onCheckedChange={(checked) =>
                      setUseCustomVocabulary(checked as boolean)
                    }
                    className="border-2 border-emerald-400 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />
                  <Label htmlFor="useCustom" className="cursor-pointer font-semibold text-emerald-800 flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    Use custom vocabulary list
                  </Label>
                </div>

                {!useCustomVocabulary ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="curriculumLevel" className="text-slate-700 font-semibold flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-slate-500" />
                        Curriculum Level
                      </Label>
                      <select
                        id="curriculumLevel"
                        value={vocabularyConfig.curriculumLevel}
                        onChange={(e) =>
                          setVocabularyConfig((prev: VocabularyConfig) => ({
                            ...prev,
                            curriculumLevel: e.target.value as 'KS3' | 'KS4',
                            categoryId: '',
                            subcategoryId: undefined,
                          }))
                        }
                        className="flex h-12 w-full rounded-md border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="KS3">Key Stage 3</option>
                        <option value="KS4">Key Stage 4 (GCSE)</option>
                      </select>
                    </div>

                    {vocabularyConfig.curriculumLevel === 'KS4' && (
                      <>
                        <div className="space-y-3">
                          <Label htmlFor="examBoard" className="text-slate-700 font-semibold flex items-center gap-2">
                            <Award className="h-4 w-4 text-slate-500" />
                            Exam Board
                          </Label>
                          <select
                            id="examBoard"
                            value={vocabularyConfig.examBoard || 'AQA'}
                            onChange={(e) =>
                              setVocabularyConfig((prev: VocabularyConfig) => ({
                                ...prev,
                                examBoard: e.target.value as 'AQA' | 'edexcel',
                              }))
                            }
                            className="flex h-12 w-full rounded-md border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="AQA">AQA</option>
                            <option value="edexcel">Edexcel Pearson</option>
                          </select>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="tier" className="text-slate-700 font-semibold flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-slate-500" />
                            Tier
                          </Label>
                          <select
                            id="tier"
                            value={vocabularyConfig.tier || 'foundation'}
                            onChange={(e) =>
                              setVocabularyConfig((prev: VocabularyConfig) => ({
                                ...prev,
                                tier: e.target.value as 'foundation' | 'higher',
                              }))
                            }
                            className="flex h-12 w-full rounded-md border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="foundation">Foundation</option>
                            <option value="higher">Higher</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="category">Vocabulary Category</Label>
                      <select
                        id="category"
                        value={vocabularyConfig.categoryId}
                        onChange={(e) =>
                          setVocabularyConfig((prev: VocabularyConfig) => ({
                            ...prev,
                            categoryId: e.target.value,
                            subcategoryId: undefined,
                          }))
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a category...</option>
                        {availableCategories.map((category) => {
                          const IconComponent = category.icon;
                          return (
                            <option key={category.id} value={category.id}>
                              {category.displayName}
                            </option>
                          );
                        })}
                      </select>
                      {availableCategories.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3" key={`categories-${vocabularyConfig.curriculumLevel}`}>
                          {availableCategories.map((category) => {
                            const IconComponent = category.icon;
                            const isSelected = vocabularyConfig.categoryId === category.id;
                            return (
                              <button
                                key={`${vocabularyConfig.curriculumLevel}-${category.id}`}
                                type="button"
                                onClick={() =>
                                  setVocabularyConfig((prev: VocabularyConfig) => ({
                                    ...prev,
                                    categoryId: category.id,
                                    subcategoryId: undefined,
                                  }))
                                }
                                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                                  isSelected
                                    ? `bg-gradient-to-r ${category.color} text-white border-transparent shadow-lg`
                                    : 'bg-background border-border hover:border-primary/50 hover:shadow-md'
                                }`}
                              >
                                {IconComponent && <IconComponent className="h-4 w-4" />}
                                <span className="truncate">{category.displayName}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {availableSubcategories.length > 0 && (
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="subcategory" className="text-slate-700 font-semibold flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-slate-500" />
                          Vocabulary Subcategory
                        </Label>
                        <select
                          id="subcategory"
                          value={vocabularyConfig.subcategoryId || ''}
                          onChange={(e) =>
                            setVocabularyConfig((prev: VocabularyConfig) => ({
                              ...prev,
                              subcategoryId: e.target.value || undefined,
                            }))
                          }
                          className="flex h-12 w-full rounded-md border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">All subcategories</option>
                          {availableSubcategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                              {subcategory.displayName}
                            </option>
                          ))}
                        </select>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4" key={`subcategories-${vocabularyConfig.categoryId}`}>
                          {availableSubcategories.map((subcategory) => {
                            const isSelected = vocabularyConfig.subcategoryId === subcategory.id;
                            return (
                              <button
                                key={`${vocabularyConfig.categoryId}-${subcategory.id}`}
                                type="button"
                                onClick={() =>
                                  setVocabularyConfig((prev: VocabularyConfig) => ({
                                    ...prev,
                                    subcategoryId: isSelected ? undefined : subcategory.id,
                                  }))
                                }
                                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-transparent shadow-lg'
                                    : 'bg-white border-slate-200 hover:border-green-300 hover:shadow-md'
                                }`}
                              >
                                <span className="truncate">{subcategory.displayName}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="customVocab">Custom Vocabulary List</Label>
                    <Textarea
                      id="customVocab"
                      value={customVocabulary}
                      onChange={(e) => setCustomVocabulary(e.target.value)}
                      placeholder="casa - house&#10;perro - dog&#10;sol"
                      rows={8}
                      className="font-mono text-sm resize-none border-2 focus:border-primary/50 transition-colors"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter one word per line. Use "word - translation" format
                      for translations.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Exercise Types */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-purple-100/50 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <ListChecks className="h-6 w-6" />
                  </div>
                  Exercise Types
                </CardTitle>
                <CardDescription className="text-purple-100 flex items-center gap-2">
                  Choose which activities to include in the worksheet
                  <CheckSquare className="h-4 w-4" />
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-8">
                {[
                  { id: 'matching', label: 'Matching (Word to Translation)', icon: Globe },
                  { id: 'fillBlanks', label: 'Fill in the Blanks', icon: Edit3 },
                  { id: 'definitions', label: 'Definition Matching', icon: BookOpen },
                  { id: 'translations', label: 'Translation Practice', icon: Globe },
                  { id: 'wordBank', label: 'Include a Word Bank', icon: ClipboardList },
                  { id: 'wordsearch', label: 'Word Search Puzzle', icon: Search },
                  { id: 'crossword', label: 'Crossword Puzzle', icon: Grid3x3 },
                ].map((exercise) => {
                  const IconComponent = exercise.icon;
                  const isChecked = exerciseTypes[exercise.id as keyof typeof exerciseTypes];
                  
                  return (
                    <div
                      key={exercise.id}
                      className={`flex items-center space-x-3 rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer ${
                        isChecked
                          ? 'border-purple-300 bg-purple-50 shadow-md'
                          : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                      }`}
                      onClick={() =>
                        updateExerciseType(
                          exercise.id as keyof typeof exerciseTypes,
                          !isChecked,
                        )
                      }
                    >
                      <Checkbox
                        id={exercise.id}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          updateExerciseType(
                            exercise.id as keyof typeof exerciseTypes,
                            checked as boolean,
                          )
                        }
                        className="border-2 border-purple-400 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      />
                      <IconComponent className={`h-5 w-5 ${isChecked ? 'text-purple-600' : 'text-slate-400'}`} />
                      <Label
                        htmlFor={exercise.id}
                        className={`text-sm font-medium leading-none cursor-pointer ${
                          isChecked ? 'text-purple-800' : 'text-slate-700'
                        }`}
                      >
                        {exercise.label}
                      </Label>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions & Status */}
          <div className="lg:col-span-1 space-y-8 sticky top-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-orange-100/50 hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  Generate
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Button
                  onClick={generateWorksheet}
                  disabled={isGenerating}
                  size="lg"
                  className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-6 w-6 mr-3" />
                      Generate Worksheet
                    </>
                  )}
                </Button>
              </CardContent>
              {generatedWorksheet && (
                <>
                  <Separator className="my-4" />
                  <CardContent className="space-y-3 p-6">
                    <Button
                      onClick={previewWorksheet}
                      variant="outline"
                      className="w-full h-12 border-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      onClick={downloadWorksheet} 
                      className="w-full h-12 bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </>
              )}
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Settings className="h-6 w-6" />
                  </div>
                  Custom Instructions
                </CardTitle>
                <CardDescription className="text-slate-100 flex items-center gap-2">
                  Optionally add specific prompts for the AI
                  <BarChart3 className="h-4 w-4" />
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., Focus on food vocabulary, include images, make it suitable for beginners..."
                  rows={4}
                  className="resize-none border-2 border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all duration-200 bg-white"
                />
              </CardContent>
            </Card>

            {isGenerating && (
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl shadow-blue-100/50">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-30 animate-pulse"></div>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-slate-800">
                        Generating your worksheet...
                      </p>
                      <p className="text-slate-600 mt-1">
                        This may take a few moments
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {generatedWorksheet && (
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-xl shadow-green-100/50">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckSquare className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur opacity-20"></div>
                    </div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      Worksheet Ready!
                    </h3>
                    <p className="text-green-700">
                      Your worksheet is ready to preview or download
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}