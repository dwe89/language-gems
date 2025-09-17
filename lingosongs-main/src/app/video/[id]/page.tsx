'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthContext';
import Link from 'next/link';
import VideoPlayer, { VideoPlayerHandle } from '@/components/VideoPlayer';
import VocabularyTab from '@/components/vocabulary/VocabularyTab';
import Flashcards from '@/components/vocabulary/Flashcards';
import useProgress from '@/hooks/useProgress';

// Utility functions
const parseTimestamp = (timestamp: string): number => {
  const parts = timestamp.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseFloat(parts[1]);
  } else if (parts.length === 3) {
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2]);
  }
  return 0;
};

const formatTimestamp = (timestamp: string): string => {
  return timestamp || '0:00';
};

const formatSeconds = (seconds?: number): string => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface VideoData {
  id: string;
  title: string;
  description: string;
  youtube_id: string;
  level: string;
  duration: string;
  language: string;
  lyrics: LyricsSection[];
  vocabulary: VocabularyItem[];
  quiz: QuizQuestion[];
  fill_blanks: FillBlanksExercise[];
  grammar_notes: GrammarNote[];
  pronunciation_practice: PronunciationPracticeItem[];
  cultural_notes: CulturalNoteItem[];
  sentence_scrambles: SentenceScrambleItem[];
}

interface LyricsSection {
  id: number;
  timestamp: string;
  spanish_text: string;
  english_text: string;
  section_order: number;
}

interface VocabularyItem {
  id: number;
  word: string;
  translation: string;
  example_sentence?: string;
  notes?: string;
  type: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: any; // This is jsonb in the database
  correct_answer: string;
  explanation?: string;
}

interface FillBlanksExercise {
  id: number;
  sentence: string;
  correct_answer: string;
  hint?: string;
  exercise_order: number;
}

interface GrammarNote {
  title: string;
  content: string;
  section_order: number;
}

interface PronunciationPracticeItem {
  id: number;
  video_id: number;
  phrase_text: string;
  start_time?: number;
  end_time?: number;
  created_at: string;
}

interface CulturalNoteItem {
  id: number;
  video_id: number;
  note_text: string;
  timestamp?: number;
  reference_text?: string;
  created_at: string;
}

interface SentenceScrambleItem {
  id: number;
  video_id: number;
  original_sentence: string;
  created_at: string;
}

