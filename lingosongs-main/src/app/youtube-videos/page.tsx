'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  youtube_id: string;
  language: string;
  level: string;
  thumbnail_url: string;
  is_premium: boolean;
}

export default function YouTubeVideosPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('youtube_videos')
          .select('*');
        
        // Apply filters if selected
        if (languageFilter !== 'all') {
          query = query.eq('language', languageFilter);
        }
        
        if (levelFilter !== 'all') {
          query = query.eq('level', levelFilter);
        }
        
        // Order by newest first
        query = query.order('created_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setVideos(data || []);
      } catch (error: any) {
        console.error('Error fetching videos:', error);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [languageFilter, levelFilter]);

  // Filter videos based on search query
  const filteredVideos = videos.filter(video => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      video.title.toLowerCase().includes(query) ||
      video.description.toLowerCase().includes(query)
    );
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle language filter change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguageFilter(e.target.value);
  };

  // Handle level filter change
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevelFilter(e.target.value);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">YouTube Videos with Quizzes</h1>
        <div className="text-center py-12">
          <div className="loader"></div>
          <p className="mt-4">Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">YouTube Videos with Quizzes</h1>
        <div className="bg-red-50 p-4 rounded-md">
          <h2 className="text-red-800 text-lg font-medium">Error</h2>
          <p className="text-red-700 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">YouTube Videos with Quizzes</h1>
      
      <div className="bg-blue-50 p-4 rounded-md mb-6">
        <h2 className="text-blue-800 text-lg font-medium">Learn with YouTube Videos</h2>
        <p className="text-blue-700 mt-2">
          Watch YouTube videos with interactive quizzes and lyrics exercises to help you learn languages more effectively.
          {!user && (
            <span className="ml-2">
              <Link href="/login" className="text-blue-600 underline">
                Sign in
              </Link> to track your progress and save your scores.
            </span>
          )}
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search videos..."
            className="w-full p-2 border border-gray-300 rounded-md"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex gap-4">
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={languageFilter}
            onChange={handleLanguageChange}
          >
            <option value="all">All Languages</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
          </select>
          
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={levelFilter}
            onChange={handleLevelChange}
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
      
      {filteredVideos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No videos found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <Link 
              href={`/youtube-quiz/${video.youtube_id}`} 
              key={video.id}
              className="video-card bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-[1.02]"
            >
              <div className="aspect-video relative">
                <img 
                  src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                {video.is_premium && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                    PREMIUM
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-gray-700 text-sm mb-2 line-clamp-3">{video.description}</p>
                
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {video.language === 'es' ? 'Spanish' : 
                     video.language === 'fr' ? 'French' :
                     video.language === 'de' ? 'German' :
                     video.language === 'it' ? 'Italian' :
                     video.language === 'pt' ? 'Portuguese' : 
                     video.language.toUpperCase()}
                  </span>
                  
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded capitalize">
                    {video.level || 'All Levels'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
        
        {user ? (
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Go to Dashboard →
          </Link>
        ) : (
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in to track progress →
          </Link>
        )}
      </div>
    </div>
  );
} 