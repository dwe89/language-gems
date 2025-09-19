'use client';

import React from 'react';
import { useUserAccess } from '@/hooks/useUserAccess';
import { AccessControlConfig } from '@/lib/access-control';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Crown, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface AccessGateProps {
  feature: keyof AccessControlConfig;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

export const AccessGate: React.FC<AccessGateProps> = ({
  feature,
  children,
  fallback,
  showUpgradePrompt = true
}) => {
  const { canAccess, getUpgradeMsg, userType } = useUserAccess();

  if (canAccess(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  return <UpgradePrompt feature={feature} userType={userType} message={getUpgradeMsg(feature)} />;
};

interface UpgradePromptProps {
  feature: keyof AccessControlConfig;
  userType: string;
  message: string;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ feature, userType, message }) => {
  const getUpgradeLink = () => {
    if (userType === 'demo') {
      return '/auth/signup';
    }
    if (userType === 'learner_free') {
      return '/account/upgrade';
    }
    if (userType.startsWith('teacher_')) {
      return '/account/upgrade';
    }
    return '/pricing';
  };

  const getUpgradeAction = () => {
    if (userType === 'demo') {
      return 'Sign Up Free';
    }
    if (userType === 'learner_free') {
      return 'Upgrade to Pro';
    }
    if (userType.startsWith('teacher_')) {
      return 'Upgrade Plan';
    }
    return 'View Pricing';
  };

  const getIcon = () => {
    if (userType === 'demo') {
      return <Zap className="w-6 h-6 text-blue-500" />;
    }
    if (userType === 'learner_free') {
      return <Crown className="w-6 h-6 text-purple-500" />;
    }
    return <Lock className="w-6 h-6 text-orange-500" />;
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {getIcon()}
        </div>
        <CardTitle className="text-xl">Feature Locked</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Link href={getUpgradeLink()}>
          <Button className="w-full" size="lg">
            {getUpgradeAction()}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

// Specific access gates for common features
export const TeacherFeatureGate: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <AccessGate feature="classManagement" fallback={fallback}>
    {children}
  </AccessGate>
);

export const IndividualLoginsGate: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <AccessGate feature="individualStudentLogins" fallback={fallback}>
    {children}
  </AccessGate>
);

export const CustomVocabularyGate: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <AccessGate feature="customVocabularyLists" fallback={fallback}>
    {children}
  </AccessGate>
);

export const HomeworkGate: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <AccessGate feature="homeworkSettingCapability" fallback={fallback}>
    {children}
  </AccessGate>
);

export const AnalyticsGate: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <AccessGate feature="analytics" fallback={fallback}>
    {children}
  </AccessGate>
);

// Game access gate with daily limits
export const GameAccessGate: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  const { canPlayGames, gamesRemaining, dailyLimit, upgradeMessage } = useGameAccess();

  if (canPlayGames) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Lock className="w-6 h-6 text-orange-500" />
        </div>
        <CardTitle className="text-xl">Daily Limit Reached</CardTitle>
        <CardDescription>
          {dailyLimit === -1 
            ? "You have unlimited games!" 
            : `You've played all ${dailyLimit} games for today. ${gamesRemaining} remaining.`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-gray-600 mb-4">{upgradeMessage}</p>
        <Link href="/account/upgrade">
          <Button className="w-full" size="lg">
            Upgrade for Unlimited Games
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

// Import the hook
import { useGameAccess } from '@/hooks/useUserAccess';
