'use client';

import React from 'react';
import ComingSoonWrapper from '../beta/ComingSoonWrapper';

interface AssessmentsPageWrapperProps {
  children: React.ReactNode;
}

const AssessmentsPageWrapper: React.FC<AssessmentsPageWrapperProps> = ({ children }) => {
  return (
    <ComingSoonWrapper feature="assessments">
      {children}
    </ComingSoonWrapper>
  );
};

export default AssessmentsPageWrapper;
