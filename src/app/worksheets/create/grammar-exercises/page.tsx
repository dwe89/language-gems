'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Badge } from '../../../../components/ui/badge';
import { 
  Target, 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Wand2,
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

interface GrammarExercise {
  id: string;
  type: 'conjugation' | 'fill-blank' | 'transformation' | 'error-correction' | 'multiple-choice';
  title: string;
  instruction: string;
  content: string;
  answer?: string;
  options?: string[];
  grammarPoint: string;
}

export default function GrammarExercisesPage() {
  const [title, setTitle] = useState('Grammar Practice Worksheet');
  const [subject, setSubject] = useState('spanish');
  const [level, setLevel] = useState('intermediate');
  const [instructions, setInstructions] = useState('Complete the grammar exercises below.');
  
  const [exercises, setExercises] = useState<GrammarExercise[]>([
    {
      id: '1',
      type: 'conjugation',
      title: 'Present Tense Conjugation',
      instruction: 'Conjugate the verb "hablar" in present tense',
      content: 'Yo _____ español todos los días.',
      answer: 'hablo',
      grammarPoint: 'Present Tense - Regular Verbs'
    }
  ]);

  const addExercise = () => {
    const newExercise: GrammarExercise = {
      id: Date.now().toString(),
      type: 'fill-blank',
      title: '',
      instruction: '',
      content: '',
      grammarPoint: ''
    };
    setExercises([...exercises, newExercise]);
  };

  const updateExercise = (id: string, field: keyof GrammarExercise, value: any) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
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
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Grammar Exercises</h1>
                  <p className="text-gray-600">Create targeted grammar practice worksheets</p>
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
                <CardDescription>Configure your grammar worksheet</CardDescription>
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
                  <Label htmlFor="level">Grammar Level</Label>
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
                <CardDescription>Generate exercises automatically</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={generateWithAI} className="w-full" variant="outline">
                  Generate Grammar Exercises
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
                  <span className="text-sm text-gray-600">Exercises</span>
                  <Badge variant="secondary">{exercises.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Est. Time</span>
                  <Badge variant="secondary">{exercises.length * 4} min</Badge>
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
                    <CardTitle className="text-lg">Grammar Exercises</CardTitle>
                    <CardDescription>Add and configure grammar practice exercises</CardDescription>
                  </div>
                  <Button onClick={addExercise} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exercise
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {exercises.map((exercise, index) => (
                  <div key={exercise.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Exercise {index + 1}</h4>
                      <div className="flex items-center space-x-2">
                        <Select 
                          value={exercise.type} 
                          onValueChange={(value) => updateExercise(exercise.id, 'type', value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="conjugation">Conjugation</SelectItem>
                            <SelectItem value="fill-blank">Fill in Blanks</SelectItem>
                            <SelectItem value="transformation">Transformation</SelectItem>
                            <SelectItem value="error-correction">Error Correction</SelectItem>
                            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeExercise(exercise.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Exercise Title</Label>
                        <Input
                          value={exercise.title}
                          onChange={(e) => updateExercise(exercise.id, 'title', e.target.value)}
                          placeholder="Enter exercise title"
                        />
                      </div>
                      <div>
                        <Label>Grammar Point</Label>
                        <Input
                          value={exercise.grammarPoint}
                          onChange={(e) => updateExercise(exercise.id, 'grammarPoint', e.target.value)}
                          placeholder="e.g., Present Tense, Subjunctive"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Instruction</Label>
                      <Input
                        value={exercise.instruction}
                        onChange={(e) => updateExercise(exercise.id, 'instruction', e.target.value)}
                        placeholder="Enter instruction for this exercise"
                      />
                    </div>

                    <div>
                      <Label>Exercise Content</Label>
                      <Textarea
                        value={exercise.content}
                        onChange={(e) => updateExercise(exercise.id, 'content', e.target.value)}
                        placeholder="Enter the exercise content (use _____ for blanks)"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Answer Key</Label>
                      <Input
                        value={exercise.answer || ''}
                        onChange={(e) => updateExercise(exercise.id, 'answer', e.target.value)}
                        placeholder="Enter the correct answer(s)"
                      />
                    </div>
                  </div>
                ))}

                {exercises.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No exercises yet. Click "Add Exercise" to get started.</p>
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
