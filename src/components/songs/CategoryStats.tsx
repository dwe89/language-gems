'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Target, Music } from 'lucide-react';
import { useSupabase } from '@/hooks/useSupabase';
import { VOCABULARY_CATEGORIES } from '@/components/games/ModernCategorySelector';
import { GRAMMAR_CATEGORIES } from '@/lib/grammar-categories';

interface CategoryStat {
  theme: string;
  topic: string;
  count: number;
}

interface CategoryStatsProps {
  language: string;
}

export default function CategoryStats({ language }: CategoryStatsProps) {
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabase } = useSupabase();

  useEffect(() => {
    fetchCategoryStats();
  }, [language]);

  const fetchCategoryStats = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('theme, topic')
        .eq('language', language)
        .eq('is_active', true)
        .not('theme', 'is', null)
        .not('topic', 'is', null);
      
      if (error) throw error;

      // Group by theme and topic
      const statsMap = new Map<string, number>();
      data?.forEach(video => {
        const key = `${video.theme}:${video.topic}`;
        statsMap.set(key, (statsMap.get(key) || 0) + 1);
      });

      // Convert to array
      const categoryStats: CategoryStat[] = [];
      statsMap.forEach((count, key) => {
        const [theme, topic] = key.split(':');
        categoryStats.push({ theme, topic, count });
      });

      // Sort by count descending
      categoryStats.sort((a, b) => b.count - a.count);
      
      setStats(categoryStats);
    } catch (error) {
      console.error('Error fetching category stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryDisplayName = (theme: string, topic: string) => {
    if (theme === 'vocabulary') {
      const category = VOCABULARY_CATEGORIES.find(cat => cat.id === topic);
      return category?.displayName || topic.charAt(0).toUpperCase() + topic.slice(1);
    } else if (theme === 'grammar') {
      const category = GRAMMAR_CATEGORIES.find(cat => cat.id === topic);
      return category?.displayName || topic.charAt(0).toUpperCase() + topic.slice(1);
    }
    return topic.charAt(0).toUpperCase() + topic.slice(1);
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'vocabulary':
        return <BookOpen className="w-4 h-4" />;
      case 'grammar':
        return <Target className="w-4 h-4" />;
      default:
        return <Music className="w-4 h-4" />;
    }
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'vocabulary':
        return 'bg-blue-500';
      case 'grammar':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-8 animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (stats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">No categorized videos available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5" />
          Category Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stats.slice(0, 8).map((stat, index) => (
            <motion.div
              key={`${stat.theme}:${stat.topic}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded ${getThemeColor(stat.theme)} text-white`}>
                  {getThemeIcon(stat.theme)}
                </div>
                <span className="text-sm font-medium">
                  {getCategoryDisplayName(stat.theme, stat.topic)}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {stat.count}
              </Badge>
            </motion.div>
          ))}
          
          {stats.length > 8 && (
            <div className="text-xs text-gray-500 text-center pt-2 border-t">
              +{stats.length - 8} more categories
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
