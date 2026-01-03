'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Trash2,
    Save,
    Clock,
    GripVertical,
    Play,
    Pause,
    FileText,
    Upload,
    RefreshCw,
    ChevronRight,
    Timer,
    Target
} from 'lucide-react';
import VideoPlayer, { VideoPlayerHandle } from '@/components/youtube/VideoPlayer';

interface LyricLine {
    id?: string;
    video_id: string;
    timestamp_seconds: number;
    end_timestamp_seconds?: number | null;
    text: string;
    translation?: string;
    isNew?: boolean;
}

interface LyricEditorProps {
    videoId: string;
    youtubeId: string;
    onUpdate: () => void;
}

export default function LyricEditor({ videoId, youtubeId, onUpdate }: LyricEditorProps) {
    const { supabase } = useSupabase();
    const playerRef = useRef<VideoPlayerHandle>(null);

    const [lyrics, setLyrics] = useState<LyricLine[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [bulkInput, setBulkInput] = useState('');
    const [showBulkImport, setShowBulkImport] = useState(false);
    const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());

    // Live timing mode
    const [timingMode, setTimingMode] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [timingIndex, setTimingIndex] = useState(0);
    const [linesForTiming, setLinesForTiming] = useState<string[]>([]);

    // Fetch lyrics
    useEffect(() => {
        fetchLyrics();
    }, [videoId]);

    const fetchLyrics = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('video_lyrics')
                .select('*')
                .eq('video_id', videoId)
                .order('timestamp_seconds', { ascending: true });

            if (error) throw error;

            setLyrics(data || []);
        } catch (error) {
            console.error('Error fetching lyrics:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle progress for timing mode
    const handleProgress = useCallback((seconds: number, _percentage: number) => {
        setCurrentTime(seconds);
    }, []);

    // Add new lyric line
    const addLyricLine = () => {
        const lastTimestamp = lyrics.length > 0
            ? lyrics[lyrics.length - 1].timestamp_seconds + 5
            : 0;

        const newLyric: LyricLine = {
            id: `temp-${Date.now()}`,
            video_id: videoId,
            timestamp_seconds: lastTimestamp,
            text: '',
            translation: '',
            isNew: true
        };

        setLyrics([...lyrics, newLyric]);
    };

    // Update lyric line
    const updateLyric = (id: string, field: keyof LyricLine, value: any) => {
        setLyrics(lyrics.map(l =>
            l.id === id ? { ...l, [field]: value } : l
        ));
    };

    // Delete lyric line
    const deleteLyric = (id: string, isNew?: boolean) => {
        if (isNew) {
            setLyrics(lyrics.filter(l => l.id !== id));
        } else {
            setPendingDeletes(prev => new Set([...prev, id]));
            setLyrics(lyrics.filter(l => l.id !== id));
        }
    };

    // Format timestamp for display
    const formatTimestamp = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = (seconds % 60).toFixed(1);
        return `${mins}:${secs.padStart(4, '0')}`;
    };

    // Parse timestamp from input
    const parseTimestamp = (input: string): number => {
        if (input.includes(':')) {
            const parts = input.split(':');
            const mins = parseInt(parts[0]) || 0;
            const secs = parseFloat(parts[1]) || 0;
            return mins * 60 + secs;
        }
        return parseFloat(input) || 0;
    };

    // Enter timing mode - paste lyrics and capture timestamps live
    const startTimingMode = () => {
        if (!bulkInput.trim()) {
            alert('Please paste lyrics first, then enter timing mode');
            return;
        }

        const lines = bulkInput.split('\n').filter(line => line.trim());
        setLinesForTiming(lines);
        setTimingIndex(0);
        setTimingMode(true);

        // Start video from beginning
        playerRef.current?.seekTo(0);
        playerRef.current?.playVideo();
    };

    // Capture timestamp for current line
    const captureTimestamp = () => {
        if (timingIndex >= linesForTiming.length) return;

        const newLyric: LyricLine = {
            id: `temp-${Date.now()}-${timingIndex}`,
            video_id: videoId,
            timestamp_seconds: Math.round(currentTime * 10) / 10, // Round to 1 decimal
            text: linesForTiming[timingIndex],
            isNew: true
        };

        setLyrics(prev => [...prev, newLyric]);
        setTimingIndex(prev => prev + 1);

        // Check if done
        if (timingIndex + 1 >= linesForTiming.length) {
            setTimingMode(false);
            setBulkInput('');
            playerRef.current?.pauseVideo();
        }
    };

    // Exit timing mode
    const exitTimingMode = () => {
        setTimingMode(false);
        setLinesForTiming([]);
        setTimingIndex(0);
        playerRef.current?.pauseVideo();
    };

    // Bulk import lyrics with timestamps
    const handleBulkImport = () => {
        if (!bulkInput.trim()) return;

        const lines = bulkInput.split('\n').filter(line => line.trim());
        const parsed: LyricLine[] = [];
        let currentTimestamp = 0;

        lines.forEach((line, index) => {
            // Try to parse timestamp at start: [0:23] or (0:23.5) or 0:23 -
            const timestampMatch = line.match(/^[\[(]?(\d+:\d+(?:\.\d+)?|\d+(?:\.\d+)?)[\])]?\s*[-:]?\s*/);

            if (timestampMatch) {
                currentTimestamp = parseTimestamp(timestampMatch[1]);
                const text = line.replace(timestampMatch[0], '').trim();

                if (text) {
                    parsed.push({
                        id: `temp-${Date.now()}-${index}`,
                        video_id: videoId,
                        timestamp_seconds: currentTimestamp,
                        text: text,
                        isNew: true
                    });
                }
            } else if (line.trim()) {
                // No timestamp, auto-increment by 3 seconds
                parsed.push({
                    id: `temp-${Date.now()}-${index}`,
                    video_id: videoId,
                    timestamp_seconds: currentTimestamp,
                    text: line.trim(),
                    isNew: true
                });
                currentTimestamp += 3;
            }
        });

        setLyrics([...lyrics, ...parsed]);
        setBulkInput('');
        setShowBulkImport(false);
    };

    // Save all changes via API route (bypasses RLS)
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
                    type: 'lyrics',
                    videoId: videoId,
                    items: lyrics,
                    deletedIds: Array.from(pendingDeletes)
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save');
            }

            setPendingDeletes(new Set());
            await fetchLyrics();
            onUpdate();
            alert(`Lyrics saved! ${result.inserted} inserted, ${result.updated} updated, ${result.deleted} deleted.`);
        } catch (error) {
            console.error('Error saving lyrics:', error);
            alert('Failed to save lyrics: ' + (error as any)?.message);
        } finally {
            setSaving(false);
        }
    };

    // Seek to lyric timestamp
    const seekToLyric = (timestamp: number) => {
        playerRef.current?.seekTo(timestamp);
        playerRef.current?.playVideo();
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
            {/* Video Preview Panel */}
            <Card className="bg-slate-900">
                <CardContent className="p-4">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden max-w-2xl mx-auto">
                        <VideoPlayer
                            ref={playerRef}
                            videoId={youtubeId}
                            autoplay={false}
                            onProgress={handleProgress}
                            width="100%"
                            height="100%"
                        />
                    </div>
                    <div className="text-center mt-3 text-white text-lg font-mono">
                        Current: {formatTimestamp(currentTime)}
                    </div>
                </CardContent>
            </Card>

            {/* Timing Mode Overlay */}
            {timingMode && (
                <Card className="border-2 border-yellow-400 bg-yellow-50">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Timer className="w-5 h-5 text-yellow-600" />
                                Live Timing Mode - Press SPACE or Click to capture
                            </CardTitle>
                            <Button variant="outline" size="sm" onClick={exitTimingMode}>
                                Exit
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center space-y-4">
                            <Badge className="text-lg px-4 py-2 bg-yellow-500">
                                {timingIndex + 1} / {linesForTiming.length}
                            </Badge>

                            {/* Current line to capture */}
                            <div className="p-6 bg-white rounded-xl shadow-lg border-2 border-yellow-400">
                                <p className="text-2xl font-bold text-slate-800">
                                    {linesForTiming[timingIndex] || 'Done!'}
                                </p>
                            </div>

                            {/* Next lines preview */}
                            <div className="text-slate-500 space-y-1">
                                {linesForTiming.slice(timingIndex + 1, timingIndex + 4).map((line, i) => (
                                    <p key={i} className="text-sm opacity-50">{line}</p>
                                ))}
                            </div>

                            <Button
                                size="lg"
                                onClick={captureTimestamp}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-xl px-12 py-6"
                            >
                                <Target className="w-6 h-6 mr-2" />
                                CAPTURE at {formatTimestamp(currentTime)}
                            </Button>

                            <p className="text-sm text-slate-500">
                                Tip: Press spacebar or click the button when you hear this line
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Header Actions */}
            {!timingMode && (
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm">
                            {lyrics.length} lines
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowBulkImport(!showBulkImport)}
                            className="gap-2"
                        >
                            <Upload className="w-4 h-4" />
                            Bulk Import
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addLyricLine}
                            className="gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Line
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
            )}

            {/* Bulk Import Panel */}
            {showBulkImport && !timingMode && (
                <Card className="border-2 border-dashed border-purple-300 bg-purple-50/50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Import Lyrics</CardTitle>
                        <p className="text-sm text-slate-500">
                            Option 1: Paste lyrics with timestamps like <code>[0:23]</code> or <code>0:23.5 -</code><br />
                            Option 2: Paste raw lyrics and use <strong>Live Timing Mode</strong> to sync them
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Janvier&#10;Février&#10;Mars&#10;Avril&#10;..."
                            value={bulkInput}
                            onChange={(e) => setBulkInput(e.target.value)}
                            rows={10}
                            className="font-mono text-sm"
                        />
                        <div className="flex gap-2">
                            <Button onClick={handleBulkImport} className="bg-purple-600 hover:bg-purple-700">
                                <FileText className="w-4 h-4 mr-2" />
                                Import with Timestamps
                            </Button>
                            <Button
                                onClick={startTimingMode}
                                className="bg-yellow-500 hover:bg-yellow-600"
                            >
                                <Timer className="w-4 h-4 mr-2" />
                                Live Timing Mode
                            </Button>
                            <Button variant="outline" onClick={() => setShowBulkImport(false)}>
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Lyrics List */}
            {!timingMode && (
                <>
                    {lyrics.length === 0 ? (
                        <Card className="bg-slate-50 border-2 border-dashed">
                            <CardContent className="py-12 text-center">
                                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 mb-4">No lyrics yet. Add lyrics to enable karaoke mode.</p>
                                <div className="flex justify-center gap-2">
                                    <Button onClick={addLyricLine} variant="outline" className="gap-2">
                                        <Plus className="w-4 h-4" />
                                        Add Line
                                    </Button>
                                    <Button onClick={() => setShowBulkImport(true)} variant="outline" className="gap-2">
                                        <Upload className="w-4 h-4" />
                                        Bulk Import
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-2">
                            {lyrics.map((lyric, index) => (
                                <Card
                                    key={lyric.id}
                                    className={`transition-all hover:shadow-md ${lyric.isNew ? 'border-green-300 bg-green-50/50' : ''
                                        }`}
                                >
                                    <CardContent className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            {/* Index & Play */}
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs font-mono text-slate-400 w-6">{index + 1}</span>
                                                <button
                                                    onClick={() => seekToLyric(lyric.timestamp_seconds)}
                                                    className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-blue-600"
                                                    title="Preview from here"
                                                >
                                                    <Play className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Timestamp */}
                                            <div className="w-20">
                                                <Input
                                                    value={formatTimestamp(lyric.timestamp_seconds)}
                                                    onChange={(e) => {
                                                        const seconds = parseTimestamp(e.target.value);
                                                        updateLyric(lyric.id!, 'timestamp_seconds', seconds);
                                                    }}
                                                    className="text-center font-mono text-sm h-8"
                                                    placeholder="0:00"
                                                />
                                            </div>

                                            {/* Set to current time button */}
                                            <button
                                                onClick={() => updateLyric(lyric.id!, 'timestamp_seconds', Math.round(currentTime * 10) / 10)}
                                                className="p-1 hover:bg-blue-100 rounded text-slate-400 hover:text-blue-600"
                                                title="Set to current video time"
                                            >
                                                <Target className="w-4 h-4" />
                                            </button>

                                            {/* Lyric Text */}
                                            <div className="flex-1">
                                                <Input
                                                    value={lyric.text}
                                                    onChange={(e) => updateLyric(lyric.id!, 'text', e.target.value)}
                                                    placeholder="Lyric text..."
                                                    className="text-base h-8"
                                                />
                                            </div>

                                            {/* Translation */}
                                            <div className="w-48">
                                                <Input
                                                    value={lyric.translation || ''}
                                                    onChange={(e) => updateLyric(lyric.id!, 'translation', e.target.value)}
                                                    placeholder="Translation..."
                                                    className="text-sm text-slate-500 h-8"
                                                />
                                            </div>

                                            {/* Delete */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => deleteLyric(lyric.id!, lyric.isNew)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Save Button at Bottom */}
                    {lyrics.length > 0 && (
                        <div className="flex justify-end sticky bottom-4">
                            <Button
                                onClick={saveAll}
                                disabled={saving}
                                size="lg"
                                className="gap-2 bg-green-600 hover:bg-green-700 shadow-lg"
                            >
                                <Save className="w-5 h-5" />
                                {saving ? 'Saving...' : `Save ${lyrics.filter(l => l.isNew).length > 0 ? `(${lyrics.filter(l => l.isNew).length} new)` : 'All'}`}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
