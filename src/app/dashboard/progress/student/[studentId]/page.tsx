'use client';

import { StudentDrillDown } from '@/components/dashboard/StudentDrillDown';
import { useRouter } from 'next/navigation';

export default function StudentProfilePage({ params }: { params: { studentId: string } }) {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <StudentDrillDown
        studentId={params.studentId}
        onBack={() => router.push('/dashboard/progress')}
      />
    </div>
  );
}
