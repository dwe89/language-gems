'use client';

import { ReactNode } from 'react';
import BlogSubscriptionModal from './BlogSubscriptionModal';
import ReadingProgress from './ReadingProgress';

interface BlogPageWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper component for static blog pages
 * Adds subscription modal and reading progress bar
 */
export default function BlogPageWrapper({ children }: BlogPageWrapperProps) {
  return (
    <>
      {/* Subscription Modal - triggers on both exit-intent and 50% scroll */}
      <BlogSubscriptionModal />
      
      {/* Reading Progress Bar */}
      <ReadingProgress />
      
      {/* Blog Content */}
      {children}
    </>
  );
}

