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
  Search, 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Wand2,
  Grid3X3,
  ArrowLeft,
  Shuffle
} from 'lucide-react';
import Link from 'next/link';

interface WordSearchSettings {
  gridSize: number;
  directions: {
    horizontal: boolean;
    vertical: boolean;
    diagonal: boolean;
    backwards: boolean;
  };
  showWordList: boolean;
  theme: string;
}

export default function WordSearchPage() {
  const [title, setTitle] = useState('Word Search Puzzle');
  const [subject, setSubject] = useState('spanish');
  const [level, setLevel] = useState('intermediate');
  const [instructions, setInstructions] = useState('Find all the hidden words in the puzzle below.');
  
  const [words, setWords] = useState<string[]>([
    'CASA', 'PERRO', 'GATO', 'AGUA', 'COMIDA', 'FAMILIA', 'ESCUELA', 'LIBRO'
  ]);
  
  const [newWord, setNewWord] = useState('');
  
  const [settings, setSettings] = useState<WordSearchSettings>({
    gridSize: 15,
    directions: {
      horizontal: true,
      vertical: true,
      diagonal: true,
      backwards: false
    },
    showWordList: true,
    theme: 'standard'
  });

  const addWord = () => {
    if (newWord.trim() && !words.includes(newWord.toUpperCase())) {
      setWords([...words, newWord.toUpperCase().trim()]);
      setNewWord('');
    }
  };

  const removeWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const generateWithAI = async () => {
    // TODO: Implement AI generation
    console.log('Generate with AI');
  };

  const generatePuzzle = () => {
    // TODO: Implement puzzle generation
    console.log('Generate puzzle');
  };

  const previewWorksheet = () => {
    // TODO: Implement preview
    console.log('Preview worksheet');
  };

  const downloadWorksheet = () => {
    // TODO: Implement download
    console.log('Download worksheet');
  };

  const updateDirection = (direction: keyof typeof settings.directions, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      directions: { ...prev.directions, [direction]: checked }
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addWord();
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
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Word Search Generator</h1>
                  <p className="text-gray-600">Create word search puzzles for vocabulary practice</p>
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
                <CardTitle className="text-lg">Puzzle Settings</CardTitle>
                <CardDescription>Configure your word search puzzle</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Puzzle Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter puzzle title"
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
                  <Label htmlFor="gridSize">Grid Size</Label>
                  <Select 
                    value={settings.gridSize.toString()} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, gridSize: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10x10 (Small)</SelectItem>
                      <SelectItem value="15">15x15 (Medium)</SelectItem>
                      <SelectItem value="20">20x20 (Large)</SelectItem>
                      <SelectItem value="25">25x25 (Extra Large)</SelectItem>
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

            {/* Word Directions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Word Directions</CardTitle>
                <CardDescription>Choose how words can be placed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="horizontal"
                    checked={settings.directions.horizontal}
                    onCheckedChange={(checked) => updateDirection('horizontal', checked as boolean)}
                  />
                  <Label htmlFor="horizontal">Horizontal →</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vertical"
                    checked={settings.directions.vertical}
                    onCheckedChange={(checked) => updateDirection('vertical', checked as boolean)}
                  />
                  <Label htmlFor="vertical">Vertical ↓</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="diagonal"
                    checked={settings.directions.diagonal}
                    onCheckedChange={(checked) => updateDirection('diagonal', checked as boolean)}
                  />
                  <Label htmlFor="diagonal">Diagonal ↘</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="backwards"
                    checked={settings.directions.backwards}
                    onCheckedChange={(checked) => updateDirection('backwards', checked as boolean)}
                  />
                  <Label htmlFor="backwards">Backwards ←</Label>
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
                <CardDescription>Generate words automatically</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={generateWithAI} className="w-full" variant="outline">
                  Generate Words with AI
                </Button>
                <Button onClick={generatePuzzle} className="w-full">
                  <Shuffle className="h-4 w-4 mr-2" />
                  Generate Puzzle
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puzzle Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Words</span>
                  <Badge variant="secondary">{words.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Grid Size</span>
                  <Badge variant="secondary">{settings.gridSize}×{settings.gridSize}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Directions</span>
                  <Badge variant="secondary">{Object.values(settings.directions).filter(Boolean).length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Est. Time</span>
                  <Badge variant="secondary">{Math.max(5, words.length * 2)} min</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Word List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Word List</CardTitle>
                    <CardDescription>Add words to include in your puzzle</CardDescription>
                  </div>
                  <Badge variant="outline">{words.length} words</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Word Input */}
                <div className="flex space-x-2">
                  <Input
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter a word"
                    className="flex-1"
                  />
                  <Button onClick={addWord} disabled={!newWord.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                {/* Word Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {words.map((word, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                      <span className="font-mono text-sm">{word}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeWord(index)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                {words.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Grid3X3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No words added yet. Enter words above to build your puzzle.</p>
                  </div>
                )}

                {words.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Tips for Better Puzzles:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Use 8-15 words for optimal difficulty</li>
                      <li>• Mix short (3-5 letters) and long (6-10 letters) words</li>
                      <li>• Choose words with common letters for better placement</li>
                      <li>• Avoid very similar words that might confuse students</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Puzzle Preview Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Puzzle Preview</CardTitle>
                <CardDescription>Click "Generate Puzzle" to see your word search</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Grid3X3 className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">Puzzle Preview</p>
                    <p className="text-sm">Generate your puzzle to see the grid here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
