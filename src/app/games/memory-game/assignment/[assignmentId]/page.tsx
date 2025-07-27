'use client';

import { useRouter } from 'next/navigation';
import MemoryGameAssignmentWrapper from '../../components/MemoryGameAssignmentWrapper';

interface MemoryGameAssignmentPageProps {
  params: {
    assignmentId: string;
  };
}

export default function MemoryGameAssignmentPage({ params }: MemoryGameAssignmentPageProps) {
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
    router.push('/games/memory-game');
  };

  return (
    <MemoryGameAssignmentWrapper
      assignmentId={params.assignmentId}
      onAssignmentComplete={handleAssignmentComplete}
      onBackToAssignments={handleBackToAssignments}
      onBackToMenu={handleBackToMenu}
    />
  );
}
