'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  BookOpen,
  Gamepad2,
  Clock,
  Star,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Trophy
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSupabase } from '@/hooks/useSupabase';
import VideoPlayer from '@/components/youtube/VideoPlayer';
import VideoVocabularyGame from '@/components/youtube/VideoVocabularyGame';
import VideoQuizGame from '@/components/youtube/VideoQuizGame';
import VideoGrammarNotes from '@/components/youtube/VideoGrammarNotes';

interface YouTubeVideo {
  id: string;
  title: string;
  youtube_id: string;
  language: string;
  level: string;
  description: string;
  thumbnail_url: string;
  duration_seconds: number;
  vocabulary_count: number;
  transcript?: string;
  transcript_translation?: string;
}

interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  timestamp: number;
  context: string;
}

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const language = params.language as string;
  const videoId = params.id as string;
  
  const [video, setVideo] = useState<YouTubeVideo | null>(null);
  const [vocabularyWords, setVocabularyWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('watch');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { user } = useAuth();
  const { supabase } = useSupabase();

  useEffect(() => {
    if (videoId) {
      fetchVideo();
      fetchVocabulary();
    }
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .eq('id', videoId)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      setVideo(data);
      
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVocabulary = async () => {
    try {
      const { data, error } = await supabase
        .from('video_vocabulary')
        .select(`
          id,
          timestamp_seconds,
          context_text,
          centralized_vocabulary!inner(
            id,
            word,
            translation
          )
        `)
        .eq('video_id', videoId)
        .order('timestamp_seconds', { ascending: true });
      
      if (error) throw error;
      
      const words: VocabularyWord[] = data?.map(item => ({
        id: (item.centralized_vocabulary as any).id,
        word: (item.centralized_vocabulary as any).word,
        translation: (item.centralized_vocabulary as any).translation,
        timestamp: item.timestamp_seconds || 0,
        context: item.context_text || ''
      })) || [];
      
      setVocabularyWords(words);
      
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
    }
  };

  const handleVideoProgress = async (seconds: number, percentage: number) => {
    if (!user || !video) return;

    try {
      await supabase
        .from('video_progress')
        .upsert({
          user_id: user.id,
          video_id: video.id,
          progress_percentage: percentage,
          completed: percentage >= 90,
          last_watched_at: new Date().toISOString(),
          total_watch_time_seconds: seconds
        });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getLevelColor = (level: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading video...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Video not found</h2>
          <p className="text-gray-600 mb-6">The video you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {language.charAt(0).toUpperCase() + language.slice(1)} Songs
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{video.title}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={`${getLevelColor(video.level)}`}>
                  {video.level}
                </Badge>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">{formatDuration(video.duration_seconds)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <BookOpen className="w-4 h-4 mr-1" />
                  <span className="text-sm">{video.vocabulary_count} words</span>
                </div>
              </div>
            </div>
          </div>
          
          {video.description && (
            <p className="text-gray-600 mb-6">{video.description}</p>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="watch">
              <Play className="w-4 h-4 mr-2" />
              Watch
            </TabsTrigger>
            <TabsTrigger value="vocabulary">
              <BookOpen className="w-4 h-4 mr-2" />
              Vocabulary ({vocabularyWords.length})
            </TabsTrigger>
            <TabsTrigger value="quiz">
              <Trophy className="w-4 h-4 mr-2" />
              Quiz
            </TabsTrigger>
            <TabsTrigger value="grammar">
              <BookOpen className="w-4 h-4 mr-2" />
              Grammar
            </TabsTrigger>
            <TabsTrigger value="transcript">
              <Volume2 className="w-4 h-4 mr-2" />
              Transcript
            </TabsTrigger>
          </TabsList>

          <TabsContent value="watch" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                  <VideoPlayer
                    videoId={video.youtube_id}
                    autoplay={false}
                    height="100%"
                    width="100%"
                    onProgress={handleVideoProgress}
                    language={language}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Toggle Audio
                  </Button>
                  <Button variant="outline" size="sm">
                    <Maximize className="w-4 h-4 mr-2" />
                    Fullscreen
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vocabulary" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vocabularyWords.map((word, index) => (
                <motion.div
                  key={word.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{word.word}</h3>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(word.timestamp / 60)}:{(word.timestamp % 60).toString().padStart(2, '0')}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{word.translation}</p>
                      {word.context && (
                        <p className="text-sm text-gray-500 italic">"{word.context}"</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {vocabularyWords.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No vocabulary available</h3>
                <p className="text-gray-600">
                  Vocabulary words haven't been added to this video yet.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="quiz" className="mt-6">
            <VideoQuizGame
              videoId={video.id}
              onComplete={(results) => {
                console.log('Quiz completed:', results);
                // Handle quiz completion - award gems, save progress, etc.
              }}
            />
          </TabsContent>

          <TabsContent value="grammar" className="mt-6">
            <VideoGrammarNotes videoId={video.id} />
          </TabsContent>

          <TabsContent value="transcript" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Video Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                {video.transcript ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Original ({language.toUpperCase()})</h4>
                      <p className="whitespace-pre-wrap">{video.transcript}</p>
                    </div>
                    
                    {video.transcript_translation && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">English Translation</h4>
                        <p className="whitespace-pre-wrap">{video.transcript_translation}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Volume2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Transcript not available</h3>
                    <p className="text-gray-600">
                      The transcript for this video hasn't been added yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href={`/songs/${language}/vocabulary`}>
            <Button variant="outline">
              <BookOpen className="w-4 h-4 mr-2" />
              Practice All Vocabulary
            </Button>
          </Link>
          
          <Link href={`/songs/${language}/games/vocabulary-match`}>
            <Button variant="outline">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Play Vocabulary Games
            </Button>
          </Link>
          
          <Link href={`/songs/${language}`}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              More {language.charAt(0).toUpperCase() + language.slice(1)} Videos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
