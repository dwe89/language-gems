import React, { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit2, Save, X, Music, HelpCircle, Settings } from 'lucide-react';
import LyricEditor from './LyricEditor';
import KaraokeQuestionEditor from './KaraokeQuestionEditor';

interface AdminVideoEditorProps {
    videoId: string; // Database ID
    youtubeId?: string;
    initialData: {
        title: string;
        description: string;
        lyrics: any[];
        questions: any[];
    };
    onUpdate: () => void;
}

export default function AdminVideoEditor({ videoId, youtubeId, initialData, onUpdate }: AdminVideoEditorProps) {
    const { supabase } = useSupabase();
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState(initialData.title);
    const [description, setDescription] = useState(initialData.description);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('details');

    // Basic fields update
    const handleUpdateVideo = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('youtube_videos')
                .update({ title, description })
                .eq('id', videoId);

            if (error) throw error;
            onUpdate();
            alert('Video updated successfully');
        } catch (error) {
            console.error('Error updating video:', error);
            alert('Failed to update video');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)} className="bg-slate-800 text-white gap-2">
                <Edit2 className="w-4 h-4" /> Admin Edit
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto flex items-center justify-center p-4">
            <Card className="w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col bg-white">
                <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50 py-4">
                    <CardTitle className="text-xl">Edit Video Content</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                        <X className="w-5 h-5" />
                    </Button>
                </CardHeader>

                <div className="flex-1 overflow-y-auto">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                        <div className="border-b bg-white px-6 pt-4">
                            <TabsList className="bg-slate-100">
                                <TabsTrigger value="details" className="gap-2 data-[state=active]:bg-white">
                                    <Settings className="w-4 h-4" />
                                    Details
                                </TabsTrigger>
                                <TabsTrigger value="lyrics" className="gap-2 data-[state=active]:bg-white">
                                    <Music className="w-4 h-4" />
                                    Lyrics
                                    {initialData.lyrics.length > 0 && (
                                        <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                            {initialData.lyrics.length}
                                        </span>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="questions" className="gap-2 data-[state=active]:bg-white">
                                    <HelpCircle className="w-4 h-4" />
                                    Karaoke Questions
                                    {initialData.questions.length > 0 && (
                                        <span className="ml-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                            {initialData.questions.length}
                                        </span>
                                    )}
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="p-6">
                            <TabsContent value="details" className="space-y-4 mt-0">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title</label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={10}
                                        className="font-mono text-sm"
                                    />
                                    <p className="text-xs text-slate-500">
                                        Tip: Provide a cleaner, formatted description here to replace the raw YouTube dump.
                                    </p>
                                </div>
                                <Button onClick={handleUpdateVideo} disabled={loading} className="w-full bg-blue-600">
                                    <Save className="w-4 h-4 mr-2" /> Save Details
                                </Button>
                            </TabsContent>

                            <TabsContent value="lyrics" className="mt-0">
                                <LyricEditor
                                    videoId={videoId}
                                    youtubeId={youtubeId || ''}
                                    onUpdate={onUpdate}
                                />
                            </TabsContent>

                            <TabsContent value="questions" className="mt-0">
                                <KaraokeQuestionEditor
                                    videoId={videoId}
                                    onUpdate={onUpdate}
                                />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </Card>
        </div>
    );
}
