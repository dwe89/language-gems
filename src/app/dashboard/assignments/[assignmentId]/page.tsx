'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Play, Users, Calendar, Target, BookOpen, Clock, Award, Settings, BarChart3 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

interface Assignment {
  id: string;
  title: string;
  description?: string;
  game_type: string;
  game_config: any;
  due_date?: string;
  points: number;
  status: string;
}

export default function AssignmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const assignmentId = params?.assignmentId as string;

  useEffect(() => {
    if (assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAssignment(data.assignment);
      } else {
        setError('Failed to load assignment details');
      }
    } catch (err) {
      setError('Error loading assignment');
      console.error('Assignment fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = () => {
    if (assignment) {
      // Navigate to the game with assignment parameters
      const gameUrl = `/games/${assignment.game_type === 'speed-builder' ? 'speed-builder' : assignment.game_type}?assignment=${assignmentId}&mode=assignment`;
      router.push(gameUrl);
    }
  };

  const handleViewAnalytics = () => {
    router.push(`/dashboard/assignments/${assignmentId}/analytics`);
  };

  const handleEditAssignment = () => {
    router.push(`/dashboard/assignments/${assignmentId}/edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-white text-center">Loading assignment...</div>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold mb-4">Assignment Not Found</h1>
            <p className="mb-4">{error || 'The requested assignment could not be found.'}</p>
            <button
              onClick={() => router.push('/dashboard/assignments')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Back to Assignments
            </button>
          </div>
        </div>
      </div>
    );
  }

  const gameConfig = assignment.game_config || {};
  const formattedDueDate = assignment.due_date 
    ? new Date(assignment.due_date).toLocaleDateString()
    : 'No due date';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/assignments')}
            className="text-blue-300 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back to Assignments
          </button>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{assignment.title}</h1>
                {assignment.description && (
                  <p className="text-blue-200 text-lg">{assignment.description}</p>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleEditAssignment}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Edit
                </button>
                
                <button
                  onClick={handleViewAnalytics}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
              </div>
            </div>

            {/* Assignment Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-semibold">Game Type</span>
                </div>
                <p className="text-blue-200 capitalize">{assignment.game_type?.replace('-', ' ') || 'Unknown'}</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-green-400" />
                  <span className="text-white font-semibold">Due Date</span>
                </div>
                <p className="text-blue-200">{formattedDueDate}</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold">Points</span>
                </div>
                <p className="text-blue-200">{assignment.points} points</p>
              </div>
            </div>

            {/* Game Configuration */}
            {Object.keys(gameConfig).length > 0 && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Game Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gameConfig.theme && (
                    <div>
                      <span className="text-blue-300 font-medium">Theme:</span>
                      <span className="text-white ml-2">{gameConfig.theme}</span>
                    </div>
                  )}
                  {gameConfig.topic && (
                    <div>
                      <span className="text-blue-300 font-medium">Topic:</span>
                      <span className="text-white ml-2">{gameConfig.topic}</span>
                    </div>
                  )}
                  {gameConfig.difficulty && (
                    <div>
                      <span className="text-blue-300 font-medium">Difficulty:</span>
                      <span className="text-white ml-2 capitalize">{gameConfig.difficulty}</span>
                    </div>
                  )}
                  {gameConfig.timeLimit && (
                    <div>
                      <span className="text-blue-300 font-medium">Time Limit:</span>
                      <span className="text-white ml-2">{Math.floor(gameConfig.timeLimit / 60)} minutes</span>
                    </div>
                  )}
                  {gameConfig.sentenceCount && (
                    <div>
                      <span className="text-blue-300 font-medium">Sentences:</span>
                      <span className="text-white ml-2">{gameConfig.sentenceCount}</span>
                    </div>
                  )}
                  {gameConfig.tier && (
                    <div>
                      <span className="text-blue-300 font-medium">Tier:</span>
                      <span className="text-white ml-2">{gameConfig.tier}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handlePlayGame}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg"
              >
                <Play className="w-6 h-6" />
                Play Assignment
              </button>
              
              <button
                onClick={() => {/* TODO: Add share functionality */}}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all border border-white/20"
              >
                <Users className="w-5 h-5" />
                Share with Students
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 