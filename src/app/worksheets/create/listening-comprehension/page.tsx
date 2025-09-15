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
  Volume2, 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Wand2,
  Upload,
  Play,
  Pause,
  ArrowLeft,
  Mic
} from 'lucide-react';
import Link from 'next/link';

interface AudioSegment {
  id: string;
  title: string;
  transcript: string;
  audioUrl?: string;
  duration?: number;
  questions: Question[];
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'short-answer' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[];
  answer: string;
  timestamp?: number; // When in audio this question relates to
}

export default function ListeningComprehensionPage() {
  const [title, setTitle] = useState('Listening Comprehension Worksheet');
  const [subject, setSubject] = useState('spanish');
  const [level, setLevel] = useState('intermediate');
  const [instructions, setInstructions] = useState('Listen to the audio carefully and answer the questions that follow.');
  
  const [audioSegments, setAudioSegments] = useState<AudioSegment[]>([
    {
      id: '1',
      title: 'Conversation at a Restaurant',
      transcript: 'Camarero: ¡Buenas tardes! ¿Qué desean tomar?\nCliente: Hola, queremos ver la carta, por favor.\nCamarero: Por supuesto, aquí tienen. ¿Algo para beber?\nCliente: Dos aguas, por favor.',
      questions: [
        {
          id: '1',
          type: 'multiple-choice',
          question: '¿Dónde tiene lugar esta conversación?',
          options: ['En casa', 'En un restaurante', 'En una tienda', 'En el parque'],
          answer: 'En un restaurante',
          timestamp: 0
        }
      ]
    }
  ]);

  const addAudioSegment = () => {
    const newSegment: AudioSegment = {
      id: Date.now().toString(),
      title: '',
      transcript: '',
      questions: []
    };
    setAudioSegments([...audioSegments, newSegment]);
  };

  const updateSegment = (id: string, field: keyof AudioSegment, value: any) => {
    setAudioSegments(segments => 
      segments.map(seg => 
        seg.id === id ? { ...seg, [field]: value } : seg
      )
    );
  };

  const removeSegment = (id: string) => {
    setAudioSegments(segments => segments.filter(seg => seg.id !== id));
  };

  const addQuestion = (segmentId: string) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      answer: ''
    };
    
    setAudioSegments(segments =>
      segments.map(seg =>
        seg.id === segmentId 
          ? { ...seg, questions: [...seg.questions, newQuestion] }
          : seg
      )
    );
  };

  const updateQuestion = (segmentId: string, questionId: string, field: keyof Question, value: any) => {
    setAudioSegments(segments =>
      segments.map(seg =>
        seg.id === segmentId
          ? {
              ...seg,
              questions: seg.questions.map(q =>
                q.id === questionId ? { ...q, [field]: value } : q
              )
            }
          : seg
      )
    );
  };

  const removeQuestion = (segmentId: string, questionId: string) => {
    setAudioSegments(segments =>
      segments.map(seg =>
        seg.id === segmentId
          ? { ...seg, questions: seg.questions.filter(q => q.id !== questionId) }
          : seg
      )
    );
  };

  const generateWithAI = async () => {
    // TODO: Implement AI generation
    console.log('Generate with AI');
  };

  const uploadAudio = () => {
    // TODO: Implement audio upload
    console.log('Upload audio');
  };

  const generateAudio = () => {
    // TODO: Implement text-to-speech
    console.log('Generate audio from transcript');
  };

  const previewWorksheet = () => {
    // TODO: Implement preview
    console.log('Preview worksheet');
  };

  const downloadWorksheet = () => {
    // TODO: Implement download
    console.log('Download worksheet');
  };

  const totalQuestions = audioSegments.reduce((sum, seg) => sum + seg.questions.length, 0);

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
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Listening Comprehension Creator
            </h1>
            <p className="text-slate-600 text-lg flex items-center gap-2">
              Create audio-based comprehension exercises
              <Volume2 className="h-5 w-5 text-purple-500" />
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Worksheet Settings</CardTitle>
                <CardDescription>Configure your listening comprehension worksheet</CardDescription>
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
                  <Label htmlFor="level">Listening Level</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (A1-A2)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (B1-B2)</SelectItem>
                      <SelectItem value="advanced">Advanced (C1-C2)</SelectItem>
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

            {/* Audio Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Mic className="h-5 w-5 mr-2 text-indigo-600" />
                  Audio Tools
                </CardTitle>
                <CardDescription>Upload or generate audio content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={uploadAudio} className="w-full" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Audio File
                </Button>
                <Button onClick={generateAudio} className="w-full" variant="outline">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Generate from Text
                </Button>
              </CardContent>
            </Card>

            {/* AI Generation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Wand2 className="h-5 w-5 mr-2 text-purple-600" />
                  AI Assistant
                </CardTitle>
                <CardDescription>Generate content automatically</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={generateWithAI} className="w-full" variant="outline">
                  Generate Listening Exercise
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
                  <span className="text-sm text-gray-600">Audio Segments</span>
                  <Badge variant="secondary">{audioSegments.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Questions</span>
                  <Badge variant="secondary">{totalQuestions}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Est. Time</span>
                  <Badge variant="secondary">{Math.max(20, totalQuestions * 3)} min</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Audio Segments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Audio Segments</CardTitle>
                    <CardDescription>Add audio content and related questions</CardDescription>
                  </div>
                  <Button onClick={addAudioSegment} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Segment
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {audioSegments.map((segment, segmentIndex) => (
                  <div key={segment.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Audio Segment {segmentIndex + 1}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeSegment(segment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div>
                      <Label>Segment Title</Label>
                      <Input
                        value={segment.title}
                        onChange={(e) => updateSegment(segment.id, 'title', e.target.value)}
                        placeholder="Enter segment title"
                      />
                    </div>

                    <div>
                      <Label>Transcript</Label>
                      <Textarea
                        value={segment.transcript}
                        onChange={(e) => updateSegment(segment.id, 'transcript', e.target.value)}
                        placeholder="Enter the transcript of the audio"
                        rows={4}
                        className="font-mono text-sm"
                      />
                    </div>

                    {/* Audio Player Placeholder */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-indigo-500 h-2 rounded-full w-0"></div>
                        </div>
                        <span className="text-sm text-gray-500">0:00 / 0:00</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {segment.audioUrl ? 'Audio loaded' : 'No audio file uploaded'}
                      </p>
                    </div>

                    {/* Questions for this segment */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base">Questions ({segment.questions.length})</Label>
                        <Button 
                          onClick={() => addQuestion(segment.id)} 
                          size="sm" 
                          variant="outline"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </div>

                      {segment.questions.map((question, questionIndex) => (
                        <div key={question.id} className="bg-gray-50 rounded-lg p-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Question {questionIndex + 1}</span>
                            <div className="flex items-center space-x-2">
                              <Select 
                                value={question.type} 
                                onValueChange={(value) => updateQuestion(segment.id, question.id, 'type', value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                  <SelectItem value="short-answer">Short Answer</SelectItem>
                                  <SelectItem value="true-false">True/False</SelectItem>
                                  <SelectItem value="fill-blank">Fill Blank</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeQuestion(segment.id, question.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <Input
                            value={question.question}
                            onChange={(e) => updateQuestion(segment.id, question.id, 'question', e.target.value)}
                            placeholder="Enter question"
                          />

                          {question.type === 'multiple-choice' && (
                            <div className="grid grid-cols-2 gap-2">
                              {question.options?.map((option, optionIndex) => (
                                <Input
                                  key={optionIndex}
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...(question.options || [])];
                                    newOptions[optionIndex] = e.target.value;
                                    updateQuestion(segment.id, question.id, 'options', newOptions);
                                  }}
                                  placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                  className="text-sm"
                                />
                              ))}
                            </div>
                          )}

                          <Input
                            value={question.answer}
                            onChange={(e) => updateQuestion(segment.id, question.id, 'answer', e.target.value)}
                            placeholder="Correct answer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {audioSegments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Volume2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No audio segments yet. Click "Add Segment" to get started.</p>
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
