'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import WordTowersAssignmentWrapper from '../../components/WordTowersAssignmentWrapper';

export default function WordTowersAssignmentPage() {
  const params = useParams();
  const assignmentId = params?.assignmentId as string;

  if (!assignmentId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid Assignment</h2>
          <p className="text-gray-300">Assignment ID not found.</p>
        </div>
      </div>
    );
  }

  return <WordTowersAssignmentWrapper assignmentId={assignmentId} />;
}
