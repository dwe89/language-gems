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
  Grid3x3
} from 'lucide-react';

// Corrected shadcn/ui component imports using the '@/' alias
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

// Types for grammar configuration
interface GrammarConfig {
  language: string;
  topicId: string;
  subtopicId?: string;
}

export default function GrammarExercisesPage() {
  const [title, setTitle] = useState('Grammar Practice Worksheet');
  const [subject, setSubject] = useState('spanish');
  const [level, setLevel] = useState('intermediate');
  const [instructions, setInstructions] = useState('Complete the grammar exercises below.');

  // Grammar topic selection
  const [grammarConfig, setGrammarConfig] = useState<GrammarConfig>({
    language: 'es',
    topicId: '',
    subtopicId: undefined,
  });

  const [availableSubtopics, setAvailableSubtopics] = useState<GrammarSubtopic[]>([]);

  const [grammarFocus, setGrammarFocus] = useState('present-tense');

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

  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    const languageMap: { [key: string]: string } = {
      spanish: 'es',
      french: 'fr',
      german: 'de',
      english: 'en',
    };
    setGrammarConfig((prev: GrammarConfig) => ({
      ...prev,
      language: languageMap[newSubject] || 'es',
      topicId: '',
      subtopicId: undefined,
    }));
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
                  Worksheet Details
                </CardTitle>
                <CardDescription className="text-red-100 flex items-center gap-2">
                  Configure the basic properties for your grammar worksheet
                  <Target className="h-4 w-4" />
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
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
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="border-2 border-slate-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200 bg-white h-12">
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
                <div className="space-y-3">
                  <Label htmlFor="level" className="text-slate-700 font-semibold flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-slate-500" />
                    Grammar Level
                  </Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger className="border-2 border-slate-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200 bg-white h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="grammarFocus" className="text-slate-700 font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4 text-slate-500" />
                    Grammar Focus
                  </Label>
                  <Select value={grammarFocus} onValueChange={setGrammarFocus}>
                    <SelectTrigger className="border-2 border-slate-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200 bg-white h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present-tense">Present Tense</SelectItem>
                      <SelectItem value="past-tense">Past Tense</SelectItem>
                      <SelectItem value="future-tense">Future Tense</SelectItem>
                      <SelectItem value="subjunctive">Subjunctive</SelectItem>
                      <SelectItem value="conditional">Conditional</SelectItem>
                      <SelectItem value="imperative">Imperative</SelectItem>
                      <SelectItem value="reflexive-verbs">Reflexive Verbs</SelectItem>
                      <SelectItem value="irregular-verbs">Irregular Verbs</SelectItem>
                      <SelectItem value="ser-vs-estar">Ser vs Estar</SelectItem>
                      <SelectItem value="por-vs-para">Por vs Para</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3 lg:col-span-3">
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
                    className="resize-none border-2 border-slate-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200 bg-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Grammar Topic Selection */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-blue-100/50 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Target className="h-6 w-6" />
                  </div>
                  Grammar Topics
                </CardTitle>
                <CardDescription className="text-blue-100 flex items-center gap-2">
                  Select grammar topics for your exercises
                  <BookOpen className="h-4 w-4" />
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="subject" className="text-slate-700 font-semibold flex items-center gap-2">
                      <Globe className="h-4 w-4 text-slate-500" />
                      Subject Language
                    </Label>
                    <select
                      id="subject"
                      value={subject}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      className="flex h-12 w-full rounded-md border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="english">English</option>
                    </select>
                  </div>

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
                      className="flex h-12 w-full rounded-md border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a grammar topic...</option>
                      {GRAMMAR_TOPICS.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.displayName}
                        </option>
                      ))}
                    </select>
                    {GRAMMAR_TOPICS.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {GRAMMAR_TOPICS.map((topic) => {
                          const IconComponent = topic.icon;
                          const isSelected = grammarConfig.topicId === topic.id;
                          return (
                            <button
                              key={topic.id}
                              type="button"
                              onClick={() =>
                                setGrammarConfig(prev => ({
                                  ...prev,
                                  topicId: topic.id,
                                  subtopicId: undefined,
                                }))
                              }
                              className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                                isSelected
                                  ? `bg-gradient-to-r ${topic.color} text-white border-transparent shadow-lg`
                                  : 'bg-background border-border hover:border-blue-300 hover:shadow-md'
                              }`}
                            >
                              <IconComponent className="h-4 w-4" />
                              <span className="truncate">{topic.displayName}</span>
                            </button>
                          );
                        })}
                      </div>
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
                      className="flex h-12 w-full rounded-md border-2 border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
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
                  onClick={generateWithAI}
                  size="lg"
                  className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Sparkles className="h-6 w-6 mr-3" />
                  Generate Grammar Exercises
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
