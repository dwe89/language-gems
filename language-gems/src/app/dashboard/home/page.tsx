'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import { BookOpen, Users, Award, ArrowRight, Calendar, Clock } from 'lucide-react';

// Define types for our data
type UserStats = {
  words_learned: number;
  lists_completed: number;
  current_streak: number;
  classes_joined: number;
  recent_activity: Activity[];
};

type Activity = {
  id: string;
  type: 'quiz_completed' | 'list_assigned' | 'list_completed' | 'class_joined';
  title: string;
  date: string;
  score?: number;
  list_id?: string;
  class_id?: string;
};

type WordList = {
  id: string;
  name: string;
  description: string;
  word_count: number;
  assigned_by: string;
  assigned_date: string;
  due_date?: string;
  progress?: number;
};

export default function DashboardHomePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    words_learned: 0,
    lists_completed: 0,
    current_streak: 0,
    classes_joined: 0,
    recent_activity: []
  });
  const [assignedLists, setAssignedLists] = useState<WordList[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;

      try {
        setLoading(true);
        
        // For demo purposes, using mock data
        // In a real app, we would fetch this data from Supabase
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setStats({
          words_learned: 187,
          lists_completed: 12,
          current_streak: 5,
          classes_joined: 3,
          recent_activity: [
            {
              id: '1',
              type: 'quiz_completed',
              title: 'Weekly Vocabulary Quiz',
              date: '2023-11-05T10:30:00Z',
              score: 92
            },
            {
              id: '2',
              type: 'list_assigned',
              title: 'Essential Verbs - Beginner Level',
              date: '2023-11-03T14:20:00Z',
              list_id: 'list-123'
            },
            {
              id: '3',
              type: 'class_joined',
              title: 'Beginner English A1',
              date: '2023-11-01T09:15:00Z',
              class_id: 'class-456'
            },
            {
              id: '4',
              type: 'list_completed',
              title: 'Common Phrases and Idioms',
              date: '2023-10-29T16:45:00Z',
              list_id: 'list-789'
            }
          ]
        });
        
        setAssignedLists([
          {
            id: 'list-123',
            name: 'Essential Verbs - Beginner Level',
            description: 'A collection of the most common verbs for beginner English learners',
            word_count: 20,
            assigned_by: 'Teacher Smith',
            assigned_date: '2023-11-03T14:20:00Z',
            due_date: '2023-11-15T23:59:59Z',
            progress: 45
          },
          {
            id: 'list-456',
            name: 'Food and Cooking Vocabulary',
            description: 'Learn common words related to food, ingredients, and cooking',
            word_count: 30,
            assigned_by: 'Teacher Johnson',
            assigned_date: '2023-10-28T11:10:00Z',
            due_date: '2023-11-10T23:59:59Z',
            progress: 70
          },
          {
            id: 'list-789',
            name: 'Technology Terms',
            description: 'Modern vocabulary related to computers, mobile devices, and the internet',
            word_count: 25,
            assigned_by: 'Teacher Davis',
            assigned_date: '2023-10-20T09:30:00Z',
            due_date: '2023-11-08T23:59:59Z',
            progress: 90
          }
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calculateDaysLeft = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'quiz_completed':
        return <Award className="text-yellow-400" />;
      case 'list_assigned':
        return <BookOpen className="text-blue-400" />;
      case 'list_completed':
        return <Award className="text-green-400" />;
      case 'class_joined':
        return <Users className="text-purple-400" />;
      default:
        return <Clock className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-300">Track your learning progress and recent activities</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-900/60 to-indigo-800/60 backdrop-blur-sm rounded-lg p-6 flex flex-col">
          <div className="flex items-center mb-3">
            <BookOpen className="h-6 w-6 text-cyan-400 mr-2" />
            <h3 className="text-lg font-medium text-white">Words Learned</h3>
          </div>
          <div className="mt-auto">
            <p className="text-3xl font-bold text-white">{stats.words_learned}</p>
            <p className="text-sm text-gray-300">{stats.lists_completed} lists completed</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-900/60 to-indigo-800/60 backdrop-blur-sm rounded-lg p-6 flex flex-col">
          <div className="flex items-center mb-3">
            <Award className="h-6 w-6 text-yellow-400 mr-2" />
            <h3 className="text-lg font-medium text-white">Current Streak</h3>
          </div>
          <div className="mt-auto">
            <p className="text-3xl font-bold text-white">{stats.current_streak} days</p>
            <p className="text-sm text-gray-300">Keep it going!</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-900/60 to-indigo-800/60 backdrop-blur-sm rounded-lg p-6 flex flex-col">
          <div className="flex items-center mb-3">
            <Users className="h-6 w-6 text-purple-400 mr-2" />
            <h3 className="text-lg font-medium text-white">Classes Joined</h3>
          </div>
          <div className="mt-auto">
            <p className="text-3xl font-bold text-white">{stats.classes_joined}</p>
            <p className="text-sm text-gray-300">Active enrollments</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-900/60 to-indigo-800/60 backdrop-blur-sm rounded-lg p-6 flex flex-col">
          <div className="flex items-center mb-3">
            <Calendar className="h-6 w-6 text-green-400 mr-2" />
            <h3 className="text-lg font-medium text-white">Next Session</h3>
          </div>
          <div className="mt-auto">
            <p className="text-3xl font-bold text-white">Tomorrow</p>
            <p className="text-sm text-gray-300">9:00 AM - Beginner English</p>
          </div>
        </div>
      </div>
      
      {/* Assigned Word Lists */}
      <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Assigned Word Lists</h2>
          <Link 
            href="/dashboard/vocabulary" 
            className="flex items-center text-cyan-400 hover:text-cyan-300 text-sm font-medium"
          >
            View all 
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {assignedLists.map(list => (
            <div key={list.id} className="bg-indigo-800/30 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-medium text-white">{list.name}</h3>
                  <p className="text-sm text-gray-300 mb-2">{list.description}</p>
                  <div className="flex items-center text-xs text-gray-400">
                    <span>Assigned by {list.assigned_by} • {formatDate(list.assigned_date)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-gray-300">
                    <span className={calculateDaysLeft(list.due_date!) <= 3 ? 'text-red-400' : 'text-green-400'}>
                      {calculateDaysLeft(list.due_date!)} days left
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{list.word_count} words</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-300">{list.progress}% complete</span>
                  <Link 
                    href={`/dashboard/vocabulary/${list.id}`}
                    className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    Continue
                  </Link>
                </div>
                <div className="w-full bg-indigo-950/50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" 
                    style={{ width: `${list.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
        
        <div className="space-y-4">
          {stats.recent_activity.map(activity => (
            <div key={activity.id} className="flex items-start">
              <div className="bg-indigo-800/40 rounded-full p-2 mr-4">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="text-white font-medium">{activity.title}</h3>
                  <span className="text-xs text-gray-400">{formatDate(activity.date)}</span>
                </div>
                
                <p className="text-gray-300 text-sm mt-1">
                  {activity.type === 'quiz_completed' && `You scored ${activity.score}% on this quiz`}
                  {activity.type === 'list_assigned' && 'New vocabulary list assigned to you'}
                  {activity.type === 'list_completed' && 'You completed this vocabulary list'}
                  {activity.type === 'class_joined' && 'You joined a new class'}
                </p>
                
                {(activity.list_id || activity.class_id) && (
                  <Link
                    href={activity.list_id ? `/dashboard/vocabulary/${activity.list_id}` : `/dashboard/classes/${activity.class_id}`}
                    className="text-xs font-medium text-cyan-400 hover:text-cyan-300 mt-2 inline-block"
                  >
                    View details
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 