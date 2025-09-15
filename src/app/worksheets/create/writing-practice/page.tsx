'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Badge } from '../../../../components/ui/badge';
import { 
  PenTool, 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Wand2,
  ArrowLeft,
  FileText
} from 'lucide-react';
import Link from 'next/link';

interface WritingPrompt {
  id: string;
  type: 'creative' | 'descriptive' | 'narrative' | 'persuasive' | 'informative';
  title: string;
  prompt: string;
  guidelines: string[];
  wordCount: { min: number; max: number };
  rubric?: string[];
}

// Writing topics configuration
interface WritingTopic {
  id: string;
  name: string;
  displayName: string;
  icon: any;
  color: string;
  subtopics: WritingSubtopic[];
}

interface WritingSubtopic {
  id: string;
  name: string;
  displayName: string;
  topicId: string;
}

const WRITING_TOPICS: WritingTopic[] = [
  {
    id: 'personal_experiences',
    name: 'personal_experiences',
    displayName: 'Personal Experiences',
    icon: PenTool,
    color: 'from-blue-500 to-indigo-600',
    subtopics: [
      { id: 'family_friends', name: 'family_friends', displayName: 'Family & Friends', topicId: 'personal_experiences' },
      { id: 'hobbies_interests', name: 'hobbies_interests', displayName: 'Hobbies & Interests', topicId: 'personal_experiences' },
      { id: 'daily_routine', name: 'daily_routine', displayName: 'Daily Routine', topicId: 'personal_experiences' },
      { id: 'memories', name: 'memories', displayName: 'Memories', topicId: 'personal_experiences' },
    ]
  },
  {
    id: 'descriptive_writing',
    name: 'descriptive_writing',
    displayName: 'Descriptive Writing',
    icon: Eye,
    color: 'from-green-500 to-emerald-600',
    subtopics: [
      { id: 'places', name: 'places', displayName: 'Places & Locations', topicId: 'descriptive_writing' },
      { id: 'people', name: 'people', displayName: 'People & Characters', topicId: 'descriptive_writing' },
      { id: 'objects', name: 'objects', displayName: 'Objects & Things', topicId: 'descriptive_writing' },
      { id: 'weather_seasons', name: 'weather_seasons', displayName: 'Weather & Seasons', topicId: 'descriptive_writing' },
    ]
  },
  {
    id: 'opinions_arguments',
    name: 'opinions_arguments',
    displayName: 'Opinions & Arguments',
    icon: FileText,
    color: 'from-purple-500 to-pink-600',
    subtopics: [
      { id: 'school_education', name: 'school_education', displayName: 'School & Education', topicId: 'opinions_arguments' },
      { id: 'technology_media', name: 'technology_media', displayName: 'Technology & Media', topicId: 'opinions_arguments' },
      { id: 'environment', name: 'environment', displayName: 'Environment', topicId: 'opinions_arguments' },
      { id: 'social_issues', name: 'social_issues', displayName: 'Social Issues', topicId: 'opinions_arguments' },
    ]
  }
];

// Types for writing configuration
interface WritingConfig {
  language: string;
  topicId: string;
  subtopicId?: string;
}

