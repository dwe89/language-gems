'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  PuzzleIcon as Puzzle,
  Search,
  MessageSquare,
  Volume2,
  PenTool,
  Grid3X3,
  Target,
  FileText,
  Zap,
  Users,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const worksheetCategories = {
  popular: [
    {
      id: 'sentence-builder',
      title: 'Sentence Builder',
      description: 'Create sentence construction and grammar exercises with drag-and-drop functionality',
      icon: MessageSquare,
      color: 'bg-blue-500',
      features: ['Grammar Practice', 'Sentence Structure', 'Interactive Elements']
    },
    {
      id: 'crossword',
      title: 'Crossword Puzzle',
      description: 'Generate crossword puzzles with vocabulary words and custom clues',
      icon: Puzzle,
      color: 'bg-purple-500',
      features: ['Vocabulary Practice', 'Print Ready']
    },
    {
      id: 'vocabulary-practice',
      title: 'Vocabulary Practice',
      description: 'Create vocabulary exercises with matching, definitions, and translations',
      icon: BookOpen,
      color: 'bg-green-500',
      features: ['Word Banks', 'Multiple Formats', 'Progress Tracking']
    }
  ],
  puzzles: [
    {
      id: 'word-search',
      title: 'Word Search',
      description: 'Generate word search puzzles for vocabulary practice and recognition',
      icon: Search,
      color: 'bg-orange-500',
      features: ['Vocabulary Practice', 'Recognition']
    },
    {
      id: 'crossword',
      title: 'Crossword Puzzle',
      description: 'Advanced crossword creation with smart word placement',
      icon: Puzzle,
      color: 'bg-purple-500',
      features: ['Smart Placement', 'Custom Clues', 'Multiple Formats']
    }
  ],
  comprehension: [
    {
      id: 'reading-comprehension',
      title: 'Reading Comprehension',
      description: 'Build reading passages with comprehension questions and analysis',
      icon: FileText,
      color: 'bg-teal-500',
      features: ['Text Analysis', 'Question Types', 'Difficulty Levels']
    },
    {
      id: 'listening-comprehension',
      title: 'Listening Comprehension',
      description: 'Create audio-based comprehension exercises with transcripts',
      icon: Volume2,
      color: 'bg-indigo-500',
      features: ['Audio Integration', 'Transcripts', 'Multiple Choice']
    }
  ],
  advanced: [
    {
      id: 'grammar-exercises',
      title: 'Grammar Exercises',
      description: 'Create targeted grammar practice with conjugations and transformations',
      icon: Target,
      color: 'bg-red-500',
      features: ['Conjugation Tables', 'Error Correction', 'Rule Explanations']
    },
    {
      id: 'writing-practice',
      title: 'Writing Practice',
      description: 'Design creative writing prompts with structured guidance',
      icon: PenTool,
      color: 'bg-pink-500',
      features: ['Writing Prompts', 'Structure Guides', 'Assessment Rubrics']
    },
    {
      id: 'mixed-practice',
      title: 'Mixed Practice',
      description: 'Combine multiple exercise types in comprehensive worksheets',
      icon: Grid3X3,
      color: 'bg-gray-500',
      features: ['Multiple Formats', 'Comprehensive', 'Customizable']
    }
  ]
};

export default function CreateWorksheetPage() {
  const renderWorksheetCard = (worksheet: any) => {
    const IconComponent = worksheet.icon;
    
    return (
      <Link key={worksheet.id} href={`/worksheets/create/${worksheet.id}`}>
        <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-[1.01] border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-purple-200/25">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 ${worksheet.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <IconComponent className="h-6 w-6 text-white relative z-10" />
              </div>
            </div>
            <CardTitle className="text-lg group-hover:text-purple-600 transition-colors font-bold mb-2">
              {worksheet.title}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed text-slate-600">
              {worksheet.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {worksheet.features.map((feature: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors">
                    {feature}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-sm font-medium text-slate-700">Get Started</span>
                <div className="flex items-center text-purple-600 group-hover:text-purple-700">
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/30 -z-10" />
      
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-6 shadow-xl">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Create New Worksheet
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Choose from our collection of beautiful worksheet types to create engaging educational content that students will love
            </p>
          </div>

        {/* Popular Worksheets */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Most Popular</h2>
              <p className="text-slate-600 text-sm mt-1">Start with our most loved worksheet types</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {worksheetCategories.popular.map(renderWorksheetCard)}
          </div>
        </div>

        {/* Puzzles & Games */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <Puzzle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Puzzles & Games</h2>
              <p className="text-slate-600 text-sm mt-1">Interactive puzzles that make learning fun</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {worksheetCategories.puzzles.map(renderWorksheetCard)}
          </div>
        </div>

        {/* Comprehension */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Comprehension</h2>
              <p className="text-slate-600 text-sm mt-1">Build reading and listening skills</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {worksheetCategories.comprehension.map(renderWorksheetCard)}
          </div>
        </div>

        {/* Advanced */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">Advanced</h2>
              <p className="text-slate-600 text-sm mt-1">Comprehensive exercises for deeper learning</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {worksheetCategories.advanced.map(renderWorksheetCard)}
          </div>
        </div>

        {/* Enhanced Help Section */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-12 text-center border border-blue-100 shadow-xl backdrop-blur-sm relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl -z-10" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              Not sure which worksheet type is right for your lesson? Check out our comprehensive guide or start with one of our popular templates designed by educators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/worksheets/guide">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
                  View Creation Guide
                </button>
              </Link>
              <Link href="/worksheets/templates">
                <button className="px-8 py-4 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl border border-slate-200 font-semibold">
                  Browse Templates
                </button>
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
