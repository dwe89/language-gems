'use client';

import { TeacherAssignmentDashboard } from '@/components/dashboard/TeacherAssignmentDashboard';
import { useRouter } from 'next/navigation';

export default function AssignmentAnalysisPage({ params }: { params: { assignmentId: string } }) {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <TeacherAssignmentDashboard
        assignmentId={params.assignmentId}
        onBack={() => router.push('/dashboard/assignments')}
      />
    </div>
  );
}
