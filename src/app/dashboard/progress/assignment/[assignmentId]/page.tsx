'use client';

import { ModernAssignmentDashboard } from '@/components/dashboard/ModernAssignmentDashboard';
import { useRouter } from 'next/navigation';

export default function AssignmentAnalysisPage({ params }: { params: { assignmentId: string } }) {
  const router = useRouter();

  return (
    <ModernAssignmentDashboard
      assignmentId={params.assignmentId}
      onBack={() => router.push('/dashboard/assignments')}
    />
  );
}
