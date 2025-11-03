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
  GraduationCap,
  Award,
  Trophy,
  Edit3,
  ClipboardList,
  Search,
  Grid3x3,
  Repeat,
  Lightbulb
} from 'lucide-react';

// Corrected shadcn/ui component imports using the '@/' alias
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Grammar topics configuration
interface GrammarTopic {
  id: string;
  name: string;
  displayName: string;
  icon: any;
  color: string;
  subtopics: GrammarSubtopic[];
}

interface GrammarSubtopic {
  id: string;
  name: string;
  displayName: string;
  topicId: string;
}

const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: 'verbs',
    name: 'verbs',
    displayName: 'Verbs & Tenses',
    icon: Target,
    color: 'from-blue-500 to-indigo-600',
    subtopics: [
      { id: 'present_tense', name: 'present_tense', displayName: 'Present Tense', topicId: 'verbs' },
      { id: 'past_tense', name: 'past_tense', displayName: 'Past Tense', topicId: 'verbs' },
      { id: 'future_tense', name: 'future_tense', displayName: 'Future Tense', topicId: 'verbs' },
      { id: 'conditional', name: 'conditional', displayName: 'Conditional', topicId: 'verbs' },
      { id: 'subjunctive', name: 'subjunctive', displayName: 'Subjunctive', topicId: 'verbs' },
    ]
  },
  {
    id: 'nouns_articles',
    name: 'nouns_articles',
    displayName: 'Nouns & Articles',
    icon: BookOpen,
    color: 'from-green-500 to-emerald-600',
    subtopics: [
      { id: 'gender', name: 'gender', displayName: 'Gender', topicId: 'nouns_articles' },
      { id: 'plural', name: 'plural', displayName: 'Plural Forms', topicId: 'nouns_articles' },
      { id: 'definite_articles', name: 'definite_articles', displayName: 'Definite Articles', topicId: 'nouns_articles' },
      { id: 'indefinite_articles', name: 'indefinite_articles', displayName: 'Indefinite Articles', topicId: 'nouns_articles' },
    ]
  },
  {
    id: 'adjectives',
    name: 'adjectives',
    displayName: 'Adjectives',
    icon: Palette,
    color: 'from-purple-500 to-pink-600',
    subtopics: [
      { id: 'agreement', name: 'agreement', displayName: 'Agreement', topicId: 'adjectives' },
      { id: 'position', name: 'position', displayName: 'Position', topicId: 'adjectives' },
      { id: 'comparatives', name: 'comparatives', displayName: 'Comparatives', topicId: 'adjectives' },
      { id: 'superlatives', name: 'superlatives', displayName: 'Superlatives', topicId: 'adjectives' },
    ]
  },
  {
    id: 'pronouns',
    name: 'pronouns',
    displayName: 'Pronouns',
    icon: Globe,
    color: 'from-orange-500 to-red-600',
    subtopics: [
      { id: 'subject_pronouns', name: 'subject_pronouns', displayName: 'Subject Pronouns', topicId: 'pronouns' },
      { id: 'object_pronouns', name: 'object_pronouns', displayName: 'Object Pronouns', topicId: 'pronouns' },
      { id: 'reflexive_pronouns', name: 'reflexive_pronouns', displayName: 'Reflexive Pronouns', topicId: 'pronouns' },
      { id: 'possessive_pronouns', name: 'possessive_pronouns', displayName: 'Possessive Pronouns', topicId: 'pronouns' },
    ]
  }
];

const SUBJECT_LANGUAGE_MAP: Record<string, { code: string; label: string }> = {
  spanish: { code: 'es', label: 'Spanish' },
  french: { code: 'fr', label: 'French' },
  german: { code: 'de', label: 'German' },
  english: { code: 'en', label: 'English' }
};

// Types for grammar configuration
interface GrammarConfig {
  language: string;
  topicId: string;
  subtopicId?: string;
}

