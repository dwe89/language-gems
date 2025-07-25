'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Users, School, Medal, Crown, Star, TrendingUp, Filter } from 'lucide-react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../../components/auth/AuthProvider';
import CrossGameLeaderboard from '../../../components/leaderboards/CrossGameLeaderboard';

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank: number;
  isCurrentUser: boolean;
  avatar?: string;
  totalGamesPlayed?: number;
  averageAccuracy?: number;
}

interface ClassInfo {
  id: string;
  name: string;
  school_id: string;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'class' | 'school'>('class');
  const [timePeriod, setTimePeriod] = useState<'weekly' | 'monthly' | 'all_time'>('weekly');
  const [classInfo, setClassInfo] = useState<ClassInfo[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [schoolId, setSchoolId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserClasses = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Get student's class enrollments
        const { data: enrollments, error: enrollmentError } = await supabaseBrowser
          .from('class_enrollments')
          .select(`
            class_id,
            classes!inner(
              id,
              name,
              school_id
            )
          `)
          .eq('student_id', user.id);

        if (enrollmentError) {
          console.error('Error fetching enrollments:', enrollmentError);
          return;
        }

        const classes = enrollments?.map(enrollment => ({
          id: enrollment.classes.id,
          name: enrollment.classes.name,
          school_id: enrollment.classes.school_id
        })) || [];

        setClassInfo(classes);
        
        // Set default selected class and school
        if (classes.length > 0) {
          setSelectedClass(classes[0].id);
          setSchoolId(classes[0].school_id);
        }

      } catch (error) {
        console.error('Error fetching user classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserClasses();
  }, [user]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Star className="h-5 w-5 text-blue-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-400 to-amber-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white">🏆 Leaderboards</h1>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Trophy className="h-8 w-8 mr-3 text-yellow-400" />
            Leaderboards
          </h1>
          <p className="text-indigo-100 mt-2">See how you rank against your classmates and school</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Tab Buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('class')}
              className={`flex items-center px-4 py-2 rounded-md font-medium text-sm transition-all ${
                activeTab === 'class'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              Class Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('school')}
              className={`flex items-center px-4 py-2 rounded-md font-medium text-sm transition-all ${
                activeTab === 'school'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <School className="h-4 w-4 mr-2" />
              School Leaderboard
            </button>
          </div>

          {/* Time Period Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as 'weekly' | 'monthly' | 'all_time')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="all_time">All Time</option>
            </select>
          </div>

          {/* Class Selector (only for class tab) */}
          {activeTab === 'class' && classInfo.length > 1 && (
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {classInfo.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Leaderboard Content */}
        <div className="min-h-[400px]">
          {activeTab === 'class' ? (
            <div>
              <div className="flex items-center mb-4">
                <Users className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {classInfo.find(c => c.id === selectedClass)?.name || 'Class'} Rankings
                </h2>
              </div>
              <CrossGameLeaderboard
                classId={selectedClass}
                limit={50}
                showFilters={false}
                compact={false}
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-4">
                <School className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">School Rankings</h2>
              </div>
              <CrossGameLeaderboard
                classId={undefined} // No class filter for school-wide
                schoolId={schoolId} // Filter by school
                limit={100}
                showFilters={false}
                compact={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Achievement Highlights */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
          Your Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">-</div>
            <div className="text-sm text-gray-600">Class Rank</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">-</div>
            <div className="text-sm text-gray-600">School Rank</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">-</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
        </div>
      </div>
    </div>
  );
}
