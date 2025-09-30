'use client';

import { AssignmentAnalysis } from '@/components/dashboard/AssignmentAnalysis';
import { useRouter } from 'next/navigation';

export default function AssignmentAnalysisPage({ params }: { params: { assignmentId: string } }) {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <AssignmentAnalysis
        assignmentId={params.assignmentId}
        onBack={() => router.push('/dashboard/progress')}
      />
    </div>
  );
}
