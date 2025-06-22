'use client';

import React, { useState, useEffect } from 'react';
import { 
  GemCollection, 
  TopicPerformance 
} from '../../types/vocabulary-mining';
import { 
  calculateNextReviewInterval,
  getNextReviewText,
  needsReview 
} from '../../utils/vocabulary-mining';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Target,
  BarChart3,
  Filter
} from 'lucide-react';

interface SpacedRepetitionSchedulerProps {
  studentId?: string;
  classId?: string;
  onScheduleUpdate?: (updates: any[]) => void;
}

interface ReviewSchedule {
  today: GemCollection[];
  overdue: GemCollection[];
  upcoming: { date: string; items: GemCollection[] }[];
  totalReviews: number;
}

export function SpacedRepetitionScheduler({
  studentId,
  classId,
  onScheduleUpdate
}: SpacedRepetitionSchedulerProps) {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<ReviewSchedule>({
    today: [],
    overdue: [],
    upcoming: [],
    totalReviews: 0
  });
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'struggling' | 'mastered'>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month'>('week');

  // Mock data for demonstration - in real app, this would come from props or API
  useEffect(() => {
    loadScheduleData();
  }, [studentId, classId, selectedFilter, selectedTimeframe]);

  const loadScheduleData = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockGemCollection: GemCollection[] = [
        {
          id: '1',
          studentId: studentId || 'student1',
          vocabularyItemId: 'vocab1',
          gemLevel: 3,
          masteryLevel: 2,
          totalEncounters: 8,
          correctEncounters: 5,
          incorrectEncounters: 3,
          currentStreak: 2,
          bestStreak: 4,
          lastEncounteredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          nextReviewAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Overdue
          spacedRepetitionInterval: 3,
          spacedRepetitionEaseFactor: 2.3,
          difficultyRating: 3,
          firstLearnedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
        {
          id: '2',
          studentId: studentId || 'student1',
          vocabularyItemId: 'vocab2',
          gemLevel: 5,
          masteryLevel: 4,
          totalEncounters: 15,
          correctEncounters: 13,
          incorrectEncounters: 2,
          currentStreak: 8,
          bestStreak: 8,
          lastEncounteredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          nextReviewAt: new Date(), // Due today
          spacedRepetitionInterval: 7,
          spacedRepetitionEaseFactor: 2.8,
          difficultyRating: 2,
          firstLearnedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        },
        {
          id: '3',
          studentId: studentId || 'student1',
          vocabularyItemId: 'vocab3',
          gemLevel: 2,
          masteryLevel: 1,
          totalEncounters: 4,
          correctEncounters: 1,
          incorrectEncounters: 3,
          currentStreak: 0,
          bestStreak: 1,
          lastEncounteredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          nextReviewAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Due in 2 days
          spacedRepetitionInterval: 1,
          spacedRepetitionEaseFactor: 1.8,
          difficultyRating: 4,
          firstLearnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        }
      ];

      // Filter based on selected criteria
      let filteredGems = mockGemCollection;
      if (selectedFilter === 'struggling') {
        filteredGems = mockGemCollection.filter(gem => gem.masteryLevel < 3);
      } else if (selectedFilter === 'mastered') {
        filteredGems = mockGemCollection.filter(gem => gem.masteryLevel >= 4);
      }

      // Categorize by review status
      const now = new Date();
      const today = filteredGems.filter(gem => 
        gem.nextReviewAt && 
        gem.nextReviewAt.toDateString() === now.toDateString()
      );
      
      const overdue = filteredGems.filter(gem => 
        gem.nextReviewAt && 
        gem.nextReviewAt < now && 
        gem.nextReviewAt.toDateString() !== now.toDateString()
      );

      // Group upcoming reviews by date
      const upcoming: { date: string; items: GemCollection[] }[] = [];
      const upcomingGems = filteredGems.filter(gem => 
        gem.nextReviewAt && gem.nextReviewAt > now
      );

      const groupedByDate = upcomingGems.reduce((acc, gem) => {
        if (!gem.nextReviewAt) return acc;
        const dateKey = gem.nextReviewAt.toDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(gem);
        return acc;
      }, {} as Record<string, GemCollection[]>);

      Object.entries(groupedByDate)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .slice(0, selectedTimeframe === 'week' ? 7 : 30)
        .forEach(([date, items]) => {
          upcoming.push({ date, items });
        });

      setSchedule({
        today,
        overdue,
        upcoming,
        totalReviews: filteredGems.length
      });
      
      setLoading(false);
    }, 1000);
  };

  const handleRescheduleItem = (gemId: string, newDate: Date) => {
    // Update the schedule for a specific item
    console.log(`Rescheduling gem ${gemId} to ${newDate}`);
    if (onScheduleUpdate) {
      onScheduleUpdate([{ gemId, newReviewDate: newDate }]);
    }
  };

  const getUrgencyColor = (gem: GemCollection) => {
    if (!gem.nextReviewAt) return 'text-gray-500';
    
    const now = new Date();
    const daysDiff = Math.ceil((gem.nextReviewAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return 'text-red-600'; // Overdue
    if (daysDiff === 0) return 'text-orange-600'; // Due today
    if (daysDiff <= 2) return 'text-yellow-600'; // Due soon
    return 'text-green-600'; // Future
  };

  const getMasteryBadge = (masteryLevel: number) => {
    const colors = {
      0: 'bg-gray-100 text-gray-800',
      1: 'bg-red-100 text-red-800',
      2: 'bg-orange-100 text-orange-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-green-100 text-green-800',
      5: 'bg-purple-100 text-purple-800'
    };
    
    const labels = {
      0: 'Unknown',
      1: 'Seen',
      2: 'Recognized',
      3: 'Practiced',
      4: 'Mastered',
      5: 'Expert'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[masteryLevel as keyof typeof colors]}`}>
        {labels[masteryLevel as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="w-6 h-6 text-indigo-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Review Schedule</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Filter */}
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'struggling' | 'mastered')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Items</option>
            <option value="struggling">Struggling</option>
            <option value="mastered">Mastered</option>
          </select>
          
          {/* Timeframe */}
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as 'week' | 'month')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="week">Next Week</option>
            <option value="month">Next Month</option>
          </select>
          
          <button
            onClick={loadScheduleData}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{schedule.overdue.length}</div>
          <div className="text-sm text-red-700">Overdue</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{schedule.today.length}</div>
          <div className="text-sm text-orange-700">Due Today</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {schedule.upcoming.reduce((sum, day) => sum + day.items.length, 0)}
          </div>
          <div className="text-sm text-blue-700">Upcoming</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">{schedule.totalReviews}</div>
          <div className="text-sm text-gray-700">Total Items</div>
        </div>
      </div>

      {/* Overdue Items */}
      {schedule.overdue.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-red-700 mb-3 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Overdue Reviews ({schedule.overdue.length})
          </h4>
          <div className="space-y-2">
            {schedule.overdue.map((gem) => (
              <div key={gem.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">L{gem.gemLevel}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Vocabulary Item {gem.vocabularyItemId}</div>
                    <div className="text-sm text-gray-600">
                      Due: {gem.nextReviewAt ? getNextReviewText(gem.nextReviewAt) : 'Unknown'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getMasteryBadge(gem.masteryLevel)}
                  <span className="text-sm text-red-600 font-medium">
                    {Math.round((gem.correctEncounters / gem.totalEncounters) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Reviews */}
      {schedule.today.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-orange-700 mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Due Today ({schedule.today.length})
          </h4>
          <div className="space-y-2">
            {schedule.today.map((gem) => (
              <div key={gem.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">L{gem.gemLevel}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Vocabulary Item {gem.vocabularyItemId}</div>
                    <div className="text-sm text-gray-600">
                      Streak: {gem.currentStreak} • Accuracy: {Math.round((gem.correctEncounters / gem.totalEncounters) * 100)}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getMasteryBadge(gem.masteryLevel)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Reviews */}
      {schedule.upcoming.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-blue-700 mb-3 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Upcoming Reviews
          </h4>
          <div className="space-y-3">
            {schedule.upcoming.map((day) => (
              <div key={day.date} className="border rounded-lg p-3">
                <div className="font-medium text-gray-900 mb-2">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })} ({day.items.length} items)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {day.items.slice(0, 4).map((gem) => (
                    <div key={gem.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Item {gem.vocabularyItemId}</span>
                      <div className="flex items-center space-x-2">
                        {getMasteryBadge(gem.masteryLevel)}
                        <span className="text-gray-500">L{gem.gemLevel}</span>
                      </div>
                    </div>
                  ))}
                  {day.items.length > 4 && (
                    <div className="text-sm text-gray-500 col-span-2">
                      +{day.items.length - 4} more items
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {schedule.totalReviews === 0 && (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">No vocabulary items need review right now.</p>
        </div>
      )}
    </div>
  );
}
