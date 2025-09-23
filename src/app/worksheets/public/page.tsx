'use client';

import React, { useState, useEffect } from 'react';
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
  Users,
  Clock,
  BookOpen,
  Target,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { publicWorksheetsService, PublicWorksheet } from '../../../lib/services/publicWorksheets';

export default function PublicWorksheetsPage() {
  const [worksheets, setWorksheets] = useState<PublicWorksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load worksheets on component mount and when filters change
  useEffect(() => {
    loadWorksheets();
  }, [searchTerm, subjectFilter, levelFilter, typeFilter, sortBy]);

  const loadWorksheets = async () => {
    setLoading(true);
    try {
      const data = await publicWorksheetsService.getPublicWorksheets({
        searchTerm: searchTerm || undefined,
        subject: subjectFilter !== 'all' ? subjectFilter : undefined,
        level: levelFilter !== 'all' ? levelFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        sortBy: sortBy as any
      });
      setWorksheets(data);
    } catch (error) {
      console.error('Error loading worksheets:', error);
      setWorksheets([]);
    } finally {
      setLoading(false);
    }
  };

  // Since filtering is now handled by the service, we just use the worksheets directly
  const sortedWorksheets = worksheets;

  // Handler functions
  const handleDownload = async (worksheet: PublicWorksheet) => {
    try {
      // TODO: Implement actual download functionality
      // For now, just show an alert
      alert(`Downloading: ${worksheet.title}`);

      // In a real implementation, you would:
      // 1. Generate the worksheet PDF/document
      // 2. Track the download in analytics
      // 3. Increment download count
      console.log('Download worksheet:', worksheet.id);
    } catch (error) {
      console.error('Error downloading worksheet:', error);
      alert('Error downloading worksheet. Please try again.');
    }
  };

  const handlePreview = (worksheet: PublicWorksheet) => {
    // TODO: Implement preview functionality
    // For now, just show an alert
    alert(`Preview: ${worksheet.title}`);

    // In a real implementation, you would:
    // 1. Open a modal with worksheet preview
    // 2. Or navigate to a preview page
    console.log('Preview worksheet:', worksheet.id);
  };

  const handleTitleClick = (worksheet: PublicWorksheet) => {
    // Navigate to worksheet detail page or open preview
    handlePreview(worksheet);
  };

  const handleFavorite = (worksheetId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(worksheetId)) {
        newFavorites.delete(worksheetId);
      } else {
        newFavorites.add(worksheetId);
      }
      return newFavorites;
    });
  };

  const handleTagClick = (tag: string) => {
    // Filter by the clicked tag
    setSearchTerm(tag);
    // Scroll to top to show the search results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            {loading ? 'Loading worksheets...' : `Showing ${sortedWorksheets.length} worksheets`}
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Worksheets Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading worksheets...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedWorksheets.map((worksheet) => (
            <Card key={worksheet.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 hover:from-white hover:to-blue-50 transform hover:-translate-y-1 overflow-hidden">
              <div className="relative">
                {/* Top accent bar with subject color */}
                <div className={`h-1 w-full ${
                  worksheet.subject === 'spanish' ? 'bg-red-500' :
                  worksheet.subject === 'french' ? 'bg-blue-500' :
                  worksheet.subject === 'german' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`} />
                
                <CardHeader className="pb-3 pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle
                        className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-2 mb-3 leading-tight cursor-pointer hover:underline"
                        onClick={() => handleTitleClick(worksheet)}
                      >
                        {worksheet.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary" className={`${getLevelColor(worksheet.difficulty || 'intermediate')} font-medium px-3 py-1 text-xs`}>
                          <Target className="h-3 w-3 mr-1" />
                          {worksheet.difficulty || 'intermediate'}
                        </Badge>
                        <Badge variant="outline" className="bg-white/80 border-gray-300 text-gray-700 font-medium px-3 py-1 text-xs">
                          {getSubjectLabel(worksheet.subject)}
                        </Badge>
                        <Badge variant="outline" className="bg-white/80 border-gray-300 text-gray-700 font-medium px-3 py-1 text-xs">
                          {getTypeLabel(worksheet.template_id || '')}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`transition-all duration-200 rounded-full p-2 flex-shrink-0 ${
                        favorites.has(worksheet.id)
                          ? 'text-red-500 bg-red-50 hover:bg-red-100'
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                      onClick={() => handleFavorite(worksheet.id)}
                    >
                      <Heart className={`h-5 w-5 ${favorites.has(worksheet.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  <CardDescription className="text-gray-600 line-clamp-3 leading-relaxed text-sm">
                    {worksheet.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0 pb-6">
                  <div className="space-y-4">
                    {/* Author */}
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {worksheet.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{worksheet.author}</p>
                        <p className="text-xs text-gray-500">Teacher</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {worksheet.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-1 font-medium cursor-pointer hover:bg-blue-100 hover:border-blue-300 transition-colors"
                          onClick={() => handleTagClick(tag)}
                        >
                          #{tag}
                        </Badge>
                      ))}
                      {worksheet.tags.length > 3 && (
                        <Badge variant="secondary" className="bg-gray-50 text-gray-600 border-gray-200 text-xs px-2 py-1">
                          +{worksheet.tags.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1.5 text-gray-600">
                            <Users className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{worksheet.downloads.toLocaleString()}</span>
                            <span className="text-gray-500">downloads</span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-gray-600">
                            <Clock className="h-4 w-4 text-green-500" />
                            <span className="font-medium">{worksheet.estimatedTime}</span>
                            <span className="text-gray-500">min</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(worksheet.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-sm transition-all duration-200"
                        onClick={() => handleDownload(worksheet)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                        onClick={() => handlePreview(worksheet)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && sortedWorksheets.length === 0 && (
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
        {!loading && sortedWorksheets.length > 0 && (
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
