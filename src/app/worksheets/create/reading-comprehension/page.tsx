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
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Wand2,
  BookOpen,
  ArrowLeft,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: string;
  type: 'multiple-choice' | 'short-answer' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[];
  answer: string;
  points: number;
}

export default function ReadingComprehensionPage() {
  const [title, setTitle] = useState('Reading Comprehension Worksheet');
  const [subject, setSubject] = useState('spanish');
  const [level, setLevel] = useState('intermediate');
  const [instructions, setInstructions] = useState('Read the passage carefully and answer the questions that follow.');
  
  const [passage, setPassage] = useState(`La familia García vive en una casa grande en Madrid. Tienen dos hijos: María, que tiene quince años, y Carlos, que tiene doce años. Los padres trabajan en el centro de la ciudad. María estudia en el instituto y le gusta mucho leer libros. Carlos prefiere jugar al fútbol con sus amigos en el parque.

Todos los domingos, la familia va al mercado para comprar comida fresca. A María le gusta ayudar a su madre a cocinar, especialmente los platos tradicionales españoles. Carlos siempre quiere comer paella, su comida favorita.

La familia García es muy unida y les gusta pasar tiempo juntos viendo películas o jugando juegos de mesa.`);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      type: 'multiple-choice',
      question: '¿Cuántos años tiene María?',
      options: ['12 años', '15 años', '18 años', '20 años'],
      answer: '15 años',
      points: 2
    },
    {
      id: '2',
      type: 'short-answer',
      question: '¿Dónde vive la familia García?',
      answer: 'En Madrid',
      points: 2
    }
  ]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      answer: '',
      points: 2
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateQuestionOption = (id: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { 
        ...q, 
        options: q.options?.map((opt, idx) => idx === optionIndex ? value : opt) 
      } : q
    ));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const generateWithAI = async () => {
    // TODO: Implement AI generation
    console.log('Generate with AI');
  };

  const previewWorksheet = () => {
    // TODO: Implement preview
    console.log('Preview worksheet');
  };

  const downloadWorksheet = () => {
    // TODO: Implement download
    console.log('Download worksheet');
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple-choice': return 'Multiple Choice';
      case 'short-answer': return 'Short Answer';
      case 'true-false': return 'True/False';
      case 'fill-blank': return 'Fill in the Blank';
      default: return type;
    }
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

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
                <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Reading Comprehension</h1>
                  <p className="text-gray-600">Create reading passages with comprehension questions</p>
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
                <CardDescription>Configure your reading comprehension worksheet</CardDescription>
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
                  <Label htmlFor="level">Reading Level</Label>
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

            {/* AI Generation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Wand2 className="h-5 w-5 mr-2 text-purple-600" />
                  AI Assistant
                </CardTitle>
                <CardDescription>Generate content automatically</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={generateWithAI} className="w-full" variant="outline">
                  Generate Passage with AI
                </Button>
                <Button onClick={generateWithAI} className="w-full" variant="outline">
                  Generate Questions with AI
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
                  <span className="text-sm text-gray-600">Word Count</span>
                  <Badge variant="secondary">{passage.split(' ').length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Questions</span>
                  <Badge variant="secondary">{questions.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Points</span>
                  <Badge variant="secondary">{totalPoints}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Est. Time</span>
                  <Badge variant="secondary">{Math.max(15, Math.ceil(passage.split(' ').length / 50) * 5 + questions.length * 2)} min</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reading Passage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reading Passage</CardTitle>
                <CardDescription>Enter or paste the text students will read</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={passage}
                  onChange={(e) => setPassage(e.target.value)}
                  placeholder="Enter the reading passage here..."
                  rows={12}
                  className="font-serif text-base leading-relaxed"
                />
                <div className="mt-2 text-sm text-gray-500">
                  {passage.split(' ').length} words • Reading level: {level}
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Comprehension Questions</CardTitle>
                    <CardDescription>Add questions to test understanding</CardDescription>
                  </div>
                  <Button onClick={addQuestion} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <div className="flex items-center space-x-2">
                        <Select 
                          value={question.type} 
                          onValueChange={(value) => updateQuestion(question.id, 'type', value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                            <SelectItem value="short-answer">Short Answer</SelectItem>
                            <SelectItem value="true-false">True/False</SelectItem>
                            <SelectItem value="fill-blank">Fill in Blank</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          value={question.points}
                          onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value) || 1)}
                          className="w-20"
                          min="1"
                          max="10"
                        />
                        <span className="text-sm text-gray-500">pts</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeQuestion(question.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Question</Label>
                      <Textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                        placeholder="Enter your question"
                        rows={2}
                      />
                    </div>

                    {question.type === 'multiple-choice' && (
                      <div>
                        <Label>Answer Options</Label>
                        <div className="space-y-2">
                          {question.options?.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <span className="text-sm font-medium w-6">{String.fromCharCode(65 + optionIndex)}.</span>
                              <Input
                                value={option}
                                onChange={(e) => updateQuestionOption(question.id, optionIndex, e.target.value)}
                                placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <Label>Correct Answer</Label>
                      <Input
                        value={question.answer}
                        onChange={(e) => updateQuestion(question.id, 'answer', e.target.value)}
                        placeholder="Enter the correct answer"
                      />
                    </div>
                  </div>
                ))}

                {questions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No questions yet. Click "Add Question" to get started.</p>
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
