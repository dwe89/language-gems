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
  Minimize,
  Trophy,
  Mic,
  Crown,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSupabase } from '@/hooks/useSupabase';
import VideoPlayer from '@/components/youtube/VideoPlayer';

import VideoQuizGame from '@/components/youtube/VideoQuizGame';
import VideoGrammarNotes from '@/components/youtube/VideoGrammarNotes';
import LyricsTrainingPlayer, { LyricLine, KaraokeQuestion } from '@/components/youtube/LyricsTrainingPlayer';
import QuestionModePlayer from '@/components/youtube/QuestionModePlayer';
import AdminVideoEditor from '@/components/admin/AdminVideoEditor';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

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
  const searchParams = useSearchParams();
  const language = params.language as string;
  const videoId = params.id as string;

  const [video, setVideo] = useState<YouTubeVideo | null>(null);
  const [vocabularyWords, setVocabularyWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('watch');
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [karaokeQuestions, setKaraokeQuestions] = useState<KaraokeQuestion[]>([]);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const { user, isAdmin } = useAuth();
  const { supabase } = useSupabase();

  // Check if user has Learner+ tier for karaoke access
  const userTier = user?.user_metadata?.plan || 'free';
  const hasKaraokeAccess = isAdmin || ['learner', 'student', 'pro'].includes(userTier);

  // Handle tab from URL parameter (for shareable links)
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam && ['watch', 'karaoke', 'questions', 'vocabulary', 'quiz', 'grammar', 'transcript'].includes(tabParam)) {
      // For questions tab, only switch if questions are loaded and user has access
      if (tabParam === 'questions') {
        // Will be handled after questions load
        return;
      }
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Auto-switch to questions tab when questions load and URL tab param is 'questions'
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam === 'questions' && karaokeQuestions.length > 0 && hasKaraokeAccess) {
      setActiveTab('questions');
    }
  }, [searchParams, karaokeQuestions, hasKaraokeAccess]);

  useEffect(() => {
    if (videoId) {
      fetchVideo();
      fetchVocabulary();
      fetchLyrics();
      fetchKaraokeQuestions();
    }
  }, [videoId]);

  const fetchLyrics = async () => {
    try {
      const { data, error } = await supabase
        .from('video_lyrics')
        .select('*')
        .eq('video_id', videoId)
        .order('timestamp_seconds', { ascending: true });

      if (error) throw error;

      const formattedLyrics: LyricLine[] = (data || []).map((line: any) => ({
        id: line.id,
        timestamp: line.timestamp_seconds,
        endTimestamp: line.end_timestamp_seconds,
        text: line.text,
        translation: line.translation
      }));

      setLyrics(formattedLyrics);
    } catch (error) {
      console.error('Error fetching lyrics:', error);
    }
  };

  const fetchKaraokeQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('video_karaoke_questions')
        .select('*')
        .eq('video_id', videoId)
        .eq('is_active', true)
        .order('timestamp_seconds', { ascending: true });

      if (error) throw error;

      const questions: KaraokeQuestion[] = (data || []).map((q: any) => ({
        id: q.id,
        timestamp: q.timestamp_seconds,
        question: q.question_text,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
        type: q.question_type || 'vocabulary'
      }));

      setKaraokeQuestions(questions);
    } catch (error) {
      console.error('Error fetching karaoke questions:', error);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 hover:bg-white/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {language.charAt(0).toUpperCase() + language.slice(1)} Songs
          </Button>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">{video.title}</h1>
                <div className="flex flex-wrap items-center gap-4">
                  <Badge className={`${getLevelColor(video.level)} px-3 py-1 text-sm font-semibold`}>
                    {video.level.charAt(0).toUpperCase() + video.level.slice(1)}
                  </Badge>
                  <div className="flex items-center text-slate-600">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">{formatDuration(video.duration_seconds)}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <BookOpen className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">{video.vocabulary_count} words</span>
                  </div>
                </div>
              </div>
            </div>

            {video.description && (
              <div className="relative">
                <div className={`text-slate-600 text-lg leading-relaxed whitespace-pre-wrap transition-all duration-300 ${showFullDescription ? '' : 'max-h-32 overflow-hidden mask-fade-bottom'
                  }`}>
                  {video.description}
                </div>

                {video.description.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="flex items-center gap-2 text-blue-600 font-medium mt-2 hover:text-blue-700 transition-colors"
                  >
                    {showFullDescription ? (
                      <>Show Less <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>Show More <ChevronDown className="w-4 h-4" /></>
                    )}
                  </button>
                )}
              </div>
            )}

            {isAdmin && (
              <div className="mt-4 border-t pt-4">
                <AdminVideoEditor
                  videoId={video.id}
                  youtubeId={video.youtube_id}
                  initialData={{
                    title: video.title,
                    description: video.description,
                    lyrics: lyrics,
                    questions: karaokeQuestions
                  }}
                  onUpdate={() => {
                    fetchVideo();
                    fetchLyrics();
                    fetchKaraokeQuestions();
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-2">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <button
                onClick={() => setActiveTab('watch')}
                className={`flex items-center justify-center gap-3 px-4 py-4 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'watch'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
              >
                <Play className="w-5 h-5" />
                <span className="hidden sm:inline">Watch</span>
              </button>

              {/* Karaoke Tab - Premium Feature */}
              <button
                onClick={() => hasKaraokeAccess ? setActiveTab('karaoke') : null}
                className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-semibold text-sm transition-all duration-200 relative ${!hasKaraokeAccess
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : activeTab === 'karaoke'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25 transform scale-[1.02]'
                    : 'text-slate-600 hover:bg-pink-50 hover:text-pink-700'
                  }`}
              >
                {!hasKaraokeAccess ? <Lock className="w-4 h-4" /> : <Mic className="w-5 h-5" />}
                <span className="hidden sm:inline">Karaoke</span>
                {!hasKaraokeAccess && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                    PRO
                  </span>
                )}
              </button>

              {/* Question Mode Tab */}
              <button
                onClick={() => hasKaraokeAccess && karaokeQuestions.length > 0 ? setActiveTab('questions') : null}
                className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-semibold text-sm transition-all duration-200 relative ${karaokeQuestions.length === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : !hasKaraokeAccess
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : activeTab === 'questions'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 transform scale-[1.02]'
                      : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                  }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Questions</span>
                {karaokeQuestions.length > 0 && (
                  <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                    {karaokeQuestions.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('vocabulary')}
                className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'vocabulary'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 transform scale-[1.02]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="hidden sm:inline">Vocab</span>
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                  {vocabularyWords.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'quiz'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 transform scale-[1.02]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
              >
                <Trophy className="w-5 h-5" />
                <span className="hidden sm:inline">Quiz</span>
              </button>

              <button
                onClick={() => setActiveTab('grammar')}
                className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'grammar'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 transform scale-[1.02]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
              >
                <BookOpen className="w-5 h-5" />
                <span className="hidden sm:inline">Grammar</span>
              </button>

              <button
                onClick={() => setActiveTab('transcript')}
                className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'transcript'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 transform scale-[1.02]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
              >
                <Volume2 className="w-5 h-5" />
                <span className="hidden sm:inline">Lyrics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {activeTab === 'watch' && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="aspect-video bg-black">
                <VideoPlayer
                  videoId={video.youtube_id}
                  autoplay={false}
                  height="100%"
                  width="100%"
                  onProgress={handleVideoProgress}
                  language={language}
                />
              </div>
            </div>
          )}

          {/* Karaoke Mode - LyricsTraining Style */}
          {activeTab === 'karaoke' && hasKaraokeAccess && (
            <LyricsTrainingPlayer
              videoId={video.id}
              youtubeId={video.youtube_id}
              lyrics={lyrics}
              questions={karaokeQuestions}
              language={language}
              title={video.title}
              difficulty="intermediate"
              onComplete={(results) => {
                console.log('Lyrics Training complete:', results);
                // Could save results, award gems, etc.
              }}
            />
          )}

          {/* Locked Karaoke Upsell */}
          {activeTab === 'karaoke' && !hasKaraokeAccess && (
            <div className="bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 rounded-2xl p-8 text-white text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-4">🎤 Unlock Karaoke Mode</h2>
              <p className="text-xl text-purple-200 mb-6 max-w-xl mx-auto">
                Sing along with synchronized lyrics, answer questions as you learn, and master vocabulary through music!
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <span className="text-sm">✨ Synced lyrics</span>
                </div>
                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <span className="text-sm">🧠 Auto-pause questions</span>
                </div>
                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <span className="text-sm">⭐ Points & streaks</span>
                </div>
              </div>
              <Link href="/pricing">
                <button className="bg-white text-purple-700 font-bold text-lg px-8 py-4 rounded-xl hover:bg-purple-100 transition-colors flex items-center gap-2 mx-auto">
                  <Crown className="w-6 h-6" />
                  Upgrade from £4.99/month
                </button>
              </Link>
            </div>
          )}

          {/* Question Mode - Timed Questions */}
          {activeTab === 'questions' && hasKaraokeAccess && karaokeQuestions.length > 0 && (
            <QuestionModePlayer
              videoId={video.id}
              youtubeId={video.youtube_id}
              questions={karaokeQuestions.map(q => ({
                id: q.id,
                timestamp: q.timestamp,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                type: q.type
              }))}
              language={language}
              title={video.title}
              onComplete={(results) => {
                console.log('Question Mode complete:', results);
              }}
            />
          )}

          {activeTab === 'vocabulary' && (
            <div className="space-y-6">
              {vocabularyWords.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vocabularyWords.map((word, index) => (
                    <motion.div
                      key={word.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-xl text-slate-800">{word.word}</h3>
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                            {Math.floor(word.timestamp / 60)}:{(word.timestamp % 60).toString().padStart(2, '0')}
                          </Badge>
                        </div>
                        <p className="text-slate-600 mb-3 font-medium">{word.translation}</p>
                        {word.context && (
                          <p className="text-sm text-slate-500 italic bg-slate-50 p-3 rounded-lg">"{word.context}"</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
                  <BookOpen className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">No vocabulary available</h3>
                  <p className="text-slate-600 text-lg">
                    Vocabulary words haven't been added to this video yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <VideoQuizGame
                videoId={video.id}
                onComplete={(results) => {
                  console.log('Quiz completed:', results);
                  // Handle quiz completion - award gems, save progress, etc.
                }}
              />
            </div>
          )}

          {activeTab === 'grammar' && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <VideoGrammarNotes videoId={video.id} />
            </div>
          )}

          {activeTab === 'transcript' && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800">Video Transcript</h2>
              </div>
              <div className="p-8">
                {video.transcript ? (
                  <div className="space-y-6">
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h4 className="font-bold text-lg mb-4 text-slate-800">Original ({language.toUpperCase()})</h4>
                      <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{video.transcript}</p>
                    </div>

                    {video.transcript_translation && (
                      <div className="bg-blue-50 rounded-xl p-6">
                        <h4 className="font-bold text-lg mb-4 text-slate-800">English Translation</h4>
                        <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{video.transcript_translation}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Volume2 className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">Transcript not available</h3>
                    <p className="text-slate-600 text-lg">
                      The transcript for this video hasn't been added yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Actions */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Continue Learning</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href={`/songs/${language}/vocabulary`}>
                <div className="group p-6 rounded-xl border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
                      <BookOpen className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 group-hover:text-emerald-800">Practice All Vocabulary</h4>
                      <p className="text-sm text-slate-600">Review words from all videos</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href={`/songs/${language}/games/vocabulary-match`}>
                <div className="group p-6 rounded-xl border-2 border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                      <Gamepad2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 group-hover:text-purple-800">Play Vocabulary Games</h4>
                      <p className="text-sm text-slate-600">Fun games to test your skills</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href={`/songs/${language}`}>
                <div className="group p-6 rounded-xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                      <ArrowLeft className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 group-hover:text-blue-800">More {language.charAt(0).toUpperCase() + language.slice(1)} Videos</h4>
                      <p className="text-sm text-slate-600">Explore our video library</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
