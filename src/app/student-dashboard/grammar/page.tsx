'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { GrammarAnalyticsService, GrammarInsights } from '../../../services/analytics/GrammarAnalyticsService';
import { 
  BookOpen, 
  TrendingUp, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Zap,
  Award,
  Brain,
  Lightbulb
} from 'lucide-react';

interface GrammarScoreCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  color: string;
  isLoading?: boolean;
}

function GrammarScoreCard({ title, value, subtitle, icon: Icon, color, isLoading }: GrammarScoreCardProps) {
  return (
    <div className={`${color} text-white rounded-xl p-6 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold">
            {isLoading ? '...' : value}
          </p>
          {subtitle && (
            <p className="text-sm opacity-70 mt-1">{subtitle}</p>
          )}
        </div>
        <Icon className="h-8 w-8 opacity-80" />
      </div>
    </div>
  );
}

interface ConjugationMatrixProps {
  matrixData: Array<{
    tense: string;
    person: string;
    accuracyPercentage: number;
    totalAttempts: number;
    needsPractice: boolean;
  }>;
  isLoading: boolean;
}

interface ConjugationMatrixProps {
  matrixData: Array<{
    tense: string;
    person: string;
    accuracyPercentage: number;
    totalAttempts: number;
    needsPractice: boolean;
  }>;
  isLoading: boolean;
  language: string;
}

function ConjugationMatrix({ matrixData, isLoading, language }: ConjugationMatrixProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conjugation Matrix</h3>
        <div className="animate-pulse">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 42 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Get unique tenses and persons
  const tenses = [...new Set(matrixData.map(d => d.tense))].sort();

  // Language-specific pronouns
  const getPersonsForLanguage = (lang: string) => {
    switch (lang) {
      case 'es':
        return ['yo', 'tú', 'él/ella', 'nosotros', 'vosotros', 'ellos/ellas'];
      case 'fr':
        return ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];
      case 'de':
        return ['ich', 'du', 'er/sie', 'wir', 'ihr', 'sie'];
      default:
        return ['yo', 'tú', 'él/ella', 'nosotros', 'vosotros', 'ellos/ellas'];
    }
  };

  const persons = getPersonsForLanguage(language);

  const getMatrixCell = (tense: string, person: string) => {
    return matrixData.find(d => d.tense === tense && d.person === person);
  };

  const getColorClass = (accuracy: number, attempts: number) => {
    if (attempts === 0) return 'bg-gray-100 text-gray-400';
    if (accuracy >= 90) return 'bg-green-500 text-white';
    if (accuracy >= 80) return 'bg-green-400 text-white';
    if (accuracy >= 70) return 'bg-yellow-400 text-white';
    if (accuracy >= 60) return 'bg-orange-400 text-white';
    return 'bg-red-400 text-white';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Conjugation Matrix</h3>
      <p className="text-sm text-gray-600 mb-4">
        Your performance across different tenses and pronouns. Green = strong, Red = needs practice.
      </p>
      
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 min-w-max">
          {/* Header row */}
          <div className="font-semibold text-sm text-gray-700 p-2"></div>
          {persons.map(person => (
            <div key={person} className="font-semibold text-sm text-gray-700 p-2 text-center">
              {person}
            </div>
          ))}
          
          {/* Data rows */}
          {tenses.map(tense => (
            <React.Fragment key={tense}>
              <div className="font-semibold text-sm text-gray-700 p-2 capitalize">
                {tense}
              </div>
              {persons.map(person => {
                const cell = getMatrixCell(tense, person);
                const accuracy = cell?.accuracyPercentage || 0;
                const attempts = cell?.totalAttempts || 0;
                
                return (
                  <div
                    key={`${tense}-${person}`}
                    className={`p-2 rounded text-center text-sm font-medium ${getColorClass(accuracy, attempts)}`}
                    title={`${tense} - ${person}: ${accuracy}% (${attempts} attempts)`}
                  >
                    {attempts > 0 ? `${accuracy}%` : '-'}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

interface PerformanceBreakdownProps {
  tensePerformance: Array<{
    tense: string;
    accuracyPercentage: number;
    totalAttempts: number;
  }>;
  verbTypePerformance: Array<{
    verbType: string;
    accuracyPercentage: number;
    totalAttempts: number;
  }>;
  isLoading: boolean;
}

function PerformanceBreakdown({ tensePerformance, verbTypePerformance, isLoading }: PerformanceBreakdownProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getPerformanceColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tense Performance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-500" />
          Tense Performance
        </h3>
        <div className="space-y-3">
          {tensePerformance.slice(0, 5).map(tense => (
            <div key={tense.tense} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {tense.tense}
              </span>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-semibold ${getPerformanceColor(tense.accuracyPercentage)}`}>
                  {tense.accuracyPercentage}%
                </span>
                <span className="text-xs text-gray-500">
                  ({tense.totalAttempts} attempts)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verb Type Performance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-purple-500" />
          Verb Type Performance
        </h3>
        <div className="space-y-3">
          {verbTypePerformance.map(verbType => (
            <div key={verbType.verbType} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {verbType.verbType.replace('_', '-')} verbs
              </span>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-semibold ${getPerformanceColor(verbType.accuracyPercentage)}`}>
                  {verbType.accuracyPercentage}%
                </span>
                <span className="text-xs text-gray-500">
                  ({verbType.totalAttempts} attempts)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GrammarDashboard() {
  const { user } = useAuth();
  const [grammarData, setGrammarData] = useState<GrammarInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('es');

  useEffect(() => {
    if (user?.id) {
      loadGrammarData();
    }
  }, [user?.id, selectedLanguage]);

  const loadGrammarData = async () => {
    try {
      setLoading(true);
      const analyticsService = new GrammarAnalyticsService();
      const data = await analyticsService.getStudentGrammarAnalytics(user!.id, selectedLanguage);
      setGrammarData(data);
    } catch (error) {
      console.error('Error loading grammar data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Please log in to view your grammar progress</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Brain className="h-8 w-8 mr-3 text-purple-600" />
                Grammar Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Track your conjugation mastery and grammar skills
              </p>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Language:</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grammar Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GrammarScoreCard
            title="Grammar Score"
            value={grammarData?.overview.accuracyPercentage || 0}
            subtitle={`${grammarData?.overview.totalAttempts || 0} total attempts`}
            icon={Award}
            color="bg-gradient-to-r from-purple-500 to-indigo-600"
            isLoading={loading}
          />
          <GrammarScoreCard
            title="Grammar Gems"
            value={grammarData?.gemsAnalytics.totalGrammarGems || 0}
            subtitle={`${grammarData?.gemsAnalytics.grammarGemsToday || 0} today`}
            icon={Zap}
            color="bg-gradient-to-r from-yellow-500 to-orange-500"
            isLoading={loading}
          />
          <GrammarScoreCard
            title="Grammar XP"
            value={grammarData?.gemsAnalytics.totalGrammarXP || 0}
            subtitle={`${grammarData?.gemsAnalytics.grammarXPToday || 0} today`}
            icon={TrendingUp}
            color="bg-gradient-to-r from-green-500 to-emerald-600"
            isLoading={loading}
          />
          <GrammarScoreCard
            title="Avg Response"
            value={grammarData?.overview.avgResponseTime ? `${Math.round(grammarData.overview.avgResponseTime / 1000)}s` : '0s'}
            subtitle="Response time"
            icon={Clock}
            color="bg-gradient-to-r from-blue-500 to-cyan-600"
            isLoading={loading}
          />
        </div>

        {/* Conjugation Matrix */}
        <div className="mb-8">
          <ConjugationMatrix
            matrixData={grammarData?.conjugationMatrix || []}
            isLoading={loading}
            language={selectedLanguage}
          />
        </div>

        {/* Performance Breakdown */}
        <div className="mb-8">
          <PerformanceBreakdown
            tensePerformance={grammarData?.tensePerformance || []}
            verbTypePerformance={grammarData?.verbTypePerformance || []}
            isLoading={loading}
          />
        </div>

        {/* Weaknesses and Mistakes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Grammar Weaknesses */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              Areas for Improvement
            </h3>
            {loading ? (
              <div className="animate-pulse space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : grammarData?.weaknesses.length ? (
              <div className="space-y-3">
                {grammarData.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-red-800 capitalize">
                        {weakness.areaName.replace('_', ' ')}
                      </span>
                      <p className="text-xs text-red-600">
                        {weakness.accuracyPercentage}% accuracy ({weakness.totalAttempts} attempts)
                      </p>
                    </div>
                    <Target className="h-4 w-4 text-red-500" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-gray-600">Great job! No major weaknesses detected.</p>
              </div>
            )}
          </div>

          {/* Common Mistakes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
              Common Mistakes
            </h3>
            {loading ? (
              <div className="animate-pulse space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : grammarData?.commonMistakes.length ? (
              <div className="space-y-3">
                {grammarData.commonMistakes.slice(0, 5).map((mistake, index) => (
                  <div key={index} className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-orange-800">
                        {mistake.baseVerb} ({mistake.tense})
                      </span>
                      <span className="text-xs text-orange-600">
                        {mistake.mistakeCount}x
                      </span>
                    </div>
                    <p className="text-xs text-orange-700">
                      You wrote "{mistake.commonWrongAnswer}" instead of "{mistake.expectedAnswer}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-gray-600">No recurring mistakes found. Keep it up!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            Personalized Recommendations
          </h3>
          {loading ? (
            <div className="animate-pulse space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : grammarData?.recommendations.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grammarData.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <p className="text-sm text-yellow-800">{recommendation}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Keep practicing to get personalized recommendations!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