export default function WritingPracticePage() {
  const [title, setTitle] = useState('Writing Practice Worksheet');
  const [subject, setSubject] = useState('spanish');
  const [level, setLevel] = useState('intermediate');
  const [instructions, setInstructions] = useState('Choose one of the writing prompts below and write your response.');

  // Writing topic selection
  const [writingConfig, setWritingConfig] = useState<WritingConfig>({
    language: 'es',
    topicId: '',
    subtopicId: undefined,
  });

  const [availableSubtopics, setAvailableSubtopics] = useState<WritingSubtopic[]>([]);

  const [prompts, setPrompts] = useState<WritingPrompt[]>([
    {
      id: '1',
      type: 'descriptive',
      title: 'Describe Your Hometown',
      prompt: 'Describe your hometown in Spanish. Include details about the places, people, and activities that make it special.',
      guidelines: [
        'Use present tense verbs',
        'Include at least 5 adjectives',
        'Mention specific locations',
        'Describe the weather and atmosphere'
      ],
      wordCount: { min: 150, max: 250 }
    }
  ]);

  // Load subtopics when topic changes
  useEffect(() => {
    if (writingConfig.topicId) {
      const selectedTopic = WRITING_TOPICS.find(topic => topic.id === writingConfig.topicId);
      if (selectedTopic) {
        setAvailableSubtopics(selectedTopic.subtopics || []);
      }
    } else {
      setAvailableSubtopics([]);
    }
  }, [writingConfig.topicId]);

  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    const languageMap: { [key: string]: string } = {
      spanish: 'es',
      french: 'fr',
      german: 'de',
      english: 'en',
    };
    setWritingConfig((prev: WritingConfig) => ({
      ...prev,
      language: languageMap[newSubject] || 'es',
      topicId: '',
      subtopicId: undefined,
    }));
  };

  const addPrompt = () => {
    const newPrompt: WritingPrompt = {
      id: Date.now().toString(),
      type: 'creative',
      title: '',
      prompt: '',
      guidelines: [],
      wordCount: { min: 100, max: 200 }
    };
    setPrompts([...prompts, newPrompt]);
  };

  const updatePrompt = (id: string, field: keyof WritingPrompt, value: any) => {
    setPrompts(prompts.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const removePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
  };

  const addGuideline = (promptId: string) => {
    setPrompts(prompts.map(p =>
      p.id === promptId 
        ? { ...p, guidelines: [...p.guidelines, ''] }
        : p
    ));
  };

  const updateGuideline = (promptId: string, index: number, value: string) => {
    setPrompts(prompts.map(p =>
      p.id === promptId
        ? {
            ...p,
            guidelines: p.guidelines.map((g, i) => i === index ? value : g)
          }
        : p
    ));
  };

  const removeGuideline = (promptId: string, index: number) => {
    setPrompts(prompts.map(p =>
      p.id === promptId
        ? { ...p, guidelines: p.guidelines.filter((_, i) => i !== index) }
        : p
    ));
  };

  const generateWithAI = async () => {
    console.log('Generate with AI');
  };

  const previewWorksheet = () => {
    console.log('Preview worksheet');
  };

  const downloadWorksheet = () => {
    console.log('Download worksheet');
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'creative': return 'Creative Writing';
      case 'descriptive': return 'Descriptive';
      case 'narrative': return 'Narrative';
      case 'persuasive': return 'Persuasive';
      case 'informative': return 'Informative';
      default: return type;
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
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Writing Practice Creator
            </h1>
            <p className="text-slate-600 text-lg flex items-center gap-2">
              Design creative writing prompts and exercises
              <PenTool className="h-5 w-5 text-purple-500" />
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Worksheet Settings</CardTitle>
                <CardDescription>Configure your writing practice worksheet</CardDescription>
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
                  <Select value={subject} onValueChange={setSubject}>
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
                  <Label htmlFor="level">Writing Level</Label>
                  <Select value={level} onValueChange={setLevel}>
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

            {/* AI Generation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Wand2 className="h-5 w-5 mr-2 text-purple-600" />
                  AI Assistant
                </CardTitle>
                <CardDescription>Generate prompts automatically</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={generateWithAI} className="w-full" variant="outline">
                  Generate Writing Prompts
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Worksheet Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Writing Prompts</span>
                  <Badge variant="secondary">{prompts.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Est. Time</span>
                  <Badge variant="secondary">{Math.max(30, prompts.length * 20)} min</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Writing Prompts</CardTitle>
                    <CardDescription>Add and configure writing prompts for students</CardDescription>
                  </div>
                  <Button onClick={addPrompt} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Prompt
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {prompts.map((prompt, index) => (
                  <div key={prompt.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Prompt {index + 1}</h4>
                      <div className="flex items-center space-x-2">
                        <Select 
                          value={prompt.type} 
                          onValueChange={(value) => updatePrompt(prompt.id, 'type', value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="creative">Creative</SelectItem>
                            <SelectItem value="descriptive">Descriptive</SelectItem>
                            <SelectItem value="narrative">Narrative</SelectItem>
                            <SelectItem value="persuasive">Persuasive</SelectItem>
                            <SelectItem value="informative">Informative</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removePrompt(prompt.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Prompt Title</Label>
                      <Input
                        value={prompt.title}
                        onChange={(e) => updatePrompt(prompt.id, 'title', e.target.value)}
                        placeholder="Enter prompt title"
                      />
                    </div>

                    <div>
                      <Label>Writing Prompt</Label>
                      <Textarea
                        value={prompt.prompt}
                        onChange={(e) => updatePrompt(prompt.id, 'prompt', e.target.value)}
                        placeholder="Enter the writing prompt for students"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Min Words</Label>
                        <Input
                          type="number"
                          value={prompt.wordCount.min}
                          onChange={(e) => updatePrompt(prompt.id, 'wordCount', {
                            ...prompt.wordCount,
                            min: parseInt(e.target.value) || 0
                          })}
                          min="0"
                        />
                      </div>
                      <div>
                        <Label>Max Words</Label>
                        <Input
                          type="number"
                          value={prompt.wordCount.max}
                          onChange={(e) => updatePrompt(prompt.id, 'wordCount', {
                            ...prompt.wordCount,
                            max: parseInt(e.target.value) || 0
                          })}
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Writing Guidelines</Label>
                        <Button 
                          onClick={() => addGuideline(prompt.id)} 
                          size="sm" 
                          variant="outline"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {prompt.guidelines.map((guideline, guidelineIndex) => (
                          <div key={guidelineIndex} className="flex items-center space-x-2">
                            <Input
                              value={guideline}
                              onChange={(e) => updateGuideline(prompt.id, guidelineIndex, e.target.value)}
                              placeholder="Enter guideline"
                              className="flex-1"
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeGuideline(prompt.id, guidelineIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {prompts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No writing prompts yet. Click "Add Prompt" to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