export default function GrammarExercisesPage() {
  // All hooks must be at the top, before any conditional returns
  const [title, setTitle] = useState('Grammar Practice Worksheet');
  const [subject, setSubject] = useState('spanish');
  const [instructions, setInstructions] = useState('Complete the grammar exercises below.');

  // Grammar topic selection
  const [grammarConfig, setGrammarConfig] = useState<GrammarConfig>({
    language: 'es',
    topicId: '',
    subtopicId: undefined,
  });

  const [availableSubtopics, setAvailableSubtopics] = useState<GrammarSubtopic[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState({
    conjugation: true,
    sentenceCompletion: true,
    transformation: true,
    errorCorrection: true,
  });
  const [customFocus, setCustomFocus] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState<any>(null);
  const [worksheetId, setWorksheetId] = useState<string | null>(null);
  const [generationMessage, setGenerationMessage] = useState<string | null>(null);

  // Hydration guard: avoid mismatches by waiting for client-side mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const grammarContent = generatedWorksheet
    ? generatedWorksheet.rawContent
        || generatedWorksheet.raw_content
        || generatedWorksheet.content?.rawContent
        || generatedWorksheet.content
    : null;
  const previewExercises = Array.isArray(grammarContent?.exercises) ? grammarContent.exercises : [];

  const formatExerciseType = (type: string) => {
    const lookup: Record<string, string> = {
      conjugation: 'Verb conjugation tables',
      sentence_completion: 'Sentence completion',
      sentenceCompletion: 'Sentence completion',
      transformation: 'Sentence transformations',
      error_correction: 'Error corrections',
      errorCorrection: 'Error corrections',
      fill_in_the_blank: 'Fill in the blanks',
      matching: 'Matching pairs',
    };

    if (!type) {
      return 'Exercise';
    }

    if (lookup[type]) {
      return lookup[type];
    }

    return type
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatPlainText = (value: unknown) => {
    if (typeof value !== 'string') {
      return '';
    }

    return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const truncateText = (value: string, limit = 160) => {
    if (!value) {
      return '';
    }

    if (value.length <= limit) {
      return value;
    }

    return `${value.slice(0, limit).trimEnd()}…`;
  };

  // Load subtopics when topic changes
  useEffect(() => {
    if (grammarConfig.topicId) {
      const selectedTopic = GRAMMAR_TOPICS.find(topic => topic.id === grammarConfig.topicId);
      if (selectedTopic) {
        setAvailableSubtopics(selectedTopic.subtopics || []);
      }
    } else {
      setAvailableSubtopics([]);
    }
  }, [grammarConfig.topicId]);

  const updateExerciseType = (type: keyof typeof exerciseTypes, checked: boolean) => {
    setExerciseTypes(prev => ({
      ...prev,
      [type]: checked,
    }));
  };

  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    const languageEntry = SUBJECT_LANGUAGE_MAP[newSubject];
    setGrammarConfig((prev: GrammarConfig) => ({
      ...prev,
      language: languageEntry?.code || 'es',
      topicId: '',
      subtopicId: undefined,
    }));
  };

  const getNormalizedExerciseTypes = () => {
    const typeMap: Record<keyof typeof exerciseTypes, string> = {
      conjugation: 'conjugation',
      sentenceCompletion: 'sentence-completion',
      transformation: 'transformation',
      errorCorrection: 'error-correction',
    };

    return Object.entries(exerciseTypes)
      .filter(([, enabled]) => enabled)
      .map(([key]) => typeMap[key as keyof typeof exerciseTypes]);
  };

  const pollForCompletion = async (jobId: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/worksheets/progress/${jobId}`);

        if (!response.ok) {
          console.error(`Status check failed with status: ${response.status}`);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const status = await response.json();

  if (status.status === 'completed') {
          if (status.result?.worksheet) {
            setGeneratedWorksheet(status.result.worksheet);
            if (status.result.worksheetId) {
              setWorksheetId(status.result.worksheetId);
            }
          } else {
            setGeneratedWorksheet(status.result);
            if (status.result?.worksheetId) {
              setWorksheetId(status.result.worksheetId);
            }
          }

          setGenerationMessage('Generation completed. Preview or download your worksheet below.');
          setIsGenerating(false);
          return;
        }

        if (status.status === 'failed') {
          console.error('Worksheet generation failed:', status);
          setGenerationMessage('Worksheet generation failed: ' + (status.error || 'Unknown error'));
          alert('Worksheet generation failed: ' + (status.error || 'Unknown error'));
          setIsGenerating(false);
          return;
        }

        attempts++;
        // only update the user-facing message every 2 attempts to avoid frequent re-renders
        if (attempts < maxAttempts) {
          if (attempts % 2 === 0) {
            setGenerationMessage(`Waiting for completion... (attempt ${attempts}/${maxAttempts})`);
          }
          setTimeout(poll, 3000);
        } else {
          setGenerationMessage('Polling timed out. Check your worksheets page for results.');
          alert('Worksheet generation may have completed. Please check your worksheets page.');
          setIsGenerating(false);
          window.location.href = '/worksheets';
        }
      } catch (error) {
        console.error('Error polling status:', error);
        attempts++;
        if (attempts < maxAttempts) {
          if (attempts % 2 === 0) {
            setGenerationMessage(`Retrying status check... (attempt ${attempts}/${maxAttempts})`);
          }
          setTimeout(poll, 3000);
        } else {
          setGenerationMessage('Polling timed out. Check your worksheets page for results.');
          alert('Worksheet generation may have completed. Please check your worksheets page.');
          setIsGenerating(false);
          window.location.href = '/worksheets';
        }
      }
    };

    poll();
  };

  const generateWorksheet = async () => {
    const normalizedExercises = getNormalizedExerciseTypes();

    if (normalizedExercises.length === 0) {
      alert('Please select at least one exercise type.');
      return;
    }

    setIsGenerating(true);
    setGeneratedWorksheet(null);
    setWorksheetId(null);

    const topicMeta = GRAMMAR_TOPICS.find(topic => topic.id === grammarConfig.topicId);
    const subtopicMeta = topicMeta?.subtopics.find(sub => sub.id === grammarConfig.subtopicId);
    const topicDisplayName = topicMeta?.displayName || 'Grammar Focus';
    const subtopicDisplayName = subtopicMeta?.displayName;
    const languageEntry = SUBJECT_LANGUAGE_MAP[subject] || { code: 'es', label: 'Spanish' };
  const cleanedCustomFocus = customFocus.trim();
  const inferredFocus = subtopicDisplayName || topicDisplayName;
  const focusDisplay = cleanedCustomFocus || inferredFocus || 'Core Grammar Skills';

    const combinedPrompt = [
  instructions,
  focusDisplay ? `Emphasise the grammar focus on ${focusDisplay}.` : '',
      customPrompt
    ]
      .filter(Boolean)
      .join('\n\n');

    const requestBody = {
      template: 'grammar_exercises',
      subject,
      topic: topicDisplayName,
      subtopic: subtopicDisplayName,
      difficulty: 'intermediate',
      targetQuestionCount: 12,
      questionTypes: normalizedExercises,
      customPrompt: combinedPrompt,
      language: grammarConfig.language,
      targetLanguage: languageEntry.label,
      advancedOptions: {
        grammarExerciseTypes: normalizedExercises,
        grammarFocus: focusDisplay,
      },
    };

    try {
      console.log('Starting generateWorksheet request', requestBody);
      setGenerationMessage('Sending generation request...');
      const response = await fetch('/api/worksheets/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Generation API response:', result);
      setGenerationMessage('Generation job started...');

      if (result.jobId) {
        pollForCompletion(result.jobId);
      } else {
        throw new Error('No job ID returned from server');
      }
    } catch (error) {
      console.error('Error generating worksheet:', error);
      setGenerationMessage('Failed to generate worksheet: ' + (error as Error).message);
      alert('Failed to generate worksheet: ' + (error as Error).message);
      setIsGenerating(false);
    }
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

  const downloadCanvaFriendly = () => {
    const idToUse = worksheetId || (generatedWorksheet?.id !== 'completed' ? generatedWorksheet?.id : null);

    if (idToUse) {
      window.open(`/api/worksheets/${idToUse}/download?canva=true`, '_blank');
    } else {
      window.location.href = '/worksheets';
    }
  };

  // Render a stable skeleton during SSR and first client paint
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-white/60 rounded w-2/5" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-white/60 rounded" />
                <div className="h-80 bg-white/60 rounded" />
              </div>
              <div className="space-y-6">
                <div className="h-40 bg-white/60 rounded" />
              </div>
            </div>
          </div>
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
        <div className="flex items-center space-x-4 mb-12">
          <Link href="/worksheets/create" passHref>
            <Button variant="outline" size="icon" aria-label="Back to Create" className="hover:bg-white hover:shadow-md transition-all duration-200">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Grammar Exercises Creator
            </h1>
            <p className="text-slate-600 text-lg flex items-center gap-2">
              Create targeted grammar practice worksheets and exercises
              <Sparkles className="h-5 w-5 text-orange-500" />
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-8">
            {/* Worksheet Settings */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-red-100/50 hover:shadow-2xl hover:shadow-red-200/50 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Palette className="h-6 w-6" />
                  </div>
                  Worksheet Configuration
                </CardTitle>
                <CardDescription className="text-red-100 flex items-center gap-2">
                  Configure the basic properties and select grammar topics for your worksheet
                  <Target className="h-4 w-4" />
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-slate-700 font-semibold">Worksheet Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Spanish Present Tense Practice"
                      className="border-2 border-slate-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200 bg-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="subject" className="text-slate-700 font-semibold">Subject Language</Label>
                    <Select value={subject} onValueChange={handleSubjectChange}>
                      <SelectTrigger className="border-2 border-slate-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200 bg-white h-12">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator className="my-6" />
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="grammarTopic" className="text-slate-700 font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4 text-slate-500" />
                        Grammar Topic
                      </Label>
                      <select
                        id="grammarTopic"
                        value={grammarConfig.topicId}
                        onChange={(e) => setGrammarConfig(prev => ({
                          ...prev,
                          topicId: e.target.value,
                          subtopicId: undefined,
                        }))}
                        className="flex h-12 w-full rounded-md border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a grammar topic...</option>
                        {GRAMMAR_TOPICS.map((topic) => (
                          <option key={topic.id} value={topic.id}>
                            {topic.displayName}
                          </option>
                        ))}
                      </select>
                      {GRAMMAR_TOPICS.length > 0 && (
                        <p className="text-sm text-slate-500 mt-2">
                          Tip: pick a top-level topic first, then choose a specific focus below.
                        </p>
                      )}
                    </div>
                  </div>

                  {availableSubtopics.length > 0 && (
                    <div className="space-y-3">
                      <Label htmlFor="subtopic" className="text-slate-700 font-semibold">Specific Topic</Label>
                      <select
                        id="subtopic"
                        value={grammarConfig.subtopicId || ''}
                        onChange={(e) => setGrammarConfig(prev => ({
                          ...prev,
                          subtopicId: e.target.value || undefined,
                        }))}
                        className="flex h-12 w-full rounded-md border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">All subtopics</option>
                        {availableSubtopics.map((subtopic) => (
                          <option key={subtopic.id} value={subtopic.id}>
                            {subtopic.displayName}
                          </option>
                        ))}
                      </select>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        {availableSubtopics.map((subtopic) => {
                          const isSelected = grammarConfig.subtopicId === subtopic.id;
                          return (
                            <button
                              key={subtopic.id}
                              type="button"
                              onClick={() =>
                                setGrammarConfig(prev => ({
                                  ...prev,
                                  subtopicId: isSelected ? undefined : subtopic.id,
                                }))
                              }
                              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                                isSelected
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-transparent shadow-lg'
                                  : 'bg-white border-slate-200 hover:border-green-300 hover:shadow-md'
                                }`}
                            >
                              <span className="truncate">{subtopic.displayName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="customFocus" className="text-slate-700 font-semibold flex items-center gap-2">
                      Focus override (optional)
                      <Target className="h-4 w-4 text-slate-500" />
                    </Label>
                    <Input
                      id="customFocus"
                      value={customFocus}
                      onChange={(e) => setCustomFocus(e.target.value)}
                      placeholder="e.g. Regular -ar verbs in the present tense"
                      className="border-2 border-slate-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200 bg-white"
                    />
                    <p className="text-xs text-slate-500">
                      Leave blank to use the selected topic/subtopic automatically.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Exercise Types & Guidance */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-purple-100/50 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <ListChecks className="h-6 w-6" />
                  </div>
                  Exercise Mix & Guidance
                </CardTitle>
                <CardDescription className="text-purple-100 flex items-center gap-2">
                  Choose the exercise styles and steer the AI with optional tips
                  <CheckSquare className="h-4 w-4" />
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: 'conjugation',
                      label: 'Verb conjugation tables',
                      description: 'Tables with subject pronouns and space to conjugate verbs.',
                      icon: Grid3x3,
                    },
                    {
                      id: 'sentenceCompletion',
                      label: 'Sentence completion',
                      description: 'Fill-in-the-blank sentences that target specific structures.',
                      icon: Edit3,
                    },
                    {
                      id: 'transformation',
                      label: 'Sentence transformations',
                      description: 'Rewrite prompts (e.g. change tense, voice or perspective).',
                      icon: Repeat,
                    },
                    {
                      id: 'errorCorrection',
                      label: 'Error correction',
                      description: 'Spot and fix intentional grammar mistakes in context.',
                      icon: ClipboardList,
                    },
                  ].map((exercise) => {
                    const IconComponent = exercise.icon;
                    const isChecked = exerciseTypes[exercise.id as keyof typeof exerciseTypes];

                    return (
                      <button
                        key={exercise.id}
                        type="button"
                        onClick={() => updateExerciseType(exercise.id as keyof typeof exerciseTypes, !isChecked)}
                        className={`text-left rounded-xl border-2 p-4 transition-all duration-200 ${
                          isChecked
                            ? 'border-purple-300 bg-purple-50 shadow-md'
                            : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              updateExerciseType(
                                exercise.id as keyof typeof exerciseTypes,
                                Boolean(checked)
                              )
                            }
                            className="mt-1 border-2 border-purple-400 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <IconComponent className={`h-5 w-5 ${isChecked ? 'text-purple-600' : 'text-slate-400'}`} />
                              <span className={`font-semibold ${isChecked ? 'text-purple-800' : 'text-slate-700'}`}>
                                {exercise.label}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 leading-snug">{exercise.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Separator className="my-2" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="instructions" className="text-slate-700 font-semibold flex items-center gap-2">
                      Instructions for students
                      <FileEdit className="h-4 w-4 text-slate-500" />
                    </Label>
                    <Textarea
                      id="instructions"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Complete each exercise carefully. Show your working where space is provided."
                      rows={4}
                      className="resize-none border-2 border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 bg-white"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="customPrompt" className="text-slate-700 font-semibold flex items-center gap-2">
                      AI guidance (optional)
                      <Sparkles className="h-4 w-4 text-slate-500" />
                    </Label>
                    <Textarea
                      id="customPrompt"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="e.g. Include a mini explanation before each exercise and ensure examples use the present tense."
                      rows={4}
                      className="resize-none border-2 border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 bg-white"
                    />
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
                  Generate Worksheet
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Button
                  onClick={generateWorksheet}
                  size="lg"
                  disabled={isGenerating}
                  className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-6 w-6 mr-3" />
                      Generate Grammar Exercises
                    </>
                  )}
                </Button>
                <div className="mt-4">
                  {generationMessage && (
                    <p className="text-sm text-slate-700 flex items-center gap-2">
                      <Loader2 className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                      {generationMessage}
                    </p>
                  )}

                  {!isGenerating && (generatedWorksheet || worksheetId) && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={previewWorksheet} className="flex-1">
                          <Eye className="h-4 w-4 mr-2" /> Preview
                        </Button>
                        <Button variant="outline" onClick={downloadWorksheet} className="flex-1">
                          <Download className="h-4 w-4 mr-2" /> Download
                        </Button>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={downloadCanvaFriendly}
                        className="w-full border-2 border-purple-300 hover:bg-purple-50 hover:border-purple-400 text-purple-700"
                      >
                        <Download className="h-4 w-4 mr-2" /> 
                        Download for Canva
                      </Button>
                      <p className="text-xs text-slate-500 text-center">
                        Canva version has simplified styling for easier editing
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {!generatedWorksheet && !isGenerating && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-slate-100/60">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-slate-500" />
                    Preview will appear here
                  </CardTitle>
                  <CardDescription>
                    Generate a worksheet to see a quick summary of exercises and instructions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 space-y-2">
                  <p>
                    Pick a topic, choose the exercise mix, then hit <strong>Generate</strong>. We’ll show the
                    resulting structure here so you can sanity-check before downloading.
                  </p>
                  <p className="text-slate-500">
                    The full worksheet (with styling) is still available via the preview/download buttons.
                  </p>
                </CardContent>
              </Card>
            )}

            {generatedWorksheet && (
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl shadow-purple-100/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                    Worksheet snapshot
                  </CardTitle>
                  <CardDescription>
                    {generatedWorksheet.title || 'Grammar practice worksheet'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 text-sm text-slate-700">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <span className="text-slate-500">Focus</span>
                      <span className="font-semibold text-slate-800">
                        {generatedWorksheet.metadata?.grammarFocus || grammarContent?.grammar_topic || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <span className="text-slate-500">Difficulty</span>
                      <span className="font-semibold text-slate-800">
                        {(generatedWorksheet.difficulty || 'Intermediate').toString().replace(/(^[a-z])/, (c: string) => c.toUpperCase())}
                      </span>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <span className="text-slate-500 block mb-1">Included exercises</span>
                      {previewExercises.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {previewExercises.slice(0, 4).map((exercise: any, index: number) => (
                            <li key={`${exercise.type}-${index}`}>
                              <span className="font-medium text-slate-800">{formatExerciseType(exercise.type)}</span>
                              {exercise.instructions && (
                                <span className="text-slate-500"> — {truncateText(formatPlainText(exercise.instructions), 80)}</span>
                              )}
                            </li>
                          ))}
                          {previewExercises.length > 4 && (
                            <li className="text-slate-500">…plus {previewExercises.length - 4} more sections</li>
                          )}
                        </ul>
                      ) : (
                        <p className="text-slate-500">No exercises returned in the preview payload.</p>
                      )}
                    </div>
                  </div>

                  {grammarContent?.explanation && (
                    <div className="rounded-lg border border-purple-100 bg-purple-50 px-3 py-3">
                      <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Quick explanation
                      </h4>
                      <p className="text-sm text-purple-700/80 mt-1 leading-relaxed">
                        {truncateText(formatPlainText(grammarContent.explanation), 220)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
