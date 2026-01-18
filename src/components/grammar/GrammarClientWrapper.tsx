'use client';

import { useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';
import GrammarSkillWrapper from './GrammarSkillWrapper';

interface GrammarClientWrapperProps {
  children: ReactNode;
  topicId: string;
  topicTitle: string;
  language: string;
  category: string;
  topic: string;
}

export default function GrammarClientWrapper({
  children,
  topicId,
  topicTitle,
  language,
  category,
  topic,
}: GrammarClientWrapperProps) {
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get('assignment');
  const activityId = searchParams.get('activityId');

  // If we're in assignment mode, wrap with GrammarSkillWrapper
  if (assignmentId) {
    return (
      <GrammarSkillWrapper
        assignmentId={assignmentId}
        activityId={activityId || ''}
        topicId={topicId}
        topicTitle={topicTitle}
        language={language}
        category={category}
        topic={topic}
        currentStep="lesson"
      >
        {children}
      </GrammarSkillWrapper>
    );
  }

  // Otherwise, render children directly
  return <>{children}</>;
}
