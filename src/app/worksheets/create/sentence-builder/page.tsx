'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Checkbox } from '../../../../components/ui/checkbox';
import {
  MessageSquare,
  Download,
  Eye,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import UnifiedCategorySelector, { UnifiedSelectionConfig } from '../../../../components/games/UnifiedCategorySelector';

export default function SentenceBuilderPage() {
  const [title, setTitle] = useState('Sentence Building Practice');
  const [subject, setSubject] = useState('spanish');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [instructions, setInstructions] = useState('Complete the sentence building exercises below.');
  const [customPrompt, setCustomPrompt] = useState('');

  // Exercise types
  const [exerciseTypes, setExerciseTypes] = useState({
    scramble: true,
    fillBlanks: true,
    transform: false,
    combine: false,
    buildSentences: true
  });

  // Vocabulary selection for sentence context
  const [vocabularyConfig, setVocabularyConfig] = useState<UnifiedSelectionConfig>({
    language: 'es',
    curriculumLevel: 'KS3',
    categoryId: '',
    subcategoryId: undefined
  });

  const [useCustomContent, setUseCustomContent] = useState(false);
  const [customContent, setCustomContent] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState<any>(null);

  const updateExerciseType = (type: keyof typeof exerciseTypes, checked: boolean) => {
    setExerciseTypes(prev => ({ ...prev, [type]: checked }));
  };

  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    // Update language code based on subject
    const languageMap: { [key: string]: string } = {
      'spanish': 'es',
      'french': 'fr',
      'german': 'de',
      'english': 'en'
    };
    setVocabularyConfig(prev => ({
      ...prev,
      language: languageMap[newSubject] || 'es',
      categoryId: '', // Reset category when language changes
      subcategoryId: undefined
    }));
  };

  const generateWorksheet = async () => {
    if (!vocabularyConfig.categoryId && !useCustomContent) {
      alert('Please select a vocabulary category or provide custom content');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/worksheets/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: 'sentence_builder',
          subject: subject,
          topic: vocabularyConfig.categoryId || 'Custom Content',
          difficulty: difficulty,
          targetQuestionCount: 12,
          questionTypes: Object.entries(exerciseTypes)
            .filter(([_, enabled]) => enabled)
            .map(([type, _]) => type),
          customPrompt: customPrompt || instructions,
          customContent: useCustomContent ? customContent : '',
          curriculumLevel: vocabularyConfig.curriculumLevel,
          examBoard: vocabularyConfig.examBoard,
          tier: vocabularyConfig.tier,
          category: vocabularyConfig.categoryId,
          subcategory: vocabularyConfig.subcategoryId
        })
      });

      const result = await response.json();
      if (result.jobId) {
        pollForCompletion(result.jobId);
      }
    } catch (error) {
      console.error('Error generating worksheet:', error);
      alert('Failed to generate worksheet');
    } finally {
      setIsGenerating(false);
    }
  };

  const pollForCompletion = async (jobId: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/worksheets/status/${jobId}`);
        const status = await response.json();

        if (status.status === 'completed' && status.worksheet) {
          setGeneratedWorksheet(status.worksheet);
          return;
        }

        if (status.status === 'failed') {
          alert('Worksheet generation failed');
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          alert('Worksheet generation timed out');
        }
      } catch (error) {
        console.error('Error polling status:', error);
      }
    };

    poll();
  };

  const previewWorksheet = () => {
    if (generatedWorksheet) {
      window.open(`/worksheets/${generatedWorksheet.id}`, '_blank');
    }
  };

  const downloadWorksheet = () => {
    if (generatedWorksheet) {
      window.open(`/api/worksheets/${generatedWorksheet.id}/download`, '_blank');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/worksheets/create">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Create
              </Button>
            </Link>
            <div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Sentence Builder</h1>
                  <p className="text-gray-600">Create sentence construction and grammar exercises</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {generatedWorksheet && (
              <>
                <Button variant="outline" onClick={previewWorksheet}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={downloadWorksheet}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </>
            )}
            <Button
              onClick={generateWorksheet}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Worksheet'
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Worksheet Settings</CardTitle>
                <CardDescription>Configure your sentence building worksheet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Worksheet Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter worksheet title"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subject} onValueChange={handleSubjectChange}>
                    <SelectTrigger>
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

                <div>
                  <Label htmlFor="level">Difficulty Level</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
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
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Enter instructions for students"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Exercise Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exercise Types</CardTitle>
                <CardDescription>Select which types of sentence exercises to include</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="scramble"
                    checked={exerciseTypes.scramble}
                    onCheckedChange={(checked) => updateExerciseType('scramble', checked as boolean)}
                  />
                  <Label htmlFor="scramble">Word Scramble</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fillBlanks"
                    checked={exerciseTypes.fillBlanks}
                    onCheckedChange={(checked) => updateExerciseType('fillBlanks', checked as boolean)}
                  />
                  <Label htmlFor="fillBlanks">Fill in the Blanks</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="transform"
                    checked={exerciseTypes.transform}
                    onCheckedChange={(checked) => updateExerciseType('transform', checked as boolean)}
                  />
                  <Label htmlFor="transform">Sentence Transformation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="combine"
                    checked={exerciseTypes.combine}
                    onCheckedChange={(checked) => updateExerciseType('combine', checked as boolean)}
                  />
                  <Label htmlFor="combine">Sentence Combining</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="buildSentences"
                    checked={exerciseTypes.buildSentences}
                    onCheckedChange={(checked) => updateExerciseType('buildSentences', checked as boolean)}
                  />
                  <Label htmlFor="buildSentences">Build Sentences</Label>
                </div>
              </CardContent>
            </Card>

            {/* Custom Prompt */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Custom Instructions (Optional)</CardTitle>
                <CardDescription>Add specific requirements for the worksheet</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., Focus on present tense, include question formation, make sentences about daily routines..."
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Content Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Selection</CardTitle>
                <CardDescription>Choose vocabulary context for sentence building or provide custom content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useCustomContent"
                    checked={useCustomContent}
                    onCheckedChange={(checked) => setUseCustomContent(checked as boolean)}
                  />
                  <Label htmlFor="useCustomContent">Use custom content instead</Label>
                </div>

                {!useCustomContent ? (
                  <div>
                    <Label className="text-base font-medium mb-4 block">Select Vocabulary Context</Label>
                    <UnifiedCategorySelector
                      language={vocabularyConfig.language}
                      curriculumLevel={vocabularyConfig.curriculumLevel}
                      categoryId={vocabularyConfig.categoryId}
                      subcategoryId={vocabularyConfig.subcategoryId}
                      examBoard={vocabularyConfig.examBoard}
                      tier={vocabularyConfig.tier}
                      onSelectionChange={(config: UnifiedSelectionConfig) => setVocabularyConfig(config)}
                      showVocabularyPreview={true}
                      maxPreviewWords={8}
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Sentences will be created using vocabulary from the selected category
                    </p>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="customContent">Custom Sentences/Topics</Label>
                    <Textarea
                      id="customContent"
                      value={customContent}
                      onChange={(e) => setCustomContent(e.target.value)}
                      placeholder="Enter topics, themes, or example sentences to base the exercises on. For example: daily routines, school subjects, family activities"
                      rows={6}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Provide topics, themes, or example sentences that the AI should use to create sentence building exercises
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generation Status */}
            {isGenerating && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center space-x-3">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <div className="text-center">
                      <p className="font-medium">Generating your sentence building worksheet...</p>
                      <p className="text-sm text-gray-600">This may take a few moments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Worksheet Preview */}
            {generatedWorksheet && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">✓ Worksheet Generated Successfully!</CardTitle>
                  <CardDescription>Your sentence building worksheet is ready</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">{generatedWorksheet.title}</h4>
                    <p className="text-sm text-blue-700 mb-4">{generatedWorksheet.description}</p>
                    <div className="flex items-center space-x-3">
                      <Button onClick={previewWorksheet} variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button onClick={downloadWorksheet}>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
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
