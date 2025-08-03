'use client';

// Add export config to skip static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useState } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { Brain, BarChart3, Users, Gamepad2 } from 'lucide-react';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import ProactiveAIDashboard from '../../../components/dashboard/ProactiveAIDashboard';
import InteractiveStudentOverview from '../../../components/dashboard/InteractiveStudentOverview';
import DetailedReportsAnalytics from '../../../components/dashboard/DetailedReportsAnalytics';
import GamificationAnalytics from '../../../components/dashboard/GamificationAnalytics';

export default function ProgressPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<'insights' | 'students' | 'reports' | 'gamification'>('insights');

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center p-12 bg-white rounded-3xl shadow-2xl max-w-md">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-3xl flex items-center justify-center mb-6">
            <Users className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Authentication Required</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">Please log in to access the analytics dashboard.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader
          title="AI-Powered Analytics Dashboard"
          description="Comprehensive insights, student performance tracking, and gamification analytics"
          icon={<Brain className="h-5 w-5 text-white" />}
        />

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'insights', label: 'AI Insights', icon: Brain, description: 'Real-time AI notifications and predictive alerts' },
                { key: 'students', label: 'Student Performance', icon: Users, description: 'Interactive student progress tracking' },
                { key: 'reports', label: 'Detailed Reports', icon: BarChart3, description: 'Assignment and vocabulary analytics' },
                { key: 'gamification', label: 'Gamification', icon: Gamepad2, description: 'XP progression and achievement tracking' }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveSection(tab.key as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeSection === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    title={tab.description}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-8">
          {activeSection === 'insights' && <ProactiveAIDashboard teacherId={user.id} />}
          {activeSection === 'students' && <InteractiveStudentOverview />}
          {activeSection === 'reports' && <DetailedReportsAnalytics />}
          {activeSection === 'gamification' && <GamificationAnalytics />}
        </div>
      </div>
    </div>
  );
}
