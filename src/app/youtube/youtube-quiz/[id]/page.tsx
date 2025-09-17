'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import YoutubeVideoQuiz from '@/components/youtube/YoutubeVideoQuiz';
import { QuizPoint } from '@/components/youtube/VideoQuizOverlay';
import { LyricLine } from '@/components/youtube/VideoLyricsOverlay';
import Link from 'next/link';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  youtube_id: string;
  language: string;
  lyrics?: LyricLine[];
  quizPoints?: QuizPoint[];
}

export default function YouTubeQuizPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuth();
  const [videoData, setVideoData] = useState<YouTubeVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      setLoading(true);
      try {
        // First, try to fetch from our database if the ID matches our records
        const { data: videoRecord, error: videoError } = await supabase
          .from('youtube_videos')
          .select('*')
          .eq('id', id)
          .single();

        if (videoError && videoError.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" error
          throw videoError;
        }

        if (videoRecord) {
          // Fetch lyrics if available
          const { data: lyrics, error: lyricsError } = await supabase
            .from('youtube_lyrics')
            .select('*')
            .eq('video_id', videoRecord.id)
            .order('timestamp', { ascending: true });

          if (lyricsError) {
            console.error('Error fetching lyrics:', lyricsError);
          }

          // Fetch quiz points if available
          const { data: quizPoints, error: quizError } = await supabase
            .from('youtube_quiz_points')
            .select('*, options(*)')
            .eq('video_id', videoRecord.id)
            .order('timestamp', { ascending: true });

          if (quizError) {
            console.error('Error fetching quiz points:', quizError);
          }

          // Format quiz points to match our component's expected format
          const formattedQuizPoints = quizPoints?.map(qp => ({
            id: qp.id,
            timestamp: qp.timestamp,
            question: qp.question,
            options: qp.options.map((opt: any) => ({
              text: opt.text,
              isCorrect: opt.is_correct
            })),
            explanation: qp.explanation
          })) || [];

          // Format lyrics to match our component's expected format
          const formattedLyrics = lyrics?.map(l => ({
            id: l.id,
            timestamp: l.timestamp,
            text: l.text,
            translation: l.translation
          })) || [];

          setVideoData({
            ...videoRecord,
            lyrics: formattedLyrics,
            quizPoints: formattedQuizPoints
          });
        } else {
          // If not in our database, assume it's a direct YouTube ID
          // In a real application, you might want to verify this and fetch metadata from YouTube API
          setVideoData({
            id: id as string,
            title: 'YouTube Video',
            description: 'Direct YouTube video',
            youtube_id: id as string,
            language: 'en',
            lyrics: [],
            quizPoints: []
          });
        }
      } catch (error) {
        console.error('Error fetching video data:', error);
        setError('Failed to load video data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVideoData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <div className="loader"></div>
          <p className="mt-4">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 p-4 rounded-md">
          <h2 className="text-red-800 text-lg font-medium">Error</h2>
          <p className="text-red-700 mt-2">{error || 'Failed to load video.'}</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{videoData.title}</h1>
      
      <div className="mb-6">
        {/* Video container with proper aspect ratio */}
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          <YoutubeVideoQuiz
            youtubeId={videoData.youtube_id}
            videoId={videoData.id}
            quizPoints={videoData.quizPoints}
            lyrics={videoData.lyrics}
            initialMode="normal"
            autoplay={false}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="whitespace-pre-line">{videoData.description}</p>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md mb-6">
        <h2 className="text-blue-800 text-lg font-medium">How to Use</h2>
        <ul className="list-disc pl-5 mt-2 text-blue-700">
          <li>Click <strong>Quiz Mode</strong> to test your understanding with interactive quizzes.</li>
          <li>Click <strong>Lyrics Game</strong> to practice with fill-in-the-blank exercises.</li>
          <li>Click <strong>Normal</strong> to watch the video without interactive features.</li>
        </ul>
      </div>
      
      <div className="flex justify-between mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
        {user ? (
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Go to Dashboard
          </Link>
        ) : (
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in to save progress →
          </Link>
        )}
      </div>
    </div>
  );
} 