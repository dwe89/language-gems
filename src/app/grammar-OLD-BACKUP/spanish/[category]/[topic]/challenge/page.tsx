'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Trophy, Clock, Heart, Zap, Award, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../../../../components/auth/AuthProvider';
import { GemCard } from '../../../../../../components/ui/GemTheme';
import { createClient } from '../../../../../../lib/supabase/client';

interface ChallengePageProps {
  params: {
    category: string;
    topic: string;
  };
}

export default function ChallengePage({ params }: ChallengePageProps) {
  const authResult = useAuth();
  console.log('🔍 Challenge Page: useAuth hook called');
  console.log('🔍 Challenge Page: useAuth result:', authResult);

  const { user, session, isLoading: authLoading } = authResult;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [topicData, setTopicData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!session;
  console.log('🔍 Challenge Page Auth State:', { isAuthenticated, user: !!user, authLoading });

  // Format topic name for display
  const formatTopicName = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const topicName = formatTopicName(params.topic);
  const categoryName = formatTopicName(params.category);

  useEffect(() => {
    // Load topic data to verify it exists and has content
    const loadTopicData = async () => {
      try {
        const response = await fetch(`/api/grammar/practice-status?language=spanish`);
        const data = await response.json();
        
        if (data.success && data.data.includes(params.topic)) {
          setTopicData({ hasContent: true });
        } else {
          setTopicData({ hasContent: false });
        }
      } catch (error) {
        console.error('Error loading topic data:', error);
        setTopicData({ hasContent: false });
      } finally {
        setLoading(false);
      }
    };

    loadTopicData();
  }, [params.topic]);

  const handleTestModeClick = () => {
    console.log('Test mode clicked. Auth state:', { isAuthenticated, user: !!user, authLoading });

    // Don't proceed if auth is still loading
    if (authLoading) {
      console.log('Auth still loading, waiting...');
      return;
    }

    if (!isAuthenticated || !user) {
      console.log('User not authenticated, showing modal');
      setShowAuthModal(true);
    } else {
      console.log('User authenticated, redirecting to test mode');
      // Redirect to dedicated test page
      window.location.href = `/grammar/spanish/${params.category}/${params.topic}/test`;
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading challenge options...</p>
        </div>
      </div>
    );
  }

  if (!topicData?.hasContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href="/grammar/spanish"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Spanish Grammar
            </Link>
          </div>

          <GemCard className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Content Coming Soon</h1>
            <p className="text-gray-600 mb-6">
              Interactive content for <strong>{topicName}</strong> is being prepared.
            </p>
            <Link
              href={`/grammar/spanish/${params.category}/${params.topic}`}
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play className="h-4 w-4 mr-2" />
              Learn About {topicName}
            </Link>
          </GemCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/grammar/spanish"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Spanish Grammar
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {topicName}
            </h1>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-xl border border-blue-200 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Choose Your Learning Path</h2>
              <p className="text-lg text-gray-700">
                <strong>Practice Mode:</strong> Build confidence with unlimited attempts and hints<br/>
                <strong>Assessment Mode:</strong> Take the official graded test for rewards and progress tracking
              </p>
            </div>
          </div>
        </div>

        {/* Challenge Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Practice Mode */}
          <GemCard className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-bl-full opacity-10"></div>
            
            <div className="relative z-10 p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Play className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Practice</h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                Low-stakes review, no pressure. Perfect for learning and building confidence!
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Unlimited attempts
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Hints available
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  No time pressure
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />
                  No XP or Gems earned
                </div>
              </div>
              
              <Link
                href={`/grammar/spanish/${params.category}/${params.topic}/practice?mode=practice`}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center group-hover:scale-105"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Practice
              </Link>
            </div>
          </GemCard>

          {/* Test Mode - Official Assessment */}
          <GemCard className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
            {/* Official Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              OFFICIAL ASSESSMENT
            </div>

            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-bl-full opacity-20"></div>

            <div className="relative z-10 p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-full mr-4 shadow-md">
                  <Trophy className="h-7 w-7 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                    Assessment Mode
                  </h2>
                  <p className="text-purple-600 font-medium text-sm">Graded test with official scoring</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg mb-6 border border-purple-200">
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-4 w-4 mr-2 text-purple-600" />
                  <span className="font-bold text-purple-800 text-sm">High-Stakes Assessment</span>
                </div>
                <p className="text-xs text-purple-700">
                  This is an official graded test. Your performance will be permanently recorded and contribute to your overall progress score.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm font-medium text-gray-800">
                  <Award className="h-4 w-4 text-purple-500 mr-3" />
                  Earn up to 50 Gems + XP rewards
                </div>
                <div className="flex items-center text-sm font-medium text-gray-800">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                  Official score recorded permanently
                </div>
                <div className="flex items-center text-sm font-medium text-gray-800">
                  <Clock className="h-4 w-4 text-orange-500 mr-3" />
                  Timed questions (no hints available)
                </div>
                <div className="flex items-center text-sm font-medium text-red-600">
                  <Heart className="h-4 w-4 text-red-500 mr-3" />
                  Limited to 3 attempts only
                </div>
              </div>

              <button
                onClick={handleTestModeClick}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
                disabled={authLoading}
              >
                <Trophy className="h-5 w-5 mr-2" />
                {authLoading ? 'Loading...' : (isAuthenticated && user ? 'Begin Graded Test' : 'Sign In for Assessment')}
              </button>
            </div>
          </GemCard>
        </div>

        {/* Authentication Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <GemCard className="max-w-md w-full">
              <div className="text-center p-6">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-purple-600 mx-auto" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Feature</h3>
                <p className="text-gray-600 mb-6">
                  You need a paid LanguageGems account to access TEST mode with official scoring, Gems/XP rewards, and progress tracking.
                </p>
                
                <div className="space-y-3">
                  <Link
                    href="/auth/login"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors block text-center"
                  >
                    Sign In / Sign Up
                  </Link>
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Go Back to Practice
                  </button>
                </div>
              </div>
            </GemCard>
          </div>
        )}
      </div>
    </div>
  );
}
