'use client';

import React from 'react';
import { useFeatureFlags } from '../../lib/feature-flags';
import ComingSoonOverlay from './ComingSoonOverlay';

interface FeatureWrapperProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  comingSoonProps?: {
    title: string;
    description: string;
    features?: string[];
    estimatedLaunch?: string;
    priority?: 'high' | 'medium' | 'low';
  };
  className?: string;
}

/**
 * Wrapper component that conditionally renders content based on feature flags
 * Shows coming soon overlay for disabled features in beta mode
 */
export default function FeatureWrapper({
  feature,
  children,
  fallback,
  comingSoonProps,
  className = ""
}: FeatureWrapperProps) {
  const { flags, isBetaLaunch } = useFeatureFlags();
  
  // Check if the feature is enabled
  const isEnabled = flags[feature as keyof typeof flags] as boolean;
  
  // If feature is enabled, render children
  if (isEnabled) {
    return <>{children}</>;
  }
  
  // If we have a custom fallback, use it
  if (fallback) {
    return <div className={className}>{fallback}</div>;
  }
  
  // If we're in beta and have coming soon props, show the overlay
  if (isBetaLaunch && comingSoonProps) {
    return (
      <div className={className}>
        <ComingSoonOverlay
          title={comingSoonProps.title}
          description={comingSoonProps.description}
          features={comingSoonProps.features}
          estimatedLaunch={comingSoonProps.estimatedLaunch}
          priority={comingSoonProps.priority}
        />
      </div>
    );
  }
  
  // Default: render nothing
  return null;
}

/**
 * Hook to check if a feature is enabled
 */
export const useFeature = (feature: string) => {
  const { flags } = useFeatureFlags();
  return flags[feature as keyof typeof flags] as boolean;
};

/**
 * Higher-order component for feature flagging
 */
export const withFeatureFlag = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  feature: string,
  fallback?: React.ComponentType<P>
) => {
  return function FeatureFlaggedComponent(props: P) {
    const { flags } = useFeatureFlags();
    const isEnabled = flags[feature as keyof typeof flags] as boolean;
    
    if (isEnabled) {
      return <WrappedComponent {...props} />;
    }
    
    if (fallback) {
      return <fallback {...props} />;
    }
    
    return null;
  };
};
