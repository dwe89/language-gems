'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, AlertTriangle, TrendingUp, Users, Target, Zap,
  Bell, CheckCircle, X, ExternalLink, Clock, Star,
  BookOpen, MessageSquare, Settings, RefreshCw,
  AlertCircle, Info, ChevronRight, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { AIInsightsService, AIInsight } from '../../services/aiInsightsService';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface WeaknessHotspot {
  area: string;
  type: 'vocabulary' | 'grammar' | 'skill' | 'topic';
  affected_students: number;
  severity_score: number;
  improvement_trend: 'improving' | 'stable' | 'declining';
  color: string;
}

interface ActionableRecommendation {
  id: string;
  title: string;
  description: string;
  action_type: 'create_assignment' | 'send_message' | 'review_topic' | 'schedule_meeting';
  priority: 'high' | 'medium' | 'low';
  estimated_time: string;
  related_insight_id?: string;
}

// =====================================================
// AI INSIGHTS DASHBOARD COMPONENT
// =====================================================

export default function AIInsightsDashboard() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [aiService] = useState(() => new AIInsightsService(supabase));
  
  // State management
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [hotspots, setHotspots] = useState<WeaknessHotspot[]>([]);
  const [recommendations, setRecommendations] = useState<ActionableRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [showDismissed, setShowDismissed] = useState(false);

  // Load data on component mount
  useEffect(() => {
    if (user) {
      loadInsightsData();
      
      // Set up real-time updates every 5 minutes
      const interval = setInterval(() => {
        refreshInsights();
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [user]);

  // =====================================================
  // DATA LOADING FUNCTIONS
  // =====================================================

  const loadInsightsData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const [insightsData, hotspotsData, recommendationsData] = await Promise.all([
        aiService.getActiveInsights(user.id),
        loadWeaknessHotspots(),
        loadActionableRecommendations()
      ]);

      setInsights(insightsData);
      setHotspots(hotspotsData);
      setRecommendations(recommendationsData);
    } catch (error) {
      console.error('Error loading insights data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshInsights = async () => {
    if (!user || refreshing) return;
    
    try {
      setRefreshing(true);
      
      // Generate new insights
      const newInsights = await aiService.generateInsightsForTeacher(user.id);
      setInsights(newInsights);
      
      // Refresh other data
      const [hotspotsData, recommendationsData] = await Promise.all([
        loadWeaknessHotspots(),
        loadActionableRecommendations()
      ]);
      
      setHotspots(hotspotsData);
      setRecommendations(recommendationsData);
    } catch (error) {
      console.error('Error refreshing insights:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const loadWeaknessHotspots = async (): Promise<WeaknessHotspot[]> => {
    // Mock data - replace with actual API call
    return [
      {
        area: 'French Verb Conjugations',
        type: 'grammar',
        affected_students: 8,
        severity_score: 0.75,
        improvement_trend: 'declining',
        color: 'bg-red-500'
      },
      {
        area: 'Spanish Food Vocabulary',
        type: 'vocabulary',
        affected_students: 5,
        severity_score: 0.6,
        improvement_trend: 'stable',
        color: 'bg-orange-500'
      },
      {
        area: 'German Articles',
        type: 'grammar',
        affected_students: 6,
        severity_score: 0.55,
        improvement_trend: 'improving',
        color: 'bg-yellow-500'
      }
    ];
  };

  const loadActionableRecommendations = async (): Promise<ActionableRecommendation[]> => {
    // Mock data - replace with actual API call
    return [
      {
        id: '1',
        title: 'Create Verb Conjugation Practice',
        description: 'Design targeted assignment for students struggling with past tense verbs',
        action_type: 'create_assignment',
        priority: 'high',
        estimated_time: '15 minutes'
      },
      {
        id: '2',
        title: 'Send Encouragement Message',
        description: 'Reach out to Emma Thompson who has been inactive for 3 days',
        action_type: 'send_message',
        priority: 'medium',
        estimated_time: '5 minutes'
      },
      {
        id: '3',
        title: 'Review Food Vocabulary Topic',
        description: 'Class-wide review session recommended for Spanish food terms',
        action_type: 'review_topic',
        priority: 'medium',
        estimated_time: '20 minutes'
      }
    ];
  };

  // =====================================================
  // ACTION HANDLERS
  // =====================================================

  const handleInsightAction = async (insight: AIInsight, action: 'acknowledge' | 'dismiss' | 'resolve') => {
    try {
      switch (action) {
        case 'acknowledge':
          await aiService.acknowledgeInsight(insight.id!);
          break;
        case 'dismiss':
          await aiService.dismissInsight(insight.id!);
          break;
        case 'resolve':
          await aiService.recordAction(insight.id!, 'Manual resolution');
          break;
      }
      
      // Refresh insights
      await loadInsightsData();
    } catch (error) {
      console.error('Error handling insight action:', error);
    }
  };

  const handleRecommendationAction = async (recommendation: ActionableRecommendation) => {
    // Implement action routing based on action_type
    switch (recommendation.action_type) {
      case 'create_assignment':
        window.location.href = '/dashboard/assignments/create';
        break;
      case 'send_message':
        // Open messaging interface
        break;
      case 'review_topic':
        // Navigate to topic review
        break;
      case 'schedule_meeting':
        // Open calendar interface
        break;
    }
  };

  // =====================================================
  // RENDER FUNCTIONS
  // =====================================================

  const renderInsightCard = (insight: AIInsight) => {
    const priorityColors = {
      urgent: 'border-red-500 bg-red-50',
      high: 'border-orange-500 bg-orange-50',
      medium: 'border-yellow-500 bg-yellow-50',
      low: 'border-blue-500 bg-blue-50'
    };

    const priorityIcons = {
      urgent: <AlertTriangle className="h-5 w-5 text-red-600" />,
      high: <AlertCircle className="h-5 w-5 text-orange-600" />,
      medium: <Info className="h-5 w-5 text-yellow-600" />,
      low: <Bell className="h-5 w-5 text-blue-600" />
    };

    return (
      <motion.div
        key={insight.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`p-4 rounded-xl border-2 ${priorityColors[insight.priority]} hover:shadow-lg transition-all duration-200`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {priorityIcons[insight.priority]}
            <span className="font-semibold text-gray-900">{insight.title}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
              {Math.round(insight.confidence_score * 100)}% confident
            </span>
            <button
              onClick={() => handleInsightAction(insight, 'dismiss')}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-3">{insight.description}</p>

        {insight.recommendation && (
          <div className="bg-white p-3 rounded-lg mb-3">
            <p className="text-sm text-gray-800">
              <strong>Recommendation:</strong> {insight.recommendation}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{new Date(insight.generated_at).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleInsightAction(insight, 'acknowledge')}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
            >
              Acknowledge
            </button>
            <button
              onClick={() => setSelectedInsight(insight)}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>View Details</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderWeaknessHotspots = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Target className="h-6 w-6 text-red-500" />
          <h3 className="text-xl font-bold text-gray-900">Weakness Hotspots</h3>
        </div>
        <span className="text-sm text-gray-500">Class-wide challenges</span>
      </div>

      <div className="space-y-4">
        {hotspots.map((hotspot, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${hotspot.color}`}></div>
              <div>
                <h4 className="font-semibold text-gray-900">{hotspot.area}</h4>
                <p className="text-sm text-gray-600">
                  {hotspot.affected_students} students affected • {Math.round(hotspot.severity_score * 100)}% severity
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                hotspot.improvement_trend === 'improving' ? 'bg-green-100 text-green-800' :
                hotspot.improvement_trend === 'declining' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {hotspot.improvement_trend}
              </span>
              <button className="text-blue-600 hover:text-blue-800">
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI-Powered Insights</h2>
            <p className="text-gray-600">Real-time analytics and predictive recommendations</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowDismissed(!showDismissed)}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
          >
            {showDismissed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showDismissed ? 'Hide' : 'Show'} Dismissed</span>
          </button>
          
          <button
            onClick={refreshInsights}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Insights */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Active Insights</h3>
            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {insights.length} active
            </span>
          </div>
          
          <AnimatePresence>
            {insights.length > 0 ? (
              <div className="space-y-4">
                {insights.map(renderInsightCard)}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h4>
                <p className="text-gray-600">No urgent insights at the moment. Great job!</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Weakness Hotspots */}
        <div>
          {renderWeaknessHotspots()}
        </div>
      </div>

      {/* Actionable Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          </div>
          <span className="text-sm text-gray-500">Recommended next steps</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <motion.div
              key={rec.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => handleRecommendationAction(rec)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {rec.priority} priority
                </span>
                <span className="text-xs text-gray-500">{rec.estimated_time}</span>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2">{rec.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600 font-medium">Click to action</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
