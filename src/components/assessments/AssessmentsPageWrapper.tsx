'use client';

import React from 'react';

interface AssessmentsPageWrapperProps {
  children: React.ReactNode;
}

const AssessmentsPageWrapper: React.FC<AssessmentsPageWrapperProps> = ({ children }) => {
  return <>{children}</>;
};

export default AssessmentsPageWrapper;
