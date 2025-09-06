'use client';

import React from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Settings,
  TrendingUp,
  Award,
  Calendar,
  FileText
} from 'lucide-react';
import FeatureWrapper from './FeatureWrapper';
import BetaBanner from './BetaBanner';
import { useFeatureFlags } from '../../lib/feature-flags';

interface BetaDashboardWrapperProps {
  children: React.ReactNode;
  showBetaBanner?: boolean;
}

/**
 * Wrapper for dashboard pages that adds beta messaging and feature flags
 */
export default function BetaDashboardWrapper({ 
  children, 
  showBetaBanner = true 
}: BetaDashboardWrapperProps) {
  const { isBetaLaunch } = useFeatureFlags();

  if (!isBetaLaunch) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Beta Banner */}
      {showBetaBanner && <BetaBanner variant="inline" dismissible={true} />}
      
      {/* Main Content */}
      {children}
    </div>
  );
}

/**
 * Coming Soon cards for specific dashboard features
 */
export const DashboardComingSoonCards = {
  AdvancedAnalytics: () => (
    <FeatureWrapper
      feature="advancedAnalytics"
      comingSoonProps={{
        title: "Advanced Analytics Dashboard",
        description: "Get deep insights into student performance with AI-powered analytics, predictive modeling, and comprehensive reporting.",
        features: [
          "Real-time performance tracking",
          "AI-powered learning insights",
          "Predictive student outcomes",
          "Custom report generation",
          "Class comparison analytics",
          "Individual student deep-dive reports"
        ],
        estimatedLaunch: "Q2 2025",
        priority: "high"
      }}
      className="col-span-full"
    >
      <div>Advanced Analytics Content</div>
    </FeatureWrapper>
  ),

  AssignmentManagement: () => (
    <FeatureWrapper
      feature="assignmentManagement"
      comingSoonProps={{
        title: "Advanced Assignment Management",
        description: "Streamline your workflow with intelligent assignment creation, automated grading, and comprehensive progress tracking.",
        features: [
          "Smart assignment templates",
          "Automated progress tracking",
          "Bulk assignment creation",
          "Advanced scheduling options",
          "Custom rubric creation",
          "Automated reminder system"
        ],
        estimatedLaunch: "Q2 2025",
        priority: "high"
      }}
      className="col-span-full lg:col-span-6"
    >
      <div>Assignment Management Content</div>
    </FeatureWrapper>
  ),

  ClassManagement: () => (
    <FeatureWrapper
      feature="classManagement"
      comingSoonProps={{
        title: "Enhanced Class Management",
        description: "Manage your classes with advanced tools for student organization, group management, and collaborative features.",
        features: [
          "Advanced student grouping",
          "Class performance dashboards",
          "Parent communication tools",
          "Attendance tracking",
          "Behavior management",
          "Class collaboration features"
        ],
        estimatedLaunch: "Q3 2025",
        priority: "medium"
      }}
      className="col-span-full lg:col-span-6"
    >
      <div>Class Management Content</div>
    </FeatureWrapper>
  ),

  ProgressTracking: () => (
    <FeatureWrapper
      feature="progressTracking"
      comingSoonProps={{
        title: "Comprehensive Progress Tracking",
        description: "Track student progress with detailed analytics, learning path visualization, and milestone tracking.",
        features: [
          "Visual learning paths",
          "Milestone achievement tracking",
          "Progress comparison tools",
          "Learning velocity analytics",
          "Skill mastery indicators",
          "Long-term progress trends"
        ],
        estimatedLaunch: "Q2 2025",
        priority: "high"
      }}
      className="col-span-full"
    >
      <div>Progress Tracking Content</div>
    </FeatureWrapper>
  ),

  SubscriptionSystem: () => (
    <FeatureWrapper
      feature="subscriptionSystem"
      comingSoonProps={{
        title: "School Subscription Management",
        description: "Manage your school's subscription with billing controls, user management, and usage analytics.",
        features: [
          "Flexible billing options",
          "User seat management",
          "Usage analytics",
          "Multi-school support",
          "Custom pricing tiers",
          "Automated renewals"
        ],
        estimatedLaunch: "Q3 2025",
        priority: "medium"
      }}
      className="col-span-full lg:col-span-4"
    >
      <div>Subscription Management Content</div>
    </FeatureWrapper>
  ),

  SchoolAdminPanel: () => (
    <FeatureWrapper
      feature="schoolAdminPanel"
      comingSoonProps={{
        title: "School Administrator Panel",
        description: "Comprehensive school-wide management tools for administrators and department heads.",
        features: [
          "School-wide analytics",
          "Teacher management",
          "Department organization",
          "Resource allocation",
          "Performance benchmarking",
          "Compliance reporting"
        ],
        estimatedLaunch: "Q4 2025",
        priority: "low"
      }}
      className="col-span-full"
    >
      <div>School Admin Panel Content</div>
    </FeatureWrapper>
  )
};

/**
 * Quick stats cards that work in beta mode
 */
export const BetaStatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description,
  available = true 
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
  available?: boolean;
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${!available ? 'opacity-60' : ''}`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${available ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <Icon className={`h-6 w-6 ${available ? 'text-blue-600' : 'text-gray-400'}`} />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
          {!available && (
            <p className="text-xs text-orange-600 mt-1 font-medium">Coming in full launch</p>
          )}
        </div>
      </div>
    </div>
  );
};
