'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Heart,
  Star,
  Users,
  Clock,
  BookOpen,
  Target,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface PublicWorksheet {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  type: string;
  author: string;
  downloads: number;
  rating: number;
  reviews: number;
  tags: string[];
  createdAt: string;
  estimatedTime: number;
}

const sampleWorksheets: PublicWorksheet[] = [
  {
    id: '1',
    title: 'Spanish Family Vocabulary',
    description: 'Learn family member names in Spanish with matching exercises and fill-in-the-blanks.',
    subject: 'spanish',
    level: 'beginner',
    type: 'vocabulary-practice',
    author: 'María González',
    downloads: 1247,
    rating: 4.8,
    reviews: 23,
    tags: ['family', 'vocabulary', 'beginner'],
    createdAt: '2024-01-15',
    estimatedTime: 20
  },
  {
    id: '2',
    title: 'French Present Tense Conjugation',
    description: 'Master French present tense with regular and irregular verbs through comprehensive exercises.',
    subject: 'french',
    level: 'intermediate',
    type: 'grammar-exercises',
    author: 'Jean Dubois',
    downloads: 892,
    rating: 4.6,
    reviews: 18,
    tags: ['grammar', 'verbs', 'present-tense'],
    createdAt: '2024-01-10',
    estimatedTime: 35
  },
  {
    id: '3',
    title: 'German Food Crossword',
    description: 'Fun crossword puzzle featuring German food vocabulary with visual clues.',
    subject: 'german',
    level: 'intermediate',
    type: 'crossword',
    author: 'Hans Mueller',
    downloads: 634,
    rating: 4.9,
    reviews: 15,
    tags: ['food', 'crossword', 'vocabulary'],
    createdAt: '2024-01-08',
    estimatedTime: 25
  }
];

export default function PublicWorksheetsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const filteredWorksheets = sampleWorksheets.filter(worksheet => {
    const matchesSearch = worksheet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worksheet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worksheet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = subjectFilter === 'all' || worksheet.subject === subjectFilter;
    const matchesLevel = levelFilter === 'all' || worksheet.level === levelFilter;
    const matchesType = typeFilter === 'all' || worksheet.type === typeFilter;

    return matchesSearch && matchesSubject && matchesLevel && matchesType;
  });

  const sortedWorksheets = [...filteredWorksheets].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getSubjectLabel = (subject: string) => {
    switch (subject) {
      case 'spanish': return 'Spanish';
      case 'french': return 'French';
      case 'german': return 'German';
      case 'english': return 'English';
      default: return subject;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vocabulary-practice': return 'Vocabulary';
      case 'grammar-exercises': return 'Grammar';
      case 'crossword': return 'Crossword';
      case 'reading-comprehension': return 'Reading';
      case 'writing-practice': return 'Writing';
      default: return type;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/worksheets">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Hub
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Public Worksheet Library</h1>
              <p className="text-gray-600">Discover and download worksheets shared by educators worldwide</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search worksheets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Subject Filter */}
              <div>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Level Filter */}
              <div>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type Filter */}
              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="vocabulary-practice">Vocabulary</SelectItem>
                    <SelectItem value="grammar-exercises">Grammar</SelectItem>
                    <SelectItem value="crossword">Crossword</SelectItem>
                    <SelectItem value="reading-comprehension">Reading</SelectItem>
                    <SelectItem value="writing-practice">Writing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {sortedWorksheets.length} of {sampleWorksheets.length} worksheets
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Worksheets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedWorksheets.map((worksheet) => (
            <Card key={worksheet.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-2">
                      {worksheet.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className={getLevelColor(worksheet.level)}>
                        {worksheet.level}
                      </Badge>
                      <Badge variant="outline">
                        {getSubjectLabel(worksheet.subject)}
                      </Badge>
                      <Badge variant="outline">
                        {getTypeLabel(worksheet.type)}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="line-clamp-3">
                  {worksheet.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Author and Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>by {worksheet.author}</span>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{worksheet.rating}</span>
                        <span>({worksheet.reviews})</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {worksheet.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{worksheet.downloads}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{worksheet.estimatedTime}min</span>
                      </div>
                    </div>
                    <span>{new Date(worksheet.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedWorksheets.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No worksheets found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms or filters</p>
            <Button onClick={() => {
              setSearchTerm('');
              setSubjectFilter('all');
              setLevelFilter('all');
              setTypeFilter('all');
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {sortedWorksheets.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline">
              Load More Worksheets
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
