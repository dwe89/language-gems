'use client';

import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    Plus,
    Trash2,
    Save,
    Clock,
    Edit2,
    Check,
    X,
    Zap,
    HelpCircle,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

interface KaraokeQuestion {
    id?: string;
    video_id: string;
    timestamp_seconds: number;
    question_text: string;
    options: string[];
    correct_answer: string;
    explanation?: string;
    question_type: 'vocabulary' | 'grammar' | 'comprehension';
    is_active: boolean;
    isNew?: boolean;
    isExpanded?: boolean;
}

interface KaraokeQuestionEditorProps {
    videoId: string;
    onUpdate: () => void;
}

export default function KaraokeQuestionEditor({ videoId, onUpdate }: KaraokeQuestionEditorProps) {
    const { supabase } = useSupabase();
    const [questions, setQuestions] = useState<KaraokeQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchQuestions();
    }, [videoId]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('video_karaoke_questions')
                .select('*')
                .eq('video_id', videoId)
                .order('timestamp_seconds', { ascending: true });

            if (error) throw error;

            const formatted = (data || []).map(q => ({
                ...q,
                options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
                isExpanded: false
            }));

            setQuestions(formatted);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const addQuestion = () => {
        const lastTimestamp = questions.length > 0
            ? questions[questions.length - 1].timestamp_seconds + 30
            : 25;

        const newQuestion: KaraokeQuestion = {
            id: `temp-${Date.now()}`,
            video_id: videoId,
            timestamp_seconds: lastTimestamp,
            question_text: '',
            options: ['', '', '', ''],
            correct_answer: '',
            explanation: '',
            question_type: 'vocabulary',
            is_active: true,
            isNew: true,
            isExpanded: true
        };

        setQuestions([...questions, newQuestion]);
    };

    const updateQuestion = (id: string, field: keyof KaraokeQuestion, value: any) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, [field]: value } : q
        ));
    };

    const updateOption = (questionId: string, optionIndex: number, value: string) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                const newOptions = [...q.options];
                newOptions[optionIndex] = value;
                return { ...q, options: newOptions };
            }
            return q;
        }));
    };

    const deleteQuestion = (id: string, isNew?: boolean) => {
        if (isNew) {
            setQuestions(questions.filter(q => q.id !== id));
        } else {
            setPendingDeletes(prev => new Set([...prev, id]));
            setQuestions(questions.filter(q => q.id !== id));
        }
    };

    const toggleExpand = (id: string) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, isExpanded: !q.isExpanded } : q
        ));
    };

    const formatTimestamp = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const parseTimestamp = (input: string): number => {
        if (input.includes(':')) {
            const [mins, secs] = input.split(':').map(Number);
            return mins * 60 + (secs || 0);
        }
        return parseFloat(input) || 0;
    };

    const saveAll = async () => {
        setSaving(true);
        try {
            // Get auth token
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch('/api/admin/video-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    type: 'questions',
                    videoId: videoId,
                    items: questions,
                    deletedIds: Array.from(pendingDeletes)
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save');
            }

            setPendingDeletes(new Set());
            await fetchQuestions();
            onUpdate();
            alert(`Questions saved! ${result.inserted} inserted, ${result.updated} updated, ${result.deleted} deleted.`);
        } catch (error) {
            console.error('Error saving questions:', error);
            alert('Failed to save questions: ' + (error as any)?.message);
        } finally {
            setSaving(false);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'vocabulary': return 'bg-emerald-100 text-emerald-700';
            case 'grammar': return 'bg-purple-100 text-purple-700';
            case 'comprehension': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm">
                        <Zap className="w-3 h-3 mr-1" />
                        {questions.length} questions
                    </Badge>
                    <Badge variant="outline" className="text-sm text-green-600">
                        {questions.filter(q => q.is_active).length} active
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={addQuestion}
                        className="gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Question
                    </Button>
                    <Button
                        onClick={saveAll}
                        disabled={saving}
                        className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save All'}
                    </Button>
                </div>
            </div>

            {/* Questions List */}
            {questions.length === 0 ? (
                <Card className="bg-slate-50 border-2 border-dashed">
                    <CardContent className="py-12 text-center">
                        <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 mb-4">
                            No questions yet. Add questions that will pause the video and quiz the learner.
                        </p>
                        <Button onClick={addQuestion} variant="outline" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add First Question
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {questions.map((question, index) => (
                        <Card
                            key={question.id}
                            className={`transition-all ${question.isNew ? 'border-green-300 bg-green-50/50' : ''
                                } ${!question.is_active ? 'opacity-60' : ''}`}
                        >
                            <CardContent className="py-4 px-5">
                                {/* Collapsed View */}
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleExpand(question.id!)}
                                >
                                    <div className="flex items-center gap-4">
                                        <Badge variant="outline" className="font-mono">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {formatTimestamp(question.timestamp_seconds)}
                                        </Badge>
                                        <Badge className={getTypeColor(question.question_type)}>
                                            {question.question_type}
                                        </Badge>
                                        <span className="font-medium text-slate-700 truncate max-w-md">
                                            {question.question_text || 'Untitled question'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!question.is_active && (
                                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                                                Inactive
                                            </Badge>
                                        )}
                                        {question.isExpanded ? (
                                            <ChevronUp className="w-5 h-5 text-slate-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Edit View */}
                                {question.isExpanded && (
                                    <div className="mt-4 pt-4 border-t space-y-4">
                                        {/* Timestamp & Type Row */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-slate-600 mb-1 block">
                                                    Timestamp
                                                </label>
                                                <Input
                                                    value={formatTimestamp(question.timestamp_seconds)}
                                                    onChange={(e) => updateQuestion(question.id!, 'timestamp_seconds', parseTimestamp(e.target.value))}
                                                    className="font-mono"
                                                    placeholder="0:25"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-slate-600 mb-1 block">
                                                    Question Type
                                                </label>
                                                <Select
                                                    value={question.question_type}
                                                    onValueChange={(v) => updateQuestion(question.id!, 'question_type', v)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="vocabulary">Vocabulary</SelectItem>
                                                        <SelectItem value="grammar">Grammar</SelectItem>
                                                        <SelectItem value="comprehension">Comprehension</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex items-end gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={question.is_active}
                                                        onCheckedChange={(v) => updateQuestion(question.id!, 'is_active', v)}
                                                    />
                                                    <span className="text-sm text-slate-600">Active</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Question Text */}
                                        <div>
                                            <label className="text-sm font-medium text-slate-600 mb-1 block">
                                                Question
                                            </label>
                                            <Input
                                                value={question.question_text}
                                                onChange={(e) => updateQuestion(question.id!, 'question_text', e.target.value)}
                                                placeholder="What does 'palabra' mean?"
                                                className="text-base"
                                            />
                                        </div>

                                        {/* Options */}
                                        <div>
                                            <label className="text-sm font-medium text-slate-600 mb-2 block">
                                                Answer Options (4 required)
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {question.options.map((option, optIndex) => (
                                                    <div key={optIndex} className="relative">
                                                        <Input
                                                            value={option}
                                                            onChange={(e) => updateOption(question.id!, optIndex, e.target.value)}
                                                            placeholder={`Option ${optIndex + 1}`}
                                                            className={option === question.correct_answer && option ? 'border-green-400 bg-green-50' : ''}
                                                        />
                                                        {option && (
                                                            <button
                                                                type="button"
                                                                onClick={() => updateQuestion(question.id!, 'correct_answer', option)}
                                                                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-xs ${option === question.correct_answer
                                                                    ? 'bg-green-500 text-white'
                                                                    : 'bg-slate-200 text-slate-500 hover:bg-green-200'
                                                                    }`}
                                                                title="Set as correct answer"
                                                            >
                                                                <Check className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Click the checkmark to set the correct answer
                                            </p>
                                        </div>

                                        {/* Explanation */}
                                        <div>
                                            <label className="text-sm font-medium text-slate-600 mb-1 block">
                                                Explanation (optional)
                                            </label>
                                            <Textarea
                                                value={question.explanation || ''}
                                                onChange={(e) => updateQuestion(question.id!, 'explanation', e.target.value)}
                                                placeholder="Explanation shown after answering..."
                                                rows={2}
                                            />
                                        </div>

                                        {/* Delete Button */}
                                        <div className="flex justify-end pt-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteQuestion(question.id!, question.isNew);
                                                }}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete Question
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Save Button at Bottom */}
            {questions.length > 0 && (
                <div className="flex justify-end sticky bottom-4">
                    <Button
                        onClick={saveAll}
                        disabled={saving}
                        size="lg"
                        className="gap-2 bg-green-600 hover:bg-green-700 shadow-lg"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : `Save ${questions.filter(q => q.isNew).length > 0 ? `(${questions.filter(q => q.isNew).length} new)` : 'All'}`}
                    </Button>
                </div>
            )}
        </div>
    );
}