export default function VideoPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuth();
  const { getAccessibleContent } = usePremiumAccess();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('lyrics');
  
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: string}>({});
  const [fillBlankAnswers, setFillBlankAnswers] = useState<{[key: number]: string}>({});
  const [feedback, setFeedback] = useState<{[key: number]: {correct: boolean; message: string}}>({});
  const [scrambleAnswers, setScrambleAnswers] = useState<{[key: number]: string}>({});
  const [scrambleFeedback, setScrambleFeedback] = useState<{[key: number]: {correct: boolean; message: string}}>({});
  // --- Pronunciation State Start ---
  const [pronunciationState, setPronunciationState] = useState<{ [key: number]: { isRecording: boolean; audioURL: string | null; recordedBlob: Blob | null } }>({});
  const [stats, setStats] = useState({ quizAccuracy: 0, wordsLearned: 0, minutesPracticed: 0, dayStreak: 0 });
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  // --- Pronunciation State End ---
  // --- Create ref for VideoPlayer ---
  const videoPlayerRef = useRef<VideoPlayerHandle>(null);
  // ---------------------------------

  const { trackVideoProgress, getVideoProgress } = useProgress();

  const handleVideoProgress = (seconds: number, percentage: number) => {
    setCurrentVideoTime(seconds);
    setVideoProgress(percentage);
    
    // Update stats based on video progress
    if (user) {
      // Only count additional minutes if percentage has increased significantly (> 5%)
      if (percentage > 5 && percentage > videoProgress + 5) {
        // Rough calculation of minutes watched
        const minutesWatched = Math.floor((seconds - (currentVideoTime || 0)) / 60);
        if (minutesWatched > 0) {
          updateVideoProgress(seconds, percentage);
        }
      }
    }
  };
  
  // Update progress in the database with proper data types
  const updateVideoProgress = async (seconds: number, percentage: number) => {
    if (!user || !videoData) return;
    
    try {
      // Make sure to convert percentage to an integer as the database expects this
      const roundedPercentage = Math.round(percentage);
      
      // Update video_progress table
      const { error: progressError } = await supabase
        .from('video_progress')
        .upsert({
          user_id: user.id,
          video_id: videoData.id,
          progress: roundedPercentage, // Make sure this is an integer
          language: videoData.language || 'auto',
          last_position: seconds, // Store the seconds position
          updated_at: new Date().toISOString()
        });

      if (progressError) {
        console.error('Error updating video progress:', {
          message: progressError.message,
          details: progressError.details,
          hint: progressError.hint
        });
        return;
      }
      
      // Update the user video stats for this video
      await updateUserVideoStats(Math.floor(seconds / 60));
      
    } catch (error: any) {
      console.error('Error in video progress update:', error);
    }
  };
  
  // Update user stats in the user_video_stats table
  const updateUserVideoStats = async (minutesWatched: number) => {
    if (!user || !videoData || minutesWatched <= 0) return;
    
    try {
      // Get current stats first
      const { data: currentStats, error: statsError } = await supabase
        .from('user_video_stats')
        .select('minutes_practiced')
        .eq('user_id', user.id)
        .eq('video_id', videoData.id)
        .single();
      
      const currentMinutes = currentStats?.minutes_practiced || 0;
      
      // Only update if we're adding new minutes
      if (minutesWatched <= 0) return;
      
      // Update user_video_stats table
      const { error: updateError } = await supabase
        .from('user_video_stats')
        .upsert({
          user_id: user.id,
          video_id: videoData.id, // Ensure this is compatible with the table's video_id type
          minutes_practiced: currentMinutes + minutesWatched,
          updated_at: new Date().toISOString()
        });

      if (updateError) {
        console.error('Error updating user video stats:', {
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint
        });
      }
    } catch (error: any) {
      console.error('Error updating user video stats:', error);
    }
  };

  const handleQuizAnswer = async (questionId: number, selectedAnswer: string, correctAnswer: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: selectedAnswer }));
    
    const isCorrect = selectedAnswer === correctAnswer;
    setFeedback(prev => ({
      ...prev,
      [questionId]: {
        correct: isCorrect,
        message: isCorrect ? 'Correct!' : 'Try again!'
      }
    }));

    if (user) {
      try {
        // Update user's quiz stats
        const { error } = await supabase
          .from('user_video_stats')
          .upsert({
            user_id: user.id,
            video_id: videoData?.id,
            quiz_accuracy: isCorrect ? 100 : 0,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      } catch (err) {
        console.error('Error updating quiz stats:', err);
      }
    }
  };

  const handleFillBlankInput = (exerciseId: number, value: string) => {
    setFillBlankAnswers(prev => ({ ...prev, [exerciseId]: value }));
  };

  const handleFillBlankSubmit = async (exerciseId: number, correctAnswer: string) => {
    const userAnswer = fillBlankAnswers[exerciseId] || '';
    const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    
    setFeedback(prev => ({
      ...prev,
      [exerciseId]: {
        correct: isCorrect,
        message: isCorrect ? 'Correct!' : 'Try again!'
      }
    }));

    if (user) {
      try {
        // Update user's fill in blanks stats
        const { error } = await supabase
          .from('user_video_stats')
          .upsert({
            user_id: user.id,
            video_id: videoData?.id,
            fill_blanks_completed: true,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      } catch (err) {
        console.error('Error updating fill in blanks stats:', err);
      }
    }
  };

  // Helper function to shuffle words in a sentence
  const shuffleWords = (sentence: string): string => {
    const words = sentence.split(' ');
    // Fisher-Yates (Knuth) Shuffle
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }
    // Prevent shuffling into the exact original sentence (rare, but possible)
    const shuffled = words.join(' ');
    if (shuffled === sentence && words.length > 1) {
      // Simple swap if it matches original
      [words[0], words[1]] = [words[1], words[0]];
      return words.join(' ');
    }
    return shuffled;
  };

  const handleScrambleInput = (exerciseId: number, value: string) => {
    setScrambleAnswers(prev => ({ ...prev, [exerciseId]: value }));
  };

  // --- Pronunciation Handlers Start ---
  const handleListen = (item: PronunciationPracticeItem) => {
    if (item.start_time !== undefined && videoPlayerRef.current) {
      console.log('Seeking to:', item.start_time);
      videoPlayerRef.current.seekTo(item.start_time);
    } else {
      console.warn('Cannot seek: start time is undefined or player ref is not available.');
      alert('Could not play segment. Start time missing or player not ready.');
    }
  };

  const startRecording = async (itemId: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]); // Clear previous chunks
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' }); // Or appropriate type
        const audioUrl = URL.createObjectURL(audioBlob);
        setPronunciationState(prev => ({
          ...prev,
          [itemId]: { ...prev[itemId], isRecording: false, audioURL: audioUrl, recordedBlob: audioBlob }
        }));
        stream.getTracks().forEach(track => track.stop()); // Release microphone
      };

      recorder.start();
      setPronunciationState(prev => ({
        ...prev,
        [itemId]: { ...prev[itemId], isRecording: true, audioURL: null, recordedBlob: null } // Reset previous recording
      }));

    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = (itemId: number) => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      // The onstop handler will update the state
    } else {
       // Ensure state is updated even if recorder wasn't active as expected
       setPronunciationState(prev => ({
         ...prev,
         [itemId]: { ...prev[itemId], isRecording: false }
       }));
    }
  };

  // --- Pronunciation Handlers End ---

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        
        // Fetch video details from Supabase
        const { data: videoDetails, error: videoError } = await supabase
          .from('videos')
          .select('*')
          .eq('id', id)
          .single();
        
        if (videoError) {
          console.error('Supabase error fetching video data:', {
            message: videoError.message,
            details: videoError.details,
            hint: videoError.hint
          });
          throw videoError;
        }
        
        if (!videoDetails) {
          throw new Error('Video not found');
        }
        
        console.log('Fetched video data:', videoDetails);
        
        // --- Fetch All Related Data in Parallel ---
        const [
          lyricsResult,
          quizResult,
          fillBlanksResult,
          grammarNotesResult,
          vocabularyResult,
          pronunciationResult,
          culturalNotesResult,
          sentenceScramblesResult
        ] = await Promise.all([
          supabase.from('lyrics').select('*').eq('video_id', videoDetails.id).order('section_order', { ascending: true }),
          supabase.from('quiz_questions').select('*').eq('video_id', videoDetails.id).order('id', { ascending: true }),
          supabase.from('fill_in_blanks').select('*').eq('video_id', videoDetails.id).order('exercise_order', { ascending: true }),
          supabase.from('grammar_notes').select('*').eq('video_id', videoDetails.id).order('section_order', { ascending: true }),
          supabase.from('vocabulary').select('*').eq('video_id', videoDetails.id),
          supabase.from('pronunciation_practice').select('*').eq('video_id', videoDetails.id).order('id', { ascending: true }),
          supabase.from('cultural_notes').select('*').eq('video_id', videoDetails.id).order('id', { ascending: true }),
          supabase.from('sentence_scrambles').select('*').eq('video_id', videoDetails.id).order('id', { ascending: true })
        ]);

        // --- Log Errors and Extract Data ---
        const logError = (feature: string, error: any) => {
          if (error) {
            console.error(`Error fetching ${feature}:`, {
              message: error.message,
              details: error.details,
              hint: error.hint
            });
          }
        };

        logError('lyrics', lyricsResult.error);
        logError('quiz questions', quizResult.error);
        logError('fill in blanks', fillBlanksResult.error);
        logError('grammar notes', grammarNotesResult.error);
        logError('vocabulary', vocabularyResult.error);
        logError('pronunciation practice', pronunciationResult.error);
        logError('cultural notes', culturalNotesResult.error);
        logError('sentence scrambles', sentenceScramblesResult.error);

        const lyricsData = lyricsResult.data || [];
        const quizData = quizResult.data || [];
        const fillInBlanksData = fillBlanksResult.data || [];
        const grammarNotesData = grammarNotesResult.data || [];
        const vocabularyData = vocabularyResult.data || [];
        const pronunciationData = pronunciationResult.data || [];
        const culturalNotesData = culturalNotesResult.data || [];
        const sentenceScramblesData = sentenceScramblesResult.data || [];
        
        // Add debugging logs for new data
        console.log('Pronunciation data:', pronunciationData);
        console.log('Cultural notes data:', culturalNotesData);
        console.log('Sentence scrambles data:', sentenceScramblesData);
        
        // Ensure quiz options are parsed objects
        const parsedQuizData = quizData.map(q => {
          let options = q.options;
          if (typeof options === 'string') {
            try {
              options = JSON.parse(options);
            } catch (parseError) {
              console.error('Failed to parse quiz options JSON:', parseError, 'for question:', q.id, 'options string:', q.options);
              options = {}; // Default to empty object on error
            }
          }
          // Ensure it's an object, even if null/undefined originally or after failed parse
          if (typeof options !== 'object' || options === null) {
            console.warn('Quiz options were not an object or failed to parse, defaulting to {}: Question ID:', q.id);
            options = {}; 
          }
          return { ...q, options };
        });
        
        // Combine all data with the video object
        const enrichedVideoData: VideoData = {
          ...videoDetails,
          lyrics: lyricsData,
          quiz: parsedQuizData, // Use parsed quiz data
          fill_blanks: fillInBlanksData,
          grammar_notes: grammarNotesData,
          vocabulary: vocabularyData,
          pronunciation_practice: pronunciationData,
          cultural_notes: culturalNotesData,
          sentence_scrambles: sentenceScramblesData,
        };
        
        console.log('Enriched video data:', enrichedVideoData);
        
        setVideoData(enrichedVideoData);
        
        // If user is logged in, fetch their stats for this video
        if (user) {
          try {
            // Use the correct casing for video_id in the user_video_stats query
            // The table expects an integer video_id but we have a string, so handle conversion
            // For new entries, convert our string ID to an integer safely or use the string appropriately
            const { data: statsData, error: statsError } = await supabase
              .from('user_video_stats')
              .select('quiz_accuracy, words_learned, minutes_practiced, day_streak')
              .eq('user_id', user.id)
              .eq('video_id', videoDetails.id) // If this needs to be integer, make sure videoDetails.id is converted properly
              .single();
            
            if (statsError && statsError.code !== 'PGRST116') { // PGRST116 = No rows returned
              console.error('Error fetching user stats:', {
                message: statsError.message,
                details: statsError.details,
                hint: statsError.hint
              });
            }
            
            if (statsData) {
              setStats({
                quizAccuracy: statsData.quiz_accuracy || 0,
                wordsLearned: statsData.words_learned || 0,
                minutesPracticed: statsData.minutes_practiced || 0,
                dayStreak: statsData.day_streak || 0
              });
            } else {
              console.log('No existing stats found for this video and user, using defaults');
              setStats({ quizAccuracy: 0, wordsLearned: 0, minutesPracticed: 0, dayStreak: 0 });
            }
          } catch (statsError) {
            console.error('Error fetching user stats:', statsError);
            // Continue without stats rather than breaking the page
          }
        }
      } catch (err: any) {
        console.error('Error fetching video:', err);
        setError(err.message || 'An error occurred while fetching the video');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVideoData();
    }
  }, [id, user]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading video...</p>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error || 'Video not found'}</p>
        <Link href="/" className="back-button">
          Back to Home
        </Link>
      </div>
    );
  }

  // Limit content based on user's premium status
  const lyrics = getAccessibleContent(videoData.lyrics || [], 'lyrics');
  const vocabulary = getAccessibleContent(videoData.vocabulary || [], 'vocabulary');
  const quiz = getAccessibleContent(videoData.quiz || [], 'quiz');
  const fillBlanks = getAccessibleContent(videoData.fill_blanks || [], 'fillBlanks');

  const handleProgress = useCallback(async (currentTime: number, percentage: number) => {
    if (videoData && user) {
      await trackVideoProgress({
        videoId: videoData.id,
        language: videoData.language,
        progress: percentage,
        duration: currentTime,
        completed: percentage > 90
      });
    }
  }, [videoData, user, trackVideoProgress]);

  return (
    <div className="min-h-screen pt-20 pb-20 bg-gray-50">
      {error && (
        <div className="max-w-5xl mx-auto p-4 bg-red-100 text-red-700 rounded-lg mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <div className="max-w-5xl mx-auto p-4">
          <div className="animate-pulse bg-gray-300 h-96 rounded-lg mb-8"></div>
          <div className="animate-pulse bg-gray-300 h-8 w-3/4 rounded mb-4"></div>
          <div className="animate-pulse bg-gray-300 h-4 w-1/2 rounded mb-8"></div>
          <div className="animate-pulse bg-gray-300 h-64 rounded-lg"></div>
        </div>
      ) : videoData ? (
        <div className="max-w-5xl mx-auto px-4">
          {/* Video Player Section */}
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <VideoPlayer
              ref={videoPlayerRef}
              videoId={videoData.youtube_id}
              autoplay={false}
              onProgress={handleVideoProgress}
              language={videoData.language}
            />
          </div>

          {/* Video Information */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{videoData.title}</h1>
            <p className="text-gray-600 mb-4">{videoData.description}</p>
            
            {/* Video Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="text-2xl font-bold text-indigo-600">{Math.round(stats.quizAccuracy)}%</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Quiz Accuracy</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.wordsLearned}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Words Learned</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.minutesPracticed}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Minutes Practiced</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.dayStreak}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Day Streak</div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                {videoData.language.charAt(0).toUpperCase() + videoData.language.slice(1)}
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                {videoData.level.charAt(0).toUpperCase() + videoData.level.slice(1)}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                {videoData.duration}
              </span>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            {/* Tab Navigation */}
            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
              <button
                onClick={() => setActiveTab('lyrics')}
                className={`px-4 py-3 font-medium text-sm flex-shrink-0 border-b-2 focus:outline-none ${
                  activeTab === 'lyrics'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Lyrics & Translation
              </button>
              <button
                onClick={() => setActiveTab('vocabulary')}
                className={`px-4 py-3 font-medium text-sm flex-shrink-0 border-b-2 focus:outline-none ${
                  activeTab === 'vocabulary'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Vocabulary
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-3 font-medium text-sm flex-shrink-0 border-b-2 focus:outline-none ${
                  activeTab === 'quiz'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Quiz
              </button>
              <button
                onClick={() => setActiveTab('fill-blanks')}
                className={`px-4 py-3 font-medium text-sm flex-shrink-0 border-b-2 focus:outline-none ${
                  activeTab === 'fill-blanks'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Fill in the Blanks
              </button>
              <button
                onClick={() => setActiveTab('grammar')}
                className={`px-4 py-3 font-medium text-sm flex-shrink-0 border-b-2 focus:outline-none ${
                  activeTab === 'grammar'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Grammar Notes
              </button>
              <button
                onClick={() => setActiveTab('pronunciation')}
                className={`px-4 py-3 font-medium text-sm flex-shrink-0 border-b-2 focus:outline-none ${
                  activeTab === 'pronunciation'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Pronunciation
              </button>
              <button
                onClick={() => setActiveTab('culture')}
                className={`px-4 py-3 font-medium text-sm flex-shrink-0 border-b-2 focus:outline-none ${
                  activeTab === 'culture'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Cultural Notes
              </button>
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`px-4 py-3 font-medium text-sm flex-shrink-0 border-b-2 focus:outline-none ${
                  activeTab === 'flashcards'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Flashcards
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'lyrics' && (
                <div className="space-y-8">
                  {!videoData.lyrics || videoData.lyrics.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">No lyrics available for this video.</p>
                  ) : (
                    videoData.lyrics
                      .sort((a, b) => a.section_order - b.section_order)
                      .map((section, index) => (
                        <div
                          key={section.id || index}
                          className="p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => {
                            if (videoPlayerRef.current && section.timestamp) {
                              const timeInSeconds = parseTimestamp(section.timestamp);
                              videoPlayerRef.current.seekTo(timeInSeconds);
                            }
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-sm text-gray-500">{formatTimestamp(section.timestamp)}</div>
                          </div>
                          <p className="text-lg mb-2 leading-relaxed" lang={videoData.language}>
                            {section.spanish_text}
                          </p>
                          <p className="text-gray-600 italic" lang="en">
                            {section.english_text}
                          </p>
                        </div>
                      ))
                  )}
                </div>
              )}

              {activeTab === 'vocabulary' && (
                <div>
                  {!videoData.vocabulary || videoData.vocabulary.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">No vocabulary available for this video.</p>
                  ) : (
                    <div>
                      <VocabularyTab 
                        vocabulary={videoData.vocabulary}
                        videoId={videoData.id}
                        videoTitle={videoData.title}
                        language={videoData.language}
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-8">
                  {!videoData.quiz || videoData.quiz.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">No quiz available for this video.</p>
                  ) : (
                    videoData.quiz.map((question, index) => (
                      <div key={question.id || index} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                          <h3 className="font-medium text-gray-900">Question {index + 1}</h3>
                        </div>
                        <div className="p-6">
                          <p className="text-lg mb-4">{question.question}</p>
                          
                          <div className="space-y-3">
                            {question.options && Object.entries(question.options).map(([key, value]) => (
                              <div key={key} className="flex items-start">
                                <div className="flex h-5 items-center">
                                  <input
                                    id={`question-${question.id}-option-${key}`}
                                    name={`question-${question.id}`}
                                    type="radio"
                                    checked={quizAnswers[question.id] === key}
                                    onChange={() => handleQuizAnswer(question.id, key, question.correct_answer)}
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                </div>
                                <div className="ml-3 text-sm">
                                  <label 
                                    htmlFor={`question-${question.id}-option-${key}`} 
                                    className="font-medium text-gray-700 cursor-pointer"
                                  >
                                    {value as string}
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {quizAnswers[question.id] && (
                            <div className={`mt-4 p-3 rounded-lg ${
                              quizAnswers[question.id] === question.correct_answer
                                ? 'bg-green-50 text-green-800'
                                : 'bg-red-50 text-red-800'
                            }`}>
                              {quizAnswers[question.id] === question.correct_answer
                                ? '✓ Correct!'
                                : `✗ Incorrect. The correct answer is: ${question.options[question.correct_answer as keyof typeof question.options]}`}
                              
                              {question.explanation && (
                                <p className="mt-2 text-sm">{question.explanation}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'fill-blanks' && (
                <div className="space-y-8">
                  {!videoData.fill_blanks || videoData.fill_blanks.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">No fill-in-the-blanks exercises available for this video.</p>
                  ) : (
                    videoData.fill_blanks
                      .sort((a, b) => a.exercise_order - b.exercise_order)
                      .map((exercise, index) => {
                        // Generate some options if not available
                        const options = [
                          exercise.correct_answer,
                          exercise.correct_answer + 's',
                          exercise.correct_answer === 'uno' ? 'dos' : 
                          exercise.correct_answer === 'dos' ? 'tres' : 
                          exercise.correct_answer === 'tres' ? 'cuatro' : 'otra'
                        ];
                        
                        // Shuffle the options
                        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
                        
                        return (
                          <div key={exercise.id || index} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                              <h3 className="font-medium text-gray-900">Exercise {index + 1}</h3>
                            </div>
                            <div className="p-6">
                              <p className="text-lg mb-4">
                                {exercise.sentence.split('_____').map((part, i, arr) => (
                                  <React.Fragment key={i}>
                                    {part}
                                    {i < arr.length - 1 && (
                                      <span className="relative mx-1 px-1 py-0.5 bg-indigo-50 text-indigo-800 border-b-2 border-indigo-200 rounded">
                                        {fillBlankAnswers[exercise.id] || '_____'}
                                      </span>
                                    )}
                                  </React.Fragment>
                                ))}
                              </p>
                              
                              {exercise.hint && (
                                <p className="text-sm text-gray-500 mb-4">Hint: {exercise.hint}</p>
                              )}
                              
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Your Answer:
                                </label>
                                <input
                                  type="text"
                                  value={fillBlankAnswers[exercise.id] || ''}
                                  onChange={(e) => handleFillBlankInput(exercise.id, e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  placeholder="Type your answer"
                                />
                              </div>
                              
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Or choose from options:
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                  {shuffledOptions.map((option, optionIndex) => (
                                    <button
                                      key={optionIndex}
                                      onClick={() => handleFillBlankInput(exercise.id, option)}
                                      className={`p-2 border rounded-md text-left hover:bg-gray-50 transition-all ${
                                        fillBlankAnswers[exercise.id] === option
                                          ? 'border-indigo-500 bg-indigo-50 font-medium'
                                          : 'border-gray-300'
                                      }`}
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              
                              <button
                                onClick={() => handleFillBlankSubmit(exercise.id, exercise.correct_answer)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                              >
                                Check Answer
                              </button>
                              
                              {feedback[exercise.id] && (
                                <div className={`mt-4 p-3 rounded-lg ${
                                  feedback[exercise.id].correct
                                    ? 'bg-green-50 text-green-800'
                                    : 'bg-red-50 text-red-800'
                                }`}>
                                  {feedback[exercise.id].correct
                                    ? '✓ Correct!'
                                    : `✗ Incorrect. The correct answer is: ${exercise.correct_answer}`}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              )}

              {activeTab === 'grammar' && (
                <div className="space-y-8">
                  {!videoData.grammar_notes || videoData.grammar_notes.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">No grammar notes available for this video.</p>
                  ) : (
                    <div>
                      {videoData.grammar_notes
                        .sort((a, b) => a.section_order - b.section_order)
                        .map((note, index) => {
                          // Create a local state to track if this note is expanded
                          const noteId = `grammar-note-${index}`;
                          const isExpanded = !(note.title.length > 50); // Default to expanded for short titles
                          
                          return (
                            <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-4">
                              <div 
                                className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center cursor-pointer"
                                onClick={() => {
                                  // Toggle visibility of the content div
                                  const contentDiv = document.getElementById(noteId);
                                  if (contentDiv) {
                                    contentDiv.classList.toggle('hidden');
                                    // Update expand/collapse button
                                    const expandBtn = document.getElementById(`${noteId}-btn`);
                                    if (expandBtn) {
                                      expandBtn.textContent = contentDiv.classList.contains('hidden') ? '+' : '−';
                                      expandBtn.classList.toggle('bg-gray-200');
                                      expandBtn.classList.toggle('bg-indigo-100');
                                      expandBtn.classList.toggle('text-gray-700');
                                      expandBtn.classList.toggle('text-indigo-700');
                                    }
                                  }
                                }}
                              >
                                <h3 className="font-medium text-gray-900">{note.title}</h3>
                                <button 
                                  id={`${noteId}-btn`}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-lg font-medium ${
                                    isExpanded ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-700'
                                  }`}
                                >
                                  {isExpanded ? '−' : '+'}
                                </button>
                              </div>
                              <div 
                                id={noteId} 
                                className={`p-6 prose max-w-none border-t border-gray-100 ${isExpanded ? '' : 'hidden'}`}
                              >
                                <div dangerouslySetInnerHTML={{ __html: note.content }} />
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'pronunciation' && (
                <div className="space-y-8">
                  {!videoData.pronunciation_practice || videoData.pronunciation_practice.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">No pronunciation exercises available for this video.</p>
                  ) : (
                    videoData.pronunciation_practice.map((item, index) => {
                      const itemState = pronunciationState[item.id] || {
                        isRecording: false,
                        audioURL: null,
                        recordedBlob: null
                      };
                      
                      return (
                        <div key={item.id || index} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-medium text-gray-900">Pronunciation Exercise {index + 1}</h3>
                          </div>
                          <div className="p-6">
                            <p className="text-lg mb-6 text-center font-medium" lang={videoData.language}>
                              "{item.phrase_text}"
                            </p>
                            
                            <div className="flex justify-center space-x-4 mb-4">
                              <button
                                onClick={() => handleListen(item)}
                                className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200 transition-colors flex items-center"
                              >
                                <span className="mr-2">👂</span> Listen
                              </button>
                              
                              {itemState.isRecording ? (
                                <button
                                  onClick={() => stopRecording(item.id)}
                                  className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors flex items-center"
                                >
                                  <span className="mr-2">⏹️</span> Stop Recording
                                </button>
                              ) : (
                                <button
                                  onClick={() => startRecording(item.id)}
                                  className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors flex items-center"
                                >
                                  <span className="mr-2">🎤</span> Record Yourself
                                </button>
                              )}
                            </div>
                            
                            {itemState.audioURL && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Your Recording:</h4>
                                <audio src={itemState.audioURL} controls className="w-full" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === 'culture' && (
                <div className="space-y-8">
                  {!videoData.cultural_notes || videoData.cultural_notes.length === 0 ? (
                    <p className="text-gray-500 text-center py-12">No cultural notes available for this video.</p>
                  ) : (
                    videoData.cultural_notes.map((note, index) => (
                      <div key={note.id || index} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                          <h3 className="font-medium text-gray-900">Cultural Note {index + 1}</h3>
                        </div>
                        <div className="p-6 prose max-w-none">
                          <p>{note.note_text}</p>
                          
                          {note.reference_text && (
                            <p className="text-sm text-gray-500 mt-4">
                              Reference: {note.reference_text}
                            </p>
                          )}
                          
                          {note.timestamp && (
                            <button
                              onClick={() => {
                                if (videoPlayerRef.current) {
                                  videoPlayerRef.current.seekTo(note.timestamp || 0);
                                }
                              }}
                              className="text-sm text-indigo-600 hover:underline mt-2 flex items-center"
                            >
                              <span className="mr-1">▶️</span> Play at {formatSeconds(note.timestamp)}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {activeTab === 'flashcards' && (
                <div>
                  <Flashcards
                    language={videoData.language}
                    limit={10}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Related Videos */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder for related videos */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
                  <div className="h-40 bg-gray-300"></div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1">Related Video Title</h3>
                    <p className="text-sm text-gray-500">
                      This would be a related video based on language and content.
                    </p>
                    <div className="flex mt-3 text-xs">
                      <span className="text-indigo-600 font-medium">{videoData.language.charAt(0).toUpperCase() + videoData.language.slice(1)}</span>
                      <span className="mx-2">•</span>
                      <span className="text-gray-500">3:45</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Video Not Found</h2>
          <p className="text-gray-600 mb-8">The requested video could not be found.</p>
          <Link href="/" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Return to Homepage
          </Link>
        </div>
      )}
    </div>
  );
} 