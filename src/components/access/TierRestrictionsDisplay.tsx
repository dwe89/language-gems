'use client';

import React from 'react';
import { useUserAccess } from '@/hooks/useUserAccess';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  BookOpen, 
  ClipboardList, 
  BarChart3, 
  Crown, 
  Zap,
  Lock,
  CheckCircle,
  XCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface TierRestrictionsDisplayProps {
  showUpgradeButton?: boolean;
  compact?: boolean;
}

export const TierRestrictionsDisplay: React.FC<TierRestrictionsDisplayProps> = ({
  showUpgradeButton = true,
  compact = false
}) => {
  const { userType, accessConfig, subscriptionStatus, subscriptionTier } = useUserAccess();

  const getTierInfo = () => {
    switch (userType) {
      case 'demo':
        return {
          name: 'Demo Mode',
          description: 'Limited access to explore LanguageGems',
          color: 'bg-blue-100 text-blue-800',
          icon: <Zap className="w-4 h-4" />
        };
      case 'learner_free':
        return {
          name: 'Free Learner',
          description: 'Basic access with daily limits',
          color: 'bg-green-100 text-green-800',
          icon: <BookOpen className="w-4 h-4" />
        };
      case 'learner_pro':
        return {
          name: 'Pro Learner',
          description: 'Unlimited access to all learner features',
          color: 'bg-purple-100 text-purple-800',
          icon: <Crown className="w-4 h-4" />
        };
      case 'teacher_basic':
        return {
          name: 'Basic Plan',
          description: '£399/year - Classroom-wide access',
          color: 'bg-orange-100 text-orange-800',
          icon: <Users className="w-4 h-4" />
        };
      case 'teacher_standard':
        return {
          name: 'Standard Plan',
          description: '£799/year - Individual student tracking',
          color: 'bg-indigo-100 text-indigo-800',
          icon: <BarChart3 className="w-4 h-4" />
        };
      case 'teacher_large':
        return {
          name: 'Large School Plan',
          description: '£1199/year - Unlimited students',
          color: 'bg-emerald-100 text-emerald-800',
          icon: <Crown className="w-4 h-4" />
        };
      default:
        return {
          name: 'Unknown',
          description: 'Contact support',
          color: 'bg-gray-100 text-gray-800',
          icon: <Lock className="w-4 h-4" />
        };
    }
  };

  const tierInfo = getTierInfo();

  const features = [
    {
      key: 'gamesAccess',
      label: 'Games Access',
      icon: <BookOpen className="w-4 h-4" />,
      getValue: () => accessConfig.maxGamesPerDay === -1 ? 'Unlimited' : `${accessConfig.maxGamesPerDay}/day`
    },
    {
      key: 'individualStudentLogins',
      label: 'Individual Student Logins',
      icon: <Users className="w-4 h-4" />,
      getValue: () => accessConfig.individualStudentLogins ? 'Included' : 'Not Included'
    },
    {
      key: 'customVocabularyLists',
      label: 'Custom Vocabulary Lists',
      icon: <ClipboardList className="w-4 h-4" />,
      getValue: () => accessConfig.customVocabularyLists ? 'Included' : 'Not Included'
    },
    {
      key: 'homeworkSettingCapability',
      label: 'Homework Setting',
      icon: <ClipboardList className="w-4 h-4" />,
      getValue: () => accessConfig.homeworkSettingCapability ? 'Included' : 'Not Included'
    },
    {
      key: 'analytics',
      label: 'Progress Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      getValue: () => accessConfig.analytics ? 'Included' : 'Not Included'
    }
  ];

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className={tierInfo.color}>
            {tierInfo.icon}
            <span className="ml-1">{tierInfo.name}</span>
          </Badge>
          <span className="text-sm text-gray-600">{tierInfo.description}</span>
        </div>
        {showUpgradeButton && (userType === 'demo' || userType === 'learner_free' || userType === 'teacher_basic') && (
          <Link href="/account/upgrade">
            <Button size="sm" variant="outline">
              Upgrade
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge className={tierInfo.color}>
              {tierInfo.icon}
              <span className="ml-1">{tierInfo.name}</span>
            </Badge>
            {subscriptionStatus && (
              <Badge variant="outline">
                Status: {subscriptionStatus}
              </Badge>
            )}
          </div>
          {showUpgradeButton && (userType === 'demo' || userType === 'learner_free' || userType === 'teacher_basic') && (
            <Link href="/account/upgrade">
              <Button size="sm">
                Upgrade
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
        <CardTitle className="text-lg">{tierInfo.name}</CardTitle>
        <CardDescription>{tierInfo.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {features.map((feature) => {
            const hasAccess = accessConfig[feature.key as keyof typeof accessConfig];
            const value = feature.getValue();
            
            return (
              <div key={feature.key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-2">
                  {feature.icon}
                  <span className="text-sm font-medium">{feature.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{value}</span>
                  {hasAccess ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Student/Teacher Limits */}
        {(userType.startsWith('teacher_') || userType === 'learner_pro') && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Limits</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {accessConfig.maxStudents !== 0 && (
                <div>
                  <span className="text-gray-600">Max Students:</span>
                  <span className="ml-2 font-medium">
                    {accessConfig.maxStudents === -1 ? 'Unlimited' : accessConfig.maxStudents}
                  </span>
                </div>
              )}
              {accessConfig.maxTeachers !== 0 && (
                <div>
                  <span className="text-gray-600">Max Teachers:</span>
                  <span className="ml-2 font-medium">
                    {accessConfig.maxTeachers === -1 ? 'Unlimited' : accessConfig.maxTeachers}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Demo/Free Tier Upgrade Prompt */}
        {(userType === 'demo' || userType === 'learner_free') && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                {userType === 'demo' 
                  ? 'Create a free account to unlock more features!'
                  : 'Upgrade to Pro for unlimited access to all features!'
                }
              </p>
              <Link href={userType === 'demo' ? '/auth/signup' : '/account/upgrade'}>
                <Button className="w-full">
                  {userType === 'demo' ? 'Sign Up Free' : 'Upgrade to Pro'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
