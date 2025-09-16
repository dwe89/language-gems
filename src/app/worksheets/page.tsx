'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import ComingSoonWrapper from '../../components/beta/ComingSoonWrapper';
import {
  FileText,
  Users,
  Plus,
  BookOpen,
  PuzzleIcon as Puzzle,
  Search,
  Zap,
  MessageSquare,
  Volume2,
  PenTool,
  Grid3X3,
  Target,
  ArrowRight
} from 'lucide-react';

const worksheetTypes = [
  {
    id: 'sentence-builder',
    title: 'Sentence Builder',
    description: 'Create sentence construction and grammar exercises',
    icon: MessageSquare,
    color: 'bg-blue-500',
    href: '/worksheets/create/sentence-builder'
  },
  {
    id: 'crossword',
    title: 'Crossword Puzzle',
    description: 'Generate crossword puzzles with vocabulary words',
    icon: Puzzle,
    color: 'bg-purple-500',
    href: '/worksheets/create/crossword'
  },
  {
    id: 'vocabulary-practice',
    title: 'Vocabulary Practice',
    description: 'Create vocabulary exercises and word banks',
    icon: BookOpen,
    color: 'bg-green-500',
    href: '/worksheets/create/vocabulary-practice'
  },
  {
    id: 'word-search',
    title: 'Word Search',
    description: 'Generate word search puzzles for vocabulary practice',
    icon: Search,
    color: 'bg-orange-500',
    href: '/worksheets/create/word-search'
  },
  {
    id: 'listening-comprehension',
    title: 'Listening Comprehension',
    description: 'Create audio-based comprehension exercises',
    icon: Volume2,
    color: 'bg-indigo-500',
    href: '/worksheets/create/listening-comprehension'
  },
  {
    id: 'reading-comprehension',
    title: 'Reading Comprehension',
    description: 'Build reading passages with comprehension questions',
    icon: FileText,
    color: 'bg-teal-500',
    href: '/worksheets/create/reading-comprehension'
  },
  {
    id: 'grammar-exercises',
    title: 'Grammar Exercises',
    description: 'Create targeted grammar practice worksheets',
    icon: Target,
    color: 'bg-red-500',
    href: '/worksheets/create/grammar-exercises'
  },
  {
    id: 'writing-practice',
    title: 'Writing Practice',
    description: 'Design creative writing prompts and exercises',
    icon: PenTool,
    color: 'bg-pink-500',
    href: '/worksheets/create/writing-practice'
  },
  {
    id: 'mixed-practice',
    title: 'Mixed Practice',
    description: 'Combine multiple exercise types in one worksheet',
    icon: Grid3X3,
    color: 'bg-gray-500',
    href: '/worksheets/create/mixed-practice'
  }
];

export default function WorksheetsPage() {
  return (
    <ComingSoonWrapper feature="worksheets">
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
              Worksheet Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Create, manage, and discover educational worksheets for language learning with our AI-powered tools
            </p>
          </div>

          {/* Main Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* My Worksheets */}
            <Link href="/worksheets/my-worksheets">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">My Worksheets</CardTitle>
                  <CardDescription>
                    View and manage your created worksheets
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="w-full">
                    View My Worksheets
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Public Worksheets */}
            <Link href="/worksheets/public">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-200">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Public Library</CardTitle>
                  <CardDescription>
                    Browse worksheets shared by the community
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="w-full">
                    Browse Library
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Create New */}
            <Link href="/worksheets/create">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-200">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Create New</CardTitle>
                  <CardDescription>
                    Start creating a new worksheet from scratch
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Create Worksheet
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Quick Create Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Quick Create
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Jump straight to creating your favorite worksheet types
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {worksheetTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Link key={type.id} href={type.href}>
                    <Card className="h-full hover:shadow-md transition-all duration-200 cursor-pointer group hover:scale-105">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {type.title}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                              {type.description}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose LanguageGems Worksheets?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
                <p className="text-gray-600 text-sm">
                  Generate content automatically with our advanced AI tools
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Curriculum Aligned</h3>
                <p className="text-gray-600 text-sm">
                  All worksheets align with language learning standards
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Community Driven</h3>
                <p className="text-gray-600 text-sm">
                  Share and discover worksheets from educators worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ComingSoonWrapper>
  );
}
