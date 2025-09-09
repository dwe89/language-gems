'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Badge } from '../../../../components/ui/badge';
import { Checkbox } from '../../../../components/ui/checkbox';
import { 
  Grid3X3, 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Wand2,
  ArrowLeft,
  Layers
} from 'lucide-react';
import Link from 'next/link';

interface WorksheetSection {
  id: string;
  type: 'vocabulary' | 'grammar' | 'reading' | 'writing' | 'listening';
  title: string;
  content: any;
  enabled: boolean;
  order: number;
}

export default function MixedPracticePage() {
  const [title, setTitle] = useState('Mixed Practice Worksheet');
  const [subject, setSubject] = useState('spanish');
  const [level, setLevel] = useState('intermediate');
  const [instructions, setInstructions] = useState('Complete all sections of this comprehensive practice worksheet.');
  
  const [sections, setSections] = useState<WorksheetSection[]>([
    {
      id: '1',
      type: 'vocabulary',
      title: 'Vocabulary Practice',
      content: { words: [], exerciseType: 'matching' },
      enabled: true,
      order: 1
    },
    {
      id: '2',
      type: 'grammar',
      title: 'Grammar Exercises',
      content: { exercises: [], grammarPoint: '' },
      enabled: true,
      order: 2
    },
    {
      id: '3',
      type: 'reading',
      title: 'Reading Comprehension',
      content: { passage: '', questions: [] },
      enabled: false,
      order: 3
    }
  ]);

  const addSection = () => {
    const newSection: WorksheetSection = {
      id: Date.now().toString(),
      type: 'vocabulary',
      title: '',
      content: {},
      enabled: true,
      order: sections.length + 1
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (id: string, field: keyof WorksheetSection, value: any) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const toggleSection = (id: string, enabled: boolean) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, enabled } : s
    ));
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const sectionIndex = sections.findIndex(s => s.id === id);
    if (sectionIndex === -1) return;

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < sections.length) {
      [newSections[sectionIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[sectionIndex]];
      setSections(newSections);
    }
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

  const getSectionTypeLabel = (type: string) => {
    switch (type) {
      case 'vocabulary': return 'Vocabulary Practice';
      case 'grammar': return 'Grammar Exercises';
      case 'reading': return 'Reading Comprehension';
      case 'writing': return 'Writing Practice';
      case 'listening': return 'Listening Comprehension';
      default: return type;
    }
  };

  const enabledSections = sections.filter(s => s.enabled);

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
                <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                  <Grid3X3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Mixed Practice</h1>
                  <p className="text-gray-600">Combine multiple exercise types in one worksheet</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={previewWorksheet}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={downloadWorksheet}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Worksheet Settings</CardTitle>
                <CardDescription>Configure your mixed practice worksheet</CardDescription>
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
                  <Label htmlFor="level">Difficulty Level</Label>
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
                <CardDescription>Generate comprehensive content</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={generateWithAI} className="w-full" variant="outline">
                  Generate Mixed Worksheet
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
                  <span className="text-sm text-gray-600">Total Sections</span>
                  <Badge variant="secondary">{sections.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Enabled Sections</span>
                  <Badge variant="secondary">{enabledSections.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Est. Time</span>
                  <Badge variant="secondary">{enabledSections.length * 15} min</Badge>
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
                    <CardTitle className="text-lg">Worksheet Sections</CardTitle>
                    <CardDescription>Configure the sections to include in your worksheet</CardDescription>
                  </div>
                  <Button onClick={addSection} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {sections.map((section, index) => (
                  <div key={section.id} className={`border rounded-lg p-4 space-y-4 ${!section.enabled ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={section.enabled}
                          onCheckedChange={(checked) => toggleSection(section.id, checked as boolean)}
                        />
                        <h4 className="font-medium">Section {index + 1}</h4>
                        <Badge variant="outline">{getSectionTypeLabel(section.type)}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => moveSection(section.id, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => moveSection(section.id, 'down')}
                          disabled={index === sections.length - 1}
                        >
                          ↓
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeSection(section.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Section Type</Label>
                        <Select 
                          value={section.type} 
                          onValueChange={(value) => updateSection(section.id, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vocabulary">Vocabulary Practice</SelectItem>
                            <SelectItem value="grammar">Grammar Exercises</SelectItem>
                            <SelectItem value="reading">Reading Comprehension</SelectItem>
                            <SelectItem value="writing">Writing Practice</SelectItem>
                            <SelectItem value="listening">Listening Comprehension</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Section Title</Label>
                        <Input
                          value={section.title}
                          onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                          placeholder="Enter section title"
                        />
                      </div>
                    </div>

                    {section.enabled && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 mb-2">Section Configuration:</p>
                        <div className="text-xs text-gray-500">
                          Configure the specific content for this {getSectionTypeLabel(section.type).toLowerCase()} section.
                          This would include detailed settings based on the section type.
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          Configure Section
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {sections.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Layers className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No sections yet. Click "Add Section" to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Worksheet Preview</CardTitle>
                <CardDescription>Preview of your mixed practice worksheet structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {enabledSections.map((section, index) => (
                    <div key={section.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500">
                          {index + 1}.
                        </span>
                        <span className="font-medium">
                          {section.title || getSectionTypeLabel(section.type)}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getSectionTypeLabel(section.type)}
                      </Badge>
                    </div>
                  ))}
                  
                  {enabledSections.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No sections enabled. Enable sections to see preview.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
