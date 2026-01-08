'use client';

import { useRouter } from 'next/navigation';
import WordScrambleAssignmentWrapper from '../../components/WordScrambleAssignmentWrapper';

interface WordScrambleAssignmentPageProps {
  params: {
    assignmentId: string;
  };
}

export default function WordScrambleAssignmentPage({ params }: WordScrambleAssignmentPageProps) {
  const router = useRouter();

  const handleAssignmentComplete = (result: any) => {
    // Show completion message and redirect
    setTimeout(() => {
      router.push('/student-dashboard/assignments');
    }, 3000);
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

  const handleBackToMenu = () => {
    router.push('/games/word-scramble');
  };

  return (
    <WordScrambleAssignmentWrapper
      assignmentId={params.assignmentId}
      onAssignmentComplete={handleAssignmentComplete}
      onBackToAssignments={handleBackToAssignments}
      onBackToMenu={handleBackToMenu}
    />
  );
}
