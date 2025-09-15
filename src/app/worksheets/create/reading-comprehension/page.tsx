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
  Target,
  FileEdit,
  BarChart3,
  GraduationCap,
  Edit3,
  ClipboardList
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
interface TopicConfig {
  language: string;
  curriculumLevel: 'KS2' | 'KS3' | 'KS4' | 'KS5';
  categoryId: string;
  subcategoryId?: string;
  // KS4-specific fields
  examBoard?: 'AQA' | 'edexcel';
  tier?: 'foundation' | 'higher';
}

export default function ReadingComprehensionPage() {
  const [title, setTitle] = useState('Reading Comprehension Worksheet');
  const [subject, setSubject] = useState('spanish');
  const [instructions, setInstructions] = useState('Read the passage carefully and answer the questions that follow.');
  const [customPrompt, setCustomPrompt] = useState('');

  // Topic selection
  const [topicConfig, setTopicConfig] = useState<TopicConfig>({
    language: 'es',
    curriculumLevel: 'KS3',
    categoryId: '',
    subcategoryId: undefined,
  });

  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);

  // Reading comprehension specific settings
  const [readingSettings, setReadingSettings] = useState({
    passageLength: 'medium', // short, medium, long
    questionTypes: {
      multipleChoice: true,
      shortAnswer: true,
      trueFalse: false,
      fillBlanks: false
    },
    questionCount: 8,
    includeVocabulary: true
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState<any>(null);
  const [worksheetId, setWorksheetId] = useState<string | null>(null);

  // Load categories based on curriculum level and exam board
  useEffect(() => {
    if (topicConfig.curriculumLevel === 'KS3') {
      setAvailableCategories(VOCABULARY_CATEGORIES);
    } else if (topicConfig.curriculumLevel === 'KS4') {
      const ks4Categories = getCategoriesByCurriculum('KS4', topicConfig.examBoard || 'AQA');
      setAvailableCategories(ks4Categories);
    }
  }, [topicConfig.curriculumLevel, topicConfig.examBoard]);

  // Load subcategories when category changes
  useEffect(() => {
    if (topicConfig.categoryId) {
      const selectedCategory = availableCategories.find(cat => cat.id === topicConfig.categoryId);
      if (selectedCategory) {
        setAvailableSubcategories(selectedCategory.subcategories || []);
      }
    } else {
      setAvailableSubcategories([]);
    }
  }, [topicConfig.categoryId, availableCategories]);

  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    const languageMap: { [key: string]: string } = {
      spanish: 'es',
      french: 'fr',
      german: 'de',
      english: 'en',
    };
    setTopicConfig((prev: TopicConfig) => ({
      ...prev,
      language: languageMap[newSubject] || 'es',
      categoryId: '',
      subcategoryId: undefined,
    }));
  };

  const updateQuestionType = (type: keyof typeof readingSettings.questionTypes, checked: boolean) => {
    setReadingSettings(prev => ({
      ...prev,
      questionTypes: { ...prev.questionTypes, [type]: checked }
    }));
  };

  const generateWorksheet = async () => {
    setIsGenerating(true);
    setGeneratedWorksheet(null);
    setWorksheetId(null);

    const requestBody = {
      template: 'reading_comprehension',
      subject: subject,
      topic: topicConfig.categoryId || 'General',
      passageLength: readingSettings.passageLength,
      questionCount: readingSettings.questionCount,
      questionTypes: Object.entries(readingSettings.questionTypes)
        .filter(([_, enabled]) => enabled)
        .map(([type, _]) => type),
      customPrompt: customPrompt || instructions,
      includeVocabulary: readingSettings.includeVocabulary,
      curriculumLevel: topicConfig.curriculumLevel,
      examBoard: topicConfig.examBoard,
      tier: topicConfig.tier,
      category: topicConfig.categoryId,
      subcategory: topicConfig.subcategoryId,
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
            setGeneratedWorksheet(status.result.worksheet);
            if (status.result.worksheetId) {
              setWorksheetId(status.result.worksheetId);
            }
          } else if (status.assumedComplete) {
            console.log('Job assumed complete, redirecting to worksheets page');
            alert('Worksheet generated successfully! Redirecting to your worksheets...');
            window.location.href = '/worksheets';
            return;
          } else {
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
    const idToUse = worksheetId || (generatedWorksheet?.id !== 'completed' ? generatedWorksheet?.id : null);

    if (idToUse) {
      window.open(`/worksheets/${idToUse}`, '_blank');
    } else {
      window.location.href = '/worksheets';
    }
  };

  const downloadWorksheet = () => {
    const idToUse = worksheetId || (generatedWorksheet?.id !== 'completed' ? generatedWorksheet?.id : null);

    if (idToUse) {
      window.open(`/api/worksheets/${idToUse}/download`, '_blank');
    } else {
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
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Reading Comprehension Creator
            </h1>
            <p className="text-slate-600 text-lg flex items-center gap-2">
              Create reading passages with comprehension questions
              <Sparkles className="h-5 w-5 text-blue-500" />
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-8">
            {/* Worksheet Settings */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-teal-100/50 hover:shadow-2xl hover:shadow-teal-200/50 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Palette className="h-6 w-6" />
                  </div>
                  Worksheet Details
                </CardTitle>
                <CardDescription className="text-teal-100 flex items-center gap-2">
                  Configure the basic properties for your reading worksheet
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
                    placeholder="e.g., Spanish Reading Comprehension"
                    className="border-2 border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all duration-200 bg-white"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="subject" className="text-slate-700 font-semibold">Subject Language</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="border-2 border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all duration-200 bg-white h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                    </SelectContent>
                  </Select>
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
                    className="resize-none border-2 border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all duration-200 bg-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Topic Selection */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-purple-100/50 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  Topic Selection
                </CardTitle>
                <CardDescription className="text-purple-100 flex items-center gap-2">
                  Choose a specific topic for the reading passage
                  <Target className="h-4 w-4" />
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="curriculumLevel" className="text-slate-700 font-semibold flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-slate-500" />
                      Curriculum Level
                    </Label>
                    <Select 
                      value={topicConfig.curriculumLevel} 
                      onValueChange={(value) => setTopicConfig(prev => ({
                        ...prev,
                        curriculumLevel: value as 'KS3' | 'KS4',
                        categoryId: '',
                        subcategoryId: undefined,
                      }))}
                    >
                      <SelectTrigger className="border-2 border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 bg-white h-12">
                        <SelectValue placeholder="Select curriculum level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KS3">Key Stage 3</SelectItem>
                        <SelectItem value="KS4">Key Stage 4 (GCSE)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {topicConfig.curriculumLevel === 'KS4' && (
                    <>
                      <div className="space-y-3">
                        <Label htmlFor="examBoard" className="text-slate-700 font-semibold">Exam Board</Label>
                        <Select 
                          value={topicConfig.examBoard || 'AQA'} 
                          onValueChange={(value) => setTopicConfig(prev => ({
                            ...prev,
                            examBoard: value as 'AQA' | 'edexcel',
                          }))}
                        >
                          <SelectTrigger className="border-2 border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 bg-white h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AQA">AQA</SelectItem>
                            <SelectItem value="edexcel">Edexcel Pearson</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="tier" className="text-slate-700 font-semibold">Tier</Label>
                        <Select 
                          value={topicConfig.tier || 'foundation'} 
                          onValueChange={(value) => setTopicConfig(prev => ({
                            ...prev,
                            tier: value as 'foundation' | 'higher',
                          }))}
                        >
                          <SelectTrigger className="border-2 border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 bg-white h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="foundation">Foundation</SelectItem>
                            <SelectItem value="higher">Higher</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="category">Topic Category</Label>
                    <Select 
                      value={topicConfig.categoryId} 
                      onValueChange={(value) => setTopicConfig(prev => ({
                        ...prev,
                        categoryId: value,
                        subcategoryId: undefined,
                      }))}
                    >
                      <SelectTrigger className="border-2 border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 bg-white h-12">
                        <SelectValue placeholder="Select a category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {availableCategories.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                        {availableCategories.map((category) => {
                          const IconComponent = category.icon;
                          const isSelected = topicConfig.categoryId === category.id;
                          return (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() =>
                                setTopicConfig(prev => ({
                                  ...prev,
                                  categoryId: category.id,
                                  subcategoryId: undefined,
                                }))
                              }
                              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                                isSelected
                                  ? `bg-gradient-to-r ${category.color} text-white border-transparent shadow-lg`
                                  : 'bg-background border-border hover:border-purple-300 hover:shadow-md'
                              }`}
                            >
                              <IconComponent className="h-4 w-4" />
                              <span className="truncate">{category.displayName}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {availableSubcategories.length > 0 && (
                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="subcategory" className="text-slate-700 font-semibold">Subcategory</Label>
                      <Select
                        value={topicConfig.subcategoryId || ''}
                        onValueChange={(value) => setTopicConfig(prev => ({
                          ...prev,
                          subcategoryId: value || undefined,
                        }))}
                      >
                        <SelectTrigger className="border-2 border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 bg-white h-12">
                          <SelectValue placeholder="All subcategories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All subcategories</SelectItem>
                          {availableSubcategories.map((subcategory) => (
                            <SelectItem key={subcategory.id} value={subcategory.id}>
                              {subcategory.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        {availableSubcategories.map((subcategory) => {
                          const isSelected = topicConfig.subcategoryId === subcategory.id;
                          return (
                            <button
                              key={subcategory.id}
                              type="button"
                              onClick={() =>
                                setTopicConfig(prev => ({
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
              </CardContent>
            </Card>

            {/* Reading Settings */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-green-100/50 hover:shadow-2xl hover:shadow-green-200/50 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  Reading Settings
                </CardTitle>
                <CardDescription className="text-green-100 flex items-center gap-2">
                  Configure passage and question preferences
                  <ClipboardList className="h-4 w-4" />
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="passageLength" className="text-slate-700 font-semibold">Passage Length</Label>
                    <select
                      id="passageLength"
                      value={readingSettings.passageLength}
                      onChange={(e) => setReadingSettings(prev => ({ ...prev, passageLength: e.target.value }))}
                      className="flex h-12 w-full rounded-md border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="short">Short (100-200 words)</option>
                      <option value="medium">Medium (200-400 words)</option>
                      <option value="long">Long (400-600 words)</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="questionCount" className="text-slate-700 font-semibold">Number of Questions</Label>
                    <Input
                      id="questionCount"
                      type="number"
                      min="4"
                      max="15"
                      value={readingSettings.questionCount}
                      onChange={(e) => setReadingSettings(prev => ({ ...prev, questionCount: parseInt(e.target.value) || 8 }))}
                      className="border-2 border-slate-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200 bg-white h-12"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-slate-700 font-semibold">Question Types</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'multipleChoice', label: 'Multiple Choice', icon: CheckSquare },
                      { id: 'shortAnswer', label: 'Short Answer', icon: Edit3 },
                      { id: 'trueFalse', label: 'True/False', icon: Target },
                      { id: 'fillBlanks', label: 'Fill in Blanks', icon: FileEdit },
                    ].map((questionType) => {
                      const IconComponent = questionType.icon;
                      const isChecked = readingSettings.questionTypes[questionType.id as keyof typeof readingSettings.questionTypes];

                      return (
                        <div
                          key={questionType.id}
                          className={`flex items-center space-x-3 rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer ${
                            isChecked
                              ? 'border-green-300 bg-green-50 shadow-md'
                              : 'border-slate-200 bg-white hover:border-green-300 hover:bg-green-50'
                          }`}
                          onClick={() =>
                            updateQuestionType(
                              questionType.id as keyof typeof readingSettings.questionTypes,
                              !isChecked,
                            )
                          }
                        >
                          <Checkbox
                            id={questionType.id}
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              updateQuestionType(
                                questionType.id as keyof typeof readingSettings.questionTypes,
                                checked as boolean,
                              )
                            }
                            className="border-2 border-green-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                          />
                          <IconComponent className={`h-5 w-5 ${isChecked ? 'text-green-600' : 'text-slate-400'}`} />
                          <Label
                            htmlFor={questionType.id}
                            className={`text-sm font-medium leading-none cursor-pointer ${
                              isChecked ? 'text-green-800' : 'text-slate-700'
                            }`}
                          >
                            {questionType.label}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
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
                  placeholder="e.g., Focus on family vocabulary, include cultural context, make it suitable for beginners..."
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
                        Generating your reading comprehension worksheet...
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
                      Your reading comprehension worksheet is ready to preview or download
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
